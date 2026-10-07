'use client';

import React from 'react';
import { Plus, Database, Sparkles } from 'lucide-react';
import { USE_MOCK_BANK } from '@/services/bank';

interface BankHeaderProps {
  onOpenCreateModal: () => void;
}

export default function BankHeader({ onOpenCreateModal }: BankHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200/70">
      <div className="space-y-1.5 text-start">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <Database size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex flex-wrap items-center gap-2">
              <span>بنك المحتوى</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100/80 text-indigo-700">
                <Sparkles size={11} />
                <span>مركز الموارد</span>
              </span>
              {USE_MOCK_BANK && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  وضع تجريبي — البيانات مش محفوظة
                </span>
              )}
            </h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-2xl">
          كل محتواك في مكان واحد — استخدمه في أي دورة أو اختبار من غير ما تعيده.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          <Plus size={18} />
          <span>مكتبة جديدة</span>
        </button>
      </div>
    </div>
  );
}
