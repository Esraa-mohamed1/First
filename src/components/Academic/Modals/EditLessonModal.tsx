'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Video, FileText, FilePieChart as FilePowerpoint, Link2, Save, CornerUpLeft, Calendar, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateLesson } from '@/services/courses';
import { Lesson } from '@/types/api';
import LiveLessonForm from './components/LiveLessonForm';

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onLessonUpdated: () => void;
  courseType?: string;
}

const EditLessonModal = ({ isOpen, onClose, lesson, onLessonUpdated, courseType }: EditLessonModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Physical/Offline course states
  const [locationLink, setLocationLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [uploadFileToggle, setUploadFileToggle] = useState(false);

  // Live online course states
  const [sessionLink, setSessionLink] = useState('');
  const [sessionDateTime, setSessionDateTime] = useState('');

  const isPhysical = courseType === 'physical' || courseType === 'offline' || courseType === 'in-person';
  const isLive = courseType === 'online' || courseType === 'live-online';

  useEffect(() => {
    if (lesson) {
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
        } catch (e) {
          console.error(e);
          setDescription(desc);
        }
      } else if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          setLocationLink(parsed.locationLink || '');
          setStartDate(parsed.startDate || '');
          setEndDate(parsed.endDate || '');
          setUploadFileToggle(!!lesson.file_url || !!lesson.video_id);
          setDescription('');
        } catch (e) {
          console.error(e);
          setDescription(desc);
        }
      } else {
        setDescription(desc);
        setLocationLink('');
        setStartDate('');
        setEndDate('');
        setUploadFileToggle(false);
        setSessionLink('');
        setSessionDateTime('');
      }
    }
  }, [lesson]);

  if (!isOpen || !lesson) return null;

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
        ? `تفاصيل المحاضرة الحضورية:
📍 الموقع: ${locationLink || 'غير محدد'}
📅 تاريخ البداية: ${startDate || 'غير محدد'}
📅 تاريخ النهاية: ${endDate || 'غير محدد'}

<!--OFFLINE_METADATA:${JSON.stringify({ locationLink, startDate, endDate })}-->`
        : description;

      await updateLesson(lesson.id, {
        chapter_id: (lesson as any).chapter_id || (lesson as any).unit_id,
        title,
        description: finalDescription,
        type: isLive ? 'video' : lesson.type,
        video_id: isLive ? undefined : lesson.video_id,
        file_url: isLive ? undefined : lesson.file_url,
        is_free: lesson.is_free,
        order: (lesson as any).order || 1,
        location_link: isLive ? undefined : (locationLink || undefined),
        start_date: isLive ? undefined : (startDate || undefined),
        end_date: isLive ? undefined : (endDate || undefined),
        video_url: isLive ? sessionLink : lesson.video_url,
        embed_url: isLive ? sessionLink : lesson.embed_url,
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className={`relative w-full ${isPhysical || isLive ? 'max-w-4xl' : 'max-w-[500px]'} bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto`}>
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-900 transition-colors p-2 z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8 pt-12 md:p-10 md:pt-16 space-y-8">
          <div className="text-center">
             <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {lesson.type === 'video' ? <Video size={28} /> : 
                 lesson.type === 'pdf' ? <FileText size={28} /> : <FilePowerpoint size={28} />}
             </div>
            <h2 className="text-2xl font-black text-gray-900">تعديل الدرس</h2>
            <p className="text-gray-500 font-bold mt-2">تحديث بيانات الدرس التعليمي</p>
          </div>

          <div className="space-y-6">
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
                      <label className="block text-right text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600">العنوان بالتفصيل</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="ادخل العنوان بالتفصيل"
                          className="w-full p-4 pl-12 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-sm transition-all text-right text-gray-900 shadow-sm"
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
                        <label className="block text-right text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600">تاريخ البداية</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-sm transition-all text-right text-gray-900 shadow-sm"
                        />
                      </div>

                      {/* End Date */}
                      <div className="space-y-2 group">
                        <label className="block text-right text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600">تاريخ النهاية</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-sm transition-all text-right text-gray-900 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Left Column: Location Link */}
                  <div className="space-y-6">
                    {/* Location Link (Optional) */}
                    <div className="space-y-2 group">
                      <label className="block text-right text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600">رابط الموقع (اختياري)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={locationLink}
                          onChange={(e) => setLocationLink(e.target.value)}
                          placeholder="ادخل رابط الموقع"
                          className="w-full p-4 pl-12 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-sm transition-all text-right text-gray-900 shadow-sm"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                          <Link2 size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2 group">
                  <label className="block text-right text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600">عنوان الدرس</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="ادخل عنوان الدرس"
                      className="w-full p-4 pl-12 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-sm transition-all text-right text-gray-900 shadow-sm"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                      <Type size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="block text-right text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600">وصف الدرس</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="ادخل وصفاً للدرس"
                    className="w-full p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-sm min-h-[120px] transition-all text-right text-gray-900 shadow-sm resize-none"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">نوع المحتوي</span>
                  <span className="text-sm font-black text-gray-700">
                    {lesson.type === 'video' ? 'فيديو' : lesson.type === 'pdf' ? 'ملف PDF' : 'عرض تقديمي'}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <CornerUpLeft size={16} />
              <span>عودة</span>
            </button>
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              <Save size={16} />
              <span>{isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLessonModal;
