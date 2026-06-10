'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight,
  Menu, X, Home, Trophy, Star, Sparkles, BookOpen, Rocket
} from 'lucide-react';
import Lottie from 'lottie-react';
import { VideoPlayer } from '@/components/course/VideoPlayer';
import { LessonSidebar } from '@/components/course/LessonSidebar';
import { LessonContent } from '@/components/course/LessonContent';
import { MOCK_COURSE } from '@/data/mockCourse';
import { usePlayerStore } from '@/hooks/usePlayerStore';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function LessonPage() {
  const {
    currentLesson, setCurrentLesson,
    isSidebarOpen, toggleSidebar
  } = usePlayerStore();
  const [showCelebration, setShowCelebration] = useState(false);
  const [rocketData, setRocketData] = useState<any>(null);

  useEffect(() => {
    if (!currentLesson) {
      setCurrentLesson(MOCK_COURSE.lessons[0]);
    }
    // Fetch a nice rocket animation for the celebration
    fetch('https://lottie.host/80e15967-b508-410a-8e2b-f8f4116d97c6/g7G8yvN0z6.json')
      .then(res => res.json())
      .then(data => setRocketData(data))
      .catch(err => console.error('Failed to load rocket animation:', err));
  }, [currentLesson, setCurrentLesson]);

  const handleComplete = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);
  };

  if (!currentLesson) return null;

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-slate-800 selection:bg-blue-500/10 font-medium">
      {/* Immersive Celebration Overlay (Drawn on Screen) */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none overflow-hidden"
          >
            {/* Darkened Backdrop for better readability */}
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" />

            {/* Drawing Canvas Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
              {/* Drawing Text SVG */}
              <svg width="800" height="200" viewBox="0 0 800 200" className="drop-shadow-[0_10px_30px_rgba(59,130,246,0.4)]">
                <motion.text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  initial={{ strokeDasharray: 1000, strokeDashoffset: 1000, fill: "rgba(255, 255, 255, 0)" }}
                  animate={{
                    strokeDashoffset: 0,
                    fill: "rgba(255, 255, 255, 1)",
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    fill: { delay: 1.5, duration: 0.5 }
                  }}
                  className="text-8xl font-black"
                  style={{
                    stroke: "#1e40af",
                    strokeWidth: "2px",
                    fontFamily: "system-ui, sans-serif"
                  }}
                >
                  أحسنت يا بطل!
                </motion.text>
              </svg>
            </div>

            {/* Flying Rocket - Launches AFTER text is drawn */}
            <motion.div
              initial={{ y: 500, x: -200, scale: 0, rotate: -20, opacity: 0 }}
              animate={{ y: 0, x: 0, scale: 1.2, rotate: 0, opacity: 1 }}
              transition={{
                duration: 1.5,
                delay: 2.5 + Math.random() * 1.5,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="w-[400px] h-[400px] relative z-30"
            >
              {rocketData ? (
                <Lottie animationData={rocketData} loop={true} className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Rocket size={150} className="text-blue-500 animate-bounce" />
                </div>
              )}
            </motion.div>

            {/* Sparkles and Stars "Drawn" around */}
            <div className="absolute inset-0 z-10">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    x: Math.random() * 1200 - 600,
                    y: Math.random() * 800 - 400
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 2.5 + Math.random() * 1.5,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute left-1/2 top-1/2"
                >
                  <Star size={Math.random() * 30 + 10} className="text-amber-400" fill="currentColor" />
                </motion.div>
              ))}
            </div>

            {/* Full Screen Confetti/Sparkles Effect */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-full h-full bg-gradient-to-t from-blue-500/10 via-transparent to-purple-500/10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simplified Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b-2 border-slate-100">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/student/dashboard" className="w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all shadow-sm">
              <Home size={24} />
            </Link>

            <div className="hidden md:block">
              <h1 className="text-lg font-black text-slate-900 flex items-center gap-3">
                <span className="w-2.5 h-8 bg-blue-500 rounded-full" />
                {MOCK_COURSE.title}
              </h1>
              <p className="text-[10px] font-black text-slate-400 mt-0.5 mr-5">{currentLesson.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border-2 border-white shadow-inner">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200" />
                  <motion.circle
                    initial={{ strokeDashoffset: 132 }}
                    animate={{ strokeDashoffset: 132 - (132 * 65) / 100 }}
                    cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={132} className="text-green-500" strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[8px] font-black text-slate-900">65%</span>
              </div>
              <p className="text-[10px] font-black text-slate-900 pr-1">تقدمك</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center p-0.5 overflow-hidden shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="Hero" className="w-full h-full object-cover rounded-xl" />
              </div>
              <button
                onClick={toggleSidebar}
                className="p-3 bg-slate-900 text-white hover:bg-blue-600 rounded-xl transition-all md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex relative h-[calc(100vh-80px)] overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1000px] mx-auto p-4 md:p-8 space-y-8">

            {/* Player Section */}
            <section className="space-y-8">
              <motion.div className="rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-blue-900/5 border-2 border-white p-1">
                <VideoPlayer
                  src={currentLesson.videoUrl || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"}
                  userEmail="hero@tiqnia.academy"
                />
              </motion.div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-lg shadow-slate-200/20">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-wider">تشاهد الآن</span>
                    <h2 className="text-2xl font-black text-slate-900">
                      {currentLesson.title}
                    </h2>
                  </div>
                  <p className="text-slate-400 text-sm font-bold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    {MOCK_COURSE.title}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleComplete}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                >
                  <Trophy className="w-5 h-5" />
                  أكملت الدرس!
                </motion.button>
              </div>

              {/* Simple Navigation */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-4 p-6 bg-white border-2 border-slate-50 rounded-[2rem] hover:border-amber-400 hover:bg-amber-50/30 transition-all group shadow-sm">
                  <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-600" />
                  <span className="text-sm font-black text-slate-900">الدرس السابق</span>
                </button>

                <button className="flex items-center justify-center gap-4 p-6 bg-white border-2 border-slate-50 rounded-[2rem] hover:border-blue-400 hover:bg-blue-50/30 transition-all group shadow-sm">
                  <span className="text-sm font-black text-slate-900">الدرس التالي</span>
                  <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600" />
                </button>
              </div>
            </section>

            {/* Lesson Content Section */}
            <section className="pb-20">
              <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-lg shadow-slate-200/10 overflow-hidden">
                <LessonContent lesson={currentLesson} />
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <motion.aside
          animate={{ width: isSidebarOpen ? 420 : 0, opacity: isSidebarOpen ? 1 : 0 }}
          className="hidden md:block border-l-2 border-slate-50 bg-white overflow-hidden shadow-2xl"
        >
          <div className="w-[420px] h-full">
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] md:hidden"
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-0 bottom-0 w-[90%] bg-white shadow-2xl rounded-l-[3rem]"
              >
                <div className="flex items-center justify-between p-8 border-b-2 border-slate-50">
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-amber-400" />
                    خريطتنا التعليمية
                  </h3>
                  <button onClick={toggleSidebar} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl">
                    <X className="w-7 h-7 text-slate-400" />
                  </button>
                </div>
                <div className="h-[calc(100vh-100px)]">
                  <LessonSidebar lessons={MOCK_COURSE.lessons} currentLessonId={currentLesson.id} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
