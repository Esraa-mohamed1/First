import React from 'react';
import { 
  Layout, MousePointer2, Smartphone, PenTool, Globe, Award, 
  ShieldCheck, Video, CheckCircle2, Pen, LucideIcon 
} from 'lucide-react';
import { LearningSectionData } from '../types/landing';
import { twMerge } from 'tailwind-merge';
import { colorToRgbTriplet } from '../utils/color';

interface LearningSectionProps {
  data: LearningSectionData;
  templateId: string;
  isEditable: boolean;
  onEdit: () => void;
}

const IconMap: Record<string, LucideIcon> = {
  Layout, MousePointer2, Smartphone, PenTool, Globe, Award, 
  ShieldCheck, Video, CheckCircle2
};

export default function LearningSection({
  data,
  templateId,
  isEditable,
  onEdit,
}: LearningSectionProps) {
  const isTemplate1 = templateId === 'template_1' || templateId === 'Modern Course';
  
  // Custom colors parsing
  const defaultBg = isTemplate1 ? '#ffffff' : 'rgba(248, 250, 252, 0.5)';
  const defaultText = isTemplate1 ? '#0D3B33' : '#1f2937';
  
  const localBg = data.backgroundColor || defaultBg;
  const localText = data.textColor || defaultText;
  
  const bgRgb = colorToRgbTriplet(localBg);
  const textRgb = colorToRgbTriplet(localText);
  
  const primaryColorHex = isTemplate1 ? '#C9A24B' : 'var(--theme-primary)';
  const primaryRgbTriplet = isTemplate1 ? '201, 162, 75' : 'var(--theme-primary-rgb)';

  const sectionStyle = {
    backgroundColor: localBg,
    color: localText,
    '--local-bg-rgb': bgRgb,
    '--local-text-rgb': textRgb,
    '--theme-primary': primaryColorHex,
    '--theme-primary-rgb': primaryRgbTriplet,
  } as React.CSSProperties;

  const defaultIcons = ['Layout', 'MousePointer2', 'Smartphone', 'PenTool', 'Globe', 'Award', 'ShieldCheck', 'Video'];
  const defaultColors = ['blue', 'blue', 'orange', 'slate', 'green', 'purple', 'red', 'indigo'];

  if (isTemplate1) {
    return (
      <section 
        style={sectionStyle}
        className={twMerge(
          "section py-16 text-right relative group",
          isEditable && "hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-50 transition-all"
        )}
      >
        {isEditable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="absolute top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold font-sans transition-all cursor-pointer"
          >
            <Pen size={12} />
            تعديل قسم ماذا ستتعلم
          </button>
        )}

        <div className="container max-w-[1120px] mx-auto px-4">
          <div className="text-center mb-10">
            <span 
              style={{ color: `rgb(${primaryRgbTriplet})` }}
              className="eyebrow inline-flex items-center gap-2 font-black text-xs uppercase tracking-wide"
            >
              ✦ &nbsp;محتوى التعلم والفوائد
            </span>
            <h2 
              style={{ color: localText }}
              className="section-title text-2xl md:text-3xl font-extrabold mt-2 mb-4"
            >
              {data.title || 'ماذا ستتعلم في هذه الدورة؟'}
            </h2>
            {data.subtitle && (
              <p 
                style={{ color: `rgba(${textRgb}, 0.7)` }}
                className="section-lead max-w-[640px] mx-auto text-sm"
              >
                {data.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.cards?.map((card, i) => {
              const iconName = card.icon || defaultIcons[i % defaultIcons.length];
              const IconComponent = IconMap[iconName] || CheckCircle2;
              
              return (
                <div 
                  key={card.id || i} 
                  style={{ backgroundColor: '#ffffff', borderColor: `rgba(${textRgb}, 0.12)` }}
                  className="border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-right"
                >
                  <div className="space-y-4">
                    <div 
                      style={{ backgroundColor: `rgba(${textRgb}, 0.05)`, color: `rgb(${primaryRgbTriplet})` }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm"
                    >
                      <IconComponent size={20} />
                    </div>
                    
                    <h3 style={{ color: localText }} className="text-base font-extrabold">
                      {card.info_key || 'فائدة علمية'}
                    </h3>
                    
                    <p style={{ color: `rgba(${textRgb}, 0.75)` }} className="text-sm leading-relaxed">
                      {card.info_value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Template 2 Style
  return (
    <section 
      style={sectionStyle}
      className={twMerge(
        "py-16 text-right relative group",
        isEditable && "hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-100 transition-all"
      )}
    >
      {isEditable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold font-sans transition-all cursor-pointer"
        >
          <Pen size={12} />
          تعديل قسم ماذا ستتعلم
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-right mb-10">
          <h2 
            style={{ color: localText, borderRightColor: `rgb(${primaryRgbTriplet})` }}
            className="text-2xl md:text-3xl font-black border-r-[6px] pr-4 leading-none"
          >
            {data.title || 'ماذا ستتعلم؟'}
          </h2>
          {data.subtitle && (
            <p 
              style={{ color: `rgba(${textRgb}, 0.6)` }}
              className="font-bold text-xs md:text-sm mt-3"
            >
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.cards?.map((card, i) => {
            const iconName = card.icon || defaultIcons[i % defaultIcons.length];
            const colorName = card.color || defaultColors[i % defaultColors.length];
            const IconComponent = IconMap[iconName] || CheckCircle2;

            return (
              <div 
                key={card.id || i} 
                style={{ backgroundColor: '#ffffff', borderColor: `rgba(${textRgb}, 0.08)` }}
                className="p-6 rounded-2xl border flex items-center justify-between gap-6 group hover:border-[var(--theme-primary)] transition-all shadow-sm"
              >
                <div style={{ color: `rgba(${textRgb}, 0.85)` }} className="font-bold leading-relaxed text-sm md:text-base text-right flex-1">
                  {card.info_value}
                </div>
                
                <div 
                  style={{ 
                    backgroundColor: colorName === 'blue' ? `rgba(${primaryRgbTriplet}, 0.1)` : undefined, 
                    color: colorName === 'blue' ? `rgb(${primaryRgbTriplet})` : undefined 
                  }}
                  className={twMerge(
                    "w-12 h-12 rounded-full shrink-0 flex items-center justify-center",
                    colorName === 'orange' ? 'bg-orange-50 text-orange-600' : 
                      colorName === 'green' ? 'bg-green-50 text-green-600' :
                      colorName === 'purple' ? 'bg-purple-50 text-purple-600' :
                      colorName === 'red' ? 'bg-red-50 text-red-600' :
                      colorName === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                      colorName !== 'blue' ? 'bg-slate-100 text-slate-600' : ''
                  )}
                >
                  <IconComponent size={22} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
