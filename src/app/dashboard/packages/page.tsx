'use client';

import Link from 'next/link';
import { Plus, Download, Edit, Search } from 'lucide-react';
import { useState } from 'react';

// Mock Data
const packages = [
  { id: 1, name: 'أساسي', price: 2500, duration: '3 شهور', academies: 167, status: 'active' },
  { id: 2, name: 'بريميوم', price: 4200, duration: '6 شهور', academies: 512, status: 'active' },
  { id: 3, name: 'ألترا', price: 5200, duration: '9 شهور', academies: 216, status: 'inactive' },
];

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState('');

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
            <span>إضافة / تعديل باقة</span>
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
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pr-12 pl-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-right px-8 py-5 text-sm font-black text-gray-500">اسم الباقة</th>
                <th className="text-right px-8 py-5 text-sm font-black text-gray-500">السعر</th>
                <th className="text-right px-8 py-5 text-sm font-black text-gray-500">مدة الاشتراك</th>
                <th className="text-center px-8 py-5 text-sm font-black text-gray-500">عدد الاكاديميات المشتركة</th>
                <th className="text-center px-8 py-5 text-sm font-black text-gray-500">حالة الباقة</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6 whitespace-nowrap font-bold text-gray-900">{pkg.name}</td>
                  <td className="px-8 py-6 whitespace-nowrap font-bold text-gray-900">{pkg.price.toLocaleString()}</td>
                  <td className="px-8 py-6 whitespace-nowrap font-medium text-gray-600">{pkg.duration}</td>
                  <td className="px-8 py-6 whitespace-nowrap font-bold text-gray-900 text-center">{pkg.academies}</td>
                  <td className="px-8 py-6 whitespace-nowrap text-center">
                    <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-black ${
                      pkg.status === 'active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {pkg.status === 'active' ? 'نشط' : 'معطلة'}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-left">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={pkg.status === 'active'} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                            <Edit size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
