import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { forgetPassword } from '@/services/auth';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function useForgetPasswordState() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const validateForm = () => {
        if (mode === 'email') {
            if (!email) {
                setError('يرجى إدخال البريد الإلكتروني');
                return false;
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                setError('البريد الإلكتروني غير صالح');
                return false;
            }
        } else {
            if (!phone) {
                setError('يرجى إدخال رقم الجوال');
                return false;
            }
            if (phone.replace(/\D/g, '').length < 7) {
                setError('رقم الجوال غير صالح');
                return false;
            }
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const payload = mode === 'email'
                ? { email }
                : { phone };
            await forgetPassword(payload);

            setOtpSent(true);

            await MySwal.fire({
                title: 'تم إرسال رمز التحقق!',
                text: mode === 'email'
                    ? 'تم إرسال رمز تحقق إلى بريدك الإلكتروني لإعادة تعيين كلمة المرور.'
                    : 'تم إرسال رمز تحقق إلى رقم جوالك لإعادة تعيين كلمة المرور.',
                icon: 'success',
                confirmButtonText: 'حسناً، متابعة',
                confirmButtonColor: '#2563eb'
            });

            const query = mode === 'email'
                ? `email=${encodeURIComponent(email)}`
                : `phone=${encodeURIComponent(phone)}`;
            router.push(`/auth/reset-password?${query}`);
        } catch (err: any) {
            console.error('Forget password error:', err);
            let errorMessage = err.message || err.error || 'حدث خطأ أثناء إرسال رمز التحقق';

            if (errorMessage.toLowerCase().includes('user not found') || errorMessage.toLowerCase().includes('email not found') || errorMessage.includes('لا يوجد مستخدم')) {
                errorMessage = mode === 'email'
                    ? 'البريد الإلكتروني المدخل غير مسجل لدينا'
                    : 'رقم الجوال المدخل غير مسجل لدينا';
            } else if (errorMessage.toLowerCase().includes('network error')) {
                errorMessage = 'حدث خطأ في الاتصال، يرجى التحقق من الشبكة';
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        router,
        isLoading,
        mode,
        setMode,
        email,
        setEmail,
        phone,
        setPhone,
        error,
        setError,
        otpSent,
        setOtpSent,
        handleSubmit
    };
}
