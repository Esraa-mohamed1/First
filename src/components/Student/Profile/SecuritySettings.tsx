'use client';

import React from 'react';
import { ShieldCheck, Lock, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const SecuritySettings = () => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md relative overflow-hidden h-fit">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-50 text-red-500 p-2.5 rounded-2xl">
          <ShieldCheck size={22} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">الأمان والحماية</h2>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => router.push('/auth/reset-password')}
          className="w-full flex items-center justify-between p-4 bg-[#EAEFEF] hover:bg-gray-100/80 rounded-2xl border border-gray-100 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm group-hover:text-gray-600 transition-colors">
              <Lock size={18} />
            </div>

            <div className="text-right">
              <h3 className="font-bold text-gray-800 text-sm">
                كلمة المرور
              </h3>
            </div>
          </div>

          <ChevronLeft
            size={18}
            className="text-gray-400 group-hover:text-gray-600 group-hover:-translate-x-1 transition-all"
          />
        </button>
      </div>
    </div>
  );
};

