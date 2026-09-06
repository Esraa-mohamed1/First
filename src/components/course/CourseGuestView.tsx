'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { getStudentCourse, getMySubscriptions } from '@/services/student-courses';
import { PaymentMethodModal } from '@/components/payment/PaymentMethodModal';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';
import CourseDetailTemplate from '@/components/course/CourseDetailTemplate';
import { getThemeBySlug } from '@/builder/templates/themeStyles';
import { useModal } from '@/context/ModalContext';
import { Loader2 } from 'lucide-react';

interface CourseGuestViewProps {
  slug: string;
}

export default function CourseGuestView({ slug }: CourseGuestViewProps) {
  const router = useRouter();
  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { openModal } = useModal();
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template_1');
  const [showLandingPage, setShowLandingPage] = useState(false);

  const handleSetPaymentModalOpen = (open: boolean) => {
    if (open) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        openModal('registration');
        return;
      }
    }
    setIsPaymentModalOpen(open);
  };

  const loadCourseDetails = useCallback(async () => {
    if (!slug) {
      setNotFoundState(true);
      setLoading(false);
      return;
    }

    try {
      const [data, subscriptions] = await Promise.all([
        getStudentCourse(slug),
        getMySubscriptions().catch(() => []),
      ]);

      if (!data || !data.id) {
        setNotFoundState(true);
        setLoading(false);
        return;
      }

      const courseSubscription = Array.isArray(subscriptions)
        ? subscriptions.find((sub: any) => 
            String(sub.course_id) === String(data.id) || 
            String(sub.course?.id) === String(data.id) ||
            String(sub.courseId) === String(data.id)
          )
        : null;
      const subStatus = courseSubscription ? String(courseSubscription.status || '').toLowerCase() : null;
      const backendEnrollmentStatus = (data as any).enrollment_status ? String((data as any).enrollment_status).toLowerCase() : null;

      const isSubscribed = 
        (data as any).is_enrolled === true ||
        backendEnrollmentStatus === 'active' ||
        backendEnrollmentStatus === 'accepted' ||
        backendEnrollmentStatus === 'paid' ||
        backendEnrollmentStatus === 'completed' ||
        backendEnrollmentStatus === 'subscribed' ||
        subStatus === 'active' ||
        subStatus === 'accepted' ||
        subStatus === 'paid' ||
        subStatus === 'completed' ||
        subStatus === 'subscribed' ||
        false;

      const finalSubscriptionStatus = subStatus || backendEnrollmentStatus || null;

      // Extract learning points from infos
      let learningPoints: string[] = [];
      if (data.infos && Array.isArray(data.infos)) {
        learningPoints = data.infos
          .filter((info: any) =>
            info.key === 'what_you_will_learn' ||
            info.key === 'what_you_learn' ||
            info.info_key === 'what_you_will_learn' ||
            info.info_key === 'what_you_learn'
          )
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .map((info: any) => info.value || info.info_value);
      }

      if (learningPoints.length === 0) {
        try {
          if (data.what_you_will_learn) {
            const parsed = JSON.parse(data.what_you_will_learn);
            learningPoints = Array.isArray(parsed) ? parsed : [data.what_you_will_learn];
          } else if (data.what_you_learn) {
            const parsed = JSON.parse(data.what_you_learn);
            learningPoints = Array.isArray(parsed) ? parsed : [data.what_you_learn];
          }
        } catch (e) {
          if (data.what_you_will_learn) learningPoints = [data.what_you_will_learn];
          else if (data.what_you_learn) learningPoints = [data.what_you_learn];
        }
      }

      // Parse custom info sections
      let infoSections: { id: string; title: string; items: string[] }[] = [];
      if (data.infos && Array.isArray(data.infos) && data.infos.length > 0) {
        const grouped = data.infos.reduce((acc: any, info: any) => {
          const key = info.info_key || info.key;
          const value = info.info_value || info.value;
          if (!key || !value) return acc;

          if (!acc[key]) {
            acc[key] = {
              id: key,
              title: key === 'what_you_will_learn' || key === 'what_you_learn' ? 'ماذا ستتعلم؟' : key,
              items: []
            };
          }
          acc[key].items.push({ value, order: info.order || 0 });
          return acc;
        }, {});

        infoSections = Object.values(grouped).map((group: any) => {
          const sortedItems = group.items.sort((a: any, b: any) => a.order - b.order).map((i: any) => i.value);
          return {
            id: group.id,
            title: group.title,
            items: sortedItems
          };
        });
      } else if (learningPoints.length > 0) {
        infoSections = [{ id: 'what_you_will_learn', title: 'ماذا ستتعلم؟', items: learningPoints }];
      }

      // Format payment methods
      const rawPaymentMethods = data.payment_methods || data.receiverAccounts || data.receiver_accounts || [];
      const paymentMethodsData = rawPaymentMethods.map((item: any) => {
        const receiverAccount = item.receiver_account || item.receiverAccount;
        return {
          methodId: (receiverAccount?.id || item.methodId || item.method_id || item.id)?.toString() || '',
          methodName: receiverAccount?.name || item.name || item.methodName || '',
          type: 'account_number' as const,
          value: item.value || item.accountValue || item.account_value || '',
          currency: item.currency || receiverAccount?.currency || 'SAR',
          logo: receiverAccount?.logo || item.logo || undefined
        };
      });

      const mergedCourse = {
        id: data.id,
        title: data.title,
        description: data.description,
        instructor: typeof data.instructor === 'object' && data.instructor !== null ? data.instructor : (data.instructor || null),
        category: (data as any).category?.name || 'General',
        price: data.price,
        final_price: data.final_price,
        currency: data.currency || 'SAR',
        price_type: data.price_type || (Number(data.price || 0) === 0 ? 'free' : 'paid'),
        image: data.image,
        units: data.units || (data as any).chapters || [],
        learning_points: learningPoints,
        info_sections: infoSections,
        is_subscribed: isSubscribed,
        subscription_status: finalSubscriptionStatus,
        rejection_reason: (data as any).rejection_reason || (courseSubscription ? (courseSubscription.message || courseSubscription.rejection_reason || courseSubscription.rejectionReason) : '') || '',
        payment_methods: paymentMethodsData,
      };

      setCourse(mergedCourse);

      // Resolve template
      let resolvedTemplate = 'template_1';
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const queryTemplate = urlParams.get('template');
        if (queryTemplate) {
          resolvedTemplate = queryTemplate;
        } else {
          const localStored = localStorage.getItem(`darab_course_template_${data.id}`);
          if (localStored) {
            resolvedTemplate = localStored;
          } else {
            const globalStored = localStorage.getItem('darab_active_template');
            if (globalStored) resolvedTemplate = globalStored;
          }
        }
      }
      if (typeof window !== 'undefined' && !new URLSearchParams(window.location.search).get('template')) {
        if (data.infos && Array.isArray(data.infos)) {
          const templateInfo = data.infos.find(
            (info: any) => (info.key === 'course_template' || info.info_key === 'course_template')
          );
          if (templateInfo) {
            resolvedTemplate = templateInfo.value || templateInfo.info_value || 'template_1';
          }
        }
      }
      setActiveTemplateId(resolvedTemplate);
    } catch (error) {
      console.warn(`Course with slug "${slug}" not found:`, error);
      setNotFoundState(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadCourseDetails();
  }, [loadCourseDetails]);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      await loadCourseDetails();
      setIsPaymentModalOpen(true);
    };

    const handleSubscriptionUpdated = async (e: any) => {
      await loadCourseDetails();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('student-registered', handleAuthSuccess);
      window.addEventListener('student-logged-in', handleAuthSuccess);
      window.addEventListener('course-subscription-updated', handleSubscriptionUpdated);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('student-registered', handleAuthSuccess);
        window.removeEventListener('student-logged-in', handleAuthSuccess);
        window.removeEventListener('course-subscription-updated', handleSubscriptionUpdated);
      }
    };
  }, [loadCourseDetails]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const isLP = searchParams.get('lp') === 'true' || searchParams.get('lp_id') || searchParams.get('marketing') === 'true';
      setShowLandingPage(!!isLP);
    }
  }, []);

  const handleSubscribe = () => {
    if (!course) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      openModal('registration');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 font-bold text-slate-900" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span>جاري تحميل الدورة...</span>
      </div>
    );
  }

  if (notFoundState || !course) {
    return notFound();
  }

  const theme = getThemeBySlug(activeTemplateId);
  const cssVariables = {
    '--theme-primary': theme.primaryColor,
    '--theme-primary-rgb': theme.primaryRgb,
    '--theme-secondary': theme.secondaryColor,
    '--theme-accent': theme.accentColor,
    '--theme-bg': theme.backgroundColor,
    '--theme-text': theme.textColor,
    fontFamily: `'${theme.fontFamily}', sans-serif`,
  } as React.CSSProperties;

  return (
    <div style={cssVariables} className="min-h-screen w-full transition-all duration-300 flex flex-col justify-between" dir="rtl">
      <div className="w-full flex-grow">
        {showLandingPage ? (
          <LandingRenderer
            courseSlug={slug}
            isEditable={false}
            onSubscribe={handleSubscribe}
            isPaymentModalOpen={isPaymentModalOpen}
            setIsPaymentModalOpen={handleSetPaymentModalOpen}
          />
        ) : (
          <CourseDetailTemplate
            course={course}
            isSubscribed={course.is_subscribed}
            onSubscribe={handleSubscribe}
            onStatusRefresh={loadCourseDetails}
            onLearnClick={() => router.push(`/student/courses/${course.id}/learn`)}
          />
        )}
      </div>

      {course && (
        <PaymentMethodModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          methods={course.payment_methods || []}
          courseId={course.id}
          coursePrice={course.final_price || course.price}
          courseCurrency={course.currency || 'SAR'}
          onSuccess={loadCourseDetails}
        />
      )}
    </div>
  );
}
