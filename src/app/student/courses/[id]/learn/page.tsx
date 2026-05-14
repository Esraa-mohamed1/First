'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Play, Pause, SkipForward, SkipBack, Settings, Maximize, Minimize, 
  Volume2, VolumeX, ListVideo, Search, ChevronDown, ChevronUp,
  PlayCircle, FileText, Menu, X, ArrowRight, ArrowLeft, Trophy, Star,
  Download, MessageSquare, Info, StickyNote, ThumbsUp, MessageCircle,
  Clock, CheckCircle2, Lock, AlertCircle, Pencil, Trash2, Bell
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

  // Authorization Check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      document.cookie = `token=${urlToken}; path=/; max-age=86400; SameSite=Lax`;
    }

    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    const localToken = localStorage.getItem('token');
    const token = urlToken || cookieToken || localToken;
    const userInfo = localStorage.getItem('user_info');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // If we have a token but no userInfo, we might want to fetch the profile instead of redirecting
    if (!userInfo) {
      // For now, let's just allow it if there's a token, 
      // as the API calls will fail anyway if the token is invalid.
      // Or we could trigger a profile fetch here.
      console.warn('Token present but user_info missing');
    }
    
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        if (parsedUser.role !== 'student' && parsedUser.role !== 'admin' && parsedUser.role !== 'academy') {
           router.push('/');
        }
      } catch (e) {
        console.error('Failed to parse user info', e);
      }
    }
  }, [router]);

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
    const src = getLessonVideoSrc(currentLesson as any);
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
    <div className="flex flex-col font-sans min-h-screen bg-[#F8FAFC]" dir="rtl">
      {/* Custom Header matching the reference */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
         <div className="flex items-center gap-6">
            <button onClick={() => router.push('/student/courses')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-bold">
              <X size={20} />
              <span className="text-sm">خروج</span>
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="text-xl font-black text-blue-600">Darrab</div>
         </div>
         
         <div className="hidden md:flex flex-col items-center flex-1 max-w-md mx-8">
            <div className="flex items-center justify-between w-full mb-2">
               <span className="text-sm font-black text-gray-900 truncate">{course.title}</span>
               <span className="text-xs font-black text-[#0F766E]">65% مكتمل</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
               <div className="w-[65%] h-full bg-[#0F766E] rounded-full" />
            </div>
         </div>

         <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
               <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
               <Bell size={20} />
            </button>
            <div className="flex items-center gap-3">
               <span className="text-sm font-bold text-gray-700 hidden md:block">أحمد العتيبي</span>
               <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" alt="User" className="w-full h-full object-cover" />
               </div>
            </div>
         </div>
      </header>

      <div className="flex flex-1 relative">
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="إغلاق قائمة الدروس"
            className="fixed inset-0 z-[35] bg-black/45 backdrop-blur-[1px] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar min-w-0">
          <div className="max-w-[min(100%,100rem)] mx-auto w-full p-4 lg:p-8 space-y-8">
            
            <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
              
              {/* Right Sidebar - Curriculum (First in DOM for RTL) */}
              <aside
                className={cn(
                  'flex flex-col bg-transparent lg:bg-white lg:rounded-[32px] lg:shadow-sm overflow-hidden shrink-0',
                  'fixed z-40 w-[min(100%,22rem)] max-h-[min(100dvh-5rem,720px)] top-[4.5rem] bottom-4 right-4 transition-transform duration-300 ease-out shadow-2xl lg:shadow-none',
                  isSidebarOpen ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)] lg:translate-x-0',
                  'lg:static lg:z-0 lg:right-auto lg:top-auto lg:bottom-auto lg:w-[320px] lg:max-h-[min(800px,calc(100dvh-8rem))] lg:sticky lg:top-24'
                )}
              >
                <div className="p-5 lg:px-6 shrink-0 flex items-center gap-3">
                  <ListVideo size={20} className="text-blue-600" />
                  <h3 className="font-black text-gray-900 text-sm">منهج الدورة</h3>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors mr-auto"
                    aria-label="إغلاق القائمة"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-2 pb-4">
                  {chapters.map((chapter: any, idx: number) => (
                    <div key={chapter.id} className="mb-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedChapters((prev) =>
                            prev.includes(chapter.id) ? prev.filter((c) => c !== chapter.id) : [...prev, chapter.id]
                          )
                        }
                        className="w-full p-3 flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-all text-right group"
                      >
                        <h4 className="text-xs font-black text-gray-800 truncate">{chapter.title}</h4>
                        <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                          {expandedChapters.includes(chapter.id) ? (
                            <ChevronUp size={14} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={14} className="text-gray-500" />
                          )}
                        </div>
                      </button>
                      <AnimatePresence>
                        {expandedChapters.includes(chapter.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-1 pl-2 pr-4 space-y-1"
                          >
                            {chapter.lessons?.map((lesson: any) => {
                              const isActive = currentLesson?.id === lesson.id;
                              const isLocked = false; // Add logic if needed
                              return (
                                <button
                                  type="button"
                                  id={`lesson-${lesson.id}`}
                                  key={lesson.id}
                                  onClick={() => {
                                    if (!isLocked) {
                                      setCurrentLesson(lesson);
                                      setIsSidebarOpen(false);
                                    }
                                  }}
                                  className={cn(
                                    'w-full p-3 flex items-center justify-between transition-all text-right rounded-2xl group border border-transparent',
                                    isActive ? 'bg-blue-50/50 border-blue-100 shadow-sm' : 'hover:bg-white hover:shadow-sm hover:border-gray-100'
                                  )}
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                      className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all',
                                        isActive
                                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                          : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                                      )}
                                    >
                                      {isLocked ? <Lock size={12} /> : (lesson.type === 'pdf' ? <FileText size={12} /> : <Play size={12} fill={isActive ? "currentColor" : "none"} />)}
                                    </div>
                                    <h5
                                      className={cn(
                                        'text-xs font-bold truncate transition-colors',
                                        isActive ? 'text-blue-700 font-black' : 'text-gray-600 group-hover:text-gray-900'
                                      )}
                                    >
                                      {lesson.title}
                                    </h5>
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

              {/* Left Content - Video & Details */}
              <div className="flex-1 min-w-0 space-y-6">
                
                {/* Video Player Container */}
                <div className="bg-black rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl relative aspect-video group">
                  {currentLesson ? (
                    activeVideoSrc ? (
                      <iframe
                        ref={videoRef}
                        src={activeVideoSrc}
                        className="w-full h-full border-0"
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

                {/* Lesson Header & Actions */}
                <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-6">
                   <div className="space-y-4 flex-1">
                     <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-full">محاضرة مميزة</span>
                        <span className="text-[10px] font-bold text-gray-400">
                          تم التحديث: {(() => {
                            try {
                              if (currentLesson?.updated_at) {
                                const date = new Date(currentLesson.updated_at);
                                if (!isNaN(date.getTime())) {
                                  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
                                }
                              }
                            } catch (e) {
                              // Fallback if formatting fails
                            }
                            return '24 أكتوبر 2023';
                          })()}
                        </span>
                     </div>
                     <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                        {currentLesson?.title || 'جاري التحميل...'}
                     </h2>
                     <div className="text-gray-500 font-medium text-sm leading-relaxed max-w-3xl">
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
                                  className="text-blue-600 mr-2 hover:underline focus:outline-none font-bold"
                                >
                                  {showFullDescription ? 'عرض أقل' : 'اقرأ المزيد'}
                                </button>
                              )}
                            </>
                          );
                        })()}
                     </div>
                   </div>
                   <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
                      <button 
                        onClick={handleToggleComplete}
                        className={cn(
                          "flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-md",
                          currentLesson?.is_completed ? "bg-blue-800 text-white shadow-blue-900/20" : "bg-blue-700 text-white hover:bg-blue-800 shadow-blue-700/20"
                        )}
                      >
                        <CheckCircle2 size={16} />
                        <span>{currentLesson?.is_completed ? 'إلغاء الإكمال' : 'إكمال الدرس'}</span>
                      </button>
                      <button 
                        onClick={handleNextLesson}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#065F46] rounded-2xl font-black text-xs transition-all shadow-md shadow-emerald-100"
                      >
                        <span>الدرس التالي</span>
                        <ArrowLeft size={16} />
                      </button>
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
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
               <div className="flex items-center justify-center border-b border-gray-100 px-8 shrink-0">
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
                         <div className="max-w-3xl mx-auto bg-gray-100/40 p-8 rounded-[40px] border border-gray-200 relative">
                            {replyingTo && (
                              <div className="mb-4 flex items-center justify-between bg-blue-100/50 px-5 py-3 rounded-[24px] border border-blue-200">
                                <span className="text-xs font-bold text-blue-800">
                                  أنت تقوم بالرد على <strong>{replyingTo.user?.name}</strong>
                                </span>
                                <button onClick={() => setReplyingTo(null)} className="text-blue-700 hover:text-blue-900 p-1 bg-white/50 rounded-full transition-all">
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                            <div className="flex gap-5">
                               <div className="w-12 h-12 rounded-[18px] bg-blue-600 flex items-center justify-center text-white font-black text-xl shrink-0 overflow-hidden shadow-lg shadow-blue-100">
                                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                               </div>
                               <textarea
                                 value={newComment}
                                 onChange={(e) => setNewComment(e.target.value)}
                                 placeholder={replyingTo ? "اكتب ردك هنا..." : "أضف تعليقاً أو استفساراً..."}
                                 className="flex-1 bg-transparent border-none text-sm font-bold text-gray-800 placeholder-gray-500 outline-none resize-none min-h-[100px]"
                               />
                            </div>
                            <div className="flex justify-start mt-4 pr-16">
                               <button 
                                 onClick={handleAddComment}
                                 disabled={!newComment.trim()}
                                 className="px-10 py-3.5 bg-blue-600 text-white rounded-[20px] font-black text-sm shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
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
                         <div className="bg-gray-100/40 p-8 rounded-[40px] border border-gray-200 space-y-5">
                           <textarea
                             value={newNote}
                             onChange={(e) => setNewNote(e.target.value)}
                             placeholder="اكتب ملاحظة ذكية عند هذه اللحظة..."
                             className="w-full bg-white/80 border border-gray-200 rounded-[24px] p-6 font-bold text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all min-h-[140px] shadow-sm text-gray-800 placeholder-gray-500"
                           />
                           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                             <div className="flex items-center gap-2 text-blue-700 font-black text-sm bg-blue-100/50 px-5 py-2.5 rounded-[18px] w-full sm:w-auto justify-center border border-blue-200">
                               <Clock size={16} />
                               <span>{formatTime(currentTime)}</span>
                             </div>
                             <button 
                               onClick={handleAddNote}
                               disabled={!newNote.trim()}
                               className="px-12 py-3.5 bg-blue-600 text-white rounded-[20px] font-black text-sm shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 w-full sm:w-auto"
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
            </div>
          </div>
        </main>

        {/* Open lesson list (mobile only — desktop list is beside the video) */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className={cn(
            'fixed bottom-8 left-8 z-[60] w-14 h-14 bg-gray-900 text-white rounded-2xl shadow-2xl items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95',
            'lg:hidden',
            isSidebarOpen ? 'hidden' : 'flex'
          )}
          aria-label="عرض قائمة الدروس"
        >
          <ListVideo size={24} />
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
