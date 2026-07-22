'use client';

import React from 'react';
import { Star, BookOpen, User, Layers, ShoppingCart } from 'lucide-react';
import { BagFormState } from '@/types/market';

interface BagPreviewCardProps {
  /** Live form state data */
  formData?: Partial<BagFormState>;
}

/**
 * BagPreviewCard Component
 * Displays live card preview on the left column during Step 3 of bag creation/editing.
 * Matches exact design in Images 2, 3, and 5 with complete null safety.
 */
export default function BagPreviewCard({ formData = {} }: BagPreviewCardProps) {
  const title = formData.title || 'Tailwind CSS Mastery';
  const description =
    formData.description ||
    'هي لغة تنسيق المواقع التي تجعل الصفحات جميلة CSS ومنظمة وتحكم في ألوانها وأشكالها وتخطيطها بشكل مرن.';
  const instructor = formData.instructorName || 'أحمد محمد';

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-xl overflow-hidden w-full max-w-sm sticky top-6">
      {/* Cover Image Header */}
      <div className="relative w-full h-44 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 overflow-hidden">
        {formData.coverImage ? (
          <img
            src={formData.coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40">
            <Layers size={48} />
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-6 space-y-4">
        {/* Title Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
            <Layers size={16} />
          </div>
          <h3 className="text-lg font-black text-gray-900 line-clamp-1">
            {title}
          </h3>
        </div>

        {/* Description Text */}
        <p className="text-gray-500 text-xs font-semibold leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Lesson / File Count */}
        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
          <BookOpen size={14} className="text-gray-400" />
          <span>20 فيديو وملف</span>
        </div>

        {/* Rating and Author Section */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700 mr-1">4.9</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">{instructor}</span>
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <User size={13} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-md shadow-blue-200 transition-all"
          >
            <ShoppingCart size={18} />
            <span>شراء الآن</span>
          </button>

          <button
            type="button"
            className="w-full py-3 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-50 font-black text-sm flex items-center justify-center transition-all"
          >
            <span>معاينة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
