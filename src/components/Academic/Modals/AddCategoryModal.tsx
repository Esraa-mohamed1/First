'use client';

import React, { useState } from 'react';
import { X, Loader2, Tag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCategory, getCategories } from '@/services/courses';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCategory: any) => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('يرجى كتابة اسم التصنيف');
      return;
    }

    setLoading(true);
    try {
      const newCat = await createCategory(name.trim());
      const allCategories = await getCategories();
      toast.success('تمت إضافة التصنيف بنجاح!');
      setName('');
      setDescription('');
      onSuccess(newCat || { id: name.trim(), name: name.trim() });
      onClose();
    } catch (err: any) {
      console.error('Failed to create category:', err);
      toast.error('حدث خطأ أثناء إضافة التصنيف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 border border-slate-100 relative animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">إضافة تصنيف جديد للدورات</h2>
            <p className="text-xs font-bold text-slate-500">أنشئ فئة جديدة لترتيب وتنسيق الدورات التعليمية</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black mb-1.5 text-slate-800">
              اسم التصنيف <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
              placeholder="مثال: البرمجة والتطوير، التصميم، التسويق..."
            />
          </div>

          <div>
            <label className="block text-xs font-black mb-1.5 text-slate-800">الوصف (اختياري)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
              placeholder="وصف مختصر للتصنيف..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-black hover:bg-slate-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-100 transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>إضافة التصنيف</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
