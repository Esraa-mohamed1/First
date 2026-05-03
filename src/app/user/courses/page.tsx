'use client';

import React, { useState, useEffect } from 'react';
import { CourseCard } from '@/components/Student/Courses/CourseCard';
import { GraduationCap, Loader2 } from 'lucide-react';
import { getCourses } from '@/services/courses';
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

        // Fetch courses (tenant name is handled inside academyApi interceptors)
        const response = await getCourses(undefined, 'student');
        const mappedCourses: Course[] = response.map((c: any) => ({
          id: c.id?.toString() || '',
          title: c.title || '',
          description: c.description || '',
          progress: c.progress || 0,
          image: c.image || '',
          instructor: c.instructor_name || '',
          category: c.category?.name || 'General',
          status: (c.progress === 100 ? 'completed' : c.progress > 0 ? 'in-progress' : 'not-started') as any
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-60 pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">الدورات التدريبية</h1>
          </div>
          <p className="text-gray-500 font-medium mr-14">استكشف جميع الدورات المتاحة في الأكاديمية</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden h-full flex flex-col animate-pulse">
              <div className="h-48 bg-gray-200 w-full" />
              <div className="p-5 flex-1 flex flex-col">
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded-md w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-6" />
                <div className="mt-auto">
                  <div className="flex justify-between mb-2">
                    <div className="h-3 bg-gray-200 rounded w-12" />
                    <div className="h-3 bg-gray-200 rounded w-8" />
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full w-full mb-6" />
                  <div className="h-10 bg-gray-200 rounded-xl w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center border border-red-100">
          <p className="font-bold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium"
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
                <CourseCard course={course} isSubscribed={false} />
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
