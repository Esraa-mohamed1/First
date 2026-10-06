export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'fill_blanks'
  | 'short_answer'
  | 'matching'
  | 'image_answer';

export interface QuestionTypeMeta {
  type: QuestionType;
  label: string;
  iconName: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
}

export interface McqOption {
  id: string;
  letter: string; // 'A', 'B', 'C', 'D', etc.
  text: string;
  image_url?: string;
  is_correct: boolean;
}

export interface MatchingPair {
  id: string;
  prompt: string;
  target: string;
  image_url?: string;
}

export interface QuestionConditions {
  multipleCorrectAnswer?: boolean;
  isRequired?: boolean;
  randomizeChoice?: boolean;
  imageMatching?: boolean;
  score: number;
  showScore?: boolean;
}

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  explanation?: string;
  conditions: QuestionConditions;
  bankRef?: string | number; // Optional reference to source content bank question ID (backend persistence UNVERIFIED)
  
  
  // MCQ specific
  options?: McqOption[];
  
  // True / False specific
  trueFalseValue?: boolean;
  
  // Fill in the blanks specific
  blanksTemplate?: string; // Text containing {dash}
  blanksAnswers?: string[];
  
  // Short answer specific
  sampleAnswer?: string;
  
  // Matching specific
  matchingPairs?: MatchingPair[];
  
  // Image answer specific
  questionImage?: string;
  imageExpectedAnswer?: string;
}

export interface ExamBasicSettings {
  timeLimit: number;
  timeUnit: 'minutes' | 'hours';
  hideTimer: boolean;
  feedbackMode: 'retake' | 'immediate' | 'after_submit' | 'none';
  allowedAttempts: number;
  passingScorePercentage: number;
  maxQuestionsToAnswer: number;
  
  // Extra Darab settings
  showSolutionOnSubmit?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  linearNavigation?: boolean; // If true, student cannot go back to previous questions
  enableCertificate?: boolean;
  instructions?: string;
  completionMessage?: string;
  scheduleStart?: string;
  scheduleEnd?: string;
}

export interface ExamAdvancedSettings {
  autoStart: boolean;
  questionLayout: 'single' | 'all';
  questionOrder: 'random' | 'fixed';
  hideQuestionNumber: boolean;
  shortAnswerCharLimit: number;
  essayCharLimit: number;
}

export interface ExamSettings {
  basic: ExamBasicSettings;
  advanced: ExamAdvancedSettings;
}

export interface ExamPayload {
  id?: number;
  course_id?: number;
  chapter_id: number;
  unit_id?: number;
  title: string;
  description?: string;
  type: 'quiz';
  questions: ExamQuestion[];
  settings: ExamSettings;
  is_free?: boolean | number;
}

// Student Taking & Attempt types
export interface StudentAnswer {
  questionId: string;
  selectedOptionIds?: string[];
  trueFalseValue?: boolean;
  blanksAnswers?: string[];
  textAnswer?: string;
  matchingPairs?: Record<string, string>; // promptId -> target
}

export interface QuestionReviewItem {
  question: ExamQuestion;
  studentAnswer: StudentAnswer;
  isCorrect: boolean;
  earnedScore: number;
  maxScore: number;
}

export interface ExamResultSummary {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  totalEarnedScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  isPassed: boolean;
  timeSpentSeconds: number;
  reviews: QuestionReviewItem[];
}
