'use client';

import React from 'react';
import { PaymentMethod } from '@/types/payment';
import { getLogoUrl } from '@/lib/utils';
import { Check, Landmark } from 'lucide-react';

interface PaymentMethodDropdownProps {
  options: PaymentMethod[];
  selectedValues: string[];
  onChange: (selectedIds: string[]) => void;
  error?: string;
}

export const PaymentMethodDropdown = ({
  options,
  selectedValues,
  onChange,
  error,
}: PaymentMethodDropdownProps) => {
  return (
    <div className="space-y-3" dir="rtl">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-black text-slate-800 text-right">
          وسائل الدفع المقبولة <span className="text-red-500">*</span>
        </label>
        <span className={`text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
          selectedValues.length === 3 
            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
            : selectedValues.length > 0 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          تم اختيار {selectedValues.length} من 3
        </span>
      </div>
      
      {options.length === 0 ? (
        <div className="text-center p-8 bg-slate-50 border border-slate-100 rounded-2xl">
          <p className="text-sm font-bold text-slate-400">لا توجد وسائل دفع نشطة. يرجى تهيئة وسائل الدفع في إعدادات المالية أولاً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-right">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.id.toString());
            
            const handleToggle = () => {
              if (isSelected) {
                onChange(selectedValues.filter(val => val !== option.id.toString()));
              } else {
                onChange([...selectedValues, option.id.toString()]);
              }
            };
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={handleToggle}
                className={`p-4 rounded-2xl border-2 text-right transition-all duration-300 relative flex items-start gap-3 group focus:outline-none w-full ${
                  isSelected 
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50/40 to-blue-100/20 shadow-md shadow-blue-600/5 ring-1 ring-blue-600/20' 
                    : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm'
                }`}
              >
                {/* Selected Checkmark Indicator */}
                <div className={`absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isSelected 
                    ? 'bg-blue-600 border-blue-600 text-white scale-100 shadow-sm' 
                    : 'border-slate-200 bg-white scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-95'
                }`}>
                  <Check size={10} strokeWidth={3} />
                </div>
                
                {/* Method Logo */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border transition-all shrink-0 ${
                  isSelected ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200'
                }`}>
                  {option.logo ? (
                    <img src={getLogoUrl(option.logo)} alt={option.name} className="w-full h-full object-cover" />
                  ) : (
                    <Landmark size={18} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                  )}
                </div>
                
                {/* Method Text */}
                <div className="flex-1 min-w-0 pr-1 pl-6">
                  <h4 className={`font-bold text-xs md:text-sm leading-snug whitespace-normal break-words transition-colors ${
                    isSelected ? 'text-blue-900 font-extrabold' : 'text-slate-700'
                  }`}>
                    {option.name}
                  </h4>
                  <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded font-extrabold mt-2 tracking-wider uppercase transition-colors ${
                    isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {option.currency || 'SAR'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      
      {error && <p className="text-red-500 text-xs font-bold mt-1 text-right">{error}</p>}
    </div>
  );
};
