import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  AlertCircle,
  Mail,
  Smartphone,
  Trash2, // Added Trash2
  Loader2
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { ReceiverAccount } from '@/types/api';

interface ReceiverAccountCardProps {
  account: ReceiverAccount;
  isOpen: boolean;
  onToggleOpen: () => void;
  configuredValue: string;
  onValueChange: (value: string) => void;
  configuredType: 'email' | 'phone';
  onTypeChange: (type: 'email' | 'phone') => void;
  isSaving: boolean;
  saveError: string | null;
  onRemove: () => void;
}

const ReceiverAccountCard: React.FC<ReceiverAccountCardProps> = ({
  account,
  isOpen,
  onToggleOpen,
  configuredValue,
  onValueChange,
  configuredType,
  onTypeChange,
  isSaving,
  saveError,
  onRemove
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={twMerge("border rounded-[16px] transition-all", isOpen ? "border-blue-200 shadow-sm" : "border-gray-200")}>
      <div className="p-4 flex items-center gap-4 relative cursor-pointer" onClick={onToggleOpen}>
        <div className="w-14 h-8 rounded flex items-center justify-center text-white font-black text-xs overflow-hidden">
          <img src={account.logo} alt={account.name} className="w-full h-full object-cover" />
        </div>
        <span className="font-black text-sm text-gray-900 flex-1">{account.name} ({account.country_name})</span>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${account.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {account.is_active ? 'مفعل' : 'غير مفعل'}
          </span>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical size={18} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-20"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                      setMenuOpen(false);
                    }}
                    className="w-full text-right px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} className="inline-block ml-2" />
                    حذف طريقة الدفع
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={(e) => { e.stopPropagation(); onToggleOpen(); }} className="p-1 text-gray-400 hover:bg-gray-50 rounded-lg">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 pt-2 border-t border-gray-50 space-y-5">
          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <label className="block text-xs font-bold text-gray-700">النوع</label>
              <div className="relative">
                <select
                  value={configuredType}
                  onChange={(e) => onTypeChange(e.target.value as 'email' | 'phone')}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-left font-semibold text-gray-600 appearance-none pr-10"
                  dir="ltr"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  {configuredType === 'email' ? <Mail size={18} /> : <Smartphone size={18} />}
                </div>
              </div>
            </div>
            <div className="space-y-1.5 flex-1">
              <label className="block text-xs font-bold text-gray-700">القيمة</label>
              <input
                type="text"
                value={configuredValue}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-left font-semibold text-gray-600"
                dir="ltr"
                placeholder={configuredType === 'email' ? 'ادخل البريد الإلكتروني' : 'ادخل رقم الهاتف'}
              />
            </div>
          </div>

          {saveError && (
            <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-xs mt-2 mb-4">
              <span>{saveError}</span>
              <AlertCircle size={14} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiverAccountCard;