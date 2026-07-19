import { useState, useEffect } from 'react';
import { getCourse } from '@/services/courses';
import { getStudentCourse } from '@/services/student-courses';
import { getLandingPageByCourseSlug, getStudentLandingPageByCourseSlug } from '../services/landing.api';
import { useLandingStore } from '../store/landingStore';

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
          if (stored) {
            const pages = JSON.parse(stored);
            const found = pages.find((p: any) => String(p.id) === String(targetLpId));
            if (found) {
              landingPage = found;
              // Attempt to fetch real course, fallback to stored course data
              try {
                course = await getCourse(String(found.course_id));
                if (course && course.chapters && !course.units) {
                  course.units = course.chapters;
                }
              } catch (e) {
                course = found.courseData;
              }
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
              if (course && course.chapters && !course.units) {
                course.units = course.chapters;
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
            if (course && course.chapters && !course.units) {
              course.units = course.chapters;
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
