'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Smartphone,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { getWalletData, WalletData } from '@/services/finance';

const WalletPage = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWalletData();
        setWalletData(data);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const payoutMethods = [
    { id: 1, name: 'مصرف الراجحي', type: 'Bank Account', account: '**** 4567', icon: Building2, isDefault: true, color: 'blue' },
    { id: 2, name: 'STC Pay', type: 'Digital Wallet', account: '054 **** 123', icon: Smartphone, isDefault: false, color: 'purple' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const pendingBalance = Number(walletData?.balance || 0) - Number(walletData?.available_balance || 0);

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-end">
        <h1 className="text-xl font-black text-gray-900">المحفظة</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Right Side (now on Left in UI): Total Balance Card - Premium Credit Card Style */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#172554] p-12 rounded-[1.5rem] text-white relative overflow-hidden flex flex-col justify-between shadow-2xl"
        >
          {/* Credit Card Pattern & Gloss */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_-20%,#ffffff,transparent)]" />
            <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,70 Q25,50 50,70 T100,70 L100,100 L0,100 Z" fill="white" />
              <path d="M0,80 Q25,60 50,80 T100,80 L100,100 L0,100 Z" fill="white" opacity="0.5" />
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-start">
            {/* Virtual Chip */}
            <div className="w-14 h-10 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-lg relative overflow-hidden shadow-inner opacity-80">
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-px opacity-30">
                <div className="border border-black/20"></div>
                <div className="border border-black/20"></div>
                <div className="border border-black/20"></div>
                <div className="border border-black/20"></div>
                <div className="border border-black/20"></div>
                <div className="border border-black/20"></div>
              </div>
            </div>
            {/* Logo */}
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <div className="w-8 h-8 bg-[#1e40af] rounded-full translate-x-2 translate-y-2 shadow-inner"></div>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-8 mt-12">
            <div className="flex items-end justify-between">
              <h2 className="text-5xl font-black tracking-tight">
                {Number(walletData?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })} <span className="text-2xl font-bold ml-1">$</span>
              </h2>
              <h3 className="text-3xl font-black opacity-80">الرصيد الكلي</h3>
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              <span>Academic Platinum</span>
              <span dir="ltr">**** **** **** {walletData?.user_id || '0000'}</span>
            </div>
          </div>
        </motion.div>

        {/* Left Side (now on Right in UI): Available and Pending Balance */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Available Balance Card */}
          <div className="bg-white p-8 rounded-[1rem] border border-gray-200 shadow-sm flex flex-col justify-between h-full relative group transition-all hover:border-emerald-300">
            <div className="flex items-center justify-between mb-8">
              <span className="px-5 py-1.5 bg-[#d1fae5] text-[#059669] rounded-full text-sm font-bold">متاح</span>
              <div className="w-10 h-10 bg-[#10b981] text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={24} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="px-8 py-2 bg-[#10b981] text-white font-bold rounded-full hover:bg-emerald-600 transition-all text-sm shadow-md active:scale-95"
              >
                اسحب الآن
              </button>
              <div className="text-left">
                <p className="text-gray-900 font-bold text-sm mb-2">الرصيد المتاح</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                  {Number(walletData?.available_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} $
                </h3>
              </div>
            </div>
          </div>

          {/* Pending Balance Card */}
          <div className="bg-white p-8 rounded-[1rem] border border-gray-200 shadow-sm flex flex-col justify-between h-full relative group transition-all hover:border-amber-300">
            <div className="flex items-center justify-between mb-8">
              <span className="px-5 py-1.5 bg-[#ffedd5] text-[#d97706] rounded-full text-sm font-bold">معلق</span>
              <div className="w-10 h-10 bg-[#f97316] text-white rounded-full flex items-center justify-center opacity-80 shadow-lg shadow-orange-500/20">
                <Clock size={24} />
              </div>
            </div>
            <div className="text-left">
              <p className="text-gray-900 font-bold text-sm mb-2">الرصيد المعلق</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                {pendingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} $
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-[#f3f4f6] p-6 rounded-[0.75rem] border border-gray-100 flex items-center gap-4 shadow-sm">
        <div className="w-6 h-6 bg-[#1e293b] rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-black">!</span>
        </div>
        <p className="text-[#4b5563] text-sm font-bold leading-relaxed">
          يتم تعليق بعض المدفوعات لمدة 5 أيام للتحقق قبل أن تصبح متاحة للسحب. هذا الأجراء يضمن امان معاملاتك البنكية
        </p>
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWithdrawModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-8 pt-10 pb-2 flex items-center justify-between">
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                >
                  <Plus size={28} className="rotate-45" />
                </button>

                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black text-[#1e293b]">سحب الرصيد</h2>
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <ArrowUpRight size={24} strokeWidth={3} />
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Amount Input Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                      $ Available: {Number(walletData?.available_balance || 0).toFixed(2)}
                    </span>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Amount to Withdraw
                    </label>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#BFDDF0] rounded-[2.5rem] border-2 border-transparent group-focus-within:border-blue-600 group-focus-within:bg-white transition-all duration-300" />
                    <div className="relative flex flex-col items-center justify-center px-8 py-10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-blue-600">$</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-transparent border-none outline-none text-center font-black text-6xl text-[#1e293b] placeholder:text-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payout Methods Section */}
                <div className="space-y-5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 block text-center">
                    Select Payout Method
                  </label>
                  <div className="space-y-3">
                    {payoutMethods.map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center justify-between p-5 bg-white border-2 border-gray-50 rounded-[1.5rem] cursor-pointer hover:border-blue-100 hover:bg-blue-50/10 transition-all group relative"
                      >
                        <div className="flex items-center gap-4 flex-1 justify-end">
                          <div className="text-right">
                            <p className="text-sm font-black text-[#1e293b]">{method.name}</p>
                            <p className="text-[11px] font-bold text-gray-400 mt-0.5 tracking-tighter" dir="ltr">{method.account}</p>
                          </div>
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                            <method.icon size={22} />
                          </div>
                        </div>

                        <div className="relative flex items-center justify-center w-6 h-6 ml-4">
                          <input
                            type="radio"
                            name="payout"
                            defaultChecked={method.isDefault}
                            className="peer appearance-none w-6 h-6 border-2 border-gray-200 rounded-full checked:border-blue-600 transition-all cursor-pointer"
                          />
                          <div className="absolute w-3 h-3 bg-blue-600 rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50/50 p-5 rounded-[1.5rem] border border-blue-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck size={20} className="text-blue-600" />
                  </div>
                  <p className="text-[10px] font-bold text-blue-900 leading-relaxed text-center flex-1">
                    سيتم تحويل المبلغ إلى حسابك البنكي خلال 24-48 ساعة عمل. جميع العمليات مشفرة بالكامل لضمان أمان أموالك.
                  </p>
                </div>

                {/* Confirm Button */}
                <button className="w-full py-6 bg-blue-600 text-white font-black text-base rounded-[1.5rem] shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-[0.98] uppercase tracking-[0.2em]">
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
