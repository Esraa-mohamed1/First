'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
  Plus,
  Video,
  FileText,
  Monitor,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createCourse, createUnit, getCategories, getCourse, updateCourse } from '@/services/courses';
import { getProfileStatus, getMyUsageLimit } from '@/services/auth';
import { getUsers } from '@/services/users';
import { User } from '@/types/api';
import AddLessonModal from '@/components/Academic/Modals/AddLessonModal';
import QuillEditor from '@/components/Academic/QuillEditor';
import { SearchableSelect } from '@/components/Academic/Common/SearchableSelect';

const MySwal = withReactContent(Swal);

export default function CreateCourseClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseTypeParam = searchParams.get('type');
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'pricing'>('info');
  const [courseId, setCourseId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Basic Info States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  
  interface CustomSection {
    id: string;
    title: string;
    items: string[];
  }
  const [customSections, setCustomSections] = useState<CustomSection[]>([
    { id: 'what_you_will_learn', title: 'ماذا ستتعلم؟', items: [''] }
  ]);
  
  const [whoIsThisFor, setWhoIsThisFor] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<number | null>(null);
  const [instructors, setInstructors] = useState<User[]>([]);

  // Accordion States
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    learning: false,
    audience: false,
  });
  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Pricing Step States
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('paid');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'EGP' | 'SAR' | 'USD'>('SAR');

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
  const [errors, setErrors] = useState<Record<string, any>>({});

  const getInfoError = (sectionId: string, itemIndex: number, type: 'key' | 'value') => {
    let globalIndex = 0;
    for (const section of customSections) {
      const validItems = section.items.map((item, idx) => ({ item, idx }));
      // The logic in handleSave filters by trim() !== ''
      const filteredItems = validItems.filter(v => v.item.trim() !== '');
      
      const found = filteredItems.find(v => section.id === sectionId && v.idx === itemIndex);
      if (found) {
        // Find if there's an error for this globalIndex
        const actualIndex = globalIndex + filteredItems.indexOf(found);
        const errorKey = `infos.${actualIndex}.${type}`;
        return errors[errorKey];
      }
      globalIndex += filteredItems.length;
    }
    return null;
  };

  const handleAddSectionItem = (sectionId: string) => {
    setCustomSections(prev => prev.map(sec => 
      sec.id === sectionId ? { ...sec, items: [...sec.items, ''] } : sec
    ));
  };

  const handleUpdateSectionItem = (sectionId: string, itemIndex: number, value: string) => {
    setCustomSections(prev => prev.map(sec => {
      if (sec.id === sectionId) {
        const newItems = [...sec.items];
        newItems[itemIndex] = value;
        return { ...sec, items: newItems };
      }
      return sec;
    }));
  };

  const handleRemoveSectionItem = (sectionId: string, itemIndex: number) => {
    setCustomSections(prev => prev.map(sec => {
      if (sec.id === sectionId) {
        const newItems = sec.items.filter((_, i) => i !== itemIndex);
        return { ...sec, items: newItems.length > 0 ? newItems : [''] };
      }
      return sec;
    }));
  };

  const handleAddCustomSection = () => {
    const newId = `section_${Date.now()}`;
    setCustomSections([...customSections, { id: newId, title: 'قسم جديد', items: [''] }]);
    if (!openSections[newId]) {
      setOpenSections(prev => ({ ...prev, [newId]: true }));
    }
  };

  const handleUpdateSectionTitle = (sectionId: string, newTitle: string) => {
    setCustomSections(prev => prev.map(sec => 
      sec.id === sectionId ? { ...sec, title: newTitle } : sec
    ));
  };

  const handleRemoveSection = (sectionId: string) => {
    setCustomSections(prev => prev.filter(sec => sec.id !== sectionId));
  };

  const refreshCourseContent = async (id: number) => {
    const data = await getCourse(id);
    const unitsFromApi = (data as any).chapters ? (data as any).chapters : data.units;
    setUnits(unitsFromApi || []);
    if (unitsFromApi && Array.isArray(unitsFromApi)) {
      const nextExpanded: Record<number, boolean> = {};
      for (const u of unitsFromApi) nextExpanded[u.id] = true;
      setExpandedUnits(nextExpanded);
    }
    
    // Parse custom sections from infos if we are refreshing
    if ((data as any).infos && Array.isArray((data as any).infos) && (data as any).infos.length > 0) {
      const grouped = (data as any).infos.reduce((acc: any, info: any) => {
         const key = info.info_key || info.key;
         const value = info.info_value || info.value;
         
         if (!key || !value) return acc;

         if (!acc[key]) {
           acc[key] = {
              id: key,
              title: key === 'what_you_will_learn' ? 'ماذا ستتعلم؟' : key,
              items: []
           };
         }
         acc[key].items.push({ value, order: info.order || 0 });
         return acc;
      }, {});
      
      const parsedSections = Object.values(grouped).map((group: any) => {
          const sortedItems = group.items.sort((a: any, b: any) => a.order - b.order).map((i: any) => i.value);
          return {
              id: group.id,
              title: group.title,
              items: sortedItems.length > 0 ? sortedItems : ['']
          };
      });
      setCustomSections(parsedSections as CustomSection[]);
    }
  };

  const ensureCourseCreated = async () => {
    if (courseId) return courseId;
    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان الدورة أولاً');
      throw new Error('Missing course title');
    }

    // Get user ID from profile (fallback keeps existing behavior)
    let userId = currentUser?.id || 2; // Default to 2 if no current user or ID
    if (selectedInstructor) {
      userId = selectedInstructor;
    }

    const payload: any = {
      title,
      category_id: category || undefined,
      description,
      user_id: userId,
      who_is_this_for: whoIsThisFor,
      price: pricingType === 'free' ? 0 : Number(price || 0),
      final_price: pricingType === 'free' ? 0 : Number(price || 0),
      status: 'draft',
      type: courseTypeParam || 'recorded',
      price_type: pricingType,
      currency,
      image: selectedFile || undefined,
    };


    // Add custom sections
    let infoIndex = 0;
    customSections.forEach((section) => {
      section.items.filter(p => p.trim() !== '').forEach((point, pointIndex) => {
        payload[`infos[${infoIndex}][key]`] = section.id === 'what_you_will_learn' ? 'what_you_will_learn' : section.title;
        payload[`infos[${infoIndex}][value]`] = point;
        payload[`infos[${infoIndex}][order]`] = pointIndex + 1;
        infoIndex++;
      });
    });

    const created = await createCourse(payload);
    setCourseId(created.id);
    await refreshCourseContent(created.id);
    return created.id;
  };

  useEffect(() => {
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
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleUnit = (unitId: number) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
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
    } catch {
      toast.error('فشل إضافة الوحدة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUnit = (unitId: number) => {
    setUnits((prev) => prev.filter((unit) => unit.id !== unitId));
    setExpandedUnits((prev) => {
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
    setUnits((prev) =>
      prev.map((unit) => {
        if (unit.id === unitId) {
          return {
            ...unit,
            lessons: unit.lessons.filter((lesson: any) => lesson.id !== lessonId),
          };
        }
        return unit;
      })
    );
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
    // Basic client-side validation
    const newErrors: Record<string, any> = {};
    if (!title.trim()) newErrors.title = 'عنوان الدورة مطلوب';
    if (!selectedInstructor && (currentUser?.role === 'admin' || currentUser?.role === 'academy')) {
      newErrors.user_id = 'يرجى اختيار مدرب';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      let userId = currentUser?.id || 2; // Default to 2 if no current user or ID
      if (selectedInstructor) {
        userId = selectedInstructor;
      }

      // Check usage limit for new courses
      try {
        const usageResponse = await getMyUsageLimit();
        const maxCoursesObj = usageResponse?.data?.find((i: any) => i.feature_slug === 'max_courses');
        if (maxCoursesObj) {
          const used = parseFloat(maxCoursesObj.used_amount || '0');
          const max = parseFloat(maxCoursesObj.total_limit || '0');
          if (used >= max) {
            await MySwal.fire({
              title: 'وصلت للحد الأقصى',
              text: 'عفواً، لقد وصلت للحد الأقصى المسموح به لعدد الدورات. يرجى ترقية باقتك.',
              icon: 'warning',
              confirmButtonText: 'حسناً',
              confirmButtonColor: '#2563eb'
            });
            setIsSubmitting(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to get usage limits', err);
      }

      const payload: any = {
        title,
        category_id: category ? Number(category) : undefined,
        description,
        user_id: userId,
        who_is_this_for: whoIsThisFor,
        price: pricingType === 'free' ? 0 : Number(price),
        status,
        type: courseTypeParam || 'recorded',
        price_type: pricingType,
        final_price: pricingType === 'free' ? 0 : Number(price),
        currency,
        image: selectedFile || undefined,
      };


      // Add custom sections
      let infoIndex = 0;
      customSections.forEach((section) => {
        section.items.filter(p => p.trim() !== '').forEach((point, pointIndex) => {
          payload[`infos[${infoIndex}][key]`] = section.id === 'what_you_will_learn' ? 'what_you_will_learn' : section.title;
          payload[`infos[${infoIndex}][value]`] = point;
          payload[`infos[${infoIndex}][order]`] = pointIndex + 1;
          infoIndex++;
        });
      });

      try {
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
    <>
      <div className="space-y-6 p-4 md:p-6" dir="rtl">
        {/* Tabs Header & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-200 px-2 md:px-4">
          <div className="flex items-center justify-start gap-8 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-4 font-black text-sm whitespace-nowrap relative transition-all ${
                activeTab === 'info' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              معلومات الدورة
              {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-4 font-black text-sm whitespace-nowrap relative transition-all ${
                activeTab === 'content' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              محتوى الدورة
              {activeTab === 'content' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`pb-4 font-black text-sm whitespace-nowrap relative transition-all ${
                activeTab === 'pricing' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              التسعير
              {activeTab === 'pricing' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
            </button>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto pb-4 lg:pb-3">
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm">
              <Eye size={18} />
              <span>معاينة</span>
            </button>
            <button
              onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${
                status === 'published' 
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-100' 
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100'
              }`}
            >
              <span>{status === 'published' ? 'نشر' : 'مسودة'}</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'info' && (
            <div className="max-w-4xl space-y-6">
              {/* Course Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-black text-gray-900">
                  اسم الدورة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                  }}
                  placeholder="ادخل اسم الدورة"
                  className={`w-full p-4 bg-white border ${errors.title ? 'border-red-500 bg-red-50/30' : 'border-gray-200'} rounded-2xl outline-none focus:border-blue-600 font-bold text-sm transition-all text-gray-900`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                    <X size={12} />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Category Dropdown */}
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

              {/* Instructor Dropdown (Admin/Academy Only) */}
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

              {/* Course Image */}
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-black text-gray-900">
                  صورة الدورة <span className="text-red-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 bg-gray-50 cursor-pointer hover:border-blue-600 transition-all group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  {previewUrl ? (
                    <div className="relative w-full max-w-[200px] aspect-video rounded-2xl overflow-hidden">
                      <img src={previewUrl} alt="Course Preview" className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="text-blue-600" size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-gray-900 text-lg">اضف صورة الدورة</p>
                        <p className="text-sm font-bold text-gray-500 mt-2">صورة غلاف الدورة : 820x1270</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Dynamic Custom Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Description Accordion */}
                <div className={`bg-white border ${errors.description ? 'border-red-500' : 'border-gray-200/80'} rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col max-h-[500px]`}>
                  <button
                    onClick={() => toggleSection('description')}
                    className="w-full p-5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100 shrink-0"
                  >
                    <span className="font-black text-gray-900">وصف الدورة</span>
                    {openSections.description ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                  </button>
                  {openSections.description && (
                    <div className="p-5 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                      <QuillEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="ادخل وصف الدورة"
                      />
                      {errors.description && <p className="text-red-500 text-xs font-bold mt-2">{errors.description}</p>}
                    </div>
                  )}
                </div>

                {/* Target Audience Accordion */}
                <div className={`bg-white border ${errors.who_is_this_for ? 'border-red-500' : 'border-gray-200/80'} rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col max-h-[500px]`}>
                  <button
                    onClick={() => toggleSection('audience')}
                    className="w-full p-5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100 shrink-0"
                  >
                    <span className="font-black text-gray-900">لمن هذه الدورة</span>
                    {openSections.audience ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                  </button>
                  {openSections.audience && (
                    <div className="p-5 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                      <QuillEditor
                        value={whoIsThisFor}
                        onChange={setWhoIsThisFor}
                        placeholder="الفئة المستهدفة من الدورة"
                      />
                      {errors.who_is_this_for && <p className="text-red-500 text-xs font-bold mt-2">{errors.who_is_this_for}</p>}
                    </div>
                  )}
                </div>

                {/* Render all custom sections */}
                {customSections.map((section) => (
                  <div key={section.id} className="bg-white border border-gray-200/80 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col max-h-[500px]">
                    <div className="w-full p-5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100 shrink-0">
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        {section.id === 'what_you_will_learn' ? (
                          <>
                            <span className="font-black text-gray-900">{section.title}</span>
                          </>
                        ) : (
                          <div className="flex-1 space-y-1">
                            <input 
                              type="text"
                              value={section.title}
                              onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                              className="font-black text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 outline-none w-full"
                              placeholder="اسم القسم (مثال: متطلبات الدورة)"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {section.id !== 'what_you_will_learn' && (
                          <button
                            onClick={() => handleRemoveSection(section.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button onClick={() => toggleSection(section.id)} className="p-1">
                          {openSections[section.id] ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    {openSections[section.id] && (
                      <div className="p-5 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 space-y-4">
                        {section.items.map((point, index) => {
                          const valueError = getInfoError(section.id, index, 'value');
                          const keyError = getInfoError(section.id, index, 'key');
                          return (
                            <div key={index} className="space-y-2">
                              <div className={`relative group bg-gray-50 p-4 rounded-2xl border ${valueError || keyError ? 'border-red-500' : 'border-gray-100'} transition-all hover:border-blue-200`}>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                    عنصر {index + 1}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveSectionItem(section.id, index)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={point}
                                  onChange={(e) => handleUpdateSectionItem(section.id, index, e.target.value)}
                                  placeholder="ادخل محتوى العنصر..."
                                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-gray-900"
                                />
                              </div>
                              {keyError && <p className="text-red-500 text-[10px] font-bold px-2">{keyError}</p>}
                              {valueError && <p className="text-red-500 text-[10px] font-bold px-2">{valueError}</p>}
                            </div>
                          );
                        })}
                        <button
                          onClick={() => handleAddSectionItem(section.id)}
                          className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-3 text-gray-500 font-bold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/30 transition-all group"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Plus size={18} />
                          </div>
                          <span>إضافة عنصر جديد</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Section Button */}
              <button
                onClick={handleAddCustomSection}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-3 text-gray-600 font-bold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Plus size={20} className="text-gray-500 group-hover:text-blue-600" />
                </div>
                <span>إضافة قسم اختياري جديد</span>
              </button>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  onClick={() => router.back()}
                  className="px-10 py-3 bg-gray-100 text-gray-600 font-black rounded-full hover:bg-gray-200 transition-all text-sm"
                >
                  عودة
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-12 py-3 bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-100 hover:brightness-110 transition-all text-sm disabled:opacity-70"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="flex flex-col gap-6">
              {/* Header & Add Unit */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border border-blue-200 rounded-xl p-2 bg-white gap-3 shadow-sm">
                <div className="flex-1 text-center md:text-right px-4 py-1.5">
                  <span className="font-bold text-gray-800 text-sm">
                    الاجمالي {units?.length || 0} وحدة فقط | {getTotalLessons()} دروس
                  </span>
                </div>
                <button
                  onClick={() => setIsAddingUnit(!isAddingUnit)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                >
                  <Plus size={18} strokeWidth={3} />
                  <span>اضافة وحدة</span>
                </button>
              </div>

              {/* Add Unit Form (Inline) */}
              {isAddingUnit && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-lg font-black text-gray-900">ادخل بيانات الوحدة</h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-500">اسم الوحدة</label>
                      <input
                        type="text"
                        value={newUnitTitle}
                        onChange={(e) => setNewUnitTitle(e.target.value)}
                        placeholder="ادخل اسم الوحدة"
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-600 font-bold text-sm transition-all text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsAddingUnit(false)}
                      className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-200 transition-all text-sm"
                    >
                      الغاء
                    </button>
                    <button
                      onClick={handleAddUnit}
                      disabled={isSubmitting}
                      className="px-10 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all disabled:opacity-70 text-sm shadow-lg shadow-blue-50"
                    >
                      {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                  </div>
                </div>
              )}

              {/* Units List */}
              <div className="space-y-3">
                {units && units.length > 0 ? (
                  units.map((unit) => (
                    <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Unit Header */}
                      <div
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                        onClick={() => toggleUnit(unit.id)}
                      >
                        <div className="flex items-center gap-3">
                          <button className="p-1.5 bg-gray-50 rounded-lg text-blue-600">
                            {expandedUnits[unit.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                          <div>
                            <h3 className="text-base md:text-lg font-black text-gray-900">{unit.title}</h3>
                            {unit.description && <p className="text-xs text-gray-400 font-bold mt-0.5">{unit.description}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUnit(unit.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Lessons List */}
                      {expandedUnits[unit.id] && (
                        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/30">
                          {unit.lessons && unit.lessons.length > 0
                            ? unit.lessons.map((lesson: any) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-all group shadow-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                        lesson.type === 'video'
                                          ? 'bg-blue-50 text-blue-600'
                                          : lesson.type === 'pdf'
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-orange-50 text-orange-600'
                                      }`}
                                    >
                                      {lesson.type === 'video' ? (
                                        <Video size={18} />
                                      ) : lesson.type === 'pdf' ? (
                                        <FileText size={18} />
                                      ) : (
                                        <FileText size={18} />
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-900 text-sm">{lesson.title}</h4>
                                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-0.5">
                                        <span>
                                          {lesson.type === 'video'
                                            ? 'فيديو'
                                            : lesson.type === 'pdf'
                                              ? 'ملف PDF'
                                              : 'عرض تقديمي'}
                                        </span>
                                        {lesson.duration && <span>• {lesson.duration} دقيقة</span>}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteLesson(unit.id, lesson.id);
                                      }}
                                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            : null}

                          {/* Add Lesson Button - Dotted Container Style */}
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-1.5">
                            <button
                              onClick={() => handleAddLesson(unit.id)}
                              className="w-full py-3.5 rounded-xl text-gray-500 font-bold hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm group"
                            >
                              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center group-hover:bg-blue-600 transition-all transform group-hover:scale-110">
                                <Plus size={14} strokeWidth={3} className="text-white" />
                              </div>
                              <span>اضف درس جديد</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  !isAddingUnit && (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="text-gray-300" size={32} />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mb-1">لا يوجد وحدات حتى الآن</h3>
                      <p className="text-gray-400 font-bold text-sm mb-6">ابدأ بإضافة وحدة جديدة لترتيب محتوى الدورة</p>
                      <button
                        onClick={() => setIsAddingUnit(true)}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all text-sm"
                      >
                        اضافة وحدة جديدة
                      </button>
                    </div>
                  )
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
                  className={`p-10 rounded-[32px] border-2 cursor-pointer transition-all text-center space-y-4 ${
                    pricingType === 'free' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-blue-200'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                      pricingType === 'free' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    <Monitor size={32} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">مجاني</h3>
                  <p className="text-sm font-bold text-gray-400">الدورة متاحة للجميع بدون مقابل مادي</p>
                </div>

                <div
                  onClick={() => setPricingType('paid')}
                  className={`p-10 rounded-[32px] border-2 cursor-pointer transition-all text-center space-y-4 ${
                    pricingType === 'paid' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-blue-200'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                      pricingType === 'paid' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                    }`}
                  >
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
                      className={`w-full p-5 bg-white border ${errors.price ? 'border-red-500 bg-red-50/30' : 'border-gray-200'} rounded-2xl outline-none focus:border-blue-600 font-bold text-left transition-all pl-24 text-gray-900 shadow-sm`}
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

        <AddLessonModal
          isOpen={isLessonModalOpen}
          onClose={() => {
            setIsLessonModalOpen(false);
            setCurrentUnitForLesson(null);
          }}
          unitId={currentUnitForLesson || 0}
          unitName={units.find((u) => u.id === currentUnitForLesson)?.title || ''}
          courseTitle={title}
          instructorName={selectedInstructor ? instructors.find(i => i.id === selectedInstructor)?.name || '' : currentUser?.name || ''}
          onLessonAdded={handleLessonAdded}
        />
      </div>
    </>
  );
}
