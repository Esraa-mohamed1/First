'use client';

import React, { useState } from 'react';
import {
  Plus,
  Layers,
  GripVertical,
  MoreVertical,
  AlertTriangle,
  Eye,
  ChevronLeft,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { ExamQuestion, QuestionType } from '@/types/academic/exam.types';
import { getQuestionTypeMeta, OPTION_LETTERS } from './constants';
import { KaTeXRenderer } from './KaTeXRenderer';
import { AddQuestionModal } from './AddQuestionModal';
import { QuestionEditorModal } from './QuestionEditorModal';
import { BankPickerModal } from './BankPickerModal';

interface ExamOverviewTabProps {
  questions: ExamQuestion[];
  onAddQuestion: (newQuestion: ExamQuestion) => void;
  onUpdateQuestion: (updated: ExamQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (id: string) => void;
  onOpenPreview: () => void;
  onGoToSettingsOrPublish: () => void;
  courseTitle?: string;
  unitTitle?: string;
}

export const ExamOverviewTab: React.FC<ExamOverviewTabProps> = ({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onOpenPreview,
  onGoToSettingsOrPublish,
  courseTitle = 'الاختبار الحالي',
  unitTitle,
}) => {
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false);
  const [isBankPickerOpen, setIsBankPickerOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{ question: ExamQuestion; isNew: boolean; index: number } | null>(null);
  const [activeMenuQuestionId, setActiveMenuQuestionId] = useState<string | null>(null);

  // Total points calculation
  const totalPoints = questions.reduce((sum, q) => sum + (q.conditions?.score || 1), 0);

  // Question validation check
  const getQuestionError = (q: ExamQuestion): string | null => {
    if (!q.title.trim()) {
      return 'لم يتم كتابة نص السؤال';
    }
    if (q.type === 'mcq') {
      const hasCorrect = q.options?.some((o) => o.is_correct && o.text.trim() !== '');
      if (!hasCorrect) {
        return 'لم يتم تحديد الإجابة الصحيحة أو الخيارات فارغة';
      }
    }
    if (q.type === 'fill_blanks') {
      if (!q.blanksTemplate?.includes('{dash}') || !q.blanksAnswers?.length) {
        return 'لم يتم كتابة الفراغات أو إجاباتها';
      }
    }
    return null;
  };

  // When a type is chosen from AddQuestionModal, initialize a draft and open QuestionEditorModal
  const handleSelectTypeToCreate = (type: QuestionType) => {
    const newId = Date.now().toString();
    const newQuestion: ExamQuestion = {
      id: newId,
      type,
      title: '',
      description: '',
      explanation: '',
      conditions: {
        score: 2,
        isRequired: true,
        multipleCorrectAnswer: false,
      },
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
    }

    setEditingQuestion({
      question: newQuestion,
      isNew: true,
      index: questions.length,
    });
  };

  // Save question from QuestionEditorModal
  const handleSaveQuestion = (savedQ: ExamQuestion, addAnother: boolean = false) => {
    if (editingQuestion?.isNew) {
      onAddQuestion(savedQ);
    } else {
      onUpdateQuestion(savedQ);
    }

    if (addAnother) {
      // Re-open type picker or fresh question
      handleSelectTypeToCreate(savedQ.type);
    } else {
      setEditingQuestion(null);
    }
  };

  // Bulk add from Bank
  const handleBulkAddFromBank = (importedQuestions: ExamQuestion[]) => {
    importedQuestions.forEach((q) => onAddQuestion(q));
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto p-4 md:p-8 select-none custom-scrollbar" dir="rtl">
      <div className="max-w-3xl mx-auto w-full space-y-5">
        {/* Header Row: Status Badge & Questions/Points Count (Matching Screenshot) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">
              {questions.length} سؤال • {totalPoints} {totalPoints === 1 ? 'درجة' : 'درجات'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>مسودة</span>
          </div>
        </div>

        {/* Action Buttons Row: + إضافة سؤال (Blue) & من بنك الأسئلة (Light Blue) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsTypePickerOpen(true)}
            className="py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>إضافة سؤال</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBankPickerOpen(true)}
            className="py-3.5 px-5 rounded-2xl bg-blue-50/80 hover:bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
          >
            <Layers size={18} />
            <span>من بنك الأسئلة</span>
          </button>
        </div>

        {/* Questions Cards List */}
        <div className="space-y-3 pt-1">
          {questions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Plus size={28} />
              </div>
              <h4 className="font-bold text-slate-800 text-base">لا توجد أسئلة مضافة بعد</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                اكتب سؤالاً جديداً — مع معادلات رياضيات وفيزياء وكيمياء — أو أضف أسئلة جاهزة من بنك المحتوى.
              </p>
              <button
                type="button"
                onClick={() => setIsTypePickerOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition cursor-pointer"
              >
                + أضف أول سؤال
              </button>
            </div>
          ) : (
            questions.map((question, index) => {
              const meta = getQuestionTypeMeta(question.type);
              const score = question.conditions?.score || 1;
              const errorMsg = getQuestionError(question);
              const hasError = !!errorMsg;
              const formattedIndex = (index + 1).toString().padStart(2, '0');

              return (
                <div
                  key={question.id}
                  onClick={() =>
                    setEditingQuestion({
                      question,
                      isNew: false,
                      index,
                    })
                  }
                  className={`rounded-2xl border p-4 transition-all bg-white relative text-right shadow-2xs hover:shadow-sm cursor-pointer ${
                    hasError
                      ? 'border-rose-300 bg-rose-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: 3-dots Action Menu */}
                    <div
                      className="relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuQuestionId(
                            activeMenuQuestionId === question.id ? null : question.id
                          )
                        }
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuQuestionId === question.id && (
                        <div className="absolute left-0 top-8 z-30 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 w-36 space-y-1 text-right animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuQuestionId(null);
                              setEditingQuestion({
                                question,
                                isNew: false,
                                index,
                              });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition"
                          >
                            <Edit2 size={13} className="text-blue-600" />
                            <span>تعديل</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuQuestionId(null);
                              onDuplicateQuestion(question.id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition"
                          >
                            <Copy size={13} className="text-slate-500" />
                            <span>تكرار</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuQuestionId(null);
                              onDeleteQuestion(question.id);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 size={13} />
                            <span>حذف</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right: Question Number, Grip & Title */}
                    <div className="flex-1 flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        {/* Question Title / Math formula */}
                        <div className="text-sm font-bold text-slate-800 leading-relaxed">
                          {question.title ? (
                            <KaTeXRenderer content={question.title} inline />
                          ) : (
                            <span className="text-slate-400 italic">سؤال جديد بدون عنوان</span>
                          )}
                        </div>

                        {/* Badges line: Type, Score, Bank */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                            {meta.label}
                          </span>

                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono font-bold">
                            {score} {score === 1 ? 'درجة' : 'درجات'}
                          </span>

                          <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold flex items-center gap-1">
                            <Layers size={11} />
                            <span>من البنك</span>
                          </span>
                        </div>

                        {/* Error Warning message if incomplete */}
                        {hasError && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 pt-1">
                            <AlertTriangle size={14} className="flex-shrink-0" />
                            <span>{errorMsg}</span>
                          </div>
                        )}
                      </div>

                      {/* Number & Grip Icon */}
                      <div className="flex items-center gap-1.5 text-slate-400 pt-0.5 flex-shrink-0">
                        <span className="text-xs font-mono font-bold">{formattedIndex}</span>
                        <GripVertical size={16} className="cursor-grab text-slate-300 hover:text-slate-500" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drag helper text */}
        {questions.length > 1 && (
          <p className="text-center text-xs text-slate-400 font-medium pt-2 flex items-center justify-center gap-1">
            <span>اسحب</span>
            <GripVertical size={14} className="inline-block" />
            <span>لإعادة ترتيب الأسئلة</span>
          </p>
        )}
      </div>

      {/* Sticky Bottom Action Bar (Matching screenshot) */}
      <div className="pt-6 border-t border-slate-100 max-w-3xl mx-auto w-full flex items-center gap-3">
        {/* Preview Button */}
        <button
          type="button"
          onClick={onOpenPreview}
          className="px-6 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-blue-600 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Eye size={18} />
          <span>معاينة</span>
        </button>

        {/* Next to Publish Button */}
        <button
          type="button"
          onClick={onGoToSettingsOrPublish}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
        >
          <span>متابعة للنشر</span>
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* 1. Question Type Picker Sheet Modal */}
      <AddQuestionModal
        isOpen={isTypePickerOpen}
        onClose={() => setIsTypePickerOpen(false)}
        onSelectType={handleSelectTypeToCreate}
        onOpenContentBank={() => setIsBankPickerOpen(true)}
      />

      {/* 2. Detailed Question Editor Modal (When editing or adding a question) */}
      {editingQuestion && (
        <QuestionEditorModal
          isOpen={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          question={editingQuestion.question}
          questionIndex={editingQuestion.index}
          isNew={editingQuestion.isNew}
          onSave={handleSaveQuestion}
          unitTitle={unitTitle}
        />
      )}

      {/* 3. Question Bank Picker Modal */}
      <BankPickerModal
        isOpen={isBankPickerOpen}
        onClose={() => setIsBankPickerOpen(false)}
        onAddSelected={handleBulkAddFromBank}
        courseTitle={courseTitle}
      />
    </div>
  );
};
