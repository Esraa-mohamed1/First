import React, { useState } from 'react';
import { Phone, MessageSquare, Pen, CheckCircle, Loader2 } from 'lucide-react';
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
  onEdit = () => { },
}: WhatsAppSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!data) return null;

  const isTemplate1 = templateId === 'template_1' || templateId === 'Modern Course';

  const encodedMessage = encodeURIComponent(data.message || 'مرحباً، أود الاستفسار عن الدورة');
  const cleanPhone = data.phoneNumber ? data.phoneNumber.replace(/[^0-9]/g, '').trim() : '';
  const whatsappUrl = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}` : '#';

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isEditable) {
      e.preventDefault();
    }
  };

  // Section styling defaults
  const defaultBg = isTemplate1 ? '#FBF7EE' : '#f8fafc';
  const defaultText = isTemplate1 ? '#0D3B33' : '#1f2937';

  // If the background color from store is a bright whatsapp green, ignore it for the section background to keep it looking premium
  const localBg = data.backgroundColor && data.backgroundColor !== '#499A13' && data.backgroundColor !== '#25D366'
    ? data.backgroundColor
    : defaultBg;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    // Simulate lead submission endpoint cycle
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <>
      {/* 1. Inline WhatsApp & Lead Contact Section */}
      {data.showInlineSection && (
        <section
          style={sectionStyle}
          className={twMerge(
            "py-20 border-b relative group text-right",
            isTemplate1 ? "border-slate-900/5 bg-[#FBF7EE]" : "border-slate-100 bg-[#f8fafc]",
            isEditable && "hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-50/50 transition-all"
          )}
        >
          {isEditable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="absolute top-4 right-4 z-50 bg-blue-600 hover:bg-  blue-700 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold font-sans transition-all cursor-pointer"
            >
              <Pen size={12} />
              تعديل قسم الواتساب
            </button>
          )}

          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

              {/* Right Column: Lead Text & WhatsApp Call-to-action */}
              <div className="flex flex-col items-start gap-4 order-1 md:order-2">
                <span
                  style={{ color: isTemplate1 ? '#C9A24B' : `rgb(${primaryRgbTriplet})` }}
                  className="font-bold text-xs uppercase tracking-wide flex items-center gap-2"
                >
                  ✦ &nbsp;{data.title || 'لسه محتار؟'}
                </span>

                <h2 style={{ color: isTemplate1 ? '#0D3B33' : 'inherit' }} className="text-2xl md:text-3xl font-black leading-tight">
                  {data.subtitle || 'سجّل اهتمامك وهنكلمك بنفسنا'}
                </h2>

                <p className="text-xs md:text-sm font-medium leading-relaxed max-w-xl text-slate-500">
                  سيب اسمك ورقم موبايلك، وفريق الدورة هيتواصل معاك خلال 24 ساعة يجاوب على كل أسئلتك ويساعدك تقرر إذا كانت الدورة مناسبة لك — بدون أي التزام.
                </p>

                <div className="pt-2 flex justify-start w-full">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    style={{ backgroundColor: '#499A13', color: '#ffffff' }}
                    className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all duration-200 font-extrabold text-sm cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5-.6-1.5-.8-2-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4 15.7 15.7 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.8 2.8 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" />
                    </svg>
                    {data.buttonText || 'أو ابعت لنا واتساب مباشرة'}
                  </a>
                </div>
              </div>

              {/* Left Column: White Lead registration Form Card */}
              <div className="order-2 md:order-1 w-full max-w-md mx-auto">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 w-full relative overflow-hidden text-right">
                  {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700">الاسم الكامل</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="اكتب اسمك هنا"
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C9A24B] focus:bg-white text-xs font-bold transition-all text-slate-800"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700">رقم الموبايل (واتساب)</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="01xxxxxxxxx أو 05xxxxxxxx"
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#C9A24B] focus:bg-white text-xs font-bold transition-all text-slate-800 text-right"
                          dir="ltr"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{ backgroundColor: isTemplate1 ? '#C9A24B' : 'var(--theme-primary)', color: isTemplate1 ? '#082A24' : '#ffffff' }}
                        className="w-full py-4 text-xs font-black rounded-2xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          'سجّل اهتمامك مجاناً'
                        )}
                      </button>

                      <p className="text-[10px] text-slate-400 text-center font-bold mt-2">🔒 بياناتك في أمان تام ولن تُستخدم إلا للتواصل بخصوص الدورة.</p>
                    </form>
                  ) : (
                    <div className="py-8 text-center flex flex-col items-center justify-center gap-4 animate-in fade-in duration-200">
                      <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500 border border-green-100 mx-auto">
                        <CheckCircle size={28} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-sm">تم استلام بياناتك بنجاح!</h4>
                        <p className="text-xs text-slate-400 font-bold mt-1.5">فريقنا هيتواصل معاك خلال 24 ساعة على الواتساب.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2. Floating WhatsApp widget */}
      {data.showFloatingButton && (
        <div className="fixed bottom-6 right-6 z-[999] pointer-events-auto" style={{ direction: 'rtl' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            style={{ backgroundColor: '#499A13', color: '#ffffff' }}
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
