'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Target, 
  TrendingUp, 
  Users, 
  Mail, 
  MessageSquare, 
  Share2, 
  Plus,
  Download,
  Filter,
  ChevronLeft,
  Zap,
  MousePointer2,
  BarChart3
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const MarketingPage = () => {
  const campaigns = [
    { title: 'حملة الصيف التعليمية', type: 'Email', reach: '5.2k', conversion: '12%', status: 'active', color: 'blue' },
    { title: 'خصم العودة للمدارس', type: 'Social', reach: '12.4k', conversion: '8%', status: 'scheduled', color: 'purple' },
    { title: 'عرض المشتركين الجدد', type: 'Popup', reach: '2.1k', conversion: '15%', status: 'paused', color: 'amber' },
  ];

  const stats = [
    { label: 'إجمالي الوصول', value: '45.8k', trend: '+12%', icon: Users, color: 'blue' },
    { label: 'معدل النقرات', value: '3.4%', trend: '+0.5%', icon: MousePointer2, color: 'purple' },
    { label: 'التحويلات', value: '842', trend: '+18%', icon: Target, color: 'emerald' },
  ];

  return (
    <div className="space-y-10 pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">التسويق</h1>
          <p className="text-gray-500 mt-2 font-medium">إدارة الحملات الترويجية وزيادة وصول أكاديميتك</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          <Plus size={22} />
          <span>إنشاء حملة جديدة</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm flex items-center gap-6 group hover:border-blue-300 transition-all">
            <div className={twMerge(
              "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm",
              stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
              stat.color === 'purple' ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"
            )}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                <span className="text-[10px] font-black text-green-600">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Campaigns List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">الحملات النشطة</h2>
              <div className="flex items-center gap-3">
                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {campaigns.map((camp, i) => (
                <div key={i} className="p-10 hover:bg-gray-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group">
                  <div className="flex gap-6">
                    <div className={twMerge(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                      camp.color === 'blue' ? "bg-blue-50 text-blue-600" :
                      camp.color === 'purple' ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-600"
                    )}>
                      <Megaphone size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{camp.title}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Zap size={14} />
                          {camp.type} Campaign
                        </span>
                        <span className={twMerge(
                          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                          camp.status === 'active' ? "bg-green-50 text-green-600 border border-green-100" :
                          camp.status === 'scheduled' ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-gray-100 text-gray-400 border border-gray-200"
                        )}>
                          {camp.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 text-left">
                    <div>
                      <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Reach</p>
                      <p className="text-lg font-black text-gray-900">{camp.reach}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Conv.</p>
                      <p className="text-lg font-black text-blue-600">{camp.conversion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 border-t border-gray-50 flex justify-center bg-gray-50/30">
              <button className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 group">
                View All Marketing Campaigns
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Marketing Tools Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#020617] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <h3 className="text-2xl font-black mb-6 relative z-10">أدوات التسويق</h3>
            <div className="space-y-4 relative z-10">
              {[
                { name: 'البريد الإلكتروني', icon: Mail, color: 'blue' },
                { name: 'إعلانات التواصل', icon: Share2, color: 'purple' },
                { name: 'الرسائل المباشرة', icon: MessageSquare, color: 'emerald' },
                { name: 'التحليلات المتقدمة', icon: BarChart3, color: 'amber' },
              ].map((tool, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className={twMerge(
                    "p-3 rounded-xl transition-transform group-hover:scale-110 shadow-lg",
                    tool.color === 'blue' ? "bg-blue-600" :
                    tool.color === 'purple' ? "bg-purple-600" :
                    tool.color === 'emerald' ? "bg-emerald-600" : "bg-amber-600"
                  )}>
                    <tool.icon size={20} />
                  </div>
                  <span className="text-sm font-black tracking-tight">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-200 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">نصيحة تسويقية</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 opacity-80">
              استخدام حملات البريد الإلكتروني المخصصة يزيد من نسبة التحويل بمقدار <span className="text-blue-600 font-black">2.5 ضعف</span> مقارنة بالحملات العامة.
            </p>
            <button className="w-full py-4 bg-gray-50 text-gray-900 font-black rounded-2xl hover:bg-gray-100 transition-all text-xs uppercase tracking-widest">
              Learn Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
