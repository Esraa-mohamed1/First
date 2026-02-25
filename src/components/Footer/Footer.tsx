import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';
import footerBg from '@/assets/footer-bg.png';

const Footer = () => {
    return (
        <footer className="relative py-20 overflow-hidden bg-white">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={footerBg}
                    alt="Footer Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Optional Overlay if needed for text readability */}
                {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div> */}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 text-right items-start">
                    
                    {/* Column 1: Brand & Socials */}
                    <div className="flex flex-col gap-6 items-end md:items-start order-4 md:order-1 p-8 relative group">
                        <h2 className="text-4xl font-black text-[#2563eb]">First</h2>
                        
                        <div className="flex flex-col gap-4 items-end md:items-start w-full">
                            <p className="font-bold text-gray-800 text-lg">تابعنا عبر</p>
                            <div className="flex gap-4">
                                <Link href="#" className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#2563eb] hover:scale-110 transition-all">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </Link>
                                <Link href="#" className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-pink-500 hover:scale-110 transition-all">
                                    <Instagram size={28} />
                                </Link>
                                <Link href="#" className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#1877F2] hover:scale-110 transition-all">
                                    <Facebook size={28} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Academy */}
                    <div className="flex flex-col gap-6 order-3 md:order-2 p-8 relative">
                         {/* Column Separator Effect - Vertical Gradient Line */}
                        <div className="hidden md:block absolute right-0 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-blue-200 to-transparent"></div>
                        
                        <h3 className="text-xl font-black text-gray-900">للأكاديميات</h3>
                        <ul className="flex flex-col gap-4 font-bold text-gray-700">
                            <li><Link href="/register" className="hover:text-[#2563eb] transition-colors">سجل أكاديميتك</Link></li>
                            <li><Link href="/login" className="hover:text-[#2563eb] transition-colors">تسجيل الدخول</Link></li>
                            <li><Link href="/support" className="hover:text-[#2563eb] transition-colors">الدعم الفني</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Terms */}
                    <div className="flex flex-col gap-6 order-2 md:order-3 p-8 relative">
                        {/* Column Separator Effect - Vertical Gradient Line */}
                        <div className="hidden md:block absolute right-0 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-blue-200 to-transparent"></div>

                        <h3 className="text-xl font-black text-gray-900">الشروط والاحكام</h3>
                        <ul className="flex flex-col gap-4 font-bold text-gray-700">
                            <li><Link href="/terms" className="hover:text-[#2563eb] transition-colors">سياسة الدفع</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#2563eb] transition-colors">سياسة الخصوصية</Link></li>
                            <li><Link href="/refund" className="hover:text-[#2563eb] transition-colors">سياسة الاسترداد</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Quick Links */}
                    <div className="flex flex-col gap-6 order-1 md:order-4 p-8 relative">
                         {/* Column Separator Effect - Vertical Gradient Line */}
                        <div className="hidden md:block absolute right-0 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-blue-200 to-transparent"></div>

                        <h3 className="text-xl font-black text-gray-900">روابط سريعة</h3>
                        <ul className="flex flex-col gap-4 font-bold text-gray-700">
                            <li><Link href="/" className="hover:text-[#2563eb] transition-colors">الرئيسية</Link></li>
                            <li><Link href="/features" className="hover:text-[#2563eb] transition-colors">المميزات</Link></li>
                            <li><Link href="/packages" className="hover:text-[#2563eb] transition-colors">الباقات</Link></li>
                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
