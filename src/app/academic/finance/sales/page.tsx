'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingBag, 
  DollarSign,
  Calendar,
  Download,
  Filter,
  ChevronLeft,
  Users,
  Target,
  BarChart3,
  Award
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { twMerge } from 'tailwind-merge';

const SalesPage = () => {
  const chartData = [
    { name: 'يناير', sales: 4000, revenue: 2400 },
    { name: 'فبراير', sales: 3000, revenue: 1398 },
    { name: 'مارس', sales: 2000, revenue: 9800 },
    { name: 'أبريل', sales: 2780, revenue: 3908 },
    { name: 'مايو', sales: 1890, revenue: 4800 },
    { name: 'يونيو', sales: 2390, revenue: 3800 },
  ];

  const topSellingCourses = [
    { id: 1, name: 'دورة تصميم واجهات المستخدم', sales: 145, revenue: '65,250', growth: '+12.5%', color: 'blue' },
    { id: 2, name: 'تطوير تطبيقات الويب بالكامل', sales: 120, revenue: '48,000', growth: '+8.2%', color: 'purple' },
    { id: 3, name: 'أساسيات البرمجة بلغة بايثون', sales: 95, revenue: '28,500', growth: '+15.4%', color: 'emerald' },
    { id: 4, name: 'إدارة المشاريع الإحترافية', sales: 78, revenue: '31,200', growth: '-2.1%', color: 'amber' },
  ];

  const stats = [
    { label: 'إجمالي المبيعات', value: '154,230', currency: 'ر.س', trend: '+15.4%', isPositive: true, icon: DollarSign, color: 'blue' },
    { label: 'عدد الطلبات', value: '1,240', currency: 'طلب', trend: '+8.2%', isPositive: true, icon: ShoppingBag, color: 'purple' },
    { label: 'متوسط قيمة الطلب', value: '350', currency: 'ر.س', trend: '-2.1%', isPositive: false, icon: Target, color: 'amber' },
    { label: 'معدل التحويل', value: '4.8%', currency: '', trend: '+1.2%', isPositive: true, icon: TrendingUp, color: 'emerald' },
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
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">تحليلات المبيعات</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">نظرة معمقة على أداء مبيعات دوراتك</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
            <Calendar size={20} />
            <span>آخر 30 يوم</span>
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
            <Download size={20} />
            <span>تصدير البيانات</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-8">
              <div className={twMerge(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
                stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                stat.color === 'purple' ? "bg-purple-50 text-purple-600" :
                stat.color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
              )}>
                <stat.icon size={26} />
              </div>
              <div className={twMerge(
                "flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider",
                stat.isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                <span className="text-gray-400 font-bold text-sm">{stat.currency}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-black text-gray-900">أداء المبيعات</h2>
              <p className="text-gray-400 text-sm font-medium mt-1">مقارنة بين عدد المبيعات وإجمالي الإيرادات</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" />
                <span className="text-xs font-black text-gray-500 uppercase">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 rounded-full" />
                <span className="text-xs font-black text-gray-500 uppercase">Sales</span>
              </div>
            </div>
          </div>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                    padding: '20px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={5}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Courses Card */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-10 rounded-[3rem] border border-gray-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Award size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">الأكثر مبيعاً</h2>
              <p className="text-gray-400 text-sm font-medium mt-1">أفضل الدورات أداءً</p>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            {topSellingCourses.map((course) => (
              <div key={course.id} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-base font-black text-gray-900 group-hover:text-blue-600 transition-colors">{course.name}</p>
                  <span className="text-sm font-black text-gray-900">{course.revenue} ر.س</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(course.sales / 150) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={twMerge(
                          "h-full rounded-full",
                          course.color === 'blue' ? "bg-blue-600" :
                          course.color === 'purple' ? "bg-purple-600" :
                          course.color === 'emerald' ? "bg-emerald-600" : "bg-amber-600"
                        )}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{course.sales} مبيعة</span>
                  </div>
                  <span className={twMerge(
                    "text-[10px] font-black",
                    course.growth.startsWith('+') ? "text-green-600" : "text-red-600"
                  )}>{course.growth}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-12 py-5 bg-gray-50 text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 group">
            عرض القائمة الكاملة
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* New Customers Section */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">آخر المبيعات</h2>
              <p className="text-gray-400 text-sm font-medium mt-1">تتبع أحدث عمليات الشراء في أكاديميتك</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-gray-50 text-gray-500 font-black rounded-xl hover:bg-gray-100 transition-all text-sm">تصفية النتائج</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border border-gray-50 rounded-[2rem] hover:border-blue-100 hover:bg-blue-50/20 transition-all group cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 border-4 border-white shadow-sm overflow-hidden shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-black text-xl">
                    {String.fromCharCode(64 + i)}
                  </div>
                </div>
                <div>
                  <p className="text-base font-black text-gray-900">محمد العتيبي</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Premium Student</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase">Course</span>
                  <span className="text-xs font-black text-gray-700">تصميم واجهات المستخدم</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase">Amount</span>
                  <span className="text-base font-black text-blue-600">450.00 ر.س</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  <span>15 May 2024</span>
                  <span>Credit Card</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SalesPage;
