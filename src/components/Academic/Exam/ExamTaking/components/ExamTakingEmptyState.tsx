import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ExamTakingEmptyStateProps {
  onClose: () => void;
}

export const ExamTakingEmptyState: React.FC<ExamTakingEmptyStateProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" dir="rtl">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-xl border border-slate-200">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          لا توجد أسئلة مضافة بعد
        </h3>
        <p className="text-sm text-slate-500">
          يرجى إضافة أسئلة للاختبار أولاً لكي تتمكن من معاينته أو تشغيله.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition cursor-pointer"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};
