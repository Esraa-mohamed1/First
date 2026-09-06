'use client';

import React, { useState } from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function Template2BenefitsEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_2');
  const data = storeContent?.benefits || defaultContent.benefits || {
    title: 'ماذا ستحصل عليه؟',
    items: [
      '30 ساعة من مقاطع الفيديو عالية الجودة مصممة بعناية لتناسب إيقاع تعلمك.',
      '15 مشروع تطبيقي لبناء معرض أعمالك، لتنتقل من النظرية إلى التطبيق الحقيقي.',
      'ملفات ومصادر قابلة للتحميل تشمل قوالب عمل ومصادر إلهام احترافية.',
      'وصول إلى مجتمع الطلاب الخاص للحصول على دعم مستمر ومراجعة لأعمالك.'
    ]
  };

  const [newItem, setNewItem] = useState('');

  const handleTitleChange = (title: string) => {
    updateSectionContent('benefits', { title });
  };

  const handleItemChange = (idx: number, val: string) => {
    const currentItems = [...(data.items || [])];
    currentItems[idx] = val;
    updateSectionContent('benefits', { items: currentItems });
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    const currentItems = [...(data.items || [])];
    currentItems.push(newItem.trim());
    updateSectionContent('benefits', { items: currentItems });
    setNewItem('');
  };

  const handleRemoveItem = (idx: number) => {
    const currentItems = (data.items || []).filter((_, i) => i !== idx);
    updateSectionContent('benefits', { items: currentItems });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">ماذا ستحصل عليه (المخرجات) — القالب التفاعلي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص عنوان قائمة المخرجات وعناصر الفوائد والمشاريع والملفات التي يحصل عليها الطالب</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان القسم</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="ماذا ستحصل عليه؟"
          />
        </div>

        {/* Benefits Checklist Items */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-500" />
            نقاط المخرجات والفوائد
          </h4>

          <div className="space-y-2.5">
            {(data.items || []).map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <textarea
                  className="flex-1 border-0 bg-transparent text-xs font-bold text-slate-700 focus:outline-none resize-none"
                  rows={2}
                  value={item}
                  onChange={(e) => handleItemChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer shrink-0 mt-1"
                  title="حذف النقطة"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              className="flex-1 border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="أدخل نقطة أو مخرج جديد..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>إضافة</span>
            </button>
          </div>
        </div>

        {/* Colors */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-700">ألوان قسم المخرجات والفوائد</h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون الخلفية</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.backgroundColor || '#faf8ff'}
                  onChange={(e) => updateSectionContent('benefits', { backgroundColor: e.target.value })}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.backgroundColor || '#faf8ff'}
                  onChange={(e) => updateSectionContent('benefits', { backgroundColor: e.target.value })}
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
                  onChange={(e) => updateSectionContent('benefits', { textColor: e.target.value })}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.textColor || '#191b23'}
                  onChange={(e) => updateSectionContent('benefits', { textColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
