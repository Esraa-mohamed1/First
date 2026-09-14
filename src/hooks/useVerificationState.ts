import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { sendOtp, verifyOtp, getProfileStatus } from "@/services/auth";
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
    const [resendTimer, setResendTimer] = useState<number>(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    useEffect(() => {
        const contactParam = searchParams.get('contact');
        if (contactParam) {
            setContact(contactParam);
        } else {
            const fetchProfileContact = async () => {
                let found: string | null = null;
                try {
                    const profile = await getProfileStatus();
                    const user = profile?.data || profile?.user || profile;
                    if (user) {
                        found = user.email || user.phone || user.mobile || null;
                        try {
                            localStorage.setItem('user_info', JSON.stringify(user));
                        } catch (e) {}
                    }
                } catch (err) {
                    console.warn('Failed to fetch me profile in useVerificationState:', err);
                }

                if (!found) {
                    const userStr = localStorage.getItem('user_info');
                    if (userStr) {
                        try {
                            const user = JSON.parse(userStr);
                            found = user.email || user.phone || user.mobile || null;
                        } catch (e) {}
                    }
                }

                if (found) {
                    setContact(found);
                }
            };

            fetchProfileContact();
        }
    }, [searchParams]);

    const handleSendOtp = async () => {
        let targetContact = contact;
        if (!targetContact) {
            try {
                const profile = await getProfileStatus();
                const user = profile?.data || profile?.user || profile;
                if (user) {
                    targetContact = user.email || user.phone || user.mobile || null;
                    if (targetContact) setContact(targetContact);
                }
            } catch (err) {
                console.warn('Failed to fetch contact during handleSendOtp:', err);
            }
        }

        if (!targetContact || !targetContact.trim()) {
            toast.error('لم يتم العثور على معلومات الاتصال');
            return;
        }

        setLoading(true);
        try {
            await sendOtp(targetContact, selectedCountry?.isoCode);
            toast.success('تم إرسال رمز التحقق بنجاح');
            setStep('otp');
            setResendTimer(60);
        } catch (error: any) {
            toast.error(getErrorMessage(error, 'فشل إرسال رمز التحقق'));
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const digitsOnly = value.replace(/\D/g, '');
        if (!digitsOnly) {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
            return;
        }

        if (digitsOnly.length > 1) {
            const newOtp = [...otp];
            digitsOnly.slice(0, 6).split('').forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            const lastIndex = Math.min(digitsOnly.length - 1, 5);
            inputRefs.current[lastIndex]?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = digitsOnly;
        setOtp(newOtp);

        if (digitsOnly && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pastedData) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);

        const lastIndex = Math.min(pastedData.length - 1, 5);
        inputRefs.current[lastIndex]?.focus();
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
        resendTimer,
        handleSendOtp,
        handleOtpChange,
        handleKeyDown,
        handlePaste,
        handleVerify
    };
}
