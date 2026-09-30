'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { superAdminLogin } from '@/services/auth';
import { persistAuthToken, getStoredAuthToken } from '@/lib/auth-storage';
import toast from 'react-hot-toast';

export default function SuperAdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [generalError, setGeneralError] = useState('');

    // If already authenticated as superadmin, redirect to /dashboard
    useEffect(() => {
        const token = getStoredAuthToken();
        if (token) {
            try {
                const userInfoStr = localStorage.getItem('user_info');
                if (userInfoStr) {
                    const parsed = JSON.parse(userInfoStr);
                    const role = String(parsed?.role || '').toLowerCase().trim();
                    if (role === 'superadmin' || role === 'admin' || role === 'الادمن') {
                        router.replace('/dashboard');
                    }
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (generalError) setGeneralError('');
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        if (!formData.email.trim()) {
            newErrors.email = 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'يرجى إدخال كلمة المرور';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setGeneralError('');

        try {
            const payload = {
                email: formData.email.trim(),
                password: formData.password,
            };

            const response = await superAdminLogin(payload);
            const res = response as any;
            const token =
                res?.meta?.access_token ||
                res?.token ||
                res?.access_token ||
                res?.data?.token ||
                res?.data?.access_token;

            if (token) {
                persistAuthToken(token);

                const user = res?.data?.user || res?.data || res?.user || {};
                const userInfo = {
                    name: user.name || 'Super Admin',
                    email: user.email || formData.email,
                    phone: user.phone || '',
                    role: 'superadmin',
                };
                localStorage.setItem('user_info', JSON.stringify(userInfo));

                toast.success('تم تسجيل الدخول بنجاح');
                window.location.href = '/dashboard';
            } else {
                const msg = 'فشل تسجيل الدخول: استجابة غير صالحة من الخادم';
                setGeneralError(msg);
                toast.error(msg);
            }
        } catch (error: any) {
            console.error('Super Admin Login Error:', error);
            let errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                error?.error ||
                'حدث خطأ أثناء تسجيل الدخول';

            if (error?.errors && typeof error.errors === 'object') {
                const firstKey = Object.keys(error.errors)[0];
                const firstVal = error.errors[firstKey];
                if (firstVal) {
                    errorMessage = Array.isArray(firstVal) ? firstVal[0] : firstVal;
                }
            }

            if (
                errorMessage === 'Invalid credentials' ||
                errorMessage === 'Unauthorized' ||
                errorMessage.toLowerCase().includes('credential') ||
                errorMessage.toLowerCase().includes('unauthorized')
            ) {
                errorMessage = 'بيانات الدخول غير صحيحة (البريد الإلكتروني أو كلمة المرور غير صحيحة)';
            } else if (errorMessage.toLowerCase().includes('network error')) {
                errorMessage = 'حدث خطأ في الاتصال، يرجى التحقق من اتصال الإنترنت';
            }

            setGeneralError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 relative font-sans bg-[#0f172a] overflow-hidden"
            dir="rtl"
        >
            {/* Background Glow Accents */}
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
                <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-[36px] shadow-2xl shadow-black/40 border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 mx-auto transform hover:rotate-6 transition-transform duration-300">
                            <ShieldCheck size={40} />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                            لوحة تحكم المنصة
                        </h1>
                        <p className="text-gray-500 font-bold text-sm sm:text-base">
                            تسجيل الدخول المخصص للإدارة العليا (Super Admin)
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {generalError && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-black flex items-center gap-3 shadow-sm animate-pulse">
                                <AlertCircle size={20} className="text-red-500 shrink-0" />
                                <span>{generalError}</span>
                            </div>
                        )}

                        {/* Email / Username Input */}
                        <div className="space-y-1.5">
                            <label className="block text-right text-xs font-black text-gray-700 px-1">
                                البريد الإلكتروني أو اسم المستخدم
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@darab.academy"
                                    className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white outline-none transition-all duration-300 font-bold text-gray-900 shadow-sm ${
                                        errors.email
                                            ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                            : 'border-transparent focus:border-blue-500'
                                    }`}
                                />
                                <Mail
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                                        errors.email
                                            ? 'text-red-500'
                                            : 'text-gray-400 group-focus-within:text-blue-600'
                                    }`}
                                    size={20}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs font-bold mr-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="block text-right text-xs font-black text-gray-700 px-1">
                                كلمة المرور
                            </label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white outline-none transition-all duration-300 font-bold text-gray-900 shadow-sm ${
                                        errors.password
                                            ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                            : 'border-transparent focus:border-blue-500'
                                    }`}
                                />
                                <Lock
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                                        errors.password
                                            ? 'text-red-500'
                                            : 'text-gray-400 group-focus-within:text-blue-600'
                                    }`}
                                    size={20}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs font-bold mr-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>جاري تسجيل الدخول...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>تسجيل الدخول للإدارة</span>
                                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
