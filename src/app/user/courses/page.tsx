'use client';

import React, { useState, useEffect } from 'react';
import { CourseCard } from '@/components/Student/Courses/CourseCard';
import { GraduationCap, Loader2 } from 'lucide-react';
import { getStudentCourses } from '@/services/student-courses';
import { Course } from '@/types/student';

// Simple in-memory cache
const coursesCache = new Map<string, any>();

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check cache first
        const cacheKey = 'tenant_courses';
        if (coursesCache.has(cacheKey)) {
          setCourses(coursesCache.get(cacheKey));
          setIsLoading(false);
          return;
        }

        // Fetch courses (tenant name is handled inside studentApi interceptors)
        const response = await getStudentCourses();
        const mappedCourses: Course[] = response.map((c: any) => ({
          id: c.id?.toString() || '',
          title: c.title || '',
          slug: c.slug || '',
          description: c.description || '',
          progress: c.progress || 0,
          image: c.image || '',
          instructor: c.instructor_name || '',
          category: c.category?.name || 'General',
          status: (c.progress === 100 ? 'completed' : c.progress > 0 ? 'in-progress' : 'not-started') as any,
          is_enrolled: c.is_enrolled || false,
        }));

        coursesCache.set(cacheKey, mappedCourses);
        setCourses(mappedCourses);
      } catch (err: any) {
        console.error('Failed to load courses:', err);
        setError('حدث خطأ أثناء تحميل الدورات. يرجى المحاولة مرة أخرى.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="space-y-8 animate-slide-up-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 opacity-60 pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-4 text-blue-600 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg shadow-blue-200">
              <GraduationCap size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">الدورات التدريبية</h1>
              <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-1"></div>
            </div>
          </div>
          <p className="text-gray-500 font-medium text-lg max-w-md leading-relaxed">
            استكشف جميع الدورات المتاحة في الأكاديمية وابدأ رحلتك التعليمية اليوم.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden h-[450px] flex flex-col animate-pulse">
              <div className="h-52 bg-gray-100 w-full" />
              <div className="p-6 flex-1 flex flex-col">
                <div className="h-7 bg-gray-100 rounded-lg w-3/4 mb-4" />
                <div className="h-4 bg-gray-100 rounded-lg w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded-lg w-5/6 mb-auto" />
                <div className="pt-4 border-t border-gray-50">
                  <div className="h-12 bg-gray-100 rounded-2xl w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50/50 backdrop-blur-sm text-red-600 p-12 rounded-[2.5rem] text-center border border-red-100 shadow-sm">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 animate-spin-slow" />
          </div>
          <p className="font-bold text-xl mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-200"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="animate-slide-up-fade transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CourseCard course={course} isSubscribed={course.is_enrolled} />
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="text-gray-300 w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد دورات</h3>
              <p className="text-gray-500 max-w-md">لا توجد دورات متاحة في هذه الأكاديمية حالياً.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
