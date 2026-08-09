'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createAccountInfoAcademy, login } from '@/services/auth';
import { useCountry } from '@/hooks/useCountry';
import { triggerPageLoader } from '@/components/PageLoader';
import { Country } from '@/types/country';

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { countries, selectedCountry, setSelectedCountry } = useCountry();

  // Step 1: Card selection
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState('schoolteacher');

  // Step 2: Country selection dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Local fallback country if selectedCountry is not initialized yet
  const activeCountry = selectedCountry || (countries && countries.length > 0 ? countries.find(c => c.isoCode === 'EG') || countries[0] : null);

  // Form details
  const [academyName, setAcademyName] = useState('');
  const [phone, setPhone] = useState('');

  // Step 3: Domain state
  const [domainPrefix, setDomainPrefix] = useState('');
  const [domainError, setDomainError] = useState<string | null>(null);
  const domainSuffix = '.darab.academy';

  useEffect(() => {
    // Prefill data from registration step
    const cachedAcademyName = localStorage.getItem('user_academy_name') || localStorage.getItem('user_name') || '';
    const cachedPhone = localStorage.getItem('user_phone') || '';
    if (cachedAcademyName) setAcademyName(cachedAcademyName);
    if (cachedPhone) setPhone(cachedPhone);
  }, []);

  const selectCard = (cardIndex: number, field: string) => {
    setSelectedCardIndex(cardIndex);
    setSelectedField(field);

    setTimeout(() => {
      goToStep(2);
    }, 600);
  };

  const goToStep = (step: number) => {
    if (step === currentStep) return;
    setCurrentStep(step);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleCountrySelect = (c: Country) => {
    if (setSelectedCountry) {
      setSelectedCountry(c);
    }
    setDropdownOpen(false);
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setDomainPrefix(cleanVal);

    if (!cleanVal) {
      setDomainError(null);
      return;
    }

    if (cleanVal.length < 2) {
      setDomainError('يجب أن يكون الرابط حرفين على الأقل');
    } else {
      setDomainError(null);
    }
  };

  const handleSubmit = async () => {
    if (!domainPrefix) {
      toast.error('يرجى كتابة رابط المنصة');
      return;
    }
    if (domainError) {
      toast.error('يرجى تصحيح خطأ الرابط');
      return;
    }

    setLoading(true);

    try {
      const fullLink = domainPrefix + domainSuffix;

      const getCookie = (name: string) => {
        if (typeof document === 'undefined') return '';
        const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : '';
      };

      const userInfoStr = localStorage.getItem('user_info');
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
      const cachedEmail = localStorage.getItem('user_email') || userInfo?.email || getCookie('backup_email') || '';
      const cachedPhone = localStorage.getItem('user_phone') || userInfo?.phone || getCookie('backup_phone') || phone || '';
      const finalPhone = phone || cachedPhone || '';

      const payload: any = {
        username: academyName || 'أكاديمي',
        phone_academy: finalPhone || '0500000000',
        country_code: activeCountry?.isoCode || 'EG',
        specialties: selectedField,
        role: selectedField,
        account_type: selectedField,
        type: selectedField,
        link_academy: fullLink.toLowerCase()
      };

      if (cachedEmail) {
        payload.email = cachedEmail;
      } else if (finalPhone) {
        payload.phone = finalPhone;
      }
      if (!payload.email && !payload.phone) {
        payload.email = 'admin@academy.com';
      }

      const setupResponse = (await createAccountInfoAcademy(payload)) as any;

      const responseLink = setupResponse?.data?.link_academy || setupResponse?.link_academy || setupResponse?.data?.academy?.link_academy;
      let finalLink = fullLink.toLowerCase();
      let finalDomainPrefix = domainPrefix.toLowerCase();

      if (responseLink && typeof responseLink === 'string') {
        finalLink = responseLink.toLowerCase();
        if (finalLink.endsWith(domainSuffix.toLowerCase())) {
          finalDomainPrefix = finalLink.slice(0, -domainSuffix.length);
        } else {
          finalDomainPrefix = finalLink.split('.')[0];
        }
      }

      localStorage.setItem('academy_link_name', finalLink);
      localStorage.setItem('user_account_type', selectedField);
      localStorage.setItem('user_role', selectedField);
      toast.success('تم حفظ معلومات الأكاديمية بنجاح');

      // Auto login logic
      const password = localStorage.getItem('user_password') || getCookie('backup_password');
      let loginSuccess = false;

      if (password && (cachedEmail || finalPhone)) {
        try {
          const loginResponse = await login({
            email: cachedEmail || undefined,
            phone: cachedEmail ? undefined : (finalPhone || undefined),
            password: password
          });

          if (loginResponse.meta && loginResponse.meta.access_token) {
            const token = loginResponse.meta.access_token;
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
            localStorage.setItem('token', token);

            if (loginResponse.data) {
              localStorage.setItem('user_info', JSON.stringify({
                name: loginResponse.data.name,
                email: loginResponse.data.email || cachedEmail,
                phone: loginResponse.data.phone || finalPhone || cachedPhone,
                role: 'الادمن'
              }));
            }
            loginSuccess = true;

            document.cookie = "backup_email=; path=/; max-age=0; SameSite=Lax";
            document.cookie = "backup_phone=; path=/; max-age=0; SameSite=Lax";
            document.cookie = "backup_password=; path=/; max-age=0; SameSite=Lax";
          }
        } catch (loginError) {
          console.error('Auto login failed:', loginError);
        }
      }

      localStorage.removeItem('user_password');

      const isLocal = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
      const defaultSuffix = isLocal ? '.darab.academy.localhost:3000' : '.darab.academy';

      if (!loginSuccess) {
        const tenantSuffix = process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX || defaultSuffix;
        const protocol = window.location.protocol;
        const tenantUrl = `${protocol}//${finalDomainPrefix}${tenantSuffix}/auth/setup`;

        triggerPageLoader(true);
        window.location.href = tenantUrl;
        return;
      }

      const tenantSuffix = process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX || defaultSuffix;
      const dashboardPath = process.env.NEXT_PUBLIC_TENANT_DASHBOARD_PATH || '/academic';
      const protocol = window.location.protocol;
      const token = localStorage.getItem('token');

      const tenantUrl = `${protocol}//${finalDomainPrefix}${tenantSuffix}${dashboardPath}${token ? `?token=${token}` : ''}`;

      triggerPageLoader(true);
      window.location.href = tenantUrl;
    } catch (error: any) {
      console.error("Setup API Error:", error);
      let handled = false;

      const validationErrors = error?.errors || error?.response?.data?.errors || error?.error;

      if (validationErrors && typeof validationErrors === 'object') {
        if (validationErrors.link_academy) {
          const rawMsg = Array.isArray(validationErrors.link_academy)
            ? validationErrors.link_academy[0]
            : validationErrors.link_academy;

          let translated = rawMsg;
          if (typeof rawMsg === 'string' && rawMsg.toLowerCase().includes('already been taken')) {
            translated = 'رابط المنصة مستخدم بالفعل، يرجى اختيار رابط آخر.';
          } else if (typeof rawMsg === 'string' && (rawMsg.toLowerCase().includes('format') || rawMsg.toLowerCase().includes('invalid'))) {
            translated = 'صيغة رابط المنصة غير صالحة.';
          }

          setDomainError(translated);
          toast.error(translated);
          handled = true;
        }

        if (!handled && (validationErrors.email || validationErrors.phone)) {
          const msg = 'يرجى التأكد من اختيار رابط منصة صحيح وبيانات التواصل.';
          toast.error(msg);
          handled = true;
        }

        if (!handled && (validationErrors.username || validationErrors.phone_academy)) {
          const msg = (Array.isArray(validationErrors.username) ? validationErrors.username[0] : validationErrors.username) ||
            (Array.isArray(validationErrors.phone_academy) ? validationErrors.phone_academy[0] : validationErrors.phone_academy);
          if (msg) {
            toast.error(msg);
            handled = true;
          }
        }
      }

      if (!handled) {
        let rawMessage = error?.message || (typeof error === 'string' ? error : 'حدث خطأ أثناء حفظ معلومات المنصة');
        if (typeof rawMessage === 'string' && rawMessage.toLowerCase().includes('already been taken')) {
          const translated = 'رابط المنصة مستخدم بالفعل، يرجى اختيار رابط آخر.';
          setDomainError(translated);
          toast.error(translated);
        } else if (typeof rawMessage === 'string' && rawMessage.toLowerCase().includes('validation errors detected')) {
          toast.error('يرجى التأكد من ملء الحقول المطلوبة ومراجعة رابط المنصة.');
        } else {
          toast.error(rawMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };


  const filteredCountries = (countries || []).filter(c =>
    c.name.includes(countrySearch)
  );

  const getProgLineWidth = () => {
    if (currentStep === 1) return '0%';
    if (currentStep === 2) return '50%';
    return '100%';
  };

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
        <div className="w-full max-w-2xl mb-12 flex justify-between items-center relative">
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

          {/* Step 3 Dot */}
          <div
            onClick={() => goToStep(3)}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-500 cursor-pointer z-10 ${currentStep >= 3 ? 'bg-[#004ac6] text-white shadow-lg shadow-[#004ac6]/20' : 'bg-[#d9e3f4] text-[#434655]'
              }`}
          >
            ٣
          </div>
        </div>

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
                  <span className="material-symbols-outlined text-[#004ac6] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div className="mb-6 w-12 h-12 rounded-xl bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6]">
                  <span className="material-symbols-outlined text-3xl">school</span>
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
                  <span className="material-symbols-outlined text-[#004ac6] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div className="mb-6 w-12 h-12 rounded-xl bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6]">
                  <span className="material-symbols-outlined text-3xl">star</span>
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
                  <span className="material-symbols-outlined text-[#004ac6] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div className="mb-6 w-12 h-12 rounded-xl bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6]">
                  <span className="material-symbols-outlined text-3xl">business</span>
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

        {/* Step 2: Country Selection */}
        {currentStep === 2 && (
          <section className="w-full max-w-xl step-transition animate-slide-up-fade">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-[#111827] mb-4">اختر الدولة</h1>
              <p className="text-sm text-[#434655]">سنقوم بضبط العملة والمنطقة الزمنية تلقائيًا.</p>
            </div>

            <div className="relative w-full space-y-6">
              {/* Country Select Dropdown */}
              <div className="relative w-full">
                <div
                  className="w-full bg-white border border-slate-300 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#004ac6] transition-all"
                  onClick={toggleDropdown}
                >
                  <div className="flex items-center gap-3">
                    {activeCountry?.flagUrl ? (
                      <img src={activeCountry.flagUrl} alt={activeCountry.name} className="w-7 h-5 object-cover rounded" />
                    ) : (
                      <span className="text-2xl">{activeCountry?.flagEmoji || '🇪🇬'}</span>
                    )}
                    <span className="text-base font-medium text-[#111827]">{activeCountry?.name || 'مصر'}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#434655]">expand_more</span>
                </div>

                {dropdownOpen && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-20 overflow-hidden">
                    <div className="p-2">
                      <div className="flex items-center px-3 py-2 bg-[#eef4ff] rounded-lg mb-2">
                        <span className="material-symbols-outlined text-[#434655] ml-2">search</span>
                        <input
                          type="text"
                          placeholder="بحث عن دولة..."
                          value={countrySearch}
                          onChange={e => setCountrySearch(e.target.value)}
                          className="bg-transparent border-none focus:outline-none w-full text-sm text-[#111827]"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredCountries.map(c => (
                          <div
                            key={c.isoCode}
                            onClick={() => handleCountrySelect(c)}
                            className="flex items-center gap-3 p-3 hover:bg-[#eef4ff] rounded-lg cursor-pointer transition-colors"
                          >
                            {c.flagUrl ? (
                              <img src={c.flagUrl} alt={c.name} className="w-6 h-4 object-cover rounded" />
                            ) : (
                              <span className="text-2xl">{c.flagEmoji}</span>
                            )}
                            <span className="text-sm font-medium text-[#111827]">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional optional inputs if missing */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 text-right">اسم الأكاديمية / المنصة</label>
                  <input
                    type="text"
                    value={academyName}
                    onChange={e => setAcademyName(e.target.value)}
                    placeholder="أدخل اسم أكاديميتك"
                    className="w-full p-4 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-[#004ac6] text-sm font-medium text-[#111827]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 text-right">رقم الجوال الأساسي</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="أدخل رقم الجوال"
                    dir="ltr"
                    className="w-full p-4 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-[#004ac6] text-sm font-medium text-left text-[#111827]"
                  />
                </div>
              </div>
            </div>

            <button
              className="w-full mt-10 bg-[#004ac6] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2563eb] transition-all active:scale-95 shadow-lg shadow-[#004ac6]/20"
              onClick={() => goToStep(3)}
            >
              المتابعة
            </button>
          </section>
        )}

        {/* Step 3: Domain Selection */}
        {currentStep === 3 && (
          <section className="w-full max-w-xl step-transition animate-slide-up-fade">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-[#111827] mb-4">اختر رابط منصتك</h1>
              <p className="text-sm text-[#434655]">هذا هو العنوان الذي سيستخدمه طلابك للوصول إلى دروسك.</p>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <div className={`flex items-center border rounded-xl overflow-hidden transition-colors bg-white ${domainError ? 'border-red-500 focus-within:border-red-500' : 'border-slate-300 focus-within:border-[#004ac6]'}`}>
                  <input
                    type="text"
                    dir="ltr"
                    value={domainPrefix}
                    onChange={handleDomainChange}
                    placeholder="اسم-منصتك"
                    className="flex-grow p-4 border-none text-lg font-medium placeholder:text-[#434655]/40 text-left outline-none text-[#111827]"
                  />
                  <div className="bg-[#eef4ff] px-4 py-4 text-[#434655] font-medium border-l border-slate-300 select-none">
                    {domainSuffix}
                  </div>
                </div>

                {domainPrefix.length > 2 && !domainError && (
                  <div className="mt-2 text-[#006a61] text-xs font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    صيغة الدومين متاحة للاستخدام
                  </div>
                )}
                {domainError && (
                  <div className="mt-2 text-red-500 text-xs font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {domainError}
                  </div>
                )}
              </div>

              <div className="bg-[#eef4ff] p-6 rounded-xl border border-dashed border-[#c3c6d7] text-center">
                <p className="text-[#434655] text-sm mb-2">معاينة رابط المنصة:</p>
                <p className="text-[#004ac6] font-bold text-xl dir-ltr">
                  https://{domainPrefix || '...'}{domainSuffix}
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[#004ac6] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2563eb] transition-all active:scale-95 shadow-lg shadow-[#004ac6]/20 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
