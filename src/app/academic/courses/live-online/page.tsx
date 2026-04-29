'use client';

import CourseList from '@/components/Academic/CourseList';

export default function LiveOnlineCoursesPage() {
  return (
    <CourseList 
      typeFilter="online"
      title="دورة لايف اون لاين"
      description="إدارة الدورات المباشرة عبر الإنترنت"
      createType="live-online"
    />
  );
}
