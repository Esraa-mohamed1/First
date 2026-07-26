import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Pen } from 'lucide-react';
import { FAQSectionData } from '../types/landing';
import { twMerge } from 'tailwind-merge';
import { colorToRgbTriplet } from '../utils/color';

interface FAQSectionProps {
  data: FAQSectionData;
  templateId: string;
  isEditable: boolean;
  onEdit: () => void;
}

export default function FAQSection({
  data,
  templateId,
  isEditable,
  onEdit,
}: FAQSectionProps) {
  const isTemplate1 = templateId === 'template_1' || templateId === 'Modern Course';
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setExpandedIndex(prev => (prev === idx ? null : idx));
  };

  // Custom colors parsing
  const defaultBg = isTemplate1 ? '#FBF7EE' : 'rgba(248, 250, 252, 0.3)';
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

  const faqItems = data.items || [];

  if (faqItems.length === 0) return null;

  if (isTemplate1) {
    return (
      <section 
        style={sectionStyle}
        className={twMerge(
          "faq-section py-16 text-right relative border-b group",
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
            تعديل قسم الأسئلة الشائعة
          </button>
        )}

        <div className="container max-w-[1120px] mx-auto px-4">
          <div className="text-center mb-10">
            <span 
              style={{ color: `rgb(${primaryRgbTriplet})` }}
              className="eyebrow inline-flex items-center gap-2 font-black text-xs uppercase tracking-wide"
            >
              ✦ &nbsp;الاستفسارات
            </span>
            <h2 style={{ color: localText }} className="section-title text-2xl md:text-3xl font-extrabold mt-2 mb-4">
              {data.title || 'الأسئلة الشائعة حول الدورة'}
            </h2>
          </div>

          <div className="max-w-[760px] mx-auto space-y-3">
            {faqItems.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              
              return (
                <div 
                  key={idx} 
                  style={{ backgroundColor: '#ffffff', borderColor: `rgba(${textRgb}, 0.12)` }}
                  className="border rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-5 flex items-center justify-between text-right cursor-pointer bg-none border-none outline-none"
                  >
                    <ChevronDown 
                      size={18} 
                      className={twMerge("text-slate-400 transition-transform duration-350", isExpanded ? "rotate-180" : "rotate-0")} 
                    />
                    <div className="flex items-center gap-3">
                      <span style={{ color: localText }} className="font-extrabold text-sm">{item.question}</span>
                      <HelpCircle size={18} style={{ color: `rgb(${primaryRgbTriplet})` }} className="shrink-0" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div 
                      style={{ borderTopColor: `rgba(${textRgb}, 0.08)`, backgroundColor: `rgba(${textRgb}, 0.02)`, color: `rgba(${textRgb}, 0.75)` }}
                      className="border-t p-5 px-8 text-sm leading-relaxed"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Template 2 Blue Style
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
          تعديل قسم الأسئلة الشائعة
        </button>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 
            style={{ color: localText, borderRightColor: `rgb(${primaryRgbTriplet})` }}
            className="text-2xl md:text-3xl font-black border-r-[6px] pr-4 leading-none inline-block"
          >
            {data.title || 'الأسئلة الشائعة'}
          </h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div 
                key={idx} 
                style={{ backgroundColor: '#ffffff', borderColor: `rgba(${textRgb}, 0.08)` }}
                className="rounded-2xl border overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 flex items-center justify-between text-right cursor-pointer bg-none border-none outline-none"
                >
                  <ChevronDown 
                    size={18} 
                    className={twMerge("text-slate-400 transition-transform duration-300", isExpanded ? "rotate-180" : "rotate-0")} 
                  />
                  <span style={{ color: localText }} className="font-extrabold text-sm md:text-base">{item.question}</span>
                </button>

                {isExpanded && (
                  <div 
                    style={{ borderTopColor: `rgba(${textRgb}, 0.06)`, backgroundColor: `rgba(${textRgb}, 0.02)`, color: `rgba(${textRgb}, 0.75)` }}
                    className="border-t p-5 px-6 text-xs md:text-sm leading-relaxed"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
