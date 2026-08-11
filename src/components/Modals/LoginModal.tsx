'use client';

import React from 'react';
import { X, Mail, Lock, Loader2, Eye, EyeOff, Phone, CheckCircle2 } from 'lucide-react';
import { PhoneInput } from '@/components/CountrySelector';
import { useLoginModalState } from '@/hooks/useLoginModalState';

const LoginModal = () => {
    const {
        isOpen,
        view,
        closeModal,
        openModal,
        isLoading,
        showPassword,
        setShowPassword,
        loginMethod,
        formData,
        errors,
        passwordCriteria,
        handleGoogleLogin,
        handleChange,
        handleLogin,
        toggleLoginMethod
    } = useLoginModalState();

    if (!isOpen || view !== 'login') return null;

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
