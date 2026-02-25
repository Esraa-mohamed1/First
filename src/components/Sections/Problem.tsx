import Image from 'next/image';
import problemImg from '@/assets/ima.png';

const Problem = () => {
    const features = [
        'ادارة تسجيل المدربين',
        'متابعة المدفوعات',
        'الوصول لطلاب جدد',
        'ادارة تسجيل الطلاب',
        'تنظيم الكورسات',
    ];

    return (
        <section className="bg-white py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a1a1a] relative inline-block">
                        هل بتواجه صعوبة في ادارة اكاديميتك ؟
                        <div className="absolute bottom-1.5 left-0 right-0 h-[2px] bg-[#FFD200] -z-10 opacity-100"></div>
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-32">
                    {/* Content Side (Right in RTL) */}
                    <div className="flex-[1.2] text-right">
                        <ul className="flex flex-col gap-10">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center justify-start gap-6 group">
                                    <div className="w-6 h-6 rounded-full bg-[#A3C6FF] flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-125"></div>
                                    <span className="text-3xl md:text-4xl font-bold text-[#1a1a1a] group-hover:text-[#2563eb] transition-colors duration-300">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Image Side (Left in RTL) */}
                    <div className="flex-1 flex justify-center md:justify-end">
                        <div className="relative w-[300px] h-[500px] md:w-[380px] md:h-[580px]">
                            <div className="w-full h-full rounded-full overflow-hidden shadow-sm">
                                <Image
                                    src={problemImg}
                                    alt="Problem image"
                                    className="w-full h-full object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Problem;
