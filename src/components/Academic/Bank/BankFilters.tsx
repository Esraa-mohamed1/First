'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, X, Layers, BookOpen, Video, HelpCircle } from 'lucide-react';
import { BankItemKind } from '@/types/bank';
import { useBankStore } from '@/hooks/useBankStore';

interface BankFiltersProps {
  counts: {
    all: number;
    lesson: number;
    video: number;
    question: number;
  };
}

interface FilterChip {
  id: BankItemKind | 'all';
  label: string;
  countKey: keyof BankFiltersProps['counts'];
  icon: React.ComponentType<{ size?: number; className?: string }>;
  colorActiveBg: string;
  colorActiveText: string;
  colorActiveBorder: string;
}

const FILTER_CHIPS: FilterChip[] = [
  {
    id: 'all',
    label: 'الكل',
    countKey: 'all',
    icon: Layers,
    colorActiveBg: 'bg-gray-900',
    colorActiveText: 'text-white',
    colorActiveBorder: 'border-gray-900',
  },
  {
    id: 'lesson',
    label: 'الدروس',
    countKey: 'lesson',
    icon: BookOpen,
    colorActiveBg: 'bg-indigo-600',
    colorActiveText: 'text-white',
    colorActiveBorder: 'border-indigo-600',
  },
  {
    id: 'video',
    label: 'الفيديوهات',
    countKey: 'video',
    icon: Video,
    colorActiveBg: 'bg-blue-600',
    colorActiveText: 'text-white',
    colorActiveBorder: 'border-blue-600',
  },
  {
    id: 'question',
    label: 'الأسئلة',
    countKey: 'question',
    icon: HelpCircle,
    colorActiveBg: 'bg-purple-600',
    colorActiveText: 'text-white',
    colorActiveBorder: 'border-purple-600',
  },
];

export default function BankFilters({ counts }: BankFiltersProps) {
  const searchQuery = useBankStore((state) => state.searchQuery);
  const setSearchQuery = useBankStore((state) => state.setSearchQuery);
  const kindFilter = useBankStore((state) => state.kindFilter);
  const setKindFilter = useBankStore((state) => state.setKindFilter);

  // Local search state for immediate controlled input feedback
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [, startTransition] = useTransition();

  // Sync if external reset occurs
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search query updates to Zustand store (~300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        setSearchQuery(localSearch);
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchQuery]);

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="ابحث في دروسك وفيديوهاتك وأسئلتك…"
          className="w-full ps-11 pe-11 py-3.5 bg-white border border-gray-200/80 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 font-medium text-start transition-all text-gray-900 text-sm shadow-sm placeholder:text-gray-400"
        />
        {localSearch && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute inset-y-0 end-0 pe-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="مسح البحث"
          >
            <div className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
              <X size={12} />
            </div>
          </button>
        )}
      </div>

      {/* Kind Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1" role="group" aria-label="تصفية حسب نوع المحتوى">
        {FILTER_CHIPS.map((chip) => {
          const isActive = kindFilter === chip.id;
          const count = counts[chip.countKey] || 0;
          const Icon = chip.icon;

          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setKindFilter(chip.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none ${
                isActive
                  ? `${chip.colorActiveBg} ${chip.colorActiveText} ${chip.colorActiveBorder} shadow-sm shadow-gray-900/10 scale-[1.02]`
                  : 'bg-white text-gray-600 border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/80'
              }`}
            >
              <Icon size={14} className={isActive ? 'opacity-100' : 'opacity-70'} />
              <span>{chip.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
