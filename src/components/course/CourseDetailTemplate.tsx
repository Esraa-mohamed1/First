'use client';

import React, { useState, useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowRight, Share2, Clipboard, Edit3, CheckCircle2, Clock, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Lesson {
  id: number;
  title: string;
  type?: string;
  duration?: string;
  is_preview?: boolean | number;
  isPreview?: boolean;
}

interface Unit {
  id: number;
  title: string;
  isLocked?: boolean;
  lessons?: Lesson[];
}

interface CourseDetailTemplateProps {
  course: {
    id: any;
    title: string;
    description: string;
    instructor?: any;
    instructor_name?: string;
    category?: any;
    price: string | number;
    final_price: string | number;
    currency?: string;
    price_type?: string;
    image?: string;
    units?: Unit[];
    learning_points?: string[];
    info_sections?: any[];
    is_subscribed?: boolean;
    subscription_status?: string;
    rejection_reason?: string;
    payment_methods?: any[];
    slug?: string;
    updated_at?: string;
    created_at?: string;
  };
  isSubscribed?: boolean;
  isOwnerReview?: boolean;
  isStudentDashboard?: boolean;
  onSubscribe?: () => void;
  onLearnClick?: () => void;
  hideHeaderFooter?: boolean;
}

export default function CourseDetailTemplate({
  course,
  isSubscribed = false,
  isOwnerReview = false,
  isStudentDashboard = false,
  onSubscribe,
  onLearnClick,
  hideHeaderFooter = false,
}: CourseDetailTemplateProps) {
  const router = useRouter();
  const { openModal } = useModal();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFloatingWidget, setShowFloatingWidget] = useState(true);
  const [isRetrying, setIsRetrying] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('retry') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user_info');
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (course.units && course.units.length > 0) {
      setExpandedUnits([course.units[0].id]);
    }
  }, [course.units]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  // Determine actual subscribed state
  const isEnrolled =
    isSubscribed ||
    course.is_subscribed ||
    course.subscription_status === 'active' ||
    course.subscription_status === 'accepted';

  // Format date
  const getFormattedDate = () => {
    const rawDate = course.updated_at || course.created_at;
    if (rawDate) {
      const date = new Date(rawDate);
      return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });
    }
    return 'أكتوبر 2023';
  };

  // Instructor Info
  const instructorName =
    course.instructor_name ||
    (typeof course.instructor === 'object' && course.instructor !== null
      ? course.instructor.name
      : String(course.instructor || 'أحمد محمد'));

  // Course Image
  const courseImage =
    course.image ||
    'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200';

  // Learning Points (Bento Grid)
  const defaultLearningPoints = [
    'بناء أنظمة التصميم (Design Systems) القابلة للتوسع بشكل احترافي.',
    'فهم سيكولوجية المستخدم وتطبيق مبادئ UX في قراراتك التصميمية.',
    'إتقان التصميم المتجاوب للهواتف والويب باستخدام أحدث أدوات Figma.',
    'تحويل التصاميم إلى بروتوتايب تفاعلي يحاكي الواقع تماماً.',
  ];

  const learningPoints =
    course.learning_points && course.learning_points.length > 0
      ? course.learning_points
      : defaultLearningPoints;

  // Total course details
  const totalUnitsCount = course.units?.length || 0;
  const totalLessonsCount =
    course.units?.reduce((sum, u) => sum + (u.lessons?.length || 0), 0) || 0;

  // Handle Share Course Action
  const handleShareCourse = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/${course.slug || course.id}`;
      if (navigator.share) {
        navigator
          .share({
            title: course.title,
            text: course.description?.replace(/<[^>]*>/g, '') || '',
            url: shareUrl,
          })
          .catch((err) => console.log('Error sharing:', err));
      } else {
        setShowShareModal(true);
      }
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/${course.slug || course.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('تم نسخ رابط الدورة بنجاح!');
      setShowShareModal(false);
    }
  };

  return (
    <div className="w-full text-on-surface antialiased overflow-x-hidden font-['Tajawal','sans-serif'] bg-[#f8f9fa] min-h-screen flex flex-col justify-between" dir="rtl">
      {/* Dynamic Head Link Injection */}
      <link
        href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Manrope:wght@400;600;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Top Owner Review Banner */}
      {isOwnerReview && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 text-center font-bold text-sm flex flex-wrap gap-4 items-center justify-center shadow-md">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">visibility</span>
            أنت تستعرض صفحة الدورة كمالك للأكاديمية (وضع المراجعة)
          </span>
          <button
            onClick={() => router.push(`/academic/courses/${course.id}`)}
            className="bg-white text-blue-700 px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all flex items-center gap-1 shadow"
          >
            <Edit3 size={12} />
            تعديل محتوى الدورة
          </button>
        </div>
      )}

      {/* Header section (only shown when not embedded in dashboard) */}
      {!hideHeaderFooter && (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl font-['Tajawal','Manrope'] font-bold leading-relaxed docked full-width top-0 z-40 bg-slate-50 border-none shadow-[0_12px_40px_rgba(14,118,168,0.06)] flex flex-row-reverse justify-between items-center px-6 h-16 w-full sticky">
          <div className="flex flex-row-reverse items-center gap-6">
            <span
              onClick={() => router.push(currentUser ? '/student' : '/')}
              className="text-2xl font-black text-cyan-800 cursor-pointer"
            >
              دَرّب
            </span>
            <nav className="hidden md:flex flex-row-reverse items-center gap-8">
              <span
                onClick={() => router.push(currentUser ? '/student' : '/')}
                className="text-slate-500 font-medium hover:bg-cyan-50/50 transition-colors px-3 py-1 rounded-lg cursor-pointer"
              >
                الرئيسية
              </span>
              <span
                onClick={() => router.push(currentUser ? '/student/courses' : '/')}
                className="text-cyan-700 font-bold border-b-2 border-cyan-700 px-3 py-1 cursor-pointer"
              >
                الدورات
              </span>
              <span className="text-slate-500 font-medium hover:bg-cyan-50/50 transition-colors px-3 py-1 rounded-lg cursor-pointer">
                عن المنصة
              </span>
            </nav>
          </div>
          <div className="flex flex-row-reverse items-center gap-4">
            <div className="flex items-center bg-[#f3f4f5] px-4 py-2 rounded-full border-none">
              <span className="material-symbols-outlined text-[#707880] ml-2">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-48 text-right outline-none"
                placeholder="ابحث عن دورة..."
                type="text"
              />
            </div>
            <button className="material-symbols-outlined text-[#4c616c] hover:text-[#005c86] transition-colors">
              notifications
            </button>
            <button className="material-symbols-outlined text-[#4c616c] hover:text-[#005c86] transition-colors">
              shopping_cart
            </button>
            {currentUser ? (
              <img
                alt="صورة الطالب الشخصية"
                className="w-10 h-10 rounded-full border-2 border-[#c9e6ff] object-cover cursor-pointer"
                src={currentUser.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1V60WHXi5oTXHf8sc0_5WlwL4ZoXxW0Al68gIGZE7Xr4IPhVxx57YWpdBoNS5aG4LLBmiVCcEDFTdJM8HfuWhh_t39Hb_fp27k55c_qYO-wAdJilnsmGPK5oEG0hBGjR6u1eYZuLOaaUuDa1fSkztcfJAjE_me6t0QXjM0UAS8AQ6L2z_IhH_-YOum27PRyG7MjE4Y3oPeawTvdDrPZSlxF2HXC5JJPpaz2k2JqRc59zVZuf6W8ytOwC04pR3vrMr8ZGcJXq1emA'}
                onClick={() => router.push('/student/profile')}
              />
            ) : (
              <button
                onClick={() => openModal('login')}
                className="bg-[#005c86] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-[#0e76a8] transition-colors"
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main course detail section */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative w-full flex-grow">
        {/* Right Column: Course Details */}
        <div className="lg:col-span-8 space-y-12">
          {/* Hero Section */}
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffdcbc] text-[#2c1700] text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              أعلى تقييماً
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 py-4">
              <div className="flex items-center gap-3">
                <img
                  alt="Instructor Avatar"
                  className="w-12 h-12 rounded-xl object-cover shadow-sm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyAVXG3CvzqjBr5txbKMW-xLHX0Zz9kujry2170bKLdjCYESyh9tV-dQYbLOuxtUSppVwk1AbIlJg2Dj8LLfKc1o92BtwC5NqHKhMA_OHMnReMFdGqBK1L_dKKMKVE_6YgNjRNqrRAsUGB3H1DD976LzOgorbjrrH7zsD1UFUcOiZ2AB5Brx40j7Q7nzrbZwO1wBfkfCRf4_bOpbFWhIT_je3BNrNvX3zYwMPT_CNmadp6HkQnFvAN8cDXcDr4Wf758IHrU_VDs1g"
                />
                <div>
                  <p className="text-[#4c616c] text-xs">المدرب</p>
                  <p className="font-bold text-on-surface">{instructorName}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-[#bfc7d0]/30"></div>
              <div>
                <p className="text-[#4c616c] text-xs">آخر تحديث</p>
                <p className="font-bold text-on-surface">{getFormattedDate()}</p>
              </div>
              <div className="h-8 w-px bg-[#bfc7d0]/30"></div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#7e4b00]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-bold text-on-surface">4.9</span>
                <span className="text-[#4c616c] text-sm">(1,240 تقييم)</span>
              </div>
            </div>

            <div className="aspect-video w-full rounded-3xl overflow-hidden relative group cursor-pointer shadow-2xl">
              <img
                alt="Course Preview"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={courseImage}
              />
              <div className="absolute inset-0 bg-[#005c86]/20 backdrop-blur-[2px] flex items-center justify-center group-hover:bg-[#005c86]/10 transition-colors">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-[#005c86] text-4xl mr-1"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-on-surface border-r-4 border-[#005c86] pr-4">
              عن هذه الدورة
            </h2>
            <div
              className="text-[#4c616c] leading-relaxed text-lg text-justify ql-editor"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          </section>

          {/* Learning Objectives Bento Grid */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-on-surface border-r-4 border-[#005c86] pr-4">
              ماذا ستتعلم؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white border border-[#e7e8e9] shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c9e6ff] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#005c86]">architecture</span>
                </div>
                <p className="text-on-surface font-medium leading-relaxed">
                  {learningPoints[0] || 'بناء أنظمة التصميم (Design Systems) القابلة للتوسع بشكل احترافي.'}
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-[#e7e8e9] shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#cfe6f2] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#4c616c]">psychology</span>
                </div>
                <p className="text-on-surface font-medium leading-relaxed">
                  {learningPoints[1] || 'فهم سيكولوجية المستخدم وتطبيق مبادئ UX في قراراتك التصميمية.'}
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-[#e7e8e9] shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#ffdcbc] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#7e4b00]">devices</span>
                </div>
                <p className="text-on-surface font-medium leading-relaxed">
                  {learningPoints[2] || 'إتقان التصميم المتجاوب للهواتف والويب باستخدام أحدث أدوات Figma.'}
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-[#e7e8e9] shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e1e3e4] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#40484f]">auto_awesome</span>
                </div>
                <p className="text-on-surface font-medium leading-relaxed">
                  {learningPoints[3] || 'تحويل التصاميم إلى بروتوتايب تفاعلي يحاكي الواقع تماماً.'}
                </p>
              </div>
            </div>
          </section>

          {/* Course Content Preview Accordion */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-on-surface border-r-4 border-[#005c86] pr-4">
                محتوى الدورة
              </h2>
              <span className="text-[#4c616c] text-sm font-medium">
                {totalUnitsCount} قسم • {totalLessonsCount} درس
              </span>
            </div>
            <div className="space-y-3">
              {course.units && course.units.length > 0 ? (
                course.units.map((unit, index) => {
                  const isUnitExpanded = expandedUnits.includes(unit.id);
                  const isLocked = !isEnrolled && !isOwnerReview && unit.isLocked;

                  return (
                    <div
                      key={unit.id}
                      className="rounded-2xl border border-[#bfc7d0]/30 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleUnit(unit.id)}
                        className="w-full flex items-center justify-between p-5 bg-[#f3f4f5] outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#005c86]">
                            {isUnitExpanded ? 'expand_more' : 'chevron_left'}
                          </span>
                          <span className="font-bold text-on-surface text-right">
                            {unit.title}
                          </span>
                        </div>
                        <span className="text-xs text-[#4c616c]">
                          {unit.lessons?.length || 0} دروس
                        </span>
                      </button>

                      {isUnitExpanded && (
                        <div className="bg-white p-2 divide-y divide-[#edeeef]">
                          {unit.lessons && unit.lessons.length > 0 ? (
                            unit.lessons.map((lesson) => {
                              const isPreview = lesson.isPreview || lesson.is_preview;
                              const canWatch = isEnrolled || isOwnerReview || isPreview;

                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => {
                                    if (canWatch && onLearnClick) {
                                      onLearnClick();
                                    }
                                  }}
                                  className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                                    canWatch
                                      ? 'hover:bg-[#f3f4f5] cursor-pointer'
                                      : 'opacity-70 cursor-not-allowed'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`material-symbols-outlined ${
                                        canWatch ? 'text-[#005c86]' : 'text-slate-400'
                                      }`}
                                      style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                      {canWatch ? 'play_circle' : 'lock'}
                                    </span>
                                    <span className="text-on-surface text-right text-sm font-bold">
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    {isPreview && !isEnrolled && (
                                      <span className="text-xs bg-[#cfe6f2] text-[#004c6e] px-2 py-0.5 rounded-full font-bold">
                                        معاينة مجانية
                                      </span>
                                    )}
                                    <span className="text-sm text-[#4c616c]">
                                      {lesson.duration || '05:00'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-5 text-center text-xs text-slate-400 font-bold">
                              لا توجد دروس في هذه الوحدة
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-[#bfc7d0]/30 p-8 text-center text-slate-400 font-bold">
                  لا توجد وحدات أو دروس حالياً
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Left Column: Pricing & CTA Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,92,134,0.12)] border border-white relative overflow-hidden">
              {/* Glassy Accent */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#c9e6ff]/20 blur-3xl rounded-full"></div>
              <div id="payment-section" className="relative z-10 space-y-6">
                {isEnrolled ? (
                  <div className="space-y-4 text-center">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">أنت مشترك بالفعل</h3>
                    <p className="text-slate-500 font-bold text-xs leading-relaxed">استمتع برحلتك التعليمية وابدأ الآن في مشاهدة الدروس.</p>
                    <button 
                      onClick={onLearnClick}
                      className="w-full py-3 bg-gradient-to-br from-[#005c86] to-[#0e76a8] text-white rounded-xl font-bold text-base shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/35 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined font-black text-lg">play_circle</span>
                      <span>ابدأ التعلم الآن</span>
                    </button>
                  </div>
                ) : (course.subscription_status === 'pending' || course.subscription_status === 'penidng') ? (
                  <div className="space-y-4 text-center">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <Clock size={24} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">طلب الاشتراك قيد المراجعة</h3>
                    <p className="text-slate-500 font-bold text-xs leading-relaxed">لقد قمت بتقديم طلب اشتراك لهذه الدورة. طلبك قيد المراجعة حالياً من قبل الإدارة وسنقوم بتفعيله قريباً.</p>
                    <button 
                      disabled
                      className="w-full py-3 bg-purple-100 text-purple-500 rounded-xl font-bold text-base cursor-not-allowed"
                    >
                      قيد الانتظار (المراجعة)
                    </button>
                  </div>
                ) : (course.subscription_status === 'rejected' || course.subscription_status === 'cancelled') && !isRetrying ? (
                  <div className="space-y-4 text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <Lock size={24} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 text-red-600">طلب الاشتراك مرفوض</h3>
                    <p className="text-slate-500 font-bold text-xs leading-relaxed">
                      {course.rejection_reason || 'تم رفض طلب اشتراكك في هذه الدورة من قبل الإدارة.'}
                    </p>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          if (course.rejection_reason) {
                            MySwal.fire({
                              title: 'سبب الرفض',
                              text: course.rejection_reason,
                              icon: 'info',
                              confirmButtonText: 'حسناً',
                              confirmButtonColor: '#006692'
                            });
                          } else {
                            toast.error('تم رفض طلب الاشتراك.');
                          }
                        }}
                        className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm border border-red-100 transition-all flex items-center justify-center gap-2"
                      >
                        تفاصيل الرفض
                      </button>
                      <button 
                        onClick={() => setIsRetrying(true)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 transition-all"
                      >
                        إعادة محاولة الاشتراك
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-[#4c616c] font-medium mb-1">استثمار الدورة</p>
                      {course.price_type === 'free' || Number(course.final_price || course.price || 0) === 0 ? (
                        <div className="flex items-end gap-3">
                          <span className="text-4xl font-black text-green-600 font-headline">مجانية</span>
                        </div>
                      ) : (
                        <div className="flex items-end gap-3">
                          <span className="text-5xl font-black text-on-surface font-headline">
                            {course.final_price || course.price}
                          </span>
                          <span className="text-xl font-bold text-[#005c86] pb-1">
                            {course.currency || 'SAR'}
                          </span>
                          {Number(course.price) > Number(course.final_price) && (
                            <span className="text-lg text-outline line-through pb-1 px-2">
                              {course.price} {course.currency || 'SAR'}
                            </span>
                          )}
                        </div>
                      )}
                      {course.price_type !== 'free' && Number(course.price) > Number(course.final_price) && (
                        <p className="text-[#7e4b00] font-bold text-sm mt-3 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">alarm</span>
                          خصم 50% ينتهي قريباً!
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      {isOwnerReview ? (
                        <button
                          onClick={() => router.push(`/academic/courses/${course.id}`)}
                          className="w-full bg-gradient-to-br from-[#005c86] to-[#0e76a8] text-white py-3.5 rounded-xl font-bold text-base shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/35 transition-all active:scale-[0.98]"
                        >
                          تعديل الدورة ومحتواها
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={onSubscribe}
                            className="w-full bg-gradient-to-br from-[#005c86] to-[#0e76a8] text-white py-3.5 rounded-xl font-bold text-base shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/35 transition-all active:scale-[0.98]"
                          >
                            {(course.price_type === 'free' || Number(course.final_price || course.price || 0) === 0) ? 'التحاق مجاني بالدورة' : 'اشترك الآن'}
                          </button>
                          <button
                            onClick={() => toast.success('تمت إضافة الدورة إلى سلة المشتريات')}
                            className="w-full bg-[#f3f4f5] text-[#40484f] py-3 rounded-xl font-bold text-base hover:bg-[#e7e8e9] transition-colors"
                          >
                            إضافة للسلة
                          </button>
                        </>
                      )}
                      <button
                        onClick={handleShareCourse}
                        className="w-full flex items-center justify-center gap-2 border border-slate-200 text-[#4c616c] hover:bg-slate-50 py-3 rounded-xl font-bold text-base transition-all"
                      >
                        <Share2 size={16} />
                        <span>مشاركة الدورة</span>
                      </button>
                    </div>
                  </>
                )}

                <div className="space-y-4 pt-6 border-t border-[#edeeef]">
                  <p className="font-bold text-on-surface">تتضمن الدورة:</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-[#4c616c] text-sm">
                      <span className="material-symbols-outlined text-[#005c86] text-[20px]">
                        indeterminate_question_box
                      </span>
                      وصول مدى الحياة للمحتوى
                    </li>
                    <li className="flex items-center gap-3 text-[#4c616c] text-sm">
                      <span className="material-symbols-outlined text-[#005c86] text-[20px]">
                        workspace_premium
                      </span>
                      شهادة إتمام معتمدة
                    </li>
                    <li className="flex items-center gap-3 text-[#4c616c] text-sm">
                      <span className="material-symbols-outlined text-[#005c86] text-[20px]">
                        download_for_offline
                      </span>
                      موارد وملفات قابلة للتحميل
                    </li>
                    <li className="flex items-center gap-3 text-[#4c616c] text-sm">
                      <span className="material-symbols-outlined text-[#005c86] text-[20px]">
                        support_agent
                      </span>
                      دعم فني مباشر من المدرب
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <span className="text-[10px] text-[#707880] font-bold tracking-widest uppercase">
                    وسائل دفع آمنة
                  </span>
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-[#e7e8e9] rounded-sm"></div>
                    <div className="w-8 h-5 bg-[#e7e8e9] rounded-sm"></div>
                    <div className="w-8 h-5 bg-[#e7e8e9] rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-[#e7e8e9]/50 p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[#7e4b00]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">ضمان استرداد الأموال</p>
                <p className="text-[#4c616c] text-xs">خلال 30 يوماً إذا لم تناسبك الدورة</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (only shown when not embedded in dashboard) */}
      {!hideHeaderFooter && (
        <footer className="mt-20 border-t border-[#edeeef] py-12 px-6 bg-white w-full">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center md:text-right">
              <span className="text-2xl font-black text-cyan-800">دَرّب</span>
              <p className="text-[#4c616c] max-w-sm text-sm">
                منصة التعلم الذكي الرائدة في العالم العربي لتمكين الكوادر الوطنية في مجالات التقنية والتصميم.
              </p>
            </div>
            <div className="flex gap-8">
              <a className="text-[#4c616c] hover:text-[#005c86] transition-colors text-sm font-bold" href="#">
                سياسة الخصوصية
              </a>
              <a className="text-[#4c616c] hover:text-[#005c86] transition-colors text-sm font-bold" href="#">
                الشروط والأحكام
              </a>
              <a className="text-[#4c616c] hover:text-[#005c86] transition-colors text-sm font-bold" href="#">
                تواصل معنا
              </a>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#e7e8e9] flex items-center justify-center text-[#4c616c] hover:bg-[#c9e6ff] hover:text-[#005c86] cursor-pointer transition-all">
                <span className="material-symbols-outlined text-xl">alternate_email</span>
              </div>
              <div
                onClick={handleShareCourse}
                className="w-10 h-10 rounded-full bg-[#e7e8e9] flex items-center justify-center text-[#4c616c] hover:bg-[#c9e6ff] hover:text-[#005c86] cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-xl">share</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-12 text-[#707880] text-xs font-bold">
            © 2026 دَرّب. جميع الحقوق محفوظة.
          </div>
        </footer>
      )}

      {/* Share Modal Dialog (Fallback for Desktop browsers without Web Share support) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 relative" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-slate-900 mb-4 text-right">مشاركة الدورة</h3>
            <p className="text-slate-500 text-sm mb-6 text-right">انسخ الرابط لمشاركته على فيسبوك أو إنستغرام أو أي منصة تواصل أخرى:</p>
            
            <div className="flex items-center gap-2 bg-[#f3f4f5] p-3 rounded-2xl border border-slate-100 mb-6">
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-white text-blue-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center"
              >
                <Clipboard size={18} />
              </button>
              <input 
                type="text" 
                readOnly 
                value={typeof window !== 'undefined' ? `${window.location.origin}/${course.slug || course.id}` : ''}
                className="bg-transparent border-none focus:ring-0 text-xs text-left w-full outline-none font-mono text-slate-600 select-all"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowShareModal(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
