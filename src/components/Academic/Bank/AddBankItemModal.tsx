'use client';

import React, { useState } from 'react';
import {
  X,
  Loader2,
  BookOpen,
  Video,
  HelpCircle,
  Upload,
  Link as LinkIcon,
  Film,
  FileText,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateBankItem } from '@/hooks/useBank';
import { QuestionType } from '@/types/bank';
import { QUESTION_TYPES_LIST } from '@/constants/bank';

interface AddBankItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  libraryId: string | number;
  onSelectQuestionType?: (type: QuestionType) => void;
}

type SelectedKind = 'lesson' | 'video' | 'question';
type VideoSource = 'upload' | 'library' | 'url';

export default function AddBankItemModal({
  isOpen,
  onClose,
  libraryId,
  onSelectQuestionType,
}: AddBankItemModalProps) {
  const [selectedKind, setSelectedKind] = useState<SelectedKind>('lesson');
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState('');

  // Lesson-specific state
  const [content, setContent] = useState('');
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  // Video-specific state
  const [videoSource, setVideoSource] = useState<VideoSource>('upload');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState<string | null>(null);

  const createItemMutation = useCreateBankItem();

  if (!isOpen) return null;

  const handleClose = () => {
    if (createItemMutation.isPending) return;
    setTitle('');
    setUnit('');
    setContent('');
    setPdfFileName(null);
    setVideoUrl('');
    setVideoFileName(null);
    setSelectedKind('lesson');
    setVideoSource('upload');
    onClose();
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
    }
  };

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
      if (selectedKind === 'lesson') {
        // TODO: When backend file-upload endpoint is available, upload PDF file via multipart/form-data.
        // For now, in mock mode we store the reference URL or filename.
        await createItemMutation.mutateAsync({
          kind: 'lesson',
          libraryId,
          title: trimmedTitle,
          unit: unit.trim() || undefined,
          content: content.trim() || undefined,
          pdfUrl: pdfFileName ? `https://example.com/uploads/${pdfFileName}` : undefined,
        });

        toast.success(`تم حفظ درس «${trimmedTitle}»`);
      } else if (selectedKind === 'video') {
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
      }

      handleClose();
    } catch (error: any) {
      console.error('Failed to create bank item:', error);
      toast.error(error?.message || 'حدث خطأ أثناء إضافة المحتوى');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200"
      dir="rtl"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[28px] p-6 sm:p-8 max-w-xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={createItemMutation.isPending}
          className="absolute top-5 start-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
          aria-label="إغلاق النافذة"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-start space-y-1 pe-8">
            <h2 className="text-2xl font-black text-gray-900">إضافة محتوى للمكتبة</h2>
            <p className="text-gray-500 text-sm font-medium">
              اختر نوع المحتوى وأدخل التفاصيل لحفظه في بنك المحتوى وإعادة استخدامه.
            </p>
          </div>

          {/* Top 3 Kind Tiles */}
          <div className="grid grid-cols-3 gap-3">
            {/* Tile 1: Lesson */}
            <button
              type="button"
              onClick={() => setSelectedKind('lesson')}
              className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                selectedKind === 'lesson'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-600/20 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedKind === 'lesson'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-600'
                }`}
              >
                <BookOpen size={20} />
              </div>
              <span className="text-xs font-bold">درس ومستند</span>
            </button>

            {/* Tile 2: Video */}
            <button
              type="button"
              onClick={() => setSelectedKind('video')}
              className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                selectedKind === 'video'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedKind === 'video'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                <Video size={20} />
              </div>
              <span className="text-xs font-bold">فيديو تعليمي</span>
            </button>

            {/* Tile 3: Question */}
            <button
              type="button"
              onClick={() => setSelectedKind('question')}
              className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                selectedKind === 'question'
                  ? 'border-purple-600 bg-purple-50/50 text-purple-700 ring-2 ring-purple-600/20 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedKind === 'question'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-600'
                }`}
              >
                <HelpCircle size={20} />
              </div>
              <span className="text-xs font-bold">سؤال وتمارين</span>
            </button>
          </div>

          {/* Conditional View: Question Type Picker vs Lesson/Video Form */}
          {selectedKind === 'question' ? (
            <div className="space-y-4 pt-2">
              <div className="text-start">
                <h3 className="text-sm font-bold text-gray-900">اختر نوع السؤال</h3>
                <p className="text-xs text-gray-500">اختر نوع السؤال للبدء في كتابته وحفظه في المكتبة</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pe-1">
                {QUESTION_TYPES_LIST.map((qMeta) => (
                  <button
                    key={qMeta.type}
                    type="button"
                    onClick={() => {
                      onSelectQuestionType?.(qMeta.type);
                      handleClose();
                    }}
                    className="p-3.5 rounded-2xl border border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50/40 text-start flex items-start gap-3 transition-all cursor-pointer group shadow-2xs hover:shadow-sm"
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${qMeta.badgeBg} ${qMeta.badgeText}`}>
                      <HelpCircle size={18} />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors">
                        {qMeta.label}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {qMeta.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Lesson & Video Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-900 text-start">
                  العنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    selectedKind === 'lesson'
                      ? 'مثال: ملخص قواعد الاشتقاق في التفاضل'
                      : 'مثال: شرح تجربة البندول البسيط وتطبيقاته'
                  }
                  autoFocus
                  disabled={createItemMutation.isPending}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-bold text-start transition-all text-gray-900 text-sm"
                />
              </div>

              {/* Unit Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-900 text-start">
                  الوحدة أو الفصل <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="مثال: الوحدة الأولى: الميكانيكا الكلاسيكية"
                  disabled={createItemMutation.isPending}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-medium text-start transition-all text-gray-900 text-sm"
                />
              </div>

              {/* Kind-Specific Fields */}
              {selectedKind === 'lesson' ? (
                // ===============================================================
                // LESSON FORM FIELDS
                // ===============================================================
                <div className="space-y-4 pt-1">
                  {/* Content Textarea */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-900 text-start">
                      محتوى الدرس
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="اكتب شرح الدرس أو النقاط الرئيسية هنا..."
                      rows={4}
                      disabled={createItemMutation.isPending}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 font-medium text-start transition-all text-gray-900 text-sm resize-none"
                    />
                  </div>

                  {/* Optional PDF Picker */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-900 text-start">
                      ملف PDF مرفق <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
                    </label>
                    <div className="relative">
                      <label className="border-2 border-dashed border-gray-200 hover:border-indigo-300 bg-gray-50 hover:bg-indigo-50/30 rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors text-center">
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
                </div>
              ) : (
                // ===============================================================
                // VIDEO FORM FIELDS
                // ===============================================================
                <div className="space-y-4 pt-1">
                  {/* Source Segmented Control */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-900 text-start">
                      مصدر الفيديو
                    </label>
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
                      <label className="block text-sm font-bold text-gray-900 text-start">
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
                          className="w-full ps-10 pe-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-mono text-xs text-start transition-all text-gray-900"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-gray-900 text-start">
                        {videoSource === 'upload' ? 'اختر ملف الفيديو' : 'اختر فيديو من المكتبة السحابية'}
                      </label>
                      <label className="border-2 border-dashed border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-blue-50/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
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
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100/80 text-xs font-medium text-start">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    <span>الفيديوهات محمية ضد التحميل والتسجيل.</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={createItemMutation.isPending || !title.trim()}
                  className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
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
                  onClick={handleClose}
                  disabled={createItemMutation.isPending}
                  className="px-5 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all cursor-pointer text-sm"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
