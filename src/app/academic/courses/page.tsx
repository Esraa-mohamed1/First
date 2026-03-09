'use client';

import { Search, ChevronDown, MoreVertical, Download, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCourses } from '@/services/courses';
import { Course } from '@/types/api';
import toast from 'react-hot-toast';

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data || []);
    } catch (error) {
      console.error(error);
      toast.error('فشل تحميل الدورات');
    } finally {
      setLoading(false);
    }
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
              className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pr-12 pl-4 text-sm font-bold outline-none focus:border-blue-500 shadow-sm transition-all"
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

      {/* Export Button */}
      <div className="flex justify-start">
        <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black text-base shadow-lg shadow-blue-200 transition-all">
          <Download size={20} />
          <span>تصدير Excel</span>
        </button>
      </div>

      {/* Courses Table Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
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
                  <th className="px-8 py-8 whitespace-nowrap">نوع الدورة</th>
                  <th className="px-8 py-8 whitespace-nowrap">المدرب</th>
                  <th className="px-8 py-8 whitespace-nowrap">السعر</th>
                  <th className="px-8 py-8 whitespace-nowrap">عدد المشتركين</th>
                  <th className="px-8 py-8 whitespace-nowrap">عدد الدروس</th>
                  <th className="px-8 py-8 whitespace-nowrap">تاريخ الإضافة</th>
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
                        {course.status && (
                          <span className={`px-3 py-1 rounded-full text-xs w-fit ${
                            course.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {course.status === 'published' ? 'منشورة' : 'مسودة'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">{course.category || 'غير مصنف'}</td>
                    <td className="px-8 py-8 whitespace-nowrap">
                      <span className={`px-5 py-2 rounded-xl text-sm font-black ${getCourseTypeColor(course.type)}`}>
                        {getCourseTypeLabel(course.type)}
                      </span>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">{course.instructor || 'أحمد محمد'}</td>
                    <td className="px-8 py-8 whitespace-nowrap font-black">
                      {Number(course.price) === 0 ? 'مجاني' : `${course.price} ر.س`}
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">0</td> {/* Placeholder for subscribers */}
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">
                      {course.units?.reduce((acc, unit) => acc + (unit.lessons?.length || 0), 0) || 0}
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">
                       {course.created_at ? new Date(course.created_at).toLocaleDateString('ar-EG') : '--/--/----'}
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                        <MoreVertical size={20} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - Keep it static for now or hide if no items */}
        {!loading && filteredCourses.length > 0 && (
          <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-white">
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
