'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
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
  Pencil,
  Globe,
  MoreVertical,
  ExternalLink,
  ImagePlus,
  Clock,
  Info,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createCourse, createUnit, deleteUnit, getCategories, getCourse, getCourses, updateCourse, createCategory } from '@/services/courses';
import { getErrorMessage } from '@/lib/utils';
import { purgeAllCourseDraftCache } from '@/lib/auth-storage';
import { getGrades, getTerms, getSubjects, getAcademicYears, ClassificationItem } from '@/services/academic-classification';
import { getProfileStatus } from '@/services/auth';
import { getUsers } from '@/services/users';
import ManageSubscribersView from '@/components/Academic/Subscribers/ManageSubscribersView';
import { User, ReceiverAccount } from '@/types/api';
import AddLessonModal from '@/components/Academic/Modals/AddLessonModal';
import { PaymentMethodDropdown } from '@/components/payment/PaymentMethodDropdown';
import { AcademyPaymentMethod, PaymentMethod } from '@/types/payment';
import { getUserPaymentInfos, UserPaymentInfo, getReceiverAccounts, createUserPaymentInfo } from '@/services/finance';

import {
  getLandingPagesList,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage
} from '@/modules/landing/services/landing.api';
import { getTemplateDefaultContent } from '@/modules/landing/constants/defaultContent';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';
import TemplatePreviewModal from '@/modules/landing/components/TemplatePreviewModal';
import { useLandingStore } from '@/modules/landing/store/landingStore';
import { useLandingSave } from '@/modules/landing/hooks/useLandingSave';
// Section Editors - Template 1
import HeroEditor from '@/modules/landing/editor/HeroEditor';
import LearningEditor from '@/modules/landing/editor/LearningEditor';
import ChapterEditor from '@/modules/landing/editor/ChapterEditor';
import PaymentEditor from '@/modules/landing/editor/PaymentEditor';
import FAQEditor from '@/modules/landing/editor/FAQEditor';
import ReviewsEditor from '@/modules/landing/editor/ReviewsEditor';
import WhatsAppEditor from '@/modules/landing/editor/WhatsAppEditor';
import FooterEditor from '@/modules/landing/editor/FooterEditor';

// Section Editors - Template 2 (Modern)
import Template2HeroEditor from '@/modules/landing/editor/template2/Template2HeroEditor';
import Template2AboutEditor from '@/modules/landing/editor/template2/Template2AboutEditor';
import Template2FeaturesEditor from '@/modules/landing/editor/template2/Template2FeaturesEditor';
import Template2InstructorEditor from '@/modules/landing/editor/template2/Template2InstructorEditor';
import Template2BenefitsEditor from '@/modules/landing/editor/template2/Template2BenefitsEditor';
import Template2CtaEditor from '@/modules/landing/editor/template2/Template2CtaEditor';

// Section Editors - Template 3 (UI/UX / Academy)
import Template3HeroEditor from '@/modules/landing/editor/template3/Template3HeroEditor';
import Template3InstructorEditor from '@/modules/landing/editor/template3/Template3InstructorEditor';
import Template3PricingEditor from '@/modules/landing/editor/template3/Template3PricingEditor';



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
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'pricing' | 'landing_pages' | 'subscribers'>('info');

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

  // Academic Classification Options lists
  const [gradesList, setGradesList] = useState<ClassificationItem[]>([]);
  const [semestersList, setSemestersList] = useState<ClassificationItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<ClassificationItem[]>([]);
  const [academicYearsList, setAcademicYearsList] = useState<ClassificationItem[]>([]);

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

  // Custom landing pages states
  const [courseSlug, setCourseSlug] = useState<string>('');
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [loadingLandingPages, setLoadingLandingPages] = useState(false);
  const [previewLandingPageId, setPreviewLandingPageId] = useState<string | number | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [isCreateLandingModalOpen, setIsCreateLandingModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newSelectedTemplate, setNewSelectedTemplate] = useState('template_1');
  const [newCustomSlug, setNewCustomSlug] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isCreatingLanding, setIsCreatingLanding] = useState(false);

  const { saving, handleSave: saveLandingCustomizer } = useLandingSave();
  const activeSectionId = useLandingStore((state: any) => state.activeSectionId);
  const setActiveSectionId = useLandingStore((state: any) => state.setActiveSectionId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add payment method modal states
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPaymentTemplateId, setNewPaymentTemplateId] = useState('');
  const [newPaymentAccountValue, setNewPaymentAccountValue] = useState('');
  const [newPaymentCustomName, setNewPaymentCustomName] = useState('');
  const [isSavingNewPayment, setIsSavingNewPayment] = useState(false);
  const [receiverTemplates, setReceiverTemplates] = useState<ReceiverAccount[]>([]);

  const DRAFT_CACHE_KEY = `darb_create_course_draft_cache_${courseTypeParam || 'recorded'}`;
  const DRAFT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

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

  // 1. Load draft from localStorage on mount if within 30 minutes
  useEffect(() => {
    const isNewRequest = searchParams.get('new') === 'true' || searchParams.get('fresh') === 'true';
    if (isNewRequest) {
      purgeAllCourseDraftCache();
      setTitle('');
      setSlug('');
      setCategory('');
      setShortDescription('');
      setDescription('');
      setGradeLevel('');
      setSemester('');
      setSubject('');
      setAcademicYear('');
      setLearningOutcomes(['']);
      setTargetAudience(['']);
      setPricingType('paid');
      setPrice('');
      setAccessDurationType('days');
      setAccessDays('30');
      setAccessUntilDate('');
      setCourseId(null);
      setUnits([]);
      setPreviewUrl(null);
      setSelectedFile(null);
      return;
    }

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
          if (cached.accessDurationType) setAccessDurationType(cached.accessDurationType);
          if (cached.accessDays) setAccessDays(cached.accessDays);
          if (cached.accessUntilDate) setAccessUntilDate(cached.accessUntilDate);
          if (cached.courseId) setCourseId(cached.courseId);
          if (cached.units && Array.isArray(cached.units)) setUnits(cached.units);
          if (cached.selectedPaymentMethods && Array.isArray(cached.selectedPaymentMethods)) {
            const restoredCurrency = cached.currency || currency;
            const valid = cached.selectedPaymentMethods.filter((m: any) => m.currency === restoredCurrency);
            setSelectedPaymentMethods(valid);
          }

          // Restore cached image if exists
          try {
            const imageCacheKey = `darb_create_course_image_${courseTypeParam || 'recorded'}`;
            const cachedImage = localStorage.getItem(imageCacheKey);
            if (cachedImage) {
              setPreviewUrl(cachedImage);
              // Convert base64 back to File object
              const arr = cachedImage.split(',');
              const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
              const bstr = atob(arr[1]);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              const file = new File([u8arr], 'cached_thumbnail.png', { type: mime });
              setSelectedFile(file);
            }
          } catch (imageErr) {
            console.error('Error restoring cached image:', imageErr);
          }

          toast.success('تم استعادة بيانات المسودة المحفوظة مؤقتاً');
        } else {
          purgeAllCourseDraftCache();
        }
      }
    } catch (err) {
      console.error('Error restoring draft:', err);
    }
  }, [DRAFT_CACHE_KEY, searchParams]);

  // 2. Save draft to localStorage whenever form state changes
  useEffect(() => {
    if (courseId) {
      // Clear draft cache if it was created, so that it doesn't linger after successful creation
      try {
        localStorage.removeItem(DRAFT_CACHE_KEY);
        localStorage.removeItem(`darb_create_course_image_${courseTypeParam || 'recorded'}`);
      } catch (e) {}
      return;
    }

    if (!title && !category && !description && !price) return;

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
      selectedPaymentMethods,
      accessDurationType,
      accessDays,
      accessUntilDate,
      courseId: null, // Always null for new creation draft
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
    selectedPaymentMethods,
    accessDurationType,
    accessDays,
    accessUntilDate,
    courseId,
    units,
  ]);

  // Reset selected payment methods when currency changes
  useEffect(() => {
    setSelectedPaymentMethods((prev) => {
      if (!prev || prev.length === 0) return prev;
      const valid = prev.filter((m) =>
        activeMethods.some((am) => am.id.toString() === m.methodId.toString())
      );
      if (valid.length !== prev.length) {
        return valid;
      }
      return prev;
    });
  }, [currency, academyPaymentMethods]);

  useEffect(() => {
    if (courseId && activeTab === 'landing_pages') {
      fetchLandingPages();
    }
  }, [courseId, activeTab]);

  const activeMethods: PaymentMethod[] = academyPaymentMethods
    .filter((m) => {
      if (m.currency !== currency) return false;
      const targetCountry = currency === 'EGP' ? 'EG' : 'SA';
      if (m.receiver_account && m.receiver_account.country_code !== targetCountry) {
        return false;
      }
      return true;
    })
    .map((m) => ({
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
        const [cats, profile, paymentInfos, templates, grades, terms, subjects, years] = await Promise.all([
          getCategories(),
          getProfileStatus(),
          getUserPaymentInfos(),
          getReceiverAccounts().catch(e => { console.warn('Failed to fetch receiver templates:', e); return []; }),
          getGrades().catch(e => { console.warn('Failed to fetch grades:', e); return []; }),
          getTerms().catch(e => { console.warn('Failed to fetch terms:', e); return []; }),
          getSubjects().catch(e => { console.warn('Failed to fetch subjects:', e); return []; }),
          getAcademicYears().catch(e => { console.warn('Failed to fetch academic years:', e); return []; }),
        ]);
        setCategories(cats);
        setAcademyPaymentMethods(paymentInfos || []);
        setReceiverTemplates(templates || []);

        const formatClassification = (items: any[], isGrade = false) => {
          return (items || []).map((item: any, i: number) => ({
            id: item.id || String(i + 1).padStart(2, '0'),
            name: item.name || item.title || 'عنصر جديد',
            desc: item.desc || item.description || 'لا يوجد وصف',
            stage: item.stage || item.educational_stage || (isGrade ? 'المرحلة الثانوية' : 'عام'),
            academic_year: item.academic_year || item.academic_year_name || '2025/2026',
            active: item.active !== undefined ? item.active : (item.is_active !== undefined ? item.is_active : true),
            grade_id: item.grade_id || item.grade?.id || '',
            grade_name: item.grade?.name || ''
          }));
        };

        setGradesList(formatClassification(grades, true));
        setSemestersList(formatClassification(terms));
        setSubjectsList(formatClassification(subjects));
        setAcademicYearsList(formatClassification(years));

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

  // Fetch course details if editing an existing course
  useEffect(() => {
    const editIdParam = searchParams.get('id') || searchParams.get('courseId') || searchParams.get('course_id');
    if (editIdParam) {
      const loadExistingCourse = async () => {
        try {
          const c: any = await getCourse(editIdParam);
          if (c) {
            setCourseId(c.id);
            if (c.title) setTitle(c.title);
            if (c.slug) setSlug(c.slug);
            if (c.category_id) setCategory(String(c.category_id));
            if (c.short_description) setShortDescription(c.short_description);
            if (c.description) setDescription(c.description);
            if (c.pricing_type || c.price_type) setPricingType(c.pricing_type || c.price_type);
            if (c.price) setPrice(String(c.price));
            if (c.currency) setCurrency(c.currency);
            if (c.status) setStatus(c.status);
            if (c.chapters || c.units) setUnits(c.chapters || c.units);
            if (c.image) setPreviewUrl(c.image);

            // Load infos for learning outcomes and target audience
            if (Array.isArray(c.infos) && c.infos.length > 0) {
              const learnPoints = c.infos
                .filter((i: any) => i.info_key === 'what_you_will_learn' || i.key === 'what_you_will_learn')
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((i: any) => i.info_value || i.value);
              if (learnPoints.length > 0) setLearningOutcomes(learnPoints);

              const audPoints = c.infos
                .filter((i: any) => i.info_key === 'targeted_audience' || i.key === 'targeted_audience' || i.info_key === 'target_audience' || i.key === 'target_audience' || i.info_key === 'who_is_this_for' || i.key === 'who_is_this_for')
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((i: any) => i.info_value || i.value);
              if (audPoints.length > 0) setTargetAudience(audPoints);
            } else {
              if (c.what_you_will_learn) {
                const pts = c.what_you_will_learn.split(/\n|,|،/).map((s: string) => s.trim()).filter(Boolean);
                if (pts.length > 0) setLearningOutcomes(pts);
              }
              const audStr = c.target_audience || c.who_is_this_for || '';
              if (audStr) {
                const pts = audStr.split(/\n|,|،/).map((s: string) => s.trim()).filter(Boolean);
                if (pts.length > 0) setTargetAudience(pts);
              }
            }
          }
        } catch (err) {
          console.error('Failed to load course for editing:', err);
        }
      };
      loadExistingCourse();
    }
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          localStorage.setItem(`darb_create_course_image_${courseTypeParam || 'recorded'}`, base64data);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Failed to convert and cache image:', err);
      }
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

  const activeGrades = gradesList.length > 0 ? gradesList : [
    { id: 'first_sec', name: 'أولى ثانوي' },
    { id: 'second_sec', name: 'ثانية ثانوي' },
    { id: 'third_sec', name: 'ثالثة ثانوي' }
  ];

  const activeSemesters = semestersList.length > 0 
    ? semestersList.filter(item => !gradeLevel || String(item.grade_id) === String(gradeLevel))
    : [
        { id: 'term_1', name: 'الترم الأول' },
        { id: 'term_2', name: 'الترم الثاني' },
        { id: 'full_year', name: 'العام الدراسي كامل' },
        { id: 'final_review', name: 'مراجعة نهائية' },
        { id: 'not_linked', name: 'غير مرتبط بترم' }
      ];

  const activeSubjects = subjectsList.length > 0
    ? subjectsList.filter(item => !gradeLevel || String(item.grade_id) === String(gradeLevel))
    : [
        { id: 'physics', name: 'فيزياء' },
        { id: 'chemistry', name: 'كيمياء' },
        { id: 'math', name: 'رياضيات' },
        { id: 'biology', name: 'أحياء' },
        { id: 'arabic', name: 'عربي' }
      ];

  const activeYears = academicYearsList.length > 0 ? academicYearsList : [
    { id: '2026/2027', name: '2026 / 2027' },
    { id: '2025/2026', name: '2025 / 2026' }
  ];

  const mapTypeToBackend = (type: string | null | undefined): string => {
    if (!type) return 'recorded';
    const t = type.toLowerCase().trim();
    if (t === 'live-online' || t === 'online') return 'online';
    if (t === 'in-person' || t === 'physical' || t === 'offline') return 'physical';
    return 'recorded';
  };

  const clearDraftCache = () => {
    try {
      purgeAllCourseDraftCache();
    } catch (e) {
      console.error('Failed to clear draft cache:', e);
    }
  };

  const ensureCourseCreated = async (overriddenStatus?: string) => {
    if (courseId) {
      if (overriddenStatus && overriddenStatus !== status) {
        try {
          await updateCourse(courseId, { status: overriddenStatus });
          setStatus(overriddenStatus as any);
        } catch (e) {
          console.error('Failed to update status on existing course:', e);
        }
      }
      return courseId;
    }

    const targetStatus = overriddenStatus || status;

    // Enforce strict validations ONLY when user explicitly publishes the course
    if (targetStatus === 'published') {
      if (!title.trim()) {
        toast.error('يرجى إدخال اسم الدورة أولاً في المعلومات الأساسية قبل النشر');
        throw new Error('Missing course title');
      }

      if (pricingType === 'paid') {
        if (!price || Number(price) <= 0) {
          toast.error('سعر الدورة مطلوب للدورات المدفوعة ويجب أن يكون أكبر من 0');
          throw new Error('Invalid price');
        }
        if (selectedPaymentMethods.length === 0) {
          toast.error('يرجى اختيار وسيلة دفع واحدة على الأقل للتحصيل');
          throw new Error('Please select at least one payment method');
        }
      }
    }

    let effectiveTitle = title.trim();
    if (!effectiveTitle) {
      effectiveTitle = 'دورة جديدة بدون عنوان';
      setTitle(effectiveTitle);
    }

    let userId = currentUser?.id || 2;
    if (selectedInstructor) userId = selectedInstructor;

    const targetAudienceStr = targetAudience.filter(Boolean).join('، ');

    const payload: any = {
      title: effectiveTitle,
      category_id: category || undefined,
      description: description || undefined,
      short_description: shortDescription || undefined,
      shortDescription: shortDescription || undefined,
      user_id: userId,
      who_is_this_for: targetAudienceStr || shortDescription || undefined,
      target_audience: targetAudienceStr || shortDescription || undefined,
      price: pricingType === 'free' ? 0 : Number(price || 0),
      final_price: pricingType === 'free' ? 0 : Number(price || 0),
      status: targetStatus,
      coach: coachName || currentUser?.name || '',
      receiver_accounts: selectedPaymentMethods.map((m: any) => Number(m.methodId)),
      type: mapTypeToBackend(courseTypeParam),
      price_type: pricingType,
      currency,
      image: selectedFile || undefined,

      // Pricing & Access Options
      access_duration_type: accessDurationType,
      access_days: accessDurationType === 'days' && accessDays ? Number(accessDays) : undefined,
      access_until_date: ((accessDurationType as string) === 'until_date' || (accessDurationType as string) === 'date') && accessUntilDate ? accessUntilDate : undefined,

      // Academic Classification Options
      grade_id: gradeLevel && !isNaN(Number(gradeLevel)) && Number.isInteger(Number(gradeLevel)) && Number(gradeLevel) > 0 ? Number(gradeLevel) : undefined,
      term_id: semester && !isNaN(Number(semester)) && Number.isInteger(Number(semester)) && Number(semester) > 0 ? Number(semester) : undefined,
      semester_id: semester && !isNaN(Number(semester)) && Number.isInteger(Number(semester)) && Number(semester) > 0 ? Number(semester) : undefined,
      subject_id: subject && !isNaN(Number(subject)) && Number.isInteger(Number(subject)) && Number(subject) > 0 ? Number(subject) : undefined,
      academic_year_id: academicYear && !isNaN(Number(academicYear)) && Number.isInteger(Number(academicYear)) && Number(academicYear) > 0 ? Number(academicYear) : undefined,
      grade_level: gradeLevel || undefined,
      semester: semester || undefined,
      subject: subject || undefined,
      academic_year: academicYear || undefined,
    };

    const infosList: any[] = [];
    let infoIndex = 0;

    learningOutcomes.filter((p) => p.trim() !== '').forEach((point, pointIndex) => {
      const item = {
        key: 'what_you_will_learn',
        info_key: 'what_you_will_learn',
        value: point,
        info_value: point,
        order: pointIndex + 1,
      };
      infosList.push(item);
      payload[`infos[${infoIndex}][key]`] = 'what_you_will_learn';
      payload[`infos[${infoIndex}][info_key]`] = 'what_you_will_learn';
      payload[`infos[${infoIndex}][value]`] = point;
      payload[`infos[${infoIndex}][info_value]`] = point;
      payload[`infos[${infoIndex}][order]`] = pointIndex + 1;
      infoIndex++;
    });

    targetAudience.filter((p) => p.trim() !== '').forEach((audPoint, audIndex) => {
      const item = {
        key: 'targeted_audience',
        info_key: 'targeted_audience',
        value: audPoint,
        info_value: audPoint,
        order: audIndex + 1,
      };
      infosList.push(item);
      payload[`infos[${infoIndex}][key]`] = 'targeted_audience';
      payload[`infos[${infoIndex}][info_key]`] = 'targeted_audience';
      payload[`infos[${infoIndex}][value]`] = audPoint;
      payload[`infos[${infoIndex}][info_value]`] = audPoint;
      payload[`infos[${infoIndex}][order]`] = audIndex + 1;
      infoIndex++;
    });

    payload.infos = infosList;

    try {
      // Check existing user courses for duplicates before creating/updating
      if (effectiveTitle.trim()) {
        try {
          const allCourses = await getCourses(userId, currentUser?.role);
          const existingCourse = allCourses.find((c: any) => 
            c.title?.trim().toLowerCase() === effectiveTitle.trim().toLowerCase() && 
            (!courseId || Number(c.id) !== Number(courseId))
          );

          if (existingCourse) {
            const result = await MySwal.fire({
              title: 'تنبيه: هذه الدورة موجودة بالفعل ⚠️',
              text: `دورة بعنوان "${effectiveTitle.trim()}" موجودة بالفعل بحسابك. هل ترغب في تكرارها (إنشاء نسخة مطابقة)؟`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#2563eb',
              cancelButtonColor: '#64748b',
              confirmButtonText: 'نعم، قم بالتكرار 📋',
              cancelButtonText: 'إلغاء',
              reverseButtons: true,
            });
            if (result.isConfirmed) {
              payload.title = `${effectiveTitle.trim()} (نسخة)`;
              setTitle(payload.title);
              // Clear current courseId so it creates a NEW duplicate instance
              setCourseId(null);
              const created = await createCourse(payload);
              setCourseId(created.id);
              const returnedSlug = (created as any)?.slug || (created as any)?.data?.slug || (created as any)?.course?.slug || slug;
              if (returnedSlug) setCourseSlug(returnedSlug);
              clearDraftCache();
              if (overriddenStatus !== 'published') {
                toast.success('تم تكرار وحفظ الدورة بنجاح');
              }
              return created.id;
            } else {
              throw new Error('User cancelled duplicate course creation');
            }
          }
        } catch (err: any) {
          if (err.message === 'User cancelled duplicate course creation') throw err;
          // Ignore general fetch errors and continue
        }
      }

      if (courseId) {
        const updated = await updateCourse(courseId, payload);
        const returnedSlug = (updated as any)?.slug || (updated as any)?.data?.slug || (updated as any)?.course?.slug || slug;
        if (returnedSlug) setCourseSlug(returnedSlug);
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('createCourseId', String(courseId));
            if (returnedSlug) localStorage.setItem('createCourseSlug', returnedSlug);
            localStorage.setItem('darab_last_created_course_id', String(courseId));
            if (returnedSlug) localStorage.setItem('darab_last_created_course_slug', returnedSlug);
            localStorage.setItem(`darab_course_cache_${courseId}`, JSON.stringify(updated || payload));
            if (returnedSlug) localStorage.setItem(`darab_course_cache_${returnedSlug}`, JSON.stringify(updated || payload));
          }
        } catch (e) {}
        clearDraftCache();
        if (overriddenStatus !== 'published') {
          toast.success('تم تحديث بيانات الدورة بنجاح');
        }
        return courseId;
      } else {
        let created: any;
        try {
          created = await createCourse(payload);
        } catch (err: any) {
          if (err?.already_exists || err?.status === 409 || err?.message?.includes('already exists') || err?.message?.includes('موجود')) {
            const result = await MySwal.fire({
              title: 'تنبيه: هذه الدورة موجودة بالفعل ⚠️',
              text: `دورة بعنوان "${payload.title}" موجودة بالفعل. هل ترغب في تكرارها (إنشاء نسخة مطابقة)؟`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#2563eb',
              cancelButtonColor: '#64748b',
              confirmButtonText: 'نعم، قم بالتكرار 📋',
              cancelButtonText: 'إلغاء',
              reverseButtons: true,
            });
            if (result.isConfirmed) {
              payload.title = `${payload.title} (نسخة)`;
              created = await createCourse(payload);
            } else {
              throw err;
            }
          } else {
            throw err;
          }
        }

        if (created?.already_exists || created?.exists || created?.is_duplicate) {
          const result = await MySwal.fire({
            title: 'تنبيه: هذه الدورة موجودة بالفعل ⚠️',
            text: `دورة بعنوان "${payload.title}" موجودة بالفعل. هل ترغب في تكرارها (إنشاء نسخة مطابقة)؟`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'نعم، قم بالتكرار 📋',
            cancelButtonText: 'إلغاء',
            reverseButtons: true,
          });
          if (result.isConfirmed) {
            payload.title = `${payload.title} (نسخة)`;
            created = await createCourse(payload);
          }
        }

        setCourseId(created.id);
        const returnedSlug = (created as any)?.slug || (created as any)?.data?.slug || (created as any)?.course?.slug || slug;
        if (returnedSlug) setCourseSlug(returnedSlug);
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('createCourseId', created.id.toString());
            if (returnedSlug) localStorage.setItem('createCourseSlug', returnedSlug);
            localStorage.setItem('darab_last_created_course_id', String(created.id));
            if (returnedSlug) localStorage.setItem('darab_last_created_course_slug', returnedSlug);
            const courseObj = { ...payload, id: created.id, slug: returnedSlug };
            localStorage.setItem(`darab_course_cache_${created.id}`, JSON.stringify(courseObj));
            if (returnedSlug) localStorage.setItem(`darab_course_cache_${returnedSlug}`, JSON.stringify(courseObj));
          }
        } catch (e) {}
        clearDraftCache();
        if (overriddenStatus !== 'published') {
          toast.success('تم حفظ الدورة بنجاح');
        }
        return created.id;
      }
    } catch (error: any) {
      if (error?.message !== 'User cancelled duplicate course creation') {
        console.error(error);
        toast.error(getErrorMessage(error, 'حدث خطأ أثناء حفظ الدورة'));
      }
      throw error;
    }
  };

  const handleNextTab = () => {
    if (activeTab === 'info') setActiveTab('content');
    else if (activeTab === 'content') setActiveTab('landing_pages');
    else if (activeTab === 'landing_pages') setActiveTab('subscribers');
  };

  const handleBackTab = () => {
    if (activeTab === 'content') setActiveTab('info');
    else if (activeTab === 'landing_pages') setActiveTab('content');
    else if (activeTab === 'subscribers') setActiveTab('landing_pages');
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const createdId = await ensureCourseCreated('draft');
      setStatus('draft');
      const totalLessons = units.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0);
      if (totalLessons === 0) {
        toast.success('تم حفظ الدورة كمسودة بنجاح. يرجى إضافة دروس لتتمكن من النشر لاحقاً.');
      } else {
        toast.success('تم حفظ بيانات الدورة بنجاح.');
      }
      if (createdId && !courseId) {
        router.push(`/academic/courses/${createdId}`);
      }
    } catch (err) {
      // Handled inside
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const totalLessons = units.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0);
      if (totalLessons === 0) {
        toast.error('لا يمكن نشر الدورة بدون وجود دروس تعليمية. تم حفظ الدورة كمسودة.');
        const createdId = await ensureCourseCreated('draft');
        setStatus('draft');
        if (createdId && !courseId) {
          router.push(`/academic/courses/${createdId}`);
        }
        return;
      }

      const createdId = await ensureCourseCreated('published');
      setStatus('published');
      toast.success('تم نشر الدورة بنجاح!');
      clearDraftCache();
      if (createdId && !courseId) {
        router.push(`/academic/courses/${createdId}`);
      }
    } catch (err) {
      // Handled inside
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaymentTemplateId) {
      toast.error('يرجى اختيار وسيلة الدفع أولاً');
      return;
    }
    if (!newPaymentAccountValue) {
      toast.error('يرجى إدخال رقم الحساب أو الهاتف المربوط بالخدمة');
      return;
    }

    setIsSavingNewPayment(true);
    try {
      const payload = {
        name: newPaymentCustomName || 'حساب استقبال',
        accountValue: newPaymentAccountValue,
        currency: currency,
        receiver_account_id: Number(newPaymentTemplateId),
      };

      const result = await createUserPaymentInfo(payload);
      toast.success('تمت إضافة وتفعيل وسيلة الدفع بنجاح');

      // 1. Refetch active academy payment methods
      const updatedMethods = await getUserPaymentInfos();
      setAcademyPaymentMethods(updatedMethods);

      // 2. Auto-select the newly added payment method
      const newMethod = {
        methodId: result.id.toString(),
        methodName: result.name || newPaymentCustomName || '',
        type: 'account_number' as const,
        value: result.accountValue || newPaymentAccountValue,
        currency: result.currency || currency,
        logo: result.logo || '',
      };
      
      setSelectedPaymentMethods((prev) => {
        const next = [...prev, newMethod];
        if (next.length > 3) {
          toast.success('تمت إضافة وسيلة الدفع وتفعيلها واستبدال أقدم وسيلة محددة لتظل ٣ وسائل كحد أقصى');
          return next.slice(next.length - 3);
        }
        return next;
      });

      // 3. Clear form and close modal
      setNewPaymentTemplateId('');
      setNewPaymentAccountValue('');
      setNewPaymentCustomName('');
      setShowAddPaymentModal(false);
    } catch (err: any) {
      console.error('Failed to create payment info:', err);
      toast.error(err?.message || 'فشل إضافة وسيلة الدفع. يرجى التحقق من البيانات.');
    } finally {
      setIsSavingNewPayment(false);
    }
  };

  const getMockCourseObj = () => {
    return {
      id: courseId,
      title: title,
      description: description || shortDescription,
      image: previewUrl || undefined,
      infos: learningOutcomes.filter(Boolean).map((pt, idx) => ({
        key: 'what_you_will_learn',
        value: pt,
        order: idx + 1
      }))
    };
  };

  const fetchLandingPages = async () => {
    if (!courseId) return;
    setLoadingLandingPages(true);
    try {
      const list = await getLandingPagesList();
      const coursePages = list.filter((item: any) => {
        const isCourseMatch = Number(item.course_id) === Number(courseId);
        const campaignName = item.content?.campaignName || item.campaignName || '';
        const isDummy = campaignName.includes('حمله إضافيه') || 
                        campaignName.includes('حملة إضافية') || 
                        item.slug === 'landing';
        return isCourseMatch && !isDummy;
      });
      setLandingPages(coursePages);
      
      // Sync to localStorage
      localStorage.setItem('darab_landing_pages', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to fetch landing pages:', e);
    } finally {
      setLoadingLandingPages(false);
    }
  };

  const handleOpenEditor = (page: any) => {
    const mockCourse = getMockCourseObj();
    const store = useLandingStore.getState();
    
    // Set course details for defaults lookup
    store.setCourseData(mockCourse);
    
    store.setLandingPageData({
      id: page.id,
      template_name: page.template_name,
      is_active: page.is_active,
      content: page.content,
      course_id: page.course_id,
      user_id: currentUser?.id || 1
    });

    setPreviewLandingPageId(page.id);
    setPreviewTemplateId(page.template_name);
    store.setActiveSectionId(null);
  };

  const handleTogglePublish = async (page: any) => {
    try {
      const nextStatus = !page.is_active;
      await updateLandingPage({
        id: page.id,
        template_name: page.template_name,
        content: page.content,
        is_active: nextStatus,
        course_id: Number(courseId),
        user_id: currentUser?.id || 1
      });
      toast.success(nextStatus ? 'تم نشر الصفحة بنجاح' : 'تم إيقاف النشر مؤقتاً');
      fetchLandingPages();
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء تغيير حالة الصفحة');
    }
  };

  const handleDeleteLandingPage = (pageId: string | number) => {
    MySwal.fire({
      title: 'هل أنت متأكد من الحذف؟',
      text: 'لن تتمكن من استرجاع صفحة الهبوط هذه بعد حذفها!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفها',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteLandingPage(pageId);
          toast.success('تم حذف صفحة الهبوط بنجاح');
          fetchLandingPages();
        } catch (e) {
          console.error(e);
          toast.error('فشل حذف صفحة الهبوط');
        }
      }
    });
  };

  const handleCreateLandingPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) {
      toast.error('يرجى إدخال اسم الحملة');
      return;
    }

    setIsCreatingLanding(true);
    try {
      const mockCourse = getMockCourseObj();
      const defaultContent = getTemplateDefaultContent(mockCourse, newSelectedTemplate);
      const contentWithCampaign = {
        ...defaultContent,
        campaignName: newCampaignName.trim()
      };

      const payload = {
        template_name: newSelectedTemplate,
        content: contentWithCampaign,
        is_active: true,
        course_id: Number(courseId),
        user_id: currentUser?.id || 1,
        slug: newCustomSlug.trim() || undefined
      };

      const savedData = await createLandingPage(payload);
      toast.success('تم إنشاء صفحة البيع بنجاح!');
      setIsCreateLandingModalOpen(false);
      setNewCampaignName('');
      setNewCustomSlug('');
      setNewSelectedTemplate('template_1');
      
      await fetchLandingPages();

      if (savedData) {
        const mappedPage = {
          id: String(savedData.id),
          course_id: Number(savedData.course_id),
          courseTitle: title || '',
          template_name: savedData.template_name || newSelectedTemplate,
          is_active: Boolean(savedData.is_active),
          slug: savedData.slug || newCustomSlug.trim(),
          content: savedData.content || contentWithCampaign,
          created_at: savedData.created_at || new Date().toISOString()
        };
        handleOpenEditor(mappedPage);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(getErrorMessage(err, 'حدث خطأ أثناء إنشاء صفحة البيع'));
    } finally {
      setIsCreatingLanding(false);
    }
  };

  const handleCloneLandingPage = async (page: any) => {
    try {
      const payload = {
        template_name: page.template_name,
        content: {
          ...page.content,
          campaignName: `${page.content?.campaignName || 'نسخة'} - نسخة`
        },
        is_active: false,
        course_id: Number(courseId),
        user_id: currentUser?.id || 1,
        slug: page.slug ? `${page.slug}-copy` : undefined
      };
      await createLandingPage(payload);
      toast.success('تم تكرار صفحة الهبوط بنجاح');
      fetchLandingPages();
    } catch (e) {
      console.error(e);
      toast.error('فشل تكرار صفحة الهبوط');
    }
  };

  const handleCopyCustomLink = (page: any) => {
    if (status !== 'published') {
      toast.error('لا يمكن مشاركة الدورة لأنها مسودة، يجب نشر الدورة أولاً');
      return;
    }
    if (typeof window !== 'undefined') {
      const targetSlug = page.slug || courseSlug || slug || (courseId ? String(courseId) : 'draft');
      const link = `${window.location.origin}/landing/${targetSlug}?lp_id=${page.id}`;
      navigator.clipboard.writeText(link);
      toast.success('تم نسخ رابط صفحة البيع بنجاح!');
    }
  };

  const handleCopyDefaultLink = () => {
    if (status !== 'published') {
      toast.error('لا يمكن مشاركة الدورة لأنها مسودة، يجب نشر الدورة أولاً');
      return;
    }
    if (typeof window !== 'undefined') {
      const targetSlug = courseSlug || slug || (courseId ? String(courseId) : 'draft');
      const link = `${window.location.origin}/landing/${targetSlug}`;
      navigator.clipboard.writeText(link);
      toast.success('تم نسخ رابط صفحة البيع الافتراضية بنجاح!');
    }
  };

  const handleCreateInlineCategory = async (payload: any) => {
    setIsSubmitting(true);
    try {
      const name = typeof payload === 'string' ? payload : payload?.name;
      const isActive = typeof payload === 'object' && payload?.is_active !== undefined ? payload.is_active : 1;
      const newCat = await createCategory(name, isActive);
      setCategories((prev) => [...prev, newCat]);
      setCategory(newCat.id.toString());
      setIsAddingCategory(false);
      toast.success('تم إضافة الفئة بنجاح');
    } catch (err: any) {
      toast.error(getErrorMessage(err, 'فشل إضافة الفئة'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const basePriceNum = parseFloat(price) || 0;
  const effectivePrice = pricingType === 'free' ? 0 : basePriceNum;
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
                  <ImagePlus className="w-7 h-7 text-slate-400 group-hover:text-blue-600 transition-colors" />
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {title || 'دورة جديدة بدون عنوان'}
                  </h2>
                  <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-300 text-xs rounded-full text-slate-600 font-semibold">
                    {courseTypeParam === 'live-online' ? 'بث مباشر' : courseTypeParam === 'in-person' ? 'حضورية' : 'مسجلة'}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-4 h-4 text-slate-400" />
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
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-xs disabled:opacity-50 active:scale-[0.98]"
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-bold shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
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
                onClick={() => setActiveTab('landing_pages')}
                className={`relative py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === 'landing_pages' ? 'text-blue-600 tab-active' : 'text-slate-500 hover:text-blue-600'
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
                      <Info className="w-5 h-5" />
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



                    {/* 2. Thumbnail & Short Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="order-2 md:order-2">
                        <label className="block text-sm font-bold mb-2 text-slate-800">الصورة التعريفية (Thumbnail)</label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl h-28 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer group overflow-hidden relative"
                        >
                          {previewUrl ? (
                            <img src={previewUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <ImagePlus className="w-7 h-7 text-slate-400 group-hover:text-blue-600 transition-colors" />
                              <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600 mt-1 transition-colors">اضغط لرفع صورة أو اسحبها هنا</span>
                            </>
                          )}
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
                            <Bold className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors">
                            <Italic className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors">
                            <List className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors">
                            <LinkIcon className="w-4 h-4" />
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
                {(currentUser?.role === 'schoolteacher' || currentUser?.role === 'school_teacher') && (
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
                          onChange={(e) => {
                            setGradeLevel(e.target.value);
                            setSemester('');
                            setSubject('');
                          }}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-sm text-slate-900 font-medium bg-white"
                        >
                          <option value="">اختر الصف...</option>
                          {activeGrades.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
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
                          {activeSemesters.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
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
                          {activeSubjects.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2 text-slate-800">العام الدراسي</label>
                        <select
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-sm text-slate-900 font-medium bg-white"
                        >
                          <option value="">اختر العام الدراسي...</option>
                          {activeYears.map((y) => (
                            <option key={y.id} value={y.id}>
                              {y.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>
                )}

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
                                onChange={(e) => {
                                  const newCurr = e.target.value as any;
                                  setCurrency(newCurr);
                                  setSelectedPaymentMethods([]);
                                }}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none text-sm text-slate-900 font-medium bg-white"
                              >
                                <option value="EGP">EGP — جنيه مصري</option>
                                <option value="SAR">SAR — ريال سعودي</option>
                                <option value="USD">USD — دولار أمريكي</option>
                              </select>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>

                    {/* Price Preview Card */}
                    <div className="w-full lg:w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-7 shadow-xl shadow-slate-900/10 border border-slate-700 flex flex-col items-center justify-center text-center">
                      <p className="text-xs text-slate-400 font-medium mb-3">معاينة السعر للمشترك</p>
                      <div>
                        {pricingType === 'free' ? (
                          <h4 className="text-3xl font-bold text-emerald-400">مجاناً</h4>
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

                {/* Section 5: Payment Methods / Pricing */}
                <section className="bg-white border border-slate-300 rounded-2xl p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          payments
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">وسائل الدفع المقبولة والتسعير</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">حدد حسابات استلام الأموال لهذه الدورة التدريبية</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const countryCode = currency === 'EGP' ? 'EG' : 'SA';
                        const filtered = receiverTemplates.filter(t => t.country_code === countryCode);
                        if (filtered.length > 0) {
                          setNewPaymentTemplateId(filtered[0].id.toString());
                          setNewPaymentCustomName(filtered[0].name);
                        } else {
                          setNewPaymentTemplateId('');
                          setNewPaymentCustomName('');
                        }
                        setNewPaymentAccountValue('');
                        setShowAddPaymentModal(true);
                      }}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة وسيلة استقبال جديدة
                    </button>
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

                        let targetTitle = newUnitTitle.trim();
                        const existingUnit = units.find((u: any) => u.title?.trim().toLowerCase() === targetTitle.toLowerCase());

                        if (existingUnit) {
                          const result = await MySwal.fire({
                            title: 'تنبيه: هذه الوحدة موجودة بالفعل ⚠️',
                            text: `الوحدة "${targetTitle}" موجودة بالفعل في هذا المنهج. هل ترغب في تكرارها (إنشاء نسخة مطابقة)؟`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#2563eb',
                            cancelButtonColor: '#64748b',
                            confirmButtonText: 'نعم، قم بالتكرار 📋',
                            cancelButtonText: 'إلغاء',
                            reverseButtons: true,
                          });
                          if (!result.isConfirmed) return;
                          targetTitle = `${targetTitle} (نسخة)`;
                        }

                        const id = await ensureCourseCreated();
                        try {
                          const res: any = await createUnit({ course_id: id, title: targetTitle, description: '', order: units.length + 1 });
                          if (res?.already_exists || res?.exists || res?.is_duplicate) {
                            const result = await MySwal.fire({
                              title: 'تنبيه: هذه الوحدة موجودة بالفعل ⚠️',
                              text: `الوحدة "${targetTitle}" موجودة بالفعل. هل ترغب في تكرارها (إنشاء نسخة مطابقة)؟`,
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#2563eb',
                              cancelButtonColor: '#64748b',
                              confirmButtonText: 'نعم، قم بالتكرار 📋',
                              cancelButtonText: 'إلغاء',
                              reverseButtons: true,
                            });
                            if (result.isConfirmed) {
                              await createUnit({ course_id: id, title: `${targetTitle} (نسخة)`, description: '', order: units.length + 1 });
                              await refreshUnits(id);
                              setNewUnitTitle('');
                              setIsAddingUnit(false);
                              toast.success('تم تكرار وحفظ الوحدة بنجاح');
                              return;
                            } else {
                              return;
                            }
                          }
                          await refreshUnits(id);
                          setNewUnitTitle('');
                          setIsAddingUnit(false);
                          toast.success('تم حفظ الوحدة بنجاح');
                        } catch (err: any) {
                          if (err?.already_exists || err?.status === 409 || err?.message?.includes('already exists') || err?.message?.includes('موجود')) {
                            const result = await MySwal.fire({
                              title: 'تنبيه: هذه الوحدة موجودة بالفعل ⚠️',
                              text: `الوحدة "${targetTitle}" موجودة بالفعل. هل ترغب في تكرارها (إنشاء نسخة مطابقة)؟`,
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#2563eb',
                              cancelButtonColor: '#64748b',
                              confirmButtonText: 'نعم، قم بالتكرار 📋',
                              cancelButtonText: 'إلغاء',
                              reverseButtons: true,
                            });
                            if (result.isConfirmed) {
                              await createUnit({ course_id: id, title: `${targetTitle} (نسخة)`, description: '', order: units.length + 1 });
                              await refreshUnits(id);
                              setNewUnitTitle('');
                              setIsAddingUnit(false);
                              toast.success('تم تكرار وحفظ الوحدة بنجاح');
                              return;
                            }
                          } else {
                            toast.error(getErrorMessage(err, 'فشل حفظ الوحدة'));
                          }
                        }
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
                              onClick={async (e) => {
                                e.stopPropagation();
                                const result = await MySwal.fire({
                                  title: 'هل أنت متأكد من حذف الوحدة؟',
                                  text: 'سيتم حذف هذه الوحدة وجميع الدروس التابعة لها.',
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#ef4444',
                                  cancelButtonColor: '#64748b',
                                  confirmButtonText: 'نعم، احذف',
                                  cancelButtonText: 'إلغاء',
                                  reverseButtons: true,
                                });
                                if (result.isConfirmed) {
                                  try {
                                    if (unit.id) {
                                      await deleteUnit(unit.id);
                                    }
                                    setUnits((prev: any[]) => prev.filter((u: any) => u.id !== unit.id));
                                    toast.success('تم حذف الوحدة بنجاح');
                                  } catch (err: any) {
                                    toast.error(getErrorMessage(err, 'فشل حذف الوحدة'));
                                  }
                                }
                              }}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="حذف الوحدة"
                            >
                              <span className="material-symbols-outlined text-xl">delete</span>
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



          {/* Tab 3.5: Marketing & Sales (Landing Pages) */}
          {activeTab === 'landing_pages' && (
            <div className="space-y-8 animate-in fade-in duration-300" dir="rtl">
              {!courseId ? (
                <div className="max-w-4xl mx-auto bg-white border border-slate-300 rounded-2xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 border border-blue-100">
                    <span className="material-symbols-outlined text-3xl">campaign</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-900">إدارة صفحات البيع والحملات</h3>
                  
                  <p className="text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
                    يرجى ملء المعلومات الأساسية وحفظ مسودة الدورة أولاً لتتمكن من إنشاء صفحات البيع وإدارة حملاتك التسويقية.
                  </p>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await handleSave();
                      } catch (e) {
                        // Handled inside
                      }
                    }}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer animate-pulse"
                  >
                    <span>حفظ الدورة وتفعيل التسويق</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Header Titles */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">التسويق والبيع</h2>
                      <p className="text-sm text-slate-500 max-w-2xl mt-2 leading-relaxed">
                        أنشئ صفحات بيع مختلفة لنفس الدورة واستخدم كل صفحة في حملة أو عرض مختلف، مع بقاء جميع الصفحات مرتبطة بنفس الدورة.
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsCreateLandingModalOpen(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-black"
                    >
                      <Plus size={18} />
                      <span>إنشاء صفحة بيع جديدة</span>
                    </button>
                  </div>

                  {/* Introduction Card */}
                  <div className="bg-white border border-slate-300 p-6 rounded-2xl flex flex-col lg:flex-row gap-8 items-center shadow-sm">
                    <div className="flex-1 space-y-4">
                      <div className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full font-bold text-xs">
                        <span className="material-symbols-outlined text-sm">info</span>
                        دليل الاستخدام
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">كيف تعمل صفحات البيع؟</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        لكل دورة صفحة بيع افتراضية يتم إنشاؤها تلقائياً. يمكنك إنشاء صفحات بيع إضافية لنفس الدورة واستخدم كل صفحة في حملة أو عرض مختلف، بينما تظل جميع الصفحات تبيع نفس الدورة.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">١</div>
                          <p className="text-xs text-slate-500 leading-snug">صفحة بيع افتراضية يتم إنشاؤها تلقائياً.</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">٢</div>
                          <p className="text-xs text-slate-500 leading-snug">أنشئ صفحات بيع إضافية للحملات المختلفة.</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">٣</div>
                          <p className="text-xs text-slate-500 leading-snug">جميع الصفحات مرتبطة بنفس الدورة وتحقق نفس الهدف.</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-72 shrink-0">
                      <div className="aspect-square bg-gradient-to-tr from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center relative overflow-hidden border border-slate-200/55 shadow-inner">
                        <Globe className="w-24 h-24 text-blue-500/20 animate-pulse" />
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Overview Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-300 p-6 rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                          <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded font-bold">0%</span>
                      </div>
                      <p className="text-slate-500 text-xs font-bold">إجمالي المبيعات</p>
                      <h4 className="text-3xl font-black text-gray-900 mt-1">
                        {landingPages.reduce((acc, p) => acc + (p.content?.sales || 0), 0).toLocaleString('ar-EG')}
                      </h4>
                    </div>
                    <div className="bg-white border border-slate-300 p-6 rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                          <span className="material-symbols-outlined">layers</span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs font-bold">عدد صفحات البيع</p>
                      <h4 className="text-3xl font-black text-gray-900 mt-1">
                        {(1 + landingPages.length).toLocaleString('ar-EG')}
                      </h4>
                    </div>
                    <div className="bg-white border border-slate-300 p-6 rounded-2xl shadow-sm border-r-4 border-r-blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs font-bold">أفضل صفحة بيع</p>
                      <h4 className="text-base font-black text-gray-900 mt-1 leading-snug line-clamp-1">
                        {landingPages.length > 0 && landingPages.some(p => (p.content?.sales || 0) > 0)
                          ? (landingPages.reduce((max, p) => (p.content?.sales || 0) > (max.content?.sales || 0) ? p : max, landingPages[0]).content?.campaignName || 'صفحة إضافية')
                          : 'صفحة البيع الافتراضية'}
                      </h4>
                    </div>
                  </div>

                  {/* Default Sales Page Section */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600">auto_awesome</span>
                      صفحة البيع الافتراضية
                    </h3>
                    <div className="bg-white border-2 border-blue-500/20 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                      <div className="absolute right-0 top-0 h-full w-1.5 bg-blue-600"></div>
                      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="text-base font-bold text-gray-900 font-black">{title}</h4>
                            <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-bold">تم إنشاؤها تلقائياً</span>
                          </div>
                          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                            تم إنشاء هذه الصفحة تلقائياً من بيانات الدورة، ويمكنك تعديلها في أي وقت أو استخدامها كأساس لإنشاء صفحات بيع جديدة.
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-slate-100">
                            <div>
                              <p className="text-xs text-slate-500 font-bold">الحالة</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="font-bold text-gray-900 text-xs">نشط</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-bold">الزيارات</p>
                              <p className="font-black text-gray-900 text-sm mt-1.5">٠</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-bold">المبيعات</p>
                              <p className="font-black text-gray-900 text-sm mt-1.5">٠</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-bold">آخر تحديث</p>
                              <p className="font-black text-gray-900 text-sm mt-1.5">
                                {new Date().toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0">
                          <button 
                            type="button"
                            onClick={() => {
                              setPreviewLandingPageId(null);
                              setPreviewTemplateId('template_2');
                            }}
                            className="flex-1 lg:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            تعديل الصفحة
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              const targetSlug = courseSlug || slug || (courseId ? String(courseId) : 'draft');
                              const landingUrl = `/landing/${targetSlug}`;
                              window.open(landingUrl, '_blank');
                            }}
                            className="flex-1 lg:flex-none px-5 py-2.5 border border-blue-600 text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            معاينة
                          </button>
                          <button 
                            type="button"
                            onClick={handleCopyDefaultLink}
                            className="flex-1 lg:flex-none px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                            title="مشاركة ورابط الصفحة الافتراضية"
                          >
                            <span className="material-symbols-outlined text-sm">share</span>
                            مشاركة الرابط
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Additional Sales Pages Section */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">صفحات بيع إضافية</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          أنشئ صفحات بيع مختلفة لنفس الدورة لتناسب الحملات والعروض المختلفة.
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setIsCreateLandingModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                      >
                        <Plus size={16} />
                        <span>إضافة صفحة بيع جديدة</span>
                      </button>
                    </div>

                    {loadingLandingPages ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <Loader2 size={32} className="animate-spin text-blue-600" />
                        <span className="text-sm font-bold">جاري تحميل صفحات البيع...</span>
                      </div>
                    ) : landingPages.length === 0 ? (
                      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Globe className="w-8 h-8" />
                        </div>
                        <h4 className="text-sm font-black text-gray-900 mb-1">لا توجد صفحات بيع إضافية</h4>
                        <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto leading-relaxed mb-5">
                          أنشئ صفحات بيع مخصصة لحملاتك التسويقية مثل (رمضان، الجمعة البيضاء، إلخ) وتتبع نتائج مبيعاتها بشكل منفصل.
                        </p>
                        <button 
                          type="button"
                          onClick={() => setIsCreateLandingModalOpen(true)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                        >
                          أنشئ أول صفحة بيع الآن
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {landingPages.map((page) => (
                          <div key={page.id} className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-start gap-4">
                              <div>
                                <h5 className="font-bold text-gray-900 text-xs line-clamp-1">{page.content?.campaignName || page.slug || 'حملة إضافية'}</h5>
                                <span className="text-[9px] text-slate-400 font-bold leading-none block mt-1">{title}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleTogglePublish(page)}
                                className={`text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all ${
                                  page.is_active 
                                    ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {page.is_active ? 'منشور' : 'مسودة'}
                              </button>
                            </div>
                            
                            <div className="p-5 grid grid-cols-2 gap-4 flex-1">
                              <div>
                                <p className="text-xs text-slate-500 font-bold">الزيارات</p>
                                <p className="font-black text-gray-900 text-sm mt-1">{(page.content?.visits || 0).toLocaleString('ar-EG')}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 font-bold">المبيعات</p>
                                <p className="font-black text-gray-900 text-sm mt-1">{(page.content?.sales || 0).toLocaleString('ar-EG')}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-xs text-slate-500 font-bold">الرابط المخصص</p>
                                <p className="font-mono text-xs text-blue-600 underline truncate mt-1">
                                  /landing/{page.slug}
                                </p>
                              </div>
                            </div>

                            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <button 
                                  type="button"
                                  onClick={() => handleOpenEditor(page)}
                                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-100 flex items-center justify-center" 
                                  title="تعديل وتخصيص"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const targetSlug = page.slug || courseSlug || slug || (courseId ? String(courseId) : 'draft');
                                    window.open(`/landing/${targetSlug}?lp_id=${page.id}`, '_blank');
                                  }}
                                  className="text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center" 
                                  title="معاينة كطالب"
                                >
                                  <Eye size={14} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleCloneLandingPage(page)}
                                  className="text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center" 
                                  title="تكرار الصفحة"
                                >
                                  <Copy size={14} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleCopyCustomLink(page)}
                                  className="text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center" 
                                  title="نسخ الرابط"
                                >
                                  <span className="material-symbols-outlined text-[18px]">link</span>
                                </button>
                              </div>
                              
                              <button 
                                type="button"
                                onClick={() => handleDeleteLandingPage(page.id)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                                title="حذف الصفحة"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          )}

          {/* Tab 4: Subscribers & Reports */}
          {activeTab === 'subscribers' && (
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <ManageSubscribersView showTopHeader={false} courseId={courseId || undefined} />
            </div>
          )}

        </div>

        {/* Sticky Bottom Navigation Bar for Next/Back */}
        <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-4 px-6 flex items-center justify-between z-40 shadow-md mt-6 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackTab}
              disabled={activeTab === 'info'}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <ChevronRight size={18} />
              <span>السابق</span>
            </button>
            <button
              type="button"
              onClick={handleNextTab}
              disabled={activeTab === 'subscribers'}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>التالي</span>
              <ChevronLeft size={18} />
            </button>
          </div>
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

      {/* Template Preview Modal */}
      {previewTemplateId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div 
            className="bg-white rounded-[2.5rem] w-full max-w-7xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {previewTemplateId === 'template_1' 
                    ? 'تخصيص القالب الأول (الكلاسيكي الملكي)' 
                    : previewTemplateId === 'template_3'
                    ? 'تخصيص قالب تصميم تجربة المستخدم (UI/UX)'
                    : 'تخصيص قالب صفحة الدروس التفاعلية (الافتراضي)'}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">انقر فوق أي قسم أو أيقونة "تعديل" لتخصيص محتواه مباشرة</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    const success = await saveLandingCustomizer(currentUser?.id);
                    if (success) {
                      setPreviewTemplateId(null);
                      setPreviewLandingPageId(null);
                      fetchLandingPages();
                    }
                  }}
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full font-black text-xs transition-all active:scale-95 shadow-md flex items-center gap-1 cursor-pointer"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setPreviewTemplateId(null);
                    setPreviewLandingPageId(null);
                  }}
                  className="w-9 h-9 bg-white hover:bg-slate-100 text-slate-500 rounded-full flex items-center justify-center border border-slate-200 hover:text-slate-900 transition-all active:scale-95 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Split Content Viewport */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
              {/* Left Column: Editor inspector Panel (350px width) */}
              <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-l border-slate-100 overflow-y-auto p-6 bg-slate-50/50 shrink-0 h-auto md:h-full flex flex-col gap-6">
                
                {/* Section Quick Selector */}
                <div className="space-y-2 pb-4 border-b border-slate-200">
                  <label className="text-xs font-black text-slate-500 block">اختر القسم للتعديل:</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-white font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
                    value={activeSectionId || ''}
                    onChange={(e) => setActiveSectionId(e.target.value || null)}
                  >
                    <option value="">-- اختر قسماً من القائمة --</option>
                    {(previewTemplateId === 'template_2' || newSelectedTemplate === 'template_2') ? (
                      <>
                        <option value="hero">البانر الرئيسي (الهيرو)</option>
                        <option value="about">عن الدورة وبطاقة الاستثمار</option>
                        <option value="features">بنية الدورة ومميزاتها</option>
                        <option value="chapters">المنهج ومحتوى الدورة</option>
                        <option value="instructor">بيانات واعتمادات المدرب</option>
                        <option value="benefits">ماذا ستحصل عليه (المخرجات)</option>
                        <option value="cta">البانر الختامي (CTA)</option>
                        <option value="footer">تذييل الصفحة (الفوتر)</option>
                        <option value="whatsapp">زر تواصل واتساب</option>
                      </>
                    ) : (previewTemplateId === 'template_3' || newSelectedTemplate === 'template_3') ? (
                      <>
                        <option value="hero">البانر الرئيسي (الهيرو)</option>
                        <option value="learning">ماذا ستتعلم في الدورة</option>
                        <option value="chapters">محتوى الدورة والمنهج</option>
                        <option value="instructor">عن المحاضر والمدرب</option>
                        <option value="faq">الأسئلة الشائعة حول البرنامج</option>
                        <option value="payment">بطاقة ورسوم الاشتراك</option>
                        <option value="whatsapp">زر تواصل واتساب</option>
                      </>
                    ) : (
                      <>
                        <option value="hero">البانر الرئيسي (الهيرو)</option>
                        <option value="learning">ماذا ستتعلم؟</option>
                        <option value="chapters">المنهج والدروس</option>
                        <option value="payment">وسائل الدفع</option>
                        <option value="faq">الأسئلة الشائعة</option>
                        <option value="reviews">آراء الطلاب والتقييمات</option>
                        <option value="whatsapp">زر تواصل واتساب</option>
                        <option value="footer">تذييل الصفحة (الفوتر)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="flex-grow overflow-y-auto">
                  {(() => {
                    const sec = (activeSectionId || '').toLowerCase().trim();
                    if (!sec) {
                      return (
                        <div className="text-center py-16 text-slate-400 font-bold text-xs">
                          👈 اختر قسماً من القائمة أعلاه أو انقر فوق زر "تعديل القسم" مباشرة لتعديل إعداداته هنا.
                        </div>
                      );
                    }

                    if (previewTemplateId === 'template_2' || newSelectedTemplate === 'template_2') {
                      switch (sec) {
                        case 'hero':
                        case 'overview':
                        case 'intro':
                        case 'banner':
                        case 'header':
                        case 'main':
                          return <Template2HeroEditor />;
                        case 'about':
                        case 'learning':
                          return <Template2AboutEditor />;
                        case 'features':
                          return <Template2FeaturesEditor />;
                        case 'chapters':
                        case 'curriculum':
                        case 'syllabus':
                        case 'content':
                        case 'modules':
                        case 'units':
                          return <ChapterEditor />;
                        case 'instructor':
                          return <Template2InstructorEditor />;
                        case 'benefits':
                          return <Template2BenefitsEditor />;
                        case 'cta':
                        case 'payment':
                        case 'pricing':
                          return <Template2CtaEditor />;
                        case 'footer':
                        case 'bottom':
                          return <FooterEditor />;
                        case 'whatsapp':
                        case 'contact':
                        case 'support':
                        case 'chat':
                          return <WhatsAppEditor />;
                        default:
                          return <Template2HeroEditor />;
                      }
                    }

                    if (previewTemplateId === 'template_3' || newSelectedTemplate === 'template_3') {
                      switch (sec) {
                        case 'hero':
                        case 'overview':
                        case 'intro':
                        case 'banner':
                        case 'header':
                        case 'main':
                          return <Template3HeroEditor />;
                        case 'learning':
                        case 'features':
                        case 'benefits':
                        case 'outcomes':
                        case 'about':
                          return <LearningEditor />;
                        case 'chapters':
                        case 'curriculum':
                        case 'syllabus':
                        case 'content':
                        case 'modules':
                        case 'units':
                          return <ChapterEditor />;
                        case 'instructor':
                        case 'trainer':
                        case 'teacher':
                          return <Template3InstructorEditor />;
                        case 'faq':
                        case 'questions':
                        case 'help':
                          return <FAQEditor />;
                        case 'payment':
                        case 'pricing':
                        case 'packages':
                        case 'checkout':
                          return <Template3PricingEditor />;
                        case 'whatsapp':
                        case 'contact':
                        case 'support':
                        case 'chat':
                          return <WhatsAppEditor />;
                        default:
                          return <Template3HeroEditor />;
                      }
                    }

                    const key = 
                      ['hero', 'overview', 'intro', 'banner', 'header', 'main'].includes(sec) ? 'hero' :
                      ['learning', 'features', 'benefits', 'outcomes', 'about'].includes(sec) ? 'learning' :
                      ['chapters', 'curriculum', 'syllabus', 'content', 'modules', 'units'].includes(sec) ? 'chapters' :
                      ['payment', 'pricing', 'packages', 'checkout'].includes(sec) ? 'payment' :
                      ['faq', 'questions', 'help'].includes(sec) ? 'faq' :
                      ['reviews', 'testimonials', 'ratings', 'students'].includes(sec) ? 'reviews' :
                      ['whatsapp', 'contact', 'support', 'chat'].includes(sec) ? 'whatsapp' :
                      ['footer', 'bottom'].includes(sec) ? 'footer' : (sec ? 'hero' : '');

                    if (key === 'hero') return <HeroEditor />;
                    if (key === 'learning') return <LearningEditor />;
                    if (key === 'chapters') return <ChapterEditor />;
                    if (key === 'payment') return <PaymentEditor />;
                    if (key === 'faq') return <FAQEditor />;
                    if (key === 'reviews') return <ReviewsEditor />;
                    if (key === 'whatsapp') return <WhatsAppEditor />;
                    if (key === 'footer') return <FooterEditor />;
                    return (
                      <div className="text-center py-16 text-slate-400 font-bold text-xs">
                        👈 اختر قسماً من القائمة أعلاه أو انقر فوق زر "تعديل القسم" مباشرة لتعديل إعداداته هنا.
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Column: Live Interactive Preview (Flex fill) */}
              <div className="flex-1 bg-slate-100 p-4 flex flex-col min-h-[600px] overflow-hidden">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden flex-1 flex flex-col relative" style={{ minHeight: 550 }}>
                  <div className="absolute inset-0 overflow-y-auto">
                    <LandingRenderer
                      courseId={courseId || undefined}
                      isEditable={true}
                      landingPageId={previewLandingPageId || undefined}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creation Dialog Modal */}
      {isCreateLandingModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-250" dir="rtl">
          <div 
            className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl p-8 border border-slate-100 animate-in zoom-in-95 duration-250 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsCreateLandingModalOpen(false)}
              className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-black text-slate-900 mb-2">إنشاء صفحة بيع جديدة</h2>
            <p className="text-xs font-bold text-slate-400 mb-6">اختر اسماً للحملة وحدد القالب والروابط المخصصة للبدء في التصميم</p>

            <form onSubmit={handleCreateLandingPage} className="space-y-5 text-right">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">اسم الحملة التسويقية *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عرض الجمعة البيضاء، حملة رمضان..."
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-800">اختر قالب التصميم المطلوب *</label>
                  <span className="text-[10px] text-blue-600 font-bold">معاينة مباشرة لكل قالب قبل الاعتماد</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Template 1 Choice */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setNewSelectedTemplate('template_1')}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setNewSelectedTemplate('template_1'); }}
                    className={`p-4 border-2 rounded-2xl transition-all duration-300 flex flex-col gap-3 cursor-pointer relative hover:scale-[1.02] hover:shadow-md ${
                      newSelectedTemplate === 'template_1'
                        ? 'border-blue-600 bg-blue-50/10 ring-2 ring-blue-600/10'
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/40'
                    }`}
                  >
                    {newSelectedTemplate === 'template_1' && (
                      <div className="absolute top-2 right-2 z-20 bg-blue-600 text-white rounded-full p-0.5 shadow-md">
                        <Check size={10} />
                      </div>
                    )}
                    {/* CSS Mockup */}
                    <div className="w-full h-24 bg-gradient-to-br from-[#082A24] to-[#041512] rounded-xl border border-slate-700/30 overflow-hidden flex flex-col relative select-none shadow-inner">
                      {/* Preview Button */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate('template_1');
                        }}
                        className="absolute top-2 left-2 z-10 bg-white/95 hover:bg-white text-blue-600 hover:text-blue-700 px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-[9px] font-black border border-slate-200/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Eye size={10} />
                        معاينة
                      </div>
                      <div className="h-7 bg-black/25 p-1 flex flex-col gap-0.5 justify-center">
                        <div className="w-8 h-0.5 bg-[#C9A24B] rounded"></div>
                        <div className="w-12 h-1 bg-white/40 rounded"></div>
                      </div>
                      <div className="flex-grow p-1.5 flex gap-1.5">
                        <div className="flex-grow bg-white/5 rounded p-1 flex flex-col gap-1">
                          <div className="w-6 h-0.5 bg-white/80 rounded"></div>
                          <div className="w-full h-0.5 bg-white/30 rounded"></div>
                        </div>
                        <div className="w-6 bg-white/5 rounded p-1 flex flex-col gap-1 items-center justify-center">
                          <div className="w-full h-2 bg-[#C9A24B]/80 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block font-bold text-right">الكلاسيكي الملكي</span>
                      <span className="text-[9px] text-slate-400 font-bold leading-normal block mt-0.5 text-right font-bold">تصميم زمردي دافئ وعروض إحصائيات</span>
                    </div>
                  </div>

                  {/* Template 2 Choice */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setNewSelectedTemplate('template_2')}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setNewSelectedTemplate('template_2'); }}
                    className={`p-4 border-2 rounded-2xl transition-all duration-300 flex flex-col gap-3 cursor-pointer relative hover:scale-[1.02] hover:shadow-md ${
                      newSelectedTemplate === 'template_2'
                        ? 'border-blue-600 bg-blue-50/10 ring-2 ring-blue-600/10'
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/40'
                    }`}
                  >
                    {newSelectedTemplate === 'template_2' && (
                      <div className="absolute top-2 right-2 z-20 bg-blue-600 text-white rounded-full p-0.5 shadow-md">
                        <Check size={10} />
                      </div>
                    )}
                    {/* CSS Mockup */}
                    <div className="w-full h-24 bg-gradient-to-br from-[#0040a7] to-[#002868] rounded-xl border border-slate-700/30 overflow-hidden flex flex-col relative select-none shadow-inner">
                      {/* Preview Button */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate('template_2');
                        }}
                        className="absolute top-2 left-2 z-10 bg-white/95 hover:bg-white text-blue-600 hover:text-blue-700 px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-[9px] font-black border border-slate-200/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Eye size={10} />
                        معاينة
                      </div>
                      <div className="h-6 bg-black/10 flex items-center justify-between px-1.5 border-b border-white/5">
                        <div className="w-4 h-0.5 bg-white/70 rounded"></div>
                      </div>
                      <div className="flex-grow p-1.5 flex gap-1.5 items-center">
                        <div className="flex-grow flex flex-col gap-1">
                          <div className="w-10 h-1 bg-white/90 rounded"></div>
                          <div className="w-full h-0.5 bg-white/40 rounded"></div>
                        </div>
                        <div className="w-10 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center shrink-0">
                          <div className="w-2.5 h-2.5 bg-white/40 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block font-bold text-right">الافتراضي التفاعلي</span>
                  </div>
                </div>
              </div>
            </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">الرابط المخصص (Slug) (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: ramadan-offer"
                  value={newCustomSlug}
                  onChange={(e) => setNewCustomSlug(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-left font-bold"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingLanding}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isCreatingLanding ? <Loader2 className="animate-spin" size={16} /> : 'إنشاء وتعديل صفحة الهبوط'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          templateId={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => {
            setNewSelectedTemplate(previewTemplate);
            setPreviewTemplate(null);
          }}
        />
      )}

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-250" dir="rtl">
          <div 
            className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 border border-slate-100 animate-in zoom-in-95 duration-250 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowAddPaymentModal(false)}
              className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-black text-slate-900 mb-2">إضافة حساب استقبال جديد</h2>
            <p className="text-xs font-bold text-slate-400 mb-6">أدخل بيانات وسيلة الدفع التي ترغب في تفعيلها لاستقبال مستحقات الطلاب بهذه العملة ({currency})</p>

            <form onSubmit={handleCreatePaymentMethod} className="space-y-5 text-right">
              {/* Template Select Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">نوع وسيلة الاستقبال *</label>
                <select
                  value={newPaymentTemplateId}
                  onChange={(e) => {
                    setNewPaymentTemplateId(e.target.value);
                    const countryCode = currency === 'EGP' ? 'EG' : 'SA';
                    const filtered = receiverTemplates.filter(t => t.country_code === countryCode);
                    const tmpl = filtered.find(t => t.id.toString() === e.target.value);
                    if (tmpl) {
                      setNewPaymentCustomName(tmpl.name);
                    }
                  }}
                  required
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold bg-white"
                >
                  <option value="">اختر النوع...</option>
                  {(() => {
                    const countryCode = currency === 'EGP' ? 'EG' : 'SA';
                    const filtered = receiverTemplates.filter(t => t.country_code === countryCode);
                    return (filtered.length > 0 ? filtered : receiverTemplates).map(tmpl => (
                      <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
                    ));
                  })()}
                </select>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">اسم الحساب التوضيحي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حساب البنك الأهلي، رقم كاش..."
                  value={newPaymentCustomName}
                  onChange={(e) => setNewPaymentCustomName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                />
              </div>

              {/* Account Value Input */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">رقم الحساب / رقم الهاتف *</label>
                <input
                  type="text"
                  required
                  placeholder="أدخل رقم الحساب أو المحفظة هنا..."
                  value={newPaymentAccountValue}
                  onChange={(e) => setNewPaymentAccountValue(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold text-left"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingNewPayment}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isSavingNewPayment ? <Loader2 className="animate-spin" size={16} /> : 'حفظ وتفعيل الحساب'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
