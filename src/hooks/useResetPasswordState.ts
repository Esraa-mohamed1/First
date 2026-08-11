import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/services/auth';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function useResetPasswordState() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [generalError, setGeneralError] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        code: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        number: false,
        special: false
    });

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        setErrors(prev => ({ ...prev, password: '' }));

        setPasswordCriteria({
            length: val.length >= 8,
            number: /[0-9]/.test(val),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(val)
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', code: '', password: '', confirmPassword: '' };

        if (!email) {
            newErrors.email = 'يرجى إدخال البريد الإلكتروني';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'البريد الإلكتروني غير صالح';
            isValid = false;
        }

        if (!code) {
            newErrors.code = 'يرجى إدخال رمز التحقق';
            isValid = false;
        } else if (code.length < 4) {
            newErrors.code = 'رمز التحقق يجب أن يكون 4 أرقام على الأقل';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'يرجى إدخال كلمة المرور الجديدة';
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setGeneralError('');
        try {
            const payload = {
                email,
                code,
                token: code,
                otp: code,
                password,
                password_confirmation: confirmPassword
            };

            await resetPassword(payload);

            await MySwal.fire({
                title: 'تمت إعادة تعيين كلمة المرور بنجاح!',
                text: 'تم تغيير كلمة المرور الخاصة بك. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.',
                icon: 'success',
                confirmButtonText: 'الذهاب لتسجيل الدخول',
                confirmButtonColor: '#2563eb'
            });

            router.push('/auth/login');
        } catch (err: any) {
            console.error('Reset password error:', err);
            let errorMessage = err.message || err.error || 'حدث خطأ أثناء إعادة تعيين كلمة المرور';

            if (errorMessage.toLowerCase().includes('invalid code') || errorMessage.toLowerCase().includes('invalid token') || errorMessage.toLowerCase().includes('code is invalid') || errorMessage.includes('رمز التحقق غير صحيح')) {
                errorMessage = 'رمز التحقق غير صحيح أو منتهي الصلاحية';
                setErrors(prev => ({ ...prev, code: errorMessage }));
            } else if (errorMessage.toLowerCase().includes('network error')) {
                errorMessage = 'حدث خطأ في الاتصال، يرجى التحقق من الشبكة';
            }

            setGeneralError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        router,
        isLoading,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        email,
        setEmail,
        code,
        setCode,
        password,
        confirmPassword,
        setConfirmPassword,
        generalError,
        errors,
        setErrors,
        passwordCriteria,
        handlePasswordChange,
        handleSubmit
    };
}
