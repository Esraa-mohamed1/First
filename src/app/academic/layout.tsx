'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Academic/Sidebar';
import Header from '@/components/Academic/Header';
import { getProfileStatus } from '@/services/auth';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        localStorage.setItem('token', urlToken);
        document.cookie = `token=${urlToken}; path=/; max-age=86400; SameSite=Lax`;
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }

    const checkVerification = async () => {
      try {
        const response = await getProfileStatus();
        const userData = response.data || response;
        if (userData) {
          localStorage.setItem('user_info', JSON.stringify(userData));
        }

        setIsVerified(!!userData.email_verified_at);
        setIsActive(userData.is_active);

        console.log('Academic verification status:', !!userData.email_verified_at, userData);
      } catch (error) {
        console.error('Failed to check verification:', error);
      }
    };

    checkVerification();
  }, []);

  const handleVerificationClick = () => {
    const userStr = localStorage.getItem('user_info');
    let contact = '';
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        contact = user.email || user.phone || '';
      } catch (e) {
        console.error('Failed to parse user info');
      }
    }

    router.push(`/auth/verification?contact=${encodeURIComponent(contact)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex relative" dir="rtl">


      {/* Verification Overlay - Removed as per user request */}
      {/* {isVerified === false && isActive !== false && (
        <div className="fixed inset-0 z-[100] backdrop-blur-md bg-white/50 flex items-center justify-center">
          <div className="bg-white p-10 rounded-[2rem] shadow-2xl text-center max-w-md border border-red-100 animate-in fade-in zoom-in duration-300 mx-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">حسابك غير مفعل بعد</h3>
            <p className="text-gray-500 mb-8 text-lg font-medium leading-relaxed">
              يرجى تفعيل حسابك للاستمرار في استخدام لوحة التحكم والاستفادة من كافة المميزات.
            </p>
            <button 
              onClick={handleVerificationClick}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/30 hover:-translate-y-1"
            >
              تفعيل الحساب
            </button>
          </div>
        </div>
      )} */}


      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:mr-72 transition-all duration-300 w-full overflow-x-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="p-8 md:p-12 max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
