import React from 'react';
import { QuestionInputProps } from '../../types';

export const MatchingQuestionInput: React.FC<QuestionInputProps> = ({
  question,
  answer,
  onUpdateAnswer,
}) => {
  if (question.type !== 'matching') return null;

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-slate-600 mb-2">
        اختر المقابل الصحيح لكل عنصر:
      </p>
      {question.matchingPairs?.map((pair) => (
        <div
          key={pair.id}
          className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white gap-4 shadow-2xs"
        >
          <span className="font-bold text-sm text-slate-800 flex-1">
            {pair.prompt}
          </span>
          <select
            value={answer.matchingPairs?.[pair.id] || ''}
            onChange={(e) => {
              const updatedPairs = {
                ...(answer.matchingPairs || {}),
                [pair.id]: e.target.value,
              };
              onUpdateAnswer({ matchingPairs: updatedPairs });
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs md:text-sm outline-none focus:border-blue-500"
          >
            <option value="">-- اختر المطابق --</option>
            {question.matchingPairs?.map((targetOption) => (
              <option key={targetOption.id} value={targetOption.target}>
                {targetOption.target}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
