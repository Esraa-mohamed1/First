'use client';

import React, { useEffect } from 'react';
import { BuilderNode } from '../../interfaces';
import ClassicTemplate from '../classic/ClassicTemplate';
import TurquoiseTemplate from '../turquoise/TurquoiseTemplate';
import PurpleTemplate from '../purple/PurpleTemplate';
import TealTemplate from '../teal/TealTemplate';
import AcademicTemplate from '../academic/AcademicTemplate';
import CoachTemplate from '../coach/CoachTemplate';
import SchoolCoachTemplate from '../schoolcoach/SchoolCoachTemplate';
import { useBuilderStore } from '../../store/builderStore';
import { getStoredUserRole, isSchoolTeacherRole } from '@/lib/auth-storage';

interface TemplateRendererProps {
  templateId: string;
  sections: BuilderNode[];
  tenantRole?: string | null;
}

export default function TemplateRenderer({ templateId, sections, tenantRole }: TemplateRendererProps) {
  const { setIsEditing, loadTemplate } = useBuilderStore();

  const resolveNormalizedRole = (roleStr?: string | null): string | null => {
    if (!roleStr) return null;
    const normalized = roleStr.toLowerCase().trim();
    if (
      normalized === 'schoolteacher' ||
      normalized === 'school_teacher' ||
      normalized === 'schoolcoach' ||
      normalized === 'school' ||
      normalized === 'school_coach'
    ) {
      return 'schoolcoach';
    }
    if (normalized === 'coach' || normalized === 'instructor' || normalized === 'teacher') {
      return 'coach';
    }
    if (normalized === 'academy' || normalized === 'organization' || normalized === 'center') {
      return 'academy';
    }
    return normalized;
  };

  useEffect(() => {
    // Force read-only layout rendering for previews/live site
    setIsEditing(false);

    // Propagate template metadata to the store so children can resolve the active template
    loadTemplate({
      id: templateId,
      name: templateId === 'template_2' ? 'قالب يوديمي الاحترافي' : 'قالب الأكاديمية',
      sections,
      status: 'published',
      version: '1.0',
      updatedAt: '',
    });
  }, [setIsEditing, loadTemplate, templateId, sections]);

  // Use the sections array in its natural order as managed by the builder/API
  const sortedSections = sections;

  // Detect role across section nodes or passed tenantRole
  const sectionWithRole = sections.find((s: any) => s.props?.role || s.props?.currentRole);
  const detectedRole = resolveNormalizedRole(
    sectionWithRole?.props?.role ||
    sectionWithRole?.props?.currentRole
  );

  const normalizedTenantRole = resolveNormalizedRole(tenantRole);
  const fallbackStoredRole = typeof window !== 'undefined' ? resolveNormalizedRole(getStoredUserRole()) : null;

  const activeRole = normalizedTenantRole || detectedRole || fallbackStoredRole || 'academy';

  // Always route role-specific HTML templates for schoolcoach, coach, and academy
  if (activeRole === 'schoolcoach') {
    return <SchoolCoachTemplate sections={sections} />;
  }
  if (activeRole === 'coach') {
    return <CoachTemplate sections={sections} />;
  }
  if (activeRole === 'academy') {
    if (templateId === 'template_2') {
      return <TurquoiseTemplate sections={sortedSections} />;
    }
    if (templateId === 'template_3') {
      return <PurpleTemplate sections={sortedSections} />;
    }
    if (templateId === 'template_4') {
      return <TealTemplate sections={sortedSections} />;
    }
    return <AcademicTemplate sections={sections} />;
  }

  // Load specific template wrapper component if non-default template is explicitly selected
  switch (templateId) {
    case 'template_2':
      return <TurquoiseTemplate sections={sortedSections} />;
    case 'template_3':
      return <PurpleTemplate sections={sortedSections} />;
    case 'template_4':
      return <TealTemplate sections={sortedSections} />;
    case 'academy-dashboard':
    case 'template_1':
    default:
      return <AcademicTemplate sections={sortedSections} />;
  }
}

