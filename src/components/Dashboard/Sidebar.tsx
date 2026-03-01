'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, CreditCard, FileText, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = () => {
  const pathname = usePathname();

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
    <aside className="w-64 bg-white h-screen fixed right-0 top-0 border-l border-gray-100 flex flex-col z-50 shadow-[0_4px_30px_0px_rgba(72,128,255,0.2)]">
      {/* Logo */}
      <div className="p-6 flex items-center justify-end border-b border-gray-50">
        <h1 className="text-3xl font-black text-blue-600">First</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={twMerge(
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                )
              )}
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
              <span className="font-bold text-sm">{item.label}</span>
            </Link>
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
