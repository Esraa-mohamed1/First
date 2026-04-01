'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LayoutGrid, Search, Edit, Trash2, Loader2, X, Check } from 'lucide-react';
import { getCategories, deleteCategory } from '@/services/courses';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CategoryModal from '@/components/Academic/Modals/CategoryModal';

const MySwal = withReactContent(Swal);

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error('فشل تحميل الفئات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم حذف الفئة نهائياً!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفها!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        await deleteCategory(id);
        MySwal.fire(
          'تم الحذف!',
          'تم حذف الفئة بنجاح.',
          'success'
        );
        fetchCategories();
      } catch (error) {
        MySwal.fire(
          'فشل!',
          'حدث خطأ أثناء محاولة حذف الفئة.',
          'error'
        );
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">فئات الدورات</h1>
          <p className="text-gray-500 font-bold text-sm mt-1">إدارة الأقسام والفئات الخاصة بدوراتك</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
        >
          <Plus size={18} />
          <span>إضافة فئة جديدة</span>
        </button>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSuccess={fetchCategories}
      />

      {/* Search & Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="البحث عن فئة..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-12 py-3 text-sm outline-none focus:border-blue-600 font-bold transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">إجمالي الفئات</p>
            <p className="text-xl font-black text-gray-900">{categories.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <LayoutGrid size={24} />
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-400 font-bold">جاري تحميل الفئات...</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform" />

              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-gray-50 flex items-center justify-center text-blue-600">
                  <LayoutGrid size={24} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${category.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {category.is_active ? <Check size={10} /> : <X size={10} />}
                    {category.is_active ? 'نشطة' : 'غير نشطة'}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative z-10 space-y-2">
                <h3 className="text-lg font-black text-gray-900">{category.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">عدد الدورات :</span>
                  <span className="text-xs font-black text-blue-600">{category.courses_count || 0}</span>
                </div>
              </div>

              <button
                onClick={() => router.push(`/academic/courses/categories/${category.id}`)}
                className="w-full mt-6 py-3 bg-gray-50 text-gray-500 font-bold rounded-xl text-xs hover:bg-blue-600 hover:text-white transition-all"
              >
                عرض الدورات
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <LayoutGrid size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900">لا يوجد فئات حتى الآن</h3>
            <p className="text-gray-400 font-bold text-sm max-w-xs mx-auto">ابدأ بإضافة أول فئة لتنظيم دوراتك بشكل أفضل لطلابك.</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 mt-4"
          >
            إضافة أول فئة
          </button>
        </div>
      )}
    </div>
  );
}
