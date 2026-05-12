'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Play, FileText, CheckCircle2, Clock, Globe, Award,
  ChevronRight, Star, Users, Calendar,
  ChevronDown, ChevronUp, Download, ShieldCheck,
  Video, Monitor, DownloadCloud, Headset, Lock,
  Layout, MousePointer2, Smartphone, PenTool
} from 'lucide-react';
import { getStudentCourse, subscribeToCourse } from '@/services/student-courses';
import { Course, Unit } from '@/types/api';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const STATIC_COURSE_FALLBACK = {
  title: "إتقان تطوير واجهات المستخدم بالتصميم الذكي",
  description: "دورة شاملة لتعلم مبادئ التصميم، من البداية وحتى الاحتراف. ستتعلم كيفية بناء واجهات متجاوبة، أنظمة التصميم، وسيكولوجية المستخدم.",
  instructor: "م. أحمد السلمي",
  category: "تصميم",
  price: "599",
  final_price: "299",
  image: "https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200",
  what_to_learn: "",
  units: [
    {
      id: 1,
      title: "القسم الأول: مقدمة في عالم التصميم الرقمي",
      lessons: [
        { id: 101, title: "أهلاً بك في رحلة الإبداع", type: "video", duration: "05:20", isPreview: true },
        { id: 102, title: "تثبيت الأدوات وتجهيز بيئة العمل", type: "video", duration: "12:45" }
      ]
    },
    { id: 2, title: "القسم الثاني: أسس تجربة المستخدم (UX)", isLocked: true, lessons: [] },
    { id: 3, title: "القسم الثالث: نظرية الألوان والخطوط", isLocked: true, lessons: [] }
  ]
};

export default function CourseStudentViewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getStudentCourse(slug);
        
        // Use real API data with fallback to static if missing
        let learningPoints: string[] = [];
        
        // Try from infos first (new structure)
        if (data.infos && Array.isArray(data.infos)) {
          learningPoints = data.infos
            .filter((info: any) => info.key === 'what_you_will_learn' || info.key === 'what_you_learn')
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            .map((info: any) => info.value);
        }

        // Fallback to what_you_will_learn string if infos didn't have any
        if (learningPoints.length === 0) {
          try {
            if (data.what_you_will_learn) {
              const parsed = JSON.parse(data.what_you_will_learn);
              learningPoints = Array.isArray(parsed) ? parsed : [data.what_you_will_learn];
            } else if (data.what_you_learn) {
              const parsed = JSON.parse(data.what_you_learn);
              learningPoints = Array.isArray(parsed) ? parsed : [data.what_you_learn];
            }
          } catch (e) {
            console.error('Failed to parse what_you_will_learn', e);
            if (data.what_you_will_learn) learningPoints = [data.what_you_will_learn];
            else if (data.what_you_learn) learningPoints = [data.what_you_learn];
          }
        }

        const mergedCourse = {
          id: data.id,
          title: data.title,
          description: data.description,
          instructor: data.instructor?.name || 'Unknown Instructor',
          category: (data as any).category?.name || 'General',
          price: data.price,
          final_price: data.final_price,
          image: data.image,
          units: data.units || (data as any).chapters || [],
          learning_points: learningPoints,
          is_subscribed: (data as any).is_enrolled || false,
        };

        setCourse(mergedCourse);
        if (mergedCourse.units && mergedCourse.units.length > 0) {
          setExpandedUnits([mergedCourse.units[0].id]);
        }
      } catch (error) {
        console.warn('Course not found, showing mock data for preview:', error);
        setCourse({ ...STATIC_COURSE_FALLBACK, slug: slug });
        setExpandedUnits([1]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const handleSubscribe = async () => {
    if (!course) return;
    
    setIsSubscribing(true);
    try {
      const price = Number(course.final_price || course.price || 0);
      const response = await subscribeToCourse(course.id, price);
      
      // Check all possible paths for the payment URL based on the response format
      const paymentUrl = response.data?.payment_url || response.payment_url || response.paymentLink || response.data?.paymentLink || response.link;
      
      if (paymentUrl) {
        await MySwal.fire({
          title: 'سيتم توجيهك الآن',
          text: 'جاري تحويلك إلى بوابة الدفع لإتمام عملية الاشتراك.',
          icon: 'info',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true
        });
        
        window.location.href = paymentUrl;
      } else {
        throw new Error('لم يتم استلام رابط الدفع');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      const errorMessage = error.message || 'حدث خطأ أثناء محاولة الاشتراك. يرجى المحاولة مرة أخرى.';
      
      MySwal.fire({
        title: 'خطأ في الاشتراك',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#006692'
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-900">جاري التحميل...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-900">لم يتم العثور على الدورة</div>;

  return (
    <div className="bg-slate-50/50 pb-20 font-sans" dir="rtl">

      <div className="max-w-[1440px] mx-auto pt-6 pb-16">
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-start">

          {/* 1. RIGHT COLUMN: Main Course Content */}
          <div className="flex-1 space-y-20 w-full">

            {/* Professional Header Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">الأكثر مبيعاً</div>
              </div>

              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 leading-[1.2] tracking-tight break-words">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 lg:gap-8 text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 relative overflow-hidden border-2 border-white shadow-md">
                    <img src="https://i.pravatar.cc/150?u=احمد" alt="Instructor" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 font-black text-[10px] uppercase mb-1">المدرب المعتمد</p>
                    <p className="font-black text-slate-900 text-lg">{course.instructor}</p>
                  </div>
                </div>

                <div className="hidden md:block w-[1px] h-10 bg-slate-200" />

                <div className="text-right">
                  <p className="text-slate-400 font-black text-[10px] uppercase mb-1">تاريخ النشر</p>
                  <p className="font-black text-slate-900 text-lg">25 أكتوبر 2023</p>
                </div>

                <div className="hidden md:block w-[1px] h-10 bg-slate-200" />

                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex text-orange-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <span className="font-black text-slate-900 text-lg">4.9</span>
                  <span className="text-slate-400 font-bold">(1,240 تقييم)</span>
                </div>
              </div>
            </div>

            {(() => {
              const videoUrl = course.units?.[0]?.lessons?.[0]?.video_url;
              return (
                <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-[0_30px_70px_rgba(15,23,42,0.15)] border-[6px] border-white transition-all hover:scale-[1.01] bg-black">
                  {videoUrl ? (
                    <video 
                      src={videoUrl} 
                      controls 
                      className="w-full h-full object-contain"
                      poster={course.image}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4 bg-slate-900">
                      <Video size={48} className="text-slate-500" />
                      <span className="font-bold text-lg">لا يوجد فيديو متاح حالياً</span>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-slate-900 border-r-[6px] border-blue-600 pr-4 leading-none">ماذا ستتعلم؟</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(course.learning_points?.length > 0 ? course.learning_points : [
                  "بناء أنظمة التصميم (Design Systems) القابلة للتوسع بشكل احترافي.",
                  "فهم سيكولوجية المستخدم وتطبيق مبادئ UX في قراراتك التصميمية.",
                  "إتقان التصميم المتجاوب للهواتف والويب باستخدام أحدث أدوات Figma.",
                  "تحويل التصاميم إلى بروتوتايب تفاعلي يحاكي الواقع تماماً."
                ]).map((point: string, i: number) => {
                  const icons = [Layout, MousePointer2, Smartphone, PenTool, Globe, Award, ShieldCheck, Video];
                  const colors = ['blue', 'blue', 'orange', 'slate', 'green', 'purple', 'red', 'indigo'];
                  const Icon = icons[i % icons.length];
                  const color = colors[i % colors.length];

                  return (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between gap-6 group hover:border-blue-600 transition-all shadow-sm">
                      <div 
                        className="text-slate-700 font-bold leading-relaxed text-right flex-1 ql-editor !p-0"
                        dangerouslySetInnerHTML={{ __html: point }}
                      />
                      <div className={twMerge(
                        "w-12 h-12 rounded-full shrink-0 flex items-center justify-center",
                        color === 'blue' ? 'bg-blue-50 text-blue-600' :
                          color === 'orange' ? 'bg-orange-50 text-orange-600' : 
                          color === 'green' ? 'bg-green-50 text-green-600' :
                          color === 'purple' ? 'bg-purple-50 text-purple-600' :
                          color === 'red' ? 'bg-red-50 text-red-600' :
                          color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                          'bg-slate-100 text-slate-600'
                      )}>
                        <Icon size={24} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-slate-900 border-r-[6px] border-blue-600 pr-4 leading-none">محتوى الدورة</h2>
                <div className="text-slate-400 font-bold text-sm">
                  12 قسم • 84 درس • 15 ساعة إجمالية
                </div>
              </div>

              <div className="space-y-4">
                {course.units?.map((unit: any, index: number) => (
                  <div key={unit.id} className={twMerge(
                    "rounded-[1.5rem] border overflow-hidden transition-all duration-500",
                    unit.isLocked ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-100 shadow-sm"
                  )}>
                    <button
                      onClick={() => !unit.isLocked && toggleUnit(unit.id)}
                      className={twMerge(
                        "w-full p-6 flex items-center justify-between text-right transition-colors",
                        expandedUnits.includes(unit.id) ? "bg-slate-50" : "hover:bg-slate-50/50"
                      )}
                      disabled={unit.isLocked}
                    >
                      <div className="flex items-center gap-4">
                        <ChevronDown size={20} className={twMerge("text-slate-400 transition-transform duration-500", expandedUnits.includes(unit.id) ? "rotate-180" : "rotate-0")} />
                        <span className="text-slate-400 text-sm font-bold">
                          {index === 0 ? "4 دروس • 45 دقيقة" : index === 1 ? "8 دروس • 1 ساعة" : "10 دروس • 2 ساعة"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <h3 className={twMerge("text-lg font-black", unit.isLocked ? "text-slate-400" : "text-slate-900")}>{unit.title}</h3>
                        {unit.isLocked && <Lock size={18} className="text-slate-400" />}
                      </div>
                    </button>

                    {!unit.isLocked && expandedUnits.includes(unit.id) && (
                      <div className="border-t border-slate-50 bg-white">
                        {unit.lessons?.map((lesson: any) => (
                          <div key={lesson.id} className="flex items-center justify-between p-5 px-8 hover:bg-slate-50 transition-all group cursor-pointer border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-bold text-slate-400">{lesson.duration || '10:00'}</span>
                              {lesson.isPreview && (
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-black">معاينة مجانية</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-slate-800">{lesson.title}</span>
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                <Play size={14} fill="currentColor" className="mr-0.5" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* High Contrast About Course */}
            <div className="space-y-10">
              <div className="flex items-center gap-6">
                <h2 className="text-3xl font-black text-slate-900">عن هذه الدورة</h2>
                <div className="flex-1 h-[2px] bg-slate-100" />
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                <div className="text-slate-700 font-bold leading-[2] text-xl ql-editor" dangerouslySetInnerHTML={{ __html: course.description }} />
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[360px] shrink-0 sticky xl:top-8 z-20">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_15px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col relative overflow-hidden">
              {course.is_subscribed ? (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">أنت مشترك بالفعل</h3>
                    <p className="text-slate-500 font-bold text-sm">استمتع برحلتك التعليمية وابدأ الآن في مشاهدة الدروس.</p>
                  </div>
                  <button 
                    onClick={() => router.push(`/student/courses/${course.id}`)}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Play size={20} fill="currentColor" />
                    ابدأ التعلم الآن
                  </button>
                </div>
              ) : course.is_subscribed ? (
                <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <GraduationCap size={40} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-blue-950">أهلاً بك في رحلتك التعليمية!</h2>
                    <p className="text-slate-500 font-bold text-sm">استمتع برحلتك التعليمية وابدأ الآن في مشاهدة الدروس.</p>
                  </div>
                  <button 
                    onClick={() => router.push(`/student/courses/${course.id}`)}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Play size={20} fill="currentColor" />
                    ابدأ التعلم الآن
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-right mb-2">
                    <span className="text-slate-400 font-bold text-base">استثمار الدورة</span>
                  </div>

                  {/* Price Section - Right Aligned */}
                  <div className="flex flex-col items-start mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl font-black text-slate-900 leading-none">{course.final_price || course.price || 299}</span>
                      <span className="text-xl font-black text-[#006692] mt-3">ريال</span>
                      {course.final_price && course.price && course.final_price !== course.price && (
                        <span className="text-lg text-slate-300 line-through font-bold mt-3 ml-2">{course.price} ريال</span>
                      )}
                    </div>

                    {/* Offer Timer */}
                    <div className="flex items-center gap-2 text-[#A85E00] font-black text-sm mt-4">
                      <Clock size={16} />
                      <span>خصم 50% ينتهي خلال 14 ساعة!</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-8">
                    <button 
                      onClick={handleSubscribe}
                      disabled={isSubscribing}
                      className="w-full py-4 bg-[#006692] hover:bg-[#00557a] text-white rounded-[1.2rem] font-black text-lg shadow-lg shadow-[#006692]/10 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubscribing ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : 'اشترك الآن'}
                    </button>
                    <button className="w-full py-4 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-slate-700 rounded-[1.2rem] font-black text-lg transition-all active:scale-95">
                      إضافة للسلة
                    </button>
                  </div>

                  {/* Secure Payment Footer - Right Aligned */}
                  <div className="mt-8 pt-6 border-t border-slate-50 w-full flex items-center justify-start gap-3">
                    <span className="text-xs text-slate-400 font-bold">وسائل دفع آمنة</span>
                    <div className="flex gap-2">
                      <div className="h-6 w-10 bg-[#F3F4F6] rounded" />
                      <div className="h-6 w-10 bg-[#F3F4F6] rounded" />
                      <div className="h-6 w-10 bg-[#F3F4F6] rounded" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Guarantee Box */}
            <div className="mt-6 bg-[#F3F4F6] rounded-[2rem] p-6 flex items-center gap-4 border border-slate-100 shadow-sm">
              <div className="flex-1 text-right">
                <h4 className="font-black text-slate-900 text-base">ضمان استرداد الأموال</h4>
                <p className="text-[11px] text-slate-500 font-bold mt-1">خلال 30 يوماً إذا لم تناسبك الدورة</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#8B4513] shadow-sm shrink-0">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
