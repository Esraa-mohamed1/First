import React from 'react';
import { Trash2, Plus, ChevronDown } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface HeroSliderEditorProps {
  props: Record<string, any>;
  handlePropChange: (key: string, value: any) => void;
}

export default function HeroSliderEditor({
  props,
  handlePropChange,
}: HeroSliderEditorProps) {
  const slides = props.slides || [];
  const autoPlay = props.autoPlay ?? true;
  const interval = props.interval ?? 4000;

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      {/* Autoplay & Timing controls */}
      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoPlay}
            onChange={(e) => handlePropChange('autoPlay', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-xs font-black text-slate-700">تشغيل الحركة تلقائياً (Auto Play)</span>
        </label>
        
        {autoPlay && (
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-bold text-slate-500 px-0.5">
              <span>سرعة الانتقال بين الشرائح</span>
              <span>{interval / 1000} ثانية</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={interval / 1000}
              onChange={(e) => handlePropChange('interval', Number(e.target.value) * 1000)}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        )}
      </div>

      <label className="text-[10px] font-black text-slate-400 pr-1 block">تعديل شرائح السلايدر</label>
      {slides.map((slide: any, idx: number) => (
        <div key={slide.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400">شريحة #{idx + 1}</span>
            <button
              onClick={() => {
                const updated = slides.filter((s: any) => s.id !== slide.id);
                handlePropChange('slides', updated);
              }}
              className="text-rose-500 hover:text-rose-600 transition-colors p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <input
            type="text" placeholder="العنوان الرئيسي"
            value={slide.title}
            onChange={(e) => { const u = slides.map((s: any) => s.id === slide.id ? { ...s, title: e.target.value } : s); handlePropChange('slides', u); }}
            className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
          />
          <input
            type="text" placeholder="العنوان الفرعي"
            value={slide.subtitle}
            onChange={(e) => { const u = slides.map((s: any) => s.id === slide.id ? { ...s, subtitle: e.target.value } : s); handlePropChange('slides', u); }}
            className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
          />
          <div className="grid grid-cols-1 gap-2.5">
            <input
              type="text" placeholder="نص الزر"
              value={slide.buttonText}
              onChange={(e) => { const u = slides.map((s: any) => s.id === slide.id ? { ...s, buttonText: e.target.value } : s); handlePropChange('slides', u); }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />
            <ImageUploader
              value={slide.bgImage || ''}
              onChange={(val) => { const u = slides.map((s: any) => s.id === slide.id ? { ...s, bgImage: val } : s); handlePropChange('slides', u); }}
              label="صورة الشريحة"
            />
          </div>
          <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-400">خلفية:</span>
              <input
                type="color" value={slide.backgroundColor || '#1e40af'}
                onChange={(e) => { const u = slides.map((s: any) => s.id === slide.id ? { ...s, backgroundColor: e.target.value } : s); handlePropChange('slides', u); }}
                className="w-6 h-6 p-0 rounded border border-slate-200 cursor-pointer overflow-hidden bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-400">زر:</span>
              <input
                type="color" value={slide.buttonColor || '#ffffff'}
                onChange={(e) => { const u = slides.map((s: any) => s.id === slide.id ? { ...s, buttonColor: e.target.value } : s); handlePropChange('slides', u); }}
                className="w-6 h-6 p-0 rounded border border-slate-200 cursor-pointer overflow-hidden bg-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={slide.align || 'right'}
                onChange={(e) => { const u = slides.map((s: any) => s.id === slide.id ? { ...s, align: e.target.value } : s); handlePropChange('slides', u); }}
                className="text-[9px] font-black bg-slate-50 border border-slate-100 rounded-lg p-1.5 outline-none appearance-none pr-6"
              >
                <option value="right">يمين</option>
                <option value="center">وسط</option>
                <option value="left">يسار</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          const newSlide = {
            id: String(Date.now()),
            title: 'شريحة جديدة',
            subtitle: 'أضف وصفاً للشريحة هنا',
            buttonText: 'اكتشف المزيد',
            buttonLink: '#',
            backgroundColor: '#1e40af',
            bgImage: '',
            buttonColor: '#ffffff',
            align: 'right',
          };
          handlePropChange('slides', [...slides, newSlide]);
        }}
        className="w-full py-3 border border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-500 text-xs font-black transition-all bg-slate-50/20"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة شريحة جديدة</span>
      </button>
    </div>
  );
}
