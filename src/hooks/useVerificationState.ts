import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { sendOtp, verifyOtp } from "@/services/auth";
import { useCountry } from "@/hooks/useCountry";
import { getErrorMessage } from "@/lib/utils";

export function useVerificationState() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { selectedCountry } = useCountry();
    const [step, setStep] = useState<'initial' | 'otp'>('initial');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [contact, setContact] = useState<string | null>(null);

    useEffect(() => {
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
            toast.error(getErrorMessage(error, 'فشل إرسال رمز التحقق'));
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
        try {
            const response = await verifyOtp(contact, code, selectedCountry?.isoCode);
            if (response.status) {
                toast.success('تم التحقق بنجاح');

                const userStr = localStorage.getItem('user_info');
                let userRole = '';
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        user.email_verified_at = new Date().toISOString();
                        localStorage.setItem('user_info', JSON.stringify(user));
                        userRole = user.role;
                    } catch (e) {
                        console.error('Failed to update local user info');
                    }
                }

                if (userRole === 'admin' || userRole === 'academy') {
                    router.push('/academic');
                } else {
                    router.push('/student');
                }
            } else {
                toast.error(getErrorMessage(response, 'رمز التحقق غير صحيح'));
            }
        } catch (error: any) {
            console.error('Verify OTP Error:', error);
            toast.error(getErrorMessage(error, 'فشل التحقق من الرمز'));
        } finally {
            setLoading(false);
        }
    };

    return {
        router,
        step,
        loading,
        otp,
        inputRefs,
        contact,
        handleSendOtp,
        handleOtpChange,
        handleKeyDown,
        handleVerify
    };
}
