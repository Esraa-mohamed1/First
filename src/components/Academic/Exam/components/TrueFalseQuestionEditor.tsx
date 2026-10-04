'use client';

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TrueFalseQuestionEditorProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const TrueFalseQuestionEditor: React.FC<TrueFalseQuestionEditorProps> = ({
  value = true,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-slate-500 text-right">
        اختر الإجابة الصحيحة لهذا السؤال:
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* True Option */}
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
            value === true
              ? 'bg-emerald-50/80 border-emerald-500 text-emerald-800 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                value === true
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <CheckCircle2 size={20} />
            </div>
            <span className="font-extrabold text-sm">صح (صحيح)</span>
          </div>
          <span className="text-xs font-bold">Ⓐ</span>
        </button>

        {/* False Option */}
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
            value === false
              ? 'bg-rose-50/80 border-rose-500 text-rose-800 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                value === false
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <XCircle size={20} />
            </div>
            <span className="font-extrabold text-sm">خطأ (غير صحيح)</span>
          </div>
          <span className="text-xs font-bold">Ⓑ</span>
        </button>
      </div>
    </div>
  );
};
