'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { ReceiverAccount } from '@/types/api';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'EGP' | 'SAR';
  receiverTemplates: ReceiverAccount[];
  newPaymentTemplateId: string;
  setNewPaymentTemplateId: (id: string) => void;
  newPaymentCustomName: string;
  setNewPaymentCustomName: (name: string) => void;
  newPaymentAccountValue: string;
  setNewPaymentAccountValue: (value: string) => void;
  isSavingNewPayment: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  currency,
  receiverTemplates,
  newPaymentTemplateId,
  setNewPaymentTemplateId,
  newPaymentCustomName,
  setNewPaymentCustomName,
  newPaymentAccountValue,
  setNewPaymentAccountValue,
  isSavingNewPayment,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-250" dir="rtl">
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 border border-slate-100 animate-in zoom-in-95 duration-250 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-black text-slate-900 mb-2">إضافة حساب استقبال جديد</h2>
        <p className="text-xs font-bold text-slate-400 mb-6">أدخل بيانات وسيلة الدفع التي ترغب في تفعيلها لاستقبال مستحقات الطلاب بهذه العملة ({currency})</p>

        <form onSubmit={onSubmit} className="space-y-5 text-right">
          {/* Template Select Dropdown */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700">نوع وسيلة الاستقبال *</label>
            <select
              value={newPaymentTemplateId}
              onChange={(e) => {
                setNewPaymentTemplateId(e.target.value);
                const countryCode = currency === 'EGP' ? 'EG' : 'SA';
                const filtered = receiverTemplates.filter(t => t.country_code === countryCode);
                const tmpl = filtered.find(t => t.id.toString() === e.target.value);
                if (tmpl) {
                  setNewPaymentCustomName(tmpl.name);
                }
              }}
              required
              className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold bg-white"
            >
              <option value="">اختر النوع...</option>
              {(() => {
                const countryCode = currency === 'EGP' ? 'EG' : 'SA';
                const filtered = receiverTemplates.filter(t => t.country_code === countryCode);
                return (filtered.length > 0 ? filtered : receiverTemplates).map(tmpl => (
                  <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
                ));
              })()}
            </select>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700">اسم الحساب التوضيحي *</label>
            <input
              type="text"
              required
              placeholder="مثال: حساب البنك الأهلي، رقم كاش..."
              value={newPaymentCustomName}
              onChange={(e) => setNewPaymentCustomName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
            />
          </div>

          {/* Account Value Input */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700">رقم الحساب / رقم الهاتف *</label>
            <input
              type="text"
              required
              placeholder="أدخل رقم الحساب أو المحفظة هنا..."
              value={newPaymentAccountValue}
              onChange={(e) => setNewPaymentAccountValue(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-bold text-left"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingNewPayment}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isSavingNewPayment ? <Loader2 className="animate-spin" size={16} /> : 'حفظ وتفعيل الحساب'}
          </button>
        </form>
      </div>
    </div>
  );
};
