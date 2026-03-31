'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Play, Video, FileText, FilePieChart as FilePowerpoint, Upload, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createLesson } from '@/services/courses';
import { createVideoResource, uploadVideoFile, waitForVideoReady } from '@/services/bunnyStream';
import { uploadFile } from '@/services/upload';
import { getProfileStatus, getMyUsageLimit } from '@/services/auth';
interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: number;
  onLessonAdded: () => void;
}

const AddLessonModal = ({ isOpen, onClose, unitId, onLessonAdded }: AddLessonModalProps) => {
  const [lessonType, setLessonType] = useState<'video' | 'pdf' | 'powerpoint'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  // usestate for upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'creating' | 'uploading' | 'processing' | 'ready' | 'error'>('idle');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '';
  const bunnyApiKey = process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY || '';

  if (!isOpen) return null;

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setVideoId(null);
    setProcessingStatus(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
      setUploadStatus('idle');
      setVideoId(null);
      setProcessingStatus(null);
    }
  };

  const handleUploadLesson = async () => {
    if (!title.trim()) {
      toast.error('ادخل عنوان الدرس');
      return;
    }

    if (!selectedFile) {
      toast.error('اختر ملف الدرس أولاً');
      return;
    }

    if (lessonType === 'video') {
      // Check for free_trial status and storage via API
      try {
        const profile = await getProfileStatus();
        const userData = profile.data || profile;

        // Check verification status
        if (userData && !userData.email_verified_at) {
          toast.custom((t) => (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-lg flex items-start gap-4" dir="rtl">
              <div className="bg-red-100 p-2 rounded-full shrink-0">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <h3 className="font-black text-red-800 text-lg mb-1">تأكيد الحساب مطلوب</h3>
                <p className="text-red-600 font-bold text-sm mb-4">
                  عفواً، لا يمكنك رفع الفيديوهات قبل تفعيل حسابك، يرجى إدخال رمز التحقق المستلم.
                </p>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    handleClose();
                    router.push('/auth/verification');
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-black rounded-xl shadow-sm transition-colors"
                >
                  الانتقال لصفحة التفعيل (OTP)
                </button>
              </div>
              <button onClick={() => toast.dismiss(t.id)} className="mr-auto text-red-400 hover:text-red-600 shrink-0">
                <X size={20} />
              </button>
            </div>
          ), { duration: 8000 });
          return;
        }

        // Check storage usage via getMyUsageLimit
        const usageResponse = await getMyUsageLimit();
        const storageLimitObj = usageResponse?.data?.find((item: any) => item.feature_slug === 'storage_limit');

        let remainingStorage = 2048 * 1024 * 1024; // Default 2GB
        if (storageLimitObj) {
          const totalGB = parseFloat(storageLimitObj.total_limit || '0');
          const usedGB = parseFloat(storageLimitObj.used_amount || '0');
          remainingStorage = (totalGB - usedGB) * 1024 * 1024 * 1024;
        }

        if (selectedFile.size > remainingStorage) {
          toast.error(`عفواً، مساحة التخزين المتبقية غير كافية لرفع هذا الملف. المساحة المتاحة: ${Math.round(remainingStorage / 1024 / 1024)} MB`, {
            duration: 5000,
            icon: '⚠️'
          });
          return;
        }

      } catch (err) {
        console.error("Failed to check user status", err);
      }

      if (!libraryId || !bunnyApiKey) {
        toast.error('بيانات Bunny غير متوفرة');
        return;
      }
      // Even for non-video, check storage
      try {
        const usageResponse = await getMyUsageLimit();
        const storageLimitObj = usageResponse?.data?.find((item: any) => item.feature_slug === 'storage_limit');

        let remainingStorage = 2048 * 1024 * 1024; // Default 2GB
        if (storageLimitObj) {
          const totalGB = parseFloat(storageLimitObj.total_limit || '0');
          const usedGB = parseFloat(storageLimitObj.used_amount || '0');
          remainingStorage = (totalGB - usedGB) * 1024 * 1024 * 1024;
        }

        if (selectedFile.size > remainingStorage) {
          toast.error(`عفواً، مساحة التخزين المتبقية غير كافية. المساحة المتاحة: ${Math.round(remainingStorage / 1024 / 1024)} MB`, {
            duration: 5000,
            icon: '⚠️'
          });
          return;
        }
      } catch (err) {
        console.error("Failed to check storage", err);
      }
    }

    setIsSubmitting(true);
    try {
      let finalVideoId = videoId;
      let finalFileUrl = null;

      if (lessonType === 'video') {
        // Only process video if type is video and not already ready
        if (uploadStatus !== 'ready') {
          setUploadStatus('creating');
          const guid = await createVideoResource(libraryId, bunnyApiKey, title);
          setVideoId(guid);
          finalVideoId = guid;

          setUploadStatus('uploading');
          await uploadVideoFile(libraryId, bunnyApiKey, guid, selectedFile!, setUploadProgress);

          setUploadStatus('processing');
          try {
            await waitForVideoReady(libraryId, bunnyApiKey, guid, setProcessingStatus);
          } catch (pollingError: any) {
            console.warn('Video processing is slow but continuing on Bunny.net servers:', pollingError);
            // Don't fail the whole lesson creation if just polling timed out
            // The video is already uploaded and Bunny will finish processing it.
          }

          setUploadStatus('ready');
        }
      } else {
        // Handle PDF/Powerpoint Upload
        setUploadStatus('uploading');
        finalFileUrl = await uploadFile(selectedFile!, setUploadProgress);
        setUploadStatus('ready');
      }

      // Create Lesson in Backend
      await createLesson({
        unit_id: unitId,
        title,
        description,
        type: lessonType,
        video_id: finalVideoId || undefined,
        file_url: finalFileUrl || undefined,
        is_free: false, // Default to paid
      });

      toast.success('تم حفظ الدرس بنجاح');
      onLessonAdded();
      handleClose();
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
      toast.error('فشل حفظ الدرس');
    } finally {
      setIsSubmitting(false);
    }
  };

  const embedUrl = videoId ? `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}` : '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-10 space-y-10">
          <h2 className="text-2xl font-black text-center text-gray-900">اضافة درس جديد</h2>

          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900 text-right">عنوان الدرس</label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="ادخل عنوان للدرس"
                className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900 text-right">اضف وصف مختصر للدرس</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="ادخل وصف للدرس"
                className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold min-h-[120px] text-right transition-all"
              ></textarea>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-black text-gray-900 text-right">نوع الدرس</label>
              <div className="relative flex bg-gray-100 p-1.5 rounded-[20px] shadow-inner">
                {/* Sliding Indicator */}
                <div
                  className="absolute top-1.5 bottom-1.5 bg-white rounded-[16px] shadow-sm transition-all duration-300 ease-in-out z-0"
                  style={{
                    width: 'calc(33.333% - 4px)',
                    // Since it's RTL (right-to-left), we calculate 'right' position or use 'left' inversely
                    // For RTL container: 
                    // Video is first (rightmost), PDF middle, Powerpoint last (leftmost)
                    // But in code order: Powerpoint, PDF, Video
                    // Let's rely on standard left positioning but flipped logic if needed or just order buttons correctly
                    // Assuming LTR logic for positioning in code, but visual RTL
                    // Let's fix the logic for RTL context or LTR flex
                    // Flex direction is row (default LTR) unless dir="rtl" is inherited.
                    // The modal has dir="rtl".
                    // So in RTL: First child (Powerpoint) is on the Right.
                    // Second (PDF) is Middle.
                    // Third (Video) is Left.
                    // Wait, in RTL flex: start is right.
                    // So Powerpoint (1st child) -> Right
                    // PDF (2nd child) -> Middle
                    // Video (3rd child) -> Left

                    // So we need to control 'right' property instead of 'left' for RTL, or 'left' if we want to be explicit.
                    // Let's use 'right' for RTL context to be safe.
                    right: lessonType === 'powerpoint' ? '4px' : lessonType === 'pdf' ? 'calc(33.333% + 2px)' : 'calc(66.666% - 2px)',
                  }}
                />

                <button
                  onClick={() => setLessonType('powerpoint')}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[16px] font-bold text-sm transition-colors duration-300 ${lessonType === 'powerpoint' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FilePowerpoint size={18} />
                  <span>ملف Powerpoint</span>
                </button>
                <button
                  onClick={() => setLessonType('pdf')}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[16px] font-bold text-sm transition-colors duration-300 ${lessonType === 'pdf' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FileText size={18} />
                  <span>ملف PDF</span>
                </button>
                <button
                  onClick={() => setLessonType('video')}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[16px] font-bold text-sm transition-colors duration-300 ${lessonType === 'video' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Video size={18} />
                  <span>فيديو</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-900 text-right">
                {lessonType === 'video' ? 'محتوي الدرس' : lessonType === 'pdf' ? 'ملف PDF' : 'ملف Powerpoint'}
              </label>
              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-gray-100 rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 transition-all bg-zinc-50 hover:bg-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={lessonType === 'video' ? 'video/*' : lessonType === 'pdf' ? '.pdf' : '.ppt,.pptx'}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="text-blue-600" size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-gray-900 text-lg">
                      اضغط لاختيار أو اسحب الملف إلى هنا
                    </p>
                    <p className="text-sm font-bold text-gray-500 mt-2">
                      {lessonType === 'video' ? 'الحجم الأقصى للملف: 500MB (يفضل MP4)' : 'الحجم الأقصى للملف: 50MB'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-blue-100 p-6 rounded-[24px] shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
                        {lessonType === 'video' ? <Video size={28} /> : lessonType === 'pdf' ? <FileText size={28} /> : <FilePowerpoint size={28} />}
                      </div>
                      <div className="text-right">
                        <p className="text-base font-black text-gray-900 line-clamp-1 break-all" dir="ltr">{selectedFile.name}</p>
                        <p className="text-sm font-bold text-gray-500 mt-0.5">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {uploadStatus === 'idle' ? (
                      <button onClick={() => { setSelectedFile(null); }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <X size={20} />
                      </button>
                    ) : uploadStatus === 'ready' ? (
                      <Check size={28} className="text-green-500" />
                    ) : (
                      <Loader2 size={24} className="text-blue-600 animate-spin" />
                    )}
                  </div>

                  {uploadStatus !== 'idle' && (
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                        <div className="text-right flex items-center gap-2">
                          {uploadStatus === 'creating' && 'جاري تحضير الخوادم...'}
                          {uploadStatus === 'uploading' && (lessonType === 'video' ? 'جاري رفع الفيديو للشبكة السحابية' : 'جاري رفع الملف')}
                          {uploadStatus === 'processing' && 'جاري معالجة وتشفير الفيديو...'}
                          {uploadStatus === 'ready' && (lessonType === 'video' ? 'الفيديو جاهز للمشاهدة' : 'الملف جاهز')}
                          {uploadStatus === 'error' && <span className="text-red-500">حدث خطأ أثناء الرفع</span>}
                        </div>
                        {uploadStatus === 'uploading' && (
                          <div className="text-blue-600 font-black text-sm" dir="ltr">
                            {uploadProgress.toFixed(0)}%
                          </div>
                        )}
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ease-out ${uploadStatus === 'error' ? 'bg-red-500' : 'bg-blue-600'}`}
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {uploadStatus === 'processing' && processingStatus !== null && (
                <div className="text-right text-sm font-bold text-blue-600 bg-blue-50 p-3 rounded-xl">
                  تشفير السحابة: {processingStatus}%
                </div>
              )}

              {uploadStatus === 'ready' && embedUrl && (
                <div className="rounded-[24px] overflow-hidden border border-gray-100">
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="360"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 max-w-2xl mx-auto pt-4">
            <button onClick={handleClose} className="px-16 py-4 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all">الغاء</button>
            <button
              onClick={handleUploadLesson}
              disabled={isSubmitting || !selectedFile}
              className="px-8 sm:px-16 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  جاري رفع وحفظ الدرس...
                </>
              ) : 'حفظ الدرس'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-8 left-8 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default AddLessonModal;
