import React from 'react';
import { Star, Quote, Pen, Trash2, Plus } from 'lucide-react';
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
  const isTemplate1 = templateId === 'template_1' || templateId === 'Modern Course';
  
  if (!data || !data.showSection) return null;

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

  if (isTemplate1) {
    return (
      <section 
        style={sectionStyle}
        className={twMerge(
          "section py-16 text-right relative group border-b",
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

        <div className="container max-w-[1120px] mx-auto px-4">
          <div className="text-center mb-10">
            <span 
              style={{ color: `rgb(${primaryRgbTriplet})` }}
              className="eyebrow inline-flex items-center gap-2 font-black text-xs uppercase tracking-wide"
            >
              ✦ &nbsp;آراء خريجينا
            </span>
            <h2 style={{ color: localText }} className="section-title text-2xl md:text-3xl font-extrabold mt-2 mb-4">
              {data.title || 'ماذا يقول طلابنا عن تجربتهم؟'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                style={{ backgroundColor: '#FBF7EE', borderColor: '#F1E8D6' }}
                className="border rounded-3xl p-6 relative flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="absolute top-4 left-6 text-[#C9A24B]/15">
                  <Quote size={40} />
                </div>

                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} size={14} fill="#C9A24B" color="#C9A24B" />
                    ))}
                  </div>

                  <p style={{ color: '#22302B' }} className="text-xs md:text-sm font-medium leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-900/5">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-200">
                    {rev.avatar ? (
                      <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-500 bg-slate-100">
                        {rev.name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <h4 style={{ color: '#0D3B33' }} className="font-extrabold text-xs">{rev.name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold">{rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Template 2 Layout (Blue theme)
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
        <div className="text-right mb-10">
          <h2 
            style={{ color: localText, borderRightColor: `rgb(${primaryRgbTriplet})` }}
            className="text-2xl md:text-3xl font-black border-r-[6px] pr-4 leading-none"
          >
            {data.title || 'آراء المشتركين'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div 
              key={rev.id} 
              style={{ backgroundColor: '#ffffff', borderColor: `rgba(${textRgb}, 0.08)` }}
              className="p-6 rounded-2xl border flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex gap-0.5">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} size={12} fill={`rgb(${primaryRgbTriplet})`} color={`rgb(${primaryRgbTriplet})`} />
                  ))}
                </div>
                <p style={{ color: `rgba(${textRgb}, 0.85)` }} className="text-xs md:text-sm leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-slate-200">
                  {rev.avatar ? (
                    <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-400 bg-slate-150">
                      {rev.name?.[0]}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <h4 style={{ color: localText }} className="font-extrabold text-xs">{rev.name}</h4>
                  <span className="text-[9px] text-slate-400 font-bold">{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
