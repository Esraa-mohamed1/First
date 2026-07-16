import React from 'react';
import { Play, PlayCircle, Video, Award, Clock, Users, Pen } from 'lucide-react';
import { HeroSectionData } from '../types/landing';
import { twMerge } from 'tailwind-merge';
import { PaymentMethodCard } from '@/components/payment/PaymentMethodCard';
import { colorToRgbTriplet } from '../utils/color';

interface HeroSectionProps {
  data: HeroSectionData;
  course: any;
  templateId: string;
  isEditable: boolean;
  onEdit: () => void;
  onSubscribe: () => void;
  isSubscribing: boolean;
  selectedPaymentMethod?: any;
  setSelectedPaymentMethod?: (pm: any) => void;
  isPaymentModalOpen?: boolean;
  setIsPaymentModalOpen?: (open: boolean) => void;
}

export default function HeroSection({
  data,
  course,
  templateId,
  isEditable,
  onEdit,
  onSubscribe,
  isSubscribing,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isPaymentModalOpen,
  setIsPaymentModalOpen,
}: HeroSectionProps) {
  const isTemplate1 = templateId === 'template_1' || templateId === 'Modern Course';
  
  // Dynamic metrics
  const totalLessons = course?.units?.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0) || 0;
  const videoUrl = course?.units?.[0]?.lessons?.[0]?.video_url;
  const instructorName = course?.instructor?.name || course?.instructor || 'المدرب المعتمد';
  const instructorImage = course?.instructor?.profile_image || 'https://i.pravatar.cc/150?u=instructor';
  
  // Custom styles
  const titleSizeStyle = data.typography?.titleSize ? { fontSize: `${data.typography.titleSize}px` } : {};
  const bodySizeStyle = data.typography?.bodySize ? { fontSize: `${data.typography.bodySize}px` } : {};

  // Parse color structures
  const defaultBg = isTemplate1 ? '#082A24' : '#ffffff';
  const defaultText = isTemplate1 ? '#FBF7EE' : '#1f2937';
  
  const localBg = data.backgroundColor || defaultBg;
  const localText = data.textColor || defaultText;
  
  const bgRgb = colorToRgbTriplet(localBg);
  const textRgb = colorToRgbTriplet(localText);
  
  const primaryColorHex = isTemplate1 ? '#C9A24B' : 'var(--theme-primary)';
  const primaryRgbTriplet = isTemplate1 ? '201, 162, 75' : 'var(--theme-primary-rgb)';

  const sectionStyle = {
    backgroundColor: localBg,
    color: localText,
    '--local-bg-rgb': bgRgb,
    '--local-text-rgb': textRgb,
    '--theme-primary': primaryColorHex,
    '--theme-primary-rgb': primaryRgbTriplet,
  } as React.CSSProperties;

  const isFree = course?.price_type === 'free' || Number(course?.final_price || course?.price || 0) === 0;

  if (isTemplate1) {
    return (
      <header 
        style={sectionStyle}
        className={twMerge(
          "hero relative py-14 pb-20 overflow-hidden group",
          isEditable && "hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-900/5 transition-all"
        )}
      >
        {isEditable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="absolute top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold font-sans transition-all cursor-pointer"
          >
            <Pen size={12} />
            تعديل قسم الهيرو
          </button>
        )}

        <div className="container max-w-[1120px] mx-auto px-4">
          <div className="text-center mb-6">
            <span 
              style={{ backgroundColor: `rgba(${primaryRgbTriplet}, 0.2)`, borderColor: `rgba(${primaryRgbTriplet}, 0.4)`, color: `rgb(${primaryRgbTriplet})` }}
              className="hero-badge border rounded-full px-4 py-1.5 text-xs font-semibold"
            >
              {data.subtitle || '✦ الدفعة الجديدة — التسجيل مفتوح الآن'}
            </span>
          </div>

          <div 
            style={{ borderColor: `rgba(${primaryRgbTriplet}, 0.7)`, backgroundColor: `rgba(${bgRgb}, 0.6)` }}
            className="relative aspect-video rounded-3xl overflow-hidden border-2 shadow-2xl max-w-[800px] mx-auto mb-10"
          >
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
                poster={data.image || course?.image}
              />
            ) : (
              <div 
                style={{ color: `rgb(${primaryRgbTriplet})` }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center"
              >
                <img src={data.image || course?.image} alt="Course Hero Preview" className="absolute inset-0 w-full h-full object-cover opacity-45" />
                <div 
                  style={{ backgroundColor: `rgba(${primaryRgbTriplet}, 0.2)`, borderColor: `rgb(${primaryRgbTriplet})` }}
                  className="w-20 h-20 rounded-full border flex items-center justify-center text-2xl font-bold shadow-lg z-10"
                >
                  ▶
                </div>
                <span className="font-bold text-sm z-10 text-white shadow-sm">مشاهدة الإعلان الترويجي للدورة</span>
              </div>
            )}
          </div>

          {/* Details block overlay */}
          <div 
            style={{ backgroundColor: '#ffffff', color: '#22302B', borderColor: `rgba(${textRgb}, 0.15)` }}
            className="rounded-3xl border shadow-2xl p-8 max-w-[940px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-right"
          >
            <div className="md:col-span-2 space-y-4">
              <h1 style={{ ...titleSizeStyle, color: '#0D3B33' }} className="text-2xl md:text-3xl font-extrabold leading-snug">
                {data.title || course?.title}
              </h1>
              
              <div
                style={{ ...bodySizeStyle, color: 'rgba(34, 48, 43, 0.75)' }}
                className="font-medium text-sm leading-relaxed ql-editor !p-0"
                dangerouslySetInnerHTML={{ __html: data.description || course?.description || 'برنامج عملي مكثّف، تتعلم فيه بناء المهارات خطوة بخطوة، وتطبّق على مشاريع حقيقية.' }}
              />

              <div 
                style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
                className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600 pt-2 border-t"
              >
                <div className="flex items-center gap-1">🎥 <b>{totalLessons * 1.5} ساعة</b></div>
                <div className="flex items-center gap-1">👥 <b>+{course?.students_count || '2,450'} طالب</b></div>
                <div className="flex items-center gap-1">👨‍🏫 <b>{instructorName}</b></div>
              </div>
            </div>

            <div 
              style={{ backgroundColor: '#FBF7EE', borderColor: '#F1E8D6' }}
              className="border rounded-2xl p-6 flex flex-col justify-between h-full space-y-4 w-full"
            >
              <div>
                <span className="text-xs text-slate-400 block mb-1">استثمار الدورة</span>
                {isFree ? (
                  <span className="text-2xl font-black text-[#0D3B33]">مجاني بالكامل</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#0D3B33]">{course?.final_price || course?.price}</span>
                    <span className="text-xs font-bold text-[#0D3B33]">{course?.currency || 'SAR'}</span>
                    {course?.final_price && course?.price && course?.final_price !== course?.price && (
                      <span className="text-xs text-slate-300 line-through font-bold ml-2">{course?.price} {course?.currency || 'SAR'}</span>
                    )}
                  </div>
                )}
                <span className="text-[10px] text-[#C9A24B] font-bold block mt-1">⏳ الخصم ساري لفترة محدودة</span>
              </div>

              {/* Payment Methods selector in public non-enrolled views */}
              {!isFree && !course?.is_subscribed && setSelectedPaymentMethod && (
                <div className="space-y-2 w-full">
                  <div className="text-right">
                    <span className="text-slate-700 font-bold text-xs">اختر وسيلة الدفع:</span>
                  </div>
                  {course.payment_methods && course.payment_methods.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {course.payment_methods.map((pm: any) => (
                        <PaymentMethodCard
                          key={pm.methodId}
                          id={pm.methodId}
                          name={pm.methodName}
                          type={pm.type}
                          isSelected={selectedPaymentMethod?.methodId === pm.methodId}
                          onSelect={() => setSelectedPaymentMethod(pm)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-[9px] text-gray-400 font-bold">لا تتوفر وسائل دفع مفعلة.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                {course?.is_subscribed ? (
                  <button onClick={onSubscribe} className="w-full py-3 bg-[#0D3B33] text-white rounded-xl font-bold text-sm shadow-md hover:brightness-95 transition-all">
                    ابدأ التعلم الآن ←
                  </button>
                ) : (
                  <button 
                    onClick={onSubscribe} 
                    disabled={isSubscribing}
                    className="w-full py-3 bg-gradient-to-r from-[#E7CE8F] to-[#C9A24B] text-[#082A24] rounded-xl font-bold text-sm shadow-md hover:translate-y-[-1px] active:scale-95 transition-all cursor-pointer"
                  >
                    {isSubscribing ? 'جاري التحميل...' : 'اشترك في الدورة الآن ←'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Template 2 Layout (Blue theme)
  return (
    <header 
      style={sectionStyle}
      className={twMerge(
        "py-12 lg:py-16 border-b border-slate-100 group relative",
        isEditable && "hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-50 transition-all"
      )}
    >
      {isEditable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold font-sans transition-all cursor-pointer"
        >
          <Pen size={12} />
          تعديل قسم الهيرو
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="flex-1 space-y-6 text-right w-full">
            <div 
              style={{ backgroundColor: `rgba(${primaryRgbTriplet}, 0.1)`, color: `rgb(${primaryRgbTriplet})` }}
              className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold"
            >
              {data.subtitle || 'الدورة التدريبية الأكثر طلباً'}
            </div>

            <h1 style={{ ...titleSizeStyle, color: localText }} className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              {data.title || course?.title}
            </h1>

            <div 
              style={{ ...bodySizeStyle, color: `rgba(${textRgb}, 0.75)` }}
              className="font-medium text-sm leading-relaxed ql-editor !p-0"
              dangerouslySetInnerHTML={{ __html: data.description || course?.description }}
            />

            <div 
              style={{ borderColor: `rgba(${textRgb}, 0.1)` }}
              className="flex flex-wrap items-center gap-6 pt-4 border-t text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow">
                  <img src={instructorImage} alt="Instructor" className="w-full h-full object-cover" />
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-bold text-[9px] uppercase">المدرب المعتمد</p>
                  <p style={{ color: localText }} className="font-extrabold">{instructorName}</p>
                </div>
              </div>

              <div 
                style={{ backgroundColor: `rgba(${textRgb}, 0.15)` }}
                className="w-[1px] h-8"
              />

              <div className="text-right">
                <p className="text-slate-400 font-bold text-[9px] uppercase">تاريخ التحديث</p>
                <p style={{ color: localText }} className="font-extrabold">يوليو 2026</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[480px] shrink-0 space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster={data.image || course?.image}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4 bg-slate-950">
                  <img src={data.image || course?.image} alt="Course Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  <Video size="32" className="text-slate-400 z-10" />
                  <span className="font-bold text-sm z-10">فيديو تعريفي بالدورة</span>
                </div>
              )}
            </div>

            {/* Quick Pricing & Checkout block for public views in Template 2 */}
            {!isEditable && (
              <div 
                style={{ backgroundColor: `rgba(${textRgb}, 0.03)`, borderColor: `rgba(${textRgb}, 0.08)` }}
                className="border p-6 rounded-2xl flex flex-col gap-4 text-right"
              >
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400 font-bold">الرسوم المطلوبة:</span>
                  {isFree ? (
                    <span className="text-xl font-extrabold text-green-600">مجاني بالكامل</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span style={{ color: localText }} className="text-2xl font-black">{course?.final_price || course?.price}</span>
                      <span style={{ color: `rgb(${primaryRgbTriplet})` }} className="text-xs font-bold">{course?.currency || 'SAR'}</span>
                    </div>
                  )}
                </div>

                {!isFree && !course?.is_subscribed && setSelectedPaymentMethod && (
                  <div className="space-y-2">
                    <span className="text-slate-700 font-bold text-xs">اختر وسيلة الدفع:</span>
                    {course.payment_methods && course.payment_methods.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {course.payment_methods.map((pm: any) => (
                          <PaymentMethodCard
                            key={pm.methodId}
                            id={pm.methodId}
                            name={pm.methodName}
                            type={pm.type}
                            isSelected={selectedPaymentMethod?.methodId === pm.methodId}
                            onSelect={() => setSelectedPaymentMethod(pm)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-[9px] text-gray-400 font-bold">لا تتوفر وسائل دفع مفعلة.</p>
                      </div>
                    )}
                  </div>
                )}

                {course?.is_subscribed ? (
                  <button 
                    onClick={onSubscribe} 
                    style={{ backgroundColor: `rgb(${primaryRgbTriplet})` }}
                    className="w-full py-3 text-white rounded-xl font-bold text-sm shadow-md hover:brightness-95 transition-all flex items-center justify-center gap-2"
                  >
                    ابدأ التعلم الآن ←
                  </button>
                ) : (
                  <button 
                    onClick={onSubscribe}
                    disabled={isSubscribing}
                    style={{ backgroundColor: `rgb(${primaryRgbTriplet})` }}
                    className="w-full py-3 disabled:opacity-75 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-95"
                  >
                    {isSubscribing ? 'جاري التحميل...' : 'سجل الآن في الدورة ←'}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
