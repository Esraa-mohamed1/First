'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Mail, Hash, X, Upload, Check, Copy, Loader2, FileText, AlertCircle, Eye, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { showAlert } from '@/lib/sweetalert';
import { enrollInCourse } from '@/services/student-courses';
import { AcademyPaymentMethod } from '@/types/payment';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: AcademyPaymentMethod;
  courseId: string | number;
  coursePrice: number | string;
  courseCurrency: string;
}

export const PaymentMethodModal = ({
  isOpen,
  onClose,
  method,
  courseId,
  coursePrice,
  courseCurrency,
}: PaymentMethodModalProps) => {
  const [copied, setCopied] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Clean up URL object when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setScreenshot(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(method.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for file validation and setting
  const processFile = (file: File) => {
    // 1. Check file size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showAlert.error('حجم الملف كبير جداً', 'الحد الأقصى لحجم إيصال التحويل هو 5 ميجابايت');
      return;
    }

    // 2. Check format (PDF or Image)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      showAlert.error('صيغة غير مدعومة', 'يرجى رفع إيصال التحويل بصيغة صورة (PNG, JPG) أو ملف PDF فقط');
      return;
    }

    setScreenshot(file);

    // 3. Create preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      // PDF or non-image
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScreenshot(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Receipt is strictly mandatory
    if (!screenshot) {
      showAlert.error('مطلوب إرفاق الإيصال', 'يرجى رفع صورة أو ملف إيصال التحويل البنكي لإتمام الطلب');
      return;
    }

    setLoading(true);
    try {
      // Submit multipart payload to backend via service
      await enrollInCourse(courseId, method.methodId, screenshot);

      await showAlert.success(
        'تم إرسال طلب التسجيل بنجاح ✅',
        'سيتم مراجعة إيصال التحويل وتفعيل الدورة في حسابك خلال دقائق معدودة.'
      );
      handleCloseModal();
    } catch (error: any) {
      showAlert.error('فشل الإرسال', error?.message || 'حدث خطأ أثناء إرسال إيصال الدفع، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (method.type) {
      case 'mobile': return <Smartphone size={24} />;
      case 'email': return <Mail size={24} />;
      case 'account_number':
      default:
        return <Hash size={24} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-gray-100"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              {getIcon()}
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">{method.methodName}</h2>
              <p className="text-xs text-gray-500 font-bold">تأكيد تحويل الرسوم والالتحاق</p>
            </div>
          </div>
          <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-950">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">

          {/* Payment Notice Box */}
          <div className="bg-blue-50/70 p-5 rounded-3xl border border-blue-100/50 space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs font-black text-blue-500 uppercase tracking-wide">المبلغ المطلوب تحويله</p>
              <p className="text-2xl font-black text-blue-900">
                {coursePrice} <span className="text-sm font-black">{courseCurrency}</span>
              </p>
            </div>

            <div className="space-y-1.5 bg-white p-4 rounded-2xl border border-blue-200/60 shadow-sm">
              <span className="text-[10px] text-gray-400 font-bold block">رقم الحساب / رقم المحفظة للتعبئة</span>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-base font-black text-gray-900 tracking-wider break-all select-all">{method.value}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all active:scale-95 shrink-0"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'تم النسخ' : 'نسخ الرقم'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Safe Instruction */}
            <div className="flex items-start gap-2.5 text-xs text-gray-500 font-bold leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <ShieldCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <span>يرجى إرفاق نسخة واضحة من إيصال التحويل (صورة أو ملف PDF) متضمنة رقم المعاملة والتاريخ ليتم التحقق وتنشيط حسابك فوراً.</span>
            </div>

            {/* Receipt Upload Zone */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-700 flex items-center gap-1">
                <span>ملف أو صورة إيصال التحويل</span>
                <span className="text-red-500 font-black">*</span>
              </label>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('screenshot-upload')?.click()}
                className={clsx(
                  "border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 relative overflow-hidden min-h-[160px]",
                  dragActive ? "border-blue-600 bg-blue-50/20" : "",
                  screenshot ? "border-green-400 bg-green-50/10 hover:border-green-500" : "border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50/5"
                )}
              >
                <input
                  id="screenshot-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {screenshot ? (
                  <div className="w-full flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                    {previewUrl ? (
                      <div className="relative w-28 h-20 rounded-2xl border border-green-200 overflow-hidden shadow-sm">
                        <img src={previewUrl} alt="Receipt Preview" className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                        <FileText size={28} />
                      </div>
                    )}

                    <div className="text-center space-y-1">
                      <span className="text-sm font-black text-gray-900 block max-w-[260px] truncate">{screenshot.name}</span>
                      <span className="text-[10px] text-gray-400 block font-bold">{(screenshot.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-black rounded-lg transition-all"
                    >
                      إزالة الملف
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 text-gray-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Upload size={20} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-black text-gray-900">اضغط لرفع الإيصال أو اسحبه إلى هنا</p>
                      <p className="text-[10px] text-gray-400 font-bold">يدعم ملفات الصور و PDF حتى 5 ميجابايت</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : null}
            <span>{loading ? 'جاري إرسال الإيصال وتأكيد الطلب...' : 'إرسال طلب التسجيل'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
