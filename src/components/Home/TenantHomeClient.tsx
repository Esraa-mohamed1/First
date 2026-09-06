'use client';

import React, { useState, useEffect } from 'react';
import { getPublicPages, getPublicSections, apiToEditor } from '@/services/pages';
import { getTemplateById } from '@/builder/utils/templates';
import TemplateRenderer from '@/builder/templates/renderer/TemplateRenderer';
import { getClientTenantKey } from '@/lib/homepage-cache';

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

        // Try loading from local tenant-cache first
        const tenantKey = getClientTenantKey();
        if (tenantKey) {
          try {
            const cacheRes = await fetch(`/tenant-cache/${tenantKey.toLowerCase()}.json`);
            if (cacheRes.ok) {
              const cacheData = await cacheRes.json();
              if (cacheData && cacheData.templateId && Array.isArray(cacheData.sections)) {
                console.log('[TenantHomeClient] Successfully loaded homepage configuration from cache');
                setTemplateId(cacheData.templateId);
                setSections(cacheData.sections);
                setLoading(false);
                return;
              }
            }
          } catch (cacheErr) {
            console.warn('[TenantHomeClient] Local cache fetch failed, falling back to API:', cacheErr);
          }
        }

        // Fallback: Fetch fresh pages list from public /pages endpoint
        const pagesList = await getPublicPages('academic');

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

          // 2. Fetch sections for active page ID from public /sections endpoint
          const apiSections = await getPublicSections(activePage.id);
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
      <TemplateRenderer templateId={templateId} sections={sections} />
    </main>
  );
}
