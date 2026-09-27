'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import {
  ArrowRight, ShoppingCart, Download, Share2, Bookmark, Star, CheckCircle2, BookOpen, Clock, ShieldCheck, CreditCard, FileText, Layers, Loader2, Check, Video, X, Clipboard,
  FileCode,
  FileType,
  ExternalLink,
  Lock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getBag, BagApiItem, BagItemDetail, purchaseBag, getCurrencySymbol } from '@/services/bags';
import { getStudentCourses } from '@/services/student-courses';
import { getUserPaymentInfos } from '@/services/finance';
import { Course } from '@/types/api';
import { useModal } from '@/context/ModalContext';
import { getStoredAuthToken, persistAuthToken } from '@/lib/auth-storage';
import { registerStudent } from '@/services/student-auth';
import { login } from '@/services/auth';
import { PhoneInput } from '@/components/CountrySelector';

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
  const { openModal } = useModal();

  const [bag, setBag] = useState<BagApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [includedCourses, setIncludedCourses] = useState<Course[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<Array<{ id: number; name: string; logo?: string; account_number?: string }>>([]);

  const [isSaved, setIsSaved] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Student Authentication state for modal
  const [authTokenState, setAuthTokenState] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  // Registration form fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // Login form fields
  const [loginIdentity, setLoginIdentity] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkToken = () => {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || getStoredAuthToken()) : null;
      setAuthTokenState(token);
    };
    checkToken();

    if (typeof window !== 'undefined') {
      window.addEventListener('student-registered', checkToken);
      window.addEventListener('student-logged-in', checkToken);
      window.addEventListener('auth-changed', checkToken);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('student-registered', checkToken);
        window.removeEventListener('student-logged-in', checkToken);
        window.removeEventListener('auth-changed', checkToken);
      }
    };
  }, []);

  const handleOpenBuyModal = () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || getStoredAuthToken()) : null;
    setAuthTokenState(token);
    setShowBuyModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setReceiptPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const handleStudentRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const errs: Record<string, string> = {};

    if (!regName.trim()) errs.name = 'يرجى إدخال الاسم الكامل';
    if (!regEmail.trim()) errs.email = 'يرجى إدخال البريد الإلكتروني';
    else if (!/\S+@\S+\.\S+/.test(regEmail)) errs.email = 'البريد الإلكتروني غير صالح';
    if (!regPhone.trim()) errs.phone = 'يرجى إدخال رقم الجوال';
    if (!regPassword) errs.password = 'يرجى إدخال كلمة المرور';
    else if (regPassword.length < 8) errs.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (regPassword !== regConfirmPassword) errs.confirmPassword = 'كلمات المرور غير متطابقة';

    if (Object.keys(errs).length > 0) {
      setRegErrors(errs);
      return;
    }

    setAuthLoading(true);
    try {
      const response = await registerStudent({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        password_confirmation: regConfirmPassword,
        role: 'student',
      });

      const resObj: any = response;
      let token = resObj.data?.token || resObj.token || resObj.data?.access_token || resObj.access_token;
      if (!token && resObj.meta?.access_token) token = resObj.meta.access_token;
      if (!token && resObj.data?.meta?.access_token) token = resObj.data.meta.access_token;

      if (token) {
        persistAuthToken(token);
        localStorage.setItem('user_info', JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          role: 'student',
        }));
        setAuthTokenState(token);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('student-registered'));
          window.dispatchEvent(new CustomEvent('student-logged-in'));
        }
        toast.success('تم إنشاء حساب الطالب بنجاح! يمكنك الآن إكمال عملية الشراء.');
      } else {
        toast.success('تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول.');
        setAuthMode('login');
        setLoginIdentity(regEmail.trim() || regPhone.trim());
      }
    } catch (err: any) {
      console.error('Failed to register student:', err);
      let errorMsg = 'حدث خطأ أثناء إنشاء الحساب. يرجى التأكد من البيانات والمحاولة مجدداً.';
      if (err?.errors && typeof err.errors === 'object') {
        const firstVal = Object.values(err.errors)[0];
        if (Array.isArray(firstVal) && firstVal.length > 0) {
          errorMsg = String(firstVal[0]);
        } else if (typeof firstVal === 'string') {
          errorMsg = firstVal;
        }
      } else if (err?.message) {
        errorMsg = String(err.message);
      }
      setAuthError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleStudentLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const errs: Record<string, string> = {};

    if (!loginIdentity.trim()) errs.identity = 'يرجى إدخال البريد الإلكتروني أو رقم الجوال';
    if (!loginPassword) errs.password = 'يرجى إدخال كلمة المرور';

    if (Object.keys(errs).length > 0) {
      setLoginErrors(errs);
      return;
    }

    setAuthLoading(true);
    try {
      const isEmail = loginIdentity.includes('@');
      const payload = isEmail
        ? { email: loginIdentity.trim(), password: loginPassword }
        : { phone: loginIdentity.trim().replace(/\D/g, ''), password: loginPassword };

      const res = await login(payload);
      const token = res.meta?.access_token || (res as any).data?.token || (res as any).token;

      if (token) {
        persistAuthToken(token);
        if (res.data) {
          localStorage.setItem('user_info', JSON.stringify({
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone,
            role: (res.data as any).role || 'student',
          }));
        }
        setAuthTokenState(token);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('student-logged-in'));
        }
        toast.success('تم تسجيل الدخول بنجاح! يمكنك الآن إكمال عملية الشراء.');
      } else {
        throw new Error('لم يتم استلام رمز المصادقة');
      }
    } catch (err: any) {
      console.error('Failed to login student:', err);
      let errorMsg = 'بيانات الدخول غير صحيحة';
      if (err?.errors && typeof err.errors === 'object') {
        const firstVal = Object.values(err.errors)[0];
        if (Array.isArray(firstVal) && firstVal.length > 0) {
          errorMsg = String(firstVal[0]);
        } else if (typeof firstVal === 'string') {
          errorMsg = firstVal;
        }
      } else if (err?.message) {
        errorMsg = String(err.message);
      }
      setAuthError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfirmPurchase = async () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || getStoredAuthToken()) : null;
    if (!token) {
      setAuthTokenState(null);
      setAuthMode('register');
      toast.error('يرجى إنشاء حساب طالب جديد أو تسجيل الدخول أولاً لإتمام الشراء');
      return;
    }

    if (!isFree && paymentMethods.length > 0 && !selectedPaymentMethod) {
      toast.error('يرجى اختيار طريقة الدفع أولاً');
      return;
    }
    if (!isFree && !receiptFile) {
      toast.error('يرجى إرفاق صورة أو ملف إيصال الدفع لاستكمال الطلب');
      return;
    }

    setIsProcessingPurchase(true);
    try {
      await purchaseBag({
        bag_id: bagId,
        payment_info_id: selectedPaymentMethod || undefined,
        receipt: receiptFile,
      });
      setIsProcessingPurchase(false);
      setPurchaseSuccess(true);
      toast.success(isFree ? 'تم الحصول على الحقيبة بنجاح!' : 'تم تقديم طلب شراء الحقيبة بنجاح!');
    } catch (err: any) {
      console.error('Failed to submit bag purchase:', err);
      setIsProcessingPurchase(false);
      setPurchaseSuccess(false);

      const status = err?.status || err?.statusCode || err?.response?.status;
      if (
        status === 401 ||
        err?.message?.includes('unauthenticated') ||
        err?.message?.includes('Unauthenticated') ||
        err?.message?.includes('غير مصرح')
      ) {
        setShowBuyModal(false);
        toast.error('جلسة الدخول منتهية. يرجى تسجيل الدخول أو إنشاء حساب جديد لإتمام الطلب');
        openModal('registration');
        return;
      }

      let errorMsg = 'حدث خطأ أثناء تقديم طلب الشراء. يرجى التأكد من البيانات والمحاولة مجدداً.';
      if (err?.errors) {
        const firstVal = Object.values(err.errors)[0];
        if (Array.isArray(firstVal) && firstVal.length > 0) {
          errorMsg = String(firstVal[0]);
        } else if (typeof firstVal === 'string') {
          errorMsg = firstVal;
        }
      } else if (err?.message) {
        errorMsg = String(err.message);
      }
      toast.error(errorMsg);
    }
  };

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
                const allCourses = await getStudentCourses();
                const matched = allCourses.filter((c: any) => (bagData.items as any[])?.includes(c.id));
                setIncludedCourses(matched as Course[]);
              } catch (err) {
                console.error('Failed to load courses for bag:', err);
              }
            }
          }

          // Load payment methods - resolve full details from getUserPaymentInfos
          try {
            const allUserAccounts = await getUserPaymentInfos();
            const bagPaymentIds = Array.isArray(bagData.payment_info_ids)
              ? bagData.payment_info_ids.map(Number)
              : Array.isArray(bagData.payment_infos)
                ? bagData.payment_infos.map((p: any) => Number(p.id || p.payment_info_id))
                : [];

            let mapped: Array<{ id: number; name: string; logo?: string; account_number?: string }> = [];

            if (bagPaymentIds.length > 0 && Array.isArray(allUserAccounts) && allUserAccounts.length > 0) {
              const matched = allUserAccounts.filter((acc: any) => bagPaymentIds.includes(Number(acc.id)));
              if (matched.length > 0) {
                mapped = matched.map((acc: any) => ({
                  id: acc.id,
                  name: acc.receiver_account?.name || acc.name || 'وسيلة دفع',
                  logo: acc.receiver_account?.logo || acc.logo || '',
                  account_number: acc.accountValue || acc.account_value || '',
                }));
              }
            }

            if (mapped.length === 0 && Array.isArray(bagData.payment_infos) && bagData.payment_infos.length > 0) {
              mapped = bagData.payment_infos.map((info: any, idx: number) => ({
                id: info.id || info.payment_info_id || (idx + 1),
                name: info.name || info.account_name || info.payment_info?.name || info.receiver_account?.name || `وسيلة دفع #${idx + 1}`,
                logo: info.logo || info.payment_info?.logo || info.receiver_account?.logo || '',
                account_number: info.value || info.account_number || info.payment_info?.account_number || info.receiver_account?.account_number || '',
              }));
            }

            setPaymentMethods(mapped);
            if (mapped.length > 0) setSelectedPaymentMethod(mapped[0].id);
          } catch (e) {
            console.error('Failed to resolve payment accounts:', e);
            if (Array.isArray(bagData.payment_infos) && bagData.payment_infos.length > 0) {
              const mapped = bagData.payment_infos.map((info: any, idx: number) => ({
                id: info.id || info.payment_info_id || (idx + 1),
                name: info.name || info.account_name || info.payment_info?.name || info.receiver_account?.name || `وسيلة دفع #${idx + 1}`,
                logo: info.logo || info.payment_info?.logo || info.receiver_account?.logo || '',
                account_number: info.value || info.account_number || info.payment_info?.account_number || info.receiver_account?.account_number || '',
              }));
              setPaymentMethods(mapped);
              if (mapped.length > 0) setSelectedPaymentMethod(mapped[0].id);
            }
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

  const getBagShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const shareSlug = (bag as any)?.slug || bag?.id || bagId;
    return `${window.location.origin}/bags/${shareSlug}`;
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = getBagShareUrl();
      if (navigator.share) {
        navigator.share({
          title: bag?.title || 'حقيبة رقمية',
          text: bag?.description || '',
          url: shareUrl,
        }).catch(() => {
          setShowShareModal(true);
        });
      } else {
        setShowShareModal(true);
      }
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = getBagShareUrl();
      navigator.clipboard.writeText(shareUrl);
      toast.success('تم نسخ رابط الحقيبة بنجاح!');
      setShowShareModal(false);
    }
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'تم إزالة الحقيبة من المحفوظات' : 'تم حفظ الحقيبة بنجاح!');
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
  const isPurchased = Boolean(
    purchaseSuccess ||
    bag.purchased === true ||
    (bag as any).purchased === 1 ||
    bag.is_purchased === true ||
    (bag as any).is_purchased === 1 ||
    (bag as any).is_purchased === 'true'
  );

  const numericPrice = typeof bag.price === 'string' ? parseFloat(bag.price) : bag.price || 0;
  const numericDiscount = typeof bag.discount_price === 'string' ? parseFloat(bag.discount_price) : bag.discount_price || 0;

  const displayPrice = numericDiscount > 0 ? numericDiscount : numericPrice;
  const originalPrice = numericPrice > numericDiscount && numericDiscount > 0 ? numericPrice : null;
  const currencySymbol = getCurrencySymbol(bag.currency);

  const itemsList: BagItemDetail[] = Array.isArray(bag.items)
    ? bag.items.filter((item): item is BagItemDetail => typeof item === 'object' && item !== null && 'path' in item)
    : [];

  const totalItemsCount = itemsList.length > 0 ? itemsList.length : includedCourses.length > 0 ? includedCourses.length : 0;

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const allGalleryUrls: string[] = [];
  if (bag.image) allGalleryUrls.push(bag.image);

  let rawGallery: any = bag.gallery ?? (bag as any).galleries ?? (bag as any).bag_galleries ?? (bag as any).images ?? [];
  if (typeof rawGallery === 'string') {
    try {
      rawGallery = JSON.parse(rawGallery);
    } catch (e) {
      if (rawGallery.includes(',')) {
        rawGallery = rawGallery.split(',').map((s: string) => s.trim());
      } else if (rawGallery.trim()) {
        rawGallery = [rawGallery.trim()];
      } else {
        rawGallery = [];
      }
    }
  }

  if (Array.isArray(rawGallery)) {
    rawGallery.forEach((g: any) => {
      const url = typeof g === 'string'
        ? g
        : (g?.image || g?.image_url || g?.url || g?.path || g?.file_url || g?.file || g?.photo || g?.photo_url || g?.full_url || g?.attachment);
      if (url && !allGalleryUrls.includes(url)) {
        allGalleryUrls.push(url);
      }
    });
  }

  const currentDisplayImage = activeImage || (allGalleryUrls.length > 0 ? allGalleryUrls[0] : bag.image);
  const currentImageIndex = currentDisplayImage ? Math.max(0, allGalleryUrls.indexOf(currentDisplayImage)) : 0;

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allGalleryUrls.length <= 1) return;
    const nextIdx = (currentImageIndex + 1) % allGalleryUrls.length;
    setActiveImage(allGalleryUrls[nextIdx]);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allGalleryUrls.length <= 1) return;
    const prevIdx = (currentImageIndex - 1 + allGalleryUrls.length) % allGalleryUrls.length;
    setActiveImage(allGalleryUrls[prevIdx]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen" dir="rtl">
      {/* Top Header Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            title="رجوع"
          >
            <ArrowRight size={20} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <span>الحقائب الرقمية</span>
              <span>/</span>
              <span className="text-gray-700">{bag.category_name || 'عام'}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{bag.title}</h1>
          </div>
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
            <div
              onClick={() => currentDisplayImage && setLightboxOpen(true)}
              className={`relative w-full h-72 lg:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 shadow-lg border border-gray-100 group ${currentDisplayImage ? 'cursor-pointer' : ''}`}
            >
              {currentDisplayImage ? (
                <img
                  src={currentDisplayImage}
                  alt={bag.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/50 gap-4">
                  <Layers size={64} />
                  <span className="text-sm font-bold text-white/60">غلاف الحقيبة التدريبية</span>
                </div>
              )}

              {/* Category & Price badges */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
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

              {/* Image Counter & Lightbox trigger */}
              {allGalleryUrls.length > 0 && (
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20">
                    {currentImageIndex + 1} / {allGalleryUrls.length}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxOpen(true);
                    }}
                    className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/20 cursor-pointer"
                    title="تكبير الصورة"
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>
              )}

              {/* Navigation Arrows for Gallery Carousel */}
              {allGalleryUrls.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all z-10 cursor-pointer shadow-lg hover:scale-110"
                    title="الصورة السابقة"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all z-10 cursor-pointer shadow-lg hover:scale-110"
                    title="الصورة التالية"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Gallery Thumbnails Carousel Row */}
            {allGalleryUrls.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black text-gray-500 flex items-center gap-1.5">
                    <Layers size={14} className="text-blue-600" />
                    <span>معرض صور الحقيبة ({allGalleryUrls.length} صور)</span>
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">انقر على أي صورة للمعاينة والتكبير</span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                  {allGalleryUrls.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer relative group ${currentDisplayImage === imgUrl
                        ? 'border-blue-600 ring-4 ring-blue-100 scale-105 shadow-md'
                        : 'border-gray-200 opacity-75 hover:opacity-100 hover:border-gray-300'
                        }`}
                    >
                      <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      {currentDisplayImage === imgUrl && (
                        <span className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
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
              {/* 
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl font-bold text-xs">
                <Star size={15} fill="currentColor" className="text-amber-400" />
                <span>4.9 (128 تقييم)</span>
              </div> */}
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

              {/* <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center space-y-1">
                <ShieldCheck size={22} className="text-amber-600" />
                <span className="text-xs font-bold text-gray-400">الشهادة</span>
                <span className="text-sm font-black text-gray-900">شهادة إتمام</span>
              </div> */}
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
                        {Boolean(
                          isPurchased ||
                          isFree ||
                          purchaseSuccess ||
                          bag.purchased === true ||
                          (bag as any).is_purchased === true ||
                          (!bag.price && !bag.discount_price)
                        ) ? (
                          <a
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-sm shadow-blue-200 transition-all cursor-pointer"
                          >
                            <Download size={15} />
                            <span>تنزيل / فتح الملف</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="flex items-center gap-2 bg-gray-100 text-gray-400 px-5 py-2.5 rounded-xl font-black text-xs cursor-not-allowed border border-gray-200"
                            title="يجب شراء الحقيبة أولاً للتمكن من تحميل الملفات"
                          >
                            <Lock size={15} />
                            <span>التنزيل غير متاح (شراء مطلوب)</span>
                          </button>
                        )}
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
                  <span className="text-4xl font-black text-gray-900">{displayPrice} {currencySymbol}</span>
                  {originalPrice && (
                    <span className="text-lg font-bold text-gray-400 line-through">
                      {originalPrice} {currencySymbol}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {isPurchased ? (
                <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-base flex items-center justify-center gap-2.5 shadow-sm">
                  <CheckCircle2 size={22} className="text-emerald-600" />
                  <span>الحقيبة مشتراة ومتاحة بالكامل</span>
                </div>
              ) : (
                <button
                  onClick={handleOpenBuyModal}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base flex items-center justify-center gap-3 shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingCart size={22} />
                  <span>{isFree ? 'احصل عليها مجاناً الآن' : 'اشترِ الحقيبة الآن'}</span>
                </button>
              )}

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
                  <span>
                    {bag.count_download != null && Number(bag.count_download) > 0
                      ? `عدد التحميلات المتاحة: ${bag.count_download} مرات`
                      : 'تحميل غير محدود وتنزيل دائم (مدى الحياة)'}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>دعم فني وتواصل مباشر</span>
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
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200">
                    الدفع الإلكتروني عبر الأكاديمية
                  </span>
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
              {!authTokenState ? (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <UserPlus size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900">إنشاء حساب طالب لشراء الحقيبة</h4>
                      <p className="text-xs font-bold text-gray-500">يتطلب شراء الحقيبة وجود حساب طالب فعال لربط المشتريات والملفات</p>
                    </div>
                  </div>

                  {/* Tab switcher */}
                  <div className="flex rounded-2xl bg-gray-100 p-1 border border-gray-200">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('register'); setAuthError(''); }}
                      className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                        authMode === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      إنشاء حساب طالب جديد
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setAuthError(''); }}
                      className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                        authMode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      تسجيل الدخول لحسابك
                    </button>
                  </div>

                  {authError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {authMode === 'register' ? (
                    <form onSubmit={handleStudentRegisterSubmit} className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="block text-right text-xs font-black text-gray-700">الاسم الكامل <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <input
                            type="text"
                            name="regName"
                            value={regName}
                            onChange={(e) => { setRegName(e.target.value); if (regErrors.name) setRegErrors(prev => ({ ...prev, name: '' })); }}
                            placeholder="أدخل اسمك الكامل"
                            className={`w-full p-3 pr-10 text-right bg-gray-50 border rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-xs text-gray-900 ${
                              regErrors.name ? 'border-red-500' : 'border-gray-200'
                            }`}
                          />
                          <User className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={16} />
                        </div>
                        {regErrors.name && <p className="text-red-500 text-[10px] font-bold px-1">{regErrors.name}</p>}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="block text-right text-xs font-black text-gray-700">البريد الإلكتروني <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <input
                            type="email"
                            name="regEmail"
                            value={regEmail}
                            onChange={(e) => { setRegEmail(e.target.value); if (regErrors.email) setRegErrors(prev => ({ ...prev, email: '' })); }}
                            placeholder="example@mail.com"
                            className={`w-full p-3 pr-10 text-right bg-gray-50 border rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-xs text-gray-900 ${
                              regErrors.email ? 'border-red-500' : 'border-gray-200'
                            }`}
                          />
                          <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={16} />
                        </div>
                        {regErrors.email && <p className="text-red-500 text-[10px] font-bold px-1">{regErrors.email}</p>}
                      </div>

                      {/* Phone Input with Country Selector */}
                      <div className="space-y-1">
                        <label className="block text-right text-xs font-black text-gray-700">رقم الجوال <span className="text-red-500">*</span></label>
                        <PhoneInput
                          name="regPhone"
                          label=""
                          placeholder="اكتب رقم الجوال"
                          value={regPhone}
                          onChange={(e) => { setRegPhone(e.target.value.replace(/\D/g, '')); if (regErrors.phone) setRegErrors(prev => ({ ...prev, phone: '' })); }}
                          className={`p-3 text-left bg-gray-50 border rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-xs text-gray-900 ${
                            regErrors.phone ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {regErrors.phone && <p className="text-red-500 text-[10px] font-bold px-1">{regErrors.phone}</p>}
                      </div>

                      {/* Password & Confirm Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-right text-xs font-black text-gray-700">كلمة المرور <span className="text-red-500">*</span></label>
                          <div className="relative group">
                            <input
                              type={showAuthPassword ? 'text' : 'password'}
                              name="regPassword"
                              value={regPassword}
                              onChange={(e) => { setRegPassword(e.target.value); if (regErrors.password) setRegErrors(prev => ({ ...prev, password: '' })); }}
                              placeholder="••••••••"
                              className={`w-full p-3 pr-10 text-right bg-gray-50 border rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-xs text-gray-900 ${
                                regErrors.password ? 'border-red-500' : 'border-gray-200'
                              }`}
                            />
                            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={16} />
                            <button
                              type="button"
                              onClick={() => setShowAuthPassword(!showAuthPassword)}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1"
                            >
                              {showAuthPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          </div>
                          {regErrors.password && <p className="text-red-500 text-[10px] font-bold px-1">{regErrors.password}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-right text-xs font-black text-gray-700">تأكيد كلمة المرور <span className="text-red-500">*</span></label>
                          <div className="relative group">
                            <input
                              type={showAuthPassword ? 'text' : 'password'}
                              name="regConfirmPassword"
                              value={regConfirmPassword}
                              onChange={(e) => { setRegConfirmPassword(e.target.value); if (regErrors.confirmPassword) setRegErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                              placeholder="••••••••"
                              className={`w-full p-3 pr-10 text-right bg-gray-50 border rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-xs text-gray-900 ${
                                regErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                              }`}
                            />
                            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={16} />
                          </div>
                          {regErrors.confirmPassword && <p className="text-red-500 text-[10px] font-bold px-1">{regErrors.confirmPassword}</p>}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all disabled:opacity-50 cursor-pointer mt-2"
                      >
                        {authLoading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>جاري إنشاء الحساب...</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={18} />
                            <span>إنشاء الحساب ومتابعة الشراء</span>
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleStudentLoginSubmit} className="space-y-4">
                      {/* Login Identity */}
                      <div className="space-y-1">
                        <label className="block text-right text-xs font-black text-gray-700">البريد الإلكتروني أو رقم الجوال <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <input
                            type="text"
                            name="loginIdentity"
                            value={loginIdentity}
                            onChange={(e) => { setLoginIdentity(e.target.value); if (loginErrors.identity) setLoginErrors(prev => ({ ...prev, identity: '' })); }}
                            placeholder="example@mail.com أو 05xxxxxxx"
                            className={`w-full p-3 pr-10 text-right bg-gray-50 border rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-xs text-gray-900 ${
                              loginErrors.identity ? 'border-red-500' : 'border-gray-200'
                            }`}
                          />
                          <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={16} />
                        </div>
                        {loginErrors.identity && <p className="text-red-500 text-[10px] font-bold px-1">{loginErrors.identity}</p>}
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <label className="block text-right text-xs font-black text-gray-700">كلمة المرور <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <input
                            type={showAuthPassword ? 'text' : 'password'}
                            name="loginPassword"
                            value={loginPassword}
                            onChange={(e) => { setLoginPassword(e.target.value); if (loginErrors.password) setLoginErrors(prev => ({ ...prev, password: '' })); }}
                            placeholder="••••••••"
                            className={`w-full p-3 pr-10 text-right bg-gray-50 border rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-xs text-gray-900 ${
                              loginErrors.password ? 'border-red-500' : 'border-gray-200'
                            }`}
                          />
                          <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={16} />
                          <button
                            type="button"
                            onClick={() => setShowAuthPassword(!showAuthPassword)}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1"
                          >
                            {showAuthPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {loginErrors.password && <p className="text-red-500 text-[10px] font-bold px-1">{loginErrors.password}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all disabled:opacity-50 cursor-pointer mt-2"
                      >
                        {authLoading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>جاري تسجيل الدخول...</span>
                          </>
                        ) : (
                          <>
                            <Lock size={18} />
                            <span>تسجيل الدخول ومتابعة الشراء</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              ) : purchaseSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">
                      {isFree ? 'تمت عملية الشراء بنجاح!' : 'تم تقديم طلب شراء الحقيبة بنجاح!'}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 max-w-sm mx-auto leading-relaxed">
                      {isFree
                        ? `مبروك! تم إضافة حقيبة "${bag.title}" إلى حسابك ويمكنك الآن الوصول لجميع محتوياتها وتنزيلها.`
                        : `تم إرسال إيصال التحويل بنجاح. طلبك حالياً قيد المراجعة والتدقيق من قبل الأكاديمية، ويمكنك متابعة حالة الطلب وتأكيد التفعيل من صفحة اشتراكات ومشتريات الحقائب.`}
                    </p>
                  </div>

                  {isFree && itemsList.length > 0 && (
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

                  <div className="space-y-2 pt-2">
                    {!isFree && (
                      <button
                        onClick={() => {
                          setShowBuyModal(false);
                          setPurchaseSuccess(false);
                          router.push('/student/bags');
                        }}
                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>متابعة حالة الطلب في حسابي</span>
                        <ArrowRight size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowBuyModal(false);
                        setPurchaseSuccess(false);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-sm transition-all cursor-pointer"
                    >
                      إغلاق المودال
                    </button>
                  </div>
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
                        {isFree ? 'مجاناً' : `${displayPrice} ${currencySymbol}`}
                      </span>
                    </div>
                  </div>

                  {!isFree && (
                    <>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-700 block">1. اختر طريقة الدفع المناسبة:</label>
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

                      {/* Receipt Upload Section */}
                      <div className="space-y-3 pt-2 border-t border-gray-100">
                        <label className="text-xs font-black text-gray-700 block">2. إرفاق إيصال التحويل / الدفع <span className="text-red-500">*</span>:</label>
                        <div
                          onClick={() => document.getElementById('bag-receipt-input')?.click()}
                          className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${receiptFile ? 'border-emerald-500 bg-emerald-50/40' : 'border-gray-200 hover:border-blue-400 bg-gray-50'
                            }`}
                        >
                          <input
                            id="bag-receipt-input"
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={handleFileChange}
                          />

                          {receiptPreview ? (
                            <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                              <img src={receiptPreview} alt="إيصال الدفع" className="w-full h-full object-cover rounded-xl" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                تغيير الصورة
                              </div>
                            </div>
                          ) : receiptFile ? (
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                              <FileText size={20} />
                              <span className="truncate max-w-[200px]">{receiptFile.name}</span>
                              <span className="text-gray-400 text-[10px]">({(receiptFile.size / 1024).toFixed(1)} KB)</span>
                            </div>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <FileText size={20} />
                              </div>
                              <span className="text-xs font-bold text-gray-700">اضغط لإرفاق صورة/ملف إيصال الدفع</span>
                              <span className="text-[10px] text-gray-400">يدعم JPG, PNG, PDF</span>
                            </>
                          )}
                        </div>
                      </div>
                    </>
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

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative text-right animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Share2 className="text-blue-600 w-5 h-5" />
                مشاركة الحقيبة التعليمية
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-slate-500 text-xs mb-6 text-right">اختر المنصة لمشاركة رابط الحقيبة مباشرة أو انسخ الرابط المباشر:</p>

            {/* Social Share Buttons Grid */}
            {(() => {
              const fullUrl = getBagShareUrl();
              const encodedUrl = encodeURIComponent(fullUrl);
              const encodedText = encodeURIComponent(bag?.title || 'حقيبة تعليمية');

              return (
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all text-xs font-bold border border-emerald-100"
                  >
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">W</span>
                    <span>واتساب</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition-all text-xs font-bold border border-sky-100"
                  >
                    <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm">T</span>
                    <span>تلجرام</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all text-xs font-bold border border-blue-100"
                  >
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">F</span>
                    <span>فيسبوك</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all text-xs font-bold border border-slate-200"
                  >
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">X</span>
                    <span>تويتر</span>
                  </a>
                </div>
              );
            })()}

            <div className="flex items-center gap-2 bg-[#f3f4f5] p-3 rounded-2xl border border-slate-100 mb-6">
              <button
                onClick={copyToClipboard}
                className="p-2 bg-white text-blue-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
                title="نسخ الرابط"
              >
                <Clipboard size={18} />
              </button>
              <input
                type="text"
                readOnly
                value={getBagShareUrl()}
                className="bg-transparent border-none focus:ring-0 text-xs text-left w-full outline-none font-mono text-slate-600 select-all"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && currentDisplayImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200" dir="rtl">
          {/* Header */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white border-b border-white/10 pb-4 z-10">
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-white">{bag.title}</h3>
              <p className="text-xs font-medium text-white/60">
                صورة {currentImageIndex + 1} من {allGalleryUrls.length}
              </p>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Image View with Navigation */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4 overflow-hidden">
            <img
              src={currentDisplayImage}
              alt={bag.title}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
            />

            {allGalleryUrls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg"
                  title="الصورة السابقة"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg"
                  title="الصورة التالية"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {allGalleryUrls.length > 1 && (
            <div className="w-full max-w-4xl flex items-center justify-center gap-3 overflow-x-auto py-2 scrollbar-thin">
              {allGalleryUrls.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${currentDisplayImage === imgUrl
                    ? 'border-blue-500 scale-110 shadow-lg ring-2 ring-blue-400/50'
                    : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                >
                  <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
