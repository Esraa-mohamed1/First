import React from 'react';
import { Course } from '@/types/student';
import { ArrowLeft, BarChart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {/* Placeholder for image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {course.category}
          </span>
        </div>
        
        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
          <BarChart className="text-blue-300 w-16 h-16 opacity-50" />
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{course.title}</h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
          {course.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2 font-medium">
            <span>التقدم</span>
            <span className="text-blue-600 font-bold">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'} transition-all duration-1000 ease-out`} 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          
          {course.progress === 100 ? (
            <Link 
              href={`/student/courses/${course.id}/certificate`}
              className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 font-semibold py-2.5 rounded-xl hover:bg-green-200 transition-colors"
            >
              عرض الشهادة
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </Link>
          ) : (
            <Link 
              href={`/student/courses/${course.id}`}
              className="w-full flex items-center justify-center gap-2 text-blue-600 font-semibold py-2.5 border-2 border-blue-50 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
            >
              دخول الدورة
              <ArrowLeft size={16} className="transform group-hover:-translate-x-2 transition-transform duration-300" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
