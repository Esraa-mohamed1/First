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
}

interface TemplateContent {
  navbar: NavbarConfig;
  hero: HeroConfig;
  about: AboutConfig;
  features: FeaturesConfig;
  pricing: PricingConfig;
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
        buttonLink: '#',
        image: '',
        backgroundColor: '#fbfafc',
        textColor: '#1c1a22'
      },
      about: {
        title: 'المرشدون الخبراء',
        subtitle: 'نخبة من الأكاديميين والباحثين يرافقونك في رحلتك المعرفية.',
        image: '',
        backgroundColor: '#ffffff',
        textColor: '#1c1a22'
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
        textColor: '#1c1a22'
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
        textColor: '#1c1a22'
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
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState<keyof TemplateContent>('hero');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Dynamic template content configurations
  const [content, setContent] = useState<TemplateContent | null>(null);

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

  // --- Load content when role or active template changes ---
  useEffect(() => {
    // Try to load cached config first
    const cacheKey = `darab_active_template_config_${currentRole}_${activeTemplateId}`;
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          setContent(JSON.parse(cached));
          return;
        } catch (e) {
          console.error('Failed to parse cached configuration, using default:', e);
        }
      }
    }
    // Set default content structure
    setContent(getDefaultContent(currentRole, activeTemplateId));
  }, [currentRole, activeTemplateId]);

  // --- Navigation & Action Handlers ---
  const handleGoBack = () => {
    router.push('/academic/templates');
  };

  const handleSaveDraft = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const cacheKey = `darab_active_template_config_${currentRole}_${activeTemplateId}`;
      localStorage.setItem(cacheKey, JSON.stringify(content));
      
      // Simulate API saving
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      toast.success('تم حفظ مسودة تصميمك بنجاح!', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء حفظ المسودة.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!content) return;
    
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
      // Sync active template key to localStorage
      localStorage.setItem('darab_active_template', activeTemplateId);
      const cacheKey = `darab_active_template_config_${currentRole}_${activeTemplateId}`;
      localStorage.setItem(cacheKey, JSON.stringify(content));
      
      // Sync general active template styles config key for components
      localStorage.setItem(`darab_published_template_config`, JSON.stringify({
        role: currentRole,
        templateId: activeTemplateId,
        content: content
      }));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      MySwal.fire({
        icon: 'success',
        title: 'تم النشر بنجاح!',
        text: 'تم تحديث مظهر الأكاديمية والموقع الخارجي ليعمل بالشكل الجديد.',
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
    setContent(getDefaultContent(currentRole, activeTemplateId));
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
          
          {/* Quick Section Switcher */}
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
                <option value="navbar">شريط التنقل العلوي (Navbar)</option>
                <option value="hero">البانر الترحيبي (Hero Banner)</option>
                <option value="about">النبذة والتعريف (About Section)</option>
                <option value="features">مميزات الأكاديمية (Features)</option>
                <option value="pricing">الدورات والاشتراكات (Curriculum/Pricing)</option>
                <option value="faq">الأسئلة الشائعة (FAQ Accordions)</option>
                <option value="contact">أزرار التواصل (Contact/WhatsApp)</option>
                <option value="footer">تذييل الصفحة (Footer Bar)</option>
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

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">نص الزر الإرشادي (CTA Button)</label>
                    <input
                      type="text"
                      value={content.hero.buttonText}
                      onChange={(e) => handleUpdateField('hero', 'buttonText', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
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
                  <div className="flex flex-col gap-1">
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
                          title="حذف الميزة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">
                            {item.icon && (item.icon.startsWith('http') || item.icon.includes('/')) 
                              ? 'رابط صورة الميزة / الموجه' 
                              : 'رمز الأيقونة (مثال: Award, BookOpen أو رابط صورة)'}
                          </label>
                          <div className="flex gap-2 items-center">
                            {item.icon && (item.icon.startsWith('http') || item.icon.includes('/')) && (
                              <img src={item.icon} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" alt="preview" />
                            )}
                            <input
                              type="text"
                              value={item.icon}
                              onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'icon', e.target.value)}
                              className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-mono flex-1 text-left"
                              placeholder="أدخل اسم الأيقونة أو رابط الصورة"
                              dir="ltr"
                            />
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

            {/* Courses / Pricing Editor */}
            {activeSection === 'pricing' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                  <h3 className="text-xs font-extrabold text-slate-800">تخصيص الكورسات والأسعار</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">عنوان قسم الكورسات / التسعير</label>
                    <input
                      type="text"
                      value={content.pricing.title}
                      onChange={(e) => handleUpdateField('pricing', 'title', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-600">عنوان فرعي لقسم التسعير</label>
                    <input
                      type="text"
                      value={content.pricing.subtitle}
                      onChange={(e) => handleUpdateField('pricing', 'subtitle', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                {/* Pricing Plans List */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500">بطاقات الباقات / الدورات:</span>
                    <button
                      type="button"
                      onClick={() => handleAddListItem('pricing', 'items', { title: 'باقة تدريبية جديدة', price: '١٠٠ ريال / شهرياً', features: ['تحديث دوري للمواد الدراسية', 'أوراق عمل شاملة'] })}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      إضافة باقة
                    </button>
                  </div>

                  <div className="space-y-4">
                    {content.pricing.items.map((item, idx) => (
                      <div
                        key={idx}
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
                          <label className="text-[9px] font-bold text-slate-500">الميزات المشمولة (مفصولة بفاصلة)</label>
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

                        {/* If there is an image in features, or if the role is coach, allow editing it explicitly */}
                        {(item.features.some(f => f.startsWith('http') || f.includes('/')) || currentRole === 'coach') && (
                          <div className="flex flex-col gap-1 mt-1">
                            <label className="text-[9px] font-bold text-slate-500">رابط صورة الكارت / الماستركلاس</label>
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
                                className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-mono flex-grow text-left"
                                placeholder="https://..."
                                dir="ltr"
                              />
                            </div>
                          </div>
                        )}
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
                        className={`border rounded-xl p-3 relative flex flex-col gap-2.5 transition-all duration-300 ${
                          activeSection === 'faq' && activeItemIndex === idx
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
                    <label className="text-[11px] font-bold text-slate-600">نص زر الواتساب</label>
                    <input
                      type="text"
                      value={content.contact.buttonText}
                      onChange={(e) => handleUpdateField('contact', 'buttonText', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
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
                    <input
                      type="text"
                      value={content.footer.text}
                      onChange={(e) => handleUpdateField('footer', 'text', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
                    />
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
                srcDoc={getAcademicHtml(content)}
                className="w-full h-full border-0"
                title="Academic Preview"
              />
            ) : currentRole === 'coach' ? (
              <iframe
                srcDoc={getCoachHtml(content)}
                className="w-full h-full border-0"
                title="Coach Preview"
              />
            ) : currentRole === 'schoolcoach' ? (
              <iframe
                srcDoc={getSchoolCoachHtml(content)}
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
