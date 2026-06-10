'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  ShoppingBag,
  Target,
  BarChart3,
  Calendar,
  Download,
  ChevronLeft,
  Activity,
  Award,
  BookOpen,
  Clock,
  Landmark,
  Settings,
  ChevronDown,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { getWithdrawalRequests, WithdrawalRequest } from '@/services/finance';

const FinanceOverview = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const data = await getWithdrawalRequests();
        setWithdrawalRequests(data);
      } catch (error) {
        console.error('Failed to fetch withdrawal requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const stats = [
    {
      label: 'اجمالي المبيعات',
      value: '40,689',
      currency: '$',
      trend: '8.5% زيادة عن أمس',
      isPositive: true,
      icon: TrendingUp,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'الرصيد المتاح للسحب',
      value: '30,689',
      currency: '$',
      trend: '8.5% زيادة عن أمس',
      isPositive: true,
      icon: Wallet,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'الرصيد المعلق',
      value: '10,000',
      currency: '$',
      trend: '1.2% تراجع عن أمس',
      isPositive: false,
      icon: Clock,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      label: 'عدد الطلبات',
      value: '142 طلب',
      currency: '',
      trend: '8.5% زيادة عن أمس',
      isPositive: true,
      icon: ShoppingBag,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'rejected':
      case 'مرفوض':
        return 'bg-gray-100 text-gray-500';
      case 'pending':
      case 'معلق':
        return 'bg-amber-100 text-amber-600';
      case 'completed':
      case 'approved':
      case 'مقبول':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  const translateStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'rejected': return 'مرفوض';
      case 'pending': return 'معلق';
      case 'completed':
      case 'approved': return 'مقبول';
      default: return status;
    }
  };

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900">نظرة عامة</h1>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          <button className="px-6 py-2 bg-gray-50 text-gray-400 font-bold rounded-lg text-sm">التاريخ</button>
          <div className="px-3 py-2 text-gray-400 border-r border-gray-100">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm group hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={twMerge("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bgColor, stat.iconColor)}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 font-bold text-sm">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-black text-gray-900">{stat.value}{stat.currency}</h3>
              </div>
              <p className={twMerge(
                "text-[10px] font-bold flex items-center gap-1 mt-2",
                stat.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Right Section: Withdrawal Requests Table */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-gray-900">آخر طلبات السحب</h2>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button className="px-6 py-2 text-gray-400 font-bold text-sm">التاريخ</button>
              <div className="px-2 py-2 text-gray-400 border-r border-gray-200">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto min-h-[300px] relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-gray-400 font-bold text-sm">رقم السحب</th>
                    <th className="px-8 py-4 text-gray-400 font-bold text-sm">المبلغ</th>
                    <th className="px-8 py-4 text-gray-400 font-bold text-sm">تاريخ التسجيل</th>
                    <th className="px-8 py-4 text-gray-400 font-bold text-sm text-center">حالة طلب السحب</th>
                    <th className="px-8 py-4 text-gray-400 font-bold text-sm"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {withdrawalRequests.length > 0 ? (
                    withdrawalRequests.slice(0, 5).map((req, i) => (
                      <tr key={req.id || i} className="hover:bg-gray-50/50 transition-all">
                        <td className="px-8 py-5 text-gray-900 font-bold">#{req.id}</td>
                        <td className="px-8 py-5 text-gray-900 font-black">{req.amount}</td>
                        <td className="px-8 py-5 text-gray-500 font-medium">
                          {new Date(req.created_at).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-center">
                            <span className={twMerge("px-4 py-1.5 rounded-xl text-xs font-bold", getStatusStyle(req.status))}>
                              {translateStatus(req.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <button className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-400 hover:bg-white hover:shadow-sm transition-all">عرض التفاصيل</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-10 text-center text-gray-400 font-bold">
                        لا توجد طلبات سحب حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-50 flex items-center justify-between flex-col md:flex-row gap-4">
            <p className="text-sm font-bold text-gray-400">
              عرض 1 إلى {Math.min(5, withdrawalRequests.length)} من أصل {withdrawalRequests.length} طلب
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-100 rounded-lg text-gray-400"><ChevronLeft size={16} className="rotate-180" /></button>
              <button className="w-8 h-8 bg-blue-600 text-white rounded-lg font-bold text-sm">1</button>
              <button className="w-8 h-8 text-gray-400 font-bold text-sm">2</button>
              <button className="w-8 h-8 text-gray-400 font-bold text-sm">3</button>
              <button className="p-2 border border-gray-100 rounded-lg text-gray-400"><ChevronLeft size={16} /></button>
            </div>
          </div>
        </div>

        {/* Left Section: Payment Method Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-gray-900">طريقة الدفع الحالية</h2>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                <Landmark size={24} />
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-200 relative group">
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
              <p className="text-gray-400 text-xs font-bold mb-2">المحفظة الافتراضية</p>
              <h3 className="text-2xl font-black text-blue-600 leading-tight mb-4">استلام الأموال عن طريق درب</h3>
              <div className="flex items-center gap-2 mb-8">
                <span className="text-[10px] font-black text-gray-400 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-green-500" /> نشط وجاهز للاستقبال
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                يتم تحويل المبالغ تلقائياً الى حسابك في درب عند طلب السحب، يمكنك تغيير هذه الأعدادات في اي وقت.
              </p>
            </div>

            <button className="w-full mt-8 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
              <Settings size={20} />
              <span>ادارة طرق الدفع</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;
