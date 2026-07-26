import React, { useState } from 'react';
import { ChevronDown, Lock, PlayCircle, Play, Pen } from 'lucide-react';
import { ChapterSectionData } from '../types/landing';
import { twMerge } from 'tailwind-merge';
import { colorToRgbTriplet } from '../utils/color';

interface ChapterSectionProps {
  data: ChapterSectionData;
  course: any;
  templateId: string;
  isEditable: boolean;
  onEdit: () => void;
}

export default function ChapterSection({
  data,
  course,
  templateId,
  isEditable,
  onEdit,
}: ChapterSectionProps) {
  const isTemplate1 = templateId === 'template_1' || templateId === 'Modern Course';
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  // Custom colors parsing
  const defaultBg = '#ffffff';
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

  const units = course?.units || course?.chapters || [];
  const filteredUnits = units.filter((u: any) => u && u.title && !u.isPlaceholder);

  if (filteredUnits.length === 0) return null;

  if (isTemplate1) {
    return (
      <section 
        style={sectionStyle}
        className={twMerge(
          "section py-16 text-right relative group",
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
            تعديل قسم المنهج
          </button>
        )}

        <div className="container max-w-[1120px] mx-auto px-4">
          <div className="text-center mb-10">
            <span 
              style={{ color: `rgb(${primaryRgbTriplet})` }}
              className="eyebrow inline-flex items-center gap-2 font-black text-xs uppercase tracking-wide"
            >
              ✦ &nbsp;المنهج الدراسي
            </span>
            <h2 style={{ color: localText }} className="section-title text-2xl md:text-3xl font-extrabold mt-2 mb-4">
              {data.title || 'محتوى الدورة بالتفصيل'}
            </h2>
            <p style={{ color: `rgba(${textRgb}, 0.7)` }} className="section-lead max-w-[640px] mx-auto text-sm">
              أقسام الدورة منظمة بعناية لمساعدتك على التعلم تدريجياً وبطريقة عملية.
            </p>
          </div>

          <div className="max-w-[860px] mx-auto space-y-3">
            {filteredUnits.map((unit: any, idx: number) => {
              const lessons = unit.lessons || [];
              const isExpanded = expandedUnits.includes(unit.id);
              
              return (
                <div 
                  key={unit.id || idx} 
                  style={{ backgroundColor: '#ffffff', borderColor: `rgba(${textRgb}, 0.12)` }}
                  className="border rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => !unit.isLocked && toggleUnit(unit.id)}
                    className="w-full p-5 flex items-center justify-between text-right cursor-pointer bg-none border-none outline-none"
                    disabled={unit.isLocked}
                  >
                    <div className="flex items-center gap-4">
                      <ChevronDown 
                        size={18} 
                        className={twMerge("text-slate-400 transition-transform duration-300", isExpanded ? "rotate-180" : "rotate-0")} 
                      />
                      <span className="text-slate-400 text-xs font-bold">
                        {lessons.length} دروس
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <h3 style={{ color: unit.isLocked ? `rgba(${textRgb}, 0.4)` : localText }} className="text-sm md:text-base font-black">
                        {unit.title}
                      </h3>
                      {unit.isLocked && <Lock size={16} className="text-slate-400" />}
                    </div>
                  </button>

                  {!unit.isLocked && isExpanded && data.showLessons && (
                    <div 
                      style={{ borderTopColor: `rgba(${textRgb}, 0.08)`, backgroundColor: `rgba(${textRgb}, 0.02)` }}
                      className="border-t"
                    >
                      {lessons.length > 0 ? (
                        lessons.map((lesson: any, lIdx: number) => (
                          <div 
                            key={lesson.id || lIdx} 
                            style={{ borderBottomColor: `rgba(${textRgb}, 0.06)` }}
                            className="p-4 px-6 flex items-center justify-between border-b last:border-none"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold text-slate-400">{lesson.duration || '10:00'}</span>
                              {lesson.isPreview && (
                                <span 
                                  style={{ backgroundColor: `rgba(${primaryRgbTriplet}, 0.1)`, color: `rgb(${primaryRgbTriplet})` }}
                                  className="text-[9px] px-2 py-0.5 rounded-full font-black"
                                >
                                  معاينة مجانية
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span style={{ color: `rgba(${textRgb}, 0.85)` }} className="font-bold text-xs md:text-sm">{lesson.title}</span>
                              <div 
                                style={{ backgroundColor: `rgba(${textRgb}, 0.05)`, color: localText }}
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                              >
                                <PlayCircle size={14} />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-400 font-bold">لا يوجد دروس حالياً.</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Template 2 Blue Style
  return (
    <section 
      style={sectionStyle}
      className={twMerge(
        "py-16 text-right relative group",
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
          تعديل قسم المنهج
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <h2 
            style={{ color: localText, borderRightColor: `rgb(${primaryRgbTriplet})` }}
            className="text-2xl md:text-3xl font-black border-r-[6px] pr-4 leading-none"
          >
            {data.title || 'محتوى الدورة'}
          </h2>
          <div style={{ color: `rgba(${textRgb}, 0.6)` }} className="font-bold text-xs md:text-sm">
            {filteredUnits.length} أقسام • {filteredUnits.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0)} درس
          </div>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredUnits.map((unit: any, index: number) => {
            const lessons = unit.lessons || [];
            const isExpanded = expandedUnits.includes(unit.id);
            
            return (
              <div 
                key={unit.id} 
                style={{ 
                  backgroundColor: unit.isLocked ? `rgba(${textRgb}, 0.02)` : '#ffffff', 
                  borderColor: `rgba(${textRgb}, 0.08)` 
                }}
                className={twMerge(
                  "rounded-2xl border overflow-hidden transition-all duration-300",
                  unit.isLocked ? "opacity-60" : "shadow-sm"
                )}
              >
                <button
                  onClick={() => !unit.isLocked && toggleUnit(unit.id)}
                  className="w-full p-5 flex items-center justify-between text-right cursor-pointer bg-none border-none outline-none"
                  disabled={unit.isLocked}
                >
                  <div className="flex items-center gap-4">
                    <ChevronDown 
                      size={18} 
                      className={twMerge("text-slate-400 transition-transform duration-300", isExpanded ? "rotate-180" : "rotate-0")} 
                    />
                    <span className="text-slate-400 text-xs md:text-sm font-bold">
                      {lessons.length} دروس
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <h3 style={{ color: unit.isLocked ? `rgba(${textRgb}, 0.4)` : localText }} className="text-base md:text-lg font-black">
                      {unit.title}
                    </h3>
                    {unit.isLocked && <Lock size={16} className="text-slate-400" />}
                  </div>
                </button>

                {!unit.isLocked && isExpanded && data.showLessons && (
                  <div 
                    style={{ borderTopColor: `rgba(${textRgb}, 0.08)` }}
                    className="border-t bg-white"
                  >
                    {lessons.length > 0 ? (
                      lessons.map((lesson: any) => (
                        <div 
                          key={lesson.id} 
                          style={{ borderBottomColor: `rgba(${textRgb}, 0.06)` }}
                          className="flex items-center justify-between p-4 px-6 md:px-8 hover:bg-slate-50 transition-all group cursor-pointer border-b last:border-none"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-400">{lesson.duration || '10:00'}</span>
                            {lesson.isPreview && (
                              <span 
                                style={{ backgroundColor: `rgba(${primaryRgbTriplet}, 0.1)`, color: `rgb(${primaryRgbTriplet})` }}
                                className="text-[9px] px-2 py-0.5 rounded-full font-black"
                              >
                                معاينة مجانية
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span style={{ color: `rgba(${textRgb}, 0.85)` }} className="font-bold text-sm md:text-base">{lesson.title}</span>
                            <div 
                              style={{ backgroundColor: `rgb(${primaryRgbTriplet})` }}
                              className="w-8 h-8 rounded-full text-white flex items-center justify-center"
                            >
                              <Play size={12} fill="currentColor" className="mr-0.5" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-5 text-center text-slate-400 font-bold text-sm">لا توجد دروس حالياً.</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
