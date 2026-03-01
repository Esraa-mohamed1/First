'use client';

import { Bell, Search, Menu } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-white h-20 border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Right Side (Search & Toggle) */}
      <div className="flex items-center gap-6">
        {/* Profile */}
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden relative">
                <Image 
                    src="/assets/Ellipse.png" 
                    alt="Profile"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="text-right hidden md:block">
                <h4 className="text-sm font-bold text-gray-900">أحمد محمد</h4>
                <p className="text-xs text-gray-500 font-medium">الادمن</p>
            </div>
        </div>
      </div>

      {/* Left Side (Profile & Notifications) */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          <Bell size={20} className="text-gray-500" />
        </button>
      </div>
    </header>
  );
};

export default Header;
