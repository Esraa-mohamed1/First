import academyApi from '@/lib/academy-api';
import { ApiResponse } from '@/types/api';
import {
  BankItem,
  Library,
  GetBankItemsParams,
  PaginatedBankItemsResponse,
  CreateLibraryPayload,
  UpdateLibraryPayload,
  CreateBankItemPayload,
  UpdateBankItemPayload,
  BatchDeletePayload,
  BatchDuplicatePayload,
  BatchMovePayload,
} from '@/types/bank';

/**
 * Single toggle flag to switch between the in-memory Mock adapter
 * and the real backend API endpoints.
 *
 * NOTE: When backend endpoints are ready, toggle this flag to false or
 * set NEXT_PUBLIC_USE_MOCK_BANK=false in the environment variables.
 */
export const USE_MOCK_BANK: boolean =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_USE_MOCK_BANK !== undefined
    ? process.env.NEXT_PUBLIC_USE_MOCK_BANK === 'true'
    : true;

// =============================================================================
// IN-MEMORY MOCK SEED DATA & ADAPTER
// =============================================================================

let mockLibraries: Library[] = [
  {
    id: 'lib-1',
    name: 'بنك أسئلة الفيزياء العامة',
    description: 'أسئلة الميكانيكا، الديناميكا الحرارية، والكهرومغناطيسية للمرحلة الثانوية والجامعية',
    color: '#6366F1', // Indigo
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    itemCounts: {
      lesson: 2,
      video: 1,
      question: 4,
      total: 7,
    },
  },
  {
    id: 'lib-2',
    name: 'بنك أسئلة الرياضيات والتحليل',
    description: 'تفاضل، تكامل، جبر خطي وهندسة تحليلية مع نماذج الإجابات التفصيلية',
    color: '#3B82F6', // Blue
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    itemCounts: {
      lesson: 1,
      video: 2,
      question: 3,
      total: 6,
    },
  },
  {
    id: 'lib-3',
    name: 'بنك شروحات ومستندات الكيمياء',
    description: 'دروس الكيمياء العضوية وغير العضوية وتجارب المختبر الافتراضي',
    color: '#10B981', // Emerald
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    itemCounts: {
      lesson: 3,
      video: 1,
      question: 2,
      total: 6,
    },
  },
  {
    id: 'lib-4',
    name: 'مكتبة الفيديوهات والتسجيلات التعليمية',
    description: 'محاضرات مسجلة وشروحات مرئية بجودة عالية لجميع المواد',
    color: '#F59E0B', // Amber
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    itemCounts: {
      lesson: 0,
      video: 4,
      question: 0,
      total: 4,
    },
  },
];

let mockBankItems: BankItem[] = [
  // Physics Questions & Items
  {
    id: 'item-1',
    libraryId: 'lib-1',
    kind: 'question',
    unit: 'الوحدة الأولى: الميكانيكا الكلاسيكية',
    usageCount: 14,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['فيزياء', 'قوة', 'SI'],
    question: {
      id: 'q-1',
      type: 'mcq',
      text: 'ما هي وحدة قياس القوة في النظام الدولي للوحدات (SI)؟',
      marks: 2,
      difficulty: 'easy',
      tags: ['فيزياء', 'وحدات'],
      explanation: 'وحدة القوة هي النيوتن (N) وتكافئ kg·m/s² حسب القانون الثاني لنيوتن.',
      options: [
        { id: 'opt-1', letter: 'أ', text: 'النيوتن (N)', isCorrect: true },
        { id: 'opt-2', letter: 'ب', text: 'الجول (J)', isCorrect: false },
        { id: 'opt-3', letter: 'ج', text: 'الوات (W)', isCorrect: false },
        { id: 'opt-4', letter: 'د', text: 'الباسكال (Pa)', isCorrect: false },
      ],
      correct: 'opt-1',
    },
  },
  {
    id: 'item-2',
    libraryId: 'lib-1',
    kind: 'question',
    unit: 'الوحدة الثانية: الديناميكا الحرارية',
    usageCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    tags: ['ديناميكا حرارية', 'طاقة'],
    question: {
      id: 'q-2',
      type: 'tf',
      text: 'ينص القانون الأول للديناميكا الحرارية على أن الطاقة لا تفنى ولا تستحدث من العدم بل تتحول من شكل لآخر.',
      marks: 1,
      difficulty: 'easy',
      explanation: 'القانون الأول هو نص مبدأ حفظ الطاقة في النظم المغلقة والمعزولة.',
      correct: true,
    },
  },
  {
    id: 'item-3',
    libraryId: 'lib-1',
    kind: 'question',
    unit: 'الوحدة الثالثة: الكهرومغناطيسية',
    usageCount: 5,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    tags: ['كهرباء', 'قانون أوم'],
    question: {
      id: 'q-3',
      type: 'numeric',
      text: 'احسب شدة التيار المار في مقاومة قيمتها 10 أوم عند تطبيق فرق جهد قدره 50 فولت.',
      marks: 3,
      difficulty: 'mid',
      explanation: 'شدة التيار I = V / R = 50 / 10 = 5 أمبير.',
      value: 5,
      tol: 0.1,
      unit: 'A',
    },
  },
  {
    id: 'item-4',
    libraryId: 'lib-1',
    kind: 'question',
    unit: 'الوحدة الرابعة: الميكانيكا',
    usageCount: 3,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    tags: ['مطابقة', 'كميات فيزيائية'],
    question: {
      id: 'q-4',
      type: 'matching',
      text: 'صل كل كمية فيزيائية بوحدة القياس المكافئة لها:',
      marks: 4,
      difficulty: 'mid',
      pairs: [
        { id: 'p-1', left: 'الشغل والطاقة', right: 'الجول (Joule)' },
        { id: 'p-2', left: 'القدرة الكهربائية', right: 'الوات (Watt)' },
        { id: 'p-3', left: 'التردد الموجي', right: 'الهرتز (Hz)' },
        { id: 'p-4', left: 'الضغط الجوي', right: 'الباسكال (Pa)' },
      ],
    },
  },
  {
    id: 'item-5',
    libraryId: 'lib-1',
    kind: 'lesson',
    title: 'ملخص شامل لقوانين نيوتن في الحركة الدائرية',
    unit: 'الوحدة الأولى: الميكانيكا',
    content: 'يستعرض هذا الدرس ملخصاً مبسطاً لقوانين الحركة الثلاثة وتطبيقات الجاذبية المركزية مع أمثلة محلولة.',
    pdfUrl: 'https://example.com/physics-newton-laws.pdf',
    usageCount: 22,
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    tags: ['ملخص', 'PDF', 'نيوتن'],
  },
  {
    id: 'item-6',
    libraryId: 'lib-1',
    kind: 'lesson',
    title: 'دليل التجارب المعملية للموائع والضغط',
    unit: 'الوحدة الثانية: الموائع',
    content: 'خطوات إجراء تجربة مبدأ باسكال وقاعدة أرخميدس لحساب كثافة الأجسام المغمورة.',
    pdfUrl: 'https://example.com/fluids-lab-guide.pdf',
    usageCount: 11,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    tags: ['مختبر', 'تجارب'],
  },
  {
    id: 'item-7',
    libraryId: 'lib-1',
    kind: 'video',
    title: 'شرح تجربة البندول البسيط وحساب عجلة الجاذبية',
    unit: 'الوحدة الثالثة: الحركة التوافقية',
    source: 'url',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 740,
    usageCount: 19,
    createdAt: new Date(Date.now() - 86400000 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['فيديو', 'بندول'],
  },

  // Math Questions & Items
  {
    id: 'item-8',
    libraryId: 'lib-2',
    kind: 'question',
    unit: 'الوحدة الأولى: النهايات والاتصال',
    usageCount: 17,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    tags: ['رياضيات', 'نهايات', 'تفاضل'],
    question: {
      id: 'q-5',
      type: 'mcq',
      text: 'أوجد قيمة النهاية التالية: lim (x -> 0) [sin(x) / x]',
      marks: 2,
      difficulty: 'mid',
      explanation: 'قيمة النهاية الشهيرة lim (x -> 0) [sin(x) / x] = 1.',
      options: [
        { id: 'm-1', letter: 'أ', text: '1', isCorrect: true },
        { id: 'm-2', letter: 'ب', text: '0', isCorrect: false },
        { id: 'm-3', letter: 'ج', text: 'غير معرفة', isCorrect: false },
        { id: 'm-4', letter: 'د', text: '-1', isCorrect: false },
      ],
      correct: 'm-1',
    },
  },
  {
    id: 'item-9',
    libraryId: 'lib-2',
    kind: 'question',
    unit: 'الوحدة الثانية: قواعد الاشتقاق',
    usageCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 11).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    tags: ['مشتقات', 'تفاضل'],
    question: {
      id: 'q-6',
      type: 'multi',
      text: 'أي من الدوال الآتية مشتقتها الأولى تساوي دالة سالبة لجميع قيم x الموجبة؟',
      marks: 3,
      difficulty: 'hard',
      options: [
        { id: 'mu-1', letter: 'أ', text: 'f(x) = -x²', isCorrect: true },
        { id: 'mu-2', letter: 'ب', text: 'f(x) = 1/x', isCorrect: true },
        { id: 'mu-3', letter: 'ج', text: 'f(x) = x³', isCorrect: false },
        { id: 'mu-4', letter: 'د', text: 'f(x) = e^x', isCorrect: false },
      ],
      correct: ['mu-1', 'mu-2'],
    },
  },
  {
    id: 'item-10',
    libraryId: 'lib-2',
    kind: 'question',
    unit: 'الوحدة الثالثة: التكامل المحدد',
    usageCount: 9,
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    tags: ['تكامل', 'مساحات'],
    question: {
      id: 'q-7',
      type: 'fill',
      text: 'تكامل الدالة الثابتة f(x) = k بالنسبة لـ x ينتج {dash} + C.',
      marks: 2,
      difficulty: 'easy',
      blanksTemplate: 'تكامل الدالة الثابتة f(x) = k بالنسبة لـ x ينتج {dash} + C.',
      correct: ['k*x', 'kx'],
    },
  },
  {
    id: 'item-11',
    libraryId: 'lib-2',
    kind: 'lesson',
    title: 'شرح متطابقات الدوال المثلثية وعلاقات فيثاغورس',
    unit: 'الوحدة الأولى: حساب المثلثات',
    content: 'دليل كامل لجميع القوانين المثلثية وتحويل المجموع إلى حاصل ضرب والعكس.',
    pdfUrl: 'https://example.com/trigonometry-identities.pdf',
    usageCount: 30,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ['مثلثات', 'قوانين'],
  },
  {
    id: 'item-12',
    libraryId: 'lib-2',
    kind: 'video',
    title: 'طريقة استخدام قاعدة لوبيتال لحساب النهايات غير المعينة',
    unit: 'الوحدة الثانية: تطبيقات التفاضل',
    source: 'upload',
    url: 'https://example.com/lhopital-rule.mp4',
    duration: 1120,
    usageCount: 26,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['لوبيتال', 'فيديو'],
  },
  {
    id: 'item-13',
    libraryId: 'lib-2',
    kind: 'video',
    title: 'تمارين مكثفة على التكامل بالتعويض والأجزاء',
    unit: 'الوحدة الثالثة: طرق التكامل',
    source: 'url',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 1850,
    usageCount: 15,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    tags: ['تكامل بالأجزاء', 'حل تمارين'],
  },

  // Chemistry Items
  {
    id: 'item-14',
    libraryId: 'lib-3',
    kind: 'question',
    unit: 'الوحدة الأولى: الروابط الكيميائية',
    usageCount: 6,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['كيمياء', 'روابط'],
    question: {
      id: 'q-8',
      type: 'short',
      text: 'ما هو الاسم العلمي للرابطة التي تنشأ بين أيون موجب وأيون سالب؟',
      marks: 2,
      difficulty: 'easy',
      explanation: 'الرابطة الأيونية (Ionic bond) تنشأ من التجاذب الكهروستاتيكي بين الأيونات.',
      correct: 'الرابطة الأيونية',
      sampleAnswer: 'الرابطة الأيونية / Ionic Bond',
    },
  },
  {
    id: 'item-15',
    libraryId: 'lib-3',
    kind: 'question',
    unit: 'الوحدة الثانية: الكيمياء الكهربية',
    usageCount: 4,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    tags: ['كيمياء كهربية', 'مقال'],
    question: {
      id: 'q-9',
      type: 'essay',
      text: 'اشرح آلية عمل خلية دانيال الجلفانية موضحاً التفاعلات الحادثة عند كل من المصعد (الأنود) والمهبط (الكاثود).',
      marks: 5,
      difficulty: 'hard',
      explanation: 'يحدث التأكسد عند المصعد (أنود الخارصين) والاختزال عند المهبط (كاثود النحاس).',
      sampleAnswer: 'عند المصعد: Zn -> Zn2+ + 2e (تأكسد)، وعند المهبط: Cu2+ + 2e -> Cu (اختزال).',
      rubric: 'درجتان لمعادلات نصفي التفاعل، درجتان لشرح انتقال الإلكترونات، درجة لذكر وظيفة القنطرة الملحية.',
    },
  },
  {
    id: 'item-16',
    libraryId: 'lib-3',
    kind: 'lesson',
    title: 'تسمية المركبات العضوية وفق نظام الأيوباك (IUPAC)',
    unit: 'الوحدة الأولى: الكيمياء العضوية',
    content: 'قواعد تسمية الألكانات والألكينات والألكاينات مع أمثلة على السلاسل المتفرعة والمجموعات الوظيفية.',
    pdfUrl: 'https://example.com/iupac-nomenclature.pdf',
    usageCount: 35,
    createdAt: new Date(Date.now() - 86400000 * 17).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    tags: ['عضوية', 'IUPAC'],
  },
  {
    id: 'item-17',
    libraryId: 'lib-3',
    kind: 'lesson',
    title: 'الجدول الدوري الحديث وتدرج الخواص الدورية',
    unit: 'الوحدة الثانية: البناء الذري',
    content: 'تدرج طاقة التأين، السالبية الكهربية، ونصف القطر الذري عبر الدورات والمجموعات.',
    pdfUrl: 'https://example.com/periodic-table-trends.pdf',
    usageCount: 18,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    tags: ['جدول دوري', 'سالبية'],
  },
  {
    id: 'item-18',
    libraryId: 'lib-3',
    kind: 'lesson',
    title: 'دليل السلامة والأمان في المعمل الكيميائي',
    unit: 'الوحدة التمهيدية',
    content: 'إرشادات التعامل مع الأحماض المركزة والمواد القابلة للاشتعال والتخلص الآمن من النفايات.',
    pdfUrl: 'https://example.com/lab-safety-rules.pdf',
    usageCount: 40,
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    tags: ['سلامة', 'مختبر'],
  },
  {
    id: 'item-19',
    libraryId: 'lib-3',
    kind: 'video',
    title: 'تجربة المعايرة بين حمض الهيدروكلوريك وهيدروكسيد الصوديوم',
    unit: 'الوحدة الثالثة: المحاليل والمعايرة',
    source: 'upload',
    url: 'https://example.com/titration-experiment.mp4',
    duration: 980,
    usageCount: 28,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    tags: ['معايرة', 'كيمياء'],
  },

  // Media Library Videos
  {
    id: 'item-20',
    libraryId: 'lib-4',
    kind: 'video',
    title: 'مقدمة في المنهج التعليمي وخطة الدراسة للفصل الأول',
    unit: 'التهيئة العامة',
    source: 'url',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 620,
    usageCount: 50,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    tags: ['مقدمة', 'خطة'],
  },
  {
    id: 'item-21',
    libraryId: 'lib-4',
    kind: 'video',
    title: 'ورشة عمل: تقنيات الاستذكار الفعال وإدارة وقت الاختبارات',
    unit: 'المهارات العامة',
    source: 'url',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 2400,
    usageCount: 33,
    createdAt: new Date(Date.now() - 86400000 * 22).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ['مهارات', 'استذكار'],
  },
  {
    id: 'item-22',
    libraryId: 'lib-4',
    kind: 'video',
    title: 'تسجيل الجلسة التفاعلية للإجابة على استفسارات الطلاب',
    unit: 'المراجعة الشاملة',
    source: 'library',
    url: 'https://example.com/qna-session-recording.mp4',
    duration: 3600,
    usageCount: 14,
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    tags: ['بث مباشر', 'أسئلة'],
  },
  {
    id: 'item-23',
    libraryId: 'lib-4',
    kind: 'video',
    title: 'إرشادات استخدام المنصة التعليمية وتسليم الواجبات',
    unit: 'دليل الاستخدام',
    source: 'upload',
    url: 'https://example.com/platform-onboarding.mp4',
    duration: 450,
    usageCount: 65,
    createdAt: new Date(Date.now() - 86400000 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    tags: ['دليل', 'منصة'],
  },
];

/**
 * Recomputes the cached item counts for all libraries in mock memory
 */
const recalculateMockLibraryCounts = () => {
  mockLibraries = mockLibraries.map((lib) => {
    const libItems = mockBankItems.filter((i) => String(i.libraryId) === String(lib.id));
    const lessonCount = libItems.filter((i) => i.kind === 'lesson').length;
    const videoCount = libItems.filter((i) => i.kind === 'video').length;
    const questionCount = libItems.filter((i) => i.kind === 'question').length;
    return {
      ...lib,
      itemCounts: {
        lesson: lessonCount,
        video: videoCount,
        question: questionCount,
        total: libItems.length,
      },
    };
  });
};

// Initial calculation
recalculateMockLibraryCounts();

// Helper to simulate network latency for realistic UX
const simulateDelay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

// =============================================================================
// CONTENT BANK SERVICE FUNCTIONS
// =============================================================================

/**
 * Fetches all content libraries with aggregated item counts.
 * Assumed Endpoint: GET /academy/content-bank/libraries
 */
export const getLibraries = async (): Promise<Library[]> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();
    recalculateMockLibraryCounts();
    return JSON.parse(JSON.stringify(mockLibraries));
  }

  try {
    const response = await academyApi.get<ApiResponse<Library[]>>('content-bank/libraries');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch libraries:', error);
    throw error.response?.data || error;
  }
};

/**
 * Creates a new content library.
 * Assumed Endpoint: POST /academy/content-bank/libraries
 */
export const createLibrary = async (data: CreateLibraryPayload): Promise<Library> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();
    const newLib: Library = {
      id: `lib-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      color: data.color || '#6366F1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      itemCounts: {
        lesson: 0,
        video: 0,
        question: 0,
        total: 0,
      },
    };
    mockLibraries.unshift(newLib);
    return JSON.parse(JSON.stringify(newLib));
  }

  try {
    const response = await academyApi.post<ApiResponse<Library>>('content-bank/libraries', data);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create library:', error);
    throw error.response?.data || error;
  }
};

/**
 * Updates an existing content library.
 * Assumed Endpoint: PUT /academy/content-bank/libraries/:id
 */
export const updateLibrary = async (
  id: string | number,
  data: UpdateLibraryPayload
): Promise<Library> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();
    const index = mockLibraries.findIndex((l) => String(l.id) === String(id));
    if (index === -1) throw new Error('Library not found');

    mockLibraries[index] = {
      ...mockLibraries[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(mockLibraries[index]));
  }

  try {
    const response = await academyApi.put<ApiResponse<Library>>(
      `content-bank/libraries/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update library:', error);
    throw error.response?.data || error;
  }
};

/**
 * Deletes a content library.
 * Assumed Endpoint: DELETE /academy/content-bank/libraries/:id
 */
export const deleteLibrary = async (
  id: string | number
): Promise<{ success: boolean; id: string | number }> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();
    mockLibraries = mockLibraries.filter((l) => String(l.id) !== String(id));
    // Remove or detach associated bank items
    mockBankItems = mockBankItems.filter((i) => String(i.libraryId) !== String(id));
    recalculateMockLibraryCounts();
    return { success: true, id };
  }

  try {
    const response = await academyApi.delete<ApiResponse<{ success: boolean }>>(
      `content-bank/libraries/${id}`
    );
    return { success: response.data.success ?? true, id };
  } catch (error: any) {
    console.error('Failed to delete library:', error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches bank items filtered by library, kind, search query, difficulty, with pagination.
 * Assumed Endpoint: GET /academy/content-bank/items
 */
export const getBankItems = async (
  params?: GetBankItemsParams
): Promise<PaginatedBankItemsResponse> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();

    let items = [...mockBankItems];

    if (params?.libraryId && params.libraryId !== 'all') {
      items = items.filter((i) => String(i.libraryId) === String(params.libraryId));
    }

    if (params?.kind && params.kind !== 'all') {
      items = items.filter((i) => i.kind === params.kind);
    }

    if (params?.difficulty && params.difficulty !== 'all') {
      items = items.filter((i) => {
        if (i.kind === 'question') {
          return i.question.difficulty === params.difficulty;
        }
        return false;
      });
    }

    if (params?.tag) {
      const lowerTag = params.tag.toLowerCase();
      items = items.filter((i) => i.tags?.some((t) => t.toLowerCase().includes(lowerTag)));
    }

    if (params?.q && params.q.trim() !== '') {
      const q = params.q.trim().toLowerCase();
      items = items.filter((item) => {
        if (item.kind === 'lesson' || item.kind === 'video') {
          return (
            item.title.toLowerCase().includes(q) ||
            item.unit?.toLowerCase().includes(q) ||
            item.tags?.some((t) => t.toLowerCase().includes(q))
          );
        }
        if (item.kind === 'question') {
          return (
            item.question.text.toLowerCase().includes(q) ||
            item.unit?.toLowerCase().includes(q) ||
            item.question.tags?.some((t) => t.toLowerCase().includes(q)) ||
            item.tags?.some((t) => t.toLowerCase().includes(q)) ||
            item.question.options?.some((o) => o.text.toLowerCase().includes(q))
          );
        }
        return false;
      });
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      items: JSON.parse(JSON.stringify(paginatedItems)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  try {
    const response = await academyApi.get<ApiResponse<PaginatedBankItemsResponse>>(
      'content-bank/items',
      { params }
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch bank items:', error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches a single bank item by its ID.
 * Assumed Endpoint: GET /academy/content-bank/items/:id
 */
export const getBankItemById = async (id: string | number): Promise<BankItem> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();
    const item = mockBankItems.find((i) => String(i.id) === String(id));
    if (!item) throw new Error(`Bank item ${id} not found`);
    return JSON.parse(JSON.stringify(item));
  }

  try {
    const response = await academyApi.get<ApiResponse<BankItem>>(`content-bank/items/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch bank item:', error);
    throw error.response?.data || error;
  }
};

/**
 * Creates a new Bank Item (Lesson, Video, or Question).
 * Assumed Endpoint: POST /academy/content-bank/items
 */
export const createBankItem = async (data: CreateBankItemPayload): Promise<BankItem> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();
    const now = new Date().toISOString();
    let newItem: BankItem;

    if (data.kind === 'lesson') {
      newItem = {
        id: `item-${Date.now()}`,
        libraryId: data.libraryId,
        kind: 'lesson',
        title: data.title,
        content: data.content,
        pdfUrl: data.pdfUrl,
        unit: data.unit || 'عام',
        usageCount: 0,
        tags: data.tags || [],
        createdAt: now,
        updatedAt: now,
      };
    } else if (data.kind === 'video') {
      newItem = {
        id: `item-${Date.now()}`,
        libraryId: data.libraryId,
        kind: 'video',
        title: data.title,
        source: data.source,
        url: data.url,
        duration: data.duration || 0,
        unit: data.unit || 'عام',
        usageCount: 0,
        tags: data.tags || [],
        createdAt: now,
        updatedAt: now,
      };
    } else {
      newItem = {
        id: `item-${Date.now()}`,
        libraryId: data.libraryId,
        kind: 'question',
        unit: data.unit || 'عام',
        usageCount: 0,
        tags: data.tags || [],
        createdAt: now,
        updatedAt: now,
        question: {
          ...data.question,
          id: data.question.id || `q-${Date.now()}`,
        },
      };
    }

    mockBankItems.unshift(newItem);
    recalculateMockLibraryCounts();
    return JSON.parse(JSON.stringify(newItem));
  }

  try {
    const response = await academyApi.post<ApiResponse<BankItem>>('content-bank/items', data);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create bank item:', error);
    throw error.response?.data || error;
  }
};

/**
 * Updates an existing Bank Item.
 * Assumed Endpoint: PUT /academy/content-bank/items/:id
 */
export const updateBankItem = async (
  id: string | number,
  data: UpdateBankItemPayload
): Promise<BankItem> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();
    const index = mockBankItems.findIndex((i) => String(i.id) === String(id));
    if (index === -1) throw new Error(`Bank item ${id} not found`);

    const existing = mockBankItems[index];
    const now = new Date().toISOString();

    const updated = {
      ...existing,
      ...data,
      updatedAt: now,
    } as BankItem;

    mockBankItems[index] = updated;
    recalculateMockLibraryCounts();
    return JSON.parse(JSON.stringify(updated));
  }

  try {
    const response = await academyApi.put<ApiResponse<BankItem>>(
      `content-bank/items/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update bank item:', error);
    throw error.response?.data || error;
  }
};

/**
 * Deletes multiple bank items in batch.
 * Assumed Endpoint: POST /academy/content-bank/items/delete-batch
 */
export const deleteBankItems = async (
  ids: (string | number)[]
): Promise<{ deletedIds: (string | number)[]; success: boolean }> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();
    const stringIds = new Set(ids.map(String));
    mockBankItems = mockBankItems.filter((i) => !stringIds.has(String(i.id)));
    recalculateMockLibraryCounts();
    return { deletedIds: ids, success: true };
  }

  try {
    const payload: BatchDeletePayload = { ids };
    const response = await academyApi.post<
      ApiResponse<{ deletedIds: (string | number)[]; success: boolean }>
    >('content-bank/items/delete-batch', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to delete bank items:', error);
    throw error.response?.data || error;
  }
};

/**
 * Duplicates one or more bank items into the same or a target library.
 * Assumed Endpoint: POST /academy/content-bank/items/duplicate
 */
export const duplicateBankItems = async (
  ids: (string | number)[],
  targetLibraryId?: string | number
): Promise<BankItem[]> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();
    const stringIds = new Set(ids.map(String));
    const targetItems = mockBankItems.filter((i) => stringIds.has(String(i.id)));
    const now = new Date().toISOString();

    const duplicated: BankItem[] = targetItems.map((orig) => {
      const newId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const libId = targetLibraryId || orig.libraryId;

      if (orig.kind === 'lesson') {
        return {
          ...orig,
          id: newId,
          libraryId: libId,
          title: `نسخة من ${orig.title}`,
          usageCount: 0,
          createdAt: now,
          updatedAt: now,
        };
      } else if (orig.kind === 'video') {
        return {
          ...orig,
          id: newId,
          libraryId: libId,
          title: `نسخة من ${orig.title}`,
          usageCount: 0,
          createdAt: now,
          updatedAt: now,
        };
      } else {
        return {
          ...orig,
          id: newId,
          libraryId: libId,
          usageCount: 0,
          createdAt: now,
          updatedAt: now,
          question: {
            ...orig.question,
            id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            text: orig.question.text,
          },
        };
      }
    });

    mockBankItems.unshift(...duplicated);
    recalculateMockLibraryCounts();
    return JSON.parse(JSON.stringify(duplicated));
  }

  try {
    const payload: BatchDuplicatePayload = { ids, targetLibraryId };
    const response = await academyApi.post<ApiResponse<BankItem[]>>(
      'content-bank/items/duplicate',
      payload
    );
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to duplicate bank items:', error);
    throw error.response?.data || error;
  }
};

/**
 * Moves multiple bank items to a target library.
 * Assumed Endpoint: POST /academy/content-bank/items/move
 */
export const moveBankItems = async (
  ids: (string | number)[],
  libraryId: string | number
): Promise<{ movedIds: (string | number)[]; targetLibraryId: string | number; success: boolean }> => {
  if (USE_MOCK_BANK) {
    await simulateDelay();
    const stringIds = new Set(ids.map(String));
    const now = new Date().toISOString();

    mockBankItems = mockBankItems.map((item) => {
      if (stringIds.has(String(item.id))) {
        return {
          ...item,
          libraryId,
          updatedAt: now,
        };
      }
      return item;
    });

    recalculateMockLibraryCounts();
    return { movedIds: ids, targetLibraryId: libraryId, success: true };
  }

  try {
    const payload: BatchMovePayload = { ids, libraryId };
    const response = await academyApi.post<
      ApiResponse<{ movedIds: (string | number)[]; targetLibraryId: string | number; success: boolean }>
    >('content-bank/items/move', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to move bank items:', error);
    throw error.response?.data || error;
  }
};
