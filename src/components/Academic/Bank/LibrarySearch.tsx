'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, X } from 'lucide-react';

interface LibrarySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function LibrarySearch({
  value,
  onChange,
  placeholder = 'ابحث داخل المكتبة…',
}: LibrarySearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (localValue === value) return;
    const timer = setTimeout(() => {
      startTransition(() => {
        onChange(localValue);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-gray-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full ps-11 pe-11 py-3 bg-white border border-gray-200/80 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 font-medium text-start transition-all text-gray-900 text-sm shadow-xs placeholder:text-gray-400"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 end-0 pe-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          aria-label="مسح البحث"
        >
          <div className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X size={12} />
          </div>
        </button>
      )}
    </div>
  );
}
