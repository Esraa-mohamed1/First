'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { login } from '@/services/auth';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';

const LoginModal = () => {
    const { isOpen, view, closeModal, openModal } = useModal();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Google Login Success:', tokenResponse);
            setIsLoading(true);
            try {
                // In a real app, you'd send this to your backend:
                // await axios.post('/api/google-login', { token: tokenResponse.access_token });

                toast.success('تم تسجيل الدخول بجوجل بنجاح');
                // Store a dummy token or handle as needed for testing
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            toast.error('يرجى ملء جميع الحقول');
            return;
        }

        setIsLoading(true);
        try {
            const response = await login(formData);

            // Updated response structure based on API feedback:
            // { data: { id, name, email }, meta: { access_token, token_type } }
            if (response.meta && response.meta.access_token) {
                // Store token in cookies and localStorage
                const token = response.meta.access_token;
                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
                localStorage.setItem('token', token);
                
                // Store user info
                if (response.data) {
                    localStorage.setItem('user_info', JSON.stringify({
                        name: response.data.name,
                        email: response.data.email,
                        phone: response.data.phone,
                        role: 'الادمن' // Default role since it's not in the response yet
                    }));
                }
                
                // Note: The new response structure doesn't seem to have `link_academy` or `academy_link_name` directly in `data`.
                // However, we rely on `academy_link_name` being in localStorage from the setup step or extracted from hostname.
                // If it's missing here, we might need another way to get it, but for now we assume it's set or handled by interceptor fallback.

                toast.success('تم تسجيل الدخول بنجاح');
                closeModal();

                // Navigate to academic dashboard (since this is academy login)
                router.push('/academic');
            } else {
                toast.error('فشل تسجيل الدخول: استجابة غير صالحة');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            // Handle specific error messages from the API
            const errorMessage = error.message || error.error || 'حدث خطأ أثناء تسجيل الدخول';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl overflow-hidden animate-on-scroll reveal transform scale-100">
                <button
                    onClick={closeModal}
                    className="absolute top-6 left-6 text-[#6b7280] hover:text-[#1a1a1a] transition-colors p-2"
                >
                    <X size={24} />
                </button>

                <div className="p-10 pt-16">
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-[#1a1a1a]">تسجيل الدخول</h2>
                            <p className="text-[#6b7280] font-bold mt-2">مرحباً بك مجدداً</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-right text-sm font-bold text-[#4a4a4a] mb-2 px-1">البريد الإلكتروني</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@mail.com"
                                        className="w-full p-4 pr-12 text-right bg-[#f8faff] border border-[#e2e8f0] rounded-2xl focus:border-[#2563eb] outline-none transition-all font-bold"
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2563eb]" size={20} />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-right text-sm font-bold text-[#4a4a4a] mb-2 px-1">كلمة المرور</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="********"
                                        className="w-full p-4 pr-12 text-right bg-[#f8faff] border border-[#e2e8f0] rounded-2xl focus:border-[#2563eb] outline-none transition-all font-bold"
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2563eb]" size={20} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#2563eb] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button className="text-sm font-bold text-[#2563eb] hover:underline">
                                    نسيت كلمة المرور؟
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full py-4 bg-[#2563eb] text-white font-black rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    جاري تسجيل الدخول...
                                </>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </button>

                        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                            <>
                                <div className="relative flex items-center justify-center py-2">
                                    <div className="flex-grow border-t border-[#e2e8f0]"></div>
                                    <span className="flex-shrink mx-4 text-sm text-[#6b7280] font-bold">أو</span>
                                    <div className="flex-grow border-t border-[#e2e8f0]"></div>
                                </div>

                                <button
                                    onClick={() => handleGoogleLogin()}
                                    className="w-full py-4 bg-white border border-[#e2e8f0] text-[#1a1a1a] font-black rounded-2xl hover:bg-[#f8faff] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="google" />
                                    تسجيل الدخول عن طريق جوجل
                                </button>
                            </>
                        )}

                        <p className="text-center text-sm font-bold text-[#6b7280] mt-4">
                            ليس لديك حساب؟{' '}
                            <button
                                onClick={() => openModal('registration')}
                                className="text-[#2563eb] underline"
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
