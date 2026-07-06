import React, { useState, useEffect } from 'react';
import { BuilderNode } from '../../interfaces';
import RecursiveRenderer from '../../renderer/RecursiveRenderer';
import { getThemeBySlug } from '../themeStyles';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { unwrapEncryptedResponseData } from '@/lib/decryption';

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

export function TenantFooter() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Try local storage cache first
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
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('https://api.darab.academy/api/academy/me', { headers });
        if (res.ok) {
          const resJson = await res.json();
          const decryptedData = unwrapEncryptedResponseData(resJson) as any;
          const data = decryptedData?.data ?? decryptedData;
          if (data) {
            setProfile(data);
            localStorage.setItem('darab_academy_profile_full', JSON.stringify(data));
            
            // Also sync the simpler cache used by navbar
            const info = {
              name: data.academy_name || data.name || '',
              logo: data.logo || data.logo_url || ''
            };
            localStorage.setItem('darab_academy_profile', JSON.stringify(info));
          }
        }
      } catch (err) {
        console.error('Failed to fetch academy profile in footer:', err);
      }
    };

    fetchProfile();
  }, []);

  const academyName = profile?.academy_name || profile?.name || 'أكاديمية درب';
  const logoUrl = profile?.logo || profile?.logo_url || '';
  const description = profile?.short_description || profile?.bio_paragraph_1 || 'بوابتك الرقمية للتعلم الذكي واكتساب المهارات المطلوبة في سوق العمل.';
  const email = profile?.email || 'support@darab.academy';
  const phone = profile?.phone || '';
  const address = profile?.address || '';

  return (
    <footer className="mt-20 border-t border-slate-100 bg-white pt-16 pb-8 select-none w-full" dir="rtl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-right">
          
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-5 items-start">
            <div className="flex items-center gap-3">
              {isValidImageUrl(logoUrl) ? (
                <img src={logoUrl} alt={academyName} className="w-10 h-10 object-contain rounded-lg" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 font-extrabold text-base">
                  {academyName?.[0] || 'د'}
                </div>
              )}
              <span className="text-xl font-black text-slate-800 tracking-wide">
                {academyName}
              </span>
            </div>
            {isValidField(description) && (
              <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-sm">
                {description}
              </p>
            )}
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              {profile?.facebook_handle && isValidField(profile.facebook_handle) && (
                <a href={profile.facebook_handle} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-[#1877F2] flex items-center justify-center transition-colors">
                  <Facebook size={16} />
                </a>
              )}
              {profile?.instagram_handle && isValidField(profile.instagram_handle) && (
                <a href={profile.instagram_handle} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-pink-50 text-slate-400 hover:text-pink-500 flex items-center justify-center transition-colors">
                  <Instagram size={16} />
                </a>
              )}
              {profile?.linkedin_handle && isValidField(profile.linkedin_handle) && (
                <a href={profile.linkedin_handle} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors">
                  <Linkedin size={16} />
                </a>
              )}
              {profile?.twitter_handle && isValidField(profile.twitter_handle) && (
                <a href={profile.twitter_handle} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors">
                  <Twitter size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation / Policy Links */}
          <div className="flex flex-col gap-4 items-start">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">سياسات وقوانين</h3>
            <ul className="space-y-3 text-xs font-bold text-slate-500 text-right">
              <li>
                <a href="/terms" className="hover:text-blue-600 transition-colors">شروط الخدمة والتعاقد</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-blue-600 transition-colors">سياسة الخصوصية وسرية البيانات</a>
              </li>
              <li>
                <a href="/refund" className="hover:text-blue-600 transition-colors">سياسة الاسترجاع والالغاء</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="flex flex-col gap-4 items-start">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">اتصل بنا والدعم</h3>
            <ul className="space-y-3 text-xs font-bold text-slate-500 text-right">
              {email && isValidField(email) && (
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-400" />
                  <span>{email}</span>
                </li>
              )}
              {phone && isValidField(phone) && (
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-slate-400" />
                  <span dir="ltr">{phone}</span>
                </li>
              )}
              {address && isValidField(address) && (
                <li className="flex items-center gap-3">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{address}</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400">
          <p>© {new Date().getFullYear()} {academyName}. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <span>مدعوم بواسطة منصة درب الذكية</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

interface TemplateProps {
  sections: BuilderNode[];
}

export default function ClassicTemplate({ sections }: TemplateProps) {
  const theme = getThemeBySlug('template_1');

  const cssVariables = {
    '--theme-primary': theme.primaryColor,
    '--theme-primary-rgb': theme.primaryRgb,
    '--theme-secondary': theme.secondaryColor,
    '--theme-accent': theme.accentColor,
    '--theme-bg': theme.backgroundColor,
    '--theme-text': theme.textColor,
    fontFamily: `'${theme.fontFamily}', sans-serif`,
  } as React.CSSProperties;

  const hasFooter = sections.some(sec => sec.type === 'footer');

  return (
    <div style={cssVariables} className="min-h-screen w-full transition-all duration-300 flex flex-col justify-between">
      <div className="w-full flex-grow">
        <RecursiveRenderer nodes={sections} />
      </div>
      {!hasFooter && <TenantFooter />}
    </div>
  );
}
