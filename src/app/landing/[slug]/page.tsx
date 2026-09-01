'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';
import { PaymentMethodModal } from '@/components/payment/PaymentMethodModal';
import { getStudentCourse } from '@/services/student-courses';
import { useModal } from '@/context/ModalContext';

export default function DedicatedLandingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const slug = (params?.slug as string) || '';
  const lpId = searchParams.get('lp_id') || undefined;
  const courseIdParam = searchParams.get('course_id') || undefined;
  
  const [course, setCourse] = useState<any | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { openModal } = useModal();

  const loadCourse = React.useCallback(async () => {
    if (!slug) return;

    if (typeof window !== 'undefined') {
      const cachedStr = localStorage.getItem(`darab_course_cache_${slug}`);
      if (cachedStr) {
        try {
          const cachedObj = JSON.parse(cachedStr);
          if (cachedObj) setCourse(cachedObj);
        } catch (e) {}
      }
    }

    try {
      const data = await getStudentCourse(slug);
      if (data) setCourse(data);
    } catch (e) {
      console.error('Failed to load course details for landing page:', e);
    }
  }, [slug]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  useEffect(() => {
    const handleSubscriptionUpdated = () => {
      loadCourse();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('course-subscription-updated', handleSubscriptionUpdated);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('course-subscription-updated', handleSubscriptionUpdated);
      }
    };
  }, [loadCourse]);

  const handleSubscribe = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      openModal('registration');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const getMappedMethods = () => {
    if (!course) return [];
    if (course.payment_methods && course.payment_methods.length > 0) {
      return course.payment_methods;
    }
    if (course.receiver_accounts && course.receiver_accounts.length > 0) {
      return course.receiver_accounts.map((acc: any) => {
        const logoUrl = acc.receiver_account?.logo || '';
        const fullLogoUrl = logoUrl && !logoUrl.startsWith('http') 
          ? `https://api.darab.academy${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`
          : logoUrl;

        const resolvedId = acc.receiver_account?.id || acc.id || '';
        return {
          methodId: resolvedId,
          methodName: acc.receiver_account?.name || 'حساب استقبال',
          type: acc.receiver_account?.key || 'mobile',
          value: acc.account_value || '',
          logo: fullLogoUrl,
          receiver_account_id: resolvedId
        };
      });
    }
    return [];
  };

  return (
    <div className="min-h-screen w-full bg-white" dir="rtl">
      <LandingRenderer
        courseSlug={slug}
        courseId={courseIdParam}
        landingPageId={lpId}
        isEditable={false}
        onSubscribe={handleSubscribe}
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
      />

      {course && (
        <PaymentMethodModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          methods={getMappedMethods()}
          courseId={course.id}
          coursePrice={course.final_price || course.price}
          courseCurrency={course.currency || 'SAR'}
          onSuccess={loadCourse}
        />
      )}
    </div>
  );
}
