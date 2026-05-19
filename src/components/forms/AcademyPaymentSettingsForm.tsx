'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentMethodsSelectionSchema, academyPaymentMethodSchema } from '@/lib/validations/paymentSchema';
import { PaymentMethod, AcademyPaymentMethod } from '@/types/payment';
import { PaymentMethodDropdown } from '@/components/payment/PaymentMethodDropdown';
import { PaymentMethodValueInput } from '@/components/payment/PaymentMethodValueInput';
import { showAlert } from '@/lib/sweetalert';
import { Save, AlertCircle, Loader2 } from 'lucide-react';

// Mock active methods from Super Admin
const activeMethods: PaymentMethod[] = [
  { id: '1', name: 'Vodafone Cash', type: 'mobile', icon: 'smartphone', isActive: true },
  { id: '2', name: 'InstaPay', type: 'account_number', icon: 'hash', isActive: true },
];

export const AcademyPaymentSettingsForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{ selectedMethods: AcademyPaymentMethod[] }>({
    resolver: zodResolver(paymentMethodsSelectionSchema),
    defaultValues: {
      selectedMethods: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'selectedMethods',
  });

  const selectedMethods = watch('selectedMethods');

  const handleDropdownChange = (selectedIds: string[]) => {
    // Remove methods that are no longer selected
    const currentIds = selectedMethods.map(m => m.methodId);
    currentIds.forEach((id, index) => {
      if (!selectedIds.includes(id)) {
        remove(index);
      }
    });

    // Add new methods
    selectedIds.forEach(id => {
      if (!currentIds.includes(id)) {
        const method = activeMethods.find(m => m.id === id);
        if (method) {
          append({
            methodId: method.id,
            methodName: method.name,
            type: method.type,
            value: '',
          });
        }
      }
    });
  };

  const onSubmit = async (data: { selectedMethods: AcademyPaymentMethod[] }) => {
    // Validate each method value manually since Zod schema is dynamic
    for (const method of data.selectedMethods) {
      const result = academyPaymentMethodSchema(method.type).safeParse(method.value);
      if (!result.success) {
        showAlert.error(`خطأ في ${method.methodName}`, result.error.errors[0].message);
        return;
      }
    }

    setLoading(true);
    try {
      // Mock API call
      console.log('Saving academy payment methods:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      showAlert.success('تم حفظ إعدادات الدفع بنجاح');
    } catch (error) {
      showAlert.error('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" dir="rtl">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900">إعدادات طرق الدفع</h2>
        <p className="text-gray-500 text-sm mt-1">اختر وسائل الدفع التي تقبلها وقم بإضافة التفاصيل الخاصة بكل وسيلة</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
        <div className="max-w-md">
          <PaymentMethodDropdown
            options={activeMethods}
            selectedValues={selectedMethods.map(m => m.methodId)}
            onChange={handleDropdownChange}
            error={errors.selectedMethods?.message}
          />
        </div>

        {fields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{field.methodName}</span>
                  <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                    {field.type === 'mobile' && 'رقم موبايل'}
                    {field.type === 'email' && 'بريد إلكتروني'}
                    {field.type === 'account_number' && 'رقم حساب'}
                  </div>
                </div>
                
                <PaymentMethodValueInput
                  type={field.type}
                  label={`رقم/عنوان ${field.methodName}`}
                  value={selectedMethods[index]?.value || ''}
                  onChange={(val) => setValue(`selectedMethods.${index}.value`, val)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
            <AlertCircle size={48} className="mb-3 opacity-20" />
            <p>لم يتم اختيار أي وسيلة دفع بعد</p>
          </div>
        )}

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
};
