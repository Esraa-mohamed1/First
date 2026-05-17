'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  ChevronDown
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const PayoutMethodsPage = () => {
  const [activeStep, setActiveStep] = useState(1);

  const methods = [
    {
      id: 'darb-payout',
      title: 'استلام مدفوعات دوراتك عن طريق درب',
      description: 'استلم أرباحك بالطريقة اللي تناسبك، بسهولة وأمان مع تجربة دفع مرنة وسريعة عبر درب',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800',
      features: [
        { icon: Landmark, title: 'مرونة في التحويل', desc: 'تابع عمليات الدفع والتحويل بسهولة من مكان واحد' },
        { icon: Zap, title: 'سرعة في الدفع', desc: 'استلم أرباحك بسرعة وبأعلى درجات الأمان' },
        { icon: ShieldCheck, title: 'أمان موثوق', desc: 'نحمي معاملاتك بأعلى معايير الأمان' }
      ],
      buttonText: 'تفعيل الآن',
      color: 'blue'
    },
    {
      id: 'direct-payout',
      title: 'استلام فلوسك مباشرة',
      description: 'استلم أموالك مباشرة وبكل سهولة، بدون انتظار وبتجربة سريعة وآمنة.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
      features: [
        { icon: Building2, title: 'من مكان واحد', desc: 'تابع عمليات الدفع والتحويل بسهولة من مكان واحد' },
        { icon: CheckCircle2, title: 'سريعة وآمنة', desc: 'استلم أرباحك بسرعة وبأعلى درجات الأمان' },
        { icon: Clock, title: 'أمان موثوق', desc: 'نحمي معاملاتك بأعلى معايير الأمان' }
      ],
      buttonText: 'تفعيل الآن',
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-10 pb-12" dir="rtl">
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
              <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] mt-auto">
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
    </div>
  );
};

export default PayoutMethodsPage;
