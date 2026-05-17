'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  ChevronLeft,
  Quote
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const ReviewsPage = () => {
  const reviews = [
    { student: 'أحمد محمد علي', course: 'تصميم واجهات المستخدم', rating: 5, comment: 'دورة رائعة جداً واستفدت منها الكثير في مساري المهني. الشرح واضح ومبسط.', date: 'منذ يومين', status: 'published' },
    { student: 'سارة خالد', course: 'تطوير تطبيقات الويب', rating: 4, comment: 'محتوى ممتاز ولكن يحتاج لزيادة التطبيقات العملية في القسم الأخير.', date: 'منذ 3 أيام', status: 'published' },
    { student: 'محمد العتيبي', course: 'لغة جافاسكريبت المتقدمة', rating: 5, comment: 'أفضل دورة جافاسكريبت حضرتها على الإطلاق! المدرب متمكن جداً.', date: 'منذ أسبوع', status: 'pending' },
  ];

  return (
    <div className="space-y-10 pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">تقييمات الطلاب</h1>
          <p className="text-gray-500 mt-2 font-medium">متابعة آراء الطلاب وتحسين جودة المحتوى التعليمي</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-amber-200 transition-all">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
            <Star size={28} fill="currentColor" />
          </div>
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">متوسط التقييم</p>
            <h3 className="text-2xl font-black text-gray-900">4.8 / 5.0</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
            <MessageSquare size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">إجمالي التعليقات</p>
            <h3 className="text-2xl font-black text-gray-900">1,420</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">نسبة الرضا</p>
            <h3 className="text-2xl font-black text-gray-900">96%</h3>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">أحدث التقييمات</h2>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {reviews.map((rev, i) => (
            <div key={i} className="p-10 hover:bg-gray-50/50 transition-all group relative">
              <div className="absolute top-10 left-10 text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Quote size={80} />
              </div>
              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 shadow-inner">
                  <User size={32} className="text-gray-400" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{rev.student}</h3>
                      <p className="text-sm font-bold text-blue-600 mt-1">{rev.course}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={18} 
                          className={twMerge(
                            "transition-all",
                            s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium leading-relaxed max-w-3xl">
                    "{rev.comment}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{rev.date}</span>
                    <div className="flex items-center gap-4">
                      {rev.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all">نشر التقييم</button>
                          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all">حذف</button>
                        </div>
                      )}
                      <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-8 border-t border-gray-50 flex justify-center bg-gray-50/30">
          <button className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 group">
            View All Student Reviews
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
