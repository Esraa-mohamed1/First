'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2, Landmark } from 'lucide-react';
import { UserPaymentInfo } from '@/services/finance';
import { getLogoUrl } from '@/lib/utils';

export interface ActiveAccountCardProps {
  method: UserPaymentInfo;
  onEdit: (method: UserPaymentInfo) => void;
  onDelete: (id: number) => void;
}

export const ActiveAccountCard = React.memo(({ method, onEdit, onDelete }: ActiveAccountCardProps) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [method.logo]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(method);
  }, [method, onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(method.id);
  }, [method.id, onDelete]);

  return (
    <div className="p-6 rounded-2xl border border-gray-150 bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-black text-gray-900 text-base">{method.name}</h4>
          <span className="inline-block text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wide">
            {method.currency}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center overflow-hidden shrink-0">
          {method.logo && !imgError ? (
            <img
              src={getLogoUrl(method.logo)}
              alt={method.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <Landmark size={20} />
          )}
        </div>
      </div>

      <div className="space-y-1 pt-2">
        <span className="text-xs text-gray-400 font-bold block">رقم الحساب / المحفظة</span>
        <span className="font-mono text-sm text-gray-700 font-bold break-all select-all block bg-gray-50 p-2.5 rounded-xl border border-gray-100/50 text-left">
          {method.accountValue}
        </span>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-50 shrink-0">
        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Edit2 size={12} />
          <span>تعديل</span>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1 text-xs font-black text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 size={12} />
          <span>حذف</span>
        </button>
      </div>
    </div>
  );
});

ActiveAccountCard.displayName = 'ActiveAccountCard';
