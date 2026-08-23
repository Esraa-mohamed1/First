'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Star, Building2, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { useSetupState } from '@/hooks/useSetupState';

export default function SetupPage() {
  const {
    currentStep,
    loading,
    selectedCardIndex,
    activeCountry,
    saudiCountry,
    kuwaitCountry,
    egyptCountry,
    academyName,
    setAcademyName,
    fieldErrors,
    setFieldErrors,
    domainPrefix,
    domainError,
    domainSuffix,
    selectCard,
    goToStep,
    handleCountrySelect,
    handleDomainChange,
    handleSubmit,
    getProgLineWidth
  } = useSetupState();

  return (
    <div className="gradient-mesh min-h-screen text-[#121c28] antialiased overflow-x-hidden w-full font-sans" dir="rtl">
      {/* Header Navigation Shell */}
      <header className="flex justify-between items-center px-6 sm:px-10 w-full h-16 bg-[#f8f9ff]/80 backdrop-blur-md fixed top-0 z-50 border-b border-[#E5E7EB]">
        <div className="text-2xl font-bold text-[#004ac6]">درب</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#434655] hidden sm:inline">هل لديك حساب؟</span>
          <Link href="/auth/login" className="text-[#004ac6] font-semibold hover:underline text-sm">
            تسجيل الدخول
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4 sm:px-6 md:px-0 flex flex-col items-center max-w-5xl mx-auto">
        {/* Progress Indicator */}
        <div className="w-full max-w-xl mb-12 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#d9e3f4] -z-10 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 right-0 h-0.5 bg-[#004ac6] -z-10 -translate-y-1/2 transition-all duration-700"
            style={{ width: getProgLineWidth() }}
          ></div>

          {/* Step 1 Dot */}
          <div
            onClick={() => goToStep(1)}
            className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold shadow-lg shadow-[#004ac6]/20 cursor-pointer z-10"
          >
            ١
          </div>

          {/* Step 2 Dot */}
          <div
            onClick={() => goToStep(2)}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-500 cursor-pointer z-10 ${currentStep >= 2 ? 'bg-[#004ac6] text-white shadow-lg shadow-[#004ac6]/20' : 'bg-[#d9e3f4] text-[#434655]'
              }`}
          >
            ٢
          </div>
        </div>

        {/* Back Button */}
        {currentStep > 1 && (
          <div className="w-full max-w-xl flex justify-start mb-6">
            <button
              onClick={() => goToStep(currentStep - 1)}
              className="flex items-center gap-2 text-sm font-bold text-[#434655] hover:text-[#004ac6] transition-all bg-white py-2.5 px-4 rounded-xl border border-slate-200 hover:border-[#004ac6]/30 shadow-sm hover:shadow-md active:scale-95 duration-200 group"
            >
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>الرجوع للخطوة السابقة</span>
            </button>
          </div>
        )}

        {/* Step 1: Account Type */}
        {currentStep === 1 && (
          <section className="w-full max-w-4xl step-transition animate-slide-up-fade">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">مرحبًا بك في درب</h1>
              <p className="text-lg text-[#434655]">دعنا نخصص المنصة لتناسب طريقة عملك.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div
                className={`group bg-white border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full ${selectedCardIndex === 1 ? 'card-active' : selectedCardIndex !== null ? 'card-inactive' : ''
                  }`}
                onClick={() => selectCard(1, 'schoolteacher')}
              >
                <div className={`absolute top-4 left-4 transition-opacity ${selectedCardIndex === 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <CheckCircle2 className="w-6 h-6 text-[#004ac6]" />
                </div>
                <div className="mb-6 w-12 h-12 rounded-xl bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6]">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#111827]">مدرس ثانوية عامة</h3>
                <p className="text-sm text-[#434655] mb-6 flex-grow leading-relaxed">
                  أنشئ موادك، تابع طلابك، وبع حصصك ومراجعاتك بسهولة.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3.5 py-1 bg-[#e5eeff] text-[#006f66] rounded-full text-xs font-semibold">حصص</span>
                  <span className="px-3.5 py-1 bg-[#e5eeff] text-[#006f66] rounded-full text-xs font-semibold">طلاب</span>
                  <span className="px-3.5 py-1 bg-[#e5eeff] text-[#006f66] rounded-full text-xs font-semibold">امتحانات</span>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className={`group bg-white border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full ${selectedCardIndex === 2 ? 'card-active' : selectedCardIndex !== null ? 'card-inactive' : ''
                  }`}
                onClick={() => selectCard(2, 'coach')}
              >
                <div className={`absolute top-4 left-4 transition-opacity ${selectedCardIndex === 2 ? 'opacity-100' : 'opacity-0'}`}>
                  <CheckCircle2 className="w-6 h-6 text-[#004ac6]" />
                </div>
                <div className="mb-6 w-12 h-12 rounded-xl bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6]">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#111827]">مدرب أو كوتش</h3>
                <p className="text-sm text-[#434655] mb-6 flex-grow leading-relaxed">
                  أنشئ دورات احترافية، شهادات، وصفحات بيع لزيادة مبيعاتك.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3.5 py-1 bg-[#e5eeff] text-[#006f66] rounded-full text-xs font-semibold">دورات</span>
                  <span className="px-3.5 py-1 bg-[#e5eeff] text-[#006f66] rounded-full text-xs font-semibold">شهادات</span>
                  <span className="px-3.5 py-1 bg-[#e5eeff] text-[#006f66] rounded-full text-xs font-semibold">صفحات بيع</span>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className={`group bg-white border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full ${selectedCardIndex === 3 ? 'card-active' : selectedCardIndex !== null ? 'card-inactive' : ''
                  }`}
                onClick={() => selectCard(3, 'academy')}
              >
                <div className={`absolute top-4 left-4 transition-opacity ${selectedCardIndex === 3 ? 'opacity-100' : 'opacity-0'}`}>
                  <CheckCircle2 className="w-6 h-6 text-[#004ac6]" />
                </div>
                <div className="mb-6 w-12 h-12 rounded-xl bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6]">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#111827]">أكاديمية أو مركز تدريبي</h3>
                <p className="text-sm text-[#434655] mb-6 flex-grow leading-relaxed">
                  أدر المدربين والدورات والطلاب من لوحة تحكم واحدة.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3.5 py-1 bg-[#e5eeff] text-[#006f66] rounded-full text-xs font-semibold">مدربون</span>
                  <span className="px-3.5 py-1 bg-[#e5eeff] text-[#006f66] rounded-full text-xs font-semibold">طلاب</span>
                  <span className="px-3.5 py-1 bg-[#e5eeff] text-[#006f66] rounded-full text-xs font-semibold">تقارير</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Merged Country & Domain Setup */}
        {currentStep === 2 && (
          <section className="w-full max-w-xl step-transition animate-slide-up-fade space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#111827] mb-3">اختر الدولة ورابط المنصة</h1>
              <p className="text-sm text-[#434655]">سنقوم بضبط العملة والمنطقة الزمنية وإعداد رابط منصتك تلقائيًا.</p>
            </div>

            {/* Country Selection */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-700 text-center">اختر الدولة</label>
              <div className="flex justify-center items-center gap-6 sm:gap-10 py-2">
                {[
                  { id: 'EG', label: 'مصر', country: egyptCountry },
                  { id: 'SA', label: 'السعودية', country: saudiCountry },
                  { id: 'KW', label: 'الكويت', country: kuwaitCountry }
                ].map(({ id, label, country }) => {
                  const isSelected = activeCountry?.isoCode === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="flex flex-col items-center gap-2 group transition-all duration-300 focus:outline-none"
                    >
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-4 overflow-hidden transition-all duration-300 shadow-sm relative ${
                          isSelected
                            ? 'border-[#004ac6] bg-[#eef4ff] scale-105 shadow-md shadow-[#004ac6]/15'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:scale-102 hover:shadow-md'
                        }`}
                      >
                        {country.flagUrl ? (
                          <img
                            src={id === 'KW' ? country.flagUrl : country.flagUrl.replace('/w40/', '/w80/')}
                            alt={label}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-100 shadow-inner"
                          />
                        ) : (
                          <span className="text-2xl sm:text-3xl">{country.flagEmoji}</span>
                        )}
                        <div className={`absolute inset-0 rounded-full bg-[#004ac6]/5 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      </div>
                      <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-[#004ac6]' : 'text-[#434655] group-hover:text-[#111827]'}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Domain & Academy Name Details */}
            <div className="space-y-6 pt-4 border-t border-slate-200/60">
              {/* Academy Name Input */}
              <div className="relative group">
                <label className="block text-xs font-bold text-gray-700 mb-2 text-right">اسم الأكاديمية / المنصة</label>
                {(fieldErrors.username || fieldErrors.academy_name) && (
                  <div className="absolute -top-10 right-0 z-20 hidden group-hover:flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in zoom-in-95 pointer-events-none">
                    <AlertCircle className="w-4 h-4" />
                    <span>{fieldErrors.username || fieldErrors.academy_name}</span>
                    <div className="absolute -bottom-1 right-4 w-2 h-2 bg-red-600 rotate-45"></div>
                  </div>
                )}
                <input
                  type="text"
                  value={academyName}
                  title={fieldErrors.username || fieldErrors.academy_name || ''}
                  onChange={e => {
                    setAcademyName(e.target.value);
                    if (fieldErrors.username || fieldErrors.academy_name) {
                      setFieldErrors(prev => ({ ...prev, username: '', academy_name: '' }));
                    }
                  }}
                  placeholder="أدخل اسم أكاديميتك"
                  className={`w-full p-4 border rounded-xl bg-white focus:outline-none text-sm font-medium text-[#111827] transition-all ${
                    fieldErrors.username || fieldErrors.academy_name ? 'border-red-500 bg-red-50/20 focus:border-red-500' : 'border-slate-300 focus:border-[#004ac6]'
                  }`}
                />
                {(fieldErrors.username || fieldErrors.academy_name) && (
                  <p className="mt-1 text-red-500 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.username || fieldErrors.academy_name}
                  </p>
                )}
              </div>

              {/* Domain Prefix Input */}
              <div className="relative group">
                <label className="block text-xs font-bold text-gray-700 mb-2 text-right">رابط المنصة</label>
                {(fieldErrors.link_academy || domainError) && (
                  <div className="absolute -top-10 right-0 z-20 hidden group-hover:flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in zoom-in-95 pointer-events-none">
                    <AlertCircle className="w-4 h-4" />
                    <span>{fieldErrors.link_academy || domainError}</span>
                    <div className="absolute -bottom-1 right-4 w-2 h-2 bg-red-600 rotate-45"></div>
                  </div>
                )}
                <div className={`flex items-center border rounded-xl overflow-hidden transition-colors bg-white ${domainError || fieldErrors.link_academy ? 'border-red-500 focus-within:border-red-500 bg-red-50/20' : 'border-slate-300 focus-within:border-[#004ac6]'}`}>
                  <input
                    type="text"
                    dir="ltr"
                    value={domainPrefix}
                    title={fieldErrors.link_academy || domainError || ''}
                    onChange={(e) => {
                      handleDomainChange(e);
                      if (fieldErrors.link_academy) setFieldErrors(prev => ({ ...prev, link_academy: '' }));
                    }}
                    placeholder="اسم-منصتك"
                    className="flex-grow p-4 border-none text-lg font-medium placeholder:text-[#434655]/40 text-left outline-none text-[#111827]"
                  />
                  <div className="bg-[#eef4ff] px-4 py-4 text-[#434655] font-medium border-l border-slate-300 select-none">
                    {domainSuffix}
                  </div>
                </div>

                {domainPrefix.length > 2 && !domainError && !fieldErrors.link_academy && (
                  <div className="mt-2 text-[#006a61] text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    صيغة الدومين متاحة للاستخدام
                  </div>
                )}
                {(domainError || fieldErrors.link_academy) && (
                  <div className="mt-2 text-red-500 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.link_academy || domainError}
                  </div>
                )}
              </div>

              <div className="bg-[#eef4ff] p-6 rounded-xl border border-dashed border-[#c3c6d7] text-center">
                <p className="text-[#434655] text-sm mb-2">معاينة رابط المنصة:</p>
                <p className="text-[#004ac6] font-bold text-xl dir-ltr">
                  https://{domainPrefix || '...'}{domainSuffix}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[#004ac6] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2563eb] transition-all active:scale-95 shadow-lg shadow-[#004ac6]/20 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin text-xl">◌</span>
                      جاري إنشاء منصتك...
                    </>
                  ) : (
                    'ابدأ استخدام درب'
                  )}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer Space */}
      <footer className="w-full py-12 bg-white border-t border-[#E5E7EB] mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-10 w-full max-w-5xl mx-auto gap-4">
          <div className="text-sm font-bold text-[#434655]">© 2024 درب أكاديمي. جميع الحقوق محفوظة.</div>
          <div className="flex gap-8">
            <a href="#" className="text-[#434655] text-xs hover:text-[#004ac6] transition-colors">
              سياسة الخصوصية
            </a>
            <a href="#" className="text-[#434655] text-xs hover:text-[#004ac6] transition-colors">
              شروط الخدمة
            </a>
            <a href="#" className="text-[#434655] text-xs hover:text-[#004ac6] transition-colors">
              الدعم الفني
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
