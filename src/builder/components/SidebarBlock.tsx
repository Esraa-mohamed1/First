import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Globe, 
  Settings, 
  LogOut, 
  Plus
} from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { getTypographyStyle, hasSectionBackground } from '../utils/typography';

interface SidebarBlockProps {
  title?: string;
  logoText?: string;
  theme?: 'light' | 'dark';
  accentColor?: string;
  [key: string]: any;
}

export default function SidebarBlock(props: SidebarBlockProps) {
  const {
    title = 'أكاديمية درب الذكية',
    logoText = 'د',
    theme = 'light',
    accentColor = 'var(--theme-accent)',
  } = props;
  const isDark = theme === 'dark';

  // Read deviceMode with a fail-safe fallback
  let deviceMode = 'desktop';
  try {
    deviceMode = useBuilderStore((state) => state.deviceMode);
  } catch (e) {
    // Fallback if rendered outside the store context
  }

  const menuItems = [
    { label: 'الرئيسية', icon: LayoutDashboard, active: true },
    { label: 'الدورات والكورسات', icon: GraduationCap },
    { label: 'الطلاب والمستخدمين', icon: Users },
    { label: 'إدارة الموقع', icon: Globe },
    { label: 'الإعدادات العامة', icon: Settings },
  ];

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-base',
    weight: 'font-black',
    color: isDark ? '#ffffff' : '#1f2937'
  });

  const logoTextTypography = getTypographyStyle(props, 'logoText', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-lg',
    weight: 'font-black',
    color: '#ffffff'
  });

  const isTransparentBg = hasSectionBackground(props);

  // Mobile layout morphing
  if (deviceMode === 'mobile') {
    return (
      <div 
        style={{ borderColor: isTransparentBg ? 'rgba(255,255,255,0.4)' : (isDark ? '#1e293b' : '#f1f5f9') }}
        className={`w-full rounded-2xl border p-4 flex items-center justify-between shadow-sm transition-colors ${
          isTransparentBg
            ? 'bg-white/70 text-slate-700 backdrop-blur-md'
            : (isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500')
        }`}
        dir="rtl"
      >

        <div className="flex items-center gap-2.5">
          <div 
            style={{ ...logoTextTypography.style, backgroundColor: accentColor }}
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${logoTextTypography.className}`}
          >
            {logoText}
          </div>
          <span 
            style={titleTypography.style}
            className={`text-xs truncate max-w-[120px] ${titleTypography.className}`}
          >
            {title}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            style={{ backgroundColor: accentColor }}
            className="text-[9px] font-black text-white px-3 py-1.5 rounded-lg shrink-0"
          >
            كورس جديد
          </button>
          <div className="p-2 hover:bg-slate-100/50 rounded-lg cursor-pointer text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full md:max-w-[280px] h-[450px] rounded-3xl border flex flex-col justify-between p-6 text-right select-none shadow-sm transition-colors ${
        isTransparentBg
          ? 'bg-white/70 border-white/40 text-slate-700 backdrop-blur-md'
          : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-500')
      }`}
      dir="rtl"
    >

      <div className="space-y-8">
        {/* Branding header */}
        <div className="flex items-center gap-3">
          <div 
            style={{ ...logoTextTypography.style, backgroundColor: accentColor }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${logoTextTypography.className}`}
          >
            {logoText}
          </div>
          <span 
            style={titleTypography.style}
            className={`truncate ${titleTypography.className}`}
          >
            {title}
          </span>
        </div>

        {/* Menu list */}
        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                style={{ 
                  backgroundColor: item.active ? (isDark ? 'rgba(255, 255, 255, 0.05)' : `${accentColor}10`) : undefined,
                  color: item.active ? (isDark ? '#ffffff' : accentColor) : undefined
                }}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-colors`}
              >
                <Icon 
                  className="w-4 h-4 shrink-0" 
                  style={{ color: item.active ? (isDark ? '#ffffff' : accentColor) : '#94a3b8' }} 
                />
                <span className="text-[11px] font-black">{item.label}</span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="space-y-4 pt-4 border-t border-slate-100/50">
        <div 
          style={{ backgroundColor: accentColor }}
          className="rounded-xl p-2.5 flex items-center justify-center gap-2 text-white font-black text-xs shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3px]" />
          <span>كورس جديد</span>
        </div>
        
        <div className="flex items-center gap-3 px-3 cursor-pointer text-rose-500 hover:text-rose-600">
          <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="text-[11px] font-black">خروج</span>
        </div>
      </div>

    </div>
  );
}
