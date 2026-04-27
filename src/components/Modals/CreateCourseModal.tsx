'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, Play, Video, MapPin, Check, Plus, ArrowRight, Upload, Loader2, ChevronDown, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCourse } from '@/services/courses';
import { getProfileStatus, getMyUsageLimit } from '@/services/auth';
import { useModal } from '@/context/ModalContext';

const CreateCourseModal = () => {
  const { view, data, closeModal } = useModal();
  const courseId = data?.courseId;
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(1);
  const [courseType, setCourseType] = useState<string | null>(null);

  useEffect(() => {
    if (view === 'create-course') {
      if (data?.initialType) {
        setCourseType(data.initialType);
        setStep(2);
      } else {
        setStep(1);
        setCourseType(null);
      }
    }
  }, [view, data]);

  // Basic Info States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
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
  const [discount, setDiscount] = useState('');
  const [finalPrice, setFinalPrice] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculate final price
  useEffect(() => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (!isNaN(p) && !isNaN(d)) {
      const calculatedFinal = p - (p * (d / 100));
      setFinalPrice(calculatedFinal.toFixed(2));
    } else if (!isNaN(p) && !discount) {
      setFinalPrice(price);
    }
  }, [price, discount]);

  useEffect(() => {
    if (view === 'create-course') {
      const fetchInitialData = async () => {
        try {
          const { getCategories, getCourse } = await import('@/services/courses');
          const cats = await getCategories();
          setCategories(cats);

          if (courseId) {
            const course = await getCourse(courseId);
            if (course) {
              setTitle(course.title || '');
              setCategory(course.category_id || '');
              setDescription(course.description || '');
              setInstructor(course.instructor || '');
              setPricingType(course.price_type || (Number(course.price) === 0 ? 'free' : 'paid'));
              setStatus(course.status || 'draft');
              setPrice(course.price?.toString() || '');
              setFinalPrice(course.final_price?.toString() || '');
              setCourseType(course.type || 'recorded');
              if (course.image) setPreviewUrl(course.image);
            }
          }
        } catch (error) {
          console.error('Failed to fetch initial data:', error);
        }
      };
      fetchInitialData();
    }
  }, [view, courseId]);

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
      id: 'offline',
      title: 'دورة حضوري',
      description: 'دورة تتم في مكان فعلي داخل قاعة او مركز تدريبي',
      icon: MapPin,
    },
  ];

  if (view !== 'create-course') return null;

  const handleClose = () => {
    setStep(1);
    setCourseType(null);
    setTitle('');
    setCategory('');
    setDescription('');
    setInstructor('');
    setPrice('');
    setDiscount('');
    setFinalPrice('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsSubmitting(false);
    setErrors({});
    closeModal();
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'اسم الدورة مطلوب';
    if (!category) newErrors.category = 'التصنيف مطلوب';
    if (!description.trim()) newErrors.description = 'وصف الدورة مطلوب';
    if (!instructor) newErrors.instructor = 'اسم المدرب مطلوب';
    if (!selectedFile && !previewUrl) newErrors.image = 'صورة الدورة مطلوبة';

    if (pricingType === 'paid') {
      if (!price) newErrors.price = 'السعر مطلوب';
      else if (isNaN(Number(price))) newErrors.price = 'السعر يجب أن يكون رقماً';
      if (!finalPrice) newErrors.finalPrice = 'السعر النهائي مطلوب';
      else if (isNaN(Number(finalPrice))) newErrors.finalPrice = 'السعر النهائي يجب أن يكون رقماً';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1) {
      if (!courseType) {
        toast.error('يرجى اختيار نوع الدورة أولاً');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateCourse = async () => {
    setIsSubmitting(true);
    try {
      let userId = 2;
      try {
        const profile = await getProfileStatus();
        const userData = profile.data || profile;
        if (userData?.id) userId = userData.id;
      } catch (err) {
        console.error('Failed to get user profile', err);
      }

      if (!courseId) {
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
      }

      const payload: any = {
        title,
        category_id: category,
        description,
        user_id: userId,
        price: pricingType === 'free' ? 0 : Number(price),
        final_price: pricingType === 'free' ? 0 : Number(finalPrice),
        status,
        type: courseType,
        price_type: pricingType,
        image: selectedFile || undefined,
      };

      if (courseId) {
        const { updateCourse } = await import('@/services/courses');
        await updateCourse(courseId, payload);
        toast.success('تم تحديث الدورة بنجاح');
      } else {
        await createCourse(payload);
        toast.success('تم إنشاء الدورة بنجاح');
      }

      handleClose();
      if (pathname === '/academic/courses') window.location.reload();
      else router.push('/academic/courses');
    } catch (error: any) {
      toast.error(error?.message || 'فشل إنشاء الدورة');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-[24px] md:rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          
          {/* Modal Header with Progress */}
          {step >= 2 && (
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
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 mx-auto">اختيار نوع الدورة</h2>
                  <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-all absolute top-8 left-8">
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {courseTypes.map((type) => {
                    const isSelected = courseType === type.id;
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setCourseType(type.id)}
                        className={`p-8 border-2 rounded-[32px] transition-all group cursor-pointer text-center space-y-4 ${isSelected ? 'border-blue-600 bg-white shadow-xl shadow-blue-50 scale-105' : 'border-gray-100 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-50'}`}
                      >
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-colors ${isSelected ? 'bg-blue-600' : 'bg-blue-50 group-hover:bg-blue-600'}`}>
                          <Icon className={isSelected ? 'text-white' : 'text-blue-600 group-hover:text-white'} size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">{type.title}</h3>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed">{type.description}</p>
                        <button
                          className={`w-full py-3 font-black rounded-xl transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900 group-hover:bg-blue-600 group-hover:text-white'}`}
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

                <div className="flex justify-center gap-4">
                  <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-black text-sm hover:bg-blue-100 transition-all">
                    <Globe size={18} />
                    <span>معاينة الموقع</span>
                  </button>
                  <button onClick={handleClose} className="px-12 py-3.5 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all">الغاء</button>
                </div>
              </div>
            )}

            {/* Step 2: Basic Info */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-1">بيانات الدورة الاساسية</h2>
                  <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="space-y-2 order-2 md:order-1">
                    <label className="block text-sm font-black text-gray-900 text-right">اسم الدورة</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="ادخل اسم الدورة"
                      className={`w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all ${errors.title ? 'border-red-500' : ''}`}
                    />
                  </div>
                  <div className="space-y-2 order-1 md:order-2">
                    <label className="block text-sm font-black text-gray-900 text-right">اسم المدرب</label>
                    <div className="relative">
                      <select
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        className={`w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold appearance-none text-right transition-all ${errors.instructor ? 'border-red-500' : ''}`}
                      >
                        <option value="">ادخل اسم المدرب</option>
                        <option value="Ahmed">أحمد محمد</option>
                        <option value="Karim">كريم محمد</option>
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                  </div>

                  <div className="space-y-6 order-4 md:order-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-black text-gray-900 text-right">الفئة</label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className={`w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold appearance-none text-right transition-all ${errors.category ? 'border-red-500' : ''}`}
                        >
                          <option value="">ادخل الفئة</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-black text-gray-900 text-right">اضف وصف للدورة</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="ادخل وصف للدورة"
                        className={`w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold min-h-[180px] text-right transition-all ${errors.description ? 'border-red-500' : ''}`}
                      ></textarea>
                    </div>
                  </div>

                  <div className="space-y-2 order-3 md:order-4">
                    <label className="block text-sm font-black text-gray-900 text-right">صورة الدورة</label>
                    <div
                      className={`border-2 border-dashed rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 transition-all h-full min-h-[300px] relative overflow-hidden ${errors.image ? 'border-red-500' : 'border-gray-50'}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-[30px]" />
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <Upload className="text-gray-400 group-hover:text-blue-600" size={32} />
                          </div>
                          <div className="text-center">
                            <p className="font-black text-gray-900">اضف صورة الدورة</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-1">صورة غلاف دورة : 1270x820</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button onClick={prevStep} className="px-12 py-4 bg-gray-100 text-gray-900 font-black rounded-xl hover:bg-gray-200 transition-all">السابق</button>
                  <button onClick={nextStep} className="px-24 py-4 bg-blue-600 text-white font-black rounded-xl shadow-xl shadow-blue-100 hover:brightness-110 active:scale-95 transition-all">التالي</button>
                </div>
              </div>
            )}

            {/* Step 3: Status */}
            {step === 3 && (
              <div className="space-y-8 flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">حالة الدورة والتسعير</h2>
                
                <div className="w-full max-w-2xl space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="block text-sm font-black text-gray-900 text-right">السعر النهائي</label>
                       <input
                         type="number"
                         disabled={pricingType === 'free'}
                         value={finalPrice}
                         readOnly
                         className={`w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-right ${pricingType === 'free' ? 'opacity-50' : ''}`}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-sm font-black text-gray-900 text-right">السعر الأصلي</label>
                       <input
                         type="number"
                         disabled={pricingType === 'free'}
                         value={price}
                         onChange={(e) => setPrice(e.target.value)}
                         placeholder="0.00"
                         className={`w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all ${pricingType === 'free' ? 'opacity-50' : ''}`}
                       />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <div 
                      onClick={() => {
                        setPricingType(pricingType === 'free' ? 'paid' : 'free');
                        if (pricingType !== 'free') {
                          setPrice('0');
                          setFinalPrice('0');
                        }
                      }}
                      className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 cursor-pointer transition-all ${pricingType === 'free' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-100'}`}
                    >
                       <span className="font-black text-gray-900">دورة مجانية</span>
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${pricingType === 'free' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                          {pricingType === 'free' && <Check className="text-white" size={14} strokeWidth={3} />}
                       </div>
                    </div>

                    <div className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-100">
                      <label className="font-black text-gray-900">نشر مباشرة</label>
                      <input 
                        type="checkbox" 
                        checked={status === 'published'}
                        onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')}
                        className="w-6 h-6 rounded-lg accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-10">
                  <button onClick={prevStep} className="px-12 py-4 bg-gray-100 text-gray-900 font-black rounded-xl hover:bg-gray-200 transition-all">السابق</button>
                  <button 
                    onClick={handleCreateCourse} 
                    disabled={isSubmitting}
                    className="px-24 py-4 bg-blue-600 text-white font-black rounded-xl shadow-xl shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : (courseId ? 'تحديث الدورة' : 'إنشاء الدورة')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseModal;
