import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ComponentRegistryEntry } from '../interfaces';
import { buildStyles, extractContentProps, extractStyleProps, getTypographyStyle } from '../utils/typography';
import { useDeviceMode } from '../context/DeviceModeContext';
import { useBuilderStore } from '../store/builderStore';

// Import existing blocks
import HeroBanner from '../components/HeroBanner';
import HeroSlider from '../components/HeroSlider';
import KpiCards from '../components/KpiCards';
import ChartsBlock from '../components/ChartsBlock';
import TableBlock from '../components/TableBlock';
import StudentFeed from '../components/StudentFeed';
import CourseCards from '../components/CourseCards';
import SidebarBlock from '../components/SidebarBlock';
import NavbarBlock, { FooterBlock } from '../components/NavbarBlock';
import TabsBlock from '../components/TabsBlock';
import MetricsCards from '../components/MetricsCards';

// ─── Dynamic Icon Component ──────────────────────────────────────────────────

export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return React.createElement(IconComponent, { className });
}

// ─── Responsive Grid Helper ──────────────────────────────────────────────────

function getResponsiveGridClass(cols: number) {
  if (cols <= 1) return 'grid-cols-1';
  if (cols === 2) return 'grid-cols-1 sm:grid-cols-2';
  if (cols === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  if (cols === 4) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
  if (cols === 5) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
  return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
}

// ─── Dynamic Component Implementations (using React.createElement for pure .ts compliance) ───

export const HeroSection = React.memo((props: any) => {
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

  const {
    isEditing,
    selectedNodeId,
    setSelectedNodeId,
    selectedItemIndex,
    setSelectedItemIndex,
    hoveredItemIndex,
    setHoveredItemIndex
  } = useBuilderStore();

  let currentTemplate: any = null;
  try {
    currentTemplate = useBuilderStore((state) => state.currentTemplate);
  } catch (e) {
    // Fallback if rendered outside the store context
  }
  const isUdemy = currentTemplate?.id === 'template_2';
  const isEdx = currentTemplate?.id === 'template_3';

  const styles = buildStyles(props);
  const content = extractContentProps(props);
  const items = props.items || [];
  const px = 'px-4 sm:px-8 lg:px-16';
  const py = 'py-10 sm:py-16';

  const [current, setCurrent] = React.useState(0);
  const [transitioning, setTransitioning] = React.useState(false);

  const goTo = React.useCallback((index: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 200);
  }, [transitioning]);

  const next = React.useCallback(() => {
    if (items.length <= 1) return;
    goTo((current + 1) % items.length);
  }, [current, items.length, goTo]);

  // When in editing mode, jump display to whichever slide is selected in the inspector
  React.useEffect(() => {
    if (isEditing && selectedItemIndex !== null && selectedItemIndex < items.length) {
      setCurrent(selectedItemIndex);
    }
  }, [selectedItemIndex, isEditing, items.length]);

  // Auto-advance slides when not in editing mode
  React.useEffect(() => {
    if (isEditing || items.length <= 1) return;
    const speed = props.slider_speed !== undefined ? Number(props.slider_speed) : 4;
    if (speed <= 0) return;
    const timer = setInterval(next, speed * 1000);
    return () => clearInterval(timer);
  }, [next, items.length, props.slider_speed, isEditing]);

  if (items.length > 0) {
    const slide = items[current] || {};
    const slideProps = slide.props || {};

    // Text alignment classes for the current slide
    const slideAlign = slideProps.align || 'right';
    const alignClass =
      slideAlign === 'left' ? 'text-left items-start' :
      slideAlign === 'center' ? 'text-center items-center' :
      'text-right items-end';

    // Selection ring for builder editing UI
    const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === current;
    const isHovered  = isEditing && hoveredItemIndex === current;

    // Detect video vs image background / side media for this slide
    const isVideoBg   = isVideoUrl(slideProps.bg_image);
    const isVideoSide = isVideoUrl(slideProps.side_image);

    // Background style — only set CSS backgroundImage when it's an image URL
    const slideStyle: React.CSSProperties = {
      backgroundColor: slideProps.background_color || (isUdemy ? '#f8fafc' : '#1e40af'),
      backgroundImage: (slideProps.bg_image && !isVideoBg) ? `url(${slideProps.bg_image})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };

    // Show optional white card overlay behind text
    const showOverlay = slideProps.show_card_overlay ?? false;

    // Side media configuration
    const sideImage       = slideProps.side_image;
    const hasSideImage    = !!sideImage;
    const sideImageShape  = slideProps.side_image_shape || 'rounded';
    const sideShapeClass  =
      sideImageShape === 'circle' ? 'rounded-full' :
      sideImageShape === 'square' ? 'rounded-none' :
      sideImageShape === 'leaf'   ? 'rounded-3xl rounded-tr-none rounded-bl-none' : 'rounded-2xl';

    // Build the side-media element (image or video)
    const sideMediaEl = hasSideImage ? React.createElement(
      'div',
      { className: `relative z-10 flex-1 flex items-center ${slideProps.side_image_position === 'right' ? 'justify-end' : 'justify-start'} animate-[float_5s_ease-in-out_infinite]` },
      React.createElement('style', {
        dangerouslySetInnerHTML: {
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-12px) scale(1.01); }
            }
          `
        }
      }),
      isVideoSide
        ? React.createElement('video', {
            src: sideImage, controls: true,
            className: `${sideShapeClass} shadow-2xl transition-all duration-500 hover:rotate-1 hover:scale-[1.02]`,
            style: {
              maxWidth: '100%',
              width:  slideProps.side_image_width  ? `${slideProps.side_image_width}px`  : 'auto',
              height: slideProps.side_image_height ? `${slideProps.side_image_height}px` : 'auto',
              objectFit: slideProps.side_image_fit || 'contain'
            }
          })
        : (!isEditing && slideProps.image_link)
          ? React.createElement('a',
              { href: slideProps.image_link, target: '_blank', rel: 'noopener noreferrer',
                className: 'block cursor-pointer transition-transform hover:scale-[1.01]' },
              React.createElement('img', {
                src: sideImage, alt: slideProps.title || 'Slide Image',
                className: `${sideShapeClass} shadow-2xl transition-all duration-500 hover:rotate-1 hover:scale-[1.02]`,
                style: {
                  maxWidth: '100%',
                  width:  slideProps.side_image_width  ? `${slideProps.side_image_width}px`  : 'auto',
                  height: slideProps.side_image_height ? `${slideProps.side_image_height}px` : 'auto',
                  objectFit: slideProps.side_image_fit || 'contain'
                }
              })
            )
          : React.createElement('img', {
              src: sideImage, alt: slideProps.title || 'Slide Image',
              className: `${sideShapeClass} shadow-2xl transition-all duration-500 hover:rotate-1 hover:scale-[1.02]`,
              style: {
                maxWidth: '100%',
                width:  slideProps.side_image_width  ? `${slideProps.side_image_width}px`  : 'auto',
                height: slideProps.side_image_height ? `${slideProps.side_image_height}px` : 'auto',
                objectFit: slideProps.side_image_fit || 'contain'
              }
            })
    ) : null;

    // ─── TEMPLATE-SPECIFIC UI VARIANTS ───
    const isAcademy = currentTemplate?.id === 'academy-dashboard' || currentTemplate?.id === 'template_1';
    
    // Text + button block
    const textEl = isUdemy ? React.createElement(
      'div',
      {
        className: `relative z-10 flex flex-col gap-6 ${alignClass} max-w-3xl ml-auto mr-auto lg:mr-10 font-['Inter'] t2-animate-on-scroll`
      },
      React.createElement('div', { className: 'flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--t2-indigo-3)] border border-[var(--t2-gold)]/20 w-fit' },
        React.createElement('span', { className: 'w-2 h-2 rounded-full bg-[var(--t2-gold)] animate-pulse' }),
        React.createElement('span', { className: 'text-xs text-[var(--t2-canvas-2)] font-["IBM_Plex_Mono"] font-medium tracking-wide uppercase' }, 'أكاديمية رائدة')
      ),
      slideProps.title ? React.createElement('h1', {
        className: 'font-black leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[var(--t2-white)] font-["Fraunces"] drop-shadow-sm'
      }, slideProps.title.split(' ').map((word: string, i: number, arr: string[]) => {
        if (i >= arr.length - 2) return React.createElement('em', { key: i, className: 'text-[var(--t2-gold)] italic px-1 drop-shadow-[0_2px_15px_rgba(232,163,61,0.3)]' }, word + ' ');
        return word + ' ';
      })) : null,
      slideProps.subtitle ? React.createElement('p', {
        className: 'leading-relaxed text-base sm:text-lg text-[var(--t2-canvas-3)] max-w-2xl'
      }, slideProps.subtitle) : null,
      React.createElement('div', { className: 'flex flex-col sm:flex-row items-center gap-4 mt-2' },
        slideProps.button_text ? React.createElement('a', {
          href: slideProps.button_link || '#',
          className: 'px-8 py-3.5 rounded-full bg-[var(--t2-gold)] text-[var(--t2-ink)] font-bold text-sm hover:brightness-110 hover:shadow-[0_4px_20px_rgba(232,163,61,0.35)] active:-translate-y-0.5 transition-all w-full sm:w-auto text-center'
        }, slideProps.button_text) : null,
        React.createElement('a', {
          href: '#',
          className: 'px-8 py-3.5 rounded-full border-[1.5px] border-[var(--t2-canvas-3)] text-[var(--t2-canvas)] font-bold text-sm hover:bg-[var(--t2-canvas-3)] hover:text-[var(--t2-ink)] transition-all w-full sm:w-auto text-center'
        }, 'تصفح الدورات')
      ),
      React.createElement('div', { className: 'flex items-center gap-6 mt-6 pt-6 border-t border-[var(--t2-indigo-3)]/50 font-["IBM_Plex_Mono"] text-[var(--t2-canvas-3)] text-xs uppercase tracking-widest' },
        React.createElement('div', null, React.createElement('strong', { className: 'text-[var(--t2-gold)] block text-base' }, '50K+'), 'طالب نشط'),
        React.createElement('div', { className: 'w-px h-8 bg-[var(--t2-indigo-3)]' }),
        React.createElement('div', null, React.createElement('strong', { className: 'text-[var(--t2-gold)] block text-base' }, '200+'), 'دورة تدريبية')
      )
    ) : React.createElement(
      'div',
      {
        className: `relative z-10 flex flex-col gap-5 ${alignClass} ${
          isEdx ? 'max-w-4xl mx-auto text-center items-center bg-slate-900/40 backdrop-blur-md p-12 rounded-3xl border border-slate-700/50 shadow-2xl' :
          (showOverlay ? 'max-w-xl backdrop-blur-md bg-white/90 p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/40' : 'max-w-xl')
        }`
      },
      slideProps.title ? React.createElement('h1', {
        style: { color: slideProps.title_color || (isEdx ? '#f8fafc' : showOverlay ? '#1f2937' : '#ffffff') },
        className: `font-black leading-tight tracking-tight ${isEdx ? 'text-4xl sm:text-5xl lg:text-6xl drop-shadow-lg' : 'text-3xl sm:text-4xl lg:text-5xl'}`
      }, slideProps.title) : null,
      slideProps.subtitle ? React.createElement('p', {
        style: { color: slideProps.text_color || (isEdx ? '#cbd5e1' : showOverlay ? '#4b5563' : '#e2e8f0') },
        className: `leading-relaxed font-semibold ${isEdx ? 'text-lg sm:text-xl drop-shadow-md' : 'text-xs sm:text-sm lg:text-base'}`
      }, slideProps.subtitle) : null,
      slideProps.button_text ? React.createElement('a', {
        href: slideProps.button_link || '#',
        style: {
          backgroundColor: slideProps.button_color || (isEdx ? '#10b981' : '#ffffff'),
          color: slideProps.button_text_color || (isEdx ? '#ffffff' : '#1e40af')
        },
        className: `px-8 py-4 rounded-2xl font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg inline-block w-fit mt-4 ${isEdx ? 'hover:shadow-emerald-500/30 ring-1 ring-emerald-400/50' : ''}`
      }, slideProps.button_text) : null
    );

    // Full slide content wrapper — uses relative positioning so arrows can overlay it
    const slideContent = React.createElement(
      'section',
      {
        key: current,
        style: slideStyle,
        className: `relative w-full ${py} ${px} flex items-center transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'} ${
          isUdemy ? 'min-h-[600px] lg:min-h-[700px] flex-col lg:flex-row gap-12 justify-center bg-gradient-to-br from-[var(--t2-indigo)] to-[var(--t2-ink)] overflow-hidden' :
          isEdx ? 'min-h-[600px] lg:min-h-[700px] flex-col justify-center' :
          (hasSideImage ? 'min-h-[320px] sm:min-h-[420px] flex-row gap-10 justify-center' : 'min-h-[320px] sm:min-h-[420px] justify-center')
        }`
      },
      // Floating creative blobs in dynamic slider when no background image is set
      !slideProps.bg_image ? React.createElement(React.Fragment, null,
        React.createElement('div', {
          className: `absolute top-[-30%] left-[-10%] w-80 h-80 rounded-full blur-[90px] animate-pulse pointer-events-none z-0 ${isEdx ? 'bg-emerald-500/20' : 'bg-blue-500/10'}`,
          style: { animationDuration: '6s' }
        }),
        React.createElement('div', {
          className: `absolute bottom-[-30%] right-[-10%] w-96 h-96 rounded-full blur-[100px] animate-pulse pointer-events-none z-0 ${isEdx ? 'bg-indigo-500/20' : 'bg-purple-500/10'}`,
          style: { animationDuration: '8s' }
        })
      ) : null,
      // Video background player (sits behind all content)
      slideProps.bg_image && isVideoBg ? React.createElement('video', {
        src: slideProps.bg_image, autoPlay: true, loop: true, muted: true, playsInline: true,
        className: 'absolute inset-0 w-full h-full object-cover z-0'
      }) : null,
      // Subtle overlay for readability
      slideProps.bg_image ? React.createElement('div', {
        className: `absolute inset-0 z-0 ${isEdx ? 'bg-gradient-to-r from-slate-900/90 to-slate-900/60' : 'bg-slate-900/20'}`
      }) : null,
      
      // Structure blocks based on layout
      isUdemy 
        ? React.createElement(React.Fragment, null, textEl, sideMediaEl)
        : isEdx
          ? React.createElement(React.Fragment, null, textEl) // EDX uses full bleed cinematic background, side image hidden if present or used elsewhere
          : React.createElement(React.Fragment, null, 
              hasSideImage && slideProps.side_image_position !== 'right' ? sideMediaEl : null,
              textEl,
              hasSideImage && slideProps.side_image_position === 'right' ? sideMediaEl : null
            )
    );

    // Dot indicator strip
    const dotsEl = items.length > 1 ? React.createElement(
      'div',
      { className: 'absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2 pointer-events-auto' },
      items.map((_: any, i: number) => React.createElement('button', {
        key: i,
        onClick: (e: any) => { e.stopPropagation(); goTo(i); },
        className: `rounded-full transition-all duration-300 ${
          i === current ? 'bg-white w-5 h-2' : 'bg-white/40 hover:bg-white/70 w-2 h-2'
        }`
      }))
    ) : null;

    // Navigation arrow buttons
    const arrowPrev = props.show_arrows !== false && items.length > 1
      ? React.createElement('button', {
          onClick: (e: any) => { e.stopPropagation(); if (!transitioning) goTo((current - 1 + items.length) % items.length); },
          className: 'absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-slate-900/50 hover:bg-slate-900/70 text-white flex items-center justify-center shadow-lg transition-all pointer-events-auto'
        }, React.createElement(LucideIcons.ChevronRight, { className: 'w-5 h-5' }))
      : null;

    const arrowNext = props.show_arrows !== false && items.length > 1
      ? React.createElement('button', {
          onClick: (e: any) => { e.stopPropagation(); if (!transitioning) goTo((current + 1) % items.length); },
          className: 'absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-slate-900/50 hover:bg-slate-900/70 text-white flex items-center justify-center shadow-lg transition-all pointer-events-auto'
        }, React.createElement(LucideIcons.ChevronLeft, { className: 'w-5 h-5' }))
      : null;

    // Outer wrapper — `relative` with NO `overflow-hidden` so arrows are not clipped
    return React.createElement(
      'div',
      {
        className: `relative w-full select-none transition-all duration-300 rounded-sm ${
          isSelected ? (isUdemy ? 'ring-4 ring-[#a435f0] ring-inset' : 'ring-4 ring-blue-500 ring-inset')
          : isHovered ? (isUdemy ? 'ring-4 ring-purple-300 ring-inset' : 'ring-4 ring-blue-300 ring-inset')
          : ''
        }`,
        onClick: (e: any) => {
          if (isEditing) {
            e.stopPropagation();
            setSelectedNodeId(props.id);
            setSelectedItemIndex(current);
          }
        },
        onMouseEnter: () => isEditing && setHoveredItemIndex(current),
        onMouseLeave: () => isEditing && setHoveredItemIndex(null),
      },
      slideContent,
      arrowPrev,
      arrowNext,
      dotsEl
    );
  }

  // Fallback rendering when no items/slides exist
  const isVideoBg = isVideoUrl(props.bg_image);
  const isVideoSide = isVideoUrl(props.side_image);

  const showOverlay = props.show_card_overlay ?? (isUdemy ? true : false);
  const sideImage = props.side_image;
  const hasSideImage = !!sideImage;
  const sideImageShape = props.side_image_shape || 'rounded';
  const sideImageShapeClass =
    sideImageShape === 'circle' ? 'rounded-full' :
    sideImageShape === 'square' ? 'rounded-none' :
    sideImageShape === 'leaf' ? 'rounded-3xl rounded-tr-none rounded-bl-none' : 'rounded-2xl';

  const sideImageBlock = hasSideImage ? React.createElement(
    'div',
    { className: `relative z-10 flex-1 flex items-center ${props.side_image_position === 'right' ? 'justify-end' : 'justify-start'}` },
    isVideoSide
      ? React.createElement('video', {
          src: sideImage,
          controls: true,
          className: `${sideImageShapeClass} shadow-2xl`,
          style: {
            maxWidth: '100%',
            width: props.side_image_width ? `${props.side_image_width}px` : 'auto',
            height: props.side_image_height ? `${props.side_image_height}px` : 'auto',
            objectFit: props.side_image_fit || 'contain'
          }
        })
      : (!isEditing && props.image_link)
        ? React.createElement(
            'a',
            { href: props.image_link, target: '_blank', rel: 'noopener noreferrer', className: 'block cursor-pointer transition-all hover:scale-[1.01] active:scale-99' },
            React.createElement('img', {
              src: sideImage,
              alt: content.title || 'Banner Image',
              className: `${sideImageShapeClass} shadow-2xl`,
              style: {
                maxWidth: '100%',
                width: props.side_image_width ? `${props.side_image_width}px` : 'auto',
                height: props.side_image_height ? `${props.side_image_height}px` : 'auto',
                objectFit: props.side_image_fit || 'contain'
              }
            })
          )
        : React.createElement('img', {
            src: sideImage,
            alt: content.title || 'Banner Image',
            className: `${sideImageShapeClass} shadow-2xl`,
            style: {
              maxWidth: '100%',
              width: props.side_image_width ? `${props.side_image_width}px` : 'auto',
              height: props.side_image_height ? `${props.side_image_height}px` : 'auto',
              objectFit: props.side_image_fit || 'contain'
            }
          })
  ) : null;

  if (isUdemy) {
    const titleStyles = getTypographyStyle(props, 'title', { size: 'text-4xl sm:text-5xl lg:text-6xl', weight: 'font-black', color: 'var(--t2-white)', font: 'Fraunces' });
    const subtitleStyles = getTypographyStyle(props, 'subtitle', { size: 'text-base sm:text-lg', weight: 'font-normal', color: 'var(--t2-canvas-3)', font: 'Inter' });

    const textBlock = React.createElement(
      'div',
      {
        className: `relative z-10 p-8 flex flex-col gap-6 text-right max-w-3xl ml-auto mr-auto lg:mr-10 font-['Inter'] t2-animate-on-scroll`
      },
      React.createElement('div', { className: 'flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--t2-indigo-3)] border border-[var(--t2-gold)]/20 w-fit' },
        React.createElement('span', { className: 'w-2 h-2 rounded-full bg-[var(--t2-gold)] animate-pulse' }),
        React.createElement('span', { className: 'text-xs text-[var(--t2-canvas-2)] font-["IBM_Plex_Mono"] font-medium tracking-wide uppercase' }, 'أكاديمية رائدة')
      ),
      content.title ? React.createElement('h1', { 
        className: `leading-tight tracking-tight drop-shadow-sm ${titleStyles.className}`,
        style: titleStyles.style
      }, content.title.split(' ').map((word: string, i: number, arr: string[]) => {
        if (i >= arr.length - 2) return React.createElement('em', { key: i, className: 'text-[var(--t2-gold)] italic px-1 drop-shadow-[0_2px_15px_rgba(232,163,61,0.3)]' }, word + ' ');
        return word + ' ';
      })) : null,
      content.subtitle ? React.createElement('p', { 
        className: `leading-relaxed max-w-2xl ${subtitleStyles.className}`,
        style: subtitleStyles.style
      }, content.subtitle) : null,
      React.createElement('div', { className: 'flex flex-col sm:flex-row items-center gap-4 mt-2' },
        props.show_button && content.button_text
          ? React.createElement('a', {
            href: content.button_link || '#',
            className: 'px-8 py-3.5 rounded-full bg-[var(--t2-gold)] text-[var(--t2-ink)] font-bold text-sm hover:brightness-110 hover:shadow-[0_4px_20px_rgba(232,163,61,0.35)] active:-translate-y-0.5 transition-all w-full sm:w-auto text-center'
          }, content.button_text)
          : null,
        React.createElement('a', {
          href: '#',
          className: 'px-8 py-3.5 rounded-full border-[1.5px] border-[var(--t2-canvas-3)] text-[var(--t2-canvas)] font-bold text-sm hover:bg-[var(--t2-canvas-3)] hover:text-[var(--t2-ink)] transition-all w-full sm:w-auto text-center'
        }, 'تصفح الدورات')
      ),
      React.createElement('div', { className: 'flex items-center gap-6 mt-6 pt-6 border-t border-[var(--t2-indigo-3)]/50 font-["IBM_Plex_Mono"] text-[var(--t2-canvas-3)] text-xs uppercase tracking-widest' },
        React.createElement('div', null, React.createElement('strong', { className: 'text-[var(--t2-gold)] block text-base' }, '50K+'), 'طالب نشط'),
        React.createElement('div', { className: 'w-px h-8 bg-[var(--t2-indigo-3)]' }),
        React.createElement('div', null, React.createElement('strong', { className: 'text-[var(--t2-gold)] block text-base' }, '200+'), 'دورة تدريبية')
      )
    );

    const sectionBgClass = styles.backgroundColor === 'transparent' ? '' : 'bg-gradient-to-br from-[var(--t2-indigo)] to-[var(--t2-ink)]';

    return React.createElement(
      'section',
      {
        style: { ...styles },
        className: `relative overflow-hidden w-full min-h-[600px] md:min-h-[700px] flex items-center md:px-16 px-4 py-12 transition-all duration-300 ${sectionBgClass} ${
          hasSideImage ? 'flex-row gap-10' : 'justify-start'
        }`
      },
      props.bg_image && isVideoBg ? React.createElement('video', {
        src: props.bg_image,
        autoPlay: true,
        loop: true,
        muted: true,
        playsInline: true,
        className: 'absolute inset-0 w-full h-full object-cover z-0 opacity-40'
      }) : null,
      props.bg_image && !isVideoBg ? React.createElement('div', {
        style: { backgroundImage: `url(${props.bg_image})`, backgroundSize: 'cover', backgroundPosition: 'center' },
        className: 'absolute inset-0 z-0 opacity-40'
      }) : null,
      hasSideImage && props.side_image_position === 'left' ? sideImageBlock : null,
      textBlock,
      hasSideImage && props.side_image_position !== 'left' ? sideImageBlock : null
    );
  }

  const align = props.align || 'center';
  const alignClass = align === 'left' ? 'text-left items-start' : align === 'center' ? 'text-center items-center' : 'text-right items-end';

  const fallbackTextBlock = React.createElement(
    'div',
    {
      className: `relative z-10 max-w-xl flex flex-col gap-3 ${alignClass} ${
        showOverlay ? 'bg-white p-8 rounded-lg shadow-xl border border-slate-100' : ''
      }`
    },
    content.title ? React.createElement('h1', { 
      style: { color: props.title_color || (showOverlay ? '#1f2937' : '#ffffff') },
      className: 'font-black mb-4 leading-tight text-2xl sm:text-3xl lg:text-4xl' 
    }, content.title) : null,
    content.subtitle ? React.createElement('p', { 
      style: { color: props.text_color || (showOverlay ? '#6b7280' : '#f8fafc') },
      className: 'leading-relaxed text-xs sm:text-sm lg:text-base' 
    }, content.subtitle) : null,
    props.show_button && content.button_text
      ? React.createElement(
        'a',
        {
          href: content.button_link || '#',
          style: { 
            backgroundColor: props.button_color || 'var(--theme-primary)', 
            color: props.button_text_color || '#ffffff' 
          },
          className: 'px-6 py-3 rounded-xl font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md inline-block w-fit'
        },
        content.button_text
      )
      : null
  );

  const fallbackStyles = {
    ...styles,
    backgroundColor: (props.bg_image && !isVideoBg) ? undefined : props.background_color || '#ffffff',
    backgroundImage: (props.bg_image && !isVideoBg) ? `url(${props.bg_image})` : undefined,
    backgroundSize: (props.bg_image && !isVideoBg) ? 'cover' : undefined,
    backgroundPosition: (props.bg_image && !isVideoBg) ? 'center' : undefined,
  };

  return React.createElement(
    'section',
    {
      style: fallbackStyles,
      className: `relative w-full ${py} ${px} flex items-center ${
        hasSideImage ? 'flex-row gap-10' : 'justify-center'
      } transition-all duration-300 shadow-sm`
    },
    props.bg_image && isVideoBg ? React.createElement('video', {
      src: props.bg_image,
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      className: 'absolute inset-0 w-full h-full object-cover z-0'
    }) : null,
    props.bg_image ? React.createElement('div', { className: 'absolute inset-0 bg-slate-900/10 z-0' }) : null,
    hasSideImage && props.side_image_position === 'left' ? sideImageBlock : null,
    fallbackTextBlock,
    hasSideImage && props.side_image_position !== 'left' ? sideImageBlock : null
  );
});
HeroSection.displayName = 'HeroSection';

export const FeaturesSection = React.memo((props: any) => {
  const {
    isEditing,
    selectedNodeId,
    setSelectedNodeId,
    selectedItemIndex,
    setSelectedItemIndex,
    hoveredItemIndex,
    setHoveredItemIndex
  } = useBuilderStore();

  let currentTemplate: any = null;
  try {
    currentTemplate = useBuilderStore((state) => state.currentTemplate);
  } catch (e) {
    // Fallback if rendered outside the store context
  }
  const isUdemy = currentTemplate?.id === 'template_2';

  const styles = buildStyles(props);
  const content = extractContentProps(props);
  const items = props.items || [];
  const px = 'px-4 sm:px-6 lg:px-8';
  const py = 'py-8 sm:py-16';
  const cols = Number(props.grid_cols) || 3;
  const gridClass = getResponsiveGridClass(cols);

  if (isUdemy) {
    const sectionBgClass = styles.backgroundColor === 'transparent' ? '' : 'bg-[var(--t2-canvas)]';
    const titleStyles = getTypographyStyle(props, 'title', { size: 'text-3xl sm:text-4xl lg:text-5xl', weight: 'font-black', color: 'var(--t2-ink)', font: 'Fraunces' });
    const subtitleStyles = getTypographyStyle(props, 'subtitle', { size: 'text-base sm:text-lg', weight: 'font-medium', color: 'rgba(22,21,44,0.8)', font: 'Inter' });

    return React.createElement(
      'section',
      {
        style: { ...styles },
        className: `${py} ${px} w-full transition-all duration-300 text-right ${sectionBgClass} t2-animate-on-scroll`
      },
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto' },
        React.createElement(
          'div',
          { className: 'text-center mb-12' },
          content.title ? React.createElement('h2', { className: `mb-4 ${titleStyles.className}`, style: titleStyles.style }, content.title) : null,
          content.subtitle ? React.createElement('p', { className: `max-w-2xl mx-auto ${subtitleStyles.className}`, style: subtitleStyles.style }, content.subtitle) : null
        ),
        React.createElement(
          'div',
          { className: `grid gap-6 ${gridClass}` },
          items.map((item: any, idx: number) => {
            const itemProps = item.props || {};
            const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
            const isHovered = isEditing && hoveredItemIndex === idx;

            return React.createElement(
              'div',
              {
                key: idx,
                className: `relative p-8 bg-[var(--t2-white)] rounded-[20px] flex flex-col items-start gap-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(31,111,99,0.15)] group overflow-hidden cursor-pointer ${isSelected ? 'ring-2 ring-[var(--t2-gold)] ring-offset-2 ring-offset-[var(--t2-canvas)]' : isHovered ? 'ring-2 ring-[var(--t2-teal)] ring-offset-2 ring-offset-[var(--t2-canvas)]' : ''
                  }`,
                onClick: (e: any) => {
                  if (isEditing) {
                    e.stopPropagation();
                    setSelectedNodeId(props.id);
                    setSelectedItemIndex(idx);
                  }
                },
                onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
                onMouseLeave: () => isEditing && setHoveredItemIndex(null),
              },
              React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-br from-[var(--t2-teal)] to-[var(--t2-indigo)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0' }),
              itemProps.icon
                ? React.createElement(
                  'div',
                  {
                    className: 'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--t2-canvas)] text-[var(--t2-teal)] group-hover:bg-[var(--t2-gold)] group-hover:text-[var(--t2-ink)] transition-all duration-500 z-10 relative'
                  },
                  React.createElement(DynamicIcon, { name: itemProps.icon, className: 'w-6 h-6' })
                )
                : null,
              React.createElement(
                'div',
                { className: 'space-y-2 text-right flex-1 min-w-0 z-10 relative' },
                React.createElement('h3', { className: 'text-lg font-black text-[var(--t2-ink)] group-hover:text-[var(--t2-white)] transition-colors duration-500 font-["Fraunces"] break-words leading-snug' }, itemProps.title || `ميزة ${idx + 1}`),
                itemProps.description ? React.createElement('p', { className: 'text-sm text-[var(--t2-ink)]/70 group-hover:text-[var(--t2-canvas)] transition-colors duration-500 font-medium font-["Inter"] leading-relaxed break-words' }, itemProps.description) : null
              ),
              React.createElement(
                'div',
                { className: 'mt-auto w-full flex justify-end z-10 relative pt-4' },
                React.createElement(LucideIcons.ArrowLeft, { className: 'w-5 h-5 text-[var(--t2-teal)] group-hover:text-[var(--t2-gold)] transition-all duration-500 transform group-hover:rotate-45' })
              )
            );
          })
        )
      )
    );
  }

  return React.createElement(
    'section',
    { style: styles, className: `${py} ${px} w-full transition-all duration-300` },
    React.createElement(
      'div',
      { className: 'text-center mb-8' },
      content.title ? React.createElement('h2', { className: 'font-black mb-3 text-xl sm:text-2xl lg:text-3xl' }, content.title) : null,
      content.subtitle ? React.createElement('p', { className: 'text-sm opacity-75 max-w-xl mx-auto' }, content.subtitle) : null
    ),
    React.createElement(
      'div',
      { className: `grid gap-4 ${gridClass}` },
      items.map((item: any, idx: number) => {
        const itemProps = item.props || {};
        const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
        const isHovered = isEditing && hoveredItemIndex === idx;

        return React.createElement(
          'div',
          {
            key: idx,
            className: `relative p-5 bg-white border rounded-2xl flex flex-col items-start gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg overflow-hidden ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : isHovered ? 'ring-2 ring-blue-300 ring-offset-1' : 'border-slate-100 shadow-sm'
              }`,
            onClick: (e: any) => {
              if (isEditing) {
                e.stopPropagation();
                setSelectedNodeId(props.id);
                setSelectedItemIndex(idx);
              }
            },
            onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
            onMouseLeave: () => isEditing && setHoveredItemIndex(null),
          },
          // Subtle top accent line using icon color
          itemProps.icon_color
            ? React.createElement('div', {
              className: 'absolute top-0 right-0 w-full h-0.5 rounded-t-2xl',
              style: { backgroundColor: itemProps.icon_color || 'var(--theme-primary)' }
            })
            : null,
          itemProps.icon
            ? React.createElement(
              'div',
              {
                style: {
                  background: itemProps.icon_color
                    ? `linear-gradient(135deg, ${itemProps.icon_color}20, ${itemProps.icon_color}10)`
                    : 'rgba(var(--theme-primary-rgb), 0.12)',
                  color: itemProps.icon_color || 'var(--theme-primary)',
                  boxShadow: itemProps.icon_color ? `0 4px 12px ${itemProps.icon_color}25` : undefined
                },
                className: 'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0'
              },
              React.createElement(DynamicIcon, { name: itemProps.icon, className: 'w-5 h-5' })
            )
            : null,
          React.createElement(
            'div',
            { className: 'space-y-1.5 text-right w-full min-w-0' },
            React.createElement('h3', { className: 'text-sm font-black text-slate-800 break-words leading-snug' }, itemProps.title || `ميزة ${idx + 1}`),
            itemProps.description ? React.createElement('p', { className: 'text-xs text-slate-500 leading-relaxed break-words' }, itemProps.description) : null
          )
        );
      })
    )
  );
});
FeaturesSection.displayName = 'FeaturesSection';

export const FaqSection = React.memo((props: any) => {
  const {
    isEditing,
    selectedNodeId,
    setSelectedNodeId,
    selectedItemIndex,
    setSelectedItemIndex,
    hoveredItemIndex,
    setHoveredItemIndex
  } = useBuilderStore();

  let currentTemplate: any = null;
  try {
    currentTemplate = useBuilderStore((state) => state.currentTemplate);
  } catch (e) {
    // Fallback if rendered outside the store context
  }
  const isUdemy = currentTemplate?.id === 'template_2';
  const isEdx = currentTemplate?.id === 'template_3';

  const styles = buildStyles(props);
  const content = extractContentProps(props);
  const items = props.items || [];
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const px = 'px-4 sm:px-8';
  const py = 'py-8 sm:py-16';

  // ─── TEMPLATE 2 (SMART PLATFORM): GRID OF CARDS ───
  if (isUdemy) {
    return React.createElement(
      'section',
      { style: styles, className: `${py} ${px} w-full transition-all duration-300 bg-slate-50` },
      React.createElement(
        'div',
        { className: 'max-w-6xl mx-auto' },
        React.createElement(
          'div',
          { className: 'text-center mb-10' },
          content.title ? React.createElement('h2', { className: 'font-black mb-3 text-2xl lg:text-4xl text-slate-900 tracking-tight' }, content.title) : null,
          content.subtitle ? React.createElement('p', { className: 'text-base text-slate-500 font-medium' }, content.subtitle) : null
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          items.map((item: any, idx: number) => {
            const itemProps = item.props || {};
            const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
            const isHovered = isEditing && hoveredItemIndex === idx;

            return React.createElement(
              'div',
              {
                key: idx,
                className: `p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-2 ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : isHovered ? 'ring-2 ring-purple-200' : 'border-slate-200'}`,
                onClick: (e: any) => {
                  if (isEditing) {
                    e.stopPropagation();
                    setSelectedNodeId(props.id);
                    setSelectedItemIndex(idx);
                  }
                },
                onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
                onMouseLeave: () => isEditing && setHoveredItemIndex(null),
              },
              React.createElement('h3', { className: 'text-sm font-black text-slate-800 flex items-start gap-2' }, 
                React.createElement(LucideIcons.HelpCircle, { className: 'w-5 h-5 text-purple-600 flex-shrink-0' }),
                itemProps.question || `سؤال ${idx + 1}`
              ),
              React.createElement('p', { className: 'text-xs text-slate-600 leading-relaxed font-semibold' }, itemProps.answer)
            );
          })
        )
      )
    );
  }

  // ─── TEMPLATE 3 (ACADEMY): SPLIT SCREEN LAYOUT ───
  if (isEdx) {
    return React.createElement(
      'section',
      { style: styles, className: `${py} ${px} w-full transition-all duration-300` },
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start' },
        // Left side: Title
        React.createElement(
          'div',
          { className: 'w-full lg:w-1/3 lg:sticky lg:top-32 text-right' },
          content.title ? React.createElement('h2', { className: 'font-extrabold mb-4 text-3xl lg:text-4xl text-slate-900 leading-tight' }, content.title) : null,
          content.subtitle ? React.createElement('p', { className: 'text-base text-slate-600 font-medium leading-relaxed' }, content.subtitle) : null
        ),
        // Right side: Accordion list (sleek underline style)
        React.createElement(
          'div',
          { className: 'w-full lg:w-2/3 flex flex-col gap-4' },
          items.map((item: any, idx: number) => {
            const itemProps = item.props || {};
            const isOpen = openIdx === idx;
            const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
            const isHovered = isEditing && hoveredItemIndex === idx;

            return React.createElement(
              'div',
              {
                key: idx,
                className: `border-b border-slate-200 transition-all duration-300 ${isSelected ? 'bg-slate-50 ring-2 ring-emerald-500 rounded-lg p-2' : isHovered ? 'bg-slate-50 rounded-lg p-2' : 'py-2'}`,
                onClick: (e: any) => {
                  if (isEditing) {
                    e.stopPropagation();
                    setSelectedNodeId(props.id);
                    setSelectedItemIndex(idx);
                  }
                },
                onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
                onMouseLeave: () => isEditing && setHoveredItemIndex(null),
              },
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: (e: any) => {
                    if (isEditing) {
                      setOpenIdx(isOpen ? null : idx);
                    } else {
                      setOpenIdx(isOpen ? null : idx);
                    }
                  },
                  className: 'w-full py-4 flex justify-between items-center text-right group gap-4'
                },
                React.createElement('span', { className: `text-sm font-bold transition-colors ${isOpen ? 'text-emerald-700' : 'text-slate-800 group-hover:text-emerald-600'}` }, itemProps.question || `سؤال ${idx + 1}`),
                React.createElement(
                  'div',
                  { className: `w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'border-emerald-600 bg-emerald-600 text-white rotate-45' : 'border-slate-300 text-slate-500 group-hover:border-emerald-500 group-hover:text-emerald-600'}` },
                  React.createElement(LucideIcons.Plus, { className: 'w-4 h-4' })
                )
              ),
              React.createElement(
                'div',
                {
                  className: `transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[400px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`
                },
                React.createElement('p', { className: 'text-sm text-slate-600 font-semibold leading-relaxed w-11/12 pr-4 border-r-2 border-emerald-500' }, itemProps.answer)
              )
            );
          })
        )
      )
    );
  }

  // ─── TEMPLATE 1 (CLASSIC): STANDARD ACCORDION ───
  return React.createElement(
    'section',
    { style: styles, className: `${py} ${px} w-full transition-all duration-300` },
    React.createElement(
      'div',
      { className: 'text-center mb-8' },
      content.title ? React.createElement('h2', { className: 'font-black mb-3 text-xl sm:text-2xl lg:text-3xl' }, content.title) : null,
      content.subtitle ? React.createElement('p', { className: 'text-sm opacity-75 max-w-xl mx-auto' }, content.subtitle) : null
    ),
    React.createElement(
      'div',
      { className: 'w-full space-y-3 max-w-4xl mx-auto' },
      items.map((item: any, idx: number) => {
        const itemProps = item.props || {};
        const isOpen = openIdx === idx;
        const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
        const isHovered = isEditing && hoveredItemIndex === idx;

        return React.createElement(
          'div',
          {
            key: idx,
            className: `border rounded-2xl bg-white/60 backdrop-blur-sm overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : isHovered ? 'ring-2 ring-blue-300 ring-offset-1' : 'border-slate-100'}`,
            onClick: (e: any) => {
              if (isEditing) {
                e.stopPropagation();
                setSelectedNodeId(props.id);
                setSelectedItemIndex(idx);
              }
            },
            onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
            onMouseLeave: () => isEditing && setHoveredItemIndex(null),
          },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: (e: any) => {
                if (isEditing) {
                  setOpenIdx(isOpen ? null : idx);
                } else {
                  setOpenIdx(isOpen ? null : idx);
                }
              },
              className: 'w-full p-4 flex justify-between items-center text-right hover:bg-slate-50/50 transition-colors gap-3'
            },
            React.createElement('span', { className: 'text-xs font-black text-slate-800 break-words text-right flex-1' }, itemProps.question || `سؤال ${idx + 1}`),
            React.createElement(LucideIcons.ChevronDown, { className: `w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}` })
          ),
          React.createElement(
            'div',
            {
              className: `transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px] border-t border-slate-100 p-4 bg-white/30' : 'max-h-0'}`
            },
            React.createElement('p', { className: 'text-xs text-slate-500 font-bold leading-relaxed break-words' }, itemProps.answer)
          )
        );
      })
    )
  );
});
FaqSection.displayName = 'FaqSection';

export const TestimonialsSection = React.memo((props: any) => {
  const {
    isEditing,
    selectedNodeId,
    setSelectedNodeId,
    selectedItemIndex,
    setSelectedItemIndex,
    hoveredItemIndex,
    setHoveredItemIndex
  } = useBuilderStore();

  let currentTemplate: any = null;
  try {
    currentTemplate = useBuilderStore((state) => state.currentTemplate);
  } catch (e) {
    // Fallback if rendered outside the store context
  }
  const isUdemy = currentTemplate?.id === 'template_2';

  const styles = buildStyles(props);
  const content = extractContentProps(props);
  const items = props.items || [];
  const px = 'px-4 sm:px-8';
  const py = 'py-8 sm:py-16';

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const isCarousel = items.length > 3;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = container.firstElementChild?.getBoundingClientRect().width || 300;
      const offset = cardWidth + 24;
      const scrollAmount = direction === 'left' ? -offset : offset;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isUdemy) {
    const sectionBgClass = styles.backgroundColor === 'transparent' ? '' : 'bg-[var(--t2-canvas-2)]';
    const titleStyles = getTypographyStyle(props, 'title', { size: 'text-3xl sm:text-4xl lg:text-5xl', weight: 'font-black', color: 'var(--t2-ink)', font: 'Fraunces' });
    const subtitleStyles = getTypographyStyle(props, 'subtitle', { size: 'text-base sm:text-lg', weight: 'font-medium', color: 'rgba(22,21,44,0.8)', font: 'Inter' });

    return React.createElement(
      'section',
      {
        style: { ...styles },
        className: `${py} ${px} w-full transition-all duration-300 text-right ${sectionBgClass} t2-animate-on-scroll relative overflow-hidden`
      },
      React.createElement('div', { className: 'absolute inset-0 opacity-5 pointer-events-none' },
        React.createElement('div', { className: 'absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[var(--t2-indigo)] blur-3xl' })
      ),
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto relative z-10' },
        React.createElement(
          'div',
          { className: 'text-center mb-16' },
          content.title ? React.createElement('h2', { className: `mb-4 ${titleStyles.className}`, style: titleStyles.style }, content.title) : null,
          content.subtitle ? React.createElement('p', { className: `max-w-2xl mx-auto ${subtitleStyles.className}`, style: subtitleStyles.style }, content.subtitle) : null
        ),
        React.createElement('style', null, `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `),
        React.createElement(
          'div',
          {
            ref: scrollRef,
            className: isCarousel 
              ? 'flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 px-2 -mx-2 scrollbar-hide' 
              : 'grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            style: isCarousel ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : undefined
          },
          items.map((item: any, idx: number) => {
            const itemProps = item.props || {};
            const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
            const isHovered = isEditing && hoveredItemIndex === idx;

            return React.createElement(
              'div',
              {
                key: idx,
                className: `relative p-8 bg-[var(--t2-white)] rounded-[20px] flex flex-col justify-between hover:shadow-[0_15px_30px_rgba(27,26,58,0.06)] hover:-translate-y-2 transition-all duration-500 cursor-pointer ${
                  isCarousel ? 'snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]' : ''
                } ${isSelected ? 'ring-2 ring-[var(--t2-gold)] ring-offset-2 ring-offset-[var(--t2-canvas-2)]' : isHovered ? 'ring-2 ring-[var(--t2-teal)] ring-offset-2 ring-offset-[var(--t2-canvas-2)]' : ''}`,
                onClick: (e: any) => {
                  if (isEditing) {
                    e.stopPropagation();
                    setSelectedNodeId(props.id);
                    setSelectedItemIndex(idx);
                  }
                },
                onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
                onMouseLeave: () => isEditing && setHoveredItemIndex(null),
              },
              React.createElement(
                'div',
                { className: 'space-y-4' },
                React.createElement(LucideIcons.Quote, { className: 'w-10 h-10 text-[var(--t2-coral)]/40 rotate-180 mb-2' }),
                React.createElement(
                  'div',
                  { className: 'flex gap-1 text-[var(--t2-gold)]' },
                  Array.from({ length: itemProps.rating || 5 }).map((_, i) =>
                    React.createElement('span', { key: i, className: 'text-sm' }, '★')
                  )
                ),
                React.createElement(
                  'p',
                  { className: 'text-sm sm:text-base text-[var(--t2-ink)] leading-relaxed font-semibold break-words font-["Inter"]' },
                  `"${itemProps.quote || 'تعليق متميز للعميل'}"`
                )
              ),
              React.createElement(
                'div',
                { className: 'flex items-center gap-4 mt-8 pt-6 border-t border-[var(--t2-indigo-3)]/10' },
                React.createElement(
                  'div',
                  {
                    className: 'w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-base font-black text-[var(--t2-ink)] bg-[var(--t2-gold-light)] flex-shrink-0'
                  },
                  itemProps.avatar
                    ? React.createElement('img', { src: itemProps.avatar, alt: itemProps.author, className: 'w-full h-full object-cover' })
                    : React.createElement('span', { className: 'font-["Fraunces"]' }, itemProps.author?.[0] || 'U')
                ),
                React.createElement(
                  'div',
                  { className: 'text-right min-w-0 flex-1' },
                  React.createElement('h4', { className: 'text-sm font-black text-[var(--t2-ink)] truncate font-["IBM_Plex_Mono"] tracking-wide' }, itemProps.author || 'اسم العميل'),
                  itemProps.role ? React.createElement('p', { className: 'text-[11px] text-[var(--t2-teal)] font-bold mt-1 font-["IBM_Plex_Mono"] uppercase tracking-wider' }, itemProps.role) : null
                )
              )
            );
          })
        ),
        isCarousel ? React.createElement(
          'div',
          { className: 'flex justify-center gap-3 mt-10' },
          React.createElement(
            'button',
            {
              onClick: () => handleScroll('right'),
              className: 'w-12 h-12 rounded-full border border-[var(--t2-indigo-3)]/20 bg-[var(--t2-white)] flex items-center justify-center text-[var(--t2-ink)] hover:bg-[var(--t2-gold)] hover:border-[var(--t2-gold)] hover:text-[var(--t2-ink)] transition-all shadow-sm'
            },
            React.createElement(LucideIcons.ChevronRight, { className: 'w-6 h-6' })
          ),
          React.createElement(
            'button',
            {
              onClick: () => handleScroll('left'),
              className: 'w-12 h-12 rounded-full border border-[var(--t2-indigo-3)]/20 bg-[var(--t2-white)] flex items-center justify-center text-[var(--t2-ink)] hover:bg-[var(--t2-gold)] hover:border-[var(--t2-gold)] hover:text-[var(--t2-ink)] transition-all shadow-sm'
            },
            React.createElement(LucideIcons.ChevronLeft, { className: 'w-6 h-6' })
          )
        ) : null
      )
    );
  }

  return React.createElement(
    'section',
    { style: styles, className: `${py} ${px} w-full transition-all duration-300` },
    React.createElement(
      'div',
      { className: 'text-center mb-8' },
      content.title ? React.createElement('h2', { className: 'font-black mb-3 text-xl sm:text-2xl lg:text-3xl' }, content.title) : null,
      content.subtitle ? React.createElement('p', { className: 'text-sm opacity-75 max-w-xl mx-auto' }, content.subtitle) : null
    ),
    React.createElement('style', null, `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `),
    React.createElement(
      'div',
      {
        ref: scrollRef,
        className: isCarousel 
          ? 'flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 px-2 -mx-2 scrollbar-hide' 
          : 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        style: isCarousel ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : undefined
      },
      items.map((item: any, idx: number) => {
        const itemProps = item.props || {};
        const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
        const isHovered = isEditing && hoveredItemIndex === idx;

        return React.createElement(
          'div',
          {
            key: idx,
            className: `relative p-6 bg-white border rounded-2xl flex flex-col justify-between shadow-sm transition-all duration-300 overflow-hidden ${
              isCarousel ? 'snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]' : ''
            } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : isHovered ? 'ring-2 ring-blue-300 ring-offset-1' : 'border-slate-100 hover:shadow-lg hover:-translate-y-1'}`,
            onClick: (e: any) => {
              if (isEditing) {
                e.stopPropagation();
                setSelectedNodeId(props.id);
                setSelectedItemIndex(idx);
              }
            },
            onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
            onMouseLeave: () => isEditing && setHoveredItemIndex(null),
          },
          // Decorative large quote mark
          React.createElement(
            'div',
            { className: 'absolute top-3 left-4 text-7xl font-black leading-none select-none pointer-events-none', style: { color: 'rgba(var(--theme-primary-rgb), 0.06)', fontFamily: 'Georgia, serif' } },
            '\u201C'
          ),
          React.createElement(
            'div',
            { className: 'space-y-3 relative z-10' },
            React.createElement(
              'div',
              { className: 'flex gap-0.5' },
              Array.from({ length: itemProps.rating || 5 }).map((_, i) =>
                React.createElement(LucideIcons.Star, { key: i, className: 'w-3.5 h-3.5 fill-amber-400 text-amber-400' })
              )
            ),
            React.createElement('p', { className: 'text-xs text-slate-600 leading-relaxed break-words font-medium' }, itemProps.quote || 'تعليق متميز للعميل')
          ),
          React.createElement(
            'div',
            { className: 'flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 relative z-10' },
            React.createElement(
              'div',
              {
                className: `${(props.avatar_shape || 'circle') === 'rounded' ? 'rounded-xl' :
                    (props.avatar_shape || 'circle') === 'square' ? 'rounded-none' :
                      (props.avatar_shape || 'circle') === 'leaf' ? 'rounded-3xl rounded-tr-none rounded-bl-none' : 'rounded-full'
                  } overflow-hidden flex items-center justify-center text-sm font-black text-white flex-shrink-0`,
                style: {
                  background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary, #10b981))',
                  width: `${props.avatar_size || 40}px`,
                  height: `${props.avatar_size || 40}px`
                }
              },
              itemProps.avatar
                ? React.createElement('img', { src: itemProps.avatar, alt: itemProps.author, className: 'w-full h-full object-cover' })
                : (itemProps.author?.[0] || 'U')
            ),
            React.createElement(
              'div',
              { className: 'text-right min-w-0 flex-1' },
              React.createElement('h4', { className: 'text-xs font-black text-slate-800 truncate' }, itemProps.author || 'اسم العميل'),
              itemProps.role ? React.createElement('p', { className: 'text-[10px] text-slate-400 font-semibold mt-0.5' }, itemProps.role) : null
            )
          )
        );
      })
    ),
    isCarousel ? React.createElement(
      'div',
      { className: 'flex justify-center gap-3 mt-8' },
      React.createElement(
        'button',
        {
          onClick: () => handleScroll('right'),
          className: 'w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-350 transition-colors shadow-sm'
        },
        React.createElement(LucideIcons.ChevronRight, { className: 'w-5 h-5' })
      ),
      React.createElement(
        'button',
        {
          onClick: () => handleScroll('left'),
          className: 'w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-350 transition-colors shadow-sm'
        },
        React.createElement(LucideIcons.ChevronLeft, { className: 'w-5 h-5' })
      )
    ) : null
  );
});
TestimonialsSection.displayName = 'TestimonialsSection';

export const GallerySection = React.memo((props: any) => {
  const {
    isEditing,
    selectedNodeId,
    setSelectedNodeId,
    selectedItemIndex,
    setSelectedItemIndex,
    hoveredItemIndex,
    setHoveredItemIndex
  } = useBuilderStore();

  const styles = buildStyles(props);
  const content = extractContentProps(props);
  const items = props.items || [];
  const px = 'px-4 sm:px-8 lg:px-16';
  const py = 'py-8 sm:py-16';
  const cols = Number(props.grid_cols) || 4;
  const gridClass = getResponsiveGridClass(cols);

  const aspect = props.image_aspect || 'video';
  let aspectClass = 'aspect-video';
  let customStyle: React.CSSProperties = {};
  if (aspect === 'square') {
    aspectClass = 'aspect-square';
  } else if (aspect === 'cinema') {
    aspectClass = 'aspect-[21/9]';
  } else if (aspect === 'portrait') {
    aspectClass = 'aspect-[3/4]';
  } else if (aspect === 'auto') {
    aspectClass = '';
    customStyle.height = `${props.image_custom_height || 250}px`;
  }

  const shape = props.image_shape || 'rounded';
  let shapeClass = 'rounded-xl';
  if (shape === 'circle') {
    shapeClass = 'rounded-full';
  } else if (shape === 'square') {
    shapeClass = 'rounded-none';
  } else if (shape === 'leaf') {
    shapeClass = 'rounded-3xl rounded-tr-none rounded-bl-none';
  }

  return React.createElement(
    'section',
    { style: styles, className: `${py} ${px} w-full transition-all duration-300` },
    React.createElement(
      'div',
      { className: 'text-center mb-8' },
      content.title ? React.createElement('h2', { className: 'font-black mb-3 text-xl sm:text-2xl lg:text-3xl' }, content.title) : null,
      content.subtitle ? React.createElement('p', { className: 'text-sm opacity-75 max-w-xl mx-auto' }, content.subtitle) : null
    ),
    React.createElement(
      'div',
      { className: `grid gap-3 ${gridClass}` },
      items.map((item: any, idx: number) => {
        const itemProps = item.props || {};
        const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
        const isHovered = isEditing && hoveredItemIndex === idx;

        return React.createElement(
          'div',
          {
            key: idx,
            style: customStyle,
            className: `relative ${aspectClass} ${shapeClass} overflow-hidden group shadow-sm bg-slate-100 transition-all duration-300 ${isSelected ? 'ring-4 ring-blue-500 ring-inset' : isHovered ? 'ring-4 ring-blue-300 ring-inset' : 'border border-slate-100/40'
              }`,
            onClick: (e: any) => {
              if (isEditing) {
                e.stopPropagation();
                setSelectedNodeId(props.id);
                setSelectedItemIndex(idx);
              }
            },
            onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
            onMouseLeave: () => isEditing && setHoveredItemIndex(null),
          },
          // Wrap the image element in an anchor tag if a navigation link is configured and the builder is in view mode.
          React.createElement(
            (!isEditing && itemProps.image_link) ? 'a' : 'div',
            (!isEditing && itemProps.image_link)
              ? {
                  href: itemProps.image_link,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'block w-full h-full cursor-pointer'
                }
              : { className: 'w-full h-full' },
            React.createElement('img', {
              src: itemProps.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
              alt: itemProps.caption || '',
              className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
            })
          ),
          itemProps.caption
            ? React.createElement(
              'div',
              { className: 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 pt-8 flex items-end' },
              React.createElement('p', { className: 'text-xs font-black text-white' }, itemProps.caption)
            )
            : null
        );
      })
    )
  );
});
GallerySection.displayName = 'GallerySection';

export const PricingSection = React.memo((props: any) => {
  const {
    isEditing,
    selectedNodeId,
    setSelectedNodeId,
    selectedItemIndex,
    setSelectedItemIndex,
    hoveredItemIndex,
    setHoveredItemIndex
  } = useBuilderStore();

  const styles = buildStyles(props);
  const content = extractContentProps(props);
  const items = props.items || [];
  const px = 'px-4 sm:px-8 lg:px-16';
  const py = 'py-8 sm:py-16';

  let currentTemplate: any = null;
  try {
    currentTemplate = useBuilderStore((state) => state.currentTemplate);
  } catch (e) {
    // Fallback if rendered outside the store context
  }
  const isUdemy = currentTemplate?.id === 'template_2';

  const [isYearly, setIsYearly] = React.useState(true);

  if (isUdemy) {
    const sectionBgClass = styles.backgroundColor === 'transparent' ? '' : 'bg-[var(--t2-indigo)]';
    const titleStyles = getTypographyStyle(props, 'title', { size: 'text-3xl sm:text-4xl lg:text-5xl', weight: 'font-black', color: 'var(--t2-white)', font: 'Fraunces' });
    const subtitleStyles = getTypographyStyle(props, 'subtitle', { size: 'text-base sm:text-lg', weight: 'font-medium', color: 'var(--t2-canvas-2)', font: 'Inter' });

    return React.createElement(
      'section',
      {
        style: { ...styles },
        className: `${py} ${px} w-full transition-all duration-300 text-right ${sectionBgClass} t2-animate-on-scroll`
      },
      React.createElement(
        'div',
        { className: 'max-w-5xl mx-auto' },
        React.createElement(
          'div',
          { className: 'text-center mb-12' },
          content.title ? React.createElement('h2', { className: `mb-4 ${titleStyles.className}`, style: titleStyles.style }, content.title) : null,
          content.subtitle ? React.createElement('p', { className: `max-w-2xl mx-auto ${subtitleStyles.className}`, style: subtitleStyles.style }, content.subtitle) : null
        ),
        
        // Toggle Switch
        React.createElement(
          'div',
          { className: 'flex justify-center items-center gap-4 mb-16' },
          React.createElement('span', { className: `text-sm font-bold font-["Inter"] transition-colors ${!isYearly ? 'text-[var(--t2-white)]' : 'text-[var(--t2-canvas-3)]/60'}` }, 'شهرياً'),
          React.createElement(
            'button',
            {
              className: 'w-16 h-8 rounded-full bg-[var(--t2-indigo-3)] relative transition-colors duration-300',
              onClick: () => setIsYearly(!isYearly)
            },
            React.createElement('div', {
              className: `w-6 h-6 rounded-full bg-[var(--t2-gold)] absolute top-1 transition-all duration-300 ${!isYearly ? 'right-1' : 'right-9'}`
            })
          ),
          React.createElement('span', { className: `text-sm font-bold font-["Inter"] flex items-center gap-2 transition-colors ${isYearly ? 'text-[var(--t2-white)]' : 'text-[var(--t2-canvas-3)]/60'}` }, 
            'سنوياً',
            React.createElement('span', { className: 'bg-[var(--t2-coral)] text-[var(--t2-white)] text-[10px] px-2 py-0.5 rounded-full font-["IBM_Plex_Mono"] font-bold' }, 'وفر 20%')
          )
        ),

        // Pricing Cards
        React.createElement(
          'div',
          { className: 'grid gap-8 items-center pt-4 grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' },
          items.map((item: any, idx: number) => {
            const itemProps = item.props || {};
            const isPopular = itemProps.is_popular;
            const features = itemProps.features_list ? itemProps.features_list.split('\n').filter(Boolean) : (itemProps.features || []);
            const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
            const isHovered = isEditing && hoveredItemIndex === idx;

            // Use the toggle to highlight the active plan based on isYearly
            const isActivePlan = (isYearly && isPopular) || (!isYearly && !isPopular);

            return React.createElement(
              'div',
              {
                key: idx,
                className: `flex flex-col bg-[var(--t2-indigo-2)] rounded-[24px] p-8 transition-all duration-500 relative border border-[var(--t2-indigo-3)] ${isSelected ? 'ring-2 ring-[var(--t2-gold)] ring-offset-4 ring-offset-[var(--t2-indigo)]' : isHovered ? 'ring-2 ring-[var(--t2-teal)] ring-offset-4 ring-offset-[var(--t2-indigo)]' : ''} ${isActivePlan ? 'shadow-[0_0_40px_rgba(31,111,99,0.3)] scale-105 border-[var(--t2-teal)] z-10' : 'opacity-80 scale-100 z-0'}`,
                onClick: (e: any) => {
                  if (isEditing) {
                    e.stopPropagation();
                    setSelectedNodeId(props.id);
                    setSelectedItemIndex(idx);
                  }
                },
                onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
                onMouseLeave: () => isEditing && setHoveredItemIndex(null),
              },
              isPopular
                ? React.createElement(
                  'div',
                  { className: 'absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--t2-coral)] text-[var(--t2-white)] px-4 py-1 rounded-full font-bold text-[11px] shadow-lg uppercase font-["IBM_Plex_Mono"] tracking-widest' },
                  'الأكثر شعبية'
                )
                : null,
              React.createElement(
                'div',
                { className: 'mb-8 text-right' },
                React.createElement('h3', { className: 'text-2xl font-black text-[var(--t2-white)] font-["Fraunces"] mb-2' }, itemProps.title || itemProps.plan_name || 'اسم الخطة'),
                React.createElement(
                  'div',
                  { className: 'flex items-baseline justify-start gap-2 mt-4 text-[var(--t2-gold)]' },
                  React.createElement('span', { className: 'text-5xl font-black font-["Inter"] tracking-tight' }, itemProps.price),
                  React.createElement('span', { className: 'text-sm font-bold text-[var(--t2-canvas-2)] font-["Inter"]' }, `/ ${itemProps.duration || itemProps.period || 'شهري'}`)
                )
              ),
              React.createElement(
                'ul',
                { className: 'space-y-4 mb-8 flex-grow text-right' },
                features.map((feature: string, fIdx: number) =>
                  React.createElement(
                    'li',
                    { key: fIdx, className: 'flex items-center gap-3 text-sm font-medium text-[var(--t2-white)] font-["Inter"]' },
                    React.createElement('div', { className: 'w-5 h-5 rounded-full bg-[var(--t2-teal)]/20 flex items-center justify-center flex-shrink-0' },
                      React.createElement(LucideIcons.Check, { className: 'w-3 h-3 text-[var(--t2-teal)]' })
                    ),
                    React.createElement('span', { className: 'break-words' }, feature)
                  )
                )
              ),
              React.createElement(
                'a',
                {
                  href: itemProps.button_link || '#',
                  className: 'w-full py-4 text-center text-[var(--t2-ink)] font-black text-sm rounded-full transition-all block mt-auto shadow-lg hover:shadow-xl font-["Inter"]',
                  style: { backgroundColor: 'var(--t2-gold)' }
                },
                itemProps.button_text || 'اشترك الآن'
              )
            );
          })
        )
      )
    );
  }

  return React.createElement(
    'section',
    { style: styles, className: `${py} ${px} w-full transition-all duration-300` },
    React.createElement(
      'div',
      { className: 'text-center mb-8' },
      content.title ? React.createElement('h2', { className: 'font-black mb-3 text-xl sm:text-2xl lg:text-3xl' }, content.title) : null,
      content.subtitle ? React.createElement('p', { className: 'text-sm opacity-75 max-w-xl mx-auto' }, content.subtitle) : null
    ),
    React.createElement(
      'div',
      { className: 'grid gap-5 items-stretch pt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3' },
      items.map((item: any, idx: number) => {
        const itemProps = item.props || {};
        const isPopular = itemProps.is_popular;
        const features = itemProps.features_list ? itemProps.features_list.split('\n').filter(Boolean) : (itemProps.features || []);
        const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
        const isHovered = isEditing && hoveredItemIndex === idx;

        return React.createElement(
          'div',
          {
            key: idx,
            className: `flex flex-col bg-white border rounded-3xl p-5 transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : isHovered ? 'ring-2 ring-blue-300 ring-offset-1' : (isPopular ? 'border-2 border-yellow-400 relative shadow-xl z-10' : 'border-slate-100 shadow-sm hover:shadow-md')
              }`,
            onClick: (e: any) => {
              if (isEditing) {
                e.stopPropagation();
                setSelectedNodeId(props.id);
                setSelectedItemIndex(idx);
              }
            },
            onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
            onMouseLeave: () => isEditing && setHoveredItemIndex(null),
          },
          isPopular
            ? React.createElement(
              'div',
              { className: 'absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 px-3 py-0.5 rounded-full font-black text-[9px] shadow-sm uppercase' },
              'الاكثر شعبية'
            )
            : null,
          React.createElement(
            'div',
            { className: 'mb-5 text-right' },
            React.createElement('h3', { className: 'text-sm font-black text-slate-800' }, itemProps.plan_name || itemProps.title || 'اسم الخطة'),
            React.createElement(
              'div',
              { className: 'flex items-baseline justify-start gap-1 mt-2 text-blue-600' },
              React.createElement('span', { className: 'text-2xl font-black' }, itemProps.price),
              React.createElement('span', { className: 'text-xs font-bold' }, `/ ${itemProps.period || itemProps.duration || 'شهري'}`)
            )
          ),
          React.createElement(
            'ul',
            { className: 'space-y-2 mb-6 flex-grow text-right' },
            features.map((feature: string, fIdx: number) =>
              React.createElement(
                'li',
                { key: fIdx, className: 'flex items-start gap-2 text-xs font-bold text-slate-600' },
                React.createElement(LucideIcons.Check, { className: 'w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5' }),
                React.createElement('span', { className: 'break-words' }, feature)
              )
            )
          ),
          React.createElement(
            'a',
            {
              href: itemProps.button_link || '#',
              className: 'w-full py-2.5 text-center text-white font-black text-xs rounded-xl hover:brightness-110 transition-all block mt-auto',
              style: { backgroundColor: isPopular ? '#f59e0b' : 'var(--theme-primary)' }
            },
            itemProps.button_text || 'اشترك الآن'
          )
        );
      })
    )
  );
});
PricingSection.displayName = 'PricingSection';

// ─── Categories Section ───────────────────────────────────────────────────────

export const CategoriesSection = React.memo((props: any) => {
  const {
    isEditing,
    selectedNodeId,
    setSelectedNodeId,
    selectedItemIndex,
    setSelectedItemIndex,
    hoveredItemIndex,
    setHoveredItemIndex
  } = useBuilderStore();

  let currentTemplate: any = null;
  try {
    currentTemplate = useBuilderStore((state) => state.currentTemplate);
  } catch (e) {
    // Fallback if rendered outside the store context
  }
  const isUdemy = currentTemplate?.id === 'template_2';

  const styles = buildStyles(props);
  const content = extractContentProps(props);
  const items = props.items || [];
  const px = 'px-4 sm:px-8 lg:px-16';
  const py = 'py-8 sm:py-16';
  const cols = Number(props.grid_cols) || 4;
  const gridClass = getResponsiveGridClass(cols);

  if (isUdemy) {
    return React.createElement(
      'section',
      {
        style: { ...styles, backgroundColor: props.background_color || '#ffffff', color: '#1c1d1f' },
        className: `${py} ${px} w-full transition-all duration-300 text-right`
      },
      React.createElement(
        'div',
        { className: 'max-w-6xl mx-auto' },
        React.createElement(
          'div',
          { className: 'text-right mb-8' },
          content.title ? React.createElement('h2', { className: 'font-black mb-3 text-xl sm:text-2xl lg:text-3xl text-slate-800' }, content.title) : null,
          content.subtitle ? React.createElement('p', { className: 'text-sm text-slate-500 max-w-xl font-semibold' }, content.subtitle) : null
        ),
        React.createElement(
          'div',
          { className: `grid gap-4 ${gridClass}` },
          items.map((item: any, idx: number) => {
            const p = item.props || {};
            const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
            const isHovered = isEditing && hoveredItemIndex === idx;

            return React.createElement(
              'div',
              {
                key: idx,
                className: `group relative overflow-hidden border border-slate-200 p-5 bg-[#f7f9fa] hover:bg-[#eff1f2] rounded-sm transition-all duration-300 cursor-pointer flex flex-col items-start text-right ${isSelected ? 'ring-2 ring-[#a435f0] ring-offset-2 bg-white' : isHovered ? 'ring-2 ring-purple-200' : ''
                  }`,
                onClick: (e: any) => {
                  if (isEditing) {
                    e.stopPropagation();
                    setSelectedNodeId(props.id);
                    setSelectedItemIndex(idx);
                  }
                },
                onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
                onMouseLeave: () => isEditing && setHoveredItemIndex(null),
              },
              p.icon
                ? React.createElement(
                  'div',
                  {
                    className: 'w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-white border border-slate-150 text-[#a435f0]'
                  },
                  React.createElement(DynamicIcon, { name: p.icon, className: 'w-5 h-5' })
                )
                : null,
              React.createElement(
                'div',
                { className: 'w-full flex flex-col items-start gap-1 text-right' },
                React.createElement(
                  'h3',
                  { className: 'font-bold text-slate-800 text-sm break-words leading-tight group-hover:text-purple-600 transition-colors' },
                  p.name || `فئة ${idx + 1}`
                ),
                p.count !== undefined && p.count !== ''
                  ? React.createElement(
                    'span',
                    {
                      className: 'text-[11px] text-slate-400 font-bold'
                    },
                    `${p.count} دورة تدريبية`
                  )
                  : null,
                p.description
                  ? React.createElement(
                    'p',
                    { className: 'text-[10px] text-slate-500 font-semibold break-words leading-relaxed mt-1' },
                    p.description
                  )
                  : null
              )
            );
          })
        )
      )
    );
  }

  return React.createElement(
    'section',
    { style: styles, className: `${py} ${px} w-full transition-all duration-300` },
    React.createElement(
      'div',
      { className: 'text-center mb-8' },
      content.title ? React.createElement('h2', { className: 'font-black mb-2 text-xl sm:text-2xl lg:text-3xl' }, content.title) : null,
      content.subtitle ? React.createElement('p', { className: 'text-sm opacity-70 max-w-xl mx-auto' }, content.subtitle) : null
    ),
    React.createElement(
      'div',
      { className: `grid gap-4 ${gridClass}` },
      items.map((item: any, idx: number) => {
        const p = item.props || {};
        const shape = props.card_shape || 'classic';
        let shapeClass = 'rounded-2xl';
        if (shape === 'circle') {
          shapeClass = 'rounded-full aspect-square flex flex-col justify-center items-center';
        } else if (shape === 'leaf') {
          shapeClass = 'rounded-3xl rounded-tr-none rounded-bl-none';
        } else if (shape === 'square') {
          shapeClass = 'rounded-none';
        }

        const isSelected = isEditing && selectedNodeId === props.id && selectedItemIndex === idx;
        const isHovered = isEditing && hoveredItemIndex === idx;

        return React.createElement(
          'div',
          {
            key: idx,
            className: `group relative overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-white flex flex-col items-center justify-center text-center p-6 ${shapeClass} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : isHovered ? 'ring-2 ring-blue-300 ring-offset-1' : 'border-slate-100'
              }`,
            onClick: (e: any) => {
              if (isEditing) {
                e.stopPropagation();
                setSelectedNodeId(props.id);
                setSelectedItemIndex(idx);
              }
            },
            onMouseEnter: () => isEditing && setHoveredItemIndex(idx),
            onMouseLeave: () => isEditing && setHoveredItemIndex(null),
          },
          // Hover gradient fill overlay
          React.createElement('div', {
            className: 'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            style: { background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary, #10b981))' }
          }),
          p.icon
            ? React.createElement(
              'div',
              {
                className: 'relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300',
                style: {
                  backgroundColor: 'rgba(var(--theme-primary-rgb), 0.10)',
                  color: 'var(--theme-primary)'
                }
              },
              React.createElement(DynamicIcon, { name: p.icon, className: 'w-6 h-6 group-hover:text-white transition-colors duration-300' })
            )
            : null,
          React.createElement(
            'div',
            { className: 'relative z-10 w-full flex flex-col items-center' },
            React.createElement(
              'h3',
              { className: 'font-black text-slate-800 group-hover:text-white break-words text-xs sm:text-sm transition-colors duration-300' },
              p.name || `فئة ${idx + 1}`
            ),
            p.count !== undefined && p.count !== ''
              ? React.createElement(
                'span',
                {
                  className: 'inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold mt-1.5 transition-all duration-300 group-hover:bg-white/20 group-hover:text-white',
                  style: { color: 'var(--theme-primary)', backgroundColor: 'rgba(var(--theme-primary-rgb), 0.08)' }
                },
                `${p.count} دورة`
              )
              : null,
            p.description
              ? React.createElement(
                'p',
                { className: 'text-[10px] text-slate-500 group-hover:text-white/80 font-medium mt-2 break-words leading-relaxed transition-colors duration-300' },
                p.description
              )
              : null
          )
        );
      })
    )
  );
});
CategoriesSection.displayName = 'CategoriesSection';

export const CustomHtmlSection = React.memo((props: any) => {
  const htmlContent = props.html || '';

  if (!htmlContent.trim()) {
    return React.createElement(
      'div',
      { className: 'py-12 border-2 border-dashed border-slate-200/60 rounded-3xl bg-slate-50/40 text-center text-xs text-slate-400 font-bold select-none' },
      'قم بكتابة أو لصق كود HTML المخصص في لوحة التحكم الجانبية لعرضه هنا'
    );
  }

  return React.createElement('div', {
    className: 'w-full custom-html-wrapper',
    dangerouslySetInnerHTML: { __html: htmlContent }
  });
});
CustomHtmlSection.displayName = 'CustomHtmlSection';

export const componentRegistry = {
  hero_section: HeroSection,
  features_section: FeaturesSection,
  faq_section: FaqSection,
  testimonials_section: TestimonialsSection,
  gallery_section: GallerySection,
  pricing_section: PricingSection,
  categories_section: CategoriesSection,
  custom_html: CustomHtmlSection,
  // Existing static blocks
  hero: HeroBanner,
  'hero-slider': HeroSlider,
  'kpi-cards': KpiCards,
  'course-cards': CourseCards,
  sidebar: SidebarBlock,
  navbar: NavbarBlock,
  footer: FooterBlock,
  tabs: TabsBlock,
  metrics: MetricsCards
};

// ─── Shared Section Background & Shape Fields ────────────────────────────────

const SECTION_STYLE_FIELDS = [
  {
    name: 'sectionBgType', label: 'نوع خلفية القسم', type: 'select' as const, defaultValue: 'solid', options: [
      { label: 'لون صلب', value: 'solid' },
      { label: 'تدرج (Gradient)', value: 'gradient' },
    ]
  },
  { name: 'sectionBg', label: 'لون خلفية القسم', type: 'color' as const, defaultValue: '' },
  { name: 'sectionGradientFrom', label: 'تدرج - اللون الأول', type: 'color' as const, defaultValue: '#2563eb' },
  { name: 'sectionGradientTo', label: 'تدرج - اللون الثاني', type: 'color' as const, defaultValue: '#7c3aed' },
  {
    name: 'sectionGradientDir', label: 'اتجاه التدرج', type: 'select' as const, defaultValue: 'to-br', options: [
      { label: 'يمين ← يسار', value: 'to-r' },
      { label: 'يسار ← يمين', value: 'to-l' },
      { label: 'أسفل', value: 'to-b' },
      { label: 'أعلى', value: 'to-t' },
      { label: 'قطري ↘', value: 'to-br' },
      { label: 'قطري ↗', value: 'to-tr' },
    ]
  },
  {
    name: 'sectionShape', label: 'شكل زخرفي للقسم', type: 'select' as const, defaultValue: 'none', options: [
      { label: 'بلا', value: 'none' },
      { label: 'موجة علوية', value: 'wave-top' },
      { label: 'موجة سفلية', value: 'wave-bottom' },
      { label: 'دوائر ضبابية', value: 'circle-blur' },
      { label: 'Blob', value: 'blob' },
      { label: 'نقاط شبكية', value: 'grid-dots' },
      { label: 'خطوط قطرية', value: 'diagonal-lines' },
    ]
  },
  { name: 'sectionShapeColor', label: 'لون الشكل الزخرفي', type: 'color' as const, defaultValue: '#3b82f6' },
  { name: 'sectionShapeOpacity', label: 'شفافية الشكل الزخرفي (%)', type: 'number' as const, defaultValue: 20 },
];

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryEntry> = {
  // ─── Dynamic API-Driven Sections ───────────────────────────────────────────
  'hero_section': {
    type: 'hero_section',
    name: 'هيرو ديناميكي (Hero Section)',
    category: 'content',
    icon: 'Sparkles',
    fields: [
      { name: 'title', label: 'العنوان الرئيسي', type: 'text', defaultValue: 'Welcome' },
      { name: 'subtitle', label: 'العنوان الفرعي', type: 'textarea', defaultValue: 'Build your future' },
      { name: 'show_button', label: 'عرض الزر', type: 'boolean', defaultValue: true },
      { name: 'button_text', label: 'نص الزر', type: 'text', defaultValue: 'Get Started' },
      { name: 'button_link', label: 'رابط الزر', type: 'text', defaultValue: '#' },
      { name: 'background_color', label: 'لون الخلفية', type: 'color', defaultValue: '#ffffff' },
      { name: 'text_color', label: 'لون نص الوصف', type: 'color', defaultValue: '#1f2937' },
      { name: 'title_color', label: 'لون العنوان الرئيسي', type: 'color', defaultValue: '#111827' },
      { name: 'button_color', label: 'لون الزر', type: 'color', defaultValue: '#2563eb' },
      { name: 'button_text_color', label: 'لون نص الزر', type: 'color', defaultValue: '#ffffff' },
      { name: 'font_size', label: 'حجم الخط (العنوان)', type: 'number', defaultValue: 48 },
      { name: 'font_weight', label: 'وزن الخط (العنوان)', type: 'number', defaultValue: 700 },
      { name: 'padding_top', label: 'تباعد علوي (px)', type: 'number', defaultValue: 60 },
      { name: 'padding_bottom', label: 'تباعد سفلي (px)', type: 'number', defaultValue: 60 },
      { name: 'border_radius', label: 'زاوية الحواف (px)', type: 'number', defaultValue: 12 },
      {
        name: 'align', label: 'المحاذاة', type: 'select', defaultValue: 'center', options: [
          { label: 'وسط', value: 'center' },
          { label: 'يمين', value: 'right' },
          { label: 'يسار', value: 'left' }
        ]
      },
      { name: 'slider_speed', label: 'سرعة انتقال السلايدر (بالثواني)', type: 'number', defaultValue: 4 },
      { name: 'show_arrows', label: 'عرض أسهم التنقل', type: 'boolean', defaultValue: true },
      { name: 'show_card_overlay', label: 'إظهار خلفية النص البيضاء (Box Overlay)', type: 'boolean', defaultValue: false },
      { name: 'bg_image', label: '📷 صورة/فيديو خلفية الهيرو الأساسي', type: 'image', defaultValue: '' },
      { name: 'side_image', label: '📷 صورة/فيديو جانبية (Side Media)', type: 'image', defaultValue: '' },
      {
        name: 'side_image_position', label: 'موقع الصورة الجانبية', type: 'select', defaultValue: 'left', options: [
          { label: 'يسار النص', value: 'left' },
          { label: 'يمين النص', value: 'right' }
        ]
      },
      {
        name: 'side_image_shape', label: 'شكل الصورة الجانبية', type: 'select', defaultValue: 'rounded', options: [
          { label: 'زوايا دائرية (Rounded)', value: 'rounded' },
          { label: 'دائرة (Circle)', value: 'circle' },
          { label: 'مربع (Square)', value: 'square' },
          { label: 'ورقة شجر (Leaf)', value: 'leaf' }
        ]
      },
      { name: 'side_image_width', label: 'عرض الصورة الجانبية (px)', type: 'number', defaultValue: 380 },
      { name: 'side_image_height', label: 'ارتفاع الصورة الجانبية (px)', type: 'number', defaultValue: 380 },
      {
        name: 'side_image_fit', label: 'ملاءمة الصورة الجانبية', type: 'select', defaultValue: 'contain', options: [
          { label: 'ملاءمة (Contain)', value: 'contain' },
          { label: 'تعبئة (Cover)', value: 'cover' },
          { label: 'تمطيط (Fill)', value: 'fill' }
        ]
      },
      { name: 'image_link', label: '🔗 رابط الصورة الجانبية (عند الضغط)', type: 'text', defaultValue: '' },
      ...SECTION_STYLE_FIELDS
    ],
    itemLabel: 'شريحة',
    itemFields: [
      { name: 'title', label: 'عنوان الشريحة', type: 'text', defaultValue: 'شريحة جديدة' },
      { name: 'subtitle', label: 'العنوان الفرعي', type: 'textarea', defaultValue: 'أضف وصف الشريحة هنا' },
      { name: 'button_text', label: 'نص الزر', type: 'text', defaultValue: 'اكتشف المزيد' },
      { name: 'button_link', label: 'رابط الزر', type: 'text', defaultValue: '#' },
      { name: 'bg_image', label: '📷 رفع صورة الخلفية', type: 'image', defaultValue: '' },
      { name: 'background_color', label: 'لون الخلفية', type: 'color', defaultValue: '#1e40af' },
      { name: 'button_color', label: 'لون الزر', type: 'color', defaultValue: '#ffffff' },
      {
        name: 'align', label: 'محاذاة النص', type: 'select', defaultValue: 'right', options: [
          { label: 'يمين', value: 'right' },
          { label: 'وسط', value: 'center' },
          { label: 'يسار', value: 'left' }
        ]
      },
      { name: 'show_card_overlay', label: 'إظهار خلفية النص البيضاء (Box Overlay)', type: 'boolean', defaultValue: false },
      { name: 'title_color', label: 'لون العنوان الرئيسي', type: 'color', defaultValue: '#ffffff' },
      { name: 'text_color', label: 'لون نص الوصف', type: 'color', defaultValue: '#f8fafc' },
      { name: 'button_text_color', label: 'لون نص زر التوجيه', type: 'color', defaultValue: '#1e40af' },
      { name: 'side_image', label: '📷 صورة جانبية (Side Image)', type: 'image', defaultValue: '' },
      {
        name: 'side_image_position', label: 'موقع الصورة الجانبية', type: 'select', defaultValue: 'left', options: [
          { label: 'يسار النص', value: 'left' },
          { label: 'يمين النص', value: 'right' }
        ]
      },
      {
        name: 'side_image_shape', label: 'شكل الصورة الجانبية', type: 'select', defaultValue: 'rounded', options: [
          { label: 'زوايا دائرية (Rounded)', value: 'rounded' },
          { label: 'دائرة (Circle)', value: 'circle' },
          { label: 'مربع (Square)', value: 'square' },
          { label: 'ورقة شجر (Leaf)', value: 'leaf' }
        ]
      },
      { name: 'side_image_width', label: 'عرض الصورة الجانبية (px)', type: 'number', defaultValue: 380 },
      { name: 'side_image_height', label: 'ارتفاع الصورة الجانبية (px)', type: 'number', defaultValue: 380 },
      {
        name: 'side_image_fit', label: 'ملاءمة الصورة الجانبية', type: 'select', defaultValue: 'contain', options: [
          { label: 'ملاءمة (Contain)', value: 'contain' },
          { label: 'تعبئة (Cover)', value: 'cover' },
          { label: 'تمطيط (Fill)', value: 'fill' }
        ]
      },
      { name: 'image_link', label: '🔗 رابط الصورة الجانبية (عند الضغط)', type: 'text', defaultValue: '' }
    ],
    defaultProps: {
      title: 'Welcome',
      subtitle: 'Build your future',
      show_button: true,
      button_text: 'Get Started',
      button_link: '#',
      background_color: '#ffffff',
      text_color: '#1f2937',
      button_color: '#2563eb',
      font_size: 48,
      font_weight: 700,
      padding_top: 60,
      padding_bottom: 60,
      border_radius: 12,
      align: 'center',
      slider_speed: 4,
      show_arrows: true,
      items: []
    }
  },

  'features_section': {
    type: 'features_section',
    name: 'قسم الميزات (Features Section)',
    category: 'content',
    icon: 'Grid',
    fields: [
      { name: 'title', label: 'العنوان الرئيسي', type: 'text', defaultValue: 'Our Features' },
      { name: 'subtitle', label: 'العنوان الفرعي', type: 'textarea', defaultValue: 'What makes us special' },
      { name: 'background_color', label: 'لون الخلفية', type: 'color', defaultValue: '#f8fafc' },
      { name: 'text_color', label: 'لون النص', type: 'color', defaultValue: '#1f2937' },
      { name: 'grid_cols', label: 'عدد الأعمدة', type: 'number', defaultValue: 3 },
      { name: 'padding_top', label: 'تباعد علوي (px)', type: 'number', defaultValue: 60 },
      { name: 'padding_bottom', label: 'تباعد سفلي (px)', type: 'number', defaultValue: 60 },
      ...SECTION_STYLE_FIELDS
    ],
    itemLabel: 'ميزة',
    itemFields: [
      { name: 'title', label: 'عنوان الميزة', type: 'text', defaultValue: 'Feature Title' },
      { name: 'description', label: 'الوصف', type: 'textarea', defaultValue: 'Feature description text.' },
      { name: 'icon', label: 'الأيقونة (Lucide)', type: 'icon', defaultValue: 'Star' },
      { name: 'icon_color', label: 'لون الأيقونة', type: 'color', defaultValue: '#2563eb' }
    ],
    defaultProps: {
      title: 'مميزاتنا',
      subtitle: 'ما الذي يجعلنا مميزين ومختلفين عن الآخرين',
      background_color: '#f8fafc',
      text_color: '#1f2937',
      grid_cols: 3,
      padding_top: 60,
      padding_bottom: 60,
      items: [
        { order: 1, props: { title: 'ميزة 1', description: 'وصف الميزة الأولى هنا بالتفصيل وبأسلوب شيق وجذاب للمتعلمين.', icon: 'Star', icon_color: '#2563eb' } },
        { order: 2, props: { title: 'ميزة 2', description: 'وصف الميزة الثانية هنا بالتفصيل لتوضيح القيمة المقدمة.', icon: 'Heart', icon_color: '#ef4444' } },
        { order: 3, props: { title: 'ميزة 3', description: 'وصف الميزة الثالثة بالتفصيل لبيان الفوائد والامتيازات.', icon: 'Shield', icon_color: '#10b981' } }
      ]
    }
  },

  'faq_section': {
    type: 'faq_section',
    name: 'الأسئلة الشائعة (FAQ Section)',
    category: 'content',
    icon: 'HelpCircle',
    fields: [
      { name: 'title', label: 'العنوان الرئيسي', type: 'text', defaultValue: 'Frequently Asked Questions' },
      { name: 'subtitle', label: 'العنوان الفرعي', type: 'textarea', defaultValue: 'Find answers here' },
      { name: 'background_color', label: 'لون الخلفية', type: 'color', defaultValue: '#ffffff' },
      { name: 'text_color', label: 'لون النص', type: 'color', defaultValue: '#1f2937' },
      { name: 'padding_top', label: 'تباعد علوي (px)', type: 'number', defaultValue: 60 },
      { name: 'padding_bottom', label: 'تباعد سفلي (px)', type: 'number', defaultValue: 60 },
      ...SECTION_STYLE_FIELDS
    ],
    itemLabel: 'سؤال',
    itemFields: [
      { name: 'question', label: 'السؤال', type: 'text', defaultValue: 'What is this builder?' },
      { name: 'answer', label: 'الإجابة', type: 'textarea', defaultValue: 'This is an enterprise-grade dynamic template-based page builder.' }
    ],
    defaultProps: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers here',
      background_color: '#ffffff',
      text_color: '#1f2937',
      padding_top: 60,
      padding_bottom: 60,
      items: [
        { order: 1, props: { question: 'What is this builder?', answer: 'This is an enterprise-grade dynamic template-based page builder.' } }
      ]
    }
  },

  'testimonials_section': {
    type: 'testimonials_section',
    name: 'آراء العملاء (Testimonials Section)',
    category: 'content',
    icon: 'UserCheck',
    fields: [
      { name: 'title', label: 'العنوان الرئيسي', type: 'text', defaultValue: 'Testimonials' },
      { name: 'subtitle', label: 'العنوان الفرعي', type: 'textarea', defaultValue: 'What our clients say' },
      { name: 'background_color', label: 'لون الخلفية', type: 'color', defaultValue: '#f8fafc' },
      { name: 'text_color', label: 'لون النص', type: 'color', defaultValue: '#1f2937' },
      { name: 'padding_top', label: 'تباعد علوي (px)', type: 'number', defaultValue: 60 },
      { name: 'padding_bottom', label: 'تباعد سفلي (px)', type: 'number', defaultValue: 60 },
      { name: 'avatar_size', label: 'حجم صورة العميل (px)', type: 'number', defaultValue: 40 },
      {
        name: 'avatar_shape',
        label: 'شكل صورة العميل',
        type: 'select',
        defaultValue: 'circle',
        options: [
          { label: 'دائرة (Circle)', value: 'circle' },
          { label: 'زوايا دائرية (Rounded)', value: 'rounded' },
          { label: 'مربع (Square)', value: 'square' },
          { label: 'ورقة شجر (Leaf)', value: 'leaf' }
        ]
      },
      ...SECTION_STYLE_FIELDS
    ],
    itemLabel: 'رأي',
    itemFields: [
      { name: 'quote', label: 'التعليق', type: 'textarea', defaultValue: 'Excellent service!' },
      { name: 'author', label: 'اسم العميل', type: 'text', defaultValue: 'John Doe' },
      { name: 'role', label: 'المنصب / العمل', type: 'text', defaultValue: 'CEO' },
      { name: 'rating', label: 'التقييم (1-5)', type: 'number', defaultValue: 5 },
      { name: 'avatar', label: 'رابط الصورة الرمزية (URL)', type: 'text', defaultValue: '' }
    ],
    defaultProps: {
      title: 'آراء المشتركين',
      subtitle: 'ماذا يقول طلابنا وعملاؤنا عن تجربتهم التعليمية معنا',
      background_color: '#f8fafc',
      text_color: '#1f2937',
      padding_top: 60,
      padding_bottom: 60,
      avatar_size: 40,
      avatar_shape: 'circle',
      items: [
        { order: 1, props: { quote: 'الخدمة ممتازة والدورات مفيدة جداً والتجربة التعليمية كانت رائعة وفاقت توقعاتي!', author: 'محمد أحمد', role: 'مصمم واجهات', rating: 5, avatar: '' } },
        { order: 2, props: { quote: 'المدربين متعاونين والشرح عملي وواضح وسهل التطبيق والمنهج ممتاز جداً.', author: 'سارة خالد', role: 'مطور ويب', rating: 5, avatar: '' } },
        { order: 3, props: { quote: 'أنصح الجميع بالاشتراك في الأكاديمية للحصول على شهادات قوية تدعم المستقبل المهني.', author: 'خالد عبدالله', role: 'مدير منتج', rating: 4, avatar: '' } }
      ]
    }
  },

  'gallery_section': {
    type: 'gallery_section',
    name: 'معرض الصور',
    category: 'content',
    icon: 'Image',
    fields: [
      { name: 'title', label: 'عنوان معرض الصور', type: 'text', defaultValue: 'معرض الصور' },
      { name: 'subtitle', label: 'وصف المعرض', type: 'textarea', defaultValue: 'استعرض أعمالنا ومحطاتنا المميزة' },
      { name: 'background_color', label: 'لون الخلفية', type: 'color', defaultValue: '#ffffff' },
      { name: 'text_color', label: 'لون النص', type: 'color', defaultValue: '#1f2937' },
      { name: 'grid_cols', label: 'عدد الأعمدة', type: 'number', defaultValue: 3 },
      {
        name: 'image_aspect',
        label: 'نسبة أبعاد الصورة',
        type: 'select',
        defaultValue: 'video',
        options: [
          { label: 'فيديو (16:9)', value: 'video' },
          { label: 'مربع (1:1)', value: 'square' },
          { label: 'سينمائي (21:9)', value: 'cinema' },
          { label: 'طولي (3:4)', value: 'portrait' },
          { label: 'تلقائي (ارتفاع محدد)', value: 'auto' }
        ]
      },
      {
        name: 'image_shape',
        label: 'شكل صور المعرض',
        type: 'select',
        defaultValue: 'rounded',
        options: [
          { label: 'زوايا دائرية (Rounded)', value: 'rounded' },
          { label: 'دائرة (Circle)', value: 'circle' },
          { label: 'مربع (Square)', value: 'square' },
          { label: 'ورقة شجر (Leaf)', value: 'leaf' }
        ]
      },
      { name: 'image_custom_height', label: 'ارتفاع مخصص للصور (px - للتلقائي)', type: 'number', defaultValue: 250 },
      { name: 'padding_top', label: 'تباعد علوي (px)', type: 'number', defaultValue: 60 },
      { name: 'padding_bottom', label: 'تباعد سفلي (px)', type: 'number', defaultValue: 60 },
      ...SECTION_STYLE_FIELDS
    ],
    itemLabel: 'صورة',
    itemFields: [
      { name: 'image_url', label: '📷 رفع الصورة', type: 'image', defaultValue: '' },
      { name: 'caption', label: 'وصف الصورة', type: 'text', defaultValue: '' },
      // Added clickable navigation link option for individual gallery images
      { name: 'image_link', label: '🔗 رابط توجيه الصورة عند النقر (رابط تنقل عند الضغط على الصورة)', type: 'text', defaultValue: '' }
    ],
    defaultProps: {
      title: 'معرض الصور',
      subtitle: 'استعرض أعمالنا ومحطاتنا المميزة',
      background_color: '#ffffff',
      text_color: '#1f2937',
      grid_cols: 3,
      image_aspect: 'video',
      image_shape: 'rounded',
      image_custom_height: 250,
      padding_top: 60,
      padding_bottom: 60,
      items: [
        { order: 1, props: { image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', caption: 'تصميم مواقع وتطبيقات', image_link: '' } },
        { order: 2, props: { image_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12', caption: 'ورش العمل التفاعلية', image_link: '' } },
        { order: 3, props: { image_url: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f', caption: 'لقاءات توظيف وتدريب', image_link: '' } }
      ]
    }
  },

  'pricing_section': {
    type: 'pricing_section',
    name: 'خطط الأسعار (Pricing Section)',
    category: 'content',
    icon: 'Tag',
    fields: [
      { name: 'title', label: 'العنوان الرئيسي', type: 'text', defaultValue: 'Pricing Plans' },
      { name: 'subtitle', label: 'العنوان الفرعي', type: 'textarea', defaultValue: 'Choose the best plan for you' },
      { name: 'background_color', label: 'لون الخلفية', type: 'color', defaultValue: '#ffffff' },
      { name: 'text_color', label: 'لون النص', type: 'color', defaultValue: '#1f2937' },
      { name: 'padding_top', label: 'تباعد علوي (px)', type: 'number', defaultValue: 60 },
      { name: 'padding_bottom', label: 'تباعد سفلي (px)', type: 'number', defaultValue: 60 },
      ...SECTION_STYLE_FIELDS
    ],
    itemLabel: 'خطة',
    itemFields: [
      { name: 'plan_name', label: 'اسم الخطة', type: 'text', defaultValue: 'Basic' },
      { name: 'price', label: 'السعر', type: 'text', defaultValue: '99' },
      { name: 'period', label: 'الفترة (مثال: month)', type: 'text', defaultValue: 'month' },
      { name: 'button_text', label: 'نص زر الاشتراك', type: 'text', defaultValue: 'Choose Plan' },
      { name: 'button_link', label: 'رابط زر الاشتراك', type: 'text', defaultValue: '#' },
      { name: 'features_list', label: 'الميزات (سطر لكل ميزة)', type: 'textarea', defaultValue: 'Feature 1\nFeature 2' },
      { name: 'is_popular', label: 'خطة شائعة (تمييز)', type: 'boolean', defaultValue: false }
    ],
    defaultProps: {
      title: 'خطط الأسعار',
      subtitle: 'اختر الخطة المناسبة لك وابدأ التعلم فوراً',
      background_color: '#ffffff',
      text_color: '#1f2937',
      padding_top: 60,
      padding_bottom: 60,
      items: [
        { order: 1, props: { plan_name: 'الخطة الأساسية', price: '99', period: 'شهري', button_text: 'اشترك الآن', button_link: '#', features_list: 'الوصول لـ 5 دورات\nشهادة إتمام أساسية\nدعم فني عبر البريد', is_popular: false } },
        { order: 2, props: { plan_name: 'الخطة الاحترافية', price: '199', period: 'شهري', button_text: 'اشترك الآن', button_link: '#', features_list: 'الوصول لجميع الدورات\nشهادات معتمدة بالكامل\nدعم فني مباشر 24/7\nلقاءات أسبوعية مع المدربين', is_popular: true } },
        { order: 3, props: { plan_name: 'خطة الشركات', price: '499', period: 'شهري', button_text: 'اشترك الآن', button_link: '#', features_list: 'حسابات غير محدودة للموظفين\nمسارات تعليمية مخصصة للشركة\nلوحة تحكم إدارية خاصة\nتقارير أداء دورية للمتعلمين', is_popular: false } }
      ]
    }
  },

  'categories_section': {
    type: 'categories_section',
    name: 'قسم التصنيفات',
    category: 'content',
    icon: 'LayoutGrid',
    fields: [
      { name: 'title', label: 'عنوان قسم التصنيفات', type: 'text', defaultValue: 'تصفح التصنيفات' },
      { name: 'subtitle', label: 'وصف القسم', type: 'textarea', defaultValue: 'اختر المجال الذي يناسبك وابدأ رحلتك التعليمية' },
      { name: 'background_color', label: 'لون الخلفية', type: 'color', defaultValue: '#f8fafc' },
      { name: 'text_color', label: 'لون النص', type: 'color', defaultValue: '#1f2937' },
      { name: 'grid_cols', label: 'عدد الأعمدة', type: 'number', defaultValue: 4 },
      {
        name: 'card_shape',
        label: 'شكل بطاقة التصنيف',
        type: 'select',
        defaultValue: 'classic',
        options: [
          { label: 'بطاقة مستديرة (Classic)', value: 'classic' },
          { label: 'شكل دائري (Circle)', value: 'circle' },
          { label: 'شكل ورقة شجر (Leaf)', value: 'leaf' },
          { label: 'شكل مربع (Square)', value: 'square' },
        ]
      },
      { name: 'padding_top', label: 'تباعد علوي (px)', type: 'number', defaultValue: 60 },
      { name: 'padding_bottom', label: 'تباعد سفلي (px)', type: 'number', defaultValue: 60 },
      ...SECTION_STYLE_FIELDS
    ],
    itemLabel: 'تصنيف',
    itemFields: [
      { name: 'name', label: 'اسم التصنيف', type: 'text', defaultValue: 'تصنيف جديد' },
      { name: 'icon', label: 'اختر الأيقونة', type: 'icon', defaultValue: 'Folder' },
      { name: 'count', label: 'عدد الدورات', type: 'text', defaultValue: '' },
      { name: 'description', label: 'وصف التصنيف', type: 'textarea', defaultValue: '' },
    ],
    defaultProps: {
      title: 'تصفح التصنيفات',
      subtitle: 'اختر المجال الذي يناسبك وابدأ رحلتك التعليمية',
      background_color: '#f8fafc',
      text_color: '#1f2937',
      grid_cols: 4,
      card_shape: 'classic',
      padding_top: 60,
      padding_bottom: 60,
      items: [
        { order: 1, props: { name: 'البرمجة والتطوير', icon: 'Code', count: '12', description: 'تعلم لغات البرمجة المختلفة وتطوير الويب' } },
        { order: 2, props: { name: 'التصميم الإبداعي', icon: 'Palette', count: '8', description: 'تصميم الواجهات والجرافيك وتجربة المستخدم' } },
        { order: 3, props: { name: 'إدارة الأعمال', icon: 'Briefcase', count: '15', description: 'مهارات الريادة، الإدارة والتسويق الرقمي' } },
        { order: 4, props: { name: 'الذكاء الاصطناعي', icon: 'Cpu', count: '6', description: 'تعلم الآلة، البيانات والشبكات العصبية' } }
      ]
    }
  },

  // ─── Existing Blocks ───────────────────────────────────────────────────────
  'hero': {
    type: 'hero',
    name: 'بانر هيرو (Hero Banner)',
    category: 'content',
    icon: 'Sparkles',
    fields: [
      { name: 'title', label: 'العنوان الرئيسي', type: 'text', defaultValue: 'مرحباً بك في أكاديميتك' },
      { name: 'subtitle', label: 'العنوان الفرعي', type: 'textarea', defaultValue: 'ابدأ اليوم... وخلّ مستقبلك يتغير بأسلوب عملي سهل وبسيط.' },
      { name: 'badgeText', label: 'شارة الترويسة (Badge)', type: 'text', defaultValue: 'تعلّم بذكاء' },
      { name: 'buttonText', label: 'نص الزر الأساسي', type: 'text', defaultValue: 'ابدأ الآن' },
      { name: 'buttonLink', label: 'رابط الزر', type: 'text', defaultValue: '#' },
      {
        name: 'align', label: 'محاذاة النص', type: 'select', defaultValue: 'right', options: [
          { label: 'يمين', value: 'right' },
          { label: 'وسط', value: 'center' },
          { label: 'يسار', value: 'left' }
        ]
      },
      { name: 'heroImage', label: '📷 صورة/فيديو جانبية في الهيرو', type: 'image', defaultValue: '' },
      // Added clickable navigation link option for the side image in the hero banner
      { name: 'heroImageLink', label: '🔗 رابط توجيه الصورة الجانبية عند النقر (رابط تنقل عند الضغط على الصورة الجانبية)', type: 'text', defaultValue: '' },
      {
        name: 'heroImagePosition', label: 'موقع الصورة الجانبية', type: 'select', defaultValue: 'left', options: [
          { label: 'يسار النص', value: 'left' },
          { label: 'يمين النص', value: 'right' }
        ]
      },
      { name: 'heroImageWidth', label: 'عرض الصورة الجانبية (px)', type: 'number', defaultValue: 384 },
      { name: 'heroImageHeight', label: 'ارتفاع الصورة الجانبية (px)', type: 'number', defaultValue: 384 },
      {
        name: 'heroImageShape', label: 'شكل الصورة الجانبية', type: 'select', defaultValue: 'rounded', options: [
          { label: 'زوايا دائرية (Rounded)', value: 'rounded' },
          { label: 'دائرة (Circle)', value: 'circle' },
          { label: 'مربع (Square)', value: 'square' },
          { label: 'ورقة شجر (Leaf)', value: 'leaf' }
        ]
      },
      {
        name: 'heroImageFit', label: 'ملاءمة الصورة الجانبية', type: 'select', defaultValue: 'contain', options: [
          { label: 'ملاءمة (Contain)', value: 'contain' },
          { label: 'تعبئة (Cover)', value: 'cover' },
          { label: 'تمطيط (Fill)', value: 'fill' }
        ]
      },
      { name: 'showSecondButton', label: 'إظهار زر ثانوي إضافي', type: 'boolean', defaultValue: false },
      { name: 'secondButtonText', label: 'نص الزر الثانوي', type: 'text', defaultValue: 'اعرف أكثر' },
      { name: 'titleColor', label: 'لون العنوان', type: 'color', defaultValue: '#1f2937' },
      { name: 'subtitleColor', label: 'لون العنوان الفرعي', type: 'color', defaultValue: '#6b7280' },
      { name: 'buttonColor', label: 'لون الزر الأساسي', type: 'color', defaultValue: '#2563eb' },
      { name: 'buttonTextColor', label: 'لون نص الزر', type: 'color', defaultValue: '#ffffff' },
      { name: 'secondButtonColor', label: 'لون خلفية الزر الثانوي', type: 'color', defaultValue: '#f1f5f9' },
      { name: 'backgroundColor', label: 'لون الخلفية', type: 'color', defaultValue: '#f8fafc' },
      { name: 'bgImage', label: '📷 صورة/فيديو خلفية الهيرو', type: 'image', defaultValue: '' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'مرحباً بك في أكاديميتك',
      subtitle: 'ابدأ اليوم... وخلّ مستقبلك يتغير بأسلوب عملي سهل وبسيط.',
      badgeText: 'تعلّم بذكاء',
      buttonText: 'ابدأ الآن',
      buttonLink: '#',
      align: 'right',
      titleColor: '#1f2937',
      subtitleColor: '#6b7280',
      buttonColor: '#2563eb',
      buttonTextColor: '#ffffff',
      backgroundColor: '#f8fafc',
      bgImage: '',
      heroImage: '',
      heroImageLink: '', // default empty link
      heroImagePosition: 'left',
      heroImageWidth: 384,
      heroImageHeight: 384,
      heroImageShape: 'rounded',
      heroImageFit: 'contain',
      showSecondButton: false,
      secondButtonText: 'اعرف أكثر',
      secondButtonColor: '#f1f5f9',
      secondButtonTextColor: '#1e293b',
    }
  },

  'hero-slider': {
    type: 'hero-slider',
    name: 'سلايدر الهيرو (Hero Slider)',
    category: 'content',
    icon: 'PlaySquare',
    fields: [
      { name: 'autoPlay', label: 'تشغيل تلقائي', type: 'boolean', defaultValue: true },
      { name: 'interval', label: 'مدة كل شريحة (ملي ثانية)', type: 'number', defaultValue: 4000 },
      { name: 'showDots', label: 'إظهار نقاط التنقل', type: 'boolean', defaultValue: true },
      { name: 'showArrows', label: 'إظهار أسهم التنقل', type: 'boolean', defaultValue: true },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      autoPlay: true,
      interval: 4000,
      showDots: true,
      showArrows: true,
      slides: [
        { id: '1', title: 'مرحباً بك في أكاديميتك', subtitle: 'ابدأ اليوم... وخلّ مستقبلك يتغير بأسلوب عملي سهل وبسيط.', buttonText: 'ابدأ الآن', buttonLink: '#', backgroundColor: '#1e40af', bgImage: '', buttonColor: '#ffffff', align: 'right' },
        { id: '2', title: 'دورات تدريبية احترافية', subtitle: 'تعلّم من نخبة المدربين المعتمدين بأسلوب تفاعلي شيّق.', buttonText: 'استعرض الدورات', buttonLink: '#', backgroundColor: '#065f46', bgImage: '', buttonColor: '#ffffff', align: 'center' },
        { id: '3', title: 'شهادات معتمدة دولياً', subtitle: 'احصل على شهادتك وارتقِ بمسارك المهني إلى مستوى عالمي.', buttonText: 'اعرف أكثر', buttonLink: '#', backgroundColor: '#4c1d95', bgImage: '', buttonColor: '#ffffff', align: 'right' },
      ],
    }
  },

  'kpi-cards': {
    type: 'kpi-cards',
    name: 'بطاقات المؤشرات (KPI Cards)',
    category: 'data',
    icon: 'TrendingUp',
    fields: [
      {
        name: 'gridCols', label: 'عدد الأعمدة', type: 'select', defaultValue: '4', options: [
          { label: 'عمود واحد', value: '1' },
          { label: 'عمودين', value: '2' },
          { label: '3 أعمدة', value: '3' },
          { label: '4 أعمدة', value: '4' },
          { label: '5 أعمدة', value: '5' },
          { label: '6 أعمدة', value: '6' }
        ]
      },
      { name: 'cardBg', label: 'لون خلفية البطاقة', type: 'color', defaultValue: '#ffffff' },
      { name: 'cardBorder', label: 'لون حد البطاقة', type: 'color', defaultValue: '#f1f5f9' },
      { name: 'titleColor', label: 'لون عنوان البطاقة', type: 'color', defaultValue: '#374151' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      gridCols: '4',
      cardBg: '#ffffff',
      cardBorder: '#f1f5f9',
      titleColor: '#374151',
      cards: [
        { id: '1', title: 'الطلاب النشطين', value: '1,248 طالب', change: '+12% هذا الأسبوع', isPositive: true, icon: 'Users', color: '#2563eb' },
        { id: '2', title: 'المبيعات الكلية', value: '14,850 ريال', change: '+8.4% منذ أمس', isPositive: true, icon: 'Wallet', color: '#10b981' },
        { id: '3', title: 'الدورات المنجزة', value: '312 دورة', change: '-2.1% هذا الشهر', isPositive: false, icon: 'Award', color: '#f59e0b' },
        { id: '4', title: 'ساعات المشاهدة', value: '5,280 ساعة', change: '+24% مؤخراً', isPositive: true, icon: 'Clock', color: '#8b5cf6' }
      ]
    }
  },





  'course-cards': {
    type: 'course-cards',
    name: 'بطاقات الدورات (Course Cards)',
    category: 'content',
    icon: 'GraduationCap',
    fields: [
      { name: 'title', label: 'العنوان الجانبي للقسم', type: 'text', defaultValue: 'تصفح كورس جديد الآن' },
      { name: 'limit', label: 'الحد الأقصى للدورات المعروضة', type: 'number', defaultValue: 3 },
      {
        name: 'gridCols', label: 'تخطيط شبكة العرض (أعمدة)', type: 'select', defaultValue: '3', options: [
          { label: 'عمودين', value: '2' },
          { label: '3 أعمدة', value: '3' },
          { label: '4 أعمدة', value: '4' },
          { label: '5 أعمدة', value: '5' },
          { label: '6 أعمدة', value: '6' }
        ]
      },
      { name: 'showPrice', label: 'عرض تسعير الكورسات', type: 'boolean', defaultValue: true },
      { name: 'showStudentsCount', label: 'عرض عدد الطلاب المقيدين', type: 'boolean', defaultValue: true },
      { name: 'buttonBg', label: 'لون زر التسجيل بالدورة', type: 'color', defaultValue: '#2563eb' },
      { name: 'cardBg', label: 'لون خلفية بطاقة الدورة', type: 'color', defaultValue: '#ffffff' },
      { name: 'titleColor', label: 'لون عنوان القسم', type: 'color', defaultValue: '#111827' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'تصفح كورس جديد الآن',
      limit: 3,
      gridCols: '3',
      showPrice: true,
      showStudentsCount: true,
      buttonBg: '#2563eb',
      cardBg: '#ffffff',
      titleColor: '#111827',
    }
  },

  'sidebar': {
    type: 'sidebar',
    name: 'شريط القائمة الجانبية (Sidebar)',
    category: 'navigation',
    icon: 'LayoutGrid',
    fields: [
      { name: 'title', label: 'اسم الأكاديمية بالبار', type: 'text', defaultValue: 'أكاديمية درب الذكية' },
      { name: 'logoText', label: 'حرف الشعار', type: 'text', defaultValue: 'د' },
      {
        name: 'theme', label: 'نمط المظهر الجانبي', type: 'select', defaultValue: 'light', options: [
          { label: 'فاتح (Light)', value: 'light' },
          { label: 'داكن (Dark)', value: 'dark' }
        ]
      },
      { name: 'accentColor', label: 'اللون التنشيطي (Accent)', type: 'color', defaultValue: '#2563eb' },
      { name: 'bgColor', label: 'لون خلفية الشريط الجانبي', type: 'color', defaultValue: '#ffffff' },
      { name: 'textColor', label: 'لون نص القائمة', type: 'color', defaultValue: '#374151' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'أكاديمية درب الذكية',
      logoText: 'د',
      theme: 'light',
      accentColor: '#2563eb',
      bgColor: '#ffffff',
      textColor: '#374151',
    }
  },

  'navbar': {
    type: 'navbar',
    name: 'شريط الترويسة العلوي (Navbar)',
    category: 'navigation',
    icon: 'Globe',
    fields: [
      { name: 'title', label: 'العنوان / لوجو الترويسة', type: 'text', defaultValue: 'بوابة التعلم' },
      { name: 'logoUrl', label: 'صورة الشعار (Logo Image)', type: 'image', defaultValue: '' },
      { name: 'showSearch', label: 'تفعيل خانة البحث السريع', type: 'boolean', defaultValue: true },
      { name: 'showProfile', label: 'عرض أيقونة حساب المستخدم', type: 'boolean', defaultValue: true },
      { name: 'bgColor', label: 'لون الخلفية', type: 'color', defaultValue: '#ffffff' },
      { name: 'borderColor', label: 'لون الحد السفلي', type: 'color', defaultValue: '#e2e8f0' },
      { name: 'titleColor', label: 'لون عنوان الترويسة', type: 'color', defaultValue: '#111827' },
      { name: 'iconColor', label: 'لون الأيقونات', type: 'color', defaultValue: '#6b7280' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'بوابة التعلم',
      logoUrl: '',
      showSearch: true,
      showProfile: true,
      bgColor: '#ffffff',
      borderColor: '#e2e8f0',
      titleColor: '#111827',
      iconColor: '#6b7280',
      isLandingPage: false,
      links: [
        { label: 'الرئيسية', href: '#hero-t1' },
        { label: 'نبذة عني', href: '#about-t1' },
        { label: 'الدورات', href: '#courses-t1' },
        { label: 'أعمالي', href: '#gallery-t1' },
        { label: 'آراء الطلاب', href: '#testimonials-t1' }
      ],
      buttonText: 'التسجيل',
      buttonLink: '#',
      showButton: true,
    }
  },

  'tabs': {
    type: 'tabs',
    name: 'أزرار التبويب (Tabs Switcher)',
    category: 'navigation',
    icon: 'ChevronLeft',
    fields: [
      { name: 'activeTabColor', label: 'لون التبويب المفعل', type: 'color', defaultValue: '#2563eb' },
      { name: 'tabBg', label: 'لون خلفية التبويبات', type: 'color', defaultValue: '#f8fafc' },
      { name: 'tabTextColor', label: 'لون نص التبويبات', type: 'color', defaultValue: '#6b7280' },
      {
        name: 'alignment', label: 'المحاذاة الأفقية للتبويبات', type: 'select', defaultValue: 'right', options: [
          { label: 'يمين', value: 'right' },
          { label: 'وسط', value: 'center' },
          { label: 'يسار', value: 'left' }
        ]
      },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      activeTabColor: '#2563eb',
      tabBg: '#f8fafc',
      tabTextColor: '#6b7280',
      alignment: 'right',
      tabs: [
        { id: '1', label: 'الدورات المتاحة' },
        { id: '2', label: 'مسارات التعلم التفاعلية' },
        { id: '3', label: 'الشهادات المعتمدة' }
      ]
    }
  },

  'metrics': {
    type: 'metrics',
    name: 'مؤشرات الأداء المصغرة (Metrics cards)',
    category: 'data',
    icon: 'TrendingUp',
    fields: [
      { name: 'title', label: 'العنوان الجانبي للبطاقات', type: 'text', defaultValue: 'معدل التقدم العام' },
      {
        name: 'layout', label: 'شكل التخطيط', type: 'select', defaultValue: 'grid', options: [
          { label: 'شبكة (Grid)', value: 'grid' },
          { label: 'قائمة رأسية (List)', value: 'list' }
        ]
      },
      { name: 'cardBg', label: 'لون خلفية البطاقة', type: 'color', defaultValue: '#ffffff' },
      { name: 'labelColor', label: 'لون تسمية المؤشر', type: 'color', defaultValue: '#6b7280' },
      { name: 'valueColor', label: 'لون قيمة المؤشر', type: 'color', defaultValue: '#111827' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'معدل التقدم العام',
      layout: 'grid',
      cardBg: '#ffffff',
      labelColor: '#6b7280',
      valueColor: '#111827',
    }
  },

  'footer': {
    type: 'footer',
    name: 'شريط السفلي (Footer)',
    category: 'navigation',
    icon: 'Grid',
    fields: [
      { name: 'copyright', label: 'حقوق النشر والملكية', type: 'text', defaultValue: 'جميع الحقوق محفوظة' },
      { name: 'logoUrl', label: 'رابط الشعار المخصص (Logo URL)', type: 'image', defaultValue: '' },
      { name: 'logoText', label: 'حرف الشعار البديل', type: 'text', defaultValue: 'د' },
      { name: 'bgColor', label: 'لون الخلفية', type: 'color', defaultValue: '#ffffff' },
      { name: 'textColor', label: 'لون النص', type: 'color', defaultValue: '#1f2937' },
      { name: 'email', label: 'البريد الإلكتروني المخصص', type: 'text', defaultValue: '' },
      { name: 'phone', label: 'رقم الهاتف المخصص', type: 'text', defaultValue: '' },
      { name: 'address', label: 'العنوان المخصص', type: 'text', defaultValue: '' },
      { name: 'facebookUrl', label: 'رابط فيسبوك المخصص', type: 'text', defaultValue: '' },
      { name: 'instagramUrl', label: 'رابط إنستغرام المخصص', type: 'text', defaultValue: '' },
      { name: 'linkedinUrl', label: 'رابط لينكد إن المخصص', type: 'text', defaultValue: '' },
      { name: 'twitterUrl', label: 'رابط تويتر المخصص', type: 'text', defaultValue: '' },
      { name: 'showLogo', label: 'عرض الشعار', type: 'boolean', defaultValue: true },
      { name: 'showSocials', label: 'عرض أيقونات التواصل الاجتماعي', type: 'boolean', defaultValue: true },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      copyright: 'جميع الحقوق محفوظة',
      logoUrl: '',
      logoText: 'د',
      bgColor: '#ffffff',
      textColor: '#1f2937',
      email: '',
      phone: '',
      address: '',
      facebookUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      showLogo: true,
      showSocials: true
    }
  },

  'custom_html': {
    type: 'custom_html',
    name: 'قسم HTML مخصص (Custom HTML)',
    category: 'content',
    icon: 'Code',
    fields: [
      { name: 'html', label: 'كود HTML المخصص', type: 'textarea', defaultValue: '<div class="p-6 text-center bg-blue-50 text-blue-600 font-bold rounded-2xl">كود HTML مخصص</div>' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      html: '<div class="p-6 text-center bg-blue-50 text-blue-600 font-bold rounded-2xl">كود HTML مخصص</div>'
    }
  }
};
