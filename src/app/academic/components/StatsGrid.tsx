'use client';

import React, { useState } from 'react';
import { Wallet, Users, ShoppingBag, RotateCw } from 'lucide-react';
import StatCard from '@/components/Academic/StatsCard';
import { getCurrencySymbol } from '@/types/bags';

interface StatsGridProps {
  stats: any;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'SAR' | 'EGP' | 'KWD' | 'USD'>('SAR');

  const getSalesValue = () => {
    if (!stats) return `0 ${getCurrencySymbol(selectedCurrency)}`;

    const curAmount = stats.salesByCurrency?.[selectedCurrency] ?? (selectedCurrency === 'SAR' ? (stats.total_revenue ?? 0) : 0);
    const symbol = getCurrencySymbol(selectedCurrency);
    return `${Number(curAmount).toLocaleString('ar-EG')} ${symbol}`;
  };

  const currencyOptions = [
    { code: 'SAR', label: 'ر.س' },
    { code: 'EGP', label: 'ج.م' },
    { code: 'KWD', label: 'د.ك' },
    { code: 'USD', label: '$' },
  ];

  return (
    <div className="space-y-2" dir="rtl">
      {/* Top Bar for Total Sales Currency Selection */}
      <div className="flex items-center justify-between bg-white border border-gray-100 p-2 rounded-2xl shadow-xs flex-wrap gap-2">
        <div className="flex items-center gap-2 pr-1">
          <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
          <span className="text-xs font-black text-gray-700">تصفية اجمالي المبيعات حسب العملة:</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl">
          {currencyOptions.map(opt => (
            <button
              key={opt.code}
              onClick={() => setSelectedCurrency(opt.code as any)}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                selectedCurrency === opt.code
                  ? 'bg-primary text-white shadow-xs scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard
          title={`اجمالي المبيعات (${getCurrencySymbol(selectedCurrency)})`}
          value={getSalesValue()}
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
    </div>
  );
};

