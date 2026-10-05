'use client';

import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  GraduationCap,
  Layers,
  FileQuestion,
  ChevronLeft,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  ExamPayload,
  ExamQuestion,
  ExamSettings,
  QuestionConditions,
  QuestionType,
} from '@/types/academic/exam.types';
import { createExamLesson, defaultExamSettings, updateExamLesson } from '@/services/academic/examService';
import { getCourses, getChaptersByCourse } from '@/services/courses';
import { Course } from '@/types/api';
import { ExamHeader } from './ExamHeader';
import { ExamOverviewTab } from './ExamOverviewTab';
import { ExamQuestionsSidebar } from './ExamQuestionsSidebar';
import { QuestionSettingsSidebar } from './QuestionSettingsSidebar';
import { QuestionEditor } from './QuestionEditor';
import { ExamSettingsTab } from './ExamSettingsTab';
import { ExamPublishTab } from './ExamPublishTab';
import { ExamTakingModal } from './ExamTakingModal';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId?: number;
  courseId?: number;
  unitTitle?: string;
  courseTitle?: string;
  onExamSaved?: () => void;
  initialData?: ExamPayload | null;
  allowTargetSelection?: boolean;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  unitId: initialUnitId = 0,
  courseId: initialCourseId,
  unitTitle = '',
  courseTitle = '',
  onExamSaved,
  initialData,
  allowTargetSelection = false,
}) => {
  // Target setup step state
  const [selectedTargetType, setSelectedTargetType] = useState<'course' | 'independent'>('course');
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(initialCourseId);
  const [selectedUnitId, setSelectedUnitId] = useState<number>(initialUnitId || 0);
  const [isTargetStepCompleted, setIsTargetStepCompleted] = useState<boolean>(!allowTargetSelection && !!initialUnitId);

  // Dynamic courses and units
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);

  // Main Tabs: questions | settings | publish
  const [activeTab, setActiveTab] = useState<'questions' | 'settings' | 'publish'>('questions');

  // Sub-view within questions tab: 'overview' (the screenshot list) vs 'editor' (3-column detailed editor)
  const [questionsViewMode, setQuestionsViewMode] = useState<'overview' | 'editor'>('overview');

  // Exam payload state
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ExamSettings>(defaultExamSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Fetch courses when allowed
  useEffect(() => {
    if (isOpen && allowTargetSelection) {
      const fetchCourses = async () => {
        try {
          setIsLoadingCourses(true);
          const data = await getCourses();
          setCoursesList(data || []);
          if (data?.length > 0 && !selectedCourseId) {
            setSelectedCourseId(data[0].id);
          }
        } catch (err) {
          console.error('Failed to load courses:', err);
        } finally {
          setIsLoadingCourses(false);
        }
      };
      fetchCourses();
    }
  }, [isOpen, allowTargetSelection]);

  // Fetch chapters for selected course
  useEffect(() => {
    if (selectedCourseId && selectedTargetType === 'course') {
      const fetchChapters = async () => {
        try {
          setIsLoadingChapters(true);
          const data = await getChaptersByCourse(selectedCourseId);
          setChaptersList(data || []);
          if (data?.length > 0) {
            setSelectedUnitId(data[0].id);
          } else {
            setSelectedUnitId(0);
          }
        } catch (err) {
          console.error('Failed to load chapters for course:', err);
        } finally {
          setIsLoadingChapters(false);
        }
      };
      fetchChapters();
    }
  }, [selectedCourseId, selectedTargetType]);

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setExamTitle(initialData.title || '');
        setExamDescription(initialData.description || '');
        setQuestions(initialData.questions || []);
        setActiveQuestionId(initialData.questions?.[0]?.id || null);
        setSettings(initialData.settings || defaultExamSettings);
        setSelectedTargetType(initialData.chapter_id ? 'course' : 'independent');
        setSelectedUnitId(initialData.chapter_id || initialUnitId || 0);
        setSelectedCourseId(initialData.course_id || initialCourseId);
        setIsTargetStepCompleted(true);
      } else {
        setExamTitle(unitTitle ? `اختبار: ${unitTitle}` : 'اختبار جديد');
        setExamDescription('');
        setQuestions([]);
        setActiveQuestionId(null);
        setSettings(defaultExamSettings);
        setSelectedUnitId(initialUnitId || 0);
        setSelectedCourseId(initialCourseId);
        setIsTargetStepCompleted(!allowTargetSelection && !!initialUnitId);
      }
      setActiveTab('questions');
      setQuestionsViewMode('overview');
      setIsPreviewModalOpen(false);
    }
  }, [isOpen, initialData, unitTitle, initialUnitId, initialCourseId, allowTargetSelection]);

  if (!isOpen) return null;

  // Active question selector
  const activeQuestion = questions.find((q) => q.id === activeQuestionId) || null;
  const activeQuestionIndex = questions.findIndex((q) => q.id === activeQuestionId);

  // Add question handler
  const handleAddQuestion = (type: QuestionType) => {
    const newId = Date.now().toString();
    const defaultConditions: QuestionConditions = {
      multipleCorrectAnswer: false,
      isRequired: true,
      randomizeChoice: false,
      imageMatching: false,
      score: 1,
      showScore: false,
    };

    let newQuestion: ExamQuestion = {
      id: newId,
      type,
      title: '',
      description: '',
      explanation: '',
      conditions: defaultConditions,
    };

    if (type === 'mcq') {
      newQuestion.options = [
        { id: '1', letter: 'أ', text: '', is_correct: true },
        { id: '2', letter: 'ب', text: '', is_correct: false },
        { id: '3', letter: 'ج', text: '', is_correct: false },
        { id: '4', letter: 'د', text: '', is_correct: false },
      ];
    } else if (type === 'true_false') {
      newQuestion.trueFalseValue = true;
    } else if (type === 'fill_blanks') {
      newQuestion.blanksTemplate = '';
      newQuestion.blanksAnswers = [];
    } else if (type === 'matching') {
      newQuestion.matchingPairs = [
        { id: '1', prompt: '', target: '' },
        { id: '2', prompt: '', target: '' },
      ];
    } else if (type === 'image_answer') {
      newQuestion.questionImage = '';
      newQuestion.imageExpectedAnswer = '';
    }

    setQuestions((prev) => [...prev, newQuestion]);
    setActiveQuestionId(newId);
    setQuestionsViewMode('editor');
  };

  // Delete question handler
  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== id);
      if (activeQuestionId === id) {
        setActiveQuestionId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  // Duplicate question handler
  const handleDuplicateQuestion = (id: string) => {
    const targetQ = questions.find((q) => q.id === id);
    if (!targetQ) return;
    const duplicated: ExamQuestion = {
      ...targetQ,
      id: Date.now().toString(),
      title: `${targetQ.title} (نسخة)`,
    };
    setQuestions((prev) => [...prev, duplicated]);
    toast.success('تم تكرار السؤال بنجاح');
  };

  // Update current question
  const handleUpdateCurrentQuestion = (updated: Partial<ExamQuestion>) => {
    if (!activeQuestionId) return;
    setQuestions((prev) =>
      prev.map((q) => (q.id === activeQuestionId ? { ...q, ...updated } : q))
    );
  };

  // Update current question conditions
  const handleUpdateConditions = (conditionsPartial: Partial<QuestionConditions>) => {
    if (!activeQuestionId) return;
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === activeQuestionId) {
          return {
            ...q,
            conditions: {
              ...q.conditions,
              ...conditionsPartial,
            },
          };
        }
        return q;
      })
    );
  };

  // Open Preview
  const handleOpenPreview = () => {
    if (questions.length === 0) {
      toast.error('يرجى إضافة سؤال واحد على الأقل لمعاينة الاختبار');
      return;
    }
    setIsPreviewModalOpen(true);
  };

  // Perform Final Save / Publish
  const handlePerformSave = async (isPublishing: boolean = true) => {
    if (!examTitle.trim()) {
      toast.error('يرجى كتابة عنوان للاختبار');
      setActiveTab('questions');
      setQuestionsViewMode('overview');
      return;
    }

    if (questions.length === 0) {
      toast.error('يرجى إضافة أسئلة للاختبار قبل الحفظ');
      setActiveTab('questions');
      return;
    }

    try {
      setIsSubmitting(true);
      const effectiveUnitId = selectedTargetType === 'course' ? selectedUnitId : 0;
      const effectiveCourseId = selectedTargetType === 'course' ? selectedCourseId : undefined;

      const payload: ExamPayload = {
        id: initialData?.id,
        course_id: effectiveCourseId,
        chapter_id: effectiveUnitId,
        unit_id: effectiveUnitId,
        title: examTitle.trim(),
        description: examDescription.trim(),
        type: 'quiz',
        questions,
        settings,
        is_free: 0,
      };

      if (initialData?.id) {
        await updateExamLesson(initialData.id, payload);
        toast.success(isPublishing ? 'تم نشر وتحديث الاختبار بنجاح' : 'تم حفظ المسودة بنجاح');
      } else {
        await createExamLesson(payload);
        toast.success(isPublishing ? 'تم إنشاء ونشر الاختبار بنجاح' : 'تم حفظ مسودة الاختبار بنجاح');
      }

      if (onExamSaved) {
        onExamSaved();
      }
      onClose();
    } catch (err: any) {
      console.error('Save exam error:', err);
      toast.error(err?.message || 'فشل حفظ الاختبار، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewPayload: ExamPayload = {
    id: initialData?.id || 1,
    course_id: selectedCourseId,
    chapter_id: selectedUnitId,
    unit_id: selectedUnitId,
    title: examTitle || 'معاينة الاختبار',
    description: examDescription,
    type: 'quiz',
    questions,
    settings,
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
        dir="rtl"
      >
        <div
          className={`bg-white rounded-3xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200 text-slate-800 transition-all ${
            !isTargetStepCompleted
              ? 'max-w-2xl h-auto max-h-[90vh] my-auto'
              : 'max-w-6xl h-[92vh] max-h-[860px]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* STEP 1: TARGET DESTINATION SELECTION (If opened from outside a unit) */}
          {!isTargetStepCompleted ? (
            <div className="flex flex-col p-6 sm:p-8 overflow-y-auto custom-scrollbar">
              <div className="w-full space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-2xs shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        تحديد نوع وجهة الاختبار
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        حدد ما إذا كان الاختبار تابعاً لوحدة في دورة تدريبية أو اختباراً مستقلاً بذاته
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Selection Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Course-Linked Exam */}
                  <div
                    onClick={() => setSelectedTargetType('course')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      selectedTargetType === 'course'
                        ? 'border-blue-600 bg-blue-50/40 shadow-md shadow-blue-500/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                            selectedTargetType === 'course'
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {selectedTargetType === 'course' && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          اختبار مرتبط بدورة تعليمية
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                          يُضاف الاختبار كدرس تقييمي ضمن وحدات دورة مسجلة أو تفاعلية.
                        </p>
                      </div>
                    </div>

                    {selectedTargetType === 'course' && (
                      <div className="space-y-3 pt-3 border-t border-blue-100/80 animate-fadeIn">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            اختر الدورة التدريبية:
                          </label>
                          <select
                            value={selectedCourseId || ''}
                            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition shadow-2xs"
                          >
                            {isLoadingCourses ? (
                              <option>جاري تحميل الدورات...</option>
                            ) : coursesList.length > 0 ? (
                              coursesList.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.title}
                                </option>
                              ))
                            ) : (
                              <option value="">لا توجد دورات متاحة</option>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            اختر الوحدة الدراسية:
                          </label>
                          <select
                            value={selectedUnitId || ''}
                            onChange={(e) => setSelectedUnitId(Number(e.target.value))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition shadow-2xs"
                          >
                            {isLoadingChapters ? (
                              <option>جاري تحميل الوحدات...</option>
                            ) : chaptersList.length > 0 ? (
                              chaptersList.map((ch) => (
                                <option key={ch.id} value={ch.id}>
                                  {ch.title || `الوحدة #${ch.id}`}
                                </option>
                              ))
                            ) : (
                              <option value="0">الوحدة العامة للدورة</option>
                            )}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Independent Exam */}
                  <div
                    onClick={() => setSelectedTargetType('independent')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      selectedTargetType === 'independent'
                        ? 'border-purple-600 bg-purple-50/40 shadow-md shadow-purple-500/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold shadow-2xs">
                          <FileQuestion className="w-5 h-5" />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                            selectedTargetType === 'independent'
                              ? 'border-purple-600 bg-purple-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {selectedTargetType === 'independent' && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          اختبار تقييمي مستقل
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                          اختبار منفصل ومستقل بذاته للقبول، تحديد المستوى، أو المسابقات العامة.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between w-full">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
                  >
                    إلغاء
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTargetStepCompleted(true)}
                    className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <span>متابعة وبناء الأسئلة</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: COMPLETE DARAB EXAM BUILDER (Exact Screenshot & 3-Column Editor) */
            <>
              {/* Top Header */}
              <ExamHeader
                title={examTitle}
                targetSubtitle={
                  selectedTargetType === 'course'
                    ? `محفوظ تلقائياً • ${chaptersList.find((ch) => ch.id === selectedUnitId)?.title || unitTitle || 'مرتبط بدورة'}`
                    : 'محفوظ تلقائياً • اختبار مستقل'
                }
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  if (tab === 'questions') {
                    setQuestionsViewMode('overview');
                  }
                }}
                onBackOrCancel={() => {
                  if (questionsViewMode === 'editor') {
                    setQuestionsViewMode('overview');
                  } else {
                    onClose();
                  }
                }}
                onOpenPreview={handleOpenPreview}
                questionsCount={questions.length}
              />

              {/* TAB 1: QUESTIONS */}
              {activeTab === 'questions' && (
                questionsViewMode === 'overview' ? (
                  /* Overview Sequence List (Matching User's Screenshot) */
                  <ExamOverviewTab
                    questions={questions}
                    onAddQuestion={(newQ) => {
                      setQuestions((prev) => [...prev, newQ]);
                    }}
                    onUpdateQuestion={(updatedQ) => {
                      setQuestions((prev) =>
                        prev.map((q) => (q.id === updatedQ.id ? updatedQ : q))
                      );
                    }}
                    onDeleteQuestion={handleDeleteQuestion}
                    onDuplicateQuestion={handleDuplicateQuestion}
                    onOpenPreview={handleOpenPreview}
                    onGoToSettingsOrPublish={() => setActiveTab('publish')}
                    courseTitle={
                      selectedTargetType === 'course'
                        ? chaptersList.find((ch) => ch.id === selectedUnitId)?.title || unitTitle || 'الوحدة التدريبية'
                        : 'اختبار مستقل'
                    }
                  />
                ) : (
                  /* 3-Column Question Editor (Matching media_1791103057139.png) */
                  <div className="flex-1 flex overflow-hidden">
                    {/* Right Column: Questions List Sidebar */}
                    <ExamQuestionsSidebar
                      courseTitle={courseTitle || (selectedTargetType === 'course' ? 'مبادئ تطوير البرمجيات' : 'اختبار مستقل')}
                      questions={questions}
                      activeQuestionId={activeQuestionId}
                      onSelectQuestion={(id) => {
                        setActiveQuestionId(id);
                      }}
                      onAddQuestion={handleAddQuestion}
                      onDeleteQuestion={handleDeleteQuestion}
                      onOpenContentBank={() => toast('بنك الأسئلة قيد التطوير', { icon: 'ℹ️' })}
                    />

                    {/* Middle Column: Question Editor with options & explanation */}
                    <QuestionEditor
                      question={activeQuestion}
                      questionIndex={activeQuestionIndex >= 0 ? activeQuestionIndex : 0}
                      examTitle={examTitle}
                      examDescription={examDescription}
                      onUpdateExamMeta={(title, desc) => {
                        setExamTitle(title);
                        setExamDescription(desc);
                      }}
                      onUpdateQuestion={handleUpdateCurrentQuestion}
                    />

                    {/* Left Column: Question Conditions & Score Settings */}
                    <QuestionSettingsSidebar
                      question={activeQuestion}
                      onUpdateConditions={handleUpdateConditions}
                    />
                  </div>
                )
              )}

              {/* TAB 2: SETTINGS */}
              {activeTab === 'settings' && (
                <ExamSettingsTab settings={settings} onChange={setSettings} />
              )}

              {/* TAB 3: PUBLISH */}
              {activeTab === 'publish' && (
                <ExamPublishTab
                  exam={previewPayload}
                  onPublish={() => handlePerformSave(true)}
                  onSaveDraft={() => handlePerformSave(false)}
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Live Interactive Preview Modal */}
      {isPreviewModalOpen && (
        <ExamTakingModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          exam={previewPayload}
          isPreviewMode={true}
        />
      )}
    </>
  );
};
