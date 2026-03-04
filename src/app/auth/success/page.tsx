import { Check } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="bg-white rounded-[2rem] p-16 text-center shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in duration-500">
        <h1 className="text-2xl font-bold mb-2">عملية الدفع</h1>
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
      </div>
    </div>
  );
}
