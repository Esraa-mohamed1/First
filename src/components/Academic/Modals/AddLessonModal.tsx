'use client';

import React, { useRef, useState } from 'react';
import { X, Play, Video, FileText, FilePieChart as FilePowerpoint, Upload, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { createLesson } from '@/services/courses';
import { createVideoResource, uploadVideoFile, waitForVideoReady } from '@/services/bunnyStream';
import { uploadFile } from '@/services/upload';

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
  
  // Upload States
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
      // Check for free_trial status
      const storedUser = localStorage.getItem('user_info');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.statusPayed === 'free_trial') {
             toast.error('عفواً، لا يمكنك رفع الفيديوهات في النسخة التجريبية. يرجى ترقية باقتك.');
             return;
          }
        } catch (e) {
          console.error("Failed to parse user info", e);
        }
      }

      if (!libraryId || !bunnyApiKey) {
        toast.error('بيانات Bunny غير متوفرة');
        return;
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
          await waitForVideoReady(libraryId, bunnyApiKey, guid, setProcessingStatus);
          
          setUploadStatus('ready');
        }
      } else {
        // Handle PDF/Powerpoint Upload
        setUploadStatus('uploading');
        finalFileUrl = await uploadFile(selectedFile);
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

            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900 text-right">نوع الدرس</label>
              <div className="grid grid-cols-3 gap-4 bg-gray-50/50 p-2 rounded-[24px]">
                <button 
                  onClick={() => setLessonType('powerpoint')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold transition-all ${lessonType === 'powerpoint' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FilePowerpoint size={20} />
                  <span>ملف Powerpoint</span>
                </button>
                <button 
                  onClick={() => setLessonType('pdf')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold transition-all ${lessonType === 'pdf' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FileText size={20} />
                  <span>ملف PDF</span>
                </button>
                <button 
                  onClick={() => setLessonType('video')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold transition-all ${lessonType === 'video' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Video size={20} />
                  <span>فيديو</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-black text-gray-900 text-right">
                  {lessonType === 'video' ? 'محتوي الدرس' : lessonType === 'pdf' ? 'ملف PDF' : 'ملف Powerpoint'}
                </label>
                <div
                  className="border-2 border-dashed border-gray-100 rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={lessonType === 'video' ? 'video/*' : lessonType === 'pdf' ? '.pdf' : '.ppt,.pptx'}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                    <Upload className="text-blue-600" size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-gray-900">
                      {selectedFile ? selectedFile.name : 'اضغط للتحميل او اسحب الملف الي هنا'}
                    </p>
                    <p className="text-xs font-bold text-gray-400 mt-1">
                      {lessonType === 'video' ? 'الحجم الاقصي للملف : MP4. 500MB' : 'الحجم الاقصي للملف : 50MB'}
                    </p>
                  </div>
                </div>

                {selectedFile && (
                  <div className="bg-blue-50/50 p-6 rounded-[24px] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          <FileText className="text-blue-600" size={24} />
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-gray-900">{title || selectedFile.name}</p>
                          <p className="text-xs font-bold text-gray-400">
                            {Math.round(selectedFile.size / 1024 / 1024)} MB
                          </p>
                        </div>
                      </div>
                      {uploadStatus === 'ready' && <Check size={20} className="text-blue-600" />}
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs font-bold text-gray-500">
                      {uploadStatus === 'creating' && 'جاري إنشاء الفيديو'}
                      {uploadStatus === 'uploading' && 'جاري رفع الفيديو'}
                      {uploadStatus === 'processing' && 'جاري معالجة الفيديو'}
                      {uploadStatus === 'ready' && 'الفيديو جاهز للمشاهدة'}
                      {uploadStatus === 'error' && 'حدث خطأ أثناء الرفع'}
                    </div>
                  </div>
                )}

                {uploadStatus === 'processing' && processingStatus !== null && (
                  <div className="text-right text-sm font-bold text-gray-500">
                    حالة المعالجة الحالية: {processingStatus}
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
              disabled={isSubmitting}
              className="px-16 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ الدرس'}
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
