'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Edit,
    Loader2,
    Settings2,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { getFeatures, updateFeature } from '@/services/admin-packages';
import { Feature } from '@/types/api';
import toast from 'react-hot-toast';

export default function FeaturesPage() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
    const [newFeatureLabel, setNewFeatureLabel] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        setIsLoading(true);
        try {
            const data = await getFeatures();
            setFeatures(data);
        } catch (error) {
            toast.error('فشل في تحميل المميزات');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (feature: Feature) => {
        setCurrentFeature(feature);
        setNewFeatureLabel(feature.lable || feature.label || '');
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!currentFeature) return;
        if (!newFeatureLabel.trim()) {
            toast.error('يرجى إدخال اسم الميزة المعروض');
            return;
        }

        setIsSaving(true);
        try {
            const response = await updateFeature(currentFeature.id, newFeatureLabel.trim());

            if (response.status || response.success) {
                toast.success('تم تحديث الميزة بنجاح');
                setIsModalOpen(false);
                fetchFeatures();
            } else {
                toast.error(response.message || 'حدث خطأ أثناء الحفظ');
            }
        } catch (error: any) {
            toast.error(error.message || 'حدث خطأ أثناء الاتصال بالخادم');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredFeatures = features.filter(f => {
        const term = searchTerm.toLowerCase();
        const titleMatch = (f.title || '').toLowerCase().includes(term);
        const keyMatch = (f.key || f.key_feature || '').toLowerCase().includes(term);
        const labelMatch = (f.lable || f.label || '').toLowerCase().includes(term);
        return titleMatch || keyMatch || labelMatch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1 text-right">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">إدارة المميزات</h1>
                    <p className="text-gray-500 font-bold flex items-center justify-end gap-2 text-sm">
                        تحكم في قائمة المميزات المتاحة للباقات المختلفة
                        <Settings2 size={16} className="text-blue-500" />
                    </p>
                </div>
            </div>

            {/* Stats/Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 font-bold text-xs">إجمالي المميزات</p>
                        <h3 className="text-2xl font-black text-gray-900">{features.length}</h3>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[35px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                {/* Search & Tabs */}
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="ابحث عن ميزة مخصصة..."
                            className="w-full bg-gray-50/80 border border-transparent focus:border-blue-500/30 focus:bg-white rounded-2xl py-4 pr-12 pl-6 text-right font-bold transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
                            {filteredFeatures.length} نتيجة بحث
                        </span>
                    </div>
                </div>

                {/* Features Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="animate-spin text-blue-600" size={48} />
                            <p className="text-gray-400 font-black animate-pulse">جاري تحميل البيانات...</p>
                        </div>
                    ) : filteredFeatures.length > 0 ? (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-wider">عنوان الميزة (Title)</th>
                                    {/* <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-wider">المفتاح البرمجي (Key)</th> */}
                                    <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-wider">الاسم المعروض (Label)</th>
                                    <th className="px-8 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-wider">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredFeatures.map((feature) => (
                                    <tr key={feature.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap font-bold text-gray-900 text-right">
                                            <div className="flex items-center">
                                                {feature.title || '—'}
                                            </div>
                                        </td>
                                        {/* <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <span className="font-mono text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg" dir="ltr">
                                                {feature.key || feature.key_feature || '—'}
                                            </span>
                                        </td> */}
                                        <td className="px-8 py-6 whitespace-nowrap font-bold text-blue-600 text-right">
                                            <div className="flex items-center">
                                                {feature.lable || feature.label || '—'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => handleOpenModal(feature)}
                                                    className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-600 transition-all active:scale-90"
                                                    title="تعديل اسم الميزة"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                            <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-6">
                                <Search size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">لا توجد مميزات</h3>
                            <p className="text-gray-400 font-bold max-w-sm">
                                {searchTerm ? 'لم نتمكن من العثور على أي نتائج لبحثك' : 'لا توجد أي مميزات متاحة حالياً'}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-6 text-blue-600 font-black hover:underline"
                                >
                                    مسح البحث
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Integration */}
            {isModalOpen && currentFeature && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[40px] p-8 md:p-12 shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 border border-gray-100">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-8 left-8 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                        >
                            <XCircle size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-blue-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                                <Edit size={32} className="text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">تعديل الميزة</h3>
                            <p className="text-gray-400 font-bold mt-2 text-sm">يمكنك تعديل الاسم المعروض للميزة فقط</p>
                        </div>

                        <div className="space-y-5">
                            {/* Title (Read-only) */}
                            <div className="space-y-1.5 text-right">
                                <label className="block text-xs font-black text-gray-500 px-1">عنوان الميزة (Title) - للقراءة فقط</label>
                                <input
                                    type="text"
                                    value={currentFeature.title || ''}
                                    disabled
                                    readOnly
                                    className="w-full bg-gray-100 border border-gray-200/80 rounded-2xl p-4 text-right font-bold text-gray-500 cursor-not-allowed select-none"
                                />
                            </div>

                            {/* Key (Read-only) - Hidden */}
                            {/* <div className="space-y-1.5 text-right">
                                <label className="block text-xs font-black text-gray-500 px-1">المفتاح البرمجي (Key) - للقراءة فقط</label>
                                <input
                                    type="text"
                                    value={currentFeature.key || currentFeature.key_feature || '—'}
                                    disabled
                                    readOnly
                                    dir="ltr"
                                    className="w-full bg-gray-100 border border-gray-200/80 rounded-2xl p-4 text-left font-mono font-bold text-gray-500 cursor-not-allowed select-none"
                                />
                            </div> */}

                            {/* Label (Editable) */}
                            <div className="space-y-1.5 text-right">
                                <label className="block text-sm font-black text-gray-900 px-1">الاسم المعروض (Label)</label>
                                <input
                                    type="text"
                                    placeholder="مثال: مساحة التخزين بالجيجا"
                                    value={newFeatureLabel}
                                    onChange={(e) => setNewFeatureLabel(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-2xl p-4 text-right outline-none transition-all font-bold placeholder:text-gray-300"
                                    autoFocus
                                />
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !newFeatureLabel.trim()}
                                    className="w-full py-4 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving && <Loader2 className="animate-spin" size={20} />}
                                    <span>تحديث الميزة</span>
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full py-4 bg-gray-100 text-gray-600 font-black rounded-3xl hover:bg-gray-200 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
