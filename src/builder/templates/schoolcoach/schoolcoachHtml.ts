import { TemplateContent } from '../academic/academicHtml';

export const getSchoolCoachHtml = (content: TemplateContent, isEditing: boolean = false) => {
  const navbarTitle = content?.navbar?.title || (content?.navbar as any)?.name || 'الأستاذ أحمد محمد';
  const navbarBg = content?.navbar?.bgColor || (content?.navbar as any)?.bg_color || '#0a1628';
  const navbarText = content?.navbar?.textColor || (content?.navbar as any)?.text_color || '#ffffff';

  const heroSubtitle = content?.hero?.subtitle || 'معلم الرياضيات القدير';
  const heroTitle = content?.hero?.title || 'تعلم بذكاء. <br/><span class="text-[var(--color-gold-500)]">اضمن تفوقك الدراسي.</span>';
  const heroDesc = content?.hero?.description || 'مناهج دراسية مبسطة وأساليب تعليمية حديثة تساعدك على فهم المادة بعمق وتحقيق الدرجة الكاملة في امتحاناتك.';
  const heroBtnText = content?.hero?.buttonText || (content?.hero as any)?.button_text || 'احجز مكانك الآن';
  const heroBtnLink = content?.hero?.buttonLink || (content?.hero as any)?.button_link || '#';
  const heroSecondaryBtnText = content?.hero?.secondaryButtonText || (content?.hero as any)?.secondary_button_text || (content?.hero as any)?.demoButtonText || 'اعرف المزيد عنا';
  const heroSecondaryBtnLink = content?.hero?.secondaryButtonLink || (content?.hero as any)?.secondary_button_link || (content?.hero as any)?.demoButtonLink || '#about';
  const heroImg = content?.hero?.image || (content?.hero as any)?.img || (content?.hero as any)?.video || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdn5I4iyCWiaDe9m4F8v8n_X00tPqBgqXH4hbDxxtEpcQGhs3Iv7ye36iLKGCPaYsSeLuQ6Q56ZRbKBk10dy_efgKLS3zHuPJjJmYL6JtPlCiByhhruLtE_z5QnQirZ362M0sgpMps7B8icOJUUVS6t_6GJ1K0xma8arDq0yEal-eRoeAXPmexe9Vlvhif39sPxgQQGgyuqPwrz1R2REpb3TQmQAfrbC-2IMbqMBAUhDDImR-r8q5cEQ';
  const heroBg = content?.hero?.backgroundColor || (content?.hero as any)?.background_color || (content?.hero as any)?.bg_color || '#0a1628';
  const heroTextColor = content?.hero?.textColor || (content?.hero as any)?.text_color || '#ffffff';

  const aboutTitle = content?.about?.title || 'عن الأستاذ أحمد';
  const aboutSubtitle = content?.about?.subtitle || 'خبرة تزيد عن ١٠ سنوات في تدريس مناهج الرياضيات للمرحلة الثانوية. نعتمد على الفهم والتحليل وتدريب الطالب على أنماط الامتحانات المختلفة لضمان الثقة والتميز.';
  const aboutImg = content?.about?.image || (content?.about as any)?.img || (content?.about as any)?.video || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsvCKkFFgnTqd7h7Fw_WOHLv_-bXegAz36jnJ-dSBDWKiA81BP1TWumr1WnjULNWm_0CcbVBTge22QX2XN-cBPri3M3xbxSbAGqLIcFlI4XbbEacN9CKm1uRjQqkRnAfjumbe4cbh_txOhsTy_-6Eph6WwWNqlfr7j35tkwUU103Z7NEEpLCcfSvulZ4QoKpglkx4KRxtXU9TRhBm3eChxdvC43k04A-fnMk-IjFugUk9FdZ1nyfYQsA';

  const featuresTitle = content?.features?.title || 'المواد الدراسية';
  const featuresSubtitle = content?.features?.subtitle || 'شرح وافٍ وتطبيقات عملية لكل فرع من فروع الرياضيات لضمان الاستيعاب الشامل.';
  const featuresItems = content?.features?.items || [
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
  ];

  const pricingTitle = content?.pricing?.title || 'المجموعات الدراسية المتاحة';
  const pricingSubtitle = content?.pricing?.subtitle || 'احجز مكانك في إحدى مجموعاتنا التفاعلية المباشرة.';
  const pricingItems = content?.pricing?.items || [
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
  ];

  const faqTitle = content?.faq?.title || 'الأسئلة الشائعة حول المنهج';
  const faqItems = content?.faq?.items || [
    { question: 'أ.د. محمد الشمري - ولي أمر طالبتين', answer: 'الأستاذ أحمد يبسط الرياضيات بطريقة رائعة، ابنتي حصلت على الدرجة النهائية بفضله.' },
    { question: 'رنا عبدالله - طالبة طب هندسي', answer: 'التمارين والامتحانات المكثفة ساعدتني جداً في التحصيلي والقدرات.' },
    { question: 'م. علي عمر - طالب سابق', answer: 'تأسست في الرياضيات على يد الأستاذ أحمد، والآن أدرس هندسة البرمجيات بسهولة.' }
  ];

  const contactTitle = content?.contact?.title || 'ابدأ رحلة تفوقك اليوم';
  const contactDesc = content?.contact?.description || 'انضم لأكثر من ١٠,٠٠٠ طالب وطالبة حققوا أحلامهم الدراسية معنا.';

  const footerText = content?.footer?.text || '© ٢٠٢٦ الأستاذ أحمد محمد. جميع الحقوق محفوظة.';

  const videoTag = (content?.about as any)?.videoTag || 'شاهد وتعلّم';
  const videoTitle = (content?.about as any)?.videoTitle || 'تعرف على فلسفتنا التعليمية في ٣ دقائق';
  const videoDesc = (content?.about as any)?.videoDesc || 'نقدم لك جولة سريعة داخل منصتنا التعليمية. نوضح فيها طريقة تتبع الدروس المتقدمة، والتفاعل مع المرشدين، والوصول لأوراق العمل والامتحانات الذكية.';
  const videoLink = (content?.about as any)?.videoLink || (content?.about as any)?.videoImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop';

  const newsletterTitle = (content?.footer as any)?.newsletterTitle || 'اشترك في نشرتنا المعرفية';
  const newsletterDesc = (content?.footer as any)?.newsletterDesc || 'احصل على أحدث المقالات التحليلية، والمناهج الجديدة، والماستركلاسز الحصرية مباشرة في بريدك الإلكتروني أسبوعياً.';
  const newsletterBtnText = (content?.footer as any)?.newsletterBtnText || 'اشترك الآن';

  const testimonialsTitle = (content?.faq as any)?.testimonialsTitle || 'آراء وقصص نجاح الطلاب';
  const testimonialsSubtitle = (content?.faq as any)?.testimonialsSubtitle || 'ماذا يقول أولياء الأمور وطلابنا بعد تحقيق الدرجة الكاملة والتفوق في امتحاناتهم.';
  const testimonialsBg = (content?.pricing as any)?.testimonialsBg || (content?.pricing as any)?.testimonials_bg || (content?.faq as any)?.testimonialsBg || '';
  const testimonialsTextColor = (content?.pricing as any)?.testimonialsTextColor || (content?.pricing as any)?.testimonials_text_color || (content?.faq as any)?.testimonialsTextColor || '';

  return `<!DOCTYPE html>
<html class="light" dir="rtl" lang="ar">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>${navbarTitle} - معلم القدير</title>
  <!-- Material Symbols -->
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
  <!-- Google Fonts for Cairo & Tajawal -->
  <link href="https://fonts.googleapis.com" rel="preconnect"/>
  <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&amp;family=Tajawal:wght@400;500;700;800&amp;display=swap" rel="stylesheet"/>
  <!-- Tailwind Config -->
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "navy-950": "#10161f",
                    "navy-900": "#161d29",
                    "navy-800": "#232c3d",
                    "navy-700": "#2a3648",
                    "gold-500": "#f0b429",
                    "gold-600": "#d99a1c",
                    "gold-100": "#f5e6b8",
                    "white": "#ffffff",
                    "offwhite": "#ffffff",
                    "gray-100": "#f7f8fa",
                    "gray-400": "#aab2c0",
                    "gray-600": "#5b6472",
                    "gray-900": "#1b2230",
                    "star": "#f5b301",
                    "primary": "#f0b429"
            },
            "borderRadius": {
                    "DEFAULT": "12px",
                    "lg": "16px",
                    "xl": "20px",
                    "full": "999px"
            },
            "spacing": {
                    "margin-mobile": "16px",
                    "container-max": "1200px",
                    "margin-desktop": "40px",
                    "gutter": "24px",
                    "stack-sm": "12px",
                    "stack-md": "24px",
                    "stack-lg": "48px",
                    "stack-xl": "80px"
            },
            "fontFamily": {
                    "body-lg": ["Cairo", "sans-serif"],
                    "headline-md": ["Cairo", "sans-serif"]
            }
          },
        },
      }
  </script>
  <style>
        :root {
            --color-navy-950: #10161f;
            --color-navy-900: #161d29;
            --color-navy-800: #232c3d;
            --color-navy-700: #2a3648;
            --color-gold-500: #f0b429;
            --color-gold-600: #d99a1c;
            --color-gold-100: #f5e6b8;
            --color-white: #ffffff;
            --color-offwhite: #ffffff;
            --color-gray-100: #f7f8fa;
            --color-gray-400: #aab2c0;
            --color-gray-600: #5b6472;
            --color-gray-900: #1b2230;
            --color-star: #f5b301;
        }
        body {
            font-family: 'Cairo', 'Tajawal', sans-serif;
            background-color: var(--color-white);
            color: var(--color-gray-600);
            line-height: 1.7;
        }
        .btn-primary {
            background: var(--color-gold-500);
            color: var(--color-navy-950);
            font-weight: 700;
            padding: 14px 32px;
            border-radius: 999px;
            border: none;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        .btn-primary:hover {
            background: var(--color-gold-600);
            transform: translateY(-2px);
        }
        .btn-secondary {
            background: transparent;
            color: var(--color-white);
            border: 1.5px solid var(--color-white);
            padding: 14px 32px;
            border-radius: 999px;
            font-weight: 600;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        .btn-secondary:hover {
            background: var(--color-white);
            color: var(--color-navy-950);
            transform: translateY(-2px);
        }
        .card-dark {
            background: var(--color-navy-800);
            border: 1px solid var(--color-navy-700);
            border-radius: 16px;
            padding: 24px;
            color: var(--color-white);
            text-align: center;
            transition: all 0.3s ease;
        }
        .card-dark:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 30px rgba(10, 22, 40, 0.25);
        }
        .card-light {
            background: var(--color-white);
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(10, 22, 40, 0.08);
            padding: 20px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .card-light:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 36px rgba(10, 22, 40, 0.12);
        }
        .section-title {
            font-size: 32px;
            font-weight: 800;
            color: var(--color-gray-900);
            position: relative;
            display: inline-block;
            margin-bottom: 24px;
        }
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background-color: var(--color-gold-500);
            border-radius: 2px;
        }
        .section-title.dark-section-title {
            color: var(--color-white);
        }
        ${isEditing ? `
        .section-hover:hover {
            box-shadow: 0 0 0 2px var(--color-gold-500) !important;
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
            box-shadow: 0 30px 60px -15px rgba(212, 167, 44, 0.35);
        }
        /* Chalkboard scribble texture effect */
        .hero-scribble {
            position: relative;
            background: linear-gradient(100deg, rgba(16,22,31,.97) 15%, rgba(16,22,31,.75) 55%, rgba(16,22,31,.4) 100%), radial-gradient(ellipse at 75% 30%, #2a3648 0%, var(--color-navy-950) 70%) !important;
            overflow: hidden;
        }
        .hero-scribble::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(115deg, rgba(255,255,255,.025) 0 2px, transparent 2px 40px), repeating-linear-gradient(25deg, rgba(255,255,255,.02) 0 1px, transparent 1px 34px);
            pointer-events: none;
            z-index: 1;
        }
        .deco-arc {
            position: absolute;
            left: -60px;
            bottom: -40px;
            width: 340px;
            height: 340px;
            border: 2px dashed rgba(240,180,41,.28);
            border-radius: 42% 58% 61% 39% / 47% 44% 56% 53%;
            pointer-events: none;
            z-index: 1;
        }
        .eyebrow-line {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: var(--color-gold-500);
            font-weight: 700;
            font-size: 0.95rem;
            letter-spacing: 0.02em;
            margin-bottom: 18px;
            position: relative;
        }
        .eyebrow-line::before {
            content: "";
            width: 24px;
            height: 2px;
            background: var(--color-gold-500);
            display: inline-block;
        }
        .hero-curve {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -1px;
            line-height: 0;
            z-index: 10;
        }
        .hero-curve svg {
            width: 100%;
            height: 110px;
            display: block;
        }
        .hero-curve path {
            fill: var(--color-white);
        }
        @media (max-width: 700px) {
            .hero-curve svg {
                height: 70px;
            }
            .deco-arc {
                width: 220px;
                height: 220px;
            }
        }
  </style>
</head>
<body class="antialiased select-none">

  <!-- 1. Sticky Nav Bar -->
  <header data-section="navbar" class="bg-[var(--color-navy-950)] border-b border-navy-700 shadow-lg w-full sticky top-0 z-50 transition-all duration-300 section-hover cursor-pointer" style="background-color: ${navbarBg}; color: ${navbarText};">
    <div class="flex items-center justify-between px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto h-24">
      <div class="flex items-center gap-4 hover:scale-95 transition-transform duration-200 cursor-pointer">
        <span class="material-symbols-outlined text-[var(--color-gold-500)] text-[32px]">school</span>
        <span class="text-[22px] font-extrabold" style="color: ${navbarText};">${navbarTitle}</span>
      </div>
      <nav class="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400">
        <a class="hover:text-[var(--color-gold-500)] transition-colors" href="/" ${isEditing ? '' : 'target="_parent"'}>الرئيسية</a>
        <a class="hover:text-[var(--color-gold-500)] transition-colors" href="/courses" ${isEditing ? '' : 'target="_parent"'}>الدورات</a>
        <a class="hover:text-[var(--color-gold-500)] transition-colors" href="/bags" ${isEditing ? '' : 'target="_parent"'}>الحقائب</a>
        <a class="hover:text-[var(--color-gold-500)] transition-colors" href="/#about" ${isEditing ? '' : 'target="_parent"'}>عن المدرس</a>
      </nav>
      <div>
        <a href="#contact" class="btn-primary text-xs py-3.5 px-6 block text-center">${heroBtnText}</a>
      </div>
    </div>
  </header>

  <main class="w-full">
    
    <!-- 2. Hero Section -->
    <section data-section="hero" id="hero" class="hero-scribble relative pt-24 pb-44 px-margin-mobile md:px-margin-desktop select-none section-hover cursor-pointer" style="color: ${heroTextColor || '#ffffff'};">
      <div class="deco-arc animate-[spin_120s_linear_infinite]"></div>
      <div class="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div class="w-full lg:w-1/2 flex flex-col items-start gap-6 z-10 text-right">
          <span class="eyebrow-line">${heroSubtitle}</span>
          <h1 class="text-[44px] md:text-[52px] font-black leading-tight" style="${heroTextColor ? `color: ${heroTextColor};` : ''}">
            ${heroTitle}
          </h1>
          <p class="text-body-lg max-w-xl leading-relaxed mt-2" style="${heroTextColor ? `color: ${heroTextColor}; opacity: 0.85;` : 'color: #9ca3af;'}">
            ${heroDesc}
          </p>
          <div class="flex flex-wrap items-center gap-4 pt-6">
            <a data-hero-btn="primary" href="${(() => {
              if (!heroBtnLink || heroBtnLink === '#') return '#contact';
              const trimmed = heroBtnLink.trim();
              if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed;
              return `#${trimmed}`;
            })()}" ${heroBtnLink?.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-primary text-sm">${heroBtnText}</a>
            <a data-hero-btn="secondary" href="${(() => {
              if (!heroSecondaryBtnLink || heroSecondaryBtnLink === '#') return '#about';
              const trimmed = heroSecondaryBtnLink.trim();
              if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed;
              return `#${trimmed}`;
            })()}" ${heroSecondaryBtnLink?.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-secondary text-sm">${heroSecondaryBtnText}</a>
          </div>
        </div>
        
        <div class="w-full lg:w-1/2 flex items-center justify-center group p-4">
          <div class="relative w-full max-w-[450px]">
            <!-- Layered shape effect offset -->
            <div class="absolute inset-0 border-2 border-[var(--color-gold-500)] rounded-3xl translate-x-4 translate-y-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <img class="relative max-w-full h-auto object-cover rounded-3xl border border-navy-700 bg-navy-900 shadow-2xl special-image-hover" src="${heroImg}"/>
          </div>
        </div>
      </div>
      <!-- Curved bottom separator -->
      <div class="hero-curve">
        <svg viewBox="0 0 1440 110" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,110 L0,60 C 240,10 480,90 720,55 C 960,20 1200,95 1440,45 L1440,110 Z"></path>
        </svg>
      </div>
    </section>

    <!-- Partners Section -->
    <section class="py-12 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto border-y border-gray-100 my-16 opacity-80">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <span class="text-xs font-bold text-gray-600 tracking-wider text-center md:text-right shrink-0">معتمدون لدى جهات رائدة عالمياً:</span>
        <div class="flex flex-wrap items-center justify-center gap-12 text-gray-400 font-bold text-sm">
          <div class="flex items-center gap-2 hover:text-[var(--color-gold-500)] transition-colors cursor-pointer"><span class="material-symbols-outlined text-[24px]">school</span> ACADEMY</div>
          <div class="flex items-center gap-2 hover:text-[var(--color-gold-500)] transition-colors cursor-pointer"><span class="material-symbols-outlined text-[24px]">globe</span> GLOBAL</div>
          <div class="flex items-center gap-2 hover:text-[var(--color-gold-500)] transition-colors cursor-pointer"><span class="material-symbols-outlined text-[24px]">verified</span> ISO CERTIFIED</div>
          <div class="flex items-center gap-2 hover:text-[var(--color-gold-500)] transition-colors cursor-pointer"><span class="material-symbols-outlined text-[24px]">terminal</span> TECH LAB</div>
        </div>
      </div>
    </section>

    <!-- 3. About Section -->
    <section id="about-analytics" data-section="about" class="py-24 px-margin-mobile md:px-margin-desktop bg-[var(--color-offwhite)] mb-20 section-hover cursor-pointer">
      <div class="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="flex justify-center">
          <div class="relative w-full max-w-[400px] aspect-square rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] overflow-hidden border-2 border-[var(--color-gold-500)] shadow-xl bg-white">
            <img class="w-full h-full object-cover" src="${aboutImg}" alt="About Teacher"/>
          </div>
        </div>
        <div class="flex flex-col gap-6 text-right">
          <h2 class="section-title text-right after:right-0 after:left-auto">${aboutTitle}</h2>
          <p class="text-body-lg text-gray-600 leading-relaxed">${aboutSubtitle}</p>
          
          <!-- Stat/Credential Badges -->
          <div class="flex flex-wrap gap-3 mt-4">
            <span class="px-4 py-2 border border-navy-700/10 bg-white text-[var(--color-navy-950)] rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-[var(--color-gold-500)]">history_edu</span> ١٠+ سنوات خبرة
            </span>
            <span class="px-4 py-2 border border-navy-700/10 bg-white text-[var(--color-navy-950)] rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-[var(--color-gold-500)]">school</span> مناهج الثانوية العامة
            </span>
            <span class="px-4 py-2 border border-navy-700/10 bg-white text-[var(--color-navy-950)] rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-[var(--color-gold-500)]">assignment</span> جميع المراحل الدراسية
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Video Intro Section -->
    <section data-section="video" id="about-video" class="py-20 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto mb-20 section-hover cursor-pointer">
      <div class="bg-[var(--color-navy-900)] border border-navy-700/40 rounded-3xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-white">
        <div class="space-y-6">
          <span class="text-xs font-bold text-[var(--color-gold-500)] bg-[var(--color-gold-500)]/10 px-4 py-1.5 rounded-full border border-[var(--color-gold-500)]/20">${videoTag}</span>
          <h2 class="text-3xl font-extrabold leading-tight">${videoTitle}</h2>
          <p class="text-body-lg text-gray-400 leading-relaxed">${videoDesc}</p>
          <div class="flex items-center gap-4 text-[var(--color-gold-500)] font-bold">
            <span class="material-symbols-outlined text-[32px] animate-bounce">play_arrow</span>
            <span>اضغط على المشغل لمشاهدة العرض التعريفي</span>
          </div>
        </div>
        <div class="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-navy-700/50 flex items-center justify-center group cursor-pointer">
          <div class="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105" style="background-image: url('${videoLink}');"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          <div class="relative z-10 w-20 h-20 rounded-full bg-[var(--color-gold-500)] text-[var(--color-navy-950)] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <span class="material-symbols-outlined text-[40px] fill">play_arrow</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Subjects Grid ("المواد الدراسية") -->
    <section id="subjects" data-section="features" class="py-24 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto mb-20 transition-all duration-300 section-hover cursor-pointer">
      <div class="text-center mb-16">
        <h2 class="section-title text-center">${featuresTitle}</h2>
        <p class="text-body-lg text-gray-600 max-w-2xl mx-auto">${featuresSubtitle}</p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${featuresItems.map((item, idx) => `
          <!-- Subject Card (card-light) -->
          <div data-section="features" data-index="${idx}" class="card-light flex flex-col justify-between group">
            <div class="relative rounded-xl overflow-hidden aspect-[4/3] mb-4">
              <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${item.icon}" alt="${item.title}"/>
              <!-- Dark overlay/caption -->
              <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/90 via-[var(--color-navy-950)]/40 to-transparent flex items-end p-4">
                <span class="text-white text-xs font-bold">رياضيات متقدمة</span>
              </div>
            </div>
            <div class="space-y-2">
              <h3 class="text-[18px] font-extrabold text-[var(--color-gray-900)]">${item.title}</h3>
              <p class="text-xs text-gray-600 leading-relaxed line-clamp-3">${item.description}</p>
            </div>
            <div class="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
              <a href="#contact" class="text-xs font-extrabold text-[var(--color-gold-500)] hover:text-[var(--color-gold-600)] transition-colors flex items-center gap-1">
                اعرف المزيد <span class="material-symbols-outlined text-[16px] rtl-icon">arrow_forward</span>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 5. Groups/Cohorts Grid ("المجموعات الدراسية") -->
    <section id="groups" data-section="pricing" class="py-24 px-margin-mobile md:px-margin-desktop bg-[var(--color-gray-100)] border-y border-gray-200/50 mb-20 section-hover cursor-pointer">
      <div class="max-w-[1200px] mx-auto">
        <div class="text-center mb-16">
          <h2 class="section-title text-center">${pricingTitle}</h2>
          <p class="text-body-lg text-gray-600 max-w-2xl mx-auto">${pricingSubtitle}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${pricingItems.map((item, idx) => {
            const days = item.features?.[0] || 'الأيام: غير محددة';
            const time = item.features?.[1] || 'الوقت: غير محدد';
            const type = item.features?.[2] || 'نوع الدراسة: تفاعلي';
            
            return `
              <!-- Cohort Card (card-dark) -->
              <div data-section="pricing" data-index="${idx}" class="card-dark flex flex-col justify-between">
                <div>
                  <h3 class="text-[20px] font-bold text-white mb-6 border-b border-navy-700 pb-4">${item.title}</h3>
                  <div class="space-y-4 text-right mb-8">
                    <div class="flex justify-between items-center text-sm border-b border-navy-700/50 pb-2">
                      <span class="text-gray-400">الجدول</span>
                      <span class="font-bold text-white">${days}</span>
                    </div>
                    <div class="flex justify-between items-center text-sm border-b border-navy-700/50 pb-2">
                      <span class="text-gray-400">التوقيت</span>
                      <span class="font-bold text-white">${time}</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-gray-400">نظام الفصل</span>
                      <span class="font-bold text-white">${type}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span class="block text-xs font-bold text-[var(--color-gold-500)] mb-4">${item.price}</span>
                  <a href="#contact" class="btn-primary block text-center w-full text-xs py-3.5">${heroBtnText}</a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>

    <!-- 6. Stats Band -->
    <section class="py-16 bg-[var(--color-navy-950)] text-white mb-20">
      <div class="max-w-[1200px] mx-auto grid grid-cols-3 gap-8 text-center">
        <div>
          <span class="block text-[36px] font-extrabold text-[var(--color-gold-500)]">١٠+</span>
          <span class="text-xs font-bold text-gray-400">سنوات من الخبرة والتميز</span>
        </div>
        <div>
          <span class="block text-[36px] font-extrabold text-[var(--color-gold-500)]">٥٠٠+</span>
          <span class="text-xs font-bold text-gray-400">طالب متميز سنوياً</span>
        </div>
        <div>
          <span class="block text-[36px] font-extrabold text-[var(--color-gold-500)]">٩٥٪+</span>
          <span class="text-xs font-bold text-gray-400">نسبة درجات التفوق</span>
        </div>
      </div>
    </section>

    <!-- 7. Testimonials ("آراء الطلاب") -->
    <section id="testimonials" data-section="testimonials" class="py-24 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto mb-20 section-hover cursor-pointer transition-all duration-300" style="${testimonialsBg ? `background-color: ${testimonialsBg};` : ''} ${testimonialsTextColor ? `color: ${testimonialsTextColor};` : ''}">
      <div class="text-center mb-16">
        <h2 class="section-title text-center">${testimonialsTitle}</h2>
        <p class="text-body-lg text-gray-600 max-w-2xl mx-auto">${testimonialsSubtitle}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${faqItems.map((item, idx) => `
          <!-- Testimonial Card (card-light) -->
          <div data-section="faq" data-index="${idx}" class="card-light flex flex-col justify-between cursor-pointer">
            <div>
              <!-- Star rating -->
              <div class="stars mb-4 text-[var(--color-star)] text-sm font-bold">★★★★★</div>
              <p class="text-body-md text-gray-600 italic leading-relaxed mb-6">"${item.answer}"</p>
            </div>
            <div class="flex items-center gap-3 border-t border-gray-100 pt-4">
              <div class="w-10 h-10 rounded-full bg-[var(--color-gold-500)]/20 text-[var(--color-gold-500)] flex items-center justify-center font-black text-sm">
                ${item.question.charAt(0)}
              </div>
              <div>
                <h4 class="font-extrabold text-xs text-[var(--color-gray-900)]">${item.question}</h4>
                <p class="text-[10px] text-gray-400 font-bold">شعبة علمي / تفوق كامل</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Newsletter Section -->
    <section data-section="footer" class="py-20 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto mb-20 bg-gray-100 border border-gray-200/50 rounded-3xl section-hover cursor-pointer">
      <div class="max-w-3xl mx-auto text-center space-y-6">
        <span class="material-symbols-outlined text-[var(--color-gold-500)] text-[48px] fill">mail</span>
        <h2 class="text-[32px] font-extrabold text-[var(--color-gray-900)]">${newsletterTitle}</h2>
        <p class="text-body-lg text-gray-600 max-w-xl mx-auto leading-relaxed">${newsletterDesc}</p>
        <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input type="email" placeholder="أدخل بريدك الإلكتروني هنا" class="flex-grow px-6 py-4 rounded-full border border-gray-300 bg-white text-gray-900 outline-none focus:border-[var(--color-gold-500)] transition-colors text-sm" />
          <button class="btn-primary text-xs py-4 px-8 shrink-0">${newsletterBtnText}</button>
        </div>
      </div>
    </section>

    <!-- 8. CTA Banner -->
    <section id="contact" data-section="contact" class="py-32 px-margin-mobile md:px-margin-desktop bg-[var(--color-navy-950)] text-white text-center mb-16 section-hover cursor-pointer">
      <div class="max-w-4xl mx-auto p-12 md:p-20 border border-navy-700 bg-navy-900 rounded-3xl relative overflow-hidden shadow-2xl">
        <span class="material-symbols-outlined text-[var(--color-gold-500)] text-[48px] mb-6">rocket_launch</span>
        <h2 class="text-[36px] font-extrabold text-white mb-6">${contactTitle}</h2>
        <p class="text-body-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          ${contactDesc}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://wa.me/201000000000" target="_blank" class="w-full sm:w-auto btn-primary text-sm flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">chat</span> تواصل عبر الواتساب للاستفسار
          </a>
        </div>
      </div>
    </section>

  </main>

  <!-- 9. Footer -->
  <footer data-section="footer" class="bg-[var(--color-navy-950)] text-gray-400 py-16 border-t border-navy-800 section-hover cursor-pointer">
    <div class="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-margin-mobile md:px-margin-desktop mb-12 text-right">
      <div class="space-y-4">
        <h4 class="text-white font-extrabold text-sm flex items-center gap-2">
          <span class="material-symbols-outlined text-[var(--color-gold-500)] text-[20px]">school</span> ${navbarTitle}
        </h4>
        <p class="text-xs leading-relaxed max-w-xs">
          مجموعات تقوية ومراجعات شاملة في الرياضيات للمرحلة الثانوية.
        </p>
      </div>
      <div>
        <h4 class="text-white font-extrabold text-sm mb-4">مواعيد العمل</h4>
        <p class="text-xs leading-relaxed">من السبت إلى الخميس: ١٠:٠٠ ص - ٩:٠٠ م</p>
      </div>
      <div>
        <h4 class="text-white font-extrabold text-sm mb-4">روابط سريعة</h4>
        <ul class="space-y-2 text-xs">
          <li><a href="#about" class="hover:text-[var(--color-gold-500)] transition-colors">عن المدرس</a></li>
          <li><a href="#subjects" class="hover:text-[var(--color-gold-500)] transition-colors">المواد الدراسية</a></li>
          <li><a href="#groups" class="hover:text-[var(--color-gold-500)] transition-colors">المجموعات الدراسية</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-extrabold text-sm mb-4">معلومات الاتصال</h4>
        <p class="text-xs leading-relaxed">البريد: info@ahmedmath.com</p>
        <p class="text-xs leading-relaxed mt-2">الهاتف: ٩٦٦٥٠٠٠٠٠٠٠٠+</p>
      </div>
    </div>
    
    <div class="max-w-[1200px] mx-auto border-t border-navy-800 pt-8 text-center px-margin-mobile md:px-margin-desktop">
      <p class="text-xs">${footerText}</p>
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
