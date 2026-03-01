'use client';

import Link from 'next/link';
import { ArrowRight, Check, Save, X } from 'lucide-react';

export default function CreatePackagePage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/dashboard/packages" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ArrowRight size={24} className="text-gray-500" />
            </Link>
            <h2 className="text-2xl font-black text-gray-900">إضافة / تعديل باقة</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                    <h3 className="text-lg font-black text-gray-900">البيانات الأساسية</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">اسم الباقة</label>
                        <input type="text" placeholder="ادخل اسم الباقة" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">وصف الباقة</label>
                        <textarea rows={4} placeholder="ادخل وصف قصير للباقة" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none"></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">السعر</label>
                            <input type="number" placeholder="ادخل سعر الباقة" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">مدة الاشتراك</label>
                            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium appearance-none">
                                <option>ادخل مدة الاشتراك</option>
                                <option>3 شهور</option>
                                <option>6 شهور</option>
                                <option>سنة</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="font-bold text-blue-900">حالة الباقة</h4>
                            <p className="text-xs text-blue-600 font-medium">اجعل هذه الباقة مرئية للمشتركين الجدد</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-14 h-7 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Usage Limits */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                    <h3 className="text-lg font-black text-gray-900">حدود الأستخدام</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500">الحد الاقصي للدورات</label>
                        <input type="number" defaultValue={50} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500">الحد الاقصي للمدربين</label>
                        <input type="number" defaultValue={25} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500">الحد الاقصي للطلاب النشطين</label>
                        <input type="number" defaultValue={125} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500">الحد الاقصي لساعات الفيديو</label>
                        <input type="number" defaultValue={3} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500">عدد الدومينات المخصصة</label>
                        <input type="number" defaultValue={35} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all" />
                    </div>
                </div>
            </div>

             {/* Features */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                    <h3 className="text-lg font-black text-gray-900">مميزات الباقة</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        'تفعيل الدومين الخاص', 'تفعيل اللايف', 'تفعيل الايف', 
                        'تفعيل الشهادات', 'تفعيل الكويزات', 'تفعيل ال Page Builder',
                        'تفعيل الرسائل الجماعة', 'تفعيل Bundles', 'تفعيل التقارير المتقدمة',
                        'تفعيل API'
                    ].map((feature, idx) => (
                        <label key={idx} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${idx < 7 ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 hover:border-blue-200'}`}>
                            <span className="font-bold text-sm text-gray-700">{feature}</span>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${idx < 7 ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                                {idx < 7 && <Check size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" defaultChecked={idx < 7} />
                        </label>
                    ))}
                </div>
            </div>

            {/* Additional Options */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                    <h3 className="text-lg font-black text-gray-900">خيارات اضافية</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500">عدد أيام التجربة المجانية</label>
                        <input type="number" defaultValue={7} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500">ترتيب الباقة</label>
                        <input type="number" defaultValue={2} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold outline-none focus:border-blue-500 transition-all" />
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between">
                    <div className="space-y-1">
                        <h4 className="font-bold text-blue-900">تمييز الباقة بأفضل اختيار</h4>
                        <p className="text-xs text-blue-600 font-medium">تعيين الباقة كأكثر انتشارا</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-14 h-7 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

        </div>

        {/* Sidebar / Actions */}
        <div className="lg:col-span-1 space-y-6">
             {/* Preview Card or Summary could go here */}
        </div>
      </div>

       {/* Footer Actions */}
       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 lg:pr-72">
            <div className="max-w-[1600px] mx-auto flex justify-end gap-4">
                <button className="px-8 py-3 bg-gray-200 text-gray-600 font-black rounded-xl hover:bg-gray-300 transition-colors">
                    إلغاء
                </button>
                <button className="px-12 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95">
                    حفظ
                </button>
            </div>
       </div>
    </div>
  );
}
