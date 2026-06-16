'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { showAlert } from '@/lib/sweetalert';
import { Save, AlertCircle, Loader2, Plus, Edit2, Trash2, X, Landmark, RefreshCw, CheckCircle2 } from 'lucide-react';
import {
  getReceiverAccounts,
  createAcademyReceiverAccount,
  updateAcademyReceiverAccount,
  deleteAcademyReceiverAccount,
  getUserPaymentInfos,
  createUserPaymentInfo,
  updateUserPaymentInfo,
  deleteUserPaymentInfo,
  UserPaymentInfo
} from '@/services/finance';
import { ReceiverAccount } from '@/types/api';
import { getLogoUrl } from '@/lib/utils';

// ==========================================
// SUB-COMPONENTS
// ==========================================

interface TemplateCardProps {
  template: ReceiverAccount;
  onEdit: (template: ReceiverAccount) => void;
  onDelete: (id: number) => void;
}

const TemplateCard = React.memo(({ template, onEdit, onDelete }: TemplateCardProps) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [template.logo]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(template);
  }, [template, onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(template.id);
  }, [template.id, onDelete]);

  return (
    <div className="p-5 rounded-2xl border border-gray-150 bg-white hover:border-blue-100 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-black text-gray-900 text-sm">{template.name}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-block text-[9px] bg-blue-50/80 text-blue-600 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
              {template.key}
            </span>
            {template.country_code && (
              <span className="inline-block text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                {template.country_code}
              </span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150/80 flex items-center justify-center overflow-hidden shrink-0">
          {template.logo && !imgError ? (
            <img
              src={getLogoUrl(template.logo)}
              alt={template.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <Landmark size={18} className="text-slate-400" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-50 shrink-0">
        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center gap-1 text-[11px] font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 px-2.5 py-1 rounded-lg transition-colors"
        >
          <Edit2 size={11} />
          <span>تعديل</span>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1 text-[11px] font-black text-red-600 hover:text-red-700 hover:bg-red-55 px-2.5 py-1 rounded-lg transition-colors"
        >
          <Trash2 size={11} />
          <span>حذف</span>
        </button>
      </div>
    </div>
  );
});
TemplateCard.displayName = 'TemplateCard';

interface ActiveAccountCardProps {
  method: UserPaymentInfo;
  onEdit: (method: UserPaymentInfo) => void;
  onDelete: (id: number) => void;
}

const ActiveAccountCard = React.memo(({ method, onEdit, onDelete }: ActiveAccountCardProps) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [method.logo]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(method);
  }, [method, onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(method.id);
  }, [method.id, onDelete]);

  return (
    <div className="p-6 rounded-2xl border border-gray-150 bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-black text-gray-900 text-base">{method.name}</h4>
          <span className="inline-block text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wide">
            {method.currency}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center overflow-hidden shrink-0">
          {method.logo && !imgError ? (
            <img
              src={getLogoUrl(method.logo)}
              alt={method.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <Landmark size={20} />
          )}
        </div>
      </div>

      <div className="space-y-1 pt-2">
        <span className="text-xs text-gray-400 font-bold block">رقم الحساب / المحفظة</span>
        <span className="font-mono text-sm text-gray-700 font-bold break-all select-all block bg-gray-50 p-2.5 rounded-xl border border-gray-100/50 text-left">
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
ActiveAccountCard.displayName = 'ActiveAccountCard';


export const AcademyPaymentSettingsForm = () => {
  const [fetching, setFetching] = useState(true);

  // Lists
  const [receiverTemplates, setReceiverTemplates] = useState<ReceiverAccount[]>([]);
  const [activeAccounts, setActiveAccounts] = useState<UserPaymentInfo[]>([]);

  // Form State: 1. Receiver Accounts Templates
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [templateCountry, setTemplateCountry] = useState('SA');
  const [templateName, setTemplateName] = useState('');
  const [templateLogoFile, setTemplateLogoFile] = useState<File | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState('');

  // Form State: 2. Active Accounts (Instructor receiver accounts)
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const [accountCurrency, setAccountCurrency] = useState('SAR');

  // Fetch all lists
  const loadData = useCallback(async () => {
    setFetching(true);
    try {
      const [templates, configs] = await Promise.all([
        getReceiverAccounts(),
        getUserPaymentInfos()
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

  // Clean Form: Templates
  const resetTemplateForm = useCallback(() => {
    setEditingTemplateId(null);
    setTemplateCountry('SA');
    setTemplateName('');
    setSelectedPresetId('');
    setTemplateLogoFile(null);
  }, []);

  // Clean Form: Accounts
  const resetAccountForm = useCallback(() => {
    setEditingAccountId(null);
    setSelectedTemplateId('');
    setAccountValue('');
    setAccountCurrency('SAR');
  }, []);

  // Template Submit (receiver_accounts)
  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) {
      showAlert.warning('تنبيه', 'يرجى إدخال اسم وسيلة الدفع');
      return;
    }

    setLoadingTemplate(true);
    try {
      const selectedPreset = receiverTemplates.find(acc => acc.id.toString() === selectedPresetId);
      const payload = {
        name: templateName,
        key: selectedPreset?.key || templateName.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'custom_key',
        country_code: templateCountry,
        logo: templateLogoFile,
      };

      if (editingTemplateId) {
        await updateAcademyReceiverAccount(editingTemplateId, payload);
        showAlert.success('تم التحديث بنجاح', 'تم تحديث قالب وسيلة الدفع');
      } else {
        await createAcademyReceiverAccount(payload);
        showAlert.success('تمت الإضافة بنجاح', 'تم حفظ قالب وسيلة الدفع الجديدة');
      }

      resetTemplateForm();
      const templates = await getReceiverAccounts();
      setReceiverTemplates(templates);
    } catch (error: any) {
      showAlert.error('خطأ أثناء الحفظ', error?.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoadingTemplate(false);
    }
  };

  // Active Account Submit (instructor_receiver_accounts)
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) {
      showAlert.warning('تنبيه', 'يرجى اختيار وسيلة دفع من القوالب');
      return;
    }
    if (!accountValue.trim()) {
      showAlert.warning('تنبيه', 'يرجى إدخال رقم الحساب أو المحفظة');
      return;
    }

    setLoadingAccount(true);
    try {
      const selectedTemplate = receiverTemplates.find(t => t.id.toString() === selectedTemplateId);
      const payload: any = {
        name: selectedTemplate?.name || '',
        accountValue,
        currency: accountCurrency,
        receiver_account_id: parseInt(selectedTemplateId, 10),
      };

      if (editingAccountId) {
        await updateUserPaymentInfo(editingAccountId, payload);
        showAlert.success('تم التحديث بنجاح', 'تم تحديث حساب التحصيل بنجاح');
      } else {
        await createUserPaymentInfo(payload);
        showAlert.success('تم التنشيط بنجاح', 'تم تفعيل حساب التحصيل الجديد');
      }

      resetAccountForm();
      const configs = await getUserPaymentInfos();
      setActiveAccounts(configs);
    } catch (error: any) {
      showAlert.error('خطأ أثناء الحفظ', error?.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoadingAccount(false);
    }
  };

  // Edit Handlers
  const handleEditTemplate = useCallback((template: ReceiverAccount) => {
    setEditingTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateCountry(template.country_code || 'SA');
    setSelectedPresetId('');
  }, []);

  const handleEditAccount = useCallback((method: UserPaymentInfo) => {
    setEditingAccountId(method.id);
    setAccountValue(method.accountValue);
    setAccountCurrency(method.currency);
    setSelectedTemplateId(method.receiver_account_id?.toString() || '');
  }, []);

  // Delete Handlers
  const handleDeleteTemplate = useCallback(async (id: number) => {
    const confirm = await showAlert.confirm(
      'هل أنت متأكد؟',
      'سيؤدي حذف قالب وسيلة الدفع هذا إلى تعطيلها لجميع الحسابات المرتبطة.'
    );
    if (!confirm.isConfirmed) return;

    try {
      await deleteAcademyReceiverAccount(id);
      setReceiverTemplates(prev => prev.filter(t => t.id !== id));
      showAlert.success('تم الحذف', 'تم حذف قالب وسيلة الدفع بنجاح');
      if (editingTemplateId === id) resetTemplateForm();
    } catch (error: any) {
      showAlert.error('فشل الحذف', error?.message || 'تعذر حذف قالب وسيلة الدفع حالياً');
    }
  }, [editingTemplateId, resetTemplateForm]);

  const handleDeleteAccount = useCallback(async (id: number) => {
    const confirm = await showAlert.confirm(
      'هل أنت متأكد؟',
      'سيتم إيقاف تفعيل حساب التحصيل هذا ولن يظهر للطلاب عند شراء الدورات.'
    );
    if (!confirm.isConfirmed) return;

    try {
      await deleteUserPaymentInfo(id);
      setActiveAccounts(prev => prev.filter(m => m.id !== id));
      showAlert.success('تم تعطيل الحساب', 'تم إيقاف وسيلة الدفع بنجاح');
      if (editingAccountId === id) resetAccountForm();
    } catch (error: any) {
      showAlert.error('فشل التعطيل', error?.message || 'تعذر إيقاف تفعيل وسيلة الدفع حالياً');
    }
  }, [editingAccountId, resetAccountForm]);

  // Country changes lock template country to currency default
  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTemplateCountry(e.target.value);
    setSelectedPresetId('');
    setTemplateName('');
  }, []);

  // Template select locked to specific country currency
  const handleTemplateSelection = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
    if (templateId) {
      const selected = receiverTemplates.find(t => t.id.toString() === templateId);
      if (selected) {
        // Resolve currency from country
        const country = selected.country_code;
        if (country === 'EG') setAccountCurrency('EGP');
        else if (country === 'AE') setAccountCurrency('AED');
        else if (country === 'QA') setAccountCurrency('QAR');
        else if (country === 'KW') setAccountCurrency('KWD');
        else if (country === 'OM') setAccountCurrency('OMR');
        else if (country === 'BH') setAccountCurrency('BHD');
        else if (country === 'JO') setAccountCurrency('JOD');
        else setAccountCurrency('SAR');
      }
    }
  }, [receiverTemplates]);

  if (fetching) {
    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <span className="text-gray-500 font-bold text-sm">جاري تحميل إعدادات المالية...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12" dir="rtl">

      {/* SECTION 1: AVAILABLE PAYMENT METHOD TEMPLATES (RECEIVER ACCOUNTS) */}
      <div className="space-y-6">
        <div className="border-r-4 border-blue-600 pr-3">
          <h2 className="text-xl font-black text-gray-900">1. قوالب وسائل الدفع المتوفرة بالأكاديمية</h2>
          <p className="text-gray-500 text-xs mt-1">تحديد وإعداد بوابات وطرق الدفع المقبولة بالأكاديمية (مثل: Instapay، فودافون كاش، STC Pay)</p>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800">
              {editingTemplateId ? 'تعديل قالب وسيلة دفع' : 'إضافة قالب وسيلة دفع جديدة'}
            </h3>
            {editingTemplateId && (
              <button
                onClick={resetTemplateForm}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-black rounded-lg transition-all"
              >
                <X size={12} />
                <span>إلغاء التعديل</span>
              </button>
            )}
          </div>

          <form onSubmit={handleTemplateSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Country */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700">الدولة <span className="text-red-500">*</span></label>
                <select
                  value={templateCountry}
                  onChange={handleCountryChange}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                >
                  <option value="SA">السعودية (Saudi Arabia)</option>
                  <option value="EG">مصر (Egypt)</option>
                  <option value="AE">الإمارات (UAE)</option>
                  <option value="QA">قطر (Qatar)</option>
                  <option value="KW">الكويت (Kuwait)</option>
                  <option value="OM">عمان (Oman)</option>
                  <option value="BH">البحرين (Bahrain)</option>
                  <option value="JO">الأردن (Jordan)</option>
                </select>
              </div>

              {/* Template Presets */}
              {!editingTemplateId && (
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700">تعبئة تلقائية من القوالب</label>
                  <select
                    value={selectedPresetId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedPresetId(val);
                      if (val) {
                        const selected = receiverTemplates.find(t => t.id.toString() === val);
                        if (selected) setTemplateName(selected.name);
                      }
                    }}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                  >
                    <option value="">-- اختر وسيلة لملء الاسم --</option>
                    {receiverTemplates
                      .filter(acc => acc.country_code === templateCountry)
                      .map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Name */}
              <div className={`space-y-2 ${editingTemplateId ? 'lg:col-span-2' : ''}`}>
                <label className="block text-xs font-black text-gray-700">اسم وسيلة الدفع <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="مثال: Vodafone Cash، InstaPay"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                />
              </div>

              {/* Logo */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700">شعار وسيلة الدفع (اختياري)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTemplateLogoFile(e.target.files?.[0] || null)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-xs transition-all text-gray-900 cursor-pointer file:border-0 file:bg-blue-50 file:text-blue-700 file:rounded-xl file:px-3 file:py-2 file:font-black file:text-[11px] file:ml-3 file:cursor-pointer hover:file:bg-blue-100 transition-colors"
                />
              </div>

            </div>

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

        {/* Templates list (exactly like the cards in image 1) */}
        {/* {receiverTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {receiverTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
              />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-150 font-bold text-sm">
            لا توجد وسائل دفع مضافة حالياً.
          </div>
        )} */}
      </div>

      <hr className="border-gray-100" />

      {/* SECTION 2: ACTIVATED PAYMENT METHODS WITH ACCOUNT DETAILS (INSTRUCTOR RECEIVER ACCOUNTS) */}
      <div className="space-y-6">
        <div className="border-r-4 border-blue-600 pr-3">
          <h2 className="text-xl font-black text-gray-900">2. حسابات تحصيل الأكاديمية المفعلة للدورات</h2>
          <p className="text-gray-500 text-xs mt-1">تنشيط وربط حسابات البنك أو أرقام الهواتف الخاصة بك بوسائل الدفع لتلقي أموال الطلاب عليها</p>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800">
              {editingAccountId ? 'تعديل بيانات الحساب المفعل' : 'تنشيط وتفعيل حساب دفع جديد'}
            </h3>
            {editingAccountId && (
              <button
                onClick={resetAccountForm}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-black rounded-lg transition-all"
              >
                <X size={12} />
                <span>إلغاء التعديل</span>
              </button>
            )}
          </div>

          <form onSubmit={handleAccountSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Select template */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700">وسيلة الدفع (اختر من القوالب) <span className="text-red-500">*</span></label>
                <select
                  value={selectedTemplateId}
                  onChange={handleTemplateSelection}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900"
                >
                  <option value="">-- اختر وسيلة تفعيل --</option>
                  {receiverTemplates.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.country_code || 'SA'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Value / account details */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700">رقم الحساب أو رقم الهاتف المربوط <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={accountValue}
                  onChange={(e) => setAccountValue(e.target.value)}
                  placeholder="أدخل رقم الحساب أو الرقم الهاتفي للتحويل"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-gray-900 text-left"
                />
              </div>

              {/* Locked Currency */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700">العملة المقبولة</label>
                <select
                  value={accountCurrency}
                  onChange={(e) => setAccountCurrency(e.target.value)}
                  disabled={true}
                  className="w-full p-4 bg-gray-200 border border-gray-200 rounded-2xl outline-none font-bold text-sm text-gray-400 cursor-not-allowed"
                >
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="EGP">جنيه مصري (EGP)</option>
                  <option value="AED">درهم إماراتي (AED)</option>
                  <option value="QAR">ريال قطري (QAR)</option>
                  <option value="KWD">دينار كويتي (KWD)</option>
                  <option value="OMR">ريال عماني (OMR)</option>
                  <option value="BHD">دينار بحريني (BHD)</option>
                  <option value="JOD">دينار أردني (JOD)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                </select>
              </div>

            </div>

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
        </div>

        {/* Configured payment accounts list */}
        {activeAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAccounts.map((method) => (
              <ActiveAccountCard
                key={method.id}
                method={method}
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
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

    </div>
  );
};
