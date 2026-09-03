'use client';

import Link from 'next/link';
import { 
  Plus, 
  Edit, 
  Search, 
  Trash2, 
  Loader2, 
  Sparkles, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Video, 
  Globe, 
  CheckCircle2, 
  Gift, 
  Package as PackageIcon,
  Check
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPackages, deletePackage, updatePackage } from '@/services/packages';
import { Package } from '@/types/api';
import toast from 'react-hot-toast';

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const data = await getPackages();
      setPackages(data);
    } catch (error) {
      toast.error('فشل في تحميل الباقات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;

    try {
      const response = await deletePackage(id);
      if (response.status) {
        toast.success('تم حذف الباقة بنجاح');
        setPackages(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error(response.message || 'فشل في حذف الباقة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  const handleToggleStatus = async (pkg: Package) => {
    const isCurrentlyActive = pkg.is_active === 1 || (pkg.is_active as any) === true;
    const newStatus = !isCurrentlyActive;
    try {
      const response = await updatePackage(pkg.id, {
        is_active: newStatus
      } as any);
      if (response.status) {
        toast.success(newStatus ? 'تم تفعيل الباقة' : 'تم إخفاء الباقة');
        setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, is_active: newStatus ? 1 : 0 } : p));
      } else {
        toast.error(response.message || 'فشل في تحديث الحالة');
      }
    } catch (error) {
      toast.error('فشل في تحديث الحالة');
    }
  };

  const formatDuration = (val: any) => {
    if (val === undefined || val === null || val === '') return '12 شهر';
    const num = typeof val === 'number' ? val : parseFloat(val);
    const rounded = isNaN(num) ? 12 : Math.round(num);
    if (rounded === 1) return 'شهر واحد';
    if (rounded === 3) return '3 شهور';
    if (rounded === 6) return '6 شهور';
    if (rounded === 12) return 'سنة كاملة';
    if (rounded === 24) return 'سنتين';
    return `${rounded} شهر`;
  };

  const formatPrice = (price: any) => {
    if (!price && price !== 0) return '0';
    const num = typeof price === 'number' ? price : parseFloat(price);
    if (isNaN(num)) return String(price);
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.titile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pkg.description || pkg.desc || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = packages.filter(p => p.is_active === 1).length;
  const popularCount = packages.filter(p => p.recomnd === 1 || p.is_popular).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">إدارة الباقات والاشتراكات</h2>
          <p className="text-sm font-bold text-gray-500 mt-1">عرض وتعديل مميزات وحدود كل باقة بشكل ديناميكي ومباشر</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/packages/create"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 active:scale-95 text-sm"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>إضافة باقة جديدة</span>
          </Link>
        </div>
      </div>

      {/* Quick Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-gray-400">إجمالي الباقات</p>
            <h3 className="text-2xl font-black text-gray-900">{packages.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <PackageIcon size={24} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-gray-400">الباقات المفعلة</p>
            <h3 className="text-2xl font-black text-green-600">{activeCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-gray-400">الباقات المميزة</p>
            <h3 className="text-2xl font-black text-amber-500">{popularCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Sparkles size={24} />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <h3 className="text-xl font-black text-gray-900">قائمة الباقات</h3>
            <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
              {filteredPackages.length} باقة
            </span>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث باسم الباقة أو الوصف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl pr-11 pl-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-right placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="p-6 md:p-8 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={44} className="text-blue-600 animate-spin" />
              <p className="text-gray-500 font-bold">جاري تحميل الباقات...</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                <PackageIcon size={32} />
              </div>
              <p className="text-gray-600 font-black text-lg">لا توجد باقات مطابقة للبحث</p>
              <Link
                href="/dashboard/packages/create"
                className="text-blue-600 font-bold hover:underline text-sm"
              >
                أضف باقة جديدة الآن
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPackages.map((pkg) => {
                const isPopular = pkg.recomnd === 1 || pkg.is_popular;
                const dynamicFeatures = pkg.package_features || pkg.packageFeatures || (Array.isArray(pkg.features) ? pkg.features : []);
                const durationText = formatDuration(pkg.duration_months ?? (pkg as any).duration);
                const formattedPrice = formatPrice(pkg.price);

                // Collect only real limits that exist on the package
                const realLimits: { label: string; value: any; icon: any }[] = [];
                if (pkg.max_students !== null && pkg.max_students !== undefined && String(pkg.max_students) !== '') {
                  realLimits.push({ label: 'طالب', value: pkg.max_students, icon: Users });
                }
                if (pkg.max_instructors !== null && pkg.max_instructors !== undefined && String(pkg.max_instructors) !== '') {
                  realLimits.push({ label: 'مدرب', value: pkg.max_instructors, icon: GraduationCap });
                }
                if (pkg.max_courses !== null && pkg.max_courses !== undefined && String(pkg.max_courses) !== '') {
                  realLimits.push({ label: 'دورة', value: pkg.max_courses, icon: BookOpen });
                }
                if (pkg.video_hours !== null && pkg.video_hours !== undefined && String(pkg.video_hours) !== '') {
                  realLimits.push({ label: 'ساعة فيديو', value: pkg.video_hours, icon: Video });
                }
                if (pkg.custom_domains !== null && pkg.custom_domains !== undefined && String(pkg.custom_domains) !== '') {
                  realLimits.push({ label: 'نطاق مخصص', value: pkg.custom_domains, icon: Globe });
                }

                return (
                  <div
                    key={pkg.id}
                    className={`group relative bg-white rounded-[28px] border transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 ${
                      isPopular
                        ? 'border-amber-300/80 shadow-lg shadow-amber-500/5 ring-1 ring-amber-300/50 hover:shadow-2xl hover:shadow-amber-500/15'
                        : 'border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10'
                    }`}
                  >
                    {/* Top Ribbon for Popular */}
                    {isPopular && (
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black py-1 px-4 text-center flex items-center justify-center gap-1.5 shadow-sm">
                        <Sparkles size={13} />
                        <span>الأكثر طلباً وانتشاراً</span>
                      </div>
                    )}

                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                      {/* Status & Quick Toggle */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1.5 ${
                            pkg.is_active === 1
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${pkg.is_active === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                          {pkg.is_active === 1 ? 'مفعلة' : 'مخفية'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(pkg)}
                          title={pkg.is_active === 1 ? 'إخفاء الباقة' : 'تفعيل الباقة'}
                          className={`w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${
                            pkg.is_active === 1 ? 'bg-emerald-500' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                              pkg.is_active === 1 ? 'translate-x-5' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Header Info */}
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 transition-transform group-hover:scale-105 duration-300 shadow-sm ${
                          isPopular 
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-200'
                            : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-200'
                        }`}>
                          {pkg.titile?.charAt(0) || 'ب'}
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <h4 className="text-lg font-black text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {pkg.titile}
                          </h4>
                          <p className="text-xs font-medium text-gray-500 line-clamp-2 mt-1">
                            {pkg.description || pkg.desc || 'لا يوجد وصف إضافي لهذه الباقة'}
                          </p>
                        </div>
                      </div>

                      {/* Price Display */}
                      <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                        <div className="text-right">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-gray-900 tracking-tight">{formattedPrice}</span>
                            <span className="text-xs font-bold text-gray-500">ر.س</span>
                          </div>
                          <span className="text-[11px] font-bold text-blue-600">{durationText}</span>
                        </div>

                        {pkg.trial_days && pkg.trial_days > 0 ? (
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                            <Gift size={13} />
                            <span>تجربة {pkg.trial_days} أيام</span>
                          </div>
                        ) : null}
                      </div>

                      {/* Real Dynamic Usage Limits (Only if present in data) */}
                      {realLimits.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 text-right">
                          {realLimits.map((limit, lIdx) => {
                            const IconComponent = limit.icon;
                            return (
                              <div key={lIdx} className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex items-center gap-2">
                                <IconComponent size={14} className="text-blue-500 flex-shrink-0" />
                                <span className="text-xs font-bold text-gray-700 truncate">
                                  {limit.value} {limit.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Dynamic Features List (Real package_features from backend) */}
                      <div className="space-y-2 pt-2 border-t border-gray-100 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-black text-gray-400">المميزات المضمنة</p>
                          {dynamicFeatures.length > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">
                              {dynamicFeatures.length} مميزة
                            </span>
                          )}
                        </div>

                        {dynamicFeatures.length > 0 ? (
                          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                            {dynamicFeatures.map((f: any, fIdx: number) => {
                              const label = f.lable || f.title || f.name || (typeof f === 'string' ? f : '');
                              const val = f.value;
                              if (!label && !val) return null;
                              return (
                                <div
                                  key={f.id || fIdx}
                                  className="flex items-center justify-between text-xs font-bold text-gray-700 bg-gray-50/70 hover:bg-blue-50/40 rounded-xl px-2.5 py-1.5 border border-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                      <Check size={10} strokeWidth={3.5} />
                                    </div>
                                    <span className="truncate text-[11px]">{label}</span>
                                  </div>
                                  {val && (
                                    <span className="text-blue-600 font-black text-[10px] bg-white px-2 py-0.5 rounded-md border border-blue-100 flex-shrink-0 mr-1.5 shadow-2xs">
                                      {val}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 font-medium text-center py-2">
                            لا توجد مميزات مضافة لهذه الباقة
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center gap-2">
                      <Link
                        href={`/dashboard/packages/create?id=${pkg.id}`}
                        className="flex-1 bg-white hover:bg-blue-600 hover:text-white text-gray-700 border border-gray-200 hover:border-blue-600 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 active:scale-95"
                      >
                        <Edit size={14} />
                        <span>تعديل الباقة</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2.5 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-xl transition-all duration-200 cursor-pointer"
                        title="حذف الباقة"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
