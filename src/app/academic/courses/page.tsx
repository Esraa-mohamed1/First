'use client';

import { Search, ChevronDown, MoreVertical, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const coursesData = [
  { id: 1, name: 'أساسيات الحاسوب', category: 'تكنولوجيا', type: 'مسجلة', instructor: 'كريم محمد', price: '1,250', subscribers: 850, lessons: 250, date: '22/10/2022', status: 'مسودة' },
  { id: 2, name: 'أساسيات البرمجة', category: 'البرمجة', type: 'اونلاين', instructor: 'محمود ابراهيم', price: '2,250', subscribers: 250, lessons: 250, date: '19/8/2019', status: '' },
  { id: 3, name: 'تطوير مواقع الويب', category: 'البرمجة', type: 'مسجلة', instructor: 'احمد محمد', price: '2,110', subscribers: 150, lessons: 150, date: '14/1/2023', status: 'مسودة' },
  { id: 4, name: 'تحليل البيانات', category: 'علوم البيانات', type: 'حضوري', instructor: 'علي محمد', price: '1,250', subscribers: 310, lessons: 100, date: '12/10/2022', status: '' },
  { id: 5, name: 'أساسيات البرمجة', category: 'البرمجة', type: 'اونلاين', instructor: 'كريم محمد', price: '1,250', subscribers: 500, lessons: 50, date: '7/7/2018', status: '' },
  { id: 6, name: 'تطوير مواقع الويب', category: 'البرمجة', type: 'مسجلة', instructor: 'احمد محمد', price: '2,110', subscribers: 150, lessons: 150, date: '14/1/2023', status: 'مسودة' },
  { id: 7, name: 'تحليل البيانات', category: 'علوم البيانات', type: 'اونلاين', instructor: 'علي محمد', price: '2,110', subscribers: 150, lessons: 150, date: '14/1/2023', status: '' },
  { id: 8, name: 'تطوير مواقع الويب', category: 'البرمجة', type: 'مسجلة', instructor: 'احمد محمد', price: '2,110', subscribers: 150, lessons: 150, date: '14/1/2023', status: 'مسودة' },
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
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
              {coursesData.map((course, index) => (
                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                  <td className="px-8 py-8 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-black">{course.name}</span>
                      {course.status && (
                        <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-xs w-fit">
                          {course.status}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-8 whitespace-nowrap text-gray-500">{course.category}</td>
                  <td className="px-8 py-8 whitespace-nowrap">
                    <span className={`px-5 py-2 rounded-xl text-sm font-black ${
                      course.type === 'مسجلة' ? 'bg-orange-50 text-orange-500' : 
                      course.type === 'اونلاين' ? 'bg-green-50 text-green-500' : 
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="px-8 py-8 whitespace-nowrap text-gray-500">{course.instructor}</td>
                  <td className="px-8 py-8 whitespace-nowrap font-black">{course.price}</td>
                  <td className="px-8 py-8 whitespace-nowrap text-gray-500">{course.subscribers}</td>
                  <td className="px-8 py-8 whitespace-nowrap text-gray-500">{course.lessons}</td>
                  <td className="px-8 py-8 whitespace-nowrap text-gray-500">{course.date}</td>
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

        {/* Pagination */}
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
            <span className="text-sm font-bold text-gray-400">عرض 8 من أصل 50 دورة</span>
          </div>
        </div>
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
