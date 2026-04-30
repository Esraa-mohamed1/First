'use client';

import React, { useState } from 'react';
import { CourseCard } from '@/components/Student/Courses/CourseCard';
import { mockCourses } from '@/data/student/mockData';
import { GraduationCap } from 'lucide-react';

export default function CoursesPage() {
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const filteredCourses = mockCourses.filter(course => {
    if (filter === 'all') return true;
    return course.status === filter;
  });

  return (
    <div className="space-y-8 animate-slide-up-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-60 pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">دوراتي التعليمية</h1>
          </div>
          <p className="text-gray-500 font-medium mr-14">تابع تقدمك واستكمل رحلتك المعرفية في المنصة</p>
        </div>

        <div className="relative z-10 flex p-1.5 bg-gray-100 rounded-2xl w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${filter === 'all'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${filter === 'in-progress'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
          >
            قيد الدراسة
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${filter === 'completed'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
          >
            مكتملة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <div
            key={course.id}
            className="animate-slide-up-fade transition-all duration-500 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="text-gray-300 w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد دورات</h3>
          <p className="text-gray-500 max-w-md">لا توجد دورات مطابقة للفلتر المحدد حالياً. استكشف مكتبة الدورات للبدء في التعلم.</p>
        </div>
      )}
    </div>
  );
}
