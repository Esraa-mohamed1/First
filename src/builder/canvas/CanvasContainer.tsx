'use client';

import React from 'react';
import { useBuilderStore } from '../store/builderStore';
import RecursiveRenderer from '../renderer/RecursiveRenderer';
import DndWrapper from '../dnd/DndWrapper';

export default function CanvasContainer() {
  const { currentTemplate, deviceMode, isEditing } = useBuilderStore();

  if (!currentTemplate) {
    return (
      <div className="flex-1 bg-slate-950 p-8 flex items-center justify-center text-center">
        <p className="text-sm font-black text-slate-500 animate-pulse">جاري تحميل قالب الأكاديمية...</p>
      </div>
    );
  }

  // Get simulated width based on active device mode
  const getSimulatedWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full max-w-[1400px]';
    }
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 md:p-8 flex items-center justify-center overflow-y-auto min-h-[500px] select-none">
      
      <div 
        className={`bg-slate-50/90 shadow-2xl transition-all duration-300 rounded-[2.5rem] flex flex-col relative overflow-hidden h-[95%] border border-slate-800 ${getSimulatedWidth()}`}
      >
        {/* Browser Mockup Header */}
        <div className="bg-slate-100/90 border-b border-slate-200/60 px-5 py-3.5 flex items-center justify-between shrink-0 select-none">
          <div className="flex gap-1.5 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
          </div>
          
          <div className="bg-white/80 border border-slate-200/80 rounded-xl text-[10px] font-black text-slate-400 text-center px-6 py-1 w-1/3 select-none truncate" dir="ltr">
            darab.academy/{currentTemplate.id}/preview
          </div>
          
          <div className="w-8"></div>
        </div>

        {/* Workspace Canvas Frame */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 bg-[#F3F4F6]">
          {isEditing ? (
            // Wrap in Drag & Drop context during editing
            <DndWrapper>
              <RecursiveRenderer nodes={currentTemplate.sections} />
            </DndWrapper>
          ) : (
            // Plain visual renderer for clean preview
            <RecursiveRenderer nodes={currentTemplate.sections} />
          )}
        </div>

      </div>

    </div>
  );
}
