'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as Lucide from 'lucide-react';
import { getIconComponent } from '@/lib/iconMap';
import { BuilderNode } from '../../interfaces';
import { useBuilderStore } from '../../store/builderStore';
import SectionShapeOverlay, { ShapeType } from '../../components/SectionShapeOverlay';
import { getCourses } from '@/services/courses';
import { getStudentCourses } from '@/services/student-courses';

interface TemplateProps {
  sections: BuilderNode[];
}

const isValidField = (val: any) => {
  if (!val || typeof val !== 'string') return false;
  const t = val.trim();
  if (t.length > 30 && /^[A-Za-z0-9+/=\s]+$/.test(t)) return false;
  return true;
};

function useCountUp(target: number, duration: number, start: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function DynamicLucideIcon({ name, className, size = 20, color }: { name: string; className?: string; size?: number; color?: string }) {
  const IconComponent = getIconComponent(name);
  return <IconComponent className={className} size={size} style={{ color }} />;
}

function KPIValue({ rawValue, color }: { rawValue: string; color?: string }) {
  const cleanNum = parseInt(rawValue.replace(/[^0-9]/g, ''));
  const isSimpleNumber = /^[+]?[0-9]+[M%+]?$/.test(rawValue.trim());
  const { ref, inView } = useInView(0.3);
  const count = useCountUp(isNaN(cleanNum) ? 0 : cleanNum, 1800, inView);

  if (isNaN(cleanNum) || !isSimpleNumber) {
    return <span className="lst-stat-number" style={{ color }}>{rawValue}</span>;
  }

  const suffix = rawValue.replace(/[0-9]/g, '');
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      <span className="lst-stat-number" style={{ color }}>
        {count.toLocaleString()}{suffix}
      </span>
    </div>
  );
}

function ProgressRing({ percent, inView }: { percent: number; inView: boolean }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setOffset(circ * (1 - percent / 100)), 200);
      return () => clearTimeout(t);
    }
  }, [inView, circ, percent]);
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="18" cy="18" r={r} fill="none" stroke="#DAE7F1" strokeWidth="3" />
      <circle
        cx="18" cy="18" r={r} fill="none"
        stroke="#2FA8E0" strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

function CourseCard({ tag, title, duration, university, progress, image, href, isEditing }: {
  tag: string; title: string; duration: string; university: string; progress: number; image?: string; href?: string; isEditing?: boolean;
}) {
  const { ref, inView } = useInView(0.2);
  const thumbStyle = image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
  
  const card = (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="lst-course-card group hover:-translate-y-1 transition-all duration-300">
      <div className="lst-course-thumb" style={thumbStyle}>
        {!image && <span className="lst-course-tag">{tag}</span>}
        {image && <span className="lst-course-tag" style={{ position: 'absolute', bottom: 10, right: 10 }}>{tag}</span>}
      </div>
      <div className="lst-course-body">
        <h3 className="lst-course-title group-hover:text-purple-600 transition-colors">{title}</h3>
        <div className="lst-course-footer">
          <div className="lst-course-meta">
            <span>{duration}</span>
            <span className="lst-dot">·</span>
            <span>{university}</span>
          </div>
          <ProgressRing percent={progress} inView={inView} />
        </div>
      </div>
    </div>
  );

  if (!isEditing && href) {
    return <Link href={href} className="block text-inherit no-underline">{card}</Link>;
  }

  return card;
}

const BarChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const PenNibIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const BullseyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`lst-reveal ${inView ? 'lst-revealed' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

function SectionWrapper({
  node,
  children,
  className = '',
  isEditing,
  selectedNodeId,
  setSelectedNodeId
}: {
  node: BuilderNode;
  children: React.ReactNode;
  className?: string;
  isEditing: boolean;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}) {
  const p = node.props || {};
  const bgType = p.sectionBgType || 'solid';
  const nodeId = node.id;
  const isSelected = selectedNodeId === nodeId;

  let style: React.CSSProperties = {};

  // Custom Padding spacing
  const pTop = p.padding_top ?? p.paddingTop ?? 90;
  const pBottom = p.padding_bottom ?? p.paddingBottom ?? 90;
  style.paddingTop = `${pTop}px`;
  style.paddingBottom = `${pBottom}px`;

  // Solid, Gradient, or Image background styling
  if (bgType === 'solid' && p.sectionBg) {
    style.backgroundColor = p.sectionBg;
  } else if (bgType === 'gradient' && p.sectionGradientFrom && p.sectionGradientTo) {
    const dirMap: Record<string, string> = {
      'to-r': 'to right',
      'to-l': 'to left',
      'to-b': 'to bottom',
      'to-t': 'to top',
      'to-br': '135deg',
      'to-tr': '45deg',
    };
    const direction = dirMap[p.sectionGradientDir || 'to-br'] || '135deg';
    style.backgroundImage = `linear-gradient(${direction}, ${p.sectionGradientFrom}, ${p.sectionGradientTo})`;
  } else if (bgType === 'image' && p.sectionBgImage) {
    style.backgroundImage = `url(${p.sectionBgImage})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  }

  const wrapperClass = `${className} relative overflow-hidden transition-all duration-200 ${
    isEditing ? 'lst-editing-hover' : ''
  } ${isEditing && isSelected ? 'lst-editing-selected' : ''}`;

  return (
    <div
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation();
          setSelectedNodeId(nodeId);
        }
      }}
      className={wrapperClass}
      style={style}
    >
      {/* Background Image opacity cover overlay */}
      {bgType === 'image' && p.sectionBgImage && (
        <div
          className="absolute inset-0 bg-slate-900 pointer-events-none"
          style={{ opacity: (p.sectionBgOverlay ?? 40) / 100 }}
        />
      )}

      {/* Shapes and creative patterns */}
      {p.sectionShape && p.sectionShape !== 'none' && (
        <SectionShapeOverlay
          shapeType={p.sectionShape as ShapeType}
          shapeColor={p.sectionShapeColor || '#3b82f6'}
          shapeOpacity={p.sectionShapeOpacity ?? 20}
        />
      )}

      {/* Editing section badge tag */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity z-50 pointer-events-none select-none">
          تعديل قسم: {node.type}
        </div>
      )}

      {children}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

.lst-root{--bg:#F3F8FC;--surface:#FFFFFF;--surface-alt:#E9F2FA;--border:#DAE7F1;--sky:#2FA8E0;--sky-deep:#1D7FB0;--coral:#FF8A6B;--text-hi:#10263B;--text-lo:#5B7A93;--deep-from:#123A57;--deep-to:#1D7FB0;font-family:'Inter',sans-serif;background:var(--bg);color:var(--text-hi);min-height:100vh;container-type:inline-size;container-name:template-container;width:100%;box-sizing:border-box;position:relative;overflow-x:hidden}

/* Reveal */
.lst-reveal{opacity:0;transform:translateY(24px);transition:opacity .55s ease calc(var(--delay,0ms)),transform .55s ease calc(var(--delay,0ms))}
.lst-revealed{opacity:1;transform:translateY(0)}
@media(prefers-reduced-motion:reduce){.lst-reveal{opacity:1!important;transform:none!important;transition:none!important}}

/* Nav */
.lst-nav{position:sticky;top:0;left:0;right:0;z-index:1000;height:64px;display:flex;align-items:center;padding:0 40px;transition:background .3s,box-shadow .3s;width:100%;margin-bottom:-64px;box-sizing:border-box}
.lst-nav.scrolled{background:rgba(255,255,255,.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 1px 0 0 var(--border)}
.lst-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0}
.lst-logo-icon{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--sky),var(--sky-deep));display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Fraunces',serif;font-weight:700;font-size:14px}
.lst-logo-name{font-family:'Fraunces',serif;font-weight:600;font-size:20px;color:var(--text-hi);letter-spacing:-.02em}
.lst-nav-center{display:flex;align-items:center;gap:32px;margin:0 auto}
.lst-nav-link{font-size:14px;font-weight:500;color:var(--text-lo);text-decoration:none;transition:color .2s}
.lst-nav-link:hover{color:var(--text-hi)}
.lst-nav-right{display:flex;align-items:center;gap:16px;flex-shrink:0}
.lst-signin{font-size:14px;font-weight:600;color:var(--text-lo);text-decoration:none;transition:color .2s}
.lst-signin:hover{color:var(--text-hi)}

/* Buttons */
.lst-btn{display:inline-flex;align-items:center;justify-content:center;height:48px;padding:0 26px;border-radius:100px;font-size:14.5px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;border:none;text-decoration:none;transition:background .2s,transform .18s,box-shadow .2s;white-space:nowrap;line-height:1}
.lst-btn-primary{background:var(--sky);color:#fff}
.lst-btn-primary:hover{background:var(--sky-deep);transform:translateY(-1px);box-shadow:0 6px 20px rgba(47,168,224,.32)}
.lst-btn-ghost{background:#fff;color:var(--text-hi);border:1.5px solid var(--border)}
.lst-btn-ghost:hover{border-color:var(--sky);color:var(--sky-deep)}
.lst-btn-white{background:#fff;color:var(--sky-deep)}
.lst-btn-white:hover{background:#eef7fd;transform:translateY(-1px)}
.lst-btn-outline-white{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.6)}
.lst-btn-outline-white:hover{border-color:#fff;background:rgba(255,255,255,.08)}
.lst-btn-row{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap}

/* Split Hero Layout */
.lst-hero{padding:148px 40px 64px;width:100%;box-sizing:border-box}
.lst-hero-container{display:flex;align-items:center;justify-content:space-between;gap:48px;max-width:1200px;margin:0 auto;text-align:left;width:100%}
.lst-hero-content-col{flex:1.2;display:flex;flex-direction:column;align-items:flex-start}
.lst-hero-image-col{flex:0.8;display:flex;justify-content:center;position:relative}
.lst-hero-side-img{width:100%;max-width:420px;height:auto;border-radius:24px;box-shadow:0 20px 48px rgba(16,38,59,0.12);object-fit:cover;aspect-ratio:1/1;z-index:2;position:relative}
.lst-hero-image-col::before{content:'';position:absolute;width:110%;height:110%;background:radial-gradient(circle, rgba(47,168,224,0.14) 0%, transparent 70%);z-index:1;top:-5%;left:-5%}

/* Centered layout fallback when no side image */
.lst-hero.no-image .lst-hero-container{display:flex;flex-direction:column;align-items:center;text-align:center;max-width:860px;margin:0 auto}
.lst-hero.no-image .lst-hero-content-col{align-items:center;text-align:center}

.lst-eyebrow{display:inline-flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:100px;padding:6px 14px;font-size:12.5px;font-weight:600;color:var(--text-lo);margin-bottom:28px}
.lst-pulse{width:8px;height:8px;border-radius:50%;background:var(--coral);flex-shrink:0;animation:lstPulse 2s ease-in-out infinite}
@keyframes lstPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.72)}}
@media(prefers-reduced-motion:reduce){.lst-pulse{animation:none}}
.lst-h1{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(36px,5vw,54px);line-height:1.08;letter-spacing:-.025em;color:var(--text-hi);margin-bottom:22px}
.lst-h1 em{font-style:italic;color:var(--sky-deep)}
.lst-hero-sub{font-size:17px;line-height:1.65;color:var(--text-lo);max-width:520px;margin-bottom:36px}
.lst-hero-stats{display:flex;align-items:stretch;margin-top:40px}
.lst-stat-pill{padding:0 28px;text-align:center}
.lst-stat-pill+.lst-stat-pill{border-left:1px solid var(--border)}
.lst-stat-pill-num{font-family:'Fraunces',serif;font-weight:600;font-size:22px;color:var(--text-hi);display:block}
.lst-stat-pill-lab{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--text-lo);margin-top:3px;display:block}
.lst-hero-item{opacity:0;transform:translateY(20px);transition:opacity .55s ease,transform .55s ease}
.lst-hero-item.vis{opacity:1;transform:translateY(0)}
.lst-d0{transition-delay:0ms}.lst-d1{transition-delay:120ms}.lst-d2{transition-delay:240ms}.lst-d3{transition-delay:360ms}.lst-d4{transition-delay:480ms}

/* Path */
.lst-path-wrap{width:100%;max-width:900px;margin:32px auto 0;padding:0 40px}
.lst-path-inner{position:relative}
.lst-path-svg{width:100%;overflow:visible;display:block}
.lst-toast{position:absolute;background:#fff;border:1px solid var(--border);border-radius:12px;padding:8px 14px;font-size:12px;font-weight:600;color:var(--text-hi);display:flex;align-items:center;gap:7px;box-shadow:0 4px 16px rgba(47,168,224,.1);animation:lstFloat 3.5s ease-in-out infinite;white-space:nowrap;z-index:2}
.lst-toast-l{left:2%;top:50%;transform:translateY(-50%);animation-delay:0s}
.lst-toast-r{right:2%;top:50%;transform:translateY(-50%);animation-delay:1.8s}
.lst-toast-ic{width:20px;height:20px;border-radius:50%;background:var(--surface-alt);display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0}
@keyframes lstFloat{0%,100%{transform:translateY(-50%)}50%{transform:translateY(calc(-50% - 7px))}}
@media(prefers-reduced-motion:reduce){.lst-toast{animation:none}}

/* Marquee with logo images support */
.lst-marquee-band{background:var(--surface-alt);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:22px 0;overflow:hidden;margin-top:40px}
.lst-marquee-label{text-align:center;font-size:11px;font-weight:600;color:var(--text-lo);letter-spacing:.1em;text-transform:uppercase;margin-bottom:16px}
.lst-marquee-wrap{position:relative;overflow:hidden}
.lst-marquee-wrap::before,.lst-marquee-wrap::after{content:'';position:absolute;top:0;bottom:0;width:120px;z-index:2;pointer-events:none}
.lst-marquee-wrap::before{left:0;background:linear-gradient(to right,var(--surface-alt),transparent)}
.lst-marquee-wrap::after{right:0;background:linear-gradient(to left,var(--surface-alt),transparent)}
.lst-marquee-track{display:flex;gap:64px;width:max-content;animation:lstMarquee 28s linear infinite;align-items:center}
.lst-marquee-uni{font-family:'Fraunces',serif;font-weight:600;font-size:15px;color:var(--text-lo);white-space:nowrap;letter-spacing:-.01em;user-select:none}
.lst-marquee-img{height:30px;object-fit:contain;opacity:0.65;transition:opacity 0.2s;max-width:140px;filter:grayscale(100%)}
.lst-marquee-img:hover{opacity:1;filter:none}
@keyframes lstMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){.lst-marquee-track{animation-duration:80s}}

/* Sections */
.lst-section{max-width:1200px;margin:0 auto;padding-left:40px;padding-right:40px}
.lst-section-hdr{text-align:center;margin-bottom:56px}
.lst-h2{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(26px,3.5vw,38px);line-height:1.12;letter-spacing:-.02em;color:var(--text-hi);margin-bottom:14px}
.lst-section-sub{font-size:16px;color:var(--text-lo);max-width:480px;margin:0 auto;line-height:1.6}

/* Categories */
.lst-cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.lst-cat-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px 24px;transition:transform .25s ease,box-shadow .25s ease}
.lst-cat-card:hover{transform:translateY(-4px);box-shadow:0 14px 36px rgba(16,38,59,.09)}
.lst-cat-icon{width:44px;height:44px;border-radius:10px;background:var(--surface-alt);display:flex;align-items:center;justify-content:center;color:var(--sky-deep);margin-bottom:16px;flex-shrink:0}
.lst-cat-title{font-weight:600;font-size:15px;color:var(--text-hi);margin-bottom:6px}
.lst-cat-desc{font-size:13px;color:var(--text-lo);line-height:1.55;margin-bottom:14px}
.lst-cat-meta{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--sky-deep)}

/* Courses */
.lst-courses-wrap{background:var(--surface-alt)}
.lst-courses-inner{max-width:1200px;margin:0 auto;padding:0 40px}
.lst-courses-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.lst-course-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:transform .25s,box-shadow .25s}
.lst-course-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(16,38,59,.08)}
.lst-course-thumb{height:120px;background:linear-gradient(135deg,#D6EBF7,#B8D9EF);display:flex;align-items:flex-end;padding:10px;position:relative}
.lst-course-tag{background:var(--sky);color:#fff;font-size:10px;font-weight:600;padding:3px 10px;border-radius:100px;font-family:'IBM Plex Mono',monospace}
.lst-course-body{padding:16px}
.lst-course-title{font-weight:600;font-size:14px;color:var(--text-hi);line-height:1.45;margin-bottom:14px}
.lst-course-footer{display:flex;align-items:center;justify-content:space-between}
.lst-course-meta{font-size:12px;color:var(--text-lo);display:flex;align-items:center;gap:5px}
.lst-dot{color:var(--border)}

/* Steps */
.lst-steps-wrap{position:relative;display:flex;align-items:flex-start}
.lst-steps-line{position:absolute;top:22px;left:calc(16.66% + 22px);right:calc(16.66% + 22px);height:1px;background:var(--border);z-index:0}
.lst-step{flex:1;display:flex;flex-direction:column;align-items:flex-start;padding:0 28px;position:relative;z-index:1}
.lst-step-num{width:44px;height:44px;border-radius:50%;background:var(--sky);color:#fff;font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:500;display:flex;align-items:center;justify-content:center;margin-bottom:20px;flex-shrink:0}
.lst-step-title{font-weight:600;font-size:16px;color:var(--text-hi);margin-bottom:8px}
.lst-step-desc{font-size:14px;color:var(--text-lo);line-height:1.6}

/* Stats band with icons styling */
.lst-stats-band{background:var(--surface-alt);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.lst-stats-inner{max-width:960px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}
.lst-stat-item{text-align:center;padding:0 24px;border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center}
.lst-stat-item:last-child{border-right:none}
.lst-stat-icon-svg{margin-bottom:12px;opacity:0.85}
.lst-stat-number{font-family:'Fraunces',serif;font-weight:600;font-size:36px;color:var(--text-hi);letter-spacing:-.02em;display:block;line-height:1.15}
.lst-stat-label{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--text-lo);margin-top:6px;display:block;text-transform:uppercase;letter-spacing:.06em}

/* Testimonials */
.lst-testimonials{text-align:center;background:var(--bg)}
.lst-t-wrap{max-width:640px;margin:0 auto;position:relative;min-height:180px}
.lst-t-slide{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;opacity:0;transition:opacity .6s ease;pointer-events:none}
.lst-t-slide.active{position:relative;opacity:1;pointer-events:auto}
.lst-t-quote{font-family:'Fraunces',serif;font-style:italic;font-size:clamp(17px,2.2vw,21px);color:var(--text-hi);line-height:1.55;margin-bottom:24px}
.lst-t-author{font-weight:600;font-size:14px;color:var(--text-hi)}
.lst-t-role{font-size:13px;color:var(--text-lo);margin-top:3px}
.lst-t-dots{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:32px}
.lst-t-dot{width:7px;height:7px;border-radius:50%;background:var(--border);cursor:pointer;transition:background .25s,transform .25s;border:none;padding:0;outline:none}
.lst-t-dot.active{background:var(--sky);transform:scale(1.45)}
.lst-t-dot:focus-visible{outline:2px solid var(--sky);outline-offset:2px}

/* CTA */
.lst-cta-section{padding:40px 40px 80px}
.lst-cta-inner{max-width:1100px;margin:0 auto;border-radius:24px;background:linear-gradient(135deg,var(--deep-from),var(--deep-to));padding:72px 60px;text-align:center;color:#fff}
.lst-cta-h2{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(26px,3.8vw,42px);line-height:1.1;letter-spacing:-.025em;margin-bottom:16px}
.lst-cta-sub{font-size:16px;opacity:.78;max-width:440px;margin:0 auto 36px;line-height:1.6}

/* Footer */
.lst-footer{background:var(--surface);border-top:1px solid var(--border);padding:64px 40px 32px}
.lst-footer-inner{max-width:1200px;margin:0 auto}
.lst-footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:56px}
.lst-footer-brand{display:flex;flex-direction:column;gap:14px}
.lst-footer-logo{display:flex;align-items:center;gap:10px}
.lst-footer-logo-icon{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--sky),var(--sky-deep));display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Fraunces',serif;font-weight:700;font-size:14px}
.lst-footer-logo-name{font-family:'Fraunces',serif;font-weight:600;font-size:18px;color:var(--text-hi)}
.lst-footer-tagline{font-size:13.5px;color:var(--text-lo);line-height:1.6;max-width:260px}
.lst-footer-col h4{font-size:12px;font-weight:600;color:var(--text-hi);text-transform:uppercase;letter-spacing:.08em;margin:0 0 18px}
.lst-footer-col ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px}
.lst-footer-col a{font-size:13.5px;color:var(--text-lo);text-decoration:none;transition:color .2s}
.lst-footer-col a:hover{color:var(--sky-deep)}
.lst-footer-bottom{border-top:1px solid var(--border);padding-top:24px;display:flex;align-items:center;justify-content:space-between;font-size:12.5px;color:var(--text-lo)}

/* Responsive - Media Queries */
@media(max-width:900px){
  .lst-nav-center{display:none}
  .lst-hero-container{flex-direction:column;text-align:center;gap:36px}
  .lst-hero-content-col{align-items:center;text-align:center}
  .lst-hero-image-col{width:100%;max-width:360px;margin:0 auto}
  .lst-cat-grid{grid-template-columns:repeat(2,1fr)}
  .lst-courses-grid{grid-template-columns:repeat(2,1fr)}
  .lst-stats-inner{grid-template-columns:repeat(2,1fr);row-gap:24px}
  .lst-stat-item{border-right:none}
  .lst-stat-item:nth-child(odd){border-right:1px solid var(--border)}
  .lst-footer-grid{grid-template-columns:1fr 1fr}
  .lst-cta-inner{padding:48px 32px}
  .lst-steps-line{display:none}
  .lst-steps-wrap{flex-direction:column;gap:36px}
  .lst-step{padding:0}
}
@media(max-width:600px){
  .lst-hero{padding-top:110px}
  .lst-hero-container{gap:28px}
  .lst-cat-grid{grid-template-columns:1fr}
  .lst-courses-grid{grid-template-columns:1fr}
  .lst-stats-inner{grid-template-columns:1fr 1fr}
  .lst-stat-item{border-right:none !important}
  .lst-footer-grid{grid-template-columns:1fr;gap:32px}
  .lst-section{padding-left:20px;padding-right:20px}
  .lst-cta-inner{padding:40px 24px;border-radius:16px}
  .lst-hero-stats{flex-direction:column;gap:16px}
  .lst-stat-pill+.lst-stat-pill{border-left:none;border-top:1px solid var(--border);padding-top:16px}
  .lst-nav{padding:0 20px}
  .lst-footer{padding:48px 20px 24px}
  .lst-footer-bottom{flex-direction:column;gap:8px;text-align:center}
  .lst-cta-section{padding:20px 20px 56px}
  .lst-path-wrap{padding:0 20px}
  .lst-courses-inner{padding:0 20px}
}

/* Responsive - Container Queries (essential for iframe-free builder views) */
@container template-container (max-width: 900px) {
  .lst-nav-center{display:none}
  .lst-hero-container{flex-direction:column;text-align:center;gap:36px}
  .lst-hero-content-col{align-items:center;text-align:center}
  .lst-hero-image-col{width:100%;max-width:360px;margin:0 auto}
  .lst-cat-grid{grid-template-columns:repeat(2,1fr)}
  .lst-courses-grid{grid-template-columns:repeat(2,1fr)}
  .lst-stats-inner{grid-template-columns:repeat(2,1fr);row-gap:24px}
  .lst-stat-item{border-right:none}
  .lst-stat-item:nth-child(odd){border-right:1px solid var(--border)}
  .lst-footer-grid{grid-template-columns:1fr 1fr}
  .lst-cta-inner{padding:48px 32px}
  .lst-steps-line{display:none}
  .lst-steps-wrap{flex-direction:column;gap:36px}
  .lst-step{padding:0}
}
@container template-container (max-width: 600px) {
  .lst-hero{padding-top:110px}
  .lst-hero-container{gap:28px}
  .lst-cat-grid{grid-template-columns:1fr}
  .lst-courses-grid{grid-template-columns:1fr}
  .lst-stats-inner{grid-template-columns:1fr 1fr}
  .lst-stat-item{border-right:none !important}
  .lst-footer-grid{grid-template-columns:1fr;gap:32px}
  .lst-section{padding-left:20px;padding-right:20px}
  .lst-cta-inner{padding:40px 24px;border-radius:16px}
  .lst-hero-stats{flex-direction:column;gap:16px}
  .lst-stat-pill+.lst-stat-pill{border-left:none;border-top:1px solid var(--border);padding-top:16px}
  .lst-nav{padding:0 20px}
  .lst-footer{padding:48px 20px 24px}
  .lst-footer-bottom{flex-direction:column;gap:8px;text-align:center}
  .lst-cta-section{padding:20px 20px 56px}
  .lst-path-wrap{padding:0 20px}
  .lst-courses-inner{padding:0 20px}
  .lst-toast{display:none}
  .lst-h1{font-size:32px}
}

/* Edit border style overrides for builder view */
.lst-editing-selected{outline:2.5px solid #3b82f6 !important;outline-offset:2px !important;z-index:40}
.lst-editing-hover:hover{outline:1.5px dashed #60a5fa !important;outline-offset:1px !important;z-index:30}
`;

export default function PurpleTemplate({ sections }: TemplateProps) {
  const [academyName, setAcademyName] = useState('أكاديمية درب');
  const [navScrolled, setNavScrolled] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [realCourses, setRealCourses] = useState<any[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  // Read editor builder store for active status
  const { isEditing, selectedNodeId, setSelectedNodeId } = useBuilderStore();

  useEffect(() => {
    let isMounted = true;
    async function fetchCourses() {
      try {
        setIsCoursesLoading(true);
        const data = isEditing ? await getCourses() : await getStudentCourses();
        if (isMounted && data && Array.isArray(data)) {
          setRealCourses(data);
        }
      } catch (err) {
        console.error('Failed to fetch courses in PurpleTemplate:', err);
      } finally {
        if (isMounted) {
          setIsCoursesLoading(false);
        }
      }
    }
    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [isEditing]);

  useEffect(() => {
    const navSection = sections.find(s => s.type === 'navbar');
    if (navSection?.props?.title) {
      const raw = navSection.props.title as string;
      const clean = raw.replace(/\s*\|.*/, '').trim();
      if (clean && isValidField(clean)) setAcademyName(clean);
    }
    try {
      const cached = localStorage.getItem('darab_academy_profile');
      if (cached) {
        const p = JSON.parse(cached);
        if (p?.name && isValidField(p.name)) setAcademyName(p.name);
      }
    } catch (_) {}
  }, [sections]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let scrollParent: HTMLElement | Window | null = null;
    let p = el.parentElement;
    while (p) {
      const style = window.getComputedStyle(p);
      if (p.classList.contains('custom-scrollbar') || style.overflowY === 'auto' || style.overflowY === 'scroll') {
        scrollParent = p;
        break;
      }
      p = p.parentElement;
    }
    if (!scrollParent) {
      scrollParent = window;
    }

    const onScroll = () => {
      const sy = (scrollParent === window) ? window.scrollY : (scrollParent as HTMLElement).scrollTop;
      setNavScrolled(sy > 40);
    };

    onScroll();

    scrollParent.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (scrollParent) {
        scrollParent.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // --- Dynamic Content Resolvers & Fallbacks ---

  // 1. Hero
  const heroNode = sections.find(s => s.type === 'hero_section' || s.type === 'hero');
  const heroProps = heroNode?.props || {};
  const activeSlide = heroProps.items?.[0]?.props || heroProps.items?.[0] || heroProps;
  
  const heroTitle = activeSlide.title || 'رحلتك الأكاديمية نحو التميّز والاحتراف مع شهادات معتمدة دولياً';
  const heroSubtitle = activeSlide.subtitle || 'ادرس أحدث العلوم والمسارات المتقدمة تحت إشراف نخبة من كبار الأكاديميين والخبراء مع تطبيقات عملية مباشرة.';
  const heroBtnText = activeSlide.button_text || activeSlide.buttonText || 'استكشف البرامج والدورات';
  const heroBtnLink = activeSlide.button_link || activeSlide.buttonLink || '#courses';
  const heroSecBtnText = activeSlide.secondButtonText || 'تعرف على طريقة التعلم';
  const heroSecBtnLink = activeSlide.secondButtonLink || '#how-it-works';
  
  // Hero split layout dynamic side image support
  const sideImage = activeSlide.side_image || activeSlide.heroImage || activeSlide.bgImage || '';
  const sideImagePos = activeSlide.side_image_position || activeSlide.heroImagePosition || 'left';

  // 2. Marquee Partner logos (Gallery Section)
  const galleryNode = sections.find(s => s.type === 'gallery_section');
  const defaultUniversities = ['جامعة الملك سعود', 'جامعة البترول والمعادن', 'جامعة القاهرة', 'جامعة أكسفورد', 'جامعة هارفارد', 'جامعة ستانفورد', 'جامعة تورنتو'];
  
  const universities = galleryNode?.props?.items?.map((item: any) => {
    const p = item.props || item;
    const imgUrl = p.image_url || p.image || p.imageUrl || '';
    const txt = p.caption || p.title || '';
    return { imageUrl: imgUrl, text: txt };
  }).filter((x: any) => x.imageUrl || x.text) || defaultUniversities.map(u => ({ imageUrl: '', text: u }));

  // 3. Categories
  const catNode = sections.find(s => s.type === 'categories_section');
  const defaultCategories = [
    { icon: 'BarChart2', label: 'الذكاء الاصطناعي والبيانات', desc: 'تعلّم الآلة، علم البيانات، والتحليل الإحصائي', count: '١٤ دورة' },
    { icon: 'Briefcase', label: 'إدارة الأعمال والقيادة', desc: 'إستراتيجية الأعمال، التمويل، وريادة الأعمال', count: '٩ دورات' },
    { icon: 'Code', label: 'علوم الحاسب والبرمجة', desc: 'تطوير الويب، الأنظمة، وهندسة البرمجيات', count: '٢٠ دورة' },
    { icon: 'PenTool', label: 'التصميم والتجربة الرقمية', desc: 'تصميم تجربة المستخدم UI/UX، والهوية البصرية', count: '٦ دورات' },
    { icon: 'Globe', label: 'الخدمات الرقمية والنمو', desc: 'تسويق المحرك، الحملات الإعلانية، والتواصل', count: '٥ دورات' },
    { icon: 'Target', label: 'القيادة والتنفيذ المؤسسي', desc: 'إدارة المشاريع، التوجيه، وتطوير الفرق', count: '٧ دورات' },
  ];
  const categories = catNode?.props?.items?.map((item: any) => {
    const p = item.props || item;
    return {
      icon: p.icon || 'Code',
      label: p.name || p.title || 'التخصص الأكاديمي',
      desc: p.description || p.desc || 'استكشف مساراتنا التدريبية المعتمدة والتطبيقية.',
      count: p.count || '٠'
    };
  }) || defaultCategories;

  // 4. Featured Courses
  const courseNode = sections.find(s => s.type === 'course-cards');
  const courses = React.useMemo(() => {
    return realCourses.map((c: any) => ({
      id: String(c.id),
      slug: c.slug || String(c.id),
      tag: (typeof c.category === 'object' && c.category?.name) ? c.category.name : (c.category || 'دورة تدريبية'),
      title: c.title || 'دورة تدريبية',
      duration: c.duration || (c.units?.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0) ? `${c.units.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0)} درس` : 'غير محدد'),
      university: c.instructor || c.instructor_name || c.coach || 'المحاضر المعتمد',
      progress: Math.min(100, Math.max(10, parseInt(c.students_count ?? c.students ?? 0) || 50)),
      image: c.image || c.cover_image || ''
    }));
  }, [realCourses]);

  // 5. Steps (How it works)
  const featNode = sections.find(s => s.type === 'features_section');
  const defaultSteps = [
    { num: '٠١', title: 'الانضمام والتسجيل في دقائق', desc: 'تصفح البرامج والمسارات المعتمدة، وبضغطة زر ابدأ دراستك في أي وقت.' },
    { num: '٠٢', title: 'التعلم والتطبيق العملي', desc: 'وحدات دراسية مرنة ومكثفة تصاحبها تمارين ومشاريع لتطبيق مهاراتك بشكل عملي.' },
    { num: '٠٣', title: 'الحصول على شهادة معتمدة', desc: 'احصل على شهادة أكاديمية موثقة يمكنك مشاركتها في سيرتك الذاتية وحساب LinkedIn.' },
  ];
  const steps = featNode?.props?.items?.map((item: any, idx: number) => {
    const p = item.props || item;
    return {
      num: String(idx + 1).padStart(2, '0'),
      title: p.title || 'الخطوة',
      desc: p.description || p.desc || 'تفاصيل هذه المرحلة التعليمية.'
    };
  }) || defaultSteps;

  // 6. Stats band (KPI Cards)
  const kpiNode = sections.find(s => s.type === 'kpi-cards');
  const defaultStats = [
    { value: '٤٨,٠٠٠+', label: 'متعلم نشط وخريج', icon: 'Users', color: '#2FA8E0' },
    { value: '١٨0', label: 'مؤسسة وجامعة شريكة', icon: 'Award', color: '#2FA8E0' },
    { value: '٣٥٠+', label: 'برنامج ومسار أكاديمي', icon: 'BookOpen', color: '#2FA8E0' },
    { value: '١٥0', label: 'تخصص ودورة معتمدة', icon: 'Globe', color: '#2FA8E0' },
  ];
  const stats = kpiNode?.props?.cards?.map((card: any) => {
    return {
      value: card.value || '١٠٠',
      label: card.title || 'المؤشر',
      icon: card.icon || '',
      color: card.color || '#2FA8E0'
    };
  }) || defaultStats;

  // 7. Testimonials
  const testNode = sections.find(s => s.type === 'testimonials_section');
  const defaultTestimonials = [
    {
      quote: 'الدراسة هنا كانت التجربة الأفضل لي على الإطلاق. الوحدات المنظمة والشرح العملي جعلاني ألتزم وأحقق هدفي المهني.',
      author: 'المهندس عبدالله الفيصل', role: 'مطور برمجيات أول'
    },
    {
      quote: 'متابعة المحاضرين والشهادة المعتمدة أعطتني ثقة كبيرة في التقديم على الشركات الحالية وحصلت على ترقية سريعة.',
      author: 'أ. نورة الغامدي', role: 'مصممة تجربة مستخدم'
    },
    {
      quote: 'جربت عدة منصات، ولكن هذه الأكاديمية تميزت بدقة المحتوى وسهولة التفاعل والسرعة في الفهم.',
      author: 'د. فيصل السبيعي', role: 'محلل بيانات أول'
    },
  ];
  const testimonials = testNode?.props?.items?.map((item: any) => {
    const p = item.props || item;
    return {
      quote: p.quote || 'نص التقييم والتجربة',
      author: p.author || 'اسم الطالب',
      role: p.role || 'الملف المهني'
    };
  }) || defaultTestimonials;

  useEffect(() => {
    if (testimonials.length > 0) {
      const id = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 5000);
      return () => clearInterval(id);
    }
  }, [testimonials.length]);

  // 8. CTA Banner
  const pricingNode = sections.find(s => s.type === 'pricing_section');
  const ctaTitle = pricingNode?.props?.title || 'مهارتك القادمة تبدأ ببضع خطوات بسيطة.';
  const ctaSub = pricingNode?.props?.subtitle || 'اختر برنامجك الدراسي اليوم، انضم في دقائق، وابدأ بناء مستقبلك المهني مع شهادات معتمدة.';

  // 9. Footer
  const footerNode = sections.find(s => s.type === 'footer');
  const footerCopyright = footerNode?.props?.copyright || `&copy; ${new Date().getFullYear()} ${academyName}. جميع الحقوق محفوظة.`;

  // --- Editable Click Wrapper for Canvas ---
  const renderEditableSection = (typeSlug: string, children: React.ReactNode, className = '') => {
    const node = sections.find(s => s.type === typeSlug);
    const nodeId = node?.id || `fallback-${typeSlug}`;
    const isSelected = selectedNodeId === nodeId;

    if (!isEditing) {
      return <div className={className}>{children}</div>;
    }

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setSelectedNodeId(nodeId);
        }}
        className={`${className} lst-editing-hover ${isSelected ? 'lst-editing-selected' : ''}`}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        {isEditing && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity z-50 pointer-events-none select-none">
            تعديل قسم: {typeSlug}
          </div>
        )}
        {children}
      </div>
    );
  };

  const svgPath = 'M 20,40 C 120,10 180,70 300,40 C 420,10 480,70 600,40 C 720,10 780,70 880,40';
  const nodePositions: [number, number][] = [[160, 40], [300, 40], [440, 40], [600, 40], [740, 40]];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={rootRef} className="lst-root" dir="rtl">

        {/* ── NAV ── */}
        {renderEditableSection('navbar', (
          <nav className={`lst-nav${navScrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
            <a href="#" className="lst-logo" aria-label="Home">
              <span className="lst-logo-icon" aria-hidden="true">د</span>
              <span className="lst-logo-name">{academyName}</span>
            </a>
            <div className="lst-nav-center">
              <a href="#categories" className="lst-nav-link">الأقسام والكليات</a>
              <a href="#courses" className="lst-nav-link">الدورات التدريبية</a>
              <a href="#how-it-works" className="lst-nav-link">المسارات والاعتمادات</a>
              <a href="#stories" className="lst-nav-link">قصص النجاح</a>
            </div>
            <div className="lst-nav-right">
              <a href="#" className="lst-signin">تسجيل الدخول</a>
              <a href="#" className="lst-btn lst-btn-primary" style={{ height: 40, fontSize: 13, padding: '0 20px' }}>
                ابدأ التعلم الآن
              </a>
            </div>
          </nav>
        ))}

        {/* ── HERO ── */}
        {heroNode && (
          <SectionWrapper
            node={heroNode}
            isEditing={isEditing}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
          >
            <div className={`lst-hero${!sideImage ? ' no-image' : ''}`}>
              <div className="lst-hero-container">
                {sideImage && sideImagePos === 'left' && (
                  <div className="lst-hero-image-col">
                    <img src={sideImage} alt="Hero illustration" className="lst-hero-side-img" />
                  </div>
                )}
                <div className="lst-hero-content-col">
                  <div className={`lst-eyebrow lst-hero-item lst-d0${heroVisible ? ' vis' : ''}`}>
                    <span className="lst-pulse" aria-hidden="true" />
                    التسجيل مفتوح الآن &middot; الدفعة الجديدة
                  </div>
                  <h1 className={`lst-h1 lst-hero-item lst-d1${heroVisible ? ' vis' : ''}`}>
                    {heroTitle}
                  </h1>
                  <p className={`lst-hero-sub lst-hero-item lst-d2${heroVisible ? ' vis' : ''}`}>
                    {heroSubtitle}
                  </p>
                  <div className={`lst-btn-row lst-hero-item lst-d3${heroVisible ? ' vis' : ''}`}>
                    <a href={heroBtnLink} className="lst-btn lst-btn-primary">{heroBtnText}</a>
                    <a href={heroSecBtnLink} className="lst-btn lst-btn-ghost">{heroSecBtnText}</a>
                  </div>
                  <div className={`lst-hero-stats lst-hero-item lst-d4${heroVisible ? ' vis' : ''}`}>
                    {[
                      { num: '4,200', label: 'دورة مباشرة' },
                      { num: '180', label: 'جامعة ومؤسسة شريكة' },
                      { num: '92%', label: 'نسبة إكمال الدورات' },
                    ].map((s, i) => (
                      <div key={i} className="lst-stat-pill">
                        <span className="lst-stat-pill-num">{s.num}</span>
                        <span className="lst-stat-pill-lab">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {sideImage && sideImagePos === 'right' && (
                  <div className="lst-hero-image-col">
                    <img src={sideImage} alt="Hero illustration" className="lst-hero-side-img" />
                  </div>
                )}
              </div>
            </div>

            {/* Learning path SVG */}
            <div className="lst-path-wrap">
              <div className="lst-path-inner">
                <svg className="lst-path-svg" viewBox="0 0 900 80" preserveAspectRatio="none" height="80" aria-hidden="true">
                  <defs>
                    <linearGradient id="lstGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2FA8E0" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="#2FA8E0" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#2FA8E0" stopOpacity="0.25" />
                    </linearGradient>
                  </defs>
                  <path d={svgPath} fill="none" stroke="url(#lstGrad)" strokeWidth="2" strokeLinecap="round" />
                  {nodePositions.map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="5" fill="white" stroke="#2FA8E0" strokeWidth="2" />
                  ))}
                  <circle r="5" fill="#2FA8E0">
                    <animateMotion dur="8s" repeatCount="indefinite" path={svgPath} />
                  </circle>
                </svg>
                <div className="lst-toast lst-toast-l" aria-hidden="true">
                  <span className="lst-toast-ic">✓</span>
                  اكتملت الوحدة
                </div>
                <div className="lst-toast lst-toast-r" aria-hidden="true">
                  <span className="lst-toast-ic">🔥</span>
                  12 يوماً متواصلة
                </div>
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* ── MARQUEE ── */}
        {galleryNode && (
          <SectionWrapper
            node={galleryNode}
            isEditing={isEditing}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
          >
            <div className="lst-marquee-band" aria-hidden="true">
              <p className="lst-marquee-label">{galleryNode.props?.title || 'معرض البيئة التعليمية والشركاء الأكاديميين'}</p>
              <div className="lst-marquee-wrap">
                <div className="lst-marquee-track">
                  {[...universities, ...universities].map((u: { imageUrl: string; text: string }, i: number) => (
                    <React.Fragment key={i}>
                      {u.imageUrl ? (
                        <img src={u.imageUrl} alt={u.text} className="lst-marquee-img" />
                      ) : (
                        <span className="lst-marquee-uni">{u.text}</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* ── CATEGORIES ── */}
        {catNode && (
          <SectionWrapper
            node={catNode}
            isEditing={isEditing}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
          >
            <section id="categories" className="lst-section" aria-label="Course categories">
              <Reveal className="lst-section-hdr">
                <h2 className="lst-h2">{catNode.props?.title || 'مسارات متخصصة تغطي كافة مجالات التكنولوجيا والإدارة'}</h2>
                <p className="lst-section-sub">{catNode.props?.subtitle || 'اختر المجال الذي يناسب شغفك وتدرّج في التعلم مع شهادات معتمدة.'}</p>
              </Reveal>
              <div className="lst-cat-grid">
                {categories.map((item: { icon: string; label: string; desc: string; count: string }, i: number) => (
                  <Reveal key={i} delay={i * 90}>
                    <div className="lst-cat-card">
                      <div className="lst-cat-icon" aria-hidden="true">
                        <DynamicLucideIcon name={item.icon} size={22} color="var(--sky-deep)" />
                      </div>
                      <div className="lst-cat-title">{item.label}</div>
                      <div className="lst-cat-desc">{item.desc}</div>
                      <div className="lst-cat-meta">{item.count} &larr;</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          </SectionWrapper>
        )}

        {/* ── COURSES ── */}
        {courseNode && (
          <SectionWrapper
            node={courseNode}
            isEditing={isEditing}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
          >
            <div id="courses" className="lst-courses-wrap">
              <div className="lst-courses-inner">
                <Reveal className="lst-section-hdr">
                  <h2 className="lst-h2">{courseNode.props?.title || 'أبرز الدورات المتاحة لهذا الفصل الدراسي'}</h2>
                  <p className="lst-section-sub">{courseNode.props?.subtitle || 'دورات مختارة بعناية تحت إشراف أفضل المحاضرين والخبراء.'}</p>
                </Reveal>

                {isCoursesLoading ? (
                  <div className="lst-courses-grid">
                    {Array.from({ length: Math.min(Number(courseNode.props?.limit) || 4, 4) }).map((_, i) => (
                      <div key={i} className="lst-course-card animate-pulse">
                        <div className="lst-course-thumb bg-slate-200" />
                        <div className="lst-course-body space-y-3">
                          <div className="h-4 bg-slate-200 rounded w-3/4" />
                          <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : courses.length === 0 ? (
                  <div className="bg-white/80 border border-dashed border-purple-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-3 text-slate-500 my-4 max-w-xl mx-auto">
                    <Lucide.BookOpen className="w-9 h-9 text-purple-300" />
                    <p className="text-sm font-bold text-slate-700">لا توجد دورات متاحة حالياً</p>
                    <p className="text-xs text-slate-400">تابعنا قريباً للمزيد من الدورات وورش العمل الجديدة.</p>
                    {isEditing && (
                      <Link href="/academic/courses/create" className="mt-2 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
                        <span>إضافة دورة جديدة</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="lst-courses-grid">
                    {courses.slice(0, Number(courseNode.props?.limit) || courses.length).map((c, i: number) => (
                      <div key={c.id || i} style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}>
                        <CourseCard {...c} href={`/${c.slug || c.id}`} isEditing={isEditing} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* ── HOW IT WORKS ── */}
        {featNode && (
          <SectionWrapper
            node={featNode}
            isEditing={isEditing}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
          >
            <section id="how-it-works" className="lst-section" aria-label="How it works">
              <Reveal className="lst-section-hdr">
                <h2 className="lst-h2">{featNode.props?.title || 'منهجية تعليمية بسيطة وتطبيقات عملية مكثفة'}</h2>
                <p className="lst-section-sub">{featNode.props?.subtitle}</p>
              </Reveal>
              <div className="lst-steps-wrap">
                <div className="lst-steps-line" aria-hidden="true" />
                {steps.map((s: { num: string; title: string; desc: string }, i: number) => (
                  <Reveal key={s.num} delay={i * 120} className="lst-step">
                    <div className="lst-step-num" aria-hidden="true">{s.num}</div>
                    <div className="lst-step-title">{s.title}</div>
                    <div className="lst-step-desc">{s.desc}</div>
                  </Reveal>
                ))}
              </div>
            </section>
          </SectionWrapper>
        )}

        {/* ── STATS BAND ── */}
        {kpiNode && (
          <SectionWrapper
            node={kpiNode}
            isEditing={isEditing}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
          >
            <div className="lst-stats-band" aria-label="Platform statistics">
              <div className="lst-stats-inner">
                {stats.map((s: { value: string; label: string; icon: string; color: string }, i: number) => (
                  <div key={i} className="lst-stat-item">
                    {s.icon && <DynamicLucideIcon name={s.icon} color={s.color} size={28} className="lst-stat-icon-svg" />}
                    <KPIValue rawValue={s.value} color={s.color} />
                    <span className="lst-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* ── TESTIMONIALS ── */}
        {testNode && (
          <SectionWrapper
            node={testNode}
            isEditing={isEditing}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
          >
            <section id="stories" className="lst-testimonials" aria-label="Learner testimonials">
              <Reveal className="lst-section-hdr">
                <h2 className="lst-h2">{testNode.props?.title || 'قصص نجاح من قلب مجتمعنا التعليمي'}</h2>
                <p className="lst-section-sub">{testNode.props?.subtitle}</p>
              </Reveal>
              <div className="lst-t-wrap" role="region" aria-live="polite" aria-label="Testimonial rotator">
                {testimonials.map((t: { quote: string; author: string; role: string }, i: number) => (
                  <div key={i} className={`lst-t-slide${i === testimonialIdx ? ' active' : ''}`} aria-hidden={i !== testimonialIdx}>
                    <p className="lst-t-quote">{t.quote}</p>
                    <div className="lst-t-author">{t.author}</div>
                    <div className="lst-t-role">{t.role}</div>
                  </div>
                ))}
              </div>
              <div className="lst-t-dots" role="tablist" aria-label="Testimonial navigation">
                {testimonials.map((_: any, i: number) => (
                  <button
                    key={i}
                    className={`lst-t-dot${i === testimonialIdx ? ' active' : ''}`}
                    onClick={() => setTestimonialIdx(i)}
                    role="tab"
                    aria-selected={i === testimonialIdx}
                    aria-label={`تقييم ${i + 1}`}
                  />
                ))}
              </div>
            </section>
          </SectionWrapper>
        )}

        {/* ── CTA BANNER ── */}
        {pricingNode && (
          <SectionWrapper
            node={pricingNode}
            isEditing={isEditing}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
          >
            <section className="lst-cta-section" aria-label="Call to action">
              <Reveal>
                <div className="lst-cta-inner">
                  <h2 className="lst-cta-h2">{ctaTitle}</h2>
                  <p className="lst-cta-sub">{ctaSub}</p>
                  <div className="lst-btn-row">
                    <a href="#courses" className="lst-btn lst-btn-white">تصفح كافة الدورات</a>
                    <a href="#how-it-works" className="lst-btn lst-btn-outline-white">تعرف على طريقة التعلم</a>
                  </div>
                </div>
              </Reveal>
            </section>
          </SectionWrapper>
        )}

        {/* ── FOOTER ── */}
        {renderEditableSection('footer', (
          <footer className="lst-footer">
            <div className="lst-footer-inner">
              <div className="lst-footer-grid">
                <div className="lst-footer-brand">
                  <div className="lst-footer-logo">
                    <span className="lst-footer-logo-icon" aria-hidden="true">د</span>
                    <span className="lst-footer-logo-name">{academyName}</span>
                  </div>
                  <p className="lst-footer-tagline">تعلم بلا حدود واكتسب مهارات معتمدة تبني بها مستقبلك المهني.</p>
                </div>
                <div className="lst-footer-col">
                  <h4>التعلم</h4>
                  <ul>
                    <li><a href="#courses">تصفح الدورات</a></li>
                    <li><a href="#how-it-works">المسارات المعتمدة</a></li>
                    <li><a href="#categories">الشهادات والاعتمادات</a></li>
                    <li><a href="#">حلول المؤسسات</a></li>
                  </ul>
                </div>
                <div className="lst-footer-col">
                  <h4>عن الأكاديمية</h4>
                  <ul>
                    <li><a href="#">من نحن</a></li>
                    <li><a href="#">الجامعات الشريكة</a></li>
                    <li><a href="#">الوظائف والفرص</a></li>
                    <li><a href="#">المركز الإعلامي</a></li>
                  </ul>
                </div>
                <div className="lst-footer-col">
                  <h4>الدعم والمساعدة</h4>
                  <ul>
                    <li><a href="#">مركز المساعدة</a></li>
                    <li><a href="#">سياسة الخصوصية</a></li>
                    <li><a href="#">شروط الخدمة</a></li>
                    <li><a href="#">تواصل معنا</a></li>
                  </ul>
                </div>
              </div>
              <div className="lst-footer-bottom">
                <span dangerouslySetInnerHTML={{ __html: footerCopyright }} />
                <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: '12px' }}>تعلم بلا حدود · أكاديمية معتمدة</span>
              </div>
            </div>
          </footer>
        ))}

      </div>
    </>
  );
}
