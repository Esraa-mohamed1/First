'use client';

import { Bell, Search, Globe, Plus, Menu, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SelectCourseTypeModal from './Modals/SelectCourseTypeModal';

const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string, role: string } | null>(null);
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user info");
      }
    }
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex flex-row items-center justify-between px-6 py-4 gap-8">

          {/* Right Side: Search */}
          <div className="flex-1 flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-50 rounded-xl transition-all lg:hidden"
            >
              <Menu size={24} className="text-gray-500" />
            </button>
            <div className="relative w-full max-w-xl hidden md:block">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="البحث في الدورات والطلاب"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pr-12 pl-4 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-bold"
              />
            </div>
          </div>

          {/* Left Side: Actions & Profile */}
          <div className="flex items-center gap-4">

            {/* Add Course Button (Plus Square Button) */}
            <button
              onClick={() => setIsSelectTypeModalOpen(true)}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 transition-all shrink-0"
            >
              <Plus size={20} strokeWidth={3} />
            </button>

            {/* Preview Website Button */}
            <button
              onClick={() => window.open('/', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-100 transition-all whitespace-nowrap hidden md:block"
            >
              معاينة الموقع
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-all cursor-pointer px-2 border-r border-l border-gray-100 hidden sm:flex">
              <ChevronDown size={14} className="text-gray-400 mt-0.5" />
              <span className="text-xs font-black">العربية</span>
              <Globe size={16} className="text-gray-400" />
            </div>

            {/* Notification Bell */}
            <button className="w-10 h-10 hover:bg-gray-50 rounded-full transition-all text-gray-500 relative flex items-center justify-center bg-gray-50/50">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pr-4 border-r border-gray-100 hidden sm:flex">
              <div className="text-right">
                <h4 className="text-sm font-black text-gray-900 leading-none">{user?.name || 'أحمد محمد'}</h4>
                <p className="text-[10px] text-gray-400 font-bold mt-1.5 leading-none">{user?.role || 'مدير الأكاديمية'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 relative overflow-hidden ring-2 ring-white shadow-sm shrink-0">
                <Image
                  src="/assets/Ellipse.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </header>
      <SelectCourseTypeModal
        isOpen={isSelectTypeModalOpen}
        onClose={() => setIsSelectTypeModalOpen(false)}
      />
    </>
  );
};

export default Header;
