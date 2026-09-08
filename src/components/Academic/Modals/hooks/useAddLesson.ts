'use client';

import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createLesson, createPhysicalLesson, createOnlineSession } from '@/services/courses';
import {
  createVideoResource,
  uploadVideoFile,
  waitForVideoReady,
  fetchCollections,
  createCollection,
} from '@/services/bunnyStream';
import { uploadFile } from '@/services/upload';
import { getProfileStatus, getMyUsageLimit } from '@/services/auth';

const MySwal = withReactContent(Swal);

export type LessonFileType = 'video' | 'pdf' | 'powerpoint';
export type UploadStatus = 'idle' | 'creating' | 'uploading' | 'processing' | 'ready' | 'error';

interface UseAddLessonOptions {
  unitId: number;
  courseId?: number;
  unitName: string;
  courseTitle: string;
  instructorName: string;
  courseType?: string;
  onLessonAdded: () => void;
  onClose: () => void;
}

export function useAddLesson({
  unitId,
  courseId,
  unitName,
  courseTitle,
  instructorName,
  courseType,
  onLessonAdded,
  onClose,
}: UseAddLessonOptions) {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '';
  const bunnyApiKey = process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY || '';
  const pullZoneId = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_ID || '';

  const isPhysical =
    courseType === 'physical' || courseType === 'offline' || courseType === 'in-person';

  // Common fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [lessonType, setLessonType] = useState<LessonFileType>('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Physical-only fields
  const [locationLink, setLocationLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [uploadFileToggle, setUploadFileToggle] = useState(true);

  // Live online course fields
  const [sessionLink, setSessionLink] = useState('');
  const [sessionDateTime, setSessionDateTime] = useState('');
  const isLive = courseType === 'online' || courseType === 'live-online';

  // Upload tracking
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const detectFileType = (file: File): LessonFileType => {
    const name = file.name.toLowerCase();
    if (name.match(/\.(mp4|mkv|mov|avi)$/)) return 'video';
    if (name.endsWith('.pdf')) return 'pdf';
    if (name.match(/\.pptx?$/)) return 'powerpoint';
    return 'pdf';
  };

  const activeLessonType: LessonFileType = isPhysical
    ? selectedFile
      ? detectFileType(selectedFile)
      : 'pdf'
    : lessonType;

  const embedUrl = videoId
    ? `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`
    : '';

  const reset = () => {
    setTitle('');
    setDescription('');
    setIsFree(false);
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
  };

  const handleClose = () => {
    reset();
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

  const handleSubmit = async () => {
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
      if (startDate && endDate) {
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
    }

    const needsFile = (!isPhysical || uploadFileToggle) && !isLive;
    if (needsFile && !selectedFile) {
      toast.error('اختر ملف الدرس أولاً');
      return;
    }

    // Storage limit check
    if (selectedFile) {
      try {
        const usageResponse = await getMyUsageLimit();
        const storageLimitObj = usageResponse?.data?.find(
          (item: any) => item.feature_slug === 'storage_limit',
        );
        if (storageLimitObj) {
          const totalGB = parseFloat(storageLimitObj.total_limit || '0');
          const usedMB = parseFloat(storageLimitObj.used_amount || '0');
          
          // Calculate remaining storage in MB (total is in GB, used is in MB)
          const remainingMB = (totalGB * 1024) - usedMB;
          const fileSizeMB = parseFloat((selectedFile.size / (1024 * 1024)).toFixed(2));
          
          if (remainingMB <= 0 || fileSizeMB > remainingMB) {
            const availableMB = Math.max(0, Math.round(remainingMB));
            await MySwal.fire({
              title: 'تجاوزت المساحة المخصصة',
              text: `المساحة المتاحة: ${availableMB} MB. برجاء ترقية حسابك.`,
              icon: 'warning',
              confirmButtonText: 'حسناً',
              confirmButtonColor: '#2563eb',
            });
            return;
          }
        }
      } catch (err) {
        console.error('Failed to check storage limits:', err);
      }
    }

    // Email verification check (video only)
    if (activeLessonType === 'video' && selectedFile) {
      if (!libraryId || !bunnyApiKey) {
        toast.error('بيانات الخدمة غير متوفرة');
        return;
      }
      try {
        const profile = await getProfileStatus();
        const userData = profile.data || profile;
        if (userData && !userData.email_verified_at) {
          setIsVerificationModalOpen(true);
          return;
        }
      } catch (err) {
        console.error('Failed to check user status', err);
      }
    }

    // Capture current values for background submission
    const targetFile = selectedFile;
    const targetTitle = title;
    const targetDescription = description;
    const targetIsFree = isFree ? 1 : 0;
    const targetLessonType = activeLessonType;
    const targetSessionLink = sessionLink;
    const targetSessionDateTime = sessionDateTime;
    const targetLocationLink = locationLink;
    const targetStartDate = startDate;
    const targetEndDate = endDate;
    const targetUploadFileToggle = uploadFileToggle;

    const finalDescription = isLive
      ? `تفاصيل المحاضرة المباشرة:
🔗 رابط السيشن: ${targetSessionLink || 'غير محدد'}
📅 التاريخ والوقت: ${targetSessionDateTime || 'غير محدد'}

<!--LIVE_METADATA:${JSON.stringify({ sessionLink: targetSessionLink, dateTime: targetSessionDateTime })}-->`
      : isPhysical
      ? `تفاصيل المحاضرة الحضورية:\n📍 الموقع: ${targetLocationLink || 'غير محدد'}\n📅 تاريخ البداية: ${targetStartDate || 'غير محدد'}\n📅 تاريخ النهاية: ${targetEndDate || 'غير محدد'}\n\n<!--OFFLINE_METADATA:${JSON.stringify({ locationLink: targetLocationLink, startDate: targetStartDate, endDate: targetEndDate })}-->`
      : targetDescription;

    if (targetFile && needsFile) {
      // Close modal immediately and run upload in background
      handleClose();
      const toastId = toast.loading(`جاري بدء رفع درس "${targetTitle}" في الخلفية...`);

      (async () => {
        try {
          let finalVideoId: string | null = null;
          let finalFileUrl: string | null = null;

          if (targetLessonType === 'video') {
            let collectionId = '';
            try {
              let tenantName = localStorage.getItem('academy_link_name');
              if (!tenantName && typeof window !== 'undefined') {
                let hostname = window.location.hostname;
                if (hostname.endsWith('.localhost')) hostname = hostname.replace('.localhost', '');
                if (hostname && hostname !== 'localhost') tenantName = hostname;
              }
              tenantName = tenantName || 'Default';

              const profile = await getProfileStatus();
              const userData = profile.data || profile;
              const academyName = userData?.academy_name || 'MyAcademy';
              localStorage.setItem('cached_academy_name', academyName);
              if (instructorName) localStorage.setItem('cached_instructor_name', instructorName);

              const finalInstructor =
                instructorName || localStorage.getItem('cached_instructor_name') || 'Instructor';
              const collectionName = `(${tenantName}-${finalInstructor}-${courseTitle})`;

              const collections = await fetchCollections(libraryId, bunnyApiKey);
              const existing = collections.find((c: any) => c.name === collectionName);
              collectionId = existing
                ? existing.guid
                : await createCollection(libraryId, bunnyApiKey, collectionName);
            } catch (err) {
              console.error('Collection handling failed, continuing without one:', err);
            }

            const videoTitle = `(${courseTitle}-${unitName}-${targetTitle})`;
            const guid = await createVideoResource(
              libraryId,
              bunnyApiKey,
              videoTitle,
              collectionId || undefined,
            );
            finalVideoId = guid;

            await uploadVideoFile(libraryId, bunnyApiKey, guid, targetFile, (percent) => {
              toast.loading(`جاري رفع فيديو "${targetTitle}" (${percent}%)...`, { id: toastId });
            });

            toast.loading(`جاري معالجة فيديو "${targetTitle}"...`, { id: toastId });
            try {
              await waitForVideoReady(libraryId, bunnyApiKey, guid);
            } catch (pollingError) {
              console.warn('Video processing slow, continuing on provider servers:', pollingError);
            }
          } else {
            toast.loading(`جاري رفع ملف "${targetTitle}"...`, { id: toastId });
            finalFileUrl = await uploadFile(targetFile, (percent) => {
              toast.loading(`جاري رفع ملف "${targetTitle}" (${percent}%)...`, { id: toastId });
            });
          }

          await createLesson({
            chapter_id: unitId,
            title: targetTitle,
            description: finalDescription,
            type: isLive ? 'video' : targetLessonType,
            video_id: finalVideoId || undefined,
            file_url: finalFileUrl || undefined,
            library_id: (targetLessonType === 'video' && !isLive) ? libraryId || undefined : undefined,
            video_url: isLive ? targetSessionLink : (finalVideoId
              ? `https://iframe.mediadelivery.net/embed/${libraryId}/${finalVideoId}`
              : undefined),
            thumbnail_url: (finalVideoId && !isLive)
              ? `https://vz-${pullZoneId}.b-cdn.net/${finalVideoId}/thumbnail.jpg`
              : undefined,
            embed_url: isLive ? targetSessionLink : (targetLocationLink ||
              (finalVideoId
                ? `https://vz-${pullZoneId}.b-cdn.net/${finalVideoId}/playlist.m3u8`
                : undefined)),
            order: 1,
            file_size_mb: parseFloat((targetFile.size / (1024 * 1024)).toFixed(2)),
            is_free: targetIsFree,
          });

          toast.success(`تم رفع وحفظ درس "${targetTitle}" بنجاح! 🎉`, { id: toastId });
          onLessonAdded();
        } catch (bgError: any) {
          console.error('Background upload failed:', bgError);
          toast.error(`فشل رفع درس "${targetTitle}" في الخلفية`, { id: toastId });
        }
      })();

      return;
    }

    // Direct submit for non-file lessons
    setIsSubmitting(true);
    try {
      if (isPhysical) {
        await createPhysicalLesson({
          course_id: courseId || undefined,
          chapter_id: unitId,
          address: targetLocationLink,
          start_date: targetStartDate,
          end_date: targetEndDate,
          map_url: targetLocationLink.startsWith('http') ? targetLocationLink : undefined,
          attachment: null,
          title: targetTitle,
          description: targetDescription || undefined,
        });
      } else if (isLive) {
        let sessionDate = '';
        let sessionTime = '';
        if (targetSessionDateTime) {
          const [datePart, timePart] = targetSessionDateTime.split('T');
          sessionDate = datePart || '';
          sessionTime = timePart ? timePart.substring(0, 5) : '';
        }

        await createOnlineSession({
          course_id: courseId || undefined,
          chapter_id: unitId,
          title: targetTitle,
          session_url: targetSessionLink,
          date: sessionDate,
          time: sessionTime,
          description: targetDescription || undefined,
        });
      } else {
        await createLesson({
          chapter_id: unitId,
          title: targetTitle,
          description: finalDescription,
          type: targetLessonType,
          order: 1,
          is_free: targetIsFree,
        });
      }

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

  return {
    // state
    isPhysical,
    isLive,
    title,
    setTitle,
    description,
    setDescription,
    isFree,
    setIsFree,
    lessonType,
    setLessonType,
    selectedFile,
    setSelectedFile,
    locationLink,
    setLocationLink,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    uploadFileToggle,
    setUploadFileToggle,
    sessionLink,
    setSessionLink,
    sessionDateTime,
    setSessionDateTime,
    uploadProgress,
    uploadStatus,
    videoId,
    processingStatus,
    isSubmitting,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    activeLessonType,
    embedUrl,
    fileInputRef,
    detectFileType,
    // actions
    handleClose,
    handleFileChange,
    handleSubmit,
  };
}
