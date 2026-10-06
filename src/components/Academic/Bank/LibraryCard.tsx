'use client';

import React from 'react';
import Link from 'next/link';
import {
  Folder,
  Clock,
  ChevronLeft,
  BookOpen,
  Video,
  HelpCircle,
} from 'lucide-react';
import { Library } from '@/types/bank';

interface LibraryCardProps {
  library: Library;
}

/**
 * Format date in localized Arabic relative/short format
 */
const formatUpdatedTime = (isoString?: string): string => {
  if (!isoString) return 'غير محدد';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'منذ قليل';
    if (diffHours < 24) return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;

    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'مؤخراً';
  }
};

export default function LibraryCard({ library }: LibraryCardProps) {
  const counts = library.itemCounts || { lesson: 0, video: 0, question: 0, total: 0 };
  const total = counts.total ?? (counts.lesson || 0) + (counts.video || 0) + (counts.question || 0);

  const primaryColor = library.color || '#6366F1';

  return (
    <Link
      href={`/academic/bank/${library.id}`}
      className="group block bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 hover:border-indigo-200/80 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
    >
      {/* Top Color Accent Line */}
      <div
        className="absolute top-0 inset-x-0 h-1.5 transition-all group-hover:h-2"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="space-y-4">
        {/* Header: Folder Icon + Total Count */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
            }}
          >
            <Folder size={24} className="fill-current/20" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700">
            <span>{total}</span>
            <span className="text-gray-400 font-medium">عنصر</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 text-start">
          <h3 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {library.name}
          </h3>
          {library.description ? (
            <p className="text-gray-500 text-xs font-medium line-clamp-2 leading-relaxed min-h-[32px]">
              {library.description}
            </p>
          ) : (
            <p className="text-gray-400 text-xs italic min-h-[32px] flex items-center">
              لا يوجد وصف مضاف
            </p>
          )}
        </div>

        {/* Breakdown Per-Kind Pills (Only show non-zero counts) */}
        <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
          {(counts.question ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-100">
              <HelpCircle size={12} />
              <span>{counts.question} سؤال</span>
            </span>
          )}

          {(counts.video ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
              <Video size={12} />
              <span>{counts.video} فيديو</span>
            </span>
          )}

          {(counts.lesson ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100">
              <BookOpen size={12} />
              <span>{counts.lesson} درس</span>
            </span>
          )}

          {total === 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-gray-50 text-gray-400 text-[11px] font-medium">
              مكتبة فارغة
            </span>
          )}
        </div>

        {/* Footer: Last Updated + Arrow */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock size={13} />
            <span>آخر تحديث: {formatUpdatedTime(library.updatedAt)}</span>
          </div>

          <div className="w-6 h-6 rounded-lg bg-gray-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
            <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
