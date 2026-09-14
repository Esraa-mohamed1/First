'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, User } from 'lucide-react';
import Image from 'next/image';
import { getStudentProfileStatus, getMyAcademyProfile } from '@/services/student-auth';
import { normalizeProfileImageUrl } from '@/lib/utils';

interface StudentHeaderUserData {
  name: string;
  avatar?: string | null;
}

interface AcademyProfileData {
  name: string;
  logo?: string | null;
}

export const StudentHeader = () => {
  const pathname = usePathname() || '';
  const [user, setUser] = useState<StudentHeaderUserData>(() => {
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
    return { name: '', avatar: null };
  });

  const [isUserLoading, setIsUserLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedUserStr = localStorage.getItem('user_info');
        const cachedName = localStorage.getItem('user_name');
        if (cachedUserStr) {
          const parsed = JSON.parse(cachedUserStr);
          const name = parsed?.name || cachedName || '';
          if (name && name !== 'أحمد محمد') {
            return false;
          }
        } else if (cachedName && cachedName !== 'أحمد محمد') {
          return false;
        }
      } catch (e) {
        // Fallback
      }
    }
    return true;
  });

  const [academy, setAcademy] = useState<AcademyProfileData>(() => {
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

    const fetchMe = async () => {
      try {
        const response = await getStudentProfileStatus();
        const raw = response?.data || response;
        if (raw && isMounted) {
          const name = raw.name || raw.fullName || '';
          const avatarRaw = raw.profile_image || raw.avatar || raw.image || null;
          const avatar = avatarRaw ? normalizeProfileImageUrl(avatarRaw) : null;

          if (name) {
            setUser({ name, avatar });
            setImgError(false);

            if (typeof window !== 'undefined') {
              try {
                const cached = localStorage.getItem('user_info');
                const u = cached ? JSON.parse(cached) : {};
                localStorage.setItem(
                  'user_info',
                  JSON.stringify({
                    ...u,
                    ...raw,
                    name,
                    profile_image: avatar,
                  })
                );
                localStorage.setItem('user_name', name);
              } catch (e) {
                console.error('Failed to update cached user info:', e);
              }
            }
          }
        }
      } catch (err) {
        // Preserve existing cached user_info if available, no other API fallback
        console.warn('Failed to fetch student /me status:', err);
      } finally {
        if (isMounted) {
          setIsUserLoading(false);
        }
      }
    };

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
        console.warn('Failed to fetch academy profile:', err);
        if (isMounted) {
          setIsAcademyLoading(false);
        }
      }
    };

    fetchMe();
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
        setIsUserLoading(false);
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

  return (
    <header className="h-20 bg-white border-b border-gray-200/60 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-6">
        <button className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors">
          <Menu size={24} />
        </button>

        <Link href="/" className="flex items-center gap-3">
          {isAcademyLoading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-gray-200 shrink-0"></div>
              <div className="w-28 h-6 rounded-md bg-gray-200"></div>
            </div>
          ) : (
            <>
              {academy.logo && !academyLogoError && (
                <div className="w-9 h-9 relative rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={academy.logo}
                    alt={academy.name || 'Academy Logo'}
                    fill
                    className="object-contain"
                    sizes="36px"
                    onError={() => setAcademyLogoError(true)}
                  />
                </div>
              )}
              {academy.name ? (
                <div className="text-2xl font-bold text-blue-600 tracking-tight flex items-center">
                  {academy.name}
                </div>
              ) : null}
            </>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-8">
          <Link
            href="/"
            className={`font-medium transition-colors py-7 ${
              pathname === '/'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            الرئيسية
          </Link>
          <Link
            href="/student/courses"
            className={`font-medium transition-colors py-7 ${
              pathname.startsWith('/student/courses')
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            دوراتي
          </Link>
          <Link
            href="/student/bags"
            className={`font-medium transition-colors py-7 ${
              pathname.startsWith('/student/bags')
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            الحقائب
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        <Link href="/student/profile" className="flex items-center gap-3 cursor-pointer group">
          <div className="flex flex-col items-end hidden sm:block">
            {isUserLoading ? (
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            ) : user.name ? (
              <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {user.name}
              </span>
            ) : null}
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold overflow-hidden ring-2 ring-gray-100 relative">
            {user.avatar && !imgError ? (
              <Image
                key={user.avatar || 'header-avatar'}
                src={user.avatar}
                alt={user.name || 'Student Avatar'}
                fill
                className="object-cover"
                sizes="40px"
                onError={() => setImgError(true)}
              />
            ) : (
              <User size={20} />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};

