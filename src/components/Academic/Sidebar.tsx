'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, GraduationCap, ChevronLeft, X, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';


interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['الدورات']);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const [user, setUser] = useState<{name: string, role: string} | null>(null);

  useEffect(() => {
    // Get user info from localStorage or decode token if available
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse user info");
        }
    }
  }, []);

  const handleLogout = () => {
      // Clear all auth related items
      localStorage.removeItem('token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('academy_link_name');
      
      // Clear cookies
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
      
      // Redirect to home
      window.location.href = '/';
  };

  const menuItems = [
    {
      label: 'الرئيسية',
      icon: LayoutGrid,
      href: '/academic',
    },
    {
      label: 'الدورات',
      icon: GraduationCap,
      href: '/academic/courses',
      subItems: [
        { label: 'فئات الدورات', href: '/academic/courses/categories' },
        { label: 'الأحصائيات', href: '/academic/courses/stats' },
      ],
    },
  ];

  return (
    <aside className={twMerge(
      "w-72 bg-white h-screen fixed right-0 top-0 border-l border-gray-100 flex flex-col z-[50] transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Logo & Close */}
      <div className="p-8 pb-4 flex items-center justify-between">
           <div className="flex items-center gap-4 pl-4 border-r border-gray-100 mr-2">
              <div className="text-right">
                <h4 className="text-base font-black text-gray-900 leading-none">{user?.name || 'أحمد محمد'}</h4>
                <p className="text-sm text-gray-400 font-bold mt-1">{user?.role || 'الادمن'}</p>
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
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all lg:hidden"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/academic' && pathname.startsWith(item.href));
          const isExpanded = expandedItems.includes(item.label);
          const hasSubItems = (item as any).subItems && (item as any).subItems.length > 0;

          return (
            <div key={item.label} className="space-y-1">
              <div
                className="cursor-pointer"
              >
                <Link
                  href={item.href}
                  className={twMerge(
                    clsx(
                      'flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group',
                      isActive && !isExpanded
                        ? 'bg-[#EBF1FF] text-[#2563eb]'
                        : isExpanded ? 'bg-[#EBF1FF] text-[#2563eb]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    )
                  )}
                  onClick={(e) => {
                     // If we are already on the page, toggle. Otherwise, just navigate.
                     // Actually, we can always toggle if we want, or just let navigation happen.
                     // The user wants to see the page, so navigation is key.
                     if (hasSubItems) {
                        toggleExpand(item.label);
                     }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={22} className={twMerge(
                        isActive ? "text-[#2563eb]" : "text-gray-400 group-hover:text-gray-600"
                    )} />
                    <span className="font-bold text-[15px]">{item.label}</span>
                  </div>
                  {hasSubItems && (
                    <ChevronLeft
                      size={18}
                      className={twMerge(
                        "transition-transform duration-300 text-gray-400",
                        isExpanded ? "-rotate-90" : ""
                      )}
                    />
                  )}
                </Link>
              </div>

              {/* Sub Items Tree Structure */}
              {hasSubItems && isExpanded && (
                <div className="relative mr-[38px] pr-4 mt-1 space-y-1">
                  {/* Vertical Line */}
                  <div className="absolute right-3 top-0 bottom-4 w-px bg-blue-100"></div>

                  {(item as any).subItems.map((subItem: any) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <div key={subItem.label} className="relative pr-6">
                         {/* Horizontal Curve */}
                        <div className="absolute right-[-2.5px] top-1/2 bottom-1/2 w-6 border-r-[2px] border-b-[2px] border-secondary-100/50 border-[#D9E4FF] rounded-br-lg pointer-events-none" />
                        
                        <Link
                          href={subItem.href}
                          className={twMerge(
                            "block py-2 px-2 text-[14px] font-bold rounded-xl transition-all duration-200",
                            isSubActive
                              ? "text-[#2563eb]"
                              : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                          )}
                        >
                          {subItem.label}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      {/* Logout Button */}
      <div className="p-6 border-t border-gray-100">
        <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 font-bold"
        >
            <LogOut size={22} />
            <span className="font-bold text-[15px]">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
