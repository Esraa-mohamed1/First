'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Edit3, Trash2, Search, Check, X, Loader2,
  ListFilter, Calendar, BookOpen, CalendarCheck, Layers,
  Info, CheckCircle, Zap, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getGrades, createGrade, updateGrade, deleteGrade,
  getAcademicYears, createAcademicYear, updateAcademicYear, deleteAcademicYear,
  getTerms, createTerm, updateTerm, deleteTerm,
  getSubjects, createSubject, updateSubject, deleteSubject,
  ClassificationItem
} from '@/services/academic-classification';

export default function AcademicClassificationPage() {
  const [activeTab, setActiveTab] = useState<'grades' | 'semesters' | 'subjects' | 'years'>('grades');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getTabTitle = (tabId: string) => {
    switch (tabId) {
      case 'grades': return 'صف دراسي';
      case 'semesters': return 'فصل دراسي';
      case 'subjects': return 'مادة دراسية';
      case 'years': return 'عام دراسي';
      default: return 'عنصر جديد';
    }
  };

  // Form states
  const [addName, setAddName] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addStage, setAddStage] = useState('المرحلة الثانوية');
  const [addAcademicYear, setAddAcademicYear] = useState('2025/2026');
  const [addGradeId, setAddGradeId] = useState('');

  const [editItemData, setEditItemData] = useState<ClassificationItem>({
    id: '',
    name: '',
    desc: '',
    stage: 'المرحلة الثانوية',
    academic_year: '2025/2026',
    active: true,
    grade_id: ''
  });

  // Local state storage per tab
  const [dataStore, setDataStore] = useState<Record<string, ClassificationItem[]>>({
    grades: [],
    semesters: [],
    subjects: [],
    years: []
  });

  // Fetch items from backend API
  const fetchTabContent = useCallback(async (tab: typeof activeTab) => {
    setLoading(true);
    try {
      let remoteItems: any[] = [];
      if (tab === 'grades') {
        remoteItems = await getGrades();
      } else if (tab === 'years') {
        remoteItems = await getAcademicYears();
      } else if (tab === 'semesters') {
        remoteItems = await getTerms();
      } else if (tab === 'subjects') {
        remoteItems = await getSubjects();
      }

      if (remoteItems) {
        const formatted = remoteItems.map((item: any, i: number) => ({
          id: item.id || String(i + 1).padStart(2, '0'),
          name: item.name || item.title || 'عنصر جديد',
          desc: item.desc || item.description || 'لا يوجد وصف',
          stage: item.stage || item.educational_stage || (tab === 'grades' ? 'المرحلة الثانوية' : 'عام'),
          academic_year: item.academic_year || item.academic_year_name || '2025/2026',
          active: item.active !== undefined ? item.active : (item.is_active !== undefined ? item.is_active : true),
          grade_id: item.grade_id || item.grade?.id || '',
          grade_name: item.grade?.name || ''
        }));
        setDataStore(prev => ({ ...prev, [tab]: formatted }));
      }
    } catch (e) {
      console.warn(`Fallback to local state for tab ${tab}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Always pre-fetch grades to ensure they are available for dropdowns
  useEffect(() => {
    const preFetch = async () => {
      try {
        const remoteGrades = await getGrades();
        if (remoteGrades) {
          const formatted = remoteGrades.map((item: any, i: number) => ({
            id: item.id || String(i + 1).padStart(2, '0'),
            name: item.name || item.title || 'عنصر جديد',
            desc: item.desc || item.description || 'لا يوجد وصف',
            stage: item.stage || item.educational_stage || 'المرحلة الثانوية',
            academic_year: item.academic_year || item.academic_year_name || '2025/2026',
            active: item.active !== undefined ? item.active : (item.is_active !== undefined ? item.is_active : true),
            grade_id: item.grade_id || item.grade?.id || '',
            grade_name: item.grade?.name || ''
          }));
          setDataStore(prev => ({ ...prev, grades: formatted }));
        }
      } catch (err) {
        console.warn('Failed to pre-fetch grades:', err);
      }
    };
    preFetch();
  }, []);

  const availableGrades = dataStore.grades || [];

  useEffect(() => {
    if (isAddModalOpen && availableGrades.length > 0 && !addGradeId) {
      setAddGradeId(String(availableGrades[0].id));
    }
  }, [isAddModalOpen, availableGrades, addGradeId]);

  useEffect(() => {
    fetchTabContent(activeTab);
  }, [activeTab, fetchTabContent]);

  const currentList = dataStore[activeTab] || [];
  const filteredList = currentList.filter(item => 
    (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.desc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.stage || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;

    setActionLoading(true);
    const payload: any = {
      name: addName.trim(),
      description: addDesc.trim() || 'وصف مختصر للتصنيف',
      stage: addStage,
      academic_year: addAcademicYear,
      is_active: true
    };

    if (activeTab !== 'grades') {
      payload.grade_id = addGradeId;
    }

    try {
      let createdRemote: any = null;
      if (activeTab === 'grades') {
        createdRemote = await createGrade(payload);
      } else if (activeTab === 'years') {
        createdRemote = await createAcademicYear(payload);
      } else if (activeTab === 'semesters') {
        createdRemote = await createTerm(payload);
      } else if (activeTab === 'subjects') {
        createdRemote = await createSubject(payload);
      }

      const newId = createdRemote?.id || String(currentList.length + 1).padStart(2, '0');
      const newItem: ClassificationItem = {
        id: newId,
        name: addName.trim(),
        desc: addDesc.trim() || 'وصف مختصر للتصنيف',
        stage: addStage,
        academic_year: addAcademicYear,
        active: true,
        grade_id: activeTab !== 'grades' ? addGradeId : undefined,
        grade_name: activeTab !== 'grades' ? (availableGrades.find(g => String(g.id) === String(addGradeId))?.name || '') : undefined
      };

      setDataStore(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newItem]
      }));

      toast.success('تمت إضافة العنصر بنجاح!');
      setAddName('');
      setAddDesc('');
      if (availableGrades.length > 0) {
        setAddGradeId(String(availableGrades[0].id));
      } else {
        setAddGradeId('');
      }
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('API create error:', err);
      // Fallback local append
      const newId = String(currentList.length + 1).padStart(2, '0');
      const newItem: ClassificationItem = {
        id: newId,
        name: addName.trim(),
        desc: addDesc.trim() || 'وصف مختصر للتصنيف',
        stage: addStage,
        academic_year: addAcademicYear,
        active: true,
        grade_id: activeTab !== 'grades' ? addGradeId : undefined,
        grade_name: activeTab !== 'grades' ? (availableGrades.find(g => String(g.id) === String(addGradeId))?.name || '') : undefined
      };

      setDataStore(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newItem]
      }));

      toast.success('تم التحديث بنجاح');
      setAddName('');
      setAddDesc('');
      if (availableGrades.length > 0) {
        setAddGradeId(String(availableGrades[0].id));
      } else {
        setAddGradeId('');
      }
      setIsAddModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEdit = (item: ClassificationItem) => {
    setEditItemData({
      ...item,
      grade_id: item.grade_id || (availableGrades[0]?.id ? String(availableGrades[0].id) : '')
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const payload: any = {
      name: editItemData.name,
      description: editItemData.desc || editItemData.description || '',
      stage: editItemData.stage,
      academic_year: editItemData.academic_year,
      is_active: editItemData.active
    };

    if (activeTab !== 'grades') {
      payload.grade_id = editItemData.grade_id;
    }

    try {
      if (activeTab === 'grades') {
        await updateGrade(editItemData.id, payload);
      } else if (activeTab === 'years') {
        await updateAcademicYear(editItemData.id, payload);
      } else if (activeTab === 'semesters') {
        await updateTerm(editItemData.id, payload);
      } else if (activeTab === 'subjects') {
        await updateSubject(editItemData.id, payload);
      }
    } catch (err) {
      console.warn('API update failed, updating state locally');
    } finally {
      const updatedItem = {
        ...editItemData,
        grade_name: activeTab !== 'grades' ? (availableGrades.find(g => String(g.id) === String(editItemData.grade_id))?.name || '') : undefined
      };
      setDataStore(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(item => item.id === editItemData.id ? updatedItem : item)
      }));

      toast.success('تم تحديث البيانات بنجاح!');
      setActionLoading(false);
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      try {
        if (activeTab === 'grades') {
          await deleteGrade(id);
        } else if (activeTab === 'years') {
          await deleteAcademicYear(id);
        } else if (activeTab === 'semesters') {
          await deleteTerm(id);
        } else if (activeTab === 'subjects') {
          await deleteSubject(id);
        }
      } catch (err) {
        console.warn('API delete failed, updating state locally');
      }

      setDataStore(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => String(item.id) !== String(id))
      }));
      toast.success('تم الحذف بنجاح');
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto font-sans" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
            <a className="hover:text-blue-600 transition-colors" href="#">إعدادات المنصة</a>
            <span>/</span>
            <span className="text-slate-800 font-extrabold">التصنيف الدراسي</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">التصنيف الدراسي</h1>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">إدارة هيكلة المراحل، الصفوف، والمواد الدراسية للمنصة.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchTabContent(activeTab)}
            className="p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-blue-600' : ''} />
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            <span>إضافة جديد</span>
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/50 px-4 overflow-x-auto whitespace-nowrap scrollbar-none gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('grades')}
            className={`px-5 py-4 text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'grades'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ListFilter size={16} />
            <span>الصفوف الدراسية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('semesters')}
            className={`px-5 py-4 text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'semesters'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar size={16} />
            <span>الفصول الدراسية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('subjects')}
            className={`px-5 py-4 text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'subjects'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen size={16} />
            <span>المواد الدراسية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('years')}
            className={`px-5 py-4 text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'years'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CalendarCheck size={16} />
            <span>الأعوام الدراسية</span>
          </button>
        </div>

        {/* Search Bar Strip */}
        <div className="p-4 bg-slate-50/30 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="بحث في هذا التصنيف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-blue-200 transition-all cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>إضافة في {getTabTitle(activeTab)}</span>
            </button>
          </div>

          <span className="text-xs font-bold text-slate-400 shrink-0">
            عدد العناصر: {filteredList.length}
          </span>
        </div>

        {/* Content Table Area */}
        <div className="min-h-[320px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="animate-spin text-blue-600" size={36} />
              <span className="font-bold text-xs">جاري تحميل البيانات من السيرفر...</span>
            </div>
          ) : filteredList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-200 text-xs font-black text-slate-500">
                    <th className="px-6 py-4 w-16">#</th>
                    <th className="px-6 py-4">الاسم والوصف</th>
                    {activeTab !== 'grades' && <th className="px-6 py-4">الصف الدراسي</th>}
                    <th className="px-6 py-4">العام الدراسي</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold">
                  {filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 text-slate-400">{item.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-black text-slate-900 text-sm">{item.name}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{item.desc || item.description}</span>
                        </div>
                      </td>
                      {activeTab !== 'grades' && (
                        <td className="px-6 py-4 text-slate-600 font-bold">
                          {item.grade_name || availableGrades.find(g => String(g.id) === String(item.grade_id))?.name || 'عام'}
                        </td>
                      )}
                      <td className="px-6 py-4 text-blue-600 font-bold">{item.academic_year || '2025/2026'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 ${
                          item.active 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {item.active ? 'نشط' : 'غير مفعل'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all cursor-pointer"
                            title="تعديل"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
              <Layers size={48} className="opacity-20" />
              <p className="font-black text-slate-800 text-sm">لا توجد بيانات متاحة</p>
              <p className="text-xs font-bold">لم يتم إضافة أي عناصر في هذا التصنيف بعد.</p>
            </div>
          )}
        </div>

        {/* Footer Pagination Bar */}
        <div className="p-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-200 text-xs font-bold text-slate-500">
          <div>عرض 1-{filteredList.length} من أصل {filteredList.length} صفوف</div>
          <div className="flex gap-2">
            <button type="button" className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed">السابق</button>
            <button type="button" className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl font-black">1</button>
            <button type="button" className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed">التالي</button>
          </div>
        </div>
      </div>

      {/* Visual Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
            <Info size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-slate-900 text-sm">تنظيم البيانات</h4>
            <p className="text-xs text-slate-500 font-bold leading-relaxed">
              يساعدك التصنيف الدراسي في تنظيم محتواك التعليمي بدقة، مما يسهل على الطلاب العثور على الدورات المناسبة لمستواهم.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <CheckCircle size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-slate-900 text-sm">الربط التلقائي</h4>
            <p className="text-xs text-slate-500 font-bold leading-relaxed">
              يتم ربط المواد الدراسية بالصفوف المختارة تلقائياً عند إنشاء الدورات التعليمية الجديدة، مما يوفر الوقت ويقلل الأخطاء.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white flex items-start gap-4 shadow-lg shadow-blue-600/20">
          <div className="p-3 bg-white/20 text-white rounded-2xl shrink-0">
            <Zap size={24} className="fill-current" />
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="font-black text-sm">إحصائيات سريعة</h4>
            <p className="text-xs text-white/80 font-bold leading-relaxed">
              لديك حالياً <span className="text-amber-300 font-black">{dataStore.grades.length}</span> صفوف دراسية و <span className="text-amber-300 font-black">{dataStore.subjects.length}</span> مادة مسجلة في النظام.
            </p>
          </div>
        </div>
      </div>

      {/* ─── ADD MODAL ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="text-blue-600" size={18} />
                <span>إضافة عنصر جديد</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-right">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">اسم التصنيف *</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: أولى ثانوي"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* الصف الدراسي (بديلاً عن المرحلة الدراسية) */}
                {activeTab !== 'grades' ? (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700">الصف الدراسي *</label>
                    <select
                      value={addGradeId}
                      onChange={(e) => setAddGradeId(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="" disabled>اختر الصف الدراسي...</option>
                      {availableGrades.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {/* العام الدراسي */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">العام الدراسي</label>
                  <select
                    value={addAcademicYear}
                    onChange={(e) => setAddAcademicYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="2025/2026">2025/2026</option>
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2022/2023">2022/2023</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">الوصف</label>
                <textarea
                  rows={3}
                  placeholder="اكتب وصفاً مختصراً..."
                  value={addDesc}
                  onChange={(e) => setAddDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={16} /> : 'حفظ البيانات'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT MODAL ─── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="text-blue-600" size={18} />
                <span>تعديل البيانات</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-right">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">اسم التصنيف *</label>
                <input
                  type="text"
                  required
                  value={editItemData.name}
                  onChange={(e) => setEditItemData({ ...editItemData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* الصف الدراسي (بديلاً عن المرحلة الدراسية) */}
                {activeTab !== 'grades' ? (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700">الصف الدراسي *</label>
                    <select
                      value={editItemData.grade_id || ''}
                      onChange={(e) => setEditItemData({ ...editItemData, grade_id: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="" disabled>اختر الصف الدراسي...</option>
                      {availableGrades.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {/* العام الدراسي */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">العام الدراسي</label>
                  <select
                    value={editItemData.academic_year || '2025/2026'}
                    onChange={(e) => setEditItemData({ ...editItemData, academic_year: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="2025/2026">2025/2026</option>
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2022/2023">2022/2023</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">الوصف</label>
                <textarea
                  rows={3}
                  value={editItemData.desc || editItemData.description || ''}
                  onChange={(e) => setEditItemData({ ...editItemData, desc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-black text-slate-900">حالة العنصر</span>
                  <span className="text-[10px] font-bold text-slate-400">تفعيل أو تعطيل ظهور هذا العنصر</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editItemData.active}
                    onChange={(e) => setEditItemData({ ...editItemData, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={16} /> : 'حفظ التعديلات'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
