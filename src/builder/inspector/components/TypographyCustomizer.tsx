import React from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  AVAILABLE_FONTS, 
  AVAILABLE_SIZES, 
  AVAILABLE_WEIGHTS 
} from '../../utils/typography';

export const EDITABLE_LINES: Record<string, { key: string; label: string; type: 'text' | 'textarea' }[]> = {
  'hero': [
    { key: 'badgeText', label: 'شارة الترويسة العليا (Badge)', type: 'text' },
    { key: 'title', label: 'العنوان الرئيسي (Title)', type: 'text' },
    { key: 'subtitle', label: 'العنوان الفرعي (Subtitle)', type: 'textarea' },
    { key: 'buttonText', label: 'نص الزر الأساسي (Button)', type: 'text' },
    { key: 'secondButtonText', label: 'نص الزر الثانوي', type: 'text' },
  ],
  'hero-slider': [
    { key: 'title', label: 'عنوان السلايدر', type: 'text' },
  ],
  'charts': [
    { key: 'title', label: 'عنوان الرسم البياني (Title)', type: 'text' }
  ],
  'tables': [
    { key: 'title', label: 'عنوان جدول البيانات (Title)', type: 'text' }
  ],
  'student-feed': [
    { key: 'title', label: 'عنوان الأنشطة (Title)', type: 'text' }
  ],
  'course-cards': [
    { key: 'title', label: 'عنوان قسم الكورسات (Title)', type: 'text' }
  ],
  'sidebar': [
    { key: 'title', label: 'اسم الأكاديمية (Title)', type: 'text' },
    { key: 'logoText', label: 'حرف الشعار (Logo Text)', type: 'text' }
  ],
  'navbar': [
    { key: 'title', label: 'عنوان الترويسة (Title)', type: 'text' }
  ],
  'metrics': [
    { key: 'title', label: 'عنوان قسم المؤشرات (Title)', type: 'text' }
  ],
  'kpi-cards': [
    { key: 'sectionTitle', label: 'عنوان قسم البطاقات', type: 'text' }
  ],
  'tabs': [
    { key: 'sectionTitle', label: 'عنوان قسم التبويبات', type: 'text' }
  ],
};

interface TypographyCustomizerProps {
  selectedNodeType: string;
  props: Record<string, any>;
  handlePropChange: (key: string, value: any) => void;
  expandedLine: string | null;
  setExpandedLine: (key: string | null) => void;
}

export default function TypographyCustomizer({
  selectedNodeType,
  props,
  handlePropChange,
  expandedLine,
  setExpandedLine,
}: TypographyCustomizerProps) {
  const lines = EDITABLE_LINES[selectedNodeType];
  if (!lines) return null;

  return (
    <div className="space-y-3 pt-4 border-t border-slate-100">
      <span className="text-[10px] font-black text-slate-400 pr-1 block">
        تنسيق وتخصيص أسطر النصوص (طراز المنتور)
      </span>
      
      <div className="space-y-2">
        {lines.map((line) => {
          const isExpanded = expandedLine === line.key;
          
          const textValue = props[line.key] ?? '';
          const fontFamily = props[`${line.key}FontFamily`] ?? 'IBM Plex Sans Arabic';
          const fontSize = props[`${line.key}FontSize`] ?? '';
          const fontWeight = props[`${line.key}FontWeight`] ?? '';
          const fontColor = props[`${line.key}Color`] ?? '';

          return (
            <div key={line.key} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/40">
              <button
                type="button"
                onClick={() => setExpandedLine(isExpanded ? null : line.key)}
                className="w-full p-3.5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors text-right"
              >
                <span className="text-[11px] font-black text-slate-700">{line.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="p-4 space-y-4 border-t border-slate-100 bg-white">
                  {/* Text Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 block">محتوى النص</label>
                    {line.type === 'textarea' ? (
                      <textarea
                        rows={2}
                        value={textValue}
                        onChange={(e) => handlePropChange(line.key, e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none transition-all resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={textValue}
                        onChange={(e) => handlePropChange(line.key, e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none transition-all"
                      />
                    )}
                  </div>

                  {/* Font Family */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 block">نوع الخط (Font Family)</label>
                    <div className="relative">
                      <select
                        value={fontFamily}
                        onChange={(e) => handlePropChange(`${line.key}FontFamily`, e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none"
                      >
                        {AVAILABLE_FONTS.map(font => (
                          <option key={font.value} value={font.value}>{font.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 block">حجم الخط (Size)</label>
                    <div className="relative">
                      <select
                        value={fontSize}
                        onChange={(e) => handlePropChange(`${line.key}FontSize`, e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none"
                      >
                        <option value="">تلقائي (حسب التصميم)</option>
                        {AVAILABLE_SIZES.map(sz => (
                          <option key={sz.value} value={sz.value}>{sz.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Font Weight */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 block">وزن الخط (Weight)</label>
                    <div className="relative">
                      <select
                        value={fontWeight}
                        onChange={(e) => handlePropChange(`${line.key}FontWeight`, e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none"
                      >
                        <option value="">تلقائي</option>
                        {AVAILABLE_WEIGHTS.map(w => (
                          <option key={w.value} value={w.value}>{w.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Font Color */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 block">لون النص (Color)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fontColor || '#1f2937'}
                        onChange={(e) => handlePropChange(`${line.key}Color`, e.target.value)}
                        className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer overflow-hidden outline-none bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={fontColor}
                        placeholder="تلقائي"
                        onChange={(e) => handlePropChange(`${line.key}Color`, e.target.value)}
                        className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
