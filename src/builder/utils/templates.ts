import { TemplateSchema } from '../interfaces';

export const MOCK_TEMPLATES: Record<string, TemplateSchema> = {
  'academy-dashboard': {
    id: 'academy-dashboard',
    name: 'القالب الأول (الكلاسيكي الملكي)',
    description: 'تصميم احترافي بلمسات زرقاء ملكية وتخطيط أكاديمي راقٍ.',
    status: 'published',
    version: '1.0',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'navbar-t1',
        type: 'navbar',
        props: {
          title: 'درب',
          showSearch: false,
          showProfile: false,
          bgColor: '#ffffff',
          borderColor: 'transparent',
          isLandingPage: true,
          order: 1
        }
      },
      {
        id: 'hero-t1',
        type: 'hero',
        props: {
          title: 'ابدأ رحلتك في UI/UX واصنع تصاميم تخطف الانتباه من أول نظرة',
          subtitle: 'نتعلم خطوة بخطوة إزاي نصمم واجهات احترافية وفهم سلوك المستخدم بشكل عملي.',
          badgeText: 'ابدأ رحلتك في UI/UX',
          buttonText: 'ابدأ الآن',
          buttonLink: '#',
          showSecondButton: true,
          secondButtonText: 'تصفح الدورات',
          secondButtonColor: '#ffffff',
          secondButtonTextColor: '#7c3aed',
          heroImage: '/assets/ima.png',
          heroImagePosition: 'right', // puts text first, image second (on the left in RTL)
          align: 'right',
          backgroundColor: '#ffffff',
          titleColor: '#1f2937',
          subtitleColor: '#4b5563',
          buttonColor: '#7c3aed',
          buttonTextColor: '#ffffff',
          order: 2
        }
      },
      {
        id: 'about-t1',
        type: 'hero',
        props: {
          title: 'نبذة عني',
          subtitle: 'أكثر من 5 سنوات من الخبرة في مشاريع حقيقية مع شركات عالمية وناشئة، ساعدت مئات الطلاب على دخول سوق العمل وبناء مسيرة مهنية مستدامة في عالم التصميم الرقمي.',
          buttonText: '',
          heroImage: '/assets/profile.png',
          heroImagePosition: 'right', // puts text first, image second (on the left in RTL)
          align: 'right',
          backgroundColor: '#ffffff',
          titleColor: '#1f2937',
          subtitleColor: '#4b5563',
          order: 3
        }
      },
      {
        id: 'kpis-t1',
        type: 'kpi-cards',
        props: {
          gridCols: '3',
          backgroundColor: '#ffffff',
          order: 4,
          cards: [
            { id: 'kpi-1', title: 'سنوات خبرة', value: '+5', change: '', isPositive: true, icon: '', color: '#7c3aed' },
            { id: 'kpi-2', title: 'طالب', value: '500+', change: '', isPositive: true, icon: '', color: '#7c3aed' },
            { id: 'kpi-3', title: 'مشروع مكتمل', value: '100+', change: '', isPositive: true, icon: '', color: '#7c3aed' }
          ]
        }
      },
      {
        id: 'courses-t1',
        type: 'course-cards',
        props: {
          title: 'الدورات المتاحة',
          gridCols: '3',
          showPrice: true,
          showStudentsCount: false,
          buttonBg: '#7c3aed',
          background_color: '#f4f4f5',
          padding_top: 64,
          padding_bottom: 64,
          order: 5,
          courses: [
            { id: 'c1', title: 'أساسيات تصميم UI/UX', instructor: 'أ. عمرو البرلسي', price: '٤٠٠ ريال', students: '٨٧ طالب', duration: '٨ ساعات', image: '/assets/course3.jpg', description: 'تعلم مبادئ التصميم خطوة بخطوة وكيفية التعامل مع الألوان والخطوط لبناء واجهات سهلة الاستخدام ومحترفة.' },
            { id: 'c2', title: 'إتقان فيجما (FigJam)', instructor: 'أ. مصطفى عبد الصبور', price: '٢٥٠ ريال', students: '٣١٢ طالب', duration: '١٥ ساعة', image: '/assets/course1.png', description: 'تعلم كيفية استخدام أداة FigJam للعصف الذهني والتخطيط وتصميم خرائط تجربة المستخدم بشكل تعاوني وممتع.' },
            { id: 'c3', title: 'إتقان فيجما (FigJam)', instructor: 'أ. صهيب حسن', price: '١٩٠ ريال', students: '٢٤٣ طالب', duration: '١٢ ساعة', image: '/assets/course1.png', description: 'تعلم كيفية استخدام أداة FigJam للعصف الذهني والتخطيط وتصميم خرائط تجربة المستخدم بشكل تعاوني وممتع.' }
          ]
        }
      },
      {
        id: 'testimonials-t1',
        type: 'testimonials_section',
        props: {
          title: 'ماذا يقول طلابي ؟',
          subtitle: 'آراء حقيقية من طلابنا الذين بدأوا مسيرتهم المهنية في مجال تصميم واجهات المستخدم.',
          background_color: '#ffffff',
          text_color: '#1e293b',
          padding_top: 64,
          padding_bottom: 64,
          order: 6,
          items: [
            { id: 't1', order: 1, props: { quote: 'الدورات ممتازة وتطبيقية جداً، حصلت على أول عميل بعد أسبوعين فقط من إتمام الكورس.', author: 'أحمد المنصوري', role: 'مصمم UI/UX مستقل', rating: 5 } },
            { id: 't2', order: 2, props: { quote: 'أسلوب التدريس واضح ومنهجي، ساعدني على بناء مشروعي الخاص بثقة ومهارة عالية.', author: 'سارة العمري', role: 'مطورة ويب متقدمة', rating: 5 } },
            { id: 't3', order: 3, props: { quote: 'استطعت مضاعفة دخلي خلال 3 أشهر بعد التخصص في تصميم واجهات المستخدم.', author: 'خالد الزهراني', role: 'مصمم واجهات محترف', rating: 5 } }
          ]
        }
      },
      {
        id: 'gallery-t1',
        type: 'gallery_section',
        props: {
          title: 'معرض أعمالي',
          subtitle: 'استعرض بعضاً من المشاريع والتصاميم التي قام طلابنا بتطويرها خلال التدريب الميداني والعملي.',
          background_color: '#ffffff',
          grid_cols: 3,
          image_aspect: 'auto',
          padding_top: 64,
          padding_bottom: 64,
          order: 7,
          items: [
            { id: 'g1', order: 1, props: { image_url: '/assets/stats.jpg', caption: 'تصميم تطبيق خدمات مالية' } },
            { id: 'g2', order: 2, props: { image_url: '/assets/beniftsbg.png', caption: 'تصميم موقع تجارة إلكترونية' } },
            { id: 'g3', order: 3, props: { image_url: '/assets/paymentbg.jpg', caption: 'تصميم تطبيق توصيل طلبات' } },
            { id: 'g4', order: 4, props: { image_url: '/assets/stats.jpg', caption: 'تصميم لوحة تحكم ذكية' } },
            { id: 'g5', order: 5, props: { image_url: '/assets/beniftsbg.png', caption: 'تصميم واجهة محفظة رقمية' } },
            { id: 'g6', order: 6, props: { image_url: '/assets/paymentbg.jpg', caption: 'تصميم تطبيق سياحة وسفر' } }
          ]
        }
      },
      {
        id: 'cta-t1',
        type: 'hero',
        props: {
          title: 'هل أنت مستعد لبدء مسيرتك في التصميم؟',
          subtitle: 'اصنع مستقبلك اليوم وابدأ بتطوير مهاراتك خطوة بخطوة.',
          buttonText: 'سجل الآن',
          buttonLink: '#',
          align: 'center',
          backgroundColor: '#7c3aed',
          titleColor: '#ffffff',
          subtitleColor: '#f3e8ff',
          buttonColor: '#ffffff',
          buttonTextColor: '#7c3aed',
          showSecondButton: false,
          padding_top: 64,
          padding_bottom: 64,
          order: 8
        }
      }
    ]
  },
  'template_2': {
    id: 'template_2',
    name: 'قالب يوديمي الاحترافي',
    description: 'تصميم تعليمي كلاسيكي وعصري مستوحى من منصة Udemy، لعرض الكورسات والتصنيفات بطريقة مرتبة وجذابة.',
    status: 'published',
    version: '1.0',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'hero-t2',
        type: 'hero_section',
        props: {
          background_color: '#ffffff',
          text_color: '#1c1d1f',
          padding_top: 96,
          padding_bottom: 96,
          title: 'تعلّم بلا حدود. طوّر مهاراتك.',
          subtitle: 'انضم إلى ملايين المتعلمين من جميع أنحاء العالم واستكشف آلاف الدورات التدريبية المخصصة لتطوير مستقبلك المهني.',
          show_button: true,
          button_text: 'ابدأ التعلم الآن',
          button_link: '#',
          button_color: '#a435f0',
          align: 'right',
        }
      },
      {
        id: 'features-t2',
        type: 'features_section',
        props: {
          title: 'لماذا تتعلم معنا؟',
          subtitle: 'ميزات تضمن لك تجربة تعليمية فريدة ومستمرة',
          background_color: '#f7f9fa',
          text_color: '#1c1d1f',
          grid_cols: 3,
          padding_top: 64,
          padding_bottom: 64,
          items: [
            { id: 'feat-t2-1', order: 1, props: { icon: 'PlayCircle', icon_color: '#a435f0', title: 'أكثر من 200,000 دورة فيديو', description: 'استكشف مواضيع جديدة بأسعار مناسبة وبشكل مرن.' } },
            { id: 'feat-t2-2', order: 2, props: { icon: 'Award', icon_color: '#a435f0', title: 'مدربون وخبراء معتمدون', description: 'تعلم من المحترفين في مجالاتهم والذين يمارسون المهنة فعلياً.' } },
            { id: 'feat-t2-3', order: 3, props: { icon: 'Clock', icon_color: '#a435f0', title: 'وصول مدى الحياة', description: 'تعلم بالوتيرة التي تناسب جدولك ومواعيد حياتك اليومية.' } },
          ]
        }
      },
      {
        id: 'categories-t2',
        type: 'categories_section',
        props: {
          title: 'أهم مجالات التعلم والمهارات',
          subtitle: 'اختر المجال الذي يناسب شغفك وابدأ رحلتك نحو التميز',
          background_color: '#ffffff',
          text_color: '#1c1d1f',
          grid_cols: 3,
          padding_top: 64,
          padding_bottom: 64,
          items: [
            { id: 'cat-t2-1', order: 1, props: { name: 'تطوير الويب وبرمجة المواقع', icon: 'Code', count: '18', description: 'HTML, CSS, JavaScript, React, Node.js' } },
            { id: 'cat-t2-2', order: 2, props: { name: 'تصميم واجهات المستخدم UI/UX', icon: 'PenTool', count: '12', description: 'Figma, Adobe XD, تجربة المستخدم, أبحاث التصميم' } },
            { id: 'cat-t2-3', order: 3, props: { name: 'إدارة الأعمال والتسويق الرقمي', icon: 'TrendingUp', count: '15', description: 'التسويق عبر البريد، الإعلانات، تحسين محركات البحث SEO' } },
          ]
        }
      },
      {
        id: 'courses-t2',
        type: 'course-cards',
        props: {
          title: 'أحدث الدورات التدريبية المتاحة',
          gridCols: '3',
          showPrice: true,
          showStudentsCount: true,
          buttonBg: '#a435f0',
          background_color: '#ffffff',
          padding_top: 64,
          padding_bottom: 64,
        }
      },
      {
        id: 'testimonials-t2',
        type: 'testimonials_section',
        props: {
          title: 'ماذا يقول طلابنا؟',
          subtitle: 'آراء وتجارب حقيقية من متعلمين حققوا أهدافهم المهنية بفضل منصتنا.',
          background_color: '#f7f9fa',
          text_color: '#1c1d1f',
          padding_top: 64,
          padding_bottom: 64,
          items: [
            { id: 'tst-t2-1', order: 1, props: { quote: 'الدورات ممتازة وتطبيقية جداً، حصلت على أول وظيفة لي بعد إتمام المسار التدريبي مباشرة.', author: 'نورة القحطاني', role: 'مطورة تطبيقات جوال', rating: 5 } },
            { id: 'tst-t2-2', order: 2, props: { quote: 'المحتوى احترافي جداً والمدربين ممتازين، يوفر لك ما تبحث عنه بالضبط بأسرع طريقة.', author: 'يوسف الحربي', role: 'محلل بيانات أول', rating: 5 } },
            { id: 'tst-t2-3', order: 3, props: { quote: 'ساعدتني هذه المنصة على الانتقال إلى مجال الأمن السيبراني وتأسيس مشاريعي الخاصة بثقة.', author: 'منى السعيد', role: 'مهندسة أمن شبكات', rating: 5 } },
          ]
        }
      },
    ]
  },
  'template_3': {
    id: 'template_3',
    name: 'القالب الأرجواني الإبداعي (Creative Purple)',
    description: 'تصميم فني راقٍ بلمسات أرجوانية وخلفيات ناعمة ملائم للأكاديميات الفنية والتصميم والتحريك.',
    status: 'draft',
    version: '1.0',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'navbar-3',
        type: 'navbar',
        props: {
          title: 'أكاديمية الفنون البصرية والتحريك',
          showSearch: true,
          showProfile: true,
          bgColor: '#FAF5FF',
          borderColor: '#f3e8ff'
        }
      },
      {
        id: 'hero-3',
        type: 'hero',
        props: {
          title: 'أطلق إبداعك الفني معنا اليوم',
          subtitle: 'مسارات تعليمية متطورة لرواد التصميم الجرافيكي، التحريك ثلاثي الأبعاد، والفنون البصرية بإشراف كبار الفنانين المبدعين.',
          buttonText: 'تصفح مسارات التعلم',
          buttonLink: '#',
          align: 'right',
          titleColor: '#581c87',
          subtitleColor: '#6b21a8',
          buttonColor: '#8b5cf6',
          buttonTextColor: '#ffffff',
          backgroundColor: '#FAF5FF',
          bgImage: ''
        }
      },
      {
        id: 'kpis-3',
        type: 'kpi-cards',
        props: {
          gridCols: '3',
          cards: [
            { id: '1', title: 'المشاركين النشطين', value: '842 مصمم', change: '+24% هذا الشهر', isPositive: true, icon: 'Users', color: '#8b5cf6' },
            { id: '2', title: 'المشاريع المنجزة', value: '1,890 مشروع', change: '+12% مؤخراً', isPositive: true, icon: 'Award', color: '#8b5cf6' },
            { id: '3', title: 'الشهادات الصادرة', value: '450 شهادة', change: '+6% منذ أمس', isPositive: true, icon: 'CheckCircle', color: '#581c87' }
          ]
        }
      },
      {
        id: 'metrics-3',
        type: 'metrics',
        props: {
          title: 'معدل تقدم الدفعة الإبداعية الحالية',
          layout: 'grid',
          cardBg: '#FAF5FF'
        }
      },
      {
        id: 'courses-3',
        type: 'course-cards',
        props: {
          title: 'أحدث الكورسات الفنية والتحريك ثلاثي الأبعاد',
          gridCols: '3',
          showPrice: true,
          showStudentsCount: true,
          buttonBg: '#8b5cf6'
        }
      }
    ]
  },
  'template_4': {
    id: 'template_4',
    name: 'القالب الريادي الذهبي (Corporate Teal)',
    description: 'قالب ريادي أنيق مناسب لمجالات التمويل والتكنولوجيا والاستشارات الإدارية المرموقة بلمسات تيل وذهبية.',
    status: 'draft',
    version: '1.0',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'navbar-4',
        type: 'navbar',
        props: {
          title: 'الأكاديمية الريادية للتطوير',
          showSearch: true,
          showProfile: true,
          bgColor: '#ffffff',
          borderColor: '#e2d3bb'
        }
      },
      {
        id: 'hero-4',
        type: 'hero',
        props: {
          title: 'استثمر في مستقبلك المهني اليوم',
          subtitle: 'تطوير القيادات، التكنولوجيا المالية، وإدارة المشاريع بمناهج حديثة ومعتمدة عالمياً.',
          buttonText: 'تصفح البرامج التنفيذية',
          buttonLink: '#',
          align: 'right',
          titleColor: '#115e59',
          subtitleColor: '#0f766e',
          buttonColor: '#0d9488',
          buttonTextColor: '#ffffff',
          backgroundColor: '#f0fdfa',
          bgImage: ''
        }
      },
      {
        id: 'kpis-4',
        type: 'kpi-cards',
        props: {
          gridCols: '3',
          cards: [
            { id: '1', title: 'القادة المتخرجين', value: '340 قائد تنفيذي', change: '+14% هذا الفصل', isPositive: true, icon: 'Award', color: '#0d9488' },
            { id: '2', title: 'نسبة التوظيف والترقية', value: '94.2%', change: '+2.1% مؤخراً', isPositive: true, icon: 'TrendingUp', color: '#0d9488' },
            { id: '3', title: 'شركاء الأعمال', value: '18 جهة حكومية وخاصة', change: 'ثابت', isPositive: true, icon: 'Users', color: '#0f766e' }
          ]
        }
      },
      {
        id: 'courses-4',
        type: 'course-cards',
        props: {
          title: 'البرامج التنفيذية والدبلومات المهنية المتاحة',
          gridCols: '3',
          showPrice: true,
          showStudentsCount: true,
          buttonBg: '#0d9488'
        }
      }
    ]
  }
};

// Alias: template_1 uses the same sections as academy-dashboard
MOCK_TEMPLATES['template_1'] = { ...MOCK_TEMPLATES['academy-dashboard'], id: 'template_1', name: 'القالب الأول (الكلاسيكي الملكي)' };

export const getTemplateById = (id: string): TemplateSchema => {
  // Explicit map for known aliases
  const aliasMap: Record<string, string> = {
    'template_1': 'template_1',
  };
  const resolvedId = aliasMap[id] || id;
  return MOCK_TEMPLATES[resolvedId] || MOCK_TEMPLATES['academy-dashboard'];
};

