'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Users, 
  Globe, 
  Linkedin, 
  Twitter, 
  BookOpen, 
  Award, 
  Star, 
  School, 
  ShieldCheck, 
  Heart, 
  ShoppingCart, 
  MessageSquare, 
  Edit3, 
  Save, 
  X,
  Plus,
  Trash2,
  Bookmark
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Course {
  id: number;
  title: string;
  price: string;
  rating: string;
  students: string;
  tag?: string;
  tagBg?: string;
  tagText?: string;
  imageUrl: string;
}

interface ProfileData {
  name: string;
  title: string;
  location: string;
  studentsCount: string;
  bioParagraph1: string;
  bioParagraph2: string;
  degree: string;
  certificate: string;
  avatarUrl: string;
  coverUrl: string;
  linkedin: string;
  twitter: string;
  website: string;
  stats: {
    courses: string;
    experience: string;
    rating: string;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
    avatarUrl: string;
  };
  courses: Course[];
}

interface DashboardProfileProps {
  role: 'academy' | 'teacher';
}

const DEFAULT_ACADEMY_PROFILE: ProfileData = {
  name: "أكاديمية درب الرقمية",
  title: "المنصة الرائدة لتعليم الإدارة، القيادة، والتحول الرقمي في الشرق الأوسط",
  location: "الرياض، المملكة العربية السعودية",
  studentsCount: "+45,000 طالب وطالبة",
  bioParagraph1: "تأسست أكاديمية درب لتمكين الأفراد والمؤسسات من النجاح في الاقتصاد الرقمي الحديث. نحن نجمع بين المناهج الأكاديمية العميقة والخبرات العملية الحقيقية لنقدم تجربة تعليمية فريدة وتطبيقية.",
  bioParagraph2: "شركاؤنا هم نخبة من كبرى الشركات والمؤسسات الحكومية في المنطقة. نهدف إلى سد الفجوة المهارية وبناء جيل جديد من القادة والمبتكرين في العالم العربي.",
  degree: "اعتمادات دولية من كبرى معاهد التكنولوجيا والإدارة",
  certificate: "مركز تدريب رقمي مرخص ومعتمد إقليمياً وعالمياً",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM",
  coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJaarzdUdatddupC-Car8sLGMlsoCGMu746IHi3QCutv4sFUix5gq9L2IRD4GL54JOa5IkrpDTu9qB3y_sthhJWAlnKee_XZS9vb_84lCTldItK-vBbrhlX8HfKgZPrzGv1klkqPQ7pb8ZVCTbn7dwdv_rWq8EFF46EMzQr9htoSdNFZNNvfS_aYO5CeFYWGhoYbUdxIDy63nipZ5e2vktOdPjNh-FlhRPoBUwXsc1nE2lfke5RXmiQsHp6Zg8DVEwfTPMfrx8Ae4",
  linkedin: "linkedin.com/company/darab",
  twitter: "@darab_edu",
  website: "darab.academy",
  stats: {
    courses: "48+",
    experience: "8",
    rating: "4.8/5"
  },
  testimonial: {
    quote: "الشراكة مع أكاديمية درب غيرت مجرى التدريب الداخلي لدينا تماماً. المحتوى متميز، مرن، وملائم جداً لواقع السوق المحلية.",
    author: "أ. عبد الرحمن السبيعي",
    role: "رئيس قسم التنمية البشرية - الاتصالات السعودية STC",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI"
  },
  courses: [
    {
      id: 1,
      title: "ماجستير إدارة الأعمال التنفيذي المصغر",
      price: "1,200 ر.س",
      rating: "4.9 (2.4k)",
      students: "6,500 طالب",
      tag: "برنامج مكثف",
      tagBg: "bg-amber-100",
      tagText: "text-amber-800",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4iH4QN5hawBNBS5h9s9nS1TEOla1eY5JJBqQOqqjhAcuOlHHEGvnQUIHaXpvbQX9suHmsGlgv0xfg0Us7GtGZPQZLjNjAsSb3srLVJGGI4JhTw1Ox5L1yvBbvfJnp2IzBFGjUi-SISVcwTm1m9E2wpeb0s33mi9i-k6-PXWT7bxjjJfB8-tokQtf0u5nDOyc2UDANLG2c6UALdgFPTLJ5HDo34MDxx0k5foN_8S6R-2hJhXdyF5sEUPHIXe8KarPgOvzf7Tg2VLI"
    },
    {
      id: 2,
      title: "الحوكمة الرقمية والأمن السيبراني للمدراء ورؤساء الأقسام",
      price: "850 ر.س",
      rating: "4.8 (950)",
      students: "2,100 طالب",
      tag: "الأعلى طلباً",
      tagBg: "bg-blue-100",
      tagText: "text-blue-800",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9KcwP0hcNTjqTsP9-zEoZDcp7ymS0jNj6ob0RwCIdKZ108wU5GjjnHQ0Ji6KDK0ow73ll6wBAdPJRnFpak6zMSPeZ4oAs50vCNlTZKzFA-09Anx2ZOEFVdcumpmAMBHwpacUtUq3v8BNDiO8uMUSw84-4TcE5wdXfhHaOF0A9vgFNdp5-eoQ3H2QBP0nj_d2E4mHbznhcP-MK1K3iSrqNQPbcQChXz_3auUIfp_d-OYnMw6Hv-Uca0MdxRgbltFjrZV6VFE9-guA"
    }
  ]
};

const DEFAULT_TEACHER_PROFILE: ProfileData = {
  name: "د. أحمد المنصور",
  title: "خبير في التحول الرقمي ومحاضر معتمد في استراتيجيات الأعمال",
  location: "الرياض، المملكة العربية السعودية",
  studentsCount: "+15,000 طالب",
  bioParagraph1: "كرست أكثر من 15 عاماً من مسيرتي المهنية في استكشاف آفاق التحول الرقمي وتطوير نماذج الأعمال الابتكارية. كمدرب ومستشار، أؤمن بأن التعليم ليس مجرد نقل للمعلومات، بل هو رحلة تحويلية تبدأ من الفهم العميق وتمر بالتطبيق العملي.",
  bioParagraph2: "قمت بتدريب آلاف المحترفين في كبرى المؤسسات الحكومية والخاصة، مع التركيز على سد الفجوة بين التقنيات الحديثة واحتياجات السوق المحلية في المنطقة العربية.",
  degree: "دكتوراه في إدارة الأعمال الرقمية",
  certificate: "مدرب معتمد من معهد الابتكار العالمي",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqzo_VQo06VQCFdzirf_0z2ioWmpWofFyxtbeUSOpgDZrefJDg9H6UA9iCfqy4ro7yg5FfYec1hNWpAg3PRosaeLX6QWVUEzwo9ublQriYxfSfNDlWA1uW1O6hw0le5xYhMv7XPFhD6yd7QpDnU9K5cZxFvPxYlfNukbtioKQZrrRJZFrM7nRQG0i4Kox8vCBDr8AVXDoZiEZCpnzjCCNjg_6oXBTMLW_BrGX4m-hb12D3_A2ef40AdQp3X9xGODqnl-ASu_rn0GM",
  coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJaarzdUdatddupC-Car8sLGMlsoCGMu746IHi3QCutv4sFUix5gq9L2IRD4GL54JOa5IkrpDTu9qB3y_sthhJWAlnKee_XZS9vb_84lCTldItK-vBbrhlX8HfKgZPrzGv1klkqPQ7pb8ZVCTbn7dwdv_rWq8EFF46EMzQr9htoSdNFZNNvfS_aYO5CeFYWGhoYbUdxIDy63nipZ5e2vktOdPjNh-FlhRPoBUwXsc1nE2lfke5RXmiQsHp6Zg8DVEwfTPMfrx8Ae4",
  linkedin: "linkedin.com/in/almansour",
  twitter: "@drahmed_digital",
  website: "almansour.edu.sa",
  stats: {
    courses: "24+",
    experience: "15",
    rating: "4.9/5"
  },
  testimonial: {
    quote: "الدكتور أحمد يمتلك قدرة نادرة على تبسيط أعقد المفاهيم التقنية وربطها بالواقع العملي. دورته في التحول الرقمي كانت نقطة تحول حقيقية في مساري المهني.",
    author: "م. خالد العتيبي",
    role: "مدير إدارة التقنية - سابك",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDapuZMqMbglOubBSplHYKHbUUEPOVBNZfPBYfEdrnbwVoJA6p_fXveTFrcYVKfSEKsCZOzcikKHpuWVQRu4n8xxKYXhgM_nanjOQ0cdv-kXhVbMcOq5kzHgm5DH5WlDzYGmDh0ROSe4C_qATsLJhy-iZA4oKXn9HQImP6_0u46v5kDYayBS8_wDmyGvixd7EoZGbUePlgROCvJVAy1-l6nThq3n3XvQJDoOFPy76n8F28rsKmL09nMbF_TcgXK5YffQFE2uS-uFwI"
  },
  courses: [
    {
      id: 1,
      title: "أساسيات التحول الرقمي للمؤسسات",
      price: "499 ر.س",
      rating: "4.9 (1.2k)",
      students: "3,450 طالب",
      tag: "الأكثر مبيعاً",
      tagBg: "bg-amber-100",
      tagText: "text-amber-800",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4iH4QN5hawBNBS5h9s9nS1TEOla1eY5JJBqQOqqjhAcuOlHHEGvnQUIHaXpvbQX9suHmsGlgv0xfg0Us7GtGZPQZLjNjAsSb3srLVJGGI4JhTw1Ox5L1yvBbvfJnp2IzBFGjUi-SISVcwTm1m9E2wpeb0s33mi9i-k6-PXWT7bxjjJfB8-tokQtf0u5nDOyc2UDANLG2c6UALdgFPTLJ5HDo34MDxx0k5foN_8S6R-2hJhXdyF5sEUPHIXe8KarPgOvzf7Tg2VLI"
    },
    {
      id: 2,
      title: "تحليل البيانات واتخاذ القرار الاستراتيجي",
      price: "650 ر.س",
      rating: "4.8 (850)",
      students: "1,200 طالب",
      tag: "مسار متقدم",
      tagBg: "bg-blue-100",
      tagText: "text-blue-800",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9KcwP0hcNTjqTsP9-zEoZDcp7ymS0jNj6ob0RwCIdKZ108wU5GjjnHQ0Ji6KDK0ow73ll6wBAdPJRnFpak6zMSPeZ4oAs50vCNlTZKzFA-09Anx2ZOEFVdcumpmAMBHwpacUtUq3v8BNDiO8uMUSw84-4TcE5wdXfhHaOF0A9vgFNdp5-eoQ3H2QBP0nj_d2E4mHbznhcP-MK1K3iSrqNQPbcQChXz_3auUIfp_d-OYnMw6Hv-Uca0MdxRgbltFjrZV6VFE9-guA"
    },
    {
      id: 3,
      title: "قيادة الفرق في العصر الرقمي",
      price: "399 ر.س",
      rating: "4.9 (420)",
      students: "890 طالب",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtqpBVFtjEqV4PVoWYoyU8fcNsGZBndlgPIbkTUs2JhnbX94-veF8_k8_HudB9diVBtjprCKzLuuiObyibFF6J9QbaMi1GcDswO0I4W3wlUhbXjD_j1nPDgegx4guIeTcmiF9PHyt3yU3B-zTYYixNNb5rzSTyXu_dNsQybxKmntcB87QhR6ICgCXRlHXPPaV2v4GrYnnz6NmYa8CQCbDOZw82qqN70CS7UckmVyBWvUnicK0nzC2SZsnW_QwGRn3db9X6vbI-6DE"
    },
    {
      id: 4,
      title: "استراتيجيات الابتكار وتطوير المنتجات",
      price: "550 ر.س",
      rating: "4.7 (310)",
      students: "670 طالب",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7fji1EMzpBjvIOPzTzKZXMfFMs_z3kV26cI_u4VZySsAciXaJgM3Az6NM1Dv4arh-Prux6XN7GqdYRv9_L_BhcETvxgmkH2Kp9mMzgjM20WJE7jHDI92KCOYa6xe-XZwTN0tfSlUKxH_y6pOE1twvM7NsZtmAJ7xCG0dMyz3ptUE3dE9DxwvuOp1VEeL-6bnYlbgE1DBMdUmQEwlcdIE5qzhXXvAcf--sm_qb604Y61GeGM2PWxgDVqcnyY_7mFtiZsqC_a593Nc"
    }
  ]
};

export default function DashboardProfile({ role }: DashboardProfileProps) {
  const [profile, setProfile] = useState<ProfileData>(
    role === 'academy' ? DEFAULT_ACADEMY_PROFILE : DEFAULT_TEACHER_PROFILE
  );
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Load from local storage if exists
  useEffect(() => {
    const key = `darab_profile_${role}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored profile", e);
      }
    } else {
      // Check if general user info exists
      const storedUserInfo = localStorage.getItem('user_info');
      if (storedUserInfo) {
        try {
          const uInfo = JSON.parse(storedUserInfo);
          setProfile(prev => ({
            ...prev,
            name: uInfo.name || prev.name,
            location: uInfo.location || prev.location || "المملكة العربية السعودية"
          }));
        } catch (e) {}
      }
    }
  }, [role]);

  // Sync edits
  const handleStartEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    const key = `darab_profile_${role}`;
    localStorage.setItem(key, JSON.stringify(editedProfile));
    setProfile(editedProfile);
    setIsEditing(false);
    toast.success('تم حفظ التعديلات بنجاح!', {
      style: {
        fontFamily: 'IBM Plex Sans Arabic',
        fontWeight: 'bold',
        direction: 'rtl'
      }
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success('تم الاشتراك بنجاح في النشرة المعرفية!', {
      style: {
        fontFamily: 'IBM Plex Sans Arabic',
        fontWeight: 'bold',
        direction: 'rtl'
      }
    });
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-8 animate-slide-up-fade" dir="rtl">
      
      {/* Top Banner and Profile Header Card */}
      <section className="relative">
        {/* Cover Photo */}
        <div className="h-48 md:h-72 w-full rounded-t-3xl overflow-hidden bg-slate-200 relative group">
          <img 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            alt="Cover background"
            src={profile.coverUrl}
          />
          <div className="absolute inset-0 bg-black/15"></div>
        </div>

        {/* Profile Info Overlay Card */}
        <div className="bg-white rounded-b-3xl px-6 md:px-8 pb-8 shadow-[0_12px_40px_rgba(25,28,29,0.03)] relative border-x border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-end -mt-16 md:-mt-24">
            
            {/* Avatar Container */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white overflow-hidden shadow-lg bg-slate-100">
                <img 
                  className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-300" 
                  alt={profile.name}
                  src={profile.avatarUrl}
                />
              </div>
              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-[#005c86] rounded-full p-1.5 shadow-md border-2 border-white">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-right pb-2 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800">{profile.name}</h1>
                <span className="self-center bg-[#c9e6ff] text-[#005c86] px-3 py-1 rounded-full text-xs font-bold">
                  {role === 'academy' ? 'جهة معتمدة' : 'مدرب معتمد'}
                </span>
              </div>
              <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">{profile.title}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-5 mt-4 text-slate-400 text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1.5 text-[#005c86] font-bold">
                  <Users className="w-4 h-4" />
                  {profile.studentsCount}
                </span>
              </div>
            </div>

            {/* Edit / Follow Action Buttons */}
            <div className="flex gap-3 pb-2 w-full md:w-auto justify-center">
              <button 
                onClick={handleStartEdit}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-[#005c86] text-[#005c86] font-bold hover:bg-[#c9e6ff]/30 active:scale-95 transition-all text-sm shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                <span>تعديل الملف</span>
              </button>
              <button 
                onClick={() => toast.success('تم نسخ رابط الصفحة الشخصية بنجاح')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#005c86] to-[#0e76a8] text-white font-bold hover:shadow-lg hover:shadow-[#005c86]/10 active:scale-95 transition-all text-sm"
              >
                مشاركة الرابط
              </button>
            </div>

          </div>

          {/* Social Links Panel */}
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-slate-100 justify-center md:justify-start">
            {profile.linkedin && (
              <a 
                href={`https://${profile.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-[#005c86] transition-all text-xs font-semibold"
              >
                <Linkedin className="w-4 h-4 text-[#0077b5]" />
                <span>{profile.linkedin}</span>
              </a>
            )}
            {profile.twitter && (
              <a 
                href={`https://twitter.com/${profile.twitter.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-[#005c86] transition-all text-xs font-semibold"
              >
                <Twitter className="w-4 h-4 text-[#1da1f2]" />
                <span>{profile.twitter}</span>
              </a>
            )}
            {profile.website && (
              <a 
                href={`https://${profile.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-[#005c86] transition-all text-xs font-semibold"
              >
                <Globe className="w-4 h-4 text-[#005c86]" />
                <span>{profile.website}</span>
              </a>
            )}
          </div>

        </div>
      </section>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Details (Right Column - 2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-50">
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-7 bg-[#005c86] rounded-full"></span>
              {role === 'academy' ? 'عن الأكاديمية' : 'حول المحاضر'}
            </h2>
            <div className="prose prose-slate max-w-none text-slate-500 leading-relaxed font-medium space-y-4">
              <p>{profile.bioParagraph1}</p>
              <p>{profile.bioParagraph2}</p>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 list-none p-0">
                {profile.degree && (
                  <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-[#c9e6ff] flex items-center justify-center text-[#005c86] shrink-0">
                      <School className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 leading-snug">{profile.degree}</span>
                  </li>
                )}
                {profile.certificate && (
                  <li className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-[#c9e6ff] flex items-center justify-center text-[#005c86] shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 leading-snug">{profile.certificate}</span>
                  </li>
                )}
              </ul>
            </div>
          </section>

          {/* Featured Courses */}
          <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="w-1.5 h-7 bg-[#005c86] rounded-full"></span>
                الدورات المميزة
              </h2>
              <button 
                onClick={() => toast.success('تمت إعادة توجيهك لصفحة إدارة الدورات')}
                className="text-sm font-bold text-[#005c86] hover:underline"
              >
                عرض الكل
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.courses.map((course) => (
                <div 
                  key={course.id} 
                  className="bg-white rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-100 hover:-translate-y-1.5 transition-transform duration-300 flex flex-col group"
                >
                  <div className="h-44 overflow-hidden relative bg-slate-200 shrink-0">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      src={course.imageUrl} 
                      alt={course.title}
                    />
                    {course.tag && (
                      <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${course.tagBg || 'bg-amber-100'} ${course.tagText || 'text-amber-800'}`}>
                        {course.tag}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-[17px] font-black text-slate-800 line-clamp-2 leading-relaxed">{course.title}</h3>
                      <div className="flex items-center gap-4 text-slate-400 text-xs font-medium mt-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          {course.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.students}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xl font-black text-[#005c86]">{course.price}</span>
                      <button 
                        onClick={() => toast.success('تمت إضافة الدورة لسلة التسوق')}
                        className="bg-slate-50 hover:bg-[#005c86] hover:text-white p-2.5 rounded-xl text-[#005c86] transition-colors shadow-sm"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Widgets (Left Column - 1/3 width) */}
        <aside className="space-y-8 lg:col-span-1">
          
          {/* Achievements Metrics Panel */}
          <div className="bg-[#005c86] text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden group">
            {/* Background absolute decor */}
            <div className="absolute -right-20 -bottom-20 w-44 h-44 rounded-full bg-white/5 opacity-10 group-hover:scale-125 transition-transform duration-500" />
            
            <h3 className="text-lg font-bold mb-6 opacity-90">إنجازات بالأرقام</h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-[#c9e6ff]" />
                </div>
                <div>
                  <p className="text-2xl font-black">{profile.stats.courses}</p>
                  <p className="text-xs opacity-75 font-semibold">دورة تدريبية معتمدة</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Award className="w-6 h-6 text-[#c9e6ff]" />
                </div>
                <div>
                  <p className="text-2xl font-black">{profile.stats.experience} سنة</p>
                  <p className="text-xs opacity-75 font-semibold">من العطاء المهني والتدريب</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Star className="w-6 h-6 text-[#c9e6ff]" />
                </div>
                <div>
                  <p className="text-2xl font-black">{profile.stats.rating}</p>
                  <p className="text-xs opacity-75 font-semibold">تقييم الطلاب العام</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => toast.success('رابط حجز موعد الاستشارات غير مهيأ بعد')}
              className="w-full mt-8 bg-white text-[#005c86] hover:bg-slate-50 py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-97 transition-all"
            >
              احجز استشارة خاصة
            </button>
          </div>

          {/* Testimonial Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-slate-100 flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-5xl text-[#c9e6ff] font-serif leading-none">“</span>
              <Bookmark className="w-5 h-5 text-[#005c86]/20" />
            </div>
            <p className="text-slate-500 italic text-sm leading-relaxed">
              {profile.testimonial.quote}
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                <img className="w-full h-full object-cover" src={profile.testimonial.avatarUrl} alt={profile.testimonial.author} />
              </div>
              <div className="leading-normal">
                <p className="font-bold text-slate-800 text-sm">{profile.testimonial.author}</p>
                <p className="text-xs text-slate-400 font-medium">{profile.testimonial.role}</p>
              </div>
            </div>
          </div>

          {/* Newsletter subscription widget */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">النشرة المعرفية</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">اشترك معنا ليصلك آخر المستجدات والمقالات الحصرية.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input 
                type="email" 
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="البريد الإلكتروني" 
                className="w-full bg-white border border-slate-200 rounded-xl text-sm p-3 focus:outline-none focus:ring-2 focus:ring-[#005c86]/20 transition-all font-medium text-slate-700"
              />
              <button 
                type="submit" 
                className="w-full bg-[#005c86] hover:bg-[#0e76a8] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-97"
              >
                اشترك الآن
              </button>
            </form>
          </div>

        </aside>
      </div>

      {/* Profile Edit Overlay Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
          
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto z-10 border border-slate-100 flex flex-col scrollbar-hide">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-[#005c86]" />
                <h3 className="text-lg font-black text-slate-800">تعديل ملفك الشخصي</h3>
              </div>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6 flex-1">
              
              {/* Profile Details Tab */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 border-b border-slate-50 pb-2 text-sm">البيانات الأساسية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">الاسم</label>
                    <input 
                      type="text" 
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">الموقع الجغرافي</label>
                    <input 
                      type="text" 
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">الوصف التعريفي القصير</label>
                  <input 
                    type="text" 
                    value={editedProfile.title}
                    onChange={(e) => setEditedProfile({...editedProfile, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none"
                  />
                </div>
              </div>

              {/* Bio and Info */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 border-b border-slate-50 pb-2 text-sm">القصة والخبرات</h4>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">الفقرة التعريفية الأولى</label>
                  <textarea 
                    rows={3}
                    value={editedProfile.bioParagraph1}
                    onChange={(e) => setEditedProfile({...editedProfile, bioParagraph1: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">الفقرة التعريفية الثانية</label>
                  <textarea 
                    rows={3}
                    value={editedProfile.bioParagraph2}
                    onChange={(e) => setEditedProfile({...editedProfile, bioParagraph2: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">الدرجة العلمية / المؤهل الأول</label>
                    <input 
                      type="text" 
                      value={editedProfile.degree}
                      onChange={(e) => setEditedProfile({...editedProfile, degree: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">الاعتماد / الشهادة الثانية</label>
                    <input 
                      type="text" 
                      value={editedProfile.certificate}
                      onChange={(e) => setEditedProfile({...editedProfile, certificate: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Statistics Panel */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 border-b border-slate-50 pb-2 text-sm">أرقام وإنجازات</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">الدورات</label>
                    <input 
                      type="text" 
                      value={editedProfile.stats.courses}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile, 
                        stats: { ...editedProfile.stats, courses: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">سنوات الخبرة</label>
                    <input 
                      type="text" 
                      value={editedProfile.stats.experience}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile, 
                        stats: { ...editedProfile.stats, experience: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">التقييم العام</label>
                    <input 
                      type="text" 
                      value={editedProfile.stats.rating}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile, 
                        stats: { ...editedProfile.stats, rating: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Images tab */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 border-b border-slate-50 pb-2 text-sm">الصور والخلفيات</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">رابط صورة الغلاف</label>
                    <input 
                      type="text" 
                      value={editedProfile.coverUrl}
                      onChange={(e) => setEditedProfile({...editedProfile, coverUrl: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-400 focus:text-slate-700 outline-none text-left"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">رابط الصورة الشخصية (شعار أو فوتو)</label>
                    <input 
                      type="text" 
                      value={editedProfile.avatarUrl}
                      onChange={(e) => setEditedProfile({...editedProfile, avatarUrl: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-400 focus:text-slate-700 outline-none text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Link Config */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 border-b border-slate-50 pb-2 text-sm">روابط الاتصال والتواصل الاجتماعي</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">رابط LinkedIn</label>
                    <input 
                      type="text" 
                      value={editedProfile.linkedin}
                      onChange={(e) => setEditedProfile({...editedProfile, linkedin: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none text-left"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">حساب Twitter / X</label>
                    <input 
                      type="text" 
                      value={editedProfile.twitter}
                      onChange={(e) => setEditedProfile({...editedProfile, twitter: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none text-left"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">الموقع الإلكتروني</label>
                    <input 
                      type="text" 
                      value={editedProfile.website}
                      onChange={(e) => setEditedProfile({...editedProfile, website: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#005c86]/20 focus:bg-white transition-all font-medium text-slate-700 outline-none text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end rounded-b-3xl">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-100 active:scale-95 transition-all"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#005c86] hover:bg-[#0e76a8] text-white font-bold text-sm shadow-md active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
