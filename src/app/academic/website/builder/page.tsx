'use client';

import React, { useState, useEffect } from 'react';
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
  coachingMessage?: string;
  image: string;
  backgroundColor: string;
  textColor: string;
  titleColor?: string;
  subtitleColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  secondaryButtonBorderColor?: string;
  secondaryButtonTextColor?: string;
  coachingCardBgColor?: string;
  coachingCardTextColor?: string;
}

interface AboutConfig {
  title: string;
  subtitle: string;
  description?: string;
  biography?: string;
  coachTitle?: string;
  skills?: string[];
  cvText?: string;
  image: string;
  backgroundColor: string;
  textColor: string;
  titleColor?: string;
}

interface FeatureItem {
  id?: string;
  icon: string;
  title: string;
  description: string;
  level?: string;
  duration?: string;
  lessons?: string;
  price?: string;
  ctaText?: string;
  features?: string[];
  image?: string;
}

interface FeaturesConfig {
  title: string;
  subtitle: string;
  items: FeatureItem[];
  backgroundColor: string;
  textColor: string;
  titleColor?: string;
  subtitleColor?: string;
  ctaText?: string;
}

interface PricingItem {
  id?: string;
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
}

interface JourneyStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  icon?: string;
}

interface JourneyConfig {
  title: string;
  subtitle: string;
  steps: JourneyStep[];
  backgroundColor: string;
  textColor: string;
  titleColor?: string;
  stepNumberBgColor?: string;
  stepNumberTextColor?: string;
}

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials?: string;
  review: string;
  rating: number;
}

interface TestimonialsConfig {
  title: string;
  subtitle: string;
  items: TestimonialItem[];
  backgroundColor: string;
  textColor: string;
  titleColor?: string;
}

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

interface FAQConfig {
  title: string;
  subtitle?: string;
  items: FAQItem[];
  backgroundColor: string;
  textColor: string;
  titleColor?: string;
}

interface ContactConfig {
  title: string;
  description: string;
  phoneNumber: string;
  buttonText: string;
  email?: string;
  whatsapp?: string;
  whatsappText?: string;
  emailText?: string;
  phoneText?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  backgroundColor: string;
  textColor: string;
  titleColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

interface FinalCtaConfig {
  title: string;
  description: string;
  icon?: string;
  emailPlaceholder?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  accentColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

interface FooterConfig {
  text: string;
  backgroundColor: string;
  textColor: string;
}

interface TemplateContent {
  navbar: NavbarConfig;
  hero: HeroConfig;
  about: AboutConfig;
  features: FeaturesConfig;
  pricing: PricingConfig;
  journey: JourneyConfig;
  testimonials: TestimonialsConfig;
  faq: FAQConfig;
  contact: ContactConfig;
  finalCta: FinalCtaConfig;
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
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdn5I4iyCWiaDe9m4F8v8n_X00tPqBgqXH4hbDxxtEpcQGhs3Iv7ye36iLKGCPaYsSeLuQ6Q56ZRbKBk10dy_efgKLS3zHuPJjJmYL6JtPlCiByhhruLtE_z5QnQirZ362M0sgpMps7B8icOJUUVS6t_6GJ1K0xma8arDq0yEal-eRoeAXPmexe9Vlvhif39sPxgQQGgyuqPwrz1R2REpb3TQmQAfrbC-2IMbqMBAUhDDImR-r8q5cEQ',
          backgroundColor: '#0a1628',
          textColor: '#ffffff'
        },
        about: {
          title: 'عن الأستاذ أحمد',
          subtitle: 'خبرة تزيد عن ١٠ سنوات في تدريس مناهج الرياضيات للمرحلة الثانوية. نعتمد على الفهم والتحليل وتدريب الطالب على أنماط الامتحانات المختلفة لضمان الثقة والتميز.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsvCKkFFgnTqd7h7Fw_WOHLv_-bXegAz36jnJ-dSBDWKiA81BP1TWumr1WnjULNWm_0CcbVBTge22QX2XN-cBPri3M3xbxSbAGqLIcFlI4XbbEacN9CKm1uRjQqkRnAfjumbe4cbh_txOhsTy_-6Eph6WwWNqlfr7j35tkwUU103Z7NEEpLCcfSvulZ4QoKpglkx4KRxtXU9TRhBm3eChxdvC43k04A-fnMk-IjFugUk9FdZ1nyfYQsA',
          backgroundColor: '#ffffff',
          textColor: '#1a1f29'
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
          textColor: '#1a1f29'
        },
        faq: {
          title: 'الأسئلة الشائعة حول المنهج',
          items: [
            { question: 'أ.د. محمد الشمري - ولي أمر طالبتين', answer: 'الأستاذ أحمد يبسط الرياضيات بطريقة رائعة، ابنتي حصلت على الدرجة النهائية بفضله.' },
            { question: 'رنا عبدالله - طالبة طب هندسي', answer: 'التمارين والامتحانات المكثفة ساعدتني جداً في التحصيلي والقدرات.' },
            { question: 'م. علي عمر - طالب سابق', answer: 'تأسست في الرياضيات على يد الأستاذ أحمد، والآن أدرس هندسة البرمجيات بسهولة.' }
          ],
          backgroundColor: '#f7f8fa',
          textColor: '#1a1f29'
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
          textColor: '#ffffff'
        },
        journey: {
          title: 'رحلة التعلم والتميز',
          subtitle: 'خطوات متسلسلة ومنظمة تحول المعرفة إلى مهارات تطبيقية ملموسة.',
          steps: [
            { id: 'j1', stepNumber: '01', title: 'اختر المادة الدراسية', description: 'حدد الفرع المناسب لمستواك الدراسي.' },
            { id: 'j2', stepNumber: '02', title: 'تابع الدروس والتطبيقات', description: 'شاهد الشروحات التفاعلية واحل الأسئلة.' },
            { id: 'j3', stepNumber: '03', title: 'احصل على التقييم', description: 'تابع مستواك من خلال الامتحانات الذكية.' }
          ],
          backgroundColor: '#eef0f3',
          textColor: '#1a1f29'
        },
        testimonials: {
          title: 'آراء الطلاب وأولياء الأمور',
          subtitle: 'تجارب واقعية من طلاب حققوا الدرجات النهائية.',
          items: [
            { id: 't1', name: 'أحمد سعيد', role: 'طالب ثالث ثانوي', initials: 'أ.س', review: 'الشرح كان واضحاً ومبسطاً جداً، حصلت على المجموع الكلي بفضل الله ثم الأستاذ.', rating: 5 }
          ],
          backgroundColor: '#ffffff',
          textColor: '#1a1f29'
        },
        finalCta: {
          title: 'جاهز لتبدأ رحلة تفوقك الدراسي؟',
          description: 'اشترك الآن في النشرة ليصلك أحدث الملخصات والأسئلة الهامة.',
          icon: 'school',
          emailPlaceholder: 'البريد الإلكتروني',
          buttonText: 'اشترك الآن',
          backgroundColor: '#0a1628',
          textColor: '#ffffff'
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
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
          backgroundColor: '#0f172a',
          textColor: '#ffffff'
        },
        about: {
          title: 'فلسفتنا التعليمية',
          subtitle: 'نحن لا نلقن، بل نساعدك على الفهم العميق والربط بين المفاهيم. نستخدم تكنولوجيا التعليم المبتكرة لجعل تجربة المذاكرة شيقة وسريعة.',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
          backgroundColor: '#1e293b',
          textColor: '#cbd5e1'
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
          textColor: '#ffffff'
        },
        faq: {
          title: 'أسئلة يتكرر طرحها',
          items: [
            { question: 'هل المناهج مطابقة لوزارة التربية والتعليم؟', answer: 'بالتأكيد، مناهجنا محدثة أسبوعياً ومطابقة لأحدث التعديلات والأنظمة والامتحانات الجديدة.' },
            { question: 'كيف يمكن تفعيل الاشتراك الورقي؟', answer: 'يمكنك إدخال كود التفعيل المستلم من المدرسة أو الوكيل ليفتح المحتوى فوراً.' }
          ],
          backgroundColor: '#0f172a',
          textColor: '#ffffff'
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
          textColor: '#94a3b8'
        },
        journey: {
          title: 'رحلة التعلم الحديثة',
          subtitle: 'تعلم تفاعلي وسريع يناسب أسلوب حياتك.',
          steps: [
            { id: 'j1', stepNumber: '01', title: 'شاهد الكبسولة', description: 'شرح ممتع ومكثف.' }
          ],
          backgroundColor: '#0f172a',
          textColor: '#ffffff'
        },
        testimonials: {
          title: 'تجارب الطلاب المتميزين',
          subtitle: 'آراء وتقييمات من مستخدمي المنصة.',
          items: [
            { id: 't1', name: 'سارة خالد', role: 'طالبة', initials: 'س.خ', review: 'التطبيق المباشر والخرائط الذهنية سهلت عليا المذاكرة.', rating: 5 }
          ],
          backgroundColor: '#1e293b',
          textColor: '#ffffff'
        },
        finalCta: {
          title: 'انضم لبوابة المتفوق الأكاديمية',
          description: 'اشترك الآن للحصول على التحديثات والمراجعات.',
          icon: 'sparkles',
          emailPlaceholder: 'البريد الإلكتروني',
          buttonText: 'تفعيل الاشتراك',
          backgroundColor: '#0f172a',
          textColor: '#ffffff'
        }
      };
    }
  } else if (role === 'coach') {
    return {
      navbar: { title: 'Deep Knowledge Academy', logo: '', bgColor: '#faf9fb', textColor: '#4f378a' },
      hero: {
        title: 'تعلّم بوضوح. <br/> طوّر مهاراتك بثقة.',
        subtitle: 'أكاديمية التدريب الشخصي',
        description: 'أكاديمية تعليمية وتدريبية متخصصة تحت إشراف الكوتش مباشرة. نقدم لك كورسات عملية ومبسطة تساعدك على بناء مهارات حقيقية والوصول لأهدافك بخطوات مدروسة.',
        buttonText: 'استكشف الكورسات',
        buttonLink: '#courses',
        secondaryButtonText: 'تعرّف على الكوتش',
        secondaryButtonLink: '#about',
        coachingMessage: 'التوجيه الشخصي — التعلم الفعال يعتمد على الفهم العميق والتطبيق العملي المباشر.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop',
        backgroundColor: '#faf9fb',
        textColor: '#1a1c1d',
        titleColor: '',
        subtitleColor: '',
        buttonBgColor: '#4f378a',
        buttonTextColor: '#ffffff',
        secondaryButtonBorderColor: '#4f378a',
        secondaryButtonTextColor: '#4f378a',
        coachingCardBgColor: '#f4f3f5',
        coachingCardTextColor: '#49454f'
      },
      about: {
        title: 'عن الكوتش',
        subtitle: 'خبرة عملية وتوجيه مستمر للوصول إلى أهدافك التعليمية.',
        description: 'أهلاً بك! أنا مدربك في هذه الأكاديمية. أسعى لتقديم محتوى تعليمي عملي ومباشر يجمع بين الفهم النظري والتطبيق الفعلي، دون تعقيد أو حشو غير ضروري.',
        biography: 'هدفنا هنا ليس مجرد مشاهدة الدروس، بل التأكد من قدرتك على تطبيق كل معلومة تتعلمها، وتطوير مهاراتك خطوة بخطوة للحصول على نتائج ملموسة.',
        coachTitle: 'مدرب وموجه تعليمي',
        skills: ['منهجية مبسطة', 'توجيه شخصي', 'تطبيقات عملية', 'متابعة مستمرة'],
        cvText: '',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
        backgroundColor: '#ffffff',
        textColor: '#1a1c1d',
        titleColor: '#4f378a'
      },
      features: {
        title: 'الدورات التدريبية والكورسات',
        subtitle: 'برامج تعليمية متكاملة مصممة لنقل مهاراتك من المستوى الأساسي إلى الاحترافي.',
        items: [
          {
            id: 'course-analytical-thinking',
            icon: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
            title: 'أساسيات التفكير التحليلي وحل المشكلات',
            description: 'كورس عملي يغطي أدوات التحليل المنطقي واتخاذ القرارات بناءً على بيانات ومعلومات دقيقة.',
            level: 'مبتدئ',
            duration: '٦ أسابيع',
            lessons: '١٢ درس',
            ctaText: 'عرض الكورس',
            price: '',
            features: ['تمارين عملية', 'اختبارات تقييمية', 'شهادة إتمام'],
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop'
          },
          {
            id: 'course-planning-execution',
            icon: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
            title: 'منهجية التخطيط والتنفيذ العملي',
            description: 'تعلم كيفية تحويل الأهداف الكبيرة إلى خطط عمل تنفيذية ومتابعة الإنجاز بفاعلية.',
            level: 'متوسط',
            duration: '٨ أسابيع',
            lessons: '١٥ درس',
            ctaText: 'عرض الكورس',
            price: '',
            features: ['نموذج خطط عمل', 'متابعة أسبوعية', 'تطبيقات حقيقية'],
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop'
          },
          {
            id: 'course-content-writing',
            icon: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
            title: 'صياغة المحتوى وبناء الأفكار الاحترافية',
            description: 'دليل شامل لإتقان صياغة الأفكار وتوصيل الرسائل بوضوح وجاذبية للمستهدفين.',
            level: 'متقدم',
            duration: '٥ أسابيع',
            lessons: '١٠ درس',
            ctaText: 'عرض الكورس',
            price: '',
            features: ['نماذج محتوى', 'تغذية راجعة', 'مشاريع عملية'],
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop'
          }
        ],
        backgroundColor: '#f4f3f5',
        textColor: '#1a1c1d',
        titleColor: '#1a1c1d',
        subtitleColor: '#49454f',
        ctaText: 'عرض الكورس'
      },
      pricing: {
        title: 'الكورسات والدورات التدريبية',
        subtitle: 'دورات مكثفة ومباشرة مصممة للتطبيق العملي.',
        items: [
          {
            id: 'pricing-1',
            title: 'أساسيات التفكير التحليلي',
            price: 'كورس كامل',
            features: ['١٢ درس • ٦ أسابيع']
          },
          {
            id: 'pricing-2',
            title: 'التخطيط والتنفيذ العملي',
            price: 'كورس متقدم',
            features: ['١٥ درس • ٨ أسابيع']
          }
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a1c1d'
      },
      journey: {
        title: 'رحلة التعلم مع الكوتش',
        subtitle: 'خطوات متسلسلة ومنظمة تحول المعرفة إلى مهارات تطبيقية ملموسة.',
        steps: [
          { id: 'j1', stepNumber: '01', title: 'اختر الكورس', description: 'حدد الكورس المناسب لهدفك الحالي.', icon: 'school' },
          { id: 'j2', stepNumber: '02', title: 'ابدأ التعلم', description: 'شاهد الدروس المسجلة في أي وقت.', icon: 'play_circle' },
          { id: 'j3', stepNumber: '03', title: 'طبّق التمارين', description: 'نفّذ المهام التطبيقية المرفقة.', icon: 'assignment_turned_in' },
          { id: 'j4', stepNumber: '04', title: 'احصل على التوجيه', description: 'احصل على ملاحظات وإجابات الكوتش.', icon: 'forum' },
          { id: 'j5', stepNumber: '05', title: 'طوّر مستواك', description: 'حقّق نتائج ملموسة وواصل النمو.', icon: 'update' }
        ],
        backgroundColor: '#f4f3f5',
        textColor: '#1a1c1d',
        titleColor: '#1a1c1d',
        stepNumberBgColor: '#4f378a',
        stepNumberTextColor: '#ffffff'
      },
      testimonials: {
        title: 'آراء الطلاب والمشاركين',
        subtitle: 'تجارب واقعية من متعلمين استفادوا من الكورسات والتوجيه المباشر.',
        items: [
          { id: 't1', name: 'محمد العتيبي', role: 'متعلم مستمر', initials: 'م.ع', review: 'الشرح كان واضحاً جداً، والأهم إني قدرت أطبق اللي اتعلمته عملياً في شغلي من أول أسبوع. التوجيه المباشر اختصر عليا وقت طويل.', rating: 5 },
          { id: 't2', name: 'ريم السعيد', role: 'مستفيدة من الكورسات', initials: 'ر.س', review: 'الكورس كان منظم بشكل ممتاز وبدون أي حشو. الكوتش يركز على التطبيق وعلى إعطاء أمثلة من واقع العمل اليومي.', rating: 5 },
          { id: 't3', name: 'طارق مصطفى', role: 'صانع محتوى', initials: 'ط.م', review: 'كنت أعاني من تشتت الأفكار عند التخطيط لمشروعي. من خلال التمارين والمتابعة، قدرت أصيغ الخطة بوضوح وأبدأ التنفيذ.', rating: 5 }
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a1c1d',
        titleColor: '#1a1c1d'
      },
      faq: {
        title: 'الأسئلة الشائعة',
        subtitle: 'إجابات لأكثر الأسئلة تكراراً حول الكورسات ونظام التعلم.',
        items: [
          { id: 'f1', question: 'هل الكورسات مناسبة للمبتدئين؟', answer: 'نعم، جميع الكورسات مصممة لتبدأ معك من الأساسيات وتتدرج خطوة بخطوة حتى المستوى المتقدم.' },
          { id: 'f2', question: 'هل توجد متابعة أو إجابة على الاستفسارات؟', answer: 'نعم، يمكنك تقديم استفساراتك والحصول على توجيه وإجابة مباشرة من الكوتش.' },
          { id: 'f3', question: 'هل يمكنني التعلم بالسرعة التي تناسبني؟', answer: 'بالتأكيد، المحتوى متاح لك دائماً لتشاهده وتطبقه بالسرعة المناسبة لك.' }
        ],
        backgroundColor: '#faf9fb',
        textColor: '#1a1c1d',
        titleColor: '#1a1c1d'
      },
      contact: {
        title: 'Deep Knowledge Academy',
        description: 'أكاديمية تعليمية وتدريبية متخصصة تحت إشراف الكوتش مباشرة لبناء مهارات عملية ملموسة.',
        phoneNumber: '',
        buttonText: 'تواصل مع الكوتش',
        email: '',
        whatsapp: '',
        whatsappText: 'تواصل واتساب',
        emailText: 'راسلنا عبر البريد',
        phoneText: 'اتصل بنا',
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        backgroundColor: '#4f378a',
        textColor: '#ffffff',
        titleColor: '#ffffff',
        buttonBgColor: '#ffffff',
        buttonTextColor: '#4f378a'
      },
      finalCta: {
        title: 'جاهز لتبدأ رحلة التعلم وتطوير مهاراتك؟',
        description: 'اشترك في النشرة التعليمية ليصلك أحدث الكورسات والدروس المجانية والنصائح العملية مباشرة على بريدك.',
        icon: 'school',
        emailPlaceholder: 'البريد الإلكتروني',
        buttonText: 'اشترك الآن',
        backgroundColor: '#4f378a',
        textColor: '#1a1c1d',
        accentColor: '#E9DDFF',
        buttonBgColor: '#4f378a',
        buttonTextColor: '#ffffff'
      },
      footer: {
        text: '© 2024 Deep Knowledge Academy. جميع الحقوق محفوظة.',
        backgroundColor: '#faf9fb',
        textColor: '#1a1c1d'
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
        buttonLink: '#',
        image: 'https://tse4.mm.bing.net/th/id/OIP.CGEfBMBIYoz4Syk_3B8DawHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        backgroundColor: '#fcf8ff',
        textColor: '#1b1b24'
      },
      about: {
        title: 'تحليلات ذكية لاتخاذ قرارات أفضل',
        subtitle: 'راقب الأداء الأكاديمي، وحدد الاتجاهات، وقم بتحسين المخرجات التعليمية من خلال لوحات تحكم تحليلية متقدمة توفر رؤى في الوقت الفعلي.',
        image: '',
        backgroundColor: '#ffffff',
        textColor: '#1b1b24'
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
      pricing: {
        title: 'المخرجات والنتائج الإحصائية',
        subtitle: 'معدلات تقدم وتحليلات رقمية للفصول الدراسية',
        items: [
          { title: 'طلاب نشطون', price: '12.4k', features: ['بوابات تفاعلية', 'تتبع التقدم'] },
          { title: 'دورات مدارة', price: '320', features: ['فصول مسجلة', 'محاضرات بث مباشر'] },
          { title: 'معدل الإنجاز', price: '87%', features: ['نسبة إتمام مرتفعة', 'التزام أكاديمي'] }
        ],
        backgroundColor: '#fcf8ff',
        textColor: '#1b1b24'
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
        backgroundColor: '#3525cd',
        textColor: '#ffffff'
      },
      footer: {
        text: '© 2024 إديوكور الأكاديمية. جميع الحقوق محفوظة.',
        backgroundColor: '#ffffff',
        textColor: '#1b1b24'
      },
      journey: {
        title: 'رحلة التميز الأكاديمي المؤسسي',
        subtitle: 'مسار منظومة العمل الأكاديمي التحليلي.',
        steps: [
          { id: 'j1', stepNumber: '01', title: 'التهيئة والتكامل', description: 'ربط الأنظمة الأكاديمية وإعداد اللوحات.' }
        ],
        backgroundColor: '#f5f2ff',
        textColor: '#1b1b24'
      },
      testimonials: {
        title: 'آراء وتقييمات القيادات الأكاديمية',
        subtitle: 'تجارب واقعية من مؤسسات تعليمية رائدة.',
        items: [
          { id: 't1', name: 'د. خالد العمري', role: 'عميد القبول والتسجيل', initials: 'خ.ع', review: 'نظام متكامل ساهم في تحسين التحليلات وكفاءة اتخاذ القرار.', rating: 5 }
        ],
        backgroundColor: '#ffffff',
        textColor: '#1b1b24'
      },
      finalCta: {
        title: 'جاهز لبناء مستقبل التعليم المؤسسي؟',
        description: 'ارتق بمؤسستك التعليمية اليوم معنا.',
        icon: 'insights',
        emailPlaceholder: 'البريد المؤسسي',
        buttonText: 'تواصل معنا',
        backgroundColor: '#3525cd',
        textColor: '#ffffff'
      }
    };
  }
};

export default function PageBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('templateId') || 'template_1';

  // --- Core States ---
  const [currentRole, setCurrentRole] = useState<'schoolcoach' | 'coach' | 'academy'>('academy');
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template_1');
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState<keyof TemplateContent>('hero');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sectionsList, setSectionsList] = useState<string[]>(['navbar','hero','features','about','pricing','testimonials','faq','contact','finalCta','footer']);
  const [saving, setSaving] = useState<boolean>(false);

  // Dynamic template content configurations
  const [content, setContent] = useState<TemplateContent | null>(null);
  const [previewContent, setPreviewContent] = useState<TemplateContent | null>(null);

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

    // 1. Navbar
    updateText('[data-section="navbar"] span.text-headline-md, [data-section="navbar"] span.text-\\[22px\\], [data-section="navbar"] span.font-extrabold', content.navbar.title);

    // 2. Hero
    updateText('[data-section="hero"] h1', content.hero.title);
    updateText('[data-section="hero"] p', content.hero.description);
    updateText('[data-section="hero"] .text-label-md.text-primary, [data-section="hero"] .bg-gold-500\\/10 span, [data-section="hero"] .eyebrow-line', content.hero.subtitle);
    updateText('[data-section="hero"] button, [data-section="hero"] a.btn-primary', content.hero.buttonText);

    // 3. About
    updateText('[data-section="about"] h2, [data-section="about"] h3', content.about.title);
    updateText('[data-section="about"] p', content.about.subtitle);

    // 4. Features
    updateText('[data-section="features"] h2, [data-section="features"] h3, #subjects h2', content.features.title);
    const featuresHeaderDesc = doc.querySelector('[data-section="features"] .text-center p, #subjects .text-center p');
    if (featuresHeaderDesc && featuresHeaderDesc.innerHTML !== content.features.subtitle) {
      featuresHeaderDesc.innerHTML = content.features.subtitle;
    }
    content.features.items.forEach((item, idx) => {
      updateText(`[data-section="features"][data-index="${idx}"] h3, [data-section="features"][data-index="${idx}"] h4`, item.title);
      updateText(`[data-section="features"][data-index="${idx}"] p`, item.description);
    });

    // 5. Pricing
    updateText('[data-section="pricing"] h2, [data-section="pricing"] h3, #groups h2', content.pricing.title);
    const pricingHeaderDesc = doc.querySelector('[data-section="pricing"] .text-center p, #groups .text-center p');
    if (pricingHeaderDesc && pricingHeaderDesc.innerHTML !== content.pricing.subtitle) {
      pricingHeaderDesc.innerHTML = content.pricing.subtitle;
    }
    content.pricing.items.forEach((item, idx) => {
      updateText(`[data-section="pricing"][data-index="${idx}"] h3, [data-section="pricing"][data-index="${idx}"] h4`, item.title);
      updateText(`[data-section="pricing"][data-index="${idx}"] .text-headline-md, [data-section="pricing"][data-index="${idx}"] .text-primary, [data-section="pricing"][data-index="${idx}"] .block.text-xs`, item.price);
    });

    // 6. FAQ / Testimonials
    updateText('[data-section="faq"] h2, [data-section="faq"] h3, #testimonials h2', content.faq.title);
    content.faq.items.forEach((item, idx) => {
      updateText(`[data-section="faq"][data-index="${idx}"] h4, [data-section="faq"][data-index="${idx}"] .font-body-lg, [data-section="faq"][data-index="${idx}"] .font-headline-md`, item.question);
      updateText(`[data-section="faq"][data-index="${idx}"] p:nth-of-type(2), [data-section="faq"][data-index="${idx}"] p.italic, [data-section="faq"][data-index="${idx}"] .bg-surface, [data-section="faq"][data-index="${idx}"] p.text-gray-600`, item.answer);
    });

    // 7. Contact
    updateText('[data-section="contact"] h2, [data-section="contact"] h3', content.contact.title);
    updateText('[data-section="contact"] p', content.contact.description);
    updateText('[data-section="contact"] button, [data-section="contact"] a.btn-primary, [data-section="contact"] a.bg-emerald-500 span, [data-section="contact"] a.btn-primary span', content.contact.buttonText);

    // 8. Footer
    updateText('[data-section="footer"] p, footer p', content.footer.text);
  }, [content]);

  // Helper to find target section element in preview document
  const getSectionElement = (doc: Document, sectionName: string): HTMLElement | null => {
    if (!doc) return null;

    // 1. Direct data-section query
    let el = doc.querySelector(`[data-section="${sectionName}"]`) as HTMLElement;
    if (el) return el;

    // 2. Direct ID query
    el = doc.getElementById(sectionName) as HTMLElement;
    if (el) return el;

    // 3. Robust alias map for template variations
    const ALIAS_MAP: Record<string, string[]> = {
      navbar: ['[data-section="navbar"]', '#navbar', 'nav', 'header'],
      hero: ['[data-section="hero"]', '#home', '#hero', '#hero-banner'],
      about: ['[data-section="about"]', '#about', '#bio'],
      features: ['[data-section="features"]', '#features', '#courses', '#subjects'],
      pricing: ['[data-section="pricing"]', '#pricing', '#groups', '#courses', '[data-section="features"]'],
      faq: ['[data-section="faq"]', '#faq', '#testimonials'],
      contact: ['[data-section="contact"]', '#contact', '#newsletter', 'footer [data-section="contact"]'],
      footer: ['[data-section="footer"]', '#footer', 'footer'],
    };

    const selectors = ALIAS_MAP[sectionName] || [];
    for (const selector of selectors) {
      el = doc.querySelector(selector) as HTMLElement;
      if (el) return el;
    }

    return null;
  };

  // Auto-scroll preview window to the active section
  const scrollToPreviewSection = (sectionName: string, smooth: boolean = true) => {
    if (!sectionName) return;

    // Try iframe first
    const iframe = document.getElementById('website-builder-iframe') as HTMLIFrameElement;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const targetEl = getSectionElement(doc, sectionName);
        if (targetEl) {
          targetEl.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'start',
          });
          return;
        }
      }
    }

    // Fallback for non-iframe preview container
    const targetEl = getSectionElement(document, sectionName);
    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'start',
      });
    }
  };

  // Handle iframe document load: inject hover outlines, click selections, and restore scroll position
  const handleIframeLoad = () => {
    const iframe = document.getElementById('website-builder-iframe') as HTMLIFrameElement;
    if (!iframe || !iframe.contentDocument) return;
    const doc = iframe.contentDocument;

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
      const itemEl = target.closest('[data-index]') as HTMLElement | null;
      const sectionEl = target.closest('[data-section]') as HTMLElement | null;

      if (sectionEl) {
        event.preventDefault();
        event.stopPropagation();

        const sectionName = sectionEl.getAttribute('data-section') as keyof TemplateContent;
        
        // Update iframe visual classes
        doc.querySelectorAll('[data-section]').forEach(el => el.classList.remove('active-section'));
        sectionEl.classList.add('active-section');

        setActiveSection(sectionName);

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

    // 3. Instantly restore scroll position to active section when iframe loads/reloads
    if (activeSection) {
      setTimeout(() => {
        scrollToPreviewSection(activeSection, false);
      }, 30);
    }
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

    // Scroll preview to active section
    if (activeSection) {
      scrollToPreviewSection(activeSection, true);
    }
  }, [activeSection, activeItemIndex, previewContent]);

  const handleSelectSectionItem = (section: keyof TemplateContent, index: number) => {
    setActiveSection(section);
    setActiveItemIndex(index);
    scrollToPreviewSection(section, true);
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
            const KNOWN_SECTION_TYPES = ['navbar','hero','about','features','pricing','faq','contact','footer'];
            const apiSectionTypes = editorNodes
              .map(n => n.type)
              .filter(t => KNOWN_SECTION_TYPES.includes(t));
            // Merge so we always show all 8; API order wins for sections present
            const merged = [
              ...apiSectionTypes,
              ...KNOWN_SECTION_TYPES.filter(t => !apiSectionTypes.includes(t))
            ];
            setSectionsList(merged);
            
            // Reconstruct content state from database sections!
            const fallback = getDefaultContent(currentRole, activeTemplateId);
            
            const navbarNode = editorNodes.find(n => n.type === 'navbar');
            const heroNode = editorNodes.find(n => n.type === 'hero');
            const aboutNode = editorNodes.find(n => n.type === 'about');
            const featuresNode = editorNodes.find(n => n.type === 'features');
            const pricingNode = editorNodes.find(n => n.type === 'pricing');
            const journeyNode = editorNodes.find(n => n.type === 'journey');
            const testimonialsNode = editorNodes.find(n => n.type === 'testimonials');
            const faqNode = editorNodes.find(n => n.type === 'faq');
            const contactNode = editorNodes.find(n => n.type === 'contact');
            const finalCtaNode = editorNodes.find(n => n.type === 'finalCta');
            const footerNode = editorNodes.find(n => n.type === 'footer');

            const parsedContent: TemplateContent = {
              navbar: navbarNode?.props ? { ...fallback.navbar, ...navbarNode.props } : fallback.navbar,
              hero: heroNode?.props ? { ...fallback.hero, ...heroNode.props } : fallback.hero,
              about: aboutNode?.props ? { ...fallback.about, ...aboutNode.props } : fallback.about,
              features: featuresNode?.props ? { ...fallback.features, ...featuresNode.props } : fallback.features,
              pricing: pricingNode?.props ? { ...fallback.pricing, ...pricingNode.props } : fallback.pricing,
              journey: journeyNode?.props ? { ...fallback.journey, ...journeyNode.props } : fallback.journey,
              testimonials: testimonialsNode?.props ? { ...fallback.testimonials, ...testimonialsNode.props } : fallback.testimonials,
              faq: faqNode?.props ? { ...fallback.faq, ...faqNode.props } : fallback.faq,
              contact: contactNode?.props ? { ...fallback.contact, ...contactNode.props } : fallback.contact,
              finalCta: finalCtaNode?.props ? { ...fallback.finalCta, ...finalCtaNode.props } : fallback.finalCta,
              footer: footerNode?.props ? { ...fallback.footer, ...footerNode.props } : fallback.footer,
            };
            setContent(parsedContent);
            setPreviewContent(parsedContent);
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
          setLoading(false);
          return;
        } catch (e) {
          console.error(e);
        }
      }
      const defaults = getDefaultContent(currentRole, activeTemplateId);
      setContent(defaults);
      setPreviewContent(defaults);
      setLoading(false);
    }
    
    loadPageData();
  }, [currentRole, activeTemplateId, templateIdParam]);

  // --- Navigation & Action Handlers ---
  const handleGoBack = () => {
    router.push('/academic/templates');
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
        { id: 'pricing', type: 'pricing', props: content.pricing },
        { id: 'faq', type: 'faq', props: content.faq },
        { id: 'contact', type: 'contact', props: content.contact },
        { id: 'footer', type: 'footer', props: content.footer }
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
        { id: 'pricing', type: 'pricing', props: content.pricing },
        { id: 'faq', type: 'faq', props: content.faq },
        { id: 'contact', type: 'contact', props: content.contact },
        { id: 'footer', type: 'footer', props: content.footer }
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
    toast.success('تمت إعادة تعيين القيم الافتراضية للقالب.');
  };

  // --- Specific Content Fields Handlers ---
  const handleUpdateField = (section: keyof TemplateContent, field: string, value: any) => {
    if (!content) return;
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [field]: value
      }
    });
  };

  const handleUpdateNestedField = (section: keyof TemplateContent, nestedKey: string, index: number, field: string, value: any) => {
    if (!content) return;
    const arrayCopy = [...(content[section] as any)[nestedKey]];
    arrayCopy[index] = {
      ...arrayCopy[index],
      [field]: value
    };
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [nestedKey]: arrayCopy
      }
    });
  };

  const handleAddListItem = (section: keyof TemplateContent, nestedKey: string, newItemTemplate: any) => {
    if (!content) return;
    const arrayCopy = [...(content[section] as any)[nestedKey]];
    arrayCopy.push(newItemTemplate);
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [nestedKey]: arrayCopy
      }
    });
  };

  const handleRemoveListItem = (section: keyof TemplateContent, nestedKey: string, index: number) => {
    if (!content) return;
    const arrayCopy = [...(content[section] as any)[nestedKey]];
    if (arrayCopy.length <= 1) {
      toast.error('يجب توفر عنصر واحد على الأقل في هذا القسم.');
      return;
    }
    const filtered = arrayCopy.filter((_, i) => i !== index);
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [nestedKey]: filtered
      }
    });
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
            title="رجوع للقوالب"
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
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              deviceMode === 'desktop' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
            title="شاشة كمبيوتر"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              deviceMode === 'tablet' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
            title="شاشة تابلت"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              deviceMode === 'mobile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
            title="شاشة جوال"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Role & Template switcher panel + Save action */}
        <div className="flex items-center gap-3">
          
          {/* Simulated Role Selection for Testing */}
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
            <span className="text-[10px] font-bold text-slate-500">مستوى صلاحياتك:</span>
            <select
              value={currentRole}
              onChange={(e) => {
                const nextRole = e.target.value as any;
                setCurrentRole(nextRole);
                toast.success(`تم تبديل المستوى إلى: ${nextRole === 'schoolcoach' ? 'مدرس / مدرسة' : nextRole === 'coach' ? 'مدرب شخصي' : 'أكاديمية'}`);
              }}
              className="border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-extrabold bg-slate-50 hover:bg-white text-slate-700 outline-none cursor-pointer focus:border-blue-500 transition-colors"
            >
              <option value="schoolcoach">المدرس / المدرسة (School Coach)</option>
              <option value="coach">مدرب مستقل (Coach)</option>
              <option value="academy">أكاديمية تدريب معتمدة (Academy)</option>
            </select>
          </div>

          {/* Template Selection */}
          <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl">
            <button
              onClick={() => setActiveTemplateId('template_1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeTemplateId === 'template_1' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              القالب الأول
            </button>
            <button
              onClick={() => setActiveTemplateId('template_2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeTemplateId === 'template_2' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-900'
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
                  const newSec = e.target.value as any;
                  setActiveSection(newSec);
                  setActiveItemIndex(null);
                  scrollToPreviewSection(newSec, true);
                }}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-white font-extrabold focus:outline-none focus:border-blue-600 cursor-pointer pr-8 text-slate-800"
              >
                {sectionsList.map((sectionType) => {
                  const SECTION_LABELS: Record<string, string> = {
                    navbar:      'شريط التنقل العلوي (Navbar)',
                    hero:        'البانر الترحيبي (Hero Banner)',
                    features:    'الكورسات والبرامج التدريبية (Features/Courses)',
                    about:       'التعريف بالكوتش (About Coach)',
                    pricing:     'بطاقات الكورسات والاشتراكات (Curriculum/Pricing)',
                    testimonials:'آراء الطلاب والمشاركين (Testimonials)',
                    faq:         'الأسئلة الشائعة (FAQ Accordions)',
                    contact:     'أزرار التواصل (Contact/WhatsApp)',
                    finalCta:    'الدعوة النهائية / الاشتراك في النشرة (Final CTA)',
                    footer:      'تذييل الصفحة (Footer Bar)',
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
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[90px] resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">نص رسالة بطاقة التوجيه الشخصي أسفل البانر</label>
                    <textarea
                      value={content.hero.coachingMessage}
                      onChange={(e) => handleUpdateField('hero', 'coachingMessage', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[60px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">نص زر الإجراء الأساسي (CTA)</label>
                      <input
                        type="text"
                        value={content.hero.buttonText}
                        onChange={(e) => handleUpdateField('hero', 'buttonText', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">رابط زر الإجراء الأساسي</label>
                      <input
                        type="text"
                        value={content.hero.buttonLink}
                        onChange={(e) => handleUpdateField('hero', 'buttonLink', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">نص الزر الثانوي</label>
                      <input
                        type="text"
                        value={content.hero.secondaryButtonText}
                        onChange={(e) => handleUpdateField('hero', 'secondaryButtonText', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">رابط الزر الثانوي</label>
                      <input
                        type="text"
                        value={content.hero.secondaryButtonLink}
                        onChange={(e) => handleUpdateField('hero', 'secondaryButtonLink', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                        dir="ltr"
                      />
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

                  <div className="pt-1 border-t border-slate-100">
                    <div className="text-[10px] font-black text-slate-500 mb-2.5">خلفية ونصوص البانر:</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">خلفية البانر</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.backgroundColor}
                            onChange={(e) => handleUpdateField('hero', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.hero.backgroundColor}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">لون نصوص البانر</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.textColor || '#1a1c1d'}
                            onChange={(e) => handleUpdateField('hero', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.hero.textColor || '#1a1c1d'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">لون العنوان الترحيبي</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.titleColor || content.hero.textColor || '#1a1c1d'}
                            onChange={(e) => handleUpdateField('hero', 'titleColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.hero.titleColor || content.hero.textColor || '#1a1c1d'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">لون العبارة التعريفية</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.subtitleColor || content.hero.textColor || '#49454f'}
                            onChange={(e) => handleUpdateField('hero', 'subtitleColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.hero.subtitleColor || content.hero.textColor || '#49454f'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <div className="text-[10px] font-black text-slate-500 mb-2.5">ألوان الأزرار:</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">خلفية زر الإجراء الأساسي</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.buttonBgColor || '#4f378a'}
                            onChange={(e) => handleUpdateField('hero', 'buttonBgColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.hero.buttonBgColor || '#4f378a'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">نص زر الإجراء الأساسي</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.buttonTextColor || '#ffffff'}
                            onChange={(e) => handleUpdateField('hero', 'buttonTextColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.hero.buttonTextColor || '#ffffff'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">إطار الزر الثانوي</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.secondaryButtonBorderColor || '#4f378a'}
                            onChange={(e) => handleUpdateField('hero', 'secondaryButtonBorderColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.hero.secondaryButtonBorderColor || '#4f378a'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">نص الزر الثانوي</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.secondaryButtonTextColor || '#4f378a'}
                            onChange={(e) => handleUpdateField('hero', 'secondaryButtonTextColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.hero.secondaryButtonTextColor || '#4f378a'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <div className="text-[10px] font-black text-slate-500 mb-2.5">بطاقة الرسالة أسفل البانر:</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">خلفية البطاقة</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.coachingCardBgColor || '#f4f3f5'}
                            onChange={(e) => handleUpdateField('hero', 'coachingCardBgColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.hero.coachingCardBgColor || '#f4f3f5'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">لون نص الرسالة</label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                          <input
                            type="color"
                            value={content.hero.coachingCardTextColor || '#49454f'}
                            onChange={(e) => handleUpdateField('hero', 'coachingCardTextColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                          />
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.hero.coachingCardTextColor || '#49454f'}</span>
                        </div>
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
                  <h3 className="text-xs font-extrabold text-slate-800">تخصيص التعريف بالكوتش (About Section)</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">الاسم / اسم الكوتش</label>
                      <input
                        type="text"
                        value={content.about.title}
                        onChange={(e) => handleUpdateField('about', 'title', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">المسمى الوظيفي / لقبه</label>
                      <input
                        type="text"
                        value={content.about.coachTitle || ''}
                        onChange={(e) => handleUpdateField('about', 'coachTitle', e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">عنوان العنوان المختصر / السلا</label>
                    <input
                      type="text"
                      value={content.about.subtitle}
                      onChange={(e) => handleUpdateField('about', 'subtitle', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">نبذة تعريفية قصيرة</label>
                    <textarea
                      value={content.about.description || ''}
                      onChange={(e) => handleUpdateField('about', 'description', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[90px] resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">السيرة الذاتية المطولة / ال CV</label>
                    <textarea
                      value={content.about.biography || content.about.cvText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!content) return;
                        setContent({
                          ...content,
                          about: {
                            ...content.about,
                            biography: val,
                            cvText: val
                          }
                        });
                      }}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[120px] resize-none"
                      placeholder="أدخل نص السيرة الذاتية أو نبذة الكوتش هنا..."
                    />
                  </div>

                  {currentRole !== 'coach' && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">المهارات / نقاط القوة (افصل بفاصلة)</label>
                      <input
                        type="text"
                        value={(content.about.skills || []).join('، ')}
                        onChange={(e) => {
                          const skills = e.target.value.split(/[،,]/).map(s => s.trim()).filter(Boolean);
                          handleUpdateField('about', 'skills', skills);
                        }}
                        className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                        placeholder="مثال: منهجية مبسطة، توجيه شخصي، تطبيقات عملية"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">صورة الكوتش / البروفايل</label>
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

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">خلفية القسم</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input
                          type="color"
                          value={content.about.backgroundColor}
                          onChange={(e) => handleUpdateField('about', 'backgroundColor', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                        />
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.about.backgroundColor}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">لون النص العام</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input
                          type="color"
                          value={content.about.textColor || '#1a1c1d'}
                          onChange={(e) => handleUpdateField('about', 'textColor', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                        />
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.about.textColor || '#1a1c1d'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">لون العنوان</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input
                          type="color"
                          value={content.about.titleColor || content.about.textColor || '#4f378a'}
                          onChange={(e) => handleUpdateField('about', 'titleColor', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                        />
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.about.titleColor || content.about.textColor || '#4f378a'}</span>
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
                  <h3 className="text-xs font-extrabold text-slate-800">تخصيص الكورسات والبرامج التدريبية (Features / Courses)</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">عنوان قسم الكورسات الرئيسي</label>
                    <input
                      type="text"
                      value={content.features.title}
                      onChange={(e) => handleUpdateField('features', 'title', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">وصف قصير للقسم</label>
                    <input
                      type="text"
                      value={content.features.subtitle}
                      onChange={(e) => handleUpdateField('features', 'subtitle', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">نص افتراضي لزر "عرض الكورس"</label>
                    <input
                      type="text"
                      value={content.features.ctaText || 'عرض الكورس'}
                      onChange={(e) => handleUpdateField('features', 'ctaText', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">خلفية القسم</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input
                          type="color"
                          value={content.features.backgroundColor}
                          onChange={(e) => handleUpdateField('features', 'backgroundColor', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                        />
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.features.backgroundColor}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">لون العنوان</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input
                          type="color"
                          value={content.features.titleColor || content.features.textColor || '#1a1c1d'}
                          onChange={(e) => handleUpdateField('features', 'titleColor', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                        />
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.features.titleColor || content.features.textColor || '#1a1c1d'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">لون الوصف</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input
                          type="color"
                          value={content.features.subtitleColor || '#49454f'}
                          onChange={(e) => handleUpdateField('features', 'subtitleColor', e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                        />
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{content.features.subtitleColor || '#49454f'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Items list */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500">قائمة الكورسات:</span>
                    <button
                      type="button"
                      onClick={() => handleAddListItem('features', 'items', { id: `course-${Date.now()}`, icon: '', title: 'كورس جديد', description: 'اكتب وصف الكورس هنا بشكل مبسط وجذاب.', level: 'مبتدئ', duration: '', lessons: '', ctaText: (content.features.ctaText || 'عرض الكورس'), features: [] })}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      إضافة كورس
                    </button>
                  </div>

                  <div className="space-y-4">
                    {content.features.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        id={`editor-item-features-${idx}`}
                        className={`border rounded-xl p-3 relative flex flex-col gap-2.5 transition-all duration-300 ${
                          activeSection === 'features' && activeItemIndex === idx
                            ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.01]'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveListItem('features', 'items', idx)}
                          className="absolute top-2 left-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="حذف الكورس"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">معرف ثابت للكورس (ID)</label>
                          <input
                            type="text"
                            value={item.id || `course-${idx}`}
                            onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'id', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none font-mono text-left"
                            dir="ltr"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">صورة / أيقونة الكورس (رابط)</label>
                          <div className="flex gap-2 items-center">
                            {item.icon && (item.icon.startsWith('http') || item.icon.includes('/')) && (
                              <img src={item.icon} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" alt="preview" />
                            )}
                            <input
                              type="text"
                              value={item.icon}
                              onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'icon', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none font-mono flex-1 text-left"
                              dir="ltr"
                              placeholder="https://..."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-[9px] font-bold text-slate-500">عنوان الكورس</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'title', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-bold"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">المستوى</label>
                            <input
                              type="text"
                              value={item.level || ''}
                              onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'level', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none font-bold text-center"
                              placeholder="مبتدئ / متوسط / متقدم"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">المدة</label>
                            <input
                              type="text"
                              value={item.duration || ''}
                              onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'duration', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none text-center"
                              placeholder="٦ أسابيع"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">عدد الدروس</label>
                            <input
                              type="text"
                              value={item.lessons || ''}
                              onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'lessons', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none text-center"
                              placeholder="١٢ درس"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">السعر (اختياري)</label>
                            <input
                              type="text"
                              value={item.price || ''}
                              onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'price', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none font-extrabold text-center"
                              placeholder="مجاني"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">وصف الكورس</label>
                          <textarea
                            value={item.description}
                            onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'description', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none min-h-[50px] resize-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">ميزات الكورس / النقاط (افصل بفاصلة)</label>
                          <input
                            type="text"
                            value={(item.features || []).join('، ')}
                            onChange={(e) => {
                              const arr = e.target.value.split(/[،,]/).map(s => s.trim()).filter(Boolean);
                              handleUpdateNestedField('features', 'items', idx, 'features', arr);
                            }}
                            className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none"
                            placeholder="تمارين عملية • اختبارات تقييمية • شهادة إتمام"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">نص زر عرض التفاصيل</label>
                          <input
                            type="text"
                            value={item.ctaText || (content.features.ctaText || 'عرض الكورس')}
                            onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'ctaText', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none font-bold"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">صورة الكورس الكاملة (رابط)</label>
                          <input
                            type="text"
                            value={item.image || item.icon || ''}
                            onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'image', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none font-mono text-left"
                            dir="ltr"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Courses / Pricing Editor */}
            {activeSection === 'pricing' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                  <h3 className="text-xs font-extrabold text-slate-800">تخصيص الكورسات والاشتراكات (Pricing / Curriculum)</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">عنوان قسم الكورسات</label>
                    <input
                      type="text"
                      value={content.pricing.title}
                      onChange={(e) => handleUpdateField('pricing', 'title', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">عنوان فرعي</label>
                    <input
                      type="text"
                      value={content.pricing.subtitle}
                      onChange={(e) => handleUpdateField('pricing', 'subtitle', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500">بطاقات الباقات / الكورسات:</span>
                    <button
                      type="button"
                      onClick={() => handleAddListItem('pricing', 'items', { id: `pkg-${Date.now()}`, title: 'باقة تدريبية جديدة', price: '١٠٠ ريال / شهرياً', features: ['تحديث دوري للمواد الدراسية', 'أوراق عمل شاملة'] })}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      إضافة باقة
                    </button>
                  </div>

                  <div className="space-y-4">
                    {content.pricing.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        id={`editor-item-pricing-${idx}`}
                        className={`border rounded-xl p-3 relative flex flex-col gap-2.5 transition-all duration-300 ${
                          activeSection === 'pricing' && activeItemIndex === idx
                            ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.01]'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveListItem('pricing', 'items', idx)}
                          className="absolute top-2 left-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="حذف الباقة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">معرف ثابت للباقة (ID)</label>
                          <input
                            type="text"
                            value={item.id || `pkg-${idx}`}
                            onChange={(e) => handleUpdateNestedField('pricing', 'items', idx, 'id', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none font-mono text-left"
                            dir="ltr"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">اسم الكورس أو الباقة</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateNestedField('pricing', 'items', idx, 'title', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-bold"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">السعر المعروض</label>
                          <input
                            type="text"
                            value={item.price}
                            onChange={(e) => handleUpdateNestedField('pricing', 'items', idx, 'price', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-extrabold text-slate-800"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">الميزات المشمولة (افصل بفاصلة)</label>
                          <input
                            type="text"
                            value={item.features.filter(f => !f.startsWith('http') && !f.includes('/')).join('، ')}
                            onChange={(e) => {
                              const arrText = e.target.value.split(/[،,]/).map(s => s.trim()).filter(Boolean);
                              const arrImgs = item.features.filter(f => f.startsWith('http') || f.includes('/'));
                              handleUpdateNestedField('pricing', 'items', idx, 'features', [...arrText, ...arrImgs]);
                            }}
                            className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none text-slate-700 font-medium"
                            placeholder="ميزة ١ ، ميزة ٢ ، ميزة ٣"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">رابط صورة الباقة / الكورس (اختياري)</label>
                          <div className="flex gap-2 items-center">
                            {item.features.find(f => f.startsWith('http') || f.includes('/')) && (
                              <img
                                src={item.features.find(f => f.startsWith('http') || f.includes('/'))}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                                alt="preview"
                              />
                            )}
                            <input
                              type="text"
                              value={item.features.find(f => f.startsWith('http') || f.includes('/')) || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const arrText = item.features.filter(f => !f.startsWith('http') && !f.includes('/'));
                                if (val.trim()) {
                                  handleUpdateNestedField('pricing', 'items', idx, 'features', [...arrText, val.trim()]);
                                } else {
                                  handleUpdateNestedField('pricing', 'items', idx, 'features', arrText);
                                }
                              }}
                              className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none font-mono flex-grow text-left"
                              placeholder="https://..."
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}



            {/* Testimonials Editor */}
            {activeSection === 'testimonials' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                  <h3 className="text-xs font-extrabold text-slate-800">تخصيص آراء الطلاب والمشاركين (Testimonials)</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">عنوان القسم الرئيسي</label>
                    <input type="text" value={content.testimonials.title} onChange={(e) => handleUpdateField('testimonials', 'title', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">وصف القسم</label>
                    <input type="text" value={content.testimonials.subtitle} onChange={(e) => handleUpdateField('testimonials', 'subtitle', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">خلفية القسم</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input type="color" value={content.testimonials.backgroundColor} onChange={(e) => handleUpdateField('testimonials', 'backgroundColor', e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 outline-none shrink-0" />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{content.testimonials.backgroundColor}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">لون العنوان</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input type="color" value={content.testimonials.titleColor || content.testimonials.textColor || '#1a1c1d'} onChange={(e) => handleUpdateField('testimonials', 'titleColor', e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 outline-none shrink-0" />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{content.testimonials.titleColor || content.testimonials.textColor || '#1a1c1d'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500">التوصيات:</span>
                    <button type="button" onClick={() => handleAddListItem('testimonials', 'items', { id: `t-${Date.now()}`, name: 'اسم الطالب', role: 'مشارك', initials: 'ن.م', review: 'اكتب رأي الطالب هنا.', rating: 5 })} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                      <Plus className="w-3.5 h-3.5" /> إضافة توصية
                    </button>
                  </div>

                  <div className="space-y-4">
                    {content.testimonials.items.map((t, idx) => (
                      <div key={t.id || idx} className="border rounded-xl p-3 relative bg-slate-50 border-slate-200 flex flex-col gap-2">
                        <button type="button" onClick={() => handleRemoveListItem('testimonials', 'items', idx)} className="absolute top-2 left-2 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">اسم الطالب</label>
                            <input type="text" value={t.name} onChange={(e) => handleUpdateNestedField('testimonials', 'items', idx, 'name', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-bold" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">دوره / وصفه</label>
                            <input type="text" value={t.role} onChange={(e) => handleUpdateNestedField('testimonials', 'items', idx, 'role', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">أحرف مختصرة (لو لم توجد صورة)</label>
                            <input type="text" value={t.initials || ''} onChange={(e) => handleUpdateNestedField('testimonials', 'items', idx, 'initials', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none text-center font-bold" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">صورة الطالب (رابط اختياري)</label>
                            <input type="text" value={t.avatar || ''} onChange={(e) => handleUpdateNestedField('testimonials', 'items', idx, 'avatar', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none font-mono text-left" dir="ltr" placeholder="https://..." />
                          </div>
                          <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-[9px] font-bold text-slate-500">التقييم من ٥</label>
                            <select value={String(t.rating || 5)} onChange={(e) => handleUpdateNestedField('testimonials', 'items', idx, 'rating', Number(e.target.value))} className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-bold cursor-pointer">
                              <option value="5">★★★★★ — ٥ نجوم</option>
                              <option value="4">★★★★☆ — ٤ نجوم</option>
                              <option value="3">★★★☆☆ — ٣ نجوم</option>
                              <option value="2">★★☆☆☆ — نجمتان</option>
                              <option value="1">★☆☆☆☆ — نجمة واحدة</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">نص المراجعة / الرأي</label>
                          <textarea value={t.review} onChange={(e) => handleUpdateNestedField('testimonials', 'items', idx, 'review', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-[9px] bg-white outline-none min-h-[60px] resize-none" />
                        </div>
                      </div>
                    ))}
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
                    <input type="text" value={content.faq.title} onChange={(e) => handleUpdateField('faq', 'title', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">وصف مختصر للقسم</label>
                    <input type="text" value={content.faq.subtitle || ''} onChange={(e) => handleUpdateField('faq', 'subtitle', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium" />
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500">قائمة الأسئلة والإجابات:</span>
                    <button type="button" onClick={() => handleAddListItem('faq', 'items', { id: `f-${Date.now()}`, question: 'سؤال جديد؟', answer: 'اكتب الإجابة المفصلة هنا.' })} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                      <Plus className="w-3.5 h-3.5" /> إضافة سؤال
                    </button>
                  </div>
                  <div className="space-y-4">
                    {content.faq.items.map((item, idx) => (
                      <div key={item.id || idx} id={`editor-item-faq-${idx}`} className={`border rounded-xl p-3 relative flex flex-col gap-2.5 transition-all duration-300 ${
                        activeSection === 'faq' && activeItemIndex === idx
                          ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.01]'
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                        <button type="button" onClick={() => handleRemoveListItem('faq', 'items', idx)} className="absolute top-2 left-2 text-slate-400 hover:text-red-500 transition-colors" title="حذف السؤال">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">السؤال المطروح</label>
                          <input type="text" value={item.question} onChange={(e) => handleUpdateNestedField('faq', 'items', idx, 'question', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-bold" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">الإجابة</label>
                          <textarea value={item.answer} onChange={(e) => handleUpdateNestedField('faq', 'items', idx, 'answer', e.target.value)} className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none min-h-[60px] resize-none text-slate-600" />
                        </div>
                      </div>
                    ))}
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
                    <label className="text-[11px] font-bold text-slate-600">عنوان قسم التواصل</label>
                    <input type="text" value={content.contact.title} onChange={(e) => handleUpdateField('contact', 'title', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">الوصف والدعوة للاتصال</label>
                    <textarea value={content.contact.description} onChange={(e) => handleUpdateField('contact', 'description', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[70px] resize-none" />
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-black text-slate-500 mb-2.5">أزرار التواصل المباشر:</div>
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-600">رقم الواتساب (مع رمز الدولة)</label>
                          <input type="text" value={content.contact.whatsapp || content.contact.phoneNumber || ''} onChange={(e) => handleUpdateField('contact', 'whatsapp', e.target.value)} className="border border-slate-200 rounded-xl p-2.5 text-[10px] bg-white focus:outline-none focus:border-blue-600 font-mono text-left" dir="ltr" placeholder="966500000000" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-600">نص زر الواتساب</label>
                          <input
                            type="text"
                            value={content.contact.whatsappText || content.contact.buttonText || 'تواصل واتساب'}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!content) return;
                              setContent({
                                ...content,
                                contact: {
                                  ...content.contact,
                                  whatsappText: val,
                                  buttonText: val
                                }
                              });
                            }}
                            className="border border-slate-200 rounded-xl p-2.5 text-[10px] bg-white focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-600">البريد الإلكتروني</label>
                          <input type="text" value={content.contact.email || ''} onChange={(e) => handleUpdateField('contact', 'email', e.target.value)} className="border border-slate-200 rounded-xl p-2.5 text-[10px] bg-white focus:outline-none focus:border-blue-600 font-mono text-left" dir="ltr" placeholder="info@example.com" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-600">نص زر البريد</label>
                          <input type="text" value={content.contact.emailText || 'راسلنا عبر البريد'} onChange={(e) => handleUpdateField('contact', 'emailText', e.target.value)} className="border border-slate-200 rounded-xl p-2.5 text-[10px] bg-white focus:outline-none focus:border-blue-600 font-medium" />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-600">رقم الهاتف</label>
                          <input type="text" value={content.contact.phoneNumber || ''} onChange={(e) => handleUpdateField('contact', 'phoneNumber', e.target.value)} className="border border-slate-200 rounded-xl p-2.5 text-[10px] bg-white focus:outline-none focus:border-blue-600 font-mono text-left" dir="ltr" placeholder="+966500000000" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-600">نص زر الهاتف</label>
                          <input type="text" value={content.contact.phoneText || 'اتصل بنا'} onChange={(e) => handleUpdateField('contact', 'phoneText', e.target.value)} className="border border-slate-200 rounded-xl p-2.5 text-[10px] bg-white focus:outline-none focus:border-blue-600 font-medium" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-black text-slate-500 mb-2.5">روابط حسابات التواصل الاجتماعي:</div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(['facebook', 'instagram', 'linkedin', 'twitter'] as const).map(k => (
                        <div key={k} className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-600 capitalize">{k === 'linkedin' ? 'لينكد إن' : k === 'facebook' ? 'فيسبوك' : k === 'instagram' ? 'إنستغرام' : 'تويتر / إكس'}</label>
                          <input type="text" value={(content.contact as any)[k] || ''} onChange={(e) => handleUpdateField('contact', k, e.target.value)} className="border border-slate-200 rounded-xl p-2.5 text-[9px] bg-white focus:outline-none focus:border-blue-600 font-mono text-left" dir="ltr" placeholder="https://..." />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-4 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">خلفية القسم</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input type="color" value={content.contact.backgroundColor} onChange={(e) => handleUpdateField('contact', 'backgroundColor', e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none" />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{content.contact.backgroundColor}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">لون النصوص</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input type="color" value={content.contact.textColor || '#ffffff'} onChange={(e) => handleUpdateField('contact', 'textColor', e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none" />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{content.contact.textColor || '#ffffff'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">خلفية الأزرار</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input type="color" value={content.contact.buttonBgColor || '#ffffff'} onChange={(e) => handleUpdateField('contact', 'buttonBgColor', e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none" />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{content.contact.buttonBgColor || '#ffffff'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">نص الأزرار</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input type="color" value={content.contact.buttonTextColor || '#4f378a'} onChange={(e) => handleUpdateField('contact', 'buttonTextColor', e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none" />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{content.contact.buttonTextColor || '#4f378a'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Final CTA Editor */}
            {activeSection === 'finalCta' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                  <h3 className="text-xs font-extrabold text-slate-800">تخصيص دعوة الاشتراك النهائية (Final CTA / Newsletter)</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">عنوان الدعوة الرئيسي</label>
                    <input type="text" value={content.finalCta.title} onChange={(e) => handleUpdateField('finalCta', 'title', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">الوصف التفصيلي</label>
                    <textarea value={content.finalCta.description} onChange={(e) => handleUpdateField('finalCta', 'description', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium min-h-[70px] resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {currentRole !== 'coach' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">رمز الأيقونة (مثل rocket_launch, school)</label>
                        <input type="text" value={content.finalCta.icon || 'school'} onChange={(e) => handleUpdateField('finalCta', 'icon', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-[10px] bg-white outline-none font-mono text-left" dir="ltr" />
                      </div>
                    )}
                    {currentRole !== 'coach' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-600">نص placeholder لحقل البريد</label>
                        <input type="text" value={content.finalCta.emailPlaceholder || 'البريد الإلكتروني'} onChange={(e) => handleUpdateField('finalCta', 'emailPlaceholder', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-[10px] bg-white outline-none font-medium" />
                      </div>
                    )}
                    {currentRole !== 'coach' && (
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[11px] font-bold text-slate-600">نص زر الإرسال</label>
                        <input type="text" value={content.finalCta.buttonText || 'اشترك الآن'} onChange={(e) => handleUpdateField('finalCta', 'buttonText', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-[11px] bg-white outline-none font-bold" />
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-4 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">لون الخلفية</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input
                          type="color"
                          value={content.finalCta.backgroundColor || content.finalCta.accentColor || '#faf9fb'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!content) return;
                            setContent({
                              ...content,
                              finalCta: {
                                ...content.finalCta,
                                backgroundColor: val,
                                accentColor: val
                              }
                            });
                          }}
                          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                        />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{content.finalCta.backgroundColor || content.finalCta.accentColor || '#faf9fb'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">لون النص</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input
                          type="color"
                          value={content.finalCta.textColor || '#1a1c1d'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!content) return;
                            setContent({
                              ...content,
                              finalCta: {
                                ...content.finalCta,
                                textColor: val,
                                titleColor: val
                              }
                            });
                          }}
                          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none"
                        />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{content.finalCta.textColor || '#1a1c1d'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">خلفية زر الإرسال</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input type="color" value={content.finalCta.buttonBgColor || '#4f378a'} onChange={(e) => handleUpdateField('finalCta', 'buttonBgColor', e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none" />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{content.finalCta.buttonBgColor || '#4f378a'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600">نص زر الإرسال</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input type="color" value={content.finalCta.buttonTextColor || '#ffffff'} onChange={(e) => handleUpdateField('finalCta', 'buttonTextColor', e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none" />
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">{content.finalCta.buttonTextColor || '#ffffff'}</span>
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
                    <label className="text-[11px] font-bold text-slate-600">نص حقوق الملكية والنشر</label>
                    <input type="text" value={content.footer.text} onChange={(e) => handleUpdateField('footer', 'text', e.target.value)} className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">خلفية الفوتر</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input type="color" value={content.footer.backgroundColor} onChange={(e) => handleUpdateField('footer', 'backgroundColor', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none" />
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{content.footer.backgroundColor}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600">لون نصوص الفوتر</label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                        <input type="color" value={content.footer.textColor} onChange={(e) => handleUpdateField('footer', 'textColor', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0 outline-none" />
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
            className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ease-out w-full h-full ${
              deviceMode === 'desktop' ? 'max-w-full' :
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
            {currentRole === 'academy' ? (
              <iframe
                id="website-builder-iframe"
                srcDoc={getAcademicHtml(previewContent || content)}
                onLoad={handleIframeLoad}
                className="w-full h-full border-0"
                title="Academic Preview"
              />
            ) : currentRole === 'coach' ? (
              <iframe
                id="website-builder-iframe"
                srcDoc={getCoachHtml(previewContent || content)}
                onLoad={handleIframeLoad}
                className="w-full h-full border-0"
                title="Coach Preview"
              />
            ) : currentRole === 'schoolcoach' ? (
              <iframe
                id="website-builder-iframe"
                srcDoc={getSchoolCoachHtml(previewContent || content)}
                onLoad={handleIframeLoad}
                className="w-full h-full border-0"
                title="School Coach Preview"
              />
            ) : (
              <div className="flex-1 overflow-y-auto bg-white select-none">
                
                {/* Navbar Section */}
                <div
                  onClick={() => { setActiveSection('navbar'); setActiveItemIndex(null); }}
                  style={{ backgroundColor: content.navbar.bgColor, color: content.navbar.textColor }}
                  className={`py-4 px-6 flex justify-between items-center cursor-pointer border-b border-slate-100 transition-all relative group ${
                    activeSection === 'navbar' 
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
                  className={`p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center cursor-pointer transition-all relative group ${
                    activeSection === 'hero' 
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
                  className={`p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center cursor-pointer border-t border-slate-100 transition-all relative group ${
                    activeSection === 'about' 
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
                  className={`p-8 sm:p-12 space-y-8 cursor-pointer border-t border-slate-100 transition-all relative group ${
                    activeSection === 'features' 
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
                        className={`bg-white border p-4 rounded-2xl flex flex-col gap-2.5 shadow-xs cursor-pointer transition-all relative group/item ${
                          activeSection === 'features' && activeItemIndex === i
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

                {/* Curriculum / Pricing Section */}
                <div
                  onClick={() => { setActiveSection('pricing'); setActiveItemIndex(null); }}
                  style={{ backgroundColor: content.pricing.backgroundColor, color: content.pricing.textColor }}
                  className={`p-8 sm:p-12 space-y-8 cursor-pointer border-t border-slate-100 transition-all relative group ${
                    activeSection === 'pricing' 
                      ? 'ring-4 ring-blue-500 z-10 shadow-md' 
                      : 'hover:ring-2 hover:ring-dashed hover:ring-blue-400 hover:ring-offset-1'
                  }`}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-sm z-20 pointer-events-none flex items-center gap-1">
                    <Pencil className="w-2.5 h-2.5" />
                    <span>تعديل الدورات والأسعار</span>
                  </div>
                  <div className="text-center space-y-1.5">
                    <h3 className="text-lg font-black">{content.pricing.title}</h3>
                    <p className="text-xs text-slate-500 font-bold">{content.pricing.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {content.pricing.items.map((item, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSectionItem('pricing', i);
                        }}
                        className={`bg-white border-2 rounded-3xl p-6 flex flex-col justify-between shadow-xs cursor-pointer transition-all relative group/item ${
                          activeSection === 'pricing' && activeItemIndex === i
                            ? 'border-blue-500 ring-2 ring-blue-500/40 scale-[1.02] z-20 shadow-md'
                            : 'border-slate-200 hover:border-blue-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="absolute top-2 left-2 opacity-0 group-hover/item:opacity-100 transition-opacity bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm z-30 pointer-events-none flex items-center gap-0.5">
                          <Pencil className="w-2 h-2" />
                          <span>تعديل الباقة</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 mb-2">{item.title}</h4>
                          <div className="text-xl font-black text-blue-600 mb-4">{item.price}</div>
                          <ul className="space-y-2 text-[10px] text-slate-500 font-bold">
                            {item.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-5">
                          <button
                            type="button"
                            className="w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-extrabold"
                          >
                            اشترك الآن
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ Section */}
                <div
                  onClick={() => { setActiveSection('faq'); setActiveItemIndex(null); }}
                  style={{ backgroundColor: content.faq.backgroundColor, color: content.faq.textColor }}
                  className={`p-8 sm:p-12 space-y-6 cursor-pointer border-t border-slate-100 transition-all relative group ${
                    activeSection === 'faq' 
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
                        className={`bg-white border rounded-xl p-4 flex gap-3 text-right cursor-pointer transition-all relative group/item ${
                          activeSection === 'faq' && activeItemIndex === i
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
                  className={`p-8 sm:p-10 text-center space-y-4 cursor-pointer border-t border-slate-100 transition-all relative group ${
                    activeSection === 'contact' 
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
                <div
                  onClick={() => { setActiveSection('footer'); setActiveItemIndex(null); }}
                  style={{ backgroundColor: content.footer.backgroundColor, color: content.footer.textColor }}
                  className={`py-6 px-6 text-center text-[10px] cursor-pointer opacity-90 border-t border-slate-100 transition-all relative group ${
                    activeSection === 'footer' 
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

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
