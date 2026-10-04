'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Database } from 'lucide-react';
import { ExamQuestion, QuestionType } from '@/types/academic/exam.types';
import { QUESTION_TYPES, getQuestionTypeMeta } from './constants';

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
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0 select-none h-full">
      {/* Subject / Course Title */}
      <div className="p-4 border-b border-slate-100 text-right">
        <h4 className="text-xs font-bold text-slate-500 truncate" title={courseTitle}>
          {courseTitle}
        </h4>
      </div>

      {/* Add Questions Button & Dropdown */}
      <div className="p-3 border-b border-slate-100 relative" ref={dropdownRef}>
        <div className="border border-slate-200 rounded-xl p-1.5 flex items-center justify-between bg-white shadow-2xs">
          <span className="text-xs font-bold text-slate-700 pr-2">الأسئلة</span>
          <button
            type="button"
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs cursor-pointer"
            title="إضافة سؤال جديد"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Question Type Selection Popup */}
        {isTypeDropdownOpen && (
          <div className="absolute top-14 right-3 left-3 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 text-right">
            <p className="text-xs font-black text-slate-700 px-2 py-1 border-b border-slate-100 mb-1">
              اختيار نوع السؤال
            </p>

            <div className="space-y-1">
              {QUESTION_TYPES.map((typeMeta) => (
                <button
                  key={typeMeta.type}
                  type="button"
                  onClick={() => {
                    onAddQuestion(typeMeta.type);
                    setIsTypeDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-right cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">
                    {typeMeta.label}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-2xs ${typeMeta.badgeBg}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {typeMeta.iconName}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom: Add from Content Bank */}
            <div className="pt-2 border-t border-slate-100 mt-1">
              <button
                type="button"
                onClick={() => {
                  setIsTypeDropdownOpen(false);
                  if (onOpenContentBank) onOpenContentBank();
                }}
                className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Database size={14} />
                <span>إضافة من بنك المحتوى</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {questions.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <p className="text-xs font-medium text-slate-400">
              لم تتم اضافة اي اسألة بعد...
            </p>
          </div>
        ) : (
          questions.map((question, index) => {
            const meta = getQuestionTypeMeta(question.type);
            const isActive = question.id === activeQuestionId;

            return (
              <div
                key={question.id}
                onClick={() => onSelectQuestion(question.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                }`}
              >
                {/* Right side: Number and Title preview */}
                <div className="flex items-center gap-2 overflow-hidden flex-1 text-right">
                  <span className="text-xs font-black text-slate-400 w-4 shrink-0">
                    {index + 1}
                  </span>
                  <span
                    className={`text-xs font-bold truncate ${
                      isActive ? 'text-blue-600' : 'text-slate-700'
                    }`}
                  >
                    {question.title || `السؤال ${index + 1}`}
                  </span>
                </div>

                {/* Left side: Type Badge and Delete Action */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteQuestion(question.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="حذف السؤال"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[12px] shadow-2xs ${meta.badgeBg}`}
                    title={meta.label}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {meta.iconName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
