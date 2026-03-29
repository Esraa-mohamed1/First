'use client';

import React, { useEffect, useState } from 'react';
import { getProfileStatus } from '@/services/auth';
import { Upload, Download, Search, Link2, Award, MessageSquare, FileText, Cloud, Users, User, BookOpen } from 'lucide-react';

export default function PackagesPage() {
  const [usageData, setUsageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const profile = await getProfileStatus();
        setUsageData(profile.data || profile);
      } catch (err) {
        console.error('Failed to fetch usage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Static mock data from the UI provided
  const stats = [
    {
      label: 'عدد الدورات المستخدمة',
      value: '8/20',
      percent: '40',
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-500',
      progressColor: 'bg-indigo-500'
    },
    {
      label: 'عدد الطلاب النشطين',
      value: '120/200',
      percent: '60',
      icon: BookOpen, // Looks like a general education icon in image
      color: 'bg-emerald-50 text-emerald-500',
      progressColor: 'bg-emerald-500'
    },
    {
      label: 'عدد المدربين من الحد المسموح',
      value: '16/20',
      percent: '80',
      icon: Users,
      color: 'bg-orange-50 text-orange-400',
      progressColor: 'bg-orange-400'
    },
    {
      label: 'عدد المدربين من الحد المسموح', // Using exact text from image
      value: '85/100 GB',
      percent: '90',
      icon: Cloud,
      color: 'bg-red-50 text-red-400',
      progressColor: 'bg-red-500'
    },
  ];

  const features = [
    { label: 'الدومين الخاص', available: true, icon: Link2 },
    { label: 'الشهادات', available: true, icon: Award },
    { label: 'الرسائل الجماعية', available: true, icon: MessageSquare },
    { label: 'التقارير المتقدمة', available: false, icon: FileText, note: 'متاحة في الباقات المتقدمة' },
  ];

  const history = [
    { id: '033215', date: '22/1/2020', name: 'الباقة البريميوم', price: '4,200', method: 'تحويل بنكي' },
    { id: '033216', date: '3/6/2022', name: 'الباقة البريميوم', price: '4,200', method: 'بطاقة الائتمان' },
    { id: '033217', date: '8/7/2025', name: 'الباقة البريميوم', price: '4,200', method: 'المحفظة الالكترونية' },
    { id: '033218', date: '2/3/2021', name: 'الباقة البريميوم', price: '4,200', method: 'بطاقة الائتمان' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 text-right font-sans" dir="rtl">
      {/* Top Section - Package Details */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

          {/* Right side: Title & Badge */}
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-gray-900">الباقة البريميوم</h2>
            <span className="px-5 py-1.5 rounded-xl text-green-600 bg-green-50 text-sm font-bold border border-green-100">
              نشط
            </span>
          </div>

          {/* Left side: Dates & Buttons */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-8">
            <div className="flex gap-10">
              <div className="text-left">
                <p className="text-gray-400 font-bold mb-1">نهاية الأشتراك</p>
                <p className="text-gray-900 font-bold">9/5/2024</p>
              </div>
              <div className="text-left">
                <p className="text-gray-400 font-bold mb-1">بداية الأشتراك</p>
                <p className="text-gray-900 font-bold">10/2/2024</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                تجديد الاشتراك
              </button>
              <button className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-colors">
                ترقية الباقة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                <div className={`w-full h-full rounded-2xl flex items-center justify-center bg-opacity-100 mix-blend-multiply ${stat.color}`}>
                  <stat.icon size={24} className="opacity-80" />
                </div>
              </div>
              <span className="text-gray-400 font-bold text-sm">السعة {stat.percent}%</span>
            </div>

            <div className="space-y-2 relative z-10">
              <p className="text-sm font-bold text-gray-400">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-6">
              <div
                className={`h-full rounded-full ${stat.progressColor} transition-all duration-1000`}
                style={{ width: `${stat.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-black text-gray-900 mb-2">المميزات المتاحة</h3>
        <p className="text-gray-400 font-bold mb-8">تعرف على الأدوات والخصائص المتاحة لك لإدارة أكاديميتك بكفاءة.</p>

        <div className="space-y-6">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <feature.icon size={20} className="text-gray-400" />
                <span className="font-bold text-gray-900">{feature.label}</span>
              </div>

              <div className="flex items-center gap-3">
                {feature.available ? (
                  <>
                    <span className="text-gray-900 font-bold">متاح</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  </>
                ) : (
                  <>
                    {feature.note && <span className="text-blue-500 text-sm ml-4 hover:underline cursor-pointer">{feature.note}</span>}
                    <span className="text-gray-400 font-bold">غير متاح</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl p-0 border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-900">تاريخ الاشتراكات والمدفوعات</h3>

          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="البحث"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pr-10 pl-4 py-2 text-sm outline-none focus:border-blue-500 font-medium text-right"
              />
            </div>

            <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold transition-colors text-sm">
              <Upload size={16} /> {/* Looking closely at the image "تصدير Excel", looks like upload icon */}
              <span>تصدير Excel</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-white text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 font-bold whitespace-nowrap">رقم العملية</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">تاريخ الأشتراك</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">اسم الباقة</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap">قيمة الأشتراك</th>
                <th className="py-4 px-6 font-bold whitespace-nowrap text-left">طريقة الدفع</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-500">{item.id}</td>
                  <td className="py-4 px-6 font-medium text-gray-500">{item.date}</td>
                  <td className="py-4 px-6 font-medium text-gray-500">{item.name}</td>
                  <td className="py-4 px-6 font-black text-gray-900">{item.price}</td>
                  <td className="py-4 px-6 font-medium text-gray-500 text-left">{item.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Banner */}
      <div className="bg-blue-500 rounded-[32px] p-10 relative overflow-hidden text-center text-white">
        {/* Decorator Circles */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 border-[30px] border-blue-400/30 rounded-full"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 border-[20px] border-blue-400/30 rounded-full"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h3 className="text-2xl font-black">"هل تحتاج إلى مساحة أكبر للطلاب والدورات؟ جرّب باقة أعلى!"</h3>
          <p className="text-blue-100 leading-relaxed font-bold text-sm">
            لقد اقتربت من الحد الأقصى للطلاب والدورات في خطتك الحالية لتستمر أكاديميتك في النمو بدون أي قيود، يمكنك الترقية إلى باقة أعلى الآن، بهذه الطريقة ستتمكن من إضافة عدد أكبر من الطلاب والدورات، والاستفادة من مميزات إضافية
          </p>
          <button className="bg-white text-blue-500 hover:bg-blue-50 px-10 py-3 rounded-2xl font-black transition-colors mt-2">
            ترقية الآن
          </button>
        </div>
      </div>

    </div>
  );
}
