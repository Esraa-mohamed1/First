'use client';

import React from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template3HeroEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_3');
  const data = storeContent?.hero || defaultContent.hero || {
    title: courseData?.title || 'إتقان تصميم واجهات وتجربة المستخدم (UI/UX) - من الصفر للاحتراف',
    subtitle: 'الرئيسية > التصميم',
    description: courseData?.description || 'تعلم كيفية بناء منتجات رقمية عالمية المستوى من خلال فهم سلوك المستخدم وإتقان أدوات التصميم الحديثة مثل Figma.',
    image: courseData?.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200'
  };

  const handleChange = (field: string, value: any) => {
    updateSectionContent('hero', { [field]: value });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">البانر الرئيسي (الهيرو) — قالب الأكاديمية وUI/UX</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص عنوان الدورة، الوصف التعريفي، وصورة المعاينة في أعلى الصفحة</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان الدورة الرئيسي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={courseData?.title || 'أدخل عنوان الدورة...'}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">الوصف التعريفي للدورة</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[110px] font-bold leading-relaxed"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={courseData?.description || 'أدخل وصف الدورة...'}
          />
        </div>

        {/* Image / Video Thumbnail URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">رابط صورة المعاينة / غلاف الفيديو</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.image || ''}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://..."
          />
          {data.image && (
            <div className="mt-2 w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={data.image} alt="Hero Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
