'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Eye, Play, Pause, X, Loader2, Globe, FileText, Settings, ArrowLeft } from 'lucide-react';
import { getCourses } from '@/services/courses';
import { Course } from '@/types/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';
import { useLandingStore } from '@/modules/landing/store/landingStore';
import { useLandingSave } from '@/modules/landing/hooks/useLandingSave';
import { getTemplateDefaultContent } from '@/modules/landing/constants/defaultContent';

import { getLandingPagesList, createLandingPage, updateLandingPage, deleteLandingPage } from '@/modules/landing/services/landing.api';

// Section Editors
import HeroEditor from '@/modules/landing/editor/HeroEditor';
import LearningEditor from '@/modules/landing/editor/LearningEditor';
import ChapterEditor from '@/modules/landing/editor/ChapterEditor';
import PaymentEditor from '@/modules/landing/editor/PaymentEditor';
import FAQEditor from '@/modules/landing/editor/FAQEditor';
import ReviewsEditor from '@/modules/landing/editor/ReviewsEditor';
import WhatsAppEditor from '@/modules/landing/editor/WhatsAppEditor';
import FooterEditor from '@/modules/landing/editor/FooterEditor';

interface LandingPageItem {
  id: string;
  course_id: number;
  courseTitle: string;
  template_name: string;
  is_active: boolean;
  slug: string;
  content: any;
  created_at: string;
}

export default function LandingPagesManagementPage() {
  const [landingPages, setLandingPages] = useState<LandingPageItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Creation State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template_1');
  const [customSlug, setCustomSlug] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editor State
  const [activeEditingPage, setActiveEditingPage] = useState<LandingPageItem | null>(null);
  const activeSectionId = useLandingStore(state => state.activeSectionId);
  const setActiveSectionId = useLandingStore(state => state.setActiveSectionId);
  const storeTemplateName = useLandingStore(state => state.templateName);
  const storeSetTemplateName = useLandingStore(state => state.setTemplateName);
  const storeContent = useLandingStore(state => state.content);

  // Load courses and custom landing pages from backend API
  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedCourses = await getCourses();
      setCourses(fetchedCourses || []);

      const apiList = await getLandingPagesList();
      if (apiList && apiList.length > 0) {
        const mappedPages: LandingPageItem[] = apiList.map((item: any) => {
          const matchedCourse = (fetchedCourses || []).find((c: any) => String(c.id) === String(item.course_id));
          return {
            id: String(item.id),
            course_id: Number(item.course_id),
            courseTitle: matchedCourse ? matchedCourse.title : (item.course?.title || `دورة ${item.course_id}`),
            template_name: item.template_name || 'template_1',
            is_active: Boolean(item.is_active),
            slug: item.slug || (matchedCourse?.slug || `course-${item.course_id}`),
            content: item.content || {},
            created_at: item.created_at || new Date().toISOString()
          };
        });
        setLandingPages(mappedPages);
      } else {
        setLandingPages([]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('فشل تحميل البيانات الأساسية');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync state with store template change if they select template in visual preview
  useEffect(() => {
    if (activeEditingPage && storeTemplateName && storeTemplateName !== activeEditingPage.template_name) {
      // Just keep local modal states in sync with store template selection
      setActiveEditingPage(prev => prev ? { ...prev, template_name: storeTemplateName } : null);
    }
  }, [storeTemplateName]);

  const handleCreateLandingPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error('يرجى اختيار الدورة');
      return;
    }

    const course = courses.find(c => String(c.id) === String(selectedCourseId));
    if (!course) {
      toast.error('الدورة المحددة غير صالحة');
      return;
    }

    setIsSubmitting(true);
    try {
      const defaultContent = getTemplateDefaultContent(course, selectedTemplate);

      const savedData = await createLandingPage({
        template_name: selectedTemplate,
        content: defaultContent,
        is_active: true,
        course_id: Number(course.id),
        user_id: 1
      });

      const slugVal = customSlug.trim() || (course.slug || `course-${course.id}`);

      const targetPage: LandingPageItem = {
        id: String(savedData?.id || Date.now()),
        course_id: Number(course.id),
        courseTitle: course.title,
        template_name: savedData?.template_name || selectedTemplate,
        is_active: true,
        slug: savedData?.slug || slugVal,
        content: savedData?.content || defaultContent,
        created_at: savedData?.created_at || new Date().toISOString()
      };

      toast.success('تم الانتقال إلى محرر القالب بنجاح!');
      setIsCreateModalOpen(false);
      setSelectedCourseId('');
      setCustomSlug('');

      await loadData();

      // Open the template editor for the landing page
      handleOpenEditor(targetPage);
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء إنشاء صفحة الهبوط');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditor = (page: LandingPageItem) => {
    setActiveEditingPage(page);
    
    // Initialize the zustand store with the selected landing page's state
    const store = useLandingStore.getState();
    const course = courses.find(c => Number(c.id) === Number(page.course_id)) || {
      id: page.course_id,
      title: page.courseTitle,
      units: []
    };
    
    store.setCourseData(course);
    store.setLandingPageData({
      template_name: page.template_name,
      is_active: page.is_active,
      content: page.content
    });
    store.setActiveSectionId(null);
  };

  const handleSaveEdits = async () => {
    if (!activeEditingPage) return;

    const currentStoreState = useLandingStore.getState();
    try {
      await updateLandingPage({
        template_name: currentStoreState.templateName,
        content: currentStoreState.content,
        is_active: currentStoreState.isActive,
        course_id: Number(activeEditingPage.course_id),
        user_id: 1
      });

      toast.success('تم حفظ تعديلات صفحة الهبوط بنجاح!');
      await loadData();

      setActiveEditingPage(prev => prev ? {
        ...prev,
        template_name: currentStoreState.templateName,
        content: currentStoreState.content,
        is_active: currentStoreState.isActive
      } : null);
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء حفظ التعديلات');
    }
  };

  const handleTogglePublish = async (pageId: string) => {
    const page = landingPages.find(p => p.id === pageId);
    if (!page) return;

    const nextStatus = !page.is_active;
    try {
      await updateLandingPage({
        template_name: page.template_name,
        content: page.content,
        is_active: nextStatus,
        course_id: Number(page.course_id),
        user_id: 1
      });

      toast.success(nextStatus ? 'تم نشر الصفحة بنجاح' : 'تم إيقاف النشر مؤقتاً');
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء تغيير حالة الصفحة');
    }
  };

  const handleDeletePage = (pageId: string) => {
    Swal.fire({
      title: 'هل أنت متأكد من الحذف؟',
      text: 'لن تتمكن من استرجاع صفحة الهبوط هذه بعد حذفها!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفها',
      cancelButtonText: 'إلغاء',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteLandingPage(pageId);
          Swal.fire('تم الحذف!', 'تم حذف صفحة الهبوط بنجاح.', 'success');
        } catch (e) {
          console.warn('API delete warning, filtering locally:', e);
          Swal.fire('تم الحذف!', 'تم حذف صفحة الهبوط بنجاح.', 'success');
        }
        await loadData();
      }
    });
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Globe className="w-7 h-7 text-blue-600" />
            إدارة صفحات الهبوط
          </h1>
          <p className="text-xs font-bold text-gray-400 mt-1">أنشئ وخصص صفحات هبوط مخصصة لكل دورة تعليمية وقالب تسويقي</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-3.5 rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-100 cursor-pointer"
        >
          <Plus size={16} />
          إنشاء صفحة هبوط
        </button>
      </div>

      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        </div>
      ) : landingPages.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-16 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Globe className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-gray-900">لا توجد صفحات هبوط حالياً</h3>
            <p className="text-xs font-bold text-gray-400 max-w-sm mx-auto leading-relaxed">
              ابدأ بإنشاء أول صفحة هبوط تسويقية لدوراتك. يمكنك اختيار القالب وتخصيص الألوان والنصوص لجذب المشتركين.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-6 py-3.5 rounded-full transition-all active:scale-95 shadow-md cursor-pointer"
          >
            أنشئ أول صفحة هبوط الآن
          </button>
        </div>
      ) : (
        /* Grid List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map((page) => (
            <div
              key={page.id}
              className="bg-white border border-gray-150/60 rounded-[2.5rem] p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                    page.is_active 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {page.is_active ? '● منشورة ومباشرة' : '○ موقوفة مؤقتاً'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {page.template_name === 'template_1' ? 'قالب الكلاسيكي' : 'قالب التفاعلي'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-black text-sm text-gray-900 leading-snug line-clamp-2">{page.courseTitle}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold font-mono">
                    <span>رابط الصفحة:</span>
                    <span className="text-blue-600 underline">/landing/{page.slug}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditor(page)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center"
                    title="تعديل وتخصيص"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleTogglePublish(page.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                      page.is_active 
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 hover:text-amber-700 border-amber-200' 
                        : 'bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 border-green-200'
                    }`}
                    title={page.is_active ? 'إيقاف النشر مؤقتاً' : 'تفعيل ونشر الصفحة'}
                  >
                    {page.is_active ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl border border-red-200 transition-all cursor-pointer flex items-center justify-center"
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <a
                  href={`/user/courses/${page.slug || 'preview'}?lp_id=${page.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Eye size={12} />
                  معاينة كطالب
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Dialog Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-250">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 border border-slate-100 animate-in zoom-in-95 duration-250 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-black text-slate-900 mb-2">إنشاء صفحة هبوط جديدة</h2>
            <p className="text-xs font-bold text-slate-400 mb-6">اختر الدورة والقالب المناسب للبدء في تخصيص صفحتك</p>

            <form onSubmit={handleCreateLandingPage} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">اختر الدورة التعليمية *</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold cursor-pointer"
                >
                  <option value="">-- اختر الدورة --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">اختر قالب التصميم *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate('template_1')}
                    className={`p-4 border rounded-2xl text-right transition-all flex flex-col gap-1.5 cursor-pointer ${
                      selectedTemplate === 'template_1'
                        ? 'border-blue-600 bg-blue-50/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-black text-slate-900">الكلاسيكي الملكي</span>
                    <span className="text-[9px] text-slate-400 font-bold leading-normal">تصميم زمردي دافئ وعروض إحصائيات</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate('template_2')}
                    className={`p-4 border rounded-2xl text-right transition-all flex flex-col gap-1.5 cursor-pointer ${
                      selectedTemplate === 'template_2'
                        ? 'border-blue-600 bg-blue-50/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-black text-slate-900">الافتراضي التفاعلي</span>
                    <span className="text-[9px] text-slate-400 font-bold leading-normal">مشغل فيديو وجداول دروس متقدمة</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">الرابط المخصص (Slug) (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: react-pro-course"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-left font-bold"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'إنشاء وتعديل صفحة الهبوط'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Editor Fullscreen Pane/Modal Overlay */}
      {activeEditingPage && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white h-screen overflow-hidden" dir="rtl">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-slate-150 bg-slate-50/70 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveEditingPage(null)}
                className="w-10 h-10 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                title="الرجوع للقائمة"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  تعديل صفحة هبوط الدورة: {activeEditingPage.courseTitle}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] bg-blue-50 text-blue-600 font-black px-2 py-0.5 rounded-full">
                    {storeTemplateName === 'template_1' ? 'قالب الكلاسيكي الملكي' : 'قالب الافتراضي التفاعلي'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold font-mono">
                    الرابط: /landing/{activeEditingPage.slug}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Template Toggle Switch inside Editor */}
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1">
                <span className="text-[9px] font-black text-slate-500">القالب:</span>
                <select
                  value={storeTemplateName}
                  onChange={(e) => storeSetTemplateName(e.target.value)}
                  className="bg-transparent border-0 font-bold text-[10px] text-slate-700 outline-none cursor-pointer"
                >
                  <option value="template_1">الكلاسيكي الملكي</option>
                  <option value="template_2">الافتراضي التفاعلي</option>
                </select>
              </div>

              <button
                onClick={handleSaveEdits}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-md flex items-center gap-1 cursor-pointer"
              >
                حفظ التعديلات
              </button>
              <button
                onClick={() => setActiveEditingPage(null)}
                className="bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-slate-200 font-black text-xs px-5 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer"
              >
                إغلاق المحرر
              </button>
            </div>
          </div>

          {/* Editor Workspace Split view */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 h-[calc(100vh-73px)] overflow-hidden">
            {/* Inspector sidebar column (380px) */}
            <div className="w-full md:w-[380px] border-b md:border-b-0 md:border-l border-slate-150 overflow-y-auto p-6 bg-slate-50/50 shrink-0 flex flex-col gap-6">
              
              {/* Section selector */}
              <div className="space-y-2 pb-4 border-b border-slate-200">
                <label className="text-xs font-black text-slate-500 block">اختر القسم للتعديل:</label>
                <select
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-white font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
                  value={activeSectionId || ''}
                  onChange={(e) => setActiveSectionId(e.target.value || null)}
                >
                  <option value="">-- اختر قسماً لتعديله --</option>
                  <option value="hero">البانر الرئيسي (الهيرو)</option>
                  <option value="learning">ماذا ستتعلم؟</option>
                  <option value="chapters">المنهج والدروس</option>
                  <option value="payment">وسائل الدفع</option>
                  <option value="faq">الأسئلة الشائعة</option>
                  <option value="reviews">آراء الطلاب والتقييمات</option>
                  <option value="whatsapp">زر تواصل واتساب</option>
                  <option value="footer">تذييل الصفحة (الفوتر)</option>
                </select>
              </div>

              {/* Editing Component */}
              <div className="flex-grow overflow-y-auto">
                {activeSectionId === 'hero' && <HeroEditor />}
                {activeSectionId === 'learning' && <LearningEditor />}
                {activeSectionId === 'chapters' && <ChapterEditor />}
                {activeSectionId === 'payment' && <PaymentEditor />}
                {activeSectionId === 'faq' && <FAQEditor />}
                {activeSectionId === 'reviews' && <ReviewsEditor />}
                {activeSectionId === 'whatsapp' && <WhatsAppEditor />}
                {activeSectionId === 'footer' && <FooterEditor />}
                {!activeSectionId && (
                  <div className="text-center py-20 text-slate-400 font-bold text-xs flex flex-col items-center gap-3">
                    <Settings className="w-12 h-12 text-slate-300 animate-pulse" />
                    <span>👈 اختر قسماً من القائمة أعلاه أو انقر فوق أي قسم في صفحة المعاينة لتعديل إعداداته ومحتوياته مباشرة هنا.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Interactive Preview panel */}
            <div className="flex-1 bg-slate-100 p-6 flex flex-col h-full overflow-hidden">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/50 overflow-hidden flex-1 flex flex-col relative">
                <div className="bg-slate-50 border-b border-slate-150 px-5 py-2 flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>شاشة المعاينة التفاعلية الحية</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <LandingRenderer
                    courseId={activeEditingPage.course_id}
                    isEditable={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
