'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Share2,
  FileText,
  Calendar,
  Layers,
  ChevronDown,
  Check,
  BookOpen
} from 'lucide-react';
import BagPreviewCard from './BagPreviewCard';
import { BagItem, BagFormState } from '@/types/market';

interface CreateBagModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Optional existing bag for editing mode */
  editingBag?: BagItem | null;
  /** Callback when bag is saved/created */
  onSave: (bagData: Partial<BagItem>) => void;
}

const initialFormState: BagFormState = {
  title: 'Tailwind CSS Mastery',
  description:
    'هي لغة تنسيق المواقع التي تجعل الصفحات جميلة CSS ومنظمة وتحكم في ألوانها وأشكالها وتخطيطها بشكل مرن.',
  coverImage:
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  category: 'برمجة وتطوير',
  instructorName: 'أحمد محمد',
  isFree: false,
  price: 0,
  discountPrice: 0,
  paymentMethods: ['instapay'],
  downloadPolicy: 'unlimited',
  downloadLimit: 0,
  downloadExpiry: 'never',
  visibility: 'published',
  selectedCourseIds: [1, 2],
};

/**
 * CreateBagModal Component
 * Full 3-Step Wizard Modal matching Images 2, 3, and 5 with pixel-perfect accuracy.
 */
export default function CreateBagModal({
  isOpen,
  onClose,
  editingBag,
  onSave,
}: CreateBagModalProps) {
  // Wizard Step: 1 = الأساسيات, 2 = المحتوي, 3 = التسعير و الوصول
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [formData, setFormData] = useState<BagFormState>(initialFormState);

  useEffect(() => {
    if (editingBag) {
      setFormData({
        title: editingBag.title || '',
        description: editingBag.description || '',
        coverImage: editingBag.coverImage || '',
        category: editingBag.category || 'برمجة وتطوير',
        instructorName: editingBag.instructorName || 'أحمد محمد',
        isFree: editingBag.isFree || false,
        price: editingBag.price || 0,
        discountPrice: editingBag.discountPrice || 0,
        paymentMethods: editingBag.paymentMethods || ['instapay'],
        downloadPolicy: editingBag.downloadPolicy || 'unlimited',
        downloadLimit: editingBag.downloadLimit || 0,
        downloadExpiry: editingBag.downloadExpiry || 'never',
        visibility: editingBag.visibility || 'published',
        selectedCourseIds: [1, 2],
      });
    } else {
      setFormData(initialFormState);
    }
    setCurrentStep(3); // Match Image 2 default tab
  }, [editingBag, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      description: formData.description,
      coverImage: formData.coverImage,
      category: formData.category,
      instructorName: formData.instructorName,
      isFree: formData.isFree,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice),
      paymentMethods: formData.paymentMethods,
      downloadPolicy: formData.downloadPolicy,
      downloadLimit: formData.downloadLimit,
      downloadExpiry: formData.downloadExpiry,
      visibility: formData.visibility,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-[#F4F6FA] rounded-[36px] p-6 lg:p-8 max-w-6xl w-full max-h-[94vh] overflow-y-auto custom-scrollbar border border-white shadow-2xl relative"
        dir="rtl"
      >
        {/* Modal Close Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {editingBag ? 'تعديل الحقيبة' : 'إنشاء حقيبة تدريبية جديدة'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-gray-200/60 rounded-2xl transition-all text-gray-500 hover:text-gray-900"
          >
            <X size={22} />
          </button>
        </div>

        {/* Wizard Progress Tabs (Matching Images 2, 3, 5) */}
        <div className="bg-white rounded-3xl p-2.5 mb-8 border border-gray-100 shadow-sm grid grid-cols-3 gap-3">
          {/* Step 1 Tab */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-sm ${
              currentStep === 1
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-gray-50/50 text-blue-600 hover:bg-gray-100'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 1 ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
              }`}
            >
              01
            </span>
            <span>الأساسيات</span>
          </button>

          {/* Step 2 Tab */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-sm ${
              currentStep === 2
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-gray-50/50 text-blue-600 hover:bg-gray-100'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 2 ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
              }`}
            >
              02
            </span>
            <span>المحتوي</span>
          </button>

          {/* Step 3 Tab */}
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-sm ${
              currentStep === 3
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-gray-50/50 text-blue-600 hover:bg-gray-100'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3 ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
              }`}
            >
              03
            </span>
            <span>التسعير و الوصول</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {/* STEP 1: BASICS */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">
                بيانات الحقيبة الأساسية
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 block">
                  عنوان الحقيبة التدريبية
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500 transition-all text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 block">
                  وصف الحقيبة
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500 transition-all text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 block">
                  رابط صورة الغلاف
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-500 transition-all text-gray-900"
                />
              </div>
            </div>
          )}

          {/* STEP 2: CONTENT */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">
                تحديد محتويات الحقيبة
              </h3>

              <div className="space-y-3">
                {[
                  { id: 1, title: 'كورس Tailwind CSS Mastery الكامل', count: '20 فيديو' },
                  { id: 2, title: 'دورة JavaScript 2025 التفاعلية', count: '18 فيديو' },
                ].map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between"
                  >
                    <span className="font-bold text-sm text-gray-900">
                      {course.title}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {course.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PRICING & ACCESS (Matching Images 2, 3, and 5) */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Live Bag Preview Card */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <BagPreviewCard formData={formData} />
              </div>

              {/* Right Column: 3 Settings Cards */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. Pricing Settings Card */}
                <div className="bg-white rounded-3xl p-6 lg:p-7 border border-gray-100 shadow-sm space-y-6">
                  {/* Title Header */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">
                        اعدادات التسعير
                      </h3>
                    </div>
                  </div>

                  {/* Free Product Toggle Switch */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                    <div>
                      <h4 className="text-sm font-black text-gray-900">
                        منتج مجاني
                      </h4>
                      <p className="text-xs font-bold text-gray-400 mt-0.5">
                        اجعل هذا المنتج متاحا للجميع بدون رسوم
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFree}
                        onChange={(e) =>
                          setFormData({ ...formData, isFree: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Price & Discount Price Inputs */}
                  {!formData.isFree && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Product Price Input with SAR dropdown */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-700 block">
                          سعر المنتج
                        </label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden focus-within:border-blue-500 transition-all">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="0.00"
                            className="w-full bg-transparent p-3.5 text-sm font-black outline-none text-gray-900"
                          />
                          <div className="px-4 py-3 bg-gray-100/80 border-r border-gray-200 text-xs font-black text-blue-600 flex items-center gap-1 cursor-pointer">
                            <span>SAR</span>
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      </div>

                      {/* Discount Price Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-700 block">
                          السعر بعد الخصم (اختياري)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.discountPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-black outline-none focus:border-blue-500 transition-all text-gray-900"
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Methods Section */}
                  <div className="space-y-3 pt-1">
                    <label className="text-xs font-black text-gray-700 block">
                      اختر طريقة دفع من طرق الدفع الخاصة بك
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* InstaPay Option Card */}
                      <div
                        onClick={() =>
                          setFormData({
                            ...formData,
                            paymentMethods: ['instapay'],
                          })
                        }
                        className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                          formData.paymentMethods.includes('instapay')
                            ? 'border-blue-600 bg-white shadow-sm'
                            : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.paymentMethods.includes('instapay')
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {formData.paymentMethods.includes('instapay') && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>

                        {/* InstaPay Logo Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white font-black text-xs rounded-xl">
                          <span className="text-[11px]">INSTAPAY</span>
                        </div>
                      </div>

                      {/* Vodafone Cash Option Card */}
                      <div
                        onClick={() =>
                          setFormData({
                            ...formData,
                            paymentMethods: ['vodafone'],
                          })
                        }
                        className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                          formData.paymentMethods.includes('vodafone')
                            ? 'border-blue-600 bg-white shadow-sm'
                            : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.paymentMethods.includes('vodafone')
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {formData.paymentMethods.includes('vodafone') && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>

                        {/* Vodafone Cash Logo Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white font-black text-xs rounded-xl">
                          <div className="w-4 h-4 rounded-full bg-white text-red-600 flex items-center justify-center font-black text-[10px]">
                            v
                          </div>
                          <span>cash</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Download Policy Card (Matching Images 2 & 3) */}
                <div className="bg-white rounded-3xl p-6 lg:p-7 border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Download size={20} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">
                      سياسة التحميل
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Option A: Unlimited Downloads */}
                    <div
                      onClick={() =>
                        setFormData({ ...formData, downloadPolicy: 'unlimited' })
                      }
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        formData.downloadPolicy === 'unlimited'
                          ? 'border-blue-600 bg-blue-50/30 shadow-sm'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-gray-900">
                          تحميل غير محدود
                        </h4>
                        <p className="text-xs font-bold text-gray-400">
                          يسمح للطالب بالتحميل دائما
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.downloadPolicy === 'unlimited'
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {formData.downloadPolicy === 'unlimited' && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>

                    {/* Option B: Limited Downloads (Image 3) */}
                    <div
                      onClick={() =>
                        setFormData({ ...formData, downloadPolicy: 'limited' })
                      }
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        formData.downloadPolicy === 'limited'
                          ? 'border-blue-600 bg-blue-50/30 shadow-sm'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-gray-900">
                          عدد مرات تحميل محدد
                        </h4>
                        <p className="text-xs font-bold text-gray-400">
                          تقييد الطالب بعدد تحميل معين
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.downloadPolicy === 'limited'
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {formData.downloadPolicy === 'limited' && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Extra controls when Limited Downloads is selected (Image 3) */}
                  {formData.downloadPolicy === 'limited' && (
                    <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                      {/* Number Input */}
                      <input
                        type="number"
                        min="0"
                        value={formData.downloadLimit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            downloadLimit: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-center text-sm font-black outline-none focus:border-blue-500 transition-all text-gray-900"
                      />

                      {/* Expiry Dropdown */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-700 block">
                          اختر فترة انتهاء صلاحية عدد التحميلات
                        </label>
                        <div className="relative">
                          <select
                            value={formData.downloadExpiry}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                downloadExpiry: e.target.value,
                              })
                            }
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 pr-4 pl-12 text-sm font-bold outline-none focus:border-blue-500 appearance-none text-gray-900 cursor-pointer"
                          >
                            <option value="never">بلا تاريخ انتهاء</option>
                            <option value="30_days">30 يوماً</option>
                            <option value="60_days">60 يوماً</option>
                            <option value="1_year">سنة كاملة</option>
                          </select>
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600 bg-blue-50 p-1.5 rounded-lg">
                            <Calendar size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Visibility Settings Card (Matching Images 2, 3, and 5) */}
                <div className="bg-white rounded-3xl p-6 lg:p-7 border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Eye size={20} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">
                      اعدادات الظهور
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Published Card */}
                    <div
                      onClick={() =>
                        setFormData({ ...formData, visibility: 'published' })
                      }
                      className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center text-center space-y-2 transition-all ${
                        formData.visibility === 'published'
                          ? 'border-blue-600 bg-white text-blue-600 shadow-sm'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <Share2 size={24} />
                      <span className="text-sm font-black">منشور</span>
                    </div>

                    {/* Draft Card */}
                    <div
                      onClick={() =>
                        setFormData({ ...formData, visibility: 'draft' })
                      }
                      className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center text-center space-y-2 transition-all ${
                        formData.visibility === 'draft'
                          ? 'border-blue-600 bg-white text-blue-600 shadow-sm'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <FileText size={24} />
                      <span className="text-sm font-black">مسودة</span>
                    </div>

                    {/* Hidden Card */}
                    <div
                      onClick={() =>
                        setFormData({ ...formData, visibility: 'hidden' })
                      }
                      className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center text-center space-y-2 transition-all ${
                        formData.visibility === 'hidden'
                          ? 'border-blue-600 bg-white text-blue-600 shadow-sm'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <EyeOff size={24} />
                      <span className="text-sm font-black">خفي</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer (Left Side Blue Button) */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200/60">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-6 py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-black text-sm transition-all"
              >
                السابق
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-200 transition-all"
              >
                التالي
              </button>
            ) : (
              <button
                type="submit"
                className="px-12 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]"
              >
                انشر
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
