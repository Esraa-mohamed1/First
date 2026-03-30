'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, GraduationCap, Video, CreditCard, Loader2 } from 'lucide-react';
import StatCard from '@/components/Academic/StatsCard';
import OverviewChart from '@/components/Academic/Charts/OverviewChart';
import RevenueChart from '@/components/Academic/Charts/RevenueChart';
import VisitsByDeviceChart from '@/components/Academic/Charts/VisitsByDeviceChart';
import VisitsByCountryChart from '@/components/Academic/Charts/VisitsByCountryChart';
import { getStats } from '@/services/courses';
import toast from 'react-hot-toast';

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error(error);
      toast.error('فشل تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-10 p-4 md:p-6" dir="rtl">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-black text-gray-900">إحصائيات الأكاديمية</h2>
           <p className="text-gray-400 font-bold mt-2 text-lg">تحليل شامل لأداء أكاديميتك</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 bg-white border border-gray-100 hover:bg-gray-50 text-gray-500 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm">
            <span>تاريخ</span>
            <TrendingUp size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <Loader2 className="animate-spin text-blue-600" size={40} />
           <p className="text-gray-400 font-bold">جاري تحميل الإحصائيات...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="عدد الطلاب النشطة"
              value={stats?.active_students || '2,689'}
              trend={{ value: 8.5, isPositive: true }}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="عدد الدورات المنشورة"
              value={stats?.published_courses || '211'}
              trend={{ value: 1.2, isPositive: false }}
              icon={Video}
              color="red"
            />
            <StatCard
              title="عدد المدربين"
              value={stats?.instructors_count || '40,689'}
              trend={{ value: 2.6, isPositive: true }}
              icon={GraduationCap}
              color="orange"
            />
            <StatCard
              title="اجمالي الايراد هذا الشهر"
              value={stats?.total_revenue || '40,689'}
              trend={{ value: 2.6, isPositive: true }}
              icon={CreditCard}
              color="purple"
            />
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 gap-8">
            <OverviewChart />
            <RevenueChart />
          </div>

          {/* Visits Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VisitsByDeviceChart />
            <VisitsByCountryChart />
          </div>
        </>
      )}
    </div>
  );
}
