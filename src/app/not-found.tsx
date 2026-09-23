import React from 'react';
import Link from 'next/link';
import { Home, BookOpen, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-[#f8faff] flex flex-col items-center justify-center p-6 text-center select-none font-sans"
    >
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center">
        {/* Animated Badge & Code */}
        <div className="relative mb-6">
          <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 tracking-tight">
            404
          </div>
          <div className="absolute -bottom-2 right-1/2 translate-x-1/2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black rounded-full border border-blue-200">
            الصفحة غير موجودة
          </div>
        </div>

        {/* Informative Title & Description */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-3 tracking-tight">
          عذراً، لم نتمكن من العثور على الأكاديمية أو الصفحة
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-medium mb-8 leading-relaxed max-w-md">
          قد يكون الرابط الذي اتبعته غير صحيح، أو تم نقل هذه الصفحة، أو أن عنوان الأكاديمية المطلوب غير متوفر حالياً.
        </p>

        {/* Action Buttons to Main Academy Template */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-[0.98]"
          >
            <Home size={18} />
            <span>العودة للرئيسية (قالب الأكاديمية)</span>
          </Link>

          <Link
            href="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
          >
            <BookOpen size={18} />
            <span>استعراض الدورات المتاحة</span>
          </Link>
        </div>

        <div className="mt-8 text-xs text-slate-400 font-bold flex items-center gap-1">
          <ArrowRight size={14} />
          <span>تأكد من صحة الرابط أو تواصل مع الدعم الفني</span>
        </div>
      </div>
    </div>
  );
}
