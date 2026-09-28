'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  Plus,
  ChevronDown,
  UserPlus,
  GraduationCap,
  User,
  KeyRound,
  Globe,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import SelectCourseTypeModal from './Modals/SelectCourseTypeModal';
import { clearUserSessionAndCache } from '@/lib/auth-storage';
import { getMeProfile } from '@/services/auth';

interface HeaderUser {
  name?: string;
  academy_name?: string;
  title?: string;
  email?: string;
  role?: string;
  logo?: string;
  avatar?: string;
  profile_image?: string;
}

interface DropdownItemConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  isDanger?: boolean;
}

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<HeaderUser | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const addMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  // Close all open dropdowns
  const closeAllDropdowns = useCallback(() => {
    setIsAddMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsNotificationsOpen(false);
  }, []);

  // Handle outside click & Escape key
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(target) &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(target) &&
        notificationsMenuRef.current &&
        !notificationsMenuRef.current.contains(target)
      ) {
        closeAllDropdowns();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeAllDropdowns]);

  // Load user data from localStorage & API
  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem('user_info');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed) {
            setUser(parsed);
            return true;
          }
        } catch (e) {
          console.error('Failed to parse user info:', e);
        }
      }
      return false;
    };

    loadUserFromStorage();

    const fetchUserProfile = async () => {
      try {
        const response = await getMeProfile();
        const data = response?.data || response;
        if (data) {
          setUser(prev => ({
            ...prev,
            ...data,
            name: data.name || data.academy_name || data.title || prev?.name,
            email: data.email || prev?.email,
          }));
        }
      } catch (e) {
        // Fallback to storage data
      }
    };

    fetchUserProfile();

    const handleStorageChange = () => {
      loadUserFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Add dropdown actions config (ONLY 2 items: إضافة طالب & إضافة دورة)
  const addMenuItems: DropdownItemConfig[] = [
    {
      id: 'add-student',
      label: 'إضافة طالب',
      icon: UserPlus,
      onClick: () => {
        setIsAddMenuOpen(false);
        router.push('/academic/students');
      },
    },
    {
      id: 'add-course',
      label: 'إضافة دورة',
      icon: GraduationCap,
      onClick: () => {
        setIsAddMenuOpen(false);
        setIsSelectTypeModalOpen(true);
      },
    },
  ];

  // Profile navigation items config
  const profileNavItems: DropdownItemConfig[] = [
    {
      id: 'academy-data',
      label: 'الملف الشخصي',
      icon: User,
      href: '/academic/settings/academy',
    },
    {
      id: 'account-settings',
      label: 'إعدادات الحساب',
      icon: KeyRound,
      href: '/academic/settings/login-data',
    },
    {
      id: 'website-settings',
      label: 'إعدادات الموقع',
      icon: Globe,
      href: '/academic/domain',
    },
  ];

  const handleLogout = () => {
    closeAllDropdowns();
    clearUserSessionAndCache();
    window.location.href = '/auth/login';
  };

  const displayName = user?.name || user?.academy_name || user?.title || 'الأكاديمية';
  const displayEmail = user?.email || 'admin@darab.academy';
  const avatarChar = displayName.charAt(0).toUpperCase() || 'أ';

  return (
    <>
      <header
        className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200"
        dir="rtl"
      >
        <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 gap-3 sm:gap-4 max-w-[1800px] mx-auto">
          
          {/* Right Section: Mobile Toggle, Search & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={onMenuClick}
              className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-150 lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
              aria-label="القائمة الجانبية"
            >
              <Menu size={22} />
            </button>

            {/* Search Input Bar */}
            <div className="relative hidden md:flex items-center text-gray-400 focus-within:text-blue-600 transition-colors">
              <Search size={17} className="absolute right-3.5 pointer-events-none text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث..."
                className="w-44 lg:w-60 bg-gray-50/80 hover:bg-gray-100/70 focus:bg-white text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm font-medium pr-10 pl-3.5 py-2.5 rounded-xl border border-gray-200/70 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-150"
              />
            </div>

            {/* Notifications Button & Dropdown */}
            <div className="relative" ref={notificationsMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(prev => !prev);
                  setIsAddMenuOpen(false);
                  setIsProfileMenuOpen(false);
                }}
                className={twMerge(
                  'w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 cursor-pointer',
                  isNotificationsOpen
                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-xs'
                    : 'bg-white border-gray-200/70 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                )}
                aria-label="الإشعارات"
                aria-haspopup="true"
                aria-expanded={isNotificationsOpen}
              >
                <Bell size={18} />
                <span className="absolute top-2.5 left-2.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-right">
                  <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">الإشعارات</span>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      جديد
                    </span>
                  </div>
                  <div className="py-6 text-center text-gray-500 text-xs">
                    <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 size={20} />
                    </div>
                    <p className="font-medium text-gray-700">لا توجد إشعارات جديدة</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">أنت على اطلاع دائم بكافة التحديثات</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Section: "معاينة الموقع" (Preview Site) Button */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => window.open('/', '_blank')}
              className="bg-white hover:bg-blue-50/80 border border-gray-200/80 hover:border-blue-200 text-gray-700 hover:text-blue-600 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
            >
              <ExternalLink size={15} className="text-gray-500 group-hover:text-blue-600 transition-colors shrink-0" />
              <span className="whitespace-nowrap">معاينة الموقع</span>
            </button>
          </div>

          {/* Left Section: "إضافة" Button & Profile Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* "إضافة" (Add) Button + Dropdown */}
            <div className="relative" ref={addMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsAddMenuOpen(prev => !prev);
                  setIsProfileMenuOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all duration-150 flex items-center gap-2 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
                aria-haspopup="true"
                aria-expanded={isAddMenuOpen}
              >
                <Plus size={17} strokeWidth={2.5} className="shrink-0" />
                <span className="whitespace-nowrap">إضافة</span>
                <ChevronDown
                  size={14}
                  className={twMerge(
                    'transition-transform duration-200 shrink-0',
                    isAddMenuOpen ? '-rotate-180' : ''
                  )}
                />
              </button>

              {/* Add Dropdown Menu (Contains only 2 items) */}
              {isAddMenuOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="space-y-0.5">
                    {addMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={item.onClick}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-150 text-right cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:text-blue-600 transition-colors shrink-0">
                            <Icon size={16} />
                          </div>
                          <span className="flex-1 leading-none">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="h-7 w-px bg-gray-200/80 hidden sm:block mx-0.5" />

            {/* Profile Trigger & Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(prev => !prev);
                  setIsAddMenuOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className={twMerge(
                  'flex items-center gap-2.5 sm:gap-3 p-1 sm:p-1.5 -m-1 rounded-xl transition-all duration-150 cursor-pointer group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20',
                  isProfileMenuOpen ? 'bg-gray-50' : 'hover:bg-gray-50/80'
                )}
                aria-haspopup="true"
                aria-expanded={isProfileMenuOpen}
              >
                {/* User Info (Desktop / Tablet) */}
                <div className="text-right hidden sm:block min-w-0">
                  <h4 className="text-sm font-black text-gray-900 leading-tight truncate max-w-[130px] md:max-w-[170px]">
                    {displayName}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-bold mt-0.5 leading-tight">
                    مدرس
                  </p>
                </div>

                {/* Avatar Initial */}
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm ring-2 ring-blue-50 shadow-xs shrink-0 select-none">
                  {avatarChar}
                </div>

                {/* Chevron */}
                <ChevronDown
                  size={15}
                  className={twMerge(
                    'text-gray-400 group-hover:text-gray-600 transition-transform duration-200 shrink-0 hidden sm:block',
                    isProfileMenuOpen ? '-rotate-180 text-blue-600' : ''
                  )}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-right">
                  
                  {/* User Profile Header */}
                  <div className="px-3.5 py-3 flex items-center gap-3 bg-gray-50/60 rounded-xl mb-1">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm ring-2 ring-white shadow-xs shrink-0">
                      {avatarChar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-gray-900 truncate leading-snug">
                        {displayName}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium truncate leading-snug dir-ltr text-right">
                        {displayEmail}
                      </p>
                    </div>
                  </div>

                  <div className="my-1 border-t border-gray-100" />

                  {/* Navigation Links */}
                  <div className="space-y-0.5">
                    {profileNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/academic' && pathname?.startsWith(item.href || ''));

                      return (
                        <Link
                          key={item.id}
                          href={item.href || '#'}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className={twMerge(
                            'w-full flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl transition-all duration-150',
                            isActive
                              ? 'bg-blue-50 text-blue-600 font-bold shadow-2xs'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 font-semibold'
                          )}
                        >
                          <div
                            className={twMerge(
                              'w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0',
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-50 text-gray-500 group-hover:text-blue-600'
                            )}
                          >
                            <Icon size={16} />
                          </div>
                          <span className="flex-1 leading-none">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="my-1 border-t border-gray-100" />

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-150 text-right cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                      <LogOut size={16} />
                    </div>
                    <span className="flex-1 leading-none">تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Select Course Type Modal (Unchanged functionality) */}
      <SelectCourseTypeModal
        isOpen={isSelectTypeModalOpen}
        onClose={() => setIsSelectTypeModalOpen(false)}
      />
    </>
  );
};

export default Header;
