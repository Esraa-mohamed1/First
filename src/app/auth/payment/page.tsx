import { CreditCard, Wallet } from "lucide-react";
import Image from "next/image";

export default function PaymentPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        اتمام الطلب والدفع
      </h1>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Right Section (White) - Payment Form */}
        <div className="flex-1 p-8 md:p-12">
          {/* Payment Methods */}
          <div className="space-y-4 mb-8">
            {/* Credit Card Option */}
            <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors border-blue-500 bg-blue-50/10">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>
                <span className="font-semibold text-gray-700">
                  الدفع عن طريق بطاقة الأتمان
                </span>
              </div>
              <div className="flex gap-2">
                {/* Visa/Mastercard logos would go here, using lucide for now */}
                <CreditCard className="w-6 h-6 text-blue-900" />
                <div className="w-8 h-5 bg-orange-500 rounded sm:w-10" /> 
              </div>
            </label>

            {/* Wallet Option */}
            <label className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                <span className="font-semibold text-gray-700">
                  الدفع عن طريق المحفظة الالكترونية
                </span>
              </div>
              <Wallet className="w-6 h-6 text-gray-400" />
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 block text-right">
                رقم بطاقة الأتمان
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 1234 1234 1234"
                  className="w-full p-3 pl-10 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                  dir="ltr"
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block text-right">
                  اسم البطاقة
                </label>
                <input
                  type="text"
                  placeholder="احمد محمد"
                  className="w-full p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block text-right">
                  تاريخ الأنتهاء
                </label>
                <input
                  type="text"
                  placeholder="12/22"
                  className="w-full p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  dir="ltr"
                />
              </div>
            </div>

             <div className="space-y-2 w-1/2">
                <label className="text-sm font-medium text-gray-600 block text-right">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="w-full p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="ltr"
                />
              </div>
          </div>
        </div>

        {/* Left Section (Blue) - Order Summary */}
        <div className="bg-blue-500 text-white p-8 md:p-12 w-full md:w-[350px] flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-blue-100 text-sm">البريد الالكتروني :</p>
              <p className="font-semibold text-lg" dir="ltr">Contact@academy.com</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-blue-100 text-sm">اسم الباقة :</p>
              <p className="font-semibold text-lg">البريميوم</p>
            </div>

            <div className="h-px bg-blue-400/50 my-4" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">تاريخ الاشتراك :</span>
                <span className="font-medium" dir="ltr">22/2/2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">مدة الاشتراك :</span>
                <span className="font-medium">3 شهور</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">السعر :</span>
                <span className="font-medium" dir="ltr">SAR 4,200</span>
              </div>
            </div>

            <div className="border-t border-dashed border-blue-300 my-4" />

            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-bold">الاجمالي</span>
              <span className="text-xl font-bold" dir="ltr">SAR 4,200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
