'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { StudentSidebar } from '@/components/Student/Layout/Sidebar';
import { StudentHeader } from '@/components/Student/Layout/Header';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLearningPage = pathname?.includes('/learn');

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
      <StudentHeader />
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
