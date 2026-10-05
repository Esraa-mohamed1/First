'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Database,
  GripVertical,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { ExamQuestion, QuestionType } from '@/types/academic/exam.types';
import { getQuestionTypeMeta } from './constants';
import { AddQuestionModal } from './AddQuestionModal';
import { KaTeXRenderer } from './KaTeXRenderer';

interface ExamQuestionsSidebarProps {
  courseTitle?: string;
  questions: ExamQuestion[];
  activeQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  onAddQuestion: (type: QuestionType) => void;
  onDeleteQuestion: (id: string) => void;
  onOpenContentBank?: () => void;
}

export const ExamQuestionsSidebar: React.FC<ExamQuestionsSidebarProps> = ({
  courseTitle = 'مبادئ تطوير البرمجيات',
  questions,
  activeQuestionId,
  onSelectQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onOpenContentBank,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 select-none h-full" dir="rtl">
      {/* Top Header: Questions Count & Add Button */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <span className="text-xs font-bold text-slate-800 block">
            قائمة الأسئلة ({questions.length})
          </span>
          <span className="text-[11px] text-slate-400 font-medium truncate block max-w-[140px]" title={courseTitle}>
            {courseTitle}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer"
        >
          <Plus size={15} />
          <span>سؤال جديد</span>
        </button>
      </div>

      {/* Questions List (Matching .qrow styling from prototype) */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
        {questions.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <HelpCircle size={24} />
            </div>
            <p className="text-xs font-bold text-slate-700">لم تتم إضافة أي أسئلة بعد</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              اضغط على زر "سؤال جديد" بالأعلى لاختيار نوع السؤال والبدء في الإعداد.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition"
            >
              + إضافة أول سؤال
            </button>
          </div>
        ) : (
          questions.map((question, index) => {
            const meta = getQuestionTypeMeta(question.type);
            const isActive = question.id === activeQuestionId;
            const score = question.conditions?.score || 1;

            return (
              <div
                key={question.id}
                onClick={() => onSelectQuestion(question.id)}
                className={`group flex items-start gap-2 p-3 rounded-2xl border transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-blue-50/60 border-blue-400 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {/* Grip Drag Handle */}
                <div className="pt-0.5 text-slate-300 group-hover:text-slate-400 cursor-grab flex-shrink-0">
                  <GripVertical size={16} />
                </div>

                {/* Number */}
                <span className="text-xs font-bold font-mono text-slate-400 w-4 pt-0.5 shrink-0">
                  {index + 1}.
                </span>

                {/* Question Info */}
                <div className="flex-1 min-w-0 text-right space-y-1.5">
                  <div
                    className={`text-xs font-bold line-clamp-2 leading-relaxed ${
                      isActive ? 'text-blue-950' : 'text-slate-800'
                    }`}
                  >
                    {question.title ? (
                      <KaTeXRenderer content={question.title} inline />
                    ) : (
                      <span className="text-slate-400 italic">سؤال جديد بدون عنوان</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${meta.badgeBg}`}>
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {score} {score === 1 ? 'درجة' : 'درجات'}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteQuestion(question.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0"
                  title="حذف السؤال"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Content Bank Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={() => {
            if (onOpenContentBank) onOpenContentBank();
          }}
          className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
        >
          <Database size={14} className="text-blue-600" />
          <span>بنك الأسئلة والمحتوى</span>
        </button>
      </div>

      {/* Add Question Type Modal */}
      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectType={onAddQuestion}
        onOpenContentBank={onOpenContentBank}
      />
    </div>
  );
};
