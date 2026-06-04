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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-gray-900">اخر الطلاب المسجلين</h3>
      </div>

      {enrichedStudents.length === 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                  <th className="pb-4 pt-2 font-black">اسم الطالب</th>
                  <th className="pb-4 pt-2 font-black">الدورة</th>
                  <th className="pb-4 pt-2 font-black">تاريخ التسجيل</th>
                  <th className="pb-4 pt-2 font-black text-left">حالة الدفع</th>
                </tr>
              </thead>
            </table>
          </div>
          {/* Empty State Table Placeholder */}
          <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
            <div className="w-16 h-16 bg-[#F0F5FF] rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-inner">
              <UserPlus size={28} />
            </div>
            <h4 className="text-base font-black text-gray-900 mb-1">لا يوجد طلاب مسجلون بعد</h4>
            <p className="text-xs font-bold text-gray-400 max-w-sm leading-relaxed mb-6">
              ابدأ الآن بإضافة أول طالب وابدأ في متابعة نمو أكاديميتك بسهولة.
            </p>
            <button 
              onClick={() => setIsAddStudentModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            >
              <Plus size={16} strokeWidth={3} />
              <span>أضف طالبك الأول</span>
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                  <th className="pb-4 pt-2 font-black">اسم الطالب</th>
                  <th className="pb-4 pt-2 font-black">الدورة</th>
                  <th className="pb-4 pt-2 font-black">تاريخ التسجيل</th>
                  <th className="pb-4 pt-2 font-black text-left">حالة الدفع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enrichedStudents.slice(0, 5).map((student, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-sm text-gray-900">
                      <div className="flex items-center gap-3 justify-start">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs shrink-0">
                          {student.name ? student.name.charAt(0) : 'ط'}
                        </div>
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs font-bold text-gray-500">{student.course}</td>
                    <td className="py-4 text-xs font-bold text-gray-500">{student.date}</td>
                    <td className="py-4 text-left">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black inline-block min-w-[80px] text-center ${
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
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-100 gap-4">
            <span className="text-xs font-bold text-gray-400">
              عرض 1 إلى {Math.min(enrichedStudents.length, 5)} من أصل {enrichedStudents.length} طالب
            </span>
            <div className="flex items-center gap-1.5" dir="ltr">
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                1
              </button>
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-bold text-xs">
                2
              </button>
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-bold text-xs">
                3
              </button>
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
