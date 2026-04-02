'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Video, FileText, FilePieChart as FilePowerpoint } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateLesson } from '@/services/courses';
import { Lesson } from '@/types/api';

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onLessonUpdated: () => void;
}

const EditLessonModal = ({ isOpen, onClose, lesson, onLessonUpdated }: EditLessonModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || '');
      setDescription(lesson.description || '');
    }
  }, [lesson]);

  if (!isOpen || !lesson) return null;

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان الدرس');
      return;
    }

    setIsLoading(true);
    try {
      await updateLesson(lesson.id, {
        chapter_id: (lesson as any).chapter_id || (lesson as any).unit_id,
        title,
        description,
        type: lesson.type,
        video_id: lesson.video_id,
        file_url: lesson.file_url,
        is_free: lesson.is_free,
        order: (lesson as any).order || 1
      });
      toast.success('تم تحديث الدرس بنجاح');
      onLessonUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('فشل تحديث الدرس');
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
             <div className={`w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                {lesson.type === 'video' ? <Video size={28} /> : 
                 lesson.type === 'pdf' ? <FileText size={28} /> : <FilePowerpoint size={28} />}
             </div>
            <h2 className="text-2xl font-black text-gray-900">تعديل الدرس</h2>
            <p className="text-gray-500 font-bold mt-2">تحديث بيانات الدرس التعليمي</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-right text-sm font-black text-gray-700 px-1">عنوان الدرس</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ادخل عنوان الدرس"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-right"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-right text-sm font-black text-gray-700 px-1">وصف الدرس</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ادخل وصفاً للدرس"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm min-h-[120px] transition-all text-right"
              />
            </div>
            
             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">نوع المحتوي</span>
                <span className="text-sm font-black text-gray-700">
                    {lesson.type === 'video' ? 'فيديو' : lesson.type === 'pdf' ? 'ملف PDF' : 'عرض تقديمي'}
                </span>
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

export default EditLessonModal;
