'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  Clock,
  CheckCircle2,
  Users,
  Award,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Copy,
  Share2,
  SlidersHorizontal,
  HelpCircle,
  FileQuestion,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ExamPayload } from '@/types/academic/exam.types';
import { ExamModal } from '@/components/Academic/Exam/ExamModal';
import { ExamTakingModal } from '@/components/Academic/Exam/ExamTakingModal';
import { getCourses } from '@/services/courses';

export default function AcademicExamsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'scheduled' | 'ended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [selectedExamForEdit, setSelectedExamForEdit] = useState<ExamPayload | null>(null);
  const [selectedExamForPreview, setSelectedExamForPreview] = useState<ExamPayload | null>(null);

  // Local state for registered exams (with initial mock data matching platform standards)
  const [exams, setExams] = useState<ExamPayload[]>([
    {
      id: 101,
      course_id: 1,
      chapter_id: 2,
      unit_id: 2,
      title: 'اختبار المفاهيم البرمجية والخوارزميات',
      description: 'اختبار تقييمي شامل يغطي مفاهيم المتغيرات، الدوال، وحل المسائل البرمجية بدقة.',
      type: 'quiz',
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          title: 'ما هي قيمة $x$ في المعادلة الرياضية $2x + 6 = 14$ ؟',
          explanation: 'بطرح 6 من الطرفين نحصل على $2x = 8$، وبقسمة الطرفين على 2 تكون النتيجة $x = 4$.',
          conditions: { score: 2, isRequired: true, multipleCorrectAnswer: false },
          options: [
            { id: '1', letter: 'أ', text: '$x = 3$', is_correct: false },
            { id: '2', letter: 'ب', text: '$x = 4$', is_correct: true },
            { id: '3', letter: 'ج', text: '$x = 5$', is_correct: false },
            { id: '4', letter: 'د', text: '$x = 8$', is_correct: false },
          ],
        },
        {
          id: 'q2',
          type: 'true_false',
          title: 'تعتبر الخوارزميات مجموعة من الخطوات المنطقية المرتبة لحل مشكلة محددة.',
          explanation: 'الخوارزمية هي بالفعل سلسلة من الخطوات المنطقية الواضحة التي تؤدي لحل المشكلة.',
          trueFalseValue: true,
          conditions: { score: 1, isRequired: true },
        },
        {
          id: 'q3',
          type: 'fill_blanks',
          title: 'املأ الفراغ التالي في مبادئ البرمجة الكائنية:',
          blanksTemplate: 'المبدأ الذي يسمح للكائن بإخفاء تفاصيله الداخلية يسمى {dash} ومبدأ إعادة استخدام الخصائص يسمى {dash}.',
          blanksAnswers: ['التغليف', 'الوراثة'],
          conditions: { score: 3, isRequired: true },
        },
      ],
      settings: {
        basic: {
          timeLimit: 25,
          timeUnit: 'minutes',
          hideTimer: false,
          feedbackMode: 'retake',
          allowedAttempts: 3,
          passingScorePercentage: 70,
          maxQuestionsToAnswer: 3,
          shuffleQuestions: true,
          shuffleOptions: true,
          showSolutionOnSubmit: true,
          enableCertificate: true,
          instructions: 'يرجى قراءة الأسئلة بعناية والتأكد من مراجعة الإجابات قبل التسليم.',
          completionMessage: 'تهانينا! لقد أتممت اختبار المفاهيم بنجاح.',
        },
        advanced: {
          autoStart: true,
          questionLayout: 'single',
          questionOrder: 'random',
          hideQuestionNumber: false,
          shortAnswerCharLimit: 250,
          essayCharLimit: 1000,
        },
      },
    },
    {
      id: 102,
      title: 'اختبار القياس والتقييم العام (مستقل)',
      description: 'اختبار قياس مهارات التفكير المنطقي والرياضي العام للطلاب.',
      type: 'quiz',
      chapter_id: 0,
      questions: [
        {
          id: 'q201',
          type: 'mcq',
          title: 'أي من الكسور التالية يكافئ الكسر $\\frac{3}{4}$ ؟',
          conditions: { score: 2, isRequired: true },
          options: [
            { id: '1', letter: 'أ', text: '$\\frac{6}{8}$', is_correct: true },
            { id: '2', letter: 'ب', text: '$\\frac{5}{9}$', is_correct: false },
            { id: '3', letter: 'ج', text: '$\\frac{9}{15}$', is_correct: false },
            { id: '4', letter: 'د', text: '$\\frac{2}{3}$', is_correct: false },
          ],
        },
      ],
      settings: {
        basic: {
          timeLimit: 15,
          timeUnit: 'minutes',
          hideTimer: false,
          feedbackMode: 'after_submit',
          allowedAttempts: 1,
          passingScorePercentage: 60,
          maxQuestionsToAnswer: 1,
          showSolutionOnSubmit: true,
        },
        advanced: {
          autoStart: false,
          questionLayout: 'single',
          questionOrder: 'fixed',
          hideQuestionNumber: false,
          shortAnswerCharLimit: 200,
          essayCharLimit: 500,
        },
      },
    },
  ]);

  // Filtered exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchSearch =
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exam.description && exam.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (filterStatus === 'published') return (exam.questions?.length || 0) > 0;
      if (filterStatus === 'draft') return (exam.questions?.length || 0) === 0;
      return true;
    });
  }, [exams, filterStatus, searchQuery]);

  // Overall Statistics
  const totalExamsCount = exams.length;
  const totalQuestionsCount = exams.reduce((sum, e) => sum + (e.questions?.length || 0), 0);

  // Handle Delete
  const handleDeleteExam = (id?: number) => {
    if (!id) return;
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الاختبار نهائياً؟')) {
      setExams((prev) => prev.filter((e) => e.id !== id));
      toast.success('تم حذف الاختبار بنجاح');
    }
  };

  // Handle Duplicate
  const handleDuplicateExam = (exam: ExamPayload) => {
    const newExam: ExamPayload = {
      ...exam,
      id: Date.now(),
      title: `${exam.title} (نسخة مكررة)`,
    };
    setExams((prev) => [newExam, ...prev]);
    toast.success('تم تكرار الاختبار بنجاح');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-800 p-6 md:p-8 space-y-8" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileQuestion className="w-6 h-6" />
            </div>
            <span>إدارة الاختبارات والتقييمات</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            أنشئ وراقب الاختبارات التقييمية المرتبطة بالدورات أو الاختبارات المستقلة مع تصحيح وتحليلات فورية.
          </p>
        </div>

        {/* Create Exam CTA */}
        <button
          type="button"
          onClick={() => {
            setSelectedExamForEdit(null);
            setIsExamModalOpen(true);
          }}
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>إنشاء اختبار جديد</span>
        </button>
      </div>

      {/* KPI Overview Cards (Matching Prototype) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">إجمالي الاختبارات</span>
          <b className="text-2xl font-bold text-slate-900 block font-mono">
            {totalExamsCount}
          </b>
          <span className="text-[11px] text-blue-600 font-medium">متاحة ومسجلة في المنصة</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">مجموع الأسئلة</span>
          <b className="text-2xl font-bold text-slate-900 block font-mono">
            {totalQuestionsCount}
          </b>
          <span className="text-[11px] text-emerald-600 font-medium">سؤال جاهز ومصحح</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">متوسط درجات الطلاب</span>
          <b className="text-2xl font-bold text-slate-900 block font-mono">
            84.5%
          </b>
          <span className="text-[11px] text-emerald-600 font-medium">أداء ممتاز للطلاب</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">نسبة النجاح العامة</span>
          <b className="text-2xl font-bold text-slate-900 block font-mono">
            91.2%
          </b>
          <span className="text-[11px] text-blue-600 font-medium">فوق الحد الأدنى للنجاح</span>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({exams.length})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                filterStatus === 'published'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              منشور ({exams.filter((e) => (e.questions?.length || 0) > 0).length})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                filterStatus === 'draft'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              مسودة ({exams.filter((e) => (e.questions?.length || 0) === 0).length})
            </button>
            <button
              onClick={() => setFilterStatus('scheduled')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                filterStatus === 'scheduled'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              مجدول (0)
            </button>
            <button
              onClick={() => setFilterStatus('ended')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                filterStatus === 'ended'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              منتهي (0)
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="البحث في الاختبارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => {
            const questionsCount = exam.questions?.length || 0;
            const isPublished = questionsCount > 0;
            const timeLimit = exam.settings?.basic?.timeLimit || 0;
            const isCourseLinked = !!exam.chapter_id && exam.chapter_id > 0;

            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 text-right"
              >
                {/* Card Top: Badges & Title */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        isPublished
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span>{isPublished ? 'منشور' : 'مسودة'}</span>
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                        isCourseLinked
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      {isCourseLinked ? 'مرتبط بدورة' : 'اختبار مستقل'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {exam.title}
                  </h3>

                  {exam.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {exam.description}
                    </p>
                  )}
                </div>

                {/* Card Middle: Meta details */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">الأسئلة</span>
                    <b className="font-bold text-slate-800 font-mono">{questionsCount}</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">المدة</span>
                    <b className="font-bold text-slate-800 font-mono">
                      {timeLimit > 0 ? `${timeLimit} دقيقة` : 'مفتوح'}
                    </b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">الاجتياز</span>
                    <b className="font-bold text-slate-800 font-mono">
                      {exam.settings?.basic?.passingScorePercentage || 60}%
                    </b>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedExamForPreview(exam)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>معاينة كطالب</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedExamForEdit(exam);
                      setIsExamModalOpen(true);
                    }}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                    title="تعديل الاختبار"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicateExam(exam)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                    title="تكرار الاختبار"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="حذف الاختبار"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State (Matching Prototype) */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">لا توجد اختبارات مضافة حتى الآن</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            أنشئ أول اختبار لتقييم طلابك بسهولة، مع خيارات مرنة لتحديد الأسئلة، الأوزان، ونسب النجاح.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedExamForEdit(null);
              setIsExamModalOpen(true);
            }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ابدأ بإنشاء اختبار جديد</span>
          </button>
        </div>
      )}

      {/* Creation & Editing Modal (Step by Step with Course/Independent Choice) */}
      {isExamModalOpen && (
        <ExamModal
          isOpen={isExamModalOpen}
          onClose={() => setIsExamModalOpen(false)}
          unitId={selectedExamForEdit?.chapter_id || 0}
          courseId={selectedExamForEdit?.course_id}
          unitTitle={selectedExamForEdit ? selectedExamForEdit.title : ''}
          initialData={selectedExamForEdit}
          allowTargetSelection={!selectedExamForEdit?.chapter_id || selectedExamForEdit?.chapter_id === 0}
          onExamSaved={() => {
            setIsExamModalOpen(false);
          }}
        />
      )}

      {/* Interactive Preview Modal */}
      {selectedExamForPreview && (
        <ExamTakingModal
          isOpen={!!selectedExamForPreview}
          onClose={() => setSelectedExamForPreview(null)}
          exam={selectedExamForPreview}
          isPreviewMode={true}
        />
      )}
    </div>
  );
}
