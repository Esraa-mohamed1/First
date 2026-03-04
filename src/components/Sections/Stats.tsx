import Image from 'next/image';
import statsBg from '@/assets/stats.jpg';

const Stats = () => {
    const stats = [
        { value: '30+', label: 'عملية دفع تمت' },
        { value: '750+', label: 'عملية تسجيل تمت بنجاح' },
        { value: '1900+', label: 'إجمالى عدد الطلبة' },
        { value: '500+', label: 'إجمالي الأكاديميات' },
    ];

    return (
        <section className="relative py-32 my-16 text-white overflow-hidden bg-[#2563eb]">
            <Image
                src={statsBg}
                alt="Stats background"
                fill
                className="object-cover z-0 opacity-60"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#5d8ff3]/90 to-[#6b9bf7]/85 opacity-50 z-[1]"></div>
            <div className="max-w-[1400px] mx-auto px-4 relative z-[2] flex flex-wrap justify-between gap-18">
                {stats.map((item, index) => (
                    <div key={index} className="text-center group flex flex-col items-center">
                        <div className="text-5xl font-black mb-4 drop-shadow-lg">{item.value}</div>
                        <div className="text-2xl font-black transition-all duration-300 group-hover:text-[#fbbf24]">{item.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
