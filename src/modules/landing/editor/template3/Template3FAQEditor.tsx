'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template3FAQEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_3');
  const t3Data = storeContent?.template3_faq || defaultContent.template3_faq || {
    title: storeContent?.faq?.title || 'الأسئلة الشائعة حول البرنامج',
    items: storeContent?.faq?.items || defaultContent.faq?.items || [],
    backgroundColor: '#ffffff',
    textColor: '#191b23'
  };

  const items: Array<{ question: string; answer: string }> = (t3Data.items && t3Data.items.length > 0)
    ? t3Data.items
    : (storeContent?.faq?.items && storeContent.faq.items.length > 0)
      ? storeContent.faq.items
      : defaultContent.faq?.items || [];

  const handleColorChange = (field: 'backgroundColor' | 'textColor', value: string) => {
    updateSectionContent('template3_faq', { [field]: value });
    updateSectionContent('faq', { [field]: value });
  };

  const handleTitleChange = (title: string) => {
    updateSectionContent('template3_faq', { title });
    updateSectionContent('faq', { title });
  };

  const handleItemsChange = (newItems: Array<{ question: string; answer: string }>) => {
    updateSectionContent('template3_faq', { items: newItems });
    updateSectionContent('faq', { items: newItems });
  };

  const handleItemFieldChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    handleItemsChange(updated);
  };

  const handleAddItem = () => {
    handleItemsChange([...items, { question: 'سؤال شائع جديد؟', answer: 'الإجابة التوضيحية للسؤال هنا...' }]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    handleItemsChange(updated);
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">الأسئلة الشائعة حول البرنامج — قالب UI/UX</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص الأسئلة والإجابات، وألوان خلفية ونصوص القسم</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان قسم الأسئلة الشائعة</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={t3Data.title || storeContent?.faq?.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="الأسئلة الشائعة حول البرنامج"
          />
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">قائمة الأسئلة والإجابات:</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>إضافة سؤال</span>
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-600">سؤال #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                  value={item.question}
                  onChange={(e) => handleItemFieldChange(index, 'question', e.target.value)}
                  placeholder="نص السؤال..."
                />
                <textarea
                  className="w-full border border-slate-200 rounded-xl p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold min-h-[60px] leading-relaxed"
                  value={item.answer}
                  onChange={(e) => handleItemFieldChange(index, 'answer', e.target.value)}
                  placeholder="نص الإجابة..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">لون الخلفية</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
              <input
                type="color"
                className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                value={t3Data.backgroundColor || '#ffffff'}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                value={t3Data.backgroundColor || '#ffffff'}
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
                value={t3Data.textColor || '#191b23'}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                value={t3Data.textColor || '#191b23'}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
