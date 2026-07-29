'use client';

import React, { useState } from 'react';
import { 
  Play, CheckCircle, ShieldCheck, Award, Clock, Signal, 
  Infinity as InfinityIcon, ChevronLeft, ChevronDown, Pen, 
  X, Star, Users, Check, Sparkles
} from 'lucide-react';
import { LandingPageContent } from '../types/landing';
import { MobileHeader, MobileStickyBar } from '../components/MobileStickyBar';

interface Template2RendererProps {
  content: LandingPageContent;
  courseData: any;
  isEditable?: boolean;
  onSubscribe?: () => Promise<void> | void;
  isSubscribing?: boolean;
  selectedPaymentMethod?: any;
  setSelectedPaymentMethod?: (pm: any) => void;
  isPaymentModalOpen?: boolean;
  setIsPaymentModalOpen?: (open: boolean) => void;
  setActiveSectionId?: (sectionId: string) => void;
}

export default function Template2Renderer({
  content,
  courseData,
  isEditable = false,
  onSubscribe = () => {},
  isSubscribing = false,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  setActiveSectionId,
}: Template2RendererProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeUnitIndex, setActiveUnitIndex] = useState<number>(0);

  // Extract prices and units
  const price = courseData?.final_price || courseData?.price || 299;
  const originalPrice = courseData?.original_price || courseData?.price_before_discount || 499;
  const currency = courseData?.currency || 'ريال سعودي';
  const units = courseData?.chapters || courseData?.units || [];
  const lessonsCount = units.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0);
  const instructorName = courseData?.instructor?.name || courseData?.instructor || 'أ. سارة أحمد';
  const instructorTitle = courseData?.instructor?.title || 'خبير تصميم واجهات وتجربة مستخدم (Lead UI/UX Designer)';
  const instructorBio = courseData?.instructor?.bio || 'خبرة تزيد عن 10 سنوات في تصميم المنتجات الرقمية لكبرى الشركات التقنية في المنطقة. ساهمت في تطوير أكثر من 50 تطبيقاً ناجحاً وحاصلة على جوائز دولية في الابتكار والتصميم الرقمي.';
  const instructorImage = courseData?.instructor?.profile_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400';

  const triggerEdit = (section: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (setActiveSectionId) {
      setActiveSectionId(section);
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#191b23] antialiased min-h-screen w-full relative pb-20 md:pb-0 font-sans" dir="rtl">
      {/* Mobile Top Header */}
      <MobileHeader courseTitle={courseData?.title} />

      {/* ─── 1. HERO SECTION (Full Height Immersive Dark Header) ─── */}
      <section className="relative min-h-[90vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 text-white group">
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url('${content.hero?.image || courseData?.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1600'}')`
          }}
        />

        {isEditable && (
          <button
            type="button"
            onClick={(e) => triggerEdit('hero', e)}
            className="absolute top-20 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-black cursor-pointer"
          >
            <Pen size={14} />
            <span>تعديل البانر الرئيسي</span>
          </button>
        )}

        {/* Top Navbar */}
        <header className="absolute top-0 w-full z-40 flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0055d9] flex items-center justify-center font-black text-lg text-white shadow-lg shadow-blue-600/30">
              د
            </div>
            <h2 className="text-white text-2xl font-black tracking-tight">دَرّب</h2>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-white/80">
            <a href="#" className="text-white underline underline-offset-8">الرئيسية</a>
            <a href="#" className="hover:text-white transition-colors">الدورات</a>
            <a href="#" className="hover:text-white transition-colors">من نحن</a>
            <a href="#" className="hover:text-white transition-colors">اتصل بنا</a>
          </div>

          <button 
            type="button"
            onClick={onSubscribe}
            className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black hover:bg-white/20 transition-all cursor-pointer"
          >
            تسجيل الدخول
          </button>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl px-6 pt-24 md:pt-0 text-center flex flex-col items-center gap-6">
          <nav className="flex justify-center text-white/70 font-bold text-xs md:text-sm">
            <ol className="inline-flex items-center space-x-1 space-x-reverse">
              <li><a className="hover:text-white transition-colors" href="#">الدورات</a></li>
              <li><ChevronLeft size={16} className="mx-1" /></li>
              <li className="text-white">{courseData?.category || 'تصميم واجهة المستخدم'}</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-6xl font-black text-white leading-tight max-w-4xl text-balance">
            {content.hero?.title || courseData?.title}
          </h1>

          <p className="text-sm md:text-xl text-white/90 max-w-3xl leading-relaxed font-light">
            {content.hero?.description || courseData?.description || 'اكتشف أسرار تصميم واجهات مستخدم مذهلة وتجارب مستخدم سلسة في هذه الدورة الشاملة.'}
          </p>

          {/* CTA & Stats */}
          <div className="flex flex-col items-center gap-4 mt-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onSubscribe}
              disabled={isSubscribing}
              className="w-full sm:w-auto px-12 py-4 rounded-full bg-[#0055d9] hover:bg-[#0040a7] text-white text-lg md:text-2xl font-black shadow-[0_20px_50px_rgba(0,85,217,0.4)] hover:shadow-[0_25px_60px_rgba(0,85,217,0.6)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {isSubscribing ? 'جاري التسجيل...' : 'سجل الآن'}
            </button>

            <div className="flex items-center gap-6 text-white/80 text-xs md:text-sm font-bold">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-black text-white">4.8</span> (1,240 تقييم)
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>+{courseData?.students_count || '15,400'} طالب مسجل</span>
              </div>
            </div>
          </div>

          {/* Video Preview Button */}
          <div className="mt-6 flex flex-col items-center">
            <div 
              onClick={() => setIsVideoModalOpen(true)}
              className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:bg-[#0055d9] hover:scale-110 transition-all duration-300 group shadow-xl"
            >
              <Play className="text-white fill-current translate-x-[-1px]" size={28} />
            </div>
            <p className="text-white/70 mt-2 text-xs font-bold">شاهد عرض الدورة</p>
          </div>
        </div>
      </section>

      {/* ─── 2. MAIN CONTENT AREA ─── */}
      <main className="w-full bg-[#faf8ff] relative z-20">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-20">
          
          {/* Section: About Course & Investment Card */}
          <section className="space-y-8 relative group">
            {isEditable && (
              <button
                type="button"
                onClick={(e) => triggerEdit('learning', e)}
                className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-bold shadow-md hover:bg-blue-700 cursor-pointer"
              >
                تعديل العرض والدورة
              </button>
            )}

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-[#191b23]">عن هذه الرحلة التعليمية</h2>
              <p className="text-[#434654] text-base md:text-xl leading-relaxed">
                {courseData?.description || 'اكتشف أسرار تصميم واجهات مستخدم مذهلة وتجارب مستخدم سلسة في هذه الدورة الشاملة. من الأساسيات إلى التطبيقات المتقدمة، ستتعلم كيف تبني منتجات رقمية يحبها الناس.'}
              </p>
            </div>

            {/* Investment Card */}
            <div className="bg-[#f3f3fe] p-8 md:p-10 rounded-3xl border border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="text-center md:text-right space-y-2">
                <h3 className="text-xl md:text-2xl font-black text-[#191b23]">استثمارك في مستقبلك</h3>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-4xl md:text-5xl font-black text-[#0055d9]">{price}</span>
                  <span className="text-lg font-bold text-[#434654]">{currency}</span>
                  {originalPrice > price && (
                    <span className="text-sm text-slate-400 line-through font-bold mr-2">{originalPrice} {currency}</span>
                  )}
                </div>
                <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-600 font-bold text-xs">
                  خصم 40% لفترة محدودة
                </span>
              </div>

              <div className="text-center w-full md:w-auto">
                <button
                  type="button"
                  onClick={onSubscribe}
                  disabled={isSubscribing}
                  className="w-full md:w-auto px-10 py-4 rounded-xl bg-[#0055d9] hover:bg-[#0040a7] text-white text-lg font-black shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  {isSubscribing ? 'جاري التحميل...' : 'سجل الآن'}
                </button>
                <p className="text-xs text-[#434654] font-bold mt-2">ضمان استرداد الأموال لمدة 14 يوماً</p>
              </div>
            </div>
          </section>

          {/* Section: Course Features Grid */}
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-black text-[#191b23] text-center">بنية الدورة المتميزة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#f3f3fe] border border-slate-200/50 shadow-xs">
                <Signal className="text-[#0055d9] shrink-0" size={32} />
                <div>
                  <h3 className="font-black text-[#191b23] text-base">مستوى الدورة</h3>
                  <p className="text-[#434654] text-xs font-bold">مبتدئ إلى متوسط</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#f3f3fe] border border-slate-200/50 shadow-xs">
                <Clock className="text-[#0055d9] shrink-0" size={32} />
                <div>
                  <h3 className="font-black text-[#191b23] text-base">المدة الزمنية</h3>
                  <p className="text-[#434654] text-xs font-bold">{units.length} أسابيع ({lessonsCount * 2} ساعة)</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#f3f3fe] border border-slate-200/50 shadow-xs">
                <Award className="text-[#0055d9] shrink-0" size={32} />
                <div>
                  <h3 className="font-black text-[#191b23] text-base">الشهادة</h3>
                  <p className="text-[#434654] text-xs font-bold">شهادة إتمام معتمدة</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#f3f3fe] border border-slate-200/50 shadow-xs">
                <InfinityIcon className="text-[#0055d9] shrink-0" size={32} />
                <div>
                  <h3 className="font-black text-[#191b23] text-base">الوصول الكامل</h3>
                  <p className="text-[#434654] text-xs font-bold">وصول مدى الحياة</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Curriculum / Course Content */}
          <section className="space-y-8 relative group">
            {isEditable && (
              <button
                type="button"
                onClick={(e) => triggerEdit('chapters', e)}
                className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-bold shadow-md hover:bg-blue-700 cursor-pointer"
              >
                تعديل المنهج
              </button>
            )}

            <h2 className="text-2xl md:text-3xl font-black text-[#191b23] text-center">محتوى الدورة</h2>
            <div className="space-y-4">
              {units.map((unit: any, idx: number) => {
                const isOpen = activeUnitIndex === idx;
                const unitNum = String(idx + 1).padStart(2, '0');
                
                return (
                  <div key={unit.id || idx} className="bg-[#f3f3fe] rounded-2xl border border-slate-200/60 overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => setActiveUnitIndex(isOpen ? -1 : idx)}
                      className="w-full p-6 flex justify-between items-center bg-blue-50/50 hover:bg-blue-50 transition-colors text-right cursor-pointer"
                    >
                      <h3 className="text-lg md:text-xl font-black text-[#191b23] flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#0055d9] text-white flex items-center justify-center text-xs font-black shrink-0">
                          {unitNum}
                        </span>
                        <span>{unit.title}</span>
                      </h3>
                      <span className="text-xs font-bold text-[#434654] shrink-0">
                        {unit.lessons?.length || 0} دروس
                      </span>
                    </button>

                    {isOpen && (
                      <div className="p-6 space-y-3 bg-white border-t border-slate-100">
                        {unit.lessons?.map((lesson: any, lIdx: number) => (
                          <div key={lesson.id || lIdx} className="flex items-center gap-3 text-[#434654] hover:text-[#0055d9] transition-colors font-bold text-sm">
                            <Play size={18} className="text-[#0055d9] shrink-0" />
                            <span>{lesson.title}</span>
                          </div>
                        ))}
                        {(!unit.lessons || unit.lessons.length === 0) && (
                          <p className="text-xs text-slate-400 italic">لا توجد دروس مضافة في هذه الوحدة.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {units.length === 0 && (
                <div className="bg-[#f3f3fe] p-8 rounded-2xl text-center text-slate-400 text-xs font-bold">
                  سيتم إضافة محتوى الدورة قريباً.
                </div>
              )}
            </div>
          </section>

          {/* Section: Instructor */}
          <section className="space-y-8 relative group">
            {isEditable && (
              <button
                type="button"
                onClick={(e) => triggerEdit('footer', e)}
                className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-bold shadow-md hover:bg-blue-700 cursor-pointer"
              >
                تعديل بيانات المدرب
              </button>
            )}

            <h2 className="text-2xl md:text-3xl font-black text-[#191b23] text-center">عن المدرب</h2>
            <div className="bg-[#f3f3fe] p-8 md:p-10 rounded-[2.5rem] border border-slate-200/60 shadow-xs flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
              <div className="relative shrink-0">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img alt={instructorName} className="w-full h-full object-cover" src={instructorImage} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#84f5c2] rounded-full flex items-center justify-center shadow-md">
                  <ShieldCheck className="text-[#00714e]" size={22} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#191b23]">{instructorName}</h3>
                  <p className="text-[#0055d9] font-bold text-sm md:text-base mt-1">{instructorTitle}</p>
                </div>
                <p className="text-[#434654] text-sm md:text-base leading-relaxed">{instructorBio}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-[#434654] border border-slate-200">Google Certified</span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-[#434654] border border-slate-200">Interaction Design Expert</span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-[#434654] border border-slate-200">Mentor at ADPList</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: What You Will Get */}
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-black text-[#191b23] text-center">ماذا ستحصل عليه؟</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                '30 ساعة من مقاطع الفيديو عالية الجودة مصممة بعناية لتناسب إيقاع تعلمك.',
                '15 مشروع تطبيقي لبناء معرض أعمالك، لتنتقل من النظرية إلى التطبيق الحقيقي.',
                'ملفات ومصادر قابلة للتحميل تشمل قوالب عمل ومصادر إلهام احترافية.',
                'وصول إلى مجتمع الطلاب الخاص للحصول على دعم مستمر ومراجعة لأعمالك.'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 hover:bg-emerald-50/50 rounded-2xl transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Check size={18} className="stroke-[3]" />
                  </div>
                  <p className="text-[#434654] text-sm md:text-base font-bold leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Big Primary CTA Section */}
          <section className="text-center py-12 md:py-16 bg-[#0040a7] text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden px-6 space-y-6">
            <div className="relative z-10 space-y-4 max-w-lg mx-auto">
              <h2 className="text-3xl md:text-4xl font-black">جاهز لتبدأ رحلتك الإبداعية؟</h2>
              <p className="text-sm md:text-base text-white/80">انضم إلى آلاف الطلاب الذين غيروا مسارهم المهني من خلال إتقان فن الـ UI/UX.</p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onSubscribe}
                  disabled={isSubscribing}
                  className="px-12 py-5 rounded-2xl bg-white text-[#0040a7] text-xl font-black shadow-xl hover:bg-[#84f5c2] hover:text-slate-900 transition-all cursor-pointer"
                >
                  {isSubscribing ? 'جاري الحفظ...' : `ابدأ الآن - ${price} ريال`}
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f3f3fe] py-10 border-t border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-[#434654]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#0055d9] text-white flex items-center justify-center font-black text-xs">
              د
            </div>
            <span className="text-base font-black text-[#191b23]">دَرّب</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0055d9]">سياسة الخصوصية</a>
            <a href="#" className="hover:text-[#0055d9]">الشروط والأحكام</a>
            <a href="#" className="hover:text-[#0055d9]">مركز المساعدة</a>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 font-bold mt-6">© 2026 دَرّب التعليمية. جميع الحقوق محفوظة.</p>
      </footer>

      {/* Video Modal Overlay */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="bg-black rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <iframe 
              src={(courseData?.preview_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ').replace('watch?v=', 'embed/')} 
              title="Course Preview Video" 
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Mobile Floating Bottom Action Bar */}
      <MobileStickyBar
        courseData={courseData}
        onSubscribe={onSubscribe}
        isSubscribing={isSubscribing}
        whatsappNumber={content.whatsapp?.phoneNumber}
      />
    </div>
  );
}
