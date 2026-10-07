import { ExamPayload, ExamQuestion, StudentAnswer, ExamResultSummary } from '@/types/academic/exam.types';

export interface ExamTakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamPayload;
  isPreviewMode?: boolean;
}

export interface QuestionInputProps {
  question: ExamQuestion;
  answer: StudentAnswer;
  onUpdateAnswer: (partial: Partial<StudentAnswer>) => void;
}
