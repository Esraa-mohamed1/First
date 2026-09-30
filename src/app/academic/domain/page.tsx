'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Globe, Check, X, AlertCircle, ShieldCheck, RefreshCw, Edit2, Trash2, Lock, Sparkles, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import academyApi from '@/lib/academy-api';
import Swal from 'sweetalert2';
import { getMyPackage } from '@/services/auth';

interface CustomDomain {
  domain: string;
  status: 'active' | 'pending' | 'failed' | 'unverified';
}

export default function CustomDomainPage() {
  const router = useRouter();
  const [customDomain, setCustomDomain] = useState<CustomDomain | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Package feature check state
  const [canChangeDomain, setCanChangeDomain] = useState<boolean>(true);
  const [packageLoading, setPackageLoading] = useState<boolean>(true);
  const [packageName, setPackageName] = useState<string>('');

  const getTenantKey = (rawStr: string): string => {
    if (!rawStr) return '';
    let clean = rawStr.trim().toLowerCase();
    clean = clean.replace(/^https?:\/\//, '');
    clean = clean.split('/')[0];
    clean = clean.split(':')[0];
    if (clean.includes('.')) {
      return clean.split('.')[0];
    }
    return clean;
  };

  useEffect(() => {
    const initPage = async () => {
      try {
        // 1. Read domain name from window location
        if (typeof window !== 'undefined') {
          let hostname = window.location.hostname;

          if (hostname === 'localhost') {
            const storedTenant = localStorage.getItem('academy_link_name');
            if (storedTenant) hostname = `${storedTenant}.darab.academy`;
          }

          setCustomDomain({
            domain: hostname,
            status: 'active',
          });
          setEditValue(getTenantKey(hostname));
        }

        // 2. Check Package Features to see if changing domain is available
        const pkgRes = await getMyPackage();
        const rawPkg = pkgRes?.data || pkgRes;

        if (rawPkg) {
          const pkgInfo = rawPkg.package_info || rawPkg;
          setPackageName(pkgInfo.name || pkgInfo.title || '');

          let domainFeatureEnabled = true;

          // Check features array if present
          const features = rawPkg.features;
          if (Array.isArray(features)) {
            const domainFeature = features.find(
              (f: any) =>
                f.key_feature === 'custom_domain' ||
                f.key_feature === 'custom_subdomains' ||
                f.slug === 'custom_domain' ||
                f.slug === 'custom_subdomains' ||
                (typeof f.name === 'string' && f.name.includes('دومين')) ||
                (typeof f.label === 'string' && f.label.includes('دومين'))
            );

            if (domainFeature) {
              const val = domainFeature.value;
              domainFeatureEnabled =
                val !== '0' &&
                val !== 0 &&
                val !== 'false' &&
                val !== false &&
                val !== null &&
                val !== undefined &&
                Boolean(val);
            }
          }

          // Check custom_domains limit property if present
          if (pkgInfo.custom_domains !== undefined && pkgInfo.custom_domains !== null) {
            const domainCount = Number(pkgInfo.custom_domains);
            if (!isNaN(domainCount) && domainCount <= 0) {
              domainFeatureEnabled = false;
            }
          }

          setCanChangeDomain(domainFeatureEnabled);
        }
      } catch (err) {
        console.warn('Package features check failed:', err);
      } finally {
        setIsLoading(false);
        setPackageLoading(false);
      }
    };

    initPage();
  }, []);

  const handleStartEdit = () => {
    if (!canChangeDomain) {
      Swal.fire({
        title: 'الميزة غير متوفرة في باقتك',
        text: 'تغيير وتخصيص النطاق غير متاح في خطتك الحالية. يرجى ترقية باقتك للتمكن من ربط وتعديل الدومين.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ترقية الباقة الآن',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#2563eb',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl font-bold px-8 py-3',
          cancelButton: 'rounded-xl font-bold px-8 py-3',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/academic/packages/upgrade');
        }
      });
      return;
    }

    setIsEditing(true);
    setEditValue(getTenantKey(customDomain?.domain || editValue));
  };

  const handleUpdate = async () => {
    const tenantKey = getTenantKey(editValue);
    if (!tenantKey) {
      toast.error('يرجى إدخال اسم النطاق المطلوب');
      return;
    }

    // Double check feature permission before submitting
    if (!canChangeDomain) {
      toast.error('ميزة تغيير النطاق غير متاحة في باقتك الحالية');
      return;
    }

    const result = await Swal.fire({
      title: 'تأكيد تغيير النطاق',
      text: `هل أنت متأكد من رغبتك في تغيير النطاق إلى "${tenantKey}"؟ قد يستغرق تطبيق التغيير بضع دقائق.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، تغيير النطاق',
      cancelButtonText: 'إلغاء',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold px-8 py-3',
        cancelButton: 'rounded-xl font-bold px-8 py-3',
      },
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // User requested: change the domain with endpoint custom-domain
      let response;
      try {
        response = await academyApi.put('custom-domain', {
          domain: tenantKey,
          subdomain: tenantKey,
          tenant_key: tenantKey,
        });
      } catch (primaryErr: any) {
        if (primaryErr.response?.status === 404) {
          // Fallback in case route is custome-domain or custom-subdomain
          try {
            response = await academyApi.put('custome-domain', {
              domain: tenantKey,
              subdomain: tenantKey,
              tenant_key: tenantKey,
            });
          } catch {
            response = await academyApi.put('custom-subdomain', {
              domain: tenantKey,
              subdomain: tenantKey,
              tenant_key: tenantKey,
            });
          }
        } else {
          throw primaryErr;
        }
      }

      const isSuccess = response.data?.success || response.status === 200;

      if (isSuccess) {
        // User requested: show alert you can continue as the changing will take some minutes
        await Swal.fire({
          title: 'تم إرسال طلب التغيير بنجاح',
          text: 'يمكنك المتابعة في استخدام المنصة، حيث أن عملية تفعيل وتطبيق النطاق الجديد قد تستغرق بضع دقائق حتى يكتمل انتشار DNS.',
          icon: 'success',
          confirmButtonText: 'حسناً، متابعة',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'rounded-[2rem]',
            confirmButton: 'rounded-xl font-bold px-8 py-3',
          },
        });

        // Store new tenant key locally
        if (typeof window !== 'undefined') {
          localStorage.setItem('academy_link_name', tenantKey);
        }

        setCustomDomain({ domain: tenantKey, status: 'pending' });
        setIsEditing(false);
      } else {
        if (response.data?.errors) {
          setErrors(response.data.errors);
        }
        toast.error(response.data?.message || 'فشل في تحديث النطاق');
      }
    } catch (error: any) {
      console.error('Error updating custom domain:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء معالجة طلبك');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    const result = await Swal.fire({
      title: 'حذف النطاق المخصص',
      text: 'هل أنت متأكد من حذف النطاق المخصص؟ سيتم العودة إلى النطاق الافتراضي.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، حذف',
      cancelButtonText: 'إلغاء',
      customClass: {
        popup: 'rounded-[2rem]',
      },
    });

    if (!result.isConfirmed) return;

    try {
      setIsSubmitting(true);
      let response;
      try {
        response = await academyApi.delete('custom-domain');
      } catch (err: any) {
        if (err.response?.status === 404) {
          response = await academyApi.delete('subdomain');
        } else {
          throw err;
        }
      }

      if (response.data?.success || response.status === 200) {
        toast.success('تم حذف النطاق المخصص بنجاح');
        setCustomDomain(null);
        if (typeof window !== 'undefined') {
          setEditValue(getTenantKey(window.location.hostname));
        }
      }
    } catch (error: any) {
      console.error('Failed to remove custom domain:', error);
      toast.error('فشل في حذف النطاق المخصص');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" dir="rtl">
        <Loader2 size={40} className="text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold italic">جاري تحميل إعدادات الدومين والتحقق من الباقة...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 text-right space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">إدارة الدومين والنطاق</h2>
          <p className="text-gray-400 font-bold mt-2">
            يمكنك تخصيص وتعديل النطاق الخاص بأكاديميتك لتعزيز هويتك الاحترافية
          </p>
        </div>
      </div>

      {/* Package feature restricted banner */}
      {!canChangeDomain && !packageLoading && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Lock size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-amber-900 text-base">ميزة النطاق المخصص غير مفعلة في باقتك</h4>
                {packageName && (
                  <span className="text-[11px] font-black bg-amber-200/70 text-amber-800 px-2.5 py-0.5 rounded-full">
                    باقتك: {packageName}
                  </span>
                )}
              </div>
              <p className="text-amber-700 text-xs font-bold mt-1 leading-relaxed">
                باقتك الحالية لا تتيح تخصيص الدومين والنطاق الفرعي. يرجى ترقية باقتك للتمكن من ربط وتعديل نطاق أكاديميتك بسهولة.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/academic/packages/upgrade')}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-amber-300/40 hover:scale-105 cursor-pointer"
          >
            <Sparkles size={16} />
            <span>ترقية الباقة الآن</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Main Configuration Card */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
                <Globe size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">النطاق الحالي</h3>
                <p className="text-gray-400 font-bold text-sm">نظرة عامة على حالة نطاق الأكاديمية</p>
              </div>
            </div>
            {customDomain && (
              <div
                className={`px-6 py-2.5 rounded-2xl text-xs font-black shadow-sm ${
                  customDomain.status === 'active'
                    ? 'bg-green-50 text-green-600'
                    : customDomain.status === 'pending'
                    ? 'bg-orange-50 text-orange-600 animate-pulse'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {customDomain.status === 'active'
                  ? 'نشط'
                  : customDomain.status === 'pending'
                  ? 'جاري التحقق...'
                  : 'فشل التحقق'}
              </div>
            )}
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            {isEditing ? (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="space-y-3">
                  <label className="text-lg font-black text-gray-800">
                    تعديل النطاق المخصص / الفرعي (Custom Domain)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(getTenantKey(e.target.value))}
                      placeholder="academy-name"
                      className={`w-full p-5 bg-gray-50 border ${
                        errors.subdomain || errors.domain ? 'border-red-300' : 'border-gray-100'
                      } rounded-[2rem] outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-left font-bold text-lg text-gray-900`}
                      dir="ltr"
                      autoFocus
                    />
                    {(errors.subdomain || errors.domain) && (
                      <p className="text-red-500 text-sm font-bold mt-2 pr-4 flex items-center gap-2">
                        <AlertCircle size={16} />
                        {errors.subdomain?.[0] || errors.domain?.[0]}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-semibold pr-2">
                    ملاحظة: بعد الحفظ يمكنك المتابعة في استخدام المنصة بينما يستغرق تطبيق النطاق بضع دقائق.
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={handleUpdate}
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Check size={24} strokeWidth={3} />
                    )}
                    <span>تحديث النطاق وحفظ التغييرات</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setErrors({});
                      setEditValue(getTenantKey(customDomain?.domain || ''));
                    }}
                    disabled={isSubmitting}
                    className="px-10 py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black text-lg hover:bg-gray-200 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center text-blue-600">
                    <Globe size={28} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-gray-900" dir="ltr">
                      {customDomain?.domain || editValue}
                    </h4>
                    <p className="text-gray-400 font-bold text-sm mt-1">
                      {customDomain?.status === 'active'
                        ? 'النطاق الموصول حالياً'
                        : 'النطاق قيد المراجعة أو افتراضي'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStartEdit}
                    className={`p-4 rounded-2xl border shadow-sm transition-all cursor-pointer ${
                      canChangeDomain
                        ? 'bg-white text-gray-500 hover:text-blue-600 border-gray-100 hover:border-blue-200'
                        : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                    }`}
                    title={canChangeDomain ? 'تعديل النطاق' : 'الميزة تتطلب ترقية الباقة'}
                  >
                    {canChangeDomain ? <Edit2 size={22} /> : <Lock size={22} />}
                  </button>

                  {customDomain && (
                    <button
                      onClick={handleRemove}
                      disabled={isSubmitting || !canChangeDomain}
                      className="p-4 bg-white text-gray-400 hover:text-red-600 rounded-2xl border border-gray-100 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                      title="حذف النطاق المخصص"
                    >
                      <Trash2 size={22} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DNS Info card */}
        <div className="bg-blue-50/30 border border-blue-100 rounded-[2.5rem] p-10 space-y-6">
          <div className="flex items-center gap-4 text-blue-600">
            <ShieldCheck size={28} />
            <h4 className="text-xl font-black">تعليمات الربط وتوجيه DNS</h4>
          </div>
          <p className="text-gray-600 font-bold leading-relaxed">
            لربط دومين مخصص كامل خاص بأكاديميتك، يرجى التأكد من إضافة السجل التالي في لوحة تحكم مزود النطاق الخاص بك (مثل Cloudflare أو GoDaddy أو Namecheap):
          </p>
          <div
            className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 text-left font-mono text-sm"
            dir="ltr"
          >
            <div className="flex-1">
              <span className="text-xs text-gray-400 block mb-1">TYPE</span>
              <span className="font-black text-blue-600">CNAME</span>
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-400 block mb-1">HOST</span>
              <span className="font-black text-gray-800">@</span>
            </div>
            <div className="flex-[2]">
              <span className="text-xs text-gray-400 block mb-1">VALUE</span>
              <span className="font-black text-gray-800">domains.darab.academy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}