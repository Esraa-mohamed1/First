import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createAccountInfoAcademy, login, createAccount } from '@/services/auth';
import { useCountry } from '@/hooks/useCountry';
import { triggerPageLoader } from '@/components/PageLoader';
import { Country } from '@/types/country';
import { translateErrorToArabic } from '@/lib/utils';

export function useSetupState() {
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
  const [registrationMethod, setRegistrationMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [academyName, setAcademyName] = useState('');
  const [phone, setPhone] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Step 3: Domain state
  const [domainPrefix, setDomainPrefix] = useState('');
  const [domainError, setDomainError] = useState<string | null>(null);
  const domainSuffix = '.darab.academy';

  useEffect(() => {
    // Clear any stale tenant key and token from a previous session.
    localStorage.removeItem('academy_link_name');
    localStorage.removeItem('token');

    const storedMethod = (localStorage.getItem('registration_method') as 'email' | 'phone') || 'email';
    setRegistrationMethod(storedMethod);

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

      // 1. Sequential Step 1: Create Account if token is missing
      let token = localStorage.getItem('token');
      if (!token) {
        const pendingStr = localStorage.getItem('pending_registration');
        const pending = pendingStr ? JSON.parse(pendingStr) : {};
        const regMethod = registrationMethod || localStorage.getItem('registration_method') || 'email';
        const name = (regMethod === 'email' ? (finalEmail ? finalEmail.split('@')[0] : '') : finalPhone) || academyName || 'أكاديمي';

        const accountPayload: any = {
          name: name,
          academy_name: academyName || `${name}'s Academy`,
          password: pending.password || localStorage.getItem('user_password') || getCookie('backup_password'),
          package_id: pending.package_id
        };

        if (regMethod === 'email') {
          accountPayload.email = finalEmail;
        } else {
          accountPayload.phone = finalPhone;
          accountPayload.country_code = activeCountry?.isoCode || pending.country_code || 'EG';
        }

        const accountRes: any = await createAccount(accountPayload);
        token = accountRes?.data?.token || accountRes?.token || accountRes?.data?.access_token || accountRes?.access_token || accountRes?.meta?.access_token || accountRes?.data?.meta?.access_token;
        if (token) {
          localStorage.setItem('token', token);
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        }
      }

      // 2. Sequential Step 2: Create Account Info Academy (Only executes if createAccount succeeded)
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
      token = localStorage.getItem('token');

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
          goToStep(2);
          handled = true;
        }

        if (newErrors.email || newErrors.phone || newErrors.phone_academy || newErrors.username || newErrors.academy_name) {
          const errKey = newErrors.email ? 'email' : (newErrors.phone ? 'phone' : (newErrors.phone_academy ? 'phone_academy' : 'username'));
          const msg = newErrors[errKey];
          toast.error(msg || 'يرجى مراجعة البيانات');
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
    selectedCardIndex,
    activeCountry,
    saudiCountry,
    kuwaitCountry,
    egyptCountry,
    registrationMethod,
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
    handleCountrySelect,
    handleDomainChange,
    handleSubmit,
    getProgLineWidth
  };
}
