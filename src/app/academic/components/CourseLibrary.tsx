'use client';

import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CourseLibraryProps {
  courses: any[];
  setIsSelectTypeModalOpen: (open: boolean) => void;
}

export const CourseLibrary = ({
  courses,
  setIsSelectTypeModalOpen,
}: CourseLibraryProps) => {
  const router = useRouter();

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 sm:p-8 md:p-12 text-center flex flex-col items-center justify-center gap-4 sm:gap-5 hover:border-blue-200 transition-all duration-300">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-black text-gray-900">مكتبة دوراتك تنتظر اول اعمالك</h3>
          <p className="text-[11px] sm:text-xs font-bold text-gray-400 max-w-xs sm:max-w-sm leading-relaxed">
            قم بانشاء محتوي تعليمي ملهم وابدأ رحلتك التعليمية الأن
          </p>
        </div>
        <button 
          onClick={() => setIsSelectTypeModalOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        >
          <Plus size={14} className="sm:w-4 sm:h-4" strokeWidth={3} />
          <span>انشاء دورة جديدة</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-right">
      <h3 className="text-base sm:text-lg font-black text-gray-900">أحدث دورة مضافة</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        {/* 1. Latest Course Item Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300">
          <div className="relative h-36 sm:h-44 w-full bg-slate-50 border-b border-gray-50">
            <Image
              src={courses[0].image_url || courses[0].image || "/assets/course3.jpg"}
              alt={courses[0].name || courses[0].title || "Course Thumbnail"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <h4 className="font-black text-gray-900 text-sm sm:text-base">{courses[0].name || courses[0].title}</h4>
              <p className="text-[11px] sm:text-xs text-gray-400 font-bold leading-relaxed line-clamp-2">
                {courses[0].description 
                  ? courses[0].description.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                  : "شرح مبسط يساعدك على فهم أساسيات المادة العلمية خطوة بخطوة."}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 pt-2">
              <button 
                onClick={() => router.push(`/academic/courses`)}
                className="flex-1 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs transition-all active:scale-95 text-center shadow-md shadow-blue-600/10"
              >
                تعديل الدورة
              </button>
              <button 
                onClick={() => router.push(`/academic/courses/stats`)}
                className="flex-1 py-2 sm:py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs transition-all active:scale-95 text-center"
              >
                احصائيات الدورة
              </button>
            </div>
          </div>
        </div>
 
        {/* 2. Dashed Add Course Card */}
        <button 
          onClick={() => setIsSelectTypeModalOpen(true)}
          className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 sm:p-8 hover:border-blue-300 hover:bg-blue-50/10 group transition-all duration-300 min-h-[220px] sm:min-h-[280px]"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3 sm:mb-4 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm">
            <Plus className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <span className="font-black text-xs sm:text-sm text-gray-900">اضافة دورة تدريبية اخرى</span>
        </button>

      </div>
    </div>
  );
};
