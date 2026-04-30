'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Settings, 
  User,
  GraduationCap
} from 'lucide-react';

const sidebarItems = [
  { name: 'لوحة التحكم', href: '/student', icon: LayoutDashboard },
  { name: 'دوراتي', href: '/student/courses', icon: BookOpen },
  { name: 'الإنجازات', href: '/student/achievements', icon: Trophy },
  { name: 'الملف الشخصي', href: '/student/profile', icon: User },
  { name: 'الإعدادات', href: '/student/settings', icon: Settings },
];

export const StudentSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-l border-gray-100 flex flex-col h-full hidden lg:flex sticky top-0">
      <div className="p-6 flex flex-col items-center border-b border-gray-50">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
          <GraduationCap size={32} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">مرحباً بك</h2>
        <p className="text-sm text-gray-500">طالب علم</p>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon 
                size={20} 
                className={`transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-4 text-white text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
          <h3 className="font-bold mb-1 relative z-10">النسخة الاحترافية</h3>
          <p className="text-xs text-blue-100 mb-3 relative z-10">قم بترقية حسابك لمزيد من المزايا</p>
          <button className="w-full bg-white text-blue-700 text-sm font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors relative z-10 shadow-sm">
            ترقية الآن
          </button>
        </div>
      </div>
    </aside>
  );
};
