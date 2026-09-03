'use client';

import React from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template2CurriculumEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_2');
  const data = storeContent?.chapters || defaultContent.chapters || {
    title: 'محتوى الدورة',
    backgroundColor: '#faf8ff',
    textColor: '#191b23'
  };

  const handleChange = (field: string, value: any) => {
    updateSectionContent('chapters', { [field]: value });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">منهج ومحتوى الدورة — القالب التفاعلي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص عنوان قسم محتوى الدورة وألوان الخلفية والنصوص (يتم جلب الوحدات والدروس تلقائياً من بيانات الدورة)</p>
      </div>

      <div className="space-y-4">
        {/* Section Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان قسم المحتوى</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="محتوى الدورة"
          />
        </div>

        {/* Colors */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-700">ألوان قسم محتوى الدورة</h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون الخلفية</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.backgroundColor || '#faf8ff'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.backgroundColor || '#faf8ff'}
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
    </div>
  );
}
