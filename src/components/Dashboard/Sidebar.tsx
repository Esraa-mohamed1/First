'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, CreditCard, FileText, Settings, LogOut, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['ادارة الباقات']);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const menuItems = [
    {
      label: 'الرئيسية',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      label: 'ادارة الباقات',
      icon: Package,
      href: '/dashboard/packages',
      subItems: [
        { label: 'عرض الباقات', href: '/dashboard/packages' },
        { label: 'إدارة المميزات', href: '/dashboard/features' },
        { label: 'إضافة / تعديل باقة', href: '/dashboard/packages/create' },
      ],
    },
    {
      label: 'المدفوعات',
      icon: CreditCard,
      href: '/dashboard/payments',
    },
    {
      label: 'التقارير',
      icon: FileText,
      href: '/dashboard/reports',
    },
    {
      label: 'الإعدادات',
      icon: Settings,
      href: '/dashboard/settings',
    },
  ];

  return (
    <aside className={twMerge(
      "w-64 bg-white h-screen fixed right-0 top-0 border-l border-gray-100 flex flex-col z-[50] shadow-[0_4px_30px_0px_rgba(72,128,255,0.2)] transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Logo & Close */}
      <div className="p-6 flex items-center justify-between border-b border-gray-50">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all lg:hidden"
        >
          <X size={20} className="text-gray-500" />
        </button>
        <h1 className="text-3xl font-black text-blue-600">First</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const isExpanded = expandedItems.includes(item.label);
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.label} className="space-y-1">
              <div
                onClick={() => hasSubItems && toggleExpand(item.label)}
                className="cursor-pointer"
              >
                <Link
                  href={hasSubItems ? '#' : item.href}
                  className={twMerge(
                    clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                      isActive
                        ? 'bg-[#D9E4FF] text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    )
                  )}
                  onClick={(e) => {
                    if (hasSubItems) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon
                    size={20}
                    className={twMerge(
                      clsx(
                        'transition-colors',
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      )
                    )}
                  />
                  <span className="font-bold text-sm flex-1">{item.label}</span>
                  {hasSubItems && (
                    <div className={twMerge(
                      "w-5 h-5 flex items-center justify-center transition-transform",
                      isExpanded ? "" : "rotate-180"
                    )}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                    </div>
                  )}
                </Link>
              </div>

              {hasSubItems && isExpanded && (
                <div className="mr-8 pr-1 mt-1 space-y-1 relative">
                  {/* Main Vertical Line */}
                  <div className="absolute right-[1px] top-0 bottom-6 w-[2px] bg-[#D9E4FF]" />

                  {item.subItems.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={twMerge(
                          "flex items-center justify-end px-4 py-2 text-sm font-bold rounded-xl transition-all relative group",
                          isSubActive
                            ? "text-blue-600 bg-blue-50/50"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
                        )}
                      >
                        <span className="text-[13px]">{subItem.label}</span>

                        {/* Horizontal Connector Branch (L-shape part) */}
                        <div className="absolute right-[-3.5px] top-0 bottom-1/2 w-4 border-r-[2px] border-b-[2px] border-secondary-100/50 border-[#D9E4FF] rounded-br-lg pointer-events-none" />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-50">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200">
          <LogOut size={20} />
          <span className="font-bold text-sm">تسجيل خروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
