import React from 'react';
import { useLandingStore } from '../store/landingStore';

export default function HeroEditor() {
  const content = useLandingStore(state => state.content);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  if (!content || !content.hero) return null;

  const data = content.hero;

  const handleChange = (field: string, value: any) => {
    updateSectionContent('hero', { [field]: value });
  };

  const handleTypographyChange = (field: string, value: number) => {
    const typography = data.typography || { titleSize: 42, bodySize: 16 };
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
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">تعديل الهيرو (البانر الرئيسي)</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">خصص المظهر والعبارات الترحيبية في مقدمة الصفحة</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">العنوان الرئيسي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* Subtitle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">العنوان الفرعي (شارة أعلى الهيرو)</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            value={data.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">الوصف التفصيلي</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[100px]"
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        {/* CTA Button Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">نص زر الاشتراك الرئيسي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            value={data.buttonText}
            onChange={(e) => handleChange('buttonText', e.target.value)}
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">رابط صورة المعاينة البديلة</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            value={data.image}
            onChange={(e) => handleChange('image', e.target.value)}
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">خلفية الهيرو</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                value={data.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                value={data.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">لون النصوص</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                value={data.textColor || '#1f2937'}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                value={data.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Typography sizes */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <h4 className="text-xs font-black text-slate-700">أحجام الخطوط (ميكرو تايبوغرافي)</h4>
          
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>حجم خط العنوان:</span>
              <span className="font-mono">{data.typography?.titleSize || 42}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="70"
              className="w-full cursor-pointer accent-blue-600"
              value={data.typography?.titleSize || 42}
              onChange={(e) => handleTypographyChange('titleSize', Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>حجم خط المتن:</span>
              <span className="font-mono">{data.typography?.bodySize || 16}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              className="w-full cursor-pointer accent-blue-600"
              value={data.typography?.bodySize || 16}
              onChange={(e) => handleTypographyChange('bodySize', Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
