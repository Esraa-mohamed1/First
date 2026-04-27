'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Mail, X, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendOtp, verifyOtp } from '@/services/auth';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VerificationModal = ({ isOpen, onClose, onSuccess }: VerificationModalProps) => {
  const [step, setStep] = useState<'initial' | 'otp' | 'success'>('initial');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [contact, setContact] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const userStr = localStorage.getItem('user_info');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setContact(user.email || user.phone);
          setCountryCode(user.country_code);
        } catch (e) {
          console.error('Failed to parse user info');
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!contact) {
      toast.error('لم يتم العثور على معلومات الاتصال');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(contact, countryCode || undefined);
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

    if (value && index < 5) {
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
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or the verify button
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const [errors, setErrors] = useState<string>('');

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setErrors('يرجى إدخال رمز التحقق كاملاً');
      return;
    }

    if (!contact) {
      toast.error('لم يتم العثور على معلومات الاتصال');
      return;
    }

    setErrors('');
    setLoading(true);
    try {
      const response = await verifyOtp(contact, code, countryCode || undefined);
      if (response.status) {
        toast.success('تم التحقق بنجاح');
        
        // Update local storage
        const userStr = localStorage.getItem('user_info');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            user.email_verified_at = new Date().toISOString();
            localStorage.setItem('user_info', JSON.stringify(user));
          } catch (e) {
            console.error('Failed to update local user info');
          }
        }
        
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setErrors(response.message || 'رمز التحقق غير صحيح');
      }
    } catch (error: any) {
      setErrors(error.message || 'فشل التحقق من الرمز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-transparent backdrop-blur-sm" dir="rtl">
      {/* Invisible but clickable backdrop overlay to close */}
      <div className="absolute inset-0 z-0" onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-xl bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] p-10 md:p-14 text-center animate-in fade-in zoom-in duration-300 border border-gray-100">
        
        <button 
          onClick={onClose}
          className="absolute top-10 left-10 p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all z-20"
        >
          <X size={26} />
        </button>

        {step === 'initial' && (
          <div className="space-y-10 mt-6">
            <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm transform hover:rotate-6 transition-transform">
              <ShieldCheck size={56} />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-gray-900">تأكيد الحساب</h2>
              <p className="text-gray-500 font-bold leading-relaxed max-w-md mx-auto text-lg">
                يرجى تأكيد حسابك لتتمكن من رفع فيديوهات دروس الأكاديمية وحفظها بأمان.
              </p>
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-70 text-xl"
            >
              {loading ? <Loader2 className="animate-spin" size={28} /> : <Mail size={28} />}
              إرسال رمز التحقق
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-10 mt-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-gray-900">أدخل الرمز</h2>
              <p className="text-gray-500 font-bold mb-1">
                الرمز المرسل إلى:
              </p>
              <p className="text-blue-600 font-black text-xl tracking-wide" dir="ltr">{contact}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center gap-3 md:gap-4" dir="ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      handleOtpChange(index, e.target.value);
                      if (errors) setErrors('');
                    }}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-16 md:w-18 md:h-24 border-2 rounded-[20px] text-center text-3xl font-black focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${errors ? 'border-red-500 bg-red-50/30' : 'border-gray-100 bg-gray-50 focus:border-blue-600 focus:bg-white'} text-gray-900`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {errors && <p className="text-red-500 font-black text-sm">{errors}</p>}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 text-xl"
            >
              {loading ? <Loader2 className="animate-spin" size={28} /> : 'تأكيد الرمز الآن'}
            </button>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="text-gray-400 font-black text-base hover:text-blue-600 transition-colors py-2 border-b-2 border-transparent hover:border-blue-100"
            >
              لم يصلك الرمز؟ إعادة الإرسال
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-10 py-10 animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-green-50 text-green-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 size={72} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900">تم بنجاح!</h2>
              <p className="text-gray-500 font-bold text-lg leading-relaxed">
                شكراً لك، تم التحقق من حسابك بنجاح. <br /> يمكنك الآن الاستمرار في رفع دروسك.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerificationModal;
