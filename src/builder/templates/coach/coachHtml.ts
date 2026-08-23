import { TemplateContent } from '../academic/academicHtml';

export const getCoachHtml = (content: TemplateContent) => {
  // 1. Navbar
  const navbarTitle = content?.navbar?.title || 'Deep Knowledge Academy';
  const navbarBg = content?.navbar?.bgColor || '#faf9fb';
  const navbarText = content?.navbar?.textColor || '#4f378a';
  const navbarLogo = content?.navbar?.logo || '';
  const navBtnText = (content as any)?.navbar?.buttonText || (content as any)?.hero?.buttonText || 'ابدأ الآن';

  // 3. About
  const aboutTitle = content?.about?.title ?? 'عن الكوتش';
  const aboutSubtitle = content?.about?.subtitle;
  const aboutDesc = (content?.about as any)?.description !== undefined ? (content?.about as any)?.description : ((content?.about as any)?.bio ?? 'أهلاً بك! أنا مدربك في هذه الأكاديمية. أسعى لتقديم محتوى تعليمي عملي ومباشر يجمع بين الفهم النظري والتطبيق الفعلي، دون تعقيد أو حشو غير ضروري.');
  const rawBio = (content?.about as any)?.biography !== undefined ? (content?.about as any)?.biography : (content?.about as any)?.cvText;
  const aboutBio = rawBio !== undefined ? rawBio : 'هدفنا هنا ليس مجرد مشاهدة الدروس، بل التأكد من قدرتك على تطبيق كل معلومة تتعلمها، وتطوير مهاراتك خطوة بخطوة للحصول على نتائج ملموسة.';
  const aboutCoachTitle = (content?.about as any)?.coachTitle || 'مدرب وموجه تعليمي';
  const aboutImage = content?.about?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop';
  const aboutBg = content?.about?.backgroundColor || '#ffffff';
  const aboutTextColor = content?.about?.textColor || '#1a1c1d';
  const aboutTitleColor = (content?.about as any)?.titleColor || aboutTextColor || '#4f378a';

  // 2. Hero (using Biography / CV from About)
  const coachBiographyText = (content?.about as any)?.cvText || (content?.about as any)?.biography || (content?.about as any)?.bio || (content?.about as any)?.description;
  const heroSubtitle = content?.hero?.subtitle !== undefined ? content?.hero?.subtitle : 'أكاديمية التدريب الشخصي';
  const heroTitle = content?.hero?.title || 'تعلّم بوضوح. <br/> طوّر مهاراتك بثقة.';
  const heroDesc = coachBiographyText || content?.hero?.description || 'أكاديمية تعليمية وتدريبية متخصصة تحت إشراف الكوتش مباشرة. نقدم لك كورسات عملية ومبسطة تساعدك على بناء مهارات حقيقية والوصول لأهدافك بخطوات مدروسة.';
  const heroBtnText = content?.hero?.buttonText || 'استكشف الكورسات';
  const heroBtnLink = content?.hero?.buttonLink || '#courses';
  const heroSecondaryBtnText = (content?.hero as any)?.secondaryButtonText || 'تعرّف على الكوتش';
  const heroSecondaryBtnLink = (content?.hero as any)?.secondaryButtonLink || '#about';
  const heroCoachingMessage = (content?.hero as any)?.coachingMessage || (content?.hero as any)?.coachingCardText || 'توجيه شخصي 1-on-1 — التعلم الفعال يعتمد على الفهم العميق والتطبيق العملي المباشر.';
  const heroImage = content?.hero?.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop';
  const heroBg = content?.hero?.backgroundColor || '#faf9fb';
  const heroTextColor = content?.hero?.textColor || '#1a1c1d';
  const heroTitleColor = content?.hero?.titleColor;
  const heroSubtitleColor = content?.hero?.subtitleColor;
  const heroButtonColor = (content?.hero as any)?.buttonBgColor || content?.hero?.buttonColor || '#4f378a';
  const heroButtonTextColor = content?.hero?.buttonTextColor || '#ffffff';
  const heroSecondaryBtnBorderColor = (content?.hero as any)?.secondaryButtonBorderColor || '#4f378a';
  const heroSecondaryBtnTextColor = (content?.hero as any)?.secondaryButtonTextColor || '#4f378a';
  const heroCoachingCardBg = (content?.hero as any)?.coachingCardBgColor || '#ffffff';
  const heroCoachingCardText = (content?.hero as any)?.coachingCardTextColor || '#49454f';

  // 4. Features / Courses
  const featuresItems = content?.features?.items || [
    {
      id: 'course-analytical-thinking',
      icon: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
      title: 'أساسيات التفكير التحليلي وحل المشكلات',
      description: 'كورس عملي يغطي أدوات التحليل المنطقي واتخاذ القرارات بناءً على بيانات ومعلومات دقيقة.'
    },
    {
      id: 'course-planning-execution',
      icon: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
      title: 'منهجية التخطيط والتنفيذ العملي',
      description: 'تعلم كيفية تحويل الأهداف الكبيرة إلى خطط عمل تنفيذية ومتابعة الإنجاز بفاعلية.'
    },
    {
      id: 'course-content-writing',
      icon: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
      title: 'صياغة المحتوى وبناء الأفكار الاحترافية',
      description: 'دليل شامل لإتقان صياغة الأفكار وتوصيل الرسائل بوضوح وجاذبية للمستهدفين.'
    }
  ];

  // 5. Pricing
  const pricingTitle = content?.pricing?.title || 'الكورسات والدورات التدريبية';
  const pricingSubtitle = content?.pricing?.subtitle || 'دورات متخصصة ومصممة للتطبيق العملي.';
  const pricingItems = content?.pricing?.items || [
    {
      id: 'pricing-1',
      title: 'أساسيات التفكير التحليلي وحل المشكلات',
      price: 'كورس كامل',
      features: ['١٢ درس • ٦ أسابيع']
    },
    {
      id: 'pricing-2',
      title: 'منهجية التخطيط والتنفيذ العملي',
      price: 'كورس متقدم',
      features: ['١٥ درس • ٨ أسابيع']
    }
  ];

  // 7. Testimonials
  const testimonialsTitle = (content as any)?.testimonials?.title || 'آراء الطلاب والمشاركين';
  const testimonialsSubtitle = (content as any)?.testimonials?.subtitle || 'تجارب واقعية من متعلمين استفادوا من الكورسات والتوجيه المباشر.';
  const testimonialsItems = (content as any)?.testimonials?.items || [
    { id: 't1', name: 'محمد العتيبي', role: 'متعلم مستمر', initials: 'م.ع', review: 'الشرح كان واضحاً جداً، والأهم إني قدرت أطبق اللي اتعلمته عملياً في شغلي من أول أسبوع. التوجيه المباشر اختصر عليا وقت طويل.', rating: 5 },
    { id: 't2', name: 'ريم السعيد', role: 'مستفيدة من الكورسات', initials: 'ر.س', review: 'الكورس كان منظم بشكل ممتاز وبدون أي حشو. الكوتش يركز على التطبيق وعلى إعطاء أمثلة من واقع العمل اليومي.', rating: 5 },
    { id: 't3', name: 'طارق مصطفى', role: 'صانع محتوى', initials: 'ط.م', review: 'كنت أعاني من تشتت الأفكار عند التخطيط لمشروعي. من خلال التمارين والمتابعة، قدرت أصيغ الخطة بوضوح وأبدأ التنفيذ.', rating: 5 }
  ];
  const testimonialsBg = (content as any)?.testimonials?.backgroundColor || '#ffffff';
  const testimonialsTextColor = (content as any)?.testimonials?.textColor || '#1a1c1d';

  // 8. FAQ
  const faqTitle = content?.faq?.title || 'الأسئلة الشائعة';
  const faqItems = content?.faq?.items || [
    { question: 'هل الكورسات مناسبة للمبتدئين؟', answer: 'نعم، جميع الكورسات مصممة لتبدأ معك من الأساسيات وتتدرج خطوة بخطوة حتى المستوى المتقدم.' },
    { question: 'هل توجد متابعة أو إجابة على الاستفسارات؟', answer: 'نعم، يمكنك تقديم استفساراتك والحصول على توجيه وإجابة مباشرة من الكوتش.' },
    { question: 'هل يمكنني التعلم بالسرعة التي تناسبني؟', answer: 'بالتأكيد، المحتوى متاح لك دائماً لتشاهده وتطبقه بالسرعة المناسبة لك.' }
  ];

  // 9. Final CTA
  const ctaTitle = (content as any)?.finalCta?.title || (content as any)?.cta?.title || 'جاهز لتبدأ رحلة التعلم وتطوير مهاراتك؟';
  const ctaDesc = (content as any)?.finalCta?.description || (content as any)?.cta?.subtitle || 'اشترك في النشرة التعليمية ليصلك أحدث الكورسات والدروس المجانية والنصائح العملية مباشرة على بريدك.';
  const ctaPlaceholder = (content as any)?.finalCta?.emailPlaceholder || (content as any)?.cta?.placeholder || 'البريد الإلكتروني';
  const ctaBtnText = (content as any)?.finalCta?.buttonText || (content as any)?.cta?.buttonText || 'اشترك الآن';
  const ctaBg = (content as any)?.finalCta?.backgroundColor || (content as any)?.finalCta?.accentColor || (content as any)?.finalCta?.bg_color || '#faf9fb';
  const ctaTextColor = (content as any)?.finalCta?.textColor || (content as any)?.finalCta?.text_color || '#1a1c1d';
  const ctaTitleColor = (content as any)?.finalCta?.titleColor || (content as any)?.finalCta?.title_color || ctaTextColor;
  const ctaButtonBg = (content as any)?.finalCta?.buttonBgColor || (content as any)?.finalCta?.button_bg_color || '#4f378a';
  const ctaButtonTextColor = (content as any)?.finalCta?.buttonTextColor || (content as any)?.finalCta?.button_text_color || '#ffffff';

  // 10. Contact
  const contactTitle = content?.contact?.title || 'Deep Knowledge Academy';
  const contactDesc = content?.contact?.description || 'أكاديمية تعليمية وتدريبية متخصصة تحت إشراف الكوتش مباشرة لبناء مهارات عملية ملموسة.';
  const contactPhone = content?.contact?.phoneNumber || (content?.contact as any)?.phone || '';
  const contactEmail = (content?.contact as any)?.email || '';
  const contactWhatsapp = (content?.contact as any)?.whatsapp || content?.contact?.phoneNumber || (content?.contact as any)?.phone || '';
  const contactWhatsappText = (content?.contact as any)?.whatsappText || (content?.contact as any)?.whatsapp_text || (content?.contact as any)?.buttonText || 'تواصل واتساب';
  const contactEmailText = (content?.contact as any)?.emailText || (content?.contact as any)?.email_text || 'راسلنا عبر البريد';
  const contactPhoneText = (content?.contact as any)?.phoneText || (content?.contact as any)?.phone_text || 'اتصل بنا';

  // 11. Footer
  const footerText = content?.footer?.text || '© 2024 Deep Knowledge Academy. جميع الحقوق محفوظة.';
  const footerBg = content?.footer?.backgroundColor || (content?.footer as any)?.bg_color || '#faf9fb';
  const footerTextColor = content?.footer?.textColor || (content?.footer as any)?.text_color || '#1a1c1d';

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>${navbarTitle}</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&amp;family=IBM+Plex+Sans:wght@500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: "#4f378a",
                        "primary-hover": "#3c296b",
                        "primary-light": "#f4f0fa",
                        surface: "#ffffff",
                        background: "#faf9fb",
                        "on-surface": "#1a1c1d",
                        "on-surface-variant": "#49454f"
                    },
                    fontFamily: {
                        sans: ["Cairo", "sans-serif"]
                    }
                }
            }
        }
    </script>
<style>
        body {
            background-color: #faf9fb;
            font-family: 'Cairo', sans-serif;
            scroll-behavior: smooth;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .section-hover:hover {
            outline: 2px dashed #4f378a;
            outline-offset: -2px;
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #faf9fb;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
</style>
</head>
<body class="text-on-surface bg-background antialiased selection:bg-primary/20 selection:text-primary">

<!-- 1. TopNavBar -->
<nav id="navbar" data-section="navbar" class="fixed top-0 w-full z-50 border-b border-slate-200/70 backdrop-blur-md section-hover cursor-pointer transition-all duration-200" style="background-color: ${navbarBg}; color: ${navbarText};">
  <div class="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex flex-row-reverse justify-between items-center">
    <div class="flex items-center gap-3">
      ${navbarLogo ? `<img src="${navbarLogo}" alt="${navbarTitle}" class="h-9 sm:h-10 object-contain rounded-lg"/>` : ''}
      <span class="text-lg sm:text-xl font-extrabold tracking-tight" style="color: ${navbarText};">${navbarTitle}</span>
    </div>
    
    <ul class="hidden md:flex flex-row-reverse gap-6 lg:gap-8 items-center font-bold text-sm">
      <li><a class="text-primary pb-1 border-b-2 border-primary" href="#home">الرئيسية</a></li>
      <li><a class="text-slate-600 hover:text-primary transition-colors duration-200" href="#about">عن الكوتش</a></li>
      <li><a class="text-slate-600 hover:text-primary transition-colors duration-200" href="#courses">الكورسات</a></li>
      <li><a class="text-slate-600 hover:text-primary transition-colors duration-200" href="#testimonials">آراء الطلاب</a></li>
      <li><a class="text-slate-600 hover:text-primary transition-colors duration-200" href="#faq">الأسئلة الشائعة</a></li>
    </ul>

    <a href="#courses" class="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-[10px] bg-primary text-white font-bold text-xs shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
      ${navBtnText}
    </a>
  </div>
</nav>

<main class="pt-[72px] sm:pt-[80px]">

<!-- 2. Hero Section -->
<section id="home" data-section="hero" class="py-12 sm:py-20 lg:py-24 border-b border-slate-200/50 section-hover cursor-pointer transition-colors" style="background-color: ${heroBg}; color: ${heroTextColor};">
  <div class="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      
      <!-- Content Column (58% desktop width: col-span-7) -->
      <div class="lg:col-span-7 flex flex-col items-start text-right space-y-5 sm:space-y-6">
        ${heroSubtitle ? `
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/15" style="${heroSubtitleColor ? `color: ${heroSubtitleColor};` : ''}">
            <span class="material-symbols-outlined text-base">school</span>
            <span>${heroSubtitle}</span>
          </div>
        ` : ''}
        
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.25] tracking-tight" style="${heroTitleColor ? `color: ${heroTitleColor};` : ''}">
          ${heroTitle}
        </h1>
        
        <p class="text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl" style="${heroTextColor ? `color: ${heroTextColor};` : ''}">
          ${heroDesc}
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
          ${heroBtnText ? `
            <a href="${heroBtnLink}" class="px-7 py-3.5 rounded-[12px] font-bold text-sm sm:text-base inline-flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer min-h-[48px] w-full sm:w-auto" style="background-color: ${heroButtonColor}; color: ${heroButtonTextColor};">
              <span>${heroBtnText}</span>
            </a>
          ` : ''}
          
          ${heroSecondaryBtnText ? `
            <a href="${heroSecondaryBtnLink}" onclick="event.preventDefault(); const target = document.getElementById('about'); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });" class="px-7 py-3.5 rounded-[12px] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 border bg-white/80 hover:bg-white shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer min-h-[48px] w-full sm:w-auto" style="border-color: ${heroSecondaryBtnBorderColor}; color: ${heroSecondaryBtnTextColor};">
              <span>${heroSecondaryBtnText}</span>
            </a>
          ` : ''}
        </div>
      </div>

      <!-- Image Column (42% desktop width: col-span-5) -->
      <div class="lg:col-span-5 relative flex justify-center">
        <div class="w-full max-w-md lg:max-w-none relative p-2 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-md">
          <img class="w-full aspect-[4/4.5] sm:aspect-[4/4] lg:aspect-[4/4.5] object-cover rounded-xl border border-slate-100" src="${heroImage}" alt="${heroTitle}"/>
          
          <!-- Floating Coaching Message -->
          ${heroCoachingMessage ? `
            <div class="absolute -bottom-5 -right-3 sm:-right-5 hidden sm:block p-4 rounded-xl shadow-md border border-slate-200/80 max-w-[240px] text-xs font-semibold leading-relaxed" style="background-color: ${heroCoachingCardBg}; color: ${heroCoachingCardText};">
              <div class="flex items-center gap-1.5 mb-1 text-primary font-bold">
                <span class="material-symbols-outlined text-sm">stars</span>
                <span>توجيه خاص</span>
              </div>
              ${heroCoachingMessage}
            </div>
          ` : ''}
        </div>
      </div>

    </div>
  </div>
</section>



<!-- 4. About the Coach Section -->
<section id="about" data-section="about" class="py-16 sm:py-24 border-b border-slate-200/50 section-hover cursor-pointer" style="background-color: ${aboutBg}; color: ${aboutTextColor};">
  <div class="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      
      <!-- Image Column (col-span-5) -->
      <div class="lg:col-span-5 flex justify-center">
        <div class="relative w-full max-w-md p-2 bg-white rounded-2xl border border-slate-200/80 shadow-md">
          <img class="w-full aspect-[4/4] sm:aspect-[4/4.5] object-cover rounded-xl border border-slate-100" src="${aboutImage}" alt="${aboutTitle}"/>
          <div class="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 border border-slate-200/80 rounded-lg text-xs font-bold text-primary shadow-xs">
            ${aboutCoachTitle}
          </div>
        </div>
      </div>

      <!-- Content Column (col-span-7) -->
      <div class="lg:col-span-7 flex flex-col items-start space-y-4">
        <span class="text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/15">المدرب الشخصي</span>
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold" style="color: ${aboutTitleColor};">${aboutTitle}</h2>
        ${aboutSubtitle ? `<p class="text-sm font-bold text-primary opacity-90">${aboutSubtitle}</p>` : ''}
        
        ${aboutDesc ? `<p class="text-base sm:text-lg leading-relaxed font-semibold" style="color: ${aboutTextColor};">${aboutDesc}</p>` : ''}
        
        ${aboutBio ? `<p class="text-sm sm:text-base leading-relaxed" style="color: ${aboutTextColor}; opacity: 0.85;">${aboutBio}</p>` : ''}
      </div>

    </div>
  </div>
</section>

<!-- 5. Courses Section -->
<section id="courses" data-section="features" class="py-16 sm:py-24 border-b border-slate-200/50 section-hover cursor-pointer" style="background-color: ${content?.features?.backgroundColor || '#f4f3f5'}; color: ${content?.features?.textColor || '#1a1c1d'};">
  <div class="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
    <div class="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
      <span class="text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/15 inline-block mb-3">الدورات التدريبية</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold" style="color: ${(content?.features as any)?.titleColor || content?.features?.textColor || '#1a1c1d'};">${content?.features?.title || 'الدورات التدريبية والكورسات'}</h2>
      <p class="text-sm sm:text-base mt-3 leading-relaxed" style="color: ${(content?.features as any)?.subtitleColor || '#49454f'};">${content?.features?.subtitle || 'دورات متخصصة مصممة بعناية لتناسب جميع المستويات مع تطبيقات عملية ومتابعة مستمرة.'}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      ${featuresItems.map((item: any, idx: number) => {
        const itemCtaText = item.ctaText || (content?.features as any)?.ctaText || 'عرض الكورس';
        const itemLevel = item.level || 'كورس تطبيقي';
        const courseUrl = `/courses/${item.slug || item.id || (idx + 1)}`;
        return `
        <div data-section="features" data-index="${idx}" class="group border border-slate-200/80 rounded-[16px] bg-white p-5 sm:p-6 hover:shadow-md hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col h-full">
          <div class="w-full aspect-[16/9] mb-5 overflow-hidden rounded-xl bg-slate-100 relative border border-slate-100">
            <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${item.icon || item.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop'}" alt="${item.title}"/>
            <div class="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-extrabold text-primary border border-slate-200/60">${itemLevel}</div>
          </div>
          
          <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-2 leading-snug">${item.title}</h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed flex-grow">${item.description}</p>
          
          <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span class="material-symbols-outlined text-sm">schedule</span>
              <span>${item.duration || 'دروس مسجلة + تطبيقات'}</span>
            </div>
            
            <a href="${courseUrl}" onclick="event.stopPropagation(); window.location.href='${courseUrl}';" class="px-4 py-2 rounded-[10px] bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-xs transition-all duration-200 cursor-pointer inline-block text-center">
              ${itemCtaText}
            </a>
          </div>
        </div>
      `;
      }).join('')}
    </div>
  </div>
</section>


<!-- 7. Student Reviews Section -->
<section id="testimonials" data-section="testimonials" class="py-16 sm:py-24 border-b border-slate-200/50 section-hover cursor-pointer" style="background-color: ${testimonialsBg}; color: ${testimonialsTextColor};">
  <div class="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
    <div class="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
      <span class="text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/15 inline-block mb-3">آراء وتجارب</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">${testimonialsTitle}</h2>
      <p class="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">${testimonialsSubtitle}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      ${testimonialsItems.map((item: any, idx: number) => `
        <div data-section="testimonials" data-index="${idx}" class="p-6 border border-slate-200/80 rounded-[16px] bg-white shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col justify-between cursor-pointer">
          <div>
            <div class="flex gap-1 text-amber-400 mb-4">
              ${Array.from({ length: Number(item.rating || 5) }).map(() => '<span class="material-symbols-outlined text-lg" data-weight="fill">star</span>').join('')}
            </div>
            
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 italic">
              "${item.review || item.content || ''}"
            </p>
          </div>

          <div class="flex items-center gap-3 border-t border-slate-100 pt-4">
            ${item.avatar ? `<img src="${item.avatar}" alt="${item.name}" class="w-10 h-10 rounded-full object-cover border border-slate-200"/>` : `
              <div class="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs">
                ${item.initials || item.name?.slice(0, 2) || 'ط'}
              </div>
            `}
            <div>
              <p class="font-bold text-xs sm:text-sm text-slate-900">${item.name}</p>
              <p class="text-xs text-slate-500">${item.role}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- 8. Pricing / Courses Curriculum Section -->
<section id="pricing" data-section="pricing" class="py-16 sm:py-24 border-b border-slate-200/50 section-hover cursor-pointer" style="background-color: ${content?.pricing?.backgroundColor || '#ffffff'}; color: ${content?.pricing?.textColor || '#1a1c1d'};">
  <div class="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
    <div class="text-center mb-12 sm:mb-16">
      <span class="text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/15 inline-block mb-3">الباقات والمنهج</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">${pricingTitle}</h2>
      <p class="text-sm sm:text-base text-slate-600 mt-2">${pricingSubtitle}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
      ${pricingItems.map((item: any, idx: number) => `
        <div id="course-${item.id || idx}" data-section="pricing" data-index="${idx}" class="p-6 sm:p-8 border border-slate-200/80 rounded-[18px] bg-white hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col justify-between cursor-pointer">
          <div>
            <span class="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full border border-primary/15 mb-4">${item.price || 'كورس كامل'}</span>
            <h3 class="text-lg sm:text-xl font-bold text-slate-900 mb-4">${item.title}</h3>
            
            <ul class="space-y-2.5 mb-8 text-xs sm:text-sm text-slate-600">
              ${(item.features || []).map((f: string) => `<li class="flex items-center gap-2"><span class="material-symbols-outlined text-primary text-base">check_circle</span><span>${f}</span></li>`).join('')}
            </ul>
          </div>

          <button class="w-full py-3.5 rounded-[12px] bg-primary text-white font-bold text-sm shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer">
            الالتحاق بالكورس
          </button>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- 9. FAQ Section -->
<section id="faq" data-section="faq" class="py-16 sm:py-24 border-b border-slate-200/50 section-hover cursor-pointer" style="background-color: ${content?.faq?.backgroundColor || '#faf9fb'}; color: ${content?.faq?.textColor || '#1a1c1d'};">
  <div class="max-w-[900px] mx-auto px-4 sm:px-8">
    <div class="text-center mb-12">
      <span class="text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/15 inline-block mb-3">استفسارات شائعة</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">${faqTitle}</h2>
      <p class="text-sm text-slate-600 mt-2">إجابات لأكثر الأسئلة تكراراً حول الكورسات ونظام التعلم.</p>
    </div>

    <div class="space-y-4">
      ${faqItems.map((item: any, idx: number) => `
        <div data-section="faq" data-index="${idx}" class="p-5 sm:p-6 border border-slate-200/80 rounded-[14px] bg-white hover:border-primary/40 transition-colors cursor-pointer">
          <h3 class="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-lg">help_outline</span>
            <span>${item.question}</span>
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pr-7">${item.answer}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- 10. Final CTA Section -->
<section id="finalCta" data-section="finalCta" class="py-16 sm:py-20 section-hover cursor-pointer" style="background-color: ${ctaBg}; color: ${ctaTextColor};">
  <div class="max-w-[850px] mx-auto px-4 sm:px-8">
    <div class="p-8 sm:p-12 rounded-[20px] border border-slate-200/80 text-center shadow-xs" style="background-color: ${ctaBg}; color: ${ctaTextColor};">
      <div class="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-5 shadow-xs" style="background-color: ${ctaButtonBg}; color: ${ctaButtonTextColor};">
        <span class="material-symbols-outlined text-3xl">${(content as any)?.finalCta?.icon || 'school'}</span>
      </div>
      
      <h2 class="text-2xl sm:text-3xl font-extrabold mb-3" style="color: ${ctaTitleColor};">${ctaTitle}</h2>
      <p class="text-xs sm:text-sm mb-8 max-w-md mx-auto leading-relaxed" style="color: ${ctaTextColor}; opacity: 0.9;">
        ${ctaDesc}
      </p>

      <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onsubmit="event.preventDefault(); alert('تم الاشتراك بالنشرة التعليمية بنجاح!');">
        <input class="flex-1 bg-white border border-slate-300 px-4 py-3.5 rounded-[12px] text-right text-xs sm:text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="${ctaPlaceholder}" required type="email"/>
        <button class="px-7 py-3.5 rounded-[12px] font-bold text-xs sm:text-sm shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0 cursor-pointer" style="background-color: ${ctaButtonBg}; color: ${ctaButtonTextColor};" type="submit">
          ${ctaBtnText}
        </button>
      </form>
    </div>
  </div>
</section>

</main>

<!-- 11. Footer Section -->
<footer id="footer" data-section="footer" class="border-t border-slate-200/80 section-hover cursor-pointer" style="background-color: ${footerBg}; color: ${footerTextColor};">
  <div class="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-right">
      
      <!-- Contact Info (col-span-5) -->
      <div id="contact" data-section="contact" class="md:col-span-5 space-y-3">
        <div class="text-lg font-extrabold text-primary" style="color: ${content?.contact?.textColor || '#4f378a'};">${contactTitle}</div>
        <p class="text-xs max-w-sm leading-relaxed" style="color: ${footerTextColor}; opacity: 0.85;">${contactDesc}</p>
        
        <div class="flex flex-wrap gap-2 pt-2">
          ${(contactWhatsapp || contactWhatsappText) ? `<a href="${contactWhatsapp ? `https://wa.me/${contactWhatsapp.replace(/[^\d]/g, '')}` : '#whatsapp'}" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 bg-emerald-600 text-white rounded-[10px] hover:bg-emerald-700 shadow-2xs transition-all"><span class="material-symbols-outlined text-sm">chat</span><span>${contactWhatsappText}</span></a>` : ''}
          ${(contactEmail || contactEmailText) ? `<a href="${contactEmail ? `mailto:${contactEmail}` : '#email'}" class="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 bg-primary text-white rounded-[10px] hover:bg-primary-hover shadow-2xs transition-all"><span class="material-symbols-outlined text-sm">mail</span><span>${contactEmailText}</span></a>` : ''}
          ${(contactPhone || contactPhoneText) ? `<a href="${contactPhone ? `tel:${contactPhone}` : '#phone'}" class="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 border border-slate-300 text-slate-700 bg-white rounded-[10px] hover:bg-slate-50 transition-all"><span class="material-symbols-outlined text-sm">call</span><span>${contactPhoneText}</span></a>` : ''}
        </div>
      </div>

      <!-- Quick Links (col-span-7) -->
      <div class="md:col-span-7 flex flex-wrap justify-start md:justify-end gap-6 text-xs sm:text-sm font-bold">
        <a class="hover:text-primary transition-colors" href="#home" style="color: ${footerTextColor};">الرئيسية</a>
        <a class="hover:text-primary transition-colors" href="#about" style="color: ${footerTextColor};">عن الكوتش</a>
        <a class="hover:text-primary transition-colors" href="#courses" style="color: ${footerTextColor};">الكورسات</a>
        <a class="hover:text-primary transition-colors" href="#testimonials" style="color: ${footerTextColor};">آراء الطلاب</a>
        <a class="hover:text-primary transition-colors" href="#faq" style="color: ${footerTextColor};">الأسئلة الشائعة</a>
      </div>

    </div>

    <div class="text-center pt-8 mt-8 border-t border-slate-200/60 text-xs font-medium" style="color: ${footerTextColor}; opacity: 0.8;">
      ${footerText}
    </div>
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
