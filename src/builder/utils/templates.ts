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
          background_color: '#F3F8FC',
          text_color: '#4b5563',
          title_color: '#0B2540',
          button_color: '#FF7A5C',
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
                background_color: '#F3F8FC',
                button_color: '#0B2540',
                button_text_color: '#ffffff',
                title_color: '#0B2540',
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
                background_color: '#E6F1FA',
                button_color: '#FF7A5C',
                button_text_color: '#ffffff',
                title_color: '#0B2540',
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
            { id: 'feat-t2-1', order: 1, props: { icon: 'PlayCircle', icon_color: '#2FA8E0', title: 'دروس مرنة وعالية الجودة', description: 'شاهد دروس الفيديو المسجلة بدقة عالية على أي جهاز في أي وقت.' } },
            { id: 'feat-t2-2', order: 2, props: { icon: 'Users', icon_color: '#2FA8E0', title: 'تعلم من خبراء الصناعة', description: 'تفاعل مع مدربين ذوي خبرة وتلقى إجابات عن كل أسئلتك مباشرة.' } },
            { id: 'feat-t2-3', order: 3, props: { icon: 'Award', icon_color: '#2FA8E0', title: 'شهادات إتمام لمسيرتك', description: 'عزز سيرتك الذاتية بشهادات معتمدة عند إتمامك لأي مسار تدريبي.' } }
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
          buttonBg: '#2FA8E0',
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
            { id: 'm-1', title: 'اختر مسارك', value: 'استكشاف', change: '', isPositive: true, icon: 'Compass', color: '#2FA8E0' },
            { id: 'm-2', title: 'سجل في الدورة', value: 'تسجيل', change: '', isPositive: true, icon: 'UserPlus', color: '#2FA8E0' },
            { id: 'm-3', title: 'شاهد وتعلم', value: 'تعلم', change: '', isPositive: true, icon: 'PlayCircle', color: '#2FA8E0' },
            { id: 'm-4', title: 'احصل على الشهادة', value: 'تخرج', change: '', isPositive: true, icon: 'Award', color: '#2FA8E0' }
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
          bgColor: '#0B2540',
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
    description: 'تصميم تعليمي أكاديمي فائق الفخامة ومبهر مخصص للأكاديميات والمؤسسات التعليمية الرائدة باللغة العربية.',
    status: 'published',
    version: '2.0',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'nav-t3',
        type: 'navbar',
        props: {
          title: 'أكاديمية درب | التعلم المعتمد',
          showSearch: true,
          showProfile: true,
          bgColor: '#0f172a',
          borderColor: '#1e293b',
          isLandingPage: true,
          order: 1
        }
      },
      {
        id: 'hero-t3',
        type: 'hero_section',
        props: {
          title: 'رحلتك الأكاديمية نحو التميّز والاحتراف مع شهادات معتمدة دولياً',
          subtitle: 'ادرس أحدث العلوم والمسارات المتقدمة تحت إشراف نخبة من كبار الأكاديميين والخبراء مع تطبيقات عملية مباشرة.',
          show_button: true,
          button_text: 'استكشف البرامج والدورات',
          button_link: '#courses-t3',
          background_color: '#0f172a',
          text_color: '#cbd5e1',
          title_color: '#ffffff',
          button_color: '#10b981',
          button_text_color: '#ffffff',
          font_size: 44,
          font_weight: 800,
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
                title: 'تعلّم البرمجة والذكاء الاصطناعي وتصنيف البيانات بأعلى المعايير',
                subtitle: 'مسارات متكاملة تأخذك من الصفر إلى الجاهزية التامة لسوق العمل التكنولوجي الدولي.',
                button_text: 'تصفح مسارات التكنولوجيا',
                button_link: '#courses-t3',
                bg_image: '',
                background_color: '#0f172a',
                button_color: '#10b981',
                button_text_color: '#ffffff',
                title_color: '#ffffff',
                text_color: '#94a3b8',
                align: 'right',
                show_card_overlay: false,
                side_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
                side_image_position: 'left',
                side_image_shape: 'rounded',
                side_image_width: 440,
                side_image_height: 380,
                side_image_fit: 'cover'
              }
            },
            {
              order: 2,
              props: {
                title: 'احصل على شهادة أكاديمية معتمدة تدعم سيرتك الذاتية',
                subtitle: 'شهاداتنا موثقة ومقبولة لدى كبرى الشركات والمؤسسات المحلية والعالمية.',
                button_text: 'الانضمام إلى دفعة اليوم',
                button_link: '#pricing-t3',
                bg_image: '',
                background_color: '#1e1b4b',
                button_color: '#6366f1',
                button_text_color: '#ffffff',
                title_color: '#ffffff',
                text_color: '#c7d2fe',
                align: 'right',
                show_card_overlay: false,
                side_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
                side_image_position: 'left',
                side_image_shape: 'rounded',
                side_image_width: 440,
                side_image_height: 380,
                side_image_fit: 'cover'
              }
            },
            {
              order: 3,
              props: {
                title: 'تطبيقات عملية ووررش عمل مباشرة ومتابعة شخصية',
                subtitle: 'لا تكتفِ بالنظريات! قم ببناء مشاريع حقيقية تصقل خبرتك العملية مع توجيه دائم من المحاضرين.',
                button_text: 'تعرف على نظام الدراسة',
                button_link: '#features-t3',
                bg_image: '',
                background_color: '#064e3b',
                button_color: '#34d399',
                button_text_color: '#064e3b',
                title_color: '#ffffff',
                text_color: '#a7f3d0',
                align: 'right',
                show_card_overlay: false,
                side_image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop',
                side_image_position: 'left',
                side_image_shape: 'rounded',
                side_image_width: 440,
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
          gridCols: '4',
          backgroundColor: '#ffffff',
          order: 3,
          cards: [
            { id: 'kpi-t3-1', title: 'خريج متميز في مختلف القطاعات', value: '+48,000', change: 'نمو مستمر', isPositive: true, icon: 'Users', color: '#10b981' },
            { id: 'kpi-t3-2', title: 'برنامج ومسار أكاديمي معتمد', value: '+350', change: 'محدثة دائماً', isPositive: true, icon: 'BookOpen', color: '#6366f1' },
            { id: 'kpi-t3-3', title: 'أستاذ خبير ومحاضر دولي', value: '+120', change: 'خبراء صناعة', isPositive: true, icon: 'Award', color: '#0284c7' },
            { id: 'kpi-t3-4', title: 'نسبة التوظيف والترقي الوظيفي', value: '94.8%', change: 'نتائج مثبتة', isPositive: true, icon: 'TrendingUp', color: '#f59e0b' }
          ]
        }
      },
      {
        id: 'announcement-t3',
        type: 'hero_section',
        props: {
          title: '⚡ خصم خاص 40% بمناسبة بدء التسجيل للفصل الدراسي الجديد',
          subtitle: 'احجز مقعدك الآن في أحد مساراتنا الاحترافية المعتمدة واحصل على وصول كاملاً للمكتبة الرقمية والمشاريع العلمية.',
          show_button: true,
          button_text: 'سجّل واضمن خصمك الآن',
          button_link: '#pricing-t3',
          background_color: '#0284c7',
          text_color: '#e0f2fe',
          title_color: '#ffffff',
          button_color: '#ffffff',
          button_text_color: '#0369a1',
          font_size: 28,
          font_weight: 800,
          padding_top: 40,
          padding_bottom: 40,
          align: 'center',
          order: 4
        }
      },
      {
        id: 'features-t3',
        type: 'features_section',
        props: {
          title: 'لماذا تعتبر أكاديميتنا الخيار الأول للمتعلمين؟',
          subtitle: 'صممنا بيئة تعليمية ذكية ومتكاملة لتزويدك بالخبرة العملية الحقيقية والتفوق المهني',
          background_color: '#f8fafc',
          text_color: '#0f172a',
          grid_cols: 3,
          padding_top: 70,
          padding_bottom: 70,
          order: 5,
          items: [
            { id: 'feat-t3-1', order: 1, props: { icon: 'Award', icon_color: '#10b981', title: 'اعتمادات ومؤهلات دولية', description: 'شهادات موثقة تزيد من قوة سيرتك الذاتية وتفتح لك فرص العمل عالمياً.' } },
            { id: 'feat-t3-2', order: 2, props: { icon: 'BookOpen', icon_color: '#6366f1', title: 'مناهج تفاعلية متجددة', description: 'محتوى متطور باستمرار يواكب أحدث المتطلبات والتغيرات السريعة في سوق العمل.' } },
            { id: 'feat-t3-3', order: 3, props: { icon: 'Users', icon_color: '#0284c7', title: 'إرشاد ومتابعة فردية', description: 'جلسات توجيه ومراجعات دورية لكافة المشاريع والواجبات من الأساتذة مباشرة.' } },
            { id: 'feat-t3-4', order: 4, props: { icon: 'CheckCircle', icon_color: '#10b981', title: 'تطبيقات ومشاريع حقيقية', description: 'ابنِ بورتفوليو احترافي يحتوي على مشاريع فعلية تشهد بمهارتك وقدراتك.' } },
            { id: 'feat-t3-5', order: 5, props: { icon: 'Clock', icon_color: '#f59e0b', title: 'مرونة كاملة في التعلم', description: 'تعلم في الوقت والسرعة التي تناسب جدول حياتك مع إمكانية الوصول مدى الحياة.' } },
            { id: 'feat-t3-6', order: 6, props: { icon: 'MessageSquare', icon_color: '#ec4899', title: 'مجتمع خريجين نشط', description: 'شبكة تواصل مع آلاف المطورين والمتخصصين لتبادل الفرص والخبرات.' } }
          ]
        }
      },
      {
        id: 'categories-t3',
        type: 'categories_section',
        props: {
          title: 'الأقسام والكليات الأكاديمية المتخصصة',
          subtitle: 'تصفح البرامج والمسارات الموزعة حسب التخصص المهني والدراسي',
          background_color: '#ffffff',
          text_color: '#0f172a',
          grid_cols: 3,
          padding_top: 70,
          padding_bottom: 70,
          order: 6,
          items: [
            { id: 'cat-t3-1', order: 1, props: { name: 'كلية الهندسة وعلوم الحاسب', icon: 'Cpu', count: '14 برنامج معتمد', description: 'هندسة البرمجيات، الحوسبة السحابية، والأنظمة الموزعة.' } },
            { id: 'cat-t3-2', order: 2, props: { name: 'كلية الذكاء الاصطناعي والبيانات', icon: 'Sparkles', count: '10 برامج متخصصة', description: 'تعلم الآلة، معالجة اللغات الطبيعية، والتحليل الإحصائي.' } },
            { id: 'cat-t3-3', order: 3, props: { name: 'كلية الأمن السيبراني والحماية', icon: 'Shield', count: '8 برامج مكثفة', description: 'اختبار الاختراق، الأمن الدفاعي، وإدارة المخاطر الرقمية.' } },
            { id: 'cat-t3-4', order: 4, props: { name: 'كلية إدارة الأعمال والريادة', icon: 'Briefcase', count: '12 برنامج تنفيذي', description: 'إدارة المشاريع الابتكارية، التمويل، والإستراتيجية.' } },
            { id: 'cat-t3-5', order: 5, props: { name: 'كلية التصميم والتجربة الرقمية', icon: 'PenTool', count: '9 برامج احترافية', description: 'تصميم تجربة المستخدم UI/UX، الهوية البصرية، والغرافيك.' } },
            { id: 'cat-t3-6', order: 6, props: { name: 'كلية التسويق والنمو الرقمي', icon: 'TrendingUp', count: '7 برامج عملية', description: 'تسويق المحرك، الحملات الإعلانية، وتحليلات البيع.' } }
          ]
        }
      },
      {
        id: 'tabs-t3',
        type: 'tabs',
        props: {
          title: 'استكشف المسارات التعليمية المعتمدة',
          subtitle: 'مسارات محددة الأهداف تبدأ معك من الأساسيات وتأخذك حتى مرحلة الاحتراف الكامل',
          backgroundColor: '#f8fafc',
          activeTabColor: '#10b981',
          order: 7,
          tabs: [
            {
              id: 'tab-1',
              title: 'تطوير الويب المتكامل (Full-Stack)',
              content: 'تعلّم بناء تطبيقات الويب الحديثة باستخدام React و Next.js و Node.js وقواعد البيانات الحديثة مع أفضل ممارسات الأمان.'
            },
            {
              id: 'tab-2',
              title: 'هندسة الذكاء الاصطناعي (AI)',
              content: 'برنامج مكثف يشمل تعلّم Python والشبكات العصبية وبناء نماذج الذكاء الاصطناعي التوليدي وتطبيقاتها التجارية.'
            },
            {
              id: 'tab-3',
              title: 'تصميم تجربة المستخدم (UI/UX)',
              content: 'منهجية شاملة لإجراء البحوث وبناء النماذج التفاعلية باستخدام Figma وتطوير واجهات مريحة وجذابة للمستخدمين.'
            },
            {
              id: 'tab-4',
              title: 'إدارة المشاريع والتنفيذ (PMP)',
              content: 'تعلّم منهجيات Agile و Scrum وإدارة الفرق والميزانيات لضمان نجاح المشاريع وإنجازها على أعلى مستوى.'
            }
          ]
        }
      },
      {
        id: 'courses-t3',
        type: 'course-cards',
        props: {
          title: 'الدورات التدريبية المتاحة للتسجيل المباشر',
          subtitle: 'اختر الدورة التي تناسب اهتماماتك وابدأ التعلم فوراً مع نخبة من الأساتذة المميزين',
          gridCols: '3',
          showPrice: true,
          showStudentsCount: true,
          buttonBg: '#10b981',
          background_color: '#ffffff',
          padding_top: 70,
          padding_bottom: 70,
          order: 8,
          courses: [
            { id: 'c1', title: 'الاحتراف في تطوير الويب باستخدام Next.js & React', instructor: 'د. يوسف سلامة', price: '٥٠٠ ريال', students: '١,٤٥٠ طالب', duration: '٣٦ ساعة', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop', description: 'دورة شاملة لبناء موقع ديناميكي وسريع مع ربطه بقواعد البيانات والواجهات البرمجية.' },
            { id: 'c2', title: 'أساسيات الذكاء الاصطناعي وبناء النماذج التوليدية', instructor: 'د. ريما العتيبي', price: '٦٥٠ ريال', students: '٩٨٠ طالب', duration: '٤٢ ساعة', image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop', description: 'تعلم كيفية تدريب النماذج البرمجية واستخدام خوارزميات التعلم العميق في بيئة عمل واقعية.' },
            { id: 'c3', title: 'تصميم واجهات وتجربة المستخدم (UI/UX) المتقدم', instructor: 'أ. خالد الإبراهيم', price: '٤٥٠ ريال', students: '٢,١٠٠ طالب', duration: '٢٨ ساعة', image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop', description: 'إتقان أدوات Figma وحلول Wireframing والبحوث الميدانية لتحسين تجربة استخدام التطبيقات.' },
            { id: 'c4', title: 'الأمن السيبراني وااختبار الاختراق الأخلاقي', instructor: 'مهندس عمر الهاشمي', price: '٧٠٠ ريال', students: '٨٥٠ طالب', duration: '٤٨ ساعة', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop', description: 'طرق حماية الشبكات والأنظمة واكتشاف الثغرات وتأمين البنية التحتية للمؤسسات.' },
            { id: 'c5', title: 'إدارة المشاريع الحديثة وفق منهجية Agile & Scrum', instructor: 'د. سارة المنصور', price: '٤٠٠ ريال', students: '١,٧٥٠ طالب', duration: '٢٠ ساعة', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop', description: 'إدارة فرق العمل وتوزيع المهام بكفاءة لضمان تسليم المشاريع في مواعيدها وبأعلى جودة.' },
            { id: 'c6', title: 'التسويق الرقمي واستراتيجيات النمو القياسي', instructor: 'أ. طارق الشمري', price: '٣٥٠ ريال', students: '٣,٢٠٠ طالب', duration: '٢٢ ساعة', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop', description: 'إدارة الحملات المدفوعة وتحسين محركات البحث SEO وتحليل سلوك المستهلك الرقمي.' }
          ]
        }
      },
      {
        id: 'gallery-t3',
        type: 'gallery_section',
        props: {
          title: 'معرض البيئة التعليمية والشركاء الأكاديميين',
          subtitle: 'نعمل بالشراكة مع أرقى الجامعات والشركات العالمية لتوفير أفضل الإمكانيات لطلابنا',
          background_color: '#f8fafc',
          grid_cols: 3,
          image_aspect: 'video',
          image_shape: 'rounded',
          padding_top: 70,
          padding_bottom: 70,
          order: 9,
          items: [
            { id: 'g-t3-1', order: 1, props: { image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&auto=format&fit=crop', caption: 'الحرم الأكاديمي والتعاون العلمي الدولي', image_link: '#' } },
            { id: 'g-t3-2', order: 2, props: { image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&auto=format&fit=crop', caption: 'مختبرات الأبحاث والحوسبة المتقدمة', image_link: '#' } },
            { id: 'g-t3-3', order: 3, props: { image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=700&auto=format&fit=crop', caption: 'ورش العمل المباشرة ولقاءات الخبراء والطلاب', image_link: '#' } }
          ]
        }
      },
      {
        id: 'testimonials-t3',
        type: 'testimonials_section',
        props: {
          title: 'قصص نجاح وآراء خريجي الأكاديمية',
          subtitle: 'اكتشف كيف ساهمت دوراتنا وشهاداتنا في تغيير المستقبل المهني لمتعلمينا',
          background_color: '#ffffff',
          text_color: '#0f172a',
          padding_top: 70,
          padding_bottom: 70,
          avatar_size: 50,
          avatar_shape: 'circle',
          order: 10,
          items: [
            { id: 't-t3-1', order: 1, props: { quote: 'الدراسة في هذه الأكاديمية كانت المحطة الأهم في حياتي المهنية. حصلت على وظيفة مطور برمجيات أول بعد شهر واحد فقط من تخرجي واستلام الشهادة.', author: 'المهندس عبدالله الفيصل', role: 'مطور برمجيات أول في شركة تقنية', rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' } },
            { id: 't-t3-2', order: 2, props: { quote: 'المناهج مصممة بدقة عالية والشرح عملي للغاية. التطبيقات اليومية والمتابعة مع الأساتذة صنعت الفارق الحقيقي في مستواي.', author: 'أ. نورة الغامدي', role: 'مصممة تجربة مستخدم (UI/UX Lead)', rating: 5, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop' } },
            { id: 't-t3-3', order: 3, props: { quote: 'دورة الذكاء الاصطناعي فتحت لي آفاقاً واسعة في تحليلات البيانات وإدارة المشاريع التكنولوجية. أنصح الجميع بالانضمام بدون تردد.', author: 'د. فيصل السبيعي', role: 'محلل بيانات أول', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' } }
          ]
        }
      },
      {
        id: 'pricing-t3',
        type: 'pricing_section',
        props: {
          title: 'خطط العضوية والاشتراك الأكاديمي',
          subtitle: 'اختر الخطة المناسبة لاحتياجاتك واستفد من الوصول الشامل والشهادات المعتمدة',
          background_color: '#f8fafc',
          text_color: '#0f172a',
          padding_top: 70,
          padding_bottom: 70,
          order: 11,
          items: [
            { id: 'pr-1', order: 1, props: { title: 'الباقة الأساسية', price: '٢٩٩ ريال', period: 'شهرياً', description: 'مثالية للمتعلمين الجدد الذين يودون استكشاف دورة واحدة شهرياً.', features: 'وصول لدورة واحدة شهرياً\nمشاريع تطبيقية أساسية\nشهادة إتمام عالمية\nدعم عبر المنتدى', button_text: 'اشترك الآن', button_link: '#', highlighted: false } },
            { id: 'pr-2', order: 2, props: { title: 'الباقة الاحترافية (الأكثر طلباً)', price: '٦٩٩ ريال', period: 'سنوياً (توفير 30%)', description: 'الخيار الشامل للوصول لكافة البرامج والدورات مع المتابعة الفردية.', features: 'وصول غير محدود لجميع الدورات\nجلسات توجيه مباشرة مع الأساتذة\nشهادات أكاديمية معتمدة\nمراجعة السيرة الذاتية والبورتفوليو\nدعم مجتمعي وأولوية للإجابات', button_text: 'انضم للباقة الاحترافية', button_link: '#', highlighted: true } },
            { id: 'pr-3', order: 3, props: { title: 'باقة المؤسسات والفرق', price: '١,٤٩٩ ريال', period: 'سنوياً', description: 'مخصصة للشركات والجهات التي ترغب برفع كفاءة موظفيها.', features: 'حسابات متعددة لفريق العمل\nتقارير أداء ومتابعة إنجاز\nمسارات تعليمية مخصصة للشركة\nشهادات معتمدة للموظفين\nمدير حساب مخصص', button_text: 'تواصل معنا', button_link: '#', highlighted: false } }
          ]
        }
      },
      {
        id: 'faq-t3',
        type: 'faq_section',
        props: {
          title: 'الأسئلة الشائعة والاستفسارات الأكاديمية',
          subtitle: 'إجابات شاملة لكافة الاستفسارات المتعلقة بالشهادات والقبول وطريقة التعلم',
          background_color: '#ffffff',
          text_color: '#0f172a',
          padding_top: 70,
          padding_bottom: 70,
          order: 12,
          items: [
            { id: 'faq-t3-1', order: 1, props: { question: 'هل الشهادات الصادرة من الأكاديمية معتمدة رسمياً؟', answer: 'نعم، تصدر جميع شهاداتنا بالتعاون مع جهات وهيئات تعليمية معتمدة وموثوقة، ويمكن للشركات والجهات التحقق من صحة الشهادة عبر الرمز المباشر (QR Code).' } },
            { id: 'faq-t3-2', order: 2, props: { question: 'كيف يتم تقديم المناهج والدورات التدريبية؟', answer: 'تتميز دراستنا بالمرونة التامة، حيث تتضمن دراسة مسجلة بجودة عالية ومناهج تفاعلية، بالإضافة إلى جلسات ومحاضرات مباشرة أسبوعية مع المحاضرين للإجابة على التساؤلات.' } },
            { id: 'faq-t3-3', order: 3, props: { question: 'هل يمكنني التواصل مع الأساتذة والمحاضرين؟', answer: 'بالتأكيد! تتيح المنصة نظام التواصل المباشر ورسائل الاستفسار، بالإضافة إلى مجتمعات النقاش الخاصة بكل دورة لمراجعة الواجبات والمشاريع.' } },
            { id: 'faq-t3-4', order: 4, props: { question: 'ما هي سياسة الاسترداد وإلغاء الاشتراك؟', answer: 'نقدم ضمان استرداد كامل للأموال خلال 14 يوماً من الاشتراك في حال لم تكن التجربة متوافقة مع توقعاتك بدون أي تعقيدات.' } }
          ]
        }
      },
      {
        id: 'footer-t3',
        type: 'footer',
        props: {
          copyright: 'جميع الحقوق محفوظة © أكاديمية درب للتعلم المعتمد ٢٠٢٦',
          logoText: 'أكاديمية درب | Darb Academy',
          bgColor: '#0f172a',
          textColor: '#ffffff',
          showLogo: true,
          showSocials: true,
          order: 13
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

