'use client';

import React from 'react';
import { Info, Plus, Sparkles } from 'lucide-react';

interface FillBlanksQuestionEditorProps {
  template: string;
  answers: string[];
  onChange: (template: string, answers: string[]) => void;
}

export const FillBlanksQuestionEditor: React.FC<FillBlanksQuestionEditorProps> = ({
  template = '',
  answers = [],
  onChange,
}) => {
  const handleInsertDash = () => {
    const updated = template ? `${template} {dash}` : '{dash}';
    onChange(updated, answers);
  };

  const blanksCount = (template.match(/\{dash\}/g) || []).length;

  const handleUpdateAnswer = (index: number, val: string) => {
    const nextAnswers = [...answers];
    nextAnswers[index] = val;
    onChange(template, nextAnswers);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Template input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700">
            نص الجملة والفراغات
          </label>
          <button
            type="button"
            onClick={handleInsertDash}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} />
            <span>إدراج فراغ {'{dash}'}</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={template}
          onChange={(e) => onChange(e.target.value, answers)}
          placeholder="اكتب الجملة واستخدم {dash} في مكان كل فراغ مفقود..."
          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white resize-none leading-relaxed"
        />

        <p className="text-[11px] text-slate-400">
          عدد الفراغات المكتشفة في النص: <b className="font-mono text-blue-600">{blanksCount}</b>
        </p>
      </div>

      {/* Answers per blank */}
      {blanksCount > 0 && (
        <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs font-bold text-slate-700 block">
            الإجابات النموذجية لكل فراغ:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: blanksCount }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 w-16">
                  فراغ #{idx + 1}:
                </span>
                <input
                  type="text"
                  value={answers[idx] || ''}
                  onChange={(e) => handleUpdateAnswer(idx, e.target.value)}
                  placeholder={`الإجابة للفراغ ${idx + 1}...`}
                  className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
