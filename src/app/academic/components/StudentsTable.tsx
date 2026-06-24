'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, UserPlus, Plus } from 'lucide-react';

interface Student {
  name: string;
  course: string;
  date: string;
  status: string;
}

interface StudentsTableProps {
  enrichedStudents: Student[];
  setIsAddStudentModalOpen: (open: boolean) => void;
}

export const StudentsTable = ({
  enrichedStudents,
  setIsAddStudentModalOpen,
}: StudentsTableProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-black text-gray-900">اخر الطلاب المسجلين</h3>
      </div>

      {enrichedStudents.length === 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] sm:text-xs font-bold uppercase">
                  <th className="pb-3 pt-1.5 px-2 font-black">اسم الطالب</th>
                  <th className="pb-3 pt-1.5 px-2 font-black">الدورة</th>
                  <th className="pb-3 pt-1.5 px-2 font-black">تاريخ التسجيل</th>
                  <th className="pb-3 pt-1.5 px-2 font-black text-left">حالة الدفع</th>
                </tr>
              </thead>
            </table>
          </div>
          {/* Empty State Table Placeholder */}
          <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#F0F5FF] rounded-full flex items-center justify-center text-blue-600 mb-3 sm:mb-4 shadow-inner">
              <UserPlus className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h4 className="text-sm sm:text-base font-black text-gray-900 mb-1">لا يوجد طلاب مسجلون بعد</h4>
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 max-w-xs sm:max-w-sm leading-relaxed mb-4 sm:mb-6">
              ابدأ الآن بإضافة أول طالب وابدأ في متابعة نمو أكاديميتك بسهولة.
            </p>
            <button 
              onClick={() => setIsAddStudentModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" strokeWidth={3} />
              <span>أضف طالبك الأول</span>
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] sm:text-xs font-bold uppercase">
                  <th className="pb-3 pt-1.5 px-2 font-black">اسم الطالب</th>
                  <th className="pb-3 pt-1.5 px-2 font-black">الدورة</th>
                  <th className="pb-3 pt-1.5 px-2 font-black">تاريخ التسجيل</th>
                  <th className="pb-3 pt-1.5 px-2 font-black text-left">حالة الدفع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enrichedStudents.slice(0, 5).map((student, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2 font-bold text-xs sm:text-sm text-gray-900">
                      <div className="flex items-center gap-2 sm:gap-3 justify-start">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px] sm:text-xs shrink-0">
                          {student.name ? student.name.charAt(0) : 'ط'}
                        </div>
                        <span className="whitespace-nowrap">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[10px] sm:text-xs font-bold text-gray-500 max-w-[120px] sm:max-w-none truncate">{student.course}</td>
                    <td className="py-3 px-2 text-[10px] sm:text-xs font-bold text-gray-500 whitespace-nowrap">{student.date}</td>
                    <td className="py-3 px-2 text-left">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] sm:px-3 sm:py-1.5 sm:rounded-xl sm:text-[10px] font-black inline-block min-w-[70px] sm:min-w-[80px] text-center ${
                        student.status === 'مدفوع' ? 'bg-green-50 text-emerald-600 border border-green-100' :
                        student.status === 'انتظار' ? 'bg-orange-50 text-orange-500 border border-orange-100' :
                        'bg-gray-50 text-gray-500 border border-gray-100'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-100 gap-3">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400">
              عرض 1 إلى {Math.min(enrichedStudents.length, 5)} من أصل {enrichedStudents.length} طالب
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5" dir="ltr">
              <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-[10px] sm:text-xs">
                1
              </button>
              <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-bold text-[10px] sm:text-xs">
                2
              </button>
              <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-bold text-[10px] sm:text-xs">
                3
              </button>
              <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
