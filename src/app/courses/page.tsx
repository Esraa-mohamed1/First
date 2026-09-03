'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, BookOpen, Clock, Tag, ChevronLeft, GraduationCap, Grid,
  Layers, AlertCircle, Sparkles, Filter, RefreshCw
} from 'lucide-react';
import { getCourses } from '@/services/courses';
import { Course } from '@/types/api';
import toast from 'react-hot-toast';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [academyInfo, setAcademyInfo] = useState<{ name?: string; logo?: string } | null>(null);

  // Fetch academy profile details for header branding
  useEffect(() => {
    const cached = localStorage.getItem('darab_academy_profile');
    if (cached) {
      try {
        setAcademyInfo(JSON.parse(cached));
      } catch (e) {}
    }

    const fetchProfile = async () => {
      try {
        let hostname = window.location.hostname;
        if (hostname.endsWith('.localhost')) {
          hostname = hostname.replace('.localhost', '');
        }
        const tenantKey = (hostname === 'localhost' || hostname === 'darab.academy' || hostname === 'www.darab.academy') ? '' : hostname;
        if (!tenantKey) return;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Tenant-Key': tenantKey.toLowerCase(),
          'X-Tenant': tenantKey.toLowerCase(),
          'x-tenant-name': tenantKey.toLowerCase()
        };

        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('https://api.darab.academy/api/academy/me', { headers });
        if (res.ok) {
          const resJson = await res.json();
          const data = resJson.data ?? resJson;
          if (data) {
            const info = {
              name: data.academy_name || data.name || '',
              logo: data.logo || data.logo_url || ''
            };
            setAcademyInfo(info);
            localStorage.setItem('darab_academy_profile', JSON.stringify(info));
          }
        }
      } catch (err) {
        console.error('Failed to fetch academy profile in courses page:', err);
      }
    };

    fetchProfile();
  }, []);

  // Fetch courses from endpoints
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const data = await getCourses();
        const published = (data || []).filter((c) => !c.status || c.status === 'published');
        setCourses(published);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        toast.error('حدث خطأ أثناء تحميل الدورات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Helper to safely extract category name as a string
  const getCourseCategoryName = (c: any): string => {
    if (!c || !c.category) return '';
    const cat = c.category;
    if (typeof cat === 'object') {
      if (typeof cat.name === 'string') {
        return cat.name;
      }
      if (cat.name && typeof cat.name === 'object') {
        const localized = cat.name.ar || cat.name.en || cat.name.name || '';
        if (typeof localized === 'string') return localized;
      }
      if (typeof cat.title === 'string') {
        return cat.title;
      }
      return cat.name ? String(cat.name) : (cat.title ? String(cat.title) : '');
    }
    return String(cat);
  };

  // Unique categories list for filters
  const categories = useMemo(() => {
    const list = new Set<string>();
    courses.forEach((c) => {
      const catName = getCourseCategoryName(c);
      const trimmed = catName.trim();
      if (trimmed !== '' && trimmed !== '[object Object]') {
        list.add(trimmed);
      }
    });
    return Array.from(list);
  }, [courses]);

  // Filter & Search Logic
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.coach?.toLowerCase().includes(searchQuery.toLowerCase());

      const cCatName = getCourseCategoryName(c);
      const matchesCategory =
        selectedCategory === 'all' || cCatName === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" dir="rtl">
      
      {/* Premium Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Academy Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            {academyInfo?.logo ? (
              <img src={academyInfo.logo} alt={academyInfo.name} className="w-10 h-10 object-contain rounded-xl shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-200">
                {academyInfo?.name?.[0] || 'د'}
              </div>
            )}
            <span className="text-lg font-black text-slate-800 tracking-tight">
              {academyInfo?.name || 'أكاديمية درب'}
            </span>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-slate-600 hover:text-indigo-600 font-bold text-sm transition-colors">الرئيسية</a>
            <a href="/courses" className="text-indigo-600 font-extrabold text-sm relative transition-colors">
              الدورات
              <span className="absolute -bottom-1.5 right-0 left-0 h-0.5 bg-indigo-600 rounded-full"></span>
            </a>
            <a href="/bags" className="text-slate-600 hover:text-indigo-600 font-bold text-sm transition-colors">الحقائب التعليمية</a>
          </nav>

          {/* Portal redirect Button */}
          <div>
            <a 
              href="/login" 
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all shadow-sm"
            >
              حسابي
            </a>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-16 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
            <Sparkles size={14} className="text-indigo-600" />
            <span className="text-xs font-black text-indigo-700">تعلّم واكتسب أفضل المهارات</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
            تصفح <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">الدورات التدريبية</span> المتاحة
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            استكشف برامجنا الأكاديمية والتدريبية المتنوعة، وابدأ رحلة التميز المهني والتعليمي مع نخبة من أفضل المدربين.
          </p>
        </div>
      </section>

      {/* Filter and Search Container */}
      <section className="max-w-7xl mx-auto px-6 w-full -mt-6 mb-12 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xl shadow-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search bar with glassmorphism */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="ابحث عن دورة، مهارة، أو مدرب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl outline-none text-sm font-bold text-slate-700 placeholder-slate-400 transition-all"
            />
            <Search className="absolute right-4 top-3.5 text-slate-400" size={18} />
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end overflow-x-auto py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-6 w-full flex-grow pb-24">
        
        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full h-48 bg-slate-200" />
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-10 bg-slate-200 rounded w-full pt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          
          /* Empty State */
          <div className="bg-white border border-slate-200/60 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">لا توجد دورات متاحة</h3>
            <p className="text-slate-400 text-sm font-bold max-w-xs mb-6">
              لم نعثر على أي دورة تطابق معايير البحث أو الفئة المحددة حالياً.
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
              >
                <RefreshCw size={14} />
                إعادة ضبط الفلاتر
              </button>
            )}
          </div>
        ) : (
          
          /* Cards Grid List */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => {
              const unitCount = course.units?.length || course.chapters?.length || 0;
              const hasDiscount = course.price_type === 'paid' && course.final_price != null && Number(course.final_price) < Number(course.price);

              return (
                <div
                  key={course.id}
                  onClick={() => router.push(`/courses/${course.slug}`)}
                  className="group bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Card Cover Image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {course.image || course.cover_image ? (
                      <img
                        src={course.image || course.cover_image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center">
                        <BookOpen size={40} className="text-slate-300" />
                      </div>
                    )}
                    {/* Category Overlay Tag */}
                    {course.category && (
                      <span className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 backdrop-blur border border-slate-100 text-[10px] font-black text-indigo-700 rounded-lg shadow-sm">
                        {getCourseCategoryName(course) || 'عام'}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-grow text-right">
                    <h3 className="text-sm font-black text-slate-800 leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[40px]">
                      {course.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 line-clamp-2 mb-4 leading-relaxed flex-grow">
                      {course.description?.replace(/<[^>]*>/g, '') || 'لا يوجد وصف متاح لهذه الدورة'}
                    </p>

                    {/* Meta information row */}
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-4 mb-4">
                      {course.coach && (
                        <div className="flex items-center gap-1">
                          <GraduationCap size={14} className="text-slate-400" />
                          <span className="truncate max-w-[80px]">{course.coach}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Layers size={13} />
                        <span>{unitCount} وحدات</span>
                      </div>
                    </div>

                    {/* Price and Action Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {course.price_type === 'free' || Number(course.price) === 0 ? (
                          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">مجاناً</span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-black text-indigo-600">
                              {Number(course.final_price).toLocaleString()}
                              <span className="text-[10px] font-bold mr-0.5">{course.currency || 'SAR'}</span>
                            </span>
                            {hasDiscount && (
                              <span className="text-[10px] font-bold text-slate-300 line-through">
                                {Number(course.price).toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-all">
                        <ChevronLeft size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Styled Premium Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-auto select-none">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-right">
          
          <div className="flex flex-col gap-4 items-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
                {academyInfo?.name?.[0] || 'د'}
              </div>
              <span className="text-white font-extrabold tracking-tight text-base">
                {academyInfo?.name || 'أكاديمية درب'}
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs text-slate-500 font-bold">
              منصتك الرقمية المتكاملة للتعلم وصقل المهارات، مصممة بأعلى جودة لتقديم تجربة دراسية استثنائية.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-start">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">روابط سريعة</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-500">
              <li><a href="/" className="hover:text-white transition-colors">الرئيسية</a></li>
              <li><a href="/courses" className="hover:text-white transition-colors">الدورات التدريبية</a></li>
              <li><a href="/bags" className="hover:text-white transition-colors">الحقائب التعليمية</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 items-start">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">المساعدة والدعم</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-500">
              <li><a href="/terms" className="hover:text-white transition-colors">شروط الخدمة والتعاقد</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية وسرية البيانات</a></li>
              <li><a href="/refund" className="hover:text-white transition-colors">سياسة الاسترجاع والالغاء</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-600">
          <p>© {new Date().getFullYear()} {academyInfo?.name || 'درب'}. جميع الحقوق محفوظة.</p>
          <p className="mt-2 sm:mt-0">مشغل بواسطة منصة درب الذكية</p>
        </div>
      </footer>

    </div>
  );
}
