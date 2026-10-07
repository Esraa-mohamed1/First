/**
 * Content Bank Core Type Definitions
 *
 * Types for libraries, bank items (lessons, videos, questions),
 * question models, filtering, and API payloads.
 */

export type BankItemKind = 'lesson' | 'video' | 'question';

export type QuestionType =
  | 'mcq'
  | 'multi'
  | 'tf'
  | 'short'
  | 'fill'
  | 'numeric'
  | 'matching'
  | 'essay';

export type Difficulty = '' | 'easy' | 'mid' | 'hard';

/**
 * Option structure for MCQ and Multi-choice questions
 */
export interface QuestionOption {
  id: string;
  letter?: string; // 'A', 'B', 'C', 'D' / 'أ', 'ب', 'ج', 'د'
  text: string;
  isCorrect?: boolean;
  imageUrl?: string;
}

/**
 * Pair structure for Matching questions
 */
export interface MatchingPair {
  id: string;
  left: string;
  right: string;
  leftImage?: string;
  rightImage?: string;
}

/**
 * Generic Question entity across question types
 */
export interface Question {
  id: string | number;
  type: QuestionType;
  text: string;
  marks: number;
  difficulty?: Difficulty;
  tags?: string[];
  explanation?: string;

  // Type-specific optional fields
  options?: QuestionOption[]; // MCQ, multi
  correct?: string | string[] | boolean | number; // Correct answer(s) representation
  pairs?: MatchingPair[]; // Matching
  value?: number; // Numeric target value
  tol?: number; // Numeric tolerance (+/-)
  unit?: string; // Numeric unit (e.g., 'm/s', 'kg', '%')

  // Additional rich question attributes
  keepOrder?: boolean; // Preserve choice order (e.g. for "all of the above")
  blanksTemplate?: string; // Fill-in-the-blanks template containing placeholders like {dash} or {1}
  sampleAnswer?: string; // Short answer / Essay reference answer or grading rubric
  rubric?: string; // Essay grading guide
}

/**
 * Content Library Entity (container / folder for bank items)
 */
export interface Library {
  id: string | number;
  name: string;
  description?: string;
  color: string;
  updatedAt: string;
  createdAt?: string;
  itemCounts?: {
    lesson?: number;
    video?: number;
    question?: number;
    total?: number;
  };
}

/**
 * Base properties shared across all bank items
 */
export interface BaseBankItem {
  id: string | number;
  libraryId: string | number;
  unit?: string;
  usageCount: number;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}

/**
 * Lesson Bank Item
 */
export interface LessonBankItem extends BaseBankItem {
  kind: 'lesson';
  title: string;
  content?: string;
  pdfUrl?: string;
}

/**
 * Video Bank Item
 */
export interface VideoBankItem extends BaseBankItem {
  kind: 'video';
  title: string;
  source: 'upload' | 'library' | 'url';
  url?: string;
  duration?: number; // In seconds
}

/**
 * Question Bank Item
 */
export interface QuestionBankItem extends BaseBankItem {
  kind: 'question';
  question: Question;
}

/**
 * Discriminated union of all bank item types
 */
export type BankItem = LessonBankItem | VideoBankItem | QuestionBankItem;

/**
 * Query parameters for fetching bank items
 */
export interface GetBankItemsParams {
  libraryId?: string | number | 'all';
  kind?: BankItemKind | 'all';
  difficulty?: Difficulty | 'all';
  q?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

/**
 * Paginated response structure for bank items
 */
export interface PaginatedBankItemsResponse {
  items: BankItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Payload to create a new Library
 */
export interface CreateLibraryPayload {
  name: string;
  description?: string;
  color?: string;
}

/**
 * Payload to update an existing Library
 */
export interface UpdateLibraryPayload {
  name?: string;
  description?: string;
  color?: string;
}

/**
 * Payload for creating a bank item (lesson, video, or question)
 */
export type CreateBankItemPayload =
  | {
      kind: 'lesson';
      libraryId: string | number;
      title: string;
      unit?: string;
      content?: string;
      pdfUrl?: string;
      tags?: string[];
    }
  | {
      kind: 'video';
      libraryId: string | number;
      title: string;
      unit?: string;
      source: 'upload' | 'library' | 'url';
      url?: string;
      duration?: number;
      tags?: string[];
    }
  | {
      kind: 'question';
      libraryId: string | number;
      unit?: string;
      question: Omit<Question, 'id'> & { id?: string | number };
      tags?: string[];
    };

/**
 * Payload for updating a bank item
 */
export type UpdateBankItemPayload = Partial<CreateBankItemPayload>;

/**
 * Payload for batch actions
 */
export interface BatchDeletePayload {
  ids: (string | number)[];
}

export interface BatchDuplicatePayload {
  ids: (string | number)[];
  targetLibraryId?: string | number;
}

export interface BatchMovePayload {
  ids: (string | number)[];
  libraryId: string | number;
}
