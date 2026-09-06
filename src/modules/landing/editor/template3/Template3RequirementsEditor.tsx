'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template3RequirementsEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_3');
  const data = (storeContent?.template3_requirements || defaultContent.template3_requirements || {
    title: 'المتطلبات الأساسية للبدء',
    items: [
      'لا يشترط وجود خبرة سابقة في التصميم أو التطوير.',
      'جهاز كمبيوتر (Mac أو Windows) متصل بالإنترنت.',
      'الالتزام والرغبة بالتطبيق والعمل والتطوير المستمر.'
    ],
    backgroundColor: '#ffffff',
    textColor: '#191b23'
  }) as any;

  const items: string[] = data.items && data.items.length > 0 ? data.items : [
    'لا يشترط وجود خبرة سابقة في التصميم أو التطوير.',
    'جهاز كمبيوتر (Mac أو Windows) متصل بالإنترنت.',
    'الالتزام والرغبة بالتطبيق والعمل والتطوير المستمر.'
  ];

  const handleChange = (field: string, value: any) => {
    updateSectionContent('template3_requirements', { [field]: value });
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    handleChange('items', newItems);
  };

  const handleAddItem = () => {
    handleChange('items', [...items, 'متطلب جديد للبدء بالدورة']);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    handleChange('items', newItems);
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">المتطلبات الأساسية للبدء — قالب UI/UX</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص شروط ومتطلبات التسجيل والبدء بالبرنامج التدريبي</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان قسم المتطلبات</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="المتطلبات الأساسية للبدء"
          />
        </div>

        {/* Requirements Items */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">قائمة المتطلبات والشروط:</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>إضافة متطلب</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
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
                value={data.textColor || '#191b23'}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                value={data.textColor || '#191b23'}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
