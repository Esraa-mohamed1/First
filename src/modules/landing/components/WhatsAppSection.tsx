import React from 'react';
import { Phone, MessageSquare, Pen } from 'lucide-react';
import { WhatsAppSectionData } from '../types/landing';
import { twMerge } from 'tailwind-merge';
import { colorToRgbTriplet } from '../utils/color';

interface WhatsAppSectionProps {
  data: WhatsAppSectionData;
  templateId?: string;
  isEditable?: boolean;
  onEdit?: () => void;
}

export default function WhatsAppSection({
  data,
  templateId = 'template_1',
  isEditable = false,
  onEdit = () => {},
}: WhatsAppSectionProps) {
  if (!data) return null;

  const isTemplate1 = templateId === 'template_1' || templateId === 'Modern Course';
  
  const encodedMessage = encodeURIComponent(data.message || 'مرحباً، أود الاستفسار عن الدورة');
  const cleanPhone = data.phoneNumber ? data.phoneNumber.replace('+', '').trim() : '';
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isEditable) {
      e.preventDefault();
    }
  };

  const defaultBg = isTemplate1 ? '#FBF7EE' : '#f8fafc';
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

  return (
    <>
      {/* 1. Inline WhatsApp Contact Section */}
      {data.showInlineSection && data.phoneNumber && (
        <section 
          style={sectionStyle}
          className={twMerge(
            "py-16 text-center border-b relative group",
            isTemplate1 ? "border-slate-900/5" : "border-slate-100",
            isEditable && "hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-50/50 transition-all"
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
              تعديل قسم الواتساب
            </button>
          )}

          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <span 
              style={{ backgroundColor: `rgba(${primaryRgbTriplet}, 0.1)`, color: `rgb(${primaryRgbTriplet})` }}
              className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold"
            >
              💬 خدمة العملاء والدعم
            </span>

            <h2 style={{ color: localText }} className="text-2xl md:text-3xl font-black leading-tight">
              {data.title || 'هل لديك أي استفسار آخر؟'}
            </h2>

            <p style={{ color: `rgba(${textRgb}, 0.75)` }} className="text-sm font-medium leading-relaxed max-w-xl mx-auto">
              {data.subtitle || 'تواصل معنا مباشرة عبر واتساب وسيجيب فريق الدعم على كافة أسئلتك واستفساراتك.'}
            </p>

            <div className="pt-2 flex justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                style={{ backgroundColor: '#25D366', color: '#ffffff' }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl shadow-xl hover:translate-y-[-1px] active:scale-95 transition-all duration-200 font-extrabold text-sm cursor-pointer"
              >
                {/* Custom WhatsApp Icon */}
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.886.002-2.656-1.023-5.153-2.885-7.019C16.59 1.83 14.1 1.79 12.01 1.79c-5.442 0-9.866 4.41-9.87 9.89-.001 1.785.474 3.528 1.378 5.062L2.5 21.034l4.147-1.88z" />
                </svg>
                {data.buttonText || 'تواصل معنا عبر واتساب'}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 2. Floating WhatsApp widget */}
      {data.showFloatingButton && data.phoneNumber && (
        <div className="fixed bottom-6 right-6 z-[999] pointer-events-auto" style={{ direction: 'rtl' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            style={{ backgroundColor: '#25D366', color: '#ffffff' }}
            className="flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group font-sans font-extrabold text-xs md:text-sm"
          >
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="shrink-0">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.886.002-2.656-1.023-5.153-2.885-7.019C16.59 1.83 14.1 1.79 12.01 1.79c-5.442 0-9.866 4.41-9.87 9.89-.001 1.785.474 3.528 1.378 5.062L2.5 21.034l4.147-1.88z" />
            </svg>
            <span className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-500 ease-in-out whitespace-nowrap">
              {data.buttonText || 'تواصل معنا عبر واتساب'}
            </span>
          </a>
        </div>
      )}
    </>
  );
}
