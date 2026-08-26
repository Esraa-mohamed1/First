'use client';

import React from 'react';
import { Wallet, Users, ShoppingBag, RotateCw } from 'lucide-react';
import StatCard from '@/components/Academic/StatsCard';

interface StatsGridProps {
  stats: any;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-5">
      <StatCard
        title="اجمالي المبيعات"
        value={stats?.total_revenue !== undefined ? `${stats.total_revenue}$` : "0$"}
        trend={{ 
          value: stats?.total_revenue_percentage !== undefined ? Math.abs(stats.total_revenue_percentage) : 0, 
          isPositive: stats?.total_revenue_percentage !== undefined ? stats.total_revenue_percentage >= 0 : true 
        }}
        icon={Wallet}
        color="purple"
      />
      <StatCard
        title="عدد الطلاب الجدد"
        value={stats?.active_students !== undefined ? String(stats.active_students) : "0"}
        trend={{ 
          value: stats?.active_students_percentage !== undefined ? Math.abs(stats.active_students_percentage) : 0, 
          isPositive: stats?.active_students_percentage !== undefined ? stats.active_students_percentage >= 0 : true 
        }}
        icon={Users}
        color="blue"
      />
      <StatCard
        title="عدد الحقائب"
        value={stats?.bags !== undefined ? String(stats.bags) : "0"}
        trend={{ 
          value: stats?.bags_percentage !== undefined ? Math.abs(stats.bags_percentage) : 0, 
          isPositive: stats?.bags_percentage !== undefined ? stats.bags_percentage >= 0 : true 
        }}
        icon={ShoppingBag}
        color="orange"
      />
      <StatCard
        title="عدد الدورات"
        value={stats?.published_courses !== undefined ? String(stats.published_courses) : "0"}
        trend={{ 
          value: stats?.published_courses_percentage !== undefined ? Math.abs(stats.published_courses_percentage) : 0, 
          isPositive: stats?.published_courses_percentage !== undefined ? stats.published_courses_percentage >= 0 : true 
        }}
        icon={RotateCw}
        color="red"
      />
    </div>
  );
};
