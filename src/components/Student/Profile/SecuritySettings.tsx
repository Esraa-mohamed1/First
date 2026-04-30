import React from 'react';
import { ShieldCheck, Lock, KeyRound, ChevronLeft } from 'lucide-react';

export const SecuritySettings = () => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md relative overflow-hidden h-fit">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-50 text-red-500 p-2 rounded-xl">
          <ShieldCheck size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">الأمان والحماية</h2>
      </div>

      <div className="space-y-4">
        <button className="w-full flex items-center justify-between p-4 bg-[#EAEFEF] hover:bg-gray-100/80 rounded-2xl border border-gray-100 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm group-hover:text-gray-600 transition-colors">
              <Lock size={18} />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-gray-800 text-sm">كلمة المرور</h3>
              <p className="text-xs text-gray-500 mt-0.5">آخر تغيير منذ شهرين</p>
            </div>
          </div>
          <ChevronLeft size={18} className="text-gray-400 group-hover:text-gray-600 group-hover:-translate-x-1 transition-all" />
        </button>

        <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100/80 rounded-2xl border border-gray-100 transition-all group relative overflow-hidden">
          {/* Active indicator */}
          <div className="absolute top-4 left-32 flex items-center gap-1.5 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            مفعل
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm group-hover:text-gray-600 transition-colors">
              <KeyRound size={18} />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-gray-800 text-sm">التحقق بخطوتين</h3>
              <p className="text-xs text-gray-500 mt-0.5">حماية إضافية لحسابك</p>
            </div>
          </div>
          <ChevronLeft size={18} className="text-gray-400 group-hover:text-gray-600 group-hover:-translate-x-1 transition-all opacity-0 group-hover:opacity-100 translate-x-2" />
        </button>
      </div>
    </div>
  );
};
