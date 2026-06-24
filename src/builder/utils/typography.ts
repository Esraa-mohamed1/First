import React from 'react';

export interface TypographyDefaults {
  font?: string;
  size?: string;
  weight?: string;
  color?: string;
}

/**
 * Returns className and style object for a given typography slot
 * @param props The component props object
 * @param prefix Prefix for the typography slot (e.g. 'title', 'subtitle', 'badge')
 * @param defaults Default values if not customized
 */
export function getTypographyStyle(
  props: Record<string, any>,
  prefix: string,
  defaults: TypographyDefaults = {}
) {
  const font = props[`${prefix}FontFamily`] || defaults.font || 'IBM Plex Sans Arabic';
  const size = props[`${prefix}FontSize`] || defaults.size || '';
  const weight = props[`${prefix}FontWeight`] || defaults.weight || '';
  const color = props[`${prefix}Color`] || defaults.color || '';

  const style: React.CSSProperties = {
    fontFamily: font !== 'inherit' ? `'${font}', sans-serif` : undefined,
  };
  
  if (color) {
    style.color = color;
  }

  const className = `${size} ${weight}`.trim();

  return { className, style };
}

export const AVAILABLE_FONTS = [
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans Arabic (آي بي إم)' },
  { value: 'Cairo', label: 'Cairo (القاهرة)' },
  { value: 'Tajawal', label: 'Tajawal (تاجاول)' },
  { value: 'Almarai', label: 'Almarai (المراعي)' },
  { value: 'Amiri', label: 'Amiri (الأميري)' },
  { value: 'Inter', label: 'Inter (خط عالمي)' },
  { value: 'Arial', label: 'Arial (افتراضي النظام)' }
];

export const AVAILABLE_SIZES = [
  { value: 'text-[10px]', label: 'صغير جداً جداً (10px)' },
  { value: 'text-xs', label: 'صغير جداً (12px)' },
  { value: 'text-sm', label: 'صغير (14px)' },
  { value: 'text-base', label: 'طبيعي (16px)' },
  { value: 'text-lg', label: 'متوسط (18px)' },
  { value: 'text-xl', label: 'كبير (20px)' },
  { value: 'text-2xl', label: 'عريض (24px)' },
  { value: 'text-3xl', label: 'عريض جداً (30px)' },
  { value: 'text-4xl', label: 'ضخم (36px)' },
  { value: 'text-5xl', label: 'ضخم جداً (48px)' },
  { value: 'text-6xl', label: 'عملاق (60px)' }
];

export const AVAILABLE_WEIGHTS = [
  { value: 'font-light', label: 'خفيف' },
  { value: 'font-normal', label: 'عادي' },
  { value: 'font-medium', label: 'متوسط' },
  { value: 'font-semibold', label: 'شبه عريض' },
  { value: 'font-bold', label: 'عريض' },
  { value: 'font-extrabold', label: 'عريض جداً' },
  { value: 'font-black', label: 'العنوان الأخير / عريض للغاية' }
];

/**
 * Checks if a block node has a custom section background or shape decoration.
 */
export function hasSectionBackground(props: Record<string, any>): boolean {
  const bgType = props.sectionBgType || 'solid';
  const hasBg = bgType === 'solid' ? !!props.sectionBg : bgType === 'gradient' ? !!(props.sectionGradientFrom && props.sectionGradientTo) : !!props.sectionBgImage;
  const hasShape = !!(props.sectionShape && props.sectionShape !== 'none');
  return hasBg || hasShape;
}

// ─── Content vs Style Separation & Dynamic Style Mapper ────────────────────────

export const STYLE_KEYWORDS = [
  'background_color', 'backgroundColor', 'bg', 'text_color', 'textColor', 'color', 
  'font_size', 'fontSize', 'font_weight', 'fontWeight', 'font_family', 'fontFamily',
  'padding_top', 'paddingTop', 'padding_bottom', 'paddingBottom', 
  'padding_left', 'paddingLeft', 'padding_right', 'paddingRight',
  'margin_top', 'marginTop', 'margin_bottom', 'marginBottom', 
  'margin_left', 'marginLeft', 'margin_right', 'marginRight',
  'border_radius', 'borderRadius', 'border_color', 'borderColor', 
  'border_width', 'borderWidth', 'button_color', 'buttonColor',
  'width', 'height', 'gap', 'align', 'alignment', 'theme', 'accentColor', 'accent_color',
  'grid_cols', 'gridCols', 'sectionBg', 'sectionBgType', 'sectionGradientFrom',
  'sectionGradientTo', 'sectionGradientDir', 'sectionBgImage', 'sectionBgOverlay',
  'sectionShape', 'sectionShapeColor', 'sectionShapeOpacity'
];

/**
 * Checks if a key represents a styling property.
 */
export function isStyleKey(key: string): boolean {
  return STYLE_KEYWORDS.includes(key) ||
    key.startsWith('section') ||
    key.endsWith('Color') ||
    key.endsWith('Size') ||
    key.endsWith('Weight') ||
    key.endsWith('FontFamily');
}

/**
 * Extracts styling properties from a component props object.
 */
export function extractStyleProps(props: Record<string, any>): Record<string, any> {
  const styleProps: Record<string, any> = {};
  for (const key of Object.keys(props)) {
    if (isStyleKey(key)) {
      styleProps[key] = props[key];
    }
  }
  return styleProps;
}

/**
 * Extracts content properties from a component props object.
 */
export function extractContentProps(props: Record<string, any>): Record<string, any> {
  const contentProps: Record<string, any> = {};
  for (const key of Object.keys(props)) {
    if (!isStyleKey(key) && key !== 'items' && key !== 'order') {
      contentProps[key] = props[key];
    }
  }
  return contentProps;
}

/**
 * Converts a string key (e.g. background_color) to camelCase.
 */
export function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
}

/**
 * Safely format numerical values into CSS units.
 */
function formatUnit(val: any, defaultUnit = 'px'): string {
  if (typeof val === 'number') return `${val}${defaultUnit}`;
  if (typeof val === 'string') {
    if (/^\d+$/.test(val)) return `${val}${defaultUnit}`;
    return val;
  }
  return '';
}

/**
 * Style Mapper layer: maps editable section props to safe, clean CSS styles.
 */
export function buildStyles(props: Record<string, any>): React.CSSProperties {
  const styles: React.CSSProperties = {};
  const styleProps = extractStyleProps(props);

  for (const [rawKey, value] of Object.entries(styleProps)) {
    if (value === undefined || value === null || value === '') continue;

    // Convert key to standard camelCase CSS properties
    const key = toCamelCase(rawKey);

    // Map common CSS properties
    if (key === 'backgroundColor') styles.backgroundColor = value;
    else if (key === 'textColor' || rawKey === 'color') styles.color = value;
    else if (key === 'fontSize') styles.fontSize = formatUnit(value, 'px');
    else if (key === 'fontWeight') styles.fontWeight = value;
    else if (key === 'paddingTop') styles.paddingTop = formatUnit(value, 'px');
    else if (key === 'paddingBottom') styles.paddingBottom = formatUnit(value, 'px');
    else if (key === 'paddingLeft') styles.paddingLeft = formatUnit(value, 'px');
    else if (key === 'paddingRight') styles.paddingRight = formatUnit(value, 'px');
    else if (key === 'marginTop') styles.marginTop = formatUnit(value, 'px');
    else if (key === 'marginBottom') styles.marginBottom = formatUnit(value, 'px');
    else if (key === 'borderRadius') styles.borderRadius = formatUnit(value, 'px');
    else if (key === 'borderWidth') styles.borderWidth = formatUnit(value, 'px');
    else if (key === 'borderColor') styles.borderColor = value;
    else if (key === 'width') styles.width = formatUnit(value, 'px');
    else if (key === 'height') styles.height = formatUnit(value, 'px');
    else if (key === 'gap') styles.gap = formatUnit(value, 'px');
  }

  // Force transparent background for sections if a shape or custom background is active in the parent wrapper
  if (hasSectionBackground(props)) {
    styles.backgroundColor = 'transparent';
  }

  return styles;
}

