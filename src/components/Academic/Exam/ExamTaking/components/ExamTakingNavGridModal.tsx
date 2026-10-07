import React from 'react';
import { LayoutGrid, X } from 'lucide-react';
import { ExamPayload, ExamQuestion } from '@/types/academic/exam.types';

interface ExamTakingNavGridModalProps {
  isOpen: boolean;
  exam: ExamPayload;
  questions: ExamQuestion[];
  currentIndex: number;
  totalQuestions: number;
  flaggedQuestionIds: Set<string>;
  isQuestionAnswered: (q: ExamQuestion) => boolean;
  onSelectQuestion: (index: number) => void;
  onClose: () => void;
}

export const ExamTakingNavGridModal: React.FC<ExamTakingNavGridModalProps> = ({
  isOpen,
  exam,
  questions,
  currentIndex,
  totalQuestions,
  flaggedQuestionIds,
  isQuestionAnswered,
  onSelectQuestion,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-600" />
            <span>خريطة الأسئلة ({totalQuestions})</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-1 pb-2 border-b border-slate-100">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> تم الإجابة
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> مميز للمراجعة
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border border-slate-300 inline-block" /> لم يجب
          </span>
        </div>

        {/* Grid Pills */}
        <div className="grid grid-cols-5 gap-2.5 max-h-60 overflow-y-auto p-1 custom-scrollbar">
          {questions.map((q, idx) => {
            const isAnswered = isQuestionAnswered(q);
            const isFlagged = flaggedQuestionIds.has(q.id);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  if (exam?.settings?.basic?.linearNavigation && idx > currentIndex) {
                    return;
                  }
                  onSelectQuestion(idx);
                  onClose();
                }}
                className={`h-11 rounded-xl font-mono font-bold text-sm transition relative flex items-center justify-center cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-blue-500 ring-offset-2 font-extrabold'
                    : ''
                } ${
                  isFlagged
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : isAnswered
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
        >
          العودة للاختبار
        </button>
      </div>
    </div>
  );
};
