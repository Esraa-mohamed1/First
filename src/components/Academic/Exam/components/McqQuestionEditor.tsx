'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { McqOption } from '@/types/academic/exam.types';
import { OPTION_BADGES, OPTION_LETTERS } from '../constants';

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
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState('');
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddOption = () => {
    if (!newOptionText.trim()) return;

    const nextIndex = options.length;
    const nextLetter = OPTION_LETTERS[nextIndex % OPTION_LETTERS.length];
    
    const newOption: McqOption = {
      id: Date.now().toString(),
      letter: nextLetter,
      text: newOptionText.trim(),
      is_correct: options.length === 0, // default first option to true if none exists
    };

    onOptionsChange([...options, newOption]);
    setNewOptionText('');
    setIsAddingOption(false);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;
    const updated = options.map((opt) =>
      opt.id === id ? { ...opt, text: editingText.trim() } : opt
    );
    onOptionsChange(updated);
    setEditingOptionId(null);
    setEditingText('');
  };

  const handleDeleteOption = (id: string) => {
    const filtered = options.filter((opt) => opt.id !== id);
    // Reassign letters
    const reindexed = filtered.map((opt, idx) => ({
      ...opt,
      letter: OPTION_LETTERS[idx % OPTION_LETTERS.length],
    }));
    onOptionsChange(reindexed);
  };

  const handleToggleCorrect = (id: string) => {
    if (multipleCorrect) {
      // Toggle individual option
      const updated = options.map((opt) =>
        opt.id === id ? { ...opt, is_correct: !opt.is_correct } : opt
      );
      onOptionsChange(updated);
    } else {
      // Single correct option
      const updated = options.map((opt) => ({
        ...opt,
        is_correct: opt.id === id,
      }));
      onOptionsChange(updated);
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Options List */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const badge = OPTION_BADGES[index % OPTION_BADGES.length];
          const isCorrect = option.is_correct;
          const isEditing = editingOptionId === option.id;

          return (
            <div key={option.id} className="relative flex items-center gap-3">
              {/* Option Container Card */}
              <div
                onClick={() => !isEditing && handleToggleCorrect(option.id)}
                className={`flex-1 rounded-2xl border p-4 transition-all text-right cursor-pointer relative ${
                  isCorrect
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top bar: Letter Badge (Right) and Edit/Delete Actions (Left) */}
                <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100/80">
                  <span className="text-sm font-black text-slate-700">
                    {badge}
                  </span>

                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEditingOptionId(option.id);
                        setEditingText(option.text);
                      }}
                      className="text-slate-400 hover:text-blue-600 p-1 rounded-md transition-colors"
                      title="تعديل الخيار"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(option.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                      title="حذف الخيار"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Option Text or Edit Input */}
                {isEditing ? (
                  <div
                    className="flex items-center gap-2 mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 p-2 bg-white border border-blue-400 rounded-xl text-xs font-bold text-slate-800 outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(option.id)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                    >
                      حفظ
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingOptionId(null)}
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-bold"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <p
                    className={`text-xs font-bold px-1 py-1 rounded-lg ${
                      isCorrect ? 'text-emerald-950 font-black' : 'text-slate-700'
                    }`}
                  >
                    {option.text}
                  </p>
                )}
              </div>

              {/* Green Checkmark Circle on Right if Correct */}
              {isCorrect && (
                <div className="shrink-0 text-emerald-500 animate-in zoom-in-75 duration-200">
                  <CheckCircle2 size={24} className="fill-emerald-500 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Inline Add Option Form */}
      {isAddingOption ? (
        <div className="rounded-2xl border-2 border-blue-300 bg-white p-4 text-right space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black text-slate-700">
              {OPTION_BADGES[options.length % OPTION_BADGES.length]}
            </span>
            <button
              type="button"
              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-bold"
            >
              <ImageIcon size={14} />
              <span>اضف صورة</span>
            </button>
          </div>

          <input
            type="text"
            placeholder="ادخل الخيار"
            value={newOptionText}
            onChange={(e) => setNewOptionText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddOption();
              }
            }}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
            autoFocus
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddOption}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              موافق
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingOption(false);
                setNewOptionText('');
              }}
              className="px-4 py-2 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        /* Add Option Button */
        <button
          type="button"
          onClick={() => setIsAddingOption(true)}
          className="w-full py-3 border border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 text-blue-600 text-xs font-black rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>اضافة خيار</span>
        </button>
      )}
    </div>
  );
};
