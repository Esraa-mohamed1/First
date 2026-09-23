import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/context/ModalContext';
import { login } from '@/services/auth';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { useCountry } from '@/hooks/useCountry';
import { triggerPageLoader } from '@/components/PageLoader';

export function useLoginModalState() {
    const { isOpen, view, closeModal, openModal } = useModal();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const { selectedCountry } = useCountry();

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        password: ''
    });

    // Password validation state
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        number: false,
        special: false
    });

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Google Login Success:', tokenResponse);
            setIsLoading(true);
            try {
                toast.success('تم تسجيل الدخول بجوجل بنجاح');
                document.cookie = `token=google_simulated_token; path=/; max-age=86400; SameSite=Lax`;
                closeModal();
                if (typeof window !== 'undefined') {
                    const hostname = window.location.hostname;
                    const isTenant = hostname && 
                                     hostname !== 'darab.academy' && 
                                     hostname !== 'www.darab.academy' && 
                                     hostname !== 'localhost' && 
                                     !hostname.startsWith('127.0.0.');
                    
                    if (isTenant || window.location.pathname.startsWith('/student') || !window.location.pathname.startsWith('/auth')) {
                        const event = new CustomEvent('student-logged-in');
                        window.dispatchEvent(event);
                        return;
                    }
                }
                triggerPageLoader(true);
                window.location.href = '/dashboard';
            } catch (error) {
                toast.error('فشل تسجيل الدخول بجوجل');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            console.error('Google Login Error');
            toast.error('فشل الاتصال بحساب جوجل. تأكد من إعداد "Redirect URI" في لوحة تحكم جوجل');
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
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

    const handleLogin = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const payload = loginMethod === 'email' 
                ? { email: formData.email, password: formData.password }
                : { phone: formData.phone, password: formData.password, country_code: selectedCountry?.isoCode };

            const response = await login(payload);
            const res = response as any;

            const token = res?.meta?.access_token || res?.token || res?.access_token || res?.data?.token || res?.data?.access_token;

            if (token) {
                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
                localStorage.setItem('token', token);
                
                const user = res?.data?.user || res?.data || res?.user || {};
                const userRole = user.role || 'student';

                localStorage.setItem('user_info', JSON.stringify({
                    name: user.name || 'User',
                    email: user.email || formData.email,
                    phone: user.phone || formData.phone,
                    role: userRole
                }));
                
                toast.success('تم تسجيل الدخول بنجاح');
                closeModal();

                if (typeof window !== 'undefined') {
                    // Dispatch student-logged-in event so single course UI and subscription flow proceed immediately
                    window.dispatchEvent(new CustomEvent('student-logged-in'));

                    const pathname = window.location.pathname;
                    const isCoursePage = pathname.includes('/course') || pathname.includes('/bags') || pathname.startsWith('/[slug]');
                    if (!isCoursePage) {
                        triggerPageLoader(true);
                        if (userRole === 'admin' || userRole === 'academy') {
                            window.location.href = '/academic';
                        } else {
                            window.location.href = '/student';
                        }
                    }
                }
            } else {
                toast.error('فشل تسجيل الدخول: استجابة غير صالحة من الخادم');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            let errorMessage = error.message || error.error || 'حدث خطأ أثناء تسجيل الدخول';

            if (error?.errors && typeof error.errors === 'object') {
                const firstKey = Object.keys(error.errors)[0];
                const firstVal = error.errors[firstKey];
                if (firstVal) {
                    errorMessage = Array.isArray(firstVal) ? firstVal[0] : firstVal;
                }
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            if (
                errorMessage === 'Invalid credentials' ||
                errorMessage === 'Unauthorized' ||
                errorMessage.toLowerCase().includes('credential') ||
                errorMessage.toLowerCase().includes('unauthorized')
            ) {
                errorMessage = 'بيانات الدخول غير صحيحة (البريد الإلكتروني أو كلمة المرور غير صحيحة)';
            } else if (errorMessage === 'User not found' || errorMessage.toLowerCase().includes('user not found')) {
                errorMessage = 'المستخدم غير موجود، يرجى التأكد من البيانات أو إنشاء حساب جديد';
            } else if (errorMessage.toLowerCase().includes('network error')) {
                errorMessage = 'حدث خطأ في الاتصال، يرجى التحقق من الشبكة';
            }

            if (loginMethod === 'email') {
                setErrors(prev => ({
                    ...prev,
                    email: errorMessage,
                    password: errorMessage
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    phone: errorMessage,
                    password: errorMessage
                }));
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLoginMethod = (e: React.MouseEvent) => {
        e.preventDefault();
        setLoginMethod(prev => prev === 'email' ? 'phone' : 'email');
        setErrors({ email: '', phone: '', password: '' });
    };

    return {
        isOpen,
        view,
        closeModal,
        openModal,
        isLoading,
        showPassword,
        setShowPassword,
        loginMethod,
        formData,
        errors,
        passwordCriteria,
        handleGoogleLogin,
        handleChange,
        handleLogin,
        toggleLoginMethod
    };
}
