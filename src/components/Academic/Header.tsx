'use client';

import { Bell, Plus, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CreateCourseModal from './Modals/CreateCourseModal';

const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex flex-row items-center justify-between px-4 md:px-10 py-4 gap-4">
          
          {/* Action Buttons & Menu */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-50 rounded-xl transition-all lg:hidden"
            >
              <Menu size={24} className="text-gray-500" />
            </button>

            <div className="flex items-center gap-3">
              <button className="relative p-2 md:p-3 hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 group hidden md:block">
                <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform"></div>
                <Bell size={24} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
              </button>
              
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white px-4 md:px-8 py-2 md:py-3.5 rounded-xl md:rounded-2xl font-black text-xs md:text-lg shadow-lg shadow-blue-100 transition-all transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
              >
                <Plus size={18} className="md:w-6 md:h-6" />
                <span>إضافة دورة</span>
              </button>
            </div>
          </div>
          
          {/* Logo/Title */}
          <div className="flex items-center gap-6">
             <h1 className="text-lg md:text-2xl font-black text-[#2563eb]">Prime Academy</h1>
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
