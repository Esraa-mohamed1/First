'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowRight,
  Sparkles,
  Check,
  Save,
  Globe,
  X,
  Pencil,
  Copy,
  User,
  Loader2,
  Trash2,
  Plus,
  BookOpen,
  Award,
  Clock,
  HelpCircle,
  Phone,
  Laptop,
  CheckCircle2,
  Eye,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getProfileStatus } from '@/services/auth';
import { getStoredUserRole, isSchoolTeacherRole } from '@/lib/auth-storage';
import { getPages, getSections, saveSections, createPage, updatePage, apiToEditor, editorToApi } from '@/services/pages';
import { syncHomepageCache } from '@/lib/homepage-cache';
import { getAcademicHtml, renderVideoPlayer } from '@/builder/templates/academic/academicHtml';
import { getCoachHtml } from '@/builder/templates/coach/coachHtml';
import { getSchoolCoachHtml, getSchoolCoachNewDesignHtml } from '@/builder/templates/schoolcoach/schoolcoachHtml';
import { getCourses } from '@/services/courses';

const MySwal = withReactContent(Swal);

const SCHOOLCOACH_NEW_EDITOR_SECTION_TYPES = [
  'navbar',
  'profile',
  'tabs',
  'courses',
  'steps',
  'videos',
  'resources',
  'results',
  'about',
  'timeline',
  'gallery',
  'testimonials',
  'faq',
  'cta',
  'footer',
  'mobileNav',
  'courseLibrary',
  'videoLibrary',
  'resourceLibrary',
  'aboutScreen',
  'courseDetail'
];

const SCHOOLCOACH_NEW_SECTION_LABELS: Record<string, string> = {
  navbar: 'شريط التنقل العلوي',
  profile: 'بروفايل المعلم',
  tabs: 'علامات التصفح / Tabs',
  courses: 'الدورات',
  steps: 'خطوات البدء',
  videos: 'مكتبة الفيديو',
  resources: 'الموارد المجانية',
  results: 'نتائج الطلاب',
  about: 'نبذة المعلم',
  timeline: 'الخبرات والمؤهلات',
  gallery: 'معرض الصف',
  testimonials: 'آراء الطلاب',
  faq: 'الأسئلة الشائعة',
  cta: 'دعوة نهائية / تواصل',
  footer: 'التذييل',
  mobileNav: 'التنقل الجوال',
  courseLibrary: 'مكتبة الدورات',
  videoLibrary: 'مكتبة الفيديوهات',
  resourceLibrary: 'مكتبة الموارد',
  aboutScreen: 'شاشة نبذة المعلم',
  courseDetail: 'تفاصيل الدورة'
};

// Helper to strip HTML tags from input box values so users edit clean text
const cleanInputText = (str: string | undefined | null): string => {
  if (!str) return '';
  return String(str).replace(/<[^>]*>?/gm, '').trim();
};

// --- Typings for Website Builder Sections ---
interface NavbarConfig {
  title: string;
  logo: string;
  bgColor: string;
  textColor: string;
  [key: string]: any;
}

interface HeroConfig {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image: string;
  backgroundColor: string;
  textColor: string;
}

interface AboutConfig {
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
  textColor: string;
  videoTag?: string;
  videoTitle?: string;
  videoDesc?: string;
  videoLink?: string;
  videoBg?: string;
  videoTextColor?: string;
  analyticsTitle?: string;
  analyticsBars?: number[];
  analyticsColor?: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesConfig {
  title: string;
  subtitle: string;
  items: FeatureItem[];
  backgroundColor: string;
  textColor: string;
}

interface PricingItem {
  title: string;
  price: string;
  features: string[];
}

interface PricingConfig {
  title: string;
  subtitle: string;
  items: PricingItem[];
  backgroundColor: string;
  textColor: string;
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonialsBg?: string;
  testimonialsTextColor?: string;
  testimonial1Text?: string;
  testimonial1Author?: string;
  testimonial1Role?: string;
  testimonial2Text?: string;
  testimonial2Author?: string;
  testimonial2Role?: string;
  testimonial3Text?: string;
  testimonial3Author?: string;
  testimonial3Role?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQConfig {
  title: string;
  items: FAQItem[];
  backgroundColor: string;
  textColor: string;
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
}

interface ContactConfig {
  title: string;
  description: string;
  phoneNumber: string;
  buttonText: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundColor: string;
  textColor: string;
}

interface FooterConfig {
  text: string;
  description?: string;
  workingHours?: string;
  email?: string;
  phone?: string;
  backgroundColor: string;
  textColor: string;
  newsletterTitle?: string;
  newsletterDesc?: string;
  newsletterBtnText?: string;
}

interface CoursesConfig {
  title: string;
  subtitle?: string;
  limit: number;
  showPrice?: boolean;
  showStudentsCount?: boolean;
  gridCols?: string;
  buttonBg?: string;
  cardBg?: string;
  titleColor?: string;
  backgroundColor?: string;
  textColor?: string;
  courses?: any[];
  items?: any[];
}

interface StatsItemConfig {
  value: string;
  label: string;
}

interface StatsConfig {
  items: StatsItemConfig[];
  backgroundColor?: string;
  textColor?: string;
}

interface TemplateContent {
  navbar: NavbarConfig;
  hero: HeroConfig;
  about: AboutConfig;
  video?: any;
  features: FeaturesConfig;
  courses?: CoursesConfig;
  stats?: StatsConfig;
  gallery?: any;
  pricing: PricingConfig;
  testimonials?: any;
  faq: FAQConfig;
  contact: ContactConfig;
  footer: FooterConfig;
  profile?: any;
  tabs?: any;
  steps?: any;
  videos?: any;
  resources?: any;
  results?: any;
  timeline?: any;
  cta?: any;
  mobileNav?: any;
  courseLibrary?: any;
  videoLibrary?: any;
  resourceLibrary?: any;
  aboutScreen?: any;
  courseDetail?: any;
}

// --- Default Content Data Generator ---
const getDefaultContent = (role: string, templateId: string): TemplateContent => {
  if (role === 'schoolcoach') {
    return {
      navbar: { title: '', teacherName: '', teacherTitle: '', logo: '', bgColor: '#0f172a', textColor: '#ffffff', links: [], loginText: 'تسجيل الدخول', loginLink: '/auth/login', videoIconVisible: true, contactIconVisible: true, contactModalTitle: 'تواصل مع الفريق', contactModalDescription: 'للحجز والاستفسار، يمكنكم التواصل مباشرة مع الفريق.', whatsappUrl: '', phoneNumber: '', whatsappButtonLabel: 'واتساب', phoneButtonLabel: 'اتصال', registerText: 'ابدأ الآن', registerLink: '/auth/register' },
      hero: { title: '', subtitle: '', description: '', buttonText: '', buttonLink: '', secondaryButtonText: '', secondaryButtonLink: '', image: '', backgroundColor: '#0f172a', textColor: '#ffffff' },
      about: { title: '', subtitle: '', image: '', backgroundColor: '#ffffff', textColor: '#1a1f29', videoTag: '', videoTitle: '', videoDesc: '', videoLink: '' },
      features: { title: '', subtitle: '', items: [], backgroundColor: '#eef2ff', textColor: '#1a1f29' },
      courses: { title: '', subtitle: '', limit: 6, showPrice: true, showStudentsCount: true, gridCols: '3', buttonBg: '#2563eb', cardBg: '#ffffff', titleColor: '#0f172a', backgroundColor: '#ffffff', textColor: '#0f172a', items: [] },
      stats: { items: [], backgroundColor: '#0f172a', textColor: '#ffffff' },
      gallery: { title: 'معرض الصف', subtitle: '', items: [], backgroundColor: '#ffffff', textColor: '#1a1f29' },
      pricing: { title: '', subtitle: '', items: [], backgroundColor: '#ffffff', textColor: '#1a1f29' },
      testimonials: { title: 'آراء الطلاب', subtitle: '', items: [], backgroundColor: '#f8fafc', textColor: '#1a1f29' },
      faq: { title: 'الأسئلة الشائعة', items: [], backgroundColor: '#f8fafc', textColor: '#1a1f29', testimonialsTitle: '', testimonialsSubtitle: '' },
      contact: { title: '', description: '', phoneNumber: '', buttonText: '', secondaryButtonText: '', secondaryButtonLink: '', backgroundColor: '#0f172a', textColor: '#ffffff' },
      footer: { text: '', description: '', workingHours: '', email: '', phone: '', backgroundColor: '#0f172a', textColor: '#ffffff', newsletterTitle: '', newsletterDesc: '', newsletterBtnText: '' },
      profile: {
        teacherName: '',
        name: '',
        teacherTitle: '',
        headline: '',
        description: '',
        bio: '',
        goal: '',
        mission: '',
        avatar: '',
        cover: '',
        verified: true,
        verifiedText: 'موثّق',
        stats: [],
        ctaPrimaryText: 'ابدأ التعلم',
        ctaPrimaryLink: '#courses',
        ctaSecondaryText: 'شاهد الفيديوهات',
        ctaSecondaryLink: '#videos',
      },
      tabs: [
        { label: 'الرئيسية', key: 'overview' },
        { label: 'الدورات', key: 'courses' },
        { label: 'الفيديوهات', key: 'videos' },
        { label: 'الموارد', key: 'resources' },
        { label: 'نبذة', key: 'about' },
      ],
      steps: { title: 'ابدأ الآن', items: [] },
      videos: { title: 'فيديوهات تعليمية', searchPlaceholder: 'ابحث عن فيديو...', items: [] },
      resources: { title: 'الموارد المجانية', searchPlaceholder: 'ابحث عن مورد...', items: [] },
      results: { title: 'نتائج الطلاب', items: [] },
      timeline: { title: 'الخبرات والمؤهلات', items: [] },
      cta: { title: '', description: '', primaryButtonText: '', primaryButtonLink: '#', secondaryButtonText: '', secondaryButtonLink: '#', backgroundColor: '#0f172a', textColor: '#ffffff' },
      mobileNav: { items: [] },
      courseLibrary: { title: 'مكتبة الدورات', searchPlaceholder: 'ابحث عن دورة...', items: [] },
      videoLibrary: { title: 'مكتبة الفيديوهات', searchPlaceholder: 'ابحث عن فيديو...', items: [] },
      resourceLibrary: { title: 'مكتبة الموارد', searchPlaceholder: 'ابحث عن مورد...', items: [] },
      aboutScreen: { title: 'نبذة المعلم', aboutText: '', experience: '', qualifications: [], contactText: '', contactLink: '#' },
      courseDetail: { title: '', subtitle: '', description: '', price: '', badge: '', syllabus: [], learningOutcomes: [], ctaText: '', ctaLink: '#' },
    };
  }

  if (role === 'coach') {
    return {
      navbar: { title: '', logo: '', bgColor: '#fbfafc', textColor: '#6750a4', links: [], loginText: 'تسجيل الدخول', loginLink: '/auth/login', registerText: 'ابدأ الآن', registerLink: '/auth/register' },
      hero: { title: '', subtitle: '', description: '', buttonText: '', buttonLink: '', secondaryButtonText: '', secondaryButtonLink: '', image: '', backgroundColor: '#fbfafc', textColor: '#1b1b24' },
      about: { title: '', subtitle: '', image: '', backgroundColor: '#ffffff', textColor: '#1b1b24', videoTag: '', videoTitle: '', videoDesc: '', videoLink: '' },
      features: { title: '', subtitle: '', items: [], backgroundColor: '#f6f2ff', textColor: '#1b1b24' },
      courses: { title: '', subtitle: '', limit: 6, showPrice: true, showStudentsCount: true, gridCols: '3', buttonBg: '#8b5cf6', cardBg: '#ffffff', titleColor: '#1b1b24', backgroundColor: '#ffffff', textColor: '#1b1b24', items: [] },
      stats: { items: [], backgroundColor: '#f6f2ff', textColor: '#1b1b24' },
      gallery: { title: '', subtitle: '', items: [], backgroundColor: '#ffffff', textColor: '#1b1b24' },
      pricing: { title: '', subtitle: '', items: [], backgroundColor: '#ffffff', textColor: '#1b1b24' },
      testimonials: { title: '', subtitle: '', items: [], backgroundColor: '#f8fafc', textColor: '#1b1b24' },
      faq: { title: '', items: [], backgroundColor: '#f8fafc', textColor: '#1b1b24', testimonialsTitle: '', testimonialsSubtitle: '' },
      contact: { title: '', description: '', phoneNumber: '', buttonText: '', secondaryButtonText: '', secondaryButtonLink: '', backgroundColor: '#fbfafc', textColor: '#1b1b24' },
      footer: { text: '', description: '', workingHours: '', email: '', phone: '', backgroundColor: '#fbfafc', textColor: '#1b1b24', newsletterTitle: '', newsletterDesc: '', newsletterBtnText: '' },
    };
  }

  return {
    navbar: { title: '', logo: '', bgColor: '#0a1628', textColor: '#ffffff', links: [], loginText: '', loginLink: '', registerText: '', registerLink: '' },
    hero: { title: '', subtitle: '', description: '', buttonText: '', buttonLink: '', secondaryButtonText: '', secondaryButtonLink: '', image: '', backgroundColor: '#0a1628', textColor: '#ffffff' },
    about: { title: '', subtitle: '', image: '', backgroundColor: '#ffffff', textColor: '#1a1f29', videoTag: '', videoTitle: '', videoDesc: '', videoLink: '' },
    features: { title: '', subtitle: '', items: [], backgroundColor: '#eef0f3', textColor: '#1a1f29' },
    courses: { title: '', subtitle: '', limit: 6, showPrice: true, showStudentsCount: true, gridCols: '3', buttonBg: '#3525cd', cardBg: '#ffffff', titleColor: '#1a1f29', backgroundColor: '#ffffff', textColor: '#1a1f29', items: [] },
    stats: { items: [], backgroundColor: '#0a1628', textColor: '#ffffff' },
    gallery: { title: '', subtitle: '', items: [], backgroundColor: '#ffffff', textColor: '#1a1f29' },
    pricing: { title: '', subtitle: '', items: [], backgroundColor: '#ffffff', textColor: '#1a1f29' },
    testimonials: { title: '', subtitle: '', items: [], backgroundColor: '#f7f8fa', textColor: '#1a1f29' },
    faq: { title: '', items: [], backgroundColor: '#f7f8fa', textColor: '#1a1f29', testimonialsTitle: '', testimonialsSubtitle: '' },
    contact: { title: '', description: '', phoneNumber: '', buttonText: '', secondaryButtonText: '', secondaryButtonLink: '', backgroundColor: '#0a1628', textColor: '#ffffff' },
    footer: { text: '', description: '', workingHours: '', email: '', phone: '', backgroundColor: '#0a1628', textColor: '#ffffff', newsletterTitle: '', newsletterDesc: '', newsletterBtnText: '' },
  };
};

export default function PageBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('templateId') || 'template_1';

  // Helper to get HTML for role
  const getHtmlForRole = (role: string, c: TemplateContent) => {
    if (role === 'academy') return getAcademicHtml(c as any);
    if (role === 'coach') return getCoachHtml(c as any);
    if (role === 'schoolcoach') return getSchoolCoachNewDesignHtml(c as any);
    return '';
  };

  // --- Core States ---
  const [currentRole, setCurrentRole] = useState<'schoolcoach' | 'coach' | 'academy'>('academy');
  const [roleReady, setRoleReady] = useState<boolean>(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template_1');
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState<keyof TemplateContent>('hero');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [openIconPickerIdx, setOpenIconPickerIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sectionsList, setSectionsList] = useState<string[]>(SCHOOLCOACH_NEW_EDITOR_SECTION_TYPES);
  const [saving, setSaving] = useState<boolean>(false);
  const lastScrollYRef = useRef<number>(0);

  useEffect(() => {
    if (currentRole === 'schoolcoach') {
      setSectionsList(SCHOOLCOACH_NEW_EDITOR_SECTION_TYPES);
      setActiveSection((current) => (current === 'hero' || current === 'features' || current === 'pricing' ? 'profile' : current));
    } else {
      setSectionsList(['navbar', 'hero', 'about', 'video', 'features', 'courses', 'stats', 'pricing', 'testimonials', 'faq', 'contact', 'footer']);
    }
  }, [currentRole, activeTemplateId, templateIdParam]);

  // Dynamic template content configurations
  const [content, setContent] = useState<TemplateContent | null>(null);
  const [previewContent, setPreviewContent] = useState<TemplateContent | null>(null);
  const [initialHtml, setInitialHtml] = useState<string>('');

  // Debounce preview updates to prevent iframe reload flicker during typing
  useEffect(() => {
    if (!content) return;
    const timer = setTimeout(() => {
      setPreviewContent(content);
    }, 450);
    return () => clearTimeout(timer);
  }, [content]);

  // Real-time DOM text updates in the iframe to prevent screen refresh/flash while typing
  useEffect(() => {
    if (!content) return;
    const iframe = document.getElementById('website-builder-iframe') as HTMLIFrameElement;
    if (!iframe || !iframe.contentDocument) return;
    const doc = iframe.contentDocument;

    const updateText = (selector: string, text: string) => {
      try {
        const el = doc.querySelector(selector);
        if (el && el.innerHTML !== text) {
          el.innerHTML = text;
        }
      } catch (e) {
        // Suppress selection errors
      }
    };

    const updateStyle = (selector: string, styleProp: string, value: string | undefined) => {
      if (!value) return;
      try {
        const el = doc.querySelector(selector) as HTMLElement;
        if (el) {
          el.style.setProperty(styleProp, value);
        }
      } catch (e) { }
    };

    const updateStyleAll = (selector: string, styleProp: string, value: string | undefined) => {
      if (!value) return;
      try {
        const els = doc.querySelectorAll(selector);
        els.forEach((el) => {
          (el as HTMLElement).style.setProperty(styleProp, value);
        });
      } catch (e) { }
    };

    // Live Background & Text Color Updates across all section banners
    updateStyleAll('[data-section="navbar"]', 'background-color', content.navbar.bgColor);
    updateStyleAll('[data-section="navbar"], [data-section="navbar"] span.text-headline-md, [data-section="navbar"] .text-headline-md, [data-section="navbar"] span.text-primary, [data-section="navbar"] .font-extrabold', 'color', content.navbar.textColor);

    updateStyleAll('[data-section="hero"]', 'background-color', content.hero.backgroundColor);
    updateStyleAll('[data-section="hero"], [data-section="hero"] h1, [data-section="hero"] p', 'color', content.hero.textColor);

    updateStyleAll('#about-analytics, [data-section="about"]', 'background-color', content.about.backgroundColor);
    updateStyleAll('#about-analytics, #about-analytics h2, #about-analytics p, [data-section="about"], [data-section="about"] h2, [data-section="about"] p', 'color', content.about.textColor);

    updateStyle('[data-section="features"]', 'background-color', content.features.backgroundColor);
    updateStyle('[data-section="features"]', 'color', content.features.textColor);

    if (content.courses) {
      const cTextColor = content.courses.textColor || content.courses.titleColor;
      if (content.courses.backgroundColor) {
        updateStyleAll('#courses, [data-section="courses"]', 'background-color', content.courses.backgroundColor);
      }
      if (content.courses.cardBg) {
        updateStyleAll('#courses a[data-course-index], #courses .bg-surface-container-lowest, [data-section="courses"] a, [data-section="courses"] .bg-surface-container-lowest, #courses .border-dashed', 'background-color', content.courses.cardBg);
      }
      if (cTextColor) {
        updateStyleAll('#courses, [data-section="courses"]', 'color', cTextColor);
        updateStyleAll('#courses h2, #courses h3, #courses p, [data-section="courses"] h2, [data-section="courses"] h3, [data-section="courses"] p', 'color', cTextColor);
      }
      if (content.courses.buttonBg) {
        updateStyleAll('#courses a.bg-primary, #courses button.bg-primary, [data-section="courses"] a.bg-primary, [data-section="courses"] button.bg-primary', 'background-color', content.courses.buttonBg);
        updateStyleAll('#courses span.bg-primary\\/10, [data-section="courses"] span.bg-primary\\/10', 'color', content.courses.buttonBg);
      }
    }

    if (content.stats) {
      if (content.stats.backgroundColor) {
        updateStyleAll('#stats-benefits, [data-section="stats"]', 'background-color', content.stats.backgroundColor);
      }
      if (content.stats.textColor) {
        updateStyleAll('#stats-benefits, [data-section="stats"]', 'color', content.stats.textColor);
        updateStyleAll('#stats-benefits span, [data-section="stats"] span, #stats-benefits [data-stat-index] span, [data-section="stats"] [data-stat-index] span', 'color', content.stats.textColor);
      }
    }

    const pBg = content.pricing.backgroundColor || '#fcf8ff';
    const pText = content.pricing.textColor || '#1b1b24';
    updateStyleAll('#pricing-plans, [data-section="pricing"]', 'background-color', pBg);
    updateStyleAll('#pricing-plans, #pricing-plans h3, #pricing-plans p, #pricing-plans h4, [data-section="pricing"], [data-section="pricing"] h3, [data-section="pricing"] p, [data-section="pricing"] h4', 'color', pText);

    const tBg = (content.pricing as any).testimonialsBg || '#f5f2ff';
    const tText = (content.pricing as any).testimonialsTextColor || '#1b1b24';
    updateStyleAll('#testimonials, [data-section="testimonials"]', 'background-color', tBg);
    updateStyleAll('#testimonials, #testimonials h2, #testimonials p, #testimonials h4, [data-section="testimonials"], [data-section="testimonials"] h2, [data-section="testimonials"] p, [data-section="testimonials"] h4, #testimonials p.italic', 'color', tText);

    updateStyle('[data-section="faq"]', 'background-color', content.faq.backgroundColor);
    updateStyle('[data-section="faq"]', 'color', content.faq.textColor);

    if (content.contact.backgroundColor) {
      updateStyle('[data-section="contact"]', 'background-color', content.contact.backgroundColor);
    }
    if (content.contact.textColor) {
      updateStyle('[data-section="contact"]', 'color', content.contact.textColor);
    }

    updateStyle('#footer-bar', 'background-color', content.footer.backgroundColor);
    updateStyle('#footer-bar', 'color', content.footer.textColor);

    // 1. Navbar
    updateText('[data-section="navbar"] span.text-headline-md, [data-section="navbar"] span.text-\\[22px\\], [data-section="navbar"] span.font-extrabold', content.navbar.title);

    // 2. Hero
    updateText('[data-section="hero"] h1', content.hero.title);
    updateText('[data-section="hero"] p', content.hero.description);
    updateText('[data-section="hero"] .text-label-md.text-primary, [data-section="hero"] .bg-gold-500\\/10 span, [data-section="hero"] .eyebrow-line', content.hero.subtitle);

    // Primary Button
    const heroPrimaryBtn = doc.querySelector('[data-section="hero"] [data-hero-btn="primary"], [data-section="hero"] a.bg-primary, [data-section="hero"] a.btn-primary') as HTMLAnchorElement;
    if (heroPrimaryBtn) {
      if (content.hero.buttonText) {
        heroPrimaryBtn.innerHTML = content.hero.buttonText;
      }
      const pLink = (content.hero.buttonLink || '').trim();
      if (pLink) {
        const isUrl = pLink.startsWith('http://') || pLink.startsWith('https://') || pLink.startsWith('/') || pLink.startsWith('#');
        heroPrimaryBtn.href = isUrl ? pLink : `#${pLink}`;
        if (pLink.startsWith('http')) {
          heroPrimaryBtn.target = '_blank';
          heroPrimaryBtn.rel = 'noopener noreferrer';
        } else {
          heroPrimaryBtn.removeAttribute('target');
          heroPrimaryBtn.removeAttribute('rel');
        }
      }
    }

    // Secondary / Demo Button
    const heroSecondaryBtn = doc.querySelector('[data-section="hero"] [data-hero-btn="secondary"], [data-section="hero"] a.btn-secondary, [data-section="hero"] a.bg-surface, [data-section="hero"] button.bg-surface') as HTMLAnchorElement;
    if (heroSecondaryBtn) {
      if (content.hero.secondaryButtonText) {
        const spanIcon = heroSecondaryBtn.querySelector('span.material-symbols-outlined');
        if (spanIcon) {
          heroSecondaryBtn.innerHTML = `${content.hero.secondaryButtonText} <span class="material-symbols-outlined text-[20px] rtl-icon group-hover:-translate-x-1 transition-transform">arrow_forward</span>`;
        } else {
          heroSecondaryBtn.innerHTML = content.hero.secondaryButtonText;
        }
      }
      const sLink = (content.hero.secondaryButtonLink || '').trim();
      if (sLink) {
        const isUrl = sLink.startsWith('http://') || sLink.startsWith('https://') || sLink.startsWith('/') || sLink.startsWith('#');
        heroSecondaryBtn.href = isUrl ? sLink : `#${sLink}`;
        if (sLink.startsWith('http')) {
          heroSecondaryBtn.target = '_blank';
          heroSecondaryBtn.rel = 'noopener noreferrer';
        } else {
          heroSecondaryBtn.removeAttribute('target');
          heroSecondaryBtn.removeAttribute('rel');
        }
      }
    }

    // 3. About
    if (currentRole === 'coach') {
      updateText('[data-section="features"] h2', content.about.title);
      updateText('#about-video .text-label-md, #about-video .text-xs.font-bold', content.about.videoTag || '');
      updateText('#about-video h2.text-headline-lg, #about-video .text-headline-lg', content.about.videoTitle || '');
      updateText('#about-video p.text-body-lg, #about-video p.text-on-surface-variant', content.about.videoDesc || '');
    } else {
      // Smart Analytics Title, Subtitle, & Image:
      updateText('#about-analytics h2.text-headline-lg, #about-analytics h2', content.about.title);
      const analyticsSubtitleEl = doc.querySelector('#about-analytics p.text-body-lg');
      if (analyticsSubtitleEl && content.about.subtitle !== undefined && analyticsSubtitleEl.innerHTML !== content.about.subtitle) {
        analyticsSubtitleEl.innerHTML = content.about.subtitle;
      }
      if (content.about.backgroundColor) {
        const aboutEl = doc.querySelector('#about-analytics, [data-section="about"]') as HTMLElement;
        if (aboutEl) aboutEl.style.backgroundColor = content.about.backgroundColor;
      }
      if (content.about.textColor) {
        const aboutEl = doc.querySelector('#about-analytics, [data-section="about"]') as HTMLElement;
        if (aboutEl) {
          aboutEl.style.color = content.about.textColor;
          const h2El = aboutEl.querySelector('h2') as HTMLElement;
          if (h2El) h2El.style.color = content.about.textColor;
          const pEl = aboutEl.querySelector('p') as HTMLElement;
          if (pEl) pEl.style.color = content.about.textColor;
        }
      }
      // Smart Analytics Chart Title, Bar Heights/Curves, & Bar Colors:
      updateText('#about-analytics h3', content.about.analyticsTitle !== undefined ? content.about.analyticsTitle : 'رؤية الأداء المؤسسي');
      const chartColor = content.about.analyticsColor || '#3525cd';
      const bars = content.about.analyticsBars || [40, 65, 85, 50, 95];

      // Dynamic Glass Bars Update
      const barEls = doc.querySelectorAll('#about-analytics div.relative.z-10.flex-1');
      barEls.forEach((barEl, i) => {
        const el = barEl as HTMLElement;
        if (el) {
          if (bars[i] !== undefined) {
            el.style.height = `${bars[i]}%`;
          }
          if (chartColor) {
            const opacities = ['22', '33', '44', '66', 'aa'];
            const op = opacities[i] || '88';
            el.style.background = `linear-gradient(to top, ${chartColor}${op}, ${chartColor})`;
          }
        }
      });

      // Dynamic SVG Curve Path Update
      const svgPaths = doc.querySelectorAll('#about-analytics svg path');
      if (svgPaths.length >= 2) {
        const b1 = bars[0] ?? 40;
        const b2 = bars[1] ?? 65;
        const b3 = bars[2] ?? 85;
        const b5 = bars[4] ?? 95;
        const dArea = `M 0 ${100 - b1} Q 25 ${100 - b2}, 50 ${100 - b3} T 100 ${100 - b5} L 100 100 L 0 100 Z`;
        const dLine = `M 0 ${100 - b1} Q 25 ${100 - b2}, 50 ${100 - b3} T 100 ${100 - b5}`;

        (svgPaths[0] as SVGPathElement).setAttribute('d', dArea);
        (svgPaths[0] as SVGPathElement).setAttribute('fill', chartColor);

        (svgPaths[1] as SVGPathElement).setAttribute('d', dLine);
        (svgPaths[1] as SVGPathElement).setAttribute('stroke', chartColor);
      }

      // Video Intro:
      updateText('#about-video .text-label-md, #about-video .text-xs.font-bold', content.about.videoTag || '');
      updateText('#about-video h2.text-headline-lg, #about-video .text-headline-lg, #about-video .text-3xl.font-extrabold', content.about.videoTitle || '');
      updateText('#about-video p.text-body-lg.font-body-lg, #about-video p.leading-relaxed', content.about.videoDesc || '');
      if (content.about.videoBg) {
        const videoEl = doc.querySelector('#about-video, [data-section="video"]') as HTMLElement;
        if (videoEl) videoEl.style.backgroundColor = content.about.videoBg;
      }
      if (content.about.videoTextColor) {
        const videoEl = doc.querySelector('#about-video, [data-section="video"]') as HTMLElement;
        if (videoEl) {
          videoEl.style.color = content.about.videoTextColor;
          const h2El = videoEl.querySelector('h2') as HTMLElement;
          if (h2El) h2El.style.color = content.about.videoTextColor;
          const pEl = videoEl.querySelector('p') as HTMLElement;
          if (pEl) pEl.style.color = content.about.videoTextColor;
        }
      }
      if (content.about.videoLink) {
        const videoContainer = doc.querySelector('#about-video [data-video-container]');
        if (videoContainer) {
          const currentSrc = videoContainer.querySelector('iframe')?.src || videoContainer.querySelector('video')?.src;
          if (!currentSrc || (!currentSrc.includes(content.about.videoLink) && !content.about.videoLink.includes(currentSrc))) {
            videoContainer.innerHTML = renderVideoPlayer(content.about.videoLink, 'w-full h-full rounded-3xl');
          }
        }
      }
    }

    // 4. Features
    updateText('[data-section="features"] h2.font-headline-lg, [data-section="features"] h2, #subjects h2', content.features.title);
    const featuresHeaderDesc = doc.querySelector('[data-section="features"] .text-center p, #subjects .text-center p');
    if (featuresHeaderDesc && featuresHeaderDesc.innerHTML !== content.features.subtitle) {
      featuresHeaderDesc.innerHTML = content.features.subtitle;
    }
    content.features.items.forEach((item, idx) => {
      if (currentRole === 'coach') {
        const parts = item.title.split(' - ');
        const name = parts[0] || '';
        const role = parts[1] || '';
        updateText(`[data-section="features"][data-index="${idx}"] h3`, name);
        updateText(`[data-section="features"][data-index="${idx}"] p.text-tertiary`, role);
        updateText(`[data-section="features"][data-index="${idx}"] p.text-on-surface-variant`, item.description);
      } else {
        updateText(`[data-section="features"][data-index="${idx}"] h3, [data-section="features"][data-index="${idx}"] h4`, item.title);
        updateText(`[data-section="features"][data-index="${idx}"] p`, item.description);
      }

      // Feature Icon Real-time update:
      if (item.icon) {
        const isImg = item.icon.startsWith('http') || item.icon.includes('/') || item.icon.startsWith('data:');
        if (isImg) {
          const imgEl = doc.querySelector(`[data-section="features"][data-index="${idx}"] img`) as HTMLImageElement;
          if (imgEl && imgEl.src !== item.icon) {
            imgEl.src = item.icon;
          }
        } else {
          const iconSpan = doc.querySelector(`[data-section="features"][data-index="${idx}"] span.material-symbols-outlined`);
          if (iconSpan && iconSpan.innerHTML !== item.icon) {
            iconSpan.innerHTML = item.icon;
          }
        }
      }
    });

    // Courses
    if (content.courses) {
      updateText('[data-section="courses"] h2.text-headline-lg, [data-section="courses"] h2, #courses h2', content.courses.title || 'أحدث الدورات والبرامج الأكاديمية');
      const coursesDesc = doc.querySelector('[data-section="courses"] .text-center p, #courses .text-center p');
      if (coursesDesc && coursesDesc.innerHTML !== content.courses.subtitle) {
        coursesDesc.innerHTML = content.courses.subtitle || '';
      }
    }

    // Stats / Benefits
    if (content.stats?.items) {
      content.stats.items.forEach((st, idx) => {
        updateText(`[data-stat-index="${idx}"] span.text-display-lg, [data-stat-index="${idx}"] span:first-child`, st.value || '');
        updateText(`[data-stat-index="${idx}"] span.text-body-md, [data-stat-index="${idx}"] span:last-child`, st.label || '');
      });
    }

    // 5. Pricing
    updateText('#pricing-plans h2, #pricing-plans h3, #groups h2', content.pricing.title);
    const pricingHeaderDesc = doc.querySelector('#pricing-plans .text-center p, #groups .text-center p');
    if (pricingHeaderDesc && pricingHeaderDesc.innerHTML !== content.pricing.subtitle) {
      pricingHeaderDesc.innerHTML = content.pricing.subtitle;
    }
    content.pricing.items.forEach((item, idx) => {
      if (currentRole === 'academy') {
        updateText(`#pricing-plans [data-index="${idx}"] p`, item.title);
        updateText(`#pricing-plans [data-index="${idx}"] h4`, item.price);
      } else if (currentRole === 'coach') {
        updateText(`#pricing-plans [data-index="${idx}"] h3`, item.title);
        updateText(`#pricing-plans [data-index="${idx}"] span.text-tertiary`, item.price);
        const duration = item.features?.[0] || '';
        updateText(`#pricing-plans [data-index="${idx}"] span.text-on-surface-variant`, duration);
      } else {
        updateText(`#pricing-plans [data-index="${idx}"] h3, #groups [data-index="${idx}"] h3`, item.title);
        updateText(`#pricing-plans [data-index="${idx}"] .block.text-xs, #groups [data-index="${idx}"] .block.text-xs`, item.price);
      }
    });

    // 6. Testimonials
    updateText('#testimonials h2.text-headline-lg, #testimonials h2.section-title, #testimonials h2', content.pricing.testimonialsTitle || content.faq.testimonialsTitle || '');
    updateText('#testimonials p.text-body-lg.max-w-2xl, #testimonials p.text-body-lg.max-w-xl, #testimonials p.text-body-md', content.pricing.testimonialsSubtitle || content.faq.testimonialsSubtitle || '');

    for (let i = 1; i <= 3; i++) {
      const textVal = (content.pricing as any)[`testimonial${i}Text`];
      const authorVal = (content.pricing as any)[`testimonial${i}Author`];
      const roleVal = (content.pricing as any)[`testimonial${i}Role`];

      if (textVal !== undefined) {
        updateText(`[data-testimonial="${i - 1}"] p.italic, [data-testimonial="${i - 1}"] p.text-on-surface-variant`, textVal ? `"${textVal}"` : '');
      }
      if (authorVal !== undefined) {
        updateText(`[data-testimonial="${i - 1}"] h4`, authorVal || '');
      }
      if (roleVal !== undefined) {
        updateText(`[data-testimonial="${i - 1}"] div:last-child p, [data-testimonial="${i - 1}"] p.text-xs, [data-testimonial="${i - 1}"] p.text-slate-500, [data-testimonial="${i - 1}"] p.text-gray-400, [data-testimonial="${i - 1}"] p.text-tertiary, [data-testimonial="${i - 1}"] p.font-label-sm, [data-section="faq"][data-index="${i - 1}"] p.text-\\[10px\\]`, roleVal || '');
      }
    }

    // 7. FAQ
    if (content.faq.backgroundColor) {
      const faqSectionEl = doc.querySelector('#faq, [data-section="faq"]') as HTMLElement;
      if (faqSectionEl) faqSectionEl.style.backgroundColor = content.faq.backgroundColor;
    }
    if (content.faq.textColor) {
      const faqSectionEl = doc.querySelector('#faq, [data-section="faq"]') as HTMLElement;
      if (faqSectionEl) faqSectionEl.style.color = content.faq.textColor;
      const faqHeadings = doc.querySelectorAll('#faq h2, [data-section="faq"] h2, #faq h4, [data-section="faq"] h4, [data-section="faq"] span.font-headline-md, [data-section="faq"] span.font-body-lg');
      faqHeadings.forEach((el) => {
        (el as HTMLElement).style.color = content.faq.textColor;
      });
      const faqAnswers = doc.querySelectorAll('#faq p, [data-section="faq"] p, [data-section="faq"] div.bg-surface');
      faqAnswers.forEach((el) => {
        (el as HTMLElement).style.color = content.faq.textColor;
      });
    }

    if (currentRole === 'schoolcoach') {
      updateText('#testimonials h2.section-title, #testimonials h2', content.faq.testimonialsTitle || '');
      updateText('#testimonials p.text-body-lg.max-w-2xl', content.faq.testimonialsSubtitle || '');
      content.faq.items.forEach((item, idx) => {
        updateText(`[data-section="faq"][data-index="${idx}"] h4`, item.question);
        updateText(`[data-section="faq"][data-index="${idx}"] p`, `"${item.answer}"`);
      });
    } else if (currentRole === 'coach') {
      updateText('[data-section="faq"] > div > div > h2, [data-section="faq"] h2', content.faq.title);
      content.faq.items.forEach((item, idx) => {
        updateText(`[data-section="faq"][data-index="${idx}"] span.font-headline-md, [data-section="faq"][data-index="${idx}"] span.font-body-lg`, item.question);
        updateText(`[data-section="faq"][data-index="${idx}"] span.font-label-sm, [data-section="faq"][data-index="${idx}"] div.bg-surface`, item.answer);
      });
    } else {
      updateText('[data-section="faq"] h2', content.faq.title);
      content.faq.items.forEach((item, idx) => {
        updateText(`[data-section="faq"][data-index="${idx}"] h4, [data-section="faq"][data-index="${idx}"] .font-body-lg`, item.question);
        updateText(`[data-section="faq"][data-index="${idx}"] p, [data-section="faq"][data-index="${idx}"] .text-body-md`, item.answer);
      });
    }

    // 8. Contact
    updateText('[data-section="contact"] h2.text-display-lg, [data-section="contact"] h2, [data-section="contact"] span.font-headline-md', content.contact.title);
    const contactDescEl = doc.querySelector('[data-section="contact"] p.text-body-lg, [data-section="contact"] p.font-body-md, [data-section="contact"] p.text-on-surface-variant');
    if (contactDescEl && content.contact.description !== undefined && contactDescEl.innerHTML !== content.contact.description) {
      contactDescEl.innerHTML = content.contact.description;
    }
    const contactBtnEl = doc.querySelector('[data-section="contact"] a[data-contact-btn="primary"], [data-section="contact"] button[data-contact-btn="primary"], [data-section="contact"] a.btn-primary, [data-section="contact"] button:first-of-type');
    if (contactBtnEl) {
      if (content.contact.buttonText !== undefined && contactBtnEl.textContent?.trim() !== content.contact.buttonText) {
        contactBtnEl.textContent = content.contact.buttonText;
      }
      if (content.contact.phoneNumber) {
        const telVal = `tel:${content.contact.phoneNumber.replace(/\s+/g, '')}`;
        if (contactBtnEl.getAttribute('href') !== telVal) {
          contactBtnEl.setAttribute('href', telVal);
        }
      }
    }
    const contactSecondaryBtnEl = doc.querySelector('[data-section="contact"] a[data-contact-btn="secondary"], [data-section="contact"] button[data-contact-btn="secondary"], [data-section="contact"] a.btn-secondary, [data-section="contact"] button:nth-of-type(2)');
    if (contactSecondaryBtnEl) {
      const secText = (content.contact as any).secondaryButtonText || 'طلب عرض توضيحي';
      if (contactSecondaryBtnEl.textContent?.trim() !== secText) {
        contactSecondaryBtnEl.textContent = secText;
      }
      const secLink = (content.contact as any).secondaryButtonLink || '';
      if (secLink && contactSecondaryBtnEl.getAttribute('href') !== secLink) {
        contactSecondaryBtnEl.setAttribute('href', secLink);
      }
    }

    // 9. Footer
    updateText('[data-section="footer"] [data-footer-desc]', content.footer.description || (content.footer as any).aboutText || '');
    updateText('[data-section="footer"] [data-footer-hours]', content.footer.workingHours || (content.footer as any).timings || '');
    if (content.footer.email) {
      updateText('[data-section="footer"] [data-footer-email]', `البريد: ${content.footer.email}`);
    }
    if (content.footer.phone) {
      updateText('[data-section="footer"] [data-footer-phone]', `الهاتف: ${content.footer.phone}`);
    }
    updateText('[data-section="footer"] [data-footer-copyright], #footer-bar span.text-body-md.text-on-surface-variant, #footer-bar .font-body-md.text-on-surface-variant', content.footer.text || '');
    updateText('#newsletter h2.text-headline-lg, #newsletter h2.text-\\[32px\\]', content.footer.newsletterTitle || '');
    updateText('#newsletter p.text-body-lg.max-w-xl, #newsletter p.leading-relaxed', content.footer.newsletterDesc || '');
    updateText('#newsletter button', content.footer.newsletterBtnText || '');
    if (content.footer.backgroundColor) {
      updateStyleAll('footer[data-section="footer"], footer, #footer, #footer-bar', 'background-color', content.footer.backgroundColor);
    }
    if (content.footer.textColor) {
      updateStyleAll('footer[data-section="footer"], footer, #footer, #footer-bar', 'color', content.footer.textColor);
    }
  }, [content]);

  // Handle iframe document load: inject hover outlines and click selections
  const handleIframeLoad = () => {
    const iframe = document.getElementById('website-builder-iframe') as HTMLIFrameElement;
    if (!iframe || !iframe.contentDocument) return;
    const doc = iframe.contentDocument;

    // Track and restore scroll position inside iframe
    const win = iframe.contentWindow;
    if (win) {
      win.addEventListener('scroll', () => {
        try {
          lastScrollYRef.current = win.scrollY || doc.documentElement.scrollTop || 0;
        } catch (e) { }
      }, { passive: true });

      if (lastScrollYRef.current > 0) {
        setTimeout(() => {
          try {
            win.scrollTo({ top: lastScrollYRef.current, behavior: 'instant' });
          } catch (e) { }
        }, 50);
      }
    }

    // 1. Inject visual editor styles into the iframe
    const styleId = 'darab-editor-styles';
    if (!doc.getElementById(styleId)) {
      const style = doc.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        [data-section] {
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        [data-section]:hover {
          outline: 2px dashed #3b82f6 !important;
          outline-offset: -2px;
        }
        [data-section].active-section {
          outline: 4px solid #3b82f6 !important;
          outline-offset: -4px;
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3) !important;
        }
        
        [data-index] {
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        [data-index]:hover {
          outline: 2px dashed #10b981 !important;
          outline-offset: -2px;
        }
        [data-index].active-item {
          outline: 3px solid #10b981 !important;
          outline-offset: -3px;
        }
      `;
      doc.head.appendChild(style);
    }

    // 2. Add intercepting click listener
    doc.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const anchorEl = target.closest('a') as HTMLAnchorElement | null;
      const itemEl = target.closest('[data-index]') as HTMLElement | null;
      const sectionEl = target.closest('[data-section]') as HTMLElement | null;

      // Handle normal URL navigation or anchor scroll on link clicks
      if (anchorEl) {
        const href = anchorEl.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript:')) {
          if (href.startsWith('http://') || href.startsWith('https://')) {
            event.preventDefault();
            event.stopPropagation();
            window.open(href, '_blank', 'noopener,noreferrer');
            return;
          } else if (href.startsWith('tel:')) {
            event.preventDefault();
            event.stopPropagation();
            window.open(href, '_self');
            return;
          } else if (href.startsWith('#')) {
            const targetEl = doc.querySelector(href);
            if (targetEl) {
              event.preventDefault();
              event.stopPropagation();
              targetEl.scrollIntoView({ behavior: 'smooth' });
              return;
            }
          }
        }
      }

      if (sectionEl) {
        event.preventDefault();
        event.stopPropagation();

        const sectionName = sectionEl.getAttribute('data-section') as keyof TemplateContent;

        // Update iframe visual classes
        doc.querySelectorAll('[data-section]').forEach(el => el.classList.remove('active-section'));
        sectionEl.classList.add('active-section');

        setActiveSection(sectionName);

        // If the user clicked on testimonials, scroll sidebar editor to testimonials
        const isTestimonials = sectionEl.id === 'testimonials' || target.closest('#testimonials');
        if (isTestimonials) {
          setTimeout(() => {
            const el = document.getElementById('testimonials-editor-header');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 120);
        } else if (sectionEl.id === 'about-video' || target.closest('#about-video')) {
          setTimeout(() => {
            const el = document.getElementById('about-video-editor-header');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 120);
        } else if (sectionEl.id === 'about-analytics' || target.closest('#about-analytics')) {
          setTimeout(() => {
            const el = document.getElementById('about-analytics-editor-header');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 120);
        }

        if (itemEl && sectionEl.contains(itemEl)) {
          const indexStr = itemEl.getAttribute('data-index');
          if (indexStr !== null) {
            const idx = parseInt(indexStr, 10);

            doc.querySelectorAll('[data-index]').forEach(el => el.classList.remove('active-item'));
            itemEl.classList.add('active-item');

            setActiveItemIndex(idx);

            // Scroll sidebar list to target item
            setTimeout(() => {
              const el = document.getElementById(`editor-item-${sectionName}-${idx}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 120);
          } else {
            setActiveItemIndex(null);
          }
        } else {
          setActiveItemIndex(null);
          doc.querySelectorAll('[data-index]').forEach(el => el.classList.remove('active-item'));
        }
      }
    }, true);
  };

  // Keep active section and item outline sync inside the iframe document & auto-scroll preview
  useEffect(() => {
    const iframe = document.getElementById('website-builder-iframe') as HTMLIFrameElement;
    if (!iframe || !iframe.contentDocument) return;
    const doc = iframe.contentDocument;

    // Sync section outline active class
    doc.querySelectorAll('[data-section]').forEach(el => {
      if (el.getAttribute('data-section') === activeSection) {
        el.classList.add('active-section');
      } else {
        el.classList.remove('active-section');
      }
    });

    // Sync item outline active class
    doc.querySelectorAll('[data-index]').forEach(el => {
      const idxStr = el.getAttribute('data-index');
      const parentSection = el.closest('[data-section]')?.getAttribute('data-section');
      if (parentSection === activeSection && idxStr !== null && parseInt(idxStr, 10) === activeItemIndex) {
        el.classList.add('active-item');
      } else {
        el.classList.remove('active-item');
      }
    });

    // Auto-scroll the preview iframe to the selected section or item
    if (activeSection) {
      const targetSelector =
        activeSection === 'video'
          ? '[data-section="video"], #about-video'
          : activeSection === 'testimonials'
            ? '[data-section="testimonials"], #testimonials, [data-testimonial]'
            : activeSection === 'stats'
              ? '[data-section="stats"], #stats'
              : activeSection === 'courses'
                ? '[data-section="courses"], [data-section="course-cards"], #courses'
                : activeSection === 'pricing'
                  ? '[data-section="pricing"], #pricing, #outcomes'
                  : activeSection === 'features'
                    ? '[data-section="features"], #features, #subjects'
                    : activeSection === 'about'
                      ? '[data-section="about"], #about-analytics, #about'
                      : activeSection === 'contact'
                        ? '[data-section="contact"], #contact'
                        : activeSection === 'footer'
                          ? '[data-section="footer"], #footer-bar, #newsletter, footer'
                          : activeSection === 'navbar'
                            ? '[data-section="navbar"], header, nav'
                            : `[data-section="${activeSection}"], #${activeSection}`;

      const targetSectionEl = doc.querySelector(targetSelector);
      if (targetSectionEl) {
        targetSectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeSection, activeItemIndex]);

  const handleSelectSectionItem = (section: keyof TemplateContent, index: number) => {
    setActiveSection(section);
    setActiveItemIndex(index);
    setTimeout(() => {
      const el = document.getElementById(`editor-item-${section}-${index}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  // --- Fetch Initial User Role ---
  useEffect(() => {
    async function loadUserRole() {
      try {
        const paramRole = searchParams?.get('role');
        const profile = await getProfileStatus().catch(() => null);
        const userData = profile?.data || profile;
        const rawRole =
          paramRole ||
          userData?.type ||
          userData?.account_type ||
          userData?.user_type ||
          (userData?.role !== 'admin' && userData?.role !== 'الادمن' ? userData?.role : null) ||
          userData?.user_role ||
          userData?.registration_role ||
          userData?.user?.type ||
          userData?.user?.account_type ||
          getStoredUserRole();

        if (rawRole || userData) {
          if (isSchoolTeacherRole(rawRole) || isSchoolTeacherRole(userData)) {
            setCurrentRole('schoolcoach');
          } else {
            const roleStr = String(rawRole || '').toLowerCase().trim();
            if (roleStr === 'coach' || roleStr === 'instructor' || roleStr === 'teacher') {
              setCurrentRole('coach');
            } else if (roleStr === 'academic' || roleStr === 'academy' || roleStr === 'organization' || roleStr) {
              setCurrentRole('academy');
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load user profile, falling back to default role: academy', err);
      } finally {
        // Signal that the role is now resolved; loadPageData controls the loading spinner
        setRoleReady(true);
      }
    }
    loadUserRole();
  }, [searchParams]);

  // --- Listen to selection messages from preview iframe ---
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SELECT_SECTION') {
        setActiveSection(event.data.section);
        if (event.data.index !== null && event.data.index !== undefined) {
          setActiveItemIndex(event.data.index);
          setTimeout(() => {
            const el = document.getElementById(`editor-item-${event.data.section}-${event.data.index}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 120);
        } else {
          setActiveItemIndex(null);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // --- Load page and sections from Database ---
  useEffect(() => {
    // Wait until loadUserRole has resolved the actual role before fetching page data
    if (!roleReady) return;
    async function loadPageData() {
      if (!currentRole) return;
      setLoading(true);

      let resolvedPageId: string | null = null;
      try {
        const apiPages = await getPages(true);
        // Find a page matching templateIdParam
        let page = apiPages.find((p: any) => p.title === templateIdParam || p.template === templateIdParam || p.template_id === templateIdParam);

        // If not found, look for any active page or first page
        if (!page) {
          page = apiPages.find((p: any) => p.is_active === 1 || p.is_active === true);
        }

        if (page) {
          resolvedPageId = String(page.id);
          setActivePageId(resolvedPageId);
        } else {
          // Create a new page for this template
          const payload = {
            title: templateIdParam,
            slug: `home-${Date.now()}`,
            status: 'published',
            template: templateIdParam,
            is_active: 1
          };
          const created = await createPage(payload);
          resolvedPageId = String(created.id);
          setActivePageId(resolvedPageId);
        }

        // Now fetch sections for resolvedPageId
        if (resolvedPageId) {
          const apiSections = await getSections(resolvedPageId);
          if (apiSections && apiSections.length > 0) {
            const editorNodes = apiToEditor(apiSections);

            const KNOWN_SECTION_TYPES = currentRole === 'schoolcoach'
              ? SCHOOLCOACH_NEW_EDITOR_SECTION_TYPES
              : currentRole === 'academy'
                ? ['navbar', 'hero', 'about', 'video', 'features', 'courses', 'stats', 'gallery_section', 'testimonials_section', 'pricing', 'faq', 'contact']
                : ['navbar', 'hero', 'about', 'video', 'features', 'courses', 'stats', 'gallery_section', 'testimonials_section', 'pricing', 'faq', 'contact', 'footer'];
            const apiSectionTypes = editorNodes
              .map(n => (n.type === 'course-cards' || n.type === 'courses') ? 'courses' : n.type)
              .filter(t => KNOWN_SECTION_TYPES.includes(t));
            const merged = [
              ...apiSectionTypes,
              ...KNOWN_SECTION_TYPES.filter(t => !apiSectionTypes.includes(t))
            ];
            setSectionsList(merged);

            let realCoursesData: any[] = [];
            try {
              const res = await getCourses();
              if (res && Array.isArray(res)) {
                realCoursesData = res;
              }
            } catch (e) {
              console.warn('Failed to load courses for builder preview', e);
            }

            // Reconstruct content state from database sections!
            const fallback = getDefaultContent(currentRole, activeTemplateId);
            if (fallback.courses && realCoursesData.length > 0) {
              fallback.courses.items = realCoursesData;
            }

            const navbarNode = editorNodes.find(n => n.type === 'navbar');
            const heroNode = editorNodes.find(n => n.type === 'hero');
            const aboutNode = editorNodes.find(n => n.type === 'about');
            const featuresNode = editorNodes.find(n => n.type === 'features' || n.type === 'features_section');
            const courseNode = editorNodes.find(n => n.type === 'course-cards' || n.type === 'courses');
            const statsNode = editorNodes.find(n => n.type === 'stats' || n.type === 'kpi-cards');
            const galleryNode = editorNodes.find(n => n.type === 'gallery_section');
            const testimonialsNode = editorNodes.find(n => n.type === 'testimonials_section');
            const pricingNode = editorNodes.find(n => n.type === 'pricing');
            const faqNode = editorNodes.find(n => n.type === 'faq');
            const contactNode = editorNodes.find(n => n.type === 'contact');
            const footerNode = editorNodes.find(n => n.type === 'footer');

            // Helper: get items already flattened by apiToEditor (node.props.items), 
            // Safe item list accessor: returns API items (safely typed) or fallback
            const safeItems = (nodeItems: any, defaultItems: any = []): any[] => {
              let list = nodeItems;
              if (typeof list === 'string') {
                try { list = JSON.parse(list); } catch (e) { list = []; }
              }
              if (!Array.isArray(list) || list.length === 0) return defaultItems || [];
              return list.map(item => {
                const merged = { ...item };
                if (merged.features && !Array.isArray(merged.features)) {
                  merged.features = [];
                }
                return merged;
              });
            };

            // Safe string accessor: returns value if non-null/non-empty, else fallback
            const sv = (val: any, fallbackVal: any) =>
              (val !== null && val !== undefined && val !== '') ? val : fallbackVal;

            // Build parsedContent by spreading ALL api props first (preserving every field
            // that exists in the DB section), then filling with sv() for known
            // camelCase/snake_case aliases that may vary by API version.
            const mergeSection = (nodeProps: Record<string, any>, fallbackSection: Record<string, any>) => ({
              ...fallbackSection,       // defaults as base
              ...nodeProps,             // ALL api props override defaults
            });

            const parsedContent: TemplateContent = {
              navbar: (navbarNode?.props ? ({
                ...mergeSection(navbarNode.props, fallback.navbar),
                // Normalize critical aliases
                bgColor: sv(navbarNode.props.bgColor ?? navbarNode.props.bg_color, fallback.navbar.bgColor),
                textColor: sv(navbarNode.props.textColor ?? navbarNode.props.text_color, fallback.navbar.textColor),
              }) : fallback.navbar) as any,

              hero: (heroNode?.props ? ({
                ...mergeSection(heroNode.props, fallback.hero),
                buttonText: sv(heroNode.props.buttonText ?? heroNode.props.button_text, fallback.hero.buttonText),
                buttonLink: sv(heroNode.props.buttonLink ?? heroNode.props.button_link, fallback.hero.buttonLink),
                secondaryButtonText: sv(heroNode.props.secondaryButtonText ?? heroNode.props.secondary_button_text ?? heroNode.props.demoButtonText ?? heroNode.props.demo_button_text, fallback.hero.secondaryButtonText || 'طلب عرض توضيحي'),
                secondaryButtonLink: sv(heroNode.props.secondaryButtonLink ?? heroNode.props.secondary_button_link ?? heroNode.props.demoButtonLink ?? heroNode.props.demo_button_link, fallback.hero.secondaryButtonLink || '#contact'),
                backgroundColor: sv(heroNode.props.backgroundColor ?? heroNode.props.background_color ?? heroNode.props.bg_color, fallback.hero.backgroundColor),
                textColor: sv(heroNode.props.textColor ?? heroNode.props.text_color, fallback.hero.textColor),
              }) : fallback.hero) as any,

              about: (aboutNode?.props ? ({
                ...mergeSection(aboutNode.props, fallback.about),
                backgroundColor: sv(aboutNode.props.backgroundColor ?? aboutNode.props.background_color ?? aboutNode.props.bg_color, fallback.about.backgroundColor),
                textColor: sv(aboutNode.props.textColor ?? aboutNode.props.text_color, fallback.about.textColor),
                videoTag: sv(aboutNode.props.videoTag ?? aboutNode.props.video_tag, fallback.about.videoTag),
                videoTitle: sv(aboutNode.props.videoTitle ?? aboutNode.props.video_title, fallback.about.videoTitle),
                videoDesc: sv(aboutNode.props.videoDesc ?? aboutNode.props.video_desc, fallback.about.videoDesc),
                videoLink: sv(aboutNode.props.videoLink ?? aboutNode.props.video_link, fallback.about.videoLink),
                videoBg: sv(aboutNode.props.videoBg ?? aboutNode.props.video_bg ?? aboutNode.props.videoBackgroundColor ?? aboutNode.props.video_background_color, fallback.about.videoBg || ''),
                videoTextColor: sv(aboutNode.props.videoTextColor ?? aboutNode.props.video_text_color, fallback.about.videoTextColor || ''),
                analyticsTitle: sv(aboutNode.props.analyticsTitle ?? aboutNode.props.analytics_title ?? aboutNode.props.visionTitle ?? aboutNode.props.vision_title, fallback.about.analyticsTitle || 'رؤية الأداء المؤسسي'),
                analyticsBars: Array.isArray(aboutNode.props.analyticsBars ?? aboutNode.props.analytics_bars) ? (aboutNode.props.analyticsBars ?? aboutNode.props.analytics_bars) : (fallback.about.analyticsBars || [40, 65, 85, 50, 95]),
                analyticsColor: sv(aboutNode.props.analyticsColor ?? aboutNode.props.analytics_color, fallback.about.analyticsColor || '#3525cd'),
              }) : fallback.about) as any,

              features: (featuresNode?.props ? ({
                ...mergeSection(featuresNode.props, fallback.features),
                items: safeItems(featuresNode.props.items, fallback.features.items),
                backgroundColor: sv(featuresNode.props.backgroundColor ?? featuresNode.props.background_color ?? featuresNode.props.bg_color, fallback.features.backgroundColor),
                textColor: sv(featuresNode.props.textColor ?? featuresNode.props.text_color, fallback.features.textColor),
              }) : fallback.features) as any,

              courses: (courseNode?.props ? ({
                ...mergeSection(courseNode.props, fallback.courses || {}),
                title: sv(courseNode.props.title, fallback.courses?.title || 'أحدث الدورات والبرامج الأكاديمية'),
                subtitle: sv(courseNode.props.subtitle, fallback.courses?.subtitle || 'استكشف مساراتنا التدريبية المتخصصة لتطوير مهاراتك والارتقاء بمسيرتك المهنية.'),
                limit: courseNode.props.limit ? Number(courseNode.props.limit) : (fallback.courses?.limit ?? 6),
                showPrice: courseNode.props.showPrice !== undefined ? Boolean(courseNode.props.showPrice) : (fallback.courses?.showPrice ?? true),
                showStudentsCount: courseNode.props.showStudentsCount !== undefined ? Boolean(courseNode.props.showStudentsCount) : (fallback.courses?.showStudentsCount ?? true),
                gridCols: sv(courseNode.props.gridCols, fallback.courses?.gridCols || '3'),
                buttonBg: sv(courseNode.props.buttonBg, fallback.courses?.buttonBg || '#3525cd'),
                cardBg: sv(courseNode.props.cardBg, fallback.courses?.cardBg || '#ffffff'),
                backgroundColor: sv(courseNode.props.backgroundColor ?? courseNode.props.background_color ?? courseNode.props.bg_color, fallback.courses?.backgroundColor || '#ffffff'),
                textColor: sv(courseNode.props.textColor ?? courseNode.props.text_color, fallback.courses?.textColor || '#1b1b24'),
                items: fallback.courses?.items || [],
              }) : fallback.courses) as any,

              stats: (statsNode?.props ? ({
                ...mergeSection(statsNode.props, fallback.stats || {}),
                items: safeItems(statsNode.props.items || statsNode.props.cards, fallback.stats?.items || []),
                backgroundColor: sv(statsNode.props.backgroundColor ?? statsNode.props.background_color ?? statsNode.props.bg_color, fallback.stats?.backgroundColor || ''),
                textColor: sv(statsNode.props.textColor ?? statsNode.props.text_color, fallback.stats?.textColor || ''),
              }) : fallback.stats) as any,

              gallery: (galleryNode?.props ? ({
                ...mergeSection(galleryNode.props, fallback.gallery || {}),
                items: safeItems(galleryNode.props.items, fallback.gallery?.items || []),
                backgroundColor: sv(galleryNode.props.backgroundColor ?? galleryNode.props.background_color ?? galleryNode.props.bg_color, fallback.gallery?.backgroundColor || '#ffffff'),
                textColor: sv(galleryNode.props.textColor ?? galleryNode.props.text_color, fallback.gallery?.textColor || '#1a1f29'),
              }) : fallback.gallery) as any,

              testimonials: (testimonialsNode?.props ? ({
                ...mergeSection(testimonialsNode.props, fallback.testimonials || {}),
                items: safeItems(testimonialsNode.props.items, fallback.testimonials?.items || []),
                backgroundColor: sv(testimonialsNode.props.backgroundColor ?? testimonialsNode.props.background_color ?? testimonialsNode.props.bg_color, fallback.testimonials?.backgroundColor || '#f7f8fa'),
                textColor: sv(testimonialsNode.props.textColor ?? testimonialsNode.props.text_color, fallback.testimonials?.textColor || '#1a1f29'),
              }) : fallback.testimonials) as any,

              pricing: (pricingNode?.props ? ({
                ...mergeSection(pricingNode.props, fallback.pricing),
                items: safeItems(pricingNode.props.items, fallback.pricing.items),
                backgroundColor: sv(pricingNode.props.backgroundColor ?? pricingNode.props.background_color ?? pricingNode.props.bg_color, fallback.pricing.backgroundColor),
                textColor: sv(pricingNode.props.textColor ?? pricingNode.props.text_color, fallback.pricing.textColor),
                testimonialsTitle: sv(pricingNode.props.testimonialsTitle ?? pricingNode.props.testimonials_title, fallback.pricing.testimonialsTitle),
                testimonialsSubtitle: sv(pricingNode.props.testimonialsSubtitle ?? pricingNode.props.testimonials_subtitle, fallback.pricing.testimonialsSubtitle),
                testimonialsBg: sv(pricingNode.props.testimonialsBg ?? pricingNode.props.testimonials_bg ?? pricingNode.props.testimonialsBackgroundColor ?? pricingNode.props.testimonials_background_color, (fallback.pricing as any).testimonialsBg || '#f5f2ff'),
                testimonialsTextColor: sv(pricingNode.props.testimonialsTextColor ?? pricingNode.props.testimonials_text_color, (fallback.pricing as any).testimonialsTextColor || '#1b1b24'),
                testimonial1Text: sv(pricingNode.props.testimonial1Text ?? pricingNode.props.testimonial1_text, fallback.pricing.testimonial1Text),
                testimonial1Author: sv(pricingNode.props.testimonial1Author ?? pricingNode.props.testimonial1_author, fallback.pricing.testimonial1Author),
                testimonial1Role: sv(pricingNode.props.testimonial1Role ?? pricingNode.props.testimonial1_role, fallback.pricing.testimonial1Role),
                testimonial2Text: sv(pricingNode.props.testimonial2Text ?? pricingNode.props.testimonial2_text, fallback.pricing.testimonial2Text),
                testimonial2Author: sv(pricingNode.props.testimonial2Author ?? pricingNode.props.testimonial2_author, fallback.pricing.testimonial2Author),
                testimonial2Role: sv(pricingNode.props.testimonial2Role ?? pricingNode.props.testimonial2_role, fallback.pricing.testimonial2Role),
                testimonial3Text: sv(pricingNode.props.testimonial3Text ?? pricingNode.props.testimonial3_text, fallback.pricing.testimonial3Text),
                testimonial3Author: sv(pricingNode.props.testimonial3Author ?? pricingNode.props.testimonial3_author, fallback.pricing.testimonial3Author),
                testimonial3Role: sv(pricingNode.props.testimonial3Role ?? pricingNode.props.testimonial3_role, fallback.pricing.testimonial3Role),
              }) : fallback.pricing) as any,

              faq: (faqNode?.props ? ({
                ...mergeSection(faqNode.props, fallback.faq),
                items: safeItems(faqNode.props.items, fallback.faq.items),
                backgroundColor: sv(faqNode.props.backgroundColor ?? faqNode.props.background_color ?? faqNode.props.bg_color, fallback.faq.backgroundColor),
                textColor: sv(faqNode.props.textColor ?? faqNode.props.text_color, fallback.faq.textColor),
                testimonialsTitle: sv(faqNode.props.testimonialsTitle ?? faqNode.props.testimonials_title, fallback.faq.testimonialsTitle),
                testimonialsSubtitle: sv(faqNode.props.testimonialsSubtitle ?? faqNode.props.testimonials_subtitle, fallback.faq.testimonialsSubtitle),
              }) : fallback.faq) as any,

              contact: (contactNode?.props ? ({
                ...mergeSection(contactNode.props, fallback.contact),
                phoneNumber: sv(contactNode.props.phoneNumber ?? contactNode.props.phone_number, fallback.contact.phoneNumber),
                buttonText: sv(contactNode.props.buttonText ?? contactNode.props.button_text, fallback.contact.buttonText),
                secondaryButtonText: sv(contactNode.props.secondaryButtonText ?? contactNode.props.secondary_button_text ?? contactNode.props.demoButtonText ?? contactNode.props.demo_button_text, fallback.contact.secondaryButtonText || 'طلب عرض توضيحي'),
                secondaryButtonLink: sv(contactNode.props.secondaryButtonLink ?? contactNode.props.secondary_button_link ?? contactNode.props.demoButtonLink ?? contactNode.props.demo_button_link, fallback.contact.secondaryButtonLink || 'https://example.com/demo'),
                backgroundColor: sv(contactNode.props.backgroundColor ?? contactNode.props.background_color ?? contactNode.props.bg_color, fallback.contact.backgroundColor),
                textColor: sv(contactNode.props.textColor ?? contactNode.props.text_color, fallback.contact.textColor),
              }) : fallback.contact) as any,

              footer: (footerNode?.props ? ({
                ...mergeSection(footerNode.props, fallback.footer),
                description: sv(footerNode.props.description ?? footerNode.props.aboutText ?? footerNode.props.about_text, fallback.footer.description || ''),
                workingHours: sv(footerNode.props.workingHours ?? footerNode.props.timings ?? footerNode.props.working_hours, fallback.footer.workingHours || ''),
                email: sv(footerNode.props.email, fallback.footer.email || ''),
                phone: sv(footerNode.props.phone, fallback.footer.phone || ''),
                backgroundColor: sv(footerNode.props.backgroundColor ?? footerNode.props.background_color ?? footerNode.props.bg_color, fallback.footer.backgroundColor),
                textColor: sv(footerNode.props.textColor ?? footerNode.props.text_color, fallback.footer.textColor),
                newsletterTitle: sv(footerNode.props.newsletterTitle ?? footerNode.props.newsletter_title, fallback.footer.newsletterTitle),
                newsletterDesc: sv(footerNode.props.newsletterDesc ?? footerNode.props.newsletter_desc, fallback.footer.newsletterDesc),
                newsletterBtnText: sv(footerNode.props.newsletterBtnText ?? footerNode.props.newsletter_btn_text, fallback.footer.newsletterBtnText),
              }) : fallback.footer) as any,
            };
            setContent(parsedContent);
            setPreviewContent(parsedContent);
            setInitialHtml(getHtmlForRole(currentRole, parsedContent));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load page data from backend:', err);
      }

      // Fallback: check localStorage or load default content
      const cacheKey = `darab_active_template_config_${currentRole}_${activeTemplateId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsedCached = JSON.parse(cached);
          setContent(parsedCached);
          setPreviewContent(parsedCached);
          setInitialHtml(getHtmlForRole(currentRole, parsedCached));
          setLoading(false);
          return;
        } catch (e) {
          console.error(e);
        }
      }
      const defaults = getDefaultContent(currentRole, activeTemplateId);
      try {
        const res = await getCourses();
        if (res && Array.isArray(res) && defaults.courses) {
          defaults.courses.items = res;
        }
      } catch (e) { }
      setContent(defaults);
      setPreviewContent(defaults);
      setInitialHtml(getHtmlForRole(currentRole, defaults));
      setLoading(false);
    }

    loadPageData();
  }, [currentRole, activeTemplateId, templateIdParam, roleReady]);

  // --- Navigation & Action Handlers ---
  const handleGoBack = () => {
    router.push('/academic');
  };

  const handleSaveDraft = async () => {
    if (!content || !activePageId) return;
    setSaving(true);
    try {
      // 1. Sync draft to LocalStorage
      const cacheKey = `darab_active_template_config_${currentRole}_${activeTemplateId}`;
      localStorage.setItem(cacheKey, JSON.stringify(content));

      // 2. Prepare database sections payload
      const nodes = [
        { id: 'navbar', type: 'navbar', props: { ...content.navbar, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'hero', type: 'hero', props: { ...content.hero, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'about', type: 'about', props: { ...content.about, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'features', type: 'features', props: { ...content.features, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        ...(content.courses ? [{ id: 'courses', type: 'course-cards', props: { ...content.courses, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } }] : []),
        ...(content.stats ? [{ id: 'stats', type: 'stats', props: { ...content.stats, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } }] : []),
        ...(content.gallery ? [{ id: 'gallery', type: 'gallery_section', props: { ...content.gallery, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } }] : []),
        ...(content.testimonials ? [{ id: 'testimonials', type: 'testimonials_section', props: { ...content.testimonials, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } }] : []),
        { id: 'pricing', type: 'pricing', props: { ...content.pricing, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'faq', type: 'faq', props: { ...content.faq, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'contact', type: 'contact', props: { ...content.contact, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'footer', type: 'footer', props: { ...content.footer, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
      ];

      const apiSections = editorToApi(nodes, activePageId);
      await saveSections(activePageId, apiSections);

      // 3. Sync frontend homepage cache
      try {
        await syncHomepageCache(activeTemplateId, nodes);
      } catch (cacheErr) {
        console.error('Failed to sync to homepage cache during save:', cacheErr);
      }

      toast.success('تم حفظ مسودة تصميمك على السيرفر بنجاح!', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء حفظ المسودة على السيرفر.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!content || !activePageId) return;

    const confirmResult = await MySwal.fire({
      title: 'هل تريد نشر هذا المظهر للموقع الآن؟',
      text: 'سيتم تطبيق التعديلات والألوان ونشرها لجميع الزوار فوراً.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'نعم، انشر الآن',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      customClass: {
        popup: 'font-sans text-right',
      },
    });

    if (!confirmResult.isConfirmed) return;

    setSaving(true);
    try {
      // 1. Sync published template keys to localStorage
      localStorage.setItem('darab_active_template', activeTemplateId);
      localStorage.setItem('darab_active_page_id', activePageId);
      const cacheKey = `darab_active_template_config_${currentRole}_${activeTemplateId}`;
      localStorage.setItem(cacheKey, JSON.stringify(content));

      localStorage.setItem(`darab_published_template_config`, JSON.stringify({
        role: currentRole,
        templateId: activeTemplateId,
        content: content
      }));

      // 2. Prepare and save database sections
      const nodes = [
        { id: 'navbar', type: 'navbar', props: { ...content.navbar, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'hero', type: 'hero', props: { ...content.hero, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'about', type: 'about', props: { ...content.about, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'features', type: 'features', props: { ...content.features, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        ...(content.courses ? [{ id: 'courses', type: 'course-cards', props: { ...content.courses, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } }] : []),
        ...(content.stats ? [{ id: 'stats', type: 'stats', props: { ...content.stats, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } }] : []),
        ...(content.gallery ? [{ id: 'gallery', type: 'gallery_section', props: { ...content.gallery, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } }] : []),
        ...(content.testimonials ? [{ id: 'testimonials', type: 'testimonials_section', props: { ...content.testimonials, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } }] : []),
        { id: 'pricing', type: 'pricing', props: { ...content.pricing, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'faq', type: 'faq', props: { ...content.faq, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'contact', type: 'contact', props: { ...content.contact, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
        { id: 'footer', type: 'footer', props: { ...content.footer, role: currentRole, templateId: activeTemplateId, template_id: activeTemplateId } },
      ];

      const apiSections = editorToApi(nodes, activePageId);
      await saveSections(activePageId, apiSections);

      // 3. Mark the page as active/published in the pages database
      await updatePage(activePageId, { is_active: 1, status: 'published' });

      // 4. Invalidate and sync homepage cache
      try {
        await syncHomepageCache(activeTemplateId, nodes);
      } catch (cacheErr) {
        console.error('Failed to sync to homepage cache during publish:', cacheErr);
      }

      MySwal.fire({
        icon: 'success',
        title: 'تم النشر بنجاح!',
        text: 'تم تفعيل وتحديث مظهر موقعك على السيرفر الخارجي وفي لوحة التحكم.',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'حسناً',
        customClass: {
          popup: 'font-sans text-right',
        },
      });
    } catch (err) {
      console.error(err);
      toast.error('فشل عملية النشر، يرجى المحاولة لاحقاً.');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    const defaults = getDefaultContent(currentRole, activeTemplateId);
    setContent(defaults);
    setPreviewContent(defaults);
    setInitialHtml(getHtmlForRole(currentRole, defaults));
    toast.success('تمت إعادة تعيين القيم الافتراضية للقالب.');
  };

  // --- Specific Content Fields Handlers ---
  const handleUpdateField = (section: keyof TemplateContent, field: string, value: any) => {
    if (!content) return;
    const updated = {
      ...content,
      [section]: {
        ...(content[section] || {}),
        [field]: value
      }
    };
    setContent(updated);
    setPreviewContent(updated);
  };

  const handleUpdateNestedField = (section: keyof TemplateContent, nestedKey: string, index: number, field: string, value: any) => {
    if (!content || !content[section]) return;
    const currentArray = (content[section] as any)?.[nestedKey];
    if (!Array.isArray(currentArray)) return;
    const arrayCopy = [...currentArray];
    arrayCopy[index] = {
      ...arrayCopy[index],
      [field]: value
    };
    const updated = {
      ...content,
      [section]: {
        ...content[section],
        [nestedKey]: arrayCopy
      }
    };
    setContent(updated);
    setPreviewContent(updated);
  };

  const handleAddListItem = (section: keyof TemplateContent, nestedKey: string, newItemTemplate: any) => {
    if (!content || !content[section]) return;
    const currentArray = (content[section] as any)?.[nestedKey];
    const arrayCopy = Array.isArray(currentArray) ? [...currentArray] : [];
    arrayCopy.push(newItemTemplate);
    const updated = {
      ...content,
      [section]: {
        ...content[section],
        [nestedKey]: arrayCopy
      }
    };
    const iframe = document.getElementById('website-builder-iframe') as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      try {
        lastScrollYRef.current = iframe.contentWindow.scrollY || iframe.contentDocument?.documentElement.scrollTop || 0;
      } catch (e) { }
    }
    setContent(updated);
    setPreviewContent(updated);
    setInitialHtml(getHtmlForRole(currentRole, updated));
  };

  const handleRemoveListItem = (section: keyof TemplateContent, nestedKey: string, index: number) => {
    if (!content || !content[section]) return;
    const currentArray = (content[section] as any)?.[nestedKey];
    if (!Array.isArray(currentArray)) return;
    if (currentArray.length <= 1) {
      toast.error('يجب توفر عنصر واحد على الأقل في هذا القسم.');
      return;
    }
    const filtered = currentArray.filter((_, i) => i !== index);
    const updated = {
      ...content,
      [section]: {
        ...content[section],
        [nestedKey]: filtered
      }
    };
    const iframe = document.getElementById('website-builder-iframe') as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      try {
        lastScrollYRef.current = iframe.contentWindow.scrollY || iframe.contentDocument?.documentElement.scrollTop || 0;
      } catch (e) { }
    }
    setContent(updated);
    setPreviewContent(updated);
    setInitialHtml(getHtmlForRole(currentRole, updated));
  };

  // Renders loading spinner on start
  if (loading || !content) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4 font-sans" dir="rtl">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-sm font-bold">جاري تحميل لوحة تخصيص القوالب...</p>
      </div>
    );
  }

  // Define Template Names helper
  const getTemplateName = (tId: string) => {
    if (currentRole === 'schoolcoach') {
      return tId === 'template_1' ? 'القالب الدراسي الهيكلي' : 'القالب المدرسي الحديث';
    } else if (currentRole === 'coach') {
      return tId === 'template_1' ? 'قالب العلامة الشخصية' : 'قالب التدريب المهني';
    } else {
      return tId === 'template_1' ? 'قالب الأكاديمية الكلاسيكي' : 'قالب الأكاديمية العصري';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F8FAFC] font-sans antialiased" dir="rtl">

      {/* 1. Top Bar Navigation & Controls */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-50 shadow-sm shrink-0">

        {/* Right Info & Role Status */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="px-3 py-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 flex items-center gap-2 font-bold text-xs"
            title="الرجوع للرئيسية"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للوحة التحكم</span>
          </button>

          <div className="leading-tight text-right">
            <h1 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>مخصّص صفحات الموقع</span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-full font-bold">
                {getTemplateName(activeTemplateId)}
              </span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold mt-0.5">تعديل المظهر، الأقسام، الألوان والكتابات مباشرة</p>
          </div>
        </div>

        {/* Simulator Device Mode Selector */}
        <div className="flex bg-slate-100 rounded-xl p-1 items-center border border-slate-200 select-none">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${deviceMode === 'desktop' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
              }`}
            title="شاشة كمبيوتر"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${deviceMode === 'tablet' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
              }`}
            title="شاشة تابلت"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${deviceMode === 'mobile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
              }`}
            title="شاشة جوال"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Template switcher panel + Save action */}
        <div className="flex items-center gap-3">

          {/* Template Selection */}
          <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl">
            <button
              onClick={() => setActiveTemplateId('template_1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${activeTemplateId === 'template_1' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              القالب الأول
            </button>
            <button
              onClick={() => setActiveTemplateId('template_2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${activeTemplateId === 'template_2' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              القالب الثاني
            </button>
          </div>
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ كمسودة</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-2 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>نشر الموقع</span>
          </button>
        </div>
      </header>

      {/* 2. Main Split View Grid (Left: Inspector Panel, Right: Live Interactive Simulation Preview) */}
      <div className="flex-grow flex overflow-hidden min-h-0">

        {/* Left Column: Editor inspector Panel (350px width) */}
        <div className="w-[360px] bg-white border-l border-slate-200 shadow-xs flex flex-col min-h-0 overflow-hidden shrink-0">

          {/* Quick Section Switcher — driven by API sections order */}
          <div className="p-5 border-b border-slate-200/80 bg-slate-50/50 shrink-0 space-y-2">
            <span className="text-[10px] font-black text-slate-500 block">اختر القسم لتخصيص محتوياته:</span>
            <div className="relative">
              <select
                value={activeSection}
                onChange={(e) => {
                  setActiveSection(e.target.value as any);
                  setActiveItemIndex(null);
                }}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-white font-extrabold focus:outline-none focus:border-blue-600 cursor-pointer pr-8 text-slate-800"
              >
                {sectionsList.map((sectionType) => {
                  const SECTION_LABELS: Record<string, string> = currentRole === 'schoolcoach'
                    ? SCHOOLCOACH_NEW_SECTION_LABELS
                    : {
                        navbar: 'شريط التنقل العلوي (Navbar)',
                        hero: 'البانر الترحيبي (Hero Banner)',
                        about: 'النبذة والتعريف (About Section)',
                        video: 'فيديو العرض التعريفي (Video Intro)',
                        features: 'مميزات الأكاديمية (Features)',
                        courses: 'الدورات والبرامج التدريبية (Courses)',
                        stats: 'إحصائيات ورضا الطلاب (Stats & Benefits)',
                        pricing: 'المخرجات والنتائج الإحصائية (Outcomes & Statistics)',
                        testimonials: 'آراء العملاء والتقييمات (Testimonials)',
                        faq: 'الأسئلة الشائعة (FAQ Accordions)',
                        contact: 'أزرار التواصل (Contact/WhatsApp)',
                        footer: 'تذييل الصفحة (Footer Bar)',
                      };
                  return (
                    <option key={sectionType} value={sectionType}>
                      {SECTION_LABELS[sectionType] ?? sectionType}
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Settings className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Section Dynamic Editors (Scrollable) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-5">
            <div key={activeSection} className="border border-blue-200 bg-blue-50/10 rounded-2xl p-5 space-y-6 shadow-inner ring-2 ring-blue-600/5 animate-in fade-in duration-300 min-w-0">

              {/* Navbar Editor */}
              {activeSection === 'navbar' && (
                <div className="space-y-4 min-w-0">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص شريط التنقل</h3>
                  </div>

                  <div className="space-y-4 min-w-0">
                    <div className="flex flex-col gap-1 min-w-0">
                      <label className="text-[11px] font-bold text-slate-600">اسم شعار الأكاديمية / المعلم</label>
                      <input
                        type="text"
                        value={content.navbar.title}
                        onChange={(e) => handleUpdateField('navbar', 'title', e.target.value)}
                        className="w-full min-w-0 border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 min-w-0">
                      <div className="flex flex-col gap-1 min-w-0">
                        <label className="text-[11px] font-bold text-slate-600">خلفية الشريط</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 min-w-0">
                          <input
                            type="color"
                            value={content.navbar.bgColor}
                            onChange={(e) => handleUpdateField('navbar', 'bgColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase truncate">{content.navbar.bgColor}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 min-w-0">
                        <label className="text-[11px] font-bold text-slate-600">لون نصوص الشعار</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 min-w-0">
                          <input
                            type="color"
                            value={content.navbar.textColor}
                            onChange={(e) => handleUpdateField('navbar', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase truncate">{content.navbar.textColor}</span>
                        </div>
                      </div>
                    </div>

                    {/* Navbar Links Editor */}
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-slate-700">روابط التنقل (Nav Links)</span>
                        <button
                          onClick={() => {
                            const currentLinks: any[] = (content.navbar as any).links || [];
                            handleUpdateField('navbar', 'links', [...currentLinks, { label: 'رابط جديد', href: '/' }]);
                          }}
                          className="text-[10px] font-bold text-blue-600 border border-blue-200 rounded-lg px-2 py-1 hover:bg-blue-50 transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3 h-3" /> إضافة
                        </button>
                      </div>
                      {((content.navbar as any).links || [
                        { label: 'الرئيسية', href: '/' },
                        { label: 'الدورات', href: '/courses' },
                        { label: 'الحقائب', href: '/bags' },
                        { label: 'حول', href: '/#about' },
                      ]).map((link: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-2 min-w-0">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => {
                              const links = [...((content.navbar as any).links || [])];
                              links[idx] = { ...links[idx], label: e.target.value };
                              handleUpdateField('navbar', 'links', links);
                            }}
                            className="w-1/2 min-w-0 flex-1 border border-slate-200 rounded-lg p-1.5 text-[10px] bg-white focus:outline-none focus:border-blue-600"
                            placeholder="الاسم"
                          />
                          <input
                            type="text"
                            value={link.href}
                            dir="ltr"
                            onChange={(e) => {
                              const links = [...((content.navbar as any).links || [])];
                              links[idx] = { ...links[idx], href: e.target.value };
                              handleUpdateField('navbar', 'links', links);
                            }}
                            className="w-1/2 min-w-0 flex-1 border border-slate-200 rounded-lg p-1.5 text-[10px] bg-white focus:outline-none focus:border-blue-600 font-mono"
                            placeholder="/courses"
                          />
                          <button
                            onClick={() => {
                              const links = ((content.navbar as any).links || []).filter((_: any, i: number) => i !== idx);
                              handleUpdateField('navbar', 'links', links);
                            }}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Login / Register Buttons */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 min-w-0">
                      <span className="text-[10px] font-extrabold text-slate-700 block border-b border-slate-200 pb-1">أزرار تسجيل الدخول والتسجيل</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1 min-w-0">
                          <label className="text-[9px] font-bold text-slate-500">نص تسجيل الدخول</label>
                          <input type="text" value={(content.navbar as any).loginText || 'تسجيل الدخول'} onChange={(e) => handleUpdateField('navbar', 'loginText', e.target.value)} className="w-full min-w-0 border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600" />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <label className="text-[9px] font-bold text-slate-500">رابط تسجيل الدخول</label>
                          <input type="text" dir="ltr" value={(content.navbar as any).loginLink || '/auth/login'} onChange={(e) => handleUpdateField('navbar', 'loginLink', e.target.value)} className="w-full min-w-0 border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-mono" />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <label className="text-[9px] font-bold text-slate-500">نص زر التسجيل</label>
                          <input type="text" value={(content.navbar as any).registerText || 'ابدأ الآن'} onChange={(e) => handleUpdateField('navbar', 'registerText', e.target.value)} className="w-full min-w-0 border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600" />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <label className="text-[9px] font-bold text-slate-500">رابط زر التسجيل</label>
                          <input type="text" dir="ltr" value={(content.navbar as any).registerLink || '/auth/register'} onChange={(e) => handleUpdateField('navbar', 'registerLink', e.target.value)} className="w-full min-w-0 border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-mono" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hero Editor */}
              {activeSection === 'hero' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص البانر الرئيسي (الهيرو)</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">العنوان الترحيبي العريض</label>
                      <textarea
                        value={cleanInputText(content.hero.title)}
                        onChange={(e) => handleUpdateField('hero', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[70px] resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">العبارة التعريفية الصغيرة (شارة المقدمة)</label>
                      <input
                        type="text"
                        value={cleanInputText(content.hero.subtitle)}
                        onChange={(e) => handleUpdateField('hero', 'subtitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">شرح وتفاصيل البانر</label>
                      <textarea
                        value={cleanInputText(content.hero.description)}
                        onChange={(e) => handleUpdateField('hero', 'description', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[110px]"
                      />
                    </div>

                    {/* Primary CTA Button */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                      <span className="text-[10px] font-extrabold text-slate-700 block border-b border-slate-200 pb-1">الزر الإرشادي الرئيسي (Primary Button):</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">نص الزر</label>
                          <input
                            type="text"
                            value={content.hero.buttonText}
                            onChange={(e) => handleUpdateField('hero', 'buttonText', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-medium"
                            placeholder="استكشف المنصة"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">رابط الزر (URL أو #ID)</label>
                          <input
                            type="text"
                            value={content.hero.buttonLink || ''}
                            onChange={(e) => handleUpdateField('hero', 'buttonLink', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                            dir="ltr"
                            placeholder="https://example.com أو #courses"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Secondary / Demo CTA Button */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                      <span className="text-[10px] font-extrabold text-slate-700 block border-b border-slate-200 pb-1">الزر الثانوي / طلب عرض توضيحي (Demo Button):</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">نص الزر</label>
                          <input
                            type="text"
                            value={content.hero.secondaryButtonText || ''}
                            onChange={(e) => handleUpdateField('hero', 'secondaryButtonText', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-medium"
                            placeholder="طلب عرض توضيحي"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">رابط الزر (URL أو #ID)</label>
                          <input
                            type="text"
                            value={content.hero.secondaryButtonLink || ''}
                            onChange={(e) => handleUpdateField('hero', 'secondaryButtonLink', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                            dir="ltr"
                            placeholder="https://example.com/demo أو #contact"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">رابط صورة الهيرو المعبرة</label>
                      <div className="flex gap-2 items-center">
                        {content.hero.image && (
                          <img src={content.hero.image} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" alt="hero preview" />
                        )}
                        <input
                          type="text"
                          value={content.hero.image}
                          onChange={(e) => handleUpdateField('hero', 'image', e.target.value)}
                          className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left flex-grow"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية البانر</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.backgroundColor}
                            onChange={(e) => handleUpdateField('hero', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.hero.backgroundColor}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون نصوص البانر</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.textColor}
                            onChange={(e) => handleUpdateField('hero', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.hero.textColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* About Editor */}
              {activeSection === 'about' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص النبذة والتعريف</h3>
                  </div>

                  <div className="space-y-4">
                    <div id="about-analytics-editor-header" className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">عنوان قسم النبذة</label>
                      <input
                        type="text"
                        value={cleanInputText(content.about.title)}
                        onChange={(e) => handleUpdateField('about', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">تفاصيل وسيرة ذاتية (محتوى النبذة)</label>
                      <textarea
                        value={cleanInputText(content.about.subtitle)}
                        onChange={(e) => handleUpdateField('about', 'subtitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[140px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية القسم</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.about.backgroundColor}
                            onChange={(e) => handleUpdateField('about', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.about.backgroundColor}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون نصوص النبذة</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.about.textColor}
                            onChange={(e) => handleUpdateField('about', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.about.textColor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">رابط صورة المعلم / النبذة</label>
                      <input
                        type="text"
                        value={content.about.image || ''}
                        onChange={(e) => handleUpdateField('about', 'image', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                        dir="ltr"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Analytics / Vision Chart Controls — Only show for Template 1 Academy Role */}
                    {activeTemplateId === 'template_1' && currentRole === 'academy' && (
                      <div className="border-t border-slate-100 pt-3 mt-3 space-y-3">
                        <h4 id="about-analytics-editor-header" className="text-[11px] font-extrabold text-slate-700">تخصيص رؤية الأداء المؤسسي والمخطط (Analytics & Vision)</h4>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-600">عنوان رؤية الأداء المؤسسي</label>
                          <input
                            type="text"
                            value={content.about.analyticsTitle !== undefined ? content.about.analyticsTitle : 'رؤية الأداء المؤسسي'}
                            onChange={(e) => handleUpdateField('about', 'analyticsTitle', e.target.value)}
                            className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                            placeholder="رؤية الأداء المؤسسي"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-600">لون أعمدة التحليلات</label>
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                            <input
                              type="color"
                              value={content.about.analyticsColor || '#3525cd'}
                              onChange={(e) => handleUpdateField('about', 'analyticsColor', e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                            />
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.about.analyticsColor || '#3525cd'}</span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          <label className="text-[11px] font-bold text-slate-600 block">منحنيات وارتفاعات الأعمدة (الأداء %):</label>
                          {([0, 1, 2, 3, 4]).map((barIdx) => {
                            const bars = content.about.analyticsBars || [40, 65, 85, 50, 95];
                            const val = bars[barIdx] ?? 50;
                            return (
                              <div key={barIdx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-600 w-14 shrink-0">عمود {barIdx + 1}:</span>
                                <input
                                  type="range"
                                  min="15"
                                  max="100"
                                  value={val}
                                  onChange={(e) => {
                                    const newBars = [...(content.about.analyticsBars || [40, 65, 85, 50, 95])];
                                    newBars[barIdx] = parseInt(e.target.value, 10);
                                    handleUpdateField('about', 'analyticsBars', newBars);
                                  }}
                                  className="flex-grow accent-blue-600 cursor-pointer"
                                />
                                <span className="text-[10px] font-mono font-extrabold text-blue-600 w-8 text-left">{val}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video Intro Editor */}
              {activeSection === 'video' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص فيديو الفلسفة التعليمية (Video Intro)</h3>
                  </div>

                  <div className="space-y-4">
                    <div id="about-video-editor-header" className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">شارة الفيديو (Tag)</label>
                      <input
                        type="text"
                        value={content.about.videoTag || ''}
                        onChange={(e) => handleUpdateField('about', 'videoTag', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">عنوان الفيديو</label>
                      <input
                        type="text"
                        value={content.about.videoTitle || ''}
                        onChange={(e) => handleUpdateField('about', 'videoTitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">وصف الفيديو</label>
                      <textarea
                        value={content.about.videoDesc || ''}
                        onChange={(e) => handleUpdateField('about', 'videoDesc', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[80px]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">رابط الفيديو / صورة العرض (Video Link / Thumbnail)</label>
                      <input
                        type="text"
                        value={content.about.videoLink || ''}
                        onChange={(e) => handleUpdateField('about', 'videoLink', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                        dir="ltr"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية قسم الفيديو</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.about.videoBg || '#ffffff'}
                            onChange={(e) => handleUpdateField('about', 'videoBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.about.videoBg || '#ffffff'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون نصوص الفيديو</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.about.videoTextColor || '#1b1b24'}
                            onChange={(e) => handleUpdateField('about', 'videoTextColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.about.videoTextColor || '#1b1b24'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Editor */}
              {activeSection === 'features' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص المميزات والخصائص</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">عنوان قسم المميزات الرئيسي</label>
                      <input
                        type="text"
                        value={content.features.title}
                        onChange={(e) => handleUpdateField('features', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">عنوان فرعي قصير للقسم</label>
                      <input
                        type="text"
                        value={content.features.subtitle}
                        onChange={(e) => handleUpdateField('features', 'subtitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>
                  </div>

                  {/* Features Items list */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500">عناصر الميزات:</span>
                      <button
                        type="button"
                        onClick={() => handleAddListItem('features', 'items', { icon: 'Award', title: 'ميزة جديدة', description: 'اكتب وصف الميزة هنا بشكل مبسط وجاذب.' })}
                        className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        إضافة ميزة
                      </button>
                    </div>

                    <div className="space-y-4">
                      {content.features.items.map((item, idx) => (
                        <div
                          key={idx}
                          id={`editor-item-features-${idx}`}
                          className={`border rounded-xl p-3 relative flex flex-col gap-2.5 transition-all duration-300 ${activeSection === 'features' && activeItemIndex === idx
                            ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.01]'
                            : 'bg-slate-50 border-slate-200'
                            }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveListItem('features', 'items', idx)}
                            className="absolute top-2 left-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="حذف الميزة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">أيقونة الميزة</label>
                            {/* Visual Icon Picker without raw text name input */}
                            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl p-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                                    {item.icon && (item.icon.startsWith('http') || item.icon.includes('/') || item.icon.startsWith('data:')) ? (
                                      <img src={item.icon} className="w-7 h-7 rounded object-cover" alt="icon preview" />
                                    ) : (
                                      <span className="material-symbols-outlined text-[20px]">{item.icon || 'star'}</span>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-600">الأيقونة المحددة</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setOpenIconPickerIdx(openIconPickerIdx === idx ? null : idx)}
                                  className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-sm">{openIconPickerIdx === idx ? 'close' : 'grid_view'}</span>
                                  {openIconPickerIdx === idx ? 'إغلاق' : 'تغيير الأيقونة'}
                                </button>
                              </div>
                              {/* Material Symbols grid picker (collapsible) */}
                              {openIconPickerIdx === idx && (
                                <div className="border-t border-slate-100 p-2">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-[9px] text-slate-400 font-bold">اختر أيقونة:</p>
                                    <button
                                      type="button"
                                      onClick={() => setOpenIconPickerIdx(null)}
                                      className="text-[9px] text-slate-400 hover:text-red-500 font-bold flex items-center gap-0.5"
                                    >
                                      <X className="w-3 h-3" /> إغلاق
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-8 gap-1">
                                    {['school', 'menu_book', 'star', 'verified', 'check_circle', 'rocket_launch', 'psychology', 'lightbulb', 'emoji_events', 'workspace_premium', 'military_tech', 'grade', 'local_library', 'auto_stories', 'science', 'calculate', 'draw', 'edit', 'history_edu', 'sports_esports', 'devices', 'laptop', 'tablet_mac', 'phone_iphone', 'cloud', 'data_usage', 'analytics', 'bar_chart', 'trending_up', 'timeline', 'groups', 'people', 'person', 'supervisor_account', 'support_agent', 'headset_mic', 'chat', 'forum', 'language', 'translate', 'public', 'travel_explore', 'apartment', 'business', 'corporate_fare', 'account_balance', 'hub', 'bolt', 'diamond', 'favorite'].map((iconName) => (
                                      <button
                                        key={iconName}
                                        type="button"
                                        title={iconName}
                                        onClick={() => {
                                          handleUpdateNestedField('features', 'items', idx, 'icon', iconName);
                                          setOpenIconPickerIdx(null);
                                        }}
                                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-blue-100 hover:text-blue-600 ${item.icon === iconName
                                          ? 'bg-blue-600 text-white'
                                          : 'text-slate-600 bg-slate-50'
                                          }`}
                                      >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                                          {iconName}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">عنوان الميزة</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'title', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-bold"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">وصف الميزة</label>
                            <textarea
                              value={item.description}
                              onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'description', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none min-h-[50px] resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Courses Editor */}
              {activeSection === 'courses' && content.courses && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص قسم الدورات التدريبية</h3>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl text-[11px] text-blue-900 font-bold leading-relaxed flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-blue-600 shrink-0 mt-0.5">info</span>
                    <div>
                      يتم جلب وعرض بيانات الدورات الحقيقية تلقائياً من المنصة، يمكنك تخصيص الألوان فقط.
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية القسم</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.courses.backgroundColor || '#ffffff'}
                            onChange={(e) => handleUpdateField('courses', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.courses.backgroundColor || '#ffffff'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية البطاقات</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.courses.cardBg || '#ffffff'}
                            onChange={(e) => handleUpdateField('courses', 'cardBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.courses.cardBg || '#ffffff'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">لون النصوص والعناوين</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input
                          type="color"
                          value={content.courses.textColor || '#1b1b24'}
                          onChange={(e) => handleUpdateField('courses', 'textColor', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                        />
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.courses.textColor || '#1b1b24'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats / Benefits Editor */}
              {activeSection === 'stats' && content.stats && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص قسم الإحصائيات ورضا الطلاب</h3>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl text-[11px] text-blue-900 font-bold leading-relaxed flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-blue-600 shrink-0 mt-0.5">insights</span>
                    <div>
                      تخصيص أرقام وعناوين بطاقات الإحصائيات والنتائج (نسبة رضا الطلاب، المناهج الشاملة، الخريجون، والدعم الأكاديمي).
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(content.stats.items || []).map((item, idx) => {
                      const defaultTitles = [
                        'نسبة رضا الطلاب (Student Satisfaction)',
                        'المناهج الشاملة (Comprehensive Curriculum)',
                        'خريج متميز (Outstanding Graduates)',
                        'الدعم الأكاديمي المباشر (Direct Academic Support)'
                      ];
                      return (
                        <div key={idx} className="border border-slate-200 bg-slate-50 rounded-xl p-3 space-y-2">
                          <span className="text-[10px] font-extrabold text-slate-700 block border-b border-slate-200 pb-1">
                            البطاقة {idx + 1}: {defaultTitles[idx] || `عنصر ${idx + 1}`}
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-slate-500">الرقم / النسبة</label>
                              <input
                                type="text"
                                value={item.value}
                                onChange={(e) => handleUpdateNestedField('stats', 'items', idx, 'value', e.target.value)}
                                className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                                placeholder="مثال: 98%"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-slate-500">النص / التسمية</label>
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleUpdateNestedField('stats', 'items', idx, 'label', e.target.value)}
                                className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-medium"
                                placeholder="مثال: نسبة رضا الطلاب"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية القسم</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.stats.backgroundColor || '#f5f3ff'}
                            onChange={(e) => handleUpdateField('stats', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.stats.backgroundColor || '#f5f3ff'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون النصوص</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.stats.textColor || '#1e1b4b'}
                            onChange={(e) => handleUpdateField('stats', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.stats.textColor || '#1e1b4b'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Outcomes & Statistics (Pricing) Editor */}
              {activeSection === 'pricing' && content.pricing && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">
                      {currentRole === 'schoolcoach' ? 'تخصيص المجموعات الدراسية' : currentRole === 'coach' ? 'تخصيص سلسلة الماستركلاسز' : 'تخصيص قسم المخرجات والنتائج الإحصائية'}
                    </h3>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl text-[11px] text-blue-900 font-bold leading-relaxed flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-blue-600 shrink-0 mt-0.5">analytics</span>
                    <div>
                      تخصيص عناوين وأرقام المخرجات والنتائج الإحصائية التي تبرز كفاءة ونموذج الأكاديمية.
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">عنوان القسم الرئيسي</label>
                      <input
                        type="text"
                        value={content.pricing.title}
                        onChange={(e) => handleUpdateField('pricing', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                        placeholder="المخرجات والنتائج الإحصائية"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">العنوان الفرعي للقسم</label>
                      <input
                        type="text"
                        value={content.pricing.subtitle}
                        onChange={(e) => handleUpdateField('pricing', 'subtitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                        placeholder="معدلات تقدم وتحليلات رقمية للفصول الدراسية"
                      />
                    </div>

                    {/* Pricing / Statistics Items */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-600">عناصر النتائج والإحصائيات ({content.pricing.items?.length || 0})</label>
                        <button
                          type="button"
                          onClick={() => handleAddListItem('pricing', 'items', { title: 'إحصائية جديدة', price: '100+', features: [] })}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-bold rounded-lg transition-colors border border-blue-200"
                        >
                          <Plus className="w-3 h-3" />
                          <span>إضافة عنصر</span>
                        </button>
                      </div>

                      {(content.pricing.items || []).map((item, idx) => (
                        <div key={idx} className="border border-slate-200 bg-slate-50 rounded-xl p-3 space-y-2 relative group">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                            <span className="text-[10px] font-extrabold text-slate-700">
                              عنصر {idx + 1}: {item.title || `إحصائية ${idx + 1}`}
                            </span>
                            {(content.pricing.items?.length || 0) > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveListItem('pricing', 'items', idx)}
                                className="text-red-500 hover:text-red-700 p-0.5 rounded transition-colors"
                                title="حذف العنصر"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-slate-500">القيمة / الرقم</label>
                              <input
                                type="text"
                                value={item.price}
                                onChange={(e) => handleUpdateNestedField('pricing', 'items', idx, 'price', e.target.value)}
                                className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                                placeholder="مثال: 12.4k أو 87%"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-slate-500">التسمية / العنوان</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => handleUpdateNestedField('pricing', 'items', idx, 'title', e.target.value)}
                                className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-medium"
                                placeholder="مثال: طلاب نشطون"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية القسم</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.pricing.backgroundColor || '#fcf8ff'}
                            onChange={(e) => handleUpdateField('pricing', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.pricing.backgroundColor || '#fcf8ff'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون النصوص</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.pricing.textColor || '#1b1b24'}
                            onChange={(e) => handleUpdateField('pricing', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.pricing.textColor || '#1b1b24'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonials Editor (Standalone Section) */}
              {activeSection === 'testimonials' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص آراء العملاء والتقييمات</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">عنوان قسم الآراء الرئيسي</label>
                      <input
                        type="text"
                        value={content.pricing.testimonialsTitle || ''}
                        onChange={(e) => handleUpdateField('pricing', 'testimonialsTitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">عنوان فرعي لقسم الآراء</label>
                      <input
                        type="text"
                        value={content.pricing.testimonialsSubtitle || ''}
                        onChange={(e) => handleUpdateField('pricing', 'testimonialsSubtitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    {/* Testimonials Items 1, 2, 3 */}
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="border border-slate-200 bg-slate-50 rounded-xl p-3 space-y-2">
                        <span className="text-[10px] font-extrabold text-slate-700 block border-b border-slate-200 pb-1">الرأي {num}:</span>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">نص الرأي</label>
                          <textarea
                            value={(content.pricing as any)[`testimonial${num}Text`] || ''}
                            onChange={(e) => handleUpdateField('pricing', `testimonial${num}Text`, e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 min-h-[60px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">صاحب الرأي</label>
                            <input
                              type="text"
                              value={(content.pricing as any)[`testimonial${num}Author`] || ''}
                              onChange={(e) => handleUpdateField('pricing', `testimonial${num}Author`, e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">الوظيفة / الصفة</label>
                            <input
                              type="text"
                              value={(content.pricing as any)[`testimonial${num}Role`] || ''}
                              onChange={(e) => handleUpdateField('pricing', `testimonial${num}Role`, e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية قسم الآراء</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={(content.pricing as any).testimonialsBg || '#f5f2ff'}
                            onChange={(e) => handleUpdateField('pricing', 'testimonialsBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{(content.pricing as any).testimonialsBg || '#f5f2ff'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون نصوص الآراء</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={(content.pricing as any).testimonialsTextColor || '#1b1b24'}
                            onChange={(e) => handleUpdateField('pricing', 'testimonialsTextColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{(content.pricing as any).testimonialsTextColor || '#1b1b24'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ Editor */}
              {activeSection === 'faq' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص الأسئلة الشائعة</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">عنوان قسم الأسئلة الرئيسي</label>
                      <input
                        type="text"
                        value={content.faq.title}
                        onChange={(e) => handleUpdateField('faq', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>
                  </div>

                  {/* FAQ Items List */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500">قائمة الأسئلة والإجابات:</span>
                      <button
                        type="button"
                        onClick={() => handleAddListItem('faq', 'items', { question: 'سؤال افتراضي جديد؟', answer: 'اكتب الإجابة المفصلة للطلاب هنا.' })}
                        className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        إضافة سؤال
                      </button>
                    </div>

                    <div className="space-y-4">
                      {content.faq.items.map((item, idx) => (
                        <div
                          key={idx}
                          id={`editor-item-faq-${idx}`}
                          className={`border rounded-xl p-3 relative flex flex-col gap-2.5 transition-all duration-300 ${activeSection === 'faq' && activeItemIndex === idx
                            ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.01]'
                            : 'bg-slate-50 border-slate-200'
                            }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveListItem('faq', 'items', idx)}
                            className="absolute top-2 left-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="حذف السؤال"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">السؤال المطروح</label>
                            <input
                              type="text"
                              value={item.question}
                              onChange={(e) => handleUpdateNestedField('faq', 'items', idx, 'question', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-bold"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">الإجابة</label>
                            <textarea
                              value={item.answer}
                              onChange={(e) => handleUpdateNestedField('faq', 'items', idx, 'answer', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none min-h-[60px] resize-none text-slate-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية قسم الأسئلة</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.faq.backgroundColor}
                            onChange={(e) => handleUpdateField('faq', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.faq.backgroundColor}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون نصوص الأسئلة</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.faq.textColor}
                            onChange={(e) => handleUpdateField('faq', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.faq.textColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Editor */}
              {activeSection === 'contact' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص أزرار التواصل والدعوة للعمل</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">عنوان قسم تواصل معنا</label>
                      <input
                        type="text"
                        value={content.contact.title}
                        onChange={(e) => handleUpdateField('contact', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">الوصف والدعوة للاتصال</label>
                      <textarea
                        value={content.contact.description}
                        onChange={(e) => handleUpdateField('contact', 'description', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[70px] resize-none"
                      />
                    </div>

                    {/* Button 1: Start / Call Button ("ابدأ الآن") */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-[11px] font-extrabold text-slate-800">الزر الأول (ابدأ الآن / اتصال)</span>
                        <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">اتصال هاتفي</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500">نص الزر الأول</label>
                        <input
                          type="text"
                          value={content.contact.buttonText}
                          onChange={(e) => handleUpdateField('contact', 'buttonText', e.target.value)}
                          className="border border-slate-200 rounded-xl p-2.5 text-xs bg-white focus:outline-none focus:border-blue-600 font-medium"
                          placeholder="ابدأ الآن"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500">رقم الهاتف / الاتصال (مثال: 01012345678)</label>
                        <input
                          type="text"
                          value={content.contact.phoneNumber}
                          onChange={(e) => handleUpdateField('contact', 'phoneNumber', e.target.value)}
                          className="border border-slate-200 rounded-xl p-2.5 text-xs bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                          dir="ltr"
                          placeholder="01012345678"
                        />
                      </div>
                    </div>

                    {/* Button 2: Demo / URL Button ("طلب عرض توضيحي") */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-[11px] font-extrabold text-slate-800">الزر الثاني (طلب عرض توضيحي / رابط URL)</span>
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">رابط مباشر</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500">نص الزر الثاني</label>
                        <input
                          type="text"
                          value={(content.contact as any).secondaryButtonText !== undefined ? (content.contact as any).secondaryButtonText : 'طلب عرض توضيحي'}
                          onChange={(e) => handleUpdateField('contact', 'secondaryButtonText', e.target.value)}
                          className="border border-slate-200 rounded-xl p-2.5 text-xs bg-white focus:outline-none focus:border-blue-600 font-medium"
                          placeholder="طلب عرض توضيحي"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500">رابط الزر الثاني (URL)</label>
                        <input
                          type="text"
                          value={(content.contact as any).secondaryButtonLink || ''}
                          onChange={(e) => handleUpdateField('contact', 'secondaryButtonLink', e.target.value)}
                          className="border border-slate-200 rounded-xl p-2.5 text-xs bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                          dir="ltr"
                          placeholder="https://example.com/demo"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية القسم</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.contact.backgroundColor}
                            onChange={(e) => handleUpdateField('contact', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.contact.backgroundColor}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون النصوص</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.contact.textColor}
                            onChange={(e) => handleUpdateField('contact', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.contact.textColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Editor */}
              {activeSection === 'footer' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص تذييل الصفحة (الفوتر)</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">الوصف التعريفي في الفوتر</label>
                      <textarea
                        value={cleanInputText(content.footer.description || (content.footer as any).aboutText || '')}
                        onChange={(e) => handleUpdateField('footer', 'description', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[70px]"
                        placeholder="مجموعات تقوية ومراجعات شاملة..."
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">مواعيد وساعات العمل</label>
                      <input
                        type="text"
                        value={content.footer.workingHours || ''}
                        onChange={(e) => handleUpdateField('footer', 'workingHours', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                        placeholder="من السبت إلى الخميس: ١٠:٠٠ ص - ٩:٠٠ م"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">البريد الإلكتروني للفوتر</label>
                        <input
                          type="email"
                          value={content.footer.email || ''}
                          onChange={(e) => handleUpdateField('footer', 'email', e.target.value)}
                          className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                          dir="ltr"
                          placeholder="info@ahmedmath.com"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">رقم الهاتف للفوتر</label>
                        <input
                          type="text"
                          value={content.footer.phone || ''}
                          onChange={(e) => handleUpdateField('footer', 'phone', e.target.value)}
                          className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                          dir="ltr"
                          placeholder="+966500000000"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">نص حقوق الملكية والنشر</label>
                      <input
                        type="text"
                        value={content.footer.text}
                        onChange={(e) => handleUpdateField('footer', 'text', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="border-t border-slate-100 pt-3 mt-3 space-y-3">
                      <h4 className="text-[11px] font-extrabold text-slate-700">تعديل النشرة البريدية (Newsletter)</h4>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">عنوان النشرة البريدية</label>
                        <input
                          type="text"
                          value={content.footer.newsletterTitle || ''}
                          onChange={(e) => handleUpdateField('footer', 'newsletterTitle', e.target.value)}
                          className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">نص زر الاشتراك</label>
                        <input
                          type="text"
                          value={content.footer.newsletterBtnText || ''}
                          onChange={(e) => handleUpdateField('footer', 'newsletterBtnText', e.target.value)}
                          className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية الفوتر</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.footer.backgroundColor}
                            onChange={(e) => handleUpdateField('footer', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.footer.backgroundColor}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون نصوص الفوتر</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.footer.textColor}
                            onChange={(e) => handleUpdateField('footer', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.footer.textColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Reset Defaults button */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
            <button
              onClick={resetToDefault}
              className="w-full py-2.5 border border-dashed border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300 rounded-xl text-xs font-bold transition-all bg-white hover:bg-red-50 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>إعادة تعيين القالب الافتراضي</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Interactive Simulation Preview */}
        <div className="flex-1 bg-slate-100 p-6 flex flex-col items-center justify-center overflow-hidden relative">

          {/* Active section bubble tag floating indicator */}
          <div className="absolute top-4 right-6 bg-slate-900/80 backdrop-blur-md text-white text-[10px] px-3.5 py-1.5 rounded-full z-10 font-bold shadow-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span>معاينة حية:</span>
            <span className="text-amber-400 font-extrabold">
              {activeSection === 'navbar' ? 'الهيدر' :
                activeSection === 'hero' ? 'البانر الترحيبي' :
                  activeSection === 'about' ? 'سيرة المعلم / من نحن' :
                    activeSection === 'features' ? 'المميزات الرئيسية' :
                      activeSection === 'pricing' ? 'الكورسات والباقات' :
                        activeSection === 'faq' ? 'الأسئلة المتكررة' :
                          activeSection === 'contact' ? 'تواصل واتساب' : 'الفوتر'}
            </span>
          </div>

          {/* Preview canvas shell scaling depending on deviceMode */}
          <div
            className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ease-out w-full h-full ${deviceMode === 'desktop' ? 'max-w-full' :
              deviceMode === 'tablet' ? 'max-w-2xl h-[90%]' : 'max-w-sm h-[85%]'
              }`}
          >
            {/* Simulation Header Address Bar */}
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2 select-none shrink-0">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block"></span>
              </div>
              <div className="flex-1 bg-white border border-slate-200 rounded-lg py-1 px-3 text-[10px] text-slate-400 font-mono text-center truncate">
                https://darab-academy.com/my-home-page
              </div>
            </div>

            {/* Simulated Live Renderer Web Page Content */}
            {initialHtml ? (
              <iframe
                key={`${currentRole}_${activeTemplateId}`}
                id="website-builder-iframe"
                srcDoc={initialHtml}
                onLoad={handleIframeLoad}
                className="w-full h-full border-0"
                title="Website Preview"
              />
            ) : (
              <div className="flex-1 overflow-y-auto bg-white select-none">

                {/* Navbar Section */}
                <div
                  onClick={() => { setActiveSection('navbar'); setActiveItemIndex(null); }}
                  style={{ backgroundColor: content.navbar.bgColor, color: content.navbar.textColor }}
                  className={`py-4 px-6 flex justify-between items-center cursor-pointer border-b border-slate-100 transition-all relative group ${activeSection === 'navbar'
                    ? 'ring-4 ring-blue-500 z-10 shadow-md'
                    : 'hover:ring-2 hover:ring-dashed hover:ring-blue-400 hover:ring-offset-1'
                    }`}
                >
                  <div className="absolute top-1 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm z-20 pointer-events-none flex items-center gap-1">
                    <Pencil className="w-2.5 h-2.5" />
                    <span>تعديل الهيدر</span>
                  </div>
                  <div className="font-extrabold text-sm flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <span>{content.navbar.title || 'شعار الموقع'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold opacity-85">
                    <span>الرئيسية</span>
                    <span>من نحن</span>
                    <span>الدورات</span>
                    <span>تواصل معنا</span>
                  </div>
                </div>

                {/* Hero Banner Section */}
                <div
                  onClick={() => { setActiveSection('hero'); setActiveItemIndex(null); }}
                  style={{ backgroundColor: content.hero.backgroundColor, color: content.hero.textColor }}
                  className={`p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center cursor-pointer transition-all relative group ${activeSection === 'hero'
                    ? 'ring-4 ring-blue-500 z-10 shadow-md'
                    : 'hover:ring-2 hover:ring-dashed hover:ring-blue-400 hover:ring-offset-1'
                    }`}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-sm z-20 pointer-events-none flex items-center gap-1">
                    <Pencil className="w-2.5 h-2.5" />
                    <span>تعديل البانر الرئيسي</span>
                  </div>
                  <div className="space-y-4">
                    <span className="inline-block px-3 py-1 bg-blue-500/10 rounded-full text-xs font-extrabold">
                      {content.hero.subtitle}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black leading-snug">
                      {content.hero.title}
                    </h2>
                    <p className="text-xs opacity-80 leading-relaxed max-w-md">
                      {content.hero.description}
                    </p>
                    <div>
                      <button
                        type="button"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-extrabold hover:bg-blue-700 shadow-md pointer-events-none transition-all"
                      >
                        {content.hero.buttonText}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={content.hero.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop'}
                      alt="Hero Preview Image"
                      className="w-full max-w-[280px] h-auto rounded-2xl object-cover shadow-md"
                    />
                  </div>
                </div>

                {/* About Section */}
                <div
                  onClick={() => { setActiveSection('about'); setActiveItemIndex(null); }}
                  style={{ backgroundColor: content.about.backgroundColor, color: content.about.textColor }}
                  className={`p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center cursor-pointer border-t border-slate-100 transition-all relative group ${activeSection === 'about'
                    ? 'ring-4 ring-blue-500 z-10 shadow-md'
                    : 'hover:ring-2 hover:ring-dashed hover:ring-blue-400 hover:ring-offset-1'
                    }`}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-sm z-20 pointer-events-none flex items-center gap-1">
                    <Pencil className="w-2.5 h-2.5" />
                    <span>تعديل النبذة والتعريف</span>
                  </div>
                  <div className="order-2 md:order-1 flex justify-center">
                    <img
                      src={content.about.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop'}
                      alt="About Preview Image"
                      className="w-[180px] h-[180px] rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  <div className="order-1 md:order-2 space-y-3">
                    <h3 className="text-lg font-black">{content.about.title}</h3>
                    <p className="text-xs leading-relaxed opacity-85 whitespace-pre-line">
                      {content.about.subtitle}
                    </p>
                  </div>
                </div>

                {/* Features Grid Section */}
                <div
                  onClick={() => { setActiveSection('features'); setActiveItemIndex(null); }}
                  style={{ backgroundColor: content.features.backgroundColor, color: content.features.textColor }}
                  className={`p-8 sm:p-12 space-y-8 cursor-pointer border-t border-slate-100 transition-all relative group ${activeSection === 'features'
                    ? 'ring-4 ring-blue-500 z-10 shadow-md'
                    : 'hover:ring-2 hover:ring-dashed hover:ring-blue-400 hover:ring-offset-1'
                    }`}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-sm z-20 pointer-events-none flex items-center gap-1">
                    <Pencil className="w-2.5 h-2.5" />
                    <span>تعديل المميزات والخصائص</span>
                  </div>
                  <div className="text-center space-y-1.5">
                    <h3 className="text-lg font-black">{content.features.title}</h3>
                    <p className="text-xs text-slate-500 font-bold">{content.features.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {content.features.items.map((item, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSectionItem('features', i);
                        }}
                        className={`bg-white border p-4 rounded-2xl flex flex-col gap-2.5 shadow-xs cursor-pointer transition-all relative group/item ${activeSection === 'features' && activeItemIndex === i
                          ? 'border-blue-500 ring-2 ring-blue-500/40 scale-[1.03] z-20 shadow-md'
                          : 'border-slate-200 hover:border-blue-400 hover:shadow-sm'
                          }`}
                      >
                        <div className="absolute top-1 left-1 opacity-0 group-hover/item:opacity-100 transition-opacity bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm z-30 pointer-events-none flex items-center gap-0.5">
                          <Pencil className="w-2 h-2" />
                          <span>تعديل</span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                          {item.icon === 'BookOpen' ? <BookOpen className="w-4 h-4" /> :
                            item.icon === 'Award' ? <Award className="w-4 h-4" /> :
                              item.icon === 'Clock' ? <Clock className="w-4 h-4" /> :
                                item.icon === 'Laptop' ? <Laptop className="w-4 h-4" /> :
                                  item.icon === 'Phone' ? <Phone className="w-4 h-4" /> :
                                    <Sparkles className="w-4 h-4" />}
                        </div>
                        <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-bold">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courses Section */}
                {content.courses && (
                  <div
                    onClick={() => { setActiveSection('courses'); setActiveItemIndex(null); }}
                    style={{ backgroundColor: content.courses.backgroundColor || '#ffffff', color: content.courses.textColor || '#1b1b24' }}
                    className={`p-8 sm:p-12 space-y-8 cursor-pointer border-t border-slate-100 transition-all relative group ${activeSection === 'courses'
                      ? 'ring-4 ring-blue-500 z-10 shadow-md'
                      : 'hover:ring-2 hover:ring-dashed hover:ring-blue-400 hover:ring-offset-1'
                      }`}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-sm z-20 pointer-events-none flex items-center gap-1">
                      <Pencil className="w-2.5 h-2.5" />
                      <span>تعديل قسم الدورات</span>
                    </div>
                    <div className="text-center space-y-1.5">
                      <h3 className="text-lg font-black">{content.courses.title || 'أحدث الدورات والبرامج الأكاديمية'}</h3>
                      <p className="text-xs text-slate-500 font-bold">{content.courses.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                          <div>
                            <div className="w-full aspect-video bg-slate-200 rounded-xl mb-3 flex items-center justify-center text-slate-400">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <h4 className="text-xs font-black text-slate-900 mb-1">دورة تدريبية نموذجية #{num}</h4>
                            <p className="text-[10px] text-slate-500 font-bold">المحاضر المعتمد</p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-blue-600">
                            <span>{content.courses?.showPrice ? '٢٥٠ ر.س' : ''}</span>
                            <span>{content.courses?.showStudentsCount ? '١٢٠ طالب' : ''}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ Section */}
                <div
                  onClick={() => { setActiveSection('faq'); setActiveItemIndex(null); }}
                  style={{ backgroundColor: content.faq.backgroundColor, color: content.faq.textColor }}
                  className={`p-8 sm:p-12 space-y-6 cursor-pointer border-t border-slate-100 transition-all relative group ${activeSection === 'faq'
                    ? 'ring-4 ring-blue-500 z-10 shadow-md'
                    : 'hover:ring-2 hover:ring-dashed hover:ring-blue-400 hover:ring-offset-1'
                    }`}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-sm z-20 pointer-events-none flex items-center gap-1">
                    <Pencil className="w-2.5 h-2.5" />
                    <span>تعديل الأسئلة الشائعة</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black">{content.faq.title}</h3>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-3">
                    {content.faq.items.map((item, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSectionItem('faq', i);
                        }}
                        className={`bg-white border rounded-xl p-4 flex gap-3 text-right cursor-pointer transition-all relative group/item ${activeSection === 'faq' && activeItemIndex === i
                          ? 'border-blue-500 ring-2 ring-blue-500/40 scale-[1.02] z-20 shadow-md'
                          : 'border-slate-200 hover:border-blue-400 hover:shadow-sm'
                          }`}
                      >
                        <div className="absolute top-2 left-2 opacity-0 group-hover/item:opacity-100 transition-opacity bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm z-30 pointer-events-none flex items-center gap-0.5">
                          <Pencil className="w-2 h-2" />
                          <span>تعديل السؤال</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">
                          س
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 mb-1">{item.question}</h4>
                          <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact/WhatsApp Section */}
                <div
                  onClick={() => { setActiveSection('contact'); setActiveItemIndex(null); }}
                  style={{ backgroundColor: content.contact.backgroundColor, color: content.contact.textColor }}
                  className={`p-8 sm:p-10 text-center space-y-4 cursor-pointer border-t border-slate-100 transition-all relative group ${activeSection === 'contact'
                    ? 'ring-4 ring-blue-500 z-10 shadow-md'
                    : 'hover:ring-2 hover:ring-dashed hover:ring-blue-400 hover:ring-offset-1'
                    }`}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-sm z-20 pointer-events-none flex items-center gap-1">
                    <Pencil className="w-2.5 h-2.5" />
                    <span>تعديل أزرار التواصل</span>
                  </div>
                  <h3 className="text-lg font-black">{content.contact.title}</h3>
                  <p className="text-xs max-w-md mx-auto leading-relaxed opacity-85">
                    {content.contact.description}
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-extrabold text-xs shadow-md transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{content.contact.buttonText}</span>
                    </a>
                  </div>
                </div>

                {/* Footer Section */}
                {currentRole !== 'academy' && (
                  <div
                    onClick={() => { setActiveSection('footer'); setActiveItemIndex(null); }}
                    style={{ backgroundColor: content.footer.backgroundColor, color: content.footer.textColor }}
                    className={`py-6 px-6 text-center text-[10px] cursor-pointer opacity-90 border-t border-slate-100 transition-all relative group ${activeSection === 'footer'
                      ? 'ring-4 ring-blue-500 z-10 shadow-md'
                      : 'hover:ring-2 hover:ring-dashed hover:ring-blue-400 hover:ring-offset-1'
                      }`}
                  >
                    <div className="absolute top-1 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm z-20 pointer-events-none flex items-center gap-1">
                      <Pencil className="w-2.5 h-2.5" />
                      <span>تعديل التذييل</span>
                    </div>
                    <p className="font-bold opacity-80">{content.footer.text}</p>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
