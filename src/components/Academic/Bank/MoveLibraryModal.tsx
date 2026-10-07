'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderInput,
  Folder,
  Loader2,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Library } from '@/types/bank';
import { formatSelectedCountArabic } from '@/constants/bank';

interface MoveLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetLibraryId: string | number, targetLibraryName: string) => void;
  libraries: Library[];
  currentLibraryId: string | number;
  selectedCount: number;
  isPending?: boolean;
}

export default function MoveLibraryModal({
  isOpen,
  onClose,
  onConfirm,
  libraries,
  currentLibraryId,
  selectedCount,
  isPending = false,
}: MoveLibraryModalProps) {
  const otherLibraries = libraries.filter(
    (lib) => String(lib.id) !== String(currentLibraryId)
  );

  const [selectedTargetId, setSelectedTargetId] = useState<string | number>(
    otherLibraries[0]?.id || ''
  );

  useEffect(() => {
    if (otherLibraries.length > 0 && (!selectedTargetId || !otherLibraries.some(l => String(l.id) === String(selectedTargetId)))) {
      setSelectedTargetId(otherLibraries[0].id);
    }
  }, [otherLibraries, selectedTargetId]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedTargetId || otherLibraries.length === 0) return;
    const targetLib = otherLibraries.find(
      (l) => String(l.id) === String(selectedTargetId)
    );
    if (targetLib) {
      onConfirm(targetLib.id, targetLib.name);
    }
  };

  const selectedTargetLib = otherLibraries.find(
    (l) => String(l.id) === String(selectedTargetId)
  );

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
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs shrink-0">
              <FolderInput size={24} />
            </div>
            <div className="space-y-0.5 pe-6">
              <h3 className="text-xl font-black text-gray-900">نقل إلى مكتبة</h3>
              <p className="text-gray-500 text-xs font-bold">
                {formatSelectedCountArabic(selectedCount)}
              </p>
            </div>
          </div>

          {/* Libraries Radio List */}
          {otherLibraries.length === 0 ? (
            <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center space-y-2">
              <AlertCircle size={24} className="text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-600">
                مفيش مكتبة تانية تنقل ليها
              </p>
              <p className="text-[11px] text-gray-400">
                أنشئ مكتبة إضافية أولاً لتتمكن من نقل العناصر إليها.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pe-1">
              <label className="block text-xs font-bold text-gray-500 mb-1">
                اختر المكتبة الوجهة:
              </label>

              {otherLibraries.map((lib) => {
                const isSelected = String(lib.id) === String(selectedTargetId);
                const color = lib.color || '#6366F1';
                const totalCount =
                  lib.itemCounts?.total ??
                  ((lib.itemCounts?.lesson || 0) +
                    (lib.itemCounts?.video || 0) +
                    (lib.itemCounts?.question || 0));

                return (
                  <div
                    key={lib.id}
                    onClick={() => setSelectedTargetId(lib.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600/20 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${color}18`,
                          color: color,
                        }}
                      >
                        <Folder size={16} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">
                          {lib.name}
                        </h4>
                        <span className="text-[11px] text-gray-400 font-medium">
                          {totalCount} عنصر
                        </span>
                      </div>
                    </div>

                    {/* Radio Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending || otherLibraries.length === 0}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>جاري النقل...</span>
                </>
              ) : (
                <>
                  <FolderInput size={18} />
                  <span>نقل إلى مكتبة</span>
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
