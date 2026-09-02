'use client';

import React from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template1WhatsAppEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_1');
  const data = storeContent?.whatsapp || defaultContent.whatsapp;

  const handleChange = (field: string, value: any) => {
    updateSectionContent('whatsapp', { [field]: value });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-amber-500 pr-2">قسم وأداة واتساب — القالب الملكي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص نصوص ورسائل التواصل المباشر عبر واتساب وألوان القسم</p>
      </div>

      <div className="space-y-4">
        {/* Toggle WhatsApp Widget */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <label className="text-xs font-black text-slate-900 block">تفعيل الزر العائم</label>
            <span className="text-[10px] text-slate-400 font-bold">إظهار شارة واتساب في أسفل زاوية الصفحة</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={data.showFloatingButton}
              onChange={(e) => handleChange('showFloatingButton', e.target.checked)}
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Toggle WhatsApp Inline Section */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <label className="text-xs font-black text-slate-900 block">تفعيل قسم التواصل المباشر</label>
            <span className="text-[10px] text-slate-400 font-bold">عرض قسم مخصص كامل للتواصل عبر واتساب قبل الفوتر</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={data.showInlineSection || false}
              onChange={(e) => handleChange('showInlineSection', e.target.checked)}
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">رقم واتساب الأكاديمية (مع مفتاح الدولة بدون + أو أصفار)</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-mono text-left font-bold text-slate-800"
            placeholder="مثال: 966500000000 أو 201000000000"
            value={data.phoneNumber || ''}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
          />
        </div>

        {/* Button Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">نص زر التواصل المباشر</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-bold"
            value={data.buttonText || ''}
            onChange={(e) => handleChange('buttonText', e.target.value)}
          />
        </div>

        {/* Inline Section Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان قسم التواصل</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-bold"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* Inline Section Subtitle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">العنوان الفرعي لقسم التواصل</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-bold"
            value={data.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
          />
        </div>

        {/* WhatsApp Contact Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">نص رسالة التواصل التوضيحية</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 min-h-[70px] font-bold"
            value={data.contactMessage !== undefined ? data.contactMessage : 'سيب اسمك ورقم موبايلك، وفريق الدورة هيتواصل معاك خلال 24 ساعة يجاوب على كل أسئلتك ويساعدك تقرر إذا كانت الدورة مناسبة لك — بدون أي التزام.'}
            onChange={(e) => handleChange('contactMessage', e.target.value)}
            placeholder="سيب اسمك ورقم موبايلك، وفريق الدورة هيتواصل معاك..."
          />
        </div>

        {/* Pre-filled Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">الرسالة المجهزة مسبقاً لمحادثة واتساب</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 min-h-[60px] font-bold"
            value={data.message || ''}
            onChange={(e) => handleChange('message', e.target.value)}
          />
        </div>

        {/* Styling colors */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-700">ألوان قسم واتساب</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون خلفية القسم</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.backgroundColor || '#FBF7EE'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.backgroundColor || '#FBF7EE'}
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
                  value={data.textColor || '#0D3B33'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.textColor || '#0D3B33'}
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
