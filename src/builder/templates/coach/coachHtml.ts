import { TemplateContent } from '../academic/academicHtml';

export const getCoachHtml = (content: TemplateContent, isEditing: boolean = false) => {
  const navbarTitle = content?.navbar?.title || (content?.navbar as any)?.name || 'Deep Knowledge';
  const navbarBg = content?.navbar?.bgColor || (content?.navbar as any)?.bg_color || '#141218';
  const navbarText = content?.navbar?.textColor || (content?.navbar as any)?.text_color || '#cfbcff';

  const heroSubtitle = content?.hero?.subtitle || 'أكاديمية النخبة';
  const heroTitle = content?.hero?.title || 'تعمق في المعرفة. <br/> تعلم من الصفوة.';
  const heroDesc = content?.hero?.description || 'مساحة حصرية مصممة للمفكرين والقادة. استكشف مناهج متقدمة وتواصل مع خبراء عالميين في بيئة دراسية مصممة للتركيز العميق والتميز الأكاديمي.';
  const heroBtnText = content?.hero?.buttonText || (content?.hero as any)?.button_text || 'ابدأ رحلتك';
  const heroBtnLink = content?.hero?.buttonLink || (content?.hero as any)?.button_link || '#';
  const heroBg = content?.hero?.backgroundColor || (content?.hero as any)?.background_color || (content?.hero as any)?.bg_color || '#141218';
  const heroTextColor = content?.hero?.textColor || (content?.hero as any)?.text_color || '#e6e0e9';

  const aboutTitle = content?.about?.title || 'المرشدون الخبراء';
  const aboutSubtitle = content?.about?.subtitle || 'نخبة من الأكاديميين والباحثين يرافقونك في رحلتك المعرفية.';

  const featuresItems = content?.features?.items || [
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
  ];

  const pricingTitle = content?.pricing?.title || 'سلسلة الماستركلاس';
  const pricingSubtitle = content?.pricing?.subtitle || 'محاضرات مكثفة مسجلة بأعلى جودة سينمائية.';
  const pricingItems = content?.pricing?.items || [
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
  ];

  const faqTitle = content?.faq?.title || 'مسارات المناهج المتقدمة';
  const faqItems = content?.faq?.items || [
    { question: 'الأسس المعرفية', answer: 'المستوى الأول' },
    { question: 'المنطق التحليلي', answer: 'التفكير النقدي المتقدم' },
    { question: 'فلسفة العلوم', answer: 'الابستيمولوجيا التطبيقية' }
  ];

  const contactTitle = content?.contact?.title || 'Deep Knowledge';
  const contactDesc = content?.contact?.description || 'أكاديمية النخبة للتعليم العالي المستقل. نبني قادة الفكر للمستقبل من خلال مناهج صارمة وعميقة.';

  const footerText = content?.footer?.text || '© 2024 Deep Knowledge Academy. All rights reserved.';

  const videoTag = (content?.about as any)?.videoTag || 'شاهد وتعلّم';
  const videoTitle = (content?.about as any)?.videoTitle || 'تعرف على فلسفتنا التعليمية في ٣ دقائق';
  const videoDesc = (content?.about as any)?.videoDesc || 'نقدم لك جولة سريعة داخل منصتنا التعليمية. نوضح فيها طريقة تتبع الدروس المتقدمة، والتفاعل مع المرشدين، والوصول لأوراق العمل والامتحانات الذكية.';
  const videoLink = (content?.about as any)?.videoLink || (content?.about as any)?.videoImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop';

  const newsletterTitle = (content?.footer as any)?.newsletterTitle || 'اشترك في نشرتنا البريدية المعرفية';
  const newsletterDesc = (content?.footer as any)?.newsletterDesc || 'احصل على أحدث المقالات التحليلية، والمناهج الجديدة، والماستركلاسز الحصرية مباشرة في بريدك الإلكتروني أسبوعياً.';
  const newsletterBtnText = (content?.footer as any)?.newsletterBtnText || 'اشترك الآن';

  const testimonialsTitle = (content?.pricing as any)?.testimonialsTitle || 'ماذا يقول النخبة؟';
  const testimonialsSubtitle = (content?.pricing as any)?.testimonialsSubtitle || 'تجارب حقيقية ورؤى ملهمة من طلابنا وقادتنا الذين غيروا مسارهم الأكاديمي والمهني.';
  const testimonial1Text = (content?.pricing as any)?.testimonial1Text || 'الماستركلاسز والدروس الفلسفية المعمقة أعادت صياغة طريقتي في التفكير واتخاذ القرارات الاستراتيجية. تجربة دراسية استثنائية ونخبوية حقاً.';
  const testimonial1Author = (content?.pricing as any)?.testimonial1Author || 'خالد منصور';
  const testimonial1Role = (content?.pricing as any)?.testimonial1Role || 'مستشار إداري وتطوير أعمال';
  const testimonial2Text = (content?.pricing as any)?.testimonial2Text || 'من أفضل القرارات المعرفية التي اتخذتها. منهجية التدريب والتحليل بالبيانات لا تدع مجالاً للعشوائية أو التخمين.';
  const testimonial2Author = (content?.pricing as any)?.testimonial2Author || 'سارة العلي';
  const testimonial2Role = (content?.pricing as any)?.testimonial2Role || 'رائدة أعمال تكنولوجية';
  const testimonial3Text = (content?.pricing as any)?.testimonial3Text || 'المحتوى الأكاديمي والتحليل العميق وفر لي رؤى لم أجدها في المراجع التقليدية. التوجيه الشخصي مع د. طارق كان فارقاً في مساري العلمي.';
  const testimonial3Author = (content?.pricing as any)?.testimonial3Author || 'أحمد حماد';
  const testimonial3Role = (content?.pricing as any)?.testimonial3Role || 'باحث أكاديمي في الفلسفة';

  return `<!DOCTYPE html>
<html class="light" dir="rtl" lang="ar">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>${navbarTitle} - Academy</title>
  <!-- Material Symbols -->
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
  <!-- Google Fonts for Typography Config -->
  <link href="https://fonts.googleapis.com" rel="preconnect"/>
  <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;family=Inter:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;500;700&amp;family=Cairo:wght@400;600;700;800&amp;display=swap" rel="stylesheet"/>
  <!-- Tailwind Config -->
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "outline": "#79747e",
                    "tertiary-container": "#ffd8e4",
                    "surface-container": "#f3edf7",
                    "inverse-primary": "#d0bcff",
                    "error": "#ba1a1a",
                    "tertiary-fixed-dim": "#efb8c8",
                    "on-error": "#ffffff",
                    "background": "#fbfafc",
                    "surface-container-highest": "#e6e0e9",
                    "surface": "#fbfafc",
                    "inverse-on-surface": "#f4eff4",
                    "surface-bright": "#fdf7ff",
                    "on-secondary": "#ffffff",
                    "on-primary": "#ffffff",
                    "on-secondary-fixed-variant": "#49454f",
                    "on-secondary-container": "#1d192b",
                    "surface-dim": "#ded8e1",
                    "on-error-container": "#410002",
                    "on-primary-fixed-variant": "#4f378b",
                    "on-tertiary": "#ffffff",
                    "primary-fixed-dim": "#d0bcff",
                    "secondary-fixed-dim": "#ccc2dc",
                    "surface-variant": "#e7e0ec",
                    "on-surface-variant": "#49454f",
                    "primary-fixed": "#eaddff",
                    "on-background": "#1c1b1f",
                    "outline-variant": "#cac4d0",
                    "on-primary-container": "#21005d",
                    "surface-tint": "#6750a4",
                    "secondary-container": "#e8def8",
                    "surface-container-low": "#f7f2fa",
                    "tertiary-fixed": "#ffd8e4",
                    "on-secondary-fixed": "#1d192b",
                    "on-primary-fixed": "#21005d",
                    "on-surface": "#1c1b1f",
                    "primary-container": "#eaddff",
                    "surface-container-lowest": "#ffffff",
                    "inverse-surface": "#313033",
                    "secondary": "#625b71",
                    "on-tertiary-container": "#31111d",
                    "on-tertiary-fixed-variant": "#633b48",
                    "tertiary": "#7d5260",
                    "error-container": "#ffdad6",
                    "surface-container-high": "#ece6f0",
                    "on-tertiary-fixed": "#31111d",
                    "secondary-fixed": "#e8def8",
                    "primary": "#6750a4"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "spacing": {
                    "margin-mobile": "16px",
                    "container-max": "1280px",
                    "base": "8px",
                    "margin-desktop": "48px",
                    "gutter": "24px"
            },
            "fontFamily": {
                    "body-lg": [
                            "Cairo", "Inter"
                    ],
                    "headline-md": [
                            "Cairo", "IBM Plex Sans"
                    ],
                    "display-lg": [
                            "Cairo", "IBM Plex Sans"
                    ],
                    "label-sm": [
                            "JetBrains Mono"
                    ],
                    "body-md": [
                            "Cairo", "Inter"
                    ],
                    "display-lg-mobile": [
                            "Cairo", "IBM Plex Sans"
                    ]
            },
            "fontSize": {
                    "body-lg": [
                            "18px",
                            {
                                    "lineHeight": "1.6",
                                    "fontWeight": "400"
                            }
                    ],
                    "headline-md": [
                            "24px",
                            {
                                    "lineHeight": "1.3",
                                    "fontWeight": "600"
                            }
                    ],
                    "display-lg": [
                            "48px",
                            {
                                    "lineHeight": "1.1",
                                    "fontWeight": "700"
                            }
                    ],
                    "label-sm": [
                            "12px",
                            {
                                    "lineHeight": "1.0",
                                    "letterSpacing": "0.05em",
                                    "fontWeight": "500"
                            }
                    ],
                    "body-md": [
                            "16px",
                            {
                                    "lineHeight": "1.6",
                                    "fontWeight": "400"
                            }
                    ],
                    "display-lg-mobile": [
                            "32px",
                            {
                                    "lineHeight": "1.2",
                                    "fontWeight": "700"
                            }
                    ]
            }
          },
        },
      }
  </script>
  <style>
        /* Custom glow effect in light mode */
        .gold-glow {
            text-shadow: 0 4px 12px rgba(103, 80, 164, 0.1);
        }
        .tree-line-v {
            width: 1px;
            background: linear-gradient(to bottom, #cac4d0, transparent);
        }
        .tree-line-h {
            height: 1px;
            background: #cac4d0;
        }
        ${isEditing ? `
        .section-hover:hover {
            box-shadow: 0 0 0 2px rgb(103, 80, 164) !important;
            border-radius: 4px;
        }
        ` : `
        .section-hover {
            cursor: default !important;
        }
        `}
  </style>
</head>
<body class="bg-background text-on-surface font-body-lg min-h-screen flex flex-col antialiased selection:bg-tertiary-container selection:text-on-tertiary-container">
<!-- TopAppBar -->
<header data-section="navbar" class="bg-surface border-b border-outline-variant/30 shadow-sm w-full sticky top-0 z-50 transition-all duration-300 section-hover cursor-pointer" style="background-color: ${navbarBg}; color: ${navbarText};">
<div class="flex items-center justify-between px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-24">
<div class="flex items-center gap-stack-sm hover:scale-95 transition-transform duration-200 cursor-pointer">
<span class="material-symbols-outlined text-primary text-[32px]">menu_book</span>
<span class="text-headline-md font-headline-md text-primary" style="color: ${navbarText};">${navbarTitle}</span>
</div>
<div class="flex items-center">
<button class="hover:text-primary transition-colors duration-300 opacity-80 hover:opacity-100">
<span class="material-symbols-outlined text-[32px]">account_circle</span>
</button>
</div>
</div>
</header>
<main class="flex-grow">
<!-- Hero Section -->
<section data-section="hero" class="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-margin-mobile md:px-margin-desktop section-hover cursor-pointer" style="background-color: ${heroBg}; color: ${heroTextColor};">
<!-- Atmospheric Background Element -->
<div class="absolute inset-0 z-0 opacity-20 pointer-events-none" style="background: radial-gradient(circle at 50% 50%, rgba(201, 167, 77, 0.15) 0%, transparent 60%);"></div>
<div class="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-8">
<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-tertiary/30 bg-surface-container-low mb-4">
<span class="material-symbols-outlined text-tertiary text-label-sm" style="font-variation-settings: 'FILL' 1;">stars</span>
<span class="font-label-sm text-label-sm text-tertiary uppercase tracking-widest">${heroSubtitle}</span>
</div>
<h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface font-extrabold leading-tight gold-glow">
                    ${heroTitle}
</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4">
                    ${heroDesc}
                </p>
<div class="flex gap-4 mt-8">
<button class="font-label-sm text-label-sm bg-tertiary text-on-tertiary px-8 py-4 rounded hover:bg-tertiary-container transition-colors duration-300 flex items-center gap-2">
<span>${heroBtnText}</span>
<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
<button class="font-label-sm text-label-sm border border-outline text-on-surface px-8 py-4 rounded hover:border-tertiary hover:text-tertiary transition-colors duration-300">
                        استكشف المناهج
                    </button>
</div>
</div>
</section>

<!-- Partners Section -->
<section class="py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-y border-outline-variant/20 mb-16">
  <div class="flex flex-col md:flex-row items-center justify-between gap-8 opacity-70">
    <span class="text-label-sm font-label-sm text-outline uppercase tracking-wider text-center md:text-right shrink-0">معتمدون لدى جهات رائدة عالمياً:</span>
    <div class="flex flex-wrap items-center justify-center gap-12 text-outline-variant font-bold text-headline-sm">
      <div class="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><span class="material-symbols-outlined text-[28px]">school</span> ACADEMY</div>
      <div class="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><span class="material-symbols-outlined text-[28px]">globe</span> GLOBAL</div>
      <div class="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><span class="material-symbols-outlined text-[28px]">verified</span> ISO CERTIFIED</div>
      <div class="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"><span class="material-symbols-outlined text-[28px]">terminal</span> TECH LAB</div>
    </div>
  </div>
</section>

<!-- Video Intro Section -->
<section data-section="video" id="about-video" class="py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-20 section-hover cursor-pointer">
  <div class="bg-primary-container/10 border border-primary/20 rounded-[2.5rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center">
    <div class="space-y-6">
      <span class="text-label-md font-label-md text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">${videoTag}</span>
      <h2 class="text-headline-lg font-headline-lg text-on-surface leading-tight">${videoTitle}</h2>
      <p class="text-body-lg font-body-lg text-on-surface-variant leading-relaxed">${videoDesc}</p>
      <div class="flex items-center gap-4 text-primary font-bold">
        <span class="material-symbols-outlined text-[32px] animate-bounce">play_arrow</span>
        <span>اضغط على المشغل لمشاهدة العرض التعريفي</span>
      </div>
    </div>
    <div class="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-outline-variant/30 flex items-center justify-center group cursor-pointer">
      <div class="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105" style="background-image: url('${videoLink}');"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
      <div class="relative z-10 w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
        <span class="material-symbols-outlined text-[40px] fill">play_arrow</span>
      </div>
    </div>
  </div>
</section>

<!-- Section 1: Expert Mentors -->
<section data-section="features" class="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-y border-surface-container-low relative section-hover cursor-pointer">
<div class="max-w-container-max mx-auto">
<div class="flex items-center gap-4 mb-12">
<div class="w-12 h-[1px] bg-tertiary"></div>
<h2 class="font-headline-md text-headline-md text-on-surface">${aboutTitle}</h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
  ${featuresItems.map((item, idx) => {
    const parts = item.title.split(' - ');
    const name = parts[0] || '';
    const role = parts[1] || '';
    return `
      <!-- Mentor Card -->
      <div data-section="features" data-index="${idx}" class="group relative bg-surface-container border-t border-tertiary/50 p-6 flex flex-col gap-6 transition-all duration-300 hover:bg-surface-container-highest cursor-pointer">
        <div class="w-full h-64 bg-surface-container-highest overflow-hidden relative">
          <img class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100" src="${item.icon}" alt="${name}"/>
          <div class="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-60"></div>
        </div>
        <div>
          <h3 class="font-body-lg text-body-lg font-bold text-on-surface mb-1">${name}</h3>
          <p class="font-label-sm text-label-sm text-tertiary tracking-widest mb-4">${role}</p>
          <p class="font-body-md text-body-md text-on-surface-variant line-clamp-3">
            ${item.description}
          </p>
        </div>
      </div>
    `;
  }).join('')}
</div>
</div>
</section>

<!-- Stats Section -->
<section class="py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-20 bg-primary/5 rounded-[2.5rem] border border-outline-variant/10">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-gutter">
    <div class="bg-surface border border-outline-variant/20 p-8 rounded-3xl text-center hover:translate-y-[-4px] transition-transform duration-300 shadow-sm">
      <span class="block text-display-lg font-display-lg text-primary font-black mb-2">98%</span>
      <span class="text-body-md font-body-md text-on-surface-variant font-bold">نسبة رضا الطلاب</span>
    </div>
    <div class="bg-surface border border-outline-variant/20 p-8 rounded-3xl text-center hover:translate-y-[-4px] transition-transform duration-300 shadow-sm">
      <span class="block text-display-lg font-display-lg text-primary font-black mb-2">150+</span>
      <span class="text-body-md font-body-md text-on-surface-variant font-bold">منهج دراسي متكامل</span>
    </div>
    <div class="bg-surface border border-outline-variant/20 p-8 rounded-3xl text-center hover:translate-y-[-4px] transition-transform duration-300 shadow-sm">
      <span class="block text-display-lg font-display-lg text-primary font-black mb-2">12k+</span>
      <span class="text-body-md font-body-md text-on-surface-variant font-bold">خريج متميز</span>
    </div>
    <div class="bg-surface border border-outline-variant/20 p-8 rounded-3xl text-center hover:translate-y-[-4px] transition-transform duration-300 shadow-sm">
      <span class="block text-display-lg font-display-lg text-primary font-black mb-2">24/7</span>
      <span class="text-body-md font-body-md text-on-surface-variant font-bold">دعم أكاديمي مباشر</span>
    </div>
  </div>
</section>

<!-- Section 2: Masterclass Series -->
<section data-section="pricing" id="pricing-plans" class="py-24 px-margin-mobile md:px-margin-desktop bg-background section-hover cursor-pointer">
<div class="max-w-container-max mx-auto">
<div class="flex justify-between items-end mb-12">
<div>
<h2 class="font-headline-md text-headline-md text-on-surface mb-2">${pricingTitle}</h2>
<p class="font-body-md text-body-md text-on-surface-variant">${pricingSubtitle}</p>
</div>
<button class="hidden md:flex items-center gap-2 font-label-sm text-label-sm text-tertiary hover:text-tertiary-container transition-colors">
                        عرض الكل <span class="material-symbols-outlined text-[16px]">arrow_back</span>
</button>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  ${pricingItems.map((item, idx) => {
    const duration = item.features?.[0] || '';
    const imgUrl = item.features?.[1] || '';
    return `
      <!-- Masterclass Card -->
      <div data-section="pricing" data-index="${idx}" class="relative group cursor-pointer overflow-hidden border border-outline-variant hover:border-tertiary/50 transition-colors duration-300">
        <div class="aspect-video bg-surface-container-high relative">
          <img class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" src="${imgUrl}" alt="${item.title}"/>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-16 h-16 rounded-full border border-tertiary flex items-center justify-center bg-background/50 backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
              <span class="material-symbols-outlined text-tertiary text-headline-md ml-1">play_arrow</span>
            </div>
          </div>
        </div>
        <div class="p-6 bg-surface-container-low absolute bottom-0 left-0 right-0 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div class="flex justify-between items-center mb-2">
            <span class="font-label-sm text-label-sm text-tertiary bg-tertiary/10 px-2 py-1 rounded">${item.price}</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">${duration}</span>
          </div>
          <h3 class="font-headline-md text-headline-md text-on-surface">${item.title}</h3>
        </div>
      </div>
    `;
  }).join('')}
</div>
</div>
</section>
<!-- Section 3: Curriculum Tree Diagram -->
<section data-section="faq" class="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-t border-surface-container-low section-hover cursor-pointer">
<div class="max-w-container-max mx-auto text-center mb-16">
<h2 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">${faqTitle}</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">هيكلية مصممة بعناية لتأخذك من المفاهيم الأساسية إلى التطبيقات النظرية المعقدة.</p>
</div>
<!-- CSS Flex Tree Representation -->
<div class="flex flex-col items-center w-full max-w-4xl mx-auto overflow-x-auto pb-8">
<!-- Root Node -->
<div data-section="faq" data-index="0" class="bg-surface-container border border-tertiary px-8 py-4 rounded z-10 shadow-[0_4px_20px_rgba(201,167,77,0.05)] cursor-pointer">
<span class="font-headline-md text-headline-md text-tertiary block">${faqItems[0]?.question || 'الأسس المعرفية'}</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">${faqItems[0]?.answer || 'المستوى الأول'}</span>
</div>
<div class="tree-line-v h-8"></div>
<div class="tree-line-h w-2/3 md:w-1/2"></div>
<!-- Level 2 Branches -->
<div class="flex justify-between w-2/3 md:w-1/2 relative mt-[-1px]">
<div class="tree-line-v h-8"></div>
<div class="tree-line-v h-8"></div>
</div>
<!-- Level 2 Nodes -->
<div class="flex justify-between w-full md:w-3/4 gap-4">
<div data-section="faq" data-index="1" class="flex flex-col items-center flex-1 cursor-pointer">
<div class="bg-surface-container-low border border-outline-variant px-6 py-4 rounded w-full text-center hover:border-tertiary/50 transition-colors">
<span class="font-body-lg text-body-lg text-on-surface block mb-1">${faqItems[1]?.question || 'المنطق التحليلي'}</span>
<div class="flex gap-1 justify-center mt-2">
<div class="w-2 h-2 rounded-full bg-tertiary"></div>
<div class="w-2 h-2 rounded-full bg-surface-variant"></div>
<div class="w-2 h-2 rounded-full bg-surface-variant"></div>
</div>
</div>
<div class="tree-line-v h-8"></div>
<div class="bg-surface border border-outline-variant/50 px-4 py-2 rounded text-sm text-on-surface-variant w-full text-center">${faqItems[1]?.answer || 'التفكير النقدي المتقدم'}</div>
</div>
<div data-section="faq" data-index="2" class="flex flex-col items-center flex-1 cursor-pointer">
<div class="bg-surface-container-low border border-outline-variant px-6 py-4 rounded w-full text-center hover:border-tertiary/50 transition-colors">
<span class="font-body-lg text-body-lg text-on-surface block mb-1">${faqItems[2]?.question || 'فلسفة العلوم'}</span>
<div class="flex gap-1 justify-center mt-2">
<div class="w-2 h-2 rounded-full bg-tertiary"></div>
<div class="w-2 h-2 rounded-full bg-tertiary"></div>
<div class="w-2 h-2 rounded-full bg-surface-variant"></div>
</div>
</div>
<div class="tree-line-v h-8"></div>
<div class="bg-surface border border-outline-variant/50 px-4 py-2 rounded text-sm text-on-surface-variant w-full text-center">${faqItems[2]?.answer || 'الابستيمولوجيا التطبيقية'}</div>
</div>
</div>
</div>
<!-- Testimonials Section -->
<section data-section="testimonials" id="testimonials" class="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-surface-container/50 border border-outline-variant/20 rounded-[2.5rem] mb-24 relative section-hover cursor-pointer" style="${content?.pricing?.backgroundColor ? `background-color: ${content.pricing.backgroundColor};` : ''} ${content?.pricing?.textColor ? `color: ${content.pricing.textColor};` : ''}">
<div class="text-center mb-16">
  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-tertiary/30 bg-surface-container-low mb-4">
    <span class="material-symbols-outlined text-tertiary text-label-sm" style="font-variation-settings: 'FILL' 1;">reviews</span>
    <span class="font-label-sm text-label-sm text-tertiary uppercase tracking-widest">تجارب وقصص نجاح</span>
  </div>
  <h2 class="font-headline-md text-headline-md text-on-surface">${testimonialsTitle}</h2>
  <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto mt-2">${testimonialsSubtitle}</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
  <!-- Card 1 -->
  <div data-testimonial="0" class="bg-surface-container border border-outline-variant/40 p-8 flex flex-col justify-between hover:bg-surface-container-highest transition-all duration-300">
    <p class="font-body-md text-body-md text-on-surface-variant italic mb-8">"${testimonial1Text}"</p>
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded bg-tertiary/20 flex items-center justify-center font-bold text-tertiary">
        ${testimonial1Author.slice(0, 2)}
      </div>
      <div>
        <h4 class="font-body-lg text-body-lg font-bold text-on-surface">${testimonial1Author}</h4>
        <p class="font-label-sm text-label-sm text-tertiary">${testimonial1Role}</p>
      </div>
    </div>
  </div>
  <!-- Card 2 -->
  <div data-testimonial="1" class="bg-surface-container border border-outline-variant/40 p-8 flex flex-col justify-between hover:bg-surface-container-highest transition-all duration-300">
    <p class="font-body-md text-body-md text-on-surface-variant italic mb-8">"${testimonial2Text}"</p>
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded bg-tertiary/20 flex items-center justify-center font-bold text-tertiary">
        ${testimonial2Author.slice(0, 2)}
      </div>
      <div>
        <h4 class="font-body-lg text-body-lg font-bold text-on-surface">${testimonial2Author}</h4>
        <p class="font-label-sm text-label-sm text-tertiary">${testimonial2Role}</p>
      </div>
    </div>
  </div>
  <!-- Card 3 -->
  <div data-testimonial="2" class="bg-surface-container border border-outline-variant/40 p-8 flex flex-col justify-between hover:bg-surface-container-highest transition-all duration-300">
    <p class="font-body-md text-body-md text-on-surface-variant italic mb-8">"${testimonial3Text}"</p>
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded bg-tertiary/20 flex items-center justify-center font-bold text-tertiary">
        ${testimonial3Author.slice(0, 2)}
      </div>
      <div>
        <h4 class="font-body-lg text-body-lg font-bold text-on-surface">${testimonial3Author}</h4>
        <p class="font-label-sm text-label-sm text-tertiary">${testimonial3Role}</p>
      </div>
    </div>
  </div>
</div>
</section>

<!-- Newsletter Section -->
<section data-section="footer" id="newsletter" class="py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-20 bg-surface-container border border-outline-variant/30 rounded-[2.5rem] section-hover cursor-pointer">
  <div class="max-w-3xl mx-auto text-center space-y-8">
    <span class="material-symbols-outlined text-primary text-[48px] fill">mail</span>
    <h2 class="text-headline-lg font-headline-lg text-on-surface">${newsletterTitle}</h2>
    <p class="text-body-lg font-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">${newsletterDesc}</p>
    <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <input type="email" placeholder="أدخل بريدك الإلكتروني هنا" class="flex-grow px-6 py-4 rounded-full border border-outline-variant bg-white text-on-surface outline-none focus:border-primary transition-colors text-sm" />
      <button class="bg-primary hover:bg-primary-container text-on-primary text-label-md font-label-md px-8 py-4 rounded-full shadow-md transition-colors duration-300 shrink-0">${newsletterBtnText}</button>
    </div>
  </div>
</section>

</main>
<!-- Footer -->
<footer data-section="footer" id="footer-bar" class="bg-surface-container-lowest text-outline py-12 border-t border-outline-variant full-width flat no shadows section-hover cursor-pointer">
<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop max-w-container-max mx-auto">
<div class="col-span-1 md:col-span-2 mb-8 md:mb-0">
<span class="font-headline-md text-headline-md text-tertiary block mb-4">${contactTitle}</span>
<p class="font-body-md text-body-md text-on-surface-variant max-w-sm">
                    ${contactDesc}
                </p>
</div>
<div class="col-span-1">
<h4 class="font-label-sm text-label-sm text-on-surface tracking-widest mb-4">روابط سريعة</h4>
<ul class="flex flex-col gap-3">
<li><a class="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all hover:underline decoration-1 underline-offset-4" href="#">Curriculum</a></li>
<li><a class="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all hover:underline decoration-1 underline-offset-4" href="#">Mentors</a></li>
<li><a class="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all hover:underline decoration-1 underline-offset-4" href="#">Masterclasses</a></li>
<li><a class="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all hover:underline decoration-1 underline-offset-4" href="#">Privacy</a></li>
</ul>
</div>
<div class="col-span-1 flex items-end justify-start md:justify-end mt-8 md:mt-0" data-section="footer">
<p class="font-label-sm text-label-sm text-outline">
                    ${footerText}
                </p>
</div>
</div>
</footer>
<script>
        // Post messages to parent editor on section clicks
        document.addEventListener('click', (e) => {
          const el = e.target.closest('[data-section]');
          if (el) {
            const section = el.getAttribute('data-section');
            const index = el.getAttribute('data-index');
            window.parent.postMessage({
              type: 'SELECT_SECTION',
              section: section,
              index: index ? parseInt(index, 10) : null
            }, '*');
          }
        });
</script>
</body>
</html>`;
};
