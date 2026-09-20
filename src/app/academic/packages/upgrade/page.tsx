
'use client';

import React, { useEffect, useState } from 'react';
import { getPackages, subscribeToPackage } from '@/services/packages';
import { getProfileStatus, getMyPackage } from '@/services/auth';
import { Package } from '@/types/api';
import {
  Check,
  X,
  Loader2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UpgradePackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [currentPackageId, setCurrentPackageId] = useState<number | null>(null);
  const [currentPackageInfo, setCurrentPackageInfo] = useState<any>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesData, profileData, currentPackageData] = await Promise.all([
          getPackages(),
          getProfileStatus(),
          getMyPackage(),
        ]);

        setPackages(packagesData);

        // Extract email from profile
        const email = profileData?.data?.email || profileData?.email || '';
        setUserEmail(email);

        const currentPackage =
          currentPackageData?.data?.package_info ||
          currentPackageData?.package_info ||
          currentPackageData?.data ||
          currentPackageData;

        setCurrentPackageInfo(currentPackage || null);
        setCurrentPackageId(
          currentPackage?.package_id
            ? Number(currentPackage.package_id)
            : null
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectPackage = (pkg: Package) => {
    if (currentPackageId === pkg.id) return;
    setSelectedPackage(pkg);
    setPaymentProof(null);
    setShowPaymentModal(true);
  };

  const getPackageFeaturesList = (pkg: any) => {
    const rawFeatures =
      pkg.packageFeatures ||
      pkg.package_features ||
      pkg.features ||
      [];

    if (!Array.isArray(rawFeatures)) return [];

    return rawFeatures.map((feature: any) => {
      const label =
        feature.lable ||
        feature.label ||
        feature.title ||
        'ميزة';

      const rawVal = feature.value;

      const strVal =
        rawVal !== null && rawVal !== undefined
          ? String(rawVal).trim()
          : '';

      const isNegative =
        strVal === '0' ||
        strVal.toLowerCase() === 'false' ||
        strVal === '';

      let formattedValue: string | null = null;

      if (!isNegative) {
        if (
          strVal === '1' ||
          strVal.toLowerCase() === 'true'
        ) {
          formattedValue = null;
        } else {
          formattedValue = strVal;
        }
      }

      return {
        label,
        value: formattedValue,
        isNegative,
      };
    });
  };

  const getDurationText = (months: string | number) => {
    const m = Number(months || 1);

    if (m === 1) return 'شهرياً';
    if (m === 3) return 'كل 3 أشهر';
    if (m === 6) return 'كل 6 أشهر';
    if (m === 12) return 'سنوياً';
    if (m === 24) return 'لمدة سنتين';

    return `لمدة ${m} شهر`;
  };

  // Helper to check if a package is Free based on price
  const isPackageFree = (pkg: Package) => parseFloat(pkg.price || '0') === 0;

  // Check if current subscription is FreePackage
  const isCurrentPackageFree =
    (currentPackageId !== null &&
      packages.some(
        (p) => p.id === currentPackageId && isPackageFree(p)
      )) ||
    (currentPackageInfo?.price !== undefined &&
      parseFloat(currentPackageInfo.price || '0') === 0);

  // Filter packages:
  // - If user is on FreePackage: keep FreePackage visible (marked as current and disabled)
  // - If user is on Paid Package: completely hide FreePackage from available options
  const displayedPackages = packages.filter((pkg) => {
    const isFree = isPackageFree(pkg);
    if (isFree) {
      return currentPackageId !== null
        ? currentPackageId === pkg.id
        : isCurrentPackageFree;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 text-right" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold mb-4"
          >
            <ArrowRight size={20} />
            <span>العودة للباقة الحالية</span>
          </button>

          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            ترقية باقة الأكاديمية
          </h2>

          <p className="text-gray-400 font-bold mt-2">
            اختر الباقة المناسبة لاحتياجاتك واستمتع بمميزات متكاملة لنمو أكاديميتك
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
        {displayedPackages.map((pkg) => {
          const isRecommended = Boolean(
            pkg.recomnd || pkg.is_popular
          );

          const featuresList = getPackageFeaturesList(pkg);

          const packageTitle =
            (pkg as any).titile ||
            (pkg as any).title ||
            'باقة أكاديمية';

          const packageDesc =
            pkg.description ||
            (pkg as any).desc ||
            '';

          const priceNum = Number(pkg.price || 0);

          return (
            <div
              key={pkg.id}
              className={`rounded-[2.5rem] p-7 md:p-9 transition-all flex flex-col justify-between h-full relative ${isRecommended
                ? 'bg-white border-2 border-blue-600 shadow-2xl shadow-blue-500/15 scale-[1.02] z-10'
                : 'bg-white border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg'
                }`}
            >
              {isRecommended && (
                <div className="absolute -top-4 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>الأكثر اختياراً</span>
                </div>
              )}

              <div>

                {/* Title & Description */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-black text-gray-900">
                      {packageTitle}
                    </h3>

                    {pkg.duration_months && (
                      <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {getDurationText(pkg.duration_months)}
                      </span>
                    )}
                  </div>

                  {packageDesc && (
                    <p className="text-gray-500 font-bold text-xs leading-relaxed line-clamp-2">
                      {packageDesc}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="mb-8 p-4 bg-gray-50/80 rounded-2xl border border-gray-100/80">
                  <div className="flex items-baseline gap-2">
                    {priceNum === 0 ? (
                      <span className="text-4xl font-black text-emerald-600">
                        مجاناً
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                          {priceNum.toLocaleString()}
                        </span>

                        <span className="text-gray-500 font-bold text-sm">
                          ر.س
                        </span>

                        {pkg.duration_months && (
                          <span className="text-gray-400 font-bold text-xs mr-1">
                            / {getDurationText(pkg.duration_months)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
                    مميزات الباقة:
                  </p>

                  {featuresList.map((feat: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 text-xs md:text-sm py-2 border-b border-gray-100/60 last:border-0"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">

                        {/* Check / X */}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${feat.isNegative
                            ? 'bg-red-50 text-red-500'
                            : 'bg-emerald-50 text-emerald-600'
                            }`}
                        >
                          {feat.isNegative ? (
                            <X size={12} strokeWidth={3} />
                          ) : (
                            <Check size={12} strokeWidth={3} />
                          )}
                        </div>

                        {/* Feature Name */}
                        <span
                          className={`font-bold truncate ${feat.isNegative
                            ? 'text-red-400 line-through'
                            : 'text-gray-800'
                            }`}
                        >
                          {feat.label}
                        </span>

                        {/* Unsupported Message */}
                        {feat.isNegative && (
                          <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                            - غير مدعومة في هذه الباقة
                          </span>
                        )}
                      </div>

                      {/* Feature Value */}
                      {feat.value && (
                        <span
                          className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 ${feat.isNegative
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-blue-50 text-blue-700 border border-blue-100/50'
                            }`}
                        >
                          {feat.value}
                        </span>
                      )}
                    </div>
                  ))}

                  {featuresList.length === 0 && (
                    <p className="text-xs font-bold text-gray-400 text-center py-4">
                      لا توجد تفاصيل إضافية
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectPackage(pkg)}
                disabled={
                  submittingId === pkg.id ||
                  currentPackageId === pkg.id
                }
                className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 mt-auto shadow-md ${currentPackageId === pkg.id
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : isRecommended
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
                    : 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-900/10'
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {submittingId === pkg.id ? (
                  <>
                    <Loader2
                      className="animate-spin flex-shrink-0"
                      size={20}
                    />
                    <span className="whitespace-nowrap">
                      جاري الانتقال لعملية الدفع...
                    </span>
                  </>
                ) : currentPackageId === pkg.id ? (
                  'باقتك الحالية'
                ) : (
                  'ترقية الآن'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Proof Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-black text-gray-900 mb-2">
              ترقية الباقة
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              ارفع إيصال الدفع للباقة:
              <span className="font-bold text-gray-900 mr-1">
                {(selectedPackage as any).titile ||
                  (selectedPackage as any).title ||
                  'الباقة المختارة'}
              </span>
            </p>

            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                إيصال الدفع
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPaymentProof(file);
                }}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm"
              />

              {paymentProof && (
                <p className="mt-2 text-sm text-emerald-600 font-bold">
                  تم اختيار: {paymentProof.name}
                </p>
              )}
            </div>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentProof(null);
                  setSelectedPackage(null);
                }}
                className="flex-1 rounded-xl border border-gray-200 py-3 font-bold text-gray-600"
              >
                إلغاء
              </button>

              <button
                type="button"
                disabled={!paymentProof || submittingId !== null}
                onClick={async () => {
                  if (!paymentProof || !selectedPackage) return;

                  setSubmittingId(selectedPackage.id);

                  try {
                    const response = await subscribeToPackage(
                      selectedPackage.id,
                      userEmail,
                      paymentProof
                    );

                    if (response?.status || response?.success || response?.data) {
                      toast.success(
                        response?.message || 'تم إرسال طلب الترقية بنجاح، وجاري المعالجة'
                      );
                      setShowPaymentModal(false);
                      setPaymentProof(null);
                      setSelectedPackage(null);
                    } else {
                      toast.error(
                        response?.message || 'فشل في إرسال طلب الترقية'
                      );
                    }
                  } catch (err: any) {
                    console.error(err);

                    toast.error(
                      err?.message || 'فشل في إرسال طلب الترقية'
                    );
                  } finally {
                    setSubmittingId(null);
                  }
                }}
                className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white disabled:opacity-50"
              >
                {submittingId === selectedPackage.id
                  ? 'جاري الإرسال...'
                  : 'تأكيد الترقية'}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

