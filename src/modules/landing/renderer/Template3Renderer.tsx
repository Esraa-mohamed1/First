'use client';

import React from 'react';
import { Eye, Play, Check, ShoppingCart, ShieldCheck, Video, FileDown, GraduationCap, RefreshCw, Smartphone, ChevronLeft, ChevronDown } from 'lucide-react';
import { Course } from '@/types/api';
import { LandingPageContent } from '../types/landing';
import { MobileHeader, MobileStickyBar } from '../components/MobileStickyBar';

interface Template3RendererProps {
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

export default function Template3Renderer({
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
}: Template3RendererProps) {
  // Setup selectors
  const [activeAccordionIndex, setActiveAccordionIndex] = React.useState<number>(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);

  // Extract prices
  const price = courseData?.price || 299;
  const originalPrice = courseData?.original_price || courseData?.price_before_discount || 899;
  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Extract chapters / units
  const units = courseData?.chapters || courseData?.units || [];
  const lessonsCount = units.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0);

  const triggerEdit = (section: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (setActiveSectionId) {
      setActiveSectionId(section);
    }
  };

  return (
    <div className="bg-[#f0f2f5] text-[#191b23] antialiased min-h-screen w-full relative pb-24 md:pb-12 font-sans" dir="rtl">
      {/* Mobile Top Header */}
      <MobileHeader courseTitle={courseData?.title} />

      {/* 2. Hero Section */}
      <section className="bg-white border-b border-slate-200/50 pt-6 pb-10 lg:pt-12 lg:pb-20 relative group">
        {isEditable && (
          <button
            type="button"
            onClick={(e) => triggerEdit('hero', e)}
            className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md hover:bg-blue-700 cursor-pointer"
          >
            <span>تعديل البانر الرئيسي</span>
          </button>
        )}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <nav className="hidden md:flex text-sm text-blue-600 font-bold mb-6">
                <ol className="inline-flex items-center space-x-1 space-x-reverse">
                  <li><a href="#" className="hover:underline">الرئيسية</a></li>
                  <li><ChevronLeft size={14} className="mx-1" /></li>
                  <li><a href="#" className="hover:underline">التصميم</a></li>
                </ol>
              </nav>
              <h1 className="text-2xl lg:text-5xl font-black leading-tight text-slate-900 mb-4">
                {content.hero?.title || courseData?.title}
              </h1>
              <p className="text-sm lg:text-lg text-slate-600 leading-relaxed mb-5 max-w-2xl line-clamp-4 lg:line-clamp-none">
                {content.hero?.description || courseData?.description || 'تعلم كيفية بناء منتجات رقمية عالمية المستوى من خلال فهم سلوك المستخدم وإتقان أدوات التصميم الحديثة مثل Figma.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4].map((s) => (
                      <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-slate-300 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-800">4.8</span>
                  <span className="text-slate-400 text-xs">(12,450 تقييم)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>15,400 طالب مسجل</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <div 
                className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/50 group cursor-pointer aspect-video bg-slate-900"
                onClick={() => {
                  if (courseData?.preview_url) {
                    setIsVideoModalOpen(true);
                  }
                }}
              >
                <img 
                  alt="Video Preview" 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" 
                  src={content.hero?.image || courseData?.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200'}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-xl scale-95 group-hover:scale-100 transition-all duration-300">
                    <Play className="text-white fill-current translate-x-[-1px]" size={36} />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-black">معاينة الدورة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-12 py-6 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          
          {/* Left Side: Content Details */}
          <div className="flex-1 space-y-12 order-2 lg:order-1">
            
            {/* What you'll learn */}
            <section className="bg-white p-5 lg:p-8 rounded-3xl shadow-sm border border-slate-200/60 relative group">
              {isEditable && (
                <button
                  type="button"
                  onClick={(e) => triggerEdit('learning', e)}
                  className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-bold shadow-md hover:bg-blue-700 cursor-pointer"
                >
                  تعديل المزايا
                </button>
              )}
              <h2 className="text-lg lg:text-2xl font-black text-slate-900 mb-5">ماذا ستتعلم في هذه الدورة؟</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {(content.learning?.cards || []).map((card: any, idx: number) => (
                  <div key={card.id || idx} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} className="stroke-[3]" />
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed font-semibold">{card.info_value || card.value}</p>
                  </div>
                ))}
                {(!content.learning?.cards || content.learning.cards.length === 0) && (
                  <>
                    <div className="flex gap-3">
                      <Check className="text-blue-600 shrink-0" size={18} />
                      <p className="text-slate-700 text-sm">فهم عميق لمبادئ سيكولوجية المستخدم وتأثيرها على التصميم.</p>
                    </div>
                    <div className="flex gap-3">
                      <Check className="text-blue-600 shrink-0" size={18} />
                      <p className="text-slate-700 text-sm">إتقان أدوات التصميم العالمية مثل Figma من الصفر الاحترافي.</p>
                    </div>
                    <div className="flex gap-3">
                      <Check className="text-blue-600 shrink-0" size={18} />
                      <p className="text-slate-700 text-sm">بناء أنظمة تصميم (Design Systems) متكاملة وقابلة للتوسع.</p>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Curriculum */}
            <section className="relative group">
              {isEditable && (
                <button
                  type="button"
                  onClick={(e) => triggerEdit('chapters', e)}
                  className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-bold shadow-md hover:bg-blue-700 cursor-pointer"
                >
                  تعديل المنهج
                </button>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
                <h2 className="text-xl lg:text-2xl font-black text-slate-900">محتوى الدورة منهج متكامل</h2>
                <div className="text-xs font-bold text-slate-400">
                  {units.length} وحدات • {lessonsCount} درساً • محتوى شامل
                </div>
              </div>
              <div className="space-y-4">
                {units.map((unit: any, uIdx: number) => {
                  const isOpen = activeAccordionIndex === uIdx;
                  return (
                    <div key={unit.id || uIdx} className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveAccordionIndex(isOpen ? -1 : uIdx)}
                        className="w-full flex items-center justify-between p-6 text-right cursor-pointer hover:bg-slate-50/50 transition-colors focus:outline-none"
                      >
                        <div className="flex items-center gap-4">
                          <ChevronDown 
                            className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            style={{ width: '20px', height: '20px' }}
                          />
                          <h3 className="font-extrabold text-base lg:text-lg text-slate-800">{unit.title}</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-400 shrink-0">
                          {unit.lessons?.length || 0} درس
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className="p-6 pt-0 border-t border-slate-100 space-y-4 bg-slate-50/30">
                          {(unit.lessons || []).map((lesson: any, lIdx: number) => (
                            <div key={lesson.id || lIdx} className="flex items-center justify-between py-3 border-b border-slate-100/50 last:border-b-0">
                              <div className="flex items-center gap-3">
                                <Video size={16} className="text-slate-300" />
                                <span className="text-slate-700 text-sm font-semibold">{lesson.title}</span>
                              </div>
                              {lesson.is_preview || lesson.free ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (lesson.video_url || courseData?.preview_url) {
                                      setIsVideoModalOpen(true);
                                    }
                                  }}
                                  className="text-blue-600 text-xs font-black hover:underline cursor-pointer"
                                >
                                  معاينة مجانية
                                </button>
                              ) : (
                                <span className="text-slate-400 text-xs font-bold">مغلق</span>
                              )}
                            </div>
                          ))}
                          {(!unit.lessons || unit.lessons.length === 0) && (
                            <div className="text-center py-4 text-slate-400 italic text-xs font-bold">
                              لا توجد دروس مضافة لهذه الوحدة بعد.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {units.length === 0 && (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 italic text-xs font-bold">
                    سيتم إضافة المنهج الدراسي قريباً.
                  </div>
                )}
              </div>
            </section>

            {/* About Instructor */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 relative group">
              {isEditable && (
                <button
                  type="button"
                  onClick={(e) => triggerEdit('instructor', e)}
                  className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-bold shadow-md hover:bg-blue-700 cursor-pointer"
                >
                  تعديل بيانات المدرب
                </button>
              )}
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-8">عن المحاضر والمدرب</h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-emerald-400 shadow-md">
                  <img 
                    alt="Instructor" 
                    className="w-full h-full object-cover" 
                    src={content.template3_instructor?.avatar || courseData?.instructor?.avatar || courseData?.user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'}
                  />
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-black text-slate-800">
                    {content.template3_instructor?.name || courseData?.instructor_name || courseData?.instructor?.name || courseData?.user?.name || 'أ. سارة أحمد'}
                  </h3>
                  <p className="text-blue-600 font-bold text-xs lg:text-sm mt-1 mb-4">
                    {content.template3_instructor?.jobTitle || courseData?.instructor_title || 'خبير وكبير مصممي المنتجات الرقمية'}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                    {content.template3_instructor?.bio || courseData?.instructor_bio || 'خبرة طويلة في تصميم وتطوير المنتجات الرقمية الموجهة للمستخدمين. عمل مع عدة جهات ومستشار تقني للتصميم وتطوير الهويات وتسهيل رحلة العميل.'}
                  </p>
                  <div className="flex gap-8 mt-6">
                    <div className="flex flex-col">
                      <span className="text-xl lg:text-2xl font-black text-slate-900">
                        {content.template3_instructor?.studentsCount || '45,000+'}
                      </span>
                      <span className="text-[10px] lg:text-xs font-bold text-slate-400 mt-0.5">طالب مستفيد</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl lg:text-2xl font-black text-slate-900">
                        {content.template3_instructor?.coursesCount || '12+'}
                      </span>
                      <span className="text-[10px] lg:text-xs font-bold text-slate-400 mt-0.5">برنامج تدريبي</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 relative group">
              {isEditable && (
                <button
                  type="button"
                  onClick={(e) => triggerEdit('faq', e)}
                  className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-bold shadow-md hover:bg-blue-700 cursor-pointer"
                >
                  تعديل الأسئلة الشائعة
                </button>
              )}
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-8">
                {content.faq?.title || 'الأسئلة الشائعة حول البرنامج'}
              </h2>
              <div className="space-y-6">
                {(content.faq?.items || []).map((faq: any, fIdx: number) => (
                  <div key={fIdx} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-extrabold text-sm lg:text-base text-slate-800 flex items-start gap-2">
                      <span className="text-blue-600 shrink-0">؟</span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-slate-500 text-xs lg:text-sm leading-relaxed mt-2 pr-4 font-semibold">
                      {faq.answer}
                    </p>
                  </div>
                ))}
                {(!content.faq?.items || content.faq.items.length === 0) && (
                  <div className="text-slate-400 italic text-xs font-bold text-center py-4">
                    لا توجد أسئلة شائعة مضافة حالياً.
                  </div>
                )}
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-6">المتطلبات الأساسية للبدء</h2>
              <ul className="space-y-3 list-disc list-inside text-slate-600 text-xs lg:text-sm font-semibold leading-relaxed pr-2">
                {courseData?.requirements ? (
                  (Array.isArray(courseData.requirements)
                    ? courseData.requirements
                    : typeof courseData.requirements === 'string'
                      ? courseData.requirements.split('\n')
                      : []
                  ).map((req: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{req}</li>
                  ))
                ) : (
                  <>
                    <li>لا يشترط وجود خبرة سابقة في التصميم أو التطوير.</li>
                    <li>جهاز كمبيوتر (Mac أو Windows) متصل بالإنترنت.</li>
                    <li>الالتزام والرغبة بالتطبيق والعمل والتطوير المستمر.</li>
                  </>
                )}
              </ul>
            </section>
          </div>

          {/* Right Side: Sticky Pricing Card — hidden on mobile, shown lg+ */}
          <aside className="hidden lg:block lg:w-[400px] order-1 lg:order-2 shrink-0">
            <div className="lg:sticky lg:top-28 bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl relative group">
              {isEditable && (
                <button
                  type="button"
                  onClick={(e) => triggerEdit('payment', e)}
                  className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md text-blue-600 px-3 py-1 rounded-md text-[10px] font-bold shadow-md hover:bg-white cursor-pointer"
                >
                  تعديل الدفع
                </button>
              )}
              
              {/* Badge/Price Header */}
              <div className="bg-blue-600 p-6 text-white text-center">
                <div className="text-xs font-bold opacity-80 mb-1">
                  {content.template3_pricing?.title || content.payment?.title || 'رسوم الاشتراك الفوري بالدورة'}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-black">{price.toLocaleString('ar-EG')}</span>
                  <span className="text-sm font-bold">ريال سعودي</span>
                  {originalPrice > price && (
                    <span className="text-white/50 line-through text-xs mr-2">{originalPrice.toLocaleString('ar-EG')} ريال</span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <div className="mt-3 bg-white/20 inline-block px-3 py-1 rounded-full text-[10px] font-black">
                    خصم لفترة محدودة {discountPercent}%
                  </div>
                )}
              </div>

              {/* Action Buttons & Features */}
              <div className="p-8">
                <button 
                  type="button"
                  onClick={onSubscribe}
                  disabled={isSubscribing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 transition-all mb-4 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <ShoppingCart size={18} />
                  <span>{isSubscribing ? 'جاري الاشتراك...' : (content.template3_pricing?.buttonText || 'اشترك وسجل بالدورة الآن')}</span>
                </button>

                <div className="mt-6">
                  <h4 className="font-extrabold text-sm text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <ShieldCheck className="text-blue-600" size={18} />
                    <span>ما يشتمل عليه تسجيلك:</span>
                  </h4>
                  <ul className="space-y-4">
                    {((content.template3_pricing?.items && content.template3_pricing.items.length > 0) ? content.template3_pricing.items : [
                      'وصول كامل لكافة المحاضرات والدروس المصورة',
                      'ملفات عمل ومصادر وتطبيقات قابلة للتحميل',
                      'شهادة إتمام معتمدة باسمك من منصة دَرّب',
                      'تحديثات دورية مجانية للمحتوى مدى الحياة',
                      'إمكانية الحضور والمتابعة من الهاتف أو الكمبيوتر'
                    ]).map((item: string, iIdx: number) => {
                      const icons = [Video, FileDown, GraduationCap, RefreshCw, Smartphone];
                      const IconComponent = icons[iIdx % icons.length];
                      return (
                        <li key={iIdx} className="flex items-center gap-4 text-slate-600">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                            <IconComponent size={16} />
                          </div>
                          <span className="text-xs lg:text-sm font-bold">{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-black tracking-wider">
                    {content.template3_pricing?.guaranteeText || 'ضمان استرداد الأموال كاملة خلال 30 يوماً'}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>



      {/* Mobile Floating Bottom Action Bar */}
      <MobileStickyBar
        courseData={courseData}
        onSubscribe={onSubscribe}
        isSubscribing={isSubscribing}
        whatsappNumber={content.whatsapp?.phoneNumber}
      />

      {/* 5. Course Preview Video Modal Overlay */}
      {isVideoModalOpen && courseData?.preview_url && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/85 transition-colors cursor-pointer"
            >
              ✕
            </button>
            <iframe 
              src={courseData.preview_url.replace('watch?v=', 'embed/')} 
              title="Course Preview Video" 
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
