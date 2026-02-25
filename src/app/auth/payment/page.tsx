import { CreditCard, Wallet } from "lucide-react";
import Link from "next/link";

export default function PaymentPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto">
      {/* Outer Glassmorphism Container */}
      <div className="bg-white/85 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/50">
        <h1 className="text-3xl font-black text-center mb-10 text-gray-900">
          اتمام الطلب والدفع
        </h1>

        <div className="bg-white rounded-[2.5rem] shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-100">
          
          {/* Right Section (White) - Payment Form */}
          <div className="flex-1 p-8 md:p-12 order-1 md:order-1">
            {/* Payment Methods */}
            <div className="space-y-4 mb-10">
              {/* Credit Card Option (Selected) */}
              <label className="flex items-center justify-between p-5 border rounded-2xl cursor-pointer bg-white border-gray-200 hover:border-blue-500 transition-all group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-[6px] border-blue-500 bg-white" />
                  <span className="font-bold text-gray-800 text-lg">
                    الدفع عن طريق بطاقة الأتمان
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  {/* Visa/Mastercard Mockup */}
                  <div className="flex -space-x-2">
                     <div className="w-8 h-5 bg-[#1A1F71] rounded-md flex items-center justify-center text-[6px] text-white font-bold tracking-tighter">VISA</div>
                     <div className="w-8 h-5 bg-[#EB001B] rounded-md flex items-center justify-center text-[6px] text-white font-bold relative -z-10 opacity-80">MC</div>
                  </div>
                </div>
              </label>

              {/* Wallet Option (Unselected) */}
              <label className="flex items-center justify-between p-5 border rounded-2xl cursor-pointer bg-white border-gray-100 hover:border-gray-300 transition-all opacity-70 hover:opacity-100">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-transparent" />
                  <span className="font-bold text-gray-600 text-lg">
                    الدفع عن طريق المحفظة الالكترونية
                  </span>
                </div>
                <Wallet className="w-6 h-6 text-gray-400" />
              </label>
            </div>

            <div className="h-px bg-gray-100 mb-8" />

            {/* Form Fields */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-base font-bold text-gray-600 block text-right">
                  رقم بطاقة الأتمان
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    className="w-full p-4 pl-12 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-left font-medium text-gray-700 placeholder-gray-300"
                    dir="ltr"
                  />
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-3">
                  <label className="text-base font-bold text-gray-600 block text-right">
                    اسم البطاقة
                  </label>
                  <input
                    type="text"
                    placeholder="احمد محمد"
                    className="w-full p-4 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-right font-medium text-gray-700 placeholder-gray-300"
                  />
                </div>
                 <div className="space-y-3">
                  <label className="text-base font-bold text-gray-600 block text-right">
                    تاريخ الأنتهاء
                  </label>
                  <div className="relative">
                      <input
                        type="text"
                        placeholder="12/22"
                        className="w-full p-4 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-center font-medium text-gray-700 placeholder-gray-300"
                        dir="ltr"
                      />
                  </div>
                </div>
              </div>

               <div className="space-y-3 w-1/2">
                  <label className="text-base font-bold text-gray-600 block text-right">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    className="w-full p-4 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-center font-medium text-gray-700 placeholder-gray-300"
                    dir="ltr"
                  />
                </div>
            </div>

            <div className="mt-10">
              <Link 
                href="/auth/success"
                className="block w-full py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95 text-center"
              >
                إتمام عملية الدفع
              </Link>
            </div>
          </div>

          {/* Left Section (Blue) - Order Summary */}
          <div className="bg-blue-600 text-white p-8 md:p-12 w-full md:w-[400px] flex flex-col justify-between order-2 md:order-2 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -ml-16 -mb-16 pointer-events-none" />

            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <p className="text-blue-100 text-sm font-medium">البريد الالكتروني :</p>
                <p className="font-bold text-xl tracking-wide" dir="ltr">Contact@academy.com</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-blue-100 text-large font-bold font-large">اسم الباقة : البريميوم</p>
           
              </div>

              <div className="border-t-2 border border-blue-100/30 my-8" />

              <div className="space-y-5">
                <div className="flex justify-between items-center group">
                  <span className="text-blue-100 font-medium group-hover:text-white transition-colors">تاريخ الاشتراك :</span>
                  <span className="font-bold text-lg" dir="ltr">22/2/2026</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-blue-100 font-medium group-hover:text-white transition-colors">مدة الاشتراك :</span>
                  <span className="font-bold text-lg">3 شهور</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-blue-100 font-medium group-hover:text-white transition-colors">السعر :</span>
                  <span className="font-bold text-lg" dir="ltr">SAR 4,200</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-blue-40/30 my-6" />

              <div className="flex justify-between items-center pt-2">
                <span className="text-2xl font-black">الاجمالي</span>
                <span className="text-3xl font-black text-yellow-300 drop-shadow-sm" dir="ltr">SAR 4,200</span>
              </div>
            </div>

            <div className="mt-12 text-center text-blue-200 text-sm relative z-10">
                <p>جميع الحقوق محفوظة © 2026</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
