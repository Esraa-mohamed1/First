'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Loader2,
  BookOpen,
  Video,
  HelpCircle,
  Edit2,
  FileText,
  ExternalLink,
  ShieldCheck,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  RefreshCw,
  Repeat,
  ArrowLeftRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BankItem,
  Question,
  QuestionType,
  Difficulty,
  QuestionOption,
  MatchingPair,
  Library,
} from '@/types/bank';
import {
  QUESTION_TYPES,
  DIFFICULTY_LEVELS,
  getBankItemKindMeta,
  getQuestionTypeMeta,
  getDifficultyMeta,
} from '@/constants/bank';
import { useBankItem, useUpdateBankItem, useCreateBankItem } from '@/hooks/useBank';
import { KaTeXRenderer } from '@/components/Academic/Exam/KaTeXRenderer';
import { isBankQuestionSupportedInExams } from '@/services/bank-exam-mapper';

export interface BankItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId?: string | number;
  mode?: 'view' | 'edit' | 'create';
  initialMode?: 'view' | 'edit';
  createKind?: 'question';
  createQuestionType?: QuestionType;
  libraryId?: string | number;
  libraries?: Library[];
}

export default function BankItemDetailModal({
  isOpen,
  onClose,
  itemId,
  mode: propMode,
  initialMode = 'view',
  createKind,
  createQuestionType = 'mcq',
  libraryId,
  libraries = [],
}: BankItemDetailModalProps) {
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>(
    propMode || (createKind ? 'create' : initialMode)
  );

  useEffect(() => {
    if (propMode) {
      setMode(propMode);
    } else if (createKind) {
      setMode('create');
    } else {
      setMode(initialMode);
    }
  }, [propMode, createKind, initialMode, isOpen]);

  const isCreate = mode === 'create' || Boolean(createKind);

  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);

  // Fetch item when in view/edit mode
  const {
    data: item,
    isLoading,
    isError,
    refetch,
  } = useBankItem(isCreate ? undefined : itemId);

  const updateMutation = useUpdateBankItem();
  const createMutation = useCreateBankItem();

  // ---------------------------------------------------------------------------
  // LESSON & VIDEO FORM STATE
  // ---------------------------------------------------------------------------
  const [lvTitle, setLvTitle] = useState('');
  const [lvUnit, setLvUnit] = useState('');
  const [lvContent, setLvContent] = useState('');
  const [lvSource, setLvSource] = useState<'upload' | 'library' | 'url'>('url');
  const [lvUrl, setLvUrl] = useState('');

  // ---------------------------------------------------------------------------
  // QUESTION FORM STATE
  // ---------------------------------------------------------------------------
  const [qType, setQType] = useState<QuestionType>(createQuestionType);
  const [qText, setQText] = useState('');
  const [qMarks, setQMarks] = useState<number>(createQuestionType === 'essay' ? 5 : 2);
  const [qDifficulty, setQDifficulty] = useState<Difficulty>('');
  const [qTagsInput, setQTagsInput] = useState('');
  const [qUnit, setQUnit] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [qKeepOrder, setQKeepOrder] = useState(false);

  // MCQ / Multi Options
  const [options, setOptions] = useState<{ id: string; text: string; isCorrect: boolean }[]>([
    { id: '1', text: '', isCorrect: true },
    { id: '2', text: '', isCorrect: false },
    { id: '3', text: '', isCorrect: false },
    { id: '4', text: '', isCorrect: false },
  ]);

  // True/False
  const [tfAnswer, setTfAnswer] = useState<boolean | null>(null);

  // Fill in the blanks
  const [fillAnswers, setFillAnswers] = useState<string[]>([]);

  // Short Answer
  const [shortAnswer, setShortAnswer] = useState('');

  // Numeric
  const [numValue, setNumValue] = useState<string>('');
  const [numUnit, setNumUnit] = useState<string>('');
  const [numTol, setNumTol] = useState<number>(0);
  const [customTolValue, setCustomTolValue] = useState<number | null>(null);

  // Matching
  const [pairs, setPairs] = useState<{ id: string; left: string; right: string }[]>([
    { id: '1', left: '', right: '' },
    { id: '2', left: '', right: '' },
    { id: '3', left: '', right: '' },
  ]);

  // Essay
  const [essayAnswer, setEssayAnswer] = useState('');

  // Validation inline errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Deep comparison snapshot for dirty tracking
  const initialSnapshotRef = useRef<string>('');

  // Reset & Populate Form when item loads or modal opens
  useEffect(() => {
    if (!isOpen) {
      setShowUnsavedPrompt(false);
      setErrors({});
      return;
    }

    if (isCreate) {
      setMode('create');
      setQType(createQuestionType);
      setQText('');
      setQMarks(createQuestionType === 'essay' ? 5 : 2);
      setQDifficulty('');
      setQTagsInput('');
      setQUnit('');
      setQExplanation('');
      setIsExplanationOpen(false);
      setQKeepOrder(false);
      setTfAnswer(null);
      setFillAnswers([]);
      setShortAnswer('');
      setNumValue('');
      setNumUnit('');
      setNumTol(0);
      setCustomTolValue(null);
      setEssayAnswer('');
      setOptions([
        { id: '1', text: '', isCorrect: true },
        { id: '2', text: '', isCorrect: false },
        { id: '3', text: '', isCorrect: false },
        { id: '4', text: '', isCorrect: false },
      ]);
      setPairs([
        { id: '1', left: '', right: '' },
        { id: '2', left: '', right: '' },
        { id: '3', left: '', right: '' },
      ]);

      const initialData = {
        qType: createQuestionType,
        qText: '',
        qMarks: createQuestionType === 'essay' ? 5 : 2,
        qDifficulty: '',
        qTagsInput: '',
        qUnit: '',
        qExplanation: '',
        qKeepOrder: false,
        options: ['', '', '', ''],
      };
      initialSnapshotRef.current = JSON.stringify(initialData);
      return;
    }

    setMode(initialMode);

    if (item) {
      if (item.kind === 'lesson') {
        setLvTitle(item.title);
        setLvUnit(item.unit || '');
        setLvContent(item.content || '');
        initialSnapshotRef.current = JSON.stringify({
          title: item.title,
          unit: item.unit || '',
          content: item.content || '',
        });
      } else if (item.kind === 'video') {
        setLvTitle(item.title);
        setLvUnit(item.unit || '');
        setLvSource(item.source);
        setLvUrl(item.url || '');
        initialSnapshotRef.current = JSON.stringify({
          title: item.title,
          unit: item.unit || '',
          source: item.source,
          url: item.url || '',
        });
      } else if (item.kind === 'question') {
        const q = item.question;
        setQType(q.type);
        setQText(q.text);
        setQMarks(q.marks || 2);
        setQDifficulty(q.difficulty || '');
        setQTagsInput((q.tags || item.tags || []).join('، '));
        setQUnit(item.unit || '');
        setQExplanation(q.explanation || '');
        setIsExplanationOpen(Boolean(q.explanation?.trim()));
        setQKeepOrder(Boolean(q.keepOrder));

        // MCQ / Multi
        if (q.options && q.options.length > 0) {
          const mappedOpts = q.options.map((opt, idx) => ({
            id: opt.id || String(idx + 1),
            text: opt.text || '',
            isCorrect: Boolean(
              opt.isCorrect ||
                (typeof q.correct === 'string' && q.correct === opt.id) ||
                (Array.isArray(q.correct) && q.correct.includes(opt.id))
            ),
          }));
          setOptions(mappedOpts);
        } else {
          setOptions([
            { id: '1', text: '', isCorrect: true },
            { id: '2', text: '', isCorrect: false },
          ]);
        }

        // True / False
        if (typeof q.correct === 'boolean') {
          setTfAnswer(q.correct);
        } else if (q.correct === 'true' || q.correct === 1) {
          setTfAnswer(true);
        } else if (q.correct === 'false' || q.correct === 0) {
          setTfAnswer(false);
        } else {
          setTfAnswer(null);
        }

        // Fill in the blanks
        if (Array.isArray(q.correct)) {
          setFillAnswers(q.correct.map(String));
        } else if (typeof q.correct === 'string' && q.correct.trim()) {
          setFillAnswers([q.correct.trim()]);
        } else {
          setFillAnswers([]);
        }

        // Short Answer
        setShortAnswer(q.sampleAnswer || (typeof q.correct === 'string' ? q.correct : ''));

        // Numeric
        setNumValue(q.value !== undefined ? String(q.value) : '');
        setNumUnit(q.unit || '');
        if (q.tol !== undefined) {
          if ([0, 0.01, 0.02, 0.05].includes(q.tol)) {
            setNumTol(q.tol);
            setCustomTolValue(null);
          } else {
            setNumTol(q.tol);
            setCustomTolValue(q.tol);
          }
        } else {
          setNumTol(0);
          setCustomTolValue(null);
        }

        // Matching
        if (q.pairs && q.pairs.length > 0) {
          setPairs(
            q.pairs.map((p, idx) => ({
              id: p.id || String(idx + 1),
              left: p.left || '',
              right: p.right || '',
            }))
          );
        } else {
          setPairs([
            { id: '1', left: '', right: '' },
            { id: '2', left: '', right: '' },
          ]);
        }

        // Essay
        setEssayAnswer(q.sampleAnswer || '');

        initialSnapshotRef.current = JSON.stringify({
          text: q.text,
          marks: q.marks,
          difficulty: q.difficulty,
          explanation: q.explanation,
          unit: item.unit,
        });
      }
    }
  }, [isOpen, item, isCreate, createQuestionType, initialMode]);

  // Live count of ___ in fill question text to synchronize answer inputs
  const blankCount = useMemo(() => {
    if (qType !== 'fill') return 0;
    const matches = qText.match(/_{3,}/g) || qText.match(/\{dash\}/g);
    return matches ? matches.length : 0;
  }, [qText, qType]);

  useEffect(() => {
    if (qType === 'fill') {
      setFillAnswers((prev) => {
        const next = [...prev];
        if (next.length < blankCount) {
          while (next.length < blankCount) next.push('');
        } else if (next.length > blankCount) {
          return next.slice(0, blankCount);
        }
        return next;
      });
    }
  }, [blankCount, qType]);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    if (mode === 'view') return false;
    if (!item && !isCreate) return false;

    if (item?.kind === 'lesson') {
      return (
        lvTitle !== item.title ||
        lvUnit !== (item.unit || '') ||
        lvContent !== (item.content || '')
      );
    }
    if (item?.kind === 'video') {
      return (
        lvTitle !== item.title ||
        lvUnit !== (item.unit || '') ||
        lvSource !== item.source ||
        lvUrl !== (item.url || '')
      );
    }

    if (isCreate || item?.kind === 'question') {
      if (qText.trim() !== '') return true;
      if (options.some((o) => o.text.trim() !== '')) return true;
      if (shortAnswer.trim() !== '') return true;
      if (numValue.trim() !== '') return true;
    }
    return false;
  }, [mode, item, isCreate, lvTitle, lvUnit, lvContent, lvSource, lvUrl, qText, options, shortAnswer, numValue]);

  // ---------------------------------------------------------------------------
  // DERIVED DATA FOR VIEW MODE
  // ---------------------------------------------------------------------------
  const currentLibrary = useMemo(() => {
    const libId = item?.libraryId || libraryId;
    return libraries.find((l) => String(l.id) === String(libId));
  }, [libraries, item, libraryId]);

  const questionMeta = useMemo(() => {
    if (item?.kind === 'question') {
      return getQuestionTypeMeta(item.question.type);
    }
    if (isCreate) {
      return getQuestionTypeMeta(createQuestionType);
    }
    return null;
  }, [item, isCreate, createQuestionType]);

  const isSupportedInExam = useMemo(() => {
    if (item?.kind === 'question') {
      return isBankQuestionSupportedInExams(item.question);
    }
    return true;
  }, [item]);

  // Handle Close with Unsaved Changes Guard
  const handleRequestClose = () => {
    if (isDirty && (mode === 'edit' || mode === 'create')) {
      setShowUnsavedPrompt(true);
      return;
    }
    onClose();
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleRequestClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDirty, mode]);

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // SAVE LESSON / VIDEO
  // ---------------------------------------------------------------------------
  const handleSaveLessonVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = lvTitle.trim();
    if (!trimmedTitle) {
      setErrors({ title: 'العنوان مطلوب' });
      return;
    }

    if (item?.kind === 'video' && lvSource === 'url') {
      const trimmedUrl = lvUrl.trim();
      if (!trimmedUrl || (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://'))) {
        setErrors({ url: 'يرجى إدخال رابط فيديو صالح يبدأ بـ http:// أو https://' });
        return;
      }
    }

    try {
      if (item?.kind === 'lesson') {
        await updateMutation.mutateAsync({
          id: item.id,
          data: {
            kind: 'lesson',
            title: trimmedTitle,
            unit: lvUnit.trim() || undefined,
            content: lvContent.trim() || undefined,
          },
        });
      } else if (item?.kind === 'video') {
        await updateMutation.mutateAsync({
          id: item.id,
          data: {
            kind: 'video',
            title: trimmedTitle,
            unit: lvUnit.trim() || undefined,
            source: lvSource,
            url: lvSource === 'url' ? lvUrl.trim() : item.url,
          },
        });
      }

      toast.success('تم حفظ التعديلات');
      setErrors({});
      setMode('view');
    } catch (error: any) {
      console.error('Failed to update item:', error);
      toast.error(error?.message || 'حدث خطأ أثناء حفظ التعديلات');
    }
  };

  // ---------------------------------------------------------------------------
  // SAVE / CREATE QUESTION
  // ---------------------------------------------------------------------------
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const trimmedText = qText.trim();
    if (!trimmedText) {
      newErrors.text = 'اكتب نص السؤال الأول';
    }

    // MCQ / Multi validation
    let cleanOptions = options.map((o) => ({ ...o, text: o.text.trim() }));
    if (qType === 'mcq' || qType === 'multi') {
      // Filter out empty options while preserving valid ones
      const nonEmptyOpts = cleanOptions.filter((o) => o.text !== '');
      if (nonEmptyOpts.length < 2) {
        newErrors.options = 'لازم يفضل اختيارين على الأقل غير فارغين';
      }

      if (qType === 'mcq') {
        const hasCorrect = nonEmptyOpts.some((o) => o.isCorrect);
        if (!hasCorrect) {
          newErrors.mcq = 'حدد الإجابة الصحيحة';
        }
      } else {
        const hasAnyCorrect = nonEmptyOpts.some((o) => o.isCorrect);
        if (!hasAnyCorrect) {
          newErrors.multi = 'حدد إجابة صحيحة واحدة على الأقل';
        }
      }
      cleanOptions = nonEmptyOpts;
    }

    // True/False validation
    if (qType === 'tf' && tfAnswer === null) {
      newErrors.tf = 'حدد الإجابة الصحيحة';
    }

    // Fill validation
    if (qType === 'fill') {
      if (blankCount === 0) {
        newErrors.fill = 'لازم تكتب ___ مكان الفراغ في نص السؤال';
      } else {
        const emptyBlankIdx = fillAnswers.findIndex((a) => !a.trim());
        if (emptyBlankIdx !== -1 || fillAnswers.length < blankCount) {
          newErrors.fill = 'اكتب إجابة لكل فراغ';
        }
      }
    }

    // Short Answer validation
    if (qType === 'short' && !shortAnswer.trim()) {
      newErrors.short = 'اكتب الإجابة الصحيحة';
    }

    // Numeric validation
    if (qType === 'numeric') {
      if (!numValue.trim() || isNaN(Number(numValue))) {
        newErrors.numeric = 'اكتب القيمة الرقمية';
      }
    }

    // Matching validation
    let cleanPairs = pairs.map((p) => ({
      ...p,
      left: p.left.trim(),
      right: p.right.trim(),
    }));
    if (qType === 'matching') {
      const nonEmptyPairs = cleanPairs.filter((p) => p.left !== '' && p.right !== '');
      if (nonEmptyPairs.length < 2) {
        newErrors.matching = 'لازم زوجين كاملين على الأقل';
      }
      cleanPairs = nonEmptyPairs;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto focus first invalid input if found
      const firstKey = Object.keys(newErrors)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`) as HTMLElement;
      if (el) el.focus();
      return;
    }

    setErrors({});

    // Parse tags
    const tags = qTagsInput
      .split(/[,،]/)
      .map((t) => t.trim())
      .filter(Boolean);

    // Build Question payload
    const questionPayload: Omit<Question, 'id'> & { id?: string | number } = {
      type: qType,
      text: trimmedText,
      marks: qMarks,
      difficulty: qDifficulty,
      tags,
      explanation: qExplanation.trim() || undefined,
      keepOrder: qKeepOrder,
    };

    if (qType === 'mcq') {
      const correctOpt = cleanOptions.find((o) => o.isCorrect);
      questionPayload.options = cleanOptions.map((o, idx) => ({
        id: o.id || String(idx + 1),
        text: o.text,
        isCorrect: o.isCorrect,
      }));
      questionPayload.correct = correctOpt?.id || cleanOptions[0]?.id;
    } else if (qType === 'multi') {
      const correctOpts = cleanOptions.filter((o) => o.isCorrect).map((o) => o.id);
      questionPayload.options = cleanOptions.map((o, idx) => ({
        id: o.id || String(idx + 1),
        text: o.text,
        isCorrect: o.isCorrect,
      }));
      questionPayload.correct = correctOpts;
    } else if (qType === 'tf') {
      questionPayload.correct = Boolean(tfAnswer);
    } else if (qType === 'fill') {
      questionPayload.blanksTemplate = trimmedText.replace(/_{3,}/g, '{dash}');
      questionPayload.correct = fillAnswers.map((a) => a.trim());
    } else if (qType === 'short') {
      questionPayload.correct = shortAnswer.trim();
      questionPayload.sampleAnswer = shortAnswer.trim();
    } else if (qType === 'numeric') {
      questionPayload.value = Number(numValue);
      questionPayload.tol = numTol;
      questionPayload.unit = numUnit.trim() || undefined;
    } else if (qType === 'matching') {
      questionPayload.pairs = cleanPairs.map((p, idx) => ({
        id: p.id || String(idx + 1),
        left: p.left,
        right: p.right,
      }));
    } else if (qType === 'essay') {
      questionPayload.sampleAnswer = essayAnswer.trim() || undefined;
    }

    try {
      if (isCreate) {
        const targetLibId = libraryId || (libraries[0]?.id ?? 'lib-1');
        const targetLib = libraries.find((l) => String(l.id) === String(targetLibId));

        await createMutation.mutateAsync({
          kind: 'question',
          libraryId: targetLibId,
          unit: qUnit.trim() || undefined,
          tags,
          question: questionPayload,
        });

        toast.success(`تم حفظ السؤال في «${targetLib?.name || 'المكتبة'}»`);
        onClose();
      } else if (item) {
        await updateMutation.mutateAsync({
          id: item.id,
          data: {
            kind: 'question',
            unit: qUnit.trim() || undefined,
            tags,
            question: {
              ...questionPayload,
              id: (item as any).question?.id,
            },
          },
        });

        toast.success('تم حفظ التعديلات');
        setMode('view');
      }
    } catch (error: any) {
      console.error('Failed to save question:', error);
      toast.error(error?.message || 'حدث خطأ أثناء حفظ السؤال');
    }
  };

  // ---------------------------------------------------------------------------
  // OPTION HELPERS FOR MCQ / MULTI
  // ---------------------------------------------------------------------------
  const handleAddOption = () => {
    if (options.length >= 6) {
      toast.error('أقصى عدد 6 اختيارات');
      return;
    }
    const newId = String(Date.now());
    setOptions([...options, { id: newId, text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.error('لازم يفضل اختيارين على الأقل');
      return;
    }
    const next = options.filter((_, i) => i !== index);
    if (qType === 'mcq' && options[index].isCorrect && next.length > 0) {
      next[0].isCorrect = true;
    }
    setOptions(next);
  };

  const handleSelectOptionCorrect = (index: number) => {
    if (qType === 'mcq') {
      setOptions(
        options.map((opt, i) => ({
          ...opt,
          isCorrect: i === index,
        }))
      );
    } else {
      setOptions(
        options.map((opt, i) => ({
          ...opt,
          isCorrect: i === index ? !opt.isCorrect : opt.isCorrect,
        }))
      );
    }
  };

  // ---------------------------------------------------------------------------
  // PAIR HELPERS FOR MATCHING
  // ---------------------------------------------------------------------------
  const handleAddPair = () => {
    setPairs([...pairs, { id: String(Date.now()), left: '', right: '' }]);
  };

  const handleRemovePair = (index: number) => {
    if (pairs.length <= 2) {
      toast.error('لازم زوجين على الأقل');
      return;
    }
    setPairs(pairs.filter((_, i) => i !== index));
  };

  // ---------------------------------------------------------------------------
  // RENDER MODAL BODY
  // ---------------------------------------------------------------------------
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-bank-item-title"
      onClick={handleRequestClose}
    >
      <div
        className="bg-white rounded-[28px] max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Pinned Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 text-start">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
              {item?.kind === 'lesson' && <BookOpen size={22} />}
              {item?.kind === 'video' && <Video size={22} />}
              {(item?.kind === 'question' || isCreate) && <HelpCircle size={22} />}
            </div>
            <div>
              <h2
                id="modal-bank-item-title"
                className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight"
              >
                {mode === 'create'
                  ? 'إضافة سؤال جديد'
                  : mode === 'edit'
                  ? 'تعديل العنصر'
                  : item?.kind === 'lesson'
                  ? 'تفاصيل الدرس'
                  : item?.kind === 'video'
                  ? 'تفاصيل الفيديو'
                  : 'تفاصيل السؤال'}
              </h2>
              <p className="text-xs text-gray-500 font-bold mt-0.5">
                {isCreate
                  ? questionMeta?.label || 'بنك الأسئلة'
                  : item?.kind === 'lesson'
                  ? 'درس ومستند تعليمي'
                  : item?.kind === 'video'
                  ? 'فيديو تعليمي'
                  : questionMeta?.label || 'سؤال'}
                {currentLibrary?.name && ` · ${currentLibrary.name}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRequestClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 size={32} className="animate-spin text-indigo-600 mx-auto" />
              <p className="text-xs text-gray-400 font-bold">جاري تحميل بيانات العنصر...</p>
            </div>
          ) : isError || (!item && !isCreate) ? (
            <div className="py-12 text-center space-y-3">
              <AlertCircle size={32} className="text-red-500 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">تعذر العثور على العنصر</h3>
              <p className="text-xs text-gray-500">العنصر المطلوب غير موجود أو تم حذفه.</p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1.5"
                >
                  <RefreshCw size={14} />
                  <span>إعادة المحاولة</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          ) : mode === 'view' && item ? (
            // =================================================================
            // VIEW MODE: LESSON / VIDEO / QUESTION
            // =================================================================
            <div className="space-y-6 text-start">
              {/* Meta Tags / Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                  {getBankItemKindMeta(item.kind).label}
                </span>

                {item.kind === 'question' && (
                  <>
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                      {getQuestionTypeMeta(item.question.type).label}
                    </span>
                    {item.question.difficulty && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          getDifficultyMeta(item.question.difficulty).badgeClass
                        }`}
                      >
                        {getDifficultyMeta(item.question.difficulty).label}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-mono font-bold">
                      {item.question.marks || 2} درجات
                    </span>
                  </>
                )}

                {item.unit && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    {item.unit}
                  </span>
                )}

                {item.usageCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                    <Repeat size={13} />
                    <span>مستخدم في {item.usageCount} مكان</span>
                  </span>
                )}
              </div>

              {/* Unsupported Warning for Question */}
              {item.kind === 'question' && !isSupportedInExam && (
                <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200/80 text-xs font-medium flex items-center gap-2">
                  <Info size={16} className="text-amber-600 shrink-0" />
                  <span>هذا السؤال غير مدعوم في محرك الاختبارات حالياً.</span>
                </div>
              )}

              {/* Title / Question Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">
                  {item.kind === 'question' ? 'نص السؤال' : 'العنوان'}
                </label>
                <div className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                  {item.kind === 'question' ? (
                    <KaTeXRenderer content={item.question.text} inline />
                  ) : (
                    item.title
                  )}
                </div>
              </div>

              {/* Lesson Specific Body */}
              {item.kind === 'lesson' && (
                <div className="space-y-4">
                  {item.content && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400">محتوى الدرس والشرح</label>
                      <div className="p-4 bg-gray-50/60 rounded-2xl border border-gray-100 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {item.content}
                      </div>
                    </div>
                  )}

                  {item.pdfUrl && (
                    <div className="flex items-center justify-between p-3.5 bg-indigo-50/40 rounded-2xl border border-indigo-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                        <FileText size={18} className="text-indigo-600" />
                        <span>مستند PDF مرفق</span>
                      </div>
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        <span>فتح الملف</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Video Specific Body */}
              {item.kind === 'video' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50/60 rounded-2xl border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-500">مصدر الفيديو:</span>
                      <span className="font-bold text-indigo-600">
                        {item.source === 'url'
                          ? 'رابط خارجي'
                          : item.source === 'library'
                          ? 'مكتبة الفيديو'
                          : 'ملف مرفوع'}
                      </span>
                    </div>

                    {item.duration && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-500">المدة التقريبية:</span>
                        <span className="font-mono text-gray-700 font-bold">
                          {Math.floor(item.duration / 60)} دقيقة
                        </span>
                      </div>
                    )}
                  </div>

                  {item.source === 'url' && item.url ? (
                    <div className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100 flex items-center justify-between">
                      <div className="min-w-0 flex-1 pe-2" dir="ltr">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-blue-600 hover:underline truncate block"
                        >
                          {item.url}
                        </a>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shrink-0"
                      >
                        <span>فتح الرابط</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center text-xs text-gray-500 space-y-1">
                      <Video size={24} className="text-gray-400 mx-auto" />
                      <p className="font-bold text-gray-700">فيديو مسجل ومحفوظ في السحابة</p>
                      <p className="text-[11px] text-gray-400">الفيديوهات محمية ضد التحميل والتسجيل.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Question Specific Body (Options, Pairs, etc.) */}
              {item.kind === 'question' && (
                <div className="space-y-4">
                  {/* MCQ / Multi View */}
                  {(item.question.type === 'mcq' || item.question.type === 'multi') && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-400">الخيارات والإجابات</label>
                        {item.question.keepOrder && (
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            الحفاظ على الترتيب
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {item.question.options?.map((opt, idx) => {
                          const isCorrect = Boolean(
                            opt.isCorrect ||
                              (typeof item.question.correct === 'string' &&
                                item.question.correct === opt.id) ||
                              (Array.isArray(item.question.correct) &&
                                item.question.correct.includes(opt.id))
                          );

                          return (
                            <div
                              key={opt.id || idx}
                              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                                isCorrect
                                  ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-500/20'
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {opt.letter || idx + 1}
                                </div>
                                <div className="text-sm font-bold text-gray-800">
                                  <KaTeXRenderer content={opt.text} inline />
                                </div>
                              </div>

                              {isCorrect && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                                  <Check size={12} strokeWidth={3} />
                                  <span>الإجابة الصحيحة</span>
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* True / False View */}
                  {item.question.type === 'tf' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400">الإجابة الصحيحة</label>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2">
                        <span
                          className={`px-4 py-1.5 rounded-xl font-black text-sm text-white ${
                            item.question.correct ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        >
                          {item.question.correct ? 'صح (صحيحة)' : 'خطأ (خاطئة)'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Fill in the Blanks View */}
                  {item.question.type === 'fill' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400">الإجابات الصحيحة للفراغات</label>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(item.question.correct)
                          ? item.question.correct
                          : [item.question.correct]
                        ).map((ans, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold"
                          >
                            الفراغ {i + 1}: {String(ans)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Short Answer View */}
                  {item.question.type === 'short' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400">الإجابة المعتمدة</label>
                      <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-sm font-bold text-amber-900">
                        {String(item.question.sampleAnswer || item.question.correct || 'غير محددة')}
                      </div>
                    </div>
                  )}

                  {/* Numeric View */}
                  {item.question.type === 'numeric' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400">القيمة والوحدة والخطأ المسموح</label>
                      <div className="p-3.5 bg-cyan-50/50 rounded-2xl border border-cyan-200/60 flex flex-wrap items-center gap-4 text-xs font-bold text-cyan-900" dir="ltr">
                        <div>
                          <span className="text-gray-400 text-[10px] block">Target Value:</span>
                          <span className="font-mono text-sm">{item.question.value}</span>
                        </div>
                        {item.question.unit && (
                          <div>
                            <span className="text-gray-400 text-[10px] block">Unit:</span>
                            <span className="font-mono text-sm">{item.question.unit}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-400 text-[10px] block">Tolerance:</span>
                          <span className="font-mono text-sm">
                            {item.question.tol ? `±${item.question.tol * 100}%` : 'بالظبط (0%)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Matching View */}
                  {item.question.type === 'matching' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400">أزواج التوصيل والمطابقة</label>
                      <div className="space-y-2">
                        {item.question.pairs?.map((pair, i) => (
                          <div
                            key={pair.id || i}
                            className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100 flex items-center justify-between text-xs font-bold text-rose-950"
                          >
                            <span className="w-5/12 truncate">{pair.left}</span>
                            <ArrowLeftRight size={14} className="text-rose-400 shrink-0" />
                            <span className="w-5/12 text-end truncate">{pair.right}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Essay View */}
                  {item.question.type === 'essay' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-violet-50 text-violet-900 rounded-2xl border border-violet-100 text-xs font-medium flex items-center gap-2">
                        <Info size={16} className="text-violet-600 shrink-0" />
                        <span>السؤال المقالي يتم تصحيحه يدوياً من قبل المعلم.</span>
                      </div>
                      {item.question.sampleAnswer && (
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400">نموذج الإجابة الاسترشادي</label>
                          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-700 whitespace-pre-wrap">
                            {item.question.sampleAnswer}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Explanation View */}
                  {item.question.explanation && (
                    <div className="space-y-1 pt-2">
                      <label className="text-xs font-bold text-gray-400">شرح وتوضيح الإجابة (للطالب)</label>
                      <div className="p-3.5 bg-indigo-50/30 rounded-2xl border border-indigo-100/60 text-xs text-indigo-950 font-medium leading-relaxed">
                        <KaTeXRenderer content={item.question.explanation} inline />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (item?.kind === 'lesson' || item?.kind === 'video') && mode === 'edit' ? (
            // =================================================================
            // EDIT MODE: LESSON / VIDEO
            // =================================================================
            <form id="lv-edit-form" onSubmit={handleSaveLessonVideo} className="space-y-4 text-start">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-900">
                  العنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lvTitle}
                  onChange={(e) => setLvTitle(e.target.value)}
                  disabled={updateMutation.isPending}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm text-gray-900"
                />
                {errors.title && <p className="text-xs text-red-500 font-bold">{errors.title}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-900">
                  الوحدة أو الفصل <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
                </label>
                <input
                  type="text"
                  value={lvUnit}
                  onChange={(e) => setLvUnit(e.target.value)}
                  disabled={updateMutation.isPending}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white text-sm text-gray-900"
                />
              </div>

              {item?.kind === 'lesson' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-900">محتوى الدرس</label>
                  <textarea
                    value={lvContent}
                    onChange={(e) => setLvContent(e.target.value)}
                    rows={5}
                    disabled={updateMutation.isPending}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white text-sm text-gray-900 resize-none leading-relaxed"
                  />
                  {item.pdfUrl && (
                    <div className="p-3 bg-gray-100 rounded-xl text-xs text-gray-500 flex items-center justify-between">
                      <span className="truncate">ملف PDF الحالي: {item.pdfUrl.split('/').pop()}</span>
                      <span className="text-[10px] text-gray-400 font-bold">(استبدال الملف غير مدعوم حالياً)</span>
                    </div>
                  )}
                </div>
              )}

              {item?.kind === 'video' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-900">مصدر الفيديو</label>
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setLvSource('url')}
                        className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                          lvSource === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        رابط خارجي
                      </button>
                      <button
                        type="button"
                        onClick={() => setLvSource('upload')}
                        className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                          lvSource === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        رفع فيديو
                      </button>
                      <button
                        type="button"
                        onClick={() => setLvSource('library')}
                        className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                          lvSource === 'library' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                        }`}
                      >
                        مكتبة الفيديو
                      </button>
                    </div>
                  </div>

                  {lvSource === 'url' ? (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-gray-900">
                        رابط الفيديو <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={lvUrl}
                        onChange={(e) => setLvUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        disabled={updateMutation.isPending}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white text-xs font-mono"
                        dir="ltr"
                      />
                      {errors.url && <p className="text-xs text-red-500 font-bold">{errors.url}</p>}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-500 text-center">
                      فيديو مسجل ({item.url ? item.url.split('/').pop() : 'ملف محفوظ'}). استبدال الملف المرفوع غير مدعوم حالياً.
                    </div>
                  )}
                </div>
              )}
            </form>
          ) : (
            // =================================================================
            // EDIT / CREATE MODE: QUESTION EDITOR
            // =================================================================
            <form id="question-edit-form" onSubmit={handleSaveQuestion} className="space-y-5 text-start">
              {/* Question Text Area */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-900">
                  نص السؤال <span className="text-red-500">*</span>
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition">
                  <textarea
                    value={qText}
                    data-field="text"
                    onChange={(e) => setQText(e.target.value)}
                    placeholder={
                      qType === 'fill'
                        ? 'مثال: The capital of Egypt is ___ .'
                        : 'اكتب السؤال… (يمكن استخدام $ للمصطلحات الرياضية $E=mc^2$)'
                    }
                    rows={3}
                    disabled={updateMutation.isPending || createMutation.isPending}
                    className="w-full bg-transparent outline-none text-sm text-gray-900 resize-none font-medium leading-relaxed"
                  />
                </div>
                {errors.text && <p className="text-xs text-red-500 font-bold">{errors.text}</p>}

                {/* Math Live Preview block if contains $ */}
                {qText.includes('$') && (
                  <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700">
                      <Sparkles size={13} />
                      <span>معاينة كما يراها الطالب:</span>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      <KaTeXRenderer content={qText} inline />
                    </div>
                  </div>
                )}
              </div>

              {/* Type-Specific Answers Section */}
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200/80 space-y-3">
                {/* MCQ / Multi Option Editor */}
                {(qType === 'mcq' || qType === 'multi') && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-900">الإجابات والخيارات</label>
                      <span className="text-xs text-gray-400 font-medium">
                        {qType === 'mcq'
                          ? 'اضغط الدائرة لتحديد الإجابة الصحيحة'
                          : 'علّم على كل الإجابات الصحيحة'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {options.map((opt, idx) => (
                        <div
                          key={opt.id || idx}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                            opt.isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/20'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          {/* Selection indicator */}
                          <button
                            type="button"
                            onClick={() => handleSelectOptionCorrect(idx)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition shrink-0 cursor-pointer ${
                              opt.isCorrect
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'border border-gray-300 bg-white hover:border-gray-400'
                            }`}
                            aria-label={`تحديد الاختيار ${idx + 1} كصحيح`}
                          >
                            {opt.isCorrect && <Check size={13} strokeWidth={3} />}
                          </button>

                          {/* Text input */}
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const next = [...options];
                              next[idx].text = e.target.value;
                              setOptions(next);
                            }}
                            placeholder={`الإجابة ${idx === 0 ? 'الأولى' : idx === 1 ? 'الثانية' : idx === 2 ? 'الثالثة' : idx === 3 ? 'الرابعة' : idx + 1}…`}
                            className="flex-1 bg-transparent outline-none text-xs sm:text-sm font-medium text-gray-800"
                          />

                          {opt.isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md shrink-0">
                              صحيحة
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            className="p-1 text-gray-400 hover:text-red-500 transition rounded-lg"
                            title="حذف الاختيار"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {errors.mcq && <p className="text-xs text-red-500 font-bold">{errors.mcq}</p>}
                    {errors.multi && <p className="text-xs text-red-500 font-bold">{errors.multi}</p>}
                    {errors.options && <p className="text-xs text-red-500 font-bold">{errors.options}</p>}

                    {/* Add option button */}
                    {options.length < 6 && (
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="w-full py-2.5 border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-indigo-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>إضافة اختيار</span>
                      </button>
                    )}

                    {/* Keep order toggle checkbox */}
                    <div className="pt-2 border-t border-gray-200/60">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 select-none">
                        <input
                          type="checkbox"
                          checked={qKeepOrder}
                          onChange={(e) => setQKeepOrder(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>الحفاظ على ترتيب الإجابات (لو فيه «كل ما سبق» أو ترتيب منطقي)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* True / False Editor */}
                {qType === 'tf' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">الإجابة الصحيحة</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTfAnswer(true)}
                        className={`py-3.5 rounded-2xl font-black text-sm border transition flex items-center justify-center gap-2 cursor-pointer ${
                          tfAnswer === true
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <Check size={18} />
                        <span>صح (صحيحة)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTfAnswer(false)}
                        className={`py-3.5 rounded-2xl font-black text-sm border transition flex items-center justify-center gap-2 cursor-pointer ${
                          tfAnswer === false
                            ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <X size={18} />
                        <span>خطأ (خاطئة)</span>
                      </button>
                    </div>
                    {errors.tf && <p className="text-xs text-red-500 font-bold">{errors.tf}</p>}
                  </div>
                )}

                {/* Fill in the Blanks Editor */}
                {qType === 'fill' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-900">إجابات الفراغات</label>
                      <span className="text-xs text-gray-400 font-medium">{blankCount} فراغ في النص</span>
                    </div>

                    {blankCount === 0 ? (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 font-medium">
                        اكتب ___ (3 شرطات سفلية) مكان كل فراغ داخل نص السؤال ليتم إنشاء حقول الإجابات تلقائياً.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {Array.from({ length: blankCount }).map((_, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-20 text-xs font-bold text-gray-600 shrink-0">الفراغ {i + 1}:</span>
                            <input
                              type="text"
                              value={fillAnswers[i] || ''}
                              onChange={(e) => {
                                const next = [...fillAnswers];
                                next[i] = e.target.value;
                                setFillAnswers(next);
                              }}
                              placeholder={`الإجابة الصحيحة للفراغ ${i + 1}…`}
                              className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.fill && <p className="text-xs text-red-500 font-bold">{errors.fill}</p>}
                  </div>
                )}

                {/* Short Answer Editor */}
                {qType === 'short' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-900">الإجابة الصحيحة المعتمدة</label>
                    <input
                      type="text"
                      value={shortAnswer}
                      data-field="short"
                      onChange={(e) => setShortAnswer(e.target.value)}
                      placeholder="اكتب الإجابة النموذجية المحددة…"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600"
                    />
                    {errors.short && <p className="text-xs text-red-500 font-bold">{errors.short}</p>}
                  </div>
                )}

                {/* Numeric Editor */}
                {qType === 'numeric' && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900">القيمة والوحدة ونسبة الخطأ</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">القيمة (Value)</label>
                        <input
                          type="text"
                          value={numValue}
                          data-field="numeric"
                          onChange={(e) => setNumValue(e.target.value)}
                          placeholder="5"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-indigo-600"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">الوحدة (Unit)</label>
                        <input
                          type="text"
                          value={numUnit}
                          onChange={(e) => setNumUnit(e.target.value)}
                          placeholder="m/s"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono outline-none focus:border-indigo-600"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">الخطأ المسموح (Tol)</label>
                        <select
                          value={numTol}
                          onChange={(e) => setNumTol(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600"
                        >
                          <option value={0}>بالظبط (0%)</option>
                          <option value={0.01}>±1%</option>
                          <option value={0.02}>±2%</option>
                          <option value={0.05}>±5%</option>
                          {customTolValue !== null && ![0, 0.01, 0.02, 0.05].includes(customTolValue) && (
                            <option value={customTolValue}>قيمة حالية (±{customTolValue * 100}%)</option>
                          )}
                        </select>
                      </div>
                    </div>
                    {errors.numeric && <p className="text-xs text-red-500 font-bold">{errors.numeric}</p>}
                  </div>
                )}

                {/* Matching Editor */}
                {qType === 'matching' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-900">
                        الأزواج — الطالب هيوصّل كل عنصر بمقابله
                      </label>
                      <span className="text-xs text-gray-400">على الأقل زوجين</span>
                    </div>

                    <div className="space-y-2">
                      {pairs.map((p, idx) => (
                        <div key={p.id || idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={p.left}
                            onChange={(e) => {
                              const next = [...pairs];
                              next[idx].left = e.target.value;
                              setPairs(next);
                            }}
                            placeholder={`العنصر ${idx + 1}`}
                            className="w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600"
                          />
                          <ArrowLeftRight size={14} className="text-gray-400 shrink-0" />
                          <input
                            type="text"
                            value={p.right}
                            onChange={(e) => {
                              const next = [...pairs];
                              next[idx].right = e.target.value;
                              setPairs(next);
                            }}
                            placeholder={`المطابق ${idx + 1}`}
                            className="w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-600"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePair(idx)}
                            className="p-1 text-gray-400 hover:text-red-500 transition rounded-lg"
                            title="حذف الزوج"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {errors.matching && <p className="text-xs text-red-500 font-bold">{errors.matching}</p>}

                    <button
                      type="button"
                      onClick={handleAddPair}
                      className="w-full py-2.5 border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-indigo-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>إضافة زوج</span>
                    </button>
                  </div>
                )}

                {/* Essay Editor */}
                {qType === 'essay' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-violet-50 text-violet-800 rounded-xl border border-violet-100 text-xs font-medium flex items-center gap-2">
                      <Info size={16} className="text-violet-600 shrink-0" />
                      <span>السؤال المقالي بيتصحح يدوي</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600">نموذج الإجابة (اختياري)</label>
                      <textarea
                        value={essayAnswer}
                        onChange={(e) => setEssayAnswer(e.target.value)}
                        placeholder="اكتب النقاط الرئيسية للإجابة النموذجية أو سلم التقييم..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 resize-none outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Common Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Marks Stepper */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">الدرجة</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQMarks((m) => Math.max(0.5, Number((m - 1).toFixed(1))))}
                      className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-base flex items-center justify-center text-gray-700 transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={qMarks}
                      min={0.5}
                      max={20}
                      step={1}
                      onChange={(e) => setQMarks(Math.max(0.5, Math.min(20, Number(e.target.value) || 1)))}
                      className="w-20 py-2 text-center bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-sm outline-none focus:border-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => setQMarks((m) => Math.min(20, Number((m + 1).toFixed(1))))}
                      className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-base flex items-center justify-center text-gray-700 transition"
                    >
                      +
                    </button>
                    <span className="text-xs text-gray-500 font-bold">درجات</span>
                  </div>
                </div>

                {/* Difficulty Segmented Buttons */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">مستوى السؤال (اختياري)</label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl text-xs font-bold">
                    {(['easy', 'mid', 'hard'] as Difficulty[]).map((d) => {
                      const isSelected = qDifficulty === d;
                      const meta = getDifficultyMeta(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setQDifficulty(isSelected ? '' : d)}
                          className={`py-1.5 rounded-lg transition cursor-pointer ${
                            isSelected
                              ? 'bg-white text-indigo-700 shadow-xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {meta.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">وسوم التصنيف</label>
                <input
                  type="text"
                  value={qTagsInput}
                  onChange={(e) => setQTagsInput(e.target.value)}
                  placeholder="مثال: قانون أوم، Unit 4"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-600 focus:bg-white"
                />
                <p className="text-[11px] text-gray-400">افصل بفاصلة (،) — تساعدك تلاقي السؤال بعدين</p>
              </div>

              {/* Unit Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  الوحدة أو الفصل <span className="text-gray-400 font-normal text-[11px]">(اختياري)</span>
                </label>
                <input
                  type="text"
                  value={qUnit}
                  onChange={(e) => setQUnit(e.target.value)}
                  placeholder="مثال: الوحدة الأولى: الميكانيكا"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              {/* Collapsible Explanation Card */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                  className="w-full p-3.5 bg-gray-50/70 hover:bg-gray-100 flex items-center justify-between text-xs font-bold text-gray-700 transition cursor-pointer"
                >
                  <span>شرح الإجابة — يظهر للطالب بعد الاختبار</span>
                  {isExplanationOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isExplanationOpen && (
                  <div className="p-3 bg-white border-t border-gray-100">
                    <textarea
                      value={qExplanation}
                      onChange={(e) => setQExplanation(e.target.value)}
                      placeholder="اشرح الحل خطوة بخطوة…"
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 resize-none outline-none focus:border-indigo-600"
                    />
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Pinned Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between gap-3 shrink-0">
          {mode === 'view' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl text-xs transition cursor-pointer"
              >
                إغلاق
              </button>

              <button
                type="button"
                onClick={() => setMode('edit')}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 size={14} />
                <span>تعديل</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  if (isCreate) {
                    handleRequestClose();
                  } else {
                    setMode('view');
                  }
                }}
                disabled={updateMutation.isPending || createMutation.isPending}
                className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl text-xs transition cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="submit"
                form={
                  item?.kind === 'lesson' || item?.kind === 'video'
                    ? 'lv-edit-form'
                    : 'question-edit-form'
                }
                disabled={updateMutation.isPending || createMutation.isPending}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {updateMutation.isPending || createMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <span>
                    {isCreate
                      ? 'حفظ في بنك المحتوى'
                      : 'حفظ التعديلات'}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      {showUnsavedPrompt && (
        <div
          className="fixed inset-0 bg-black/60 z-[130] flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowUnsavedPrompt(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 space-y-4 text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <AlertCircle size={24} />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-gray-900">تعديلات غير محفوظة</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                في تعديلات ماتحفظتش. تخرج من غير حفظ؟
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowUnsavedPrompt(false);
                  onClose();
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                خروج بدون حفظ
              </button>
              <button
                type="button"
                onClick={() => setShowUnsavedPrompt(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                البقاء في الصفحة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
