'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Building2, CreditCard, Globe, Rocket, Loader2 } from 'lucide-react';
import { AcademyPaymentSettingsForm } from '@/components/forms/AcademyPaymentSettingsForm';
import { useRouter } from 'next/navigation';
import { showAlert } from '@/lib/sweetalert';

const steps = [
  { id: 'academy_info', title: 'بيانات الأكاديمية', icon: Building2, description: 'أدخل معلومات أكاديميتك الأساسية' },
  { id: 'payment_methods', title: 'طرق الدفع', icon: CreditCard, description: 'قم بإعداد طرق استقبال المدفوعات' },
  { id: 'domain', title: 'النطاق المخصص', icon: Globe, description: 'اختر رابط أكاديميتك' },
  { id: 'launch', title: 'إطلاق الأكاديمية', icon: Rocket, description: 'أنت جاهز للانطلاق!' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showAlert.success('تم إنشاء الأكاديمية بنجاح!', 'أهلاً بك في لوحة التحكم');
      router.push('/academic');
    } catch (error) {
      showAlert.error('حدث خطأ أثناء إعداد الأكاديمية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12 pb-24">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 space-y-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">إعداد أكاديميتك</h1>
          <p className="text-lg text-gray-500 font-medium">أكمل الخطوات التالية لتبدأ في استقبال طلابك</p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full z-0" />
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-500 ease-in-out" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center group">
                  <div 
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm
                      ${isActive ? 'bg-blue-600 text-white scale-110 shadow-blue-500/30' : 
                        isCompleted ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-100'}
                    `}
                  >
                    {isCompleted ? <Check size={24} strokeWidth={3} /> : <Icon size={24} />}
                  </div>
                  <div className="absolute top-16 text-center w-32 hidden md:block">
                    <p className={`text-sm font-bold ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden min-h-[400px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12"
            >
              {currentStep === 0 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[0].title}</h2>
                    <p className="text-gray-500">{steps[0].description}</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">اسم الأكاديمية</label>
                      <input type="text" className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="مثال: أكاديمية درّب" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">وصف الأكاديمية</label>
                      <textarea rows={4} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none" placeholder="نبذة عن ما تقدمه أكاديميتك..." />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[1].title}</h2>
                    <p className="text-gray-500">{steps[1].description}</p>
                  </div>
                  <AcademyPaymentSettingsForm />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[2].title}</h2>
                    <p className="text-gray-500">{steps[2].description}</p>
                  </div>
                  <div className="space-y-2 w-full">
                    <label className="block text-sm font-bold text-gray-700">رابط الأكاديمية</label>
                    <div className="relative flex items-stretch w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-500 transition-all" dir="ltr">
                      <input
                        type="text"
                        placeholder="myacademy"
                        className="flex-1 w-full min-w-0 py-4 px-4 bg-white focus:outline-none text-left text-lg font-bold"
                      />
                      <div className="px-6 py-4 bg-gray-50 border-l border-gray-200 text-gray-500 font-bold flex items-center justify-center">
                        .darab.academy
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <Rocket size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">كل شيء جاهز!</h2>
                  <p className="text-gray-500 max-w-md">لقد أكملت إعداد أكاديميتك بنجاح. أنت الآن مستعد لإضافة الدورات واستقبال الطلاب.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0 || loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-gray-200 bg-gray-100'}`}
            >
              <ChevronRight size={20} />
              السابق
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {currentStep === steps.length - 1 ? 'إطلاق الأكاديمية' : 'التالي'}
              {currentStep !== steps.length - 1 && <ChevronLeft size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
