'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import SelectCourseTypeModal from '@/components/Academic/Modals/SelectCourseTypeModal';
import AddStudentModal from '@/components/Academic/Modals/AddStudentModal';

import { useAcademicDashboard } from './hooks/useAcademicDashboard';
import { StatsGrid } from './components/StatsGrid';
import { StudentsTable } from './components/StudentsTable';
import { CourseLibrary } from './components/CourseLibrary';
import { PremiumUsage } from './components/PremiumUsage';
import { DashboardChecklist } from './components/DashboardChecklist';
import { PromoCarousel } from './components/PromoCarousel';

const TOUR_STEPS = [
  {
    id: 'stats-grid',
    title: 'إحصائيات الأكاديمية السريعة 📈',
    description: 'تتبع ملخص أداء أكاديميتك في مكان واحد. هنا يمكنك مراقبة إجمالي الأرباح والمبيعات، وعدد الساعات المشاهدة والطلاب المنضمين، مع نسبة النمو الأسبوعي لمؤشرات الأداء.',
  },
  {
    id: 'students-table',
    title: 'إدارة شؤون الطلاب 🎓',
    description: 'تابع أحدث المتعلمين المنضمين لصفوفك، وتحقق من مدى تقدمهم الدراسي ومساراتهم التعليمية. كما يمكنك تسجيل طالب جديد مباشرة وبكبسة زر واحدة.',
  },
  {
    id: 'course-library',
    title: 'مكتبة الدورات والمسارات 📚',
    description: 'المقر الرئيسي لمحتواك الإبداعي. من هنا تنشئ وتدير مسارات التعليم التفاعلية أو ترفع دورة مسجلة جديدة، مع خيارات التحكم الشاملة بالأسعار والحالات.',
  },
  {
    id: 'premium-usage',
    title: 'استهلاك باقتك الحالية ⚡',
    description: 'توضح لك هذه المساحة حجم الاستهلاك الفعلي لموارد باقة داراب النشطة، بما في ذلك عدد الطلاب الكلي، عدد الكورسات، ومساحة التخزين السحابي لملفاتك وفيديوهاتك.',
  },
  {
    id: 'dashboard-checklist',
    title: 'خطوات تهيئة الأكاديمية 🛠️',
    description: 'قائمة مهام تفاعلية ترشدك لإنهاء بناء هويتك الرقمية كاملة؛ بدءاً من تصميم الصفحة الرئيسية بالأدوات الديناميكية، إلى إعداد بوابات الدفع وإطلاق أول كورساتك بنجاح.',
  }
];

export default function AcademicDashboardPage() {
  const {
    isSelectTypeModalOpen,
    setIsSelectTypeModalOpen,
    isAddStudentModalOpen,
    setIsAddStudentModalOpen,
    isPremiumExpanded,
    setIsPremiumExpanded,
    carouselIndex,
    setCarouselIndex,
    courses,
    stats,
    fetchData,
    enrichedStudents,
    carouselSlides,
    handleNextSlide,
    handlePrevSlide,
    totalStudentsLimit,
    usedStudents,
    remainingStudents,
    studentProgressPercent,
    totalCoursesLimit,
    usedCourses,
    remainingCourses,
    courseProgressPercent,
    storagePercent,
  } = useAcademicDashboard();

  const [tourStep, setTourStep] = useState<number | null>(null);
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties | null>(null);
  const [showTourInvite, setShowTourInvite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const completed = localStorage.getItem('darab_tour_completed');
    if (!completed) {
      const timer = setTimeout(() => setShowTourInvite(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateHighlight = () => {
    if (tourStep === null) return;
    const step = TOUR_STEPS[tourStep];
    const element = document.getElementById(step.id);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightStyle({
        position: 'fixed',
        top: `${rect.top - 8}px`,
        left: `${rect.left - 8}px`,
        width: `${rect.width + 16}px`,
        height: `${rect.height + 16}px`,
      });
    }
  };

  const triggerScrollAndHighlight = () => {
    if (tourStep === null) return;
    const step = TOUR_STEPS[tourStep];
    const element = document.getElementById(step.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Update immediately
      updateHighlight();
      // Track smooth scroll progress
      const intervals = [50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 800];
      intervals.forEach(delay => {
        setTimeout(updateHighlight, delay);
      });
    }
  };

  useEffect(() => {
    if (tourStep !== null) {
      triggerScrollAndHighlight();
      window.addEventListener('resize', updateHighlight);
      window.addEventListener('scroll', updateHighlight, true);
    } else {
      setHighlightStyle(null);
    }
    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight, true);
    };
  }, [tourStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (tourStep === null) return;
      if (e.key === 'ArrowLeft') {
        nextStep();
      } else if (e.key === 'ArrowRight') {
        prevStep();
      } else if (e.key === 'Escape') {
        setTourStep(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tourStep]);

  const startTour = () => {
    setShowTourInvite(false);
    setTourStep(0);
  };

  const endTour = () => {
    setTourStep(null);
    localStorage.setItem('darab_tour_completed', 'true');
  };

  const nextStep = () => {
    if (tourStep === null) return;
    if (tourStep < TOUR_STEPS.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (tourStep === null) return;
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700 text-right relative" dir="rtl">

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-right">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">لوحة التحكم</h2>
        <div className="flex justify-start gap-3">
          <button
            onClick={() => setTourStep(0)}
            className="flex items-center gap-2 bg-blue-50 border border-blue-100 hover:bg-blue-100/60 text-blue-600 px-4 py-2.5 rounded-xl font-black text-sm shadow-sm transition-colors"
          >
            <span>جولة تعليمية 🔍</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors">
            <ChevronDown size={25} className="text-gray-400" />
            <span>التاريخ</span>
          </button>
        </div>
      </div>

      {/* 1. Stats Grid (5 Cards) */}
      <div id="stats-grid" className="scroll-mt-24">
        <StatsGrid stats={stats} />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* RIGHT COLUMN (Main widgets) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6 lg:space-y-8 order-1">

          {/* A. Last Registered Students Card */}
          <div id="students-table" className="scroll-mt-24">
            <StudentsTable
              enrichedStudents={enrichedStudents}
              setIsAddStudentModalOpen={setIsAddStudentModalOpen}
            />
          </div>

          {/* B. Course Library Card */}
          <div id="course-library" className="scroll-mt-24">
            <CourseLibrary
              courses={courses}
              setIsSelectTypeModalOpen={setIsSelectTypeModalOpen}
            />
          </div>

          {/* C. Premium Package Usage Card */}
          <div id="premium-usage" className="scroll-mt-24">
            <PremiumUsage
              isPremiumExpanded={isPremiumExpanded}
              setIsPremiumExpanded={setIsPremiumExpanded}
              totalStudentsLimit={totalStudentsLimit}
              usedStudents={usedStudents}
              remainingStudents={remainingStudents}
              studentProgressPercent={studentProgressPercent}
              storagePercent={storagePercent}
              totalCoursesLimit={totalCoursesLimit}
              usedCourses={usedCourses}
              remainingCourses={remainingCourses}
              courseProgressPercent={courseProgressPercent}
            />
          </div>

        </div>

        {/* LEFT COLUMN (Sidebar widgets) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6 lg:space-y-8 order-2">
          <div id="dashboard-checklist" className="scroll-mt-24">
            <DashboardChecklist
              setIsSelectTypeModalOpen={setIsSelectTypeModalOpen}
            />
          </div>

          {/* F. Promotional Carousel Banner Card */}
          <PromoCarousel
            carouselIndex={carouselIndex}
            setCarouselIndex={setCarouselIndex}
            carouselSlides={carouselSlides}
            handleNextSlide={handleNextSlide}
            handlePrevSlide={handlePrevSlide}
          />

        </div>

      </div>

      {/* Modals Hookup */}
      <SelectCourseTypeModal
        isOpen={isSelectTypeModalOpen}
        onClose={() => setIsSelectTypeModalOpen(false)}
      />

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onStudentAdded={fetchData}
      />

      {/* Tour Portal */}
      {mounted && tourStep !== null && createPortal(
        <>
          {/* Tour Spotlight Layer */}
          {highlightStyle && (
            <div
              style={highlightStyle}
              className="fixed z-[9995] border-2 border-dashed border-blue-500 rounded-2xl shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] pointer-events-none transition-all duration-150"
            />
          )}

          {/* Mascot Onboarding Dialogue Box */}
          <div className="fixed bottom-6 right-6 z-[10000] w-[340px] md:w-[400px] bg-white border border-slate-100 rounded-[28px] p-6 shadow-2xl flex flex-col gap-4 text-right animate-in slide-in-from-bottom duration-300 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
            {/* Mascot Header */}
            <div className="flex items-center gap-4 border-b border-slate-50 pb-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                {/* Animated robot mascot */}
                <svg className="w-10 h-10 text-blue-600 animate-bounce" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="16" width="40" height="32" rx="16" fill="#3b82f6" />
                  <rect x="22" y="24" width="8" height="8" rx="4" fill="white" />
                  <rect x="34" y="24" width="8" height="8" rx="4" fill="white" />
                  <circle cx="26" cy="28" r="2" fill="#1e3a8a" />
                  <circle cx="38" cy="28" r="2" fill="#1e3a8a" />
                  <path d="M26 38 C28 41, 36 41, 38 38" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  <rect x="8" y="26" width="4" height="12" rx="2" fill="#93c5fd" />
                  <rect x="52" y="26" width="4" height="12" rx="2" fill="#93c5fd" />
                  <path d="M32 4 L32 16" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="32" cy="4" r="3" fill="#fbbf24" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-slate-800">مساعدك الذكي: دربان</h4>
                <span className="text-[10px] text-blue-500 font-bold">يرشدك خطوة بخطوة 🚀</span>
              </div>
              <button
                onClick={() => setTourStep(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="text-xs font-bold">تخطي</span>
              </button>
            </div>

            {/* Tour Step Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-800">
                {TOUR_STEPS[tourStep].title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-bold">
                {TOUR_STEPS[tourStep].description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((tourStep + 1) / TOUR_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <span className="text-[10px] text-slate-400 font-bold">
                خطوة {tourStep + 1} من {TOUR_STEPS.length}
              </span>
              <div className="flex gap-2">
                {tourStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 bg-slate-50 border border-slate-150 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  >
                    السابق
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  {tourStep === TOUR_STEPS.length - 1 ? 'إنهاء الجولة 🎉' : 'التالي ◀'}
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Invite Portal */}
      {mounted && showTourInvite && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-2xl max-w-md w-full text-center relative flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300 font-['IBM_Plex_Sans_Arabic']" dir="rtl">

            {/* Animated robot mascot */}
            <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <svg className="w-14 h-14 text-blue-600 animate-bounce" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="16" width="40" height="32" rx="16" fill="#3b82f6" />
                <rect x="22" y="24" width="8" height="8" rx="4" fill="white" />
                <rect x="34" y="24" width="8" height="8" rx="4" fill="white" />
                <circle cx="26" cy="28" r="2" fill="#1e3a8a" />
                <circle cx="38" cy="28" r="2" fill="#1e3a8a" />
                <path d="M26 38 C28 41, 36 41, 38 38" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <rect x="8" y="26" width="4" height="12" rx="2" fill="#93c5fd" />
                <rect x="52" y="26" width="4" height="12" rx="2" fill="#93c5fd" />
                <path d="M32 4 L32 16" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" />
                <circle cx="32" cy="4" r="3" fill="#fbbf24" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800">أهلاً بك في أكاديميتك الذكية! 👋</h3>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                أنا مساعدك الرقمي دربان. ما رأيك في القيام بجولة سريعة للتعرف على أجزاء لوحة التحكم وكيفية تشغيل أكاديميتك بنجاح؟
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={startTour}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-200 transition-all active:scale-98"
              >
                ابدأ الجولة التعليمية الآن 🚀
              </button>
              <button
                onClick={() => {
                  setShowTourInvite(false);
                  localStorage.setItem('darab_tour_completed', 'true');
                }}
                className="w-full py-3 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl text-xs font-bold transition-all"
              >
                لا شكراً، سأستكشف بنفسي
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
