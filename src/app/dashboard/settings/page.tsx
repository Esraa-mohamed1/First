'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Lock,
  ChevronLeft,
  Pencil,
  Loader2,
  Mail,
  Phone,
  Shield,
  Bell,
  CheckCircle2,
  Building2,
  SlidersHorizontal,
  KeyRound
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SuperAdminSettingsPage() {
  const router = useRouter();

  // Admin Profile State
  const [adminName, setAdminName] = useState('مدير النظام الرئيسي');
  const [adminEmail, setAdminEmail] = useState('admin@darab.academy');
  const [adminPhone, setAdminPhone] = useState('+966 50 000 0000');
  const [isSaving, setIsSaving] = useState(false);

  // Platform Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newAcademyAlerts, setNewAcademyAlerts] = useState(true);
  const [subscriptionAlerts, setSubscriptionAlerts] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedName = localStorage.getItem('user_name');
        if (storedName) setAdminName(storedName);

        const userInfoStr = localStorage.getItem('user_info');
        if (userInfoStr) {
          const parsed = JSON.parse(userInfoStr);
          if (parsed?.name) setAdminName(parsed.name);
          if (parsed?.email) setAdminEmail(parsed.email);
          if (parsed?.phone) setAdminPhone(parsed.phone);
        }
      } catch (e) {
        // Fallback to default values
      }
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate save delay for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (typeof window !== 'undefined') {
        localStorage.setItem('user_name', adminName);
        const userInfoStr = localStorage.getItem('user_info');
        if (userInfoStr) {
          try {
            const parsed = JSON.parse(userInfoStr);
            localStorage.setItem(
              'user_info',
              JSON.stringify({
                ...parsed,
                name: adminName,
                email: adminEmail,
                phone: adminPhone,
              })
            );
          } catch (err) {
            // ignore
          }
        }
      }

      toast.success('تم حفظ الإعدادات بنجاح!', {
        style: {
          fontFamily: 'IBM Plex Sans Arabic, sans-serif',
          fontWeight: 'bold',
          direction: 'rtl',
        },
      });
    } catch (err) {
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12" dir="rtl">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-l from-blue-600 to-[#0f62fe] rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl shadow-blue-500/15">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto text-center md:text-right">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-white/10 border-4 border-white/20 backdrop-blur-md overflow-hidden shadow-inner flex items-center justify-center text-white">
              <Shield size={44} className="text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 bg-emerald-400 text-white p-2 rounded-xl border-2 border-white shadow-sm flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>

          <div className="text-white space-y-1">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{adminName}</h1>
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
        {/* Right Column (2 Cols) - Personal Info & Platform Preferences */}
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
                <h2 className="text-xl font-black text-gray-900">البيانات الشخصية للمشرف</h2>
                <p className="text-gray-400 font-bold text-xs mt-0.5">
                  تحديث بيانات الحساب الرئيسي لمدير النظام
                </p>
              </div>
            </div>

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

              {/* Phone */}
              <div className="space-y-2 text-right md:col-span-2">
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
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                {isSaving && <Loader2 size={18} className="animate-spin" />}
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </form>

          {/* System Notifications Preferences */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 text-orange-600 p-3 rounded-2xl">
                <Bell size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">تفضيلات التنبيهات الإدارية</h2>
                <p className="text-gray-400 font-bold text-xs mt-0.5">
                  إدارة إشعارات النظام وعمليات التسجيل الجديدة
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                <div className="text-right">
                  <h4 className="text-sm font-black text-gray-800">تنبيهات البريد الإلكتروني</h4>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    استلام تقارير دورية وإشعارات الأمان عبر البريد
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                <div className="text-right">
                  <h4 className="text-sm font-black text-gray-800">إشعارات تسجيل أكاديمية جديدة</h4>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    تنبيه فوري عند تسجيل حساب أكاديمية جديد في المنصة
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={newAcademyAlerts}
                  onChange={(e) => setNewAcademyAlerts(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                <div className="text-right">
                  <h4 className="text-sm font-black text-gray-800">إشعارات طلبات الاشتراكات المعلقة</h4>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    تنبيه عند وجود إيصالات دفع تتطلب موافقة السوبر أدمن
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={subscriptionAlerts}
                  onChange={(e) => setSubscriptionAlerts(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
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
                <h2 className="text-xl font-black text-gray-900">الأمان والحماية</h2>
                <p className="text-gray-400 font-bold text-xs mt-0.5">
                  إدارة حماية الحساب وكلمات المرور
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
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
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100/80 text-right space-y-1">
              <div className="flex items-center gap-2 text-blue-700 font-black text-xs">
                <Shield size={14} />
                <span>مستوى الحماية: عالي</span>
              </div>
              <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
                حساب السوبر أدمن محمي بصلاحيات الإدارة المركزية الكاملة على جميع الأكاديميات والباقات.
              </p>
            </div>
          </div>

          {/* Quick System Links */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-900 pr-1">إجراءات سريعة</h3>
            
            <button
              onClick={() => router.push('/dashboard/academies/subscriptions')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl transition-all text-right group"
            >
              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                مراجعة الاشتراكات المعلقة
              </span>
              <ChevronLeft size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>

            <button
              onClick={() => router.push('/dashboard/packages')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl transition-all text-right group"
            >
              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                إدارة خطط وباقات المنصة
              </span>
              <ChevronLeft size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
