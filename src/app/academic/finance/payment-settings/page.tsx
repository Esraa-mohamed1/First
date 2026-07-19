'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Landmark, Loader2, Plus, X, Check, ArrowRight, AlertCircle, Landmark as LandmarkIcon, Info, HelpCircle } from 'lucide-react';
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
import { ActiveAccountCard } from '@/components/payment/ActiveAccountCard';

const MAX_ACTIVE_ACCOUNTS = 4;

const COUNTRY_OPTIONS = [
  { value: 'SA', label: 'السعودية (Saudi Arabia)' },
  { value: 'EG', label: 'مصر (Egypt)' },
  { value: 'AE', label: 'الإمارات (UAE)' },
  { value: 'QA', label: 'قطر (Qatar)' },
  { value: 'KW', label: 'الكويت (Kuwait)' },
  { value: 'OM', label: 'عمان (Oman)' },
  { value: 'BH', label: 'البحرين (Bahrain)' },
  { value: 'JO', label: 'الأردن (Jordan)' },
];

const CURRENCY_OPTIONS = [
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

const fetchImageAsFile = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

const translateErrorToArabic = (msg: string): string => {
  const normalized = msg.toLowerCase().trim();
  if (normalized.includes('logo') && (normalized.includes('required') || normalized.includes('must not be empty'))) {
    return 'شعار وسيلة الدفع مطلوب.';
  }
  if (normalized.includes('name') && (normalized.includes('required') || normalized.includes('must not be empty'))) {
    return 'اسم وسيلة الدفع مطلوب.';
  }
  if (normalized.includes('key') && (normalized.includes('required') || normalized.includes('must not be empty'))) {
    return 'مفتاح وسيلة الدفع مطلوب.';
  }
  if (normalized.includes('country_code') || normalized.includes('country code')) {
    return 'رمز الدولة مطلوب.';
  }
  if (normalized.includes('account_value') || normalized.includes('account value') || normalized.includes('value')) {
    return 'رقم الحساب أو رقم الهاتف المربوط مطلوب.';
  }
  if (normalized.includes('currency')) {
    return 'العملة مقبولة ومطلوبة.';
  }
  if (normalized.includes('receiver_account_id') || normalized.includes('receiver account id')) {
    return 'يرجى اختيار وسيلة الدفع من القوالب.';
  }
  return msg;
};

export default function AcademyPaymentSettingsPage() {
  const [fetching, setFetching] = useState(true);
  const [receiverTemplates, setReceiverTemplates] = useState<ReceiverAccount[]>([]);
  const [activeAccounts, setActiveAccounts] = useState<UserPaymentInfo[]>([]);

  // ─── Wizard Flow State ──────────────────────────────────────────────────────
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);

  // Step 1 Form States
  const [templateCountry, setTemplateCountry] = useState('SA');
  const [templateName, setTemplateName] = useState('');
  const [templateLogoFile, setTemplateLogoFile] = useState<File | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [loadingStep1, setLoadingStep1] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 Form States
  const [wizardTemplateId, setWizardTemplateId] = useState<number | null>(null);
  const [accountValue, setAccountValue] = useState('');
  const [accountCurrency, setAccountCurrency] = useState('SAR');
  const [loadingStep2, setLoadingStep2] = useState(false);

  // ─── Data Loading ───────────────────────────────────────────────────────────
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

  // ─── Reset / Close Helpers ──────────────────────────────────────────────────
  const closeWizard = useCallback(() => {
    setShowWizard(false);
    setWizardStep(1);
    setEditingAccountId(null);
    setTemplateCountry('SA');
    setTemplateName('');
    setSelectedPresetId('');
    setTemplateLogoFile(null);
    setWizardTemplateId(null);
    setAccountValue('');
    setAccountCurrency('SAR');
    if (logoFileInputRef.current) logoFileInputRef.current.value = '';
  }, []);

  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setTemplateCountry(country);
    setSelectedPresetId('');
    setTemplateName('');
    setTemplateLogoFile(null);

    const currencyMap: Record<string, string> = {
      EG: 'EGP', AE: 'AED', QA: 'QAR', KW: 'KWD', OM: 'OMR', BH: 'BHD', JO: 'JOD', SA: 'SAR'
    };
    setAccountCurrency(currencyMap[country] ?? 'SAR');
  }, []);

  const handlePresetChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPresetId(val);
    if (val) {
      const selected = receiverTemplates.find(t => t.id.toString() === val);
      if (selected) {
        setTemplateName(selected.name);
        if (selected.logo) {
          try {
            const logoFile = await fetchImageAsFile(selected.logo, `${selected.key}.png`);
            setTemplateLogoFile(logoFile);
          } catch (err) {
            console.error('Failed to fetch preset logo:', err);
          }
        }
      }
    } else {
      setTemplateName('');
      setTemplateLogoFile(null);
    }
  }, [receiverTemplates]);

  // ─── Step 1: Submit & Validate Payment Method Template ───────────────────────
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) {
      showAlert.warning('تنبيه', 'يرجى إدخال اسم وسيلة الدفع');
      return;
    }

    setLoadingStep1(true);
    try {
      const selectedPreset = receiverTemplates.find(acc => acc.id.toString() === selectedPresetId);
      const presetKey = selectedPreset?.key || templateName.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'custom_key';

      // Check if a template with this key and country code already exists in receiverTemplates
      const existing = receiverTemplates.find(
        t => t.key === presetKey && t.country_code === templateCountry
      );

      if (existing) {
        // Safe: template already exists, do not call create template endpoint to avoid duplicate key validation error!
        setWizardTemplateId(existing.id);
        
        // Auto resolve currency for step 2
        const currencyMap: Record<string, string> = {
          EG: 'EGP', AE: 'AED', QA: 'QAR', KW: 'KWD', OM: 'OMR', BH: 'BHD', JO: 'JOD', SA: 'SAR'
        };
        setAccountCurrency(currencyMap[existing.country_code || 'SA'] ?? 'SAR');
        
        setWizardStep(2);
      } else {
        // Call endpoint to create template
        const payload = {
          name: templateName,
          key: presetKey,
          country_code: templateCountry,
          logo: templateLogoFile,
        };

        const newTemplate = await createAcademyReceiverAccount(payload);
        setWizardTemplateId(newTemplate.id);
        
        const currencyMap: Record<string, string> = {
          EG: 'EGP', AE: 'AED', QA: 'QAR', KW: 'KWD', OM: 'OMR', BH: 'BHD', JO: 'JOD', SA: 'SAR'
        };
        setAccountCurrency(currencyMap[templateCountry] ?? 'SAR');
        
        // Refresh templates list
        setReceiverTemplates(await getReceiverAccounts());
        setWizardStep(2);
      }
    } catch (error: any) {
      console.error('Step 1 Error:', error);
      if (error?.errors) {
        const allMsgs: string[] = [];
        Object.values(error.errors).forEach((msgs: any) => {
          const messages = Array.isArray(msgs) ? msgs : [String(msgs)];
          messages.forEach((msg) => allMsgs.push(translateErrorToArabic(msg)));
        });
        showAlert.error('خطأ في البيانات', allMsgs.join(' | ') || 'يرجى التحقق من المدخلات');
      } else {
        showAlert.error('خطأ', translateErrorToArabic(error?.message || 'فشل حفظ وسيلة الدفع'));
      }
    } finally {
      setLoadingStep1(false);
    }
  };

  // ─── Step 2: Submit & Activate Collection Account ──────────────────────────
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardTemplateId) {
      showAlert.error('خطأ', 'يرجى إعداد وسيلة الدفع في الخطوة الأولى أولاً');
      setWizardStep(1);
      return;
    }
    if (!accountValue.trim()) {
      showAlert.warning('تنبيه', 'يرجى إدخال رقم الحساب أو المحفظة أو رقم الهاتف');
      return;
    }

    setLoadingStep2(true);
    try {
      const selectedTemplate = receiverTemplates.find(t => t.id === wizardTemplateId);
      const payload = {
        name: selectedTemplate?.name || templateName || '',
        accountValue,
        currency: accountCurrency,
        receiver_account_id: wizardTemplateId,
      };

      if (editingAccountId) {
        await updateUserPaymentInfo(editingAccountId, payload);
        showAlert.success('تم التحديث بنجاح', 'تم تحديث حساب التحصيل بنجاح');
      } else {
        await createUserPaymentInfo(payload);
        showAlert.success('تم التنشيط بنجاح', 'تم تفعيل وسيلة التحصيل بنجاح وبدأت تظهر للدورات');
      }

      closeWizard();
      setActiveAccounts(await getUserPaymentInfos());
    } catch (error: any) {
      console.error('Step 2 Error:', error);
      if (error?.errors) {
        const allMsgs: string[] = [];
        Object.values(error.errors).forEach((msgs: any) => {
          const messages = Array.isArray(msgs) ? msgs : [String(msgs)];
          messages.forEach((msg) => allMsgs.push(translateErrorToArabic(msg)));
        });
        showAlert.error('خطأ في البيانات', allMsgs.join(' | ') || 'يرجى التحقق من البيانات');
      } else {
        showAlert.error('خطأ', translateErrorToArabic(error?.message || 'فشل تفعيل حساب التحصيل'));
      }
    } finally {
      setLoadingStep2(false);
    }
  };

  // ─── Edit Mode Handler ──────────────────────────────────────────────────────
  const handleEditAccount = useCallback((method: UserPaymentInfo) => {
    setEditingAccountId(method.id);
    setWizardTemplateId(method.receiver_account_id ?? null);
    setAccountValue(method.accountValue);
    setAccountCurrency(method.currency);

    // Try to prefill step 1 if the template exists
    const template = receiverTemplates.find(t => t.id === method.receiver_account_id);
    if (template) {
      setTemplateName(template.name);
      setTemplateCountry(template.country_code || 'SA');
    }
    
    setWizardStep(1); // Open at step 1 so they can review template or edit value directly in step 2
    setShowWizard(true);
  }, [receiverTemplates]);

  // ─── Delete Mode Handler ────────────────────────────────────────────────────
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
    } catch (error: any) {
      showAlert.error('فشل التعطيل', error?.message || 'تعذر إيقاف تفعيل وسيلة الدفع حالياً');
    }
  }, []);

  return (
    <div className="space-y-8 text-right font-sans" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Landmark size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900">وسائل الدفع والتحصيل</h1>
            <p className="text-gray-400 text-xs font-bold mt-1">تفعيل وإعداد حسابات تحصيل الأموال وبوابات الدفع للدورات الخاصة بك</p>
          </div>
        </div>

        {!showWizard && activeAccounts.length < MAX_ACTIVE_ACCOUNTS && (
          <button
            onClick={() => {
              closeWizard();
              setShowWizard(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            تفعيل وسيلة جديدة
          </button>
        )}
      </div>

      {/* ─── Wizard Flow Panel (Unified Steps Container) ─── */}
      {showWizard && (
        <div className="bg-white rounded-3xl border-2 border-blue-500/20 shadow-xl overflow-hidden animate-in fade-in duration-200">
          {/* Header Step Status Bar */}
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-800">
                {editingAccountId ? 'تحديث وتعديل وسيلة الدفع' : 'تفعيل وسيلة دفع وتحصيل جديدة'}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">اتبع الخطوات لتجهيز بوابة التحصيل لاستقبال الدفعات</p>
            </div>
            
            {/* Step Indicators */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  wizardStep === 1 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-green-100 text-green-700 font-black'
                }`}>
                  {wizardStep > 1 ? <Check size={12} /> : '1'}
                </span>
                <span className={`text-[11px] font-black ${wizardStep === 1 ? 'text-blue-600' : 'text-slate-500'}`}>وسيلة الدفع</span>
              </div>
              <div className="h-0.5 w-8 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  wizardStep === 2 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  2
                </span>
                <span className={`text-[11px] font-black ${wizardStep === 2 ? 'text-blue-600' : 'text-slate-400'}`}>حساب التحصيل</span>
              </div>
            </div>
          </div>

          {/* Step 1: Template Validation */}
          {wizardStep === 1 && (
            <form onSubmit={handleStep1Submit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Country */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700">
                    الدولة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={templateCountry}
                    onChange={handleCountryChange}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-slate-900 cursor-pointer"
                  >
                    {COUNTRY_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Preset Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700">اختر وسيلة الدفع المعتمدة</label>
                  <select
                    value={selectedPresetId}
                    onChange={handlePresetChange}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-slate-900 cursor-pointer"
                  >
                    <option value="">-- وسيلة مخصصة (أخرى) --</option>
                    {receiverTemplates
                      .filter(acc => acc.country_code === templateCountry)
                      .map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                  </select>
                </div>

                {/* Name */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-black text-slate-700">
                    اسم وسيلة الدفع المعروض للطلاب <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    placeholder="مثال: Vodafone Cash، InstaPay، STC Pay"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-slate-900"
                  />
                </div>

                {/* Logo file (only if custom/no preset selected) */}
                {!selectedPresetId && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-black text-slate-700">أيقونة الشعار (اختياري)</label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={logoFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={e => setTemplateLogoFile(e.target.files?.[0] || null)}
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-bold cursor-pointer file:border-0 file:bg-blue-50 file:text-blue-700 file:rounded-xl file:px-3 file:py-2 file:font-black file:text-[10px] file:ml-3 hover:file:bg-blue-100"
                      />
                      {templateLogoFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setTemplateLogoFile(null);
                            if (logoFileInputRef.current) logoFileInputRef.current.value = '';
                          }}
                          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-all cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 1 Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeWizard}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loadingStep1}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-7 py-3 rounded-xl transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {loadingStep1 ? <Loader2 className="animate-spin" size={14} /> : <ArrowRight size={14} />}
                  <span>حفظ ومتابعة</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Account Value Registration */}
          {wizardStep === 2 && (
            <form onSubmit={handleStep2Submit} className="p-6 space-y-6">
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-right">
                  <p className="text-xs font-black text-blue-900">رائع، وسيلة الدفع مفعلة وجاهزة</p>
                  <p className="text-[10px] text-blue-700/80 font-bold mt-0.5">الآن حدد رقم الحساب أو رقم الموبايل لتوجيه مدفوعات الطلاب إليها.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Selected Method preview */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400">وسيلة الدفع المختارة</label>
                  <div className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-black text-slate-600 text-sm">
                    {templateName || 'بوابة دفع مخصصة'}
                  </div>
                </div>

                {/* Account Value */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-black text-slate-700">
                    رقم الحساب البنكي أو رقم الموبايل (المحفظة) للتحصيل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountValue}
                    onChange={e => setAccountValue(e.target.value)}
                    placeholder="مثال: 01002939223 أو رقم الايبان البنكي الكامل"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-slate-900 text-left font-mono"
                  />
                </div>

                {/* Accepted Currency */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700">العملة المقبولة للتحصيل</label>
                  <select
                    value={accountCurrency}
                    onChange={e => setAccountCurrency(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white font-bold text-sm transition-all text-slate-900 cursor-pointer"
                  >
                    {CURRENCY_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                >
                  الرجوع للخطوة السابقة
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeWizard}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-400 font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    إلغاء التفعيل
                  </button>
                  <button
                    type="submit"
                    disabled={loadingStep2}
                    className="bg-green-600 hover:bg-green-700 text-white font-black text-xs px-8 py-3 rounded-xl transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {loadingStep2 ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                    <span>تأكيد وتفعيل الحساب</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ─── Section 2: Active Accounts List ─── */}
      <div className="space-y-4">
        <div className="border-r-4 border-blue-600 pr-3">
          <h2 className="text-base font-black text-slate-800">حسابات تحصيل الأكاديمية المفعلة للدورات</h2>
          <p className="text-slate-400 text-[10px] font-bold mt-0.5">الحسابات والوسائل المفعلة التي تظهر لطلابك عند الاشتراك</p>
        </div>

        {fetching ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-slate-400 font-bold text-xs">جاري تحميل الحسابات الحالية...</span>
          </div>
        ) : activeAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAccounts.map(method => (
              <ActiveAccountCard
                key={method.id}
                method={method}
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-150">
            <LandmarkIcon size={48} className="mb-4 opacity-20 text-blue-600" />
            <h4 className="font-black text-slate-800 mb-1 text-sm">لا توجد حسابات تحصيل مفعلة حالياً</h4>
            <p className="text-[10px] font-bold max-w-xs text-center leading-relaxed text-slate-400">
              انقر فوق زر "تفعيل وسيلة جديدة" لإضافة بيانات التحويل الخاصة بك (رقم بنكي أو هاتف محمول) لتبدأ بالظهور للطلاب.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
