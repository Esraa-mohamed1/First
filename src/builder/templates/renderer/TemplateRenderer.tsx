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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Try published config role
      const published = localStorage.getItem('darab_published_template_config');
      if (published) {
        try {
          const parsed = JSON.parse(published);
          if (parsed.role) {
            setPublishedRole(parsed.role);
          }
        } catch (e) {}
      } else {
        // 2. Try user_role directly
        const userRole = localStorage.getItem('user_role');
        if (userRole) {
          const roleStr = userRole.toLowerCase().trim();
          if (roleStr === 'schoolteacher' || roleStr === 'school_teacher' || roleStr === 'schoolcoach') {
            setPublishedRole('schoolcoach');
          } else if (roleStr === 'coach' || roleStr === 'instructor' || roleStr === 'teacher') {
            setPublishedRole('coach');
          } else if (roleStr === 'academy') {
            setPublishedRole('academy');
          }
        } else {
          // 3. Try user_info
          const userInfo = localStorage.getItem('user_info');
          if (userInfo) {
            try {
              const parsed = JSON.parse(userInfo);
              const roleStr = (parsed.role || '').toLowerCase().trim();
              if (roleStr === 'schoolteacher' || roleStr === 'school_teacher' || roleStr === 'schoolcoach') {
                setPublishedRole('schoolcoach');
              } else if (roleStr === 'coach' || roleStr === 'instructor' || roleStr === 'teacher') {
                setPublishedRole('coach');
              } else if (roleStr === 'academy') {
                setPublishedRole('academy');
              }
            } catch (e) {}
          }
        }
      }
    }
  }, []);

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

  // Render role-specific premium HTML template wrappers for template_1
  if (templateId === 'template_1' || templateId === 'academy-dashboard' || !templateId) {
    if (publishedRole === 'academy') {
      return <AcademicTemplate />;
    }
    if (publishedRole === 'coach') {
      return <CoachTemplate />;
    }
    if (publishedRole === 'schoolcoach') {
      return <SchoolCoachTemplate />;
    }
  }

  // Load correct template wrapper component
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
