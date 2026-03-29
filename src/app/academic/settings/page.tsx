'use client';

import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Users, 
  Settings as SettingsIcon,
  ChevronLeft,
  Smartphone,
  Mail,
  Lock,
  Globe,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsCenterPage() {
  const sections = [
    {
      title: 'إعدادات الحساب',
      items: [
        { 
          id: 'academy',
          title: 'بيانات الأكاديمية', 
          desc: 'إدارة الشعار، الاسم، والوصف الخاص بالأكاديمية', 
          icon: Building2, 
          href: '/academic/settings/academy',
          color: 'blue'
        },
        { 
          id: 'security',
          title: 'الأمان والخصوصية', 
          desc: 'تغيير كلمة المرور وإعدادات التحقق بخطوتين', 
          icon: ShieldCheck, 
          href: '#',
          color: 'purple'
        },
        { 
          id: 'team',
          title: 'إدارة الفريق', 
          desc: 'إضافة وتعديل صلاحيات المحاضرين والمشرفين', 
          icon: Users, 
          href: '#',
          color: 'orange'
        },
      ]
    },
    {
      title: 'التفضيلات والتسهيلات',
      items: [
        { 
          id: 'notifications',
          title: 'التنبيهات', 
          desc: 'إعدادات تنبيهات النظام والبريد الإلكتروني', 
          icon: Bell, 
          href: '#',
          color: 'red'
        },
        { 
          id: 'payments',
          title: 'طرق الدفع', 
          desc: 'إدارة البطاقات البنكية وعمليات السحب', 
          icon: CreditCard, 
          href: '/academic/payments',
          color: 'green'
        },
        { 
          id: 'domain',
          title: 'الدومين المخصص', 
          desc: 'ربط نطاقك الخاص بمنصة الأكاديمية', 
          icon: Globe, 
          href: '#',
          color: 'indigo'
        },
      ]
    },
    {
      title: 'الدعم والمساعدة',
      items: [
        { 
          id: 'support',
          title: 'مركز المساعدة', 
          desc: 'تصفح المقالات التعليمية أو تواصل مع الدعم', 
          icon: HelpCircle, 
          href: '#',
          color: 'gray'
        },
      ]
    }
  ];

  return (
    <div className="space-y-12 pb-12 text-right" dir="rtl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-gray-900">الإعدادات المركزية</h2>
        <p className="text-gray-400 font-bold mt-2 text-lg">تحكم في كافة إعدادات منصتك من مكان واحد</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="space-y-6">
            <h3 className="text-xl font-black text-gray-800 pr-2 border-r-4 border-blue-500">{section.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, iIndex) => {
                const colors: Record<string, string> = {
                  blue: 'bg-blue-50 text-blue-500 hover:bg-blue-500',
                  purple: 'bg-purple-50 text-purple-500 hover:bg-blue-500',
                  orange: 'bg-orange-50 text-orange-500 hover:bg-blue-500',
                  red: 'bg-red-50 text-red-500 hover:bg-blue-500',
                  green: 'bg-green-50 text-green-500 hover:bg-blue-500',
                  indigo: 'bg-indigo-50 text-indigo-500 hover:bg-blue-500',
                  gray: 'bg-gray-50 text-gray-500 hover:bg-blue-500',
                };
                
                const colorClass = colors[item.color] || 'bg-gray-50 text-gray-500 hover:bg-blue-500';

                return (
                  <Link 
                    key={item.id}
                    href={item.href}
                    className="group bg-white rounded-[32px] p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all flex flex-col items-start gap-6 text-right"
                  >
                    <div className={`p-4 rounded-2xl transition-all duration-300 group-hover:text-white ${colorClass}`}>
                      <item.icon size={28} />
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <h4 className="text-lg font-black text-gray-900">{item.title}</h4>
                      <p className="text-sm font-bold text-gray-400 group-hover:text-gray-500">{item.desc}</p>
                    </div>

                    <div className="w-full pt-4 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-sm font-black text-blue-600 group-hover:translate-x-[-4px] transition-transform">تعديل</span>
                      <ChevronLeft size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Setup Status */}
      <div className="bg-blue-600 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200">
        <div className="space-y-3">
          <h3 className="text-2xl font-black italic">أكمل إعداد موقعك بنسبة 85%</h3>
          <p className="text-blue-100 font-bold italic">تبقت خطوة واحدة لربط الدومين المخصص الخاص بك وتفعيل الأكاديمية بالكامل</p>
        </div>
        <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all whitespace-nowrap shadow-lg">
          استكمال الإعداد
        </button>
      </div>
    </div>
  );
}
