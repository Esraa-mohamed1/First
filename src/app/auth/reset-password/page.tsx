'use client';

import React, { Suspense } from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useResetPasswordState } from '@/hooks/useResetPasswordState';

function ResetPasswordContent() {
    const {
        router,
        isLoading,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        email,
        setEmail,
        code,
        setCode,
        password,
        confirmPassword,
        setConfirmPassword,
        generalError,
        errors,
        setErrors,
        passwordCriteria,
        handlePasswordChange,
        handleSubmit
    } = useResetPasswordState();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative font-sans overflow-hidden " dir="rtl">
            <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
                <div className="bg-white p-10 sm:p-14 rounded-[40px] shadow-xl border">
                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200 mx-auto transform hover:rotate-6 transition-transform duration-300">
                            <ShieldCheck className="w-12 h-12" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">تعيين كلمة المرور الجديدة</h1>
                        <p className="text-gray-500 font-bold">أدخل رمز التحقق الذي أرسلناه لك وكلمة المرور الجديدة</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {generalError && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-black flex items-center gap-3 shadow-sm animate-pulse">
                                <AlertCircle size={20} className="text-red-500 shrink-0" />
                                <span>{generalError}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Email */}
                            <div className="space-y-1">
                                <label className="block text-right text-xs font-black text-gray-700 px-1">البريد الإلكتروني</label>
                                <div className="relative group opacity-80">
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@mail.com"
                                        className={`w-full p-4 pr-12 text-right bg-gray-100 border-2 rounded-2xl outline-none font-bold text-gray-700 ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs font-bold px-1">{errors.email}</p>}
                            </div>

                            {/* Verification Code */}
                            <div className="space-y-1">
                                <label className="block text-right text-xs font-black text-gray-700 px-1">رمز التحقق (OTP)</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="code"
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value.replace(/\D/g, ''));
                                            if (errors.code) setErrors(prev => ({ ...prev, code: '' }));
                                        }}
                                        maxLength={8}
                                        placeholder="أدخل الرمز المستلم"
                                        className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${errors.code ? 'border-red-500' : 'border-transparent'}`}
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                                </div>
                                {errors.code && <p className="text-red-500 text-xs font-bold px-1">{errors.code}</p>}
                            </div>

                            {/* New Password */}
                            <div className="space-y-1">
                                <label className="block text-right text-xs font-black text-gray-700 px-1">كلمة المرور الجديدة</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs font-bold px-1">{errors.password}</p>}

                                {password && (
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

                            {/* Confirm Password */}
                            <div className="space-y-1">
                                <label className="block text-right text-xs font-black text-gray-700 px-1">تأكيد كلمة المرور</label>
                                <div className="relative group">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                                        }}
                                        placeholder="أعد إدخال كلمة المرور"
                                        className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${errors.confirmPassword ? 'border-red-500' : 'border-transparent'}`}
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs font-bold px-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>جاري إعادة التعيين...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>تحديث كلمة المرور</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/auth/login')}
                                className="w-full py-3 px-6 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                            >
                                إلغاء والعودة لتسجيل الدخول
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
