'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Monitor, Smartphone } from 'lucide-react';
import LandingRenderer from '../renderer/LandingRenderer';
import { useLandingStore } from '../store/landingStore';

interface TemplatePreviewModalProps {
  templateId: string | null;
  onClose: () => void;
  onSelect?: () => void;
}

function IframePreview({ children }: { children: React.ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // Inject styles & fonts from main window into iframe head
    doc.head.innerHTML = '';
    const parentStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
    parentStyles.forEach((node) => {
      doc.head.appendChild(node.cloneNode(true));
    });

    doc.documentElement.setAttribute('dir', 'rtl');
    doc.body.className = 'bg-white font-sans antialiased m-0 p-0 overflow-x-hidden';
    setMountNode(doc.body);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0 transition-all duration-300"
      title="Mobile Responsive Template Preview"
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
}

export default function TemplatePreviewModal({
  templateId,
  onClose,
  onSelect,
}: TemplatePreviewModalProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const savedState = useRef<any>(null);

  useEffect(() => {
    if (!templateId) return;

    // Save the current Zustand state to prevent overriding actual user edits
    const state = useLandingStore.getState();
    savedState.current = {
      landingPageId: state.landingPageId,
      courseId: state.courseId,
      templateName: state.templateName,
      isActive: state.isActive,
      userId: state.userId,
      content: state.content,
      isEditable: state.isEditable,
      activeSectionId: state.activeSectionId,
      courseData: state.courseData,
    };

    return () => {
      // Restore Zustand state on close/unmount
      if (savedState.current) {
        useLandingStore.setState(savedState.current);
      }
    };
  }, [templateId]);

  if (!templateId) return null;

  const getTemplateNameArabic = (id: string) => {
    switch (id) {
      case 'template_1':
        return 'الكلاسيكي الملكي (تصميم زمردي دافئ وعروض إحصائيات)';
      case 'template_2':
        return 'الافتراضي التفاعلي (مشغل فيديو وجداول دروس متقدمة)';
      case 'template_3':
        return 'تجربة المستخدم UI/UX (قائمة جانبية وسعر ثابت ملتصق)';
      default:
        return id;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-slate-900/60 backdrop-blur-xs select-none" dir="rtl">
      {/* Header Panel */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-xs">
        <div>
          <h3 className="text-sm font-black text-slate-900">معاينة القالب قبل الاختيار</h3>
          <p className="text-xs text-blue-600 font-bold mt-1">
            مفتوح حالياً: {getTemplateNameArabic(templateId)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop/Mobile Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="معاينة سطح المكتب"
            >
              <Monitor size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="معاينة الهاتف المحمول"
            >
              <Smartphone size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onSelect && (
              <button
                type="button"
                onClick={onSelect}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} />
                <span>اعتماد هذا القالب</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-slate-200 font-black text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <X size={14} />
              <span>إغلاق المعاينة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 bg-slate-100 overflow-y-auto flex items-center justify-center p-4">
        {viewMode === 'desktop' ? (
          <div className="w-full h-full bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <LandingRenderer courseId="demo" landingPageId={templateId} isEditable={false} />
            </div>
          </div>
        ) : (
          <div className="relative w-[375px] h-[780px] bg-slate-900 border-[12px] border-slate-950 rounded-[48px] shadow-2xl flex flex-col overflow-hidden shrink-0">
            {/* Phone Notch/Speaker */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
            </div>
            
            {/* Live screen content in genuine mobile 375px viewport iframe */}
            <div className="flex-1 bg-white overflow-hidden mt-6 rounded-b-[36px]">
              <IframePreview>
                <LandingRenderer courseId="demo" landingPageId={templateId} isEditable={false} />
              </IframePreview>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
