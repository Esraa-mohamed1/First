'use client';

import React, { useState } from 'react';
import { Smartphone, Mail, Hash, KeyRound, Eye, EyeOff } from 'lucide-react';
import { PaymentMethodType } from '@/types/payment';
import { clsx } from 'clsx';

interface PaymentMethodValueInputProps {
  type: PaymentMethodType;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onTypeChange?: (newType: PaymentMethodType) => void;
}

export const PaymentMethodValueInput = ({
  type,
  label,
  value,
  onChange,
  error,
  onTypeChange,
}: PaymentMethodValueInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'mobile': return <Smartphone className="text-gray-400" size={18} />;
      case 'email': return <Mail className="text-gray-400" size={18} />;
      case 'account_number': return <Hash className="text-gray-400" size={18} />;
      case 'password': return <KeyRound className="text-gray-400" size={18} />;
      default: return <Hash className="text-gray-400" size={18} />;
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'mobile': return '01xxxxxxxxx';
      case 'email': return 'example@mail.com';
      case 'account_number': return 'أدخل رقم الحساب...';
      case 'password': return 'أدخل كلمة المرور...';
      default: return 'أدخل القيمة...';
    }
  };

  const getInputType = () => {
    if (type === 'email') return 'email';
    if (type === 'password') return showPassword ? 'text' : 'password';
    return 'text';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {onTypeChange && (
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value as PaymentMethodType)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-600 outline-none focus:border-blue-500"
          >
            <option value="mobile">رقم موبايل</option>
            <option value="email">بريد إلكتروني</option>
            <option value="account_number">رقم حساب</option>
            <option value="password">كلمة مرور</option>
          </select>
        )}
      </div>
      <div className="relative group">
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
          {getIcon()}
        </div>
        <input
          type={getInputType()}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={getPlaceholder()}
          className={clsx(
            'w-full pr-10 py-2 rounded-xl border transition-all outline-none text-left',
            type === 'password' ? 'pl-10' : 'pl-4',
            error 
              ? 'border-red-500 focus:ring-4 focus:ring-red-50' 
              : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
          )}
          dir="ltr"
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 left-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};
