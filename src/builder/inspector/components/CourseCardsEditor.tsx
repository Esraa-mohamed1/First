import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { MOCK_COURSES } from '../../components/CourseCards';

interface CourseCardsEditorProps {
  props: Record<string, any>;
  handlePropChange: (key: string, value: any) => void;
}

export default function CourseCardsEditor({
  props,
  handlePropChange,
}: CourseCardsEditorProps) {
  const courses = props.courses || MOCK_COURSES;

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <label className="text-[10px] font-black text-slate-400 pr-1 block">تعديل الكورسات المعروضة</label>
      {courses.map((course: any, idx: number) => (
        <div key={course.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400">كورس #{idx + 1}</span>
            <button 
              onClick={() => {
                const updatedCourses = courses.filter((c: any) => c.id !== course.id);
                handlePropChange('courses', updatedCourses);
              }}
              className="text-rose-500 hover:text-rose-600 transition-colors p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <input 
            type="text"
            placeholder="عنوان الدورة"
            value={course.title}
            onChange={(e) => {
              const updated = courses.map((c: any) => c.id === course.id ? { ...c, title: e.target.value } : c);
              handlePropChange('courses', updated);
            }}
            className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
          />

          <input 
            type="text"
            placeholder="المحاضر / المدرب"
            value={course.instructor}
            onChange={(e) => {
              const updated = courses.map((c: any) => c.id === course.id ? { ...c, instructor: e.target.value } : c);
              handlePropChange('courses', updated);
            }}
            className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text"
              placeholder="السعر (مثال: 250 ريال)"
              value={course.price}
              onChange={(e) => {
                const updated = courses.map((c: any) => c.id === course.id ? { ...c, price: e.target.value } : c);
                handlePropChange('courses', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />
            <input 
              type="text"
              placeholder="عدد الطلاب (مثال: 100 طالب)"
              value={course.students}
              onChange={(e) => {
                const updated = courses.map((c: any) => c.id === course.id ? { ...c, students: e.target.value } : c);
                handlePropChange('courses', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text"
              placeholder="المدة الزمنية (مثال: 12 ساعة)"
              value={course.duration}
              onChange={(e) => {
                const updated = courses.map((c: any) => c.id === course.id ? { ...c, duration: e.target.value } : c);
                handlePropChange('courses', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />
            <input 
              type="text"
              placeholder="رابط الصورة (URL)"
              value={course.image}
              onChange={(e) => {
                const updated = courses.map((c: any) => c.id === course.id ? { ...c, image: e.target.value } : c);
                handlePropChange('courses', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => {
          const newCourse = {
            id: String(Date.now()),
            title: 'دورة جديدة معتمدة بالأكاديمية',
            instructor: 'المدرب الافتراضي',
            price: '200 ريال',
            students: '10 طلاب',
            duration: '4 ساعات',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM'
          };
          handlePropChange('courses', [...courses, newCourse]);
        }}
        className="w-full py-3 border border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-500 text-xs font-black transition-all bg-slate-50/20"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة دورة جديدة</span>
      </button>
    </div>
  );
}
