import { QuestionType, QuestionTypeMeta } from '@/types/academic/exam.types';

export const QUESTION_TYPES: QuestionTypeMeta[] = [
  {
    type: 'true_false',
    label: 'صح / خطأ',
    iconName: 'swap_horiz',
    colorClass: 'text-blue-600 bg-blue-50 border-blue-200',
    badgeBg: 'bg-blue-500 text-white',
    badgeText: 'صح/خطأ',
  },
  {
    type: 'mcq',
    label: 'خيارات متعددة',
    iconName: 'checklist',
    colorClass: 'text-purple-600 bg-purple-50 border-purple-200',
    badgeBg: 'bg-purple-600 text-white',
    badgeText: 'خيارات متعددة',
  },
  {
    type: 'fill_blanks',
    label: 'املأ الفراغات',
    iconName: 'hourglass_top',
    colorClass: 'text-amber-600 bg-amber-50 border-amber-200',
    badgeBg: 'bg-amber-500 text-white',
    badgeText: 'املأ الفراغات',
  },
  {
    type: 'short_answer',
    label: 'اجابة قصيرة',
    iconName: 'format_align_left',
    colorClass: 'text-rose-600 bg-rose-50 border-rose-200',
    badgeBg: 'bg-rose-500 text-white',
    badgeText: 'اجابة قصيرة',
  },
  {
    type: 'matching',
    label: 'مطابقة',
    iconName: 'forum',
    colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    badgeBg: 'bg-emerald-500 text-white',
    badgeText: 'مطابقة',
  },
  {
    type: 'image_answer',
    label: 'اجابة بصورة',
    iconName: 'photo_camera',
    colorClass: 'text-lime-700 bg-lime-50 border-lime-200',
    badgeBg: 'bg-lime-500 text-white',
    badgeText: 'اجابة بصورة',
  },
];

export const getQuestionTypeMeta = (type: QuestionType): QuestionTypeMeta => {
  return QUESTION_TYPES.find((q) => q.type === type) || QUESTION_TYPES[1];
};

export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const OPTION_BADGES = ['Ⓐ', 'Ⓑ', 'Ⓒ', 'Ⓓ', 'Ⓔ', 'Ⓕ', 'Ⓖ', 'Ⓗ'];
