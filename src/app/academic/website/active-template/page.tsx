'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit3, ArrowLeft } from 'lucide-react';

import { getPages, getSections, apiToEditor } from '@/services/pages';
import { getTemplateById } from '@/builder/utils/templates';
import TemplateRenderer from '@/builder/templates/renderer/TemplateRenderer';

export default function ActiveTemplatePage() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template_1');
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewSections, setPreviewSections] = useState<any[]>([]);

  useEffect(() => {
    // 1. Get cached template and page from localStorage
    const cachedTemplate = localStorage.getItem('darab_active_template');
    if (cachedTemplate) setActiveTemplateId(cachedTemplate);
    const cachedPageId = localStorage.getItem('darab_active_page_id');
    if (cachedPageId) setActivePageId(cachedPageId);

    // 2. Fetch pages and resolve the active one
    async function loadData() {
      try {
        const apiPages = await getPages();

        const TEMPLATE_SLUGS = ['academy-dashboard', 'template_1', 'template_2', 'template_3', 'template_4', 'template_courses_1'];

        let homePage = apiPages.find((p: any) =>
          p.is_active === 1 || p.is_active === '1' || p.is_active === true || p.is_active === 'true'
        );
        if (!homePage) {
          const templatePages = apiPages.filter((p: any) => TEMPLATE_SLUGS.includes(p.title));
          homePage = templatePages.sort((a: any, b: any) => Number(b.id) - Number(a.id))[0];
        }

        let resolvedTemplateId = 'template_1';
        let resolvedPageId: string | null = null;

        if (homePage) {
          resolvedTemplateId = homePage.title || homePage.slug;
          resolvedPageId = String(homePage.id);
          setActiveTemplateId(resolvedTemplateId);
          setActivePageId(resolvedPageId);
          localStorage.setItem('darab_active_template', resolvedTemplateId);
          localStorage.setItem('darab_active_page_id', resolvedPageId);
        } else {
          const oldHomePage = apiPages.find((p: any) => p.slug === 'home' || p.slug?.startsWith('home-'));
          const resolvedTId = oldHomePage
            ? (oldHomePage.template || oldHomePage.template_id || 'template_1')
            : (localStorage.getItem('darab_active_template') || 'template_1');
          resolvedTemplateId = resolvedTId;
          setActiveTemplateId(resolvedTId);
          if (oldHomePage) {
            resolvedPageId = String(oldHomePage.id);
            setActivePageId(resolvedPageId);
          }
        }

        // 3. Fetch sections for the resolved active page
        if (resolvedPageId) {
          try {
            const apiSections = await getSections(resolvedPageId);
            if (apiSections && apiSections.length > 0) {
              setPreviewSections(apiToEditor(apiSections));
            } else {
              const defaultTemplate = getTemplateById(resolvedTemplateId);
              if (defaultTemplate?.sections) setPreviewSections(defaultTemplate.sections);
            }
          } catch {
            const defaultTemplate = getTemplateById(resolvedTemplateId);
            if (defaultTemplate?.sections) setPreviewSections(defaultTemplate.sections);
          }
        } else {
          const defaultTemplate = getTemplateById(resolvedTemplateId);
          if (defaultTemplate?.sections) setPreviewSections(defaultTemplate.sections);
        }
      } catch (err) {
        console.error('Failed to load active template data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4" dir="rtl">
        <span className="w-10 h-10 border-4 border-[#005c86] border-t-transparent rounded-full animate-spin"></span>
        <p className="text-slate-500 font-bold font-['Cairo']">جاري تحميل القالب النشط...</p>
      </div>
    );
  }

  // Empty state
  if (previewSections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center" dir="rtl">
        <p className="text-slate-400 font-bold text-lg font-['Cairo']">لا توجد أقسام متوفرة للقالب النشط.</p>
        <Link
          href={`/academic/website/builder?templateId=${activeTemplateId}${activePageId ? `&pageId=${activePageId}` : ''}`}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#005c86] text-white font-bold text-sm shadow-sm hover:bg-[#0e76a8] transition-all"
        >
          <Edit3 className="w-4 h-4" />
          <span>افتح باني الصفحات لإضافة أقسام</span>
        </Link>
      </div>
    );
  }

  // Full active template render
  return (
    <div className="w-full min-h-screen relative" dir="rtl">

      {/* Floating action bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-lg border border-slate-200 rounded-2xl px-4 py-2.5 shadow-lg">
        <Link
          href="/academic/templates"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          تغيير القالب
        </Link>
        <span className="w-px h-4 bg-slate-200"></span>
        <Link
          href={`/academic/website/builder?templateId=${activeTemplateId}${activePageId ? `&pageId=${activePageId}` : ''}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#005c86] text-white font-bold text-xs hover:bg-[#0e76a8] transition-all shadow-sm"
        >
          <Edit3 className="w-3.5 h-3.5" />
          تعديل في الباني
        </Link>
      </div>

      {/* The full active template */}
      <TemplateRenderer templateId={activeTemplateId} sections={previewSections} />
    </div>
  );
}
