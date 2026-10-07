'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Loader2, BookOpen, FileText, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateBankItem } from '@/hooks/useBank';

interface LessonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  libraryId: string | number;
}

export default function LessonFormModal({
  isOpen,
  onClose,
  onBack,
  libraryId,
}: LessonFormModalProps) {
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState('');
  const [content, setContent] = useState('');
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<'back' | 'close' | null>(null);

  const createItemMutation = useCreateBankItem();

  // Reset form state every time modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setUnit('');
      setContent('');
      setPdfFileName(null);
      setShowUnsavedPrompt(false);
      setPendingAction(null);
    }
  }, [isOpen]);

  const isDirty = useMemo(() => {
    return title.trim() !== '' || unit.trim() !== '' || content.trim() !== '' || pdfFileName !== null;
  }, [title, unit, content, pdfFileName]);

  const handleRequestBack = () => {
    if (createItemMutation.isPending) return;
    if (isDirty) {
      setPendingAction('back');
      setShowUnsavedPrompt(true);
      return;
    }
    onBack();
  };

  const handleRequestClose = () => {
    if (createItemMutation.isPending) return;
    if (isDirty) {
      setPendingAction('close');
      setShowUnsavedPrompt(true);
      return;
    }
    onClose();
  };

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showUnsavedPrompt) {
        handleRequestClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showUnsavedPrompt, isDirty]);

  if (!isOpen) return null;

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    try {
      // TODO: When backend file-upload endpoint is available, upload PDF file via multipart/form-data.
      await createItemMutation.mutateAsync({
        kind: 'lesson',
        libraryId,
        title: trimmedTitle,
        unit: unit.trim() || undefined,
        content: content.trim() || undefined,
        pdfUrl: pdfFileName ? `https://example.com/uploads/${pdfFileName}` : undefined,
      });

      toast.success(`تم حفظ درس «${trimmedTitle}»`);
      onClose();
    } catch (error: any) {
      console.error('Failed to create lesson bank item:', error);
      toast.error(error?.message || 'حدث خطأ أثناء إضافة الدرس');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[110] flex items-center justify-center p-4 animate-in fade-in duration-150"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-lesson-form-title"
      onClick={handleRequestClose}
    >
      <div
        className="bg-white rounded-[28px] p-6 sm:p-8 max-w-xl w-full shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar with Back and Close Buttons */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRequestBack}
              disabled={createItemMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
              title="رجوع لاختيار نوع المحتوى"
            >
              <ArrowRight size={14} />
              <span>رجوع</span>
            </button>

            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen size={18} />
            </div>

            <div className="text-start">
              <h2 id="modal-lesson-form-title" className="text-lg font-black text-gray-900 tracking-tight">
                إضافة درس ومستند
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRequestClose}
            disabled={createItemMutation.isPending}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lesson Form */}
        <form noValidate onSubmit={handleSubmit} className="space-y-4 text-start">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">
              عنوان الدرس <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ملخص قواعد الاشتقاق في التفاضل"
              autoFocus
              disabled={createItemMutation.isPending}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-bold transition text-gray-900 text-sm"
            />
          </div>

          {/* Unit Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">
              الوحدة أو الفصل <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="مثال: الوحدة الأولى: الميكانيكا الكلاسيكية"
              disabled={createItemMutation.isPending}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-medium transition text-gray-900 text-sm"
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">محتوى الدرس والشرح</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب شرح الدرس أو النقاط الرئيسية هنا..."
              rows={4}
              disabled={createItemMutation.isPending}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-medium transition text-gray-900 text-sm resize-none leading-relaxed"
            />
          </div>

          {/* Optional PDF Picker */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">
              ملف PDF مرفق <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
            </label>
            <div className="relative">
              <label className="border-2 border-dashed border-gray-200 hover:border-indigo-300 bg-gray-50 hover:bg-indigo-50/30 rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer transition text-center">
                <FileText size={20} className="text-indigo-600" />
                <span className="text-xs font-bold text-gray-700">
                  {pdfFileName ? pdfFileName : 'انقر لاختيار ملف PDF من جهازك'}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                  disabled={createItemMutation.isPending}
                />
              </label>
              {pdfFileName && (
                <button
                  type="button"
                  onClick={() => setPdfFileName(null)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-xs text-red-500 font-bold hover:underline"
                >
                  إزالة
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={createItemMutation.isPending || !title.trim()}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {createItemMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>حفظ في بنك المحتوى</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRequestClose}
              disabled={createItemMutation.isPending}
              className="px-5 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition cursor-pointer text-sm"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      {showUnsavedPrompt && (
        <div
          className="fixed inset-0 bg-black/60 z-[130] flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowUnsavedPrompt(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 space-y-4 text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <AlertCircle size={24} />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-gray-900">تعديلات غير محفوظة</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                {pendingAction === 'back'
                  ? 'في بيانات ماتحفظتش. ترجع من غير حفظ؟'
                  : 'في بيانات ماتحفظتش. تخرج من غير حفظ؟'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowUnsavedPrompt(false);
                  if (pendingAction === 'back') {
                    onBack();
                  } else {
                    onClose();
                  }
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                تأكيد الخروج
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUnsavedPrompt(false);
                  setPendingAction(null);
                }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                البقاء في الصفحة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
