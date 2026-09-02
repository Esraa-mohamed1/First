'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template3LearningEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_3');
  const t3Data = storeContent?.template3_learning || defaultContent.template3_learning || {
    cards: storeContent?.learning?.cards || defaultContent.learning?.cards || [],
    backgroundColor: '#ffffff',
    textColor: '#191b23'
  };

  const cards: any[] = (t3Data.cards && t3Data.cards.length > 0)
    ? t3Data.cards
    : (storeContent?.learning?.cards && storeContent.learning.cards.length > 0)
      ? storeContent.learning.cards
      : defaultContent.learning?.cards || [];

  const handleColorChange = (field: 'backgroundColor' | 'textColor', value: string) => {
    updateSectionContent('template3_learning', { [field]: value });
    updateSectionContent('learning', { [field]: value });
  };

  const handleCardsChange = (newCards: any[]) => {
    updateSectionContent('template3_learning', { cards: newCards });
    updateSectionContent('learning', { cards: newCards });
  };

  const handleCardTextChange = (index: number, text: string) => {
    const updated = [...cards];
    updated[index] = {
      ...updated[index],
      info_value: text,
      value: text
    };
    handleCardsChange(updated);
  };

  const handleAddCard = () => {
    const newCard = {
      id: `learn-${Date.now()}`,
      info_key: 'ماذا ستتعلم؟',
      info_value: 'مهارة أو مخرج تعليمي جديد',
      icon: 'Check',
      color: 'blue'
    };
    handleCardsChange([...cards, newCard]);
  };

  const handleRemoveCard = (index: number) => {
    const updated = cards.filter((_, i) => i !== index);
    handleCardsChange(updated);
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">ماذا ستتعلم في هذه الدورة؟ — قالب UI/UX</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص المخرجات التعليمية والمزايا المكتسبة، وألوان القسم</p>
      </div>

      <div className="space-y-4">
        {/* Note: Main title field is intentionally removed per requirement */}

        {/* Learning Cards List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">نقاط ومخرجات التعلم:</span>
            <button
              type="button"
              onClick={handleAddCard}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>إضافة مخرج تعلم</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {cards.map((card: any, index: number) => (
              <div key={card.id || index} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                  value={card.info_value || card.value || ''}
                  onChange={(e) => handleCardTextChange(index, e.target.value)}
                  placeholder="أدخل مخرج التعلم..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCard(index)}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 size={14} />
                </button>
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
