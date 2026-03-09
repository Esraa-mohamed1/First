import { Suspense } from 'react';
import Nav from '@/components/Nav/Nav';
import Footer from '@/components/Footer/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function MarketingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <ScrollReveal />
            <Suspense fallback={<div className="h-20 bg-white/80" />}>
                <Nav />
            </Suspense>
            {children}
            <Footer />
        </>
    );
}
