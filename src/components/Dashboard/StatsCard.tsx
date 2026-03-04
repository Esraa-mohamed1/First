'use client';

import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'orange' | 'green' | 'red';
}

const StatCard = ({ title, value, trend, icon: Icon, color }: StatCardProps) => {
  const colorStyles = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-bold text-gray-500 text-right">{title}</p>
        
        <div className="flex justify-between items-center">
            <div className={twMerge(clsx('w-12 h-12 rounded-full flex items-center justify-center', colorStyles[color]))}>
                <Icon size={24} />
            </div>
            <h3 className="text-3xl font-black text-gray-900">{value}</h3>
        </div>

        {trend && (
          <div className="flex items-center justify-end gap-1 text-xs font-bold">
            <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'} dir="ltr">
                {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
            <span className="text-gray-400">زيادة عن أمس</span>
            {trend.isPositive ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                    <path d="M12 4L12 20M12 4L18 10M12 4L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                    <path d="M12 20L12 4M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
