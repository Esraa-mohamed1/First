'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2, ShieldCheck, Mail, User, Phone, Globe, Lock, Loader2 } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { createAccount } from '@/services/auth';
import toast from 'react-hot-toast';

const RegistrationModal = () => {
    const { isOpen, closeModal } = useModal();
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        academy_name: '',
        password: '',
        confirmPassword: ''
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateStep1 = () => {
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error('يرجى ملء جميع الحقول');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.academy_name || !formData.password) {
            toast.error('يرجى ملء جميع الحقول');
            return false;
        }
        return true;
    };

    const handleNextStep1 = () => {
        if (validateStep1()) setStep(2);
    };

    const handleCreateAccount = async () => {
        if (!validateStep2()) return;

        setIsLoading(true);
        try {
            await createAccount({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                academy_name: formData.academy_name,
                password: formData.password
            });
            
            toast.success('تم إنشاء الحساب بنجاح');
            setStep(3); // Go to verification or success
        } catch (error: any) {
            toast.error(error.message || 'حدث خطأ أثناء إنشاء الحساب');
        } finally {
            setIsLoading(false);
        }
    };

    const prevStep = () => setStep(step - 1);

    const handleComplete = () => {
        closeModal();
        router.push('/auth/payment');
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-[#1a1a1a]">إنشاء حساب</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-right text-sm font-bold text-[#4a4a4a] mb-2 px-1">الاسم بالكامل</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="أدخل اسمك بالكامل" 
                                        className="w-full p-4 pr-12 text-right bg-[#f8faff] border border-[#e2e8f0] rounded-2xl focus:border-[#2563eb] outline-none transition-all font-bold" 
                                    />
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2563eb]" size={20} />
                                </div>
                            </div>
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
                                <label className="block text-right text-sm font-bold text-[#4a4a4a] mb-2 px-1">رقم الجوال</label>
                                <div className="relative">
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="05xxxxxxxx" 
                                        className="w-full p-4 pr-12 text-right bg-[#f8faff] border border-[#e2e8f0] rounded-2xl focus:border-[#2563eb] outline-none transition-all font-bold" 
                                    />
                                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2563eb]" size={20} />
                                </div>
                            </div>
                        </div>
                        <button onClick={handleNextStep1} className="w-full py-4 bg-[#2563eb] text-white font-black rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
                            التالي
                        </button>
                        <div className="relative flex items-center justify-center py-2">
                            <div className="flex-grow border-t border-[#e2e8f0]"></div>
                            <span className="flex-shrink mx-4 text-sm text-[#6b7280] font-bold">أو</span>
                            <div className="flex-grow border-t border-[#e2e8f0]"></div>
                        </div>
                        <button className="w-full py-4 bg-white border border-[#e2e8f0] text-[#1a1a1a] font-black rounded-2xl hover:bg-[#f8faff] transition-all flex items-center justify-center gap-3">
                            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="google" />
                            التسجيل عن طريق جوجل
                        </button>
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
                                        className="w-full p-4 pr-12 text-right bg-[#f8faff] border border-[#e2e8f0] rounded-2xl focus:border-[#2563eb] outline-none transition-all font-bold" 
                                    />
                                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2563eb]" size={20} />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-right text-sm font-bold text-[#4a4a4a] mb-2 px-1">كلمة المرور</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="********" 
                                        className="w-full p-4 pr-12 text-right bg-[#f8faff] border border-[#e2e8f0] rounded-2xl focus:border-[#2563eb] outline-none transition-all font-bold" 
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2563eb]" size={20} />
                                </div>
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
                            ابدأ الآن
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
            <div className="relative w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl overflow-hidden animate-on-scroll reveal transform scale-100">
                <button
                    onClick={closeModal}
                    className="absolute top-6 left-6 text-[#6b7280] hover:text-[#1a1a1a] transition-colors p-2"
                >
                    <X size={24} />
                </button>

                <div className="p-10 pt-16">
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
