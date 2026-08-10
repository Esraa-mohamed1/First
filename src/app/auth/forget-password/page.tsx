'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Loader2, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { forgetPassword } from '@/services/auth';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function ForgetPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateForm = () => {
        if (!email) {
            setError('يرجى إدخال البريد الإلكتروني');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('البريد الإلكتروني غير صالح');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await forgetPassword({ email });

            await MySwal.fire({
                title: 'تم إرسال رمز التحقق!',
                text: 'تم إرسال رمز تحقق إلى بريدك الإلكتروني لإعادة تعيين كلمة المرور.',
                icon: 'success',
                confirmButtonText: 'حسناً، متابعة',
                confirmButtonColor: '#2563eb'
            });

            router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            console.error('Forget password error:', err);
            let errorMessage = err.message || err.error || 'حدث خطأ أثناء إرسال رمز التحقق';

            if (errorMessage.toLowerCase().includes('user not found') || errorMessage.toLowerCase().includes('email not found') || errorMessage.includes('لا يوجد مستخدم')) {
                errorMessage = 'البريد الإلكتروني المدخل غير مسجل لدينا';
            } else if (errorMessage.toLowerCase().includes('network error')) {
                errorMessage = 'حدث خطأ في الاتصال، يرجى التحقق من الشبكة';
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative font-sans overflow-hidden " dir="rtl">
            <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
                <div className="bg-white p-10 sm:p-14 rounded-[40px] shadow-xl border">
                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200 mx-auto transform hover:rotate-6 transition-transform duration-300">
                            <KeyRound className="w-12 h-12" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">استعادة كلمة المرور</h1>
                        <p className="text-gray-500 font-bold">أدخل بريدك الإلكتروني للحصول على رمز إعادة التعيين</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-black flex items-center gap-3 shadow-sm">
                                <AlertCircle size={20} className="text-red-500 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="block text-right text-xs font-black text-gray-700 px-1">البريد الإلكتروني</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                    placeholder="example@mail.com"
                                    className={`w-full p-4 pr-12 text-right bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 ${error ? 'border-red-500' : 'border-transparent'}`}
                                />
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
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
                                        <span>جاري الإرسال...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>إرسال رمز التحقق</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </>
                                )}
                            </button>

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
