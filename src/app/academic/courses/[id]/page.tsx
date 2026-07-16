'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, ChevronDown, ChevronUp, Play, FileText, FilePieChart as FilePowerpoint, Trash2, Pencil, Video, CheckCircle2, Upload, Eye, Landmark, X, Check, User as UserIcon, Loader2 } from 'lucide-react';
import { getCourse, deleteUnit, deleteLesson, createUnit, updateCourse, getCategories, createCategory } from '@/services/courses';
import { getProfileStatus } from '@/services/auth';
import { getUsers, createUser } from '@/services/users';
import { Course, Unit, Lesson, User } from '@/types/api';
import { AcademyPaymentMethod, PaymentMethod } from '@/types/payment';
import AddLessonModal from '@/components/Academic/Modals/AddLessonModal';
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
import { getUserPaymentInfos, UserPaymentInfo } from '@/services/finance';
import { getLogoUrl } from '@/lib/utils';
import { EntitySelectWithCreate } from '@/components/Academic/Common/EntitySelectWithCreate';

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

  // Dynamically compute active methods based on saved settings
  const activeMethods: PaymentMethod[] = academyPaymentMethods.map(m => ({
    id: m.id.toString(),
    name: `${m.name} (${m.currency})`,
    type: 'account_number' as const,
    icon: 'credit-card',
    logo: m.logo,
    isActive: true,
    currency: m.currency
  }));
  
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
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'pricing'>('info');

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

  // Info Tab Form State
  const [courseInfo, setCourseInfo] = useState({
    title: '',
    description: '',
    target_audience: '',
    category_id: '',
    user_id: '',
  });
  
  interface CustomSection {
    id: string;
    title: string;
    items: string[];
  }
  const [customSections, setCustomSections] = useState<CustomSection[]>([
    { id: 'what_you_will_learn', title: 'ماذا ستتعلم؟', items: [''] }
  ]);
  const [courseTemplate, setCourseTemplate] = useState<string>('template_1');
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  
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
    const newErrors: Record<string, any> = {};
    if (!courseInfo.title.trim()) newErrors.title = 'عنوان الدورة مطلوب';
    if (!courseInfo.description.trim() || courseInfo.description === '<p><br></p>') newErrors.description = 'وصف الدورة مطلوب';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('يرجى ملء الحقول المطلوبة وتصحيح الأخطاء');
      return;
    }
    setActiveTab('content');
  };

  const handleTabChange = (targetTab: 'info' | 'content' | 'pricing') => {
    if (targetTab === 'info') {
      setActiveTab('info');
      return;
    }

    if (activeTab === 'info') {
      const newErrors: Record<string, any> = {};
      if (!courseInfo.title.trim()) newErrors.title = 'عنوان الدورة مطلوب';
      if (!courseInfo.description.trim() || courseInfo.description === '<p><br></p>') newErrors.description = 'وصف الدورة مطلوب';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error('يرجى ملء الحقول المطلوبة وتصحيح الأخطاء');
        return;
      }
    }

    setActiveTab(targetTab);
  };

  const handleSaveCourseInfo = async () => {
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
      const payload: any = {
        title: courseInfo.title,
        description: courseInfo.description,
        target_audience: courseInfo.target_audience,
        category_id: courseInfo.category_id || undefined,
        user_id: courseInfo.user_id || undefined,
        coach: coachName,
        status: status,
        price: pricingType === 'free' ? 0 : Number(price),
        final_price: pricingType === 'free' ? 0 : Number(price),
        price_type: pricingType,
        currency: currency,
        receiver_accounts: selectedPaymentMethods.map(m => Number(m.methodId))
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
      // Assuming updateCourse takes ID and payload
      await updateCourse(Number(id), payload);
      toast.success('تم حفظ بيانات الدورة بنجاح');
      setActiveTab('content');
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
      // Validate before saving if publishing
      if (status === 'published') {
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

      const payload = {
        price: pricingType === 'free' ? 0 : Number(price),
        final_price: pricingType === 'free' ? 0 : Number(price),
        price_type: pricingType,
        currency: currency,
        status: status,
        receiver_accounts: selectedPaymentMethods.map(m => Number(m.methodId))
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
      const [data, paymentInfos] = await Promise.all([
        getCourse(id),
        getUserPaymentInfos()
      ]);
      
      // Map 'chapters' to 'units' if needed
      if ((data as any).chapters) {
          data.units = (data as any).chapters;
      }
      
      setCourse(data);
      setAcademyPaymentMethods(paymentInfos || []);
      setCourseInfo({
        title: data.title || '',
        description: data.description || '',
        target_audience: (data as any).target_audience || '',
        category_id: (data as any).category_id?.toString() || '',
        user_id: (data as any).user_id?.toString() || '',
      });
      setCoachName(data.coach || '');
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

      if (data.image) {
        setPreviewImage(data.image);
      }
      
      if (data.units) {
        setExpandedUnits(data.units.map(u => u.id));
      }

      setPricingType(data.price_type || (Number(data.price) === 0 ? 'free' : 'paid'));
      setPrice(data.price?.toString() || '');
      setStatus(data.status || 'draft');

    } catch (error) {
      console.error(error);
      toast.error('فشل تحميل بيانات الدورة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cats, profile, paymentInfos] = await Promise.all([
          getCategories(),
          getProfileStatus(),
          getUserPaymentInfos()
        ]);
        setCategories(cats);
        setAcademyPaymentMethods(paymentInfos || []);

        const userData = profile.data || profile;
        if (userData) {
          setCurrentUser(userData);
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

  useEffect(() => {
    if (id) {
      fetchCourse();
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen">لم يتم العثور على الدورة</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      {/* Tabs Header & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-200 px-2 md:px-4">
        <div className="flex items-center justify-start gap-8 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => handleTabChange('info')}
            className={`pb-4 font-black text-sm whitespace-nowrap relative transition-all ${
              activeTab === 'info' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            معلومات الدورة
            {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
          <button
            onClick={() => handleTabChange('content')}
            className={`pb-4 font-black text-sm whitespace-nowrap relative transition-all ${
              activeTab === 'content' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            محتوى الدورة
            {activeTab === 'content' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
          <button
            onClick={() => handleTabChange('pricing')}
            className={`pb-4 font-black text-sm whitespace-nowrap relative transition-all ${
              activeTab === 'pricing' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            التسعير
            {activeTab === 'pricing' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto pb-4 lg:pb-3">
          <button 
            onClick={() => {
              if (course?.slug) {
                router.push(`/user/courses/${course.slug}`);
              } else {
                router.push(`/academic/courses/${id}/student`);
              }
            }}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm"
          >
            <Eye size={18} />
            <span>معاينة</span>
          </button>
          <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200 shadow-inner">
            <button
              type="button"
              onClick={async () => {
                if (status === 'draft') return;
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
                  } catch (err) {
                    toast.error('فشل تحديث حالة الدورة');
                  }
                }
              }}
              className={`px-6 py-2 rounded-full font-black text-xs transition-all ${
                status === 'draft'
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              مسودة
            </button>
            <button
              type="button"
              onClick={async () => {
                if (status === 'published') return;
                
                // Validate required fields before publishing
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
                  } catch (err) {
                    toast.error('فشل تحديث حالة الدورة');
                  }
                }
              }}
              className={`px-6 py-2 rounded-full font-black text-xs transition-all ${
                status === 'published'
                  ? 'bg-green-500 text-white shadow-sm shadow-green-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              منشور
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'info' && (
          <div className="max-w-4xl space-y-6">
            {/* Server Validation Error Summary */}
            {getActiveTabErrors().length > 0 && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <X size={14} className="text-red-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-black text-red-700">يرجى تصحيح الأخطاء التالية:</p>
                  <ul className="space-y-0.5">
                    {getActiveTabErrors().map(([key, msg]) => {
                      const val = Array.isArray(msg) ? msg[0] : msg;
                      return (
                        <li key={key} className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-red-400 rounded-full inline-block" />
                          {translateErrorToArabic(String(val))}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* Course Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-black text-gray-900">
                اسم الدورة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={courseInfo.title}
                onChange={(e) => {
                  setCourseInfo({ ...courseInfo, title: e.target.value });
                  if (errors.title) {
                    setErrors(prev => {
                      const next = { ...prev };
                      delete next.title;
                      return next;
                    });
                  }
                }}
                placeholder="ادخل اسم الدورة"
                className={`w-full p-4 bg-white border ${errors.title ? 'border-red-500 bg-red-50/30' : 'border-gray-200'} rounded-2xl outline-none focus:border-blue-600 font-bold text-sm transition-all text-gray-900`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                  <X size={12} />
                  {translateErrorToArabic(Array.isArray(errors.title) ? errors.title[0] : String(errors.title))}
                </p>
              )}
            </div>

            {/* Category & Coach Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={(currentUser?.role === 'admin' || currentUser?.role === 'academy') ? "" : "md:col-span-2"}>
                <EntitySelectWithCreate
                  label="الفئة"
                  options={categories.map(c => ({ id: c.id, name: c.name }))}
                  value={courseInfo.category_id}
                  onChange={(val) => {
                    setCourseInfo({ ...courseInfo, category_id: val ? val.toString() : '' });
                    if (errors.category_id) {
                      setErrors(prev => {
                        const next = { ...prev };
                        delete next.category_id;
                        return next;
                      });
                    }
                  }}
                  placeholder="اختر فئة (اختياري)"
                  error={errors.category_id ? translateErrorToArabic(Array.isArray(errors.category_id) ? errors.category_id[0] : String(errors.category_id)) : undefined}
                  modalTitle="إضافة فئة جديدة"
                  modalDescription="أضف فئة جديدة لتنظيم دوراتك"
                  modalIcon={<Landmark size={28} />}
                  fetchOptions={async () => {
                    const cats = await getCategories();
                    setCategories(cats);
                    return cats;
                  }}
                  createEntity={async (payload) => {
                    return await createCategory(payload.name, payload.is_active);
                  }}
                  onCreated={() => {}}
                  renderForm={(props) => (
                    <CategoryFormInline {...props} />
                  )}
                />
              </div>

              {/* Instructor Dropdown (Admin/Academy Only) */}
              {(currentUser?.role === 'admin' || currentUser?.role === 'academy') && (
                <EntitySelectWithCreate
                  label="المدرب"
                  options={instructors.map(i => ({ id: i.id, name: i.name }))}
                  value={courseInfo.user_id}
                  onChange={(val) => {
                    setCourseInfo({ ...courseInfo, user_id: val ? val.toString() : '' });
                    if (val) {
                      const selectedInst = instructors.find(i => i.id.toString() === val.toString());
                      if (selectedInst) {
                        setCoachName(selectedInst.name || selectedInst.fullName || '');
                      }
                    } else {
                      setCoachName('');
                    }
                    if (errors.user_id) setErrors(prev => ({ ...prev, user_id: null }));
                  }}
                  placeholder="اختر مدرب"
                  error={errors.user_id ? translateErrorToArabic(Array.isArray(errors.user_id) ? errors.user_id[0] : String(errors.user_id)) : undefined}
                  modalTitle="إضافة مدرب جديد"
                  modalDescription="أضف مدرباً جديداً لتسجيل حسابه"
                  modalIcon={<UserIcon size={28} />}
                  fetchOptions={async () => {
                    const coaches = await getUsers('academy');
                    setInstructors(coaches);
                    return coaches;
                  }}
                  createEntity={async (payload) => {
                    return await createUser(payload);
                  }}
                  onCreated={(newCoach) => {
                    setCoachName(newCoach.name || newCoach.fullName || '');
                  }}
                  renderForm={(props) => (
                    <CoachFormInline {...props} />
                  )}
                />
              )}
            </div>

            {/* Course Landing Page Template Selection */}
            <div className="space-y-3 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm text-right">
              <label className="block text-sm font-black text-gray-900 pr-1">
                قالب صفحة هبوط الدورة
              </label>
              <p className="text-xs font-bold text-gray-400">اختر التصميم المناسب لعرض تفاصيل الدورة للطلاب</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setCourseTemplate('template_1')}
                  className={`p-5 border rounded-3xl text-right transition-all flex flex-col gap-3 relative ${
                    courseTemplate === 'template_1'
                      ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-600/10'
                      : 'border-gray-150 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-black text-gray-900">القالب الأول (الكلاسيكي الملكي)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplateId('template_1');
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-700 font-bold bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100 hover:bg-blue-100/50 transition-colors flex items-center gap-1"
                      >
                        <Eye size={10} />
                        معاينة التصميم
                      </button>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${courseTemplate === 'template_1' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                        {courseTemplate === 'template_1' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-bold leading-relaxed">
                    يتميز بتصميم زمردي دافئ، أركان مزخرفة، شريط أرقام الإحصائيات، فوائد الدورة ومحاضرها، وكاروسيل آراء الطلاب.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCourseTemplate('template_2')}
                  className={`p-5 border rounded-3xl text-right transition-all flex flex-col gap-3 relative ${
                    courseTemplate === 'template_2'
                      ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-600/10'
                      : 'border-gray-150 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-black text-gray-900">قالب صفحة الدروس التفاعلية (الافتراضي)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplateId('template_2');
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-700 font-bold bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100 hover:bg-blue-100/50 transition-colors flex items-center gap-1"
                      >
                        <Eye size={10} />
                        معاينة التصميم
                      </button>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${courseTemplate === 'template_2' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                        {courseTemplate === 'template_2' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-bold leading-relaxed">
                    تصميم تعليمي كلاسيكي مع مشغل فيديو بارز في الهيدر، وعرض تفاعلي للأقسام والدروس، وجدول المخرجات بلمسات عصرية.
                  </span>
                </button>
              </div>
            </div>

            {/* Course Image */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-black text-gray-900">
                صورة الدورة <span className="text-red-500">*</span>
              </label>
              <div 
                className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 bg-gray-50 cursor-pointer hover:border-blue-600 transition-all group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {previewImage ? (
                  <div className="relative w-full max-w-[200px] aspect-video rounded-2xl overflow-hidden">
                    <img src={previewImage} alt="Course Preview" className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="text-blue-600" size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-gray-900 text-lg">اضف صورة الدورة</p>
                      <p className="text-sm font-bold text-gray-500 mt-2">صورة غلاف الدورة : 820x1270</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic Custom Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Description Accordion (Always present) */}
              <div className="bg-white border border-gray-200/80 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col max-h-[500px]">
                <button 
                  onClick={() => toggleInfoSection('description')}
                  className="w-full p-5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100 shrink-0"
                >
                  <span className="font-black text-gray-900">وصف الدورة</span>
                  {expandedInfoSections.includes('description') ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>
                {expandedInfoSections.includes('description') && (
                  <div className="p-5 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                    <QuillEditor
                      value={courseInfo.description}
                      onChange={(val) => {
                        setCourseInfo({ ...courseInfo, description: val });
                        if (errors.description) {
                          setErrors(prev => {
                            const next = { ...prev };
                            delete next.description;
                            return next;
                          });
                        }
                      }}
                      placeholder="ادخل وصف الدورة"
                    />
                  </div>
                )}
              </div>

              {/* Target Audience Accordion (Always present) */}
              <div className="bg-white border border-gray-200/80 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col max-h-[500px]">
                <button 
                  onClick={() => toggleInfoSection('target_audience')}
                  className="w-full p-5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100 shrink-0"
                >
                  <span className="font-black text-gray-900">لمن هذه الدورة</span>
                  {expandedInfoSections.includes('target_audience') ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>
                {expandedInfoSections.includes('target_audience') && (
                  <div className="p-5 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                    <QuillEditor
                      value={courseInfo.target_audience}
                      onChange={(val) => {
                        setCourseInfo({ ...courseInfo, target_audience: val });
                        if (errors.who_is_this_for) {
                          setErrors(prev => {
                            const next = { ...prev };
                            delete next.who_is_this_for;
                            return next;
                          });
                        }
                      }}
                      placeholder="الفئة المستهدفة من الدورة"
                    />
                  </div>
                )}
              </div>

              {/* Render all custom sections */}
              {customSections.map((section) => (
                <div key={section.id} className="bg-white border border-gray-200/80 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col max-h-[500px]">
                  <div className="w-full p-5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      {section.id === 'what_you_will_learn' ? (
                        <>
                          <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
                          <span className="font-black text-gray-900">{section.title}</span>
                        </>
                      ) : (
                        <input 
                          type="text"
                          value={section.title}
                          onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                          className="font-black text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 outline-none w-full"
                          placeholder="اسم القسم (مثال: متطلبات الدورة)"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {section.id !== 'what_you_will_learn' && (
                        <button
                          onClick={() => handleRemoveSection(section.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button onClick={() => toggleInfoSection(section.id)} className="p-1">
                        {expandedInfoSections.includes(section.id) ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  {expandedInfoSections.includes(section.id) && (
                    <div className="p-5 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 space-y-4">
                      {section.items.map((point, index) => (
                        <div key={index} className="relative group bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-all hover:border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                              عنصر {index + 1}
                            </span>
                            <button
                              onClick={() => handleRemoveSectionItem(section.id, index)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={point}
                            onChange={(e) => handleUpdateSectionItem(section.id, index, e.target.value)}
                            placeholder="ادخل محتوى العنصر..."
                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-gray-900"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddSectionItem(section.id)}
                        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-3 text-gray-500 font-bold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <Plus size={18} />
                        </div>
                        <span>إضافة عنصر جديد</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Section Button */}
            <button
              onClick={handleAddCustomSection}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-3 text-gray-600 font-bold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Plus size={20} className="text-gray-500 group-hover:text-blue-600" />
              </div>
              <span>إضافة قسم اختياري جديد</span>
            </button>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button className="px-10 py-3 bg-gray-100 text-gray-600 font-black rounded-full hover:bg-gray-200 transition-all text-sm">
                عودة
              </button>
              <button 
                type="button"
                onClick={handleNextFromInfo}
                className="px-12 py-3 bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-100 hover:brightness-110 transition-all text-sm"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="flex flex-col gap-6">
            {/* Header & Add Unit */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border border-blue-200 rounded-xl p-2 bg-white gap-3 shadow-sm">
              <div className="flex-1 text-center md:text-right px-4 py-1.5">
                 <span className="font-bold text-gray-800 text-sm">
                   الاجمالي {course.units?.length || 0} وحدة فقط | {course.units?.reduce((acc, unit) => acc + (unit.lessons?.length || 0), 0) || 0} دروس
                 </span>
              </div>
              <button 
                onClick={() => setIsAddingUnit(!isAddingUnit)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
              >
                <Plus size={18} strokeWidth={3} />
                <span>اضافة وحدة</span>
              </button>
            </div>

            {/* Add Unit Form (Inline) */}
            {isAddingUnit && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
                <h3 className="text-lg font-black text-gray-900">ادخل بيانات الوحدة</h3>
                <div className="space-y-3">
                   <div className="space-y-1.5">
                     <label className="block text-xs font-bold text-gray-500">اسم الوحدة</label>
                     <input 
                       type="text" 
                       value={newUnitTitle}
                       onChange={(e) => setNewUnitTitle(e.target.value)}
                       placeholder="ادخل اسم الوحدة"
                       className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-600 font-bold text-sm transition-all text-gray-900"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <label className="block text-xs font-bold text-gray-500">وصف للوحدة</label>
                     <textarea 
                       value={newUnitDescription}
                       onChange={(e) => setNewUnitDescription(e.target.value)}
                       placeholder="ادخل وصف للوحدة"
                       className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-600 font-bold text-sm min-h-[80px] transition-all text-gray-900"
                     />
                   </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => setIsAddingUnit(false)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-200 transition-all text-sm"
                  >
                    الغاء
                  </button>
                  <button 
                    onClick={handleSaveUnit}
                    disabled={isSavingUnit}
                    className="px-10 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all disabled:opacity-70 text-sm shadow-lg shadow-blue-50"
                  >
                    {isSavingUnit ? 'جاري الحفظ...' : 'حفظ'}
                  </button>
                </div>
              </div>
            )}

            {/* Units List */}
            <div className="space-y-3">
              {course.units && course.units.length > 0 ? (
                course.units.map((unit) => (
                  <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Unit Header */}
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                      onClick={() => toggleUnit(unit.id)}
                    >
                      <div className="flex items-center gap-3">
                        <button className="p-1.5 bg-gray-50 rounded-lg text-blue-600">
                          {expandedUnits.includes(unit.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div>
                          <h3 className="text-base md:text-lg font-black text-gray-900">{unit.title}</h3>
                          {unit.description && <p className="text-xs text-gray-400 font-bold mt-0.5">{unit.description}</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <button 
                          onClick={(e) => { e.stopPropagation(); handleEditUnit(unit.id); }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                         <button 
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
                          unit.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-all group shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                  lesson.type === 'video' ? 'bg-blue-50 text-blue-600' : 
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
                                  onClick={(e) => { e.stopPropagation(); handleEditLesson(lesson.id); }}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : null}
                        
                        {/* Add Lesson Button - Dotted Container Style */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-1.5">
                          <button 
                            onClick={() => handleAddLesson(unit.id, unit.title)}
                            className="w-full py-3.5 rounded-xl text-gray-500 font-bold hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm group"
                          >
                            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center group-hover:bg-blue-600 transition-all transform group-hover:scale-110">
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
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">لا يوجد وحدات حتى الآن</h3>
                    <p className="text-gray-400 font-bold text-sm mb-6">ابدأ بإضافة وحدة جديدة لترتيب محتوى الدورة</p>
                    <button 
                      onClick={() => setIsAddingUnit(true)}
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all text-sm"
                    >
                      اضافة وحدة جديدة
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className="px-10 py-3 bg-gray-100 text-gray-600 font-black rounded-full hover:bg-gray-200 transition-all text-sm"
              >
                السابق
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className="px-12 py-3 bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-100 hover:brightness-110 transition-all text-sm"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="max-w-2xl mx-auto space-y-10 pt-10">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-gray-900">تحديد سعر الدورة</h2>
              <p className="text-gray-400 font-bold">اختر خطة التسعير المناسبة لدورتك</p>
            </div>

            {/* Server Validation Error Summary */}
            {getActiveTabErrors().length > 0 && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <X size={14} className="text-red-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-black text-red-700">يرجى تصحيح الأخطاء التالية:</p>
                  <ul className="space-y-0.5">
                    {getActiveTabErrors().map(([key, msg]) => {
                      const val = Array.isArray(msg) ? msg[0] : msg;
                      return (
                        <li key={key} className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-red-400 rounded-full inline-block" />
                          {translateErrorToArabic(String(val))}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div
                onClick={() => setPricingType('free')}
                className={`p-10 rounded-[32px] border-2 cursor-pointer transition-all text-center space-y-4 ${
                  pricingType === 'free' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-blue-200'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${pricingType === 'free' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  <Play size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900">مجاني</h3>
                <p className="text-sm font-bold text-gray-400">الدورة متاحة للجميع بدون مقابل مادي</p>
              </div>

              <div
                onClick={() => setPricingType('paid')}
                className={`p-10 rounded-[32px] border-2 cursor-pointer transition-all text-center space-y-4 ${
                  pricingType === 'paid' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-blue-200'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${pricingType === 'paid' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900">مدفوع</h3>
                <p className="text-sm font-bold text-gray-400">حدد سعراً للدورة ليتمكن الطلاب من شرائها</p>
              </div>
            </div>

            {pricingType === 'paid' && (
              <div className="space-y-8 animate-in slide-in-from-top-4 duration-300">
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-900">سعر الدورة</label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        if (errors.price) setErrors(prev => ({ ...prev, price: null }));
                      }}
                      placeholder="0.00"
                      className={`w-full p-5 bg-white border ${errors.price ? 'border-red-500 bg-red-50/30' : 'border-gray-100'} rounded-2xl outline-none focus:border-blue-600 font-bold text-left transition-all pl-24 text-gray-900 shadow-sm group-hover:border-gray-200`}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-100 pr-4">
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as any)}
                        className="bg-transparent font-black text-blue-600 outline-none cursor-pointer text-sm text-gray-900"
                      >
                        <option value="SAR" className="text-gray-900">SAR (ر.س)</option>
                        <option value="EGP" className="text-gray-900">EGP (ج.م)</option>
                        <option value="AED" className="text-gray-900">AED (د.إ)</option>
                        <option value="QAR" className="text-gray-900">QAR (ر.ق)</option>
                        <option value="KWD" className="text-gray-900">KWD (د.ك)</option>
                        <option value="OMR" className="text-gray-900">OMR (ر.ع)</option>
                        <option value="BHD" className="text-gray-900">BHD (د.ب)</option>
                        <option value="JOD" className="text-gray-900">JOD (د.أ)</option>
                        <option value="USD" className="text-gray-900">USD ($)</option>
                      </select>
                    </div>
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                      <X size={12} />
                      {translateErrorToArabic(Array.isArray(errors.price) ? errors.price[0] : String(errors.price))}
                    </p>
                  )}
                </div>

                {/* Pricing Ways / Payment Methods */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">طرق التحصيل (وسائل الدفع)</h3>
                      <p className="text-xs text-gray-400 font-bold mt-1">اختر وسائل الدفع التي تريد تفعيلها لهذه الدورة</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => router.push('/academic/finance/payment-settings')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
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
                  {(errors.receiver_accounts || errors['receiver_accounts']) && (
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
                        <div key={pm.methodId} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group/pm">
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
                                <Landmark size={18} className="text-blue-600" />
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
                              <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black tracking-wider uppercase">{pm.currency}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Toggle - Always Visible */}
            <div className="pt-6 border-t border-gray-100">
              <CourseStatusToggle 
                status={status} 
                onChange={(newStatus) => {
                  if (newStatus === 'published') {
                    const missing = [];
                    if (!courseInfo.title) missing.push('عنوان الدورة');
                    if (!courseInfo.description) missing.push('وصف الدورة');
                    if (pricingType === 'paid' && !price) missing.push('سعر الدورة');
                    if (pricingType === 'paid' && selectedPaymentMethods.length === 0) missing.push('وسيلة دفع واحدة على الأقل');
                    if (course?.units?.length === 0) missing.push('محتوى الدورة (وحدة واحدة على الأقل)');

                    if (missing.length > 0) {
                      showAlert.warning('لا يمكن النشر الآن', `يرجى إكمال الحقول التالية أولاً: \n ${missing.join('، ')}`);
                      return;
                    }
                  }
                  setStatus(newStatus);
                }} 
              />
            </div>


            <div className="flex justify-center pt-10">
              <button
                onClick={handleSavePricing}
                disabled={isSavingPricing}
                className="w-full max-w-[400px] py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70"
              >
                {isSavingPricing ? 'جاري الحفظ...' : 'حفظ بيانات التسعير'}
              </button>
            </div>
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
            className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {previewTemplateId === 'template_1' ? 'معاينة القالب الأول (الكلاسيكي الملكي)' : 'معاينة قالب صفحة الدروس التفاعلية (الافتراضي)'}
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-1">عرض الهيكل التنظيمي والمظهر العام للتصميم</p>
              </div>
              <button 
                type="button"
                onClick={() => setPreviewTemplateId(null)}
                className="w-10 h-10 bg-white hover:bg-slate-100 text-slate-500 rounded-full flex items-center justify-center border border-slate-200 hover:text-slate-900 transition-all active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Miniature Dynamic Wireframe Mockup */}
              <div className="border border-slate-200/60 rounded-[2rem] p-6 bg-slate-50 shadow-inner flex flex-col gap-4">
                <span className="text-xs font-black text-slate-400 tracking-wide block text-right">رسم تخطيطي لهيكل الصفحة:</span>
                
                {previewTemplateId === 'template_1' ? (
                  /* Template 1 Mockup */
                  <div className="w-full flex flex-col gap-3 text-xs font-bold text-slate-700">
                    {/* Header Banner */}
                    <div className="bg-[#0D3B33] text-white p-6 rounded-2xl border-r-8 border-[#C9A24B] text-center space-y-2">
                      <div className="bg-white/10 h-3 w-1/4 mx-auto rounded" />
                      <div className="bg-white/20 h-5 w-2/3 mx-auto rounded" />
                      <div className="bg-white/10 h-3 w-1/2 mx-auto rounded" />
                    </div>
                    {/* Stats Bar */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                        <span className="text-[#C9A24B] font-black text-sm block">+٤٠</span>
                        <span className="text-[9px] text-slate-400 block">ساعة تدريبية</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                        <span className="text-[#C9A24B] font-black text-sm block">١٢</span>
                        <span className="text-[9px] text-slate-400 block">وحدة دراسية</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                        <span className="text-[#C9A24B] font-black text-sm block">١٠٠٪</span>
                        <span className="text-[9px] text-slate-400 block">محتوى عملي</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                        <span className="text-[#C9A24B] font-black text-sm block">مفعل</span>
                        <span className="text-[9px] text-slate-400 block">شهادة معتمدة</span>
                      </div>
                    </div>
                    {/* Content Section Split */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Course Details (Left side / main) */}
                      <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                        <div className="h-4 bg-slate-100 rounded w-1/3" />
                        <div className="space-y-1.5">
                          <div className="h-3 bg-slate-100 rounded w-full" />
                          <div className="h-3 bg-slate-100 rounded w-full" />
                          <div className="h-3 bg-slate-100 rounded w-3/4" />
                        </div>
                        {/* Accordion mockup */}
                        <div className="space-y-2 pt-2">
                          <div className="h-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between px-3">
                            <div className="h-3 bg-slate-200 rounded w-1/2" />
                            <div className="h-3 bg-slate-200 rounded w-4" />
                          </div>
                          <div className="h-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between px-3">
                            <div className="h-3 bg-slate-200 rounded w-1/3" />
                            <div className="h-3 bg-slate-200 rounded w-4" />
                          </div>
                        </div>
                      </div>
                      {/* Subscription Box (Right side) */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 block">سعر الدورة</span>
                          <span className="text-lg font-black text-slate-900">١٩٩ SAR</span>
                        </div>
                        <div className="h-9 bg-[#C9A24B] text-white rounded-lg flex items-center justify-center font-black text-xs">
                          اشترك الآن
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Template 2 Mockup */
                  <div className="w-full flex flex-col gap-3 text-xs font-bold text-slate-700">
                    {/* Header bar */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="h-3 bg-slate-200 rounded w-1/4" />
                      <div className="h-4 bg-slate-100 rounded w-8" />
                    </div>
                    {/* Main Content & Right payment card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Right payment card (Floating) */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                        <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-white">
                          <Play size={20} className="opacity-60" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 block">سعر الاشتراك</span>
                          <span className="text-lg font-black text-slate-900">١٩٩ SAR</span>
                        </div>
                        <div className="h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-xs">
                          سجل الآن في الدورة
                        </div>
                      </div>
                      {/* Left main contents */}
                      <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                        <div className="h-5 bg-slate-100 rounded w-1/2" />
                        {/* Tab header */}
                        <div className="flex border-b border-slate-100 pb-1 gap-4">
                          <span className="text-blue-600 border-b-2 border-blue-600 pb-1">عن الدورة</span>
                          <span className="text-slate-400">المنهج الدراسي</span>
                          <span className="text-slate-400">التقييمات</span>
                        </div>
                        <div className="space-y-1.5 pt-2">
                          <div className="h-3 bg-slate-100 rounded w-full" />
                          <div className="h-3 bg-slate-100 rounded w-full" />
                          <div className="h-3 bg-slate-100 rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Feature Details List */}
              <div className="space-y-3 text-right">
                <h4 className="font-black text-slate-900 text-sm">أبرز مميزات هذا القالب:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {previewTemplateId === 'template_1' ? (
                    <>
                      <li className="flex items-start gap-2.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                        <span className="w-2 h-2 bg-[#C9A24B] rounded-full shrink-0 mt-2" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800">الألوان الملكية الفاخرة</p>
                          <p className="text-[10px] text-slate-400 font-bold">توليفة مميزة تجمع بين الزمردي الداكن والذهبي لتصميم راقٍ.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                        <span className="w-2 h-2 bg-[#C9A24B] rounded-full shrink-0 mt-2" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800">شريط الإحصائيات والأرقام</p>
                          <p className="text-[10px] text-slate-400 font-bold">شريط تفاعلي يعرض مجموع الساعات، الدروس والشهادة بوضوح.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                        <span className="w-2 h-2 bg-[#C9A24B] rounded-full shrink-0 mt-2" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800">كاروسيل آراء الطلاب والتقييمات</p>
                          <p className="text-[10px] text-slate-400 font-bold">شريط تمرير أفقي سلس لعرض شهادات وآراء خريجي الدورة.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                        <span className="w-2 h-2 bg-[#C9A24B] rounded-full shrink-0 mt-2" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800">شات محاكاة واتساب ونافذة تواصل</p>
                          <p className="text-[10px] text-slate-400 font-bold">أيقونة واتساب عائمة ونماذج اتصال مباشرة لزيادة اشتراك الطلاب.</p>
                        </div>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                        <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-2" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800">مشغل الفيديو البارز</p>
                          <p className="text-[10px] text-slate-400 font-bold">فيديو تعريفي كبير يجذب انتباه الطالب فور دخول الصفحة.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                        <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-2" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800">نظام التبويبات التفاعلي</p>
                          <p className="text-[10px] text-slate-400 font-bold">تقسيم محتوى الدورة، تفاصيلها، والتقييمات في تبويبات سهلة التنقل.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                        <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-2" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800">منهج دراسي مرن</p>
                          <p className="text-[10px] text-slate-400 font-bold">قائمة منسدلة أنيقة للمنهج والدروس بترميز بصري مريح للمستخدم.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                        <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-2" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800">كارت التسعير والاشتراك العائم</p>
                          <p className="text-[10px] text-slate-400 font-bold">بطاقة جانبية مميزة تثبت عند التمرير لتسهيل الوصول لزر الدفع.</p>
                        </div>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                type="button"
                onClick={() => setPreviewTemplateId(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-black text-xs transition-all active:scale-95 shadow-lg shadow-slate-900/10"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
