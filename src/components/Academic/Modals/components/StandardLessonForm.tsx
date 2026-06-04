'use client';

import React from 'react';
import { Video, FileText, FilePieChart as FilePowerpoint } from 'lucide-react';
import type { LessonFileType } from '../hooks/useAddLesson';

interface StandardLessonFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  lessonType: LessonFileType;
  onLessonTypeChange: (type: LessonFileType) => void;
}

const inputClass =
  'w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all text-gray-900';
const labelClass = 'block text-sm font-black text-gray-900 text-right mb-2';

const LESSON_TYPES: { value: LessonFileType; label: string; icon: React.ReactNode }[] = [
  { value: 'powerpoint', label: 'ملف Powerpoint', icon: <FilePowerpoint size={18} /> },
  { value: 'pdf', label: 'ملف PDF', icon: <FileText size={18} /> },
  { value: 'video', label: 'فيديو', icon: <Video size={18} /> },
];

const StandardLessonForm = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  lessonType,
  onLessonTypeChange,
}: StandardLessonFormProps) => {
  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <label className={labelClass}>عنوان الدرس</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="ادخل عنوان للدرس"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>اضف وصف مختصر للدرس</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="ادخل وصف للدرس"
          rows={4}
          className={`${inputClass} min-h-[120px] resize-none`}
        />
      </div>

      {/* Lesson Type Selector */}
      <div>
        <label className={labelClass}>نوع الدرس</label>
        <div className="relative flex bg-gray-100 p-1.5 rounded-[20px] shadow-inner">
          {/* Sliding indicator */}
          <div
            className="absolute top-1.5 bottom-1.5 bg-white rounded-[16px] shadow-sm transition-all duration-300 ease-in-out z-0"
            style={{
              width: 'calc(33.333% - 4px)',
              right:
                lessonType === 'powerpoint'
                  ? '4px'
                  : lessonType === 'pdf'
                  ? 'calc(33.333% + 2px)'
                  : 'calc(66.666% - 2px)',
            }}
          />
          {LESSON_TYPES.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onLessonTypeChange(value)}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[16px] font-bold text-sm transition-colors duration-300 ${
                lessonType === value ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StandardLessonForm;
