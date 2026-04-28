'use client';

import { ShieldCheck, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { sendOtp, verifyOtp } from "@/services/auth";
import { useCountry } from "@/hooks/useCountry";

function VerificationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { selectedCountry } = useCountry();
    const [step, setStep] = useState<'initial' | 'otp'>('initial');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [contact, setContact] = useState<string | null>(null);

    useEffect(() => {
        // Try to get contact from URL or local storage
        const contactParam = searchParams.get('contact');
        if (contactParam) {
            setContact(contactParam);
        } else {
            const userStr = localStorage.getItem('user_info');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setContact(user.email || user.phone);
                } catch (e) {
                    console.error('Failed to parse user info');
                }
            }
        }
    }, [searchParams]);

    const handleSendOtp = async () => {
        if (!contact) {
            toast.error('لم يتم العثور على معلومات الاتصال');
            return;
        }

        setLoading(true);
        try {
            await sendOtp(contact, selectedCountry?.isoCode);
            toast.success('تم إرسال رمز التحقق بنجاح');
            setStep('otp');
        } catch (error: any) {
            toast.error(error.message || 'فشل إرسال رمز التحقق');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0];
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length !== 6) {
            toast.error('يرجى إدخال رمز التحقق كاملاً');
            return;
        }

        if (!contact) {
            toast.error('لم يتم العثور على معلومات الاتصال');
            return;
        }

        setLoading(true);
        console.log('Verifying OTP...', { contact, code });
        try {
            const response = await verifyOtp(contact, code, selectedCountry?.isoCode);
            console.log('Verify OTP response:', response);
            if (response.status) {
                toast.success('تم التحقق بنجاح');

                // Update user info in local storage if needed
                const userStr = localStorage.getItem('user_info');
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        user.email_verified_at = new Date().toISOString(); // Simulate update
                        localStorage.setItem('user_info', JSON.stringify(user));
                    } catch (e) {
                        console.error('Failed to update local user info');
                    }
                }

                router.push('/academic');
            } else {
                toast.error(response.message || 'رمز التحقق غير صحيح');
            }
        } catch (error: any) {
            console.error('Verify OTP Error:', error);
            toast.error(error.message || 'فشل التحقق من الرمز');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen  flex items-center justify-center p-4" dir="rtl">
            <div className=" bg-[#f8faff] rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-500">

                {step === 'initial' ? (
                    <>
                        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <ShieldCheck className="w-12 h-12 text-yellow-600" />
                        </div>

                        <h1 className="text-3xl font-black text-gray-900 mb-6">
                            تحقق من حسابك
                        </h1>

                        <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
                            يرجى التحقق من بريدك الإلكتروني أو رقم هاتفك لتفعيل حسابك والبدء في استخدام جميع مميزات المنصة.
                        </p>

                        <div className="space-y-4 max-w-md mx-auto">
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Mail size={20} />}
                                إرسال رمز التحقق
                            </button>

                            <Link
                                href="/academic"
                                className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-3"
                            >
                                العودة للوحة التحكم
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-black text-gray-900 mb-4">
                            إدخال رمز التحقق
                        </h1>
                        <p className="text-gray-500 mb-8 font-medium">
                            تم إرسال رمز مكوّن من 6 أرقام إلى {contact}. يرجى إدخاله للمتابعة.
                        </p>

                        <div className="flex justify-center gap-3 mb-8" dir="ltr">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 md:w-16 md:h-20 border-2 border-gray-300 rounded-xl text-center text-2xl md:text-4xl font-bold focus:border-blue-600 focus:outline-none transition-colors bg-white text-gray-900"
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'تأكيد'}
                        </button>

                        <div className="mt-6 text-center">
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="text-blue-600 hover:text-blue-700 font-bold text-sm hover:underline disabled:opacity-50"
                            >
                                لم يصلك الرمز؟ إعادة الإرسال
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerificationPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>}>
            <VerificationContent />
        </Suspense>
    );
}
