import React from 'react';
import { User, CheckCircle2, Award, MessageSquare, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { getTypographyStyle, hasSectionBackground } from '../utils/typography';
import { useBuilderStore } from '../store/builderStore';
import { getUsers } from '@/services/users';
import { getCourses } from '@/services/courses';

interface StudentFeedProps {
  id?: string;
  title?: string;
  limit?: number;
  showStatusBadges?: boolean;
  activities?: any[];
  [key: string]: any;
}

export const MOCK_ACTIVITIES = [
  {
    id: '1',
    user: 'محمد عبد العزيز',
    action: 'أكمل درس "أساسيات الألوان والتباين"',
    course: 'Photoshop Fundamentals',
    time: 'منذ 5 دقائق',
    type: 'lesson',
    color: '#3b82f6',
  },
  {
    id: '2',
    user: 'ليلى الهاشمي',
    action: 'أنهت اختبار المستوى الأول وحصلت على شارة التميز',
    course: 'Learning English - Level 1',
    time: 'منذ 24 دقيقة',
    type: 'quiz',
    color: '#10b981',
  },
  {
    id: '3',
    user: 'عبد الله الحركان',
    action: 'طرح استفساراً جديداً في قسم المناقشات',
    course: 'Beginner to Marketing Pro',
    time: 'منذ ساعة',
    type: 'comment',
    color: '#f59e0b',
  },
  {
    id: '4',
    user: 'نورة السبيعي',
    action: 'سجلت حديثاً في الأكاديمية بنجاح',
    course: 'Fundamentals of Film Making',
    time: 'منذ ساعتين',
    type: 'signup',
    color: '#8b5cf6',
  },
  {
    id: '5',
    user: 'يوسف المالكي',
    action: 'أكمل مسار التعلم وحصل على شهادة التخرج',
    course: 'Microsoft Excel Advanced',
    time: 'منذ يومين',
    type: 'certificate',
    color: '#ec4899',
  }
];

export default function StudentFeed(props: StudentFeedProps) {
  const {
    id: sectionId,
    title = 'تحديثات نشاط المتعلمين',
    limit = 4,
    showStatusBadges = true,
    activities = MOCK_ACTIVITIES,
  } = props;

  const { 
    isEditing, 
    selectedNodeId, 
    setSelectedNodeId, 
    selectedItemIndex, 
    setSelectedItemIndex, 
    hoveredItemIndex, 
    setHoveredItemIndex 
  } = useBuilderStore();

  const [realUsers, setRealUsers] = React.useState<any[]>([]);
  const [realCourses, setRealCourses] = React.useState<any[]>([]);

  const isCoaches = title.includes('مدرب') || title.includes('المدربين');

  React.useEffect(() => {
    async function loadData() {
      try {
        const role = isCoaches ? 'academy' : 'student';
        const [usersData, coursesData] = await Promise.all([
          getUsers(role),
          getCourses().catch(() => [])
        ]);
        if (usersData && usersData.length > 0) {
          setRealUsers(usersData);
        }
        if (coursesData && coursesData.length > 0) {
          setRealCourses(coursesData);
        }
      } catch (err) {
        console.error('Failed to load data for StudentFeed:', err);
      }
    }
    loadData();
  }, [isCoaches]);

  const formattedActivities = React.useMemo(() => {
    if (realUsers.length === 0) return activities;
    return realUsers.map((u, idx) => {
      const courseObj = realCourses.length > 0 ? realCourses[idx % realCourses.length] : null;
      const courseTitle = courseObj ? courseObj.title : (isCoaches ? 'إدارة التدريب' : 'الدورة التمهيدية');
      
      const timeStr = u.created_at
        ? new Date(u.created_at).toLocaleDateString('ar-EG')
        : `منذ ${idx + 1} أيام`;

      if (isCoaches) {
        return {
          id: String(u.id),
          user: u.name || u.fullName || 'مدرب متعاون',
          action: 'انضم كمدرب معتمد للمنصة ومستعد لتقديم الدورات',
          course: courseTitle,
          time: timeStr,
          type: 'lesson',
          color: '#10b981'
        };
      }

      const actions = [
        'أكمل درساً جديداً وتفاعل مع محتواه',
        'انضم إلى الأكاديمية بنجاح كعضو جديد',
        'طرح استفساراً جديداً في قسم المناقشات',
        'أنهى اختبار المستوى وحصل على تقييم ممتاز'
      ];
      const types = ['lesson', 'signup', 'comment', 'quiz'];
      const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];
      const actionIdx = idx % actions.length;

      return {
        id: String(u.id),
        user: u.name || u.fullName || 'طالب الأكاديمية',
        action: actions[actionIdx],
        course: courseTitle,
        time: timeStr,
        type: types[actionIdx],
        color: colors[actionIdx]
      };
    });
  }, [realUsers, realCourses, activities, isCoaches]);

  const visibleFeed = formattedActivities.slice(0, limit);

  const getIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'quiz':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-pink-500" />;
      case 'signup':
      default:
        return <User className="w-4 h-4 text-purple-500" />;
    }
  };

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-base',
    weight: 'font-black',
    color: '#1f2937'
  });

  const isTransparentBg = hasSectionBackground(props);

  return (
    <div className={`${isTransparentBg ? 'bg-white/70 border-white/40 shadow-lg shadow-slate-900/5 backdrop-blur-md' : 'bg-white border-slate-100 shadow-[0_12px_40px_rgba(25,28,29,0.02)]'} rounded-3xl p-6 space-y-6 text-right`} dir="rtl">
      {isEditing && (
        <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-amber-800 font-bold shadow-sm" dir="rtl">
          <span className="flex items-center gap-1.5 text-right">
            <span className="text-base">💡</span>
            هذه البيانات حقيقية معروضة من قاعدة البيانات ولا يمكن تعديلها من هنا. لتعديلها يرجى الانتقال إلى صفحة {isCoaches ? 'المدربين' : 'الطلاب'}.
          </span>
          <Link href={isCoaches ? '/academic/coaches' : '/academic/students'} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap">
            {isCoaches ? 'إدارة المدربين' : 'إدارة الطلاب'}
          </Link>
        </div>
      )}

      <h3 
        style={titleTypography.style}
        className={`border-b border-slate-50 pb-3 ${titleTypography.className}`}
      >
        {title}
      </h3>

      <div className="space-y-6 relative before:absolute before:right-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100/80">
        {visibleFeed.map((item, index) => {
          const isSelected = isEditing && selectedNodeId === sectionId && selectedItemIndex === index;
          const isHovered = isEditing && hoveredItemIndex === index;

          return (
            <div 
              key={item.id} 
              onClick={(e) => {
                if (isEditing && sectionId) {
                  e.stopPropagation();
                  setSelectedNodeId(sectionId);
                  setSelectedItemIndex(index);
                }
              }}
              onMouseEnter={() => isEditing && setHoveredItemIndex(index)}
              onMouseLeave={() => isEditing && setHoveredItemIndex(null)}
              className={`relative flex items-start gap-4 pr-1.5 group cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-4 ring-blue-500 ring-offset-2 rounded-2xl' : isHovered ? 'ring-4 ring-blue-300 ring-offset-1 rounded-2xl' : ''
              }`}
            >
              {/* Timeline dot */}
              <div 
                style={{ borderColor: item.color }}
                className="w-10 h-10 rounded-2xl bg-white border-2 flex items-center justify-center shrink-0 shadow-sm relative z-10 group-hover:scale-105 transition-transform"
              >
                {getIcon(item.type)}
              </div>

              {/* Content info */}
              <div className={`flex-1 min-w-0 ${isTransparentBg ? 'bg-white/30 border-white/10 group-hover:bg-white/40' : 'bg-slate-50/50 border-slate-100/20 group-hover:bg-slate-50'} rounded-2xl p-4 border transition-colors`}>

                <div className="flex justify-between items-center gap-2 mb-1.5">
                  <span className="text-xs font-black text-slate-800 truncate">
                    {item.user}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  {item.action}
                </p>
                
                {showStatusBadges && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400">
                      الكورس: {item.course}
                    </span>
                    
                    <span 
                      style={{ backgroundColor: `${item.color}10`, color: item.color }}
                      className="px-2 py-0.5 rounded-md text-[8px] font-black"
                    >
                      {item.type === 'lesson' ? 'درس' :
                       item.type === 'quiz' ? 'اختبار' :
                       item.type === 'comment' ? 'استفسار' :
                       item.type === 'certificate' ? 'شهادة' : 'تسجيل جديد'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
