'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createAccountInfoAcademy, login } from '@/services/auth';
import { useCountry } from '@/hooks/useCountry';
import { triggerPageLoader } from '@/components/PageLoader';
import { Country } from '@/types/country';
import { translateErrorToArabic } from '@/lib/utils';

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { countries, selectedCountry, setSelectedCountry } = useCountry();

  // Step 1: Card selection
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState('schoolteacher');

  // Local fallback country if selectedCountry is not initialized yet
  const activeCountry = selectedCountry || (countries && countries.length > 0 ? countries.find(c => c.isoCode === 'EG') || countries[0] : null);

  // Find countries safely
  const saudiCountry = countries?.find(c => c.isoCode === 'SA') || { name: 'المملكة العربية السعودية', isoCode: 'SA', flagUrl: 'https://flagcdn.com/w80/sa.png', flagEmoji: '🇸🇦', dialCode: '+966' };
  const kuwaitCountry = {
    ...(countries?.find(c => c.isoCode === 'KW') || { name: 'الكويت', isoCode: 'KW', flagEmoji: '🇰🇼', dialCode: '+965' }),
    flagUrl: 'https://static.vecteezy.com/system/resources/previews/024/660/953/original/flag-of-kuwait-national-country-symbol-free-vector.jpg'
  };
  const egyptCountry = countries?.find(c => c.isoCode === 'EG') || { name: 'مصر', isoCode: 'EG', flagUrl: 'https://flagcdn.com/w80/eg.png', flagEmoji: '🇪🇬', dialCode: '+20' };

  // Form details
  const [email, setEmail] = useState('');
  const [academyName, setAcademyName] = useState('');
  const [phone, setPhone] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Step 3: Domain state
  const [domainPrefix, setDomainPrefix] = useState('');
  const [domainError, setDomainError] = useState<string | null>(null);
  const domainSuffix = '.darab.academy';

  useEffect(() => {
    // Prefill data from registration step
    const cachedAcademyName = localStorage.getItem('user_academy_name') || localStorage.getItem('user_name') || '';
    const cachedPhone = localStorage.getItem('user_phone') || '';
    const cachedEmail = localStorage.getItem('user_email') || '';
    if (cachedAcademyName) setAcademyName(cachedAcademyName);
    if (cachedPhone) setPhone(cachedPhone);
    if (cachedEmail) setEmail(cachedEmail);
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

  const handleCountrySelect = (c: Country) => {
    if (setSelectedCountry) {
      setSelectedCountry(c);
    }
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
      const cachedEmail = email || localStorage.getItem('user_email') || userInfo?.email || getCookie('backup_email') || '';
      const cachedPhone = phone || localStorage.getItem('user_phone') || userInfo?.phone || getCookie('backup_phone') || '';
      const finalPhone = phone || cachedPhone || '';
      const finalEmail = email || cachedEmail || '';

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

      if (finalEmail) {
        payload.email = finalEmail;
      }
      // Note: phone key is intentionally omitted as per requirement (only phone_academy is sent)

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
      setFieldErrors({});

      const validationErrors = error?.errors || error?.response?.data?.errors || error?.error;

      if (validationErrors && typeof validationErrors === 'object') {
        const newErrors: Record<string, string> = {};

        Object.keys(validationErrors).forEach((key) => {
          const rawMsg = Array.isArray(validationErrors[key])
            ? validationErrors[key][0]
            : validationErrors[key];
          if (typeof rawMsg === 'string') {
            newErrors[key] = translateErrorToArabic(rawMsg);
          }
        });

        setFieldErrors(newErrors);

        if (newErrors.link_academy || newErrors.domainPrefix) {
          const translated = newErrors.link_academy || newErrors.domainPrefix;
          setDomainError(translated);
          toast.error(translated);
          goToStep(3);
          handled = true;
        }

        if (newErrors.email || newErrors.phone || newErrors.phone_academy || newErrors.username || newErrors.academy_name) {
          const errKey = newErrors.email ? 'email' : (newErrors.phone ? 'phone' : (newErrors.phone_academy ? 'phone_academy' : 'username'));
          const msg = newErrors[errKey];
          toast.error(msg || 'يرجى مراجعة الحقول المدخلة');
          goToStep(2);
          handled = true;
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

        {/* Back Button */}
        {currentStep > 1 && (
          <div className="w-full max-w-xl flex justify-start mb-6">
            <button
              onClick={() => goToStep(currentStep - 1)}
              className="flex items-center gap-2 text-sm font-bold text-[#434655] hover:text-[#004ac6] transition-all bg-white py-2.5 px-4 rounded-xl border border-slate-200 hover:border-[#004ac6]/30 shadow-sm hover:shadow-md active:scale-95 duration-200 group"
            >
              <span className="material-symbols-outlined transition-transform duration-200 group-hover:translate-x-1 select-none">
                arrow_forward
              </span>
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
              {/* 3 Circular Country Selectors */}
              <div className="flex justify-center items-center gap-6 sm:gap-10 py-4">
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
                      className="flex flex-col items-center gap-3 group transition-all duration-300 focus:outline-none"
                    >
                      <div
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-4 overflow-hidden transition-all duration-300 shadow-sm relative ${
                          isSelected
                            ? 'border-[#004ac6] bg-[#eef4ff] scale-105 shadow-md shadow-[#004ac6]/15'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:scale-102 hover:shadow-md'
                        }`}
                      >
                        {country.flagUrl ? (
                          <img
                            src={id === 'KW' ? country.flagUrl : country.flagUrl.replace('/w40/', '/w80/')}
                            alt={label}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-slate-100 shadow-inner"
                          />
                        ) : (
                          <span className="text-3xl sm:text-4xl">{country.flagEmoji}</span>
                        )}
                        <div className={`absolute inset-0 rounded-full bg-[#004ac6]/5 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      </div>
                      <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-[#004ac6]' : 'text-[#434655] group-hover:text-[#111827]'}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Additional optional inputs if missing */}
              <div className="space-y-4 pt-2">
                {/* Email Input */}
                <div className="relative group">
                  {fieldErrors.email && (
                    <div className="absolute -top-10 right-0 z-20 hidden group-hover:flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in zoom-in-95 pointer-events-none">
                      <span className="material-symbols-outlined text-sm">error</span>
                      <span>{fieldErrors.email}</span>
                      <div className="absolute -bottom-1 right-4 w-2 h-2 bg-red-600 rotate-45"></div>
                    </div>
                  )}
                  <label className="block text-xs font-bold text-gray-700 mb-1 text-right">البريد الإلكتروني الأساسي</label>
                  <input
                    type="email"
                    value={email}
                    title={fieldErrors.email || ''}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                    }}
                    placeholder="admin@academy.com"
                    className={`w-full p-4 border rounded-xl bg-white focus:outline-none text-sm font-medium text-[#111827] transition-all ${
                      fieldErrors.email ? 'border-red-500 bg-red-50/20 focus:border-red-500' : 'border-slate-300 focus:border-[#004ac6]'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-red-500 text-xs font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Academy Name Input */}
                <div className="relative group">
                  {(fieldErrors.username || fieldErrors.academy_name) && (
                    <div className="absolute -top-10 right-0 z-20 hidden group-hover:flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in zoom-in-95 pointer-events-none">
                      <span className="material-symbols-outlined text-sm">error</span>
                      <span>{fieldErrors.username || fieldErrors.academy_name}</span>
                      <div className="absolute -bottom-1 right-4 w-2 h-2 bg-red-600 rotate-45"></div>
                    </div>
                  )}
                  <label className="block text-xs font-bold text-gray-700 mb-1 text-right">اسم الأكاديمية / المنصة</label>
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
                      <span className="material-symbols-outlined text-sm">error</span>
                      {fieldErrors.username || fieldErrors.academy_name}
                    </p>
                  )}
                </div>

                {/* Phone Input */}
                <div className="relative group">
                  {(fieldErrors.phone || fieldErrors.phone_academy) && (
                    <div className="absolute -top-10 right-0 z-20 hidden group-hover:flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in zoom-in-95 pointer-events-none">
                      <span className="material-symbols-outlined text-sm">error</span>
                      <span>{fieldErrors.phone || fieldErrors.phone_academy}</span>
                      <div className="absolute -bottom-1 right-4 w-2 h-2 bg-red-600 rotate-45"></div>
                    </div>
                  )}
                  <label className="block text-xs font-bold text-gray-700 mb-1 text-right">رقم الجوال الأساسي</label>
                  <input
                    type="text"
                    value={phone}
                    title={fieldErrors.phone || fieldErrors.phone_academy || ''}
                    onChange={e => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      if (fieldErrors.phone || fieldErrors.phone_academy) {
                        setFieldErrors(prev => ({ ...prev, phone: '', phone_academy: '' }));
                      }
                    }}
                    placeholder="أدخل رقم الجوال"
                    dir="ltr"
                    className={`w-full p-4 border rounded-xl bg-white focus:outline-none text-sm font-medium text-left text-[#111827] transition-all ${
                      fieldErrors.phone || fieldErrors.phone_academy ? 'border-red-500 bg-red-50/20 focus:border-red-500' : 'border-slate-300 focus:border-[#004ac6]'
                    }`}
                  />
                  {(fieldErrors.phone || fieldErrors.phone_academy) && (
                    <p className="mt-1 text-red-500 text-xs font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {fieldErrors.phone || fieldErrors.phone_academy}
                    </p>
                  )}
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
                {(fieldErrors.link_academy || domainError) && (
                  <div className="absolute -top-10 right-0 z-20 hidden group-hover:flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in zoom-in-95 pointer-events-none">
                    <span className="material-symbols-outlined text-sm">error</span>
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
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    صيغة الدومين متاحة للاستخدام
                  </div>
                )}
                {(domainError || fieldErrors.link_academy) && (
                  <div className="mt-2 text-red-500 text-xs font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
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
