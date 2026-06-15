'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Info, Eye, FileEdit } from 'lucide-react';

interface CourseStatusToggleProps {
  status: 'published' | 'draft';
  onChange: (status: 'published' | 'draft') => void;
}

export const CourseStatusToggle = ({ status, onChange }: CourseStatusToggleProps): React.JSX.Element => {
  const isPublished = status === 'published';

  return (
    <div className="flex flex-col space-y-4 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
        <div>
          <h4 className="text-sm font-black text-slate-900">حالة نشر الدورة</h4>
          <p className="text-[11px] text-slate-400 font-bold mt-1">حدد ما إذا كانت الدورة مرئية للطلاب أم مسودة للعمل عليها</p>
        </div>
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/80 shadow-sm w-fit self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onChange('draft')}
            className={clsx(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black transition-all duration-300",
              !isPublished 
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                : "text-slate-400 hover:text-slate-700"
            )}
          >
            <FileEdit size={14} />
            <span>مسودة</span>
          </button>
          <button
            type="button"
            onClick={() => onChange('published')}
            className={clsx(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black transition-all duration-300",
              isPublished 
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20" 
                : "text-slate-400 hover:text-slate-700"
            )}
          >
            <Eye size={14} />
            <span>منشورة</span>
          </button>
        </div>
      </div>
      
      {isPublished ? (
        <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-800 text-xs shadow-sm animate-in fade-in duration-300">
          <div className="p-1 bg-emerald-100 rounded-lg text-emerald-700 shrink-0 mt-0.5">
            <Info size={14} />
          </div>
          <p className="font-bold leading-relaxed">الدورة منشورة حالياً وتظهر للطلاب المشتركين والزوار في المتجر.</p>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-amber-800 text-xs shadow-sm animate-in fade-in duration-300">
          <div className="p-1 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
            <Info size={14} />
          </div>
          <p className="font-bold leading-relaxed">الدورة في وضع المسودة ولا يمكن للطلاب الوصول إليها أو الاشتراك بها حالياً.</p>
        </div>
      )}
    </div>
  );
};
