'use client';

import React, { useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, Play, Video, MapPin, Check, Plus, ArrowRight, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCourse } from '@/services/courses';
import { getProfileStatus, getMyUsageLimit } from '@/services/auth';
import { uploadFile } from '@/services/upload';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCourseModal = ({ isOpen, onClose }: CreateCourseModalProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(1);
  const [courseType, setCourseType] = useState<string | null>(null);

  // Basic Info States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pricing Step States
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('paid');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [price, setPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const courseTypes = [
    {
      id: 'recorded',
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
      id: 'physical',
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
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsSubmitting(false);
    setErrors({});
    onClose();
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'اسم الدورة مطلوب';
    // if (!category) newErrors.category = 'الفئة مطلوبة';
    if (!description.trim()) newErrors.description = 'وصف الدورة مطلوب';
    if (!instructor) newErrors.instructor = 'اسم المدرب مطلوب';
    if (!selectedFile) newErrors.image = 'صورة الدورة مطلوبة';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (pricingType === 'paid') {
      if (!price) newErrors.price = 'السعر مطلوب';
      else if (isNaN(Number(price))) newErrors.price = 'السعر يجب أن يكون رقماً';

      if (!finalPrice) newErrors.finalPrice = 'السعر النهائي مطلوب';
      else if (isNaN(Number(finalPrice))) newErrors.finalPrice = 'السعر النهائي يجب أن يكون رقماً';
      else if (Number(finalPrice) > Number(price)) newErrors.finalPrice = 'السعر النهائي يجب أن يكون أقل من السعر الأصلي';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 2) {
      if (validateStep2()) setStep(prev => prev + 1);
    } else {
      setStep(prev => prev + 1);
    }
  };
  const prevStep = () => setStep(prev => prev - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleCreateCourse = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    try {
      // Get user ID from profile
      let userId = 2; // Fallback default
      try {
        const profile = await getProfileStatus();
        const userData = profile.data || profile;
        if (userData && userData.id) {
          userId = userData.id;
        }
      } catch (err) {
        console.error('Failed to get user profile', err);
      }

      try {
        const usageResponse = await getMyUsageLimit();
        const maxCoursesObj = usageResponse?.data?.find((i: any) => i.feature_slug === 'max_courses');
        if (maxCoursesObj) {
          const used = parseFloat(maxCoursesObj.used_amount || '0');
          const max = parseFloat(maxCoursesObj.total_limit || '0');
          if (used >= max) {
            toast.error('عفواً، لقد وصلت للحد الأقصى المسموح به لعدد الدورات. يرجى ترقية باقتك.');
            setIsSubmitting(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to get usage limits', err);
      }

      const typeValue = courseType || 'recorded';
      const payload: any = {
        title,
        // category_id: category, // Temporarily disabled
        description,
        user_id: userId,
        price: pricingType === 'free' ? 0 : Number(price),
        final_price: pricingType === 'free' ? 0 : Number(finalPrice),
        status,
        type: typeValue,
        price_type: pricingType,
        image: selectedFile || undefined,
      };

      const newCourse = await createCourse(payload);

      toast.success('تم إنشاء الدورة بنجاح');
      handleClose();

      // Navigate to courses page or refresh if already there
      if (pathname === '/academic/courses') {
        window.location.reload();
      } else {
        router.push('/academic/courses');
      }
    } catch (error: any) {
      toast.error(error?.message || 'فشل إنشاء الدورة');
      console.error(error);
      if (error?.error) {
        const serverErrors: Record<string, string> = {};
        Object.keys(error.error).forEach(key => {
          // Map backend field names to frontend state names if needed
          if (key === 'category_id') serverErrors['category'] = error.error[key][0];
          else if (key === 'final_price') serverErrors['finalPrice'] = error.error[key][0];
          else serverErrors[key] = error.error[key][0];
        });
        setErrors(serverErrors);

        // Check if there are errors related to Step 2 fields
        const step2Fields = ['title', 'category', 'description', 'instructor', 'image'];
        const hasStep2Errors = step2Fields.some(field => serverErrors[field]);

        if (hasStep2Errors) {
          setStep(2);
          toast.error('يرجى التحقق من بيانات الدورة');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-[24px] md:rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

          {/* Modal Header with Progress */}
          {step > 1 && (
            <div className="p-4 md:p-8 pb-0 flex items-center justify-center gap-4 md:gap-12 relative">
              <div className="flex items-center gap-2 md:gap-4 relative z-10">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all ${step >= 2 ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'border-gray-200 text-gray-400'}`}>
                  <span className="text-lg md:text-xl font-black">١</span>
                </div>
                <span className={`font-black text-xs md:text-sm ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>بيانات الدورة</span>
              </div>

              <div className={`h-1 flex-1 max-w-[50px] md:max-w-[150px] rounded-full transition-all ${step >= 3 ? 'bg-blue-600' : 'bg-gray-100'}`}></div>

              <div className="flex items-center gap-2 md:gap-4 relative z-10">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all ${step === 3 ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'border-gray-200 text-gray-400'}`}>
                  <span className="text-lg md:text-xl font-black">٢</span>
                </div>
                <span className={`font-black text-xs md:text-sm ${step === 3 ? 'text-gray-900' : 'text-gray-400'}`}>التسعير</span>
              </div>
            </div>
          )}

          <div className="p-6 md:p-10">
            {/* Step 1: Choice */}
            {step === 1 && (
              <div className="space-y-6 md:space-y-10">
                <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900">اختيار نوع الدورة</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {courseTypes.map((type) => {
                    const isSelected = courseType === type.id;
                    const Icon = type.icon;

                    return (
                      <div
                        key={type.id}
                        onClick={() => { setCourseType(type.id); }}
                        className={`p-8 border-2 rounded-[32px] transition-all group cursor-pointer text-center space-y-4 ${isSelected
                          ? 'border-blue-600 bg-white shadow-xl shadow-blue-50 scale-105'
                          : 'border-gray-100 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-50'
                          }`}
                      >
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-colors ${isSelected ? 'bg-blue-600' : 'bg-blue-50 group-hover:bg-blue-600'
                          }`}>
                          <Icon className={isSelected ? 'text-white' : 'text-blue-600 group-hover:text-white'} size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">{type.title}</h3>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed">{type.description}</p>
                        <button
                          className={`w-full py-3 font-black rounded-xl transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900 group-hover:bg-blue-600 group-hover:text-white'
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
              <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-4 md:space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-black text-gray-900 text-right">
                        اسم الدورة <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="ادخل اسم الدورة"
                        className={`w-full p-4 bg-white border rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all ${errors.title ? 'border-red-500' : 'border-gray-100'}`}
                      />
                      {errors.title && <p className="text-red-500 text-sm font-bold">{errors.title}</p>}
                    </div>
                    {/* <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900 text-right">
                      الفئة <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full p-4 bg-white border rounded-2xl outline-none focus:border-blue-600 font-bold appearance-none text-right transition-all ${errors.category ? 'border-red-500' : 'border-gray-100'}`}
                    >
                      <option value="">ادخل الفئة</option>
                      <option value="1">برمجة</option>
                      <option value="2">تصميم</option>
                      <option value="3">تسويق</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-sm font-bold">{errors.category}</p>}
                  </div> */}
                    <div className="space-y-2">
                      <label className="block text-sm font-black text-gray-900 text-right">
                        اضف وصف للدورة <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="ادخل وصف للدورة"
                        className={`w-full p-4 bg-white border rounded-2xl outline-none focus:border-blue-600 font-bold min-h-[150px] text-right transition-all ${errors.description ? 'border-red-500' : 'border-gray-100'}`}
                      ></textarea>
                      {errors.description && <p className="text-red-500 text-sm font-bold">{errors.description}</p>}
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-black text-gray-900 text-right">
                        اسم المدرب <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        className={`w-full p-4 bg-white border rounded-2xl outline-none focus:border-blue-600 font-bold appearance-none text-right transition-all ${errors.instructor ? 'border-red-500' : 'border-gray-100'}`}
                      >
                        <option value="">ادخل اسم المدرب</option>
                        <option value="Ahmed">أحمد محمد</option>
                        <option value="Karim">كريم محمد</option>
                      </select>
                      {errors.instructor && <p className="text-red-500 text-sm font-bold">{errors.instructor}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-black text-gray-900 text-right">
                        صورة الدورة <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`border-2 border-dashed rounded-[32px] p-8 md:p-12 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 transition-all min-h-[250px] relative overflow-hidden ${errors.image ? 'border-red-500' : 'border-gray-100'}`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-[30px]" />
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                              <Plus className="text-gray-400 group-hover:text-blue-600" size={32} />
                            </div>
                            <div className="text-center">
                              <p className="font-black text-gray-900">اضف صورة الدورة</p>
                              <p className="text-xs font-bold text-gray-400 mt-1">صورة غلاف دورة : 1270x820</p>
                            </div>
                          </>
                        )}
                      </div>
                      {errors.image && <p className="text-red-500 text-sm font-bold">{errors.image}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={prevStep} className="px-8 py-4 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center gap-2">
                    <ArrowRight size={20} />
                    السابق
                  </button>
                  <button onClick={nextStep} className="px-16 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all">التالي</button>
                </div>
              </div>
            )}

            {/* Step 3: Pricing */}
            {step === 3 && (
              <div className="space-y-6 md:space-y-10 flex flex-col items-center">
                <div className="w-full max-w-md space-y-4 md:space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => {
                        setPricingType('free');
                        setErrors(prev => ({ ...prev, price: '', finalPrice: '' }));
                      }}
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

                  {pricingType === 'paid' && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-black text-gray-900 text-right">السعر</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="ادخل سعر الدورة"
                          className={`w-full p-4 bg-white border rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all ${errors.price ? 'border-red-500' : 'border-gray-100'}`}
                        />
                        {errors.price && <p className="text-red-500 text-sm font-bold">{errors.price}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-black text-gray-900 text-right">السعر النهائي بعد الخصم</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={finalPrice}
                          onChange={(e) => setFinalPrice(e.target.value)}
                          placeholder="ادخل السعر النهائي بعد الخصم"
                          className={`w-full p-4 bg-white border rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all ${errors.finalPrice ? 'border-red-500' : 'border-gray-100'}`}
                        />
                        {errors.finalPrice && <p className="text-red-500 text-sm font-bold">{errors.finalPrice}</p>}
                      </div>
                    </>
                  )}

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

                <div className="flex justify-between w-full max-w-md pt-4 gap-4">
                  <button
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-70"
                  >
                    <ArrowRight size={20} />
                    السابق
                  </button>
                  <button
                    onClick={handleCreateCourse}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>جاري الإنشاء...</span>
                      </>
                    ) : (
                      'إنشاء الدورة'
                    )}
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
    </div>
  );
};

export default CreateCourseModal;
