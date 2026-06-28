import React from 'react';
import { getIconComponent } from '../utils/icons';
import { useBuilderStore } from '../store/builderStore';
import { hasSectionBackground } from '../utils/typography';


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
  id?: string;
  cards?: KpiCardItem[];
  gridCols?: '1' | '2' | '3' | '4' | '5' | '6';
}

export default function KpiCards(props: KpiCardsProps) {
  const {
    id: sectionId,
    cards = [],
    gridCols = '4',
  } = props;
  
  const { 
    isEditing, 
    selectedNodeId, 
    setSelectedNodeId, 
    selectedItemIndex, 
    setSelectedItemIndex, 
    hoveredItemIndex, 
    setHoveredItemIndex 
  } = useBuilderStore();
  
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

  const isTransparentBg = hasSectionBackground(props);

  return (
    <div className={`grid gap-6 ${gridClass} text-right`} dir="rtl">
      {cards.map((card, idx) => {
        const hasIcon = !!card.icon && card.icon !== '';
        const IconComponent = hasIcon ? getIconComponent(card.icon) : null;
        const isSelected = isEditing && selectedNodeId === sectionId && selectedItemIndex === idx;
        const isHovered = isEditing && hoveredItemIndex === idx;

        return (
          <div 
            key={card.id}
            onClick={(e) => {
              if (isEditing && sectionId) {
                e.stopPropagation();
                setSelectedNodeId(sectionId);
                setSelectedItemIndex(idx);
              }
            }}
            onMouseEnter={() => isEditing && setHoveredItemIndex(idx)}
            onMouseLeave={() => isEditing && setHoveredItemIndex(null)}
            style={{ 
              backgroundColor: !hasIcon ? (card.color ? `${card.color}10` : 'rgba(var(--theme-primary-rgb), 0.08)') : undefined,
            }}
            className={`${isTransparentBg ? 'bg-white/70 border-white/40 shadow-lg shadow-slate-900/5 backdrop-blur-md' : (!hasIcon ? 'border-transparent' : 'bg-white border-slate-100/80 shadow-[0_12px_40px_rgba(25,28,29,0.02)]')} rounded-3xl p-6 flex flex-col justify-center items-center text-center space-y-2 hover:-translate-y-1 transition-all duration-300 group cursor-pointer min-h-[120px] ${
              isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : isHovered ? 'ring-4 ring-blue-300 ring-offset-1' : ''
            }`}
          >
            {!hasIcon || !IconComponent ? (
              <>
                <span className="text-2xl md:text-3xl font-black block leading-none" style={{ color: card.color || 'var(--theme-primary)' }}>
                  {card.value}
                </span>
                <span className="text-[11px] font-black block mt-1" style={{ color: card.color || 'var(--theme-primary)' }}>
                  {card.title}
                </span>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start w-full">
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

                <div className="w-full text-right">
                  <span className="text-xs font-black text-slate-400 block">{card.title}</span>
                  <span className="text-xl md:text-2xl font-black text-slate-800 block mt-1 leading-none">
                    {card.value}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
