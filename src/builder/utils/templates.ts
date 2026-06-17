import { TemplateSchema } from '../interfaces';

export const MOCK_TEMPLATES: Record<string, TemplateSchema> = {
  'academy-dashboard': {
    id: 'academy-dashboard',
    name: 'لوحة التحكم الكلاسيكية (المتكاملة)',
    description: 'قالب لوحة تحكم ذكي يتضمن إحصائيات الطلاب والمبيعات وتحديثات النشاط المباشر.',
    status: 'draft',
    version: '1.0',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'navbar-1',
        type: 'navbar',
        props: {
          title: 'بوابة أكاديمية درب الكلاسيكية',
          showSearch: true,
          showProfile: true,
          bgColor: '#ffffff',
          borderColor: '#f1f5f9'
        }
      },
      {
        id: 'hero-1',
        type: 'hero',
        props: {
          title: 'مرحباً بك في لوحة تحكم الأكاديمية الجديدة',
          subtitle: 'تابع أداء طلابك، مبيعات الدورات، وتقارير المشاهدة أولاً بأول من مكان واحد وبشكل تفاعلي بالكامل.',
          buttonText: 'تصفح التقارير الشاملة',
          buttonLink: '#',
          align: 'right',
          titleColor: '#1f2937',
          subtitleColor: '#4b5563',
          buttonColor: '#2563eb',
          buttonTextColor: '#ffffff',
          backgroundColor: '#eff6ff',
          bgImage: ''
        }
      },
      {
        id: 'kpis-1',
        type: 'kpi-cards',
        props: {
          gridCols: '4',
          cards: [
            { id: '1', title: 'الطلاب النشطين اليوم', value: '1,248 متعلم', change: '+12% هذا الأسبوع', isPositive: true, icon: 'Users', color: '#2563eb' },
            { id: '2', title: 'المبيعات الكلية', value: '14,850 ريال', change: '+8.4% منذ أمس', isPositive: true, icon: 'Wallet', color: '#10b981' },
            { id: '3', title: 'الدورات المنجزة', value: '312 دورة كورس', change: '-2.1% هذا الشهر', isPositive: false, icon: 'Award', color: '#f59e0b' },
            { id: '4', title: 'ساعات البث المنجزة', value: '5,280 ساعة', change: '+24% مؤخراً', isPositive: true, icon: 'Clock', color: '#8b5cf6' }
          ]
        }
      },
      {
        id: 'charts-1',
        type: 'charts',
        props: {
          title: 'تحليلات تقدم الطلاب وإحصائيات المبيعات',
          chartType: 'area',
          primaryColor: '#2563eb',
          secondaryColor: '#f59e0b',
          height: 300,
          showGrid: true
        }
      },
      {
        id: 'tabs-1',
        type: 'tabs',
        props: {
          activeTabColor: '#2563eb',
          alignment: 'right',
          tabs: [
            { id: '1', label: 'إدارة الكورسات' },
            { id: '2', label: 'المشتركين الجدد' },
            { id: '3', label: 'المراجعات والتقييمات' }
          ]
        },
        children: []
      },
      {
        id: 'courses-1',
        type: 'course-cards',
        props: {
          title: 'أحدث الكورسات والدورات المسجلة بالأكاديمية',
          gridCols: '3',
          showPrice: true,
          showStudentsCount: true,
          buttonBg: '#2563eb'
        }
      },
      {
        id: 'tables-1',
        type: 'tables',
        props: {
          title: 'جدول تفصيلي لعمليات التسجيل الأخيرة',
          showSearch: true,
          rowsLimit: 5,
          headerBg: '#f8fafc'
        }
      },
      {
        id: 'feed-1',
        type: 'student-feed',
        props: {
          title: 'الأنشطة الأخيرة لمتعلمي الأكاديمية',
          limit: 4,
          showStatusBadges: true
        }
      }
    ]
  },
  'template_2': {
    id: 'template_2',
    name: 'لوحة التحكم الفيروزية (العصرية)',
    description: 'قالب لوحة تحكم ذكي بلمسات فيروزية رقيقة مناسب للمنصات التكنولوجية الحديثة.',
    status: 'draft',
    version: '1.0',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'navbar-2',
        type: 'navbar',
        props: {
          title: 'منصة إدراك التعليمية',
          showSearch: true,
          showProfile: true,
          bgColor: '#ffffff',
          borderColor: '#f1f5f9'
        }
      },
      {
        id: 'hero-2',
        type: 'hero',
        props: {
          title: 'منصة التعلم الذاتي المتطورة',
          subtitle: 'واجهة مشبعة بحيوية اللون الأخضر الفيروزي وتأثيرات بصرية راقية تجذب المتعلم الحديث لبناء مستقبل باهر.',
          buttonText: 'سجل الآن مجاناً',
          buttonLink: '#',
          align: 'center',
          titleColor: '#0f766e',
          subtitleColor: '#4b5563',
          buttonColor: '#00a896',
          buttonTextColor: '#ffffff',
          backgroundColor: '#f0fdfa',
          bgImage: ''
        }
      },
      {
        id: 'kpis-2',
        type: 'kpi-cards',
        props: {
          gridCols: '3',
          cards: [
            { id: '1', title: 'المسجلين في الدورة', value: '4,812 طالب', change: '+18% منذ الأسبوع الماضي', isPositive: true, icon: 'Users', color: '#00a896' },
            { id: '2', title: 'الإيرادات المحققة', value: '25,410 ريال', change: '+14.2% مؤخراً', isPositive: true, icon: 'Wallet', color: '#00a896' },
            { id: '3', title: 'إنجاز المنهج', value: '88% للدفعة الحالية', change: '+3% اليوم', isPositive: true, icon: 'CheckCircle', color: '#0f766e' }
          ]
        }
      },
      {
        id: 'courses-2',
        type: 'course-cards',
        props: {
          title: 'مسارات تعليمية مقترحة',
          gridCols: '3',
          showPrice: true,
          showStudentsCount: true,
          buttonBg: '#00a896'
        }
      }
    ]
  },
  'template_3': {
    id: 'template_3',
    name: 'القالب الأرجواني الإبداعي (Creative Purple)',
    description: 'تصميم فني راقٍ بلمسات أرجوانية وخلفيات ناعمة ملائم للأكاديميات الفنية والتصميم والتحريك.',
    status: 'draft',
    version: '1.0',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'navbar-3',
        type: 'navbar',
        props: {
          title: 'أكاديمية الفنون البصرية والتحريك',
          showSearch: true,
          showProfile: true,
          bgColor: '#FAF5FF',
          borderColor: '#f3e8ff'
        }
      },
      {
        id: 'hero-3',
        type: 'hero',
        props: {
          title: 'أطلق إبداعك الفني معنا اليوم',
          subtitle: 'مسارات تعليمية متطورة لرواد التصميم الجرافيكي، التحريك ثلاثي الأبعاد، والفنون البصرية بإشراف كبار الفنانين المبدعين.',
          buttonText: 'تصفح مسارات التعلم',
          buttonLink: '#',
          align: 'right',
          titleColor: '#581c87',
          subtitleColor: '#6b21a8',
          buttonColor: '#8b5cf6',
          buttonTextColor: '#ffffff',
          backgroundColor: '#FAF5FF',
          bgImage: ''
        }
      },
      {
        id: 'kpis-3',
        type: 'kpi-cards',
        props: {
          gridCols: '3',
          cards: [
            { id: '1', title: 'المشاركين النشطين', value: '842 مصمم', change: '+24% هذا الشهر', isPositive: true, icon: 'Users', color: '#8b5cf6' },
            { id: '2', title: 'المشاريع المنجزة', value: '1,890 مشروع', change: '+12% مؤخراً', isPositive: true, icon: 'Award', color: '#8b5cf6' },
            { id: '3', title: 'الشهادات الصادرة', value: '450 شهادة', change: '+6% منذ أمس', isPositive: true, icon: 'CheckCircle', color: '#581c87' }
          ]
        }
      },
      {
        id: 'metrics-3',
        type: 'metrics',
        props: {
          title: 'معدل تقدم الدفعة الإبداعية الحالية',
          layout: 'grid',
          cardBg: '#FAF5FF'
        }
      },
      {
        id: 'courses-3',
        type: 'course-cards',
        props: {
          title: 'أحدث الكورسات الفنية والتحريك ثلاثي الأبعاد',
          gridCols: '3',
          showPrice: true,
          showStudentsCount: true,
          buttonBg: '#8b5cf6'
        }
      }
    ]
  }
};

export const getTemplateById = (id: string): TemplateSchema => {
  return MOCK_TEMPLATES[id] || MOCK_TEMPLATES['academy-dashboard'];
};
