'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  User,
  GraduationCap,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Package,
  X,
} from 'lucide-react';
import { clearUserSessionAndCache } from '@/lib/auth-storage';
import { getMyAcademyProfile } from '@/services/student-auth';
import { normalizeProfileImageUrl } from '@/lib/utils';

interface StudentSidebarUserData {
  name: string;
  avatar?: string | null;
}

interface AcademySidebarData {
  name: string;
  logo?: string | null;
}

interface StudentSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const sidebarGroups = [
  {
    title: 'القائمة الرئيسية',
    items: [
      { name: 'صفحة الأكاديمية', href: '/', icon: LayoutDashboard },
    ]
  },
  {
    title: 'التعليم',
    items: [
      { name: 'دوراتي', href: '/student/courses', icon: BookOpen },
      { name: 'حقائبي الرقمية', href: '/student/bags', icon: Package },
    ]
  },
  {
    title: 'الحساب',
    items: [
      { name: 'الملف الشخصي', href: '/student/profile', icon: User },
    ]
  }
];

export const StudentSidebar = ({ isOpen = false, onClose }: StudentSidebarProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [user, setUser] = useState<StudentSidebarUserData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedUserStr = localStorage.getItem('user_info');
        const cachedName = localStorage.getItem('user_name');
        if (cachedUserStr) {
          const parsed = JSON.parse(cachedUserStr);
          const name = parsed?.name || cachedName || '';
          const avatarRaw = parsed?.profile_image || parsed?.avatar || parsed?.image || null;
          const avatar = avatarRaw ? normalizeProfileImageUrl(avatarRaw) : null;
          if (name && name !== 'أحمد محمد') return { name, avatar };
        }
        if (cachedName && cachedName !== 'أحمد محمد') return { name: cachedName, avatar: null };
      } catch (e) {}
    }
    return { name: 'طالب', avatar: null };
  });

  const [academy, setAcademy] = useState<AcademySidebarData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('darab_academy_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          const name = parsed?.name || parsed?.site_name || parsed?.academy_name || '';
          const logo = parsed?.logo || parsed?.logo_url || null;
          if (name && name !== 'Darrab' && name !== 'درب Darrab') return { name, logo };
        }
      } catch (e) {}
    }
    return { name: '', logo: null };
  });

  const [isAcademyLoading, setIsAcademyLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('darab_academy_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          const name = parsed?.name || parsed?.site_name || parsed?.academy_name || '';
          if (name && name !== 'Darrab' && name !== 'درب Darrab') return false;
        }
      } catch (e) {}
    }
    return true;
  });

  const [imgError, setImgError] = useState(false);
  const [academyLogoError, setAcademyLogoError] = useState(false);

  useEffect(() => { setImgError(false); }, [user.avatar]);

  useEffect(() => {
    let isMounted = true;

    if (typeof window !== 'undefined') {
      try {
        const cachedUserStr = localStorage.getItem('user_info');
        const cachedName = localStorage.getItem('user_name');
        if (cachedUserStr) {
          const parsed = JSON.parse(cachedUserStr);
          const name = parsed?.name || cachedName;
          const avatarRaw = parsed?.profile_image || parsed?.avatar || parsed?.image || null;
          const avatar = avatarRaw ? normalizeProfileImageUrl(avatarRaw) : null;
          if (name && name !== 'أحمد محمد' && isMounted) setUser({ name, avatar });
        } else if (cachedName && cachedName !== 'أحمد محمد' && isMounted) {
          setUser(prev => ({ ...prev, name: cachedName }));
        }
      } catch (e) {}
    }

    const fetchAcademy = async () => {
      try {
        const data = await getMyAcademyProfile();
        if (isMounted && data) {
          const name = data.name || data.site_name || data.academy_name || '';
          const logo = data.logo || data.logo_url || null;
          if (name || logo !== undefined) {
            setAcademy(prev => ({ name: name || prev.name, logo: logo !== undefined ? logo : prev.logo }));
            setAcademyLogoError(false);
          }
          setIsAcademyLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsAcademyLoading(false);
      }
    };

    fetchAcademy();

    const handleProfileUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      const updatedUser = customEvent?.detail;
      if (updatedUser && isMounted) {
        const updatedName = updatedUser.name || updatedUser.fullName;
        const rawAvatar = updatedUser.profile_image || updatedUser.avatar || updatedUser.image;
        const updatedAvatar = rawAvatar !== undefined && rawAvatar !== null ? normalizeProfileImageUrl(rawAvatar) : undefined;
        if (updatedName || updatedAvatar !== undefined) {
          setUser(prev => ({ name: updatedName || prev.name, avatar: updatedAvatar !== undefined ? updatedAvatar : prev.avatar }));
          setImgError(false);
        }
      }
    };

    const handleAcademyUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      const updated = customEvent?.detail;
      if (updated && isMounted) {
        const name = updated.name || updated.site_name || updated.academy_name || '';
        const logo = updated.logo || updated.logo_url || null;
        if (name || logo !== undefined) {
          setAcademy(prev => ({ name: name || prev.name, logo: logo !== undefined ? logo : prev.logo }));
          setAcademyLogoError(false);
        }
        setIsAcademyLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('student-profile-updated', handleProfileUpdated);
      window.addEventListener('academy-profile-updated', handleAcademyUpdated);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('student-profile-updated', handleProfileUpdated);
        window.removeEventListener('academy-profile-updated', handleAcademyUpdated);
      }
    };
  }, []);

  const handleLogout = () => {
    clearUserSessionAndCache();
    window.location.href = '/auth/login';
  };

  // Shared nav items used in both desktop and mobile
  const renderNav = (mobile = false) => (
    <nav className="flex-1 px-3 py-2 space-y-5 overflow-x-hidden">
      {sidebarGroups.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className={`text-[10px] font-bold text-gray-400 px-3 mb-2 uppercase tracking-widest ${!mobile && isCollapsed ? 'hidden' : 'block'}`}>
            {group.title}
          </p>
          {group.items.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose?.()}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                } ${!mobile && isCollapsed ? 'lg:justify-center' : ''}`}
              >
                {isActive && (
                  <div className="absolute right-0 top-3 bottom-3 w-1.5 bg-blue-600 rounded-l-full shadow-[0_0_10px_rgba(37,99,235,0.35)]" />
                )}
                <item.icon
                  size={20}
                  className={`transition-colors shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}
                />
                <span className={`text-sm truncate ${!mobile && isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
                {!mobile && isCollapsed && (
                  <div className="hidden lg:block absolute left-full mr-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  // Shared footer (user card + logout)
  const renderFooter = (mobile = false) => (
    <div className="p-4 mt-auto">
      <div className={`bg-gray-50 rounded-[1.5rem] ${!mobile && isCollapsed ? 'p-2' : 'p-4'}`}>
        <Link
          href="/student/profile"
          onClick={() => onClose?.()}
          className={`flex items-center gap-3 mb-3 group cursor-pointer hover:opacity-80 transition-opacity ${!mobile && isCollapsed ? 'lg:justify-center' : ''}`}
        >
          <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 relative group-hover:ring-2 group-hover:ring-blue-200 transition-all">
            {user.avatar && !imgError ? (
              <Image
                key={user.avatar || 'sidebar-avatar'}
                src={user.avatar}
                alt={user.name || 'Student Avatar'}
                fill
                className="object-cover"
                sizes="40px"
                onError={() => setImgError(true)}
              />
            ) : (
              <User size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
            )}
          </div>
          <div className={`overflow-hidden ${!mobile && isCollapsed ? 'hidden' : 'block'}`}>
            <p className="text-xs font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{user.name || 'طالب'}</p>
            <p className="text-[10px] text-gray-500">طالب</p>
          </div>
        </Link>

        {(!isCollapsed || mobile) ? (
          <button
            onClick={handleLogout}
            className="w-full bg-white border border-gray-100 text-red-500 text-xs font-bold py-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            تسجيل الخروج
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="hidden lg:flex mt-2 w-10 h-10 bg-white border border-gray-100 text-red-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all items-center justify-center mx-auto"
            title="تسجيل الخروج"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside
        className={`hidden lg:flex bg-white border-l border-gray-200/60 flex-col transition-all duration-300 relative h-full min-h-[calc(100vh-5rem)] overflow-y-auto ${
          isCollapsed ? 'lg:w-24' : 'lg:w-72'
        }`}
      >
        {/* Desktop collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -left-3 top-10 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm z-[60] hover:bg-gray-50 transition-colors"
        >
          {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Academy header */}
        <div className={`p-6 lg:p-8 flex items-center ${isCollapsed ? 'lg:justify-center' : 'justify-start'}`}>
          {isAcademyLoading ? (
            <div className={`flex ${isCollapsed ? 'lg:flex-col' : 'flex-row'} items-center gap-3 animate-pulse`}>
              <div className="w-12 h-12 bg-gray-200 rounded-2xl shrink-0" />
              <div className={`space-y-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                <div className="w-28 h-5 bg-gray-200 rounded" />
                <div className="w-20 h-3 bg-gray-100 rounded" />
              </div>
            </div>
          ) : (
            <div className={`flex ${isCollapsed ? 'lg:flex-col' : 'flex-row'} items-center gap-3`}>
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0 overflow-hidden relative">
                {academy.logo && !academyLogoError ? (
                  <Image src={academy.logo} alt={academy.name || 'Academy Logo'} fill className="object-cover" sizes="48px" onError={() => setAcademyLogoError(true)} />
                ) : (
                  <GraduationCap size={28} />
                )}
              </div>
              <div className={`text-right overflow-hidden ${isCollapsed ? 'hidden' : 'block'}`}>
                {academy.name && (
                  <>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight truncate">{academy.name}</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">منصة التعلم الذكي</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 mb-4"><div className="h-px bg-gray-50 w-full" /></div>
        {renderNav(false)}
        {renderFooter(false)}
      </aside>

      {/* ─── MOBILE: Backdrop ─── */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isOpen ? 'bg-black/50 backdrop-blur-sm pointer-events-auto' : 'bg-transparent pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ─── MOBILE: Bottom-sheet drawer ─── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="القائمة الجانبية"
        className={`lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-[2rem] shadow-[0_-8px_40px_rgba(0,0,0,0.18)] flex flex-col transition-transform duration-300 ease-out will-change-transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '92dvh' }}
      >
        {/* Pill handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3 shrink-0">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 active:scale-95 transition-all"
            aria-label="إغلاق القائمة"
          >
            <X size={18} />
          </button>

          {/* Academy identity in top bar */}
          <div className="flex items-center gap-2">
            {academy.name && (
              <span className="text-sm font-black text-gray-800 truncate max-w-[140px]">{academy.name}</span>
            )}
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 overflow-hidden relative">
              {academy.logo && !academyLogoError ? (
                <Image src={academy.logo} alt={academy.name || 'Academy'} fill className="object-cover" sizes="32px" onError={() => setAcademyLogoError(true)} />
              ) : (
                <GraduationCap size={18} />
              )}
            </div>
          </div>
        </div>

        {/* Thin divider */}
        <div className="mx-5 h-px bg-gray-100 shrink-0" />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain pt-2">
          {renderNav(true)}
          {renderFooter(true)}
        </div>
      </div>
    </>
  );
};

