'use client';

import { Bell, Search, Globe, Plus, Menu } from 'lucide-react';
import Image from 'next/image';
import { useModal } from '@/context/ModalContext';

const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { openModal } = useModal();
  const [user, setUser] = useState<{name: string, role: string} | null>(null);

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
          <div className="flex items-center gap-6">
            
            {/* User Profile */}
            <div className="flex items-center gap-3 pr-6 border-r border-gray-100 hidden sm:flex">
               <div className="text-left"> {/* Image is on the left of text in design? No, wait. Avatar is usually outermost. */}
                  {/* Actually in design (Image 1, Left side): Name is on the right of Avatar? No, Avatar is outermost left. */}
                  <div className="w-10 h-10 rounded-full bg-blue-50 relative overflow-hidden ring-2 ring-white shadow-sm">
                      <Image
                        src="/assets/Ellipse.png"
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                  </div>
               </div>
               <div className="text-right">
                  <h4 className="text-sm font-black text-gray-900 leading-none">{user?.name || 'أحمد محمد'}</h4>
                  <p className="text-[10px] text-gray-400 font-black mt-1 leading-none">{user?.role || 'مدير الأكاديمية'}</p>
               </div>
            </div>

            {/* Notification & Language */}
            <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-all text-gray-500 relative">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-900 transition-all cursor-pointer px-2 border-l border-r border-gray-100">
                    <span className="text-xs font-black">العربية</span>
                    <Globe size={18} />
                </div>
            </div>

            {/* Add Course Button */}
            <button 
              onClick={() => openModal('create-course')}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-2.5 rounded-xl font-black text-sm transition-all"
            >
                <Plus size={16} strokeWidth={3} />
                <span>انشاء دورة</span>
            </button>

            {/* Preview Button */}
            <button className="hidden lg:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-100 transition-all">
                <Globe size={16} strokeWidth={3} />
                <span>معاينة الموقع</span>
            </button>
          </div>
        </div>
      </header>


    </>
  );
};

export default Header;

