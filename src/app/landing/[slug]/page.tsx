'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';
import { PaymentMethodModal } from '@/components/payment/PaymentMethodModal';
import { getStudentCourse } from '@/services/student-courses';
import { useModal } from '@/context/ModalContext';
import { mapCoursePaymentMethods } from '@/lib/payment-methods';

export default function DedicatedLandingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const slug = (params?.slug as string) || '';
  const lpId = searchParams.get('lp_id') || undefined;
  const courseIdParam = searchParams.get('course_id') || undefined;
  
  const [course, setCourse] = useState<any | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
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

  const getMappedMethods = React.useCallback(() => {
    if (!course) return [];
    return mapCoursePaymentMethods(course);
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
