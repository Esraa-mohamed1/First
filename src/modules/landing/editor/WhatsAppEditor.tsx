import React from 'react';
import { useLandingStore } from '../store/landingStore';

export default function WhatsAppEditor() {
  const content = useLandingStore(state => state.content);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  if (!content || !content.whatsapp) return null;

  const data = content.whatsapp;

  const handleChange = (field: string, value: any) => {
    updateSectionContent('whatsapp', { [field]: value });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">تعديل أداة وتفاصيل واتساب</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">خصص مظهر أداة التواصل المباشر وقسم التواصل السريع بالصفحة</p>
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
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
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
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">رقم واتساب الأكاديمية (مع مفتاح الدولة بدون + أو أصفار)</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left font-bold text-slate-800"
            placeholder="مثال: 966500000000 أو 201000000000"
            value={data.phoneNumber || ''}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
          />
          <span className="text-[9px] text-slate-400 font-bold">هذا الرقم هو الذي يتم توجيه الطلاب إليه مباشرة عبر تطبيق واتساب عند الضغط على زر التواصل</span>
        </div>

        {/* Button Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">نص زر التواصل</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            value={data.buttonText || ''}
            onChange={(e) => handleChange('buttonText', e.target.value)}
          />
        </div>

        {/* Inline Section Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان قسم التواصل</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* Inline Section Subtitle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">الوصف الفرعي لقسم التواصل</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[60px]"
            value={data.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
          />
        </div>

        {/* Pre-filled Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">رسالة ترحيبية جاهزة</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[60px]"
            value={data.message}
            onChange={(e) => handleChange('message', e.target.value)}
          />
        </div>

        {/* Styling colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">لون الخلفية (القسم)</label>
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
      </div>
    </div>
  );
}
