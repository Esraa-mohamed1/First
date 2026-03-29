'use client';

import React from 'react';
import { Check, Zap, Shield, Rocket, Clock, Database, Users, MonitorPlay } from 'lucide-react';

export default function PackagesPage() {
  const currentUsage = [
    { label: 'تاريخ الانتهاء', value: '22/10/2026', progress: 84, icon: Clock, color: 'blue' },
    { label: 'نسبة استخدام الطلاب', value: '150/250', progress: 58, icon: Users, color: 'purple' },
    { label: 'نسبة استخدام التخزين او الفيديو', value: '1.2TB/2TB', progress: 60, icon: MonitorPlay, color: 'orange' },
    { label: 'سعة استيعاب الخوادم', value: '150/250', progress: 62, icon: Database, color: 'green' },
  ];

  const packages = [
    {
      name: 'باقة المبتدئين',
      price: '99',
      period: 'شهريا',
      description: 'مثالية للافراد والمدربين الجدد',
      features: [
        'عدد طلاب يصل الى 100',
        'تخزين 50GB للفيديو',
        'دعم فني عبر البريد',
        'شهادات حضور الكترونية',
      ],
      icon: Zap,
      color: 'blue',
      isCurrent: false,
    },
    {
      name: 'باقة المحترفين',
      price: '299',
      period: 'شهريا',
      description: 'الاكثر مبيعا للاكاديميات المتوسطة',
      features: [
        'عدد طلاب يصل الى 1000',
        'تخزين 500GB للفيديو',
        'دعم فني 24/7',
        'تخصيص كامل للهوية',
        'نظام اختبارات متقدم',
      ],
      icon: Rocket,
      color: 'blue',
      isCurrent: true,
      isHighlighted: true,
    },
    {
      name: 'باقة المؤسسات',
      price: '999',
      period: 'شهريا',
      description: 'حلول مخصصة للمؤسسات الكبري',
      features: [
        'عدد طلاب غير محدود',
        'تخزين غير محدود',
        'مدير حساب مخصص',
        'خوادم خاصة',
        'تكامل API كامل',
      ],
      icon: Shield,
      color: 'blue',
      isCurrent: false,
    },
  ];

  return (
    <div className="space-y-12 pb-12 text-right" dir="rtl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-gray-900">إدارة الباقات</h2>
        <p className="text-gray-400 font-bold mt-2 text-lg text-black">تحكم في اشتراكك وتابع استهلاكك الحالي</p>
      </div>

      {/* Usage Section */}
      <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-gray-900">استهلاك الباقة الحالية</h3>
            <p className="text-gray-400 font-bold mt-1">باقة المحترفين (بريميوم)</p>
          </div>
          <span className="bg-green-50 text-green-500 px-6 py-2 rounded-2xl font-black text-sm border border-green-100 italic">
            نشط الان
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentUsage.map((stat, index) => {
            const colors: Record<string, string> = {
              blue: 'bg-blue-50 text-blue-500',
              purple: 'bg-purple-50 text-purple-500',
              orange: 'bg-orange-50 text-orange-500',
              green: 'bg-green-50 text-green-500',
            };
            const colorClasses = colors[stat.color] || 'bg-gray-50 text-gray-500';

            return (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${colorClasses}`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-gray-400 font-bold text-sm italic">{stat.label}</p>
                    <p className="text-gray-900 font-black text-lg">{stat.value}</p>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-blue-500 rounded-full transition-all duration-1000`} 
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black text-gray-900">اختر الباقة المناسبة لك</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {packages.map((pkg, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-[40px] p-10 border-2 transition-all hover:shadow-2xl hover:shadow-blue-100 relative ${
                pkg.isHighlighted ? 'border-blue-500 shadow-xl shadow-blue-50' : 'border-gray-50'
              }`}
            >
              {pkg.isHighlighted && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-full font-black text-sm shadow-lg">
                  الاكثر طلباً
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500 mb-8`}>
                <pkg.icon size={32} />
              </div>

              <h4 className="text-2xl font-black text-gray-900 mb-2">{pkg.name}</h4>
              <p className="text-gray-400 font-bold text-sm mb-6">{pkg.description}</p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-black text-gray-900 justify-content-center">${pkg.price}</span>
                <span className="text-gray-400 font-bold ">{pkg.period}</span>
              </div>

              <div className="space-y-4 mb-10">
                {pkg.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3 text-gray-600 font-bold">
                    <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {pkg.isCurrent ? (
                <button className="w-full py-4 rounded-2xl font-black text-lg bg-gray-50 text-gray-400 cursor-default">
                  باقتك الحالية
                </button>
              ) : (
                <button className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                  pkg.isHighlighted ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}>
                  اشترك الان
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
