'use client';

import React from 'react';
import { Plus, GripVertical, ChevronDown, X } from 'lucide-react';

interface CreateCourseModalContentTabProps {
  units: any[];
}

export const CreateCourseModalContentTab = ({
  units,
}: CreateCourseModalContentTabProps) => {
  return (
    <div className="space-y-8">
      {/* Title and Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">أساسيات تصميم تجربة المستخدم (UX/UI)</h2>
        <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-bold text-sm">الاجمالي {units.length} وحدة</span>
            <div className="w-[1px] h-4 bg-gray-200"></div>
            <span className="text-gray-900 font-black">0 دروس</span>
          </div>
        </div>
      </div>

      {/* Add Unit Button */}
      <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all">
        <Plus size={20} />
        اضافة وحدة
      </button>

      {/* Units List (Empty State Placeholder matching image) */}
      <div className="space-y-4">
        <div className="border border-gray-100 rounded-[24px] p-6 bg-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="text-gray-400 cursor-grab">
                <GripVertical size={20} />
              </div>
              <h3 className="text-lg font-black text-gray-900">الوحدة الأولي : مقدمة في تجربة وواجهة المستخدم</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <X size={18} className="rotate-45" />
              </button>{' '}
              {/* Edit icon placeholder */}
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                <ChevronDown size={20} />
              </button>
            </div>
          </div>

          {/* Add Lesson Placeholder */}
          <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 flex items-center justify-center gap-3 text-gray-400 font-bold cursor-pointer hover:border-blue-600 hover:text-blue-600 transition-all">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50">
              <Plus size={18} />
            </div>
            اضف درس جديد
          </div>
        </div>
      </div>
    </div>
  );
};
