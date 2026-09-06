import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';
import toast from 'react-hot-toast';
import { useCountry } from '@/hooks/useCountry';
import { clearUserSessionAndCache } from '@/lib/auth-storage';

export function useLoginState() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const { selectedCountry } = useCountry();
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: ''
    });

    const [generalError, setGeneralError] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        password: ''
    });

    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        number: false,
        special: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (generalError) setGeneralError('');
        if (name === 'phone') {
            const hasNonDigits = /\D/.test(value);
            const sanitizedValue = value.replace(/\D/g, '');

            setFormData(prev => ({ ...prev, [name]: sanitizedValue }));

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
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (name === 'password') {
            setPasswordCriteria({
                length: value.length >= 8,
                number: /[0-9]/.test(value),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
            });
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', phone: '', password: '' };

        if (loginMethod === 'email') {
            if (!formData.email) {
                newErrors.email = 'يرجى إدخال البريد الإلكتروني';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'البريد الإلكتروني غير صالح';
                isValid = false;
            }
        } else {
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
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const payload = loginMethod === 'email'
                ? { email: formData.email, password: formData.password }
                : { phone: formData.phone, password: formData.password };

            const response = await login(payload);

            if (response.meta && response.meta.access_token) {
                const token = response.meta.access_token;
                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
                localStorage.setItem('token', token);

                document.cookie = "backup_email=; path=/; max-age=0; SameSite=Lax";
                document.cookie = "backup_phone=; path=/; max-age=0; SameSite=Lax";
                document.cookie = "backup_password=; path=/; max-age=0; SameSite=Lax";

                if (response.data) {
                    const userRole = (response.data as any).role || 'student';
                    localStorage.setItem('user_info', JSON.stringify({
                        name: response.data.name,
                        email: response.data.email,
                        phone: response.data.phone,
                        role: userRole,
                    }));

                    toast.success('تم تسجيل الدخول بنجاح');
                    
                    if (userRole === 'admin' || userRole === 'academy') {
                        window.location.href = '/academic';
                    } else {
                        window.location.href = '/student';
                    }
                } else {
                    toast.error('فشل تسجيل الدخول: استجابة غير صالحة');
                }
            } else {
                toast.error('فشل تسجيل الدخول: استجابة غير صالحة');
            }
        } catch (error: any) {
            let errorMessage = error.message || error.error || 'حدث خطأ أثناء تسجيل الدخول';

            if (error?.errors && typeof error.errors === 'object') {
                const firstKey = Object.keys(error.errors)[0];
                const firstVal = error.errors[firstKey];
                if (firstVal) {
                    errorMessage = Array.isArray(firstVal) ? firstVal[0] : firstVal;
                }
            }
            
            if (errorMessage === 'Invalid credentials' || errorMessage === 'Unauthorized' || errorMessage.toLowerCase().includes('credential')) {
                errorMessage = 'بيانات الدخول غير صحيحة (البريد الإلكتروني أو كلمة المرور غير صحيحة)';
            } else if (errorMessage === 'User not found' || errorMessage.toLowerCase().includes('user not found')) {
                errorMessage = 'المستخدم غير موجود، يرجى التأكد من البيانات';
            } else if (errorMessage.toLowerCase().includes('network error')) {
                errorMessage = 'حدث خطأ في الاتصال، يرجى التحقق من الشبكة';
            }

            setGeneralError(errorMessage);
            if (loginMethod === 'email') {
                setErrors({
                    email: errorMessage,
                    phone: '',
                    password: errorMessage
                });
            } else {
                setErrors({
                    email: '',
                    phone: errorMessage,
                    password: errorMessage
                });
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLoginMethod = (e: React.MouseEvent) => {
        e.preventDefault();
        setGeneralError('');
        setLoginMethod(prev => prev === 'email' ? 'phone' : 'email');
        setErrors({ email: '', phone: '', password: '' });
    };

    return {
        router,
        isLoading,
        showPassword,
        setShowPassword,
        loginMethod,
        selectedCountry,
        formData,
        generalError,
        errors,
        passwordCriteria,
        handleChange,
        handleLogin,
        toggleLoginMethod
    };
}
