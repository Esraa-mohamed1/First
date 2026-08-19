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

  useEffect(() => {
    async function loadCourse() {
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
    }
    loadCourse();
  }, [slug]);

  const handleSubscribe = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      openModal('registration');
      return;
    }
    setIsPaymentModalOpen(true);
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
          methods={course.payment_methods || []}
          courseId={course.id}
          coursePrice={course.final_price || course.price}
          courseCurrency={course.currency || 'SAR'}
        />
      )}
    </div>
  );
}
