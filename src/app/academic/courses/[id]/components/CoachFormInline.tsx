'use client';

import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CoachFormInlineProps {
  onSubmit: (payload: any) => Promise<void>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onClose: () => void;
}

export const CoachFormInline: React.FC<CoachFormInlineProps> = ({
  onSubmit,
  errors,
  isSubmitting,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'academy',
    status: 'active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('يرجى تعبئة الحقول المطلوبة');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-gray-900 pr-1 text-right">
            الاسم بالكامل <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="مثال: أحمد محمد"
            className={`w-full p-4 bg-gray-50 border ${errors.name ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl outline-none focus:bg-white font-bold text-sm transition-all text-gray-900 text-right`}
            required
            autoFocus
          />
          {errors.name && <p className="text-red-500 text-xs font-bold text-right">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-gray-900 pr-1 text-right">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className={`w-full p-4 bg-gray-50 border ${errors.email ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl outline-none focus:bg-white font-bold text-sm transition-all text-gray-900 text-right`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs font-bold text-right">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-gray-900 pr-1 text-right">رقم الجوال</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="05X XXX XXXX"
            className={`w-full p-4 bg-gray-50 border ${errors.phone ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl outline-none focus:bg-white font-bold text-sm transition-all text-gray-900 text-right`}
            dir="ltr"
          />
          {errors.phone && <p className="text-red-500 text-xs font-bold text-right">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-gray-900 pr-1 text-right">
            كلمة المرور <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="كلمة مرور قوية"
            className={`w-full p-4 bg-gray-50 border ${errors.password ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-gray-100 focus:border-blue-600'} rounded-2xl outline-none focus:bg-white font-bold text-sm transition-all text-gray-900 text-right`}
            required
          />
          {errors.password && <p className="text-red-500 text-xs font-bold text-right">{errors.password}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Check size={20} />
              <span>حفظ بيانات المدرب</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-8 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};
