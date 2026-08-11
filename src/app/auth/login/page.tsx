'use client';

import React from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { PhoneInput } from '@/components/CountrySelector';
import { useLoginState } from '@/hooks/useLoginState';

export default function AcademyLoginPage() {
    const {
        router,
        isLoading,
        showPassword,
        setShowPassword,
        loginMethod,
        selectedCountry,
        formData,
        generalError,
        errors,
        passwordCriteria,
        handleChange,
        handleLogin,
        toggleLoginMethod
    } = useLoginState();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative font-sans overflow-hidden " dir="rtl">
            <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
                <div className="bg-white p-10 sm:p-14 lg:p-16 rounded-[48px] shadow-2xl shadow-blue-900/5 border border-gray-100 backdrop-blur-sm">
                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200 mx-auto transform hover:rotate-6 transition-transform duration-300">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6.5"></path></svg>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">مرحبا بعودتك!</h1>
                        <p className="text-gray-500 text-lg sm:text-xl font-bold">سجل دخولك لمتابعة رحلتك التعليمية</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        {generalError && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-black flex items-center gap-3 shadow-sm animate-pulse">
                                <AlertCircle size={20} className="text-red-500 shrink-0" />
                                <span>{generalError}</span>
                            </div>
                        )}

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
                                            className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-[24px] focus:bg-white outline-none transition-all duration-300 font-bold text-gray-900 shadow-sm ${errors.email ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-transparent focus:border-blue-500'}`}
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
                                        className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-[24px] focus:bg-white outline-none transition-all duration-300 font-bold text-gray-900 shadow-sm ${errors.password ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-transparent focus:border-blue-500'}`}
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
                                <button 
                                    type="button" 
                                    onClick={() => router.push('/auth/forget-password')}
                                    className="text-sm font-bold text-gray-500 hover:text-blue-600 hover:underline transition-all"
                                >
                                    نسيت كلمة المرور؟
                                </button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>جاري المعالجة...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>تسجيل الدخول</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center pt-4">
                            <p className="text-gray-500 font-bold">
                                ليس لديك حساب؟{' '}
                                <button
                                    type="button"
                                    onClick={() => router.push('/auth/register')}
                                    className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                >
                                    أنشئ حساباً جديداً كطالب
                                </button>
                            </p>
                        </div>
                    </form>


                </div>
            </div>
        </div>
    );
}
