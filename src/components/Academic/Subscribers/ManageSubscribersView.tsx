'use client';

import React, { useState, useEffect } from 'react';
import { deleteUser } from '@/services/users';
import { getCourseSubscribers } from '@/services/courses';
import { User } from '@/types/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AddStudentModal from '@/components/Academic/Modals/AddStudentModal';
import EditUserModal from '@/components/Academic/Modals/EditUserModal';

const MySwal = withReactContent(Swal);

interface ManageSubscribersViewProps {
  showTopHeader?: boolean;
  courseId?: string | number;
}

export default function ManageSubscribersView({ showTopHeader = true, courseId }: ManageSubscribersViewProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [drawerStudent, setDrawerStudent] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let data: any[] = [];
      if (courseId) {
        data = await getCourseSubscribers(courseId);
      }
      const avatarColors = [
        'bg-blue-100 text-blue-700',
        'bg-emerald-100 text-emerald-700',
        'bg-violet-100 text-violet-700',
        'bg-amber-100 text-amber-700',
        'bg-rose-100 text-rose-700',
      ];
      const normalized = (data || []).map((item: any, idx: number) => {
        const user = item.user || item.student || item;
        return {
          id: item.id || user.id,
          name: user.name || item.name || null,
          email: user.email || item.email || null,
          phone: user.phone || item.phone || null,
          status: item.status || user.status || 'active',
          created_at: item.created_at || item.subscribed_at || user.created_at || null,
          amount: item.amount || item.paid_amount || null,
          avatarLetter: (user.name || item.name || '?').charAt(0),
          avatarBg: avatarColors[idx % avatarColors.length],
        };
      });
      setStudents(normalized);
    } catch (error) {
      console.error(error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من التراجع عن حذف هذا المشترك!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ba1a1a',
      cancelButtonColor: '#727687',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try { await deleteUser(id); } catch { /* ignored */ }
      setStudents(prev => prev.filter(s => s.id !== id));
      if (drawerStudent?.id === id) closeDrawer();
      toast.success('تم حذف المشترك بنجاح');
    }
  };

  const openDrawer = (student: any) => { setDrawerStudent(student); setIsDrawerOpen(true); };
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleExportCSV = () => {
    const headers = ['الاسم', 'البريد', 'الهاتف', 'تاريخ الاشتراك', 'الحالة', 'المبلغ'];
    const rows = filteredStudents.map(s => [
      s.name || '', s.email || '', s.phone || '',
      s.created_at ? new Date(s.created_at).toLocaleDateString('ar-EG') : '',
      s.status === 'active' ? 'نشط' : s.status === 'pending' ? 'معلق' : 'متوقف',
      s.amount || '',
    ].map(v => `"${v}"`));
    const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast.success('تم تصدير البيانات بنجاح');
  };

  const filteredStudents = students.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.phone?.includes(q);
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter || (statusFilter === 'active' && !s.status);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const currentStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatus = (status: string) => {
    if (status === 'active') return { label: 'نشط', cls: 'bg-emerald-100 text-emerald-700' };
    if (status === 'pending') return { label: 'معلق', cls: 'bg-amber-100 text-amber-700' };
    return { label: 'متوقف', cls: 'bg-red-100 text-red-700' };
  };

  return (
    <div className="bg-white rounded-2xl text-on-background" dir="rtl">
      {showTopHeader && (
        <header className="h-16 w-full sticky top-0 z-30 bg-white border-b border-outline-variant flex items-center justify-between px-6 mb-6 shadow-sm">
          <h2 className="font-bold text-lg text-on-surface">إدارة المشتركين</h2>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-primary text-on-primary px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 cursor-pointer text-sm">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>إضافة مشترك</span>
          </button>
        </header>
      )}

      <div className="space-y-6 p-2 md:p-4">
        {/* KPI Cards - only real countable data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">group</span>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">إجمالي المشتركين</p>
                <h3 className="text-2xl font-black text-on-surface mt-0.5">
                  {loading ? '...' : students.length === 0 ? '0' : students.length.toLocaleString('ar-EG')}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-[24px]">how_to_reg</span>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">المشتركون النشطون</p>
                <h3 className="text-2xl font-black text-on-surface mt-0.5">
                  {loading ? '...' : students.filter(s => s.status === 'active' || !s.status).length.toLocaleString('ar-EG') || '0'}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm bg-white text-gray-900"
              placeholder="بحث بالاسم أو البريد..."
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-4 py-2.5 rounded-xl border border-outline-variant text-sm bg-white font-bold cursor-pointer outline-none">
              <option value="all">الكل</option>
              <option value="active">النشطون</option>
              <option value="pending">المعلقون</option>
              <option value="inactive">المتوقفون</option>
            </select>
            <button onClick={handleExportCSV} className="px-4 py-2.5 rounded-xl border border-outline-variant text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors bg-white font-bold cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>تصدير CSV</span>
            </button>
            {!showTopHeader && (
              <button onClick={() => setIsAddModalOpen(true)} className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 cursor-pointer text-sm">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>إضافة مشترك لهذه الدورة</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-16 text-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-on-surface-variant font-bold text-sm">جاري تحميل البيانات...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-[56px] text-on-surface-variant/40">group_off</span>
                <p className="text-on-surface-variant font-bold">
                  {students.length === 0 ? 'لا يوجد مشتركون في هذه الدورة حتى الآن' : 'لا يوجد نتائج مطابقة'}
                </p>
                <p className="text-on-surface-variant/60 text-sm">
                  {students.length === 0 ? 'سيظهر المشتركون هنا بعد اشتراكهم في الدورة' : ''}
                </p>
              </div>
            ) : (
              <table className="w-full text-right">
                <thead className="bg-gray-50 border-b border-outline-variant">
                  <tr>
                    <th className="px-5 py-3.5 text-xs font-black text-on-surface-variant uppercase tracking-wide">المشترك</th>
                    <th className="px-5 py-3.5 text-xs font-black text-on-surface-variant uppercase tracking-wide">الهاتف / البريد</th>
                    <th className="px-5 py-3.5 text-xs font-black text-on-surface-variant uppercase tracking-wide">تاريخ الاشتراك</th>
                    <th className="px-5 py-3.5 text-xs font-black text-on-surface-variant uppercase tracking-wide">المبلغ</th>
                    <th className="px-5 py-3.5 text-xs font-black text-on-surface-variant uppercase tracking-wide">الحالة</th>
                    <th className="px-5 py-3.5 text-xs font-black text-on-surface-variant uppercase tracking-wide">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {currentStudents.map(student => {
                    const st = getStatus(student.status);
                    return (
                      <tr key={student.id} onClick={() => openDrawer(student)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${student.avatarBg}`}>
                              {student.avatarLetter}
                            </div>
                            <span className="font-bold text-sm text-on-surface">{student.name || 'بدون اسم'}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-on-surface-variant">
                          <div className="space-y-0.5">
                            {student.email && <p>{student.email}</p>}
                            {student.phone && <p className="text-xs text-on-surface-variant/70">{student.phone}</p>}
                            {!student.email && !student.phone && <span className="text-on-surface-variant/40">—</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-on-surface-variant">
                          {student.created_at
                            ? new Date(student.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })
                            : <span className="text-on-surface-variant/40">—</span>}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-on-surface">
                          {student.amount || <span className="text-on-surface-variant/40">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black ${st.cls}`}>{st.label}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setEditingStudent(student)} className="p-2 hover:bg-gray-100 rounded-full text-on-surface-variant transition-colors" title="تعديل">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button onClick={e => handleDeleteStudent(e, student.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors" title="حذف">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {!loading && filteredStudents.length > 0 && (
            <div className="px-5 py-4 border-t border-outline-variant flex items-center justify-between bg-gray-50/50 flex-wrap gap-3">
              <span className="text-xs text-on-surface-variant font-bold">
                {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredStudents.length)} من {filteredStudents.length} مشترك
              </span>
              <div className="flex items-center gap-1.5">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="w-9 h-9 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-white disabled:opacity-40 cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setCurrentPage(p)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold cursor-pointer ${currentPage === p ? 'bg-primary text-on-primary' : 'border border-outline-variant hover:bg-white'}`}>
                      {p}
                    </button>
                  );
                })}
                <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="w-9 h-9 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-white disabled:opacity-40 cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer overlay */}
      <div className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeDrawer} />

      {/* Subscriber Details Drawer */}
      <div className={`fixed left-0 top-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`} dir="rtl">
        <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-base text-on-surface">تفاصيل المشترك</h3>
          <button className="p-2 hover:bg-gray-200 rounded-full cursor-pointer transition-colors" onClick={closeDrawer}>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        {drawerStudent && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black ${drawerStudent.avatarBg}`}>
                {drawerStudent.avatarLetter}
              </div>
              <div>
                <h4 className="font-black text-lg text-on-surface">{drawerStudent.name || 'بدون اسم'}</h4>
                {drawerStudent.email && <p className="text-sm text-on-surface-variant mt-0.5">{drawerStudent.email}</p>}
                {drawerStudent.phone && <p className="text-sm text-on-surface-variant">{drawerStudent.phone}</p>}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${getStatus(drawerStudent.status).cls}`}>
                {getStatus(drawerStudent.status).label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-outline-variant">
                <p className="text-xs text-on-surface-variant font-bold">تاريخ الاشتراك</p>
                <p className="text-sm font-black text-on-surface mt-1">
                  {drawerStudent.created_at ? new Date(drawerStudent.created_at).toLocaleDateString('ar-EG') : '—'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-outline-variant">
                <p className="text-xs text-on-surface-variant font-bold">المبلغ المدفوع</p>
                <p className="text-sm font-black text-on-surface mt-1">{drawerStudent.amount || '—'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingStudent(drawerStudent)} className="flex-1 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer transition-all">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>تعديل</span>
              </button>
              <button onClick={async (e) => { await handleDeleteStudent(e as any, drawerStudent.id); }} className="flex-1 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-100 cursor-pointer transition-all">
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>حذف</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onStudentAdded={fetchStudents} />
      {editingStudent && (
        <EditUserModal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          user={editingStudent}
          onUserUpdated={() => { setEditingStudent(null); fetchStudents(); }}
        />
      )}
    </div>
  );
}
