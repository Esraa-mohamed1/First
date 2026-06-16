'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Landmark, Loader2 } from 'lucide-react';
import { showAlert } from '@/lib/sweetalert';
import {
  getReceiverAccounts,
  createAcademyReceiverAccount,
  updateAcademyReceiverAccount,
  deleteAcademyReceiverAccount,
  getUserPaymentInfos,
  createUserPaymentInfo,
  updateUserPaymentInfo,
  deleteUserPaymentInfo,
  UserPaymentInfo,
} from '@/services/finance';
import { ReceiverAccount } from '@/types/api';
import {
  TemplateForm,
  ActiveAccountForm,
  MAX_ACTIVE_ACCOUNTS,
} from '@/components/forms/AcademyPaymentSettingsForm';

export default function AcademyPaymentSettingsPage() {

  // ─── Data Lists ─────────────────────────────────────────────────────────────

  const [fetching, setFetching] = useState(true);
  const [receiverTemplates, setReceiverTemplates] = useState<ReceiverAccount[]>([]);
  const [activeAccounts, setActiveAccounts] = useState<UserPaymentInfo[]>([]);

  // ─── Section 1: Template Form State ─────────────────────────────────────────

  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [templateCountry, setTemplateCountry] = useState('SA');
  const [templateName, setTemplateName] = useState('');
  const [templateLogoFile, setTemplateLogoFile] = useState<File | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // ─── Section 2: Active Account Form State ────────────────────────────────────

  const [loadingAccount, setLoadingAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const [accountCurrency, setAccountCurrency] = useState('SAR');
  const [accountFilterCountry, setAccountFilterCountry] = useState('');

  // ─── Data Fetching ───────────────────────────────────────────────────────────

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

  // ─── Reset Helpers ───────────────────────────────────────────────────────────

  const resetTemplateForm = useCallback(() => {
    setEditingTemplateId(null);
    setTemplateCountry('SA');
    setTemplateName('');
    setSelectedPresetId('');
    setTemplateLogoFile(null);
    if (logoFileInputRef.current) logoFileInputRef.current.value = '';
  }, []);

  const clearLogoFile = useCallback(() => {
    setTemplateLogoFile(null);
    if (logoFileInputRef.current) logoFileInputRef.current.value = '';
  }, []);

  const resetAccountForm = useCallback(() => {
    setEditingAccountId(null);
    setSelectedTemplateId('');
    setAccountValue('');
    setAccountCurrency('SAR');
    setAccountFilterCountry('');
  }, []);

  // ─── Section 1: Template Handlers ────────────────────────────────────────────

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
      setReceiverTemplates(await getReceiverAccounts());
    } catch (error: any) {
      showAlert.error('خطأ أثناء الحفظ', error?.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoadingTemplate(false);
    }
  };

  const handleEditTemplate = useCallback((template: ReceiverAccount) => {
    setEditingTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateCountry(template.country_code || 'SA');
    setSelectedPresetId('');
  }, []);

  const handleDeleteTemplate = useCallback(async (id: number) => {
    const result = await showAlert.confirm(
      'هل أنت متأكد؟',
      'سيؤدي حذف قالب وسيلة الدفع هذا إلى تعطيلها لجميع الحسابات المرتبطة.'
    );
    if (!result.isConfirmed) return;
    try {
      await deleteAcademyReceiverAccount(id);
      setReceiverTemplates(prev => prev.filter(t => t.id !== id));
      showAlert.success('تم الحذف', 'تم حذف قالب وسيلة الدفع بنجاح');
      if (editingTemplateId === id) resetTemplateForm();
    } catch (error: any) {
      showAlert.error('فشل الحذف', error?.message || 'تعذر حذف قالب وسيلة الدفع حالياً');
    }
  }, [editingTemplateId, resetTemplateForm]);

  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTemplateCountry(e.target.value);
    setSelectedPresetId('');
    setTemplateName('');
  }, []);

  const handlePresetChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPresetId(val);
    if (val) {
      const selected = receiverTemplates.find(t => t.id.toString() === val);
      if (selected) setTemplateName(selected.name);
    }
  }, [receiverTemplates]);

  // ─── Section 2: Active Account Handlers ──────────────────────────────────────

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccountId && activeAccounts.length >= MAX_ACTIVE_ACCOUNTS) {
      showAlert.warning('تم الوصول للحد الأقصى', `لا يمكن تفعيل أكثر من ${MAX_ACTIVE_ACCOUNTS} وسائل دفع. يرجى حذف وسيلة حالية أولاً.`);
      return;
    }
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
      setActiveAccounts(await getUserPaymentInfos());
    } catch (error: any) {
      showAlert.error('خطأ أثناء الحفظ', error?.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoadingAccount(false);
    }
  };

  const handleEditAccount = useCallback((method: UserPaymentInfo) => {
    setEditingAccountId(method.id);
    setAccountValue(method.accountValue);
    setAccountCurrency(method.currency);
    setSelectedTemplateId(method.receiver_account_id?.toString() || '');
  }, []);

  const handleDeleteAccount = useCallback(async (id: number) => {
    const result = await showAlert.confirm(
      'هل أنت متأكد؟',
      'سيتم إيقاف تفعيل حساب التحصيل هذا ولن يظهر للطلاب عند شراء الدورات.'
    );
    if (!result.isConfirmed) return;
    try {
      await deleteUserPaymentInfo(id);
      setActiveAccounts(prev => prev.filter(m => m.id !== id));
      showAlert.success('تم تعطيل الحساب', 'تم إيقاف وسيلة الدفع بنجاح');
      if (editingAccountId === id) resetAccountForm();
    } catch (error: any) {
      showAlert.error('فشل التعطيل', error?.message || 'تعذر إيقاف تفعيل وسيلة الدفع حالياً');
    }
  }, [editingAccountId, resetAccountForm]);

  const handleTemplateSelection = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
    if (!templateId) return;
    const selected = receiverTemplates.find(t => t.id.toString() === templateId);
    if (!selected) return;
    const currencyMap: Record<string, string> = {
      EG: 'EGP', AE: 'AED', QA: 'QAR', KW: 'KWD', OM: 'OMR', BH: 'BHD', JO: 'JOD',
    };
    setAccountCurrency(currencyMap[selected.country_code] ?? 'SAR');
  }, [receiverTemplates]);

  const handleFilterCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountFilterCountry(e.target.value);
    setSelectedTemplateId('');
    setAccountCurrency('SAR');
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (fetching) {
    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <span className="text-gray-500 font-bold text-sm">جاري تحميل إعدادات المالية...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <Landmark size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المالية</h1>
          <p className="text-gray-500">إدارة إعدادات الدفع والتحصيلات</p>
        </div>
      </div>

      <div className="space-y-12" dir="rtl">

        {/* ── Section 1: Payment Method Templates ── */}
        <div className="space-y-6">
          <div className="border-r-4 border-blue-600 pr-3">
            <h2 className="text-xl font-black text-gray-900">1. قوالب وسائل الدفع المتوفرة بالأكاديمية</h2>
            <p className="text-gray-500 text-xs mt-1">
              تحديد وإعداد بوابات وطرق الدفع المقبولة بالأكاديمية (مثل: Instapay، فودافون كاش، STC Pay)
            </p>
          </div>

          <TemplateForm
            editingTemplateId={editingTemplateId}
            templateCountry={templateCountry}
            templateName={templateName}
            templateLogoFile={templateLogoFile}
            selectedPresetId={selectedPresetId}
            loadingTemplate={loadingTemplate}
            receiverTemplates={receiverTemplates}
            logoFileInputRef={logoFileInputRef}
            onSubmit={handleTemplateSubmit}
            onCountryChange={handleCountryChange}
            onPresetChange={handlePresetChange}
            onNameChange={e => setTemplateName(e.target.value)}
            onLogoChange={e => setTemplateLogoFile(e.target.files?.[0] || null)}
            onClearLogo={clearLogoFile}
            onCancelEdit={resetTemplateForm}
          />
        </div>

        <hr className="border-gray-100" />

        {/* ── Section 2: Active Receiver Accounts ── */}
        <div className="space-y-6">
          <div className="border-r-4 border-blue-600 pr-3">
            <h2 className="text-xl font-black text-gray-900">2. حسابات تحصيل الأكاديمية المفعلة للدورات</h2>
            <p className="text-gray-500 text-xs mt-1">
              تنشيط وربط حسابات البنك أو أرقام الهواتف الخاصة بك بوسائل الدفع لتلقي أموال الطلاب عليها
            </p>
          </div>

          <ActiveAccountForm
            editingAccountId={editingAccountId}
            activeAccounts={activeAccounts}
            selectedTemplateId={selectedTemplateId}
            accountValue={accountValue}
            accountCurrency={accountCurrency}
            accountFilterCountry={accountFilterCountry}
            loadingAccount={loadingAccount}
            receiverTemplates={receiverTemplates}
            onSubmit={handleAccountSubmit}
            onFilterCountryChange={handleFilterCountryChange}
            onTemplateChange={handleTemplateSelection}
            onAccountValueChange={e => setAccountValue(e.target.value)}
            onCancelEdit={resetAccountForm}
            onEditAccount={handleEditAccount}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>

      </div>
    </div>
  );
}
