'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, X } from 'lucide-react';

interface ResumePromptProps {
  /** Seconds already watched */
  watchedSeconds: number;
  /** Whether to show the prompt */
  visible: boolean;
  /** Called when user clicks "Resume" */
  onResume: () => void;
  /** Called when user clicks "Start from beginning" */
  onDismiss: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ResumePrompt({
  watchedSeconds,
  visible,
  onResume,
  onDismiss,
}: ResumePromptProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="resume-prompt"
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="
            absolute top-3 left-1/2 -translate-x-1/2 z-40
            flex items-center gap-3
            bg-black/80 backdrop-blur-md
            border border-white/15
            rounded-2xl px-4 py-2.5
            shadow-2xl
            whitespace-nowrap
          "
          role="alert"
          aria-live="polite"
        >
          {/* Label */}
          <span className="text-white/80 text-xs font-bold">
            استئناف من{' '}
            <span className="text-blue-400 font-black">{formatTime(watchedSeconds)}</span>
            ؟
          </span>

          {/* Resume button */}
          <button
            id="resume-video-btn"
            onClick={onResume}
            className="
              flex items-center gap-1.5
              bg-blue-600 hover:bg-blue-500
              text-white text-xs font-black
              px-3 py-1.5 rounded-xl
              transition-all duration-150
              active:scale-95
              shadow-lg shadow-blue-600/30
            "
          >
            <Play size={11} fill="white" />
            استئناف
          </button>

          {/* Start from beginning */}
          <button
            id="restart-video-btn"
            onClick={onDismiss}
            title="البدء من الأول"
            className="
              flex items-center gap-1
              text-white/50 hover:text-white/80
              text-xs font-bold
              transition-colors duration-150
            "
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">من البداية</span>
          </button>

          {/* Close */}
          <button
            id="dismiss-resume-btn"
            onClick={onDismiss}
            title="إغلاق"
            className="text-white/30 hover:text-white/60 transition-colors p-0.5"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
