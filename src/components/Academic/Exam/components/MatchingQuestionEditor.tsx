'use client';

import React from 'react';
import { Plus, Trash2, ArrowLeftRight } from 'lucide-react';
import { MatchingPair } from '@/types/academic/exam.types';

interface MatchingQuestionEditorProps {
  pairs: MatchingPair[];
  isImageMatching?: boolean;
  onChange: (pairs: MatchingPair[]) => void;
}

export const MatchingQuestionEditor: React.FC<MatchingQuestionEditorProps> = ({
  pairs = [],
  isImageMatching = false,
  onChange,
}) => {
  const handleAddPair = () => {
    const newPair: MatchingPair = {
      id: Date.now().toString(),
      prompt: '',
      target: '',
    };
    onChange([...pairs, newPair]);
  };

  const handleUpdatePrompt = (id: string, prompt: string) => {
    const updated = pairs.map((p) => (p.id === id ? { ...p, prompt } : p));
    onChange(updated);
  };

  const handleUpdateTarget = (id: string, target: string) => {
    const updated = pairs.map((p) => (p.id === id ? { ...p, target } : p));
    onChange(updated);
  };

  const handleDeletePair = (id: string) => {
    onChange(pairs.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          أزواج المطابقة والتوصيل
        </label>
        <span className="text-[11px] text-slate-400">
          اكتب العنصر في العمود الأول ومقابله الصحيح في العمود الثاني
        </span>
      </div>

      {/* Pairs List */}
      <div className="space-y-3">
        {pairs.map((pair, index) => (
          <div
            key={pair.id}
            className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors"
          >
            <span className="text-xs font-bold font-mono text-slate-400 w-5">
              #{index + 1}
            </span>

            {/* Prompt Input */}
            <input
              type="text"
              value={pair.prompt}
              onChange={(e) => handleUpdatePrompt(pair.id, e.target.value)}
              placeholder={`العنصر ${index + 1} (مثال: عاصمة مصر)...`}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
            />

            <ArrowLeftRight size={16} className="text-slate-400 flex-shrink-0" />

            {/* Target Input */}
            <input
              type="text"
              value={pair.target}
              onChange={(e) => handleUpdateTarget(pair.id, e.target.value)}
              placeholder={`المطابق الصحيح (مثال: القاهرة)...`}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
            />

            {/* Delete Pair */}
            {pairs.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeletePair(pair.id)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer flex-shrink-0"
                title="حذف هذا الزوج"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Pair Button */}
      <button
        type="button"
        onClick={handleAddPair}
        className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 text-slate-600 hover:text-blue-600 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Plus size={15} />
        <span>إضافة زوج مطابقة جديد</span>
      </button>
    </div>
  );
};
