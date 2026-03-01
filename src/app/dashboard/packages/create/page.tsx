'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Loader2, Plus, Save, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { createPackage, getFeatures, createFeature, getPackageById, updatePackage, associateFeatures } from '@/services/packages';
import { CreatePackagePayload, Feature, Package } from '@/types/api';
import toast from 'react-hot-toast';

function CreatePackageForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const packageId = searchParams.get('id');
    const isEditMode = !!packageId;

    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(isEditMode);
    const [isAddingFeature, setIsAddingFeature] = useState(false);
    const [newFeatureTitle, setNewFeatureTitle] = useState('');
    const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);

    // Features with values local state
    const [selectedFeatures, setSelectedFeatures] = useState<{ id: number, title: string, value: string }[]>([]);

    // Form State
    const [formData, setFormData] = useState<CreatePackagePayload>({
        titile: '',
        description: '',
        price: '',
        duration_months: 12,
        is_active: 1,
        max_students: 125,
        max_instructors: 25,
        max_courses: 50,
        custom_domains: 35,
        video_hours: 3,
        features: [],
        trial_days: 7,
        order: 2,
        is_popular: true,
    });

    useEffect(() => {
        fetchFeatures();
        if (isEditMode) {
            fetchPackageDetails(parseInt(packageId!));
        }
    }, [packageId]);

    const fetchPackageDetails = async (id: number) => {
        setIsInitialLoading(true);
        try {
            const pkg = await getPackageById(id);
            if (pkg) {
                setFormData({
                    titile: pkg.titile,
                    description: pkg.description,
                    price: pkg.price.toString(),
                    duration_months: pkg.duration_months,
                    is_active: pkg.is_active,
                    max_students: pkg.max_students,
                    max_instructors: pkg.max_instructors,
                    max_courses: pkg.max_courses,
                    custom_domains: pkg.custom_domains,
                    video_hours: pkg.video_hours,
                    features: pkg.features || [],
                    trial_days: pkg.trial_days || 7,
                    order: pkg.order || 0,
                    is_popular: pkg.is_popular || false,
                });

                // Note: If the backend already returns features with values in the package response,
                // we should map them here. Assuming for now they might not be fully structured.
                // If pkg.features is just string[], we can't easily get IDs/values without more info.
            } else {
                toast.error('لم يتم العثور على الباقة');
                router.push('/dashboard/packages');
            }
        } catch (error) {
            toast.error('فشل في تحميل تفاصيل الباقة');
        } finally {
            setIsInitialLoading(false);
        }
    };

    const fetchFeatures = async () => {
        try {
            const data = await getFeatures();
            setAvailableFeatures(data);
        } catch (error) {
            console.error('Failed to load features');
        }
    };

    const handleInputChange = (field: keyof CreatePackagePayload, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleFeature = (feature: Feature) => {
        setSelectedFeatures(prev => {
            const exists = prev.find(f => f.id === feature.id);
            if (exists) {
                return prev.filter(f => f.id !== feature.id);
            } else {
                return [...prev, { id: feature.id, title: feature.title, value: '' }];
            }
        });
    };

    const handleFeatureValueChange = (id: number, value: string) => {
        setSelectedFeatures(prev =>
            prev.map(f => f.id === id ? { ...f, value } : f)
        );
    };

    const handleAddFeature = async () => {
        if (!newFeatureTitle.trim()) return;

        setIsLoading(true);
        try {
            const response = await createFeature(newFeatureTitle);
            if (response.status) {
                toast.success('تم إضافة الميزة بنجاح');
                setNewFeatureTitle('');
                setIsAddingFeature(false);
                fetchFeatures();
            } else {
                toast.error(response.message || 'حدث خطأ أثناء إضافة الميزة');
            }
        } catch (error: any) {
            toast.error(error.message || 'حدث خطأ أثناء الاتصال بالخادم');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.titile || !formData.price || !formData.description) {
            toast.error('يرجى ملء جميع الحقول الأساسية');
            return;
        }

        setIsLoading(true);
        try {
            let response;
            let createdPackageId: number;

            if (isEditMode) {
                createdPackageId = parseInt(packageId!);
                response = await updatePackage(createdPackageId, formData);
            } else {
                response = await createPackage(formData);
                //@ts-ignore - assuming response.data has the id for the new package
                createdPackageId = response.data?.id;
            }

            if (response.status && createdPackageId) {
                // Step 2: Associate features individually to match backend validation
                if (selectedFeatures.length > 0) {
                    try {
                        const associationPromises = selectedFeatures.map(f =>
                            associateFeatures({
                                package_id: createdPackageId,
                                feature_id: f.id,
                                value: f.value || '',
                                lable: f.title // Backend expects 'lable' instead of 'label' or 'title'
                            })
                        );
                        await Promise.all(associationPromises);
                    } catch (error) {
                        console.error('Failed to associate some features:', error);
                        toast.error('تم حفظ الباقة، ولكن فشل ربط بعض المميزات');
                    }
                }

                toast.success(isEditMode ? 'تم تحديث الباقة بنجاح' : 'تم حفظ الباقة بنجاح');
                router.push('/dashboard/packages');
            } else {
                toast.error(response.message || 'حدث خطأ أثناء حفظ الباقة');
            }
        } catch (error: any) {
            toast.error(error.message || 'حدث خطأ أثناء الاتصال بالخادم');
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 size={40} className="text-blue-600 animate-spin" />
                <p className="text-gray-500 font-bold">جاري تحميل البيانات...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/packages" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <ArrowRight size={24} className="text-gray-500" />
                    </Link>
                    <h2 className="text-2xl font-black text-gray-900">{isEditMode ? 'تعديل الباقة' : 'إضافة باقة جديدة'}</h2>
                </div>
            </div>

            <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center justify-end">
                        <h3 className="text-xl font-bold text-gray-400">البيانات الأساسية</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2 text-right">
                            <label className="block text-sm font-bold text-gray-700">اسم الباقة</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ادخل اسم الباقة"
                                    value={formData.titile}
                                    onChange={(e) => handleInputChange('titile', e.target.value)}
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-right outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-right">
                            <label className="block text-sm font-bold text-gray-700">وصف الباقة</label>
                            <textarea
                                rows={4}
                                placeholder="ادخل وصف قصير للباقة"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-right outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 text-right">
                                <label className="block text-sm font-bold text-gray-700">مدة الاشتراك (بالشهور)</label>
                                <div className="relative">
                                    <select
                                        value={formData.duration_months}
                                        onChange={(e) => handleInputChange('duration_months', parseInt(e.target.value))}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-right outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium appearance-none"
                                    >
                                        <option value={1}>شهر واحد</option>
                                        <option value={3}>3 شهور</option>
                                        <option value={6}>6 شهور</option>
                                        <option value={12}>سنة (12 شهر)</option>
                                        <option value={24}>سنتين (24 شهر)</option>
                                    </select>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 text-right">
                                <label className="block text-sm font-bold text-gray-700">السعر</label>
                                <input
                                    type="number"
                                    placeholder="ادخل سعر الباقة"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-right outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="bg-[#eff6ff] p-5 rounded-2xl flex items-center justify-between border border-blue-100/50">
                            <div className="text-left">
                                <h4 className="font-bold text-right text-gray-900 text-sm">حالة الباقة</h4>
                                <p className="text-xs text-gray-500 font-medium mt-1">اجعل هذه الباقة مرئية للمشتركين الجدد</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.is_active === 1}
                                    onChange={(e) => handleInputChange('is_active', e.target.checked ? 1 : 0)}
                                />
                                <div className="w-[52px] h-[26px] bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all after:shadow-sm peer-checked:after:translate-x-[26px]"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Usage Limits */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
                    <div className="space-y-2 text-right">
                        <h2 className="block text-lg  text-gray-700">حدود الاستخدام</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2 text-right">
                                <label className="block text-sm  text-gray-700">الحد الاقصي للطلاب النشطين</label>
                                <input
                                    type="number"
                                    value={formData.max_students}
                                    onChange={(e) => handleInputChange('max_students', parseInt(e.target.value))}
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2 text-right">
                                <label className="block text-sm  text-gray-700">الحد الاقصي للمدربين</label>
                                <input
                                    type="number"
                                    value={formData.max_instructors}
                                    onChange={(e) => handleInputChange('max_instructors', parseInt(e.target.value))}
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2 text-right">
                                <label className="block text-sm  text-gray-700">الحد الاقصي للدورات</label>
                                <input
                                    type="number"
                                    value={formData.max_courses}
                                    onChange={(e) => handleInputChange('max_courses', parseInt(e.target.value))}
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 text-right">
                                <label className="block text-sm text-gray-700">عدد الدومينات المخصصة</label>
                                <input
                                    type="number"
                                    value={formData.custom_domains}
                                    onChange={(e) => handleInputChange('custom_domains', parseInt(e.target.value))}
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2 text-right">
                                <label className="block text-sm  text-gray-700">الحد الاقصي لساعات الفيديو</label>
                                <input
                                    type="number"
                                    value={formData.video_hours}
                                    onChange={(e) => handleInputChange('video_hours', parseInt(e.target.value))}
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsAddingFeature(true)}
                            className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
                        >
                            <Plus size={20} />
                            إضافة ميزة جديدة
                        </button>
                        <h2 className="block text-lg text-gray-700">مميزات الباقة</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableFeatures.map((feature, idx) => {
                            const selectedFeature = selectedFeatures.find(f => f.id === feature.id);
                            const isChecked = !!selectedFeature;
                            return (
                                <div key={feature.id || idx} className={twMerge(
                                    "p-6 rounded-[24px] border transition-all duration-300",
                                    isChecked ? "border-blue-500 bg-blue-50/30 shadow-sm" : "border-gray-100 bg-white hover:border-blue-200"
                                )}>
                                    <label className="flex items-center justify-between cursor-pointer mb-4">
                                        <div className={twMerge(
                                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                            isChecked ? "bg-blue-600 border-blue-600" : "border-gray-200"
                                        )}>
                                            {isChecked && <Check size={16} className="text-white" strokeWidth={3} />}
                                        </div>
                                        <span className="font-black text-gray-900">{feature.title}</span>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={isChecked}
                                            onChange={() => toggleFeature(feature)}
                                        />
                                    </label>

                                    {isChecked && (
                                        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                                            <label className="block text-[10px] font-black text-blue-600 uppercase mb-2 mr-1">feature value</label>
                                            <input
                                                type="text"
                                                placeholder="مثال: غير محدود"
                                                value={selectedFeature.value}
                                                onChange={(e) => handleFeatureValueChange(feature.id, e.target.value)}
                                                className="w-full bg-white border border-blue-100 rounded-xl px-4 py-3 text-right text-sm font-bold outline-none focus:border-blue-500 transition-all placeholder:text-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>


                    {/* Additional Options */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                            <h3 className="text-lg font-black text-gray-900">خيارات اضافية</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500">عدد أيام التجربة المجانية</label>
                                <input
                                    type="number"
                                    value={formData.trial_days}
                                    onChange={(e) => handleInputChange('trial_days', parseInt(e.target.value))}
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500">ترتيب الباقة</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="font-bold text-blue-900">تمييز الباقة بأفضل اختيار</h4>
                                <p className="text-xs text-blue-600 font-medium">تعيين الباقة كأكثر انتشارا</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.is_popular}
                                    onChange={(e) => handleInputChange('is_popular', e.target.checked)}
                                />
                                <div className="w-14 h-7 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 lg:pr-72">
                <div className="max-w-[1600px] mx-auto flex justify-end gap-4">
                    <Link href="/dashboard/packages" className="px-8 py-3 bg-gray-200 text-gray-600 font-black rounded-xl hover:bg-gray-300 transition-colors">
                        إلغاء
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-12 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading && <Loader2 className="animate-spin" size={20} />}
                        {isEditMode ? 'تحديث' : 'حفظ'}
                    </button>
                </div>
            </div>

            {/* Add Feature Modal */}
            {isAddingFeature && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingFeature(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-6 text-right">إضافة ميزة جديدة</h3>
                        <div className="space-y-4">
                            <div className="space-y-2 text-right">
                                <label className="block text-sm font-bold text-gray-700">عنوان الميزة</label>
                                <input
                                    type="text"
                                    placeholder="مثال: تفعيل الدومين الخاص"
                                    value={newFeatureTitle}
                                    onChange={(e) => setNewFeatureTitle(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-right outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setIsAddingFeature(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleAddFeature}
                                    disabled={isLoading || !newFeatureTitle.trim()}
                                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    إضافة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CreatePackagePage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>}>
            <CreatePackageForm />
        </Suspense>
    );
}
