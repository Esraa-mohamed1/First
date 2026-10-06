'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface BankErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function BankErrorState({
  message = 'حدث خطأ أثناء تحميل بيانات بنك المحتوى.',
  onRetry,
}: BankErrorStateProps) {
  return (
    <div className="bg-red-50/70 border border-red-200/80 rounded-3xl p-8 text-center max-w-md mx-auto my-6 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
        <AlertCircle size={28} />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-red-900">تعذر تحميل البيانات</h3>
        <p className="text-red-600 text-sm font-medium leading-relaxed">{message}</p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20 active:scale-95 transition-all text-xs cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    </div>
  );
}
