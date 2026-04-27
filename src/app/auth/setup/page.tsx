'use client';

import { Link as LinkIcon, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAccountInfoAcademy, login } from "@/services/auth";
import toast from "react-hot-toast";
import { useCountry } from "@/hooks/useCountry";
import { CountrySelect, PhoneInput } from "@/components/CountrySelector";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { selectedCountry } = useCountry();
  const [formData, setFormData] = useState({
    academy_name: '',
    phone: '',
    field: '',
    link: ''
  });

  const [domainPrefix, setDomainPrefix] = useState('');
  const [domainError, setDomainError] = useState<string | null>(null);
  const domainSuffix = '.darab.academy'; // Static part

  useEffect(() => {
    // Prefill data from registration step
    const cachedAcademyName = localStorage.getItem('user_academy_name');

    setFormData(prev => ({
      ...prev,
      academy_name: cachedAcademyName || prev.academy_name
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomainPrefix(value);

    const fullLink = value + domainSuffix;
    // Regex updated to allow only alphanumeric characters (no hyphens or underscores in the prefix)
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    if (!value) {
      setDomainError(null);
      return;
    }

    if (!alphanumericRegex.test(value)) {
      setDomainError('يجب أن يحتوي الرابط على أحرف وأرقام إنجليزية فقط');
      return;
    }

    // Also validate full structure just in case, but relax the prefix part of the complex regex or just rely on alphanumeric check
    // The complex regex required 2+ chars and specific structure. Let's simplify since we enforce alphanumeric.
    if (value.length < 2) {
      setDomainError('يجب أن يكون الرابط حرفين على الأقل');
    } else {
      setDomainError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.academy_name || !formData.phone || !selectedCountry?.isoCode || !formData.field || !domainPrefix) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (domainError) {
      toast.error('يرجى تصحيح خطأ الرابط');
      return;
    }

    const fullLink = domainPrefix + domainSuffix;

    setLoading(true);

    try {
      // Get cached user info
      const cachedEmail = localStorage.getItem('user_email');
      const cachedPhone = localStorage.getItem('user_phone');

      // Map form data to API payload
      const payload: any = {
        username: formData.academy_name, // Using academy name as username
        phone_academy: formData.phone,
        country_code: selectedCountry?.dialCode?.replace('+', '') || '966', 
        specialties: formData.field,
        link_academy: fullLink // Use the constructed link
      };

      if (cachedEmail) {
        payload.email = cachedEmail;
      } else if (cachedPhone) {
        payload.phone = cachedPhone;
      }

      await createAccountInfoAcademy(payload);

      // Save academy link name to localStorage for subsequent login header
      localStorage.setItem('academy_link_name', fullLink);

      toast.success('تم حفظ معلومات الأكاديمية بنجاح');

      // Auto login
      const password = localStorage.getItem('user_password');
      let loginSuccess = false;

      if (password && (cachedEmail || cachedPhone)) {
        console.log('Attempting auto-login...');
        try {
          const loginResponse = await login({
            email: cachedEmail || undefined,
            phone: cachedPhone || undefined,
            password: password,
            country_code: selectedCountry?.dialCode?.replace('+', '') || '966'
          });
          console.log('Auto-login successful', loginResponse);

          if (loginResponse.meta && loginResponse.meta.access_token) {
            const token = loginResponse.meta.access_token;
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
            localStorage.setItem('token', token);

            if (loginResponse.data) {
              localStorage.setItem('user_info', JSON.stringify({
                name: loginResponse.data.name,
                email: loginResponse.data.email || cachedEmail,
                phone: loginResponse.data.phone || cachedPhone,
                country_code: selectedCountry?.dialCode?.replace('+', '') || '966',
                role: 'الادمن'
              }));
            }
            loginSuccess = true;
          }
        } catch (loginError) {
          console.error('Auto login failed:', loginError);
          toast.error('فشل تسجيل الدخول التلقائي. يرجى تسجيل الدخول يدوياً.');
        }
      } else {
        console.log('Skipping auto-login: Missing credentials', { password: !!password, email: !!cachedEmail, phone: !!cachedPhone });
      }

      // Clear sensitive data
      localStorage.removeItem('user_password');

      const isLocal = window.location.hostname.includes('localhost');
      const defaultSuffix = isLocal ? '.darab.academy.localhost:3000' : '.darab.academy';

      if (!loginSuccess) {
        const tenantSuffix = process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX || defaultSuffix;
        const protocol = window.location.protocol;
        const tenantUrl = `${protocol}//${domainPrefix}${tenantSuffix}/auth/setup`;

        console.log('Auto-login failed. Redirecting to tenant login:', tenantUrl);
        window.location.href = tenantUrl;
        return;
      }

      // Construct tenant URL
      const tenantSuffix = process.env.NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX || defaultSuffix;
      const dashboardPath = process.env.NEXT_PUBLIC_TENANT_DASHBOARD_PATH || '/academic/courses/categories';
      const protocol = window.location.protocol; // http: or https:

      // Get the token we just received
      const token = localStorage.getItem('token');

      const tenantUrl = `${protocol}//${domainPrefix}${tenantSuffix}${dashboardPath}${token ? `?token=${token}` : ''}`;

      console.log('Redirecting to tenant dashboard:', tenantUrl);

      window.location.href = tenantUrl;
    } catch (error: any) {
      console.error(error);

      let handled = false;

      // Handle structured validation errors
      if (error.error && typeof error.error === 'object') {
        const errors = error.error;

        // Specifically handle link_academy error
        if (errors.link_academy) {
          const msg = Array.isArray(errors.link_academy) ? errors.link_academy[0] : errors.link_academy;
          setDomainError(msg);
          toast.error(msg);
          handled = true;
        }

        // Handle other field errors
        Object.keys(errors).forEach(key => {
          if (key !== 'link_academy') {
            const msg = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
            toast.error(msg);
            handled = true;
          }
        });
      }

      if (!handled) {
        toast.error(error.message || 'حدث خطأ أثناء حفظ المعلومات');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black mb-4">معلومات الاكاديمية</h1>
          <p className="text-gray-500 text-lg">أدخل معلومات الأكاديمية الخاصة بك</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Academy Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">أسم الاكاديمية</label>
              <input
                type="text"
                name="academy_name"
                value={formData.academy_name}
                onChange={handleChange}
                placeholder="اسم الاكاديمية"
                className="w-full p-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <PhoneInput
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="ادخل رقم الجوال"
                dir="ltr"
                label="رقم جوال اساسي"
                className="w-full text-left"
              />
            </div>

            {/* Country */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-bold text-gray-700">الدولة</label>
              <CountrySelect className="h-[42px]" />
            </div>

            {/* Field/Category */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-bold text-gray-700">المجال</label>
              <div className="relative">
                <select
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-500 cursor-pointer transition-all"
                >
                  <option value="">ادخل مجال الاكاديمية</option>
                  <option value="educational">تعليمي</option>
                  <option value="training">تدريبي</option>
                  <option value="consulting">استشاري</option>
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Academy Link */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">لينك الاكاديمية</label>
            <div className="relative flex items-center" dir="ltr">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                value={domainPrefix}
                onChange={handleDomainChange}
                placeholder="domain"
                className={`flex-1 p-4 pl-12 border rounded-l-xl border-r-0 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left ${domainError ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              <div className={`p-4 bg-gray-100 border border-l-0 rounded-r-xl text-gray-500 font-medium select-none flex items-center ${domainError ? 'border-red-500' : ''}`}>
                {domainSuffix}
              </div>
            </div>
            {domainError && (
              <p className="text-red-500 text-sm font-bold mt-1 text-left" dir="ltr">{domainError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin ml-2" />
                جاري الحفظ...
              </>
            ) : (
              'بدء استخدام المنصة'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
