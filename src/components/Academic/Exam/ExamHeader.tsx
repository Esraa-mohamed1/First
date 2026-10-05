'use client';

import React from 'react';
import { ChevronRight, Eye, MoreVertical, Check, Sparkles } from 'lucide-react';

interface ExamHeaderProps {
  title: string;
  targetSubtitle?: string;
  activeTab: 'questions' | 'settings' | 'publish';
  setActiveTab: (tab: 'questions' | 'settings' | 'publish') => void;
  onBackOrCancel: () => void;
  onOpenPreview: () => void;
  questionsCount: number;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  title,
  targetSubtitle = 'محفوظ تلقائياً • اختبار مستقل',
  activeTab,
  setActiveTab,
  onBackOrCancel,
  onOpenPreview,
  questionsCount,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shrink-0 select-none text-right" dir="rtl">
      {/* Top Bar Row (Matching screenshot) */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Right Side: Back Arrow, Title, Subtitle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackOrCancel}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="رجوع"
          >
            <ChevronRight size={20} />
          </button>

          <div>
            <h2 className="text-base font-bold text-slate-900 line-clamp-1">
              {title || 'اختبار بدون عنوان'}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Check size={12} className="text-emerald-500 stroke-[3]" />
              <span>{targetSubtitle}</span>
            </div>
          </div>
        </div>

        {/* Left Side: Preview (Eye) & More Options (3 Dots) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPreview}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
            title="معاينة الاختبار كطالب"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={onBackOrCancel}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="إغلاق"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Tabs Row (Matching screenshot: الأسئلة 3 / الإعدادات / النشر 🔴) */}
      <div className="flex items-center gap-8 px-8 text-xs font-bold border-t border-slate-100/80">
        {/* Tab 1: الأسئلة */}
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`py-3 relative transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'text-blue-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>الأسئلة {questionsCount > 0 ? questionsCount : ''}</span>
          {activeTab === 'questions' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
          )}
        </button>

        {/* Tab 2: الإعدادات */}
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`py-3 relative transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'text-blue-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>الإعدادات</span>
          {activeTab === 'settings' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
          )}
        </button>

        {/* Tab 3: النشر */}
        <button
          type="button"
          onClick={() => setActiveTab('publish')}
          className={`py-3 relative transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'publish'
              ? 'text-blue-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>النشر</span>
          {activeTab === 'publish' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
};
