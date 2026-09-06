'use client';

import React, { useState, useEffect } from 'react';
import { getAcademicHtml } from './academicHtml';
import { getCourses } from '@/services/courses';
import { getStudentCourses } from '@/services/student-courses';
import { useBuilderStore } from '../../store/builderStore';

interface AcademicTemplateProps {
  sections?: any[];
}

const DEFAULT_CONTENT = {
  navbar: {
    title: 'إديوكور',
    logo: '',
    bgColor: '#ffffff',
    textColor: '#3525cd',
    links: [
      { label: 'الرئيسية', href: '/' },
      { label: 'الدورات', href: '/courses' },
      { label: 'الحقائب', href: '/bags' },
      { label: 'حول', href: '/#about' },
    ],
    loginText: 'تسجيل الدخول',
    loginLink: '/auth/login',
    registerText: 'ابدأ الآن',
    registerLink: '/auth/register',
  },
  hero: {
    title: 'بناء تجربة أكاديمية أكثر ذكاءً.',
    subtitle: 'حل مؤسسي متقدم',
    description: 'اربط الطلاب، والمعلمين، والإداريين على منصة مؤسسية موحدة مصممة لتحقيق التميز القابل للقياس وسير العمل المبسط بكفاءة عالية.',
    buttonText: 'استكشف المنصة',
    buttonLink: '#',
    secondaryButtonText: 'طلب عرض توضيحي',
    secondaryButtonLink: '#contact',
    image: 'https://tse4.mm.bing.net/th/id/OIP.CGEfBMBIYoz4Syk_3B8DawHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    backgroundColor: '#fcf8ff',
    textColor: '#1b1b24',
  },
  about: {
    title: 'تحليلات ذكية لاتخاذ قرارات أفضل',
    subtitle: 'راقب الأداء الأكاديمي، وحدد الاتجاهات، وقم بتحسين المخرجات التعليمية من خلال لوحات تحكم تحليلية متقدمة توفر رؤى في الوقت الفعلي.',
    image: '',
    backgroundColor: '#ffffff',
    textColor: '#1b1b24',
    videoTag: 'شاهد وتعلّم',
    videoTitle: 'تعرف على فلسفتنا التعليمية في ٣ دقائق',
    videoDesc: 'نقدم لك جولة سريعة داخل منصتنا التعليمية. نوضح فيها طريقة تتبع الدروس المتقدمة، والتفاعل مع المرشدين، والوصول لأوراق العمل والامتحانات الذكية.',
    videoLink: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
    analyticsTitle: 'رؤية الأداء المؤسسي',
    analyticsBars: [40, 65, 85, 50, 95],
    analyticsColor: '#3525cd',
  },
  features: {
    title: 'نظام بيئي أكاديمي متكامل',
    subtitle: 'مجموعة شاملة ومتطورة من الأدوات لإدارة كل جانب من جوانب رحلة التعلم المؤسسية.',
    items: [
      { icon: 'groups', title: 'مركز الطلاب الشامل', description: 'تمكين المتعلمين بلوحات تحكم مخصصة، وتتبع دقيق للتقدم، وأدوات تواصل تعاونية سلسة لبيئة تعليمية محفزة.' },
      { icon: 'assignment_ind', title: 'بوابة المعلمين', description: 'تبسيط تخطيط الدروس، وإدارة الدرجات، وتعزيز تفاعل الطلاب بأدوات متقدمة.' },
      { icon: 'quiz', title: 'محرك التقييم', description: 'اختبارات آمنة وقابلة للتطوير مع تصحيح آلي وتحليلات أداء مفصلة ودقيقة.' },
      { icon: 'insights', title: 'المخرجات والنتائج', description: 'تقارير مؤسسية شاملة لتتبع الفعالية الأكاديمية وإتقان الطلاب للمهارات المطلوبة.' },
    ],
    backgroundColor: '#f5f2ff',
    textColor: '#1b1b24',
  },
  courses: {
    title: 'أحدث الدورات والبرامج الأكاديمية',
    subtitle: 'استكشف مساراتنا التدريبية المتخصصة لتطوير مهاراتك والارتقاء بمسيرتك المهنية.',
    items: [],
    limit: 6,
    showPrice: true,
    showStudentsCount: true,
    buttonBg: '#3525cd',
    cardBg: '#ffffff',
    titleColor: '#1b1b24',
    gridCols: '3',
    backgroundColor: '#ffffff',
    textColor: '#1b1b24',
  },
  stats: {
    items: [
      { value: '98%', label: 'نسبة رضا الطلاب' },
      { value: '150+', label: 'مناهج شاملة' },
      { value: '12k+', label: 'خريج متميز' },
      { value: '24/7', label: 'دعم أكاديمي مباشر' }
    ],
    backgroundColor: '',
    textColor: '',
  },
  pricing: {
    title: 'المخرجات والنتائج الإحصائية',
    subtitle: 'معدلات تقدم وتحليلات رقمية للفصول الدراسية',
    items: [
      { title: 'طلاب نشطون', price: '12.4k', features: ['بوابات تفاعلية', 'تتبع التقدم'] },
      { title: 'دورات مدارة', price: '320', features: ['فصول مسجلة', 'محاضرات بث مباشر'] },
      { title: 'معدل الإنجاز', price: '87%', features: ['نسبة إتمام مرتفعة', 'التزام أكاديمي'] },
    ],
    backgroundColor: '#fcf8ff',
    textColor: '#1b1b24',
    testimonialsTitle: 'ماذا يقول شركاؤنا وطلابنا؟',
    testimonialsSubtitle: 'قصص نجاح ملهمة وتجارب واقعية يعبر عنها شركاؤنا الأكاديميون وطلابنا المتميزون.',
    testimonial1Text: 'سهولة إدارة المحتوى التعليمي والتحليلات الدقيقة المتاحة مكنتنا كإدارة من تتبع الأداء وتحسين المخرجات التعليمية بشكل ملموس وسريع.',
    testimonial1Author: 'أ.د. محمد الشمري',
    testimonial1Role: 'عميد القبول والتسجيل',
    testimonial2Text: 'سهولة التصفح، والوصول الفوري للمقررات والامتحانات التفاعلية، أتاح لي تنظيم وقتي والمذاكرة بذكاء وبدون تشتت تماماً.',
    testimonial2Author: 'رنا عبدالله',
    testimonial2Role: 'طالبة هندسة برمجيات',
    testimonial3Text: 'كأستاذ، مكنتني بوابة المعلم من متابعة الواجبات وإعطاء تقييمات تفصيلية فورية لكل طالب وطالبة بسهولة مطلقة ووقت قياسي.',
    testimonial3Author: 'م. عاصم العتيبي',
    testimonial3Role: 'عضو هيئة التدريس',
  },
  faq: {
    title: 'الأسئلة الشائعة حول إديوكور',
    items: [
      { question: 'هل الحصص البث المباشر مسجلة؟', answer: 'نعم، يتم تسجيل جميع اللقاءات المباشرة ورفعها للمنصة لتعيد مشاهدتها في أي وقت.' },
      { question: 'كيف يساهم إديوكور في تحسين الأداء الأكاديمي؟', answer: 'يوفر النظام تحليلات شاملة تمكن الإداريين والمعلمين من مراقبة التقدم واتخاذ قرارات فورية مدعومة بالبيانات.' },
    ],
    backgroundColor: '#f5f2ff',
    textColor: '#1b1b24',
  },
  contact: {
    title: 'تواصل معنا',
    description: 'نحن هنا لمساعدتك في التوسع والتفوق الأكاديمي.',
    phoneNumber: '+966500000000',
    buttonText: 'ابدأ الآن',
    secondaryButtonText: 'طلب عرض توضيحي',
    secondaryButtonLink: '#contact',
    backgroundColor: '#3525cd',
    textColor: '#ffffff',
  },
  footer: {
    text: '© 2024 إديوكور الأكاديمية. جميع الحقوق محفوظة.',
    backgroundColor: '#ffffff',
    textColor: '#1b1b24',
    newsletterTitle: 'اشترك في نشرتنا البريدية المعرفية',
    newsletterDesc: 'احصل على أحدث المقالات التحليلية، والمناهج الجديدة، والماستركلاسز الحصرية مباشرة في بريدك الإلكتروني أسبوعياً.',
    newsletterBtnText: 'اشترك الآن',
  },
};

function parseSectionsToContent(nodes: any[], fallback: typeof DEFAULT_CONTENT, realCourses: any[] = [], isEditing: boolean = false) {
  const navbarNode = nodes.find(n => n.type === 'navbar');
  const heroNode = nodes.find(n => n.type === 'hero');
  const aboutNode = nodes.find(n => n.type === 'about');
  const featuresNode = nodes.find(n => n.type === 'features' || n.type === 'features_section');
  const courseNode = nodes.find(n => n.type === 'course-cards' || n.type === 'courses');
  const statsNode = nodes.find(n => n.type === 'stats' || n.type === 'kpi-cards');
  const pricingNode = nodes.find(n => n.type === 'pricing');
  const faqNode = nodes.find(n => n.type === 'faq');
  const contactNode = nodes.find(n => n.type === 'contact');
  const footerNode = nodes.find(n => n.type === 'footer');

  // Priority: realCourses (live API) > section.items (saved DB items) > section.props.courses (legacy)
  const coursesList = realCourses.length > 0
    ? realCourses
    : (Array.isArray(courseNode?.props?.items) && courseNode.props.items.length > 0
        ? courseNode.props.items
        : (courseNode?.props?.courses || []));

  const safeFeatureItems = (items: any) => {
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch (e) {}
    }
    if (!Array.isArray(items) || items.length === 0) return fallback.features.items;
    return items.map((it: any) => {
      const p = it?.props || it || {};
      return {
        icon: p.icon || it?.icon || 'star',
        title: p.title || it?.title || '',
        description: p.description || it?.description || '',
      };
    });
  };

  const safeStatItems = (items: any) => {
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch (e) {}
    }
    if (!Array.isArray(items) || items.length === 0) return fallback.stats.items;
    return items.map((it: any) => {
      const p = it?.props || it || {};
      return {
        value: p.value || it?.value || '',
        label: p.label || it?.label || p.title || it?.title || '',
      };
    });
  };

  const safePricingItems = (items: any) => {
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch (e) {}
    }
    if (!Array.isArray(items) || items.length === 0) return fallback.pricing.items;
    return items;
  };

  const safeFaqItems = (items: any) => {
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch (e) {}
    }
    if (!Array.isArray(items) || items.length === 0) return fallback.faq.items;
    return items;
  };

  return {
    navbar: navbarNode?.props ? {
      ...navbarNode.props,
      title: navbarNode.props.title ?? fallback.navbar.title,
      logo: navbarNode.props.logo ?? fallback.navbar.logo,
      bgColor: navbarNode.props.bgColor ?? navbarNode.props.bg_color ?? fallback.navbar.bgColor,
      textColor: navbarNode.props.textColor ?? navbarNode.props.text_color ?? fallback.navbar.textColor,
      loginText: navbarNode.props.loginText ?? navbarNode.props.login_text ?? fallback.navbar.loginText,
      loginLink: navbarNode.props.loginLink ?? navbarNode.props.login_link ?? fallback.navbar.loginLink,
      registerText: navbarNode.props.registerText ?? navbarNode.props.register_text ?? fallback.navbar.registerText,
      registerLink: navbarNode.props.registerLink ?? navbarNode.props.register_link ?? fallback.navbar.registerLink,
      links: Array.isArray(navbarNode.props.links) && navbarNode.props.links.length > 0 ? navbarNode.props.links : fallback.navbar.links,
    } : fallback.navbar,
    hero: heroNode?.props ? {
      ...heroNode.props,
      title: heroNode.props.title ?? fallback.hero.title,
      subtitle: heroNode.props.subtitle ?? fallback.hero.subtitle,
      description: heroNode.props.description ?? fallback.hero.description,
      buttonText: heroNode.props.buttonText ?? heroNode.props.button_text ?? fallback.hero.buttonText,
      buttonLink: heroNode.props.buttonLink ?? heroNode.props.button_link ?? fallback.hero.buttonLink,
      secondaryButtonText: heroNode.props.secondaryButtonText ?? heroNode.props.secondary_button_text ?? heroNode.props.demoButtonText ?? heroNode.props.demo_button_text ?? fallback.hero.secondaryButtonText,
      secondaryButtonLink: heroNode.props.secondaryButtonLink ?? heroNode.props.secondary_button_link ?? heroNode.props.demoButtonLink ?? heroNode.props.demo_button_link ?? fallback.hero.secondaryButtonLink,
      image: heroNode.props.image ?? heroNode.props.img ?? heroNode.props.video ?? fallback.hero.image,
      backgroundColor: heroNode.props.backgroundColor ?? heroNode.props.background_color ?? heroNode.props.bg_color ?? fallback.hero.backgroundColor,
      textColor: heroNode.props.textColor ?? heroNode.props.text_color ?? fallback.hero.textColor,
    } : fallback.hero,
    about: aboutNode?.props ? {
      ...aboutNode.props,
      title: aboutNode.props.title ?? fallback.about.title,
      subtitle: aboutNode.props.subtitle ?? fallback.about.subtitle,
      image: aboutNode.props.image ?? aboutNode.props.img ?? aboutNode.props.video ?? fallback.about.image,
      backgroundColor: aboutNode.props.backgroundColor ?? aboutNode.props.background_color ?? aboutNode.props.bg_color ?? fallback.about.backgroundColor,
      textColor: aboutNode.props.textColor ?? aboutNode.props.text_color ?? fallback.about.textColor,
      videoTag: aboutNode.props.videoTag ?? aboutNode.props.video_tag ?? fallback.about.videoTag,
      videoTitle: aboutNode.props.videoTitle ?? aboutNode.props.video_title ?? fallback.about.videoTitle,
      videoDesc: aboutNode.props.videoDesc ?? aboutNode.props.video_desc ?? fallback.about.videoDesc,
      videoLink: aboutNode.props.videoLink ?? aboutNode.props.video_link ?? aboutNode.props.videoImage ?? aboutNode.props.video_image ?? fallback.about.videoLink,
      videoBg: aboutNode.props.videoBg ?? aboutNode.props.video_bg ?? aboutNode.props.videoBackgroundColor ?? aboutNode.props.video_background_color ?? fallback.about.videoBg,
      videoTextColor: aboutNode.props.videoTextColor ?? aboutNode.props.video_text_color ?? fallback.about.videoTextColor,
      analyticsTitle: aboutNode.props.analyticsTitle ?? aboutNode.props.analytics_title ?? aboutNode.props.visionTitle ?? aboutNode.props.vision_title ?? fallback.about.analyticsTitle,
      analyticsBars: aboutNode.props.analyticsBars ?? aboutNode.props.analytics_bars ?? fallback.about.analyticsBars,
      analyticsColor: aboutNode.props.analyticsColor ?? aboutNode.props.analytics_color ?? fallback.about.analyticsColor,
    } : fallback.about,
    features: featuresNode?.props ? {
      ...featuresNode.props,
      title: featuresNode.props.title ?? fallback.features.title,
      subtitle: featuresNode.props.subtitle ?? fallback.features.subtitle,
      items: safeFeatureItems(featuresNode.props.items),
      backgroundColor: featuresNode.props.backgroundColor ?? featuresNode.props.background_color ?? featuresNode.props.bg_color ?? fallback.features.backgroundColor,
      textColor: featuresNode.props.textColor ?? featuresNode.props.text_color ?? fallback.features.textColor,
    } : fallback.features,
    courses: {
      ...(courseNode?.props || {}),
      title: courseNode?.props?.title || fallback.courses.title,
      subtitle: courseNode?.props?.subtitle || fallback.courses.subtitle,
      items: coursesList,
      limit: courseNode?.props?.limit || 6,
      showPrice: courseNode?.props?.showPrice ?? courseNode?.props?.show_price ?? true,
      showStudentsCount: courseNode?.props?.showStudentsCount ?? courseNode?.props?.show_students_count ?? true,
      buttonBg: courseNode?.props?.buttonBg ?? courseNode?.props?.button_bg ?? '#3525cd',
      cardBg: courseNode?.props?.cardBg ?? courseNode?.props?.card_bg ?? '#ffffff',
      titleColor: courseNode?.props?.titleColor ?? courseNode?.props?.title_color ?? '#1b1b24',
      gridCols: courseNode?.props?.gridCols ?? courseNode?.props?.grid_cols ?? '3',
      backgroundColor: courseNode?.props?.backgroundColor ?? courseNode?.props?.background_color ?? '#ffffff',
      textColor: courseNode?.props?.textColor ?? courseNode?.props?.text_color ?? '#1b1b24',
    },
    stats: statsNode?.props ? {
      ...statsNode.props,
      items: safeStatItems(statsNode.props.items || statsNode.props.cards),
      backgroundColor: statsNode.props.backgroundColor ?? statsNode.props.background_color ?? statsNode.props.bg_color ?? fallback.stats.backgroundColor,
      textColor: statsNode.props.textColor ?? statsNode.props.text_color ?? fallback.stats.textColor,
    } : fallback.stats,
    pricing: pricingNode?.props ? {
      ...pricingNode.props,
      title: pricingNode.props.title ?? fallback.pricing.title,
      subtitle: pricingNode.props.subtitle ?? fallback.pricing.subtitle,
      items: safePricingItems(pricingNode.props.items),
      backgroundColor: pricingNode.props.backgroundColor ?? pricingNode.props.background_color ?? pricingNode.props.bg_color ?? fallback.pricing.backgroundColor,
      textColor: pricingNode.props.textColor ?? pricingNode.props.text_color ?? fallback.pricing.textColor,
      testimonialsTitle: pricingNode.props.testimonialsTitle ?? pricingNode.props.testimonials_title ?? fallback.pricing.testimonialsTitle,
      testimonialsSubtitle: pricingNode.props.testimonialsSubtitle ?? pricingNode.props.testimonials_subtitle ?? fallback.pricing.testimonialsSubtitle,
      testimonial1Text: pricingNode.props.testimonial1Text ?? pricingNode.props.testimonial1_text ?? fallback.pricing.testimonial1Text,
      testimonial1Author: pricingNode.props.testimonial1Author ?? pricingNode.props.testimonial1_author ?? fallback.pricing.testimonial1Author,
      testimonial1Role: pricingNode.props.testimonial1Role ?? pricingNode.props.testimonial1_role ?? fallback.pricing.testimonial1Role,
      testimonial2Text: pricingNode.props.testimonial2Text ?? pricingNode.props.testimonial2_text ?? fallback.pricing.testimonial2Text,
      testimonial2Author: pricingNode.props.testimonial2Author ?? pricingNode.props.testimonial2_author ?? fallback.pricing.testimonial2Author,
      testimonial2Role: pricingNode.props.testimonial2Role ?? pricingNode.props.testimonial2_role ?? fallback.pricing.testimonial2Role,
      testimonial3Text: pricingNode.props.testimonial3Text ?? pricingNode.props.testimonial3_text ?? fallback.pricing.testimonial3Text,
      testimonial3Author: pricingNode.props.testimonial3Author ?? pricingNode.props.testimonial3_author ?? fallback.pricing.testimonial3Author,
      testimonial3Role: pricingNode.props.testimonial3Role ?? pricingNode.props.testimonial3_role ?? fallback.pricing.testimonial3Role,
    } : fallback.pricing,
    faq: faqNode?.props ? {
      ...faqNode.props,
      title: faqNode.props.title ?? fallback.faq.title,
      items: safeFaqItems(faqNode.props.items),
      backgroundColor: faqNode.props.backgroundColor ?? faqNode.props.background_color ?? fallback.faq.backgroundColor,
      textColor: faqNode.props.textColor ?? faqNode.props.text_color ?? fallback.faq.textColor,
    } : fallback.faq,
    contact: contactNode?.props ? {
      ...contactNode.props,
      title: contactNode.props.title ?? fallback.contact.title,
      description: contactNode.props.description ?? fallback.contact.description,
      phoneNumber: contactNode.props.phoneNumber ?? contactNode.props.phone_number ?? fallback.contact.phoneNumber,
      buttonText: contactNode.props.buttonText ?? contactNode.props.button_text ?? fallback.contact.buttonText,
      secondaryButtonText: contactNode.props.secondaryButtonText ?? contactNode.props.secondary_button_text ?? contactNode.props.demoButtonText ?? contactNode.props.demo_button_text ?? fallback.contact.secondaryButtonText,
      secondaryButtonLink: contactNode.props.secondaryButtonLink ?? contactNode.props.secondary_button_link ?? contactNode.props.demoButtonLink ?? contactNode.props.demo_button_link ?? fallback.contact.secondaryButtonLink,
      backgroundColor: contactNode.props.backgroundColor ?? contactNode.props.background_color ?? contactNode.props.bg_color ?? fallback.contact.backgroundColor,
      textColor: contactNode.props.textColor ?? contactNode.props.text_color ?? fallback.contact.textColor,
    } : fallback.contact,
    footer: footerNode?.props ? {
      ...footerNode.props,
      text: footerNode.props.text ?? fallback.footer.text,
      backgroundColor: footerNode.props.backgroundColor ?? footerNode.props.background_color ?? fallback.footer.backgroundColor,
      textColor: footerNode.props.textColor ?? footerNode.props.text_color ?? fallback.footer.textColor,
      newsletterTitle: footerNode.props.newsletterTitle ?? footerNode.props.newsletter_title ?? fallback.footer.newsletterTitle,
      newsletterDesc: footerNode.props.newsletterDesc ?? footerNode.props.newsletter_desc ?? fallback.footer.newsletterDesc,
      newsletterBtnText: footerNode.props.newsletterBtnText ?? footerNode.props.newsletter_btn_text ?? fallback.footer.newsletterBtnText,
    } : fallback.footer,
  };
}

export default function AcademicTemplate({ sections: sectionsProp }: AcademicTemplateProps) {
  const [content, setContent] = useState<any>(null);
  const [realCourses, setRealCourses] = useState<any[]>([]);
  const { isEditing } = useBuilderStore();

  useEffect(() => {
    let isMounted = true;
    async function fetchCourses() {
      try {
        const data = isEditing ? await getCourses() : await getStudentCourses();
        if (isMounted && data && Array.isArray(data)) {
          setRealCourses(data);
        }
      } catch (err) {
        console.error('[AcademicTemplate] Failed to fetch courses:', err);
      }
    }
    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [isEditing]);

  useEffect(() => {
    const fallback = DEFAULT_CONTENT;
    // Use sections from prop (passed by TenantHomeClient/TemplateRenderer)
    // If none are provided, fall back to DEFAULT_CONTENT
    const nodes = sectionsProp && sectionsProp.length > 0 ? sectionsProp : [];
    const parsed = parseSectionsToContent(nodes, fallback, realCourses, isEditing);
    setContent(parsed);
  }, [sectionsProp, realCourses, isEditing]);

  if (!content) return null;

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        srcDoc={getAcademicHtml(content, isEditing)}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Academic Template"
      />
    </div>
  );
}
