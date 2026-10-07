import { BankItemKind, QuestionType, Difficulty } from '@/types/bank';

/**
 * Bank Item Kind Metadata Configuration
 */
export interface BankItemKindMeta {
  kind: BankItemKind;
  label: string;
  pluralLabel: string;
  icon: string; // Lucide icon name or identifier
  description: string;
  colorClass: string;
  badgeClass: string;
}

export const BANK_ITEM_KINDS: Record<BankItemKind, BankItemKindMeta> = {
  lesson: {
    kind: 'lesson',
    label: 'درس',
    pluralLabel: 'دروس',
    icon: 'BookOpen',
    description: 'شروحات ومستندات وملفات PDF',
    colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  video: {
    kind: 'video',
    label: 'فيديو',
    pluralLabel: 'فيديوهات',
    icon: 'Video',
    description: 'فيديوهات مسجلة وروابط وسائط',
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  question: {
    kind: 'question',
    label: 'سؤال',
    pluralLabel: 'أسئلة',
    icon: 'HelpCircle',
    description: 'أسئلة وتمارين للاختبارات والواجبات',
    colorClass: 'text-purple-600 bg-purple-50 border-purple-200',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};

export const BANK_ITEM_KINDS_LIST: BankItemKindMeta[] = Object.values(BANK_ITEM_KINDS);

/**
 * Question Type Metadata Configuration (Arabic Labels)
 */
export interface QuestionTypeMeta {
  type: QuestionType;
  label: string;
  icon: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  colorClass: string;
}

export const QUESTION_TYPES: Record<QuestionType, QuestionTypeMeta> = {
  mcq: {
    type: 'mcq',
    label: 'اختيار من متعدد',
    icon: 'CheckCircle2',
    description: 'سؤال باختيار إجابة واحدة صحيحة من عدة خيارات',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-700',
    colorClass: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  multi: {
    type: 'multi',
    label: 'اختيارات متعددة',
    icon: 'ListChecks',
    description: 'سؤال يسمح بتحديد أكثر من إجابة صحيحة',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  tf: {
    type: 'tf',
    label: 'صح / خطأ',
    icon: 'CheckCheck',
    description: 'تحديد صحة أو خطأ العبارة المطروحة',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  short: {
    type: 'short',
    label: 'إجابة قصيرة',
    icon: 'AlignLeft',
    description: 'إدخال نص أو كلمة محددة كإجابة',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    colorClass: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  fill: {
    type: 'fill',
    label: 'إملأ الفراغ',
    icon: 'FormInput',
    description: 'إكمال الفراغات المفقودة داخل الجملة أو النص',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-700',
    colorClass: 'text-teal-600 bg-teal-50 border-teal-200',
  },
  numeric: {
    type: 'numeric',
    label: 'إجابة رقمية',
    icon: 'Binary',
    description: 'قيمة حسابية عددية مع تحديد نسبة الخطأ المقبولة',
    badgeBg: 'bg-cyan-100',
    badgeText: 'text-cyan-700',
    colorClass: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  },
  matching: {
    type: 'matching',
    label: 'مطابقة وتوصيل',
    icon: 'ArrowLeftRight',
    description: 'توصيل ومطابقة العناصر بين قائمتين متقابلتين',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
    colorClass: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  essay: {
    type: 'essay',
    label: 'مقال / نص طويل',
    icon: 'FileText',
    description: 'إجابة إنشائية أو مقالية تتطلب تقييماً يدوياً',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-700',
    colorClass: 'text-violet-600 bg-violet-50 border-violet-200',
  },
};

export const QUESTION_TYPES_LIST: QuestionTypeMeta[] = Object.values(QUESTION_TYPES);

/**
 * Question Difficulty Metadata Configuration
 */
export interface DifficultyMeta {
  key: Difficulty;
  label: string;
  badgeClass: string;
  dotColor: string;
}

export const DIFFICULTY_LEVELS: Record<Difficulty, DifficultyMeta> = {
  '': {
    key: '',
    label: 'جميع المستويات',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    dotColor: 'bg-gray-400',
  },
  easy: {
    key: 'easy',
    label: 'سهل',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  mid: {
    key: 'mid',
    label: 'متوسط',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  hard: {
    key: 'hard',
    label: 'صعب',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotColor: 'bg-rose-500',
  },
};

export const DIFFICULTY_LEVELS_LIST: DifficultyMeta[] = Object.values(DIFFICULTY_LEVELS);

/**
 * Curated Library Color Palette (Hex Codes)
 */
export const LIBRARY_PALETTE = [
  '#6366F1', // Indigo
  '#3B82F6', // Blue
  '#0EA5E9', // Sky
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#F97316', // Orange
  '#EF4444', // Red
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#64748B', // Slate
];

/**
 * Helper to get metadata for any question type safely
 */
export const getQuestionTypeMeta = (type: QuestionType): QuestionTypeMeta => {
  return QUESTION_TYPES[type] || QUESTION_TYPES.mcq;
};

/**
 * Helper to get metadata for any bank item kind safely
 */
export const getBankItemKindMeta = (kind: BankItemKind): BankItemKindMeta => {
  return BANK_ITEM_KINDS[kind] || BANK_ITEM_KINDS.lesson;
};

/**
 * Helper to get difficulty metadata safely
 */
export const getDifficultyMeta = (difficulty?: Difficulty): DifficultyMeta => {
  return DIFFICULTY_LEVELS[difficulty || ''] || DIFFICULTY_LEVELS[''];
};

/**
 * Helper to pluralize Arabic item count accurately (e.g. عنصر واحد, عنصران, 5 عناصر, 12 عنصراً)
 */
export const formatItemCountArabic = (count: number): string => {
  if (count === 1) return 'عنصر واحد';
  if (count === 2) return 'عنصران';
  if (count >= 3 && count <= 10) return `${count} عناصر`;
  return `${count} عنصراً`;
};

/**
 * Helper to format selected items count with Arabic grammar (e.g. عنصر محدد, عنصران محددان, 5 عناصر محددة)
 */
export const formatSelectedCountArabic = (count: number): string => {
  if (count === 1) return 'عنصر واحد محدد';
  if (count === 2) return 'عنصران محددان';
  if (count >= 3 && count <= 10) return `${count} عناصر محددة`;
  return `${count} عنصراً محدداً`;
};
