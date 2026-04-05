'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { login } from '@/services/auth';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { useCountry } from '@/hooks/useCountry';
import { PhoneInput } from '@/components/CountrySelector';

export default function AcademyLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
    const { selectedCountry } = useCountry();
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        password: ''
    });

    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        number: false,
        special: false
    });

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                toast.success('تم تسجيل الدخول بجوجل بنجاح');
                document.cookie = `token=google_simulated_token; path=/; max-age=86400; SameSite=Lax`;
                router.push('/academic');
            } catch (error) {
                toast.error('فشل تسجيل الدخول بجوجل');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            toast.error('فشل الاتصال بحساب جوجل');
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Sanitize phone input and show error if invalid chars
        if (name === 'phone') {
            const hasNonDigits = /\D/.test(value);
            const sanitizedValue = value.replace(/\D/g, '');
            
            setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
            
            // Handle error logic
            if (hasNonDigits) {
                setErrors(prev => ({ ...prev, phone: 'يرجى إدخال أرقام فقط' }));
            } else if (sanitizedValue.length > 0 && sanitizedValue.length < 10) {
                setErrors(prev => ({ ...prev, phone: 'رقم الجوال يجب أن يكون 10 أرقام على الأقل' }));
            } else if (sanitizedValue.length > 15) {
                setErrors(prev => ({ ...prev, phone: 'رقم الجوال طويل جداً' }));
            } else {
                setErrors(prev => ({ ...prev, phone: '' }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (name === 'password') {
            setPasswordCriteria({
                length: value.length >= 8,
                number: /[0-9]/.test(value),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
            });
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', phone: '', password: '' };

        if (loginMethod === 'email') {
            if (!formData.email) {
                newErrors.email = 'يرجى إدخال البريد الإلكتروني';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'البريد الإلكتروني غير صالح';
                isValid = false;
            }
        } else {
            if (!formData.phone) {
                newErrors.phone = 'يرجى إدخال رقم الجوال';
                isValid = false;
            } else if (formData.phone.length < 10) {
                newErrors.phone = 'رقم الجوال يجب أن يكون 10 أرقام على الأقل';
                isValid = false;
            } else if (formData.phone.length > 15) {
                newErrors.phone = 'رقم الجوال طويل جداً';
                isValid = false;
            }
        }

        if (!formData.password) {
            newErrors.password = 'يرجى إدخال كلمة المرور';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const payload = loginMethod === 'email'
                ? { email: formData.email, password: formData.password }
                : { phone: formData.phone, password: formData.password };

            const response = await login(payload);

            if (response.meta && response.meta.access_token) {
                const token = response.meta.access_token;
                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
                localStorage.setItem('token', token);

                if (response.data) {
                    localStorage.setItem('user_info', JSON.stringify({
                        name: response.data.name,
                        email: response.data.email,
                        phone: response.data.phone,
                        role: 'الادمن'
                    }));
                }

                toast.success('تم تسجيل الدخول بنجاح');
                router.push('/academic');
            } else {
                toast.error('فشل تسجيل الدخول: استجابة غير صالحة');
            }
        } catch (error: any) {
            const errorMessage = error.message || error.error || 'حدث خطأ أثناء تسجيل الدخول';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLoginMethod = (e: React.MouseEvent) => {
        e.preventDefault();
        setLoginMethod(prev => prev === 'email' ? 'phone' : 'email');
        setErrors({ email: '', phone: '', password: '' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative font-sans overflow-hidden bg-gray-50/50" dir="rtl">
            <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
                <div className="bg-white p-10 sm:p-14 lg:p-16 rounded-[48px] shadow-2xl shadow-blue-900/5 border border-gray-100 backdrop-blur-sm">
                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200 mx-auto transform hover:rotate-6 transition-transform duration-300">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6.5"></path></svg>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">مرحبا بعودتك!</h1>
                        <p className="text-gray-500 text-lg sm:text-xl font-bold">سجل دخولك لمتابعة إدارة أكاديميتك</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-6">
                            {loginMethod === 'email' ? (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="block text-right text-xs font-black text-gray-700">البريد الإلكتروني</label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="admin@academy.com"
                                            className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-[24px] focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 shadow-sm ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                                        />
                                        <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-blue-600'}`} size={20} />
                                    </div>
                                    <div className="flex items-center justify-between px-1">
                                        {errors.email ? <p className="text-red-500 text-xs font-bold">{errors.email}</p> : <div></div>}
                                        <button 
                                            type="button"
                                            onClick={toggleLoginMethod}
                                            className="text-[11px] font-black text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                                        >
                                            <Phone size={14} strokeWidth={3} /> تسجيل الدخول بالجوال
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="block text-right text-xs font-black text-gray-700">رقم الجوال</label>
                                    </div>
                                    <PhoneInput
                                        name="phone"
                                        label=""
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`p-4 pr-12 text-left bg-gray-50 border-2 rounded-[24px] focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 shadow-sm ${errors.phone ? 'border-red-500' : 'border-transparent'}`}
                                        containerClassName="mb-1"
                                    />
                                    <div className="flex items-center justify-between px-1">
                                        {errors.phone ? <p className="text-red-500 text-xs font-bold">{errors.phone}</p> : <div></div>}
                                        <button 
                                            type="button"
                                            onClick={toggleLoginMethod}
                                            className="text-[11px] font-black text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                                        >
                                            <Mail size={14} strokeWidth={3} /> تسجيل الدخول بالبريد
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="block text-right text-xs font-black text-gray-700 px-1">كلمة المرور</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-[24px] focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 shadow-sm ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                                    />
                                    <Lock className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-blue-600'}`} size={20} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs font-bold mr-1">{errors.password}</p>}
                                
                                {formData.password && (
                                    <div className="bg-[#f0f9ff]/50 p-3 rounded-2xl border border-blue-50 mt-3">
                                        <div className="flex flex-wrap gap-4 items-center justify-start" dir="rtl">
                                            <div className={`flex items-center gap-2 transition-all duration-300 ${passwordCriteria.length ? 'opacity-100' : 'opacity-60'}`}>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${passwordCriteria.length ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                    <CheckCircle2 size={10} className="text-white" />
                                                </div>
                                                <span className={`text-[11px] font-black ${passwordCriteria.length ? 'text-green-600' : 'text-gray-500'}`}>8 أحرف</span>
                                            </div>
                                            <div className={`flex items-center gap-2 transition-all duration-300 ${passwordCriteria.number ? 'opacity-100' : 'opacity-60'}`}>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${passwordCriteria.number ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                    <CheckCircle2 size={10} className="text-white" />
                                                </div>
                                                <span className={`text-[11px] font-black ${passwordCriteria.number ? 'text-green-600' : 'text-gray-500'}`}>رقم واحد</span>
                                            </div>
                                            <div className={`flex items-center gap-2 transition-all duration-300 ${passwordCriteria.special ? 'opacity-100' : 'opacity-60'}`}>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${passwordCriteria.special ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                    <CheckCircle2 size={10} className="text-white" />
                                                </div>
                                                <span className={`text-[11px] font-black ${passwordCriteria.special ? 'text-green-600' : 'text-gray-500'}`}>رمز خاص</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end px-1">
                                <button type="button" className="text-sm font-bold text-gray-500 hover:text-blue-600 hover:underline transition-all">
                                    نسيت كلمة المرور؟
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4.5 bg-blue-600 text-white font-black text-lg rounded-[24px] shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group shadow-blue-500/20"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={22} />
                                        <span>جاري المعالجة...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>تسجيل الدخول</span>
                                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </>
                                )}
                            </button>

                            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                                <button
                                    type="button"
                                    onClick={() => handleGoogleLogin()}
                                    className="w-full py-4.5 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-[24px] hover:border-blue-200 hover:bg-blue-50/30 hover:text-blue-600 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm group"
                                    disabled={isLoading}
                                >
                                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5 shadow-sm group-hover:scale-110 transition-transform" alt="Google" />
                                    <span>الدخول باستخدام جوجل</span>
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-12 text-center text-gray-500 font-bold">
                        <span>ليس لديك حساب؟ </span>
                        <button 
                            onClick={() => router.push('/')}
                            className="text-blue-600 hover:underline font-black"
                        >
                            أنشئ حسابك الآن
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
