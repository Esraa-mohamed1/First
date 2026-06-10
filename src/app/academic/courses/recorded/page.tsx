'use client';

import CourseList from '@/components/Academic/CourseList';

export default function RecordedCoursesPage() {
  return (
    <CourseList 
      typeFilter="recorded"
      title="دورة مسجلة"
      description="إدارة الدورات المسجلة الخاصة بك"
      createType="recorded"
    />
  );
}
