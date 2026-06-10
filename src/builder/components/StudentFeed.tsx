import React from 'react';
import { User, CheckCircle2, Award, MessageSquare, BookOpen } from 'lucide-react';
import { getTypographyStyle } from '../utils/typography';

interface StudentFeedProps {
  title?: string;
  limit?: number;
  showStatusBadges?: boolean;
  [key: string]: any;
}

const MOCK_ACTIVITIES = [
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
    title = 'تحديثات نشاط المتعلمين',
    limit = 4,
    showStatusBadges = true,
  } = props;
  const visibleFeed = MOCK_ACTIVITIES.slice(0, limit);

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

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_12px_40px_rgba(25,28,29,0.02)] space-y-6 text-right" dir="rtl">
      
      <h3 
        style={titleTypography.style}
        className={`border-b border-slate-50 pb-3 ${titleTypography.className}`}
      >
        {title}
      </h3>

      <div className="space-y-6 relative before:absolute before:right-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100/80">
        {visibleFeed.map((item) => (
          <div key={item.id} className="relative flex items-start gap-4 pr-1.5 group">
            
            {/* Timeline dot */}
            <div 
              style={{ borderColor: item.color }}
              className="w-10 h-10 rounded-2xl bg-white border-2 flex items-center justify-center shrink-0 shadow-sm relative z-10 group-hover:scale-105 transition-transform"
            >
              {getIcon(item.type)}
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0 bg-slate-50/50 rounded-2xl p-4 border border-slate-100/20 group-hover:bg-slate-50 transition-colors">
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
        ))}
      </div>
    </div>
  );
}
