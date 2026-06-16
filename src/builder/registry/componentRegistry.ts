import { ComponentRegistryEntry } from '../interfaces';

// ─── Shared Section Background & Shape Fields (added to every component) ──────

const SECTION_STYLE_FIELDS = [
  {
    name: 'sectionBgType', label: 'نوع خلفية القسم', type: 'select' as const, defaultValue: 'solid', options: [
      { label: 'لون صلب', value: 'solid' },
      { label: 'تدرج (Gradient)', value: 'gradient' },
      { label: 'صورة (Image)', value: 'image' },
    ]
  },
  { name: 'sectionBg', label: 'لون خلفية القسم', type: 'color' as const, defaultValue: '' },
  { name: 'sectionGradientFrom', label: 'تدرج - اللون الأول', type: 'color' as const, defaultValue: '#2563eb' },
  { name: 'sectionGradientTo', label: 'تدرج - اللون الثاني', type: 'color' as const, defaultValue: '#7c3aed' },
  {
    name: 'sectionGradientDir', label: 'اتجاه التدرج', type: 'select' as const, defaultValue: 'to-br', options: [
      { label: 'يمين ← يسار', value: 'to-r' },
      { label: 'يسار ← يمين', value: 'to-l' },
      { label: 'أسفل', value: 'to-b' },
      { label: 'أعلى', value: 'to-t' },
      { label: 'قطري ↘', value: 'to-br' },
      { label: 'قطري ↗', value: 'to-tr' },
    ]
  },
  { name: 'sectionBgImage', label: 'رابط صورة خلفية القسم (URL)', type: 'text' as const, defaultValue: '' },
  { name: 'sectionBgOverlay', label: 'شفافية تغطية صورة الخلفية (%)', type: 'number' as const, defaultValue: 40 },
  {
    name: 'sectionShape', label: 'شكل زخرفي للقسم', type: 'select' as const, defaultValue: 'none', options: [
      { label: 'بلا', value: 'none' },
      { label: 'موجة علوية', value: 'wave-top' },
      { label: 'موجة سفلية', value: 'wave-bottom' },
      { label: 'دوائر ضبابية', value: 'circle-blur' },
      { label: 'Blob', value: 'blob' },
      { label: 'نقاط شبكية', value: 'grid-dots' },
      { label: 'خطوط قطرية', value: 'diagonal-lines' },
    ]
  },
  { name: 'sectionShapeColor', label: 'لون الشكل الزخرفي', type: 'color' as const, defaultValue: '#3b82f6' },
  { name: 'sectionShapeOpacity', label: 'شفافية الشكل الزخرفي (%)', type: 'number' as const, defaultValue: 20 },
];

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryEntry> = {
  'hero': {
    type: 'hero',
    name: 'بانر هيرو (Hero Banner)',
    category: 'content',
    icon: 'Sparkles',
    fields: [
      { name: 'title', label: 'العنوان الرئيسي', type: 'text', defaultValue: 'مرحباً بك في أكاديميتك' },
      { name: 'subtitle', label: 'العنوان الفرعي', type: 'textarea', defaultValue: 'ابدأ اليوم... وخلّ مستقبلك يتغير بأسلوب عملي سهل وبسيط.' },
      { name: 'badgeText', label: 'شارة الترويسة (Badge)', type: 'text', defaultValue: 'تعلّم بذكاء' },
      { name: 'buttonText', label: 'نص الزر الأساسي', type: 'text', defaultValue: 'ابدأ الآن' },
      { name: 'buttonLink', label: 'رابط الزر', type: 'text', defaultValue: '#' },
      { name: 'align', label: 'محاذاة النص', type: 'select', defaultValue: 'right', options: [
        { label: 'يمين', value: 'right' },
        { label: 'وسط', value: 'center' },
        { label: 'يسار', value: 'left' }
      ] },
      { name: 'heroImage', label: 'صورة جانبية في الهيرو (URL)', type: 'text', defaultValue: '' },
      { name: 'heroImagePosition', label: 'موقع الصورة الجانبية', type: 'select', defaultValue: 'left', options: [
        { label: 'يسار النص', value: 'left' },
        { label: 'يمين النص', value: 'right' },
      ] },
      { name: 'showSecondButton', label: 'إظهار زر ثانوي إضافي', type: 'boolean', defaultValue: false },
      { name: 'secondButtonText', label: 'نص الزر الثانوي', type: 'text', defaultValue: 'اعرف أكثر' },
      { name: 'titleColor', label: 'لون العنوان', type: 'color', defaultValue: '#1f2937' },
      { name: 'subtitleColor', label: 'لون العنوان الفرعي', type: 'color', defaultValue: '#6b7280' },
      { name: 'buttonColor', label: 'لون الزر الأساسي', type: 'color', defaultValue: '#2563eb' },
      { name: 'buttonTextColor', label: 'لون نص الزر', type: 'color', defaultValue: '#ffffff' },
      { name: 'secondButtonColor', label: 'لون خلفية الزر الثانوي', type: 'color', defaultValue: '#f1f5f9' },
      { name: 'backgroundColor', label: 'لون الخلفية', type: 'color', defaultValue: '#f8fafc' },
      { name: 'bgImage', label: 'رابط صورة خلفية الهيرو (URL)', type: 'text', defaultValue: '' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'مرحباً بك في أكاديميتك',
      subtitle: 'ابدأ اليوم... وخلّ مستقبلك يتغير بأسلوب عملي سهل وبسيط.',
      badgeText: 'تعلّم بذكاء',
      buttonText: 'ابدأ الآن',
      buttonLink: '#',
      align: 'right',
      titleColor: '#1f2937',
      subtitleColor: '#6b7280',
      buttonColor: '#2563eb',
      buttonTextColor: '#ffffff',
      backgroundColor: '#f8fafc',
      bgImage: '',
      heroImage: '',
      heroImagePosition: 'left',
      showSecondButton: false,
      secondButtonText: 'اعرف أكثر',
      secondButtonColor: '#f1f5f9',
      secondButtonTextColor: '#1e293b',
    }
  },

  'hero-slider': {
    type: 'hero-slider',
    name: 'سلايدر الهيرو (Hero Slider)',
    category: 'content',
    icon: 'PlaySquare',
    fields: [
      { name: 'autoPlay', label: 'تشغيل تلقائي', type: 'boolean', defaultValue: true },
      { name: 'interval', label: 'مدة كل شريحة (ملي ثانية)', type: 'number', defaultValue: 4000 },
      { name: 'showDots', label: 'إظهار نقاط التنقل', type: 'boolean', defaultValue: true },
      { name: 'showArrows', label: 'إظهار أسهم التنقل', type: 'boolean', defaultValue: true },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      autoPlay: true,
      interval: 4000,
      showDots: true,
      showArrows: true,
      slides: [
        { id: '1', title: 'مرحباً بك في أكاديميتك', subtitle: 'ابدأ اليوم... وخلّ مستقبلك يتغير بأسلوب عملي سهل وبسيط.', buttonText: 'ابدأ الآن', buttonLink: '#', backgroundColor: '#1e40af', bgImage: '', buttonColor: '#ffffff', align: 'right' },
        { id: '2', title: 'دورات تدريبية احترافية', subtitle: 'تعلّم من نخبة المدربين المعتمدين بأسلوب تفاعلي شيّق.', buttonText: 'استعرض الدورات', buttonLink: '#', backgroundColor: '#065f46', bgImage: '', buttonColor: '#ffffff', align: 'center' },
        { id: '3', title: 'شهادات معتمدة دولياً', subtitle: 'احصل على شهادتك وارتقِ بمسارك المهني إلى مستوى عالمي.', buttonText: 'اعرف أكثر', buttonLink: '#', backgroundColor: '#4c1d95', bgImage: '', buttonColor: '#ffffff', align: 'right' },
      ],
    }
  },

  'kpi-cards': {
    type: 'kpi-cards',
    name: 'بطاقات المؤشرات (KPI Cards)',
    category: 'data',
    icon: 'TrendingUp',
    fields: [
      { name: 'gridCols', label: 'عدد الأعمدة', type: 'select', defaultValue: '4', options: [
        { label: 'عمود واحد', value: '1' },
        { label: 'عمودين', value: '2' },
        { label: '3 أعمدة', value: '3' },
        { label: '4 أعمدة', value: '4' },
        { label: '5 أعمدة', value: '5' },
        { label: '6 أعمدة', value: '6' }
      ] },
      { name: 'cardBg', label: 'لون خلفية البطاقة', type: 'color', defaultValue: '#ffffff' },
      { name: 'cardBorder', label: 'لون حد البطاقة', type: 'color', defaultValue: '#f1f5f9' },
      { name: 'titleColor', label: 'لون عنوان البطاقة', type: 'color', defaultValue: '#374151' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      gridCols: '4',
      cardBg: '#ffffff',
      cardBorder: '#f1f5f9',
      titleColor: '#374151',
      cards: [
        { id: '1', title: 'الطلاب النشطين', value: '1,248 طالب', change: '+12% هذا الأسبوع', isPositive: true, icon: 'Users', color: '#2563eb' },
        { id: '2', title: 'المبيعات الكلية', value: '14,850 ريال', change: '+8.4% منذ أمس', isPositive: true, icon: 'Wallet', color: '#10b981' },
        { id: '3', title: 'الدورات المنجزة', value: '312 دورة', change: '-2.1% هذا الشهر', isPositive: false, icon: 'Award', color: '#f59e0b' },
        { id: '4', title: 'ساعات المشاهدة', value: '5,280 ساعة', change: '+24% مؤخراً', isPositive: true, icon: 'Clock', color: '#8b5cf6' }
      ]
    }
  },

  'charts': {
    type: 'charts',
    name: 'الرسومات البيانية (Charts)',
    category: 'data',
    icon: 'LayoutGrid',
    fields: [
      { name: 'title', label: 'عنوان الرسم البياني', type: 'text', defaultValue: 'إحصائيات التسجيل الشهري' },
      { name: 'chartType', label: 'نوع المخطط', type: 'select', defaultValue: 'area', options: [
        { label: 'مخطط مساحي (Area)', value: 'area' },
        { label: 'مخطط أعمدة (Bar)', value: 'bar' },
        { label: 'مخطط خطي (Line)', value: 'line' }
      ] },
      { name: 'primaryColor', label: 'اللون الأساسي', type: 'color', defaultValue: '#2563eb' },
      { name: 'secondaryColor', label: 'اللون الفرعي', type: 'color', defaultValue: '#fbbf24' },
      { name: 'height', label: 'ارتفاع المخطط (بكسل)', type: 'number', defaultValue: 300 },
      { name: 'showGrid', label: 'إظهار شبكة المخطط', type: 'boolean', defaultValue: true },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'إحصائيات التسجيل الشهري',
      chartType: 'area',
      primaryColor: '#2563eb',
      secondaryColor: '#fbbf24',
      height: 300,
      showGrid: true
    }
  },

  'tables': {
    type: 'tables',
    name: 'جدول البيانات (Table Report)',
    category: 'data',
    icon: 'FileText',
    fields: [
      { name: 'title', label: 'عنوان الجدول', type: 'text', defaultValue: 'آخر المسجلين بالدورات' },
      { name: 'showSearch', label: 'تفعيل شريط البحث السريع', type: 'boolean', defaultValue: true },
      { name: 'rowsLimit', label: 'الحد الأقصى للسطور المعروضة', type: 'number', defaultValue: 5 },
      { name: 'headerBg', label: 'لون خلفية الترويسة', type: 'color', defaultValue: '#f8fafc' },
      { name: 'rowHoverColor', label: 'لون تظليل السطر عند التمرير', type: 'color', defaultValue: '#eff6ff' },
      { name: 'titleColor', label: 'لون عنوان الجدول', type: 'color', defaultValue: '#111827' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'آخر المسجلين بالدورات',
      showSearch: true,
      rowsLimit: 5,
      headerBg: '#f8fafc',
      rowHoverColor: '#eff6ff',
      titleColor: '#111827',
    }
  },

  'student-feed': {
    type: 'student-feed',
    name: 'نشاطات الطلاب (Student Activity Feed)',
    category: 'content',
    icon: 'Users',
    fields: [
      { name: 'title', label: 'عنوان لوحة الأنشطة', type: 'text', defaultValue: 'تحديثات نشاط المتعلمين' },
      { name: 'limit', label: 'عدد الأنشطة', type: 'number', defaultValue: 4 },
      { name: 'showStatusBadges', label: 'إظهار شارات الحالة والنوع', type: 'boolean', defaultValue: true },
      { name: 'cardBg', label: 'لون خلفية البطاقة', type: 'color', defaultValue: '#ffffff' },
      { name: 'titleColor', label: 'لون العنوان', type: 'color', defaultValue: '#111827' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'تحديثات نشاط المتعلمين',
      limit: 4,
      showStatusBadges: true,
      cardBg: '#ffffff',
      titleColor: '#111827',
    }
  },

  'course-cards': {
    type: 'course-cards',
    name: 'بطاقات الدورات (Course Cards)',
    category: 'content',
    icon: 'GraduationCap',
    fields: [
      { name: 'title', label: 'العنوان الجانبي للقسم', type: 'text', defaultValue: 'تصفح كورس جديد الآن' },
      { name: 'gridCols', label: 'تخطيط شبكة العرض (أعمدة)', type: 'select', defaultValue: '3', options: [
        { label: 'عمودين', value: '2' },
        { label: '3 أعمدة', value: '3' },
        { label: '4 أعمدة', value: '4' },
        { label: '5 أعمدة', value: '5' },
        { label: '6 أعمدة', value: '6' }
      ] },
      { name: 'showPrice', label: 'عرض تسعير الكورسات', type: 'boolean', defaultValue: true },
      { name: 'showStudentsCount', label: 'عرض عدد الطلاب المقيدين', type: 'boolean', defaultValue: true },
      { name: 'buttonBg', label: 'لون زر التسجيل بالدورة', type: 'color', defaultValue: '#2563eb' },
      { name: 'cardBg', label: 'لون خلفية بطاقة الدورة', type: 'color', defaultValue: '#ffffff' },
      { name: 'titleColor', label: 'لون عنوان القسم', type: 'color', defaultValue: '#111827' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'تصفح كورس جديد الآن',
      gridCols: '3',
      showPrice: true,
      showStudentsCount: true,
      buttonBg: '#2563eb',
      cardBg: '#ffffff',
      titleColor: '#111827',
    }
  },

  'sidebar': {
    type: 'sidebar',
    name: 'شريط القائمة الجانبية (Sidebar)',
    category: 'navigation',
    icon: 'LayoutGrid',
    fields: [
      { name: 'title', label: 'اسم الأكاديمية بالبار', type: 'text', defaultValue: 'أكاديمية درب الذكية' },
      { name: 'logoText', label: 'حرف الشعار', type: 'text', defaultValue: 'د' },
      { name: 'theme', label: 'نمط المظهر الجانبي', type: 'select', defaultValue: 'light', options: [
        { label: 'فاتح (Light)', value: 'light' },
        { label: 'داكن (Dark)', value: 'dark' }
      ] },
      { name: 'accentColor', label: 'اللون التنشيطي (Accent)', type: 'color', defaultValue: '#2563eb' },
      { name: 'bgColor', label: 'لون خلفية الشريط الجانبي', type: 'color', defaultValue: '#ffffff' },
      { name: 'textColor', label: 'لون نص القائمة', type: 'color', defaultValue: '#374151' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'أكاديمية درب الذكية',
      logoText: 'د',
      theme: 'light',
      accentColor: '#2563eb',
      bgColor: '#ffffff',
      textColor: '#374151',
    }
  },

  'navbar': {
    type: 'navbar',
    name: 'شريط الترويسة العلوي (Navbar)',
    category: 'navigation',
    icon: 'Globe',
    fields: [
      { name: 'title', label: 'العنوان / لوجو الترويسة', type: 'text', defaultValue: 'بوابة التعلم' },
      { name: 'showSearch', label: 'تفعيل خانة البحث السريع', type: 'boolean', defaultValue: true },
      { name: 'showProfile', label: 'عرض أيقونة حساب المستخدم', type: 'boolean', defaultValue: true },
      { name: 'bgColor', label: 'لون الخلفية', type: 'color', defaultValue: '#ffffff' },
      { name: 'borderColor', label: 'لون الحد السفلي', type: 'color', defaultValue: '#e2e8f0' },
      { name: 'titleColor', label: 'لون عنوان الترويسة', type: 'color', defaultValue: '#111827' },
      { name: 'iconColor', label: 'لون الأيقونات', type: 'color', defaultValue: '#6b7280' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'بوابة التعلم',
      showSearch: true,
      showProfile: true,
      bgColor: '#ffffff',
      borderColor: '#e2e8f0',
      titleColor: '#111827',
      iconColor: '#6b7280',
    }
  },

  'tabs': {
    type: 'tabs',
    name: 'أزرار التبويب (Tabs Switcher)',
    category: 'navigation',
    icon: 'ChevronLeft',
    fields: [
      { name: 'activeTabColor', label: 'لون التبويب المفعل', type: 'color', defaultValue: '#2563eb' },
      { name: 'tabBg', label: 'لون خلفية التبويبات', type: 'color', defaultValue: '#f8fafc' },
      { name: 'tabTextColor', label: 'لون نص التبويبات', type: 'color', defaultValue: '#6b7280' },
      { name: 'alignment', label: 'المحاذاة الأفقية للتبويبات', type: 'select', defaultValue: 'right', options: [
        { label: 'يمين', value: 'right' },
        { label: 'وسط', value: 'center' },
        { label: 'يسار', value: 'left' }
      ] },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      activeTabColor: '#2563eb',
      tabBg: '#f8fafc',
      tabTextColor: '#6b7280',
      alignment: 'right',
      tabs: [
        { id: '1', label: 'الدورات المتاحة' },
        { id: '2', label: 'مسارات التعلم التفاعلية' },
        { id: '3', label: 'الشهادات المعتمدة' }
      ]
    }
  },

  'metrics': {
    type: 'metrics',
    name: 'مؤشرات الأداء المصغرة (Metrics cards)',
    category: 'data',
    icon: 'TrendingUp',
    fields: [
      { name: 'title', label: 'العنوان الجانبي للبطاقات', type: 'text', defaultValue: 'معدل التقدم العام' },
      { name: 'layout', label: 'شكل التخطيط', type: 'select', defaultValue: 'grid', options: [
        { label: 'شبكة (Grid)', value: 'grid' },
        { label: 'قائمة رأسية (List)', value: 'list' }
      ] },
      { name: 'cardBg', label: 'لون خلفية البطاقة', type: 'color', defaultValue: '#ffffff' },
      { name: 'labelColor', label: 'لون تسمية المؤشر', type: 'color', defaultValue: '#6b7280' },
      { name: 'valueColor', label: 'لون قيمة المؤشر', type: 'color', defaultValue: '#111827' },
      ...SECTION_STYLE_FIELDS,
    ],
    defaultProps: {
      title: 'معدل التقدم العام',
      layout: 'grid',
      cardBg: '#ffffff',
      labelColor: '#6b7280',
      valueColor: '#111827',
    }
  }
};
