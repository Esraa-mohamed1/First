'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { login } from '@/services/auth';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';

export default function AcademyLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Google Login Success:', tokenResponse);
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
            console.error('Google Login Error');
            toast.error('فشل الاتصال بحساب جوجل. تأكد من إعداد "Redirect URI" في لوحة تحكم جوجل');
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('يرجى ملء جميع الحقول');
            return;
        }

        setIsLoading(true);
        try {
            const response = await login(formData);

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
            console.error('Login error:', error);
            const errorMessage = error.message || error.error || 'حدث خطأ أثناء تسجيل الدخول';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative  font-sans overflow-hidden" dir="rtl">

            <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
                <div className="bg-white p-10 sm:p-14 lg:p-16 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 backdrop-blur-sm">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-200 mx-auto">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6.5"></path></svg>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">مرحباً بعودتك!</h1>
                        <p className="text-gray-500 font-bold mt-2 text-sm">سجل دخولك لمتابعة إدارة أكاديميتك</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block text-right text-sm font-bold text-gray-700 mb-2 px-1 relative inline-block transition-transform group-focus-within:-translate-y-1 group-focus-within:text-blue-600">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="admin@academy.com"
                                        className="w-full p-4 pr-12 text-right bg-gray-50/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-blue-500 hover:bg-gray-50 outline-none transition-all duration-300 font-bold text-gray-900 shadow-sm focus:shadow-md focus:shadow-blue-100"
                                        required
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="group">
                                <label className="block text-right text-sm font-bold text-gray-700 mb-2 px-1 relative inline-block transition-transform group-focus-within:-translate-y-1 group-focus-within:text-blue-600">
                                    كلمة المرور
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full p-4 pr-12 text-right bg-gray-50/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-blue-500 hover:bg-gray-50 outline-none transition-all duration-300 font-bold text-gray-900 shadow-sm focus:shadow-md focus:shadow-blue-100 placeholder:tracking-widest"
                                        required
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all hover:-translate-x-1 duration-300">
                                نسيت كلمة المرور؟
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 text-white font-black text-lg rounded-[20px] shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 group"
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
                                    className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-[20px] hover:border-blue-100 hover:bg-blue-50/30 hover:text-blue-600 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm"
                                    disabled={isLoading}
                                >
                                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5 drop-shadow-sm" alt="Google" />
                                    <span>الدخول باستخدام جوجل</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>


            </div>


        </div>
    );
}
