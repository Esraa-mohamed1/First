'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Eye, 
  RotateCw, 
  Wallet, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  BookOpen, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft, 
  Rocket, 
  Check, 
  GripHorizontal,
  Cloud,
  Layers,
  UserPlus
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/Academic/StatsCard';
import SelectCourseTypeModal from '@/components/Academic/Modals/SelectCourseTypeModal';
import AddStudentModal from '@/components/Academic/Modals/AddStudentModal';
import { getCourses, getStats } from '@/services/courses';
import { getUsers } from '@/services/users';

export default function AcademicDashboardPage() {
  const router = useRouter();
  const [isSelectTypeModalOpen, setIsSelectTypeModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isPremiumExpanded, setIsPremiumExpanded] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Dynamic API states
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const fetchData = async () => {
    try {
      const [coursesData, studentsData, statsData] = await Promise.all([
        getCourses(),
        getUsers('student'),
        getStats().catch(() => null)
      ]);
      setCourses(coursesData || []);
      setStudents(studentsData || []);
      setStats(statsData || null);
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
  const totalStudentsLimit = 5000;
  const usedStudents = stats?.active_students || students.length || 0;
  const remainingStudents = Math.max(totalStudentsLimit - usedStudents, 0);
  const studentProgressPercent = Math.min((usedStudents / totalStudentsLimit) * 100, 100);

  const totalCoursesLimit = 50;
  const usedCourses = stats?.published_courses || courses.length || 0;
  const remainingCourses = Math.max(totalCoursesLimit - usedCourses, 0);
  const courseProgressPercent = Math.min((usedCourses / totalCoursesLimit) * 100, 100);

  // Storage calculation (mocked based on courses presence or real usage)
  const storagePercent = usedCourses > 0 ? 82 : 0;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700 text-right" dir="rtl">
      
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 text-right">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">لوحة التحكم</h2>
        <div className="flex justify-start">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors">
            <ChevronDown size={25} className="text-gray-400" />
            <span>التاريخ</span>
          </button>
        </div>
      </div>

      {/* 1. Stats Grid (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
        <StatCard
          title="اجمالي المبيعات"
          value={stats?.total_revenue ? `${stats.total_revenue}$` : "40,689$"}
          trend={{ value: 8.5, isPositive: true }}
          icon={Wallet}
          color="purple"
        />
        <StatCard
          title="عدد الطلاب الجدد"
          value={stats?.active_students ? String(stats.active_students) : "2,689"}
          trend={{ value: 10.5, isPositive: true }}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="عدد الزيارات"
          value="205"
          trend={{ value: 8.5, isPositive: true }}
          icon={Eye}
          color="orange"
        />
        <StatCard
          title="عدد الدورات"
          value={stats?.published_courses ? String(stats.published_courses) : "1,436"}
          trend={{ value: 2.6, isPositive: true }}
          icon={RotateCw}
          color="red"
        />
        <StatCard
          title="الرصيد الحالي"
          value="20,214"
          trend={{ value: 2.6, isPositive: true }}
          icon={Wallet}
          color="green"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT COLUMN (Main widgets) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6 lg:space-y-8 order-1">
          
          {/* A. Last Registered Students Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-gray-900">اخر الطلاب المسجلين</h3>
            </div>

            {enrichedStudents.length === 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                        <th className="pb-4 pt-2 font-black">اسم الطالب</th>
                        <th className="pb-4 pt-2 font-black">الدورة</th>
                        <th className="pb-4 pt-2 font-black">تاريخ التسجيل</th>
                        <th className="pb-4 pt-2 font-black text-left">حالة الدفع</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                {/* Empty State Table Placeholder */}
                <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
                  <div className="w-16 h-16 bg-[#F0F5FF] rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-inner">
                    <UserPlus size={28} />
                  </div>
                  <h4 className="text-base font-black text-gray-900 mb-1">لا يوجد طلاب مسجلون بعد</h4>
                  <p className="text-xs font-bold text-gray-400 max-w-sm leading-relaxed mb-6">
                    ابدأ الآن بإضافة أول طالب وابدأ في متابعة نمو أكاديميتك بسهولة.
                  </p>
                  <button 
                    onClick={() => setIsAddStudentModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                  >
                    <Plus size={16} strokeWidth={3} />
                    <span>أضف طالبك الأول</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                        <th className="pb-4 pt-2 font-black">اسم الطالب</th>
                        <th className="pb-4 pt-2 font-black">الدورة</th>
                        <th className="pb-4 pt-2 font-black">تاريخ التسجيل</th>
                        <th className="pb-4 pt-2 font-black text-left">حالة الدفع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {enrichedStudents.slice(0, 5).map((student, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 font-bold text-sm text-gray-900">
                            <div className="flex items-center gap-3 justify-start">
                              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs shrink-0">
                                {student.name ? student.name.charAt(0) : 'ط'}
                              </div>
                              <span>{student.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-xs font-bold text-gray-500">{student.course}</td>
                          <td className="py-4 text-xs font-bold text-gray-500">{student.date}</td>
                          <td className="py-4 text-left">
                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black inline-block min-w-[80px] text-center ${
                              student.status === 'مدفوع' ? 'bg-green-50 text-emerald-600 border border-green-100' :
                              student.status === 'انتظار' ? 'bg-orange-50 text-orange-500 border border-orange-100' :
                              'bg-gray-50 text-gray-500 border border-gray-100'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-100 gap-4">
                  <span className="text-xs font-bold text-gray-400">
                    عرض 1 إلى {Math.min(enrichedStudents.length, 5)} من أصل {enrichedStudents.length} طالب
                  </span>
                  <div className="flex items-center gap-1.5" dir="ltr">
                    <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                      1
                    </button>
                    <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-bold text-xs">
                      2
                    </button>
                    <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-bold text-xs">
                      3
                    </button>
                    <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* B. Course Library Card (Dashed Border / Grid Layout if courses exist) */}
          {courses.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 md:p-12 text-center flex flex-col items-center justify-center gap-5 hover:border-blue-200 transition-all duration-300">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                <BookOpen size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-gray-900">مكتبة دوراتك تنتظر اول اعمالك</h3>
                <p className="text-xs font-bold text-gray-400 max-w-sm leading-relaxed">
                  قم بانشاء محتوي تعليمي ملهم وابدأ رحلتك التعليمية الأن
                </p>
              </div>
              <button 
                onClick={() => setIsSelectTypeModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                <Plus size={16} strokeWidth={3} />
                <span>انشاء دورة جديدة</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-right">
              <h3 className="text-lg font-black text-gray-900">أحدث دورة مضافة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Latest Course Item Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300">
                  <div className="relative h-44 w-full bg-slate-50 border-b border-gray-50">
                    <Image
                      src={courses[0].image_url || courses[0].image || "/assets/course3.jpg"}
                      alt={courses[0].name || courses[0].title || "Course Thumbnail"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-black text-gray-900 text-base">{courses[0].name || courses[0].title}</h4>
                      <p className="text-xs text-gray-400 font-bold leading-relaxed line-clamp-2">
                        {courses[0].description || "شرح مبسط يساعدك على فهم أساسيات المادة العلمية خطوة بخطوة."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        onClick={() => router.push(`/academic/courses`)}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs transition-all active:scale-95 text-center shadow-md shadow-blue-600/10"
                      >
                        تعديل الدورة
                      </button>
                      <button 
                        onClick={() => router.push(`/academic/courses/stats`)}
                        className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-black text-xs transition-all active:scale-95 text-center"
                      >
                        احصائيات الدورة
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Dashed Add Course Card */}
                <button 
                  onClick={() => setIsSelectTypeModalOpen(true)}
                  className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-blue-300 hover:bg-blue-50/10 group transition-all duration-300 min-h-[280px]"
                >
                  <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm">
                    <Plus size={28} />
                  </div>
                  <span className="font-black text-sm text-gray-900">اضافة دورة تدريبية اخرى</span>
                </button>

              </div>
            </div>
          )}

          {/* C. Premium Package Usage Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            
            {/* Header Block */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Package Icon */}
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
                  <Layers size={24} />
                </div>
                {/* Title & Desc */}
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-black text-gray-900">استهلاك الباقة البريميوم</h3>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-100">
                      نشط
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-400">
                    نظرة عامة علي الموارد المستخدمة والمتاحة
                  </p>
                </div>
              </div>
              {/* Collapse/Expand Toggle */}
              <button 
                onClick={() => setIsPremiumExpanded(!isPremiumExpanded)}
                className="p-1.5 hover:bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all shrink-0"
              >
                {isPremiumExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {/* Content (Collapsible) */}
            {isPremiumExpanded && (
              <div className="space-y-6 pt-5 border-t border-gray-100 animate-in fade-in duration-300">
                <div className="text-right">
                  <p className="text-xs font-black text-gray-500">
                    تاريخ التجديد القادم : <span className="text-gray-900 font-bold">12 يناير 2024</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Students Usage */}
                  <div className="space-y-3 bg-gray-50/50 p-5 rounded-2xl border border-gray-50">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-gray-900">
                        {totalStudentsLimit.toLocaleString('en-US')}/{usedStudents.toLocaleString('en-US')}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Users size={14} className="text-gray-400" />
                        <span>عدد الطلاب</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${studentProgressPercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold text-center">
                      {remainingStudents > 0 ? (
                        <>تبقي لديك <span className="text-gray-950 font-black">{remainingStudents.toLocaleString('ar-EG')} مقعدا طلابيا</span></>
                      ) : (
                        <span className="text-red-500 font-black">لقد استنفدت كامل مقاعد الطلاب</span>
                      )}
                    </p>
                  </div>

                  {/* Storage Space Usage */}
                  <div className="space-y-3 bg-gray-50/50 p-5 rounded-2xl border border-gray-50">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className={storagePercent > 0 ? "text-red-500" : "text-blue-600"}>
                        {storagePercent}% مستخدم
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Cloud size={14} className="text-gray-400" />
                        <span>مساحة التخزين</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${storagePercent > 0 ? 'bg-red-500' : 'bg-blue-600'}`} 
                        style={{ width: `${storagePercent}%` }}
                      />
                    </div>
                    <p className={`text-[10px] font-black text-center ${storagePercent > 0 ? 'text-red-500' : 'text-blue-600'}`}>
                      {storagePercent > 0 ? 'تحذير : لقد اوشكت على استهلاك مساحة التخزين' : '100% متاح'}
                    </p>
                  </div>

                  {/* Courses Usage */}
                  <div className="space-y-3 bg-gray-50/50 p-5 rounded-2xl border border-gray-50">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-gray-900">{totalCoursesLimit}/{usedCourses}</span>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Layers size={14} className="text-gray-400" />
                        <span>عدد الدورات</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${courseProgressPercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold text-center">
                      {usedCourses > 0 ? (
                        <>يمكنك اضافة <span className="text-gray-950 font-black">{remainingCourses} دورة اضافية</span></>
                      ) : (
                        <span>لا يوجد دورات مضافة</span>
                      )}
                    </p>
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>

        {/* LEFT COLUMN (Sidebar widgets) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6 lg:space-y-8 order-2">
          
          {/* D. Checklist Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Rocket size={22} />
              </div>
              <h3 className="font-black text-gray-900 text-lg tracking-tight">خطواتك الأولى</h3>
            </div>

            {/* Steps layout with vertical connector line */}
            <div className="relative pr-5 border-r border-gray-100 space-y-8 py-2">
              
              {/* Step 1: Completed */}
              <div className="flex items-start gap-4 relative">
                {/* Step indicator on vertical line */}
                <div className="absolute -right-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center z-10 shadow-sm ring-2 ring-white">
                  <Check size={9} className="text-white" strokeWidth={5} />
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-black text-gray-900 leading-tight">1- اعدادات الملف</h4>
                  <p className="text-xs text-gray-400 font-bold mt-1 leading-normal">
                    اكملت المعلومات الأساسية
                  </p>
                </div>
              </div>

              {/* Step 2: Active */}
              <div className="flex items-start gap-4 relative">
                {/* Step indicator on vertical line */}
                <div className="absolute -right-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center z-10 shadow-sm ring-2 ring-white text-[9px] font-black text-gray-500">
                  2
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-black text-gray-900 leading-tight">2- انشاء دورة</h4>
                  <p className="text-xs text-gray-400 font-bold mt-1 leading-normal">
                    ابدأ بانشاء دورتك الأولى
                  </p>
                  <button 
                    onClick={() => setIsSelectTypeModalOpen(true)}
                    className="text-blue-600 underline font-black text-xs block mt-2 hover:text-blue-700 transition-colors"
                  >
                    ابدأ الآن
                  </button>
                </div>
              </div>

              {/* Step 3: Pending */}
              <div className="flex items-start gap-4 relative">
                {/* Step indicator on vertical line */}
                <div className="absolute -right-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center z-10 shadow-sm ring-2 ring-white text-[9px] font-black text-gray-500">
                  3
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-black text-gray-950 leading-tight">3- اضافة مدربين</h4>
                  <p className="text-xs text-gray-400 font-bold mt-1 leading-normal">
                    ابدأ بالخطوات لاكمال الفريق
                  </p>
                </div>
              </div>

              {/* E. Tip of the Day Box */}
              <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-50 space-y-3 mt-4 mr-1">
                <div className="flex items-center gap-2 justify-start">
                  <div className="text-blue-600 bg-white p-2 rounded-xl shadow-sm shrink-0">
                    <Lightbulb size={18} />
                  </div>
                  <span className="text-sm font-black text-blue-600">نصيحة اليوم</span>
                </div>
                <p className="text-[11px] text-gray-400 font-bold leading-relaxed text-right">
                  "اضافة فيديوهات تعريفية قصيرة لكل دورة يزيد من معدلات التسجيل"
                </p>
              </div>

            </div>
          </div>

          {/* F. Promotional Carousel Banner Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative group min-h-[460px] flex flex-col justify-between p-6">
            
            {/* Header Block */}
            <div className="flex items-center justify-between w-full mb-2">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <GripHorizontal size={16} />
              </div>
              <h4 className="text-xs font-black text-gray-900 leading-tight text-right">
                هل تريد المزيد من المستخدمين على موقعك؟
              </h4>
            </div>

            {/* Illustration Mockup Image */}
            <div className="relative h-44 w-full my-4 flex items-center justify-center overflow-hidden rounded-xl border border-gray-50">
              <Image
                src="/assets/ima.png"
                alt="Promotional Banner"
                fill
                className="object-contain hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
            </div>

            {/* Active Slide Text Content */}
            <div className="space-y-2 text-right">
              <h4 className="text-sm font-black text-gray-900 leading-snug">
                {carouselSlides[carouselIndex].title}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold leading-relaxed min-h-[50px] line-clamp-3">
                {carouselSlides[carouselIndex].description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col xs:flex-row lg:flex-col xl:flex-row items-stretch xs:items-center lg:items-stretch xl:items-center gap-3 mt-4">
              <button className="flex-1 py-2.5 bg-white border border-blue-600 text-blue-600 rounded-xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-95 text-center">
                ابدأ الأن
              </button>
              <button className="text-orange-400 font-black text-xs hover:underline py-2 text-center whitespace-nowrap">
                لا، شكراً
              </button>
            </div>

            {/* Carousel Index Dots Indicator */}
            <div className="flex justify-center gap-1.5 mt-5">
              {carouselSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === carouselIndex ? 'bg-blue-600 w-3' : 'bg-gray-200'
                    }`}
                />
              ))}
            </div>

            {/* Side Edge Navigation Arrows */}
            <button 
              onClick={handlePrevSlide}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 border border-gray-100 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 hover:text-white text-gray-400 transition-all duration-200 z-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNextSlide}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 border border-gray-100 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 hover:text-white text-gray-400 transition-all duration-200 z-10"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

      </div>

      {/* Modals Hookup */}
      <SelectCourseTypeModal
        isOpen={isSelectTypeModalOpen}
        onClose={() => setIsSelectTypeModalOpen(false)}
      />
      
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onStudentAdded={fetchData}
      />
      
    </div>
  );
}
