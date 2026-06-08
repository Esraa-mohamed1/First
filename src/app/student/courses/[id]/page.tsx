'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Play, FileText, CheckCircle2, Clock, Award,
  ChevronRight, Star, Calendar,
  ChevronDown, ChevronUp, ShieldCheck,
  Video, Lock, PlayCircle, BookOpen, User, ArrowLeft, ArrowRight
} from 'lucide-react';
import { getMyCourseDetails } from '@/services/student-courses';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

export default function StudentCourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const data = await getMyCourseDetails(id);
        
        // Normalize structure (chapters vs units)
        const normalizedCourse = {
          ...data,
          units: data.units || data.chapters || [],
        };
        
        setCourse(normalizedCourse);
        
        // Expand the first unit by default
        if (normalizedCourse.units && normalizedCourse.units.length > 0) {
          setExpandedUnits([normalizedCourse.units[0].id]);
        }
      } catch (err) {
        console.error('Failed to fetch enrolled course details:', err);
        setError('فشل تحميل تفاصيل الدورة. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(uid => uid !== unitId) : [...prev, unitId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-600 font-bold" dir="rtl">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>جاري تحميل تفاصيل الدورة...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4" dir="rtl">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{error || 'لم يتم العثور على الدورة'}</h3>
        <button
          onClick={() => router.push('/student/courses')}
          className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          العودة إلى دوراتي
        </button>
      </div>
    );
  }

  // Stats calculation
  const totalUnits = course.units?.length || 0;
  const totalLessons = course.units?.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0) || 0;
  const progress = course.progress ?? 0;
  const courseImage = course.image || course.cover_image || course.thumbnail || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200';
  const instructorName = course.instructor_name || course.instructor || 'المدرب المعتمد';

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      {/* Back to courses */}
      <div className="flex justify-start">
        <Link
          href="/student/courses"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm"
        >
          <ArrowRight size={18} />
          <span>العودة إلى دوراتي التعليمية</span>
        </Link>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT COLUMN: Course Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-blue-50 text-blue-600 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-lg border border-blue-100/50">
                  {course.category?.name || course.category || 'عام'}
                </span>
                <span className="bg-green-50 text-green-600 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-lg border border-green-100/50">
                  دورة مفعلة ومقبولة
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-500 font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User size={14} className="text-slate-600" />
                  </div>
                  <span>المدرب: {instructorName}</span>
                </div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-slate-400" />
                  <span>{totalUnits} وحدات • {totalLessons} درس</span>
                </div>
              </div>
            </div>

            {/* Course Progress Section */}
            <div className="pt-6 border-t border-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
                <span className="flex items-center gap-1.5">
                  <PlayCircle size={14} className="text-blue-500" />
                  تقدمك في الدورة
                </span>
                <span className={twMerge(progress === 100 ? 'text-green-600' : 'text-blue-600', 'font-black text-sm')}>
                  {progress}% مكتمل
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 relative overflow-hidden">
                <div
                  className={twMerge(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    progress === 100 ? "bg-green-500" : "bg-blue-500"
                  )}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 border-r-[4px] border-blue-600 pr-3 leading-none">عن هذه الدورة</h2>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm leading-[1.8] text-slate-600 font-medium ql-editor">
              {course.description ? (
                <div dangerouslySetInnerHTML={{ __html: course.description }} />
              ) : (
                <p>لا يوجد وصف متاح لهذه الدورة حالياً.</p>
              )}
            </div>
          </div>

          {/* Course Content / Accordion */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 border-r-[4px] border-blue-600 pr-3 leading-none">محتوى المادة العلمية</h2>
            <div className="space-y-3">
              {course.units && course.units.length > 0 ? (
                course.units.map((unit: any, index: number) => (
                  <div key={unit.id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
                    <button
                      onClick={() => toggleUnit(unit.id)}
                      className={twMerge(
                        "w-full p-6 flex items-center justify-between text-right transition-colors",
                        expandedUnits.includes(unit.id) ? "bg-slate-50/50" : "hover:bg-slate-50/30"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <ChevronDown size={18} className={twMerge("text-slate-400 transition-transform duration-300", expandedUnits.includes(unit.id) ? "rotate-180" : "rotate-0")} />
                        <span className="text-slate-400 text-xs font-bold">
                          {unit.lessons?.length || 0} دروس
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-black flex items-center justify-center border border-slate-200">
                          {index + 1}
                        </span>
                        <h3 className="text-base font-black text-slate-900">{unit.title}</h3>
                      </div>
                    </button>

                    {expandedUnits.includes(unit.id) && (
                      <div className="border-t border-slate-50 bg-white">
                        {unit.lessons && unit.lessons.length > 0 ? (
                          unit.lessons.map((lesson: any, lIndex: number) => (
                            <Link
                              key={lesson.id}
                              href={`/student/courses/${id}/learn`}
                              className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-all group cursor-pointer border-b border-slate-50 last:border-0"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-400">
                                  {lesson.duration ? `${lesson.duration} دقيقة` : 'مسجل'}
                                </span>
                                {lesson.type === 'video' ? (
                                  <Video size={14} className="text-blue-500" />
                                ) : (
                                  <FileText size={14} className="text-amber-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 font-bold">{lIndex + 1}.</span>
                                <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors text-sm">{lesson.title}</span>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="p-5 text-center text-xs text-slate-400 font-bold">لا توجد دروس مضافة في هذه الوحدة بعد.</div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 font-bold">لا يوجد وحدات مضافة بعد.</div>
              )}
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Course Sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Main Action Sidebar */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6 overflow-hidden">
            {/* Image Preview */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
              <img src={courseImage} alt={course.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3 pt-2">
              {progress === 100 ? (
                <>
                  <Link
                    href={`/user/courses/${course.id}/certificate`}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-100 hover:-translate-y-0.5 active:scale-95 text-center text-base"
                  >
                    <Award size={20} />
                    تحميل شهادة الإتمام
                  </Link>
                  <Link
                    href={`/student/courses/${id}/learn`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black py-4 rounded-2xl transition-all border border-slate-100 hover:-translate-y-0.5 active:scale-95 text-center text-base"
                  >
                    مراجعة محتوى الدورة
                  </Link>
                </>
              ) : (
                <Link
                  href={`/student/courses/${id}/learn`}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:scale-95 text-center text-base group"
                >
                  <span>متابعة التعلم</span>
                  <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* Course Features */}
            <div className="pt-6 border-t border-slate-50 space-y-4">
              <h4 className="font-black text-slate-800 text-sm">مميزات اشتراكك:</h4>
              <div className="space-y-3">
                {[
                  { text: "وصول كامل ودائم لمحتوى الدورة", icon: PlayCircle },
                  { text: "شهادة إتمام معتمدة بعد إكمال الدروس", icon: Award },
                  { text: "ملفات ومصادر إضافية قابلة للتحميل", icon: FileText },
                  { text: "تواصل مباشر مع المدرب", icon: ShieldCheck }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                    <div className="w-7 h-7 rounded-lg bg-blue-50/50 flex items-center justify-center text-blue-500 shrink-0">
                      <f.icon size={14} />
                    </div>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
