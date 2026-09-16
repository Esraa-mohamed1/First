'use client';

import { useState, useEffect } from 'react';
import { getDashboard } from '@/services/courses';
import { getMyUsageLimit, getProfileStatus } from '@/services/auth';
import { getStudentPurchaseRequests } from '@/services/finance';

export const useAcademicDashboard = () => {
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isPremiumExpanded, setIsPremiumExpanded] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Dynamic API states
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [usageLimits, setUsageLimits] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const fetchData = async () => {
    try {
      const [dashboardData, usageResponse, profileResponse, purchaseReqs] = await Promise.all([
        getDashboard().catch(() => null),
        getMyUsageLimit().catch(() => null),
        getProfileStatus().catch(() => null),
        getStudentPurchaseRequests().catch(() => [])
      ]);

      const userObj = profileResponse?.data || profileResponse;
      if (userObj) {
        setUserProfile(userObj);
        const onboardingVal = userObj.onboarding ?? userObj.is_onboarding_completed ?? userObj.onboarding_completed;
        if (onboardingVal === true || onboardingVal === 1 || onboardingVal === '1' || onboardingVal === 'true') {
          setIsOnboardingCompleted(true);
        } else {
          setIsOnboardingCompleted(false);
        }
      }

      const rawReqs: any = purchaseReqs;
      setPurchaseRequests(Array.isArray(rawReqs) ? rawReqs : (rawReqs?.data || []));

      if (dashboardData) {
        // Extract courses from various potential response fields ensuring it is an array
        const coursesData = Array.isArray(dashboardData.latest_courses)
          ? dashboardData.latest_courses
          : (Array.isArray(dashboardData.courses) ? dashboardData.courses : []);
        setCourses(coursesData);

        // Extract students/users from various potential response fields ensuring it is an array
        const studentsData = Array.isArray(dashboardData.latest_users)
          ? dashboardData.latest_users
          : (Array.isArray(dashboardData.students) ? dashboardData.students : []);
        setStudents(studentsData);

        // Extract stats mapping to the exact structure from the /dashboard response
        const statsData = {
          total_revenue: dashboardData.total_sales?.total ?? dashboardData.total_revenue ?? dashboardData.stats?.total_revenue,
          total_revenue_percentage: dashboardData.total_sales?.percentage,
          active_students: dashboardData.new_students?.total ?? dashboardData.active_students ?? dashboardData.stats?.active_students,
          active_students_percentage: dashboardData.new_students?.percentage,
          published_courses: (dashboardData.courses && typeof dashboardData.courses === 'object' && !Array.isArray(dashboardData.courses))
            ? dashboardData.courses.total
            : (Array.isArray(dashboardData.courses) ? dashboardData.courses.length : (dashboardData.published_courses ?? dashboardData.stats?.published_courses)),
          published_courses_percentage: dashboardData.courses?.percentage,
          bags: dashboardData.bags?.total ?? dashboardData.stats?.bags,
          bags_percentage: dashboardData.bags?.percentage,
          instructors_count: dashboardData.instructors_count ?? dashboardData.stats?.instructors_count
        };
        setStats(statsData);
      }
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

  // Build REAL latest updates / activity list based on actual payment requests and user course activity
  const realActivity: any[] = [];

  if (Array.isArray(purchaseRequests) && purchaseRequests.length > 0) {
    purchaseRequests.forEach((req: any) => {
      let dateStr = 'اليوم';
      if (req.created_at || req.starts_at) {
        try {
          const d = new Date(req.created_at || req.starts_at);
          dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        } catch (e) {}
      }

      let statusStr = 'مدفوع';
      const rawStatus = (req.status || '').toLowerCase();
      if (rawStatus === 'pending' || rawStatus === 'penidng' || rawStatus === 'waiting') {
        statusStr = 'انتظار';
      } else if (rawStatus === 'rejected' || rawStatus === 'cancelled' || rawStatus === 'unpaid') {
        statusStr = 'غير مدفوع';
      } else if (rawStatus === 'active' || rawStatus === 'accepted' || rawStatus === 'paid' || rawStatus === 'completed') {
        statusStr = 'مدفوع';
      } else {
        statusStr = req.status || 'مدفوع';
      }

      realActivity.push({
        name: req.user?.name || req.user?.full_name || req.user_name || req.user?.email || 'طالب',
        course: req.course?.title || req.course?.name || req.course_name || '-',
        date: dateStr,
        status: statusStr
      });
    });
  }

  // Combine with registered students if needed
  if (Array.isArray(students)) {
    students.forEach((s: any) => {
      const alreadyInList = realActivity.some((item) => item.name === s.name);
      if (!alreadyInList && s.name) {
        let dateStr = 'اليوم';
        if (s.created_at) {
          try {
            const d = new Date(s.created_at);
            dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
          } catch (e) {}
        }

        realActivity.push({
          name: s.name,
          course: s.course_name || s.course_title || s.course || s.course_id || '-',
          date: dateStr,
          status: s.payment_status || s.status || '-'
        });
      }
    });
  }

  const enrichedStudents = realActivity;

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

  // Dynamic calculations for progress meters & package information directly from /my-usage-limit API
  const maxStudentsObj = usageLimits.find((i: any) => 
    i.feature_slug === 'max_students' || i.slug === 'max_students' || i.feature_slug === 'students_limit' || i.slug === 'students_limit' || i.name?.includes('طلاب') || i.lable?.includes('طلاب')
  );
  const maxCoursesObj = usageLimits.find((i: any) => 
    i.feature_slug === 'max_courses' || i.slug === 'max_courses' || i.feature_slug === 'courses_limit' || i.slug === 'courses_limit' || i.name?.includes('دورات') || i.lable?.includes('دورات')
  );
  const storageLimitObj = usageLimits.find((i: any) => 
    i.feature_slug === 'storage_limit' || i.slug === 'storage_limit' || i.name?.includes('تخزين') || i.lable?.includes('تخزين')
  );

  const rawPackageName = userProfile?.package_name || userProfile?.package?.name || userProfile?.package?.title || '';
  const packageName = rawPackageName || (userProfile?.status_payment === 'free_trial' ? 'الباقة التجريبية' : 'الباقة الحالية');
  const packageStatus = userProfile?.status_payment === 'free_trial' ? 'تجريبية' : (userProfile?.is_active ? 'نشط' : (userProfile?.status_payment || 'نشط'));

  const usedStudents = maxStudentsObj ? parseFloat(maxStudentsObj.used_amount ?? maxStudentsObj.used ?? '0') : (stats?.active_students || 0);
  const totalStudentsLimit = maxStudentsObj ? parseFloat(maxStudentsObj.total_limit ?? maxStudentsObj.limit ?? '50') : 50;
  const remainingStudents = Math.max(totalStudentsLimit - usedStudents, 0);
  const studentProgressPercent = totalStudentsLimit > 0 ? Math.min((usedStudents / totalStudentsLimit) * 100, 100) : 0;

  const usedCourses = maxCoursesObj ? parseFloat(maxCoursesObj.used_amount ?? maxCoursesObj.used ?? '0') : (stats?.published_courses || 0);
  const totalCoursesLimit = maxCoursesObj ? parseFloat(maxCoursesObj.total_limit ?? maxCoursesObj.limit ?? '50') : 50;
  const remainingCourses = Math.max(totalCoursesLimit - usedCourses, 0);
  const courseProgressPercent = totalCoursesLimit > 0 ? Math.min((usedCourses / totalCoursesLimit) * 100, 100) : 0;

  // Storage calculation from API usage limit (converting MB to GB if needed)
  const rawStorageUsed = storageLimitObj ? parseFloat(storageLimitObj.used_amount ?? storageLimitObj.used ?? '0') : 0;
  const storageUsed = rawStorageUsed > 100 ? rawStorageUsed / 1024 : rawStorageUsed;
  const storageTotal = storageLimitObj ? parseFloat(storageLimitObj.total_limit ?? storageLimitObj.limit ?? '10') : 10;
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
    isOnboardingCompleted,
    fetchData,
    enrichedStudents,
    carouselSlides,
    handleNextSlide,
    handlePrevSlide,
    packageName,
    packageStatus,
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
