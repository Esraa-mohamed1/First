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

import { createPage, getSections, apiToEditor, getPages, updatePage } from '@/services/pages';
import { getTemplateById } from '@/builder/utils/templates';
import TemplateRenderer from '@/builder/templates/renderer/TemplateRenderer';

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

const TEMPLATE_SLUGS = ['academy-dashboard', 'template_1', 'template_2', 'template_3', 'template_4', 'template_courses_1'];

export default function TemplatesPage() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template_1');
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [simulatorMode, setSimulatorMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const [previewSections, setPreviewSections] = useState<any[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Load selected template and page ID from localStorage & API
  useEffect(() => {
    // 1. Sync from localStorage initially as fallback
    const cachedTemplate = localStorage.getItem('darab_active_template');
    if (cachedTemplate) {
      setActiveTemplateId(cachedTemplate);
    }
    const cachedPageId = localStorage.getItem('darab_active_page_id');
    if (cachedPageId) {
      setActivePageId(cachedPageId);
    }

    // 2. Fetch pages from the backend to resolve the actual active template
    const loadActiveTemplate = async () => {
      try {
        const pagesList = await getPages();
        setPages(pagesList);
        
        // Find page by is_active first, else fall back to title matching heuristic
        let active = pagesList.find((p: any) => p.is_active === 1 || p.is_active === '1' || p.is_active === true || p.is_active === 'true');
        if (!active) {
          const templatePages = pagesList.filter((p: any) => TEMPLATE_SLUGS.includes(p.title));
          active = templatePages.sort((a: any, b: any) => Number(b.id) - Number(a.id))[0];
        }
        
        if (active) {
          const activeSlug = active.title;
          const activeId = String(active.id);
          setActiveTemplateId(activeSlug);
          setActivePageId(activeId);
          
          // Sync localStorage for fallback compatibility
          localStorage.setItem('darab_active_template', activeSlug);
          localStorage.setItem('darab_active_page_id', activeId);
        }
      } catch (err) {
        console.error('Failed to load pages in TemplatesPage:', err);
      }
    };
    loadActiveTemplate();
  }, []);

  const handleSelectTemplate = async (id: string, name: string) => {
    if (activatingId) return;
    setActivatingId(id);

    try {
      const existingPage = pages.find((p: any) => p.title === id);
      let pageId = '';

      if (existingPage) {
        // Activate existing page by sending only is_active key
        const updated = await updatePage(existingPage.id, { is_active: '1' });
        pageId = String(updated.id);

        // Update pages state: set is_active = '1' for the activated page, and '0' for others
        setPages(prev => prev.map((p: any) => {
          if (String(p.id) === pageId) {
            return { ...p, is_active: '1' };
          }
          return { ...p, is_active: '0' };
        }));
      } else {
        // Create new page
        const payload = {
          title: id,
          slug: `home-${Date.now()}`,
          status: 'published',
          template: id,
          is_active: '1'
        };
        const created = await createPage(payload);
        pageId = String(created.id);

        // Update pages state: add new page and set others as inactive
        setPages(prev => [
          { ...created, is_active: '1' },
          ...prev.map((p: any) => ({ ...p, is_active: '0' }))
        ]);
      }

      localStorage.setItem('darab_active_template', id);
      localStorage.setItem('darab_active_page_id', pageId);
      localStorage.setItem(`darab_active_page_id_${id}`, pageId);
      
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

  const handleOpenPreview = async (template: Template) => {
    setPreviewTemplate(template);
    setSimulatorMode('desktop');
    setLoadingPreview(true);

    try {
      // Find the page in our fetched pages that has title === template.id
      const matchingPage = pages.find((p: any) => p.title === template.id);
      let targetPageId = matchingPage ? String(matchingPage.id) : null;

      if (!targetPageId && template.id === activeTemplateId) {
        targetPageId = activePageId;
      }

      if (targetPageId) {
        const apiSections = await getSections(targetPageId);
        if (apiSections && apiSections.length > 0) {
          const editorNodes = apiToEditor(apiSections);
          setPreviewSections(editorNodes);
          setLoadingPreview(false);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to fetch preview sections from API:', e);
    }

    // Fallback: load static defaults from templates.ts definition
    try {
      const defaultTemplateConfig = getTemplateById(template.id);
      setPreviewSections(defaultTemplateConfig.sections);
    } catch (e) {
      console.error('Failed to fetch static default template sections:', e);
      setPreviewSections([]);
    }
    setLoadingPreview(false);
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
                          <span>{pages.some((p: any) => p.title === tmpl.id) ? 'إعادة تفعيل' : 'اختيار القالب'}</span>
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
                          <span>{pages.some((p: any) => p.title === tmpl.id) ? 'إعادة تفعيل' : 'اختيار القالب'}</span>
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
              {loadingPreview ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3">
                  <span className="w-8 h-8 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-xs font-bold font-['IBM_Plex_Sans_Arabic']">جاري تحميل معاينة القالب...</span>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
                  <TemplateRenderer templateId={previewTemplate.id} sections={previewSections} />
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
