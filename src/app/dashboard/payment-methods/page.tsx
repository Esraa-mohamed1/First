'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Smartphone, Mail, Hash, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentMethodSchema } from '@/lib/validations/paymentSchema';
import { PaymentMethod, PaymentMethodType } from '@/types/payment';
import { showAlert } from '@/lib/sweetalert';
import { clsx } from 'clsx';

// Mock initial data
const initialMethods: PaymentMethod[] = [
  { id: '1', name: 'Vodafone Cash', type: 'mobile', icon: 'smartphone', isActive: true },
  { id: '2', name: 'InstaPay', type: 'account_number', icon: 'hash', isActive: true },
  { id: '3', name: 'Bank Transfer', type: 'account_number', icon: 'hash', isActive: false },
];

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<PaymentMethod, 'id'>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const onSubmit = (data: Omit<PaymentMethod, 'id'>) => {
    if (editingMethod) {
      setMethods(methods.map((m) => (m.id === editingMethod.id ? { ...data, id: m.id } : m)));
      showAlert.success('تم التحديث بنجاح');
    } else {
      const newMethod: PaymentMethod = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      };
      setMethods([...methods, newMethod]);
      showAlert.success('تم الإضافة بنجاح');
    }
    closeModal();
  };

  const openModal = (method?: PaymentMethod) => {
    if (method) {
      setEditingMethod(method);
      reset(method);
    } else {
      setEditingMethod(null);
      reset({ name: '', type: 'mobile', icon: 'smartphone', isActive: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    const result = await showAlert.confirm('هل أنت متأكد؟', 'سيتم حذف وسيلة الدفع هذه نهائياً');
    if (result.isConfirmed) {
      setMethods(methods.filter((m) => m.id !== id));
      showAlert.success('تم الحذف بنجاح');
    }
  };

  const toggleStatus = (id: string) => {
    setMethods(
      methods.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'smartphone': return <Smartphone size={20} />;
      case 'mail': return <Mail size={20} />;
      case 'hash': return <Hash size={20} />;
      default: return <ImageIcon size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة طرق الدفع</h1>
          <p className="text-gray-500">إضافة وتعديل وسائل الدفع المتاحة للأكاديميات</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          إضافة وسيلة دفع
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">الاسم</th>
              <th className="px-6 py-4 font-semibold text-gray-700">النوع</th>
              <th className="px-6 py-4 font-semibold text-gray-700">أيقونة</th>
              <th className="px-6 py-4 font-semibold text-gray-700">الحالة</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {methods.map((method) => (
              <tr key={method.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 font-medium">{method.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  {method.type === 'mobile' && 'رقم موبايل'}
                  {method.type === 'email' && 'بريد إلكتروني'}
                  {method.type === 'account_number' && 'رقم حساب'}
                </td>
                <td className="px-6 py-4 text-blue-600">{getIcon(method.icon)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(method.id)}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors',
                      method.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {method.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    {method.isActive ? 'نشط' : 'غير نشط'}
                  </button>
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => openModal(method)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingMethod ? 'تعديل وسيلة دفع' : 'إضافة وسيلة دفع جديدة'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <input
                  {...register('name')}
                  className={clsx(
                    'w-full px-4 py-2 rounded-xl border transition-all outline-none',
                    errors.name ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
                  )}
                  placeholder="مثال: فودافون كاش"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                <select
                  {...register('type')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none"
                >
                  <option value="mobile">رقم موبايل</option>
                  <option value="email">بريد إلكتروني</option>
                  <option value="account_number">رقم حساب</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الأيقونة</label>
                <select
                  {...register('icon')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none"
                >
                  <option value="smartphone">موبايل</option>
                  <option value="mail">بريد</option>
                  <option value="hash">رقم / كود</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">تفعيل وسيلة الدفع</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  {editingMethod ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
