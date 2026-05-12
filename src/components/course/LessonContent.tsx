'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, MessageSquare, BookOpen, 
  Download, ExternalLink, User, Calendar,
  MessageCircle, StickyNote, Info, Star,
  Sparkles, Trophy, Lightbulb, Heart
} from 'lucide-react';
import { Lesson } from '@/types/course';
import { cn } from '@/lib/utils';

interface LessonContentProps {
  lesson: Lesson;
}

export const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'resources' | 'comments'>('overview');

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: BookOpen, color: 'blue' },
    { id: 'comments', label: 'النقاشات', icon: MessageCircle, color: 'purple' },
    { id: 'notes', label: 'أهم النقاط', icon: Lightbulb, color: 'amber' },
    { id: 'resources', label: 'الحقيبة التعليمية', icon: Trophy, color: 'green' },
  ];

  return (
    <div className="bg-white">
      {/* Playful Tabs */}
      <div className="flex items-center gap-3 p-8 bg-slate-50/50 border-b-2 border-slate-50 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all whitespace-nowrap border-2",
              activeTab === tab.id 
                ? "bg-white text-slate-900 border-slate-200 shadow-xl shadow-slate-200/50 scale-105" 
                : "text-slate-400 border-transparent hover:bg-white/50 hover:border-slate-100"
            )}
          >
            <tab.icon className={cn(
              "w-5 h-5", 
              activeTab === tab.id ? `text-${tab.color}-500` : "text-slate-300"
            )} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-10">
                <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-inner">
                  <h3 className="text-3xl font-black text-slate-900 mb-6">وصف الدرس</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {lesson.description || "في هذا الدرس، سننطلق في رحلة ممتعة لاستكشاف أسرار العلم والمعرفة. استعد جيداً!"}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-10">
                <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-amber-600/30">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-xl flex items-center justify-center">
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-3xl font-black">أهم ما تعلمناه اليوم</h4>
                  </div>
                  <ul className="space-y-6">
                    {[
                      'كيف نبني واجهات جميلة واحترافية بسهولة',
                      'أسرار الحركة والتفاعل في تطبيقات الويب الحديثة',
                      'طرق حماية أفكارك ومحتواك من السرقة'
                    ].map((note, i) => (
                      <li key={i} className="flex items-start gap-5 text-white text-lg font-black">
                        <div className="w-3 h-3 rounded-full bg-white mt-3 shadow-lg flex-shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-slate-50 rounded-[3rem] p-10 border-2 border-slate-100 shadow-inner">
                  <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <StickyNote className="text-blue-500" />
                    مفكرتك الشخصية
                  </h4>
                  <textarea 
                    placeholder="اكتب هنا كل ما أعجبك في الدرس..."
                    className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-blue-400 min-h-[250px] resize-none transition-all shadow-sm font-bold text-lg"
                  />
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {lesson.resources && lesson.resources.length > 0 ? (
                  lesson.resources.map((resource) => (
                    <motion.a 
                      key={resource.id}
                      href={resource.url}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="flex items-center justify-between p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-green-400 hover:shadow-2xl transition-all group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-green-50 border-2 border-green-100 flex items-center justify-center group-hover:bg-green-100 transition-all">
                          <FileText className="w-10 h-10 text-green-500" />
                        </div>
                        <div>
                          <h5 className="font-black text-slate-900 text-xl">{resource.title}</h5>
                          <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mt-1">{resource.type}</p>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-green-500 group-hover:text-white transition-all">
                        <Download className="w-6 h-6" />
                      </div>
                    </motion.a>
                  ))
                ) : (
                  <div className="col-span-2 py-32 flex flex-col items-center justify-center text-center opacity-30">
                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-8">
                      <Trophy className="w-12 h-12" />
                    </div>
                    <p className="text-2xl font-black">حقيبتك التعليمية قيد التجهيز</p>
                    <p className="text-lg font-bold mt-2">سنضيف لك ملفات رائعة قريباً جداً!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-12">
                <div className="flex gap-8 bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 shadow-inner">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white border-2 border-slate-200 flex-shrink-0 overflow-hidden shadow-md">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <textarea 
                      placeholder="هل لديك سؤال يا بطل؟ شاركنا ما يدور في ذهنك..."
                      className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-purple-400 min-h-[150px] resize-none transition-all shadow-sm font-bold text-lg"
                    />
                    <div className="flex justify-end">
                      <button className="px-12 py-5 bg-slate-900 hover:bg-purple-600 text-white rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-slate-900/10 active:scale-95">
                        إرسال السؤال
                      </button>
                    </div>
                  </div>
                </div>

                <div className="py-24 flex flex-col items-center justify-center text-center opacity-30">
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-8">
                    <MessageSquare className="w-12 h-12" />
                  </div>
                  <p className="text-2xl font-black">كن أول من يبدأ النقاش الممتع</p>
                  <p className="text-lg font-bold mt-2">اسأل أي سؤال وسنكون سعداء جداً بمساعدتك.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
