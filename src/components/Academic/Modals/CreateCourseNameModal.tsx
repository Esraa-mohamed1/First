'use client';

import React, { useState } from 'react';
import { X, Loader2, ArrowLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createCourse } from '@/services/courses';
import { getProfileStatus } from '@/services/auth';
import { getErrorMessage } from '@/lib/utils';
import { purgeAllCourseDraftCache } from '@/lib/auth-storage';

interface CreateCourseNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseType: string;
  onBack?: () => void;
}

export default function CreateCourseNameModal({
  isOpen,
  onClose,
  courseType,
  onBack,
}: CreateCourseNameModalProps) {
  const router = useRouter();
  const [courseName, setCourseName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const mapTypeToBackend = (type: string | null | undefined): string => {
    if (!type) return 'recorded';
    const t = type.toLowerCase().trim();
    if (t === 'live-online' || t === 'online') return 'online';
    if (t === 'in-person' || t === 'physical' || t === 'offline') return 'physical';
    return 'recorded';
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setCourseName('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = courseName.trim();
    if (!trimmedName) {
      toast.error('يرجى إدخال اسم الدورة');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Get current logged-in user ID
      let userId = 1;
      try {
        const profile = await getProfileStatus();
        if (profile?.id) {
          userId = profile.id;
        } else {
          const rawUserInfo = typeof window !== 'undefined' ? localStorage.getItem('user_info') : null;
          if (rawUserInfo) {
            const parsed = JSON.parse(rawUserInfo);
            if (parsed?.id) userId = parsed.id;
          }
        }
      } catch {
        const rawUserInfo = typeof window !== 'undefined' ? localStorage.getItem('user_info') : null;
        if (rawUserInfo) {
          const parsed = JSON.parse(rawUserInfo);
          if (parsed?.id) userId = parsed.id;
        }
      }

      // 2. Prepare payload with status: 'draft'
      const payload: any = {
        title: trimmedName,
        type: mapTypeToBackend(courseType),
        user_id: userId,
        status: 'draft',
        price_type: 'paid',
        price: 0,
        final_price: 0,
        currency: 'SAR',
      };

      // 3. Clear existing draft local storage caches
      purgeAllCourseDraftCache();

      // 4. Call backend API to create initial draft
      const created = await createCourse(payload);

      if (!created || !created.id) {
        throw new Error('لم يتم استلام معرف الدورة من الخادم');
      }

      toast.success('تم إنشاء مسودة الدورة بنجاح');
      setCourseName('');
      onClose();

      // 5. Navigate immediately to the newly created course editor
      router.push(`/academic/courses/${created.id}`);
    } catch (error: any) {
      console.error('Failed to create draft course:', error);
      toast.error(getErrorMessage(error, 'حدث خطأ أثناء إنشاء الدورة'));
      setIsSubmitting(false);
    }
  };

  const typeLabels: Record<string, string> = {
    recorded: 'دورة مسجلة',
    online: 'دورة لايف اون لاين',
    physical: 'دورة حضوري',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleCloseModal}
          disabled={isSubmitting}
          className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-right space-y-2 pr-1">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                {typeLabels[courseType] || 'دورة جديدة'}
              </span>
              {onBack && (
                <button
                  type="button"
                  onClick={() => {
                    if (!isSubmitting) onBack();
                  }}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <span>تغيير النوع</span>
                  <ArrowLeft size={14} />
                </button>
              )}
            </div>
            <h2 className="text-2xl font-black text-gray-900">أدخل اسم الدورة</h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              سيتم إنشاء الدورة كمسودة فوراً ويمكنك إضافة الوحدات والدروس وتعديل كافة التفاصيل لاحقاً.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900 text-right pr-1">
                اسم الدورة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="مثال: دورة التصميم الرقمي الاحترافي"
                autoFocus
                disabled={isSubmitting}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-bold text-right transition-all text-gray-900"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !courseName.trim()}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>جاري إنشاء المسودة...</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>حفظ ومتابعة</span>
                  </>
                )}
              </button>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  disabled={isSubmitting}
                  className="px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all cursor-pointer"
                >
                  رجوع
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
