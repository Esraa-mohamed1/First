'use client';

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface ExamHeaderProps {
  unitTitle: string;
  activeTab: 'questions' | 'settings';
  setActiveTab: (tab: 'questions' | 'settings') => void;
  onNextOrSave: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  unitTitle,
  activeTab,
  setActiveTab,
  onNextOrSave,
  onCancel,
  isSubmitting = false,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 shrink-0 select-none">
      {/* Right side: Breadcrumb / Title */}
      <div className="flex items-center gap-2 text-right">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-base">
          <span className="text-blue-600 font-extrabold flex items-center gap-1">
            <span className="material-symbols-outlined text-blue-500 text-[20px]">
              stars
            </span>
            اختبار :
          </span>
          <span className="text-slate-500 font-medium text-sm">
            ({unitTitle || 'الوحدة'})
          </span>
        </div>
      </div>

      {/* Center: Tabs */}
      <div className="flex items-center gap-8 font-bold text-sm">
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`pb-2 transition-all relative cursor-pointer ${
            activeTab === 'questions'
              ? 'text-slate-900 font-extrabold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>تفاصيل الأسئلة</span>
          {activeTab === 'questions' && (
            <div className="absolute bottom-[-14px] left-0 right-0 h-[3px] bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`pb-2 transition-all relative cursor-pointer ${
            activeTab === 'settings'
              ? 'text-slate-900 font-extrabold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>الأعدادات</span>
          {activeTab === 'settings' && (
            <div className="absolute bottom-[-14px] left-0 right-0 h-[3px] bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Left side: Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors cursor-pointer"
        >
          إلغاء
        </button>

        <button
          type="button"
          onClick={onNextOrSave}
          disabled={isSubmitting}
          className="px-7 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/10 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <span>{activeTab === 'questions' ? 'التالي' : 'حفظ'}</span>
          )}
        </button>
      </div>
    </div>
  );
};
