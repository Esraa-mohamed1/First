'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Play, CheckCircle2, Lock, Clock, 
  ChevronRight, ListVideo, Search, ChevronDown,
  PlayCircle, FileText, HelpCircle, MonitorPlay,
  Menu, X, ArrowRight, ArrowLeft, Trophy, Star,
  Download, MessageSquare, Info
} from 'lucide-react';
import { getMyCourseDetails } from '@/services/student-courses';
import { usePlayerStore } from '@/hooks/usePlayerStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoursePlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  
  const { currentLesson, setCurrentLesson } = usePlayerStore();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const data = await getMyCourseDetails(id as string);
        setCourseData(data);
        
        const course = data.course || data;
        
        // Auto-expand first chapter
        if (course.chapters?.length > 0) {
          setExpandedChapters([course.chapters[0].id]);
          
          // Set first lesson as current if none set
          if (!currentLesson && course.chapters[0].lessons?.length > 0) {
            setCurrentLesson(course.chapters[0].lessons[0]);
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch course details:', err);
        setError('حدث خطأ أثناء تحميل بيانات الدورة.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) ? prev.filter(cid => cid !== chapterId) : [...prev, chapterId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold">جاري تحميل محتوى الدورة...</p>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <X size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900">{error || 'لم يتم العثور على الدورة'}</h2>
        <button 
          onClick={() => router.push('/student/courses')}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200"
        >
          العودة لدوراتي
        </button>
      </div>
    );
  }

  // Handle case where course might be nested or direct
  const enrollmentId = courseData.id;
  const courseId = courseData.course_id || courseData.id;
  const course = courseData.course || courseData;
  const chapters = course?.chapters || [];

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col lg:flex-row-reverse font-sans" dir="rtl">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => router.push('/student/courses')} className="p-2 hover:bg-gray-50 rounded-xl">
          <ArrowRight size={20} className="text-gray-600" />
        </button>
        <h1 className="font-black text-gray-900 text-sm truncate max-w-[200px]">{course.title}</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <ListVideo size={20} />
        </button>
      </div>

      {/* Main Player Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Video Container */}
        <div className="w-full bg-black aspect-video relative group">
          {currentLesson ? (
            <iframe
              src={currentLesson.video_url}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4">
              <PlayCircle size={64} className="text-gray-600" />
              <p className="font-bold text-lg text-gray-400">اختر درساً للبدء</p>
            </div>
          )}
        </div>

        {/* Lesson Info */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  الدرس الحالي
                </span>
                <span className="text-gray-400 text-xs font-bold">
                  {currentLesson?.duration || '10:00'} دقيقة
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                {currentLesson?.title || 'مرحباً بك في الدورة'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-1 lg:flex-none px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Download size={18} />
                <span>المرفقات</span>
              </button>
              <button className="flex-1 lg:flex-none px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                <span>اكتمل الدرس</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Tabs / Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-8 border-b border-gray-100">
              <button className="pb-4 border-b-2 border-blue-600 text-blue-600 font-black text-sm">عن الدرس</button>
              <button className="pb-4 border-b-2 border-transparent text-gray-400 font-bold text-sm hover:text-gray-600 transition-all">التعليقات</button>
              <button className="pb-4 border-b-2 border-transparent text-gray-400 font-bold text-sm hover:text-gray-600 transition-all">الأسئلة الشائعة</button>
            </div>

            <div className="prose prose-slate max-w-none">
              <div 
                className="text-gray-600 leading-relaxed font-medium ql-editor !p-0"
                dangerouslySetInnerHTML={{ __html: currentLesson?.description || course.description }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar - Course Content */}
      <aside className={cn(
        "fixed inset-0 lg:relative lg:inset-auto z-[60] lg:z-10 w-full lg:w-[400px] bg-white border-l border-gray-100 flex flex-col transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"
      )}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="space-y-1">
            <h2 className="font-black text-gray-900">محتوى الدورة</h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>{chapters.length} فصول</span>
              <div className="w-1 h-1 rounded-full bg-gray-200" />
              <span className="text-blue-500">مكتمل 25%</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-50 rounded-xl">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Search in Content */}
        <div className="p-4 border-b border-gray-50">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input 
              type="text" 
              placeholder="ابحث عن درس..."
              className="w-full bg-gray-50 border border-transparent rounded-xl py-3 pr-10 pl-4 text-xs text-gray-900 placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-blue-100 transition-all font-bold"
            />
          </div>
        </div>

        {/* Chapters & Lessons List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chapters.map((chapter: any, index: number) => (
            <div key={chapter.id} className="border-b border-gray-50 last:border-0">
              <button 
                onClick={() => toggleChapter(chapter.id)}
                className={cn(
                  "w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all text-right group",
                  expandedChapters.includes(chapter.id) && "bg-gray-50/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all",
                    expandedChapters.includes(chapter.id) 
                      ? "bg-gray-900 text-white" 
                      : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900">{chapter.title}</h4>
                    <span className="text-[10px] font-bold text-gray-400">{chapter.lessons?.length || 0} دروس</span>
                  </div>
                </div>
                <ChevronDown size={16} className={cn("text-gray-300 transition-transform", expandedChapters.includes(chapter.id) ? "rotate-180" : "")} />
              </button>

              <AnimatePresence>
                {expandedChapters.includes(chapter.id) && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white py-2">
                      {chapter.lessons?.map((lesson: any) => {
                        const isActive = currentLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setCurrentLesson(lesson);
                              if (window.innerWidth < 1024) setIsSidebarOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-start gap-4 p-4 px-6 transition-all text-right group",
                              isActive 
                                ? "bg-blue-50/50 border-r-4 border-blue-600" 
                                : "hover:bg-gray-50 border-r-4 border-transparent"
                            )}
                          >
                            <div className={cn(
                              "mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all",
                              isActive 
                                ? "bg-blue-600 text-white" 
                                : "bg-gray-100 text-gray-300 group-hover:bg-gray-200"
                            )}>
                              {isActive ? <Play size={10} fill="currentColor" /> : <Play size={10} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className={cn(
                                "text-xs font-bold truncate mb-1",
                                isActive ? "text-blue-600" : "text-gray-700"
                              )}>
                                {lesson.title}
                              </h5>
                              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                                <span className="flex items-center gap-1">
                                  <Clock size={10} />
                                  {lesson.duration || '10:00'}
                                </span>
                                {lesson.progresses?.[0]?.is_completed && (
                                  <span className="text-green-500 flex items-center gap-1">
                                    <CheckCircle2 size={10} />
                                    مكتمل
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Sidebar Footer - Progress */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-900">تقدمك في الدورة</span>
            <span className="text-xs font-black text-blue-600">25%</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '25%' }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
}
