import React from 'react';
import { QuestionInputProps } from '../../types';

export const ImageAnswerQuestionInput: React.FC<QuestionInputProps> = ({
  question,
  answer,
  onUpdateAnswer,
}) => {
  if (question.type !== 'image_answer') return null;

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="اكتب الإجابة الظاهرة في الصورة..."
        value={answer.textAnswer || ''}
        onChange={(e) => onUpdateAnswer({ textAnswer: e.target.value })}
        className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-800 text-xs md:text-sm font-bold outline-none focus:border-blue-500 transition shadow-2xs"
      />
    </div>
  );
};
