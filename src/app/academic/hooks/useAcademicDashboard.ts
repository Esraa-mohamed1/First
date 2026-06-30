'use client';

import { useState, useEffect } from 'react';
import { getCourses, getStats } from '@/services/courses';
import { getUsers } from '@/services/users';
import { getMyUsageLimit } from '@/services/auth';

export const useAcademicDashboard = () => {
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isPremiumExpanded, setIsPremiumExpanded] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Dynamic API states
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [usageLimits, setUsageLimits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const fetchData = async () => {
    try {
      const [coursesData, studentsData, statsData, usageResponse] = await Promise.all([
        getCourses(),
        getUsers('student'),
        getStats().catch(() => null),
        getMyUsageLimit().catch(() => null)
      ]);
      setCourses(coursesData || []);
      setStudents(studentsData || []);
      setStats(statsData || null);
      setUsageLimits(usageResponse?.data || (Array.isArray(usageResponse) ? usageResponse : []));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Enrich API students with dummy courses and payment statuses for presentation
  const enrichedStudents = students.map((s, idx) => {
    const dummyData = [
      { course: 'أساسيات برمجة', status: 'غير مدفوع', date: '22/10/2022' },
      { course: 'تحليل بيانات', status: 'انتظار', date: '19/8/2019' },
      { course: 'إدارة الأعمال', status: 'مدفوع', date: '14/1/2023' },
      { course: 'التسويق الرقمي', status: 'مدفوع', date: '07/07/2018' },
      { course: 'الجرافيك ديزاين', status: 'مدفوع', date: '12/10/2022' },
    ];
    const dummy = dummyData[idx % dummyData.length];
    
    let dateStr = dummy.date;
    if (s.created_at) {
      try {
        const d = new Date(s.created_at);
        dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      } catch (e) {}
    }
    
    return {
      name: s.name,
      course: dummy.course,
      date: dateStr,
      status: dummy.status
    };
  });

  // Carousel slides data
  const carouselSlides = [
    {
      title: "عزّز موقعك على محرك Microsoft Bing",
      description: "توفر أدوات Bing Webmaster بيانات أداء الموقع ورؤى مجانية لتحسين محركات البحث(SEO) لمساعدتك على تحسين ترتيب موقعك في نتائج بحث Bing"
    },
    {
      title: "حلّل أداء طلابك بسهولة",
      description: "احصل على تقارير تفصيلية حول سلوك الطلاب، وتقدمهم في الدروس، ونسب الإكمال لمساعدتهم على التفوق والنجاح."
    },
    {
      title: "ادعُ مدربين لمساعدتك",
      description: "يمكنك الآن تفويض المهام وتوزيع الكورسات على مدربين مساعدين، ومراقبة تقارير المبيعات الخاصة بكل منهم بكل سهولة."
    }
  ];

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
  };

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  // Dynamic calculations for progress meters
  const maxStudentsObj = usageLimits.find((i: any) => i.feature_slug === 'max_students');
  const maxCoursesObj = usageLimits.find((i: any) => i.feature_slug === 'max_courses');
  const storageLimitObj = usageLimits.find((i: any) => i.feature_slug === 'storage_limit');

  const totalStudentsLimit = maxStudentsObj ? parseFloat(maxStudentsObj.total_limit || '5000') : 5000;
  const usedStudents = students.length;
  const remainingStudents = Math.max(totalStudentsLimit - usedStudents, 0);
  const studentProgressPercent = totalStudentsLimit > 0 ? Math.min((usedStudents / totalStudentsLimit) * 100, 100) : 0;

  const totalCoursesLimit = maxCoursesObj ? parseFloat(maxCoursesObj.total_limit || '50') : 50;
  const usedCourses = maxCoursesObj ? parseFloat(maxCoursesObj.used_amount || '0') : (stats?.published_courses || courses.length || 0);
  const remainingCourses = Math.max(totalCoursesLimit - usedCourses, 0);
  const courseProgressPercent = totalCoursesLimit > 0 ? Math.min((usedCourses / totalCoursesLimit) * 100, 100) : 0;

  // Storage calculation from API usage limit
  const storageUsed = storageLimitObj ? parseFloat(storageLimitObj.used_amount || '0') : (usedCourses > 0 ? 8.2 : 0);
  const storageTotal = storageLimitObj ? parseFloat(storageLimitObj.total_limit || '10') : 10;
  const storagePercent = storageTotal > 0 ? Math.min(Math.round((storageUsed / storageTotal) * 100), 100) : 0;

  return {
    isSelectTypeModalOpen,
    setIsSelectTypeModalOpen,
    isAddStudentModalOpen,
    setIsAddStudentModalOpen,
    isPremiumExpanded,
    setIsPremiumExpanded,
    carouselIndex,
    setCarouselIndex,
    courses,
    students,
    stats,
    loading,
    fetchData,
    enrichedStudents,
    carouselSlides,
    handleNextSlide,
    handlePrevSlide,
    totalStudentsLimit,
    usedStudents,
    remainingStudents,
    studentProgressPercent,
    totalCoursesLimit,
    usedCourses,
    remainingCourses,
    courseProgressPercent,
    storagePercent,
  };
};
