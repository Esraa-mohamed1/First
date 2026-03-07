'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Academic/Sidebar';
import Header from '@/components/Academic/Header';

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex" dir="rtl">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on the right */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:mr-72 transition-all duration-300 w-full overflow-x-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="p-8 md:p-12 max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
