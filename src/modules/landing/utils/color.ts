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
