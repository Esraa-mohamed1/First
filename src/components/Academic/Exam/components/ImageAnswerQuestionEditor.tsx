'use client';

import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, Info, Trash2 } from 'lucide-react';

interface ImageAnswerQuestionEditorProps {
  imageUrl?: string;
  expectedAnswer?: string;
  onChange: (imageUrl?: string, expectedAnswer?: string) => void;
}

export const ImageAnswerQuestionEditor: React.FC<ImageAnswerQuestionEditorProps> = ({
  imageUrl = '',
  expectedAnswer = '',
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange(url, expectedAnswer);
    }
  };

  return (
    <div className="space-y-4 text-right">
      <div className="rounded-2xl border border-blue-200 bg-white p-5 space-y-4 shadow-2xs">
        {/* Image Upload Area */}
        <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 flex flex-col items-center justify-center text-center group hover:border-blue-300 transition-colors min-h-[160px]">
          {imageUrl ? (
            <div className="relative w-full flex flex-col items-center">
              <img
                src={imageUrl}
                alt="Question media"
                className="max-h-48 object-contain rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={() => onChange('', expectedAnswer)}
                className="absolute top-2 left-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-sm"
                title="إزالة الصورة"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                <ImageIcon size={24} />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFile}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl border border-blue-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Upload size={14} />
                <span>رفع صورة</span>
              </button>

              <p className="text-[11px] font-bold text-slate-400">
                المقاس القياسي للصورة هو 700 × 430 بكسل
              </p>
            </div>
          )}
        </div>

        {/* Expected Answer Input Box */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="ضع الاجابة هنا"
            value={expectedAnswer}
            onChange={(e) => onChange(imageUrl, e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white text-right"
          />

          <p className="flex items-start gap-1.5 text-[11px] font-bold text-slate-400">
            <Info size={14} className="shrink-0 text-blue-500 mt-0.5" />
            <span>
              يجب على الطلاب إدخال الإجابات كما هي مكتوبة هنا تماماً. يُرجى استخدام الأحرف الصغيرة (lowercase) عند كتابة الإجابة.
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            موافق
          </button>
          <button
            type="button"
            onClick={() => onChange('', '')}
            className="px-4 py-2 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
