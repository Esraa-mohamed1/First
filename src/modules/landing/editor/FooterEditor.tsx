import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLandingStore } from '../store/landingStore';

export default function FooterEditor() {
  const content = useLandingStore(state => state.content);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  if (!content || !content.footer) return null;

  const data = content.footer;

  const handleChange = (field: string, value: any) => {
    updateSectionContent('footer', { [field]: value });
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = data.links.map((link, idx) => 
      idx === index ? { ...link, [field]: value } : link
    );
    updateSectionContent('footer', { links: newLinks });
  };

  const handleAddLink = () => {
    const newLink = { label: 'رابط جديد', url: '#' };
    updateSectionContent('footer', { links: [...data.links, newLink] });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = data.links.filter((_, idx) => idx !== index);
    updateSectionContent('footer', { links: newLinks });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">تعديل الفوتر (أسفل الصفحة)</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">خصص عبارات حقوق النشر وروابط التنقل السريعة</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">نص حقوق الملكية</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            value={data.text}
            onChange={(e) => handleChange('text', e.target.value)}
          />
        </div>

        {/* Links list */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">روابط التذييل:</span>
            <button
              onClick={handleAddLink}
              className="bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:text-blue-700 p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-black transition-colors cursor-pointer"
            >
              <Plus size={12} />
              إضافة رابط
            </button>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {data.links.map((link, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">رابط #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveLink(idx)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    title="حذف الرابط"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-500">نص الرابط:</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-1.5 text-xs bg-white focus:outline-none focus:border-blue-600"
                      value={link.label}
                      onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-500">العنوان URL:</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-1.5 text-xs bg-white focus:outline-none focus:border-blue-600 font-mono"
                      value={link.url}
                      onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">لون الخلفية</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                value={data.backgroundColor || '#082A24'}
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
                value={data.textColor || '#94a3b8'}
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
