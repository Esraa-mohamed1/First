'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Info, Eye, FileEdit } from 'lucide-react';

interface CourseStatusToggleProps {
  status: 'published' | 'draft';
  onChange: (status: 'published' | 'draft') => void;
}

export const CourseStatusToggle = ({ status, onChange }: CourseStatusToggleProps) => {
  const isPublished = status === 'published';

  return (
    <div className="flex flex-col space-y-3" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-gray-900">حالة نشر الدورة</h4>
          <p className="text-xs text-gray-400 font-bold mt-0.5">حدد ما إذا كانت الدورة مرئية للطلاب أم مسودة للعمل عليها</p>
        </div>
        <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200/50">
          <button
            type="button"
            onClick={() => onChange('draft')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all",
              !isPublished 
                ? "bg-white text-gray-900 shadow-sm border border-gray-200/20" 
                : "text-gray-400 hover:text-gray-700"
            )}
          >
            <FileEdit size={14} />
            <span>مسودة</span>
          </button>
          <button
            type="button"
            onClick={() => onChange('published')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all",
              isPublished 
                ? "bg-green-600 text-white shadow-lg shadow-green-500/20" 
                : "text-gray-400 hover:text-gray-700"
            )}
          >
            <Eye size={14} />
            <span>منشورة</span>
          </button>
        </div>
      </div>
      
      {isPublished ? (
        <div className="flex items-start gap-2 p-3 bg-green-50/50 rounded-xl border border-green-100 text-green-700 text-xs">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p className="font-bold leading-relaxed">الدورة منشورة حالياً وتظهر للطلاب المشتركين والزوار في المتجر.</p>
        </div>
      ) : (
        <div className="flex items-start gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-amber-700 text-xs">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p className="font-bold leading-relaxed">الدورة في وضع المسودة ولا يمكن للطلاب الوصول إليها أو الاشتراك بها حالياً.</p>
        </div>
      )}
    </div>
  );
};
