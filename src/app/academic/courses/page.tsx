'use client';

import { Search, ChevronDown, MoreVertical, Download, ChevronRight, ChevronLeft, Loader2, Edit, Trash2, X, BarChart3, Eye, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCourses, deleteCourse } from '@/services/courses';
import { getProfileStatus } from '@/services/auth';
import { Course } from '@/types/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CreateCourseModal from '@/components/Academic/Modals/CreateCourseModal';
import SelectCourseTypeModal from '@/components/Academic/Modals/SelectCourseTypeModal';

const MySwal = withReactContent(Swal);

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const profile = await getProfileStatus();
      const userData = profile.data || profile;
      setCurrentUser(userData);

      const data = await getCourses(userData?.id, userData?.role);
      setCourses(data || []);
    } catch (error) {
      console.error(error);
      toast.error('فشل تحميل الدورات');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفها!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await deleteCourse(id);
        MySwal.fire(
          'تم الحذف!',
          'تم حذف الدورة بنجاح.',
          'success'
        );
        setCourses(prev => prev.filter(course => course.id !== id));
      } catch (error) {
        console.error(error);
        MySwal.fire(
          'فشل!',
          'حدث خطأ أثناء محاولة حذف الدورة.',
          'error'
        );
      }
    }
  };

  const handleEditCourse = (id: number) => {
    setSelectedCourseId(id);
    setIsEditModalOpen(true);
  };

  const getCourseTypeLabel = (type: string) => {
    switch (type) {
      case 'registered': return 'مسجلة';
      case 'online': return 'اونلاين';
      case 'offline': return 'حضوري';
      default: return type;
    }
  };

  const getCourseTypeColor = (type: string) => {
    switch (type) {
      case 'registered': return 'bg-orange-50 text-orange-500';
      case 'online': return 'bg-green-50 text-green-500';
      case 'offline': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const calculateReadiness = (course: Course) => {
    let score = 0;
    const max = 6;
    if (course.title) score++;
    if (course.description) score++;
    if ((course as any).short_description) score++;
    if (course.category_id || course.category) score++;
    if (course.image) score++;
    if (course.price_type) score++;
    return Math.round((score / max) * 100);
  };

  const getCourseTypeIcon = (type: string) => {
    switch (type) {
      case 'registered': return 'videocam';
      case 'online': return 'podcasts';
      case 'offline': return 'location_on';
      default: return 'videocam';
    }
  };

  const getCourseTypeAr = (type: string) => {
    switch (type) {
      case 'registered': return 'مسجلة';
      case 'online': return 'مباشرة';
      case 'offline': return 'حضورية';
      default: return 'مسجلة';
    }
  };

  const getCourseStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="bg-[#6cf8bb]/20 text-[#00714d] border border-[#6cf8bb]/30 px-2.5 py-1 rounded-md text-[10px] font-bold backdrop-blur-sm">منشورة</span>;
      case 'stopped':
        return <span className="bg-error-container/90 text-on-error-container px-2.5 py-1 rounded-md text-[10px] font-bold backdrop-blur-sm">متوقفة</span>;
      case 'draft':
      default:
        return <span className="bg-surface-variant text-on-surface-variant px-2.5 py-1 rounded-md text-[10px] font-bold backdrop-blur-sm">مسودة</span>;
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-3xl font-black text-gray-900">الدورات</h2>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث بالأسم"
              className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pr-12 pl-4 text-sm font-bold outline-none focus:border-blue-500 shadow-sm transition-all text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-3.5 rounded-2xl text-sm font-black text-gray-500 shadow-sm hover:bg-gray-50 transition-all">
            <span>الحالة</span>
            <ChevronDown size={18} />
          </button>

          <button className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-3.5 rounded-2xl text-sm font-black text-gray-500 shadow-sm hover:bg-gray-50 transition-all">
            <span>نوع الدورة</span>
            <ChevronDown size={18} />
          </button>

          <button className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-3.5 rounded-2xl text-sm font-black text-gray-500 shadow-sm hover:bg-gray-50 transition-all">
            <span>المدرب</span>
            <ChevronDown size={18} />
          </button>

          <button className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-3.5 rounded-2xl text-sm font-black text-gray-500 shadow-sm hover:bg-gray-50 transition-all">
            <span>التاريخ</span>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button className="flex items-center gap-3 bg-white border border-gray-100 hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-2xl font-black text-sm shadow-sm transition-all">
          <Download size={18} />
          <span>تصدير Excel</span>
        </button>

        <button
          onClick={() => setIsSelectTypeModalOpen(true)}
          className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={18} strokeWidth={3} />
          <span>إضافة دورة جديدة</span>
        </button>
      </div>

      {/* Courses Cards Grid Container */}
      <div className="bg-[#f8f9fa] rounded-[40px] shadow-sm min-h-[550px] pb-52 md:pb-0">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
            <p className="text-xl font-bold">لا توجد دورات حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const readiness = calculateReadiness(course);
              const studentCount = (course as any).students_count ?? 0;
              const totalSales = studentCount * Number(course.final_price || course.price || 0);
              const typeIcon = getCourseTypeIcon(course.type || 'registered');
              const typeLabel = getCourseTypeAr(course.type || 'registered');

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow group relative"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      src={course.image || 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=600'}
                      alt={course.title}
                    />
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      {getCourseStatusBadge(course.status || 'draft')}
                      <span className="bg-black/50 text-white px-2.5 py-1 rounded-md text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">{typeIcon}</span>
                        {typeLabel}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-15">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/academic/courses/${course.id}/view`);
                        }}
                        className="w-full bg-white text-on-surface py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                        معاينة الدورة
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col">
                    <h3
                      onClick={() => router.push(`/academic/courses/${course.id}`)}
                      className="font-bold text-lg text-on-surface mb-1 group-hover:text-primary transition-colors cursor-pointer line-clamp-1"
                    >
                      {course.title}
                    </h3>
                    <p className="text-on-surface-variant text-xs mb-4 line-clamp-1 italic font-medium">
                      {(course as any).short_description || 'تعلم الدورة مع نخبة من كبار المحاضرين.'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-surface-container-low rounded-lg border border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-on-surface-variant mb-0.5">الطلاب</span>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-primary">group</span>
                          <span className="text-xs font-bold text-slate-800">{studentCount.toLocaleString('ar-EG')} طالب</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-on-surface-variant mb-0.5">إجمالي المبيعات</span>
                        <div className="flex items-center gap-1 text-on-secondary-container">
                          <span className="material-symbols-outlined text-sm text-emerald-600">payments</span>
                          <span className="text-xs font-bold text-emerald-700">{totalSales.toLocaleString('ar-EG')} ر.س</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                        <span className="text-on-surface-variant">جاهزية المحتوى</span>
                        <span className={`font-black ${readiness >= 80 ? 'text-secondary' : readiness >= 40 ? 'text-tertiary' : 'text-error'}`}>
                          {readiness}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${readiness >= 80 ? 'bg-secondary' : readiness >= 40 ? 'bg-tertiary' : 'bg-error'}`}
                          style={{ width: `${readiness}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-outline-variant/60 flex items-center justify-between relative">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/academic/courses/${course.id}`);
                          }}
                          className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors border border-transparent hover:border-primary/20"
                          title="إدارة الإعدادات"
                        >
                          <span className="material-symbols-outlined">settings_suggest</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toast('ميزة تكرار الدورة ستتوفر قريباً');
                          }}
                          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
                          title="تكرار الدورة"
                        >
                          <span className="material-symbols-outlined">content_copy</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (course.slug) {
                              navigator.clipboard.writeText(`${window.location.origin}/user/courses/${course.slug}`);
                              toast.success('تم نسخ رابط الدورة بنجاح');
                            } else {
                              toast.error('لا يوجد رابط مخصص لهذه الدورة بعد');
                            }
                          }}
                          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
                          title="نسخ الرابط"
                        >
                          <span className="material-symbols-outlined">link</span>
                        </button>
                      </div>

                      <div className="relative">
                        <button
                          onClick={(e) => {


                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === course.id ? null : course.id);
                          }}
                          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>

                        {activeDropdownId === course.id && (
                          <>
                            <div
                              className="fixed inset-0 z-[100]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(null);
                              }}
                            />
                            <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-[101] py-2 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCourse(course.id);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full px-4 py-2.5 text-right text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-end gap-3 transition-colors"
                              >
                                <span>تعديل الاسم والنوع</span>
                                <span className="material-symbols-outlined text-[16px] text-blue-600">edit</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCourse(course.id);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full px-4 py-2.5 text-right text-sm font-bold text-red-600 hover:bg-red-50 flex items-center justify-end gap-3 transition-colors"
                              >
                                <span>حذف الدورة</span>
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination - Keep it static for now or hide if no items */}
        {!loading && filteredCourses.length > 0 && (
          <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-white rounded-b-[40px]">
            <div className="flex gap-3">
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                <ChevronRight size={24} />
              </button>
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-400">
                عرض {filteredCourses.length} من أصل {filteredCourses.length} دورة
              </span>
            </div>
          </div>
        )}
      </div>

      <CreateCourseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCourseId(null);
        }}
        courseId={selectedCourseId}
      />

      <SelectCourseTypeModal
        isOpen={isSelectTypeModalOpen}
        onClose={() => setIsSelectTypeModalOpen(false)}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8faff;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
