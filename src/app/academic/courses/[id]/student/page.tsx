'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Play, FileText, CheckCircle2, Clock, Globe, Award,
  ChevronRight, Star, Users, Calendar,
  ChevronDown, ChevronUp, Download, ShieldCheck,
  Video, Monitor, DownloadCloud, Headset, Lock,
  Layout, MousePointer2, Smartphone, PenTool
} from 'lucide-react';
import { getCourse } from '@/services/courses';
import { Course, Unit } from '@/types/api';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import LandingRenderer from '@/modules/landing/renderer/LandingRenderer';

export default function CourseStudentViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template_1');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourse(id);
        if (data && data.slug) {
          router.replace(`/user/courses/${data.slug}`);
          return;
        }
        if ((data as any).chapters) {
          data.units = (data as any).chapters;
        }
        setCourse(data);
        if (data.units && data.units.length > 0) {
          setExpandedUnits([data.units[0].id]);
        }

        // Resolve course template
        let resolvedTemplate = 'template_1';
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`darab_course_template_${id}`);
          if (stored) {
            resolvedTemplate = stored;
          } else {
            const globalStored = localStorage.getItem('darab_active_template');
            if (globalStored) resolvedTemplate = globalStored;
          }
        }
        if (data.infos && Array.isArray(data.infos)) {
          const templateInfo = data.infos.find(
            (info: any) => (info.key === 'course_template' || info.info_key === 'course_template')
          );
          if (templateInfo) {
            resolvedTemplate = templateInfo.value || templateInfo.info_value || resolvedTemplate;
          }
        }
        setActiveTemplateId(resolvedTemplate);
      } catch (error) {
        console.warn('Course not found, showing mock data for preview:', error);
        const mockCourse: any = {
          id: Number(id),
          title: "إتقان تطوير واجهات المستخدم بالتصميم الذكي",
          description: "دورة شاملة لتعلم مبادئ التصميم، من البداية وحتى الاحتراف. ستتعلم كيفية بناء واجهات متجاوبة، أنظمة التصميم، وسيكولوجية المستخدم.",
          instructor: "م. أحمد السلمي",
          category: "تصميم",
          price: "599",
          final_price: "299",
          image: "https://images.unsplash.com/photo-1586717791821-3f44a563de4c?auto=format&fit=crop&q=80&w=1200",
          what_to_learn: "",
          units: [
            {
              id: 1,
              title: "القسم الأول: مقدمة في عالم التصميم الرقمي",
              lessons: [
                { id: 101, title: "أهلاً بك في رحلة الإبداع", type: "video", duration: "05:20", isPreview: true },
                { id: 102, title: "تثبيت الأدوات وتجهيز بيئة العمل", type: "video", duration: "12:45" }
              ]
            },
            { id: 2, title: "القسم الثاني: أسس تجربة المستخدم (UX)", isLocked: true, lessons: [] },
            { id: 3, title: "القسم الثالث: نظرية الألوان والخطوط", isLocked: true, lessons: [] }
          ]
        };
        setCourse(mockCourse);
        setExpandedUnits([1]);

        // Resolve course template
        let resolvedTemplate = 'template_1';
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`darab_course_template_${id}`);
          if (stored) {
            resolvedTemplate = stored;
          } else {
            const globalStored = localStorage.getItem('darab_active_template');
            if (globalStored) resolvedTemplate = globalStored;
          }
        }
        setActiveTemplateId(resolvedTemplate);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-900">جاري التحميل...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-900">لم يتم العثور على الدورة</div>;

  return (
    <LandingRenderer
      courseId={id}
      isEditable={false}
      onSubscribe={async () => { toast.success('هذه معاينة تجريبية فقط'); }}
      isSubscribing={false}
    />
  );
}
