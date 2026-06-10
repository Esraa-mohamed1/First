import React from 'react';
import { Sparkles } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { getTypographyStyle } from '../utils/typography';

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
  // Badge text
  badgeText?: string;
  [key: string]: any;
}

export default function HeroBanner(props: HeroBannerProps) {
  const {
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
    badgeText = 'تعلّم بذكاء',
  } = props;

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

  // Get dynamic typography styles
  const defaultTitleSize = deviceMode === 'mobile' ? 'text-xl' : deviceMode === 'tablet' ? 'text-3xl' : 'text-3xl md:text-5xl';
  const defaultSubtitleSize = deviceMode === 'mobile' ? 'text-[11px] leading-relaxed' : deviceMode === 'tablet' ? 'text-xs' : 'text-sm md:text-base';

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: defaultTitleSize,
    weight: 'font-black',
    color: bgImage ? '#ffffff' : titleColor
  });

  const subtitleTypography = getTypographyStyle(props, 'subtitle', {
    font: 'IBM Plex Sans Arabic',
    size: defaultSubtitleSize,
    weight: 'font-semibold',
    color: bgImage ? '#e2e8f0' : subtitleColor
  });

  const badgeTypography = getTypographyStyle(props, 'badge', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-[11px]',
    weight: 'font-black',
    color: '#2563eb'
  });

  const buttonTypography = getTypographyStyle(props, 'buttonText', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-xs',
    weight: 'font-black',
    color: buttonTextColor
  });

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
        
        {badgeText && (
          <div 
            style={badgeTypography.style}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit bg-blue-500/10 ${
              badgeTypography.className
            } ${align === 'center' ? 'mx-auto' : align === 'left' ? 'mr-auto' : 'ml-auto'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>
        )}

        <h1 
          style={titleTypography.style}
          className={`leading-tight ${titleTypography.className}`}
        >
          {title}
        </h1>

        {subtitle && (
          <p 
            style={subtitleTypography.style}
            className={`leading-relaxed max-w-xl ${subtitleTypography.className}`}
          >
            {subtitle}
          </p>
        )}

        {buttonText && (
          <div className="pt-2">
            <button
              style={{ ...buttonTypography.style, backgroundColor: buttonColor }}
              className={`px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/15 active:scale-95 transition-all select-none ${buttonTypography.className}`}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
