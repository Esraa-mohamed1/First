'use client';

import React, { useState, useEffect } from 'react';
import { getAcademicHtml } from './academicHtml';
import { getCourses } from '@/services/courses';
import { getStudentCourses } from '@/services/student-courses';
import { getBags } from '@/services/bags';
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
  bags: {
    title: 'الحقائب التعليمية والملفات الرقمية',
    subtitle: 'ملازم ومذكرات دراسية شاملة جاهزة للتحميل والاستفادة المباشرة',
    items: [],
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
    text: ' جميع الحقوق محفوظة.',
    backgroundColor: '#ffffff',
    textColor: '#1b1b24',
    newsletterTitle: 'اشترك في نشرتنا البريدية المعرفية',
    newsletterDesc: 'احصل على أحدث المقالات التحليلية، والمناهج الجديدة، والماستركلاسز الحصرية مباشرة في بريدك الإلكتروني أسبوعياً.',
    newsletterBtnText: 'اشترك الآن',
  },
};

function parseProps(p: any): any {
  if (!p) return {};
  if (typeof p === 'object') return p;
  if (typeof p === 'string') {
    try {
      return JSON.parse(p);
    } catch (e) {
      return {};
    }
  }
  return {};
}

function parseItems(items: any): any[] {
  if (!items) return [];
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch (e) {
      return [];
    }
  }
  return Array.isArray(items) ? items : [];
}

function parseSectionsToContent(nodes: any[], fallback: typeof DEFAULT_CONTENT, realCourses: any[] = [], realBags: any[] = [], isEditing: boolean = false) {
  const hasApiData = Array.isArray(nodes) && nodes.length > 0;

  if (!hasApiData) {
    return {
      navbar: fallback.navbar,
      hero: fallback.hero,
      about: fallback.about,
      features: fallback.features,
      courses: { ...fallback.courses, items: realCourses.length > 0 ? realCourses : fallback.courses.items },
      bags: { ...fallback.bags, items: realBags.length > 0 ? realBags : fallback.bags.items },
      stats: fallback.stats,
      pricing: fallback.pricing,
      faq: fallback.faq,
      contact: fallback.contact,
      footer: fallback.footer,
    };
  }

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

  // Navbar
  let navbar: any = null;
  if (navbarNode) {
    const np = parseProps(navbarNode.props);
    const linksList = parseItems(np.links || navbarNode.items);
    navbar = {
      ...np,
      title: np.title ?? np.name ?? fallback.navbar.title,
      logo: np.logo ?? fallback.navbar.logo,
      bgColor: np.bgColor ?? np.bg_color ?? np.background_color ?? fallback.navbar.bgColor,
      textColor: np.textColor ?? np.text_color ?? fallback.navbar.textColor,
      loginText: np.loginText ?? np.login_text ?? fallback.navbar.loginText,
      loginLink: np.loginLink ?? np.login_link ?? fallback.navbar.loginLink,
      loginBgColor: np.loginBgColor ?? np.login_bg_color ?? np.loginBg ?? np.login_bg ?? '',
      loginTextColor: np.loginTextColor ?? np.login_text_color ?? np.loginColor ?? np.login_color ?? '',
      registerText: np.registerText ?? np.register_text ?? fallback.navbar.registerText,
      registerLink: np.registerLink ?? np.register_link ?? fallback.navbar.registerLink,
      registerBgColor: np.registerBgColor ?? np.register_bg_color ?? np.registerBg ?? np.register_bg ?? '',
      registerTextColor: np.registerTextColor ?? np.register_text_color ?? np.registerColor ?? np.register_color ?? '',
      links: linksList.length > 0 ? linksList : fallback.navbar.links,
    };
  } else {
    navbar = fallback.navbar;
  }

  // Hero
  let hero: any = null;
  if (heroNode) {
    const hp = parseProps(heroNode.props);
    hero = {
      ...hp,
      title: hp.title ?? fallback.hero.title,
      subtitle: hp.subtitle ?? fallback.hero.subtitle,
      description: hp.description ?? fallback.hero.description,
      buttonText: hp.buttonText ?? hp.button_text ?? fallback.hero.buttonText,
      buttonLink: hp.buttonLink ?? hp.button_link ?? fallback.hero.buttonLink,
      buttonBg: hp.buttonBg ?? hp.button_bg ?? hp.button_background_color ?? hp.buttonBgColor ?? '',
      buttonTextColor: hp.buttonTextColor ?? hp.button_text_color ?? hp.buttonColor ?? '',
      secondaryButtonText: hp.secondaryButtonText ?? hp.secondary_button_text ?? hp.demoButtonText ?? hp.demo_button_text ?? fallback.hero.secondaryButtonText,
      secondaryButtonLink: hp.secondaryButtonLink ?? hp.secondary_button_link ?? hp.demoButtonLink ?? hp.demo_button_link ?? fallback.hero.secondaryButtonLink,
      secondaryButtonBg: hp.secondaryButtonBg ?? hp.secondary_button_bg ?? hp.secondary_button_background_color ?? '',
      secondaryButtonTextColor: hp.secondaryButtonTextColor ?? hp.secondary_button_text_color ?? hp.secondary_button_color ?? '',
      image: hp.image ?? hp.img ?? hp.video ?? fallback.hero.image,
      backgroundColor: hp.backgroundColor ?? hp.background_color ?? hp.bg_color ?? fallback.hero.backgroundColor,
      textColor: hp.textColor ?? hp.text_color ?? fallback.hero.textColor,
    };
  }

  // About
  let about: any = null;
  if (aboutNode) {
    const ap = parseProps(aboutNode.props);
    about = {
      ...ap,
      title: ap.title ?? '',
      subtitle: ap.subtitle ?? '',
      image: ap.image ?? ap.img ?? ap.video ?? '',
      backgroundColor: ap.backgroundColor ?? ap.background_color ?? ap.bg_color ?? '#ffffff',
      textColor: ap.textColor ?? ap.text_color ?? '#1b1b24',
      videoTag: ap.videoTag ?? ap.video_tag ?? '',
      videoTitle: ap.videoTitle ?? ap.video_title ?? '',
      videoDesc: ap.videoDesc ?? ap.video_desc ?? '',
      videoLink: ap.videoLink ?? ap.video_link ?? ap.videoImage ?? ap.video_image ?? '',
      videoBg: ap.videoBg ?? ap.video_bg ?? ap.videoBackgroundColor ?? ap.video_background_color ?? '',
      videoTextColor: ap.videoTextColor ?? ap.video_text_color ?? '',
      analyticsTitle: ap.analyticsTitle ?? ap.analytics_title ?? ap.visionTitle ?? ap.vision_title ?? '',
      analyticsBars: parseItems(ap.analyticsBars ?? ap.analytics_bars ?? [40, 65, 85, 50, 95]),
      analyticsColor: ap.analyticsColor ?? ap.analytics_color ?? '#3525cd',
    };
  }

  // Features
  let features: any = null;
  if (featuresNode) {
    const fp = parseProps(featuresNode.props);
    const rawItems = parseItems(fp.items || featuresNode.items);
    const items = rawItems.map((it: any) => {
      const p = parseProps(it?.props || it);
      return {
        icon: p.icon || it?.icon || 'star',
        title: p.title || it?.title || '',
        description: p.description || it?.description || '',
      };
    });
    features = {
      ...fp,
      title: fp.title ?? '',
      subtitle: fp.subtitle ?? '',
      items: items,
      backgroundColor: fp.backgroundColor ?? fp.background_color ?? fp.bg_color ?? '#f5f2ff',
      textColor: fp.textColor ?? fp.text_color ?? '#1b1b24',
    };
  }

  // Courses
  let courses: any = null;
  if (courseNode || realCourses.length > 0) {
    const cp = courseNode ? parseProps(courseNode.props) : {};
    const coursesList = realCourses;
    courses = {
      ...cp,
      title: cp.title ?? fallback.courses.title,
      subtitle: cp.subtitle ?? fallback.courses.subtitle,
      items: coursesList,
      limit: cp.limit || 6,
      showPrice: cp.showPrice ?? cp.show_price ?? true,
      showStudentsCount: cp.showStudentsCount ?? cp.show_students_count ?? true,
      buttonBg: cp.buttonBg ?? cp.button_bg ?? '#3525cd',
      cardBg: cp.cardBg ?? cp.card_bg ?? '#ffffff',
      titleColor: cp.titleColor ?? cp.title_color ?? '#1b1b24',
      gridCols: cp.gridCols ?? cp.grid_cols ?? '3',
      backgroundColor: cp.backgroundColor ?? cp.background_color ?? '#ffffff',
      textColor: cp.textColor ?? cp.text_color ?? '#1b1b24',
    };
  }

  // Bags
  const bagsNode = nodes.find(n => n.type === 'bags' || n.type === 'bags-cards' || n.type === 'educational-bags');
  let bags: any = null;
  if (bagsNode || (realBags && realBags.length > 0)) {
    const bp = bagsNode ? parseProps(bagsNode.props) : {};
    bags = {
      ...bp,
      title: bp.title ?? 'الحقائب التعليمية والملفات الرقمية',
      subtitle: bp.subtitle ?? 'ملازم ومذكرات دراسية شاملة جاهزة للتحميل والاستفادة المباشرة',
      items: realBags,
    };
  }

  // Stats
  let stats: any = null;
  if (statsNode) {
    const sp = parseProps(statsNode.props);
    const rawItems = parseItems(sp.items || sp.cards || statsNode.items);
    const items = rawItems.map((it: any) => {
      const p = parseProps(it?.props || it);
      return {
        value: p.value || it?.value || '',
        label: p.label || it?.label || p.title || it?.title || '',
      };
    });
    stats = {
      ...sp,
      items: items,
      backgroundColor: sp.backgroundColor ?? sp.background_color ?? sp.bg_color ?? '',
      textColor: sp.textColor ?? sp.text_color ?? '',
    };
  }

  // Pricing
  let pricing: any = null;
  if (pricingNode) {
    const pp = parseProps(pricingNode.props);
    const rawItems = parseItems(pp.items || pricingNode.items);
    const items = rawItems.map((it: any) => {
      const p = parseProps(it?.props || it);
      return {
        title: p.title || it?.title || '',
        price: p.price || it?.price || '',
        features: Array.isArray(p.features || it?.features) ? (p.features || it?.features) : [],
      };
    });
    pricing = {
      ...pp,
      title: pp.title ?? '',
      subtitle: pp.subtitle ?? '',
      items: items,
      backgroundColor: pp.backgroundColor ?? pp.background_color ?? pp.bg_color ?? '#fcf8ff',
      textColor: pp.textColor ?? pp.text_color ?? '#1b1b24',
      testimonialsTitle: pp.testimonialsTitle ?? pp.testimonials_title ?? '',
      testimonialsSubtitle: pp.testimonialsSubtitle ?? pp.testimonials_subtitle ?? '',
      testimonial1Text: pp.testimonial1Text ?? pp.testimonial1_text ?? '',
      testimonial1Author: pp.testimonial1Author ?? pp.testimonial1_author ?? '',
      testimonial1Role: pp.testimonial1Role ?? pp.testimonial1_role ?? '',
      testimonial2Text: pp.testimonial2Text ?? pp.testimonial2_text ?? '',
      testimonial2Author: pp.testimonial2Author ?? pp.testimonial2_author ?? '',
      testimonial2Role: pp.testimonial2Role ?? pp.testimonial2_role ?? '',
      testimonial3Text: pp.testimonial3Text ?? pp.testimonial3_text ?? '',
      testimonial3Author: pp.testimonial3Author ?? pp.testimonial3_author ?? '',
      testimonial3Role: pp.testimonial3Role ?? pp.testimonial3_role ?? '',
    };
  }

  // FAQ
  let faq: any = null;
  if (faqNode) {
    const fp = parseProps(faqNode.props);
    const rawItems = parseItems(fp.items || faqNode.items);
    const items = rawItems.map((it: any) => {
      const p = parseProps(it?.props || it);
      return {
        question: p.question || it?.question || '',
        answer: p.answer || it?.answer || '',
      };
    });
    faq = {
      ...fp,
      title: fp.title ?? '',
      items: items,
      backgroundColor: fp.backgroundColor ?? fp.background_color ?? fp.bg_color ?? '',
      textColor: fp.textColor ?? fp.text_color ?? '',
    };
  }

  // Contact
  let contact: any = null;
  if (contactNode) {
    const cp = parseProps(contactNode.props);
    contact = {
      ...cp,
      title: cp.title ?? '',
      description: cp.description ?? '',
      phoneNumber: cp.phoneNumber ?? cp.phone_number ?? '',
      buttonText: cp.buttonText ?? cp.button_text ?? 'ابدأ الآن',
      buttonBg: cp.buttonBg ?? cp.button_bg ?? cp.button_background_color ?? '',
      buttonTextColor: cp.buttonTextColor ?? cp.button_text_color ?? cp.button_color ?? '',
      secondaryButtonText: cp.secondaryButtonText ?? cp.secondary_button_text ?? cp.demoButtonText ?? cp.demo_button_text ?? '',
      secondaryButtonLink: cp.secondaryButtonLink ?? cp.secondary_button_link ?? cp.demoButtonLink ?? cp.demo_button_link ?? '',
      secondaryButtonBg: cp.secondaryButtonBg ?? cp.secondary_button_bg ?? cp.secondary_button_background_color ?? '',
      secondaryButtonTextColor: cp.secondaryButtonTextColor ?? cp.secondary_button_text_color ?? cp.secondary_button_color ?? '',
      backgroundColor: cp.backgroundColor ?? cp.background_color ?? cp.bg_color ?? '',
      textColor: cp.textColor ?? cp.text_color ?? '',
    };
  }

  // Footer
  let footer: any = null;
  if (footerNode) {
    const fp = parseProps(footerNode.props);
    footer = {
      ...fp,
      text: fp.text ?? fallback.footer.text,
      backgroundColor: fp.backgroundColor ?? fp.background_color ?? fp.bg_color ?? '#ffffff',
      textColor: fp.textColor ?? fp.text_color ?? '#1b1b24',
      newsletterTitle: fp.newsletterTitle ?? fp.newsletter_title ?? '',
      newsletterDesc: fp.newsletterDesc ?? fp.newsletter_desc ?? '',
      newsletterBtnText: fp.newsletterBtnText ?? fp.newsletter_btn_text ?? '',
    };
  } else {
    footer = fallback.footer;
  }

  return {
    navbar,
    hero,
    about,
    features,
    courses,
    bags,
    stats,
    pricing,
    faq,
    contact,
    footer,
  };
}

import { getStoredAuthToken, getDashboardUrl } from '@/lib/auth-storage';
import { getMyAcademyProfile } from '@/services/student-auth';

export default function AcademicTemplate({ sections: sectionsProp }: AcademicTemplateProps) {
  const [content, setContent] = useState<any>(null);
  const [realCourses, setRealCourses] = useState<any[]>([]);
  const [realBags, setRealBags] = useState<any[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [dashboardUrl, setDashboardUrl] = useState<string>('/student');
  const { isEditing } = useBuilderStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getStoredAuthToken();
      setIsLoggedIn(Boolean(token));
      setDashboardUrl(getDashboardUrl());
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchAcademyProfile() {
      try {
        const data = await getMyAcademyProfile();
        if (isMounted && data) {
          setTeacherProfile(data);
        }
      } catch (err) {
        console.error('[AcademicTemplate] Failed to fetch academy profile:', err);
      }
    }
    fetchAcademyProfile();
    return () => {
      isMounted = false;
    };
  }, []);

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
    let isMounted = true;
    async function fetchBags() {
      try {
        const data = await getBags();
        if (isMounted && data && Array.isArray(data)) {
          setRealBags(data);
        }
      } catch (err) {
        console.error('[AcademicTemplate] Failed to fetch bags:', err);
      }
    }
    fetchBags();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fallback = DEFAULT_CONTENT;
    const nodes = sectionsProp && sectionsProp.length > 0 ? sectionsProp : [];
    const parsed = parseSectionsToContent(nodes, fallback, realCourses, realBags, isEditing);
    setContent(parsed);
  }, [sectionsProp, realCourses, realBags, isEditing]);

  if (!content) return null;

  return (
    <div className="w-full min-h-screen">
      <iframe
        srcDoc={getAcademicHtml(content, isEditing, isLoggedIn, dashboardUrl, teacherProfile)}
        className="w-full min-h-screen border-none"
        style={{ width: '100%', minHeight: '100vh', border: 'none' }}
        title="Academic Template"
      />
    </div>
  );
}
