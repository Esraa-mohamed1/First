import { Metadata } from 'next';
import React from 'react';
import { StudentSidebar } from '@/components/Student/Layout/Sidebar';
import { StudentHeader } from '@/components/Student/Layout/Header';

export const metadata: Metadata = {
  title: 'الدورات التدريبية | المنصة التعليمية',
  description: 'استكشف جميع الدورات التدريبية المتاحة في الأكاديمية وقم بتطوير مهاراتك من خلال برامجنا التعليمية المتنوعة.',
  openGraph: {
    title: 'الدورات التدريبية',
    description: 'استكشف جميع الدورات التدريبية المتاحة في الأكاديمية وقم بتطوير مهاراتك من خلال برامجنا التعليمية المتنوعة.',
    type: 'website',
  }
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
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
