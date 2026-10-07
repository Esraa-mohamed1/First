'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Video,
  HelpCircle,
  Repeat,
  Tag,
  ChevronLeft,
  Check,
  Eye,
} from 'lucide-react';
import { BankItem, Library } from '@/types/bank';
import { getQuestionTypeMeta, getDifficultyMeta, getBankItemKindMeta } from '@/constants/bank';

interface BankItemRowProps {
  item: BankItem;
  library?: Library;
  selectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onPreview?: () => void;
}

export default function BankItemRow({
  item,
  library,
  selectable = false,
  isSelected = false,
  onToggleSelect,
  onPreview,
}: BankItemRowProps) {
  const isQuestion = item.kind === 'question';
  const isLesson = item.kind === 'lesson';
  const isVideo = item.kind === 'video';

  const kindMeta = getBankItemKindMeta(item.kind);

  // Derive Display Title
  const title = isQuestion
    ? item.question.text
    : item.title || 'عنصر بدون عنوان';

  // Derive Question Type & Difficulty Meta
  const questionTypeMeta = isQuestion ? getQuestionTypeMeta(item.question.type) : null;
  const difficultyMeta = isQuestion && item.question.difficulty
    ? getDifficultyMeta(item.question.difficulty)
    : null;

  // Build meta parts array
  const metaParts: string[] = [];

  if (isQuestion && questionTypeMeta) {
    metaParts.push(questionTypeMeta.label);
  } else {
    metaParts.push(kindMeta.label);
  }

  if (isQuestion && difficultyMeta && difficultyMeta.key) {
    metaParts.push(`مستوى ${difficultyMeta.label}`);
  }

  if (item.unit) {
    metaParts.push(item.unit);
  }

  if (library?.name && !selectable) {
    metaParts.push(library.name);
  }

  const rowContent = (
    <div className="flex items-start gap-3 sm:gap-4">
      {/* Checkbox (in selectable mode) */}
      {selectable && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect?.();
          }}
          className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-2.5 transition-all cursor-pointer ${
            isSelected
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
              : 'border-gray-300 bg-white hover:border-indigo-400'
          }`}
          role="checkbox"
          aria-checked={isSelected}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onToggleSelect?.();
            }
          }}
        >
          {isSelected && <Check size={13} strokeWidth={3} />}
        </div>
      )}

      {/* Kind Icon Badge */}
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
          isQuestion
            ? 'bg-purple-50 text-purple-600 border border-purple-100'
            : isVideo
            ? 'bg-blue-50 text-blue-600 border border-blue-100'
            : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
        }`}
      >
        {isQuestion && <HelpCircle size={20} />}
        {isVideo && <Video size={20} />}
        {isLesson && <BookOpen size={20} />}
      </div>

      {/* Center Content: Title, Meta, Tags */}
      <div className="flex-1 min-w-0 space-y-1.5 text-start">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
            {title}
          </h4>
        </div>

        {/* Meta Line */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 font-medium">
          {metaParts.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-300 font-bold">·</span>}
              <span className={index === 0 ? 'text-indigo-600 font-bold' : ''}>
                {part}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Tags list (if present) */}
        {((item.tags && item.tags.length > 0) || (isQuestion && item.question.tags && item.question.tags.length > 0)) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {Array.from(new Set([...(item.tags || []), ...(isQuestion ? item.question.tags || [] : [])])).slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 text-[10px] font-medium border border-gray-100"
              >
                <Tag size={9} className="opacity-60" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right Action & Usage Badge */}
      <div className="flex items-center gap-2 shrink-0 ps-2">
        {item.usageCount > 0 && (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100/80 shadow-xs"
            title={`مستخدم في ${item.usageCount} موضع`}
          >
            <Repeat size={12} />
            <span>مستخدم في {item.usageCount}</span>
          </span>
        )}

        {selectable ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.();
            }}
            title="معاينة وتعديل العنصر"
            className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="معاينة وتعديل العنصر"
          >
            <Eye size={16} />
          </button>
        ) : (
          <div className="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors text-gray-400">
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          </div>
        )}
      </div>
    </div>
  );

  if (selectable) {
    return (
      <div
        onClick={onToggleSelect}
        className={`group block rounded-2xl p-4 sm:p-5 border transition-all duration-150 cursor-pointer select-none ${
          isSelected
            ? 'border-indigo-500 bg-indigo-50/35 shadow-xs ring-1 ring-indigo-500/20'
            : 'border-gray-100 hover:border-indigo-200 bg-white shadow-sm hover:shadow-md'
        }`}
      >
        {rowContent}
      </div>
    );
  }

  return (
    <Link
      href={`/academic/bank/${item.libraryId}`}
      className="group block bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-150"
    >
      {rowContent}
    </Link>
  );
}
