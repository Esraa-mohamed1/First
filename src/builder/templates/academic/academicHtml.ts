export interface TemplateContent {
  navbar: { title: string; logo: string; bgColor: string; textColor: string };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    backgroundColor: string;
    textColor: string;
  };
  about: {
    title: string;
    subtitle: string;
    image: string;
    backgroundColor: string;
    textColor: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: Array<{ icon: string; title: string; description: string }>;
    backgroundColor: string;
    textColor: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    items: Array<{ title: string; price: string; features: string[] }>;
    backgroundColor: string;
    textColor: string;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
    backgroundColor: string;
    textColor: string;
  };
  contact: {
    title: string;
    description: string;
    phoneNumber: string;
    buttonText: string;
    backgroundColor: string;
    textColor: string;
  };
  footer: {
    text: string;
    backgroundColor: string;
    textColor: string;
  };
}

export const renderMedia = (url: string | undefined | null, className: string = '', alt: string = 'media') => {
  if (!url) return '';
  const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('youtube') || url.includes('vimeo') || url.includes('youtu.be');
  if (isVideo) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let embedUrl = url;
      if (url.includes('watch?v=')) {
        embedUrl = url.replace('watch?v=', 'embed/').split('&')[0];
      } else if (url.includes('youtu.be/')) {
        embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0];
      }
      return `<iframe src="${embedUrl}" class="${className}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('/').pop();
      return `<iframe src="https://player.vimeo.com/video/${vimeoId}" class="${className}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    }
    return `<video src="${url}" controls autoplay loop muted class="${className} object-cover"></video>`;
  }
  return `<img src="${url}" alt="${alt}" class="${className} object-cover" />`;
};

export const getAcademicHtml = (content: TemplateContent, isEditing: boolean = false) => {
  const navbarTitle = content?.navbar?.title || (content?.navbar as any)?.name || 'إديوكور';
  const navbarBg = content?.navbar?.bgColor || (content?.navbar as any)?.bg_color || '#ffffff';
  const navbarText = content?.navbar?.textColor || (content?.navbar as any)?.text_color || '#3525cd';
  const navbarLogo = content?.navbar?.logo || '';

  const heroSubtitle = content?.hero?.subtitle || 'حل مؤسسي متقدم';
  const heroTitle = content?.hero?.title || 'بناء تجربة أكاديمية أكثر ذكاءً.';
  const heroDesc = content?.hero?.description || 'اربط الطلاب، والمعلمين، والإداريين على منصة مؤسسية موحدة مصممة لتحقيق التميز القابل للقياس وسير العمل المبسط بكفاءة عالية.';
  const heroBtnText = content?.hero?.buttonText || (content?.hero as any)?.button_text || 'استكشف المنصة';
  const heroBtnLink = content?.hero?.buttonLink || (content?.hero as any)?.button_link || '#';
  const heroImg = content?.hero?.image || (content?.hero as any)?.img || (content?.hero as any)?.video || 'https://tse4.mm.bing.net/th/id/OIP.CGEfBMBIYoz4Syk_3B8DawHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3';
  const heroBg = content?.hero?.backgroundColor || (content?.hero as any)?.background_color || (content?.hero as any)?.bg_color || '#fcf8ff';
  const heroTextColor = content?.hero?.textColor || (content?.hero as any)?.text_color || '#1b1b24';

  const aboutTitle = content?.about?.title || 'تحليلات ذكية لاتخاذ قرارات أفضل';
  const aboutSubtitle = content?.about?.subtitle || 'راقب الأداء الأكاديمي، وحدد الاتجاهات، وقم بتحسين المخرجات التعليمية من خلال لوحات تحكم تحليلية متقدمة توفر رؤى في الوقت الفعلي.';
  const aboutImg = content?.about?.image || (content?.about as any)?.img || (content?.about as any)?.video || '';
  const aboutBg = content?.about?.backgroundColor || (content?.about as any)?.background_color || (content?.about as any)?.bg_color || '#ffffff';
  const aboutTextColor = content?.about?.textColor || (content?.about as any)?.text_color || '#1b1b24';
  const analyticsTitle = (content?.about as any)?.analyticsTitle || 'رؤى الأداء المؤسسي';
  const analyticsBars = (content?.about as any)?.analyticsBars || [40, 65, 85, 50, 95];
  const analyticsColor = (content?.about as any)?.analyticsColor || '#3525cd';
  const bar1 = analyticsBars[0] ?? 40;
  const bar2 = analyticsBars[1] ?? 65;
  const bar3 = analyticsBars[2] ?? 85;
  const bar4 = analyticsBars[3] ?? 50;
  const bar5 = analyticsBars[4] ?? 95;

  const featuresTitle = content?.features?.title || 'نظام بيئي أكاديمي متكامل';
  const featuresSubtitle = content?.features?.subtitle || 'مجموعة شاملة ومتطورة من الأدوات لإدارة كل جانب من جوانب رحلة التعلم المؤسسية.';
  const featuresItems = content?.features?.items || [];
  const featuresBg = content?.features?.backgroundColor || (content?.features as any)?.background_color || (content?.features as any)?.bg_color || '#f5f2ff';
  const featuresTextColor = content?.features?.textColor || (content?.features as any)?.text_color || '#1b1b24';

  const pricingTitle = content?.pricing?.title || 'المخرجات والنتائج الإحصائية';
  const pricingSubtitle = content?.pricing?.subtitle || 'معدلات تقدم وتحليلات رقمية للفصول الدراسية';
  const pricingItems = content?.pricing?.items || [];
  const pricingBg = content?.pricing?.backgroundColor || (content?.pricing as any)?.background_color || (content?.pricing as any)?.bg_color || '#fcf8ff';
  const pricingTextColor = content?.pricing?.textColor || (content?.pricing as any)?.text_color || '#1b1b24';

  const contactTitle = content?.contact?.title || 'ابْنِ مستقبل التعليم';
  const contactDesc = content?.contact?.description || 'انضم إلى المؤسسات الرائدة عالميًا في تحويل التجربة الأكاديمية. ارتقِ بمستوى مؤسستك التعليمية وابدأ رحلتك نحو التميز اليوم.';
  const contactPhone = content?.contact?.phoneNumber || (content?.contact as any)?.phone_number || '201000000000';
  const contactBtnText = content?.contact?.buttonText || (content?.contact as any)?.button_text || 'ابدأ الآن';
  const contactBg = content?.contact?.backgroundColor || (content?.contact as any)?.background_color || (content?.contact as any)?.bg_color || '#3525cd';
  const contactTextColor = content?.contact?.textColor || (content?.contact as any)?.text_color || '#ffffff';

  const footerText = content?.footer?.text || '© 2024 إديوكور الأكاديمية. جميع الحقوق محفوظة.';
  const footerBg = content?.footer?.backgroundColor || (content?.footer as any)?.background_color || (content?.footer as any)?.bg_color || '#ffffff';
  const footerTextColor = content?.footer?.textColor || (content?.footer as any)?.text_color || '#1b1b24';

  const videoTag = (content?.about as any)?.videoTag || 'شاهد وتعلّم';
  const videoTitle = (content?.about as any)?.videoTitle || 'تعرف على فلسفتنا التعليمية في ٣ دقائق';
  const videoDesc = (content?.about as any)?.videoDesc || 'نقدم لك جولة سريعة داخل منصتنا التعليمية. نوضح فيها طريقة تتبع الدروس المتقدمة، والتفاعل مع المرشدين، والوصول لأوراق العمل والامتحانات الذكية.';
  const videoLink = (content?.about as any)?.videoLink || (content?.about as any)?.videoImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop';

  const newsletterTitle = (content?.footer as any)?.newsletterTitle || 'اشترك في نشرتنا البريدية المعرفية';
  const newsletterDesc = (content?.footer as any)?.newsletterDesc || 'احصل على أحدث المقالات التحليلية، والمناهج الجديدة، والماستركلاسز الحصرية مباشرة في بريدك الإلكتروني أسبوعياً.';
  const newsletterBtnText = (content?.footer as any)?.newsletterBtnText || 'اشترك الآن';

  const testimonialsTitle = (content?.pricing as any)?.testimonialsTitle || 'ماذا يقول شركاؤنا وطلابنا؟';
  const testimonialsSubtitle = (content?.pricing as any)?.testimonialsSubtitle || 'قصص نجاح ملهمة وتجارب واقعية يعبر عنها شركاؤنا الأكاديميون وطلابنا المتميزون.';
  const testimonial1Text = (content?.pricing as any)?.testimonial1Text || 'سهولة إدارة المحتوى التعليمي والتحليلات الدقيقة المتاحة مكنتنا كإدارة من تتبع الأداء وتحسين المخرجات التعليمية بشكل ملموس وسريع.';
  const testimonial1Author = (content?.pricing as any)?.testimonial1Author || 'أ.د. محمد الشمري';
  const testimonial1Role = (content?.pricing as any)?.testimonial1Role || 'عميد القبول والتسجيل';
  const testimonial2Text = (content?.pricing as any)?.testimonial2Text || 'سهولة التصفح، والوصول الفوري للمقررات والامتحانات التفاعلية، أتاح لي تنظيم وقتي والمذاكرة بذكاء وبدون تشتت تماماً.';
  const testimonial2Author = (content?.pricing as any)?.testimonial2Author || 'رنا عبدالله';
  const testimonial2Role = (content?.pricing as any)?.testimonial2Role || 'طالبة هندسة برمجيات';
  const testimonial3Text = (content?.pricing as any)?.testimonial3Text || 'كأستاذ، مكنتني بوابة المعلم من متابعة الواجبات وإعطاء تقييمات تفصيلية فورية لكل طالب وطالبة بسهولة مطلقة ووقت قياسي.';
  const testimonial3Author = (content?.pricing as any)?.testimonial3Author || 'م. عاصم العتيبي';
  const testimonial3Role = (content?.pricing as any)?.testimonial3Role || 'عضو هيئة التدريس';

  return `<!DOCTYPE html>
<html class="light" dir="rtl" lang="ar">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>${navbarTitle} - التميز الأكاديمي</title>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&amp;display=swap" rel="stylesheet"/>
  <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-error-container": "#93000a",
                        "on-error": "#ffffff",
                        "tertiary-fixed-dim": "#ffb95f",
                        "inverse-on-surface": "#f3effc",
                        "secondary-container": "#6cf8bb",
                        "error": "#ba1a1a",
                        "surface-container-low": "#f5f2ff",
                        "outline-variant": "#c7c4d8",
                        "on-primary-fixed-variant": "#3323cc",
                        "error-container": "#ffdad6",
                        "on-secondary": "#ffffff",
                        "tertiary": "#684000",
                        "on-surface": "#1b1b24",
                        "secondary-fixed-dim": "#4edea3",
                        "secondary-fixed": "#6ffbbe",
                        "on-primary": "#ffffff",
                        "surface-bright": "#fcf8ff",
                        "on-primary-fixed": "#0f0069",
                        "inverse-primary": "#c3c0ff",
                        "background": "#fcf8ff",
                        "on-primary-container": "#dad7ff",
                        "outline": "#777587",
                        "on-tertiary": "#ffffff",
                        "inverse-surface": "#302f39",
                        "on-tertiary-container": "#ffd4a4",
                        "primary-fixed-dim": "#c3c0ff",
                        "surface-tint": "#4d44e3",
                        "on-background": "#1b1b24",
                        "tertiary-container": "#885500",
                        "on-surface-variant": "#464555",
                        "surface-container": "#f0ecf9",
                        "on-tertiary-fixed": "#2a1700",
                        "surface-variant": "#e4e1ee",
                        "on-secondary-fixed-variant": "#005236",
                        "surface-container-highest": "#e4e1ee",
                        "secondary": "#006c49",
                        "primary": "#3525cd",
                        "surface-container-high": "#eae6f4",
                        "surface-dim": "#dcd8e5",
                        "surface-container-lowest": "#ffffff",
                        "on-secondary-fixed": "#002113",
                        "on-tertiary-fixed-variant": "#653e00",
                        "surface": "#fcf8ff",
                        "on-secondary-container": "#00714d",
                        "primary-fixed": "#e2dfff",
                        "tertiary-fixed": "#ffddb8",
                        "primary-container": "#4f46e5"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1rem",
                        "3xl": "1.5rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "gutter": "24px",
                        "unit": "4px",
                        "stack-sm": "12px",
                        "margin-desktop": "48px",
                        "margin-mobile": "24px",
                        "stack-md": "24px",
                        "stack-lg": "48px",
                        "stack-xl": "80px",
                        "container-max": "1400px"
                    },
                    "fontFamily": {
                        "body-md": ["Tajawal", "sans-serif"],
                        "headline-lg": ["Tajawal", "sans-serif"],
                        "headline-md": ["Tajawal", "sans-serif"],
                        "headline-lg-mobile": ["Tajawal", "sans-serif"],
                        "label-md": ["Tajawal", "sans-serif"],
                        "body-lg": ["Tajawal", "sans-serif"],
                        "display-lg": ["Tajawal", "sans-serif"],
                        "caption": ["Tajawal", "sans-serif"]
                    },
                    "fontSize": {
                        "body-md": ["16px", { "lineHeight": "1.7", "fontWeight": "500" }],
                        "headline-lg": ["36px", { "lineHeight": "1.3", "fontWeight": "800" }],
                        "headline-md": ["26px", { "lineHeight": "1.4", "fontWeight": "700" }],
                        "headline-lg-mobile": ["28px", { "lineHeight": "1.3", "fontWeight": "800" }],
                        "label-md": ["15px", { "lineHeight": "1.2", "fontWeight": "700" }],
                        "body-lg": ["20px", { "lineHeight": "1.7", "fontWeight": "500" }],
                        "display-lg": ["56px", { "lineHeight": "1.2", "fontWeight": "800" }],
                        "caption": ["14px", { "lineHeight": "1.5", "fontWeight": "500" }]
                    }
                },
            },
        }
  </script>
  <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined.fill {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .rtl-icon {
            transform: scaleX(-1);
        }
        ${isEditing ? `
        .section-hover:hover {
            box-shadow: 0 0 0 2px rgb(59, 130, 246) !important;
            border-radius: 12px;
        }
        ` : `
        .section-hover {
            cursor: default !important;
        }
        `}
        .special-image-hover {
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .special-image-hover:hover {
            transform: translateY(-8px) rotate(-1deg);
            box-shadow: 0 30px 60px -15px rgba(53, 37, 205, 0.3);
        }
  </style>
  <style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
</head>
<body class="bg-background text-on-background font-body-md text-body-md antialiased selection:bg-primary selection:text-on-primary">
<!-- TopAppBar -->
<header data-section="navbar" class="bg-surface border-b border-outline-variant/50 shadow-sm w-full sticky top-0 z-50 transition-all duration-300 section-hover cursor-pointer" style="background-color: ${navbarBg}; color: ${navbarText};">
<div class="flex items-center justify-between px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-24">
<div class="flex items-center gap-stack-sm hover:scale-95 transition-transform duration-200 cursor-pointer">
<span class="material-symbols-outlined text-primary text-[32px]">school</span>
<span class="text-headline-md font-headline-md text-primary" style="color: ${navbarText};">${navbarTitle}</span>
</div>
<!-- Desktop Nav -->
<nav class="hidden md:flex items-center gap-stack-lg">
<a class="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-colors duration-200" href="#">الرئيسية</a>
<a class="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-colors duration-200" href="#">الدورات</a>
<a class="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-colors duration-200" href="#">المدربون</a>
<a class="text-primary text-label-md font-label-md border-b-2 border-primary pb-1 hover:text-primary transition-colors duration-200" href="#">أكاديمي</a>
<a class="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-colors duration-200" href="#">الموارد</a>
<a class="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-colors duration-200" href="#">حول</a>
</nav>
<div class="flex items-center gap-stack-md">
<a class="text-label-md font-label-md text-primary hover:opacity-80 transition-opacity hidden sm:block" href="#">تسجيل الدخول</a>
<button class="bg-primary hover:bg-primary-container text-on-primary text-label-md font-label-md px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hidden sm:block">
    ابدأ الآن
</button>
<button class="md:hidden flex items-center justify-center p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
<span class="material-symbols-outlined">menu</span>
</button>
</div>
</div>
</header>
<!-- NavigationDrawer -->
<div class="fixed inset-0 z-50 bg-on-background/50 hidden backdrop-blur-sm" id="mobile-drawer">
<aside class="fixed right-0 top-0 h-full w-80 z-50 py-stack-lg bg-surface shadow-2xl rounded-l-2xl transform transition-transform duration-300 translate-x-full" id="drawer-content">
<div class="px-margin-mobile mb-stack-lg flex items-center gap-stack-sm">
<span class="text-headline-md font-headline-md text-primary">مركز التعلم</span>
</div>
<nav class="flex flex-col gap-stack-sm px-4">
<a class="text-on-surface-variant flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-all text-label-md font-label-md" href="#">
<span class="material-symbols-outlined">home</span> الرئيسية
                </a>
<a class="text-on-surface-variant flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-all text-label-md font-label-md" href="#">
<span class="material-symbols-outlined">menu_book</span> الدورات
                </a>
<a class="text-on-surface-variant flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-all text-label-md font-label-md" href="#">
<span class="material-symbols-outlined">groups</span> المدربون
                </a>
<a class="bg-primary/10 text-primary flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-label-md font-label-md" href="#">
<span class="material-symbols-outlined fill">school</span> أكاديمي
                </a>
<a class="text-on-surface-variant flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-all text-label-md font-label-md" href="#">
<span class="material-symbols-outlined">folder_shared</span> الموارد
                </a>
<a class="text-on-surface-variant flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-all text-label-md font-label-md" href="#">
<span class="material-symbols-outlined">info</span> حول
                </a>
<div class="h-px bg-outline-variant/30 my-4"></div>
<a class="text-on-surface-variant flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-all text-label-md font-label-md" href="#">
<span class="material-symbols-outlined">login</span> تسجيل الدخول
                </a>
<a class="bg-primary text-on-primary flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary-container transition-all text-label-md font-label-md" href="#">
<span class="material-symbols-outlined">person_add</span> ابدأ الآن
                </a>
</nav>
</aside>
</div>
<!-- Main Content Canvas -->
<main class="w-full">
<!-- Hero Section -->
<section data-section="hero" class="w-full transition-all duration-300 section-hover cursor-pointer" style="background-color: ${heroBg}; color: ${heroTextColor};">
<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-36 pb-32 flex flex-col lg:flex-row items-center gap-stack-xl">
<div class="w-full lg:w-1/2 flex flex-col items-start gap-stack-md z-10 p-4">
<div class="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
<span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
<span class="text-label-md font-label-md text-primary">${heroSubtitle}</span>
</div>
<h1 class="text-display-lg font-display-lg leading-tight">
                    ${heroTitle}
</h1>
<p class="text-body-lg font-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                    ${heroDesc}
                </p>
<div class="flex flex-wrap items-center gap-stack-md pt-4">
<button class="bg-primary hover:bg-primary-container text-on-primary text-label-md font-label-md px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                        ${heroBtnText}
                    </button>
<button class="bg-surface hover:bg-surface-container text-on-surface border border-outline-variant text-label-md font-label-md px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-3 group">
                        طلب عرض توضيحي <span class="material-symbols-outlined text-[20px] rtl-icon group-hover:-translate-x-1 transition-transform">arrow_forward</span>
</button>
</div>
</div>
<div class="w-full lg:w-1/2 flex items-center justify-center p-4">
<div class="relative rounded-[2.5rem] bg-surface-container-lowest border border-outline-variant/50 shadow-2xl p-6 group special-image-hover overflow-hidden">
<div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-30 rounded-[2.5rem] pointer-events-none"></div>
${renderMedia(heroImg, 'relative max-w-full h-auto object-contain rounded-2xl border border-outline-variant/20 shadow-sm bg-white', 'hero media')}
</div>
</div>
</div>
</section>

<!-- Partners Section -->
<section class="w-full border-y border-outline-variant/20 bg-surface">
  <div class="max-w-container-max mx-auto py-12 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-8 opacity-70">
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
<section data-section="video" id="about-video" class="w-full bg-surface section-hover cursor-pointer">
  <div class="max-w-container-max mx-auto py-20 px-margin-mobile md:px-margin-desktop">
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
  </div>
</section>

<!-- Smart Analytics Section -->
<section data-section="about" id="about-analytics" class="w-full transition-all duration-300 section-hover cursor-pointer" style="background-color: ${aboutBg}; color: ${aboutTextColor};">
<div class="max-w-container-max mx-auto py-24 px-margin-mobile md:px-margin-desktop">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-stack-xl items-center">
<div class="relative h-[450px] bg-surface-container-lowest rounded-3xl border border-outline-variant/50 shadow-xl overflow-hidden">
  ${aboutImg
    ? renderMedia(aboutImg, 'w-full h-full object-cover', 'about')
    : `<div class="w-full h-full flex flex-col items-center justify-center p-8">
        <h3 class="text-headline-md font-headline-md text-on-surface mb-6">${analyticsTitle}</h3>
        <div class="flex items-end gap-4 h-40 w-full px-4">
          <div class="flex-1 rounded-t-xl transition-all duration-500" style="height: ${bar1}%; background-color: ${analyticsColor}; opacity: 0.35;"></div>
          <div class="flex-1 rounded-t-xl transition-all duration-500" style="height: ${bar2}%; background-color: ${analyticsColor}; opacity: 0.55;"></div>
          <div class="flex-1 rounded-t-xl transition-all duration-500" style="height: ${bar3}%; background-color: ${analyticsColor}; opacity: 0.75;"></div>
          <div class="flex-1 rounded-t-xl transition-all duration-500" style="height: ${bar4}%; background-color: ${analyticsColor}; opacity: 0.90;"></div>
          <div class="flex-1 rounded-t-xl transition-all duration-500" style="height: ${bar5}%; background-color: ${analyticsColor}; opacity: 1.00;"></div>
        </div>
      </div>`
  }
</div>
<div class="flex flex-col gap-stack-md">
<h2 class="text-headline-lg font-headline-lg text-on-surface">${aboutTitle}</h2>
<p class="text-body-lg font-body-lg text-on-surface-variant mb-4">${aboutSubtitle}</p>
</div>
</div>
</div>
</section>

<!-- Complete Academic Ecosystem (Bento Grid) -->
<section data-section="features" class="w-full bg-surface-container-low transition-all duration-300 section-hover cursor-pointer" style="${featuresBg ? `background-color: ${featuresBg};` : ''} ${featuresTextColor ? `color: ${featuresTextColor};` : ''}">
<div class="max-w-container-max mx-auto py-24 px-margin-mobile md:px-margin-desktop">
<div class="text-center mb-20">
<h2 class="text-headline-lg font-headline-lg text-on-surface mb-stack-sm">${featuresTitle}</h2>
<p class="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">${featuresSubtitle}</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter auto-rows-[280px]">
  ${featuresItems.map((item, idx) => {
    const isImg = item.icon && (item.icon.startsWith('http') || item.icon.includes('/') || item.icon.startsWith('data:'));
    const colSpan = idx === 0 || idx === featuresItems.length - 1 ? 'col-span-1 lg:col-span-2' : 'col-span-1';
    const colors = ['primary', 'secondary', 'tertiary', 'primary'];
    const color = colors[idx % colors.length];
    const iconEl = isImg
      ? `<img src="${item.icon}" alt="${item.title}" class="w-14 h-14 rounded-2xl object-cover border border-outline-variant/30" />`
      : `<div class="w-14 h-14 rounded-2xl bg-${color}/10 flex items-center justify-center mb-stack-md group-hover:scale-110 group-hover:bg-${color} transition-all duration-300"><span class="material-symbols-outlined text-${color} group-hover:text-on-${color} text-[32px] transition-colors">${item.icon || 'star'}</span></div>`;
    return `
    <div data-section="features" data-index="${idx}" class="${colSpan} row-span-1 bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-stack-lg shadow-sm hover:shadow-xl hover:border-${color}/50 hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between overflow-hidden relative">
      <div class="relative z-10">
        ${iconEl}
        <h3 class="text-headline-md font-headline-md text-on-surface mb-3 mt-3">${item.title || ''}</h3>
        <p class="text-body-md font-body-md text-on-surface-variant max-w-md">${item.description || ''}</p>
      </div>
    </div>`;
  }).join('')}
</div>
</div>
</section>

<!-- Stats Section -->
<section class="w-full bg-primary/5">
  <div class="max-w-container-max mx-auto py-20 px-margin-mobile md:px-margin-desktop">
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
  </div>
</section>

<!-- 2. Academic Management (Stats / Pricing items) -->
<section data-section="pricing" id="pricing-plans" class="w-full border-y border-outline-variant/30 bg-surface transition-all duration-300 section-hover cursor-pointer" style="background-color: ${pricingBg}; color: ${pricingTextColor};">
<div class="max-w-container-max mx-auto py-24 px-margin-mobile md:px-margin-desktop">
<div class="text-center mb-10">
  <h3 class="text-headline-md font-headline-md text-on-surface mb-2">${pricingTitle}</h3>
  <p class="text-xs text-slate-500 font-bold">${pricingSubtitle}</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-outline-variant/50 text-center">
  ${pricingItems.map((item, idx) => `
    <div data-section="pricing" data-index="${idx}" class="py-stack-md flex flex-col items-center justify-center group cursor-pointer hover:scale-105 transition-all">
      <span class="material-symbols-outlined text-primary text-[48px] mb-4 opacity-80 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300">
        ${idx === 0 ? 'school' : idx === 1 ? 'library_books' : 'check_circle'}
      </span>
      <h4 class="text-display-lg font-display-lg text-on-surface">${item.price}</h4>
      <p class="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mt-2">${item.title}</p>
    </div>
  `).join('')}
</div>
</div>
</section>

<!-- Testimonials Section -->
<section data-section="testimonials" id="testimonials" class="w-full bg-surface-container/50 border-y border-outline-variant/30 section-hover cursor-pointer" style="background-color: ${pricingBg}; color: ${pricingTextColor};">
<div class="max-w-container-max mx-auto py-24 px-margin-mobile md:px-margin-desktop">
<div class="text-center mb-16">
  <span class="text-label-md font-label-md text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">آراء وقصص النجاح</span>
  <h2 class="text-headline-lg font-headline-lg text-on-surface mt-4 mb-2">${testimonialsTitle}</h2>
  <p class="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">${testimonialsSubtitle}</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
  <!-- Card 1 -->
  <div data-testimonial="0" class="bg-surface border border-outline-variant/50 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
    <p class="text-body-md font-body-md text-on-surface-variant italic mb-8">"${testimonial1Text}"</p>
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-primary text-sm">
        ${testimonial1Author.slice(0, 2)}
      </div>
      <div>
        <h4 class="font-extrabold text-sm text-on-surface">${testimonial1Author}</h4>
        <p class="text-xs text-slate-500 font-bold">${testimonial1Role}</p>
      </div>
    </div>
  </div>
  <!-- Card 2 -->
  <div data-testimonial="1" class="bg-surface border border-outline-variant/50 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
    <p class="text-body-md font-body-md text-on-surface-variant italic mb-8">"${testimonial2Text}"</p>
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-primary text-sm">
        ${testimonial2Author.slice(0, 2)}
      </div>
      <div>
        <h4 class="font-extrabold text-sm text-on-surface">${testimonial2Author}</h4>
        <p class="text-xs text-slate-500 font-bold">${testimonial2Role}</p>
      </div>
    </div>
  </div>
  <!-- Card 3 -->
  <div data-testimonial="2" class="bg-surface border border-outline-variant/50 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
    <p class="text-body-md font-body-md text-on-surface-variant italic mb-8">"${testimonial3Text}"</p>
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-primary text-sm">
        ${testimonial3Author.slice(0, 2)}
      </div>
      <div>
        <h4 class="font-extrabold text-sm text-on-surface">${testimonial3Author}</h4>
        <p class="text-xs text-slate-500 font-bold">${testimonial3Role}</p>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<!-- Newsletter Section -->
<section data-section="footer" id="newsletter" class="w-full bg-surface-container border-y border-outline-variant/30 section-hover cursor-pointer">
  <div class="max-w-container-max mx-auto py-20 px-margin-mobile md:px-margin-desktop">
    <div class="max-w-3xl mx-auto text-center space-y-8">
      <span class="material-symbols-outlined text-primary text-[48px] fill">mail</span>
      <h2 class="text-headline-lg font-headline-lg text-on-surface">${newsletterTitle}</h2>
      <p class="text-body-lg font-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">${newsletterDesc}</p>
      <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input type="email" placeholder="أدخل بريدك الإلكتروني هنا" class="flex-grow px-6 py-4 rounded-full border border-outline-variant bg-white text-on-surface outline-none focus:border-primary transition-colors text-sm" />
        <button class="bg-primary hover:bg-primary-container text-on-primary text-label-md font-label-md px-8 py-4 rounded-full shadow-md transition-colors duration-300 shrink-0">${newsletterBtnText}</button>
      </div>
    </div>
  </div>
</section>

<!-- Final CTA -->
<section data-section="contact" class="py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center mb-16 transition-all duration-300 section-hover cursor-pointer rounded-3xl">
<div class="max-w-4xl mx-auto bg-primary/5 border border-primary/20 rounded-[3rem] p-stack-lg md:p-24 relative overflow-hidden shadow-2xl">
<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-surface/0 to-surface/0"></div>
<div class="relative z-10">
<span class="material-symbols-outlined text-primary text-[48px] mb-6">rocket_launch</span>
<h2 class="text-display-lg font-display-lg text-on-surface mb-stack-md">${contactTitle}</h2>
<p class="text-body-lg font-body-lg text-on-surface-variant mb-stack-xl max-w-2xl mx-auto leading-relaxed">
                        ${contactDesc}
                    </p>
<div class="flex flex-col sm:flex-row items-center justify-center gap-stack-md">
<button class="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary text-label-md font-label-md px-10 py-5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            ${contactBtnText}
                        </button>
<button class="w-full sm:w-auto bg-surface hover:bg-surface-container text-on-surface border border-outline-variant text-label-md font-label-md px-10 py-5 rounded-full hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
                            طلب عرض توضيحي
                        </button>
</div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer data-section="footer" id="footer-bar" class="w-full py-stack-lg px-margin-mobile md:px-margin-desktop mt-stack-lg border-t border-outline-variant/30 bg-surface-container-lowest transition-all duration-300 section-hover cursor-pointer" style="background-color: ${footerBg}; color: ${footerTextColor};">
<div class="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-stack-md">
<div class="flex items-center gap-3">
<span class="text-headline-md font-headline-md text-primary font-bold" style="color: ${footerTextColor};">${navbarTitle}</span>
<span class="text-body-md font-body-md text-on-surface-variant text-sm mr-4">${footerText}</span>
</div>
<nav class="flex items-center gap-stack-lg">
<a class="text-on-surface-variant text-body-md font-body-md hover:text-primary transition-colors duration-200" href="#">سياسة الخصوصية</a>
<a class="text-on-surface-variant text-body-md font-body-md hover:text-primary transition-colors duration-200" href="#">شروط الخدمة</a>
<a class="text-on-surface-variant text-body-md font-body-md hover:text-primary transition-colors duration-200" href="#">اتصل بالدعم</a>
</nav>
</div>
</footer>
<script>
        // Mobile Drawer Toggle
        const menuBtn = document.querySelector('.md\\\\:hidden');
        const drawer = document.getElementById('mobile-drawer');
        const drawerContent = document.getElementById('drawer-content');
        
        if (menuBtn && drawer && drawerContent) {
          menuBtn.addEventListener('click', () => {
              drawer.classList.remove('hidden');
              setTimeout(() => {
                  drawerContent.classList.remove('translate-x-full');
              }, 10);
          });

          drawer.addEventListener('click', (e) => {
              if (e.target === drawer) {
                  drawerContent.classList.add('translate-x-full');
                  setTimeout(() => {
                      drawer.classList.add('hidden');
                  }, 300);
              }
          });
        }

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
