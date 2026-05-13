'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  Trash2,
  GripVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createCourse, getCategories, getCourse, updateCourse } from '@/services/courses';
import { getProfileStatus, getMyUsageLimit } from '@/services/auth';
import { getUsers } from '@/services/users';
import { User } from '@/types/api';
import QuillEditor from '@/components/Academic/QuillEditor';
import { SearchableSelect } from '@/components/Academic/Common/SearchableSelect';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: number | null;
  initialCourseType?: string | null;
}

const CreateCourseModal = ({ isOpen, onClose, courseId, initialCourseType }: CreateCourseModalProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'pricing'>('info');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<number | null>(null);
  
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
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'EGP' | 'SAR' | 'USD'>('SAR');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');


  // Course Content State (Mock for now to match UI)
  const [units, setUnits] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        try {
          const [cats, profile] = await Promise.all([getCategories(), getProfileStatus()]);
          setCategories(cats);

          const userData = profile.data || profile;
          if (userData) {
            setCurrentUser(userData);
            if (userData.role === 'admin' || userData.role === 'academy') {
              const allUsers = await getUsers();
              setInstructors(allUsers.filter((user) => user.role === 'academy'));
            }
          }

          if (courseId) {
            const course = await getCourse(courseId);
            setTitle(course.title || '');
            setCategory(course.category_id?.toString() || '');
            setDescription(course.description || '');
            setWhatYouWillLearn((course as any).what_to_learn || (course as any).what_you_will_learn || '');
            setWhoIsThisFor((course as any).target_audience || (course as any).who_is_this_for || '');
            setPricingType((course as any).price_type || (Number(course.price) === 0 ? 'free' : 'paid'));
            setStatus(course.status || 'draft');
            setPrice(course.price?.toString() || '');
            setCurrency(course.currency || 'SAR');
            setSelectedInstructor(course.user_id || null);
            if (course.image) setPreviewUrl(course.image);
          }
        } catch (error) {
          console.error('Failed to fetch initial data:', error);
        }
      };
      fetchInitialData();
    }
  }, [isOpen, courseId]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
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
    setErrors({});
    try {
      let userId = currentUser?.id || 2;
      if (selectedInstructor) {
        userId = selectedInstructor;
      }

      const payload: any = {
        title,
        category_id: category,
        description,
        user_id: userId,
        what_you_will_learn: whatYouWillLearn,
        who_is_this_for: whoIsThisFor,
        price: pricingType === 'free' ? 0 : Number(price),
        final_price: pricingType === 'free' ? 0 : Number(price),
        status,
        type: initialCourseType || 'recorded',
        price_type: pricingType,
        currency,
        image: selectedFile || undefined,
      };

      try {
        if (courseId) {
          await updateCourse(courseId, payload);
          toast.success('تم تحديث الدورة بنجاح');
        } else {
          await createCourse(payload);
          toast.success('تم إنشاء الدورة بنجاح');
        }
        onClose();
      } catch (error: any) {
        if (error?.errors) {
          setErrors(error.errors);
          toast.error('يرجى تصحيح الأخطاء أدناه');
        } else {
          toast.error(error?.message || 'فشل الحفظ');
        }
      }
    } catch (error: any) {
      toast.error(error?.message || 'فشل الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-7xl bg-[#F8FAFC] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          
          {/* Top Header/Action Bar */}
          <div className="p-6 flex items-center justify-between">
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

             <div className="w-[200px]"></div> {/* Spacer for symmetry */}
          </div>

          <div className="px-10 pb-10">
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
                          onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                          }}
                          placeholder="ادخل اسم الدورة"
                          className={`w-full p-4 bg-white border ${errors.title ? 'border-red-500 bg-red-50/30' : 'border-gray-100'} rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all text-gray-900`}
                        />
                        {errors.title && (
                          <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                            <X size={12} />
                            {errors.title}
                          </p>
                        )}
                      </div>

                      <SearchableSelect
                        label="الفئة"
                        options={categories.map(c => ({ id: c.id, name: c.name }))}
                        value={category}
                        onChange={(val) => {
                          setCategory(val as string);
                          if (errors.category_id) setErrors(prev => ({ ...prev, category_id: null }));
                        }}
                        placeholder="اختر فئة (اختياري)"
                        error={errors.category_id}
                      />

                      {(currentUser?.role === 'admin' || currentUser?.role === 'academy') && (
                        <SearchableSelect
                          label="المدرب"
                          options={instructors.map(i => ({ id: i.id, name: i.name }))}
                          value={selectedInstructor}
                          onChange={(val) => {
                            setSelectedInstructor(val as number);
                            if (errors.user_id) setErrors(prev => ({ ...prev, user_id: null }));
                          }}
                          placeholder="اختر مدرب"
                          error={errors.user_id}
                          required
                        />
                      )}

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
                            <QuillEditor
                              value={description}
                              onChange={setDescription}
                              placeholder="ادخل وصف الدورة"
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
                            <QuillEditor
                              value={whatYouWillLearn}
                              onChange={setWhatYouWillLearn}
                              placeholder="ماذا تتعلم في هذه الدورة ؟"
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
                            <QuillEditor
                              value={whoIsThisFor}
                              onChange={setWhoIsThisFor}
                              placeholder="اذكر لمن تكون هذه الدورة ؟"
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
                    <button 
                      onClick={onClose}
                      className="flex-1 max-w-[280px] flex items-center justify-center gap-3 py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 active:scale-95 transition-all"
                    >
                      <ArrowRight size={20} className="rotate-180" />
                      عودة
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-8">
                  {/* Title and Summary */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900">أساسيات تصميم تجربة المستخدم (UX/UI)</h2>
                    <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 flex items-center gap-8">
                       <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-bold text-sm">الاجمالي {units.length} وحدة</span>
                          <div className="w-[1px] h-4 bg-gray-200"></div>
                          <span className="text-gray-900 font-black">0 دروس</span>
                       </div>
                    </div>
                  </div>

                  {/* Add Unit Button */}
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all">
                    <Plus size={20} />
                    اضافة وحدة
                  </button>

                  {/* Units List (Empty State Placeholder matching image) */}
                  <div className="space-y-4">
                     <div className="border border-gray-100 rounded-[24px] p-6 bg-white">
                        <div className="flex items-center justify-between mb-8">
                           <div className="flex items-center gap-4">
                              <div className="text-gray-400 cursor-grab"><GripVertical size={20} /></div>
                              <h3 className="text-lg font-black text-gray-900">الوحدة الأولي : مقدمة في تجربة وواجهة المستخدم</h3>
                           </div>
                           <div className="flex items-center gap-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><X size={18} className="rotate-45" /></button> {/* Edit icon placeholder */}
                              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><ChevronDown size={20} /></button>
                           </div>
                        </div>

                        {/* Add Lesson Placeholder */}
                        <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 flex items-center justify-center gap-3 text-gray-400 font-bold cursor-pointer hover:border-blue-600 hover:text-blue-600 transition-all">
                           <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50">
                              <Plus size={18} />
                           </div>
                           اضف درس جديد
                        </div>
                     </div>
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
                        <div className="relative group">
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => {
                              setPrice(e.target.value);
                              if (errors.price) setErrors(prev => ({ ...prev, price: null }));
                            }}
                            placeholder="0.00"
                            className={`w-full p-5 bg-white border ${errors.price ? 'border-red-500 bg-red-50/30' : 'border-gray-100'} rounded-2xl outline-none focus:border-blue-600 font-bold text-left transition-all pl-24 text-gray-900 shadow-sm`}
                          />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-100 pr-4">
                            <select 
                              value={currency}
                              onChange={(e) => setCurrency(e.target.value as any)}
                              className="bg-transparent font-black text-blue-600 outline-none cursor-pointer text-sm text-gray-900 appearance-none hover:text-blue-700 transition-colors"
                            >
                              <option value="SAR" className="text-gray-900">SAR - Saudi Riyal (ر.س)</option>
                              <option value="EGP" className="text-gray-900">EGP - Egyptian Pound (ج.م)</option>
                              <option value="USD" className="text-gray-900">USD - United States Dollar ($)</option>
                            </select>
                            <ChevronDown size={14} className="text-blue-600 pointer-events-none" />
                          </div>
                        </div>
                        {errors.price && (
                          <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                            <X size={12} />
                            {errors.price}
                          </p>
                        )}
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

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 left-8 p-3 text-gray-400 hover:text-gray-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-gray-50 md:hidden"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseModal;
