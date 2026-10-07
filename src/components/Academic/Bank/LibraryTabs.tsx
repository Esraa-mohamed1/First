'use client';

import React from 'react';
import { Layers, BookOpen, Video, HelpCircle } from 'lucide-react';
import { BankItemKind, Library } from '@/types/bank';

interface LibraryTabsProps {
  library?: Library;
  activeKind: BankItemKind | 'all';
  onSelectKind: (kind: BankItemKind | 'all') => void;
}

interface TabConfig {
  id: BankItemKind | 'all';
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  getCount: (counts?: Library['itemCounts']) => number;
  activeColorClass: string;
}

const TABS: TabConfig[] = [
  {
    id: 'all',
    label: 'الكل',
    icon: Layers,
    getCount: (c) => c?.total ?? ((c?.lesson || 0) + (c?.video || 0) + (c?.question || 0)),
    activeColorClass: 'bg-gray-900 text-white border-gray-900',
  },
  {
    id: 'lesson',
    label: 'الدروس',
    icon: BookOpen,
    getCount: (c) => c?.lesson || 0,
    activeColorClass: 'bg-indigo-600 text-white border-indigo-600',
  },
  {
    id: 'video',
    label: 'الفيديوهات',
    icon: Video,
    getCount: (c) => c?.video || 0,
    activeColorClass: 'bg-blue-600 text-white border-blue-600',
  },
  {
    id: 'question',
    label: 'الأسئلة',
    icon: HelpCircle,
    getCount: (c) => c?.question || 0,
    activeColorClass: 'bg-purple-600 text-white border-purple-600',
  },
];

export default function LibraryTabs({
  library,
  activeKind,
  onSelectKind,
}: LibraryTabsProps) {
  const counts = library?.itemCounts;

  return (
    <div
      className="flex flex-wrap items-center gap-2 border-b border-gray-200/60 pb-3"
      role="tablist"
      aria-label="تصفية حسب نوع المحتوى داخل المكتبة"
    >
      {TABS.map((tab) => {
        const isActive = activeKind === tab.id;
        const count = tab.getCount(counts);
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectKind(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border select-none ${
              isActive
                ? `${tab.activeColorClass} shadow-sm shadow-gray-900/10 scale-[1.02]`
                : 'bg-white text-gray-600 border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/80'
            }`}
          >
            <Icon size={14} className={isActive ? 'opacity-100' : 'opacity-70'} />
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
