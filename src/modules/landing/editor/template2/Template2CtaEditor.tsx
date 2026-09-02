'use client';

import React from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template2CtaEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_2');
  const data = storeContent?.cta || defaultContent.cta || {
    title: 'جاهز لتبدأ رحلتك الإبداعية؟',
    description: 'انضم إلى آلاف الطلاب الذين غيروا مسارهم المهني من خلال إتقان فن الـ UI/UX.',
    buttonText: 'ابدأ الآن'
  };

  const handleChange = (field: string, value: any) => {
    updateSectionContent('cta', { [field]: value });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">البانر الختامي (CTA) — القالب التفاعلي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص العبارات التحفيزية السفلية قبل الفوتر وزر الاشتراك السريع</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان البانر الختامي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="جاهز لتبدأ رحلتك الإبداعية؟"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">النص التوضيحي / التحفيزي</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[90px] font-bold"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="انضم إلى آلاف الطلاب الذين غيروا مسارهم المهني..."
          />
        </div>

        {/* Button Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">نص زر الاشتراك والبدء</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.buttonText || ''}
            onChange={(e) => handleChange('buttonText', e.target.value)}
            placeholder="ابدأ الآن"
          />
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">سيتم إلحاق السعر والعملة تلقائياً بجانب هذا النص.</p>
        </div>
      </div>
    </div>
  );
}
