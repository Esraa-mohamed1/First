import React from 'react';
import * as Lucide from 'lucide-react';

export function getIconComponent(iconName: string): React.ComponentType<any> {
  // Try to find the exact match from lucide-react package
  const Icon = (Lucide as any)[iconName];
  if (Icon) return Icon;
  
  // Fallback icon if the specified one is not found
  return Lucide.HelpCircle;
}

export const AVAILABLE_ICONS = [
  'Folder',
  'Code',
  'Palette',
  'Briefcase',
  'Cpu',
  'Sparkles',
  'TrendingUp',
  'Users',
  'Wallet',
  'Award',
  'Clock',
  'GraduationCap',
  'BookOpen',
  'Globe',
  'Search',
  'MessageSquare',
  'Video',
  'Play',
  'Heart',
  'ShoppingCart',
  'LayoutGrid',
  'FileText',
  'Calendar',
  'Settings',
  'LogOut',
  'User',
  'Lock',
  'Unlock',
  'Bell',
  'CheckCircle',
  'AlertCircle',
  'Plus',
  'Trash2',
  'Edit2',
  'ChevronLeft',
  'ChevronRight',
  'Monitor',
  'Tablet',
  'Smartphone'
];
