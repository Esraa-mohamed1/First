'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStudentCourse, getMySubscriptions } from '@/services/student-courses';
import { Course } from '@/types/api';
import { PaymentMethodModal } from '@/components/payment/PaymentMethodModal';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';
import CourseDetailTemplate from '@/components/course/CourseDetailTemplate';
import { getThemeBySlug } from '@/builder/templates/themeStyles';
import { useModal } from '@/context/ModalContext';


const STATIC_COURSE_FALLBACK = {
  title: "إتقان تطوير واجهات المستخدم بالتصميم الذكي",
  description: "دورة شاملة لتعلم مبادئ التصميم، من البداية وحتى الاحتراف. ستتعلم كيفية بناء واجهات متجاوبة، أنظمة التصميم، وسيكولوجية المستخدم.",
  instructor: "م. أحمد السلمي",
  category: "تصميم",
  price: "599",
  final_price: "299",
  image: "https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200",
  what_to_learn: "",
  units: [
    {
      id: 1,
      title: "القسم الأول: مقدمة في عالم التصميم الرقمي",
      lessons: [
        { id: 101, title: "أهلاً بك في رحلة الإبداع", type: "video", duration: "05:20", isPreview: true },
        { id: 102, title: "تثبيت الأدوات وتجهيز بيئة العمل", type: "video", duration: "12:45" }
      ]
    },
    { id: 2, title: "القسم الثاني: أسس تجربة المستخدم (UX)", isLocked: true, lessons: [] },
    { id: 3, title: "القسم الثالث: نظرية الألوان والخطوط", isLocked: true, lessons: [] }
  ]
};

export default function CourseStudentViewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { openModal } = useModal();

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
  const [showFloatingWidget, setShowFloatingWidget] = useState(true);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template_1');
  const [navbarNode, setNavbarNode] = useState<any | null>(null);
  const [footerNode, setFooterNode] = useState<any | null>(null);
  const [isRetrying, setIsRetrying] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('retry') === 'true';
    }
    return false;
  });

  const loadCourseDetails = useCallback(async () => {
    try {
      const [data, subscriptions] = await Promise.all([
        getStudentCourse(slug),
        getMySubscriptions().catch(() => []),
      ]);

      const courseSubscription = subscriptions.find((sub: any) => String(sub.course_id) === String(data.id));
      const subStatus = courseSubscription ? courseSubscription.status : null;
      
      // Use real API data with fallback to static if missing
      let learningPoints: string[] = [];
      
      // Try from infos first (new structure)
      if (data.infos && Array.isArray(data.infos)) {
        learningPoints = data.infos
          .filter((info: any) => info.key === 'what_you_will_learn' || info.key === 'what_you_learn' || info.info_key === 'what_you_will_learn' || info.info_key === 'what_you_learn')
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .map((info: any) => info.value || info.info_value);
      }

      // Fallback to what_you_will_learn string if infos didn't have any
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
          console.error('Failed to parse what_you_will_learn', e);
          if (data.what_you_will_learn) learningPoints = [data.what_you_will_learn];
          else if (data.what_you_learn) learningPoints = [data.what_you_learn];
        }
      }

      // Parse custom sections from infos dynamically
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
      } else {
        // Fallback to learningPoints (what_you_will_learn)
        if (learningPoints.length > 0) {
          infoSections = [{ id: 'what_you_will_learn', title: 'ماذا ستتعلم؟', items: learningPoints }];
        }
      }

      // Handle possible receiver accounts response keys
      const rawPaymentMethods = data.payment_methods || data.receiverAccounts || data.receiver_accounts || [];
      const paymentMethodsData = rawPaymentMethods.map((item: any) => ({
        methodId: (item.methodId || item.method_id || item.id)?.toString() || '',
        methodName: item.name || item.methodName || '',
        type: 'account_number' as const,
        value: item.value || item.accountValue || item.account_value || '',
        currency: item.currency || 'SAR',
        logo: item.logo || undefined
      }));

      const mergedCourse = {
        id: data.id,
        title: data.title,
        description: data.description,
        instructor: typeof data.instructor === 'object' && data.instructor !== null ? (data.instructor as any).name : (data.instructor || 'Unknown Instructor'),
        category: (data as any).category?.name || 'General',
        price: data.price,
        final_price: data.final_price,
        currency: data.currency || 'SAR',
        price_type: data.price_type || (Number(data.price || 0) === 0 ? 'free' : 'paid'),
        image: data.image,
        units: data.units || (data as any).chapters || [],
        learning_points: learningPoints,
        info_sections: infoSections,
        is_subscribed: (data as any).is_enrolled || (data as any).enrollment_status === 'active' || (data as any).enrollment_status === 'accepted' || subStatus === 'active' || subStatus === 'accepted' || false,
        subscription_status: subStatus || (data as any).enrollment_status,
        rejection_reason: (data as any).rejection_reason || (courseSubscription ? (courseSubscription.message || courseSubscription.rejection_reason || courseSubscription.rejectionReason) : '') || '',
        payment_methods: paymentMethodsData,
      };

      setCourse(mergedCourse);
      if (mergedCourse.units && mergedCourse.units.length > 0) {
        setExpandedUnits([mergedCourse.units[0].id]);
      }

      // Resolve course template from local storage or API info
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
      console.warn('Course not found, showing mock data for preview:', error);
      setCourse({ 
        ...STATIC_COURSE_FALLBACK, 
        slug: slug, 
        currency: 'SAR', 
        price_type: 'paid', 
        payment_methods: [],
        subscription_status: null,
        info_sections: [{ id: 'what_you_will_learn', title: 'ماذا ستتعلم؟', items: [
          "بناء أنظمة التصميم (Design Systems) القابلة للتوسع بشكل احترافي.",
          "فهم سيكولوجية المستخدم وتطبيق مبادئ UX in قراراتك التصميمية.",
          "إتقان التصميم المتجاوب للهواتف والويب باستخدام أحدث أدوات Figma.",
          "تحويل التصاميم إلى بروتوتايب تفاعلي يحاكي الواقع تماماً."
        ] }]
      });
      setExpandedUnits([1]);
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

    if (typeof window !== 'undefined') {
      window.addEventListener('student-registered', handleAuthSuccess);
      window.addEventListener('student-logged-in', handleAuthSuccess);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('student-registered', handleAuthSuccess);
        window.removeEventListener('student-logged-in', handleAuthSuccess);
      }
    };
  }, [loadCourseDetails]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const handleSubscribe = () => {
    if (!course) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      openModal('registration');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const [showLandingPage, setShowLandingPage] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const isLP = searchParams.get('lp') === 'true' || searchParams.get('lp_id') || searchParams.get('marketing') === 'true';
      setShowLandingPage(!!isLP);
    }
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-900">جاري التحميل...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-900">لم يتم العثور على الدورة</div>;

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
      {/* Main Course Content */}
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
        />
      )}
    </div>
  );
}
