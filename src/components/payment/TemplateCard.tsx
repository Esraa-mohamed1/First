'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2, Landmark } from 'lucide-react';
import { ReceiverAccount } from '@/types/api';
import { getLogoUrl } from '@/lib/utils';

export interface TemplateCardProps {
  template: ReceiverAccount;
  onEdit: (template: ReceiverAccount) => void;
  onDelete: (id: number) => void;
}

export const TemplateCard = React.memo(({ template, onEdit, onDelete }: TemplateCardProps) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [template.logo]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(template);
  }, [template, onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(template.id);
  }, [template.id, onDelete]);

  return (
    <div className="p-5 rounded-2xl border border-gray-150 bg-white hover:border-blue-100 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-black text-gray-900 text-sm">{template.name}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-block text-[9px] bg-blue-50/80 text-blue-600 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
              {template.key}
            </span>
            {template.country_code && (
              <span className="inline-block text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                {template.country_code}
              </span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150/80 flex items-center justify-center overflow-hidden shrink-0">
          {template.logo && !imgError ? (
            <img
              src={getLogoUrl(template.logo)}
              alt={template.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <Landmark size={18} className="text-slate-400" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-50 shrink-0">
        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center gap-1 text-[11px] font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 px-2.5 py-1 rounded-lg transition-colors"
        >
          <Edit2 size={11} />
          <span>تعديل</span>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1 text-[11px] font-black text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
        >
          <Trash2 size={11} />
          <span>حذف</span>
        </button>
      </div>
    </div>
  );
});

TemplateCard.displayName = 'TemplateCard';
