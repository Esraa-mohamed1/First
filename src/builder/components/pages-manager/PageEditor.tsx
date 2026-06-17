'use client';

import React from 'react';
import { ArrowRight, Upload, X, CheckCircle } from 'lucide-react';
import { PageEditorProps } from '../../interfaces';
import { usePageEditor } from './usePageEditor';

export default function PageEditor(props: PageEditorProps) {
  const { page, isCreating, onBack } = props;
  const {
    pageName,
    setPageName,
    pageSlug,
    setPageSlug,
    coverUrl,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    handleFormSubmit
  } = usePageEditor(props);

  return (
    <div className="space-y-8 max-w-4xl mx-auto" dir="rtl">

      {/* Page Header (Screenshot 2 style with back arrow) */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-3 bg-white text-gray-500 hover:text-blue-600 rounded-2xl border border-gray-100 shadow-sm transition-all"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="text-right">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {isCreating ? 'إضافة صفحة جديدة' : 'تعديل الصفحة'}
            </h2>
            <p className="text-slate-400 font-bold text-xs mt-1">تعديل الاسم والصور والخصائص الخاصة بالصفحة</p>
          </div>
        </div>
      </div>

      {/* Editor Card */}
      <form onSubmit={handleFormSubmit} className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-10 space-y-8 shadow-sm text-right">

        {/* Name input */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-500 pr-2 block">اسم الصفحة</label>
          <input
            type="text"
            placeholder="ادخل اسم الصفحة"
            value={pageName}
            onChange={(e) => {
              setPageName(e.target.value);
              // Auto-generate slug from name if creating
              if (isCreating) {
                setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }
            }}
            className="w-full p-5 bg-gray-50 border border-gray-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 rounded-[2rem] outline-none transition-all font-bold text-gray-900 text-sm"
          />
        </div>

        {/* Slug Input */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-500 pr-2 block">رابط الصفحة (Slug)</label>
          <div className="relative" dir="ltr">
            <input
              type="text"
              placeholder="page-slug-link"
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="w-full p-5 bg-gray-50 border border-gray-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 rounded-[2rem] outline-none transition-all font-bold text-left text-gray-900 text-sm pl-24"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400 select-none">/darab.academy/</span>
          </div>
        </div>

        {/* Drag and Drop Cover image upload (Screenshot 2 UI) */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-500 pr-2 block">صورة الصفحة</label>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageChange(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {coverUrl ? (
            /* Uploaded Image Preview */
            <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner group bg-slate-50 flex items-center justify-center p-4 min-h-[220px]">
              <img
                src={coverUrl}
                alt="Page cover image preview"
                className="max-h-[300px] object-contain rounded-2xl shadow-sm"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors active:scale-95 z-20"
                title="إزالة الصورة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Blank Upload box matching Screenshot 2 design */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200/80 hover:border-blue-500 hover:bg-blue-50/5 cursor-pointer rounded-[2.5rem] p-10 transition-all duration-300 flex flex-col items-center justify-center space-y-4 bg-slate-50/50"
            >
              <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                <Upload className="w-7 h-7" />
              </div>
              <div className="text-center space-y-1">
                <span className="text-sm font-black text-slate-700 block">اضف صورة الدورة</span>
                <span className="text-[10px] text-slate-400 font-bold block">صورة غلاف دورة 1270x820</span>
              </div>
            </div>
          )}
        </div>

        {/* Form Action buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
          <button
            type="submit"
            className="flex-1 bg-[#4880FF] hover:bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-500/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>حفظ الصفحة</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-10 py-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[2rem] font-black text-lg transition-all active:scale-[0.99]"
          >
            إلغاء
          </button>
        </div>

      </form>

    </div>
  );
}
