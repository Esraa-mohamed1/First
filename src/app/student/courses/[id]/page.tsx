'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Play, FileText, CheckCircle2, Clock, Award,
  ChevronRight, Star, Calendar,
  ChevronDown, ChevronUp, ShieldCheck,
  Video, Lock, PlayCircle, BookOpen, User, ArrowLeft, ArrowRight
} from 'lucide-react';
import { getMyCourseDetails } from '@/services/student-courses';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import CourseDetailTemplate from '@/components/course/CourseDetailTemplate';

export default function StudentCourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const data = await getMyCourseDetails(id);
        
        // Normalize structure (chapters vs units)
        const infosLearning = Array.isArray(data.infos)
          ? data.infos
              .filter((info: any) => info.info_key === 'what_you_will_learn' || info.key === 'what_you_will_learn')
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((info: any) => info.info_value || info.value)
          : [];

        const rawAccounts = data.receiver_accounts || data.payment_methods || [];
        const mappedPaymentMethods = rawAccounts.map((item: any) => {
          const receiverAccount = item.receiver_account || item.receiverAccount;
          return {
            methodId: String(receiverAccount?.id || item.id || item.methodId || ''),
            methodName: receiverAccount?.name || item.name || item.methodName || '',
            type: 'account_number' as const,
            value: item.account_value || item.value || '',
            currency: item.currency || receiverAccount?.currency || data.currency || 'EGP',
            logo: receiverAccount?.logo || item.logo || undefined,
          };
        });

        const normalizedCourse = {
          ...data,
          units: data.units || data.chapters || [],
          learning_points: infosLearning.length > 0 ? infosLearning : (data.learning_points || []),
          payment_methods: mappedPaymentMethods,
        };
        
        setCourse(normalizedCourse);
        
        // Expand the first unit by default
        if (normalizedCourse.units && normalizedCourse.units.length > 0) {
          setExpandedUnits([normalizedCourse.units[0].id]);
        }
      } catch (err) {
        console.error('Failed to fetch enrolled course details:', err);
        setError('فشل تحميل تفاصيل الدورة. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(uid => uid !== unitId) : [...prev, unitId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-600 font-bold" dir="rtl">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>جاري تحميل تفاصيل الدورة...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4" dir="rtl">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{error || 'لم يتم العثور على الدورة'}</h3>
        <button
          onClick={() => router.push('/student/courses')}
          className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          العودة إلى دوراتي
        </button>
      </div>
    );
  }

  return (
    <CourseDetailTemplate
      course={course}
      isSubscribed={true}
      isStudentDashboard={true}
      onSubscribe={() => {}}
      onLearnClick={() => router.push(`/student/courses/${id}/learn`)}
      hideHeaderFooter={true}
    />
  );
}
