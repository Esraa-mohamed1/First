'use client';

import React from 'react';
import { Plus, Trash2, Edit2, CheckCircle2, Check } from 'lucide-react';
import { McqOption } from '@/types/academic/exam.types';
import { OPTION_BADGES, OPTION_LETTERS } from '../constants';
import { KaTeXRenderer } from '../KaTeXRenderer';

interface McqQuestionEditorProps {
  options: McqOption[];
  multipleCorrect?: boolean;
  onOptionsChange: (options: McqOption[]) => void;
}

export const McqQuestionEditor: React.FC<McqQuestionEditorProps> = ({
  options = [],
  multipleCorrect = false,
  onOptionsChange,
}) => {
  const handleAddOption = () => {
    const nextIndex = options.length;
    const nextLetter = OPTION_LETTERS[nextIndex % OPTION_LETTERS.length] || `خيار ${nextIndex + 1}`;

    const newOption: McqOption = {
      id: Date.now().toString(),
      letter: nextLetter,
      text: '',
      is_correct: options.length === 0,
    };

    onOptionsChange([...options, newOption]);
  };

  const handleUpdateOptionText = (id: string, text: string) => {
    const updated = options.map((opt) => (opt.id === id ? { ...opt, text } : opt));
    onOptionsChange(updated);
  };

  const handleDeleteOption = (id: string) => {
    const filtered = options.filter((opt) => opt.id !== id);
    const reindexed = filtered.map((opt, idx) => ({
      ...opt,
      letter: OPTION_LETTERS[idx % OPTION_LETTERS.length] || `خيار ${idx + 1}`,
    }));
    onOptionsChange(reindexed);
  };

  const handleToggleCorrect = (id: string) => {
    if (multipleCorrect) {
      const updated = options.map((opt) =>
        opt.id === id ? { ...opt, is_correct: !opt.is_correct } : opt
      );
      onOptionsChange(updated);
    } else {
      const updated = options.map((opt) => ({
        ...opt,
        is_correct: opt.id === id,
      }));
      onOptionsChange(updated);
    }
  };

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Options Cards List (Matching media_1791103057139.png) */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const badge = OPTION_BADGES[index % OPTION_BADGES.length] || `(${index + 1})`;
          const isCorrect = option.is_correct;

          return (
            <div key={option.id} className="relative flex items-center gap-3">
              {/* Option Container Card */}
              <div
                onClick={() => handleToggleCorrect(option.id)}
                className={`flex-1 rounded-2xl border p-4 transition-all text-right cursor-pointer relative ${
                  isCorrect
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top bar: Letter Badge (Right) and Edit/Delete Actions (Left) */}
                <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
                  <span className="text-sm font-black text-slate-700">
                    {badge}
                  </span>

                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteOption(option.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                        title="حذف الخيار"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Option Text Input */}
                <div onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleUpdateOptionText(option.id, e.target.value)}
                    placeholder={`اكتب نص الخيار ${badge}...`}
                    className="w-full p-2 bg-transparent border-0 outline-none text-xs font-bold text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Green Checkmark Outside on the Right for Correct Option (Matching screenshot) */}
              {isCorrect && (
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0 animate-fadeIn">
                  <Check size={16} strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Option Link (Matching + اضافة خيار) */}
      <button
        type="button"
        onClick={handleAddOption}
        className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1.5 pt-1 cursor-pointer transition"
      >
        <Plus size={16} strokeWidth={2.5} />
        <span>اضافة خيار</span>
      </button>
    </div>
  );
};
