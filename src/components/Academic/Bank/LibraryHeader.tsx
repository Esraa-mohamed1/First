'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, X, CheckSquare, Folder } from 'lucide-react';
import { Library } from '@/types/bank';
import { USE_MOCK_BANK } from '@/services/bank';

interface LibraryHeaderProps {
  library?: Library;
  selectedCount: number;
  onClearSelection: () => void;
  onSelectAllVisible: () => void;
  onOpenAddModal: () => void;
}

/**
 * Helper to pluralize Arabic selection count accurately
 */
const formatSelectionCount = (count: number): string => {
  if (count === 1) return 'عنصر واحد محدد';
  if (count === 2) return 'عنصران محددان';
  if (count >= 3 && count <= 10) return `${count} عناصر محددة`;
  return `${count} عنصراً محدداً`;
};

export default function LibraryHeader({
  library,
  selectedCount,
  onClearSelection,
  onSelectAllVisible,
  onOpenAddModal,
}: LibraryHeaderProps) {
  const isSelectionActive = selectedCount > 0;
  const totalItems =
    library?.itemCounts?.total ??
    ((library?.itemCounts?.lesson || 0) +
      (library?.itemCounts?.video || 0) +
      (library?.itemCounts?.question || 0));

  const primaryColor = library?.color || '#6366F1';

  if (isSelectionActive) {
    // =========================================================================
    // SELECTION MODE HEADER
    // =========================================================================
    return (
      <div className="bg-indigo-600 text-white rounded-3xl p-4 sm:p-5 shadow-lg shadow-indigo-600/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-3">
          {/* Clear X Button */}
          <button
            type="button"
            onClick={onClearSelection}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer text-white"
            aria-label="إلغاء التحديد"
            title="إلغاء التحديد"
          >
            <X size={18} />
          </button>

          {/* Count Text */}
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black tracking-tight">
              {formatSelectionCount(selectedCount)}
            </span>
          </div>
        </div>

        {/* Selection Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAllVisible}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckSquare size={14} />
            <span>تحديد عناصر الصفحة</span>
          </button>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // NORMAL LIBRARY HEADER
  // ===========================================================================
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200/70">
      <div className="space-y-2 text-start">
        {/* Back Link */}
        <div>
          <Link
            href="/academic/bank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowRight size={14} />
            <span>العودة لبنك المحتوى</span>
          </Link>
        </div>

        {/* Title & Count Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs shrink-0"
            style={{
              backgroundColor: `${primaryColor}18`,
              color: primaryColor,
            }}
          >
            <Folder size={20} className="fill-current/20" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {library?.name || 'تفاصيل المكتبة'}
          </h1>

          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200/60">
            {totalItems} عنصر
          </span>

          {USE_MOCK_BANK && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              وضع تجريبي — البيانات مش محفوظة
            </span>
          )}
        </div>

        {library?.description && (
          <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
            {library.description}
          </p>
        )}
      </div>

      {/* Primary Add Button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          <Plus size={18} />
          <span>إضافة محتوى</span>
        </button>
      </div>
    </div>
  );
}
