import React from 'react';
import { Clock, Users, BookOpen } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { getTypographyStyle } from '../utils/typography';

interface CourseCardsProps {
  title?: string;
  gridCols?: '2' | '3' | '4' | '5' | '6';
  showPrice?: boolean;
  showStudentsCount?: boolean;
  buttonBg?: string;
  courses?: any[];
  [key: string]: any;
}

export const MOCK_COURSES = [
  { id: '1', title: 'دورة أدوبي فوتوشوب للمبتدئين', instructor: 'م. محمد المفتي', price: '250 ريال', students: '109 طالب', duration: '6 ساعات', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM' },
  { id: '2', title: 'ميكروسوفت إكسيل من الصفر للاحتراف', instructor: 'أ. صهيب حسن', price: '190 ريال', students: '243 طالب', duration: '12 ساعة', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI' },
  { id: '3', title: 'أساسيات صناعة المحتوى والأفلام', instructor: 'م. عمرو البرلسي', price: '400 ريال', students: '87 طالب', duration: '8 ساعات', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI' },
  { id: '4', title: 'اللغة الإنجليزية التفاعلية - المستوى 1', instructor: 'أ. مصطفى عبد الصبور', price: '250 ريال', students: '312 طالب', duration: '15 ساعة', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM' }
];

export default function CourseCards(props: CourseCardsProps) {
  const {
    title = 'أحدث الدورات المسجلة',
    gridCols = '3',
    showPrice = true,
    showStudentsCount = true,
    buttonBg = '#2563eb',
    courses = MOCK_COURSES,
  } = props;

  // Read deviceMode with a fail-safe fallback
  let deviceMode = 'desktop';
  try {
    deviceMode = useBuilderStore((state) => state.deviceMode);
  } catch (e) {
    // Fallback if rendered outside the store context
  }

  const getGridClass = () => {
    if (deviceMode === 'mobile') return 'grid-cols-1';
    if (deviceMode === 'tablet') return 'grid-cols-2';
    
    return gridCols === '2' ? 'grid-cols-2' :
           gridCols === '4' ? 'grid-cols-4' : 
           gridCols === '5' ? 'grid-cols-5' :
           gridCols === '6' ? 'grid-cols-6' : 'grid-cols-3';
  };

  const gridClass = getGridClass();

  // Limit course display for grid mapping
  const coursesToRender = courses;

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-base md:text-lg',
    weight: 'font-black',
    color: '#1f2937'
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 
          style={titleTypography.style}
          className={`flex items-center gap-2.5 ${titleTypography.className}`}
        >
          <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: buttonBg }}></span>
          {title}
        </h3>
        
        <span className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
          عرض الكل
        </span>
      </div>

      <div className={`grid gap-6 ${gridClass}`}>
        {coursesToRender.map((course) => (
          <div 
            key={course.id} 
            className="bg-white rounded-3xl overflow-hidden shadow-[0_12px_30px_rgba(25,28,29,0.02)] border border-slate-100/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Image Header with styled avatar overlay */}
            <div className="h-40 relative overflow-hidden bg-[#0a192f] flex items-center justify-center p-4">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-20 h-20 rounded-full border-2 border-white/60 object-cover shadow-sm bg-slate-700 relative z-10 transition-transform duration-500 group-hover:scale-105"
              />
              {/* Blur design backgrounds */}
              <div className="absolute inset-0 bg-slate-950/40 z-0" />
              <div className="absolute bottom-3 right-4 text-right z-10">
                <span className="text-[10px] font-black text-blue-400 block tracking-wider uppercase">محاضرة معتمدة</span>
                <span className="text-xs font-black text-white block mt-0.5">{course.instructor}</span>
              </div>
            </div>

            {/* Course Information details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <h4 className="text-xs font-black text-slate-800 leading-snug group-hover:text-blue-600 transition-colors min-h-[36px]">
                {course.title}
              </h4>
              
              <div className="flex items-center justify-between text-[9px] text-slate-400 font-black pt-3 border-t border-slate-50">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.duration}
                </span>
                
                {showStudentsCount && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-blue-500" />
                    {course.students}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                {showPrice ? (
                  <span className="text-sm font-black text-slate-800">
                    {course.price}
                  </span>
                ) : <span className="w-1"></span>}

                <button 
                  style={{ backgroundColor: buttonBg }}
                  className="hover:brightness-110 text-white font-black text-[9px] px-3.5 py-2 rounded-lg transition-all shadow-sm shadow-blue-500/10 active:scale-95"
                >
                  انضم الآن
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
