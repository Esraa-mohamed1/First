'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  X, 
  Save, 
  ArrowRight, 
  Upload, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Send,
  Plus,
  Video,
  FileText,
  Monitor,
  GripVertical,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createCourse, createUnit, getCategories, getCourse, updateCourse } from '@/services/courses';
import { getProfileStatus, getMyUsageLimit } from '@/services/auth';
import AddLessonModal from '@/components/Academic/Modals/AddLessonModal';

export default function CreateCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseTypeParam = searchParams.get('type');
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'pricing'>('info');
  const [courseId, setCourseId] = useState<number | null>(null);
  
  // Basic Info States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState('');
  const [whoIsThisFor, setWhoIsThisFor] = useState('');
  
  // Accordion States
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    learning: false,
    audience: false
  });

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pricing Step States
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('paid');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [price, setPrice] = useState('');

  // Course Content State
  const [units, setUnits] = useState<any[]>([]);
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>({});
  const [isAddingLesson, setIsAddingLesson] = useState<Record<number, boolean>>({});
  const [newLessonTitles, setNewLessonTitles] = useState<Record<number, string>>({});
  const [lessonVideos, setLessonVideos] = useState<Record<number, File | null>>({});
  const [lessonVideoPreviews, setLessonVideoPreviews] = useState<Record<number, string>>({});
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentUnitForLesson, setCurrentUnitForLesson] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const refreshCourseContent = async (id: number) => {
    const data = await getCourse(id);
    const unitsFromApi = (data as any).chapters ? (data as any).chapters : data.units;
    setUnits(unitsFromApi || []);
    if (unitsFromApi && Array.isArray(unitsFromApi)) {
      const nextExpanded: Record<number, boolean> = {};
      for (const u of unitsFromApi) nextExpanded[u.id] = true;
      setExpandedUnits(nextExpanded);
    }
  };

  const ensureCourseCreated = async () => {
    if (courseId) return courseId;
    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان الدورة أولاً');
      throw new Error('Missing course title');
    }

    // Get user ID from profile (fallback keeps existing behavior)
    let userId = 2;
    try {
      const profile = await getProfileStatus();
      const userData = profile.data || profile;
      if (userData && userData.id) userId = userData.id;
    } catch (err) {
      console.error('Failed to get user profile', err);
    }

    const payload: any = {
      title,
      category_id: category || undefined,
      description,
      user_id: userId,
      what_you_will_learn: whatYouWillLearn,
      who_is_this_for: whoIsThisFor,
      price: pricingType === 'free' ? 0 : Number(price || 0),
      final_price: pricingType === 'free' ? 0 : Number(price || 0),
      status: 'draft',
      type: courseTypeParam || 'recorded',
      price_type: pricingType,
      image: selectedFile || undefined,
    };

    const created = await createCourse(payload);
    setCourseId(created.id);
    await refreshCourseContent(created.id);
    return created.id;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const handleAddUnit = async () => {
    if (!newUnitTitle.trim()) {
      toast.error('يرجى إدخال اسم الوحدة');
      return;
    }
    setIsSubmitting(true);
    try {
      const id = await ensureCourseCreated();
      await createUnit({
        course_id: id,
        title: newUnitTitle,
        description: '',
        order: (units?.length || 0) + 1,
      });
      toast.success('تم إضافة الوحدة بنجاح');
      setNewUnitTitle('');
      setIsAddingUnit(false);
      await refreshCourseContent(id);
    } catch (e) {
      toast.error('فشل إضافة الوحدة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUnit = (unitId: number) => {
    setUnits(prev => prev.filter(unit => unit.id !== unitId));
    setExpandedUnits(prev => {
      const newState = { ...prev };
      delete newState[unitId];
      return newState;
    });
  };

  const handleAddLesson = async (unitId: number) => {
    // Ensure course exists so unitId is always a real backend chapter id
    if (!courseId) {
      try {
        await ensureCourseCreated();
      } catch {
        return;
      }
    }
    setCurrentUnitForLesson(unitId);
    setIsLessonModalOpen(true);
  };

  const handleLessonAdded = async () => {
    setIsLessonModalOpen(false);
    setCurrentUnitForLesson(null);
    if (courseId) {
      await refreshCourseContent(courseId);
    }
  };

  const handleDeleteLesson = (unitId: number, lessonId: number) => {
    setUnits(prev => prev.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          lessons: unit.lessons.filter((lesson: any) => lesson.id !== lessonId)
        };
      }
      return unit;
    }));
  };

  const getTotalLessons = () => {
    return units.reduce((total, unit) => total + (unit.lessons?.length || 0), 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Get user ID from profile
      let userId = 2;
      try {
        const profile = await getProfileStatus();
        const userData = profile.data || profile;
        if (userData && userData.id) {
          userId = userData.id;
        }
      } catch (err) {
        console.error('Failed to get user profile', err);
      }

      // Check usage limit for new courses
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

      const payload: any = {
        title,
        category_id: category,
        description,
        user_id: userId,
        what_you_will_learn: whatYouWillLearn,
        who_is_this_for: whoIsThisFor,
        price: pricingType === 'free' ? 0 : Number(price),
        status,
        type: courseTypeParam || 'recorded',
        price_type: pricingType,
        final_price: pricingType === 'free' ? 0 : Number(price),
        image: selectedFile || undefined,
      };

      if (courseId) {
        await updateCourse(courseId, payload);
        toast.success('تم حفظ الدورة بنجاح');
        router.push(`/academic/courses/${courseId}`);
      } else {
        const created = await createCourse(payload);
        toast.success('تم إنشاء الدورة بنجاح');
        router.push(`/academic/courses/${created.id}`);
      }
    } catch (error: any) {
      toast.error(error?.message || 'فشل الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Header/Action Bar */}
        <div className="p-6 flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-[#E2FBE9] text-[#22C55E] rounded-lg font-bold text-sm hover:brightness-95 transition-all"
                onClick={() => setStatus('published')}
              >
                <Send size={16} />
                نشر
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-100 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all">
                <Eye size={16} />
                معاينة
              </button>
           </div>

           {/* Tab Switcher */}
           <div className="bg-white p-1.5 rounded-2xl flex items-center gap-2 shadow-sm border border-gray-50">
              <button 
                onClick={() => setActiveTab('info')}
                className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'info' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                معلومات الدورة
              </button>
              <button 
                onClick={() => setActiveTab('content')}
                className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'content' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                محتوي الدورة
              </button>
              <button 
                onClick={() => setActiveTab('pricing')}
                className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'pricing' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                السعر
              </button>
           </div>

           <button 
             onClick={() => router.back()}
             className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-100 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all"
           >
             <ArrowRight size={16} className="rotate-180" />
             عودة
           </button>
        </div>

        <div className="bg-white rounded-[24px] p-8 min-h-[600px] shadow-sm border border-gray-50">
          
          {activeTab === 'info' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Right Side: Basic Info */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900">اسم الدورة <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="ادخل اسم الدورة"
                      className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-900">صورة الدورة <span className="text-red-500">*</span></label>
                    <div
                      className="border-2 border-dashed border-gray-100 rounded-[24px] p-12 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 transition-all min-h-[320px] relative overflow-hidden bg-gray-50/30"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Upload className="text-gray-400 group-hover:text-blue-600" size={32} />
                          </div>
                          <div className="text-center">
                            <p className="font-black text-gray-900">اضف صورة الدورة</p>
                            <p className="text-xs font-bold text-gray-400 mt-2">صورة غلاف دورة : 1270x820</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Left Side: Accordion Sections */}
                <div className="space-y-4">
                  {/* Description Section */}
                  <div className="border border-gray-100 rounded-[20px] overflow-hidden bg-white shadow-sm">
                    <button 
                      onClick={() => toggleSection('description')}
                      className="w-full p-5 flex items-center justify-between font-black text-gray-900 hover:bg-gray-50/50 transition-all"
                    >
                      <span>وصف الدورة</span>
                      {openSections.description ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {openSections.description && (
                      <div className="p-5 pt-0">
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="ادخل وصف الدورة"
                          className="w-full p-4 bg-[#F8FAFC] border border-gray-50 rounded-xl outline-none focus:border-blue-600 font-bold min-h-[150px] text-right resize-none transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* What You Will Learn Section */}
                  <div className="border border-gray-100 rounded-[20px] overflow-hidden bg-white shadow-sm">
                    <button 
                      onClick={() => toggleSection('learning')}
                      className="w-full p-5 flex items-center justify-between font-black text-gray-900 hover:bg-gray-50/50 transition-all"
                    >
                      <span>ماذا تتعلم</span>
                      {openSections.learning ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {openSections.learning && (
                      <div className="p-5 pt-0">
                        <textarea
                          value={whatYouWillLearn}
                          onChange={(e) => setWhatYouWillLearn(e.target.value)}
                          placeholder="ماذا تتعلم في هذه الدورة ؟"
                          className="w-full p-4 bg-[#F8FAFC] border border-gray-50 rounded-xl outline-none focus:border-blue-600 font-bold min-h-[150px] text-right resize-none transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Who Is This For Section */}
                  <div className="border border-gray-100 rounded-[20px] overflow-hidden bg-white shadow-sm">
                    <button 
                      onClick={() => toggleSection('audience')}
                      className="w-full p-5 flex items-center justify-between font-black text-gray-900 hover:bg-gray-50/50 transition-all"
                    >
                      <span>لمن هذه الدورة</span>
                      {openSections.audience ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {openSections.audience && (
                      <div className="p-5 pt-0">
                        <textarea
                          value={whoIsThisFor}
                          onChange={(e) => setWhoIsThisFor(e.target.value)}
                          placeholder="اذكر لمن تكون هذه الدورة ؟"
                          className="w-full p-4 bg-[#F8FAFC] border border-gray-50 rounded-xl outline-none focus:border-blue-600 font-bold min-h-[150px] text-right resize-none transition-all"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center gap-4 pt-10">
                <button 
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="flex-1 max-w-[280px] flex items-center justify-center gap-3 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  حفظ
                </button>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-8">
              {/* Title and Summary */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">{title || 'اسم الدورة'}</h2>
                <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 flex items-center gap-8">
                   <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-bold text-sm">الاجمالي {units.length} وحدة</span>
                      <div className="w-[1px] h-4 bg-gray-200"></div>
                      <span className="text-gray-900 font-black">{getTotalLessons()} دروس</span>
                   </div>
                </div>
              </div>

              {/* Add Unit Button */}
              {isAddingUnit ? (
                <div className="bg-white border-2 border-blue-600 rounded-[24px] p-6 space-y-4">
                  <input
                    type="text"
                    value={newUnitTitle}
                    onChange={(e) => setNewUnitTitle(e.target.value)}
                    placeholder="ادخل اسم الوحدة"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all"
                    autoFocus
                  />
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleAddUnit}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black hover:brightness-110 transition-all"
                    >
                      <Plus size={18} />
                      اضافة
                    </button>
                    <button 
                      onClick={() => { setIsAddingUnit(false); setNewUnitTitle(''); }}
                      className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-black hover:bg-gray-200 transition-all"
                    >
                      الغاء
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingUnit(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all"
                >
                  <Plus size={20} />
                  اضافة وحدة
                </button>
              )}

              {/* Units List */}
              <div className="space-y-4">
                {units.map((unit, unitIndex) => (
                  <div key={unit.id} className="border border-gray-100 rounded-[24px] p-6 bg-white">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-gray-400 cursor-grab"><GripVertical size={20} /></div>
                        <h3 className="text-lg font-black text-gray-900">الوحدة {unitIndex + 1} : {unit.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button 
                          onClick={() => toggleUnit(unit.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          {expandedUnits[unit.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>

                    {expandedUnits[unit.id] && (
                      <div className="space-y-3">
                        {/* Lessons List */}
                        {unit.lessons?.map((lesson: any, lessonIndex: number) => (
                          <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                                {lessonIndex + 1}
                              </div>
                              <span className="font-bold text-gray-900">{lesson.title}</span>
                            </div>
                            <button 
                              onClick={() => handleDeleteLesson(unit.id, lesson.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}

                        {/* Add Lesson */}
                        <div 
                          onClick={() => handleAddLesson(unit.id)}
                          className="border-2 border-dashed border-gray-100 rounded-2xl p-6 flex items-center justify-center gap-3 text-gray-400 font-bold cursor-pointer hover:border-blue-600 hover:text-blue-600 transition-all"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                            <Plus size={18} />
                          </div>
                          اضف درس جديد
                        </div>
                    </div>
                  )}
                </div>
              ))}
                {units.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText size={36} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد وحدات بعد</h3>
                    <p className="text-gray-500 mb-6">ابدأ بإضافة وحدات لدورتك</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="max-w-2xl mx-auto space-y-10 pt-10">
               <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-gray-900">تحديد سعر الدورة</h2>
                  <p className="text-gray-400 font-bold">اختر خطة التسعير المناسبة لدورتك</p>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div 
                    onClick={() => setPricingType('free')}
                    className={`p-10 rounded-[32px] border-2 cursor-pointer transition-all text-center space-y-4 ${pricingType === 'free' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                  >
                     <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${pricingType === 'free' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Monitor size={32} />
                     </div>
                     <h3 className="text-xl font-black text-gray-900">مجاني</h3>
                     <p className="text-sm font-bold text-gray-400">الدورة متاحة للجميع بدون مقابل مادي</p>
                  </div>

                  <div 
                    onClick={() => setPricingType('paid')}
                    className={`p-10 rounded-[32px] border-2 cursor-pointer transition-all text-center space-y-4 ${pricingType === 'paid' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                  >
                     <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${pricingType === 'paid' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <FileText size={32} />
                     </div>
                     <h3 className="text-xl font-black text-gray-900">مدفوع</h3>
                     <p className="text-sm font-bold text-gray-400">حدد سعراً للدورة ليتمكن الطلاب من شرائها</p>
                  </div>
               </div>

               {pricingType === 'paid' && (
                 <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <label className="block text-sm font-black text-gray-900">سعر الدورة</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-left transition-all pl-16"
                      />
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">USD</span>
                    </div>
                 </div>
               )}

               <div className="flex justify-center pt-10">
                  <button 
                    onClick={handleSave}
                    className="w-full max-w-[400px] py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all"
                  >
                    حفظ بيانات التسعير
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
      
      <AddLessonModal
        isOpen={isLessonModalOpen}
        onClose={() => { setIsLessonModalOpen(false); setCurrentUnitForLesson(null); }}
        unitId={currentUnitForLesson || 0}
        unitName={units.find(u => u.id === currentUnitForLesson)?.title || ''}
        courseTitle={title}
        instructorName=''
        onLessonAdded={handleLessonAdded}
      />
    </div>
  );
}
