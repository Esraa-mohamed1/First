'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  X, 
  Check, 
  ExternalLink,
  ChevronLeft,
  Star,
  Users,
  Clock,
  Globe,
  BookOpen,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Search,
  MessageSquare,
  Award,
  Video,
  Play,
  Heart,
  ShoppingCart
} from 'lucide-react';
import toast from 'react-hot-toast';

import { createPage } from '@/services/pages';

// -------------------------------------------------------------
// Interfaces and Type Definitions
// -------------------------------------------------------------
interface Template {
  id: string;
  name: string;
  category: 'website' | 'courses';
  imageUrl: string;
  description: string;
  accentColor: string;
  themeName: string;
  rating: string;
  loadSpeed: string;
}

export default function TemplatesPage() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template_1');
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [simulatorMode, setSimulatorMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Load selected template and page ID from localStorage
  useEffect(() => {
    const cachedTemplate = localStorage.getItem('darab_active_template');
    if (cachedTemplate) {
      setActiveTemplateId(cachedTemplate);
    }
    const cachedPageId = localStorage.getItem('darab_active_page_id');
    if (cachedPageId) {
      setActivePageId(cachedPageId);
    }
  }, []);

  const handleSelectTemplate = async (id: string, name: string) => {
    if (activatingId) return;
    setActivatingId(id);

    try {
      const uniqueSuffix = Math.floor(Math.random() * 10000);
      const payload = {
        title: `الرئيسية - ${uniqueSuffix}`,
        slug: `home-${Date.now()}`,
        status: 'published',
        template: id
      };
      
      const created = await createPage(payload);
      const pageId = String(created.id);

      localStorage.setItem('darab_active_template', id);
      localStorage.setItem('darab_active_page_id', pageId);
      
      setActiveTemplateId(id);
      setActivePageId(pageId);

      toast.success(`تم اختيار ${name} كقالب نشط لموقعك بنجاح!`, {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontWeight: 'bold',
          direction: 'rtl'
        }
      });
    } catch (err: any) {
      console.error('Failed to activate template:', err);
      
      // Extract specific validation error if available
      let errorMsg = 'فشل تفعيل القالب. يرجى المحاولة مجدداً.';
      if (err.response?.data?.errors) {
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        if (firstErrorKey) {
          errorMsg = err.response.data.errors[firstErrorKey][0];
        }
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      toast.error(errorMsg, {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontWeight: 'bold',
          direction: 'rtl'
        }
      });
    } finally {
      setActivatingId(null);
    }
  };

  const handleOpenPreview = (template: Template) => {
    setPreviewTemplate(template);
    setSimulatorMode('desktop');
  };

  const handleSelectInsideSimulator = async () => {
    if (previewTemplate) {
      const targetId = previewTemplate.id;
      const targetName = previewTemplate.name;
      setPreviewTemplate(null);
      await handleSelectTemplate(targetId, targetName);
    }
  };

  // -------------------------------------------------------------
  // Data Definitions for Mock Templates
  // -------------------------------------------------------------
  const WEBSITE_TEMPLATES: Template[] = [
    {
      id: 'template_1',
      name: 'قالب الأول (الكلاسيكي الملكي)',
      category: 'website',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJaarzdUdatddupC-Car8sLGMlsoCGMu746IHi3QCutv4sFUix5gq9L2IRD4GL54JOa5IkrpDTu9qB3y_sthhJWAlnKee_XZS9vb_84lCTldItK-vBbrhlX8HfKgZPrzGv1klkqPQ7pb8ZVCTbn7dwdv_rWq8EFF46EMzQr9htoSdNFZNNvfS_aYO5CeFYWGhoYbUdxIDy63nipZ5e2vktOdPjNh-FlhRPoBUwXsc1nE2lfke5RXmiQsHp6Zg8DVEwfTPMfrx8Ae4',
      description: 'تصميم درب التقليدي الاحترافي، بلمسات زرقاء وتخطيط هرمي منسق للدورات.',
      accentColor: '#005c86',
      themeName: 'الأزرق المعتمد',
      rating: '4.9/5',
      loadSpeed: '0.6 ثانية'
    },
    {
      id: 'template_2',
      name: 'قالب الثاني (العصري الفيروزي)',
      category: 'website',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4iH4QN5hawBNBS5h9s9nS1TEOla1eY5JJBqQOqqjhAcuOlHHEGvnQUIHaXpvbQX9suHmsGlgv0xfg0Us7GtGZPQZLjNjAsSb3srLVJGGI4JhTw1Ox5L1yvBbvfJnp2IzBFGjUi-SISVcwTm1m9E2wpeb0s33mi9i-k6-PXWT7bxjjJfB8-tokQtf0u5nDOyc2UDANLG2c6UALdgFPTLJ5HDo34MDxx0k5foN_8S6R-2hJhXdyF5sEUPHIXe8KarPgOvzf7Tg2VLI',
      description: 'واجهة مشبعة بحيويّة اللون الأخضر الفيروزي المنعش وتأثيرات بصرية راقية تجذب المتعلم الحديث.',
      accentColor: '#00a896',
      themeName: 'الفيروزي الحيوي',
      rating: '4.8/5',
      loadSpeed: '0.8 ثانية'
    },
    {
      id: 'template_3',
      name: 'قالب الثالث (الإبداعي الأرجواني)',
      category: 'website',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9KcwP0hcNTjqTsP9-zEoZDcp7ymS0jNj6ob0RwCIdKZ108wU5GjjnHQ0Ji6KDK0ow73ll6wBAdPJRnFpak6zMSPeZ4oAs50vCNlTZKzFA-09Anx2ZOEFVdcumpmAMBHwpacUtUq3v8BNDiO8uMUSw84-4TcE5wdXfhHaOF0A9vgFNdp5-eoQ3H2QBP0nj_d2E4mHbznhcP-MK1K3iSrqNQPbcQChXz_3auUIfp_d-OYnMw6Hv-Uca0MdxRgbltFjrZV6VFE9-guA',
      description: 'ترتيب متطور لرواد التصميم والفنون الإبداعية، بلمسات أرجوانية وخلفيات ناعمة.',
      accentColor: '#8b5cf6',
      themeName: 'الأرجواني الملكي',
      rating: '4.9/5',
      loadSpeed: '0.7 ثانية'
    },
    {
      id: 'template_4',
      name: 'قالب الرابع (الريادي الذهبي)',
      category: 'website',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtqpBVFtjEqV4PVoWYoyU8fcNsGZBndlgPIbkTUs2JhnbX94-veF8_k8_HudB9diVBtjprCKzLuuiObyibFF6J9QbaMi1GcDswO0I4W3wlUhbXjD_j1nPDgegx4guIeTcmiF9PHyt3yU3B-zTYYixNNb5rzSTyXu_dNsQybxKmntcB87QhR6ICgCXRlHXPPaV2v4GrYnnz6NmYa8CQCbDOZw82qqN70CS7UckmVyBWvUnicK0nzC2SZsnW_QwGRn3db9X6vbI-6DE',
      description: 'قالب ريادي أنيق مناسب لمجالات التمويل والتكنولوجيا والاستشارات الإدارية المرموقة.',
      accentColor: '#0d9488',
      themeName: 'تيل احترافي',
      rating: '4.7/5',
      loadSpeed: '0.9 ثانية'
    }
  ];

  const COURSE_TEMPLATES: Template[] = [
    {
      id: 'template_courses_1',
      name: 'قالب أول دورة (التفاعلي)',
      category: 'courses',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7fji1EMzpBjvIOPzTzKZXMfFMs_z3kV26cI_u4VZySsAciXaJgM3Az6NM1Dv4arh-Prux6XN7GqdYRv9_L_BhcETvxgmkH2Kp9mMzgjM20WJE7jHDI92KCOYa6xe-XZwTN0tfSlUKxH_y6pOE1twvM7NsZtmAJ7xCG0dMyz3ptUE3dE9DxwvuOp1VEeL-6bnYlbgE1DBMdUmQEwlcdIE5qzhXXvAcf--sm_qb604Y61GeGM2PWxgDVqcnyY_7mFtiZsqC_a593Nc',
      description: 'عرض تفصيلي متميز لصفحات الدروس يتضمن مخططاً تفاعلياً ومساحة لتلقي تقييمات الطلاب.',
      accentColor: '#005c86',
      themeName: 'شاشات الدروس الكلاسيكية',
      rating: '4.9/5',
      loadSpeed: '0.5 ثانية'
    }
  ];

  return (
    <div className="space-y-10 pb-16 animate-slide-up-fade" dir="rtl">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-2">
            قوالب الموقع
          </h1>
          <p className="text-slate-500 text-sm mt-1">اختر التصميم المناسب لأكاديميتك، وعاين كيفية ظهوره للطلاب قبل اعتماده.</p>
        </div>
        <button 
          onClick={() => {
            const current = WEBSITE_TEMPLATES.find(t => t.id === activeTemplateId) || WEBSITE_TEMPLATES[0];
            handleOpenPreview(current);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#005c86] to-[#0e76a8] text-white font-bold hover:shadow-lg hover:shadow-[#005c86]/10 active:scale-95 transition-all text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          <span>معاينة الموقع النشط</span>
        </button>
      </div>

      {/* SECTION 1: قالب الموقع (Website Templates) */}
      <section className="space-y-6">
        <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-[#005c86] rounded-full"></span>
          قالب الموقع الأساسي
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WEBSITE_TEMPLATES.map((tmpl) => {
            const isActive = activeTemplateId === tmpl.id;
            return (
              <div 
                key={tmpl.id}
                className={`bg-white rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(25,28,29,0.02)] border transition-all duration-300 flex flex-col group ${
                  isActive 
                    ? 'border-4 border-[#005c86] shadow-lg shadow-[#005c86]/5' 
                    : 'border-slate-100 hover:border-slate-200 hover:-translate-y-1.5'
                }`}
              >
                
                {/* Browser Mockup Frame Header */}
                <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 select-none">
                  {/* Browser circles */}
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                  </div>
                  {/* Simulated URL bar */}
                  <div className="bg-white/90 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-400 text-center px-4 py-0.5 w-1/2 select-none truncate">
                    {tmpl.id === 'template_1' ? 'darab.academy' : `${tmpl.themeName}.darab.academy`}
                  </div>
                  <div className="w-8"></div>
                </div>

                {/* Template Thumbnail screenshot with zoom */}
                <div className="h-48 overflow-hidden relative bg-slate-50 shrink-0">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={tmpl.imageUrl} 
                    alt={tmpl.name} 
                  />
                  {isActive && (
                    <span className="absolute top-4 right-4 bg-[#005c86] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      مفعل كقالب أساسي
                    </span>
                  )}
                </div>

                {/* Details Footer */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-black text-slate-800 leading-snug">{tmpl.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-2">
                      <span>النمط: {tmpl.themeName}</span>
                      <span className="text-slate-200">|</span>
                      <span>السرعة: {tmpl.loadSpeed}</span>
                    </p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-3 line-clamp-2">{tmpl.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex gap-3">
                    <button 
                      onClick={() => handleOpenPreview(tmpl)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#005c86] font-bold text-xs transition-colors border border-slate-100"
                    >
                      معاينة القالب
                    </button>
                    {isActive ? (
                      <Link 
                        href={`/academic/website/builder?templateId=${tmpl.id}${activePageId ? `&pageId=${activePageId}` : ''}`}
                        className="flex-1 py-2.5 rounded-xl bg-[#005c86] hover:bg-[#0e76a8] text-white font-bold text-xs transition-colors shadow-sm text-center flex items-center justify-center"
                      >
                        تعديل بالباني
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleSelectTemplate(tmpl.id, tmpl.name)}
                        disabled={!!activatingId}
                        className="flex-1 py-2.5 rounded-xl bg-[#005c86] hover:bg-[#0e76a8] text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      >
                        {activatingId === tmpl.id ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>جاري التفعيل...</span>
                          </>
                        ) : (
                          <span>اختيار القالب</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: قالب الدورات (Course Templates) */}
      <section className="space-y-6 pt-6">
        <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-[#005c86] rounded-full"></span>
          قوالب عرض الدورات
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSE_TEMPLATES.map((tmpl) => {
            const isActive = activeTemplateId === tmpl.id;
            return (
              <div 
                key={tmpl.id}
                className={`bg-white rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-100 transition-all duration-300 flex flex-col group ${
                  isActive ? 'border-4 border-[#005c86]' : 'hover:border-slate-200 hover:-translate-y-1.5'
                }`}
              >
                
                {/* Browser Mockup Header */}
                <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 select-none">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                  </div>
                  <div className="bg-white/90 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-400 text-center px-4 py-0.5 w-1/2 select-none truncate">
                    darab.academy/courses/learn
                  </div>
                  <div className="w-8"></div>
                </div>

                <div className="h-48 overflow-hidden relative bg-slate-50 shrink-0">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={tmpl.imageUrl} 
                    alt={tmpl.name} 
                  />
                  {isActive && (
                    <span className="absolute top-4 right-4 bg-[#005c86] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      مفعل
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-black text-slate-800 leading-snug">{tmpl.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">النوع: {tmpl.themeName}</p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-3 line-clamp-2">{tmpl.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex gap-3">
                    <button 
                      onClick={() => handleOpenPreview(tmpl)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#005c86] font-bold text-xs transition-colors border border-slate-100"
                    >
                      معاينة القالب
                    </button>
                    {isActive ? (
                      <Link 
                        href={`/academic/website/builder?templateId=${tmpl.id}${activePageId ? `&pageId=${activePageId}` : ''}`}
                        className="flex-1 py-2.5 rounded-xl bg-[#005c86] hover:bg-[#0e76a8] text-white font-bold text-xs transition-colors shadow-sm text-center flex items-center justify-center"
                      >
                        تعديل بالباني
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleSelectTemplate(tmpl.id, tmpl.name)}
                        disabled={!!activatingId}
                        className="flex-1 py-2.5 rounded-xl bg-[#005c86] hover:bg-[#0e76a8] text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      >
                        {activatingId === tmpl.id ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>جاري التفعيل...</span>
                          </>
                        ) : (
                          <span>اختيار القالب</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------
          FULL-SCREEN INTERACTIVE SIMULATOR PREVIEW MODAL
          ------------------------------------------------------------- */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-slate-900 animate-fade-in animate-on-scroll reveal" dir="rtl">
          
          {/* Simulator Top bar navigation */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-row items-center justify-between z-50 shadow-md">
            
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div className="leading-tight">
                <h3 className="text-sm font-black text-white">معاينة تفاعلية: {previewTemplate.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold">تجاوب فوري على جميع أحجام الشاشات</p>
              </div>
            </div>

            {/* Device simulators triggers */}
            <div className="flex bg-slate-800 rounded-xl p-1 items-center border border-slate-700/60 select-none">
              <button 
                onClick={() => setSimulatorMode('desktop')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  simulatorMode === 'desktop' ? 'bg-[#005c86] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">كمبيوتر</span>
              </button>

              <button 
                onClick={() => setSimulatorMode('tablet')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  simulatorMode === 'tablet' ? 'bg-[#005c86] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden sm:inline">تابلت</span>
              </button>

              <button 
                onClick={() => setSimulatorMode('mobile')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  simulatorMode === 'mobile' ? 'bg-[#005c86] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">جوال</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {previewTemplate.id === activeTemplateId ? (
                <Link
                  href={`/academic/website/builder?templateId=${previewTemplate.id}${activePageId ? `&pageId=${activePageId}` : ''}`}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center"
                >
                  تعديل بالباني
                </Link>
              ) : (
                <button 
                  onClick={handleSelectInsideSimulator}
                  disabled={!!activatingId}
                  className="px-5 py-2.5 rounded-xl bg-[#005c86] hover:brightness-110 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {activatingId === previewTemplate.id ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>جاري التفعيل...</span>
                    </>
                  ) : (
                    <span>تفعيل القالب</span>
                  )}
                </button>
              )}
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-colors border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Simulated content panel */}
          <div className="flex-1 bg-slate-950 p-4 md:p-8 flex items-center justify-center overflow-auto relative">
            
            <div 
              className={`bg-white transition-all duration-500 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden h-[95%] border border-slate-800 ${
                simulatorMode === 'desktop' ? 'w-full max-w-[1400px]' :
                simulatorMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
              }`}
            >
              
              {/* Simulator Browser Header Mockup */}
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3.5 flex items-center gap-3 shrink-0 z-20">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                </div>
                <div className="flex-1 max-w-lg mx-auto bg-slate-200/50 border border-slate-200/70 rounded-lg text-[11px] font-semibold text-slate-400 text-center py-1 truncate" dir="ltr">
                  {previewTemplate.id === 'template_1' ? 'https://darab.academy' : `https://${previewTemplate.themeName}.darab.academy`}
                </div>
              </div>

              {/* DYNAMIC HIGH-FIDELITY PREVIEW RENDERING */}
              {previewTemplate.id === 'template_1' ? (
                
                /* =========================================================
                   TEMPLATE 1: INDIGO CLASSIC MOCKUP (matches input_file_0.png)
                   ========================================================= */
                <div className="flex-1 overflow-y-auto custom-scrollbar text-slate-800 bg-[#F3F4F5] font-['IBM_Plex_Sans_Arabic']" dir="rtl">
                  
                  {/* Top Header */}
                  <header className={`bg-white border-b border-slate-100 py-3.5 flex justify-between items-center sticky top-0 z-50 ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    <div className="flex items-center gap-6">
                      {/* Logo Play */}
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                          <Play className="w-4.5 h-4.5 text-white fill-white shrink-0 ml-0.5" />
                        </div>
                        <span className="font-black text-slate-900 text-xl tracking-tight">درب</span>
                      </div>
                    </div>

                    {/* Middle Search bar */}
                    {simulatorMode === 'desktop' && (
                      <div className="flex-1 max-w-lg mx-8 flex items-center" dir="ltr">
                        <button className="bg-[#2563eb] text-white px-5 py-2 rounded-l-xl text-xs font-bold shrink-0">ابحث</button>
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            placeholder="البحث في الدورات والطلاب" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-r-xl py-2 px-4 text-xs font-medium text-right text-slate-700 outline-none focus:ring-1 focus:ring-[#2563eb]"
                          />
                          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    )}

                    <div className={`flex items-center text-xs font-black text-slate-500 ${
                      simulatorMode === 'mobile' ? 'gap-2 text-[10px]' : simulatorMode === 'tablet' ? 'gap-4' : 'gap-6'
                    }`}>
                      <span className="cursor-pointer hover:text-[#2563eb] transition-colors">مسارات التعلم</span>
                      <span className="cursor-pointer hover:text-[#2563eb] transition-colors">حسابي</span>
                      <span className="text-red-500 cursor-pointer hover:text-red-600 transition-colors">تسجيل الخروج</span>
                    </div>
                  </header>

                  {/* Hero Block */}
                  <section className={`bg-gradient-to-b from-[#e8f1ff] to-white text-center relative overflow-hidden ${
                    simulatorMode === 'desktop' ? 'py-16 px-12' : simulatorMode === 'tablet' ? 'py-14 px-8' : 'py-10 px-4'
                  }`}>
                    <div className="max-w-2xl mx-auto space-y-6">
                      <h2 className={`font-black text-slate-800 leading-tight ${
                        simulatorMode === 'desktop' ? 'text-5xl' : simulatorMode === 'tablet' ? 'text-3xl' : 'text-2xl'
                      }`}>
                        ابدأ اليوم... وخلّ مستقبلك يتغير.
                      </h2>
                      <p className={`text-slate-500 font-semibold leading-relaxed max-w-lg mx-auto ${
                        simulatorMode === 'desktop' ? 'text-base' : 'text-sm'
                      }`}>
                        محتوى بسيط وعملي يوصلك لنتيجة حقيقية بدون تعقيد.
                      </p>
                      
                      <div className={`flex justify-center gap-4 pt-2 ${
                        simulatorMode === 'mobile' ? 'flex-col items-center gap-2 px-6' : 'flex-row'
                      }`}>
                        <button className={`py-3.5 rounded-xl bg-[#2563eb] text-white font-black text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all ${
                          simulatorMode === 'mobile' ? 'w-full' : 'px-8'
                        }`}>
                          ابدأ الآن
                        </button>
                        <button className={`py-3.5 rounded-xl bg-slate-800 text-white font-black text-xs active:scale-95 transition-all ${
                          simulatorMode === 'mobile' ? 'w-full' : 'px-8'
                        }`}>
                          تصفح الكورسات
                        </button>
                      </div>

                      {/* Stat Metrics */}
                      <div className={`grid grid-cols-3 pt-10 border-t border-slate-100 max-w-xl mx-auto text-center ${
                        simulatorMode === 'desktop' ? 'gap-6' : 'gap-2'
                      }`}>
                        <div className="relative">
                          <p className={`font-black text-slate-800 ${
                            simulatorMode === 'desktop' ? 'text-3xl' : simulatorMode === 'tablet' ? 'text-2xl' : 'text-base'
                          }`}>542,412</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">متعلم خريج</p>
                          <div className="absolute left-0 top-1/4 h-1/2 w-[1px] bg-slate-200"></div>
                        </div>
                        <div className="relative">
                          <p className={`font-black text-slate-800 ${
                            simulatorMode === 'desktop' ? 'text-3xl' : simulatorMode === 'tablet' ? 'text-2xl' : 'text-base'
                          }`}>412+</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">فيديو</p>
                          <div className="absolute left-0 top-1/4 h-1/2 w-[1px] bg-slate-200"></div>
                        </div>
                        <div>
                          <p className={`font-black text-slate-800 ${
                            simulatorMode === 'desktop' ? 'text-3xl' : simulatorMode === 'tablet' ? 'text-2xl' : 'text-base'
                          }`}>263,124</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">شهادة صادرة</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Categories Tags Section */}
                  <section className={`py-8 bg-white text-center ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    <h3 className={`font-black text-slate-800 mb-6 ${
                      simulatorMode === 'desktop' ? 'text-xl' : 'text-base'
                    }`}>الأقسام</h3>
                    <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                      <span className="bg-[#2563eb] text-white text-[10px] font-bold px-4 py-2 rounded-full cursor-pointer shadow-sm">كل الأقسام</span>
                      <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-4 py-2 rounded-full cursor-pointer hover:border-[#2563eb]">الرسم والتصميم</span>
                      <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-4 py-2 rounded-full cursor-pointer hover:border-[#2563eb]">التسويق</span>
                      <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-4 py-2 rounded-full cursor-pointer hover:border-[#2563eb]">تكنولوجيا المعلومات</span>
                      <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-4 py-2 rounded-full cursor-pointer hover:border-[#2563eb]">الأعمال</span>
                      <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-4 py-2 rounded-full cursor-pointer hover:border-[#2563eb]">التصوير وصناعة الأفلام</span>
                      <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-4 py-2 rounded-full cursor-pointer hover:border-[#2563eb]">صناعة المحتوى</span>
                      <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-4 py-2 rounded-full cursor-pointer hover:border-[#2563eb]">التحريك</span>
                    </div>
                  </section>

                  {/* Latest Courses Section */}
                  <section className={`py-12 bg-white ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    <div className="max-w-6xl mx-auto">
                      <h3 className={`font-black text-slate-800 mb-8 flex items-center gap-2.5 ${
                        simulatorMode === 'desktop' ? 'text-2xl' : 'text-lg'
                      }`}>
                        <span className="w-1.5 h-6 bg-[#2563eb] rounded-full"></span>
                        آخر الدورات المسجلة
                      </h3>

                      <div className={`grid gap-8 ${
                        simulatorMode === 'desktop' ? 'grid-cols-3' : simulatorMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'
                      }`}>
                        {[
                          { name: 'MOHAMED ELMUFTY', role: 'PHOTOSHOP FUNDAMENTALS', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM' },
                          { name: 'SOHAIP HASSAN', role: 'MICROSOFT EXCEL', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI' },
                          { name: 'MOSTAFA ABD EL SABOR', role: 'LEARNING ENGLISH', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM' },
                          { name: 'AMR EL-BROLOSY', role: 'FUNDAMENTALS OF FILM', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI' },
                          { name: 'MOSTAFA ABD EL SABOR', role: 'LEARNING ENGLISH', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM' },
                          { name: 'ISLAM ELSADEK', role: 'BEGINNER TO MARKETING', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI' }
                        ].map((instructor, idx) => (
                          <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(25,28,29,0.03)] border border-slate-100 hover:scale-[1.01] transition-transform duration-200 flex flex-col">
                            {/* Card Image header containing instructor */}
                            <div className="h-44 bg-[#0a192f] flex items-center justify-center p-4 relative text-white">
                              {/* Curved profile framing */}
                              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/50 bg-slate-700">
                                <img className="w-full h-full object-cover" src={instructor.img} alt={instructor.name} />
                              </div>
                              <div className="absolute bottom-4 right-4 text-right">
                                <p className="text-[10px] font-black text-blue-400">{instructor.role}</p>
                                <p className="text-xs font-black text-white">{instructor.name}</p>
                              </div>
                            </div>
                            
                            {/* Card Info details */}
                            <div className="p-5 space-y-4">
                              <h4 className="text-sm font-black text-slate-800 leading-snug">اللغة الإنجليزية-المستوى الأول</h4>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-3 border-t border-slate-50">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  6 ساعات
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-blue-500" />
                                  109 طلاب
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-2">
                                <span className="text-base font-extrabold text-[#2563eb]">250 ريال</span>
                                <button className="bg-[#2563eb] hover:bg-blue-600 text-white font-black text-[9px] px-3.5 py-2 rounded-lg transition-colors">
                                  انضم الآن
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Testimonial slider section */}
                  <section className={`py-12 bg-slate-100/60 text-center ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    <div className="max-w-4xl mx-auto space-y-8">
                      <h3 className={`font-black text-slate-800 border-b-2 border-[#2563eb] pb-2 inline-block ${
                        simulatorMode === 'desktop' ? 'text-2xl' : 'text-lg'
                      }`}>ماذا يقول طلابنا</h3>
                      
                      <div className={`grid gap-6 text-right ${
                        simulatorMode === 'desktop' ? 'grid-cols-3' : simulatorMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'
                      }`}>
                        {[1, 2, 3].map((val) => (
                          <div key={val} className="bg-[#2563eb] text-white p-6 rounded-2xl shadow-md relative flex flex-col justify-between min-h-[160px]">
                            <span className="text-3xl opacity-20 block leading-none font-serif">“</span>
                            <p className="text-xs font-semibold leading-relaxed mb-4">
                              "أعتقد أن EduTech من أفضل المواقع للدراسة عبر الإنترنت. أنا طالب منتظم وأنا سعيد جداً بالدراسة مع معلمي."
                            </p>
                            <div className="flex items-center gap-3 border-t border-white/10 pt-3">
                              <div className="w-7 h-7 rounded-full bg-white/20 overflow-hidden">
                                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI" alt="Student avatar" />
                              </div>
                              <div>
                                <p className="font-black text-[10px]">أحمد محمد</p>
                                <p className="text-[8px] opacity-75">جرافيك ديزاينر</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Footer Section */}
                  <footer className={`bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    <div className={`max-w-6xl mx-auto grid gap-8 text-right ${
                      simulatorMode === 'desktop' ? 'grid-cols-4' : simulatorMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'
                    }`}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white">
                          <Play className="w-5 h-5 fill-white" />
                          <span className="text-lg font-black">درب</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">منصة تعليمية تساعدك في تطوير مهاراتك العلمية والعملية بسهولة تامة وبأساليب حديثة.</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-black text-white text-xs">قائمتنا</h4>
                        <ul className="space-y-2 text-xs text-slate-500">
                          <li>الرئيسية</li>
                          <li>من نحن</li>
                          <li>الباقات والأستعار</li>
                          <li>تواصل معنا</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-black text-white text-xs">المعلومات</h4>
                        <ul className="space-y-2 text-xs text-slate-500">
                          <li>الأسئلة الشائعة</li>
                          <li>عن الأكاديمية</li>
                          <li>المدربون</li>
                          <li>كيف تعمل المنصة</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-black text-white text-xs">تواصل معنا</h4>
                        <ul className="space-y-2 text-xs text-slate-500">
                          <li dir="ltr">+966 5000000</li>
                          <li>info@darab.academy</li>
                          <li>الرياض، المملكة العربية السعودية</li>
                        </ul>
                      </div>
                    </div>
                  </footer>

                </div>
              ) : (
                
                /* =========================================================
                   TEMPLATE 2: TEAL TURQUOISE MOCKUP (matches input_file_1.png)
                   ========================================================= */
                <div className="flex-1 overflow-y-auto custom-scrollbar text-slate-800 bg-white font-['IBM_Plex_Sans_Arabic']" dir="rtl">
                  
                  {/* Teal Header (matching screenshot) */}
                  <header className={`bg-white border-b border-slate-100 py-4 flex justify-between items-center sticky top-0 z-50 ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    
                    {/* Left: Button "سجل الآن" */}
                    <div className="flex items-center gap-4">
                      <button className="px-6 py-2.5 rounded-full bg-[#00a896] hover:bg-[#009282] text-white font-black text-xs shadow-md shadow-[#00a896]/15 hover:shadow-lg transition-all duration-200 active:scale-95 shrink-0">
                        سجل الآن
                      </button>
                    </div>

                    {/* Center-Left: Search Input Bar "ماذا تريد أن تتعلم اليوم؟" */}
                    {simulatorMode === 'desktop' && (
                      <div className="flex items-center flex-1 max-w-sm mx-4 bg-slate-50 border border-slate-200/80 rounded-full px-4 py-2 relative shadow-inner">
                        <input 
                          type="text" 
                          placeholder="ماذا تريد أن تتعلم اليوم?" 
                          className="w-full bg-transparent text-[11px] font-bold text-slate-700 outline-none text-right placeholder-slate-400"
                          dir="rtl"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                      </div>
                    )}

                    {/* Right-Center Navigation & Right Logo */}
                    <div className="flex items-center gap-8">
                      {simulatorMode === 'desktop' && (
                        <nav className="flex items-center gap-6 text-xs font-black text-slate-600">
                          <span className="text-[#00a896] hover:opacity-90 transition-colors cursor-pointer flex items-center gap-1">
                            الدورات
                            <svg className="w-2.5 h-2.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </span>
                          <span className="hover:text-[#00a896] transition-colors cursor-pointer flex items-center gap-1">
                            التخصصات
                            <svg className="w-2.5 h-2.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </span>
                          <span className="hover:text-[#00a896] transition-colors cursor-pointer">الشركاء</span>
                        </nav>
                      )}
                      
                      {/* Logo mimicking "إدراك" */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#00a896] flex items-center justify-center text-white shrink-0 font-extrabold text-sm shadow-sm shadow-[#00a896]/15">
                          <Award className="w-4 h-4" />
                        </div>
                        <span className="font-black text-[#00a896] text-lg tracking-tight select-none">إدراك</span>
                      </div>
                    </div>
                  </header>

                  {/* Hero Block with concentric waves background & Students photo */}
                  <section className={`bg-white py-16 relative overflow-hidden border-b border-slate-100/80 ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    
                    {/* Concentric rings mimicking the waves in the screenshot */}
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] border border-teal-50/60 rounded-full pointer-events-none z-0"></div>
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[480px] h-[480px] border border-teal-100/40 rounded-full pointer-events-none z-0"></div>
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[360px] h-[360px] border border-teal-150/30 rounded-full pointer-events-none z-0"></div>

                    <div className={`max-w-6xl mx-auto flex items-center justify-between gap-12 relative z-10 ${
                      simulatorMode === 'desktop' ? 'flex-row' : 'flex-col-reverse'
                    }`}>
                      
                      {/* Left: circular students layout in high premium framing */}
                      <div className={`flex justify-center relative ${
                        simulatorMode === 'desktop' ? 'w-1/2' : 'w-full max-w-sm'
                      }`}>
                        <div className="relative">
                          {/* Sleek shadow backdrops */}
                          <div className="absolute -inset-4 bg-gradient-to-tr from-[#02c39a]/10 to-[#00a896]/15 rounded-[48px] rotate-3 blur-md scale-95"></div>
                          <div className="absolute -inset-1 bg-gradient-to-tr from-[#02c39a]/20 to-[#00a896]/30 rounded-[52px] -rotate-2 scale-100"></div>
                          
                          <div className={`rounded-[42px] overflow-hidden border-[6px] border-white bg-slate-50 flex items-center justify-center relative shadow-xl ${
                            simulatorMode === 'desktop' ? 'w-[380px] h-[380px]' : 'w-72 h-72'
                          }`}>
                            <div className="absolute inset-0 bg-teal-900/5 mix-blend-multiply"></div>
                            <img 
                              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM" 
                              alt="Students studying on laptop"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Hero texts & Statistics Cards */}
                      <div className={`space-y-8 ${
                        simulatorMode === 'desktop' ? 'w-1/2 text-right' : 'w-full text-center flex flex-col items-center'
                      }`}>
                        <div className="space-y-4">
                          <h2 className={`font-black text-slate-800 leading-tight ${
                            simulatorMode === 'desktop' ? 'text-5xl' : simulatorMode === 'tablet' ? 'text-3xl' : 'text-2xl'
                          }`}>
                            تعلم، طبق، وخلك مميز
                          </h2>
                          <p className="text-slate-500 text-sm font-semibold leading-relaxed max-w-lg">
                            تأهيل كامل لسوق العمل من خلال مسارات تعليمية وتطبيقية متكاملة بأساليب حديثة.
                          </p>
                        </div>
                        
                        <button className="px-7 py-4 rounded-xl bg-[#00a896] hover:bg-[#009282] text-white font-black text-xs shadow-lg shadow-[#00a896]/20 transition-all hover:shadow-[#00a896]/30 hover:-translate-y-0.5 active:scale-95 duration-200">
                          اكتشف برامجنا التعليمية
                        </button>

                        {/* Custom framed statistics cards */}
                        <div className={`grid grid-cols-3 gap-4 pt-8 border-t border-slate-100 max-w-md ${
                          simulatorMode === 'desktop' ? '' : 'w-full'
                        }`}>
                          <div className="bg-white border border-[#00a896]/25 px-2 py-3.5 rounded-2xl shadow-sm text-center transform hover:scale-[1.02] transition-transform">
                            <p className={`font-extrabold text-[#00a896] ${
                              simulatorMode === 'desktop' ? 'text-2xl' : 'text-xl'
                            }`}>50+</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-1.5 leading-tight">تخصص ومسار تعليمي</p>
                          </div>
                          <div className="bg-white border border-[#00a896]/25 px-2 py-3.5 rounded-2xl shadow-sm text-center transform hover:scale-[1.02] transition-transform">
                            <p className={`font-extrabold text-[#00a896] ${
                              simulatorMode === 'desktop' ? 'text-2xl' : 'text-xl'
                            }`}>500+</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-1.5 leading-tight">دورة تدريبية</p>
                          </div>
                          <div className="bg-white border border-[#00a896]/25 px-2 py-3.5 rounded-2xl shadow-sm text-center transform hover:scale-[1.02] transition-transform">
                            <p className={`font-extrabold text-[#00a896] ${
                              simulatorMode === 'desktop' ? 'text-2xl' : 'text-xl'
                            }`}>100+</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-1.5 leading-tight">مشروع تطبيقي وعملي</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </section>

                  {/* Vibrant Teal Banner Section (ابدأ التعلم مجاناً الآن) */}
                  <section className={`py-12 bg-[#00a896] text-center text-white relative overflow-hidden ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                      <h3 className={`font-black text-white ${
                        simulatorMode === 'desktop' ? 'text-2xl' : 'text-xl'
                      }`}>ابدأ التعلم مجاناً الآن</h3>
                      <p className="text-teal-50 text-xs font-semibold leading-relaxed max-w-xl mx-auto">
                        اكتشف مجموعة واسعة من أكثر من 300 دورة، مصممة خصيصاً لتلبية مهاراتكم واهتماماتكم!
                      </p>

                      {/* Category pills exactly like the screenshot */}
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        <span className="bg-[#0b2b2b] text-white text-[10px] font-bold px-4.5 py-2.5 rounded-full cursor-pointer shadow-md transform hover:scale-[1.02] transition-all">
                          كل الأقسام
                        </span>
                        {[
                          'الرسم والتصميم',
                          'الفنون',
                          'تكنولوجيا المعلومات',
                          'الأعمال',
                          'اللغات',
                          'صناعة المحتوى',
                          'التحريك',
                          'مؤتمرات وبرامج'
                        ].map((cat, idx) => (
                          <span 
                            key={idx} 
                            className="bg-transparent border border-white/40 hover:border-white text-white text-[10px] font-bold px-4.5 py-2.5 rounded-full cursor-pointer hover:bg-white/5 transform hover:scale-[1.02] transition-all"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Main Courses Grid Section */}
                  <section className={`py-16 bg-[#f8fafc] ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    <div className="max-w-6xl mx-auto space-y-12">
                      
                      <div className={`grid gap-8 ${
                        simulatorMode === 'desktop' ? 'grid-cols-3' : simulatorMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'
                      }`}>
                        {[
                          { title: 'تصميم واجهة المستخدم (UI)', rating: '4.9', duration: '12 ساعة', tag: 'دورة مميزة', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4iH4QN5hawBNBS5h9s9nS1TEOla1eY5JJBqQOqqjhAcuOlHHEGvnQUIHaXpvbQX9suHmsGlgv0xfg0Us7GtGZPQZLjNjAsSb3srLVJGGI4JhTw1Ox5L1yvBbvfJnp2IzBFGjUi-SISVcwTm1m9E2wpeb0s33mi9i-k6-PXWT7bxjjJfB8-tokQtf0u5nDOyc2UDANLG2c6UALdgFPTLJ5HDo34MDxx0k5foN_8S6R-2hJhXdyF5sEUPHIXe8KarPgOvzf7Tg2VLI' },
                          { title: 'أساسيات البرمجة بلغة جافاسكريبت', rating: '4.8', duration: '18 ساعة', tag: 'جديد', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM' },
                          { title: 'تصميم ثلاثي الأبعاد والتحريك المتقدم', rating: '4.7', duration: '20 ساعة', tag: 'دورة مجانية', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI' },
                          { title: 'البحث وتحليل البيانات واتخاذ القرار الاستراتيجي', rating: '4.9', duration: '15 ساعة', tag: 'دورة مجانية', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtqpBVFtjEqV4PVoWYoyU8fcNsGZBndlgPIbkTUs2JhnbX94-veF8_k8_HudB9diVBtjprCKzLuuiObyibFF6J9QbaMi1GcDswO0I4W3wlUhbXjD_j1nPDgegx4guIeTcmiF9PHyt3yU3B-zTYYixNNb5rzSTyXu_dNsQybxKmntcB87QhR6ICgCXRlHXPPaV2v4GrYnnz6NmYa8CQCbDOZw82qqN70CS7UckmVyBWvUnicK0nzC2SZsnW_QwGRn3db9X6vbI-6DE' },
                          { title: 'إدارة المستودعات وسلاسل الإمداد اللوجستية', rating: '4.6', duration: '10 ساعات', tag: 'دورة مجانية', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7fji1EMzpBjvIOPzTzKZXMfFMs_z3kV26cI_u4VZySsAciXaJgM3Az6NM1Dv4arh-Prux6XN7GqdYRv9_L_BhcETvxgmkH2Kp9mMzgjM20WJE7jHDI92KCOYa6xe-XZwTN0tfSlUKxH_y6pOE1twvM7NsZtmAJ7xCG0dMyz3ptUE3dE9DxwvuOp1VEeL-6bnYlbgE1DBMdUmQEwlcdIE5qzhXXvAcf--sm_qb604Y61GeGM2PWxgDVqcnyY_7mFtiZsqC_a593Nc' },
                          { title: 'صناعة المحتوى الرقمي المسموع والمرئي', rating: '4.9', duration: '14 ساعة', tag: 'جديد', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4iH4QN5hawBNBS5h9s9nS1TEOla1eY5JJBqQOqqjhAcuOlHHEGvnQUIHaXpvbQX9suHmsGlgv0xfg0Us7GtGZPQZLjNjAsSb3srLVJGGI4JhTw1Ox5L1yvBbvfJnp2IzBFGjUi-SISVcwTm1m9E2wpeb0s33mi9i-k6-PXWT7bxjjJfB8-tokQtf0u5nDOyc2UDANLG2c6UALdgFPTLJ5HDo34MDxx0k5foN_8S6R-2hJhXdyF5sEUPHIXe8KarPgOvzf7Tg2VLI' }
                        ].map((course, idx) => (
                          <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-100 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group">
                            
                            {/* Card Image Header */}
                            <div className="h-44 overflow-hidden relative bg-slate-50 p-3 shrink-0">
                              <img className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105" src={course.img} alt={course.title} />
                              <span className="absolute top-5 right-5 bg-amber-100 text-amber-800 text-[9px] font-black px-3 py-1 rounded-full shadow-sm">
                                {course.tag}
                              </span>
                            </div>
                            
                            {/* Card Content Details */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                              <div>
                                <h4 className="text-xs font-black text-slate-800 leading-snug line-clamp-2">{course.title}</h4>
                                <div className="flex items-center gap-1.5 mt-2">
                                  <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star key={s} className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-bold mt-0.5">({course.rating})</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mt-2">{course.duration}</p>
                              </div>

                              {/* Card Action footer (wishlist & purple enroll button) */}
                              <div className="flex justify-between items-center pt-3 border-t border-slate-150">
                                <button className="p-2.5 rounded-full border border-slate-100 hover:border-red-150 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                  <Heart className="w-3.5 h-3.5" />
                                </button>
                                <button className="bg-[#3b2dcf] hover:bg-[#2b1dcf] text-white text-[9px] font-black px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-md shadow-[#3b2dcf]/15">
                                  اشترك الآن
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>

                      {/* Browse more teal button */}
                      <div className="flex justify-center pt-4">
                        <button className="px-6 py-3 rounded-xl bg-[#00a896] hover:bg-[#009282] text-white font-black text-xs shadow-md transition-all active:scale-95">
                          تصفح المزيد من الدورات
                        </button>
                      </div>

                    </div>
                  </section>

                  {/* Specializations Section with grid paper background */}
                  <section className={`py-16 relative overflow-hidden bg-slate-50/50 border-t border-b border-slate-100 ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`} 
                    style={{
                      backgroundImage: 'linear-gradient(to right, rgba(0, 168, 150, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 168, 150, 0.05) 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }}
                  >
                    <div className="max-w-6xl mx-auto space-y-12 relative z-10">
                      
                      {/* Subheading */}
                      <div className="text-center space-y-2">
                        <span className="text-xs text-[#00a896] font-black uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">التخصصات</span>
                        <h3 className={`font-black text-slate-800 ${
                          simulatorMode === 'desktop' ? 'text-2xl' : 'text-xl'
                        }`}>طور مهاراتك عبر مسارات برامج تعليمية متخصصة</h3>
                      </div>

                      <div className={`grid gap-8 ${
                        simulatorMode === 'desktop' ? 'grid-cols-3' : simulatorMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'
                      }`}>
                        {[
                          { title: 'أساسيات تصميم UI/UX', desc: 'كل ما تحتاجه لتصميم تطبيقات ومواقع مذهلة تلبي رغبات المستخدمين وتمنحهم تجربة استخدام لا تُنسى.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4iH4QN5hawBNBS5h9s9nS1TEOla1eY5JJBqQOqqjhAcuOlHHEGvnQUIHaXpvbQX9suHmsGlgv0xfg0Us7GtGZPQZLjNjAsSb3srLVJGGI4JhTw1Ox5L1yvBbvfJnp2IzBFGjUi-SISVcwTm1m9E2wpeb0s33mi9i-k6-PXWT7bxjjJfB8-tokQtf0u5nDOyc2UDANLG2c6UALdgFPTLJ5HDo34MDxx0k5foN_8S6R-2hJhXdyF5sEUPHIXe8KarPgOvzf7Tg2VLI' },
                          { title: 'إتقان فيجما (Figma)', desc: 'تعلم التحكم الكامل بأقوى برامج تصميم الواجهات وبناء المكونات والمكتبات المشتركة باحترافية كاملة.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9KcwP0hcNTjqTsP9-zEoZDcp7ymS0jNj6ob0RwCIdKZ108wU5GjjnHQ0Ji6KDK0ow73ll6wBAdPJRnFpak6zMSPeZ4oAs50vCNlTZKzFA-09Anx2ZOEFVdcumpmAMBHwpacUtUq3v8BNDiO8uMUSw84-4TcE5wdXfhHaOF0A9vgFNdp5-eoQ3H2QBP0nj_d2E4mHbznhcP-MK1K3iSrqNQPbcQChXz_3auUIfp_d-OYnMw6Hv-Uca0MdxRgbltFjrZV6VFE9-guA' },
                          { title: 'إتقان بريمير (Premiere)', desc: 'كن قادراً على تحرير الفيديوهات وإضافة المؤثرات البصرية وتنسيق المقاطع بدقة عالية.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7fji1EMzpBjvIOPzTzKZXMfFMs_z3kV26cI_u4VZySsAciXaJgM3Az6NM1Dv4arh-Prux6XN7GqdYRv9_L_BhcETvxgmkH2Kp9mMzgjM20WJE7jHDI92KCOYa6xe-XZwTN0tfSlUKxH_y6pOE1twvM7NsZtmAJ7xCG0dMyz3ptUE3dE9DxwvuOp1VEeL-6bnYlbgE1DBMdUmQEwlcdIE5qzhXXvAcf--sm_qb604Y61GeGM2PWxgDVqcnyY_7mFtiZsqC_a593Nc' }
                        ].map((path, idx) => (
                          <div key={idx} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:scale-[1.01] hover:shadow-md transition-all duration-300 space-y-4">
                            <div className="h-36 overflow-hidden rounded-2xl relative bg-slate-50">
                              <img className="w-full h-full object-cover" src={path.img} alt={path.title} />
                            </div>
                            <h4 className="text-sm font-black text-slate-800">{path.title}</h4>
                            <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{path.desc}</p>
                            <div className="pt-2">
                              <span className="flex items-center gap-1 text-[#00a896] text-xs font-black hover:opacity-80 cursor-pointer">
                                طور تخصصك
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Browse more teal button */}
                      <div className="flex justify-center pt-4">
                        <button className="px-6 py-3 rounded-xl bg-[#00a896] hover:bg-[#009282] text-white font-black text-xs shadow-md transition-all active:scale-95">
                          تصفح المزيد من الدورات
                        </button>
                      </div>

                    </div>
                  </section>

                  {/* Discovery and Search Box Section */}
                  <section className={`py-16 bg-white text-center border-b border-slate-100/60 ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    <div className="max-w-2xl mx-auto space-y-6">
                      <h3 className={`font-black text-slate-800 leading-relaxed ${
                        simulatorMode === 'desktop' ? 'text-lg' : 'text-base'
                      }`}>
                        اكتشف أكثر من 300 دورة تدريبية مجانية على منصة إدراك
                      </h3>
                      <div className="relative flex items-center max-w-xl mx-auto border border-slate-200 bg-slate-50/50 rounded-2xl shadow-inner px-4 py-2.5">
                        <input 
                          type="text" 
                          placeholder="ابحث عن دورة أو تخصص..." 
                          className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none text-right placeholder-slate-400"
                          dir="rtl"
                        />
                        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      </div>
                    </div>
                  </section>

                  {/* Latest Courses Section (أحدث الدورات) */}
                  <section className={`py-16 bg-[#f8fafc] border-b border-slate-100 ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    <div className="max-w-6xl mx-auto space-y-12">
                      
                      <div className="text-center space-y-2">
                        <span className="text-xs text-[#00a896] font-black uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">أحدث الدورات</span>
                        <h3 className={`font-black text-slate-800 leading-tight ${
                          simulatorMode === 'desktop' ? 'text-2xl' : 'text-xl'
                        }`}>
                          اكتشف أبرز الدورات التي تساهم في تعزيز مهاراتك وتطوير مسيرتك المهنية
                        </h3>
                        <p className="text-slate-400 text-xs font-semibold leading-relaxed max-w-xl mx-auto">
                          مصممة بعناية لتوفير أعلى مستويات الجودة والتأثير في مجالك المهني.
                        </p>
                      </div>

                      <div className={`grid gap-8 ${
                        simulatorMode === 'desktop' ? 'grid-cols-3' : simulatorMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'
                      }`}>
                        {[
                          { title: 'لغة الجسد وفن التأثير والاتصال الإنساني', rating: '4.9', duration: '8 ساعات', tag: 'مجاني', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM' },
                          { title: 'المحاسبة المالية والحسابات لغير المحاسبين', rating: '4.8', duration: '12 ساعة', tag: 'دورة مميزة', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI' },
                          { title: 'تطوير واجهات الويب وتطبيقات الهاتف بالـ React', rating: '4.7', duration: '20 ساعة', tag: 'جديد', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtqpBVFtjEqV4PVoWYoyU8fcNsGZBndlgPIbkTUs2JhnbX94-veF8_k8_HudB9diVBtjprCKzLuuiObyibFF6J9QbaMi1GcDswO0I4W3wlUhbXjD_j1nPDgegx4guIeTcmiF9PHyt3yU3B-zTYYixNNb5rzSTyXu_dNsQybxKmntcB87QhR6ICgCXRlHXPPaV2v4GrYnnz6NmYa8CQCbDOZw82qqN70CS7UckmVyBWvUnicK0nzC2SZsnW_QwGRn3db9X6vbI-6DE' }
                        ].map((course, idx) => (
                          <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-100 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group">
                            
                            {/* Card Image Header */}
                            <div className="h-44 overflow-hidden relative bg-slate-50 p-3 shrink-0">
                              <img className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105" src={course.img} alt={course.title} />
                              <span className="absolute top-5 right-5 bg-amber-100 text-amber-800 text-[9px] font-black px-3 py-1 rounded-full shadow-sm">
                                {course.tag}
                              </span>
                            </div>
                            
                            {/* Card Content Details */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                              <div>
                                <h4 className="text-xs font-black text-slate-800 leading-snug line-clamp-2">{course.title}</h4>
                                <div className="flex items-center gap-1.5 mt-2">
                                  <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star key={s} className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-bold mt-0.5">({course.rating})</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mt-2">{course.duration}</p>
                              </div>

                              {/* Card Action footer (wishlist & purple enroll button) */}
                              <div className="flex justify-between items-center pt-3 border-t border-slate-150">
                                <button className="p-2.5 rounded-full border border-slate-100 hover:border-red-155 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                  <Heart className="w-3.5 h-3.5" />
                                </button>
                                <button className="bg-[#3b2dcf] hover:bg-[#2b1dcf] text-white text-[9px] font-black px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-md shadow-[#3b2dcf]/15">
                                  اشترك الآن
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>

                      {/* Browse more teal button */}
                      <div className="flex justify-center pt-4">
                        <button className="px-6 py-3 rounded-xl bg-[#00a896] hover:bg-[#009282] text-white font-black text-xs shadow-md transition-all active:scale-95">
                          تصفح المزيد من الدورات
                        </button>
                      </div>

                    </div>
                  </section>

                  {/* Testimonials Section (آراء المتعلمين) */}
                  <section className={`py-16 bg-white text-center ${
                    simulatorMode === 'desktop' ? 'px-12' : simulatorMode === 'tablet' ? 'px-8' : 'px-4'
                  }`}>
                    <div className="max-w-5xl mx-auto space-y-12">
                      
                      <div className="text-center space-y-2">
                        <span className="text-xs text-[#00a896] font-black uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">آراء المتعلمين</span>
                        <h3 className={`font-black text-slate-800 ${
                          simulatorMode === 'desktop' ? 'text-2xl' : 'text-xl'
                        }`}>تأثير حقيقي وتجارب ملهمة</h3>
                      </div>

                      <div className={`grid gap-8 text-right ${
                        simulatorMode === 'desktop' ? 'grid-cols-3' : simulatorMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'
                      }`}>
                        {[
                          { text: 'الدورات المقدمة في منتهى الاحترافية والتبسيط الشديد. لقد مكنتني هذه المسارات من ترقية مهاراتي في التصميم والحصول على وظيفة أحلامي كفيلانسر.', name: 'أمجد الكيلاني', role: 'مصمم واجهات مستقل', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI' },
                          { text: 'أعتقد أن هذه المنصة هي الأفضل للدراسة عبر الإنترنت في العالم العربي. التدريب العملي والمشاريع تعطي قيمة مضافة عالية جداً وتجعل التعليم حيوياً.', name: 'ريناد الحربي', role: 'محللة بيانات ناشئة', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM' },
                          { text: 'أشكر القائمين على هذا العمل الرائع. نظام الكورسات والواجهة مريحة وممتعة جداً للدراسة والمراجعة في أي وقت، والشهادات حافز قوي.', name: 'خالد السديري', role: 'مبرمج ويب مبتدئ', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtqpBVFtjEqV4PVoWYoyU8fcNsGZBndlgPIbkTUs2JhnbX94-veF8_k8_HudB9diVBtjprCKzLuuiObyibFF6J9QbaMi1GcDswO0I4W3wlUhbXjD_j1nPDgegx4guIeTcmiF9PHyt3yU3B-zTYYixNNb5rzSTyXu_dNsQybxKmntcB87QhR6ICgCXRlHXPPaV2v4GrYnnz6NmYa8CQCbDOZw82qqN70CS7UckmVyBWvUnicK0nzC2SZsnW_QwGRn3db9X6vbI-6DE' }
                        ].map((val, idx) => (
                          <div key={idx} className="bg-[#e6f4f2]/80 border border-[#00a896]/10 p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,168,150,0.01)] relative flex flex-col justify-between min-h-[200px] hover:scale-[1.01] hover:shadow-md transition-all duration-300">
                            <span className="text-4xl text-[#00a896] opacity-35 block leading-none font-serif select-none">“</span>
                            <p className="text-xs font-bold leading-relaxed text-slate-700 mb-6 mt-2">
                              "{val.text}"
                            </p>
                            <div className="flex items-center gap-3 border-t border-[#00a896]/10 pt-4">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#00a896]/20 bg-slate-100">
                                <img className="w-full h-full object-cover" src={val.img} alt={val.name} />
                              </div>
                              <div>
                                <p className="font-black text-[10px] text-slate-800">{val.name}</p>
                                <p className="text-[8px] font-black text-[#00a896]">{val.role}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </section>

                  {/* Sleek Dark Teal Footer Section */}
                  <footer className="bg-[#081816] text-[#00a896]/55 py-8 px-6 text-center text-[10px] border-t border-[#040e0d] font-bold">
                    <p className="text-[#00a896]/70 mb-1">© 2026 إدراك. جميع الحقوق محفوظة للأكاديمية التعليمية الشريكة.</p>
                    <p className="opacity-75">مصمم بأعلى معايير الجودة لتجربة تعليمية فريدة ومستدامة.</p>
                  </footer>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
