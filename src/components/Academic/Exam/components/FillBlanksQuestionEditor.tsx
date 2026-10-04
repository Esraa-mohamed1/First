'use client';

import React, { useState } from 'react';
import { Info, Check, Trash2, Edit2 } from 'lucide-react';

interface FillBlanksQuestionEditorProps {
  template: string;
  answers: string[];
  onChange: (template: string, answers: string[]) => void;
}

export const FillBlanksQuestionEditor: React.FC<FillBlanksQuestionEditorProps> = ({
  template = '',
  answers = [],
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTemplate, setTempTemplate] = useState(template);
  const [tempAnswer, setTempAnswer] = useState(answers.join(' | '));

  const handleSave = () => {
    const parsedAnswers = tempAnswer
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean);
    onChange(tempTemplate, parsedAnswers);
    setIsEditing(false);
  };

  const currentAnswerText = answers.join(' | ');

  return (
    <div className="space-y-4">
      {/* Fill in the blanks container card */}
      <div className="rounded-2xl border border-blue-200 bg-white p-4 space-y-4 text-right shadow-2xs">
        {/* Top header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-black text-slate-800">املأ الفراغات</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTempTemplate(template);
                setTempAnswer(currentAnswerText);
                setIsEditing(!isEditing);
              }}
              className="text-slate-400 hover:text-blue-600 p-1 rounded-md transition-colors cursor-pointer"
              title="تعديل الفراغات"
            >
              <Edit2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => onChange('', [])}
              className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
              title="مسح"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-3 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                نص السؤال مع الفراغات ({'{dash}'}):
              </label>
              <textarea
                rows={2}
                value={tempTemplate}
                onChange={(e) => setTempTemplate(e.target.value)}
                placeholder="مثال: لغة البرمجة {dash} تُستخدم لتطوير صفحات الويب"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              />
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-1">
                <Info size={13} className="shrink-0 text-blue-500" />
                <span>
                  ضع {'{dash}'} مكان كل فراغ في السؤال. يمكنك إضافة أكثر من {'{dash}'} إذا كان السؤال يحتوي على عدة فراغات.
                </span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                الإجابة / الإجابات الصحيحة:
              </label>
              <input
                type="text"
                value={tempAnswer}
                onChange={(e) => setTempAnswer(e.target.value)}
                placeholder="مثال: JavaScript | React"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              />
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-1">
                <Info size={13} className="shrink-0 text-blue-500" />
                <span>
                  إذا كان السؤال يحتوي على أكثر من فراغ، اكتب الإجابات بالترتيب وافصل بينها بعلامة |. يجب أن يكون لكل {'{dash}'} إجابة واحدة.
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                موافق
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-xs text-slate-800 leading-relaxed">
              {template ? (
                template.split('{dash}').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    <span>{part}</span>
                    {i < arr.length - 1 && (
                      <span className="inline-block mx-1.5 px-3 py-0.5 bg-blue-100 text-blue-800 font-mono text-[11px] rounded-md border border-blue-200">
                        ________
                      </span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className="text-slate-400">انقر فوق تعديل لإدخال نص الفراغات...</span>
              )}
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs font-black text-emerald-800 flex items-center justify-between">
              <span>الإجابة الصحيحة: {currentAnswerText || 'لم تُحدد بعد'}</span>
              <Check size={16} className="text-emerald-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
