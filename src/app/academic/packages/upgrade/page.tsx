'use client';

import React, { useEffect, useState } from 'react';
import { getPackages, subscribeToPackage } from '@/services/packages';
import { getProfileStatus } from '@/services/auth';
import { Package } from '@/types/api';
import { Check, Loader2, ArrowRight } from 'lucide-react';
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
          <h2 className="text-3xl font-black text-gray-900">اختر الباقة المناسبة لك</h2>
          <p className="text-gray-400 font-bold mt-2">استمتع بمميزات أكثر ومساحة أكبر لنمو أكاديميتك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`bg-white rounded-[40px] p-6 md:p-8 border-2 transition-all flex flex-col h-full ${
              pkg.is_popular ? 'border-blue-500 shadow-xl lg:scale-105 relative z-10' : 'border-gray-100 hover:border-blue-200 shadow-sm'
            }`}
          >
            {pkg.is_popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-1.5 rounded-full text-xs md:text-sm font-black whitespace-nowrap">
                الأكثر اختياراً
              </span>
            )}

            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">{(pkg as any).titile || (pkg as any).title}</h3>
              <p className="text-gray-400 font-bold text-xs md:text-sm line-clamp-2">{pkg.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline flex-wrap gap-1">
                <span className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">{pkg.price}</span>
                <span className="text-gray-400 font-bold text-sm">ر.س / شهر</span>
              </div>
            </div>

            <div className="space-y-4 flex-1 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-gray-700 font-bold text-sm md:text-base">{pkg.max_students} طالب</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-gray-700 font-bold text-sm md:text-base">{pkg.max_courses} دورة</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-gray-700 font-bold text-sm md:text-base">{pkg.video_hours} ساعة فيديو</span>
              </div>
              {pkg.features?.map((feature: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-gray-700 font-bold text-sm md:text-base truncate">{feature.lable || feature.name || feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleSelectPackage(pkg)}
              disabled={submittingId === pkg.id}
              className={`w-full py-4 rounded-2xl font-black text-base md:text-lg transition-all flex items-center justify-center gap-2 mt-auto ${
                pkg.is_popular ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
              } disabled:opacity-70`}
            >
              {submittingId === pkg.id ? (
                <>
                  <Loader2 className="animate-spin flex-shrink-0" size={20} />
                  <span className="whitespace-nowrap">جاري الانتقال...</span>
                </>
              ) : (
                'اختيار الباقة'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
