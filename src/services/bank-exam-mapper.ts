import { Question } from '@/types/bank';
import { ExamQuestion, McqOption, MatchingPair } from '@/types/academic/exam.types';

const ARABIC_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];

export type MapResult =
  | { ok: true; question: ExamQuestion }
  | { ok: false; reason: string };

export type ReverseMapResult =
  | { ok: true; question: Omit<Question, 'id'> }
  | { ok: false; reason: string };

/**
 * Checks if a Content Bank question is supported in Exams
 */
export function isBankQuestionSupportedInExams(q: Question): boolean {
  if (q.type === 'numeric' || q.type === 'essay') {
    return false;
  }
  const result = mapBankQuestionToExamQuestion(q);
  return result.ok;
}

/**
 * Maps a canonical Content Bank Question into an ExamQuestion for the exam builder/player
 */
export function mapBankQuestionToExamQuestion(q: Question): MapResult {
  const commonConditions = {
    score: q.marks || 2,
    isRequired: true,
    multipleCorrectAnswer: false,
  };

  switch (q.type) {
    case 'mcq': {
      const options: McqOption[] = (q.options || []).map((opt, idx) => ({
        id: opt.id || String(idx + 1),
        letter: opt.letter || ARABIC_LETTERS[idx] || String(idx + 1),
        text: opt.text || '',
        image_url: opt.imageUrl || undefined,
        is_correct: Boolean(
          opt.isCorrect || (typeof q.correct === 'string' && q.correct === opt.id)
        ),
      }));

      const randomizeChoice =
        q.keepOrder !== undefined ? !q.keepOrder : undefined;

      return {
        ok: true,
        question: {
          id: String(q.id),
          type: 'mcq',
          title: q.text,
          explanation: q.explanation || '',
          conditions: {
            ...commonConditions,
            multipleCorrectAnswer: false,
            ...(randomizeChoice !== undefined ? { randomizeChoice } : {}),
          },
          options,
          bankRef: q.id,
        },
      };
    }

    case 'multi': {
      const correctIds = Array.isArray(q.correct) ? q.correct.map(String) : [];
      const options: McqOption[] = (q.options || []).map((opt, idx) => ({
        id: opt.id || String(idx + 1),
        letter: opt.letter || ARABIC_LETTERS[idx] || String(idx + 1),
        text: opt.text || '',
        image_url: opt.imageUrl || undefined,
        is_correct: Boolean(opt.isCorrect || correctIds.includes(String(opt.id))),
      }));

      const randomizeChoice =
        q.keepOrder !== undefined ? !q.keepOrder : undefined;

      return {
        ok: true,
        question: {
          id: String(q.id),
          type: 'mcq',
          title: q.text,
          explanation: q.explanation || '',
          conditions: {
            ...commonConditions,
            multipleCorrectAnswer: true,
            ...(randomizeChoice !== undefined ? { randomizeChoice } : {}),
          },
          options,
          bankRef: q.id,
        },
      };
    }

    case 'tf': {
      const trueFalseValue =
        typeof q.correct === 'boolean'
          ? q.correct
          : q.correct === 'true' || q.correct === 1;

      return {
        ok: true,
        question: {
          id: String(q.id),
          type: 'true_false',
          title: q.text,
          explanation: q.explanation || '',
          conditions: {
            ...commonConditions,
            score: q.marks || 1,
          },
          trueFalseValue,
          bankRef: q.id,
        },
      };
    }

    case 'fill': {
      let blanksTemplate = q.blanksTemplate;
      if (!blanksTemplate) {
        // Convert any sequences of ___ (3 or more underscores) to {dash}
        blanksTemplate = q.text.replace(/_{3,}/g, '{dash}');
      } else if (!blanksTemplate.includes('{dash}')) {
        blanksTemplate = blanksTemplate.replace(/_{3,}/g, '{dash}');
      }

      let blanksAnswers: string[] = [];
      if (Array.isArray(q.correct)) {
        blanksAnswers = q.correct.map(String);
      } else if (typeof q.correct === 'string' && q.correct.trim()) {
        blanksAnswers = [q.correct.trim()];
      }

      const dashMatches = blanksTemplate.match(/\{dash\}/g);
      const dashCount = dashMatches ? dashMatches.length : 0;

      if (dashCount > 0 && blanksAnswers.length > 0 && dashCount !== blanksAnswers.length) {
        return {
          ok: false,
          reason: `عدد الفراغات (${dashCount}) لا يطابق عدد الإجابات (${blanksAnswers.length})`,
        };
      }

      return {
        ok: true,
        question: {
          id: String(q.id),
          type: 'fill_blanks',
          title: q.text,
          explanation: q.explanation || '',
          conditions: {
            ...commonConditions,
            score: q.marks || (dashCount * 1 || 2),
          },
          blanksTemplate,
          blanksAnswers,
          bankRef: q.id,
        },
      };
    }

    case 'short': {
      const sampleAnswer =
        q.sampleAnswer || (typeof q.correct === 'string' ? q.correct : '');

      return {
        ok: true,
        question: {
          id: String(q.id),
          type: 'short_answer',
          title: q.text,
          explanation: q.explanation || '',
          conditions: commonConditions,
          sampleAnswer,
          bankRef: q.id,
        },
      };
    }

    case 'matching': {
      const matchingPairs: MatchingPair[] = (q.pairs || []).map((p, idx) => ({
        id: p.id || String(idx + 1),
        prompt: p.left,
        target: p.right,
        image_url: p.leftImage || p.rightImage || undefined,
      }));

      return {
        ok: true,
        question: {
          id: String(q.id),
          type: 'matching',
          title: q.text,
          explanation: q.explanation || '',
          conditions: {
            ...commonConditions,
            score: q.marks || (matchingPairs.length || 2),
          },
          matchingPairs,
          bankRef: q.id,
        },
      };
    }

    case 'numeric':
    case 'essay':
    default:
      return {
        ok: false,
        reason: 'غير مدعوم في الاختبارات حالياً',
      };
  }
}

/**
 * Reverse Maps an ExamQuestion into a Content Bank Question payload
 */
export function mapExamQuestionToBankQuestion(q: ExamQuestion): ReverseMapResult {
  // Check if question has images (images are not supported in bank yet)
  if (
    q.questionImage ||
    q.options?.some((o) => Boolean(o.image_url)) ||
    q.matchingPairs?.some((p) => Boolean(p.image_url))
  ) {
    return {
      ok: false,
      reason: 'الأسئلة اللي فيها صور مش مدعومة في البنك حالياً',
    };
  }

  // Common base fields
  const title = q.title?.trim() || '';
  if (!title) {
    return {
      ok: false,
      reason: 'اكتب نص السؤال أولاً',
    };
  }

  const marks = q.conditions?.score || 2;
  const explanation = q.explanation?.trim() || undefined;

  switch (q.type) {
    case 'mcq': {
      const isMulti = q.conditions?.multipleCorrectAnswer === true;
      const options = q.options || [];

      if (options.length < 2) {
        return {
          ok: false,
          reason: 'لازم يفضل اختيارين على الأقل',
        };
      }

      const bankOptions = options.map((opt, idx) => ({
        id: opt.id || String(idx + 1),
        letter: opt.letter || ARABIC_LETTERS[idx] || String(idx + 1),
        text: opt.text || '',
        isCorrect: Boolean(opt.is_correct),
      }));

      const correctOptions = bankOptions.filter((o) => o.isCorrect);

      if (isMulti) {
        if (correctOptions.length === 0) {
          return {
            ok: false,
            reason: 'حدد إجابة صحيحة واحدة على الأقل قبل الحفظ في البنك',
          };
        }

        const keepOrder =
          q.conditions?.randomizeChoice !== undefined
            ? !q.conditions.randomizeChoice
            : undefined;

        return {
          ok: true,
          question: {
            type: 'multi',
            text: title,
            marks,
            difficulty: '',
            tags: [],
            explanation,
            options: bankOptions,
            correct: correctOptions.map((o) => o.id),
            ...(keepOrder !== undefined ? { keepOrder } : {}),
          },
        };
      } else {
        if (correctOptions.length !== 1) {
          return {
            ok: false,
            reason: 'حدد الإجابة الصحيحة قبل الحفظ في البنك',
          };
        }

        const keepOrder =
          q.conditions?.randomizeChoice !== undefined
            ? !q.conditions.randomizeChoice
            : undefined;

        return {
          ok: true,
          question: {
            type: 'mcq',
            text: title,
            marks,
            difficulty: '',
            tags: [],
            explanation,
            options: bankOptions,
            correct: correctOptions[0].id,
            ...(keepOrder !== undefined ? { keepOrder } : {}),
          },
        };
      }
    }

    case 'true_false': {
      if (q.trueFalseValue === undefined || q.trueFalseValue === null) {
        return {
          ok: false,
          reason: 'حدد الإجابة الصحيحة (صح أو خطأ)',
        };
      }

      return {
        ok: true,
        question: {
          type: 'tf',
          text: title,
          marks,
          difficulty: '',
          tags: [],
          explanation,
          correct: Boolean(q.trueFalseValue),
        },
      };
    }

    case 'fill_blanks': {
      const template = q.blanksTemplate || title;
      const dashMatches = template.match(/\{dash\}/g) || template.match(/_{3,}/g);
      const dashCount = dashMatches ? dashMatches.length : 0;
      const answers = q.blanksAnswers || [];

      if (dashCount === 0) {
        return {
          ok: false,
          reason: 'لازم تكتب {dash} أو ___ مكان الفراغات',
        };
      }

      if (answers.length !== dashCount || answers.some((a) => !a.trim())) {
        return {
          ok: false,
          reason: 'اكتب إجابة لكل فراغ في السؤال',
        };
      }

      const standardBlanksTemplate = template.includes('{dash}')
        ? template
        : template.replace(/_{3,}/g, '{dash}');
      const text = standardBlanksTemplate.replace(/\{dash\}/g, '___');

      return {
        ok: true,
        question: {
          type: 'fill',
          text,
          blanksTemplate: standardBlanksTemplate,
          marks,
          difficulty: '',
          tags: [],
          explanation,
          correct: answers.map((a) => a.trim()),
        },
      };
    }

    case 'short_answer': {
      const sampleAnswer = q.sampleAnswer?.trim() || '';
      if (!sampleAnswer) {
        return {
          ok: false,
          reason: 'اكتب نموذج الإجابة الصحيحة',
        };
      }

      return {
        ok: true,
        question: {
          type: 'short',
          text: title,
          marks,
          difficulty: '',
          tags: [],
          explanation,
          correct: sampleAnswer,
          sampleAnswer,
        },
      };
    }

    case 'matching': {
      const pairs = q.matchingPairs || [];
      const validPairs = pairs.filter(
        (p) => p.prompt.trim() !== '' && p.target.trim() !== ''
      );

      if (validPairs.length < 2) {
        return {
          ok: false,
          reason: 'لازم زوجين كاملين على الأقل للتوصيل',
        };
      }

      return {
        ok: true,
        question: {
          type: 'matching',
          text: title,
          marks,
          difficulty: '',
          tags: [],
          explanation,
          pairs: validPairs.map((p, idx) => ({
            id: p.id || String(idx + 1),
            left: p.prompt.trim(),
            right: p.target.trim(),
          })),
        },
      };
    }

    case 'image_answer':
      return {
        ok: false,
        reason: 'نوع السؤال ده مش مدعوم في البنك حالياً',
      };

    default:
      return {
        ok: false,
        reason: 'نوع السؤال غير مدعوم في البنك حالياً',
      };
  }
}

