import React from 'react';
import { useLandingContent } from '../hooks/useLandingContent';
import { useLandingStore } from '../store/landingStore';
import { getThemeBySlug } from '@/builder/templates/themeStyles';
import HeroSection from '../components/HeroSection';
import LearningSection from '../components/LearningSection';
import ChapterSection from '../components/ChapterSection';
import PaymentSection from '../components/PaymentSection';
import FAQSection from '../components/FAQSection';
import ReviewsSection from '../components/ReviewsSection';
import WhatsAppSection from '../components/WhatsAppSection';
import FooterSection from '../components/FooterSection';

interface LandingRendererProps {
  courseId?: string | number;
  courseSlug?: string;
  isEditable?: boolean;
  onSubscribe?: () => Promise<void> | void;
  isSubscribing?: boolean;
  selectedPaymentMethod?: any;
  setSelectedPaymentMethod?: (pm: any) => void;
  isPaymentModalOpen?: boolean;
  setIsPaymentModalOpen?: (open: boolean) => void;
}

export default function LandingRenderer({
  courseId,
  courseSlug,
  isEditable = false,
  onSubscribe = () => {},
  isSubscribing = false,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isPaymentModalOpen,
  setIsPaymentModalOpen,
}: LandingRendererProps) {
  const { loading, error } = useLandingContent({ courseId, courseSlug });
  
  const content = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const templateName = useLandingStore(state => state.templateName);
  const setActiveSectionId = useLandingStore(state => state.setActiveSectionId);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-700 bg-slate-50/50" dir="rtl">
        جاري تحميل قالب صفحة الهبوط...
      </div>
    );
  }

  if (error || !content || !courseData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-red-500 bg-red-50" dir="rtl">
        {error || 'فشل تحميل بيانات الصفحة'}
      </div>
    );
  }

  // Resolve template theme stylesheet properties
  const theme = getThemeBySlug(templateName || 'template_1');
  const cssVariables = {
    '--theme-primary': theme?.primaryColor || '#7c3aed',
    '--theme-primary-rgb': theme?.primaryRgb || '124, 58, 237',
    '--theme-secondary': theme?.secondaryColor || '#a78bfa',
    '--theme-accent': theme?.accentColor || '#f43f5e',
    '--theme-bg': theme?.backgroundColor || '#ffffff',
    '--theme-text': theme?.textColor || '#1f2937',
    fontFamily: theme?.fontFamily ? `'${theme.fontFamily}', sans-serif` : 'sans-serif',
  } as React.CSSProperties;

  return (
    <div style={cssVariables} className="min-h-screen w-full transition-all duration-300 relative" dir="rtl">
      {/* 1. Hero Section */}
      <HeroSection
        data={content.hero}
        course={courseData}
        templateId={templateName}
        isEditable={isEditable}
        onEdit={() => setActiveSectionId('hero')}
        onSubscribe={onSubscribe}
        isSubscribing={isSubscribing}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        isPaymentModalOpen={isPaymentModalOpen}
        setIsPaymentModalOpen={setIsPaymentModalOpen}
      />

      {/* 2. What You Will Learn Section */}
      <LearningSection
        data={content.learning}
        templateId={templateName}
        isEditable={isEditable}
        onEdit={() => setActiveSectionId('learning')}
      />

      {/* 3. Course Chapters curriculum details */}
      <ChapterSection
        data={content.chapters}
        course={courseData}
        templateId={templateName}
        isEditable={isEditable}
        onEdit={() => setActiveSectionId('chapters')}
      />

      {/* 4. Payment Receiver Accounts */}
      <PaymentSection
        data={content.payment}
        course={courseData}
        templateId={templateName}
        isEditable={isEditable}
        onEdit={() => setActiveSectionId('payment')}
      />

      {/* 5. FAQ Section */}
      <FAQSection
        data={content.faq}
        templateId={templateName}
        isEditable={isEditable}
        onEdit={() => setActiveSectionId('faq')}
      />

      {/* 5b. Reviews Section */}
      <ReviewsSection
        data={content.reviews}
        templateId={templateName}
        isEditable={isEditable}
        onEdit={() => setActiveSectionId('reviews')}
      />

      {/* 6. WhatsApp Section and Widget */}
      <WhatsAppSection
        data={content.whatsapp}
        templateId={templateName}
        isEditable={isEditable}
        onEdit={() => setActiveSectionId('whatsapp')}
      />

      {/* 7. Footer Section */}
      <FooterSection
        data={content.footer}
        templateId={templateName}
        isEditable={isEditable}
        onEdit={() => setActiveSectionId('footer')}
      />
    </div>
  );
}
