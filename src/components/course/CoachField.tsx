'use client';

import React, { useState } from 'react';
import { User, Lock, Unlock } from 'lucide-react';

export const CoachField = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-black text-gray-900">المدرب (Coach)</label>
      <div className="relative group">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <User size={18} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLocked}
          className={`w-full pr-12 pl-12 py-4 bg-white border ${isLocked ? 'border-gray-100 bg-gray-50/50' : 'border-gray-200 focus:border-blue-600'} rounded-2xl outline-none font-bold text-gray-900 transition-all`}
        />
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400"
          title={isLocked ? "فك القفل للتعديل" : "قفل التعديل"}
        >
          {isLocked ? <Lock size={16} /> : <Unlock size={16} className="text-blue-500" />}
        </button>
      </div>
      <p className="text-[10px] text-gray-400 font-bold">يتم تعبئة هذا الحقل تلقائياً باسمك كمدرب، يمكنك التعديل إذا لزم الأمر.</p>
    </div>
  );
};
