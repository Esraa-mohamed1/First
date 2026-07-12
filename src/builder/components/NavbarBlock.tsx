import React, { useState, useEffect } from 'react';
import { Search, Bell, User, HelpCircle, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { getTypographyStyle, hasSectionBackground } from '../utils/typography';
import { unwrapEncryptedResponseData } from '@/lib/decryption';

interface NavbarBlockProps {
  title?: string;
  logoUrl?: string;
  logoText?: string;
  showSearch?: boolean;
  showProfile?: boolean;
  bgColor?: string;
  borderColor?: string;
  isLandingPage?: boolean;
  links?: Array<{ label: string; href: string }>;
  buttonText?: string;
  buttonLink?: string;
  showButton?: boolean;
  [key: string]: any;
}

const isValidField = (val: any) => {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (trimmed.length > 30 && /^[A-Za-z0-9+/=\s]+$/.test(trimmed)) {
    return false;
  }
  return true;
};

const isValidImageUrl = (url: any) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/') || trimmed.startsWith('/');
};

export default function NavbarBlock(props: NavbarBlockProps) {
  const {
    title = 'بوابة التعلم',
    logoUrl = '',
    logoText = 'د',
    showSearch = true,
    showProfile = true,
    bgColor = '#ffffff',
    borderColor = '#e2e8f0',
    isLandingPage: propIsLandingPage,
    links = [
      { label: 'الرئيسية', href: '#hero-t1' },
      { label: 'نبذة عني', href: '#about-t1' },
      { label: 'الدورات', href: '#courses-t1' },
      { label: 'أعمالي', href: '#gallery-t1' },
      { label: 'آراء الطلاب', href: '#testimonials-t1' }
    ],
    buttonText = 'التسجيل',
    buttonLink = '#',
    showButton = true,
  } = props;

  const [academyInfo, setAcademyInfo] = useState<{ name?: string; logo?: string } | null>(null);

  useEffect(() => {
    // Try localStorage first
    const cached = localStorage.getItem('darab_academy_profile');
    if (cached) {
      try {
        setAcademyInfo(JSON.parse(cached));
      } catch (e) {}
    }

    const fetchProfile = async () => {
      try {
        if (typeof window === 'undefined') return;
        let hostname = window.location.hostname;
        if (hostname.endsWith('.localhost')) {
          hostname = hostname.replace('.localhost', '');
        }
        const tenantKey = (hostname === 'localhost' || hostname === 'darab.academy' || hostname === 'www.darab.academy') ? '' : hostname;
        if (!tenantKey) return;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Tenant-Key': tenantKey.toLowerCase(),
          'X-Tenant': tenantKey.toLowerCase(),
          'x-tenant-name': tenantKey.toLowerCase()
        };

        const token = localStorage.getItem('token');
        if (!token) return;

        headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('https://api.darab.academy/api/academy/me', { headers });
        if (res.ok) {
          const resJson = await res.json();
          const decryptedData = unwrapEncryptedResponseData(resJson) as any;
          const profile = decryptedData?.data ?? decryptedData;
          if (profile) {
            const info = {
              name: profile.academy_name || profile.name || '',
              logo: profile.logo || profile.logo_url || ''
            };
            setAcademyInfo(info);
            localStorage.setItem('darab_academy_profile', JSON.stringify(info));
          }
        }
      } catch (err) {
        console.error('Failed to fetch academy profile in navbar:', err);
      }
    };

    fetchProfile();
  }, []);

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-sm',
    weight: 'font-black',
    color: '#1f2937'
  });

  const isTransparentBg = hasSectionBackground(props);

  // For backward compatibility, fall back to title check if isLandingPage is not defined
  const isLandingPage = propIsLandingPage ?? (title === 'درب' || title === 'أكاديمية درب');

  // Resolve active logo and title from either custom props or fetched profile
  const activeLogo = logoUrl || academyInfo?.logo;
  const activeTitle = title !== 'بوابة التعلم' && title !== 'درب' ? title : (academyInfo?.name || title);

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
          {showButton && (
            <a 
              href={buttonLink}
              style={{ backgroundColor: 'var(--theme-primary)' }}
              className="px-5 py-2 rounded-xl text-white font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md inline-block text-center"
            >
              {buttonText}
            </a>
          )}
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
          {links.map((link: any, idx: number) => (
            <a 
              key={idx} 
              href={link.href} 
              className="hover:text-[var(--theme-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Side: Logo */}
        <div className="flex items-center gap-3">
          {isValidImageUrl(activeLogo) ? (
            <img src={activeLogo} alt={activeTitle} className="w-8 h-8 object-contain rounded-lg" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0 font-extrabold text-sm">
              {logoText || activeTitle?.[0] || 'د'}
            </div>
          )}
          <span 
            style={{ ...titleTypography.style, fontSize: '18px', color: 'var(--theme-primary)' }}
            className={`font-black tracking-wide ${titleTypography.className}`}
          >
            {activeTitle}
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
        {isValidImageUrl(activeLogo) ? (
          <img src={activeLogo} alt={activeTitle} className="w-8 h-8 object-contain rounded-lg" />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0 font-extrabold text-sm">
            {logoText || activeTitle?.[0] || 'د'}
          </div>
        )}
        <span 
          style={titleTypography.style}
          className={`${titleTypography.className}`}
        >
          {activeTitle}
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

export function FooterBlock(props: any) {
  const {
    bgColor = '#ffffff',
    textColor = '#1f2937',
    copyright = 'جميع الحقوق محفوظة',
    logoUrl = '',
    logoText = 'د',
    showLogo = true,
    showSocials = true,
    email = '',
    phone = '',
    address = '',
    facebookUrl = '',
    instagramUrl = '',
    linkedinUrl = '',
    twitterUrl = ''
  } = props;

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const cached = localStorage.getItem('darab_academy_profile_full');
    if (cached) {
      try {
        setProfile(JSON.parse(cached));
      } catch (e) {}
    }

    const fetchProfile = async () => {
      try {
        if (typeof window === 'undefined') return;
        let hostname = window.location.hostname;
        if (hostname.endsWith('.localhost')) {
          hostname = hostname.replace('.localhost', '');
        }
        const tenantKey = (hostname === 'localhost' || hostname === 'darab.academy' || hostname === 'www.darab.academy') ? '' : hostname;
        if (!tenantKey) return;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Tenant-Key': tenantKey.toLowerCase(),
          'X-Tenant': tenantKey.toLowerCase(),
          'x-tenant-name': tenantKey.toLowerCase()
        };

        const token = localStorage.getItem('token');
        if (!token) return;

        headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('https://api.darab.academy/api/academy/me', { headers });
        if (res.ok) {
          const resJson = await res.json();
          const decryptedData = unwrapEncryptedResponseData(resJson) as any;
          const data = decryptedData?.data ?? decryptedData;
          if (data) {
            setProfile(data);
            localStorage.setItem('darab_academy_profile_full', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error('Failed to fetch academy profile in footer:', err);
      }
    };

    fetchProfile();
  }, []);

  const academyName = profile?.academy_name || profile?.name || 'أكاديمية درب';
  const activeLogo = logoUrl || profile?.logo || profile?.logo_url || '';
  const description = profile?.short_description || profile?.bio_paragraph_1 || 'بوابتك الرقمية للتعلم الذكي واكتساب المهارات.';
  const activeEmail = email || profile?.email || 'support@darab.academy';
  const activePhone = phone || profile?.phone || '';
  const activeAddress = address || profile?.address || '';

  const activeFacebook = facebookUrl || profile?.facebook_handle;
  const activeInstagram = instagramUrl || profile?.instagram_handle;
  const activeLinkedin = linkedinUrl || profile?.linkedin_handle;
  const activeTwitter = twitterUrl || profile?.twitter_handle;

  return (
    <footer style={{ backgroundColor: bgColor, color: textColor }} className="mt-20 border-t border-slate-100 pt-16 pb-8 select-none w-full" dir="rtl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-right">
          
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-5 items-start">
            {showLogo && (
              <div className="flex items-center gap-3">
                {isValidImageUrl(activeLogo) ? (
                  <img src={activeLogo} alt={academyName} className="w-10 h-10 object-contain rounded-lg" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 font-extrabold text-base">
                    {logoText || academyName?.[0] || 'د'}
                  </div>
                )}
                <span className="text-xl font-black tracking-wide">
                  {academyName}
                </span>
              </div>
            )}
            {isValidField(description) && (
              <p className="text-xs font-bold opacity-75 leading-relaxed max-w-sm">
                {description}
              </p>
            )}
            
            {/* Social Icons */}
            {showSocials && (
              <div className="flex items-center gap-3 mt-2">
                {activeFacebook && isValidField(activeFacebook) && (
                  <a href={activeFacebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-[#1877F2] flex items-center justify-center transition-colors">
                    <Facebook size={16} />
                  </a>
                )}
                {activeInstagram && isValidField(activeInstagram) && (
                  <a href={activeInstagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-pink-50 text-slate-400 hover:text-pink-500 flex items-center justify-center transition-colors">
                    <Instagram size={16} />
                  </a>
                )}
                {activeLinkedin && isValidField(activeLinkedin) && (
                  <a href={activeLinkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors">
                    <Linkedin size={16} />
                  </a>
                )}
                {activeTwitter && isValidField(activeTwitter) && (
                  <a href={activeTwitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors">
                    <Twitter size={16} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2: Policies */}
          <div className="flex flex-col gap-4 items-start">
            <h3 className="text-xs font-black uppercase tracking-wider">سياسات وقوانين</h3>
            <ul className="space-y-3 text-xs font-bold opacity-75 text-right">
              <li>
                <a href="/terms" className="hover:underline">شروط الخدمة والتعاقد</a>
              </li>
              <li>
                <a href="/privacy" className="hover:underline">سياسة الخصوصية وسرية البيانات</a>
              </li>
              <li>
                <a href="/refund" className="hover:underline">سياسة الاسترجاع والالغاء</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="flex flex-col gap-4 items-start">
            <h3 className="text-xs font-black uppercase tracking-wider">اتصل بنا والدعم</h3>
            <ul className="space-y-3 text-xs font-bold opacity-75 text-right">
              {activeEmail && isValidField(activeEmail) && (
                <li className="flex items-center gap-3">
                  <Mail size={16} className="opacity-60" />
                  <span>{activeEmail}</span>
                </li>
              )}
              {activePhone && isValidField(activePhone) && (
                <li className="flex items-center gap-3">
                  <Phone size={16} className="opacity-60" />
                  <span dir="ltr">{activePhone}</span>
                </li>
              )}
              {activeAddress && isValidField(activeAddress) && (
                <li className="flex items-center gap-3">
                  <MapPin size={16} className="opacity-60" />
                  <span>{activeAddress}</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="border-t border-slate-100/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold opacity-60">
          <p>© {new Date().getFullYear()} {academyName}. {copyright}</p>
          <div className="flex items-center gap-6">
            <span>مدعوم بواسطة منصة درب الذكية</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
