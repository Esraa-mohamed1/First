import React from 'react';
import { Search, Bell, User, HelpCircle } from 'lucide-react';
import { getTypographyStyle, hasSectionBackground } from '../utils/typography';

interface NavbarBlockProps {
  title?: string;
  showSearch?: boolean;
  showProfile?: boolean;
  bgColor?: string;
  borderColor?: string;
  [key: string]: any;
}

export default function NavbarBlock(props: NavbarBlockProps) {
  const {
    title = 'بوابة التعلم',
    showSearch = true,
    showProfile = true,
    bgColor = '#ffffff',
    borderColor = '#e2e8f0',
  } = props;

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-sm',
    weight: 'font-black',
    color: '#1f2937'
  });

  const isTransparentBg = hasSectionBackground(props);

  const isLandingPage = title === 'درب' || title === 'أكاديمية درب';

  if (isLandingPage) {
    return (
      <header 
        style={{ 
          backgroundColor: isTransparentBg ? 'rgba(255, 255, 255, 0.7)' : bgColor, 
          borderColor: isTransparentBg ? 'rgba(255, 255, 255, 0.4)' : borderColor 
        }}
        className={`w-full rounded-2xl border px-6 py-4 flex justify-between items-center ${isTransparentBg ? 'backdrop-blur-md shadow-md' : 'shadow-sm'} select-none z-50`}
        dir="rtl"
      >
        {/* Left Side: Registration Button */}
        <div>
          <button 
            style={{ backgroundColor: 'var(--theme-primary)' }}
            className="px-5 py-2 rounded-xl text-white font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            التسجيل
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
          <a href="#hero-t1" className="hover:text-[var(--theme-primary)] transition-colors">الرئيسية</a>
          <a href="#about-t1" className="hover:text-[var(--theme-primary)] transition-colors">نبذة عني</a>
          <a href="#courses-t1" className="hover:text-[var(--theme-primary)] transition-colors">الدورات</a>
          <a href="#gallery-t1" className="hover:text-[var(--theme-primary)] transition-colors">أعمالي</a>
          <a href="#testimonials-t1" className="hover:text-[var(--theme-primary)] transition-colors">آراء الطلاب</a>
        </nav>

        {/* Right Side: Logo */}
        <div className="flex items-center gap-3">
          <span 
            style={{ ...titleTypography.style, fontSize: '18px', color: 'var(--theme-primary)' }}
            className={`font-black tracking-wide ${titleTypography.className}`}
          >
            {title}
          </span>
        </div>
      </header>
    );
  }

  return (
    <header 
      style={{ 
        backgroundColor: isTransparentBg ? 'rgba(255, 255, 255, 0.7)' : bgColor, 
        borderColor: isTransparentBg ? 'rgba(255, 255, 255, 0.4)' : borderColor 
      }}
      className={`w-full rounded-2xl border px-6 py-4 flex justify-between items-center ${isTransparentBg ? 'backdrop-blur-md shadow-md' : 'shadow-sm'} select-none`}
      dir="rtl"
    >

      {/* Brand logo details */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0 font-extrabold text-sm">
          د
        </div>
        <span 
          style={titleTypography.style}
          className={`${titleTypography.className}`}
        >
          {title}
        </span>
      </div>

      {/* Middle search input box */}
      {showSearch && (
        <div className={`hidden md:flex items-center flex-1 max-w-sm mx-8 ${isTransparentBg ? 'bg-white/30 border-white/20' : 'bg-slate-50 border-slate-200/60'} rounded-xl px-3.5 py-1.5 relative shadow-inner`}>

          <input 
            type="text" 
            placeholder="البحث عن دروس أو معلمين..." 
            className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none text-right placeholder-slate-400"
            dir="rtl"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
        </div>
      )}

      {/* Right icons info */}
      <div className="flex items-center gap-3">
        <div className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        </div>
        
        <div className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer transition-colors">
          <HelpCircle className="w-4 h-4" />
        </div>

        {showProfile && (
          <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer shadow-sm ml-1">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>

    </header>
  );
}
