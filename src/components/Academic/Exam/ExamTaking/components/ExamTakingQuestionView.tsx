import React from 'react';
import { Flag, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { ExamPayload, ExamQuestion, StudentAnswer } from '@/types/academic/exam.types';
import { KaTeXRenderer } from '@/components/Academic/Exam/KaTeXRenderer';
import { McqQuestionInput } from './QuestionInputs/McqQuestionInput';
import { TrueFalseQuestionInput } from './QuestionInputs/TrueFalseQuestionInput';
import { FillBlanksQuestionInput } from './QuestionInputs/FillBlanksQuestionInput';
import { ShortAnswerQuestionInput } from './QuestionInputs/ShortAnswerQuestionInput';
import { MatchingQuestionInput } from './QuestionInputs/MatchingQuestionInput';
import { ImageAnswerQuestionInput } from './QuestionInputs/ImageAnswerQuestionInput';

interface ExamTakingQuestionViewProps {
  exam: ExamPayload;
  questions: ExamQuestion[];
  currentIndex: number;
  totalQuestions: number;
  currentQuestion: ExamQuestion;
  currentAnswer: StudentAnswer;
  isCurrentFlagged: boolean;
  onToggleFlag: (qId: string) => void;
  onUpdateAnswer: (questionId: string, partial: Partial<StudentAnswer>) => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenSubmitConfirm: () => void;
}

export const ExamTakingQuestionView: React.FC<ExamTakingQuestionViewProps> = ({
  exam,
  currentIndex,
  totalQuestions,
  currentQuestion,
  currentAnswer,
  isCurrentFlagged,
  onToggleFlag,
  onUpdateAnswer,
  onPrev,
  onNext,
  onOpenSubmitConfirm,
}) => {
  const handleUpdate = (partial: Partial<StudentAnswer>) => {
    if (currentQuestion?.id) {
      onUpdateAnswer(currentQuestion.id, partial);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white">
      {/* Question Card */}
      <div className="space-y-6 max-w-2xl mx-auto w-full">
        {/* Question Header & Flag */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold font-mono border border-blue-100">
              سؤال {currentIndex + 1}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({currentQuestion?.conditions?.score || 1} {currentQuestion?.conditions?.score === 1 ? 'درجة' : 'درجات'})
            </span>
          </div>

          <button
            type="button"
            onClick={() => currentQuestion?.id && onToggleFlag(currentQuestion.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              isCurrentFlagged
                ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs'
                : 'text-slate-500 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{isCurrentFlagged ? 'مُميز للمراجعة' : 'تمييز للمراجعة'}</span>
          </button>
        </div>

        {/* Question Title & Description */}
        <div className="space-y-3">
          <div className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
            <KaTeXRenderer content={currentQuestion?.title || 'نص السؤال'} />
          </div>

          {currentQuestion?.description && (
            <div className="text-xs md:text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <KaTeXRenderer content={currentQuestion.description} />
            </div>
          )}

          {/* Optional Image */}
          {currentQuestion?.questionImage && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-72 flex items-center justify-center bg-slate-50 p-2">
              <img
                src={currentQuestion.questionImage}
                alt="Question attachment"
                className="max-h-72 object-contain rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Question Interactive Answers Area */}
        <div className="pt-2">
          {currentQuestion?.type === 'mcq' && (
            <McqQuestionInput
              question={currentQuestion}
              answer={currentAnswer}
              onUpdateAnswer={handleUpdate}
            />
          )}

          {currentQuestion?.type === 'true_false' && (
            <TrueFalseQuestionInput
              question={currentQuestion}
              answer={currentAnswer}
              onUpdateAnswer={handleUpdate}
            />
          )}

          {currentQuestion?.type === 'fill_blanks' && (
            <FillBlanksQuestionInput
              question={currentQuestion}
              answer={currentAnswer}
              onUpdateAnswer={handleUpdate}
            />
          )}

          {currentQuestion?.type === 'short_answer' && (
            <ShortAnswerQuestionInput
              question={currentQuestion}
              answer={currentAnswer}
              onUpdateAnswer={handleUpdate}
            />
          )}

          {currentQuestion?.type === 'matching' && (
            <MatchingQuestionInput
              question={currentQuestion}
              answer={currentAnswer}
              onUpdateAnswer={handleUpdate}
            />
          )}

          {currentQuestion?.type === 'image_answer' && (
            <ImageAnswerQuestionInput
              question={currentQuestion}
              answer={currentAnswer}
              onUpdateAnswer={handleUpdate}
            />
          )}
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4 max-w-2xl mx-auto w-full">
        {/* Prev Button */}
        <button
          type="button"
          disabled={currentIndex === 0 || exam?.settings?.basic?.linearNavigation}
          onClick={onPrev}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs md:text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>السابق</span>
        </button>

        {/* Next or Finish Button */}
        {currentIndex < totalQuestions - 1 ? (
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenSubmitConfirm}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>تسليم الاختبار</span>
          </button>
        )}
      </div>
    </div>
  );
};
