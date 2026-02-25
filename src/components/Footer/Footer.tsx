import Link from 'next/link';
import { X, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white py-20 border-t border-[#f3f4f6]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row-reverse justify-between gap-16">
                    <div className="flex-1 text-right">
                        <h2 className="text-4xl font-extrabold text-[#2563eb] mb-6">First</h2>
                        <p className="font-bold mb-6 text-[#1f2937]">تابعنا عبر</p>
                        <div className="flex justify-end gap-5">
                            <Link href="#" className="w-10 h-10 rounded-full bg-[#f8faff] flex items-center justify-center text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all">
                                <X size={20} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-[#f8faff] flex items-center justify-center text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all">
                                <Instagram size={20} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-[#f8faff] flex items-center justify-center text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all">
                                <Facebook size={20} />
                            </Link>
                        </div>
                    </div>

                    <div className="flex-[3] flex flex-col md:flex-row justify-around gap-12 text-right">
                        <div className="flex flex-col gap-5">
                            <h3 className="text-xl font-extrabold text-[#1f2937]">روابط سريعة</h3>
                            <ul className="flex flex-col gap-3 font-semibold text-[#6b7280]">
                                <li><Link href="/" className="hover:text-[#2563eb] transition-colors">الرئيسية</Link></li>
                                <li><Link href="/features" className="hover:text-[#2563eb] transition-colors">المميزات</Link></li>
                                <li><Link href="/packages" className="hover:text-[#2563eb] transition-colors">الباقات</Link></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h3 className="text-xl font-extrabold text-[#1f2937]">الشروط والاحكام</h3>
                            <ul className="flex flex-col gap-3 font-semibold text-[#6b7280]">
                                <li><Link href="/terms" className="hover:text-[#2563eb] transition-colors">سياسة الدفع</Link></li>
                                <li><Link href="/privacy" className="hover:text-[#2563eb] transition-colors">سياسة الخصوصية</Link></li>
                                <li><Link href="/refund" className="hover:text-[#2563eb] transition-colors">سياسة الاسترداد</Link></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h3 className="text-xl font-extrabold text-[#1f2937]">للأكاديميات</h3>
                            <ul className="flex flex-col gap-3 font-semibold text-[#6b7280]">
                                <li><Link href="/register" className="hover:text-[#2563eb] transition-colors">سجل أكاديميتك</Link></li>
                                <li><Link href="/login" className="hover:text-[#2563eb] transition-colors">تسجيل الدخول</Link></li>
                                <li><Link href="/support" className="hover:text-[#2563eb] transition-colors">الدعم الفني</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;