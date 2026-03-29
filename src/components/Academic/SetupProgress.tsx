'use client';

import React, { useState } from 'react';
import { AlertCircle, ChevronUp, ChevronLeft, Check } from 'lucide-react';
import Link from 'next/link';

interface Step {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  href: string;
}

export default function SetupProgress() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Static state matching the images for demonstration
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'step1',
      title: 'أضف بيانات الأكاديمية الأساسية',
      description: 'ابدأ بإضافة المعلومات الأساسية لأكاديميتك ليتمكن الطلاب من التعرف عليها بسهولة.',
      isCompleted: false, // Set to false to match Image 1
      href: '/academic/settings/academy',
    },
    {
      id: 'step2',
      title: 'أضف أقسام أو فئات الدورات',
      description: 'قم بإضافة فئات لتنظيم الدورات ومساعدة الطلاب على العثور عليها بسهولة.',
      isCompleted: false,
      href: '/academic/courses/categories',
    },
    {
      id: 'step3',
      title: 'أضف أول دورة',
      description: 'أنشئ أول دورة وابدأ في تقديم محتوى تعليمي لطلابك.',
      isCompleted: false,
      href: '/academic/courses/create',
    },
    {
      id: 'step4',
      title: 'اختار تصميم موقع الأكاديمية',
      description: 'حدد شكل وتصميم موقع أكاديميتك ليظهر للطلاب بشكل احترافي.',
      isCompleted: false,
      href: '/academic/settings/design',
    },
    {
      id: 'step5',
      title: 'أضف طريقة الدفع',
      description: 'قم بإضافة طريقة دفع ليتمكن الطلاب من الاشتراك وشراء الدورات بسهولة.',
      isCompleted: false,
      href: '/academic/settings/payment',
    },
  ]);

  const completedCount = steps.filter(s => s.isCompleted).length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);

  const toggleStep = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSteps(steps.map(step => 
      step.id === id ? { ...step, isCompleted: !step.isCompleted } : step
    ));
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Free Trial Banner */}
      <div className="bg-[#EBF3FF] rounded-2xl w-full flex flex-col sm:flex-row items-center justify-between p-4 px-6 relative overflow-hidden">
        <button className="bg-[#4169E1] hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-md mt-4 sm:mt-0 order-2 sm:order-1 whitespace-nowrap">
          ترقية الأن
        </button>
        <div className="flex items-center gap-3 order-1 sm:order-2">
          <span className="text-[#4169E1] font-bold text-lg md:text-xl">
            انت الأن في فترة التجربة المجانية متبقي 6:23:59:09
          </span>
          <AlertCircle className="text-[#4169E1] bg-white rounded-full p-0.5" size={24} />
        </div>
      </div>

      {/* Progress Section */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-gray-900 text-lg">نسبة التقدم {progressPercentage}%</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full bg-gray-200 rounded-full h-3.5 mb-8">
          <div 
            className="bg-[#4169E1] h-3.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Steps Box */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-4xl mx-auto flex flex-col space-y-8">
          
          {!isExpanded ? (
            <div className="flex justify-end w-full">
              <button 
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-4 px-8 py-4 bg-white border border-gray-100 shadow-sm rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-all text-lg"
              >
                <ChevronLeft className="text-gray-900" size={20} />
                اضغط هنا للبدأ
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-8 relative">
              
              {/* Chevron Collapse Button positioned absolutely or just at the top left */}
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute left-0 top-0 text-gray-900 p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <ChevronUp size={24} />
              </button>

              <div className="flex flex-col space-y-8 pt-4">
                {steps.map((step) => (
                  <Link href={step.href} key={step.id}>
                    <div className="flex items-start justify-end gap-6 group cursor-pointer w-full pl-12 transition-all">
                      
                      {/* Text content */}
                      <div className="text-right flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-sm font-medium text-gray-500 max-w-xl ml-auto">
                          {step.description}
                        </p>
                      </div>

                      {/* Checkbox */}
                      <div 
                        onClick={(e) => toggleStep(step.id, e)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all cursor-pointer ${
                          step.isCompleted 
                            ? 'bg-green-500 border-green-500 shadow-sm shadow-green-200' 
                            : 'border-gray-600 bg-white group-hover:border-blue-500'
                        }`}
                      >
                        {step.isCompleted && <Check className="text-white" size={18} strokeWidth={3} />}
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
