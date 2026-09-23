'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { StudentSidebar } from '@/components/Student/Layout/Sidebar';
import { StudentHeader } from '@/components/Student/Layout/Header';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLearningPage = pathname?.includes('/learn');

  // Close mobile sidebar automatically on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isLearningPage) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex flex-col font-sans" dir="rtl">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col font-sans" dir="rtl">
      <StudentHeader
        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
        isMobileMenuOpen={isSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
