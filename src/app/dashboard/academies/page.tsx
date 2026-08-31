'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Mail,
  Phone,
  Package as PackageIcon,
  Globe,
  Building2,
  X,
  Lock,
  User,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';
import { getAcademies, createAcademy, updateAcademy, deleteAcademy } from '@/services/academies';
import { getPackages } from '@/services/packages';
import { Academy, Package, CreateAcademyPayload, UpdateAcademyPayload } from '@/types/api';
import toast from 'react-hot-toast';

export default function AcademiesPage() {
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState<Academy | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateAcademyPayload>({
    academy_name: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    link_academy: '',
    package_id: '',
    country_code: 'SA',
    is_active: 1
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [academiesData, packagesData] = await Promise.all([
        getAcademies(),
        getPackages()
      ]);
      setAcademies(academiesData);
      setPackages(packagesData);
    } catch (error) {
      console.error('Failed to load academies data:', error);
      toast.error('فشل في تحميل بيانات الأكاديميات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (academy?: Academy) => {
    if (academy) {
      setEditingAcademy(academy);
      setFormData({
        academy_name: academy.academy_name || academy.name || '',
        name: academy.name || academy.owner?.name || '',
        email: academy.email || academy.owner?.email || '',
        phone: academy.phone || academy.phone_academy || '',
        password: '',
        link_academy: academy.link_academy || academy.subdomain || academy.domain || '',
        package_id: academy.package_id || academy.package?.id || '',
        country_code: academy.country_code || 'SA',
        is_active: academy.is_active === 1 || academy.is_active === true ? 1 : 0
      });
    } else {
      setEditingAcademy(null);
      setFormData({
        academy_name: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        link_academy: '',
        package_id: packages.length > 0 ? packages[0].id : '',
        country_code: 'SA',
        is_active: 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAcademy(null);
  };

  const handleInputChange = (field: keyof CreateAcademyPayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAcademy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.academy_name.trim()) {
      toast.error('يرجى إدخال اسم الأكاديمية');
      return;
    }

    if (!editingAcademy && !formData.email.trim()) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (!editingAcademy && !formData.password?.trim()) {
      toast.error('يرجى إدخال كلمة المرور للأكاديمية الجديدة');
      return;
    }

    setIsSaving(true);
    try {
      if (editingAcademy) {
        const payload: Partial<UpdateAcademyPayload> = {
          academy_name: formData.academy_name,
          name: formData.name || formData.academy_name,
          phone: formData.phone || '',
          country_code: formData.country_code,
          is_active: formData.is_active
        };

        if (formData.package_id) {
          payload.package_id = Number(formData.package_id);
        }

        if (formData.password?.trim()) {
          payload.password = formData.password.trim();
        }

        const response = await updateAcademy(editingAcademy.id, payload);
        if (response.status || response.success) {
          toast.success('تم تحديث بيانات الأكاديمية بنجاح');
          handleCloseModal();
          const refreshed = await getAcademies();
          setAcademies(refreshed);
        } else {
          toast.error(response.message || 'فشل في تحديث الأكاديمية');
        }
      } else {
        const payload: CreateAcademyPayload = {
          academy_name: formData.academy_name,
          name: formData.name || formData.academy_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          link_academy: formData.link_academy,
          country_code: formData.country_code,
          is_active: formData.is_active
        };

        if (formData.package_id) {
          payload.package_id = Number(formData.package_id);
        }

        const response = await createAcademy(payload);
        if (response.status || response.success) {
          toast.success('تم إضافة الأكاديمية بنجاح');
          handleCloseModal();
          const refreshed = await getAcademies();
          setAcademies(refreshed);
        } else {
          toast.error(response.message || 'فشل في إضافة الأكاديمية');
        }
      }
    } catch (error: any) {
      console.error('Failed to save academy:', error);
      toast.error(error.message || 'حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAcademy = async (id: number, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف أكاديمية "${name}"؟`)) return;

    try {
      const response = await deleteAcademy(id);
      if (response.status || response.success) {
        toast.success('تم حذف الأكاديمية بنجاح');
        setAcademies(prev => prev.filter(a => a.id !== id));
      } else {
        toast.error(response.message || 'فشل في حذف الأكاديمية');
      }
    } catch (error: any) {
      console.error('Failed to delete academy:', error);
      toast.error(error.message || 'حدث خطأ أثناء حذف الأكاديمية');
    }
  };

  const handleToggleStatus = async (academy: Academy) => {
    const isCurrentlyActive = academy.is_active === 1 || academy.is_active === true;
    const newStatus = !isCurrentlyActive;

    try {
      const response = await updateAcademy(academy.id, {
        is_active: newStatus
      } as any);

      if (response.status || response.success) {
        toast.success(newStatus ? 'تم تفعيل الأكاديمية' : 'تم تعطيل الأكاديمية');
        setAcademies(prev => prev.map(a => a.id === academy.id ? { ...a, is_active: newStatus ? 1 : 0 } : a));
      } else {
        toast.error(response.message || 'فشل في تحديث حالة الأكاديمية');
      }
    } catch (error: any) {
      console.error('Failed to toggle status:', error);
      toast.error(error.message || 'حدث خطأ أثناء تحديث الحالة');
    }
  };

  const filteredAcademies = academies.filter(academy => {
    const nameMatch = (academy.academy_name || academy.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (academy.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = (academy.phone || academy.phone_academy || '').toLowerCase().includes(searchTerm.toLowerCase());
    const linkMatch = (academy.link_academy || academy.subdomain || academy.domain || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSearch = nameMatch || emailMatch || phoneMatch || linkMatch;

    if (!matchesSearch) return false;

    const isActive = academy.is_active === 1 || academy.is_active === true;
    if (statusFilter === 'active') return isActive;
    if (statusFilter === 'inactive') return !isActive;
    return true;
  });

  const totalCount = academies.length;
  const activeCount = academies.filter(a => a.is_active === 1 || a.is_active === true).length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-right">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-end gap-3">
            <span>إدارة الأكاديميات</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
          </h2>
          <p className="text-sm font-bold text-gray-500 mt-1">عرض وإدارة الأكاديميات المسجلة، التحكم في بياناتها وحالتها التشغيلية</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 active:scale-95 text-sm"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>إضافة أكاديمية جديدة</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-gray-400">إجمالي الأكاديميات</p>
            <h3 className="text-2xl font-black text-gray-900">{totalCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 size={24} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-gray-400">الأكاديميات المفعلة</p>
            <h3 className="text-2xl font-black text-green-600">{activeCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-xs font-bold text-gray-400">الأكاديميات المعطلة</p>
            <h3 className="text-2xl font-black text-gray-400">{inactiveCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/60 w-full md:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex-1 md:flex-initial ${
                statusFilter === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              الكل ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex-1 md:flex-initial ${
                statusFilter === 'active'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              مفعلة ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex-1 md:flex-initial ${
                statusFilter === 'inactive'
                  ? 'bg-white text-gray-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              معطلة ({inactiveCount})
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث باسم الأكاديمية أو البريد أو الرابط..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl pr-11 pl-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-right placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="p-6 md:p-8 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={44} className="text-blue-600 animate-spin" />
              <p className="text-gray-500 font-bold">جاري تحميل الأكاديميات...</p>
            </div>
          ) : filteredAcademies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                <GraduationCap size={32} />
              </div>
              <p className="text-gray-600 font-black text-lg">لا توجد أكاديميات مطابقة للبحث</p>
              <button
                onClick={() => handleOpenModal()}
                className="text-blue-600 font-bold hover:underline text-sm"
              >
                أضف أكاديمية جديدة الآن
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50/60 border-b border-gray-100 text-gray-400 text-xs font-black uppercase tracking-wider">
                    <th className="px-6 py-4 rounded-r-2xl">الأكاديمية</th>
                    <th className="px-6 py-4">بيانات التواصل</th>
                    <th className="px-6 py-4">الرابط / النطاق</th>
                    <th className="px-6 py-4">الباقة</th>
                    <th className="px-6 py-4 text-center">الحالة</th>
                    <th className="px-6 py-4 text-left rounded-l-2xl">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAcademies.map((academy) => {
                    const isActive = academy.is_active === 1 || academy.is_active === true;
                    const academyName = academy.academy_name || academy.name || 'بدون اسم';
                    const linkUrl = academy.link_academy || academy.subdomain || academy.domain;
                    const packageName = academy.package?.titile || academy.package?.title || (academy.package_id ? `باقة #${academy.package_id}` : 'غير محدد');

                    return (
                      <tr key={academy.id} className="hover:bg-blue-50/30 transition-colors group">
                        {/* Academy Name & Avatar */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm shadow-blue-200">
                              {academyName.charAt(0) || 'أ'}
                            </div>
                            <div className="text-right">
                              <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                {academyName}
                              </h4>
                              {academy.name && academy.name !== academyName && (
                                <p className="text-xs text-gray-400 font-bold mt-0.5">
                                  المسؤول: {academy.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="space-y-1 text-right">
                            {academy.email && (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700" dir="ltr">
                                <span>{academy.email}</span>
                                <Mail size={13} className="text-gray-400" />
                              </div>
                            )}
                            {(academy.phone || academy.phone_academy) && (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500" dir="ltr">
                                <span>{academy.phone || academy.phone_academy}</span>
                                <Phone size={13} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Domain / Link */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          {linkUrl ? (
                            <a
                              href={linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 hover:border-blue-300 transition-all"
                              dir="ltr"
                            >
                              <ExternalLink size={12} />
                              <span className="truncate max-w-[180px]">{linkUrl}</span>
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400 font-bold">غير محدد</span>
                          )}
                        </td>

                        {/* Package Badge */}
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-xl text-xs font-black">
                            <PackageIcon size={13} />
                            <span>{packageName}</span>
                          </span>
                        </td>

                        {/* Status & Toggle */}
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleStatus(academy)}
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                            }`}
                            title={isActive ? 'انقر للتعطيل' : 'انقر للتفعيل'}
                          >
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                            <span>{isActive ? 'مفعلة' : 'معطلة'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5 whitespace-nowrap text-left">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(academy)}
                              className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all active:scale-95 cursor-pointer"
                              title="تعديل بيانات الأكاديمية"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAcademy(academy.id, academyName)}
                              className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all active:scale-95 cursor-pointer"
                              title="حذف الأكاديمية"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] p-6 md:p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
              <div className="text-right">
                <h3 className="text-xl font-black text-gray-900">
                  {editingAcademy ? 'تعديل بيانات الأكاديمية' : 'إضافة أكاديمية جديدة'}
                </h3>
                <p className="text-xs font-bold text-gray-400 mt-1">يرجى تعبئة الحقول المطلوبة لحفظ بيانات الأكاديمية</p>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAcademy} className="space-y-6 pt-6 text-right">
              {/* Row 1: Academy Name & Owner Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700">اسم الأكاديمية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أكاديمية النخبة للتدريب"
                    value={formData.academy_name}
                    onChange={(e) => handleInputChange('academy_name', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-right font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700">اسم المسؤول / المالك</label>
                  <input
                    type="text"
                    placeholder="مثال: د. محمد أحمد"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-right font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700">
                    البريد الإلكتروني {!editingAcademy && '*'}
                    {editingAcademy && <span className="text-gray-400 font-normal mr-1">(للقراءة فقط)</span>}
                  </label>
                  <input
                    type="email"
                    required={!editingAcademy}
                    readOnly={!!editingAcademy}
                    disabled={!!editingAcademy}
                    placeholder="admin@academy.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full border rounded-xl p-3.5 text-right font-bold outline-none text-sm ${
                      editingAcademy
                        ? 'bg-gray-100/80 border-gray-200 text-gray-500 cursor-not-allowed select-none'
                        : 'bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-all'
                    }`}
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700">
                    رقم الهاتف <span className="text-gray-400 font-normal">(اختياري)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="0501234567"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-right font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Row 3: Subdomain / Link & Country Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700">
                    رابط / نطاق المنصة
                    {editingAcademy && <span className="text-gray-400 font-normal mr-1">(للقراءة فقط)</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="elite-academy.darab.academy"
                    value={formData.link_academy || ''}
                    onChange={(e) => handleInputChange('link_academy', e.target.value)}
                    readOnly={!!editingAcademy}
                    disabled={!!editingAcademy}
                    className={`w-full border rounded-xl p-3.5 text-right font-bold outline-none text-sm ${
                      editingAcademy
                        ? 'bg-gray-100/80 border-gray-200 text-gray-500 cursor-not-allowed select-none'
                        : 'bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white transition-all'
                    }`}
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700">كود الدولة</label>
                  <select
                    value={formData.country_code || 'SA'}
                    onChange={(e) => handleInputChange('country_code', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-right font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-sm cursor-pointer"
                  >
                    <option value="SA">المملكة العربية السعودية (SA)</option>
                    <option value="EG">جمهورية مصر العربية (EG)</option>
                    <option value="AE">الإمارات العربية المتحدة (AE)</option>
                    <option value="KW">الكويت (KW)</option>
                    <option value="QA">قطر (QA)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Package & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700">الباقة المشتركة</label>
                  <select
                    value={formData.package_id || ''}
                    onChange={(e) => handleInputChange('package_id', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-right font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-sm cursor-pointer"
                  >
                    <option value="">بدون باقة محددة</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.titile} - {pkg.price} ر.س ({pkg.duration_months || 12} شهر)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-700">
                    {editingAcademy ? 'كلمة المرور (اتركها فارغة إذا لم ترغب بالتغيير)' : 'كلمة المرور *'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-right font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Active Switch */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">حالة تفعيل الأكاديمية</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">تفعيل أو إيقاف إمكانية وصول الأكاديمية للمنصة</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.is_active === 1 || formData.is_active === true}
                    onChange={(e) => handleInputChange('is_active', e.target.checked ? 1 : 0)}
                  />
                  <div className="w-[52px] h-[26px] bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all after:shadow-sm peer-checked:after:translate-x-[26px]"></div>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-70 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>{editingAcademy ? 'حفظ التعديلات' : 'إضافة الأكاديمية'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-8 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
