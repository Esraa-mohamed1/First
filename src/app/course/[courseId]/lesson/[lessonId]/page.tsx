'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Share2, 
  MoreVertical, ShieldCheck, BarChart3, 
  Menu, X, Keyboard
} from 'lucide-react';
import { VideoPlayer } from '@/components/course/VideoPlayer';
import { LessonSidebar } from '@/components/course/LessonSidebar';
import { LessonContent } from '@/components/course/LessonContent';
import { MOCK_COURSE } from '@/data/mockCourse';
import { usePlayerStore } from '@/hooks/usePlayerStore';
import { cn } from '@/lib/utils';

export default function LessonPage() {
  const { 
    currentLesson, setCurrentLesson, 
    isSidebarOpen, toggleSidebar 
  } = usePlayerStore();

  useEffect(() => {
    // Initialize with first lesson if none selected
    if (!currentLesson) {
      setCurrentLesson(MOCK_COURSE.lessons[0]);
    }
  }, [currentLesson, setCurrentLesson]);

  if (!currentLesson) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Background Cinematic Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-white/60" />
            </button>
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-white truncate max-w-[300px]">
                {MOCK_COURSE.title}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-blue-500 uppercase">Lesson {MOCK_COURSE.lessons.indexOf(currentLesson) + 1}</span>
                <span className="text-[10px] font-medium text-white/30">•</span>
                <span className="text-[10px] font-medium text-white/30 truncate max-w-[200px]">{currentLesson.title}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Protected Stream</span>
            </div>
            
            <div className="h-6 w-px bg-white/10 mx-2" />
            
            <button className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/60 hover:text-white group relative">
              <Keyboard className="w-5 h-5" />
              <span className="absolute top-full right-0 mt-2 px-2 py-1 bg-gray-900 border border-white/10 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Shortcuts (K)
              </span>
            </button>
            
            <button 
              onClick={toggleSidebar}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex relative h-[calc(100vh-64px)] overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            
            {/* Player Section */}
            <section className="space-y-6">
              <VideoPlayer 
                src={currentLesson.videoUrl} 
                userEmail="student@example.com" 
              />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      {currentLesson.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase">
                      {currentLesson.duration}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm font-medium flex items-center gap-2">
                    Part of <span className="text-white/70">{MOCK_COURSE.title}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-bold hover:bg-blue-500 hover:text-white transition-all duration-300">
                    <BarChart3 className="w-4 h-4" />
                    Complete Lesson
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                      <Share2 className="w-5 h-5 text-white/60" />
                    </button>
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                      <MoreVertical className="w-5 h-5 text-white/60" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lesson Navigation */}
              <div className="flex items-center justify-between py-6 border-y border-white/5">
                <button className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-all">
                    <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-bold text-white/20 uppercase">Previous</p>
                    <p className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">Setup Environment</p>
                  </div>
                </button>

                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex flex-col items-end">
                    <p className="text-[10px] font-bold text-white/20 uppercase text-right">Up Next</p>
                    <p className="text-xs font-bold text-white/60">Advanced Styling</p>
                  </div>
                  <button className="flex items-center gap-3 group">
                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] font-bold text-blue-500 uppercase">Next Lesson</p>
                      <p className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">Advanced Styling</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </button>
                </div>
              </div>
            </section>

            {/* Lesson Info Section */}
            <section className="pb-20">
              <LessonContent lesson={currentLesson} />
            </section>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ 
            width: isSidebarOpen ? 400 : 0,
            opacity: isSidebarOpen ? 1 : 0
          }}
          className="hidden md:block border-l border-white/5 bg-gray-950/20 backdrop-blur-sm overflow-hidden"
        >
          <div className="w-[400px]">
            <LessonSidebar lessons={MOCK_COURSE.lessons} currentLessonId={currentLesson.id} />
          </div>
        </motion.aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-gray-950 shadow-2xl"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <h3 className="font-bold">Course Content</h3>
                  <button onClick={toggleSidebar} className="p-2 hover:bg-white/5 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="h-[calc(100vh-64px)]">
                  <LessonSidebar lessons={MOCK_COURSE.lessons} currentLessonId={currentLesson.id} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Hint */}
      <div className="fixed bottom-6 left-6 z-40 hidden lg:block">
        <div className="px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Session Protected
        </div>
      </div>
    </div>
  );
}
