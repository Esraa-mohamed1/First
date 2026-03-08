'use client';

import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createAccountInfoAcademy } from "@/services/auth";
import toast from "react-hot-toast";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      // Assuming we stored pending registration data in localStorage
      const pendingData = localStorage.getItem('pendingRegistration');
      if (pendingData) {
        try {
          const data = JSON.parse(pendingData);
           // Let's assume for now we just show success and let them proceed to setup
          setSuccess(true);
        } catch (error) {
          console.error(error);
          toast.error('حدث خطأ في معالجة البيانات');
        } finally {
          setIsProcessing(false);
        }
      } else {
        // If no pending data, maybe just show success (webhook might have handled it)
        setSuccess(true);
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="bg-white rounded-[2rem] p-16 text-center shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-500">
        <h1 className="text-2xl font-bold mb-2">عملية الدفع</h1>
        
        {isProcessing ? (
          <div className="py-10">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">جاري التحقق من عملية الدفع...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-8">تمت عملية الدفع بنجاح</p>

            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
              <Check className="w-12 h-12 text-white stroke-[3]" />
            </div>

            <p className="text-gray-600 mb-8 font-medium">
              ابدأ في انشاء لوحة التحكم الخاصة بك
            </p>

            <Link
              href="/auth/setup"
              className="block w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-95"
            >
              ابدأ الآن
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh] w-full">جاري التحميل...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
