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

export const StudentSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);

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
          if (name && name !== 'أحمد محمد') {
            return { name, avatar };
          }
        }
        if (cachedName && cachedName !== 'أحمد محمد') {
          return { name: cachedName, avatar: null };
        }
      } catch (e) {
        // Fallback
      }
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
          if (name && name !== 'Darrab' && name !== 'درب Darrab') {
            return { name, logo };
          }
        }
      } catch (e) {
        // Fallback
      }
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
          if (name && name !== 'Darrab' && name !== 'درب Darrab') {
            return false;
          }
        }
      } catch (e) {
        // Fallback
      }
    }
    return true;
  });

  const [imgError, setImgError] = useState(false);
  const [academyLogoError, setAcademyLogoError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user.avatar]);

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
          if (name && name !== 'أحمد محمد' && isMounted) {
            setUser({ name, avatar });
          }
        } else if (cachedName && cachedName !== 'أحمد محمد' && isMounted) {
          setUser(prev => ({ ...prev, name: cachedName }));
        }
      } catch (e) {
        // Fallback
      }
    }

    const fetchAcademy = async () => {
      try {
        const data = await getMyAcademyProfile();
        if (isMounted) {
          if (data) {
            const name = data.name || data.site_name || data.academy_name || '';
            const logo = data.logo || data.logo_url || null;
            if (name || logo !== undefined) {
              setAcademy(prev => ({
                name: name || prev.name,
                logo: logo !== undefined ? logo : prev.logo,
              }));
              setAcademyLogoError(false);
            }
          }
          setIsAcademyLoading(false);
        }
      } catch (err) {
        console.warn('Failed to fetch academy profile in sidebar:', err);
        if (isMounted) {
          setIsAcademyLoading(false);
        }
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
          setUser(prev => ({
            name: updatedName || prev.name,
            avatar: updatedAvatar !== undefined ? updatedAvatar : prev.avatar,
          }));
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
          setAcademy(prev => ({
            name: name || prev.name,
            logo: logo !== undefined ? logo : prev.logo,
          }));
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

  return (
    <aside className={`${isCollapsed ? 'w-24' : 'w-72'} bg-white border-l border-gray-200/60 flex flex-col h-screen sticky top-0 z-50 overflow-y-auto hidden lg:flex transition-all duration-300 relative`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3 top-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm z-[60] hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Sidebar Header / Logo Area */}
      <div className={`p-8 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        {isAcademyLoading ? (
          <div className={`flex ${isCollapsed ? 'flex-col' : 'flex-row'} items-center gap-3 animate-pulse`}>
            <div className="w-12 h-12 bg-gray-200 rounded-2xl shrink-0"></div>
            {!isCollapsed && (
              <div className="space-y-2">
                <div className="w-28 h-5 bg-gray-200 rounded"></div>
                <div className="w-20 h-3 bg-gray-100 rounded"></div>
              </div>
            )}
          </div>
        ) : (
          <div className={`flex ${isCollapsed ? 'flex-col' : 'flex-row'} items-center gap-3`}>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0 overflow-hidden relative">
              {academy.logo && !academyLogoError ? (
                <Image
                  src={academy.logo}
                  alt={academy.name || 'Academy Logo'}
                  fill
                  className="object-cover"
                  sizes="48px"
                  onError={() => setAcademyLogoError(true)}
                />
              ) : (
                <GraduationCap size={28} />
              )}
            </div>
            {!isCollapsed && (
              <div className="text-right overflow-hidden">
                {academy.name ? (
                  <>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight truncate">
                      {academy.name}
                    </h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">منصة التعلم الذكي</p>
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-6 mb-4">
        <div className="h-px bg-gray-50 w-full"></div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-x-hidden">
        {sidebarGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            {!isCollapsed && <p className="text-[10px] font-bold text-gray-400 px-4 mb-3 uppercase tracking-widest">{group.title}</p>}
            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                    ? 'bg-blue-50/50 text-blue-600 font-bold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  {isActive && (
                    <div className="absolute right-0 top-3 bottom-3 w-1.5 bg-blue-600 rounded-l-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                  )}
                  <item.icon
                    size={22}
                    className={`transition-colors duration-300 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}
                  />
                  {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}

                  {isCollapsed && (
                    <div className="absolute left-full mr-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className={`p-4 mt-auto ${isCollapsed ? 'items-center' : ''}`}>
        <div className={`bg-gray-50 rounded-[2rem] ${isCollapsed ? 'p-2' : 'p-4'} mb-6`}>
          <Link
            href="/student/profile"
            className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'mb-3'} group cursor-pointer hover:opacity-80 transition-opacity`}
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
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{user.name || 'طالب'}</p>
                <p className="text-[10px] text-gray-500">طالب</p>
              </div>
            )}
          </Link>
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full bg-white border border-gray-100 text-red-500 text-xs font-bold py-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              تسجيل الخروج
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="mt-2 w-10 h-10 bg-white border border-gray-100 text-red-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center"
              title="تسجيل الخروج"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>

        {!isCollapsed && <p className="text-[10px] text-center text-gray-400 font-medium italic"></p>}
      </div>
    </aside>
  );
};
