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

  const startDateStr = packageInfo?.start_date || packageInfo?.package?.start_date || packageInfo?.subscription?.start_date;
  const endDateStr = packageInfo?.end_date || packageInfo?.package?.end_date || packageInfo?.subscription?.end_date;

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
    packageInfo?.package_name ||
    packageInfo?.name ||
    packageInfo?.package?.name ||
    packageInfo?.package?.package_name ||
    '';

  const packageName = rawPackageName || (userData?.status_payment === 'free_trial' ? 'الباقة التجريبية المجانية' : 'الباقة التجريبية المجانية');

  // 2. Extract Usage Limits (Courses, Storage, Students)
  const coursesLimitObj = usageLimits.find((l: any) => l.feature_slug === 'max_courses' || l.slug === 'courses_limit' || l.name === 'عدد الدورات');
  const storageLimitObj = usageLimits.find((l: any) => l.feature_slug === 'storage_limit' || l.slug === 'storage_limit' || l.name === 'المساحة');
  const studentsLimitObj = usageLimits.find((l: any) => l.feature_slug === 'max_students' || l.slug === 'students_limit' || l.name === 'عدد الطلاب');

  // Extract real numbers from dashboardData if available
  let dashboardCoursesCount = undefined;
  let dashboardStudentsCount = undefined;

  if (dashboardData) {
    dashboardCoursesCount = (dashboardData.courses && typeof dashboardData.courses === 'object' && !Array.isArray(dashboardData.courses))
      ? dashboardData.courses.total
      : (Array.isArray(dashboardData.courses) ? dashboardData.courses.length : (dashboardData.published_courses ?? dashboardData.stats?.published_courses));

    dashboardStudentsCount = dashboardData.new_students?.total ?? dashboardData.active_students ?? dashboardData.stats?.active_students;
  }

  const coursesUsed = dashboardCoursesCount ?? userData?.courses_count ?? (coursesLimitObj ? parseFloat(coursesLimitObj.used_amount ?? coursesLimitObj.used ?? '0') : 0);
  const coursesLimit = coursesLimitObj ? parseFloat(coursesLimitObj.total_limit ?? coursesLimitObj.limit ?? '5') : 5;

  const rawStorageUsed = storageLimitObj ? parseFloat(storageLimitObj.used_amount ?? storageLimitObj.used ?? '0') : 0;
  const rawStorageLimit = storageLimitObj ? parseFloat(storageLimitObj.total_limit ?? storageLimitObj.limit ?? '10') : 10;

  let storageUsedGB = '0 جيجابايت';
  if (rawStorageUsed !== null) {
    if (rawStorageUsed > 100) {
      storageUsedGB = `${(rawStorageUsed / 1024).toFixed(2)} جيجابايت`;
    } else {
      storageUsedGB = `${rawStorageUsed} جيجابايت`;
    }
  }
  const storageLimitGB = `${rawStorageLimit} جيجابايت`;

  const studentsUsed = dashboardStudentsCount ?? userData?.students_count ?? (studentsLimitObj ? parseFloat(studentsLimitObj.used_amount ?? studentsLimitObj.used ?? '0') : 0);
  const studentsLimit = studentsLimitObj ? parseFloat(studentsLimitObj.total_limit ?? studentsLimitObj.limit ?? '50') : 50;

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
