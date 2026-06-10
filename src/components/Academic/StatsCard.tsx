'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
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
  blue: 'text-blue-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  green: 'text-green-600',
  red: 'text-red-600',
};

const iconBg = {
  blue: 'bg-blue-50 text-blue-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
};

const StatCard = ({ title, value, trend, icon: Icon, color }: StatCardProps) => {
  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full min-h-[140px] md:min-h-[155px] relative">
      <div className="flex items-start justify-between gap-4 mb-3 relative z-10 w-full">
        {/* Right side: text details (flexible and won't overflow) */}
        <div className="text-right space-y-1 flex-1 min-w-0">
          <h3 className="text-xs font-bold text-gray-500 whitespace-normal break-words leading-tight">{title}</h3>
          <p className="text-xl md:text-2xl font-black text-gray-900 leading-none mt-1">{value}</p>
        </div>
        {/* Left side: circular icon container (larger size) */}
        <div className={twMerge("w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-300", iconBg[color])}>
          <Icon className="w-6 h-6 md:w-7 md:h-7" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 mt-auto self-start relative z-10">
          <div className={twMerge(
            "flex items-center gap-1 font-bold text-[11px] md:text-xs",
            trend.isPositive ? "text-emerald-500" : "text-rose-500"
          )}>
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{trend.value}%</span>
            <span className="text-gray-400 font-medium">زيادة عن أمس</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;

