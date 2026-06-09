import React from 'react';
import { Sparkles } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  align?: 'right' | 'center' | 'left';
  titleColor?: string;
  subtitleColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  backgroundColor?: string;
  bgImage?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

export default function HeroBanner({
  title = 'مرحباً بك في أكاديميتك',
  subtitle = 'ابدأ اليوم... وخلّ مستقبلك يتغير بأسلوب عملي سهل وبسيط.',
  buttonText = 'ابدأ الآن',
  buttonLink = '#',
  align = 'right',
  titleColor = '#1f2937',
  subtitleColor = '#6b7280',
  buttonColor = '#2563eb',
  buttonTextColor = '#ffffff',
  backgroundColor = '#f8fafc',
  bgImage = '',
}: HeroBannerProps) {
  // Read deviceMode with a fail-safe fallback
  let deviceMode = 'desktop';
  try {
    deviceMode = useBuilderStore((state) => state.deviceMode);
  } catch (e) {
    // Fallback if rendered outside the store context
  }

  const alignmentClass = 
    align === 'left' ? 'text-left justify-start' : 
    align === 'center' ? 'text-center justify-center' : 'text-right justify-end';

  const containerStyle: React.CSSProperties = {
    backgroundColor: bgImage ? undefined : backgroundColor,
    backgroundImage: bgImage ? `url(${bgImage})` : undefined,
    backgroundSize: bgImage ? 'cover' : undefined,
    backgroundPosition: bgImage ? 'center' : undefined,
  };

  const paddingClass = 
    deviceMode === 'mobile' ? 'px-4 py-8 rounded-2xl' : 
    deviceMode === 'tablet' ? 'px-8 py-12 rounded-3xl' : 'px-8 py-14 md:px-12 md:py-16 rounded-3xl';

  const titleSizeClass = 
    deviceMode === 'mobile' ? 'text-xl' : 
    deviceMode === 'tablet' ? 'text-3xl' : 'text-3xl md:text-5xl';

  const subtitleSizeClass = 
    deviceMode === 'mobile' ? 'text-[11px] leading-relaxed' : 
    deviceMode === 'tablet' ? 'text-xs' : 'text-sm md:text-base';

  return (
    <div 
      style={containerStyle}
      className={`relative overflow-hidden shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-100/60 flex items-center ${paddingClass} ${
        align === 'left' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'
      }`}
    >
      {/* Visual background overlay if image exists */}
      {bgImage && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />}

      <div className={`relative z-10 max-w-2xl flex flex-col space-y-6 ${alignmentClass}`}>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black w-fit bg-blue-500/10 text-blue-600 ${
          align === 'center' ? 'mx-auto' : align === 'left' ? 'mr-auto' : 'ml-auto'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>تعلّم بذكاء</span>
        </div>

        <h1 
          style={{ color: bgImage ? '#ffffff' : titleColor }}
          className={`font-black leading-tight font-['IBM_Plex_Sans_Arabic'] ${titleSizeClass}`}
        >
          {title}
        </h1>

        {subtitle && (
          <p 
            style={{ color: bgImage ? '#e2e8f0' : subtitleColor }}
            className={`font-semibold leading-relaxed max-w-xl font-['IBM_Plex_Sans_Arabic'] ${subtitleSizeClass}`}
          >
            {subtitle}
          </p>
        )}

        {buttonText && (
          <div className="pt-2">
            <button
              style={{ backgroundColor: buttonColor, color: buttonTextColor }}
              className="px-8 py-3.5 rounded-xl font-black text-xs shadow-lg shadow-blue-500/15 active:scale-95 transition-all select-none"
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
