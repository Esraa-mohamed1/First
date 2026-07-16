import React from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { useLandingStore } from '../store/landingStore';

export default function ReviewsEditor() {
  const content = useLandingStore(state => state.content);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  if (!content || !content.reviews) return null;

  const data = content.reviews;

  const handleChange = (field: string, value: any) => {
    updateSectionContent('reviews', { [field]: value });
  };

  const handleReviewChange = (index: number, field: string, value: any) => {
    const newItems = data.items.map((item, idx) => 
      idx === index ? { ...item, [field]: value } : item
    );
    updateSectionContent('reviews', { items: newItems });
  };

  const handleAddReview = () => {
    const newReview = {
      id: `rev-${Date.now()}`,
      name: 'اسم الطالب الجديد',
      role: 'مشترك بالدورة',
      comment: 'اكتب تجربة الطالب ورأيه الصادق في محتوى الدورة والفوائد هنا.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
    };
    updateSectionContent('reviews', { items: [...data.items, newReview] });
  };

  const handleRemoveReview = (index: number) => {
    const newItems = data.items.filter((_, idx) => idx !== index);
    updateSectionContent('reviews', { items: newItems });
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      <div>
        <h3 className="text-sm font-black text-slate-800 border-r-4 border-blue-600 pr-2">تعديل آراء وتجارب الطلاب</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1">أضف تقييمات الطلاب وتجاربهم لإقناع المشتركين الجدد</p>
      </div>

      <div className="space-y-4">
        {/* Toggle Section */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <label className="text-xs font-black text-slate-900 block">عرض قسم التقييمات والآراء</label>
            <span className="text-[10px] text-slate-400 font-bold">إظهار أو إخفاء القسم بالكامل في صفحة الهبوط</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={data.showSection}
              onChange={(e) => handleChange('showSection', e.target.checked)}
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">عنوان القسم الرئيسي</label>
          <input
            type="text"
            className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* Reviews Items list */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800">قائمة تقييمات الطلاب:</span>
            <button
              onClick={handleAddReview}
              className="bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:text-blue-700 p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-black transition-colors cursor-pointer"
            >
              <Plus size={12} />
              إضافة تقييم
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {data.items.map((rev, idx) => (
              <div key={rev.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">تقييم #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveReview(idx)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    title="حذف التقييم"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-500">اسم الطالب:</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                      value={rev.name}
                      onChange={(e) => handleReviewChange(idx, 'name', e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-500">الوظيفة / الصفة:</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600"
                      value={rev.role}
                      onChange={(e) => handleReviewChange(idx, 'role', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-500">النجوم (التقييم):</label>
                    <select
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600"
                      value={rev.rating}
                      onChange={(e) => handleReviewChange(idx, 'rating', Number(e.target.value))}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 نجوم)</option>
                      <option value="4">⭐⭐⭐⭐ (4 نجوم)</option>
                      <option value="3">⭐⭐⭐ (3 نجوم)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-500">صورة الأفاتار URL:</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none"
                      value={rev.avatar}
                      onChange={(e) => handleReviewChange(idx, 'avatar', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500">التعليق / الرأي:</label>
                  <textarea
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 min-h-[50px]"
                    value={rev.comment}
                    onChange={(e) => handleReviewChange(idx, 'comment', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Styling colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">لون الخلفية</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                value={data.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                value={data.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">لون النصوص</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent shrink-0 outline-none"
                value={data.textColor || '#1f2937'}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent text-center text-xs font-bold font-mono text-slate-700 focus:outline-none"
                value={data.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
