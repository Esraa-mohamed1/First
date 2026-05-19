'use client';

import React from 'react';
import { Course } from '@/types/student';
import { ArrowLeft, BarChart, Image as ImageIcon, User, PlayCircle, Award, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PaymentMethodBadge } from '@/components/payment/PaymentMethodBadge';

interface CourseCardProps {
  course: Course & { paymentMethods?: any[] };
  isSubscribed?: boolean;
}

export const CourseCard = ({ course, isSubscribed = true }: CourseCardProps) => {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Mock payment methods if not provided
  const paymentMethods = course.paymentMethods || [
    { type: 'mobile', methodName: 'Vodafone Cash', value: '01012345678' },
    { type: 'account_number', methodName: 'InstaPay', value: '1234567890' }
  ];

  const courseImage = course.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden hover:shadow-[0_12px_40px_rgba(59,130,246,0.08)] transition-all duration-300 group flex flex-col h-full relative">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50">
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-blue-50 text-blue-600 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-lg border border-blue-100/50">
            {course.category}
          </span>
        </div>

        {/* Instructor Badge */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm">
            <User size={12} className="text-blue-500" />
          </div>
          <span className="text-gray-700 text-[11px] font-bold bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/50">
            {course.instructor}
          </span>
        </div>
        
        <div className="w-full h-full relative overflow-hidden">
          {!imgError ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse z-0" />
              )}
              <img 
                src={courseImage}
                alt={course.title || "Course Image"}
                className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setImgError(true);
                  setIsLoading(false);
                }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-blue-100 h-full">
              <ImageIcon className="w-10 h-10 mb-2" />
              <span className="text-[10px] font-medium uppercase tracking-widest">No Image</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
            {course.title}
          </h3>
          <div 
            className="text-gray-500 text-xs line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-50">
          {isSubscribed && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400 mb-2 font-bold">
                <span className="flex items-center gap-1">
                  <PlayCircle size={10} className="text-blue-400" />
                  مستوى الإنجاز
                </span>
                <span className={`${course.progress === 100 ? 'text-green-500' : 'text-blue-500'} font-bold`}>
                  {course.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-50 rounded-full h-1.5 relative overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    course.progress === 100 
                      ? 'bg-green-500' 
                      : 'bg-blue-500'
                  } transition-all duration-1000 ease-out`} 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Payment Methods Section */}
          {!isSubscribed && paymentMethods.length > 0 && (
            <div className="mb-4 pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                <CreditCard size={10} className="text-blue-400" />
                وسائل الدفع المتاحة
              </div>
              <div className="flex flex-wrap gap-1.5">
                {paymentMethods.map((pm, idx) => (
                  <PaymentMethodBadge 
                    key={idx} 
                    type={pm.type} 
                    name={pm.methodName} 
                    value={pm.value}
                  />
                ))}
              </div>
            </div>
          )}

          {isSubscribed ? (
            course.progress === 100 ? (
              <Link 
                href={`/user/courses/${course.id}/certificate`}
                className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-600 font-bold py-3 rounded-xl hover:bg-green-500 hover:text-white transition-all duration-300 border border-green-100/50"
              >
                <Award size={16} />
                تحميل الشهادة
              </Link>
            ) : (
              <Link
                href={`/student/courses/${course.id}/learn`}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md shadow-blue-100 group/btn"
              >
                <span>متابعة التعلم</span>
                <ArrowLeft size={16} className="transform group-hover/btn:-translate-x-1 transition-transform duration-300" />
              </Link>
            )
          ) : (
            <div className="flex flex-col gap-2">
              <Link 
                href={`/student/courses/${course.id}`}
                className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-all duration-300"
              >
                <span>تفاصيل الدورة</span>
              </Link>
              <Link
                href={`/user/courses/${course.slug}`}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                اشترك الآن
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
