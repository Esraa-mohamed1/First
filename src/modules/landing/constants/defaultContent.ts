import { LandingPageContent } from '../types/landing';

export const getTemplateDefaultContent = (course: any, templateName: string): LandingPageContent => {
  const isTemplate1 = templateName === 'template_1' || templateName === 'Modern Course';

  // Extract What You Will Learn
  let learningCards = [];
  if (course?.infos && Array.isArray(course.infos)) {
    learningCards = course.infos
      .filter((info: any) => {
        const key = info.key || info.info_key || '';
        return key === 'what_you_will_learn' || key === 'what_you_learn';
      })
      .map((info: any, idx: number) => ({
        id: `learn-${idx}`,
        info_key: info.key || info.info_key || 'ماذا ستتعلم؟',
        info_value: info.value || info.info_value || '',
        icon: 'CheckCircle2',
        color: isTemplate1 ? 'blue' : 'green'
      }));
  }

  // Fallback to learning_points
  if (learningCards.length === 0 && course?.learning_points) {
    learningCards = course.learning_points.map((pt: string, idx: number) => ({
      id: `learn-${idx}`,
      info_key: 'ماذا ستتعلم؟',
      info_value: pt,
      icon: 'CheckCircle2',
      color: isTemplate1 ? 'blue' : 'green'
    }));
  }

  // Fallback to standard features list if empty
  if (learningCards.length === 0) {
    learningCards = [
      { id: 'l1', info_key: 'ماذا ستتعلم؟', info_value: 'بناء أنظمة التصميم (Design Systems) القابلة للتوسع بشكل احترافي.', icon: 'Layout', color: 'blue' },
      { id: 'l2', info_key: 'ماذا ستتعلم؟', info_value: 'فهم سيكولوجية المستخدم وتطبيق مبادئ UX في قراراتك التصميمية.', icon: 'MousePointer2', color: 'blue' },
      { id: 'l3', info_key: 'ماذا ستتعلم؟', info_value: 'إتقان التصميم المتجاوب للهواتف والويب باستخدام أحدث أدوات Figma.', icon: 'Smartphone', color: 'orange' },
      { id: 'l4', info_key: 'ماذا ستتعلم؟', info_value: 'تحويل التصاميم إلى بروتوتايب تفاعلي يحاكي الواقع تماماً.', icon: 'PenTool', color: 'slate' }
    ];
  }

  return {
    hero: {
      title: course?.title || 'إتقان تطوير واجهات المستخدم بالتصميم الذكي',
      subtitle: 'الدفعة الجديدة — التسجيل مفتوح الآن',
      description: course?.description || 'دورة شاملة لتعلم مبادئ التصميم، من البداية وحتى الاحتراف. ستتعلم كيفية بناء واجهات متجاوبة، أنظمة التصميم، وسيكولوجية المستخدم.',
      image: course?.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200',
      buttonText: 'اشترك في الدورة الآن ←',
      buttonLink: '#buy',
      backgroundColor: isTemplate1 ? '#0D3B33' : '#ffffff',
      textColor: isTemplate1 ? '#FFFFFF' : '#1f2937',
      typography: {
        titleSize: 42,
        bodySize: 16
      }
    },
    learning: {
      title: 'ماذا ستتعلم في هذه الدورة؟',
      subtitle: 'مش مجرد فيديوهات مسجلة — منظومة تعلّم كاملة مصممة لتوصلك لنتيجة.',
      cards: learningCards,
      backgroundColor: isTemplate1 ? '#FBF7EE' : '#f8fafc',
      textColor: '#1f2937'
    },
    chapters: {
      title: 'منهج ومحتوى الدورة بالتفصيل',
      showLessons: true,
      backgroundColor: '#ffffff',
      textColor: '#1f2937'
    },
    payment: {
      title: 'وسائل الدفع المتاحة للامتلاك',
      background: isTemplate1 ? '#FBF7EE' : '#ffffff',
      textColor: '#1f2937'
    },
    faq: {
      title: 'الأسئلة الشائعة حول الدورة',
      items: [
        { question: 'هل الدورة مناسبة للمبتدئين؟', answer: 'نعم، نبدأ معك من الصفر التام خطوة بخطوة حتى تصبح محترفاً.' },
        { question: 'كيف يمكنني التواصل مع المحاضر للحصول على الدعم؟', answer: 'سيكون هناك مجتمع خاص ومباشر للمشتركين للتواصل اليومي وحل العقبات.' },
        { question: 'هل أحصل على شهادة إتمام بعد الدورة؟', answer: 'بالتأكيد، يتم إصدار شهادة إتمام معتمدة باسمك فور الانتهاء من جميع المهام والمشروع النهائي.' }
      ],
      backgroundColor: isTemplate1 ? '#FBF7EE' : '#f8fafc',
      textColor: '#1f2937'
    },
    footer: {
      text: 'حقوق النشر © 2026 أكاديمية درب. جميع الحقوق محفوظة.',
      links: [
        { label: 'شروط الخدمة', url: '#' },
        { label: 'سياسة الخصوصية', url: '#' }
      ],
      backgroundColor: isTemplate1 ? '#082A24' : '#0f172a',
      textColor: '#94a3b8'
    }
  };
};
