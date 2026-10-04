'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { ExamSettings } from '@/types/academic/exam.types';

interface ExamSettingsTabProps {
  settings: ExamSettings;
  onChange: (settings: ExamSettings) => void;
}

export const ExamSettingsTab: React.FC<ExamSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const [isBasicOpen, setIsBasicOpen] = useState(true);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const basic = settings.basic;
  const advanced = settings.advanced;

  const updateBasic = (partial: Partial<typeof basic>) => {
    onChange({
      ...settings,
      basic: { ...basic, ...partial },
    });
  };

  const updateAdvanced = (partial: Partial<typeof advanced>) => {
    onChange({
      ...settings,
      advanced: { ...advanced, ...partial },
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full space-y-5 text-right select-none" dir="rtl">
      {/* 1. Basic Settings Accordion (الأعدادات الأساسية) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsBasicOpen(!isBasicOpen)}
          className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50/60 transition-colors cursor-pointer border-b border-slate-100"
        >
          <span className="font-black text-sm text-slate-800">الأعدادات الأساسية</span>
          <span className="text-slate-400">
            {isBasicOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        </button>

        {isBasicOpen && (
          <div className="p-6 space-y-6 animate-in fade-in duration-200">
            {/* Time Limit */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                الحد الزمني <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  min="0"
                  value={basic.timeLimit}
                  onChange={(e) => updateBasic({ timeLimit: parseInt(e.target.value) || 0 })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white text-center"
                />
                <select
                  value={basic.timeUnit}
                  onChange={(e) => updateBasic({ timeUnit: e.target.value as 'minutes' | 'hours' })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
                >
                  <option value="minutes">دقائق</option>
                  <option value="hours">ساعات</option>
                </select>
              </div>
            </div>

            {/* Hide Quiz Timer Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-700">إخفاء زمن الاختبار</span>
              <button
                type="button"
                onClick={() => updateBasic({ hideTimer: !basic.hideTimer })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  basic.hideTimer ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                    basic.hideTimer ? 'right-6.5' : 'right-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Feedback Mode */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                وضع التغذية الراجعة
              </label>
              <div className="relative">
                <select
                  value={basic.feedbackMode}
                  onChange={(e) => updateBasic({ feedbackMode: e.target.value as any })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
                >
                  <option value="retake">
                    إعادة المحاولة - Allows students to retake the quiz after their first attempt.
                  </option>
                  <option value="immediate">
                    فوري - يعرض الإجابات الصحيحة مباشرة بعد كل سؤال
                  </option>
                  <option value="after_submit">
                    بعد الإرسال النهائي - يعرض النتيجة فقط بعد الانتهاء
                  </option>
                  <option value="none">
                    بدون تغذية راجعة
                  </option>
                </select>
              </div>
            </div>

            {/* Allowed Attempts */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                عدد المحاولات المتاحة <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={basic.allowedAttempts}
                onChange={(e) => updateBasic({ allowedAttempts: parseInt(e.target.value) || 1 })}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Passing Score */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                درجة الأجتياز <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={basic.passingScorePercentage}
                  onChange={(e) =>
                    updateBasic({ passingScorePercentage: parseInt(e.target.value) || 0 })
                  }
                  className="w-full p-3.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
                <span className="absolute left-3 text-xs font-black text-slate-400 pointer-events-none">
                  %
                </span>
              </div>
            </div>

            {/* Max Questions Allowed to Answer */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                أعلى عدد من الأسئلة مسموح بالإجابة عليها <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={basic.maxQuestionsToAnswer}
                onChange={(e) =>
                  updateBasic({ maxQuestionsToAnswer: parseInt(e.target.value) || 1 })
                }
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Advanced Settings Accordion (اعدادات متقدمة) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50/60 transition-colors cursor-pointer border-b border-slate-100"
        >
          <span className="font-black text-sm text-slate-800">اعدادات متقدمة</span>
          <span className="text-slate-400">
            {isAdvancedOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        </button>

        {isAdvancedOpen && (
          <div className="p-6 space-y-6 animate-in fade-in duration-200">
            {/* Auto Start */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                بدء الأختبار تلقائياً <span className="text-red-500">*</span>
              </span>
              <button
                type="button"
                onClick={() => updateAdvanced({ autoStart: !advanced.autoStart })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  advanced.autoStart ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                    advanced.autoStart ? 'right-6.5' : 'right-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Layout and Ordering */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">تخطيط السؤال</label>
                <select
                  value={advanced.questionLayout}
                  onChange={(e) => updateAdvanced({ questionLayout: e.target.value as any })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
                >
                  <option value="single">سؤال واحد في كل صفحة</option>
                  <option value="all">كل الأسئلة في صفحة واحدة</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">ترتيب السؤال</label>
                <select
                  value={advanced.questionOrder}
                  onChange={(e) => updateAdvanced({ questionOrder: e.target.value as any })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
                >
                  <option value="random">عشوائي</option>
                  <option value="fixed">مرتب</option>
                </select>
              </div>
            </div>

            {/* Hide Question Number */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">اخفاء رقم السؤال</span>
              <button
                type="button"
                onClick={() => updateAdvanced({ hideQuestionNumber: !advanced.hideQuestionNumber })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  advanced.hideQuestionNumber ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                    advanced.hideQuestionNumber ? 'right-6.5' : 'right-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Short Answer Char Limit */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                تعيين حد الأحرف للإجابات القصيرة
              </label>
              <input
                type="number"
                min="10"
                value={advanced.shortAnswerCharLimit}
                onChange={(e) =>
                  updateAdvanced({ shortAnswerCharLimit: parseInt(e.target.value) || 200 })
                }
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Essay Char Limit */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                تحديد الحد الأقصى لعدد الأحرف في الإجابات المقالية أو المفتوحة
              </label>
              <input
                type="number"
                min="50"
                value={advanced.essayCharLimit}
                onChange={(e) =>
                  updateAdvanced({ essayCharLimit: parseInt(e.target.value) || 500 })
                }
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
