'use client';

import { useState } from 'react';
import { Users, GraduationCap, Video, CreditCard, TrendingUp, Plus, LayoutDashboard } from 'lucide-react';
import StatCard from '@/components/Academic/StatsCard';
import OverviewChart from '@/components/Academic/Charts/OverviewChart';
import RevenueChart from '@/components/Academic/Charts/RevenueChart';
import VisitsByDeviceChart from '@/components/Academic/Charts/VisitsByDeviceChart';
import VisitsByCountryChart from '@/components/Academic/Charts/VisitsByCountryChart';
import PackageCard from '@/components/Academic/PackageCard';
import QuickActions from '@/components/Academic/QuickActions';
import SetupProgress from '@/components/Academic/SetupProgress';

export default function AcademicDashboardPage() {
  const [showSetup, setShowSetup] = useState(true);

  const students = [
    { name: 'أحمد هاني محمد', date: '22/10/2022', status: 'مدفوع', course: 'أساسيات برمجة' },
    { name: 'محمود غنى', date: '19/8/2019', status: 'انتظار', course: 'تحليل بيانات' },
    { name: 'أكرم زكي', date: '14/1/2023', status: 'مدفوع', course: 'إدارة الأعمال' },
    { name: 'خالد سالم', date: '7/7/2018', status: 'مدفوع', course: 'التسويق الرقمي' },
    { name: 'أسد عباس', date: '12/10/2022', status: 'مدفوع', course: 'الجرافيك ديزاين' },
  ];

  const courses = [
    { name: 'أساسيات برمجة', date: '22/10/2022', status: 'مسودة', students: 82 },
    { name: 'تحليل بيانات', date: '19/8/2019', status: 'مسودة', students: 21 },
    { name: 'إدارة الأعمال', date: '14/1/2023', status: 'منشورة', students: 91 },
    { name: 'التسويق الرقمي', date: '7/7/2018', status: 'منشورة', students: 15 },
    { name: 'الجرافيك ديزاين', date: '12/10/2022', status: 'منشورة', students: 77 },
  ];

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-gray-900">لوحة التحكم</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowSetup(!showSetup)}
            className="flex items-center gap-3 bg-white border border-gray-100 hover:bg-gray-50 text-gray-500 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm"
          >
            <span>{showSetup ? 'عرض الاحصائيات' : 'اعدادات البدء'}</span>
            <LayoutDashboard size={18} />
          </button>
          
          <button className="flex items-center gap-3 bg-white border border-gray-100 hover:bg-gray-50 text-gray-500 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm">
            <span>تاريخ</span>
            <TrendingUp size={18} />
          </button>
        </div>
      </div>

      {showSetup ? (
        <SetupProgress />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          icon={Video}
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

      {/* Stats Grid Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="عدد الاشتراكات الجديدة هذا الشهر"
          value="40,689"
          trend={{ value: 2.6, isPositive: true }}
          icon={GraduationCap}
          color="green"
        />

        <button className="bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all group cursor-pointer h-full min-h-[160px]">
          <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
            <Plus size={32} />
          </div>
          <span className="font-black text-lg">إضافة عنصر جديد</span>
        </button>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 gap-8">
        <OverviewChart />
        <RevenueChart />
      </div>

      {/* Visits Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VisitsByDeviceChart />
        <VisitsByCountryChart />
      </div>

      {/* Package & Actions Section */}
      <div className="grid grid-cols-1 gap-8">
        <PackageCard />
        <QuickActions />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 gap-8">
        {/* Last Students Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h3 className="text-xl font-black text-gray-900">اخر الطلاب المسجلين</h3>
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input 
                    type="text" 
                    placeholder="البحث" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-100">تصدير Excel</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-gray-400 text-sm font-bold border-b border-gray-50">
                  <th className="pb-4">اسم الطالب</th>
                  <th className="pb-4">الدورة</th>
                  <th className="pb-4">تاريخ التسجيل</th>
                  <th className="pb-4">حالة الدفع</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold">
                {students.map((student, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5">{student.name}</td>
                    <td className="py-5 text-gray-500">{student.course}</td>
                    <td className="py-5 text-gray-500">{student.date}</td>
                    <td className="py-5">
                      <span className={`px-4 py-1.5 rounded-lg text-xs font-black ${student.status === 'مدفوع' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full mt-8 py-4 border border-gray-100 rounded-2xl text-gray-400 font-bold hover:bg-gray-50 transition-colors">عرض المزيد</button>
        </div>

        {/* Last Courses Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h3 className="text-xl font-black text-gray-900">اخر الدورات المضافة</h3>
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input 
                    type="text" 
                    placeholder="البحث" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-100">تصدير Excel</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-gray-400 text-sm font-bold border-b border-gray-50">
                  <th className="pb-4">اسم الدورة</th>
                  <th className="pb-4">عدد الطلاب</th>
                  <th className="pb-4">تاريخ الاضافة</th>
                  <th className="pb-4">الحالة</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold">
                {courses.map((course, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5">{course.name}</td>
                    <td className="py-5 text-gray-500">{course.students}</td>
                    <td className="py-5 text-gray-500">{course.date}</td>
                    <td className="py-5">
                      <span className={`px-4 py-1.5 rounded-lg text-xs font-black ${course.status === 'منشورة' ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full mt-8 py-4 border border-gray-100 rounded-2xl text-gray-400 font-bold hover:bg-gray-50 transition-colors">عرض المزيد</button>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
