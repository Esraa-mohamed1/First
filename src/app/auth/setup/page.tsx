'use client';

import { Link as LinkIcon, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAccountInfoAcademy } from "@/services/auth";
import toast from "react-hot-toast";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    academy_name: '',
    phone: '',
    country: '',
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
      // Original regex: /^((?!-))(xn--)?[a-zA-Z0-9][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]\.(xn--)?([a-zA-Z0-9-]{1,61}|[a-zA-Z]{2,})$/
      // New logic: Check if the prefix contains ONLY alphanumeric characters
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
    
    if (!formData.academy_name || !formData.phone || !formData.country || !formData.field || !domainPrefix) {
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
      const payload = {
        username: formData.academy_name, // Using academy name as username
        phone_academy: formData.phone,
        email: cachedEmail || undefined,
        phone: cachedPhone || undefined,
        country_code: formData.country === 'saudi' ? 'SA' : formData.country === 'egypt' ? 'EG' : formData.country === 'uae' ? 'AE' : formData.country,
        specialties: formData.field,
        link_academy: fullLink // Use the constructed link
      };

      await createAccountInfoAcademy(payload);
      toast.success('تم حفظ معلومات الأكاديمية بنجاح');
      router.push('/auth/processing');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'حدث خطأ أثناء حفظ المعلومات');
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
              <label className="block text-sm font-bold text-gray-700">رقم جوال اساسي</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="ادخل رقم الجوال"
                className="w-full p-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                dir="ltr"
              />
            </div>

            {/* Country */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-bold text-gray-700">الدولة</label>
              <div className="relative">
                <select 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-500 cursor-pointer transition-all"
                >
                  <option value="">الدولة</option>
                  <option value="saudi">السعودية</option>
                  <option value="egypt">مصر</option>
                  <option value="uae">الإمارات</option>
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
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
