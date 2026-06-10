'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Search, Menu } from 'lucide-react';
import Image from 'next/image';

export const StudentHeader = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-200/60 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-6">
        <button className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors">
          <Menu size={24} />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-blue-600 tracking-tight flex items-center">
            Darrab
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-8">
          <Link href="/student" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">الرئيسية</Link>
          <Link href="/student/courses" className="text-blue-600 font-semibold border-b-2 border-blue-600 py-7">دوراتي</Link>
          <Link href="/student/paths" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">المسارات</Link>
          <Link href="/student/reports" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">التقارير</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="ابحث عن دورة..."
            className="bg-[#EAEFEF] text-sm border-none rounded-full py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="flex flex-col items-end hidden sm:block">
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">أحمد محمد</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold overflow-hidden ring-2 ring-gray-100">
            {/* If there was an image: <Image src="..." alt="..." fill /> */}
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

// Also import User for the placeholder
import { User } from 'lucide-react';
