'use client';

import React from 'react';
import { Plus, Globe, Sparkles, Monitor, Tablet, Smartphone, Loader2, Check, Eye, X, Edit3, Trash2, Copy, Link as LinkIcon } from 'lucide-react';
import { useLandingStore } from '@/modules/landing/store/landingStore';
import { useLandingSave } from '@/modules/landing/hooks/useLandingSave';
import { Course, User } from '@/types/api';
// Section Editors - Template 1
import Template1HeroEditor from '@/modules/landing/editor/template1/Template1HeroEditor';
import Template1LearningEditor from '@/modules/landing/editor/template1/Template1LearningEditor';
import Template1ChapterEditor from '@/modules/landing/editor/template1/Template1ChapterEditor';
import Template1PaymentEditor from '@/modules/landing/editor/template1/Template1PaymentEditor';
import Template1FAQEditor from '@/modules/landing/editor/template1/Template1FAQEditor';
import Template1FooterEditor from '@/modules/landing/editor/template1/Template1FooterEditor';
import Template1ReviewsEditor from '@/modules/landing/editor/template1/Template1ReviewsEditor';
import Template1WhatsAppEditor from '@/modules/landing/editor/template1/Template1WhatsAppEditor';
// Section Editors - Template 2 (Modern)
import Template2HeroEditor from '@/modules/landing/editor/template2/Template2HeroEditor';
import Template2AboutEditor from '@/modules/landing/editor/template2/Template2AboutEditor';
import Template2FeaturesEditor from '@/modules/landing/editor/template2/Template2FeaturesEditor';
import Template2CurriculumEditor from '@/modules/landing/editor/template2/Template2CurriculumEditor';
import Template2InstructorEditor from '@/modules/landing/editor/template2/Template2InstructorEditor';
import Template2BenefitsEditor from '@/modules/landing/editor/template2/Template2BenefitsEditor';
import Template2CtaEditor from '@/modules/landing/editor/template2/Template2CtaEditor';
import Template2FooterEditor from '@/modules/landing/editor/template2/Template2FooterEditor';
// Section Editors - Template 3 (UI/UX / Academy)
import Template3HeroEditor from '@/modules/landing/editor/template3/Template3HeroEditor';
import Template3LearningEditor from '@/modules/landing/editor/template3/Template3LearningEditor';
import Template3CurriculumEditor from '@/modules/landing/editor/template3/Template3CurriculumEditor';
import Template3InstructorEditor from '@/modules/landing/editor/template3/Template3InstructorEditor';
import Template3FAQEditor from '@/modules/landing/editor/template3/Template3FAQEditor';
import Template3RequirementsEditor from '@/modules/landing/editor/template3/Template3RequirementsEditor';
import Template3PricingEditor from '@/modules/landing/editor/template3/Template3PricingEditor';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';
import toast from 'react-hot-toast';

interface CourseLandingPagesTabProps {
  course: Course | null;
  id: string;
  currentUser: User | null;
  landingPages: any[];
  setIsCreateLandingModalOpen: (open: boolean) => void;
  inlineEditingTemplate: string | null;
  setInlineEditingTemplate: (template: string | null) => void;
  inlineEditingPage: any | null;
  setInlineEditingPage: (page: any | null) => void;
  inlineViewport: 'desktop' | 'tablet' | 'mobile';
  setInlineViewport: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  handleOpenEditor: (page: any) => void;
  handleDeleteLandingPage: (pageId: string | number) => void;
  handleCloneLandingPage: (page: any) => void;
  handleCopyCustomLink: (page: any) => void;
  handleCopyDefaultLink: () => void;
  fetchLandingPages: () => void;
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
}

export const CourseLandingPagesTab: React.FC<CourseLandingPagesTabProps> = ({
  course,
  id,
  currentUser,
  landingPages,
  setIsCreateLandingModalOpen,
  inlineEditingTemplate,
  setInlineEditingTemplate,
  inlineEditingPage,
  setInlineEditingPage,
  inlineViewport,
  setInlineViewport,
  handleOpenEditor,
  handleDeleteLandingPage,
  handleCloneLandingPage,
  handleCopyCustomLink,
  handleCopyDefaultLink,
  fetchLandingPages,
  activeSectionId,
  setActiveSectionId,
}) => {
  const { saving, handleSave } = useLandingSave();

  return (
    <div className="space-y-8 animate-in fade-in duration-300" dir="rtl">
      {/* Header Titles */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-gray-900 font-bold">التسويق والبيع</h2>
          <p className="text-body-md text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
            أنشئ صفحات بيع مختلفة لنفس الدورة واستخدم كل صفحة في حملة أو عرض مختلف، مع بقاء جميع الصفحات مرتبطة بنفس الدورة.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateLandingModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus size={18} />
          <span>إنشاء صفحة بيع جديدة</span>
        </button>
      </div>

      {/* Introduction Card */}
      <div className="bg-white border border-outline-variant p-6 rounded-2xl flex flex-col lg:flex-row gap-8 items-center shadow-sm">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 text-primary bg-primary/5 px-4 py-1.5 rounded-full font-bold text-label-md">
            <span className="material-symbols-outlined text-sm">info</span>
            دليل الاستخدام
          </div>
          <h3 className="font-title-md text-title-md text-gray-900">كيف تعمل صفحات البيع؟</h3>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            لكل دورة صفحة بيع افتراضية يتم إنشاؤها تلقائياً. يمكنك إنشاء صفحات بيع إضافية لنفس الدورة واستخدم كل صفحة في حملة أو عرض مختلف، بينما تظل جميع الصفحات تبيع نفس الدورة.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-outline-variant/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 bg-blue-50 text-primary rounded-lg flex items-center justify-center font-bold">١</div>
              <p className="text-label-md text-on-surface-variant leading-snug">صفحة بيع افتراضية يتم إنشاؤها تلقائياً.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 bg-blue-50 text-primary rounded-lg flex items-center justify-center font-bold">٢</div>
              <p className="text-label-md text-on-surface-variant leading-snug">أنشئ صفحات بيع إضافية للحملات المختلفة.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 bg-blue-50 text-primary rounded-lg flex items-center justify-center font-bold">٣</div>
              <p className="text-label-md text-on-surface-variant leading-snug">جميع الصفحات مرتبطة بنفس الدورة وتحقق نفس الهدف.</p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-72 shrink-0">
          <div className="aspect-square bg-gradient-to-tr from-primary/5 to-blue-600/10 rounded-3xl flex items-center justify-center relative overflow-hidden border border-outline-variant/20 shadow-inner">
            <Globe className="w-24 h-24 text-primary/20 animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Performance Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-label-sm text-slate-500 bg-slate-50 px-2 py-0.5 rounded font-bold">0%</span>
          </div>
          <p className="text-on-surface-variant text-label-md">إجمالي المبيعات</p>
          <h4 className="text-3xl font-black text-gray-900 mt-1">
            {landingPages.reduce((acc, p) => acc + (p.content?.sales || 0), 0).toLocaleString('ar-EG')}
          </h4>
        </div>
        <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <span className="material-symbols-outlined">layers</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-label-md">عدد صفحات البيع</p>
          <h4 className="text-3xl font-black text-gray-900 mt-1">
            {(1 + landingPages.length).toLocaleString('ar-EG')}
          </h4>
        </div>
        <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm border-r-4 border-r-primary hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-label-md">أفضل صفحة بيع</p>
          <h4 className="text-lg font-black text-gray-900 mt-1 leading-snug line-clamp-1">
            {landingPages.length > 0 && landingPages.some(p => (p.content?.sales || 0) > 0)
              ? (landingPages.reduce((max, p) => (p.content?.sales || 0) > (max.content?.sales || 0) ? p : max, landingPages[0]).content?.campaignName || 'صفحة إضافية')
              : 'صفحة البيع الافتراضية'}
          </h4>
        </div>
      </div>

      {/* Default Landing Page & Custom Campaigns List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900">صفحات البيع المتاحة للدورة</h3>

        {/* 1. Default Landing Page Card */}
        <div className="bg-white border-2 border-blue-600/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 border border-blue-100">
              <Globe size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">أساسية (افتراضية)</span>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> نشطة
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mt-1">صفحة البيع الافتراضية للدورة</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">الصفحة العامة الرسمية لعرض محتوى الدورة والتسجيل مباشرة</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <button
              type="button"
              onClick={handleCopyDefaultLink}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LinkIcon size={14} />
              نسخ الرابط
            </button>
            <button
              type="button"
              onClick={() => {
                const targetSlug = course?.slug || id;
                window.open(`/courses/${targetSlug}`, '_blank');
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={14} />
              معاينة
            </button>
          </div>
        </div>

        {/* 2. Custom Landing Pages */}
        {landingPages.map((page) => (
          <div key={page.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0 border border-purple-100">
                <Sparkles size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">حملة تسويقية</span>
                  {page.is_active ? (
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> نشطة
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full">مسودة</span>
                  )}
                </div>
                <h4 className="text-lg font-black text-slate-900 mt-1">{page.content?.campaignName || page.campaignName || 'صفحة بيع مخصصة'}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">القالب المستعمل: {page.template_name === 'template_1' ? 'الملكي الكلاسيكي' : page.template_name === 'template_2' ? 'الدروس التفاعلي' : 'العصري'}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
              <button
                type="button"
                onClick={() => handleCopyCustomLink(page)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="نسخ رابط صفحة البيع"
              >
                <LinkIcon size={14} />
                نسخ الرابط
              </button>
              <button
                type="button"
                onClick={() => handleOpenEditor(page)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 size={14} />
                تعديل وتخصيص
              </button>
              <button
                type="button"
                onClick={() => handleCloneLandingPage(page)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                title="نسخ / تكرار الصفحة"
              >
                <Copy size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteLandingPage(page.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                title="حذف الصفحة"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Landing Page Editor Modal Overlay (Responsive Scaled Preview) */}
      {inlineEditingTemplate && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          dir="rtl"
          onClick={() => {
            setInlineEditingTemplate(null);
            setInlineEditingPage(null);
          }}
        >
          <div
            className="bg-white rounded-[2rem] w-[95vw] max-w-7xl h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar */}
            <div className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center font-bold">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    محرر صفحة البيع المباشر — {inlineEditingTemplate === 'template_1' ? 'القالب الملكي الكلاسيكي' : inlineEditingTemplate === 'template_2' ? 'قالب الدروس التفاعلي' : 'القالب العصري'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">تعديل الأقسام والمحتوى مع المعاينة الاستجابية الحية</p>
                </div>
              </div>

              {/* Viewport Switcher */}
              <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 gap-1">
                <button
                  type="button"
                  onClick={() => setInlineViewport('desktop')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${inlineViewport === 'desktop' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  <Monitor size={12} /> كمبيوتر (1080p)
                </button>
                <button
                  type="button"
                  onClick={() => setInlineViewport('tablet')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${inlineViewport === 'tablet' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  <Tablet size={12} /> تابلت (768p)
                </button>
                <button
                  type="button"
                  onClick={() => setInlineViewport('mobile')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${inlineViewport === 'mobile' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  <Smartphone size={12} /> جوال (375p)
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const success = await handleSave(currentUser?.id);
                    if (success) {
                      toast.success('تم حفظ التعديلات بنجاح!');
                      fetchLandingPages();
                    }
                  }}
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const courseSlug = course?.slug || id;
                    const url = inlineEditingPage?.id ? `/landing/${courseSlug}?lp_id=${inlineEditingPage.id}` : `/landing/${courseSlug}`;
                    window.open(url, '_blank');
                  }}
                  className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center"
                  title="معاينة كطالب في نافذة جديدة"
                >
                  <Eye size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInlineEditingTemplate(null);
                    setInlineEditingPage(null);
                  }}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center"
                  title="إغلاق المحرر"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden bg-slate-50">
              {/* Right Inspector Form Panel (5 cols) */}
              <div className="lg:col-span-4 bg-white border-l border-slate-200 p-4 text-slate-900 flex flex-col space-y-3 h-full overflow-y-auto">
                <div className="space-y-1 pb-2.5 border-b border-slate-100 shrink-0">
                  <label className="text-[11px] font-black text-slate-700 block">اختر القسم للتعديل والتخصيص:</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
                    value={activeSectionId || ''}
                    onChange={(e) => setActiveSectionId(e.target.value || null)}
                  >
                    <option value="">-- اختر قسماً من القائمة --</option>
                    {inlineEditingTemplate === 'template_2' ? (
                      <>
                        <option value="hero">البانر الرئيسي (الهيرو)</option>
                        <option value="about">عن الدورة وبطاقة الاستثمار</option>
                        <option value="features">بنية الدورة ومميزاتها</option>
                        <option value="chapters">المنهج ومحتوى الدورة</option>
                        <option value="instructor">بيانات واعتمادات المدرب</option>
                        <option value="benefits">ماذا ستحصل عليه (المخرجات)</option>
                        <option value="cta">البانر الختامي (CTA)</option>
                        <option value="footer">تذييل الصفحة (الفوتر)</option>
                        <option value="whatsapp">زر تواصل واتساب</option>
                      </>
                    ) : inlineEditingTemplate === 'template_3' ? (
                      <>
                        <option value="hero">البانر الرئيسي (الهيرو)</option>
                        <option value="learning">ماذا ستتعلم في الدورة</option>
                        <option value="chapters">محتوى الدورة والمنهج</option>
                        <option value="instructor">عن المحاضر والمدرب</option>
                        <option value="faq">الأسئلة الشائعة حول البرنامج</option>
                        <option value="requirements">المتطلبات الأساسية للبدء</option>
                        <option value="payment">بطاقة ورسوم الاشتراك</option>
                        <option value="whatsapp">زر تواصل واتساب</option>
                      </>
                    ) : (
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
                    )}
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto pt-1 space-y-3">
                  {(() => {
                    const sec = (activeSectionId || '').toLowerCase().trim();
                    if (!sec) {
                      return (
                        <div className="text-center py-12 text-slate-400 font-bold text-xs space-y-2">
                          <p>👈 اختر قسماً من القائمة أعلاه لتعديل إعداداته هنا.</p>
                        </div>
                      );
                    }

                    if (inlineEditingTemplate === 'template_2') {
                      switch (sec) {
                        case 'hero':
                        case 'overview':
                        case 'intro':
                        case 'banner':
                        case 'header':
                        case 'main':
                          return <Template2HeroEditor />;
                        case 'about':
                        case 'learning':
                          return <Template2AboutEditor />;
                        case 'features':
                          return <Template2FeaturesEditor />;
                        case 'chapters':
                        case 'curriculum':
                        case 'syllabus':
                        case 'content':
                        case 'modules':
                        case 'units':
                          return <Template2CurriculumEditor />;
                        case 'instructor':
                          return <Template2InstructorEditor />;
                        case 'benefits':
                          return <Template2BenefitsEditor />;
                        case 'cta':
                        case 'payment':
                        case 'pricing':
                          return <Template2CtaEditor />;
                        case 'footer':
                        case 'bottom':
                          return <Template2FooterEditor />;
                        case 'whatsapp':
                        case 'contact':
                        case 'support':
                        case 'chat':
                          return <Template1WhatsAppEditor />;
                        default:
                          return <Template2HeroEditor />;
                      }
                    }

                    if (inlineEditingTemplate === 'template_3') {
                      switch (sec) {
                        case 'hero':
                        case 'overview':
                        case 'intro':
                        case 'banner':
                        case 'header':
                        case 'main':
                          return <Template3HeroEditor />;
                        case 'learning':
                        case 'features':
                        case 'benefits':
                        case 'outcomes':
                        case 'about':
                          return <Template3LearningEditor />;
                        case 'chapters':
                        case 'curriculum':
                        case 'syllabus':
                        case 'content':
                        case 'modules':
                        case 'units':
                          return <Template3CurriculumEditor />;
                        case 'instructor':
                        case 'trainer':
                        case 'teacher':
                          return <Template3InstructorEditor />;
                        case 'faq':
                        case 'questions':
                        case 'help':
                          return <Template3FAQEditor />;
                        case 'requirements':
                        case 'prerequisites':
                        case 'needs':
                          return <Template3RequirementsEditor />;
                        case 'payment':
                        case 'pricing':
                        case 'packages':
                        case 'checkout':
                          return <Template3PricingEditor />;
                        case 'whatsapp':
                        case 'contact':
                        case 'support':
                        case 'chat':
                          return <Template1WhatsAppEditor />;
                        default:
                          return <Template3HeroEditor />;
                      }
                    }

                    switch (sec) {
                      case 'hero':
                      case 'overview':
                      case 'intro':
                      case 'banner':
                      case 'header':
                      case 'main':
                        return <Template1HeroEditor />;
                      case 'learning':
                      case 'features':
                      case 'benefits':
                      case 'outcomes':
                        return <Template1LearningEditor />;
                      case 'chapters':
                      case 'curriculum':
                      case 'syllabus':
                      case 'content':
                      case 'modules':
                      case 'units':
                        return <Template1ChapterEditor />;
                      case 'payment':
                      case 'pricing':
                      case 'packages':
                      case 'checkout':
                        return <Template1PaymentEditor />;
                      case 'faq':
                      case 'questions':
                      case 'help':
                        return <Template1FAQEditor />;
                      case 'reviews':
                      case 'testimonials':
                      case 'feedback':
                      case 'ratings':
                        return <Template1ReviewsEditor />;
                      case 'whatsapp':
                      case 'contact':
                      case 'support':
                      case 'chat':
                        return <Template1WhatsAppEditor />;
                      case 'footer':
                      case 'bottom':
                        return <Template1FooterEditor />;
                      default:
                        return <Template1HeroEditor />;
                    }
                  })()}
                </div>
              </div>

              {/* Left Live Preview Screen (7 cols) */}
              <div className="lg:col-span-8 bg-slate-900/90 p-4 sm:p-6 flex items-center justify-center overflow-auto border-t lg:border-t-0 lg:border-r border-slate-200">
                <div
                  className={`bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 border border-slate-300 relative ${inlineViewport === 'mobile' ? 'w-[375px] h-[667px]' : inlineViewport === 'tablet' ? 'w-[768px] h-[850px]' : 'w-full h-full'}`}
                >
                  <div className="w-full h-full overflow-y-auto">
                    {course && (
                      <div className="pointer-events-none select-none">
                        <LandingRenderer courseId={id} isEditable={true} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
