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
  Share,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createCourse, createUnit, getCategories, getCourse, updateCourse } from '@/services/courses';
import { getProfileStatus, getMyUsageLimit } from '@/services/auth';
import { getUsers } from '@/services/users';
import { User } from '@/types/api';
import AddLessonModal from '@/components/Academic/Modals/AddLessonModal';
import QuillEditor from '@/components/Academic/QuillEditor';

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
  const [learningPoints, setLearningPoints] = useState<string[]>(['']);
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

  const handleAddLearningPoint = () => {
    setLearningPoints([...learningPoints, '']);
  };

  const handleUpdateLearningPoint = (index: number, value: string) => {
    const updated = [...learningPoints];
    updated[index] = value;
    setLearningPoints(updated);
  };

  const handleRemoveLearningPoint = (index: number) => {
    if (learningPoints.length > 1) {
      const updated = learningPoints.filter((_, i) => i !== index);
      setLearningPoints(updated);
    } else {
      setLearningPoints(['']);
    }
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
      image: selectedFile || undefined,
    };

    // Add learning points as infos[i][key], infos[i][value], infos[i][order]
    learningPoints.filter(p => p.trim() !== '').forEach((point, index) => {
      payload[`infos[${index}][key]`] = 'what_you_will_learn';
      payload[`infos[${index}][value]`] = point;
      payload[`infos[${index}][order]`] = index + 1;
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
          if (userData.role === 'admin') {
            const allUsers = await getUsers();
            setInstructors(allUsers.filter((user) => user.role === 'instructor' || user.role === 'admin'));
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
        category_id: category ? Number(category) : undefined,
        description,
        user_id: userId,
        who_is_this_for: whoIsThisFor,
        price: pricingType === 'free' ? 0 : Number(price),
        status,
        type: courseTypeParam || 'recorded',
        price_type: pricingType,
        final_price: pricingType === 'free' ? 0 : Number(price),
        image: selectedFile || undefined,
      };

      // Add learning points as infos[i][key], infos[i][value], infos[i][order]
      learningPoints.filter(p => p.trim() !== '').forEach((point, index) => {
        payload[`infos[${index}][key]`] = 'what_you_will_learn';
        payload[`infos[${index}][value]`] = point;
        payload[`infos[${index}][order]`] = index + 1;
      });

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
    <>
      <div className="space-y-6 p-4 md:p-6" dir="rtl">
        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-md shadow-green-100"
              onClick={() => setStatus('published')}
            >
              <Share size={18} />
              <span>نشر</span>
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-full font-bold text-sm transition-all shadow-sm">
              <Eye size={18} />
              <span>معاينة</span>
            </button>
          </div>
        </div>

        {/* Tabs Header */}
        <div className="flex items-center justify-start gap-8 border-b border-gray-200 px-2 md:px-4 overflow-x-auto hide-scrollbar">
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
            محتوي الدورة
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
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ادخل اسم الدورة"
                  className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-600 font-bold text-sm transition-all"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <label className="flex items-center gap-1 text-sm font-black text-gray-900">
                  الفئة <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-600 font-bold text-sm transition-all appearance-none"
                >
                  <option value="">اختر فئة</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructor Dropdown (Admin Only) */}
              {currentUser?.role === 'admin' && (
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-black text-gray-900">المدرب</label>
                  <select
                    value={selectedInstructor || ''}
                    onChange={(e) => setSelectedInstructor(Number(e.target.value))}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-600 font-bold text-sm transition-all appearance-none"
                  >
                    <option value="">اختر مدرب</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>
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

              {/* Description Accordion */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection('description')}
                  className="w-full p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-black text-gray-900">وصف الدورة</span>
                  {openSections.description ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>
                {openSections.description && (
                  <div className="p-5 pt-0 border-t border-gray-50">
                    <QuillEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="ادخل وصف الدورة"
                    />
                  </div>
                )}
              </div>

              {/* What to learn Accordion */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection('learning')}
                  className="w-full p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-black text-gray-900">ماذا تتعلم</span>
                  {openSections.learning ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>
                {openSections.learning && (
                  <div className="p-5 pt-0 border-t border-gray-50 space-y-4">
                    {learningPoints.map((point, index) => (
                      <div key={index} className="relative group bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-all hover:border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                            النقطة {index + 1}
                          </span>
                          <button
                            onClick={() => handleRemoveLearningPoint(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => handleUpdateLearningPoint(index, e.target.value)}
                          placeholder="ماذا سيتعلم الطالب من هذه النقطة؟"
                          className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleAddLearningPoint}
                      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-3 text-gray-500 font-bold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Plus size={18} />
                      </div>
                      <span>إضافة نقطة تعلم جديدة</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Target Audience Accordion */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection('audience')}
                  className="w-full p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-black text-gray-900">لمن هذه الدورة</span>
                  {openSections.audience ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>
                {openSections.audience && (
                  <div className="p-5 pt-0 border-t border-gray-50">
                    <QuillEditor
                      value={whoIsThisFor}
                      onChange={setWhoIsThisFor}
                      placeholder="الفئة المستهدفة من الدورة"
                    />
                  </div>
                )}
              </div>

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
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-600 font-bold text-sm transition-all"
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
