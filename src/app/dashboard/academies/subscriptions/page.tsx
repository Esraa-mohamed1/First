'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  BookOpen,
  Package as PackageIcon,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Calendar,
  RotateCcw,
  Image as ImageIcon,
  ImageOff,
  Maximize2,
  X
} from 'lucide-react';
import { getAcademySubscriptions } from '@/services/academy-subscriptions';
import {
  AcademySubscription,
  SubscriptionStats
} from '@/types/academy-subscription';

export default function AcademySubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<AcademySubscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({
    totalCount: 0,
    activeCount: 0,
    expiredCount: 0,
    pendingCount: 0,
    trialCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'trial' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  // Receipt Modal State
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAcademySubscriptions({
        search: searchTerm,
        status: statusFilter,
        page: currentPage,
        limit: pageSize
      });

      setSubscriptions(response.items);
      setStats(response.stats);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (err: any) {
      console.error('Failed to load academy subscriptions:', err);
      setError(err?.message || 'حدث خطأ أثناء تحميل بيانات اشتراكات الأكاديميات');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter, currentPage]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString || dateString === '—') return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status: string, label: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{label || 'نشط'}</span>
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-black">
            <XCircle size={12} className="text-rose-500" />
            <span>{label || 'منتهي'}</span>
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-black">
            <Clock size={12} className="text-blue-500" />
            <span>{label || 'فترة تجريبية'}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-black">
            <AlertCircle size={12} className="text-amber-500" />
            <span>{label || 'معلق'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-black">
            <span>{label || status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans" dir="rtl">
      {/* 1. Header Section (Display Only) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-right">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-end gap-3">
            <span>اشتراكات الأكاديميات</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard size={24} />
            </div>
          </h2>
          <p className="text-sm font-bold text-gray-500 mt-1">
            عرض ومتابعة سجلات وبيانات اشتراكات الأكاديميات، المستخدمين، والباقات وحالتها وإيصالات الدفع
          </p>
        </div>
      </div>

      {/* 2. Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-gray-400">إجمالي الاشتراكات</p>
            <h3 className="text-2xl font-black text-gray-900">{stats.totalCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 size={24} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-gray-400">اشتراكات نشطة</p>
            <h3 className="text-2xl font-black text-emerald-600">{stats.activeCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-gray-400">فترة تجريبية</p>
            <h3 className="text-2xl font-black text-blue-600">{stats.trialCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-gray-400">منتهية الصلاحية</p>
            <h3 className="text-2xl font-black text-rose-600">{stats.expiredCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/60 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => {
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              الكل ({stats.totalCount})
            </button>
            <button
              onClick={() => {
                setStatusFilter('active');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              نشطة ({stats.activeCount})
            </button>
            <button
              onClick={() => {
                setStatusFilter('trial');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === 'trial'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              تجريبية ({stats.trialCount})
            </button>
            <button
              onClick={() => {
                setStatusFilter('expired');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === 'expired'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              منتهية ({stats.expiredCount})
            </button>
            <button
              onClick={() => {
                setStatusFilter('pending');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              معلقة ({stats.pendingCount})
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث بالمستخدم، البريد، أو الباقة..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl pr-11 pl-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-right placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Subscriptions Table Area */}
        <div className="p-6 md:p-8 min-h-[420px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <Loader2 size={44} className="text-blue-600 animate-spin" />
              <p className="text-gray-500 font-bold text-sm">جاري تحميل بيانات الاشتراكات...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                <AlertCircle size={32} />
              </div>
              <p className="text-gray-800 font-black text-lg">{error}</p>
              <button
                onClick={() => fetchSubscriptions()}
                className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                <CreditCard size={32} />
              </div>
              <p className="text-gray-700 font-black text-lg">لا توجد بيانات اشتراكات مطابقة</p>
              <p className="text-xs text-gray-400 font-bold max-w-sm">
                لم يتم العثور على أي نتائج وفقاً لمعايير البحث أو التصفية الحالية.
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCurrentPage(1);
                  }}
                  className="text-blue-600 font-bold text-sm hover:underline mt-2 cursor-pointer"
                >
                  إعادة ضبط البحث والتصفية
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50/60 border-b border-gray-100 text-gray-400 text-xs font-black uppercase tracking-wider">
                    <th className="px-6 py-4 rounded-r-2xl">المستخدم / المشترك</th>
                    <th className="px-6 py-4">الدورة / الباقة</th>
                    <th className="px-6 py-4 text-center">الحالة</th>
                    <th className="px-6 py-4">تاريخ البدء</th>
                    <th className="px-6 py-4">تاريخ الانتهاء</th>
                    <th className="px-6 py-4 text-center">الإيصال</th>
                    <th className="px-6 py-4 text-left rounded-l-2xl">قيمة الاشتراك</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptions.map((sub) => {
                    return (
                      <tr key={sub.id} className="hover:bg-blue-50/30 transition-colors group">
                        {/* 1. User / Subscriber Details */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm shadow-blue-200">
                              {sub.userName.charAt(0) || 'م'}
                            </div>
                            <div className="space-y-0.5 text-right">
                              <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                {sub.userName}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500" dir="ltr">
                                <span>{sub.userEmail}</span>
                                <Mail size={12} className="text-gray-400" />
                              </div>
                              {sub.userPhone && (
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400" dir="ltr">
                                  <span>{sub.userPhone}</span>
                                  <Phone size={11} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Course or Package Details */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="space-y-1.5 text-right">
                            {sub.courseTitle && (
                              <div className="flex items-center gap-2">
                                <BookOpen size={14} className="text-blue-600 shrink-0" />
                                <span className="text-xs font-black text-gray-800 truncate max-w-[220px]">
                                  {sub.courseTitle}
                                </span>
                              </div>
                            )}
                            {sub.packageName && (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-lg text-[11px] font-black">
                                <PackageIcon size={12} />
                                <span>{sub.packageName}</span>
                              </div>
                            )}
                            {!sub.courseTitle && !sub.packageName && (
                              <span className="text-xs text-gray-400 font-bold">اشتراك عام</span>
                            )}
                          </div>
                        </td>

                        {/* 3. Status Badge */}
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          {renderStatusBadge(sub.status, sub.statusLabel)}
                        </td>

                        {/* 4. Start Date */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                            <Calendar size={13} className="text-gray-400" />
                            <span>{formatDate(sub.startDate)}</span>
                          </div>
                        </td>

                        {/* 5. End Date */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                            <Calendar size={13} className="text-gray-400" />
                            <span>{formatDate(sub.endDate)}</span>
                          </div>
                        </td>

                        {/* 6. Receipt Thumbnail / Placeholder */}
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          {sub.receipt ? (
                            <div className="inline-flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setPreviewReceiptUrl(sub.receipt || null)}
                                className="relative group/receipt w-12 h-12 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all cursor-pointer bg-gray-50 focus:outline-hidden"
                                title="انقر لتكبير الإيصال"
                              >
                                <img
                                  src={sub.receipt}
                                  alt="إيصال الدفع"
                                  className="w-full h-full object-cover transition-transform duration-200 group-hover/receipt:scale-110"
                                  onError={(e) => {
                                    // Fallback if image link fails to load
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    if (target.parentElement) {
                                      target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                                    }
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/receipt:opacity-100 transition-opacity flex items-center justify-center text-white">
                                  <Maximize2 size={14} />
                                </div>
                              </button>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200/60 rounded-xl text-[11px] font-bold text-gray-400">
                              <ImageOff size={12} className="text-gray-400" />
                              <span>لا يوجد</span>
                            </span>
                          )}
                        </td>

                        {/* 7. Amount / Price */}
                        <td className="px-6 py-5 whitespace-nowrap text-left">
                          <div className="space-y-0.5 text-left">
                            <span className="text-sm font-black text-gray-900">
                              {sub.price !== null && sub.price !== undefined ? `${sub.price} ${sub.currency}` : '—'}
                            </span>
                            {sub.paymentMethod && (
                              <p className="text-[10px] text-gray-400 font-bold">
                                {sub.paymentMethod}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. Pagination Bar (if totalPages > 1) */}
        {!isLoading && totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-500">
            <div>
              عرض {subscriptions.length} من أصل {totalItems} اشتراك
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="الصفحة السابقة"
              >
                <ChevronRight size={16} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      currentPage === p
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="الصفحة التالية"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Lightbox Modal for Receipt Preview */}
      {previewReceiptUrl && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setPreviewReceiptUrl(null)}
        >
          <div
            className="relative bg-white rounded-3xl p-4 md:p-6 max-w-2xl w-full shadow-2xl border border-gray-100 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ImageIcon size={18} />
                </div>
                <h3 className="text-base font-black text-gray-900">معاينة إيصال التحويل</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="فتح الصورة في علامة تبويب جديدة"
                >
                  <ExternalLink size={18} />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewReceiptUrl(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                  title="إغلاق"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="w-full max-h-[70vh] flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden p-2 border border-gray-100">
              <img
                src={previewReceiptUrl}
                alt="إيصال الدفع بالحجم الكامل"
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
