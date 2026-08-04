'use client';

import React, { useState, useEffect } from 'react';
import { getPages, getSections, apiToEditor } from '@/services/pages';
import { getTemplateById } from '@/builder/utils/templates';
import TemplateRenderer from '@/builder/templates/renderer/TemplateRenderer';

interface TenantHomeClientProps {
  initialTemplateId?: string;
  initialSections?: any[];
}

const TEMPLATE_SLUGS = ['academy-dashboard', 'template_1', 'template_2', 'template_3', 'template_4', 'template_courses_1'];

export default function TenantHomeClient({
  initialTemplateId = 'template_1',
  initialSections = []
}: TenantHomeClientProps) {
  const [templateId, setTemplateId] = useState<string>(initialTemplateId);
  const [sections, setSections] = useState<any[]>(initialSections);
  const [loading, setLoading] = useState<boolean>(initialSections.length === 0);

  useEffect(() => {
    async function loadActivePageAndSections() {
      try {
        setLoading(true);
        // 1. Fetch fresh pages list from /pages endpoint
        const pagesList = await getPages(true);

        let activePage = pagesList.find(
          (p: any) => p.is_active === 1 || p.is_active === '1' || p.is_active === true || p.is_active === 'true'
        );

        if (!activePage) {
          const templatePages = pagesList.filter((p: any) =>
            TEMPLATE_SLUGS.includes(p.template_name || p.template || p.title)
          );
          activePage = templatePages.sort((a: any, b: any) => Number(b.id || 0) - Number(a.id || 0))[0];
        }

        if (!activePage) {
          activePage = pagesList.find((p: any) => p.slug === 'home' || p.slug?.startsWith('home-')) || pagesList[0];
        }

        if (activePage && activePage.id) {
          const resolvedTemplateId = activePage.template_name || activePage.template || activePage.title || 'template_1';
          setTemplateId(resolvedTemplateId);

          // 2. Fetch sections for active page ID from /sections endpoint (visible in Network Tab)
          const apiSections = await getSections(activePage.id);
          if (apiSections && apiSections.length > 0) {
            const editorNodes = apiToEditor(apiSections);
            setSections(editorNodes);
          } else {
            const defaultTmpl = getTemplateById(resolvedTemplateId);
            setSections(defaultTmpl?.sections || []);
          }
        } else {
          const defaultTmpl = getTemplateById(initialTemplateId);
          setSections(defaultTmpl?.sections || []);
        }
      } catch (err) {
        console.error('Failed to load active page sections in TenantHomeClient:', err);
        const defaultTmpl = getTemplateById(initialTemplateId);
        setSections(defaultTmpl?.sections || []);
      } finally {
        setLoading(false);
      }
    }

    loadActivePageAndSections();
  }, [initialTemplateId]);

  if (loading && sections.length === 0) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-600">جاري تحميل الموقع...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        <TemplateRenderer templateId={templateId} sections={sections} />
      </div>
    </main>
  );
}
