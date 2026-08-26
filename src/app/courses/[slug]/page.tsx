'use client';

import { useParams } from 'next/navigation';
import CourseGuestView from '@/components/course/CourseGuestView';

export default function CoursePage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  return <CourseGuestView slug={slug} />;
}
