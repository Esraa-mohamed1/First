'use client';

import React from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileQuestion,
  Clock,
  Award,
  Sparkles,
  Save,
} from 'lucide-react';
import { ExamPayload } from '@/types/academic/exam.types';

interface ExamPublishTabProps {
  exam: ExamPayload;
  onPublish: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
}

export const ExamPublishTab: React.FC<ExamPublishTabProps> = ({
  exam,
  onPublish,
  onSaveDraft,
  isSubmitting = false,
}) => {
  const questionsCount = exam.questions?.length || 0;
  const totalPoints = exam.questions?.reduce((sum, q) => sum + (q.conditions?.score || 1), 0) || 0;
  const timeLimit = exam.settings?.basic?.timeLimit || 0;
  const passingScore = exam.settings?.basic?.passingScorePercentage || 60;

  // Validation checks
  const hasTitle = !!exam.title?.trim();
  const hasQuestions = questionsCount > 0;
  const allQuestionsValid = exam.questions?.every((q) => {
    if (!q.title?.trim()) return false;
    if (q.type === 'mcq') {
      return q.options?.some((o) => o.is_correct && o.text.trim() !== '');
    }
    return true;
  });

  const canPublish = hasTitle && hasQuestions && allQuestionsValid;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-2xl mx-auto w-full space-y-8 select-none text-right custom-scrollbar" dir="rtl">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-md shadow-blue-500/10">
          <Send size={28} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">جاهزية ونشر الاختبار</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          راجع ملخص الاختبار وتحقق من اكتمال الأسئلة قبل نشره للطلاب
        </p>
      </div>

      {/* Overview Card */}
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">{exam.title || 'اختبار بدون عنوان'}</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-0.5">عدد الأسئلة</span>
            <b className="text-base font-bold text-slate-800 font-mono">{questionsCount}</b>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-0.5">مجموع الدرجات</span>
            <b className="text-base font-bold text-slate-800 font-mono">{totalPoints}</b>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-0.5">المدة الزمنية</span>
            <b className="text-base font-bold text-slate-800 font-mono">
              {timeLimit > 0 ? `${timeLimit} دقيقة` : 'مفتوح'}
            </b>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-0.5">نسبة النجاح</span>
            <b className="text-base font-bold text-slate-800 font-mono">{passingScore}%</b>
          </div>
        </div>
      </div>

      {/* Validation Checklist */}
      <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
        <h4 className="font-bold text-sm text-slate-800">قائمة التحقق من النشر:</h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            {hasTitle ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <AlertCircle size={16} className="text-rose-500" />
            )}
            <span className={hasTitle ? 'text-slate-700 font-medium' : 'text-rose-600 font-bold'}>
              تم تعيين عنوان واضح للاختبار
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasQuestions ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <AlertCircle size={16} className="text-rose-500" />
            )}
            <span className={hasQuestions ? 'text-slate-700 font-medium' : 'text-rose-600 font-bold'}>
              يحتوي الاختبار على سؤال واحد على الأقل
            </span>
          </div>

          <div className="flex items-center gap-2">
            {allQuestionsValid ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <AlertCircle size={16} className="text-rose-500" />
            )}
            <span className={allQuestionsValid ? 'text-slate-700 font-medium' : 'text-rose-600 font-bold'}>
              تم تحديد الإجابات الصحيحة ونصوص الأسئلة دون أخطاء
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          disabled={!canPublish || isSubmitting}
          onClick={onPublish}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
        >
          <Send size={18} />
          <span>{isSubmitting ? 'جاري النشر...' : 'نشر الاختبار الآن للطلاب'}</span>
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
          className="w-full py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Save size={16} />
          <span>حفظ كمسودة والرجوع لاحقاً</span>
        </button>
      </div>
    </div>
  );
};
