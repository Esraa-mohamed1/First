'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, CheckCircle2, Lock, Clock, 
  ChevronRight, ListVideo, Search
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

  return (
    <div className="flex flex-col h-full bg-gray-950/50 backdrop-blur-xl border-l border-white/5">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ListVideo className="w-5 h-5 text-blue-500" />
            Course Content
          </h3>
          <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-white/40 uppercase tracking-widest">
            {lessons.length} Lessons
          </span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Search lessons..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
        {lessons.map((lesson, index) => {
          const isActive = lesson.id === currentLessonId;
          const isLocked = lesson.isLocked;
          const isCompleted = lesson.isCompleted;

          return (
            <motion.button
              key={lesson.id}
              whileHover={!isLocked ? { x: 4 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              onClick={() => !isLocked && setCurrentLesson(lesson)}
              disabled={isLocked}
              className={cn(
                "w-full flex items-start gap-4 p-4 rounded-2xl transition-all text-left group relative overflow-hidden",
                isActive 
                  ? "bg-blue-600/10 border border-blue-500/20" 
                  : "hover:bg-white/5 border border-transparent",
                isLocked && "opacity-50 grayscale cursor-not-allowed"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                />
              )}

              <div className="relative flex-shrink-0 mt-1">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  </div>
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-white/20" />
                ) : (
                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                    isActive ? "border-blue-500 bg-blue-500" : "border-white/20"
                  )}>
                    <Play className={cn(
                      "w-2.5 h-2.5 fill-current",
                      isActive ? "text-white" : "text-white/40"
                    )} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-white/30 uppercase">Lesson {index + 1}</span>
                  {isLocked && <span className="text-[10px] font-bold text-blue-400 uppercase">Premium</span>}
                </div>
                <h4 className={cn(
                  "text-sm font-semibold truncate transition-colors",
                  isActive ? "text-white" : "text-white/60 group-hover:text-white"
                )}>
                  {lesson.title}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-white/30 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </span>
                  {isCompleted && (
                    <span className="text-green-500/80 font-bold uppercase tracking-tighter">Completed</span>
                  )}
                </div>
              </div>

              {!isLocked && (
                <ChevronRight className={cn(
                  "w-4 h-4 mt-auto mb-auto transition-all",
                  isActive ? "text-blue-500" : "text-white/10 group-hover:text-white/30"
                )} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-6 bg-white/[0.02] border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white/40">Overall Progress</span>
          <span className="text-xs font-bold text-blue-500">65%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
          />
        </div>
      </div>
    </div>
  );
};
