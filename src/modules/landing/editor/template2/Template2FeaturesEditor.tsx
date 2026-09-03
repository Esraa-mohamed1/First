'use client';

import React from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';
import { Signal, Clock, Award, Infinity as InfinityIcon } from 'lucide-react';

export default function Template2FeaturesEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_2');
  const data = storeContent?.features || defaultContent.features || {
    title: 'بنية الدورة المتميزة',
    items: [
      { id: 'f1', title: 'مستوى الدورة', subtitle: 'مبتدئ إلى متوسط', icon: 'Signal' },
      { id: 'f2', title: 'المدة الزمنية', subtitle: 'مرنة حسب رغبتك', icon: 'Clock' },
      { id: 'f3', title: 'الشهادة', subtitle: 'شهادة إتمام معتمدة', icon: 'Award' },
      { id: 'f4', title: 'الوصول الكامل', subtitle: 'وصول مدى الحياة', icon: 'Infinity' }
    ]
  };

  const handleTitleChange = (newTitle: string) => {
    updateSectionContent('features', { title: newTitle });
  };

  const handleItemChange = (index: number, field: 'title' | 'subtitle' | 'icon', value: string) => {
    const currentItems = [...(data.items || [])];
    if (!currentItems[index]) return;
    currentItems[index] = {
      ...currentItems[index],
      [field]: value
    };
    updateSectionContent('features', { items: currentItems });
  };

  const handleColorChange = (field: 'backgroundColor' | 'textColor', value: string) => {
    updateSectionContent('features', { [field]: value });
  };

  const availableIcons = [
    { value: 'Signal', label: 'إشارة / مستوى (Signal)' },
    { value: 'Clock', label: 'ساعة / وقت (Clock)' },
    { value: 'Award', label: 'شهادة / وسام (Award)' },
    { value: 'Infinity', label: 'وصول دائم (Infinity)' },
    { value: 'GraduationCap', label: 'قبعة تخرج (GraduationCap)' },
    { value: 'BookOpen', label: 'كتاب مفتوح (BookOpen)' },
    { value: 'Video', label: 'فيديو مسجل (Video)' },
    { value: 'ShieldCheck', label: 'درع معتمد (ShieldCheck)' },
    { value: 'Sparkles', label: 'بريق وتألق (Sparkles)' },
    { value: 'Zap', label: 'طاقة وسرعة (Zap)' },
    { value: 'Calendar', label: 'تقويم ومواعيد (Calendar)' },
    { value: 'Star', label: 'نجمة تقييم (Star)' },
    { value: 'Laptop', label: 'جهاز حاسوب (Laptop)' },
    { value: 'FileText', label: 'ملفات ومصادر (FileText)' },
    { value: 'Layers', label: 'طبقات ومستويات (Layers)' },
    { value: 'Globe', label: 'شبكة وإنترنت (Globe)' }
  ];

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">بنية الدورة ومميزاتها — القالب التفاعلي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص عنوان شبكة مميزات الدورة، الأيقونات، وبطاقات المستوى والمدة والشهادة والوصول</p>
      </div>

      <div className="space-y-4">
        {/* Section Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان القسم الرئيسي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="بنية الدورة المتميزة"
          />
        </div>

        {/* Feature Cards */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <h4 className="text-xs font-black text-slate-700">بطاقات بنية الدورة (4 بطاقات)</h4>

          {(data.items || []).map((item, idx) => {
            return (
              <div key={item.id || idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    بطاقة #{idx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">العنوان</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                      value={item.title}
                      onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">التفاصيل / القيمة (اختياري)</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                      value={item.subtitle}
                      onChange={(e) => handleItemChange(idx, 'subtitle', e.target.value)}
                    />
                  </div>
                </div>

                {/* Icon Picker */}
                <div className="flex flex-col gap-1 pt-1">
                  <label className="text-[10px] font-bold text-slate-500">أيقونة البطاقة</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold cursor-pointer"
                    value={item.icon || (idx === 0 ? 'Signal' : idx === 1 ? 'Clock' : idx === 2 ? 'Award' : 'Infinity')}
                    onChange={(e) => handleItemChange(idx, 'icon', e.target.value)}
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic.value} value={ic.value}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Colors */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-700">ألوان قسم بنية الدورة</h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون الخلفية</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.backgroundColor || '#faf8ff'}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.backgroundColor || '#faf8ff'}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
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
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.textColor || '#191b23'}
                  onChange={(e) => handleColorChange('textColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
