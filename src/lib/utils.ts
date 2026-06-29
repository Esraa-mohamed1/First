import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLogoUrl(logo?: string | null): string {
  if (!logo) return '';
  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo;
  }
  const cleanLogo = logo.startsWith('/') ? logo.substring(1) : logo;
  return `https://api.darab.academy/${cleanLogo}`;
}

export function translateErrorToArabic(msg: string): string {
  if (!msg) return '';
  const normalized = msg.toLowerCase().trim();

  // Email
  if (normalized.includes('email has already been taken')) return 'البريد الإلكتروني مستخدم بالفعل.';
  if (normalized.includes('email field is required') || normalized.includes('email is required')) return 'البريد الإلكتروني مطلوب.';
  if (normalized.includes('email must be a valid email')) return 'البريد الإلكتروني يجب أن يكون عنواناً صالحاً.';

  // Phone
  if (normalized.includes('phone has already been taken')) return 'رقم الجوال مستخدم بالفعل.';
  if (normalized.includes('phone field is required') || normalized.includes('phone is required')) return 'رقم الجوال مطلوب.';
  if (normalized.includes('phone must be') || normalized.includes('phone is invalid') || normalized.includes('phone format')) return 'رقم الجوال غير صالح.';

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


