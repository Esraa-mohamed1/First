'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  ShoppingCart,
  Download,
  CheckCircle2,
  Clock,
  Plus,
  Lightbulb,
  ImageIcon,
  Tag,
  Layers,
  Loader2,
  Film,
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import toast from 'react-hot-toast';
import BagCard from '@/components/Academic/Market/BagCard';
import { BagItem } from '@/types/market';
import { getAcademyBags, deleteBag, getBagPurchasesStats, BagApiItem, BagPurchasesStats } from '@/services/bags';

const MySwal = withReactContent(Swal);

/* Adapter: Convert API response shape to local BagItem shape */
function adaptApiBagToLocal(apiBag: BagApiItem): BagItem {
  return {
    id: apiBag.id,
    title: apiBag.title || '',
    description: apiBag.description || apiBag.short_description || '',
    coverImage: apiBag.image || '',
    category: apiBag.category_name || 'عام',
    instructorName: '',
    courseCount: Array.isArray(apiBag.items) ? apiBag.items.length : 0,
    rating: 4.9,
    price: Number(apiBag.price) || 0,
    discountPrice: apiBag.discount_price != null ? Number(apiBag.discount_price) : undefined,
    currency: apiBag.currency || 'SAR',
    isFree: apiBag.type_price === 'free',
    paymentMethods: (apiBag.payment_info_ids || []).map(String),
    downloadPolicy: 'unlimited',
    visibility: (apiBag.is_active === 1 || apiBag.is_active === true || apiBag.status === 'published' || apiBag.status === 'active') ? 'published' : 'draft',
    createdAt: apiBag.created_at?.split('T')[0] || '',
  };
}

export default function MarketPage() {
  const router = useRouter();
  const [bags, setBags] = useState<BagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BagPurchasesStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const fetchBagsFromApi = useCallback(async () => {
    setLoading(true);
    try {
      const apiBags = await getAcademyBags();
      setBags(apiBags.map(adaptApiBagToLocal));
    } catch (err) {
      console.error('Failed to load bags:', err);
      toast.error('فشل تحميل الحقائب، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatsFromApi = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(false);
    try {
      const data = await getBagPurchasesStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load bag purchases stats:', err);
      setStatsError(true);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBagsFromApi();
    fetchStatsFromApi();
  }, [fetchBagsFromApi, fetchStatsFromApi]);

  const handleNavigateToCreate = () => router.push('/academic/market/create');
  const handleNavigateToEdit = (bag: BagItem) => router.push(`/academic/market/edit/${bag.id}`);
  const handleNavigateToStats = (bag: BagItem) => router.push(`/academic/market/subscriptions?bag_id=${bag.id}`);

  const handleDeleteBag = async (id: number) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من التراجع عن حذف هذه الحقيبة التدريبية!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفها!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteBag(id);
        setBags((prev) => prev.filter((item) => item.id !== id));
        toast.success('تم حذف الحقيبة بنجاح');
      } catch (err: any) {
        console.error('Delete bag failed:', err);
        toast.error('فشل حذف الحقيبة، يرجى المحاولة لاحقاً');
      }
    }
  };

  const handlePreviewBag = (bag: BagItem) => router.push(`/academic/market/${bag.id}`);

  const renderStatValue = (val?: number) => {
    if (statsLoading) {
      return <span className="inline-block w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />;
    }
    if (statsError || val === undefined || val === null || isNaN(val)) {
      return <span className="text-xl font-bold text-gray-400">—</span>;
    }
    return (val ?? 0).toLocaleString('ar-EG');
  };

  return (
    <div className="space-y-10" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">متجر الحقائب</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/academic/videos')}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-5 py-3.5 rounded-2xl text-sm font-black text-white shadow-md shadow-purple-200 transition-all cursor-pointer"
          >
            <Film size={18} />
            <span>مكتبة الفيديوهات</span>
          </button>
          <button
            onClick={() => router.push('/academic/market/subscriptions')}
            className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 border border-purple-100 px-5 py-3.5 rounded-2xl text-sm font-black text-purple-700 shadow-sm transition-all cursor-pointer"
          >
            <ShoppingCart size={18} />
            <span>طلبات شراء الحقائب</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Requests */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">إجمالي الطلبات</span>
            <div className="w-12 h-12 rounded-2xl bg-purple-100/70 text-purple-600 flex items-center justify-center flex-shrink-0">
              <ShoppingCart size={22} />
            </div>
          </div>
          <div className="space-y-1 pt-2">
            <span className="text-3xl font-black text-gray-900 block">
              {renderStatValue(stats?.total_requests)}
            </span>
            <span className="text-xs font-bold text-gray-500 block">إجمالي طلبات الشراء</span>
          </div>
        </div>

        {/* Accepted Active */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">مقبول ونشط</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div className="space-y-1 pt-2">
            <span className="text-3xl font-black text-emerald-600 block">
              {renderStatValue(stats?.accepted_active)}
            </span>
            <span className="text-xs font-bold text-gray-500 block">الاشتراكات والطلبات المفعلة</span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">قيد المراجعة</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock size={22} />
            </div>
          </div>
          <div className="space-y-1 pt-2">
            <span className="text-3xl font-black text-amber-600 block">
              {renderStatValue(stats?.pending_review)}
            </span>
            <span className="text-xs font-bold text-gray-500 block">طلبات في انتظار التدقيق</span>
          </div>
        </div>

        {/* Total Downloads */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all min-h-[130px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">التنزيلات</span>
            <div className="w-12 h-12 rounded-2xl bg-orange-100/70 text-orange-500 flex items-center justify-center flex-shrink-0">
              <Download size={22} />
            </div>
          </div>
          <div className="space-y-1 pt-2">
            <span className="text-3xl font-black text-gray-900 block">
              {renderStatValue(stats?.total_downloads)}
            </span>
            <span className="text-xs font-bold text-gray-500 block">إجمالي تحميلات الحقائب</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <Loader2 size={40} className="animate-spin text-blue-500" />
          <span className="text-sm font-bold">جاري تحميل الحقائب...</span>
        </div>
      ) : bags.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-[36px] p-12 lg:p-20 text-center bg-white/40 backdrop-blur-sm space-y-6 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-purple-100/70 text-purple-600 flex items-center justify-center shadow-inner"><Layers size={42} /></div>
          <h3 className="text-2xl lg:text-3xl font-black text-gray-900">أنشئ أول حقيبة تدريبية وابدأ بيع محتواك للطلاب</h3>
          <p className="text-gray-500 font-bold max-w-xl text-sm lg:text-base leading-relaxed">أضف حقائبك التدريبية الرقمية، حدد أسعارها، ونظمها داخل متجرك لتصبح متاحة للشراء من قبل طلابك.</p>
          <button onClick={handleNavigateToCreate} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-base shadow-lg shadow-blue-200 hover:scale-105 transition-all cursor-pointer">
            <Plus size={22} strokeWidth={3} />
            <span>أنشئ أول حقيبة</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900">أخر الحقائب الإلكترونية التي أنشأتها</h3>
            <button onClick={handleNavigateToCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-md shadow-blue-100 transition-all cursor-pointer">
              <Plus size={18} strokeWidth={3} />
              <span>إنشاء حقيبة جديدة</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bags.map((bag) => (
              <BagCard
                key={bag.id}
                bag={bag}
                onEdit={handleNavigateToEdit}
                onDelete={handleDeleteBag}
                onPreview={handlePreviewBag}
                onStatistics={handleNavigateToStats}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6 pt-4">
        <h3 className="text-2xl font-black text-gray-900">نصائح لبداية سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><Lightbulb size={20} /></div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-gray-900">إخترا اسما جذابا</h4>
              <p className="text-xs font-bold text-gray-400 leading-relaxed">الأسماء الواضحة والمختصرة تساعد الطالب في الوصول لمنتجك بسهولة</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><ImageIcon size={20} /></div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-gray-900">استخدم صورا عالية الجودة</h4>
              <p className="text-xs font-bold text-gray-400 leading-relaxed">الغلاف هو اول ما يراه الطالب ، اجعله احترافيا وجذابا بصريا</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><Tag size={20} /></div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-gray-900">حدد سعرا المناسبا</h4>
              <p className="text-xs font-bold text-gray-400 leading-relaxed">ابحث في المنتجات المشابهه لتحديد سعر تنافسي يجذب المشترين الأوائل</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
