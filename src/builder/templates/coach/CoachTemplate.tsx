'use client';

import React, { useState, useEffect } from 'react';
import { getCoachHtml } from './coachHtml';

export default function CoachTemplate() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Try published config
    const published = localStorage.getItem('darab_published_template_config');
    if (published) {
      try {
        const parsed = JSON.parse(published);
        if (parsed.role === 'coach' && parsed.content) {
          setContent(parsed.content);
          return;
        }
      } catch (e) {
        console.error('Failed to parse published template config:', e);
      }
    }

    // 2. Try draft config
    const draft = localStorage.getItem('darab_active_template_config_coach_template_1');
    if (draft) {
      try {
        setContent(JSON.parse(draft));
        return;
      } catch (e) {
        console.error('Failed to parse draft template config:', e);
      }
    }

    // 3. Fallback to default coach content
    setContent({
      navbar: { title: 'Deep Knowledge', logo: '', bgColor: '#fbfafc', textColor: '#6750a4' },
      hero: {
        title: 'تعمج في المعرفة. <br/> تعلم من الصفوة.',
        subtitle: 'أكاديمية النخبة',
        description: 'مساحة حصرية مصممة للمفكرين والقادة. استكشف مناهج متقدمة وتواصل مع خبراء عالميين في بيئة دراسية مصممة للتركيز العميق والتميز الأكاديمي.',
        buttonText: 'ابدأ رحلتك',
        buttonLink: '#',
        image: '',
        backgroundColor: '#fbfafc',
        textColor: '#1c1a22'
      },
      about: {
        title: 'المرشدون الخبراء',
        subtitle: 'نخبة من الأكاديميين والباحثين يرافقونك في رحلتك المعرفية.',
        image: '',
        backgroundColor: '#ffffff',
        textColor: '#1c1a22'
      },
      features: {
        title: 'المرشدون الخبراء',
        subtitle: 'نخبة من الأكاديميين والباحثين يرافقونك في رحلتك المعرفية.',
        items: [
          {
            icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6JzKcQHDDohUQuzB8PNfXLDbsl7kf35bgCuG0sQW1h8cNdtvfatA7YI3HqNz6hiRLYcE6oU_P8qcDQyq1S4EDQdGdl3PraTpby8mme9L-kHXgx0kdcdb_pfIEdse9RcYvfBa3_gBCg2QIPqKv9LzEDqHVC0s2nGHMpRBNZve1OBkEhV00ehX4zl5HDvssuq8qkK-Yh14G6Udjd1e6e9VB3D5sX_35J7UvItIiInMbSaBA3ALb7g58eg',
            title: 'د. طارق الحكيم - أستاذ الفلسفة المتقدمة',
            description: 'خبير عالمي في الفلسفة التحليلية والمنطق الرياضي. يقدم رؤى معمقة تتحدى التفكير التقليدي وتبني أسساً معرفية متينة.'
          },
          {
            icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdn5I4iyCWiaDe9m4F8v8n_X00tPqBgqXH4hbDxxtEpcQGhs3Iv7ye36iLKGCPaYsSeLuQ6Q56ZRbKBk10dy_efgKLS3zHuPJjJmYL6JtPlCiByhhruLtE_z5QnQirZ362M0sgpMps7B8icOJUUVS6t_6GJ1K0xma8arDq0yEal-eRoeAXPmexe9Vlvhif39sPxgQQGgyuqPwrz1R2REpb3TQmQAfrbC-2IMbqMBAUhDDImR-r8q5cEQ',
            title: 'د. ليلى المنصور - باحثة في الذكاء المعرفي',
            description: 'رائدة في تقاطع علوم الحاسوب وعلم الأعصاب. تركز أبحاثها على محاكاة الإدراك البشري وتطوير خوارزميات التعلم العميق.'
          },
          {
            icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsvCKkFFgnTqd7h7Fw_WOHLv_-bXegAz36jnJ-dSBDWKiA81BP1TWumr1WnjULNWm_0CcbVBTge22QX2XN-cBPri3M3xbxSbAGqLIcFlI4XbbEacN9CKm1uRjQqkRnAfjumbe4cbh_txOhsTy_-6Eph6WwWNqlfr7j35tkwUU103Z7NEEpLCcfSvulZ4QoKpglkx4KRxtXU9TRhBm3eChxdvC43k04A-fnMk-IjFugUk9FdZ1nyfYQsA',
            title: 'البروفيسور عمر زيدان - خبير الاقتصاد الكلي',
            description: 'مستشار استراتيجي دولي. يحلل الأنظمة الاقتصادية المعقدة ويقدم استراتيجيات تنبؤية للأسواق العالمية الناشئة.'
          }
        ],
        backgroundColor: '#fbfafc',
        textColor: '#1c1a22'
      },
      pricing: {
        title: 'سلسلة الماستركلاس',
        subtitle: 'محاضرات مكثفة مسجلة بأعلى جودة سينمائية.',
        items: [
          {
            title: 'بنية التفكير الاستراتيجي',
            price: 'الحلقة 1',
            features: ['45 دقيقة', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXpJX3q5uXYRCJ0P26aOiHCO6ssai534WXEH0acZCxxJWwAnux91BzP3cVQ-I09Yp_BnJZkboDuI3HhAYQROL-qkAZHMuhuMkclUAG-iB_eMV9KhTwCOLORHsHaWcy9cV25oZBqek1WcyH-K5R9Y718rEX4UUTfbLh5s77ovJzp3pdBAXWt2iJtJ7CIN8dP45tCVIqTuiZ_f4GpC49lyi0XC3oxtV9sBrBy2oxubJ8LNQY_adythzF8g']
          },
          {
            title: 'تحليل الأنظمة المعقدة',
            price: 'الحلقة 2',
            features: ['52 دقيقة', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRQTwjFjHqFPLwD4Ia1wHj8tW3Aj0xcQvOR1DdS8lD0jwvVo4Z8mOsjlKrP3zjMBswfUBWkhBM7T1CXK0oMbhlSEYqRFRZrp_4NhP1Zy9u-pnmyE39rj7yU6Fb2ozxaVqoJWdESCHFLQXXywsipGmx4tDJoL-L9l7NFt-LiKT6Dq2A0wbgL4tV4fNVKNjmKmQk8WBlM30SKcRVu-bBJ4ulrQXnxK0_AFMOWOKxv3zOn3pnp0S1N-d-wA']
          }
        ],
        backgroundColor: '#ffffff',
        textColor: '#1c1a22'
      },
      faq: {
        title: 'مسارات المناهج المتقدمة',
        items: [
          { question: 'الأسس المعرفية', answer: 'المستوى الأول' },
          { question: 'المنطق التحليلي', answer: 'التفكير النقدي المتقدم' },
          { question: 'فلسفة العلوم', answer: 'الابستيمولوجيا التطبيقية' }
        ],
        backgroundColor: '#fbfafc',
        textColor: '#1c1a22'
      },
      contact: {
        title: 'Deep Knowledge',
        description: 'أكاديمية النخبة للتعليم العالي المستقل. نبني قادة الفكر للمستقبل من خلال مناهج صارمة وعميقة.',
        phoneNumber: '',
        buttonText: '',
        backgroundColor: '#6750a4',
        textColor: '#ffffff'
      },
      footer: {
        text: '© 2024 Deep Knowledge Academy. All rights reserved.',
        backgroundColor: '#fbfafc',
        textColor: '#1c1a22'
      }
    });
  }, []);

  if (!content) return null;

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        srcDoc={getCoachHtml(content)}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Coach Template"
      />
    </div>
  );
}
