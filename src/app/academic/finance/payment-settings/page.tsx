'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Landmark, Loader2, Plus, X, Check, Landmark as LandmarkIcon } from 'lucide-react';
import { showAlert } from '@/lib/sweetalert';
import {
  getReceiverAccounts,
  createAcademyReceiverAccount,
  getUserPaymentInfos,
  createUserPaymentInfo,
  updateUserPaymentInfo,
  deleteUserPaymentInfo,
  UserPaymentInfo,
} from '@/services/finance';
import { ReceiverAccount } from '@/types/api';

interface CountryActivationInfo {
  code: 'SA' | 'KW' | 'EG';
  name: string;
  flag: string;
  flagUrl: string;
  currency: string;
  fullName: string;
}

const PRIMARY_COUNTRIES: CountryActivationInfo[] = [
  {
    code: 'SA',
    name: 'السعودية',
    flag: '🇸🇦',
    flagUrl: 'https://tse1.mm.bing.net/th/id/OIP.WFc-yv0KV7ycYqKbKeVlKgHaEo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    currency: 'SAR',
    fullName: 'المملكة العربية السعودية',
  },
  {
    code: 'KW',
    name: 'الكويت',
    flag: '🇰🇼',
    flagUrl: 'https://th.bing.com/th/id/OIP.80zq6JkAWk_-ecLUUDbQagHaE8?w=251&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    currency: 'KWD',
    fullName: 'دولة الكويت',
  },
  {
    code: 'EG',
    name: 'مصر',
    flag: '🇪🇬',
    flagUrl: 'https://th.bing.com/th/id/OIP.RCnp9g-RtSYeHw-ke9im6wHaE8?w=254&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
    currency: 'EGP',
    fullName: 'جمهورية مصر العربية',
  }
];

const translateErrorToArabic = (msg: string): string => {
  const normalized = msg.toLowerCase().trim();
  if (normalized.includes('account_value') || normalized.includes('account value') || normalized.includes('value')) {
    return 'رقم الحساب أو رقم الهاتف المربوط مطلوب.';
  }
  if (normalized.includes('name')) {
    return 'اسم وسيلة الدفع مطلوب.';
  }
  return msg;
};

export default function AcademyPaymentSettingsPage() {
  const [fetching, setFetching] = useState(true);
  const [receiverTemplates, setReceiverTemplates] = useState<ReceiverAccount[]>([]);
  const [activeAccounts, setActiveAccounts] = useState<UserPaymentInfo[]>([]);

  // Selected Country card filter ('SA' | 'KW' | 'EG')
  const [selectedCountry, setSelectedCountry] = useState<'SA' | 'KW' | 'EG'>('SA');

  // Quick Activation Modal state
  const [activatingMethod, setActivatingMethod] = useState<{
    id?: number;
    name: string;
    key?: string;
    logo?: string;
    country_code: string;
    isCustom?: boolean;
    userPaymentInfoId?: number;
  } | null>(null);

  const [accountValue, setAccountValue] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load Data from endpoint
  const loadData = useCallback(async () => {
    setFetching(true);
    try {
      const [templates, configs] = await Promise.all([
        getReceiverAccounts(),
        getUserPaymentInfos(),
      ]);
      setReceiverTemplates(templates);
      setActiveAccounts(configs);
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

  // Open Quick Activation Modal (Only Account Value input required!)
  const openActivationModal = (template?: ReceiverAccount, activeAcc?: UserPaymentInfo) => {
    if (activeAcc) {
      setActivatingMethod({
        id: activeAcc.receiver_account_id ?? undefined,
        name: activeAcc.name,
        country_code: selectedCountry,
        userPaymentInfoId: activeAcc.id,
      });
      setAccountValue(activeAcc.accountValue);
      setCustomName(activeAcc.name);
    } else if (template) {
      setActivatingMethod({
        id: template.id,
        name: template.name,
        key: template.key,
        logo: template.logo,
        country_code: template.country_code || selectedCountry,
      });
      setAccountValue('');
      setCustomName(template.name);
    } else {
      setActivatingMethod({
        name: '',
        country_code: selectedCountry,
        isCustom: true,
      });
      setAccountValue('');
      setCustomName('');
    }
  };

  const closeActivationModal = () => {
    setActivatingMethod(null);
    setAccountValue('');
    setCustomName('');
  };

  // Submit Activation (requires only account value)
  const handleActivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountValue.trim()) {
      showAlert.warning('تنبيه', 'يرجى إدخال رقم الحساب أو المحفظة أو الآيبان للتحصيل');
      return;
    }

    const finalName = activatingMethod?.isCustom ? customName.trim() : activatingMethod?.name;
    if (!finalName) {
      showAlert.warning('تنبيه', 'يرجى إدخال اسم وسيلة الدفع');
      return;
    }

    setIsSaving(true);
    try {
      const currencyMap: Record<string, string> = {
        EG: 'EGP', KW: 'KWD', SA: 'SAR'
      };
      const currency = currencyMap[selectedCountry] || 'SAR';

      let templateId = activatingMethod?.id;

      // If custom method or not saved in templates backend yet, create template
      if (!templateId) {
        const presetKey = finalName.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'custom_key';
        const existing = receiverTemplates.find(t => t.key === presetKey && t.country_code === selectedCountry);

        if (existing) {
          templateId = existing.id;
        } else {
          const newTemplate = await createAcademyReceiverAccount({
            name: finalName,
            key: presetKey,
            country_code: selectedCountry,
          });
          templateId = newTemplate.id;
          setReceiverTemplates(await getReceiverAccounts());
        }
      }

      const payload = {
        name: finalName,
        accountValue,
        currency,
        receiver_account_id: templateId,
      };

      if (activatingMethod?.userPaymentInfoId) {
        await updateUserPaymentInfo(activatingMethod.userPaymentInfoId, payload);
        showAlert.success('تم التحديث بنجاح', 'تم تحديث رقم حساب التحصيل بنجاح');
      } else {
        await createUserPaymentInfo(payload);
        showAlert.success('تم التنشيط بنجاح', `تم تفعيل وسيلة (${finalName}) بنجاح وبدأت تظهر للطلاب`);
      }

      closeActivationModal();
      setActiveAccounts(await getUserPaymentInfos());
    } catch (error: any) {
      console.error('Activation Error:', error);
      if (error?.errors) {
        const allMsgs: string[] = [];
        Object.values(error.errors).forEach((msgs: any) => {
          const messages = Array.isArray(msgs) ? msgs : [String(msgs)];
          messages.forEach((msg) => allMsgs.push(translateErrorToArabic(msg)));
        });
        showAlert.error('خطأ في البيانات', allMsgs.join(' | ') || 'يرجى التحقق من البيانات');
      } else {
        showAlert.error('خطأ', translateErrorToArabic(error?.message || 'فشل تفعيل وسيلة الدفع'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Delete/Deactivate Handler
  const handleDeleteAccount = async (id: number) => {
    const result = await showAlert.confirm(
      'هل أنت متأكد؟',
      'سيتم إيقاف تفعيل حساب التحصيل هذا ولن يظهر للطلاب عند شراء الدورات.'
    );
    if (!result.isConfirmed) return;
    try {
      await deleteUserPaymentInfo(id);
      setActiveAccounts(prev => prev.filter(m => m.id !== id));
      showAlert.success('تم التعطيل', 'تم إيقاف تفعيل وسيلة الدفع بنجاح');
    } catch (error: any) {
      showAlert.error('فشل التعطيل', error?.message || 'تعذر إيقاف تفعيل وسيلة الدفع حالياً');
    }
  };

  // Filter templates for current country from endpoint
  const currentTemplates = receiverTemplates.filter(t => t.country_code === selectedCountry);
  const selectedCountryInfo = PRIMARY_COUNTRIES.find(c => c.code === selectedCountry) || PRIMARY_COUNTRIES[0];

  return (
    <div className="space-y-8 text-right font-sans" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm">
            <Landmark size={26} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">وسائل الدفع والتحصيل</h1>
            <p className="text-slate-400 text-xs font-bold mt-1">اختر الدولة وقم بتفعيل الطرق المتاحة فوراً عبر إدخال رقم الحساب فقط</p>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: Country Cards Selector ─── */}
      <div className="space-y-4">
        <div className="border-r-4 border-blue-600 pr-3">
          <h2 className="text-base font-black text-slate-800">اختر الدولة</h2>
          <p className="text-slate-400 text-[10px] font-bold mt-0.5">انقر فوق كارت الدولة لعرض وسائل وطرق التحصيل الخاصة بها</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRIMARY_COUNTRIES.map((c) => {
            const isSelected = selectedCountry === c.code;

            return (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedCountry(c.code)}
                className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all duration-300 cursor-pointer text-right relative overflow-hidden ${isSelected
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50/70 to-white shadow-xl ring-4 ring-blue-50 scale-[1.02]'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md">
                    <img src={c.flagUrl} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className={`text-base font-black ${isSelected ? 'text-blue-600' : 'text-slate-900'}`}>
                      {c.name}
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400 block mt-0.5">
                      {c.fullName}
                    </span>
                    <span className="inline-block text-[10px] font-black mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                      العملة: {c.currency}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Check size={18} className="stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 2: Payment Ways for Selected Country ─── */}
      <div className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="border-r-4 border-blue-600 pr-3">
            <h2 className="text-base font-black text-slate-800">
              طرق وسيلة الدفع لـ {selectedCountryInfo.fullName} ({selectedCountryInfo.flag})
            </h2>
            <p className="text-slate-400 text-[10px] font-bold mt-0.5">
              انقر فوق الوسيلة وأدخل رقم الحساب لتفعيلها مباشرة للطلاب
            </p>
          </div>

          {/* <button
            type="button"
            onClick={() => openActivationModal(undefined)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus size={16} />
            <span>وسيلة مخصصة أخرى</span>
          </button> */}
        </div>

        {/* Display List of Methods for this Country */}
        {fetching ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-slate-400 font-bold text-xs">جاري تحميل وسائل الدفع المتاحة...</span>
          </div>
        ) : currentTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTemplates.map((template) => {
              // Check if user has activated this template
              const activeMatch = activeAccounts.find(a => a.receiver_account_id === template.id || a.name === template.name);

              return (
                <div
                  key={template.id}
                  className={`bg-white rounded-3xl border-2 p-6 flex flex-col justify-between gap-5 transition-all duration-200 shadow-sm hover:shadow-md ${activeMatch ? 'border-green-500/40 bg-green-50/10' : 'border-slate-200/80'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {template.logo ? (
                        <img src={template.logo} alt={template.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100">
                          <LandmarkIcon size={22} />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{template.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5" dir="ltr">
                          {template.key}
                        </span>
                      </div>
                    </div>

                    {activeMatch ? (
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <Check size={12} />
                        مفعل
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                        متاح للتفعيل
                      </span>
                    )}
                  </div>

                  {/* Value display if activated */}
                  {activeMatch && (
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 text-right">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">رقم الحساب/المحفظة المفعل:</span>
                      <span className="text-xs font-black text-slate-800 font-mono dir-ltr block text-left">
                        {activeMatch.accountValue}
                      </span>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    {activeMatch ? (
                      <div className="flex items-center justify-between w-full">
                        <button
                          type="button"
                          onClick={() => openActivationModal(template, activeMatch)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          تعديل الرقم
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(activeMatch.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          إيقاف التفعيل
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openActivationModal(template)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-3 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Plus size={16} />
                        <span>تفعيل وسيلة الدفع</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <LandmarkIcon size={40} className="mb-3 opacity-20 text-blue-600" />
            <h4 className="font-black text-slate-800 mb-1 text-sm">لا توجد وسائل مسجلة لـ {selectedCountryInfo.name}</h4>
            <p className="text-[10px] font-bold text-slate-400 mb-4">
              يمكنك النقر فوق "وسيلة مخصصة أخرى" لإضافة وإعداد طريقة التحصيل الخاصة بك.
            </p>
            <button
              type="button"
              onClick={() => openActivationModal(undefined)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus size={16} />
              <span>إضافة وسيلة دفع مخصصة لـ {selectedCountryInfo.name}</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── Quick Activation Modal (Requires Only Account Value) ─── */}
      {activatingMethod && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-150 space-y-0">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <LandmarkIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {activatingMethod.userPaymentInfoId ? 'تعديل وسيلة الدفع' : 'تفعيل وسيلة الدفع'}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                    الدولة: {selectedCountryInfo.fullName} ({selectedCountryInfo.flag})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeActivationModal}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleActivationSubmit} className="p-6 space-y-5">
              {activatingMethod.isCustom ? (
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700">
                    اسم وسيلة الدفع المخصصة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="مثال: فودافون كاش مخصص، محفظة بنكية"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-slate-900"
                    required
                  />
                </div>
              ) : (
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">اسم الوسيلة:</span>
                  <span className="text-sm font-black text-blue-900">{activatingMethod.name}</span>
                </div>
              )}

              {/* The Only Input Needed: Account Value */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800">
                  رقم الحساب أو رقم الموبايل (المحفظة) أو الآيبان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountValue}
                  onChange={e => setAccountValue(e.target.value)}
                  placeholder={
                    selectedCountry === 'EG'
                      ? 'مثال: 01002939223 أو address@instapay'
                      : selectedCountry === 'SA'
                        ? 'مثال: 05xxxxxxxx أو SA0000000000000000000000'
                        : 'مثال: رقم حساب KNet أو الآيبان البنكي'
                  }
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-slate-900 text-left font-mono"
                  autoFocus
                  required
                />
                <span className="text-[10px] text-slate-400 font-bold block pt-1">
                  العملة المقبولة تلقائياً: <strong className="text-slate-700">{selectedCountryInfo.currency}</strong>
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeActivationModal}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white font-black text-xs px-7 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                  <span>{activatingMethod.userPaymentInfoId ? 'حفظ التحديث' : 'تأكيد وتفعيل الوسيلة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
