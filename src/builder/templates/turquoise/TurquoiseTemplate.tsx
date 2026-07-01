import React from 'react';
import { BuilderNode } from '../../interfaces';
import RecursiveRenderer from '../../renderer/RecursiveRenderer';
import { getThemeBySlug } from '../themeStyles';
import { TenantFooter } from '../classic/ClassicTemplate';

interface TemplateProps {
  sections: BuilderNode[];
}

export default function TurquoiseTemplate({ sections }: TemplateProps) {
  const theme = getThemeBySlug('template_2');

  const cssVariables = {
    '--theme-primary': theme.primaryColor,
    '--theme-primary-rgb': theme.primaryRgb,
    '--theme-secondary': theme.secondaryColor,
    '--theme-accent': theme.accentColor,
    '--theme-bg': theme.backgroundColor,
    '--theme-text': theme.textColor,
    fontFamily: `'${theme.fontFamily}', sans-serif`,
  } as React.CSSProperties;

  const hasFooter = sections.some(sec => sec.type === 'footer');

  return (
    <div style={cssVariables} className="min-h-screen w-full transition-all duration-300 flex flex-col justify-between">
      <div className="w-full flex-grow">
        <RecursiveRenderer nodes={sections} />
      </div>
      {!hasFooter && <TenantFooter />}
    </div>
  );
}
