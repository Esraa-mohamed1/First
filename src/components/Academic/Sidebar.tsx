'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, GraduationCap, Users, FileText, Package, TrendingUp, Settings, LogOut, ChevronLeft, X, LayoutDashboard, Plus, Wallet, Landmark, ReceiptText, Megaphone, Ticket, Award, Star, User, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import SelectCourseTypeModal from './Modals/SelectCourseTypeModal';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [user, setUser] = useState<{ name: string, role: string } | null>(null);
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user info:", e);
      }
    }
  }, []);

  // Keep "الدورات" expanded while inside any courses page
  useEffect(() => {
    if (pathname.startsWith('/academic/courses')) {
      setExpandedItems(prev => (prev.includes('الدورات') ? prev : [...prev, 'الدورات']));
    }
    if (pathname.startsWith('/academic/settings')) {
      setExpandedItems(prev => (prev.includes('الأعدادات') ? prev : [...prev, 'الأعدادات']));
    }
    if (pathname.startsWith('/academic/templates') || pathname.startsWith('/academic/website') || pathname === '/academic/domain') {
      setExpandedItems(prev => (prev.includes('الموقع') ? prev : [...prev, 'الموقع']));
    }
    if (pathname.startsWith('/academic/finance')) {
      setExpandedItems(prev => (prev.includes('المالية') ? prev : [...prev, 'المالية']));
    }
    if (pathname.startsWith('/academic/marketing') || pathname.startsWith('/academic/coupons')) {
      setExpandedItems(prev => (prev.includes('التسويق') ? prev : [...prev, 'التسويق']));
    }
  }, [pathname]);

  const menuItems = [
    {
      label: 'الرئيسية',
      icon: LayoutDashboard,
      href: '/academic',
    },
    {
      label: 'الملف الشخصي',
      icon: User,
      href: '/academic/profile',
    },
    {
      label: 'الدورات',
      icon: GraduationCap,
      href: '/academic/courses',
      subItems: [
        { label: 'دورة مسجلة', href: '/academic/courses/recorded' },
        { label: 'دورة لايف اون لاين', href: '/academic/courses/live-online' },
        { label: 'دورة حضوري', href: '/academic/courses/in-person' },
        { label: 'فئات الدورات', href: '/academic/courses/categories' },
        { label: 'الأحصائيات', href: '/academic/courses/stats' },
        { label: 'معاينة كطالب (تجريبي)', href: '/academic/courses/8/student' },
      ],
    },
    {
      label: 'الطلاب',
      icon: Users,
      href: '/academic/students',
    },
    {
      label: 'الموقع',
      icon: Globe,
      href: '/academic/templates',
      subItems: [
        { label: 'اختيار القوالب', href: '/academic/templates' },
        { label: 'باني الصفحات', href: '/academic/website/builder?templateId=academy-dashboard&pageId=1' },
        { label: 'الهوية والألوان', href: '/academic/website/colors' },
        { label: 'الدومين المخصص', href: '/academic/domain' },
        { label: 'الصفحات', href: '/academic/website/pages' },
        { label: 'القوائم', href: '/academic/website/menus' },
      ]
    },
    {
      label: 'المدربين',
      icon: GraduationCap,
      href: '/academic/coaches',
    },
    {
      label: 'المالية',
      icon: Landmark,
      href: '/academic/finance/overview',
      subItems: [
        { label: 'نظرة عامة', href: '/academic/finance/overview' },
        { label: 'طلبات الاشتراك والشراء', href: '/academic/finance/requests' },
        { label: 'إعدادات الدفع (للطلاب)', href: '/academic/finance/payment-settings' },
      ]
    },
    // {
    //   label: 'التسويق',
    //   icon: Megaphone,
    //   href: '/academic/marketing',
    //   subItems: [
    //     { label: 'الحملات', href: '/academic/marketing' },
    //     { label: 'الكوبونات', href: '/academic/coupons' },
    //   ]
    // },
    // {
    //   label: 'الشهادات',
    //   icon: Award,
    //   href: '/academic/certificates',
    // },
    // {
    //   label: 'التقييمات',
    //   icon: Star,
    //   href: '/academic/reviews',
    // },
    {
      label: 'الباقة والأستخدام',
      icon: Package,
      href: '/academic/packages',
    },
    {
      label: 'الأعدادات',
      icon: Settings,
      href: '/academic/settings',
      subItems: [
        { label: 'بيانات الأكاديمية', href: '/academic/settings/academy' },
      ]
    },
  ];

  return (
    <>
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
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-hide">
          {menuItems.filter(item => {
            if (user?.role === 'academy') {
              if (item.label === 'التقارير' || item.label === 'الباقة والأستخدام' || item.label === 'المبيعات' || item.label === 'الأعدادات' || item.label === 'المدربين' || item.label === 'الطلاب') return false;
            }
            return true;
          }).map((item) => {
            const isActive = pathname === item.href || (item.href !== '/academic' && pathname.startsWith(item.href));
            const hasSubItems = (item as any).subItems && (item as any).subItems.length > 0;
            const isExpanded = expandedItems.includes(item.label);

            return (
              <div key={item.label} className="group">
                <div
                  onClick={() => {
                    if (hasSubItems) {
                      toggleExpand(item.label);
                      router.push(item.href);
                    }
                  }}
                  className={twMerge(
                    'flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300',
                    isActive
                      ? 'bg-[#EBF1FF] text-[#2563eb]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                    hasSubItems ? 'cursor-pointer' : ''
                  )}
                >
                  {!hasSubItems ? (
                    <Link href={item.href} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <item.icon size={20} className={twMerge(
                          isActive ? "text-[#2563eb]" : "text-gray-400 group-hover:text-gray-600"
                        )} />
                        <span className="font-bold text-[14px]">{item.label}</span>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <item.icon size={20} className={twMerge(
                          isActive ? "text-[#2563eb]" : "text-gray-400 group-hover:text-gray-600"
                        )} />
                        <span className="font-bold text-[14px]">{item.label}</span>
                      </div>
                      <ChevronLeft
                        size={16}
                        className={twMerge(
                          "transition-transform duration-300 text-gray-400",
                          isExpanded ? "-rotate-90 text-[#2563eb]" : ""
                        )}
                      />
                    </>
                  )}
                </div>

                {hasSubItems && isExpanded && (
                  <div className="mt-2 mr-4 pr-4 border-r-2 border-gray-100 space-y-1">
                    {(item as any).subItems.map((subItem: any) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={twMerge(
                          'block px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                          pathname === subItem.href || pathname.startsWith(subItem.href + '/')
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        )}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Help & Support Area */}
        <div className="p-6 border-t border-gray-100 space-y-4">
          <div
            onClick={() => setIsSelectTypeModalOpen(true)}
            className="bg-blue-600 rounded-xl p-3 flex items-center justify-center gap-2 text-white font-bold text-sm shadow-lg shadow-blue-100 cursor-pointer hover:brightness-110 transition-all"
          >
            <Plus size={18} strokeWidth={3} />
            <span>انشاء دورة جديدة</span>
          </div>
          <div className="flex flex-col gap-2 px-2">
            <button className="flex items-center gap-3 text-gray-500 hover:text-blue-600 transition-colors font-bold text-sm group">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Users size={16} />
              </div>
              <span>مركز المساعدة</span>
            </button>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors font-bold text-sm group"
            >
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <LogOut size={16} />
              </div>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>
      <SelectCourseTypeModal
        isOpen={isSelectTypeModalOpen}
        onClose={() => setIsSelectTypeModalOpen(false)}
      />
      <style jsx global>{`
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
    </>
  );
};

export default Sidebar;
