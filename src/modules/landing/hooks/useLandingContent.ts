import { useState, useEffect } from 'react';
import { getCourse, getChaptersByCourse } from '@/services/courses';
import { getStudentCourse, getStudentChaptersByCourse } from '@/services/student-courses';
import {
  getLandingPageByCourseSlug,
  getStudentLandingPageByCourseSlug,
  getLandingPagesList,
  getStudentLandingPagesList
} from '../services/landing.api';
import { useLandingStore } from '../store/landingStore';
import { getTemplateDefaultContent } from '../constants/defaultContent';

const DEMO_COURSE_DATA = {
  id: "demo",
  title: "إتقان تصميم واجهات وتجربة المستخدم (UI/UX) - من الصفر للاحتراف",
  description: "البرنامج التدريبي الأقوى في الوطن العربي لبناء المنتجات الرقمية وتصميم الواجهات التفاعلية. ستتعلم التفكير التصميمي، أبحاث المستخدمين، رحلة العميل، هندسة المعلومات، والتحريك المتقدم باستخدام Figma مع بناء ملف أعمال حقيقي يجذب الشركات والعملاء.",
  instructor: {
    name: "م. إياد الموصلي",
    title: "خبير تصميم واجهات أقدم في Google سابقاً",
    bio: "مصمم منتجات رقمية بخبرة تزيد عن 10 سنوات، قام بتدريب أكثر من 15,000 طالب وطالبة في مجالات التصميم والبرمجة وريادة الأعمال.",
    profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  category: "تصميم واجهات",
  price: 299,
  price_before_discount: 899,
  original_price: 899,
  currency: "SAR",
  preview_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  image: "https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200",
  requirements: [
    "لا توجد متطلبات سابقة - سنبدأ معك من الصفر تماماً.",
    "جهاز حاسوب (Windows أو macOS) واتصال مستقر بالإنترنت.",
    "شغف حقيقي بالتعلم والتصميم والتطوير المستمر."
  ],
  chapters: [
    {
      id: 1,
      title: "الوحدة الأولى: أساسيات تجربة المستخدم (UX Foundation)",
      lessons: [
        { id: 101, title: "مقدمة عامة في عالم المنتجات الرقمية", duration: "10:45", isPreview: true },
        { id: 102, title: "الفرق الجوهري بين UI و UX والتصميم التقليدي", duration: "18:20", isPreview: true },
        { id: 103, title: "مراحل التفكير التصميمي (Design Thinking Process)", duration: "22:15" }
      ]
    },
    {
      id: 2,
      title: "الوحدة الثانية: أبحاث المستخدمين وهندسة المعلومات (Research & IA)",
      lessons: [
        { id: 201, title: "كيف تجري مقابلة مستخدمين ناجحة؟", duration: "15:40" },
        { id: 202, title: "بناء ملفات المستخدمين (User Personas)", duration: "12:10" },
        { id: 203, title: "تصميم خرائط التدفق (User Flow Diagrams)", duration: "25:30" }
      ]
    },
    {
      id: 3,
      title: "الوحدة الثالثة: واجهة المستخدم وأنظمة التصميم (UI & Design Systems)",
      lessons: [
        { id: 301, title: "مبادئ الجاذبية البصرية وتوزيع الكتل", duration: "14:20" },
        { id: 302, title: "الألوان والخطوط والتأثيرات النفسية", duration: "19:50" },
        { id: 303, title: "إنشاء مكتبة عناصر تفاعلية (Figma Components)", duration: "32:10" }
      ]
    }
  ]
};

export function useLandingContent(options: { courseId?: string | number; courseSlug?: string; landingPageId?: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const setCourseData = useLandingStore(state => state.setCourseData);
  const setLandingPageData = useLandingStore(state => state.setLandingPageData);
  const courseData = useLandingStore(state => state.courseData);
  const content = useLandingStore(state => state.content);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      try {
        if (options.courseId === 'demo' || options.landingPageId === 'demo') {
          const demoCourse = DEMO_COURSE_DATA;
          const targetTemplate = options.landingPageId && options.landingPageId !== 'demo' ? options.landingPageId : 'template_1';
          const demoContent = getTemplateDefaultContent(demoCourse, targetTemplate);
          setCourseData(demoCourse);
          setLandingPageData({
            id: 'demo',
            course_id: 'demo',
            template_name: targetTemplate,
            content: demoContent
          });
          setLoading(false);
          return;
        }
        let course: any = null;
        let landingPage: any = null;

        // Try to load custom landing page from localStorage first if a specific ID or parameter is present
        let targetLpId = options.landingPageId;
        if (!targetLpId && typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          targetLpId = urlParams.get('lp_id') || undefined;
        }

        if (targetLpId && typeof window !== 'undefined') {
          const stored = localStorage.getItem('darab_landing_pages');
          let found: any = null;
          if (stored) {
            const pages = JSON.parse(stored);
            found = pages.find((p: any) => String(p.id) === String(targetLpId));
          }

          if (!found) {
            try {
              const apiList = options.courseSlug
                ? await getStudentLandingPagesList()
                : await getLandingPagesList();
              localStorage.setItem('darab_landing_pages', JSON.stringify(apiList));
              found = apiList.find((p: any) => String(p.id) === String(targetLpId));
            } catch (e) {
              console.error('Failed to self-heal fetch landing page:', e);
            }
          }

          if (found) {
            landingPage = found;
            // Attempt to fetch real course + chapters, fallback to stored course data
            try {
              if (options.courseSlug) {
                course = await getStudentCourse(options.courseSlug);
                if (course) {
                  const chapters = await getStudentChaptersByCourse(course.id);
                  course.units = chapters.length > 0 ? chapters : (course.chapters || course.units || []);
                }
              } else {
                course = await getCourse(String(found.course_id));
                if (course) {
                  const chapters = await getChaptersByCourse(course.id);
                  course.units = chapters.length > 0 ? chapters : (course.chapters || course.units || []);
                }
              }
            } catch (e) {
              course = found.courseData;
            }
          }
        }

        if (!landingPage) {
          if (options.courseId) {
            // Academy Panel mode
            const courseIdStr = String(options.courseId);
            // Wait, if it's mock ID (e.g. non-numeric during page init), handle it gracefully
            try {
              course = await getCourse(courseIdStr);
              if (course) {
                // Fetch chapters separately from the dedicated endpoint
                const chapters = await getChaptersByCourse(course.id);
                course.units = chapters.length > 0 ? chapters : (course.chapters || course.units || []);
              }
            } catch (e) {
              console.error('Failed to get real course, using mock:', e);
              // Fallback mock course data for preview
              course = {
                id: Number(options.courseId),
                title: "إتقان تطوير واجهات المستخدم بالتصميم الذكي",
                description: "دورة شاملة لتعلم مبادئ التصميم، من البداية وحتى الاحتراف. ستتعلم كيفية بناء واجهات متجاوبة، أنظمة التصميم، وسيكولوجية المستخدم.",
                instructor: "م. أحمد السلمي",
                category: "تصميم",
                price: "599",
                final_price: "299",
                currency: "SAR",
                image: "https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200",
                units: [
                  {
                    id: 1,
                    title: "القسم الأول: مقدمة في عالم التصميم الرقمي",
                    lessons: [
                      { id: 101, title: "أهلاً بك في رحلة الإبداع", type: "video", duration: "05:20", isPreview: true },
                      { id: 102, title: "تثبيت الأدوات وتجهيز بيئة العمل", type: "video", duration: "12:45" }
                    ]
                  }
                ]
              };
            }

            if (course && course.slug) {
              landingPage = await getLandingPageByCourseSlug(course.slug, course.id);
            }
          } else if (options.courseSlug) {
            // Public Student view mode
            course = await getStudentCourse(options.courseSlug);
            if (course) {
              const chapters = await getStudentChaptersByCourse(course.id);
              course.units = chapters.length > 0 ? chapters : (course.chapters || course.units || []);
            }
            if (course && course.slug) {
              landingPage = await getStudentLandingPageByCourseSlug(course.slug, course.id);
            }
          }
        }

        if (course) {
          setCourseData(course);
          if (landingPage) {
            setLandingPageData(landingPage);
          }
        } else {
          setError('لم يتم العثور على الدورة');
        }
      } catch (err: any) {
        console.error('Failed to load landing page data:', err);
        setError(err.message || 'فشل تحميل بيانات صفحة الهبوط');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [options.courseId, options.courseSlug]);

  return { loading, error, courseData, content };
}
