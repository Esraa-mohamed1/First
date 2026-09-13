export const translateErrorToArabic = (msg: string): string => {
  if (!msg) return '';
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
