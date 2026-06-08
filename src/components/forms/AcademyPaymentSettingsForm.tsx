'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { showAlert } from '@/lib/sweetalert';
import { Save, AlertCircle, Loader2, Plus, Edit2, Trash2, X, Landmark, RefreshCw } from 'lucide-react';
import { getReceiverAccounts, getUserPaymentInfos, createUserPaymentInfo, updateUserPaymentInfo, deleteUserPaymentInfo } from '@/services/finance';
import { ReceiverAccount } from '@/types/api';
import { UserPaymentInfo } from '@/services/finance';

// ==========================================
// SUB-COMPONENTS (Defined at Module Scope to Prevent Focus/Render Bugs)
// ==========================================

interface SavedMethodCardProps {
  method: UserPaymentInfo;
  onEdit: (method: UserPaymentInfo) => void;
  onDelete: (id: number) => void;
}

const SavedMethodCard = React.memo(({ method, onEdit, onDelete }: SavedMethodCardProps) => {
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(method);
  }, [method, onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(method.id);
  }, [method.id, onDelete]);

  return (
    <div className="p-6 rounded-2xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-black text-gray-900 text-base">{method.name}</h4>
          <span className="inline-block text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wide">
            {method.currency}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center overflow-hidden">
          {method.logo ? (
            <img src={`https://api.darab.academy/${method.logo}`} alt={method.name} className="w-full h-full object-cover" />
          ) : (
            <Landmark size={20} />
          )}
        </div>
      </div>
      
      <div className="space-y-1 pt-2">
        <span className="text-xs text-gray-400 font-bold block">القيمة / رقم الحساب</span>
        <span className="font-mono text-sm text-gray-700 font-bold break-all select-all block bg-gray-50 p-2.5 rounded-xl border border-gray-100/50">
          {method.accountValue}
        </span>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-50 shrink-0">
        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Edit2 size={12} />
          <span>تعديل</span>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1 text-xs font-black text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 size={12} />
          <span>حذف</span>
        </button>
      </div>
    </div>
  );
});

SavedMethodCard.displayName = 'SavedMethodCard';

export const AcademyPaymentSettingsForm = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeReceiverAccounts, setActiveReceiverAccounts] = useState<ReceiverAccount[]>([]);
  const [savedMethods, setSavedMethods] = useState<UserPaymentInfo[]>([]);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [selectedReceiverAccountId, setSelectedReceiverAccountId] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Fetch data
  const loadData = useCallback(async () => {
    setFetching(true);
    try {
      const [accounts, configs] = await Promise.all([
        getReceiverAccounts(),
        getUserPaymentInfos()
      ]);
      setActiveReceiverAccounts(accounts.filter(acc => acc.is_active));
      setSavedMethods(configs);
    } catch (error) {
      console.error('Failed to fetch payment settings:', error);
      showAlert.error('خطأ', 'فشل تحميل بيانات وسائل الدفع');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Form Reset
  const resetForm = useCallback(() => {
    setEditingId(null);
    setName('');
    setAccountValue('');
    setCurrency('SAR');
    setSelectedReceiverAccountId('');
    setLogoFile(null);
  }, []);

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showAlert.warning('تنبيه', 'يرجى إدخال اسم وسيلة الدفع');
      return;
    }
    if (!accountValue.trim()) {
      showAlert.warning('تنبيه', 'يرجى إدخال رقم الحساب أو القيمة');
      return;
    }
    if (!editingId && savedMethods.length >= 4) {
      showAlert.warning('تنبيه', 'الحد الأقصى لوسائل الدفع المفعلة هو 4 وسائل فقط');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name,
        accountValue,
        currency,
        logo: logoFile,
      };
      if (selectedReceiverAccountId) {
        payload.receiver_account_id = parseInt(selectedReceiverAccountId, 10);
      }

      if (editingId) {
        await updateUserPaymentInfo(editingId, payload);
        showAlert.success('تم التحديث بنجاح', 'تم تحديث وسيلة الدفع بنجاح');
      } else {
        const result = await createUserPaymentInfo(payload);
        // Add new method with returned ID
        setSavedMethods(prev => [...prev, result]);
        showAlert.success('تمت الإضافة بنجاح', 'تم حفظ وسيلة الدفع الجديدة');
      }

      resetForm();
      // Reload from endpoint to keep UI perfectly synchronized
      const configs = await getUserPaymentInfos();
      setSavedMethods(configs);
    } catch (error: any) {
      showAlert.error('خطأ أثناء الحفظ', error?.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  // Edit handler callback
  const handleEdit = useCallback((method: UserPaymentInfo) => {
    setEditingId(method.id);
    setName(method.name);
    setAccountValue(method.accountValue);
    setCurrency(method.currency);
  }, []);

  // Delete handler callback
  const handleDelete = useCallback(async (id: number) => {
    const confirm = await showAlert.confirm(
      'هل أنت متأكد؟',
      'سيتم حذف وسيلة الدفع هذه نهائياً ولن تتمكن من استخدامها في تحصيلات الدورات.'
    );
    if (!confirm.isConfirmed) return;

    try {
      await deleteUserPaymentInfo(id);
      setSavedMethods(prev => prev.filter(m => m.id !== id));
      showAlert.success('تم الحذف', 'تم حذف وسيلة الدفع بنجاح');
      if (editingId === id) {
        resetForm();
      }
    } catch (error: any) {
      showAlert.error('فشل الحذف', error?.message || 'تعذر حذف وسيلة الدفع حالياً');
    }
  }, [editingId, resetForm]);

  // Handle preset selection change
  const handleReceiverAccountChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedReceiverAccountId(val);
    if (val) {
      const selected = activeReceiverAccounts.find(acc => acc.id.toString() === val);
      if (selected) {
        setName(selected.name);
      }
    }
  }, [activeReceiverAccounts]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleAccountValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountValue(e.target.value);
  }, []);

  const handleCurrencyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  }, []);

  if (fetching) {
    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <span className="text-gray-500 font-bold text-sm">جاري تحميل إعدادات الدفع...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* 1. Add/Edit Payment Method Form Card */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">
              {editingId ? 'تعديل وسيلة الدفع' : 'إضافة وسيلة دفع جديدة'}
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              {editingId ? 'قم بتحديث بيانات وسيلة الدفع الحالية وحفظ التعديلات' : 'قم بإدخال بيانات وسيلة دفع جديدة لتفعيلها بالدورات'}
            </p>
          </div>
          {editingId && (
            <button
              onClick={resetForm}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-black rounded-xl transition-all"
            >
              <X size={14} />
              <span>إلغاء التعديل</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Presets from Receiver Accounts */}
            {!editingId && (
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700">تعبئة تلقائية من القوالب</label>
                <select
                  value={selectedReceiverAccountId}
                  onChange={handleReceiverAccountChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                >
                  <option value="">-- اختر وسيلة لملء الاسم --</option>
                  {activeReceiverAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.country_name})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom/Preset Name */}
            <div className={`space-y-2 ${editingId ? 'lg:col-span-2' : ''}`}>
              <label className="block text-xs font-black text-gray-700">اسم وسيلة الدفع <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="مثال: البنك الأهلي، فودافون كاش"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-700">شعار الوسيلة (اختياري)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
              />
            </div>

            {/* Account Value / Details */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-700">رقم الحساب / رقم الهاتف <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={accountValue}
                onChange={handleAccountValueChange}
                placeholder="أدخل رقم الحساب أو الرقم الهاتفي"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900 text-left"
              />
            </div>

            {/* Currency selection */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-700">العملة المقبولة</label>
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="EGP">جنيه مصري (EGP)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>

          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : editingId ? <Save size={18} /> : <Plus size={18} />}
              <span>{editingId ? 'حفظ التعديلات' : 'إضافة وسيلة دفع'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Saved Methods List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900">وسائل الدفع المفعلة بالأكاديمية</h3>
            <p className="text-gray-400 text-xs font-bold">قائمة الحسابات التي يمكن لطلابك التحويل إليها لشراء دوراتك</p>
          </div>
          <button
            onClick={loadData}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900 flex items-center gap-1.5 text-xs font-bold border border-gray-200 bg-white"
          >
            <RefreshCw size={14} />
            تحديث
          </button>
        </div>

        {savedMethods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedMethods.map((method) => (
              <SavedMethodCard
                key={method.id}
                method={method}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
            <AlertCircle size={48} className="mb-3 opacity-20 text-blue-600" />
            <h4 className="font-black text-gray-900 mb-1">لا توجد وسائل دفع حتى الآن</h4>
            <p className="text-xs font-bold max-w-xs text-center leading-relaxed">
              قم بإضافة أول حساب بنكي أو محفظة جوال لتتمكن من بيع دوراتك واستقبال المدفوعات من الطلاب.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
