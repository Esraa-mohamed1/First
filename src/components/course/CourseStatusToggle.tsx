'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Info } from 'lucide-react';

interface CourseStatusToggleProps {
  status: 'published' | 'draft';
  onChange: (status: 'published' | 'draft') => void;
}

export const CourseStatusToggle = ({ status, onChange }: CourseStatusToggleProps) => {
  const isPublished = status === 'published';

 
};
