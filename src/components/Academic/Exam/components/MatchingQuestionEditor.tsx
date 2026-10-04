'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ArrowLeftRight } from 'lucide-react';
import { MatchingPair } from '@/types/academic/exam.types';
import { OPTION_BADGES } from '../constants';

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
  const [isAdding, setIsAdding] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editTarget, setEditTarget] = useState('');

  const handleAddPair = () => {
    if (!newPrompt.trim() || !newTarget.trim()) return;

    const newPair: MatchingPair = {
      id: Date.now().toString(),
      prompt: newPrompt.trim(),
      target: newTarget.trim(),
    };

    onChange([...pairs, newPair]);
    setNewPrompt('');
    setNewTarget('');
    setIsAdding(false);
  };

  const handleSaveEdit = (id: string) => {
    if (!editPrompt.trim() || !editTarget.trim()) return;
    const updated = pairs.map((p) =>
      p.id === id ? { ...p, prompt: editPrompt.trim(), target: editTarget.trim() } : p
    );
    onChange(updated);
    setEditingId(null);
  };

  const handleDeletePair = (id: string) => {
    onChange(pairs.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4 text-right">
      {/* Pairs List */}
      <div className="space-y-3">
        {pairs.map((pair, index) => {
          const badge = OPTION_BADGES[index % OPTION_BADGES.length];
          const isEditingThis = editingId === pair.id;

          return (
            <div
              key={pair.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-slate-700">{badge}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(pair.id);
                      setEditPrompt(pair.prompt);
                      setEditTarget(pair.target);
                    }}
                    className="text-slate-400 hover:text-blue-600 p-1 rounded-md transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePair(pair.id)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {isEditingThis ? (
                <div className="space-y-2 pt-2 animate-in fade-in duration-150">
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="العنصر أو السؤال (الطرف الأول)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  />
                  <input
                    type="text"
                    value={editTarget}
                    onChange={(e) => setEditTarget(e.target.value)}
                    placeholder="المطابق أو الإجابة (الطرف المقابل)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(pair.id)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                    >
                      حفظ
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-xl"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-black text-slate-800">{pair.prompt}</p>
                  <p className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                    <ArrowLeftRight size={12} className="text-slate-400" />
                    <span>{pair.target}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Pair Form or Button */}
      {isAdding ? (
        <div className="rounded-2xl border-2 border-blue-300 bg-white p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black text-slate-700">
              {OPTION_BADGES[pairs.length % OPTION_BADGES.length]} - إضافة زوج مطابقة جديد
            </span>
          </div>

          <input
            type="text"
            placeholder="أدخل الطرف الأول (مثال: ما هي عاصمة اليابان؟)"
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
            autoFocus
          />

          <input
            type="text"
            placeholder="أدخل الطرف المطابق (مثال: طوكيو)"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddPair();
              }
            }}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddPair}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              موافق
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewPrompt('');
                setNewTarget('');
              }}
              className="px-4 py-2 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full py-3 border border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 text-blue-600 text-xs font-black rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>اضافة خيار</span>
        </button>
      )}
    </div>
  );
};
