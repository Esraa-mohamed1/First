'use client';

import React, { useRef, useState } from 'react';
import { X, Video, Upload, CheckCircle2, Loader2, Sparkles, AlertCircle, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createVideoResource, uploadVideoFile, waitForVideoReady, fetchCollections, createCollection } from '@/services/bunnyStream';
import { getProfileStatus, getMyUsageLimit } from '@/services/auth';
import { createAcademyVideo } from '@/services/academy-videos';
import { AcademyVideo } from '@/types/videos';

const MySwal = withReactContent(Swal);

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoUploaded: (video: AcademyVideo) => void;
  suggestedOrder?: number;
}

export default function UploadVideoModal({
  isOpen,
  onClose,
  onVideoUploaded,
  suggestedOrder = 1,
}: UploadVideoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Upload stages & progress
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'checking' | 'creating' | 'uploading' | 'processing' | 'saving' | 'ready' | 'error'
  >('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const libraryId =
    process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '753695';
  const bunnyApiKey =
    process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY || '3d96b103-4faa-4682-afd193223c4b-79b8-4e66';

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setStatusMessage('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (isSubmitting) {
      toast('الرفع مستمر في الخلفية، ستتلقى إشعاراً عند الانتهاء', { icon: 'ℹ️' });
    }
    resetForm();
    onClose();
  };

  const handleFileSelect = (file: File) => {
    // Validate video type
    const validExts = ['.mp4', '.mov', '.mkv', '.avi', '.webm'];
    const fileName = file.name.toLowerCase();
    const isValid = validExts.some((ext) => fileName.endsWith(ext)) || file.type.startsWith('video/');

    if (!isValid) {
      toast.error('يرجى اختيار ملف فيديو صالح (MP4, MOV, MKV, AVI, WEBM)');
      return;
    }

    setSelectedFile(file);
    if (!title.trim()) {
      // Auto-populate title without extension
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setTitle(cleanName);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان الفيديو');
      return;
    }

    if (!selectedFile) {
      toast.error('يرجى اختيار ملف الفيديو للرفع');
      return;
    }

    setIsSubmitting(true);
    setUploadStatus('checking');
    setStatusMessage('جاري التحقق من المساحة المتوفرة والحساب...');

    try {
      // 1. Storage limit check
      try {
        const usageResponse = await getMyUsageLimit();
        const usageList = usageResponse?.data || (Array.isArray(usageResponse) ? usageResponse : []);
        const storageLimitObj = usageList.find(
          (item: any) => item.feature_slug === 'storage_limit' || item.key_feature === 'storage_space'
        );

        if (storageLimitObj) {
          const totalGB = parseFloat(storageLimitObj.total_limit || '0');
          const usedMB = parseFloat(storageLimitObj.used_amount || '0');
          const remainingMB = totalGB * 1024 - usedMB;
          const fileSizeMB = parseFloat((selectedFile.size / (1024 * 1024)).toFixed(2));

          if (remainingMB <= 0 || fileSizeMB > remainingMB) {
            const availableMB = Math.max(0, Math.round(remainingMB));
            await MySwal.fire({
              title: 'تجاوزت المساحة المخصصة',
              text: `المساحة المتبقية في حسابك: ${availableMB} ميغابايت، وحجم الفيديو: ${fileSizeMB} ميغابايت. يرجى ترقية باقتك للاستمرار.`,
              icon: 'warning',
              confirmButtonText: 'حسناً',
              confirmButtonColor: '#2563eb',
              customClass: {
                popup: 'rounded-[2rem]',
                confirmButton: 'rounded-xl font-bold px-8 py-3',
              },
            });
            setIsSubmitting(false);
            setUploadStatus('idle');
            return;
          }
        }
      } catch (limitErr) {
        console.warn('Storage limit check bypassed:', limitErr);
      }

      // 2. Collection Setup in Bunny
      setUploadStatus('creating');
      setStatusMessage('جاري إنشاء مساحة الفيديو على سيرفرات Bunny...');

      let collectionId = '';
      try {
        let tenantName = localStorage.getItem('academy_link_name');
        if (!tenantName && typeof window !== 'undefined') {
          let hostname = window.location.hostname;
          if (hostname.endsWith('.localhost')) hostname = hostname.replace('.localhost', '');
          if (hostname && hostname !== 'localhost') tenantName = hostname;
        }
        tenantName = tenantName || 'Academy';

        const collectionName = `(${tenantName}-Bag-Videos)`;
        const collections = await fetchCollections(libraryId, bunnyApiKey);
        const existing = collections.find((c: any) => c.name === collectionName);
        collectionId = existing
          ? existing.guid
          : await createCollection(libraryId, bunnyApiKey, collectionName);
      } catch (colErr) {
        console.warn('Collection creation skipped, using root library:', colErr);
      }

      // 3. Create Video Resource Placeholder
      const videoResourceTitle = `(BagVideo-${title.trim()})`;
      const guid = await createVideoResource(
        libraryId,
        bunnyApiKey,
        videoResourceTitle,
        collectionId || undefined
      );

      // 4. Upload Video Binary to Bunny
      setUploadStatus('uploading');
      setStatusMessage('جاري رفع الفيديو إلى السحابة...');
      setUploadProgress(0);

      await uploadVideoFile(libraryId, bunnyApiKey, guid, selectedFile, (percent) => {
        setUploadProgress(percent);
      });

      // 5. Video Processing on Bunny
      setUploadStatus('processing');
      setStatusMessage('اكتمل الرفع! جاري معالجة الفيديو وإنشاء دقات التشغيل...');

      try {
        await waitForVideoReady(libraryId, bunnyApiKey, guid, (encodePercent) => {
          if (encodePercent) setUploadProgress(encodePercent);
        }, 15, 2000);
      } catch (pollErr) {
        console.warn('Processing continuing asynchronously on Bunny CDN:', pollErr);
      }

      // 6. Save in Backend API (/api/academy/videos)
      setUploadStatus('saving');
      setStatusMessage('جاري تسجيل الفيديو في متجر الأكاديمية...');

      const videoEmbedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${guid}`;
      const fileSizeMb = (selectedFile.size / (1024 * 1024)).toFixed(2);

      const savedVideo = await createAcademyVideo({
        title: title.trim(),
        description: description.trim(),
        video_id: guid,
        video_url: videoEmbedUrl,
        library_id: libraryId,
        order: Number(suggestedOrder) || 1,
        file_size_mb: fileSizeMb,
      });

      setUploadStatus('ready');
      toast.success('تم رفع وحفظ الفيديو بنجاح!');
      onVideoUploaded(savedVideo);
      handleClose();
    } catch (error: any) {
      console.error('Video upload workflow failed:', error);
      setUploadStatus('error');
      setIsSubmitting(false);
      const errMsg =
        error.response?.data?.message || error.message || 'حدث خطأ أثناء رفع الفيديو';
      toast.error(errMsg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-inner">
              <Video size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">رفع فيديو جديد</h3>
              <p className="text-xs font-bold text-gray-400 mt-0.5">
                سيتم رفع الفيديو وتأمينه عبر Bunny Stream وإضافته إلى متجرك
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting && uploadStatus === 'uploading'}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-gray-800">
              عنوان الفيديو <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              placeholder="مثال: مقدمة الحقيبة التدريبية - الجزء الأول"
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-600/10 transition-all disabled:opacity-60"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-gray-800">وصف الفيديو (Description)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="اكتب وصفاً موجزاً لمحتوى الفيديو والمهارات المستفادة..."
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:border-purple-600 focus:bg-white focus:ring-4 focus:ring-purple-600/10 transition-all disabled:opacity-60 resize-none"
            />
          </div>

          {/* Video File Dropzone */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-gray-800">
              ملف الفيديو <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-purple-600 bg-purple-50/50 scale-[0.99]'
                  : selectedFile
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-gray-200 hover:border-purple-300 bg-gray-50/50 hover:bg-purple-50/20'
              } ${isSubmitting ? 'pointer-events-none opacity-70' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/x-matroska,video/avi,video/webm"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <span className="font-black text-gray-900 text-sm max-w-sm truncate">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
                    الحجم: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  <span className="text-xs font-semibold text-gray-400 mt-1">
                    انقر لتغيير الملف المحدد
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-inner">
                    <Upload size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-gray-800">
                      اسحب وأفلت ملف الفيديو هنا، أو{' '}
                      <span className="text-purple-600 hover:underline">استعرض جهازك</span>
                    </p>
                    <p className="text-xs font-semibold text-gray-400">
                      الصيغ المدعومة: MP4, MOV, MKV, AVI, WEBM
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Progress / Status display during upload */}
          {isSubmitting && (
            <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs font-black text-purple-900">
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-purple-600" />
                  <span>{statusMessage}</span>
                </span>
                {uploadStatus === 'uploading' && <span>{uploadProgress}%</span>}
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{
                    width:
                      uploadStatus === 'uploading'
                        ? `${uploadProgress}%`
                        : uploadStatus === 'processing'
                        ? '90%'
                        : uploadStatus === 'saving'
                        ? '98%'
                        : '25%',
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile || !title.trim()}
              className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>جاري الرفع...</span>
                </>
              ) : (
                <>
                  <Upload size={20} />
                  <span>بدء الرفع وحفظ الفيديو</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting && uploadStatus === 'uploading'}
              className="px-6 h-14 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-black text-sm transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
