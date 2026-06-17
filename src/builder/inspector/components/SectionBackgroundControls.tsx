import React from 'react';
import { ChevronDown } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface SectionBackgroundControlsProps {
  props: Record<string, any>;
  handlePropChange: (key: string, value: any) => void;
  isSimpleMode?: boolean;
}

export default function SectionBackgroundControls({
  props,
  handlePropChange,
  isSimpleMode = false,
}: SectionBackgroundControlsProps) {
  const bgTypes = isSimpleMode 
    ? (['solid'] as const)
    : (['solid', 'gradient'] as const);

  const currentBgType = props.sectionBgType || 'solid';
  const activeBgType = bgTypes.includes(currentBgType as any) ? currentBgType : 'solid';

  return (
    <>
      {/* ── Section Background Controls ── */}
      <div className="space-y-3.5 pt-4 border-t border-slate-100">
        <span className="text-[10px] font-black text-slate-500 block">خلفية القسم (Section Background)</span>

        {/* Background type toggle */}
        <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-1">
          {bgTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handlePropChange('sectionBgType', t)}
              className={`flex-1 py-2 rounded-xl text-[9px] font-black transition-all ${
                activeBgType === t
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t === 'solid' ? 'لون صلب' : t === 'gradient' ? 'تدرج لون' : 'صورة خلفية'}
            </button>
          ))}
        </div>

        {/* Solid color */}
        {activeBgType === 'solid' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={props.sectionBg || '#f8fafc'}
                onChange={(e) => handlePropChange('sectionBg', e.target.value)}
                className="w-12 h-12 p-0.5 rounded-xl border border-slate-200 cursor-pointer overflow-hidden bg-transparent"
              />
              {!isSimpleMode ? (
                <input
                  type="text"
                  value={props.sectionBg || ''}
                  placeholder="#f8fafc أو فارغ للشفافية"
                  onChange={(e) => handlePropChange('sectionBg', e.target.value)}
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-bold text-slate-600 outline-none text-left"
                  dir="ltr"
                />
              ) : (
                <span className="text-[10px] font-bold text-slate-500">اضغط على المربع لاختيار لون التعبئة</span>
              )}
            </div>
            <span className="text-[9px] font-bold text-slate-400 block mt-1 leading-normal">
              💡 اضغط على المربع الملون لفتح لوحة الألوان وتعيين لون لخلفية القسم بالكامل.
            </span>
          </div>
        )}

        {/* Gradient */}
        {!isSimpleMode && activeBgType === 'gradient' && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 block">اللون الأول</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={props.sectionGradientFrom || '#2563eb'} onChange={(e) => handlePropChange('sectionGradientFrom', e.target.value)} className="w-8 h-8 p-0 rounded-lg border border-slate-200 cursor-pointer overflow-hidden bg-transparent" />
                  <input type="text" value={props.sectionGradientFrom || '#2563eb'} onChange={(e) => handlePropChange('sectionGradientFrom', e.target.value)} className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono outline-none" dir="ltr" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 block">اللون الثاني</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={props.sectionGradientTo || '#7c3aed'} onChange={(e) => handlePropChange('sectionGradientTo', e.target.value)} className="w-8 h-8 p-0 rounded-lg border border-slate-200 cursor-pointer overflow-hidden bg-transparent" />
                  <input type="text" value={props.sectionGradientTo || '#7c3aed'} onChange={(e) => handlePropChange('sectionGradientTo', e.target.value)} className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono outline-none" dir="ltr" />
                </div>
              </div>
            </div>
            <div className="relative">
              <select
                value={props.sectionGradientDir || 'to-br'}
                onChange={(e) => handlePropChange('sectionGradientDir', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none"
              >
                <option value="to-r">يمين ← يسار</option>
                <option value="to-l">يسار ← يمين</option>
                <option value="to-b">أسفل</option>
                <option value="to-t">أعلى</option>
                <option value="to-br">قطري ↘</option>
                <option value="to-tr">قطري ↗</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div
              className="w-full h-8 rounded-xl border border-slate-100"
              style={{
                backgroundImage: `linear-gradient(135deg, ${props.sectionGradientFrom || '#2563eb'}, ${props.sectionGradientTo || '#7c3aed'})`
              }}
            />
          </div>
        )}
      </div>

      {/* ── Decorative Shapes ── */}
      {!isSimpleMode && (
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <span className="text-[10px] font-black text-slate-500 block">الأشكال الزخرفية (Decorative Shapes)</span>
          <div className="relative">
            <select
              value={props.sectionShape || 'none'}
              onChange={(e) => handlePropChange('sectionShape', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none appearance-none"
            >
              <option value="none">بلا شكل</option>
              <option value="wave-top">موجة علوية</option>
              <option value="wave-bottom">موجة سفلية</option>
              <option value="circle-blur">دوائر ضبابية</option>
              <option value="blob">Blob</option>
              <option value="grid-dots">نقاط شبكية</option>
              <option value="diagonal-lines">خطوط قطرية</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {(props.sectionShape && props.sectionShape !== 'none') && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-slate-400">لون الشكل:</span>
                <input
                  type="color" value={props.sectionShapeColor || '#3b82f6'}
                  onChange={(e) => handlePropChange('sectionShapeColor', e.target.value)}
                  className="w-8 h-8 p-0 rounded-lg border border-slate-200 cursor-pointer overflow-hidden bg-transparent"
                />
                <input
                  type="text" value={props.sectionShapeColor || '#3b82f6'}
                  onChange={(e) => handlePropChange('sectionShapeColor', e.target.value)}
                  className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono outline-none" dir="ltr"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-500">
                  <span>شفافية الشكل</span>
                  <span>{props.sectionShapeOpacity ?? 20}%</span>
                </div>
                <input
                  type="range" min="5" max="80" step="5"
                  value={props.sectionShapeOpacity ?? 20}
                  onChange={(e) => handlePropChange('sectionShapeOpacity', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
