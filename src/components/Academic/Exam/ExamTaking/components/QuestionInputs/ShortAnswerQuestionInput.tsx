import React from 'react';
import { QuestionInputProps } from '../../types';

export const ShortAnswerQuestionInput: React.FC<QuestionInputProps> = ({
  question,
  answer,
  onUpdateAnswer,
}) => {
  if (question.type !== 'short_answer') return null;

  return (
    <div className="space-y-2">
      <textarea
        rows={4}
        placeholder="اكتب إجابتك هنا بوضوح..."
        value={answer.textAnswer || ''}
        onChange={(e) => onUpdateAnswer({ textAnswer: e.target.value })}
        className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-800 text-xs md:text-sm font-bold outline-none focus:border-blue-500 transition resize-none leading-relaxed shadow-2xs"
      />
      <div className="text-left text-xs text-slate-400 font-mono">
        {(answer.textAnswer || '').length} حرف
      </div>
    </div>
  );
};
