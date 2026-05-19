'use client';

import React from 'react';
import { Smartphone, Mail, Hash, Image as ImageIcon } from 'lucide-react';
import { PaymentMethodType } from '@/types/payment';
import { clsx } from 'clsx';

interface PaymentMethodBadgeProps {
  type: PaymentMethodType;
  name: string;
  value?: string;
  showValue?: boolean;
  className?: string;
}

export const PaymentMethodBadge = React.memo(({
  type,
  name,
  value,
  showValue = false,
  className,
}: PaymentMethodBadgeProps) => {
  const getIcon = () => {
    switch (type) {
      case 'mobile': return <Smartphone size={14} />;
      case 'email': return <Mail size={14} />;
      case 'account_number': return <Hash size={14} />;
      default: return <ImageIcon size={14} />;
    }
  };

  const maskValue = (val: string) => {
    if (!val) return '';
    if (type === 'mobile' && val.length >= 11) {
      return `${val.substring(0, 3)}****${val.substring(val.length - 3)}`;
    }
    if (type === 'email' && val.includes('@')) {
      const [user, domain] = val.split('@');
      return `${user.substring(0, 2)}***@${domain}`;
    }
    if (val.length > 6) {
      return `****${val.substring(val.length - 4)}`;
    }
    return val;
  };

  return (
    <div 
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 transition-all hover:bg-blue-100",
        className
      )}
      title={`${name}${value ? `: ${maskValue(value)}` : ''}`}
    >
      {getIcon()}
      <span>{name}</span>
      {showValue && value && (
        <span className="opacity-60 border-r border-blue-200 pr-1.5 mr-1.5">
          {maskValue(value)}
        </span>
      )}
    </div>
  );
});

PaymentMethodBadge.displayName = 'PaymentMethodBadge';
