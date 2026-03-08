'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createUnit } from '@/services/courses';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  onUnitAdded: () => void;
}

const AddUnitModal = ({ isOpen, onClose, courseId, onUnitAdded }: AddUnitModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title) {
      toast.error('ادخل اسم الوحدة');
      return;
    }

    setIsSubmitting(true);
    try {
      await createUnit({
        course_id: courseId,
        title,
        description,
      });
      toast.success('تم إضافة الوحدة بنجاح');
      onUnitAdded();
      onClose();
      setTitle('');
      setDescription('');
    } catch (error) {
      toast.error('فشل إضافة الوحدة');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-gray-900">ادخل بيانات الوحدة</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900 text-right">اسم الوحدة</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ادخل اسم الوحدة" 
                className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900 text-right">اضف وصف للوحدة</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ادخل وصف للوحدة" 
                className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold min-h-[120px] text-right transition-all"
              ></textarea>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default AddUnitModal;
