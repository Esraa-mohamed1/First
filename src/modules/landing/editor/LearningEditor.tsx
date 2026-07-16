import React from 'react';
import { Plus, Trash2, Pen } from 'lucide-react';
import { useLandingStore } from '../store/landingStore';
import { LearningCard } from '../types/landing';

export default function LearningEditor() {
  const content = useLandingStore(state => state.content);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  if (!content || !content.learning) return null;

  const data = content.learning;

  const handleChange = (field: string, value: any) => {
    updateSectionContent('learning', { [field]: value });
  };

  const handleCardChange = (cardId: string, value: string) => {
    const newCards = data.cards.map(c => 
      c.id === cardId ? { ...c, info_value: value } : c
    );
    updateSectionContent('learning', { cards: newCards });
  };

  const handleAddCard = () => {
    const newCard: LearningCard = {
      id: `learn-${Date.now()}`,
      info_key: 'ماذا ستتعلم؟',
      info_value: 'أدخل المهارة أو المنفعة الجديدة هنا.',
      icon: 'CheckCircle2',
      color: 'blue'
    };
    updateSectionContent('learning', { cards: [...data.cards, newCard] });
  };

  const handleRemoveCard = (cardId: string) => {
    const newCards = data.cards.filter(c => c.id !== cardId);
    updateSectionContent('learning', { cards: newCards });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">تعديل الفوائد وما ستتعلمه</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">أضف أو عدّل المخرجات والفوائد التطبيقية للدورة</p>
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

        {/* Subtitle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">العنوان الفرعي للقسم</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            value={data.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
          />
        </div>

        {/* Outcomes list */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">نقاط التعلم المضافة:</span>
            <button
              onClick={handleAddCard}
              className="bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:text-blue-700 p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-black transition-colors cursor-pointer"
            >
              <Plus size={12} />
              إضافة منفعة
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {data.cards.map((card, idx) => (
              <div key={card.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">المنفعة #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    title="حذف منفعة"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                  value={card.info_value}
                  onChange={(e) => handleCardChange(card.id, e.target.value)}
                />
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
