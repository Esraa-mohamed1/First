'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Palette, Type, Check, RefreshCw, Save, HelpCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface ColorTheme {
  primaryColor: string;
  secondaryColor: string;
  primaryFont: string;
  secondaryFont: string;
}

const FONTS_LIST = [
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans Arabic' },
  { value: 'Cairo', label: 'Cairo (القاهرة)' },
  { value: 'Tajawal', label: 'Tajawal (تجول)' },
  { value: 'Almarai', label: 'Almarai (المراعي)' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Roboto', label: 'Roboto' }
];

export default function ColorsAndFontsPage() {
  const [theme, setTheme] = useState<ColorTheme>({
    primaryColor: '#4880FF',
    secondaryColor: '#FF484B',
    primaryFont: 'IBM Plex Sans Arabic',
    secondaryFont: 'Inter'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primaryColorInputRef = useRef<HTMLInputElement>(null);
  const secondaryColorInputRef = useRef<HTMLInputElement>(null);

  // Load from localstorage on mount
  useEffect(() => {
    const savedColors = localStorage.getItem('darab_site_colors');
    if (savedColors) {
      try {
        setTheme(JSON.parse(savedColors));
      } catch (e) {
        console.error('Failed to parse site colors:', e);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    localStorage.setItem('darab_site_colors', JSON.stringify(theme));
    
    // Apply changes dynamically to document variable styles (for live feedback)
    document.documentElement.style.setProperty('--primary-brand-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-brand-color', theme.secondaryColor);
    
    toast.success('تم حفظ إعدادات الهوية والألوان بنجاح!', {
      style: {
        fontFamily: 'IBM Plex Sans Arabic',
        fontWeight: 'bold',
        direction: 'rtl'
      }
    });
    setIsSubmitting(false);
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: 'إعادة تعيين الألوان والخطوط',
      text: 'هل أنت متأكد من استعادة الألوان والخطوط الافتراضية؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4880FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، استعد الافتراضي',
      cancelButtonText: 'إلغاء',
      customClass: {
        popup: 'rounded-[2rem]',
      }
    });

    if (result.isConfirmed) {
      const defaultTheme = {
        primaryColor: '#4880FF',
        secondaryColor: '#FF484B',
        primaryFont: 'IBM Plex Sans Arabic',
        secondaryFont: 'Inter'
      };
      setTheme(defaultTheme);
      localStorage.setItem('darab_site_colors', JSON.stringify(defaultTheme));
      toast.success('تمت إعادة ضبط الهوية للقيم الافتراضية');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Palette className="w-8 h-8 text-[#4880FF]" />
            <span>الهوية والألوان</span>
          </h2>
          <p className="text-gray-400 font-bold mt-2">قم بتهيئة الألوان والخطوط الخاصة بموقعك ليظهر بهويتك التجارية الفريدة</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-gray-500 font-bold transition-all border border-slate-200/60 active:scale-95 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة الافتراضي</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-gray-100 p-8 md:p-10 space-y-10">
            
            {/* Color Pickers Row */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-gray-800 flex items-center gap-2.5 pb-3 border-b border-slate-50">
                <span className="w-1.5 h-5 bg-[#4880FF] rounded-full"></span>
                الألوان التجارية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Primary Color Card */}
                <div 
                  onClick={() => primaryColorInputRef.current?.click()}
                  className="bg-white border border-slate-100 hover:border-blue-200 p-6 rounded-[2.5rem] flex items-center justify-between cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input 
                        type="color" 
                        ref={primaryColorInputRef}
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div 
                        className="w-14 h-14 rounded-2xl shadow-inner border border-black/10 transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: theme.primaryColor }}
                      ></div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-black block mb-1">اللون الأساسي</span>
                      <span className="font-mono text-gray-800 font-extrabold uppercase text-base tracking-wider">{theme.primaryColor}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-[#4880FF] transition-colors">
                    <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Secondary Color Card */}
                <div 
                  onClick={() => secondaryColorInputRef.current?.click()}
                  className="bg-white border border-slate-100 hover:border-red-200 p-6 rounded-[2.5rem] flex items-center justify-between cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input 
                        type="color" 
                        ref={secondaryColorInputRef}
                        value={theme.secondaryColor}
                        onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div 
                        className="w-14 h-14 rounded-2xl shadow-inner border border-black/10 transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: theme.secondaryColor }}
                      ></div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-black block mb-1">اللون الثانوي</span>
                      <span className="font-mono text-gray-800 font-extrabold uppercase text-base tracking-wider">{theme.secondaryColor}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                    <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

              </div>
            </div>

            {/* Typography Selectors */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-gray-800 flex items-center gap-2.5 pb-3 border-b border-slate-50">
                <span className="w-1.5 h-5 bg-[#4880FF] rounded-full"></span>
                الخطوط
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Primary Font Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 pr-2 block">الخط الأساسي (للعناوين والنصوص الكبيرة)</label>
                  <div className="relative">
                    <select
                      value={theme.primaryFont}
                      onChange={(e) => setTheme({ ...theme, primaryFont: e.target.value })}
                      className="w-full p-4.5 bg-gray-50 border border-gray-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-gray-800 text-sm appearance-none cursor-pointer"
                    >
                      {FONTS_LIST.map((font) => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                    <Type className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Secondary Font Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 pr-2 block">الخط الثانوي (للمحتوى والتفاصيل الصغيرة)</label>
                  <div className="relative">
                    <select
                      value={theme.secondaryFont}
                      onChange={(e) => setTheme({ ...theme, secondaryFont: e.target.value })}
                      className="w-full p-4.5 bg-gray-50 border border-gray-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-gray-800 text-sm appearance-none cursor-pointer"
                    >
                      {FONTS_LIST.map((font) => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                    <Type className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>

            {/* Submit buttons */}
            <div className="pt-6 border-t border-slate-50">
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="w-full bg-[#4880FF] text-white py-5 rounded-[2rem] font-black text-lg hover:bg-blue-600 active:scale-[0.99] transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>حفظ التعديلات</span>
              </button>
            </div>

          </div>
        </div>

        {/* Live Preview Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 text-white rounded-[40px] border border-slate-800 shadow-xl p-8 relative overflow-hidden flex flex-col min-h-[420px] justify-between">
            {/* Background glowing gradients with custom brand colors */}
            <div 
              className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-30 transition-all duration-500"
              style={{ backgroundColor: theme.primaryColor }}
            ></div>
            <div 
              className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 transition-all duration-500"
              style={{ backgroundColor: theme.secondaryColor }}
            ></div>

            {/* Header info */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">معاينة حية وتفاعلية</span>
              </div>
              <h4 className="text-lg font-black">موقع الأكاديمية الخاص بك</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">كيف ستظهر الألوان والخطوط المختارة لطلابك على الويب.</p>
            </div>

            {/* Simulated website components */}
            <div className="relative z-10 my-8 space-y-6 bg-slate-950/80 border border-slate-800 p-6 rounded-3xl shadow-inner text-right">
              {/* Heading */}
              <div className="space-y-1">
                <h5 
                  className="text-base font-extrabold leading-snug transition-all"
                  style={{ 
                    fontFamily: theme.primaryFont,
                    color: theme.primaryColor 
                  }}
                >
                  ابدأ مسيرتك التعليمية اليوم
                </h5>
                <p 
                  className="text-[10px] text-slate-400 font-semibold"
                  style={{ fontFamily: theme.secondaryFont }}
                >
                  تعلم مهارات جديدة واصنع مستقبلك الخاص معنا
                </p>
              </div>

              {/* Course sample card simulation */}
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black">
                    📚
                  </div>
                  <div>
                    <h6 className="text-[11px] font-bold text-slate-200">البرمجة بلغة جافاسكريبت</h6>
                    <span className="text-[8px] text-slate-500 block mt-0.5">الدورة الأساسية الشاملة</span>
                  </div>
                </div>
                {/* Secondary brand color badge */}
                <span 
                  className="text-[8px] font-black text-white px-2 py-0.5 rounded-full shadow-md transition-all shrink-0"
                  style={{ 
                    backgroundColor: theme.secondaryColor,
                    fontFamily: theme.secondaryFont 
                  }}
                >
                  مميز
                </span>
              </div>

              {/* Dynamic primary brand color button */}
              <button 
                className="w-full text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: theme.primaryColor,
                  fontFamily: theme.primaryFont 
                }}
              >
                <span>اشترك الآن في البرنامج</span>
              </button>
            </div>

            {/* Bottom info footer */}
            <div className="relative z-10 border-t border-slate-800 pt-4 flex items-center gap-2.5 text-[10px] text-slate-500 font-bold">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>قم بتغيير المدخلات لتحديث بطاقة المعاينة تلقائياً.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
