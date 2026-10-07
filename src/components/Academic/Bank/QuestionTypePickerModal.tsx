'use client';

import React, { useEffect } from 'react';
import { X, ArrowRight, HelpCircle } from 'lucide-react';
import { QuestionType } from '@/types/bank';
import { QUESTION_TYPES_LIST } from '@/constants/bank';

interface QuestionTypePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onSelectType: (type: QuestionType) => void;
}

export default function QuestionTypePickerModal({
  isOpen,
  onClose,
  onBack,
  onSelectType,
}: QuestionTypePickerModalProps) {
  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[110] flex items-center justify-center p-4 animate-in fade-in duration-150"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-question-picker-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] p-6 sm:p-8 max-w-xl w-full shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar text-start space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar with Back and Close Buttons */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
              title="رجوع لاختيار نوع المحتوى"
            >
              <ArrowRight size={14} />
              <span>رجوع</span>
            </button>

            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <HelpCircle size={18} />
            </div>

            <div className="text-start">
              <h2 id="modal-question-picker-title" className="text-lg font-black text-gray-900 tracking-tight">
                اختر نوع السؤال
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-500 font-medium">
          اختر نوع السؤال للبدء في كتابته وتحديد خياراته وحفظه في المكتبة.
        </p>

        {/* 8 Question Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pe-1 custom-scrollbar">
          {QUESTION_TYPES_LIST.map((qMeta) => (
            <button
              key={qMeta.type}
              type="button"
              onClick={() => onSelectType(qMeta.type)}
              className="p-3.5 rounded-2xl border border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50/40 text-start flex items-start gap-3 transition-all cursor-pointer group shadow-2xs hover:shadow-sm"
            >
              <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${qMeta.badgeBg} ${qMeta.badgeText}`}>
                <HelpCircle size={18} />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors">
                  {qMeta.label}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {qMeta.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
