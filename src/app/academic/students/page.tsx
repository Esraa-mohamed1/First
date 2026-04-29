'use client';

import { Search, ChevronDown, Download, Loader2, Edit, Trash2, UserPlus, Eye, Mail, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, deleteUser } from '@/services/users';
import { User } from '@/types/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AddStudentModal from '@/components/Academic/Modals/AddStudentModal';

const MySwal = withReactContent(Swal);

export default function StudentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getUsers('student');
      setStudents(data || []);
    } catch (error) {
      console.error(error);
      toast.error('فشل تحميل الطلاب');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذف!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        MySwal.fire(
          'تم الحذف!',
          'تم حذف الطالب بنجاح.',
          'success'
        );
        setStudents(prev => prev.filter(student => student.id !== id));
      } catch (error) {
        console.error(error);
        MySwal.fire(
          'فشل!',
          'حدث خطأ أثناء محاولة الحذف.',
          'error'
        );
      }
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header & Filters */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-3xl font-black text-gray-900">الطلاب</h2>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث بالأسم أو البريد"
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
            <span>تاريخ الانضمام</span>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button className="flex items-center gap-3 bg-white border border-gray-100 text-gray-700 px-8 py-3.5 rounded-2xl font-black text-base shadow-sm hover:bg-gray-50 transition-all">
          <Download size={20} />
          <span>تصدير Excel</span>
        </button>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black text-base shadow-lg shadow-blue-200 transition-all"
        >
          <UserPlus size={20} />
          <span>اضافة طالب</span>
        </button>
      </div>

      {/* Students Table Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm min-h-[550px] pb-52 md:pb-0">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
            <p className="text-xl font-bold">لا يوجد طلاب حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar pb-60">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-right text-gray-400 font-black text-base border-b border-gray-50">
                  <th className="px-8 py-8 whitespace-nowrap">اسم الطالب</th>
                  <th className="px-8 py-8 whitespace-nowrap">البريد الإلكتروني</th>
                  <th className="px-8 py-8 whitespace-nowrap">رقم الجوال</th>
                  <th className="px-8 py-8 whitespace-nowrap">الحالة</th>
                  <th className="px-8 py-8 whitespace-nowrap">تاريخ الانضمام</th>
                  <th className="px-8 py-8 whitespace-nowrap">إجراءات</th>
                </tr>
              </thead>
              <tbody className="text-gray-900 font-bold">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group"
                  >
                    <td className="px-8 py-8 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                          {student.name ? student.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-lg font-black">{student.name || 'بدون اسم'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span>{student.email || 'غير متوفر'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <span dir="ltr">{student.phone || 'غير متوفر'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                      <span className={`px-4 py-2 rounded-full text-xs font-black ${
                        student.status === 'active' || !student.status ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {student.status === 'active' || !student.status ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap text-gray-500">
                      {student.created_at ? new Date(student.created_at).toLocaleDateString('ar-EG') : 'غير متوفر'}
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="عرض التفاصيل"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="تعديل"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStudent(student.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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

      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onStudentAdded={(student) => {
          setStudents(prev => [student, ...prev]);
        }}
      />
    </div>
  );
}
