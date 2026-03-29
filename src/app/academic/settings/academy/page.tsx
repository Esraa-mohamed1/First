'use client';

import React, { useState } from 'react';
import { ImagePlus, ChevronDown } from 'lucide-react';

export default function AcademyDataPage() {
  const [formData, setFormData] = useState({
    academyName: '',
    shortDescription: '',
    phone: '',
    email: '',
    country: '',
    field: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle logo upload
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save changes
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-900">بيانات الاكاديمية</h2>
      </div>

      <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
          
          {/* Logo Upload Section - Left Side on LRT, Right Side on RTL (But flex-row in RTL means visual right to left) */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">لوجو الاكاديمية</label>
            <div className="border-2 border-dashed border-gray-200 rounded-3xl h-[280px] bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-all relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <ImagePlus size={40} className="text-gray-400 mb-4" />
              <div className="text-center">
                <p className="font-bold text-gray-700 mb-1">اضف اللوجو الخاص بك</p>
                <p className="text-sm font-medium text-gray-400">ابعاد اللوجو : 1270*820</p>
              </div>
            </div>
          </div>

          {/* Form Fields Section - Right Side on LRT, Left Side on RTL */}
          <div className="w-full lg:w-2/3 space-y-6 order-2 lg:order-1">
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">اسم الاكاديمية</label>
              <input
                type="text"
                name="academyName"
                value={formData.academyName}
                onChange={handleChange}
                placeholder="ادخل اسم الاكاديمية"
                className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">وصف مختصر</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="ادخل وصف مختصر"
                rows={5}
                className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">رقم الهاتف الرسمي</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="ادخل رقم الهاتف"
                className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">البريد الالكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ادخل البريد الالكتروني"
                className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label className="block text-sm font-bold text-gray-700">الدولة</label>
                <div className="relative">
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-500 cursor-pointer transition-all"
                  >
                    <option value="">الدولة</option>
                    <option value="saudi">السعودية</option>
                    <option value="egypt">مصر</option>
                    <option value="uae">الإمارات</option>
                  </select>
                  <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="block text-sm font-bold text-gray-700">المجال</label>
                <div className="relative">
                  <select 
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-500 cursor-pointer transition-all"
                  >
                    <option value="">المجال</option>
                    <option value="educational">تعليمي</option>
                    <option value="training">تدريبي</option>
                    <option value="consulting">استشاري</option>
                  </select>
                  <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">عنوان الاكاديمية (اختياري)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="ادخل عنوان الاكاديمية"
                className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                className="w-full md:w-auto px-12 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 text-lg"
              >
                حفظ التغييرات
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
