'use client';

import React from 'react';
import {
  ExamTakingModalProps,
  useExamTaking,
  ExamTakingEmptyState,
  ExamTakingPreviewBanner,
  ExamTakingHeader,
  ExamTakingProgressBar,
  ExamTakingQuestionView,
  ExamTakingResultView,
  ExamTakingNavGridModal,
  ExamTakingSubmitConfirmModal,
} from './ExamTaking';

export type { ExamTakingModalProps };

export const ExamTakingModal: React.FC<ExamTakingModalProps> = ({
  isOpen,
  onClose,
  exam,
  isPreviewMode = true,
}) => {
  const {
    questions,
    totalQuestions,
    currentIndex,
    setCurrentIndex,
    currentQuestion,
    currentAnswer,
    isCurrentFlagged,
    flaggedQuestionIds,
    toggleFlag,
    updateCurrentAnswer,
    isQuestionAnswered,
    answeredCount,
    progressPercent,
    isNavGridOpen,
    setIsNavGridOpen,
    isSubmitConfirmOpen,
    setIsSubmitConfirmOpen,
    isCompleted,
    resultSummary,
    secondsRemaining,
    timeLimitMinutes,
    formatTime,
    handleFinalSubmit,
    resetExam,
  } = useExamTaking(exam, isOpen);

  if (!isOpen) return null;

  if (totalQuestions === 0) {
    return <ExamTakingEmptyState onClose={onClose} />;
  }

  return (
    <div
      className="fixed inset-0 z-[65] flex flex-col bg-slate-100 font-sans select-none overflow-hidden text-slate-800"
      dir="rtl"
      style={{ colorScheme: 'light' }}
    >
      {/* Top Banner if in Preview Mode */}
      {isPreviewMode && <ExamTakingPreviewBanner onClose={onClose} />}

      {/* Main Container */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto bg-white shadow-2xl relative overflow-hidden my-0 sm:my-3 sm:rounded-3xl border border-slate-200">
        {/* Header Bar */}
        <ExamTakingHeader
          exam={exam}
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          progressPercent={progressPercent}
          timeLimitMinutes={timeLimitMinutes}
          secondsRemaining={secondsRemaining}
          isCompleted={isCompleted}
          formatTime={formatTime}
          onOpenNavGrid={() => setIsNavGridOpen(true)}
          onClose={onClose}
        />

        {/* Progress Line */}
        {!isCompleted && <ExamTakingProgressBar progressPercent={progressPercent} />}

        {/* Dynamic Content: Active Taking Mode vs Result Review Mode */}
        {!isCompleted ? (
          <ExamTakingQuestionView
            exam={exam}
            questions={questions}
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            currentQuestion={currentQuestion}
            currentAnswer={currentAnswer}
            isCurrentFlagged={isCurrentFlagged}
            onToggleFlag={toggleFlag}
            onUpdateAnswer={updateCurrentAnswer}
            onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            onOpenSubmitConfirm={() => setIsSubmitConfirmOpen(true)}
          />
        ) : (
          <ExamTakingResultView
            exam={exam}
            resultSummary={resultSummary}
            formatTime={formatTime}
            onResetExam={resetExam}
            onClose={onClose}
          />
        )}
      </div>

      {/* Questions Navigator Grid Sheet Modal */}
      <ExamTakingNavGridModal
        isOpen={isNavGridOpen}
        exam={exam}
        questions={questions}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        flaggedQuestionIds={flaggedQuestionIds}
        isQuestionAnswered={isQuestionAnswered}
        onSelectQuestion={(idx) => setCurrentIndex(idx)}
        onClose={() => setIsNavGridOpen(false)}
      />

      {/* Submit Confirmation Modal */}
      <ExamTakingSubmitConfirmModal
        isOpen={isSubmitConfirmOpen}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        onConfirmSubmit={handleFinalSubmit}
        onClose={() => setIsSubmitConfirmOpen(false)}
      />
    </div>
  );
};
