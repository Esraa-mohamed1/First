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

export default function Home() {
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
