'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, User, Phone } from 'lucide-react';
import { createUser } from '@/services/users';
import toast from 'react-hot-toast';
import { useCountry } from '@/hooks/useCountry';
import { PhoneInput } from '@/components/CountrySelector';

export default function StudentRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { selectedCountry } = useCountry();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const sanitizedValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

        if (!formData.name) {
            newErrors.name = 'يرجى إدخال الاسم الكامل';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'يرجى إدخال البريد الإلكتروني';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'البريد الإلكتروني غير صالح';
            isValid = false;
        }

        if (!formData.phone) {
            newErrors.phone = 'يرجى إدخال رقم الجوال';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'يرجى إدخال كلمة المرور';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await createUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: 'student'
            });

            toast.success('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
            router.push('/auth/login');
        } catch (error: any) {
            const errorMessage = error.message || 'حدث خطأ أثناء إنشاء الحساب';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative font-sans overflow-hidden " dir="rtl">
            <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
                <div className="bg-white p-10 sm:p-14 rounded-[40px] shadow-xl border ">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">إنشاء حساب طالب</h1>
                        <p className="text-gray-500 font-bold">ابدأ رحلتك التعليمية معنا اليوم</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-right text-xs font-black text-gray-700 px-1">الاسم الكامل</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="أدخل اسمك الكامل"
                                        className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${errors.name ? 'border-red-500' : 'border-transparent'}`}
                                    />
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs font-bold px-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-right text-xs font-black text-gray-700 px-1">البريد الإلكتروني</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@mail.com"
                                        className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs font-bold px-1">{errors.email}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="block text-right text-xs font-black text-gray-700 px-1">رقم الجوال</label>
                                <PhoneInput
                                    name="phone"
                                    label=""
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`p-4 pr-12 text-left bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${errors.phone ? 'border-red-500' : 'border-transparent'}`}
                                />
                                {errors.phone && <p className="text-red-500 text-xs font-bold px-1">{errors.phone}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-right text-xs font-black text-gray-700 px-1">كلمة المرور</label>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs font-bold px-1">{errors.password}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-right text-xs font-black text-gray-700 px-1">تأكيد كلمة المرور</label>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${errors.confirmPassword ? 'border-red-500' : 'border-transparent'}`}
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs font-bold px-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed text-lg shadow-lg shadow-blue-100"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    إنشاء الحساب
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform rotate-180" size={24} />
                                </>
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <p className="text-gray-500 font-bold text-sm">
                                لديك حساب بالفعل؟{' '}
                                <button
                                    type="button"
                                    onClick={() => router.push('/auth/login')}
                                    className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                >
                                    تسجيل الدخول
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
