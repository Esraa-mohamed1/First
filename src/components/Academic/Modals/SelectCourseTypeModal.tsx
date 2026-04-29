'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Video, Monitor, Users, ArrowRight } from 'lucide-react';

interface SelectCourseTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SelectCourseTypeModal({ isOpen, onClose }: SelectCourseTypeModalProps) {
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
    onClose();
    router.push(`/academic/courses/create?type=${type}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900">اختر نوع الدورة</h2>
            <p className="text-gray-500 font-bold mt-2">حدد نوع الدورة التي تريد إنشاءها</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={24} className="text-gray-500" />
          </button>
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
