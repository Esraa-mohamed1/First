'use client';

import { Search, ChevronDown, MoreVertical, Download, ChevronRight, ChevronLeft, Loader2, Edit, Trash2, Eye, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCourses, deleteCourse } from '@/services/courses';
import { getProfileStatus } from '@/services/auth';
import { Course } from '@/types/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CreateCourseModal from '@/components/Academic/Modals/CreateCourseModal';

const MySwal = withReactContent(Swal);

interface CourseListProps {
  typeFilter?: string;
  title: string;
  description: string;
  createType: string;
}

export default function CourseList({ typeFilter, title, description, createType }: CourseListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [typeFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const profile = await getProfileStatus();
      const userData = profile.data || profile;
      setCurrentUser(userData);

      const data = await getCourses(userData?.id, userData?.role);
      let filteredData = data || [];
      
      if (typeFilter) {
        filteredData = filteredData.filter(c => c.type === typeFilter);
      }
      
      setCourses(filteredData);
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
        MySwal.fire('تم الحذف!', 'تم حذف الدورة بنجاح.', 'success');
        setCourses(prev => prev.filter(course => course.id !== id));
      } catch (error) {
        console.error(error);
        MySwal.fire('فشل!', 'حدث خطأ أثناء محاولة حذف الدورة.', 'error');
      }
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">{title}</h2>
          <p className="text-gray-500 mt-1">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث بالأسم"
              className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pr-12 pl-4 text-sm font-bold outline-none focus:border-blue-500 shadow-sm transition-all text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => router.push(`/academic/courses/create?type=${createType}`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all"
          >
            <ChevronRight size={20} className="rotate-180" />
            <span>اضافة دورة جديدة</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
            <p className="text-xl font-bold">لا توجد دورات حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-right text-gray-400 font-black text-base border-b border-gray-50">
                  <th className="px-8 py-8 whitespace-nowrap">اسم الدورة</th>
                  <th className="px-8 py-8 whitespace-nowrap">التصنيف</th>
                  <th className="px-8 py-8 whitespace-nowrap">المدرب</th>
                  <th className="px-8 py-8 whitespace-nowrap">السعر</th>
                  <th className="px-8 py-8 whitespace-nowrap text-center">المشتركين</th>
                  <th className="px-8 py-8 whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody className="text-gray-900 font-bold">
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group cursor-pointer"
                    onClick={() => router.push(`/academic/courses/${course.id}`)}
                  >
                    <td className="px-8 py-8 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-black">{course.title}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] w-fit font-black ${
                          course.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {course.status === 'published' ? 'منشورة' : 'مسودة'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">{course.category || 'غير مصنف'}</td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">{course.instructor || 'أحمد محمد'}</td>
                    <td className="px-8 py-8 whitespace-nowrap font-black">
                      {Number(course.price) === 0 ? 'مجاني' : `${course.price} ر.س`}
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500 text-center">0</td>
                    <td className="px-8 py-8 whitespace-nowrap">
                       <div className="flex items-center justify-end relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === course.id ? null : course.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                        >
                          <MoreVertical size={20} />
                        </button>
                        {activeDropdownId === course.id && (
                          <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-[101] py-2">
                             <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/academic/courses/${course.id}`);
                                }}
                                className="w-full px-4 py-2.5 text-right text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-end gap-3"
                              >
                                <span>تعديل</span>
                                <Edit size={16} className="text-blue-600" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCourse(course.id);
                                }}
                                className="w-full px-4 py-2.5 text-right text-sm font-bold text-red-600 hover:bg-red-50 flex items-center justify-end gap-3"
                              >
                                <span>حذف</span>
                                <Trash2 size={16} />
                              </button>
                          </div>
                        )}
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
    </div>
  );
}
