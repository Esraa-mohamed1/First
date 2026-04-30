import React from 'react';
import { TrendingUp } from 'lucide-react';

interface AcademicProgressProps {
  progress: number;
}

export const AcademicProgress = ({ progress }: AcademicProgressProps) => {
  return (
    <div className="bg-[#78C841] rounded-3xl p-8 shadow-md relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Background patterns */}
      <div className="absolute -bottom-2 -center-2 text-green-300/30 group-hover:scale-110 transition-transform duration-500">
        <TrendingUp size={80} />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div className="text-right">
          <h2 className="text-green-900 font-bold mb-1 opacity-80">التقدم الأكاديمي</h2>
          <div className="text-4xl font-black text-green-950 flex items-center gap-2 justify-end">
            <span>اكتمل</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="w-full bg-green-900/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <div
            className="h-3 rounded-full bg-green-800 shadow-sm relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
