'use client';

import React, { Suspense } from 'react';
import { Mail, Phone, Loader2, ArrowRight, AlertCircle, KeyRound, LockOpen } from 'lucide-react';
import { useForgetPasswordState } from '@/hooks/useForgetPasswordState';

function ForgetPasswordContent() {
    const {
        router,
        isLoading,
        mode,
        setMode,
        email,
        setEmail,
        phone,
        setPhone,
        error,
        setError,
        otpSent,
        setOtpSent,
        handleSubmit
    } = useForgetPasswordState();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative font-sans overflow-hidden" dir="rtl">
            <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
                <div className="bg-white p-10 sm:p-14 rounded-[40px] shadow-xl border">
                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200 mx-auto transform hover:rotate-6 transition-transform duration-300">
                            <KeyRound className="w-12 h-12" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">استعادة كلمة المرور</h1>
                        <p className="text-gray-500 font-bold">
                            {mode === 'email'
                                ? 'أدخل بريدك الإلكتروني للحصول على رمز إعادة التعيين'
                                : 'أدخل رقم جوالك للحصول على رمز إعادة التعيين'}
                        </p>
                    </div>

                    {/* Mode toggle tabs */}
                    {!otpSent && (
                        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
                            <button
                                type="button"
                                onClick={() => { setMode('email'); setError(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-black rounded-xl transition-all duration-200 cursor-pointer ${mode === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Mail size={16} />
                                <span>البريد الإلكتروني</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode('phone'); setError(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-black rounded-xl transition-all duration-200 cursor-pointer ${mode === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Phone size={16} />
                                <span>رقم الجوال</span>
                            </button>
                        </div>
                    )}

                    {/* OTP sent notice */}
                    {otpSent && (
                        <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black flex items-center gap-3">
                            <LockOpen size={20} className="text-emerald-500 shrink-0" />
                            <span>
                                تم إرسال رمز التحقق إلى {mode === 'email' ? `البريد: ${email}` : `الجوال: ${phone}`}. انتقل لصفحة إعادة التعيين لإدخال الرمز.
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-black flex items-center gap-3 shadow-sm">
                                <AlertCircle size={20} className="text-red-500 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            {mode === 'email' ? (
                                <>
                                    <label className="block text-right text-xs font-black text-gray-700 px-1">البريد الإلكتروني</label>
                                    <div className={`relative group ${otpSent ? 'opacity-60' : ''}`}>
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            disabled={otpSent}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError('');
                                            }}
                                            placeholder="example@mail.com"
                                            className={`w-full p-4 pr-12 text-right border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${error ? 'border-red-500 bg-red-50' : 'bg-gray-50 border-transparent'} ${otpSent ? 'cursor-not-allowed' : ''}`}
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <label className="block text-right text-xs font-black text-gray-700 px-1">رقم الجوال</label>
                                    <div className={`relative group ${otpSent ? 'opacity-60' : ''}`}>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={phone}
                                            disabled={otpSent}
                                            onChange={(e) => {
                                                setPhone(e.target.value.replace(/[^0-9+\- ]/, ''));
                                                if (error) setError('');
                                            }}
                                            placeholder="+966 5xx xxx xxxx"
                                            dir="ltr"
                                            className={`w-full p-4 pr-12 text-left border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${error ? 'border-red-500 bg-red-50' : 'bg-gray-50 border-transparent'} ${otpSent ? 'cursor-not-allowed' : ''}`}
                                        />
                                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || otpSent}
                                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>جاري الإرسال...</span>
                                    </>
                                ) : otpSent ? (
                                    <>
                                        <LockOpen size={20} />
                                        <span>تم الإرسال</span>
                                    </>
                                ) : (
                                    <>
                                        <span>إرسال رمز التحقق</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </>
                                )}
                            </button>

                            {otpSent && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const query = mode === 'email'
                                            ? `email=${encodeURIComponent(email)}`
                                            : `phone=${encodeURIComponent(phone)}`;
                                        router.push(`/auth/reset-password?${query}`);
                                    }}
                                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <ArrowRight size={18} />
                                    <span>الذهاب لإعادة التعيين</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => router.push('/auth/login')}
                                className="w-full py-3 px-6 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                            >
                                العودة لتسجيل الدخول
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ForgetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>}>
            <ForgetPasswordContent />
        </Suspense>
    );
}
