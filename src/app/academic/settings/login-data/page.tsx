'use client';

import React, { useState, useEffect } from 'react';
import {
    Mail, Lock, KeyRound, Eye, EyeOff, Loader2,
    CheckCircle2, AlertCircle, ShieldCheck, X, ArrowRight, Send, RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { fetchAcademyProfile, updateProfileEmail, sendPasswordResetOtp, confirmPasswordReset } from '@/services/login-data';
import type {
    ResetPasswordStep, ResetPasswordModalProps,
    PasswordCriteria, ResetPasswordFormErrors,
} from '@/types/login-data';

// ─── Reset Password Modal ─────────────────────────────────────────────────────

function ResetPasswordModal({ isOpen, onClose, prefillEmail }: ResetPasswordModalProps) {
    const [step, setStep] = useState<ResetPasswordStep>('send-otp');
    const [email, setEmail] = useState(prefillEmail ?? '');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [errors, setErrors] = useState<ResetPasswordFormErrors>({ code: '', password: '', confirmPassword: '' });
    const [criteria, setCriteria] = useState<PasswordCriteria>({ length: false, number: false, special: false });

    // Sync prefill email
    useEffect(() => { if (prefillEmail) setEmail(prefillEmail); }, [prefillEmail]);

    // Reset state on open
    useEffect(() => {
        if (!isOpen) return;
        setStep('send-otp');
        setCode(''); setPassword(''); setConfirmPassword('');
        setOtpError(''); setGeneralError('');
        setErrors({ code: '', password: '', confirmPassword: '' });
        setCriteria({ length: false, number: false, special: false });
    }, [isOpen]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setOtpError('يرجى إدخال بريد إلكتروني صالح');
            return;
        }
        setOtpLoading(true);
        setOtpError('');
        try {
            await sendPasswordResetOtp({ email });
            toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
            setStep('reset-form');
        } catch (err: any) {
            const msg = err?.message ?? err?.error ?? 'حدث خطأ أثناء إرسال الرمز';
            setOtpError(msg);
            toast.error(msg);
        } finally {
            setOtpLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        setErrors((prev) => ({ ...prev, password: '' }));
        setCriteria({
            length: val.length >= 8,
            number: /[0-9]/.test(val),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(val),
        });
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const next: ResetPasswordFormErrors = { code: '', password: '', confirmPassword: '' };
        if (!code || code.length < 4) next.code = 'يرجى إدخال رمز التحقق';
        if (!password || password.length < 8) next.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        if (password !== confirmPassword) next.confirmPassword = 'كلمات المرور غير متطابقة';
        setErrors(next);
        if (Object.values(next).some(Boolean)) return;

        setResetLoading(true);
        setGeneralError('');
        try {
            await confirmPasswordReset({ email, code, token: code, otp: code, password, password_confirmation: confirmPassword });
            toast.success('تم تغيير كلمة المرور بنجاح!', { duration: 4000 });
            onClose();
        } catch (err: any) {
            let msg = err?.message ?? err?.error ?? 'حدث خطأ أثناء تغيير كلمة المرور';
            if (msg.toLowerCase().includes('invalid code') || msg.toLowerCase().includes('invalid token')) {
                msg = 'رمز التحقق غير صحيح أو منتهي الصلاحية';
                setErrors((prev) => ({ ...prev, code: msg }));
            }
            setGeneralError(msg);
            toast.error(msg);
        } finally {
            setResetLoading(false);
        }
    };

    if (!isOpen) return null;

    // ── UI ────────────────────────────────────────────────────────────────────

    const strengthItems = [
        { ok: criteria.length, label: '8 أحرف' },
        { ok: criteria.number, label: 'رقم واحد' },
        { ok: criteria.special, label: 'رمز خاص' },
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" dir="rtl">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-l from-blue-600 to-blue-700 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <ShieldCheck size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white">تغيير كلمة المرور</h2>
                            <p className="text-blue-100 text-xs font-medium">
                                {step === 'send-otp' ? 'الخطوة 1 من 2: إرسال رمز التحقق' : 'الخطوة 2 من 2: تعيين كلمة المرور'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                        <X size={20} className="text-white" />
                    </button>
                </div>

                {/* Step indicator */}
                <div className="flex items-center px-6 pt-5 pb-1 gap-3">
                    <div className={`flex items-center gap-2 ${step === 'send-otp' ? 'text-blue-600' : 'text-emerald-500'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2
                            ${step === 'send-otp' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-emerald-500 border-emerald-500 text-white'}`}>
                            {step === 'send-otp' ? '1' : <CheckCircle2 size={14} />}
                        </div>
                        <span className="text-xs font-bold">إرسال الرمز</span>
                    </div>
                    <div className={`flex-1 h-0.5 rounded-full ${step === 'reset-form' ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                    <div className={`flex items-center gap-2 ${step === 'reset-form' ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2
                            ${step === 'reset-form' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                            2
                        </div>
                        <span className="text-xs font-bold">كلمة المرور الجديدة</span>
                    </div>
                </div>

                <div className="p-6 pt-4">
                    {/* ── Step 1: Send OTP ── */}
                    {step === 'send-otp' && (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <p className="text-gray-500 text-sm font-medium">
                                سنرسل رمز التحقق إلى بريدك الإلكتروني لتأكيد هويتك قبل تغيير كلمة المرور.
                            </p>

                            {otpError && (
                                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                                    <AlertCircle size={16} className="shrink-0" />
                                    <span>{otpError}</span>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-gray-700 block">البريد الإلكتروني</label>
                                <div className="relative">
                                    <input
                                        type="email" value={email} dir="ltr"
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@mail.com"
                                        className="w-full p-4 pl-12 text-right bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-400 focus:bg-white outline-none transition-all font-bold text-gray-800"
                                    />
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <button type="submit" disabled={otpLoading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0">
                                {otpLoading
                                    ? <><Loader2 size={18} className="animate-spin" /><span>جاري الإرسال...</span></>
                                    : <><Send size={18} /><span>إرسال رمز التحقق</span></>
                                }
                            </button>
                        </form>
                    )}

                    {/* ── Step 2: Reset Form ── */}
                    {step === 'reset-form' && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            {generalError && (
                                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                                    <AlertCircle size={16} className="shrink-0" /><span>{generalError}</span>
                                </div>
                            )}

                            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                                <CheckCircle2 size={16} className="shrink-0" />
                                <span>تم إرسال الرمز إلى: <span dir="ltr" className="font-black">{email}</span></span>
                            </div>

                            {/* OTP */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-gray-700 block">رمز التحقق (OTP)</label>
                                <div className="relative">
                                    <input
                                        type="text" inputMode="numeric" value={code} maxLength={8}
                                        placeholder="أدخل الرمز المستلم"
                                        onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, code: '' })); }}
                                        className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-gray-900 tracking-widest ${errors.code ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                                    />
                                    <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.code && <p className="text-red-500 text-xs font-bold">{errors.code}</p>}
                            </div>

                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-gray-700 block">كلمة المرور الجديدة</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'} value={password}
                                        onChange={handlePasswordChange} placeholder="••••••••"
                                        className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-gray-900 ${errors.password ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                                    />
                                    <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1 rounded-lg transition-colors">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs font-bold">{errors.password}</p>}

                                {password && (
                                    <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 mt-1.5 flex gap-4 flex-wrap">
                                        {strengthItems.map((c) => (
                                            <div key={c.label} className={`flex items-center gap-1.5 ${c.ok ? 'opacity-100' : 'opacity-50'}`}>
                                                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${c.ok ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                                                    <CheckCircle2 size={8} className="text-white" />
                                                </div>
                                                <span className={`text-[11px] font-black ${c.ok ? 'text-emerald-600' : 'text-gray-400'}`}>{c.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-gray-700 block">تأكيد كلمة المرور</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword}
                                        placeholder="أعد إدخال كلمة المرور"
                                        onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })); }}
                                        className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-gray-900 ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                                    />
                                    <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1 rounded-lg transition-colors">
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs font-bold">{errors.confirmPassword}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <button type="button" onClick={() => setStep('send-otp')}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm">
                                    <RefreshCw size={16} />
                                    إعادة إرسال الرمز
                                </button>
                                <button type="submit" disabled={resetLoading}
                                    className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0">
                                    {resetLoading
                                        ? <><Loader2 size={18} className="animate-spin" /><span>جاري التغيير...</span></>
                                        : <><KeyRound size={18} /><span>تغيير كلمة المرور</span></>
                                    }
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginDataSettingsPage() {
    const [email, setEmail] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isSavingEmail, setIsSavingEmail] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    // Load profile on mount
    useEffect(() => {
        fetchAcademyProfile()
            .then((data) => { if (data?.email) setEmail(data.email); })
            .finally(() => setLoadingProfile(false));
    }, []);

    const handleSaveEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            toast.error('يرجى إدخال بريد إلكتروني صالح');
            return;
        }
        setIsSavingEmail(true);
        try {
            await updateProfileEmail({ email });
            toast.success('تم تحديث البريد الإلكتروني بنجاح!');
        } catch (err: any) {
            toast.error(err?.message ?? 'حدث خطأ أثناء تحديث البريد الإلكتروني');
        } finally {
            setIsSavingEmail(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto pb-12" dir="rtl">

            {/* ── Hero Banner ── */}
            <div className="bg-gradient-to-l from-blue-600 to-[#65CBF9] rounded-[2rem] p-8 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-xl shadow-blue-500/15">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />
                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/15 border-2 border-white/20 backdrop-blur-md flex items-center justify-center">
                        <KeyRound size={32} className="text-white" />
                    </div>
                    <div className="text-white">
                        <h1 className="text-2xl font-black tracking-tight">بيانات تسجيل الدخول</h1>
                        <p className="text-blue-100 font-medium text-sm mt-1">إدارة البريد الإلكتروني وكلمة المرور لحسابك</p>
                    </div>
                </div>
            </div>

            {/* ── Change Email ── */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl"><Mail size={22} /></div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900">تغيير البريد الإلكتروني</h2>
                        <p className="text-gray-400 font-bold text-xs mt-0.5">تحديث بريدك الإلكتروني المرتبط بالحساب</p>
                    </div>
                </div>

                <form onSubmit={handleSaveEmail} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">البريد الإلكتروني</label>
                        {loadingProfile ? (
                            <div className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
                        ) : (
                            <div className="relative">
                                <input
                                    type="email" value={email} dir="ltr" required
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@mail.com"
                                    className="w-full bg-[#EAEFEF] border border-transparent rounded-2xl pl-12 pr-5 py-4 text-gray-800 font-bold text-right focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                                />
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-start">
                        <button type="submit" disabled={isSavingEmail || loadingProfile}
                            className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm">
                            {isSavingEmail && <Loader2 size={16} className="animate-spin" />}
                            <span>حفظ البريد الإلكتروني</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Change Password ── */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-red-50 text-red-500 p-3 rounded-2xl"><Lock size={22} /></div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900">تغيير كلمة المرور</h2>
                        <p className="text-gray-400 font-bold text-xs mt-0.5">تحديث كلمة المرور عبر رمز التحقق المرسل للبريد</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">
                        لتغيير كلمة المرور، سنرسل رمز تحقق (OTP) إلى{' '}
                        {email ? <strong className="text-gray-900" dir="ltr">{email}</strong> : 'بريدك الإلكتروني'}
                        {' '}ثم ستتمكن من إدخال كلمة مرور جديدة.
                    </p>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-right">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="text-sm font-black text-amber-800 mb-1">ملاحظة مهمة</h4>
                                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                    بعد تغيير كلمة المرور بنجاح، ستحتاج إلى تسجيل الدخول من جديد باستخدام كلمة المرور الجديدة.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsResetModalOpen(true)}
                        className="flex items-center gap-4 w-full p-4 bg-[#EAEFEF] hover:bg-gray-100/90 rounded-2xl border border-transparent hover:border-blue-100 transition-all group text-right">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm group-hover:text-blue-600 group-hover:shadow-md transition-all flex-shrink-0">
                            <KeyRound size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-gray-800 text-sm group-hover:text-blue-600 transition-colors">بدء عملية تغيير كلمة المرور</h3>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">انقر هنا لإرسال رمز التحقق وتغيير كلمة المرور</p>
                        </div>
                        <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all flex-shrink-0" />
                    </button>
                </div>
            </div>

            {/* ── Modal ── */}
            <ResetPasswordModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                prefillEmail={email}
            />
        </div>
    );
}
