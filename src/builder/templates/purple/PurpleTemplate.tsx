import React from 'react';
import { BuilderNode } from '../../interfaces';
import RecursiveRenderer from '../../renderer/RecursiveRenderer';
import { getThemeBySlug } from '../themeStyles';

interface TemplateProps {
  sections: BuilderNode[];
}

export default function PurpleTemplate({ sections }: TemplateProps) {
  const theme = getThemeBySlug('template_3');

  const cssVariables = {
    '--theme-primary': theme.primaryColor,
    '--theme-primary-rgb': theme.primaryRgb,
    '--theme-secondary': theme.secondaryColor,
    '--theme-accent': theme.accentColor,
    '--theme-bg': theme.backgroundColor,
    '--theme-text': theme.textColor,
    fontFamily: `'${theme.fontFamily}', sans-serif`,
  } as React.CSSProperties;

  return (
    <div style={cssVariables} className="min-h-screen w-full transition-all duration-300">
      <RecursiveRenderer nodes={sections} />
    </div>
  );
}
