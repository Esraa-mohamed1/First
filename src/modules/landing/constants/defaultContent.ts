import { LandingPageContent } from '../types/landing';

export const getTemplateDefaultContent = (course: any, templateName: string): LandingPageContent => {
  if (templateName === 'template_2') {
    const instructorName = typeof course?.instructor === 'object' && course.instructor !== null
      ? course.instructor.name || 'أ. سارة أحمد'
      : course?.instructor || 'أ. سارة أحمد';
    const instructorTitle = course?.instructor?.title || 'خبير تصميم واجهات وتجربة مستخدم (Lead UI/UX Designer)';
    const instructorBio = course?.instructor?.bio || 'خبرة تزيد عن 10 سنوات في تصميم المنتجات الرقمية لكبرى الشركات التقنية في المنطقة. ساهمت في تطوير أكثر من 50 تطبيقاً ناجحاً وحاصلة على جوائز دولية في الابتكار والتصميم الرقمي.';
    const instructorImage = course?.instructor?.profile_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400';

    return {
      hero: {
        title: course?.title || 'إتقان تطوير واجهات المستخدم بالتصميم الذكي',
        description: course?.description || 'اكتشف أسرار تصميم واجهات مستخدم مذهلة وتجارب مستخدم سلسة في هذه الدورة الشاملة.',
        image: course?.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1600',
        buttonText: 'سجل الآن',
        buttonLink: '#subscribe',
        buttonBackgroundColor: '#0055d9',
        backgroundColor: '#020617',
        textColor: '#ffffff',
        typography: {
          titleSize: 48,
          bodySize: 18
        }
      },
      about: {
        title: 'عن هذه الرحلة التعليمية',
        description: course?.description || 'اكتشف أسرار تصميم واجهات مستخدم مذهلة وتجارب مستخدم سلسة في هذه الدورة الشاملة. من الأساسيات إلى التطبيقات المتقدمة، ستتعلم كيف تبني منتجات رقمية يحبها الناس.',
        investmentTitle: 'استثمارك في مستقبلك',
        discountBadge: 'خصم 40% لفترة محدودة',
        guaranteeText: 'ضمان استرداد الأموال لمدة 14 يوماً',
        buttonText: 'سجل الآن',
        buttonBackgroundColor: '#0055d9',
        backgroundColor: '#faf8ff',
        textColor: '#191b23'
      },
      features: {
        title: 'بنية الدورة المتميزة',
        items: [
          { id: 'f1', title: 'مستوى الدورة', subtitle: 'مبتدئ إلى متوسط', icon: 'Signal' },
          { id: 'f2', title: 'المدة الزمنية', subtitle: 'مرنة حسب رغبتك', icon: 'Clock' },
          { id: 'f3', title: 'الشهادة', subtitle: 'شهادة إتمام معتمدة', icon: 'Award' },
          { id: 'f4', title: 'الوصول الكامل', subtitle: 'وصول مدى الحياة', icon: 'Infinity' }
        ],
        backgroundColor: '#faf8ff',
        textColor: '#191b23'
      },
      chapters: {
        title: 'محتوى الدورة',
        showLessons: true,
        backgroundColor: '#faf8ff',
        textColor: '#191b23'
      },
      instructor: {
        title: 'عن المدرب',
        name: instructorName,
        jobTitle: instructorTitle,
        bio: instructorBio,
        image: instructorImage,
        badges: ['Google Certified', 'Interaction Design Expert', 'Mentor at ADPList'],
        badgeBackgroundColor: '#ffffff',
        badgeTextColor: '#434654',
        backgroundColor: '#faf8ff',
        textColor: '#191b23'
      },
      benefits: {
        title: 'ماذا ستحصل عليه؟',
        items: [
          '30 ساعة من مقاطع الفيديو عالية الجودة مصممة بعناية لتناسب إيقاع تعلمك.',
          '15 مشروع تطبيقي لبناء معرض أعمالك، لتنتقل من النظرية إلى التطبيق الحقيقي.',
          'ملفات ومصادر قابلة للتحميل تشمل قوالب عمل ومصادر إلهام احترافية.',
          'وصول إلى مجتمع الطلاب الخاص للحصول على دعم مستمر ومراجعة لأعمالك.'
        ],
        backgroundColor: '#faf8ff',
        textColor: '#191b23'
      },
      cta: {
        title: 'جاهز لتبدأ رحلتك الإبداعية؟',
        description: 'انضم إلى آلاف الطلاب الذين غيروا مسارهم المهني من خلال إتقان فن الـ UI/UX.',
        buttonText: 'ابدأ الآن',
        buttonBackgroundColor: '#ffffff',
        backgroundColor: '#0040a7',
        textColor: '#ffffff'
      },
      learning: {
        title: 'ماذا ستتعلم في هذه الدورة؟',
        subtitle: 'مش مجرد فيديوهات مسجلة — منظومة تعلّم كاملة مصممة لتوصلك لنتيجة.',
        cards: [],
        backgroundColor: '#f8fafc',
        textColor: '#191b23'
      },
      payment: {
        title: 'وسائل الدفع المتاحة للامتلاك',
        background: '#ffffff',
        textColor: '#191b23'
      },
      faq: {
        title: 'الأسئلة الشائعة حول الدورة',
        items: [
          { question: 'هل الدورة مناسبة للمبتدئين؟', answer: 'نعم، نبدأ معك من الصفر التام خطوة بخطوة حتى تصبح محترفاً.' },
          { question: 'كيف يمكنني التواصل مع المحاضر للحصول على الدعم؟', answer: 'سيكون هناك مجتمع خاص ومباشر للمشتركين للتواصل اليومي وحل العقبات.' },
          { question: 'هل أحصل على شهادة إتمام بعد الدورة؟', answer: 'بالتأكيد، يتم إصدار شهادة إتمام معتمدة باسمك فور الانتهاء من جميع المهام والمشروع النهائي.' }
        ],
        backgroundColor: '#f8fafc',
        textColor: '#191b23'
      },
      reviews: {
        title: 'آراء وتجارب طلابنا المتميزين',
        showSection: true,
        reviewType: 'carousel',
        backgroundColor: '#ffffff',
        textColor: '#191b23',
        items: []
      },
      whatsapp: {
        phoneNumber: '966500000000',
        message: 'مرحباً، أود الاستفسار عن تفاصيل الاشتراك في الدورة',
        showFloatingButton: true,
        showInlineSection: true,
        title: 'هل لديك أي استفسار آخر؟',
        subtitle: 'تواصل معنا مباشرة عبر واتساب وسيجيب فريق الدعم على كافة أسئلتك واستفساراتك في أقرب وقت.',
        buttonText: 'تواصل معنا عبر واتساب',
        backgroundColor: '#499A13',
        textColor: '#ffffff'
      },
      footer: {
        text: '© 2026 دَرّب التعليمية. جميع الحقوق محفوظة.',
        links: [
          { label: 'سياسة الخصوصية', url: '#' },
          { label: 'الشروط والأحكام', url: '#' },
          { label: 'مركز المساعدة', url: '#' }
        ],
        backgroundColor: '#f3f3fe',
        textColor: '#434654'
      }
    };
  }

  if (templateName === 'template_3') {
    const instructorName = typeof course?.instructor === 'object' && course.instructor !== null
      ? course.instructor.name || course?.instructor_name || 'أ. سارة أحمد'
      : course?.instructor_name || course?.instructor || 'أ. سارة أحمد';
    const instructorTitle = course?.instructor?.title || course?.instructor_title || 'خبير وكبير مصممي المنتجات الرقمية';
    const instructorBio = course?.instructor?.bio || course?.instructor_bio || 'خبرة طويلة في تصميم وتطوير المنتجات الرقمية الموجهة للمستخدمين. عمل مع عدة جهات ومستشار تقني للتصميم وتطوير الهويات وتسهيل رحلة العميل.';
    const instructorAvatar = course?.instructor?.avatar || course?.user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400';

    // Extract What You Will Learn
    let learningCards: any[] = [];
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
          color: 'blue'
        }));
    }

    if (learningCards.length === 0 && course?.learning_points) {
      learningCards = course.learning_points.map((pt: string, idx: number) => ({
        id: `learn-${idx}`,
        info_key: 'ماذا ستتعلم؟',
        info_value: pt,
        icon: 'CheckCircle2',
        color: 'blue'
      }));
    }

    if (learningCards.length === 0) {
      learningCards = [
        { id: 'l1', info_key: 'ماذا ستتعلم؟', info_value: 'فهم عميق لمبادئ سيكولوجية المستخدم وتأثيرها على التصميم.', icon: 'Check', color: 'blue' },
        { id: 'l2', info_key: 'ماذا ستتعلم؟', info_value: 'إتقان أدوات التصميم العالمية مثل Figma من الصفر الاحترافي.', icon: 'Check', color: 'blue' },
        { id: 'l3', info_key: 'ماذا ستتعلم؟', info_value: 'بناء أنظمة تصميم (Design Systems) متكاملة وقابلة للتوسع.', icon: 'Check', color: 'blue' },
        { id: 'l4', info_key: 'ماذا ستتعلم؟', info_value: 'تحويل الأفكار إلى بروتوتايب تفاعلي يحاكي المنتجات الحقيقية بدقة.', icon: 'Check', color: 'blue' }
      ];
    }

    return {
      hero: {
        title: course?.title || 'إتقان تصميم واجهات وتجربة المستخدم (UI/UX) - من الصفر للاحتراف',
        subtitle: 'الرئيسية > التصميم',
        description: course?.description || 'تعلم كيفية بناء منتجات رقمية عالمية المستوى من خلال فهم سلوك المستخدم وإتقان أدوات التصميم الحديثة مثل Figma.',
        image: course?.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200',
        buttonText: 'اشترك وسجل بالدورة الآن',
        buttonLink: '#payment',
        backgroundColor: '#ffffff',
        textColor: '#191b23',
        typography: {
          titleSize: 42,
          bodySize: 16
        }
      },
      learning: {
        title: 'ماذا ستتعلم في هذه الدورة؟',
        subtitle: 'منهج عملي مكثف يركز على التطبيق الحقيقي وبناء معرض أعمالك.',
        cards: learningCards,
        backgroundColor: '#ffffff',
        textColor: '#191b23'
      },
      chapters: {
        title: 'محتوى الدورة منهج متكامل',
        showLessons: true,
        backgroundColor: '#f0f2f5',
        textColor: '#191b23'
      },
      instructor: {
        title: 'عن المحاضر والمدرب',
        name: instructorName,
        jobTitle: instructorTitle,
        bio: instructorBio,
        avatar: instructorAvatar,
        studentsCount: '45,000+',
        coursesCount: '12+'
      } as any,
      faq: {
        title: 'الأسئلة الشائعة حول البرنامج',
        items: [
          { question: 'هل الدورة مناسبة للمبتدئين بدون أي خلفية في التصميم؟', answer: 'نعم، نبدأ معك من المفاهيم الأساسية وسيكولوجية المستخدم خطوة بخطوة حتى الاحتراف.' },
          { question: 'ما هي البرامج والأدوات التي سنستخدمها في الدورة؟', answer: 'سنعتمد بشكل أساسي على أحدث إصدار من Figma بالإضافة إلى أدوات بناء الأنظمة والبروتوتايب.' },
          { question: 'هل تشمل الدورة مشاريع عملية لمعرض الأعمال؟', answer: 'بالتأكيد، ستنفذ 3 مشاريع تطبيقية كاملة تؤهلك للتقديم على وظائف أو العمل الحر فوراً.' }
        ],
        backgroundColor: '#ffffff',
        textColor: '#191b23'
      },
      payment: {
        title: 'رسوم الاشتراك الفوري بالدورة',
        description: 'اشترك وسجل بالدورة الآن',
        background: '#2563eb',
        textColor: '#ffffff'
      },
      template3_requirements: {
        title: 'المتطلبات الأساسية للبدء',
        items: [
          'لا يشترط وجود خبرة سابقة في التصميم أو التطوير.',
          'جهاز كمبيوتر (Mac أو Windows) متصل بالإنترنت.',
          'الالتزام والرغبة بالتطبيق والعمل والتطوير المستمر.'
        ],
        backgroundColor: '#ffffff',
        textColor: '#191b23'
      },
      template3_learning: {
        cards: learningCards,
        backgroundColor: '#ffffff',
        textColor: '#191b23'
      },
      template3_curriculum: {
        title: 'محتوى الدورة منهج متكامل',
        backgroundColor: '#ffffff',
        textColor: '#191b23'
      },
      template3_instructor: {
        title: 'عن المحاضر والمدرب',
        name: instructorName,
        jobTitle: instructorTitle,
        bio: instructorBio,
        avatar: instructorAvatar,
        studentsCount: '45,000+',
        studentsLabel: 'طالب مستفيد',
        coursesCount: '12+',
        coursesLabel: 'برنامج تدريبي',
        backgroundColor: '#ffffff',
        textColor: '#191b23'
      },
      template3_faq: {
        title: 'الأسئلة الشائعة حول البرنامج',
        items: [
          { question: 'هل الدورة مناسبة للمبتدئين بدون أي خلفية في التصميم؟', answer: 'نعم، نبدأ معك من المفاهيم الأساسية وسيكولوجية المستخدم خطوة بخطوة حتى الاحتراف.' },
          { question: 'ما هي البرامج والأدوات التي سنستخدمها في الدورة؟', answer: 'سنعتمد بشكل أساسي على أحدث إصدار من Figma بالإضافة إلى أدوات بناء الأنظمة والبروتوتايب.' },
          { question: 'هل تشمل الدورة مشاريع عملية لمعرض الأعمال؟', answer: 'بالتأكيد، ستنفذ 3 مشاريع تطبيقية كاملة تؤهلك للتقديم على وظائف أو العمل الحر فوراً.' }
        ],
        backgroundColor: '#ffffff',
        textColor: '#191b23'
      },
      template3_pricing: {
        title: 'رسوم الاشتراك الفوري بالدورة',
        buttonText: 'اشترك وسجل بالدورة الآن',
        guaranteeText: 'ضمان استرداد الأموال كاملة خلال 30 يوماً',
        items: [
          'وصول كامل لكافة المحاضرات والدروس المصورة',
          'ملفات عمل ومصادر وتطبيقات قابلة للتحميل',
          'شهادة إتمام معتمدة باسمك من منصة دَرّب',
          'تحديثات دورية مجانية للمحتوى مدى الحياة',
          'إمكانية الحضور والمتابعة من الهاتف أو الكمبيوتر'
        ],
        backgroundColor: '#ffffff',
        textColor: '#191b23',
        headerBackgroundColor: '#2563eb',
        headerTextColor: '#ffffff'
      },
      whatsapp: {
        phoneNumber: '966500000000',
        message: 'مرحباً، أود الاستفسار عن تفاصيل الاشتراك في الدورة',
        showFloatingButton: true,
        showInlineSection: true,
        title: 'هل لديك أي استفسار آخر؟',
        subtitle: 'تواصل معنا مباشرة عبر واتساب وسيجيب فريق الدعم على كافة أسئلتك واستفساراتك في أقرب وقت.',
        buttonText: 'تواصل معنا عبر واتساب',
        backgroundColor: '#499A13',
        textColor: '#ffffff'
      },
      reviews: {
        title: 'آراء الطلاب',
        showSection: false,
        items: []
      },
      footer: {
        text: 'حقوق النشر © 2026 أكاديمية درب. جميع الحقوق محفوظة.',
        links: [],
        backgroundColor: '#ffffff',
        textColor: '#64748b'
      }
    };
  }

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
      discountMessage: '⏳ الخصم ساري لفترة محدودة',
      backgroundColor: isTemplate1 ? '#082A24' : '#ffffff',
      textColor: isTemplate1 ? '#FBF7EE' : '#1f2937',
      typography: {
        titleSize: 42,
        bodySize: 16
      }
    },
    learning: {
      title: 'ماذا ستتعلم في هذه الدورة؟',
      subtitle: 'مش مجرد فيديوهات مسجلة — منظومة تعلّم كاملة مصممة لتوصلك لنتيجة.',
      cards: learningCards,
      backgroundColor: isTemplate1 ? '#ffffff' : '#f8fafc',
      textColor: '#1f2937',
      itemBackgroundColor: '#ffffff'
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
      textColor: '#1f2937',
      questionBackgroundColor: '#ffffff',
      answerBackgroundColor: '#FBF7EE'
    },
    reviews: {
      title: 'آراء وتجارب طلابنا المتميزين',
      showSection: true,
      reviewType: 'carousel',
      backgroundColor: isTemplate1 ? '#ffffff' : '#ffffff',
      textColor: '#1f2937',
      items: [
        {
          id: 'rev-1',
          type: 'manual',
          name: 'محمد السيد',
          role: 'صاحب متجر إلكتروني — القاهرة',
          comment: 'كنت خايف تكون زي أي كورس نظري، لكن من تاني أسبوع كنت مطلّق أول حملة إعلانية لمشروعي وجبت مبيعات فعلية. أحسن استثمار عملته في نفسي.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
        },
        {
          id: 'rev-2',
          type: 'whatsapp',
          waSenderName: 'واتساب — رسالة من مشتركة',
          waBubble1In: 'أستاذ أحمد أنا قفلت أول عميل فريلانس بـ 4,000 ريال 🎉 كل اللي عملته طبقت اللي في الأسبوع الخامس حرفيًا',
          waBubble1Time: '9:42 م',
          waBubble2Out: 'ألف مبروك يا سارة 👏 دي بداية بس، كملي على نفس الخطة',
          waBubble2Time: '9:45 م'
        },
        {
          id: 'rev-3',
          type: 'manual',
          name: 'عبدالله القحطاني',
          role: 'مسوّق مستقل — الرياض',
          comment: 'المحتوى بالعربي وبأمثلة من السوق السعودي، وهذا الشيء ما لقيته في أي دورة ثانية. القوالب الجاهزة وحدها تسوى سعر الدورة.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
        },
        {
          id: 'rev-4',
          type: 'whatsapp',
          waSenderName: 'واتساب — رسالة من مشترك',
          waBubble1In: 'حبيت أشكرك، اترقيت في شغلي بعد ما طبقت خطة الحملات اللي في الدورة على براند الشركة 🙏',
          waBubble1Time: '3:18 م',
          waBubble2Out: 'المدير طلب مني أدرّب الفريق كله عليها 😂',
          waBubble2Time: '3:19 م'
        }
      ]
    },
    whatsapp: {
      phoneNumber: '966500000000',
      message: 'مرحباً، أود الاستفسار عن تفاصيل الاشتراك في الدورة',
      showFloatingButton: true,
      showInlineSection: true,
      title: 'هل لديك أي استفسار آخر؟',
      subtitle: 'تواصل معنا مباشرة عبر واتساب وسيجيب فريق الدعم على كافة أسئلتك واستفساراتك في أقرب وقت.',
      buttonText: 'تواصل معنا عبر واتساب',
      contactMessage: 'سيب اسمك ورقم موبايلك، وفريق الدورة هيتواصل معاك خلال 24 ساعة يجاوب على كل أسئلتك ويساعدك تقرر إذا كانت الدورة مناسبة لك — بدون أي التزام.',
      backgroundColor: '#499A13',
      textColor: '#ffffff'
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
