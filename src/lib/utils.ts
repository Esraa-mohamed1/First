import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLogoUrl(logo?: string | null): string {
  if (!logo) return '';
  let url = logo;
  if (!logo.startsWith('http://') && !logo.startsWith('https://')) {
    const cleanLogo = logo.startsWith('/') ? logo.substring(1) : logo;
    url = `https://api.darab.academy/${cleanLogo}`;
  }
  
  // If the path contains '/uploads/' but not '/storage/uploads/', rewrite it
  // to insert '/storage' so that the files resolve correctly.
  if (url.includes('/uploads/') && !url.includes('/storage/uploads/')) {
    url = url.replace('/uploads/', '/storage/uploads/');
  }
  
  return url;
}

export function formatCourseAccessDuration(course: any): string {
  if (!course) return 'صلاحية مدى الحياة';
  const type = course.access_duration_type || course.access_type || course.accessDurationType;
  if (type === 'days') {
    const days = course.access_days || course.accessDays;
    if (days) return `وصول لمدة ${days} يوم`;
    return 'وصول محدود بأيام';
  }
  if (type === 'until_date' || type === 'date') {
    const date = course.access_until_date || course.accessUntilDate;
    if (date) return `وصول حتى ${date}`;
    return 'وصول حتى تاريخ محدد';
  }
  if (course.access_period && typeof course.access_period === 'string') {
    return course.access_period;
  }
  return 'صلاحية مدى الحياة';
}

export function translateErrorToArabic(msg: string): string {
  if (!msg) return '';
  const normalized = msg.toLowerCase().trim();

  // Access Until Date & Duration
  if (
    normalized.includes('access_until_date') ||
    normalized.includes('access until date') ||
    normalized.includes('access end date') ||
    normalized.includes('specify the access end date')
  ) {
    return 'يرجى تحديد تاريخ نهاية صلاحية الوصول للدورة.';
  }
  if (
    normalized.includes('access_days') ||
    normalized.includes('access days') ||
    normalized.includes('number of access days') ||
    normalized.includes('specify the number of access days')
  ) {
    return 'يرجى تحديد عدد أيام الوصول (مدة صلاحية الدورة).';
  }
  if (
    normalized.includes('access_duration') ||
    normalized.includes('access duration') ||
    normalized.includes('access_duration_type')
  ) {
    return 'يرجى تحديد نوع مدة صلاحية الوصول للدورة.';
  }
  if (
    normalized.includes('must be a date after') ||
    normalized.includes('must be a date after today')
  ) {
    return 'تاريخ انتهاء الوصول يجب أن يكون تاريخاً مستقبلياً.';
  }

  // Email
  if (normalized.includes('selected email is invalid') || normalized.includes('email is invalid') || normalized.includes('email is not valid')) return 'البريد الإلكتروني المحدد غير صالح.';
  if (normalized.includes('email has already been taken')) return 'البريد الإلكتروني مستخدم بالفعل.';
  if (normalized.includes('email field is required') || normalized.includes('email is required')) return 'البريد الإلكتروني مطلوب.';
  if (normalized.includes('email must be a valid email')) return 'البريد الإلكتروني يجب أن يكون عنواناً صالحاً.';

  // Phone & Academy Phone
  if (normalized.includes('selected phone is invalid') || normalized.includes('phone is invalid') || normalized.includes('phone_academy is invalid') || normalized.includes('phone is not valid')) return 'رقم الجوال المحدد غير صالح.';
  if (normalized.includes('phone has already been taken') || normalized.includes('phone_academy has already been taken')) return 'رقم الجوال مستخدم بالفعل.';
  if (normalized.includes('phone field is required') || normalized.includes('phone is required') || normalized.includes('phone_academy is required')) return 'رقم الجوال مطلوب.';
  if (normalized.includes('phone must be') || normalized.includes('phone format')) return 'رقم الجوال غير صالح.';

  // Username & Domain
  if (normalized.includes('selected username is invalid') || normalized.includes('username is invalid')) return 'اسم الأكاديمية أو المستخدم غير صالح.';
  if (normalized.includes('selected link_academy is invalid') || normalized.includes('link_academy is invalid') || normalized.includes('link_academy has already been taken')) return 'رابط المنصة غير صالح أو مستخدم بالفعل.';

  // Password
  if (normalized.includes('password field is required') || normalized.includes('password is required')) return 'كلمة المرور مطلوبة.';
  if (normalized.includes('password must be at least 8')) return 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.';
  if (
    normalized.includes('password confirmation does not match') || 
    normalized.includes('password_confirmation confirmation does not match') || 
    normalized.includes('password confirmation') || 
    normalized.includes('password_confirmation')
  ) {
    return 'تأكيد كلمة المرور غير متطابق.';
  }

  // Name & Title & Category & Course Info / Lesson Info
  if (normalized.includes('name has already been taken')) return 'الاسم مستخدم بالفعل.';
  if (normalized.includes('name field is required') || normalized.includes('name is required')) return 'الاسم مطلوب.';
  if (normalized.includes('must be a string')) {
    if (normalized.includes('name')) return 'اسم الفئة يجب أن يكون نصاً.';
    return 'الحقل يجب أن يكون نصاً.';
  }
  if (normalized.includes('title field is required') || normalized.includes('title is required') || normalized.includes('title required')) {
    return 'اسم الدورة مطلوب.';
  }
  if (normalized.includes('address field is required') || normalized.includes('address is required')) return 'موقع أو عنوان المحاضرة مطلوب.';
  if (normalized.includes('start date field is required') || normalized.includes('start_date field is required')) return 'تاريخ بداية المحاضرة مطلوب.';
  if (normalized.includes('end date field is required') || normalized.includes('end_date field is required')) return 'تاريخ نهاية المحاضرة مطلوب.';
  if (normalized.includes('short_description') || normalized.includes('short description')) return 'الوصف المختصر مطلوب.';
  if (normalized.includes('description field is required') || normalized.includes('description is required')) return 'وصف الدورة مطلوب.';
  if (
    normalized.includes('category id field is required') || 
    normalized.includes('category_id field is required') || 
    normalized.includes('category_id') ||
    normalized.includes('category is required')
  ) {
    return 'تصنيف الدورة مطلوب.';
  }
  if (
    normalized.includes('user id field is required') || 
    normalized.includes('user_id field is required') || 
    normalized.includes('user_id') ||
    normalized.includes('user is required')
  ) {
    return 'المدرب مطلوب.';
  }
  if (normalized.includes('price field is required') || normalized.includes('price is required') || normalized.includes('price required')) return 'سعر الدورة مطلوب للدورات المدفوعة.';

  // Landing Page
  if (normalized.includes('landing page id is required')) return 'معرف صفحة الهبوط مطلوب للتحديث.';
  if (normalized.includes('landing page')) return 'خطأ في صفحة الهبوط.';

  // Academic Classifications
  if (normalized.includes('subject_id') || normalized.includes('subject id') || normalized.includes('subject is required')) return 'المادة الدراسية مطلوبة.';
  if (normalized.includes('academic_year_id') || normalized.includes('academic_year') || normalized.includes('academic year')) return 'السنة الدراسية مطلوبة.';
  if (normalized.includes('grade_id') || normalized.includes('grade is required')) return 'الصف الدراسي مطلوب.';
  if (normalized.includes('term_id') || normalized.includes('term is required')) return 'الترم الدراسي مطلوب.';

  // Images & Attachments
  if (normalized.includes('image field is required') || normalized.includes('image is required') || normalized.includes('image required')) return 'صورة المعاينة مطلوبة.';
  if (normalized.includes('file field is required') || normalized.includes('file is required')) return 'الملف المرفق مطلوب.';

  // Pricing & Payment Methods
  if (normalized.includes('type_price') || normalized.includes('type price')) return 'يرجى تحديد نوع السعر (مجاني أو مدفوع).';
  if (normalized.includes('payment_info_ids') || normalized.includes('payment_info') || normalized.includes('receiver_accounts') || normalized.includes('receiver accounts')) return 'يرجى اختيار وسيلة دفع واحدة على الأقل لاستقبال الأموال.';

  // General Field Errors
  if (normalized.includes('already been taken') || normalized.includes('already taken') || normalized.includes('already exists')) {
    return 'هذه البيانات مستخدمة بالفعل، يرجى إدخال بيانات أخرى.';
  }

  // Auth & General
  if (normalized.includes('credentials do not match') || normalized.includes('invalid credentials')) return 'بيانات الاعتماد هذه غير متطابقة مع سجلاتنا.';
  if (normalized.includes('package id is invalid') || normalized.includes('package_id is invalid')) return 'الباقة المحددة غير صالحة.';
  if (normalized.includes('validation errors detected')) return 'يرجى تصحيح الأخطاء في البيانات المدخلة.';
  if (normalized.includes('unauthorized') || normalized.includes('unauthenticated')) return 'غير مصرح بالدخول، يرجى تسجيل الدخول.';
  if (normalized.includes('forbidden')) return 'غير مسموح بالوصول لهذا الإجراء.';
  if (normalized.includes('server error') || normalized.includes('internal server error')) return 'حدث خطأ في الخادم.';
  if (normalized.includes('network error') || normalized.includes('failed to fetch')) return 'حدث خطأ في الاتصال بالشبكة.';

  return msg;
}

export function getErrorMessage(error: any, defaultMsg: string = 'حدث خطأ ما'): string {
  if (!error) return defaultMsg;

  const dataObj = error.response?.data || error.data || error;

  // 1. Check for validation errors object (e.g. dataObj.errors = { access_until_date: ["You must specify..."] })
  if (dataObj && dataObj.errors && typeof dataObj.errors === 'object') {
    const errObj = dataObj.errors as Record<string, string | string[]>;
    const getFirst = (v: string | string[]) => (Array.isArray(v) ? v[0] : v) || '';
    const allMsgs = Object.values(errObj)
      .map((v) => translateErrorToArabic(getFirst(v)))
      .filter(Boolean);

    if (allMsgs.length > 0) {
      return allMsgs.join('\n');
    }
  }

  // 2. Check for message property
  const msg = dataObj.message || error.message;
  if (msg && typeof msg === 'string') {
    if (msg.toLowerCase().includes('validation errors detected') && dataObj.errors) {
      const errObj = dataObj.errors as Record<string, any>;
      const msgs = Object.values(errObj).flat().map((m) => translateErrorToArabic(String(m))).filter(Boolean);
      if (msgs.length > 0) return msgs.join('\n');
    }
    return translateErrorToArabic(msg);
  }

  if (typeof error === 'string') {
    return translateErrorToArabic(error);
  }

  return defaultMsg;
}


