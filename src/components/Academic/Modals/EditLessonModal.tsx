'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Video, FileText, FilePieChart as FilePowerpoint, Link2, Save, CornerUpLeft, Calendar, Type, Eye, Lock, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateLesson } from '@/services/courses';
import { Lesson } from '@/types/api';
import LiveLessonForm from './components/LiveLessonForm';
import { getLessonVideoSrc } from '@/lib/lesson-video-src';

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
  const [isFree, setIsFree] = useState(false);
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
      setIsFree(lesson.is_free === true || (lesson as any).is_free === 'free' || (lesson as any).is_free === 1 || (lesson as any).is_free_preview === 'free' || (lesson as any).price_type === 'free');
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
        is_free: isFree,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200" dir="rtl">
      <div className={`relative w-full ${isPhysical || isLive ? 'max-w-4xl' : 'max-w-2xl'} bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col`}>
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 px-8 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0">
              {lesson.type === 'video' ? <Video size={24} /> : 
               lesson.type === 'pdf' ? <FileText size={24} /> : <FilePowerpoint size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">تعديل الدرس التعليمي</h2>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {lesson.type === 'video' ? 'فيديو' : lesson.type === 'pdf' ? 'PDF' : 'مستند'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-bold mt-0.5">تعديل محتوى وإعدادات الوصول للدرس</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-all cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
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
                    <div className="space-y-2 group">
                      <label className="block text-right text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600">العنوان بالتفصيل</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="ادخل العنوان بالتفصيل"
                          className="w-full p-4 pl-12 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-sm transition-all text-right text-gray-900 shadow-xs"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                          <Type size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 group">
                        <label className="block text-right text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600">تاريخ البداية</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-sm transition-all text-right text-gray-900 shadow-xs"
                        />
                      </div>

                      <div className="space-y-2 group">
                        <label className="block text-right text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600">تاريخ النهاية</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-sm transition-all text-right text-gray-900 shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2 group">
                      <label className="block text-right text-sm font-extrabold text-zinc-700 px-1 transition-colors group-focus-within:text-blue-600">رابط الموقع (اختياري)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={locationLink}
                          onChange={(e) => setLocationLink(e.target.value)}
                          placeholder="ادخل رابط الموقع"
                          className="w-full p-4 pl-12 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl outline-none hover:bg-zinc-50 hover:border-zinc-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 font-bold text-sm transition-all text-right text-gray-900 shadow-xs"
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
                  <label className="block text-right text-sm font-black text-slate-800">عنوان الدرس</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="ادخل عنوان الدرس"
                      className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all text-right text-slate-900 shadow-xs"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                      <Type size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="block text-right text-sm font-black text-slate-800">وصف الدرس</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="ادخل وصفاً تفصيلياً للدرس"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 font-bold text-sm min-h-[100px] transition-all text-right text-slate-900 shadow-xs resize-none"
                  />
                </div>

                {/* Clear Free / Paid Access Selection */}
                <div className="space-y-2 text-right">
                  <label className="block text-sm font-black text-slate-900">
                    نوع الوصول للدرس (مجاني أم مدفوع) <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsFree(true)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm transition-all duration-200 cursor-pointer ${
                        isFree
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/40 scale-[1.02]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                      }`}
                    >
                      <Eye size={18} />
                      <span>درس مجاني (معاينة)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-emerald-800/60 text-emerald-100">1</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFree(false)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm transition-all duration-200 cursor-pointer ${
                        !isFree
                          ? 'bg-slate-800 text-white shadow-md shadow-slate-900/25 ring-2 ring-slate-700/40 scale-[1.02]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                      }`}
                    >
                      <Lock size={18} />
                      <span>درس مدفوع</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-slate-700/60 text-slate-200">0</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 font-bold px-1">
                    {isFree
                      ? '🟢 هذا الدرس سيكون متاحاً كمعاينة مجانية.'
                      : '🔒 هذا الدرس سيكون مغلقاً للمشتركين فقط.'}
                  </p>
                </div>

                {/* Enhanced Video Lesson Preview Box */}
                {(lesson.type === 'video' || lesson.video_url || lesson.video_id || lesson.file_url) && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span>معاينة فيديو الدرس (مشاهدة)</span>
                      </label>
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        فيديو جاهز
                      </span>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden aspect-video relative group">
                      {getLessonVideoSrc(lesson as any) ? (
                        getLessonVideoSrc(lesson as any).includes('iframe') || getLessonVideoSrc(lesson as any).includes('mediadelivery') ? (
                          <iframe
                            src={getLessonVideoSrc(lesson as any)}
                            className="w-full h-full border-0 rounded-2xl"
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                          />
                        ) : (
                          <video
                            src={getLessonVideoSrc(lesson as any)}
                            controls
                            className="w-full h-full object-contain rounded-2xl"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs font-bold gap-2 p-6 text-center">
                          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                            <Video size={24} />
                          </div>
                          <span>فيديو الدرس غير متوفر حالياً أو قيد المعالجة في الخادم</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 px-8 bg-slate-50 border-t border-slate-200/80 flex gap-4 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-200/80 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <CornerUpLeft size={18} />
            <span>إلغاء</span>
          </button>
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="flex-[2] py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-600/25 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm cursor-pointer"
          >
            <Save size={18} />
            <span>{isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLessonModal;
