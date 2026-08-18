'use client';

import React, { useState, useEffect } from 'react';
import { getCoachHtml } from './coachHtml';
import { getPublicPages, getPublicSections, apiToEditor } from '@/services/pages';

const TEMPLATE_SLUGS = ['coach-dashboard', 'template_1', 'template_2', 'template_3', 'template_4'];

interface CoachTemplateProps {
  sections?: any[];
}

const DEFAULT_CONTENT = {
  navbar: { title: 'Deep Knowledge Academy', logo: '', bgColor: '#faf9fb', textColor: '#4f378a' },
  hero: {
    title: 'تعلّم بوضوح. <br/> طوّر مهاراتك بثقة.',
    subtitle: 'أكاديمية التدريب الشخصي',
    description: 'أكاديمية تعليمية وتدريبية متخصصة تحت إشراف الكوتش مباشرة. نقدم لك كورسات عملية ومبسطة تساعدك على بناء مهارات حقيقية والوصول لأهدافك بخطوات مدروسة.',
    buttonText: 'استكشف الكورسات',
    buttonLink: '#courses',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop',
    backgroundColor: '#faf9fb',
    textColor: '#1a1c1d',
  },
  about: {
    title: 'عن الكوتش',
    subtitle: 'خبرة عملية وتوجيه مستمر للوصول إلى أهدافك التعليمية.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
    backgroundColor: '#ffffff',
    textColor: '#1a1c1d',
  },
  features: {
    title: 'الكورسات المتاحة',
    subtitle: 'برامج تعليمية متكاملة مصممة لنقل مهاراتك من المستوى الأساسي إلى الاحترافي.',
    items: [
      {
        icon: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
        title: 'أساسيات التفكير التحليلي وحل المشكلات',
        description: 'كورس عملي يغطي أدوات التحليل المنطقي واتخاذ القرارات بناءً على بيانات ومعلومات دقيقة.',
      },
      {
        icon: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
        title: 'منهجية التخطيط والتنفيذ العملي',
        description: 'تعلم كيفية تحويل الأهداف الكبيرة إلى خطط عمل تنفيذية ومتابعة الإنجاز بفاعلية.',
      },
      {
        icon: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
        title: 'صياغة المحتوى وبناء الأفكار الاحترافية',
        description: 'دليل شامل لإتقان صياغة الأفكار وتوصيل الرسائل بوضوح وجاذبية للمستهدفين.',
      },
    ],
    backgroundColor: '#f4f3f5',
    textColor: '#1a1c1d',
  },
  pricing: {
    title: 'الكورسات والدورات التدريبية',
    subtitle: 'دورات مكثفة ومباشرة مصممة للتطبيق العملي.',
    items: [
      { title: 'أساسيات التفكير التحليلي', price: 'كورس كامل', features: ['١٢ درس • ٦ أسابيع', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop'] },
      { title: 'التخطيط والتنفيذ العملي', price: 'كورس متقدم', features: ['١٥ درس • ٨ أسابيع', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop'] },
    ],
    backgroundColor: '#ffffff',
    textColor: '#1a1c1d',
  },
  faq: {
    title: 'الأسئلة الشائعة',
    items: [
      { question: 'هل الكورسات مناسبة للمبتدئين؟', answer: 'نعم، تبدأ الكورسات من الأساسيات وتتدرج خطوة بخطوة.' },
      { question: 'هل توجد متابعة أو إجابة على الاستفسارات؟', answer: 'نعم، يتم الرد على جميع الاستفسارات والتساؤلات بشكل مباشر.' },
      { question: 'هل يمكنني التعلم بالسرعة التي تناسبني؟', answer: 'بالتأكيد، الدروس متاح لك مشاهدتها وإعادتها في أي وقت.' },
    ],
    backgroundColor: '#faf9fb',
    textColor: '#1a1c1d',
  },
  contact: {
    title: 'Deep Knowledge Academy',
    description: 'أكاديمية تعليمية وتدريبية متخصصة تحت إشراف الكوتش مباشرة لبناء مهارات عملية ملموسة.',
    phoneNumber: '',
    buttonText: 'تواصل مع الكوتش',
    backgroundColor: '#4f378a',
    textColor: '#ffffff',
  },
  footer: {
    text: '© 2024 Deep Knowledge Academy. جميع الحقوق محفوظة.',
    backgroundColor: '#faf9fb',
    textColor: '#1a1c1d',
  },
};

function parseSectionsToContent(nodes: any[], fallback: typeof DEFAULT_CONTENT) {
  const navbarNode = nodes.find(n => n.type === 'navbar');
  const heroNode = nodes.find(n => n.type === 'hero' || n.type === 'hero_section' || n.type === 'hero-banner' || n.type === 'slider_hero');
  const aboutNode = nodes.find(n => n.type === 'about' || n.type === 'about_section');
  const featuresNode = nodes.find(n => n.type === 'features' || n.type === 'features_section' || n.type === 'course-cards');
  const pricingNode = nodes.find(n => n.type === 'pricing' || n.type === 'pricing_section');
  const faqNode = nodes.find(n => n.type === 'faq' || n.type === 'faq_section');
  const contactNode = nodes.find(n => n.type === 'contact' || n.type === 'contact_section');
  const footerNode = nodes.find(n => n.type === 'footer');

  const navbarProps = navbarNode?.props;
  const heroProps = heroNode?.props?.items?.[0]?.props ?? heroNode?.props?.items?.[0] ?? heroNode?.props;
  const aboutProps = aboutNode?.props;
  const featuresProps = featuresNode?.props;
  const pricingProps = pricingNode?.props;
  const faqProps = faqNode?.props;
  const contactProps = contactNode?.props;
  const footerProps = footerNode?.props;

  return {
    navbar: navbarProps ? {
      title: navbarProps.title ?? navbarProps.logo_text ?? navbarProps.logoText ?? navbarProps.name ?? fallback.navbar.title,
      logo: navbarProps.logo ?? navbarProps.logo_image ?? navbarProps.logoImage ?? fallback.navbar.logo,
      bgColor: navbarProps.bgColor ?? navbarProps.bg_color ?? navbarProps.background_color ?? navbarProps.backgroundColor ?? fallback.navbar.bgColor,
      textColor: navbarProps.textColor ?? navbarProps.text_color ?? fallback.navbar.textColor,
    } : fallback.navbar,
    hero: heroProps ? {
      title: heroProps.title ?? heroProps.main_title ?? fallback.hero.title,
      subtitle: heroProps.subtitle ?? heroProps.sub_title ?? fallback.hero.subtitle,
      description: heroProps.description ?? heroProps.desc ?? fallback.hero.description,
      buttonText: heroProps.buttonText ?? heroProps.button_text ?? heroProps.btnText ?? heroProps.btn_text ?? fallback.hero.buttonText,
      buttonLink: heroProps.buttonLink ?? heroProps.button_link ?? heroProps.btnLink ?? heroProps.btn_link ?? fallback.hero.buttonLink,
      image: heroProps.image ?? heroProps.heroImage ?? heroProps.hero_image ?? heroProps.bg_image ?? heroProps.bgImage ?? heroProps.side_image ?? heroProps.sideImage ?? heroProps.image_url ?? heroProps.imageUrl ?? fallback.hero.image,
      backgroundColor: heroProps.backgroundColor ?? heroProps.background_color ?? heroProps.bg_color ?? heroProps.bgColor ?? fallback.hero.backgroundColor,
      textColor: heroProps.textColor ?? heroProps.text_color ?? fallback.hero.textColor,
      titleColor: heroProps.titleColor ?? heroProps.title_color,
      subtitleColor: heroProps.subtitleColor ?? heroProps.subtitle_color,
      buttonColor: heroProps.buttonColor ?? heroProps.button_color,
      buttonTextColor: heroProps.buttonTextColor ?? heroProps.button_text_color,
    } : fallback.hero,
    about: aboutProps ? {
      title: aboutProps.title ?? fallback.about.title,
      subtitle: aboutProps.subtitle ?? fallback.about.subtitle,
      image: aboutProps.image ?? aboutProps.side_image ?? aboutProps.sideImage ?? fallback.about.image,
      backgroundColor: aboutProps.backgroundColor ?? aboutProps.background_color ?? aboutProps.bg_color ?? aboutProps.bgColor ?? fallback.about.backgroundColor,
      textColor: aboutProps.textColor ?? aboutProps.text_color ?? fallback.about.textColor,
    } : fallback.about,
    features: featuresProps ? {
      title: featuresProps.title ?? fallback.features.title,
      subtitle: featuresProps.subtitle ?? fallback.features.subtitle,
      items: featuresProps.items ?? fallback.features.items,
      backgroundColor: featuresProps.backgroundColor ?? featuresProps.background_color ?? featuresProps.bg_color ?? featuresProps.bgColor ?? fallback.features.backgroundColor,
      textColor: featuresProps.textColor ?? featuresProps.text_color ?? fallback.features.textColor,
    } : fallback.features,
    pricing: pricingProps ? {
      title: pricingProps.title ?? fallback.pricing.title,
      subtitle: pricingProps.subtitle ?? fallback.pricing.subtitle,
      items: pricingProps.items ?? fallback.pricing.items,
      backgroundColor: pricingProps.backgroundColor ?? pricingProps.background_color ?? pricingProps.bg_color ?? pricingProps.bgColor ?? fallback.pricing.backgroundColor,
      textColor: pricingProps.textColor ?? pricingProps.text_color ?? fallback.pricing.textColor,
    } : fallback.pricing,
    faq: faqProps ? {
      title: faqProps.title ?? fallback.faq.title,
      items: faqProps.items ?? fallback.faq.items,
      backgroundColor: faqProps.backgroundColor ?? faqProps.background_color ?? faqProps.bg_color ?? faqProps.bgColor ?? fallback.faq.backgroundColor,
      textColor: faqProps.textColor ?? faqProps.text_color ?? fallback.faq.textColor,
    } : fallback.faq,
    contact: contactProps ? {
      title: contactProps.title ?? fallback.contact.title,
      description: contactProps.description ?? fallback.contact.description,
      phoneNumber: contactProps.phoneNumber ?? contactProps.phone_number ?? fallback.contact.phoneNumber,
      buttonText: contactProps.buttonText ?? contactProps.button_text ?? contactProps.btnText ?? contactProps.btn_text ?? fallback.contact.buttonText,
      backgroundColor: contactProps.backgroundColor ?? contactProps.background_color ?? contactProps.bg_color ?? contactProps.bgColor ?? fallback.contact.backgroundColor,
      textColor: contactProps.textColor ?? contactProps.text_color ?? fallback.contact.textColor,
    } : fallback.contact,
    footer: footerNode?.props ? {
      text: footerNode.props.text ?? fallback.footer.text,
      backgroundColor: footerNode.props.backgroundColor ?? footerNode.props.background_color ?? fallback.footer.backgroundColor,
      textColor: footerNode.props.textColor ?? footerNode.props.text_color ?? fallback.footer.textColor,
    } : fallback.footer,
  };
}

export default function CoachTemplate({ sections: sectionsProp }: CoachTemplateProps) {
  const [content, setContent] = useState<any>(null);

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
        srcDoc={getCoachHtml(content)}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Coach Template"
      />
    </div>
  );
}
