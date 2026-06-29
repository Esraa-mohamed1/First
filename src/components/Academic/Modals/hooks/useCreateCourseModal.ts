'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { createCourse, getCategories, getCourse, updateCourse } from '@/services/courses';
import { getProfileStatus } from '@/services/auth';
import { getUsers } from '@/services/users';
import { User } from '@/types/api';

interface UseCreateCourseModalParams {
  isOpen: boolean;
  onClose: () => void;
  courseId?: number | null;
  initialCourseType?: string | null;
}

export const useCreateCourseModal = ({
  isOpen,
  onClose,
  courseId,
  initialCourseType,
}: UseCreateCourseModalParams) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'pricing'>('info');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<number | null>(null);
  
  // Basic Info States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState('');
  const [whoIsThisFor, setWhoIsThisFor] = useState('');
  
  // Accordion States
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    learning: false,
    audience: false
  });

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pricing Step States
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('paid');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'EGP' | 'SAR' | 'USD'>('SAR');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');

  const [courseType, setCourseType] = useState<string>('');

  // Course Content State (Mock for now to match UI)
  const [units, setUnits] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [apiErrorMessages, setApiErrorMessages] = useState<string[]>([]);

  const mapTypeToBackend = (type: string | null | undefined): string => {
    if (!type) return 'recorded';
    const t = type.toLowerCase().trim();
    if (t === 'live-online' || t === 'online') return 'online';
    if (t === 'in-person' || t === 'physical' || t === 'offline') return 'physical';
    if (t === 'registered' || t === 'recorded') return 'recorded';
    return t;
  };

  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        try {
          const [cats, profile] = await Promise.all([getCategories(), getProfileStatus()]);
          setCategories(cats);

          const userData = profile.data || profile;
          if (userData) {
            setCurrentUser(userData);
          if (userData.role === 'admin' || userData.role === 'academy') {
              const coaches = await getUsers('academy');
              setInstructors(coaches);
            }
          }

          if (courseId) {
            const course = await getCourse(courseId);
            setTitle(course.title || '');
            setCategory(course.category_id?.toString() || '');
            setDescription(course.description || '');
            setWhatYouWillLearn((course as any).what_to_learn || (course as any).what_you_will_learn || '');
            setWhoIsThisFor((course as any).target_audience || (course as any).who_is_this_for || '');
            setPricingType((course as any).price_type || (Number(course.price) === 0 ? 'free' : 'paid'));
            setStatus(course.status || 'draft');
            setPrice(course.price?.toString() || '');
            setCurrency((course.currency as any) || 'SAR');
            setSelectedInstructor(course.user_id || null);
            if (course.image) setPreviewUrl(course.image);
            setCourseType(course.type || '');
          } else if (initialCourseType) {
            setCourseType(initialCourseType);
          }
        } catch (error) {
          console.error('Failed to fetch initial data:', error);
        }
      };
      fetchInitialData();
    }
  }, [isOpen, courseId, initialCourseType]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setErrors({});
    setApiErrorMessages([]);
    try {
      let userId = currentUser?.id || 2;
      if (selectedInstructor) {
        userId = selectedInstructor;
      }

      const payload: any = {
        title,
        category_id: category,
        description,
        user_id: userId,
        what_you_will_learn: whatYouWillLearn,
        who_is_this_for: whoIsThisFor,
        price: pricingType === 'free' ? 0 : Number(price),
        final_price: pricingType === 'free' ? 0 : Number(price),
        status,
        type: mapTypeToBackend(courseType || initialCourseType),
        price_type: pricingType,
        currency,
        image: selectedFile || undefined,
      };

      try {
        if (courseId) {
          await updateCourse(courseId, payload);
          toast.success('تم تحديث الدورة بنجاح');
        } else {
          await createCourse(payload);
          toast.success('تم إنشاء الدورة بنجاح');
        }
        onClose();
      } catch (error: any) {
        // Extract field-level errors object
        const fieldErrors: Record<string, any> = error?.errors || {};
        setErrors(fieldErrors);

        // Flatten ALL error messages into a single list to show in the alert banner
        const allMessages: string[] = [];

        // Add the top-level message if it's meaningful
        if (error?.message && error.message !== 'Validation errors detected.') {
          allMessages.push(error.message);
        }

        // Walk every field in errors and collect its messages
        Object.entries(fieldErrors).forEach(([field, msgs]) => {
          const messages = Array.isArray(msgs) ? msgs : [String(msgs)];
          messages.forEach((msg) => allMessages.push(msg));
        });

        // If nothing was extracted, fall back to the raw message
        if (allMessages.length === 0) {
          allMessages.push(error?.message || 'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.');
        }

        setApiErrorMessages(allMessages);
        const toastMsg = allMessages.length > 0 ? allMessages.join(' | ') : 'يرجى تصحيح الأخطاء أدناه';
        toast.error(toastMsg);
      }
    } catch (error: any) {
      const msg = error?.message || 'فشل الحفظ';
      setApiErrorMessages([msg]);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    currentUser,
    instructors,
    selectedInstructor,
    setSelectedInstructor,
    title,
    setTitle,
    category,
    setCategory,
    categories,
    description,
    setDescription,
    whatYouWillLearn,
    setWhatYouWillLearn,
    whoIsThisFor,
    setWhoIsThisFor,
    openSections,
    toggleSection,
    selectedFile,
    previewUrl,
    fileInputRef,
    handleFileChange,
    pricingType,
    setPricingType,
    price,
    setPrice,
    currency,
    setCurrency,
    status,
    setStatus,
    units,
    isSubmitting,
    errors,
    setErrors,
    apiErrorMessages,
    setApiErrorMessages,
    handleSave,
  };
};
