'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Settings,
  User,
  GraduationCap,
  LogOut,
  Library
} from 'lucide-react';

const sidebarItems = [
  { name: 'لوحة التحكم', href: '/student', icon: LayoutDashboard },
  { name: 'دوراتي', href: '/student/courses', icon: BookOpen },
  { name: 'دورات الأكاديمية', href: '/user/courses', icon: Library },
  { name: 'الإنجازات', href: '/student/achievements', icon: Trophy },
  { name: 'الملف الشخصي', href: '/student/profile', icon: User },
  { name: 'الإعدادات', href: '/student/settings', icon: Settings },
];

export const StudentSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/auth/login');
  };

  return (
    <aside className="w-72 bg-white border-l border-gray-200/60 flex flex-col h-screen sticky top-0 z-50 overflow-y-auto hidden lg:flex">
      {/* Sidebar Header / Logo Area */}
      <div className="p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <GraduationCap size={32} />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">درب <span className="text-blue-600">Darrab</span></h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">منصة التعلم الذكي</p>
          </div>
        </div>
      </div>

      <div className="px-6 mb-4">
        <div className="h-px bg-gray-50 w-full"></div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1.5 py-4">
        <p className="text-[10px] font-bold text-gray-400 px-4 mb-4 uppercase tracking-widest">القائمة الرئيسية</p>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                ? 'bg-blue-50/50 text-blue-600 font-bold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              {isActive && (
                <div className="absolute right-0 top-3 bottom-3 w-1.5 bg-blue-600 rounded-l-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
              )}
              <item.icon
                size={22}
                className={`transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}
              />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 mt-auto">
        <div className="bg-gray-50 rounded-[2rem] p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
              <User size={20} className="text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">أحمد محمد</p>
              <p className="text-[10px] text-gray-500">طالب نشط</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-white border border-gray-100 text-red-500 text-xs font-bold py-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            تسجيل الخروج
          </button>
        </div>

        <p className="text-[10px] text-center text-gray-400 font-medium italic">إصدار 1.2.0 - © 2024</p>
      </div>
    </aside>
  );
};
