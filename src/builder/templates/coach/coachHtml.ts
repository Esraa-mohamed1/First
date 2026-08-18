import { TemplateContent } from '../academic/academicHtml';

export const getCoachHtml = (content: TemplateContent) => {
  const navbarTitle = content?.navbar?.title || 'Deep Knowledge Academy';
  const navbarBg = content?.navbar?.bgColor || '#faf9fb';
  const navbarText = content?.navbar?.textColor || '#4f378a';

  const heroSubtitle = content?.hero?.subtitle || 'أكاديمية التدريب الشخصي';
  const heroTitle = content?.hero?.title || 'تعلّم بوضوح. <br/> طوّر مهاراتك بثقة.';
  const heroDesc = content?.hero?.description || 'أكاديمية تعليمية وتدريبية متخصصة تحت إشراف الكوتش مباشرة. نقدم لك كورسات عملية ومبسطة تساعدك على بناء مهارات حقيقية والوصول لأهدافك بخطوات مدروسة.';
  const heroBtnText = content?.hero?.buttonText || 'استكشف الكورسات';
  const heroBtnLink = content?.hero?.buttonLink || '#courses';
  const heroBg = content?.hero?.backgroundColor || '#faf9fb';
  const heroTextColor = content?.hero?.textColor || '#1a1c1d';

  const aboutTitle = content?.about?.title || 'عن الكوتش';
  const aboutSubtitle = content?.about?.subtitle || 'خبرة عملية وتوجيه مستمر للوصول إلى أهدافك التعليمية.';

  const featuresItems = content?.features?.items || [
    {
      icon: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
      title: 'أساسيات التفكير التحليلي وحل المشكلات',
      description: 'كورس عملي يغطي أدوات التحليل المنطقي واتخاذ القرارات بناءً على بيانات ومعلومات دقيقة.'
    },
    {
      icon: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
      title: 'منهجية التخطيط والتنفيذ العملي',
      description: 'تعلم كيفية تحويل الأهداف الكبيرة إلى خطط عمل تنفيذية ومتابعة الإنجاز بفاعلية.'
    },
    {
      icon: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
      title: 'صياغة المحتوى وبناء الأفكار الاحترافية',
      description: 'دليل شامل لإتقان صياغة الأفكار وتوصيل الرسائل بوضوح وجاذبية للمستهدفين.'
    }
  ];

  const pricingTitle = content?.pricing?.title || 'الكورسات والدورات التدريبية';
  const pricingSubtitle = content?.pricing?.subtitle || 'دورات متخصصة ومصممة للتطبيق العملي.';
  const pricingItems = content?.pricing?.items || [
    {
      title: 'أساسيات التفكير التحليلي وحل المشكلات',
      price: 'كورس كامل',
      features: ['١٢ درس • ٦ أسابيع', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop']
    },
    {
      title: 'منهجية التخطيط والتنفيذ العملي',
      price: 'كورس متقدم',
      features: ['١٥ درس • ٨ أسابيع', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop']
    }
  ];

  const faqTitle = content?.faq?.title || 'الأسئلة الشائعة';
  const faqItems = content?.faq?.items || [
    { question: 'هل الكورسات مناسبة للمبتدئين؟', answer: 'نعم، جميع الكورسات مصممة لتبدأ معك من الأساسيات وتتدرج خطوة بخطوة حتى المستوى المتقدم.' },
    { question: 'هل توجد متابعة أو إجابة على الاستفسارات؟', answer: 'نعم، يمكنك تقديم استفساراتك والحصول على توجيه وإجابة مباشرة من الكوتش.' },
    { question: 'هل يمكنني التعلم بالسرعة التي تناسبني؟', answer: 'بالتأكيد، المحتوى متاح لك دائماً لتشاهده وتطبقه بالسرعة المناسبة لك.' }
  ];

  const contactTitle = content?.contact?.title || 'Deep Knowledge Academy';
  const contactDesc = content?.contact?.description || 'أكاديمية تعليمية وتدريبية متخصصة تحت إشراف الكوتش مباشرة لبناء مهارات عملية ملموسة.';

  const footerText = content?.footer?.text || '© 2024 Deep Knowledge Academy. جميع الحقوق محفوظة.';

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>${navbarTitle}</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&amp;family=IBM+Plex+Sans:wght@500&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "secondary-fixed-dim": "#eeb8c8",
                        "outline-variant": "#cbc4d2",
                        "tertiary-fixed-dim": "#e7c365",
                        "primary": "#4f378a",
                        "surface-container-low": "#f4f3f5",
                        "secondary-container": "#fdc6d6",
                        "primary-container": "#6750a4",
                        "on-error": "#ffffff",
                        "tertiary-fixed": "#ffdf93",
                        "on-primary-fixed-variant": "#4f378a",
                        "on-surface-variant": "#494551",
                        "surface": "#faf9fb",
                        "outline": "#7a7582",
                        "surface-container-highest": "#e3e2e4",
                        "on-tertiary": "#ffffff",
                        "on-tertiary-fixed": "#241a00",
                        "on-tertiary-container": "#503d00",
                        "inverse-primary": "#cfbcff",
                        "background": "#faf9fb",
                        "error": "#ba1a1a",
                        "surface-tint": "#6750a4",
                        "on-tertiary-fixed-variant": "#594400",
                        "primary-fixed": "#e9ddff",
                        "tertiary-container": "#c9a74d",
                        "on-secondary-fixed": "#31111d",
                        "primary-fixed-dim": "#cfbcff",
                        "on-primary": "#ffffff",
                        "on-secondary-fixed-variant": "#633b48",
                        "surface-container": "#eeedef",
                        "on-primary-container": "#e0d2ff",
                        "on-error-container": "#93000a",
                        "on-secondary": "#ffffff",
                        "error-container": "#ffdad6",
                        "surface-container-high": "#e8e8ea",
                        "on-primary-fixed": "#22005d",
                        "inverse-surface": "#2f3032",
                        "secondary": "#7d5260",
                        "tertiary": "#765b00",
                        "on-secondary-container": "#7a4f5d",
                        "inverse-on-surface": "#f1f0f2",
                        "surface-variant": "#e3e2e4",
                        "surface-bright": "#faf9fb",
                        "on-surface": "#1a1c1d",
                        "surface-dim": "#dadadc",
                        "surface-container-lowest": "#ffffff",
                        "secondary-fixed": "#ffd9e3",
                        "on-background": "#1a1c1d"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "margin-mobile": "16px",
                        "section-gap": "80px",
                        "content-gap": "32px",
                        "baseline": "4px",
                        "margin-desktop": "64px",
                        "gutter": "24px"
                    },
                    "fontFamily": {
                        "headline-md": ["Cairo"],
                        "label-mono": ["JetBrains Mono"],
                        "body-lg": ["Cairo"],
                        "display-lg": ["Cairo"],
                        "title-lg": ["Cairo"],
                        "headline-lg": ["Cairo"],
                        "body-md": ["Cairo"],
                        "label-en": ["IBM Plex Sans"]
                    },
                    "fontSize": {
                        "headline-md": ["28px", { "lineHeight": "36px", "fontWeight": "600" }],
                        "label-mono": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
                        "display-lg": ["57px", { "lineHeight": "64px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                        "title-lg": ["22px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "headline-lg": ["32px", { "lineHeight": "40px", "fontWeight": "600" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "label-en": ["14px", { "lineHeight": "20px", "letterSpacing": "0.1px", "fontWeight": "500" }]
                    }
                }
            }
        }
    </script>
<style>
        body { background-color: #faf9fb; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .section-hover:hover {
            box-shadow: 0 0 0 2px rgb(79, 55, 138) !important;
            border-radius: 4px;
        }
</style>
</head>
<body class="text-on-background font-body-md bg-background antialiased selection:bg-primary-container selection:text-on-primary-container">
<!-- 1. TopNavBar -->
<nav data-section="navbar" class="bg-surface/80 dark:bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant flat no shadows section-hover cursor-pointer" style="background-color: \${navbarBg}; color: \${navbarText};">
<div class="flex flex-row-reverse justify-between items-center w-full px-margin-desktop py-4 max-w-[1280px] mx-auto md:px-margin-desktop px-margin-mobile">
<div class="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed" style="color: \${navbarText};">\${navbarTitle}</div>
<ul class="hidden md:flex flex-row-reverse gap-8 items-center font-title-lg text-title-lg">
<li><a class="text-primary dark:text-primary-fixed border-b-2 border-primary pb-1" href="#home">الرئيسية</a></li>
<li><a class="text-on-surface-variant dark:text-on-surface-variant/70 hover:text-primary transition-colors duration-200" href="#about">عن الكوتش</a></li>
<li><a class="text-on-surface-variant dark:text-on-surface-variant/70 hover:text-primary transition-colors duration-200" href="#courses">الكورسات</a></li>
<li><a class="text-on-surface-variant dark:text-on-surface-variant/70 hover:text-primary transition-colors duration-200" href="#journey">رحلة التعلم</a></li>
<li><a class="text-on-surface-variant dark:text-on-surface-variant/70 hover:text-primary transition-colors duration-200" href="#testimonials">آراء الطلاب</a></li>
<li><a class="text-on-surface-variant dark:text-on-surface-variant/70 hover:text-primary transition-colors duration-200" href="#faq">الأسئلة الشائعة</a></li>
</ul>
<button class="bg-primary text-on-primary font-label-en text-label-en uppercase px-6 py-2 rounded scale-95 duration-200 hover:bg-primary-container transition-colors hidden md:block">ابدأ الآن</button>
<button class="md:hidden text-primary">
<span class="material-symbols-outlined text-3xl">menu</span>
</button>
</div>
</nav>

<main class="pt-[100px]">
<!-- 2. Hero -->
<section id="home" data-section="hero" class="max-w-[1280px] mx-auto px-margin-desktop md:px-margin-desktop px-margin-mobile py-section-gap flex flex-col md:flex-row-reverse items-center gap-content-gap section-hover cursor-pointer" style="background-color: \${heroBg}; color: \${heroTextColor};">
<div class="w-full md:w-1/2" style="position: relative;">
<img class="w-full aspect-[4/5] object-cover rounded border border-outline-variant" data-alt="Professional coach in a clean study room with notebook and laptop" src="\${content?.hero?.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop'}"/>
<div class="absolute -right-12 bottom-12 hidden md:block p-4 bg-surface-container-low border border-outline-variant rounded font-label-mono text-label-mono text-on-surface-variant max-w-[200px]">
    توجيه شخصي 1-on-1 — التعلم الفعال يعتمد على الفهم العميق والتطبيق العملي المباشر.
</div>
</div>
<div class="w-full md:w-1/2 flex flex-col items-start gap-6">
<div class="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-primary font-label-mono text-xs rounded-full">
  <span class="material-symbols-outlined text-sm">school</span>
  <span>\${heroSubtitle}</span>
</div>
<h1 class="font-display-lg text-display-lg text-on-background">\${heroTitle}</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
    \${heroDesc}
</p>
<div class="flex gap-4 pt-4">
<a href="\${heroBtnLink}" class="bg-primary text-on-primary px-8 py-3 rounded font-title-lg text-title-lg hover:bg-primary-container transition-colors inline-block">\${heroBtnText}</a>
<a href="#about" class="border border-outline text-primary px-8 py-3 rounded font-title-lg text-title-lg hover:bg-surface-container-low transition-colors inline-block">تعرّف على الكوتش</a>
</div>
</div>
</section>

<!-- 3. Value Proposition / Features Bar -->
<section class="max-w-[1280px] mx-auto px-margin-desktop py-content-gap border-y border-outline-variant bg-surface-container-lowest">
<p class="text-center font-label-mono text-label-mono text-outline mb-6 uppercase tracking-widest">مميزات التجربة التعليمية مع الكوتش</p>
<div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
<div class="flex flex-col items-center gap-2 p-2">
<span class="material-symbols-outlined text-3xl text-primary">play_circle</span>
<span class="font-title-lg text-sm font-bold text-on-background">دروس مسجلة عالية الجودة</span>
</div>
<div class="flex flex-col items-center gap-2 p-2">
<span class="material-symbols-outlined text-3xl text-primary">assignment_turned_in</span>
<span class="font-title-lg text-sm font-bold text-on-background">تمارين وتطبيقات عملية</span>
</div>
<div class="flex flex-col items-center gap-2 p-2">
<span class="material-symbols-outlined text-3xl text-primary">forum</span>
<span class="font-title-lg text-sm font-bold text-on-background">متابعة وتوجيه مباشر</span>
</div>
<div class="flex flex-col items-center gap-2 p-2">
<span class="material-symbols-outlined text-3xl text-primary">update</span>
<span class="font-title-lg text-sm font-bold text-on-background">محتوى متجدد باستمرار</span>
</div>
</div>
</section>

<!-- 4. About the Coach -->
<section id="about" data-section="about" class="max-w-[1280px] mx-auto px-margin-desktop py-section-gap section-hover cursor-pointer">
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
<div class="md:col-span-5">
<div class="relative">
<img class="w-full aspect-square object-cover rounded border border-outline-variant shadow-sm" src="\${content?.about?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop'}" alt="Coach Profile Image"/>
<div class="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-md p-3 border border-outline-variant rounded font-label-mono text-xs text-primary">
  مدرب وموجه تعليمي
</div>
</div>
</div>
<div class="md:col-span-7 flex flex-col items-start gap-4">
<h2 class="font-headline-lg text-headline-lg text-primary border-b border-primary pb-2 inline-block">\${aboutTitle}</h2>
<p class="font-body-lg text-body-lg text-on-background leading-relaxed">
أهلاً بك! أنا مدربك في هذه الأكاديمية. أسعى لتقديم محتوى تعليمي عملي ومباشر يجمع بين الفهم النظري والتطبيق الفعلي، دون تعقيد أو حشو غير ضروري.
</p>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
\${aboutSubtitle} هدفنا هنا ليس مجرد مشاهدة الدروس، بل التأكد من قدرتك على تطبيق كل معلومة تتعلمها، وتطوير مهاراتك خطوة بخطوة للحصول على نتائج ملموسة.
</p>
<div class="grid grid-cols-2 gap-4 w-full pt-4">
<div class="p-4 border border-outline-variant rounded bg-surface">
<span class="material-symbols-outlined text-primary text-2xl mb-1">psychology</span>
<h4 class="font-title-lg text-sm font-bold">منهجية مبسطة</h4>
<p class="font-body-md text-xs text-on-surface-variant mt-1">تفكيك المفاهيم المعقدة إلى خطوات واضحة وقابلة للتطبيق.</p>
</div>
<div class="p-4 border border-outline-variant rounded bg-surface">
<span class="material-symbols-outlined text-primary text-2xl mb-1">groups</span>
<h4 class="font-title-lg text-sm font-bold">توجيه شخصي</h4>
<p class="font-body-md text-xs text-on-surface-variant mt-1">متابعة الاستفسارات وتقديم التغذية الراجعة لجميع الطلاب.</p>
</div>
</div>
</div>
</div>
</section>

<!-- 5. Courses Section -->
<section id="courses" data-section="features" class="bg-surface-container-low py-section-gap border-t border-outline-variant section-hover cursor-pointer">
<div class="max-w-[1280px] mx-auto px-margin-desktop">
<div class="text-center mb-16">
<h2 class="font-headline-lg text-headline-lg text-on-background">\${content?.features?.title || 'الدورات التدريبية والكورسات'}</h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-4 max-w-2xl mx-auto">\${content?.features?.subtitle || 'دورات متخصصة مصممة بعناية لتناسب جميع المستويات مع تطبيقات عملية ومتابعة مستمرة.'}</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
  \${featuresItems.map((item: any, idx: number) => \`
    <div data-section="features" data-index="\${idx}" class="group border border-outline-variant rounded bg-surface p-6 hover:border-primary transition-colors cursor-pointer flex flex-col h-full">
      <div class="w-full aspect-video mb-6 overflow-hidden rounded bg-surface-variant relative">
        <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="\${item.icon || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop'}" alt="\${item.title}"/>
        <div class="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded font-label-mono text-label-mono text-primary">كورس تطبيقي</div>
      </div>
      <h3 class="font-title-lg text-title-lg text-on-background group-hover:text-primary transition-colors mb-2">\${item.title}</h3>
      <p class="font-body-md text-body-md text-on-surface-variant flex-grow">\${item.description}</p>
      <div class="mt-6 flex items-center justify-between border-t border-outline-variant pt-4">
        <div class="flex items-center gap-2 text-on-surface-variant font-label-mono text-label-mono">
          <span class="material-symbols-outlined text-sm">schedule</span>
          <span>دروس مسجلة + تطبيقات</span>
        </div>
        <button class="text-primary font-label-en text-label-en hover:underline uppercase">عرض الكورس</button>
      </div>
    </div>
  \`).join('')}
</div>
</div>
</section>

<!-- 6. Student Journey -->
<section id="journey" class="bg-surface-container-low py-section-gap border-y border-outline-variant">
<div class="max-w-[900px] mx-auto px-margin-desktop">
<div class="text-center mb-16">
<h2 class="font-headline-lg text-headline-lg text-on-background">رحلة التعلم مع الكوتش</h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-2">خطوات متسلسلة ومنظمة تحول المعرفة إلى مهارات تطبيقية ملموسة.</p>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
<div class="p-4 border border-outline-variant rounded bg-surface text-center flex flex-col items-center">
<div class="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center mb-3">01</div>
<h4 class="font-title-lg text-sm font-bold mb-1">اختر الكورس</h4>
<p class="font-body-md text-xs text-on-surface-variant">حدد الكورس المناسب لهدفك الحالي.</p>
</div>
<div class="p-4 border border-outline-variant rounded bg-surface text-center flex flex-col items-center">
<div class="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center mb-3">02</div>
<h4 class="font-title-lg text-sm font-bold mb-1">ابدأ التعلم</h4>
<p class="font-body-md text-xs text-on-surface-variant">شاهد الدروس المسجلة في أي وقت.</p>
</div>
<div class="p-4 border border-outline-variant rounded bg-surface text-center flex flex-col items-center">
<div class="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center mb-3">03</div>
<h4 class="font-title-lg text-sm font-bold mb-1">طبّق التمارين</h4>
<p class="font-body-md text-xs text-on-surface-variant">نفّذ المهام التطبيقية المرفقة.</p>
</div>
<div class="p-4 border border-outline-variant rounded bg-surface text-center flex flex-col items-center">
<div class="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center mb-3">04</div>
<h4 class="font-title-lg text-sm font-bold mb-1">احصل على التوجيه</h4>
<p class="font-body-md text-xs text-on-surface-variant">احصل على ملاحظات وإجابات الكوتش.</p>
</div>
<div class="p-4 border border-outline-variant rounded bg-surface text-center flex flex-col items-center">
<div class="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center mb-3">05</div>
<h4 class="font-title-lg text-sm font-bold mb-1">طوّر مستواك</h4>
<p class="font-body-md text-xs text-on-surface-variant">حقّق نتائج ملموسة وواصل النمو.</p>
</div>
</div>
</div>
</section>

<!-- 7. Student Reviews -->
<section id="testimonials" class="max-w-[1280px] mx-auto px-margin-desktop py-section-gap">
<div class="text-center mb-16">
<h2 class="font-headline-lg text-headline-lg text-on-background">آراء الطلاب والمشاركين</h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-4 max-w-2xl mx-auto">تجارب واقعية من متعلمين استفادوا من الكورسات والتوجيه المباشر.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div class="p-6 border border-outline-variant rounded bg-surface relative flex flex-col">
<div class="flex gap-1 text-tertiary-fixed-dim mb-4">
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
</div>
<p class="font-body-md text-body-md text-on-background leading-relaxed mb-6 flex-grow">
"الشرح كان واضح جداً، والأهم إني قدرت أطبق اللي اتعلمته عملياً في شغلي من أول أسبوع. التوجيه المباشر اختصر عليا وقت طويل."
</p>
<div class="flex items-center gap-4 mt-auto border-t border-outline-variant pt-4">
<div class="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-title-lg">م.ع</div>
<div>
<p class="font-title-lg text-title-lg text-on-background text-sm">محمد العتيبي</p>
<p class="font-label-mono text-label-mono text-on-surface-variant text-xs">متعلم مستمر</p>
</div>
</div>
</div>
<div class="p-6 border border-outline-variant rounded bg-surface relative flex flex-col">
<div class="flex gap-1 text-tertiary-fixed-dim mb-4">
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
</div>
<p class="font-body-md text-body-md text-on-background leading-relaxed mb-6 flex-grow">
"الكورس كان منظم بشكل ممتاز وبدون أي حشو. الكوتش يركز على التطبيق وعلى إعطاء أمثلة من واقع العمل اليومي."
</p>
<div class="flex items-center gap-4 mt-auto border-t border-outline-variant pt-4">
<div class="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-title-lg">ر.س</div>
<div>
<p class="font-title-lg text-title-lg text-on-background text-sm">ريم السعيد</p>
<p class="font-label-mono text-label-mono text-on-surface-variant text-xs">مستفيدة من الكورسات</p>
</div>
</div>
</div>
<div class="p-6 border border-outline-variant rounded bg-surface relative flex flex-col">
<div class="flex gap-1 text-tertiary-fixed-dim mb-4">
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
<span class="material-symbols-outlined text-tertiary-container" data-weight="fill">star</span>
</div>
<p class="font-body-md text-body-md text-on-background leading-relaxed mb-6 flex-grow">
"كنت أعاني من تشتت الأفكار عند التخطيط لمشروعي. من خلال التمارين والمتابعة، قدرت أصيغ الخطة بوضوح وأبدأ التنفيذ."
</p>
<div class="flex items-center gap-4 mt-auto border-t border-outline-variant pt-4">
<div class="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-title-lg">ط.م</div>
<div>
<p class="font-title-lg text-title-lg text-on-background text-sm">طارق مصطفى</p>
<p class="font-label-mono text-label-mono text-on-surface-variant text-xs">صانع محتوى</p>
</div>
</div>
</div>
</div>
</section>

<!-- 8. FAQ Section -->
<section id="faq" data-section="faq" class="max-w-[1000px] mx-auto px-margin-desktop py-section-gap section-hover cursor-pointer">
<div class="text-center mb-12">
<h2 class="font-headline-lg text-headline-lg text-on-background">\${faqTitle}</h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-2">إجابات لأكثر الأسئلة تكراراً حول الكورسات ونظام التعلم.</p>
</div>
<div class="space-y-4">
  \${faqItems.map((item: any, idx: number) => \`
    <div data-section="faq" data-index="\${idx}" class="border border-outline-variant rounded bg-surface p-6 cursor-pointer hover:border-primary transition-colors">
      <h3 class="font-title-lg text-title-lg text-primary mb-2">\${item.question}</h3>
      <p class="font-body-md text-body-md text-on-surface-variant">\${item.answer}</p>
    </div>
  \`).join('')}
</div>
</section>

<!-- 9. Final CTA / Newsletter -->
<section class="max-w-[800px] mx-auto px-margin-desktop py-section-gap mb-section-gap">
<div class="border border-primary-fixed-dim bg-primary-fixed/10 p-12 text-center rounded">
<span class="material-symbols-outlined text-primary text-5xl mb-4">school</span>
<h2 class="font-headline-lg text-headline-lg text-on-background mb-4">جاهز لتبدأ رحلة التعلم وتطوير مهاراتك؟</h2>
<p class="font-body-md text-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
    اشترك في النشرة التعليمية ليصلك أحدث الكورسات والدروس المجانية والنصائح العملية مباشرة على بريدك.
</p>
<form class="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" onsubmit="event.preventDefault();">
<input class="flex-1 bg-surface border border-outline-variant px-4 py-3 rounded font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-right" placeholder="البريد الإلكتروني" required="" type="email"/>
<button class="bg-primary text-on-primary px-8 py-3 rounded font-title-lg hover:bg-primary-container transition-colors shrink-0" type="submit">اشترك الآن</button>
</form>
</div>
</section>
</main>

<!-- 10. Footer -->
<footer data-section="footer" class="bg-surface-container-lowest dark:bg-surface-dim w-full border-t border-outline-variant flat section-hover cursor-pointer">
<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-section-gap max-w-[1280px] mx-auto text-right">
<div class="md:col-span-1" data-section="contact">
<div class="text-headline-md font-headline-md text-primary mb-4">\${contactTitle}</div>
<p class="font-body-md text-body-md text-on-surface-variant">\${contactDesc}</p>
</div>
<div class="md:col-span-3 flex flex-wrap justify-end gap-8 font-body-md text-body-md mt-4 md:mt-0">
<a class="text-on-surface-variant hover:text-primary underline transition-all opacity-80 hover:opacity-100" href="#home">الرئيسية</a>
<a class="text-on-surface-variant hover:text-primary underline transition-all opacity-80 hover:opacity-100" href="#about">عن الكوتش</a>
<a class="text-on-surface-variant hover:text-primary underline transition-all opacity-80 hover:opacity-100" href="#courses">الكورسات</a>
<a class="text-on-surface-variant hover:text-primary underline transition-all opacity-80 hover:opacity-100" href="#testimonials">آراء الطلاب</a>
<a class="text-on-surface-variant hover:text-primary underline transition-all opacity-80 hover:opacity-100" href="#faq">الأسئلة الشائعة</a>
</div>
</div>
<div class="text-center py-4 border-t border-outline-variant/30 text-xs text-on-surface-variant">
\${footerText}
</div>
</footer>

<script>
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
