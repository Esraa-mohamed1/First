'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  Users,
  FileText,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  X,
  LayoutDashboard,
  Plus,
  Landmark,
  Globe,
  ShoppingBag,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import SelectCourseTypeModal from './Modals/SelectCourseTypeModal';
import { clearUserSessionAndCache } from '@/lib/auth-storage';
import { getMeProfile } from '@/services/auth';

export interface NavItemPalette {
  chipBg: string;
  chipText: string;
  chipActiveBg: string;
  chipActiveText: string;
}

// Harmonious, distinct accent colors for each navigation item
export const SIDEBAR_PALETTE: Record<string, NavItemPalette> = {
  'الرئيسية': {
    chipBg: 'bg-blue-50',
    chipText: 'text-blue-600',
    chipActiveBg: 'bg-blue-600',
    chipActiveText: 'text-white',
  },
  'الدورات': {
    chipBg: 'bg-violet-50',
    chipText: 'text-violet-600',
    chipActiveBg: 'bg-violet-600',
    chipActiveText: 'text-white',
  },
  'صفحات الهبوط': {
    chipBg: 'bg-sky-50',
    chipText: 'text-sky-600',
    chipActiveBg: 'bg-sky-600',
    chipActiveText: 'text-white',
  },
  'المتجر': {
    chipBg: 'bg-emerald-50',
    chipText: 'text-emerald-600',
    chipActiveBg: 'bg-emerald-600',
    chipActiveText: 'text-white',
  },
  'الطلاب': {
    chipBg: 'bg-amber-50',
    chipText: 'text-amber-600',
    chipActiveBg: 'bg-amber-600',
    chipActiveText: 'text-white',
  },
  'الموقع': {
    chipBg: 'bg-teal-50',
    chipText: 'text-teal-600',
    chipActiveBg: 'bg-teal-600',
    chipActiveText: 'text-white',
  },
  'المدربين': {
    chipBg: 'bg-indigo-50',
    chipText: 'text-indigo-600',
    chipActiveBg: 'bg-indigo-600',
    chipActiveText: 'text-white',
  },
  'المالية': {
    chipBg: 'bg-green-50',
    chipText: 'text-green-600',
    chipActiveBg: 'bg-green-600',
    chipActiveText: 'text-white',
  },
  'الباقة والأستخدام': {
    chipBg: 'bg-rose-50',
    chipText: 'text-rose-600',
    chipActiveBg: 'bg-rose-600',
    chipActiveText: 'text-white',
  },
  'الأعدادات': {
    chipBg: 'bg-slate-100',
    chipText: 'text-slate-600',
    chipActiveBg: 'bg-slate-700',
    chipActiveText: 'text-white',
  },
};

const DEFAULT_PALETTE: NavItemPalette = {
  chipBg: 'bg-gray-100',
  chipText: 'text-gray-600',
  chipActiveBg: 'bg-blue-600',
  chipActiveText: 'text-white',
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({ isOpen = false, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [academy, setAcademy] = useState<{ name?: string; logo?: string; email?: string } | null>(null);
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('academy-dashboard');
  const [activePage, setActivePage] = useState('1');

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  // Close mobile drawer on route change or Escape
  useEffect(() => {
    onClose?.();
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user info:', e);
      }
    }

    // Fetch academy profile
    const fetchAcademyProfile = async () => {
      try {
        const response = await getMeProfile();
        const data = response?.data || response;
        if (data) {
          setAcademy({
            name: data.name || data.academy_name || data.title,
            logo: data.logo || data.avatar || data.image,
            email: data.email,
          });
        }
      } catch (e) {
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setAcademy({
              name: parsed.name || parsed.academy_name,
              logo: parsed.logo || parsed.avatar,
              email: parsed.email,
            });
          } catch { }
        }
      }
    };
    fetchAcademyProfile();

    const updateActiveTemplateFromStorage = () => {
      const cachedTemplate = localStorage.getItem('darab_active_template');
      if (cachedTemplate) {
        setActiveTemplate(cachedTemplate);
      }
      const cachedPageId = localStorage.getItem('darab_active_page_id');
      if (cachedPageId) {
        setActivePage(cachedPageId);
      }
    };
    updateActiveTemplateFromStorage();

    window.addEventListener('storage', updateActiveTemplateFromStorage);
    return () => {
      window.removeEventListener('storage', updateActiveTemplateFromStorage);
    };
  }, [pathname]);

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
        { label: 'دورة مسجلة', href: '/academic/courses/recorded' },
        { label: 'دورة لايف اون لاين', href: '/academic/courses/live-online' },
        { label: 'دورة حضوري', href: '/academic/courses/in-person' },
        {
          label: 'التصنيف والصفوف الدراسية',
          href: '/academic/courses/categories',
        },
        { label: 'معاينة كطالب  ', href: '/academic/courses/8/student' },
      ],
    },
    {
      label: 'صفحات الهبوط',
      icon: FileText,
      href: '/academic/landing-pages',
    },
    {
      label: 'المتجر',
      icon: ShoppingBag,
      href: '/academic/market',
      subItems: [
        { label: 'الحقائب', href: '/academic/market' },
        { label: 'اشتراكات ومشتريات الحقائب', href: '/academic/market/subscriptions' },
      ],
    },
    {
      label: 'الطلاب',
      icon: Users,
      href: '/academic/students',
      subItems: [
        { label: 'قائمة الطلاب', href: '/academic/students' },
        { label: 'إدارة المشتركين والتقارير', href: '/academic/students/subscribers' },
      ],
    },
    {
      label: 'الموقع',
      icon: Globe,
      href: `/academic/website/builder?templateId=${activeTemplate}&pageId=${activePage}`,
      subItems: [
        { label: 'باني الصفحات', href: `/academic/website/builder?templateId=${activeTemplate}&pageId=${activePage}` },
        { label: 'الدومين المخصص', href: '/academic/domain' },
      ],
    },
    {
      label: 'المدربين',
      icon: GraduationCap,
      href: '/academic/coaches',
    },
    {
      label: 'المالية',
      icon: Landmark,
      href: '/academic/finance/requests',
      subItems: [
        { label: 'طلبات الاشتراك والشراء', href: '/academic/finance/requests' },
        { label: 'إعدادات الدفع (للطلاب)', href: '/academic/finance/payment-settings' },
      ],
    },
    {
      label: 'الباقة والأستخدام',
      icon: Package,
      href: '/academic/packages',
    },
    {
      label: 'الأعدادات',
      icon: Settings,
      href: '/academic/settings/academy',
      subItems: [
        { label: 'بيانات الأكاديمية', href: '/academic/settings/academy' },
        { label: 'بيانات تسجيل الدخول', href: '/academic/settings/login-data' },
      ],
    },
  ];

  // Auto-expand parent sections when on a child page
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        const matchesChild = item.subItems.some((subItem: any) => {
          const subPath = subItem.href.split('?')[0];
          return pathname === subPath || (subPath !== '/academic' && pathname.startsWith(subPath + '/'));
        });
        const parentPath = item.href ? item.href.split('?')[0] : '';
        const matchesParent = parentPath && parentPath !== '/academic' && (pathname === parentPath || pathname.startsWith(parentPath + '/'));

        const isSpecialMatch =
          (item.label === 'المتجر' && pathname.startsWith('/academic/bag-purchases')) ||
          (item.label === 'الموقع' && (pathname === '/academic/domain' || pathname.startsWith('/academic/templates'))) ||
          (item.label === 'الأعدادات' && pathname === '/academic/settings/login-data') ||
          (item.label === 'التسويق' && pathname.startsWith('/academic/coupons'));

        if (matchesChild || matchesParent || isSpecialMatch) {
          setExpandedItems((prev) => (prev.includes(item.label) ? prev : [...prev, item.label]));
        }
      }
    });
  }, [pathname, activeTemplate, activePage]);

  const handleLogout = () => {
    clearUserSessionAndCache();
    window.location.href = '/';
  };

  return (
    <>
      <aside
        className={twMerge(
          'bg-white h-screen fixed right-0 top-0 border-l border-gray-100 flex flex-col z-[50] transition-all duration-300 ease-in-out shadow-sm select-none',
          // Desktop collapsed vs expanded
          isCollapsed ? 'lg:w-20' : 'lg:w-72',
          // Mobile drawer open/close
          isOpen ? 'translate-x-0 w-72' : 'translate-x-full lg:translate-x-0'
        )}
        dir="rtl"
      >
        {/* Branding Section */}
        <div className={twMerge(
          'pt-5 pb-4 flex items-center border-b border-gray-50 transition-all duration-300',
          isCollapsed ? 'px-3 justify-center' : 'px-6 justify-between'
        )}>
          <div className={twMerge('flex items-center gap-3 min-w-0', isCollapsed ? 'justify-center' : 'flex-1')}>
            {academy?.name ? (
              <>
                {/* Academy Logo */}
                <div
                  className="w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0 bg-blue-600 flex items-center justify-center shadow-md shadow-blue-100 relative group cursor-pointer"
                  title={academy.name}
                >
                  {academy.logo ? (
                    <Image
                      src={academy.logo}
                      alt={academy.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-white font-black text-lg">
                      {academy.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Academy Name (Hidden in collapsed desktop mode) */}
                <div className={twMerge('min-w-0 transition-opacity duration-200', isCollapsed ? 'hidden' : 'block')}>
                  <h1 className="text-sm font-black text-gray-900 tracking-tight truncate leading-tight">
                    {academy.name}
                  </h1>
                  {academy.email && (
                    <p className="text-[11px] text-gray-400 font-medium truncate leading-tight mt-0.5">{academy.email}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-2xl bg-gray-200 animate-pulse shrink-0" />
                <div className={twMerge('min-w-0 space-y-1.5 flex-1', isCollapsed ? 'hidden' : 'block')}>
                  <div className="h-3.5 w-24 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-2.5 w-16 bg-gray-100 rounded-md animate-pulse" />
                </div>
              </>
            )}
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={onClose}
            className={twMerge('p-2 hover:bg-gray-100 rounded-xl transition-all lg:hidden flex-shrink-0', isCollapsed && 'hidden')}
            aria-label="إغلاق القائمة الجانبية"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className={twMerge(
          'flex-1 pt-3.5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide',
          isCollapsed ? 'px-2.5' : 'px-4'
        )}>
          {menuItems.filter(item => {
            if (user?.role === 'academy') {
              if (item.label === 'التقارير' || item.label === 'الباقة والأستخدام' || item.label === 'المبيعات' || item.label === 'الأعدادات' || item.label === 'المدربين' || item.label === 'الطلاب') return false;
            }
            return true;
          }).map((item) => {
            const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
            const isExpanded = expandedItems.includes(item.label);

            const isChildActive = hasSubItems && item.subItems!.some((subItem: any) => {
              const cleanSub = subItem.href.split('?')[0];
              return pathname === cleanSub || (cleanSub !== '/academic' && pathname.startsWith(cleanSub + '/'));
            });

            const isDirectActive = pathname === item.href || (item.href !== '/academic' && pathname.startsWith(item.href + '/'));
            const isActive = hasSubItems ? isChildActive : isDirectActive;

            const palette = SIDEBAR_PALETTE[item.label] || DEFAULT_PALETTE;

            return (
              <div key={item.label} className="relative group">
                {hasSubItems ? (
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`submenu-${item.label}`}
                    onClick={() => {
                      if (isCollapsed && onToggleCollapse) {
                        onToggleCollapse();
                      }
                      toggleExpand(item.label);
                    }}
                    className={twMerge(
                      'w-full flex items-center rounded-xl transition-all duration-150 select-none text-right cursor-pointer',
                      isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5',
                      isActive
                        ? 'bg-[#EBF1FF] text-[#2563eb] font-bold'
                        : isExpanded
                          ? 'text-gray-900 bg-gray-50/80 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 font-semibold'
                    )}
                  >
                    <div className={twMerge('flex items-center gap-3', isCollapsed && 'justify-center')}>
                      {/* Color chip icon */}
                      <div
                        className={twMerge(
                          'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 shrink-0',
                          isActive
                            ? `${palette.chipActiveBg} ${palette.chipActiveText} shadow-xs`
                            : `${palette.chipBg} ${palette.chipText} group-hover:scale-105`
                        )}
                      >
                        <item.icon size={18} />
                      </div>
                      <span className={twMerge('text-[13.5px] leading-tight', isCollapsed ? 'hidden' : 'inline-block')}>
                        {item.label}
                      </span>
                    </div>

                    {!isCollapsed && (
                      <ChevronLeft
                        size={15}
                        className={twMerge(
                          'transition-transform duration-200 text-gray-400 shrink-0',
                          isExpanded ? '-rotate-90 text-[#2563eb]' : ''
                        )}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={twMerge(
                      'flex items-center rounded-xl transition-all duration-150 text-right',
                      isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5',
                      isActive
                        ? 'bg-[#EBF1FF] text-[#2563eb] font-bold'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 font-semibold'
                    )}
                  >
                    <div className={twMerge('flex items-center gap-3', isCollapsed && 'justify-center')}>
                      {/* Color chip icon */}
                      <div
                        className={twMerge(
                          'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 shrink-0',
                          isActive
                            ? `${palette.chipActiveBg} ${palette.chipActiveText} shadow-xs`
                            : `${palette.chipBg} ${palette.chipText} group-hover:scale-105`
                        )}
                      >
                        <item.icon size={18} />
                      </div>
                      <span className={twMerge('text-[13.5px] leading-tight', isCollapsed ? 'hidden' : 'inline-block')}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                )}

                {/* Submenu in expanded mode */}
                {hasSubItems && isExpanded && !isCollapsed && (
                  <div
                    id={`submenu-${item.label}`}
                    role="region"
                    aria-label={item.label}
                    className="mt-1 mr-6 pr-3 border-r-2 border-blue-100 space-y-1 transition-all"
                  >
                    {item.subItems!.map((subItem: any) => {
                      const cleanSubHref = subItem.href.split('?')[0];
                      const isSubActive = pathname === cleanSubHref || (cleanSubHref !== '/academic' && pathname.startsWith(cleanSubHref + '/'));
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={twMerge(
                            'flex items-center px-3.5 py-2 text-[12.5px] rounded-lg transition-all duration-150',
                            isSubActive
                              ? 'text-blue-600 bg-blue-50 font-bold shadow-2xs'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'
                          )}
                        >
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Floating Tooltip / Popover when Collapsed on Desktop */}
                {isCollapsed && (
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 z-50 pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-150">
                    <div className="bg-gray-900 text-white rounded-xl shadow-xl p-2.5 min-w-[150px] text-right">
                      <div className="font-bold text-xs pb-1 border-b border-gray-800 flex items-center justify-between gap-2">
                        <span>{item.label}</span>
                        <div className={twMerge('w-2 h-2 rounded-full', palette.chipBg)} />
                      </div>
                      {hasSubItems && (
                        <div className="pt-1.5 space-y-1">
                          {item.subItems!.map((subItem: any) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-2 py-1 text-[11.5px] text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions Area (Create Course & Logout) */}
        <div className={twMerge(
          'p-4 border-t border-gray-100 space-y-3 transition-all duration-300',
          isCollapsed ? 'px-2.5' : 'px-5'
        )}>
          {/* Create Course Button */}
          {isCollapsed ? (
            <div className="relative group flex justify-center">
              <button
                type="button"
                onClick={() => setIsSelectTypeModalOpen(true)}
                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-100 hover:brightness-110 transition-all cursor-pointer"
                aria-label="انشاء دورة جديدة"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
              <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                انشاء دورة جديدة
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsSelectTypeModalOpen(true)}
              className="w-full bg-blue-600 rounded-xl p-3 flex items-center justify-center gap-2 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-100 cursor-pointer hover:brightness-110 transition-all"
            >
              <Plus size={17} strokeWidth={2.5} />
              <span>انشاء دورة جديدة</span>
            </button>
          )}

          {/* Logout Button */}
          {isCollapsed ? (
            <div className="relative group flex justify-center">
              <button
                type="button"
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="تسجيل الخروج"
              >
                <LogOut size={16} />
              </button>
              <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                تسجيل الخروج
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50/70 rounded-xl transition-colors font-bold text-xs sm:text-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors shrink-0">
                <LogOut size={16} />
              </div>
              <span>تسجيل الخروج</span>
            </button>
          )}
        </div>
      </aside>

      {/* Select Course Type Modal */}
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
