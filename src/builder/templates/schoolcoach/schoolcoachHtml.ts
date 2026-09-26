import { TemplateContent, renderVideoPlayer } from '../academic/academicHtml';

const escapeHtml = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const normalizeImage = (value: any, fallback: string) => {
  if (!value || typeof value !== 'string') return fallback;
  return value.trim() || fallback;
};

const getSafeValue = (obj: any, keys: string[], fallback: any = '') => {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
};

const normalizeWhatsappUrl = (val: string): string => {
  if (!val || typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits}`;
};

const normalizePhoneTel = (val: string): string => {
  if (!val || typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (!trimmed) return '';
  const sanitized = trimmed.replace(/[^\d+]/g, '');
  if (!sanitized) return '';
  return `tel:${sanitized}`;
};

/**
 * SchoolCoach Navbar Navigation Contract:
 * Exact mapping of Navbar items to future section IDs:
 * 1. الكورسات (Courses)    -> target: "courses"   (Future Section: id="courses")
 * 2. الفيديوهات (Videos)   -> target: "videos"    (Future Section: id="videos")
 * 3. المذكرات (Resources)  -> target: "resources" (Future Section: id="resources")
 * 4. النتائج (Results)     -> target: "results"   (Future Section: id="results")
 * 5. عني (About)           -> target: "about"     (Future Section: id="about")
 * 
 * Target IDs are immutable semantic contracts.
 * User can edit labels from the Builder, but the target ID remains fixed.
 */
export interface SchoolCoachNavItem {
  key: string;
  target: string;
  label: string;
  href: string;
}

export const DEFAULT_SCHOOLCOACH_NAV_ITEMS: SchoolCoachNavItem[] = [
  { key: 'courses', target: 'courses', label: 'الكورسات', href: '#courses' },
  { key: 'videos', target: 'videos', label: 'الفيديوهات', href: '#videos' },
  { key: 'resources', target: 'resources', label: 'المذكرات', href: '#resources' },
  { key: 'results', target: 'results', label: 'النتائج', href: '#results' },
  { key: 'about', target: 'about', label: 'عني', href: '#about' },
];

export const getSchoolCoachNewDesignHtml = (
  content: TemplateContent,
  isEditing: boolean = false,
  isLoggedIn: boolean = false,
  dashboardUrl: string = '/student',
  grades: any[] = [],
  subjects: any[] = [],
  selectedGrade: string = '',
  selectedSubject: string = '',
  realCourses: any[] = [],
  realBags: any[] = [],
  teacherProfile: any = null
) => {
  // Shared Canonical Teacher Identity
  const teacherName = getSafeValue((content as any)?.profile, ['teacherName'], getSafeValue((content as any)?.navbar, ['teacherName', 'title'], ''));
  const teacherTitle = getSafeValue((content as any)?.profile, ['teacherTitle', 'jobTitle', 'title', 'headline'], getSafeValue((content as any)?.navbar, ['teacherTitle', 'teacher_title', 'jobTitle'], ''));
  const profileEmail = getSafeValue((content as any)?.footer, ['email'], teacherProfile?.email || '');
  const profilePhone = getSafeValue((content as any)?.footer, ['phone'], teacherProfile?.phone || '');

  // Hero Profile props
  const profileBio = getSafeValue((content as any)?.profile, ['description', 'bio', 'about', 'summary'], '');
  const profileGoal = getSafeValue((content as any)?.profile, ['goal', 'mission', 'learningGoal'], '');
  const coverImage = normalizeImage(getSafeValue((content as any)?.profile, ['cover', 'coverImage', 'cover_image'], ''), '');
  const avatarImage = normalizeImage(getSafeValue((content as any)?.profile, ['avatar', 'avatarImage', 'image', 'profileImage'], ''), '');
  const verifiedVisible = (content as any)?.profile?.verified !== false;
  const verifiedText = getSafeValue((content as any)?.profile, ['verifiedText', 'verified_text'], 'موثّق');
  const startLearningLabel = getSafeValue((content as any)?.profile, ['ctaPrimaryText', 'startLearningText', 'primaryButtonText'], 'ابدأ التعلم');
  const watchVideosLabel = getSafeValue((content as any)?.profile, ['ctaSecondaryText', 'watchVideosText', 'secondaryButtonText'], 'شاهد الفيديوهات');
  const ctaPrimaryBg = getSafeValue((content as any)?.profile, ['ctaPrimaryBg', 'primaryButtonBg', 'buttonBg'], '');
  const ctaPrimaryTextColor = getSafeValue((content as any)?.profile, ['ctaPrimaryTextColor', 'primaryButtonTextColor', 'buttonTextColor'], '');
  const ctaSecondaryBg = getSafeValue((content as any)?.profile, ['ctaSecondaryBg', 'secondaryButtonBg'], '');
  const ctaSecondaryTextColor = getSafeValue((content as any)?.profile, ['ctaSecondaryTextColor', 'secondaryButtonTextColor'], '');
  
  // 4 Achievement / Stat Cards
  const rawStats = Array.isArray((content as any)?.profile?.stats)
    ? (content as any).profile.stats
    : (Array.isArray((content as any)?.stats?.items) ? (content as any).stats.items : []);

  const defaultStats = [
    { value: '8000+', label: 'طالب متفوق', enabled: true },
    { value: '12+', label: 'سنوات خبرة', enabled: true },
    { value: '350+', label: 'فيديو تعليمي', enabled: true },
    { value: '4.9', label: 'تقييم عام', enabled: true },
  ];

  const statItems = rawStats.length > 0 ? rawStats : defaultStats;
  const activeStats = statItems.filter((item: any) => item && item.enabled !== false && (item.value || item.label));

  // Navbar Configuration
  const loginButtonText = getSafeValue((content as any)?.navbar, ['loginText', 'login_text'], 'تسجيل الدخول');
  const videoIconVisible = (content as any)?.navbar?.videoIconVisible !== false && (content as any)?.navbar?.videoEnabled !== false;
  const contactIconVisible = (content as any)?.navbar?.contactIconVisible !== false && (content as any)?.navbar?.contactEnabled !== false;

  // Contact Modal Configuration (Builder Editable)
  const contactModalTitle = getSafeValue((content as any)?.navbar, ['contactModalTitle', 'contact_title', 'modalTitle'], 'تواصل مع الفريق');
  const contactModalDescription = getSafeValue((content as any)?.navbar, ['contactModalDescription', 'contact_description', 'modalDescription'], 'للحجز والاستفسار، يمكنك التواصل مباشرة مع الفريق.');
  const rawWhatsapp = getSafeValue((content as any)?.navbar, ['whatsappUrl', 'whatsapp_url', 'whatsappNumber', 'whatsapp_number', 'whatsapp'], '');
  const rawPhone = getSafeValue((content as any)?.navbar, ['phoneNumber', 'phone_number', 'phone'], '');
  const whatsappLabel = getSafeValue((content as any)?.navbar, ['whatsappButtonLabel', 'whatsapp_button_label', 'whatsappLabel'], 'واتساب');
  const phoneLabel = getSafeValue((content as any)?.navbar, ['phoneButtonLabel', 'phone_button_label', 'phoneLabel'], 'اتصال');

  const whatsappUrl = normalizeWhatsappUrl(rawWhatsapp);
  const phoneTel = normalizePhoneTel(rawPhone);

  // 5 Canonical Navbar Navigation Items (Labels editable, Targets stable)
  const coursesLabel = getSafeValue((content as any)?.navbar, ['coursesLabel', 'courses_label'], '');
  const videosLabel = getSafeValue((content as any)?.navbar, ['videosLabel', 'videos_label'], '');
  const resourcesLabel = getSafeValue((content as any)?.navbar, ['resourcesLabel', 'resources_label', 'bagsLabel', 'bags_label'], '');
  const resultsLabel = getSafeValue((content as any)?.navbar, ['resultsLabel', 'results_label', 'statsLabel'], '');
  const aboutLabel = getSafeValue((content as any)?.navbar, ['aboutLabel', 'about_label'], '');

  const rawLinks = Array.isArray((content as any)?.navbar?.links) ? (content as any).navbar.links : [];

  const navItems: SchoolCoachNavItem[] = DEFAULT_SCHOOLCOACH_NAV_ITEMS.map((defaultItem) => {
    let customLabel = '';
    if (defaultItem.key === 'courses' && coursesLabel) customLabel = coursesLabel;
    else if (defaultItem.key === 'videos' && videosLabel) customLabel = videosLabel;
    else if (defaultItem.key === 'resources' && resourcesLabel) customLabel = resourcesLabel;
    else if (defaultItem.key === 'results' && resultsLabel) customLabel = resultsLabel;
    else if (defaultItem.key === 'about' && aboutLabel) customLabel = aboutLabel;

    if (!customLabel && rawLinks.length > 0) {
      const match = rawLinks.find((l: any) => l?.key === defaultItem.key || l?.target === defaultItem.target || l?.href === `#${defaultItem.target}`);
      if (match?.label) customLabel = match.label;
    }

    return {
      key: defaultItem.key,
      target: defaultItem.target,
      label: customLabel || defaultItem.label,
      href: `#${defaultItem.target}`,
    };
  });

  // Section 3 (Courses) Configuration
  const coursesTitle = getSafeValue((content as any)?.courses, ['title'], 'الكورسات المتاحة');
  const coursesSubtitle = getSafeValue((content as any)?.courses, ['subtitle', 'description'], 'اختار الكورس المناسب ليك وابدأ رحلتك التعليمية.');
  const coursesEmptyText = getSafeValue((content as any)?.courses, ['emptyText', 'empty_text'], 'لا توجد كورسات متاحة حالياً');
  const coursesBg = getSafeValue((content as any)?.courses, ['backgroundColor', 'background_color', 'bgColor', 'bg_color'], '');
  const coursesTextColor = getSafeValue((content as any)?.courses, ['textColor', 'text_color', 'titleColor', 'title_color'], '');
  const coursesFontFamily = getSafeValue((content as any)?.courses, ['fontFamily', 'font_family'], '');
  const selectedCourseIds: string[] = Array.isArray((content as any)?.courses?.selectedCourseIds)
    ? (content as any).courses.selectedCourseIds.map((id: any) => String(id))
    : [];

  // Section 4 (Steps / Getting Started) Configuration
  const stepsTitle = getSafeValue((content as any)?.steps, ['title'], 'لسه أول مرة تذاكر معايا؟');
  const stepsSubtitle = getSafeValue((content as any)?.steps, ['subtitle', 'description'], 'ابدأ بالخطوات دي، وفي دقائق هتعرف أنسب مكان ليك.');
  const stepsBg = getSafeValue((content as any)?.steps, ['backgroundColor', 'background_color', 'bgColor', 'bg_color'], '');
  const stepsTextColor = getSafeValue((content as any)?.steps, ['textColor', 'text_color'], '');
  const stepsFontFamily = getSafeValue((content as any)?.steps, ['fontFamily', 'font_family'], '');

  const rawSteps = Array.isArray((content as any)?.steps?.items) ? (content as any).steps.items : [];
  const defaultSteps = [
    { number: '1', title: 'شاهد درس تجريبي', description: 'اعرف أسلوب الشرح قبل الاشتراك.', actionText: 'شاهد الفيديوهات', actionLink: 'video-library', enabled: true },
    { number: '2', title: 'اختار صفك الدراسي', description: 'هنرشح لك المحتوى المناسب فقط.', actionText: 'تصفح الكورسات', actionLink: 'course-library', enabled: true },
    { number: '3', title: 'ابدأ الكورس المناسب', description: 'ابدأ رحلتك التعليمية واستمتع بأفضل تجربة تعليمية.', actionText: 'ابدأ الآن', actionLink: 'course-library', enabled: true },
  ];
  const stepItems = rawSteps.length > 0 ? rawSteps : defaultSteps;

  // Section 5 (Videos) Configuration
  const videosTitle = getSafeValue((content as any)?.videos, ['title'], (content as any)?.about?.videoTitle || 'أحدث الفيديوهات');
  const videosSubtitle = getSafeValue((content as any)?.videos, ['subtitle', 'caption', 'description'], 'شاهد أحدث الشروحات والدروس المصورة.');
  const videosEmptyText = getSafeValue((content as any)?.videos, ['emptyText', 'empty_text'], 'لا توجد فيديوهات متاحة حالياً');
  const videosViewAllLabel = getSafeValue((content as any)?.videos, ['viewAllLabel', 'view_all_label', 'buttonText'], 'عرض الجميع');
  const videosBg = getSafeValue((content as any)?.videos, ['backgroundColor', 'background_color', 'bgColor', 'bg_color'], '');
  const videosTextColor = getSafeValue((content as any)?.videos, ['textColor', 'text_color'], '');
  const videosFontFamily = getSafeValue((content as any)?.videos, ['fontFamily', 'font_family'], '');

  // Section 6 (Resources / Notes) Configuration
  const resourcesTitle = getSafeValue((content as any)?.resources, ['title'], (content as any)?.bags?.title || 'المذكرات والمصادر');
  const resourcesSubtitle = getSafeValue((content as any)?.resources, ['subtitle', 'caption', 'description'], (content as any)?.bags?.subtitle || 'حمل مذكرات الشرح والمراجعات الشاملة لجميع الدروس.');
  const resourcesEmptyText = getSafeValue((content as any)?.resources, ['emptyText', 'empty_text'], (content as any)?.bags?.emptyText || 'لا توجد مذكرات أو موارد متاحة حالياً');
  const resourcesViewAllLabel = getSafeValue((content as any)?.resources, ['viewAllLabel', 'view_all_label', 'buttonText'], 'عرض الكل');
  const resourcesBg = getSafeValue((content as any)?.resources, ['backgroundColor', 'background_color', 'bgColor', 'bg_color'], (content as any)?.bags?.backgroundColor || '');
  const resourcesTextColor = getSafeValue((content as any)?.resources, ['textColor', 'text_color'], (content as any)?.bags?.textColor || '');
  const resourcesFontFamily = getSafeValue((content as any)?.resources, ['fontFamily', 'font_family'], (content as any)?.bags?.fontFamily || '');

  // Section 7 (Student Results) Configuration
  const resultsTitle = getSafeValue((content as any)?.results, ['title'], 'نتائج الطلاب المتفوقين');
  const resultsSubtitle = getSafeValue((content as any)?.results, ['subtitle', 'caption', 'description'], 'فخورون بنتائج وتفوق طلابنا في كل مرحلة دراسية.');
  const resultsEmptyText = getSafeValue((content as any)?.results, ['emptyText', 'empty_text'], 'سيتم إضافة نتائج وتكريمات الطلاب قريباً');
  const resultsViewAllLabel = getSafeValue((content as any)?.results, ['viewAllLabel', 'view_all_label', 'buttonText'], 'عرض جميع النتائج');
  const resultsModalTitle = getSafeValue((content as any)?.results, ['modalTitle', 'modal_title'], 'لوحة شرف ونتائج الطلاب');
  const resultsModalDescription = getSafeValue((content as any)?.results, ['modalDescription', 'modal_description'], 'جميع نتائج ودرجات الطلاب المتفوقين في الاختبارات والمراحل المختلفة.');
  const resultsPreviewCount = Number(getSafeValue((content as any)?.results, ['previewCount', 'preview_count', 'limit'], 4));
  const resultsBg = getSafeValue((content as any)?.results, ['backgroundColor', 'background_color', 'bgColor', 'bg_color'], '');
  const resultsTextColor = getSafeValue((content as any)?.results, ['textColor', 'text_color'], '');
  const resultsFontFamily = getSafeValue((content as any)?.results, ['fontFamily', 'font_family'], '');

  // Dynamic Content Collections
  const rawCourseItems = Array.isArray(realCourses) && realCourses.length > 0 ? realCourses : (Array.isArray((content as any)?.courses?.items) ? (content as any).courses.items : []);
  const displayedCourses = selectedCourseIds.length > 0
    ? rawCourseItems.filter((c: any) => selectedCourseIds.includes(String(c.id ?? c.course_id ?? c._id)))
    : rawCourseItems;

  const rawResourceItems = Array.isArray((content as any)?.resources?.items)
    ? (content as any).resources.items
    : (Array.isArray(realBags) && realBags.length > 0 ? realBags : (Array.isArray((content as any)?.bags?.items) ? (content as any).bags.items : []));
  const resourceItems = rawResourceItems.filter((r: any) => r && (r.enabled !== false));

  const rawVideoItems = Array.isArray((content as any)?.videos?.items) ? (content as any).videos.items : (Array.isArray((content as any)?.video?.items) ? (content as any).video.items : []);
  const videoItems = rawVideoItems.filter((v: any) => v && (v.enabled !== false));

  const rawResultItems = Array.isArray((content as any)?.results?.items)
    ? (content as any).results.items
    : [];
  const activeResults = rawResultItems.filter((r: any) => r && (r.enabled !== false));

  // Section 8 (About & Qualifications Timeline) Configuration
  const aboutCaption = getSafeValue((content as any)?.about, ['caption', 'eyebrow', 'badge'], 'نبذة عن المعلم');
  const aboutTitle = getSafeValue((content as any)?.about, ['title'], 'الخبرة والمنهجية التعليمية');
  const aboutDescription = getSafeValue((content as any)?.about, ['description', 'bio', 'subtitle'], profileBio || 'أعتمد على أسلوب تدريسي يجمع بين الشرح المبسط، التطبيق المكثف، والتقييم المستمر لضمان أعلى مستوى من الاستيعاب والتفوق.');
  const aboutTimelineTitle = getSafeValue((content as any)?.about, ['timelineTitle', 'timeline_title'], (content as any)?.timeline?.title || 'المؤهلات والمسيرة المهنية');
  const aboutBg = getSafeValue((content as any)?.about, ['backgroundColor', 'background_color', 'bgColor', 'bg_color'], '');
  const aboutTextColor = getSafeValue((content as any)?.about, ['textColor', 'text_color'], '');
  const aboutFontFamily = getSafeValue((content as any)?.about, ['fontFamily', 'font_family'], '');
  const rawAboutItems = Array.isArray((content as any)?.about?.items)
    ? (content as any).about.items
    : (Array.isArray((content as any)?.timeline?.items) ? (content as any).timeline.items : []);
  const aboutItems = rawAboutItems.filter((it: any) => it && it.enabled !== false && (it.title || it.stage || it.year || it.description));

  // Section 9 (Classroom Gallery) Configuration
  const galleryCaption = getSafeValue((content as any)?.gallery, ['caption', 'eyebrow', 'badge'], 'معرض الصف');
  const galleryTitle = getSafeValue((content as any)?.gallery, ['title'], 'لقطات من البيئة التعليمية');
  const gallerySubtitle = getSafeValue((content as any)?.gallery, ['subtitle', 'description', 'caption_desc'], 'أنشطة وتجارب تفاعلية في القاعات الدراسية.');
  const galleryEmptyText = getSafeValue((content as any)?.gallery, ['emptyText', 'empty_text'], 'لا توجد صور في المعرض حالياً');
  const galleryBg = getSafeValue((content as any)?.gallery, ['backgroundColor', 'background_color', 'bgColor', 'bg_color'], '');
  const galleryTextColor = getSafeValue((content as any)?.gallery, ['textColor', 'text_color'], '');
  const galleryFontFamily = getSafeValue((content as any)?.gallery, ['fontFamily', 'font_family'], '');
  const rawGalleryItems = Array.isArray((content as any)?.gallery?.items) ? (content as any).gallery.items : [];
  const galleryItems = rawGalleryItems.filter((it: any) => it && it.enabled !== false && (it.image_url || it.image || it.url || (typeof it === 'string' && it.trim())));

  // Section 10 (Student Testimonials) Configuration
  const testimonialsCaption = getSafeValue((content as any)?.testimonials, ['caption', 'eyebrow', 'badge'], (content as any)?.faq?.testimonialsCaption || 'آراء الطلاب');
  const testimonialsTitle = getSafeValue((content as any)?.testimonials, ['title'], (content as any)?.faq?.testimonialsTitle || 'ماذا يقول طلابنا المتفوقون؟');
  const testimonialsSubtitle = getSafeValue((content as any)?.testimonials, ['subtitle', 'description'], (content as any)?.faq?.testimonialsSubtitle || 'تجارب واقعية وقصص نجاح يرويها شركاء النجاح من الطلاب المتفوقين.');
  const testimonialsEmptyText = getSafeValue((content as any)?.testimonials, ['emptyText', 'empty_text'], 'سيتم إضافة آراء وتجارب الطلاب قريباً');
  const testimonialsBg = getSafeValue((content as any)?.testimonials, ['backgroundColor', 'background_color', 'bgColor', 'bg_color'], '');
  const testimonialsTextColor = getSafeValue((content as any)?.testimonials, ['textColor', 'text_color'], '');
  const testimonialsFontFamily = getSafeValue((content as any)?.testimonials, ['fontFamily', 'font_family'], '');
  const rawTestimonialItems = Array.isArray((content as any)?.testimonials?.items)
    ? (content as any).testimonials.items
    : (Array.isArray((content as any)?.faq?.testimonials) ? (content as any).faq.testimonials : []);
  const testimonialItems = rawTestimonialItems.filter((it: any) => it && it.enabled !== false && (it.text || it.quote || it.name || it.author));

  // Section 11 (FAQ) Configuration
  const faqCaption = getSafeValue((content as any)?.faq, ['caption', 'eyebrow', 'badge'], 'الأسئلة الشائعة');
  const faqTitle = getSafeValue((content as any)?.faq, ['title'], 'كل ما تود معرفته عن طريقة الدراسة والمتابعة');
  const faqSubtitle = getSafeValue((content as any)?.faq, ['subtitle', 'description'], 'إجابات واضحة ومباشرة على أكثر الاستفسارات تكراراً.');
  const faqEmptyText = getSafeValue((content as any)?.faq, ['emptyText', 'empty_text'], 'لا توجد أسئلة شائعة مضافة حالياً');
  const faqBg = getSafeValue((content as any)?.faq, ['backgroundColor', 'background_color', 'bgColor', 'bg_color'], '');
  const faqTextColor = getSafeValue((content as any)?.faq, ['textColor', 'text_color'], '');
  const faqFontFamily = getSafeValue((content as any)?.faq, ['fontFamily', 'font_family'], '');
  const rawFaqItems = Array.isArray((content as any)?.faq?.items) ? (content as any).faq.items : [];
  const faqItems = rawFaqItems.filter((it: any) => it && it.enabled !== false && (it.question || it.q));

  // Section 12 (Final CTA / Contact) Configuration
  const ctaCaption = getSafeValue((content as any)?.cta, ['caption', 'eyebrow', 'badge'], (content as any)?.contact?.caption || 'جاهز للبدء والتفوق؟');
  const ctaTitle = getSafeValue((content as any)?.cta, ['title'], (content as any)?.contact?.title || 'احجز مكانك في مجموعاتنا التعليمية الآن');
  const ctaDescription = getSafeValue((content as any)?.cta, ['description', 'subtitle'], (content as any)?.contact?.description || 'انضم إلينا وابدأ رحلة التفوق مع أسلوب تعليمي متميز ومتابعة دقيقة.');
  const ctaPrimaryLabel = getSafeValue((content as any)?.cta, ['primaryButtonText', 'buttonText', 'primaryLabel'], (content as any)?.contact?.buttonText || 'ابدأ التعلم');
  const ctaPrimaryLink = getSafeValue((content as any)?.cta, ['primaryButtonLink', 'buttonLink', 'primaryLink'], (content as any)?.contact?.buttonLink || '#courses');
  const ctaWhatsappLabel = getSafeValue((content as any)?.cta, ['whatsappButtonLabel', 'whatsappLabel'], (content as any)?.contact?.whatsappButtonLabel || 'كلمنا على الواتساب');
  const rawCtaWhatsapp = getSafeValue((content as any)?.cta, ['whatsappUrl', 'whatsapp_url', 'whatsappNumber', 'whatsapp_number', 'phoneNumber', 'phone_number', 'whatsapp'], rawWhatsapp || rawPhone || '');
  const ctaWhatsappUrl = normalizeWhatsappUrl(rawCtaWhatsapp);
  const ctaBg = getSafeValue((content as any)?.cta, ['backgroundColor', 'background_color', 'bgColor', 'bg_color'], (content as any)?.contact?.backgroundColor || '');
  const ctaTextColor = getSafeValue((content as any)?.cta, ['textColor', 'text_color'], (content as any)?.contact?.textColor || '');
  const ctaFontFamily = getSafeValue((content as any)?.cta, ['fontFamily', 'font_family'], (content as any)?.contact?.fontFamily || '');

  const renderStatCards = activeStats.map((item: any, index: number) => `
    <div class="stat-card" data-section="profile" data-stat-index="${index}">
      <strong>${escapeHtml(item.value || item.count || item.number || '')}</strong>
      <span>${escapeHtml(item.label || item.title || '')}</span>
    </div>
  `).join('');

  const renderCourseCards = displayedCourses.map((item: any, index: number) => {
    const title = escapeHtml(item.title || item.name || '');
    const price = item.final_price ?? item.price;
    const priceText = (price !== null && price !== undefined && price !== '') ? `${price} ر.س` : 'متاح للتسجيل';
    const description = escapeHtml(item.short_description || item.description || '');
    const image = normalizeImage(item.image || item.img || item.thumbnail || item.cover, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80');
    const gradeName = escapeHtml(item.grade_name || item.grade || item.level || item.type || 'كورس تعليمي');
    const courseId = escapeHtml(String(item.id || item.course_id || index));

    return `
      <article class="mini-card course-card" data-section="courses" data-index="${index}" data-course-id="${courseId}">
        <div class="thumb" style="background-image:url('${image}')"></div>
        <div class="card-body">
          <span class="chip">${gradeName}</span>
          <h3 class="course-card-title">${title}</h3>
          ${description ? `<p class="course-card-desc">${description}</p>` : ''}
          <div class="course-meta">
            <span class="price">${escapeHtml(priceText)}</span>
            <button type="button" class="small-btn" data-open-course-detail="true" data-course="${title}">عرض التفاصيل</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const renderEmptyCoursesState = `
    <div class="courses-empty-state" data-section="courses">
      <div class="empty-icon-shell">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      </div>
      <h3 class="empty-title">${escapeHtml(coursesEmptyText || 'لا توجد كورسات متاحة حالياً')}</h3>
      <p class="empty-desc">${escapeHtml(coursesSubtitle || 'سيتم إضافة الكورسات والمجموعات الدراسية قريباً.')}</p>
    </div>
  `;

  const renderStepItems = stepItems.filter((item: any) => item && item.enabled !== false).map((item: any, index: number) => {
    const num = escapeHtml(String(item.number ?? item.stepNumber ?? (index + 1)));
    const title = escapeHtml(item.title || '');
    const desc = escapeHtml(item.description || item.desc || '');

    return `
      <div class="step-item" data-section="steps" data-index="${index}">
        <div class="step-badge">${num}</div>
        <div class="step-content">
          <h3 class="step-title" style="${stepsTextColor ? `color: ${stepsTextColor};` : ''}">${title}</h3>
          ${desc ? `<p class="step-description" style="${stepsTextColor ? `color: ${stepsTextColor}; opacity: 0.85;` : ''}">${desc}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');

  const renderVideoCards = videoItems.map((item: any, index: number) => {
    const title = escapeHtml(item.title || item.name || 'فيديو تعليمي');
    const duration = escapeHtml(item.duration || item.time || '');
    const thumb = normalizeImage(item.thumbnail || item.image || item.img || item.cover, '');
    const videoId = escapeHtml(String(item.id || index));

    return `
      <article class="mini-card video-card" data-section="videos" data-index="${index}" data-video-id="${videoId}">
        <div class="video-thumb ${!thumb ? 'video-thumb-default' : ''}" style="${thumb ? `background-image:url('${thumb}')` : ''}">
          <span class="play-badge">▶</span>
          ${duration ? `<span class="video-time">${duration}</span>` : ''}
        </div>
        <div class="card-body tight">
          <h3 class="video-card-title">${title}</h3>
          ${item.description ? `<p class="video-card-desc">${escapeHtml(item.description)}</p>` : ''}
        </div>
      </article>
    `;
  }).join('');

  const renderEmptyVideosState = `
    <div class="videos-empty-state" data-section="videos">
      <div class="empty-icon-shell">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </div>
      <h3 class="empty-title">${escapeHtml(videosEmptyText || 'لا توجد فيديوهات متاحة حالياً')}</h3>
      <p class="empty-desc">${escapeHtml(videosSubtitle || 'سيتم إضافة الدروس والفيديوهات التعليمية قريباً.')}</p>
    </div>
  `;

  const renderResourceCards = resourceItems.map((item: any, index: number) => {
    const title = escapeHtml(item.title || item.name || 'ملف دراسي');
    const desc = escapeHtml(item.description || item.short_description || item.desc || '');
    const thumb = normalizeImage(item.image || item.img || item.thumbnail || item.cover, '');
    const fileUrl = (item.file_url || item.url || item.link || '').trim();
    const fileType = escapeHtml(item.file_type || item.type || item.badge || 'PDF');
    const resId = escapeHtml(String(item.id || index));

    return `
      <article class="mini-card resource-card" data-section="resources" data-index="${index}" data-resource-id="${resId}">
        <div class="thumb ${!thumb ? 'resource-thumb-default' : ''}" style="${thumb ? `background-image:url('${thumb}')` : ''}">
          ${!thumb ? `
            <div class="resource-icon-badge">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
          ` : ''}
        </div>
        <div class="card-body">
          <span class="chip">${fileType}</span>
          <h3 class="resource-card-title">${title}</h3>
          ${desc ? `<p class="resource-card-desc">${desc}</p>` : ''}
          <div class="resource-meta">
            ${fileUrl ? `
              <a href="${escapeHtml(fileUrl)}" class="small-btn" target="_blank" rel="noreferrer">تحميل المذكرة</a>
            ` : `
              <span class="small-btn disabled" style="opacity:0.6; cursor:default;">متاح قريباً</span>
            `}
          </div>
        </div>
      </article>
    `;
  }).join('');

  const renderEmptyResourcesState = `
    <div class="resources-empty-state" data-section="resources">
      <div class="empty-icon-shell">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      </div>
      <h3 class="empty-title">${escapeHtml(resourcesEmptyText || 'لا توجد مذكرات أو موارد متاحة حالياً')}</h3>
      <p class="empty-desc">${escapeHtml(resourcesSubtitle || 'سيتم إضافة المذكرات والملفات التعليمية قريباً.')}</p>
    </div>
  `;

  const buildResultCardHtml = (item: any, index: number, isModal: boolean = false) => {
    const name = escapeHtml(item.name || item.studentName || item.title || 'طالب متميز');
    const batch = escapeHtml(item.batch || item.year || item.grade || '');
    const score = escapeHtml(item.score || item.grade_score || item.result || '100%');
    const course = escapeHtml(item.course || item.courseName || item.subject || '');
    const image = normalizeImage(item.image || item.avatar || item.img || item.photo, '');
    const initial = (name || 'ط').trim().charAt(0) || 'ط';

    return `
      <article class="result-card" data-section="results" data-index="${index}">
        <div class="result-card-inner">
          <div class="result-avatar ${!image ? 'result-avatar-default' : ''}" style="${image ? `background-image:url('${image}')` : ''}">
            ${!image ? `<span class="result-avatar-initial">${escapeHtml(initial)}</span>` : ''}
          </div>
          <div class="result-info">
            <div class="result-header-row">
              <h3 class="result-student-name" style="${resultsTextColor ? `color: ${resultsTextColor};` : ''}">${name}</h3>
              <span class="result-score-badge">${score}</span>
            </div>
            <div class="result-meta-row">
              ${course ? `<span class="result-course-tag">${course}</span>` : ''}
              ${batch ? `<span class="result-batch-tag">${batch}</span>` : ''}
            </div>
          </div>
        </div>
      </article>
    `;
  };

  const visibleResults = activeResults.slice(0, resultsPreviewCount);
  const renderResultsPreviewCards = visibleResults.map((item: any, index: number) => buildResultCardHtml(item, index, false)).join('');
  const renderAllResultsCards = activeResults.map((item: any, index: number) => buildResultCardHtml(item, index, true)).join('');

  const renderEmptyResultsState = `
    <div class="results-empty-state" data-section="results">
      <div class="empty-icon-shell">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      </div>
      <h3 class="empty-title">${escapeHtml(resultsEmptyText)}</h3>
      <p class="empty-desc">${escapeHtml(resultsSubtitle)}</p>
    </div>
  `;

  // Section 8: Timeline Items
  const renderTimelineItems = aboutItems.map((item: any, index: number) => {
    const stage = escapeHtml(item.stage || item.year || item.number || String(index + 1));
    const title = escapeHtml(item.title || '');
    const description = escapeHtml(item.description || item.desc || '');
    return `
      <div class="timeline-item" data-section="about" data-index="${index}">
        <span class="timeline-badge">${stage}</span>
        <div class="timeline-content">
          ${title ? `<strong class="timeline-title" style="${aboutTextColor ? `color: ${aboutTextColor};` : ''}">${title}</strong>` : ''}
          ${description ? `<p class="timeline-desc" style="${aboutTextColor ? `color: ${aboutTextColor}; opacity: 0.8;` : ''}">${description}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');

  const renderEmptyTimelineState = `
    <div class="timeline-empty-state" data-section="about">
      <p class="empty-desc">لم تتم إضافة بنود خبرة أو مؤهلات بعد</p>
    </div>
  `;

  // Section 9: Gallery Cards
  const renderGalleryCards = galleryItems.map((item: any, index: number) => {
    const imgUrl = normalizeImage(item?.image_url || item?.image || item?.url || item, '');
    const caption = escapeHtml(item?.caption || item?.alt || item?.title || '');
    return `
      <figure class="gallery-item" data-section="gallery" data-index="${index}">
        <img src="${imgUrl}" alt="${caption || 'معرض الصف'}" loading="lazy" />
        ${caption ? `<figcaption class="gallery-caption">${caption}</figcaption>` : ''}
      </figure>
    `;
  }).join('');

  const renderEmptyGalleryState = `
    <div class="gallery-empty-state" data-section="gallery">
      <div class="empty-icon-shell">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </div>
      <h3 class="empty-title">${escapeHtml(galleryEmptyText)}</h3>
      <p class="empty-desc">${escapeHtml(gallerySubtitle)}</p>
    </div>
  `;

  // Section 10: Testimonials & Rating Stars
  const renderStarsSvg = (rating: number = 5) => {
    const r = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= r;
      stars += `<svg width="16" height="16" viewBox="0 0 24 24" fill="${isFilled ? '#f59e0b' : '#cbd5e1'}" stroke="${isFilled ? '#f59e0b' : '#cbd5e1'}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="star-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }
    return `<div class="quote-stars" aria-label="تقييم ${r} من 5">${stars}</div>`;
  };

  const renderTestimonialsCards = testimonialItems.map((item: any, index: number) => {
    const name = escapeHtml(item.name || item.author || item.studentName || '');
    const course = escapeHtml(item.course || item.courseName || item.role || '');
    const text = escapeHtml(item.text || item.quote || item.review || item.comment || '');
    const rating = Number(item.rating ?? 5);

    return `
      <article class="quote-card" data-section="testimonials" data-index="${index}">
        <div class="quote-top-row">
          ${renderStarsSvg(rating)}
          <div class="quote-mark">“</div>
        </div>
        <p class="quote-text" style="${testimonialsTextColor ? `color: ${testimonialsTextColor};` : ''}">${text}</p>
        <div class="quote-author">
          <strong style="${testimonialsTextColor ? `color: ${testimonialsTextColor};` : ''}">${name || 'طالب متميز'}</strong>
          ${course ? `<span class="quote-course">${course}</span>` : ''}
        </div>
      </article>
    `;
  }).join('');

  const renderEmptyTestimonialsState = `
    <div class="testimonials-empty-state" data-section="testimonials">
      <div class="empty-icon-shell">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h3 class="empty-title">${escapeHtml(testimonialsEmptyText)}</h3>
      <p class="empty-desc">${escapeHtml(testimonialsSubtitle)}</p>
    </div>
  `;

  // Section 11: FAQ Accordion Items
  const renderFaqAccordion = faqItems.map((item: any, index: number) => {
    const question = escapeHtml(item.question || item.q || '');
    const answer = escapeHtml(item.answer || item.a || '');
    return `
      <div class="faq-item" data-section="faq" data-index="${index}">
        <button type="button" class="faq-question" aria-expanded="false">
          <span style="${faqTextColor ? `color: ${faqTextColor};` : ''}">${question}</span>
          <span class="plus" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer">
          <p style="${faqTextColor ? `color: ${faqTextColor}; opacity: 0.85;` : ''}">${answer}</p>
        </div>
      </div>
    `;
  }).join('');

  const renderEmptyFaqState = `
    <div class="faq-empty-state" data-section="faq">
      <div class="empty-icon-shell">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <h3 class="empty-title">${escapeHtml(faqEmptyText)}</h3>
      <p class="empty-desc">${escapeHtml(faqSubtitle)}</p>
    </div>
  `;

  return `<!doctype html>
  <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
      <meta name="theme-color" content="#0f67ff" />
      <title>${escapeHtml(teacherName || 'البروفايل التعليمي')} | منصة المعلم</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800&family=Almarai:wght@400;700;800&family=Cairo:wght@400;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&family=Readex+Pro:wght@400;600;700&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
      <style>
        :root {
          --bg: #f8fafc;
          --surface: #ffffff;
          --text: #0f172a;
          --muted: #64748b;
          --line: #e2e8f0;
          --brand: #0f67ff;
          --brand2: #0052cc;
          --success: #059669;
          --radius: 20px;
          --shadow: 0 12px 32px rgba(15,23,42,.08);
          --max: 1180px;
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          font-family: "IBM Plex Sans Arabic", system-ui, -apple-system, sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.7;
          overflow-x: hidden;
        }
        button, input, a { font: inherit; }
        img { display: block; width: 100%; }
        a { color: inherit; text-decoration: none; }
        button { cursor: pointer; }
        .container { width: min(var(--max), calc(100% - 32px)); margin: auto; }
        .card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); box-shadow: 0 6px 20px rgba(15,23,42,.05); }
        .section { padding: 28px 0; }
        .section-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
        .section-header h2 { margin: 4px 0 0; font-size: clamp(20px, 3vw, 26px); font-weight: 800; color: var(--text); }
        .eyebrow { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px; background: #eaf2ff; color: var(--brand); font-size: 12px; font-weight: 700; }

        /* Topbar & Navbar */
        .topbar {
          position: sticky;
          top: 0;
          z-index: 60;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--line);
          transition: all 0.2s ease;
        }
        .topbar-inner {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          min-width: 0;
          flex-shrink: 1;
        }
        .brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, var(--brand), var(--brand2));
          color: #fff;
          font-weight: 800;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(15, 103, 255, 0.24);
          flex-shrink: 0;
        }
        .brand-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .brand-name {
          font-size: 15px;
          font-weight: 800;
          color: var(--text);
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .brand-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--muted);
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
        }
        .nav {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--muted);
          font-size: 14px;
          font-weight: 600;
          margin: 0 8px;
        }
        .nav-item {
          padding: 8px 14px;
          border-radius: 10px;
          transition: 0.15s ease;
          white-space: nowrap;
          cursor: pointer;
        }
        .nav-item:hover {
          background: #f1f5f9;
          color: var(--brand);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .action-icon-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: #f8fafc;
          color: #334155;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s ease;
          cursor: pointer;
          flex-shrink: 0;
        }
        .action-icon-btn:hover {
          background: #edf3ff;
          color: var(--brand);
          border-color: #bfdbfe;
          transform: translateY(-1px);
        }
        .action-icon-btn:active {
          transform: scale(0.96);
        }
        .primary-btn, .secondary-btn {
          border: none;
          border-radius: 12px;
          transition: 0.2s ease;
          cursor: pointer;
        }
        .primary-btn {
          background: linear-gradient(135deg, var(--brand), var(--brand2));
          color: white;
          font-weight: 700;
          padding: 11px 20px;
          box-shadow: 0 4px 14px rgba(15, 103, 255, 0.24);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
        }
        .primary-btn:hover {
          box-shadow: 0 6px 20px rgba(15, 103, 255, 0.32);
          transform: translateY(-1px);
        }
        .primary-btn:active { transform: scale(0.98); }
        .secondary-btn {
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 700;
          padding: 11px 18px;
          border: 1px solid #bfdbfe;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
        }
        .secondary-btn:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }
        .secondary-btn:active { transform: scale(0.98); }
        .nav-login-btn {
          font-size: 13.5px;
          padding: 10px 18px;
        }
        .mobile-toggle {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #edf3ff;
          border: 1px solid #bfdbfe;
          color: var(--brand);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
        }
        .mobile-nav-dropdown {
          position: absolute;
          top: 74px;
          left: 12px;
          right: 12px;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 16px;
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
          padding: 10px;
          flex-direction: column;
          gap: 4px;
          z-index: 70;
        }
        .mobile-nav-link {
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
          display: block;
          transition: background 0.15s ease;
        }
        .mobile-nav-link:hover {
          background: #f1f5f9;
          color: var(--brand);
        }

        /* Hero Profile Section */
        .hero { padding: 24px 0 16px; }
        .hero-shell {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06);
        }
        .hero-cover {
          height: 200px;
          position: relative;
          background-size: cover;
          background-position: center;
          background-color: #0f172a;
        }
        .hero-cover.hero-cover-default {
          background: linear-gradient(135deg, #0b1329 0%, #1e3a8a 50%, #0f172a 100%);
        }
        .hero-cover::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.45) 100%);
        }
        .hero-content {
          position: relative;
          padding: 0 28px 26px;
          margin-top: -56px;
        }
        .profile-header-area {
          display: flex;
          align-items: flex-end;
          gap: 20px;
          flex-wrap: wrap;
        }
        .avatar {
          width: 114px;
          height: 114px;
          border-radius: 50%;
          border: 4px solid #fff;
          background: #fff;
          background-size: cover;
          background-position: center;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);
          flex-shrink: 0;
          overflow: hidden;
        }
        .avatar.avatar-default {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          display: grid;
          place-items: center;
        }
        .avatar-initial {
          font-size: 42px;
          font-weight: 800;
          color: #ffffff;
          user-select: none;
        }
        .profile-identity {
          min-width: 0;
          flex: 1;
        }
        .profile-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .teacher-name {
          margin: 0;
          font-size: clamp(24px, 3.5vw, 34px);
          font-weight: 800;
          color: var(--text);
          line-height: 1.2;
        }
        .teacher-title {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 15px;
          font-weight: 600;
        }
        .verified {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ecfdf5;
          color: var(--success);
          border: 1px solid #a7f3d0;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }
        .bio-box {
          margin-top: 20px;
          background: #f8fafc;
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 18px 22px;
        }
        .teacher-description {
          margin: 0;
          color: #334155;
          font-size: 14.5px;
          line-height: 1.75;
        }
        .teacher-goal {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed var(--line);
          font-size: 13.5px;
          color: var(--text);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .goal-tag {
          background: #dbeafe;
          color: #1e40af;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 12px;
          margin-top: 20px;
        }
        .stat-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 16px 14px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07);
        }
        .stat-card strong {
          display: block;
          font-size: 26px;
          font-weight: 800;
          color: var(--text);
          line-height: 1.2;
        }
        .stat-card span {
          display: block;
          color: var(--muted);
          font-size: 12.5px;
          font-weight: 600;
          margin-top: 4px;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 22px;
          align-items: center;
        }

        /* Profile Tabs */
        .profile-tabs { padding: 12px 0 20px; }
        .tab-strip { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; }
        .tab-button {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 700;
          color: var(--muted);
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .tab-button:hover { background: #edf4ff; color: var(--brand); }
        .tab-button.active { background: var(--brand); color: #fff; border-color: var(--brand); }

        /* Grids & Cards */
        .mini-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
        .mini-card { background: #fff; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; transition: all 0.2s ease; }
        .mini-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(15,23,42,.08); }
        .thumb { height: 160px; background-size: cover; background-position: center; }
        .video-thumb { height: 160px; background-size: cover; background-position: center; position: relative; display: flex; align-items: center; justify-content: center; }
        .play-badge { width: 44px; height: 44px; border-radius: 50%; background: rgba(15,23,42,.75); color: #fff; display: grid; place-items: center; font-size: 16px; }
        .video-time { position: absolute; bottom: 8px; left: 8px; background: rgba(15,23,42,.8); color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 6px; }
        .card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; }
        .card-body.tight { padding: 12px; }
        .card-body h3 { margin: 6px 0; font-size: 16px; font-weight: 800; color: var(--text); }
        .card-body p { margin: 0 0 12px; font-size: 13px; color: var(--muted); line-height: 1.6; flex: 1; }
        .chip { display: inline-block; align-self: flex-start; padding: 3px 8px; border-radius: 6px; background: #edf4ff; color: var(--brand); font-size: 11px; font-weight: 700; }
        .course-meta { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 12px; margin-top: auto; }
        .price { font-weight: 800; color: var(--brand); font-size: 16px; }
        .small-btn { background: #edf4ff; color: var(--brand); border: none; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; transition: all 0.15s ease; }
        .small-btn:hover { background: var(--brand); color: #fff; }

        /* Steps - Clean Vertical Educational Flow */
        .steps-wrapper {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .step-item {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 20px 24px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
        }
        .step-item:hover {
          border-color: #cbd5e1;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
          transform: translateY(-1px);
        }
        .step-badge {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #edf4ff;
          color: var(--brand);
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(15, 103, 255, 0.12);
        }
        .step-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }
        .step-content h3.step-title {
          margin: 0 0 6px;
          font-size: 16.5px;
          font-weight: 800;
          color: var(--text);
          line-height: 1.4;
        }
        .step-content p.step-description {
          margin: 0;
          font-size: 14px;
          color: var(--muted);
          line-height: 1.65;
        }

        /* Courses Empty State */
        .courses-empty-state {
          grid-column: 1 / -1;
          background: #ffffff;
          border: 2px dashed var(--line);
          border-radius: var(--radius);
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 10px 0;
        }
        .courses-empty-state .empty-icon-shell {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: #f1f5f9;
          color: #64748b;
          display: grid;
          place-items: center;
          margin-bottom: 16px;
        }
        .courses-empty-state .empty-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
          margin: 0 0 6px;
        }
        .courses-empty-state .empty-desc {
          font-size: 14px;
          color: var(--muted);
          margin: 0;
          max-width: 440px;
        }

        /* Videos, Resources & Results Styles */
        .videos-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
        .videos-empty-state, .resources-empty-state, .results-empty-state {
          grid-column: 1 / -1;
          background: #ffffff;
          border: 2px dashed var(--line);
          border-radius: var(--radius);
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 10px 0;
        }
        .videos-empty-state .empty-icon-shell,
        .resources-empty-state .empty-icon-shell,
        .results-empty-state .empty-icon-shell {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: #f1f5f9;
          color: #64748b;
          display: grid;
          place-items: center;
          margin-bottom: 16px;
        }
        .videos-empty-state .empty-title,
        .resources-empty-state .empty-title,
        .results-empty-state .empty-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
          margin: 0 0 6px;
        }
        .videos-empty-state .empty-desc,
        .resources-empty-state .empty-desc,
        .results-empty-state .empty-desc {
          font-size: 14px;
          color: var(--muted);
          margin: 0;
          max-width: 440px;
        }

        .resource-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
        .resource-thumb-default {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          display: grid;
          place-items: center;
        }
        .resource-icon-badge {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #ffffff;
          color: var(--brand);
          display: grid;
          place-items: center;
          box-shadow: 0 4px 12px rgba(15, 103, 255, 0.12);
        }
        .resource-card-title { margin: 6px 0; font-size: 16px; font-weight: 800; color: var(--text); }
        .resource-card-desc { margin: 0 0 12px; font-size: 13px; color: var(--muted); line-height: 1.6; flex: 1; }
        .resource-meta { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: 12px; margin-top: auto; }

        .results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
        .result-card {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 18px 20px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
        }
        .result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
          border-color: #cbd5e1;
        }
        .result-card-inner {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .result-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
          flex-shrink: 0;
          overflow: hidden;
        }
        .result-avatar-default {
          background: linear-gradient(135deg, #0f67ff, #0052cc);
          display: grid;
          place-items: center;
        }
        .result-avatar-initial {
          color: #ffffff;
          font-size: 22px;
          font-weight: 800;
          user-select: none;
        }
        .result-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .result-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .result-student-name {
          margin: 0;
          font-size: 15.5px;
          font-weight: 800;
          color: var(--text);
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .result-score-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #059669;
          font-weight: 800;
          font-size: 13px;
          border: 1px solid #a7f3d0;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .result-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .result-course-tag {
          font-size: 12px;
          font-weight: 600;
          color: var(--muted);
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 6px;
        }
        .result-batch-tag {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--brand);
          background: #edf4ff;
          padding: 2px 8px;
          border-radius: 6px;
        }

        /* Results Modal Specific Styles */
        .results-modal-box {
          width: min(840px, calc(100% - 32px));
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          padding: 28px 24px 20px;
          text-align: right;
        }
        .results-modal-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--line);
        }
        .results-modal-header-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #eff6ff;
          color: var(--brand);
          display: grid;
          place-items: center;
          border: 1px solid #bfdbfe;
          flex-shrink: 0;
        }
        .results-modal-header-info {
          flex: 1;
          min-width: 0;
        }
        .results-modal-header-info h4 {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 800;
          color: var(--text);
        }
        .results-modal-header-info p {
          margin: 0;
          font-size: 13.5px;
          color: var(--muted);
        }
        .results-modal-body {
          overflow-y: auto;
          max-height: calc(88vh - 120px);
          padding-left: 4px;
          padding-right: 4px;
          -webkit-overflow-scrolling: touch;
        }
        .results-modal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
          padding-bottom: 8px;
        }

        @media (max-width: 640px) {
          .results-modal-box {
            padding: 20px 16px 16px;
          }
          .results-modal-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Section 8: About & Qualifications Timeline */
        .about-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: stretch; }
        .about-card { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 28px; box-shadow: 0 6px 20px rgba(15,23,42,.04); display: flex; flex-direction: column; }
        .about-card .eyebrow { margin-bottom: 12px; }
        .about-heading { margin: 0 0 14px; font-size: clamp(20px, 3vw, 26px); font-weight: 800; color: var(--text); line-height: 1.4; }
        .about-description { font-size: 15px; color: #334155; line-height: 1.8; margin: 0; white-space: pre-line; }
        
        .timeline-card { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 28px; box-shadow: 0 6px 20px rgba(15,23,42,.04); display: flex; flex-direction: column; }
        .timeline-head { font-weight: 800; font-size: 18px; margin-bottom: 18px; color: var(--text); border-bottom: 1px solid var(--line); padding-bottom: 12px; }
        .timeline-list { display: flex; flex-direction: column; gap: 14px; }
        .timeline-item { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: flex-start; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
        .timeline-item:last-child { border-bottom: none; padding-bottom: 0; }
        .timeline-badge { display: inline-flex; align-items: center; justify-content: center; background: #edf4ff; color: var(--brand); border-radius: 999px; font-size: 12px; font-weight: 800; padding: 6px 12px; white-space: nowrap; height: fit-content; }
        .timeline-content { min-width: 0; }
        .timeline-title { display: block; font-size: 15px; font-weight: 800; margin-bottom: 4px; color: var(--text); }
        .timeline-desc { margin: 0; color: var(--muted); font-size: 13.5px; line-height: 1.6; }
        .timeline-empty-state { padding: 24px 16px; text-align: center; background: #f8fafc; border: 1px dashed var(--line); border-radius: 14px; color: var(--muted); font-size: 13.5px; }

        /* Section 9: Gallery & Empty State */
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .gallery-item { margin: 0; border-radius: 16px; overflow: hidden; height: 200px; border: 1px solid var(--line); background: #f1f5f9; position: relative; box-shadow: 0 4px 14px rgba(15,23,42,0.04); transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .gallery-item:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(15,23,42,0.08); }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-caption { position: absolute; bottom: 0; inset-inline: 0; background: linear-gradient(to top, rgba(15,23,42,0.85), transparent); color: #fff; padding: 20px 12px 10px; font-size: 12.5px; font-weight: 700; text-align: center; }
        .gallery-empty-state { padding: 36px 20px; text-align: center; background: #fff; border: 1px dashed var(--line); border-radius: 20px; }

        /* Section 10: Testimonials & Rating Stars */
        .quote-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .quote-card { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 14px rgba(15,23,42,0.04); border-top: 3px solid var(--brand); }
        .quote-top-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
        .quote-stars { display: flex; align-items: center; gap: 3px; }
        .quote-stars svg { width: 16px; height: 16px; }
        .quote-mark { font-size: 28px; font-weight: 800; color: var(--brand); line-height: 1; opacity: 0.8; }
        .quote-text { margin: 0 0 16px; font-size: 14px; color: #334155; line-height: 1.7; flex: 1; }
        .quote-author { border-top: 1px solid var(--line); padding-top: 12px; display: flex; flex-direction: column; gap: 2px; }
        .quote-author strong { display: block; font-size: 14.5px; font-weight: 800; color: var(--text); }
        .quote-course { font-size: 12px; color: var(--brand); font-weight: 600; }
        .testimonials-empty-state { padding: 36px 20px; text-align: center; background: #fff; border: 1px dashed var(--line); border-radius: 20px; }

        /* Section 11: FAQ Accordion */
        .faq-list { display: flex; flex-direction: column; gap: 12px; max-width: 880px; margin: 0 auto; }
        .faq-item { background: #fff; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(15,23,42,0.02); }
        .faq-item:hover { border-color: #cbd5e1; }
        .faq-question { width: 100%; background: none; border: none; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; text-align: right; font-weight: 700; font-size: 15px; color: var(--text); cursor: pointer; gap: 14px; }
        .faq-question .plus { font-size: 22px; font-weight: 700; color: var(--brand); transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); line-height: 1; flex-shrink: 0; }
        .faq-answer { display: none; padding: 0 20px 18px; }
        .faq-answer p { margin: 0; font-size: 14px; color: #475569; line-height: 1.75; }
        .faq-item.open { border-color: #bfdbfe; box-shadow: 0 6px 20px rgba(15, 103, 255, 0.08); }
        .faq-item.open .faq-answer { display: block; border-top: 1px solid #f1f5f9; padding-top: 14px; }
        .faq-item.open .faq-question .plus { transform: rotate(45deg); color: #dc2626; }
        .faq-empty-state { padding: 36px 20px; text-align: center; background: #fff; border: 1px dashed var(--line); border-radius: 20px; }

        /* Section 12: Final CTA */
        .cta-box { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); border-radius: 24px; padding: 40px 36px; color: #fff; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; box-shadow: 0 16px 36px rgba(15,23,42,0.14); }
        .cta-info { flex: 1; min-width: 280px; }
        .cta-box h2.cta-title { margin: 8px 0; font-size: clamp(22px, 3vw, 30px); font-weight: 800; color: #fff; }
        .cta-box p.cta-desc { margin: 0; color: #cbd5e1; font-size: 14.5px; line-height: 1.7; max-width: 580px; }
        .cta-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .cta-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 24px; border-radius: 14px; font-weight: 800; font-size: 14.5px; text-decoration: none; transition: all 0.2s ease; border: none; cursor: pointer; }
        .primary-cta-btn { background: var(--brand); color: #fff; box-shadow: 0 6px 18px rgba(15, 103, 255, 0.35); }
        .primary-cta-btn:hover { background: var(--brand2); transform: translateY(-1px); }
        .whatsapp-cta-btn { background: #25D366; color: #fff; box-shadow: 0 6px 18px rgba(37, 211, 102, 0.3); }
        .whatsapp-cta-btn:hover { background: #20ba5a; transform: translateY(-1px); }
        .eyebrow-light { background: rgba(255,255,255,0.14); color: #fff; }

        /* Footer */
        footer { padding: 28px 0 48px; }
        .footer-box { border-top: 1px solid var(--line); padding-top: 20px; display: flex; align-items: center; justify-content: space-between; gap: 10px; color: var(--muted); font-size: 13.5px; }

        /* Bottom Nav */
        .bottom-nav { position: sticky; bottom: 0; z-index: 30; display: none; background: rgba(255,255,255,.96); backdrop-filter: blur(12px); border-top: 1px solid var(--line); padding: 10px 12px 12px; gap: 8px; }
        .bottom-nav-item { flex: 1; border: none; background: #edf3ff; color: var(--brand); border-radius: 12px; min-height: 44px; font-weight: 700; font-size: 13px; }
        .bottom-nav-item.active { background: var(--brand); color: #fff; }

        .ghost-btn { border: 1px solid var(--line); background: #fff; color: var(--brand); border-radius: 999px; padding: 8px 16px; font-weight: 700; font-size: 13px; }
        .ghost-btn.light { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.18); color: #fff; }

        /* Screen Layer (Video Library / Course Library / Resource Library / About Screen) */
        .screen-layer {
          position: fixed;
          inset: 0;
          background: rgba(11, 18, 32, 0.45);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: none;
          z-index: 90;
          padding: 24px 16px 90px;
          overflow-y: auto;
        }
        .screen-layer.show { display: block; }
        .screen-header {
          max-width: 760px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: #fff;
          border-radius: 18px 18px 0 0;
          padding: 16px;
          border: 1px solid var(--line);
          border-bottom: none;
        }
        .screen-header h3 { margin: 0; font-size: 20px; font-weight: 800; }
        .screen-back, .screen-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #eef4ff;
          color: var(--brand);
          font-size: 20px;
          font-weight: 800;
          display: grid;
          place-items: center;
          cursor: pointer;
        }
        .screen-body {
          max-width: 760px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 0 0 18px 18px;
          padding: 20px;
        }
        .search-box { margin-bottom: 12px; }
        .search-input {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 12px;
          min-height: 42px;
          padding: 10px 14px;
          font-size: 14px;
          outline: none;
        }
        .search-input:focus { border-color: var(--brand); }
        .screen-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(180px, 1fr));
          gap: 14px;
        }
        .detail-card { background: #f8fafc; border: 1px solid var(--line); border-radius: 18px; padding: 20px; }
        .detail-list { margin-top: 16px; }
        .detail-list strong { display: block; margin-bottom: 8px; }
        .detail-list ul { margin: 0; padding-right: 18px; color: var(--muted); }
        .detail-thumb { height: 180px; border-radius: 16px; background-size: cover; background-position: center; margin-bottom: 12px; }

        /* Contact Modal Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: none;
          z-index: 120;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .modal-backdrop.show { display: flex; }
        .modal-box {
          background: #ffffff;
          border-radius: 24px;
          width: min(420px, 100%);
          position: relative;
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.22);
          border: 1px solid var(--line);
          padding: 32px 24px 24px;
          text-align: center;
          animation: modalScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-close {
          position: absolute;
          top: 14px;
          left: 14px;
          border: none;
          background: #f1f5f9;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          font-size: 15px;
          color: var(--muted);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.15s ease;
        }
        .modal-close:hover {
          background: #e2e8f0;
          color: var(--text);
        }
        .modal-header-icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          background: #eff6ff;
          color: #0f67ff;
          display: grid;
          place-items: center;
          margin: 0 auto 16px;
          border: 1px solid #bfdbfe;
        }
        .modal-body h4 {
          margin: 0 0 8px;
          font-size: 20px;
          font-weight: 800;
          color: var(--text);
        }
        .modal-body p {
          color: var(--muted);
          margin: 0 0 22px;
          font-size: 14px;
          line-height: 1.6;
        }
        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .contact-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 13px 20px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        .whatsapp-btn {
          background: #25D366;
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(37, 211, 102, 0.28);
        }
        .whatsapp-btn:hover {
          background: #20ba5a;
          box-shadow: 0 8px 22px rgba(37, 211, 102, 0.36);
          transform: translateY(-1px);
        }
        .phone-btn {
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.18);
        }
        .phone-btn:hover {
          background: #1e293b;
          transform: translateY(-1px);
        }
        .empty-contact-note {
          color: var(--muted);
          font-size: 13px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px dashed var(--line);
        }
        .toast {
          position: fixed;
          left: 50%;
          bottom: 88px;
          transform: translateX(-50%) translateY(18px);
          background: #111827;
          color: #fff;
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 13.5px;
          opacity: 0;
          pointer-events: none;
          transition: 0.2s ease;
          z-index: 130;
          box-shadow: 0 10px 25px rgba(0,0,0,.2);
        }
        .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* Responsive Breakpoints (320px, 375px, 430px, Desktop) */
        @media (max-width: 860px) {
          .nav { display: none; }
          .mobile-toggle { display: inline-flex; }
          .header-actions { gap: 6px; }
          .action-icon-btn { width: 38px; height: 38px; }
          .nav-login-btn { padding: 8px 14px; font-size: 12px; }
          .brand-name { max-width: 120px; }
          .brand-title { max-width: 120px; }
          .profile-header-area { align-items: flex-start; flex-direction: column; gap: 14px; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .hero-actions { width: 100%; }
          .hero-actions button { flex: 1; }
          .about-two-col { grid-template-columns: 1fr; }
          .screen-grid { grid-template-columns: 1fr; }
          .cta-box { flex-direction: column; align-items: flex-start; }
          .bottom-nav { display: flex; }
        }

        @media (max-width: 440px) {
          .container { width: calc(100% - 20px); }
          .brand { gap: 8px; }
          .brand-mark { width: 36px; height: 36px; font-size: 15px; border-radius: 10px; }
          .brand-name { font-size: 13px; max-width: 80px; }
          .brand-title { font-size: 10.5px; max-width: 80px; }
          .header-actions { gap: 5px; }
          .action-icon-btn { width: 35px; height: 35px; border-radius: 10px; }
          .action-icon-btn svg { width: 16px; height: 16px; }
          .nav-login-btn { padding: 7px 11px; font-size: 11.5px; border-radius: 10px; }
          .mobile-toggle { width: 35px; height: 35px; border-radius: 10px; }
          .stats { grid-template-columns: 1fr; }
          .hero-actions button { width: 100%; }
          .step-item { padding: 15px 16px; gap: 14px; border-radius: 14px; }
          .step-badge { width: 38px; height: 38px; font-size: 16px; border-radius: 11px; }
          .step-content h3.step-title { font-size: 15px; }
          .step-content p.step-description { font-size: 13px; }
        }
      </style>
    </head>
    <body id="top">
      <!-- Section 1: Topbar Navbar -->
      <header class="topbar" data-section="navbar">
        <div class="container topbar-inner">
          <div class="brand">
            <div class="brand-mark">${escapeHtml((teacherName || 'م').trim().charAt(0) || 'م')}</div>
            <div class="brand-text">
              <span class="brand-name">${escapeHtml(teacherName || 'اسم المعلم')}</span>
              <span class="brand-title">${escapeHtml(teacherTitle || 'مدرس المادة')}</span>
            </div>
          </div>
          
          <nav class="nav" aria-label="Main Navigation">
            ${navItems.map((item) => `
              <a href="#${escapeHtml(item.target)}" data-scroll="${escapeHtml(item.target)}" data-scroll-target="#${escapeHtml(item.target)}" class="nav-item">
                ${escapeHtml(item.label)}
              </a>
            `).join('')}
          </nav>

          <div class="header-actions">
            ${videoIconVisible ? `
              <button type="button" class="action-icon-btn" data-open-screen="video-library" title="مكتبة الفيديوهات" aria-label="مكتبة الفيديوهات">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            ` : ''}
            ${contactIconVisible ? `
              <button type="button" class="action-icon-btn" data-contact-action="true" title="${escapeHtml(contactModalTitle || 'تواصل مع الفريق')}" aria-label="تواصل مع الفريق">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </button>
            ` : ''}
            <a href="/auth/login" class="primary-btn nav-login-btn">${escapeHtml(loginButtonText || 'تسجيل الدخول')}</a>
          </div>

          <button type="button" class="mobile-toggle" aria-label="قائمة التنقل">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation Dropdown -->
        <div class="mobile-nav-dropdown" id="mobile-nav-menu" style="display:none;">
          ${navItems.map((item) => `
            <a href="#${escapeHtml(item.target)}" data-scroll="${escapeHtml(item.target)}" data-scroll-target="#${escapeHtml(item.target)}" class="mobile-nav-link">
              ${escapeHtml(item.label)}
            </a>
          `).join('')}
        </div>
      </header>

      <main>
        <!-- Section 2: Hero Profile -->
        <section class="hero section" data-section="profile" data-index="0">
          <div class="container hero-shell">
            <div class="hero-cover ${coverImage ? '' : 'hero-cover-default'}" style="${coverImage ? `background-image:url('${coverImage}')` : ''}"></div>
            <div class="hero-content">
              <!-- 1. Teacher Image (Circular Avatar) -->
              <div class="profile-header-area">
                <div class="avatar ${avatarImage ? '' : 'avatar-default'}" style="${avatarImage ? `background-image:url('${avatarImage}')` : ''}">
                  ${!avatarImage ? `<div class="avatar-initial">${escapeHtml((teacherName || 'م').trim().charAt(0) || 'م')}</div>` : ''}
                </div>
                
                <!-- 2. Teacher Name, Verified Badge, 3. Job Title -->
                <div class="profile-identity">
                  <div class="profile-name-row">
                    <h1 class="teacher-name">${escapeHtml(teacherName || 'اسم المعلم')}</h1>
                    ${verifiedVisible ? `
                      <div class="verified">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>${escapeHtml(verifiedText || 'موثّق')}</span>
                      </div>
                    ` : ''}
                  </div>
                  <p class="teacher-title">${escapeHtml(teacherTitle || 'مدرس المادة')}</p>
                </div>
              </div>

              <!-- 4. Teacher Description & 5. Teacher Goal / Mission -->
              ${(profileBio || profileGoal) ? `
                <div class="bio-box" data-section="profile">
                  ${profileBio ? `<p class="teacher-description">${escapeHtml(profileBio)}</p>` : ''}
                  ${profileGoal ? `<div class="teacher-goal"><span class="goal-tag">الهدف</span> <span class="goal-text">${escapeHtml(profileGoal)}</span></div>` : ''}
                </div>
              ` : ''}

              <!-- 7. Achievement Cards (0 to 4 cards) -->
              ${renderStatCards ? `<div class="stats">${renderStatCards}</div>` : ''}

              <!-- 8. CTA Buttons -->
              <div class="hero-actions">
                <button type="button" class="primary-btn" data-hero-btn="primary" data-open-screen="course-library" style="${ctaPrimaryBg ? `background: ${ctaPrimaryBg};` : ''} ${ctaPrimaryTextColor ? `color: ${ctaPrimaryTextColor};` : ''}">
                  <span>${escapeHtml(startLearningLabel || 'ابدأ التعلم')}</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:6px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <button type="button" class="secondary-btn" data-hero-btn="secondary" data-open-screen="video-library" style="${ctaSecondaryBg ? `background-color: ${ctaSecondaryBg};` : ''} ${ctaSecondaryTextColor ? `color: ${ctaSecondaryTextColor};` : ''}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-left:6px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  <span>${escapeHtml(watchVideosLabel || 'شاهد الفيديوهات')}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: Profile Tabs -->
        <nav class="profile-tabs container" aria-label="Profile tabs" data-section="tabs" data-index="0">
          <div class="tab-strip">
            <button type="button" class="tab-button active" data-scroll-target="#top">الرئيسية</button>
            <button type="button" class="tab-button" data-scroll-target="#courses">الدورات</button>
            <button type="button" class="tab-button" data-scroll-target="#videos">الفيديوهات</button>
            <button type="button" class="tab-button" data-scroll-target="#resources">الموارد</button>
            <button type="button" class="tab-button" data-scroll-target="#about">نبذة</button>
          </div>
        </nav>

        <!-- Section 4: Courses Section -->
        <section class="section" id="courses" data-section="courses" data-index="0" style="${coursesBg ? `background-color: ${coursesBg};` : ''} ${coursesTextColor ? `color: ${coursesTextColor};` : ''}">
          <div class="container">
            <div class="section-header" style="${coursesFontFamily ? `font-family: '${coursesFontFamily}', system-ui, sans-serif;` : ''}">
              <div>
                <h2 class="courses-heading" style="${coursesTextColor ? `color: ${coursesTextColor};` : ''} ${coursesFontFamily ? `font-family: '${coursesFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(coursesTitle || 'الكورسات المتاحة')}</h2>
                <p class="courses-caption" style="${coursesTextColor ? `color: ${coursesTextColor}; opacity: 0.85;` : 'color: var(--muted);'} margin: 6px 0 0; font-size: 14px; ${coursesFontFamily ? `font-family: '${coursesFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(coursesSubtitle || 'اختار الكورس المناسب ليك وابدأ رحلتك التعليمية.')}</p>
              </div>
              <button type="button" class="ghost-btn" data-open-screen="course-library">عرض الكل</button>
            </div>
            <div class="mini-grid courses-grid">
              ${displayedCourses.length > 0 ? renderCourseCards : renderEmptyCoursesState}
            </div>
          </div>
        </section>

        <!-- Section 5: Steps Section -->
        <section class="section" id="steps" data-section="steps" data-index="0" style="${stepsBg ? `background-color: ${stepsBg};` : ''} ${stepsTextColor ? `color: ${stepsTextColor};` : ''}">
          <div class="container">
            <div class="steps-header" style="max-width: 760px; margin: 0 auto 28px; text-align: center; ${stepsFontFamily ? `font-family: '${stepsFontFamily}', system-ui, sans-serif;` : ''}">
              <h2 class="steps-heading" style="${stepsTextColor ? `color: ${stepsTextColor};` : ''} ${stepsFontFamily ? `font-family: '${stepsFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(stepsTitle || 'لسه أول مرة تذاكر معايا؟')}</h2>
              <p class="steps-caption" style="${stepsTextColor ? `color: ${stepsTextColor}; opacity: 0.85;` : 'color: var(--muted);'} margin: 8px 0 0; font-size: 14.5px; ${stepsFontFamily ? `font-family: '${stepsFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(stepsSubtitle || 'ابدأ بالخطوات دي، وفي دقائق هتعرف أنسب مكان ليك.')}</p>
            </div>
            <div class="steps-wrapper" style="${stepsFontFamily ? `font-family: '${stepsFontFamily}', system-ui, sans-serif;` : ''}">
              ${renderStepItems}
            </div>
          </div>
        </section>

        <!-- Section 5: Videos Section -->
        <section class="section" id="videos" data-section="videos" data-index="0" style="${videosBg ? `background-color: ${videosBg};` : ''} ${videosTextColor ? `color: ${videosTextColor};` : ''}">
          <div class="container">
            <div class="section-header" style="${videosFontFamily ? `font-family: '${videosFontFamily}', system-ui, sans-serif;` : ''}">
              <div>
                <h2 class="videos-heading" style="${videosTextColor ? `color: ${videosTextColor};` : ''} ${videosFontFamily ? `font-family: '${videosFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(videosTitle || 'أحدث الفيديوهات')}</h2>
                <p class="videos-caption" style="${videosTextColor ? `color: ${videosTextColor}; opacity: 0.85;` : 'color: var(--muted);'} margin: 6px 0 0; font-size: 14px; ${videosFontFamily ? `font-family: '${videosFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(videosSubtitle || 'شاهد أحدث الشروحات والدروس المصورة.')}</p>
              </div>
              ${videoItems.length > 0 ? `
                <button type="button" class="ghost-btn" data-open-screen="video-library">${escapeHtml(videosViewAllLabel || 'عرض الجميع')}</button>
              ` : ''}
            </div>
            <div class="mini-grid videos-grid">
              ${videoItems.length > 0 ? renderVideoCards : renderEmptyVideosState}
            </div>
          </div>
        </section>

        <!-- Section 6: Resources Section -->
        <section class="section" id="resources" data-section="resources" data-index="0" style="${resourcesBg ? `background-color: ${resourcesBg};` : ''} ${resourcesTextColor ? `color: ${resourcesTextColor};` : ''}">
          <div class="container">
            <div class="section-header" style="${resourcesFontFamily ? `font-family: '${resourcesFontFamily}', system-ui, sans-serif;` : ''}">
              <div>
                <h2 class="resources-heading" style="${resourcesTextColor ? `color: ${resourcesTextColor};` : ''} ${resourcesFontFamily ? `font-family: '${resourcesFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(resourcesTitle || 'المذكرات والمصادر')}</h2>
                <p class="resources-caption" style="${resourcesTextColor ? `color: ${resourcesTextColor}; opacity: 0.85;` : 'color: var(--muted);'} margin: 6px 0 0; font-size: 14px; ${resourcesFontFamily ? `font-family: '${resourcesFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(resourcesSubtitle || 'حمل مذكرات الشرح والمراجعات الشاملة لجميع الدروس.')}</p>
              </div>
              ${resourceItems.length > 0 ? `
                <button type="button" class="ghost-btn" data-open-screen="resource-library">${escapeHtml(resourcesViewAllLabel || 'عرض الكل')}</button>
              ` : ''}
            </div>
            <div class="resource-grid">
              ${resourceItems.length > 0 ? renderResourceCards : renderEmptyResourcesState}
            </div>
          </div>
        </section>

        <!-- Section 7: Results Section -->
        <section class="section" id="results" data-section="results" data-index="0" style="${resultsBg ? `background-color: ${resultsBg};` : ''} ${resultsTextColor ? `color: ${resultsTextColor};` : ''}">
          <div class="container">
            <div class="section-header" style="${resultsFontFamily ? `font-family: '${resultsFontFamily}', system-ui, sans-serif;` : ''}">
              <div>
                <h2 class="results-heading" style="${resultsTextColor ? `color: ${resultsTextColor};` : ''} ${resultsFontFamily ? `font-family: '${resultsFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(resultsTitle || 'نتائج الطلاب المتفوقين')}</h2>
                <p class="results-caption" style="${resultsTextColor ? `color: ${resultsTextColor}; opacity: 0.85;` : 'color: var(--muted);'} margin: 6px 0 0; font-size: 14px; ${resultsFontFamily ? `font-family: '${resultsFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(resultsSubtitle || 'فخورون بنتائج وتفوق طلابنا في كل مرحلة دراسية.')}</p>
              </div>
              ${activeResults.length > resultsPreviewCount ? `
                <button type="button" class="ghost-btn" data-open-modal="results-modal">${escapeHtml(resultsViewAllLabel || 'عرض جميع النتائج')}</button>
              ` : ''}
            </div>
            ${activeResults.length > 0 ? `
              <div class="results-grid">
                ${renderResultsPreviewCards}
              </div>
            ` : renderEmptyResultsState}
          </div>
        </section>

        <!-- Section 8: About & Qualifications Section -->
        <section class="section" id="about" data-section="about" data-index="0" style="${aboutBg ? `background-color: ${aboutBg};` : ''} ${aboutTextColor ? `color: ${aboutTextColor};` : ''}">
          <div class="container">
            <div class="about-two-col" style="${aboutFontFamily ? `font-family: '${aboutFontFamily}', system-ui, sans-serif;` : ''}">
              <!-- Part A: Teacher Description -->
              <div class="about-card">
                ${aboutCaption ? `<div class="eyebrow">${escapeHtml(aboutCaption)}</div>` : ''}
                <h2 class="about-heading" style="${aboutTextColor ? `color: ${aboutTextColor};` : ''} ${aboutFontFamily ? `font-family: '${aboutFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(aboutTitle || 'الخبرة والمنهجية التعليمية')}</h2>
                <p class="about-description" style="${aboutTextColor ? `color: ${aboutTextColor};` : ''}">${escapeHtml(aboutDescription || profileBio || 'أعتمد على أسلوب تدريسي يجمع بين الشرح المبسط، التطبيق المكثف، والتقييم المستمر لضمان أعلى مستوى من الاستيعاب والتفوق.')}</p>
              </div>

              <!-- Part B: Experience & Qualifications Timeline -->
              <div class="timeline-card">
                <div class="timeline-head" style="${aboutTextColor ? `color: ${aboutTextColor};` : ''}">${escapeHtml(aboutTimelineTitle || 'المؤهلات والمسيرة المهنية')}</div>
                ${aboutItems.length > 0 ? `
                  <div class="timeline-list">
                    ${renderTimelineItems}
                  </div>
                ` : renderEmptyTimelineState}
              </div>
            </div>
          </div>
        </section>

        <!-- Section 9: Gallery Section -->
        <section class="section" id="gallery" data-section="gallery" data-index="0" style="${galleryBg ? `background-color: ${galleryBg};` : ''} ${galleryTextColor ? `color: ${galleryTextColor};` : ''}">
          <div class="container">
            <div class="section-header" style="${galleryFontFamily ? `font-family: '${galleryFontFamily}', system-ui, sans-serif;` : ''}">
              <div>
                ${galleryCaption ? `<div class="eyebrow">${escapeHtml(galleryCaption)}</div>` : ''}
                <h2 style="${galleryTextColor ? `color: ${galleryTextColor};` : ''} ${galleryFontFamily ? `font-family: '${galleryFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(galleryTitle || 'لقطات من البيئة التعليمية')}</h2>
                ${gallerySubtitle ? `<p style="${galleryTextColor ? `color: ${galleryTextColor}; opacity: 0.85;` : 'color: var(--muted);'} margin: 6px 0 0; font-size: 14px; ${galleryFontFamily ? `font-family: '${galleryFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(gallerySubtitle)}</p>` : ''}
              </div>
            </div>
            ${galleryItems.length > 0 ? `
              <div class="gallery-grid">
                ${renderGalleryCards}
              </div>
            ` : renderEmptyGalleryState}
          </div>
        </section>

        <!-- Section 10: Testimonials Section -->
        <section class="section" id="testimonials" data-section="testimonials" data-index="0" style="${testimonialsBg ? `background-color: ${testimonialsBg};` : ''} ${testimonialsTextColor ? `color: ${testimonialsTextColor};` : ''}">
          <div class="container">
            <div class="section-header" style="${testimonialsFontFamily ? `font-family: '${testimonialsFontFamily}', system-ui, sans-serif;` : ''}">
              <div>
                ${testimonialsCaption ? `<div class="eyebrow">${escapeHtml(testimonialsCaption)}</div>` : ''}
                <h2 style="${testimonialsTextColor ? `color: ${testimonialsTextColor};` : ''} ${testimonialsFontFamily ? `font-family: '${testimonialsFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(testimonialsTitle || 'ماذا يقول طلابنا المتفوقون؟')}</h2>
                ${testimonialsSubtitle ? `<p style="${testimonialsTextColor ? `color: ${testimonialsTextColor}; opacity: 0.85;` : 'color: var(--muted);'} margin: 6px 0 0; font-size: 14px; ${testimonialsFontFamily ? `font-family: '${testimonialsFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(testimonialsSubtitle)}</p>` : ''}
              </div>
            </div>
            ${testimonialItems.length > 0 ? `
              <div class="quote-grid">
                ${renderTestimonialsCards}
              </div>
            ` : renderEmptyTestimonialsState}
          </div>
        </section>

        <!-- Section 11: FAQ Section -->
        <section class="section" id="faq" data-section="faq" data-index="0" style="${faqBg ? `background-color: ${faqBg};` : ''} ${faqTextColor ? `color: ${faqTextColor};` : ''}">
          <div class="container">
            <div class="section-header" style="text-align: center; justify-content: center; flex-direction: column; align-items: center; margin-bottom: 28px; ${faqFontFamily ? `font-family: '${faqFontFamily}', system-ui, sans-serif;` : ''}">
              ${faqCaption ? `<div class="eyebrow" style="margin-bottom: 8px;">${escapeHtml(faqCaption)}</div>` : ''}
              <h2 style="${faqTextColor ? `color: ${faqTextColor};` : ''} ${faqFontFamily ? `font-family: '${faqFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(faqTitle || 'كل ما تود معرفته عن طريقة الدراسة والمتابعة')}</h2>
              ${faqSubtitle ? `<p style="${faqTextColor ? `color: ${faqTextColor}; opacity: 0.85;` : 'color: var(--muted);'} margin: 6px 0 0; font-size: 14px; ${faqFontFamily ? `font-family: '${faqFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(faqSubtitle)}</p>` : ''}
            </div>
            ${faqItems.length > 0 ? `
              <div class="faq-list">
                ${renderFaqAccordion}
              </div>
            ` : renderEmptyFaqState}
          </div>
        </section>

        <!-- Section 12: Final CTA Section -->
        <section class="section" id="cta" data-section="cta" data-index="0" style="${ctaBg ? `background-color: ${ctaBg};` : ''} ${ctaTextColor ? `color: ${ctaTextColor};` : ''}">
          <div class="container">
            <div class="cta-box" style="${ctaBg ? `background: ${ctaBg};` : ''} ${ctaTextColor ? `color: ${ctaTextColor};` : ''} ${ctaFontFamily ? `font-family: '${ctaFontFamily}', system-ui, sans-serif;` : ''}">
              <div class="cta-info">
                ${ctaCaption ? `<div class="eyebrow eyebrow-light">${escapeHtml(ctaCaption)}</div>` : ''}
                <h2 class="cta-title" style="${ctaTextColor ? `color: ${ctaTextColor};` : ''} ${ctaFontFamily ? `font-family: '${ctaFontFamily}', system-ui, sans-serif;` : ''}">${escapeHtml(ctaTitle || 'احجز مكانك في مجموعاتنا التعليمية الآن')}</h2>
                <p class="cta-desc" style="${ctaTextColor ? `color: ${ctaTextColor}; opacity: 0.9;` : ''}">${escapeHtml(ctaDescription || 'انضم إلينا وابدأ رحلة التفوق مع أسلوب تعليمي متميز ومتابعة دقيقة.')}</p>
              </div>
              <div class="cta-actions">
                ${ctaWhatsappUrl ? `
                  <a href="${escapeHtml(ctaWhatsappUrl)}" target="_blank" rel="noopener noreferrer" class="cta-btn whatsapp-cta-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>${escapeHtml(ctaWhatsappLabel || 'كلمنا على الواتساب')}</span>
                  </a>
                ` : `
                  <button type="button" class="cta-btn whatsapp-cta-btn" data-contact-action="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>${escapeHtml(ctaWhatsappLabel || 'كلمنا على الواتساب')}</span>
                  </button>
                `}
                ${ctaPrimaryLink.startsWith('#') ? `
                  <a href="${escapeHtml(ctaPrimaryLink)}" data-scroll="${escapeHtml(ctaPrimaryLink.replace('#', ''))}" class="cta-btn primary-cta-btn">${escapeHtml(ctaPrimaryLabel || 'ابدأ التعلم')}</a>
                ` : `
                  <a href="${escapeHtml(ctaPrimaryLink)}" class="cta-btn primary-cta-btn">${escapeHtml(ctaPrimaryLabel || 'ابدأ التعلم')}</a>
                `}
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer data-section="footer" data-index="0">
        <div class="container footer-box">
          <div>${escapeHtml((content as any)?.footer?.text || '© 2025 جميع الحقوق محفوظة')}</div>
          <div>${escapeHtml(profileEmail || profilePhone || '')}</div>
        </div>
      </footer>

      <!-- Mobile Bottom Navigation -->
      <nav class="bottom-nav" aria-label="Mobile bottom navigation" data-section="mobileNav" data-index="0">
        <button type="button" class="bottom-nav-item active" data-scroll-target="#top">الرئيسية</button>
        <button type="button" class="bottom-nav-item" data-open-screen="course-library">الدورات</button>
        <button type="button" class="bottom-nav-item" data-open-screen="video-library">فيديو</button>
        <button type="button" class="bottom-nav-item" data-open-screen="resource-library">مصادر</button>
        <button type="button" class="bottom-nav-item" data-contact-action="true">تواصل</button>
      </nav>

      <!-- Screen Layers -->
      <div class="screen-layer" id="course-library" aria-hidden="true">
        <div class="screen-header">
          <button type="button" class="screen-back" data-close-screen="course-library">‹</button>
          <h3>مكتبة الدورات</h3>
          <button type="button" class="screen-close" data-close-screen="course-library">×</button>
        </div>
        <div class="screen-body">
          <div class="search-box">
            <input type="search" class="search-input" data-search-target="course-library" placeholder="ابحث عن دورة..." />
          </div>
          <div class="screen-grid" data-screen-list="course-library">
            ${renderCourseCards || renderEmptyCoursesState}
          </div>
        </div>
      </div>

      <div class="screen-layer" id="video-library" aria-hidden="true">
        <div class="screen-header">
          <button type="button" class="screen-back" data-close-screen="video-library">‹</button>
          <h3>مكتبة الفيديوهات</h3>
          <button type="button" class="screen-close" data-close-screen="video-library">×</button>
        </div>
        <div class="screen-body">
          <div class="search-box">
            <input type="search" class="search-input" data-search-target="video-library" placeholder="ابحث عن فيديو..." />
          </div>
          <div class="screen-grid" data-screen-list="video-library">
            ${renderVideoCards || renderEmptyVideosState}
          </div>
        </div>
      </div>

      <div class="screen-layer" id="resource-library" aria-hidden="true">
        <div class="screen-header">
          <button type="button" class="screen-back" data-close-screen="resource-library">‹</button>
          <h3>مكتبة الموارد</h3>
          <button type="button" class="screen-close" data-close-screen="resource-library">×</button>
        </div>
        <div class="screen-body">
          <div class="search-box">
            <input type="search" class="search-input" data-search-target="resource-library" placeholder="ابحث عن مورد..." />
          </div>
          <div class="screen-grid" data-screen-list="resource-library">
            ${renderResourceCards || renderEmptyResourcesState}
          </div>
        </div>
      </div>

      <div class="screen-layer" id="about-screen" aria-hidden="true">
        <div class="screen-header">
          <button type="button" class="screen-back" data-close-screen="about-screen">‹</button>
          <h3>نبذة المعلم</h3>
          <button type="button" class="screen-close" data-close-screen="about-screen">×</button>
        </div>
        <div class="screen-body">
          <div class="detail-card">
            <p>${escapeHtml(profileBio || 'أعتمد على أسلوب تدريسي يركز على الفهم العميق، التطبيق المنهجي، والثقة في الأداء العام للطلاب.')}</p>
            <div class="detail-list">
              <strong>المؤهلات</strong>
              <ul>
                <li>ماجستير في العلوم التربوية</li>
                <li>مؤهل تعليم عالي</li>
                <li>خبرة أكثر من 10 سنوات</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="screen-layer" id="course-detail-screen" aria-hidden="true">
        <div class="screen-header">
          <button type="button" class="screen-back" data-close-screen="course-detail-screen">‹</button>
          <h3>تفاصيل الدورة</h3>
          <button type="button" class="screen-close" data-close-screen="course-detail-screen">×</button>
        </div>
        <div class="screen-body">
          <div class="detail-card" id="course-detail-content">
            <div class="detail-thumb"></div>
            <h4>اسم الدورة</h4>
            <p>وصف الدورة</p>
            <ul>
              <li>شرح المنهج</li>
              <li>تمارين تطبيقية</li>
              <li>مراجعة أسبوعية</li>
            </ul>
            <button type="button" class="primary-btn full-width" data-contact-action="true">احجز الآن</button>
          </div>
        </div>
      </div>

      <!-- Results Modal (Shows ALL saved student results) -->
      <div class="modal-backdrop" id="results-modal" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="modal-box results-modal-box">
          <button type="button" class="modal-close" data-close-modal="results-modal" aria-label="إغلاق">✕</button>
          <div class="results-modal-header">
            <div class="results-modal-header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
            </div>
            <div class="results-modal-header-info">
              <h4>${escapeHtml(resultsModalTitle || 'لوحة شرف ونتائج الطلاب')}</h4>
              <p>${escapeHtml(resultsModalDescription || 'جميع نتائج ودرجات الطلاب المتفوقين في الاختبارات والمراحل المختلفة.')}</p>
            </div>
          </div>
          <div class="results-modal-body">
            <div class="results-modal-grid">
              ${renderAllResultsCards}
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Modal (Wired to Navbar Contact Icon) -->
      <div class="modal-backdrop" id="generic-modal" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="modal-box">
          <button type="button" class="modal-close" data-close-modal="generic-modal" aria-label="إغلاق">✕</button>
          <div class="modal-header-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div class="modal-body">
            <h4>${escapeHtml(contactModalTitle || 'تواصل مع الفريق')}</h4>
            <p>${escapeHtml(contactModalDescription || 'للحجز والاستفسار، يمكنك التواصل مباشرة مع الفريق.')}</p>
            <div class="modal-actions">
              ${whatsappUrl ? `
                <a href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener noreferrer" class="contact-action-btn whatsapp-btn">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>${escapeHtml(whatsappLabel || 'واتساب')}</span>
                </a>
              ` : ''}
              ${phoneTel ? `
                <a href="${escapeHtml(phoneTel)}" class="contact-action-btn phone-btn">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>${escapeHtml(phoneLabel || 'اتصال')}</span>
                </a>
              ` : ''}
              ${(!whatsappUrl && !phoneTel) ? `
                <div class="empty-contact-note">لم يتم تعيين أرقام تواصل بعد</div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>

      <div class="toast" id="schoolcoach-toast" aria-live="polite">تمت العملية بنجاح</div>

      <script>
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach((item) => {
          const button = item.querySelector('.faq-question');
          if (button) {
            button.addEventListener('click', () => {
              item.classList.toggle('open');
            });
          }
        });

        const showToast = (message) => {
          const toast = document.getElementById('schoolcoach-toast');
          if (!toast) return;
          toast.textContent = message;
          toast.classList.add('show');
          clearTimeout(showToast.timer);
          showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
        };

        const openScreen = (screenId) => {
          const screen = document.getElementById(screenId);
          if (!screen) return;
          document.querySelectorAll('.screen-layer').forEach((item) => item.classList.remove('show'));
          screen.classList.add('show');
          screen.setAttribute('aria-hidden', 'false');
        };

        const closeScreen = (screenId) => {
          const screen = document.getElementById(screenId);
          if (!screen) return;
          screen.classList.remove('show');
          screen.setAttribute('aria-hidden', 'true');
        };

        const openModal = (modalId) => {
          const modal = document.getElementById(modalId);
          if (!modal) return;
          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
        };

        const closeModal = (modalId) => {
          const modal = document.getElementById(modalId);
          if (!modal) return;
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
        };

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileNavMenu = document.getElementById('mobile-nav-menu');
        if (mobileToggle && mobileNavMenu) {
          mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileNavMenu.style.display === 'flex';
            mobileNavMenu.style.display = isOpen ? 'none' : 'flex';
          });
        }

        // Click event listener
        document.addEventListener('click', (event) => {
          const target = event.target;
          if (!(target instanceof Element)) return;

          // FAQ Accordion click
          const faqBtn = target.closest('.faq-question');
          if (faqBtn) {
            event.preventDefault();
            const faqItem = faqBtn.closest('.faq-item');
            if (faqItem) {
              const isOpen = faqItem.classList.contains('open');
              faqItem.classList.toggle('open');
              faqBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
            }
            return;
          }

          // Open modal trigger
          if (target.closest('[data-open-modal]')) {
            event.preventDefault();
            const modalId = target.closest('[data-open-modal]').getAttribute('data-open-modal');
            if (modalId) openModal(modalId);
            return;
          }

          // Contact modal action
          if (target.closest('[data-contact-action="true"]')) {
            event.preventDefault();
            openModal('generic-modal');
            return;
          }

          // Modal close
          if (target.closest('[data-close-modal]')) {
            event.preventDefault();
            const modalId = target.closest('[data-close-modal]').getAttribute('data-close-modal') || 'generic-modal';
            closeModal(modalId);
            return;
          }

          // Backdrop click
          if (target.classList.contains('modal-backdrop')) {
            target.classList.remove('show');
            target.setAttribute('aria-hidden', 'true');
            return;
          }

          // Open screen
          if (target.closest('[data-open-screen]')) {
            event.preventDefault();
            const screenId = target.closest('[data-open-screen]').getAttribute('data-open-screen');
            if (screenId) openScreen(screenId);
            return;
          }

          // Close screen
          if (target.closest('[data-close-screen]')) {
            event.preventDefault();
            const screenId = target.closest('[data-close-screen]').getAttribute('data-close-screen');
            if (screenId) closeScreen(screenId);
            return;
          }

          // Open course detail
          if (target.closest('[data-open-course-detail]')) {
            const card = target.closest('.course-card, .mini-card');
            const title = card?.querySelector('h3')?.textContent || 'دورة جديدة';
            const thumb = card?.querySelector('.thumb, .video-thumb')?.style?.backgroundImage || 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80)';
            const detailContent = document.getElementById('course-detail-content');
            if (detailContent) {
              const dThumb = detailContent.querySelector('.detail-thumb');
              if (dThumb) dThumb.style.backgroundImage = thumb;
              const dTitle = detailContent.querySelector('h4');
              if (dTitle) dTitle.textContent = title;
            }
            openScreen('course-detail-screen');
            return;
          }

          // Navigation scroll target
          const navLink = target.closest('[data-scroll], [data-scroll-target], a[href^="#"]');
          if (navLink) {
            const scrollKey = navLink.getAttribute('data-scroll') || navLink.getAttribute('data-scroll-target')?.replace('#', '') || navLink.getAttribute('href')?.replace('#', '');
            if (scrollKey) {
              const targetEl = document.getElementById(scrollKey);
              if (targetEl) {
                event.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
            if (mobileNavMenu) mobileNavMenu.style.display = 'none';
          }
        });

        // Search filtering in screen layers
        document.querySelectorAll('.search-input').forEach((input) => {
          input.addEventListener('input', (event) => {
            const searchValue = event.target.value.trim().toLowerCase();
            const targetName = event.target.getAttribute('data-search-target');
            const list = document.querySelector('[data-screen-list="' + targetName + '"]');
            if (!list) return;
            const cards = list.querySelectorAll('.mini-card, .resource-card, .course-card, .video-card');
            cards.forEach((card) => {
              const text = (card.textContent || '').toLowerCase();
              card.style.display = text.includes(searchValue) ? 'block' : 'none';
            });
          });
        });

        // Post messages to parent editor on section clicks for easy inspector selection
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

        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            document.querySelectorAll('.screen-layer.show').forEach((screen) => screen.classList.remove('show'));
            document.querySelectorAll('.modal-backdrop.show').forEach((modal) => modal.classList.remove('show'));
            if (mobileNavMenu) mobileNavMenu.style.display = 'none';
          }
        });
      </script>
    </body>
  </html>`;
};

export const getSchoolCoachHtml = (
  content: TemplateContent,
  isEditing: boolean = false,
  isLoggedIn: boolean = false,
  dashboardUrl: string = '/student',
  grades: any[] = [],
  subjects: any[] = [],
  selectedGrade: string = '',
  selectedSubject: string = '',
  realCourses: any[] = [],
  realBags: any[] = [],
  teacherProfile: any = null
) => {
  const effectiveGrades = (Array.isArray(grades) && grades.length > 0) ? grades : [];
  const rawSubjects = (Array.isArray(subjects) && subjects.length > 0) ? subjects : [];
  const filteredSubjects = rawSubjects;

  const cachedProfile = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('darab_academy_profile') || '{}') : {};
  const realName = teacherProfile?.site_name || teacherProfile?.academy_name || teacherProfile?.name || teacherProfile?.teacher_name || cachedProfile.site_name || cachedProfile.name || cachedProfile.academy_name;
  const realEmail = teacherProfile?.site_email || teacherProfile?.email || cachedProfile.site_email || cachedProfile.email;
  const realPhone = teacherProfile?.site_phone || teacherProfile?.academy_phone || teacherProfile?.phone || cachedProfile.site_phone || cachedProfile.phone;

  const navbarTitle = realName || content?.navbar?.title || (content?.navbar as any)?.name || 'الأستاذ أحمد محمد';
  const navbarBg = content?.navbar?.bgColor || (content?.navbar as any)?.bg_color || '#0a1628';
  const navbarText = content?.navbar?.textColor || (content?.navbar as any)?.text_color || '#ffffff';

  const defaultNavLinks = [
    { label: 'الرئيسية', href: '#hero' },
    { label: 'الحصص', href: '#courses' },
    { label: 'الحقائب', href: '#bags' },
    { label: 'عن الأستاذ', href: '#about' },
  ];
  const rawNavLinks: Array<{ label: string; href: string }> =
    Array.isArray((content?.navbar as any)?.links) && (content?.navbar as any).links.length > 0
      ? (content?.navbar as any).links
      : defaultNavLinks;

  // Filter out "المواد" and "تواصل معنا"
  let filteredNavLinks = rawNavLinks.filter((l: any) => {
    const label = l.label || '';
    const href = l.href || '';
    if (label.includes('المواد') || href.includes('features') || href.includes('subjects')) return false;
    if (label.includes('تواصل') || label.includes('اتصل') || href.includes('contact')) return false;
    return true;
  });

  // Map link labels and href targets
  filteredNavLinks = filteredNavLinks.map((l: any) => {
    const label = l.label || '';
    const href = l.href || '';
    if (label.includes('الرئيسية') || href === '/' || href === '#') {
      return { ...l, label: 'الرئيسية', href: '#hero' };
    }
    if (label.includes('الدورات') || href.includes('courses')) {
      return { ...l, label: 'الحصص', href: '#courses' };
    }
    if (label.includes('الأستاذ') || label.includes('حول') || href.includes('about')) {
      return { ...l, label: 'عن الأستاذ', href: '#about' };
    }
    return l;
  });

  // Ensure "الرئيسية" is present as first link with href="#hero"
  const homeIdx = filteredNavLinks.findIndex((l: any) => l.label?.includes('الرئيسية') || l.href === '#hero' || l.href === '/');
  if (homeIdx === -1) {
    filteredNavLinks.unshift({ label: 'الرئيسية', href: '#hero' });
  } else {
    filteredNavLinks[homeIdx] = { ...filteredNavLinks[homeIdx], label: 'الرئيسية', href: '#hero' };
  }

  // Ensure "الحصص" is present
  const hasCoursesLink = filteredNavLinks.some((l: any) => l.href?.includes('courses') || l.label?.includes('الحصص'));
  if (!hasCoursesLink) {
    filteredNavLinks.splice(1, 0, { label: 'الحصص', href: '#courses' });
  }

  // Ensure "الحقائب" is present
  const hasBagsLink = filteredNavLinks.some((l: any) => l.href?.includes('bags') || l.label?.includes('حقائب') || l.label?.includes('الحقائب'));
  if (!hasBagsLink) {
    const coursesIdx = filteredNavLinks.findIndex((l: any) => l.href?.includes('courses') || l.label?.includes('الحصص'));
    if (coursesIdx !== -1) {
      filteredNavLinks.splice(coursesIdx + 1, 0, { label: 'الحقائب', href: '#bags' });
    } else {
      filteredNavLinks.push({ label: 'الحقائب', href: '#bags' });
    }
  }

  // Ensure "عن الأستاذ" is present
  const hasAboutLink = filteredNavLinks.some((l: any) => l.href?.includes('about') || l.label?.includes('الأستاذ') || l.label?.includes('حول'));
  if (!hasAboutLink) {
    filteredNavLinks.push({ label: 'عن الأستاذ', href: '#about' });
  }

  const navLinks = filteredNavLinks;
  const loginText = (content?.navbar as any)?.loginText || (content?.navbar as any)?.login_text || 'تسجيل الدخول';
  const loginLink = (content?.navbar as any)?.loginLink || (content?.navbar as any)?.login_link || '/auth/login';
  const registerText = (content?.navbar as any)?.registerText || (content?.navbar as any)?.register_text || 'احجز مكانك';
  const registerLink = (content?.navbar as any)?.registerLink || (content?.navbar as any)?.register_link || '/auth/register';
  const loginBg = (content?.navbar as any)?.loginBgColor || (content?.navbar as any)?.login_bg_color || (content?.navbar as any)?.loginBg || (content?.navbar as any)?.login_bg || '';
  const loginTextColor = (content?.navbar as any)?.loginTextColor || (content?.navbar as any)?.login_text_color || (content?.navbar as any)?.loginColor || (content?.navbar as any)?.login_color || '';
  const registerBg = (content?.navbar as any)?.registerBgColor || (content?.navbar as any)?.register_bg_color || (content?.navbar as any)?.registerBg || (content?.navbar as any)?.register_bg || '';
  const registerTextColor = (content?.navbar as any)?.registerTextColor || (content?.navbar as any)?.register_text_color || (content?.navbar as any)?.registerColor || (content?.navbar as any)?.register_color || '';

  const heroSubtitle = content?.hero?.subtitle || 'معلم الرياضيات القدير';
  const heroTitle = content?.hero?.title || 'تعلم بذكاء. <br/><span class="text-[var(--color-gold-500)]">اضمن تفوقك الدراسي.</span>';
  const heroDesc = content?.hero?.description || 'مناهج دراسية مبسطة وأساليب تعليمية حديثة تساعدك على فهم المادة بعمق وتحقيق الدرجة الكاملة في امتحاناتك.';
  const heroBtnText = content?.hero?.buttonText || (content?.hero as any)?.button_text || 'احجز مكانك الآن';
  const heroBtnLink = content?.hero?.buttonLink || (content?.hero as any)?.button_link || '#';
  const heroBtnBg = (content?.hero as any)?.buttonBg || (content?.hero as any)?.button_bg || (content?.hero as any)?.button_background_color || '';
  const heroBtnTextColor = (content?.hero as any)?.buttonTextColor || (content?.hero as any)?.button_text_color || (content?.hero as any)?.button_color || '';
  const heroSecondaryBtnText = content?.hero?.secondaryButtonText || (content?.hero as any)?.secondary_button_text || (content?.hero as any)?.demoButtonText || 'اعرف المزيد عنا';
  const heroSecondaryBtnLink = content?.hero?.secondaryButtonLink || (content?.hero as any)?.secondary_button_link || (content?.hero as any)?.demoButtonLink || '#about';
  const heroSecondaryBtnBg = (content?.hero as any)?.secondaryButtonBg || (content?.hero as any)?.secondary_button_bg || (content?.hero as any)?.secondary_button_background_color || '';
  const heroSecondaryBtnTextColor = (content?.hero as any)?.secondaryButtonTextColor || (content?.hero as any)?.secondary_button_text_color || (content?.hero as any)?.secondary_button_color || '';
  const heroImg = content?.hero?.image || (content?.hero as any)?.img || (content?.hero as any)?.video || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdn5I4iyCWiaDe9m4F8v8n_X00tPqBgqXH4hbDxxtEpcQGhs3Iv7ye36iLKGCPaYsSeLuQ6Q56ZRbKBk10dy_efgKLS3zHuPJjJmYL6JtPlCiByhhruLtE_z5QnQirZ362M0sgpMps7B8icOJUUVS6t_6GJ1K0xma8arDq0yEal-eRoeAXPmexe9Vlvhif39sPxgQQGgyuqPwrz1R2REpb3TQmQAfrbC-2IMbqMBAUhDDImR-r8q5cEQ';
  const heroBg = content?.hero?.backgroundColor || (content?.hero as any)?.background_color || (content?.hero as any)?.bg_color || '#0a1628';
  const heroTextColor = content?.hero?.textColor || (content?.hero as any)?.text_color || '#ffffff';

  const aboutTitle = content?.about?.title || 'عن الأستاذ أحمد';
  const aboutSubtitle = content?.about?.subtitle || 'خبرة تزيد عن ١٠ سنوات في تدريس مناهج الرياضيات للمرحلة الثانوية. نعتمد على الفهم والتحليل وتدريب الطالب على أنماط الامتحانات المختلفة لضمان الثقة والتميز.';
  const aboutImg = content?.about?.image || (content?.about as any)?.img || (content?.about as any)?.video || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsvCKkFFgnTqd7h7Fw_WOHLv_-bXegAz36jnJ-dSBDWKiA81BP1TWumr1WnjULNWm_0CcbVBTge22QX2XN-cBPri3M3xbxSbAGqLIcFlI4XbbEacN9CKm1uRjQqkRnAfjumbe4cbh_txOhsTy_-6Eph6WwWNqlfr7j35tkwUU103Z7NEEpLCcfSvulZ4QoKpglkx4KRxtXU9TRhBm3eChxdvC43k04A-fnMk-IjFugUk9FdZ1nyfYQsA';
  const aboutBg = content?.about?.backgroundColor || (content?.about as any)?.background_color || (content?.about as any)?.bg_color || '';
  const aboutTextColor = content?.about?.textColor || (content?.about as any)?.text_color || '';

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
  const contactDesc = content?.contact?.description || 'انضم لأكثر من ١٠,٠٠0 طالب وطالبة حققوا أحلامهم الدراسية معنا.';
  const contactPhone = content?.contact?.phoneNumber || (content?.contact as any)?.phone_number || '';
  const contactBtnText = content?.contact?.buttonText || (content?.contact as any)?.button_text || 'ابدأ الآن';
  const contactSecondaryBtnText = (content?.contact as any)?.secondaryButtonText || (content?.contact as any)?.secondary_button_text || (content?.contact as any)?.demoButtonText || 'طلب عرض توضيحي';
  const contactSecondaryBtnLink = (content?.contact as any)?.secondaryButtonLink || (content?.contact as any)?.secondary_button_link || (content?.contact as any)?.demoButtonLink || '';

  const footerText = content?.footer?.text || ' جميع الحقوق محفوظة.';
  const footerDesc = content?.footer?.description || (content?.footer as any)?.aboutText || 'مجموعات تقوية ومراجعات شاملة في الرياضيات للمرحلة الثانوية.';
  const footerWorkingHours = content?.footer?.workingHours || (content?.footer as any)?.timings || 'من السبت إلى الخميس: ١٠:٠٠ ص - ٩:٠٠ م';
  const footerEmail = content?.footer?.email || realEmail || 'info@ahmedmath.com';
  const footerPhone = content?.footer?.phone || realPhone || '٩٦٦٥٠٠٠٠٠٠٠٠+';
  const footerBg = content?.footer?.backgroundColor || (content?.footer as any)?.background_color || '';
  const footerTextColor = content?.footer?.textColor || (content?.footer as any)?.text_color || '';

  const statsItems = content?.stats?.items || [
    { value: '١٠+', label: 'سنوات من الخبرة والتميز' },
    { value: '٥٠٠+', label: 'طالب متميز سنوياً' },
    { value: '٩٥٪+', label: 'نسبة درجات التفوق' }
  ];
  const statsBg = content?.stats?.backgroundColor || (content?.stats as any)?.background_color || '';
  const statsTextColor = content?.stats?.textColor || (content?.stats as any)?.text_color || '';

  const videoTag = (content?.about as any)?.videoTag || 'شاهد وتعلّم';
  const videoTitle = (content?.about as any)?.videoTitle || 'تعرف على فلسفتنا التعليمية في ٣ دقائق';
  const videoDesc = (content?.about as any)?.videoDesc || 'نقدم لك جولة سريعة داخل منصتنا التعليمية. نوضح فيها طريقة تتبع الدروس المتقدمة، والتفاعل مع المرشدين، والوصول لأوراق العمل والامتحانات الذكية.';
  const videoLink = (content?.about as any)?.videoLink || (content?.about as any)?.videoImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop';
  const videoBg = (content?.about as any)?.videoBg || (content?.about as any)?.video_bg || (content?.about as any)?.videoBackgroundColor || (content?.about as any)?.video_background_color || '';
  const videoTextColor = (content?.about as any)?.videoTextColor || (content?.about as any)?.video_text_color || '';

  const newsletterTitle = (content?.footer as any)?.newsletterTitle || 'اشترك في نشرتنا المعرفية';
  const newsletterDesc = (content?.footer as any)?.newsletterDesc || 'احصل على أحدث المقالات التحليلية، والمناهج الجديدة، والماستركلاسز الحصرية مباشرة في بريدك الإلكتروني أسبوعياً.';
  const newsletterBtnText = (content?.footer as any)?.newsletterBtnText || 'اشترك الآن';

  const testimonialsTitle = (content?.faq as any)?.testimonialsTitle || 'آراء وقصص نجاح الطلاب';
  const testimonialsSubtitle = (content?.faq as any)?.testimonialsSubtitle || 'ماذا يقول أولياء الأمور وطلابنا بعد تحقيق الدرجة الكاملة والتفوق في امتحاناتهم.';
  const testimonialsBg = (content?.pricing as any)?.testimonialsBg || (content?.pricing as any)?.testimonials_bg || (content?.faq as any)?.testimonialsBg || (content?.faq as any)?.backgroundColor || '';
  const testimonialsTextColor = (content?.pricing as any)?.testimonialsTextColor || (content?.pricing as any)?.testimonials_text_color || (content?.faq as any)?.testimonialsTextColor || (content?.faq as any)?.textColor || '';
  const faqBg = (content?.faq as any)?.backgroundColor || (content?.faq as any)?.background_color || testimonialsBg;
  const faqTextColor = (content?.faq as any)?.textColor || (content?.faq as any)?.text_color || testimonialsTextColor;

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
        ${navLinks.map((link: any) => {
    const isBtn = link.isButton || link.is_button || link.variant === 'button' || link.type === 'button';
    const href = link.href || '#';
    const isAnchor = href.startsWith('#');
    const targetAttr = isEditing ? '' : (isAnchor ? '' : 'target="_top"');
    const onClickAttr = isAnchor ? `onclick="scrollToAnchor(event, '${href}')"` : '';
    const linkBg = link.bgColor || link.bg_color || link.backgroundColor || link.background_color || '';
    const linkColor = link.textColor || link.text_color || link.color || '';
    const customStyle = link.style || `${linkBg ? `background-color: ${linkBg}; ` : ''}${linkColor ? `color: ${linkColor}; ` : ''}`;

    if (isBtn || linkBg) {
      return `<a class="btn-primary text-xs py-2.5 px-5 block text-center" style="${customStyle}" href="${href}" ${targetAttr} ${onClickAttr}>${link.label}</a>`;
    }
    return `<a class="hover:text-[var(--color-gold-500)] transition-colors" style="${linkColor ? `color: ${linkColor};` : ''}" href="${href}" ${targetAttr} ${onClickAttr}>${link.label}</a>`;
  }).join('\n')}
      </nav>
      <div class="flex items-center gap-4">
${!isEditing && isLoggedIn ? `
        <a href="${dashboardUrl}" ${isEditing ? '' : 'target="_top"'} class="btn-primary text-xs py-3.5 px-6 flex items-center justify-center gap-2 text-center">
          <span class="material-symbols-outlined text-[18px]">dashboard</span> لوحة التحكم
        </a>
` : `
        <a href="${loginLink}" ${isEditing ? '' : 'target="_top"'} class="text-xs font-bold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity" style="${loginBg ? `background-color: ${loginBg}; ` : ''}${loginTextColor ? `color: ${loginTextColor}; ` : 'color: var(--color-gray-400);'}">${loginText}</a>
        <a href="${registerLink}" ${isEditing ? '' : 'target="_top"'} class="btn-primary text-xs py-3.5 px-6 block text-center" style="${registerBg ? `background-color: ${registerBg}; ` : ''}${registerTextColor ? `color: ${registerTextColor}; ` : ''}">${registerText}</a>
`}
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
    })()}" ${heroBtnLink?.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-primary text-sm" style="${heroBtnBg ? `background-color: ${heroBtnBg}; ` : ''}${heroBtnTextColor ? `color: ${heroBtnTextColor}; ` : ''}">${heroBtnText}</a>
            <a data-hero-btn="secondary" href="${(() => {
      if (!heroSecondaryBtnLink || heroSecondaryBtnLink === '#') return '#about';
      const trimmed = heroSecondaryBtnLink.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed;
      return `#${trimmed}`;
    })()}" ${heroSecondaryBtnLink?.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-secondary text-sm" style="${heroSecondaryBtnBg ? `background-color: ${heroSecondaryBtnBg}; ` : ''}${heroSecondaryBtnTextColor ? `color: ${heroSecondaryBtnTextColor}; ` : ''}">${heroSecondaryBtnText}</a>
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

    <!-- 3. About Section -->
    <section id="about" data-section="about" class="py-24 px-margin-mobile md:px-margin-desktop bg-[var(--color-offwhite)] mb-20 section-hover cursor-pointer" style="${aboutBg ? `background-color: ${aboutBg};` : ''} ${aboutTextColor ? `color: ${aboutTextColor};` : ''}">
      <div class="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="flex justify-center">
          <div class="relative w-full max-w-[400px] aspect-square rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] overflow-hidden border-2 border-[var(--color-gold-500)] shadow-xl bg-white">
            <img class="w-full h-full object-cover" src="${aboutImg}" alt="About Teacher"/>
          </div>
        </div>
        <div class="flex flex-col gap-6 text-right">
          <h2 class="section-title text-right after:right-0 after:left-auto" style="${aboutTextColor ? `color: ${aboutTextColor};` : ''}">${aboutTitle}</h2>
          <p class="text-body-lg text-gray-600 leading-relaxed" style="${aboutTextColor ? `color: ${aboutTextColor};` : ''}">${aboutSubtitle}</p>
          
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
    <section data-section="video" id="about-video" class="py-20 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto mb-20 section-hover cursor-pointer rounded-3xl" style="${videoBg ? `background-color: ${videoBg};` : ''} ${videoTextColor ? `color: ${videoTextColor};` : ''}">
      <div class="bg-[var(--color-navy-900)] border border-navy-700/40 rounded-3xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-white" style="${videoBg ? `background-color: ${videoBg};` : ''}">
        <div class="space-y-6">
          <span class="text-xs font-bold text-[var(--color-gold-500)] bg-[var(--color-gold-500)]/10 px-4 py-1.5 rounded-full border border-[var(--color-gold-500)]/20">${videoTag}</span>
          <h2 class="text-3xl font-extrabold leading-tight ${videoTextColor ? '' : 'text-white'}" style="${videoTextColor ? `color: ${videoTextColor};` : ''}">${videoTitle}</h2>
          <p class="text-body-lg ${videoTextColor ? '' : 'text-gray-400'} leading-relaxed" style="${videoTextColor ? `color: ${videoTextColor};` : ''}">${videoDesc}</p>
          <div class="flex items-center gap-4 text-[var(--color-gold-500)] font-bold">
            <span class="material-symbols-outlined text-[32px] animate-bounce">play_arrow</span>
            <span>اضغط على المشغل لمشاهدة العرض التعريفي</span>
          </div>
        </div>
        <div data-video-container class="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-navy-700/50 flex items-center justify-center group">
          ${renderVideoPlayer(videoLink, 'w-full h-full rounded-2xl')}
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
            <div class="relative rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-navy-900 border border-navy-700">
              <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${item.icon}" alt="${item.title}" onError="this.onerror=null; this.src='https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop';" />
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

    <!-- 5. Groups/Courses Grid ("المجموعات والدورات الدراسية") -->
    <section id="courses" data-section="pricing" class="py-24 px-margin-mobile md:px-margin-desktop bg-[var(--color-gray-100)] border-y border-gray-200/50 mb-20 section-hover cursor-pointer">
      <div id="groups" class="max-w-[1200px] mx-auto">
        <div class="text-center mb-10">
          <h2 class="section-title text-center">${pricingTitle}</h2>
          <p class="text-body-lg text-gray-600 max-w-2xl mx-auto">${pricingSubtitle}</p>
        </div>
        
        <!-- Dropdown filters: Grade and Subject (Independent, strictly real data) -->
        <div class="flex flex-wrap items-center justify-center gap-4 mb-12" dir="rtl">
          <!-- Grade Dropdown -->
          <div class="relative min-w-[240px] text-right">
            <label class="block text-xs font-bold text-gray-700 mb-1.5">المرحلة / الصف الدراسي:</label>
            <div class="relative">
              <select
                id="schoolcoach-grade-select"
                onchange="handleGradeChange(this.value)"
                class="w-full bg-white border-2 border-navy-700/20 hover:border-[var(--color-gold-500)] text-navy-950 font-bold text-sm rounded-2xl px-4 py-3 appearance-none shadow-sm focus:outline-none focus:border-[var(--color-gold-500)] transition-all cursor-pointer text-right"
              >
                <option value="">جميع المراحل والصفوف الدراسية</option>
                ${effectiveGrades.map((g: any) => `
                  <option value="${g.id}" ${String(selectedGrade) === String(g.id) ? 'selected' : ''}>
                    ${g.name || g.title}
                  </option>
                `).join('')}
              </select>
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
            </div>
          </div>

          <!-- Subject Dropdown (Independent of grade) -->
          <div class="relative min-w-[240px] text-right">
            <label class="block text-xs font-bold text-gray-700 mb-1.5">المادة الدراسية:</label>
            <div class="relative">
              <select
                id="schoolcoach-subject-select"
                onchange="handleSubjectChange(this.value)"
                class="w-full bg-white border-2 border-navy-700/20 hover:border-[var(--color-gold-500)] text-navy-950 font-bold text-sm rounded-2xl px-4 py-3 appearance-none shadow-sm focus:outline-none focus:border-[var(--color-gold-500)] transition-all cursor-pointer text-right"
              >
                <option value="">جميع المواد والتخصصات</option>
                ${rawSubjects.map((s: any) => `
                  <option value="${s.id}" ${String(selectedSubject) === String(s.id) ? 'selected' : ''}>
                    ${s.name || s.title}
                  </option>
                `).join('')}
              </select>
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
            </div>
          </div>
        </div>

        <!-- Dynamic Courses Container (No Hard Refresh, No Static Cohort Fallback) -->
        <div id="schoolcoach-courses-container" class="transition-opacity duration-200">
          ${realCourses.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${realCourses.map((course: any, idx: number) => {
      const courseTitle = course.title || 'دورة تدريبية';
      const courseHref = `/courses/${course.slug || course.id}`;
      const instructorName = typeof course.instructor === 'object' && course.instructor?.name
        ? course.instructor.name
        : (course.instructor || course.coach || '');
      const isFree = Number(course.price) === 0 || course.price_type === 'free';
      const priceDisplay = isFree
        ? 'مجانًا'
        : (course.final_price ? `${course.final_price} ${course.currency || 'ر.س'}` : (course.price ? `${course.price} ${course.currency || 'ر.س'}` : 'متاح للتسجيل'));
      const courseImg = course.image || course.cover_image || '';
      const lessonsCount = course.units?.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0);
      const duration = course.duration || (lessonsCount ? `${lessonsCount} درس` : 'محتوى تفاعلي');
      const isActive = String(course.enrollment_status || '').toLowerCase() === 'active';
      const buttonText = isActive ? 'قيد الدراسة' : 'احجز مكانك الآن';
      const buttonHref = isActive ? `/student/courses/${course.id}/learn` : courseHref;

      return `
                  <!-- Course Card (card-dark) -->
                  <div data-section="courses" data-index="${idx}" class="card-dark flex flex-col justify-between text-right group overflow-hidden">
                    <div>
                      ${courseImg ? `
                        <div class="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-navy-900 border border-navy-700">
                          <img src="${courseImg}" alt="${courseTitle}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span class="absolute top-3 left-3 bg-[var(--color-gold-500)] text-[var(--color-navy-950)] font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                            ${priceDisplay}
                          </span>
                        </div>
                      ` : `
                        <div class="flex justify-between items-center mb-4 border-b border-navy-700 pb-3">
                          <span class="text-xs font-bold text-[var(--color-gold-500)]">منهج دراسي</span>
                          <span class="text-xs font-bold bg-[var(--color-gold-500)]/20 text-[var(--color-gold-500)] px-3 py-1 rounded-full">${priceDisplay}</span>
                        </div>
                      `}
                      <h3 class="text-[20px] font-bold text-white mb-4 ${courseImg ? '' : 'border-b border-navy-700 pb-2'} group-hover:text-[var(--color-gold-500)] transition-colors">
                        ${courseTitle}
                      </h3>
                      <div class="space-y-3 text-right mb-6 text-sm">
                        ${instructorName ? `
                          <div class="flex justify-between items-center text-sm border-b border-navy-700/50 pb-2">
                            <span class="text-gray-400">الأستاذ</span>
                            <span class="font-bold text-white">${instructorName}</span>
                          </div>
                        ` : ''}
                        <div class="flex justify-between items-center text-sm border-b border-navy-700/50 pb-2">
                          <span class="text-gray-400">الدروس والمدة</span>
                          <span class="font-bold text-white">${duration}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm">
                          <span class="text-gray-400">نظام الدراسة</span>
                          <span class="font-bold text-white">${course.type === 'recorded' ? 'مسجل' : (course.type === 'online' ? 'أونلاين تفاعلي' : 'حضوري')}</span>
                        </div>
                      </div>
                    </div>
                    <div class="pt-2">
                      <a href="${buttonHref}" target="_top" class="btn-primary block text-center w-full text-xs py-3.5 shadow-md hover:shadow-gold-500/20 font-bold">
                        ${buttonText}
                      </a>
                    </div>
                  </div>
                `;
    }).join('')}
            </div>
          ` : `
            <div class="card-dark p-12 text-center my-4 border border-dashed border-navy-700 rounded-2xl">
              <span class="material-symbols-outlined text-[var(--color-gold-500)] text-[48px] mb-3 block">menu_book</span>
              <h3 class="text-white text-lg font-bold mb-2">لا توجد دورات متاحة حالياً</h3>
              <p class="text-gray-400 text-sm">يرجى اختيار مرحلة أو مادة أخرى، أو مراجعة المعلم لاحقاً.</p>
            </div>
          `}
        </div>
      </div>
    </section>

    <!-- 5.5. Educational Bags Grid ("الحقائب التعليمية والملفات الرقمية") -->
    <section id="bags" data-section="bags" class="py-24 px-margin-mobile md:px-margin-desktop bg-[var(--color-navy-950)] text-white mb-20 section-hover cursor-pointer border-y border-navy-800">
      <div class="max-w-[1200px] mx-auto">
        <div class="text-center mb-16">
          <h2 class="section-title dark-section-title text-center">${content?.bags?.title || 'الحقائب التعليمية والملفات الرقمية'}</h2>
          <p class="text-body-lg text-gray-400 max-w-2xl mx-auto">${content?.bags?.subtitle || 'ملازم ومذكرات دراسية شاملة جاهزة للتحميل والاستفادة المباشرة'}</p>
        </div>
        
        <div id="schoolcoach-bags-container" class="transition-opacity duration-200">
          ${realBags.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${realBags.map((bag: any, idx: number) => {
      const bagTitle = bag.title || 'حقيبة تعليمية';
      const bagHref = `/bags/${bag.id}`;
      const isFree = Number(bag.price) === 0 || bag.price_type === 'free';
      const priceDisplay = isFree ? 'مجانًا' : (bag.price ? `${bag.price} ر.س` : 'متاحة للتحميل');
      const bagImg = bag.image || bag.cover_image || bag.thumbnail || '';
      const itemsCount = bag.items_count || (Array.isArray(bag.items) ? bag.items.length : 1);
      const desc = bag.short_description || bag.description || 'حقيبة دراسية متكاملة تحتوي على ملخصات وأوراق عمل واختبارات تجريبية.';

      return `
                  <div data-section="bags" data-index="${idx}" class="card-dark flex flex-col justify-between text-right group overflow-hidden border border-navy-700 bg-navy-900 rounded-2xl p-6">
                    <div>
                      ${bagImg ? `
                        <div class="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-navy-950 border border-navy-800">
                          <img src="${bagImg}" alt="${bagTitle}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span class="absolute top-3 left-3 bg-[var(--color-gold-500)] text-[var(--color-navy-950)] font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                            ${priceDisplay}
                          </span>
                        </div>
                      ` : `
                        <div class="flex justify-between items-center mb-4 border-b border-navy-700 pb-3">
                          <span class="text-xs font-bold text-[var(--color-gold-500)] flex items-center gap-1">
                            <span class="material-symbols-outlined text-[16px]">folder_zip</span> حقيبة رقمية
                          </span>
                          <span class="text-xs font-bold bg-[var(--color-gold-500)]/20 text-[var(--color-gold-500)] px-3 py-1 rounded-full">${priceDisplay}</span>
                        </div>
                      `}
                      <h3 class="text-[20px] font-bold text-white mb-3 group-hover:text-[var(--color-gold-500)] transition-colors">
                        ${bagTitle}
                      </h3>
                      <p class="text-xs text-gray-400 mb-6 leading-relaxed line-clamp-3">
                        ${desc}
                      </p>
                      <div class="flex items-center justify-between text-xs border-t border-navy-800 pt-3 mb-4 text-gray-400">
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-[var(--color-gold-500)]">inventory_2</span> المحتويات</span>
                        <span class="font-bold text-white">${itemsCount} ملفات دراسية</span>
                      </div>
                    </div>
                    <div>
                      <a href="${bagHref}" target="_top" class="btn-primary block text-center w-full text-xs py-3.5 shadow-md hover:shadow-gold-500/20 font-bold">
                        استعرض الحقيبة والملفات
                      </a>
                    </div>
                  </div>
                `;
    }).join('')}
            </div>
          ` : `
            <div class="card-dark p-12 text-center my-4 border border-dashed border-navy-700 rounded-2xl">
              <span class="material-symbols-outlined text-[var(--color-gold-500)] text-[48px] mb-3 block">folder_open</span>
              <h3 class="text-white text-lg font-bold mb-2">لا توجد حقائب تعليمية حالياً</h3>
              <p class="text-gray-400 text-sm">سيتم إضافة الحقائب والمذكرات الرقمية قريباً، تفقد الصفحة لاحقاً.</p>
            </div>
          `}
        </div>
      </div>
    </section>

    <!-- 6. Stats Band / Experiences -->
    <section id="stats" data-section="stats" class="py-16 bg-[var(--color-navy-950)] text-white mb-20 section-hover cursor-pointer transition-all duration-300 rounded-3xl" style="${statsBg ? `background-color: ${statsBg};` : ''} ${statsTextColor ? `color: ${statsTextColor};` : ''}">
      <div class="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-margin-mobile md:px-margin-desktop">
        ${statsItems.map((item: any, idx: number) => `
          <div data-section="stats" data-stat-index="${idx}" class="p-4">
            <span class="block text-[36px] font-extrabold text-[var(--color-gold-500)] mb-1" style="${statsTextColor ? `color: ${statsTextColor};` : ''}">${item.value || ''}</span>
            <span class="text-xs font-bold text-gray-400" style="${statsTextColor ? `color: ${statsTextColor}; opacity: 0.85;` : ''}">${item.label || ''}</span>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 7. Testimonials / FAQ ("آراء الطلاب والأسئلة") -->
    <section id="testimonials" data-section="faq" class="py-24 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto mb-20 section-hover cursor-pointer transition-all duration-300 rounded-3xl" style="${faqBg ? `background-color: ${faqBg};` : ''} ${faqTextColor ? `color: ${faqTextColor};` : ''}">
      <div class="text-center mb-16">
        <h2 class="section-title text-center" style="${faqTextColor ? `color: ${faqTextColor};` : ''}">${testimonialsTitle}</h2>
        <p class="text-body-lg ${faqTextColor ? '' : 'text-gray-600'} max-w-2xl mx-auto" style="${faqTextColor ? `color: ${faqTextColor}; opacity: 0.85;` : ''}">${testimonialsSubtitle}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${faqItems.map((item, idx) => `
          <!-- Testimonial / FAQ Card (card-light) -->
          <div data-section="faq" data-index="${idx}" class="card-light flex flex-col justify-between cursor-pointer">
            <div>
              <!-- Star rating -->
              <div class="stars mb-4 text-[var(--color-star)] text-sm font-bold">★★★★★</div>
              <p class="text-body-md ${faqTextColor ? '' : 'text-gray-600'} italic leading-relaxed mb-6" style="${faqTextColor ? `color: ${faqTextColor}; opacity: 0.85;` : ''}">"${item.answer}"</p>
            </div>
            <div class="flex items-center gap-3 border-t border-gray-100 pt-4">
              <div class="w-10 h-10 rounded-full bg-[var(--color-gold-500)]/20 text-[var(--color-gold-500)] flex items-center justify-center font-black text-sm">
                ${item.question.charAt(0)}
              </div>
              <div>
                <h4 class="font-extrabold text-xs ${faqTextColor ? '' : 'text-[var(--color-gray-900)]'}" style="${faqTextColor ? `color: ${faqTextColor};` : ''}">${item.question}</h4>
                <p class="text-[10px] text-gray-400 font-bold">${(content?.pricing as any)?.[`testimonial${idx + 1}Role`] || (content?.faq as any)?.[`testimonial${idx + 1}Role`] || 'شعبة علمي / تفوق كامل'}</p>
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
          ${contactPhone
      ? `<a data-contact-btn="primary" href="tel:${contactPhone.replace(/\s+/g, '')}" class="w-full sm:w-auto btn-primary text-sm flex items-center justify-center gap-2">
                ${contactBtnText}
               </a>`
      : `<button data-contact-btn="primary" class="w-full sm:w-auto btn-primary text-sm flex items-center justify-center gap-2">
                ${contactBtnText}
               </button>`
    }
          ${contactSecondaryBtnLink
      ? `<a data-contact-btn="secondary" href="${contactSecondaryBtnLink}" ${contactSecondaryBtnLink.startsWith('http') || contactSecondaryBtnLink.startsWith('https') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="w-full sm:w-auto btn-secondary text-sm flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl transition-all">
                ${contactSecondaryBtnText}
               </a>`
      : `<button data-contact-btn="secondary" class="w-full sm:w-auto btn-secondary text-sm flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl transition-all">
                ${contactSecondaryBtnText}
               </button>`
    }
        </div>
      </div>
    </section>

  </main>

  <!-- 9. Footer -->
  <footer data-section="footer" class="bg-[var(--color-navy-950)] text-gray-400 py-16 border-t border-navy-800 section-hover cursor-pointer" style="${footerBg ? `background-color: ${footerBg};` : ''} ${footerTextColor ? `color: ${footerTextColor};` : ''}">
    <div class="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-margin-mobile md:px-margin-desktop mb-12 text-right">
      <div class="space-y-4">
        <h4 class="text-white font-extrabold text-sm flex items-center gap-2" style="${footerTextColor ? `color: ${footerTextColor};` : ''}">
          <span class="material-symbols-outlined text-[var(--color-gold-500)] text-[20px]">school</span> ${navbarTitle}
        </h4>
        <p data-footer-desc class="text-xs leading-relaxed max-w-xs" style="${footerTextColor ? `color: ${footerTextColor}; opacity: 0.85;` : ''}">
          ${footerDesc}
        </p>
      </div>
      <div>
        <h4 class="text-white font-extrabold text-sm mb-4" style="${footerTextColor ? `color: ${footerTextColor};` : ''}">مواعيد العمل</h4>
        <p data-footer-hours class="text-xs leading-relaxed" style="${footerTextColor ? `color: ${footerTextColor}; opacity: 0.85;` : ''}">${footerWorkingHours}</p>
      </div>
      <div>
        <h4 class="text-white font-extrabold text-sm mb-4" style="${footerTextColor ? `color: ${footerTextColor};` : ''}">روابط سريعة</h4>
        <ul class="space-y-2 text-xs">
          <li><a href="#about" class="hover:text-[var(--color-gold-500)] transition-colors">عن المدرس</a></li>
          <li><a href="#subjects" class="hover:text-[var(--color-gold-500)] transition-colors">المواد الدراسية</a></li>
          <li><a href="#groups" class="hover:text-[var(--color-gold-500)] transition-colors">المجموعات الدراسية</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-extrabold text-sm mb-4" style="${footerTextColor ? `color: ${footerTextColor};` : ''}">معلومات الاتصال</h4>
        <p data-footer-email class="text-xs leading-relaxed" style="${footerTextColor ? `color: ${footerTextColor}; opacity: 0.85;` : ''}">البريد: ${footerEmail}</p>
        <p data-footer-phone class="text-xs leading-relaxed mt-2" style="${footerTextColor ? `color: ${footerTextColor}; opacity: 0.85;` : ''}">الهاتف: ${footerPhone}</p>
      </div>
    </div>
    
    <div class="max-w-[1200px] mx-auto border-t border-navy-800 pt-8 text-center px-margin-mobile md:px-margin-desktop">
      <p data-footer-copyright class="text-xs" style="${footerTextColor ? `color: ${footerTextColor}; opacity: 0.85;` : ''}">${footerText}</p>
    </div>
  </footer>

  <script>
        function scrollToAnchor(e, selector) {
          if (selector && selector.startsWith('#')) {
            if (e && e.preventDefault) e.preventDefault();
            var target = document.querySelector(selector);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }

        function handleGradeChange(gradeId) {
          window.parent.postMessage({ type: 'SCHOOLCOACH_FILTER_GRADE', gradeId: gradeId }, '*');
        }

        function handleSubjectChange(subjectId) {
          window.parent.postMessage({ type: 'SCHOOLCOACH_FILTER_SUBJECT', subjectId: subjectId }, '*');
        }

        window.addEventListener('message', function(e) {
          if (!e.data) return;

          if (e.data.type === 'SCHOOLCOACH_COURSES_LOADING') {
            var container = document.getElementById('schoolcoach-courses-container');
            if (container) {
              container.style.opacity = '0.4';
              container.style.pointerEvents = 'none';
            }
          } else if (e.data.type === 'SCHOOLCOACH_UPDATE_COURSES') {
            var container = document.getElementById('schoolcoach-courses-container');
            if (container) {
              container.style.opacity = '1';
              container.style.pointerEvents = '';
              var courses = Array.isArray(e.data.courses) ? e.data.courses : [];
              if (courses.length === 0) {
                container.innerHTML = '<div class="card-dark p-12 text-center my-4 border border-dashed border-navy-700 rounded-2xl">' +
                  '<span class="material-symbols-outlined text-[var(--color-gold-500)] text-[48px] mb-3 block">menu_book</span>' +
                  '<h3 class="text-white text-lg font-bold mb-2">لا توجد دورات متاحة حالياً</h3>' +
                  '<p class="text-gray-400 text-sm">يرجى اختيار مرحلة أو مادة أخرى، أو مراجعة المعلم لاحقاً.</p>' +
                '</div>';
              } else {
                var html = '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">';
                for (var i = 0; i < courses.length; i++) {
                  var c = courses[i];
                  var title = c.title || 'دورة تدريبية';
                  var href = '/courses/' + (c.slug || c.id);
                  var inst = (typeof c.instructor === 'object' && c.instructor && c.instructor.name) ? c.instructor.name : (c.instructor || c.coach || '');
                  var isFree = Number(c.price) === 0 || c.price_type === 'free';
                  var price = isFree ? 'مجانًا' : (c.final_price ? c.final_price + ' ' + (c.currency || 'ر.س') : (c.price ? c.price + ' ' + (c.currency || 'ر.س') : 'متاح للتسجيل'));
                  var img = c.image || c.cover_image || '';
                  var lessonsCount = c.units ? c.units.reduce(function(acc, u){ return acc + (u.lessons ? u.lessons.length : 0); }, 0) : 0;
                  var duration = c.duration || (lessonsCount ? lessonsCount + ' درس' : 'محتوى تفاعلي');
                  var studyType = c.type === 'recorded' ? 'مسجل' : (c.type === 'online' ? 'أونلاين تفاعلي' : 'حضوري');
                  var isActive = String(c.enrollment_status || '').toLowerCase() === 'active';
                  var btnText = isActive ? 'قيد الدراسة' : 'احجز مكانك الآن';
                  var btnHref = isActive ? '/student/courses/' + c.id + '/learn' : href;

                  html += '<div data-section="courses" data-index="' + i + '" class="card-dark flex flex-col justify-between text-right group overflow-hidden animate-in fade-in duration-300">';
                  html += '<div>';
                  if (img) {
                    html += '<div class="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-navy-900 border border-navy-700">' +
                      '<img src="' + img + '" alt="' + title + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />' +
                      '<span class="absolute top-3 left-3 bg-[var(--color-gold-500)] text-[var(--color-navy-950)] font-extrabold text-xs px-3 py-1 rounded-full shadow-md">' + price + '</span>' +
                    '</div>';
                  } else {
                    html += '<div class="flex justify-between items-center mb-4 border-b border-navy-700 pb-3">' +
                      '<span class="text-xs font-bold text-[var(--color-gold-500)]">منهج دراسي</span>' +
                      '<span class="text-xs font-bold bg-[var(--color-gold-500)]/20 text-[var(--color-gold-500)] px-3 py-1 rounded-full">' + price + '</span>' +
                    '</div>';
                  }
                  html += '<h3 class="text-[20px] font-bold text-white mb-4 ' + (img ? '' : 'border-b border-navy-700 pb-2') + ' group-hover:text-[var(--color-gold-500)] transition-colors">' + title + '</h3>';
                  html += '<div class="space-y-3 text-right mb-6 text-sm">';
                  if (inst) {
                    html += '<div class="flex justify-between items-center text-sm border-b border-navy-700/50 pb-2"><span class="text-gray-400">الأستاذ</span><span class="font-bold text-white">' + inst + '</span></div>';
                  }
                  html += '<div class="flex justify-between items-center text-sm border-b border-navy-700/50 pb-2"><span class="text-gray-400">الدروس والمدة</span><span class="font-bold text-white">' + duration + '</span></div>';
                  html += '<div class="flex justify-between items-center text-sm"><span class="text-gray-400">نظام الدراسة</span><span class="font-bold text-white">' + studyType + '</span></div>';
                  html += '</div></div>';
                  html += '<div class="pt-2"><a href="' + btnHref + '" target="_top" class="btn-primary block text-center w-full text-xs py-3.5 shadow-md hover:shadow-gold-500/20 font-bold">' + btnText + '</a></div>';
                  html += '</div>';
                }
                html += '</div>';
                container.innerHTML = html;
              }
            }
          } else if (e.data.type === 'SCHOOLCOACH_UPDATE_BAGS') {
            var bagsContainer = document.getElementById('schoolcoach-bags-container');
            if (bagsContainer) {
              var bags = Array.isArray(e.data.bags) ? e.data.bags : [];
              if (bags.length === 0) {
                bagsContainer.innerHTML = '<div class="card-dark p-12 text-center my-4 border border-dashed border-navy-700 rounded-2xl">' +
                  '<span class="material-symbols-outlined text-[var(--color-gold-500)] text-[48px] mb-3 block">folder_open</span>' +
                  '<h3 class="text-white text-lg font-bold mb-2">لا توجد حقائب تعليمية حالياً</h3>' +
                  '<p class="text-gray-400 text-sm">سيتم إضافة الحقائب والمذكرات الرقمية قريباً، تفقد الصفحة لاحقاً.</p>' +
                '</div>';
              } else {
                var bHtml = '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">';
                for (var bIdx = 0; bIdx < bags.length; bIdx++) {
                  var bItem = bags[bIdx];
                  var bTitle = bItem.title || 'حقيبة تعليمية';
                  var bHref = '/bags/' + bItem.id;
                  var bFree = Number(bItem.price) === 0 || bItem.price_type === 'free';
                  var bPrice = bFree ? 'مجانًا' : (bItem.price ? bItem.price + ' ر.س' : 'متاحة للتحميل');
                  var bImg = bItem.image || bItem.cover_image || bItem.thumbnail || '';
                  var bItemsCount = bItem.items_count || (Array.isArray(bItem.items) ? bItem.items.length : 1);
                  var bDesc = bItem.short_description || bItem.description || 'حقيبة دراسية متكاملة تحتوي على ملخصات وأوراق عمل واختبارات تجريبية.';

                  bHtml += '<div data-section="bags" data-index="' + bIdx + '" class="card-dark flex flex-col justify-between text-right group overflow-hidden border border-navy-700 bg-navy-900 rounded-2xl p-6 animate-in fade-in duration-300">';
                  bHtml += '<div>';
                  if (bImg) {
                    bHtml += '<div class="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-navy-950 border border-navy-800">' +
                      '<img src="' + bImg + '" alt="' + bTitle + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />' +
                      '<span class="absolute top-3 left-3 bg-[var(--color-gold-500)] text-[var(--color-navy-950)] font-extrabold text-xs px-3 py-1 rounded-full shadow-md">' + bPrice + '</span>' +
                    '</div>';
                  } else {
                    bHtml += '<div class="flex justify-between items-center mb-4 border-b border-navy-700 pb-3">' +
                      '<span class="text-xs font-bold text-[var(--color-gold-500)] flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">folder_zip</span> حقيبة رقمية</span>' +
                      '<span class="text-xs font-bold bg-[var(--color-gold-500)]/20 text-[var(--color-gold-500)] px-3 py-1 rounded-full">' + bPrice + '</span>' +
                    '</div>';
                  }
                  bHtml += '<h3 class="text-[20px] font-bold text-white mb-3 group-hover:text-[var(--color-gold-500)] transition-colors">' + bTitle + '</h3>';
                  bHtml += '<p class="text-xs text-gray-400 mb-6 leading-relaxed line-clamp-3">' + bDesc + '</p>';
                  bHtml += '<div class="flex items-center justify-between text-xs border-t border-navy-800 pt-3 mb-4 text-gray-400"><span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-[var(--color-gold-500)]">inventory_2</span> المحتويات</span><span class="font-bold text-white">' + bItemsCount + ' ملفات دراسية</span></div>';
                  bHtml += '</div>';
                  bHtml += '<div><a href="' + bHref + '" target="_top" class="btn-primary block text-center w-full text-xs py-3.5 shadow-md hover:shadow-gold-500/20 font-bold">استعرض الحقيبة والملفات</a></div>';
                  bHtml += '</div>';
                }
                bHtml += '</div>';
                bagsContainer.innerHTML = bHtml;
              }
            }
          } else if (e.data.type === 'SCHOOLCOACH_UPDATE_DROPDOWNS') {
            if (Array.isArray(e.data.grades)) {
              var gradeSelect = document.getElementById('schoolcoach-grade-select');
              if (gradeSelect) {
                var curGrade = gradeSelect.value;
                var gHtml = '<option value="">جميع المراحل والصفوف الدراسية</option>';
                e.data.grades.forEach(function(g) {
                  gHtml += '<option value="' + g.id + '"' + (String(curGrade) === String(g.id) ? ' selected' : '') + '>' + (g.name || g.title) + '</option>';
                });
                gradeSelect.innerHTML = gHtml;
              }
            }
            if (Array.isArray(e.data.subjects)) {
              var subjectSelect = document.getElementById('schoolcoach-subject-select');
              if (subjectSelect) {
                var curSubject = subjectSelect.value;
                var sHtml = '<option value="">جميع المواد والتخصصات</option>';
                e.data.subjects.forEach(function(s) {
                  sHtml += '<option value="' + s.id + '"' + (String(curSubject) === String(s.id) ? ' selected' : '') + '>' + (s.name || s.title) + '</option>';
                });
                subjectSelect.innerHTML = sHtml;
              }
            }
          }
        });

        window.addEventListener('load', function() {
          try {
            var saved = sessionStorage.getItem('schoolcoach_scroll_pos');
            if (saved !== null) {
              window.scrollTo(0, parseInt(saved, 10));
              sessionStorage.removeItem('schoolcoach_scroll_pos');
            }
          } catch(e){}
        });

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
