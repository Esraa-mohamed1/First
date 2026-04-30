import React from 'react';
import { StudentSidebar } from '@/components/Student/Layout/Sidebar';
import { StudentHeader } from '@/components/Student/Layout/Header';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans" dir="rtl">
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
