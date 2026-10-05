'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/mhchem.js';

interface KaTeXRendererProps {
  content?: string;
  className?: string;
  inline?: boolean;
}

/**
 * Parses and renders text that may contain LaTeX equations & chemical formulas:
 * - Block math: $$equation$$
 * - Inline math: $equation$ or \(equation\)
 * - Chemical equations: \ce{...} or raw formulas
 */
export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({
  content = '',
  className = '',
  inline = false,
}) => {
  const renderedHtml = useMemo(() => {
    if (content === null || content === undefined || typeof content !== 'string') return null;
    const strContent = String(content);
    if (!strContent.trim()) return '';

    // Normalize arrow syntax for chemical equations if present
    let normalizedContent = strContent;
    if (!strContent.includes('\\') && strContent.includes('->')) {
      normalizedContent = strContent.replace(/->/g, '\\rightarrow ');
    }

    const hasMathSymbols =
      normalizedContent.includes('$') ||
      normalizedContent.includes('\\(') ||
      normalizedContent.includes('\\[') ||
      normalizedContent.includes('\\ce') ||
      normalizedContent.includes('\\frac') ||
      normalizedContent.includes('\\sqrt') ||
      normalizedContent.includes('\\int') ||
      normalizedContent.includes('\\sum') ||
      normalizedContent.includes('\\alpha') ||
      normalizedContent.includes('\\beta') ||
      normalizedContent.includes('\\pi') ||
      normalizedContent.includes('\\theta') ||
      normalizedContent.includes('\\pm') ||
      normalizedContent.includes('\\times') ||
      normalizedContent.includes('\\rightarrow') ||
      normalizedContent.includes('\\le') ||
      normalizedContent.includes('\\ge');

    if (!hasMathSymbols) {
      return null;
    }

    try {
      // If the entire content is a pure formula starting with \ or containing typical LaTeX without $
      if (
        (normalizedContent.startsWith('\\') || normalizedContent.startsWith('{')) &&
        !normalizedContent.includes('$')
      ) {
        return katex.renderToString(normalizedContent, {
          displayMode: !inline,
          throwOnError: false,
        });
      }

      // Parse mixed text with inline $...$ or block $$...$$
      let result = '';
      const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = mathRegex.exec(content)) !== null) {
        const textBefore = content.substring(lastIndex, match.index);
        result += escapeHtml(textBefore);

        const mathRaw = match[0];
        let mathStr = '';
        let isBlock = false;

        if (mathRaw.startsWith('$$') && mathRaw.endsWith('$$')) {
          mathStr = mathRaw.slice(2, -2);
          isBlock = true;
        } else if (mathRaw.startsWith('$') && mathRaw.endsWith('$')) {
          mathStr = mathRaw.slice(1, -1);
          isBlock = false;
        } else if (mathRaw.startsWith('\\[') && mathRaw.endsWith('\\]')) {
          mathStr = mathRaw.slice(2, -2);
          isBlock = true;
        } else if (mathRaw.startsWith('\\(') && mathRaw.endsWith('\\)')) {
          mathStr = mathRaw.slice(2, -2);
          isBlock = false;
        }

        try {
          const renderedMath = katex.renderToString(mathStr.trim(), {
            displayMode: isBlock && !inline,
            throwOnError: false,
          });
          result += `<span class="katex-wrapper ${isBlock ? 'block my-2 text-center' : 'inline-block px-1'}">${renderedMath}</span>`;
        } catch {
          result += escapeHtml(mathRaw);
        }

        lastIndex = match.index + mathRaw.length;
      }

      result += escapeHtml(content.substring(lastIndex));
      return result;
    } catch {
      return null;
    }
  }, [content, inline]);

  if (!content) return null;

  if (renderedHtml !== null) {
    return (
      <span
        className={`leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return <span className={`leading-relaxed whitespace-pre-wrap ${className}`}>{content}</span>;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br />');
}
