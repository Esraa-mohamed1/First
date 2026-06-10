import { Metadata } from 'next';
import DashboardProfile from '@/components/Profile/DashboardProfile';

export const metadata: Metadata = {
  title: 'الملف الشخصي للأكاديمية - درب',
  description: 'إدارة وتعديل الملف التعريفي والبيانات الأساسية والدورات المميزة للأكاديمية.',
};

export default function AcademyProfilePage() {
  return <DashboardProfile role="academy" />;
}
