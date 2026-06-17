'use client';

import React from 'react';
import { useBuilderStore } from '../store/builderStore';
import RecursiveRenderer from '../renderer/RecursiveRenderer';
import DndWrapper from '../dnd/DndWrapper';
import { DeviceModeContext } from '../context/DeviceModeContext';

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

  const isMobile = deviceMode === 'mobile';
  const isTablet = deviceMode === 'tablet';
  const isDesktop = deviceMode === 'desktop';

  return (
    <div
      className={`flex-1 bg-slate-950 flex min-h-0 ${
        isDesktop
          ? 'items-start justify-center overflow-y-auto p-6'
          : 'items-start justify-center overflow-auto p-4'
      }`}
    >
      {/* Device frame wrapper — scrollable when too tall */}
      <div
        className={`bg-slate-50/90 shadow-2xl transition-all duration-300 rounded-[2rem] flex flex-col border border-slate-800 overflow-hidden ${
          isMobile
            ? 'w-[375px] min-w-[375px] max-h-[85vh]'
            : isTablet
            ? 'w-[768px] min-w-[600px] max-h-[90vh]'
            : 'w-full max-w-[1400px]'
        }`}
        style={isDesktop ? { minHeight: '90vh' } : {}}
      >
        {/* Browser / Phone Mockup Header */}
        <div className="bg-slate-100/90 border-b border-slate-200/60 px-4 py-3 flex items-center justify-between shrink-0 select-none rounded-t-[2rem]">
          <div className="flex gap-1.5 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
          </div>

          <div
            className="bg-white/80 border border-slate-200/80 rounded-xl text-[10px] font-black text-slate-400 text-center px-4 py-1 select-none truncate"
            style={{ maxWidth: isMobile ? '140px' : '33%' }}
            dir="ltr"
          >
            darab.academy/{currentTemplate.id}/preview
          </div>

          <div className="w-8" />
        </div>

        {/* Workspace Canvas Frame */}
        <div
          className={`overflow-y-auto custom-scrollbar bg-[#F3F4F6] rounded-b-[2rem] ${
            isMobile ? 'p-0' : isTablet ? 'p-4' : 'p-6 md:p-10'
          }`}
          style={{ flex: 1 }}
        >
          <DeviceModeContext.Provider value={deviceMode}>
            <DndWrapper>
              <RecursiveRenderer nodes={currentTemplate.sections} />
            </DndWrapper>
          </DeviceModeContext.Provider>
        </div>
      </div>
    </div>
  );
}
