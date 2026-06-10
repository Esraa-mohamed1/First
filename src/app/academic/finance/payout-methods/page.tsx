'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Wallet,
  Zap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Smartphone,
  Landmark,
  Building2,
  ChevronLeft,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const PayoutMethodsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [selectedCountry, setSelectedCountry] = useState<'sa' | 'eg' | null>('eg');

  // Fawry State
  const [fawryOpen, setFawryOpen] = useState(true);
  const [fawryStatus, setFawryStatus] = useState<'idle' | 'error' | 'success'>('error');
  const [fawryMenuOpen, setFawryMenuOpen] = useState(false);

  // Paymob State
  const [paymobOpen, setPaymobOpen] = useState(false);

  const methods = [
    {
      id: 'darb-payout',
      title: 'استلام الاموال عن طريق درب',
      description: 'استلم أرباحك بالطريقة اللي تناسبك، بسهولة وأمان مع تجربة دفع مرنة وسريعة عبر درب',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800',
      features: [
        { icon: Landmark, title: 'مرونة في التحويل', desc: 'تابع عمليات الدفع والتحويل بسهولة من مكان واحد' },
        { icon: Zap, title: 'سرعة في الدفع', desc: 'استلم أرباحك بسرعة وبأعلى درجات الأمان' },
        { icon: ShieldCheck, title: 'أمان موثوق', desc: 'نحمي معاملاتك بأعلى معايير الأمان' }
      ],
      buttonText: 'تفعيل الآن',
      onClick: () => { }
    },
    {
      id: 'direct-payout',
      title: 'استلام الاموال مباشرة',
      description: 'استلم أموالك مباشرة وبكل سهولة، بدون انتظار وبتجربة سريعة وآمنة.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
      features: [
        { icon: Building2, title: 'من مكان واحد', desc: 'تابع عمليات الدفع والتحويل بسهولة من مكان واحد' },
        { icon: CheckCircle2, title: 'سريعة وآمنة', desc: 'استلم أرباحك بسرعة وبأعلى درجات الأمان' },
        { icon: Clock, title: 'أمان موثوق', desc: 'نحمي معاملاتك بأعلى معايير الأمان' }
      ],
      buttonText: 'اتصل',
      onClick: () => {
        setModalStep(1);
        setIsModalOpen(true);
      }
    }
  ];

  return (
    <div className="space-y-10 pb-12 relative" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">اختر طريقة لاستلام الاموال</h1>
      </div>

      {/* Methods Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {methods.map((method, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
          >
            {/* Image Header */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={method.image}
                alt={method.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <div className="absolute bottom-6 right-8 left-8">
                <h3 className="text-2xl font-black text-gray-900 leading-tight">
                  {method.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col">
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                {method.description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {method.features.map((feature, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900">{feature.title}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 leading-tight">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={method.onClick}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] mt-auto"
              >
                {method.buttonText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Help Section */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="bg-gray-50 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
              <Info size={24} />
            </div>
            <div>
              <h4 className="text-lg font-black text-gray-900">تحتاج مساعدة في اختيار الطريقة؟</h4>
              <p className="text-gray-500 text-sm font-medium mt-1">فريق الدعم الفني جاهز للإجابة على جميع استفساراتك</p>
            </div>
          </div>
          <button className="px-8 py-4 bg-white text-gray-900 font-black rounded-xl border border-gray-200 hover:bg-gray-100 transition-all shadow-sm flex items-center gap-2">
            <span>تواصل معنا</span>
            <ExternalLink size={18} />
          </button>
        </div>
      </div>

      {/* Connection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[24px] w-full max-w-xl relative z-10 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
            >
              {modalStep === 1 ? (
                <>
                  <div className="p-6 flex items-center justify-between border-b border-gray-100">
                    <h3 className="text-lg font-black text-gray-900">اختار الدولة</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                      <ChevronLeft size={24} />
                    </button>
                  </div>
                  <div className="p-12 flex items-center justify-center gap-12 flex-1">
                    <button
                      onClick={() => setSelectedCountry('sa')}
                      className="flex flex-col items-center gap-4 group"
                    >
                      <div className={twMerge("w-32 h-32 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all", selectedCountry === 'sa' ? "border-blue-600 shadow-lg shadow-blue-100" : "border-gray-200 group-hover:border-blue-300")}>
                        <img src="https://flagcdn.com/w160/sa.png" alt="Saudi Arabia" className="w-16 object-cover" />
                      </div>
                      <span className={twMerge("font-bold text-lg", selectedCountry === 'sa' ? "text-blue-600" : "text-gray-600")}>السعودية</span>
                    </button>

                    <button
                      onClick={() => setSelectedCountry('eg')}
                      className="flex flex-col items-center gap-4 group"
                    >
                      <div className={twMerge("w-32 h-32 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all", selectedCountry === 'eg' ? "border-blue-600 shadow-lg shadow-blue-100" : "border-gray-200 group-hover:border-blue-300")}>
                        <img src="https://flagcdn.com/w160/eg.png" alt="Egypt" className="w-16 object-cover border border-gray-100 shadow-sm" />
                      </div>
                      <span className={twMerge("font-bold text-lg", selectedCountry === 'eg' ? "text-blue-600" : "text-gray-600")}>مصر</span>
                    </button>
                  </div>
                  <div className="p-6 pt-0 mt-auto">
                    <button
                      onClick={() => setModalStep(2)}
                      className="w-32 bg-black text-white py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
                    >
                      التالي
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-6 flex items-center justify-between border-b border-gray-100">
                    <div />
                    <button onClick={() => setModalStep(1)} className="p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                      <ChevronLeft size={24} />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-4">
                    {/* Fawry Accordion */}
                    <div className={twMerge("border rounded-[16px] transition-all", fawryOpen ? "border-blue-200 shadow-sm" : "border-gray-200")}>
                      <div className="p-4 flex items-center gap-4 relative">
                        <div className="w-14 h-8 bg-yellow-400 rounded flex items-center justify-center text-blue-900 font-black text-xs">
                          فوري
                        </div>
                        <span className="font-black text-sm text-gray-900 flex-1">استلم عن طريق فوري</span>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">مفعل</span>

                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFawryMenuOpen(!fawryMenuOpen);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <MoreVertical size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {fawryMenuOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-20"
                                >
                                  <button className="w-full text-right px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">تعديل البيانات</button>
                                  <button className="w-full text-right px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">ايقاف مؤقت</button>
                                  <button className="w-full text-right px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50">حذف الحساب</button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <button onClick={() => setFawryOpen(!fawryOpen)} className="p-1 text-gray-400 hover:bg-gray-50 rounded-lg">
                            {fawryOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>
                      </div>

                      {fawryOpen && (
                        <div className="p-5 pt-2 border-t border-gray-50 space-y-5">
                          <div className="flex gap-4">
                            <div className="space-y-1.5 flex-1">
                              <label className="block text-xs font-bold text-gray-700">ID</label>
                              <input type="text" defaultValue="12-00215" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-left font-semibold text-gray-600" dir="ltr" />
                            </div>
                            <div className="space-y-1.5 flex-1">
                              <label className="block text-xs font-bold text-gray-700">رقم الهاتف</label>
                              <input type="text" defaultValue="+20" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-left font-semibold text-gray-600" dir="ltr" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-700">API Key</label>
                            <input type="text" defaultValue="" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-left font-semibold text-gray-600" dir="ltr" />
                          </div>

                          <div className="pt-2 flex flex-col items-center">
                            <div className="w-full flex items-center justify-start mb-4">
                              <button
                                onClick={() => setFawryStatus(fawryStatus === 'error' ? 'success' : 'error')}
                                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-2.5 rounded-lg font-black text-sm transition-colors"
                              >
                                اختبار التوصيل
                              </button>
                            </div>

                            {fawryStatus === 'error' && (
                              <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-xs mt-2 w-full max-w-[280px] mx-auto">
                                <span>فشل في الاتصال , قم بمراجعة بيانات الرابط</span>
                                <AlertCircle size={14} />
                              </div>
                            )}

                            {fawryStatus === 'success' && (
                              <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xs mt-2">
                                <span>تم الربط بنجاح</span>
                                <CheckCircle2 size={14} />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Paymob Accordion */}
                    <div className={twMerge("border rounded-[16px] transition-all", paymobOpen ? "border-blue-200 shadow-sm" : "border-gray-200")}>
                      <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setPaymobOpen(!paymobOpen)}>
                        <div className="w-14 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-[10px]">
                          PayMob
                        </div>
                        <span className="font-black text-sm text-gray-900 flex-1">PayMob</span>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">غير مفعل</span>

                          <button className="p-1 text-gray-400 hover:bg-gray-50 rounded-lg">
                            {paymobOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>
                      </div>

                      {paymobOpen && (
                        <div className="p-5 pt-2 border-t border-gray-50">
                          <p className="text-gray-500 text-sm font-semibold">إعدادات PayMob هنا...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-36 bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg"
                    >
                      حفظ و تفعيل
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PayoutMethodsPage;
