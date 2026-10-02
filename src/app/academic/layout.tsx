'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Academic/Sidebar';
import Header from '@/components/Academic/Header';
import { getProfileStatus } from '@/services/auth';
import { useRouter, usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Load collapsed state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('academic_sidebar_collapsed');
      if (saved !== null) {
        try {
          setIsSidebarCollapsed(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse sidebar collapsed state:', e);
        }
      }
    }
  }, []);

  const handleToggleSidebar = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidebarCollapsed(prev => {
        const next = !prev;
        localStorage.setItem('academic_sidebar_collapsed', JSON.stringify(next));
        return next;
      });
    } else {
      setIsSidebarOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        localStorage.setItem('token', urlToken);
        document.cookie = `token=${urlToken}; path=/; max-age=86400; SameSite=Lax`;
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } else {
        const localToken = localStorage.getItem('token');
        if (!localToken) {
          // Allow guest access to landing page, redirect only if trying to access academic routes
          if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            if (path.startsWith('/academic') && !path.includes('/student')) {
              router.push('/auth/login');
              return;
            }
          }
        }
      }
    }

    const checkVerification = async () => {
      try {
        const response = await getProfileStatus();
        const userData = response.data || response;
        if (userData) {
          localStorage.setItem('user_info', JSON.stringify(userData));
          
          if (userData.role === 'coach' || userData.role === 'instructor' || userData.role === 'teacher') {
            router.push('/student');
            return;
          }
        }

        setIsVerified(!!userData.email_verified_at);
        setIsActive(userData.is_active);

        console.log('Academic verification status:', !!userData.email_verified_at, userData);
      } catch (error) {
        console.error('Failed to check verification:', error);
        // Only redirect to login if not on guest landing page
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          if (path.startsWith('/academic') && !path.includes('/student')) {
            router.push('/auth/login');
          }
        }
      }
    };

    const localToken = localStorage.getItem('token');
    if (localToken) {
      checkVerification();
    }
  }, [router]);

  // On course create/edit pages, the course's own header acts as the main nav.
  const isCourseCreateOrEdit =
    pathname === '/academic/courses/create' ||
    /^\/academic\/courses\/\d+/.test(pathname);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex relative" dir="rtl">

      {!pathname.match(/\/courses\/.*\/student/) && (
        <>
          {/* Mobile backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-[45] lg:hidden backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => {
              setIsSidebarCollapsed(prev => {
                const next = !prev;
                localStorage.setItem('academic_sidebar_collapsed', JSON.stringify(next));
                return next;
              });
            }}
          />
        </>
      )}

      <main
        className={twMerge(
          'flex-1 transition-all duration-300 ease-in-out w-full overflow-x-hidden',
          !pathname.match(/\/courses\/.*\/student/) && (isSidebarCollapsed ? 'lg:mr-20' : 'lg:mr-72')
        )}
      >
        {/* Top Header */}
        {!pathname.match(/\/courses\/.*\/student/) && !isCourseCreateOrEdit && (
          <Header
            onToggleSidebar={handleToggleSidebar}
            onMenuClick={() => setIsSidebarOpen(true)}
            isSidebarCollapsed={isSidebarCollapsed}
            isMobileSidebarOpen={isSidebarOpen}
          />
        )}

        <div
          className={twMerge(
            !pathname.match(/\/courses\/.*\/student/)
              ? isCourseCreateOrEdit
                ? 'p-0 max-w-[1800px] mx-auto'
                : 'p-6 sm:p-8 md:p-12 max-w-[1800px] mx-auto'
              : ''
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
