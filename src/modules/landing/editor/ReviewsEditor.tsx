import React from 'react';
import { Plus, Trash2, Star, Upload, MessageSquare, Image as ImageIcon, User } from 'lucide-react';
import { useLandingStore } from '../store/landingStore';

export default function ReviewsEditor() {
  const content = useLandingStore(state => state.content);
  const updateSectionContent = useLandingStore(state => state.updateSectionContent);

  if (!content || !content.reviews) return null;

  const data = content.reviews;
  const reviewType = data.reviewType || 'carousel';
  const screenshots = data.screenshots || [];
  const items = data.items || [];

  const handleChange = (field: string, value: any) => {
    updateSectionContent('reviews', { [field]: value });
  };

  const handleReviewChange = (index: number, field: string, value: any) => {
    const newItems = items.map((item, idx) => 
      idx === index ? { ...item, [field]: value } : item
    );
    updateSectionContent('reviews', { items: newItems });
  };

  const handleAddReview = (type: 'manual' | 'whatsapp' | 'image' = 'manual') => {
    let newItem: any = {
      id: `rev-${Date.now()}`,
      type
    };

    if (type === 'manual') {
      newItem = {
        ...newItem,
        name: 'اسم الطالب الجديد',
        role: 'مشترك بالدورة',
        comment: 'اكتب تجربة الطالب ورأيه الصادق في محتوى الدورة هنا.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
      };
    } else if (type === 'whatsapp') {
      newItem = {
        ...newItem,
        waSenderName: 'واتساب — رسالة من مشتركة',
        waBubble1In: 'أستاذ أحمد أنا قفلت أول عميل فريلانس بـ 4,000 ريال 🎉',
        waBubble1Time: '9:42 م',
        waBubble2Out: 'ألف مبروك يا سارة 👏 كملي على نفس الخطة',
        waBubble2Time: '9:45 م'
      };
    } else if (type === 'image') {
      newItem = {
        ...newItem,
        image: 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200'
      };
    }

    updateSectionContent('reviews', { items: [...items, newItem] });
  };

  const handleRemoveReview = (index: number) => {
    const newItems = items.filter((_, idx) => idx !== index);
    updateSectionContent('reviews', { items: newItems });
  };

  const handleScreenshotUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleReviewChange(index, 'image', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLegacyScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleChange('screenshots', [...screenshots, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
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

        {/* Layout Mode Selection */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
          <label className="text-xs font-black text-slate-700">طريقة العرض في الصفحة</label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleChange('reviewType', 'carousel')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                reviewType === 'carousel'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🎠 كاروسيل (متحرك مختلط)
            </button>
            <button
              type="button"
              onClick={() => handleChange('reviewType', 'screenshots')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                reviewType === 'screenshots'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🖼️ شبكة صور سكرينات
            </button>
          </div>
        </div>

        {/* Rendering options based on selected layout mode */}
        {reviewType === 'carousel' ? (
          /* Carousel mode list editor */
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">الآراء والنتائج الحالية:</span>
              
              {/* Type Selectors to add new items */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleAddReview('manual')}
                  className="bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 p-1 rounded-lg flex items-center gap-0.5 text-[8px] font-black transition-colors cursor-pointer"
                  title="تقييم نصي"
                >
                  <Plus size={10} />
                  نص يدوي
                </button>
                <button
                  onClick={() => handleAddReview('whatsapp')}
                  className="bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 p-1 rounded-lg flex items-center gap-0.5 text-[8px] font-black transition-colors cursor-pointer"
                  title="محادثة واتساب افتراضية"
                >
                  <Plus size={10} />
                  واتساب افتراضي
                </button>
                <button
                  onClick={() => handleAddReview('image')}
                  className="bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 p-1 rounded-lg flex items-center gap-0.5 text-[8px] font-black transition-colors cursor-pointer"
                  title="لقطة شاشة رأي"
                >
                  <Plus size={10} />
                  لقطة صورة
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {items.map((rev, idx) => {
                const itemType = rev.type || 'manual';

                return (
                  <div key={rev.id || idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 relative shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold">عنصر #{idx + 1}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                          itemType === 'whatsapp' 
                            ? 'bg-green-50 text-green-600' 
                            : itemType === 'image' 
                            ? 'bg-purple-50 text-purple-600' 
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                          {itemType === 'whatsapp' ? '💬 محادثة واتساب' : itemType === 'image' ? '📸 صورة رأي' : '✍️ رأي يدوي'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveReview(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        title="حذف هذا العنصر"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Conditional input fields based on testimonial type */}
                    {itemType === 'manual' && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">اسم الطالب:</label>
                            <input
                              type="text"
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                              value={rev.name || ''}
                              onChange={(e) => handleReviewChange(idx, 'name', e.target.value)}
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">الوظيفة / الصفة:</label>
                            <input
                              type="text"
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600"
                              value={rev.role || ''}
                              onChange={(e) => handleReviewChange(idx, 'role', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">النجوم (التقييم):</label>
                            <select
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600"
                              value={rev.rating || 5}
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
                              value={rev.avatar || ''}
                              onChange={(e) => handleReviewChange(idx, 'avatar', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">التعليق / الرأي:</label>
                          <textarea
                            className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 min-h-[50px]"
                            value={rev.comment || ''}
                            onChange={(e) => handleReviewChange(idx, 'comment', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {itemType === 'whatsapp' && (
                      <div className="space-y-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">رأس المحادثة (المرسل):</label>
                          <input
                            type="text"
                            placeholder="مثال: واتساب — رسالة من مشتركة"
                            className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-bold"
                            value={rev.waSenderName || ''}
                            onChange={(e) => handleReviewChange(idx, 'waSenderName', e.target.value)}
                          />
                        </div>

                        {/* Bubble 1 */}
                        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-2">
                          <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">فقاعة 1 (واردة من الطالب) *</label>
                            <input
                              type="text"
                              placeholder="أستاذ أحمد أنا قفلت أول عميل..."
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600"
                              value={rev.waBubble1In || ''}
                              onChange={(e) => handleReviewChange(idx, 'waBubble1In', e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">الوقت:</label>
                            <input
                              type="text"
                              placeholder="9:42 م"
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none"
                              value={rev.waBubble1Time || ''}
                              onChange={(e) => handleReviewChange(idx, 'waBubble1Time', e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Bubble 2 */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">فقاعة 2 (صادرة منك للرد) *</label>
                            <input
                              type="text"
                              placeholder="ألف مبروك يا سارة..."
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600"
                              value={rev.waBubble2Out || ''}
                              onChange={(e) => handleReviewChange(idx, 'waBubble2Out', e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">الوقت:</label>
                            <input
                              type="text"
                              placeholder="9:45 م"
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none"
                              value={rev.waBubble2Time || ''}
                              onChange={(e) => handleReviewChange(idx, 'waBubble2Time', e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Bubble 3 */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">فقاعة 3 (واردة إضافية - اختياري):</label>
                            <input
                              type="text"
                              placeholder="شكراً جداً يا باشمهندس..."
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600"
                              value={rev.waBubble3In || ''}
                              onChange={(e) => handleReviewChange(idx, 'waBubble3In', e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500">الوقت:</label>
                            <input
                              type="text"
                              placeholder="9:46 م"
                              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none"
                              value={rev.waBubble3Time || ''}
                              onChange={(e) => handleReviewChange(idx, 'waBubble3Time', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {itemType === 'image' && (
                      <div className="space-y-2">
                        {/* File Upload Selector */}
                        <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-white text-center flex flex-col items-center justify-center gap-1">
                          <span className="text-[9px] text-slate-400 font-bold">ارفع صورة سكرين شوت الرأي مباشرة</span>
                          <label className="bg-slate-800 hover:bg-slate-900 text-white font-black text-[8px] px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                            رفع ملف
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleScreenshotUpload(idx, e)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-500">رابط صورة لقطة الشاشة البديل:</label>
                          <input
                            type="text"
                            placeholder="https://example.com/screenshot.png"
                            className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-blue-600 font-mono"
                            value={rev.image || ''}
                            onChange={(e) => handleReviewChange(idx, 'image', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Legacy screenshots layout mode */
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">لقطات شاشة شبكة الصور:</span>
            </div>

            {/* Local Image Uploader */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 text-center flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition-colors">
              <Upload className="w-8 h-8 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-bold">ارفع صورة سكرين شوت</span>
              <label className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] px-4 py-2 rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm mt-1">
                اختر ملف صورة
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLegacyScreenshotUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* List of legacy screenshots */}
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {screenshots.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-bold text-[10px] bg-slate-50 rounded-xl border border-slate-100">
                  لا توجد لقطات شاشة حالياً.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {screenshots.map((src, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-col gap-1.5 relative group">
                      <div className="aspect-[9/16] rounded-lg overflow-hidden border border-slate-100 bg-slate-200 relative">
                        <img src={src} className="w-full h-full object-cover" alt="معاينة" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = screenshots.filter((_, index) => index !== idx);
                            handleChange('screenshots', updated);
                          }}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md transition-colors cursor-pointer"
                          title="حذف الصورة"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
