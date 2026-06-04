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
  const isPhysical =
    courseType === 'physical' || courseType === 'offline' || courseType === 'in-person';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!lesson) return;

    setTitle(lesson.title || '');
    const desc = lesson.description || '';
    const match = desc.match(/<!--OFFLINE_METADATA:(.*?)-->/);

    if (match) {
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
    }
  }, [lesson]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان الدرس');
      return;
    }

    setIsLoading(true);
    try {
      const finalDescription = isPhysical
        ? `تفاصيل المحاضرة الحضورية:\n📍 الموقع: ${locationLink || 'غير محدد'}\n📅 تاريخ البداية: ${startDate || 'غير محدد'}\n📅 تاريخ النهاية: ${endDate || 'غير محدد'}\n\n<!--OFFLINE_METADATA:${JSON.stringify({ locationLink, startDate, endDate })}-->`
        : description;

      await updateLesson(lesson!.id, {
        chapter_id: (lesson as any).chapter_id || (lesson as any).unit_id,
        title,
        description: finalDescription,
        type: lesson!.type,
        video_id: lesson!.video_id,
        file_url: lesson!.file_url,
        is_free: lesson!.is_free,
        order: (lesson as any).order || 1,
        location_link: locationLink || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
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
    isLoading,
    handleUpdate,
  };
}
