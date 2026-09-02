'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template1FAQEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_1');
  const data = storeContent?.faq || defaultContent.faq;
  const items = Array.isArray(data.items) ? data.items : [];

  const handleChange = (field: string, value: any) => {
    updateSectionContent('faq', { [field]: value });
  };

  const handleItemChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newItems = items.map((item, idx) => 
      idx === index ? { ...item, [field]: value } : item
    );
    updateSectionContent('faq', { items: newItems });
  };

  const handleAddItem = () => {
    const newItem = { question: 'أدخل السؤال الجديد هنا؟', answer: 'أدخل إجابة السؤال هنا بالتفصيل.' };
    updateSectionContent('faq', { items: [...items, newItem] });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, idx) => idx !== index);
    updateSectionContent('faq', { items: newItems });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-amber-500 pr-2">قسم الأسئلة الشائعة — القالب الملكي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص الأسئلة والإجابات، مع التحكم المنفصل في ألوان السؤال والجواب والخلفية</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان القسم الرئيسي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-bold"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* FAQ items list */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">قائمة الأسئلة والإجابات:</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-black transition-colors cursor-pointer"
            >
              <Plus size={12} />
              إضافة سؤال
            </button>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-black">سؤال وجواب #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    title="حذف السؤال"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500">السؤال:</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-amber-500 font-bold text-slate-800"
                    value={item.question || ''}
                    onChange={(e) => handleItemChange(idx, 'question', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500">الإجابة:</label>
                  <textarea
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-amber-500 min-h-[60px] font-medium"
                    value={item.answer || ''}
                    onChange={(e) => handleItemChange(idx, 'answer', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Styling colors */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-700">ألوان قسم الأسئلة الشائعة</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون خلفية خانة السؤال</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.questionBackgroundColor || '#ffffff'}
                  onChange={(e) => handleChange('questionBackgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.questionBackgroundColor || '#ffffff'}
                  onChange={(e) => handleChange('questionBackgroundColor', e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون خلفية خانة الإجابة</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.answerBackgroundColor || '#FBF7EE'}
                  onChange={(e) => handleChange('answerBackgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.answerBackgroundColor || '#FBF7EE'}
                  onChange={(e) => handleChange('answerBackgroundColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
