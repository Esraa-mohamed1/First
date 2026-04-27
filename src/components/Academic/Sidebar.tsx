'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, GraduationCap, Users, FileText, Package, TrendingUp, Settings, LogOut, ChevronLeft, X, LayoutDashboard, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { useModal } from '@/context/ModalContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['الدورات']);
  const [user, setUser] = useState<{ name: string, role: string } | null>(null);
  const { openModal } = useModal();

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

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

  const menuItems = [
    {
      label: 'الرئيسية',
      icon: LayoutDashboard,
      href: '/academic',
    },
    {
      label: 'الدورات',
      icon: GraduationCap,
      href: '/academic/courses',
      subItems: [
        { label: 'كل الدورات', href: '/academic/courses' },
        { label: 'فئات الدورات', href: '/academic/courses/categories' },
        { label: 'الأحصائيات', href: '/academic/courses/stats' },
      ],
    },
    {
      label: 'الطلاب',
      icon: Users,
      href: '/academic/students',
    },
    {
      label: 'التقارير',
      icon: FileText,
      href: '/academic/reports',
    },
    {
      label: 'الباقة والأستخدام',
      icon: Package,
      href: '/academic/packages',
    },
    {
      label: 'المبيعات',
      icon: TrendingUp,
      href: '/academic/sales',
    },
    {
      label: 'الأعدادات',
      icon: Settings,
      href: '/academic/settings',
    },
  ];

  return (
    <aside className={twMerge(
      "w-72 bg-white h-screen fixed right-0 top-0 border-l border-gray-100 flex flex-col z-[50] transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Branding Section */}
      <div className="p-8 pb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100">
            د
          </div>
          <h1 className="text-3xl font-black text-blue-600 tracking-tight">درب</h1>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all lg:hidden"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/academic' && pathname.startsWith(item.href));
          const hasSubItems = (item as any).subItems && (item as any).subItems.length > 0;
          const isExpanded = expandedItems.includes(item.label);

          return (
            <div key={item.label} className="group space-y-1">
              <Link
                href={item.href}
                onClick={(e) => {
                  if (hasSubItems) {
                    e.preventDefault();
                    toggleExpand(item.label);
                  }
                }}
                className={twMerge(
                  'flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300',
                  isActive
                    ? 'bg-[#EBF1FF] text-[#2563eb]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={22} className={twMerge(
                    isActive ? "text-[#2563eb]" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  <span className="font-bold text-[15px]">{item.label}</span>
                </div>
                {hasSubItems && (
                  <ChevronLeft
                    size={16}
                    className={twMerge(
                      "transition-transform duration-300 text-gray-400",
                      isExpanded ? "rotate-90 text-[#2563eb]" : ""
                    )}
                  />
                )}
              </Link>

              {hasSubItems && isExpanded && (
                <div className="mr-8 pr-2 space-y-1 relative">
                  <div className="absolute right-[1px] top-0 bottom-6 w-[2px] bg-[#D9E4FF]" />
                  {(item as any).subItems.map((subItem: { label: string; href: string }) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={twMerge(
                          "flex items-center justify-end px-4 py-2 text-sm font-bold rounded-xl transition-all relative",
                          isSubActive
                            ? "text-blue-600 bg-blue-50/50"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
                        )}
                      >
                        <span className="text-[13px]">{subItem.label}</span>
                        <div className="absolute right-[-3.5px] top-0 bottom-1/2 w-4 border-r-[2px] border-b-[2px] border-[#D9E4FF] rounded-br-lg pointer-events-none" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Help & Support Area */}
      <div className="p-6 border-t border-gray-100 space-y-4">
        <button
          onClick={() => openModal('create-course')}
          className="w-full bg-blue-600 rounded-xl p-3 flex items-center justify-center gap-2 text-white font-bold text-sm shadow-lg shadow-blue-100 hover:brightness-110 transition-all"
        >
          <Plus size={18} strokeWidth={3} />
          <span>انشاء دورة جديدة</span>
        </button>
        <div className="flex flex-col gap-2 px-2">
          <button className="flex items-center gap-3 text-gray-500 hover:text-blue-600 transition-colors font-bold text-sm group">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <Users size={16} />
            </div>
            <span>مركز المساعدة</span>
          </button>
          <button className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors font-bold text-sm group">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut size={16} />
            </div>
            <span onClick={() => { localStorage.clear(); window.location.href = '/'; }}>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

