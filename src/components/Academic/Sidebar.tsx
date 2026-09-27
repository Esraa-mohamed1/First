'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, GraduationCap, Users, FileText, Package, TrendingUp, Settings, LogOut, ChevronLeft, X, LayoutDashboard, Plus, Wallet, Landmark, ReceiptText, Megaphone, Ticket, Award, Star, User, Globe, ShoppingBag, KeyRound } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import SelectCourseTypeModal from './Modals/SelectCourseTypeModal';
import { clearUserSessionAndCache, isSchoolTeacherRole } from '@/lib/auth-storage';
import { getMeProfile } from '@/services/auth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [user, setUser] = useState<{ name: string, role: string } | null>(null);
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user info:", e);
      }
    }

    // Fetch academy profile from /me endpoint
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
        // Fallback: read from localStorage
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

    // Synchronous sync from localStorage
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
    // {
    //   label: 'الملف الشخصي',
    //   icon: User,
    //   href: '/academic/profile',
    // },
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
      href: '/academic/finance/requests',
      subItems: [
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
      href: '/academic/settings/academy',
      subItems: [
        { label: 'بيانات الأكاديمية', href: '/academic/settings/academy' },
        { label: 'بيانات تسجيل الدخول', href: '/academic/settings/login-data' },
      ]
    },
  ];

  // Auto-expand parent sections when on a child page or on route change
  useEffect(() => {
    menuItems.forEach((item) => {
      if ((item as any).subItems && (item as any).subItems.length > 0) {
        const matchesChild = (item as any).subItems.some((subItem: any) => {
          const subPath = subItem.href.split('?')[0];
          return pathname === subPath || (subPath !== '/academic' && pathname.startsWith(subPath + '/'));
        });
        const parentPath = item.href ? item.href.split('?')[0] : '';
        const matchesParent = parentPath && parentPath !== '/academic' && (pathname === parentPath || pathname.startsWith(parentPath + '/'));

        // Additional sub-route mappings
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

  return (
    <>
      <aside className={twMerge(
        "w-72 bg-white h-screen fixed right-0 top-0 border-l border-gray-100 flex flex-col z-[50] transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Branding Section */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {academy?.name ? (
              <>
                {/* Academy Logo */}
                <div className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                  {academy.logo ? (
                    <Image
                      src={academy.logo}
                      alt={academy.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-white font-black text-xl">
                      {academy.name.charAt(0)}
                    </span>
                  )}
                </div>
                {/* Academy Name */}
                <div className="min-w-0">
                  <h1 className="text-base font-black text-gray-900 tracking-tight truncate leading-tight">
                    {academy.name}
                  </h1>
                  {academy.email && (
                    <p className="text-[11px] text-gray-400 font-medium truncate leading-tight">{academy.email}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Loading Skeleton */}
                <div className="w-11 h-11 rounded-2xl bg-gray-200 animate-pulse shrink-0"></div>
                <div className="min-w-0 space-y-1.5 flex-1">
                  <div className="h-4 w-28 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-100 rounded-md animate-pulse"></div>
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all lg:hidden flex-shrink-0"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 pt-4 space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-hide">
          {menuItems.filter(item => {
            if (user?.role === 'academy') {
              if (item.label === 'التقارير' || item.label === 'الباقة والأستخدام' || item.label === 'المبيعات' || item.label === 'الأعدادات' || item.label === 'المدربين' || item.label === 'الطلاب') return false;
            }
            return true;
          }).map((item) => {
            const hasSubItems = Boolean((item as any).subItems && (item as any).subItems.length > 0);
            const isExpanded = expandedItems.includes(item.label);

            const isChildActive = hasSubItems && (item as any).subItems.some((subItem: any) => {
              const cleanSub = subItem.href.split('?')[0];
              return pathname === cleanSub || (cleanSub !== '/academic' && pathname.startsWith(cleanSub + '/'));
            });

            const isDirectActive = pathname === item.href || (item.href !== '/academic' && pathname.startsWith(item.href + '/'));
            const isActive = hasSubItems ? isChildActive : isDirectActive;

            return (
              <div key={item.label} className="group">
                {hasSubItems ? (
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`submenu-${item.label}`}
                    onClick={() => toggleExpand(item.label)}
                    className={twMerge(
                      'w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-200 select-none text-right cursor-pointer',
                      isActive
                        ? 'bg-[#EBF1FF] text-[#2563eb] font-bold'
                        : isExpanded
                          ? 'text-gray-900 bg-gray-50/70 font-semibold'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon
                        size={20}
                        className={twMerge(
                          'transition-colors shrink-0',
                          isActive ? 'text-[#2563eb]' : 'text-gray-400 group-hover:text-gray-600'
                        )}
                      />
                      <span className="text-[14px] leading-tight">{item.label}</span>
                    </div>
                    <ChevronLeft
                      size={16}
                      className={twMerge(
                        'transition-transform duration-200 text-gray-400 shrink-0',
                        isExpanded ? '-rotate-90 text-[#2563eb]' : ''
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={twMerge(
                      'flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-200 text-right',
                      isActive
                        ? 'bg-[#EBF1FF] text-[#2563eb] font-bold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon
                        size={20}
                        className={twMerge(
                          'transition-colors shrink-0',
                          isActive ? 'text-[#2563eb]' : 'text-gray-400 group-hover:text-gray-600'
                        )}
                      />
                      <span className="text-[14px] leading-tight">{item.label}</span>
                    </div>
                  </Link>
                )}

                {hasSubItems && isExpanded && (
                  <div
                    id={`submenu-${item.label}`}
                    role="region"
                    aria-label={item.label}
                    className="mt-1.5 mr-5 pr-3.5 border-r-2 border-blue-100 space-y-1 transition-all"
                  >
                    {(item as any).subItems.map((subItem: any) => {
                      const cleanSubHref = subItem.href.split('?')[0];
                      const isSubActive = pathname === cleanSubHref || (cleanSubHref !== '/academic' && pathname.startsWith(cleanSubHref + '/'));
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={twMerge(
                            'flex items-center px-4 py-2.5 text-[13px] rounded-xl transition-all duration-150',
                            isSubActive
                              ? 'text-blue-600 bg-blue-50 font-bold shadow-xs'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'
                          )}
                        >
                          <span>{subItem.label}</span>
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
              onClick={() => {
                clearUserSessionAndCache();
                window.location.href = '/';
              }}
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
