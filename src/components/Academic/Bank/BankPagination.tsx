'use client';

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface BankPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export default function BankPagination({
  page,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}: BankPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = Math.min((page - 1) * limit + 1, totalItems);
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200/60 text-xs text-gray-500 font-medium select-none">
      <div>
        <span>عرض {startItem}–{endItem} من إجمالي {totalItems} عنصر</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-bold transition-colors cursor-pointer"
        >
          <ChevronRight size={14} />
          <span>السابق</span>
        </button>

        <span className="px-3 py-2 font-bold text-gray-900 bg-gray-100 rounded-xl">
          صفحة {page} من {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-bold transition-colors cursor-pointer"
        >
          <span>التالي</span>
          <ChevronLeft size={14} />
        </button>
      </div>
    </div>
  );
}
