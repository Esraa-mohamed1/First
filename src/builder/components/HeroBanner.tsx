import React from 'react';
import { Sparkles } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { getTypographyStyle, hasSectionBackground } from '../utils/typography';

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
  badgeText?: string;
  // Side image
  heroImage?: string;
  heroImagePosition?: 'right' | 'left';
  // Second CTA
  showSecondButton?: boolean;
  secondButtonText?: string;
  secondButtonColor?: string;
  secondButtonTextColor?: string;
  paddingTop?: string;
  paddingBottom?: string;
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
    buttonColor = 'var(--theme-primary)',
    buttonTextColor = '#ffffff',
    backgroundColor = '#f8fafc',
    bgImage = '',
    badgeText = 'تعلّم بذكاء',
    heroImage = '',
    heroImagePosition = 'left',
    showSecondButton = false,
    secondButtonText = 'اعرف أكثر',
    secondButtonColor = '#f1f5f9',
    secondButtonTextColor = '#1e293b',
  } = props;

  let deviceMode = 'desktop';
  try {
    deviceMode = useBuilderStore((state) => state.deviceMode);
  } catch (_) {}

  const hasSideImage = !!heroImage && !bgImage;
  const isMobile = deviceMode === 'mobile';

  const alignmentClass =
    align === 'left' ? 'text-left justify-start' :
    align === 'center' ? 'text-center justify-center' : 'text-right justify-end';

  const isTransparentBg = hasSectionBackground(props);

  const containerStyle: React.CSSProperties = {
    backgroundColor: isTransparentBg ? 'transparent' : (bgImage ? undefined : backgroundColor),
    backgroundImage: isTransparentBg ? undefined : (bgImage ? `url(${bgImage})` : undefined),
    backgroundSize: bgImage ? 'cover' : undefined,
    backgroundPosition: bgImage ? 'center' : undefined,
  };

  const paddingClass =
    deviceMode === 'mobile' ? 'px-4 py-8 rounded-2xl' :
    deviceMode === 'tablet' ? 'px-8 py-12 rounded-3xl' : 'px-8 py-14 md:px-12 md:py-16 rounded-3xl';

  const defaultTitleSize = deviceMode === 'mobile' ? 'text-xl' : deviceMode === 'tablet' ? 'text-3xl' : 'text-3xl md:text-5xl';
  const defaultSubtitleSize = deviceMode === 'mobile' ? 'text-[11px] leading-relaxed' : deviceMode === 'tablet' ? 'text-xs' : 'text-sm md:text-base';

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: defaultTitleSize,
    weight: 'font-black',
    color: bgImage ? '#ffffff' : titleColor,
  });

  const subtitleTypography = getTypographyStyle(props, 'subtitle', {
    font: 'IBM Plex Sans Arabic',
    size: defaultSubtitleSize,
    weight: 'font-semibold',
    color: bgImage ? '#e2e8f0' : subtitleColor,
  });

  const badgeTypography = getTypographyStyle(props, 'badge', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-[11px]',
    weight: 'font-black',
    color: 'var(--theme-primary)',
  });

  const buttonTypography = getTypographyStyle(props, 'buttonText', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-xs',
    weight: 'font-black',
    color: buttonTextColor,
  });

  // ── TEXT CONTENT BLOCK ────────────────────────────────────────────
  const textBlock = (
    <div className={`relative z-10 flex flex-col space-y-6 ${hasSideImage ? 'flex-1' : 'max-w-2xl'} ${alignmentClass}`}>
      {badgeText && (
        <div
          style={badgeTypography.style}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit bg-blue-500/10 ${badgeTypography.className} ${align === 'center' ? 'mx-auto' : align === 'left' ? 'mr-auto' : 'ml-auto'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{badgeText}</span>
        </div>
      )}

      <h1 style={titleTypography.style} className={`leading-tight ${titleTypography.className}`}>
        {title}
      </h1>

      {subtitle && (
        <p style={subtitleTypography.style} className={`leading-relaxed max-w-xl ${subtitleTypography.className}`}>
          {subtitle}
        </p>
      )}

      {buttonText && (
        <div className={`pt-2 flex gap-3 flex-wrap ${align === 'center' ? 'justify-center' : align === 'left' ? 'justify-start' : 'justify-end'}`}>
          <button
            style={{ ...buttonTypography.style, backgroundColor: buttonColor }}
            className={`px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/15 active:scale-95 transition-all select-none ${buttonTypography.className}`}
          >
            {buttonText}
          </button>
          {showSecondButton && secondButtonText && (
            <button
              style={{ backgroundColor: secondButtonColor, color: secondButtonTextColor }}
              className="px-8 py-3.5 rounded-xl font-black text-xs transition-all active:scale-95 select-none border border-slate-200/60"
            >
              {secondButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );

  // ── SIDE IMAGE BLOCK ──────────────────────────────────────────────
  const imageBlock = hasSideImage ? (
    <div className={`relative z-10 flex-1 flex items-center ${heroImagePosition === 'right' ? 'justify-end' : 'justify-start'}`}>
      <img
        src={heroImage}
        alt="Hero"
        className="max-h-72 md:max-h-96 w-auto object-contain rounded-2xl shadow-2xl"
        style={{ maxWidth: '100%' }}
      />
    </div>
  ) : null;

  return (
    <div
      style={containerStyle}
      className={`relative overflow-hidden ${isTransparentBg ? '' : 'shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-100/60'} ${paddingClass} ${
        hasSideImage && !isMobile
          ? 'flex flex-row gap-10 items-center'
          : `flex items-center ${align === 'left' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'}`
      }`}
    >
      {bgImage && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />}

      {hasSideImage && !isMobile ? (
        heroImagePosition === 'right' ? (
          <>
            {textBlock}
            {imageBlock}
          </>
        ) : (
          <>
            {imageBlock}
            {textBlock}
          </>
        )
      ) : (
        textBlock
      )}
    </div>
  );
}
