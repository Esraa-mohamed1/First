'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Globe,
  Check,
  AlertCircle,
  ShieldCheck,
  Trash2,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronLeft,
  RefreshCw,
  Clock,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import academyApi from '@/lib/academy-api';
import Swal from 'sweetalert2';
import { getMyPackage, getProfileStatus } from '@/services/auth';

interface CustomDomainInfo {
  domain: string;
  isCustomDomain: boolean;
  subdomain: string;
  status: 'active' | 'pending' | 'failed' | 'unverified';
}

export default function CustomDomainPage() {
  const router = useRouter();
  const [domainInfo, setDomainInfo] = useState<CustomDomainInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mode: 'subdomain' or 'custom_domain'
  const [editMode, setEditMode] = useState<'subdomain' | 'custom_domain'>('subdomain');

  // Input values
  const [subdomainInput, setSubdomainInput] = useState('');
  const [customDomainInput, setCustomDomainInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [statusError, setStatusError] = useState<string | null>(null);

  // Countdown timer in seconds (90s = 1.5 mins)
  const [countdown, setCountdown] = useState<number | null>(null);

  // Package features
  const [hasCustomDomainFeature, setHasCustomDomainFeature] = useState<boolean>(false);
  const [hasSubdomainFeature, setHasSubdomainFeature] = useState<boolean>(true);
  const [packageName, setPackageName] = useState<string>('');

  // Status check timer ref
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Robust helper to extract real tenant and domain
  const extractDomainAndTenant = (): { domain: string; isCustom: boolean; subdomain: string } => {
    let hostname = '';
    if (typeof window !== 'undefined') {
      hostname = window.location.hostname || '';
    }

    const storedLinkName = typeof window !== 'undefined' ? localStorage.getItem('academy_link_name') : null;
    
    let userEmailTenant = '';
    try {
      const rawUser = typeof window !== 'undefined' ? localStorage.getItem('user_info') : null;
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser);
        if (parsedUser.academy_link_name) userEmailTenant = parsedUser.academy_link_name;
        else if (parsedUser.subdomain) userEmailTenant = parsedUser.subdomain;
        else if (parsedUser.email) userEmailTenant = parsedUser.email.split('@')[0];
      }
    } catch {}

    // Clean localhost suffix (e.g. tog.darab.academy.localhost -> tog.darab.academy)
    let cleanHost = hostname.toLowerCase().trim();
    if (cleanHost.endsWith('.localhost')) {
      cleanHost = cleanHost.replace(/\.localhost$/, '').trim();
    }

    let isCustom = false;
    let tenant = '';

    if (cleanHost === 'localhost' || cleanHost === '') {
      tenant = storedLinkName || userEmailTenant || 'academy';
      cleanHost = `${tenant}.darab.academy`;
    } else if (cleanHost.endsWith('darab.academy')) {
      tenant = cleanHost.replace('.darab.academy', '');
      if (tenant.includes('.')) {
        tenant = tenant.split('.')[0];
      }
    } else {
      isCustom = true;
      tenant = storedLinkName || userEmailTenant || cleanHost.split('.')[0];
    }

    return {
      domain: cleanHost.toLowerCase(),
      isCustom,
      subdomain: (tenant || storedLinkName || 'academy').toLowerCase(),
    };
  };

  const cleanTenantString = (raw: string): string => {
    if (!raw) return '';
    let clean = raw.trim().toLowerCase();
    clean = clean.replace(/^https?:\/\//, '');
    clean = clean.split('/')[0];
    clean = clean.split(':')[0];
    if (clean.endsWith('.localhost')) {
      clean = clean.replace('.localhost', '');
    }
    if (clean.includes('.darab.academy')) {
      clean = clean.replace('.darab.academy', '');
    }
    if (clean.includes('.')) {
      clean = clean.split('.')[0];
    }
    return clean.toLowerCase();
  };

  // Check custom domain status endpoint with GET and show response in alert
  const checkCustomDomainStatus = async (domainToCheck?: string, tenantName?: string, showToast = true, showAlert = true) => {
    const targetDomain = (domainToCheck || domainInfo?.domain || customDomainInput || '').trim().toLowerCase();
    if (!targetDomain) return;

    try {
      setIsCheckingStatus(true);
      const tenantKey = (tenantName || domainInfo?.subdomain || (typeof window !== 'undefined' ? localStorage.getItem('academy_link_name') : '') || '').trim().toLowerCase();
      
      const headers: Record<string, string> = {};
      if (tenantKey) {
        headers['X-Tenant-Key'] = tenantKey.includes('.') ? tenantKey : `${tenantKey}.darab.academy`;
        headers['X-Tenant'] = tenantKey.includes('.') ? tenantKey : `${tenantKey}.darab.academy`;
        headers['x-tenant-name'] = tenantKey.includes('.') ? tenantKey : `${tenantKey}.darab.academy`;
      }

      const response = await academyApi.get('custom-domain/status', {
        params: {
          domain: targetDomain,
          tenant_name: tenantKey,
        },
        headers,
      });

      const resData = response.data?.data || response.data;
      const currentStatus = String(resData?.status || resData?.domain_status || resData?.ssl_status || '').toLowerCase();
      const rawMessage = resData?.message || response.data?.message || '';
      const errorMsg = resData?.error || resData?.message || '';

      if (currentStatus === 'active' || currentStatus === 'verified' || currentStatus === 'success') {
        setDomainInfo((prev) => (prev ? { ...prev, domain: targetDomain, isCustomDomain: true, status: 'active' } : null));
        setStatusError(null);
        setCountdown(null);
        if (showToast) {
          toast.success(`تم التحقق من النطاق المخصص (${targetDomain}) وتفعيله بنجاح!`);
        }

        if (showAlert) {
          await Swal.fire({
            title: 'تم تفعيل النطاق بنجاح',
            html: `
              <div class="space-y-3 text-right font-sans">
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <span class="text-xs font-bold text-gray-500">حالة النطاق:</span>
                  <span class="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-black">نشط (Active)</span>
                </div>
                <p class="text-gray-700 text-sm font-bold leading-relaxed">
                  النطاق المخصص <span class="text-blue-600 font-mono font-black" dir="ltr">${targetDomain}</span> تم التحقق من سجلات الـ DNS الخاصة به وربطه بالأكاديمية بنجاح.
                </p>
                ${rawMessage ? `<p class="text-xs text-gray-500 font-medium">${rawMessage}</p>` : ''}
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'ممتاز، حسناً',
            confirmButtonColor: '#16a34a',
            customClass: {
              popup: 'rounded-[2rem]',
              confirmButton: 'rounded-xl font-bold px-8 py-3',
            },
          });
        }
      } else if (currentStatus === 'failed' || currentStatus === 'error') {
        const fullError = errorMsg || `لم يتم العثور على سجلات DNS صحيحة للنطاق (${targetDomain}). يرجى التأكد من إضافة سجل CNAME مشيراً إلى domains.darab.academy.`;
        setDomainInfo((prev) => (prev ? { ...prev, status: 'failed' } : null));
        setStatusError(fullError);
        if (showToast) {
          toast.error(`فشل التحقق من النطاق (${targetDomain}). يرجى فحص سجلات الـ DNS.`);
        }

        if (showAlert) {
          await Swal.fire({
            title: 'فشل التحقق من سجلات النطاق',
            html: `
              <div class="space-y-3 text-right font-sans">
                <div class="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <span class="text-xs font-bold text-gray-500">حالة النطاق:</span>
                  <span class="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-black">فشل (Failed)</span>
                </div>
                <p class="text-red-700 text-xs font-bold leading-relaxed">
                  ${fullError}
                </p>
                <div class="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 text-right leading-relaxed font-semibold">
                  تأكد من إعداد سجل <span class="font-bold font-mono">CNAME</span> بحيث يشير إلى <span class="font-bold font-mono text-blue-600">domains.darab.academy</span> في لوحة تحكم مزود النطاق.
                </div>
              </div>
            `,
            icon: 'error',
            confirmButtonText: 'إغلاق',
            confirmButtonColor: '#dc2626',
            customClass: {
              popup: 'rounded-[2rem]',
              confirmButton: 'rounded-xl font-bold px-8 py-3',
            },
          });
        }
      } else {
        // Still pending
        setDomainInfo((prev) => (prev ? { ...prev, status: 'pending' } : null));
        setStatusError(null);
        if (showToast) {
          toast('النطاق لا يزال قيد التحقق والانتشار، يرجى الانتظار قليلاً.', { icon: '⏳' });
        }

        if (showAlert) {
          await Swal.fire({
            title: 'حالة النطاق: قيد الانتظار والمعالجة',
            html: `
              <div class="space-y-3 text-right font-sans">
                <div class="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <span class="text-xs font-bold text-gray-500">حالة النطاق:</span>
                  <span class="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-black">قيد المعالجة (Pending)</span>
                </div>
                <p class="text-gray-700 text-sm font-bold leading-relaxed">
                  النطاق <span class="text-blue-600 font-mono font-black" dir="ltr">${targetDomain}</span> لا يزال قيد انتشار الـ DNS أو إصدار شهادة الأمان.
                </p>
                <p class="text-xs text-gray-500 font-medium">
                  قد يستغرق انتشار سجلات DNS وقتاً إضافياً حسب مزود النطاق. يمكنك إعادة فحص الحالة في أي وقت.
                </p>
              </div>
            `,
            icon: 'info',
            confirmButtonText: 'متابعة الانتظار',
            confirmButtonColor: '#f97316',
            customClass: {
              popup: 'rounded-[2rem]',
              confirmButton: 'rounded-xl font-bold px-8 py-3',
            },
          });
        }
      }
    } catch (err: any) {
      console.warn('Error fetching custom domain status:', err);
      const serverErrMsg = err.response?.data?.message || err.message || 'تعذر الاتصال بخادم التحقق من النطاق';
      if (showAlert) {
        await Swal.fire({
          title: 'تنبيه فحص الحالة',
          text: `تعذر جلب حالة النطاق حالياً: ${serverErrMsg}`,
          icon: 'warning',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#6b7280',
          customClass: {
            popup: 'rounded-[2rem]',
            confirmButton: 'rounded-xl font-bold px-8 py-3',
          },
        });
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      try {
        const extracted = extractDomainAndTenant();

        // Also fetch profile to get actual user link name if available
        let profileTenant = '';
        try {
          const profile = await getProfileStatus();
          const pData = profile?.data || profile;
          if (pData?.academy_link_name) profileTenant = String(pData.academy_link_name).trim().toLowerCase();
          else if (pData?.subdomain) profileTenant = String(pData.subdomain).trim().toLowerCase();
          else if (pData?.email && !extracted.subdomain) profileTenant = String(pData.email).split('@')[0].trim().toLowerCase();
        } catch {}

        const finalSubdomain = (extracted.subdomain || profileTenant || 'academy').toLowerCase();
        const finalDomain = extracted.isCustom ? extracted.domain : `${finalSubdomain}.darab.academy`;

        if (typeof window !== 'undefined' && finalSubdomain) {
          localStorage.setItem('academy_link_name', finalSubdomain);
        }

        setDomainInfo({
          domain: finalDomain.toLowerCase(),
          isCustomDomain: extracted.isCustom,
          subdomain: finalSubdomain,
          status: 'active',
        });

        setSubdomainInput(finalSubdomain);
        setCustomDomainInput(extracted.isCustom ? finalDomain : '');
        setEditMode(extracted.isCustom ? 'custom_domain' : 'subdomain');

        // Check package features from /my-package
        const pkgRes = await getMyPackage();
        const rawPkg = pkgRes?.data || pkgRes;

        if (rawPkg) {
          const pkgInfo = rawPkg.package_info || rawPkg;
          setPackageName(pkgInfo.name || pkgInfo.title || pkgInfo.package_name || '');

          const features = rawPkg.features;
          if (Array.isArray(features)) {
            // Check custom_domain
            const domainFeat = features.find(
              (f: any) =>
                f.key_feature === 'custom_domain' ||
                f.slug === 'custom_domain' ||
                (typeof f.name === 'string' && f.name.includes('دومين مخصص')) ||
                (typeof f.label === 'string' && f.label.includes('دومين مخصص'))
            );

            if (domainFeat) {
              const val = domainFeat.value;
              const isEnabled =
                val !== '0' &&
                val !== 0 &&
                val !== 'false' &&
                val !== false &&
                val !== null &&
                val !== undefined &&
                Boolean(val);
              setHasCustomDomainFeature(isEnabled);
            } else if (pkgInfo.custom_domains !== undefined && pkgInfo.custom_domains !== null) {
              const count = Number(pkgInfo.custom_domains);
              setHasCustomDomainFeature(!isNaN(count) && count > 0);
            } else {
              setHasCustomDomainFeature(false);
            }

            // Check custom_subdomains
            const subFeat = features.find(
              (f: any) =>
                f.key_feature === 'custom_subdomains' ||
                f.slug === 'custom_subdomains' ||
                (typeof f.name === 'string' && f.name.includes('صب')) ||
                (typeof f.label === 'string' && f.label.includes('الفرعي'))
            );

            if (subFeat) {
              const val = subFeat.value;
              const isEnabled =
                val !== '0' &&
                val !== 0 &&
                val !== 'false' &&
                val !== false &&
                val !== null &&
                val !== undefined &&
                Boolean(val);
              setHasSubdomainFeature(isEnabled);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load domain / package info:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initPage();

    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // Submit Domain update using PUT for subdomain and POST for custom domain
  const handleSubmit = async () => {
    let targetDomain = '';
    let cleanSub = '';
    setStatusError(null);

    if (editMode === 'subdomain') {
      cleanSub = cleanTenantString(subdomainInput);
      if (!cleanSub) {
        toast.error('يرجى إدخال اسم النطاق الفرعي المطلوب');
        return;
      }
      targetDomain = `${cleanSub}.darab.academy`.toLowerCase();
    } else {
      // Custom domain mode
      let cleanCust = customDomainInput.trim().toLowerCase();
      cleanCust = cleanCust.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

      if (!cleanCust || cleanCust.length < 3 || !cleanCust.includes('.')) {
        toast.error('يرجى إدخال دومين مخصص صحيح (مثال: myacademy.com)');
        return;
      }
      targetDomain = cleanCust.toLowerCase();
    }

    const confirm = await Swal.fire({
      title: 'تأكيد تحديث النطاق',
      text: `هل أنت متأكد من تغيير النطاق إلى "${targetDomain}"؟ قد يستغرق تطبيق التغيير بضع دقائق.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، تحديث النطاق',
      cancelButtonText: 'إلغاء',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold px-8 py-3',
        cancelButton: 'rounded-xl font-bold px-8 py-3',
      },
    });

    if (!confirm.isConfirmed) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload: any = { domain: targetDomain };
      if (cleanSub) {
        payload.subdomain = cleanSub;
      }

      let response;
      if (editMode === 'subdomain') {
        // Subdomain: HTTP PUT method
        try {
          response = await academyApi.put('custom-subdomain', payload);
        } catch (subErr: any) {
          if (subErr.response?.status === 404 || subErr.response?.status === 405) {
            response = await academyApi.put('custom-domain', payload);
          } else {
            throw subErr;
          }
        }
      } else {
        // Custom Domain: HTTP POST method
        response = await academyApi.post('custom-domain', payload);
      }

      const resData = response.data;
      // Accept 200, 201, and 202 Accepted
      const isSuccess =
        response.status >= 200 &&
        response.status < 300 &&
        resData?.success !== false;

      if (isSuccess) {
        if (editMode === 'subdomain') {
          // Cleanly clear any existing status checks/timers for custom domain
          if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          setCountdown(null);
          setStatusError(null);

          if (typeof window !== 'undefined' && cleanSub) {
            localStorage.setItem('academy_link_name', cleanSub);
          }

          setDomainInfo({
            domain: targetDomain,
            subdomain: cleanSub,
            isCustomDomain: false,
            status: 'active',
          });

          await Swal.fire({
            title: 'تم تحديث النطاق الفرعي بنجاح',
            html: `
              <div class="space-y-3 text-right font-sans">
                <p class="text-gray-600 font-bold text-sm leading-relaxed">
                  تم حفظ وتحديث النطاق الفرعي لأكاديميتك بنجاح إلى:
                  <span class="text-blue-600 font-mono font-black block mt-2" dir="ltr">${targetDomain}</span>
                </p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'rounded-[2rem]',
              confirmButton: 'rounded-xl font-bold px-8 py-3',
            },
          });

          toast.success('تم تحديث النطاق الفرعي بنجاح!');
        } else {
          // Custom domain: Start setup flow with 90s countdown and status check
          const pendingDomain = (resData?.data?.pending_domain || targetDomain).toLowerCase();
          const status = resData?.data?.status || 'pending';
          const currentTenantName = cleanSub || domainInfo?.subdomain || (typeof window !== 'undefined' ? localStorage.getItem('academy_link_name') : '') || '';

          // SweetAlert Arabic message
          await Swal.fire({
            title: 'تم بدء إعداد النطاق بنجاح',
            html: `
              <div class="space-y-3 text-right font-sans">
                <p class="text-gray-600 font-bold text-sm leading-relaxed">
                  بدأت عملية إعداد وربط النطاق <span class="text-blue-600 font-mono font-black" dir="ltr">${pendingDomain}</span> بنجاح.
                </p>
                <div class="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-800 font-semibold leading-relaxed">
                  النطاق قيد المعالجة والتحقق حالياً، يمكنك المتابعة في استخدام المنصة بشكل طبيعي بينما يكتمل انتشار DNS وتفعيل الحماية.
                </div>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'حسناً، متابعة',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'rounded-[2rem]',
              confirmButton: 'rounded-xl font-bold px-8 py-3',
            },
          });

          setDomainInfo({
            domain: pendingDomain,
            subdomain: currentTenantName || cleanTenantString(pendingDomain),
            isCustomDomain: true,
            status: status as any,
          });

          // ONLY for Custom Domain: start 90s countdown and schedule status check
          if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

          setCountdown(90);

          countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev === null || prev <= 1) {
                if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                return null;
              }
              return prev - 1;
            });
          }, 1000);

          statusTimerRef.current = setTimeout(() => {
            checkCustomDomainStatus(pendingDomain, currentTenantName, true);
          }, 90000); // 90 seconds (1.5 mins)
        }
      } else {
        if (resData?.errors) setErrors(resData.errors);
        toast.error(resData?.message || 'فشل في تحديث النطاق');
      }
    } catch (err: any) {
      console.error('Domain update error:', err);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء تحديث النطاق');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetToSubdomain = async () => {
    const confirm = await Swal.fire({
      title: 'العودة للنطاق الفرعي الافتراضي',
      text: 'هل أنت متأكد من إلغاء الدومين المخصص والعودة إلى النطاق الفرعي (.darab.academy)؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، العودة للنطاق الفرعي',
      cancelButtonText: 'إلغاء',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold px-8 py-3',
        cancelButton: 'rounded-xl font-bold px-8 py-3',
      },
    });

    if (!confirm.isConfirmed) return;

    try {
      setIsSubmitting(true);
      const defaultTenant = domainInfo?.subdomain || 'academy';
      const defaultDomain = `${defaultTenant}.darab.academy`.toLowerCase();

      // Subdomain reset uses HTTP PUT
      let response;
      try {
        response = await academyApi.put('custom-subdomain', {
          domain: defaultDomain,
          subdomain: defaultTenant,
        });
      } catch (subErr: any) {
        if (subErr.response?.status === 404 || subErr.response?.status === 405) {
          response = await academyApi.put('custom-domain', {
            domain: defaultDomain,
            subdomain: defaultTenant,
          });
        } else {
          throw subErr;
        }
      }

      if (response.data?.success !== false) {
        if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        
        toast.success('تمت العودة إلى النطاق الفرعي بنجاح');
        setDomainInfo({
          domain: defaultDomain,
          subdomain: defaultTenant,
          isCustomDomain: false,
          status: 'active',
        });
        setSubdomainInput(defaultTenant);
        setEditMode('subdomain');
        setCountdown(null);
        setStatusError(null);
      }
    } catch (err) {
      console.error('Failed to reset domain:', err);
      toast.error('حدث خطأ أثناء استعادة النطاق الفرعي');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" dir="rtl">
        <Loader2 size={40} className="text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold italic">جاري تحميل إعدادات النطاق والتحقق من الباقة...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 text-right space-y-8 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">إدارة الدومين والنطاق</h2>
          <p className="text-gray-400 font-bold mt-2">
            يمكنك تخصيص وتعديل النطاق الخاص بأكاديميتك لتعزيز هويتك الاحترافية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Card 1: Current Domain Status Bar */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
              <Globe size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-gray-900">النطاق الحالي</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black ${
                    domainInfo?.isCustomDomain
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {domainInfo?.isCustomDomain ? 'دومين مخصص (Custom Domain)' : 'نطاق فرعي (Subdomain)'}
                </span>
              </div>
              <p className="font-mono font-bold text-gray-700 text-base mt-1" dir="ltr">
                {domainInfo?.domain}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end md:self-center flex-wrap">
            {domainInfo && (
              <span
                className={`px-5 py-2 rounded-2xl text-xs font-black shadow-sm flex items-center gap-1.5 ${
                  domainInfo.status === 'active'
                    ? 'bg-green-50 text-green-600'
                    : domainInfo.status === 'pending'
                    ? 'bg-orange-50 text-orange-600 animate-pulse'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {domainInfo.status === 'pending' && <Loader2 size={13} className="animate-spin" />}
                {domainInfo.status === 'active'
                  ? 'نشط ومفعل'
                  : domainInfo.status === 'pending'
                  ? 'قيد التحقق...'
                  : 'فشل التحقق'}
              </span>
            )}

            {/* If domain is custom domain, show manual check button */}
            {domainInfo?.isCustomDomain && (
              <button
                type="button"
                onClick={() => checkCustomDomainStatus(domainInfo.domain, domainInfo.subdomain, true)}
                disabled={isCheckingStatus}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-200 cursor-pointer disabled:opacity-50 shadow-sm"
                title="فحص حالة النطاق الآن"
              >
                <RefreshCw size={14} className={isCheckingStatus ? 'animate-spin' : ''} />
                <span>فحص الحالة</span>
              </button>
            )}

            <a
              href={`https://${domainInfo?.domain}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-2 border border-gray-200 transition-all shadow-sm"
            >
              <span>زيارة الموقع</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>

        {/* Status Error Banner if failed */}
        {statusError && (
          <div className="bg-red-50/90 border-2 border-red-200 rounded-[2rem] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h5 className="font-black text-red-900 text-sm">فشل التحقق من سجلات النطاق (DNS Status Failed)</h5>
                <p className="text-red-700 text-xs font-bold leading-relaxed" dir="ltr">
                  {statusError}
                </p>
                <p className="text-red-600 text-xs font-semibold pt-1">
                  يرجى التأكد من إضافة سجل <span className="font-bold font-mono">CNAME</span> في مزود النطاق الخاص بك وتوجيهه إلى <span className="font-bold font-mono">domains.darab.academy</span> ثم الضغط على فحص الحالة مرة أخرى.
                </p>
              </div>
            </div>

            <button
              onClick={() => checkCustomDomainStatus(domainInfo?.domain, domainInfo?.subdomain, true)}
              disabled={isCheckingStatus}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-red-200 cursor-pointer whitespace-nowrap self-end sm:self-center disabled:opacity-50"
            >
              <RefreshCw size={14} className={isCheckingStatus ? 'animate-spin' : ''} />
              <span>إعادة فحص الـ DNS</span>
            </button>
          </div>
        )}

        {/* Live Pending Status Progress Notice (Countdown timer will NOT disappear upon refresh/updates) */}
        {countdown !== null && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="animate-spin" />
              </div>
              <div>
                <h5 className="font-black text-gray-900 text-sm">جاري التحقق من إعدادات وتفعيل الدومين المخصص...</h5>
                <p className="text-gray-500 text-xs font-semibold mt-0.5">
                  المؤقت التنازلي للفحص التلقائي: <span className="font-mono font-black text-blue-600 text-sm">{countdown} ثانية</span> (لن يختفي المؤقت أثناء التحديثات حتى ينتهي الفحص)
                </p>
              </div>
            </div>

            <button
              onClick={() => checkCustomDomainStatus(domainInfo?.domain, domainInfo?.subdomain, true)}
              disabled={isCheckingStatus}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-blue-200 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw size={14} className={isCheckingStatus ? 'animate-spin' : ''} />
              <span>فحص الحالة الآن</span>
            </button>
          </div>
        )}

        {/* Card 2: Customization Form (Stable & Always Visible) */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="p-8 sm:p-10 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">تعديل النطاق المخصص / الفرعي (Custom Domain)</h3>
              <p className="text-gray-400 font-bold text-xs mt-1">
                حدد النطاق الذي ترغب في استخدامه لربطه بالأكاديمية
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-6">
            
            {/* Mode Switcher & Upgrade Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-gray-700">نوع النطاق:</span>
                <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditMode('subdomain')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      editMode === 'subdomain'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    نطاق فرعي (Subdomain)
                  </button>
                  
                  {hasCustomDomainFeature ? (
                    <button
                      type="button"
                      onClick={() => setEditMode('custom_domain')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        editMode === 'custom_domain'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      دومين مخصص (Custom Domain)
                    </button>
                  ) : null}
                </div>
              </div>

              {/* While customizing subdomain: show custom domain option or upgrade prompt */}
              {editMode === 'subdomain' && (
                hasCustomDomainFeature ? (
                  <button
                    type="button"
                    onClick={() => setEditMode('custom_domain')}
                    className="text-xs font-black text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-purple-200"
                  >
                    <Globe size={14} />
                    <span>إذا كنت تريد استخدام نطاقك الخاص (Custom Domain) يمكنك تخصيصه الآن</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push('/academic/packages/upgrade')}
                    className="text-xs font-black text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-amber-200 shadow-sm"
                  >
                    <Sparkles size={14} />
                    <span>إذا كنت تريد دومينك الخاص، قم بترقية باقتك</span>
                    <ChevronLeft size={14} />
                  </button>
                )
              )}

              {editMode === 'custom_domain' && (
                <button
                  type="button"
                  onClick={() => setEditMode('subdomain')}
                  className="text-xs font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-blue-200"
                >
                  <Layers size={14} />
                  <span>الرجوع للنطاق الفرعي (darab.academy)</span>
                </button>
              )}
            </div>

            {/* Input Field */}
            <div className="space-y-3">
              <label className="text-base font-black text-gray-800">
                {editMode === 'subdomain'
                  ? 'اسم النطاق الفرعي'
                  : 'اسم النطاق المخصص الكامل (Custom Domain)'}
              </label>

              {editMode === 'subdomain' ? (
                <div className="relative">
                  <div className="flex items-center rounded-[2rem] border border-gray-200 bg-gray-50 overflow-hidden focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all" dir="ltr">
                    <input
                      type="text"
                      value={subdomainInput}
                      onChange={(e) => setSubdomainInput(cleanTenantString(e.target.value))}
                      placeholder="academy-name"
                      className="w-full p-5 bg-transparent outline-none font-bold text-lg text-gray-900 text-left font-mono"
                      dir="ltr"
                    />
                    <span className="px-6 py-5 bg-gray-100 text-gray-500 font-mono font-bold text-base border-l border-gray-200 select-none whitespace-nowrap" dir="ltr">
                      .darab.academy
                    </span>
                  </div>
                  {errors.subdomain && (
                    <p className="text-red-500 text-sm font-bold mt-2 pr-4 flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.subdomain[0]}
                    </p>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    placeholder="academy.yourdomain.com أو yourdomain.com"
                    className="w-full p-5 bg-gray-50 border border-gray-200 rounded-[2rem] outline-none font-bold text-lg text-gray-900 text-left font-mono focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/5 transition-all"
                    dir="ltr"
                  />
                  {errors.domain && (
                    <p className="text-red-500 text-sm font-bold mt-2 pr-4 flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.domain[0]}
                    </p>
                  )}
                </div>
              )}

              {/* Note below input */}
              <p className="text-xs text-gray-400 font-semibold pr-2">
                ملاحظة: بعد الحفظ يمكنك المتابعة في استخدام المنصة بينما يستغرق تطبيق النطاق بضع دقائق.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full sm:flex-1 text-white py-5 rounded-[2rem] font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer ${
                  editMode === 'custom_domain'
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Check size={24} strokeWidth={3} />
                )}
                <span>تحديث النطاق وحفظ التغييرات</span>
              </button>

              {domainInfo?.isCustomDomain && (
                <button
                  onClick={handleResetToSubdomain}
                  disabled={isSubmitting}
                  className="px-6 py-5 bg-red-50 hover:bg-red-100 text-red-600 rounded-[2rem] font-black text-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  title="العودة للنطاق الفرعي"
                >
                  <Trash2 size={18} />
                  <span>العودة للنطاق الفرعي الافتراضي</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Card 3: DNS Guide */}
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