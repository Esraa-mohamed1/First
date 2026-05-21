'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Clock,
  ChevronLeft,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Search,
  MoreVertical,
  ExternalLink,
  Zap,
  Layout,
  Plus
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const ReportsPage = () => {
  const reports = [
    { title: 'تقرير الإيرادات الشهري', desc: 'تحليل مالي مفصل لشهر مايو 2024 يشمل جميع القنوات', date: '16 مايو 2024', size: '2.4 MB', type: 'Financial' },
    { title: 'أداء الطلاب والتقدم', desc: 'تقرير شامل عن نسب الإنجاز ومعدلات النجاح في الاختبارات', date: '15 مايو 2024', size: '1.8 MB', type: 'Academic' },
    { title: 'تحليل مبيعات الدورات', desc: 'مقارنة أداء الدورات المختلفة وتحديد الأكثر نمواً', date: '14 مايو 2024', size: '3.1 MB', type: 'Sales' },
    { title: 'تقرير تفاعل المستخدمين', desc: 'دراسة سلوك الطلاب داخل المنصة وعدد ساعات التعلم', date: '12 مايو 2024', size: '4.5 MB', type: 'Behavior' },
  ];

  const reportCategories = [
    { name: 'التقارير المالية', icon: BarChartIcon, color: 'blue', count: 12 },
    { name: 'تقارير الطلاب', icon: Users, color: 'purple', count: 8 },
    { name: 'تقارير المحتوى', icon: Layout, color: 'emerald', count: 5 },
    { name: 'تقارير الأداء', icon: Zap, color: 'amber', count: 9 },
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
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  return (
    <div className="space-y-10 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">التقارير والتحليلات</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">استخرج البيانات وحلل أداء أكاديميتك بدقة</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
            <Zap size={22} />
            <span>إنشاء تقرير فوري</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {reportCategories.map((cat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm group hover:border-blue-300 transition-all cursor-pointer"
          >
            <div className={twMerge(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
              cat.color === 'blue' ? "bg-blue-50 text-blue-600" :
              cat.color === 'purple' ? "bg-purple-50 text-purple-600" :
              cat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            )}>
              <cat.icon size={28} />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">{cat.name}</h3>
            <p className="text-sm font-bold text-gray-400">{cat.count} تقرير متوفر</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Reports List */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-white rounded-[3rem] border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">آخر التقارير المستخرجة</h2>
              <div className="flex items-center gap-3">
                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
                  <Search size={20} />
                </button>
                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {reports.map((report, index) => (
                <div key={index} className="p-10 hover:bg-gray-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group">
                  <div className="flex gap-6">
                    <div className={twMerge(
                      "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm",
                      report.type === 'Financial' ? "bg-blue-50 text-blue-600" :
                      report.type === 'Academic' ? "bg-purple-50 text-purple-600" :
                      report.type === 'Sales' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      <FileText size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{report.title}</h3>
                      <p className="text-gray-500 font-medium text-sm mt-1.5 leading-relaxed max-w-md">{report.desc}</p>
                      <div className="flex items-center gap-6 mt-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={14} />
                          {report.date}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Download size={14} />
                          {report.size}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                          {report.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-700 font-black rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-sm shadow-sm">
                      <Download size={18} />
                      <span>تحميل</span>
                    </button>
                    <button className="p-3 text-gray-300 hover:text-gray-900 transition-colors">
                      <MoreVertical size={22} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-10 border-t border-gray-50 flex justify-center">
              <button className="flex items-center gap-3 text-blue-600 font-black text-sm group">
                عرض أرشيف التقارير الكامل
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          {/* Custom Builder Card */}
          <div className="bg-gray-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4">مصمم التقارير المخصص</h3>
              <p className="text-gray-400 font-medium text-sm leading-relaxed mb-8">
                قم ببناء تقاريرك الخاصة من خلال اختيار المقاييس والبيانات التي تهمك في لوحة التحكم.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                    <PieChartIcon size={18} />
                  </div>
                  <span className="text-sm font-bold">توزيع الإيرادات</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="p-2 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                    <BarChartIcon size={18} />
                  </div>
                  <span className="text-sm font-bold">معدلات التحويل</span>
                </div>
              </div>
              <button className="w-full py-5 bg-white text-gray-900 font-black rounded-2xl hover:bg-gray-50 transition-all shadow-xl">
                ابدأ التصميم الآن
              </button>
            </div>
          </div>

          {/* Scheduled Reports Card */}
          <div className="bg-white p-10 rounded-[3rem] border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">التقارير المجدولة</h3>
                <p className="text-gray-400 text-sm font-medium mt-1">تلقى تقاريرك آلياً</p>
              </div>
            </div>
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
              يمكنك جدولة تقارير أسبوعية أو شهرية لتصلك مباشرة على بريدك الإلكتروني أو Telegram.
            </p>
            <button className="w-full py-4 border-2 border-gray-50 text-gray-900 font-black rounded-2xl hover:bg-gray-50 hover:border-gray-100 transition-all flex items-center justify-center gap-3">
              <Plus size={20} />
              <span>إضافة جدولة جديدة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
