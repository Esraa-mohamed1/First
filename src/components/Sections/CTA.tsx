'use client';

import { useModal } from '@/context/ModalContext';

const CTA = () => {
    const { openModal } = useModal();

    return (
        <section className="py-32 px-4">
            <div className="max-w-[1200px] mx-auto rounded-[60px] bg-[#2563eb] relative overflow-hidden p-12 md:p-24 text-center">
                {/* Decorative background patterns */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fbbf24]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                        هل أنت جاهز لتطوير <br />
                        أكاديميتك اليوم؟
                    </h2>
                    <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-bold">
                        انضم إلى مئات الأكاديميات الناجحة وابدأ إدارة خدماتك بكل سهولة واحترافية.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => openModal('registration')}
                            className="px-12 py-5 text-2xl font-black bg-[#fbbf24] text-[#1a1a1a] rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
                        >
                            اشترك الآن
                        </button>
                        <button className="px-12 py-5 text-2xl font-black text-white border-2 border-white/30 rounded-3xl hover:bg-white/10 transition-all duration-300">
                            تواصل معنا
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
