import { z } from 'zod';

export const HeroBannerSchema = z.object({
  title: z.string().min(1, 'الرجاء كتابة العنوان الرئيسي'),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  align: z.enum(['right', 'center', 'left']).default('right'),
  titleColor: z.string().default('#1f2937'),
  subtitleColor: z.string().default('#6b7280'),
  buttonColor: z.string().default('#2563eb'),
  buttonTextColor: z.string().default('#ffffff'),
  backgroundColor: z.string().default('#f8fafc'),
  bgImage: z.string().optional(),
  paddingTop: z.string().default('py-16'),
  paddingBottom: z.string().default('py-16'),
});

export const KpiCardsSchema = z.object({
  cards: z.array(z.object({
    id: z.string(),
    title: z.string(),
    value: z.string(),
    change: z.string().optional(),
    isPositive: z.boolean().default(true),
    icon: z.string().default('TrendingUp'),
    color: z.string().default('#2563eb'),
  })),
  gridCols: z.enum(['1', '2', '3', '4', '5', '6']).default('4'),
});

export const ChartsBlockSchema = z.object({
  title: z.string().min(1),
  chartType: z.enum(['area', 'bar', 'line']).default('area'),
  primaryColor: z.string().default('#2563eb'),
  secondaryColor: z.string().default('#fbbf24'),
  height: z.number().default(300),
  showGrid: z.boolean().default(true),
});

export const TableBlockSchema = z.object({
  title: z.string().default('التقارير الأخيرة'),
  showSearch: z.boolean().default(true),
  rowsLimit: z.number().default(5),
  headerBg: z.string().default('#f8fafc'),
});

export const StudentFeedSchema = z.object({
  title: z.string().default('نشاط الطلاب الأخير'),
  limit: z.number().default(4),
  showStatusBadges: z.boolean().default(true),
});

export const CourseCardsSchema = z.object({
  title: z.string().default('أحدث الدورات المسجلة'),
  gridCols: z.enum(['2', '3', '4', '5', '6']).default('3'),
  showPrice: z.boolean().default(true),
  showStudentsCount: z.boolean().default(true),
  buttonBg: z.string().default('#2563eb'),
});

export const SidebarBlockSchema = z.object({
  title: z.string().default('لوحة التحكم'),
  logoText: z.string().default('د'),
  theme: z.enum(['light', 'dark']).default('light'),
  accentColor: z.string().default('#2563eb'),
});

export const NavbarBlockSchema = z.object({
  title: z.string().default('الأكاديمية الخاصة بي'),
  showSearch: z.boolean().default(true),
  showProfile: z.boolean().default(true),
  bgColor: z.string().default('#ffffff'),
  borderColor: z.string().default('#e2e8f0'),
});

export const TabsBlockSchema = z.object({
  tabs: z.array(z.object({
    id: z.string(),
    label: z.string(),
  })),
  activeTabColor: z.string().default('#2563eb'),
  alignment: z.enum(['right', 'center', 'left']).default('right'),
});

export const MetricsCardsSchema = z.object({
  title: z.string().default('مؤشرات الأداء'),
  layout: z.enum(['grid', 'list']).default('grid'),
  cardBg: z.string().default('#ffffff'),
});

export const HeroSectionSchema = z.object({
  title: z.string().default('Welcome'),
  subtitle: z.string().optional(),
  background_color: z.string().default('#ffffff'),
  text_color: z.string().default('#1f2937'),
  font_size: z.union([z.string(), z.number()]).default(48),
  font_weight: z.number().default(700),
  padding_top: z.number().default(60),
  padding_bottom: z.number().default(60),
  border_radius: z.number().default(12),
  button_color: z.string().default('#2563eb'),
  show_button: z.boolean().default(true),
  button_text: z.string().default('Get Started'),
  button_link: z.string().default('#'),
  align: z.enum(['right', 'center', 'left']).default('center'),
  slider_speed: z.number().default(4),
  show_arrows: z.boolean().default(true),
  items: z.array(z.object({
    order: z.number(),
    props: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      button_text: z.string().optional(),
      button_link: z.string().optional(),
      bg_image: z.string().optional(),
      background_color: z.string().default('#1e40af'),
      button_color: z.string().default('#ffffff'),
      align: z.enum(['right', 'center', 'left']).default('right')
    })
  })).default([])
});

export const FeaturesSectionSchema = z.object({
  title: z.string().default('Our Features'),
  subtitle: z.string().optional(),
  background_color: z.string().default('#f8fafc'),
  text_color: z.string().default('#1f2937'),
  padding_top: z.number().default(60),
  padding_bottom: z.number().default(60),
  grid_cols: z.number().default(3),
  items: z.array(z.object({
    order: z.number(),
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().default('Star'),
      icon_color: z.string().default('#2563eb'),
    })
  })).default([]),
});

export const FaqSectionSchema = z.object({
  title: z.string().default('Frequently Asked Questions'),
  subtitle: z.string().optional(),
  background_color: z.string().default('#ffffff'),
  text_color: z.string().default('#1f2937'),
  padding_top: z.number().default(60),
  padding_bottom: z.number().default(60),
  items: z.array(z.object({
    order: z.number(),
    props: z.object({
      question: z.string(),
      answer: z.string(),
    })
  })).default([]),
});

export const TestimonialsSectionSchema = z.object({
  title: z.string().default('Testimonials'),
  subtitle: z.string().optional(),
  background_color: z.string().default('#f8fafc'),
  text_color: z.string().default('#1f2937'),
  padding_top: z.number().default(60),
  padding_bottom: z.number().default(60),
  items: z.array(z.object({
    order: z.number(),
    props: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string().optional(),
      rating: z.number().default(5),
      avatar: z.string().optional(),
    })
  })).default([]),
});

export const GallerySectionSchema = z.object({
  title: z.string().default('Gallery'),
  subtitle: z.string().optional(),
  background_color: z.string().default('#ffffff'),
  text_color: z.string().default('#1f2937'),
  padding_top: z.number().default(60),
  padding_bottom: z.number().default(60),
  grid_cols: z.number().default(4),
  items: z.array(z.object({
    order: z.number(),
    props: z.object({
      image_url: z.string(),
      caption: z.string().optional(),
    })
  })).default([]),
});

export const PricingSectionSchema = z.object({
  title: z.string().default('Pricing Plans'),
  subtitle: z.string().optional(),
  background_color: z.string().default('#ffffff'),
  text_color: z.string().default('#1f2937'),
  padding_top: z.number().default(60),
  padding_bottom: z.number().default(60),
  items: z.array(z.object({
    order: z.number(),
    props: z.object({
      plan_name: z.string(),
      price: z.string(),
      period: z.string().default('month'),
      button_text: z.string().default('Choose Plan'),
      button_link: z.string().default('#'),
      features_list: z.string().optional(),
      is_popular: z.boolean().default(false),
    })
  })).default([]),
});

// Main map linking node type to its corresponding schema validator
export const componentSchemas: Record<string, z.ZodTypeAny> = {
  'hero': HeroBannerSchema,
  'kpi-cards': KpiCardsSchema,
  'charts': ChartsBlockSchema,
  'tables': TableBlockSchema,
  'student-feed': StudentFeedSchema,
  'course-cards': CourseCardsSchema,
  'sidebar': SidebarBlockSchema,
  'navbar': NavbarBlockSchema,
  'tabs': TabsBlockSchema,
  'metrics': MetricsCardsSchema,
  // Dynamic backend-linked sections
  'hero_section': HeroSectionSchema,
  'features_section': FeaturesSectionSchema,
  'faq_section': FaqSectionSchema,
  'testimonials_section': TestimonialsSectionSchema,
  'gallery_section': GallerySectionSchema,
  'pricing_section': PricingSectionSchema,
};

export function validateNodeProps(type: string, props: Record<string, any>) {
  const schema = componentSchemas[type];
  if (!schema) return { success: true, data: props };
  return schema.safeParse(props);
}
