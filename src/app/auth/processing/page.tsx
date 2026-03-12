'use client';

import { Check } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProcessingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/?action=login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="bg-white rounded-[2rem] p-16 text-center shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-500">
   
        <h1 className="text-2xl font-bold mb-8">
          يتم انشاء لوحة التحكم الخاص بك
        </h1>

        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center bg-blue-500 rounded-full shadow-lg shadow-blue-500/30">
            <Check className="w-16 h-16 text-white stroke-[3]" />
          </div>
        </div>
        
        <p className="text-gray-500 animate-pulse">جاري المعالجة...</p>
      </div>
    </div>
  );
}
