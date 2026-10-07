'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Loader2,
  Video,
  Upload,
  Link as LinkIcon,
  Film,
  ShieldCheck,
  Plus,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateBankItem } from '@/hooks/useBank';

interface VideoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  libraryId: string | number;
}

type VideoSource = 'upload' | 'library' | 'url';

export default function VideoFormModal({
  isOpen,
  onClose,
  onBack,
  libraryId,
}: VideoFormModalProps) {
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState('');
  const [videoSource, setVideoSource] = useState<VideoSource>('upload');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<'back' | 'close' | null>(null);

  const createItemMutation = useCreateBankItem();

  // Reset form state every time modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setUnit('');
      setVideoSource('upload');
      setVideoUrl('');
      setVideoFileName(null);
      setShowUnsavedPrompt(false);
      setPendingAction(null);
    }
  }, [isOpen]);

  const isDirty = useMemo(() => {
    return (
      title.trim() !== '' ||
      unit.trim() !== '' ||
      videoUrl.trim() !== '' ||
      videoFileName !== null
    );
  }, [title, unit, videoUrl, videoFileName]);

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

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    try {
      // TODO: When backend video-upload / bunny integration is ready, handle direct upload.
      await createItemMutation.mutateAsync({
        kind: 'video',
        libraryId,
        title: trimmedTitle,
        unit: unit.trim() || undefined,
        source: videoSource,
        url:
          videoSource === 'url'
            ? videoUrl.trim() || 'https://example.com/video.mp4'
            : videoFileName
            ? `https://example.com/videos/${videoFileName}`
            : 'https://example.com/demo-video.mp4',
        duration: 600, // Default estimated 10 mins
      });

      toast.success(`تم حفظ فيديو «${trimmedTitle}»`);
      onClose();
    } catch (error: any) {
      console.error('Failed to create video bank item:', error);
      toast.error(error?.message || 'حدث خطأ أثناء إضافة الفيديو');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[110] flex items-center justify-center p-4 animate-in fade-in duration-150"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-video-form-title"
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

            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Video size={18} />
            </div>

            <div className="text-start">
              <h2 id="modal-video-form-title" className="text-lg font-black text-gray-900 tracking-tight">
                إضافة فيديو تعليمي
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

        {/* Video Form */}
        <form noValidate onSubmit={handleSubmit} className="space-y-4 text-start">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">
              عنوان الفيديو <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: شرح تجربة البندول البسيط وتطبيقاته"
              autoFocus
              disabled={createItemMutation.isPending}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-bold transition text-gray-900 text-sm"
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium transition text-gray-900 text-sm"
            />
          </div>

          {/* Source Segmented Control */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">مصدر الفيديو</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setVideoSource('upload')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  videoSource === 'upload'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                رفع فيديو
              </button>
              <button
                type="button"
                onClick={() => setVideoSource('library')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  videoSource === 'library'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                مكتبة الفيديو
              </button>
              <button
                type="button"
                onClick={() => setVideoSource('url')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  videoSource === 'url'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                رابط خارجي
              </button>
            </div>
          </div>

          {/* Video URL or Upload Box */}
          {videoSource === 'url' ? (
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-900">
                رابط الفيديو (YouTube / Vimeo / Direct Link)
              </label>
              <div className="relative" dir="ltr">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-gray-400">
                  <LinkIcon size={16} />
                </div>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  disabled={createItemMutation.isPending}
                  className="w-full ps-10 pe-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-mono text-xs text-start transition text-gray-900"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-900">
                {videoSource === 'upload' ? 'اختر ملف الفيديو' : 'اختر فيديو من المكتبة السحابية'}
              </label>
              <label className="border-2 border-dashed border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-blue-50/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  {videoSource === 'upload' ? <Upload size={20} /> : <Film size={20} />}
                </div>
                <span className="text-xs font-bold text-gray-700">
                  {videoFileName ? videoFileName : 'اسحب وأفلت الفيديو هنا أو انقر للاختيار'}
                </span>
                <span className="text-[11px] text-gray-400">
                  يدعم صيغ MP4, MOV, WebM حتى 2 جيجابايت
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                  disabled={createItemMutation.isPending}
                />
              </label>
            </div>
          )}

          {/* Protection Security Note */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100/80 text-xs font-medium">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>الفيديوهات محمية ضد التحميل والتسجيل.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={createItemMutation.isPending || !title.trim()}
              className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
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
