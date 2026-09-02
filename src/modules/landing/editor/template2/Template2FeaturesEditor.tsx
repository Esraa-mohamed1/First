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

  const handleItemChange = (index: number, field: 'title' | 'subtitle', value: string) => {
    const currentItems = [...(data.items || [])];
    if (!currentItems[index]) return;
    currentItems[index] = {
      ...currentItems[index],
      [field]: value
    };
    updateSectionContent('features', { items: currentItems });
  };

  const icons = [
    { label: 'مستوى', icon: Signal },
    { label: 'مدة', icon: Clock },
    { label: 'شهادة', icon: Award },
    { label: 'وصول', icon: InfinityIcon }
  ];

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">بنية الدورة ومميزاتها — القالب التفاعلي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص عنوان شبكة مميزات الدورة وتفاصيل بطاقات المستوى والمدة والشهادة والوصول</p>
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
            const IconComp = icons[idx]?.icon || Signal;
            return (
              <div key={item.id || idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <IconComp size={16} className="text-blue-600" />
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
                    <label className="text-[10px] font-bold text-slate-500">التفاصيل / القيمة</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                      value={item.subtitle}
                      onChange={(e) => handleItemChange(idx, 'subtitle', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
