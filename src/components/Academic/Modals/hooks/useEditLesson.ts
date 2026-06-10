'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { updateLesson } from '@/services/courses';
import { Lesson } from '@/types/api';

interface UseEditLessonOptions {
  lesson: Lesson | null;
  courseType?: string;
  onLessonUpdated: () => void;
  onClose: () => void;
}

export function useEditLesson({
  lesson,
  courseType,
  onLessonUpdated,
  onClose,
}: UseEditLessonOptions) {
  // Physical/Offline course states
  const [locationLink, setLocationLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Live online course states
  const [sessionLink, setSessionLink] = useState('');
  const [sessionDateTime, setSessionDateTime] = useState('');

  const isPhysical = courseType === 'physical' || courseType === 'offline' || courseType === 'in-person';
  const isLive = courseType === 'online' || courseType === 'live-online';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!lesson) return;

    setTitle(lesson.title || '');
    const desc = lesson.description || '';
    const match = desc.match(/<!--OFFLINE_METADATA:(.*?)-->/);
    const liveMatch = desc.match(/<!--LIVE_METADATA:(.*?)-->/);

    if (liveMatch) {
      try {
        const parsed = JSON.parse(liveMatch[1]);
        setSessionLink(parsed.sessionLink || '');
        setSessionDateTime(parsed.dateTime || '');
        setDescription('');
      } catch {
        setDescription(desc);
      }
    } else if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        setLocationLink(parsed.locationLink || '');
        setStartDate(parsed.startDate || '');
        setEndDate(parsed.endDate || '');
        setDescription('');
      } catch {
        setDescription(desc);
        setLocationLink('');
        setStartDate('');
        setEndDate('');
      }
    } else {
      setDescription(desc);
      setLocationLink('');
      setStartDate('');
      setEndDate('');
      setSessionLink('');
      setSessionDateTime('');
    }
  }, [lesson]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان الدرس');
      return;
    }

    if (isLive) {
      if (!sessionLink.trim()) {
        toast.error('يرجى إدخال رابط السيشن');
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
        toast.error('يرجى إدخال تاريخ ووقت السيشن');
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

    setIsLoading(true);
    try {
      const finalDescription = isLive
        ? `تفاصيل المحاضرة المباشرة:
🔗 رابط السيشن: ${sessionLink || 'غير محدد'}
📅 التاريخ والوقت: ${sessionDateTime || 'غير محدد'}

<!--LIVE_METADATA:${JSON.stringify({ sessionLink, dateTime: sessionDateTime })}-->`
        : isPhysical
        ? `تفاصيل المحاضرة الحضورية:\n📍 الموقع: ${locationLink || 'غير محدد'}\n📅 تاريخ البداية: ${startDate || 'غير محدد'}\n📅 تاريخ النهاية: ${endDate || 'غير محدد'}\n\n<!--OFFLINE_METADATA:${JSON.stringify({ locationLink, startDate, endDate })}-->`
        : description;

      await updateLesson(lesson!.id, {
        chapter_id: (lesson as any).chapter_id || (lesson as any).unit_id,
        title,
        description: finalDescription,
        type: isLive ? 'video' : lesson!.type,
        video_id: isLive ? undefined : lesson!.video_id,
        file_url: isLive ? undefined : lesson!.file_url,
        is_free: lesson!.is_free,
        order: (lesson as any).order || 1,
        location_link: isLive ? undefined : (locationLink || undefined),
        start_date: isLive ? undefined : (startDate || undefined),
        end_date: isLive ? undefined : (endDate || undefined),
        video_url: isLive ? sessionLink : lesson!.video_url,
        embed_url: isLive ? sessionLink : lesson!.embed_url,
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

  return {
    isPhysical,
    isLive,
    title,
    setTitle,
    description,
    setDescription,
    locationLink,
    setLocationLink,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sessionLink,
    setSessionLink,
    sessionDateTime,
    setSessionDateTime,
    isLoading,
    handleUpdate,
  };
}
