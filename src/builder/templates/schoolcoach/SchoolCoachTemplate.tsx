'use client';

import React, { useState, useEffect } from 'react';
import { getSchoolCoachHtml } from './schoolcoachHtml';

export default function SchoolCoachTemplate() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Try published config
    const published = localStorage.getItem('darab_published_template_config');
    if (published) {
      try {
        const parsed = JSON.parse(published);
        if (parsed.role === 'schoolcoach' && parsed.content) {
          setContent(parsed.content);
          return;
        }
      } catch (e) {
        console.error('Failed to parse published template config:', e);
      }
    }

    // 2. Try draft config
    const draft = localStorage.getItem('darab_active_template_config_schoolcoach_template_1');
    if (draft) {
      try {
        setContent(JSON.parse(draft));
        return;
      } catch (e) {
        console.error('Failed to parse draft template config:', e);
      }
    }

    // 3. Fallback to default schoolcoach content
    setContent({
      navbar: { title: 'الأستاذ أحمد محمد', logo: '', bgColor: '#0a1628', textColor: '#ffffff' },
      hero: {
        title: 'تعلم بذكاء. <br/><span class="text-[var(--color-gold-500)]">اضمن تفوقك الدراسي.</span>',
        subtitle: 'معلم الرياضيات القدير',
        description: 'مناهج دراسية مبسطة وأساليب تعليمية حديثة تساعدك على فهم المادة بعمق وتحقيق الدرجة الكاملة في امتحاناتك.',
        buttonText: 'احجز مكانك الآن',
        buttonLink: '#',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdn5I4iyCWiaDe9m4F8v8n_X00tPqBgqXH4hbDxxtEpcQGhs3Iv7ye36iLKGCPaYsSeLuQ6Q56ZRbKBk10dy_efgKLS3zHuPJjJmYL6JtPlCiByhhruLtE_z5QnQirZ362M0sgpMps7B8icOJUUVS6t_6GJ1K0xma8arDq0yEal-eRoeAXPmexe9Vlvhif39sPxgQQGgyuqPwrz1R2REpb3TQmQAfrbC-2IMbqMBAUhDDImR-r8q5cEQ',
        backgroundColor: '#0a1628',
        textColor: '#ffffff'
      },
      about: {
        title: 'عن الأستاذ أحمد',
        subtitle: 'خبرة تزيد عن ١٠ سنوات في تدريس مناهج الرياضيات للمرحلة الثانوية. نعتمد على الفهم والتحليل وتدريب الطالب على أنماط الامتحانات المختلفة لضمان الثقة والتميز.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsvCKkFFgnTqd7h7Fw_WOHLv_-bXegAz36jnJ-dSBDWKiA81BP1TWumr1WnjULNWm_0CcbVBTge22QX2XN-cBPri3M3xbxSbAGqLIcFlI4XbbEacN9CKm1uRjQqkRnAfjumbe4cbh_txOhsTy_-6Eph6WwWNqlfr7j35tkwUU103Z7NEEpLCcfSvulZ4QoKpglkx4KRxtXU9TRhBm3eChxdvC43k04A-fnMk-IjFugUk9FdZ1nyfYQsA',
        backgroundColor: '#ffffff',
        textColor: '#1a1f29'
      },
      features: {
        title: 'المواد الدراسية',
        subtitle: 'شرح وافٍ وتطبيقات عملية لكل فرع من فروع الرياضيات لضمان الاستيعاب الشامل.',
        items: [
          {
            icon: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
            title: 'الرياضيات البحتة',
            description: 'الجبر، التفاضل والتكامل، وحساب المثلثات للمرحلة الثانوية.'
          },
          {
            icon: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop',
            title: 'الرياضيات التطبيقية',
            description: 'الاستاتيكا والديناميكا لفهم التطبيقات الفيزيائية للرياضيات.'
          },
          {
            icon: 'https://images.unsplash.com/photo-1453733190148-c44698c26588?w=800&auto=format&fit=crop',
            title: 'الإحصاء والاحتمالات',
            description: 'تحليل البيانات والاحتمالات وتطبيقاتها الحيوية.'
          },
          {
            icon: 'https://images.unsplash.com/photo-1635070040807-fbe0f3dbe005cb?w=800&auto=format&fit=crop',
            title: 'القدرات والتحصيلي',
            description: 'دورات مكثفة لاجتياز اختبارات القياس بكفاءة عالية.'
          }
        ],
        backgroundColor: '#eef0f3',
        textColor: '#1a1f29'
      },
      pricing: {
        title: 'المجموعات الدراسية المتاحة',
        subtitle: 'احجز مكانك في إحدى مجموعاتنا التفاعلية المباشرة.',
        items: [
          {
            title: 'مجموعة الصف الثالث الثانوي',
            price: 'متاحة للتسجيل',
            features: ['الأيام: الأحد والثلاثاء', 'الوقت: ٦:٠٠ مساءً', 'نوع الدراسة: أونلاين تفاعلي']
          },
          {
            title: 'مجموعة الصف الثاني الثانوي',
            price: 'متاحة للتسجيل',
            features: ['الأيام: الإثنين والأربعاء', 'الوقت: ٥:٠٠ مساءً', 'نوع الدراسة: حضور في المركز']
          },
          {
            title: 'مجموعة التحضير للقدرات',
            price: 'متاحة للتسجيل',
            features: ['الأيام: السبت فقط', 'الوقت: ١٠:٠٠ صباحاً', 'نوع الدراسة: أونلاين مسجل']
          }
        ],
        backgroundColor: '#ffffff',
        textColor: '#1a1f29'
      },
      faq: {
        title: 'الأسئلة الشائعة حول المنهج',
        items: [
          { question: 'أ.د. محمد الشمري - ولي أمر طالبتين', answer: 'الأستاذ أحمد يبسط الرياضيات بطريقة رائعة، ابنتي حصلت على الدرجة النهائية بفضله.' },
          { question: 'رنا عبدالله - طالبة طب هندسي', answer: 'التمارين والامتحانات المكثفة ساعدتني جداً في التحصيلي والقدرات.' },
          { question: 'م. علي عمر - طالب سابق', answer: 'تأسست في الرياضيات على يد الأستاذ أحمد، والآن أدرس هندسة البرمجيات بسهولة.' }
        ],
        backgroundColor: '#f7f8fa',
        textColor: '#1a1f29'
      },
      contact: {
        title: 'ابدأ رحلة تفوقك اليوم',
        description: 'انضم لأكثر من ١٠,٠٠٠ طالب وطالبة حققوا أحلامهم الدراسية معنا.',
        phoneNumber: '201000000000',
        buttonText: 'احجز مكانك الآن',
        backgroundColor: '#0a1628',
        textColor: '#ffffff'
      },
      footer: {
        text: '© ٢٠٢٦ الأستاذ أحمد محمد. جميع الحقوق محفوظة.',
        backgroundColor: '#0a1628',
        textColor: '#ffffff'
      }
    });
  }, []);

  if (!content) return null;

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        srcDoc={getSchoolCoachHtml(content)}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Teacher Template"
      />
    </div>
  );
}
