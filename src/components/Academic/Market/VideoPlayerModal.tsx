'use client';

import React from 'react';
import { X, Play, Copy, Check, ExternalLink, ShieldCheck, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import { AcademyVideo } from '@/types/videos';

interface VideoPlayerModalProps {
  video: AcademyVideo | null;
  onClose: () => void;
}

export default function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!video) return null;

  const libraryId =
    video.library_id || process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '753695';
  const videoId = video.video_id;

  // Resolved embed URL
  const embedUrl =
    video.video_url ||
    (videoId ? `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}` : '');

  const handleCopyLink = () => {
    if (embedUrl && typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(embedUrl);
      setCopied(true);
      toast.success('تم نسخ رابط الفيديو بنجاح!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-white rounded-[32px] w-full max-w-3xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Film size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">{video.title}</h3>
              <p className="text-xs font-bold text-gray-400 mt-0.5">
                معاينة الفيديو المشغل عبر Bunny CDN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="bg-black relative aspect-video w-full overflow-hidden">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              loading="lazy"
              className="border-0 absolute top-0 left-0 w-full h-full"
              allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/50 gap-2">
              <Play size={48} />
              <span className="text-sm font-bold">لا يوجد رابط تشغيل متاح</span>
            </div>
          )}
        </div>

        {/* Video Info Footer */}
        <div className="p-6 bg-gray-50/70 border-t border-gray-100 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
            <div className="bg-white p-3 rounded-2xl border border-gray-100">
              <span className="text-gray-400 block mb-1">الترتيب</span>
              <span className="text-gray-900 font-black text-sm">#{video.order || 1}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-100">
              <span className="text-gray-400 block mb-1">الحجم</span>
              <span className="text-gray-900 font-black text-sm">
                {video.file_size_mb ? `${video.file_size_mb} MB` : '—'}
              </span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-100">
              <span className="text-gray-400 block mb-1">معرف المكتبة</span>
              <span className="text-gray-900 font-black text-sm">{libraryId}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-100">
              <span className="text-gray-400 block mb-1">معرف الفيديو</span>
              <span className="text-gray-900 font-black text-xs truncate block" title={videoId}>
                {videoId || '—'}
              </span>
            </div>
          </div>

          {/* Copy link row */}
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-2 px-3">
            <input
              type="text"
              readOnly
              value={embedUrl}
              className="flex-1 bg-transparent text-xs font-mono text-gray-600 outline-none text-left"
              dir="ltr"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-black transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
