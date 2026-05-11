'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Plus, ChevronDown, ChevronUp, Play, FileText, FilePieChart as FilePowerpoint, Trash2, Pencil, Video, CheckCircle2, Upload, Eye } from 'lucide-react';
import { getCourse, deleteUnit, deleteLesson, createUnit, updateCourse } from '@/services/courses';
import { Course, Unit, Lesson } from '@/types/api';
import AddLessonModal from '@/components/Academic/Modals/AddLessonModal';
import EditUnitModal from '@/components/Academic/Modals/EditUnitModal';
import EditLessonModal from '@/components/Academic/Modals/EditLessonModal';
import toast from 'react-hot-toast';
import QuillEditor from '@/components/Academic/QuillEditor';

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  
  // Inline Add Unit State
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitDescription, setNewUnitDescription] = useState('');
  const [isSavingUnit, setIsSavingUnit] = useState(false);

  // Modals State
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedUnitTitle, setSelectedUnitTitle] = useState<string>('');

  // Edit State
  const [isEditUnitOpen, setIsEditUnitOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'pricing'>('info');

  // Info Tab Form State
  const [courseInfo, setCourseInfo] = useState({
    title: '',
    description: '',
    target_audience: '',
  });
  const [learningPoints, setLearningPoints] = useState<string[]>(['']);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedInfoSections, setExpandedInfoSections] = useState<string[]>(['description']);

  // Pricing State
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('paid');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'EGP' | 'SAR'>('SAR');
  const [isSavingPricing, setIsSavingPricing] = useState(false);



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

  const toggleInfoSection = (section: string) => {
    setExpandedInfoSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveCourseInfo = async () => {
    // Basic implementation for saving course info
    try {
      const payload: any = {
        title: courseInfo.title,
        description: courseInfo.description,
        target_audience: courseInfo.target_audience,
        price: pricingType === 'free' ? 0 : Number(price),
        final_price: pricingType === 'free' ? 0 : Number(price),
        price_type: pricingType,
        currency: currency,
      };


      // Add learning points as infos[i][key], infos[i][value], infos[i][order]
      learningPoints.filter(p => p.trim() !== '').forEach((point, index) => {
        payload[`infos[${index}][key]`] = 'what_you_will_learn';
        payload[`infos[${index}][value]`] = point;
        payload[`infos[${index}][order]`] = index + 1;
      });

      if (selectedImage) {
        payload.image = selectedImage;
      }
      // Assuming updateCourse takes ID and payload
      await updateCourse(Number(id), payload);
      toast.success('تم حفظ بيانات الدورة بنجاح');
    } catch (error) {
      toast.error('فشل حفظ بيانات الدورة');
    }
  };

  const handleSavePricing = async () => {
    setIsSavingPricing(true);
    try {
      const payload = {
        price: pricingType === 'free' ? 0 : Number(price),
        final_price: pricingType === 'free' ? 0 : Number(price),
        price_type: pricingType,
        currency: currency,
      };

      await updateCourse(Number(id), payload);
      toast.success('تم حفظ بيانات التسعير بنجاح');
      fetchCourse();
    } catch (error) {
      toast.error('فشل حفظ بيانات التسعير');
    } finally {
      setIsSavingPricing(false);
    }
  };


  const fetchCourse = async () => {
    try {
      const data = await getCourse(id);
      
      // Map 'chapters' to 'units' if needed
      if ((data as any).chapters) {
          data.units = (data as any).chapters;
      }
      
      setCourse(data);
      setCourseInfo({
        title: data.title || '',
        description: data.description || '',
        target_audience: (data as any).target_audience || '',
      });

      // Parse learning points from infos or what_you_will_learn
      let points: string[] = [];
      
      // Try from infos first (new structure)
      if (data.infos && Array.isArray(data.infos)) {
        points = data.infos
          .filter((info: any) => info.key === 'what_you_will_learn')
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .map((info: any) => info.value);
      }

      // Fallback to what_you_will_learn string if infos didn't have any
      if (points.length === 0) {
        try {
          if (data.what_you_will_learn) {
            const parsed = JSON.parse(data.what_you_will_learn);
            points = Array.isArray(parsed) ? parsed : [data.what_you_will_learn];
          }
        } catch (e) {
          if (data.what_you_will_learn) points = [data.what_you_will_learn];
        }
      }
      
      setLearningPoints(points.length > 0 ? points : ['']);

      if (data.image) {
        setPreviewImage(data.image);
      }
      
      if (data.units) {
        setExpandedUnits(data.units.map(u => u.id));
      }

      setPricingType(data.price_type || (Number(data.price) === 0 ? 'free' : 'paid'));
      setPrice(data.price?.toString() || '');

    } catch (error) {
      console.error(error);
      toast.error('فشل تحميل بيانات الدورة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const handleAddLesson = (unitId: number, unitTitle: string) => {
    setSelectedUnitId(unitId);
    setSelectedUnitTitle(unitTitle);
    setIsAddLessonOpen(true);
  };

  const handleSaveUnit = async () => {
    if (!newUnitTitle.trim()) {
      toast.error('يرجى إدخال اسم الوحدة');
      return;
    }

    setIsSavingUnit(true);
    try {
      await createUnit({
        course_id: Number(id),
        title: newUnitTitle,
        description: newUnitDescription,
        order: (course?.units?.length || 0) + 1
      });
      toast.success('تم إضافة الوحدة بنجاح');
      setNewUnitTitle('');
      setNewUnitDescription('');
      setIsAddingUnit(false);
      fetchCourse();
    } catch (error) {
      toast.error('فشل إضافة الوحدة');
    } finally {
      setIsSavingUnit(false);
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الوحدة؟ سيتم حذف جميع الدروس بداخلها.')) {
      try {
        await deleteUnit(unitId);
        toast.success('تم حذف الوحدة');
        fetchCourse();
      } catch (error) {
        toast.error('فشل حذف الوحدة');
      }
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      try {
        await deleteLesson(lessonId);
        toast.success('تم حذف الدرس');
        fetchCourse();
      } catch (error) {
        toast.error('فشل حذف الدرس');
      }
    }
  };

  const handleEditUnit = (unitId: number) => {
    const unit = course?.units?.find(u => u.id === unitId);
    if (unit) {
      setEditingUnit(unit);
      setIsEditUnitOpen(true);
    }
  };

  const handleEditLesson = (lessonId: number) => {
    // Find lesson in all units
    let lesson: Lesson | undefined;
    course?.units?.forEach(u => {
      const found = u.lessons?.find(l => l.id === lessonId);
      if (found) lesson = found;
    });

    if (lesson) {
      setEditingLesson(lesson);
      setIsEditLessonOpen(true);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen">لم يتم العثور على الدورة</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-md shadow-green-100">
            <span>نشر</span>
          </button>
          <button 
            onClick={() => router.push(`/academic/courses/${id}/student`)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-full font-bold text-sm transition-all shadow-sm"
          >
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
          {activeTab === 'info' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`pb-4 font-black text-sm whitespace-nowrap relative transition-all ${
            activeTab === 'content' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          محتوي الدورة
          {activeTab === 'content' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-4 font-black text-sm whitespace-nowrap relative transition-all ${
            activeTab === 'pricing' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          التسعير
          {activeTab === 'pricing' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
          )}
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
                value={courseInfo.title}
                onChange={(e) => setCourseInfo({ ...courseInfo, title: e.target.value })}
                placeholder="ادخل اسم الدورة"
                className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-600 font-bold text-sm transition-all text-gray-900"
              />
            </div>

            {/* Course Image */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-black text-gray-900">
                صورة الدورة <span className="text-red-500">*</span>
              </label>
              <div 
                className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 bg-gray-50 cursor-pointer hover:border-blue-600 transition-all group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {previewImage ? (
                  <div className="relative w-full max-w-[200px] aspect-video rounded-2xl overflow-hidden">
                    <img src={previewImage} alt="Course Preview" className="object-cover w-full h-full" />
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
                onClick={() => toggleInfoSection('description')}
                className="w-full p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-black text-gray-900">وصف الدورة</span>
                {expandedInfoSections.includes('description') ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              {expandedInfoSections.includes('description') && (
                <div className="p-5 pt-0 border-t border-gray-50">
                  <QuillEditor
                    value={courseInfo.description}
                    onChange={(val) => setCourseInfo({ ...courseInfo, description: val })}
                    placeholder="ادخل وصف الدورة"
                  />
                </div>
              )}
            </div>

            {/* What to learn Accordion */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => toggleInfoSection('what_to_learn')}
                className="w-full p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  <span className="font-black text-gray-900">ماذا ستتعلم؟</span>
                </div>
                {expandedInfoSections.includes('what_to_learn') ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              {expandedInfoSections.includes('what_to_learn') && (
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
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-gray-900"
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
                onClick={() => toggleInfoSection('target_audience')}
                className="w-full p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-black text-gray-900">لمن هذه الدورة</span>
                {expandedInfoSections.includes('target_audience') ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              {expandedInfoSections.includes('target_audience') && (
                <div className="p-5 pt-0 border-t border-gray-50">
                  <QuillEditor
                    value={courseInfo.target_audience}
                    onChange={(val) => setCourseInfo({ ...courseInfo, target_audience: val })}
                    placeholder="الفئة المستهدفة من الدورة"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button className="px-10 py-3 bg-gray-100 text-gray-600 font-black rounded-full hover:bg-gray-200 transition-all text-sm">
                عودة
              </button>
              <button 
                onClick={handleSaveCourseInfo}
                className="px-12 py-3 bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-100 hover:brightness-110 transition-all text-sm"
              >
                حفظ
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
                   الاجمالي {course.units?.length || 0} وحدة فقط | {course.units?.reduce((acc, unit) => acc + (unit.lessons?.length || 0), 0) || 0} دروس
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
                   <div className="space-y-1.5">
                     <label className="block text-xs font-bold text-gray-500">وصف للوحدة</label>
                     <textarea 
                       value={newUnitDescription}
                       onChange={(e) => setNewUnitDescription(e.target.value)}
                       placeholder="ادخل وصف للوحدة"
                       className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-600 font-bold text-sm min-h-[80px] transition-all text-gray-900"
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
                    onClick={handleSaveUnit}
                    disabled={isSavingUnit}
                    className="px-10 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all disabled:opacity-70 text-sm shadow-lg shadow-blue-50"
                  >
                    {isSavingUnit ? 'جاري الحفظ...' : 'حفظ'}
                  </button>
                </div>
              </div>
            )}

            {/* Units List */}
            <div className="space-y-3">
              {course.units && course.units.length > 0 ? (
                course.units.map((unit) => (
                  <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Unit Header */}
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                      onClick={() => toggleUnit(unit.id)}
                    >
                      <div className="flex items-center gap-3">
                        <button className="p-1.5 bg-gray-50 rounded-lg text-blue-600">
                          {expandedUnits.includes(unit.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div>
                          <h3 className="text-base md:text-lg font-black text-gray-900">{unit.title}</h3>
                          {unit.description && <p className="text-xs text-gray-400 font-bold mt-0.5">{unit.description}</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <button 
                          onClick={(e) => { e.stopPropagation(); handleEditUnit(unit.id); }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                         <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteUnit(unit.id); }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Lessons List */}
                    {expandedUnits.includes(unit.id) && (
                      <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/30">
                        {unit.lessons && unit.lessons.length > 0 ? (
                          unit.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-all group shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                  lesson.type === 'video' ? 'bg-blue-50 text-blue-600' : 
                                  lesson.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                  {lesson.type === 'video' ? <Video size={18} /> : 
                                   lesson.type === 'pdf' ? <FileText size={18} /> : <FilePowerpoint size={18} />}
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-sm">{lesson.title}</h4>
                                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-0.5">
                                     <span>{lesson.type === 'video' ? 'فيديو' : lesson.type === 'pdf' ? 'ملف PDF' : 'عرض تقديمي'}</span>
                                     {lesson.duration && <span>• {lesson.duration} دقيقة</span>}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleEditLesson(lesson.id); }}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : null}
                        
                        {/* Add Lesson Button - Dotted Container Style */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-1.5">
                          <button 
                            onClick={() => handleAddLesson(unit.id, unit.title)}
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
                <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${pricingType === 'free' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  <Play size={32} />
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
                <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${pricingType === 'paid' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900">مدفوع</h3>
                <p className="text-sm font-bold text-gray-400">حدد سعراً للدورة ليتمكن الطلاب من شرائها</p>
              </div>
            </div>

            {pricingType === 'paid' && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-900">سعر الدورة</label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-5 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-left transition-all pl-24 text-gray-900 shadow-sm group-hover:border-gray-200"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-100 pr-4">
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as any)}
                        className="bg-transparent font-black text-blue-600 outline-none cursor-pointer text-sm text-gray-900"
                      >
                        <option value="SAR" className="text-gray-900">SAR (ر.س)</option>
                        <option value="EGP" className="text-gray-900">EGP (ج.م)</option>
                      </select>

                    </div>
                  </div>
                </div>
              </div>
            )}


            <div className="flex justify-center pt-10">
              <button
                onClick={handleSavePricing}
                disabled={isSavingPricing}
                className="w-full max-w-[400px] py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70"
              >
                {isSavingPricing ? 'جاري الحفظ...' : 'حفظ بيانات التسعير'}
              </button>
            </div>
          </div>
        )}

      </div>

      <AddLessonModal 
        isOpen={isAddLessonOpen}
        onClose={() => setIsAddLessonOpen(false)}
        unitId={selectedUnitId!}
        unitName={selectedUnitTitle}
        courseTitle={course.title}
        instructorName={course.instructor || ''}
        onLessonAdded={fetchCourse}
      />
      <EditUnitModal 
        isOpen={isEditUnitOpen}
        onClose={() => setIsEditUnitOpen(false)}
        unit={editingUnit}
        onUnitUpdated={fetchCourse}
      />

      <EditLessonModal 
        isOpen={isEditLessonOpen}
        onClose={() => setIsEditLessonOpen(false)}
        lesson={editingLesson}
        onLessonUpdated={fetchCourse}
      />
    </div>
  );
}
