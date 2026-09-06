'use client';

import React from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';
import { Plus, Trash2 } from 'lucide-react';

export default function Template2FooterEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_2');
  const data = storeContent?.footer || defaultContent.footer || {
    text: '© 2026 دَرّب التعليمية. جميع الحقوق محفوظة.',
    links: [
      { label: 'سياسة الخصوصية', url: '#' },
      { label: 'الشروط والأحكام', url: '#' },
      { label: 'مركز المساعدة', url: '#' }
    ],
    backgroundColor: '#f3f3fe',
    textColor: '#434654'
  };

  const handleChange = (field: string, value: any) => {
    updateSectionContent('footer', { [field]: value });
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const currentLinks = [...(data.links || [])];
    if (!currentLinks[index]) return;
    currentLinks[index] = {
      ...currentLinks[index],
      [field]: value
    };
    updateSectionContent('footer', { links: currentLinks });
  };

  const handleAddLink = () => {
    const currentLinks = [...(data.links || [])];
    currentLinks.push({ label: 'رابط جديد', url: '#' });
    updateSectionContent('footer', { links: currentLinks });
  };

  const handleRemoveLink = (index: number) => {
    const currentLinks = (data.links || []).filter((_, i) => i !== index);
    updateSectionContent('footer', { links: currentLinks });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">تذييل الصفحة (الفوتر) — القالب التفاعلي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص حقوق النشر، روابط التذييل، وألوان خلفية ونصوص الفوتر</p>
      </div>

      <div className="space-y-4">
        {/* Copyright Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">نص حقوق النشر والتذييل</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.text || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            placeholder="© 2026 دَرّب التعليمية. جميع الحقوق محفوظة."
          />
        </div>

        {/* Links */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">روابط التذييل:</span>
            <button
              type="button"
              onClick={handleAddLink}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} />
              <span>إضافة رابط</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(data.links || []).map((link: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-1/2 border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                  value={link.label || ''}
                  onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                  placeholder="عنوان الرابط"
                />
                <input
                  type="text"
                  className="w-1/2 border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left font-bold"
                  dir="ltr"
                  value={link.url || ''}
                  onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink(idx)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-700">ألوان تذييل الصفحة</h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون الخلفية</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.backgroundColor || '#f3f3fe'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.backgroundColor || '#f3f3fe'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون النصوص والروابط</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.textColor || '#434654'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.textColor || '#434654'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
