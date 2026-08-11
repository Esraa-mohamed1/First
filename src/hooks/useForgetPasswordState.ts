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
            await forgetPassword({ email });

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

    return {
        router,
        isLoading,
        email,
        setEmail,
        error,
        setError,
        handleSubmit
    };
}
