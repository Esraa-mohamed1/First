'use client';

import Link from 'next/link';
import { useModal } from '@/context/ModalContext';

const Nav = () => {
    const { openModal } = useModal();

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[100] shadow-[0_4px_30px_0px_rgba(72,128,255,0.2)]">
            <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
                <div className="text-5xl font-black font-bold text-[#2563eb]">
                    <Link href="/">درب</Link>
                </div>

                <ul className="hidden md:flex items-center gap-10 font-bold text-[#1f2937]">
                    <li><Link href="/" className="text-[#2563eb]">الرئيسية</Link></li>
                    <li><Link href="/about" className="hover:text-[#2563eb] transition-colors">من نحن</Link></li>
                    <li><Link href="/articles" className="hover:text-[#2563eb] transition-colors">المقالات</Link></li>
                    <li><Link href="/contact" className="hover:text-[#2563eb] transition-colors">تواصل معنا</Link></li>
                </ul>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => openModal('registration')}
                        className="hidden sm:block px-6 py-2.5 font-bold text-[#2563eb] bg-white border-2 border-[#2563eb] rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#2563eb] hover:text-white transition-all cursor-pointer"
                    >
                        إنشاء حساب
                    </button>
                    <button
                        onClick={() => openModal('login')}
                        className="px-6 py-2.5 font-bold bg-[#2563eb] text-white rounded-xl shadow-lg shadow-blue-200 hover:-translate-y-0.5 hover:shadow-blue-300 transition-all cursor-pointer"
                    >
                        تسجيل الدخول
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
