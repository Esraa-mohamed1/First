'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Calendar,
  Trash2,
  Edit2,
  Plus,
  Search,
  Eye
} from 'lucide-react';
import TemplatePicker from '@/builder/components/TemplatePicker';
import { usePagesManager } from './usePagesManager';
import PageEditor from './PageEditor';

export default function PagesManagerPage() {
  const {
    searchQuery,
    setSearchQuery,
    currentEditPage,
    setCurrentEditPage,
    isCreating,
    setIsCreating,
    showTemplatePicker,
    setShowTemplatePicker,
    pendingPagePayload,
    handleToggleStatus,
    handleDeletePage,
    handleSavePageDetails,
    handleTemplateSelected,
    filteredPages
  } = usePagesManager();

  return (
    <div className="max-w-5xl mx-auto pb-24 text-right animate-slide-up-fade" dir="rtl">
      {currentEditPage || isCreating ? (
        /* Edit/Create Page view */
        <PageEditor
          page={currentEditPage}
          isCreating={isCreating}
          onBack={() => {
            setCurrentEditPage(null);
            setIsCreating(false);
          }}
          onSave={handleSavePageDetails}
        />
      ) : (
        /* Pages List Table view */
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#4880FF]" />
                <span>الصفحات</span>
              </h2>
              <p className="text-gray-400 font-bold mt-2">إدارة وتعديل الصفحات المكونة لموقع أكاديميتك الإلكتروني</p>
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#4880FF] hover:bg-blue-600 text-white font-black transition-all shadow-xl shadow-blue-500/10 active:scale-95 text-sm"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>إضافة صفحة جديدة</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm flex items-center">
            <input
              type="text"
              placeholder="البحث باسم الصفحة أو الرابط..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent p-3 outline-none text-sm font-bold text-gray-700 placeholder-gray-400"
            />
            <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[40px] shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100/80">
                    <th className="py-5 px-8 text-sm font-black text-slate-500">اسم الصفحة</th>
                    <th className="py-5 px-8 text-sm font-black text-slate-500">تاريخ التسجيل</th>
                    <th className="py-5 px-8 text-sm font-black text-slate-500 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {filteredPages.length > 0 ? (
                    filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-slate-50/30 transition-colors group">
                        {/* Page Name */}
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#4880FF] group-hover:bg-blue-50/70 transition-colors shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-800 text-sm block">{page.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">/{page.slug}</span>
                            </div>
                          </div>
                        </td>

                        {/* Registration Date */}
                        <td className="py-5 px-8 text-slate-500 font-bold text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-300" />
                            <span>{page.createdAt}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-5 px-8">
                          <div className="flex items-center justify-center gap-2">
                            {/* Publish / Unpublish states */}
                            {page.status === 'published' ? (
                              <>
                                <span className="px-3.5 py-1.5 rounded-xl bg-green-50 text-green-600 text-[11px] font-black shadow-sm shrink-0">
                                  نشر
                                </span>
                                <button
                                  onClick={() => handleToggleStatus(page.id, 'draft')}
                                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-[11px] font-black shadow-sm transition-colors"
                                >
                                  إلغاء نشر
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleToggleStatus(page.id, 'published')}
                                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-black shadow-sm transition-colors"
                                >
                                  نشر الآن
                                </button>
                                <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-600 text-[11px] font-black shadow-sm shrink-0">
                                  مسودة
                                </span>
                              </>
                            )}

                            {/* Visual Editor Link */}
                            <Link
                              href={`/academic/website/builder?templateId=${page.templateId || 'academy-dashboard'}&pageId=${page.id}`}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-black shadow-sm transition-all flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>تعديل بالباني</span>
                            </Link>

                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                setCurrentEditPage(page);
                                setIsCreating(false);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-black shadow-sm transition-all flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>الخصائص</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeletePage(page.id, page.name)}
                              className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-[11px] font-black shadow-sm transition-all flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-400 font-bold italic">
                        لا توجد صفحات مطابقة لبحثك.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Template Picker Modal — shown after filling page details for NEW pages */}
      {showTemplatePicker && pendingPagePayload && (
        <TemplatePicker
          pagePayload={pendingPagePayload}
          onClose={() => {
            setShowTemplatePicker(false);
          }}
          onSuccess={handleTemplateSelected}
        />
      )}
    </div>
  );
}
