'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';
import { PaymentMethodModal } from '@/components/payment/PaymentMethodModal';
import { getStudentCourse } from '@/services/student-courses';
import { useModal } from '@/context/ModalContext';

export default function RootLandingPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';
  const lpId = searchParams.get('lp_id') || undefined;
  const courseIdParam = searchParams.get('course_id') || undefined;
  
  const [course, setCourse] = useState<any | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const { openModal } = useModal();

  const loadCourse = React.useCallback(async () => {
    if (!slug) return;
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

  const getMappedMethods = React.useCallback(() => {
    if (!course) return [];
    if (course.payment_methods && course.payment_methods.length > 0) {
      return course.payment_methods.map((pm: any) => {
        const resolvedId = pm.id || pm.receiver_account_id || pm.methodId || pm.method_id || pm.receiver_account?.id;
        return {
          ...pm,
          id: resolvedId,
          methodId: String(resolvedId || ''),
          receiver_account_id: resolvedId
        };
      });
    }
    if (course.receiver_accounts && course.receiver_accounts.length > 0) {
      return course.receiver_accounts.map((acc: any) => {
        const logoUrl = acc.logo || acc.receiver_account?.logo || '';
        const fullLogoUrl = logoUrl && !logoUrl.startsWith('http') 
          ? `https://api.darab.academy${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`
          : logoUrl;

        const resolvedId = acc.id || acc.receiver_account_id || acc.methodId || acc.method_id || acc.receiver_account?.id || '';
        return {
          id: resolvedId,
          methodId: String(resolvedId),
          methodName: acc.name || acc.methodName || acc.receiver_account?.name || 'حساب استقبال',
          type: acc.type || acc.receiver_account?.key || 'mobile',
          value: acc.value || acc.account_value || acc.account_number || '',
          logo: fullLogoUrl,
          receiver_account_id: resolvedId
        };
      });
    }
    return [];
  }, [course]);

  useEffect(() => {
    const methods = getMappedMethods();
    if (methods.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(methods[0]);
    }
  }, [course, getMappedMethods, selectedPaymentMethod]);

  return (
    <div className="min-h-screen w-full bg-white" dir="rtl">
      <LandingRenderer
        courseSlug={slug}
        courseId={courseIdParam}
        landingPageId={lpId}
        isEditable={false}
        onSubscribe={handleSubscribe}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
      />

      {course && (
        <PaymentMethodModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          methods={getMappedMethods()}
          initialSelectedMethod={selectedPaymentMethod}
          courseId={course.id}
          coursePrice={course.final_price || course.price}
          courseCurrency={course.currency || 'SAR'}
          onSuccess={loadCourse}
        />
      )}
    </div>
  );
}
