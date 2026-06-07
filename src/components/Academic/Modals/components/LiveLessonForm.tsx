'use client';

import React from 'react';
import { ChevronDown, Link2 } from 'lucide-react';

interface LiveLessonFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  sessionLink: string;
  onSessionLinkChange: (value: string) => void;
  sessionDateTime: string;
  onSessionDateTimeChange: (value: string) => void;
}

const inputClass =
  'w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all text-gray-900 shadow-sm';
const labelClass = 'block text-sm font-black text-gray-900 text-right mb-2';

const LiveLessonForm = ({
  title,
  onTitleChange,
  sessionLink,
  onSessionLinkChange,
  sessionDateTime,
  onSessionDateTimeChange,
}: LiveLessonFormProps) => {
  return (
    <div className="space-y-5">
      {/* Lesson Name */}
      <div>
        <label className={labelClass}>اسم الدرس</label>
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="ادخل اسم الدرس"
            className={`${inputClass} pl-12`}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* Session Link */}
      <div>
        <label className={labelClass}>رابط السيشن</label>
        <div className="relative">
          <input
            type="text"
            value={sessionLink}
            onChange={(e) => onSessionLinkChange(e.target.value)}
            placeholder="لينك الرابط"
            className={`${inputClass} pl-12 text-left`}
            dir="ltr"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Link2 size={20} />
          </div>
        </div>
      </div>

      {/* Date / Time */}
      <div>
        <label className={labelClass}>التاريخ / اللوقت</label>
        <div className="relative">
          <input
            type="datetime-local"
            value={sessionDateTime}
            onChange={(e) => onSessionDateTimeChange(e.target.value)}
            className={`${inputClass} pl-12 text-left`}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveLessonForm;
