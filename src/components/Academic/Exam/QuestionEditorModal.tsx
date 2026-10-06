'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Check,
  Calculator,
  Atom,
  FlaskConical,
  Image as ImageIcon,
  Database,
  Eye,
  HelpCircle,
  Sparkles,
  ArrowLeftRight,
} from 'lucide-react';
import { ExamQuestion, McqOption, MatchingPair, QuestionType } from '@/types/academic/exam.types';
import { OPTION_LETTERS, getQuestionTypeMeta } from './constants';
import { KaTeXRenderer } from './KaTeXRenderer';
import { EquationEditorModal } from './EquationEditorModal';
import { useLibraries, useCreateBankItem } from '@/hooks/useBank';
import { mapExamQuestionToBankQuestion } from '@/services/bank-exam-mapper';

interface QuestionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: ExamQuestion;
  questionIndex: number;
  onSave: (updatedQuestion: ExamQuestion, addAnother?: boolean) => void;
  isNew?: boolean;
  unitTitle?: string;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  onClose,
  question: initialQuestion,
  questionIndex,
  onSave,
  isNew = false,
  unitTitle,
}) => {
  // Hooks MUST all be placed before any conditional returns
  const { data: libraries = [], isLoading: isLibrariesLoading } = useLibraries();
  const createBankItemMutation = useCreateBankItem();

  // Local draft question state
  const [draft, setDraft] = useState<ExamQuestion>({ ...initialQuestion });
  const [saveToBank, setSaveToBank] = useState(false);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | number>('');
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [isEquationModalOpen, setIsEquationModalOpen] = useState(false);
  const [equationMode, setEquationMode] = useState<'math' | 'phys' | 'chem'>('math');
  const [targetEquationField, setTargetEquationField] = useState<{ field: 'title' | 'explanation' | 'option'; optionId?: string }>({
    field: 'title',
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync draft when initialQuestion changes
  useEffect(() => {
    setDraft({ ...initialQuestion });
  }, [initialQuestion]);

  // Set default selected library
  useEffect(() => {
    if (libraries && libraries.length > 0 && !selectedLibraryId) {
      setSelectedLibraryId(libraries[0].id);
    }
  }, [libraries, selectedLibraryId]);

  // Calculate reverse map validity
  const mapResult = useMemo(() => mapExamQuestionToBankQuestion(draft), [draft]);

  if (!isOpen) return null;

  const meta = getQuestionTypeMeta(draft.type);
  const hasBankRef = Boolean(initialQuestion?.bankRef || draft?.bankRef);

  // Equation Editor trigger
  const handleOpenEquation = (mode: 'math' | 'phys' | 'chem', field: 'title' | 'explanation' | 'option', optionId?: string) => {
    setEquationMode(mode);
    setTargetEquationField({ field, optionId });
    setIsEquationModalOpen(true);
  };

  const handleInsertEquation = (latexStr: string) => {
    if (targetEquationField.field === 'title') {
      setDraft((prev) => ({
        ...prev,
        title: prev.title ? `${prev.title} ${latexStr}` : latexStr,
      }));
    } else if (targetEquationField.field === 'explanation') {
      setDraft((prev) => ({
        ...prev,
        explanation: prev.explanation ? `${prev.explanation} ${latexStr}` : latexStr,
      }));
    } else if (targetEquationField.field === 'option' && targetEquationField.optionId) {
      setDraft((prev) => ({
        ...prev,
        options: prev.options?.map((opt) =>
          opt.id === targetEquationField.optionId
            ? { ...opt, text: opt.text ? `${opt.text} ${latexStr}` : latexStr }
            : opt
        ),
      }));
    }
  };

  // Image attachment
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((prev) => ({
        ...prev,
        questionImage: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Save handler with validation
  const handlePerformSave = async (addAnother: boolean = false) => {
    if (!draft.title.trim()) {
      alert('يرجى كتابة نص السؤال أولاً');
      return;
    }

    // 1. Call existing onSave FIRST (exam flow must never depend on the bank)
    onSave(draft, addAnother);

    // 2. If saveToBank is checked and mappable, call useCreateBankItem
    if (saveToBank && mapResult.ok && selectedLibraryId) {
      setIsSavingBank(true);
      try {
        const targetLib = libraries.find((l) => String(l.id) === String(selectedLibraryId));
        await createBankItemMutation.mutateAsync({
          kind: 'question',
          libraryId: selectedLibraryId,
          unit: unitTitle?.trim() || undefined,
          question: mapResult.question,
          tags: [],
        });
        toast.success(`تم حفظ نسخة في «${targetLib?.name || 'المكتبة'}»`);
      } catch {
        toast.error('السؤال اتضاف للاختبار بس ماتحفظش في البنك');
      } finally {
        setIsSavingBank(false);
      }
    }

    if (!addAnother) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] text-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isNew ? 'إضافة سؤال جديد' : 'تعديل السؤال'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {meta.label} • السؤال {questionIndex + 1}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* 1. Question Textarea with Top/Bottom Math & Image Toolbar */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              نص السؤال <span className="text-rose-500">*</span>
            </label>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs focus-within:border-blue-500 transition">
              <textarea
                rows={3}
                value={draft.title}
                onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                placeholder={
                  draft.type === 'fill_blanks'
                    ? 'مثال: عاصمة جمهورية مصر العربية هي {dash} وعاصمة السعودية هي {dash}.'
                    : 'اكتب السؤال هنا... ولإضافة معادلة أو صيغة علمية استخدم الأزرار بالأسفل'
                }
                className="w-full p-3.5 bg-transparent border-0 outline-none text-xs md:text-sm font-bold text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed"
              />

              {/* Math & Science Toolbar (Matching prototype .toolbar & .tool) */}
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 border-t border-slate-100 flex-wrap text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenEquation('math', 'title')}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Calculator size={14} />
                  <span>معادلة رياضية</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEquation('phys', 'title')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Atom size={14} />
                  <span>فيزياء</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEquation('chem', 'title')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FlaskConical size={14} />
                  <span>كيمياء</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ImageIcon size={14} />
                  <span>صورة</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </button>
              </div>
            </div>

            {/* Live Preview if KaTeX or Image attached (Matching .preview) */}
            {(draft.title.includes('$') || draft.title.includes('\\') || draft.questionImage) && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">
                  معاينة كما يراها الطالب:
                </span>
                <div className="text-sm font-bold text-slate-800">
                  <KaTeXRenderer content={draft.title} />
                </div>

                {draft.questionImage && (
                  <div className="relative inline-block mt-2">
                    <img
                      src={draft.questionImage}
                      alt="Question image preview"
                      className="max-h-44 rounded-xl border border-slate-200 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, questionImage: '' }))}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Question Type Specific Answers Area (Matching answersEditor) */}
          <div className="space-y-3">
            {/* MCQ Mode */}
            {draft.type === 'mcq' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">الإجابات والخيارات</span>
                  <span className="text-[11px] text-slate-400">
                    {draft.conditions?.multipleCorrectAnswer
                      ? 'علّم على كل الإجابات الصحيحة'
                      : 'اضغط الدائرة لتحديد الإجابة الصحيحة'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {draft.options?.map((option, idx) => {
                    const isCorrect = option.is_correct;

                    return (
                      <div key={option.id} className="space-y-1">
                        <div
                          className={`flex items-center gap-2.5 p-2.5 px-3.5 rounded-2xl border transition-all ${isCorrect
                            ? 'border-emerald-500 bg-emerald-50/50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                        >
                          {/* Pick Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (draft.conditions?.multipleCorrectAnswer) {
                                const updated = draft.options?.map((o) =>
                                  o.id === option.id ? { ...o, is_correct: !o.is_correct } : o
                                );
                                setDraft((prev) => ({ ...prev, options: updated }));
                              } else {
                                const updated = draft.options?.map((o) => ({
                                  ...o,
                                  is_correct: o.id === option.id,
                                }));
                                setDraft((prev) => ({ ...prev, options: updated }));
                              }
                            }}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition cursor-pointer flex-shrink-0 ${isCorrect
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                              }`}
                          >
                            {isCorrect && <Check size={12} strokeWidth={3} />}
                          </button>

                          {/* Letter Badge */}
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                            {option.letter}
                          </div>

                          {/* Input */}
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => {
                              const updated = draft.options?.map((o) =>
                                o.id === option.id ? { ...o, text: e.target.value } : o
                              );
                              setDraft((prev) => ({ ...prev, options: updated }));
                            }}
                            placeholder={`الإجابة ${idx + 1}...`}
                            className="flex-1 bg-transparent border-0 outline-none text-xs font-bold text-slate-800"
                          />

                          {isCorrect && (
                            <span className="text-[11px] font-bold text-emerald-600 whitespace-nowrap">
                              صحيحة
                            </span>
                          )}

                          {/* Equation button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEquation('math', 'option', option.id)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition"
                            title="إدراج معادلة للخيار"
                          >
                            <Calculator size={14} />
                          </button>

                          {/* Delete option */}
                          {(draft.options?.length || 0) > 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = draft.options?.filter((o) => o.id !== option.id) || [];
                                const reindexed = filtered.map((o, i) => ({
                                  ...o,
                                  letter: OPTION_LETTERS[i % OPTION_LETTERS.length] || `خيار ${i + 1}`,
                                }));
                                setDraft((prev) => ({ ...prev, options: reindexed }));
                              }}
                              className="p-1 text-slate-400 hover:text-rose-500 transition"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        {/* Option formula preview */}
                        {option.text && (option.text.includes('$') || option.text.includes('\\')) && (
                          <div className="px-3 py-1 text-xs text-slate-700 bg-slate-50 rounded-lg border border-slate-100">
                            <KaTeXRenderer content={option.text} inline />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Option Button */}
                  {(draft.options?.length || 0) < 6 && (
                    <button
                      type="button"
                      onClick={() => {
                        const nextIndex = draft.options?.length || 0;
                        const nextLetter = OPTION_LETTERS[nextIndex % OPTION_LETTERS.length] || `خيار ${nextIndex + 1}`;
                        const newOption: McqOption = {
                          id: Date.now().toString(),
                          letter: nextLetter,
                          text: '',
                          is_correct: false,
                        };
                        setDraft((prev) => ({
                          ...prev,
                          options: [...(prev.options || []), newOption],
                        }));
                      }}
                      className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 text-blue-600 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus size={15} />
                      <span>إضافة اختيار</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* True / False Mode */}
            {draft.type === 'true_false' && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">الإجابة الصحيحة</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, trueFalseValue: true }))}
                    className={`p-4 rounded-2xl border font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${draft.trueFalseValue === true
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                  >
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span>صح (صحيح)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, trueFalseValue: false }))}
                    className={`p-4 rounded-2xl border font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${draft.trueFalseValue === false
                      ? 'border-rose-500 bg-rose-50 text-rose-800 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                  >
                    <X size={18} className="text-rose-500" />
                    <span>خطأ (غير صحيح)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Fill in Blanks / Short Answer Mode */}
            {(draft.type === 'fill_blanks' || draft.type === 'short_answer') && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {draft.type === 'fill_blanks' ? 'الكلمات الصحيحة للفراغات' : 'الإجابة النموذجية الصحيحة'}
                </label>
                <input
                  type="text"
                  value={
                    draft.type === 'fill_blanks'
                      ? draft.blanksAnswers?.join(' | ') || ''
                      : draft.sampleAnswer || ''
                  }
                  onChange={(e) => {
                    if (draft.type === 'fill_blanks') {
                      const splitted = e.target.value.split('|').map((s) => s.trim());
                      setDraft((prev) => ({ ...prev, blanksAnswers: splitted }));
                    } else {
                      setDraft((prev) => ({ ...prev, sampleAnswer: e.target.value }));
                    }
                  }}
                  placeholder="مثال: القاهرة | Cairo"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400">
                  لو هناك أكثر من إجابة مقبولة افصل بينهم بعلامة <b className="font-mono text-blue-600">|</b> (مثال: seen | have seen).
                </p>
              </div>
            )}

            {/* Matching Mode */}
            {draft.type === 'matching' && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 block">
                  الأزواج — الطالب سيقوم بتوصيل كل عنصر بمقابله
                </span>
                <div className="space-y-2">
                  {draft.matchingPairs?.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={p.prompt}
                        onChange={(e) => {
                          const updated = draft.matchingPairs?.map((item) =>
                            item.id === p.id ? { ...item, prompt: e.target.value } : item
                          );
                          setDraft((prev) => ({ ...prev, matchingPairs: updated }));
                        }}
                        placeholder={`العنصر ${i + 1}`}
                        className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                      />
                      <ArrowLeftRight size={14} className="text-slate-400" />
                      <input
                        type="text"
                        value={p.target}
                        onChange={(e) => {
                          const updated = draft.matchingPairs?.map((item) =>
                            item.id === p.id ? { ...item, target: e.target.value } : item
                          );
                          setDraft((prev) => ({ ...prev, matchingPairs: updated }));
                        }}
                        placeholder={`المقابل الصحيح ${i + 1}`}
                        className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = draft.matchingPairs?.filter((item) => item.id !== p.id);
                          setDraft((prev) => ({ ...prev, matchingPairs: filtered }));
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newP: MatchingPair = {
                        id: Date.now().toString(),
                        prompt: '',
                        target: '',
                      };
                      setDraft((prev) => ({
                        ...prev,
                        matchingPairs: [...(prev.matchingPairs || []), newP],
                      }));
                    }}
                    className="w-full py-2 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-blue-600 hover:bg-blue-50 transition"
                  >
                    + إضافة زوج
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Score Stepper & Difficulty (Matching prototype) */}
          <div className="flex items-end justify-between gap-4 pt-2 border-t border-slate-100 flex-wrap">
            {/* Marks Stepper */}
            <div>
              <span className="block text-xs font-bold text-slate-700 mb-1.5">الدرجة</span>
              <div className="inline-flex items-center h-10 border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      conditions: {
                        ...prev.conditions,
                        score: Math.min(20, (prev.conditions?.score || 1) + 1),
                      },
                    }))
                  }
                  className="w-9 h-full flex items-center justify-center hover:bg-slate-50 text-slate-600"
                >
                  <Plus size={14} />
                </button>
                <b className="px-3 font-mono font-bold text-sm text-slate-900">
                  {draft.conditions?.score || 1}
                </b>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      conditions: {
                        ...prev.conditions,
                        score: Math.max(1, (prev.conditions?.score || 1) - 1),
                      },
                    }))
                  }
                  className="w-9 h-full flex items-center justify-center hover:bg-slate-50 text-slate-600"
                >
                  -
                </button>
              </div>
            </div>

            {/* Question Conditions Switch */}
            <div className="space-y-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.conditions?.isRequired !== false}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      conditions: { ...prev.conditions, isRequired: e.target.checked },
                    }))
                  }
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="font-bold text-slate-700">إجابة مطلوبة (إلزامي)</span>
              </label>
              {draft.type === 'mcq' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!draft.conditions?.multipleCorrectAnswer}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        conditions: { ...prev.conditions, multipleCorrectAnswer: e.target.checked },
                      }))
                    }
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span className="font-bold text-slate-700">تعدد الإجابات الصحيحة</span>
                </label>
              )}
            </div>
          </div>

          {/* 4. Explanation & Model Answer (Matching prototype details) */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                شرح الإجابة والحل بالتفصيل (يظهر للطالب بعد الاختبار)
              </label>
              <button
                type="button"
                onClick={() => handleOpenEquation('math', 'explanation')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Calculator size={13} />
                <span>معادلة بالشرح</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={draft.explanation || ''}
              onChange={(e) => setDraft((prev) => ({ ...prev, explanation: e.target.value }))}
              placeholder="اشرح الحل خطوة بخطوة للطلاب..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* 5. Save to Bank Checkbox Card (Shown only when question has no bankRef) */}
          {!hasBankRef && (
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
              <label
                className={`flex items-start gap-2.5 ${!mapResult.ok || (!isLibrariesLoading && libraries.length === 0)
                  ? 'opacity-60 cursor-not-allowed'
                  : 'cursor-pointer'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={saveToBank && mapResult.ok && libraries.length > 0}
                  onChange={(e) => setSaveToBank(e.target.checked)}
                  disabled={!mapResult.ok || (!isLibrariesLoading && libraries.length === 0) || isSavingBank}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 disabled:cursor-not-allowed"
                />
                <div className="flex-1">
                  <b className="text-xs font-bold text-blue-950 block">حفظ نسخة في بنك المحتوى</b>
                  <span className="text-[11px] text-blue-700">
                    حتى تتمكن من إعادة استخدام هذا السؤال في أي اختبار قادم بسهولة
                  </span>
                </div>
              </label>

              {/* Warning/Reason if draft is not mappable */}
              {!mapResult.ok && (
                <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/90 rounded-xl px-3 py-2 flex items-center gap-1.5">
                  <span className="shrink-0">⚠️</span>
                  <span>{mapResult.reason}</span>
                </div>
              )}

              {/* Warning if no libraries exist */}
              {!isLibrariesLoading && libraries.length === 0 && (
                <div className="text-[11px] text-slate-700 bg-white/90 border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span>اعمل مكتبة الأول من بنك المحتوى</span>
                  <Link
                    href="/academic/bank"
                    target="_blank"
                    className="text-blue-600 hover:text-blue-700 font-bold underline ms-2 shrink-0"
                  >
                    الانتقال للبنك
                  </Link>
                </div>
              )}

              {/* Library Selector when checked and mappable */}
              {saveToBank && mapResult.ok && libraries.length > 0 && (
                <div className="pt-2.5 border-t border-blue-100/80 flex flex-col sm:flex-row sm:items-center gap-2">
                  <label htmlFor="bank-library-select" className="text-xs font-bold text-blue-950 shrink-0">
                    اختر المكتبة:
                  </label>
                  <select
                    id="bank-library-select"
                    value={selectedLibraryId}
                    onChange={(e) => setSelectedLibraryId(e.target.value)}
                    disabled={isLibrariesLoading || isSavingBank}
                    className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 transition disabled:bg-slate-100 cursor-pointer"
                  >
                    {isLibrariesLoading ? (
                      <option value="">جارٍ تحميل المكتبات...</option>
                    ) : (
                      libraries.map((lib) => (
                        <option key={lib.id} value={lib.id}>
                          {lib.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Foot Bar (Matching sh-foot with Save & Save + Add Another) */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSavingBank}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition disabled:opacity-50"
          >
            إلغاء
          </button>

          <button
            type="button"
            disabled={isSavingBank}
            onClick={() => handlePerformSave(false)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingBank ? 'جارٍ الحفظ...' : isNew ? 'حفظ السؤال' : 'حفظ التعديلات'}
          </button>

          {isNew && (
            <button
              type="button"
              disabled={isSavingBank}
              onClick={() => handlePerformSave(true)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSavingBank ? 'جارٍ الحفظ...' : 'حفظ وإضافة سؤال آخر'}</span>
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Equation Editor Modal */}
      <EquationEditorModal
        isOpen={isEquationModalOpen}
        onClose={() => setIsEquationModalOpen(false)}
        onInsert={handleInsertEquation}
      />
    </div>
  );
};
