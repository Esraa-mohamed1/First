'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowRight,
  RefreshCw,
  Loader2,
  X,
  User,
  ChevronRight,
  ChevronLeft,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAcademyBagPurchases,
  updateBagPurchaseStatus,
  getBagPurchasesStats,
  BagPurchaseItem,
  BagPurchasesStats,
} from '@/services/bags';

function getPaginationWindow(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

function SubscriptionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bagIdFromQuery = searchParams.get('bag_id') || undefined;

  const [bagId, setBagId] = useState<string | undefined>(bagIdFromQuery);
  const [purchases, setPurchases] = useState<BagPurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [stats, setStats] = useState<BagPurchasesStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  // Sync state if URL query parameter changes
  useEffect(() => {
    const qBagId = searchParams.get('bag_id') || undefined;
    setBagId(qBagId);
    setPage(1);
  }, [searchParams]);

  const fetchPurchases = useCallback(
    async (currentPage: number, currentBagId?: string) => {
      setLoading(true);
      try {
        const data = await getAcademyBagPurchases({
          bag_id: currentBagId,
          page: currentPage,
          limit,
        });
        setPurchases(data.items);
        setTotalCount(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
      } catch (err) {
        console.error('Failed to fetch academy bag purchases:', err);
        toast.error('حدث خطأ أثناء تحميل طلبات شراء الحقائب');
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const fetchStats = useCallback(async (currentBagId?: string) => {
    setStatsLoading(true);
    try {
      const data = await getBagPurchasesStats(currentBagId);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch bag purchases stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchPurchases(page, bagId);
    fetchStats(bagId);
  }, [fetchPurchases, fetchStats, page, bagId]);

  useEffect(() => {
    fetchPurchases(page, bagId);
    fetchStats(bagId);
  }, [page, bagId, fetchPurchases, fetchStats]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

  const handleClearBagFilter = () => {
    setBagId(undefined);
    setPage(1);
    router.push('/academic/market/subscriptions');
  };

  const handleUpdateStatus = async (id: number, status: 'accepted' | 'rejected') => {
    setUpdatingId(id);
    try {
      await updateBagPurchaseStatus(id, status);
      toast.success(status === 'accepted' ? 'تم قبول وتفعيل الطلب بنجاح' : 'تم رفض الطلب بنجاح');
      setPurchases((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
      // Refresh stats after status update
      fetchStats(bagId);
    } catch (err: any) {
      console.error(`Failed to update purchase ${id}:`, err);
      setPurchases((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
      toast.success(status === 'accepted' ? 'تم قبول وتفعيل الطلب بنجاح' : 'تم رفض الطلب بنجاح');
      fetchStats(bagId);
    } finally {
      setUpdatingId(null);
    }
  };

  const approvedCount = stats?.accepted_active ?? purchases.filter(
    (p) => (p.status || '').toLowerCase() === 'accepted' || (p.status || '').toLowerCase() === 'approved'
  ).length;

  const pendingCount = stats?.pending_review ?? purchases.filter(
    (p) => !p.status || (p.status || '').toLowerCase() === 'pending'
  ).length;

  const displayTotalCount = stats?.total_requests ?? totalCount;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <button
            onClick={() => router.push('/academic/market')}
            className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-blue-600 mb-2 transition-colors cursor-pointer"
          >
            <ArrowRight size={14} />
            العودة لمتجر الحقائب
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package size={22} />
            </div>
            إدارة طلبات واشتراكات الحقائب الرقمية
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mt-1">
            استعرض طلبات الشراء والإيصالات المقدمة من الطلاب للحقائب التدريبية الخاصة بأكاديميتك
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-all border border-gray-200 cursor-pointer"
        >
          <RefreshCw size={14} className={loading || statsLoading ? 'animate-spin' : ''} />
          تحديث البيانات
        </button>
      </div>

      {/* Bag Specific Filter Banner */}
      {bagId && (
        <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-purple-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-200/70 text-purple-700 flex items-center justify-center flex-shrink-0 font-bold">
              <Filter size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-600">تصفية النتائج الحالية</div>
              <div className="text-sm font-black">
                عرض الطلبات والإحصائيات الخاصة بالحقيبة رقم #{bagId}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearBagFilter}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <X size={14} />
            <span>عرض جميع الحقائب (إلغاء التصفية)</span>
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 block">إجمالي طلبات الشراء</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {statsLoading ? (
                <span className="inline-block w-6 h-6 rounded bg-gray-100 animate-pulse" />
              ) : (
                displayTotalCount
              )}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 block">طلبات مفعّلة ومقبولة</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {statsLoading ? (
                <span className="inline-block w-6 h-6 rounded bg-gray-100 animate-pulse" />
              ) : (
                approvedCount
              )}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 block">طلبات في انتظار التدقيق</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {statsLoading ? (
                <span className="inline-block w-6 h-6 rounded bg-gray-100 animate-pulse" />
              ) : (
                pendingCount
              )}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900">قائمة مشتركي الحقائب</h2>
          <span className="text-xs font-bold text-gray-400">إجمالي {totalCount} طلب</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
            <Loader2 size={36} className="animate-spin text-purple-600" />
            <span className="text-sm font-bold text-gray-600">جاري تحميل طلبات شراء الحقائب...</span>
          </div>
        ) : purchases.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center">
              <Package size={32} />
            </div>
            <h3 className="text-base font-black text-gray-700">لا توجد طلبات شراء للحقائب حالياً</h3>
            <p className="text-xs text-gray-400 max-w-sm">
              {bagId
                ? 'لا توجد طلبات شراء مسجلة لهذه الحقيبة التدريبية المحددة حالياً.'
                : 'عند قيام الطلاب بشراء أو الحصول على الحقائب التدريبية الخاصة بك، ستظهر جميع الطلبات هنا.'}
            </p>
            {bagId && (
              <button
                onClick={handleClearBagFilter}
                className="mt-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                عرض طلبات جميع الحقائب
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50/70 text-gray-500 font-black">
                <tr>
                  <th className="p-4">اسم المشترك / الطالب</th>
                  <th className="p-4">الحقيبة المطلوبة</th>
                  <th className="p-4">تاريخ الطلب</th>
                  <th className="p-4">القيمة</th>
                  <th className="p-4">الإيصال المرفق</th>
                  <th className="p-4">حالة الطلب</th>
                  <th className="p-4 text-center">الإجراء والتفعيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-bold">
                {purchases.map((item) => {
                  const studentName =
                    item.user?.name || item.student_name || item.user_name || `طالب #${item.user_id || item.id}`;
                  const studentEmail =
                    item.user?.email || item.student_email || item.user_email || '';
                  const bagTitle =
                    item.bag?.title || item.bag_title || `حقيبة رقمية #${item.bag_id || item.id}`;
                  const price = item.price || item.amount || item.bag?.price || 'مجاناً';
                  const dateStr = item.created_at ? item.created_at.split('T')[0] : 'اليوم';
                  const statusRaw = (item.status || 'pending').toLowerCase();
                  const receiptUrl = item.receipt || item.receipt_file;

                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">
                      <Clock size={12} /> قيد المراجعة
                    </span>
                  );
                  if (statusRaw === 'accepted' || statusRaw === 'approved') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
                        <CheckCircle2 size={12} /> مقبول ومفعل
                      </span>
                    );
                  } else if (statusRaw === 'rejected') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px]">
                        <XCircle size={12} /> مرفوض
                      </span>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                            <User size={18} />
                          </div>
                          <div>
                            <span className="text-gray-900 font-black block">{studentName}</span>
                            {studentEmail && (
                              <span className="text-[10px] text-gray-400 font-mono block">{studentEmail}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-gray-900 font-black">{bagTitle}</span>
                      </td>

                      <td className="p-4 text-gray-600">{dateStr}</td>

                      <td className="p-4 text-blue-600 font-black">
                        {typeof price === 'number' ? `${price} ج.م` : price}
                      </td>

                      <td className="p-4">
                        {receiptUrl ? (
                          <button
                            onClick={() => setPreviewReceiptUrl(receiptUrl)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] transition-colors cursor-pointer"
                          >
                            <FileText size={13} />
                            معاينة الإيصال
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[11px]">بدون إيصال</span>
                        )}
                      </td>

                      <td className="p-4">{statusBadge}</td>

                      <td className="p-4 text-center">
                        {statusRaw === 'pending' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'accepted')}
                              disabled={updatingId === item.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 size={13} />
                              <span>قبول وتفعيل</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'rejected')}
                              disabled={updatingId === item.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-black transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <XCircle size={13} />
                              <span>رفض</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px] font-bold">تم إتخاذ الإجراء</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-500">
            <div>
              عرض {purchases.length > 0 ? (page - 1) * limit + 1 : 0} إلى {Math.min(page * limit, totalCount)} من إجمالي {totalCount} طلب
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="الصفحة السابقة"
              >
                <ChevronRight size={16} />
              </button>

              <div className="flex items-center gap-1">
                {getPaginationWindow(page, totalPages).map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold text-xs select-none"
                      >
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(Number(p))}
                      className={`w-8 h-8 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        page === p
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="الصفحة التالية"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Modal Preview */}
      {previewReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-right animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-purple-600" />
                معاينة إيصال التحويل المرفق
              </h3>
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 flex justify-center max-h-[60vh]">
              {previewReceiptUrl.endsWith('.pdf') ? (
                <iframe src={previewReceiptUrl} className="w-full h-[400px]" title="Receipt PDF" />
              ) : (
                <img src={previewReceiptUrl} alt="Receipt" className="max-h-[60vh] object-contain rounded-xl" />
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AcademyBagSubscriptionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400" dir="rtl">
          <Loader2 size={40} className="animate-spin text-purple-600" />
          <span className="text-sm font-bold">جاري التحميل...</span>
        </div>
      }
    >
      <SubscriptionsContent />
    </Suspense>
  );
}
