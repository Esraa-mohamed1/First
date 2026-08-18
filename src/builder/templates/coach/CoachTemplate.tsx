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
