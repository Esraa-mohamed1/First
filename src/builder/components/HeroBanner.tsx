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
  let isEditing = false;
  try {
    deviceMode = useBuilderStore((state) => state.deviceMode);
    // Fetch editing mode state from the builder store
    isEditing = useBuilderStore((state) => state.isEditing);
  } catch (_) {}

  const isVideoUrl = (url: string) => {
    return url && (
      url.startsWith('data:video/') || 
      url.includes('video/mp4') || 
      url.endsWith('.mp4') || 
      url.endsWith('.webm') || 
      url.endsWith('.ogg') ||
      url.includes('/uploads/video')
    );
  };

  const isVideoBg = isVideoUrl(bgImage);
  const isVideoSide = isVideoUrl(heroImage);
  const hasSideImage = !!heroImage && !bgImage;
  const isMobile = deviceMode === 'mobile';

  const alignmentClass =
    align === 'left' ? 'text-left justify-start' :
    align === 'center' ? 'text-center justify-center' : 'text-right justify-end';

  const isTransparentBg = hasSectionBackground(props);

  const containerStyle: React.CSSProperties = {
    backgroundColor: isTransparentBg ? 'transparent' : ((bgImage && !isVideoBg) ? undefined : backgroundColor),
    backgroundImage: isTransparentBg ? undefined : ((bgImage && !isVideoBg) ? `url(${bgImage})` : undefined),
    backgroundSize: (bgImage && !isVideoBg) ? 'cover' : undefined,
    backgroundPosition: (bgImage && !isVideoBg) ? 'center' : undefined,
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
        {title && typeof title === 'string' && title.includes('UI/UX') ? (
          title.split(/(UI\/UX)/g).map((part, i) => 
            part === 'UI/UX' 
              ? <span key={i} style={{ color: 'var(--theme-primary, #7c3aed)' }}>{part}</span>
              : part
          )
        ) : title}
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
              style={{ 
                backgroundColor: secondButtonColor, 
                color: secondButtonTextColor,
                borderColor: secondButtonTextColor || 'var(--theme-primary)'
              }}
              className="px-8 py-3.5 rounded-xl font-black text-xs transition-all active:scale-95 select-none border"
            >
              {secondButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );

  // ── SIDE IMAGE BLOCK ──────────────────────────────────────────────
  const shapeClass = 
    props.heroImageShape === 'circle' ? 'rounded-full' :
    props.heroImageShape === 'square' ? 'rounded-none' :
    props.heroImageShape === 'leaf' ? 'rounded-3xl rounded-tr-none rounded-bl-none' : 'rounded-2xl';

  const imageBlock = hasSideImage ? (
    <div className={`relative z-10 flex-1 flex items-center ${heroImagePosition === 'right' ? 'justify-end' : 'justify-start'} animate-[float_5s_ease-in-out_infinite]`}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.01); }
        }
      `}} />
      {isVideoSide ? (
        <video
          src={heroImage}
          controls
          className={`${shapeClass} shadow-2xl transition-all duration-500 hover:rotate-1 hover:scale-[1.02]`}
          style={{ 
            maxWidth: '100%',
            width: props.heroImageWidth ? `${props.heroImageWidth}px` : 'auto',
            height: props.heroImageHeight ? `${props.heroImageHeight}px` : 'auto',
            objectFit: props.heroImageFit || 'contain'
          }}
        />
      ) : props.heroImageLink && !isEditing ? (
        <a 
          href={props.heroImageLink}
          target="_blank" 
          rel="noopener noreferrer"
          className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-99 block"
        >
          <img
            src={heroImage}
            alt="Hero"
            className={`${shapeClass} shadow-2xl transition-all duration-500 hover:rotate-1 hover:scale-[1.02]`}
            style={{ 
              maxWidth: '100%',
              width: props.heroImageWidth ? `${props.heroImageWidth}px` : 'auto',
              height: props.heroImageHeight ? `${props.heroImageHeight}px` : 'auto',
              objectFit: props.heroImageFit || 'contain'
            }}
          />
        </a>
      ) : (
        <img
          src={heroImage}
          alt="Hero"
          className={`${shapeClass} shadow-2xl transition-all duration-500 hover:rotate-1 hover:scale-[1.02]`}
          style={{ 
            maxWidth: '100%',
            width: props.heroImageWidth ? `${props.heroImageWidth}px` : 'auto',
            height: props.heroImageHeight ? `${props.heroImageHeight}px` : 'auto',
            objectFit: props.heroImageFit || 'contain'
          }}
        />
      )}
    </div>
  ) : null;

  return (
    <div
      style={containerStyle}
      className={`relative overflow-hidden ${isTransparentBg ? '' : 'shadow-[0_15px_45px_rgba(30,41,59,0.04)] border border-slate-100/80'} ${paddingClass} ${
        hasSideImage && !isMobile
          ? 'flex flex-row gap-10 items-center'
          : `flex items-center ${align === 'left' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'}`
      }`}
    >
      {/* Floating decorative blobs for a premium creative frontend look */}
      {!isTransparentBg && !bgImage && (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-72 h-72 rounded-full bg-blue-400/10 blur-[80px] animate-pulse pointer-events-none z-0" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 rounded-full bg-purple-400/10 blur-[90px] animate-pulse pointer-events-none z-0" style={{ animationDuration: '10s' }} />
          <div className="absolute top-[30%] right-[20%] w-48 h-48 rounded-full bg-pink-300/5 blur-[60px] pointer-events-none z-0" />
        </>
      )}

      {bgImage && isVideoBg && (
        <video 
          src={bgImage} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0" 
        />
      )}
      {bgImage && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-0" />}

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
