'use client';

import React from 'react';
import { Rocket, Check, Lightbulb } from 'lucide-react';

interface DashboardChecklistProps {
  setIsSelectTypeModalOpen: (open: boolean) => void;
}

export const DashboardChecklist = ({
  setIsSelectTypeModalOpen,
}: DashboardChecklistProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <Rocket className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
        </div>
        <h3 className="font-black text-gray-900 text-base sm:text-lg tracking-tight">خطواتك الأولى</h3>
      </div>

      {/* Steps layout with vertical connector line */}
      <div className="relative pr-4 sm:pr-5 border-r border-gray-100 space-y-6 sm:space-y-8 py-1 sm:py-2">
        
        {/* Step 1: Completed */}
        <div className="flex items-start gap-3 sm:gap-4 relative">
          {/* Step indicator on vertical line */}
          <div className="absolute -right-[23px] sm:-right-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center z-10 shadow-sm ring-2 ring-white">
            <Check size={9} className="text-white" strokeWidth={5} />
          </div>
          <div className="text-right">
            <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-tight">1- اعدادات الملف</h4>
            <p className="text-[11px] sm:text-xs text-gray-400 font-bold mt-1 leading-normal">
              اكملت المعلومات الأساسية
            </p>
          </div>
        </div>

        {/* Step 2: Active */}
        <div className="flex items-start gap-3 sm:gap-4 relative">
          {/* Step indicator on vertical line */}
          <div className="absolute -right-[23px] sm:-right-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center z-10 shadow-sm ring-2 ring-white text-[9px] font-black text-gray-500">
            2
          </div>
          <div className="text-right">
            <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-tight">2- انشاء دورة</h4>
            <p className="text-[11px] sm:text-xs text-gray-400 font-bold mt-1 leading-normal">
              ابدأ بانشاء دورتك الأولى
            </p>
            <button 
              onClick={() => setIsSelectTypeModalOpen(true)}
              className="text-blue-600 underline font-black text-[11px] sm:text-xs block mt-1.5 hover:text-blue-700 transition-colors"
            >
              ابدأ الآن
            </button>
          </div>
        </div>

        {/* Step 3: Pending */}
        <div className="flex items-start gap-3 sm:gap-4 relative">
          {/* Step indicator on vertical line */}
          <div className="absolute -right-[23px] sm:-right-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center z-10 shadow-sm ring-2 ring-white text-[9px] font-black text-gray-500">
            3
          </div>
          <div className="text-right">
            <h4 className="text-xs sm:text-sm font-black text-gray-955 leading-tight">3- اضافة مدربين</h4>
            <p className="text-[11px] sm:text-xs text-gray-400 font-bold mt-1 leading-normal">
              ابدأ بالخطوات لاكمال الفريق
            </p>
          </div>
        </div>

        {/* E. Tip of the Day Box */}
        <div className="bg-gray-50/50 rounded-2xl p-4 sm:p-5 border border-gray-50 space-y-2.5 sm:space-y-3 mt-4 mr-1">
          <div className="flex items-center gap-2 justify-start">
            <div className="text-blue-600 bg-white p-1.5 sm:p-2 rounded-xl shadow-sm shrink-0">
              <Lightbulb className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-black text-blue-600">نصيحة اليوم</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-gray-400 font-bold leading-relaxed text-right">
            "اضافة فيديوهات تعريفية قصيرة لكل دورة يزيد من معدلات التسجيل"
          </p>
        </div>

      </div>
    </div>
  );
};
