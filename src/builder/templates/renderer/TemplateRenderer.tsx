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
  const { setIsEditing } = useBuilderStore();

  useEffect(() => {
    // Force read-only layout rendering for previews/live site
    setIsEditing(false);
  }, [setIsEditing]);

  // Sort sections by their 'order' property before rendering
  const sortedSections = React.useMemo(() => {
    return [...sections].sort((a, b) => {
      const orderA = a.props?.order ?? 0;
      const orderB = b.props?.order ?? 0;
      return orderA - orderB;
    });
  }, [sections]);

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
