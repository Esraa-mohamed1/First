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
          heroImagePosition: 'right',
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
          heroImagePosition: 'right',
          align: 'right',
          backgroundColor: '#ffffff',
          titleColor: '#1f2937',
          subtitleColor: '#4b5563',
          order: 3
        }
      },
      {
        id: 'features-t1',
        type: 'features_section',
        props: {
          title: 'ما يميز أكاديميتنا',
          subtitle: 'نقدم لك أفضل تجربة تعليمية متكاملة لضمان نجاحك وتفوقك المهني.',
          background_color: '#ffffff',
          text_color: '#1e293b',
          grid_cols: 3,
          padding_top: 64,
          padding_bottom: 64,
          order: 4,
          items: [
            { id: 'f1', order: 1, props: { icon: 'PlayCircle', icon_color: '#7c3aed', title: 'محتوى تعليمي تطبيقي', description: 'دروس مسجلة بجودة عالية ومشاريع حقيقية تصممها بنفسك.' } },
            { id: 'f2', order: 2, props: { icon: 'Users', icon_color: '#7c3aed', title: 'دعم ومتابعة مستمرة', description: 'تواصل مباشر مع المدربين للحصول على إجابات لاستفساراتك وتقييم أعمالك.' } },
            { id: 'f3', order: 3, props: { icon: 'Award', icon_color: '#7c3aed', title: 'شهادات إتمام معتمدة', description: 'احصل على شهادة تثبت مهاراتك عند إتمامك لكافة المتطلبات والمشاريع.' } }
          ]
        }
      },
      {
        id: 'kpis-t1',
        type: 'kpi-cards',
        props: {
          gridCols: '3',
          backgroundColor: '#ffffff',
          order: 5,
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
          order: 6,
          courses: [
            { id: 'c1', title: 'أساسيات تصميم UI/UX', instructor: 'أ. عمرو البرلسي', price: '٤٠٠ ريال', students: '٨٧ طالب', duration: '٨ ساعات', image: '/assets/course3.jpg', description: 'تعلم مبادئ التصميم خطوة بخطوة وكيفية التعامل مع الألوان والخطوط لبناء واجهات سهلة الاستخدام ومحترفة.' },
            { id: 'c2', title: 'إتقان فيجما (FigJam)', instructor: 'أ. مصطفى عبد الصبور', price: '٢٥٠ ريال', students: '٣١٢ طالب', duration: '١٥ ساعة', image: '/assets/course1.png', description: 'تعلم كيفية استخدام أداة FigJam للعصف الذهني والتخطيط وتصميم خرائط تجربة المستخدم بشكل تعاوني وممتع.' },
            { id: 'c3', title: 'إتقان فيجما (FigJam)', instructor: 'أ. صهيب حسن', price: '١٩٠ ريال', students: '٢٤٣ طالب', duration: '١٢ ساعة', image: '/assets/course1.png', description: 'تعلم كيفية استخدام أداة FigJam للعصف الذهني والتخطيط وتصميم خرائط تجربة المستخدم بشكل تعاوني وممتع.' }
          ]
        }
      },
      {
        id: 'pricing-t1',
        type: 'pricing_section',
        props: {
          title: 'خطط الاشتراك والأسعار',
          subtitle: 'اختر الخطة المناسبة لك وابدأ التعلم وتطوير مهاراتك اليوم.',
          background_color: '#ffffff',
          text_color: '#1e293b',
          padding_top: 64,
          padding_bottom: 64,
          order: 7,
          items: [
            {
              id: 'p1',
              order: 1,
              props: {
                title: 'الخطة الأساسية',
                price: '99$',
                duration: 'شهرياً',
                features: ['الوصول إلى الدورات الأساسية', 'دعم عبر البريد الإلكتروني', 'شهادة إتمام أساسية'],
                button_text: 'اشترك الآن',
                button_link: '#',
                is_popular: false
              }
            },
            {
              id: 'p2',
              order: 2,
              props: {
                title: 'الخطة الاحترافية',
                price: '199$',
                duration: 'شهرياً',
                features: ['الوصول إلى جميع الدورات', 'دعم مباشر ومتابعة مخصصة', 'شهادة معتمدة ومشاريع عملية'],
                button_text: 'اشترك الآن',
                button_link: '#',
                is_popular: true
              }
            },
            {
              id: 'p3',
              order: 3,
              props: {
                title: 'الخطة المتقدمة',
                price: '299$',
                duration: 'شهرياً',
                features: ['استشارات خاصة 1-on-1', 'مراجعة بورتفوليو مخصصة', 'أولوية دعم وتوظيف'],
                button_text: 'اشترك الآن',
                button_link: '#',
                is_popular: false
              }
            }
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
          order: 8,
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
          order: 9,
          items: [
            { id: 'g1', order: 1, props: { image_url: '/assets/stats.jpg', caption: 'تصميم تطبيق خدمات مالية' } },
            { id: 'g2', order: 2, props: { image_url: '/assets/beniftsbg.png', caption: 'تصميم موقع تجارة إلكترونية' } },
            { id: 'g3', order: 3, props: { image_url: '/assets/paymentbg.jpg', caption: 'تصميم تطبيق توصيل طلبات' } }
          ]
        }
      },
      {
        id: 'faq-t1',
        type: 'faq_section',
        props: {
          title: 'الأسئلة الشائعة للطلاب',
          subtitle: 'إجابات على أسئلتك قبل التسجيل في برامجنا التدريبية.',
          background_color: '#f8fafc',
          text_color: '#1e293b',
          padding_top: 64,
          padding_bottom: 64,
          items: [
            { id: 'faq-t1-1', order: 1, props: { question: 'كيف أستفيد من التدريب العملي؟', answer: 'كل كورس يحتوي على مشاريع تطبيقية تبني من خلالها بورتفوليو قوي لعرضه على الشركات.' } },
            { id: 'faq-t1-2', order: 2, props: { question: 'هل الدورات مناسبة للمبتدئين؟', answer: 'نعم، نبدأ معك من الصفر خطوة بخطوة حتى الاحتراف.' } }
          ],
          order: 10
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
          order: 11
        }
      },
      {
        id: 'footer-t1',
        type: 'footer',
        props: {
          copyright: 'جميع الحقوق محفوظة',
          logoUrl: '',
          logoText: 'د',
          bgColor: '#ffffff',
          textColor: '#1f2937',
          showLogo: true,
          showSocials: true,
          order: 12
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
        id: 'nav-t2',
        type: 'navbar',
        props: {
          title: 'درب | Udemy',
          showSearch: true,
          showProfile: true,
          bgColor: '#ffffff',
          borderColor: '#e2e8f0',
          isLandingPage: true,
          order: 1
        }
      },
      {
        id: 'hero-t2',
        type: 'hero_section',
        props: {
          title: 'تعلّم بلا حدود. طوّر مهاراتك.',
          subtitle: 'انضم إلى ملايين المتعلمين من جميع أنحاء العالم واستكشف آلاف الدورات التدريبية المخصصة لتطوير مستقبلك المهني.',
          show_button: true,
          button_text: 'ابدأ التعلم الآن',
          button_link: '#',
          background_color: '#f8fafc',
          text_color: '#4b5563',
          title_color: '#1c1d1f',
          button_color: '#a435f0',
          button_text_color: '#ffffff',
          font_size: 44,
          font_weight: 800,
          padding_top: 80,
          padding_bottom: 80,
          align: 'right',
          slider_speed: 4,
          show_arrows: true,
          show_card_overlay: true,
          items: [
            {
              order: 1,
              props: {
                title: 'تعلّم مهارات المستقبل بالسرعة التي تناسبك',
                subtitle: 'اختر من بين آلاف الدورات التدريبية في البرمجة، التصميم، التسويق وغيرها من المجالات الأكثر طلباً في سوق العمل.',
                button_text: 'استكشف الدورات',
                button_link: '#',
                bg_image: '',
                background_color: '#f8fafc',
                button_color: '#1c1d1f',
                button_text_color: '#ffffff',
                title_color: '#1c1d1f',
                text_color: '#2d2f31',
                align: 'right',
                show_card_overlay: true
              }
            },
            {
              order: 2,
              props: {
                title: 'احصل على تدريب عملي ومشاريع حقيقية',
                subtitle: 'تعلم على أيدي خبراء ومحترفين يمارسون المهنة فعلياً، وابدأ في تطبيق ما تتعلمه مباشرة لبناء بورتفوليو متميز.',
                button_text: 'تعرّف على المدربين',
                button_link: '#',
                bg_image: '',
                background_color: '#f3f4f6',
                button_color: '#a435f0',
                button_text_color: '#ffffff',
                title_color: '#1c1d1f',
                text_color: '#2d2f31',
                align: 'right',
                show_card_overlay: true
              }
            }
          ],
          order: 2
        }
      },
      {
        id: 'features-t2',
        type: 'features_section',
        props: {
          title: 'ما الذي يميز تجربة التعلم معنا؟',
          subtitle: 'ميزات صُممت خصيصاً لمساعدتك على النجاح وتحقيق طموحك المهني',
          background_color: '#ffffff',
          text_color: '#1c1d1f',
          grid_cols: 3,
          padding_top: 60,
          padding_bottom: 60,
          items: [
            { id: 'feat-t2-1', order: 1, props: { icon: 'PlayCircle', icon_color: '#a435f0', title: 'دروس مرنة وعالية الجودة', description: 'شاهد دروس الفيديو المسجلة بدقة عالية على أي جهاز في أي وقت.' } },
            { id: 'feat-t2-2', order: 2, props: { icon: 'Users', icon_color: '#a435f0', title: 'تعلم من خبراء الصناعة', description: 'تفاعل مع مدربين ذوي خبرة وتلقى إجابات عن كل أسئلتك مباشرة.' } },
            { id: 'feat-t2-3', order: 3, props: { icon: 'Award', icon_color: '#a435f0', title: 'شهادات إتمام لمسيرتك', description: 'عزز سيرتك الذاتية بشهادات معتمدة عند إتمامك لأي مسار تدريبي.' } }
          ],
          order: 3
        }
      },
      {
        id: 'categories-t2',
        type: 'categories_section',
        props: {
          title: 'تصفح المجالات الأكثر طلباً',
          subtitle: 'اختر التخصص الذي تبحث عنه وابدأ رحلتك التعلّمية اليوم',
          background_color: '#f7f9fa',
          text_color: '#1c1d1f',
          grid_cols: 3,
          padding_top: 60,
          padding_bottom: 60,
          items: [
            { id: 'cat-t2-1', order: 1, props: { name: 'تطوير وبرمجة الويب', icon: 'Code', count: '24', description: 'HTML, CSS, JavaScript, React, Node.js, databases' } },
            { id: 'cat-t2-2', order: 2, props: { name: 'تصميم واجهات المستخدم UI/UX', icon: 'Sparkles', count: '14', description: 'Figma, design systems, wireframing, usability testing' } },
            { id: 'cat-t2-3', order: 3, props: { name: 'إدارة الأعمال والتسويق', icon: 'TrendingUp', count: '18', description: 'SEO, digital advertising, content strategies' } }
          ],
          order: 4
        }
      },
      {
        id: 'courses-t2',
        type: 'course-cards',
        props: {
          title: 'ابدأ رحلة التعلم مع دوراتنا الأكثر مبيعاً',
          gridCols: '3',
          showPrice: true,
          showStudentsCount: true,
          buttonBg: '#a435f0',
          background_color: '#ffffff',
          padding_top: 60,
          padding_bottom: 60,
          order: 5,
          courses: [
            { id: 'c1', title: 'تصميم واجهات المستخدم الشاملة من الصفر', instructor: 'أ. مصطفى الشافعي', price: '٢٩٠ ريال', students: '٤٥٠ طالب', duration: '١٨ ساعة', image: '', description: 'من أساسيات فيجما إلى تسليم المشاريع وبناء بورتفوليو قوي ومحترف.' },
            { id: 'c2', title: 'المرجع الكامل في تطوير الويب الحديث', instructor: 'أ. مازن عبد العزيز', price: '٣٩٠ ريال', students: '٩١٠ طالب', duration: '٤٢ ساعة', image: '', description: 'تعلم فرونت إند وباك إند وقم ببناء ١٠ تطبيقات حقيقية ونشرها.' },
            { id: 'c3', title: 'التسويق الرقمي وبناء العلامات التجارية الشخصية', instructor: 'أ. هند القاسم', price: '١٩٠ ريال', students: '٣٢٠ طالب', duration: '١٢ ساعة', image: '', description: 'كيفية كتابة المحتوى، وإطلاق الحملات الممولة وتحليل نتائجها.' }
          ]
        }
      },
      {
        id: 'testimonials-t2',
        type: 'testimonials_section',
        props: {
          title: 'ماذا يقول متعلمونا حول العالم؟',
          subtitle: 'قصص نجاح واقعية لطلاب غيروا مسارهم المهني وبنوا مهارات جديدة',
          background_color: '#f7f9fa',
          text_color: '#1c1d1f',
          padding_top: 60,
          padding_bottom: 60,
          avatar_size: 40,
          avatar_shape: 'circle',
          items: [
            { id: 't-t2-1', order: 1, props: { quote: 'الكورسات مبسطة وتطبيقية وتجيب عن جميع التساؤلات، حصلت على وظيفتي الأولى كمصمم بفضل هذه الدورة.', author: 'رائد المطيري', role: 'مصمم واجهات مستقل', rating: 5, avatar: '' } },
            { id: 't-t2-2', order: 2, props: { quote: 'كود نظيف ومنهجية واضحة جداً سهلت علي الدخول لعالم البرمجة بعد سنوات من التردد.', author: 'عبير الجار الله', role: 'مطور فرونت إند مبتدئ', rating: 5, avatar: '' } }
          ],
          order: 6
        }
      },
      {
        id: 'metrics-t2',
        type: 'kpi-cards',
        props: {
          gridCols: '4',
          backgroundColor: '#f7f9fa',
          order: 8,
          cards: [
            { id: 'm-1', title: 'اختر مسارك', value: 'استكشاف', change: '', isPositive: true, icon: 'Compass', color: '#a435f0' },
            { id: 'm-2', title: 'سجل في الدورة', value: 'تسجيل', change: '', isPositive: true, icon: 'UserPlus', color: '#a435f0' },
            { id: 'm-3', title: 'شاهد وتعلم', value: 'تعلم', change: '', isPositive: true, icon: 'PlayCircle', color: '#a435f0' },
            { id: 'm-4', title: 'احصل على الشهادة', value: 'تخرج', change: '', isPositive: true, icon: 'Award', color: '#a435f0' }
          ]
        }
      },
      {
        id: 'cta-t2',
        type: 'pricing_section',
        props: {
          title: 'قم بتعزيز مهاراتك اليوم مع منصتنا المتقدمة',
          subtitle: 'آلاف الدورات في انتظارك، سجل الآن واحصل على وصول فوري لأفضل الموارد التعليمية.',
          background_color: 'var(--t2-indigo)',
          text_color: 'var(--t2-canvas)',
          padding_top: 80,
          padding_bottom: 80,
          order: 10,
          items: [
            {
              id: 'p-t2-1',
              order: 1,
              props: {
                title: 'اشتراك شهري',
                price: '99$',
                duration: 'شهرياً',
                features: ['وصول كامل للدورات', 'شهادات معتمدة', 'دعم فني'],
                button_text: 'اشترك الآن',
                button_link: '#',
                is_popular: false
              }
            },
            {
              id: 'p-t2-2',
              order: 2,
              props: {
                title: 'اشتراك سنوي',
                price: '899$',
                duration: 'سنوياً',
                features: ['كل ميزات الشهري', 'توفير 20%', 'جلسات إرشادية'],
                button_text: 'اشترك الآن',
                button_link: '#',
                is_popular: true
              }
            }
          ]
        }
      },
      {
        id: 'footer-t2',
        type: 'footer',
        props: {
          copyright: 'جميع الحقوق محفوظة © درب ٢٠٢٦',
          logoText: 'درب | المنصة',
          bgColor: '#1c1d1f',
          textColor: '#ffffff',
          showLogo: true,
          showSocials: true,
          order: 11
        }
      }
    ]
  },
  'template_3': {
    id: 'template_3',
    name: 'قالب الأكاديمية والتعلم المعتمد',
    description: 'تصميم تعليمي جامعي مرموق ومثالي لعرض المسارات والبرامج التدريبية المتقدمة بتناسق لوني مميز.',
    status: 'published',
    version: '1.0',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'nav-t3',
        type: 'navbar',
        props: {
          title: 'درب | الأكاديمية',
          showSearch: true,
          showProfile: true,
          bgColor: '#ffffff',
          borderColor: '#e2e8f0',
          isLandingPage: true,
          order: 1
        }
      },
      {
        id: 'hero-t3',
        type: 'hero_section',
        props: {
          title: 'تعليم أكاديمي معتمد من أقوى المؤسسات التعليمية',
          subtitle: 'طوّر مهاراتك اليوم وحقق أهدافك المهنية مع برامج ودورات مصممة بأعلى المعايير الأكاديمية.',
          show_button: true,
          button_text: 'تصفح البرامج والشهادات',
          button_link: '#',
          background_color: '#0f172a',
          text_color: '#cbd5e1',
          title_color: '#ffffff',
          button_color: '#10b981',
          button_text_color: '#ffffff',
          font_size: 42,
          font_weight: 700,
          padding_top: 80,
          padding_bottom: 80,
          align: 'right',
          slider_speed: 4,
          show_arrows: true,
          show_card_overlay: false,
          items: [
            {
              order: 1,
              props: {
                title: 'ابدأ رحلة التعلم المعتمد والمهني اليوم',
                subtitle: 'ادرس مسارات تكنولوجية وتقنية من منزلك، واحصل على شهادات معتمدة تدعم تقدمك الوظيفي والعملي.',
                button_text: 'تصفح الدورات',
                button_link: '#',
                bg_image: '',
                background_color: '#0f172a',
                button_color: '#10b981',
                button_text_color: '#ffffff',
                title_color: '#ffffff',
                text_color: '#cbd5e1',
                align: 'right',
                show_card_overlay: false,
                side_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop',
                side_image_position: 'left',
                side_image_shape: 'leaf',
                side_image_width: 380,
                side_image_height: 380,
                side_image_fit: 'cover'
              }
            },
            {
              order: 2,
              props: {
                title: 'اكتسب مهارات عملية من قادة الصناعة',
                subtitle: 'شروحات تطبيقية وورش تفاعلية تصاحبك خطوة بخطوة للتميز والتمكن من مجالك المهني الجديد.',
                button_text: 'ابدأ الآن',
                button_link: '#',
                bg_image: '',
                background_color: '#1e293b',
                button_color: '#6366f1',
                button_text_color: '#ffffff',
                title_color: '#ffffff',
                text_color: '#cbd5e1',
                align: 'right',
                show_card_overlay: false,
                side_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop',
                side_image_position: 'left',
                side_image_shape: 'rounded',
                side_image_width: 380,
                side_image_height: 380,
                side_image_fit: 'cover'
              }
            }
          ],
          order: 2
        }
      },
      {
        id: 'kpis-t3',
        type: 'kpi-cards',
        props: {
          gridCols: '3',
          backgroundColor: '#ffffff',
          order: 3,
          cards: [
            { id: 'kpi-t3-1', title: 'شريك تعليمي ومهني معتمد', value: '+160', change: '', isPositive: true, icon: 'Award', color: '#6366f1' },
            { id: 'kpi-t3-2', title: 'متعلم نشط حول العالم', value: '45M+', change: '', isPositive: true, icon: 'Users', color: '#10b981' },
            { id: 'kpi-t3-3', title: 'مسار تعليمي متكامل للتخصص', value: '3,000+', change: '', isPositive: true, icon: 'BookOpen', color: '#6366f1' }
          ]
        }
      },
      {
        id: 'tabs-t3',
        type: 'tabs',
        props: {
          title: 'استكشف التخصصات والمهارات الأكثر رواجاً',
          subtitle: 'اختر المجال المهني الذي ترغب في إتقانه والبدء ببناء بورتفوليو متميز فيه',
          backgroundColor: '#f8fafc',
          activeTabColor: '#10b981',
          order: 4,
          tabs: [
            {
              id: 'tab-1',
              title: 'علوم الحاسوب والبرمجة',
              content: 'تعلّم لغات البرمجة الأكثر انتشاراً مثل Python و JavaScript، وتخصص في تطوير الويب أو بناء الأنظمة.'
            },
            {
              id: 'tab-2',
              title: 'الذكاء الاصطناعي وهندسة البيانات',
              content: 'مسارات متقدمة لتعلّم الآلة وعلم البيانات وبناء نماذج الذكاء الاصطناعي التوليدي والتحليلات الإحصائية.'
            },
            {
              id: 'tab-3',
              title: 'إدارة الأعمال والقيادة المعتمدة',
              content: 'برامج إدارة المشاريع المهنية، التمويل، والاستشارات الإدارية المعتمدة من أكبر كليات الأعمال الدولية.'
            }
          ]
        }
      },
      {
        id: 'courses-t3',
        type: 'course-cards',
        props: {
          title: 'البرامج والدورات الأكاديمية والمهنية',
          gridCols: '3',
          showPrice: true,
          showStudentsCount: true,
          buttonBg: '#10b981',
          background_color: '#ffffff',
          padding_top: 60,
          padding_bottom: 60,
          order: 5,
          courses: [
            { id: 'c1', title: 'الذكاء الاصطناعي التطبيقي لمطوري الويب', instructor: 'د. يوسف سلامة', price: '٥٠٠ ريال', students: '١٢٠ طالب', duration: '٢٤ ساعة', image: '', description: 'كيفية دمج نماذج الذكاء الاصطناعي وبناء تطبيقات تفاعلية متطورة.' },
            { id: 'c2', title: 'القيادة التنفيذية وإدارة التغيير في المؤسسات', instructor: 'د. ريما العتيبي', price: '٤٥٠ ريال', students: '١٨٠ طالب', duration: '١٦ ساعة', image: '', description: 'إستراتيجيات قيادة فرق العمل وإدارة الأزمات في بيئة الأعمال المعاصرة.' }
          ]
        }
      },
      {
        id: 'testimonials-t3',
        type: 'testimonials_section',
        props: {
          title: 'قصص نجاح من قلب مجتمعنا التعليمي',
          subtitle: 'كيف غيرت شهاداتنا ومساراتنا المعتمدة المستقبل المهني لمتعلمينا',
          background_color: '#f8fafc',
          text_color: '#0f172a',
          padding_top: 60,
          padding_bottom: 60,
          avatar_size: 40,
          avatar_shape: 'circle',
          items: [
            { id: 't-t3-1', order: 1, props: { quote: 'الدراسة هنا كانت تجربة فريدة، المناهج مصممة بعناية فائقة وتطابق تماماً ما يبحث عنه أصحاب العمل لتوظيفنا.', author: 'المهندس عبدالله الفيصل', role: 'مهندس برمجيات أول', rating: 5, avatar: '' } }
          ],
          order: 6
        }
      },
      {
        id: 'gallery-t3',
        type: 'gallery_section',
        props: {
          title: 'شركاؤنا من الأكاديميات والجامعات العريقة',
          subtitle: 'نعمل يداً بيد مع أفضل الجامعات والشركات لتوفير تعليم متميز وقابل للتطبيق المباشر.',
          background_color: '#ffffff',
          grid_cols: 3,
          image_aspect: 'video',
          image_shape: 'rounded',
          padding_top: 60,
          padding_bottom: 60,
          items: [
            { id: 'g-t3-1', order: 1, props: { image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f', caption: 'الحرم الجامعي والتعاون العلمي', image_link: '' } },
            { id: 'g-t3-2', order: 2, props: { image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', caption: 'مختبرات الحاسوب والأبحاث التكنولوجية', image_link: '' } },
            { id: 'g-t3-3', order: 3, props: { image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846', caption: 'قاعات المحاضرات التفاعلية والورش المهنية', image_link: '' } }
          ],
          order: 7
        }
      },
      {
        id: 'faq-t3',
        type: 'faq_section',
        props: {
          title: 'الأسئلة الشائعة حول الشهادات والقبول بالمنصة',
          subtitle: 'إجابات وافية لمساعدتك على اتخاذ القرار الاستثماري الصحيح بمستقبلك',
          background_color: '#f8fafc',
          text_color: '#0f172a',
          padding_top: 60,
          padding_bottom: 60,
          items: [
            { id: 'faq-t3-1', order: 1, props: { question: 'هل الشهادات مقبولة مهنياً؟', answer: 'نعم، تصدر الشهادات بالتعاون مع جهات وجامعات معترف بها وتضيف قيمة حقيقية لسيرتك الذاتية.' } },
            { id: 'faq-t3-2', order: 2, props: { question: 'ما هو نظام الدراسة المتبع بالدورة؟', answer: 'دراسة مرنة بالكامل عبر الإنترنت مع إمكانية حضور محاضرات مباشرة مسجلة.' } }
          ],
          order: 8
        }
      },
      {
        id: 'features-t3',
        type: 'features_section',
        props: {
          title: 'لماذا تختار برامجنا الأكاديمية؟',
          subtitle: 'صممنا لك بيئة تعليمية متكاملة لضمان أقصى استفادة وتجربة تفاعلية متميزة',
          background_color: '#ffffff',
          text_color: '#0f172a',
          grid_cols: 3,
          padding_top: 60,
          padding_bottom: 60,
          items: [
            { id: 'feat-t3-1', order: 1, props: { icon: 'Award', icon_color: '#10b981', title: 'اعتماد دولي', description: 'شهادات مهنية معتمدة من أقوى الهيئات العالمية تزيد من فرص قبولك الوظيفي.' } },
            { id: 'feat-t3-2', order: 2, props: { icon: 'BookOpen', icon_color: '#10b981', title: 'محتوى حصري ومحدث', description: 'مناهج دراسية متطورة باستمرار لتواكب أحدث التغيرات في سوق العمل التكنولوجي.' } },
            { id: 'feat-t3-3', order: 3, props: { icon: 'Users', icon_color: '#10b981', title: 'شبكة مهنية وخريجين', description: 'انضم لمجتمع واسع من الخبراء والمختصين وتبادل الخبرات معهم بشكل دوري.' } }
          ],
          order: 9
        }
      },
      {
        id: 'categories-t3',
        type: 'categories_section',
        props: {
          title: 'استكشف الكليات والأقسام الدراسية',
          subtitle: 'اختر الكلية التي تود الانضمام إليها وتصفح كافة المسارات والبرامج المتعلقة بها',
          background_color: '#f8fafc',
          text_color: '#0f172a',
          grid_cols: 3,
          padding_top: 60,
          padding_bottom: 60,
          items: [
            { id: 'cat-t3-1', order: 1, props: { name: 'كلية الهندسة وعلوم الحاسب', icon: 'Cpu', count: '12 برنامج', description: 'هندسة البرمجيات، الأمن السيبراني، وشبكات الحاسب.' } },
            { id: 'cat-t3-2', order: 2, props: { name: 'كلية إدارة الأعمال والريادة', icon: 'Briefcase', count: '8 برامج', description: 'إدارة الابتكار، التمويل، والإدارة التنفيذية المتقدمة.' } },
            { id: 'cat-t3-3', order: 3, props: { name: 'كلية التصميم والفنون الرقمية', icon: 'PenTool', count: '6 برامج', description: 'تصميم تجربة المستخدم، الرسوم المتحركة، والإنتاج البصري.' } }
          ],
          order: 10
        }
      },
      {
        id: 'footer-t3',
        type: 'footer',
        props: {
          copyright: 'جميع الحقوق محفوظة © درب ٢٠٢٦',
          logoText: 'درب | الأكاديمية',
          bgColor: '#0f172a',
          textColor: '#ffffff',
          showLogo: true,
          showSocials: true,
          order: 11
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

