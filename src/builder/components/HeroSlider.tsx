'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { hasSectionBackground } from '../utils/typography';
import { useBuilderStore } from '../store/builderStore';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  bgImage: string;
  buttonColor: string;
  align: 'right' | 'center' | 'left';
}

interface HeroSliderProps {
  id?: string;
  slides?: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  paddingTop?: string;
  paddingBottom?: string;
  [key: string]: any;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: '1',
    title: 'مرحباً بك في أكاديميتك',
    subtitle: 'ابدأ اليوم... وخلّ مستقبلك يتغير بأسلوب عملي سهل وبسيط.',
    buttonText: 'ابدأ الآن',
    buttonLink: '#',
    backgroundColor: '#1e40af',
    bgImage: '',
    buttonColor: '#ffffff',
    align: 'right',
  },
  {
    id: '2',
    title: 'دورات تدريبية احترافية',
    subtitle: 'تعلّم من نخبة المدربين المعتمدين بأسلوب تفاعلي شيّق.',
    buttonText: 'استعرض الدورات',
    buttonLink: '#',
    backgroundColor: '#065f46',
    bgImage: '',
    buttonColor: '#ffffff',
    align: 'center',
  },
  {
    id: '3',
    title: 'شهادات معتمدة دولياً',
    subtitle: 'احصل على شهادتك وارتقِ بمسارك المهني إلى مستوى عالمي.',
    buttonText: 'اعرف أكثر',
    buttonLink: '#',
    backgroundColor: '#4c1d95',
    bgImage: '',
    buttonColor: '#ffffff',
    align: 'right',
  },
];

export default function HeroSlider(props: HeroSliderProps) {
  const {
    id: sectionId,
    slides = DEFAULT_SLIDES,
    autoPlay = true,
    interval = 4000,
    showDots = true,
    showArrows = true,
    paddingTop = 'py-16',
  } = props;

  const { 
    isEditing, 
    selectedNodeId, 
    setSelectedNodeId, 
    selectedItemIndex, 
    setSelectedItemIndex, 
    hoveredItemIndex, 
    setHoveredItemIndex 
  } = useBuilderStore();

  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 200);
  }, [transitioning]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];
  const paddingClass = paddingTop || 'py-16';

  const isTransparentBg = hasSectionBackground(props);

  const containerStyle: React.CSSProperties = {
    backgroundColor: slide.bgImage ? undefined : (isTransparentBg ? 'transparent' : slide.backgroundColor),
    backgroundImage: isTransparentBg ? undefined : (slide.bgImage ? `url(${slide.bgImage})` : undefined),
    backgroundSize: slide.bgImage ? 'cover' : undefined,
    backgroundPosition: slide.bgImage ? 'center' : undefined,
  };


  const alignClass =
    slide.align === 'center' ? 'text-center items-center' :
    slide.align === 'left' ? 'text-left items-start' : 'text-right items-end';
  
  const isSelected = isEditing && selectedNodeId === sectionId && selectedItemIndex === current;
  const isHovered = isEditing && hoveredItemIndex === current;

  return (
    <div 
      className={`relative overflow-hidden rounded-3xl select-none transition-all duration-300 ${
        isSelected ? 'ring-4 ring-blue-500 ring-inset' : isHovered ? 'ring-4 ring-blue-300 ring-inset' : ''
      }`} 
      style={{ minHeight: '280px' }}
      onClick={(e) => {
        if (isEditing && sectionId) {
          e.stopPropagation();
          setSelectedNodeId(sectionId);
          setSelectedItemIndex(current);
        }
      }}
      onMouseEnter={() => isEditing && setHoveredItemIndex(current)}
      onMouseLeave={() => isEditing && setHoveredItemIndex(null)}
    >
      {/* Slide */}
      <div
        style={containerStyle}
        className={`relative w-full transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'} flex flex-col justify-center ${paddingClass} px-10 md:px-16 cursor-pointer`}
        key={slide.id}
      >
        {slide.bgImage && <div className="absolute inset-0 bg-slate-900/45" />}

        <div className={`relative z-10 max-w-2xl flex flex-col gap-5 ${alignClass} ${slide.align === 'right' ? 'ml-auto' : slide.align === 'center' ? 'mx-auto' : 'mr-auto'}`}>
          <h2
            className="text-2xl md:text-4xl font-black leading-tight"
            style={{ color: slide.bgImage ? '#ffffff' : '#ffffff' }}
          >
            {slide.title}
          </h2>

          {slide.subtitle && (
            <p className="text-sm md:text-base font-semibold leading-relaxed opacity-90" style={{ color: '#e2e8f0' }}>
              {slide.subtitle}
            </p>
          )}

          {slide.buttonText && (
            <div>
              <button
                style={{ backgroundColor: slide.buttonColor }}
                className="px-8 py-3 rounded-xl font-black text-sm shadow-lg transition-all active:scale-95"
              >
                {slide.buttonText}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Arrow Controls */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot Navigation */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-white w-6 h-2.5'
                  : 'bg-white/40 hover:bg-white/70 w-2.5 h-2.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
