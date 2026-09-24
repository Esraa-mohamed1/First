'use client';

import React, { useState, useEffect } from 'react';
import { getSchoolCoachHtml, getSchoolCoachNewDesignHtml } from './schoolcoachHtml';
import { getPublicPages, getPublicSections, apiToEditor } from '@/services/pages';
import { getCourses } from '@/services/courses';
import { getStudentCourses } from '@/services/student-courses';
import { getStudentGrades, getStudentSubjects, getGrades, getSubjects } from '@/services/academic-classification';
import { getBags } from '@/services/bags';
import { getMyAcademyProfile } from '@/services/student-auth';
import { useBuilderStore } from '../../store/builderStore';

const TEMPLATE_SLUGS = ['schoolcoach-dashboard', 'template_1', 'template_2', 'template_3', 'template_4'];

interface SchoolCoachTemplateProps {
  sections?: any[];
}

const DEFAULT_CONTENT = {
  navbar: {
    title: 'الأستاذ أحمد محمد',
    teacherName: 'أ/ محمد أحمد',
    teacherTitle: 'مدرس الفيزياء',
    logo: '',
    bgColor: '#0a1628',
    textColor: '#ffffff',
    links: [
      { label: 'الرئيسية', href: '/' },
      { label: 'الحصص', href: '#courses' },
      { label: 'الحقائب', href: '#bags' },
      { label: 'تواصل معنا', href: '#contact' },
    ],
    loginText: 'تسجيل الدخول',
    loginLink: '/auth/login',
    videoIconVisible: true,
    contactIconVisible: true,
    contactModalTitle: 'تواصل مع الفريق',
    contactModalDescription: 'للحجز والاستفسار، يمكنك التواصل مباشرة مع الفريق.',
    whatsappUrl: '',
    phoneNumber: '',
    whatsappButtonLabel: 'واتساب',
    phoneButtonLabel: 'اتصال',
    registerText: 'احجز مكانك',
    registerLink: '/auth/register',
  },
  hero: {
    title: 'تعلم بذكاء. <br/><span class="text-[var(--color-gold-500)]">اضمن تفوقك الدراسي.</span>',
    subtitle: 'معلم الرياضيات القدير',
    description: 'مناهج دراسية مبسطة وأساليب تعليمية حديثة تساعدك على فهم المادة بعمق وتحقيق الدرجة الكاملة في امتحاناتك.',
    buttonText: 'احجز مكانك الآن',
    buttonLink: '#',
    secondaryButtonText: 'اعرف المزيد عنا',
    secondaryButtonLink: '#about',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdn5I4iyCWiaDe9m4F8v8n_X00tPqBgqXH4hbDxxtEpcQGhs3Iv7ye36iLKGCPaYsSeLuQ6Q56ZRbKBk10dy_efgKLS3zHuPJjJmYL6JtPlCiByhhruLtE_z5QnQirZ362M0sgpMps7B8icOJUUVS6t_6GJ1K0xma8arDq0yEal-eRoeAXPmexe9Vlvhif39sPxgQQGgyuqPwrz1R2REpb3TQmQAfrbC-2IMbqMBAUhDDImR-r8q5cEQ',
    backgroundColor: '#0a1628',
    textColor: '#ffffff',
  },
  profile: {
    teacherName: 'أ/ محمد أحمد',
    teacherTitle: 'مدرس الفيزياء',
    description: 'أساعد الطلاب على الفهم العميق، بناء الثقة، وتحقيق نتائج أكاديمية مستمرة عبر شرح مبسط، أسئلة تطبيقية، ومراجعة عملية منتظمة.',
    goal: 'تمكين الطلاب من فهم الرياضيات بثقة وتحويل التحديات إلى نقاط قوة.',
    avatar: '',
    cover: '',
    verified: true,
    verifiedText: 'موثّق',
    ctaPrimaryText: 'ابدأ التعلم',
    ctaPrimaryLink: '#courses',
    ctaSecondaryText: 'شاهد الفيديوهات',
    ctaSecondaryLink: '#videos',
  },
  about: {
    title: 'عن الأستاذ أحمد',
    subtitle: 'خبرة تزيد عن ١٠ سنوات في تدريس مناهج الرياضيات للمرحلة الثانوية.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsvCKkFFgnTqd7h7Fw_WOHLv_-bXegAz36jnJ-dSBDWKiA81BP1TWumr1WnjULNWm_0CcbVBTge22QX2XN-cBPri3M3xbxSbAGqLIcFlI4XbbEacN9CKm1uRjQqkRnAfjumbe4cbh_txOhsTy_-6Eph6WwWNqlfr7j35tkwUU103Z7NEEpLCcfSvulZ4QoKpglkx4KRxtXU9TRhBm3eChxdvC43k04A-fnMk-IjFugUk9FdZ1nyfYQsA',
    backgroundColor: '#ffffff',
    textColor: '#1a1f29',
    videoTag: 'شاهد وتعلّم',
    videoTitle: 'تعرف على فلسفتنا التعليمية في ٣ دقائق',
    videoDesc: 'نقدم لك جولة سريعة داخل منصتنا التعليمية. نوضح فيها طريقة تتبع الدروس المتقدمة، والتفاعل مع المرشدين، والوصول لأوراق العمل والامتحانات الذكية.',
    videoLink: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
  },
  features: {
    title: 'المواد الدراسية',
    subtitle: 'شرح وافٍ وتطبيقات عملية لكل فرع من فروع الرياضيات.',
    items: [
      {
        icon: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
        title: 'الرياضيات البحتة',
        description: 'الجبر، التفاضل والتكامل، وحساب المثلثات للمرحلة الثانوية.',
      },
      {
        icon: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop',
        title: 'الرياضيات التطبيقية',
        description: 'الاستاتيكا والديناميكا لفهم التطبيقات الفيزيائية.',
      },
      {
        icon: 'https://images.unsplash.com/photo-1453733190148-c44698c26588?w=800&auto=format&fit=crop',
        title: 'الإحصاء والاحتمالات',
        description: 'تحليل البيانات والاحتمالات وتطبيقاتها الحيوية.',
      },
      {
        icon: 'https://images.unsplash.com/photo-1635070040807-fbe0f3dbe005cb?w=800&auto=format&fit=crop',
        title: 'القدرات والتحصيلي',
        description: 'دورات مكثفة لاجتياز اختبارات القياس بكفاءة عالية.',
      },
    ],
    backgroundColor: '#eef0f3',
    textColor: '#1a1f29',
  },
  pricing: {
    title: 'المجموعات الدراسية المتاحة',
    subtitle: 'احجز مكانك في إحدى مجموعاتنا التفاعلية المباشرة.',
    items: [
      {
        title: 'مجموعة الصف الثالث الثانوي',
        price: 'متاحة للتسجيل',
        features: ['الأيام: الأحد والثلاثاء', 'الوقت: ٦:٠٠ مساءً', 'نوع الدراسة: أونلاين تفاعلي'],
      },
      {
        title: 'مجموعة الصف الثاني الثانوي',
        price: 'متاحة للتسجيل',
        features: ['الأيام: الإثنين والأربعاء', 'الوقت: ٥:٠٠ مساءً', 'نوع الدراسة: حضور في المركز'],
      },
      {
        title: 'مجموعة التحضير للقدرات',
        price: 'متاحة للتسجيل',
        features: ['الأيام: السبت فقط', 'الوقت: ١٠:٠٠ صباحاً', 'نوع الدراسة: أونلاين مسجل'],
      },
    ],
    backgroundColor: '#ffffff',
    textColor: '#1a1f29',
  },
  faq: {
    title: 'الأسئلة الشائعة حول المنهج',
    items: [
      { question: 'أ.د. محمد الشمري - ولي أمر طالبتين', answer: 'الأستاذ أحمد يبسط الرياضيات بطريقة رائعة.' },
      { question: 'رنا عبدالله - طالبة طب هندسي', answer: 'التمارين والامتحانات المكثفة ساعدتني جداً في التحصيلي والقدرات.' },
      { question: 'م. علي عمر - طالب سابق', answer: 'تأسست في الرياضيات على يد الأستاذ أحمد.' },
    ],
    backgroundColor: '#f7f8fa',
    textColor: '#1a1f29',
    testimonialsTitle: 'ماذا يقول طلابنا وأولياء الأمور؟',
    testimonialsSubtitle: 'تجارب واقعية وقصص نجاح يرويها شركاء النجاح من الطلاب المتميزين وعائلاتهم الداعمة.',
  },
  contact: {
    title: 'ابدأ رحلة تفوقك اليوم',
    description: 'انضم لأكثر من ١٠,٠٠٠ طالب وطالبة حققوا أحلامهم الدراسية معنا.',
    phoneNumber: '201000000000',
    buttonText: 'احجز مكانك الآن',
    secondaryButtonText: 'طلب عرض توضيحي',
    secondaryButtonLink: '#about',
    backgroundColor: '#0a1628',
    textColor: '#ffffff',
  },
  courses: {
    title: 'أحدث الدورات والمراجعات الدراسية',
    subtitle: 'دروس تفاعلية ومراجعات مكثفة للدرجات النهائية',
    items: [],
    limit: 6,
    showPrice: true,
    showStudentsCount: false,
    buttonBg: '#f0b429',
  },
  bags: {
    title: 'الحقائب التعليمية والملفات الرقمية',
    subtitle: 'ملازم ومذكرات دراسية شاملة جاهزة للتحميل والاستفادة',
    items: [],
  },
  footer: {
    text: ' جميع الحقوق محفوظة.',
    backgroundColor: '#0a1628',
    textColor: '#ffffff',
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
      navbar: { title: '', logo: '', bgColor: '#0a1628', textColor: '#ffffff', links: [], loginText: '', loginLink: '', registerText: '', registerLink: '' },
      hero: { title: '', subtitle: '', description: '', buttonText: '', buttonLink: '', secondaryButtonText: '', secondaryButtonLink: '', image: '', backgroundColor: '#0a1628', textColor: '#ffffff' },
      about: { title: '', subtitle: '', image: '', backgroundColor: '#ffffff', textColor: '#1a1f29', videoTag: '', videoTitle: '', videoDesc: '', videoLink: '' },
      features: { title: '', subtitle: '', items: [], backgroundColor: '#eef0f3', textColor: '#1a1f29' },
      courses: { title: '', subtitle: '', items: realCourses.length > 0 ? realCourses : [], limit: 6, showPrice: true, showStudentsCount: true, buttonBg: '#3525cd', cardBg: '#ffffff', titleColor: '#1a1f29', backgroundColor: '#ffffff', textColor: '#1a1f29' },
      stats: { items: [], backgroundColor: '#0a1628', textColor: '#ffffff' },
      gallery: { title: '', subtitle: '', items: [], backgroundColor: '#ffffff', textColor: '#1a1f29' },
      testimonials: { title: '', subtitle: '', items: [], backgroundColor: '#f7f8fa', textColor: '#1a1f29' },
      bags: { title: '', subtitle: '', items: realBags.length > 0 ? realBags : [] },
      pricing: { title: '', subtitle: '', items: [], backgroundColor: '#ffffff', textColor: '#1a1f29' },
      faq: { title: '', items: [], backgroundColor: '#f7f8fa', textColor: '#1a1f29', testimonialsTitle: '', testimonialsSubtitle: '' },
      contact: { title: '', description: '', phoneNumber: '', buttonText: '', secondaryButtonText: '', secondaryButtonLink: '', backgroundColor: '#0a1628', textColor: '#ffffff' },
      footer: { text: '', backgroundColor: '#0a1628', textColor: '#ffffff', newsletterTitle: '', newsletterDesc: '', newsletterBtnText: '' },
    };
  }

  const navbarNode = nodes.find(n => n.type === 'navbar');
  const heroNode = nodes.find(n => n.type === 'hero');
  const aboutNode = nodes.find(n => n.type === 'about');
  const featuresNode = nodes.find(n => n.type === 'features' || n.type === 'features_section');
  const courseNode = nodes.find(n => n.type === 'course-cards' || n.type === 'courses');
  const bagsNode = nodes.find(n => n.type === 'bags' || n.type === 'bags-cards' || n.type === 'educational-bags');
  const galleryNode = nodes.find(n => n.type === 'gallery_section');
  const testimonialsNode = nodes.find(n => n.type === 'testimonials_section');
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
      textColor: ap.textColor ?? ap.text_color ?? '#1a1f29',
      videoTag: ap.videoTag ?? ap.video_tag ?? '',
      videoTitle: ap.videoTitle ?? ap.video_title ?? '',
      videoDesc: ap.videoDesc ?? ap.video_desc ?? '',
      videoLink: ap.videoLink ?? ap.video_link ?? ap.videoImage ?? ap.video_image ?? '',
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
        icon: p.icon || it?.icon || '',
        title: p.title || it?.title || '',
        description: p.description || it?.description || '',
      };
    });
    features = {
      ...fp,
      title: fp.title ?? '',
      subtitle: fp.subtitle ?? '',
      items: items,
      backgroundColor: fp.backgroundColor ?? fp.background_color ?? fp.bg_color ?? '#eef0f3',
      textColor: fp.textColor ?? fp.text_color ?? '#1a1f29',
    };
  }

  // Courses
  let courses: any = null;
  if (courseNode || realCourses.length > 0) {
    const cp = courseNode ? parseProps(courseNode.props) : {};
    courses = {
      ...cp,
      title: cp.title ?? '',
      subtitle: cp.subtitle ?? '',
      items: realCourses,
      limit: cp.limit || 6,
      showPrice: cp.showPrice ?? cp.show_price ?? true,
      showStudentsCount: cp.showStudentsCount ?? cp.show_students_count ?? false,
      buttonBg: cp.buttonBg ?? cp.button_bg ?? '#f0b429',
    };
  }

  // Bags
  let bags: any = null;
  if (bagsNode || realBags.length > 0) {
    const bp = bagsNode ? parseProps(bagsNode.props) : {};
    bags = {
      ...bp,
      title: bp.title ?? fallback.bags?.title ?? '',
      subtitle: bp.subtitle ?? fallback.bags?.subtitle ?? '',
      items: realBags,
    };
  }

  // Gallery
  let gallery: any = null;
  if (galleryNode) {
    const gp = parseProps(galleryNode.props);
    const rawItems = parseItems(gp.items || galleryNode.items);
    const items = rawItems.map((it: any) => {
      const p = parseProps(it?.props || it);
      return {
        image_url: p.image_url || p.image || p.url || '',
        caption: p.caption || it?.caption || '',
      };
    });
    gallery = {
      ...gp,
      title: gp.title ?? '',
      subtitle: gp.subtitle ?? '',
      items,
      backgroundColor: gp.backgroundColor ?? gp.background_color ?? gp.bg_color ?? '#ffffff',
      textColor: gp.textColor ?? gp.text_color ?? '#1a1f29',
    };
  }

  // Testimonials
  let testimonials: any = null;
  if (testimonialsNode) {
    const tp = parseProps(testimonialsNode.props);
    const rawItems = parseItems(tp.items || testimonialsNode.items);
    const items = rawItems.map((it: any) => {
      const p = parseProps(it?.props || it);
      return {
        text: p.quote || p.text || it?.quote || it?.text || '',
        name: p.author || p.name || it?.author || it?.name || '',
        role: p.role || it?.role || '',
      };
    });
    testimonials = {
      ...tp,
      title: tp.title ?? '',
      subtitle: tp.subtitle ?? '',
      items,
      backgroundColor: tp.backgroundColor ?? tp.background_color ?? tp.bg_color ?? '#f7f8fa',
      textColor: tp.textColor ?? tp.text_color ?? '#1a1f29',
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
      backgroundColor: pp.backgroundColor ?? pp.background_color ?? pp.bg_color ?? '#ffffff',
      textColor: pp.textColor ?? pp.text_color ?? '#1a1f29',
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
      backgroundColor: fp.backgroundColor ?? fp.background_color ?? fp.bg_color ?? '#f7f8fa',
      textColor: fp.textColor ?? fp.text_color ?? '#1a1f29',
      testimonialsTitle: fp.testimonialsTitle ?? fp.testimonials_title ?? '',
      testimonialsSubtitle: fp.testimonialsSubtitle ?? fp.testimonials_subtitle ?? '',
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
      buttonText: cp.buttonText ?? cp.button_text ?? 'احجز مكانك الآن',
      secondaryButtonText: cp.secondaryButtonText ?? cp.secondary_button_text ?? cp.demoButtonText ?? '',
      secondaryButtonLink: cp.secondaryButtonLink ?? cp.secondary_button_link ?? cp.demoButtonLink ?? '',
      backgroundColor: cp.backgroundColor ?? cp.background_color ?? cp.bg_color ?? '#0a1628',
      textColor: cp.textColor ?? cp.text_color ?? '#ffffff',
    };
  }

  // Footer
  let footer: any = null;
  if (footerNode) {
    const fp = parseProps(footerNode.props);
    footer = {
      ...fp,
      text: fp.text ?? fallback.footer.text,
      backgroundColor: fp.backgroundColor ?? fp.background_color ?? fp.bg_color ?? '#0a1628',
      textColor: fp.textColor ?? fp.text_color ?? '#ffffff',
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
    gallery,
    testimonials,
    pricing,
    faq,
    contact,
    footer,
  };
}

import { getStoredAuthToken, getDashboardUrl } from '@/lib/auth-storage';
import { useRef } from 'react';

export default function SchoolCoachTemplate({ sections: sectionsProp }: SchoolCoachTemplateProps) {
  const [content, setContent] = useState<any>(null);
  const [realCourses, setRealCourses] = useState<any[]>([]);
  const [realBags, setRealBags] = useState<any[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [dashboardUrl, setDashboardUrl] = useState<string>('/student');
  const { isEditing } = useBuilderStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load grades and subjects independently once
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getStoredAuthToken();
      setIsLoggedIn(Boolean(token));
      setDashboardUrl(getDashboardUrl());

      const loadGradesAndSubjects = async () => {
        let loadedGrades: any[] = [];
        let loadedSubjects: any[] = [];

        if (isEditing) {
          try {
            const g = await getGrades();
            if (g && g.length > 0) {
              loadedGrades = g;
              setGrades(g);
            }
          } catch (err) {
            console.error('[SchoolCoachTemplate] Failed to fetch grades in builder mode:', err);
          }

          try {
            const s = await getSubjects();
            if (s && s.length > 0) {
              loadedSubjects = s;
              setSubjects(s);
            }
          } catch (err) {
            console.error('[SchoolCoachTemplate] Failed to fetch subjects in builder mode:', err);
          }
        } else {
          try {
            const g = await getStudentGrades();
            if (g && g.length > 0) {
              loadedGrades = g;
              setGrades(g);
            }
          } catch (err) {
            console.error('[SchoolCoachTemplate] Failed to fetch student grades:', err);
          }

          try {
            const s = await getStudentSubjects();
            if (s && s.length > 0) {
              loadedSubjects = s;
              setSubjects(s);
            }
          } catch (err) {
            console.error('[SchoolCoachTemplate] Failed to fetch student subjects:', err);
          }
        }

        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({
            type: 'SCHOOLCOACH_UPDATE_DROPDOWNS',
            grades: loadedGrades,
            subjects: loadedSubjects,
          }, '*');
        }
      };

      loadGradesAndSubjects();
    }
  }, [isEditing]);

  // Fetch bags dynamically from API endpoint
  useEffect(() => {
    let isMounted = true;
    async function fetchBags() {
      try {
        const data = await getBags();
        if (isMounted) {
          const bagsList = Array.isArray(data) ? data : [];
          setRealBags(bagsList);
          iframeRef.current?.contentWindow?.postMessage({
            type: 'SCHOOLCOACH_UPDATE_BAGS',
            bags: bagsList
          }, '*');
        }
      } catch (err) {
        console.error('[SchoolCoachTemplate] Failed to fetch bags:', err);
      }
    }
    fetchBags();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch teacher profile details dynamically from endpoint
  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      try {
        const data = await getMyAcademyProfile();
        if (isMounted && data) {
          setTeacherProfile(data);
        }
      } catch (err) {
        console.error('[SchoolCoachTemplate] Failed to fetch teacher profile:', err);
      }
    }
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch courses in background and update iframe smoothly without hard refresh
  useEffect(() => {
    let isMounted = true;
    async function fetchCourses() {
      try {
        const filters: any = {};
        if (selectedGrade) filters.grade_id = selectedGrade;
        if (selectedSubject) filters.subject_id = selectedSubject;

        iframeRef.current?.contentWindow?.postMessage({
          type: 'SCHOOLCOACH_COURSES_LOADING'
        }, '*');

        const data = isEditing
          ? await getCourses(undefined, undefined, undefined, undefined, selectedGrade || undefined, selectedSubject || undefined)
          : await getStudentCourses(filters);

        if (isMounted) {
          const coursesList = Array.isArray(data) ? data : [];
          setRealCourses(coursesList);

          iframeRef.current?.contentWindow?.postMessage({
            type: 'SCHOOLCOACH_UPDATE_COURSES',
            courses: coursesList
          }, '*');
        }
      } catch (err) {
        console.error('[SchoolCoachTemplate] Failed to fetch courses:', err);
        if (isMounted) {
          iframeRef.current?.contentWindow?.postMessage({
            type: 'SCHOOLCOACH_UPDATE_COURSES',
            courses: []
          }, '*');
        }
      }
    }
    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [isEditing, selectedGrade, selectedSubject]);

  // Load template structure
  useEffect(() => {
    async function load() {
      const fallback = {
        navbar: { title: '', teacherName: '', teacherTitle: '', logo: '', bgColor: '#0a1628', textColor: '#ffffff', links: [], loginText: '', loginLink: '', videoIconVisible: true, contactIconVisible: true, contactModalTitle: '', contactModalDescription: '', whatsappUrl: '', phoneNumber: '', whatsappButtonLabel: 'واتساب', phoneButtonLabel: 'اتصال', registerText: '', registerLink: '' },
        hero: { title: '', subtitle: '', description: '', buttonText: '', buttonLink: '', secondaryButtonText: '', secondaryButtonLink: '', image: '', backgroundColor: '#0a1628', textColor: '#ffffff' },
        profile: { teacherName: '', teacherTitle: '', description: '', goal: '', avatar: '', cover: '', verified: true, verifiedText: 'موثّق', ctaPrimaryText: 'ابدأ التعلم', ctaPrimaryLink: '#courses', ctaSecondaryText: 'شاهد الفيديوهات', ctaSecondaryLink: '#videos' },
        about: { title: '', subtitle: '', image: '', backgroundColor: '#ffffff', textColor: '#1a1f29', videoTag: '', videoTitle: '', videoDesc: '', videoLink: '' },
        features: { title: '', subtitle: '', items: [], backgroundColor: '#eef0f3', textColor: '#1a1f29' },
        courses: { title: '', subtitle: '', limit: 6, showPrice: true, showStudentsCount: true, buttonBg: '#3525cd', cardBg: '#ffffff', titleColor: '#1a1f29', backgroundColor: '#ffffff', textColor: '#1a1f29', items: [] },
        stats: { items: [], backgroundColor: '#0a1628', textColor: '#ffffff' },
        gallery: { title: '', subtitle: '', items: [], backgroundColor: '#ffffff', textColor: '#1a1f29' },
        testimonials: { title: '', subtitle: '', items: [], backgroundColor: '#f7f8fa', textColor: '#1a1f29' },
        bags: { title: '', subtitle: '', items: [] },
        pricing: { title: '', subtitle: '', items: [], backgroundColor: '#ffffff', textColor: '#1a1f29' },
        faq: { title: '', items: [], backgroundColor: '#f7f8fa', textColor: '#1a1f29', testimonialsTitle: '', testimonialsSubtitle: '' },
        contact: { title: '', description: '', phoneNumber: '', buttonText: '', secondaryButtonText: '', secondaryButtonLink: '', backgroundColor: '#0a1628', textColor: '#ffffff' },
        footer: { text: '', backgroundColor: '#0a1628', textColor: '#ffffff', newsletterTitle: '', newsletterDesc: '', newsletterBtnText: '' },
      } as typeof DEFAULT_CONTENT;

      if (sectionsProp && sectionsProp.length > 0) {
        const parsed = parseSectionsToContent(sectionsProp, fallback, realCourses, realBags, isEditing);
        setContent(parsed);
        return;
      }

      try {
        const pagesList = await getPublicPages();

        let activePage = pagesList.find(
          (p: any) => p.is_active === 1 || p.is_active === '1' || p.is_active === true || p.is_active === 'true'
        );
        if (!activePage) {
          const templatePages = pagesList.filter((p: any) =>
            TEMPLATE_SLUGS.includes(p.template_name || p.template || p.title)
          );
          activePage = templatePages.sort((a: any, b: any) => Number(b.id || 0) - Number(a.id || 0))[0];
        }
        if (!activePage) {
          activePage = pagesList.find((p: any) => p.slug === 'home' || p.slug?.startsWith('home-')) || pagesList[0];
        }

        if (activePage?.id) {
          const apiSections = await getPublicSections(activePage.id);
          if (apiSections && apiSections.length > 0) {
            const editorNodes = apiToEditor(apiSections);
            const parsed = parseSectionsToContent(editorNodes, fallback, realCourses, realBags, isEditing);
            setContent(parsed);
            return;
          }
        }
      } catch (err) {
        console.error('[SchoolCoachTemplate] Failed to fetch sections from API:', err);
      }

      setContent(parseSectionsToContent([], fallback, realCourses, realBags, isEditing));
    }

    load();
  }, [sectionsProp, isEditing, realCourses, realBags]);

  // Listen to filter events from iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SCHOOLCOACH_FILTER_GRADE') {
        const gradeId = e.data.gradeId || '';
        setSelectedGrade(gradeId);
      } else if (e.data?.type === 'SCHOOLCOACH_FILTER_SUBJECT') {
        const subjectId = e.data.subjectId || '';
        setSelectedSubject(subjectId);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Sync initial dropdowns/courses/bags when iframe loads
  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      if (grades.length > 0 || subjects.length > 0) {
        iframeRef.current.contentWindow.postMessage({
          type: 'SCHOOLCOACH_UPDATE_DROPDOWNS',
          grades,
          subjects,
        }, '*');
      }
      if (realCourses.length > 0) {
        iframeRef.current.contentWindow.postMessage({
          type: 'SCHOOLCOACH_UPDATE_COURSES',
          courses: realCourses,
        }, '*');
      }
      if (realBags.length > 0) {
        iframeRef.current.contentWindow.postMessage({
          type: 'SCHOOLCOACH_UPDATE_BAGS',
          bags: realBags,
        }, '*');
      }
    }
  };

  // Memoize initial HTML
  const initialHtml = React.useMemo(() => {
    if (!content) return '';
    return getSchoolCoachNewDesignHtml(
      content,
      isEditing,
      isLoggedIn,
      dashboardUrl,
      grades,
      subjects,
      '',
      '',
      realCourses,
      realBags,
      teacherProfile
    );
  }, [content, isEditing, isLoggedIn, dashboardUrl, grades, subjects, realCourses, realBags, teacherProfile]);

  if (!content) return null;

  return (
    <div className="w-full min-h-screen">
      <iframe
        ref={iframeRef}
        srcDoc={initialHtml}
        onLoad={handleIframeLoad}
        className="w-full min-h-screen border-none"
        style={{ width: '100%', minHeight: '100vh', border: 'none' }}
        title="Teacher Template"
      />
    </div>
  );
}
