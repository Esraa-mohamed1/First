'use client';

import React, { useState, useEffect } from 'react';
import { getCoachHtml } from './coachHtml';
import { getPublicPages, getPublicSections, apiToEditor } from '@/services/pages';
import { useBuilderStore } from '../../store/builderStore';

const TEMPLATE_SLUGS = ['coach-dashboard', 'template_1', 'template_2', 'template_3', 'template_4'];

interface CoachTemplateProps {
  sections?: any[];
}

const DEFAULT_CONTENT = {
  navbar: {
    title: 'Deep Knowledge',
    logo: '',
    bgColor: '#fbfafc',
    textColor: '#6750a4',
    links: [
      { label: 'الرئيسية', href: '/' },
      { label: 'المرشدون', href: '#features' },
      { label: 'الماستركلاس', href: '#pricing' },
      { label: 'عن الأكاديمية', href: '#about' },
    ],
    loginText: 'تسجيل الدخول',
    loginLink: '/auth/login',
    registerText: 'انضم للنخبة',
    registerLink: '/auth/register',
  },
  hero: {
    title: 'تعمّج في المعرفة. <br/> تعلم من الصفوة.',
    subtitle: 'أكاديمية النخبة',
    description: 'مساحة حصرية مصممة للمفكرين والقادة. استكشف مناهج متقدمة وتواصل مع خبراء عالميين في بيئة دراسية مصممة للتركيز العميق والتميز الأكاديمي.',
    buttonText: 'ابدأ رحلتك',
    buttonLink: '#',
    secondaryButtonText: 'طلب عرض توضيحي',
    secondaryButtonLink: '#about',
    image: '',
    backgroundColor: '#fbfafc',
    textColor: '#1c1a22',
  },
  about: {
    title: 'المرشدون الخبراء',
    subtitle: 'نخبة من الأكاديميين والباحثين يرافقونك في رحلتك المعرفية.',
    image: '',
    backgroundColor: '#ffffff',
    textColor: '#1c1a22',
    videoTag: 'شاهد وتعلّم',
    videoTitle: 'تعرف على فلسفتنا التعليمية في ٣ دقائق',
    videoDesc: 'نقدم لك جولة سريعة داخل منصتنا التعليمية. نوضح فيها طريقة تتبع الدروس المتقدمة، والتفاعل مع المرشدين، والوصول لأوراق العمل والامتحانات الذكية.',
    videoLink: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
  },
  features: {
    title: 'المرشدون الخبراء',
    subtitle: 'نخبة من الأكاديميين والباحثين يرافقونك في رحلتك المعرفية.',
    items: [
      {
        icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6JzKcQHDDohUQuzB8PNfXLDbsl7kf35bgCuG0sQW1h8cNdtvfatA7YI3HqNz6hiRLYcE6oU_P8qcDQyq1S4EDQdGdl3PraTpby8mme9L-kHXgx0kdcdb_pfIEdse9RcYvfBa3_gBCg2QIPqKv9LzEDqHVC0s2nGHMpRBNZve1OBkEhV00ehX4zl5HDvssuq8qkK-Yh14G6Udjd1e6e9VB3D5sX_35J7UvItIiInMbSaBA3ALb7g58eg',
        title: 'د. طارق الحكيم - أستاذ الفلسفة المتقدمة',
        description: 'خبير عالمي في الفلسفة التحليلية والمنطق الرياضي.',
      },
      {
        icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdn5I4iyCWiaDe9m4F8v8n_X00tPqBgqXH4hbDxxtEpcQGhs3Iv7ye36iLKGCPaYsSeLuQ6Q56ZRbKBk10dy_efgKLS3zHuPJjJmYL6JtPlCiByhhruLtE_z5QnQirZ362M0sgpMps7B8icOJUUVS6t_6GJ1K0xma8arDq0yEal-eRoeAXPmexe9Vlvhif39sPxgQQGgyuqPwrz1R2REpb3TQmQAfrbC-2IMbqMBAUhDDImR-r8q5cEQ',
        title: 'د. ليلى المنصور - باحثة في الذكاء المعرفي',
        description: 'رائدة في تقاطع علوم الحاسوب وعلم الأعصاب.',
      },
      {
        icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsvCKkFFgnTqd7h7Fw_WOHLv_-bXegAz36jnJ-dSBDWKiA81BP1TWumr1WnjULNWm_0CcbVBTge22QX2XN-cBPri3M3xbxSbAGqLIcFlI4XbbEacN9CKm1uRjQqkRnAfjumbe4cbh_txOhsTy_-6Eph6WwWNqlfr7j35tkwUU103Z7NEEpLCcfSvulZ4QoKpglkx4KRxtXU9TRhBm3eChxdvC43k04A-fnMk-IjFugUk9FdZ1nyfYQsA',
        title: 'البروفيسور عمر زيدان - خبير الاقتصاد الكلي',
        description: 'مستشار استراتيجي دولي. يحلل الأنظمة الاقتصادية المعقدة.',
      },
    ],
    backgroundColor: '#fbfafc',
    textColor: '#1c1a22',
  },
  stats: {
    items: [
      { value: '98%', label: 'نسبة رضا الطلاب' },
      { value: '150+', label: 'منهج دراسي متكامل' },
      { value: '12k+', label: 'خريج متميز' },
      { value: '24/7', label: 'دعم أكاديمي مباشر' }
    ],
    backgroundColor: '',
    textColor: '',
  },
  pricing: {
    title: 'سلسلة الماستركلاس',
    subtitle: 'محاضرات مكثفة مسجلة بأعلى جودة سينمائية.',
    items: [
      { title: 'بنية التفكير الاستراتيجي', price: 'الحلقة 1', features: ['45 دقيقة'] },
      { title: 'تحليل الأنظمة المعقدة', price: 'الحلقة 2', features: ['52 دقيقة'] },
    ],
    backgroundColor: '#ffffff',
    textColor: '#1c1a22',
    testimonialsTitle: 'ماذا يقول النخبة؟',
    testimonialsSubtitle: 'تجارب حقيقية ورؤى ملهمة من طلابنا وقادتنا الذين غيروا مسارهم الأكاديمي والمهني.',
    testimonial1Text: 'الماستركلاسز والدروس الفلسفية المعمقة أعادت صياغة طريقتي في التفكير واتخاذ القرارات الاستراتيجية. تجربة دراسية استثنائية ونخبوية حقاً.',
    testimonial1Author: 'خالد منصور',
    testimonial1Role: 'مستشار إداري وتطوير أعمال',
    testimonial2Text: 'من أفضل القرارات المعرفية التي اتخذتها. منهجية التدريب والتحليل بالبيانات لا تدع مجالاً للعشوائية أو التخمين.',
    testimonial2Author: 'سارة العلي',
    testimonial2Role: 'رائدة أعمال تكنولوجية',
    testimonial3Text: 'المحتوى الأكاديمي والتحليل العميق وفر لي رؤى لم أجدها في المراجع التقليدية. التوجيه الشخصي مع د. طارق كان فارقاً في مساري العلمي.',
    testimonial3Author: 'أحمد حماد',
    testimonial3Role: 'باحث أكاديمي في الفلسفة',
  },
  faq: {
    title: 'مسارات المناهج المتقدمة',
    items: [
      { question: 'الأسس المعرفية', answer: 'المستوى الأول' },
      { question: 'المنطق التحليلي', answer: 'التفكير النقدي المتقدم' },
      { question: 'فلسفة العلوم', answer: 'الابستيمولوجيا التطبيقية' },
    ],
    backgroundColor: '#fbfafc',
    textColor: '#1c1a22',
  },
  contact: {
    title: 'Deep Knowledge',
    description: 'أكاديمية النخبة للتعليم العالي المستقل. نبني قادة الفكر للمستقبل من خلال مناهج صارمة وعميقة.',
    phoneNumber: '',
    buttonText: 'ابدأ الآن',
    secondaryButtonText: 'طلب عرض توضيحي',
    secondaryButtonLink: '#about',
    backgroundColor: '#6750a4',
    textColor: '#ffffff',
  },
  footer: {
    text: '© 2024 Deep Knowledge Academy. All rights reserved.',
    backgroundColor: '#fbfafc',
    textColor: '#1c1a22',
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

function parseSectionsToContent(nodes: any[], fallback: typeof DEFAULT_CONTENT) {
  const hasApiData = Array.isArray(nodes) && nodes.length > 0;

  if (!hasApiData) {
    return {
      navbar: fallback.navbar,
      hero: fallback.hero,
      about: fallback.about,
      features: fallback.features,
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
      textColor: ap.textColor ?? ap.text_color ?? '#1c1a22',
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
      backgroundColor: fp.backgroundColor ?? fp.background_color ?? fp.bg_color ?? '#fbfafc',
      textColor: fp.textColor ?? fp.text_color ?? '#1c1a22',
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
      backgroundColor: pp.backgroundColor ?? pp.background_color ?? pp.bg_color ?? '#ffffff',
      textColor: pp.textColor ?? pp.text_color ?? '#1c1a22',
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
      backgroundColor: fp.backgroundColor ?? fp.background_color ?? fp.bg_color ?? '#fbfafc',
      textColor: fp.textColor ?? fp.text_color ?? '#1c1a22',
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
      secondaryButtonText: cp.secondaryButtonText ?? cp.secondary_button_text ?? cp.demoButtonText ?? '',
      secondaryButtonLink: cp.secondaryButtonLink ?? cp.secondary_button_link ?? cp.demoButtonLink ?? '',
      backgroundColor: cp.backgroundColor ?? cp.background_color ?? cp.bg_color ?? '#6750a4',
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
      backgroundColor: fp.backgroundColor ?? fp.background_color ?? fp.bg_color ?? '#fbfafc',
      textColor: fp.textColor ?? fp.text_color ?? '#1c1a22',
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
    stats,
    pricing,
    faq,
    contact,
    footer,
  };
}

export default function CoachTemplate({ sections: sectionsProp }: CoachTemplateProps) {
  const [content, setContent] = useState<any>(null);
  const { isEditing } = useBuilderStore();

  useEffect(() => {
    async function load() {
      const fallback = DEFAULT_CONTENT;

      // 1. If sections were passed directly as a prop — use them immediately
      if (sectionsProp && sectionsProp.length > 0) {
        const parsed = parseSectionsToContent(sectionsProp, fallback);
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
            const parsed = parseSectionsToContent(editorNodes, fallback);
            setContent(parsed);
            return;
          }
        }
      } catch (err) {
        console.error('[CoachTemplate] Failed to fetch sections from API:', err);
      }

      // 3. Fallback to defaults
      setContent(fallback);
    }

    load();
  }, [sectionsProp]);

  if (!content) return null;

  return (
    <div className="w-full min-h-screen">
      <iframe
        srcDoc={getCoachHtml(content, isEditing)}
        className="w-full min-h-screen border-none"
        style={{ width: '100%', minHeight: '100vh', border: 'none' }}
        title="Coach Template"
      />
    </div>
  );
}
