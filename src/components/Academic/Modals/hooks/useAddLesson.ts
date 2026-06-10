'use client';

import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createLesson } from '@/services/courses';
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
  unitName: string;
  courseTitle: string;
  instructorName: string;
  courseType?: string;
  onLessonAdded: () => void;
  onClose: () => void;
}

export function useAddLesson({
  unitId,
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
          const usedGB = parseFloat(storageLimitObj.used_amount || '0');
          const remainingBytes = (totalGB - usedGB) * 1024 * 1024 * 1024;
          if (remainingBytes <= 0 || selectedFile.size > remainingBytes) {
            const availableMB = Math.max(0, Math.round(remainingBytes / 1024 / 1024));
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

    setIsSubmitting(true);
    try {
      let finalVideoId = videoId;
      let finalFileUrl: string | null = null;

      if (selectedFile && needsFile) {
        if (activeLessonType === 'video') {
          if (uploadStatus !== 'ready') {
            setUploadStatus('creating');

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

            const videoTitle = `(${courseTitle}-${unitName}-${title})`;
            const guid = await createVideoResource(
              libraryId,
              bunnyApiKey,
              videoTitle,
              collectionId || undefined,
            );
            setVideoId(guid);
            finalVideoId = guid;

            setUploadStatus('uploading');
            await uploadVideoFile(libraryId, bunnyApiKey, guid, selectedFile!, setUploadProgress);

            setUploadStatus('processing');
            try {
              await waitForVideoReady(libraryId, bunnyApiKey, guid, setProcessingStatus);
            } catch (pollingError) {
              console.warn('Video processing is slow, continuing on provider servers:', pollingError);
            }
            setUploadStatus('ready');
          }
        } else {
          setUploadStatus('uploading');
          finalFileUrl = await uploadFile(selectedFile!, setUploadProgress);
          setUploadStatus('ready');
        }
      }

      const finalDescription = isLive
        ? `تفاصيل المحاضرة المباشرة:
🔗 رابط السيشن: ${sessionLink || 'غير محدد'}
📅 التاريخ والوقت: ${sessionDateTime || 'غير محدد'}

<!--LIVE_METADATA:${JSON.stringify({ sessionLink, dateTime: sessionDateTime })}-->`
        : isPhysical
        ? `تفاصيل المحاضرة الحضورية:\n📍 الموقع: ${locationLink || 'غير محدد'}\n📅 تاريخ البداية: ${startDate || 'غير محدد'}\n📅 تاريخ النهاية: ${endDate || 'غير محدد'}\n\n<!--OFFLINE_METADATA:${JSON.stringify({ locationLink, startDate, endDate })}-->`
        : description;

      await createLesson({
        chapter_id: unitId,
        title,
        description: finalDescription,
        type: isLive ? 'video' : activeLessonType,
        video_id: finalVideoId || undefined,
        file_url: finalFileUrl || undefined,
        library_id: (activeLessonType === 'video' && !isLive) ? libraryId || undefined : undefined,
        video_url: isLive ? sessionLink : (finalVideoId
          ? `https://iframe.mediadelivery.net/embed/${libraryId}/${finalVideoId}`
          : undefined),
        thumbnail_url: (finalVideoId && !isLive)
          ? `https://vz-${pullZoneId}.b-cdn.net/${finalVideoId}/thumbnail.jpg`
          : undefined,
        embed_url: isLive ? sessionLink : (locationLink ||
          (finalVideoId
            ? `https://vz-${pullZoneId}.b-cdn.net/${finalVideoId}/playlist.m3u8`
            : undefined)),
        order: 1,
        file_size_mb: selectedFile
          ? parseFloat((selectedFile.size / (1024 * 1024)).toFixed(2))
          : 0,
        is_free: false,
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

  return {
    // state
    isPhysical,
    isLive,
    title,
    setTitle,
    description,
    setDescription,
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
