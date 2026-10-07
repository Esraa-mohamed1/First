'use client';

import React, { useEffect } from 'react';
import { X, BookOpen, Video, HelpCircle, ChevronLeft } from 'lucide-react';

interface AddContentChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChoice: (choice: 'lesson' | 'video' | 'questionPicker') => void;
}

export default function AddContentChooserModal({
  isOpen,
  onClose,
  onSelectChoice,
}: AddContentChooserModalProps) {
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
      aria-labelledby="modal-add-content-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-150 text-start space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between pe-2">
          <div className="space-y-1">
            <h2 id="modal-add-content-title" className="text-2xl font-black text-gray-900 tracking-tight">
              إضافة محتوى
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">
              اختار نوع المحتوى اللي عايز تضيفه
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all cursor-pointer shrink-0"
            aria-label="إغلاق النافذة"
          >
            <X size={20} />
          </button>
        </div>

        {/* 3 Main Choice Large Tiles */}
        <div className="space-y-3">
          {/* 1. Lesson & Document */}
          <button
            type="button"
            onClick={() => onSelectChoice('lesson')}
            className="w-full p-4.5 rounded-2xl border border-gray-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/30 text-start flex items-center justify-between gap-4 transition-all group cursor-pointer shadow-2xs hover:shadow-sm"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <BookOpen size={24} />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-indigo-700 transition-colors">
                  درس ومستند
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed truncate">
                  كتابة ملخص أو شرح أو إرفاق ملف PDF للدرس
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gray-50 group-hover:bg-indigo-100 text-gray-400 group-hover:text-indigo-600 flex items-center justify-center shrink-0 transition-colors">
              <ChevronLeft size={18} />
            </div>
          </button>

          {/* 2. Educational Video */}
          <button
            type="button"
            onClick={() => onSelectChoice('video')}
            className="w-full p-4.5 rounded-2xl border border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50/30 text-start flex items-center justify-between gap-4 transition-all group cursor-pointer shadow-2xs hover:shadow-sm"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Video size={24} />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-blue-700 transition-colors">
                  فيديو تعليمي
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed truncate">
                  إضافة فيديو عبر رابط خارجي، رفع ملف، أو من المكتبة
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gray-50 group-hover:bg-blue-100 text-gray-400 group-hover:text-blue-600 flex items-center justify-center shrink-0 transition-colors">
              <ChevronLeft size={18} />
            </div>
          </button>

          {/* 3. Question & Exercises */}
          <button
            type="button"
            onClick={() => onSelectChoice('questionPicker')}
            className="w-full p-4.5 rounded-2xl border border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50/30 text-start flex items-center justify-between gap-4 transition-all group cursor-pointer shadow-2xs hover:shadow-sm"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <HelpCircle size={24} />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-purple-700 transition-colors">
                  سؤال وتمارين
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed truncate">
                  إنشاء سؤال بـ 8 أنواع مختلفة مع درجات وشرح ونماذج إجابة
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gray-50 group-hover:bg-purple-100 text-gray-400 group-hover:text-purple-600 flex items-center justify-center shrink-0 transition-colors">
              <ChevronLeft size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
