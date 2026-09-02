'use client';

import React from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template2AboutEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_2');
  const data = storeContent?.about || defaultContent.about || {};

  const handleChange = (field: string, value: any) => {
    updateSectionContent('about', { [field]: value });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">عن الدورة وبطاقة الاستثمار — القالب التفاعلي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص نصوص مقدمة الرحلة التعليمية، عنوان بطاقة الاستثمار، شارة الخصم، وضمان الاسترداد</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان القسم الرئيسي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="عن هذه الرحلة التعليمية"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">نص تفاصيل الرحلة التعليمية</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[110px] font-bold"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="اكتشف أسرار تصميم واجهات مستخدم مذهلة وتجارب مستخدم سلسة في هذه الدورة الشاملة..."
          />
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-4">
          <h4 className="text-xs font-black text-slate-700">تخصيص بطاقة الاستثمار والتسعير</h4>

          {/* Investment Card Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">عنوان بطاقة الاستثمار</label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
              value={data.investmentTitle || ''}
              onChange={(e) => handleChange('investmentTitle', e.target.value)}
              placeholder="استثمارك في مستقبلك"
            />
          </div>

          {/* Discount Badge */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">نص شارة الخصم</label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
              value={data.discountBadge || ''}
              onChange={(e) => handleChange('discountBadge', e.target.value)}
              placeholder="خصم 40% لفترة محدودة"
            />
          </div>

          {/* Guarantee Text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">نص الضمان وسياسة الاسترداد</label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
              value={data.guaranteeText || ''}
              onChange={(e) => handleChange('guaranteeText', e.target.value)}
              placeholder="ضمان استرداد الأموال لمدة 14 يوماً"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
