'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Play, Video, FileText, FilePieChart as FilePowerpoint, Upload, Check, CheckCircle2, Loader2, Link2, Save, CornerUpLeft, Calendar, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createLesson, createPhysicalLesson, createOnlineSession } from '@/services/courses';
import { createVideoResource, uploadVideoFile, waitForVideoReady, fetchCollections, createCollection } from '@/services/bunnyStream';
import { uploadFile } from '@/services/upload';
import { getProfileStatus, getMyUsageLimit } from '@/services/auth';
import VerificationModal from '@/components/Academic/Modals/VerificationModal';
import LiveLessonForm from './components/LiveLessonForm';
import { translateErrorToArabic } from '@/lib/utils';
interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: number;
  courseId?: number;
  unitName: string;
  courseTitle: string;
  instructorName: string;
  onLessonAdded: () => void;
  courseType?: string;
}

const MySwal = withReactContent(Swal);

const AddLessonModal = ({ isOpen, onClose, unitId, courseId, unitName, courseTitle, instructorName, onLessonAdded, courseType }: AddLessonModalProps) => {
  const [lessonType, setLessonType] = useState<'video' | 'pdf' | 'powerpoint'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  // Physical/Offline course states
  const [locationLink, setLocationLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [uploadFileToggle, setUploadFileToggle] = useState(true);

  // Live online course states
  const [sessionLink, setSessionLink] = useState('');
  const [sessionDateTime, setSessionDateTime] = useState('');

  const isPhysical = courseType === 'physical' || courseType === 'offline' || courseType === 'in-person';
  const isLive = courseType === 'online' || courseType === 'live-online';

  const detectLessonType = (file: File): 'video' | 'pdf' | 'powerpoint' => {
    const name = file.name.toLowerCase();
    if (name.endsWith('.mp4') || name.endsWith('.mkv') || name.endsWith('.mov') || name.endsWith('.avi')) {
      return 'video';
    }
    if (name.endsWith('.pdf')) {
      return 'pdf';
    }
    if (name.endsWith('.ppt') || name.endsWith('.pptx')) {
      return 'powerpoint';
    }
    return 'pdf';
  };

  const activeLessonType = isPhysical
    ? (selectedFile ? detectLessonType(selectedFile) : 'pdf')
    : lessonType;

  // usestate for upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'creating' | 'uploading' | 'processing' | 'ready' | 'error'>('idle');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '';
  const bunnyApiKey = process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY || '';
  const pullZoneId = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_ID || '';

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
    setLocationLink('');
    setStartDate('');
    setEndDate('');
    setUploadFileToggle(true);
    setSessionLink('');
    setSessionDateTime('');
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

    if (isLive) {
      if (!sessionLink.trim()) {
        toast.error('ادخل رابط السيشن');
        return;
      }

      const isValidUrl = (url: string) => {
        try {
          new URL(url);
          return true;
        } catch (_) {
          return false;
        }
      };

      if (!isValidUrl(sessionLink)) {
        toast.error('الرجاء إدخال رابط سيشن صالح (مثال: https://zoom.us/...)');
        return;
      }

      if (!sessionDateTime.trim()) {
        toast.error('اختر تاريخ ووقت السيشن');
        return;
      }

      const selectedDate = new Date(sessionDateTime);
      if (isNaN(selectedDate.getTime())) {
        toast.error('الرجاء اختيار تاريخ ووقت صالح');
        return;
      }

      if (selectedDate < new Date()) {
        toast.error('تاريخ ووقت السيشن يجب أن يكون في المستقبل');
        return;
      }
    }

    if (isPhysical) {
      if (!locationLink.trim()) {
        toast.error('الرجاء إدخال موقع/عنوان المحاضرة الحضورية');
        return;
      }
      if (!startDate) {
        toast.error('الرجاء تحديد تاريخ البداية للمحاضرة الحضورية');
        return;
      }
      if (!endDate) {
        toast.error('الرجاء تحديد تاريخ النهاية للمحاضرة الحضورية');
        return;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        toast.error('الرجاء اختيار تواريخ صالحة');
        return;
      }
      if (start > end) {
        toast.error('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
        return;
      }
    }

    const needsFile = (!isPhysical || uploadFileToggle) && !isLive;
    if (needsFile && !selectedFile) {
      toast.error('اختر ملف الدرس أولاً');
      return;
    }

    // --- Storage Limit Verification ---
    if (selectedFile) {
      try {
        const usageResponse = await getMyUsageLimit();
        const storageLimitObj = usageResponse?.data?.find((item: any) => item.feature_slug === 'storage_limit');

        if (storageLimitObj) {
          const totalGB = parseFloat(storageLimitObj.total_limit || '0');
          const usedGB = parseFloat(storageLimitObj.used_amount || '0');

          // Calculate remaining storage in MB (total/used are in GB and files are uploaded/recorded in MB)
          const remainingMB = (totalGB - usedGB) * 1024;
          const fileSizeMB = parseFloat((selectedFile.size / (1024 * 1024)).toFixed(2));

          if (remainingMB <= 0 || fileSizeMB > remainingMB) {
            const availableMB = Math.max(0, Math.round(remainingMB));
            await MySwal.fire({
              title: 'تجاوزت المساحة المخصصة',
              text: `عفواً، لقد تجاوزت المساحة المخصصة لك. المساحة المتاحة: ${availableMB} MB. برجاء ترقية حسابك لرفع المزيد من الملفات.`,
              icon: 'warning',
              confirmButtonText: 'حسناً',
              confirmButtonColor: '#2563eb'
            });
            return;
          }
        }
      } catch (err) {
        console.error("Failed to check storage limits:", err);
      }
    }


    if (activeLessonType === 'video' && selectedFile) {
      if (!libraryId || !bunnyApiKey) {
        toast.error('بيانات الخدمة غير متوفرة');
        return;
      }

      // Check verification status
      try {
        const profile = await getProfileStatus();
        const userData = profile.data || profile;
        if (userData && !userData.email_verified_at) {
          setIsVerificationModalOpen(true);
          return;
        }
      } catch (err) {
        console.error("Failed to check user status", err);
      }
    }

    setIsSubmitting(true);
    try {
      let finalVideoId = videoId;
      let finalFileUrl = null;

      if (selectedFile && needsFile) {
        if (activeLessonType === 'video') {
          // Only process video if type is video and not already ready
          if (uploadStatus !== 'ready') {
            setUploadStatus('creating');

            let currentCollectionId = '';
            try {
              let tenantName = localStorage.getItem('academy_link_name');
              if (!tenantName && typeof window !== 'undefined') {
                let hostname = window.location.hostname;
                if (hostname.endsWith('.localhost')) {
                  hostname = hostname.replace('.localhost', '');
                }
                if (hostname && hostname !== 'localhost') {
                  tenantName = hostname;
                }
              }
              tenantName = tenantName || 'Default';

              const profile = await getProfileStatus();
              const userData = profile.data || profile;
              const academyName = userData?.academy_name || 'MyAcademy';

              localStorage.setItem('cached_academy_name', academyName);
              if (instructorName) {
                localStorage.setItem('cached_instructor_name', instructorName);
              }

              const finalInstructor = instructorName || localStorage.getItem('cached_instructor_name') || 'Instructor';

              const finalCollectionName = `(${tenantName}-${finalInstructor}-${courseTitle})`;

              const collections = await fetchCollections(libraryId, bunnyApiKey);
              const existingCollection = collections.find((c: any) => c.name === finalCollectionName);

              if (existingCollection) {
                currentCollectionId = existingCollection.guid;
              } else {
                currentCollectionId = await createCollection(libraryId, bunnyApiKey, finalCollectionName);
              }
            } catch (colErr) {
              console.error('Failed to handle collection, proceeding without one:', colErr);
            }

            const finalVideoTitle = `(${courseTitle}-${unitName}-${title})`;
            const guid = await createVideoResource(libraryId, bunnyApiKey, finalVideoTitle, currentCollectionId || undefined);
            setVideoId(guid);
            finalVideoId = guid;

            setUploadStatus('uploading');
            await uploadVideoFile(libraryId, bunnyApiKey, guid, selectedFile!, setUploadProgress);

            setUploadStatus('processing');
            try {
              await waitForVideoReady(libraryId, bunnyApiKey, guid, setProcessingStatus);
            } catch (pollingError: any) {
              console.warn('Video processing is slow but continuing on provider servers:', pollingError);
            }

            setUploadStatus('ready');
          }
        } else {
          setUploadStatus('uploading');
          finalFileUrl = await uploadFile(selectedFile!, setUploadProgress);
          setUploadStatus('ready');
        }
      }

      // Build description for physical course:
      const finalDescription = isLive
        ? `تفاصيل المحاضرة المباشرة:
🔗 رابط السيشن: ${sessionLink || 'غير محدد'}
📅 التاريخ والوقت: ${sessionDateTime || 'غير محدد'}

<!--LIVE_METADATA:${JSON.stringify({ sessionLink, dateTime: sessionDateTime })}-->`
        : isPhysical
          ? `تفاصيل المحاضرة الحضورية:
📍 الموقع: ${locationLink || 'غير محدد'}
📅 تاريخ البداية: ${startDate || 'غير محدد'}
📅 تاريخ النهاية: ${endDate || 'غير محدد'}

<!--OFFLINE_METADATA:${JSON.stringify({ locationLink, startDate, endDate })}-->`
          : description;

      // Create Lesson in Backend — route to correct endpoint based on course type
      if (isPhysical) {
        await createPhysicalLesson({
          course_id: courseId || undefined,
          chapter_id: unitId,
          address: locationLink,
          start_date: startDate,
          end_date: endDate,
          map_url: locationLink.startsWith('http') ? locationLink : undefined,
          attachment: (selectedFile && uploadFileToggle) ? selectedFile : null,
          title,
          description: description || undefined,
        });
      } else if (isLive) {
        // Split sessionDateTime (e.g. "2026-06-29T14:30") into date + time
        let sessionDate = '';
        let sessionTime = '';
        if (sessionDateTime) {
          const [datePart, timePart] = sessionDateTime.split('T');
          sessionDate = datePart || '';
          sessionTime = timePart ? timePart.substring(0, 5) : ''; // HH:MM
        }

        const sessionNotes = [
          title ? `عنوان اللقاء: ${title}` : '',
          sessionDateTime ? `📅 التاريخ والوقت: ${sessionDateTime}` : '',
        ].filter(Boolean).join('\n') || undefined;

        await createOnlineSession({
          course_id: courseId || undefined,
          chapter_id: unitId,
          title,
          session_url: sessionLink,
          date: sessionDate,
          time: sessionTime,
          description: description || undefined,
          notes: sessionNotes,
        });
      } else {
        await createLesson({
          chapter_id: unitId,
          title,
          description: finalDescription,
          type: activeLessonType,
          video_id: finalVideoId || undefined,
          file_url: finalFileUrl || undefined,
          library_id: activeLessonType === 'video' ? (libraryId || undefined) : undefined,
          video_url: finalVideoId ? `https://iframe.mediadelivery.net/embed/${libraryId}/${finalVideoId}` : undefined,
          thumbnail_url: finalVideoId ? `https://vz-${pullZoneId}.b-cdn.net/${finalVideoId}/thumbnail.jpg` : undefined,
          embed_url: finalVideoId ? `https://vz-${pullZoneId}.b-cdn.net/${finalVideoId}/playlist.m3u8` : undefined,
          order: 1,
          file_size_mb: selectedFile ? parseFloat((selectedFile.size / (1024 * 1024)).toFixed(2)) : 0,
          is_free: false,
        });
      }

      toast.success('تم حفظ الدرس بنجاح');
      onLessonAdded();
      handleClose();
    } catch (error: any) {
      console.error(error);
      setUploadStatus('error');

      let errorMsg = 'فشل حفظ الدرس';
      if (error?.errors) {
        const msgs = Object.values(error.errors).flat();
        if (msgs.length > 0) {
          errorMsg = translateErrorToArabic(String(msgs[0]));
        }
      } else if (error?.message) {
        errorMsg = translateErrorToArabic(error.message);
      }
      toast.error(errorMsg);
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
            {isLive ? (
              <LiveLessonForm
                title={title}
                onTitleChange={setTitle}
                sessionLink={sessionLink}
                onSessionLinkChange={setSessionLink}
                sessionDateTime={sessionDateTime}
                onSessionDateTimeChange={setSessionDateTime}
              />
            ) : isPhysical ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Right Column: Title and Dates */}
                  <div className="space-y-6">
                    {/* Detailed Title */}
                    <div className="space-y-2 group">
                      <label className="block text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600 text-right">العنوان بالتفصيل</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                          placeholder="ادخل العنوان بالتفصيل"
                          className="w-full p-4 pl-12 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-right transition-all text-gray-900 shadow-sm"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                          <Type size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Dates Sub-grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Start Date */}
                      <div className="space-y-2 group">
                        <label className="block text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600 text-right">تاريخ البداية</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(event) => setStartDate(event.target.value)}
                          className="w-full p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-right transition-all text-gray-900 shadow-sm"
                        />
                      </div>

                      {/* End Date */}
                      <div className="space-y-2 group">
                        <label className="block text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600 text-right">تاريخ النهاية</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(event) => setEndDate(event.target.value)}
                          className="w-full p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-right transition-all text-gray-900 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Left Column: Location Link */}
                  <div className="space-y-6">
                    {/* Location Link (Optional) */}
                    <div className="space-y-2 group">
                      <label className="block text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600 text-right">رابط الموقع (اختياري)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={locationLink}
                          onChange={(event) => setLocationLink(event.target.value)}
                          placeholder="ادخل رابط الموقع"
                          className="w-full p-4 pl-12 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-right transition-all text-gray-900 shadow-sm"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                          <Link2 size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload File Toggle Row */}
                <div className="space-y-4">
                  <label className="block text-sm font-extrabold text-zinc-700 px-1 text-right">محتوي الدورة</label>
                  <div className="flex items-center justify-between p-4 bg-zinc-50/40 border border-zinc-200/60 rounded-2xl shadow-sm">
                    <span className="font-bold text-zinc-700">رفع ملف</span>
                    <button
                      type="button"
                      onClick={() => setUploadFileToggle(!uploadFileToggle)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center ${uploadFileToggle ? 'bg-blue-600 justify-start' : 'bg-zinc-200 justify-end'
                        }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md animate-in fade-in duration-200" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2 group">
                  <label className="block text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600 text-right">عنوان الدرس</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="ادخل عنوان للدرس"
                      className="w-full p-4 pl-12 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-right transition-all text-gray-900 shadow-sm"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                      <Type size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="block text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600 text-right">اضف وصف مختصر للدرس</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="ادخل وصف للدرس"
                    className="w-full p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold min-h-[120px] text-right transition-all text-gray-900 shadow-sm resize-none"
                  ></textarea>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-black text-gray-900 text-right">نوع الدرس</label>
                  <div className="relative flex bg-gray-100 p-1.5 rounded-[20px] shadow-inner">
                    <div
                      className="absolute top-1.5 bottom-1.5 bg-white rounded-[16px] shadow-sm transition-all duration-300 ease-in-out z-0"
                      style={{
                        width: 'calc(33.333% - 4px)',
                        right: lessonType === 'powerpoint' ? '4px' : lessonType === 'pdf' ? 'calc(33.333% + 2px)' : 'calc(66.666% - 2px)',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setLessonType('powerpoint')}
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[16px] font-bold text-sm transition-colors duration-300 ${lessonType === 'powerpoint' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <FilePowerpoint size={18} />
                      <span>ملف Powerpoint</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessonType('pdf')}
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[16px] font-bold text-sm transition-colors duration-300 ${lessonType === 'pdf' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <FileText size={18} />
                      <span>ملف PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessonType('video')}
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[16px] font-bold text-sm transition-colors duration-300 ${lessonType === 'video' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Video size={18} />
                      <span>فيديو</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Drag & Drop File Upload Panel */}
            {(!isPhysical || uploadFileToggle) && !isLive && (
              <div className="space-y-4">
                <label className="block text-sm font-black text-gray-900 text-right">
                  {isPhysical
                    ? 'ملف الدرس'
                    : (lessonType === 'video' ? 'محتوي الدرس' : lessonType === 'pdf' ? 'ملف PDF' : 'ملف Powerpoint')}
                </label>
                {!selectedFile ? (
                  <div
                    className="border-2 border-dashed border-gray-100 rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 transition-all bg-zinc-50 hover:bg-white"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={isPhysical ? 'video/*,.pdf,.ppt,.pptx' : (lessonType === 'video' ? 'video/*' : lessonType === 'pdf' ? '.pdf' : '.ppt,.pptx')}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="text-[#3B82F6]" size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-gray-900 text-lg">
                        اضغط للتحميل او اسحب الملف الي هنا
                      </p>
                      <p className="text-sm font-bold text-gray-500 mt-2">
                        الحجم الاقصي للملف : MP4,PDF,PPTX. 500MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-blue-100 p-6 rounded-[24px] shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
                          {isPhysical
                            ? (detectLessonType(selectedFile) === 'video' ? <Video size={28} /> : detectLessonType(selectedFile) === 'pdf' ? <FileText size={28} /> : <FilePowerpoint size={28} />)
                            : (lessonType === 'video' ? <Video size={28} /> : lessonType === 'pdf' ? <FileText size={28} /> : <FilePowerpoint size={28} />)
                          }
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
                            {uploadStatus === 'uploading' && (activeLessonType === 'video' ? 'جاري رفع الفيديو للشبكة السحابية' : 'جاري رفع الملف')}
                            {uploadStatus === 'processing' && 'جاري معالجة وتشفير الفيديو...'}
                            {uploadStatus === 'ready' && (activeLessonType === 'video' ? 'الفيديو جاهز للمشاهدة' : 'الملف جاهز')}
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
                    تشفير البيانات: {processingStatus}%
                  </div>
                )}

                {uploadStatus === 'ready' && embedUrl && activeLessonType === 'video' && (
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
            )}
          </div>

          <div className="flex justify-center gap-4 max-w-2xl mx-auto pt-4">
            {isLive ? (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex items-center justify-center gap-2 px-12 py-3.5 bg-gray-200/80 hover:bg-gray-200 text-gray-700 font-black rounded-2xl transition-all text-sm"
                >
                  <CornerUpLeft size={18} />
                  <span>عودة</span>
                </button>
                <button
                  type="button"
                  onClick={handleUploadLesson}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-12 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  <Save size={18} />
                  <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ'}</span>
                </button>
              </>
            ) : isPhysical ? (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex items-center justify-center gap-2 px-12 py-3.5 bg-gray-200/80 hover:bg-gray-200 text-gray-700 font-black rounded-2xl transition-all text-sm"
                >
                  <CornerUpLeft size={18} />
                  <span>عودة</span>
                </button>
                <button
                  type="button"
                  onClick={handleUploadLesson}
                  disabled={isSubmitting || (uploadFileToggle && !selectedFile)}
                  className="flex items-center justify-center gap-2 px-12 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  <Save size={18} />
                  <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ'}</span>
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={handleClose} className="px-16 py-4 bg-gray-100 text-gray-900 font-black rounded-full hover:bg-gray-200 transition-all">الغاء</button>
                <button
                  type="button"
                  onClick={handleUploadLesson}
                  disabled={isSubmitting || !selectedFile}
                  className="px-12 sm:px-16 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
                >
                  <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ الدرس'}</span>
                  <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center p-0.5">
                    {isSubmitting ? (
                      <Loader2 className="animate-spin text-white" size={14} />
                    ) : (
                      <CheckCircle2 size={16} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                </button>
              </>
            )}
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

      {/* Verification Modal integration */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSuccess={() => {
          // After verification, the user can try uploading again
          toast.success('حسابك مفعل الآن، يمكنك البدء في رفع الفيديو');
        }}
      />
    </div>
  );
};

export default AddLessonModal;
