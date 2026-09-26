'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { getPublicPages, getPublicSections, apiToEditor } from '@/services/pages';
import { getTemplateById } from '@/builder/utils/templates';
import TemplateRenderer from '@/builder/templates/renderer/TemplateRenderer';
import { getClientTenantKey } from '@/lib/homepage-cache';
import { getMyAcademyProfile } from '@/services/student-auth';

// Main platform landing page components
import Nav from '@/components/Nav/Nav';
import Footer from '@/components/Footer/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import Hero from '@/components/Sections/Hero';
import Stats from '@/components/Sections/Stats';
import Problem from '@/components/Sections/Problem';
import Benefits from '@/components/Sections/Benefits';
import Pricing from '@/components/Sections/Pricing';
import Testimonials from '@/components/Sections/Testimonials';
import CTA from '@/components/Sections/CTA';

function MainPlatformLanding() {
  return (
    <>
      <ScrollReveal />
      <Nav />
      <main dir="rtl">
        <div className="animate-on-scroll"><Hero /></div>
        <div className="animate-on-scroll"><Stats /></div>
        <div className="animate-on-scroll"><Problem /></div>
        <div className="animate-on-scroll"><Benefits /></div>
        <div className="animate-on-scroll"><Pricing /></div>
        <div className="animate-on-scroll"><Testimonials /></div>
        <div className="animate-on-scroll"><CTA /></div>
      </main>
      <Footer />
    </>
  );
}

const TEMPLATE_SLUGS = ['academic-dashboard', 'template_1', 'template_2', 'template_3', 'template_4', 'template_courses_1'];

interface TenantHomeClientProps {
  initialTemplateId?: string;
  initialSections?: any[];
}

export default function TenantHomeClient({
  initialTemplateId = 'template_1',
  initialSections = []
}: TenantHomeClientProps) {
  const [templateId, setTemplateId] = useState<string>(initialTemplateId);
  const [tenantRole, setTenantRole] = useState<string | null>(null);
  const [sections, setSections] = useState<any[]>(initialSections);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFoundState, setNotFoundState] = useState<boolean>(false);
  const [tenantKey, setTenantKey] = useState<string | null>(null);

  // Resolve tenant key on client side
  useEffect(() => {
    const key = getClientTenantKey();
    setTenantKey(key);
  }, []);

  useEffect(() => {
    // Don't fetch anything until we know whether there's a tenant
    if (tenantKey === null) return;
    // Root Darab domain — no tenant, stop loading and render main landing page
    if (tenantKey === '') {
      setLoading(false);
      return;
    }

    async function loadActivePageAndSections() {
      try {
        setLoading(true);

        // Fetch pages and academy profile in parallel to resolve template and role together
        const [pagesList, academyProfile] = await Promise.all([
          getPublicPages('academic').catch((err) => {
            console.error('Failed to load public pages in TenantHomeClient:', err);
            return [];
          }),
          getMyAcademyProfile().catch((err) => {
            if (err?.isNotFound || err?.status === 404 || err?.response?.status === 404) {
              setNotFoundState(true);
            }
            console.error('Failed to load my academy profile in TenantHomeClient:', err);
            return null;
          }),
        ]);

        if (academyProfile) {
          const role = academyProfile.role || academyProfile.type || academyProfile.account_type || academyProfile.user_type;
          if (role) {
            setTenantRole(role);
          }
        }

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
          const resolvedTemplateId = activePage.template_name || activePage.template || activePage.title || initialTemplateId;
          setTemplateId(resolvedTemplateId);

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
  }, [tenantKey, initialTemplateId]);

  // Still resolving tenant key — render loading spinner
  if (tenantKey === null) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-600">جاري تحميل الموقع...</span>
        </div>
      </div>
    );
  }

  // Root Darab domain — no tenant, render the main platform landing page
  if (tenantKey === '') {
    return <MainPlatformLanding />;
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-600">جاري تحميل الموقع...</span>
        </div>
      </div>
    );
  }

  if (notFoundState) {
    return notFound();
  }

  return (
    <main className="w-full min-h-screen bg-white">
      <TemplateRenderer templateId={templateId} tenantRole={tenantRole} sections={sections} />
    </main>
  );
}
