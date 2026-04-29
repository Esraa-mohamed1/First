import { Suspense } from 'react';
import CreateCourseClient from './CreateCourseClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">جاري التحميل...</div>}>
      <CreateCourseClient />
    </Suspense>
  );
}
