'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, User as UserIcon, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateUser } from '@/services/users';
import { User } from '@/types/api';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: (user: User) => void;
}

export default function EditUserModal({ isOpen, onClose, user, onUserUpdated }: EditUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    status: 'active',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: (user as any).role || 'student',
        status: (user as any).status || 'active',
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error('يرجى تعبئة الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await updateUser(user.id, formData as any);
      toast.success('تم تحديث البيانات بنجاح');
      onUserUpdated(updated);
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'فشل تحديث البيانات');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCoach = formData.role === 'academy';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
      <div
        className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <UserIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">
                تعديل {isCoach ? 'المدرب' : 'الطالب'}
              </h2>
              <p className="text-sm font-bold text-gray-400 mt-1">قم بتعديل بيانات المستخدم</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900">
                الاسم بالكامل <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="مثال: أحمد محمد"
                  className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900">رقم الجوال</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05X XXX XXXX"
                  className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900">الحالة</label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all appearance-none text-gray-900"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-black text-gray-900">الدور</label>
              <div className="relative">
                <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all appearance-none text-gray-900"
                >
                  <option value="student">طالب</option>
                  <option value="admin">مسؤول</option>
                  <option value="academy">مدرب</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-3.5 bg-white text-gray-600 border border-gray-200 font-black rounded-2xl hover:bg-gray-50 transition-all text-sm"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:brightness-110 active:scale-95 transition-all text-sm disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            <span>حفظ التعديلات</span>
          </button>
        </div>
      </div>
    </div>
  );
}
