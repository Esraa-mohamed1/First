'use client';

import React from 'react';
import { Course } from '@/types/student';
import { ArrowLeft, BarChart, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
  isSubscribed?: boolean;
}

export const CourseCard = ({ course, isSubscribed = true }: CourseCardProps) => {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

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
        
        <div className="w-full h-full bg-blue-50 flex items-center justify-center relative">
          {course.image && !imgError ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
              )}
              <Image 
                src={course.image}
                alt={course.title || "Course Image"}
                fill
                className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setImgError(true);
                  setIsLoading(false);
                }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-blue-200">
              <ImageIcon className="w-12 h-12 mb-2" />
              <span className="text-xs font-medium">No Image</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{course.title}</h3>
        <div 
          className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
        
        <div className="mt-auto">
          {isSubscribed && (
            <>
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
            </>
          )}
          
          {!isSubscribed ? (
            <Link 
              href={`/user/courses/${course.id}`}
              className="w-full flex items-center justify-center gap-2 text-blue-600 font-semibold py-2.5 border-2 border-blue-50 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 mt-auto"
            >
              معاينة الكورس
              <ArrowLeft size={16} className="transform group-hover:-translate-x-2 transition-transform duration-300" />
            </Link>
          ) : course.progress === 100 ? (
            <Link 
              href={`/user/courses/${course.id}/certificate`}
              className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 font-semibold py-2.5 rounded-xl hover:bg-green-200 transition-colors"
            >
              عرض الشهادة
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </Link>
          ) : (
            <Link 
              href={`/user/courses/${course.id}`}
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
