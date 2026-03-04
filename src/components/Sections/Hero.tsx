'use client';

import Image from 'next/image';
import img1 from '@/assets/img1.jpg';
import img2 from '@/assets/img2.jpg';
import { useModal } from '@/context/ModalContext';

const Hero = () => {
    const { openModal } = useModal();

    return (
        <section className="bg-white py-32 overflow-hidden relative">
            <div className="max-w-[1600px] mx-auto px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Left Image Side - Pushed to side */}
                <div className="flex-1 hidden lg:flex justify-start relative translate-y-16">
                    <div className="w-[300px] h-[520px] rounded-[150px] overflow-hidden relative bg-[#f0f0f0] border-8 border-[#fbbf24] shadow-2xl">
                        <Image src={img1} alt="Student learning" className="w-full h-full object-cover" priority />
                        <div className="absolute left-[-60px] bottom-[15%] flex flex-col gap-4 z-[5]">
                            <span className="h-[3px] bg-[#2563eb] rounded-full shadow-lg w-[40px] -rotate-[35deg]"></span>
                            <span className="h-[3px] bg-[#2563eb] rounded-full shadow-lg w-[60px] -rotate-[15deg] -ml-2"></span>
                            <span className="h-[3px] bg-[#2563eb] rounded-full shadow-lg w-[45px] rotate-0 -ml-5"></span>
                        </div>
                    </div>
                </div>

                {/* Central Content */}
                <div className="flex-[1.5] text-center z-10 px-4">
                    <h1 className="text-7xl font-black leading-[1.1] mb-10 text-[#2563eb]">
                        ابدأ إدارة أكاديميتك <br />
                        <span className="text-[#fbbf24]">بسهولة</span>
                    </h1>
                    <p className="text-2xl text-[#6b7280] mb-14 max-w-xl mx-auto font-medium leading-relaxed">
                        كل الأدوات اللي تحتاجها لإدارة الخدمات، العملاء، والحجوزات في مكان واحد. اختر باقتك وابدأ خلال دقائق.
                    </p>
                    <button
                        onClick={() => openModal('registration')}
                        className="px-16 py-6 text-2xl font-black bg-[#2563eb] text-white rounded-[2rem] cursor-pointer shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.5)] transition-all duration-300 active:scale-95"
                    >
                        أختر باقتك الآن
                    </button>
                </div>

                {/* Right Image Side - Pushed to side */}
                <div className="flex-1 hidden lg:flex justify-end relative -translate-y-16">
                    <div className="w-[300px] h-[520px] rounded-[150px] overflow-hidden relative bg-[#f0f0f0] border-8 border-[#2563eb] shadow-2xl">
                        <Image src={img2} alt="Instructor working" className="w-full h-full object-cover" priority />
                        <div className="absolute right-[-60px] top-[10%] flex flex-col gap-4 z-[5]">
                            <span className="h-[3px] bg-[#2563eb] rounded-full shadow-lg w-[45px] rotate-[45deg]"></span>
                            <span className="h-[3px] bg-[#2563eb] rounded-full shadow-lg w-[65px] rotate-[30deg] -mr-2"></span>
                            <span className="h-[3px] bg-[#2563eb] rounded-full shadow-lg w-[50px] rotate-[15deg] -mr-5"></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
