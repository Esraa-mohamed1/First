'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Smartphone, Mail, Hash, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ReceiverAccount } from '@/types/api';
import { showAlert } from '@/lib/sweetalert';
import { clsx } from 'clsx';
import {
  getAdminReceiverAccounts,
  createAdminReceiverAccount,
  updateAdminReceiverAccount,
  deleteAdminReceiverAccount
} from '@/services/receiverAccounts';

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<ReceiverAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ReceiverAccount | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<ReceiverAccount>>({
    defaultValues: {
      is_active: true,
    },
  });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const data = await getAdminReceiverAccounts();
      setMethods(data);
    } catch (error) {
      console.error('Failed to fetch methods:', error);
      showAlert.error('خطأ', 'فشل في جلب وسائل الدفع');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Partial<ReceiverAccount>) => {
    setIsSaving(true);
    try {
      if (editingMethod) {
        await updateAdminReceiverAccount(editingMethod.id, data);
        showAlert.success('تم التحديث بنجاح');
      } else {
        await createAdminReceiverAccount(data);
        showAlert.success('تم الإضافة بنجاح');
      }
      closeModal();
      fetchMethods();
    } catch (error: any) {
      showAlert.error('خطأ', error.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (method?: ReceiverAccount) => {
    if (method) {
      setEditingMethod(method);
      reset(method);
    } else {
      setEditingMethod(null);
      reset({ name: '', key: '', logo: '', country_code: 'EG', country_name: 'Egypt', is_active: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
    reset();
  };

  const handleDelete = async (id: number) => {
    const result = await showAlert.confirm('هل أنت متأكد؟', 'سيتم حذف وسيلة الدفع هذه نهائياً');
    if (result.isConfirmed) {
      try {
        await deleteAdminReceiverAccount(id);
        showAlert.success('تم الحذف بنجاح');
        fetchMethods();
      } catch (error) {
        showAlert.error('خطأ', 'فشل في حذف وسيلة الدفع');
      }
    }
  };

  const toggleStatus = async (method: ReceiverAccount) => {
    try {
      await updateAdminReceiverAccount(method.id, { is_active: !method.is_active });
      setMethods(methods.map((m) => (m.id === method.id ? { ...m, is_active: !m.is_active } : m)));
    } catch (error) {
      showAlert.error('خطأ', 'فشل في تحديث حالة وسيلة الدفع');
    }
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
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">الاسم</th>
                <th className="px-6 py-4 font-semibold text-gray-700">المفتاح</th>
                <th className="px-6 py-4 font-semibold text-gray-700">الدولة</th>
                <th className="px-6 py-4 font-semibold text-gray-700">الحالة</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {methods.map((method) => (
                <tr key={method.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    <div className="flex items-center gap-3">
                      {method.logo ? (
                        <img src={method.logo} alt={method.name} className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                          <ImageIcon size={16} />
                        </div>
                      )}
                      {method.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600" dir="ltr">{method.key}</td>
                  <td className="px-6 py-4 text-gray-600">{method.country_name} ({method.country_code})</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(method)}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors',
                        method.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {method.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      {method.is_active ? 'نشط' : 'غير نشط'}
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
        )}
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
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none"
                  placeholder="مثال: فودافون كاش"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المفتاح (Key)</label>
                <input
                  {...register('key')}
                  required
                  dir="ltr"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-left"
                  placeholder="e.g. vodafone_cash"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط الشعار (Logo URL)</label>
                <input
                  {...register('logo')}
                  dir="ltr"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-left"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">كود الدولة</label>
                  <input
                    {...register('country_code')}
                    required
                    dir="ltr"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-left"
                    placeholder="EG"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدولة</label>
                  <input
                    {...register('country_name')}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none"
                    placeholder="Egypt"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  {...register('is_active')}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">تفعيل وسيلة الدفع</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
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
