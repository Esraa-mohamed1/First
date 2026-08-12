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
        navbar: { title: 'مجموعة المدرس المتميز', logo: '', bgColor: '#ffffff', textColor: '#0f172a' },
        hero: {
          title: 'شرح المناهج الدراسية والتحضير للامتحانات النهائية بطرق حديثة',
          subtitle: 'مرحباً بك في منصتي الدراسية الخاصة',
          description: 'نلخص لك المناهج الدراسية المعقدة بأسلوب مبسط وتفاعلي، ونقدم حلولاً نموذجية للامتحانات السابقة لمساعدتك في تحقيق الدرجة الكاملة.',
          buttonText: 'تصفح الفصول الدراسية',
          buttonLink: '#courses',
          image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
          backgroundColor: '#ecfdf5',
          textColor: '#065f46'
        },
        about: {
          title: 'من هو المعلم؟',
          subtitle: 'معلم أول لمادة الرياضيات بخبرة تزيد عن ١٢ عاماً في المدارس الثانوية الكبرى. أسعى لتبسيط العلوم لجعل التميز الأكاديمي في متناول كل طالب.',
          image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop',
          backgroundColor: '#ffffff',
          textColor: '#1f2937'
        },
        features: {
          title: 'مميزات دراستنا الذكية',
          subtitle: 'نوفر كل الوسائل الضرورية لدعمك دراسياً من البيت.',
          items: [
            { icon: 'BookOpen', title: 'مناهج منظمة بالكامل', description: 'تقسيم أسبوعي للحصص حسب التحديثات الوزارية.' },
            { icon: 'Award', title: 'تقييم وتصحيح مستمر', description: 'اختبارات دورية بعد كل وحدة لمراقبة تقدم الطالب.' },
            { icon: 'Clock', title: 'تقارير دورية لأولياء الأمور', description: 'إشعارات بنسب الإنجاز ونتائج الاختبارات أولاً بأول.' }
          ],
          backgroundColor: '#f9fafb',
          textColor: '#1f2937'
        },
        pricing: {
          title: 'الاشتراكات المدرسية المتاحة',
          subtitle: 'احجز مقعدك في الفصول الدراسية ووفر مجهودك ودرجاتك.',
          items: [
            { title: 'باقة الفصل الدراسي الأول', price: '١٥٠ جنيه / شهرياً', features: ['فيديوهات شرح الوحدات كاملة', 'ملخصات PDF جاهزة للتحميل', 'بنك أسئلة وتدريبات أسبوعية'] },
            { title: 'باقة المراجعة النهائية الشاملة', price: '٢٥٠ جنيه / للترم', features: ['مراجعة شاملة لجميع أجزاء المنهج', 'حل أكثر من ٢٠ نموذج امتحان متوقع', 'دعم مباشر مع المعلم للاستفسارات'] }
          ],
          backgroundColor: '#ffffff',
          textColor: '#1f2937'
        },
        faq: {
          title: 'الأسئلة الشائعة للطلاب',
          items: [
            { question: 'هل الحصص البث المباشر مسجلة؟', answer: 'نعم، يتم تسجيل جميع اللقاءات المباشرة ورفعها للمنصة لتعيد مشاهدتها في أي وقت.' },
            { question: 'كيف أرسل إجاباتي للواجبات؟', answer: 'توجد خانة مخصصة لرفع ملفات الحل بصيغة PDF وتصلك الملاحظات والتصحيح مباشرة.' }
          ],
          backgroundColor: '#f9fafb',
          textColor: '#1f2937'
        },
        contact: {
          title: 'هل تحتاج لمساعدة في التسجيل؟',
          description: 'تواصل مع الدعم الدراسي للحصول على إرشادات وحجز مقعدك الدراسي فوراً.',
          phoneNumber: '201000000000',
          buttonText: 'راسلنا واتساب دراسياً',
          backgroundColor: '#10b981',
          textColor: '#ffffff'
        },
        footer: {
          text: 'جميع الحقوق محفوظة © مجموعة المدرس المتميز ٢٠٢٦',
          backgroundColor: '#064e3b',
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
    if (templateId === 'template_1') {
      return {
        navbar: { title: 'الكوتش أحمد للتدريب والتوجيه', logo: '', bgColor: '#ffffff', textColor: '#1e1b4b' },
        hero: {
          title: 'أطلق إمكانياتك الحقيقية وحقق أهدافك البدنية والذهنية',
          subtitle: 'توجيه وتدريب شخصي مخصص ١٠٠٪ 🚀',
          description: 'نصمم معاً برنامجاً متكاملاً للتغذية والتمارين أو التوجيه المهني مبنياً على أسس علمية ومتابعة يومية تضمن لك الوصول لغايتك.',
          buttonText: 'احجز جلستك الاستشارية الأولى',
          buttonLink: '#coaching',
          image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop',
          backgroundColor: '#eef2ff',
          textColor: '#312e81'
        },
        about: {
          title: 'من هو الكوتش؟',
          subtitle: 'مدرب وموجه شخصي معتمد دولياً بخبرة تزيد عن ٨ سنوات في مساعدة الأفراد على تطوير عاداتهم وتحويل نمط حياتهم البدني والمهني.',
          image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop',
          backgroundColor: '#ffffff',
          textColor: '#1f2937'
        },
        features: {
          title: 'أركان رحلة التحول',
          subtitle: 'منظومة تدريبية تركز على النتيجة والاستمرارية لتفادي الانتكاس.',
          items: [
            { icon: 'Laptop', title: 'خطة مخصصة لأسلوب حياتك', description: 'لا نتبع نظاماً صارماً بل نصمم نظاماً يتكيف معك.' },
            { icon: 'Award', title: 'متابعة أسبوعية دقيقة', description: 'مراجعة دورية للأوزان أو القياسات ومستوى الإنجاز اليومي.' },
            { icon: 'Phone', title: 'تواصل مباشر ويومي', description: 'خط تواصل مباشر لطرح استفساراتك والحفاظ على الحماس.' }
          ],
          backgroundColor: '#f8fafc',
          textColor: '#1f2937'
        },
        pricing: {
          title: 'باقات التدريب والمتابعة المباشرة',
          subtitle: 'استثمر في تطوير صحتك وحياتك اليوم مع باقات الدعم المخصصة.',
          items: [
            { title: 'باقة المتابعة الشهرية الأساسية', price: '٣٥0 ريال / شهرياً', features: ['تصميم جدول التمارين والتغذية المخصصة', 'متابعة أسبوعية عبر التقارير الرقمية', 'دعم عبر الواتساب للرد على الأسئلة'] },
            { title: 'باقة التدريب الخاص المتقدمة (٣ أشهر)', price: '٩٠0 ريال / بالكامل', features: ['كل مميزات الباقة الشهرية الأساسية', 'مكالمة زووم استشارية كل أسبوعين', 'تعديل وتحديث مستمر للخطط حسب التطور'] }
          ],
          backgroundColor: '#ffffff',
          textColor: '#1f2937'
        },
        faq: {
          title: 'الأسئلة الشائعة من المتدربين',
          items: [
            { question: 'هل أحتاج للذهاب للنادي الرياضي (الجيم)؟', answer: 'لا، يمكنني تصميم برنامج خاص للتدريب المنزلي بالاعتماد على وزن الجسم أو أدوات بسيطة.' },
            { question: 'كيف تتم متابعة التطور والوزن؟', answer: 'من خلال نموذج رقمي محمي يملأه المتدرب أسبوعياً بالقياسات والصور وملاحظات النشاط اليومي.' }
          ],
          backgroundColor: '#f8fafc',
          textColor: '#1f2937'
        },
        contact: {
          title: 'هل لديك حالة صحية خاصة أو أهداف معقدة؟',
          description: 'راسلني بالواتساب لأفهم حالتك ونحدد ما إذا كانت البرامج تناسبك.',
          phoneNumber: '966500000000',
          buttonText: 'تحدث مع الكوتش الآن',
          backgroundColor: '#4f46e5',
          textColor: '#ffffff'
        },
        footer: {
          text: 'جميع الحقوق محفوظة © الكوتش أحمد علي للتدريب الشخصي ٢٠٢٦',
          backgroundColor: '#1e1b4b',
          textColor: '#eef2ff'
        }
      };
    } else {
      // Coach Template 2
      return {
        navbar: { title: 'التميز الرياضي والمهني', logo: '', bgColor: '#0f172a', textColor: '#ffffff' },
        hero: {
          title: 'حوّل أهدافك الرياضية والمهنية الصعبة إلى واقع ملموس ومستدام',
          subtitle: 'أنظمة تدريب ذكية قائمة على البيانات 📈',
          description: 'مع الكوتش المحترف، احصل على خطط مدعومة بالبيانات والتحليلات لقياس التقدم وتخطي الحواجز البدنية والعقلية التي تعيق نجاحك.',
          buttonText: 'احجز استشارتك المهنية الآن',
          buttonLink: '#start',
          image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&auto=format&fit=crop',
          backgroundColor: '#0f172a',
          textColor: '#ffffff'
        },
        about: {
          title: 'منهجية التدريب الذكي',
          subtitle: 'لا مجال للاجتهادات العشوائية. نحن نحلل تكوين جسمك ونمط حياتك ونطور جداول علمية دقيقة لتحقيق تحول حقيقي وملموس.',
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop',
          backgroundColor: '#111827',
          textColor: '#f3f4f6'
        },
        features: {
          title: 'رؤية شاملة للتطوير الشخصي',
          subtitle: 'نوفر لك المزيج المثالي بين العلم التطبيقي والدافع النفسي لتفوقك.',
          items: [
            { icon: 'Award', title: 'بروتوكولات علمية حديثة', description: 'تحديثات مستمرة للخطط استناداً لأحدث الدراسات الرياضية.' },
            { icon: 'Laptop', title: 'متابعة عبر المنصة التفاعلية', description: 'تتبع نتائجك، رسوم بيانية توضح تطور قوتك وتحملك.' },
            { icon: 'Phone', title: 'استشارات هاتفية مباشرة', description: 'جلسة زووم شهرية لتقييم التقدم وتعديل الأهداف الطويلة.' }
          ],
          backgroundColor: '#0f172a',
          textColor: '#ffffff'
        },
        pricing: {
          title: 'باقات التدريب الحصرية',
          subtitle: 'تضمين المتابعة، والأنظمة الغذائية وجلسات الاستشارات المباشرة.',
          items: [
            { title: 'باقة النخبة (التزام كامل ٣ أشهر)', price: '١٢٠0 ريال / بالكامل', features: ['خطط تمارين ونظام غذائي دقيق ومعدل', 'متابعة قياسات وصور أسبوعية', 'استشارة زووم نصف شهرية', 'أولوية تواصل واتساب على مدار اليوم'] },
            { title: 'باقة الاحتراف الشاملة (٦ أشهر)', price: '٢٠٠٠ ريال / بالكامل', features: ['كل مميزات باقة النخبة مع خصم كبير', 'مكملات غذائية موصى بها مع ملف التعديل', 'تحليل ملف الفحوصات والتحاليل الطبية'] }
          ],
          backgroundColor: '#111827',
          textColor: '#ffffff'
        },
        faq: {
          title: 'الأسئلة الشائعة للمتدربين',
          items: [
            { question: 'كيف يتم تعديل الخطط الغذائية؟', answer: 'يتم تعديل خطة الوجبات دورياً بناءً على نزول الوزن وتفضيلاتك اليومية للأطعمة لضمان المتعة.' },
            { question: 'هل تشمل الباقة جلسات تدريب مباشر؟', answer: 'التدريب عن بعد عبر تصميم الخطط والمتابعة، ولكن يمكنك رفع فيديوهات لأدائك الحركي لتصحيحه.' }
          ],
          backgroundColor: '#0f172a',
          textColor: '#ffffff'
        },
        contact: {
          title: 'ابدأ رحلة تحولك الخاصة اليوم',
          description: 'انضم لآلاف المتدربين المتميزين وغير حياتك وجسدك بشكل آمن وصحي.',
          phoneNumber: '966500000000',
          buttonText: 'تواصل معي مباشرة بالواتساب',
          backgroundColor: '#ef4444',
          textColor: '#ffffff'
        },
        footer: {
          text: 'التميز الرياضي والمهني © حقوق النشر محفوظة ٢٠٢٦',
          backgroundColor: '#0f172a',
          textColor: '#94a3b8'
        }
      };
    }
  } else {
    // Academy Role ('academy')
    if (templateId === 'template_1') {
      return {
        navbar: { title: 'أكاديمية درب للعلوم البرمجية', logo: '', bgColor: '#ffffff', textColor: '#0f172a' },
        hero: {
          title: 'ادرس علوم الحاسب والذكاء الاصطناعي مع أفضل خبراء الصناعة',
          subtitle: 'بوابة التعلم والابتكار الأكاديمي الرقمي 🌐',
          description: 'نقدم لك مسارات ومناهج تعليمية متكاملة تأخذك من البدايات الصفرية إلى الجاهزية المهنية والعملية لتلبي طلبات الشركات التقنية الحديثة.',
          buttonText: 'تصفح الكتالوج البرمجي',
          buttonLink: '#courses',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a'
        },
        about: {
          title: 'عن أكاديميتنا المتطورة',
          subtitle: 'تأسست الأكاديمية لردم الفجوة العميقة بين المناهج الأكاديمية النظرية ومتطلبات سوق العمل البرمجي الفعلي. ندرّب طلابنا على بيئات عمل ومشاريع حقيقية.',
          image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop',
          backgroundColor: '#ffffff',
          textColor: '#1f2937'
        },
        features: {
          title: 'ما يميز مساراتنا الأكاديمية',
          subtitle: 'بيئة تعليمية مجهزة لضمان وصولك لمرحلة الاحتراف والتوظيف.',
          items: [
            { icon: 'BookOpen', title: 'مناهج برمجية تطبيقية', description: 'محدثة باستمرار لمواكبة التغيرات في تقنيات فرونت إند وباك إند.' },
            { icon: 'Award', title: 'شهادات تخرج معتمدة', description: 'توثق مهاراتك ومشاريعك المنفذة وتعزز من قوة ملفك الوظيفي.' },
            { icon: 'Clock', title: 'ورش عمل ومجتمع نشط', description: 'لقاءات دورية لتبادل الخبرات ومراجعة الأكواد وتذليل العقبات.' }
          ],
          backgroundColor: '#f8fafc',
          textColor: '#1f2937'
        },
        pricing: {
          title: 'مسارات الاشتراك والأسعار المتاحة',
          subtitle: 'اختر طريقة الدفع المناسبة واستمتع بوصول فوري لجميع موارد الأكاديمية.',
          items: [
            { title: 'العضوية البرمجية الشهرية', price: '١٢٠ ريال / شهرياً', features: ['وصول لكافة الكورسات الأساسية والمحدثة', 'ملفات الأكواد والملخصات التقنية', 'دعم من خلال المجتمع التقني'] },
            { title: 'باقة الاحتراف والتوظيف (عام كامل)', price: '٩٩٩ ريال / سنوياً', features: ['دخول لجميع مسارات الأكاديمية المتقدمة', 'جلسات مراجعة للبورتفوليو والسيرة الذاتية', 'أولوية الترشيح للشركات الشريكة'] }
          ],
          backgroundColor: '#ffffff',
          textColor: '#1f2937'
        },
        faq: {
          title: 'الأسئلة الشائعة للمشتركين الجدد',
          items: [
            { question: 'هل أحتاج لمعرفة سابقة بالبرمجة للتسجيل؟', answer: 'لا، معظم مساراتنا تبدأ من الصفر تماماً وتأسيس أساسيات المنطق البرمجي وقواعد البيانات.' },
            { question: 'هل أحصل على دعم إذا تعطل كودي؟', answer: 'نعم، نوفر منتدى تقني تفاعلي حيث يمكنك نشر مشكلتك ويقوم الموجهون بالرد عليك خلال ساعات.' }
          ],
          backgroundColor: '#f8fafc',
          textColor: '#1f2937'
        },
        contact: {
          title: 'هل ترغب في تسجيل مؤسستك أو فريق عملك؟',
          description: 'تواصل مع قسم العلاقات الأكاديمية لتصميم باقات مخصصة للأعمال والمجموعات.',
          phoneNumber: '966500000000',
          buttonText: 'مراسلة خدمة العملاء واتساب',
          backgroundColor: '#0284c7',
          textColor: '#ffffff'
        },
        footer: {
          text: 'أكاديمية درب للعلوم البرمجية © جميع الحقوق محفوظة ٢٠٢٦',
          backgroundColor: '#0f172a',
          textColor: '#94a3b8'
        }
      };
    } else {
      // Academy Template 2
      return {
        navbar: { title: 'أكاديمية المعرفة والتقنية الحديثة', logo: '', bgColor: '#0b1329', textColor: '#ffffff' },
        hero: {
          title: 'احترف مهارات المستقبل الرقمية والبرمجية مع دراسات معتمدة',
          subtitle: 'تعليم احترافي للمستقبل ⚙️✨',
          description: 'منظومة تعليمية متكاملة تقدم دراسة تفصيلية لمجالات الذكاء الاصطناعي، البرمجة، هندسة البيانات، وتطوير المنتجات تحت إشراف نخبة من المحاضرين الدوليين.',
          buttonText: 'التحق بالدفعة الجديدة الآن',
          buttonLink: '#enroll',
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
          backgroundColor: '#0b1329',
          textColor: '#ffffff'
        },
        about: {
          title: 'رسالتنا الأكاديمية والمهنية',
          subtitle: 'نهدف لتمكين الجيل الجديد من قيادة التحول الرقمي بالمنطقة من خلال تعليم تقني تفاعلي، عالي الكفاءة، ومرتبط بالاحتياجات الحقيقية لشركات التكنولوجيا.',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
          backgroundColor: '#1c2541',
          textColor: '#cbd5e1'
        },
        features: {
          title: 'بنية تحتية متطورة للتعلم الإلكتروني',
          subtitle: 'كل ما تحتاجه للنجاح المهني والتطبيق الفعلي والتواصل.',
          items: [
            { icon: 'Laptop', title: 'بيئات برمجية تفاعلية', description: 'اكتب الأكواد مباشرة من متصفحك دون إعدادات معقدة لجهازك.' },
            { icon: 'Award', title: 'امتحانات بمستوى قياسي', description: 'تقييم شامل يقيس الفهم العميق والقدرة على حل المشكلات التقنية.' },
            { icon: 'Sparkles', title: 'فرص توظيف وتدريب ميداني', description: 'شراكات واسعة مع كبرى الشركات البرمجية لتأمين تدريب متميز.' }
          ],
          backgroundColor: '#0b1329',
          textColor: '#ffffff'
        },
        pricing: {
          title: 'باقات الاشتراك في الأكاديمية',
          subtitle: 'باقات سنوية وشهرية لتختار ما يناسب جدولك وميزانيتك.',
          items: [
            { title: 'الاشتراك البرمجي الفضي', price: '١٥٠ ريال / شهرياً', features: ['وصول لكافة الكورسات الأساسية والمحدثة', 'ملخصات PDF ومشاريع المبتدئين', 'دعم تقني عبر تذاكر المنصة'] },
            { title: 'الاشتراك الذهبي الشامل (عضوية سنوية)', price: '١,٢٠٠ ريال / سنوياً', features: ['دخول لجميع مسارات الأكاديمية المتقدمة', 'استشارة شخصية زووم مع الخبراء شهرياً', 'شهادة تخرج موثقة وملف توظيفي مفضل'] }
          ],
          backgroundColor: '#1c2541',
          textColor: '#ffffff'
        },
        faq: {
          title: 'الأسئلة الشائعة من الطلاب والأكاديميين',
          items: [
            { question: 'هل الشهادات مقبولة دولياً وفي الشركات؟', answer: 'نعم، شهاداتنا تتبع المعايير القياسية لتطوير البرمجيات ومعترف بها لدى أكثر من ١٠٠ شركة تقنية شريكة بالمنطقة.' },
            { question: 'هل توجد شروط لسن معينة للتسجيل؟', answer: 'لا، نرحب بجميع الشغوفين بالتعلم البرمجي والتصميم من مختلف الأعمار طالما توافر لديهم الحاسب والإنترنت.' }
          ],
          backgroundColor: '#0b1329',
          textColor: '#ffffff'
        },
        contact: {
          title: 'هل تحتاج لطلب تمويل أو خصم أكاديمي للطلاب؟',
          description: 'تواصل معنا للحصول على تفاصيل المنح الدراسية الجزئية المتاحة للطلاب المتفوقين.',
          phoneNumber: '966500000000',
          buttonText: 'المنح والتمويل واتساب',
          backgroundColor: '#10b981',
          textColor: '#ffffff'
        },
        footer: {
          text: 'أكاديمية المعرفة والتقنية الحديثة © حقوق الطبع محفوظة ٢٠٢٦',
          backgroundColor: '#0b1329',
          textColor: '#5c677d'
        }
      };
    }
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
                    <input
                      type="text"
                      value={content.hero.image}
                      onChange={(e) => handleUpdateField('hero', 'image', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                      dir="ltr"
                    />
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
                    <input
                      type="text"
                      value={content.about.image}
                      onChange={(e) => handleUpdateField('about', 'image', e.target.value)}
                      className="border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left"
                      dir="ltr"
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
                          <label className="text-[9px] font-bold text-slate-500">اسم الأيقونة (مثال: Award, PlayCircle)</label>
                          <input
                            type="text"
                            value={item.icon}
                            onChange={(e) => handleUpdateNestedField('features', 'items', idx, 'icon', e.target.value)}
                            className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none font-mono"
                          />
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
                            value={item.features.join('، ')}
                            onChange={(e) => {
                              const arr = e.target.value.split(/[،,]/).map(s => s.trim()).filter(Boolean);
                              handleUpdateNestedField('pricing', 'items', idx, 'features', arr);
                            }}
                            className="border border-slate-200 rounded-lg p-2 text-[10px] bg-white outline-none text-slate-700 font-medium"
                            placeholder="ميزة ١ ، ميزة ٢ ، ميزة ٣"
                          />
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
          </div>
        </div>

      </div>
    </div>
  );
}
