'use client';

import React from 'react';
import { ExamQuestion } from '@/types/academic/exam.types';
import { getQuestionTypeMeta } from './constants';

interface QuestionSettingsSidebarProps {
  question: ExamQuestion | null;
  onUpdateConditions: (conditions: Partial<ExamQuestion['conditions']>) => void;
}

export const QuestionSettingsSidebar: React.FC<QuestionSettingsSidebarProps> = ({
  question,
  onUpdateConditions,
}) => {
  if (!question) {
    return (
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 p-6 text-center select-none h-full justify-center">
        <p className="text-xs font-bold text-slate-400">
          انشاء/تحديد سؤال لعرض التفاصيل
        </p>
      </div>
    );
  }

  const meta = getQuestionTypeMeta(question.type);
  const conditions = question.conditions || {
    multipleCorrectAnswer: false,
    isRequired: true,
    randomizeChoice: false,
    imageMatching: false,
    score: 1,
    showScore: false,
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none h-full p-4 overflow-y-auto space-y-6 text-right">
      {/* Header: Question Type */}
      <div className="space-y-2">
        <span className="text-xs font-black text-slate-800">نوع السؤال</span>
        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <span className="text-xs font-bold text-slate-700">{meta.label}</span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-2xs ${meta.badgeBg}`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {meta.iconName}
            </span>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* Section: Conditions / الشروط */}
      <div className="space-y-4">
        <h5 className="text-xs font-black text-slate-800">الشروط :</h5>

        {/* 1. Multiple Correct Answer (for MCQ) */}
        {question.type === 'mcq' && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              Multiple Correct Answer
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdateConditions({
                  multipleCorrectAnswer: !conditions.multipleCorrectAnswer,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                conditions.multipleCorrectAnswer ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                  conditions.multipleCorrectAnswer ? 'right-5.5' : 'right-0.5'
                }`}
              />
            </button>
          </div>
        )}

        {/* 2. Image Matching (for Matching) */}
        {question.type === 'matching' && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              مطابقة الصورة
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdateConditions({
                  imageMatching: !conditions.imageMatching,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                conditions.imageMatching ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                  conditions.imageMatching ? 'right-5.5' : 'right-0.5'
                }`}
              />
            </button>
          </div>
        )}

        {/* 3. Is Required (الإجابة المطلوبة) */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">
            الإجابة المطلوبة
          </span>
          <button
            type="button"
            onClick={() =>
              onUpdateConditions({
                isRequired: !conditions.isRequired,
              })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              conditions.isRequired ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                conditions.isRequired ? 'right-5.5' : 'right-0.5'
              }`}
            />
          </button>
        </div>

        {/* 4. Randomize Choice (for MCQ & Matching) */}
        {(question.type === 'mcq' || question.type === 'matching') && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              Randomize Choice
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdateConditions({
                  randomizeChoice: !conditions.randomizeChoice,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                conditions.randomizeChoice ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                  conditions.randomizeChoice ? 'right-5.5' : 'right-0.5'
                }`}
              />
            </button>
          </div>
        )}

        {/* 5. Score / درجة السؤال */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-600">
            درجة السؤال
          </span>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={conditions.score}
            onChange={(e) =>
              onUpdateConditions({
                score: parseFloat(e.target.value) || 1,
              })
            }
            className="w-16 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* 6. Show Score (عرض الدرجات) */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">
            عرض الدرجات
          </span>
          <button
            type="button"
            onClick={() =>
              onUpdateConditions({
                showScore: !conditions.showScore,
              })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              conditions.showScore ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                conditions.showScore ? 'right-5.5' : 'right-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
