import React, { useState } from 'react';
import { Star, Quote, Pen } from 'lucide-react';
import { ReviewsSectionData } from '../types/landing';
import { twMerge } from 'tailwind-merge';
import { colorToRgbTriplet } from '../utils/color';

interface ReviewsSectionProps {
  data: ReviewsSectionData;
  templateId: string;
  isEditable: boolean;
  onEdit: () => void;
}

export default function ReviewsSection({
  data,
  templateId,
  isEditable,
  onEdit,
}: ReviewsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);






  if (!data || !data.showSection) return null;

  const isTemplate1 = templateId === 'template_1' || templateId === 'Modern Course';

  // Custom colors parsing
  const defaultBg = isTemplate1 ? '#ffffff' : '#ffffff';
  const defaultText = isTemplate1 ? '#0D3B33' : '#1f2937';

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

  const reviews = data.items || [];
  const screenshots = data.screenshots || [];
  const reviewType = data.reviewType || 'carousel';

  // 1. Manual Review Card Renderer
  const renderManualReviewCard = (rev: any) => {
    return (
      <div
        key={rev.id}
        style={{ backgroundColor: '#ffffff', borderColor: '#F1E8D6' }}
        className="border border-[#F1E8D6] rounded-3xl p-6 relative flex flex-col justify-between hover:shadow-md transition-shadow text-right"
      >
        <div className="absolute top-4 left-6 text-[#C9A24B]/15">
          <Quote size={40} />
        </div>

        <div className="space-y-4">
          <div className="flex gap-1 justify-start">
            {[...Array(Number(rev.rating || 5))].map((_, idx) => (
              <Star key={idx} size={14} fill="#C9A24B" color="#C9A24B" />
            ))}
          </div>

          <p style={{ color: '#22302B' }} className="text-xs md:text-sm font-medium leading-relaxed">
            «{rev.comment}»
          </p>
        </div>

        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-900/5">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-200">
            {rev.avatar ? (
              <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-500 bg-slate-100">
                {rev.name?.[0] || 'ط'}
              </div>
            )}
          </div>
          <div className="text-right">
            <h4 style={{ color: '#0D3B33' }} className="font-extrabold text-xs">{rev.name}</h4>
            <span className="text-[10px] text-slate-400 font-bold">{rev.role}</span>
          </div>
        </div>
      </div>
    );
  };

  // 2. WhatsApp Mock Chat Card Renderer
  const renderWhatsAppMockCard = (rev: any) => {
    return (
      <div
        key={rev.id}
        style={{
          backgroundColor: '#EFE7DB',
          borderColor: '#F1E8D6',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cg fill=\'%23d8ccb8\' fill-opacity=\'.25\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1.5\'/%3E%3Ccircle cx=\'40\' cy=\'30\' r=\'1.5\'/%3E%3Ccircle cx=\'20\' cy=\'48\' r=\'1.5\'/%3E%3C/g%3E%3C/svg%3E")'
        }}
        className="border border-[#F1E8D6] rounded-3xl p-5 flex flex-col gap-2.5 justify-center text-right bg-repeat w-full"
      >
        <div className="flex items-center gap-2 text-[11px] text-slate-500 border-b border-dashed border-[#d5c9b4] pb-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#1FA855]"></span>
          <span>{rev.waSenderName || 'واتساب — رسالة من مشتركة'}</span>
        </div>

        {rev.waBubble1In && (
          <div className="max-w-[88%] rounded-2xl px-3.5 py-2 text-[11px] md:text-xs leading-relaxed shadow-sm relative bg-white self-start rounded-tr-none text-slate-800 flex flex-col">
            <span>{rev.waBubble1In}</span>
            <time className="text-[8px] text-slate-400 self-end mt-1">{rev.waBubble1Time || '9:42 م'} ✓✓</time>
          </div>
        )}

        {rev.waBubble2Out && (
          <div className="max-w-[88%] rounded-2xl px-3.5 py-2 text-[11px] md:text-xs leading-relaxed shadow-sm relative bg-[#DCF3D0] self-end rounded-tl-none text-slate-800 flex flex-col">
            <span>{rev.waBubble2Out}</span>
            <time className="text-[8px] text-slate-400 self-end mt-1">{rev.waBubble2Time || '9:45 م'}</time>
          </div>
        )}

        {rev.waBubble3In && (
          <div className="max-w-[88%] rounded-2xl px-3.5 py-2 text-[11px] md:text-xs leading-relaxed shadow-sm relative bg-white self-start rounded-tr-none text-slate-800 flex flex-col">
            <span>{rev.waBubble3In}</span>
            <time className="text-[8px] text-slate-400 self-end mt-1">{rev.waBubble3Time || '9:46 م'} ✓✓</time>
          </div>
        )}
      </div>
    );
  };

  // 3. Screenshot/Image Card Renderer
  const renderScreenshotImageCard = (rev: any) => {
    return (
      <div
        key={rev.id}
        className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative aspect-[16/9] max-w-lg mx-auto w-full group/item"
      >
        <img
          src={rev.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200'}
          alt={rev.name || 'لقطة شاشة الرأي'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
        />
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== 'undefined') {
                const imgWindow = window.open();
                if (imgWindow) imgWindow.document.write(`<img src="${rev.image}" style="max-width:100%; max-height:98vh; display:block; margin:auto;" />`);
              }
            }}
            className="bg-white/95 hover:bg-white text-slate-900 px-4 py-2 rounded-full font-black text-[10px] transition-colors shadow-lg cursor-pointer"
          >
            تكبير الصورة 🔍
          </button>
        </div>
      </div>
    );
  };

  // Legacy full screenshots layout
  if (reviewType === 'screenshots') {
    return (
      <section
        style={sectionStyle}
        className={twMerge(
          "py-16 text-right relative group border-b border-slate-100",
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
            تعديل قسم الآراء
          </button>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span
              style={{ color: `rgb(${primaryRgbTriplet})` }}
              className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-wide px-3 py-1 bg-blue-50 text-blue-600 rounded-full"
            >
              ✦ &nbsp;آراء وتجارب المشتركين
            </span>
            <h2 style={{ color: localText }} className="text-2xl md:text-3xl font-black mt-3">
              {data.title || 'تجارب نجاح ونتائج طلابنا'}
            </h2>
          </div>

          {screenshots.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 font-bold text-xs">
              ⚠️ لم يتم رفع لقطات شاشة بعد. يمكنك رفع لقطات شاشة من لوحة التعديل الجانبية.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto justify-center">
              {screenshots.map((src, idx) => (
                <div
                  key={idx}
                  className="group/item relative rounded-3xl overflow-hidden border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 aspect-[9/16] max-w-[280px] w-full mx-auto"
                >
                  <img
                    src={src}
                    alt={`رأي الطالب #${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const imgWindow = window.open();
                          if (imgWindow) imgWindow.document.write(`<img src="${src}" style="max-width:100%; max-height:98vh; display:block; margin:auto;" />`);
                        }
                      }}
                      className="bg-white/95 hover:bg-white text-slate-900 px-4 py-2 rounded-full font-black text-[10px] transition-colors shadow-lg cursor-pointer"
                    >
                      تكبير الصورة 🔍
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Carousel layout 
  // Group reviews into pairs of 2 for slides
  const slides: any[][] = [];
  for (let i = 0; i < reviews.length; i += 2) {
    slides.push(reviews.slice(i, i + 2));
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      style={sectionStyle}
      className={twMerge(
        "py-16 text-right relative group border-b border-slate-100",
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
          تعديل قسم الآراء
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span
            style={{ color: `rgb(${primaryRgbTriplet})` }}
            className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-wide px-3 py-1 bg-blue-50 text-blue-600 rounded-full"
          >
            ✦ &nbsp;آراء المشتركين الحقيقية
          </span>
          <h2 style={{ color: localText }} className="text-2xl md:text-3xl font-black mt-3">
            {data.title || 'ماذا يقول طلابنا عن تجربتهم؟'}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-2">تقييمات مكتوبة ورسائل من واتساب وصلتنا من طلاب الدفعات السابقة</p>
        </div>

        {slides.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 font-bold text-xs">
            ⚠️ لا توجد آراء مضافة حالياً.
          </div>
        ) : (
          <div className="relative max-w-5xl mx-auto">
            {/* Carousel track wrapper */}
            <div className="overflow-hidden w-full relative">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${activeIndex * 100}%)`,
                }}
              >
                {slides.map((slideItems, slideIdx) => (
                  <div key={slideIdx} className="w-full shrink-0 px-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {slideItems.map((item) => {
                        if (item.type === 'whatsapp') {
                          return renderWhatsAppMockCard(item);
                        } else if (item.type === 'image') {
                          return renderScreenshotImageCard(item);
                        } else {
                          return renderManualReviewCard(item);
                        }
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel navigation controls */}
            {slides.length > 1 && (
              <div className="flex items-center justify-center gap-5 mt-8">
                <button
                  onClick={prevSlide}
                  className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 flex items-center justify-center transition-all text-xl shadow-sm active:scale-95 cursor-pointer font-sans"
                  title="الرأي السابق"
                >
                  ‹
                </button>

                <div className="flex gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex
                        ? 'bg-amber-500 w-6'
                        : 'bg-amber-200 w-2 hover:bg-amber-300'
                        }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 flex items-center justify-center transition-all text-xl shadow-sm active:scale-95 cursor-pointer font-sans"
                  title="الرأي التالي"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
