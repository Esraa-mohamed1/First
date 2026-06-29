'use client';

import React, { useEffect } from 'react';
import { BuilderNode } from '../../interfaces';
import ClassicTemplate from '../classic/ClassicTemplate';
import TurquoiseTemplate from '../turquoise/TurquoiseTemplate';
import PurpleTemplate from '../purple/PurpleTemplate';
import TealTemplate from '../teal/TealTemplate';
import { useBuilderStore } from '../../store/builderStore';

interface TemplateRendererProps {
  templateId: string;
  sections: BuilderNode[];
}

export default function TemplateRenderer({ templateId, sections }: TemplateRendererProps) {
  const { setIsEditing, loadTemplate } = useBuilderStore();

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
