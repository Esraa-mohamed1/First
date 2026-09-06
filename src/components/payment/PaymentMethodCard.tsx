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
  logo?: string;
}

export const PaymentMethodCard = React.memo(({
  name,
  type,
  isSelected,
  onSelect,
  logo,
}: PaymentMethodCardProps) => {
  const getIcon = () => {
    if (logo) {
      return (
        <img
          src={logo}
          alt={name}
          className="w-full h-full object-contain p-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-105"
        />
      );
    }
    switch (type) {
      case 'mobile': return <Smartphone size={28} strokeWidth={2.2} />;
      case 'email': return <Mail size={28} strokeWidth={2.2} />;
      case 'account_number': return <Hash size={28} strokeWidth={2.2} />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      role="radio"
      aria-selected={isSelected}
      onClick={onSelect}
      className={clsx(
        "group relative p-3.5 md:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-3 text-center",
        isSelected 
          ? "border-blue-600 bg-blue-50/70 shadow-lg shadow-blue-500/15 scale-[1.02]" 
          : "border-gray-200/80 bg-white hover:border-blue-300 hover:shadow-md hover:bg-gray-50/50"
      )}
    >
      <div className={clsx(
        "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all shrink-0 overflow-hidden",
        logo
          ? clsx(
              "bg-white border p-1.5 shadow-sm",
              isSelected ? "border-blue-600 ring-4 ring-blue-500/15 shadow-md" : "border-gray-200/90 group-hover:border-blue-300"
            )
          : (isSelected ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25" : "bg-blue-50/80 text-blue-600 border border-blue-100")
      )}>
        {getIcon()}
      </div>
      
      <div className="space-y-0.5">
        <h3 className={clsx(
          "font-black text-xs md:text-sm transition-colors line-clamp-1",
          isSelected ? "text-blue-950" : "text-gray-900"
        )}>
          {name}
        </h3>
        <p className="text-[10px] text-gray-500 font-bold">
          {type === 'mobile' ? 'محفظة إلكترونية' : type === 'email' ? 'حساب إلكتروني' : 'تحويل بنكي'}
        </p>
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-2 right-2 text-blue-600"
        >
          <CheckCircle2 size={18} fill="currentColor" className="text-white fill-blue-600 shadow-sm" />
        </motion.div>
      )}

      <button
        className={clsx(
          "w-full py-1.5 rounded-xl text-[10px] font-black transition-all",
          isSelected ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
        )}
      >
        {isSelected ? 'تم الاختيار' : 'اختيار'}
      </button>
    </motion.div>
  );
});

PaymentMethodCard.displayName = 'PaymentMethodCard';
