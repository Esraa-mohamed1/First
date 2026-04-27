'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2, ShieldCheck, Mail, Phone, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { createAccount } from '@/services/auth';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { useCountry } from '@/hooks/useCountry';
import { PhoneInput } from '@/components/CountrySelector';

const RegistrationModal = () => {
    const { isOpen, view, closeModal, openModal, data } = useModal();
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { selectedCountry } = useCountry();

    const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // Password validation state
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        number: false,
        special: false,
        match: false
    });

    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0];
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            otpRefs.current[index + 1]?.focus();
        }
        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyRegistration = () => {
        if (otp.join('').length !== 4) {
            setErrors(prev => ({ ...prev, phone: 'يرجى إدخال الرمز كاملاً' }));
            return;
        }
        setStep(4);
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Google Login Success:', tokenResponse);
            setIsLoading(true);
            try {
                // Simulate backend call
                await new Promise(resolve => setTimeout(resolve, 1000));
                toast.success('تم إنشاء الحساب بجوجل بنجاح');
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

    React.useEffect(() => {
        if (isOpen && view === 'registration') {
            setStep(1);
            setFormData({
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            });
            setErrors({
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            });
            setPasswordCriteria({
                length: false,
                number: false,
                special: false,
                match: false
            });
            setIsLoading(false);
            setContactMethod('email');
        }
    }, [isOpen, view]);

    if (!isOpen || view !== 'registration') return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const hasNonDigits = /\D/.test(value);
            const sanitizedValue = value.replace(/\D/g, '');
            
            setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
            
            // Handle error logic
            if (hasNonDigits) {
                setErrors(prev => ({ ...prev, phone: 'يرجى إدخال أرقام فقط' }));
            } else if (sanitizedValue.length > 0 && sanitizedValue.length < 10) {
                setErrors(prev => ({ ...prev, phone: 'رقم الجوال يجب أن يكون 10 أرقام على الأقل' }));
            } else if (sanitizedValue.length > 15) {
                setErrors(prev => ({ ...prev, phone: 'رقم الجوال طويل جداً' }));
            } else {
                setErrors(prev => ({ ...prev, phone: '' }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            // Clear error when user types
            if (errors[name as keyof typeof errors]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        }

        // Live password validation
        if (name === 'password' || name === 'confirmPassword') {
            const pwd = name === 'password' ? value : formData.password;
            const cfm = name === 'confirmPassword' ? value : formData.confirmPassword;

            setPasswordCriteria({
                length: pwd.length >= 8,
                number: /[0-9]/.test(pwd),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
                match: pwd === cfm && pwd !== ''
            });
        }
    };

    const validateStep1 = () => {
        const newErrors = { ...errors };
        let isValid = true;

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
            } else if (formData.phone.length < 10) {
                newErrors.phone = 'رقم الجوال يجب أن يكون 10 أرقام على الأقل';
                isValid = false;
            } else if (formData.phone.length > 15) {
                newErrors.phone = 'رقم الجوال طويل جداً';
                isValid = false;
            }
        }

        if (!formData.password) {
            newErrors.password = 'يرجى إدخال كلمة المرور';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
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

    const handleNextStep = () => {
        if (validateStep1()) handleCreateAccount();
    };

    const handleCreateAccount = async () => {
        setIsLoading(true);
        try {
            const accountPayload: any = {
                name: (contactMethod === 'email' ? formData.email.split('@')[0] : formData.phone),
                academy_name: (contactMethod === 'email' ? formData.email.split('@')[0] : formData.phone) + "'s Academy",
                password: formData.password,
                package_id: data?.package_id,
                country_code: selectedCountry?.dialCode?.replace('+', '') || '966'
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

            if (contactMethod === 'email') {
                localStorage.setItem('user_email', formData.email);
                localStorage.removeItem('user_phone');
            } else {
                localStorage.setItem('user_phone', formData.phone);
                localStorage.removeItem('user_email');
            }
            localStorage.setItem('user_password', formData.password);

            toast.success('تم إنشاء الحساب بنجاح');
            setStep(4);
        } catch (error: any) {
            toast.error(error.message || 'حدث خطأ أثناء إنشاء الحساب');
        } finally {
            setIsLoading(false);
        }
    };

    const prevStep = () => setStep(step - 1);

    const handleComplete = () => {
        closeModal();
        router.push('/auth/setup');
    };

    const toggleContactMethod = (e: React.MouseEvent) => {
        e.preventDefault();
        setContactMethod(prev => prev === 'email' ? 'phone' : 'email');
        setErrors(prev => ({ ...prev, email: '', phone: '' }));
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-[#1a1a1a]">إنشاء حساب</h2>
                            <p className="text-[#6b7280] font-bold mt-2">ابدأ رحلتك التعليمية اليوم</p>
                        </div>

                        <div className="space-y-4">
                            {contactMethod === 'email' ? (
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
                                            onClick={toggleContactMethod}
                                            className="text-[11px] font-black text-[#2563eb] hover:underline flex items-center gap-1 mt-0.5"
                                        >
                                            <Phone size={12} strokeWidth={3} /> التسجيل بالجوال
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
                                            onClick={toggleContactMethod}
                                            className="text-[11px] font-black text-[#2563eb] hover:underline flex items-center gap-1 mt-0.5"
                                        >
                                            <Mail size={12} strokeWidth={3} /> التسجيل بالبريد
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

                            <div className="space-y-1.5">
                                <label className="block text-right text-xs font-bold text-[#4a4a4a] px-1">تأكيد كلمة المرور</label>
                                <div className="relative group">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full p-3.5 pr-11 text-right bg-[#f8faff] border rounded-2xl focus:bg-white focus:border-[#2563eb] outline-none transition-all font-bold text-sm ${errors.confirmPassword ? 'border-red-500' : 'border-[#e2e8f0]'}`}
                                    />
                                    <Lock className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-[#2563eb]/60 group-focus-within:text-[#2563eb]'}`} size={18} />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2563eb] transition-colors p-1"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold mr-1">{errors.confirmPassword}</p>}

                                {formData.confirmPassword && (
                                    <div className={`flex items-center gap-2 text-[10px] font-black mt-2 px-1 transition-all duration-300 ${passwordCriteria.match ? 'text-green-600' : 'text-red-500'}`} dir="rtl">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordCriteria.match ? 'bg-green-500' : 'bg-red-400'}`}>
                                            <CheckCircle2 size={10} className="text-white" />
                                        </div>
                                        {passwordCriteria.match ? 'كلمات المرور متطابقة' : 'كلمات المرور غير متطابقة'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={handleNextStep} 
                            disabled={isLoading}
                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all text-xl mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    جاري المعالجة...
                                </>
                            ) : (
                                'التالي'
                            )}
                        </button>

                        <div className="relative flex items-center justify-center py-2">
                            <div className="flex-grow border-t border-[#e2e8f0]"></div>
                            <span className="flex-shrink mx-4 text-[10px] text-[#6b7280] font-black uppercase tracking-[0.2em]">أو</span>
                            <div className="flex-grow border-t border-[#e2e8f0]"></div>
                        </div>

                        <button
                            onClick={() => handleGoogleLogin()}
                            className="w-full py-4 bg-white border border-[#e2e8f0] text-[#1a1a1a] font-black rounded-2xl hover:bg-[#f8faff] hover:border-[#2563eb]/20 transition-all flex items-center justify-center gap-3 text-sm shadow-sm group active:scale-95"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 shadow-sm group-hover:scale-110 transition-transform" alt="google" />
                            التسجيل عن طريق جوجل
                        </button>

                        <p className="text-center text-xs font-bold text-[#6b7280] mt-4">
                            لديك حساب بالفعل؟{' '}
                            <button
                                onClick={() => openModal('login')}
                                className="text-[#2563eb] hover:underline font-black px-1"
                            >
                                تسجيل الدخول
                            </button>
                        </p>
                    </div >
                );
            case 2:
                return null;
            case 3:
                return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-[#1a1a1a]">تأكيد الرمز</h2>
                    <p className="text-[#6b7280] font-bold mt-2">أدخل الرمز المكون من 4 أرقام</p>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-center gap-4 py-4" dir="ltr">
                        {otp.map((digit, index) => (
                            <input 
                                key={index} 
                                ref={el => { otpRefs.current[index] = el; }}
                                type="text" 
                                inputMode="numeric"
                                maxLength={1} 
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className={`w-16 h-20 text-center text-4xl font-black rounded-[20px] outline-none transition-all shadow-sm ${errors.phone ? 'bg-red-50 border-2 border-red-500 text-red-600' : 'bg-[#f8faff] border border-[#e2e8f0] text-gray-900 focus:border-[#2563eb] focus:bg-white focus:ring-4 focus:ring-[#2563eb]/10'}`} 
                            />
                        ))}
                    </div>
                    {errors.phone && <p className="text-red-500 text-center font-black text-sm">{errors.phone}</p>}
                </div>

                <button 
                    onClick={handleVerifyRegistration} 
                    className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all text-xl"
                >
                    تأكيد الرمز
                </button>
                
                <p className="text-center text-sm font-bold text-[#6b7280]">
                    لم يصلك الرمز؟ <button className="text-[#2563eb] hover:underline font-black">إعادة الإرسال</button>
                </p>
            </div>
        );
            case 4:
                return (
                    <div className="text-center py-12 px-6">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <CheckCircle2 size={64} className="text-green-500" />
                        </div>
                        <h2 className="text-3xl font-black text-[#1a1a1a] mb-4">تم إنشاء الحساب بنجاح</h2>
                        <p className="text-[#6b7280] font-bold text-lg mb-10 leading-relaxed text-center rtl:text-right">أهلاً بك في First! يمكنك الآن البدء في إدارة أكاديميتك وتطوير خدماتك.</p>
                        <button onClick={handleComplete} className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black rounded-[2.5rem] shadow-2xl shadow-blue-500/20 hover:-translate-y-1 transition-all active:scale-95 text-xl">
                            ابدأ الآن
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-transparent backdrop-blur-md">
            {/* Invisible but clickable backdrop overlay to close */}
            <div className="absolute inset-0" onClick={closeModal}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[420px] md:max-w-[500px] mx-4 bg-white rounded-[40px] shadow-2xl overflow-hidden animate-on-scroll reveal transform scale-100 border border-gray-100">
                <button
                    onClick={closeModal}
                    className="absolute top-6 left-6 text-[#6b7280] hover:text-[#1a1a1a] transition-colors p-2 z-[10]"
                >
                    <X size={24} />
                </button>

                <div className="p-8 pt-12 md:p-10 md:pt-16">
                    {renderStep()}
                </div>

                {/* Footer Progress */}
                {step < 2 && (
                    <div className="px-10 pb-8 flex justify-center gap-3">
                        {[1].map((i) => (
                            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step === i ? 'w-12 bg-[#2563eb]' : 'w-4 bg-gray-200'}`}></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationModal;

