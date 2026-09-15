'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Building2, TrendingUp, AlertCircle } from 'lucide-react';
import StatCard from '@/components/Dashboard/StatsCard';
import OverviewChart from '@/components/Dashboard/Charts/OverviewChart';
import RevenueChart from '@/components/Dashboard/Charts/RevenueChart';
import api from '@/lib/api';
import { getStoredAuthToken } from '@/lib/auth-storage';

interface StatisticMetric {
  value: number;
  change_pct: number;
}

interface ChartMonthData {
  month: string;
  total: number;
}

interface DashboardStatisticsData {
  new_subscriptions_this_month: StatisticMetric;
  active_academies: StatisticMetric;
  expired_academies: StatisticMetric;
  total_revenue: StatisticMetric;
  chart_last_12_months?: ChartMonthData[];
}

interface TransformedChartData {
  name: string;
  value: number;
}

const formatMonthToArabic = (monthStr: string): string => {
  const monthMap: Record<string, string> = {
    '01': 'يناير',
    '02': 'فبراير',
    '03': 'مارس',
    '04': 'أبريل',
    '05': 'مايو',
    '06': 'يونيو',
    '07': 'يوليو',
    '08': 'أغسطس',
    '09': 'سبتمبر',
    '10': 'أكتوبر',
    '11': 'نوفمبر',
    '12': 'ديسمبر',
    '1': 'يناير',
    '2': 'فبراير',
    '3': 'مارس',
    '4': 'أبريل',
    '5': 'مايو',
    '6': 'يونيو',
    '7': 'يوليو',
    '8': 'أغسطس',
    '9': 'سبتمبر',
  };

  if (!monthStr) return '';
  const parts = monthStr.split('-');
  const monthNum = parts.length > 1 ? parts[1] : parts[0];
  return monthMap[monthNum] || monthStr;
};

export default function DashboardPage() {
  const [statsData, setStatsData] = useState<DashboardStatisticsData | null>(null);
  const [chartData, setChartData] = useState<TransformedChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const token = getStoredAuthToken();
        const response = await api.get<{
          success: boolean;
          status: number;
          message: string;
          data: DashboardStatisticsData;
        }>('/Statistics-dashboard', {
          baseURL: 'https://api.darab.academy/api/superAdmin',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (response.data && response.data.data) {
          const fetchedData = response.data.data;
          setStatsData(fetchedData);

          if (Array.isArray(fetchedData.chart_last_12_months)) {
            const transformed = fetchedData.chart_last_12_months.map((item) => ({
              name: formatMonthToArabic(item.month),
              value: item.total,
            }));
            setChartData(transformed);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="space-y-8 relative">
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
          value={statsData ? statsData.active_academies.value.toLocaleString() : (isLoading ? '...' : '—')}
          trend={
            statsData
              ? {
                  value: statsData.active_academies.change_pct,
                  isPositive: statsData.active_academies.change_pct >= 0,
                }
              : undefined
          }
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="عدد الأكاديميات باشتراك منتهي"
          value={statsData ? statsData.expired_academies.value.toLocaleString() : (isLoading ? '...' : '—')}
          trend={
            statsData
              ? {
                  value: statsData.expired_academies.change_pct,
                  isPositive: statsData.expired_academies.change_pct >= 0,
                }
              : undefined
          }
          icon={AlertCircle}
          color="orange"
        />
        <StatCard
          title="عدد الاشتراكات الجدد هذا الشهر"
          value={statsData ? statsData.new_subscriptions_this_month.value.toLocaleString() : (isLoading ? '...' : '—')}
          trend={
            statsData
              ? {
                  value: statsData.new_subscriptions_this_month.change_pct,
                  isPositive: statsData.new_subscriptions_this_month.change_pct >= 0,
                }
              : undefined
          }
          icon={GraduationCap}
          color="green"
        />
        <StatCard
          title="اجمالي الايراد الحالي"
          value={statsData ? statsData.total_revenue.value.toLocaleString() : (isLoading ? '...' : '—')}
          trend={
            statsData
              ? {
                  value: statsData.total_revenue.change_pct,
                  isPositive: statsData.total_revenue.change_pct >= 0,
                }
              : undefined
          }
          icon={GraduationCap}
          color="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <OverviewChart data={chartData} />
        <RevenueChart />
      </div>
    </div>
  );
}
