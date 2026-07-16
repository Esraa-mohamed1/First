import React from 'react';
import { Pen } from 'lucide-react';
import { FooterSectionData } from '../types/landing';
import { twMerge } from 'tailwind-merge';
import { colorToRgbTriplet } from '../utils/color';

interface FooterSectionProps {
  data: FooterSectionData;
  templateId: string;
  isEditable: boolean;
  onEdit: () => void;
}

export default function FooterSection({
  data,
  templateId,
  isEditable,
  onEdit,
}: FooterSectionProps) {
  const isTemplate1 = templateId === 'template_1' || templateId === 'Modern Course';
  
  // Custom colors parsing
  const defaultBg = isTemplate1 ? '#082A24' : '#0f172a';
  const defaultText = '#94a3b8';
  
  const localBg = data.backgroundColor || defaultBg;
  const localText = data.textColor || defaultText;
  
  const bgRgb = colorToRgbTriplet(localBg);
  const textRgb = colorToRgbTriplet(localText);
  
  const primaryColorHex = isTemplate1 ? '#E7CE8F' : 'var(--theme-primary)';
  const primaryRgbTriplet = isTemplate1 ? '231, 206, 143' : 'var(--theme-primary-rgb)';

  const sectionStyle = {
    backgroundColor: localBg,
    color: localText,
    '--local-bg-rgb': bgRgb,
    '--local-text-rgb': textRgb,
    '--theme-primary': primaryColorHex,
    '--theme-primary-rgb': primaryRgbTriplet,
  } as React.CSSProperties;

  const links = data.links || [];

  return (
    <footer 
      style={sectionStyle}
      className={twMerge(
        "py-10 text-center relative border-t border-slate-100/10 group",
        isEditable && "hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-900/90 transition-all"
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
          تعديل الفوتر
        </button>
      )}

      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Footer Links */}
        {links.length > 0 ? (
          <div className="flex flex-wrap gap-6 text-xs font-semibold">
            {links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url} 
                style={{ color: `rgb(${primaryRgbTriplet})` }}
                className="hover:underline hover:brightness-110"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : (
          <div />
        )}

        {/* Copyright notice */}
        <p className="text-xs font-medium" style={{ color: localText }}>
          {data.text || 'حقوق النشر © 2026 أكاديمية درب. جميع الحقوق محفوظة.'}
        </p>

      </div>
    </footer>
  );
}
