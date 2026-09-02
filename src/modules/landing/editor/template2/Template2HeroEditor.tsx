'use client';

import React from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template2HeroEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_2');
  const data = storeContent?.hero || defaultContent.hero;

  const handleChange = (field: string, value: any) => {
    updateSectionContent('hero', { [field]: value });
  };

  const handleTypographyChange = (field: string, value: number) => {
    const typography = data.typography || { titleSize: 48, bodySize: 18 };
    updateSectionContent('hero', {
      typography: {
        ...typography,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">البانر الرئيسي (الهيرو) — القالب التفاعلي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص عنوان الدورة، الوصف، الخلفية، ونصوص أزرار البانر المظلم التفاعلي</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان الدورة الرئيسي في الهيرو</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={courseData?.title || 'أدخل عنوان الدورة...'}
          />
        </div>

        {/* Subtitle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">العنوان الفرعي / شارة التسجيل</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="الدفعة الجديدة — التسجيل مفتوح الآن"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">الوصف التعريفي بالهيرو</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[100px] font-bold"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={courseData?.description || 'اكتب وصفاً جذاباً ومختصراً يظهر في الهيرو...'}
          />
        </div>

        {/* CTA Button Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">نص زر التسجيل الرئيسي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.buttonText || ''}
            onChange={(e) => handleChange('buttonText', e.target.value)}
            placeholder="سجل الآن"
          />
        </div>

        {/* Background Image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">رابط صورة خلفية الهيرو المظلم</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left font-bold"
            dir="ltr"
            value={data.image || ''}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
          <p className="text-[10px] text-slate-400">تظهر هذه الصورة كخلفية ذات تدرج داكن وشفافية أنيقة خلف نصوص الهيرو.</p>
        </div>

        {/* Typography sizes */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <h4 className="text-xs font-black text-slate-700">أحجام النصوص التفاعلية</h4>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>حجم خط العنوان:</span>
              <span className="font-mono">{data.typography?.titleSize || 48}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="72"
              className="w-full cursor-pointer accent-blue-600"
              value={data.typography?.titleSize || 48}
              onChange={(e) => handleTypographyChange('titleSize', Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>حجم خط الوصف:</span>
              <span className="font-mono">{data.typography?.bodySize || 18}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="24"
              className="w-full cursor-pointer accent-blue-600"
              value={data.typography?.bodySize || 18}
              onChange={(e) => handleTypographyChange('bodySize', Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
