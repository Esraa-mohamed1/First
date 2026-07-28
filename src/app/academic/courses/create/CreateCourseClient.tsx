'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
  Plus,
  Video,
  FileText,
  Monitor,
  Trash2,
  Landmark,
  Check,
  User as UserIcon,
  Loader2,
  Share2,
  Copy,
  Save,
  Send,
  HelpCircle,
  Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createCourse, createUnit, getCategories, getCourse, updateCourse, createCategory } from '@/services/courses';
import { getProfileStatus } from '@/services/auth';
import { getUsers } from '@/services/users';
import { User } from '@/types/api';
import AddLessonModal from '@/components/Academic/Modals/AddLessonModal';
import { PaymentMethodDropdown } from '@/components/payment/PaymentMethodDropdown';
import { AcademyPaymentMethod, PaymentMethod } from '@/types/payment';
import { getUserPaymentInfos, UserPaymentInfo } from '@/services/finance';

const MySwal = withReactContent(Swal);

// --- Inline Form Component for Category ---
const CategoryFormInline = ({
  onSubmit,
  errors,
  isSubmitting,
  onClose,
}: {
  onSubmit: (payload: any) => Promise<void>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('يرجى إدخال اسم الفئة');
      return;
    }
    onSubmit({ name, is_active: isActive ? 1 : 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-800 text-right pr-1">
          اسم الفئة <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: التصوير الفوتوغرافي، البرمجة..."
          className={`w-full p-4 bg-slate-50 border ${errors.name ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10'} rounded-xl outline-none focus:bg-white font-medium text-right transition-all text-slate-900`}
          autoFocus
        />
        {errors.name && (
          <p className="flex items-center gap-1 text-red-500 text-xs font-bold px-1 mt-1">
            <X size={12} />
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            <Check size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">حالة الفئة</p>
            <p className="text-xs font-medium text-slate-500">{isActive ? 'الفئة نشطة وستظهر للطلاب' : 'الفئة غير نشطة ولن تظهر'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`w-14 h-8 rounded-full transition-all relative ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${isActive ? 'right-7' : 'right-1'}`} />
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Check size={20} />
              <span>إضافة الفئة</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-6 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};

export default function CreateCourseClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseTypeParam = searchParams.get('type');

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'pricing' | 'subscribers' | 'settings'>('info');

  const [courseId, setCourseId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [academyPaymentMethods, setAcademyPaymentMethods] = useState<UserPaymentInfo[]>([]);

  // Course Basic Information
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('design-basics');
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [coachName, setCoachName] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<number | null>(null);
  const [instructors, setInstructors] = useState<User[]>([]);

  // Academic Classification
  const [gradeLevel, setGradeLevel] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [academicYear, setAcademicYear] = useState('2026 / 2027');

  // Learning Outcomes & Target Audience
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(['فهم مبادئ الألوان وتناسقها', '']);
  const [targetAudience, setTargetAudience] = useState<string[]>(['الطلاب والراغبين في دخول مجال التصميم']);

  // Thumbnail Image
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pricing & Currency
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('paid');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [price, setPrice] = useState('100');
  const [currency, setCurrency] = useState<'EGP' | 'SAR' | 'USD'>('EGP');
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [discountPrice, setDiscountPrice] = useState('');
  const [discountEndDate, setDiscountEndDate] = useState('');

  // Access Duration
  const [accessDurationType, setAccessDurationType] = useState<'lifetime' | 'days' | 'until_date'>('lifetime');
  const [accessDays, setAccessDays] = useState('');
  const [accessUntilDate, setAccessUntilDate] = useState('');

  // Payment Methods
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<AcademyPaymentMethod[]>([]);

  // Content / Units state
  const [units, setUnits] = useState<any[]>([]);
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentUnitForLesson, setCurrentUnitForLesson] = useState<number | null>(null);
  const [collapsedUnits, setCollapsedUnits] = useState<Record<number, boolean>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const DRAFT_CACHE_KEY = 'darb_create_course_draft_cache';
  const DRAFT_EXPIRY_MS = 7 * 60 * 1000; // 7 minutes

  // Helper to re-get units list from backend
  const refreshUnits = async (idToFetch?: number | null) => {
    const id = idToFetch || courseId;
    if (!id) return;
    try {
      const data: any = await getCourse(id);
      const fetchedUnits = data.chapters || data.units || [];
      setUnits(fetchedUnits);
    } catch (err) {
      console.error('Failed to reget units:', err);
    }
  };

  // 1. Load draft from localStorage on mount if within 7 minutes
  useEffect(() => {
    try {
      const cachedStr = localStorage.getItem(DRAFT_CACHE_KEY);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        const now = Date.now();
        if (cached.timestamp && now - cached.timestamp < DRAFT_EXPIRY_MS) {
          if (cached.title) setTitle(cached.title);
          if (cached.slug) setSlug(cached.slug);
          if (cached.category) setCategory(cached.category);
          if (cached.shortDescription) setShortDescription(cached.shortDescription);
          if (cached.description) setDescription(cached.description);
          if (cached.gradeLevel) setGradeLevel(cached.gradeLevel);
          if (cached.semester) setSemester(cached.semester);
          if (cached.subject) setSubject(cached.subject);
          if (cached.academicYear) setAcademicYear(cached.academicYear);
          if (cached.learningOutcomes) setLearningOutcomes(cached.learningOutcomes);
          if (cached.targetAudience) setTargetAudience(cached.targetAudience);
          if (cached.pricingType) setPricingType(cached.pricingType);
          if (cached.price) setPrice(cached.price);
          if (cached.currency) setCurrency(cached.currency);
          if (typeof cached.isDiscounted === 'boolean') setIsDiscounted(cached.isDiscounted);
          if (cached.discountPrice) setDiscountPrice(cached.discountPrice);
          if (cached.discountEndDate) setDiscountEndDate(cached.discountEndDate);
          if (cached.accessDurationType) setAccessDurationType(cached.accessDurationType);
          if (cached.accessDays) setAccessDays(cached.accessDays);
          if (cached.accessUntilDate) setAccessUntilDate(cached.accessUntilDate);
          if (cached.courseId) setCourseId(cached.courseId);
          if (cached.units && Array.isArray(cached.units)) setUnits(cached.units);
          toast.success('تم استعادة بيانات المسودة المحفوظة مؤقتاً');
        } else {
          localStorage.removeItem(DRAFT_CACHE_KEY);
        }
      }
    } catch (err) {
      console.error('Error restoring draft:', err);
    }
  }, []);

  // 2. Save draft to localStorage whenever form state changes
  useEffect(() => {
    if (!title && !category && !description && !price && !courseId) return;

    const draft = {
      timestamp: Date.now(),
      title,
      slug,
      category,
      shortDescription,
      description,
      gradeLevel,
      semester,
      subject,
      academicYear,
      learningOutcomes,
      targetAudience,
      pricingType,
      price,
      currency,
      isDiscounted,
      discountPrice,
      discountEndDate,
      accessDurationType,
      accessDays,
      accessUntilDate,
      courseId,
      units,
    };

    try {
      localStorage.setItem(DRAFT_CACHE_KEY, JSON.stringify(draft));
    } catch (err) {
      console.error('Error caching draft:', err);
    }
  }, [
    title,
    slug,
    category,
    shortDescription,
    description,
    gradeLevel,
    semester,
    subject,
    academicYear,
    learningOutcomes,
    targetAudience,
    pricingType,
    price,
    currency,
    isDiscounted,
    discountPrice,
    discountEndDate,
    accessDurationType,
    accessDays,
    accessUntilDate,
    courseId,
    units,
  ]);

  const activeMethods: PaymentMethod[] = academyPaymentMethods.map((m) => ({
    id: m.id.toString(),
    name: `${m.name} (${m.currency})`,
    type: 'account_number' as const,
    icon: 'credit-card',
    logo: m.logo,
    isActive: true,
    currency: m.currency,
  }));

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cats, profile, paymentInfos] = await Promise.all([
          getCategories(),
          getProfileStatus(),
          getUserPaymentInfos(),
        ]);
        setCategories(cats);
        setAcademyPaymentMethods(paymentInfos || []);

        const userData = profile.data || profile;
        if (userData) {
          setCurrentUser(userData);
          if (userData.role === 'instructor') {
            setCoachName(userData.name || userData.fullName || '');
            setSelectedInstructor(userData.id);
          } else {
            setCoachName('');
            setSelectedInstructor(null);
          }
          if (userData.role === 'admin' || userData.role === 'academy') {
            const coaches = await getUsers('academy');
            setInstructors(coaches);
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddLearningOutcome = () => {
    setLearningOutcomes([...learningOutcomes, '']);
  };

  const handleUpdateLearningOutcome = (index: number, val: string) => {
    const updated = [...learningOutcomes];
    updated[index] = val;
    setLearningOutcomes(updated);
  };

  const handleRemoveLearningOutcome = (index: number) => {
    const updated = learningOutcomes.filter((_, i) => i !== index);
    setLearningOutcomes(updated.length > 0 ? updated : ['']);
  };

  const handleAddTargetAudience = () => {
    setTargetAudience([...targetAudience, '']);
  };

  const handleUpdateTargetAudience = (index: number, val: string) => {
    const updated = [...targetAudience];
    updated[index] = val;
    setTargetAudience(updated);
  };

  const handleRemoveTargetAudience = (index: number) => {
    const updated = targetAudience.filter((_, i) => i !== index);
    setTargetAudience(updated.length > 0 ? updated : ['']);
  };

  const calculateReadiness = () => {
    let score = 0;
    if (title) score += 20;
    if (category) score += 15;
    if (description || shortDescription) score += 15;
    if (previewUrl || selectedFile) score += 10;
    if (learningOutcomes.some((l) => l.trim() !== '')) score += 15;
    if (price || pricingType === 'free') score += 15;
    if (units.length > 0) score += 10;
    return Math.min(100, score);
  };

  const mapTypeToBackend = (type: string | null | undefined): string => {
    if (!type) return 'recorded';
    const t = type.toLowerCase().trim();
    if (t === 'live-online' || t === 'online') return 'online';
    if (t === 'in-person' || t === 'physical' || t === 'offline') return 'physical';
    return 'recorded';
  };

  const ensureCourseCreated = async (overriddenStatus?: string) => {
    if (courseId && !overriddenStatus) return courseId;

    if (!title.trim()) {
      toast.error('يرجى إدخال اسم الدورة أولاً');
      throw new Error('Missing course title');
    }

    let userId = currentUser?.id || 2;
    if (selectedInstructor) userId = selectedInstructor;

    const targetStatus = overriddenStatus || status;

    const payload: any = {
      title,
      category_id: category || undefined,
      description: description || shortDescription,
      user_id: userId,
      who_is_this_for: shortDescription || (targetAudience.filter(Boolean).join('، ')),
      price: pricingType === 'free' ? 0 : Number(price || 0),
      final_price: pricingType === 'free' ? 0 : isDiscounted && discountPrice ? Number(discountPrice) : Number(price || 0),
      status: targetStatus,
      coach: coachName || currentUser?.name || '',
      receiver_accounts: selectedPaymentMethods.map((m: any) => Number(m.methodId)),
      type: mapTypeToBackend(courseTypeParam),
      price_type: pricingType,
      currency,
      image: selectedFile || undefined,
    };

    let infoIndex = 0;
    learningOutcomes.filter((p) => p.trim() !== '').forEach((point, pointIndex) => {
      payload[`infos[${infoIndex}][key]`] = 'what_you_will_learn';
      payload[`infos[${infoIndex}][value]`] = point;
      payload[`infos[${infoIndex}][order]`] = pointIndex + 1;
      infoIndex++;
    });

    try {
      if (courseId) {
        await updateCourse(courseId, payload);
        toast.success('تم تحديث بيانات الدورة بنجاح');
        return courseId;
      } else {
        const created = await createCourse(payload);
        setCourseId(created.id);
        toast.success('تم حفظ الدورة بنجاح');
        return created.id;
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'حدث خطأ أثناء حفظ الدورة');
      throw error;
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await ensureCourseCreated('draft');
    } catch (err) {
      // Handled inside
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      await ensureCourseCreated('published');
      setStatus('published');
      toast.success('تم نشر الدورة بنجاح!');
    } catch (err) {
      // Handled inside
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateInlineCategory = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const newCat = await createCategory(payload);
      setCategories((prev) => [...prev, newCat]);
      setCategory(newCat.id.toString());
      setIsAddingCategory(false);
      toast.success('تم إضافة الفئة بنجاح');
    } catch (err: any) {
      toast.error(err?.message || 'فشل إضافة الفئة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const basePriceNum = parseFloat(price) || 0;
  const discountPriceNum = parseFloat(discountPrice) || 0;
  const effectivePrice = pricingType === 'free' ? 0 : (isDiscounted && discountPriceNum > 0 ? discountPriceNum : basePriceNum);
  const commission = effectivePrice * 0.05;
  const netProfit = effectivePrice - commission;

  return (
    <div className="flex min-h-screen text-slate-900 bg-[#F8FAFC] font-sans antialiased" dir="rtl">
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Persistent Top Header */}
        <header className="h-auto bg-white/95 backdrop-blur-md border-b border-slate-300 sticky top-0 z-40 px-6 py-4 shadow-xs transition-all">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:shadow-md transition-all shrink-0 group relative"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 text-3xl transition-colors">add_photo_alternate</span>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {title || 'أساسيات التصميم الجرافيكي للمبتدئين'}
                  </h2>
                  <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-300 text-xs rounded-full text-slate-600 font-semibold">
                    {courseTypeParam === 'live-online' ? 'بث مباشر' : courseTypeParam === 'in-person' ? 'حضورية' : 'مسجلة'}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="material-symbols-outlined text-base text-slate-400">pending_actions</span>
                    الحالة: {status === 'published' ? 'منشورة' : 'مسودة'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-300 p-0.5">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${calculateReadiness()}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">جاهزية {calculateReadiness()}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => {
                  if (courseId) {
                    router.push(`/academic/courses/${courseId}/student`);
                  } else {
                    toast.error('يرجى حفظ الدورة أولاً للمعاينة');
                  }
                }}
                className="px-4 py-2.5 text-sm border border-slate-300 rounded-xl flex items-center gap-2 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-xs active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl">visibility</span>
                معاينة
              </button>
              <button
                onClick={() => {
                  if (navigator.clipboard && courseId) {
                    navigator.clipboard.writeText(`${window.location.origin}/courses/${courseId}`);
                    toast.success('تم نسخ رابط الدورة بنجاح');
                  } else {
                    toast.error('احفظ الدورة أولاً للمشاركة');
                  }
                }}
                className="px-4 py-2.5 text-sm border border-slate-300 rounded-xl flex items-center gap-2 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-xs active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl">share</span>
                مشاركة
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-xs disabled:opacity-50 active:scale-[0.98]"
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 active:scale-[0.98]"
              >
                نشر الدورة
              </button>
            </div>
          </div>
        </header>

        {/* Sticky Tabs */}
        <nav className="bg-white/95 backdrop-blur-md border-b border-slate-300 sticky top-[73px] z-30">
          <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('info')}
                className={`relative py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === 'info' ? 'text-blue-600 tab-active' : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                المعلومات الأساسية
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`relative py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === 'content' ? 'text-blue-600 tab-active' : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                محتوى الدورة
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`relative py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === 'pricing' ? 'text-blue-600 tab-active' : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                التسويق والبيع
              </button>
              <button
                onClick={() => setActiveTab('subscribers')}
                className={`relative py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === 'subscribers' ? 'text-blue-600 tab-active' : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                المشتركون والتقارير
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`relative py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === 'settings' ? 'text-blue-600 tab-active' : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                الإعدادات
              </button>
            </div>
          </div>
        </nav>

        {/* Page Content Grid */}
        <div className="max-w-7xl mx-auto w-full px-6 py-8">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12 space-y-8">
                {/* Section 1: Definition */}
                <section className="bg-white border border-slate-300 rounded-2xl p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        info
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">تعريف الدورة</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">أدخل التفاصيل الرئيسية والمعلومات الأساسية للدورة</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* 1. Course Name */}
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-800">
                        اسم الدورة <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-900 font-medium"
                        type="text"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (!isEditingSlug) {
                            setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
                          }
                        }}
                        placeholder="أدخل اسم الدورة..."
                      />
                    </div>

                    {/* Course Link (Slug) Section */}
                    <div className="bg-slate-50 border border-slate-300 p-4.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="material-symbols-outlined text-lg text-slate-400">link</span>
                          {isEditingSlug ? (
                            <input
                              type="text"
                              value={slug}
                              onChange={(e) => setSlug(e.target.value)}
                              onBlur={() => setIsEditingSlug(false)}
                              className="px-3 py-1 border border-slate-300 rounded-lg text-sm outline-none font-mono bg-white"
                              autoFocus
                            />
                          ) : (
                            <span className="text-sm font-mono text-blue-600 font-bold select-all" dir="ltr">
                              darb.edu/courses/{slug || 'design-basics'}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsEditingSlug(!isEditingSlug)}
                            className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            {isEditingSlug ? 'حفظ' : 'تعديل'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">هذا هو الرابط العام الذي سيتم نشره، اضغط للتعديل.</p>
                      </div>
                    </div>

                    {/* 2. Thumbnail & Short Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="order-2 md:order-2">
                        <label className="block text-sm font-bold mb-2 text-slate-800">الصورة التعريفية (Thumbnail)</label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl h-28 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer group"
                        >
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 text-3xl transition-colors">add_photo_alternate</span>
                          <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600 mt-1 transition-colors">اضغط لرفع صورة أو اسحبها هنا</span>
                        </div>
                      </div>
                      <div className="order-1 md:order-1">
                        <label className="block text-sm font-bold mb-2 text-slate-800">الوصف المختصر</label>
                        <textarea
                          value={shortDescription}
                          onChange={(e) => setShortDescription(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all h-28 resize-none text-slate-900 text-sm font-medium"
                          placeholder="اكتب وصفاً موجزاً يظهر في بطاقة الدورة..."
                        ></textarea>
                      </div>
                    </div>

                    {/* 3. Full Description */}
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-800">الوصف الكامل للدورة</label>
                      <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-2xs">
                        <div className="bg-slate-50 p-2.5 border-b border-slate-300 flex gap-2">
                          <button type="button" className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors">
                            <span className="material-symbols-outlined text-xl">format_bold</span>
                          </button>
                          <button type="button" className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors">
                            <span className="material-symbols-outlined text-xl">format_italic</span>
                          </button>
                          <button type="button" className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors">
                            <span className="material-symbols-outlined text-xl">format_list_bulleted</span>
                          </button>
                          <button type="button" className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors">
                            <span className="material-symbols-outlined text-xl">link</span>
                          </button>
                        </div>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-3.5 outline-none min-h-[160px] border-none focus:ring-0 text-slate-900 text-sm font-medium"
                          placeholder="اشرح بالتفصيل ماذا سيتعلم الطالب..."
                        ></textarea>
                      </div>
                    </div>

                    {/* 4. Course Category */}
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-800">
                        تصنيف الدورة <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2.5">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-900 text-sm font-medium bg-white"
                        >
                          <option value="">اختر التصنيف...</option>
                          {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(true)}
                          className="p-3 bg-slate-100 border border-slate-300 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700"
                        >
                          <span className="material-symbols-outlined text-xl">add</span>
                        </button>
                      </div>
                    </div>

                    {isAddingCategory && (
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-300">
                        <CategoryFormInline
                          onSubmit={handleCreateInlineCategory}
                          errors={{}}
                          isSubmitting={isSubmitting}
                          onClose={() => setIsAddingCategory(false)}
                        />
                      </div>
                    )}
                  </div>
                </section>

                {/* Section 2: Academic Classification */}
                <section className="bg-white border border-slate-300 rounded-2xl p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        school
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">التصنيف الدراسي</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">حدد الصف والفصل والمادة الدراسية للمجموعة</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-800">الصف الدراسي</label>
                      <select
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-sm text-slate-900 font-medium bg-white"
                      >
                        <option value="">اختر الصف...</option>
                        <option value="first_sec">أولى ثانوي</option>
                        <option value="second_sec">ثانية ثانوي</option>
                        <option value="third_sec">ثالثة ثانوي</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-800">الفصل الدراسي</label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-sm text-slate-900 font-medium bg-white"
                      >
                        <option value="">اختر الترم...</option>
                        <option value="term_1">الترم الأول</option>
                        <option value="term_2">الترم الثاني</option>
                        <option value="full_year">العام الدراسي كامل</option>
                        <option value="final_review">مراجعة نهائية</option>
                        <option value="not_linked">غير مرتبط بترم</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-800">المادة</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-sm text-slate-900 font-medium bg-white"
                      >
                        <option value="">اختر المادة...</option>
                        <option value="physics">فيزياء</option>
                        <option value="chemistry">كيمياء</option>
                        <option value="math">رياضيات</option>
                        <option value="biology">أحياء</option>
                        <option value="arabic">عربي</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-800">العام الدراسي</label>
                      <select
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-sm text-slate-900 font-medium bg-white"
                      >
                        <option value="2026/2027">2026 / 2027</option>
                        <option value="2025/2026">2025 / 2026</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Section 3: Learning Details */}
                <section className="bg-white border border-slate-300 rounded-2xl p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        checklist
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">تفاصيل التعلم</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">حدد المخرجات التعليمية والفئة المستهدفة لهذه الدورة</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Learning Outcomes */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-slate-800">ماذا سيتعلم الطالب؟ (مخرجات التعلم)</label>
                        <button
                          type="button"
                          onClick={handleAddLearningOutcome}
                          className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
                        >
                          <span className="material-symbols-outlined text-lg">add</span> إضافة مخرج
                        </button>
                      </div>

                      <div className="space-y-3">
                        {learningOutcomes.map((item, idx) => (
                          <div key={idx} className="flex gap-2.5">
                            <input
                              className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 font-medium"
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateLearningOutcome(idx, e.target.value)}
                              placeholder="أدخل مخرجاً تعليمياً..."
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveLearningOutcome(idx)}
                              className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target Audience */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-slate-800">الفئة المستهدفة</label>
                        <button
                          type="button"
                          onClick={handleAddTargetAudience}
                          className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
                        >
                          <span className="material-symbols-outlined text-lg">add</span> إضافة فئة
                        </button>
                      </div>

                      <div className="space-y-3">
                        {targetAudience.map((item, idx) => (
                          <div key={idx} className="flex gap-2.5">
                            <input
                              className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 font-medium"
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateTargetAudience(idx, e.target.value)}
                              placeholder="أدخل الفئة المستهدفة..."
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveTargetAudience(idx)}
                              className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 4: Pricing */}
                <section className="bg-white border border-slate-300 rounded-2xl p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] transition-all duration-300 overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        payments
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">التسعير</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">حدد خطة السعر والخصومات وعمولة المنصة</p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      {/* Type Segment */}
                      <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-300 w-fit">
                        <button
                          type="button"
                          onClick={() => setPricingType('free')}
                          className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            pricingType === 'free' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                          }`}
                        >
                          مجانية
                        </button>
                        <button
                          type="button"
                          onClick={() => setPricingType('paid')}
                          className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            pricingType === 'paid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                          }`}
                        >
                          مدفوعة
                        </button>
                      </div>

                      {pricingType === 'paid' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold mb-2 text-slate-800">السعر الأساسي</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                  placeholder="0.00"
                                  className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-16 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 text-slate-900 font-medium text-sm"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 text-xs pointer-events-none font-bold">
                                  {currency}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-bold mb-2 text-slate-800">العملة</label>
                              <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as any)}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none text-sm text-slate-900 font-medium bg-white"
                              >
                                <option value="EGP">EGP — جنيه مصري</option>
                                <option value="SAR">SAR — ريال سعودي</option>
                                <option value="USD">USD — دولار أمريكي</option>
                              </select>
                            </div>
                          </div>

                          {/* Discount Toggle */}
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-300">
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-blue-600">sell</span>
                              <div>
                                <p className="text-sm font-bold text-slate-900">تفعيل الخصم</p>
                                <p className="text-xs text-slate-500 font-medium">حدد سعراً مخفضاً لفترة زمنية</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isDiscounted}
                                onChange={(e) => setIsDiscounted(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          {isDiscounted && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                              <div>
                                <label className="block text-sm font-bold mb-2 text-slate-800">سعر الخصم</label>
                                <input
                                  type="number"
                                  value={discountPrice}
                                  onChange={(e) => setDiscountPrice(e.target.value)}
                                  placeholder="0.00"
                                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold mb-2 text-slate-800">ينتهي في</label>
                                <input
                                  type="date"
                                  value={discountEndDate}
                                  onChange={(e) => setDiscountEndDate(e.target.value)}
                                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price Preview Card */}
                    <div className="w-full lg:w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-7 shadow-xl shadow-slate-900/10 border border-slate-700 flex flex-col items-center justify-center text-center">
                      <p className="text-xs text-slate-400 font-medium mb-3">معاينة السعر للمشترك</p>
                      <div>
                        {pricingType === 'free' ? (
                          <h4 className="text-3xl font-bold text-emerald-400">مجاناً</h4>
                        ) : isDiscounted && discountPriceNum > 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="text-xs line-through text-slate-400 mb-1">{basePriceNum} {currency}</span>
                            <h4 className="text-3xl font-bold text-emerald-400">{discountPriceNum} {currency}</h4>
                          </div>
                        ) : (
                          <h4 className="text-3xl font-bold text-emerald-400">{basePriceNum} {currency}</h4>
                        )}
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-700/80 w-full space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                          <span>عمولة المنصة (5%)</span>
                          <span>{commission.toFixed(2)} {currency}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold text-white pt-1">
                          <span>صافي ربحك</span>
                          <span className="text-emerald-400 font-extrabold">{netProfit.toFixed(2)} {currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: Access Duration */}
                <section className="bg-white border border-slate-300 rounded-2xl p-7 sm:p-9 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] transition-all duration-300">
                  <div className="flex items-center gap-3.5 mb-7">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-xs">
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        history
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">مدة الوصول</h3>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">حدد صلاحية دخول الطالب للمحتوى التعليمي لهذه الدورة</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Option 1: Lifetime */}
                    <label
                      onClick={() => setAccessDurationType('lifetime')}
                      className={`relative flex items-center gap-4 p-5 sm:p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        accessDurationType === 'lifetime'
                          ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name="access_duration"
                        checked={accessDurationType === 'lifetime'}
                        onChange={() => setAccessDurationType('lifetime')}
                        className="w-6 h-6 text-blue-600 accent-blue-600 cursor-pointer shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-base sm:text-lg font-bold text-slate-900">مدى الحياة</span>
                        <span className="text-xs text-slate-500 font-medium mt-0.5">وصول دائم ودون حد زمني</span>
                      </div>
                    </label>

                    {/* Option 2: Subscription Days */}
                    <label
                      onClick={() => setAccessDurationType('days')}
                      className={`relative flex items-center gap-4 p-5 sm:p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        accessDurationType === 'days'
                          ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name="access_duration"
                        checked={accessDurationType === 'days'}
                        onChange={() => setAccessDurationType('days')}
                        className="w-6 h-6 text-blue-600 accent-blue-600 cursor-pointer shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-base sm:text-lg font-bold text-slate-900">عدد أيام من الاشتراك</span>
                        <span className="text-xs text-slate-500 font-medium mt-0.5">صلاحية محددة بعدد أيام</span>
                      </div>
                    </label>

                    {/* Option 3: Until Specific Date */}
                    <label
                      onClick={() => setAccessDurationType('until_date')}
                      className={`relative flex items-center gap-4 p-5 sm:p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        accessDurationType === 'until_date'
                          ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name="access_duration"
                        checked={accessDurationType === 'until_date'}
                        onChange={() => setAccessDurationType('until_date')}
                        className="w-6 h-6 text-blue-600 accent-blue-600 cursor-pointer shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-base sm:text-lg font-bold text-slate-900">حتى تاريخ محدد</span>
                        <span className="text-xs text-slate-500 font-medium mt-0.5">ينتهي صلاحية الوصول بتاريخ محدد</span>
                      </div>
                    </label>
                  </div>

                  {accessDurationType === 'days' && (
                    <div className="mt-6 max-w-sm bg-slate-50 p-5 rounded-2xl border border-slate-300 animate-in fade-in duration-300">
                      <label className="block text-sm font-bold mb-2 text-slate-800">عدد الأيام المتاحة للوصول</label>
                      <input
                        type="number"
                        value={accessDays}
                        onChange={(e) => setAccessDays(e.target.value)}
                        placeholder="مثال: 365"
                        className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base outline-none font-bold text-slate-900 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  )}

                  {accessDurationType === 'until_date' && (
                    <div className="mt-6 max-w-sm bg-slate-50 p-5 rounded-2xl border border-slate-300 animate-in fade-in duration-300">
                      <label className="block text-sm font-bold mb-2 text-slate-800">التاريخ الأخير للوصول</label>
                      <input
                        type="date"
                        value={accessUntilDate}
                        onChange={(e) => setAccessUntilDate(e.target.value)}
                        className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base outline-none font-bold text-slate-900 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {/* Tab 2: Course Content (Units & Lessons - Curriculum Builder) */}
          {activeTab === 'content' && (
            <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">بناء المنهج الدراسي</h2>
                  <p className="text-slate-500 text-sm font-medium mt-0.5">قم بتنظيم محتوى دورتك في وحدات ودروس تفاعلية</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      // Expand All
                      setCollapsedUnits({});
                    }}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-300"
                    title="توسيع الكل"
                  >
                    <span className="material-symbols-outlined text-xl">expand_all</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Collapse All
                      const collapsed: Record<number, boolean> = {};
                      units.forEach((u: any) => {
                        collapsed[u.id] = true;
                      });
                      setCollapsedUnits(collapsed);
                    }}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-300"
                    title="طوي الكل"
                  >
                    <span className="material-symbols-outlined text-xl">compress</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingUnit(true)}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-xl">add</span>
                    <span>إضافة وحدة جديدة</span>
                  </button>
                </div>
              </div>

              {/* Add Unit Inline Form */}
              {isAddingUnit && (
                <div className="p-5 bg-slate-50 rounded-2xl border-2 border-blue-500 mb-6 flex flex-col sm:flex-row gap-3 items-center animate-in fade-in duration-300 shadow-md">
                  <input
                    type="text"
                    value={newUnitTitle}
                    onChange={(e) => setNewUnitTitle(e.target.value)}
                    placeholder="عنوان الوحدة الجديد..."
                    className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none bg-white font-bold text-slate-900 focus:border-blue-600 w-full"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!newUnitTitle.trim()) return;
                        const id = await ensureCourseCreated();
                        await createUnit({ course_id: id, title: newUnitTitle, description: '', order: units.length + 1 });
                        await refreshUnits(id);
                        setNewUnitTitle('');
                        setIsAddingUnit(false);
                      }}
                      className="px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm"
                    >
                      حفظ الوحدة
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingUnit(false)}
                      className="px-5 py-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {/* Units List */}
              {units.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
                    <span className="material-symbols-outlined text-4xl">auto_stories</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">لا توجد وحدات تعليمية حتى الآن</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6">ابدأ ببناء منهج دورتك عن طريق إضافة وحدات ودروس تفاعلية.</p>
                  <button
                    type="button"
                    onClick={() => setIsAddingUnit(true)}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm inline-flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                  >
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>إضافة وحدة جديدة</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {units.map((unit: any, idx: number) => {
                    const isCollapsed = collapsedUnits[unit.id];
                    const lessonsList = unit.lessons || [];

                    return (
                      <div key={unit.id} className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                        {/* Unit Header */}
                        <div
                          onClick={() => {
                            setCollapsedUnits((prev) => ({
                              ...prev,
                              [unit.id]: !prev[unit.id],
                            }));
                          }}
                          className="bg-slate-50 px-5 py-4 flex items-center justify-between border-b border-slate-300 cursor-pointer group hover:bg-slate-100/80 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-slate-400 cursor-grab opacity-40 group-hover:opacity-100 transition-opacity">
                              drag_indicator
                            </span>
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-sm shrink-0">
                              {idx + 1}
                            </div>
                            <div>
                              <h3 className="font-bold text-base text-slate-900">
                                الوحدة {idx + 1}: {unit.title}
                              </h3>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {lessonsList.length} دروس • مدة إجمالية: {unit.duration || '١:٢٠ ساعة'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                // Action to edit unit
                                toast.success(`تعديل الوحدة: ${unit.title}`);
                              }}
                              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                              title="تعديل الوحدة"
                            >
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCollapsedUnits((prev) => ({
                                  ...prev,
                                  [unit.id]: !prev[unit.id],
                                }));
                              }}
                              className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                            >
                              <span className="material-symbols-outlined text-xl">
                                {isCollapsed ? 'expand_more' : 'expand_less'}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Unit Content (Lessons) */}
                        {!isCollapsed && (
                          <div className="divide-y divide-slate-200">
                            {lessonsList.length === 0 ? (
                              <div className="p-8 text-center bg-slate-50/50">
                                <p className="text-sm font-medium text-slate-400 mb-3">لا توجد دروس داخل هذه الوحدة حتى الآن</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentUnitForLesson(unit.id);
                                    setIsLessonModalOpen(true);
                                  }}
                                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 border border-blue-200 transition-colors"
                                >
                                  + إضافة درس للوحدة
                                </button>
                              </div>
                            ) : (
                              lessonsList.map((lesson: any) => {
                                const lessonType = lesson.type || 'video';
                                return (
                                  <div
                                    key={lesson.id}
                                    className="lesson-row flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white hover:bg-slate-50/80 transition-colors gap-3"
                                  >
                                    <div className="flex items-center gap-3.5">
                                      <span className="material-symbols-outlined text-slate-400 opacity-40 drag-handle cursor-grab hover:opacity-100 transition-opacity">
                                        drag_indicator
                                      </span>

                                      {/* Icon according to lesson type */}
                                      {lessonType === 'quiz' ? (
                                        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shrink-0">
                                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            quiz
                                          </span>
                                        </div>
                                      ) : lessonType === 'article' || lessonType === 'text' ? (
                                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 shrink-0">
                                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            article
                                          </span>
                                        </div>
                                      ) : lessonType === 'task' || lessonType === 'assignment' ? (
                                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shrink-0">
                                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            task
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200/60 shrink-0">
                                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            play_circle
                                          </span>
                                        </div>
                                      )}

                                      <div>
                                        <p className="font-bold text-sm text-slate-900">{lesson.title}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                          <span className="text-[11px] text-slate-600 font-bold px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md">
                                            {lessonType === 'quiz'
                                              ? 'اختبار'
                                              : lessonType === 'article' || lessonType === 'text'
                                              ? 'ملف نصي'
                                              : lessonType === 'task'
                                              ? 'واجب منزلي'
                                              : 'فيديو'}
                                          </span>
                                          <span className="text-[11px] text-slate-500 font-medium">
                                            {lesson.duration || '١٢:٤٥ دقيقة'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 justify-end">
                                      {/* Free preview toggle */}
                                      <label className="relative inline-flex items-center cursor-pointer gap-2">
                                        <input type="checkbox" defaultChecked={lesson.is_free === 1} className="sr-only peer" />
                                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        <span className="text-xs font-bold text-slate-600">معاينة</span>
                                      </label>

                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCurrentUnitForLesson(unit.id);
                                            setIsLessonModalOpen(true);
                                          }}
                                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"
                                          title="تعديل الدرس"
                                        >
                                          <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                          type="button"
                                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                                          title="خيارات إضافية"
                                        >
                                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}

                            {/* Bottom Add Action with Dropdown Menu */}
                            <div className="p-3 bg-slate-50/70 flex justify-center border-t border-dashed border-slate-300 relative">
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentUnitForLesson(unit.id);
                                  setIsLessonModalOpen(true);
                                }}
                                className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors border border-blue-200/80 shadow-2xs"
                              >
                                <span className="material-symbols-outlined text-xl">add_circle</span>
                                <span>إضافة محتوى للوحدة</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Global Add Unit Button */}
                  <div className="flex justify-center pt-6">
                    <button
                      type="button"
                      onClick={() => setIsAddingUnit(true)}
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-blue-600 group-hover:text-blue-600 group-hover:bg-blue-50/50 transition-all shadow-xs">
                        <span className="material-symbols-outlined text-3xl">add</span>
                      </div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                        إضافة وحدة جديدة
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Marketing & Sales */}
          {activeTab === 'pricing' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white border border-slate-300 rounded-2xl p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">وسائل الدفع المقبولة</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">حدد حسابات استلام الأموال لهذه الدورة التدريبية</p>
                </div>
                <PaymentMethodDropdown
                  options={activeMethods}
                  selectedValues={selectedPaymentMethods.map((m) => m.methodId)}
                  onChange={(ids) => {
                    const newMethods = ids.map((id) => {
                      const existing = selectedPaymentMethods.find((m) => m.methodId === id);
                      if (existing) return existing;
                      const method = activeMethods.find((m) => m.id === id);
                      const originalInfo = academyPaymentMethods.find((m) => m.id.toString() === id);
                      return {
                        methodId: method?.id || id,
                        methodName: method?.name || '',
                        type: method?.type || 'account_number',
                        value: originalInfo?.accountValue || originalInfo?.account_value || '',
                        currency: originalInfo?.currency || 'SAR',
                        logo: method?.logo,
                      };
                    });
                    setSelectedPaymentMethods(newMethods);
                  }}
                />
              </div>
            </div>
          )}

          {/* Tab 4: Subscribers & Reports */}
          {activeTab === 'subscribers' && (
            <div className="max-w-4xl bg-white border border-slate-300 rounded-2xl p-10 text-center text-slate-500 shadow-xs">
              <h3 className="text-xl font-bold mb-2 text-slate-900">تقرير المشتركين والمبيعات</h3>
              <p className="text-sm font-medium">سيتم عرض قائمة الطلاب المشتركين والتقارير عند نشر الدورة وتلقي الاشتراكات.</p>
            </div>
          )}

          {/* Tab 5: Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl bg-white border border-slate-300 rounded-2xl p-10 text-center text-slate-500 shadow-xs">
              <h3 className="text-xl font-bold mb-2 text-slate-900">إعدادات الدورة المتقدمة</h3>
              <p className="text-sm font-medium">يمكنك هنا تخصيص إعدادات الأمان والتراخيص الخاصة بهذه الدورة.</p>
            </div>
          )}
        </div>
      </main>

      <AddLessonModal
        isOpen={isLessonModalOpen}
        onClose={() => {
          setIsLessonModalOpen(false);
          setCurrentUnitForLesson(null);
        }}
        unitId={currentUnitForLesson || 0}
        courseId={courseId || undefined}
        unitName={units.find((u) => u.id === currentUnitForLesson)?.title || ''}
        courseTitle={title}
        instructorName={currentUser?.name || ''}
        onLessonAdded={async () => {
          if (courseId) {
            await refreshUnits(courseId);
          }
        }}
        courseType={mapTypeToBackend(courseTypeParam)}
      />
    </div>
  );
}
