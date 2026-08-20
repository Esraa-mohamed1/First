import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createAccount, createAccountInfoAcademy, login } from '@/services/auth';
import { useCountry } from '@/hooks/useCountry';
import { triggerPageLoader } from '@/components/PageLoader';
import { Country } from '@/types/country';
import { translateErrorToArabic } from '@/lib/utils';

export function useSetupState() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { countries, selectedCountry, setSelectedCountry } = useCountry();
  const [registrationMethod, setRegistrationMethod] = useState<'email' | 'phone'>('email');

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
    // Clear any stale tenant key from a previous session.
    localStorage.removeItem('academy_link_name');

    // Detect registration method
    const pendingStr = localStorage.getItem('pending_registration');
    const pendingData = pendingStr ? JSON.parse(pendingStr) : null;
    const savedMethod = (localStorage.getItem('registration_method') || pendingData?.contactMethod) as 'email' | 'phone' | null;
    const cachedPhone = pendingData?.phone || localStorage.getItem('user_phone') || '';
    const cachedEmail = pendingData?.email || localStorage.getItem('user_email') || '';

    if (savedMethod === 'phone' || (cachedPhone && !cachedEmail)) {
      setRegistrationMethod('phone');
      setEmail('');
      if (cachedPhone) setPhone(cachedPhone);
    } else if (savedMethod === 'email' || (cachedEmail && !cachedPhone)) {
      setRegistrationMethod('email');
      setPhone('');
      if (cachedEmail) setEmail(cachedEmail);
    } else {
      setRegistrationMethod(savedMethod === 'phone' ? 'phone' : 'email');
    }

    // Prefill data from registration step
    const cachedAcademyName = localStorage.getItem('user_academy_name') || localStorage.getItem('user_name') || '';
    if (cachedAcademyName) setAcademyName(cachedAcademyName);
  }, []);

  const selectCard = (cardIndex: number, field: string) => {
    setSelectedCardIndex(cardIndex);
    setSelectedField(field);
    goToStep(2);
  };

  const validateStep1 = (): boolean => {
    setFieldErrors({});
    const pendingStr = typeof window !== 'undefined' ? localStorage.getItem('pending_registration') : null;
    const pendingData = pendingStr ? JSON.parse(pendingStr) : null;
    const isPhoneReg = registrationMethod === 'phone' || pendingData?.contactMethod === 'phone' || (typeof window !== 'undefined' && localStorage.getItem('registration_method') === 'phone');

    if (isPhoneReg) {
      const currentPhone = phone || pendingData?.phone || localStorage.getItem('user_phone') || '';
      if (!currentPhone) {
        setFieldErrors({ phone: 'يرجى إدخال رقم الجوال' });
        toast.error('يرجى إدخال رقم الجوال');
        return false;
      }
    } else {
      const currentEmail = email || pendingData?.email || localStorage.getItem('user_email') || '';
      if (!currentEmail) {
        setFieldErrors({ email: 'يرجى إدخال البريد الإلكتروني' });
        toast.error('يرجى إدخال البريد الإلكتروني');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(currentEmail)) {
        setFieldErrors({ email: 'البريد الإلكتروني غير صالح' });
        toast.error('البريد الإلكتروني غير صالح');
        return false;
      }
    }
    return true;
  };

  const handleNextStep1 = () => {
    if (validateStep1()) {
      goToStep(2);
    }
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
    // Guard: Final submit ONLY runs on Step 2
    if (currentStep !== 2) {
      handleNextStep1();
      return;
    }

    if (!validateStep1()) {
      goToStep(1);
      return;
    }

    if (!academyName && !localStorage.getItem('user_academy_name')) {
      toast.error('يرجى إدخال اسم الأكاديمية');
      setFieldErrors(prev => ({ ...prev, username: 'يرجى إدخال اسم الأكاديمية', academy_name: 'يرجى إدخال اسم الأكاديمية' }));
      return;
    }

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

      // 1. Call createAccount first
      const pendingStr = localStorage.getItem('pending_registration');
      const pendingData = pendingStr ? JSON.parse(pendingStr) : null;
      const userPassword = localStorage.getItem('user_password') || getCookie('backup_password');

      const isPhoneReg = registrationMethod === 'phone' || pendingData?.contactMethod === 'phone' || (localStorage.getItem('registration_method') === 'phone');

      let finalEmail = '';
      let finalPhone = '';

      if (isPhoneReg) {
        finalPhone = phone || pendingData?.phone || localStorage.getItem('user_phone') || '';
      } else {
        finalEmail = email || pendingData?.email || localStorage.getItem('user_email') || '';
      }

      let existingToken = localStorage.getItem('token');

      if (!existingToken) {
        const accountPayload: any = {
          name: academyName || pendingData?.name || (isPhoneReg ? finalPhone : finalEmail.split('@')[0]),
          academy_name: academyName ? `${academyName}'s Academy` : (pendingData?.academy_name || 'Academy'),
          password: userPassword || pendingData?.password,
          package_id: pendingData?.package_id,
        };

        if (isPhoneReg) {
          accountPayload.phone = finalPhone;
          accountPayload.country_code = activeCountry?.isoCode || pendingData?.country_code || 'EG';
        } else {
          accountPayload.email = finalEmail;
        }

        try {
          const createRes = await createAccount(accountPayload);
          const resObj: any = createRes;
          let token = resObj.data?.token || resObj.token || resObj.data?.access_token || resObj.access_token;
          if (!token && resObj.meta?.access_token) token = resObj.meta.access_token;
          if (!token && resObj.data?.meta?.access_token) token = resObj.data.meta.access_token;
          if (token) {
            existingToken = token;
            localStorage.setItem('token', token);
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
          }
        } catch (createAccErr: any) {
          console.error('Account Creation API Error in Setup:', createAccErr);
          let rawMessage = createAccErr?.message || (typeof createAccErr === 'string' ? createAccErr : 'حدث خطأ أثناء إنشاء الحساب');
          if (createAccErr?.errors && typeof createAccErr.errors === 'object') {
            const errObj = createAccErr.errors as Record<string, string | string[]>;
            const getFirst = (v: string | string[]) => (Array.isArray(v) ? v[0] : v) || '';
            
            if (isPhoneReg && errObj.phone) {
              rawMessage = getFirst(errObj.phone);
            } else if (!isPhoneReg && errObj.email) {
              rawMessage = getFirst(errObj.email);
            } else {
              const allMsgs = Object.values(errObj).map(v => translateErrorToArabic(getFirst(v))).filter(Boolean);
              if (allMsgs.length > 0) rawMessage = allMsgs[0];
            }
          }
          toast.error(translateErrorToArabic(rawMessage) || 'فشل إنشاء الحساب');
          setLoading(false);
          return; // STOP execution
        }
      }

      // 2. Call createAccountInfoAcademy ONLY after createAccount succeeds
      const payload: any = {
        username: academyName || 'أكاديمي',
        country_code: activeCountry?.isoCode || 'EG',
        specialties: selectedField,
        role: selectedField,
        account_type: selectedField,
        type: selectedField,
        link_academy: fullLink.toLowerCase()
      };

      if (isPhoneReg) {
        payload.phone = finalPhone;
        payload.phone_academy = finalPhone || '0500000000';
        if (email && email.trim()) {
          payload.email = email.trim();
        }
      } else {
        payload.email = finalEmail;
        if (finalPhone) {
          payload.phone_academy = finalPhone;
          payload.phone = finalPhone;
        } else {
          payload.phone_academy = '0500000000';
        }
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
      const password = userPassword;
      let loginSuccess = false;

      if (password && (isPhoneReg ? finalPhone : finalEmail)) {
        try {
          const loginResponse = await login({
            email: isPhoneReg ? undefined : (finalEmail || undefined),
            phone: isPhoneReg ? (finalPhone || undefined) : undefined,
            password: password
          });

          if (loginResponse.meta && loginResponse.meta.access_token) {
            const token = loginResponse.meta.access_token;
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
            localStorage.setItem('token', token);

            if (loginResponse.data) {
              localStorage.setItem('user_info', JSON.stringify({
                name: loginResponse.data.name,
                email: loginResponse.data.email || finalEmail,
                phone: loginResponse.data.phone || finalPhone,
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
      localStorage.removeItem('pending_registration');

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
    return '100%';
  };

  return {
    currentStep,
    loading,
    registrationMethod,
    selectedCardIndex,
    activeCountry,
    saudiCountry,
    kuwaitCountry,
    egyptCountry,
    email,
    setEmail,
    academyName,
    setAcademyName,
    phone,
    setPhone,
    fieldErrors,
    setFieldErrors,
    domainPrefix,
    domainError,
    domainSuffix,
    selectCard,
    goToStep,
    handleNextStep1,
    handleCountrySelect,
    handleDomainChange,
    handleSubmit,
    getProgLineWidth
  };
}
