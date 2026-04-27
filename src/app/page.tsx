import Nav from '@/components/Nav/Nav';
import Footer from '@/components/Footer/Footer';
import Hero from '@/components/Sections/Hero';
import Stats from '@/components/Sections/Stats';
import Problem from '@/components/Sections/Problem';
import Benefits from '@/components/Sections/Benefits';
import Pricing from '@/components/Sections/Pricing';
import Testimonials from '@/components/Sections/Testimonials';
import CTA from '@/components/Sections/CTA';
import ScrollReveal from '@/components/ScrollReveal';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
    const headersList = await headers();
    const host = headersList.get('host') || '';

    // If the host is not the main root domain, it means we are on an academy subdomain
    // We allow the home page (landing page) to be visible on subdomains for guest access
    const isMainDomain =
        host === 'localhost:3000' ||
        host === 'darab.academy.localhost:3000' ||
        host === 'darab.academy' ||
        host === 'www.darab.academy' ||
        host.startsWith('127.0.0.1');

    // Remove the redirect to allow guests to see the landing page on subdomains
    /*
    if (!isMainDomain) {
        redirect('/auth/login');
    }
    */

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
