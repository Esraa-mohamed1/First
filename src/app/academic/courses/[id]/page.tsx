'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Plus, ChevronDown, ChevronUp, Play, FileText, FilePieChart as FilePowerpoint, Trash2, Edit } from 'lucide-react';
import { getCourse, deleteUnit, deleteLesson } from '@/services/courses';
import { Course, Unit, Lesson } from '@/types/api';
import AddUnitModal from '@/components/Academic/Modals/AddUnitModal';
import AddLessonModal from '@/components/Academic/Modals/AddLessonModal';
import toast from 'react-hot-toast';

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  
  // Modals State
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  const fetchCourse = async () => {
    try {
      const data = await getCourse(id);
      setCourse(data);
      // Expand all units by default or none? Let's expand all.
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

  const handleAddLesson = (unitId: number) => {
    setSelectedUnitId(unitId);
    setIsAddLessonOpen(true);
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
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-[32px] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{course.title}</h1>
          <p className="text-gray-500 mt-2 font-bold">{course.description}</p>
        </div>
        <button 
          onClick={() => setIsAddUnitOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus size={24} />
          <span>اضافة وحدة</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm">
          <p className="text-gray-500 font-bold mb-2">اجمالي الوحدات</p>
          <p className="text-3xl font-black text-gray-900">{course.units?.length || 0} وحدة</p>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm">
          <p className="text-gray-500 font-bold mb-2">اجمالي الدروس</p>
          <p className="text-3xl font-black text-gray-900">
            {course.units?.reduce((acc, unit) => acc + (unit.lessons?.length || 0), 0) || 0} درس
          </p>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm">
          <p className="text-gray-500 font-bold mb-2">الحالة</p>
          <span className={`px-4 py-2 rounded-xl text-sm font-black ${course.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            {course.status === 'published' ? 'منشورة' : 'مسودة'}
          </span>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-6">
        {course.units && course.units.length > 0 ? (
          course.units.map((unit) => (
            <div key={unit.id} className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-gray-100">
              {/* Unit Header */}
              <div className="p-6 flex items-center justify-between bg-gray-50/50">
                <div 
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => toggleUnit(unit.id)}
                >
                  <button className="p-2 bg-white rounded-xl shadow-sm text-gray-400">
                    {expandedUnits.includes(unit.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <h3 className="text-xl font-black text-gray-900">{unit.title}</h3>
                  <span className="text-sm font-bold text-gray-400 bg-white px-3 py-1 rounded-lg">
                    {unit.lessons?.length || 0} دروس
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleAddLesson(unit.id)}
                    className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition-all"
                  >
                    <Plus size={18} />
                    <span>اضافة درس</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteUnit(unit.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Lessons List */}
              {expandedUnits.includes(unit.id) && (
                <div className="p-4 space-y-3">
                  {unit.lessons && unit.lessons.length > 0 ? (
                    unit.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            lesson.type === 'video' ? 'bg-blue-50 text-blue-600' : 
                            lesson.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {lesson.type === 'video' ? <Play size={24} className="fill-current" /> : 
                             lesson.type === 'pdf' ? <FileText size={24} /> : <FilePowerpoint size={24} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{lesson.title}</h4>
                            <p className="text-xs text-gray-400 font-bold mt-1">{lesson.type}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400 font-bold">
                      لا يوجد دروس في هذه الوحدة
                    </div>
                  )}
                  
                  {/* Add Lesson Button at Bottom (Optional, already in header) */}
                  {(!unit.lessons || unit.lessons.length === 0) && (
                     <button 
                      onClick={() => handleAddLesson(unit.id)}
                      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      <span>اضافة درس جديد</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="text-gray-300" size={48} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">لا يوجد وحدات حتى الآن</h3>
            <p className="text-gray-500 font-bold mb-8">ابدأ بإضافة وحدة جديدة لترتيب محتوى الدورة</p>
            <button 
              onClick={() => setIsAddUnitOpen(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all"
            >
              اضافة وحدة جديدة
            </button>
          </div>
        )}
      </div>

      <AddUnitModal 
        isOpen={isAddUnitOpen} 
        onClose={() => setIsAddUnitOpen(false)} 
        courseId={Number(id)}
        onUnitAdded={fetchCourse}
      />

      <AddLessonModal 
        isOpen={isAddLessonOpen}
        onClose={() => setIsAddLessonOpen(false)}
        unitId={selectedUnitId!}
        onLessonAdded={fetchCourse}
      />
    </div>
  );
}
