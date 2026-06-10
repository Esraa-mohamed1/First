import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLogoUrl(logo?: string | null): string {
  if (!logo) return '';
  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo;
  }
  const cleanLogo = logo.startsWith('/') ? logo.substring(1) : logo;
  return `https://api.darab.academy/${cleanLogo}`;
}

