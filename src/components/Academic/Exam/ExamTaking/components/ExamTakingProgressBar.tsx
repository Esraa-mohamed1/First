import React from 'react';

interface ExamTakingProgressBarProps {
  progressPercent: number;
}

export const ExamTakingProgressBar: React.FC<ExamTakingProgressBarProps> = ({ progressPercent }) => {
  return (
    <div className="w-full h-1.5 bg-slate-100 overflow-hidden shrink-0">
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
};
