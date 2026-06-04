'use client';

import React from 'react';
import { Monitor, FileText, ChevronDown, X } from 'lucide-react';

interface CreateCourseModalPricingTabProps {
  pricingType: 'free' | 'paid';
  setPricingType: (type: 'free' | 'paid') => void;
  price: string;
  setPrice: (val: string) => void;
  currency: 'EGP' | 'SAR' | 'USD';
  setCurrency: (val: 'EGP' | 'SAR' | 'USD') => void;
  errors: Record<string, any>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  handleSave: () => Promise<void>;
}

export const CreateCourseModalPricingTab = ({
  pricingType,
  setPricingType,
  price,
  setPrice,
  currency,
  setCurrency,
  errors,
  setErrors,
  handleSave,
}: CreateCourseModalPricingTabProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-10 pt-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-gray-900">تحديد سعر الدورة</h2>
        <p className="text-gray-400 font-bold">اختر خطة التسعير المناسبة لدورتك</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div
          onClick={() => setPricingType('free')}
          className={`p-10 rounded-[32px] border-2 cursor-pointer transition-all text-center space-y-4 ${
            pricingType === 'free'
              ? 'border-blue-600 bg-blue-50/30'
              : 'border-gray-100 bg-white hover:border-blue-200'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
              pricingType === 'free' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
            }`}
          >
            <Monitor size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-900">مجاني</h3>
          <p className="text-sm font-bold text-gray-400">الدورة متاحة للجميع بدون مقابل مادي</p>
        </div>

        <div
          onClick={() => setPricingType('paid')}
          className={`p-10 rounded-[32px] border-2 cursor-pointer transition-all text-center space-y-4 ${
            pricingType === 'paid'
              ? 'border-blue-600 bg-blue-50/30'
              : 'border-gray-100 bg-white hover:border-blue-200'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
              pricingType === 'paid' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
            }`}
          >
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-900">مدفوع</h3>
          <p className="text-sm font-bold text-gray-400">حدد سعراً للدورة ليتمكن الطلاب من شرائها</p>
        </div>
      </div>

      {pricingType === 'paid' && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
          <label className="block text-sm font-black text-gray-900">سعر الدورة</label>
          <div className="relative group">
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
              }}
              placeholder="0.00"
              className={`w-full p-5 bg-white border ${
                errors.price ? 'border-red-500 bg-red-50/30' : 'border-gray-100'
              } rounded-2xl outline-none focus:border-blue-600 font-bold text-left transition-all pl-24 text-gray-900 shadow-sm`}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-100 pr-4">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-transparent font-black text-blue-600 outline-none cursor-pointer text-sm text-gray-900 appearance-none hover:text-blue-700 transition-colors"
              >
                <option value="SAR" className="text-gray-900">
                  SAR - Saudi Riyal (ر.س)
                </option>
                <option value="EGP" className="text-gray-900">
                  EGP - Egyptian Pound (ج.م)
                </option>
                <option value="USD" className="text-gray-900">
                  USD - United States Dollar ($)
                </option>
              </select>
              <ChevronDown size={14} className="text-blue-600 pointer-events-none" />
            </div>
          </div>
          {errors.price && (
            <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
              <X size={12} />
              {errors.price}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-center pt-10">
        <button
          onClick={handleSave}
          className="w-full max-w-[400px] py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all"
        >
          حفظ بيانات التسعير
        </button>
      </div>
    </div>
  );
};
