'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Calendar, 
  Trash2, 
  Edit2, 
  Plus, 
  Search, 
  ArrowRight, 
  Upload, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------
interface AcademyPage {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  status: 'published' | 'draft';
  coverImage?: string;
}

// ----------------------------------------------------------------------
// Mock Data (matches Screenshot 3)
// ----------------------------------------------------------------------
const INITIAL_PAGES: AcademyPage[] = [
  { id: '1', name: 'الرئيسية', slug: 'home', createdAt: '22/10/2022', status: 'published', coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM' },
  { id: '2', name: 'من نحن', slug: 'about-us', createdAt: '19/8/2019', status: 'published' },
  { id: '3', name: 'تواصل معنا', slug: 'contact-us', createdAt: '14/1/2023', status: 'published' },
  { id: '4', name: 'تفاصيل الدورة', slug: 'course-details', createdAt: '7/1/2008', status: 'published' }, // 7/1/20018 typo fixed to standard 2008/2018
  { id: '5', name: 'الإحصائيات', slug: 'statistics', createdAt: '12/10/2022', status: 'published' }
];

export default function PagesManagerPage() {
  const [pages, setPages] = useState<AcademyPage[]>(INITIAL_PAGES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation / edit state
  const [currentEditPage, setCurrentEditPage] = useState<AcademyPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Load pages from local storage if available
  useEffect(() => {
    const cached = localStorage.getItem('darab_academy_pages');
    if (cached) {
      try {
        setPages(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to load academy pages:', e);
      }
    }
  }, []);

  const saveToStorage = (updatedList: AcademyPage[]) => {
    setPages(updatedList);
    localStorage.setItem('darab_academy_pages', JSON.stringify(updatedList));
  };

  // ----------------------------------------------------------------------
  // CRUD Actions
  // ----------------------------------------------------------------------
  const handleToggleStatus = (id: string, newStatus: 'published' | 'draft') => {
    const updated = pages.map(page => 
      page.id === id ? { ...page, status: newStatus } : page
    );
    saveToStorage(updated);
    toast.success(newStatus === 'published' ? 'تم نشر الصفحة بنجاح!' : 'تم إلغاء نشر الصفحة.');
  };

  const handleDeletePage = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'حذف الصفحة',
      text: `هل أنت متأكد من حذف صفحة "${name}" نهائياً؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، احذف الصفحة',
      cancelButtonText: 'إلغاء',
      customClass: {
        popup: 'rounded-[2rem]',
      }
    });

    if (result.isConfirmed) {
      const updated = pages.filter(page => page.id !== id);
      saveToStorage(updated);
      toast.success('تم حذف الصفحة بنجاح.');
    }
  };

  const handleSavePageDetails = (updatedPage: AcademyPage) => {
    let updated: AcademyPage[];
    if (isCreating) {
      updated = [...pages, updatedPage];
      toast.success('تمت إضافة الصفحة الجديدة بنجاح!');
    } else {
      updated = pages.map(p => p.id === updatedPage.id ? updatedPage : p);
      toast.success('تم حفظ تعديلات الصفحة بنجاح!');
    }
    saveToStorage(updated);
    setCurrentEditPage(null);
    setIsCreating(false);
  };

  // Filtered pages for rendering
  const filteredPages = pages.filter(page => 
    page.name.includes(searchQuery) || page.slug.includes(searchQuery)
  );

  return (
    <div className="max-w-5xl mx-auto pb-24 text-right animate-slide-up-fade" dir="rtl">
      
      {currentEditPage || isCreating ? (
        /* Edit/Create Page view (Screenshot 2) */
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
        /* Pages List Table view (Screenshot 3) */
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

                        {/* Actions matching Screenshot 3 */}
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

                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                setCurrentEditPage(page);
                                setIsCreating(false);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-black shadow-sm transition-all flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>تعديل</span>
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

    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-Component: PageEditor (matches Screenshot 2)
// ----------------------------------------------------------------------
interface PageEditorProps {
  page: AcademyPage | null;
  isCreating: boolean;
  onBack: () => void;
  onSave: (page: AcademyPage) => void;
}

function PageEditor({ page, isCreating, onBack, onSave }: PageEditorProps) {
  const [pageName, setPageName] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  
  // Ref to track locally generated object URLs for cleanups
  const localPreviewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize values
  useEffect(() => {
    if (page && !isCreating) {
      setPageName(page.name);
      setPageSlug(page.slug);
      setCoverUrl(page.coverImage || null);
    } else {
      setPageName('');
      setPageSlug('');
      setCoverUrl(null);
    }

    // Cleanup: revoke any remaining generated object URLs when unmounting
    return () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
        localPreviewUrlRef.current = null;
      }
    };
  }, [page, isCreating]);

  // Garbage Collector callback for image uploads
  const handleImageChange = (file: File) => {
    // Revoke previous temp object URL to prevent memory leaks
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }

    // Create a new memory URL and cache it
    const objectUrl = URL.createObjectURL(file);
    localPreviewUrlRef.current = objectUrl;
    setCoverUrl(objectUrl);
  };

  const handleRemoveImage = () => {
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }
    setCoverUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pageName.trim()) {
      toast.error('الرجاء إدخال اسم الصفحة');
      return;
    }

    const calculatedSlug = pageSlug.trim() || pageName.trim().toLowerCase().replace(/\s+/g, '-');
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const updatedPage: AcademyPage = {
      id: page?.id || String(Date.now()),
      name: pageName.trim(),
      slug: calculatedSlug,
      createdAt: page?.createdAt || formattedDate,
      status: page?.status || 'draft',
      coverImage: coverUrl || undefined
    };

    onSave(updatedPage);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Page Header (Screenshot 2 style with back arrow) */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white text-gray-500 hover:text-blue-600 rounded-2xl border border-gray-100 shadow-sm transition-all"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {isCreating ? 'إضافة صفحة جديدة' : 'تعديل الصفحة'}
            </h2>
            <p className="text-slate-400 font-bold text-xs mt-1">تعديل الاسم والصور والخصائص الخاصة بالصفحة</p>
          </div>
        </div>
      </div>

      {/* Editor Card */}
      <form onSubmit={handleFormSubmit} className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-10 space-y-8 shadow-sm">
        
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
