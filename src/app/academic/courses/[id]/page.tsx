'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Plus, ChevronDown, ChevronUp, Play, FileText, FilePieChart as FilePowerpoint, Trash2, Edit, Video, CheckCircle2 } from 'lucide-react';
import { getCourse, deleteUnit, deleteLesson, createUnit } from '@/services/courses';
import { Course, Unit, Lesson } from '@/types/api';
import AddLessonModal from '@/components/Academic/Modals/AddLessonModal';
import toast from 'react-hot-toast';

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

  const fetchCourse = async () => {
    try {
      const data = await getCourse(id);
      
      // Map 'chapters' to 'units' if needed
      if ((data as any).chapters) {
          data.units = (data as any).chapters;
      }
      
      setCourse(data);
      
      if (data.units) {
        setExpandedUnits(data.units.map(u => u.id));
      }
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen">لم يتم العثور على الدورة</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-xl md:text-2xl font-black text-gray-900">{course.title}</h1>
        
        {/* Summary Bar & Add Unit Button */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border border-blue-200 rounded-xl p-2 bg-white gap-3 shadow-sm">
          <div className="flex-1 text-center md:text-right px-4 py-1.5">
             <span className="font-bold text-gray-800 text-sm">
               الاجمالي {course.units?.length || 0} وحدة فقط | {course.units?.reduce((acc, unit) => acc + (unit.lessons?.length || 0), 0) || 0} دروس
             </span>
          </div>
          <button 
            onClick={() => setIsAddingUnit(!isAddingUnit)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus size={16} />
            <span>اضافة وحدة</span>
          </button>
        </div>
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
             <div className="space-y-1.5">
               <label className="block text-xs font-bold text-gray-500">وصف للوحدة</label>
               <textarea 
                 value={newUnitDescription}
                 onChange={(e) => setNewUnitDescription(e.target.value)}
                 placeholder="ادخل وصف للوحدة"
                 className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-600 font-bold text-sm min-h-[80px] transition-all"
               />
             </div>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsAddingUnit(false)}
              className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-all text-sm"
            >
              الغاء
            </button>
            <button 
              onClick={handleSaveUnit}
              disabled={isSavingUnit}
              className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70 text-sm"
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
                        
                        <button 
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : null}
                  
                  {/* Add Lesson Button - Dotted Container Style */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-1.5">
                    <button 
                      onClick={() => handleAddLesson(unit.id, unit.title)}
                      className="w-full py-3 rounded-lg text-gray-500 font-bold hover:text-blue-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                          <Plus size={12} className="text-white" />
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

      <AddLessonModal 
        isOpen={isAddLessonOpen}
        onClose={() => setIsAddLessonOpen(false)}
        unitId={selectedUnitId!}
        unitName={selectedUnitTitle}
        courseTitle={course.title}
        instructorName={course.instructor || ''}
        onLessonAdded={fetchCourse}
      />
    </div>
  );
}
