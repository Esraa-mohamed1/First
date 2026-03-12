'use client';

import { Check } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useEffect, useState } from 'react';
import { getPackages } from '@/services/packages';
import { Package } from '@/types/api';
import { useRouter } from 'next/navigation';

const Pricing = () => {
    const { openModal } = useModal();
    const router = useRouter();
    const [plans, setPlans] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getPackages();
                setPlans(data);
            } catch (error) {
                console.error('Error loading packages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    // Fallback plans if API fails or returns empty
    const displayPlans = plans.length > 0 ? plans : [];

    if (loading) {
        return (
            <section className="bg-[#f8faff] py-32">
                <div className="container mx-auto px-4 text-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-12"></div>
                        <div className="flex flex-col lg:flex-row gap-8 w-full justify-center">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex-1 h-[500px] bg-gray-200 rounded-3xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#f8faff] py-32">
            <div className="container mx-auto px-4">
                <div className="text-center mb-24 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                        <span className="relative inline-block">
                            اختر باقتك وابدأ إدارة أكاديميتك بسهولة
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300/60 -z-10 rounded-sm"></span>
                        </span>
                    </h2>
                    <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                        اختر الباقة المناسبة لاحتياجات أكاديميتك وابدأ إدارة المدربين والخدمات بسهولة مع نظام مرن ينمو معك.
                    </p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch pt-12">
                    {displayPlans.map((plan, index) => {
                        const isPopular = plan.recomnd === 1; // Updated to match API field 'recomnd'

                        return (
                            <div
                                key={plan.id || index}
                                className={`flex flex-col bg-white border ${isPopular ? 'border-none bg-[#4F83FF] text-white scale-105 shadow-[0_20px_40px_rgba(79,131,255,0.3)] z-10' : 'border-[#4F83FF] text-[#4a4a4a] shadow-[0_10px_25px_rgba(0,0,0,0.03)]'} rounded-[60px_15px_60px_15px] p-8 transition-all duration-300 ease-in-out relative`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FFD200] text-white px-10 py-2 rounded-full font-black text-sm shadow-md whitespace-nowrap">
                                        الاكثر انتشاراً
                                    </div>
                                )}
                                <div className="text-right mb-10 space-y-2">
                                    <h3 className={`text-xl font-black ${isPopular ? 'text-white' : 'text-[#1a1a1a]'}`}>
                                        {plan.titile}
                                    </h3>
                                    <div className={`flex flex-col items-start gap-0 ${isPopular ? 'text-white' : 'text-[#4F83FF]'}`}>
                                        <span className="text-xl font-black">{plan.price}</span>
                                        <span className="text-xs font-bold opacity-80 uppercase tracking-tighter -mt-1">SAR</span>
                                    </div>
                                </div>
                                <ul className="list-none p-0 mb-10 flex-grow">
                                    {(Array.isArray(plan.features) ? plan.features.slice(0, 5) : []).map((feature: any, idx) => (
                                        <li key={idx} className="flex items-start justify-start gap-3 mb-5 text-[0.95rem] font-bold">
                                            <div className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center p-1 mt-0.5 ${isPopular ? 'bg-white text-[#4F83FF]' : 'bg-[#4F83FF] text-white'}`}>
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                            <span className={`text-right leading-snug ${isPopular ? 'text-white' : 'text-[#4a4a4a]'}`}>
                                                {typeof feature === 'string' ? feature : feature.title || feature.lable}
                                            </span>
                                        </li>
                                    ))}
                                    {(!plan.features || plan.features.length === 0) && (
                                        <li className="text-center text-gray-400 py-4 font-bold">
                                            لا توجد مميزات إضافية
                                        </li>
                                    )}
                                </ul>
                                <button
                                    onClick={() => openModal('registration', { package_id: plan.id })}
                                    className={`w-full py-4 text-xl font-black rounded-xl transition-all duration-300 hover:-translate-y-1 hover:brightness-110 mt-auto ${isPopular ? 'bg-white text-[#4F83FF]' : 'bg-[#4F83FF] text-white'}`}
                                >
                                    اشترك الآن
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
