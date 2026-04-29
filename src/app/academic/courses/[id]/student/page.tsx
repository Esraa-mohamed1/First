'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Play, FileText, CheckCircle2, Clock, Globe, Award, 
  ChevronRight, Star, Users, Calendar, Share2, 
  ChevronDown, ChevronUp, Download, ShieldCheck, 
  Video, Monitor, DownloadCloud, Headset
} from 'lucide-react';
import { getCourse } from '@/services/courses';
import { Course, Unit } from '@/types/api';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

export default function CourseStudentViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourse(id);
        if ((data as any).chapters) {
          data.units = (data as any).chapters;
        }
        setCourse(data);
        // Expand first unit by default
        if (data.units && data.units.length > 0) {
          setExpandedUnits([data.units[0].id]);
        }
      } catch (error) {
        toast.error('فشل تحميل بيانات الدورة');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">جاري التحميل...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center font-bold">لم يتم العثور على الدورة</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans" dir="rtl">
      {/* 1. Hero Section (Blue Header) */}
      <div className="bg-[#0F172A] text-white pt-12 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-6">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
                <span>الرئيسية</span>
                <ChevronRight size={14} className="rotate-180" />
                <span>الدورات</span>
                <ChevronRight size={14} className="rotate-180" />
                <span className="text-gray-400">{course.category || 'عام'}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                {course.title}
              </h1>
              
              <p className="text-gray-400 text-lg md:text-xl font-bold max-w-3xl leading-relaxed">
                {course.description?.substring(0, 200)}...
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-orange-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <span className="font-black text-orange-400">4.9</span>
                  <span className="text-gray-400 font-bold">(1.2k تقييم)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-400" />
                  <span className="font-bold">2,689 طالب ملتحق</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">المدرب:</span>
                  <span className="font-black text-blue-400 underline cursor-pointer">{course.instructor || 'م. أحمد السلمي'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-400">آخر تحديث:</span>
                  <span className="font-bold">أكتوبر 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-gray-400" />
                  <span className="font-bold">العربية</span>
                </div>
              </div>
            </div>

            {/* Sidebar Floating Card Placeholder (Visible on LG) */}
            <div className="hidden lg:block w-[400px] shrink-0" />
          </div>
        </div>
      </div>

      {/* 2. Main Content & Floating Card */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-24">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Main Column */}
          <div className="flex-1 space-y-12 w-full">
            
            {/* What you'll learn */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/20">
              <h2 className="text-2xl font-black text-gray-900 mb-8">ماذا ستتعلم؟</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(course as any).what_to_learn?.split('\n').filter(Boolean).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-blue-50 text-blue-600 rounded-full p-1 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-gray-600 font-bold leading-relaxed">{item}</span>
                  </div>
                )) || (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-50 text-blue-600 rounded-full p-1 shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-gray-600 font-bold leading-relaxed">بناء أنظمة التصميم (Design Systems) القابلة للتوسع</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-50 text-blue-600 rounded-full p-1 shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-gray-600 font-bold leading-relaxed">فهم سيكولوجية المستخدم وتطبيق مبادئ UX</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Course Content (Syllabus) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">محتوى الدورة</h2>
                <span className="text-sm font-bold text-gray-500">
                  {course.units?.length || 0} وحدة • {course.units?.reduce((acc, u) => acc + (u.lessons?.length || 0), 0) || 0} درس • 12 ساعة و 30 دقيقة
                </span>
              </div>

              <div className="space-y-4">
                {course.units?.map((unit, index) => (
                  <div key={unit.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <button 
                      onClick={() => toggleUnit(unit.id)}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-all text-right"
                    >
                      <div className="flex items-center gap-4">
                        <div className={twMerge(
                          "transition-transform duration-300",
                          expandedUnits.includes(unit.id) ? "rotate-0" : "rotate-180"
                        )}>
                          <ChevronUp size={20} className="text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-gray-900">{unit.title}</h3>
                          <p className="text-xs text-gray-400 font-bold mt-1">
                            {unit.lessons?.length || 0} دروس • 45 دقيقة
                          </p>
                        </div>
                      </div>
                    </button>
                    
                    {expandedUnits.includes(unit.id) && (
                      <div className="border-t border-gray-50 bg-gray-50/30 p-2 space-y-1">
                        {unit.lessons?.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-xl transition-all group cursor-pointer">
                            <div className="flex items-center gap-4">
                              {lesson.type === 'video' ? <Play size={18} className="text-blue-600" /> : <FileText size={18} className="text-gray-400" />}
                              <span className="font-bold text-gray-700 text-sm">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-gray-400">10:00</span>
                              {lesson.type === 'video' && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-black">معاينة</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* About Course */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900">عن هذه الدورة</h2>
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm">
                <div className="prose prose-blue max-w-none text-gray-600 font-bold leading-loose">
                  {course.description || "لا يوجد وصف لهذه الدورة حالياً."}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Purchase Card */}
          <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-28 z-20">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 ring-1 ring-black/5">
              {/* Course Preview Image/Video */}
              <div className="relative aspect-video group cursor-pointer">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                    <Play size={64} className="text-white opacity-80 group-hover:scale-110 transition-transform" fill="currentColor" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                      <Play size={24} className="text-white" fill="currentColor" />
                   </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                   <span className="text-white font-black text-sm drop-shadow-md">معاينة هذه الدورة</span>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-8 space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-gray-900 tracking-tight">{course.final_price || course.price} ر.س</span>
                    {course.final_price && Number(course.final_price) < Number(course.price) && (
                      <span className="text-xl text-gray-400 line-through font-bold">{course.price} ر.س</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-red-500 animate-pulse">
                     <Clock size={16} />
                     <span className="text-sm font-black">خصم 50% ينتهي خلال 14 ساعة!</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95">
                    التحق بالدورة الآن
                  </button>
                  <button className="w-full py-5 bg-white border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 text-gray-900 rounded-2xl font-black text-lg transition-all active:scale-95">
                    إضافة إلى السلة
                  </button>
                </div>

                <p className="text-center text-[13px] text-gray-400 font-bold">ضمان استرداد الأموال خلال 30 يوماً</p>

                {/* Features */}
                <div className="space-y-5 pt-4 border-t border-gray-50">
                   <h4 className="font-black text-gray-900 text-sm">تتضمن هذه الدورة:</h4>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Video size={18} className="text-blue-500" />
                        <span className="text-sm font-bold">12 ساعة من الفيديوهات حسب الطلب</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <DownloadCloud size={18} className="text-blue-500" />
                        <span className="text-sm font-bold">25 ملفاً ومورداً قابلاً للتحميل</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Monitor size={18} className="text-blue-500" />
                        <span className="text-sm font-bold">وصول كامل مدى الحياة</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Award size={18} className="text-blue-500" />
                        <span className="text-sm font-bold">شهادة إتمام معتمدة</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Headset size={18} className="text-blue-500" />
                        <span className="text-sm font-bold">دعم فني مباشر من المدرب</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-center gap-6 pt-4">
                   <button className="text-blue-600 font-black text-sm hover:underline">مشاركة الدورة</button>
                   <button className="text-blue-600 font-black text-sm hover:underline">إهداء هذه الدورة</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


