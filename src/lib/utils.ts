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

export function translateErrorToArabic(msg: string): string {
  if (!msg) return '';
  const normalized = msg.toLowerCase().trim();

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

  // Name & Category & Course Info / Lesson Info
  if (normalized.includes('name has already been taken')) return 'الاسم مستخدم بالفعل.';
  if (normalized.includes('name field is required') || normalized.includes('name is required')) return 'الاسم مطلوب.';
  if (normalized.includes('must be a string')) {
    if (normalized.includes('name')) return 'اسم الفئة يجب أن يكون نصاً.';
    return 'الحقل يجب أن يكون نصاً.';
  }
  if (normalized.includes('title field is required') || normalized.includes('title is required')) {
    return 'العنوان مطلوب.';
  }
  if (normalized.includes('address field is required') || normalized.includes('address is required')) return 'موقع أو عنوان المحاضرة مطلوب.';
  if (normalized.includes('start date field is required') || normalized.includes('start_date field is required')) return 'تاريخ بداية المحاضرة مطلوب.';
  if (normalized.includes('end date field is required') || normalized.includes('end_date field is required')) return 'تاريخ نهاية المحاضرة مطلوب.';
  if (normalized.includes('description field is required') || normalized.includes('description is required')) return 'الوصف مطلوب.';
  if (
    normalized.includes('category id field is required') || 
    normalized.includes('category_id field is required') || 
    normalized.includes('category is required')
  ) {
    return 'الفئة مطلوبة.';
  }
  if (
    normalized.includes('user id field is required') || 
    normalized.includes('user_id field is required') || 
    normalized.includes('user is required')
  ) {
    return 'المدرب مطلوب.';
  }
  if (normalized.includes('price field is required') || normalized.includes('price is required')) return 'سعر الدورة مطلوب للدورات المدفوعة.';

  // Payment Accounts
  if (
    normalized.includes('receiver_accounts') || 
    normalized.includes('receiver accounts') || 
    normalized.includes('receiving account') || 
    normalized.includes('receiving_account') || 
    normalized.includes('receiver')
  ) {
    return 'يرجى تحديد حساب أو وسيلة استقبال المدفوعات (حساب التحصيل مطلوب للدورات المدفوعة).';
  }

  // Auth & General
  if (normalized.includes('credentials do not match')) return 'بيانات الاعتماد هذه غير متطابقة مع سجلاتنا.';
  if (normalized.includes('package id is invalid') || normalized.includes('package_id is invalid')) return 'الباقة المحددة غير صالحة.';
  if (normalized.includes('validation errors detected')) return 'يرجى تصحيح الأخطاء في البيانات المدخلة.';
  if (normalized.includes('unauthorized')) return 'غير مصرح بالدخول.';
  if (normalized.includes('forbidden')) return 'غير مسموح بالوصول.';
  if (normalized.includes('server error')) return 'حدث خطأ في الخادم.';

  return msg;
}

export function getErrorMessage(error: any, defaultMsg: string = 'حدث خطأ ما'): string {
  if (!error) return defaultMsg;

  // 1. Check for validation errors in error.errors
  if (error.errors && typeof error.errors === 'object') {
    const errObj = error.errors as Record<string, string | string[]>;
    const getFirst = (v: string | string[]) => (Array.isArray(v) ? v[0] : v) || '';
    const allMsgs = Object.values(errObj)
      .map((v) => translateErrorToArabic(getFirst(v)))
      .filter(Boolean);

    if (allMsgs.length > 0) {
      return allMsgs.join('\n');
    }
  }

  // 2. Check for message on error object or nested error
  if (error.message && typeof error.message === 'string') {
    if (error.message.toLowerCase().includes('validation errors detected') && error.errors) {
      const errObj = error.errors as Record<string, any>;
      const msgs = Object.values(errObj).flat().map((m) => translateErrorToArabic(String(m))).filter(Boolean);
      if (msgs.length > 0) return msgs.join('\n');
    }
    return translateErrorToArabic(error.message);
  }

  if (typeof error === 'string') {
    return translateErrorToArabic(error);
  }

  return defaultMsg;
}


