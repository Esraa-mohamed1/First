'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Play, Pause, SkipForward, SkipBack, Settings, Maximize, Minimize, 
  Volume2, VolumeX, ListVideo, Search, ChevronDown, ChevronUp,
  PlayCircle, FileText, Menu, X, ArrowRight, ArrowLeft, Trophy, Star,
  Download, MessageSquare, Info, StickyNote, ThumbsUp, MessageCircle,
  Clock, CheckCircle2, Lock, AlertCircle
} from 'lucide-react';
import { getMyCourseDetails } from '@/services/student-courses';
import { getLessonVideoSrc } from '@/lib/lesson-video-src';
import { usePlayerStore } from '@/hooks/usePlayerStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Lottie from 'lottie-react';
import _ from 'lodash';

// Mock animation - in real app would use a proper completion lottie
const completionAnimation = {
  v: "5.5.7", fr: 30, ip: 0, op: 60, w: 100, h: 100, nm: "Success", ddd: 0, assets: [], layers: []
};

interface Note {
  id: string;
  lessonId: number;
  content: string;
  timestamp: number;
  votes: number;
  userId: string;
  userName: string;
  createdAt: string;
}

interface Comment {
  id: string;
  lessonId: number;
  content: string;
  userId: string;
  userName: string;
  replies: Comment[];
  createdAt: string;
}

export default function CoursePlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // States
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'notes' | 'comments'>('about');
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Note & Comment States
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  // Video Ref & Player Store
  const videoRef = useRef<HTMLIFrameElement>(null);
  const { currentLesson, setCurrentLesson, playbackSpeed, setPlaybackSpeed } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState(0);

  // Persistence Logic
  const storageKey = useMemo(() => `tracking_${id}`, [id]);

  // Fetch Course Details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMyCourseDetails(id as string);
        setCourseData(data);

        const course = data?.course ?? data;
        if (course.chapters?.length > 0) {
          setExpandedChapters([course.chapters[0].id]);
          
          const firstLesson = course.chapters[0].lessons?.[0];
          
          if (firstLesson) {
            // Check if current lesson belongs to this course ID
            // We use the course ID from the URL as a more reliable source
            const lessonInCourse = currentLesson && course.chapters.some((c: any) => 
              c.lessons?.some((l: any) => l.id === currentLesson.id)
            );

            if (!currentLesson || !lessonInCourse) {
              setCurrentLesson(firstLesson);
            }
          }
        }
      } catch (err: any) {
        setError('Failed to load course content.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch(e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          // Toggle play logic would go here if using native video
          break;
        case 'f':
          // Toggle fullscreen
          break;
        case 'm':
          // Toggle mute
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tracking & Sync Logic
  const syncProgress = useCallback(_.debounce(async (lessonId: number, seconds: number) => {
    try {
      // Persist locally first
      const localData = JSON.parse(localStorage.getItem(storageKey) || '{}');
      localData[lessonId] = seconds;
      localStorage.setItem(storageKey, JSON.stringify(localData));

      // Batch send to backend via existing my-courses endpoint
      // Using the JSON key watched_seconds as required
      await fetch(`/api/student/my-courses/${id}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          watched_seconds: seconds,
          events: ['play', 'pause', 'seek', 'end'] // Tracked event types
        })
      });
    } catch (e) {
      console.error('Sync failed', e);
    }
  }, 5000), [id, storageKey]);

  // Handle video events from iframe/player
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // In a real implementation with a library like @vimeo/player or similar
      // we would listen for specific player events. 
      // This is a placeholder for the logic required.
      if (event.data.type === 'video-progress' && currentLesson) {
        const seconds = Math.floor(event.data.seconds);
        setCurrentTime(seconds);
        syncProgress(Number(currentLesson.id), seconds);
        
        // Completion logic
        if (event.data.isEnd) {
          setShowCompletion(true);
          // Auto-mark as complete logic here
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentLesson, syncProgress]);

  // Sidebar Auto-scroll logic
  useEffect(() => {
    if (currentLesson) {
      const el = document.getElementById(`lesson-${currentLesson.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentLesson]);

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-bold">جاري تحميل تجربة التعلم...</p>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertCircle className="text-red-500 w-14 h-14" />
        <p className="text-gray-800 font-bold max-w-md">{error}</p>
        <button
          type="button"
          onClick={() => router.push('/student/courses')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm"
        >
          العودة إلى دوراتي
        </button>
      </div>
    );
  }

  const course = courseData?.course ?? courseData;
  const chapters = course?.chapters || [];

  if (!course || (!chapters.length && !course.title)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertCircle className="text-amber-500 w-14 h-14" />
        <p className="text-gray-800 font-bold">تعذر عرض هذه الدورة. قد يكون الرابط غير صحيح أو البيانات غير متوفرة.</p>
        <button
          type="button"
          onClick={() => router.push('/student/courses')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm"
        >
          العودة إلى دوراتي
        </button>
      </div>
    );
  }

  const activeVideoSrc = currentLesson ? getLessonVideoSrc(currentLesson as Record<string, unknown>) : '';

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans overflow-hidden" dir="rtl">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-[#1C1D1F] text-white flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/student/courses')} className="hover:text-blue-400 transition-colors">
            <ArrowRight size={24} />
          </button>
          <div className="h-6 w-px bg-gray-700" />
          <h1 className="font-black text-sm md:text-base truncate max-w-[300px]">{course.title}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
             <div className="flex items-center gap-2">
               <Trophy size={16} className="text-yellow-500" />
               <span className="text-xs font-bold text-gray-300">تقدمك: 45%</span>
             </div>
             <div className="w-32 h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
               <div className="w-[45%] h-full bg-blue-500" />
             </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-black transition-all">
            مشاركة الشهادة
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content Area */}
        <main className={cn(
          "flex-1 flex flex-col bg-white transition-all duration-300 overflow-hidden",
          isSidebarOpen ? "lg:pl-[350px]" : "pl-0"
        )}>
          {/* Video Player Container */}
          <div className="relative aspect-video bg-black group select-none">
            {currentLesson ? (
              activeVideoSrc ? (
                <iframe
                  ref={videoRef}
                  src={activeVideoSrc}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media; picture-in-picture"
                  title={currentLesson.title}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white gap-3 px-6 text-center">
                  <AlertCircle size={48} className="text-amber-400" />
                  <p className="font-bold text-sm max-w-md">
                    لا يوجد رابط تشغيل صالح لهذا الدرس. تأكد من حقل embed أو video_url في الـ API، أو من إعداد NEXT_PUBLIC_BUNNY_LIBRARY_ID إذا كنت تستخدم video_id فقط.
                  </p>
                </div>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4">
                <PlayCircle size={80} className="text-blue-500 animate-pulse" />
                <p className="font-black text-xl">اختر درساً لبدء رحلتك</p>
              </div>
            )}
            
            {/* Recording Denial Overlay Logic (CSS-based placeholder) */}
            <div className="absolute inset-0 pointer-events-none opacity-0 select-none user-select-none" style={{ background: 'transparent' }}>
               {/* Anti-recording dynamic watermark would be rendered here */}
            </div>
          </div>

          {/* Player Controls & Info Tabs */}
          <div className="flex-1 flex flex-col overflow-hidden">
             {/* Tabs Header */}
             <div className="flex border-b border-gray-100 px-10 gap-10 shrink-0">
               {[
                 { id: 'about', label: 'عن الدرس', icon: Info },
                 { id: 'notes', label: 'ملاحظاتي', icon: StickyNote },
                 { id: 'comments', label: 'النقاشات', icon: MessageSquare },
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={cn(
                     "flex items-center gap-2 py-5 font-black text-sm transition-all relative",
                     activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
                   )}
                 >
                   <tab.icon size={18} />
                   <span>{tab.label}</span>
                   {activeTab === tab.id && (
                     <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                   )}
                 </button>
               ))}
             </div>

             {/* Tab Content Area */}
             <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {activeTab === 'about' && (
                    <motion.div 
                      key="about" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-black text-gray-900">{currentLesson?.title}</h2>
                      <div className="prose prose-blue max-w-none">
                        <div 
                          className="text-gray-600 leading-relaxed ql-editor !p-0"
                          dangerouslySetInnerHTML={{ __html: currentLesson?.description || course.description }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'notes' && (
                    <motion.div 
                      key="notes"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                        <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="أضف ملاحظة عند هذه اللحظة..."
                          className="w-full bg-white border border-gray-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-blue-400 transition-all min-h-[100px]"
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-blue-600 font-black text-sm bg-blue-50 px-3 py-1.5 rounded-xl">
                            <Clock size={16} />
                            <span>04:20</span>
                          </div>
                          <button className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-100">
                            حفظ الملاحظة
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {notes.length === 0 ? (
                          <div className="text-center py-20 text-gray-400 font-bold italic">لا توجد ملاحظات بعد.</div>
                        ) : (
                          notes.map(note => (
                            <div key={note.id} className="group border-b border-gray-50 pb-6 last:border-0">
                               <div className="flex items-start justify-between mb-3">
                                 <button className="flex items-center gap-2 text-blue-600 font-black text-xs hover:bg-blue-50 px-2 py-1 rounded-lg transition-all">
                                   <PlayCircle size={14} fill="currentColor" />
                                   <span>{note.timestamp}</span>
                                 </button>
                                 <div className="flex items-center gap-4">
                                   <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                                     <ThumbsUp size={14} />
                                     <span className="text-[10px] font-bold">{note.votes}</span>
                                   </button>
                                 </div>
                               </div>
                               <div className="text-gray-700 font-bold text-sm leading-relaxed">{note.content}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'comments' && (
                    <motion.div 
                      key="comments"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-10"
                    >
                       <div className="flex gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shrink-0">أ</div>
                         <div className="flex-1 space-y-3">
                           <textarea
                             value={newComment}
                             onChange={(e) => setNewComment(e.target.value)}
                             placeholder="اطرح سؤالاً أو ابدأ نقاشاً (يدعم Markdown)..."
                             className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-5 font-bold text-sm outline-none focus:border-blue-400 transition-all resize-none min-h-[120px]"
                           />
                           <div className="flex justify-end">
                             <button className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:scale-105 transition-all">
                               نشر التعليق
                             </button>
                           </div>
                         </div>
                       </div>

                       <div className="space-y-8">
                         {/* Threaded Comments Rendering Logic */}
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </main>

        {/* Udemy-Style Chapter Sidebar */}
        <aside className={cn(
          "fixed top-20 bottom-4 left-4 z-40 w-full lg:w-[350px] bg-white border border-gray-100 flex flex-col transition-transform duration-500 rounded-[32px] shadow-2xl shadow-gray-200/50",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-[-120%]"
        )}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-black text-gray-900">محتوى الدورة</h3>
               <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white rounded-xl shadow-sm">
                 <X size={20} className="text-gray-400" />
               </button>
             </div>
             <div className="relative">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="ابحث عن درس..."
                 className="w-full bg-white border border-gray-200 rounded-2xl py-3 pr-10 pl-4 text-xs font-bold outline-none focus:border-blue-300 transition-all"
               />
             </div>
          </div>

          {/* Chapters List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             {chapters.map((chapter: any, idx: number) => (
               <div key={chapter.id} className="border-b border-gray-50 last:border-0">
                 <button 
                   onClick={() => setExpandedChapters(prev => prev.includes(chapter.id) ? prev.filter(c => c !== chapter.id) : [...prev, chapter.id])}
                   className={cn(
                     "w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-all text-right",
                     expandedChapters.includes(chapter.id) && "bg-gray-50"
                   )}
                 >
                   <div className="flex-1 min-w-0">
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">الفصل {idx + 1}</p>
                     <h4 className="text-sm font-black text-gray-900 truncate">{chapter.title}</h4>
                   </div>
                   {expandedChapters.includes(chapter.id) ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                 </button>

                 <AnimatePresence>
                   {expandedChapters.includes(chapter.id) && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }} 
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden bg-white"
                     >
                       {chapter.lessons?.map((lesson: any) => {
                         const isActive = currentLesson?.id === lesson.id;
                         return (
                           <button
                             id={`lesson-${lesson.id}`}
                             key={lesson.id}
                             onClick={() => setCurrentLesson(lesson)}
                             className={cn(
                               "w-full p-4 px-6 flex items-start gap-4 transition-all text-right group border-r-4",
                               isActive ? "bg-blue-50/50 border-blue-600" : "hover:bg-gray-50 border-transparent"
                             )}
                           >
                             <div className={cn(
                               "mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all",
                               isActive ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-300 group-hover:border-blue-400"
                             )}>
                               {isActive ? <Play size={10} fill="currentColor" /> : <Play size={10} />}
                             </div>
                             <div className="flex-1 min-w-0">
                               <h5 className={cn(
                                 "text-xs font-bold truncate mb-1 transition-colors",
                                 isActive ? "text-blue-600" : "text-gray-700 group-hover:text-blue-500"
                               )}>
                                 {lesson.title}
                               </h5>
                               <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                                 <span className="flex items-center gap-1"><Clock size={10} /> {lesson.duration || '10:00'}</span>
                                 {lesson.progresses?.[0]?.is_completed && <CheckCircle2 size={12} className="text-green-500" />}
                               </div>
                             </div>
                           </button>
                         );
                       })}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ))}
          </div>
        </aside>

        {/* Sidebar Toggle Button (Floating) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "fixed bottom-10 left-10 z-[60] w-14 h-14 bg-gray-900 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
            isSidebarOpen ? "lg:translate-x-[350px]" : "translate-x-0"
          )}
        >
          {isSidebarOpen ? <X size={24} /> : <ListVideo size={24} />}
        </button>
      </div>

      {/* Completion Overlay */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-[40px] p-12 max-w-lg w-full text-center space-y-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600" />
               <div className="w-32 h-32 mx-auto">
                 <Lottie animationData={completionAnimation} loop={false} />
               </div>
               <div className="space-y-2">
                 <h2 className="text-3xl font-black text-gray-900">مبروك! لقد أتممت الدورة</h2>
                 <p className="text-gray-500 font-bold">لقد أصبحت الآن خبيراً في {course.title}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:brightness-110 transition-all">
                    عرض الشهادة
                  </button>
                  <button onClick={() => setShowCompletion(false)} className="py-4 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all">
                    إغلاق
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
        
        /* Recording Denial Placeholder */
        @media print {
          body { display: none !important; }
        }
        
        ::selection {
          background: #3B82F6;
          color: white;
        }
      `}</style>
    </div>
  );
}
