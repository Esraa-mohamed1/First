'use client';

import { Bell, Plus, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CreateCourseModal from './Modals/CreateCourseModal';

const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white h-24 border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
        {/* Start (Left) - Brand Name with Gradient */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all lg:hidden"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-black bg-gradient-to-l from-[#2563eb] to-[#4880FF] bg-clip-text text-transparent hidden lg:block">
            Prime Academy
          </h1>
        </div>

        {/* End (Right) - Actions & Profile */}
        <div className="flex items-center gap-6">
          {/* Action Button - First on the right side */}
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-3 bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black text-lg shadow-lg shadow-blue-100 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Plus size={24} />
            <span>إضافة دورة</span>
          </button>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className="relative p-3 hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 group">
              <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform"></div>
              <Bell size={24} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-4 pl-4 border-r border-gray-100 mr-2">
              <div className="text-right">
                <h4 className="text-base font-black text-gray-900 leading-none">أحمد محمد</h4>
                <p className="text-sm text-gray-400 font-bold mt-1">الادمن</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-white shadow-md overflow-hidden relative">
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

      <CreateCourseModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
};

export default Header;
