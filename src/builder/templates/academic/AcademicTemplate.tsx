'use client';

import React, { useState, useEffect } from 'react';
import { getAcademicHtml } from './academicHtml';

export default function AcademicTemplate() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Try published config
    const published = localStorage.getItem('darab_published_template_config');
    if (published) {
      try {
        const parsed = JSON.parse(published);
        if (parsed.role === 'academy' && parsed.content) {
          setContent(parsed.content);
          return;
        }
      } catch (e) {
        console.error('Failed to parse published template config:', e);
      }
    }

    // 2. Try draft config
    const draft = localStorage.getItem('darab_active_template_config_academy_template_1');
    if (draft) {
      try {
        setContent(JSON.parse(draft));
        return;
      } catch (e) {
        console.error('Failed to parse draft template config:', e);
      }
    }

    // 3. Fallback to default academic content
    setContent({
      navbar: { title: 'إديوكور', logo: '', bgColor: '#ffffff', textColor: '#3525cd' },
      hero: {
        title: 'بناء تجربة أكاديمية أكثر ذكاءً.',
        subtitle: 'حل مؤسسي متقدم',
        description: 'اربط الطلاب، والمعلمين، والإداريين على منصة مؤسسية موحدة مصممة لتحقيق التميز القابل للقياس وسير العمل المبسط بكفاءة عالية.',
        buttonText: 'استكشف المنصة',
        buttonLink: '#',
        image: 'https://tse4.mm.bing.net/th/id/OIP.CGEfBMBIYoz4Syk_3B8DawHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        backgroundColor: '#fcf8ff',
        textColor: '#1b1b24'
      },
      about: {
        title: 'تحليلات ذكية لاتخاذ قرارات أفضل',
        subtitle: 'راقب الأداء الأكاديمي، وحدد الاتجاهات، وقم بتحسين المخرجات التعليمية من خلال لوحات تحكم تحليلية متقدمة توفر رؤى في الوقت الفعلي.',
        image: '',
        backgroundColor: '#ffffff',
        textColor: '#1b1b24'
      },
      features: {
        title: 'نظام بيئي أكاديمي متكامل',
        subtitle: 'مجموعة شاملة ومتطورة من الأدوات لإدارة كل جانب من جوانب رحلة التعلم المؤسسية.',
        items: [
          { icon: 'groups', title: 'مركز الطلاب الشامل', description: 'تمكين المتعلمين بلوحات تحكم مخصصة، وتتبع دقيق للتقدم، وأدوات تواصل تعاونية سلسة لبيئة تعليمية محفزة.' },
          { icon: 'assignment_ind', title: 'بوابة المعلمين', description: 'تبسيط تخطيط الدروس، وإدارة الدرجات، وتعزيز تفاعل الطلاب بأدوات متقدمة.' },
          { icon: 'quiz', title: 'محرك التقييم', description: 'اختبارات آمنة وقابلة للتطوير مع تصحيح آلي وتحليلات أداء مفصلة ودقيقة.' },
          { icon: 'insights', title: 'المخرجات والنتائج', description: 'تقارير مؤسسية شاملة لتتبع الفعالية الأكاديمية وإتقان الطلاب للمهارات المطلوبة.' }
        ],
        backgroundColor: '#f5f2ff',
        textColor: '#1b1b24'
      },
      pricing: {
        title: 'المخرجات والنتائج الإحصائية',
        subtitle: 'معدلات تقدم وتحليلات رقمية للفصول الدراسية',
        items: [
          { title: 'طلاب نشطون', price: '12.4k', features: ['بوابات تفاعلية', 'تتبع التقدم'] },
          { title: 'دورات مدارة', price: '320', features: ['فصول مسجلة', 'محاضرات بث مباشر'] },
          { title: 'معدل الإنجاز', price: '87%', features: ['نسبة إتمام مرتفعة', 'التزام أكاديمي'] }
        ],
        backgroundColor: '#fcf8ff',
        textColor: '#1b1b24'
      },
      faq: {
        title: 'الأسئلة الشائعة حول إديوكور',
        items: [
          { question: 'هل الحصص البث المباشر مسجلة؟', answer: 'نعم، يتم تسجيل جميع اللقاءات المباشرة ورفعها للمنصة لتعيد مشاهدتها في أي وقت.' },
          { question: 'كيف يساهم إديوكور في تحسين الأداء الأكاديمي؟', answer: 'يوفر النظام تحليلات شاملة تمكن الإداريين والمعلمين من مراقبة التقدم واتخاذ قرارات فورية مدعومة بالبيانات.' }
        ],
        backgroundColor: '#f5f2ff',
        textColor: '#1b1b24'
      },
      contact: {
        title: 'ابْنِ مستقبل التعليم',
        description: 'انضم إلى المؤسسات الرائدة عالميًا في تحويل التجربة الأكاديمية. ارتقِ بمستوى مؤسستك التعليمية وابدأ رحلتك نحو التميز اليوم.',
        phoneNumber: '201000000000',
        buttonText: 'ابدأ الآن',
        backgroundColor: '#3525cd',
        textColor: '#ffffff'
      },
      footer: {
        text: '© 2024 إديوكور الأكاديمية. جميع الحقوق محفوظة.',
        backgroundColor: '#ffffff',
        textColor: '#1b1b24'
      }
    });
  }, []);

  if (!content) return null;

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        srcDoc={getAcademicHtml(content)}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Academic Template"
      />
    </div>
  );
}
