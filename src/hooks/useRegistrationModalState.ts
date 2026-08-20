import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/context/ModalContext';
import { createAccount } from '@/services/auth';
import { registerStudent } from '@/services/student-auth';
import toast from 'react-hot-toast';
import { useCountry } from '@/hooks/useCountry';
import { translateErrorToArabic } from '@/lib/utils';

export function useRegistrationModalState() {
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

    useEffect(() => {
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
        handleComplete();
    };

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
            let isStudent = false;
            if (typeof window !== 'undefined') {
                const hostname = window.location.hostname;
                const isTenantSubdomain = hostname &&
                                 hostname !== 'darab.academy' &&
                                 hostname !== 'www.darab.academy' &&
                                 hostname !== 'localhost' &&
                                 !hostname.startsWith('127.0.0.');

                if (isTenantSubdomain || window.location.pathname.startsWith('/student')) {
                    isStudent = true;
                }
            }

            let response;
            if (isStudent) {
                const name = contactMethod === 'email' ? formData.email.split('@')[0] : formData.phone;
                response = await registerStudent({
                    name,
                    email: contactMethod === 'email' ? formData.email : undefined,
                    phone: contactMethod === 'phone' ? formData.phone : undefined,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword,
                    role: 'student'
                });

                const resObj: any = response;
                let token = resObj.data?.token || resObj.token || resObj.data?.access_token || resObj.access_token;
                if (!token && resObj.meta?.access_token) {
                    token = resObj.meta.access_token;
                }
                if (!token && resObj.data?.meta?.access_token) {
                    token = resObj.data.meta.access_token;
                }

                if (token) {
                    localStorage.setItem('token', token);
                    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
                }

                toast.success('تم إنشاء الحساب بنجاح');
                handleComplete();
            } else {
                // Academy User: Defer createAccount until Setup Info submission
                const accountPayload: any = {
                    name: (contactMethod === 'email' ? formData.email.split('@')[0] : formData.phone),
                    academy_name: (contactMethod === 'email' ? formData.email.split('@')[0] : formData.phone) + "'s Academy",
                    password: formData.password,
                    package_id: data?.package_id,
                    contactMethod
                };

                if (contactMethod === 'email') {
                    accountPayload.email = formData.email;
                } else {
                    accountPayload.phone = formData.phone;
                    accountPayload.country_code = selectedCountry?.isoCode;
                }

                localStorage.setItem('registration_method', contactMethod);
                localStorage.setItem('pending_registration', JSON.stringify(accountPayload));
                localStorage.removeItem('user_info');
                localStorage.removeItem('token');
                document.cookie = `token=; path=/; max-age=0; SameSite=Lax`;

                if (contactMethod === 'email') {
                    localStorage.setItem('user_email', formData.email);
                    localStorage.removeItem('user_phone');
                    document.cookie = `backup_email=${encodeURIComponent(formData.email)}; path=/; max-age=3600; SameSite=Lax`;
                    document.cookie = `backup_phone=; path=/; max-age=0; SameSite=Lax`;
                } else {
                    localStorage.setItem('user_phone', formData.phone);
                    localStorage.removeItem('user_email');
                    document.cookie = `backup_phone=${encodeURIComponent(formData.phone)}; path=/; max-age=3600; SameSite=Lax`;
                    document.cookie = `backup_email=; path=/; max-age=0; SameSite=Lax`;
                }
                localStorage.setItem('user_password', formData.password);
                document.cookie = `backup_password=${encodeURIComponent(formData.password)}; path=/; max-age=3600; SameSite=Lax`;

                handleComplete();
            }
        } catch (error: any) {
            if (error?.errors && typeof error.errors === 'object') {
                const serverErrors: typeof errors = { email: '', phone: '', password: '', confirmPassword: '' };
                const errObj = error.errors as Record<string, string | string[]>;

                const getFirst = (v: string | string[]) => (Array.isArray(v) ? v[0] : v) || '';

                if (errObj.email) serverErrors.email = translateErrorToArabic(getFirst(errObj.email));
                if (errObj.phone) serverErrors.phone = translateErrorToArabic(getFirst(errObj.phone));
                if (errObj.password) serverErrors.password = translateErrorToArabic(getFirst(errObj.password));
                if (errObj.password_confirmation) serverErrors.confirmPassword = translateErrorToArabic(getFirst(errObj.password_confirmation));

                setErrors(serverErrors);

                const allMsgs = Object.values(errObj).map(v => translateErrorToArabic(getFirst(v))).filter(Boolean);
                toast.error(allMsgs.length > 0 ? allMsgs[0] : (translateErrorToArabic(error.message) || 'حدث خطأ أثناء إدخال البيانات'));
            } else {
                toast.error(translateErrorToArabic(error.message || 'حدث خطأ أثناء إدخال البيانات'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const prevStep = () => setStep(step - 1);

    const handleComplete = () => {
        closeModal();
        
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('student-registered');
            window.dispatchEvent(event);

            window.location.href = '/auth/setup';
        } else {
            router.push('/auth/setup');
        }
    };

    const toggleContactMethod = (e: React.MouseEvent) => {
        e.preventDefault();
        setContactMethod(prev => prev === 'email' ? 'phone' : 'email');
        setErrors(prev => ({ ...prev, email: '', phone: '' }));
    };

    return {
        isOpen,
        view,
        closeModal,
        openModal,
        step,
        isLoading,
        contactMethod,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        formData,
        errors,
        passwordCriteria,
        otp,
        otpRefs,
        handleOtpChange,
        handleOtpKeyDown,
        handleVerifyRegistration,
        handleChange,
        handleNextStep,
        prevStep,
        handleComplete,
        toggleContactMethod
    };
}
