'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  CreditCard, 
  History, 
  TrendingUp, 
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Download,
  Filter,
  ChevronLeft,
  Smartphone,
  ShieldCheck,
  Search,
  ArrowRight,
  Landmark,
  PiggyBank
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const WalletPage = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const transactions = [
    { id: 'TXN-9821', title: 'أرباح دورة: تصميم واجهات المستخدم', date: 'اليوم، 10:30 ص', amount: '+450.00', status: 'completed', type: 'earning' },
    { id: 'TXN-9820', title: 'سحب رصيد - بنك الراجحي', date: 'أمس، 02:15 م', amount: '-2,000.00', status: 'pending', type: 'withdrawal' },
    { id: 'TXN-9819', title: 'أرباح دورة: تطوير تطبيقات الويب', date: '14 مايو، 09:00 ص', amount: '+320.00', status: 'completed', type: 'earning' },
    { id: 'TXN-9818', title: 'أرباح دورة: لغة جافاسكريبت', date: '13 مايو، 04:45 م', amount: '+280.00', status: 'completed', type: 'earning' },
    { id: 'TXN-9817', title: 'سحب رصيد - STC Pay', date: '12 مايو، 11:20 ص', amount: '-1,500.00', status: 'completed', type: 'withdrawal' },
  ];

  const payoutMethods = [
    { id: 1, name: 'مصرف الراجحي', type: 'Bank Account', account: '**** 4567', icon: Building2, isDefault: true, color: 'blue' },
    { id: 2, name: 'STC Pay', type: 'Digital Wallet', account: '054 **** 123', icon: Smartphone, isDefault: false, color: 'purple' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      {/* Header with Glassmorphism Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">المحفظة المالية</h1>
          <p className="text-gray-500 mt-2 font-medium">إدارة أرباحك وعمليات السحب والتحويل</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث في المعاملات..."
              className="pr-12 pl-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:shadow-lg focus:shadow-blue-500/5 transition-all w-64 font-bold text-sm"
            />
          </div>
          <button className="p-3.5 bg-white border border-gray-200 text-gray-500 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cards & Payouts */}
        <div className="lg:col-span-4 space-y-8">
          {/* Main Wallet Card - Premium Design */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative h-[260px] w-full rounded-[3rem] overflow-hidden group shadow-2xl shadow-blue-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/20 rounded-full blur-[80px] -ml-24 -mb-24" />
            
            <div className="relative h-full p-10 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Current Balance</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-black text-white tracking-tighter">12,450.00</h2>
                    <span className="text-white/50 font-bold text-sm">SAR</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <Wallet className="text-white" size={28} />
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-4">
                  <div className="flex -space-x-3 rtl:space-x-reverse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                        {i === 3 ? '+5' : 'JD'}
                      </div>
                    ))}
                  </div>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Active Academic Wallet</p>
                </div>
                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="px-6 py-3 bg-white text-gray-900 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 text-xs"
                >
                  سحب الرصيد
                </button>
              </div>
            </div>
          </motion.div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm group hover:border-amber-300 transition-all">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock size={20} />
              </div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider mb-1">رصيد معلق</p>
              <h4 className="text-lg font-black text-gray-900">3,200 <span className="text-[10px] text-gray-400">ر.س</span></h4>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm group hover:border-green-300 transition-all">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
              </div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider mb-1">إجمالي الأرباح</p>
              <h4 className="text-lg font-black text-gray-900">45,890 <span className="text-[10px] text-gray-400">ر.س</span></h4>
            </div>
          </div>

          {/* Payout Methods - Figma Style */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900">وسائل السحب</h3>
              <button className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center group">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
            <div className="space-y-4">
              {payoutMethods.map((method) => (
                <div key={method.id} className={twMerge(
                  "p-5 rounded-[1.5rem] border transition-all cursor-pointer group",
                  method.isDefault ? "border-blue-100 bg-blue-50/20" : "border-gray-50 hover:border-gray-200"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={twMerge(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
                        method.isDefault ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                      )}>
                        <method.icon size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{method.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider" dir="ltr">{method.account}</p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Transactions History */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-10 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center shadow-inner">
                  <History size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">سجل العمليات</h3>
                  <p className="text-gray-400 text-sm font-medium mt-1">تتبع التدفق المالي لمحفظتك الرقمية</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex p-1.5 bg-gray-50 rounded-[1.25rem] border border-gray-100">
                  {['all', 'earning', 'withdrawal'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={twMerge(
                        "px-5 py-2.5 rounded-xl text-xs font-black transition-all",
                        activeTab === tab ? "bg-white text-blue-600 shadow-md" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      {tab === 'all' ? 'الكل' : tab === 'earning' ? 'الأرباح' : 'السحوبات'}
                    </button>
                  ))}
                </div>
                <button className="p-3.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-6 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Transaction</th>
                    <th className="px-10 py-6 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center">Amount</th>
                    <th className="px-10 py-6 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center">Status</th>
                    <th className="px-10 py-6 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Date</th>
                    <th className="px-10 py-6 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.filter(t => activeTab === 'all' || t.type === activeTab).map((txn) => (
                    <motion.tr 
                      key={txn.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-blue-50/20 transition-all cursor-pointer"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className={twMerge(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm",
                            txn.type === 'earning' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                          )}>
                            {txn.type === 'earning' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="text-gray-900 font-black text-sm group-hover:text-blue-600 transition-colors">{txn.title}</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">ID: {txn.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={twMerge(
                          "text-base font-black tracking-tight",
                          txn.type === 'earning' ? "text-green-600" : "text-amber-600"
                        )}>
                          {txn.amount} <span className="text-[10px] uppercase font-bold">SAR</span>
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex justify-center">
                          <span className={twMerge(
                            "px-4 py-1.5 rounded-full text-[9px] font-black inline-flex items-center gap-2 uppercase tracking-widest border shadow-sm",
                            txn.status === 'completed' ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
                          )}>
                            <div className={twMerge("w-1.5 h-1.5 rounded-full", txn.status === 'completed' ? "bg-green-500" : "bg-amber-500 animate-pulse")} />
                            {txn.status === 'completed' ? 'Success' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-xs font-bold text-gray-500">{txn.date}</span>
                      </td>
                      <td className="px-10 py-8 text-left">
                        <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t border-gray-50 flex justify-center bg-gray-50/30">
              <button className="flex items-center gap-2 text-blue-600 font-black text-xs group uppercase tracking-widest">
                View Full Transaction History
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal - Premium Style */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                    <ArrowUpRight size={28} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">سحب الرصيد</h2>
                </div>
                <button onClick={() => setIsWithdrawModalOpen(false)} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-400">
                  <Plus size={32} className="rotate-45" />
                </button>
              </div>

              <div className="p-10 space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount to Withdraw</label>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Available: 12,450 SAR</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full p-10 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2.5rem] outline-none font-black text-5xl transition-all text-center tracking-tighter"
                    />
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 font-black text-gray-300 text-xl tracking-widest">SAR</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Select Payout Method</label>
                  <div className="grid grid-cols-1 gap-4">
                    {payoutMethods.map((method) => (
                      <label key={method.id} className="flex items-center justify-between p-6 border-2 border-gray-50 rounded-[2rem] cursor-pointer hover:border-blue-100 hover:bg-blue-50/10 transition-all group relative overflow-hidden">
                        <div className="flex items-center gap-5 relative z-10">
                          <input type="radio" name="payout" defaultChecked={method.isDefault} className="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400 group-hover:text-blue-600 transition-colors">
                            <method.icon size={24} />
                          </div>
                          <div>
                            <p className="text-base font-black text-gray-900">{method.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-1 tracking-widest uppercase" dir="ltr">{method.account}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors" />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex gap-4">
                  <ShieldCheck size={24} className="text-blue-600 shrink-0" />
                  <p className="text-[11px] font-bold text-blue-900 leading-relaxed opacity-80">
                    سيتم تحويل المبلغ إلى حسابك البنكي خلال 24-48 ساعة عمل. جميع العمليات مشفرة بالكامل لضمان أمان أموالك.
                  </p>
                </div>

                <button className="w-full py-7 bg-blue-600 text-white font-black text-xl rounded-[2.5rem] shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-all active:scale-[0.98] uppercase tracking-widest">
                  Confirm Withdrawal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletPage;
