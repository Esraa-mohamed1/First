'use client';

import { Users, GraduationCap, Video, CreditCard, TrendingUp, ChevronRight, Globe, Star, BookOpen } from 'lucide-react';
import StatCard from '@/components/Academic/StatsCard';
import OverviewChart from '@/components/Academic/Charts/OverviewChart';
import Image from 'next/image';
import Link from 'next/link';

export default function GuestDashboardPage() {
    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-700">
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1 text-right">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">لوحة تحكم الزائر</h2>
                    <p className="text-gray-400 font-bold text-sm">مرحباً بك! استعرض نظرة عامة على نشاط الأكاديمية</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link 
                        href="/auth/login"
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        سجل الآن للوصول الكامل
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="الطلاب المسجلين"
                    value="1,240"
                    trend={{ value: 12, isPositive: true }}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="الدورات المتاحة"
                    value="45"
                    trend={{ value: 5, isPositive: true }}
                    icon={Video}
                    color="orange"
                />
                <StatCard
                    title="متوسط التقييم"
                    value="4.8"
                    trend={{ value: 0.2, isPositive: true }}
                    icon={Star}
                    color="yellow"
                />
                <StatCard
                    title="ساعات المحتوى"
                    value="850+"
                    trend={{ value: 25, isPositive: true }}
                    icon={BookOpen}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/20">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900">نظرة عامة على التفاعل</h3>
                        </div>
                        <div className="h-[400px]">
                            <OverviewChart />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="relative z-10 max-w-lg space-y-6">
                            <h3 className="text-3xl font-black leading-tight">ابدأ رحلتك التعليمية اليوم مع أفضل المدربين</h3>
                            <p className="text-blue-100 font-medium text-lg">
                                انضم إلى آلاف الطلاب الذين يطورون مهاراتهم يومياً من خلال منصتنا.
                            </p>
                            <Link 
                                href="/auth/registration"
                                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-lg hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
                            >
                                ابدأ مجاناً
                            </Link>
                        </div>
                        <div className="absolute left-[-5%] bottom-[-10%] opacity-20 group-hover:scale-110 transition-transform duration-700">
                            <Globe size={300} />
                        </div>
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/20 space-y-8">
                        <h3 className="text-xl font-black text-gray-900 text-right">أحدث الدورات</h3>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-gray-50 transition-all">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/0 transition-colors" />
                                </div>
                                <div className="flex-1 text-right">
                                    <h4 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">اسم الدورة التعليمية {i}</h4>
                                    <p className="text-sm text-gray-400 font-bold">بواسطة: د. أحمد محمد</p>
                                </div>
                                <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                            </div>
                        ))}
                    </div>

                    <div className="bg-orange-50 rounded-[3rem] p-8 border border-orange-100/50 space-y-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                            <GraduationCap size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">هل أنت مدرب؟</h3>
                        <p className="text-gray-500 font-bold leading-relaxed">
                            انضم إلينا كمدرب وابدأ في نشر معرفتك وتحقيق أرباح من خلال دوراتك الخاصة.
                        </p>
                        <button className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-200">
                            انضم كمدرب
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
