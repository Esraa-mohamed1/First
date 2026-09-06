'use client';

import React, { useState, useEffect } from 'react';
import { getSchoolCoachHtml } from './schoolcoachHtml';
import { getPublicPages, getPublicSections, apiToEditor } from '@/services/pages';
import { getCourses } from '@/services/courses';
import { getStudentCourses } from '@/services/student-courses';
import { useBuilderStore } from '../../store/builderStore';

const TEMPLATE_SLUGS = ['schoolcoach-dashboard', 'template_1', 'template_2', 'template_3', 'template_4'];

interface SchoolCoachTemplateProps {
  sections?: any[];
}

const DEFAULT_CONTENT = {
  navbar: {
    title: 'الأستاذ أحمد محمد',
    logo: '',
    bgColor: '#0a1628',
    textColor: '#ffffff',
    links: [
      { label: 'الرئيسية', href: '/' },
      { label: 'المواد', href: '#features' },
      { label: 'الدورات', href: '#courses' },
      { label: 'عن الأستاذ', href: '#about' },
    ],
    loginText: 'تسجيل الدخول',
    loginLink: '/auth/login',
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
  footer: {
    text: '© ٢٠٢٦ الأستاذ أحمد محمد. جميع الحقوق محفوظة.',
    backgroundColor: '#0a1628',
    textColor: '#ffffff',
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
      videoLink: aboutNode.props.videoLink ?? aboutNode.props.video_link ?? fallback.about.videoLink,
    } : fallback.about,
    features: featuresNode?.props ? {
      ...featuresNode.props,
      title: featuresNode.props.title ?? fallback.features.title,
      subtitle: featuresNode.props.subtitle ?? fallback.features.subtitle,
      items: Array.isArray(featuresNode.props.items) && featuresNode.props.items.length > 0 ? featuresNode.props.items : fallback.features.items,
      backgroundColor: featuresNode.props.backgroundColor ?? featuresNode.props.background_color ?? featuresNode.props.bg_color ?? fallback.features.backgroundColor,
      textColor: featuresNode.props.textColor ?? featuresNode.props.text_color ?? fallback.features.textColor,
    } : fallback.features,
    courses: {
      ...(courseNode?.props || {}),
      title: courseNode?.props?.title || 'أحدث الدورات والمراجعات الدراسية',
      subtitle: courseNode?.props?.subtitle || 'دروس تفاعلية ومراجعات مكثفة للدرجات النهائية',
      items: coursesList,
      limit: courseNode?.props?.limit || 6,
      showPrice: courseNode?.props?.showPrice ?? courseNode?.props?.show_price ?? true,
      showStudentsCount: courseNode?.props?.showStudentsCount ?? courseNode?.props?.show_students_count ?? false,
      buttonBg: courseNode?.props?.buttonBg ?? courseNode?.props?.button_bg ?? '#f0b429',
    },
    pricing: pricingNode?.props ? {
      ...pricingNode.props,
      title: pricingNode.props.title ?? fallback.pricing.title,
      subtitle: pricingNode.props.subtitle ?? fallback.pricing.subtitle,
      items: Array.isArray(pricingNode.props.items) && pricingNode.props.items.length > 0 ? pricingNode.props.items : fallback.pricing.items,
      backgroundColor: pricingNode.props.backgroundColor ?? pricingNode.props.background_color ?? fallback.pricing.backgroundColor,
      textColor: pricingNode.props.textColor ?? pricingNode.props.text_color ?? fallback.pricing.textColor,
    } : fallback.pricing,
    faq: faqNode?.props ? {
      ...faqNode.props,
      title: faqNode.props.title ?? fallback.faq.title,
      items: Array.isArray(faqNode.props.items) && faqNode.props.items.length > 0 ? faqNode.props.items : fallback.faq.items,
      backgroundColor: faqNode.props.backgroundColor ?? faqNode.props.background_color ?? fallback.faq.backgroundColor,
      textColor: faqNode.props.textColor ?? faqNode.props.text_color ?? fallback.faq.textColor,
      testimonialsTitle: faqNode.props.testimonialsTitle ?? faqNode.props.testimonials_title ?? fallback.faq.testimonialsTitle,
      testimonialsSubtitle: faqNode.props.testimonialsSubtitle ?? faqNode.props.testimonials_subtitle ?? fallback.faq.testimonialsSubtitle,
    } : fallback.faq,
    contact: contactNode?.props ? {
      ...contactNode.props,
      title: contactNode.props.title ?? fallback.contact.title,
      description: contactNode.props.description ?? fallback.contact.description,
      phoneNumber: contactNode.props.phoneNumber ?? contactNode.props.phone_number ?? fallback.contact.phoneNumber,
      buttonText: contactNode.props.buttonText ?? contactNode.props.button_text ?? fallback.contact.buttonText,
      secondaryButtonText: contactNode.props.secondaryButtonText ?? contactNode.props.secondary_button_text ?? contactNode.props.demoButtonText ?? fallback.contact.secondaryButtonText,
      secondaryButtonLink: contactNode.props.secondaryButtonLink ?? contactNode.props.secondary_button_link ?? contactNode.props.demoButtonLink ?? fallback.contact.secondaryButtonLink,
      backgroundColor: contactNode.props.backgroundColor ?? contactNode.props.background_color ?? fallback.contact.backgroundColor,
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

export default function SchoolCoachTemplate({ sections: sectionsProp }: SchoolCoachTemplateProps) {
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
        console.error('[SchoolCoachTemplate] Failed to fetch courses:', err);
      }
    }
    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [isEditing]);

  useEffect(() => {
    async function load() {
      const fallback = DEFAULT_CONTENT;

      // 1. If sections were passed directly as a prop — use them immediately
      if (sectionsProp && sectionsProp.length > 0) {
        const parsed = parseSectionsToContent(sectionsProp, fallback, realCourses, isEditing);
        setContent(parsed);
        return;
      }

      // 2. Call the public sections endpoint directly
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
            const parsed = parseSectionsToContent(editorNodes, fallback, realCourses, isEditing);
            setContent(parsed);
            return;
          }
        }
      } catch (err) {
        console.error('[SchoolCoachTemplate] Failed to fetch sections from API:', err);
      }

      // 3. Fallback to defaults
      setContent(parseSectionsToContent([], fallback, realCourses, isEditing));
    }

    load();
  }, [sectionsProp, realCourses, isEditing]);

  if (!content) return null;

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        srcDoc={getSchoolCoachHtml(content, isEditing)}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Teacher Template"
      />
    </div>
  );
}
