'use client';

import { useState, useEffect } from 'react';
import { Loader2, Globe, Check, X, AlertCircle, ShieldCheck, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import academyApi from '@/lib/academy-api';
import Swal from 'sweetalert2';
import { triggerPageLoader } from '@/components/PageLoader';

interface CustomDomain {
  domain: string;
  status: 'active' | 'pending' | 'failed' | 'unverified';
}

export default function CustomDomainPage() {
  const [customDomain, setCustomDomain] = useState<CustomDomain | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Read domain name from window location instead of API GET
    if (typeof window !== 'undefined') {
      let hostname = window.location.hostname;
      
      // Clean up localhost for display/editing if needed
      if (hostname === 'localhost') {
        const storedTenant = localStorage.getItem('academy_link_name');
        if (storedTenant) hostname = `${storedTenant}.darab.academy`;
      }

      setEditValue(hostname);
      setCustomDomain({
        domain: hostname,
        status: 'active'
      });
      setIsLoading(false);
    }
  }, []);

  const handleUpdate = async () => {
    if (!editValue.trim()) return;

    const result = await Swal.fire({
      title: 'تنبيه: تغيير الدومين',
      text: 'تغيير الدومين سيؤدي إلى تسجيل خروجك وتحديث بيانات الدخول. هل أنت متأكد من الاستمرار؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، قم بالتغيير',
      cancelButtonText: 'إلغاء',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold px-8 py-3',
        cancelButton: 'rounded-xl font-bold px-8 py-3'
      }
    });

    if (!result.isConfirmed) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const response = await academyApi.put('custom-domain', {
        domain: editValue.trim()
      });
      
      if (response.data.success) {
        toast.success('تم تحديث الدومين بنجاح. سيتم توجيهك الآن.');
        
        // Update local storage
        if (typeof window !== 'undefined') {
          localStorage.setItem('academy_link_name', editValue.trim());
          
          triggerPageLoader(true);

          // Construct new URL
          const protocol = window.location.protocol;
          const isLocal = window.location.hostname.includes('localhost');
          const port = window.location.port ? `:${window.location.port}` : '';
          
          let newUrl = '';
          if (isLocal) {
            // If on localhost, we likely use subdomains like je.darab.academy.localhost:3000
            // We need to keep the structure
            const baseParts = window.location.hostname.split('.');
            // Assume the structure is [tenant].darab.academy.localhost
            // We replace [tenant] with the new one
            newUrl = `${protocol}//${editValue.trim()}${port}/academic`;
          } else {
            newUrl = `${protocol}//${editValue.trim()}/academic`;
          }

          // Clear auth data and redirect
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user_info');
            document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
            window.location.href = newUrl;
          }, 1500);
        }

        setCustomDomain(response.data.data || { domain: editValue.trim(), status: 'pending' });
        setIsEditing(false);
      } else {
        if (response.data.errors) {
          setErrors(response.data.errors);
        }
        toast.error(response.data.message || 'فشل في تحديث الدومين');
      }
    } catch (error: any) {
      console.error('Error updating custom domain:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء معالجة طلبك');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    const result = await Swal.fire({
      title: 'حذف الدومين المخصص',
      text: 'هل أنت متأكد من حذف الدومين المخصص؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، حذف',
      cancelButtonText: 'إلغاء',
      customClass: {
        popup: 'rounded-[2rem]',
      }
    });

    if (!result.isConfirmed) return;
    
    try {
      setIsSubmitting(true);
      const response = await academyApi.delete('custom-domain');
      if (response.data.success) {
        toast.success('تم حذف الدومين بنجاح');
        setCustomDomain(null);
        if (typeof window !== 'undefined') {
            setEditValue(window.location.hostname);
        }
      }
    } catch (error: any) {
      toast.error('فشل في حذف الدومين');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold italic">جاري تحميل إعدادات الدومين...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">إدارة الدومين</h2>
          <p className="text-gray-400 font-bold mt-2">يمكنك تعديل أو حذف الدومين المخصص لأكاديميتك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Main Configuration Card */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
                <Globe size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">النطاق الحالي</h3>
                <p className="text-gray-400 font-bold text-sm">نظرة عامة على حالة نطاق الأكاديمية</p>
              </div>
            </div>
            {customDomain && (
               <div className={`px-6 py-2.5 rounded-2xl text-xs font-black shadow-sm ${
                customDomain.status === 'active' ? 'bg-green-50 text-green-600' : 
                customDomain.status === 'pending' ? 'bg-orange-50 text-orange-600 animate-pulse' : 'bg-red-50 text-red-600'
              }`}>
                {customDomain.status === 'active' ? 'نشط' : 
                 customDomain.status === 'pending' ? 'جاري التحقق...' : 'فشل التحقق'}
              </div>
            )}
          </div>

          <div className="p-10 space-y-8">
            {isEditing ? (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="space-y-3">
                  <label className="text-lg font-black text-gray-800">تعديل اسم النطاق</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="example.com"
                      className={`w-full p-5 bg-gray-50 border ${errors.domain ? 'border-red-300' : 'border-gray-100'} rounded-[2rem] outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-left font-bold text-lg`}
                      dir="ltr"
                      autoFocus
                    />
                    {errors.domain && (
                      <p className="text-red-500 text-sm font-bold mt-2 pr-4 flex items-center gap-2">
                        <AlertCircle size={16} />
                        {errors.domain[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    onClick={handleUpdate} 
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={24} strokeWidth={3} />}
                    <span>تحديث النطاق</span>
                  </button>
                  <button 
                    onClick={() => { setIsEditing(false); setErrors({}); setEditValue(customDomain?.domain || ''); }} 
                    disabled={isSubmitting}
                    className="px-10 py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black text-lg hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center text-blue-600">
                    <Globe size={28} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-gray-900" dir="ltr">{customDomain?.domain || editValue}</h4>
                    <p className="text-gray-400 font-bold text-sm mt-1">
                      {customDomain?.status === 'active' ? 'النطاق الموصول حالياً' : 'النطاق قيد المراجعة أو افتراضي'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setIsEditing(true); setEditValue(customDomain?.domain || editValue); }}
                    className="p-4 bg-white text-gray-400 hover:text-blue-600 rounded-2xl border border-gray-100 shadow-sm transition-all"
                    title="تعديل"
                  >
                    <Edit2 size={22} />
                  </button>
                  {customDomain && (
                    <button 
                      onClick={handleRemove}
                      disabled={isSubmitting}
                      className="p-4 bg-white text-gray-400 hover:text-red-600 rounded-2xl border border-gray-100 shadow-sm transition-all"
                      title="حذف"
                    >
                      <Trash2 size={22} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DNS Info card remains for context */}
        <div className="bg-blue-50/30 border border-blue-100 rounded-[2.5rem] p-10 space-y-6">
          <div className="flex items-center gap-4 text-blue-600">
            <ShieldCheck size={28} />
            <h4 className="text-xl font-black">تعليمات الربط</h4>
          </div>
          <p className="text-gray-600 font-bold leading-relaxed">
            لربط دومين مخصص، يرجى التأكد من إضافة السجل التالي في لوحة تحكم النطاق الخاصة بك:
          </p>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 text-left font-mono text-sm" dir="ltr">
            <div className="flex-1">
              <span className="text-xs text-gray-400 block mb-1">TYPE</span>
              <span className="font-black text-blue-600">CNAME</span>
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-400 block mb-1">HOST</span>
              <span className="font-black text-gray-800">@</span>
            </div>
            <div className="flex-[2]">
              <span className="text-xs text-gray-400 block mb-1">VALUE</span>
              <span className="font-black text-gray-800">domains.darab.academy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}