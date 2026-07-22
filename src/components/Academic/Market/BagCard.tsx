'use client';

import React from 'react';
import { Star, Edit, Trash2, BookOpen, User, Layers, Code2 } from 'lucide-react';
import { BagItem } from '@/types/market';

interface BagCardProps {
  /** Digital bag item data */
  bag: BagItem;
  /** Callback fired on edit click */
  onEdit: (bag: BagItem) => void;
  /** Callback fired on delete click */
  onDelete: (id: number) => void;
  /** Callback fired on preview click */
  onPreview: (bag: BagItem) => void;
}

/**
 * BagCard Component
 * Displays digital bag cards matching exact design from Image 4.
 */
export default function BagCard({ bag, onEdit, onDelete, onPreview }: BagCardProps) {
  // Determine badge styling based on title or category
  const getBadgeStyle = () => {
    if (bag.title.toLowerCase().includes('tailwind') || bag.title.includes('Tailwind')) {
      return {
        bg: 'bg-purple-100 text-purple-600',
        icon: Layers,
      };
    }
    if (bag.title.toLowerCase().includes('javascript') || bag.title.includes('JavaScript')) {
      return {
        bg: 'bg-amber-100 text-amber-600',
        icon: Code2,
      };
    }
    return {
      bg: 'bg-blue-100 text-blue-600',
      icon: Code2,
    };
  };

  const badgeInfo = getBadgeStyle();
  const BadgeIcon = badgeInfo.icon;

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      {/* Cover Image Header */}
      <div className="relative w-full h-44 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 overflow-hidden">
        {bag.coverImage ? (
          <img
            src={bag.coverImage}
            alt={bag.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">
            <Layers size={48} />
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Badge Title Row */}
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg ${badgeInfo.bg} flex items-center justify-center flex-shrink-0 font-bold text-xs`}>
              <BadgeIcon size={16} />
            </div>
            <h3 className="text-lg font-black text-gray-900 line-clamp-1">
              {bag.title}
            </h3>
          </div>

          {/* Description Text */}
          <p className="text-gray-500 text-xs font-semibold leading-relaxed line-clamp-2 min-h-[36px]">
            {bag.description}
          </p>

          {/* Lesson / Course Count */}
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold pt-1">
            <BookOpen size={14} className="text-gray-400" />
            <span>{bag.courseCount || 20} {bag.title.includes('Tailwind') ? 'فيديو وملف' : 'دورة'}</span>
          </div>
        </div>

        {/* Rating and Author Section */}
        <div className="space-y-4 pt-2 border-t border-gray-50">
          <div className="flex items-center justify-between">
            {/* Rating Stars */}
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700 mr-1">
                {bag.rating || 4.9}
              </span>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">
                {bag.instructorName || 'أحمد محمد'}
              </span>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <User size={13} />
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 pt-1">
            {/* Delete Button */}
            <button
              onClick={() => onDelete(bag.id)}
              className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors flex-shrink-0"
              title="حذف"
            >
              <Trash2 size={18} />
            </button>

            {/* Edit Button */}
            <button
              onClick={() => onEdit(bag)}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors flex-shrink-0"
              title="تعديل"
            >
              <Edit size={18} />
            </button>

            {/* Preview Button */}
            <button
              onClick={() => onPreview(bag)}
              className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center transition-colors shadow-sm shadow-blue-200"
            >
              معاينة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
