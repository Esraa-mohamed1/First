'use client';

import { Users, GraduationCap, Building2, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import StatCard from '@/components/Dashboard/StatsCard';
import OverviewChart from '@/components/Dashboard/Charts/OverviewChart';
import RevenueChart from '@/components/Dashboard/Charts/RevenueChart';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">لوحة التحكم</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
            <span>تصفية الفترة</span>
            <TrendingUp size={16} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="عدد الأكاديميات النشطة"
          value="40,689"
          trend={{ value: 8.5, isPositive: true }}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="عدد الأكاديميات باشتراك منتهي"
          value="211"
          trend={{ value: 1.2, isPositive: false }}
          icon={AlertCircle}
          color="orange"
        />
        <StatCard
          title="عدد الدورات المنشورة"
          value="40,689"
          trend={{ value: 2.6, isPositive: true }}
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="عدد المدربين"
          value="40,689"
          trend={{ value: 2.6, isPositive: true }}
          icon={Users}
          color="orange"
        />
        
        {/* Row 2 */}
        <button className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all group cursor-pointer h-full min-h-[140px]">
          <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
            <Plus size={24} />
          </div>
          <span className="font-bold text-sm">إضافة عنصر جديد</span>
        </button>

        <StatCard
          title="عدد الاشتراكات الجدد هذا الشهر"
          value="40,689"
          trend={{ value: 2.6, isPositive: true }}
          icon={GraduationCap}
          color="green"
        />
        <StatCard
          title="اجمالي الايراد الحالي"
          value="40,689"
          trend={{ value: 2.6, isPositive: true }}
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="عدد الطلاب"
          value="40,689"
          trend={{ value: 9.2, isPositive: true }}
          icon={GraduationCap}
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <OverviewChart />
        <RevenueChart />
      </div>

      {/* Tables Section */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-black text-gray-900">آخر الأكاديميات المسجلة</h3>
          <div className="relative w-64">
            <input 
                type="text" 
                placeholder="البحث" 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">اسم الأكاديمية</th>
                <th className="text-right px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">تاريخ الالغاء</th>
                <th className="text-right px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">عدد الأيام منذ الالغاء</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <span className="font-bold text-sm text-gray-900">Horizon Academy</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">22/10/2022</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">30 يوم</td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <button className="text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                        عرض التفاصيل
                    </button>
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
