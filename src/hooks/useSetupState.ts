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
  const [password, setPassword] = useState('');
  const [academyName, setAcademyName] = useState('');
  const [phone, setPhone] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Step 3: Domain state
  const [domainPrefix, setDomainPrefix] = useState('');
  const [domainError, setDomainError] = useState<string | null>(null);
  const domainSuffix = '.darab.academy';

  const focusErrorInput = (keys: string[]) => {
    if (typeof document === 'undefined') return;
    setTimeout(() => {
      for (const key of keys) {
        let el: HTMLInputElement | null = null;
        if (key === 'email') {
          el = document.querySelector('input[name="email"], input[type="email"]') as HTMLInputElement;
        } else if (key === 'password') {
          el = document.querySelector('input[name="password"], input[type="password"]') as HTMLInputElement;
        } else if (key === 'phone' || key === 'phone_academy') {
          el = document.querySelector('input[name="phone"], input[type="tel"]') as HTMLInputElement;
        } else if (key === 'username' || key === 'academy_name') {
          el = document.querySelector('input[name="academy_name"], input[placeholder*="أكاديميتك"]') as HTMLInputElement;
        } else if (key === 'link_academy' || key === 'domainPrefix') {
          el = document.querySelector('input[name="domain_prefix"], input[placeholder*="منصتك"]') as HTMLInputElement;
        }
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
    }, 150);
  };

  useEffect(() => {
    // Clear any stale tenant key from a previous session.
    localStorage.removeItem('academy_link_name');

    const storedMethod = (localStorage.getItem('registration_method') as 'email' | 'phone') || 'email';
    setRegistrationMethod(storedMethod);

    // Prefill data from registration step
    const cachedAcademyName = localStorage.getItem('user_academy_name') || localStorage.getItem('user_name') || '';
    const cachedPhone = localStorage.getItem('user_phone') || '';
    const cachedEmail = localStorage.getItem('user_email') || '';

    const pendingStr = localStorage.getItem('pending_registration');
    const pending = pendingStr ? JSON.parse(pendingStr) : {};
    const cachedPassword = pending.password || localStorage.getItem('user_password') || '';

    if (cachedAcademyName) setAcademyName(cachedAcademyName);
    if (cachedPhone) setPhone(cachedPhone);
    if (cachedEmail) setEmail(cachedEmail);
    if (cachedPassword) setPassword(cachedPassword);
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
      focusErrorInput(['link_academy', 'domainPrefix']);
      return;
    }
    if (domainError) {
      toast.error('يرجى تصحيح خطأ الرابط');
      focusErrorInput(['link_academy', 'domainPrefix']);
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

      const pendingStr = localStorage.getItem('pending_registration');
      const pending = pendingStr ? JSON.parse(pendingStr) : {};
      const regMethod = registrationMethod || localStorage.getItem('registration_method') || (pending.email || cachedEmail ? 'email' : 'phone');

      const currentPassword = password || pending.password || localStorage.getItem('user_password') || getCookie('backup_password');
      const currentIdentifier = regMethod === 'email' ? finalEmail : finalPhone;

      // 1. Step 1: Must verify createAccount was called for this specific identifier
      const accountCreatedFlag = localStorage.getItem('account_created_successfully');
      const lastCreatedIdentifier = localStorage.getItem('last_created_account_identifier');
      const isAccountAlreadyCreated = accountCreatedFlag === 'true' && lastCreatedIdentifier === currentIdentifier && Boolean(currentIdentifier);

      let token: string | null = null;

      if (!isAccountAlreadyCreated) {
        // Account has NOT been created for currentIdentifier. Clear any stale tokens.
        localStorage.removeItem('token');
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";

        const name = academyName || (regMethod === 'email' ? (finalEmail ? finalEmail.split('@')[0] : '') : finalPhone) || 'أكاديمي';

        const accountPayload: any = {
          name: name,
          academy_name: academyName || `${name}'s Academy`,
          password: currentPassword,
          package_id: pending.package_id
        };

        if (regMethod === 'email') {
          accountPayload.email = finalEmail;
        } else {
          accountPayload.phone = finalPhone;
          accountPayload.country_code = activeCountry?.isoCode || pending.country_code || 'SA';
        }

        try {
          const accountRes: any = await createAccount(accountPayload);
          token = accountRes?.data?.token || accountRes?.token || accountRes?.data?.access_token || accountRes?.access_token || accountRes?.meta?.access_token || accountRes?.data?.meta?.access_token;
          if (token) {
            localStorage.setItem('token', token);
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
          }
          localStorage.setItem('account_created_successfully', 'true');
          localStorage.setItem('last_created_account_identifier', currentIdentifier);
        } catch (accountErr: any) {
          console.warn('createAccount error, checking if user already exists:', accountErr);
          const errMessage = (accountErr?.message || JSON.stringify(accountErr || '')).toLowerCase();
          const emailOrPhoneExists = errMessage.includes('already been taken') || errMessage.includes('already exists') || errMessage.includes('مستخدم بالفعل');

          if (emailOrPhoneExists && currentPassword && (finalEmail || finalPhone)) {
            // Account is already registered! Try logging in to get the token
            try {
              const loginRes = await login({
                email: finalEmail || undefined,
                phone: finalEmail ? undefined : (finalPhone || undefined),
                password: currentPassword
              });
              token = loginRes?.meta?.access_token || (loginRes as any)?.token;
              if (token) {
                localStorage.setItem('token', token);
                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
              }
              localStorage.setItem('account_created_successfully', 'true');
              localStorage.setItem('last_created_account_identifier', currentIdentifier);
            } catch (loginErr) {
              console.error('Failed to login existing account:', loginErr);
              throw accountErr;
            }
          } else {
            throw accountErr;
          }
        }
      } else {
        token = localStorage.getItem('token') || getCookie('token') || null;
      }

      // 2. Step 2: Call createAccountInfoAcademy SECOND with setup info
      const setupPayload: any = {
        username: academyName || (regMethod === 'email' ? (finalEmail ? finalEmail.split('@')[0] : '') : finalPhone) || 'أكاديمي',
        country_code: activeCountry?.isoCode || 'SA',
        specialties: selectedField,
        role: selectedField,
        account_type: selectedField,
        type: selectedField,
        link_academy: fullLink.toLowerCase()
      };

      if (regMethod === 'email') {
        setupPayload.email = finalEmail;
      } else {
        setupPayload.phone_academy = finalPhone;
      }

      const setupResponse = (await createAccountInfoAcademy(setupPayload)) as any;

      // Add success flags upon successful info creation
      localStorage.setItem('account_info_created', 'true');
      localStorage.setItem('account_setup_completed', 'true');
      localStorage.setItem('account_created_successfully', 'true');
      localStorage.setItem('last_created_account_identifier', currentIdentifier);

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

      toast.success('تم إنشاء الحساب وحفظ معلومات الأكاديمية بنجاح');

      // Auto login logic
      const reqPassword = password || localStorage.getItem('user_password') || getCookie('backup_password');
      let loginSuccess = false;

      if (reqPassword && (cachedEmail || finalPhone)) {
        try {
          const loginResponse = await login({
            email: cachedEmail || undefined,
            phone: cachedEmail ? undefined : (finalPhone || undefined),
            password: reqPassword
          });

          if (loginResponse.meta && loginResponse.meta.access_token) {
            const newToken = loginResponse.meta.access_token;
            document.cookie = `token=${newToken}; path=/; max-age=86400; SameSite=Lax`;
            localStorage.setItem('token', newToken);

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

        if (newErrors.email || newErrors.password || newErrors.phone || newErrors.phone_academy || newErrors.username || newErrors.academy_name) {
          const errKey = newErrors.email ? 'email' : (newErrors.password ? 'password' : (newErrors.phone ? 'phone' : (newErrors.phone_academy ? 'phone_academy' : 'username')));
          const msg = newErrors[errKey];
          toast.error(msg || 'يرجى مراجعة البيانات المدخلة');
          goToStep(2);
          focusErrorInput(['email', 'password', 'phone', 'username', 'academy_name']);
          handled = true;
        }

        if (!handled && (newErrors.link_academy || newErrors.domainPrefix)) {
          const translated = newErrors.link_academy || newErrors.domainPrefix;
          setDomainError(translated);
          toast.error(translated);
          goToStep(2);
          focusErrorInput(['link_academy', 'domainPrefix']);
          handled = true;
        }
      }

      if (!handled) {
        let rawMessage = error?.message || (typeof error === 'string' ? error : 'حدث خطأ أثناء حفظ معلومات المنصة');
        if (typeof rawMessage === 'string' && rawMessage.toLowerCase().includes('already been taken')) {
          const translated = 'رابط المنصة أو الحساب مستخدم بالفعل، يرجى اختيار بيانات أخرى.';
          setDomainError(translated);
          toast.error(translated);
          goToStep(2);
          focusErrorInput(['link_academy', 'email']);
        } else if (typeof rawMessage === 'string' && rawMessage.toLowerCase().includes('validation errors detected')) {
          toast.error('يرجى التأكد من ملء الحقول المطلوبة ومراجعة بيانات الحساب ورابط المنصة.');
          goToStep(2);
          focusErrorInput(['email', 'password', 'academy_name', 'link_academy']);
        } else {
          toast.error(translateErrorToArabic(rawMessage));
          goToStep(2);
          focusErrorInput(['email', 'password', 'academy_name', 'link_academy']);
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
    password,
    setPassword,
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
