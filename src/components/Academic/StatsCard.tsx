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
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  purple: 'bg-purple-100 text-purple-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
};

const iconBg = {
  blue: 'bg-blue-600/10 border-blue-100',
  orange: 'bg-orange-600/10 border-orange-100',
  purple: 'bg-purple-600/10 border-purple-100',
  green: 'bg-green-600/10 border-green-100',
  red: 'bg-red-600/10 border-red-100',
};

const StatCard = ({ title, value, trend, icon: Icon, color }: StatCardProps) => {
  return (
    <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col justify-between h-full min-h-[180px] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className={twMerge("absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] transition-transform group-hover:scale-150 duration-700", colors[color].split(' ')[0])} />
      
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="text-right space-y-1">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-black text-gray-900 leading-tight tracking-tight">{value}</p>
        </div>
        <div className={twMerge("w-16 h-16 rounded-[1.5rem] border-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-500", iconBg[color])}>
          <Icon size={30} className={colors[color].split(' ')[1]} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-2 mt-auto self-end relative z-10">
          <div className={twMerge(
            "flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-[11px] shadow-sm",
            trend.isPositive ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
          )}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
            <span className="opacity-70 font-bold mr-1">من أمس</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
