import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ExamPayload,
  ExamQuestion,
  StudentAnswer,
  ExamResultSummary,
  QuestionReviewItem,
} from '@/types/academic/exam.types';

export function useExamTaking(exam: ExamPayload, isOpen: boolean) {
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

  // Format Timer
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

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

  // Flag toggle
  const toggleFlag = useCallback((qId: string) => {
    if (!qId) return;
    setFlaggedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  }, []);

  // Update answer for current question
  const updateCurrentAnswer = useCallback((questionId: string, partial: Partial<StudentAnswer>) => {
    if (!questionId) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        ...partial,
      },
    }));
  }, []);

  // Checking if a question is answered
  const isQuestionAnswered = useCallback((q: ExamQuestion): boolean => {
    if (!q || !q.id) return false;
    const ans = answers[q.id];
    if (!ans) return false;
    if (q.type === 'mcq') return (ans.selectedOptionIds?.length || 0) > 0;
    if (q.type === 'true_false') return ans.trueFalseValue !== undefined;
    if (q.type === 'fill_blanks') return Array.isArray(ans.blanksAnswers) && ans.blanksAnswers.some((b) => typeof b === 'string' && b.trim() !== '');
    if (q.type === 'short_answer' || q.type === 'image_answer') return typeof ans.textAnswer === 'string' && Boolean(ans.textAnswer.trim());
    if (q.type === 'matching') return Boolean(ans.matchingPairs && Object.keys(ans.matchingPairs).length > 0);
    return false;
  }, [answers]);

  const answeredCount = useMemo(() => {
    return questions.filter(isQuestionAnswered).length;
  }, [questions, isQuestionAnswered]);

  const progressPercent = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((answeredCount / totalQuestions) * 100);
  }, [answeredCount, totalQuestions]);

  // Submit Evaluation Logic
  const evaluateExam = useCallback((): ExamResultSummary => {
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
        const shortStudentStr = (typeof studentText === 'string' ? studentText : '').trim().toLowerCase();
        if (sampleStr && shortStudentStr.includes(sampleStr)) {
          isCorrect = true;
        } else if (shortStudentStr.length > 3) {
          isCorrect = true;
        }
      } else if (q.type === 'image_answer') {
        const expected = q.imageExpectedAnswer || '';
        const studentText = ans.textAnswer || '';
        const expectedStr = (typeof expected === 'string' ? expected : '').trim().toLowerCase();
        const imgStudentStr = (typeof studentText === 'string' ? studentText : '').trim().toLowerCase();
        if (expectedStr === imgStudentStr && expectedStr !== '') {
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
  }, [questions, answers, totalQuestions, answeredCount, exam, timeSpentSeconds]);

  const handleFinalSubmit = useCallback(() => {
    const summary = evaluateExam();
    setResultSummary(summary);
    setIsSubmitConfirmOpen(false);
    setIsCompleted(true);
  }, [evaluateExam]);

  const handleAutoSubmit = useCallback(() => {
    const summary = evaluateExam();
    setResultSummary(summary);
    setIsSubmitConfirmOpen(false);
    setIsCompleted(true);
  }, [evaluateExam]);

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
  }, [isOpen, isCompleted, timeLimitMinutes, handleAutoSubmit]);

  const resetExam = useCallback(() => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setAnswers({});
    setSecondsRemaining((exam?.settings?.basic?.timeLimit || 0) * 60);
    setTimeSpentSeconds(0);
  }, [exam]);

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentAnswer = currentQuestion?.id
    ? (answers[currentQuestion.id] || { questionId: currentQuestion.id })
    : { questionId: '' };
  const isCurrentFlagged = currentQuestion?.id ? flaggedQuestionIds.has(currentQuestion.id) : false;

  return {
    questions,
    totalQuestions,
    currentIndex,
    setCurrentIndex,
    answers,
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
    setIsCompleted,
    resultSummary,
    secondsRemaining,
    timeSpentSeconds,
    timeLimitMinutes,
    formatTime,
    handleFinalSubmit,
    resetExam,
  };
}
