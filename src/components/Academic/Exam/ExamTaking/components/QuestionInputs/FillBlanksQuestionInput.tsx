import React from 'react';
import { QuestionInputProps } from '../../types';

export const FillBlanksQuestionInput: React.FC<QuestionInputProps> = ({
  question,
  answer,
  onUpdateAnswer,
}) => {
  if (question.type !== 'fill_blanks') return null;

  const currentBlanks = answer.blanksAnswers || [];
  const template = question.blanksTemplate || question.title || '';
  const segments = template.split('{dash}');

  return (
    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
      <p className="text-xs font-bold text-slate-600 mb-2">
        املأ الفراغات بالكلمات أو الإجابات المناسبة:
      </p>
      <div className="leading-loose text-base text-slate-800 flex flex-wrap items-center gap-2 font-medium">
        {segments.map((segment, idx, arr) => (
          <React.Fragment key={idx}>
            <span>{segment}</span>
            {idx < arr.length - 1 && (
              <input
                type="text"
                placeholder={`فراغ ${idx + 1}`}
                value={currentBlanks[idx] || ''}
                onChange={(e) => {
                  const nextBlanks = [...currentBlanks];
                  nextBlanks[idx] = e.target.value;
                  onUpdateAnswer({ blanksAnswers: nextBlanks });
                }}
                className="w-36 px-3 py-1.5 text-center font-bold rounded-xl border border-blue-400 bg-white text-blue-700 outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-2xs"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
