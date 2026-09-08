export function colorToRgbTriplet(color: string): string {
  if (!color) return '124, 58, 237'; // default fallback
  
  const trimmed = color.trim();
  
  // If it's already an RGB triplet like "124, 58, 237"
  if (/^\d+\s*,\s*\d+\s*,\s*\d+$/.test(trimmed)) {
    return trimmed;
  }
  
  // If it is rgb(12, 34, 56) or rgba(12, 34, 56, 0.5)
  const rgbMatch = trimmed.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    return `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
  }
  
  // If it is hex like #7c3aed or 7c3aed
  const hex = trimmed.replace('#', '');
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `${r}, ${g}, ${b}`;
  } else if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  
  return '124, 58, 237';
}

export function getColorLuminance(color: string): number {
  if (!color) return 1;
  const triplet = colorToRgbTriplet(color);
  const parts = triplet.split(',').map((p) => parseInt(p.trim(), 10) || 0);
  const r = parts[0] ?? 255;
  const g = parts[1] ?? 255;
  const b = parts[2] ?? 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function getContrastColor(
  bgColor: string,
  preferredTextColor?: string,
  defaultDark = '#0D3B33',
  defaultLight = '#FFFFFF'
): string {
  const bgLuminance = getColorLuminance(bgColor || '#FFFFFF');
  const isBgLight = bgLuminance > 0.55;

  if (preferredTextColor && preferredTextColor.trim()) {
    const textLuminance = getColorLuminance(preferredTextColor);
    if (isBgLight && textLuminance > 0.5) {
      return defaultDark;
    }
    if (!isBgLight && textLuminance <= 0.5) {
      return defaultLight;
    }
    return preferredTextColor;
  }

  return isBgLight ? defaultDark : defaultLight;
}
