import React from 'react';
import Sidebar from '@/components/Dashboard/Sidebar';
import Header from '@/components/Dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8faff] flex">
      <Sidebar />
      <main className="flex-1 mr-64 transition-all duration-300">
        <Header />
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
