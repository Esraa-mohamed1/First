'use client';

import React from 'react';
import { FolderPlus, SearchX, Plus, RotateCcw } from 'lucide-react';

interface BankEmptyStateProps {
  type: 'no-libraries' | 'no-results';
  onOpenCreateModal?: () => void;
  onResetFilters?: () => void;
}

export default function BankEmptyState({
  type,
  onOpenCreateModal,
  onResetFilters,
}: BankEmptyStateProps) {
  if (type === 'no-libraries') {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-dashed border-gray-200 max-w-lg mx-auto my-6 space-y-4 shadow-sm animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <FolderPlus size={32} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-gray-900">لا توجد مكتبات حتى الآن</h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
            أنشئ مكتبتك الأولى لتنظيم الدروس والفيديوهات والأسئلة واستخدامها بسهولة في أي دورة أو اختبار.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all text-sm cursor-pointer"
          >
            <Plus size={18} />
            <span>إنشاء أول مكتبة</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 max-w-md mx-auto my-6 space-y-4 shadow-sm animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-3xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
        <SearchX size={32} />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-black text-gray-900">مفيش نتائج</h3>
        <p className="text-gray-500 text-sm font-medium leading-relaxed">
          لم نعثر على أي عناصر تطابق عبارة البحث أو التصفية المحددة.
        </p>
      </div>

      {onResetFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all text-sm cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>إعادة تعيين البحث</span>
          </button>
        </div>
      )}
    </div>
  );
}
