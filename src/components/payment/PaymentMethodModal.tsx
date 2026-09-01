'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone, Mail, Hash, X, Upload, Check, Copy, Loader2,
  FileText, ShieldCheck, ChevronRight, ArrowRight, CreditCard, Landmark
} from 'lucide-react';
import { clsx } from 'clsx';
import { showAlert } from '@/lib/sweetalert';
import { enrollInCourse } from '@/services/student-courses';
import { AcademyPaymentMethod } from '@/types/payment';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  methods: AcademyPaymentMethod[];
  courseId: string | number;
  coursePrice: number | string;
  courseCurrency: string;
  onSuccess?: () => void | Promise<void>;
}

export const PaymentMethodModal = ({
  isOpen,
  onClose,
  methods,
  courseId,
  coursePrice,
  courseCurrency,
  onSuccess,
}: PaymentMethodModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMethod, setSelectedMethod] = useState<AcademyPaymentMethod | null>(null);
  const [copied, setCopied] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedMethod(null);
      setCopied(false);
      setScreenshot(null);
      if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    } else if (methods && methods.length === 1) {
      setSelectedMethod(methods[0]);
      setStep(2);
    }
  }, [isOpen, methods]);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleClose = () => onClose();

  const handleProceedToUpload = () => {
    if (!selectedMethod) {
      showAlert.error('اختر وسيلة الدفع', 'يرجى اختيار وسيلة دفع أولاً');
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setScreenshot(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
  };

  const handleCopy = () => {
    if (!selectedMethod) return;
    navigator.clipboard.writeText(selectedMethod.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showAlert.error('حجم الملف كبير جداً', 'الحد الأقصى 5 ميجابايت');
      return;
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type) && !file.type.startsWith('image/')) {
      showAlert.error('صيغة غير مدعومة', 'يرجى رفع صورة PNG/JPG أو PDF');
      return;
    }
    setScreenshot(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setScreenshot(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) { showAlert.error('مطلوب الإيصال', 'يرجى رفع صورة الإيصال'); return; }
    if (!selectedMethod) return;
    setLoading(true);
    try {
      const receiverAccountId = selectedMethod.methodId || (selectedMethod as any)?.id || (selectedMethod as any)?.receiver_account_id || (selectedMethod as any)?.receiverAccountId;
      await enrollInCourse(courseId, selectedMethod.methodId, screenshot, receiverAccountId);
      if (onSuccess) {
        try {
          await onSuccess();
        } catch (callbackErr) {
          console.error('onSuccess callback failed:', callbackErr);
        }
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('course-subscription-updated', { detail: { courseId: String(courseId) } }));
      }
      await showAlert.success('تم إرسال طلب التسجيل ✅', 'سيتم مراجعة الإيصال وتفعيل الدورة قريباً.');
      handleClose();
    } catch (error: any) {
      showAlert.error('فشل الإرسال', error?.message || 'حدث خطأ، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t === 'mobile' || t.includes('cash') || t.includes('wallet') || t === 'vodafone_cash') {
      return <Smartphone size={20} />;
    }
    if (t === 'email') {
      return <Mail size={20} />;
    }
    if (t.includes('bank') || t === 'bank_account' || t === 'instapay' || t === 'landmark') {
      return <Landmark size={20} />;
    }
    return <CreditCard size={20} />;
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
      dir="rtl"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70 shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={handleBack} className="p-1.5 rounded-xl hover:bg-gray-200 transition text-gray-500">
                <ArrowRight size={17} />
              </button>
            )}
            <div>
              <h2 className="text-sm font-black text-gray-900">
                {step === 1 ? 'اختر وسيلة الدفع' : 'رفع إيصال التحويل'}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">الخطوة {step} من 2</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className={clsx('h-1.5 rounded-full transition-all', step >= 1 ? 'w-7 bg-blue-600' : 'w-4 bg-gray-200')} />
              <span className={clsx('h-1.5 rounded-full transition-all', step >= 2 ? 'w-7 bg-blue-600' : 'w-4 bg-gray-200')} />
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Step 1: Choose method ── */}
        {step === 1 && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="p-6 overflow-y-auto flex-1 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                <p className="text-[11px] text-blue-500 font-black uppercase tracking-wide mb-1">المبلغ المطلوب</p>
                <p className="text-2xl font-black text-blue-900">{coursePrice} <span className="text-sm font-bold">{courseCurrency}</span></p>
              </div>
              {methods.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <CreditCard size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-bold text-sm">لا توجد وسائل دفع متاحة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-black text-gray-500">اختر الحساب الذي ستحوّل إليه:</p>
                  {methods.map((m) => {
                    const isSel = selectedMethod?.methodId === m.methodId;
                    return (
                      <button
                        key={m.methodId}
                        type="button"
                        onClick={() => setSelectedMethod(m)}
                        className={clsx(
                          'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-right',
                          isSel ? 'border-blue-600 bg-blue-50/60 shadow-sm' : 'border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50/20'
                        )}
                      >
                        <div className={clsx(
                          'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all overflow-hidden p-1.5 bg-white border shadow-sm',
                          isSel ? 'border-blue-600 ring-4 ring-blue-500/15 text-blue-600 shadow-md' : 'border-gray-200 text-gray-500'
                        )}>
                          {m.logo && !imageErrors[m.methodId] ? (
                            <img 
                              src={m.logo} 
                              alt={m.methodName} 
                              className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]" 
                              onError={() => setImageErrors(prev => ({ ...prev, [m.methodId]: true }))}
                            />
                          ) : (
                            getIcon(m.type)
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <p className={clsx('font-black text-sm', isSel ? 'text-blue-800' : 'text-gray-800')}>{m.methodName}</p>
                          <p className="font-mono text-xs text-gray-400 truncate mt-0.5">{m.value}</p>
                        </div>
                        <div className={clsx('w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all', isSel ? 'border-blue-600 bg-blue-600' : 'border-gray-300')}>
                          {isSel && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-100 shrink-0">
              <button
                type="button"
                onClick={handleProceedToUpload}
                disabled={!selectedMethod}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15"
              >
                <span>التالي — رفع الإيصال</span>
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Upload receipt ── */}
        {step === 2 && selectedMethod && (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="p-6 overflow-y-auto flex-1 space-y-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Amount + account */}
              <div className="bg-blue-50/70 rounded-2xl p-6 border border-blue-100/60 space-y-4 shadow-sm">
                <div className="text-center">
                  <p className="text-[11px] text-blue-500 font-black uppercase tracking-wide mb-1">المبلغ المطلوب تحويله</p>
                  <p className="text-2xl font-black text-blue-900">{coursePrice} <span className="text-sm font-bold">{courseCurrency}</span></p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-blue-200/70 flex items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {selectedMethod.logo && !imageErrors[selectedMethod.methodId] ? (
                      <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
                        <img src={selectedMethod.logo} alt={selectedMethod.methodName} className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                        {getIcon(selectedMethod.type)}
                      </div>
                    )}
                    <div className="min-w-0 text-right">
                      <span className="text-[11px] text-gray-400 font-bold block mb-1">{selectedMethod.methodName}</span>
                      <span className="font-mono text-base font-black text-gray-900 select-all break-all">{selectedMethod.value}</span>
                    </div>
                  </div>
                  <button type="button" onClick={handleCopy} className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition shrink-0 shadow-md shadow-blue-500/10">
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'تم' : 'نسخ'}
                  </button>
                </div>
              </div>

              {/* Tip */}
              <div className="flex items-start gap-2.5 text-xs text-gray-500 font-bold bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <ShieldCheck size={15} className="text-blue-500 shrink-0 mt-0.5" />
                <span>أرفق صورة واضحة من إيصال التحويل تتضمن رقم المعاملة والتاريخ لتفعيل الدورة فوراً.</span>
              </div>

              {/* Upload zone */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 flex items-center gap-1">
                  صورة الإيصال <span className="text-red-500">*</span>
                </label>
                <div
                  onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                  onClick={() => document.getElementById('pay-receipt-upload')?.click()}
                  className={clsx(
                    'border-2 border-dashed rounded-3xl p-7 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[150px]',
                    dragActive ? 'border-blue-500 bg-blue-50/30' : '',
                    screenshot ? 'border-green-400 bg-green-50/10 hover:border-green-500' : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/10'
                  )}
                >
                  <input id="pay-receipt-upload" type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
                  {screenshot ? (
                    <div className="w-full flex flex-col items-center gap-3">
                      {previewUrl
                        ? <div className="w-28 h-20 rounded-2xl border border-green-200 overflow-hidden shadow-sm"><img src={previewUrl} alt="Receipt" className="object-cover w-full h-full" /></div>
                        : <div className="w-12 h-12 rounded-xl bg-red-50 text-red-400 flex items-center justify-center"><FileText size={24} /></div>
                      }
                      <div className="text-center">
                        <p className="text-sm font-black text-gray-900 max-w-[240px] truncate">{screenshot.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">{(screenshot.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <button type="button" onClick={removeFile} className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-black rounded-lg transition">إزالة الملف</button>
                    </div>
                  ) : (
                    <>
                      <div className="w-11 h-11 bg-white rounded-xl border border-gray-100 text-gray-400 flex items-center justify-center shadow-sm"><Upload size={20} /></div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-black text-gray-800">اضغط لرفع الإيصال أو اسحبه هنا</p>
                        <p className="text-[10px] text-gray-400 font-bold">PNG، JPG، PDF — حتى 5 MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 shrink-0">
              <button
                type="submit"
                disabled={loading || !screenshot}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15"
              >
                {loading ? <><Loader2 className="animate-spin" size={20} /> جاري الإرسال...</> : 'إرسال طلب التسجيل'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
