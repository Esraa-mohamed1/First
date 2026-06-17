'use client';

import React from 'react';
import { Save, AlertCircle, Loader2, Plus, X, CheckCircle2 } from 'lucide-react';
import { ReceiverAccount } from '@/types/api';
import { UserPaymentInfo } from '@/services/finance';
import { ActiveAccountCard } from '@/components/payment/ActiveAccountCard';

// ─── Constants ────────────────────────────────────────────────────────────────

export const MAX_ACTIVE_ACCOUNTS = 4;

export const COUNTRY_OPTIONS = [
  { value: 'SA', label: 'السعودية (Saudi Arabia)' },
  { value: 'EG', label: 'مصر (Egypt)' },
  { value: 'AE', label: 'الإمارات (UAE)' },
  { value: 'QA', label: 'قطر (Qatar)' },
  { value: 'KW', label: 'الكويت (Kuwait)' },
  { value: 'OM', label: 'عمان (Oman)' },
  { value: 'BH', label: 'البحرين (Bahrain)' },
  { value: 'JO', label: 'الأردن (Jordan)' },
];

export const CURRENCY_OPTIONS = [
  { value: 'SAR', label: 'ريال سعودي (SAR)' },
  { value: 'EGP', label: 'جنيه مصري (EGP)' },
  { value: 'AED', label: 'درهم إماراتي (AED)' },
  { value: 'QAR', label: 'ريال قطري (QAR)' },
  { value: 'KWD', label: 'دينار كويتي (KWD)' },
  { value: 'OMR', label: 'ريال عماني (OMR)' },
  { value: 'BHD', label: 'دينار بحريني (BHD)' },
  { value: 'JOD', label: 'دينار أردني (JOD)' },
  { value: 'USD', label: 'دولار أمريكي (USD)' },
];

// ─── Section 1: Template Form Props ───────────────────────────────────────────

export interface TemplateFormProps {
  // State
  editingTemplateId: number | null;
  templateCountry: string;
  templateName: string;
  templateLogoFile: File | null;
  selectedPresetId: string;
  loadingTemplate: boolean;
  receiverTemplates: ReceiverAccount[];
  logoFileInputRef: React.RefObject<HTMLInputElement | null>;
  // Handlers
  onSubmit: (e: React.FormEvent) => void;
  onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPresetChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearLogo: () => void;
  onCancelEdit: () => void;
}

export function TemplateForm({
  editingTemplateId,
  templateCountry,
  templateName,
  templateLogoFile,
  selectedPresetId,
  loadingTemplate,
  receiverTemplates,
  logoFileInputRef,
  onSubmit,
  onCountryChange,
  onPresetChange,
  onNameChange,
  onLogoChange,
  onClearLogo,
  onCancelEdit,
}: TemplateFormProps) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-800">
          {editingTemplateId ? 'تعديل قالب وسيلة دفع' : 'إضافة قالب وسيلة دفع جديدة'}
        </h3>
        {editingTemplateId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-black rounded-lg transition-all"
          >
            <X size={12} />
            <span>إلغاء التعديل</span>
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Country */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-700">
              الدولة <span className="text-red-500">*</span>
            </label>
            <select
              value={templateCountry}
              onChange={onCountryChange}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
            >
              {COUNTRY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Preset autofill (add mode only) */}
          {!editingTemplateId && (
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-700">تعبئة تلقائية من القوالب</label>
              <select
                value={selectedPresetId}
                onChange={onPresetChange}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
              >
                <option value="">-- اختر وسيلة لملء الاسم --</option>
                {receiverTemplates
                  .filter(acc => acc.country_code === templateCountry)
                  .map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
              </select>
            </div>
          )}

          {/* Name */}
          <div className={`space-y-2 ${editingTemplateId ? 'lg:col-span-2' : ''}`}>
            <label className="block text-xs font-black text-gray-700">
              اسم وسيلة الدفع <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={templateName}
              onChange={onNameChange}
              placeholder="مثال: Vodafone Cash، InstaPay"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
            />
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-700">شعار وسيلة الدفع (اختياري)</label>
            <div className="flex items-center gap-2">
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                onChange={onLogoChange}
                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-xs transition-all text-gray-900 cursor-pointer file:border-0 file:bg-blue-50 file:text-blue-700 file:rounded-xl file:px-3 file:py-2 file:font-black file:text-[11px] file:ml-3 file:cursor-pointer hover:file:bg-blue-100"
              />
              {templateLogoFile && (
                <button
                  type="button"
                  onClick={onClearLogo}
                  title="إلغاء الصورة"
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-100 transition-all"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loadingTemplate}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10 active:scale-[0.98]"
          >
            {loadingTemplate ? <Loader2 className="animate-spin" size={18} /> : editingTemplateId ? <Save size={18} /> : <Plus size={18} />}
            <span>{editingTemplateId ? 'حفظ قالب وسيلة الدفع' : 'إضافة وسيلة دفع'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Section 2: Active Account Form Props ─────────────────────────────────────

export interface ActiveAccountFormProps {
  // State
  editingAccountId: number | null;
  activeAccounts: UserPaymentInfo[];
  selectedTemplateId: string;
  accountValue: string;
  accountCurrency: string;
  accountFilterCountry: string;
  loadingAccount: boolean;
  receiverTemplates: ReceiverAccount[];
  // Handlers
  onSubmit: (e: React.FormEvent) => void;
  onFilterCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTemplateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAccountValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelEdit: () => void;
  onEditAccount: (method: UserPaymentInfo) => void;
  onDeleteAccount: (id: number) => void;
}

export function ActiveAccountForm({
  editingAccountId,
  activeAccounts,
  selectedTemplateId,
  accountValue,
  accountCurrency,
  accountFilterCountry,
  loadingAccount,
  receiverTemplates,
  onSubmit,
  onFilterCountryChange,
  onTemplateChange,
  onAccountValueChange,
  onCancelEdit,
  onEditAccount,
  onDeleteAccount,
}: ActiveAccountFormProps) {
  const atLimit = !editingAccountId && activeAccounts.length >= MAX_ACTIVE_ACCOUNTS;

  const badgeClass = activeAccounts.length >= MAX_ACTIVE_ACCOUNTS
    ? 'bg-amber-100 text-amber-800 border-amber-200'
    : activeAccounts.length > 0
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-gray-100 text-gray-500 border-gray-200';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-800">
            {editingAccountId ? 'تعديل بيانات الحساب المفعل' : 'تنشيط وتفعيل حساب دفع جديد'}
          </h3>
          <div className="flex items-center gap-3">
            <span className={`text-[11px] px-3 py-1 rounded-full font-black border transition-all ${badgeClass}`}>
              {activeAccounts.length} / {MAX_ACTIVE_ACCOUNTS} وسائل مفعلة
            </span>
            {editingAccountId && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-black rounded-lg transition-all"
              >
                <X size={12} />
                <span>إلغاء التعديل</span>
              </button>
            )}
          </div>
        </div>

        {/* Body: limit reached banner OR form */}
        {atLimit ? (
          <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <AlertCircle size={28} className="text-amber-500" />
            </div>
            <div>
              <p className="font-black text-gray-800 text-sm">تم الوصول إلى الحد الأقصى</p>
              <p className="text-xs text-gray-400 font-bold mt-1">
                لقد فعّلت {MAX_ACTIVE_ACCOUNTS} وسائل دفع. احذف إحداها لإضافة وسيلة جديدة.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              {/* Country filter */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700">تصفية حسب الدولة</label>
                <select
                  value={accountFilterCountry}
                  onChange={onFilterCountryChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                >
                  <option value="">-- كل الدول --</option>
                  {COUNTRY_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Template picker */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700">
                  وسيلة الدفع (اختر من القوالب) <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={onTemplateChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                >
                  <option value="">-- اختر وسيلة تفعيل --</option>
                  {receiverTemplates
                    .filter(t => !accountFilterCountry || t.country_code === accountFilterCountry)
                    .map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.country_code || 'SA'})
                      </option>
                    ))}
                </select>
              </div>

              {/* Account number */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700">
                  رقم الحساب أو رقم الهاتف المربوط <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountValue}
                  onChange={onAccountValueChange}
                  placeholder="أدخل رقم الحساب أو الرقم الهاتفي للتحويل"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900 text-left"
                />
              </div>

              {/* Currency (read-only) */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700">العملة المقبولة</label>
                <select
                  value={accountCurrency}
                  disabled
                  className="w-full p-4 bg-gray-200 border border-gray-200 rounded-2xl outline-none font-bold text-sm text-gray-400 cursor-not-allowed"
                >
                  {CURRENCY_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loadingAccount}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10 active:scale-[0.98]"
              >
                {loadingAccount ? <Loader2 className="animate-spin" size={18} /> : editingAccountId ? <Save size={18} /> : <CheckCircle2 size={18} />}
                <span>{editingAccountId ? 'حفظ تعديلات الحساب' : 'تفعيل وسيلة التحصيل'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Active accounts grid */}
      {activeAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeAccounts.map(method => (
            <ActiveAccountCard
              key={method.id}
              method={method}
              onEdit={onEditAccount}
              onDelete={onDeleteAccount}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
          <AlertCircle size={48} className="mb-3 opacity-20 text-blue-600" />
          <h4 className="font-black text-gray-900 mb-1">لا توجد حسابات مفعلة حتى الآن</h4>
          <p className="text-xs font-bold max-w-xs text-center leading-relaxed">
            اختر وسيلة دفع من القوالب أعلاه، وأدخل بيانات التحويل الخاصة بك لتظهر لطلابك عند التسجيل بالدورات.
          </p>
        </div>
      )}
    </div>
  );
}
