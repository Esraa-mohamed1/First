'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Database,
  Check,
  Plus,
  Layers,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { ExamQuestion, QuestionType } from '@/types/academic/exam.types';
import { KaTeXRenderer } from './KaTeXRenderer';
import { getQuestionTypeMeta } from './constants';

interface BankPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSelected: (questions: ExamQuestion[]) => void;
  courseTitle?: string;
}

// Sample question bank items matching the prototype
interface BankQuestionItem {
  id: string;
  question: ExamQuestion;
  libraryName: string;
  unitName: string;
  difficulty?: 'easy' | 'mid' | 'hard';
}

const SAMPLE_BANK: BankQuestionItem[] = [
  {
    id: 'b1',
    libraryName: 'بنك أسئلة الفيزياء العامة',
    unitName: 'الوحدة 1: الميكانيكا',
    difficulty: 'easy',
    question: {
      id: 'bq1',
      type: 'mcq',
      title: 'ما هي وحدة قياس القوة في النظام الدولي للوحدات (SI)؟',
      explanation: 'وحدة القوة هي النيوتن (N) وتكافئ $kg \\cdot m/s^2$.',
      conditions: { score: 2, isRequired: true },
      options: [
        { id: '1', letter: 'أ', text: 'النيوتن (N)', is_correct: true },
        { id: '2', letter: 'ب', text: 'الجول (J)', is_correct: false },
        { id: '3', letter: 'ج', text: 'الوات (W)', is_correct: false },
        { id: '4', letter: 'د', text: 'الباسكال (Pa)', is_correct: false },
      ],
    },
  },
  {
    id: 'b2',
    libraryName: 'بنك أسئلة الرياضيات',
    unitName: 'الوحدة 2: التفاضل والتكامل',
    difficulty: 'mid',
    question: {
      id: 'bq2',
      type: 'mcq',
      title: 'أوجد قيمة النهاية التالية: $\\lim_{x \\to 0} \\frac{\\sin x}{x}$',
      explanation: 'قيمة النهاية الشهيرة $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$.',
      conditions: { score: 2, isRequired: true },
      options: [
        { id: '1', letter: 'أ', text: '1', is_correct: true },
        { id: '2', letter: 'ب', text: '0', is_correct: false },
        { id: '3', letter: 'ج', text: '\\infty', is_correct: false },
        { id: '4', letter: 'د', text: '-1', is_correct: false },
      ],
    },
  },
  {
    id: 'b3',
    libraryName: 'بنك أسئلة الكيمياء',
    unitName: 'الوحدة 1: الروابط الكيميائية',
    difficulty: 'easy',
    question: {
      id: 'bq3',
      type: 'true_false',
      title: 'تتكون الرابطة التساهمية نتيجة مشاركة الإلكترونات بين ذرتين.',
      explanation: 'الرابطة التساهمية تنشأ بمشاركة زوج أو أكثر من الإلكترونات بين الذرات.',
      trueFalseValue: true,
      conditions: { score: 1, isRequired: true },
    },
  },
  {
    id: 'b4',
    libraryName: 'بنك أسئلة الحاسب والبرمجة',
    unitName: 'الوحدة 3: الخوارزميات',
    difficulty: 'hard',
    question: {
      id: 'bq4',
      type: 'fill_blanks',
      title: 'اكمل الفراغات في الخوارزميات:',
      blanksTemplate: 'التعقيد الزمني لخوارزمية البحث الثنائي هو {dash} بينما خوارزمية البحث الخطي هو {dash}.',
      blanksAnswers: ['O(log n)', 'O(n)'],
      conditions: { score: 3, isRequired: true },
    },
  },
];

export const BankPickerModal: React.FC<BankPickerModalProps> = ({
  isOpen,
  onClose,
  onAddSelected,
  courseTitle = 'الاختبار الحالي',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const filteredItems = SAMPLE_BANK.filter((item) => {
    const q = item.question;
    const matchSearch =
      !searchQuery ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.libraryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unitName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = selectedType === 'all' || q.type === selectedType;
    const matchDiff = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;

    return matchSearch && matchType && matchDiff;
  });

  const selectedQuestions = SAMPLE_BANK.filter((item) => selectedIds.has(item.id)).map(
    (item) => ({ ...item.question, id: Date.now() + Math.random().toString() })
  );

  const totalSelectedMarks = selectedQuestions.reduce(
    (sum, q) => sum + (q.conditions?.score || 1),
    0
  );

  const handleConfirmAdd = () => {
    if (selectedQuestions.length === 0) return;
    onAddSelected(selectedQuestions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">إضافة من بنك الأسئلة</h3>
            <p className="text-xs text-slate-500 mt-0.5">إلى {courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-6 py-3 border-b border-slate-100 space-y-3 bg-slate-50/50">
          {/* Search Box */}
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بنص السؤال أو الوسم أو الوحدة..."
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 transition"
            />
            <Search size={16} className="text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {/* Type filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium outline-none focus:border-blue-500"
            >
              <option value="all">كل الأنواع</option>
              <option value="mcq">اختيار من متعدد</option>
              <option value="true_false">صح أم خطأ</option>
              <option value="fill_blanks">ملء الفراغات</option>
              <option value="short_answer">إجابة قصيرة</option>
            </select>

            {/* Difficulty filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium outline-none focus:border-blue-500"
            >
              <option value="all">كل المستويات</option>
              <option value="easy">سهل</option>
              <option value="mid">متوسط</option>
              <option value="hard">صعب</option>
            </select>
          </div>
        </div>

        {/* List of Questions */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          <span className="text-xs font-bold text-slate-400 block">
            {filteredItems.length} سؤال متاح
          </span>

          {filteredItems.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Search size={28} className="text-slate-300 mx-auto" />
              <b className="text-slate-700 text-sm block">لا توجد أسئلة مطابقة للبحث</b>
              <p className="text-xs text-slate-400">جرب البحث بكلمات أخرى أو تغيير الفلاتر</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedIds.has(item.id);
              const meta = getQuestionTypeMeta(item.question.type);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 text-right ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="text-sm font-bold text-slate-800 leading-relaxed">
                      <KaTeXRenderer content={item.question.title} inline />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {meta.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono font-semibold">
                        {item.question.conditions?.score || 1} درجات
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px]">
                        {item.unitName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-medium flex items-center gap-1">
                        <Layers size={11} />
                        <span>{item.libraryName}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              {selectedIds.size} سؤال محدد • {totalSelectedMarks} درجة
            </span>
            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                إلغاء التحديد
              </button>
            )}
          </div>

          <button
            type="button"
            disabled={selectedIds.size === 0}
            onClick={handleConfirmAdd}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            {selectedIds.size > 0
              ? `إضافة ${selectedIds.size} سؤال للاختبار`
              : 'حدد الأسئلة التي تريد إضافتها'}
          </button>
        </div>
      </div>
    </div>
  );
};
