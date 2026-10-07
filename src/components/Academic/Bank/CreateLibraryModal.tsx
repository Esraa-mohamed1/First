'use client';

import React, { useState } from 'react';
import { X, Loader2, Plus, Sparkles, FolderPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCreateLibrary } from '@/hooks/useBank';
import { LIBRARY_PALETTE } from '@/constants/bank';

interface CreateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXAMPLE_CHIPS = [
  'Grammar Questions',
  '2026 Final Revision',
  'مسائل قانون أوم',
];

export default function CreateLibraryModal({
  isOpen,
  onClose,
}: CreateLibraryModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(LIBRARY_PALETTE[0]);

  const createLibraryMutation = useCreateLibrary();

  if (!isOpen) return null;

  const handleClose = () => {
    if (createLibraryMutation.isPending) return;
    setName('');
    setDescription('');
    setSelectedColor(LIBRARY_PALETTE[0]);
    onClose();
  };

  const handleApplyExample = (example: string) => {
    setName(example);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      const created = await createLibraryMutation.mutateAsync({
        name: trimmedName,
        description: description.trim(),
        color: selectedColor,
      });

      toast.success(`تم إنشاء المكتبة «${created.name}»`);
      handleClose();
      router.push(`/academic/bank/${created.id}`);
    } catch (error: any) {
      console.error('Failed to create library:', error);
      toast.error(error?.message || 'حدث خطأ أثناء إنشاء المكتبة');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200"
      dir="rtl"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[28px] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={createLibraryMutation.isPending}
          className="absolute top-5 start-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
          aria-label="إغلاق النافذة"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-start space-y-2 pe-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
              <FolderPlus size={14} />
              <span>تنظيم المحتوى</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900">مكتبة جديدة</h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              أنشئ مجلداً لتجميع الدروس والفيديوهات والأسئلة لسهولة الوصول إليها وإعادة استخدامها.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Library Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900 text-start">
                اسم المكتبة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: بنك أسئلة الفيزياء العامة"
                autoFocus
                disabled={createLibraryMutation.isPending}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-bold text-start transition-all text-gray-900 text-sm"
              />

              {/* Example quick-fill chips */}
              <div className="pt-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2 font-medium">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>أمثلة سريعة:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EXAMPLE_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleApplyExample(chip)}
                      disabled={createLibraryMutation.isPending}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 border border-transparent rounded-lg text-xs font-medium text-gray-600 transition-all cursor-pointer active:scale-95"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900 text-start">
                الوصف <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="أضف وصفاً مختصراً لمحتويات هذه المكتبة والغرض منها..."
                rows={2}
                disabled={createLibraryMutation.isPending}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-medium text-start transition-all text-gray-900 text-sm resize-none"
              />
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900 text-start">
                لون تمييز المكتبة
              </label>
              <div className="flex flex-wrap items-center gap-2.5 p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
                {LIBRARY_PALETTE.map((color) => {
                  const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110 shadow-sm'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`اختر اللون ${color}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={createLibraryMutation.isPending || !name.trim()}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {createLibraryMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>جاري الإنشاء...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>إنشاء المكتبة</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={createLibraryMutation.isPending}
                className="px-5 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all cursor-pointer text-sm"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
