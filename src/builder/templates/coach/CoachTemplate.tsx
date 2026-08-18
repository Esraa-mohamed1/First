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
  navbar: { title: 'Deep Knowledge', logo: '', bgColor: '#fbfafc', textColor: '#6750a4' },
  hero: {
    title: 'تعمّج في المعرفة. <br/> تعلم من الصفوة.',
    subtitle: 'أكاديمية النخبة',
    description: 'مساحة حصرية مصممة للمفكرين والقادة. استكشف مناهج متقدمة وتواصل مع خبراء عالميين في بيئة دراسية مصممة للتركيز العميق والتميز الأكاديمي.',
    buttonText: 'ابدأ رحلتك',
    buttonLink: '#',
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
    buttonText: '',
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

function parseSectionsToContent(nodes: any[], fallback: typeof DEFAULT_CONTENT) {
  const navbarNode = nodes.find(n => n.type === 'navbar');
  const heroNode = nodes.find(n => n.type === 'hero');
  const aboutNode = nodes.find(n => n.type === 'about');
  const featuresNode = nodes.find(n => n.type === 'features');
  const pricingNode = nodes.find(n => n.type === 'pricing');
  const faqNode = nodes.find(n => n.type === 'faq');
  const contactNode = nodes.find(n => n.type === 'contact');
  const footerNode = nodes.find(n => n.type === 'footer');

  return {
    navbar: navbarNode?.props ? {
      title: navbarNode.props.title ?? fallback.navbar.title,
      logo: navbarNode.props.logo ?? fallback.navbar.logo,
      bgColor: navbarNode.props.bgColor ?? navbarNode.props.bg_color ?? fallback.navbar.bgColor,
      textColor: navbarNode.props.textColor ?? navbarNode.props.text_color ?? fallback.navbar.textColor,
    } : fallback.navbar,
    hero: heroNode?.props ? {
      title: heroNode.props.title ?? fallback.hero.title,
      subtitle: heroNode.props.subtitle ?? fallback.hero.subtitle,
      description: heroNode.props.description ?? fallback.hero.description,
      buttonText: heroNode.props.buttonText ?? heroNode.props.button_text ?? fallback.hero.buttonText,
      buttonLink: heroNode.props.buttonLink ?? heroNode.props.button_link ?? fallback.hero.buttonLink,
      image: heroNode.props.image ?? fallback.hero.image,
      backgroundColor: heroNode.props.backgroundColor ?? heroNode.props.background_color ?? fallback.hero.backgroundColor,
      textColor: heroNode.props.textColor ?? heroNode.props.text_color ?? fallback.hero.textColor,
    } : fallback.hero,
    about: aboutNode?.props ? {
      title: aboutNode.props.title ?? fallback.about.title,
      subtitle: aboutNode.props.subtitle ?? fallback.about.subtitle,
      image: aboutNode.props.image ?? fallback.about.image,
      backgroundColor: aboutNode.props.backgroundColor ?? aboutNode.props.background_color ?? fallback.about.backgroundColor,
      textColor: aboutNode.props.textColor ?? aboutNode.props.text_color ?? fallback.about.textColor,
      videoTag: aboutNode.props.videoTag ?? aboutNode.props.video_tag ?? fallback.about.videoTag,
      videoTitle: aboutNode.props.videoTitle ?? aboutNode.props.video_title ?? fallback.about.videoTitle,
      videoDesc: aboutNode.props.videoDesc ?? aboutNode.props.video_desc ?? fallback.about.videoDesc,
      videoLink: aboutNode.props.videoLink ?? aboutNode.props.video_link ?? fallback.about.videoLink,
    } : fallback.about,
    features: featuresNode?.props ? {
      title: featuresNode.props.title ?? fallback.features.title,
      subtitle: featuresNode.props.subtitle ?? fallback.features.subtitle,
      items: featuresNode.props.items ?? fallback.features.items,
      backgroundColor: featuresNode.props.backgroundColor ?? featuresNode.props.background_color ?? fallback.features.backgroundColor,
      textColor: featuresNode.props.textColor ?? featuresNode.props.text_color ?? fallback.features.textColor,
    } : fallback.features,
    pricing: pricingNode?.props ? {
      title: pricingNode.props.title ?? fallback.pricing.title,
      subtitle: pricingNode.props.subtitle ?? fallback.pricing.subtitle,
      items: pricingNode.props.items ?? fallback.pricing.items,
      backgroundColor: pricingNode.props.backgroundColor ?? pricingNode.props.background_color ?? fallback.pricing.backgroundColor,
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
      title: faqNode.props.title ?? fallback.faq.title,
      items: faqNode.props.items ?? fallback.faq.items,
      backgroundColor: faqNode.props.backgroundColor ?? faqNode.props.background_color ?? fallback.faq.backgroundColor,
      textColor: faqNode.props.textColor ?? faqNode.props.text_color ?? fallback.faq.textColor,
    } : fallback.faq,
    contact: contactNode?.props ? {
      title: contactNode.props.title ?? fallback.contact.title,
      description: contactNode.props.description ?? fallback.contact.description,
      phoneNumber: contactNode.props.phoneNumber ?? contactNode.props.phone_number ?? fallback.contact.phoneNumber,
      buttonText: contactNode.props.buttonText ?? contactNode.props.button_text ?? fallback.contact.buttonText,
      backgroundColor: contactNode.props.backgroundColor ?? contactNode.props.background_color ?? fallback.contact.backgroundColor,
      textColor: contactNode.props.textColor ?? contactNode.props.text_color ?? fallback.contact.textColor,
    } : fallback.contact,
    footer: footerNode?.props ? {
      text: footerNode.props.text ?? fallback.footer.text,
      backgroundColor: footerNode.props.backgroundColor ?? footerNode.props.background_color ?? fallback.footer.backgroundColor,
      textColor: footerNode.props.textColor ?? footerNode.props.text_color ?? fallback.footer.textColor,
      newsletterTitle: footerNode.props.newsletterTitle ?? footerNode.props.newsletter_title ?? fallback.footer.newsletterTitle,
      newsletterDesc: footerNode.props.newsletterDesc ?? footerNode.props.newsletter_desc ?? fallback.footer.newsletterDesc,
      newsletterBtnText: footerNode.props.newsletterBtnText ?? footerNode.props.newsletter_btn_text ?? fallback.footer.newsletterBtnText,
    } : fallback.footer,
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
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        srcDoc={getCoachHtml(content, isEditing)}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Coach Template"
      />
    </div>
  );
}
