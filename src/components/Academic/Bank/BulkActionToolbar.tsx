'use client';

import React from 'react';
import {
  FolderInput,
  Copy,
  Trash2,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { formatSelectedCountArabic } from '@/constants/bank';

interface BulkActionToolbarProps {
  selectedCount: number;
  onOpenMove: () => void;
  onDuplicate: () => void;
  onOpenDelete: () => void;
  isDuplicating?: boolean;
  isPending?: boolean;
}

export default function BulkActionToolbar({
  selectedCount,
  onOpenMove,
  onDuplicate,
  onOpenDelete,
  isDuplicating = false,
  isPending = false,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null;

  const isDisabled = isPending || isDuplicating;

  return (
    <div
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-5 duration-200"
      dir="rtl"
    >
      <div
        role="toolbar"
        aria-label="إجراءات العناصر المحددة"
        className="pointer-events-auto bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-3 sm:gap-4 max-w-xl w-full justify-between"
      >
        {/* Selection Count Badge */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-gray-200 whitespace-nowrap">
            {formatSelectedCountArabic(selectedCount)}
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-700/80 shrink-0" />

        {/* Action Buttons Group */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Move Button */}
          <button
            type="button"
            onClick={onOpenMove}
            disabled={isDisabled}
            className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            title="نقل إلى مكتبة أخرى"
          >
            <FolderInput size={15} className="text-indigo-400" />
            <span>نقل</span>
          </button>

          {/* Duplicate Button */}
          <button
            type="button"
            onClick={onDuplicate}
            disabled={isDisabled}
            className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            title="نسخ في نفس المكتبة"
          >
            {isDuplicating ? (
              <Loader2 size={15} className="animate-spin text-blue-400" />
            ) : (
              <Copy size={15} className="text-blue-400" />
            )}
            <span>نسخ</span>
          </button>

          {/* Delete Button (Destructive) */}
          <button
            type="button"
            onClick={onOpenDelete}
            disabled={isDisabled}
            className="px-3.5 py-2 bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            title="حذف العناصر المحددة"
          >
            <Trash2 size={15} />
            <span>حذف</span>
          </button>
        </div>
      </div>
    </div>
  );
}
