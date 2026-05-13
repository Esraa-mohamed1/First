'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Play, Pause, SkipForward, SkipBack, Settings, Maximize, Minimize, 
  Volume2, VolumeX, ListVideo, Search, ChevronDown, ChevronUp,
  PlayCircle, FileText, Menu, X, ArrowRight, ArrowLeft, Trophy, Star,
  Download, MessageSquare, Info, StickyNote, ThumbsUp, MessageCircle,
  Clock, CheckCircle2, Lock, AlertCircle, Pencil, Trash2
} from 'lucide-react';
import { 
  getMyCourseDetails, 
  trackLessonProgress, 
  addLessonNote, 
  addLessonComment, 
  likeComment,
  getLessonNotes,
  getLessonComments,
  updateLessonNote,
  deleteLessonNote,
  updateLessonComment,
  deleteLessonComment
} from '@/services/student-courses';
import { getLessonVideoSrc } from '@/lib/lesson-video-src';
import { usePlayerStore } from '@/hooks/usePlayerStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Lottie from 'lottie-react';
import _ from 'lodash';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Mock animation - in real app would use a proper completion lottie
const completionAnimation = {
  v: "5.5.7", fr: 30, ip: 0, op: 60, w: 100, h: 100, nm: "Success", ddd: 0, assets: [], layers: []
};

interface Note {
  id: number | string;
  user_id: number;
  lesson_id: number;
  body: string;
  video_time: number | null;
  created_at: string;
  updated_at: string;
  votes?: number; // Keep for UI if backend adds it later
}

interface Comment {
  id: number | string;
  body: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    profile_image: string | null;
  };
  likes_count: number;
  is_liked?: boolean;
  replies: Comment[];
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Note & Comment States
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

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
      if (seconds <= 0) return; // Don't sync 0 or negative seconds unless explicitly needed

      // Persist locally first
      const localData = JSON.parse(localStorage.getItem(storageKey) || '{}');
      localData[lessonId] = seconds;
      localStorage.setItem(storageKey, JSON.stringify(localData));
      
      await trackLessonProgress(id as string, lessonId, seconds);
    } catch (e) {
      console.error('Sync failed', e);
    }
  }, 5000), [id, storageKey]);

  // Handle video events from iframe/player
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle progress from Bunny Stream iframe
      if (typeof event.data === 'string' && event.data.includes('player:')) {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'player:timeupdate' && currentLesson) {
            const seconds = Math.floor(data.data.currentTime);
            if (!isNaN(seconds)) {
              setCurrentTime(seconds);
              syncProgress(Number(currentLesson.id), seconds);
            }
          }
        } catch (e) {
          // Not a JSON message or not from Bunny
        }
      }
 
      if (event.data.type === 'video-progress' && currentLesson) {
        const seconds = Math.floor(event.data.seconds);
        if (!isNaN(seconds)) {
          setCurrentTime(seconds);
          syncProgress(Number(currentLesson.id), seconds);
          
          // Completion logic
          if (event.data.isEnd) {
            setShowCompletion(true);
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentLesson, syncProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchInteractions = useCallback(async () => {
    if (!currentLesson) return;
    try {
      const [notesRes, commentsRes] = await Promise.all([
        getLessonNotes(currentLesson.id),
        getLessonComments(currentLesson.id)
      ]);
      setNotes(notesRes.data || []);
      setComments(commentsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch interactions:', err);
    }
  }, [currentLesson]);

  // Fetch Lesson Interactions (Notes, Comments)
  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !currentLesson) return;
    
    try {
      await addLessonNote(currentLesson.id, newNote, currentTime);
      await fetchInteractions();
      setNewNote('');
      MySwal.fire({
        icon: 'success',
        title: 'تم إضافة الملاحظة بنجاح',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (err) {
      console.error('Failed to add note:', err);
      MySwal.fire({
        icon: 'error',
        title: 'فشل إضافة الملاحظة'
      });
    }
  };

  const handleEditNote = async (note: Note) => {
    const { value: text } = await MySwal.fire({
      title: 'تعديل الملاحظة',
      input: 'textarea',
      inputLabel: 'محتوى الملاحظة',
      inputValue: note.body,
      showCancelButton: true,
      confirmButtonText: 'حفظ',
      cancelButtonText: 'إلغاء',
      inputValidator: (value) => {
        if (!value) {
          return 'يجب كتابة شيء ما!';
        }
      }
    });

    if (text && currentLesson) {
      try {
        await updateLessonNote(currentLesson.id, note.id, text, note.video_time || 0);
        await fetchInteractions();
        MySwal.fire({
          icon: 'success',
          title: 'تم تحديث الملاحظة',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } catch (err) {
        console.error('Failed to update note:', err);
        MySwal.fire({
          icon: 'error',
          title: 'فشل تحديث الملاحظة'
        });
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: "لن تتمكن من التراجع عن هذا!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذفها!',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed && currentLesson) {
      try {
        await deleteLessonNote(currentLesson.id, noteId);
        await fetchInteractions();
        MySwal.fire(
          'تم الحذف!',
          'تم حذف الملاحظة بنجاح.',
          'success'
        );
      } catch (err) {
        console.error('Failed to delete note:', err);
        MySwal.fire({
          icon: 'error',
          title: 'فشل حذف الملاحظة'
        });
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentLesson) return;

    try {
      await addLessonComment(currentLesson.id, newComment, replyingTo?.id);
      await fetchInteractions();
      setReplyingTo(null);
      setNewComment('');
      MySwal.fire({
        icon: 'success',
        title: 'تم نشر التعليق',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (err) {
      console.error('Failed to add comment:', err);
      MySwal.fire({
        icon: 'error',
        title: 'فشل نشر التعليق'
      });
    }
  };

  const handleEditComment = async (comment: Comment) => {
    const { value: text } = await MySwal.fire({
      title: 'تعديل التعليق',
      input: 'textarea',
      inputLabel: 'محتوى التعليق',
      inputValue: comment.body,
      showCancelButton: true,
      confirmButtonText: 'حفظ',
      cancelButtonText: 'إلغاء',
      inputValidator: (value) => {
        if (!value) {
          return 'يجب كتابة شيء ما!';
        }
      }
    });

    if (text && currentLesson) {
      try {
        await updateLessonComment(currentLesson.id, comment.id, text);
        await fetchInteractions();
        MySwal.fire({
          icon: 'success',
          title: 'تم تحديث التعليق',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } catch (err) {
        console.error('Failed to update comment:', err);
        MySwal.fire({
          icon: 'error',
          title: 'فشل تحديث التعليق'
        });
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم حذف هذا التعليق نهائياً!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed && currentLesson) {
      try {
        await deleteLessonComment(currentLesson.id, commentId);
        await fetchInteractions();
        MySwal.fire(
          'تم الحذف!',
          'تم حذف التعليق.',
          'success'
        );
      } catch (err) {
        console.error('Failed to delete comment:', err);
        MySwal.fire({
          icon: 'error',
          title: 'فشل حذف التعليق'
        });
      }
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentLesson) return;
    try {
      await likeComment(currentLesson.id, commentId);
      await fetchInteractions();
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  // Fetch Lesson Interactions (Notes, Comments)
  useEffect(() => {
    const fetchInteractions = async () => {
      if (!currentLesson) return;
      try {
        const [notesRes, commentsRes] = await Promise.all([
          getLessonNotes(currentLesson.id),
          getLessonComments(currentLesson.id)
        ]);
        setNotes(notesRes.data || []);
        setComments(commentsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch interactions:', err);
      }
    };
    fetchInteractions();
  }, [currentLesson]);

  // Sidebar Auto-scroll logic
  useEffect(() => {
    if (currentLesson) {
      const el = document.getElementById(`lesson-${currentLesson.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentLesson]);

  const activeVideoSrc = useMemo(() => {
    if (!currentLesson) return '';
    const src = getLessonVideoSrc(currentLesson as Record<string, unknown>);
    if (!src) return '';
    
    // Append pullData=true to enable message events from Bunny Player
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}pullData=true`;
  }, [currentLesson]);

  const handleNextLesson = async () => {
    if (!currentLesson || !course) return;
    
    try {
      // Re-fetch course details to get latest progress
      const data = await getMyCourseDetails(id as string);
      setCourseData(data);
      const updatedCourse = data?.course ?? data;
      const updatedChapters = updatedCourse?.chapters || [];
      
      const allLessons = updatedChapters.flatMap((c: any) => c.lessons || []);
      const currentIndex = allLessons.findIndex((l: any) => l.id === currentLesson.id);
      
      if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
        setCurrentLesson(allLessons[currentIndex + 1]);
      } else {
        MySwal.fire({
          icon: 'info',
          title: 'هذا هو الدرس الأخير في الدورة',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (err) {
      console.error('Failed to fetch updated course data for next lesson:', err);
    }
  };

  const handleToggleComplete = async () => {
    if (!currentLesson || !course) return;
    try {
      const isCurrentlyCompleted = (currentLesson as any).is_completed;
      
      // If we are marking as complete, send 'completed' event
      const events = isCurrentlyCompleted ? ['play', 'pause', 'seek', 'end'] : ['play', 'pause', 'seek', 'end', 'completed'];
      
      await trackLessonProgress(id as string, Number(currentLesson.id), isCurrentlyCompleted ? 0 : 999999, events);
      
      // Update local state
      const updatedChapters = chapters.map((c: any) => ({
        ...c,
        lessons: c.lessons?.map((l: any) => l.id === currentLesson.id ? { ...l, is_completed: !isCurrentlyCompleted } : l)
      }));
      setCourseData({ ...courseData, chapters: updatedChapters });
      
      MySwal.fire({
        icon: 'success',
        title: isCurrentlyCompleted ? 'تم إلغاء إكمال الدرس' : 'تم إكمال الدرس بنجاح!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (err) {
      console.error('Failed to toggle completion:', err);
    }
  };

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

  return (
    <div className="flex flex-col font-sans" dir="rtl">
      <div className="flex flex-1 relative min-h-[calc(100vh-80px)]">
        {/* Sidebar - Lesson Content */}
        <aside className={cn(
          "fixed top-20 bottom-0 right-0 z-40 w-full lg:w-[350px] bg-white border-l border-gray-100 flex flex-col transition-transform duration-300 shadow-xl lg:shadow-none",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-black text-gray-900">محتوى الدورة</h3>
               <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-100 rounded-2xl transition-colors">
                 <X size={20} className="text-gray-500" />
               </button>
             </div>
             <div className="relative">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="ابحث عن درس..."
                 className="w-full bg-gray-100/80 border border-gray-200 rounded-[20px] py-3.5 pr-11 pl-4 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-500"
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
                                 {(lesson.is_completed || lesson.progresses?.[0]?.is_completed) && <CheckCircle2 size={12} className="text-green-500" />}
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

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 flex flex-col bg-[#F8FAFC] transition-all duration-300 overflow-y-auto custom-scrollbar",
          isSidebarOpen ? "lg:pr-[350px]" : "pr-0"
        )}>
          {/* Sub-Header with Progress & Title */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
             <div className="flex items-center gap-6">
                <button onClick={() => router.push('/student/courses')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                  <ArrowRight size={24} />
                </button>
                <div className="h-6 w-px bg-gray-200" />
                <h1 className="font-black text-sm md:text-base text-gray-900 truncate max-w-[300px]">{course.title}</h1>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                   <div className="flex items-center gap-2">
                     <Trophy size={16} className="text-yellow-500" />
                     <span className="text-xs font-bold text-gray-600">تقدمك: 45%</span>
                   </div>
                   <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                     <div className="w-[45%] h-full bg-blue-600 rounded-full" />
                   </div>
                </div>
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-100">
                  مشاركة الشهادة
                </button>
             </div>
          </div>

          <div className="max-w-6xl mx-auto w-full p-6 lg:p-10 space-y-8">
            {/* Top Action Buttons & Lesson Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
               <div className="space-y-3 flex-1">
                 <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-full">محاضرة مميزة</span>
                    <span className="text-[10px] font-bold text-gray-400">تم التحديث: {currentLesson?.updated_at ? new Date(currentLesson.updated_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }) : '24 أكتوبر 2023'}</span>
                 </div>
                 <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                    {currentLesson?.title || 'جاري التحميل...'}
                 </h2>
                 <div className="text-gray-500 font-bold text-sm leading-relaxed max-w-3xl">
                    {(() => {
                      const description = currentLesson?.description 
                        ? currentLesson.description.replace(/<[^>]*>/g, '')
                        : (course?.description ? course.description.replace(/<[^>]*>/g, '') : 'في هذا الدرس، سنستكشف كيفية توظيف أدوات الذكاء الاصطناعي في صياغة خطط الدروس، إنشاء الأنشطة التفاعلية، وتصميم اختبارات تقييم مخصصة لمستويات الطلاب المختلفة.');
                      
                      const shouldTruncate = description.length > 150;
                      const displayDescription = (shouldTruncate && !showFullDescription) 
                        ? description.substring(0, 150) + '...' 
                        : description;

                      return (
                        <>
                          <span>{displayDescription}</span>
                          {shouldTruncate && (
                            <button 
                              onClick={() => setShowFullDescription(!showFullDescription)}
                              className="text-blue-600 mr-2 hover:underline focus:outline-none"
                            >
                              {showFullDescription ? 'عرض أقل' : 'اقرأ المزيد'}
                            </button>
                          )}
                        </>
                      );
                    })()}
                 </div>
               </div>
               <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0">
                  <button 
                    onClick={handleToggleComplete}
                    className={cn(
                      "flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-50",
                      (currentLesson as any)?.is_completed ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    <CheckCircle2 size={18} />
                    <span>{(currentLesson as any)?.is_completed ? 'تم إكمال الدرس' : 'إكمال الدرس'}</span>
                  </button>
                  <button 
                    onClick={handleNextLesson}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#5EEAD4] hover:bg-[#2DD4BF] text-[#0F766E] rounded-2xl font-black text-sm transition-all shadow-lg shadow-teal-50"
                  >
                    <span>الدرس التالي</span>
                    <ArrowLeft size={18} />
                  </button>
               </div>
            </div>

            {/* Video Player Section - Smaller and Styled */}
            <div className="bg-white p-4 rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
               <div className="relative aspect-video bg-black rounded-[32px] overflow-hidden group select-none shadow-2xl">
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
                      <p className="font-bold text-sm max-w-md">لا يوجد رابط تشغيل صالح لهذا الدرس.</p>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4">
                    <PlayCircle size={80} className="text-blue-500 animate-pulse" />
                    <p className="font-black text-xl">اختر درساً لبدء رحلتك</p>
                  </div>
                )}
               </div>
            </div>

            {/* Resources Section */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3 text-gray-900 font-black">
                    <Download size={20} className="text-teal-600" />
                    <h3>مصادر تعليمية للتحميل</h3>
                 </div>
               </div>
               
               {(currentLesson as any)?.attachments && (currentLesson as any).attachments.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(currentLesson as any).attachments.map((resource: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[24px] border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group">
                         <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600")}>
                               <FileText size={24} />
                            </div>
                            <div className="text-right">
                               <h4 className="text-sm font-black text-gray-900 mb-1">{resource.title || 'مرفق تعليمي'}</h4>
                               <p className="text-[10px] font-bold text-gray-400 uppercase">{resource.type || 'FILE'} • {resource.size || '---'}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-10 bg-gray-50/50 rounded-[24px] border border-dashed border-gray-200">
                    <AlertCircle size={32} className="text-gray-300 mb-3" />
                    <p className="text-gray-400 font-bold text-sm">لا توجد مرفقات تعليمية متاحة لهذا الدرس حالياً.</p>
                 </div>
               )}
            </div>

            {/* Interaction Section (Tabs) */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
               <div className="flex items-center justify-center border-b border-gray-50 px-8 shrink-0">
                  {[
                    { id: 'comments', label: 'نقاش الدرس' },
                    { id: 'notes', label: 'الملاحظات' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "px-10 py-6 font-black text-sm transition-all relative",
                        activeTab === tab.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div layoutId="activeTabUI" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                      )}
                    </button>
                  ))}
               </div>

               <div className="flex-1 p-8 lg:p-12">
                  <AnimatePresence mode="wait">
                    {activeTab === 'comments' && (
                      <motion.div 
                        key="comments_ui" 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                      >
                         {/* Styled Comment Input */}
                         <div className="max-w-3xl mx-auto bg-gray-50/50 p-8 rounded-[32px] border border-gray-50 relative">
                            {replyingTo && (
                              <div className="mb-4 flex items-center justify-between bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                                <span className="text-xs font-bold text-blue-700">
                                  أنت تقوم بالرد على <strong>{replyingTo.user?.name}</strong>
                                </span>
                                <button onClick={() => setReplyingTo(null)} className="text-blue-600 hover:text-blue-800 p-1">
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                            <div className="flex gap-5">
                               <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xl shrink-0 overflow-hidden shadow-inner">
                                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                               </div>
                               <textarea
                                 value={newComment}
                                 onChange={(e) => setNewComment(e.target.value)}
                                 placeholder={replyingTo ? "اكتب ردك هنا..." : "أضف تعليقاً أو استفساراً..."}
                                 className="flex-1 bg-transparent border-none text-sm font-bold text-gray-700 placeholder-gray-400 outline-none resize-none min-h-[100px]"
                               />
                            </div>
                            <div className="flex justify-start mt-4 pr-16">
                               <button 
                                 onClick={handleAddComment}
                                 disabled={!newComment.trim()}
                                 className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                               >
                                 {replyingTo ? "نشر الرد" : "نشر التعليق"}
                               </button>
                            </div>
                         </div>

                         {/* Comments List */}
                         <div className="max-w-3xl mx-auto space-y-8">
                            <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                               <h4 className="font-black text-gray-900">آخر التعليقات ({comments.length})</h4>
                               <button className="text-xs font-black text-blue-600 flex items-center gap-1">
                                  <span>الأحدث أولاً</span>
                                  <ChevronDown size={14} />
                               </button>
                            </div>

                            <div className="space-y-10">
                              {comments.map(comment => (
                                <div key={comment.id} className="flex gap-5 group">
                                  <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shrink-0 shadow-sm">
                                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.name || 'User'}`} alt="avatar" />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                       <h4 className="font-black text-sm text-gray-900">{comment.user?.name || 'طالب درب'}</h4>
                                       <span className="text-[10px] font-bold text-gray-400">{new Date(comment.created_at).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                    <div className="text-gray-600 text-sm font-bold leading-relaxed">
                                       <ReactMarkdown>{comment.body}</ReactMarkdown>
                                    </div>
                                    <div className="flex items-center gap-6 pt-2">
                                      <button 
                                        onClick={() => handleLikeComment(String(comment.id))}
                                        className={cn(
                                          "flex items-center gap-1.5 transition-colors",
                                          (comment as any).is_liked ? "text-blue-600" : "text-gray-400 hover:text-blue-600"
                                        )}
                                      >
                                        <ThumbsUp size={16} fill={(comment as any).is_liked ? "currentColor" : "none"} />
                                        <span className="text-[10px] font-black">{(comment as any).likes_count || 0} إعجاب</span>
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setReplyingTo(comment);
                                          document.querySelector('textarea')?.focus();
                                        }}
                                        className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                      >
                                        <ArrowLeft size={16} className="rotate-180" />
                                        <span className="text-[10px] font-black">رد</span>
                                      </button>
                                      
                                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                        <button onClick={() => handleEditComment(comment)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={14} /></button>
                                        <button onClick={() => handleDeleteComment(String(comment.id))} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                      </div>
                                    </div>
                                    
                                    {/* Replies Rendering */}
                                    {comment.replies && comment.replies.length > 0 && (
                                      <div className="mt-6 space-y-6 pr-10 border-r-2 border-gray-50">
                                         {comment.replies.map(reply => (
                                           <div key={reply.id} className="flex gap-4 group/reply">
                                              <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user?.name || 'User'}`} alt="avatar" />
                                              </div>
                                              <div className="flex-1 space-y-1">
                                                 <div className="flex items-center justify-between">
                                                    <h5 className="font-black text-xs text-gray-900">{reply.user?.name || 'طالب درب'}</h5>
                                                    <span className="text-[9px] font-bold text-gray-400">{new Date(reply.created_at).toLocaleDateString('ar-EG')}</span>
                                                 </div>
                                                 <div className="text-gray-600 text-xs font-bold leading-relaxed">
                                                    {reply.body}
                                                 </div>
                                              </div>
                                           </div>
                                         ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                         </div>
                      </motion.div>
                    )}

                    {activeTab === 'notes' && (
                      <motion.div 
                        key="notes_ui"
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto space-y-10"
                      >
                         <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100/50 space-y-4">
                           <textarea
                             value={newNote}
                             onChange={(e) => setNewNote(e.target.value)}
                             placeholder="اكتب ملاحظة ذكية عند هذه اللحظة..."
                             className="w-full bg-white border border-gray-100 rounded-2xl p-5 font-bold text-sm outline-none focus:border-blue-400 transition-all min-h-[120px] shadow-sm"
                           />
                           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                             <div className="flex items-center gap-2 text-blue-600 font-black text-sm bg-blue-100/50 px-4 py-2 rounded-2xl w-full sm:w-auto justify-center">
                               <Clock size={16} />
                               <span>{formatTime(currentTime)}</span>
                             </div>
                             <button 
                               onClick={handleAddNote}
                               disabled={!newNote.trim()}
                               className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 w-full sm:w-auto"
                             >
                               حفظ الملاحظة
                             </button>
                           </div>
                         </div>

                         <div className="space-y-6">
                           {notes.map(note => (
                             <div key={note.id} className="group bg-white p-6 rounded-[24px] border border-gray-50 hover:border-blue-100 transition-all shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                  <button className="flex items-center gap-2 text-blue-600 font-black text-xs bg-blue-50 px-3 py-1.5 rounded-xl">
                                    <PlayCircle size={16} fill="currentColor" />
                                    <span>{formatTime(note.video_time || 0)}</span>
                                  </button>
                                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditNote(note)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={14} /></button>
                                    <button onClick={() => handleDeleteNote(String(note.id))} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                  </div>
                                </div>
                                <div className="text-gray-700 font-bold text-sm leading-relaxed">{note.body}</div>
                             </div>
                           ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </main>

        {/* Floating Sidebar Toggle (Mobile) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "fixed bottom-8 left-8 z-[60] w-14 h-14 bg-gray-900 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 lg:hidden",
            isSidebarOpen ? "translate-x-0" : "translate-x-0"
          )}
        >
          {isSidebarOpen ? <X size={24} /> : <ListVideo size={24} />}
        </button>

        {/* Floating Desktop Sidebar Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "hidden lg:flex fixed bottom-10 left-10 z-[60] w-14 h-14 bg-white text-gray-900 border border-gray-100 rounded-2xl shadow-2xl items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
            isSidebarOpen ? "translate-x-0" : "translate-x-0"
          )}
        >
          {isSidebarOpen ? <ArrowLeft size={24} /> : <ListVideo size={24} />}
        </button>

        {/* Urgent Help Button (Bottom Left) */}
        <button className="fixed bottom-8 right-8 z-[60] flex items-center gap-3 px-6 py-3 bg-[#065F46] text-white rounded-2xl font-black text-sm shadow-2xl shadow-emerald-900/20 hover:scale-105 transition-all">
           <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">?</div>
           <span>مساعدة فورية</span>
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        
        @media print { body { display: none !important; } }
        ::selection { background: #3B82F6; color: white; }
      `}</style>
    </div>
  );
}
