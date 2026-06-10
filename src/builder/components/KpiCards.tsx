import React from 'react';
import { getIconComponent } from '../utils/icons';

import { useBuilderStore } from '../store/builderStore';

interface KpiCardItem {
  id: string;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: string;
  color: string;
}

interface KpiCardsProps {
  cards?: KpiCardItem[];
  gridCols?: '1' | '2' | '3' | '4' | '5' | '6';
}

export default function KpiCards({
  cards = [],
  gridCols = '4',
}: KpiCardsProps) {
  // Read deviceMode with a fail-safe fallback
  let deviceMode = 'desktop';
  try {
    deviceMode = useBuilderStore((state) => state.deviceMode);
  } catch (e) {
    // Fallback if rendered outside the store context
  }

  const getGridClass = () => {
    if (deviceMode === 'mobile') return 'grid-cols-1';
    if (deviceMode === 'tablet') return 'grid-cols-2';
    
    return gridCols === '1' ? 'grid-cols-1' :
           gridCols === '2' ? 'grid-cols-2' :
           gridCols === '3' ? 'grid-cols-3' :
           gridCols === '5' ? 'grid-cols-5' :
           gridCols === '6' ? 'grid-cols-6' : 'grid-cols-4';
  };

  const gridClass = getGridClass();

  return (
    <div className={`grid gap-6 ${gridClass} text-right`} dir="rtl">
      {cards.map((card) => {
        const IconComponent = getIconComponent(card.icon);
        return (
          <div 
            key={card.id}
            className="bg-white rounded-3xl p-6 border border-slate-100/80 shadow-[0_12px_40px_rgba(25,28,29,0.02)] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <div 
                style={{ backgroundColor: `${card.color}15`, color: card.color }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
              >
                <IconComponent className="w-5 h-5 stroke-[2.5px]" />
              </div>
              
              {card.change && (
                <span 
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                    card.isPositive 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {card.change}
                </span>
              )}
            </div>

            <div>
              <span className="text-xs font-black text-slate-400 block">{card.title}</span>
              <span className="text-xl md:text-2xl font-black text-slate-800 block mt-1 leading-none">
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
