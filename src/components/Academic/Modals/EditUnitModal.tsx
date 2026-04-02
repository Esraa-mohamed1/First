'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateUnit } from '@/services/courses';
import { Unit } from '@/types/api';

interface EditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
  onUnitUpdated: () => void;
}

const EditUnitModal = ({ isOpen, onClose, unit, onUnitUpdated }: EditUnitModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (unit) {
      setTitle(unit.title || '');
      setDescription(unit.description || '');
    }
  }, [unit]);

  if (!isOpen || !unit) return null;

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error('يرجى إدخال اسم الوحدة');
      return;
    }

    setIsLoading(true);
    try {
      await updateUnit(unit.id, {
        title,
        description,
        course_id: unit.course_id || (unit as any).pivot?.course_id // Handle potential missing course_id
      });
      toast.success('تم تحديث الوحدة بنجاح');
      onUnitUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('فشل تحديث الوحدة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-[480px] bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-900 transition-colors p-2 z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8 pt-12 md:p-10 md:pt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-900">تعديل الوحدة</h2>
            <p className="text-gray-500 font-bold mt-2">تحديث بيانات الوحدة التعليمية</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-right text-sm font-black text-gray-700 px-1">اسم الوحدة</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ادخل اسم الوحدة"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-right"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-right text-sm font-black text-gray-700 px-1">وصف الوحدة</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ادخل وصفاً للوحدة"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm min-h-[120px] transition-all text-right"
              />
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            <span>حفظ التغييرات</span>
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center p-0.5">
               {isLoading ? (
                 <Loader2 className="animate-spin text-white" size={14} />
               ) : (
                 <CheckCircle2 size={16} strokeWidth={3} className="text-white" />
               )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUnitModal;
