'use client';

import { LucideIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface StatCardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color: 'blue' | 'orange' | 'purple' | 'green' | 'red';
}

const colors = {
  blue: 'bg-blue-50 text-blue-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
};

const iconBg = {
  blue: 'bg-blue-100',
  orange: 'bg-orange-100',
  purple: 'bg-purple-100',
  green: 'bg-green-100',
  red: 'bg-red-100',
};

const StatCard = ({ title, value, trend, icon: Icon, color }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full min-h-[160px]">
      <div className="flex items-center justify-between mb-4">
        <div className="text-right">
            <h3 className="text-sm font-bold text-gray-400 mb-1">{title}</h3>
            <p className="text-2xl font-black text-gray-900 leading-tight">{value}</p>
        </div>
        <div className={twMerge("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", iconBg[color])}>
          <Icon size={28} className={colors[color].split(' ')[1]} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-2 mt-auto self-end">
          <span className={twMerge(
            "text-xs font-black",
            trend.isPositive ? "text-green-500" : "text-red-500"
          )}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}% زيادة من أمس
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
