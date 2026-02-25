const Testimonials = () => {
    const reviews = [
        {
            name: "سارة أحمد",
            role: "مديرة أكاديمية نون",
            text: "من أهم الأدوات اللي استخدمتها لإدارة أكاديميتي. وفرت علي وقت مجهود كبير في متابعة الطلاب والمدفوعات.",
            rating: 5
        },
        {
            name: "محمد علي",
            role: "مدرب مستقل",
            text: "الواجهة سهلة جداً والتعامل مع النظام مريح. الدعم الفني دائماً موجود للمساعدة في أي استفسار.",
            rating: 5
        },
        {
            name: "ليلى محمود",
            role: "صاحبة أكاديمية فنون",
            text: "النظام متكامل وبيه كل اللي أحتاجه. التقارير الفورية ساعدتني في تحسين أداء الأكاديمية.",
            rating: 4
        }
    ];

    return (
        <section className="bg-white py-32">
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black text-[#2563eb] mb-4">آراء عملائنا</h2>
                    <p className="text-xl text-[#6b7280] font-bold">ثقة أكثر من 500 أكاديمية حول العالم</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {reviews.map((row, i) => (
                        <div key={i} className="p-10 rounded-[40px] bg-[#f8faff] border border-[#e2e8f0] hover:border-[#2563eb] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, star) => (
                                    <svg
                                        key={star}
                                        className={`w-5 h-5 ${star < row.rating ? 'text-[#fbbf24]' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-lg text-[#4a4a4a] font-bold leading-relaxed mb-8">"{row.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563eb] to-[#fbbf24] p-0.5">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-[#2563eb]">
                                        {row.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-[#1a1a1a]">{row.name}</div>
                                    <div className="text-sm text-[#6b7280] font-bold">{row.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
