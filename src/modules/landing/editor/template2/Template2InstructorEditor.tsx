'use client';

import React, { useState } from 'react';
import { useLandingStore } from '../../store/landingStore';
import { getTemplateDefaultContent } from '../../constants/defaultContent';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';

export default function Template2InstructorEditor() {
  const storeContent = useLandingStore(state => state.content);
  const courseData = useLandingStore(state => state.courseData);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  const defaultContent = getTemplateDefaultContent(courseData, 'template_2');
  const instructorContent = storeContent?.instructor;
  const badges = instructorContent?.badges !== undefined 
    ? instructorContent.badges 
    : (defaultContent.instructor?.badges || ['Google Certified', 'Interaction Design Expert', 'Mentor at ADPList']);

  const data = {
    ...defaultContent.instructor,
    ...(instructorContent || {}),
    badges
  };

  const [newBadge, setNewBadge] = useState('');

  const handleChange = (field: string, value: any) => {
    updateSectionContent('instructor', { [field]: value });
  };

  const handleAddBadge = () => {
    if (!newBadge.trim()) return;
    const currentBadges = [...(data.badges || [])];
    currentBadges.push(newBadge.trim());
    updateSectionContent('instructor', { badges: currentBadges });
    setNewBadge('');
  };

  const handleRemoveBadge = (idx: number) => {
    const currentBadges = (data.badges || []).filter((_, i) => i !== idx);
    updateSectionContent('instructor', { badges: currentBadges });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">بيانات واعتمادات المدرب — القالب التفاعلي</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">تخصيص الاسم، المسمى المهني، السيرة الذاتية، الصورة، الشارات، والألوان</p>
      </div>

      <div className="space-y-4">
        {/* Section Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان القسم</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="عن المدرب"
          />
        </div>

        {/* Instructor Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">اسم المدرب</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="أ. سارة أحمد"
          />
        </div>

        {/* Instructor Job Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">المسمى المهني والخبرة</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            value={data.jobTitle || ''}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="خبير تصميم واجهات وتجربة مستخدم..."
          />
        </div>

        {/* Instructor Bio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">السيرة الذاتية والنبذة التعريفية</label>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 min-h-[100px] font-bold"
            value={data.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="خبرة تزيد عن 10 سنوات في تصميم المنتجات..."
          />
        </div>

        {/* Instructor Image */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">رابط الصورة الشخصية للمدرب</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono text-left font-bold"
            dir="ltr"
            value={data.image || ''}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {/* Accreditations & Badges */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-500" />
            شارات الاعتماد والشهادات (Badges)
          </h4>

          <div className="flex flex-wrap gap-2">
            {(data.badges || []).map((badge: string, bIdx: number) => (
              <span key={bIdx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold flex items-center gap-1.5 border border-slate-200">
                <span>{badge}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBadge(bIdx)}
                  className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
            {(data.badges || []).length === 0 && (
              <p className="text-[11px] text-slate-400 italic">تم حذف جميع الشارات (لن تظهر أي شارة في صفحة الهبوط).</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              className="flex-1 border border-slate-200 rounded-xl p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              placeholder="أدخل اسم شارة جديدة..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddBadge();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddBadge}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>إضافة</span>
            </button>
          </div>
        </div>

        {/* Colors */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-black text-slate-700">ألوان قسم المدرب والشارات</h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون خلفية القسم</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.backgroundColor || '#faf8ff'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.backgroundColor || '#faf8ff'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون النصوص</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.textColor || '#191b23'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.textColor || '#191b23'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون خلفية الشارات</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.badgeBackgroundColor || '#ffffff'}
                  onChange={(e) => handleChange('badgeBackgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.badgeBackgroundColor || '#ffffff'}
                  onChange={(e) => handleChange('badgeBackgroundColor', e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">لون نصوص الشارات</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                  value={data.badgeTextColor || '#434654'}
                  onChange={(e) => handleChange('badgeTextColor', e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                  value={data.badgeTextColor || '#434654'}
                  onChange={(e) => handleChange('badgeTextColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
