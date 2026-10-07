import React from 'react';
import { Sparkles } from 'lucide-react';

interface ExamTakingPreviewBannerProps {
  onClose: () => void;
}

export const ExamTakingPreviewBanner: React.FC<ExamTakingPreviewBannerProps> = ({ onClose }) => {
  return (
    <div className="bg-amber-500 text-white text-xs font-semibold py-1.5 px-4 flex items-center justify-between shadow-xs z-30 shrink-0">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span>وضع المعاينة الحية للاختبار — يمكنك تجربة خوض الاختبار وتفقد الإجابات وحساب الدرجات كما يراها الطالب تماماً</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="hover:underline text-[11px] bg-amber-600 hover:bg-amber-700 px-2.5 py-1 rounded-lg font-bold transition"
      >
        إغلاق المعاينة
      </button>
    </div>
  );
};
