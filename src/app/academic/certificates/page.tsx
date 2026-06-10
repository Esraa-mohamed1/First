'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreVertical, 
  Layout, 
  CheckCircle2, 
  Users,
  Settings,
  FileText,
  ChevronLeft
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const CertificatesPage = () => {
  const templates = [
    { title: 'شهادة إتمام دورة احترافية', issued: 1240, status: 'active', lastUsed: 'منذ يومين', color: 'blue' },
    { title: 'شهادة حضور ورشة عمل', issued: 842, status: 'active', lastUsed: 'منذ أسبوع', color: 'purple' },
    { title: 'شهادة تميز أكاديمي', issued: 156, status: 'draft', lastUsed: '-', color: 'amber' },
  ];

  const recentIssued = [
    { name: 'محمد العتيبي', course: 'تصميم واجهات المستخدم', date: '2024-05-15', id: 'CERT-9821' },
    { name: 'سارة خالد', course: 'تطوير تطبيقات الويب', date: '2024-05-14', id: 'CERT-9820' },
    { name: 'أحمد محمد علي', course: 'لغة جافاسكريبت المتقدمة', date: '2024-05-14', id: 'CERT-9819' },
  ];

  return (
    <div className="space-y-10 pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">الشهادات</h1>
          <p className="text-gray-500 mt-2 font-medium">تصميم وإصدار شهادات الطلاب المعتمدة</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
          <Plus size={22} />
          <span>تصميم قالب جديد</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
            <Award size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">إجمالي الشهادات</p>
            <h3 className="text-2xl font-black text-gray-900">2,238</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-purple-200 transition-all">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
            <Layout size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">قوالب التصميم</p>
            <h3 className="text-2xl font-black text-gray-900">5</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">شهادات معتمدة</p>
            <h3 className="text-2xl font-black text-gray-900">100%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Templates Grid */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">قوالب الشهادات</h2>
              <button className="text-sm font-black text-blue-600 hover:underline uppercase tracking-widest">إدارة القوالب</button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((tpl, i) => (
                <div key={i} className="p-8 border border-gray-50 rounded-[2.5rem] hover:border-blue-200 hover:bg-blue-50/20 transition-all group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl -mr-16 -mt-16" />
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className={twMerge(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                      tpl.color === 'blue' ? "bg-blue-600 text-white" :
                      tpl.color === 'purple' ? "bg-purple-600 text-white" : "bg-amber-600 text-white"
                    )}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-900 group-hover:text-blue-600 transition-colors">{tpl.title}</h3>
                      <span className={twMerge(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border mt-1 inline-block",
                        tpl.status === 'active' ? "bg-green-50 text-green-600 border-green-100" : "bg-gray-100 text-gray-400 border-gray-200"
                      )}>{tpl.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 relative z-10">
                    <span className="flex items-center gap-1.5"><Users size={12} /> {tpl.issued} شهادة صادرة</span>
                    <span className="flex items-center gap-1.5">نشط: {tpl.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Issued List */}
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">آخر الشهادات الصادرة</h2>
              <div className="flex items-center gap-3">
                <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all shadow-sm">
                  <Search size={20} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {recentIssued.map((cert, i) => (
                <div key={i} className="p-8 hover:bg-gray-50/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-900">{cert.name}</p>
                      <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{cert.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-left hidden md:block">
                      <p className="text-xs font-black text-gray-900">{cert.id}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{cert.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 rounded-xl transition-all shadow-sm">
                        <Eye size={18} />
                      </button>
                      <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all shadow-sm">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border-t border-gray-50 flex justify-center bg-gray-50/30">
              <button className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 group">
                View All Issued Certificates
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Certificate Tools Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#020617] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <h3 className="text-2xl font-black mb-6 relative z-10 tracking-tight">إعدادات الشهادات</h3>
            <div className="space-y-4 relative z-10">
              {[
                { name: 'التوقيعات الرقمية', icon: Settings, color: 'blue' },
                { name: 'رموز التحقق (QR)', icon: CheckCircle2, color: 'emerald' },
                { name: 'قواعد الإصدار الآلي', icon: Layout, color: 'purple' },
              ].map((tool, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className={twMerge(
                    "p-3 rounded-xl transition-transform group-hover:scale-110 shadow-lg",
                    tool.color === 'blue' ? "bg-blue-600" :
                    tool.color === 'emerald' ? "bg-emerald-600" : "bg-purple-600"
                  )}>
                    <tool.icon size={20} />
                  </div>
                  <span className="text-sm font-black tracking-tight">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 rounded-[3rem] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/10">
                <Award size={40} />
              </div>
              <h3 className="text-xl font-black mb-3">التوثيق العالمي</h3>
              <p className="text-blue-100 text-xs font-medium leading-relaxed mb-8 opacity-80">
                جميع شهاداتنا مرتبطة بروابط تحقق دائمة ورموز QR مشفرة لضمان صحتها عالمياً.
              </p>
              <button className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl uppercase tracking-widest text-[10px]">
                Verify System
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
