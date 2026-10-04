'use client';

import React from 'react';
import { Info } from 'lucide-react';

interface ShortAnswerQuestionEditorProps {
  sampleAnswer?: string;
  onChange: (sampleAnswer: string) => void;
}

export const ShortAnswerQuestionEditor: React.FC<ShortAnswerQuestionEditorProps> = ({
  sampleAnswer = '',
  onChange,
}) => {
  return (
    <div className="space-y-4 text-right">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <label className="block text-xs font-black text-slate-700">
          نموذج الإجابة المتوقعة أو الكلمات المفتاحية:
        </label>
        <textarea
          rows={3}
          value={sampleAnswer}
          onChange={(e) => onChange(e.target.value)}
          placeholder="اكتب الإجابة النموذجية أو النقاط الأساسية التي سيتم تقييم الطالب بناءً عليها..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
        />

        <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
          <Info size={13} className="shrink-0 text-blue-500" />
          <span>
            سيتم استخدام هذه الإجابة النموذجية للتصحيح التلقائي أو مراجعة المعلم.
          </span>
        </p>
      </div>
    </div>
  );
};
