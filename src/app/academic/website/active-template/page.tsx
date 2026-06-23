'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Check, 
  Paintbrush, 
  Edit3, 
  FileText, 
  LayoutGrid, 
  ArrowLeft, 
  Sparkles,
  BookOpen, 
  Layers,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { getPages } from '@/services/pages';
import { getTemplateById } from '@/builder/utils/templates';
import { getThemeBySlug } from '@/builder/templates/themeStyles';

export default function ActiveTemplatePage() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template_1');
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Get cached template and page from localStorage
    const cachedTemplate = localStorage.getItem('darab_active_template');
    if (cachedTemplate) {
      setActiveTemplateId(cachedTemplate);
    }
    const cachedPageId = localStorage.getItem('darab_active_page_id');
    if (cachedPageId) {
      setActivePageId(cachedPageId);
    }

    // 2. Fetch pages from the API to check live settings
    async function loadData() {
      try {
        const apiPages = await getPages();
        setPages(apiPages);
        
        // Find if any page has a template defined and resolves as our home page
        const homePage = apiPages.find((p: any) => p.slug === 'home' || p.slug?.startsWith('home-'));
        if (homePage) {
          const tId = homePage.template || homePage.template_id;
          if (tId) {
            setActiveTemplateId(tId);
          }
          setActivePageId(String(homePage.id));
        }
      } catch (err) {
        console.error('Failed to load pages data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Retrieve template details and theme variables
  const templateInfo = getTemplateById(activeTemplateId);
  const theme = getThemeBySlug(activeTemplateId);

  // Filter pages that are using the active template ID
  const associatedPages = pages.filter((p: any) => {
    const tId = p.template || p.template_id || 'template_1';
    return tId === activeTemplateId;
  });

  const handleCopyColor = (color: string, label: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`تم نسخ لون ${label}: ${color}`, {
      style: {
        fontFamily: 'Cairo, Tajawal, IBM Plex Sans Arabic',
        fontWeight: 'bold',
        direction: 'rtl'
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" dir="rtl">
        <span className="w-10 h-10 border-4 border-[#005c86] border-t-transparent rounded-full animate-spin"></span>
        <p className="text-slate-500 font-bold font-['Cairo']">جاري تحميل بيانات القالب النشط...</p>
      </div>
    );
  }

  // Cover background styling dynamically based on the primary color
  const bannerBgStyle = {
    backgroundColor: theme.primaryColor,
    backgroundImage: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor || theme.secondaryColor} 100%)`
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 text-right space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight font-['Cairo']">القالب النشط</h2>
          <p className="text-slate-400 font-bold mt-2 text-sm">مراجعة تفاصيل وهوية وتنسيق القالب المفعل حالياً لموقعك</p>
        </div>
        <Link 
          href="/academic/templates"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 text-slate-600 font-bold text-xs shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>تغيير أو اختيار قالب جديد</span>
        </Link>
      </div>

      {/* Main Banner and Template Identity Wrapper */}
      <section className="relative rounded-[40px] overflow-hidden bg-white shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-100">
        
        {/* Cover Graphic banner */}
        <div className="h-44 md:h-56 w-full relative" style={bannerBgStyle}>
          {/* Subtle decorations */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-white/5 blur-2xl"></div>
          <div className="absolute top-10 right-10 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-[11px] font-black">
            <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
            <span>قالب نشط ومباشر للطلاب</span>
          </div>
        </div>

        {/* Profile Card Overlay Layout */}
        <div className="px-8 pb-10 relative">
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end -mt-16 md:-mt-24">
            
            {/* Template Card Screenshot Preview */}
            <div className="relative group shrink-0">
              <div className="w-40 h-40 md:w-56 md:h-44 rounded-3xl border-4 border-white overflow-hidden shadow-lg bg-slate-100 relative">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={templateInfo.name}
                  src={
                    activeTemplateId === 'template_2'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4iH4QN5hawBNBS5h9s9nS1TEOla1eY5JJBqQOqqjhAcuOlHHEGvnQUIHaXpvbQX9suHmsGlgv0xfg0Us7GtGZPQZLjNjAsSb3srLVJGGI4JhTw1Ox5L1yvBbvfJnp2IzBFGjUi-SISVcwTm1m9E2wpeb0s33mi9i-k6-PXWT7bxjjJfB8-tokQtf0u5nDOyc2UDANLG2c6UALdgFPTLJ5HDo34MDxx0k5foN_8S6R-2hJhXdyF5sEUPHIXe8KarPgOvzf7Tg2VLI'
                      : activeTemplateId === 'template_3'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9KcwP0hcNTjqTsP9-zEoZDcp7ymS0jNj6ob0RwCIdKZ108wU5GjjnHQ0Ji6KDK0ow73ll6wBAdPJRnFpak6zMSPeZ4oAs50vCNlTZKzFA-09Anx2ZOEFVdcumpmAMBHwpacUtUq3v8BNDiO8uMUSw84-4TcE5wdXfhHaOF0A9vgFNdp5-eoQ3H2QBP0nj_d2E4mHbznhcP-MK1K3iSrqNQPbcQChXz_3auUIfp_d-OYnMw6Hv-Uca0MdxRgbltFjrZV6VFE9-guA'
                      : activeTemplateId === 'template_4'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7fji1EMzpBjvIOPzTzKZXMfFMs_z3kV26cI_u4VZySsAciXaJgM3Az6NM1Dv4arh-Prux6XN7GqdYRv9_L_BhcETvxgmkH2Kp9mMzgjM20WJE7jHDI92KCOYa6xe-XZwTN0tfSlUKxH_y6pOE1twvM7NsZtmAJ7xCG0dMyz3ptUE3dE9DxwvuOp1VEeL-6bnYlbgE1DBMdUmQEwlcdIE5qzhXXvAcf--sm_qb604Y61GeGM2PWxgDVqcnyY_7mFtiZsqC_a593Nc'
                      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuJaarzdUdatddupC-Car8sLGMlsoCGMu746IHi3QCutv4sFUix5gq9L2IRD4GL54JOa5IkrpDTu9qB3y_sthhJWAlnKee_XZS9vb_84lCTldItK-vBbrhlX8HfKgZPrzGv1klkqPQ7pb8ZVCTbn7dwdv_rWq8EFF46EMzQr9htoSdNFZNNvfS_aYO5CeFYWGhoYbUdxIDy63nipZ5e2vktOdPjNh-FlhRPoBUwXsc1nE2lfke5RXmiQsHp6Zg8DVEwfTPMfrx8Ae4'
                  }
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-emerald-600 rounded-full p-1.5 shadow-md border-2 border-white">
                <Check className="w-4 h-4 text-white stroke-[3px]" />
              </div>
            </div>

            {/* Title and stats overlay */}
            <div className="flex-1 text-center md:text-right pb-2 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 font-['Cairo']">{templateInfo.name}</h1>
                <span className="self-center bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 border border-emerald-100">
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  نشط حالياً
                </span>
              </div>
              <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-2xl">{templateInfo.description}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-5 mt-4 text-slate-400 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-400" />
                  عدد الأقسام: {templateInfo.sections?.length || 0} أقسام
                </span>
                <span className="flex items-center gap-1.5 text-[#005c86]">
                  <FileText className="w-4 h-4" />
                  الصفحات المرتبطة: {associatedPages.length} صفحات
                </span>
              </div>
            </div>

            {/* Builder redirection action */}
            <div className="flex gap-3 pb-2 w-full md:w-auto justify-center">
              <Link 
                href={`/academic/website/builder?templateId=${activeTemplateId}${activePageId ? `&pageId=${activePageId}` : ''}`}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#005c86] hover:bg-[#0e76a8] text-white font-black hover:shadow-lg active:scale-95 transition-all text-sm shadow-sm"
              >
                <Edit3 className="w-4.5 h-4.5" />
                <span>تعديل في باني الصفحات</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visual Swatches Info (Right column 2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-white rounded-[40px] p-8 shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 font-['Cairo']">
              <span className="w-1.5 h-6 bg-[#005c86] rounded-full"></span>
              الهوية البصرية والألوان (Style Swatches)
            </h2>
            
            <p className="text-xs text-slate-400 font-bold mb-6">
              تمثل هذه القيم درجات الألوان ونوع الخط المحدد للقالب المفعل، والتي يتم تطبيقها تلقائياً على عناصر الموقع الافتراضية ما لم يتم تخصيصها لكل مكون.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Primary Color Card */}
              <div 
                onClick={() => handleCopyColor(theme.primaryColor, 'الأساسي')}
                className="group cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-3xl p-5 space-y-4 transition-all"
              >
                <div 
                  className="h-20 w-full rounded-2xl shadow-inner group-hover:scale-[1.02] transition-transform duration-300 relative"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <span className="absolute bottom-2 left-2 bg-black/35 backdrop-blur-md text-white font-mono text-[9px] px-2 py-0.5 rounded">
                    {theme.primaryColor}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-xs">اللون الأساسي (Primary)</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">يستخدم للأزرار الرئيسية والتأثيرات الهامة</p>
                </div>
              </div>

              {/* Secondary Color Card */}
              <div 
                onClick={() => handleCopyColor(theme.secondaryColor, 'الثانوي')}
                className="group cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-3xl p-5 space-y-4 transition-all"
              >
                <div 
                  className="h-20 w-full rounded-2xl shadow-inner group-hover:scale-[1.02] transition-transform duration-300 relative"
                  style={{ backgroundColor: theme.secondaryColor }}
                >
                  <span className="absolute bottom-2 left-2 bg-black/35 backdrop-blur-md text-white font-mono text-[9px] px-2 py-0.5 rounded">
                    {theme.secondaryColor}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-xs">اللون الثانوي (Secondary)</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">يستخدم للبطاقات والعناصر الفرعية للتصميم</p>
                </div>
              </div>

              {/* Accent Color Card */}
              <div 
                onClick={() => handleCopyColor(theme.accentColor, 'المميز')}
                className="group cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-3xl p-5 space-y-4 transition-all"
              >
                <div 
                  className="h-20 w-full rounded-2xl shadow-inner group-hover:scale-[1.02] transition-transform duration-300 relative"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <span className="absolute bottom-2 left-2 bg-black/35 backdrop-blur-md text-white font-mono text-[9px] px-2 py-0.5 rounded">
                    {theme.accentColor}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-xs">اللون المميز (Accent)</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">يستخدم للمنشورات، الهيدر والتظليل</p>
                </div>
              </div>

            </div>

            {/* Fonts & Shapes Info row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">نوع خط القالب (Typography)</span>
                <p className="text-base font-black text-slate-800" style={{ fontFamily: theme.fontFamily }}>
                  {theme.fontFamily} (تجربة معاينة النص العربي)
                </p>
                <p className="text-[10px] text-slate-400 font-bold">يتم تحميل هذا الخط بشكل تلقائي لتحسين المظهر وسرعة القراءة</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">زوايا بطاقات العناصر (Card Shape)</span>
                <p className="text-base font-black text-slate-800 capitalize">
                  {theme.cardShape === 'circle' ? 'دائري ناعم (Circle)' :
                   theme.cardShape === 'leaf' ? 'ورقة شجر (Leaf)' :
                   theme.cardShape === 'square' ? 'زوايا قائمة (Square)' : 'كلاسيكي منحني (Classic)'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold">يحدد نمط استدارة الحواف لبطاقات وعناصر الدورات ليعطي تناغماً بصرياً</p>
              </div>
            </div>

          </section>

          {/* Associated Pages Section */}
          <section className="bg-white rounded-[40px] p-8 shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-100 space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 font-['Cairo']">
              <span className="w-1.5 h-6 bg-[#005c86] rounded-full"></span>
              الصفحات التي تعرض هذا القالب حالياً
            </h2>

            {associatedPages.length === 0 ? (
              <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-xs font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>لا توجد صفحات مرتبطة بهذا القالب حتى الآن. قم بإنشاء صفحة وتفعيل القالب عليها ليتم إدراجها هنا.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {associatedPages.map((page: any) => (
                  <div 
                    key={page.id} 
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-3xl gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#005c86]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800">{page.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5" dir="ltr">/{page.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-stretch md:self-auto justify-between">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                        page.status === 'published' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {page.status === 'published' ? 'منشورة للمشاهدين' : 'مسودة داخلية'}
                      </span>

                      <Link 
                        href={`/academic/website/builder?templateId=${activeTemplateId}&pageId=${page.id}`}
                        className="text-xs font-bold text-[#005c86] hover:underline flex items-center gap-1.5"
                      >
                        <span>تعديل الصفحة بالباني</span>
                        <ChevronLeft className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Templates stats & links sidebar (Left column 1/3 width) */}
        <aside className="space-y-8 lg:col-span-1">
          
          {/* Quick Stats Widget */}
          <div className="bg-[#005c86] text-white rounded-[32px] p-6 md:p-8 shadow-md relative overflow-hidden group">
            <div className="absolute -right-16 -bottom-16 w-36 h-36 rounded-full bg-white/5 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            
            <h3 className="text-base font-bold mb-6 opacity-90 font-['Cairo']">معلومات سريعة عن القالب</h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Globe className="w-5 h-5 text-[#c9e6ff]" />
                </div>
                <div>
                  <p className="text-xl font-black">نشط ومفعل</p>
                  <p className="text-[10px] opacity-75 font-semibold">حالة ظهور القالب للطلاب</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <LayoutGrid className="w-5 h-5 text-[#c9e6ff]" />
                </div>
                <div>
                  <p className="text-xl font-black">
                    {activeTemplateId === 'template_1' || activeTemplateId === 'academy-dashboard' ? 'كلاسيكي' :
                     activeTemplateId === 'template_2' ? 'فيروزي عصري' :
                     activeTemplateId === 'template_3' ? 'بنفسجي إبداعي' : 'تيل ريادي'}
                  </p>
                  <p className="text-[10px] opacity-75 font-semibold">النمط والتخطيط الهيكلي</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Paintbrush className="w-5 h-5 text-[#c9e6ff]" />
                </div>
                <div>
                  <p className="text-xl font-black">{theme.fontFamily}</p>
                  <p className="text-[10px] opacity-75 font-semibold">الخط الأساسي للموقع</p>
                </div>
              </div>
            </div>

            <Link 
              href="/academic/templates"
              className="w-full text-center block mt-8 bg-white text-[#005c86] hover:bg-slate-50 py-3.5 rounded-xl font-bold text-xs shadow-md active:scale-97 transition-all"
            >
              عرض كافة القوالب المتاحة
            </Link>
          </div>

          {/* Quick tips for active templates */}
          <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm font-['Cairo']">ملاحظات هامة حول التصاميم</h3>
            
            <div className="space-y-3.5 text-xs text-slate-500 font-medium leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#005c86] rounded-full shrink-0 mt-1.5"></span>
                <span>عند تعديل محتويات أي مكون داخل الباني، سيتم نشر التحديثات بشكل فوري على صفحات موقعك النشط.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#005c86] rounded-full shrink-0 mt-1.5"></span>
                <span>القيم المدرجة في تبويب الهوية والألوان تخدم كقيم افتراضية للتناسق، ويمكنك تلوين أي سكشن بلون مختلف من لوحة الخصائص الجانبية لكل مكون.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#005c86] rounded-full shrink-0 mt-1.5"></span>
                <span>تأثيرات المظهر تظهر مباشرة على النطاق المخصص أو النطاق الفرعي للأكاديمية (مثل `tenant.darab.academy`).</span>
              </p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
