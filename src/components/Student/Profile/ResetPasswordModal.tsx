'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck, Send } from 'lucide-react';
import { resetPassword, forgetPassword } from '@/services/auth';
import toast from 'react-hot-toast';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const ResetPasswordModal = ({ isOpen, onClose, email: initialEmail }: ResetPasswordModalProps) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [generalError, setGeneralError] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    number: false,
    special: false,
  });

  // Keep email synced when prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setCode('');
      setPassword('');
      setConfirmPassword('');
      setGeneralError('');
      setErrors({ email: '', code: '', password: '', confirmPassword: '' });
      setPasswordCriteria({ length: false, number: false, special: false });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialEmail]);

  // Resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setErrors((prev) => ({ ...prev, password: '' }));

    setPasswordCriteria({
      length: val.length >= 8,
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(val),
    });
  };

  const handleSendOtp = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      setErrors((prev) => ({ ...prev, email: 'يرجى إدخال البريد الإلكتروني' }));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(targetEmail)) {
      setErrors((prev) => ({ ...prev, email: 'البريد الإلكتروني غير صالح' }));
      return;
    }

    setIsSendingOtp(true);
    setGeneralError('');
    try {
      await forgetPassword({ email: targetEmail });
      toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح!');
      setResendTimer(60);
    } catch (err: any) {
      console.error('Failed to send OTP in reset password modal:', err);
      let errMsg = err?.message || err?.error || 'فشل إرسال رمز التحقق، يرجى المحاولة لاحقاً';
      if (errMsg.toLowerCase().includes('user not found') || errMsg.toLowerCase().includes('email not found') || errMsg.includes('لا يوجد مستخدم')) {
        errMsg = 'البريد الإلكتروني غير مسجل لدينا';
      }
      setGeneralError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', code: '', password: '', confirmPassword: '' };

    if (!email.trim()) {
      newErrors.email = 'يرجى إدخال البريد الإلكتروني';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
      isValid = false;
    }

    if (!code.trim()) {
      newErrors.code = 'يرجى إدخال رمز التحقق';
      isValid = false;
    } else if (code.trim().length < 4) {
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
        email: email.trim(),
        code: code.trim(),
        token: code.trim(),
        otp: code.trim(),
        password,
        password_confirmation: confirmPassword,
      };

      await resetPassword(payload);

      toast.success('تم تغيير كلمة المرور بنجاح!', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });

      onClose();
    } catch (err: any) {
      console.error('Reset password error in modal:', err);
      let errorMessage = err?.message || err?.error || 'حدث خطأ أثناء إعادة تعيين كلمة المرور';

      if (
        errorMessage.toLowerCase().includes('invalid code') ||
        errorMessage.toLowerCase().includes('invalid token') ||
        errorMessage.toLowerCase().includes('code is invalid') ||
        errorMessage.includes('رمز التحقق غير صحيح')
      ) {
        errorMessage = 'رمز التحقق غير صحيح أو منتهي الصلاحية';
        setErrors((prev) => ({ ...prev, code: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('network error')) {
        errorMessage = 'حدث خطأ في الاتصال، يرجى التحقق من الشبكة';
      }

      setGeneralError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!isLoading && !isSendingOtp) onClose();
        }}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-gray-100 z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading || isSendingOtp}
          className="absolute left-6 top-6 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="إغلاق"
        >
          <X size={20} />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">تغيير كلمة المرور</h2>
          <p className="text-xs text-gray-500 font-medium">أدخل رمز التحقق المرسل لبريدك الإلكتروني وكلمة المرور الجديدة</p>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 mr-1">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                readOnly={!!initialEmail}
                placeholder="example@mail.com"
                dir="ltr"
                className={`w-full p-3.5 pl-11 text-right rounded-2xl outline-none font-medium text-sm transition-all ${
                  initialEmail
                    ? 'bg-gray-100 border border-gray-200 text-gray-600 cursor-not-allowed'
                    : 'bg-[#EAEFEF] border border-gray-100 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-800'
                } ${errors.email ? 'border-red-500' : ''}`}
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            {errors.email && <p className="text-red-500 text-xs font-bold mr-1">{errors.email}</p>}
          </div>

          {/* OTP Verification Code Field + Send Code Trigger */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mr-1">
              <label className="text-xs font-bold text-gray-700">رمز التحقق (OTP)</label>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp || resendTimer > 0}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline flex items-center gap-1 transition-colors"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : resendTimer > 0 ? (
                  <span>إعادة الإرسال بعد ({resendTimer}ث)</span>
                ) : (
                  <>
                    <Send size={12} />
                    <span>إرسال رمز التحقق</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ''));
                  if (errors.code) setErrors((prev) => ({ ...prev, code: '' }));
                }}
                maxLength={8}
                placeholder="أدخل رمز التحقق المستلم"
                dir="ltr"
                className={`w-full p-3.5 pl-11 text-right bg-[#EAEFEF] border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-sm text-gray-800 transition-all ${
                  errors.code ? 'border-red-500' : ''
                }`}
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            {errors.code && <p className="text-red-500 text-xs font-bold mr-1">{errors.code}</p>}
          </div>

          {/* New Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 mr-1">كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                dir="ltr"
                className={`w-full p-3.5 pl-11 pr-5 text-right bg-[#EAEFEF] border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-sm text-gray-800 transition-all ${
                  errors.password ? 'border-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-lg"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs font-bold mr-1">{errors.password}</p>}

            {/* Password Criteria Checklist */}
            {password && (
              <div className="bg-blue-50/50 p-2.5 rounded-2xl border border-blue-100 mt-2">
                <div className="flex flex-wrap gap-3 items-center justify-start text-xs font-bold" dir="rtl">
                  <div className={`flex items-center gap-1.5 transition-colors ${passwordCriteria.length ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passwordCriteria.length ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                      <CheckCircle2 size={10} />
                    </div>
                    <span>8 أحرف</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors ${passwordCriteria.number ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passwordCriteria.number ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                      <CheckCircle2 size={10} />
                    </div>
                    <span>رقم واحد</span>
                  </div>
                  <div className={`flex items-center gap-1.5 transition-colors ${passwordCriteria.special ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passwordCriteria.special ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                      <CheckCircle2 size={10} />
                    </div>
                    <span>رمز خاص</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 mr-1">تأكيد كلمة المرور</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="أعد إدخال كلمة المرور"
                dir="ltr"
                className={`w-full p-3.5 pl-11 pr-5 text-right bg-[#EAEFEF] border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-sm text-gray-800 transition-all ${
                  errors.confirmPassword ? 'border-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-lg"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs font-bold mr-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex flex-col gap-2.5 pt-3">
            <button
              type="submit"
              disabled={isLoading || isSendingOtp}
              className="w-full py-3.5 px-6 bg-[#0f62fe] hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>جاري التحديث...</span>
                </>
              ) : (
                <span>تحديث كلمة المرور</span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || isSendingOtp}
              className="w-full py-3 px-6 bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-2xl hover:bg-gray-100 transition-colors disabled:opacity-60"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
