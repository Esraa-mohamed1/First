import React from 'react';
import { Award, HelpCircle, Sparkles, Info, RotateCcw } from 'lucide-react';
import { ExamPayload, ExamResultSummary } from '@/types/academic/exam.types';
import { KaTeXRenderer } from '@/components/Academic/Exam/KaTeXRenderer';

interface ExamTakingResultViewProps {
  exam: ExamPayload;
  resultSummary: ExamResultSummary | null;
  formatTime: (seconds: number) => string;
  onResetExam: () => void;
  onClose: () => void;
}

export const ExamTakingResultView: React.FC<ExamTakingResultViewProps> = ({
  exam,
  resultSummary,
  formatTime,
  onResetExam,
  onClose,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar bg-white">
      {/* Hero Result Banner */}
      <div
        className={`p-8 rounded-3xl text-center text-white space-y-4 shadow-xl ${
          resultSummary?.isPassed
            ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
            : 'bg-gradient-to-br from-rose-600 to-red-700'
        }`}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
          {resultSummary?.isPassed ? (
            <Award className="w-9 h-9 text-white" />
          ) : (
            <HelpCircle className="w-9 h-9 text-white" />
          )}
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest font-bold opacity-80">
            {resultSummary?.isPassed ? 'تم اجتياز الاختبار بنجاح' : 'لم يتم اجتياز الاختبار'}
          </span>
          <h2 className="text-3xl font-extrabold mt-1 font-mono">
            {resultSummary?.percentageScore}%
          </h2>
          <p className="text-sm opacity-90 mt-1 font-medium">
            حصلت على {resultSummary?.totalEarnedScore} من {resultSummary?.maxPossibleScore} درجة
          </p>
        </div>

        {resultSummary?.isPassed && exam?.settings?.basic?.enableCertificate && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-4 h-4" />
            <span>مؤهل للحصول على شهادة إتمام الاختبار</span>
          </div>
        )}
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block mb-1 font-bold">عدد الأسئلة</span>
          <b className="text-xl font-bold text-slate-800 font-mono">
            {resultSummary?.totalQuestions}
          </b>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <span className="text-xs text-emerald-700 block mb-1 font-bold">الإجابات الصحيحة</span>
          <b className="text-xl font-bold text-emerald-800 font-mono">
            {resultSummary?.correctCount}
          </b>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
          <span className="text-xs text-rose-700 block mb-1 font-bold">الإجابات الخاطئة</span>
          <b className="text-xl font-bold text-rose-800 font-mono">
            {resultSummary?.incorrectCount}
          </b>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block mb-1 font-bold">الوقت المستغرق</span>
          <b className="text-xl font-bold text-slate-800 font-mono">
            {formatTime(resultSummary?.timeSpentSeconds || 0)}
          </b>
        </div>
      </div>

      {/* Detailed Question Review Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          مراجعة تفصيلية للأسئلة والإجابات
        </h3>

        <div className="space-y-4">
          {resultSummary?.reviews.map((rev, index) => (
            <div
              key={rev.question.id}
              className={`p-5 rounded-2xl border transition ${
                rev.isCorrect
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-rose-50/40 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800">
                    سؤال {index + 1}:
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      rev.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {rev.isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-slate-600">
                  {rev.earnedScore} / {rev.maxScore} درجة
                </span>
              </div>

              <div className="font-bold text-slate-900 text-sm mb-3">
                <KaTeXRenderer content={rev.question.title} />
              </div>

              {/* Feedback / Model answer explanation */}
              {rev.question.explanation && (
                <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                  <b className="text-blue-600 block mb-1">توضيح المعلم:</b>
                  <KaTeXRenderer content={rev.question.explanation} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Retake / Close Bar */}
      <div className="pt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onResetExam}
          className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة الاختبار</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          إنهاء المعاينة
        </button>
      </div>
    </div>
  );
};
