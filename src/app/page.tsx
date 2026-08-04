import Nav from '@/components/Nav/Nav';
import Footer from '@/components/Footer/Footer';
import Hero from '@/components/Sections/Hero';
import Stats from '@/components/Sections/Stats';
import Problem from '@/components/Sections/Problem';
import Benefits from '@/components/Sections/Benefits';
import Pricing from '@/components/Sections/Pricing';
import CTA from '@/components/Sections/CTA';
import ScrollReveal from '@/components/ScrollReveal';
import { headers } from 'next/headers';
import TenantHomeClient from '@/components/Home/TenantHomeClient';

function getTenantKey(host: string): string | null {
    const hostname = host.split(':')[0].toLowerCase();

    if (
        hostname === 'localhost' ||
        hostname === 'darab.academy' ||
        hostname === 'www.darab.academy' ||
        hostname.startsWith('127.0.0.')
    ) {
        return null;
    }

    if (hostname.endsWith('.localhost')) {
        return hostname.replace('.localhost', '');
    }

    return hostname;
}

export default async function Home() {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    const tenantKey = getTenantKey(host);

    if (tenantKey) {
        return <TenantHomeClient />;
    }

    return (
        <main>
            <ScrollReveal />
            <Nav />
            <div className="animate-on-scroll"><Hero /></div>
            <div className="animate-on-scroll"><Stats /></div>
            <div className="animate-on-scroll"><Problem /></div>
            <div className="animate-on-scroll"><Benefits /></div>
            <div className="animate-on-scroll"><Pricing /></div>
            <div className="animate-on-scroll"><CTA /></div>
            <Footer />
        </main>
    );
}

