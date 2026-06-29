import React from 'react';
import { Trash2, Plus } from 'lucide-react';

interface NavbarBlockEditorProps {
  props: Record<string, any>;
  handlePropChange: (key: string, value: any) => void;
}

export const DEFAULT_NAV_LINKS = [
  { label: 'الرئيسية', href: '#hero-t1' },
  { label: 'نبذة عني', href: '#about-t1' },
  { label: 'الدورات', href: '#courses-t1' },
  { label: 'أعمالي', href: '#gallery-t1' },
  { label: 'آراء الطلاب', href: '#testimonials-t1' },
];

export default function NavbarBlockEditor({
  props,
  handlePropChange,
}: NavbarBlockEditorProps) {
  const isLandingPage = props.isLandingPage ?? (props.title === 'درب' || props.title === 'أكاديمية درب');
  const links = props.links || DEFAULT_NAV_LINKS;
  const showButton = props.showButton ?? true;
  const buttonText = props.buttonText ?? 'التسجيل';
  const buttonLink = props.buttonLink ?? '#';

  return (
    <div className="space-y-5 pt-4 border-t border-slate-100">
      {/* Toggle landing page mode */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100/40 select-none">
          <input 
            type="checkbox" 
            checked={isLandingPage} 
            onChange={(e) => handlePropChange('isLandingPage', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-600">تفعيل روابط التنقل (Landing Page)</span>
            <span className="text-[9px] text-slate-400">يعرض روابط الانتقال السريع في منتصف الترويسة وزر جانبي</span>
          </div>
        </label>
      </div>

      {isLandingPage && (
        <>
          {/* Navigation Links Editor */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 pr-1 block">روابط التنقل</label>
            
            {links.map((link: any, idx: number) => (
              <div 
                key={idx} 
                className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400">رابط #{idx + 1}</span>
                  <button 
                    onClick={() => {
                      const updated = links.filter((_: any, i: number) => i !== idx);
                      handlePropChange('links', updated);
                    }}
                    className="text-rose-500 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <input 
                    type="text"
                    placeholder="اسم الرابط (مثال: الرئيسية)"
                    value={link.label}
                    onChange={(e) => {
                      const updated = links.map((l: any, i: number) => i === idx ? { ...l, label: e.target.value } : l);
                      handlePropChange('links', updated);
                    }}
                    className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
                  />
                  <input 
                    type="text"
                    placeholder="رابط التوجيه (مثال: #hero-t1)"
                    value={link.href}
                    onChange={(e) => {
                      const updated = links.map((l: any, i: number) => i === idx ? { ...l, href: e.target.value } : l);
                      handlePropChange('links', updated);
                    }}
                    className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => {
                const newLink = {
                  label: 'رابط جديد',
                  href: '#'
                };
                handlePropChange('links', [...links, newLink]);
              }}
              className="w-full py-3 border border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-500 text-xs font-black transition-all bg-slate-50/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة رابط جديد</span>
            </button>
          </div>

          {/* Action Button Editor */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="text-[10px] font-black text-slate-400 pr-1 block">زر الإجراء الأيسر (مثل التسجيل)</label>
            
            <label className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100/40 select-none">
              <input 
                type="checkbox" 
                checked={showButton} 
                onChange={(e) => handlePropChange('showButton', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-600">عرض زر الإجراء الأيسر</span>
            </label>

            {showButton && (
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 pr-1 block">نص الزر</span>
                  <input 
                    type="text"
                    placeholder="نص الزر (مثال: التسجيل)"
                    value={buttonText}
                    onChange={(e) => handlePropChange('buttonText', e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 pr-1 block">رابط الزر</span>
                  <input 
                    type="text"
                    placeholder="رابط الزر (مثال: #register)"
                    value={buttonLink}
                    onChange={(e) => handlePropChange('buttonLink', e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
