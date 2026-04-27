'use client';

import { Search, ChevronDown, MoreVertical, Download, ChevronRight, ChevronLeft, Loader2, Edit, Trash2, ArrowRight, X } from 'lucide-react';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getCourses, deleteCourse, getCategories } from '@/services/courses';
import { Course } from '@/types/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CreateCourseModal from '@/components/Modals/CreateCourseModal';

const MySwal = withReactContent(Swal);

export default function CategoryCoursesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: categoryId } = use(params);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesData, categoriesData] = await Promise.all([
        getCourses(),
        getCategories()
      ]);

      // Filter courses by category_id
      const filtered = (coursesData || []).filter(c => String(c.category_id) === String(categoryId));
      setCourses(filtered);

      // Find category name
      const cat = categoriesData.find(c => String(c.id) === String(categoryId));
      if (cat) setCategoryName(cat.name);
    } catch (error) {
      console.error(error);
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (id: number) => {
    setSelectedCourseId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (courseId: number) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم حذف هذه الدورة نهائياً!",
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
        await deleteCourse(courseId);
        MySwal.fire(
          'تم الحذف!',
          'تم حذف الدورة بنجاح.',
          'success'
        );
        setCourses(prev => prev.filter(c => c.id !== courseId));
      } catch (error) {
        MySwal.fire(
          'فشل!',
          'حدث خطأ أثناء محاولة حذف الدورة.',
          'error'
        );
      }
    }
  };

  const getCourseTypeLabel = (type: string) => {
    switch (type) {
      case 'recorded': return 'مسجلة';
      case 'online': return 'اونلاين';
      case 'physical': return 'حضوري';
      default: return type;
    }
  };

  const getCourseTypeColor = (type: string) => {
    switch (type) {
      case 'recorded': return 'bg-orange-50 text-orange-500';
      case 'online': return 'bg-green-50 text-green-500';
      case 'physical': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    const matchesType = typeFilter === 'all' || course.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-8 p-4 md:p-6" dir="rtl">
      {/* Breadcrumbs / Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold"
      >
        <ArrowRight size={20} />
        <span>العودة للفئات</span>
      </button>

      {/* Header & Filters */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">دورات {categoryName}</h2>
          <p className="text-gray-500 font-bold mt-2">عرض وإدارة جميع الدورات في هذا القسم</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث بالأسم"
              className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pr-12 pl-4 text-sm font-bold outline-none focus:border-blue-500 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-100 px-8 py-3.5 rounded-2xl text-sm font-black text-gray-500 shadow-sm hover:bg-gray-50 transition-all outline-none"
            >
              <option value="all">كل الحالات</option>
              <option value="published">منشورة</option>
              <option value="draft">مسودة</option>
            </select>
            <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-100 px-8 py-3.5 rounded-2xl text-sm font-black text-gray-500 shadow-sm hover:bg-gray-50 transition-all outline-none"
            >
              <option value="all">كل الأنواع</option>
              <option value="recorded">مسجلة</option>
              <option value="online">لايف</option>
              <option value="physical">حضوري</option>
            </select>
            <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Courses Table Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
            <p className="text-xl font-bold">لا توجد دورات حالياً في هذه الفئة</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-right text-gray-400 font-black text-base border-b border-gray-50">
                  <th className="px-8 py-8 whitespace-nowrap">اسم الدورة</th>
                  <th className="px-8 py-8 whitespace-nowrap">نوع الدورة</th>
                  <th className="px-8 py-8 whitespace-nowrap">السعر</th>
                  <th className="px-8 py-8 whitespace-nowrap">تاريخ الإضافة</th>
                  <th className="px-8 py-8 whitespace-nowrap text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="text-gray-900 font-bold">
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group"
                  >
                    <td className="px-8 py-8 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-black">{course.title}</span>
                        {course.status && (
                          <span className={`px-3 py-1 rounded-full text-xs w-fit ${course.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                            {course.status === 'published' ? 'منشورة' : 'مسودة'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                      <span className={`px-5 py-2 rounded-xl text-sm font-black ${getCourseTypeColor(course.type)}`}>
                        {getCourseTypeLabel(course.type)}
                      </span>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap font-black">
                      {Number(course.price) === 0 ? 'مجاني' : `${course.price} ر.س`}
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">
                      {course.created_at ? new Date(course.created_at).toLocaleDateString('ar-EG') : '--/--/----'}
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditCourse(course.id)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                          title="تعديل المحتوى"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
