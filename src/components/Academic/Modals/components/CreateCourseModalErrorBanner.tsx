'use client';

import React from 'react';
import { X } from 'lucide-react';

interface CreateCourseModalErrorBannerProps {
  apiErrorMessages: string[];
  setApiErrorMessages: (messages: string[]) => void;
}

export const CreateCourseModalErrorBanner = ({
  apiErrorMessages,
  setApiErrorMessages,
}: CreateCourseModalErrorBannerProps) => {
  if (apiErrorMessages.length === 0) return null;

  return (
    <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
        <X size={16} className="text-red-600" strokeWidth={3} />
      </div>
      <div className="flex-1 text-right space-y-1">
        <p className="text-sm font-black text-red-700">يوجد أخطاء في البيانات المدخلة</p>
        <ul className="space-y-1">
          {apiErrorMessages.map((msg, i) => (
            <li key={i} className="text-xs font-bold text-red-600 flex items-start gap-1.5">
              <span className="text-red-400 mt-0.5 shrink-0">•</span>
              <span>{msg}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => setApiErrorMessages([])}
        className="text-red-400 hover:text-red-600 transition-colors shrink-0 p-1 hover:bg-red-100 rounded-lg"
      >
        <X size={14} />
      </button>
    </div>
  );
};
