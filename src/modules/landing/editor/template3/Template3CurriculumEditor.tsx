'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template3CurriculumEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_3');
  const data = (storeContent?.template3_curriculum || defaultContent.template3_curriculum || {
    title: storeContent?.chapters?.title || 'محتوى الدورة منهج متكامل',
    backgroundColor: '#ffffff',
    textColor: '#191b23'
  }) as any;

  const handleChange = (field: string, value: any) => {
    updateSectionContent('template3_curriculum', { [field]: value });
    updateSectionContent('chapters', { [field]: value });
  };

  const units = courseData?.units || courseData?.curriculum || courseData?.chapters || [];
  const lessonsCount = units.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0);

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">محتوى الدورة والمنهج — قالب UI/UX</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص عنوان قسم المنهج وألوان الخلفية والنصوص</p>
      </div>

      <div className="space-y-4">
        {/* Main Section Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان قسم المنهج الرئيسي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="محتوى الدورة منهج متكامل"
          />
        </div>

        {/* Dynamic Curriculum Info Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-black text-xs">
            <BookOpen size={16} className="text-blue-600" />
            <span>وحدات ودروس الدورة ({units.length} وحدات • {lessonsCount} درساً)</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            يتم جلب الوحدات والدروس والمحاضرات تلقائياً من بيانات المنهج الدراسي للدورة في لوحة التحكم، وتظهر بتصميم تفاعلي مرن.
          </p>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">لون الخلفية</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
              <input
                type="color"
                className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                value={data.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                value={data.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">لون النصوص</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
              <input
                type="color"
                className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                value={data.textColor || '#191b23'}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                value={data.textColor || '#191b23'}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
