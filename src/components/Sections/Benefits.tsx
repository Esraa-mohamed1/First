import { Newspaper, LayoutDashboard, Share2 } from 'lucide-react';

const Benefits = () => {
    const steps = [
        {
            number: '01',
            title: 'لوحة تحكم متكاملة لإدارة الأكاديمية',
            desc: 'متابعة يومية لكل تفاصيل أكاديميتك بسهولة تامة من مكان واحد.',
            icon: <LayoutDashboard size={28} />
        },
        {
            number: '02',
            title: 'تقارير وإيصالات فورية',
            desc: 'إصدار وتنظيم الفواتير من أي مكان وفي أي وقت بضغطة زر.',
            icon: <Newspaper size={28} />
        },
        {
            number: '03',
            title: 'إدارة الاشتراكات والمدفوعات',
            desc: 'تحكم عملي في الفواتير ومتابعة دقيقة لاشتراكات الطلاب والمدربين.',
            icon: <Share2 size={28} />
        },
    ];

    return (
        <section className="bg-white py-32 overflow-hidden border-y border-[#f3f4f6]">
            <div className="max-w-[1400px] mx-auto px-8 flex flex-col lg:flex-row items-center gap-24">
                {/* List Side (Right in RTL) */}
                <div className="flex-1 space-y-12">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-8 group">
                            {/* Number Background */}
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#2563eb]/20 to-transparent group-hover:from-[#2563eb] group-hover:to-[#2563eb]/40 transition-all duration-500">
                                {step.number}
                            </div>

                            <div className="flex-1 text-right">
                                <div className="flex items-center justify-end gap-5 mb-4">
                                    <h3 className="text-2xl font-black text-[#1f2937] group-hover:text-[#2563eb] transition-colors">{step.title}</h3>
                                    <div className="w-14 h-14 rounded-3xl bg-[#f8faff] shadow-sm flex items-center justify-center text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition-all duration-300">
                                        {step.icon}
                                    </div>
                                </div>
                                <p className="text-lg text-[#6b7280] font-bold leading-relaxed pr-19">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Showcase Side (Left in RTL) */}
                <div className="flex-1 relative">
                    <div className="absolute -inset-10 bg-[#2563eb]/5 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:20px_20px] rounded-full blur-3xl -z-10"></div>
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#2563eb] to-[#fbbf24] rounded-[50px] opacity-10 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative w-full aspect-[4/3] rounded-[50px] bg-[#f8faff] shadow-[-20px_20px_60px_rgba(0,0,0,0.05)] overflow-hidden border-[12px] border-white ring-1 ring-slate-100 italic flex items-center justify-center">
                            {/* Large Placeholder Icon/Image */}
                            <div className="flex flex-col items-center gap-4 opacity-10">
                                <LayoutDashboard size={120} />
                                <span className="text-2xl font-black">Dashboard Preview</span>
                            </div>
                        </div>

                        {/* Floating elements for extra juice */}
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white rounded-3xl shadow-2xl p-6 hidden md:block animate-bounce-slow">
                            <div className="w-full h-3 bg-[#f3f4f6] rounded-full mb-3"></div>
                            <div className="w-2/3 h-3 bg-[#f3f4f6] rounded-full mb-6"></div>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-lg bg-[#2563eb]/20"></div>
                                <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Benefits;
