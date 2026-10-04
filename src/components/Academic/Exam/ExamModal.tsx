'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  ExamPayload,
  ExamQuestion,
  ExamSettings,
  QuestionConditions,
  QuestionType,
} from '@/types/academic/exam.types';
import { createExamLesson, defaultExamSettings, updateExamLesson } from '@/services/academic/examService';
import { ExamHeader } from './ExamHeader';
import { ExamQuestionsSidebar } from './ExamQuestionsSidebar';
import { QuestionSettingsSidebar } from './QuestionSettingsSidebar';
import { QuestionEditor } from './QuestionEditor';
import { ExamSettingsTab } from './ExamSettingsTab';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: number;
  courseId?: number;
  unitTitle?: string;
  courseTitle?: string;
  onExamSaved?: () => void;
  initialData?: ExamPayload | null;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  unitId,
  courseId,
  unitTitle = '',
  courseTitle = '',
  onExamSaved,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>('questions');
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ExamSettings>(defaultExamSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setExamTitle(initialData.title || '');
        setExamDescription(initialData.description || '');
        setQuestions(initialData.questions || []);
        setActiveQuestionId(initialData.questions?.[0]?.id || null);
        setSettings(initialData.settings || defaultExamSettings);
      } else {
        setExamTitle(`اختبار : (${unitTitle || 'الوحدة'})`);
        setExamDescription('');
        setQuestions([]);
        setActiveQuestionId(null);
        setSettings(defaultExamSettings);
      }
      setActiveTab('questions');
    }
  }, [isOpen, initialData, unitTitle]);

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
        { id: '1', letter: 'A', text: '', is_correct: true },
        { id: '2', letter: 'B', text: '', is_correct: false },
      ];
    } else if (type === 'true_false') {
      newQuestion.trueFalseValue = true;
    } else if (type === 'fill_blanks') {
      newQuestion.blanksTemplate = '';
      newQuestion.blanksAnswers = [];
    } else if (type === 'matching') {
      newQuestion.matchingPairs = [];
    } else if (type === 'image_answer') {
      newQuestion.questionImage = '';
      newQuestion.imageExpectedAnswer = '';
    }

    setQuestions((prev) => [...prev, newQuestion]);
    setActiveQuestionId(newId);
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

  // Save / Next
  const handleNextOrSave = async () => {
    if (activeTab === 'questions') {
      if (!examTitle.trim()) {
        toast.error('يرجى كتابة عنوان للاختبار');
        return;
      }
      setActiveTab('settings');
      return;
    }

    // Tab is settings -> Perform Save
    if (!examTitle.trim()) {
      toast.error('يرجى كتابة عنوان للاختبار');
      setActiveTab('questions');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: ExamPayload = {
        id: initialData?.id,
        course_id: courseId,
        chapter_id: unitId,
        unit_id: unitId,
        title: examTitle.trim(),
        description: examDescription.trim(),
        type: 'quiz',
        questions,
        settings,
        is_free: 0,
      };

      if (initialData?.id) {
        await updateExamLesson(initialData.id, payload);
        toast.success('تم تحديث الاختبار بنجاح');
      } else {
        await createExamLesson(payload);
        toast.success('تمت إضافة الاختبار كوحدة درس بنجاح');
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

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[92vh] max-h-[860px] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <ExamHeader
          unitTitle={unitTitle}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNextOrSave={handleNextOrSave}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />

        {/* Tab 1: Questions Builder Tab */}
        {activeTab === 'questions' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Right Sidebar: Questions List & Add Button */}
            <ExamQuestionsSidebar
              courseTitle={courseTitle || 'مبادئ تطوير البرمجيات'}
              questions={questions}
              activeQuestionId={activeQuestionId}
              onSelectQuestion={setActiveQuestionId}
              onAddQuestion={handleAddQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onOpenContentBank={() => toast('بنك الأسئلة قيد التطوير', { icon: 'ℹ️' })}
            />

            {/* Center Area: Active Question Editor */}
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

            {/* Left Sidebar: Question Conditions & Scoring Settings */}
            <QuestionSettingsSidebar
              question={activeQuestion}
              onUpdateConditions={handleUpdateConditions}
            />
          </div>
        ) : (
          /* Tab 2: Settings Tab */
          <ExamSettingsTab settings={settings} onChange={setSettings} />
        )}
      </div>
    </div>
  );
};
