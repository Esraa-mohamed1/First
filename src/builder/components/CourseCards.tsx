import React from 'react';
import { Clock, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useBuilderStore } from '../store/builderStore';
import { getTypographyStyle, hasSectionBackground } from '../utils/typography';
import { getCourses } from '@/services/courses';


interface CourseCardsProps {
  id?: string;
  title?: string;
  limit?: number;
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
    id: sectionId,
    title = 'أحدث الدورات المسجلة',
    limit = 3,
    gridCols = '3',
    showPrice = true,
    showStudentsCount = true,
    buttonBg = 'var(--theme-primary)',
    courses = MOCK_COURSES,
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

  let currentTemplate: any = null;
  try {
    currentTemplate = useBuilderStore((state) => state.currentTemplate);
  } catch (e) {
    // Fallback if rendered outside the store context
  }
  const isUdemy = currentTemplate?.id === 'template_2';

  const [realCourses, setRealCourses] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchRealData() {
      try {
        const data = await getCourses();
        if (data && data.length > 0) {
          setRealCourses(data);
        }
      } catch (err) {
        console.error('Failed to fetch courses in CourseCards:', err);
      }
    }
    fetchRealData();
  }, []);

  const formattedCourses = React.useMemo(() => {
    if (realCourses.length === 0) return courses;
    return realCourses.map(course => ({
      id: String(course.id),
      title: course.title,
      instructor: course.instructor || course.instructor_name || course.coach || 'أحمد محمد',
      price: Number(course.price) === 0 ? 'مجانًا' : `${course.price} ر.س`,
      students: `${course.students_count ?? course.students ?? 0} طالب`,
      duration: course.duration || (course.units?.reduce((acc: number, unit: any) => acc + (unit.lessons?.length || 0), 0) ? `${course.units.reduce((acc: number, unit: any) => acc + (unit.lessons?.length || 0), 0)} درس` : 'غير محدد'),
      image: course.image || course.cover_image || 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c',
      description: course.description
    }));
  }, [realCourses, courses]);

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
  const coursesToRender = formattedCourses.slice(0, limit);

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-base md:text-lg',
    weight: 'font-black',
    color: '#1f2937'
  });

  const isTransparentBg = hasSectionBackground(props);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {isEditing && (
        <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-amber-800 font-bold shadow-sm" dir="rtl">
          <span className="flex items-center gap-1.5">
            <span className="text-base">💡</span>
            هذه البيانات حقيقية معروضة من قاعدة البيانات ولا يمكن تعديلها من هنا. لتعديلها يرجى الانتقال إلى صفحة إدارة الدورات.
          </span>
          <Link href="/academic/courses" className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap">
            إدارة الدورات
          </Link>
        </div>
      )}
      
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
        {coursesToRender.map((course, idx) => {
          const isSelected = isEditing && selectedNodeId === sectionId && selectedItemIndex === idx;
          const isHovered = isEditing && hoveredItemIndex === idx;

          const isPurpleTheme = buttonBg === '#7c3aed';

          if (isUdemy) {
            return (
              <div 
                key={course.id} 
                onClick={(e) => {
                  if (isEditing && sectionId) {
                    e.stopPropagation();
                    setSelectedNodeId(sectionId);
                    setSelectedItemIndex(idx);
                  }
                }}
                onMouseEnter={() => isEditing && setHoveredItemIndex(idx)}
                onMouseLeave={() => isEditing && setHoveredItemIndex(null)}
                className={`bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                  isSelected ? 'ring-4 ring-[#a435f0] ring-offset-2' : isHovered ? 'ring-4 ring-purple-200' : ''
                }`}
              >
                {/* Course Image cover */}
                <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                  <img 
                    src={course.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c'} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  {/* Bestselling badge overlay */}
                  {idx % 2 === 0 && (
                    <span className="absolute top-2 right-2 bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 shadow-sm rounded-sm">
                      الأكثر مبيعاً
                    </span>
                  )}
                </div>

                {/* Course details */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-2 text-right">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-purple-600 transition-colors line-clamp-2 min-h-[40px]">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                      {course.instructor}
                    </p>
                    
                    {/* Rating UI */}
                    <div className="flex items-center gap-1.5 flex-row-reverse justify-end text-[11px] font-black text-amber-500" dir="ltr">
                      <span className="text-slate-400 font-bold">({120 + idx * 15})</span>
                      <div className="flex gap-0.5 text-amber-500">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span className={idx === 1 ? "text-slate-200" : "text-amber-500"}>★</span>
                      </div>
                      <span className="font-extrabold text-amber-600 text-xs">{idx === 1 ? "4.5" : "4.8"}</span>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {course.duration}
                      </span>
                      {showStudentsCount && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {course.students}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
                    {showPrice && (
                      <span className="text-sm font-extrabold text-slate-900">
                        {course.price || 'مجانًا'}
                      </span>
                    )}
                    <button 
                      style={{ backgroundColor: buttonBg || '#a435f0' }}
                      className="hover:brightness-110 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-sm transition-all shadow-sm active:scale-95"
                    >
                      انضم الآن
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          if (isPurpleTheme) {
            return (
              <div 
                key={course.id} 
                onClick={(e) => {
                  if (isEditing && sectionId) {
                    e.stopPropagation();
                    setSelectedNodeId(sectionId);
                    setSelectedItemIndex(idx);
                  }
                }}
                onMouseEnter={() => isEditing && setHoveredItemIndex(idx)}
                onMouseLeave={() => isEditing && setHoveredItemIndex(null)}
                className={`bg-white border border-slate-150 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                  isSelected ? 'ring-4 ring-purple-500 ring-offset-2' : isHovered ? 'ring-4 ring-purple-300 ring-offset-1' : 'shadow-sm'
                }`}
              >
                {/* Course Image cover */}
                <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                  <img 
                    src={course.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c'} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Course details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-right">
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-purple-600 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                      {course.description || 'تعلم مبادئ التصميم خطوة بخطوة وكيفية التعامل مع الألوان والخطوط لبناء واجهات سهلة الاستخدام ومحترفة.'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[11px] font-black text-purple-600 group-hover:gap-2 transition-all">
                      <span>عرض التفاصيل</span>
                      <span className="text-sm font-black">←</span>
                    </div>
                    {showPrice && (
                      <span className="text-xs font-black text-slate-400">
                        {course.price || 'مجانًا'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={course.id} 
              onClick={(e) => {
                if (isEditing && sectionId) {
                  e.stopPropagation();
                  setSelectedNodeId(sectionId);
                  setSelectedItemIndex(idx);
                }
              }}
              onMouseEnter={() => isEditing && setHoveredItemIndex(idx)}
              onMouseLeave={() => isEditing && setHoveredItemIndex(null)}
              className={`${isTransparentBg ? 'bg-white/70 border-white/40 shadow-lg shadow-slate-900/5 backdrop-blur-md' : 'bg-white border-slate-100/80 shadow-[0_12px_30px_rgba(25,28,29,0.02)]'} rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : isHovered ? 'ring-4 ring-blue-300 ring-offset-1' : ''
              }`}
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
          );
        })}
      </div>

    </div>
  );
}
