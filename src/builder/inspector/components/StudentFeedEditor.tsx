import React from 'react';
import { Trash2, ChevronDown, Plus } from 'lucide-react';
import { MOCK_ACTIVITIES } from '../../components/StudentFeed';

interface StudentFeedEditorProps {
  props: Record<string, any>;
  handlePropChange: (key: string, value: any) => void;
}

export default function StudentFeedEditor({
  props,
  handlePropChange,
}: StudentFeedEditorProps) {
  const activities = props.activities || MOCK_ACTIVITIES;

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <label className="text-[10px] font-black text-slate-400 pr-1 block">تعديل أنشطة الطلاب</label>
      {activities.map((activity: any, idx: number) => (
        <div key={activity.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400">نشاط #{idx + 1}</span>
            <button 
              onClick={() => {
                const updated = activities.filter((a: any) => a.id !== activity.id);
                handlePropChange('activities', updated);
              }}
              className="text-rose-500 hover:text-rose-600 transition-colors p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <input 
            type="text"
            placeholder="اسم المستخدم"
            value={activity.user}
            onChange={(e) => {
              const updated = activities.map((a: any) => a.id === activity.id ? { ...a, user: e.target.value } : a);
              handlePropChange('activities', updated);
            }}
            className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
          />

          <input 
            type="text"
            placeholder="الإجراء المتخذ (النشاط)"
            value={activity.action}
            onChange={(e) => {
              const updated = activities.map((a: any) => a.id === activity.id ? { ...a, action: e.target.value } : a);
              handlePropChange('activities', updated);
            }}
            className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text"
              placeholder="اسم الكورس"
              value={activity.course}
              onChange={(e) => {
                const updated = activities.map((a: any) => a.id === activity.id ? { ...a, course: e.target.value } : a);
                handlePropChange('activities', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />
            <input 
              type="text"
              placeholder="التوقيت (مثال: منذ 5 دقائق)"
              value={activity.time}
              onChange={(e) => {
                const updated = activities.map((a: any) => a.id === activity.id ? { ...a, time: e.target.value } : a);
                handlePropChange('activities', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <div className="relative">
              <select
                value={activity.type || 'signup'}
                onChange={(e) => {
                  const updated = activities.map((a: any) => a.id === activity.id ? { ...a, type: e.target.value } : a);
                  handlePropChange('activities', updated);
                }}
                className="w-full p-2 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none appearance-none"
              >
                <option value="lesson">درس</option>
                <option value="quiz">اختبار</option>
                <option value="comment">استفسار</option>
                <option value="signup">تسجيل جديد</option>
                <option value="certificate">شهادة</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-[9px] font-black text-slate-400">اللون:</span>
              <input 
                type="color"
                value={activity.color || '#3b82f6'}
                onChange={(e) => {
                  const updated = activities.map((a: any) => a.id === activity.id ? { ...a, color: e.target.value } : a);
                  handlePropChange('activities', updated);
                }}
                className="w-7 h-7 p-0 rounded-lg border border-slate-200 cursor-pointer overflow-hidden bg-transparent"
              />
            </div>
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => {
          const newActivity = {
            id: String(Date.now()),
            user: 'طالب جديد',
            action: 'سجل في كورس جديد بالأكاديمية',
            course: 'مقدمة في الذكاء الاصطناعي',
            time: 'الآن',
            type: 'signup',
            color: '#2563eb'
          };
          handlePropChange('activities', [...activities, newActivity]);
        }}
        className="w-full py-3 border border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-500 text-xs font-black transition-all bg-slate-50/20"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة نشاط جديد</span>
      </button>
    </div>
  );
}
