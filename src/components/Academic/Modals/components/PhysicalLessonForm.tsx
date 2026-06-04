'use client';

import React from 'react';
import { Link2 } from 'lucide-react';

interface PhysicalLessonFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  locationLink: string;
  onLocationLinkChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  uploadFileToggle: boolean;
  onUploadFileToggleChange: (value: boolean) => void;
}

const inputClass =
  'w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-600 font-bold text-right transition-all text-gray-900 shadow-sm';
const labelClass = 'block text-sm font-black text-gray-900 text-right mb-2';

const PhysicalLessonForm = ({
  title,
  onTitleChange,
  locationLink,
  onLocationLinkChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  uploadFileToggle,
  onUploadFileToggleChange,
}: PhysicalLessonFormProps) => {
  return (
    <div className="space-y-5">
      {/* Row 1: Title + Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <div>
          <label className={labelClass}>العنوان بالتفصيل</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="ادخل العنوان بالتفصيل"
            className={inputClass}
          />
        </div>

        {/* Location Link */}
        <div>
          <label className={labelClass}>رابط الموقع (اختياري)</label>
          <div className="relative">
            <input
              type="text"
              value={locationLink}
              onChange={(e) => onLocationLinkChange(e.target.value)}
              placeholder="ادخل رابط الموقع"
              className={`${inputClass} pl-12`}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Link2 size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Start Date */}
        <div>
          <label className={labelClass}>تاريخ البداية</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* End Date */}
        <div>
          <label className={labelClass}>تاريخ النهاية</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Upload File Toggle */}
      <div>
        <label className={labelClass}>محتوي الدورة</label>
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="font-bold text-gray-700">رفع ملف</span>
          <button
            type="button"
            onClick={() => onUploadFileToggleChange(!uploadFileToggle)}
            aria-label="تبديل رفع الملف"
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              uploadFileToggle ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
                uploadFileToggle ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhysicalLessonForm;
