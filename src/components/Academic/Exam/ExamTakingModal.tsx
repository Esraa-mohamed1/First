'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Flag,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  Send,
  RotateCcw,
  Award,
  BookOpen,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ExamPayload,
  ExamQuestion,
  StudentAnswer,
  ExamResultSummary,
  QuestionReviewItem,
} from '@/types/academic/exam.types';
import { KaTeXRenderer } from './KaTeXRenderer';

interface ExamTakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamPayload;
  isPreviewMode?: boolean;
}

export const ExamTakingModal: React.FC<ExamTakingModalProps> = ({
  isOpen,
  onClose,
  exam,
  isPreviewMode = true,
}) => {
  // Questions list (filtered or randomized depending on settings)
  const questions: ExamQuestion[] = useMemo(() => {
    if (!exam || !Array.isArray(exam.questions)) return [];
    let qList = [...exam.questions];
    if (exam.settings?.basic?.shuffleQuestions) {
      qList = qList.sort(() => Math.random() - 0.5);
    }
    return qList;
  }, [exam]);

  const totalQuestions = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<string>>(new Set());
  const [isNavGridOpen, setIsNavGridOpen] = useState(false);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultSummary, setResultSummary] = useState<ExamResultSummary | null>(null);

  // Timer state
  const timeLimitMinutes = exam?.settings?.basic?.timeLimit || 0;
  const [secondsRemaining, setSecondsRemaining] = useState(timeLimitMinutes * 60);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // Initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setAnswers({});
      setFlaggedQuestionIds(new Set());
      setIsNavGridOpen(false);
      setIsSubmitConfirmOpen(false);
      setIsCompleted(false);
      setResultSummary(null);
      const totalSecs = (exam?.settings?.basic?.timeLimit || 0) * 60;
      setSecondsRemaining(totalSecs);
      setTimeSpentSeconds(0);
    }
  }, [isOpen, exam]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);

      if (timeLimitMinutes > 0) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isCompleted, timeLimitMinutes]);

  if (!isOpen) return null;

  if (totalQuestions === 0) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" dir="rtl">
        <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-xl border border-slate-200">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            لا توجد أسئلة مضافة بعد
          </h3>
          <p className="text-sm text-slate-500">
            يرجى إضافة أسئلة للاختبار أولاً لكي تتمكن من معاينته أو تشغيله.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentAnswer = currentQuestion?.id ? (answers[currentQuestion.id] || { questionId: currentQuestion.id }) : { questionId: '' };
  const isCurrentFlagged = currentQuestion?.id ? flaggedQuestionIds.has(currentQuestion.id) : false;

  // Format Timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Flag toggle
  const toggleFlag = (qId: string) => {
    if (!qId) return;
    setFlaggedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Update answer for current question
  const updateCurrentAnswer = (partial: Partial<StudentAnswer>) => {
    if (!currentQuestion?.id) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        questionId: currentQuestion.id,
        ...partial,
      },
    }));
  };

  // Checking if a question is answered
  const isQuestionAnswered = (q: ExamQuestion): boolean => {
    if (!q || !q.id) return false;
    const ans = answers[q.id];
    if (!ans) return false;
    if (q.type === 'mcq') return (ans.selectedOptionIds?.length || 0) > 0;
    if (q.type === 'true_false') return ans.trueFalseValue !== undefined;
    if (q.type === 'fill_blanks') return Array.isArray(ans.blanksAnswers) && ans.blanksAnswers.some((b) => typeof b === 'string' && b.trim() !== '');
    if (q.type === 'short_answer' || q.type === 'image_answer') return typeof ans.textAnswer === 'string' && Boolean(ans.textAnswer.trim());
    if (q.type === 'matching') return Boolean(ans.matchingPairs && Object.keys(ans.matchingPairs).length > 0);
    return false;
  };

  const answeredCount = questions.filter(isQuestionAnswered).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Submit Evaluation Logic
  const evaluateExam = (): ExamResultSummary => {
    let totalEarnedScore = 0;
    let maxPossibleScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    const reviews: QuestionReviewItem[] = questions.map((q) => {
      const ans = answers[q.id] || { questionId: q.id };
      const qScore = q.conditions?.score || 1;
      maxPossibleScore += qScore;

      let isCorrect = false;

      if (q.type === 'mcq') {
        const correctIds = q.options?.filter((o) => o.is_correct).map((o) => o.id) || [];
        const studentIds = ans.selectedOptionIds || [];
        if (
          correctIds.length > 0 &&
          correctIds.length === studentIds.length &&
          correctIds.every((id) => studentIds.includes(id))
        ) {
          isCorrect = true;
        }
      } else if (q.type === 'true_false') {
        if (ans.trueFalseValue !== undefined && ans.trueFalseValue === q.trueFalseValue) {
          isCorrect = true;
        }
      } else if (q.type === 'fill_blanks') {
        const expected = q.blanksAnswers || [];
        const studentBlanks = ans.blanksAnswers || [];
        if (
          expected.length > 0 &&
          expected.every((exp, idx) => (typeof exp === 'string' ? exp : '').trim().toLowerCase() === (typeof studentBlanks[idx] === 'string' ? studentBlanks[idx] : '').trim().toLowerCase())
        ) {
          isCorrect = true;
        }
      } else if (q.type === 'short_answer') {
        const sample = q.sampleAnswer || '';
        const studentText = ans.textAnswer || '';
        const sampleStr = (typeof sample === 'string' ? sample : '').trim().toLowerCase();
        const studentStr = (typeof studentText === 'string' ? studentText : '').trim().toLowerCase();
        if (sampleStr && studentStr.includes(sampleStr)) {
          isCorrect = true;
        } else if (studentStr.length > 3) {
          // Model approval in preview
          isCorrect = true;
        }
      } else if (q.type === 'image_answer') {
        const expected = q.imageExpectedAnswer || '';
        const studentText = ans.textAnswer || '';
        const expectedStr = (typeof expected === 'string' ? expected : '').trim().toLowerCase();
        const studentStr = (typeof studentText === 'string' ? studentText : '').trim().toLowerCase();
        if (expectedStr === studentStr && expectedStr !== '') {
          isCorrect = true;
        }
      } else if (q.type === 'matching') {
        const pairs = q.matchingPairs || [];
        const studentPairs = ans.matchingPairs || {};
        if (
          pairs.length > 0 &&
          pairs.every((p) => studentPairs[p.id] === p.target)
        ) {
          isCorrect = true;
        }
      }

      const earnedScore = isCorrect ? qScore : 0;
      if (isCorrect) correctCount++;
      else incorrectCount++;
      totalEarnedScore += earnedScore;

      return {
        question: q,
        studentAnswer: ans,
        isCorrect,
        earnedScore,
        maxScore: qScore,
      };
    });

    const percentageScore = maxPossibleScore > 0 ? Math.round((totalEarnedScore / maxPossibleScore) * 100) : 0;
    const passThreshold = exam.settings?.basic?.passingScorePercentage || 60;
    const isPassed = percentageScore >= passThreshold;

    return {
      totalQuestions,
      answeredCount,
      correctCount,
      incorrectCount,
      totalEarnedScore,
      maxPossibleScore,
      percentageScore,
      isPassed,
      timeSpentSeconds,
      reviews,
    };
  };

  const handleFinalSubmit = () => {
    const summary = evaluateExam();
    setResultSummary(summary);
    setIsSubmitConfirmOpen(false);
    setIsCompleted(true);
  };

  const handleAutoSubmit = () => {
    const summary = evaluateExam();
    setResultSummary(summary);
    setIsSubmitConfirmOpen(false);
    setIsCompleted(true);
  };

  return (
    <div className="fixed inset-0 z-[65] flex flex-col bg-slate-100 font-sans select-none overflow-hidden text-slate-800" dir="rtl" style={{ colorScheme: 'light' }}>
      {/* Top Banner if in Preview Mode */}
      {isPreviewMode && (
        <div className="bg-amber-500 text-white text-xs font-semibold py-1.5 px-4 flex items-center justify-between shadow-xs z-30 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>وضع المعاينة الحية للاختبار — يمكنك تجربة خوض الاختبار وتفقد الإجابات وحساب الدرجات كما يراها الطالب تماماً</span>
          </div>
          <button
            onClick={onClose}
            className="hover:underline text-[11px] bg-amber-600 hover:bg-amber-700 px-2.5 py-1 rounded-lg font-bold transition"
          >
            إغلاق المعاينة
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto bg-white shadow-2xl relative overflow-hidden my-0 sm:my-3 sm:rounded-3xl border border-slate-200">
        {/* Header Bar */}
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
                onClick={() => setIsNavGridOpen(true)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
                title="شبكة الأسئلة"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">الأسئلة</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="خروج"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Line */}
        {!isCompleted && (
          <div className="w-full h-1.5 bg-slate-100 overflow-hidden shrink-0">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Dynamic Content: Active Taking Mode vs Result Review Mode */}
        {!isCompleted ? (
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
                  onClick={() => currentQuestion?.id && toggleFlag(currentQuestion.id)}
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
                {/* MCQ Mode */}
                {currentQuestion?.type === 'mcq' && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option) => {
                      const isMultiple = currentQuestion.conditions?.multipleCorrectAnswer;
                      const isSelected = isMultiple
                        ? currentAnswer.selectedOptionIds?.includes(option.id)
                        : currentAnswer.selectedOptionIds?.[0] === option.id;

                      const handleSelect = () => {
                        if (isMultiple) {
                          const currentSelected = currentAnswer.selectedOptionIds || [];
                          const updated = isSelected
                            ? currentSelected.filter((id) => id !== option.id)
                            : [...currentSelected, option.id];
                          updateCurrentAnswer({ selectedOptionIds: updated });
                        } else {
                          updateCurrentAnswer({ selectedOptionIds: [option.id] });
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
                )}

                {/* True / False Mode */}
                {currentQuestion?.type === 'true_false' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateCurrentAnswer({ trueFalseValue: true })}
                      className={`p-6 rounded-2xl border text-center font-bold text-base md:text-lg transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                        currentAnswer.trueFalseValue === true
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      <span>صحيح (صح)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateCurrentAnswer({ trueFalseValue: false })}
                      className={`p-6 rounded-2xl border text-center font-bold text-base md:text-lg transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                        currentAnswer.trueFalseValue === false
                          ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <XCircle className="w-8 h-8 text-rose-500" />
                      <span>غير صحيح (خطأ)</span>
                    </button>
                  </div>
                )}

                {/* Fill Blanks Mode */}
                {currentQuestion?.type === 'fill_blanks' && (
                  <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-600 mb-2">
                      املأ الفراغات بالكلمات أو الإجابات المناسبة:
                    </p>
                    <div className="leading-loose text-base text-slate-800 flex flex-wrap items-center gap-2 font-medium">
                      {(currentQuestion.blanksTemplate || currentQuestion.title)
                        ?.split('{dash}')
                        .map((segment, idx, arr) => {
                          const currentBlanks = currentAnswer.blanksAnswers || [];
                          return (
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
                                    updateCurrentAnswer({ blanksAnswers: nextBlanks });
                                  }}
                                  className="w-36 px-3 py-1.5 text-center font-bold rounded-xl border border-blue-400 bg-white text-blue-700 outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-2xs"
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Short Answer / Essay Mode */}
                {currentQuestion?.type === 'short_answer' && (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      placeholder="اكتب إجابتك هنا بوضوح..."
                      value={currentAnswer.textAnswer || ''}
                      onChange={(e) => updateCurrentAnswer({ textAnswer: e.target.value })}
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-800 text-xs md:text-sm font-bold outline-none focus:border-blue-500 transition resize-none leading-relaxed shadow-2xs"
                    />
                    <div className="text-left text-xs text-slate-400 font-mono">
                      {(currentAnswer.textAnswer || '').length} حرف
                    </div>
                  </div>
                )}

                {/* Matching Mode */}
                {currentQuestion?.type === 'matching' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-600 mb-2">
                      اختر المقابل الصحيح لكل عنصر:
                    </p>
                    {currentQuestion.matchingPairs?.map((pair) => (
                      <div
                        key={pair.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white gap-4 shadow-2xs"
                      >
                        <span className="font-bold text-sm text-slate-800 flex-1">
                          {pair.prompt}
                        </span>
                        <select
                          value={currentAnswer.matchingPairs?.[pair.id] || ''}
                          onChange={(e) => {
                            const updatedPairs = {
                              ...(currentAnswer.matchingPairs || {}),
                              [pair.id]: e.target.value,
                            };
                            updateCurrentAnswer({ matchingPairs: updatedPairs });
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs md:text-sm outline-none focus:border-blue-500"
                        >
                          <option value="">-- اختر المطابق --</option>
                          {currentQuestion.matchingPairs?.map((targetOption) => (
                            <option key={targetOption.id} value={targetOption.target}>
                              {targetOption.target}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                {/* Image Answer Mode */}
                {currentQuestion?.type === 'image_answer' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="اكتب الإجابة الظاهرة في الصورة..."
                      value={currentAnswer.textAnswer || ''}
                      onChange={(e) => updateCurrentAnswer({ textAnswer: e.target.value })}
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-800 text-xs md:text-sm font-bold outline-none focus:border-blue-500 transition shadow-2xs"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4 max-w-2xl mx-auto w-full">
              {/* Prev Button */}
              <button
                type="button"
                disabled={currentIndex === 0 || exam?.settings?.basic?.linearNavigation}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs md:text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              {/* Next or Finish Button */}
              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmitConfirmOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>تسليم الاختبار</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ================= Results & Review Mode ================= */
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
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentIndex(0);
                  setAnswers({});
                  setSecondsRemaining((exam?.settings?.basic?.timeLimit || 0) * 60);
                  setTimeSpentSeconds(0);
                }}
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
        )}
      </div>

      {/* Questions Navigator Grid Sheet Modal */}
      {isNavGridOpen && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
                <span>خريطة الأسئلة ({totalQuestions})</span>
              </h3>
              <button
                onClick={() => setIsNavGridOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-1 pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> تم الإجابة
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> مميز للمراجعة
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded border border-slate-300 inline-block" /> لم يجب
              </span>
            </div>

            {/* Grid Pills */}
            <div className="grid grid-cols-5 gap-2.5 max-h-60 overflow-y-auto p-1 custom-scrollbar">
              {questions.map((q, idx) => {
                const isAnswered = isQuestionAnswered(q);
                const isFlagged = flaggedQuestionIds.has(q.id);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      if (exam?.settings?.basic?.linearNavigation && idx > currentIndex) {
                        return;
                      }
                      setCurrentIndex(idx);
                      setIsNavGridOpen(false);
                    }}
                    className={`h-11 rounded-xl font-mono font-bold text-sm transition relative flex items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-blue-500 ring-offset-2 font-extrabold'
                        : ''
                    } ${
                      isFlagged
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : isAnswered
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsNavGridOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
            >
              العودة للاختبار
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {isSubmitConfirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Send className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                هل أنت متأكد من تسليم الاختبار؟
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                لقد قمت بالإجابة على {answeredCount} من أصل {totalQuestions} سؤال.
              </p>
            </div>

            {answeredCount < totalQuestions && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs text-right flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>لديك {totalQuestions - answeredCount} أسئلة لم تقم بالإجابة عليها بعد.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitConfirmOpen(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                العودة للأسئلة
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
              >
                تأكيد وتسليم الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
