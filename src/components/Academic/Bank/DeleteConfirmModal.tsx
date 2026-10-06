'use client';

import React from 'react';
import { AlertTriangle, Trash2, Loader2, X, Info } from 'lucide-react';
import { formatItemCountArabic } from '@/constants/bank';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  usedCount: number;
  isPending?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  usedCount,
  isPending = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const countText = formatItemCountArabic(selectedCount);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-in fade-in duration-200"
      dir="rtl"
      onClick={() => {
        if (!isPending) onClose();
      }}
    >
      <div
        className="bg-white rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute top-5 start-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
          aria-label="إغلاق النافذة"
        >
          <X size={20} />
        </button>

        <div className="space-y-5 text-start">
          {/* Header & Icon */}
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs">
            <Trash2 size={26} />
          </div>

          <div className="space-y-1.5 pe-6">
            <h3 className="text-xl font-black text-gray-900">
              حذف {countText}؟
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              هل أنت متأكد من رغبتك في حذف العناصر المحددة من هذه المكتبة؟
            </p>
          </div>

          {/* Neutral Usage Warning (Only when usedCount > 0) */}
          {usedCount > 0 && (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 font-medium leading-relaxed">
              <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <span>
                {usedCount === 1
                  ? 'عنصر واحد من العناصر المحددة مستخدم في دورات أو اختبارات.'
                  : usedCount === 2
                  ? 'عنصران من العناصر المحددة مستخدمان في دورات أو اختبارات.'
                  : `${usedCount} من العناصر المحددة مستخدمة في دورات أو اختبارات.`}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>جاري الحذف...</span>
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  <span>حذف</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all cursor-pointer text-sm"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
