'use client';

import { Check } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

const Pricing = () => {
    const { openModal } = useModal();
    const plans = [
        {
            name: 'الباقة الاساسيو', // Basic
            price: '2,500',
            features: [
                'إضافة حتى 50 مدرب',
                'إنشاء حتى 3 دورات / برامج تدريبية',
                'إرسال تنبيهات محدودة للمتدربين',
                'الوصول لإحصاءات أساسية عن المتدربين',
                'إمكانية تنزيل تقارير مختصرة للمتدربين',
            ],
            buttonText: 'اشترك الآن',
            highlight: false,
        },
        {
            name: 'الباقة البريميوم', // Premium
            price: '4,200',
            features: [
                'إدارة حتى 200 مدرب',
                'إنشاء حتى 10 دورات / برامج تدريبية',
                'الوصول لجميع التقارير والإحصائيات التفصيلية',
                'إمكانية تعيين مدربين فرعيين داخل الأكاديمية',
                'تخصيص الباقات والبرامج التدريبية',
            ],
            buttonText: 'اشترك الآن',
            highlight: true,
            tag: 'الاكثر انتشاراً',
        },
        {
            name: 'الباقة الالتر', // Ultra
            price: '5,200',
            features: [
                'إدارة عدد غير محدود من المتدربين',
                'إنشاء عدد غير محدود من الدورات',
                'إرسال تنبيهات غير محدودة للمتدربين',
                'إدارة الفروع والأقسام الداخلية للأكاديمية',
                'دعم فني متميز للأكاديمية على مدار الساعة',
            ],
            buttonText: 'اشترك الآن',
            highlight: false,
        },
    ];

    return (
        <section className="bg-[#f8faff] py-32">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-extrabold mb-6 relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[#FFD200] after:rounded-sm">
                        اختر باقتك وابدأ إدارة أكاديميتك بسهولة
                    </h2>
                    <p className="text-[#6b7280] leading-relaxed text-lg font-semibold">
                        أختر الباقة المناسبة لاحتياجات أكاديميتك وابدأ إدارة المدربين والخدمات بسهولة مع نظام مرن ينمو معك.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row justify-center gap-8 items-start pt-12">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`flex-1 bg-white border ${plan.highlight ? 'border-none bg-[#4F83FF] text-white scale-105 shadow-[0_20px_40px_rgba(79,131,255,0.3)] z-10' : 'border-[#4F83FF] text-[#4a4a4a] shadow-[0_10px_25px_rgba(0,0,0,0.03)]'} rounded-[60px_15px_60px_15px] p-8 transition-all duration-300 ease-in-out min-w-[320px] relative`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FFD200] text-white px-10 py-2 rounded-full font-black text-sm shadow-md whitespace-nowrap">
                                    {plan.tag}
                                </div>
                            )}

                            <div className="text-right mb-10 space-y-2">
                                <h3 className={`text-xl font-black ${plan.highlight ? 'text-white' : 'text-[#1a1a1a]'}`}>
                                    {plan.name}
                                </h3>
                                <div className={`flex flex-col items-start gap-0 ${plan.highlight ? 'text-white' : 'text-[#4F83FF]'}`}>
                                    <span className="text-xl font-black">{plan.price}</span>
                                    <span className="text-xs font-bold opacity-80 uppercase tracking-tighter -mt-1">SAR</span>
                                </div>
                            </div>

                            <ul className="list-none p-0 mb-10">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start justify-start gap-3 mb-5 text-[0.95rem] font-bold">
                                        <div className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center p-1 mt-0.5 ${plan.highlight ? 'bg-white text-[#4F83FF]' : 'bg-[#4F83FF] text-white'}`}>
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                        <span className={`text-right leading-snug ${plan.highlight ? 'text-white' : 'text-[#4a4a4a]'}`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => openModal('registration')}
                                className={`w-full py-4 text-2xl font-black rounded-xl transition-all duration-300 hover:-translate-y-1 hover:brightness-110 ${plan.highlight ? 'bg-white text-[#4F83FF]' : 'bg-[#4F83FF] text-white'}`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
