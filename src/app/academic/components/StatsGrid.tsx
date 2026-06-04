'use client';

import React from 'react';
import { Wallet, Users, Eye, RotateCw } from 'lucide-react';
import StatCard from '@/components/Academic/StatsCard';

interface StatsGridProps {
  stats: any;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
      <StatCard
        title="اجمالي المبيعات"
        value={stats?.total_revenue ? `${stats.total_revenue}$` : "40,689$"}
        trend={{ value: 8.5, isPositive: true }}
        icon={Wallet}
        color="purple"
      />
      <StatCard
        title="عدد الطلاب الجدد"
        value={stats?.active_students ? String(stats.active_students) : "2,689"}
        trend={{ value: 10.5, isPositive: true }}
        icon={Users}
        color="blue"
      />
      <StatCard
        title="عدد الزيارات"
        value="205"
        trend={{ value: 8.5, isPositive: true }}
        icon={Eye}
        color="orange"
      />
      <StatCard
        title="عدد الدورات"
        value={stats?.published_courses ? String(stats.published_courses) : "1,436"}
        trend={{ value: 2.6, isPositive: true }}
        icon={RotateCw}
        color="red"
      />
      <StatCard
        title="الرصيد الحالي"
        value="20,214"
        trend={{ value: 2.6, isPositive: true }}
        icon={Wallet}
        color="green"
      />
    </div>
  );
};
