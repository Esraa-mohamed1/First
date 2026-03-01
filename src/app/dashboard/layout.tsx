'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Dashboard/Sidebar';
import Header from '@/components/Dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8faff] flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:mr-64 transition-all duration-300 w-full overflow-x-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
