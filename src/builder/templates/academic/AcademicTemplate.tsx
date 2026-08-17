'use client';

import React, { useState, useEffect } from 'react';
import { getAcademicHtml } from './academicHtml';
import { getPublicPages, getPublicSections, apiToEditor } from '@/services/pages';
import { useBuilderStore } from '../../store/builderStore';

const TEMPLATE_SLUGS = ['academy-dashboard', 'template_1', 'template_2', 'template_3', 'template_4'];

interface AcademicTemplateProps {
  sections?: any[];
}

const DEFAULT_CONTENT = {
  navbar: { title: 'إديوكور', logo: '', bgColor: '#ffffff', textColor: '#3525cd' },
  hero: {
    title: 'بناء تجربة أكاديمية أكثر ذكاءً.',
    subtitle: 'حل مؤسسي متقدم',
    description: 'اربط الطلاب، والمعلمين، والإداريين على منصة مؤسسية موحدة مصممة لتحقيق التميز القابل للقياس وسير العمل المبسط بكفاءة عالية.',
    buttonText: 'استكشف المنصة',
    buttonLink: '#',
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
    title: 'ابْنِ مستقبل التعليم',
    description: 'انضم إلى المؤسسات الرائدة عالميًا في تحويل التجربة الأكاديمية. ارتقِ بمستوى مؤسستك التعليمية وابدأ رحلتك نحو التميز اليوم.',
    phoneNumber: '201000000000',
    buttonText: 'ابدأ الآن',
    backgroundColor: '#3525cd',
    textColor: '#ffffff',
  },
  footer: {
    text: '© 2024 إديوكور الأكاديمية. جميع الحقوق محفوظة.',
    backgroundColor: '#ffffff',
    textColor: '#1b1b24',
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

export default function AcademicTemplate({ sections: sectionsProp }: AcademicTemplateProps) {
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
        console.error('[AcademicTemplate] Failed to fetch sections from API:', err);
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
        srcDoc={getAcademicHtml(content, isEditing)}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Academic Template"
      />
    </div>
  );
}
