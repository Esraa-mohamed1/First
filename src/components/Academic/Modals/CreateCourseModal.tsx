'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Play, Video, MapPin, Check, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCourse } from '@/services/courses';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCourseModal = ({ isOpen, onClose }: CreateCourseModalProps) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [courseType, setCourseType] = useState<string | null>(null);
  
  // Basic Info States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');

  // Pricing Step States
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('paid');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [price, setPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setTitle('');
    setCategory('');
    setDescription('');
    setInstructor('');
    setPrice('');
    setFinalPrice('');
    setIsSubmitting(false);
    onClose();
  };

  const nextStep = () => setStep(prev => prev + 1);

  const handleCreateCourse = async () => {
    if (!title || !category || !description) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      const newCourse = await createCourse({
        title,
        category,
        description,
        instructor,
        price: Number(price),
        final_price: Number(finalPrice),
        status,
        type: courseType || 'registered',
      });
      toast.success('تم إنشاء الدورة بنجاح');
      handleClose();
      router.push(`/academic/courses/${newCourse.id}`);
    } catch (error) {
      toast.error('فشل إنشاء الدورة');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header with Progress */}
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
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${step === 3 ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'border-gray-200 text-gray-400'}`}>
                  <span className="text-xl font-black">٢</span>
                </div>
                <span className={`font-black text-sm ${step === 3 ? 'text-gray-900' : 'text-gray-400'}`}>التسعير</span>
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
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="ادخل اسم الدورة" 
                      className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900 text-right">الفئة</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold appearance-none text-right transition-all"
                    >
                      <option value="">ادخل الفئة</option>
                      <option value="programming">برمجة</option>
                      <option value="design">تصميم</option>
                      <option value="marketing">تسويق</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900 text-right">اضف وصف للدورة</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="ادخل وصف للدورة" 
                      className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold min-h-[150px] text-right transition-all"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900 text-right">اسم المدرب</label>
                    <select 
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold appearance-none text-right transition-all"
                    >
                      <option value="">ادخل اسم المدرب</option>
                      <option value="Ahmed">أحمد محمد</option>
                      <option value="Karim">كريم محمد</option>
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
                  <input 
                    type="text" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="ادخل سعر الدورة" 
                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-900 text-right">السعر النهائي بعد الخصم</label>
                  <input 
                    type="text" 
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value)}
                    placeholder="ادخل السعر النهائي بعد الخصم" 
                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all" 
                  />
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
                <button 
                  onClick={handleCreateCourse} 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء الدورة'}
                </button>
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
