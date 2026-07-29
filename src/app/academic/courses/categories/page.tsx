'use client';

import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Search, Check, X, 
  ListFilter, Calendar, BookOpen, CalendarCheck, Layers,
  Info, CheckCircle, Zap, ShieldCheck, Sparkles, HelpCircle, User
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Item {
  id: string;
  name: string;
  desc: string;
  stage: string;
  active: boolean;
}

export default function AcademicClassificationPage() {
  const [activeTab, setActiveTab] = useState<'grades' | 'semesters' | 'subjects' | 'years' | 'general'>('grades');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [addName, setAddName] = useState('');
  const [addDesc, setAddDesc] = useState('');

  const [editItemData, setEditItemData] = useState<Item>({
    id: '',
    name: '',
    desc: '',
    stage: 'المرحلة الثانوية',
    active: true
  });

  // Mock data structure
  const [dataStore, setDataStore] = useState<Record<string, Item[]>>({
    grades: [
      { id: '01', name: 'أولى ثانوي', desc: 'الصف الأول من المرحلة الثانوية', stage: 'المرحلة الثانوية', active: true },
      { id: '02', name: 'ثانية ثانوي', desc: 'الصف الثاني من المرحلة الثانوية', stage: 'المرحلة الثانوية', active: true },
      { id: '03', name: 'ثالثة ثانوي', desc: 'الصف الثالث من المرحلة الثانوية', stage: 'المرحلة الثانوية', active: false }
    ],
    semesters: [
      { id: '01', name: 'الفصل الدراسي الأول', desc: 'فصل الخريف والربيع الأكاديمي', stage: 'عام', active: true },
      { id: '02', name: 'الفصل الدراسي الثاني', desc: 'فصل الربيع والتخرج الأكاديمي', stage: 'عام', active: true }
    ],
    subjects: [
      { id: '01', name: 'الرياضيات والتفاضل', desc: 'منهج الرياضيات المتقدمة للصفوف الثانوية', stage: 'المرحلة الثانوية', active: true },
      { id: '02', name: 'الفيزياء التطبيقية', desc: 'مبادئ الفيزياء والتجارب العلمية', stage: 'المرحلة الثانوية', active: true }
    ],
    years: [
      { id: '01', name: '2025/2026', desc: 'العام الدراسي الحالي', stage: 'عام', active: true },
      { id: '02', name: '2024/2025', desc: 'العام الدراسي السابق', stage: 'عام', active: false }
    ],
    general: [
      { id: '01', name: 'تصميم الواجهات UI/UX', desc: 'مسار التصميم الرقمي وتجربة المستخدم', stage: 'عام', active: true },
      { id: '02', name: 'البرمجة والتطوير', desc: 'مسار تطوير الويب والمنتجات الرقمية', stage: 'عام', active: true }
    ]
  });

  const currentList = dataStore[activeTab] || [];
  const filteredList = currentList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;

    const newId = String(currentList.length + 1).padStart(2, '0');
    const newItem: Item = {
      id: newId,
      name: addName.trim(),
      desc: addDesc.trim() || 'وصف مختصر للتصنيف',
      stage: activeTab === 'grades' ? 'المرحلة الثانوية' : 'عام',
      active: true
    };

    setDataStore(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newItem]
    }));

    toast.success('تمت إضافة العنصر بنجاح!');
    setAddName('');
    setAddDesc('');
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (item: Item) => {
    setEditItemData(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDataStore(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(item => item.id === editItemData.id ? editItemData : item)
    }));

    toast.success('تم تحديث البيانات بنجاح!');
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      setDataStore(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
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

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          <span>إضافة جديد</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('grades')}
            className={`px-6 py-4 text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
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
            className={`px-6 py-4 text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
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
            className={`px-6 py-4 text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
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
            className={`px-6 py-4 text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'years'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CalendarCheck size={16} />
            <span>الأعوام الدراسية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-6 py-4 text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers size={16} />
            <span>تصنيفات عامة</span>
          </button>
        </div>

        {/* Search Bar Strip */}
        <div className="p-4 bg-slate-50/30 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="بحث في هذا التصنيف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
          <span className="text-xs font-bold text-slate-400 shrink-0">
            عدد العناصر: {filteredList.length}
          </span>
        </div>

        {/* Content Table Area */}
        <div className="min-h-[320px]">
          {filteredList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-200 text-xs font-black text-slate-500">
                    <th className="px-6 py-4 w-16">#</th>
                    <th className="px-6 py-4">الاسم والوصف</th>
                    <th className="px-6 py-4">المرحلة الدراسية</th>
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
                          <span className="text-[11px] text-slate-400 font-medium">{item.desc}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.stage}</td>
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

            <form onSubmit={handleAddSubmit} className="p-6 space-y-5 text-right">
              <div className="space-y-2">
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

              <div className="space-y-2">
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  حفظ البيانات
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

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5 text-right">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">اسم التصنيف *</label>
                <input
                  type="text"
                  required
                  value={editItemData.name}
                  onChange={(e) => setEditItemData({ ...editItemData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">الوصف</label>
                <textarea
                  rows={3}
                  value={editItemData.desc}
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  حفظ التعديلات
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
