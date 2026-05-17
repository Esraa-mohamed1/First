'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ReceiptText, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  Eye, 
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Calendar,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const InvoicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const invoices = [
    { id: 'INV-2401', student: 'أحمد محمد علي', course: 'تصميم واجهات المستخدم', date: '15 مايو 2024', amount: '450.00', status: 'paid', method: 'بطاقة ائتمان' },
    { id: 'INV-2402', student: 'سارة خالد', course: 'تطوير تطبيقات الويب', date: '14 مايو 2024', amount: '320.00', status: 'paid', method: 'STC Pay' },
    { id: 'INV-2403', student: 'محمد العتيبي', course: 'لغة جافاسكريبت', date: '14 مايو 2024', amount: '280.00', status: 'pending', method: 'تحويل بنكي' },
    { id: 'INV-2404', student: 'ليلى يوسف', course: 'أساسيات التصميم', date: '13 مايو 2024', amount: '150.00', status: 'paid', method: 'Apple Pay' },
    { id: 'INV-2405', student: 'فهد سليمان', course: 'إدارة المشاريع', date: '12 مايو 2024', amount: '550.00', status: 'failed', method: 'بطاقة ائتمان' },
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
    <div className="space-y-10 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">إدارة الفواتير</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">سجل كامل لجميع العمليات المالية والفواتير</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
            <Download size={20} />
            <span>تصدير الكل</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm flex items-center gap-6 group hover:border-blue-300 transition-all">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ReceiptText size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">إجمالي الفواتير</p>
            <h3 className="text-2xl font-black text-gray-900">1,240 <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Invoices</span></h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm flex items-center gap-6 group hover:border-green-300 transition-all">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">تم تحصيلها</p>
            <h3 className="text-2xl font-black text-gray-900">1,180 <span className="text-[10px] text-green-400 uppercase tracking-tighter">Paid</span></h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm flex items-center gap-6 group hover:border-amber-300 transition-all">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">بانتظار التحصيل</p>
            <h3 className="text-2xl font-black text-gray-900">42 <span className="text-[10px] text-amber-400 uppercase tracking-tighter">Pending</span></h3>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
          <input 
            type="text" 
            placeholder="البحث برقم الفاتورة، اسم الطالب، أو اسم الدورة..."
            className="w-full pr-16 pl-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-gray-50 text-gray-500 font-black rounded-[1.5rem] hover:bg-gray-100 transition-all border border-gray-50">
            <Calendar size={20} />
            <span>التاريخ</span>
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-gray-50 text-gray-500 font-black rounded-[1.5rem] hover:bg-gray-100 transition-all border border-gray-50">
            <Filter size={20} />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-[3rem] border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-8 text-gray-400 font-bold text-sm uppercase tracking-widest">رقم الفاتورة</th>
                <th className="px-10 py-8 text-gray-400 font-bold text-sm uppercase tracking-widest">الطالب / الدورة</th>
                <th className="px-10 py-8 text-gray-400 font-bold text-sm uppercase tracking-widest text-center">المبلغ</th>
                <th className="px-10 py-8 text-gray-400 font-bold text-sm uppercase tracking-widest text-center">الحالة</th>
                <th className="px-10 py-8 text-gray-400 font-bold text-sm uppercase tracking-widest">التاريخ</th>
                <th className="px-10 py-8 text-gray-400 font-bold text-sm uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <motion.tr 
                  key={inv.id}
                  variants={itemVariants}
                  className="group hover:bg-blue-50/20 transition-all cursor-pointer"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FileText size={20} />
                      </div>
                      <span className="text-gray-900 font-black text-base">{inv.id}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div>
                      <p className="text-base font-black text-gray-900 group-hover:text-blue-600 transition-colors">{inv.student}</p>
                      <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{inv.course}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="text-lg font-black text-gray-900">
                      {inv.amount} <span className="text-[10px] text-gray-400 uppercase">SAR</span>
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center">
                      <span className={twMerge(
                        "px-5 py-2 rounded-xl text-[10px] font-black inline-flex items-center gap-2 uppercase tracking-widest border",
                        inv.status === 'paid' ? "bg-green-50 text-green-600 border-green-100" : 
                        inv.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-red-50 text-red-600 border-red-100"
                      )}>
                        <div className={twMerge(
                          "w-1.5 h-1.5 rounded-full",
                          inv.status === 'paid' ? "bg-green-500" : 
                          inv.status === 'pending' ? "bg-amber-500" : "bg-red-500"
                        )} />
                        {inv.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-bold text-gray-500">{inv.date}</span>
                  </td>
                  <td className="px-10 py-8 text-left">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
                        <Eye size={18} />
                      </button>
                      <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-200 rounded-xl transition-all shadow-sm">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Showing 5 of 124 invoices</p>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 border-2 border-gray-50 rounded-xl text-gray-400 font-black text-xs uppercase hover:bg-gray-50 transition-all">Prev</button>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-blue-600 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-500/20">1</button>
              <button className="w-10 h-10 hover:bg-gray-50 text-gray-400 rounded-xl font-black text-xs transition-all">2</button>
              <button className="w-10 h-10 hover:bg-gray-50 text-gray-400 rounded-xl font-black text-xs transition-all">3</button>
            </div>
            <button className="px-6 py-3 border-2 border-gray-50 rounded-xl text-gray-900 font-black text-xs uppercase hover:bg-gray-50 transition-all">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvoicesPage;
