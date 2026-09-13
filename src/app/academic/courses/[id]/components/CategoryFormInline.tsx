'use client';

import React, { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryFormInlineProps {
  onSubmit: (payload: any) => Promise<void>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onClose: () => void;
}

export const CategoryFormInline: React.FC<CategoryFormInlineProps> = ({
  onSubmit,
  errors,
  isSubmitting,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('يرجى إدخال اسم الفئة');
      return;
    }
    onSubmit({ name, is_active: isActive ? 1 : 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <label className="block text-sm font-black text-gray-900 text-right pr-1">
          اسم الفئة <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: التصوير الفوتوغرافي، البرمجة..."
          className={`w-full p-4 bg-gray-50 border ${errors.name ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl outline-none focus:bg-white font-bold text-right transition-all text-gray-900`}
          autoFocus
        />
        {errors.name && (
          <p className="flex items-center gap-1 text-red-500 text-xs font-bold px-1 mt-1">
            <X size={12} />
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <Check size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900">حالة الفئة</p>
            <p className="text-xs font-bold text-gray-400">{isActive ? 'الفئة نشطة وستظهر للطلاب' : 'الفئة غير نشطة ولن تظهر'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`w-14 h-8 rounded-full transition-all relative ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isActive ? 'right-7' : 'right-1'}`} />
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Check size={20} />
              <span>إضافة الفئة</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-8 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};
