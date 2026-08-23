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

interface TemplateRendererProps {
  templateId: string;
  sections: BuilderNode[];
}

export default function TemplateRenderer({ templateId, sections }: TemplateRendererProps) {
  const { setIsEditing, loadTemplate } = useBuilderStore();
  const [publishedRole, setPublishedRole] = React.useState<string | null>(null);

  const resolveNormalizedRole = (roleStr?: string | null): string | null => {
    if (!roleStr) return null;
    const normalized = roleStr.toLowerCase().trim();
    if (
      normalized === 'schoolteacher' ||
      normalized === 'school_teacher' ||
      normalized === 'schoolcoach' ||
      normalized === 'school'
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
    if (typeof window !== 'undefined') {
      // 1. Try published config role
      const published = localStorage.getItem('darab_published_template_config');
      if (published) {
        try {
          const parsed = JSON.parse(published);
          const role = resolveNormalizedRole(parsed.role);
          if (role) setPublishedRole(role);
        } catch (e) {}
      }

      // 2. Try user_role, user_account_type, registration_role
      if (!publishedRole) {
        const rawRole =
          localStorage.getItem('user_role') ||
          localStorage.getItem('user_account_type') ||
          localStorage.getItem('registration_role');

        const resolved = resolveNormalizedRole(rawRole);
        if (resolved) {
          setPublishedRole(resolved);
        } else {
          // 3. Try user_info
          const userInfo = localStorage.getItem('user_info');
          if (userInfo) {
            try {
              const parsed = JSON.parse(userInfo);
              const userResolved = resolveNormalizedRole(parsed.role || parsed.account_type);
              if (userResolved) {
                setPublishedRole(userResolved);
              }
            } catch (e) {}
          }
        }
      }
    }
  }, [publishedRole]);

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

  // Render role-specific default HTML template wrappers for root of academy site
  const isDefaultRootTemplate =
    !templateId ||
    templateId === 'template_1' ||
    templateId === 'academy-dashboard' ||
    templateId === 'default' ||
    templateId === 'home';

  if (isDefaultRootTemplate) {
    const navbarSection = sections.find((s: any) => s.type === 'navbar');
    const detectedRole = resolveNormalizedRole(navbarSection?.props?.role || navbarSection?.props?.currentRole);
    const activeRole = detectedRole || publishedRole || 'academy';

    if (activeRole === 'academy') {
      return <AcademicTemplate sections={sections} />;
    }
    if (activeRole === 'coach') {
      return <CoachTemplate sections={sections} />;
    }
    if (activeRole === 'schoolcoach') {
      return <SchoolCoachTemplate sections={sections} />;
    }

    // Default fallback for any unmapped role
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
      return <ClassicTemplate sections={sortedSections} />;
  }
}
