import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateLandingPage } from '../services/landing.api';
import { useLandingStore } from '../store/landingStore';

export function useLandingSave() {
  const [saving, setSaving] = useState(false);
  const content = useLandingStore(state => state.content);
  const courseId = useLandingStore(state => state.courseId);
  const templateName = useLandingStore(state => state.templateName);
  const isActive = useLandingStore(state => state.isActive);
  const userId = useLandingStore(state => state.userId);

  const handleSave = async (customUserId?: number) => {
    if (!courseId) {
      toast.error('معرف الدورة غير متوفر');
      return false;
    }
    if (!content) {
      toast.error('محتوى التخصيص غير متوفر');
      return false;
    }

    setSaving(true);
    try {
      const payload = {
        template_name: templateName,
        content: content,
        is_active: isActive,
        course_id: Number(courseId),
        user_id: Number(userId || customUserId || 3) // Fallback to 3 if user_id is missing
      };
      await updateLandingPage(payload);
      toast.success('تم حفظ تعديلات صفحة الهبوط بنجاح!');
      return true;
    } catch (error: any) {
      console.error('Failed to save landing page customization:', error);
      toast.error(error.message || 'فشل حفظ تعديلات صفحة الهبوط');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, handleSave };
}
