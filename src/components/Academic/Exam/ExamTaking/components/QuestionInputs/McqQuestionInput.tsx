import React from 'react';
import { QuestionInputProps } from '../../types';
import { KaTeXRenderer } from '@/components/Academic/Exam/KaTeXRenderer';

export const McqQuestionInput: React.FC<QuestionInputProps> = ({
  question,
  answer,
  onUpdateAnswer,
}) => {
  if (question.type !== 'mcq') return null;

  return (
    <div className="space-y-3">
      {question.options?.map((option) => {
        const isMultiple = question.conditions?.multipleCorrectAnswer;
        const isSelected = isMultiple
          ? answer.selectedOptionIds?.includes(option.id)
          : answer.selectedOptionIds?.[0] === option.id;

        const handleSelect = () => {
          if (isMultiple) {
            const currentSelected = answer.selectedOptionIds || [];
            const updated = isSelected
              ? currentSelected.filter((id) => id !== option.id)
              : [...currentSelected, option.id];
            onUpdateAnswer({ selectedOptionIds: updated });
          } else {
            onUpdateAnswer({ selectedOptionIds: [option.id] });
          }
        };

        return (
          <button
            key={option.id}
            type="button"
            onClick={handleSelect}
            className={`w-full p-4 rounded-2xl border text-right transition flex items-center gap-3.5 group cursor-pointer ${
              isSelected
                ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
              }`}
            >
              {option.letter}
            </div>

            <div className="flex-1 text-sm md:text-base font-bold text-slate-800">
              <KaTeXRenderer content={option.text} />
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};
