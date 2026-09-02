'use client';

import React from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';

export default function Template3InstructorEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_3');
  const data = (storeContent?.template3_instructor || storeContent?.instructor || defaultContent.template3_instructor || {
    name: courseData?.instructor_name || courseData?.instructor?.name || courseData?.user?.name || 'أ. سارة أحمد',
    jobTitle: courseData?.instructor_title || 'خبير وكبير مصممي المنتجات الرقمية',
    bio: courseData?.instructor_bio || 'خبرة طويلة في تصميم وتطوير المنتجات الرقمية الموجهة للمستخدمين. عمل مع عدة جهات ومستشار تقني للتصميم وتطوير الهويات وتسهيل رحلة العميل.',
    avatar: courseData?.instructor?.avatar || courseData?.user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    studentsCount: '45,000+',
    coursesCount: '12+'
  }) as any;

  const handleChange = (field: string, value: any) => {
    updateSectionContent('template3_instructor', { [field]: value });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">بيانات المحاضر والمدرب — قالب UI/UX</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص الاسم، اللقب المهني، النبذة التعريفية، وإحصائيات الطلاب والدورات</p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">اسم المحاضر / المدرب</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="أ. سارة أحمد"
          />
        </div>

        {/* Job Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">المسمى واللقب المهني</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.jobTitle || ''}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="خبير وكبير مصممي المنتجات الرقمية"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">النبذة التعريفية والخبرات</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[100px] font-bold leading-relaxed"
            value={data.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="خبرة طويلة في تصميم وتطوير المنتجات..."
          />
        </div>

        {/* Avatar Image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">رابط الصورة الشخصية</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.avatar || ''}
            onChange={(e) => handleChange('avatar', e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">عدد الطلاب المستفيدين</label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
              value={data.studentsCount || ''}
              onChange={(e) => handleChange('studentsCount', e.target.value)}
              placeholder="45,000+"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">عدد البرامج التدريبية</label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
              value={data.coursesCount || ''}
              onChange={(e) => handleChange('coursesCount', e.target.value)}
              placeholder="12+"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
