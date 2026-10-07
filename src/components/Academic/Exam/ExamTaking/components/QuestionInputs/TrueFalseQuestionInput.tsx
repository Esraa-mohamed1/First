import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { QuestionInputProps } from '../../types';

export const TrueFalseQuestionInput: React.FC<QuestionInputProps> = ({
  question,
  answer,
  onUpdateAnswer,
}) => {
  if (question.type !== 'true_false') return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onUpdateAnswer({ trueFalseValue: true })}
        className={`p-6 rounded-2xl border text-center font-bold text-base md:text-lg transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
          answer.trueFalseValue === true
            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
      >
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        <span>صحيح (صح)</span>
      </button>

      <button
        type="button"
        onClick={() => onUpdateAnswer({ trueFalseValue: false })}
        className={`p-6 rounded-2xl border text-center font-bold text-base md:text-lg transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
          answer.trueFalseValue === false
            ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-xs'
            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
      >
        <XCircle className="w-8 h-8 text-rose-500" />
        <span>غير صحيح (خطأ)</span>
      </button>
    </div>
  );
};
