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
};

export function validateNodeProps(type: string, props: Record<string, any>) {
  const schema = componentSchemas[type];
  if (!schema) return { success: true, data: props };
  return schema.safeParse(props);
}
