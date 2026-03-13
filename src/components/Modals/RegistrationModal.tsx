'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2, ShieldCheck, Mail, Phone, Globe, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { createAccount } from '@/services/auth';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';

const RegistrationModal = () => {
    const { isOpen, view, closeModal, openModal, data } = useModal();
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        academy_name: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        academy_name: '',
        password: '',
        confirmPassword: ''
    });

    const [paymentLink, setPaymentLink] = useState<string | null>(null);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Google Login Success:', tokenResponse);
            
            if (!data?.package_id) {
                toast.error('يجب اختيار باقة أولاً');
                return;
            }

            setIsLoading(true);
            try {
                // Simulate backend call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                toast.success('تم إنشاء الحساب بجوجل بنجاح');
                
                // Store simulated token
                const token = "google_simulated_token_" + Date.now();
                localStorage.setItem('token', token);
                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

                closeModal();
                router.push('/auth/setup');
            } catch (error) {
                console.error('Google Sign Up Error:', error);
                toast.error('فشل إنشاء الحساب بجوجل');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            console.error('Google Login Error');
            toast.error('فشل الاتصال بحساب جوجل');
        },
    });

    // Reset state when modal opens
    React.useEffect(() => {
        if (isOpen && view === 'registration') {
            setStep(1);
            setFormData({
                email: '',
                phone: '',
                academy_name: '',
                password: '',
                confirmPassword: ''
            });
            setErrors({
                email: '',
                phone: '',
                academy_name: '',
                password: '',
                confirmPassword: ''
            });
            setPaymentLink(null);
            setIsLoading(false);
            setContactMethod('email');
        }
    }, [isOpen, view]);

    if (!isOpen || view !== 'registration') return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateStep1 = () => {
        const newErrors = { ...errors };
        let isValid = true;

        if (!data?.package_id) {
            toast.error('يجب اختيار باقة أولاً');
            isValid = false;
        }

        if (contactMethod === 'email') {
            if (!formData.email) {
                newErrors.email = 'يرجى إدخال البريد الإلكتروني';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'البريد الإلكتروني غير صالح';
                isValid = false;
            }
        }

        if (contactMethod === 'phone') {
            if (!formData.phone) {
                newErrors.phone = 'يرجى إدخال رقم الجوال';
                isValid = false;
            }
        }

        if (!formData.password) {
            newErrors.password = 'يرجى إدخال كلمة المرور';
            isValid = false;
        } else if (formData.password.length < 6) {
             newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
             isValid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'يرجى تأكيد كلمة المرور';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStep2 = () => {
        const newErrors = { ...errors };
        let isValid = true;

        if (!formData.academy_name) {
            newErrors.academy_name = 'يرجى إدخال اسم الأكاديمية';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNextStep1 = () => {
        if (validateStep1()) setStep(2);
    };

    const handleCreateAccount = async () => {
        if (!validateStep2()) return;
        if (!data?.package_id) {
            toast.error('يجب اختيار باقة أولاً');
            return;
        }

        setIsLoading(true);
        try {
            // Only send the selected contact method
            const accountPayload: any = {
                name: 'User',
                academy_name: formData.academy_name,
                password: formData.password,
                package_id: data?.package_id
            };

            if (contactMethod === 'email') {
                accountPayload.email = formData.email;
            } else {
                accountPayload.phone = formData.phone;
            }

            const response = await createAccount(accountPayload);
            
            if (response.data?.token) {
                localStorage.setItem('token', response.data.token);
            } else if (response.token) {
                 localStorage.setItem('token', response.token);
            }
            
            // Cache user info for setup step - Clear the other one to avoid confusion
            if (contactMethod === 'email') {
                localStorage.setItem('user_email', formData.email);
                localStorage.removeItem('user_phone');
            } else {
                localStorage.setItem('user_phone', formData.phone);
                localStorage.removeItem('user_email');
            }
            localStorage.setItem('user_academy_name', formData.academy_name);
            // Cache password for auto-login in setup step
            localStorage.setItem('user_password', formData.password);

            if (response.paymentLink) {
                toast.success('جاري التحويل لصفحة الدفع...');
                window.location.href = response.paymentLink;
            } else {
                toast.success('تم إنشاء الحساب بنجاح');
                setStep(4);
            }
        } catch (error: any) {
            toast.error(error.message || 'حدث خطأ أثناء إنشاء الحساب');
        } finally {
            setIsLoading(false);
        }
    };

    const prevStep = () => setStep(step - 1);

    const handleComplete = () => {
        closeModal();
        if (paymentLink) {
            window.location.href = paymentLink;
        } else {
            router.push('/auth/setup');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-[#1a1a1a]">إنشاء حساب</h2>
                        </div>
                        
                        {/* Contact Method Toggle */}
                        <div className="flex bg-[#f8faff] p-1 rounded-xl mb-4">
                            <button
                                onClick={() => setContactMethod('email')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                    contactMethod === 'email' 
                                    ? 'bg-white text-[#2563eb] shadow-sm' 
                                    : 'text-[#6b7280] hover:text-[#4a4a4a]'
                                }`}
                            >
                                البريد الإلكتروني
                            </button>
                            <button
                                onClick={() => setContactMethod('phone')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                    contactMethod === 'phone' 
                                    ? 'bg-white text-[#2563eb] shadow-sm' 
                                    : 'text-[#6b7280] hover:text-[#4a4a4a]'
                                }`}
                            >
                                رقم الجوال
                            </button>
                        </div>

                        <div className="space-y-3">
                            {contactMethod === 'email' ? (
                                <div className="relative">
                                    <label className="block text-right text-xs font-bold text-[#4a4a4a] mb-1.5 px-1">البريد الإلكتروني</label>
                                    <div className="relative">
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="example@mail.com" 
                                            className={`w-full p-3 pr-10 text-right bg-[#f8faff] border rounded-xl focus:border-[#2563eb] outline-none transition-all font-bold text-sm ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#e2e8f0]'}`}
                                        />
                                        <Mail className={`absolute right-3 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-500' : 'text-[#2563eb]'}`} size={18} />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 mr-1">{errors.email}</p>}
                                </div>
                            ) : (
                                <div className="relative">
                                    <label className="block text-right text-xs font-bold text-[#4a4a4a] mb-1.5 px-1">رقم الجوال</label>
                                    <div className="relative">
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="05xxxxxxxx" 
                                            className={`w-full p-3 pr-10 text-right bg-[#f8faff] border rounded-xl focus:border-[#2563eb] outline-none transition-all font-bold text-sm ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#e2e8f0]'}`}
                                        />
                                        <Phone className={`absolute right-3 top-1/2 -translate-y-1/2 ${errors.phone ? 'text-red-500' : 'text-[#2563eb]'}`} size={18} />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 mr-1">{errors.phone}</p>}
                                </div>
                            )}

                            <div className="relative">
                                <label className="block text-right text-xs font-bold text-[#4a4a4a] mb-1.5 px-1">كلمة المرور</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="********" 
                                        className={`w-full p-3 pr-10 text-right bg-[#f8faff] border rounded-xl focus:border-[#2563eb] outline-none transition-all font-bold text-sm ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#e2e8f0]'}`}
                                    />
                                    <Lock className={`absolute right-3 top-1/2 -translate-y-1/2 ${errors.password ? 'text-red-500' : 'text-[#2563eb]'}`} size={18} />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#2563eb] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 mr-1">{errors.password}</p>}
                            </div>

                            <div className="relative">
                                <label className="block text-right text-xs font-bold text-[#4a4a4a] mb-1.5 px-1">تأكيد كلمة المرور</label>
                                <div className="relative">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="********" 
                                        className={`w-full p-3 pr-10 text-right bg-[#f8faff] border rounded-xl focus:border-[#2563eb] outline-none transition-all font-bold text-sm ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-[#e2e8f0]'}`}
                                    />
                                    <Lock className={`absolute right-3 top-1/2 -translate-y-1/2 ${errors.confirmPassword ? 'text-red-500' : 'text-[#2563eb]'}`} size={18} />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#2563eb] transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold mt-1 mr-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                        <button onClick={handleNextStep1} className="w-full py-3.5 bg-[#2563eb] text-white font-black rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm mt-2">
                            التالي
                        </button>
                        <div className="relative flex items-center justify-center py-1">
                            <div className="flex-grow border-t border-[#e2e8f0]"></div>
                            <span className="flex-shrink mx-4 text-xs text-[#6b7280] font-bold">أو</span>
                            <div className="flex-grow border-t border-[#e2e8f0]"></div>
                        </div>
                        <button 
                            onClick={() => handleGoogleLogin()}
                            className="w-full py-3.5 bg-white border border-[#e2e8f0] text-[#1a1a1a] font-black rounded-xl hover:bg-[#f8faff] transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" />
                            التسجيل عن طريق جوجل
                        </button>

                        <p className="text-center text-xs font-bold text-[#6b7280] mt-3">
                            لديك حساب بالفعل؟{' '}
                            <button 
                                onClick={() => openModal('login')} 
                                className="text-[#2563eb] underline"
                            >
                                تسجيل الدخول
                            </button>
                        </p>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-[#1a1a1a]">معلومات الأكاديمية</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-right text-sm font-bold text-[#4a4a4a] mb-2 px-1">اسم الأكاديمية</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        name="academy_name"
                                        value={formData.academy_name}
                                        onChange={handleChange}
                                        placeholder="أدخل اسم أكاديميتك" 
                                        className={`w-full p-4 pr-12 text-right bg-[#f8faff] border rounded-2xl focus:border-[#2563eb] outline-none transition-all font-bold ${errors.academy_name ? 'border-red-500 focus:border-red-500' : 'border-[#e2e8f0]'}`}
                                    />
                                    <Globe className={`absolute right-4 top-1/2 -translate-y-1/2 ${errors.academy_name ? 'text-red-500' : 'text-[#2563eb]'}`} size={20} />
                                </div>
                                {errors.academy_name && <p className="text-red-500 text-xs font-bold mt-1 mr-1">{errors.academy_name}</p>}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={handleCreateAccount} 
                                disabled={isLoading}
                                className="flex-[2] py-4 bg-[#2563eb] text-white font-black rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        جاري الإنشاء...
                                    </>
                                ) : (
                                    'إنشاء الحساب'
                                )}
                            </button>
                            <button onClick={prevStep} disabled={isLoading} className="flex-1 py-4 bg-[#f8faff] border border-[#e2e8f0] text-[#4a4a4a] font-black rounded-2xl hover:bg-[#e2e8f0] transition-all disabled:opacity-70">
                                رجوع
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <ShieldCheck className="mx-auto text-[#fbbf24] mb-4" size={64} />
                            <h2 className="text-2xl font-black text-[#1a1a1a]">تأكيد الرمز</h2>
                            <p className="text-[#6b7280] font-bold mt-2">أدخل الرمز المرسل لجوالك</p>
                        </div>
                        <div className="flex justify-center gap-4 py-4" dir="ltr">
                            {[1, 2, 3, 4].map((i) => (
                                <input key={i} type="text" maxLength={1} className="w-16 h-16 text-center text-3xl font-black bg-[#f8faff] border border-[#e2e8f0] rounded-2xl focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 outline-none transition-all" />
                            ))}
                        </div>
                        <button onClick={() => setStep(4)} className="w-full py-4 bg-[#2563eb] text-white font-black rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
                            تأكيد
                        </button>
                        <p className="text-center text-sm font-bold text-[#6b7280]">لم يصلك الرمز؟ <button className="text-[#2563eb] underline">إعادة الإرسال</button></p>
                    </div>
                );
            case 4:
                return (
                    <div className="text-center py-12 px-6">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <CheckCircle2 size={64} className="text-green-500" />
                        </div>
                        <h2 className="text-3xl font-black text-[#1a1a1a] mb-4">تم إنشاء الحساب بنجاح</h2>
                        <p className="text-[#6b7280] font-bold text-lg mb-10 leading-relaxed">أهلاً بك في First! يمكنك الآن البدء في إدارة أكاديميتك وتطوير خدماتك.</p>
                        <button onClick={handleComplete} className="w-full py-5 bg-[#2563eb] text-white font-black rounded-[2rem] shadow-xl hover:-translate-y-1 transition-all">
                            {paymentLink ? 'الذهاب للدفع' : 'ابدأ الآن'}
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[420px] md:max-w-[500px] mx-4 bg-white rounded-[30px] shadow-2xl overflow-hidden animate-on-scroll reveal transform scale-100">
                <button
                    onClick={closeModal}
                    className="absolute top-6 left-6 text-[#6b7280] hover:text-[#1a1a1a] transition-colors p-2"
                >
                    <X size={24} />
                </button>

                <div className="p-8 pt-12 md:p-10 md:pt-16">
                    {renderStep()}
                </div>

                {/* Footer Progress */}
                {step < 4 && (
                    <div className="px-10 pb-8 flex justify-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-10 bg-[#2563eb]' : 'w-4 bg-[#e2e8f0]'}`}></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationModal;

