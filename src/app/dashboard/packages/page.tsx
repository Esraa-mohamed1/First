'use client';

import Link from 'next/link';
import { Plus, Download, Edit, Search, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPackages, deletePackage, updatePackage } from '@/services/packages';
import { Package } from '@/types/api';
import toast from 'react-hot-toast';

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const data = await getPackages();
      setPackages(data);
    } catch (error) {
      toast.error('فشل في تحميل الباقات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;

    try {
      const response = await deletePackage(id);
      if (response.status) {
        toast.success('تم حذف الباقة بنجاح');
        setPackages(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error(response.message || 'فشل في حذف الباقة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  const handleToggleStatus = async (pkg: Package) => {
    const newStatus = pkg.is_active === 1 ? 0 : 1;
    try {
      const response = await updatePackage(pkg.id, {
        ...pkg,
        is_active: newStatus
      });
      if (response.status) {
        toast.success('تم تحديث الحالة بنجاح');
        setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, is_active: newStatus } : p));
      }
    } catch (error) {
      toast.error('فشل في تحديث الحالة');
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.titile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pkg.description || pkg.desc || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">ادارة الباقات</h2>
        <div className="flex gap-3">
          <Link
            href="/dashboard/packages/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>إضافة باقة جديدة</span>
          </Link>
          <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors">
            <Download size={20} />
            <span>تصدير Excel</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-black text-gray-900">تفاصيل الباقات</h3>
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث عن باقة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pr-12 pl-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-medium text-right"
            />
          </div>
        </div>

        <div className="p-8 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={40} className="text-blue-600 animate-spin" />
              <p className="text-gray-500 font-bold">جاري تحميل الباقات...</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-gray-500 font-bold">لا يوجد باقات حالياً</p>
              <Link href="/dashboard/packages/create" className="text-blue-600 font-bold hover:underline">أضف باقة جديدة الآن</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="group relative bg-white border border-gray-100 rounded-[32px] p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${pkg.is_active === 1
                      ? 'bg-green-50 text-green-600 border border-green-100'
                      : 'bg-gray-50 text-gray-400 border border-gray-100'
                      }`}>
                      {pkg.is_active === 1 ? 'Active' : 'Hidden'}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(pkg)}
                      className={`w-10 h-6 rounded-full transition-colors relative ${pkg.is_active === 1 ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${pkg.is_active === 1 ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                  {/* Icon/Avatar Placeholder */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 font-black">
                      {pkg.titile?.charAt(0)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1 mb-6">
                    <h4 className="text-lg font-black text-gray-900 line-clamp-1">{pkg.titile}</h4>
                    <p className="text-sm font-bold text-gray-400">{pkg.duration_months} شهر</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-black text-blue-600">{pkg.price}</span>
                    <span className="text-xs font-bold text-gray-400">ريال</span>
                  </div>

                  {/* Actions - Visible on Hover */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      href={`/dashboard/packages/create?id=${pkg.id}`}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit size={14} />
                      تعديل
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
