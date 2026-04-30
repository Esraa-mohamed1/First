import React from 'react';
import { redirect } from 'next/navigation';

export default function StudentDashboard() {
  // Redirect to the courses page as the primary dashboard view
  redirect('/student/courses');
}
