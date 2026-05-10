'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, MessageSquare, BookOpen, 
  Download, ExternalLink, User, Calendar
} from 'lucide-react';
import { Lesson } from '@/types/course';
import { cn } from '@/lib/utils';

interface LessonContentProps {
  lesson: Lesson;
}

export const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'resources' | 'comments'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'notes', label: 'Instructor Notes', icon: FileText },
    { id: 'resources', label: 'Resources', icon: Download },
    { id: 'comments', label: 'Discussions', icon: MessageSquare },
  ];

  return (
    <div className="bg-gray-950/30 rounded-3xl border border-white/5 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex items-center gap-1 p-2 bg-white/[0.02] border-b border-white/5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-white/5 text-white shadow-lg" 
                : "text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-blue-500" : "text-white/20")} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Instructor</p>
                      <p className="text-sm font-bold text-white">Alex Rivers</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/5" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Last Updated</p>
                      <p className="text-sm font-bold text-white">May 2024</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-bold text-white mb-4">About this lesson</h3>
                  <p className="text-white/60 leading-relaxed">
                    {lesson.description || "No description available for this lesson."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="w-5 h-5 text-blue-500" />
                    <h4 className="font-bold text-white">Key Takeaways</h4>
                  </div>
                  <ul className="space-y-3">
                    {['Understand the fundamentals of premium UI design', 'Learn advanced Framer Motion techniques', 'Implement secure streaming architectures'].map((note, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-white/60 leading-relaxed">
                  {lesson.notes || "Instructor hasn't added additional notes yet."}
                </p>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.resources?.map((resource) => (
                  <a 
                    key={resource.id}
                    href={resource.url}
                    className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white/40 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-sm">{resource.title}</h5>
                        <p className="text-[10px] font-bold text-white/20 uppercase">{resource.type}</p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                  </a>
                ) || (
                  <div className="col-span-2 py-12 flex flex-col items-center justify-center text-center opacity-40">
                    <Download className="w-12 h-12 mb-4" />
                    <p className="font-bold">No downloadable resources</p>
                    <p className="text-xs">This lesson doesn't have any attached files.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <textarea 
                      placeholder="Ask a question or share your thoughts..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end">
                      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>

                <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                  <MessageSquare className="w-12 h-12 mb-4" />
                  <p className="font-bold">Be the first to comment</p>
                  <p className="text-xs">Start a discussion with fellow students.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Mock data for Info icon used in Overview/Notes
const Info = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
