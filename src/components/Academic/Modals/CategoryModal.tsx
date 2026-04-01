'use client';

import React, { useState, useEffect } from 'react';
import { X, LayoutGrid, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCategory, updateCategory } from '@/services/courses';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any | null;
  onSuccess: () => void;
}

const CategoryModal = ({ isOpen, onClose, category, onSuccess }: CategoryModalProps) => {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIsActive(category.is_active === 1 || category.is_active === true);
    } else {
      setName('');
      setIsActive(true);
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('يرجى إدخال اسم الفئة');
      return;
    }

    setIsSubmitting(true);
    try {
      if (category) {
        await updateCategory(category.id, name, isActive ? 1 : 0);
        toast.success('تم تحديث الفئة بنجاح');
      } else {
        await createCategory(name, isActive ? 1 : 0);
        toast.success('تم إضافة الفئة بنجاح');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'فشل تنفيذ العملية');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div className="flex gap-4 items-center">
             <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
                <LayoutGrid size={28} />
             </div>
             <div>
                <h2 className="text-xl font-black text-gray-900">{category ? 'تعديل فئة' : 'إضافة فئة جديدة'}</h2>
                <p className="text-gray-400 font-bold text-xs mt-1">
                   {category ? 'قم بتعديل بيانات الفئة الحالية' : 'أضف فئة جديدة لتنظيم دوراتك'}
                </p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-gray-900 text-right pr-1">
              اسم الفئة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: التصوير الفوتوغرافي، البرمجة..."
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-right transition-all"
              autoFocus
            />
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
                  <span>{category ? 'حفظ التعديلات' : 'إضافة الفئة'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-8 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
