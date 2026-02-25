import Image from 'next/image';
import benefitsImg from '@/assets/beniftsbg.png';
import { BarChart3, Rocket, Users } from 'lucide-react';

const Benefits = () => {
    const steps = [
        {
            number: '٠١',
            title: 'لوحة تحكم متكاملة لإدارة الأكاديمية',
            desc: 'متابعة وإدارة كل تفاصيل الأكاديمية بسهولة',
            icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
            offset: 'translate-x-0',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            number: '٠٢',
            title: 'تقارير وإحصائيات فورية',
            desc: 'بيانات واضحة عن أداء الأكاديمية',
            icon: <Rocket className="w-6 h-6 text-yellow-500" />,
            offset: '-translate-x-12',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-500'
        },
        {
            number: '٠٣',
            title: 'ادارة الاشتراكات والمدفوعات',
            desc: 'تحكم كامل في الفواتير وخطط الاشتراك',
            icon: <Users className="w-6 h-6 text-purple-500" />,
            offset: 'translate-x-0',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-500'
        },
    ];

    return (
        <section className="bg-white py-24 overflow-hidden relative">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                
                {/* Section Header */}
                <div className="text-center mb-24 relative z-10">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                        منصتنا بتوفر لك كل الأدوات اللي تحتاجها
                        <br />
                        <span className="relative inline-block mt-2">
                            لإدارة أكاديميتك باحتراف في مكان واحد.
                            <span className="absolute bottom-2 left-0 w-full h-1 bg-yellow-300/60 -z-10 rounded-sm"></span>
                        </span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-44">
                    
                    {/* Image Side (Left in RTL) */}
                    <div className="flex-1 relative order-2 lg:order-2 w-full lg:w-[50%] flex justify-start">
                         {/* Image Container */}
                        <div className="relative w-full max-w-[650px] aspect-[4/3.5] lg:aspect-square lg:-ml-20">
                            <Image
                                src={benefitsImg}
                                alt="Academy Management Benefits"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </div>

                    {/* Text Content Side (Right in RTL) */}
                    <div className="flex-1 space-y-10 order-1 lg:order-1 text-right w-full lg:w-[50%] pr-0 lg:pr-12">
                        {steps.map((step, index) => (
                            <div 
                                key={index} 
                                className={`flex items-center gap-6 group transition-transform duration-500 hover:-translate-x-2 ${step.offset}`}
                            >
                                {/* Number */}
                                <div className="text-6xl font-black text-gray-200 group-hover:text-blue-600 transition-colors duration-300 leading-none min-w-[80px] text-center hidden sm:block">
                                    {step.number}
                                </div>

                                {/* Card */}
                                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-50 flex items-center justify-between gap-4 relative z-10 hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-xl font-black text-gray-900">{step.title}</h3>
                                        <p className="text-gray-500 font-medium text-sm">
                                            {step.desc}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-full ${step.bgColor} flex items-center justify-center shrink-0`}>
                                        {step.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Benefits;
