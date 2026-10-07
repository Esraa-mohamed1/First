'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import {
  X,
  Search,
  Check,
  Layers,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  Info,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ExamQuestion } from '@/types/academic/exam.types';
import { KaTeXRenderer } from './KaTeXRenderer';
import { getQuestionTypeMeta } from './constants';
import { useBankItems, useLibraries } from '@/hooks/useBank';
import { QuestionBankItem, Library, Question } from '@/types/bank';
import {
  mapBankQuestionToExamQuestion,
  isBankQuestionSupportedInExams,
} from '@/services/bank-exam-mapper';

interface BankPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSelected: (questions: ExamQuestion[]) => void;
  courseTitle?: string;
}

export const BankPickerModal: React.FC<BankPickerModalProps> = ({
  isOpen,
  onClose,
  onAddSelected,
  courseTitle = 'الاختبار الحالي',
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [, startTransition] = useTransition();

  const [selectedLibraryId, setSelectedLibraryId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Debounce search input (~300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setDebouncedSearch(searchInput);
        setCurrentPage(1);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLibraryId, selectedType, selectedDifficulty]);

  // Reset selection on open/close
  useEffect(() => {
    if (!isOpen) {
      setSelectedIds(new Set());
      setSearchInput('');
      setDebouncedSearch('');
      setSelectedLibraryId('all');
      setSelectedType('all');
      setSelectedDifficulty('all');
      setCurrentPage(1);
    }
  }, [isOpen]);

  // 1. Fetch libraries for library selector and name lookup
  const { data: libraries = [] } = useLibraries();
  const libraryMap = useMemo(() => {
    const map = new Map<string | number, Library>();
    libraries.forEach((lib) => {
      map.set(lib.id, lib);
      map.set(String(lib.id), lib);
    });
    return map;
  }, [libraries]);

  // 2. Fetch questions from Content Bank
  const {
    data: itemsResponse,
    isLoading,
    isError,
    refetch,
  } = useBankItems({
    kind: 'question',
    libraryId: selectedLibraryId === 'all' ? undefined : selectedLibraryId,
    difficulty: selectedDifficulty === 'all' ? undefined : (selectedDifficulty as any),
    q: debouncedSearch.trim() || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const rawItems = (itemsResponse?.items || []) as QuestionBankItem[];

  // Client-side question type filter (if specific question type selected)
  const items = useMemo(() => {
    if (selectedType === 'all') return rawItems;
    return rawItems.filter((item) => {
      if (item.kind !== 'question') return false;
      const q = item.question;
      if (selectedType === 'mcq') return q.type === 'mcq' || q.type === 'multi';
      if (selectedType === 'true_false') return q.type === 'tf';
      if (selectedType === 'fill_blanks') return q.type === 'fill';
      if (selectedType === 'short_answer') return q.type === 'short';
      if (selectedType === 'matching') return q.type === 'matching';
      return q.type === selectedType;
    });
  }, [rawItems, selectedType]);

  const totalItems = itemsResponse?.total || items.length;
  const totalPages = itemsResponse?.totalPages || Math.ceil(totalItems / pageSize) || 1;

  if (!isOpen) return null;

  const toggleSelect = (id: string | number, isSupported: boolean) => {
    if (!isSupported) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Build a cache map of mapped questions for currently selected IDs
  const handleConfirmAdd = () => {
    if (selectedIds.size === 0) return;

    const questionsToAdd: ExamQuestion[] = [];
    let skippedCount = 0;

    // Collect all items currently in memory or loaded
    items.forEach((item) => {
      if (selectedIds.has(item.id) && item.kind === 'question') {
        const mapped = mapBankQuestionToExamQuestion(item.question);
        if (mapped.ok) {
          questionsToAdd.push({
            ...mapped.question,
            id: String(Date.now() + Math.random().toString(36).substr(2, 5)),
          });
        } else {
          skippedCount++;
        }
      }
    });

    if (skippedCount > 0) {
      toast.error(`تم تخطي ${skippedCount} من الأسئلة غير المدعومة في الاختبارات`);
    }

    if (questionsToAdd.length > 0) {
      onAddSelected(questionsToAdd);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">إضافة من بنك الأسئلة</h3>
            <p className="text-xs text-slate-500 mt-0.5">إلى {courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="إغلاق"
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث بنص السؤال أو الوسم أو الوحدة..."
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 transition"
            />
            <Search
              size={16}
              className="text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {/* Library filter */}
            {libraries.length > 0 && (
              <select
                value={selectedLibraryId}
                onChange={(e) => setSelectedLibraryId(e.target.value)}
                className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium outline-none focus:border-indigo-500"
              >
                <option value="all">كل المكتبات</option>
                {libraries.map((lib) => (
                  <option key={lib.id} value={lib.id}>
                    {lib.name}
                  </option>
                ))}
              </select>
            )}

            {/* Type filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium outline-none focus:border-indigo-500"
            >
              <option value="all">كل الأنواع</option>
              <option value="mcq">اختيار من متعدد</option>
              <option value="true_false">صح أم خطأ</option>
              <option value="fill_blanks">ملء الفراغات</option>
              <option value="short_answer">إجابة قصيرة</option>
              <option value="matching">مطابقة</option>
            </select>

            {/* Difficulty filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-medium outline-none focus:border-indigo-500"
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
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 size={28} className="animate-spin text-indigo-600 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">جاري تحميل بنك الأسئلة...</p>
            </div>
          ) : isError ? (
            <div className="py-12 text-center space-y-3">
              <AlertCircle size={32} className="text-red-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700">تعذر تحميل الأسئلة من بنك المحتوى</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Search size={28} className="text-slate-300 mx-auto" />
              <b className="text-slate-700 text-sm block">لا توجد أسئلة مطابقة للبحث</b>
              <p className="text-xs text-slate-400">جرب البحث بكلمات أخرى أو تغيير الفلاتر</p>
            </div>
          ) : (
            <>
              <span className="text-xs font-bold text-slate-400 block">
                {totalItems} سؤال متاح
              </span>

              {items.map((item) => {
                const isSelected = selectedIds.has(item.id);
                const q = item.question;
                const mapResult = mapBankQuestionToExamQuestion(q);
                const isSupported = mapResult.ok;
                const lib = libraryMap.get(item.libraryId);

                // Type metadata for badge
                const mappedType = isSupported ? mapResult.question.type : 'mcq';
                const meta = getQuestionTypeMeta(mappedType);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.id, isSupported)}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 text-right ${
                      !isSupported
                        ? 'border-slate-200 bg-slate-50/70 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs cursor-pointer'
                        : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                        !isSupported
                          ? 'border-slate-200 bg-slate-100 text-slate-400'
                          : isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && isSupported && <Check size={13} strokeWidth={3} />}
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="text-sm font-bold text-slate-800 leading-relaxed">
                        <KaTeXRenderer content={q.text} inline />
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        {isSupported ? (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                            {meta.label}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {mapResult.reason}
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono font-semibold">
                          {q.marks || 2} درجات
                        </span>

                        {item.unit && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px]">
                            {item.unit}
                          </span>
                        )}

                        {lib?.name && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium flex items-center gap-1">
                            <Layers size={11} />
                            <span>{lib.name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Pagination bar if multiple pages */}
        {totalPages > 1 && (
          <div className="px-6 py-2.5 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between text-xs text-slate-500">
            <span>صفحة {currentPage} من {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              {selectedIds.size} سؤال محدد
            </span>
            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                إلغاء التحديد
              </button>
            )}
          </div>

          <button
            type="button"
            disabled={selectedIds.size === 0}
            onClick={handleConfirmAdd}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition cursor-pointer"
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
