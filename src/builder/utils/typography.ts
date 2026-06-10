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
  { value: 'font-black', label: 'داكن / عريض للغاية' }
];
