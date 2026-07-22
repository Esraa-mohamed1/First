'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Share2,
  FileText,
  Calendar,
  Layers,
  ChevronDown,
  Check,
  Search,
  BookOpen,
  ArrowRight,
  Loader2,
  Video,
  UploadCloud,
  Upload,
  Trash2,
  Image as ImageIcon,
  Link2,
  X,
  ShieldCheck,
  CheckCircle2,
  File,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import BagPreviewCard from './BagPreviewCard';
import { BagFormState } from '@/types/market';
import { getCourses, getCategories } from '@/services/courses';
import { getUserPaymentInfos } from '@/services/finance';
import { createBag, updateBag, getBag, BagApiItem, BagItemInput } from '@/services/bags';
import { Course } from '@/types/api';

interface BagWizardPageProps {
  /** Optional ID of existing bag for edit mode */
  editBagId?: number;
}

const mockAvailableCourses = [
  {
    id: 1,
    title: 'كورس Tailwind CSS Mastery الكامل',
    category: 'برمجة وتطوير',
    instructor: 'أحمد محمد',
    lessonCount: 20,
    price: 199,
  },
  {
    id: 2,
    title: 'دورة JavaScript 2025 التفاعلية',
    category: 'برمجة وتطوير',
    instructor: 'أحمد محمد',
    lessonCount: 20,
    price: 299,
  },
  {
    id: 3,
    title: 'دورة React 2025 المتقدمة وبناء المشاريع',
    category: 'تصميم الواجهات',
    instructor: 'أحمد محمد',
    lessonCount: 20,
    price: 349,
  },
  {
    id: 4,
    title: 'أساسيات تصميم واجهات وتجربة المستخدم UI/UX',
    category: 'تصميم الواجهات',
    instructor: 'سارة أحمد',
    lessonCount: 15,
    price: 150,
  },
  {
    id: 5,
    title: 'دورة Node.js وبناء الأبي أي API الاحترافية',
    category: 'برمجة وتطوير',
    instructor: 'محمود علي',
    lessonCount: 25,
    price: 250,
  },
];

const initialFormState: BagFormState = {
  title: '',
  description: '',
  coverImage: '',
  category: 'عام',
  instructorName: '',
  isFree: false,
  price: 0,
  discountPrice: 0,
  paymentMethods: [],
  downloadPolicy: 'unlimited',
  downloadLimit: 0,
  downloadExpiry: 'never',
  visibility: 'published',
  selectedCourseIds: [],
};

/**
 * BagWizardPage Component
 * Dedicated full page implementation for creating & editing digital bags.
 * Guarantees zero crashes when navigating between Step 1, Step 2, and Step 3.
 */
export default function BagWizardPage({ editBagId }: BagWizardPageProps) {
  const router = useRouter();

  // Step state: 1 = الأساسيات, 2 = المحتوي, 3 = التسعير و الوصول
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<BagFormState>(initialFormState);
  const [isSaving, setIsSaving] = useState(false);

  // Cover Image File State
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [imageUploadMode, setImageUploadMode] = useState<'file' | 'url'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 Content Uploaded Files State (Dynamic, not static)
  const [uploadedBagFiles, setUploadedBagFiles] = useState<
    Array<{ id: string; name: string; size: string; type: string; file?: File }>
  >([]);
  const bagFilesInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingBagFiles, setIsDraggingBagFiles] = useState(false);

  // Step 2 Courses State
  const [availableCourses, setAvailableCourses] = useState<any[]>(mockAvailableCourses);
  const [courseSearch, setCourseSearch] = useState<string>('');
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);

  // Categories from API (for Step 1 dropdown)
  const [categories, setCategories] = useState<string[]>([
    'برمجة وتطوير', 'تصميم الواجهات', 'ذكاء اصطناعي', 'تسويق', 'ريادة أعمال', 'عام',
  ]);

  // Payment methods from instructor_receiver_accounts API (for Step 3)
  const [paymentInfos, setPaymentInfos] = useState<Array<{ id: number; name: string; logo?: string }>>([]);
  const [loadingPaymentInfos, setLoadingPaymentInfos] = useState(false);

  useEffect(() => {
    /* ── Edit mode: load bag data from API ── */
    if (editBagId) {
      getBag(editBagId).then((apiBag: BagApiItem | null) => {
        if (apiBag) {
          setFormData({
            title: apiBag.title || '',
            description: apiBag.description || apiBag.short_description || '',
            coverImage: apiBag.image || '',
            category: apiBag.category_name || 'عام',
            instructorName: '',
            isFree: apiBag.type_price === 'free',
            price: apiBag.price || 0,
            discountPrice: apiBag.discount_price || 0,
            paymentMethods: (apiBag.payment_info_ids || []).map(String),
            downloadPolicy: 'unlimited',
            downloadLimit: 0,
            downloadExpiry: 'never',
            visibility: apiBag.is_active === 1 ? 'published' : 'draft',
            selectedCourseIds: Array.isArray(apiBag.items) ? apiBag.items : [],
          });
        }
      }).catch((err) => console.error('Failed to load bag for edit:', err));
    }

    /* ── Fetch real categories for Step 1 dropdown ── */
    getCategories().then((cats: any[]) => {
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats.map((c: any) => c.name || c));
      }
    }).catch(() => {}); // silently keep defaults

    /* ── Fetch instructor payment methods for Step 3 ── */
    setLoadingPaymentInfos(true);
    getUserPaymentInfos().then((infos) => {
      if (Array.isArray(infos) && infos.length > 0) {
        setPaymentInfos(infos.map((info: any) => ({
          id: info.id,
          name: info.name || info.receiver_account?.name || '',
          logo: info.logo || info.receiver_account?.logo || '',
        })));
      }
    }).catch(() => {}).finally(() => setLoadingPaymentInfos(false));

    /* ── Fetch courses for Step 2 ── */
    const fetchAcademyCourses = async () => {
      setLoadingCourses(true);
      try {
        const data = await getCourses();
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((c: Course) => ({
            id: c.id,
            title: c.title,
            category: c.category || 'عام',
            instructor: c.instructor || 'أحمد محمد',
            lessonCount:
              c.units?.reduce(
                (acc, unit) => acc + (unit.lessons?.length || 0),
                0
              ) || 20,
            price: Number(c.price) || 0,
          }));
          setAvailableCourses(mapped);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchAcademyCourses();
  }, [editBagId]);

  // Defensive array checks
  const safePaymentMethods = Array.isArray(formData.paymentMethods)
    ? formData.paymentMethods
    : [];

  const safeSelectedCourseIds = Array.isArray(formData.selectedCourseIds)
    ? formData.selectedCourseIds
    : [];

  /** Toggle payment method selection safely */
  const togglePaymentMethod = (method: string) => {
    const updated = safePaymentMethods.includes(method)
      ? safePaymentMethods.filter((m) => m !== method)
      : [...safePaymentMethods, method];
    setFormData((prev) => ({ ...prev, paymentMethods: updated }));
  };

  /** Toggle course selection in Step 2 safely */
  const toggleCourseSelection = (courseId: number) => {
    const updated = safeSelectedCourseIds.includes(courseId)
      ? safeSelectedCourseIds.filter((id) => id !== courseId)
      : [...safeSelectedCourseIds, courseId];
    setFormData((prev) => ({ ...prev, selectedCourseIds: updated }));
  };

  /** Select or deselect all courses */
  const toggleSelectAllCourses = () => {
    if (safeSelectedCourseIds.length === availableCourses.length) {
      setFormData((prev) => ({ ...prev, selectedCourseIds: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedCourseIds: availableCourses.map((c) => c.id),
      }));
    }
  };

  /** Filter courses based on search */
  const filteredCourses = availableCourses.filter((course) =>
    (course.title || '').toLowerCase().includes((courseSearch || '').toLowerCase())
  );

  /** Calculate total lessons count */
  const totalSelectedLessons = availableCourses
    .filter((c) => safeSelectedCourseIds.includes(c.id))
    .reduce((sum, c) => sum + (c.lessonCount || 20), 0);

  /** Submit & Save — called directly from the publish button, NOT via form onSubmit */
  const handleSaveBag = async () => {
    if (!formData.title?.trim()) {
      toast.error('عنوان الحقيبة مطلوب');
      setCurrentStep(1);
      return;
    }

    setIsSaving(true);
    try {
      // Build valid payment_info_ids — only numeric IDs from instructor_receiver_accounts.
      // Empty array is omitted entirely; sending invalid IDs causes backend 422 errors.
      const validPaymentIds = safePaymentMethods
        .map((s) => Number(s))
        .filter((n) => !isNaN(n) && n > 0);

      // Build items array combining uploaded files and selected courses
      const fileItemsPayload: BagItemInput[] = uploadedBagFiles.map((f) => {
        if (f.file) {
          return { type: f.type || 'file', file: f.file };
        }
        return { type: f.type || 'file', file: f.name };
      });

      const courseItemsPayload: BagItemInput[] = safeSelectedCourseIds.map((courseId) => ({
        type: 'course',
        file: String(courseId),
      }));

      const itemsPayload: BagItemInput[] = [...fileItemsPayload, ...courseItemsPayload];

      const payload = {
        title: formData.title.trim(),
        short_description: formData.description || undefined,
        description: formData.description || undefined,
        category_name: formData.category || undefined,
        type_price: formData.isFree ? 'free' : 'paid',
        price: formData.isFree ? undefined : formData.price,
        discount_price: formData.isFree ? undefined : (formData.discountPrice || undefined),
        is_active: formData.visibility === 'published' ? 1 : 0,
        // Only include payment_info_ids when non-empty (omitting avoids backend 422)
        payment_info_ids: validPaymentIds.length > 0 ? validPaymentIds : undefined,
        // Include items array with type and file for each selected course
        items: itemsPayload.length > 0 ? itemsPayload : undefined,
        // Send coverImageFile if user uploaded a file, otherwise send the coverImage string URL
        image: coverImageFile || (formData.coverImage.startsWith('blob:') || formData.coverImage.startsWith('data:') ? undefined : formData.coverImage || undefined),
      };

      if (editBagId) {
        await updateBag(Number(editBagId), payload);
        toast.success('تم تحديث الحقيبة بنجاح');
      } else {
        await createBag(payload);
        toast.success('تم إنشاء الحقيبة بنجاح');
      }

      router.push('/academic/market');
    } catch (err: any) {
      console.error('Save bag failed:', err);
      // Surface backend validation errors to the user
      const errors = err?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] as string : String(firstError));
      } else {
        toast.error(err?.message || 'فشل حفظ الحقيبة، يرجى المحاولة لاحقاً');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => router.push('/academic/market')}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowRight size={16} />
            <span>العودة لمتجر الحقائب</span>
          </button>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {editBagId ? 'تعديل الحقيبة التدريبية' : 'إنشاء حقيبة تدريبية جديدة'}
          </h2>
        </div>
      </div>

      {/* 3-Step Wizard Navigation Bar (Matching Images 2, 3, 5) */}
      <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-sm ${
            currentStep === 1
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
              : 'bg-gray-50/70 text-blue-600 hover:bg-gray-100'
          }`}
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 1 ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
            }`}
          >
            01
          </span>
          <span>الأساسيات</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className={`py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-sm ${
            currentStep === 2
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
              : 'bg-gray-50/70 text-blue-600 hover:bg-gray-100'
          }`}
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 2 ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
            }`}
          >
            02
          </span>
          <span>المحتوي</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className={`py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-sm ${
            currentStep === 3
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
              : 'bg-gray-50/70 text-blue-600 hover:bg-gray-100'
          }`}
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 3 ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
            }`}
          >
            03
          </span>
          <span>التسعير و الوصول</span>
        </button>
      </div>

      {/* Main Page Form Body — no <form> wrapper to prevent accidental submission on step change */}
      <div>
        {/* STEP 1: BASICS */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-gray-900">
                01 - بيانات الحقيبة الأساسية
              </h3>
              <p className="text-xs font-bold text-gray-400 mt-1">
                أدخل عنوان الحقيبة والوصف وغلاف المنتج لتظهر بشكل متميز للطلاب
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 block">
                عنوان الحقيبة التدريبية
              </label>
              <input
                type="text"
                placeholder="مثال: Tailwind CSS Mastery"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500 transition-all text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 block">
                وصف الحقيبة
              </label>
              <textarea
                rows={4}
                placeholder="أدخل وصفاً تفصيلياً محفزاً للشراء..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500 transition-all text-gray-900"
              />
            </div>

            {/* Cover Image Upload Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-gray-700 block">
                  صورة غلاف الحقيبة
                </label>

                {/* Upload Mode Selector */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setImageUploadMode('file')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      imageUploadMode === 'file'
                        ? 'bg-white text-blue-600 shadow-sm font-black'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Upload size={13} />
                    <span>رفع ملف</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadMode('url')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                      imageUploadMode === 'url'
                        ? 'bg-white text-blue-600 shadow-sm font-black'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Link2 size={13} />
                    <span>رابط صورة</span>
                  </button>
                </div>
              </div>

              {imageUploadMode === 'file' ? (
                /* File Upload Dropzone & Preview */
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error('حجم الصورة يجب أن لا يتجاوز 10 ميجابايت');
                          return;
                        }
                        setCoverImageFile(file);
                        const localUrl = URL.createObjectURL(file);
                        setFormData((prev) => ({ ...prev, coverImage: localUrl }));
                      }
                    }}
                  />

                  {formData.coverImage ? (
                    /* Image Selected / Preview Banner */
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 group">
                      <div className="h-44 w-full relative overflow-hidden bg-gray-900/5">
                        <img
                          src={formData.coverImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-white text-gray-900 rounded-xl text-xs font-black shadow-lg hover:bg-gray-100 transition-all flex items-center gap-1.5"
                          >
                            <Upload size={14} />
                            <span>تغيير الصورة</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImageFile(null);
                              setFormData((prev) => ({ ...prev, coverImage: '' }));
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black shadow-lg hover:bg-red-700 transition-all flex items-center gap-1.5"
                          >
                            <Trash2 size={14} />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-3 flex items-center justify-between text-xs font-bold text-gray-600 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-2 truncate">
                          <ImageIcon size={16} className="text-blue-600 flex-shrink-0" />
                          <span className="truncate">
                            {coverImageFile ? coverImageFile.name : 'صورة الغلاف الحالية'}
                          </span>
                        </div>
                        {coverImageFile && (
                          <span className="text-[11px] text-gray-400 font-mono">
                            {(coverImageFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Empty Dropzone State */
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error('حجم الصورة يجب أن لا يتجاوز 10 ميجابايت');
                            return;
                          }
                          setCoverImageFile(file);
                          const localUrl = URL.createObjectURL(file);
                          setFormData((prev) => ({ ...prev, coverImage: localUrl }));
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                        isDragging
                          ? 'border-blue-600 bg-blue-50/50 scale-[0.99]'
                          : 'border-gray-200 bg-gray-50/70 hover:border-blue-400 hover:bg-blue-50/20'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shadow-inner">
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">
                          اضغط هنا لرفع صورة الغلاف أو اسحب الملف إلى هنا
                        </p>
                        <p className="text-xs font-bold text-gray-400 mt-1">
                          PNG, JPG, WEBP, GIF حتى 10 ميجابايت
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Direct URL Input Mode */
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500 transition-all text-gray-900"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 block">
                  التصنيف
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500 transition-all text-gray-900"
                >
                  {/* Dynamic categories from API */}
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 block">
                  اسم المدرب
                </label>
                <input
                  type="text"
                  value={formData.instructorName}
                  onChange={(e) =>
                    setFormData({ ...formData, instructorName: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500 transition-all text-gray-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CONTENT (Upgraded Style & RTL Alignment) */}
        {currentStep === 2 && (
          <div className="space-y-8">
            {/* Top Grid Row: Right Dropzone Zone (lg:col-span-8) | Left Sidebar Cards (lg:col-span-4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Right Column: Dropzone Container (First in RTL = Displays on RIGHT) */}
              <div className="lg:col-span-8">
                <input
                  ref={bagFilesInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const newFiles = Array.from(e.target.files).map((f, idx) => {
                        const ext = f.name.split('.').pop()?.toLowerCase() || 'file';
                        let displayType = 'file';
                        if (ext === 'pdf') displayType = 'pdf';
                        else if (ext === 'zip' || ext === 'rar') displayType = 'zip';
                        else if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) displayType = 'mp4';
                        const sizeMB = (f.size / (1024 * 1024)).toFixed(1) + 'MB';

                        return {
                          id: String(Date.now() + idx),
                          name: f.name.replace(/\.[^/.]+$/, ''),
                          size: sizeMB,
                          type: displayType,
                          file: f,
                        };
                      });
                      setUploadedBagFiles((prev) => [...prev, ...newFiles]);
                      toast.success(`تم إرفاق ${newFiles.length} ملف بنجاح`);
                    }
                  }}
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingBagFiles(true);
                  }}
                  onDragLeave={() => setIsDraggingBagFiles(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingBagFiles(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      const newFiles = Array.from(e.dataTransfer.files).map((f, idx) => {
                        const ext = f.name.split('.').pop()?.toLowerCase() || 'file';
                        let displayType = 'file';
                        if (ext === 'pdf') displayType = 'pdf';
                        else if (ext === 'zip' || ext === 'rar') displayType = 'zip';
                        else if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) displayType = 'mp4';
                        const sizeMB = (f.size / (1024 * 1024)).toFixed(1) + 'MB';

                        return {
                          id: String(Date.now() + idx),
                          name: f.name.replace(/\.[^/.]+$/, ''),
                          size: sizeMB,
                          type: displayType,
                          file: f,
                        };
                      });
                      setUploadedBagFiles((prev) => [...prev, ...newFiles]);
                      toast.success(`تم إرفاق ${newFiles.length} ملف بنجاح`);
                    }
                  }}
                  onClick={() => bagFilesInputRef.current?.click()}
                  className={`group h-full min-h-[310px] border-2 border-dashed rounded-[32px] p-8 lg:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-5 bg-white shadow-sm hover:shadow-md ${
                    isDraggingBagFiles
                      ? 'border-blue-600 bg-blue-50/50 scale-[0.99] ring-4 ring-blue-100'
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/20'
                  }`}
                >
                  <div className="w-24 h-24 rounded-full bg-blue-50/80 text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                    <UploadCloud size={46} strokeWidth={1.5} className="group-hover:animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg lg:text-xl font-black text-gray-800 tracking-tight">
                      اسحب الملف وأفلتها هنا أو انقر لاختيار الملفات من جهازك
                    </h4>
                  </div>

                  {/* Pill Badges Row */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <span className="px-5 py-2 rounded-full bg-blue-50/80 text-blue-600 font-black text-xs hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-0.5">
                      PDF
                    </span>
                    <span className="px-5 py-2 rounded-full bg-blue-50/80 text-blue-600 font-black text-xs hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-0.5">
                      ZIP
                    </span>
                    <span className="px-5 py-2 rounded-full bg-blue-50/80 text-blue-600 font-black text-xs hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-0.5">
                      MP4
                    </span>
                    <span className="px-5 py-2 rounded-full bg-blue-50/80 text-blue-600 font-black text-xs hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-0.5">
                      حتي 2 جيجا
                    </span>
                  </div>
                </div>
              </div>

              {/* Left Column: Sidebar Cards (Second in RTL = Displays on LEFT) */}
              <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
                {/* Card 1: نصائح للمدرب */}
                <div className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-500 flex items-center justify-center flex-shrink-0 font-bold shadow-inner">
                      <Sparkles size={18} />
                    </div>
                    <h3 className="text-base font-black text-gray-900">
                      نصائح للمدرب
                    </h3>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    <div className="flex items-start gap-3 text-xs font-bold text-gray-500 leading-relaxed">
                      <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>تأكد من تسمية الملفات بوضوح لتسهيل تجربة الطلاب.</span>
                    </div>

                    <div className="flex items-start gap-3 text-xs font-bold text-gray-500 leading-relaxed">
                      <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>يفضل ضغط الملفات الكبيرة في صيغة ZIP لتقليل وقت التحميل.</span>
                    </div>

                    <div className="flex items-start gap-3 text-xs font-bold text-gray-500 leading-relaxed">
                      <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>استخدم صيغة PDF للمستندات لضمان ثبات التنسيق.</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: دعم تخزين سحابي */}
                <div className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm relative overflow-hidden space-y-2 flex-1 flex flex-col justify-center min-h-[140px] hover:shadow-md transition-all">
                  <ShieldCheck
                    size={110}
                    className="absolute -left-4 -bottom-4 text-gray-100/90 pointer-events-none stroke-[1.2]"
                  />
                  <h3 className="text-base font-black text-gray-900 relative z-10">
                    دعم تخزين سحابي
                  </h3>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed relative z-10 max-w-[230px]">
                    نقوم بتأمين ملفاتك عبر سيرفرات مشفرة لضمان حقوق الملكية.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section: Uploaded Files List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  الملفات المرفوعة ({uploadedBagFiles.length})
                </h3>

                {uploadedBagFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => bagFilesInputRef.current?.click()}
                    className="text-xs font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Upload size={14} />
                    <span>إضافة المزيد من الملفات</span>
                  </button>
                )}
              </div>

              {uploadedBagFiles.length === 0 ? (
                <div
                  onClick={() => bagFilesInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-[28px] p-10 text-center bg-white hover:bg-gray-50/50 cursor-pointer transition-all space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <File size={26} />
                  </div>
                  <p className="text-sm font-black text-gray-600">
                    لم يتم إرفاق ملفات بعد
                  </p>
                  <p className="text-xs font-bold text-gray-400">
                    اضغط هنا أو اسحب الملفات إلى المنطقة أعلاه لإضافة محتويات الحقيبة.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedBagFiles.map((file) => {
                    const isPdf = file.type === 'pdf';
                    const isZip = file.type === 'zip';
                    const isMp4 = file.type === 'mp4';

                    let badgeColor = 'bg-amber-100 text-amber-600';
                    let iconBg = 'bg-amber-100/80 text-amber-600';
                    if (isPdf) {
                      badgeColor = 'bg-purple-100 text-purple-600';
                      iconBg = 'bg-purple-100/80 text-purple-600';
                    } else if (isZip) {
                      badgeColor = 'bg-emerald-100 text-emerald-600';
                      iconBg = 'bg-emerald-100/80 text-emerald-600';
                    } else if (isMp4) {
                      badgeColor = 'bg-blue-100 text-blue-600';
                      iconBg = 'bg-blue-100/80 text-blue-600';
                    }

                    return (
                      <div
                        key={file.id}
                        className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between hover:shadow-md transition-all group"
                      >
                        {/* Left Action: Red Trash Delete Icon (in RTL) */}
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedBagFiles((prev) =>
                              prev.filter((f) => f.id !== file.id)
                            );
                            toast.success('تم حذف الملف');
                          }}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="حذف الملف"
                        >
                          <Trash2 size={18} />
                        </button>

                        {/* Right Details: Icon + Title + Size + Badge (in RTL) */}
                        <div className="flex items-center gap-4">
                          <div className="space-y-1 text-right">
                            <h4 className="font-black text-sm text-gray-900 group-hover:text-blue-600 transition-colors" dir="auto">
                              {file.name}
                            </h4>
                            <div className="flex items-center justify-end gap-2 text-xs font-bold text-gray-400">
                              <span>{file.size}</span>
                              <span
                                className={`px-3 py-0.5 rounded-lg text-[11px] font-black uppercase ${badgeColor}`}
                              >
                                {isPdf ? 'PDF' : isZip ? 'ZIP' : isMp4 ? 'MP4' : 'File'}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
                          >
                            {isPdf ? (
                              <FileText size={22} />
                            ) : isMp4 ? (
                              <Video size={22} />
                            ) : (
                              <File size={22} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: PRICING & ACCESS (Matching Images 2, 3, 5 - SAFE RENDER) */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Live Card Preview */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <BagPreviewCard formData={formData} />
            </div>

            {/* Right Column: Settings Cards */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Pricing Settings Card */}
              <div className="bg-white rounded-3xl p-6 lg:p-7 border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">
                      اعدادات التسعير
                    </h3>
                  </div>
                </div>

                {/* Free Product Toggle Switch */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <div>
                    <h4 className="text-sm font-black text-gray-900">
                      منتج مجاني
                    </h4>
                    <p className="text-xs font-bold text-gray-400 mt-0.5">
                      اجعل هذا المنتج متاحا للجميع بدون رسوم
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isFree)}
                      onChange={(e) =>
                        setFormData({ ...formData, isFree: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Prices */}
                {!formData.isFree && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-700 block">
                        سعر المنتج
                      </label>
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden focus-within:border-blue-500 transition-all">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                          className="w-full bg-transparent p-3.5 text-sm font-black outline-none text-gray-900"
                        />
                        <div className="px-4 py-3 bg-gray-100/80 border-r border-gray-200 text-xs font-black text-blue-600 flex items-center gap-1 cursor-pointer">
                          <span>SAR</span>
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-700 block">
                        السعر بعد الخصم (اختياري)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.discountPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-black outline-none focus:border-blue-500 transition-all text-gray-900"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Methods Section (Defensive Check) */}
                <div className="space-y-3 pt-1">
                  <label className="text-xs font-black text-gray-700 block">
                    اختر طريقة دفع من طرق الدفع الخاصة بك
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loadingPaymentInfos ? (
                      /* Loading skeleton for payment methods */
                      <div className="col-span-2 flex items-center gap-2 text-gray-400 py-4">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-xs font-bold">جاري تحميل طرق الدفع...</span>
                      </div>
                    ) : paymentInfos.length === 0 ? (
                      /* Empty state — no payment methods configured */
                      <div className="col-span-2 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                        لا توجد طرق دفع مضافة بعد. توجه إلى إعدادات الدفع لإضافة حساباتك.
                      </div>
                    ) : (
                      /* Dynamic payment method cards from instructor_receiver_accounts */
                      paymentInfos.map((info) => {
                        const idStr = String(info.id);
                        const isSelected = safePaymentMethods.includes(idStr);
                        return (
                          <div
                            key={info.id}
                            onClick={() => togglePaymentMethod(idStr)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                              isSelected
                                ? 'border-blue-600 bg-white shadow-sm'
                                : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-300'
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {info.logo ? (
                                <img
                                  src={info.logo}
                                  alt={info.name}
                                  className="h-7 w-auto object-contain rounded"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              ) : null}
                              <span className="text-sm font-black text-gray-700">{info.name}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Download Policy Card */}
              <div className="bg-white rounded-3xl p-6 lg:p-7 border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Download size={20} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">
                    سياسة التحميل
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Unlimited Downloads */}
                  <div
                    onClick={() =>
                      setFormData({ ...formData, downloadPolicy: 'unlimited' })
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      (formData.downloadPolicy || 'unlimited') === 'unlimited'
                        ? 'border-blue-600 bg-blue-50/30 shadow-sm'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-gray-900">
                        تحميل غير محدود
                      </h4>
                      <p className="text-xs font-bold text-gray-400">
                        يسمح للطالب بالتحميل دائما
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        (formData.downloadPolicy || 'unlimited') === 'unlimited'
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {(formData.downloadPolicy || 'unlimited') === 'unlimited' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Limited Downloads */}
                  <div
                    onClick={() =>
                      setFormData({ ...formData, downloadPolicy: 'limited' })
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      formData.downloadPolicy === 'limited'
                        ? 'border-blue-600 bg-blue-50/30 shadow-sm'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-gray-900">
                        عدد مرات تحميل محدد
                      </h4>
                      <p className="text-xs font-bold text-gray-400">
                        تقييد الطالب بعدد تحميل معين
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.downloadPolicy === 'limited'
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {formData.downloadPolicy === 'limited' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Extra Limited Download Controls */}
                {formData.downloadPolicy === 'limited' && (
                  <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                    <input
                      type="number"
                      min="0"
                      value={formData.downloadLimit || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          downloadLimit: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-center text-sm font-black outline-none focus:border-blue-500 transition-all text-gray-900"
                    />

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-700 block">
                        اختر فترة انتهاء صلاحية عدد التحميلات
                      </label>
                      <div className="relative">
                        <select
                          value={formData.downloadExpiry || 'never'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              downloadExpiry: e.target.value,
                            })
                          }
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 pr-4 pl-12 text-sm font-bold outline-none focus:border-blue-500 appearance-none text-gray-900 cursor-pointer"
                        >
                          <option value="never">بلا تاريخ انتهاء</option>
                          <option value="30_days">30 يوماً</option>
                          <option value="60_days">60 يوماً</option>
                          <option value="1_year">سنة كاملة</option>
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600 bg-blue-50 p-1.5 rounded-lg">
                          <Calendar size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Visibility Settings Card */}
              <div className="bg-white rounded-3xl p-6 lg:p-7 border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Eye size={20} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">
                    اعدادات الظهور
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    onClick={() =>
                      setFormData({ ...formData, visibility: 'published' })
                    }
                    className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center text-center space-y-2 transition-all ${
                      (formData.visibility || 'published') === 'published'
                        ? 'border-blue-600 bg-white text-blue-600 shadow-sm'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <Share2 size={24} />
                    <span className="text-sm font-black">منشور</span>
                  </div>

                  <div
                    onClick={() =>
                      setFormData({ ...formData, visibility: 'draft' })
                    }
                    className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center text-center space-y-2 transition-all ${
                      formData.visibility === 'draft'
                        ? 'border-blue-600 bg-white text-blue-600 shadow-sm'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <FileText size={24} />
                    <span className="text-sm font-black">مسودة</span>
                  </div>

                  <div
                    onClick={() =>
                      setFormData({ ...formData, visibility: 'hidden' })
                    }
                    className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center text-center space-y-2 transition-all ${
                      formData.visibility === 'hidden'
                        ? 'border-blue-600 bg-white text-blue-600 shadow-sm'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <EyeOff size={24} />
                    <span className="text-sm font-black">خفي</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Page Navigation Controls — outside the form to prevent accidental submit on step change */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-8 py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-black text-sm transition-all"
          >
            السابق
          </button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          /* type="button" prevents any accidental form submission */
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="px-10 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-200 transition-all"
          >
            التالي
          </button>
        ) : (
          /* Publish button — calls handleSaveBag directly, not via form submit */
          <button
            type="button"
            onClick={handleSaveBag}
            disabled={isSaving}
            className="px-12 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-black text-base shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <span>انشر</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
