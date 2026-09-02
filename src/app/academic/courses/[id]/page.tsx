'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, ChevronDown, ChevronUp, Play, FileText, FilePieChart as FilePowerpoint, Trash2, Pencil, Video, CheckCircle2, Upload, Eye, Landmark, X, Check, User as UserIcon, Loader2, Globe, Copy, MoreVertical, ExternalLink, Clock, Share2, ImagePlus, Info, GraduationCap, History, CreditCard, Tag, Sparkles, Layers, Star, LayoutGrid, Link as LinkIcon, Monitor, Tablet, Smartphone } from 'lucide-react';
import { getCourse, deleteUnit, deleteLesson, createUnit, updateCourse, getCategories, createCategory } from '@/services/courses';
import { getGrades, getTerms, getSubjects, getAcademicYears, ClassificationItem } from '@/services/academic-classification';
import { getProfileStatus } from '@/services/auth';
import { getUsers, createUser } from '@/services/users';
import { Course, Unit, Lesson, User, ReceiverAccount } from '@/types/api';
import { AcademyPaymentMethod, PaymentMethod } from '@/types/payment';
import AddLessonModal from '@/components/Academic/Modals/AddLessonModal';
import AddClassificationModal from '@/components/Academic/Modals/AddClassificationModal';
import AddCategoryModal from '@/components/Academic/Modals/AddCategoryModal';
import AddCoachModal from '@/components/Academic/Modals/AddCoachModal';
import EditUnitModal from '@/components/Academic/Modals/EditUnitModal';
import EditLessonModal from '@/components/Academic/Modals/EditLessonModal';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import QuillEditor from '@/components/Academic/QuillEditor';
import { CoachField } from '@/components/course/CoachField';
import { CourseStatusToggle } from '@/components/course/CourseStatusToggle';
import { PaymentMethodDropdown } from '@/components/payment/PaymentMethodDropdown';
import { PaymentMethodValueInput } from '@/components/payment/PaymentMethodValueInput';
import { showAlert } from '@/lib/sweetalert';
import { getUserPaymentInfos, UserPaymentInfo, getReceiverAccounts } from '@/services/finance';
import { getLogoUrl, getErrorMessage } from '@/lib/utils';
import { SearchableSelect } from '@/components/Academic/Common/SearchableSelect';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';
import { useLandingStore } from '@/modules/landing/store/landingStore';
import TemplatePreviewModal from '@/modules/landing/components/TemplatePreviewModal';
import { useLandingSave } from '@/modules/landing/hooks/useLandingSave';
import { getLandingPagesList, createLandingPage, updateLandingPage, deleteLandingPage } from '@/modules/landing/services/landing.api';
import { getTemplateDefaultContent } from '@/modules/landing/constants/defaultContent';
// Section Editors - Template 1
import Template1HeroEditor from '@/modules/landing/editor/template1/Template1HeroEditor';
import Template1LearningEditor from '@/modules/landing/editor/template1/Template1LearningEditor';
import Template1ChapterEditor from '@/modules/landing/editor/template1/Template1ChapterEditor';
import Template1PaymentEditor from '@/modules/landing/editor/template1/Template1PaymentEditor';
import Template1FAQEditor from '@/modules/landing/editor/template1/Template1FAQEditor';
import Template1FooterEditor from '@/modules/landing/editor/template1/Template1FooterEditor';
import Template1ReviewsEditor from '@/modules/landing/editor/template1/Template1ReviewsEditor';
import Template1WhatsAppEditor from '@/modules/landing/editor/template1/Template1WhatsAppEditor';


// Section Editors - Template 2 (Modern)
import Template2HeroEditor from '@/modules/landing/editor/template2/Template2HeroEditor';
import Template2AboutEditor from '@/modules/landing/editor/template2/Template2AboutEditor';
import Template2FeaturesEditor from '@/modules/landing/editor/template2/Template2FeaturesEditor';
import Template2CurriculumEditor from '@/modules/landing/editor/template2/Template2CurriculumEditor';
import Template2InstructorEditor from '@/modules/landing/editor/template2/Template2InstructorEditor';
import Template2BenefitsEditor from '@/modules/landing/editor/template2/Template2BenefitsEditor';
import Template2CtaEditor from '@/modules/landing/editor/template2/Template2CtaEditor';
import Template2FooterEditor from '@/modules/landing/editor/template2/Template2FooterEditor';


// Section Editors - Template 3 (UI/UX / Academy)
import Template3HeroEditor from '@/modules/landing/editor/template3/Template3HeroEditor';
import Template3LearningEditor from '@/modules/landing/editor/template3/Template3LearningEditor';
import Template3CurriculumEditor from '@/modules/landing/editor/template3/Template3CurriculumEditor';
import Template3InstructorEditor from '@/modules/landing/editor/template3/Template3InstructorEditor';
import Template3FAQEditor from '@/modules/landing/editor/template3/Template3FAQEditor';
import Template3RequirementsEditor from '@/modules/landing/editor/template3/Template3RequirementsEditor';
import Template3PricingEditor from '@/modules/landing/editor/template3/Template3PricingEditor';



import ManageSubscribersView from '@/components/Academic/Subscribers/ManageSubscribersView';

const MySwal = withReactContent(Swal);

// --- Inline Form Components ---

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
        <label className="block text-sm font-black text-gray-900 text-right pr-1">
          اسم الفئة <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: التصوير الفوتوغرافي، البرمجة..."
          className={`w-full p-4 bg-gray-50 border ${errors.name ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl outline-none focus:bg-white font-bold text-right transition-all text-gray-900`}
          autoFocus
        />
        {errors.name && (
          <p className="flex items-center gap-1 text-red-500 text-xs font-bold px-1 mt-1">
            <X size={12} />
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <Check size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900">حالة الفئة</p>
            <p className="text-xs font-bold text-gray-400">{isActive ? 'الفئة نشطة وستظهر للطلاب' : 'الفئة غير نشطة ولن تظهر'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`w-14 h-8 rounded-full transition-all relative ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isActive ? 'right-7' : 'right-1'}`} />
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
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
          className="px-8 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};

const CoachFormInline = ({
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'academy',
    status: 'active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('يرجى تعبئة الحقول المطلوبة');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-gray-900 pr-1 text-right">
            الاسم بالكامل <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="مثال: أحمد محمد"
            className={`w-full p-4 bg-gray-50 border ${errors.name ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl outline-none focus:bg-white font-bold text-sm transition-all text-gray-900 text-right`}
            required
            autoFocus
          />
          {errors.name && <p className="text-red-500 text-xs font-bold text-right">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-gray-900 pr-1 text-right">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className={`w-full p-4 bg-gray-50 border ${errors.email ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl outline-none focus:bg-white font-bold text-sm transition-all text-gray-900 text-right`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs font-bold text-right">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-gray-900 pr-1 text-right">رقم الجوال</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="05X XXX XXXX"
            className={`w-full p-4 bg-gray-50 border ${errors.phone ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl outline-none focus:bg-white font-bold text-sm transition-all text-gray-900 text-right`}
            dir="ltr"
          />
          {errors.phone && <p className="text-red-500 text-xs font-bold text-right">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-gray-900 pr-1 text-right">
            كلمة المرور <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="كلمة مرور قوية"
            className={`w-full p-4 bg-gray-50 border ${errors.password ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl outline-none focus:bg-white font-bold text-sm transition-all text-gray-900 text-right`}
            required
          />
          {errors.password && <p className="text-red-500 text-xs font-bold text-right">{errors.password}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Check size={20} />
              <span>حفظ بيانات المدرب</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-8 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};


const translateErrorToArabic = (msg: string): string => {
  const normalized = msg.toLowerCase().trim();
  if (normalized.includes('receiver_accounts') || normalized.includes('receiver accounts') || normalized.includes('receiving account') || normalized.includes('receiving_account') || normalized.includes('receiver')) {
    return 'يرجى تحديد حساب أو وسيلة استقبال المدفوعات (حساب التحصيل مطلوب للدورات المدفوعة).';
  }
  if (normalized.includes('title') && normalized.includes('required')) {
    return 'عنوان الدورة مطلوب.';
  }
  if (normalized.includes('description') && (normalized.includes('required') || normalized.includes('must not be empty'))) {
    return 'وصف الدورة مطلوب.';
  }
  if (normalized.includes('category') && normalized.includes('required')) {
    return 'الفئة مطلوبة.';
  }
  if (normalized.includes('user') && normalized.includes('required')) {
    return 'المدرب مطلوب.';
  }
  if (normalized.includes('price') && normalized.includes('required')) {
    return 'سعر الدورة مطلوب للدورات المدفوعة.';
  }
  if (normalized.includes('validation errors detected')) {
    return 'يرجى تصحيح الأخطاء في البيانات المدخلة.';
  }
  return msg;
};

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [academyPaymentMethods, setAcademyPaymentMethods] = useState<UserPaymentInfo[]>([]);

  // Global Data
  const [categories, setCategories] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Inline Add Unit State
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitDescription, setNewUnitDescription] = useState('');
  const [isSavingUnit, setIsSavingUnit] = useState(false);
  // Modals State
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedUnitTitle, setSelectedUnitTitle] = useState<string>('');

  // Edit State
  const [isEditUnitOpen, setIsEditUnitOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'pricing' | 'landing_pages' | 'subscribers'>('info');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      if (tabParam && ['info', 'content', 'pricing', 'landing_pages', 'subscribers'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  const getActiveTabErrors = () => {
    const infoFields = ['title', 'category_id', 'description', 'image', 'user_id', 'coach'];
    const pricingFields = ['price', 'receiver_accounts', 'currency', 'price_type'];

    return Object.entries(errors).filter(([key, msg]) => {
      const val = Array.isArray(msg) ? msg[0] : msg;
      if (!val) return false;

      if (activeTab === 'info') {
        return infoFields.includes(key);
      }
      if (activeTab === 'pricing') {
        return pricingFields.includes(key);
      }
      return false;
    });
  };

  // Course Status
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [coachName, setCoachName] = useState('');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<AcademyPaymentMethod[]>([]);

  // Landing Pages Tab State
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [loadingLandingPages, setLoadingLandingPages] = useState(false);
  const [previewLandingPageId, setPreviewLandingPageId] = useState<string | number | null>(null);

  // Inline Landing Editor State (No Navigation)
  const [inlineEditingTemplate, setInlineEditingTemplate] = useState<string | null>(null);
  const [inlineEditingPage, setInlineEditingPage] = useState<any | null>(null);
  const [inlineViewport, setInlineViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleStartInlineEdit = (templateName: string, pageData?: any) => {
    if (!course) return;
    const store = useLandingStore.getState();
    store.setCourseData(course);
    if (pageData) {
      store.setLandingPageData({
        id: pageData.id,
        template_name: pageData.template_name || templateName,
        is_active: pageData.is_active,
        content: pageData.content,
        course_id: pageData.course_id,
        user_id: pageData.user_id || currentUser?.id || 1
      });
      setInlineEditingPage(pageData);
    } else {
      store.setTemplateName(templateName);
      const defaults = getTemplateDefaultContent(course, templateName);
      store.setLandingPageData({
        template_name: templateName,
        content: defaults,
        course_id: Number(id),
        user_id: currentUser?.id || 1
      });
      setInlineEditingPage(null);
    }
    setInlineEditingTemplate(templateName);
    store.setActiveSectionId('hero');
  };

  // New Landing Page Creation Dialog State
  const [isCreateLandingModalOpen, setIsCreateLandingModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newSelectedTemplate, setNewSelectedTemplate] = useState('template_1');
  const [newCustomSlug, setNewCustomSlug] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isCreatingLanding, setIsCreatingLanding] = useState(false);

  // Info Tab Form State
  const [courseInfo, setCourseInfo] = useState({
    title: '',
    description: '',
    target_audience: '',
    category_id: '',
    user_id: '',
  });

  // Custom added states to match HTML UI
  const [shortDescription, setShortDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isEditingSlug, setIsEditingSlug] = useState(false);

  const [gradeLevel, setGradeLevel] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [academicYear, setAcademicYear] = useState('2026/2027');

  // Academic Classification Options lists
  const [gradesList, setGradesList] = useState<ClassificationItem[]>([]);
  const [semestersList, setSemestersList] = useState<ClassificationItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<ClassificationItem[]>([]);
  const [academicYearsList, setAcademicYearsList] = useState<ClassificationItem[]>([]);

  // Modal State for adding Category/Coach/Grade/Subject/Term/Year pop-up
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddCoachModalOpen, setIsAddCoachModalOpen] = useState(false);
  const [addClassificationModal, setAddClassificationModal] = useState<{
    isOpen: boolean;
    type: 'grade' | 'semester' | 'subject' | 'year';
  }>({
    isOpen: false,
    type: 'grade',
  });

  const handleClassificationSuccess = async (type: 'grade' | 'semester' | 'subject' | 'year', newItem: any) => {
    try {
      const formatCls = (items: any[], isGrade = false) => {
        return (items || []).map((item: any, i: number) => ({
          id: item.id || String(i + 1).padStart(2, '0'),
          name: item.name || item.title || 'عنصر جديد',
          desc: item.desc || item.description || 'لا يوجد وصف',
          stage: item.stage || item.educational_stage || (isGrade ? 'المرحلة الثانوية' : 'عام'),
          academic_year: item.academic_year || item.academic_year_name || '2025/2026',
          active: item.active !== undefined ? item.active : true,
          grade_id: item.grade_id || item.grade?.id || '',
        }));
      };

      if (type === 'grade') {
        const updated = await getGrades();
        setGradesList(formatCls(updated, true));
        if (newItem?.id) setGradeLevel(String(newItem.id));
      } else if (type === 'subject') {
        const updated = await getSubjects();
        setSubjectsList(formatCls(updated));
        if (newItem?.id) setSubject(String(newItem.id));
      } else if (type === 'semester') {
        const updated = await getTerms();
        setSemestersList(formatCls(updated));
        if (newItem?.id) setSemester(String(newItem.id));
      } else if (type === 'year') {
        const updated = await getAcademicYears();
        setAcademicYearsList(formatCls(updated));
        if (newItem?.id) setAcademicYear(String(newItem.id));
      }
    } catch (e) {
      console.warn('Failed to refresh classification list:', e);
    }
  };

  const [targetAudienceList, setTargetAudienceList] = useState<string[]>(['']);

  const [isDiscounted, setIsDiscounted] = useState(false);
  const [discountPrice, setDiscountPrice] = useState('');
  const [discountEndDate, setDiscountEndDate] = useState('');

  const [accessDurationType, setAccessDurationType] = useState<'lifetime' | 'days' | 'date'>('lifetime');
  const [accessDays, setAccessDays] = useState('');
  const [accessUntilDate, setAccessUntilDate] = useState('');

  interface CustomSection {
    id: string;
    title: string;
    items: string[];
  }
  const [customSections, setCustomSections] = useState<CustomSection[]>([
    { id: 'what_you_will_learn', title: 'ماذا ستتعلم؟', items: [''] }
  ]);
  const [courseTemplate, setCourseTemplate] = useState<string>('template_1');
  const changeTemplate = (tpl: string) => {
    setCourseTemplate(tpl);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`darab_course_template_${id}`, tpl);
    }
  };
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  const activeSectionId = useLandingStore(state => state.activeSectionId);
  const setActiveSectionId = useLandingStore(state => state.setActiveSectionId);
  const { saving, handleSave } = useLandingSave();

  useEffect(() => {
    if (previewTemplateId && course && !previewLandingPageId) {
      const store = useLandingStore.getState();
      store.setTemplateName(previewTemplateId);
      store.setCourseData(course);
      if (currentUser?.id) {
        store.setUserId(currentUser.id);
      }
    }
  }, [previewTemplateId, course, currentUser, previewLandingPageId]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedInfoSections, setExpandedInfoSections] = useState<string[]>(['description']);

  // Pricing State
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('paid');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'EGP' | 'SAR'>('SAR');
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [receiverTemplates, setReceiverTemplates] = useState<ReceiverAccount[]>([]);

  const activeMethods: PaymentMethod[] = academyPaymentMethods
    .filter((m) => {
      if (m.currency !== currency) return false;
      const template = receiverTemplates.find((t) => t.id === m.receiver_account_id);
      const targetCountry = currency === 'EGP' ? 'EG' : 'SA';
      if (template) {
        if (template.country_code !== targetCountry) return false;
      } else if (m.receiver_account) {
        if (m.receiver_account.country_code !== targetCountry) return false;
      } else {
        const lowerName = m.name.toLowerCase();
        if (targetCountry === 'SA') {
          if (lowerName.includes('instapay') || lowerName.includes('vodafone') || lowerName.includes('fawry') || lowerName.includes('اتصالات') || lowerName.includes('فودافون')) {
            return false;
          }
        } else if (targetCountry === 'EG') {
          if (lowerName.includes('urpay') || lowerName.includes('stc') || lowerName.includes('mada') || lowerName.includes('مدى')) {
            return false;
          }
        }
      }
      return true;
    })
    .map(m => ({
      id: m.id.toString(),
      name: `${m.name} (${m.currency})`,
      type: 'account_number' as const,
      icon: 'credit-card',
      logo: m.logo,
      isActive: true,
      currency: m.currency
    }));

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

  // Sync academic info to/from local storage for this course
  useEffect(() => {
    try {
      const cached = localStorage.getItem(`darab_course_edit_academic_${id}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.gradeLevel) setGradeLevel(parsed.gradeLevel);
        if (parsed.semester) setSemester(parsed.semester);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.academicYear) setAcademicYear(parsed.academicYear);
      }

      const cachedPricing = localStorage.getItem(`darab_course_edit_pricing_${id}`);
      if (cachedPricing) {
        const parsed = JSON.parse(cachedPricing);
        if (parsed.isDiscounted !== undefined) setIsDiscounted(parsed.isDiscounted);
        if (parsed.discountPrice !== undefined) setDiscountPrice(parsed.discountPrice);
        if (parsed.discountEndDate !== undefined) setDiscountEndDate(parsed.discountEndDate);
        if (parsed.accessDurationType !== undefined) setAccessDurationType(parsed.accessDurationType);
        if (parsed.accessDays !== undefined) setAccessDays(parsed.accessDays);
        if (parsed.accessUntilDate !== undefined) setAccessUntilDate(parsed.accessUntilDate);
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  useEffect(() => {
    if (gradeLevel || semester || subject || academicYear) {
      localStorage.setItem(`darab_course_edit_academic_${id}`, JSON.stringify({
        gradeLevel,
        semester,
        subject,
        academicYear
      }));
    }
  }, [gradeLevel, semester, subject, academicYear, id]);

  useEffect(() => {
    localStorage.setItem(`darab_course_edit_pricing_${id}`, JSON.stringify({
      isDiscounted,
      discountPrice,
      discountEndDate,
      accessDurationType,
      accessDays,
      accessUntilDate
    }));
  }, [isDiscounted, discountPrice, discountEndDate, accessDurationType, accessDays, accessUntilDate, id]);



  const handleAddSectionItem = (sectionId: string) => {
    setCustomSections(prev => prev.map(sec =>
      sec.id === sectionId ? { ...sec, items: [...sec.items, ''] } : sec
    ));
  };

  const handleUpdateSectionItem = (sectionId: string, itemIndex: number, value: string) => {
    setCustomSections(prev => prev.map(sec => {
      if (sec.id === sectionId) {
        const newItems = [...sec.items];
        newItems[itemIndex] = value;
        return { ...sec, items: newItems };
      }
      return sec;
    }));
  };

  const handleRemoveSectionItem = (sectionId: string, itemIndex: number) => {
    setCustomSections(prev => prev.map(sec => {
      if (sec.id === sectionId) {
        const newItems = sec.items.filter((_, i) => i !== itemIndex);
        return { ...sec, items: newItems.length > 0 ? newItems : [''] };
      }
      return sec;
    }));
  };

  const handleAddCustomSection = () => {
    const newId = `section_${Date.now()}`;
    setCustomSections([...customSections, { id: newId, title: 'قسم جديد', items: [''] }]);
    if (!expandedInfoSections.includes(newId)) {
      setExpandedInfoSections([...expandedInfoSections, newId]);
    }
  };

  const handleUpdateSectionTitle = (sectionId: string, newTitle: string) => {
    setCustomSections(prev => prev.map(sec =>
      sec.id === sectionId ? { ...sec, title: newTitle } : sec
    ));
  };

  const handleRemoveSection = (sectionId: string) => {
    setCustomSections(prev => prev.filter(sec => sec.id !== sectionId));
  };

  const toggleInfoSection = (section: string) => {
    setExpandedInfoSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      if (errors.image) {
        setErrors(prev => {
          const next = { ...prev };
          delete next.image;
          return next;
        });
      }
    }
  };

  const handleNextFromInfo = () => {
    setActiveTab('content');
  };

  const handleTabChange = (targetTab: 'info' | 'content' | 'pricing' | 'landing_pages' | 'subscribers') => {
    setActiveTab(targetTab);
  };


  const activeGrades = gradesList.length > 0 ? gradesList : [
    { id: 'first_sec', name: 'أولى ثانوي' },
    { id: 'second_sec', name: 'ثانية ثانوي' },
    { id: 'third_sec', name: 'ثالثة ثانوي' }
  ];

  const activeSemesters = semestersList.length > 0
    ? semestersList.filter(item => !gradeLevel || !item.grade_id || String(item.grade_id) === String(gradeLevel))
    : [
      { id: 'term_1', name: 'الترم الأول' },
      { id: 'term_2', name: 'الترم الثاني' },
      { id: 'full_year', name: 'العام الدراسي كامل' },
      { id: 'final_review', name: 'مراجعة نهائية' },
      { id: 'not_linked', name: 'غير مرتبط بترم' }
    ];

  const activeSubjects = subjectsList.length > 0
    ? subjectsList.filter(item => !gradeLevel || !item.grade_id || String(item.grade_id) === String(gradeLevel))
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

  const handleSaveCourseInfo = async (shouldNavigate = false) => {
    setErrors({});
    const newErrors: Record<string, any> = {};
    if (!courseInfo.title.trim()) newErrors.title = 'عنوان الدورة مطلوب';
    if (!courseInfo.description.trim() || courseInfo.description === '<p><br></p>') newErrors.description = 'وصف الدورة مطلوب';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('يرجى ملء الحقول المطلوبة وتصحيح الأخطاء');
      return;
    }

    try {
      const targetAudienceStr = targetAudienceList.filter(Boolean).join('، ');

      const totalLessons = course?.units?.reduce((acc: number, unit: any) => acc + (unit.lessons?.length || 0), 0) || 0;
      let targetStatus = status;
      if (targetStatus === 'published' && totalLessons === 0) {
        toast.error('لا يمكن نشر الدورة بدون وجود دروس تعليمية. تم تحويل الدورة لمسودة.');
        targetStatus = 'draft';
        setStatus('draft');
      }

      const payload: any = {
        title: courseInfo.title,
        description: courseInfo.description || undefined,
        short_description: shortDescription || undefined,
        shortDescription: shortDescription || undefined,
        target_audience: targetAudienceStr || undefined,
        who_is_this_for: targetAudienceStr || undefined,
        category_id: courseInfo.category_id || undefined,
        user_id: courseInfo.user_id || undefined,
        coach: coachName,
        status: targetStatus,
        slug: slug || undefined,
        price: pricingType === 'free' ? 0 : Number(price || 0),
        final_price: pricingType === 'free' ? 0 : (isDiscounted && discountPrice ? Number(discountPrice) : Number(price || 0)),
        price_type: pricingType,
        currency: currency,
        receiver_accounts: selectedPaymentMethods.map(m => Number(m.methodId)),

        // Pricing & Access Options
        is_discounted: isDiscounted ? 1 : 0,
        isDiscounted: isDiscounted,
        discount_price: isDiscounted && discountPrice ? Number(discountPrice) : undefined,
        discountPrice: isDiscounted && discountPrice ? Number(discountPrice) : undefined,
        discount_end_date: isDiscounted && discountEndDate ? discountEndDate : undefined,
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

      // Add custom sections
      let infoIndex = 0;
      customSections.forEach((section) => {
        section.items.filter(p => p.trim() !== '').forEach((point, pointIndex) => {
          payload[`infos[${infoIndex}][info_key]`] = section.id === 'what_you_will_learn' ? 'what_you_will_learn' : section.title;
          payload[`infos[${infoIndex}][info_value]`] = point;
          payload[`infos[${infoIndex}][order]`] = pointIndex + 1;
          infoIndex++;
        });
      });

      // Add template info
      payload[`infos[${infoIndex}][info_key]`] = 'course_template';
      payload[`infos[${infoIndex}][info_value]`] = courseTemplate;
      payload[`infos[${infoIndex}][order]`] = 1;
      infoIndex++;

      if (selectedImage) {
        payload.image = selectedImage;
      }

      await updateCourse(Number(id), payload);
      toast.success('تم حفظ بيانات الدورة بنجاح');
      fetchCourse();
      if (shouldNavigate) {
        setActiveTab('content');
      }
    } catch (error: any) {
      if (error?.errors) {
        setErrors(error.errors);
        const allMsgs: string[] = [];
        if (error.message && error.message !== 'Validation errors detected.') {
          allMsgs.push(translateErrorToArabic(error.message));
        }
        Object.values(error.errors).forEach((msgs: any) => {
          const messages = Array.isArray(msgs) ? msgs : [String(msgs)];
          messages.forEach((msg) => allMsgs.push(translateErrorToArabic(msg)));
        });
        const toastMsg = allMsgs.length > 0 ? allMsgs.join(' | ') : 'يرجى تصحيح الأخطاء أدناه';
        toast.error(toastMsg);
      } else {
        toast.error(translateErrorToArabic(error?.message || 'فشل حفظ بيانات الدورة'));
      }
    }
  };

  const handleAddTargetAudience = () => {
    setTargetAudienceList(prev => [...prev, '']);
  };

  const handleUpdateTargetAudience = (index: number, val: string) => {
    setTargetAudienceList(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveTargetAudience = (index: number) => {
    setTargetAudienceList(prev => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [''];
    });
  };

  const handleSavePricing = async () => {
    setErrors({});
    setIsSavingPricing(true);

    if (pricingType === 'paid') {
      const clientErrors: Record<string, any> = {};
      if (!price || Number(price) <= 0) {
        clientErrors.price = ['سعر الدورة مطلوب للدورات المدفوعة ويجب أن يكون أكبر من 0'];
      }
      if (selectedPaymentMethods.length === 0) {
        clientErrors.receiver_accounts = ['يجب اختيار وسيلة دفع واحدة على الأقل للتحصيل.'];
      }

      if (Object.keys(clientErrors).length > 0) {
        setErrors(clientErrors);
        toast.error('يرجى تصحيح الأخطاء في صفحة التسعير');
        setIsSavingPricing(false);
        return;
      }
    }

    try {
      const totalLessons = course?.units?.reduce((acc: number, unit: any) => acc + (unit.lessons?.length || 0), 0) || 0;
      let targetStatus = status;
      if (targetStatus === 'published' && totalLessons === 0) {
        toast.error('لا يمكن نشر الدورة بدون وجود دروس تعليمية. تم تحويل الدورة لمسودة.');
        targetStatus = 'draft';
        setStatus('draft');
      }

      // Validate before saving if publishing
      if (targetStatus === 'published') {
        const missing = [];
        if (!courseInfo.title) missing.push('عنوان الدورة');
        if (!courseInfo.description) missing.push('وصف الدورة');
        if (pricingType === 'paid' && !price) missing.push('سعر الدورة');
        if (pricingType === 'paid' && selectedPaymentMethods.length === 0) missing.push('وسيلة دفع واحدة على الأقل');
        if (course?.units?.length === 0) missing.push('محتوى الدورة (وحدة واحدة على الأقل)');

        if (missing.length > 0) {
          showAlert.warning('لا يمكن النشر الآن', `يرجى إكمال الحقول التالية أولاً: \n ${missing.join('، ')}`);
          setIsSavingPricing(false);
          return;
        }
      }

      const payload: any = {
        price: pricingType === 'free' ? 0 : Number(price),
        final_price: pricingType === 'free' ? 0 : (isDiscounted && discountPrice ? Number(discountPrice) : Number(price)),
        price_type: pricingType,
        currency: currency,
        status: targetStatus,
        receiver_accounts: selectedPaymentMethods.map(m => Number(m.methodId)),

        // Pricing & Access Options
        is_discounted: isDiscounted ? 1 : 0,
        isDiscounted: isDiscounted,
        discount_price: isDiscounted && discountPrice ? Number(discountPrice) : undefined,
        discountPrice: isDiscounted && discountPrice ? Number(discountPrice) : undefined,
        discount_end_date: isDiscounted && discountEndDate ? discountEndDate : undefined,
        access_duration_type: accessDurationType,
        access_days: accessDurationType === 'days' && accessDays ? Number(accessDays) : undefined,
        access_until_date: ((accessDurationType as string) === 'until_date' || (accessDurationType as string) === 'date') && accessUntilDate ? accessUntilDate : undefined,
      };

      await updateCourse(Number(id), payload);
      toast.success('تم حفظ بيانات التسعير بنجاح');
      fetchCourse();
    } catch (error: any) {
      if (error?.errors) {
        setErrors(error.errors);
        const allMsgs: string[] = [];
        if (error.message && error.message !== 'Validation errors detected.') {
          allMsgs.push(translateErrorToArabic(error.message));
        }
        Object.values(error.errors).forEach((msgs: any) => {
          const messages = Array.isArray(msgs) ? msgs : [String(msgs)];
          messages.forEach((msg) => allMsgs.push(translateErrorToArabic(msg)));
        });
        const toastMsg = allMsgs.length > 0 ? allMsgs.join(' | ') : 'يرجى تصحيح الأخطاء أدناه';
        toast.error(toastMsg);
      } else {
        toast.error(translateErrorToArabic(error?.message || 'فشل حفظ بيانات التسعير'));
      }
    } finally {
      setIsSavingPricing(false);
    }
  };


  const fetchCourse = async () => {
    try {
      const [data, paymentInfos, grades, terms, subjects, years] = await Promise.all([
        getCourse(id),
        getUserPaymentInfos(),
        getGrades().catch(e => { console.warn('Failed to fetch grades:', e); return []; }),
        getTerms().catch(e => { console.warn('Failed to fetch terms:', e); return []; }),
        getSubjects().catch(e => { console.warn('Failed to fetch subjects:', e); return []; }),
        getAcademicYears().catch(e => { console.warn('Failed to fetch academic years:', e); return []; }),
      ]);

      // Map 'chapters' to 'units' if needed
      if ((data as any).chapters) {
        data.units = (data as any).chapters;
      }

      setCourse(data);
      if (data.image || (data as any).cover_image) {
        setPreviewImage(data.image || (data as any).cover_image);
      }
      setAcademyPaymentMethods(paymentInfos || []);

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
      setCourseInfo({
        title: data.title || '',
        description: data.description || '',
        target_audience: (data as any).target_audience || '',
        category_id: (data as any).category_id?.toString() || '',
        user_id: (data as any).user_id?.toString() || '',
      });
      setCoachName(data.coach || '');
      setSlug(data.slug || '');
      setShortDescription((data as any).short_description || (data as any).shortDescription || '');

      const whoFor = (data as any).target_audience || (data as any).who_is_this_for || '';
      if (whoFor) {
        setTargetAudienceList(whoFor.split(/[،,]/).map((s: string) => s.trim()).filter(Boolean));
      } else {
        setTargetAudienceList(['']);
      }
      const rawPaymentMethods = data.payment_methods || data.receiverAccounts || data.receiver_accounts || [];
      const returnedPaymentMethods = rawPaymentMethods.map((item: any) => {
        const val = item.value || item.accountValue || item.account_value || '';
        const name = item.name || item.receiver_account?.name || item.methodName || '';
        const currency = item.currency || 'SAR';

        // Robust matching against instructor's configured accounts
        const resolvedId = item.instructor_receiver_account_id ||
          item.pivot?.instructor_receiver_account_id ||
          item.pivot?.receiver_account_id ||
          item.id ||
          item.methodId ||
          item.method_id ||
          item.receiver_account_id;

        const matchedMethod = paymentInfos?.find((m: any) =>
          m.id.toString() === resolvedId?.toString() ||
          (m.accountValue && val && m.accountValue.toString().trim() === val.toString().trim()) ||
          (m.account_value && val && m.account_value.toString().trim() === val.toString().trim())
        );

        return {
          methodId: (matchedMethod?.id || resolvedId)?.toString() || '',
          methodName: matchedMethod?.name || name,
          type: 'account_number' as const,
          value: matchedMethod?.accountValue || matchedMethod?.account_value || val,
          currency: matchedMethod?.currency || currency,
          logo: matchedMethod?.logo || item.logo || item.receiver_account?.logo || undefined
        };
      });
      setSelectedPaymentMethods(returnedPaymentMethods);

      // Parse custom sections from infos
      let parsedSections: CustomSection[] = [];
      let resolvedCourseTemplate = 'template_1';
      if (data.infos && Array.isArray(data.infos) && data.infos.length > 0) {
        const grouped = data.infos.reduce((acc: any, info: any) => {
          // Using info_key and info_value based on the new API response structure
          const key = info.info_key || info.key;
          const value = info.info_value || info.value;

          if (!key || !value) return acc;

          if (key === 'course_template') {
            resolvedCourseTemplate = value;
            return acc;
          }

          if (!acc[key]) {
            acc[key] = {
              id: key,
              title: key === 'what_you_will_learn' ? 'ماذا ستتعلم؟' : key,
              items: []
            };
          }
          acc[key].items.push({ value, order: info.order || 0 });
          return acc;
        }, {});

        parsedSections = Object.values(grouped).map((group: any) => {
          // Sort items by order
          const sortedItems = group.items.sort((a: any, b: any) => a.order - b.order).map((i: any) => i.value);
          return {
            id: group.id,
            title: group.title,
            items: sortedItems.length > 0 ? sortedItems : ['']
          };
        });
      } else {
        // Fallback to what_you_will_learn string if infos didn't have any
        let points: string[] = [];
        try {
          if (data.what_you_will_learn) {
            const parsed = JSON.parse(data.what_you_will_learn);
            points = Array.isArray(parsed) ? parsed : [data.what_you_will_learn];
          }
        } catch (e) {
          if (data.what_you_will_learn) points = [data.what_you_will_learn];
        }
        parsedSections = [{ id: 'what_you_will_learn', title: 'ماذا ستتعلم؟', items: points.length > 0 ? points : [''] }];
      }

      setCustomSections(parsedSections);
      setCourseTemplate(resolvedCourseTemplate);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`darab_course_template_${id}`, resolvedCourseTemplate);
      }

      if (data.image) {
        setPreviewImage(data.image);
      }

      if (data.units) {
        setExpandedUnits(data.units.map(u => u.id));
      }

      setPricingType(data.price_type || (Number(data.price) === 0 ? 'free' : 'paid'));
      const basePrice = data.price || '';
      const finalPrice = data.final_price || '';
      setPrice(basePrice.toString());
      if (finalPrice && basePrice && parseFloat(finalPrice.toString()) < parseFloat(basePrice.toString())) {
        setIsDiscounted(true);
        setDiscountPrice(finalPrice.toString());
      } else {
        setIsDiscounted(false);
        setDiscountPrice('');
      }
      setCurrency((data.currency as any) || 'SAR');
      setStatus(data.status || 'draft');

    } catch (error) {
      console.error(error);
      toast.error('فشل تحميل بيانات الدورة');
    } finally {
      setLoading(false);
    }
  };

  const fetchLandingPages = async () => {
    if (!id) return;
    setLoadingLandingPages(true);
    try {
      const list = await getLandingPagesList();
      const coursePages = list.filter((item: any) => {
        const isCourseMatch = Number(item.course_id) === Number(id);
        const campaignName = item.content?.campaignName || item.campaignName || '';
        const isDummy = campaignName.includes('حمله إضافيه') ||
          campaignName.includes('حملة إضافية') ||
          item.slug === 'landing';
        return isCourseMatch && !isDummy;
      });
      setLandingPages(coursePages);

      // Sync to localStorage for hook compatibility
      localStorage.setItem('darab_landing_pages', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to fetch landing pages:', e);
    } finally {
      setLoadingLandingPages(false);
    }
  };

  const handleOpenEditor = (page: any) => {
    handleStartInlineEdit(page.template_name || 'template_1', page);
  };

  const handleTogglePublish = async (page: any) => {
    try {
      const nextStatus = !page.is_active;
      await updateLandingPage({
        id: page.id,
        template_name: page.template_name,
        content: page.content,
        is_active: nextStatus,
        course_id: Number(id),
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
      const defaultContent = getTemplateDefaultContent(course, newSelectedTemplate);
      const contentWithCampaign = {
        ...defaultContent,
        campaignName: newCampaignName.trim()
      };

      const payload = {
        template_name: newSelectedTemplate,
        content: contentWithCampaign,
        is_active: true,
        course_id: Number(id),
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
          courseTitle: course?.title || '',
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
        course_id: Number(id),
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
    if (status === 'draft' || course?.status === 'draft') {
      toast.error('لا يمكن مشاركة الدورة لأنها مسودة، يجب نشر الدورة أولاً');
      return;
    }
    if (typeof window !== 'undefined') {
      const targetSlug = page.slug || course?.slug || id;
      const link = `${window.location.origin}/landing/${targetSlug}?lp_id=${page.id}`;
      navigator.clipboard.writeText(link);
      toast.success('تم نسخ رابط صفحة البيع بنجاح!');
    }
  };

  const handleCopyDefaultLink = () => {
    if (status === 'draft' || course?.status === 'draft') {
      toast.error('لا يمكن مشاركة الدورة لأنها مسودة، يجب نشر الدورة أولاً');
      return;
    }
    if (typeof window !== 'undefined') {
      const link = `${window.location.origin}/courses/${course?.slug || id}`;
      navigator.clipboard.writeText(link);
      toast.success('تم نسخ رابط صفحة البيع الافتراضية بنجاح!');
    }
  };


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cats, profile, paymentInfos, templates] = await Promise.all([
          getCategories(),
          getProfileStatus(),
          getUserPaymentInfos(),
          getReceiverAccounts().catch(e => { console.warn('Failed to fetch receiver templates:', e); return []; })
        ]);
        setCategories(cats);
        setAcademyPaymentMethods(paymentInfos || []);
        setReceiverTemplates(templates || []);

        const userData = profile.data || profile;
        if (userData) {
          setCurrentUser(userData);
          const coaches = await getUsers('academy');
          setInstructors(coaches || []);
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (id) {
      fetchCourse();
      fetchLandingPages();
    }
  }, [id]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const handleAddLesson = (unitId: number, unitTitle: string) => {
    setSelectedUnitId(unitId);
    setSelectedUnitTitle(unitTitle);
    setIsAddLessonOpen(true);
  };

  const handleSaveUnit = async () => {
    if (!newUnitTitle.trim()) {
      toast.error('يرجى إدخال اسم الوحدة');
      return;
    }

    setIsSavingUnit(true);
    try {
      await createUnit({
        course_id: Number(id),
        title: newUnitTitle,
        description: newUnitDescription,
        order: (course?.units?.length || 0) + 1
      });
      toast.success('تم إضافة الوحدة بنجاح');
      setNewUnitTitle('');
      setNewUnitDescription('');
      setIsAddingUnit(false);
      fetchCourse();
    } catch (error) {
      toast.error('فشل إضافة الوحدة');
    } finally {
      setIsSavingUnit(false);
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الوحدة؟ سيتم حذف جميع الدروس بداخلها.')) {
      try {
        await deleteUnit(unitId);
        toast.success('تم حذف الوحدة');
        fetchCourse();
      } catch (error) {
        toast.error('فشل حذف الوحدة');
      }
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      try {
        await deleteLesson(lessonId);
        toast.success('تم حذف الدرس');
        fetchCourse();
      } catch (error) {
        toast.error('فشل حذف الدرس');
      }
    }
  };

  const handleEditUnit = (unitId: number) => {
    const unit = course?.units?.find(u => u.id === unitId);
    if (unit) {
      setEditingUnit(unit);
      setIsEditUnitOpen(true);
    }
  };

  const handleEditLesson = (lessonId: number) => {
    // Find lesson in all units
    let lesson: Lesson | undefined;
    course?.units?.forEach(u => {
      const found = u.lessons?.find(l => l.id === lessonId);
      if (found) lesson = found;
    });

    if (lesson) {
      setEditingLesson(lesson);
      setIsEditLessonOpen(true);
    }
  };

  const calculateProgress = () => {
    let score = 0;
    let total = 0;

    // Title (10 pts)
    total += 10;
    if (courseInfo.title && courseInfo.title.trim()) score += 10;

    // Description (15 pts)
    total += 15;
    if (courseInfo.description && courseInfo.description.trim()) score += 15;

    // Short Description (10 pts)
    total += 10;
    if (shortDescription && shortDescription.trim()) score += 10;

    // Category (10 pts)
    total += 10;
    if (courseInfo.category_id) score += 10;

    // Cover Image (15 pts)
    total += 15;
    if (previewImage) score += 15;

    // Target Audience (10 pts)
    total += 10;
    const cleanAudience = targetAudienceList.filter(item => item && item.trim());
    if (cleanAudience.length > 0) score += 10;

    // Learning Outcomes (10 pts)
    total += 10;
    const learnSection = customSections.find(s => s.id === 'what_you_will_learn');
    const cleanOutcomes = learnSection ? learnSection.items.filter(item => item && item.trim()) : [];
    if (cleanOutcomes.length > 0) score += 10;

    // Content Units (10 pts)
    total += 10;
    if (course?.units && course.units.length > 0) score += 10;

    // Pricing & Payments (10 pts)
    total += 10;
    if (pricingType === 'free') {
      score += 10;
    } else {
      if (price && parseFloat(price) > 0) score += 5;
      if (selectedPaymentMethods && selectedPaymentMethods.length > 0) score += 5;
    }

    return Math.round((score / total) * 100);
  };

  const progress = calculateProgress();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500 font-bold">جاري التحميل...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500 font-bold">لم يتم العثور على الدورة</div>;
  }

  return (
    <div className="flex-grow flex flex-col min-w-0 bg-[#f8f9fa] text-on-surface text-right" dir="rtl">
      {/* Persistent Top Header */}
      <header className="h-auto bg-[#f8f9fa] border-b border-outline-variant sticky top-0 z-40 px-6 py-4">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant bg-surface-container cursor-pointer hover:opacity-90 transition-all"
            >
              <img
                alt="Course Thumbnail"
                className="w-full h-full object-cover"
                src={previewImage || 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c'}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-title-md text-title-md text-gray-900">{courseInfo.title || 'عنوان الدورة'}</h2>
                <span className="px-2 py-0.5 bg-gray-200 text-label-sm text-gray-700 rounded">
                  {course?.type === 'recorded' ? 'مسجلة' : course?.type === 'online' ? 'تفاعلية' : 'أخرى'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-label-sm text-on-surface-variant font-bold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  الحالة: {status === 'published' ? 'منشور' : 'مسودة'}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 transition-all duration-350" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span className="text-label-sm font-bold text-emerald-600">جاهزية {progress}%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (course?.slug) {
                  router.push(`/courses/${course.slug}`);
                } else {
                  router.push(`/academic/courses/${id}/student`);
                }
              }}
              className="px-4 py-2 text-label-md border border-outline-variant rounded-lg flex items-center gap-2 bg-white text-gray-700 hover:bg-surface-container transition-all font-bold shadow-sm"
            >
              <Eye className="w-4 h-4" />
              معاينة
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const shareUrl = `${window.location.origin}/courses/${course?.slug || id}`;
                  if (navigator.share) {
                    navigator.share({
                      title: courseInfo.title || course?.title || 'دورة تعليمية',
                      text: (courseInfo.description || course?.description || '')?.replace(/<[^>]*>/g, '') || '',
                      url: shareUrl
                    }).catch(() => {
                      navigator.clipboard.writeText(shareUrl);
                      toast.success('تم نسخ رابط الدورة بنجاح!');
                    });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success('تم نسخ رابط الدورة بنجاح! يمكنك مشاركته على وسائل التواصل الاجتماعي.');
                  }
                }
              }}
              className="px-4 py-2 text-label-md border border-outline-variant rounded-lg flex items-center gap-2 bg-white text-gray-700 hover:bg-surface-container transition-all font-bold shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              مشاركة الدورة
            </button>
            <button
              type="button"
              onClick={() => handleSaveCourseInfo(false)}
              className="px-4 py-2 text-label-md border border-outline-variant rounded-lg bg-white text-gray-700 hover:bg-surface-container transition-all font-bold shadow-sm"
            >
              حفظ
            </button>
            {status === 'draft' ? (
              <button
                type="button"
                onClick={async () => {
                  const totalLessons = course?.units?.reduce((acc: number, unit: any) => acc + (unit.lessons?.length || 0), 0) || 0;
                  if (totalLessons === 0) {
                    toast.error('لا يمكن نشر الدورة بدون وجود دروس تعليمية. تم حفظ التغييرات كمسودة.');
                    await handleSaveCourseInfo(false);
                    return;
                  }

                  const missing = [];
                  if (!courseInfo.title) missing.push('عنوان الدورة');
                  if (!courseInfo.description || courseInfo.description === '<p><br></p>') missing.push('وصف الدورة');
                  if (pricingType === 'paid' && !price) missing.push('سعر الدورة');
                  if (pricingType === 'paid' && selectedPaymentMethods.length === 0) missing.push('وسيلة دفع واحدة على الأقل');
                  if (course?.units?.length === 0) missing.push('محتوى الدورة (وحدة واحدة على الأقل)');

                  if (missing.length > 0) {
                    showAlert.warning('لا يمكن النشر الآن', `يرجى إكمال الحقول التالية أولاً: \n ${missing.join('، ')}`);
                    return;
                  }

                  const result = await MySwal.fire({
                    title: 'هل أنت متأكد من نشر الدورة؟',
                    text: 'ستصبح الدورة نشطة ومتاحة للطلاب للتسجيل والاشتراك والتعلم.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#10b981',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'نعم، انشر الدورة',
                    cancelButtonText: 'إلغاء'
                  });
                  if (result.isConfirmed) {
                    try {
                      await updateCourse(Number(id), { status: 'published' });
                      setStatus('published');
                      toast.success('تم نشر الدورة بنجاح');
                      fetchCourse();
                    } catch (err) {
                      toast.error('فشل تحديث حالة الدورة');
                    }
                  }
                }}
                className="px-6 py-2 bg-primary text-white text-label-md font-bold rounded-lg hover:opacity-90 transition-all shadow-sm"
              >
                نشر الدورة
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  const result = await MySwal.fire({
                    title: 'هل أنت متأكد من تحويل الدورة إلى مسودة؟',
                    text: 'سيتم إخفاء الدورة عن الطلاب ولن يتمكنوا من التسجيل أو العثور عليها.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#f59e0b',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'نعم، اجعلها مسودة',
                    cancelButtonText: 'إلغاء'
                  });
                  if (result.isConfirmed) {
                    try {
                      await updateCourse(Number(id), { status: 'draft' });
                      setStatus('draft');
                      toast.success('تم تحويل الدورة لمسودة بنجاح');
                      fetchCourse();
                    } catch (err) {
                      toast.error('فشل تحديث حالة الدورة');
                    }
                  }
                }}
                className="px-6 py-2 bg-amber-500 text-white text-label-md font-bold rounded-lg hover:opacity-90 transition-all shadow-sm"
              >
                تحويل لمسودة
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sticky Tabs */}
      <nav className="bg-[#f8f9fa] border-b border-outline-variant sticky top-[97px] md:top-[81px] z-30">
        <div className="max-w-container-max mx-auto px-6 overflow-x-auto">
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => handleTabChange('info')}
              className={`relative py-4 text-label-md font-bold whitespace-nowrap transition-colors ${activeTab === 'info' ? 'text-primary font-black' : 'text-on-surface-variant hover:text-primary'}`}
            >
              المعلومات الأساسية
              {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('content')}
              className={`relative py-4 text-label-md font-bold whitespace-nowrap transition-colors ${activeTab === 'content' ? 'text-primary font-black' : 'text-on-surface-variant hover:text-primary'}`}
            >
              محتوى الدورة
              {activeTab === 'content' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('landing_pages')}
              className={`relative py-4 text-label-md font-bold whitespace-nowrap transition-colors ${activeTab === 'landing_pages' ? 'text-primary font-black' : 'text-on-surface-variant hover:text-primary'}`}
            >
              التسويق والبيع
              {activeTab === 'landing_pages' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('subscribers')}
              className={`relative py-4 text-label-md font-bold whitespace-nowrap transition-colors ${activeTab === 'subscribers' ? 'text-primary font-black' : 'text-on-surface-variant hover:text-primary'}`}
            >
              المشتركون والتقارير
              {activeTab === 'subscribers' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content Grid */}
      <div className="max-w-container-max mx-auto w-full px-6 py-8 flex-grow">
        {activeTab === 'info' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Section 1: Definition */}
            <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-title-md text-title-md text-gray-900">تعريف الدورة</h3>
              </div>

              {/* Title */}
              <div>
                <label className="block text-label-md mb-2 text-gray-900">اسم الدورة <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={courseInfo.title}
                  onChange={(e) => {
                    setCourseInfo({ ...courseInfo, title: e.target.value });
                    if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                  }}
                  className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-gray-900"
                  placeholder="مثال: أساسيات التصميم الجرافيكي للمبتدئين"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                    <X size={12} />
                    {translateErrorToArabic(Array.isArray(errors.title) ? errors.title[0] : String(errors.title))}
                  </p>
                )}
              </div>



              {/* Two-column layout: Image Upload and Short Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thumbnail upload (Right) */}
                <div className="order-2 md:order-2 space-y-2">
                  <label className="block text-label-md mb-2 text-gray-900">الصورة التعريفية (Thumbnail)</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-outline-variant rounded-lg h-36 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer overflow-hidden relative group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <img src={previewImage} alt="Course Preview" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-bold text-xs gap-1.5">
                          <Upload className="w-4 h-4" />
                          تغيير الصورة
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImagePlus className="w-8 h-8 text-slate-400" />
                        <span className="text-label-sm text-on-surface-variant mt-1 font-bold">اضغط لرفع صورة أو اسحبها هنا</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Short description text-area (Left) */}
                <div className="order-1 md:order-1 space-y-2">
                  <label className="block text-label-md mb-2 text-gray-900">الوصف المختصر</label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all h-36 resize-none text-sm text-gray-900 font-bold"
                    placeholder="اكتب وصفاً موجزاً يظهر في بطاقة الدورة..."
                  />
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <label className="block text-label-md text-gray-900">الوصف الكامل للدورة</label>
                <div className="bg-white rounded-lg border border-outline-variant overflow-hidden">
                  <QuillEditor
                    value={courseInfo.description}
                    onChange={(val) => {
                      setCourseInfo({ ...courseInfo, description: val });
                      if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                    }}
                    placeholder="اشرح بالتفصيل ماذا سيتعلم الطالب..."
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                    <X size={12} />
                    {translateErrorToArabic(Array.isArray(errors.description) ? errors.description[0] : String(errors.description))}
                  </p>
                )}
              </div>

              {/* Category and Coach selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-label-md mb-2 text-gray-900 font-bold">تصنيف / فئة الدورة</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={categories.map(c => ({ id: c.id, name: c.name }))}
                        value={courseInfo.category_id}
                        onChange={(val) => {
                          setCourseInfo({ ...courseInfo, category_id: val ? val.toString() : '' });
                          if (errors.category_id) setErrors(prev => ({ ...prev, category_id: null }));
                        }}
                        placeholder="اختر فئة (اختياري)"
                        error={errors.category_id ? translateErrorToArabic(Array.isArray(errors.category_id) ? errors.category_id[0] : String(errors.category_id)) : undefined}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddCategoryModalOpen(true)}
                      className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer h-[42px] self-start"
                      title="إضافة تصنيف جديد"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-label-md mb-2 text-gray-900 font-bold">المدرب / المحاضر</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={instructors.map(i => ({ id: i.id, name: i.name }))}
                        value={courseInfo.user_id}
                        onChange={(val) => {
                          setCourseInfo({ ...courseInfo, user_id: val ? val.toString() : '' });
                          if (val) {
                            const selectedInst = instructors.find(i => i.id.toString() === val.toString());
                            if (selectedInst) setCoachName(selectedInst.name || selectedInst.fullName || '');
                          } else {
                            setCoachName('');
                          }
                          if (errors.user_id) setErrors(prev => ({ ...prev, user_id: null }));
                        }}
                        placeholder="اختر مدرب (افتراضي: الحساب الحالي)"
                        error={errors.user_id ? translateErrorToArabic(Array.isArray(errors.user_id) ? errors.user_id[0] : String(errors.user_id)) : undefined}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddCoachModalOpen(true)}
                      className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer h-[42px] self-start"
                      title="إضافة مدرب جديد"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Academic Classification */}
            <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                  <h3 className="font-title-md text-title-md text-gray-900">التصنيف الدراسي</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAddClassificationModal({ isOpen: true, type: 'subject' })}
                  className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة مادة / صف</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-label-md mb-2 text-gray-900">الصف الدراسي</label>
                  <div className="flex gap-2">
                    <select
                      value={gradeLevel}
                      onChange={(e) => {
                        setGradeLevel(e.target.value);
                        setSemester('');
                        setSubject('');
                      }}
                      className="flex-1 border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 bg-white cursor-pointer"
                    >
                      <option value="">اختر الصف...</option>
                      {activeGrades.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setAddClassificationModal({ isOpen: true, type: 'grade' })}
                      className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer"
                      title="إضافة صف دراسي جديد"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-label-md mb-2 text-gray-900">الفصل الدراسي</label>
                  <div className="flex gap-2">
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="flex-1 border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 bg-white cursor-pointer"
                    >
                      <option value="">اختر الترم...</option>
                      {activeSemesters.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setAddClassificationModal({ isOpen: true, type: 'semester' })}
                      className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer"
                      title="إضافة فصل دراسي جديد"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-label-md mb-2 text-gray-900">المادة</label>
                  <div className="flex gap-2">
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="flex-1 border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 bg-white cursor-pointer"
                    >
                      <option value="">اختر المادة...</option>
                      {activeSubjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setAddClassificationModal({ isOpen: true, type: 'subject' })}
                      className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer"
                      title="إضافة مادة دراسية جديدة"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-label-md mb-2 text-gray-900">العام الدراسي</label>
                  <div className="flex gap-2">
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="flex-1 border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-bold text-gray-900 bg-white cursor-pointer"
                    >
                      <option value="">اختر العام الدراسي...</option>
                      {activeYears.map((y) => (
                        <option key={y.id} value={y.id}>
                          {y.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setAddClassificationModal({ isOpen: true, type: 'year' })}
                      className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer"
                      title="إضافة عام دراسي جديد"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Learning Details */}
            <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm space-y-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
                <h3 className="font-title-md text-title-md text-gray-900">تفاصيل التعلم</h3>
              </div>

              {/* Outcomes outcomes */}
              {(() => {
                const learnSec = customSections.find(s => s.id === 'what_you_will_learn') || { id: 'what_you_will_learn', title: 'ماذا ستتعلم؟', items: [''] };
                return (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-label-md font-bold text-gray-900">ماذا سيتعلم الطالب؟ (مخرجات التعلم)</label>
                      <button
                        type="button"
                        onClick={() => handleAddSectionItem('what_you_will_learn')}
                        className="text-primary text-label-sm font-bold flex items-center gap-1 hover:underline"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span> إضافة مخرج
                      </button>
                    </div>
                    <div className="space-y-3">
                      {learnSec.items.map((point, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            className="flex-grow border border-outline-variant rounded-lg px-4 py-2 text-sm text-gray-900 font-bold bg-gray-50/20"
                            type="text"
                            value={point}
                            onChange={(e) => handleUpdateSectionItem('what_you_will_learn', index, e.target.value)}
                            placeholder="مثال: فهم مبادئ الألوان وتناسقها"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSectionItem('what_you_will_learn', index)}
                            className="p-2 text-on-surface-variant hover:text-error transition-colors"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Target Audience outcomes */}
              <div className="hidden">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-label-md font-bold text-gray-900">الفئة المستهدفة</label>
                  <button
                    type="button"
                    onClick={handleAddTargetAudience}
                    className="text-primary text-label-sm font-bold flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span> إضافة فئة
                  </button>
                </div>
                <div className="space-y-3">
                  {targetAudienceList.map((audience, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className="flex-grow border border-outline-variant rounded-lg px-4 py-2 text-sm text-gray-900 font-bold bg-gray-50/20"
                        type="text"
                        value={audience}
                        onChange={(e) => handleUpdateTargetAudience(index, e.target.value)}
                        placeholder="مثال: الطلاب والراغبين في دخول مجال التصميم"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTargetAudience(index)}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 4: Access Duration */}
            <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                <h3 className="font-title-md text-title-md text-gray-900">مدة الوصول</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <label className={`flex-grow flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${accessDurationType === 'lifetime' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:bg-surface-container-low'}`}>
                  <input
                    type="radio"
                    name="access_duration"
                    checked={accessDurationType === 'lifetime'}
                    onChange={() => setAccessDurationType('lifetime')}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <span className="text-label-md font-bold text-gray-900">مدى الحياة</span>
                </label>
                <label className={`flex-grow flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${accessDurationType === 'days' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:bg-surface-container-low'}`}>
                  <input
                    type="radio"
                    name="access_duration"
                    checked={accessDurationType === 'days'}
                    onChange={() => setAccessDurationType('days')}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <span className="text-label-md font-bold text-gray-900">عدد أيام من الاشتراك</span>
                </label>
                <label className={`flex-grow flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${accessDurationType === 'date' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:bg-surface-container-low'}`}>
                  <input
                    type="radio"
                    name="access_duration"
                    checked={accessDurationType === 'date'}
                    onChange={() => setAccessDurationType('date')}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <span className="text-label-md font-bold text-gray-900">حتى تاريخ محدد</span>
                </label>
              </div>
              {accessDurationType === 'days' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">عدد الأيام</label>
                  <input
                    type="number"
                    value={accessDays}
                    onChange={(e) => setAccessDays(e.target.value)}
                    placeholder="مثال: 90"
                    className="border border-outline-variant rounded-lg px-4 py-2 w-full max-w-xs text-sm text-gray-900 font-bold bg-white outline-none focus:border-primary"
                  />
                </div>
              )}
              {accessDurationType === 'date' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">تاريخ انتهاء الوصول</label>
                  <input
                    type="date"
                    value={accessUntilDate}
                    onChange={(e) => setAccessUntilDate(e.target.value)}
                    className="border border-outline-variant rounded-lg px-4 py-2 w-full max-w-xs text-sm text-gray-900 font-bold bg-white outline-none focus:border-primary"
                  />
                </div>
              )}
            </section>

            {/* Section 5: Pricing & Collection accounts */}
            <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm overflow-hidden text-right space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                <h3 className="font-title-md text-title-md text-gray-900">التسعير وطرق التحصيل</h3>
              </div>

              {/* Pricing Options */}
              <div className="space-y-6">
                <div className="flex bg-surface-container p-1 rounded-lg w-fit border border-gray-100">
                  <button
                    type="button"
                    onClick={() => setPricingType('free')}
                    className={`px-8 py-2 rounded-md text-label-md font-bold transition-all ${pricingType === 'free' ? 'bg-white shadow-sm text-primary font-black' : 'text-on-surface-variant hover:text-gray-900'}`}
                  >
                    مجانية
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingType('paid')}
                    className={`px-8 py-2 rounded-md text-label-md font-bold transition-all ${pricingType === 'paid' ? 'bg-white shadow-sm text-primary font-black' : 'text-on-surface-variant hover:text-gray-900'}`}
                  >
                    مدفوعة
                  </button>
                </div>

                {pricingType === 'paid' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-label-md mb-2 text-gray-900">السعر الأساسي</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => {
                              setPrice(e.target.value);
                              if (errors.price) setErrors(prev => ({ ...prev, price: null }));
                            }}
                            placeholder="0.00"
                            className={`w-full border ${errors.price ? 'border-red-500 bg-red-50/20' : 'border-outline-variant'} rounded-lg px-4 py-2 pl-12 text-sm font-bold text-gray-900 bg-white`}
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant pointer-events-none font-bold text-xs">
                            {currency}
                          </div>
                        </div>
                        {errors.price && (
                          <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                            <X size={12} />
                            {translateErrorToArabic(Array.isArray(errors.price) ? errors.price[0] : String(errors.price))}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-label-md mb-2 text-gray-900">العملة</label>
                        <select
                          value={currency}
                          onChange={(e) => {
                            const newCurr = e.target.value as any;
                            setCurrency(newCurr);
                            setSelectedPaymentMethods([]);
                          }}
                          className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary text-sm font-bold text-gray-900 bg-white outline-none"
                        >
                          <option value="SAR">SAR — ريال سعودي</option>
                          <option value="EGP">EGP — جنيه مصري</option>
                          <option value="USD">USD — دولار أمريكي</option>
                        </select>
                      </div>
                    </div>


                  </div>
                )}
              </div>

              {/* Collection Accounts */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-gray-900">طرق التحصيل (وسائل الدفع)</h4>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">اختر وسائل الدفع التي تريد تفعيلها لهذه الدورة</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push('/academic/finance/payment-settings')}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    إدارة وسائل الدفع
                  </button>
                </div>

                <PaymentMethodDropdown
                  options={activeMethods}
                  selectedValues={selectedPaymentMethods.map(m => m.methodId)}
                  onChange={(ids) => {
                    if (ids.length > 3) {
                      MySwal.fire({
                        title: 'الحد الأقصى لوسائل الدفع',
                        text: 'يمكنك تحديد 3 وسائل دفع كحد أقصى لهذه الدورة.',
                        icon: 'warning',
                        confirmButtonText: 'حسناً',
                        confirmButtonColor: '#2563eb',
                      });
                      return;
                    }

                    const newMethods = ids.map(id => {
                      const existing = selectedPaymentMethods.find(m => m.methodId === id);
                      if (existing) return existing;
                      const method = activeMethods.find(m => m.id === id);
                      if (!method) return null;
                      const originalInfo = academyPaymentMethods.find(m => m.id.toString() === id);
                      return {
                        methodId: method.id,
                        methodName: method.name,
                        type: method.type,
                        value: originalInfo?.accountValue || originalInfo?.account_value || '',
                        currency: originalInfo?.currency || 'SAR',
                        logo: method.logo || originalInfo?.logo
                      };
                    }).filter(Boolean) as AcademyPaymentMethod[];
                    setSelectedPaymentMethods(newMethods);
                    if (errors.receiver_accounts) setErrors(prev => ({ ...prev, receiver_accounts: null }));
                  }}
                />
                {errors.receiver_accounts && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mt-2">
                    <X size={14} className="text-red-500 shrink-0" />
                    <p className="text-red-600 text-xs font-bold">
                      {translateErrorToArabic(Array.isArray(errors.receiver_accounts) ? errors.receiver_accounts[0] : String(errors.receiver_accounts || ''))}
                    </p>
                  </div>
                )}

                {selectedPaymentMethods.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
                    {selectedPaymentMethods.map((pm) => (
                      <div key={pm.methodId} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group/pm">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPaymentMethods(prev => prev.filter(m => m.methodId !== pm.methodId));
                          }}
                          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shadow-sm bg-white border border-slate-100"
                          title="إزالة وسيلة الدفع"
                        >
                          <Trash2 size={13} />
                        </button>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100/80 overflow-hidden shrink-0">
                            {pm.logo ? (
                              <img src={getLogoUrl(pm.logo)} alt={pm.methodName} className="w-full h-full object-cover" />
                            ) : (
                              <Landmark size={18} className="text-primary" />
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">الحساب المفعل</span>
                            <span className="font-black text-slate-900 text-sm mt-0.5">{pm.methodName}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-50 flex flex-col gap-1 text-right">
                          <span className="text-[10px] text-slate-400 font-bold block">رقم الحساب / المحفظة</span>
                          <div className="flex items-center justify-between gap-3 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 mt-1">
                            <span className="font-mono text-xs text-slate-700 font-bold break-all select-all">{pm.value}</span>
                            <span className="text-[9px] bg-blue-50 text-primary px-2 py-0.5 rounded font-black tracking-wider uppercase">{pm.currency}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Bottom tab buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => handleSaveCourseInfo(true)}
                className="px-12 py-3 bg-primary text-white font-black rounded-full shadow-lg shadow-blue-100 hover:brightness-110 transition-all text-sm"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header & Add Unit */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border border-outline-variant rounded-xl p-3 bg-white gap-3 shadow-sm">
              <div className="flex-grow text-center md:text-right px-4">
                <span className="font-bold text-gray-800 text-sm">
                  الاجمالي {course?.units?.length || 0} وحدة فقط | {course?.units?.reduce((acc: number, unit: any) => acc + (unit.lessons?.length || 0), 0) || 0} دروس
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingUnit(!isAddingUnit)}
                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
              >
                <Plus size={18} strokeWidth={3} />
                <span>اضافة وحدة</span>
              </button>
            </div>

            {/* Add Unit Form (Inline) */}
            {isAddingUnit && (
              <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
                <h3 className="text-lg font-black text-gray-900">ادخل بيانات الوحدة</h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500">اسم الوحدة</label>
                    <input
                      type="text"
                      value={newUnitTitle}
                      onChange={(e) => setNewUnitTitle(e.target.value)}
                      placeholder="ادخل اسم الوحدة"
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary font-bold text-sm transition-all text-gray-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500">وصف للوحدة</label>
                    <textarea
                      value={newUnitDescription}
                      onChange={(e) => setNewUnitDescription(e.target.value)}
                      placeholder="ادخل وصف للوحدة"
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary font-bold text-sm min-h-[80px] transition-all text-gray-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingUnit(false)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-200 transition-all text-sm"
                  >
                    الغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveUnit}
                    disabled={isSavingUnit}
                    className="px-10 py-2.5 bg-primary text-white font-bold rounded-full hover:brightness-110 transition-all disabled:opacity-70 text-sm shadow-lg shadow-blue-50"
                  >
                    {isSavingUnit ? 'جاري الحفظ...' : 'حفظ'}
                  </button>
                </div>
              </div>
            )}

            {/* Units List */}
            <div className="space-y-3">
              {course?.units && course.units.length > 0 ? (
                course.units.map((unit: any) => (
                  <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
                    {/* Unit Header */}
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                      onClick={() => toggleUnit(unit.id)}
                    >
                      <div className="flex items-center gap-3">
                        <button type="button" className="p-1.5 bg-gray-50 rounded-lg text-primary">
                          {expandedUnits.includes(unit.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div>
                          <h3 className="text-base md:text-lg font-black text-gray-900">{unit.title}</h3>
                          {unit.description && <p className="text-xs text-gray-400 font-bold mt-0.5">{unit.description}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleEditUnit(unit.id); }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleDeleteUnit(unit.id); }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Lessons List */}
                    {expandedUnits.includes(unit.id) && (
                      <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/30">
                        {unit.lessons && unit.lessons.length > 0 ? (
                          unit.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-outline-variant rounded-xl hover:border-primary/45 transition-all group shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${lesson.type === 'video' ? 'bg-blue-50 text-blue-600' :
                                    lesson.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                                  }`}>
                                  {lesson.type === 'video' ? <Video size={18} /> :
                                    lesson.type === 'pdf' ? <FileText size={18} /> : <FilePowerpoint size={18} />}
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-sm">{lesson.title}</h4>
                                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-0.5">
                                    <span>{lesson.type === 'video' ? 'فيديو' : lesson.type === 'pdf' ? 'ملف PDF' : 'عرض تقديمي'}</span>
                                    {lesson.duration && <span>• {lesson.duration} دقيقة</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleEditLesson(lesson.id); }}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : null}

                        {/* Add Lesson Button */}
                        <div className="border-2 border-dashed border-outline-variant rounded-xl p-1.5">
                          <button
                            type="button"
                            onClick={() => handleAddLesson(unit.id, unit.title)}
                            className="w-full py-3.5 rounded-xl text-gray-500 font-bold hover:text-primary hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm group"
                          >
                            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center group-hover:bg-primary transition-all transform group-hover:scale-110">
                              <Plus size={14} strokeWidth={3} className="text-white" />
                            </div>
                            <span>اضف درس جديد</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                !isAddingUnit && (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-outline-variant">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">لا يوجد وحدات حتى الآن</h3>
                    <p className="text-gray-400 font-bold text-sm mb-6">ابدأ بإضافة وحدة جديدة لترتيب محتوى الدورة</p>
                    <button
                      type="button"
                      onClick={() => setIsAddingUnit(true)}
                      className="bg-primary text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all text-sm"
                    >
                      اضافة وحدة جديدة
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline-variant mt-6">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className="px-10 py-3 bg-gray-100 text-gray-600 font-black rounded-full hover:bg-gray-200 transition-all text-sm"
              >
                السابق
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('landing_pages')}
                className="px-12 py-3 bg-primary text-white font-black rounded-full shadow-lg shadow-blue-100 hover:brightness-110 transition-all text-sm"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {activeTab === 'landing_pages' && (
          <div className="space-y-8 animate-in fade-in duration-300" dir="rtl">
            {/* Header Titles */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-gray-900 font-bold">التسويق والبيع</h2>
                <p className="text-body-md text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
                  أنشئ صفحات بيع مختلفة لنفس الدورة واستخدم كل صفحة في حملة أو عرض مختلف، مع بقاء جميع الصفحات مرتبطة بنفس الدورة.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateLandingModalOpen(true)}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus size={18} />
                <span>إنشاء صفحة بيع جديدة</span>
              </button>
            </div>

            {/* Introduction Card */}
            <div className="bg-white border border-outline-variant p-6 rounded-2xl flex flex-col lg:flex-row gap-8 items-center shadow-sm">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 text-primary bg-primary/5 px-4 py-1.5 rounded-full font-bold text-label-md">
                  <span className="material-symbols-outlined text-sm">info</span>
                  دليل الاستخدام
                </div>
                <h3 className="font-title-md text-title-md text-gray-900">كيف تعمل صفحات البيع؟</h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  لكل دورة صفحة بيع افتراضية يتم إنشاؤها تلقائياً. يمكنك إنشاء صفحات بيع إضافية لنفس الدورة واستخدم كل صفحة في حملة أو عرض مختلف، بينما تظل جميع الصفحات تبيع نفس الدورة.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-outline-variant/10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 bg-blue-50 text-primary rounded-lg flex items-center justify-center font-bold">١</div>
                    <p className="text-label-md text-on-surface-variant leading-snug">صفحة بيع افتراضية يتم إنشاؤها تلقائياً.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 bg-blue-50 text-primary rounded-lg flex items-center justify-center font-bold">٢</div>
                    <p className="text-label-md text-on-surface-variant leading-snug">أنشئ صفحات بيع إضافية للحملات المختلفة.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 bg-blue-50 text-primary rounded-lg flex items-center justify-center font-bold">٣</div>
                    <p className="text-label-md text-on-surface-variant leading-snug">جميع الصفحات مرتبطة بنفس الدورة وتحقق نفس الهدف.</p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-72 shrink-0">
                <div className="aspect-square bg-gradient-to-tr from-primary/5 to-blue-600/10 rounded-3xl flex items-center justify-center relative overflow-hidden border border-outline-variant/20 shadow-inner">
                  <Globe className="w-24 h-24 text-primary/20 animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>

            {/* Performance Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <span className="text-label-sm text-slate-500 bg-slate-50 px-2 py-0.5 rounded font-bold">0%</span>
                </div>
                <p className="text-on-surface-variant text-label-md">إجمالي المبيعات</p>
                <h4 className="text-3xl font-black text-gray-900 mt-1">
                  {landingPages.reduce((acc, p) => acc + (p.content?.sales || 0), 0).toLocaleString('ar-EG')}
                </h4>
              </div>
              <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <span className="material-symbols-outlined">layers</span>
                  </div>
                </div>
                <p className="text-on-surface-variant text-label-md">عدد صفحات البيع</p>
                <h4 className="text-3xl font-black text-gray-900 mt-1">
                  {(1 + landingPages.length).toLocaleString('ar-EG')}
                </h4>
              </div>
              <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm border-r-4 border-r-primary hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                </div>
                <p className="text-on-surface-variant text-label-md">أفضل صفحة بيع</p>
                <h4 className="text-lg font-black text-gray-900 mt-1 leading-snug line-clamp-1">
                  {landingPages.length > 0 && landingPages.some(p => (p.content?.sales || 0) > 0)
                    ? (landingPages.reduce((max, p) => (p.content?.sales || 0) > (max.content?.sales || 0) ? p : max, landingPages[0]).content?.campaignName || 'صفحة إضافية')
                    : 'صفحة البيع الافتراضية'}
                </h4>
              </div>
            </div>

            {/* Landing Page Editor Modal Overlay (Responsive Scaled Preview) */}
            {inlineEditingTemplate && (
              <div
                className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
                dir="rtl"
                onClick={() => {
                  setInlineEditingTemplate(null);
                  setInlineEditingPage(null);
                }}
              >
                <div
                  className="bg-white rounded-[2rem] w-[95vw] max-w-7xl h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header Bar */}
                  <div className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center font-bold">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">
                          محرر صفحة البيع المباشر — {inlineEditingTemplate === 'template_1' ? 'القالب الملكي الكلاسيكي' : inlineEditingTemplate === 'template_2' ? 'قالب الدروس التفاعلي' : 'القالب العصري'}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">تعديل الأقسام والمحتوى مع المعاينة الاستجابية الحية</p>
                      </div>
                    </div>

                    {/* Viewport Switcher */}
                    <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 gap-1">
                      <button
                        type="button"
                        onClick={() => setInlineViewport('desktop')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${inlineViewport === 'desktop' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        <Monitor size={12} /> كمبيوتر (1080p)
                      </button>
                      <button
                        type="button"
                        onClick={() => setInlineViewport('tablet')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${inlineViewport === 'tablet' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        <Tablet size={12} /> تابلت (768p)
                      </button>
                      <button
                        type="button"
                        onClick={() => setInlineViewport('mobile')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${inlineViewport === 'mobile' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        <Smartphone size={12} /> جوال (375p)
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const success = await handleSave(currentUser?.id);
                          if (success) {
                            toast.success('تم حفظ التعديلات بنجاح!');
                            fetchLandingPages();
                          }
                        }}
                        disabled={saving}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const courseSlug = course?.slug || id;
                          const url = inlineEditingPage?.id ? `/landing/${courseSlug}?lp_id=${inlineEditingPage.id}` : `/landing/${courseSlug}`;
                          window.open(url, '_blank');
                        }}
                        className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center"
                        title="معاينة كطالب في نافذة جديدة"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setInlineEditingTemplate(null);
                          setInlineEditingPage(null);
                        }}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center"
                        title="إغلاق المحرر"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Editor Body */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden bg-slate-50">
                    {/* Right Inspector Form Panel (5 cols) */}
                    <div className="lg:col-span-4 bg-white border-l border-slate-200 p-4 text-slate-900 flex flex-col space-y-3 h-full overflow-y-auto">
                      <div className="space-y-1 pb-2.5 border-b border-slate-100 shrink-0">
                        <label className="text-[11px] font-black text-slate-700 block">اختر القسم للتعديل والتخصيص:</label>
                        <select
                          className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
                          value={activeSectionId || ''}
                          onChange={(e) => setActiveSectionId(e.target.value || null)}
                        >
                          <option value="">-- اختر قسماً من القائمة --</option>
                          {inlineEditingTemplate === 'template_2' ? (
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
                          ) : inlineEditingTemplate === 'template_3' ? (
                            <>
                              <option value="hero">البانر الرئيسي (الهيرو)</option>
                              <option value="learning">ماذا ستتعلم في الدورة</option>
                              <option value="chapters">محتوى الدورة والمنهج</option>
                              <option value="instructor">عن المحاضر والمدرب</option>
                              <option value="faq">الأسئلة الشائعة حول البرنامج</option>
                              <option value="requirements">المتطلبات الأساسية للبدء</option>
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

                      <div className="flex-1 overflow-y-auto pt-1 space-y-3">
                        {(() => {
                          const sec = (activeSectionId || '').toLowerCase().trim();
                          if (!sec) {
                            return (
                              <div className="text-center py-12 text-slate-400 font-bold text-xs space-y-2">
                                <p>👈 اختر قسماً من القائمة أعلاه لتعديل إعداداته هنا.</p>
                              </div>
                            );
                          }

                          if (inlineEditingTemplate === 'template_2') {
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
                                return <Template2CurriculumEditor />;
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
                                return <Template2FooterEditor />;
                              case 'whatsapp':
                              case 'contact':
                              case 'support':
                              case 'chat':
                                return <Template1WhatsAppEditor />;
                              default:
                                return <Template2HeroEditor />;
                            }
                          }

                          if (inlineEditingTemplate === 'template_3') {
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
                                return <Template3LearningEditor />;
                              case 'chapters':
                              case 'curriculum':
                              case 'syllabus':
                              case 'content':
                              case 'modules':
                              case 'units':
                                return <Template3CurriculumEditor />;
                              case 'instructor':
                              case 'trainer':
                              case 'teacher':
                                return <Template3InstructorEditor />;
                              case 'faq':
                              case 'questions':
                              case 'help':
                                return <Template3FAQEditor />;
                              case 'requirements':
                              case 'prerequisites':
                              case 'needs':
                                return <Template3RequirementsEditor />;
                              case 'payment':
                              case 'pricing':
                              case 'packages':
                              case 'checkout':
                                return <Template3PricingEditor />;
                              case 'whatsapp':
                              case 'contact':
                              case 'support':
                              case 'chat':
                                return <Template1WhatsAppEditor />;
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

                          if (key === 'hero') return <Template1HeroEditor />;
                          if (key === 'learning') return <Template1LearningEditor />;
                          if (key === 'chapters') return <Template1ChapterEditor />;
                          if (key === 'payment') return <Template1PaymentEditor />;
                          if (key === 'faq') return <Template1FAQEditor />;
                          if (key === 'reviews') return <Template1ReviewsEditor />;
                          if (key === 'whatsapp') return <Template1WhatsAppEditor />;
                          if (key === 'footer') return <Template1FooterEditor />;

                          return (
                            <div className="text-center py-12 text-slate-400 font-bold text-xs space-y-2">
                              <p>👈 اختر قسماً من القائمة أعلاه لتعديل إعداداته هنا.</p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Left Live Scaled Canvas Preview Panel (8 cols) */}
                    <div className="lg:col-span-8 bg-slate-950 p-4 flex flex-col h-full overflow-hidden relative">
                      <div className="w-full flex-1 overflow-y-auto p-1 custom-scrollbar">
                        <div
                          className={`transition-all duration-300 bg-white rounded-2xl shadow-2xl overflow-hidden min-h-full ${inlineViewport === 'desktop'
                              ? 'w-full border border-slate-700 shadow-xl'
                              : inlineViewport === 'tablet'
                                ? 'w-full max-w-[720px] mx-auto border-4 border-slate-700 rounded-[1.5rem] shadow-xl'
                                : 'w-full max-w-[375px] mx-auto border-8 border-slate-700 rounded-[2.5rem] shadow-2xl'
                            }`}
                        >
                          <LandingRenderer
                            courseId={id}
                            landingPageId={inlineEditingPage?.id}
                            isEditable={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Landing Page Templates selection */}
            <section className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm text-right">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-blue-600">auto_awesome_motion</span>
                <div>
                  <h3 className="font-title-md text-title-md text-slate-900 font-bold">قالب صفحة البيع الافتراضية</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">اختر التصميم المناسب لعرض صفحة التسويق والبيع لطلابك</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Template 1 Card */}
                <div className={`border-2 rounded-[24px] p-5 flex flex-col justify-between transition-all ${courseTemplate === 'template_1' ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-600/20 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md'}`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900 text-sm">القالب الأول (الكلاسيكي الملكي)</h4>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${courseTemplate === 'template_1' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                        {courseTemplate === 'template_1' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>

                    {/* Full UI Template Mockup */}
                    <div className="aspect-video rounded-xl mb-4 overflow-hidden border border-slate-200 bg-slate-50 relative shadow-sm group/mockup">
                      {/* Preview Button */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate('template_1');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            setPreviewTemplate('template_1');
                          }
                        }}
                        className="absolute top-2 left-2 z-20 bg-white/95 hover:bg-white text-blue-700 hover:text-blue-800 px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 text-xs font-black border border-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Eye size={12} />
                        معاينة الشاشة
                      </div>
                      <img
                        src="/assets/template_1_preview.png"
                        alt="Royal Classic Template Full Preview"
                        className="w-full h-full object-cover group-hover/mockup:scale-105 transition-all duration-500"
                      />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      يتميز بتصميم زمردي دافئ، أركان مزخرفة، شريط أرقام الإحصائيات، فوائد الدورة ومحاضرها، وكاروسيل آراء الطلاب.
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => changeTemplate('template_1')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${courseTemplate === 'template_1' ? 'bg-blue-600 text-white font-black shadow-sm' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                      {courseTemplate === 'template_1' ? 'محدد' : 'تحديد القالب'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartInlineEdit('template_1')}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span> تخصيص وتعديل
                    </button>
                  </div>
                </div>

                {/* Template 2 Card */}
                <div className={`border-2 rounded-[24px] p-5 flex flex-col justify-between transition-all ${courseTemplate === 'template_2' ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-600/20 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md'}`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900 text-sm">قالب صفحة الدروس التفاعلية (الافتراضي)</h4>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${courseTemplate === 'template_2' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                        {courseTemplate === 'template_2' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>

                    {/* Full UI Template Mockup */}
                    <div className="aspect-video rounded-xl mb-4 overflow-hidden border border-slate-200 bg-slate-50 relative shadow-sm group/mockup">
                      {/* Preview Button */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/landing/${course?.slug || id}?template=template_2`, '_blank');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            window.open(`/landing/${course?.slug || id}?template=template_2`, '_blank');
                          }
                        }}
                        className="absolute top-2 left-2 z-20 bg-white/95 hover:bg-white text-blue-700 hover:text-blue-800 px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 text-xs font-black border border-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Eye size={12} />
                        معاينة الشاشة
                      </div>
                      <img
                        src="/assets/template_2_preview.png"
                        alt="Interactive Default Template Full Preview"
                        className="w-full h-full object-cover group-hover/mockup:scale-105 transition-all duration-500"
                      />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      تصميم تعليمي كلاسيكي مع مشغل فيديو بارز في الهيدر، وعرض تفاعلي للأقسام والدروس، وجدول المخرجات بلمسات عصرية.
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => changeTemplate('template_2')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${courseTemplate === 'template_2' ? 'bg-blue-600 text-white font-black shadow-sm' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                      {courseTemplate === 'template_2' ? 'محدد' : 'تحديد القالب'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartInlineEdit('template_2')}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span> تخصيص وتعديل
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Default Sales Page Section */}
            <section className="space-y-4">
              <h3 className="font-title-md text-title-md text-slate-900 font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">auto_awesome</span>
                صفحة البيع الافتراضية
              </h3>
              <div className="bg-white border-2 border-blue-200 hover:border-blue-400 transition-all rounded-2xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-600"></div>
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-title-md text-title-md text-slate-900 font-black">{course.title}</h4>
                      <span className="bg-blue-50 text-blue-600 text-label-sm px-3 py-1 rounded-full font-bold border border-blue-100">تم إنشاؤها تلقائياً</span>
                    </div>
                    <p className="text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                      تم إنشاء هذه الصفحة تلقائياً من بيانات الدورة، ويمكنك تعديلها في أي وقت أو استخدامها كأساس لإنشاء صفحات بيع جديدة.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-outline-variant/30">
                      <div>
                        <p className="text-label-sm text-on-surface-variant font-bold">الحالة</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="font-bold text-gray-900">نشط</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-label-sm text-on-surface-variant font-bold">الزيارات</p>
                        <p className="font-black text-gray-900 mt-1.5">١٢,٣٠٠</p>
                      </div>
                      <div>
                        <p className="text-label-sm text-on-surface-variant font-bold">المبيعات</p>
                        <p className="font-black text-gray-900 mt-1.5">٥٤٠</p>
                      </div>
                      <div>
                        <p className="text-label-sm text-on-surface-variant font-bold">آخر تحديث</p>
                        <p className="font-black text-gray-900 mt-1.5">
                          {course.updated_at ? new Date(course.updated_at).toLocaleDateString('ar-EG') : 'منذ يومين'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0">
                    <button
                      type="button"
                      onClick={() => handleStartInlineEdit(courseTemplate)}
                      className="flex-1 lg:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/10 cursor-pointer animate-fade-in"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      تعديل الصفحة
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`/landing/${course?.slug || id}`, '_blank');
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
                  <h3 className="font-title-md text-title-md text-gray-900">صفحات بيع إضافية</h3>
                  <p className="text-label-md text-on-surface-variant mt-1">
                    أنشئ صفحات بيع مختلفة لنفس الدورة لتناسب الحملات والعروض المختلفة.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateLandingModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
                >
                  <Plus size={16} />
                  <span>إضافة صفحة بيع جديدة</span>
                </button>
              </div>

              {loadingLandingPages ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <span className="text-sm font-bold">جاري تحميل صفحات البيع...</span>
                </div>
              ) : landingPages.length === 0 ? (
                <div className="bg-white border border-dashed border-outline-variant rounded-2xl p-10 text-center shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-gray-900 mb-1">لا توجد صفحات بيع إضافية</h4>
                  <p className="text-xs font-bold text-gray-400 max-w-sm mx-auto leading-relaxed mb-5">
                    أنشئ صفحات بيع مخصصة لحملاتك التسويقية مثل (رمضان، الجمعة البيضاء، إلخ) وتتبع نتائج مبيعاتها بشكل منفصل.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateLandingModalOpen(true)}
                    className="bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    أنشئ أول صفحة بيع الآن
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {landingPages.map((page) => (
                    <div key={page.id} className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                      <div className="p-5 border-b border-outline-variant/10 flex justify-between items-start gap-4">
                        <div>
                          <h5 className="font-bold text-gray-900 text-sm line-clamp-1">{page.content?.campaignName || page.slug || 'حملة إضافية'}</h5>
                          <span className="text-[10px] text-on-surface-variant font-bold leading-none block mt-1">{course.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(page)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all ${page.is_active
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                          {page.is_active ? 'منشور' : 'مسودة'}
                        </button>
                      </div>

                      <div className="p-5 grid grid-cols-2 gap-4 flex-1">
                        <div>
                          <p className="text-xs text-on-surface-variant font-bold">الزيارات</p>
                          <p className="font-black text-gray-900 text-base mt-1">{(page.content?.visits || 0).toLocaleString('ar-EG')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-on-surface-variant font-bold">المبيعات</p>
                          <p className="font-black text-gray-900 text-base mt-1">{(page.content?.sales || 0).toLocaleString('ar-EG')}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-on-surface-variant font-bold">الرابط المخصص</p>
                          <p className="font-mono text-xs text-primary underline truncate mt-1">
                            /landing/{page.slug}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50/50 border-t border-outline-variant/10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditor(page)}
                            className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-primary/10 flex items-center justify-center"
                            title="تعديل وتخصيص"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              window.open(`/landing/${page.slug || course?.slug || id}?lp_id=${page.id}`, '_blank');
                            }}
                            className="text-on-surface-variant hover:bg-slate-100 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                            title="معاينة كطالب"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCloneLandingPage(page)}
                            className="text-on-surface-variant hover:bg-slate-100 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                            title="تكرار الصفحة"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyCustomLink(page)}
                            className="text-on-surface-variant hover:bg-slate-100 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
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

            {/* Bottom action buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline-variant mt-6">
              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className="px-10 py-3 bg-gray-100 text-gray-600 font-black rounded-full hover:bg-gray-200 transition-all text-sm cursor-pointer"
              >
                السابق
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('subscribers')}
                className="px-12 py-3 bg-primary text-white font-black rounded-full shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all text-sm cursor-pointer"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="mt-4">
            <ManageSubscribersView showTopHeader={false} courseId={id} />
          </div>
        )}

      </div>

      <AddLessonModal
        isOpen={isAddLessonOpen}
        onClose={() => setIsAddLessonOpen(false)}
        unitId={selectedUnitId!}
        courseId={Number(id)}
        unitName={selectedUnitTitle}
        courseTitle={course.title}
        instructorName={course.instructor || ''}
        onLessonAdded={fetchCourse}
        courseType={course.type}
      />
      <EditUnitModal
        isOpen={isEditUnitOpen}
        onClose={() => setIsEditUnitOpen(false)}
        unit={editingUnit}
        onUnitUpdated={fetchCourse}
      />

      <EditLessonModal
        isOpen={isEditLessonOpen}
        onClose={() => setIsEditLessonOpen(false)}
        lesson={editingLesson}
        onLessonUpdated={fetchCourse}
        courseType={course.type}
      />

      {/* Template Preview Modal */}
      {previewTemplateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div
            className="bg-white rounded-[2.5rem] w-full max-w-7xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {previewTemplateId === 'template_1' ? 'تخصيص القالب الأول (الكلاسيكي الملكي)' : 'تخصيص قالب صفحة الدروس التفاعلية (الافتراضي)'}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">انقر فوق أي قسم أو أيقونة "تعديل" لتخصيص محتواه مباشرة</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    const success = await handleSave(currentUser?.id);
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
                    {(previewTemplateId === 'template_2' || courseTemplate === 'template_2') ? (
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
                    ) : (previewTemplateId === 'template_3' || courseTemplate === 'template_3') ? (
                      <>
                        <option value="hero">البانر الرئيسي (الهيرو)</option>
                        <option value="learning">ماذا ستتعلم في الدورة</option>
                        <option value="chapters">محتوى الدورة والمنهج</option>
                        <option value="instructor">عن المحاضر والمدرب</option>
                        <option value="faq">الأسئلة الشائعة حول البرنامج</option>
                        <option value="requirements">المتطلبات الأساسية للبدء</option>
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

                    if (previewTemplateId === 'template_2' || courseTemplate === 'template_2') {
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
                          return <Template2CurriculumEditor />;
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
                          return <Template2FooterEditor />;
                        case 'whatsapp':
                        case 'contact':
                        case 'support':
                        case 'chat':
                          return <Template1WhatsAppEditor />;
                        default:
                          return <Template2HeroEditor />;
                      }
                    }

                    if (previewTemplateId === 'template_3' || courseTemplate === 'template_3') {
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
                          return <Template3LearningEditor />;
                        case 'chapters':
                        case 'curriculum':
                        case 'syllabus':
                        case 'content':
                        case 'modules':
                        case 'units':
                          return <Template3CurriculumEditor />;
                        case 'instructor':
                        case 'trainer':
                        case 'teacher':
                          return <Template3InstructorEditor />;
                        case 'faq':
                        case 'questions':
                        case 'help':
                          return <Template3FAQEditor />;
                        case 'requirements':
                        case 'prerequisites':
                        case 'needs':
                          return <Template3RequirementsEditor />;
                        case 'payment':
                        case 'pricing':
                        case 'packages':
                        case 'checkout':
                          return <Template3PricingEditor />;
                        case 'whatsapp':
                        case 'contact':
                        case 'support':
                        case 'chat':
                          return <Template1WhatsAppEditor />;
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

                    if (key === 'hero') return <Template1HeroEditor />;
                    if (key === 'learning') return <Template1LearningEditor />;
                    if (key === 'chapters') return <Template1ChapterEditor />;
                    if (key === 'payment') return <Template1PaymentEditor />;
                    if (key === 'faq') return <Template1FAQEditor />;
                    if (key === 'reviews') return <Template1ReviewsEditor />;
                    if (key === 'whatsapp') return <Template1WhatsAppEditor />;
                    if (key === 'footer') return <Template1FooterEditor />;
                    return (
                      <div className="text-center py-16 text-slate-400 font-bold text-xs">
                        👈 اختر قسماً من القائمة أعلاه أو انقر فوق زر "تعديل القسم" مباشرة لتعديل إعداداته هنا.
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Column: Live Interactive Preview (Flex fill) */}
              <div className="flex-1 bg-slate-100 p-4 flex flex-col h-full overflow-hidden">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden flex-1 flex flex-col relative h-full">
                  <div className="absolute inset-0 overflow-y-auto">
                    <LandingRenderer
                      courseId={id}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-250" dir="rtl">
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
                    className={`p-4 border-2 rounded-2xl transition-all duration-300 flex flex-col gap-3 cursor-pointer relative hover:scale-[1.02] hover:shadow-md ${newSelectedTemplate === 'template_1'
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
                    className={`p-4 border-2 rounded-2xl transition-all duration-300 flex flex-col gap-3 cursor-pointer relative hover:scale-[1.02] hover:shadow-md ${newSelectedTemplate === 'template_2'
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
                      <span className="text-[9px] text-slate-400 font-bold leading-normal block mt-0.5 text-right">مشغل فيديو وجداول دروس متقدمة</span>
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
            changeTemplate(previewTemplate);
            setPreviewTemplate(null);
          }}
        />
      )}
      {/* Add Classification Pop-up Modal */}
      <AddClassificationModal
        isOpen={addClassificationModal.isOpen}
        initialType={addClassificationModal.type}
        availableGrades={gradesList}
        currentGradeId={gradeLevel}
        onClose={() => setAddClassificationModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={handleClassificationSuccess}
      />

      {/* Add Category Pop-up Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSuccess={async (newCat) => {
          try {
            const updated = await getCategories();
            setCategories(updated || []);
            if (newCat?.id) setCourseInfo((prev) => ({ ...prev, category_id: String(newCat.id) }));
          } catch (e) {
            console.warn('Failed to refresh categories:', e);
          }
        }}
      />

      {/* Add Coach Pop-up Modal */}
      <AddCoachModal
        isOpen={isAddCoachModalOpen}
        onClose={() => setIsAddCoachModalOpen(false)}
        onSuccess={async (newCoach) => {
          try {
            const coaches = await getUsers('instructor');
            setInstructors(coaches || []);
            if (newCoach?.id) {
              setCourseInfo((prev) => ({ ...prev, user_id: String(newCoach.id) }));
              setCoachName(newCoach.name || '');
            }
          } catch (e) {
            console.warn('Failed to refresh instructors:', e);
          }
        }}
      />
    </div>
  );
}
