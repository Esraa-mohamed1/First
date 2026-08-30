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
import { getPages, getSections, saveSections, createPage, updatePage, apiToEditor, editorToApi } from '@/services/pages';
import { syncHomepageCache } from '@/lib/homepage-cache';
import { getAcademicHtml } from '@/builder/templates/academic/academicHtml';
import { getCoachHtml } from '@/builder/templates/coach/coachHtml';
import { getSchoolCoachHtml } from '@/builder/templates/schoolcoach/schoolcoachHtml';
import { getCourses } from '@/services/courses';

const MySwal = withReactContent(Swal);

// --- Typings for Website Builder Sections ---
interface NavbarConfig {
  title: string;
  logo: string;
  bgColor: string;
  textColor: string;
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
  backgroundColor: string;
  textColor: string;
}

interface FooterConfig {
  text: string;
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
  pricing: PricingConfig;
  testimonials?: any;
  faq: FAQConfig;
  contact: ContactConfig;
  footer: FooterConfig;
}

// --- Default Content Data Generator ---
const getDefaultContent = (role: string, templateId: string): TemplateContent => {
  if (role === 'schoolcoach') {
    if (templateId === 'template_1') {
      return {
        navbar: { title: 'الأستاذ أحمد محمد', logo: '', bgColor: '#0a1628', textColor: '#ffffff' },
        hero: {
          title: 'تعلم بذكاء. <br/><span class="text-[var(--color-gold-500)]">اضمن تفوقك الدراسي.</span>',
          subtitle: 'معلم الرياضيات القدير',
          description: 'مناهج دراسية مبسطة وأساليب تعليمية حديثة تساعدك على فهم المادة بعمق وتحقيق الدرجة الكاملة في امتحاناتك.',
          buttonText: 'احجز مكانك الآن',
          buttonLink: '#contact',
          secondaryButtonText: 'اعرف المزيد عنا',
          secondaryButtonLink: '#about',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdn5I4iyCWiaDe9m4F8v8n_X00tPqBgqXH4hbDxxtEpcQGhs3Iv7ye36iLKGCPaYsSeLuQ6Q56ZRbKBk10dy_efgKLS3zHuPJjJmYL6JtPlCiByhhruLtE_z5QnQirZ362M0sgpMps7B8icOJUUVS6t_6GJ1K0xma8arDq0yEal-eRoeAXPmexe9Vlvhif39sPxgQQGgyuqPwrz1R2REpb3TQmQAfrbC-2IMbqMBAUhDDImR-r8q5cEQ',
          backgroundColor: '#0a1628',
          textColor: '#ffffff'
        },
        about: {
          title: 'عن الأستاذ أحمد',
          subtitle: 'خبرة تزيد عن ١٠ سنوات في تدريس مناهج الرياضيات للمرحلة الثانوية. نعتمد على الفهم والتحليل وتدريب الطالب على أنماط الامتحانات المختلفة لضمان الثقة والتميز.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsvCKkFFgnTqd7h7Fw_WOHLv_-bXegAz36jnJ-dSBDWKiA81BP1TWumr1WnjULNWm_0CcbVBTge22QX2XN-cBPri3M3xbxSbAGqLIcFlI4XbbEacN9CKm1uRjQqkRnAfjumbe4cbh_txOhsTy_-6Eph6WwWNqlfr7j35tkwUU103Z7NEEpLCcfSvulZ4QoKpglkx4KRxtXU9TRhBm3eChxdvC43k04A-fnMk-IjFugUk9FdZ1nyfYQsA',
          backgroundColor: '#ffffff',
          textColor: '#1a1f29',
          videoTag: 'شاهد وتعلّم',
          videoTitle: 'تعرف على فلسفتنا التعليمية في ٣ دقائق',
          videoDesc: 'نقدم لك جولة سريعة داخل مجموعاتنا التفاعلية المباشرة، ونوضح طريقة المتابعة والتقييمات الدورية للطلاب.',
          videoLink: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop'
        },
        features: {
          title: 'المواد الدراسية',
          subtitle: 'شرح وافٍ وتطبيقات عملية لكل فرع من فروع الرياضيات لضمان الاستيعاب الشامل.',
          items: [
            {
              icon: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
              title: 'الرياضيات البحتة',
              description: 'الجبر، التفاضل والتكامل، وحساب المثلثات للمرحلة الثانوية.'
            },
            {
              icon: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop',
              title: 'الرياضيات التطبيقية',
              description: 'الاستاتيكا والديناميكا لفهم التطبيقات الفيزيائية للرياضيات.'
            },
            {
              icon: 'https://images.unsplash.com/photo-1453733190148-c44698c26588?w=800&auto=format&fit=crop',
              title: 'الإحصاء والاحتمالات',
              description: 'تحليل البيانات والاحتمالات وتطبيقاتها الحيوية.'
            },
            {
              icon: 'https://images.unsplash.com/photo-1635070040807-fbe0f3dbe005cb?w=800&auto=format&fit=crop',
              title: 'القدرات والتحصيلي',
              description: 'دورات مكثفة لاجتياز اختبارات القياس بكفاءة عالية.'
            }
          ],
          backgroundColor: '#eef0f3',
          textColor: '#1a1f29'
        },
        courses: {
          title: 'المواد والدروس التعليمية',
          subtitle: 'اختر مادتك وابدأ التفوق الدراسي فوراً مع شروحات وتطبيقات شاملة.',
          limit: 6,
          showPrice: true,
          showStudentsCount: true,
          gridCols: '3',
          buttonBg: '#3525cd',
          cardBg: '#ffffff',
          titleColor: '#1a1f29',
          backgroundColor: '#ffffff',
          textColor: '#1a1f29',
          items: [],
        },
        pricing: {
          title: 'المجموعات الدراسية المتاحة',
          subtitle: 'احجز مكانك في إحدى مجموعاتنا التفاعلية المباشرة.',
          items: [
            {
              title: 'مجموعة الصف الثالث الثانوي',
              price: 'متاحة للتسجيل',
              features: ['الأيام: الأحد والثلاثاء', 'الوقت: ٦:٠٠ مساءً', 'نوع الدراسة: أونلاين تفاعلي']
            },
            {
              title: 'مجموعة الصف الثاني الثانوي',
              price: 'متاحة للتسجيل',
              features: ['الأيام: الإثنين والأربعاء', 'الوقت: ٥:٠٠ مساءً', 'نوع الدراسة: حضور في المركز']
            },
            {
              title: 'مجموعة التحضير للقدرات',
              price: 'متاحة للتسجيل',
              features: ['الأيام: السبت فقط', 'الوقت: ١٠:٠٠ صباحاً', 'نوع الدراسة: أونلاين مسجل']
            }
          ],
          backgroundColor: '#ffffff',
          textColor: '#1a1f29',
          testimonialsBg: '#f5f2ff',
          testimonialsTextColor: '#1b1b24',
        },
        stats: {
          items: [
            { value: '98%', label: 'نسبة رضا الطلاب' },
            { value: '150+', label: 'منهج دراسي متكامل' },
            { value: '12k+', label: 'خريج متميز' },
            { value: '24/7', label: 'دعم أكاديمي مباشر' }
          ],
          backgroundColor: '',
          textColor: ''
        },
        faq: {
          title: 'الأسئلة الشائعة حول المنهج',
          items: [
            { question: 'أ.د. محمد الشمري - ولي أمر طالبتين', answer: 'الأستاذ أحمد يبسط الرياضيات بطريقة رائعة، ابنتي حصلت على الدرجة النهائية بفضله.' },
            { question: 'رنا عبدالله - طالبة طب هندسي', answer: 'التمارين والامتحانات المكثفة ساعدتني جداً في التحصيلي والقدرات.' },
            { question: 'م. علي عمر - طالب سابق', answer: 'تأسست في الرياضيات على يد الأستاذ أحمد، والآن أدرس هندسة البرمجيات بسهولة.' }
          ],
          backgroundColor: '#f7f8fa',
          textColor: '#1a1f29',
          testimonialsTitle: 'آراء وقصص نجاح الطلاب',
          testimonialsSubtitle: 'ماذا يقول أولياء الأمور وطلابنا بعد تحقيق الدرجة الكاملة والتفوق في امتحاناتهم.'
        },
        contact: {
          title: 'ابدأ رحلة تفوقك اليوم',
          description: 'انضم لأكثر من ١٠,٠٠٠ طالب وطالبة حققوا أحلامهم الدراسية معنا.',
          phoneNumber: '201000000000',
          buttonText: 'احجز مكانك الآن',
          backgroundColor: '#0a1628',
          textColor: '#ffffff'
        },
        footer: {
          text: '© ٢٠٢٦ الأستاذ أحمد محمد. جميع الحقوق محفوظة.',
          backgroundColor: '#0a1628',
          textColor: '#ffffff',
          newsletterTitle: 'اشترك في نشرتنا المعرفية',
          newsletterDesc: 'احصل على نماذج امتحانات، ملخصات ومذكرات للمراجعة مباشرة في بريدك الإلكتروني.',
          newsletterBtnText: 'اشترك الآن'
        }
      };
    } else {
      // School Coach Template 2
      return {
        navbar: { title: 'بوابة المتفوق الأكاديمية', logo: '', bgColor: '#0f172a', textColor: '#ffffff' },
        hero: {
          title: 'تعلّم المناهج الدراسية بأسلوب تفاعلي متطور يناسب جيلك',
          subtitle: 'تعليم إلكتروني بمعايير حديثة ⚡',
          description: 'تغلب على تحديات الدراسة والامتحانات من خلال الفيديوهات القصيرة المركزة وخرائط الذهن والامتحانات التفاعلية الذكية.',
          buttonText: 'ابدأ دراستك فوراً',
          buttonLink: '#courses',
          secondaryButtonText: 'اعرف المزيد عنا',
          secondaryButtonLink: '#about',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
          backgroundColor: '#0f172a',
          textColor: '#ffffff'
        },
        about: {
          title: 'فلسفتنا التعليمية',
          subtitle: 'نحن لا نلقن، بل نساعدك على الفهم العميق والربط بين المفاهيم. نستخدم تكنولوجيا التعليم المبتكرة لجعل تجربة المذاكرة شيقة وسريعة.',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
          backgroundColor: '#1e293b',
          textColor: '#cbd5e1',
          videoTag: 'شاهد وتعلّم',
          videoTitle: 'تعرف على فلسفتنا التعليمية في ٣ دقائق',
          videoDesc: 'نقدم لك جولة سريعة داخل مجموعاتنا التفاعلية المباشرة، ونوضح طريقة المتابعة والتقييمات الدورية للطلاب.',
          videoLink: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop'
        },
        features: {
          title: 'لماذا يفضلنا الطلاب الأوائل؟',
          subtitle: 'نغير الطريقة التقليدية للمذاكرة لتوفر نصف الوقت وتحقق أعلى الدرجات.',
          items: [
            { icon: 'Sparkles', title: 'فيديوهات كبسولة قصيرة', description: 'شرح مبسط لكل فكرة في ١٠ دقائق بدون حشو وملل.' },
            { icon: 'Plus', title: 'خرائط ذهنية رقمية', description: 'ملخصات بصرية تفاعلية تساعدك على تذكر المنهج بسرعة.' },
            { icon: 'Award', title: 'مجتمع دراسي للأسئلة', description: 'تبادل النقاشات مع زملائك وتحت إشراف مباشر للمدرس.' }
          ],
          backgroundColor: '#0f172a',
          textColor: '#ffffff'
        },
        pricing: {
          title: 'خطط دراسة متكاملة للجميع',
          subtitle: 'باقات دفع مرنة تناسب احتياجات الطلاب خلال السنة الدراسية.',
          items: [
            { title: 'الاشتراك الدراسي الشهري', price: '١٨٠ جنيه / شهرياً', features: ['الوصول لكافة الشروحات النشطة', 'اختبارات تقييم ذكية للمستويات', 'مراجعة المخرجات الأسبوعية'] },
            { title: 'الاشتراك الدراسي السنوي المفتوح', price: '٩٠0 جنيه / للعام', features: ['توفير هائل لكامل العام الدراسي', 'وصول حصري لمعسكر المراجعة الختامي', 'ملفات إجابات تفصيلية ونماذج سابقة'] }
          ],
          backgroundColor: '#1e293b',
          textColor: '#ffffff',
          testimonialsBg: '#1e293b',
          testimonialsTextColor: '#ffffff',
        },
        stats: {
          items: [
            { value: '98%', label: 'نسبة رضا الطلاب' },
            { value: '150+', label: 'منهج دراسي متكامل' },
            { value: '12k+', label: 'خريج متميز' },
            { value: '24/7', label: 'دعم أكاديمي مباشر' }
          ],
          backgroundColor: '',
          textColor: ''
        },
        faq: {
          title: 'أسئلة يتكرر طرحها',
          items: [
            { question: 'هل المناهج مطابقة لوزارة التربية والتعليم؟', answer: 'بالتأكيد، مناهجنا محدثة أسبوعياً ومطابقة لأحدث التعديلات والأنظمة والامتحانات الجديدة.' },
            { question: 'كيف يمكن تفعيل الاشتراك الورقي؟', answer: 'يمكنك إدخال كود التفعيل المستلم من المدرسة أو الوكيل ليفتح المحتوى فوراً.' }
          ],
          backgroundColor: '#0f172a',
          textColor: '#ffffff',
          testimonialsTitle: 'آراء وقصص نجاح الطلاب',
          testimonialsSubtitle: 'ماذا يقول أولياء الأمور وطلابنا بعد تحقيق الدرجة الكاملة والتفوق في امتحاناتهم.'
        },
        contact: {
          title: 'تواصل مباشر مع مشرفي الدعم',
          description: 'إذا واجهت أي عقبة تقنية أو ترغب في تفعيل كود، تواصل معنا فوراً.',
          phoneNumber: '201100000000',
          buttonText: 'دعمنا الفني واتساب',
          backgroundColor: '#f59e0b',
          textColor: '#0f172a'
        },
        footer: {
          text: 'بوابة المتفوق الأكاديمية © جميع الحقوق محفوظة لعام ٢٠٢٦',
          backgroundColor: '#0f172a',
          textColor: '#94a3b8',
          newsletterTitle: 'اشترك في نشرتنا المعرفية',
          newsletterDesc: 'احصل على نماذج امتحانات، ملخصات ومذكرات للمراجعة مباشرة في بريدك الإلكتروني.',
          newsletterBtnText: 'اشترك الآن'
        }
      };
    }
  } else if (role === 'coach') {
    return {
      navbar: { title: 'Deep Knowledge', logo: '', bgColor: '#fbfafc', textColor: '#6750a4' },
      hero: {
        title: 'تعمق في المعرفة. <br/> تعلم من الصفوة.',
        subtitle: 'أكاديمية النخبة',
        description: 'مساحة حصرية مصممة للمفكرين والقادة. استكشف مناهج متقدمة وتواصل مع خبراء عالميين في بيئة دراسية مصممة للتركيز العميق والتميز الأكاديمي.',
        buttonText: 'ابدأ رحلتك',
        buttonLink: '#courses',
        secondaryButtonText: 'استكشف المناهج',
        secondaryButtonLink: '#faq',
        image: '',
        backgroundColor: '#fbfafc',
        textColor: '#1c1a22'
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
        videoLink: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop'
      },
      features: {
        title: 'المرشدون الخبراء',
        subtitle: 'نخبة من الأكاديميين والباحثين يرافقونك في رحلتك المعرفية.',
        items: [
          {
            icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6JzKcQHDDohUQuzB8PNfXLDbsl7kf35bgCuG0sQW1h8cNdtvfatA7YI3HqNz6hiRLYcE6oU_P8qcDQyq1S4EDQdGdl3PraTpby8mme9L-kHXgx0kdcdb_pfIEdse9RcYvfBa3_gBCg2QIPqKv9LzEDqHVC0s2nGHMpRBNZve1OBkEhV00ehX4zl5HDvssuq8qkK-Yh14G6Udjd1e6e9VB3D5sX_35J7UvItIiInMbSaBA3ALb7g58eg',
            title: 'د. طارق الحكيم - أستاذ الفلسفة المتقدمة',
            description: 'خبير عالمي في الفلسفة التحليلية والمنطق الرياضي. يقدم رؤى معمقة تتحدى التفكير التقليدي وتبني أسساً معرفية متينة.'
          },
          {
            icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdn5I4iyCWiaDe9m4F8v8n_X00tPqBgqXH4hbDxxtEpcQGhs3Iv7ye36iLKGCPaYsSeLuQ6Q56ZRbKBk10dy_efgKLS3zHuPJjJmYL6JtPlCiByhhruLtE_z5QnQirZ362M0sgpMps7B8icOJUUVS6t_6GJ1K0xma8arDq0yEal-eRoeAXPmexe9Vlvhif39sPxgQQGgyuqPwrz1R2REpb3TQmQAfrbC-2IMbqMBAUhDDImR-r8q5cEQ',
            title: 'د. ليلى المنصور - باحثة في الذكاء المعرفي',
            description: 'رائدة في تقاطع علوم الحاسوب وعلم الأعصاب. تركز أبحاثها على محاكاة الإدراك البشري وتطوير خوارزميات التعلم العميق.'
          },
          {
            icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsvCKkFFgnTqd7h7Fw_WOHLv_-bXegAz36jnJ-dSBDWKiA81BP1TWumr1WnjULNWm_0CcbVBTge22QX2XN-cBPri3M3xbxSbAGqLIcFlI4XbbEacN9CKm1uRjQqkRnAfjumbe4cbh_txOhsTy_-6Eph6WwWNqlfr7j35tkwUU103Z7NEEpLCcfSvulZ4QoKpglkx4KRxtXU9TRhBm3eChxdvC43k04A-fnMk-IjFugUk9FdZ1nyfYQsA',
            title: 'البروفيسور عمر زيدان - خبير الاقتصاد الكلي',
            description: 'مستشار استراتيجي دولي. يحلل الأنظمة الاقتصادية المعقدة ويقدم استراتيجيات تنبؤية للأسواق العالمية الناشئة.'
          }
        ],
        backgroundColor: '#fbfafc',
        textColor: '#1c1a22'
      },
      courses: {
        title: 'المسارات والماستركلاسز المتقدمة',
        subtitle: 'محاضرات تدريبية وورش عمل مصممة لبناء المهارات القيادية والمعرفية.',
        limit: 6,
        showPrice: true,
        showStudentsCount: true,
        gridCols: '3',
        buttonBg: '#6750a4',
        cardBg: '#ffffff',
        titleColor: '#1c1a22',
        backgroundColor: '#fbfafc',
        textColor: '#1c1a22',
        items: [],
      },
      stats: {
        items: [
          { value: '98%', label: 'نسبة رضا الطلاب' },
          { value: '150+', label: 'منهج دراسي متكامل' },
          { value: '12k+', label: 'خريج متميز' },
          { value: '24/7', label: 'دعم أكاديمي مباشر' }
        ],
        backgroundColor: '',
        textColor: ''
      },
      pricing: {
        title: 'سلسلة الماستركلاس',
        subtitle: 'محاضرات مكثفة مسجلة بأعلى جودة سينمائية.',
        items: [
          {
            title: 'بنية التفكير الاستراتيجي',
            price: 'الحلقة 1',
            features: ['45 دقيقة', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXpJX3q5uXYRCJ0P26aOiHCO6ssai534WXEH0acZCxxJWwAnux91BzP3cVQ-I09Yp_BnJZkboDuI3HhAYQROL-qkAZHMuhuMkclUAG-iB_eMV9KhTwCOLORHsHaWcy9cV25oZBqek1WcyH-K5R9Y718rEX4UUTfbLh5s77ovJzp3pdBAXWt2iJtJ7CIN8dP45tCVIqTuiZ_f4GpC49lyi0XC3oxtV9sBrBy2oxubJ8LNQY_adythzF8g']
          },
          {
            title: 'تحليل الأنظمة المعقدة',
            price: 'الحلقة 2',
            features: ['52 دقيقة', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRQTwjFjHqFPLwD4Ia1wHj8tW3Aj0xcQvOR1DdS8lD0jwvVo4Z8mOsjlKrP3zjMBswfUBWkhBM7T1CXK0oMbhlSEYqRFRZrp_4NhP1Zy9u-pnmyE39rj7yU6Fb2ozxaVqoJWdESCHFLQXXywsipGmx4tDJoL-L9l7NFt-LiKT6Dq2A0wbgL4tV4fNVKNjmKmQk8WBlM30SKcRVu-bBJ4ulrQXnxK0_AFMOWOKxv3zOn3pnp0S1N-d-wA']
          }
        ],
        backgroundColor: '#ffffff',
        textColor: '#1c1a22',
        testimonialsBg: '#fbfafc',
        testimonialsTextColor: '#1c1a22',
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
        testimonial3Role: 'باحث أكاديمي في الفلسفة'
      },
      faq: {
        title: 'مسارات المناهج المتقدمة',
        items: [
          { question: 'الأسس المعرفية', answer: 'المستوى الأول' },
          { question: 'المنطق التحليلي', answer: 'التفكير النقدي المتقدم' },
          { question: 'فلسفة العلوم', answer: 'الابستيمولوجيا التطبيقية' }
        ],
        backgroundColor: '#fbfafc',
        textColor: '#1c1a22'
      },
      contact: {
        title: 'Deep Knowledge',
        description: 'أكاديمية النخبة للتعليم العالي المستقل. نبني قادة الفكر للمستقبل من خلال مناهج صارمة وعميقة.',
        phoneNumber: '',
        buttonText: '',
        backgroundColor: '#6750a4',
        textColor: '#ffffff'
      },
      footer: {
        text: '© 2024 Deep Knowledge Academy. All rights reserved.',
        backgroundColor: '#fbfafc',
        textColor: '#1c1a22',
        newsletterTitle: 'اشترك في نشرتنا البريدية المعرفية',
        newsletterDesc: 'احصل على أحدث المقالات التحليلية، والمناهج الجديدة، والماستركلاسز الحصرية مباشرة في بريدك الإلكتروني أسبوعياً.',
        newsletterBtnText: 'اشترك الآن'
      }
    };
  } else {
    // Academy Role ('academy')
    return {
      navbar: { title: 'إديوكور', logo: '', bgColor: '#ffffff', textColor: '#3525cd' },
      hero: {
        title: 'بناء تجربة أكاديمية أكثر ذكاءً.',
        subtitle: 'حل مؤسسي متقدم',
        description: 'اربط الطلاب، والمعلمين، والإداريين على منصة مؤسسية موحدة مصممة لتحقيق التميز القابل للقياس وسير العمل المبسط بكفاءة عالية.',
        buttonText: 'استكشف المنصة',
        buttonLink: '#courses',
        secondaryButtonText: 'طلب عرض توضيحي',
        secondaryButtonLink: '#contact',
        image: 'https://tse4.mm.bing.net/th/id/OIP.CGEfBMBIYoz4Syk_3B8DawHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        backgroundColor: '#fcf8ff',
        textColor: '#1b1b24'
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
        videoLink: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop'
      },
      features: {
        title: 'نظام بيئي أكاديمي متكامل',
        subtitle: 'مجموعة شاملة ومتطورة من الأدوات لإدارة كل جانب من جوانب رحلة التعلم المؤسسية.',
        items: [
          { icon: 'groups', title: 'مركز الطلاب الشامل', description: 'تمكين المتعلمين بلوحات تحكم مخصصة، وتتبع دقيق للتقدم، وأدوات تواصل تعاونية سلسة لبيئة تعليمية محفزة.' },
          { icon: 'assignment_ind', title: 'بوابة المعلمين', description: 'تبسيط تخطيط الدروس، وإدارة الدرجات، وتعزيز تفاعل الطلاب بأدوات متقدمة.' },
          { icon: 'quiz', title: 'محرك التقييم', description: 'اختبارات آمنة وقابلة للتطوير مع تصحيح آلي وتحليلات أداء مفصلة ودقيقة.' },
          { icon: 'insights', title: 'المخرجات والنتائج', description: 'تقارير مؤسسية شاملة لتتبع الفعالية الأكاديمية وإتقان الطلاب للمهارات المطلوبة.' }
        ],
        backgroundColor: '#f5f2ff',
        textColor: '#1b1b24'
      },
      courses: {
        title: 'أحدث الدورات والبرامج الأكاديمية',
        subtitle: 'استكشف مساراتنا التدريبية المتخصصة لتطوير مهاراتك والارتقاء بمسيرتك المهنية.',
        limit: 6,
        showPrice: true,
        showStudentsCount: true,
        gridCols: '3',
        buttonBg: '#3525cd',
        cardBg: '#ffffff',
        titleColor: '#1b1b24',
        backgroundColor: '#ffffff',
        textColor: '#1b1b24',
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
        textColor: ''
      },
      pricing: {
        title: 'المخرجات والنتائج الإحصائية',
        subtitle: 'معدلات تقدم وتحليلات رقمية للفصول الدراسية',
        items: [
          { title: 'طلاب نشطون', price: '12.4k', features: ['بوابات تفاعلية', 'تتبع التقدم'] },
          { title: 'دورات مدارة', price: '320', features: ['فصول مسجلة', 'محاضرات بث مباشر'] },
          { title: 'معدل الإنجاز', price: '87%', features: ['نسبة إتمام مرتفعة', 'التزام أكاديمي'] }
        ],
        backgroundColor: '#fcf8ff',
        textColor: '#1b1b24',
        testimonialsBg: '#f5f2ff',
        testimonialsTextColor: '#1b1b24',
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
        testimonial3Role: 'عضو هيئة التدريس'
      },
      faq: {
        title: 'الأسئلة الشائعة حول إديوكور',
        items: [
          { question: 'هل الحصص البث المباشر مسجلة؟', answer: 'نعم، يتم تسجيل جميع اللقاءات المباشرة ورفعها للمنصة لتعيد مشاهدتها في أي وقت.' },
          { question: 'كيف يساهم إديوكور في تحسين الأداء الأكاديمي؟', answer: 'يوفر النظام تحليلات شاملة تمكن الإداريين والمعلمين من مراقبة التقدم واتخاذ قرارات فورية مدعومة بالبيانات.' }
        ],
        backgroundColor: '#f5f2ff',
        textColor: '#1b1b24'
      },
      contact: {
        title: 'ابْنِ مستقبل التعليم',
        description: 'انضم إلى المؤسسات الرائدة عالميًا في تحويل التجربة الأكاديمية. ارتقِ بمستوى مؤسستك التعليمية وابدأ رحلتك نحو التميز اليوم.',
        phoneNumber: '201000000000',
        buttonText: 'ابدأ الآن',
        backgroundColor: '',
        textColor: ''
      },
      footer: {
        text: '© 2024 إديوكور الأكاديمية. جميع الحقوق محفوظة.',
        backgroundColor: '#ffffff',
        textColor: '#1b1b24',
        newsletterTitle: 'اشترك في نشرتنا البريدية المعرفية',
        newsletterDesc: 'احصل على أحدث المقالات التحليلية، والمناهج الجديدة، والماستركلاسز الحصرية مباشرة في بريدك الإلكتروني أسبوعياً.',
        newsletterBtnText: 'اشترك الآن'
      }
    };
  }
};

export default function PageBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('templateId') || 'template_1';

  // Helper to get HTML for role
  const getHtmlForRole = (role: string, c: TemplateContent) => {
    if (role === 'academy') return getAcademicHtml(c);
    if (role === 'coach') return getCoachHtml(c);
    if (role === 'schoolcoach') return getSchoolCoachHtml(c);
    return '';
  };

  // --- Core States ---
  const [currentRole, setCurrentRole] = useState<'schoolcoach' | 'coach' | 'academy'>('academy');
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template_1');
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState<keyof TemplateContent>('hero');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [openIconPickerIdx, setOpenIconPickerIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sectionsList, setSectionsList] = useState<string[]>(['navbar','hero','about','video','features','courses','stats','pricing','testimonials','faq','contact']);
  const [saving, setSaving] = useState<boolean>(false);
  const lastScrollYRef = useRef<number>(0);

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
      } catch (e) {}
    };

    // Live Background & Text Color Updates across all section banners
    updateStyleAll('[data-section="navbar"]', 'background-color', content.navbar.bgColor);
    updateStyleAll('[data-section="navbar"], [data-section="navbar"] span.text-headline-md, [data-section="navbar"] .text-headline-md, [data-section="navbar"] span.text-primary, [data-section="navbar"] .font-extrabold', 'color', content.navbar.textColor);

    updateStyleAll('[data-section="hero"]', 'background-color', content.hero.backgroundColor);
    updateStyleAll('[data-section="hero"], [data-section="hero"] h1, [data-section="hero"] p', 'color', content.hero.textColor);

    updateStyle('#about-analytics', 'background-color', content.about.backgroundColor);
    updateStyle('#about-analytics', 'color', content.about.textColor);

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
      if (content.about.image) {
        const aboutImgEl = doc.querySelector('#about-analytics img') as HTMLImageElement;
        if (aboutImgEl && aboutImgEl.src !== content.about.image) {
          aboutImgEl.src = content.about.image;
        }
      }

      // Smart Analytics Chart Title, Bar Heights/Curves, & Bar Colors:
      if (!content.about.image) {
        updateText('#about-analytics h3', content.about.analyticsTitle || 'رؤى الأداء المؤسسي');
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
      }

      // Video Intro:
      updateText('#about-video .text-label-md, #about-video .text-xs.font-bold', content.about.videoTag || '');
      updateText('#about-video h2.text-headline-lg, #about-video .text-headline-lg, #about-video .text-3xl.font-extrabold', content.about.videoTitle || '');
      updateText('#about-video p.text-body-lg.font-body-lg, #about-video p.leading-relaxed', content.about.videoDesc || '');
      if (content.about.videoLink) {
        const videoBgEl = doc.querySelector('#about-video .bg-cover') as HTMLElement;
        if (videoBgEl) {
          videoBgEl.style.backgroundImage = `url('${content.about.videoLink}')`;
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
        updateText(`[data-testimonial="${i - 1}"] p.text-slate-500, [data-testimonial="${i - 1}"] p.text-gray-400, [data-testimonial="${i - 1}"] p.text-tertiary`, roleVal || '');
      }
    }

    // 7. FAQ
    if (currentRole === 'schoolcoach') {
      updateText('#testimonials h2.section-title, #testimonials h2', content.faq.testimonialsTitle || '');
      updateText('#testimonials p.text-body-lg.max-w-2xl', content.faq.testimonialsSubtitle || '');
      content.faq.items.forEach((item, idx) => {
        updateText(`[data-section="faq"][data-index="${idx}"] h4`, item.question);
        updateText(`[data-section="faq"][data-index="${idx}"] p.italic`, item.answer);
      });
    } else if (currentRole === 'coach') {
      updateText('[data-section="faq"] > div > div > h2, [data-section="faq"] h2', content.faq.title);
      content.faq.items.forEach((item, idx) => {
        updateText(`[data-section="faq"][data-index="${idx}"] span.font-headline-md, [data-section="faq"][data-index="${idx}"] span.font-body-lg`, item.question);
        updateText(`[data-section="faq"][data-index="${idx}"] div.bg-surface`, item.answer);
      });
    } else {
      updateText('[data-section="faq"] h2', content.faq.title);
      content.faq.items.forEach((item, idx) => {
        updateText(`[data-section="faq"][data-index="${idx}"] h4, [data-section="faq"][data-index="${idx}"] .font-body-lg`, item.question);
        updateText(`[data-section="faq"][data-index="${idx}"] p:nth-of-type(2), [data-section="faq"][data-index="${idx}"] p.italic, [data-section="faq"][data-index="${idx}"] p.text-gray-600`, item.answer);
      });
    }

    // 8. Contact
    updateText('[data-section="contact"] h2.text-display-lg, [data-section="contact"] h2, [data-section="contact"] span.font-headline-md', content.contact.title);
    const contactDescEl = doc.querySelector('[data-section="contact"] p.text-body-lg, [data-section="contact"] p.font-body-md, [data-section="contact"] p.text-on-surface-variant');
    if (contactDescEl && content.contact.description !== undefined && contactDescEl.innerHTML !== content.contact.description) {
      contactDescEl.innerHTML = content.contact.description;
    }
    const contactBtnEl = doc.querySelector('[data-section="contact"] button, [data-section="contact"] a.btn-primary');
    if (contactBtnEl && content.contact.buttonText !== undefined && contactBtnEl.innerHTML !== content.contact.buttonText) {
      contactBtnEl.innerHTML = content.contact.buttonText;
    }

    // 9. Footer
    updateText('#footer-bar span.text-body-md.text-on-surface-variant, #footer-bar .font-body-md.text-on-surface-variant', content.footer.text);
    updateText('#newsletter h2.text-headline-lg, #newsletter h2.text-\\[32px\\]', content.footer.newsletterTitle || '');
    updateText('#newsletter p.text-body-lg.max-w-xl, #newsletter p.leading-relaxed', content.footer.newsletterDesc || '');
    updateText('#newsletter button', content.footer.newsletterBtnText || '');
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
        } catch (e) {}
      }, { passive: true });

      if (lastScrollYRef.current > 0) {
        setTimeout(() => {
          try {
            win.scrollTo({ top: lastScrollYRef.current, behavior: 'instant' });
          } catch (e) {}
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

  // Keep active section and item outline sync inside the iframe document
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
  }, [activeSection, activeItemIndex, content]);

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
        const profile = await getProfileStatus();
        const userData = profile?.data || profile;
        if (userData && userData.role) {
          const roleStr = userData.role.toLowerCase().trim();
          if (roleStr === 'schoolteacher' || roleStr === 'school_teacher' || roleStr === 'schoolcoach') {
            setCurrentRole('schoolcoach');
          } else if (roleStr === 'coach' || roleStr === 'instructor' || roleStr === 'teacher') {
            setCurrentRole('coach');
          } else {
            setCurrentRole('academy');
          }
        }
      } catch (err) {
        console.warn('Failed to load user profile, falling back to default role: academy', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserRole();
  }, []);

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

            // Drive sidebar dropdown from the actual API section order
            const KNOWN_SECTION_TYPES = currentRole === 'academy'
              ? ['navbar','hero','about','video','features','courses','stats','pricing','testimonials','faq','contact']
              : ['navbar','hero','about','video','features','courses','stats','pricing','testimonials','faq','contact','footer'];
            const apiSectionTypes = editorNodes
              .map(n => (n.type === 'course-cards' || n.type === 'courses') ? 'courses' : n.type)
              .filter(t => KNOWN_SECTION_TYPES.includes(t));
            // Merge so we always show all sections; API order wins for sections present
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
            const featuresNode = editorNodes.find(n => n.type === 'features');
            const courseNode = editorNodes.find(n => n.type === 'course-cards' || n.type === 'courses');
            const statsNode = editorNodes.find(n => n.type === 'stats' || n.type === 'kpi-cards');
            const pricingNode = editorNodes.find(n => n.type === 'pricing');
            const faqNode = editorNodes.find(n => n.type === 'faq');
            const contactNode = editorNodes.find(n => n.type === 'contact');
            const footerNode = editorNodes.find(n => n.type === 'footer');

            // Helper: get items already flattened by apiToEditor (node.props.items), 
            // falling back to default items if empty/missing.
            const safeItems = (nodeItems: any[] | undefined | null, defaultItems: any[]) => {
              if (!Array.isArray(nodeItems) || nodeItems.length === 0) return defaultItems;
              // Items from apiToEditor already have props merged at root level
              return nodeItems.map(item => {
                // Ensure required fields have safe values
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

            const parsedContent: TemplateContent = {
              navbar: navbarNode?.props ? {
                title: sv(navbarNode.props.title, fallback.navbar.title),
                logo: sv(navbarNode.props.logo, fallback.navbar.logo),
                bgColor: sv(navbarNode.props.bgColor ?? navbarNode.props.bg_color, fallback.navbar.bgColor),
                textColor: sv(navbarNode.props.textColor ?? navbarNode.props.text_color, fallback.navbar.textColor),
              } : fallback.navbar,

              hero: heroNode?.props ? {
                title: sv(heroNode.props.title, fallback.hero.title),
                subtitle: sv(heroNode.props.subtitle, fallback.hero.subtitle),
                description: sv(heroNode.props.description, fallback.hero.description),
                buttonText: sv(heroNode.props.buttonText ?? heroNode.props.button_text, fallback.hero.buttonText),
                buttonLink: sv(heroNode.props.buttonLink ?? heroNode.props.button_link, fallback.hero.buttonLink),
                secondaryButtonText: sv(heroNode.props.secondaryButtonText ?? heroNode.props.secondary_button_text ?? heroNode.props.demoButtonText ?? heroNode.props.demo_button_text, fallback.hero.secondaryButtonText || 'طلب عرض توضيحي'),
                secondaryButtonLink: sv(heroNode.props.secondaryButtonLink ?? heroNode.props.secondary_button_link ?? heroNode.props.demoButtonLink ?? heroNode.props.demo_button_link, fallback.hero.secondaryButtonLink || '#contact'),
                image: sv(heroNode.props.image, fallback.hero.image),
                backgroundColor: sv(heroNode.props.backgroundColor ?? heroNode.props.background_color ?? heroNode.props.bg_color, fallback.hero.backgroundColor),
                textColor: sv(heroNode.props.textColor ?? heroNode.props.text_color, fallback.hero.textColor),
              } : fallback.hero,

              about: aboutNode?.props ? {
                title: sv(aboutNode.props.title, fallback.about.title),
                subtitle: sv(aboutNode.props.subtitle, fallback.about.subtitle),
                image: sv(aboutNode.props.image, fallback.about.image),
                backgroundColor: sv(aboutNode.props.backgroundColor ?? aboutNode.props.background_color ?? aboutNode.props.bg_color, fallback.about.backgroundColor),
                textColor: sv(aboutNode.props.textColor ?? aboutNode.props.text_color, fallback.about.textColor),
                videoTag: sv(aboutNode.props.videoTag ?? aboutNode.props.video_tag, fallback.about.videoTag),
                videoTitle: sv(aboutNode.props.videoTitle ?? aboutNode.props.video_title, fallback.about.videoTitle),
                videoDesc: sv(aboutNode.props.videoDesc ?? aboutNode.props.video_desc, fallback.about.videoDesc),
                videoLink: sv(aboutNode.props.videoLink ?? aboutNode.props.video_link, fallback.about.videoLink),
                analyticsTitle: sv(aboutNode.props.analyticsTitle ?? aboutNode.props.analytics_title, fallback.about.analyticsTitle),
                analyticsBars: Array.isArray(aboutNode.props.analyticsBars ?? aboutNode.props.analytics_bars) ? (aboutNode.props.analyticsBars ?? aboutNode.props.analytics_bars) : fallback.about.analyticsBars,
                analyticsColor: sv(aboutNode.props.analyticsColor ?? aboutNode.props.analytics_color, fallback.about.analyticsColor),
              } : fallback.about,

              features: featuresNode?.props ? {
                title: sv(featuresNode.props.title, fallback.features.title),
                subtitle: sv(featuresNode.props.subtitle, fallback.features.subtitle),
                items: safeItems(featuresNode.props.items, fallback.features.items),
                backgroundColor: sv(featuresNode.props.backgroundColor ?? featuresNode.props.background_color ?? featuresNode.props.bg_color, fallback.features.backgroundColor),
                textColor: sv(featuresNode.props.textColor ?? featuresNode.props.text_color, fallback.features.textColor),
              } : fallback.features,

              courses: courseNode?.props ? {
                title: sv(courseNode.props.title, fallback.courses?.title || 'أحدث الدورات والبرامج الأكاديمية'),
                subtitle: sv(courseNode.props.subtitle, fallback.courses?.subtitle || 'استكشف مساراتنا التدريبية المتخصصة لتطوير مهاراتك والارتقاء بمسيرتك المهنية.'),
                limit: courseNode.props.limit ? Number(courseNode.props.limit) : (fallback.courses?.limit ?? 6),
                showPrice: courseNode.props.showPrice !== undefined ? Boolean(courseNode.props.showPrice) : (fallback.courses?.showPrice ?? true),
                showStudentsCount: courseNode.props.showStudentsCount !== undefined ? Boolean(courseNode.props.showStudentsCount) : (fallback.courses?.showStudentsCount ?? true),
                gridCols: sv(courseNode.props.gridCols, fallback.courses?.gridCols || '3'),
                buttonBg: sv(courseNode.props.buttonBg, fallback.courses?.buttonBg || '#3525cd'),
                cardBg: sv(courseNode.props.cardBg, fallback.courses?.cardBg || '#ffffff'),
                titleColor: sv(courseNode.props.titleColor, fallback.courses?.titleColor || '#111827'),
                backgroundColor: sv(courseNode.props.backgroundColor ?? courseNode.props.background_color ?? courseNode.props.bg_color, fallback.courses?.backgroundColor || '#ffffff'),
                textColor: sv(courseNode.props.textColor ?? courseNode.props.text_color, fallback.courses?.textColor || '#1b1b24'),
                items: fallback.courses?.items || [],
                courses: courseNode.props.courses || fallback.courses?.courses || [],
              } : fallback.courses,

              stats: statsNode?.props ? {
                items: safeItems(statsNode.props.items || statsNode.props.cards, fallback.stats?.items || []),
                backgroundColor: sv(statsNode.props.backgroundColor ?? statsNode.props.background_color ?? statsNode.props.bg_color, fallback.stats?.backgroundColor || ''),
                textColor: sv(statsNode.props.textColor ?? statsNode.props.text_color, fallback.stats?.textColor || ''),
              } : fallback.stats,

              pricing: pricingNode?.props ? {
                title: sv(pricingNode.props.title, fallback.pricing.title),
                subtitle: sv(pricingNode.props.subtitle, fallback.pricing.subtitle),
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
              } : fallback.pricing,

              faq: faqNode?.props ? {
                title: sv(faqNode.props.title, fallback.faq.title),
                items: safeItems(faqNode.props.items, fallback.faq.items),
                backgroundColor: sv(faqNode.props.backgroundColor ?? faqNode.props.background_color ?? faqNode.props.bg_color, fallback.faq.backgroundColor),
                textColor: sv(faqNode.props.textColor ?? faqNode.props.text_color, fallback.faq.textColor),
                testimonialsTitle: sv(faqNode.props.testimonialsTitle ?? faqNode.props.testimonials_title, fallback.faq.testimonialsTitle),
                testimonialsSubtitle: sv(faqNode.props.testimonialsSubtitle ?? faqNode.props.testimonials_subtitle, fallback.faq.testimonialsSubtitle),
              } : fallback.faq,

              contact: contactNode?.props ? {
                title: sv(contactNode.props.title, fallback.contact.title),
                description: sv(contactNode.props.description, fallback.contact.description),
                phoneNumber: sv(contactNode.props.phoneNumber ?? contactNode.props.phone_number, fallback.contact.phoneNumber),
                buttonText: sv(contactNode.props.buttonText ?? contactNode.props.button_text, fallback.contact.buttonText),
                backgroundColor: sv(contactNode.props.backgroundColor ?? contactNode.props.background_color ?? contactNode.props.bg_color, fallback.contact.backgroundColor),
                textColor: sv(contactNode.props.textColor ?? contactNode.props.text_color, fallback.contact.textColor),
              } : fallback.contact,

              footer: footerNode?.props ? {
                text: sv(footerNode.props.text, fallback.footer.text),
                backgroundColor: sv(footerNode.props.backgroundColor ?? footerNode.props.background_color ?? footerNode.props.bg_color, fallback.footer.backgroundColor),
                textColor: sv(footerNode.props.textColor ?? footerNode.props.text_color, fallback.footer.textColor),
                newsletterTitle: sv(footerNode.props.newsletterTitle ?? footerNode.props.newsletter_title, fallback.footer.newsletterTitle),
                newsletterDesc: sv(footerNode.props.newsletterDesc ?? footerNode.props.newsletter_desc, fallback.footer.newsletterDesc),
                newsletterBtnText: sv(footerNode.props.newsletterBtnText ?? footerNode.props.newsletter_btn_text, fallback.footer.newsletterBtnText),
              } : fallback.footer,
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
  }, [currentRole, activeTemplateId, templateIdParam]);

  // --- Navigation & Action Handlers ---
  const handleGoBack = () => {
    router.push('/academic/website/builder');
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
        { id: 'navbar', type: 'navbar', props: { ...content.navbar, role: currentRole, templateId: activeTemplateId } },
        { id: 'hero', type: 'hero', props: content.hero },
        { id: 'about', type: 'about', props: content.about },
        { id: 'features', type: 'features', props: content.features },
        ...(content.courses ? [{ id: 'courses', type: 'course-cards', props: content.courses }] : []),
        ...(content.stats ? [{ id: 'stats', type: 'stats', props: content.stats }] : []),
        { id: 'pricing', type: 'pricing', props: content.pricing },
        { id: 'faq', type: 'faq', props: content.faq },
        { id: 'contact', type: 'contact', props: content.contact },
        ...(currentRole !== 'academy' ? [{ id: 'footer', type: 'footer', props: content.footer }] : []),
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
        { id: 'navbar', type: 'navbar', props: { ...content.navbar, role: currentRole, templateId: activeTemplateId } },
        { id: 'hero', type: 'hero', props: content.hero },
        { id: 'about', type: 'about', props: content.about },
        { id: 'features', type: 'features', props: content.features },
        ...(content.courses ? [{ id: 'courses', type: 'course-cards', props: content.courses }] : []),
        ...(content.stats ? [{ id: 'stats', type: 'stats', props: content.stats }] : []),
        { id: 'pricing', type: 'pricing', props: content.pricing },
        { id: 'faq', type: 'faq', props: content.faq },
        { id: 'contact', type: 'contact', props: content.contact },
        ...(currentRole !== 'academy' ? [{ id: 'footer', type: 'footer', props: content.footer }] : []),
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
      } catch (e) {}
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
      } catch (e) {}
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
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors border border-slate-200"
            title="الرجوع للرئيسية"
          >
            <ArrowRight className="w-4 h-4" />
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
                  const SECTION_LABELS: Record<string, string> = {
                    navbar:       'شريط التنقل العلوي (Navbar)',
                    hero:         'البانر الترحيبي (Hero Banner)',
                    about:        'النبذة والتعريف (About Section)',
                    video:        'فيديو العرض التعريفي (Video Intro)',
                    features:     'مميزات الأكاديمية (Features)',
                    courses:      'الدورات والبرامج التدريبية (Courses)',
                    stats:        'إحصائيات ورضا الطلاب (Stats & Benefits)',
                    pricing:      'المخرجات والنتائج الإحصائية (Outcomes & Statistics)',
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
          <div className="flex-1 overflow-y-auto p-5">
            <div key={activeSection} className="border border-blue-200 bg-blue-50/10 rounded-2xl p-5 space-y-6 shadow-inner ring-2 ring-blue-600/5 animate-in fade-in duration-300">

              {/* Navbar Editor */}
              {activeSection === 'navbar' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص شريط التنقل</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">اسم شعار الأكاديمية / المعلم</label>
                      <input
                        type="text"
                        value={content.navbar.title}
                        onChange={(e) => handleUpdateField('navbar', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">خلفية الشريط</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.navbar.bgColor}
                            onChange={(e) => handleUpdateField('navbar', 'bgColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.navbar.bgColor}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون نصوص الشعار</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.navbar.textColor}
                            onChange={(e) => handleUpdateField('navbar', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.navbar.textColor}</span>
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
                        value={content.hero.title}
                        onChange={(e) => handleUpdateField('hero', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[70px] resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">العبارة التعريفية الصغيرة (شارة المقدمة)</label>
                      <input
                        type="text"
                        value={content.hero.subtitle}
                        onChange={(e) => handleUpdateField('hero', 'subtitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">شرح وتفاصيل البانر</label>
                      <textarea
                        value={content.hero.description}
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
                        value={content.about.title}
                        onChange={(e) => handleUpdateField('about', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">تفاصيل وسيرة ذاتية (محتوى النبذة)</label>
                      <textarea
                        value={content.about.subtitle}
                        onChange={(e) => handleUpdateField('about', 'subtitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[140px]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">صورة التعريف / البورتفوليو</label>
                      <div className="flex gap-2 items-center">
                        {content.about.image && (
                          <img src={content.about.image} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" alt="about preview" />
                        )}
                        <input
                          type="text"
                          value={content.about.image}
                          onChange={(e) => handleUpdateField('about', 'image', e.target.value)}
                          className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left flex-grow"
                          dir="ltr"
                        />
                      </div>
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

                    {/* Analytics Chart Controls */}
                    {!content.about.image && (
                      <div className="border-t border-slate-100 pt-3 mt-3 space-y-3">
                        <h4 id="about-analytics-editor-header" className="text-[11px] font-extrabold text-slate-700">تخصيص مخطط ورؤى الأداء (Analytics Chart)</h4>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-600">عنوان المخطط الإحصائي</label>
                          <input
                            type="text"
                            value={content.about.analyticsTitle || 'رؤى الأداء المؤسسي'}
                            onChange={(e) => handleUpdateField('about', 'analyticsTitle', e.target.value)}
                            className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
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
                            value={content.about.backgroundColor}
                            onChange={(e) => handleUpdateField('about', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.about.backgroundColor}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون النصوص</label>
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
                      يتم جلب وعرض بيانات الدورات الحقيقية تلقائياً من المنصة. يمكنك تخصيص العناوين، والحد الأقصى للدورات المعروضة، والخيارات أدناه:
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">عنوان قسم الدورات</label>
                      <input
                        type="text"
                        value={content.courses.title}
                        onChange={(e) => handleUpdateField('courses', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">وصف / عنوان فرعي للقسم</label>
                      <textarea
                        value={content.courses.subtitle || ''}
                        onChange={(e) => handleUpdateField('courses', 'subtitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[70px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">الحد الأقصى للدورات</label>
                        <input
                          type="number"
                          min="1"
                          max="24"
                          value={content.courses.limit || 6}
                          onChange={(e) => handleUpdateField('courses', 'limit', parseInt(e.target.value, 10) || 6)}
                          className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">تخطيط الأعمدة</label>
                        <select
                          value={content.courses.gridCols || '3'}
                          onChange={(e) => handleUpdateField('courses', 'gridCols', e.target.value)}
                          className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                        >
                          <option value="2">عمودين (2)</option>
                          <option value="3">3 أعمدة (3)</option>
                          <option value="4">4 أعمدة (4)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={content.courses.showPrice !== false}
                          onChange={(e) => handleUpdateField('courses', 'showPrice', e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs font-bold text-slate-700">إظهار أسعار الدورات</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={content.courses.showStudentsCount !== false}
                          onChange={(e) => handleUpdateField('courses', 'showStudentsCount', e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs font-bold text-slate-700">إظهار عدد الطلاب المسجلين</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">لون الأزرار / الشارة</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.courses.buttonBg || '#3525cd'}
                            onChange={(e) => handleUpdateField('courses', 'buttonBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.courses.buttonBg || '#3525cd'}</span>
                        </div>
                      </div>

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
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص أزرار التواصل</h3>
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

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">رقم الواتساب الاستشاري (مع رمز الدولة)</label>
                      <input
                        type="text"
                        value={content.contact.phoneNumber}
                        onChange={(e) => handleUpdateField('contact', 'phoneNumber', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                        dir="ltr"
                        placeholder="مثال: 966500000000"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">نص زر التواصل / الواتساب</label>
                      <input
                        type="text"
                        value={content.contact.buttonText}
                        onChange={(e) => handleUpdateField('contact', 'buttonText', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
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
              {activeSection === 'footer' && currentRole !== 'academy' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    <h3 className="text-xs font-extrabold text-slate-800">تخصيص تذييل الصفحة (الفوتر)</h3>
                  </div>

                  <div className="space-y-4">
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
                        <label className="text-[11px] font-bold text-slate-600">وصف النشرة البريدية</label>
                        <textarea
                          value={content.footer.newsletterDesc || ''}
                          onChange={(e) => handleUpdateField('footer', 'newsletterDesc', e.target.value)}
                          className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[60px]"
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
