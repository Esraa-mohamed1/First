'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfileStatus, getMyUsageLimit, getMyPackage } from '@/services/auth';
import { getDashboard } from '@/services/courses';
import {
  Sparkles,
  ArrowLeft,
  BookOpen,
  HardDrive,
  Users,
  Clock,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export default function DashboardTopBanners() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [usageLimits, setUsageLimits] = useState<any[]>([]);
  const [packageInfo, setPackageInfo] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndLimits = async () => {
      try {
        const [profileRes, limitsRes, dashRes, pkgRes] = await Promise.all([
          getProfileStatus(),
          getMyUsageLimit().catch(() => null),
          getDashboard().catch(() => null),
          getMyPackage().catch(() => null),
        ]);

        const profile = profileRes?.data || profileRes;
        if (profile) {
          setUserData(profile);
          localStorage.setItem('user_info', JSON.stringify(profile));
        }

        const limits = limitsRes?.data || (Array.isArray(limitsRes) ? limitsRes : []);
        setUsageLimits(limits);

        const pkg = pkgRes?.data || pkgRes;
        if (pkg) {
          setPackageInfo(pkg);
        }

        if (dashRes) {
          setDashboardData(dashRes);
        }
      } catch (err) {
        console.error('Failed to load user profile for banners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndLimits();
  }, []);

  if (loading || !userData) return null;

  // 1. Calculate Real Package Countdown & Name from start_date and end_date keys
  const nowMs = Date.now();
  let remainingDays = 0;
  let totalDays = 30;

  const pkgDetails =
    packageInfo?.package_info ||
    packageInfo?.data?.package_info ||
    packageInfo?.subscription ||
    packageInfo?.package ||
    packageInfo;

  const startDateStr =
    pkgDetails?.start_date ||
    pkgDetails?.created_at ||
    packageInfo?.start_date;

  const endDateStr =
    pkgDetails?.end_date ||
    pkgDetails?.expires_at ||
    packageInfo?.end_date;

  if (startDateStr && endDateStr) {
    const startMs = new Date(startDateStr).getTime();
    const endMs = new Date(endDateStr).getTime();

    if (!isNaN(startMs) && !isNaN(endMs)) {
      const totalMs = endMs - startMs;
      if (totalMs > 0) {
        totalDays = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
      }
      const diffMs = endMs - nowMs;
      remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }
  } else {
    const createdAtMs = userData?.created_at ? new Date(userData.created_at).getTime() : Date.now();
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
    const expiryTimeMs = createdAtMs + fourteenDaysMs;
    const diffMs = expiryTimeMs - nowMs;
    totalDays = 14;
    remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  const rawPackageName =
    pkgDetails?.package_name ||
    pkgDetails?.name ||
    pkgDetails?.title ||
    packageInfo?.package_name ||
    packageInfo?.name ||
    '';

  const packageName = rawPackageName || (userData?.status_payment === 'free_trial' ? 'الباقة التجريبية المجانية' : 'الباقة الحالية');

  // 2. Extract Usage Limits (Courses, Storage, Students) directly from my-usage-limit API
  const limitsArray = Array.isArray(usageLimits)
    ? usageLimits
    : (usageLimits && typeof usageLimits === 'object' && Array.isArray((usageLimits as any).data)
      ? (usageLimits as any).data
      : []);

  const allLimitItems = [
    ...limitsArray,
    ...(Array.isArray(packageInfo?.features) ? packageInfo.features : []),
  ];

  const coursesLimitObj = allLimitItems.find((l: any) =>
    l.key_feature === 'count_course' ||
    l.key_feature === 'max_courses' ||
    l.feature_slug === 'max_courses' ||
    l.slug === 'courses_limit' ||
    l.name === 'عدد الدورات' ||
    (l.label && String(l.label).includes('دورات'))
  );

  const storageLimitObj = allLimitItems.find((l: any) =>
    l.key_feature === 'storage_space' ||
    l.key_feature === 'storage_limit' ||
    l.feature_slug === 'storage_limit' ||
    l.slug === 'storage_limit' ||
    l.name === 'المساحة' ||
    (l.label && (String(l.label).includes('مساحة') || String(l.label).includes('تخزين')))
  );

  const studentsLimitObj = allLimitItems.find((l: any) =>
    l.key_feature === 'count_student' ||
    l.key_feature === 'max_students' ||
    l.feature_slug === 'max_students' ||
    l.slug === 'students_limit' ||
    l.name === 'عدد الطلاب' ||
    (l.label && String(l.label).includes('طلاب'))
  );

  const getLimitVal = (obj: any, fallback: number) => {
    if (!obj) return fallback;
    const v = obj.value ?? obj.total_limit ?? obj.limit ?? obj.max;
    if (v !== undefined && v !== null && v !== '') {
      const num = parseFloat(String(v));
      if (!isNaN(num)) return num;
    }
    return fallback;
  };

  const getUsedVal = (obj: any, fallback: number) => {
    if (!obj) return fallback;
    const v = obj.used_amount ?? obj.used ?? obj.current_usage ?? obj.used_count;
    if (v !== undefined && v !== null && v !== '') {
      const num = parseFloat(String(v));
      if (!isNaN(num)) return num;
    }
    return fallback;
  };

  // Read usage limit values directly and strictly from my-usage-limit API objects
  const coursesUsed = getUsedVal(coursesLimitObj, 0);
  const coursesLimit = getLimitVal(coursesLimitObj, 50);

  const rawStorageUsed = getUsedVal(storageLimitObj, 0);
  const rawStorageLimit = getLimitVal(storageLimitObj, 100);

  let storageUsedGB = '0 جيجابايت';
  if (rawStorageUsed !== null) {
    if (rawStorageUsed > 100) {
      storageUsedGB = `${(rawStorageUsed / 1024).toFixed(2)} جيجابايت`;
    } else {
      storageUsedGB = `${rawStorageUsed} جيجابايت`;
    }
  }
  const storageLimitGB = `${rawStorageLimit} جيجابايت`;

  const studentsUsed = getUsedVal(studentsLimitObj, 0);
  const studentsLimit = getLimitVal(studentsLimitObj, 50);

  // 3. Verification State
  const isEmailVerified = !!userData?.email_verified_at;
  const isPhoneVerified = !!userData?.phone_verified_at;
  const isFullyVerified = isEmailVerified || isPhoneVerified;

  const handleVerificationRedirect = () => {
    const contact = userData?.email || userData?.phone || '';
    router.push(`/auth/verification?contact=${encodeURIComponent(contact)}`);
  };

  return (
    <div className="space-y-4 mb-6" dir="rtl">
      {/* BANNER 1: Package Banner */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-xs relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {packageName}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                متبقي {remainingDays} يوماً من أصل {totalDays} يوماً
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-snug">
              أنت الآن على {packageName} للأكاديمية 🚀
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
              استمتع بجميع مميزات المنصة المتاحة في {packageName}. يمكنك إنشاء دوراتك، رفع محتواك، وإضافة طلابك بسهولة قبل اختيار الباقة المناسبة لأكاديميتك.
            </p>

            {/* Package Usage Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">عدد الدورات المتاحة</span>
                  <span className="text-xs font-bold text-slate-900">{coursesUsed} / {coursesLimit} دورات</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">مساحة التخزين السحابي</span>
                  <span className="text-xs font-bold text-slate-900">{storageUsedGB} / {storageLimitGB}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">سعة الطلاب الكلية</span>
                  <span className="text-xs font-bold text-slate-900">{studentsUsed} / {studentsLimit} طالباً</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Upgrade Button */}
          <div className="shrink-0 flex items-center pt-2 lg:pt-0">
            <button
              type="button"
              onClick={() => router.push('/academic/packages/upgrade')}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <span>ترقية الباقة الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* BANNER 2: Account Verification Banner */}
      {!isFullyVerified && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    لم يتم التحقق من بيانات حسابك الأكاديمي
                  </h4>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                    مطلوب للتفعيل
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  تأكيد رقم الجوال أو البريد الإلكتروني يساعد في تأمين أكاديميتك وتفعيل إشعارات الدفع والطلاب بشكل كامل.
                </p>
              </div>
            </div>

            <div className="shrink-0 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={handleVerificationRedirect}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>تأكيد الحساب الآن</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
