'use client';

import { Plus, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SelectCourseTypeModal from './Modals/SelectCourseTypeModal';

const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string, role: string } | null>(null);
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user_info');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && (parsed.name || parsed.academy_name)) {
            setUser(parsed);
            return true;
          }
        } catch (e) {
          console.error("Failed to parse user info");
        }
      }
      return false;
    };

    if (!loadUser()) {
      const interval = setInterval(() => {
        if (loadUser()) {
          clearInterval(interval);
        }
      }, 300);
      const timer = setTimeout(() => clearInterval(interval), 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex flex-row items-center justify-between px-6 py-4 gap-8 relative">

          {/* Right Side: Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-50 rounded-xl transition-all lg:hidden"
            >
              <Menu size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Center: Preview Website Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <button
              onClick={() => window.open('/', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-100 transition-all whitespace-nowrap"
            >
              معاينة الموقع
            </button>
          </div>

          {/* Left Side: Actions & Profile */}
          <div className="flex items-center gap-4">

            {/* Add Course Button Control */}
            <button
              onClick={() => setIsSelectTypeModalOpen(true)}
              className="flex items-center gap-2 group cursor-pointer transition-all"
            >
              <div className="w-10 h-10 bg-blue-600 group-hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 transition-all shrink-0">
                <Plus size={20} strokeWidth={3} />
              </div>
              <span className="bg-white border border-blue-100 text-blue-600 group-hover:bg-blue-50/60 px-3.5 py-2 rounded-xl text-xs font-black shadow-xs whitespace-nowrap hidden sm:inline-block transition-colors">
                إضافة دورة
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pr-4 border-r border-gray-100 hidden sm:flex">
              {user?.name ? (
                <>
                  <div className="text-right">
                    <h4 className="text-sm font-black text-gray-900 leading-none">{user.name}</h4>
                    {user.role && (
                      <p className="text-[10px] text-gray-400 font-bold mt-1.5 leading-none">{user.role}</p>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm ring-2 ring-white shadow-sm shrink-0">
                    {user.name.charAt(0)}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-right space-y-1.5">
                    <div className="h-3.5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-2.5 w-14 bg-gray-100 rounded-md animate-pulse"></div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse ring-2 ring-white shadow-sm shrink-0"></div>
                </>
              )}
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
