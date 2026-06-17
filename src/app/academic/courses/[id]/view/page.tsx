'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLogoUrl } from '@/lib/utils';
import {
  Play, FileText, CheckCircle2, Award, Clock,
  ChevronDown, ChevronUp, Edit3, BarChart3, Eye,
  BookOpen, User, CreditCard, ArrowRight, Video, Landmark
} from 'lucide-react';
import { getCourse } from '@/services/courses';
import { getUserPaymentInfos, UserPaymentInfo } from '@/services/finance';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

export default function OwnerCourseViewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [academyPaymentMethods, setAcademyPaymentMethods] = useState<UserPaymentInfo[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const [data, paymentInfos] = await Promise.all([
          getCourse(id),
          getUserPaymentInfos()
        ]);
        
        setAcademyPaymentMethods(paymentInfos || []);
        
        // Normalize chapters vs units
        const normalizedCourse = {
          ...data,
          units: data.units || data.chapters || [],
        };
        
        setCourse(normalizedCourse);
        
        // Expand first unit by default
        if (normalizedCourse.units && normalizedCourse.units.length > 0) {
          setExpandedUnits([normalizedCourse.units[0].id]);
        }
      } catch (err) {
        console.error('Failed to fetch course details for owner:', err);
        setError('فشل تحميل تفاصيل الدورة. يرجى التأكد من صحة الرابط والمحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(uid => uid !== unitId) : [...prev, unitId]
    );
  };

  const getCourseTypeLabel = (type: string) => {
    switch (type) {
      case 'registered': return 'مسجلة (مرفوعة)';
      case 'online': return 'أونلاين (بث مباشر)';
      case 'offline': return 'حضورياً (موقع فعلي)';
      default: return type || 'غير محدد';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-600 font-bold font-sans" dir="rtl">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>جاري تحميل تفاصيل الدورة كمالك...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4 font-sans" dir="rtl">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
          <Landmark size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{error || 'لم يتم العثور على الدورة'}</h3>
        <button
          onClick={() => router.push('/academic/courses')}
          className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          العودة إلى الدورات
        </button>
      </div>
    );
  }

  const totalUnits = course.units?.length || 0;
  const totalLessons = course.units?.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0) || 0;
  const courseImage = course.image || course.cover_image || course.thumbnail || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200';
  const isPaid = course.price_type === 'paid';
  const price = course.price || 0;
  const currency = course.currency || 'SAR';

  // Selected payment methods list
  const rawPaymentMethods = course?.payment_methods || course?.receiverAccounts || course?.receiver_accounts || [];
  const paymentMethods = rawPaymentMethods.map((item: any) => {
    const val = item.value || item.accountValue || item.account_value || '';
    const name = item.name || item.receiver_account?.name || item.methodName || '';
    const currency = item.currency || 'SAR';

    const resolvedId = item.instructor_receiver_account_id || 
                       item.pivot?.instructor_receiver_account_id || 
                       item.pivot?.receiver_account_id ||
                       item.id || 
                       item.methodId || 
                       item.method_id || 
                       item.receiver_account_id;

    const matchedMethod = academyPaymentMethods?.find((m: any) => 
      m.id.toString() === resolvedId?.toString() ||
      (m.accountValue && val && m.accountValue.toString().trim() === val.toString().trim()) ||
      (m.account_value && val && m.account_value.toString().trim() === val.toString().trim())
    );

    return {
      methodId: (matchedMethod?.id || resolvedId)?.toString() || '',
      methodName: matchedMethod?.name || name,
      value: matchedMethod?.accountValue || matchedMethod?.account_value || val,
      currency: matchedMethod?.currency || currency,
      logo: matchedMethod?.logo || item.logo || item.receiver_account?.logo || undefined
    };
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans" dir="rtl">
      {/* Back link */}
      <div className="flex justify-start">
        <Link
          href="/academic/courses"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm"
        >
          <ArrowRight size={18} />
          <span>العودة إلى قائمة الدورات</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT COLUMN: Course Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-blue-50 text-blue-600 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-lg border border-blue-100/50">
                  {course.category || 'عام'}
                </span>
                
                {course.status === 'published' ? (
                  <span className="bg-green-50 text-green-600 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-lg border border-green-100/50">
                    منشورة للطلاب
                  </span>
                ) : (
                  <span className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-lg border border-gray-200">
                    مسودة (غير منشورة)
                  </span>
                )}
                
                <span className="bg-indigo-50 text-indigo-600 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-lg border border-indigo-100/50">
                  نوع الدورة: {getCourseTypeLabel(course.type)}
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
                  <span>المدرب: {course.instructor || 'أحمد محمد'}</span>
                </div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-slate-400" />
                  <span>{totalUnits} وحدات • {totalLessons} درس</span>
                </div>
                {course.created_at && (
                  <>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <span>تاريخ الإضافة: {new Date(course.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 border-r-[4px] border-blue-600 pr-3 leading-none">وصف الدورة وتفاصيلها</h2>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm leading-[1.8] text-slate-600 font-medium ql-editor">
              {course.description ? (
                <div dangerouslySetInnerHTML={{ __html: course.description }} />
              ) : (
                <p>لا يوجد وصف متاح لهذه الدورة حالياً.</p>
              )}
            </div>
          </div>

          {/* Course Content Accordion */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 border-r-[4px] border-blue-600 pr-3 leading-none">محتوى الوحدات والدروس</h2>
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
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-4 px-6 border-b border-slate-50 last:border-0 text-sm font-bold text-slate-700"
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
                                <span>{lesson.title}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-5 text-center text-xs text-slate-400 font-bold">لا توجد دروس في هذه الوحدة.</div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 font-bold">لا توجد وحدات مضافة بعد.</div>
              )}
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Sidebar Actions & Details */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Action Card */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6 overflow-hidden">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
              <img src={courseImage} alt={course.title} className="w-full h-full object-cover" />
            </div>

            {/* Quick Stats Panel */}
            <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-5">
              <div className="bg-slate-50/50 p-4 rounded-2xl text-center border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">الطلاب المشتركين</span>
                <span className="text-2xl font-black text-slate-900">0</span>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-2xl text-center border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">إجمالي الدروس</span>
                <span className="text-2xl font-black text-slate-900">{totalLessons}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/academic/courses/${id}`}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 hover:-translate-y-0.5 active:scale-95 text-center text-base"
              >
                <Edit3 size={18} />
                تعديل الدورة ومحتواها
              </Link>
              <Link
                href={`/academic/courses/${id}/student`}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black py-4 rounded-2xl transition-all border border-slate-100 hover:-translate-y-0.5 active:scale-95 text-center text-base"
              >
                <Eye size={18} className="text-slate-500" />
                معاينة صفحة الإشتراك كطالب
              </Link>
            </div>
          </div>

          {/* Pricing & Collection Info */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6">
            <div>
              <h4 className="font-black text-slate-900 text-sm">بيانات تسعير الدورة:</h4>
              <div className="flex items-center gap-2 mt-2">
                {isPaid ? (
                  <>
                    <span className="text-3xl font-black text-slate-900">{price}</span>
                    <span className="text-sm font-black text-blue-600 mt-2">{currency}</span>
                  </>
                ) : (
                  <span className="text-xl font-black text-green-600">مجانية بالكامل</span>
                )}
              </div>
            </div>

            {isPaid && (
              <div className="pt-6 border-t border-slate-50 space-y-4">
                <h4 className="font-black text-slate-800 text-xs">حسابات تحصيل الدورة المفعلة ({paymentMethods.length}):</h4>
                {paymentMethods.length > 0 ? (
                  <div className="space-y-3">
                    {paymentMethods.map((pm: any) => (
                      <div key={pm.methodId || pm.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {pm.logo ? (
                              <img src={getLogoUrl(pm.logo)} alt={pm.methodName || pm.name} className="w-5 h-5 object-cover rounded shadow-sm" />
                            ) : (
                              <Landmark size={12} className="text-blue-500" />
                            )}
                            <span className="font-black text-slate-950">{pm.methodName || pm.name}</span>
                          </div>
                          <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black text-[9px]">{pm.currency}</span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 font-bold break-all select-all pt-1 border-t border-slate-100/50">
                          {pm.value || pm.account_value}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-bold">لا توجد وسائل دفع محددة بعد لهذه الدورة. سيتمكن الطلاب من الاشتراك مباشرة.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
