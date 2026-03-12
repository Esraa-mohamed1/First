'use client';

import { ShieldCheck, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-500">
        
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
          <ShieldCheck className="w-12 h-12 text-yellow-600" />
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-6">
          تحقق من حسابك
        </h1>
        
        <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
          يرجى التحقق من بريدك الإلكتروني أو رقم هاتفك لتفعيل حسابك والبدء في استخدام جميع مميزات المنصة.
        </p>

        <div className="space-y-4 max-w-md mx-auto">
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3">
            <Mail size={20} />
            إعادة إرسال رمز التحقق
          </button>
          
          <Link 
            href="/dashboard"
            className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-3"
          >
            العودة للوحة التحكم
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
