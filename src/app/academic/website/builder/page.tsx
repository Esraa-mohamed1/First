'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBuilderStore } from '@/builder/store/builderStore';
import { getTemplateById } from '@/builder/utils/templates';
import CanvasContainer from '@/builder/canvas/CanvasContainer';
import InspectorPanel from '@/builder/inspector/InspectorPanel';
import { COMPONENT_REGISTRY } from '@/builder/registry/componentRegistry';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo2, 
  Redo2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Save, 
  Globe,
  Plus,
  LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PageBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId') || '';

  const [tourStep, setTourStep] = useState<number>(-1);

  const tourSteps = [
    {
      title: 'أهلاً بك في أكاديمية درب! 🤖🚀',
      badge: 'مستكشف مبتدئ 🏅',
      text: 'مرحباً بك في مغامرة التصميم الشيقة! سنأخذك في جولة سريعة وممتعة لتعلم كيفية التحكم في صفحات أكاديميتك وتعديلها بسهولة تامة وبكبسة زر واحدة.',
      target: 'welcome',
    },
    {
      title: 'دليل العناصر والمكونات 🎨',
      badge: 'جامع المكونات 🧩',
      text: 'هنا تجد جميع العناصر الجاهزة. فقط اضغط على أي مكون (مثل السلايدر، الإحصائيات، الكورسات) ليتم إضافته فورياً إلى صفحتك وتنسيقه تلقائياً!',
      target: 'aside-widgets',
    },
    {
      title: 'مساحة العمل والتصميم المباشر 💻',
      badge: 'مهندس البناء 🏗️',
      text: 'في المنتصف، ترى موقعك كما يراه الطلاب تماماً! يمكنك الضغط على أي جزء لتعديله، وسحب وإفلات العناصر لإعادة ترتيبها بطريقة سهلة وسلسة.',
      target: 'canvas-workspace',
    },
    {
      title: 'محرر تفاصيل العنصر المحدد ⚙️✨',
      badge: 'سيد التفاصيل 🔍',
      text: 'عند اختيار أي عنصر، تظهر خصائصه في لوحة التعديل الجانبية. لتسهيل الأمر عليك، قمنا بتفعيل "الوضع السهل ✨" افتراضياً ليخفي التفاصيل المعقدة ويظهر لك فقط ما تحتاجه لتغيير النصوص والصور بسهولة!',
      target: 'inspector-panel',
    },
    {
      title: 'أزرار الحفظ والنشر والتراجع 💾🌍',
      badge: 'ناشر المعرفة 🚀',
      text: 'هنا يمكنك التراجع عن أي خطأ، أو معاينة موقعك على الجوال، وحفظ مسودتك محلياً. وعندما تكون جاهزاً، اضغط على "نشر الآن" ليصبح موقعك متاحاً لجميع طلابك بالخارج!',
      target: 'top-header',
    },
    {
      title: 'تهانينا! لقد أكملت التدريب بنجاح! 🎉🏆',
      badge: 'مصمم أسطوري 👑',
      text: 'أنت الآن جاهز بالكامل لتصميم وإطلاق موقع أكاديميتك الخاصة. لقد تم منحك شارة "بطل التصميم" لبدء العمل بذكاء وسرعة!',
      target: 'success',
    }
  ];

  const getDialogPositionClass = (target: string) => {
    switch (target) {
      case 'welcome':
      case 'success':
        return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px]';
      case 'aside-widgets':
        return 'fixed top-[150px] right-[300px] w-[380px]';
      case 'canvas-workspace':
        return 'fixed bottom-10 left-1/2 -translate-x-1/2 w-[400px]';
      case 'inspector-panel':
        return 'fixed top-[150px] left-[360px] w-[380px]';
      case 'top-header':
        return 'fixed top-[90px] left-1/2 -translate-x-1/2 w-[400px]';
      default:
        return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]';
    }
  };

  const getHighlightStyles = (target: string): React.CSSProperties | null => {
    switch (target) {
      case 'top-header':
        return { top: 0, right: 0, left: 0, height: '72px' };
      case 'aside-widgets':
        return { top: '72px', right: 0, bottom: 0, width: '280px' };
      case 'canvas-workspace':
        return { top: '72px', right: '280px', bottom: 0, left: '340px' };
      case 'inspector-panel':
        return { top: '72px', left: 0, bottom: 0, width: '340px' };
      default:
        return null;
    }
  };

  // Start tour invitation automatically on first load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('darab_builder_tour_completed');
      if (!completed) {
        setTourStep(-2); // -2 represents the optional invitation modal
      }
    }
  }, []);

  const {
    currentTemplate,
    deviceMode,
    isEditing,
    historyPast,
    historyFuture,
    loadTemplate,
    setDeviceMode,
    setIsEditing,
    addNode,
    undo,
    redo,
    saveDraft,
    publishTemplate
  } = useBuilderStore();

  // Load selected template configuration
  useEffect(() => {
    let activeId = templateId;
    if (!activeId && typeof window !== 'undefined') {
      activeId = localStorage.getItem('darab_active_template') || 'academy-dashboard';
    }

    // Attempt to load previously edited version from storage first
    const cached = localStorage.getItem(`darab_builder_template_${activeId}`);
    if (cached) {
      try {
        loadTemplate(JSON.parse(cached));
        return;
      } catch (e) {
        console.error('Failed to load cached template, falling back to static config:', e);
      }
    }

    // Fallback to initial config
    const templateConfig = getTemplateById(activeId);
    loadTemplate(templateConfig);
  }, [templateId, loadTemplate]);

  const handleAddWidget = (type: string) => {
    const config = COMPONENT_REGISTRY[type];
    if (!config) return;

    const newNode = {
      id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      props: { ...config.defaultProps },
      children: type === 'tabs' ? [] : undefined
    };

    addNode(newNode);
    toast.success(`تمت إضافة ${config.name} إلى الصفحة بنجاح!`, {
      style: {
        fontFamily: 'IBM Plex Sans Arabic',
        fontSize: '11px',
        fontWeight: 'bold',
        direction: 'rtl'
      }
    });
  };

  const handleSaveDraft = () => {
    saveDraft();
    toast.success('تم حفظ مسودة تعديلاتك محلياً بنجاح.', {
      style: {
        fontFamily: 'IBM Plex Sans Arabic',
        fontSize: '11px',
        fontWeight: 'bold',
        direction: 'rtl'
      }
    });
  };

  const handlePublish = () => {
    publishTemplate();
    toast.success('تهانينا! تم نشر تعديلات القالب وتحديث موجه موقعك بنجاح.', {
      style: {
        fontFamily: 'IBM Plex Sans Arabic',
        fontSize: '11px',
        fontWeight: 'bold',
        direction: 'rtl'
      }
    });
  };

  const handleGoBack = () => {
    // If the template was edited, go back to template list or pages manager
    router.push('/academic/templates');
  };

  if (!currentTemplate) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-black">
        جاري تحميل قالب الأكاديمية...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      
      {/* 1. TOP CONTROL BAR MENU */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex flex-row items-center justify-between z-50 shadow-md">
        
        {/* Navigation title details */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGoBack}
            className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors border border-slate-800"
            title="رجوع للقوالب"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className="leading-tight text-right">
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-black text-white">{currentTemplate.name}</h1>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                currentTemplate.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {currentTemplate.status === 'published' ? 'منشور' : 'مسودة'}
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-bold mt-1">نسخة الإصدار v{currentTemplate.version}</p>
          </div>
        </div>

        {/* Responsive device modes simulator */}
        <div className="flex bg-slate-800/80 rounded-xl p-1 items-center border border-slate-700/40 select-none">
          <button 
            onClick={() => setDeviceMode('desktop')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              deviceMode === 'desktop' ? 'bg-[#2563eb] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="شاشة كمبيوتر"
          >
            <Monitor className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setDeviceMode('tablet')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              deviceMode === 'tablet' ? 'bg-[#2563eb] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="شاشة تابلت"
          >
            <Tablet className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setDeviceMode('mobile')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              deviceMode === 'mobile' ? 'bg-[#2563eb] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="شاشة جوال"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Undo/Redo stack hooks */}
        <div className="flex items-center gap-1.5 bg-slate-800/40 border border-slate-800 rounded-xl p-1">
          <button
            onClick={undo}
            disabled={historyPast.length === 0}
            className={`p-2 rounded-lg transition-colors ${
              historyPast.length > 0 ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="تراجع"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={redo}
            disabled={historyFuture.length === 0}
            className={`p-2 rounded-lg transition-colors ${
              historyFuture.length > 0 ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
            }`}
            title="إعادة تطبيق"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Editor VS Preview & Publish actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTourStep(0)}
            className="px-4 py-2 rounded-xl text-xs font-black text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            title="بدء الجولة التعليمية"
          >
            <span>جولة تعليمية 🎮</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              !isEditing 
                ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' 
                : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:text-slate-100'
            }`}
          >
            {isEditing ? (
              <>
                <Eye className="w-4 h-4" />
                <span>معاينة حية</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>رجوع للتعديل</span>
              </>
            )}
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-700/60 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>حفظ مسودة</span>
          </button>

          <button
            onClick={handlePublish}
            className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-black text-xs shadow-md shadow-blue-500/10 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            <span>نشر الآن</span>
          </button>
        </div>

      </header>

      {/* 2. BODY LAYOUT PANELS */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        
        {/* Left Side: Widgets list (only visible in edit mode) */}
        {isEditing && (
          <aside className="w-[280px] bg-slate-900 border-l border-slate-800 flex flex-col justify-between overflow-y-auto z-30 select-none">
            <div className="p-5 space-y-6">
              
              <div className="space-y-1">
                <h2 className="text-xs font-black text-white flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-blue-500" />
                  <span>دليل العناصر والمكونات</span>
                </h2>
                <p className="text-[9px] text-slate-400 font-bold">اضغط على أي مكون لإضافته فورياً إلى أسفل الصفحة</p>
              </div>

              {/* Categorized blocks directory */}
              <div className="space-y-4">
                
                {/* Content Category */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide block">عناصر المحتوى</span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { type: 'hero', name: 'بانر هيرو', desc: 'عنوان و كبسة استدعاء' },
                      { type: 'course-cards', name: 'بطاقات الكورسات', desc: 'شبكة عرض الدورات الكلية' },
                      { type: 'student-feed', name: 'أحدث أنشطة المتعلمين', desc: 'تحديثات الأنشطة المباشرة' }
                    ].map((item) => (
                      <button
                        key={item.type}
                        onClick={() => handleAddWidget(item.type)}
                        className="w-full text-right p-3.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/60 rounded-2xl flex flex-col justify-center space-y-1.5 transition-all group"
                      >
                        <span className="text-[11px] font-black text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                          {item.name}
                        </span>
                        <span className="text-[8px] text-slate-400 font-medium">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data Category */}
                <div className="space-y-2 pt-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide block">لوحات البيانات والإحصائيات</span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { type: 'kpi-cards', name: 'بطاقات المؤشرات (KPIs)', desc: 'أهم الأرقام والنسب المئوية' },
                      { type: 'charts', name: 'الرسومات والمخططات البيانية', desc: 'رسم بياني تفاعلي للمبيعات' },
                      { type: 'tables', name: 'جداول التقارير والمسجلين', desc: 'قائمة بيانات المشتركين' },
                      { type: 'metrics', name: 'مؤشرات الأداء المصغرة', desc: 'بطاقات تتبع التقدم والتقييم' }
                    ].map((item) => (
                      <button
                        key={item.type}
                        onClick={() => handleAddWidget(item.type)}
                        className="w-full text-right p-3.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/60 rounded-2xl flex flex-col justify-center space-y-1.5 transition-all group"
                      >
                        <span className="text-[11px] font-black text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                          {item.name}
                        </span>
                        <span className="text-[8px] text-slate-400 font-medium">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Category */}
                <div className="space-y-2 pt-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide block">أشرطة التنقل والتبويبات</span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { type: 'navbar', name: 'ترويسة الموقع العلوي', desc: 'شريط تصفح علوي و بروفايل' },
                      { type: 'sidebar', name: 'شريط القائمة الجانبية', desc: 'قائمة لوحة التحكم الرئيسية' },
                      { type: 'tabs', name: 'أزرار التبويبات والفرز', desc: 'مفاتيح التنقل وتصفح الأقسام' }
                    ].map((item) => (
                      <button
                        key={item.type}
                        onClick={() => handleAddWidget(item.type)}
                        className="w-full text-right p-3.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/60 rounded-2xl flex flex-col justify-center space-y-1.5 transition-all group"
                      >
                        <span className="text-[11px] font-black text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                          {item.name}
                        </span>
                        <span className="text-[8px] text-slate-400 font-medium">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Reusable blocks status info */}
            <div className="p-5 border-t border-slate-800 bg-slate-900/60 text-slate-400 text-[10px] font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                تخطيط الكتل (Section-Based)
              </span>
              <p className="text-[8px] text-slate-500 font-medium mt-1 leading-relaxed">
                يتبع هذا الباني نظام Shopify و Notion في هيكلة العناصر لمنع انكسار الكود أو التنسيقات عند النشر.
              </p>
            </div>
          </aside>
        )}

        {/* Center: Canvas Workspace */}
        <CanvasContainer />

        {/* Right Side: Properties Inspector (only visible in edit mode) */}
        {isEditing && <InspectorPanel />}

      </div>

      {/* Onboarding Tour Overlay */}
      {tourStep >= 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none select-none">
          {/* Dark overlay backdrop */}
          <div className="absolute inset-0 bg-slate-950/70 pointer-events-auto" />
          
          {/* Highlight element border */}
          {getHighlightStyles(tourSteps[tourStep]?.target) && (
            <div 
              style={getHighlightStyles(tourSteps[tourStep]?.target)!}
              className="fixed border-4 border-amber-400 rounded-3xl shadow-[0_0_40px_rgba(251,191,36,0.6)] z-[110] transition-all duration-500 pointer-events-none animate-pulse"
            />
          )}

          {/* Dialog Mascot box */}
          <div className={`${getDialogPositionClass(tourSteps[tourStep]?.target)} bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl z-[120] pointer-events-auto text-right font-['IBM_Plex_Sans_Arabic'] flex flex-col gap-4 text-white relative`}>
            
            {/* Mascot header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-2xl animate-bounce">
                🤖
              </div>
              <div className="flex-1 leading-tight">
                <span className="text-[9px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full inline-block mb-1">
                  {tourSteps[tourStep]?.badge}
                </span>
                <h3 className="text-xs font-black text-slate-100">{tourSteps[tourStep]?.title}</h3>
              </div>
              <button 
                onClick={() => {
                  setTourStep(-1);
                  localStorage.setItem('darab_builder_tour_completed', 'true');
                }}
                className="text-slate-500 hover:text-slate-300 text-[10px] font-bold"
              >
                تخطي ×
              </button>
            </div>

            {/* Content text */}
            <p className="text-xs font-bold leading-relaxed text-slate-300 font-['IBM_Plex_Sans_Arabic']">
              {tourSteps[tourStep]?.text}
            </p>

            {/* Stepper progress dots & buttons */}
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-800">
              
              {/* Stepper dots */}
              <div className="flex gap-1.5">
                {tourSteps.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === tourStep ? 'w-6 bg-amber-400' : 'w-2 bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {tourStep > 0 && tourStep < tourSteps.length - 1 && (
                  <button
                    onClick={() => setTourStep(tourStep - 1)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    السابق
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (tourStep === tourSteps.length - 1) {
                      setTourStep(-1);
                      localStorage.setItem('darab_builder_tour_completed', 'true');
                    } else {
                      setTourStep(tourStep + 1);
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[10px] shadow-lg shadow-amber-500/10 active:scale-95 transition-all"
                >
                  {tourStep === 0 ? 'ابدأ الرحلة 🎮' : tourStep === tourSteps.length - 1 ? 'هيا بنا! 🚀' : 'التالي'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Onboarding Tour Invite Modal */}
      {tourStep === -2 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none select-none">
          {/* Dark overlay backdrop */}
          <div className="absolute inset-0 bg-slate-950/75 pointer-events-auto" />

          {/* Invitation modal dialog box */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl z-[120] pointer-events-auto text-right font-['IBM_Plex_Sans_Arabic'] flex flex-col gap-4 text-white relative">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-2xl animate-bounce">
                🤖
              </div>
              <div className="flex-1 leading-tight">
                <span className="text-[9px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full inline-block mb-1">
                  المرشد الذكي 💡
                </span>
                <h3 className="text-sm font-black text-slate-100">مرحباً بك في باني صفحات الأكاديمية!</h3>
              </div>
            </div>

            <p className="text-xs font-bold leading-relaxed text-slate-300">
              أهلاً بك! هل ترغب في بدء جولة تعليمية تفاعلية سريعة (مثل الألعاب) للتعرف على كيفية سحب المكونات وتعديل نصوصها وصورها بكل سهولة؟ 🎮✨
            </p>

            <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setTourStep(-1);
                  localStorage.setItem('darab_builder_tour_completed', 'true');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                تخطي للبدء بالتصميم مباشرة ⚙️
              </button>
              
              <button
                onClick={() => {
                  setTourStep(0);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[10px] shadow-lg shadow-amber-500/10 active:scale-95 transition-all"
              >
                نعم، ابدأ الجولة 🚀
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
