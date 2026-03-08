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
     

        <div className="flex items-center gap-6">
          {/* Action Button - First on the right side */}
                <button className="relative p-3 hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 group">
              <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform"></div>
              <Bell size={24} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
            </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-3 bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black text-lg shadow-lg shadow-blue-100 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Plus size={24} />
            <span>إضافة دورة</span>
          </button>

        </div>
        
          <div className="flex items-left   gap-6">
                   <h1 className="text-2xl font-black text-[#2563eb]">Prime Academy</h1>

         
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
