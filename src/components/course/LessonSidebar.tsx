'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, CheckCircle2, Lock, Clock, 
  ChevronRight, ListVideo, Search, ChevronDown,
  PlayCircle, FileText, HelpCircle, MonitorPlay,
  Map, Flag, Star, Trophy, Rocket
} from 'lucide-react';
import { Lesson } from '@/types/course';
import { usePlayerStore } from '@/hooks/usePlayerStore';
import { cn } from '@/lib/utils';

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({ lessons, currentLessonId }) => {
  const { setCurrentLesson } = usePlayerStore();
  const [expandedUnits, setExpandedUnits] = useState<number[]>([1, 2]);

  const toggleUnit = (id: number) => {
    setExpandedUnits(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Simulate chapters for primary school
  const chapters = [
    { 
      id: 1, 
      title: 'الفصل الأول: البداية الرائعة', 
      icon: Rocket,
      color: 'blue',
      lessons: lessons.slice(0, 3) 
    },
    { 
      id: 2, 
      title: 'الفصل الثاني: استكشاف المهارات', 
      icon: Map,
      color: 'amber',
      lessons: lessons.slice(3) 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar Header */}
      <div className="p-10 border-b-2 border-slate-50 bg-[#F8FBFF]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Flag className="w-6 h-6 text-white" />
            </div>
            خريطة الرحلة
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-slate-400 uppercase">المستوى</span>
            <span className="text-lg font-black text-blue-600">الأول</span>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input 
            type="text" 
            placeholder="ابحث عن محطة محددة..."
            className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] py-4 pl-12 pr-6 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-blue-400 transition-all shadow-sm font-bold"
          />
        </div>
      </div>

      {/* Chapters List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="border-b-2 border-slate-50 last:border-0">
            <button 
              onClick={() => toggleUnit(chapter.id)}
              className="w-full flex items-center justify-between p-8 hover:bg-slate-50/50 transition-colors text-right group"
            >
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 shadow-sm",
                  expandedUnits.includes(chapter.id) 
                    ? "bg-slate-900 border-slate-900 text-white" 
                    : "bg-white border-slate-100 text-slate-400 group-hover:border-blue-200"
                )}>
                  <chapter.icon className={cn("w-6 h-6 transition-transform", expandedUnits.includes(chapter.id) ? "scale-110" : "")} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">{chapter.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{chapter.lessons.length} محطات</span>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">فصل نشط</span>
                  </div>
                </div>
              </div>
              <ChevronDown className={cn("w-5 h-5 text-slate-300 transition-transform", expandedUnits.includes(chapter.id) ? "rotate-180" : "")} />
            </button>

            <AnimatePresence>
              {expandedUnits.includes(chapter.id) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-[#FBFDFF]"
                >
                  <div className="px-6 pb-6 space-y-2">
                    {chapter.lessons.map((lesson, idx) => {
                      const isActive = lesson.id === currentLessonId;
                      const isLocked = lesson.isLocked;
                      const isCompleted = lesson.isCompleted;

                      return (
                        <motion.button
                          key={lesson.id}
                          whileHover={!isLocked ? { scale: 1.02, x: 5 } : {}}
                          whileTap={!isLocked ? { scale: 0.98 } : {}}
                          onClick={() => !isLocked && setCurrentLesson(lesson)}
                          disabled={isLocked}
                          className={cn(
                            "w-full flex items-start gap-5 p-5 rounded-[2rem] transition-all text-left relative overflow-hidden",
                            isActive 
                              ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30 ring-4 ring-blue-600/10" 
                              : "hover:bg-white hover:shadow-lg border-2 border-transparent",
                            isLocked && "opacity-40 grayscale cursor-not-allowed bg-slate-50"
                          )}
                        >
                          <div className="relative flex-shrink-0 mt-1">
                            {isCompleted ? (
                              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center border-2", isActive ? "border-white/40 bg-white/20" : "bg-green-50 border-green-100")}>
                                <CheckCircle2 className={cn("w-4 h-4", isActive ? "text-white" : "text-green-500")} />
                              </div>
                            ) : isLocked ? (
                              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                                <Lock className="w-4 h-4 text-slate-400" />
                              </div>
                            ) : (
                              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center border-2", isActive ? "bg-white/20 border-white/40" : "bg-blue-50 border-blue-100")}>
                                <MonitorPlay className={cn("w-4 h-4", isActive ? "text-white" : "text-blue-600")} />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className={cn("text-[10px] font-black uppercase tracking-widest", isActive ? "text-white/60" : "text-slate-400")}>
                                محطة {idx + 1}
                              </span>
                              {isActive && (
                                <motion.span 
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                  className="bg-white/20 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1"
                                >
                                  <Star size={8} fill="currentColor" />
                                  أنت هنا الآن
                                </motion.span>
                              )}
                            </div>
                            <h4 className={cn(
                              "text-base font-black truncate transition-colors",
                              isActive ? "text-white" : "text-slate-800"
                            )}>
                              {lesson.title}
                            </h4>
                            <div className={cn("flex items-center gap-4 mt-2 text-[10px] font-bold", isActive ? "text-white/50" : "text-slate-400")}>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {lesson.duration} دقيقة
                              </span>
                              {isCompleted && !isActive && (
                                <span className="text-green-500 font-black uppercase flex items-center gap-1">
                                  <Trophy size={10} />
                                  مكتمل!
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Playful Footer */}
      <div className="p-10 bg-[#F8FBFF] border-t-2 border-slate-50">
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-400 uppercase">مستوى ذكائك</span>
            <span className="text-xl font-black text-slate-900">البطل الذكي</span>
          </div>
          <div className="w-16 h-16 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center shadow-sm">
            <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
          </div>
        </div>
        <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden p-1 border-2 border-white shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          />
        </div>
      </div>
    </div>
  );
};
