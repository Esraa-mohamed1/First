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
