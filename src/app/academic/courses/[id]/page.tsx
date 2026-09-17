'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, ChevronDown, ChevronUp, Eye, Clock, Share2, Loader2, Sparkles, Check, X, Pencil, ImagePlus, Upload } from 'lucide-react';
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
import { showAlert } from '@/lib/sweetalert';
import { getUserPaymentInfos, UserPaymentInfo, getReceiverAccounts, createUserPaymentInfo } from '@/services/finance';
import { getErrorMessage } from '@/lib/utils';
import { getStoredUserRole, isSchoolTeacherRole } from '@/lib/auth-storage';
import { useLandingStore } from '@/modules/landing/store/landingStore';
import TemplatePreviewModal from '@/modules/landing/components/TemplatePreviewModal';
import { getLandingPagesList, createLandingPage, updateLandingPage, deleteLandingPage } from '@/modules/landing/services/landing.api';
import { getTemplateDefaultContent } from '@/modules/landing/constants/defaultContent';
import ManageSubscribersView from '@/components/Academic/Subscribers/ManageSubscribersView';

// Extracted Subcomponents and Helpers
import { translateErrorToArabic } from './utils/errorHelpers';
import { CategoryFormInline } from './components/CategoryFormInline';
import { CoachFormInline } from './components/CoachFormInline';
import { AddPaymentMethodModal } from './components/AddPaymentMethodModal';
import { CourseInfoTab } from './components/CourseInfoTab';
import { CourseContentTab } from './components/CourseContentTab';
import { CourseLandingPagesTab } from './components/CourseLandingPagesTab';

const MySwal = withReactContent(Swal);

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [academyPaymentMethods, setAcademyPaymentMethods] = useState<UserPaymentInfo[]>([]);

  // Add payment method modal states
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPaymentTemplateId, setNewPaymentTemplateId] = useState('');
  const [newPaymentAccountValue, setNewPaymentAccountValue] = useState('');
  const [newPaymentCustomName, setNewPaymentCustomName] = useState('');
  const [isSavingNewPayment, setIsSavingNewPayment] = useState(false);

  // Global Data
  const [categories, setCategories] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(getStoredUserRole);

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

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const profile = await getProfileStatus();
        const userData = profile?.data || profile;
        if (userData) {
          setCurrentUser(userData);
          const resolvedRole = userData.type || userData.account_type || userData.user_type || userData.role;
          if (resolvedRole) {
            setUserRole(resolvedRole);
          }
        }
      } catch (err) {
        console.warn('Failed to load user profile in course page:', err);
      }
    };
    fetchUserRole();
  }, []);

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

  const [accessDurationType, setAccessDurationType] = useState<'lifetime' | 'days' | 'until_date'>('lifetime');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    if (pricingType === 'paid' && selectedPaymentMethods.length === 0) {
      newErrors.receiver_accounts = 'يرجى اختيار وسيلة دفع واحدة على الأقل للدورات المدفوعة';
    }

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
        description: courseInfo.description,
        target_audience: targetAudienceStr,
        category_id: courseInfo.category_id ? Number(courseInfo.category_id) : undefined,
        user_id: courseInfo.user_id ? Number(courseInfo.user_id) : undefined,
        price: pricingType === 'free' ? 0 : Number(price),
        final_price: pricingType === 'free' ? 0 : (isDiscounted && discountPrice ? Number(discountPrice) : Number(price)),
        price_type: pricingType,
        currency: currency,
        status: targetStatus,
        receiver_accounts: selectedPaymentMethods.map(m => Number(m.methodId)),
        is_discounted: isDiscounted ? 1 : 0,
        access_duration_type: accessDurationType,
        access_days: accessDurationType === 'days' && accessDays ? Number(accessDays) : undefined,
        access_until_date: accessDurationType === 'until_date' && accessUntilDate ? accessUntilDate : undefined,
      };

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
        toast.error(translateErrorToArabic(error.message || 'فشل حفظ البيانات'));
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

      const updatedMethods = await getUserPaymentInfos();
      setAcademyPaymentMethods(updatedMethods);

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

  const fetchCourse = async () => {
    try {
      const [data, paymentInfos, templates, grades, terms, subjects, years] = await Promise.all([
        getCourse(id),
        getUserPaymentInfos(),
        getReceiverAccounts().catch(e => { console.warn('Failed to fetch receiver templates:', e); return []; }),
        getGrades().catch(e => { console.warn('Failed to fetch grades:', e); return []; }),
        getTerms().catch(e => { console.warn('Failed to fetch terms:', e); return []; }),
        getSubjects().catch(e => { console.warn('Failed to fetch subjects:', e); return []; }),
        getAcademicYears().catch(e => { console.warn('Failed to fetch academic years:', e); return []; }),
      ]);

      if ((data as any).chapters) {
        data.units = (data as any).chapters;
      }

      setCourse(data);
      if (data.image || (data as any).cover_image) {
        setPreviewImage(data.image || (data as any).cover_image);
      }
      setAcademyPaymentMethods(paymentInfos || []);
      setReceiverTemplates(templates || []);

      if (data.title) {
        setCourseInfo(prev => ({
          ...prev,
          title: data.title,
          description: data.description || '',
          category_id: data.category_id ? String(data.category_id) : '',
          user_id: data.user_id ? String(data.user_id) : '',
        }));
      }

      if (data.status) {
        setStatus(data.status as any);
      }

      if (data.price !== undefined) {
        setPrice(String(data.price));
        setPricingType(Number(data.price) === 0 ? 'free' : 'paid');
      }

      if (data.currency) {
        setCurrency(data.currency as any);
      }

      if ((data as any).receiver_accounts && Array.isArray((data as any).receiver_accounts)) {
        const mappedAccounts = (data as any).receiver_accounts.map((acc: any) => ({
          methodId: String(acc.id || acc.methodId),
          methodName: acc.name || acc.methodName || '',
          type: 'account_number',
          value: acc.accountValue || acc.account_value || acc.value || '',
          currency: acc.currency || 'SAR',
          logo: acc.logo
        }));
        setSelectedPaymentMethods(mappedAccounts);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch course details:', error);
      toast.error('فشل تحميل بيانات الدورة');
      setLoading(false);
    }
  };

  const fetchLandingPages = async () => {
    setLoadingLandingPages(true);
    try {
      const list = await getLandingPagesList();
      const coursePages = list.filter((item: any) => Number(item.course_id) === Number(id));
      setLandingPages(coursePages);
    } catch (e) {
      console.error('Failed to fetch landing pages:', e);
    } finally {
      setLoadingLandingPages(false);
    }
  };

  const handleOpenEditor = (pageData: any) => {
    const store = useLandingStore.getState();
    store.setCourseData(course);
    store.setLandingPageData({
      id: pageData.id,
      template_name: pageData.template_name || 'template_1',
      is_active: pageData.is_active,
      content: pageData.content,
      course_id: Number(id),
      user_id: currentUser?.id || 1,
      slug: pageData.slug
    });
    setInlineEditingPage(pageData);
    setInlineEditingTemplate(pageData.template_name || 'template_1');
    store.setActiveSectionId('hero');
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

    total += 10;
    if (courseInfo.title && courseInfo.title.trim()) score += 10;

    total += 15;
    if (courseInfo.description && courseInfo.description.trim()) score += 15;

    total += 10;
    if (shortDescription && shortDescription.trim()) score += 10;

    total += 10;
    if (courseInfo.category_id) score += 10;

    total += 15;
    if (previewImage) score += 15;

    total += 10;
    const cleanAudience = targetAudienceList.filter(item => item && item.trim());
    if (cleanAudience.length > 0) score += 10;

    total += 10;
    const learnSection = customSections.find(s => s.id === 'what_you_will_learn');
    const cleanOutcomes = learnSection ? learnSection.items.filter(item => item && item.trim()) : [];
    if (cleanOutcomes.length > 0) score += 10;

    total += 10;
    if (course?.units && course.units.length > 0) score += 10;

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
              className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:shadow-md transition-all shrink-0 group relative"
            >
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="w-6 h-6 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                      title="تغيير الصورة"
                    >
                      <Pencil size={12} className="text-blue-600" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                      title="إلغاء الصورة"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors"
                  title="رفع صورة"
                >
                  <ImagePlus className="w-7 h-7" />
                </div>
              )}
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
                  try {
                    await updateCourse(Number(id), { status: 'published' });
                    setStatus('published');
                    toast.success('تم نشر الدورة بنجاح!');
                    fetchCourse();
                  } catch (err) {
                    toast.error('فشل تحديث حالة الدورة');
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
          <CourseInfoTab
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            shortDescription={shortDescription}
            setShortDescription={setShortDescription}
            previewImage={previewImage}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
            categories={categories}
            setIsAddCategoryModalOpen={setIsAddCategoryModalOpen}
            instructors={instructors}
            setCoachName={setCoachName}
            setIsAddCoachModalOpen={setIsAddCoachModalOpen}
            userRole={userRole}
            currentUser={currentUser}
            setAddClassificationModal={setAddClassificationModal}
            gradeLevel={gradeLevel}
            setGradeLevel={setGradeLevel}
            semester={semester}
            setSemester={setSemester}
            subject={subject}
            setSubject={setSubject}
            academicYear={academicYear}
            setAcademicYear={setAcademicYear}
            activeGrades={activeGrades}
            activeSemesters={activeSemesters}
            activeSubjects={activeSubjects}
            activeYears={activeYears}
            customSections={customSections}
            handleAddSectionItem={handleAddSectionItem}
            handleUpdateSectionItem={handleUpdateSectionItem}
            handleRemoveSectionItem={handleRemoveSectionItem}
            targetAudienceList={targetAudienceList}
            handleAddTargetAudience={handleAddTargetAudience}
            handleUpdateTargetAudience={handleUpdateTargetAudience}
            handleRemoveTargetAudience={handleRemoveTargetAudience}
            accessDurationType={accessDurationType}
            setAccessDurationType={setAccessDurationType}
            accessDays={accessDays}
            setAccessDays={setAccessDays}
            accessUntilDate={accessUntilDate}
            setAccessUntilDate={setAccessUntilDate}
            pricingType={pricingType}
            setPricingType={setPricingType}
            price={price}
            setPrice={setPrice}
            currency={currency}
            setCurrency={setCurrency}
            receiverTemplates={receiverTemplates}
            setNewPaymentTemplateId={setNewPaymentTemplateId}
            setNewPaymentCustomName={setNewPaymentCustomName}
            setNewPaymentAccountValue={setNewPaymentAccountValue}
            setShowAddPaymentModal={setShowAddPaymentModal}
            activeMethods={activeMethods}
            selectedPaymentMethods={selectedPaymentMethods}
            setSelectedPaymentMethods={setSelectedPaymentMethods}
            academyPaymentMethods={academyPaymentMethods}
            errors={errors}
            setErrors={setErrors}
            handleSaveCourseInfo={handleSaveCourseInfo}
          />
        )}

        {activeTab === 'content' && (
          <CourseContentTab
            course={course}
            isAddingUnit={isAddingUnit}
            setIsAddingUnit={setIsAddingUnit}
            newUnitTitle={newUnitTitle}
            setNewUnitTitle={setNewUnitTitle}
            newUnitDescription={newUnitDescription}
            setNewUnitDescription={setNewUnitDescription}
            isSavingUnit={isSavingUnit}
            handleSaveUnit={handleSaveUnit}
            expandedUnits={expandedUnits}
            toggleUnit={toggleUnit}
            handleEditUnit={handleEditUnit}
            handleDeleteUnit={handleDeleteUnit}
            handleEditLesson={handleEditLesson}
            handleDeleteLesson={handleDeleteLesson}
            handleAddLesson={handleAddLesson}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'landing_pages' && (
          <CourseLandingPagesTab
            course={course}
            id={id}
            currentUser={currentUser}
            landingPages={landingPages}
            setIsCreateLandingModalOpen={setIsCreateLandingModalOpen}
            inlineEditingTemplate={inlineEditingTemplate}
            setInlineEditingTemplate={setInlineEditingTemplate}
            inlineEditingPage={inlineEditingPage}
            setInlineEditingPage={setInlineEditingPage}
            inlineViewport={inlineViewport}
            setInlineViewport={setInlineViewport}
            handleOpenEditor={handleOpenEditor}
            handleDeleteLandingPage={handleDeleteLandingPage}
            handleCloneLandingPage={handleCloneLandingPage}
            handleCopyCustomLink={handleCopyCustomLink}
            handleCopyDefaultLink={handleCopyDefaultLink}
            fetchLandingPages={fetchLandingPages}
            activeSectionId={activeSectionId}
            setActiveSectionId={setActiveSectionId}
          />
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-in fade-in duration-300" dir="rtl">
            <ManageSubscribersView courseId={Number(id)} />
          </div>
        )}
      </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        currency={currency}
        receiverTemplates={receiverTemplates}
        newPaymentTemplateId={newPaymentTemplateId}
        setNewPaymentTemplateId={setNewPaymentTemplateId}
        newPaymentCustomName={newPaymentCustomName}
        setNewPaymentCustomName={setNewPaymentCustomName}
        newPaymentAccountValue={newPaymentAccountValue}
        setNewPaymentAccountValue={setNewPaymentAccountValue}
        isSavingNewPayment={isSavingNewPayment}
        onSubmit={handleCreatePaymentMethod}
      />

      {/* Add Classification Pop-up Modal */}
      {isSchoolTeacherRole(userRole || currentUser) && (
        <AddClassificationModal
          isOpen={addClassificationModal.isOpen}
          initialType={addClassificationModal.type}
          availableGrades={gradesList}
          currentGradeId={gradeLevel}
          onClose={() => setAddClassificationModal((prev) => ({ ...prev, isOpen: false }))}
          onSuccess={handleClassificationSuccess}
        />
      )}

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

      {/* Edit Unit Modal */}
      <EditUnitModal
        isOpen={isEditUnitOpen}
        onClose={() => {
          setIsEditUnitOpen(false);
          setEditingUnit(null);
        }}
        unit={editingUnit}
        onUnitUpdated={fetchCourse}
      />

      {/* Edit Lesson Modal */}
      <EditLessonModal
        isOpen={isEditLessonOpen}
        onClose={() => {
          setIsEditLessonOpen(false);
          setEditingLesson(null);
        }}
        lesson={editingLesson}
        onLessonUpdated={fetchCourse}
      />

      {/* Add Lesson Modal */}
      {selectedUnitId && (
        <AddLessonModal
          isOpen={isAddLessonOpen}
          onClose={() => {
            setIsAddLessonOpen(false);
            setSelectedUnitId(null);
          }}
          unitId={selectedUnitId}
          unitTitle={selectedUnitTitle}
          onLessonAdded={fetchCourse}
        />
      )}
    </div>
  );
}
