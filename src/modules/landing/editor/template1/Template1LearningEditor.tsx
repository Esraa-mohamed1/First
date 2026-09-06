'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLandingStore } from '../../store/landingStore';
import { LearningCard } from '../../types/landing';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template1LearningEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_1');
  const data = storeContent?.learning || defaultContent.learning;
  const cards = Array.isArray(data.cards) ? data.cards : [];

  const handleChange = (field: string, value: any) => {
    updateSectionContent('learning', { [field]: value });
  };

  const handleCardChange = (cardId: string, field: keyof LearningCard, value: string) => {
    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, [field]: value } : c
    );
    updateSectionContent('learning', { cards: newCards });
  };

  const handleAddCard = () => {
    const newCard: LearningCard = {
      id: `learn-${Date.now()}`,
      info_key: 'عنوان المنفعة الجديدة',
      info_value: 'أدخل تفاصيل المنفعة هنا.',
      icon: 'CheckCircle2',
      color: 'blue'
    };
    updateSectionContent('learning', { cards: [...cards, newCard] });
  };

  const handleRemoveCard = (cardId: string) => {
    const newCards = cards.filter(c => c.id !== cardId);
    updateSectionContent('learning', { cards: newCards });
  };

  const availableIcons = [
    { value: 'Layout', label: 'تخطيط وتصميم (Layout)' },
    { value: 'MousePointer2', label: 'مؤشر وتفاعل (MousePointer2)' },
    { value: 'Smartphone', label: 'هاتف وتطبيق (Smartphone)' },
    { value: 'PenTool', label: 'أداة رسم وقلم (PenTool)' },
    { value: 'Globe', label: 'شبكة وإنترنت (Globe)' },
    { value: 'Award', label: 'شهادة ووسام (Award)' },
    { value: 'ShieldCheck', label: 'أمان وضمان (ShieldCheck)' },
    { value: 'Video', label: 'فيديو وشرح (Video)' },
    { value: 'CheckCircle2', label: 'تحقق ونجاح (CheckCircle2)' },
    { value: 'Sparkles', label: 'بريق وتميز (Sparkles)' },
    { value: 'Zap', label: 'طاقة وسرعة (Zap)' },
    { value: 'Clock', label: 'وقت وساعات (Clock)' },
    { value: 'Star', label: 'نجمة وتقييم (Star)' },
    { value: 'BookOpen', label: 'كتاب ومصدر (BookOpen)' },
    { value: 'Layers', label: 'طبقات ومستويات (Layers)' },
    { value: 'GraduationCap', label: 'قبعة تخرج (GraduationCap)' }
  ];

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-amber-500 pr-2">قسم ماذا ستتعلم — القالب الملكي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص نقاط التعلم والفوائد، أيقونات البطاقات، وألوان القسم والبطاقات</p>
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

        {/* Subtitle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">العنوان الفرعي للقسم</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 font-bold"
            value={data.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
          />
        </div>

        {/* Outcomes list */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">نقاط التعلم المضافة:</span>
            <button
              type="button"
              onClick={handleAddCard}
              className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-black transition-colors cursor-pointer"
            >
              <Plus size={12} />
              إضافة منفعة
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {cards.map((card, idx) => (
              <div key={card.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-black">المنفعة #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(card.id)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    title="حذف منفعة"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500">عنوان البطاقة:</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-amber-500 font-black text-slate-800"
                    value={card.info_key === 'what_you_will_learn' ? '' : (card.info_key || '')}
                    onChange={(e) => handleCardChange(card.id, 'info_key', e.target.value)}
                    placeholder="مثال: إتقان الأساسيات والمبادئ"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500">وصف المنفعة:</label>
                  <textarea
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-amber-500 font-medium min-h-[50px]"
                    value={card.info_value || ''}
                    onChange={(e) => handleCardChange(card.id, 'info_value', e.target.value)}
                    placeholder="التفاصيل أو الشرح..."
                  />
                </div>

                {/* Icon Selection */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500">أيقونة البطاقة:</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-amber-500 font-bold cursor-pointer"
                    value={card.icon || (idx === 0 ? 'Layout' : idx === 1 ? 'MousePointer2' : idx === 2 ? 'Smartphone' : 'PenTool')}
                    onChange={(e) => handleCardChange(card.id, 'icon', e.target.value)}
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic.value} value={ic.value}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Styling colors */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-700">ألوان قسم ماذا ستتعلم</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون خلفية القسم</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.backgroundColor || '#ffffff'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.backgroundColor || '#ffffff'}
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
              <label className="text-xs font-bold text-slate-700">لون خلفية بطاقات النقاط</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.itemBackgroundColor || '#ffffff'}
                  onChange={(e) => handleChange('itemBackgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.itemBackgroundColor || '#ffffff'}
                  onChange={(e) => handleChange('itemBackgroundColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
