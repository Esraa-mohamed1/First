'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Video, Monitor, Users, ArrowRight } from 'lucide-react';

export default function SelectCourseTypePage() {
  const router = useRouter();

  const courseTypes = [
    {
      type: 'recorded',
      title: 'دورة مسجلة',
      description: 'محتوى مسجل مسبقاً يمكن للمتعلمين الوصول إليه في أي وقت',
      icon: Video,
      color: 'blue'
    },
    {
      type: 'online',
      title: 'دورة لايف اون لاين',
      description: 'دورات مباشرة تفاعلية مع المدرب عبر الإنترنت',
      icon: Monitor,
      color: 'purple'
    },
    {
      type: 'physical',
      title: 'دورة حضوري',
      description: 'دورات تعليمية تُقام في مكان محدد مع حضور فعلي',
      icon: Users,
      color: 'green'
    }
  ];

  const handleSelectType = (type: string) => {
    router.push(`/academic/courses/create?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-100 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all mb-6"
          >
            <ArrowRight size={16} className="rotate-180" />
            عودة
          </button>
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-black text-gray-900">اختر نوع الدورة</h1>
            <p className="text-gray-500 font-bold text-lg">حدد نوع الدورة التي تريد إنشاءها</p>
          </div>
        </div>

        {/* Course Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courseTypes.map((courseType) => {
            const Icon = courseType.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300',
              purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:border-purple-300',
              green: 'bg-green-50 text-green-600 hover:bg-green-100 hover:border-green-300'
            };
            
            return (
              <div
                key={courseType.type}
                onClick={() => handleSelectType(courseType.type)}
                className={`group cursor-pointer bg-white border-2 border-gray-100 rounded-[32px] p-8 transition-all hover:shadow-xl ${colorClasses[courseType.color as keyof typeof colorClasses]}`}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${colorClasses[courseType.color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[courseType.color as keyof typeof colorClasses].split(' ')[1]}`}>
                    <Icon size={40} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-gray-900">{courseType.title}</h3>
                    <p className="text-gray-500 font-bold leading-relaxed">{courseType.description}</p>
                  </div>
                  <div className="w-full pt-4">
                    <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                      <span className="font-bold">اختر هذا النوع</span>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
