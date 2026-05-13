'use client';

import React, { useState, useEffect } from 'react';
import { CourseCard } from '@/components/Student/Courses/CourseCard';
import { GraduationCap } from 'lucide-react';
import { getMyEnrolledCourses } from '@/services/student-courses';
import { Course } from '@/types/student';

// Simple in-memory cache
const coursesCache = new Map<string, any>();

export default function CoursesPage() {
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const fetchedEnrollments = await getMyEnrolledCourses();
        const studentCourses: Course[] = fetchedEnrollments.map(enrollment => {
          const course = enrollment.course;
          return {
            id: String(enrollment.id),
            title: course.title,
            slug: course.slug,
            description: course.description,
            progress: enrollment.progress || 0,
            image: course.image || '',
            instructor: course.instructor_name || 'Unknown',
            category: course.category?.name || 'Uncategorized',
            status: enrollment.status || 'in-progress',
            price_type: course.price_type,
            is_enrolled: true,
          };
        });
        setCourses(studentCourses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.status === filter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">دوراتي التعليمية</h1>
            <p className="text-gray-500 text-sm">تابع تقدمك واستكمل رحلتك التعليمية</p>
          </div>

          <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100 w-fit">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-bold text-xs transition-all duration-300 ${filter === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-6 py-2 rounded-lg font-bold text-xs transition-all duration-300 ${filter === 'in-progress'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              قيد الدراسة
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2 rounded-lg font-bold text-xs transition-all duration-300 ${filter === 'completed'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              مكتملة
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-[1.5rem] border border-gray-100 h-72 animate-pulse">
              <div className="h-48 bg-gray-50 rounded-t-[1.5rem]"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-50 rounded w-3/4"></div>
                <div className="h-3 bg-gray-50 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && filteredCourses.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="text-gray-300 w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد دورات</h3>
          <p className="text-gray-500 max-w-md">لا توجد دورات مطابقة للفلتر المحدد حالياً. استكشف مكتبة الدورات للبدء في التعلم.</p>
        </div>
      )}

      {!loading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className="animate-slide-up-fade transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CourseCard course={course} isSubscribed={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
