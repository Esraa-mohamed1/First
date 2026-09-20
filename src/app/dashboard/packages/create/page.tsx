'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Loader2, Plus, Save, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { createPackage, getFeatures, createFeature, getPackageById, updatePackage, associateFeatures } from '@/services/admin-packages';
import { CreatePackagePayload, Feature, Package } from '@/types/api';
import toast from 'react-hot-toast';

function CreatePackageForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const packageId = searchParams.get('id');
    const isEditMode = !!packageId;

    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(isEditMode);
    const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);

    // Features state: selected feature IDs and custom numeric values
    const [selectedFeatureIds, setSelectedFeatureIds] = useState<number[]>([]);
    const [featureValues, setFeatureValues] = useState<Record<number, string>>({});

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

    const parseDurationMonths = (val: any): number => {
        if (typeof val === 'number' && !isNaN(val)) return val;
        if (typeof val === 'string') {
            if (val.includes(':')) {
                const num = parseInt(val.split(':')[0], 10);
                return isNaN(num) || num <= 0 ? 12 : num;
            }
            const num = parseInt(val, 10);
            return isNaN(num) || num <= 0 ? 12 : num;
        }
        return 12;
    };

    const fetchPackageDetails = async (id: number) => {
        setIsInitialLoading(true);
        try {
            const pkg = await getPackageById(id);
            if (pkg) {
                const parsedDuration = parseDurationMonths(pkg.duration_months ?? (pkg as any).duration);
                const fetchedFeatures = pkg.package_features || pkg.packageFeatures || pkg.features || [];

                const isBestChoice =
                    pkg.recomnd === 1 ||
                    (pkg.recomnd as any) === true ||
                    String(pkg.recomnd) === '1' ||
                    pkg.is_popular === true;

                setFormData({
                    titile: pkg.titile || '',
                    description: pkg.desc || pkg.description || '',
                    price: pkg.price?.toString() || '',
                    duration_months: parsedDuration,
                    is_active: pkg.is_active ?? 1,
                    max_students: pkg.max_students ?? 100,
                    max_instructors: pkg.max_instructors ?? 10,
                    max_courses: pkg.max_courses ?? 20,
                    custom_domains: pkg.custom_domains ?? 1,
                    video_hours: pkg.video_hours ?? 10,
                    features: [],
                    trial_days: pkg.trial_days ?? 7,
                    order: pkg.order ?? 1,
                    is_popular: isBestChoice,
                });

                const initialSelectedIds: number[] = [];
                const initialValues: Record<number, string> = {};

                fetchedFeatures.forEach((f: any) => {
                    const featId = f.feature_id || f.feature?.id || f.featureId || f.id;
                    const rawVal = f.value;
                    const strVal = rawVal !== null && rawVal !== undefined ? String(rawVal).trim() : '';

                    if (strVal !== '0' && strVal.toLowerCase() !== 'false') {
                        const numId = Number(featId);
                        initialSelectedIds.push(numId);
                        if (strVal !== '' && strVal !== '1') {
                            initialValues[numId] = strVal;
                        }
                    }
                });

                setSelectedFeatureIds(initialSelectedIds);
                setFeatureValues(initialValues);
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

    const toggleFeature = (featureId: number) => {
        setSelectedFeatureIds(prev => {
            if (prev.includes(featureId)) {
                return prev.filter(id => id !== featureId);
            } else {
                return [...prev, featureId];
            }
        });
    };

    const handleFeatureValueChange = (featureId: number, value: string) => {
        setFeatureValues(prev => ({
            ...prev,
            [featureId]: value
        }));
    };

    const isCoursesFeature = (f: Feature) => {
        const key = (f.key || f.key_feature || '').toLowerCase();
        const title = (f.title || '').toLowerCase();
        const label = (f.lable || f.label || '').toLowerCase();
        return (
            key === 'count_courses' ||
            key === 'max_courses' ||
            key === 'count_course' ||
            key === 'courses_limit' ||
            title.includes('course') ||
            label.includes('دورات')
        );
    };

    const isStorageFeature = (f: Feature) => {
        const key = (f.key || f.key_feature || '').toLowerCase();
        const title = (f.title || '').toLowerCase();
        const label = (f.lable || f.label || '').toLowerCase();
        return (
            key === 'storage_space' ||
            key === 'storage_limit' ||
            key === 'storage' ||
            title.includes('storage') ||
            label.includes('مساحة') ||
            label.includes('تخزين')
        );
    };

    const handleSave = async () => {
        if (!formData.titile || !formData.price || !formData.description) {
            toast.error('يرجى ملء جميع الحقول الأساسية');
            return;
        }

        // Validate mandatory features (Count Courses and Storage Space)
        for (const feature of availableFeatures) {
            const isCourses = isCoursesFeature(feature);
            const isStorage = isStorageFeature(feature);

            if (isCourses || isStorage) {
                const isSelected = selectedFeatureIds.includes(feature.id);
                const val = featureValues[feature.id]?.trim() || '';
                const num = Number(val);
                const featureName = feature.lable || feature.label || (isCourses ? 'عدد الدورات' : 'مساحة التخزين');

                if (!isSelected) {
                    toast.error(`الميزة "${featureName}" إلزامية، يرجى تفعيلها وتحديد قيمة أكبر من 1`);
                    return;
                }

                if (!val || isNaN(num) || num <= 1) {
                    toast.error(`يرجى إدخال قيمة رقمية صحيحة أكبر من 1 لميزة "${featureName}"`);
                    return;
                }
            } else if (selectedFeatureIds.includes(feature.id)) {
                // Validate other selected features if a custom numeric value is entered
                const val = featureValues[feature.id]?.trim() || '';
                if (val !== '') {
                    const num = Number(val);
                    if (isNaN(num) || num < 1) {
                        const featureName = feature.lable || feature.label || feature.title;
                        toast.error(`القيمة المدخلة لميزة "${featureName}" يجب أن تكون رقماً صحيحاً (1 أو أكبر من 1) أو اترك الحقل فارغاً`);
                        return;
                    }
                }
            }
        }

        setIsLoading(true);
        try {
            const { description, ...restFormData } = formData;

            // Construct payload with ALL available features:
            // 1. Unchecked feature: value: "0"
            // 2. Checked feature + no value entered: value: "1"
            // 3. Checked feature + user enters 1: value: "1"
            // 4. Checked feature + user enters a value greater than 1: value: String(number)
            const payloadFeatures = availableFeatures.map(f => {
                const isChecked = selectedFeatureIds.includes(f.id);
                const customVal = featureValues[f.id]?.trim();

                let finalValue = "0";
                if (!isChecked) {
                    finalValue = "0";
                } else if (!customVal || customVal === '' || customVal === '1') {
                    finalValue = "1";
                } else {
                    finalValue = String(customVal);
                }

                return {
                    feature_id: f.id,
                    label: f.label || f.lable || f.title,
                    lable: f.lable || f.label || f.title,
                    title: f.title,
                    value: finalValue
                };
            });

            const payload = {
                ...restFormData,
                recomnd: formData.is_popular ? 1 : 0,
                is_popular: formData.is_popular,
                desc: description || '',
                duration_months: Number(formData.duration_months) || 12,
                features: payloadFeatures
            };

            let response;
            if (isEditMode) {
                const targetId = parseInt(packageId!);
                response = await updatePackage(targetId, payload as any);
            } else {
                response = await createPackage(payload as any);
            }

            if (response.status) {
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
                                    value={formData.titile || ''}
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
                                value={formData.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-right outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 text-right">
                                <label className="block text-sm font-bold text-gray-700">مدة الاشتراك (بالشهور)</label>
                                <div className="relative">
                                    <select
                                        value={formData.duration_months || 12}
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
                                    value={formData.price ?? ''}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-right outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage Limits */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
                    <div className="space-y-2 text-right">
                        <h2 className="block text-lg text-gray-700">حدود الاستخدام</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 text-right">
                            <label className="block text-sm text-gray-700">الحد الاقصي للمدربين</label>
                            <input
                                type="number"
                                value={formData.max_instructors ?? ''}
                                onChange={(e) => handleInputChange('max_instructors', e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2 text-right">
                            <label className="block text-sm text-gray-700">الحد الاقصي لساعات الفيديو</label>
                            <input
                                type="number"
                                value={formData.video_hours ?? ''}
                                onChange={(e) => handleInputChange('video_hours', e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center justify-end">
                        <h2 className="block text-lg text-gray-700">مميزات الباقة</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableFeatures.map((feature, idx) => {
                            const isChecked = selectedFeatureIds.includes(feature.id);
                            const displayName = feature.lable || feature.label || feature.title;
                            const isMandatory = isCoursesFeature(feature) || isStorageFeature(feature);

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
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-gray-900">{displayName}</span>
                                            {isMandatory && (
                                                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                                                    إلزامي
                                                </span>
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={isChecked}
                                            onChange={() => toggleFeature(feature.id)}
                                        />
                                    </label>

                                    {isChecked && (
                                        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                                            <label className="block text-[10px] font-black text-blue-600 uppercase mb-2 mr-1">
                                                القيمة الرقمية (اختياري، أكبر من 1)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="يجب أن تكون القيمة أكبر من 1"
                                                value={featureValues[feature.id] || ''}
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

                        <div className="space-y-6">
                            <div className="space-y-2 text-right">
                                <label className="block text-xs font-bold text-gray-500">ترتيب الباقة</label>
                                <input
                                    type="number"
                                    value={formData.order ?? ''}
                                    onChange={(e) => handleInputChange('order', e.target.value ? parseInt(e.target.value) : '')}
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all"
                                />
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
                                        checked={formData.is_popular || false}
                                        onChange={(e) => handleInputChange('is_popular', e.target.checked)}
                                    />
                                    <div className="w-14 h-7 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
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
