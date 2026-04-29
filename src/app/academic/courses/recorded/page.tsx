'use client';

import CourseList from '@/components/Academic/CourseList';

export default function RecordedCoursesPage() {
  return (
    <CourseList 
      typeFilter="registered"
      title="دورة مسجلة"
      description="إدارة الدورات المسجلة الخاصة بك"
      createType="recorded"
    />
  );
}
