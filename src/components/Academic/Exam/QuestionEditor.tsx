'use client';

import React from 'react';
import { Edit3 } from 'lucide-react';
import { ExamQuestion } from '@/types/academic/exam.types';
import { McqQuestionEditor } from './components/McqQuestionEditor';
import { TrueFalseQuestionEditor } from './components/TrueFalseQuestionEditor';
import { FillBlanksQuestionEditor } from './components/FillBlanksQuestionEditor';
import { ShortAnswerQuestionEditor } from './components/ShortAnswerQuestionEditor';
import { MatchingQuestionEditor } from './components/MatchingQuestionEditor';
import { ImageAnswerQuestionEditor } from './components/ImageAnswerQuestionEditor';

interface QuestionEditorProps {
  question: ExamQuestion | null;
  questionIndex: number;
  examTitle: string;
  examDescription: string;
  onUpdateExamMeta: (title: string, description: string) => void;
  onUpdateQuestion: (updated: Partial<ExamQuestion>) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  questionIndex,
  examTitle,
  examDescription,
  onUpdateExamMeta,
  onUpdateQuestion,
}) => {
  // Empty State when no question exists or is selected
  if (!question) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 overflow-y-auto select-none">
        {/* Top Right Quiz Details Card */}
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-right mb-12">
          <input
            type="text"
            placeholder="اضافة عنوان الاختبار"
            value={examTitle}
            onChange={(e) => onUpdateExamMeta(e.target.value, examDescription)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
          />
          <textarea
            rows={2}
            placeholder="أضف ملخص"
            value={examDescription}
            onChange={(e) => onUpdateExamMeta(examTitle, e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
            >
              موافق
            </button>
            <button
              type="button"
              onClick={() => onUpdateExamMeta('', '')}
              className="px-3 py-1.5 text-slate-400 text-xs font-bold"
            >
              إلغاء
            </button>
          </div>
        </div>

        {/* Center Welcome Guide */}
        <div className="max-w-md space-y-2">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            أدخل عنوان الاختبار للبدء، ثم اختر من بين مجموعة متنوعة من أنواع الأسئلة لإنشاء تجربة تقييم أكثر تفاعلاً وفعالية.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6 text-right bg-white">
      {/* Question Title & Number */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={question.title}
            onChange={(e) => onUpdateQuestion({ title: e.target.value })}
            placeholder="اكتب نص السؤال هنا..."
            className="w-full p-3.5 pl-10 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
          />
          <Edit3
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
        <span className="text-base font-black text-slate-800 shrink-0">
          .{questionIndex + 1}
        </span>
      </div>

      {/* Question Subtitle / Description (Optional) */}
      <div>
        <input
          type="text"
          value={question.description || ''}
          onChange={(e) => onUpdateQuestion({ description: e.target.value })}
          placeholder="وصف السؤال (اختياري)"
          className="w-full p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* Sub-Editor by Question Type */}
      <div className="pt-2">
        {question.type === 'mcq' && (
          <McqQuestionEditor
            options={question.options || []}
            multipleCorrect={question.conditions?.multipleCorrectAnswer}
            onOptionsChange={(options) => onUpdateQuestion({ options })}
          />
        )}

        {question.type === 'true_false' && (
          <TrueFalseQuestionEditor
            value={question.trueFalseValue ?? true}
            onChange={(trueFalseValue) => onUpdateQuestion({ trueFalseValue })}
          />
        )}

        {question.type === 'fill_blanks' && (
          <FillBlanksQuestionEditor
            template={question.blanksTemplate || ''}
            answers={question.blanksAnswers || []}
            onChange={(blanksTemplate, blanksAnswers) =>
              onUpdateQuestion({ blanksTemplate, blanksAnswers })
            }
          />
        )}

        {question.type === 'short_answer' && (
          <ShortAnswerQuestionEditor
            sampleAnswer={question.sampleAnswer}
            onChange={(sampleAnswer) => onUpdateQuestion({ sampleAnswer })}
          />
        )}

        {question.type === 'matching' && (
          <MatchingQuestionEditor
            pairs={question.matchingPairs || []}
            isImageMatching={question.conditions?.imageMatching}
            onChange={(matchingPairs) => onUpdateQuestion({ matchingPairs })}
          />
        )}

        {question.type === 'image_answer' && (
          <ImageAnswerQuestionEditor
            imageUrl={question.questionImage}
            expectedAnswer={question.imageExpectedAnswer}
            onChange={(questionImage, imageExpectedAnswer) =>
              onUpdateQuestion({ questionImage, imageExpectedAnswer })
            }
          />
        )}
      </div>

      {/* Bottom: Explanation Box */}
      <div className="pt-4 border-t border-slate-100">
        <textarea
          rows={3}
          value={question.explanation || ''}
          onChange={(e) => onUpdateQuestion({ explanation: e.target.value })}
          placeholder="اكتب شرح الاجابة"
          className="w-full p-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>
    </div>
  );
};
