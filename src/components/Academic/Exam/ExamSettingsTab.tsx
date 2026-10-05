'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldCheck,
  Shuffle,
  Award,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRightLeft,
  Eye,
} from 'lucide-react';
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
  const [isSecurityOpen, setIsSecurityOpen] = useState(true);
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
    <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-3xl mx-auto w-full space-y-6 text-right select-none custom-scrollbar" dir="rtl">
      {/* 1. Basic Settings Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsBasicOpen(!isBasicOpen)}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
              الإعدادات الأساسية والوقت
            </span>
          </div>
          <span className="text-slate-400">
            {isBasicOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </button>

        {isBasicOpen && (
          <div className="p-6 space-y-6 animate-in fade-in duration-200">
            {/* Time Limit */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                الحد الزمني للاختبار <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  min="0"
                  value={basic.timeLimit}
                  onChange={(e) => updateBasic({ timeLimit: parseInt(e.target.value) || 0 })}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:bg-white text-center"
                />
                <select
                  value={basic.timeUnit}
                  onChange={(e) => updateBasic({ timeUnit: e.target.value as 'minutes' | 'hours' })}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
                >
                  <option value="minutes">دقائق (مثال: 30 دقيقة)</option>
                  <option value="hours">ساعات (مثال: 1 ساعة)</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400">
                ضع 0 إذا كنت تريد جعل وقت الاختبار مفتوحاً بدون عداد تنازلي
              </p>
            </div>

            {/* Hide Quiz Timer Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  إخفاء العداد التنازلي عن الطالب
                </span>
                <span className="text-[11px] text-slate-400">
                  يستمر حساب الوقت خلف الكواليس دون تشتيت الطالب
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateBasic({ hideTimer: !basic.hideTimer })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  basic.hideTimer ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                    basic.hideTimer ? 'right-6.5' : 'right-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Passing Score Percentage */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                نسبة درجة الاجتياز المطلوبة (%) <span className="text-rose-500">*</span>
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
                  className="w-full p-3.5 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:bg-white"
                />
                <span className="absolute left-3.5 text-xs font-black text-slate-400 pointer-events-none">
                  %
                </span>
              </div>
            </div>

            {/* Allowed Attempts */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                عدد المحاولات المتاحة للطالب <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={basic.allowedAttempts}
                onChange={(e) => updateBasic({ allowedAttempts: parseInt(e.target.value) || 1 })}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Security, Shuffling & Navigation Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsSecurityOpen(!isSecurityOpen)}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
              ضوابط النزاهة وعرض الإجابات
            </span>
          </div>
          <span className="text-slate-400">
            {isSecurityOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </button>

        {isSecurityOpen && (
          <div className="p-6 space-y-6 animate-in fade-in duration-200">
            {/* Linear Navigation Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  التنقل المتسلسل الصارم (منع الرجوع)
                </span>
                <span className="text-[11px] text-slate-400">
                  لا يستطيع الطالب الرجوع للسؤال السابق بعد الانتقال للسؤال التالي
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateBasic({ linearNavigation: !basic.linearNavigation })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  basic.linearNavigation ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                    basic.linearNavigation ? 'right-6.5' : 'right-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Randomize Questions Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  خلط ترتيب الأسئلة عشوائياً
                </span>
                <span className="text-[11px] text-slate-400">
                  تظهر الأسئلة بترتيب مختلف ومفاجئ لكل طالب
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateBasic({ shuffleQuestions: !basic.shuffleQuestions })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  basic.shuffleQuestions ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                    basic.shuffleQuestions ? 'right-6.5' : 'right-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Randomize Choices Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  خلط ترتيب خيارات الإجابة (MCQ)
                </span>
                <span className="text-[11px] text-slate-400">
                  ترتيب الخيارات أ، ب، ج، د يختلف عشوائياً لكل طالب
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateBasic({ shuffleOptions: !basic.shuffleOptions })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  basic.shuffleOptions ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                    basic.shuffleOptions ? 'right-6.5' : 'right-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Show Solution on Submit */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  عرض الإجابة النموذجية وشرح المعلم بعد الإرسال
                </span>
                <span className="text-[11px] text-slate-400">
                  يسمح للطالب برؤية مواطن الخطأ ومراجعة التعليل والحلول
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateBasic({ showSolutionOnSubmit: !basic.showSolutionOnSubmit })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  basic.showSolutionOnSubmit !== false ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                    basic.showSolutionOnSubmit !== false ? 'right-6.5' : 'right-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Enable Certificate on Pass */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  منح شهادة إتمام عند اجتياز الاختبار
                </span>
                <span className="text-[11px] text-slate-400">
                  إصدار شهادة تقديرية فورية للطالب عند تحقيق درجة النجاح
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateBasic({ enableCertificate: !basic.enableCertificate })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  basic.enableCertificate ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
                    basic.enableCertificate ? 'right-6.5' : 'right-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Pre-Exam Instructions & Custom Completion Message */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
              رسائل التوجيه والجدولة
            </span>
          </div>
          <span className="text-slate-400">
            {isAdvancedOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </button>

        {isAdvancedOpen && (
          <div className="p-6 space-y-5 animate-in fade-in duration-200">
            {/* Pre-exam instructions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                تعليمات ما قبل بدء الاختبار
              </label>
              <textarea
                rows={3}
                value={basic.instructions || ''}
                onChange={(e) => updateBasic({ instructions: e.target.value })}
                placeholder="مثال: يرجى التأكد من استقرار اتصال الإنترنت وعدم إغلاق المتصفح أثناء الاختبار..."
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:bg-white resize-none"
              />
            </div>

            {/* Post-exam completion message */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                رسالة التهنئة بعد التسليم
              </label>
              <textarea
                rows={2}
                value={basic.completionMessage || ''}
                onChange={(e) => updateBasic({ completionMessage: e.target.value })}
                placeholder="مثال: أحسنت! تم تسجيل إجاباتك بنجاح، يمكنك الآن الانتقال للدرس التالي..."
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:bg-white resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
