'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLogoUrl } from '@/lib/utils';
import {
  Play, FileText, CheckCircle2, Award, Clock,
  ChevronDown, ChevronUp, Edit3, BarChart3, Eye,
  BookOpen, User, CreditCard, ArrowRight, Video, Landmark
} from 'lucide-react';
import { getCourse } from '@/services/courses';
import { getUserPaymentInfos, UserPaymentInfo } from '@/services/finance';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import CourseDetailTemplate from '@/components/course/CourseDetailTemplate';

export default function OwnerCourseViewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [academyPaymentMethods, setAcademyPaymentMethods] = useState<UserPaymentInfo[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const [data, paymentInfos] = await Promise.all([
          getCourse(id),
          getUserPaymentInfos()
        ]);
        
        setAcademyPaymentMethods(paymentInfos || []);
        
        // Normalize chapters vs units
        const infosLearning = Array.isArray(data.infos)
          ? data.infos
              .filter((info: any) => info.info_key === 'what_you_will_learn' || info.key === 'what_you_will_learn')
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((info: any) => info.info_value || info.value)
          : [];

        const rawAccounts = data.receiver_accounts || data.payment_methods || [];
        const mappedPaymentMethods = rawAccounts.map((item: any) => ({
          methodId: String(item.id || item.methodId || ''),
          methodName: item.name || item.methodName || '',
          type: 'account_number' as const,
          value: item.account_value || item.value || '',
          currency: item.currency || data.currency || 'EGP',
          logo: item.logo || undefined,
        }));

        const normalizedCourse = {
          ...data,
          units: data.units || data.chapters || [],
          learning_points: infosLearning.length > 0 ? infosLearning : (data.learning_points || []),
          payment_methods: mappedPaymentMethods,
        };
        
        setCourse(normalizedCourse);
        
        // Expand first unit by default
        if (normalizedCourse.units && normalizedCourse.units.length > 0) {
          setExpandedUnits([normalizedCourse.units[0].id]);
        }
      } catch (err) {
        console.error('Failed to fetch course details for owner:', err);
        setError('فشل تحميل تفاصيل الدورة. يرجى التأكد من صحة الرابط والمحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(uid => uid !== unitId) : [...prev, unitId]
    );
  };

  const getCourseTypeLabel = (type: string) => {
    switch (type) {
      case 'registered': return 'مسجلة (مرفوعة)';
      case 'online': return 'أونلاين (بث مباشر)';
      case 'offline': return 'حضورياً (موقع فعلي)';
      default: return type || 'غير محدد';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-600 font-bold font-sans" dir="rtl">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>جاري تحميل تفاصيل الدورة كمالك...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4 font-sans" dir="rtl">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
          <Landmark size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{error || 'لم يتم العثور على الدورة'}</h3>
        <button
          onClick={() => router.push('/academic/courses')}
          className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          العودة إلى الدورات
        </button>
      </div>
    );
  }

  const totalUnits = course.units?.length || 0;
  const totalLessons = course.units?.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0) || 0;
  const courseImage = course.image || course.cover_image || course.thumbnail || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200';
  const isPaid = course.price_type === 'paid';
  const price = course.price || 0;
  const currency = course.currency || 'SAR';

  // Selected payment methods list
  const rawPaymentMethods = course?.payment_methods || course?.receiverAccounts || course?.receiver_accounts || [];
  const paymentMethods = rawPaymentMethods.map((item: any) => {
    const val = item.value || item.accountValue || item.account_value || '';
    const name = item.name || item.receiver_account?.name || item.methodName || '';
    const currency = item.currency || 'SAR';

    const resolvedId = item.instructor_receiver_account_id || 
                       item.pivot?.instructor_receiver_account_id || 
                       item.pivot?.receiver_account_id ||
                       item.id || 
                       item.methodId || 
                       item.method_id || 
                       item.receiver_account_id;

    const matchedMethod = academyPaymentMethods?.find((m: any) => 
      m.id.toString() === resolvedId?.toString() ||
      (m.accountValue && val && m.accountValue.toString().trim() === val.toString().trim()) ||
      (m.account_value && val && m.account_value.toString().trim() === val.toString().trim())
    );

    return {
      methodId: (matchedMethod?.id || resolvedId)?.toString() || '',
      methodName: matchedMethod?.name || name,
      value: matchedMethod?.accountValue || matchedMethod?.account_value || val,
      currency: matchedMethod?.currency || currency,
      logo: matchedMethod?.logo || item.logo || item.receiver_account?.logo || undefined
    };
  });

  return (
    <CourseDetailTemplate
      course={course}
      isSubscribed={false}
      isOwnerReview={true}
      onSubscribe={() => {}}
      onLearnClick={() => {}}
      hideHeaderFooter={true}
    />
  );
}
