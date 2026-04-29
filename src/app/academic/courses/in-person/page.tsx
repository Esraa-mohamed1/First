'use client';

import CourseList from '@/components/Academic/CourseList';

export default function InPersonCoursesPage() {
  return (
    <CourseList 
      typeFilter="offline"
      title="دورة حضوري"
      description="إدارة الدورات التي تقدم في مقرات تدريبية"
      createType="in-person"
    />
  );
}
