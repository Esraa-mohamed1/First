'use client';

import React from 'react';
import { Smartphone, Mail, Hash, CheckCircle2 } from 'lucide-react';
import { PaymentMethodType } from '@/types/payment';
import { clsx } from 'clsx';

import { motion } from 'framer-motion';

interface PaymentMethodCardProps {
  id: string;
  name: string;
  type: PaymentMethodType;
  isSelected: boolean;
  onSelect: () => void;
}

export const PaymentMethodCard = React.memo(({
  name,
  type,
  isSelected,
  onSelect,
}: PaymentMethodCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'mobile': return <Smartphone size={24} />;
      case 'email': return <Mail size={24} />;
      case 'account_number': return <Hash size={24} />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
      role="radio"
      aria-selected={isSelected}
      onClick={onSelect}
      className={clsx(
        "relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 text-center",
        isSelected 
          ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/10 scale-[1.02]" 
          : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50/50"
      )}
    >
      <div className={clsx(
        "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
        isSelected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
      )}>
        {getIcon()}
      </div>
      
      <div>
        <h3 className={clsx(
          "font-bold transition-colors",
          isSelected ? "text-blue-900" : "text-gray-900"
        )}>
          {name}
        </h3>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          {type === 'mobile' ? 'محفظة إلكترونية' : type === 'email' ? 'حساب إلكتروني' : 'تحويل بنكي'}
        </p>
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-3 right-3 text-blue-600"
        >
          <CheckCircle2 size={20} fill="currentColor" className="text-white fill-blue-600" />
        </motion.div>
      )}

      <button
        className={clsx(
          "w-full py-2 rounded-xl text-xs font-bold transition-all",
          isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        )}
      >
        {isSelected ? 'تم الاختيار' : 'اختيار'}
      </button>
    </motion.div>
  );
});

PaymentMethodCard.displayName = 'PaymentMethodCard';
