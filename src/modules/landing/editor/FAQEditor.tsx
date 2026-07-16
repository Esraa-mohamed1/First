import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLandingStore } from '../store/landingStore';

export default function FAQEditor() {
  const content = useLandingStore(state => state.content);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  if (!content || !content.faq) return null;

  const data = content.faq;

  const handleChange = (field: string, value: any) => {
    updateSectionContent('faq', { [field]: value });
  };

  const handleItemChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newItems = data.items.map((item, idx) => 
      idx === index ? { ...item, [field]: value } : item
    );
    updateSectionContent('faq', { items: newItems });
  };

  const handleAddItem = () => {
    const newItem = { question: 'أدخل السؤال الجديد هنا؟', answer: 'أدخل إجابة السؤال هنا بالتفصيل.' };
    updateSectionContent('faq', { items: [...data.items, newItem] });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = data.items.filter((_, idx) => idx !== index);
    updateSectionContent('faq', { items: newItems });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">تعديل الأسئلة الشائعة</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">خصص الأسئلة والإجابات المكررة التي يطرحها المشتركون</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان القسم الرئيسي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* FAQ items list */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">قائمة الأسئلة:</span>
            <button
              onClick={handleAddItem}
              className="bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:text-blue-700 p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-black transition-colors cursor-pointer"
            >
              <Plus size={12} />
              إضافة سؤال
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {data.items.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">سؤال وجواب #{idx + 1}</span>
                  <button
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
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                    value={item.question}
                    onChange={(e) => handleItemChange(idx, 'question', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500">الإجابة:</label>
                  <textarea
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 min-h-[60px]"
                    value={item.answer}
                    onChange={(e) => handleItemChange(idx, 'answer', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Styling colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">لون الخلفية</label>
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
