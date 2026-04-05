'use client';

import { useState } from 'react';
import { Users, GraduationCap, Video, CreditCard, TrendingUp, Plus, LayoutDashboard, ChevronDown, Download, Search, BookOpen, Lightbulb, ChevronRight, ChevronLeft, Globe, MoreHorizontal, Rocket, Check, GripHorizontal } from 'lucide-react';
import StatCard from '@/components/Academic/StatsCard';
import OverviewChart from '@/components/Academic/Charts/OverviewChart';
import RevenueChart from '@/components/Academic/Charts/RevenueChart';
import VisitsByDeviceChart from '@/components/Academic/Charts/VisitsByDeviceChart';
import VisitsByCountryChart from '@/components/Academic/Charts/VisitsByCountryChart';
import Image from 'next/image';

function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AcademicDashboardPage() {
    const students = [
        { name: 'أحمد هاني محمد', date: '22/10/2022', status: 'غير مدفوع', course: 'أساسيات برمجة' },
        { name: 'محمود فتحي', date: '19/8/2019', status: 'انتظار', course: 'تحليل بيانات' },
        { name: 'كريم رزقي', date: '14/1/2023', status: 'مدفوع', course: 'إدارة الأعمال' },
        { name: 'خالد سالم', date: '7/7/2018', status: 'مدفوع', course: 'التسويق الرقمي' },
        { name: 'أحمد عباس', date: '12/10/2022', status: 'مدفوع', course: 'الجرافيك ديزاين' },
    ];

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-700">

            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1 text-right">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">لوحة التحكم</h2>
                    <p className="text-gray-400 font-bold text-sm">مرحباً بك مجدداً في لوحة تحكم أكاديميتك</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    <button className="bg-gray-50 text-gray-400 px-4 py-2 rounded-xl text-xs font-black hover:bg-gray-100 transition-all">اليوم</button>
                    <button className="text-gray-400 px-4 py-2 rounded-xl text-xs font-black hover:bg-gray-100 transition-all">الأسبوع</button>
                    <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-100 flex items-center gap-2">
                        <span>تاريخ</span>
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* MAIN COLUMN (RIGHT in Dashboard logic) */}
                <div className="lg:col-span-12 xl:col-span-9 space-y-8 order-2 xl:order-1">

                    {/* 1. Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="عدد الطلاب النشطة"
                            value="2,689"
                            trend={{ value: 8.5, isPositive: true }}
                            icon={Users}
                            color="blue"
                        />
                        <StatCard
                            title="عدد الدورات المنشورة"
                            value="211"
                            trend={{ value: 1.2, isPositive: false }}
                            icon={TrendingUp}
                            color="red"
                        />
                        <StatCard
                            title="عدد المدربين"
                            value="40,689"
                            trend={{ value: 2.6, isPositive: true }}
                            icon={GraduationCap}
                            color="orange"
                        />
                        <StatCard
                            title="اجمالي الايراد هذا الشهر"
                            value="40,689"
                            trend={{ value: 2.6, isPositive: true }}
                            icon={CreditCard}
                            color="purple"
                        />
                    </div>

                    {/* 2. Primary Charts (Line & Bar) */}
                    <div className="grid grid-cols-1 gap-8">
                        <OverviewChart />
                        <RevenueChart />
                    </div>

                    {/* 3. Secondary Charts (Side by Side) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <VisitsByDeviceChart />
                        <VisitsByCountryChart />
                    </div>

                    {/* 4. Table Section */}
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden p-8 lg:p-10">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-8">
                            <div className="space-y-1 text-right">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">اخر الطلاب المسجلين</h3>
                                <p className="text-gray-400 font-bold text-sm">قائمة بأحدث الطلاب المنضمين لأكاديميتك مؤخراً</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-80 group">
                                    <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none group-focus-within:text-blue-600 transition-colors">
                                        <Search className="h-5 w-5 text-gray-300" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="البحث عن طالب أو دورة..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pr-14 pl-6 py-4 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-right font-black"
                                    />
                                </div>
                                <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xs font-black shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95">
                                    <Download size={16} strokeWidth={3} />
                                    <span>تصدير Excel</span>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-right text-gray-400 text-xs font-black uppercase tracking-widest bg-gray-50/50 rounded-2xl">
                                        <th className="px-8 py-4 first:rounded-r-2xl last:rounded-l-2xl">اسم الطالب</th>
                                        <th className="px-8 py-4 text-right">الدورة</th>
                                        <th className="px-8 py-4 text-right">تاريخ التسجيل</th>
                                        <th className="px-8 py-4 text-right">حالة الدفع</th>
                                        <th className="px-8 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-[14px] font-bold">
                                    {students.map((student, i) => (
                                        <tr key={i} className="group transition-all hover:translate-x-1 duration-300">
                                            <td className="py-5 px-8 rounded-r-[1.5rem] bg-[#f8faff] group-hover:bg-blue-50/30 transition-colors text-right">
                                                <div className="flex items-center gap-3 justify-end whitespace-nowrap">
                                                    {student.name}
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm font-black text-xs shrink-0">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8 bg-[#f8faff] group-hover:bg-blue-50/30 transition-colors text-gray-500 text-right whitespace-nowrap">{student.course}</td>
                                            <td className="py-5 px-8 bg-[#f8faff] group-hover:bg-blue-50/30 transition-colors text-gray-500 text-right whitespace-nowrap">{student.date}</td>
                                            <td className="py-5 px-8 bg-[#f8faff] group-hover:bg-blue-50/30 transition-colors text-right whitespace-nowrap">
                                                <span className={clsx(
                                                    "px-6 py-2.5 rounded-2xl text-[11px] font-black inline-block min-w-[110px] text-center shadow-sm",
                                                    student.status === 'مدفوع' ? 'bg-green-50 text-green-500 border border-green-100' :
                                                        student.status === 'انتظار' ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'bg-gray-100 text-gray-400 border border-gray-200'
                                                )}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="py-5 px-8 rounded-l-[1.5rem] bg-[#f8faff] group-hover:bg-blue-50/30 transition-colors text-right">
                                                <button className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-blue-600">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className="w-full mt-10 py-5 bg-gray-50 hover:bg-gray-100 rounded-3xl text-gray-400 text-sm font-black transition-all hover:text-gray-600 group">
                            <span className="flex items-center justify-center gap-2">
                                عرض جميع الطلاب المسجلين
                                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>

                    {/* 5. Course Library Placeholder */}
                    <div className="bg-white rounded-[3.5rem] border-2 border-dashed border-gray-100 p-16 text-center flex flex-col items-center gap-8 shadow-sm group hover:border-blue-200 transition-all">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all group-hover:scale-110 duration-500">
                            <BookOpen size={56} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">مكتبة دوراتك تنتظر اول اعمالك</h3>
                            <p className="text-gray-400 font-bold max-w-md mx-auto leading-relaxed text-lg">قم بانشاء محتوي تعليمي ملهم وابدأ رحلتك التعليمية الأن لجذب طلابك المفضلين</p>
                        </div>
                        <button className="group flex items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-14 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/20 transition-all hover:-translate-y-1.5 active:scale-95">
                            <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                            <span>انشاء دورة جديدة</span>
                        </button>
                    </div>

                    {/* 6. Premium Package Usage Tracking */}
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/10 p-10 space-y-12">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center justify-end gap-5 w-full text-right">
                                <div className="text-right">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">استهلاك الباقة البريميوم</h3>
                                    <p className="text-sm font-bold text-gray-400 mt-1">نظرة عامة دقيقة علي استهلاك الموارد المحددة في باقتك الحالية</p>
                                </div>
                                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 shrink-0">
                                    <LayoutDashboard size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            <div className="space-y-5 bg-gray-50/50 p-6 rounded-3xl border border-gray-50">
                                <div className="flex justify-between items-center text-xs font-black">
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-blue-600" />
                                        <span className="text-blue-600 text-sm">56/2,689</span>
                                    </div>
                                    <span className="text-gray-400">عدد الطلاب</span>
                                </div>
                                <div className="h-3 bg-white border border-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <div className="bg-gradient-to-l from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000 w-[10%]" />
                                </div>
                                <p className="text-[11px] text-gray-400 font-bold text-center">تبقي لديك <span className="text-gray-900">5،312 طالباً</span> إضافياً في باقتك</p>
                            </div>

                            <div className="space-y-5 bg-gray-50/50 p-6 rounded-3xl border border-gray-50 relative overflow-hidden group text-right">
                                <div className="flex justify-between items-center text-xs font-black">
                                    <div className="flex items-center gap-2 text-red-500">
                                        <TrendingUp size={14} />
                                        <span className="text-sm tracking-tighter">500GB/1,041</span>
                                    </div>
                                    <span className="text-gray-400">مساحة التخزين</span>
                                </div>
                                <div className="h-3 bg-white border border-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <div className="bg-gradient-to-l from-red-600 to-red-400 h-full rounded-full transition-all duration-1000 w-[82%]" />
                                </div>
                                <p className="text-[11px] text-red-500 font-black text-center animate-pulse">تنبيه: لقد اوشكت على استنزاف مساحة التخزين الخاصة بك</p>
                            </div>

                            <div className="space-y-5 bg-gray-50/50 p-6 rounded-3xl border border-gray-50">
                                <div className="flex justify-between items-center text-xs font-black">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={14} className="text-green-500" />
                                        <span className="text-green-500 text-sm">56/211</span>
                                    </div>
                                    <span className="text-gray-400">عدد الدورات</span>
                                </div>
                                <div className="h-3 bg-white border border-gray-100 rounded-full overflow-hidden shadow-inner">
                                    <div className="bg-gradient-to-l from-green-500 to-green-400 h-full rounded-full transition-all duration-1000 w-[35%]" />
                                </div>
                                <p className="text-[11px] text-gray-400 font-bold text-center">يمكنك اضافة <span className="text-gray-900">15 دورة اضافية</span> حالياً</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* SIDEBAR COLUMN (LEFT) */}
                <div className="lg:col-span-12 xl:col-span-3 space-y-8 xl:sticky xl:top-28 order-1 xl:order-2">

                    {/* 7. Checklist Section */}
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/10 p-8 space-y-8">
                        <div className="flex items-center ">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-sm">
                                <Rocket size={32} />
                            </div>
                            <h3 className="font-black text-gray-900 text-2xl tracking-tight text-right">خطواتك الأولى</h3>
                        </div>

                        <div className="space-y-10 pt-4 border-r-2 border-gray-50 pr-6 relative">
                            {/* Item 1: Completed with Green Checkbox */}
                            <div className="flex items-start gap-2 group cursor-pointer relative ">  <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center shrink-0 shadow-lg shadow-green-100">
                                <Check size={20} className="text-white" strokeWidth={5} />
                            </div>
                                <div className="text-right">
                                    <h4 className="text-xl font-black text-gray-900">1- اعدادات الملف</h4>
                                    <p className="text-sm text-gray-400 font-bold mt-1 leading-relaxed">اكملت المعلومات الأساسية</p>
                                </div>
                                <div className="absolute -right-[30px] top-4 w-2.5 h-2.5 rounded-full bg-green-600 shadow-[0_0_0_4px_rgba(34,197,94,0.1)] shrink-0 z-10" />
                            </div>

                            {/* Item 2: Active */}
                            <div className="flex items-start gap-5 group cursor-pointer relative justify-end">
                                <div className="text-right group">
                                    <h4 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">2- انشاء دورة</h4>
                                    <p className="text-sm text-gray-400 font-bold mt-1 leading-relaxed">ابدأ بانشاء دورتك الأولى</p>
                                    <span className="text-blue-600 underline font-black text-sm block mt-2 hover:bg-blue-50 transition-all w-fit mr-auto">ابدأ الأن</span>
                                </div>
                                <div className="w-10 h-10 rounded-2xl border border-gray-200 bg-[#f8faff] flex items-center justify-center shrink-0 text-gray-400 font-black text-lg group-hover:border-blue-600 group-hover:text-blue-600 transition-all shadow-sm">
                                    2
                                </div>
                                <div className="absolute -right-[30px] top-4 w-2.5 h-2.5 rounded-full bg-gray-200 shrink-0 z-10" />
                            </div>

                            {/* Item 3: Pending */}
                            <div className="flex items-start gap-5 group cursor-pointer relative justify-end">
                                <div className="text-right">
                                    <h4 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">3- اضافة مدربين</h4>
                                    <p className="text-sm text-gray-400 font-bold mt-1 leading-relaxed">ابدأ بالخطوات لاكمال الفريق</p>
                                </div>
                                <div className="w-10 h-10 rounded-2xl border border-gray-200 bg-[#f8faff] flex items-center justify-center shrink-0 text-gray-400 font-black text-lg group-hover:border-blue-200 transition-colors text-center shadow-sm">
                                    3
                                </div>
                                <div className="absolute -right-[30px] top-4 w-2.5 h-2.5 rounded-full bg-gray-200 shrink-0 z-10" />
                            </div>

                            <div className="bg-[#f8faff] rounded-[2.5rem] p-8 border border-gray-50 flex flex-col items-center gap-4">
                                <div className="flex flex-row-reverse items-center justify-center gap-4 w-full">
                                    <div className="text-blue-600 bg-white p-2.5 rounded-2xl shadow-sm">
                                        <Lightbulb size={24} />
                                    </div>
                                    <span className="text-xl font-black text-blue-600">نصيحة اليوم</span>
                                </div>
                                <p className="text-gray-400 font-bold leading-relaxed text-center px-2">
                                    &quot;اضافة فيديوهات تعريفية قصيرة لكل دورة يزيد من معدلات التسجيل&quot;
                                </p>
                            </div>
                        </div>

                        {/* 8. Promotional Carousel Banner */}
                        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden relative group h-[480px]">
                            <div className="h-full flex flex-col items-center justify-between p-8 text-center bg-white relative">

                                <div className="flex items-center justify-between w-full mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300">
                                        <GripHorizontal size={16} />
                                    </div>
                                    <h4 className="text-sm font-black text-gray-900 leading-tight text-right">هل تريد المزيد من المستخدمين على موقعك؟</h4>
                                </div>

                                <div className="relative h-48 w-full group-hover:scale-105 transition-transform duration-1000">
                                    <Image
                                        src="/assets/Ellipse.png"
                                        alt="Promotional Banner"
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <div className="space-y-4 px-2 text-right">
                                    <h4 className="text-base font-black text-gray-900 leading-snug">عزّز موقعك على محرك Microsoft Bing</h4>
                                    <p className="text-[11px] text-gray-400 font-bold leading-relaxed line-clamp-3">توفر أدوات Bing Webmaster بيانات أداء الموقع ورؤى مجانية لتحسين محركات البحث(SEO) لمساعدتك على تحسين ترتيب موقعك في نتائج بحث Bing</p>
                                </div>

                                <div className="w-full flex items-center gap-4 mt-4">
                                    <button className="flex-1 py-3.5 bg-white border border-blue-600 text-blue-600 rounded-2xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all active:scale-95">ابدأ الأن</button>
                                    <button className="text-orange-400 font-black text-sm hover:underline px-4">لا،شكرا</button>
                                </div>

                                <div className="flex justify-center gap-1.5 pt-4 pb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                </div>
                            </div>

                            {/* Arrow Navigation */}
                            <button className="absolute left-[-15px] top-1/2 -translate-y-1/2 p-2 bg-white shadow-xl border border-gray-50 rounded-full opacity-100 transition-all hover:bg-blue-600 hover:text-white z-10">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="absolute right-[-15px] top-1/2 -translate-y-1/2 p-2 bg-white shadow-xl border border-gray-50 rounded-full opacity-100 transition-all hover:bg-blue-600 hover:text-white z-10">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
