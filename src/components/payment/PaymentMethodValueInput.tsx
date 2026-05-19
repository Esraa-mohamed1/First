'use client';

import React from 'react';
import { Smartphone, Mail, Hash } from 'lucide-react';
import { PaymentMethodType } from '@/types/payment';
import { clsx } from 'clsx';

interface PaymentMethodValueInputProps {
  type: PaymentMethodType;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PaymentMethodValueInput = ({
  type,
  label,
  value,
  onChange,
  error,
}: PaymentMethodValueInputProps) => {
  const getIcon = () => {
    switch (type) {
      case 'mobile': return <Smartphone className="text-gray-400" size={18} />;
      case 'email': return <Mail className="text-gray-400" size={18} />;
      case 'account_number': return <Hash className="text-gray-400" size={18} />;
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'mobile': return '01xxxxxxxxx';
      case 'email': return 'example@mail.com';
      case 'account_number': return 'أدخل رقم الحساب...';
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
          {getIcon()}
        </div>
        <input
          type={type === 'email' ? 'email' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={getPlaceholder()}
          className={clsx(
            'w-full pr-10 pl-4 py-2 rounded-xl border transition-all outline-none',
            error 
              ? 'border-red-500 focus:ring-4 focus:ring-red-50' 
              : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
          )}
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};
