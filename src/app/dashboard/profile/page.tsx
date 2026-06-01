import { Metadata } from 'next';
import DashboardProfile from '@/components/Profile/DashboardProfile';

export const metadata: Metadata = {
  title: 'الملف الشخصي للمدرب - درب',
  description: 'إدارة وتعديل الملف التعريفي والبيانات الأساسية والدورات المميزة للمدرب.',
};

export default function TeacherProfilePage() {
  return <DashboardProfile role="teacher" />;
}
