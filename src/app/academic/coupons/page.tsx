'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Copy, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  ChevronLeft,
  X
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const CouponsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const coupons = [
    { code: 'SUMMER2024', discount: '20%', usage: '142/500', expires: '2024-09-01', status: 'active', type: 'percentage' },
    { code: 'WELCOME50', discount: '50 ر.س', usage: '84/200', expires: '2024-12-31', status: 'active', type: 'fixed' },
    { code: 'FREE_SHIP', discount: '100%', usage: '12/50', expires: '2024-06-15', status: 'paused', type: 'percentage' },
    { code: 'BLACK_FRIDAY', discount: '40%', usage: '0/1000', expires: '2024-11-25', status: 'scheduled', type: 'percentage' },
  ];

  const stats = [
    { label: 'كوبونات نشطة', value: '12', icon: Ticket, color: 'blue' },
    { label: 'إجمالي التوفير', value: '14,250 ر.س', icon: TrendingUp, color: 'emerald' },
    { label: 'مرات الاستخدام', value: '2,480', icon: Users, color: 'purple' },
  ];

  return (
    <div className="space-y-10 pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">كوبونات الخصم</h1>
          <p className="text-gray-500 mt-2 font-medium">إدارة رموز الخصم والعروض الترويجية</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          <Plus size={22} />
          <span>إنشاء كوبون جديد</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm flex items-center gap-6 group hover:border-blue-300 transition-all">
            <div className={twMerge(
              "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm",
              stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
              stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
            )}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
          <input 
            type="text" 
            placeholder="البحث عن كود خصم..."
            className="w-full pr-16 pl-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-gray-50 text-gray-500 font-black rounded-[1.5rem] hover:bg-gray-100 transition-all border border-gray-50">
            <Filter size={20} />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {coupons.map((coupon, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden group hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col"
          >
            <div className="p-8 border-b border-gray-50 bg-gray-50/30">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                  <Ticket size={24} />
                </div>
                <div className={twMerge(
                  "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                  coupon.status === 'active' ? "bg-green-50 text-green-600 border-green-100" :
                  coupon.status === 'scheduled' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-100 text-gray-400 border-gray-200"
                )}>
                  {coupon.status}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{coupon.code}</h3>
                <p className="text-blue-600 font-black text-sm">{coupon.discount} Discount</p>
              </div>
            </div>

            <div className="p-8 space-y-6 flex-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usage</span>
                  <span className="text-sm font-black text-gray-700">{coupon.usage}</span>
                </div>
                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${(parseInt(coupon.usage.split('/')[0]) / parseInt(coupon.usage.split('/')[1])) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <Clock size={16} />
                <span className="text-xs font-bold tracking-tighter">Expires on: {coupon.expires}</span>
              </div>
            </div>

            <div className="p-6 border-t border-gray-50 flex items-center gap-2">
              <button className="flex-1 py-3 bg-gray-50 text-gray-600 font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                <Copy size={14} />
                Copy Code
              </button>
              <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CouponsPage;
