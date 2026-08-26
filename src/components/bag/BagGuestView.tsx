'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import {
  ArrowRight, ShoppingCart, Download, Share2, Bookmark, Star, CheckCircle2, BookOpen, Clock, ShieldCheck, CreditCard, FileText, Layers, Loader2, Check, Video, X,
  FileCode,
  FileType,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getBag, BagApiItem, BagItemDetail } from '@/services/bags';
import { getCourses } from '@/services/courses';
import { getUserPaymentInfos } from '@/services/finance';
import { Course } from '@/types/api';

interface BagGuestViewProps {
  bagId: string;
}

function getFileNameFromPath(path: string): string {
  if (!path) return 'ملف مرفق';
  try {
    const rawName = path.split('/').pop() || path;
    const cleaned = rawName.replace(/^\d+_\d+_/, '').replace(/^\d+_/, '');
    return decodeURIComponent(cleaned) || rawName;
  } catch (e) {
    return path;
  }
}

function getItemTypeBadge(type?: string, path?: string) {
  const ext = path ? path.split('.').pop()?.toLowerCase() : '';
  const t = (type || ext || 'file').toLowerCase();

  if (t === 'pdf' || ext === 'pdf') {
    return { label: 'PDF', bg: 'bg-red-50 text-red-600 border-red-100', icon: FileType };
  }
  if (t === 'video' || ext === 'mp4' || ext === 'webm' || ext === 'mov') {
    return { label: 'فيديو', bg: 'bg-purple-50 text-purple-600 border-purple-100', icon: Video };
  }
  if (t === 'image' || ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp') {
    return { label: 'صورة', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Layers };
  }
  if (ext === 'html' || ext === 'js' || ext === 'css') {
    return { label: 'ملف كود', bg: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: FileCode };
  }
  return { label: type || 'ملف', bg: 'bg-blue-50 text-blue-600 border-blue-100', icon: FileText };
}

export default function BagGuestView({ bagId }: BagGuestViewProps) {
  const router = useRouter();

  const [bag, setBag] = useState<BagApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [includedCourses, setIncludedCourses] = useState<Course[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<Array<{ id: number; name: string; logo?: string; account_number?: string }>>([]);

  const [isSaved, setIsSaved] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    if (!bagId) {
      setNotFoundState(true);
      setLoading(false);
      return;
    }

    const loadBagData = async () => {
      setLoading(true);
      try {
        const bagData = await getBag(bagId);
        if (bagData && bagData.id) {
          setBag(bagData);
          if (bagData.image) setActiveImage(bagData.image);

          if (Array.isArray(bagData.items) && bagData.items.length > 0) {
            const firstItem = bagData.items[0];
            if (typeof firstItem === 'number' || typeof firstItem === 'string') {
              try {
                const allCourses = await getCourses();
                const matched = allCourses.filter((c) => (bagData.items as any[])?.includes(c.id));
                setIncludedCourses(matched);
              } catch (err) {
                console.error('Failed to load courses for bag:', err);
              }
            }
          }

          try {
            const infos = await getUserPaymentInfos();
            if (Array.isArray(infos) && infos.length > 0) {
              const mapped = infos.map((info: any) => ({
                id: info.id,
                name: info.name || info.receiver_account?.name || 'وسيلة دفع',
                logo: info.logo || info.receiver_account?.logo || '',
                account_number: info.account_number || info.receiver_account?.account_number || '',
              }));
              setPaymentMethods(mapped);
              if (mapped.length > 0) setSelectedPaymentMethod(mapped[0].id);
            }
          } catch (err) {
            console.error('Failed to load payment methods:', err);
          }
        } else {
          setNotFoundState(true);
        }
      } catch (err) {
        console.error('Failed to load bag details:', err);
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    };

    loadBagData();
  }, [bagId]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: bag?.title || 'حقيبة رقمية',
          text: bag?.description || '',
          url: shareUrl,
        }).catch(() => {
          navigator.clipboard.writeText(shareUrl);
          toast.success('تم نسخ رابط الحقيبة بنجاح!');
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast.success('تم نسخ رابط الحقيبة بنجاح!');
      }
    }
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'تم إزالة الحقيبة من المحفوظات' : 'تم حفظ الحقيبة بنجاح!');
  };

  const handleConfirmPurchase = () => {
    setIsProcessingPurchase(true);
    setTimeout(() => {
      setIsProcessingPurchase(false);
      setPurchaseSuccess(true);
      toast.success('تمت عملية الشراء بنجاح! يمكنك الآن تنزيل جميع محتويات الحقيبة.');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-gray-400" dir="rtl">
        <Loader2 size={44} className="animate-spin text-blue-600" />
        <span className="text-base font-bold text-gray-600">جاري تحميل تفاصيل الحقيبة التدريبية...</span>
      </div>
    );
  }

  if (notFoundState || !bag) {
    return notFound();
  }

  const isFree = bag.type_price === 'free' || (!bag.price && !bag.discount_price);
  const numericPrice = typeof bag.price === 'string' ? parseFloat(bag.price) : bag.price || 0;
  const numericDiscount = typeof bag.discount_price === 'string' ? parseFloat(bag.discount_price) : bag.discount_price || 0;

  const displayPrice = numericDiscount > 0 ? numericDiscount : numericPrice;
  const originalPrice = numericPrice > numericDiscount && numericDiscount > 0 ? numericPrice : null;

  const itemsList: BagItemDetail[] = Array.isArray(bag.items)
    ? bag.items.filter((item): item is BagItemDetail => typeof item === 'object' && item !== null && 'path' in item)
    : [];

  const totalItemsCount = itemsList.length > 0 ? itemsList.length : includedCourses.length > 0 ? includedCourses.length : 0;

  const allGalleryUrls: string[] = [];
  if (bag.image) allGalleryUrls.push(bag.image);
  if (Array.isArray(bag.gallery)) {
    bag.gallery.forEach((g: any) => {
      const url = typeof g === 'string' ? g : g?.path || g?.url;
      if (url && !allGalleryUrls.includes(url)) {
        allGalleryUrls.push(url);
      }
    });
  }

  const currentDisplayImage = activeImage || bag.image;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen" dir="rtl">
      {/* Top Header Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <span>الحقائب الرقمية</span>
            <span>/</span>
            <span className="text-gray-700">{bag.category_name || 'عام'}</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{bag.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200 text-gray-600 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
            title="مشاركة"
          >
            <Share2 size={18} />
          </button>

          <button
            onClick={handleToggleSave}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-sm transition-all cursor-pointer ${isSaved ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            title="حفظ"
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Right Column: Bag Details & Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Cover Banner & Gallery Selector */}
          <div className="space-y-4">
            <div className="relative w-full h-72 lg:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 shadow-lg border border-gray-100">
              {currentDisplayImage ? (
                <img src={currentDisplayImage} alt={bag.title} className="w-full h-full object-cover transition-all duration-300" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/50 gap-4">
                  <Layers size={64} />
                  <span className="text-sm font-bold text-white/60">غلاف الحقيبة التدريبية</span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-xl shadow-md">
                  {bag.category_name || 'حقيبة رقمية'}
                </span>
                {isFree ? (
                  <span className="bg-emerald-500/90 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-xl shadow-md">
                    مجانية
                  </span>
                ) : (
                  <span className="bg-amber-500/90 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-xl shadow-md">
                    مدفوعة
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails Carousel Row */}
            {allGalleryUrls.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                {allGalleryUrls.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${currentDisplayImage === imgUrl
                        ? 'border-blue-600 ring-2 ring-blue-100 scale-105 shadow-md'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <FileText size={22} className="text-blue-600" />
                <span>عن الحقيبة التدريبية</span>
              </h2>

              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl font-bold text-xs">
                <Star size={15} fill="currentColor" className="text-amber-400" />
                <span>4.9 (128 تقييم)</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm font-medium leading-relaxed whitespace-pre-line">
              {bag.description ||
                bag.short_description ||
                'تتضمن هذه الحقيبة مجموعة متكاملة من الدروس والملفات المجهزة بعناية لمساعدتك على إتقان كافة المهارات المطلوبة.'}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center space-y-1">
                <BookOpen size={22} className="text-blue-600" />
                <span className="text-xs font-bold text-gray-400">إجمالي العناصر</span>
                <span className="text-sm font-black text-gray-900">{totalItemsCount} ملفات ومصادر</span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center space-y-1">
                <Clock size={22} className="text-purple-600" />
                <span className="text-xs font-bold text-gray-400">مدة الوصول</span>
                <span className="text-sm font-black text-gray-900">مدى الحياة</span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center space-y-1">
                <Download size={22} className="text-emerald-600" />
                <span className="text-xs font-bold text-gray-400">التحميل</span>
                <span className="text-sm font-black text-gray-900">مباشر وغير محدود</span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center space-y-1">
                <ShieldCheck size={22} className="text-amber-600" />
                <span className="text-xs font-bold text-gray-400">الشهادة</span>
                <span className="text-sm font-black text-gray-900">شهادة إتمام</span>
              </div>
            </div>
          </div>

          {/* Items Section: Display items from API response */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Layers size={22} className="text-purple-600" />
                  <span>محتويات وملفات الحقيبة (Items)</span>
                </h2>
                <p className="text-xs font-bold text-gray-400 mt-1">
                  تحتوي هذه الحقيبة على {totalItemsCount} ملفات ومواد قابلة للتنزيل والوصول
                </p>
              </div>
            </div>

            {itemsList.length > 0 ? (
              <div className="space-y-4">
                {itemsList.map((item, idx) => {
                  const badge = getItemTypeBadge(item.type, item.path);
                  const BadgeIcon = badge.icon;
                  const fileName = getFileNameFromPath(item.path);

                  return (
                    <div
                      key={item.id || idx}
                      className="p-5 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-2xl border ${badge.bg} flex items-center justify-center flex-shrink-0 font-black text-base`}>
                          <BadgeIcon size={22} />
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-base font-black text-gray-900 dir-ltr text-right line-clamp-1">
                            {fileName}
                          </h4>
                          <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                            <span className={`px-2.5 py-0.5 rounded-lg border font-black ${badge.bg}`}>
                              {badge.label}
                            </span>
                            <span>•</span>
                            <span>رقم العنصر #{item.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200">
                        <a
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-sm shadow-blue-200 transition-all cursor-pointer"
                        >
                          <Download size={15} />
                          <span>تنزيل / فتح الملف</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : includedCourses.length > 0 ? (
              <div className="space-y-4">
                {includedCourses.map((course, idx) => (
                  <div
                    key={course.id || idx}
                    className="p-5 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-black text-base">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-gray-900">{course.title}</h4>
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                          <span>{typeof course.category === 'object' && course.category !== null ? (course.category as any).name : (course.category || 'دورة تدريبية')}</span>
                          <span>•</span>
                          <span>{(course as any).user?.name || course.instructor_name || (typeof course.instructor === 'object' && course.instructor !== null ? (course.instructor as any).name : (course.instructor || 'أحمد محمد'))}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200">
                      <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl">
                        تتضمن جميع الدروس
                      </span>
                      <button
                        onClick={() => router.push(`/courses/${course.slug || course.id}`)}
                        className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>معاينة الدورة</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-2xl text-gray-400 font-bold text-sm">
                تحتوي الحقيبة على مواد تدريبية متكاملة تفتح فور الشراء.
              </div>
            )}
          </div>
        </div>

        {/* Left Column: Purchase Card & Guarantee Sticky Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 block">السعر الكلي للحقيبة</span>
              {isFree ? (
                <div className="text-3xl font-black text-emerald-600">مجاناً</div>
              ) : (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-gray-900">{displayPrice} ج.م</span>
                  {originalPrice && (
                    <span className="text-lg font-bold text-gray-400 line-through">
                      {originalPrice} ج.م
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowBuyModal(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base flex items-center justify-center gap-3 shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <ShoppingCart size={22} />
                <span>{isFree ? 'احصل عليها مجاناً الآن' : 'اشترِ الحقيبة الآن'}</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full py-3.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 size={18} />
                <span>مشاركة رابط الحقيبة</span>
              </button>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                مميزات الشراء المباشر:
              </h4>

              <ul className="space-y-2.5 text-xs font-bold text-gray-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>وصول فوري لجميع محتويات الحقيبة</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>تحديثات مستمرة مجانية بدون رسوم إضافية</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>تحميل مباشر لجميع ملفات الحقيبة</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>دعم فني وتواصل مباشر مع المدرب</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                طرق الدفع المقبولة:
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((pm) => (
                    <span
                      key={pm.id}
                      className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 flex items-center gap-1.5"
                    >
                      <CreditCard size={13} className="text-blue-600" />
                      <span>{pm.name}</span>
                    </span>
                  ))
                ) : (
                  <>
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200">
                      فودافون كاش
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200">
                      إنستا باي InstaPay
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200">
                      بطاقات ائتمان
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl p-6 border border-blue-100 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-200">
              <ShieldCheck size={26} />
            </div>
            <h4 className="text-base font-black text-gray-900">شراء آمن ومضمون 100%</h4>
            <p className="text-xs font-bold text-gray-500 leading-relaxed">
              جميع المعاملات المالية محمية بنظام تشفير عالي الأمان. بمجرد تأكيد الشراء ستتمكن من تنزيل المحتوى فورا.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Checkout Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">إتمام شراء الحقيبة</h3>
                  <p className="text-xs font-bold text-gray-400">تأكيد عملية الشراء واختيار طريقة الدفع</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setPurchaseSuccess(false);
                }}
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {purchaseSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">تمت عملية الشراء بنجاح!</h3>
                    <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto">
                      مبروك! تم إضافة حقيبة "{bag.title}" إلى حسابك ويمكنك الآن الوصول لجميع محتوياتها وتنزيلها.
                    </p>
                  </div>

                  {itemsList.length > 0 && (
                    <div className="space-y-2 text-right pt-2 border-t border-gray-100">
                      <span className="text-xs font-black text-gray-600 block">ملفات الحقيبة الجاهزة للتنزيل:</span>
                      {itemsList.map((item, idx) => (
                        <a
                          key={item.id || idx}
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-blue-600 transition-colors"
                        >
                          <span className="truncate">{getFileNameFromPath(item.path)}</span>
                          <Download size={14} />
                        </a>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setShowBuyModal(false);
                      setPurchaseSuccess(false);
                    }}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all mt-4 cursor-pointer"
                  >
                    إغلاق المودال
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                    {bag.image ? (
                      <img src={bag.image} alt={bag.title} className="w-14 h-14 rounded-xl object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Layers size={24} />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-black text-gray-900 line-clamp-1">{bag.title}</h4>
                      <span className="text-xs font-bold text-gray-400 block">
                        {totalItemsCount} ملفات ومحتوى تدريبي
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-blue-600 block">
                        {isFree ? 'مجاناً' : `${displayPrice} ج.م`}
                      </span>
                    </div>
                  </div>

                  {!isFree && (
                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-700 block">اختر طريقة الدفع المناسبة:</label>
                      <div className="space-y-2">
                        {paymentMethods.length > 0 ? (
                          paymentMethods.map((pm) => (
                            <div
                              key={pm.id}
                              onClick={() => setSelectedPaymentMethod(pm.id)}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedPaymentMethod === pm.id
                                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === pm.id
                                      ? 'border-blue-600 bg-blue-600 text-white'
                                      : 'border-gray-300'
                                    }`}
                                >
                                  {selectedPaymentMethod === pm.id && <Check size={12} strokeWidth={3} />}
                                </div>
                                <span className="text-sm font-black text-gray-800">{pm.name}</span>
                              </div>
                              {pm.account_number && (
                                <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-xl border border-gray-200">
                                  {pm.account_number}
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 rounded-2xl border border-blue-600 bg-blue-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border-2 border-blue-600 bg-blue-600 text-white flex items-center justify-center">
                                <Check size={12} strokeWidth={3} />
                              </div>
                              <span className="text-sm font-black text-gray-800">الدفع الإلكتروني السريع</span>
                            </div>
                            <span className="text-xs font-bold text-gray-500">مباشر</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleConfirmPurchase}
                    disabled={isProcessingPurchase}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessingPurchase ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>جاري معالجة الطلب...</span>
                      </>
                    ) : (
                      <span>{isFree ? 'تأكيد الحصول المجاني' : 'تأكيد الدفع والشراء الآن'}</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
