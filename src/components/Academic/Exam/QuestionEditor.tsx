'use client';

import React, { useState } from 'react';
import { Edit3, Calculator, HelpCircle, Eye, Pencil } from 'lucide-react';
import { ExamQuestion } from '@/types/academic/exam.types';
import { McqQuestionEditor } from './components/McqQuestionEditor';
import { TrueFalseQuestionEditor } from './components/TrueFalseQuestionEditor';
import { FillBlanksQuestionEditor } from './components/FillBlanksQuestionEditor';
import { ShortAnswerQuestionEditor } from './components/ShortAnswerQuestionEditor';
import { MatchingQuestionEditor } from './components/MatchingQuestionEditor';
import { ImageAnswerQuestionEditor } from './components/ImageAnswerQuestionEditor';
import { EquationEditorModal } from './EquationEditorModal';
import { KaTeXRenderer } from './KaTeXRenderer';

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
  const [isEquationModalOpen, setIsEquationModalOpen] = useState(false);
  const [targetFieldForEquation, setTargetFieldForEquation] = useState<'title' | 'description' | 'explanation'>('title');

  if (!question) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40 select-none" dir="rtl">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 text-right mb-6">
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
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white resize-none"
          />
        </div>
      </div>
    );
  }

  const handleOpenEquationModal = (field: 'title' | 'description' | 'explanation') => {
    setTargetFieldForEquation(field);
    setIsEquationModalOpen(true);
  };

  const handleInsertEquation = (latexStr: string) => {
    if (targetFieldForEquation === 'title') {
      const current = question.title || '';
      onUpdateQuestion({ title: current ? `${current} ${latexStr}` : latexStr });
    } else if (targetFieldForEquation === 'description') {
      const current = question.description || '';
      onUpdateQuestion({ description: current ? `${current} ${latexStr}` : latexStr });
    } else if (targetFieldForEquation === 'explanation') {
      const current = question.explanation || '';
      onUpdateQuestion({ explanation: current ? `${current} ${latexStr}` : latexStr });
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-5 text-right bg-white custom-scrollbar" dir="rtl">
      {/* Question Prompt Card with .2 on the right and edit icon on the left (Matching media_1791103057139.png) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700">نص السؤال</span>
          <button
            type="button"
            onClick={() => handleOpenEquationModal('title')}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"
          >
            <Calculator size={13} />
            <span>إدراج معادلة</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={question.title}
              onChange={(e) => onUpdateQuestion({ title: e.target.value })}
              placeholder="اكتب نص السؤال هنا..."
              className="w-full p-3.5 pl-10 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition shadow-2xs"
            />
            <Pencil
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
          <span className="text-sm font-black text-slate-700 shrink-0">
            .{questionIndex + 1}
          </span>
        </div>

        {/* Live KaTeX Preview if math formula present */}
        {question.title && (question.title.includes('$') || question.title.includes('\\')) && (
          <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-slate-800 flex items-center gap-2">
            <Eye size={14} className="text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <KaTeXRenderer content={question.title} />
            </div>
          </div>
        )}
      </div>

      {/* Subtitle: وصف السؤال (اختياري) */}
      <div>
        <input
          type="text"
          value={question.description || ''}
          onChange={(e) => onUpdateQuestion({ description: e.target.value })}
          placeholder="وصف السؤال (اختياري)"
          className="w-full p-3 bg-slate-50/60 border border-slate-200/70 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition"
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

      {/* Explanation Box: اكتب شرح الاجابة (Matching media_1791103057139.png) */}
      <div className="pt-4 border-t border-slate-100 space-y-1.5">
        <textarea
          rows={3}
          value={question.explanation || ''}
          onChange={(e) => onUpdateQuestion({ explanation: e.target.value })}
          placeholder="اكتب شرح الاجابة"
          className="w-full p-3 bg-slate-50/60 border border-slate-200/70 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition resize-none leading-relaxed"
        />
      </div>

      {/* Equation Modal */}
      <EquationEditorModal
        isOpen={isEquationModalOpen}
        onClose={() => setIsEquationModalOpen(false)}
        onInsert={handleInsertEquation}
      />
    </div>
  );
};
