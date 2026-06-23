import React, { useState } from 'react';
import { hasSectionBackground } from '../utils/typography';


interface TabItem {
  id: string;
  label: string;
}

interface TabsBlockProps {
  tabs?: TabItem[];
  activeTabColor?: string;
  alignment?: 'right' | 'center' | 'left';
}

export const MOCK_TABS = [
  { id: '1', label: 'الدورات المتاحة' },
  { id: '2', label: 'مسارات التعلم التفاعلية' },
  { id: '3', label: 'الشهادات المعتمدة' }
];

export default function TabsBlock(props: TabsBlockProps) {
  const {
    tabs = MOCK_TABS,
    activeTabColor = 'var(--theme-primary)',
    alignment = 'right',
  } = props;
  const [activeId, setActiveId] = useState<string | null>(null);

  const isTransparentBg = hasSectionBackground(props);

  const currentActiveId = activeId && tabs.some(t => t.id === activeId) ? activeId : (tabs[0]?.id || null);

  const alignClass = 
    alignment === 'left' ? 'justify-start' : 
    alignment === 'center' ? 'justify-center' : 'justify-end';

  return (
    <div className="w-full text-right" dir="rtl">
      
      {/* Tab bar header selection */}
      <div className={`flex border-b border-slate-100 pb-px gap-1 flex-wrap ${alignClass}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === currentActiveId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              style={{ 
                borderColor: isActive ? activeTabColor : 'transparent',
                color: isActive ? activeTabColor : '#64748b'
              }}
              className={`px-5 py-3.5 border-b-2 font-black text-xs transition-all duration-200 outline-none`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab simulated contents preview */}
      <div className={`py-6 px-4 ${isTransparentBg ? 'bg-white/30 border-white/10' : 'bg-slate-50/40 border-slate-100'} border border-t-0 rounded-b-2xl min-h-[100px] flex items-center justify-center text-center`}>
        <p className={`text-xs font-semibold ${isTransparentBg ? 'text-slate-500' : 'text-slate-400'} italic`}>
          محتوى تفاعلي لعلامة التبويب: "{tabs.find(t => t.id === currentActiveId)?.label || 'لا يوجد تبويب محدد'}"
        </p>
      </div>


    </div>
  );
}
