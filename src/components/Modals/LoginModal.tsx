'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, Loader2, Eye, EyeOff, Phone, CheckCircle2 } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { login } from '@/services/auth';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { useCountry } from '@/hooks/useCountry';
import { PhoneInput } from '@/components/CountrySelector';

const LoginModal = () => {
    const { isOpen, view, closeModal, openModal } = useModal();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
    const { selectedCountry } = useCountry();

    // Form State
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

    // Password validation state
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        number: false,
        special: false
    });

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Google Login Success:', tokenResponse);
            setIsLoading(true);
            try {
                toast.success('تم تسجيل الدخول بجوجل بنجاح');
                document.cookie = `token=google_simulated_token; path=/; max-age=86400; SameSite=Lax`;
                closeModal();
                router.push('/dashboard');
            } catch (error) {
                toast.error('فشل تسجيل الدخول بجوجل');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            console.error('Google Login Error');
            toast.error('فشل الاتصال بحساب جوجل. تأكد من إعداد "Redirect URI" في لوحة تحكم جوجل');
        },
    });

    if (!isOpen || view !== 'login') return null;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
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
            // Clear errors
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Live password validation
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

    const handleLogin = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const payload = loginMethod === 'email' 
                ? { email: formData.email, password: formData.password }
                : { 
                    phone: formData.phone, 
                    password: formData.password,
                    country_code: selectedCountry?.dialCode?.replace('+', '') || '966'
                  };
                
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
                        country_code: selectedCountry?.dialCode?.replace('+', '') || '966',
                        role: 'الادمن'
                    }));
                }
                
                toast.success('تم تسجيل الدخول بنجاح');
                closeModal();
                router.push('/academic');
            } else {
                toast.error('فشل تسجيل الدخول: استجابة غير صالحة');
            }
        } catch (error: any) {
            console.error('Login error:', error);
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-transparent backdrop-blur-md">
            {/* Invisible but clickable backdrop overlay to close */}
            <div className="absolute inset-0" onClick={closeModal}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[420px] md:max-w-[480px] bg-white rounded-[40px] shadow-2xl overflow-hidden animate-on-scroll reveal transform scale-100 border border-gray-100">
                <button
                    onClick={closeModal}
                    className="absolute top-6 left-6 text-[#6b7280] hover:text-[#1a1a1a] transition-colors p-2 z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-8 pt-12 md:p-10 md:pt-16">
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-[#1a1a1a]">تسجيل الدخول</h2>
                            <p className="text-[#6b7280] font-bold mt-2">مرحباً بك مجدداً</p>
                        </div>
                        
                        <div className="space-y-5">
                            {loginMethod === 'email' ? (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="block text-right text-xs font-bold text-[#4a4a4a]">البريد الإلكتروني</label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="example@mail.com"
                                            className={`w-full p-3.5 pr-11 text-right bg-[#f8faff] border rounded-2xl focus:bg-white focus:border-[#2563eb] outline-none transition-all font-bold text-sm ${errors.email ? 'border-red-500' : 'border-[#e2e8f0]'}`}
                                        />
                                        <Mail className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-[#2563eb]/60 group-focus-within:text-[#2563eb]'}`} size={18} />
                                    </div>
                                    <div className="flex items-center justify-between px-1">
                                        {errors.email ? <p className="text-red-500 text-[10px] font-bold">{errors.email}</p> : <div></div>}
                                        <button 
                                            type="button"
                                            onClick={toggleLoginMethod}
                                            className="text-[11px] font-black text-[#2563eb] hover:underline flex items-center gap-1 mt-0.5"
                                        >
                                            <Phone size={12} strokeWidth={3} /> تسجيل الدخول بالجوال
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="block text-right text-xs font-bold text-[#4a4a4a]">رقم الجوال</label>
                                    </div>
                                    <PhoneInput
                                        name="phone"
                                        label=""
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full p-3.5 pr-11 text-left bg-[#f8faff] border rounded-2xl focus:bg-white focus:border-[#2563eb] outline-none transition-all font-bold text-sm ${errors.phone ? 'border-red-500' : 'border-[#e2e8f0]'}`}
                                        containerClassName="mb-0"
                                    />
                                    <div className="flex items-center justify-between px-1">
                                        {errors.phone ? <p className="text-red-500 text-[10px] font-bold">{errors.phone}</p> : <div></div>}
                                        <button 
                                            type="button"
                                            onClick={toggleLoginMethod}
                                            className="text-[11px] font-black text-[#2563eb] hover:underline flex items-center gap-1 mt-0.5"
                                        >
                                            <Mail size={12} strokeWidth={3} /> تسجيل الدخول بالبريد
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="block text-right text-xs font-bold text-[#4a4a4a] px-1">كلمة المرور</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full p-3.5 pr-11 text-right bg-[#f8faff] border rounded-2xl focus:bg-white focus:border-[#2563eb] outline-none transition-all font-bold text-sm ${errors.password ? 'border-red-500' : 'border-[#e2e8f0]'}`}
                                    />
                                    <Lock className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-[#2563eb]/60 group-focus-within:text-[#2563eb]'}`} size={18} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2563eb] transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[10px] font-bold mr-1">{errors.password}</p>}
                                
                                {formData.password && (
                                    <div className="bg-[#f0f9ff]/50 p-2.5 rounded-xl border border-blue-50 mt-2">
                                        <div className="flex flex-wrap gap-4 items-center justify-start" dir="rtl">
                                            <div className={`flex items-center gap-1.5 transition-all duration-300 ${passwordCriteria.length ? 'opacity-100' : 'opacity-60'}`}>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${passwordCriteria.length ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                    <CheckCircle2 size={10} className="text-white" />
                                                </div>
                                                <span className={`text-[10px] font-black ${passwordCriteria.length ? 'text-green-600' : 'text-gray-500 text-xs'}`}>8 أحرف</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 transition-all duration-300 ${passwordCriteria.number ? 'opacity-100' : 'opacity-60'}`}>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${passwordCriteria.number ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                    <CheckCircle2 size={10} className="text-white" />
                                                </div>
                                                <span className={`text-[10px] font-black ${passwordCriteria.number ? 'text-green-600' : 'text-gray-500'}`}>رقم واحد</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 transition-all duration-300 ${passwordCriteria.special ? 'opacity-100' : 'opacity-60'}`}>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${passwordCriteria.special ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                    <CheckCircle2 size={10} className="text-white" />
                                                </div>
                                                <span className={`text-[10px] font-black ${passwordCriteria.special ? 'text-green-600' : 'text-gray-500'}`}>رمز خاص</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end px-1">
                                <button className="text-xs font-bold text-gray-500 hover:text-[#2563eb] transition-colors hover:underline">
                                    نسيت كلمة المرور؟
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-xl"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    جاري المعالجة...
                                </>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </button>

                        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                            <>
                                <div className="relative flex items-center justify-center py-2">
                                    <div className="flex-grow border-t border-[#e2e8f0]"></div>
                                    <span className="flex-shrink mx-4 text-[10px] text-[#6b7280] font-black uppercase tracking-[0.2em]">أو</span>
                                    <div className="flex-grow border-t border-[#e2e8f0]"></div>
                                </div>

                                <button
                                    onClick={() => handleGoogleLogin()}
                                    className="w-full py-4 bg-white border border-[#e2e8f0] text-[#1a1a1a] font-black rounded-2xl hover:bg-[#f8faff] hover:border-[#2563eb]/20 transition-all flex items-center justify-center gap-3 text-sm shadow-sm group active:scale-95"
                                    disabled={isLoading}
                                >
                                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4 shadow-sm group-hover:scale-110 transition-transform" alt="google" />
                                    تسجيل الدخول عن طريق جوجل
                                </button>
                            </>
                        )}

                        <p className="text-center text-xs font-bold text-[#6b7280] mt-4">
                            ليس لديك حساب؟{' '}
                            <button
                                onClick={() => openModal('registration')}
                                className="text-[#2563eb] hover:underline font-black px-1"
                            >
                                إنشاء حساب جديد
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
