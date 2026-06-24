'use client';

import React from 'react';
import { Layers, ChevronUp, ChevronDown, Users, Cloud } from 'lucide-react';

interface PremiumUsageProps {
  isPremiumExpanded: boolean;
  setIsPremiumExpanded: (val: boolean) => void;
  totalStudentsLimit: number;
  usedStudents: number;
  remainingStudents: number;
  studentProgressPercent: number;
  storagePercent: number;
  totalCoursesLimit: number;
  usedCourses: number;
  remainingCourses: number;
  courseProgressPercent: number;
}

export const PremiumUsage = ({
  isPremiumExpanded,
  setIsPremiumExpanded,
  totalStudentsLimit,
  usedStudents,
  remainingStudents,
  studentProgressPercent,
  storagePercent,
  totalCoursesLimit,
  usedCourses,
  remainingCourses,
  courseProgressPercent,
}: PremiumUsageProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
      {/* Header Block */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Package Icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          {/* Title & Desc */}
          <div className="text-right space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-lg font-black text-gray-900">استهلاك الباقة البريميوم</h3>
              <span className="bg-emerald-50 text-emerald-600 text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-100">
                نشط
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-gray-400">
              نظرة عامة علي الموارد المستخدمة والمتاحة
            </p>
          </div>
        </div>
        {/* Collapse/Expand Toggle */}
        <button 
          onClick={() => setIsPremiumExpanded(!isPremiumExpanded)}
          className="p-1 sm:p-1.5 hover:bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all shrink-0"
        >
          {isPremiumExpanded ? <ChevronUp size={16} className="sm:w-[18px] sm:h-[18px]" /> : <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />}
        </button>
      </div>

      {/* Content (Collapsible) */}
      {isPremiumExpanded && (
        <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-5 border-t border-gray-100 animate-in fade-in duration-300">
          <div className="text-right">
            <p className="text-[10px] sm:text-xs font-black text-gray-500">
              تاريخ التجديد القادم : <span className="text-gray-900 font-bold">12 يناير 2024</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Students Usage */}
            <div className="space-y-2 sm:space-y-3 bg-gray-50/50 p-4 sm:p-5 rounded-2xl border border-gray-50">
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-black">
                <span className="text-gray-900">
                  {totalStudentsLimit.toLocaleString('en-US')}/{usedStudents.toLocaleString('en-US')}
                </span>
                <div className="flex items-center gap-1 sm:gap-1.5 text-gray-400">
                  <Users size={12} className="text-gray-400 sm:w-[14px] sm:h-[14px]" />
                  <span>عدد الطلاب</span>
                </div>
              </div>
              <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${studentProgressPercent}%` }}
                />
              </div>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold text-center">
                {remainingStudents > 0 ? (
                  <>تبقي لديك <span className="text-gray-950 font-black">{remainingStudents.toLocaleString('ar-EG')} مقعدا طلابيا</span></>
                ) : (
                  <span className="text-red-500 font-black">لقد استنفدت كامل مقاعد الطلاب</span>
                )}
              </p>
            </div>

            {/* Storage Space Usage */}
            <div className="space-y-2 sm:space-y-3 bg-gray-50/50 p-4 sm:p-5 rounded-2xl border border-gray-50">
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-black">
                <span className={storagePercent > 0 ? "text-red-500" : "text-blue-600"}>
                  {storagePercent}% مستخدم
                </span>
                <div className="flex items-center gap-1 sm:gap-1.5 text-gray-400">
                  <Cloud size={12} className="text-gray-400 sm:w-[14px] sm:h-[14px]" />
                  <span>مساحة التخزين</span>
                </div>
              </div>
              <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${storagePercent > 0 ? 'bg-red-500' : 'bg-blue-600'}`} 
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
              <p className={`text-[9px] sm:text-[10px] font-black text-center ${storagePercent > 0 ? 'text-red-500' : 'text-blue-600'}`}>
                {storagePercent > 0 ? 'تحذير : لقد اوشكت على استهلاك مساحة التخزين' : '100% متاح'}
              </p>
            </div>

            {/* Courses Usage */}
            <div className="space-y-2 sm:space-y-3 bg-gray-50/50 p-4 sm:p-5 rounded-2xl border border-gray-50">
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-black">
                <span className="text-gray-900">{totalCoursesLimit}/{usedCourses}</span>
                <div className="flex items-center gap-1 sm:gap-1.5 text-gray-400">
                  <Layers size={12} className="text-gray-400 sm:w-[14px] sm:h-[14px]" />
                  <span>عدد الدورات</span>
                </div>
              </div>
              <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${courseProgressPercent}%` }}
                />
              </div>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold text-center">
                {usedCourses > 0 ? (
                  <>يمكنك اضافة <span className="text-gray-950 font-black">{remainingCourses} دورة اضافية</span></>
                ) : (
                  <span>لا يوجد دورات مضافة</span>
                )}
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
