import { Course, UserProfile } from './index';

export const mockUserProfile: UserProfile = {
  name: 'Ahmed Mohamed Al-Otaibi',
  email: 'ahmed.otaibi@example.com',
  phone: '+966 50 123 4567',
  city: 'الرياض',
  avatar: '/images/avatar.png',
  points: 1240,
  level: 'طالب متميز',
  progress: 85,
};

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'إدارة المشاريع باحترافية PMP',
    description: 'الدليل الشامل لاجتياز اختبار شهادة إدارة المشاريع الاحترافية وتطبيق المنهجيات العالمية.',
    progress: 100,
    image: '/images/course1.png',
    instructor: 'د. أحمد',
    category: 'الإدارة',
    status: 'completed'
  },
  {
    id: '2',
    title: 'علم البيانات للمبتدئين',
    description: 'اكتشف أسرار البيانات وكيفية استخلاص المعلومات القيمة لدعم القرارات الاستراتيجية.',
    progress: 20,
    image: '/images/course2.png',
    instructor: 'م. سارة',
    category: 'البيانات',
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'تطوير تطبيقات الويب المتكاملة',
    description: 'تعلم كيفية بناء تطبيقات ويب حديثة باستخدام React و Node.js من الصفر حتى الاحتراف.',
    progress: 65,
    image: '/images/course3.png',
    instructor: 'م. محمد',
    category: 'البرمجة',
    status: 'in-progress'
  }
];
