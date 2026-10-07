import React from 'react';
import { BookOpen, Clock, LayoutGrid, X } from 'lucide-react';
import { ExamPayload } from '@/types/academic/exam.types';

interface ExamTakingHeaderProps {
  exam: ExamPayload;
  currentIndex: number;
  totalQuestions: number;
  progressPercent: number;
  timeLimitMinutes: number;
  secondsRemaining: number;
  isCompleted: boolean;
  formatTime: (seconds: number) => string;
  onOpenNavGrid: () => void;
  onClose: () => void;
}

export const ExamTakingHeader: React.FC<ExamTakingHeaderProps> = ({
  exam,
  currentIndex,
  totalQuestions,
  progressPercent,
  timeLimitMinutes,
  secondsRemaining,
  isCompleted,
  formatTime,
  onOpenNavGrid,
  onClose,
}) => {
  return (
    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white/95 backdrop-blur sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 line-clamp-1">
            {exam.title || 'اختبار تقييمي'}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>السؤال {currentIndex + 1} من {totalQuestions}</span>
            <span>•</span>
            <span>نسبة الإنجاز {progressPercent}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Timer Badge */}
        {timeLimitMinutes > 0 && !exam.settings?.basic?.hideTimer && !isCompleted && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border transition ${
              secondsRemaining < 60
                ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                : secondsRemaining < 300
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>
        )}

        {/* Questions Grid Button */}
        {!isCompleted && (
          <button
            type="button"
            onClick={onOpenNavGrid}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="شبكة الأسئلة"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">الأسئلة</span>
          </button>
        )}

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          title="خروج"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
