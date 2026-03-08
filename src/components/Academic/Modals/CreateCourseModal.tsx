'use client';

import React, { useState } from 'react';
import { X, Play, Video, MapPin, Check, Plus, Upload, FileText, FilePieChart as FilePowerpoint } from 'lucide-react';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCourseModal = ({ isOpen, onClose }: CreateCourseModalProps) => {
  const [step, setStep] = useState(1);
  const [courseType, setCourseType] = useState<string | null>(null);
  
  // Pricing Step States
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('paid');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  
  // Lesson Upload Step States
  const [lessonType, setLessonType] = useState<'video' | 'pdf' | 'powerpoint'>('video');
  const [uploadProgress, setUploadProgress] = useState(65);

  const courseTypes = [
    {
      id: 'registered',
      title: 'دورة مسجلة',
      description: 'دورة تحتوي على دروس وفيديوهات ويتابعها الطالب في اي وقت',
      icon: Play,
    },
    {
      id: 'online',
      title: 'دورة لايف اون لاين',
      description: 'دورة لها وقت محدد ويشاهدها الطلاب مباشرة عبر برنامج اجتماعات حية مثل زوم',
      icon: Video,
    },
    {
      id: 'offline',
      title: 'دورة حضوري',
      description: 'دورة تتم في مكان فعلي داخل قاعة او مركز تدريبي',
      icon: MapPin,
    },
  ];

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setCourseType(null);
    onClose();
  };

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header with Progress (Only for step 2, 3, 4) */}
        {step > 1 && (
          <div className="p-8 pb-0 flex items-center justify-center gap-12 relative">
             <div className="flex items-center gap-4 relative z-10">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${step >= 2 ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'border-gray-200 text-gray-400'}`}>
                  <span className="text-xl font-black">١</span>
                </div>
                <span className={`font-black text-sm ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>بيانات الدورة</span>
             </div>

             <div className={`h-1 flex-1 max-w-[150px] rounded-full transition-all ${step >= 3 ? 'bg-blue-600' : 'bg-gray-100'}`}></div>

             <div className="flex items-center gap-4 relative z-10">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${step >= 3 ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'border-gray-200 text-gray-400'}`}>
                  {step > 3 ? <Check size={24} className="text-blue-600" /> : <span className="text-xl font-black">٢</span>}
                </div>
                <span className={`font-black text-sm ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>التسعير</span>
             </div>

             <div className={`h-1 flex-1 max-w-[150px] rounded-full transition-all ${step >= 4 ? 'bg-blue-600' : 'bg-gray-100'}`}></div>

             <div className="flex items-center gap-4 relative z-10">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${step === 4 ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'border-gray-200 text-gray-400'}`}>
                  <span className="text-xl font-black">٣</span>
                </div>
                <span className={`font-black text-sm ${step === 4 ? 'text-gray-900' : 'text-gray-400'}`}>محتوي الدرس</span>
             </div>
          </div>
        )}

        <div className="p-10">
          {/* Step 1: Choice */}
          {step === 1 && (
            <div className="space-y-10">
              <h2 className="text-3xl font-black text-center text-gray-900">اختيار نوع الدورة</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courseTypes.map((type) => {
                  const isSelected = courseType === type.id;
                  const Icon = type.icon;
                  
                  return (
                    <div 
                      key={type.id}
                      onClick={() => { setCourseType(type.id); }}
                      className={`p-8 border-2 rounded-[32px] transition-all group cursor-pointer text-center space-y-4 ${
                        isSelected 
                        ? 'border-blue-600 bg-white shadow-xl shadow-blue-50 scale-105' 
                        : 'border-gray-100 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-50'
                      }`}
                    >
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-colors ${
                        isSelected ? 'bg-blue-600' : 'bg-blue-50 group-hover:bg-blue-600'
                      }`}>
                        <Icon className={isSelected ? 'text-white' : 'text-blue-600 group-hover:text-white'} size={32} />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">{type.title}</h3>
                      <p className="text-sm font-bold text-gray-400 leading-relaxed">{type.description}</p>
                      <button 
                        className={`w-full py-3 font-black rounded-xl transition-all ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900 group-hover:bg-blue-600 group-hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCourseType(type.id);
                          nextStep();
                        }}
                      >
                        اختيار
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <button onClick={handleClose} className="px-12 py-3.5 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all">الغاء</button>
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900 text-right">اسم الدورة</label>
                    <input type="text" placeholder="ادخل اسم الدورة" className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900 text-right">الفئة</label>
                    <select className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold appearance-none text-right transition-all">
                      <option>ادخل الفئة</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900 text-right">اضف وصف للدورة</label>
                    <textarea placeholder="ادخل وصف للدورة" className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold min-h-[150px] text-right transition-all"></textarea>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900 text-right">اسم المدرب</label>
                    <select className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold appearance-none text-right transition-all">
                      <option>ادخل اسم المدرب</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900 text-right">صورة الدورة</label>
                    <div className="border-2 border-dashed border-gray-100 rounded-[32px] p-12 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 transition-all min-h-[250px]">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <Plus className="text-gray-400 group-hover:text-blue-600" size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-gray-900">اضف صورة الدورة</p>
                        <p className="text-xs font-bold text-gray-400 mt-1">صورة غلاف دورة : 1270x820</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={nextStep} className="px-16 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all">التالي</button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="space-y-10 flex flex-col items-center">
              <div className="w-full max-w-md space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setPricingType('free')}
                    className={`p-4 border-2 rounded-2xl flex items-center justify-between font-bold cursor-pointer transition-all ${pricingType === 'free' ? 'border-blue-600 bg-blue-50/10' : 'border-gray-100 bg-white'}`}
                  >
                    <span className={pricingType === 'free' ? 'text-blue-600' : 'text-gray-900'}>مجاني</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${pricingType === 'free' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                      {pricingType === 'free' && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                  <div 
                    onClick={() => setPricingType('paid')}
                    className={`p-4 border-2 rounded-2xl flex items-center justify-between font-bold cursor-pointer transition-all ${pricingType === 'paid' ? 'border-blue-600 bg-blue-50/10' : 'border-gray-100 bg-white'}`}
                  >
                    <span className={pricingType === 'paid' ? 'text-blue-600' : 'text-gray-900'}>مدفوع</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${pricingType === 'paid' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                      {pricingType === 'paid' && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-900 text-right">السعر</label>
                  <input type="text" placeholder="ادخل سعر الدورة" className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-900 text-right">السعر النهائي بعد الخصم</label>
                  <input type="text" placeholder="ادخل السعر النهائي بعد الخصم" className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setStatus('published')}
                    className={`p-4 border-2 rounded-2xl flex items-center justify-between font-bold cursor-pointer transition-all ${status === 'published' ? 'border-blue-600 bg-blue-50/10' : 'border-gray-100 bg-white'}`}
                  >
                    <span className={status === 'published' ? 'text-blue-600' : 'text-gray-900'}>منشورة</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${status === 'published' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                      {status === 'published' && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                  <div 
                    onClick={() => setStatus('draft')}
                    className={`p-4 border-2 rounded-2xl flex items-center justify-between font-bold cursor-pointer transition-all ${status === 'draft' ? 'border-blue-600 bg-blue-50/10' : 'border-gray-100 bg-white'}`}
                  >
                    <span className={status === 'draft' ? 'text-blue-600' : 'text-gray-900'}>مسودة</span>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${status === 'draft' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                      {status === 'draft' && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center w-full max-w-md pt-4">
                <button onClick={nextStep} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all">حفظ و متابعة</button>
              </div>
            </div>
          )}

          {/* Step 4: Lesson Content & Upload */}
          {step === 4 && (
            <div className="space-y-10">
              <h2 className="text-2xl font-black text-center text-gray-900">اضافة درس جديد</h2>
              
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-900 text-right">عنوان الدرس</label>
                  <input type="text" placeholder="ادخل عنوان للدرس" className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-900 text-right">اضف وصف مختصر للدرس</label>
                  <textarea placeholder="ادخل وصف للدرس" className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold min-h-[120px] text-right transition-all"></textarea>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-900 text-right">نوع الدرس</label>
                  <div className="grid grid-cols-3 gap-4 bg-gray-50/50 p-2 rounded-[24px]">
                    <button 
                      onClick={() => setLessonType('powerpoint')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold transition-all ${lessonType === 'powerpoint' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <FilePowerpoint size={20} />
                      <span>ملف Powerpoint</span>
                    </button>
                    <button 
                      onClick={() => setLessonType('pdf')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold transition-all ${lessonType === 'pdf' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <FileText size={20} />
                      <span>ملف PDF</span>
                    </button>
                    <button 
                      onClick={() => setLessonType('video')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold transition-all ${lessonType === 'video' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Video size={20} />
                      <span>فيديو</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-900 text-right">محتوي الدرس</label>
                  <div className="border-2 border-dashed border-gray-100 rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 transition-all">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <Upload className="text-blue-600" size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-gray-900">اضغط للتحميل او اسحب الملف الي هنا</p>
                      <p className="text-xs font-bold text-gray-400 mt-1">الحجم الاقصي للملف : MP4,PDF,PPTX. 500MB</p>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="bg-blue-50/50 p-6 rounded-[24px] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          <FileText className="text-blue-600" size={24} />
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-gray-900">الفرق بين UX و UI , أمثلة عملية من تطبيقات حقيقية</p>
                          <p className="text-xs font-bold text-gray-400">142.5 MB / 250 MB . 45s remaining</p>
                        </div>
                      </div>
                      <Check size={20} className="text-blue-600" />
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 max-w-2xl mx-auto pt-4">
                <button onClick={handleClose} className="px-16 py-4 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all">الغاء</button>
                <button onClick={handleClose} className="px-16 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all">حفظ الدرس</button>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-8 left-8 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default CreateCourseModal;
