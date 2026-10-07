import React from 'react';
import { Send, AlertCircle } from 'lucide-react';

interface ExamTakingSubmitConfirmModalProps {
  isOpen: boolean;
  answeredCount: number;
  totalQuestions: number;
  onConfirmSubmit: () => void;
  onClose: () => void;
}

export const ExamTakingSubmitConfirmModal: React.FC<ExamTakingSubmitConfirmModalProps> = ({
  isOpen,
  answeredCount,
  totalQuestions,
  onConfirmSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Send className="w-7 h-7" />
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-lg">
            هل أنت متأكد من تسليم الاختبار؟
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            لقد قمت بالإجابة على {answeredCount} من أصل {totalQuestions} سؤال.
          </p>
        </div>

        {answeredCount < totalQuestions && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs text-right flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>لديك {totalQuestions - answeredCount} أسئلة لم تقم بالإجابة عليها بعد.</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
          >
            العودة للأسئلة
          </button>
          <button
            type="button"
            onClick={onConfirmSubmit}
            className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
          >
            تأكيد وتسليم الآن
          </button>
        </div>
      </div>
    </div>
  );
};
