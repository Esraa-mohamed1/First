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

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!contact) {
      toast.error('لم يتم العثور على معلومات الاتصال');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(contact);
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
      const response = await verifyOtp(contact, code);
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
        toast.error(response.message || 'رمز التحقق غير صحيح');
      }
    } catch (error: any) {
      toast.error(error.message || 'فشل التحقق من الرمز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" dir="rtl">
      <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 text-center animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-8 left-8 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
        >
          <X size={24} />
        </button>

        {step === 'initial' && (
          <div className="space-y-8 mt-4">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">تأكيد الحساب</h2>
              <p className="text-gray-500 font-bold leading-relaxed max-w-md mx-auto">
                يرجى تأكيد حسابك لتتمكن من رفع فيديوهات دروس الأكاديمية وحفظها بأمان.
              </p>
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Mail size={24} />}
              إرسال رمز التحقق إلى بريدي
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-8 mt-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">أدخل رمز التحقق</h2>
              <p className="text-gray-500 font-bold mb-2">
                تم إرسال رمز التحقق إلى:
              </p>
              <p className="text-blue-600 font-black text-lg" dir="ltr">{contact}</p>
            </div>

            <div className="flex justify-center gap-2 md:gap-3" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-16 md:w-16 md:h-20 border-2 border-gray-100 rounded-2xl text-center text-2xl md:text-3xl font-black focus:border-blue-600 focus:bg-blue-50/30 outline-none transition-all bg-gray-50 text-gray-900"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'تأكيد الرمز وتفعيل الحساب'}
            </button>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="text-gray-400 font-bold text-sm hover:text-blue-600 transition-colors"
            >
              لم يصلك الرمز؟ إعادة الإرسال
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-8 py-10 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 size={56} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">تم التفعيل بنجاح!</h2>
              <p className="text-gray-500 font-bold">
                شكراً لك، تم التحقق من حسابك بنجاح. يمكنك الآن الاستمرار في رفع دروسك.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerificationModal;
