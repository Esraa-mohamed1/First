'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  ShieldCheck,
  ChevronLeft,
  Pencil,
  Loader2,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  SlidersHorizontal,
  KeyRound,
  Camera,
  Upload,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  getSuperAdminProfile,
  updateSuperAdminProfile,
} from '@/services/super-admin-profile';

export default function SuperAdminSettingsPage() {
  const router = useRouter();

  // Admin Profile State
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Image Upload Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCloseImageModal = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsImageModalOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveImage = async () => {
    if (!selectedFile) return;

    try {
      setIsUploadingImage(true);

      const updatedProfile = await updateSuperAdminProfile({
        name: adminName.trim(),
        email: adminEmail.trim(),
        profile_image: selectedFile,
      });

      const newImageUrl = updatedProfile.profile_image || null;
      setProfileImage(newImageUrl);
      if (updatedProfile.name) setAdminName(updatedProfile.name);
      if (updatedProfile.email) setAdminEmail(updatedProfile.email);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('super-admin-profile-updated', {
            detail: updatedProfile,
          })
        );
      }

      toast.success('تم تحديث الصورة الشخصية بنجاح!', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic, sans-serif',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });

      handleCloseImageModal();
    } catch (error) {
      console.error('Failed to update Super Admin profile image:', error);

      toast.error('حدث خطأ أثناء حفظ الصورة الشخصية', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic, sans-serif',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);

        const profile = await getSuperAdminProfile();

        setAdminName(profile.name || '');
        setAdminEmail(profile.email || '');
        setProfileImage(profile.profile_image || null);
      } catch (error) {
        console.error('Failed to load Super Admin profile:', error);

        toast.error('فشل تحميل بيانات الحساب', {
          style: {
            fontFamily: 'IBM Plex Sans Arabic, sans-serif',
            fontWeight: 'bold',
            direction: 'rtl',
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const updatedProfile = await updateSuperAdminProfile({
        name: adminName.trim(),
        email: adminEmail.trim(),
      });

      setAdminName(updatedProfile.name || '');
      setAdminEmail(updatedProfile.email || '');
      setProfileImage(updatedProfile.profile_image || null);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('super-admin-profile-updated', {
            detail: updatedProfile,
          })
        );
      }

      toast.success('تم حفظ الإعدادات بنجاح!', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic, sans-serif',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });
    } catch (error) {
      console.error('Failed to update Super Admin profile:', error);

      toast.error('حدث خطأ أثناء حفظ الإعدادات', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic, sans-serif',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12"
      dir="rtl"
    >
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-l from-blue-600 to-[#0f62fe] rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl shadow-blue-500/15">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto text-center md:text-right">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setIsImageModalOpen(true);
              }}
              title="تغيير الصورة الشخصية"
              className="w-24 h-24 rounded-3xl bg-white/10 border-4 border-white/20 backdrop-blur-md overflow-hidden shadow-inner flex items-center justify-center text-white relative group cursor-pointer transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={adminName || 'Super Admin'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <Shield size={44} className="text-white transition-transform duration-300 group-hover:scale-105" />
              )}

              {/* Hover overlay indicator */}
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                <Camera size={22} className="text-white drop-shadow" />
                <span className="text-[10px] font-black tracking-wide">تغيير</span>
              </div>
            </button>

            <div className="absolute -bottom-2 -left-2 bg-emerald-400 text-white p-2 rounded-xl border-2 border-white shadow-sm flex items-center justify-center pointer-events-none">
              <CheckCircle2 size={16} />
            </div>
          </div>

          <div className="text-white space-y-1">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                {isLoading ? '...' : adminName}
              </h1>

              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                سوبر أدمن
              </span>
            </div>

            <p className="text-blue-100 font-medium text-sm md:text-base">
              لوحة التحكم والإعدادات المركزية لمنصة درب
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-6 md:mt-0 flex items-center gap-3">
          <div className="bg-white/15 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <SlidersHorizontal size={16} />
            <span>نظام الإدارة الشامل</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Right Column (2 Cols) - Personal Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information Form */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                <User size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-gray-900">
                  البيانات الشخصية للمشرف
                </h2>

                <p className="text-gray-400 font-bold text-xs mt-0.5">
                  تحديث بيانات الحساب الرئيسي لمدير النظام
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2
                  size={32}
                  className="animate-spin text-blue-600"
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-gray-700 block pr-1">
                      الاسم الكامل
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full bg-[#EAEFEF] border border-transparent rounded-2xl pl-12 pr-5 py-4 text-gray-800 font-bold focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                        required
                      />

                      <Pencil
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-gray-700 block pr-1">
                      البريد الإلكتروني
                    </label>

                    <div className="relative">
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        dir="ltr"
                        className="w-full bg-[#EAEFEF] border border-transparent rounded-2xl pl-12 pr-5 py-4 text-gray-800 font-bold text-right focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                        required
                      />

                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Phone - Hidden */}
                  {/* <div className="space-y-2 text-right md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 block pr-1">
                      رقم الهاتف
                    </label>

                    <div className="relative">
                      <input
                        type="tel"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        dir="ltr"
                        className="w-full bg-[#EAEFEF] border border-transparent rounded-2xl pl-12 pr-5 py-4 text-gray-800 font-bold text-right focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all outline-none"
                      />

                      <Phone
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div> */}
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {isSaving && (
                      <Loader2 size={18} className="animate-spin" />
                    )}

                    <span>حفظ التغييرات</span>
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Left Column (1 Col) - Security & Protection */}
        <div className="space-y-8">
          {/* Security Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 text-red-500 p-3 rounded-2xl">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-gray-900">
                  الأمان والحماية
                </h2>

                <p className="text-gray-400 font-bold text-xs mt-0.5">
                  إدارة حماية الحساب وكلمات المرور
                </p>
              </div>
            </div>

            {/* Change Password Button - Hidden */}
            {/* <div className="space-y-4 pt-2">
              <button
                type="button"
                onClick={() => router.push('/auth/reset-password')}
                className="w-full flex items-center justify-between p-4 bg-[#EAEFEF] hover:bg-gray-100/90 rounded-2xl border border-gray-100 transition-all group cursor-pointer text-right"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm group-hover:text-blue-600 transition-colors">
                    <KeyRound size={18} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      تغيير كلمة المرور
                    </h3>

                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      تحديث كلمة مرور المشرف
                    </p>
                  </div>
                </div>

                <ChevronLeft
                  size={18}
                  className="text-gray-400 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all"
                />
              </button>
            </div> */}

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100/80 text-right space-y-1">
              <div className="flex items-center gap-2 text-blue-700 font-black text-xs">
                <Shield size={14} />
                <span>مستوى الحماية: عالي</span>
              </div>

              <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
                حساب السوبر أدمن محمي بصلاحيات الإدارة المركزية الكاملة على
                جميع الأكاديميات والباقات.
              </p>
            </div>
          </div>

          {/* Quick System Links */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-900 pr-1">
              إجراءات سريعة
            </h3>

            <button
              type="button"
              onClick={() =>
                router.push('/dashboard/academies/subscriptions')
              }
              className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl transition-all text-right group"
            >
              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                مراجعة الاشتراكات المعلقة
              </span>

              <ChevronLeft
                size={16}
                className="text-gray-400 group-hover:text-blue-600 transition-colors"
              />
            </button>

            <button
              type="button"
              onClick={() => router.push('/dashboard/packages')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl transition-all text-right group"
            >
              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                إدارة خطط وباقات المنصة
              </span>

              <ChevronLeft
                size={16}
                className="text-gray-400 group-hover:text-blue-600 transition-colors"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Image Upload Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6 relative animate-in zoom-in-95 duration-200"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-2xl">
                  <Camera size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    تغيير الصورة الشخصية
                  </h3>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">
                    اختر صورة جديدة لحساب مدير النظام
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseImageModal}
                disabled={isUploadingImage}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Image Preview Box */}
            <div className="flex flex-col items-center justify-center space-y-3 py-2">
              <div className="w-32 h-32 rounded-3xl bg-[#EAEFEF] border-4 border-blue-100 overflow-hidden relative shadow-inner flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profileImage ? (
                  <img
                    src={profileImage}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={52} className="text-gray-400" />
                )}
              </div>

              <span className="text-xs text-gray-500 font-medium">
                {previewUrl
                  ? 'معاينة الصورة الجديدة'
                  : profileImage
                  ? 'الصورة الحالية'
                  : 'لم يتم تعيين صورة بعد'}
              </span>
            </div>

            {/* File Input & Selection Button */}
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-blue-50 hover:bg-blue-100/80 text-blue-600 rounded-2xl font-black text-sm border border-blue-200/60 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Upload size={18} />
                <span>
                  {selectedFile ? 'اختيار صورة أخرى' : 'اختيار صورة من الجهاز'}
                </span>
              </button>

              {selectedFile && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-700 font-bold truncate max-w-[240px]">
                    {selectedFile.name}
                  </span>
                  <span className="text-gray-400 font-medium whitespace-nowrap">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCloseImageModal}
                disabled={isUploadingImage}
                className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleSaveImage}
                disabled={!selectedFile || isUploadingImage}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
              >
                {isUploadingImage && <Loader2 size={16} className="animate-spin" />}
                <span>حفظ الصورة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

