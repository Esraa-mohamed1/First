'use client';

import React, { useEffect, useState } from 'react';
import { getPackages, subscribeToPackage } from '@/services/packages';
import { getProfileStatus } from '@/services/auth';
import { Package } from '@/types/api';
import { Check, X, Loader2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UpgradePackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesData, profileData] = await Promise.all([
          getPackages(),
          getProfileStatus()
        ]);
        setPackages(packagesData);
        
        // Extract email from profile
        const email = profileData?.data?.email || profileData?.email || '';
        setUserEmail(email);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectPackage = async (pkg: Package) => {
    setSubmittingId(pkg.id);
    try {
      const paymentLink = await subscribeToPackage(pkg.id, userEmail);
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        toast.error('لم يتم العثور على رابط الدفع');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'فشل الانتقال لعملية الدفع');
    } finally {
      setSubmittingId(null);
    }
  };

  const getFeatureInfo = (feature: any) => {
    const rawLable = feature.lable || feature.label || feature.name || feature.title;
    let labelName = rawLable && typeof rawLable === 'string' && rawLable.trim() !== '' ? rawLable.trim() : null;

    const key = feature.key_feature || feature.key;
    const featureId = Number(feature.feature_id || feature.id);

    if (!labelName) {
      if (key) {
        switch (key) {
          case 'max_courses': labelName = 'عدد الدورات'; break;
          case 'max_students': labelName = 'عدد الطلاب'; break;
          case 'storage_limit': labelName = 'المساحة التخزينية'; break;
          case 'support_24_7': labelName = 'الدعم الفني 24/7'; break;
          case 'custom_certificates': labelName = 'شهادات مخصصة'; break;
          case 'custom_domain': labelName = 'دومين خاص'; break;
          case 'direct_payment': labelName = 'الدفع المباشر'; break;
          case 'online_payment': labelName = 'بوابة الدفع الإلكتروني'; break;
          case 'custom_subdomains': labelName = 'نطاقات فرعية'; break;
          default: labelName = key.replace(/_/g, ' '); break;
        }
      } else {
        switch (featureId) {
          case 1: labelName = 'عدد الدورات'; break;
          case 2: labelName = 'عدد الطلاب'; break;
          case 3: labelName = 'المساحة التخزينية (GB)'; break;
          case 4: labelName = 'الدعم الفني 24/7'; break;
          case 5: labelName = 'شهادات مخصصة'; break;
          case 6: labelName = 'دومين خاص'; break;
          case 7: labelName = 'الدفع المباشر'; break;
          case 8: labelName = 'بوابة الدفع الإلكتروني'; break;
          case 10: labelName = 'نطاقات فرعية'; break;
          default: labelName = `ميزة ${featureId || ''}`; break;
        }
      }
    }

    const rawVal = feature.value;
    let formattedValue: string | null = null;
    let isNegative = false;

    if (rawVal !== null && rawVal !== undefined && rawVal !== '') {
      const strVal = String(rawVal).trim();
      if (strVal === '1' || strVal.toLowerCase() === 'true') {
        formattedValue = 'متاح';
      } else if (strVal === '0' || strVal.toLowerCase() === 'false') {
        formattedValue = 'غير متاح';
        isNegative = true;
      } else {
        formattedValue = strVal;
      }
    }

    return {
      label: labelName,
      value: formattedValue,
      isNegative,
    };
  };

  const getPackageFeaturesList = (pkg: any) => {
    const rawFeatures = pkg.package_features || pkg.packageFeatures || pkg.features || [];
    
    if (Array.isArray(rawFeatures) && rawFeatures.length > 0) {
      return rawFeatures.map((feat: any) => getFeatureInfo(feat));
    }

    const fallbackList = [];
    if (pkg.max_students) fallbackList.push({ label: 'عدد الطلاب', value: `${pkg.max_students}`, isNegative: false });
    if (pkg.max_courses) fallbackList.push({ label: 'عدد الدورات', value: `${pkg.max_courses}`, isNegative: false });
    if (pkg.video_hours) fallbackList.push({ label: 'ساعات الفيديو', value: `${pkg.video_hours} ساعة`, isNegative: false });
    
    return fallbackList;
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">ترقية باقة الأكاديمية</h2>
          <p className="text-gray-400 font-bold mt-2">اختر الباقة المناسبة لاحتياجاتك واستمتع بمميزات متكاملة لنمو أكاديميتك</p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
        {packages.map((pkg) => {
          const isRecommended = Boolean(pkg.recomnd || pkg.is_popular);
          const featuresList = getPackageFeaturesList(pkg);
          const packageTitle = (pkg as any).titile || (pkg as any).title || 'باقة أكاديمية';
          const packageDesc = pkg.description || (pkg as any).desc || '';
          const priceNum = Number(pkg.price || 0);

          return (
            <div 
              key={pkg.id} 
              className={`rounded-[2.5rem] p-7 md:p-9 transition-all flex flex-col justify-between h-full relative ${
                isRecommended 
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
                    <h3 className="text-2xl font-black text-gray-900">{packageTitle}</h3>
                    {pkg.duration_months && (
                      <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {getDurationText(pkg.duration_months)}
                      </span>
                    )}
                  </div>
                  {packageDesc && (
                    <p className="text-gray-500 font-bold text-xs leading-relaxed line-clamp-2">{packageDesc}</p>
                  )}
                </div>

                {/* Price Display */}
                <div className="mb-8 p-4 bg-gray-50/80 rounded-2xl border border-gray-100/80">
                  <div className="flex items-baseline gap-2">
                    {priceNum === 0 ? (
                      <span className="text-4xl font-black text-emerald-600">مجاناً</span>
                    ) : (
                      <>
                        <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                          {priceNum.toLocaleString()}
                        </span>
                        <span className="text-gray-500 font-bold text-sm">ر.س</span>
                        {pkg.duration_months && (
                          <span className="text-gray-400 font-bold text-xs mr-1">/ {getDurationText(pkg.duration_months)}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">مميزات الباقة:</p>
                  {featuresList.map((feat: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between gap-3 text-xs md:text-sm py-2 border-b border-gray-100/60 last:border-0"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${feat.isNegative ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                          {feat.isNegative ? <X size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className={`font-bold truncate ${feat.isNegative ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                          {feat.label}
                        </span>
                      </div>

                      {feat.value && (
                        <span className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 ${
                          feat.isNegative 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-blue-50 text-blue-700 border border-blue-100/50'
                        }`}>
                          {feat.value}
                        </span>
                      )}
                    </div>
                  ))}

                  {featuresList.length === 0 && (
                    <p className="text-xs font-bold text-gray-400 text-center py-4">لا توجد تفاصيل إضافية</p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleSelectPackage(pkg)}
                disabled={submittingId === pkg.id}
                className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 mt-auto shadow-md ${
                  isRecommended 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-900/10'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {submittingId === pkg.id ? (
                  <>
                    <Loader2 className="animate-spin flex-shrink-0" size={20} />
                    <span className="whitespace-nowrap">جاري الانتقال لعملية الدفع...</span>
                  </>
                ) : (
                  'ترقية الآن'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

