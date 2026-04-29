'use client';

import { useRouter } from 'next/navigation';
import { Plus, Video } from 'lucide-react';

export default function RecordedCoursesPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">دورة مسجلة</h1>
          <p className="text-gray-500 mt-1">إدارة الدورات المسجلة</p>
        </div>
        <button
          onClick={() => router.push('/academic/courses/create?type=recorded')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          <span>اضافة دورة</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Video size={36} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد دورات مسجلة</h3>
        <p className="text-gray-500 mb-6">ابدأ بإضافة دورتك المسجلة الأولى</p>
        <button
          onClick={() => router.push('/academic/courses/create?type=recorded')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
        >
          <Plus size={18} />
          <span>اضافة دورة جديدة</span>
        </button>
      </div>
    </div>
  );
}
