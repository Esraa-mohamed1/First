'use client';

import React, { useState, useEffect } from 'react';
import { ImagePlus, ChevronDown, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getProfileStatus, updateDetailedProfile } from '@/services/auth';
import { uploadFile } from '@/services/upload';
import { toast } from 'react-hot-toast';

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

  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfileStatus();
        const userData = response.data || response;
        if (userData) {
          setFormData({
            academyName: userData.academy_name || userData.name || '',
            shortDescription: userData.short_description || userData.bio_paragraph_1 || '',
            phone: userData.phone || '',
            email: userData.email || '',
            country: userData.country || '',
            field: userData.field || '',
            address: userData.address || ''
          });
          if (userData.logo || userData.logo_url || userData.avatar_url) {
            setLogoPreview(userData.logo || userData.logo_url || userData.avatar_url);
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        toast.error('فشل تحميل بيانات الأكاديمية');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalLogoUrl = logoPreview;
      if (logoFile) {
        // Upload file to Bunny Storage
        const uploadedUrl = await uploadFile(logoFile);
        if (uploadedUrl) {
          finalLogoUrl = uploadedUrl;
        }
      }

      // Prepare payload matching detailed profile schema
      const payload = {
        role: 'academy',
        name: formData.academyName,
        bio_paragraph_1: formData.shortDescription,
        avatar_url: finalLogoUrl,
      };

      const res = await updateDetailedProfile(payload);
      if (res && (res.status === false || res.success === false)) {
        throw new Error(res.message || 'حدث خطأ أثناء حفظ الملف الشخصي.');
      }

      // Update local caching
      const cached = localStorage.getItem('user_info');
      if (cached) {
        try {
          const u = JSON.parse(cached);
          localStorage.setItem('user_info', JSON.stringify({
            ...u,
            name: formData.academyName,
            academy_name: formData.academyName,
            logo: finalLogoUrl,
            logo_url: finalLogoUrl,
            avatar_url: finalLogoUrl,
            short_description: formData.shortDescription,
            phone: formData.phone,
            email: formData.email,
            address: formData.address
          }));
        } catch (e) {}
      }

      // Update navbar/footer global cache
      localStorage.setItem('darab_academy_profile', JSON.stringify({
        name: formData.academyName,
        logo: finalLogoUrl
      }));

      toast.success(res?.message || 'تم تحديث بيانات الأكاديمية بنجاح!');
    } catch (err: any) {
      console.error('Failed to update academy settings:', err);
      toast.error(err?.message || 'فشل تحديث البيانات، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/academic/settings" 
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-all shadow-sm"
          >
            <ChevronLeft size={24} className="rotate-180" />
          </Link>
          <h2 className="text-2xl font-black text-gray-900">بيانات الاكاديمية</h2>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
          
          {/* Logo Upload Section */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">لوجو الاكاديمية</label>
            <div className="border-2 border-dashed border-gray-200 rounded-3xl h-[280px] bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-all relative overflow-hidden">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              {logoPreview ? (
                <img src={logoPreview} alt="Academy Logo" className="w-full h-full object-contain p-4" />
              ) : (
                <>
                  <ImagePlus size={40} className="text-gray-400 mb-4" />
                  <div className="text-center">
                    <p className="font-bold text-gray-700 mb-1">اضف اللوجو الخاص بك</p>
                    <p className="text-sm font-medium text-gray-400">ابعاد اللوجو : 1270*820</p>
                  </div>
                </>
              )}
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
                className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300 text-gray-900"
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
                className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none placeholder:text-gray-300 text-gray-900"
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
                className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300 text-gray-900"
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
                className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300 text-gray-900"
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
                    className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-900 cursor-pointer transition-all"
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
                    className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-900 cursor-pointer transition-all"
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
                className="w-full p-4 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300 text-gray-900"
              />
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <span>حفظ التغييرات</span>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
