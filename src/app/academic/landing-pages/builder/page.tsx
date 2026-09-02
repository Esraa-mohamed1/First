'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Eye,
  Check,
  Loader2,
  X,
  Sparkles,
  Layout,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';
import { useLandingStore } from '@/modules/landing/store/landingStore';
import { useLandingSave } from '@/modules/landing/hooks/useLandingSave';
import { getTemplateDefaultContent } from '@/modules/landing/constants/defaultContent';
import { getCourse } from '@/services/courses';
import { getProfileStatus } from '@/services/auth';
import { getLandingPagesList } from '@/modules/landing/services/landing.api';

// Section Editors
import HeroEditor from '@/modules/landing/editor/HeroEditor';
import LearningEditor from '@/modules/landing/editor/LearningEditor';
import ChapterEditor from '@/modules/landing/editor/ChapterEditor';
import PaymentEditor from '@/modules/landing/editor/PaymentEditor';
import FAQEditor from '@/modules/landing/editor/FAQEditor';
import ReviewsEditor from '@/modules/landing/editor/ReviewsEditor';
import WhatsAppEditor from '@/modules/landing/editor/WhatsAppEditor';
import FooterEditor from '@/modules/landing/editor/FooterEditor';

export default function LandingPageBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get('course_id') || searchParams.get('courseId') || '';
  const lpId = searchParams.get('lp_id') || searchParams.get('id') || '';
  const initialTemplate = searchParams.get('template') || 'template_1';

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialTemplate);

  const activeSectionId = useLandingStore(state => state.activeSectionId);
  const setActiveSectionId = useLandingStore(state => state.setActiveSectionId);
  const setStoreTemplateName = useLandingStore(state => state.setTemplateName);
  const storeTemplateName = useLandingStore(state => state.templateName);
  const { saving, handleSave } = useLandingSave();

  useEffect(() => {
    async function initBuilder() {
      setLoading(true);
      try {
        // Fetch user profile
        const profile = await getProfileStatus().catch(() => null);
        if (profile) {
          const userData = profile.data || profile;
          setCurrentUser(userData);
        }

        const store = useLandingStore.getState();

        let courseObj: any = null;
        if (courseId) {
          try {
            courseObj = await getCourse(courseId);
          } catch (e) {
            console.error('Failed to load course for builder:', e);
          }
        }

        if (courseObj) {
          store.setCourseData(courseObj);
        }

        if (lpId) {
          // Editing existing landing page
          const list = await getLandingPagesList().catch(() => []);
          const page = list.find((item: any) => String(item.id) === String(lpId));
          if (page) {
            const template = page.template_name || initialTemplate;
            setSelectedTemplate(template);
            store.setLandingPageData({
              id: page.id,
              template_name: template,
              is_active: page.is_active,
              content: page.content,
              course_id: page.course_id,
              user_id: page.user_id || currentUser?.id || 1
            });
          }
        } else if (courseObj) {
          // Creating or previewing new template for this course
          const defaultContent = getTemplateDefaultContent(courseObj, initialTemplate);
          store.setLandingPageData({
            content: defaultContent,
            template_name: initialTemplate
          });
        }
      } catch (err) {
        console.error('Failed to initialize landing builder:', err);
        toast.error('حدث خطأ أثناء تحميل بيانات محرر صفحات البيع');
      } finally {
        setLoading(false);
      }
    }

    initBuilder();
  }, [courseId, lpId, initialTemplate]);

  const handleTemplateChange = (newTemplate: string) => {
    setSelectedTemplate(newTemplate);
    const store = useLandingStore.getState();
    store.setTemplateName(newTemplate);
    const currentCourse = store.courseData;
    if (currentCourse) {
      const defaultContent = getTemplateDefaultContent(currentCourse, newTemplate);
      store.setLandingPageData({
        content: defaultContent,
        template_name: newTemplate
      });
    }
  };

  const handleSaveClick = async () => {
    const userId = currentUser?.id || 1;
    const success = await handleSave(userId);
    if (success) {
      toast.success('تم حفظ صفحة البيع بنجاح!');
    }
  };

  const handlePreviewStudent = () => {
    const store = useLandingStore.getState();
    const courseSlug = store.courseData?.slug || courseId;
    const previewUrl = lpId
      ? `/landing/${courseSlug}?lp_id=${lpId}`
      : `/landing/${courseSlug}`;
    window.open(previewUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4 font-bold" dir="rtl">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="text-sm">جاري فتح محرر صفحات البيع المستقل...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans select-none" dir="rtl">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-slate-800/90 backdrop-blur-md border-b border-slate-700/60 px-6 flex items-center justify-between shrink-0 z-30">
        {/* Right Section: Back button & Title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              if (courseId) {
                router.push(`/academic/courses/${courseId}?tab=landing_pages`);
              } else {
                router.push('/academic/landing-pages');
              }
            }}
            className="flex items-center gap-2 bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border border-slate-600/40"
          >
            <ArrowRight size={16} />
            <span>العودة للدورة</span>
          </button>
          
          <div className="h-6 w-px bg-slate-700" />

          <div>
            <h1 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              محرر صفحة البيع والتسويق
            </h1>
            <p className="text-[10px] text-slate-400 font-bold">
              تعديل مباشر ومخصص لجميع أقسام القالب
            </p>
          </div>
        </div>

        {/* Center Section: Responsive Viewport Controls */}
        <div className="hidden md:flex items-center bg-slate-900/80 p-1 rounded-2xl border border-slate-700/60 gap-1">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor size={14} />
            <span>كمبيوتر</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet size={14} />
            <span>تابلت</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone size={14} />
            <span>جوال</span>
          </button>
        </div>

        {/* Left Section: Template Selector & Save / Preview Buttons */}
        <div className="flex items-center gap-3">
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="bg-slate-700/80 border border-slate-600 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="template_1">القالب الأول (الملكي الكلاسيكي)</option>
            <option value="template_2">قالب الدروس التفاعلي</option>
            <option value="template_3">القالب العصري الحديث</option>
          </select>

          <button
            type="button"
            onClick={handlePreviewStudent}
            className="flex items-center gap-1.5 bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-600/40"
            title="معاينة كطالب"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">معاينة الطالب</span>
          </button>

          <button
            type="button"
            onClick={handleSaveClick}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Right Sidebar Inspector (Editor Controls Panel) */}
        <aside className="w-full md:w-[380px] bg-slate-800 border-l border-slate-700/70 flex flex-col shrink-0 overflow-hidden shadow-2xl z-20">
          <div className="p-4 border-b border-slate-700/60 bg-slate-800/80 space-y-2">
            <label className="text-xs font-black text-slate-300 block">أقسام القالب الأول للتعديل والتخصيص:</label>
            <select
              className="w-full border border-slate-600 rounded-xl p-2.5 text-xs bg-slate-900 text-white font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
              value={activeSectionId || 'hero'}
              onChange={(e) => setActiveSectionId(e.target.value || 'hero')}
            >
              {selectedTemplate === 'template_1' ? (
                <>
                  <option value="hero">البانر الرئيسي (الهيرو)</option>
                  <option value="learning">ماذا ستتعلم؟</option>
                  <option value="chapters">المنهج والدروس</option>
                  <option value="payment">وسائل الدفع</option>
                  <option value="faq">الأسئلة الشائعة</option>
                  <option value="reviews">آراء الطلاب والتقييمات</option>
                  <option value="whatsapp">زر تواصل واتساب</option>
                  <option value="footer">تذييل الصفحة (الفوتر)</option>
                </>
              ) : (
                <option value="hero">البانر الرئيسي (الهيرو)</option>
              )}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-slate-900 bg-white">
            {selectedTemplate === 'template_1' ? (
              (() => {
                const sec = (activeSectionId || 'hero').toLowerCase().trim();
                switch (sec) {
                  case 'hero':
                    return <HeroEditor />;
                  case 'learning':
                    return <LearningEditor />;
                  case 'chapters':
                    return <ChapterEditor />;
                  case 'payment':
                    return <PaymentEditor />;
                  case 'faq':
                    return <FAQEditor />;
                  case 'reviews':
                    return <ReviewsEditor />;
                  case 'whatsapp':
                    return <WhatsAppEditor />;
                  case 'footer':
                    return <FooterEditor />;
                  default:
                    return <HeroEditor />;
                }
              })()
            ) : (
              <div className="text-center py-20 text-slate-400 font-bold text-xs space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Layout size={24} />
                </div>
                <p className="max-w-xs mx-auto leading-relaxed">
                  هذا المحرر مخصص لإدارة وتخصيص القالب الأول (الملكي الكلاسيكي).
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Center Visual Preview Canvas */}
        <main className="flex-1 bg-slate-950 p-4 md:p-8 overflow-y-auto flex justify-center items-start">
          <div
            className={`transition-all duration-300 bg-white rounded-2xl shadow-2xl overflow-hidden min-h-full ${
              viewport === 'desktop'
                ? 'w-full max-w-6xl'
                : viewport === 'tablet'
                ? 'w-[768px] border-8 border-slate-800 rounded-[2.5rem]'
                : 'w-[390px] border-[12px] border-slate-800 rounded-[3rem]'
            }`}
          >
            <LandingRenderer
              courseId={courseId}
              landingPageId={lpId}
              isEditable={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
