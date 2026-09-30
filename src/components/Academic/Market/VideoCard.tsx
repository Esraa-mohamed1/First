'use client';

import React, { useState } from 'react';
import { Play, Trash2, Edit2, Share2, Film, Check, Copy, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';
import { AcademyVideo } from '@/types/videos';

interface VideoCardProps {
  video: AcademyVideo;
  onPreview: (video: AcademyVideo) => void;
  onDelete: (id: number | string) => void;
  onEdit?: (video: AcademyVideo) => void;
}

export default function VideoCard({ video, onPreview, onDelete, onEdit }: VideoCardProps) {
  const [copied, setCopied] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const pullZoneId =
    process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_ID ||
    process.env.pull_zone_id ||
    '5846117';

  const libraryId =
    video.library_id ||
    process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID ||
    '753695';

  const embedUrl =
    video.video_url ||
    (video.video_id ? `https://iframe.mediadelivery.net/embed/${libraryId}/${video.video_id}` : '');

  const thumbnailUrl =
    video.thumbnail_url ||
    (video.video_id && !thumbError
      ? `https://vz-${pullZoneId}.b-cdn.net/${video.video_id}/thumbnail.jpg`
      : null);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (embedUrl && typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(embedUrl);
      setCopied(true);
      toast.success('تم نسخ رابط الفيديو بنجاح!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      {/* Thumbnail Header */}
      <div
        onClick={() => onPreview(video)}
        className="relative w-full h-44 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 overflow-hidden cursor-pointer flex items-center justify-center group"
      >
        {thumbnailUrl && !thumbError ? (
          <img
            src={thumbnailUrl}
            alt={video.title}
            onError={() => setThumbError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-indigo-900/60">
            <Film size={44} className="text-white/40" />
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white/90 hover:bg-white text-purple-700 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={24} className="fill-purple-700 mr-[-2px]" />
          </div>
        </div>

        {/* Order Badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-xl">
          الترتيب #{video.order || 1}
        </div>

        {/* File Size Badge */}
        {video.file_size_mb && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5" dir="ltr">
            <HardDrive size={12} className="text-purple-300" />
            <span>{video.file_size_mb} MB</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Badge & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
              <Film size={15} />
            </div>
            <h3
              onClick={() => onPreview(video)}
              className="text-base font-black text-gray-900 line-clamp-1 cursor-pointer hover:text-purple-600 transition-colors"
              title={video.title}
            >
              {video.title}
            </h3>
          </div>

          {/* Subtext info */}
          <p className="text-gray-400 text-xs font-semibold truncate pt-1" dir="ltr">
            ID: {video.video_id || '—'}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            {/* Delete Button */}
            <button
              onClick={() => onDelete(video.id)}
              className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
              title="حذف الفيديو"
            >
              <Trash2 size={17} />
            </button>

            {/* Edit Button */}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(video)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
                title="تعديل العنوان والترتيب"
              >
                <Edit2 size={17} />
              </button>
            )}

            {/* Copy / Share Button */}
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
              title="مشاركة رابط الفيديو"
            >
              {copied ? <Check size={17} /> : <Share2 size={17} />}
            </button>

            {/* Preview Button */}
            <button
              type="button"
              onClick={() => onPreview(video)}
              className="flex-1 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-purple-200 cursor-pointer"
            >
              <Play size={14} className="fill-white" />
              <span>تشغيل ومعاينة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
