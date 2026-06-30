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
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { unwrapEncryptedResponseData } from '@/lib/decryption';
import { apiToEditor } from '@/services/pages';
import TemplateRenderer from '@/builder/templates/renderer/TemplateRenderer';

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

    if (hostname.endsWith('.darab.academy')) {
        return hostname.replace('.darab.academy', '');
    }

    return hostname;
}

async function fetchTenantHomepage(tenantKey: string, token?: string) {
    try {
        const lowerKey = tenantKey.toLowerCase();
        const reqHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-Tenant-Key': lowerKey,
            'X-Tenant': lowerKey,
            'x-tenant-name': lowerKey
        };

        if (token) {
            reqHeaders['Authorization'] = `Bearer ${token}`;
        }

        const api = axios.create({
            baseURL: 'https://api.darab.academy/api/academy',
            headers: reqHeaders
        });

        const pagesResponse = await api.get('/pages');
        const unwrappedPages = unwrapEncryptedResponseData(pagesResponse.data) as any;
        const pages = unwrappedPages?.data ?? unwrappedPages;

        if (!Array.isArray(pages) || pages.length === 0) {
            console.warn(`No pages found for tenant: ${tenantKey}`);
            return null;
        }

        const TEMPLATE_SLUGS = ['academy-dashboard', 'template_1', 'template_2', 'template_3', 'template_4', 'template_courses_1'];

        let homePage = pages.find((p: any) => p.is_active === 1 || p.is_active === '1' || p.is_active === true || p.is_active === 'true');
        if (!homePage) {
            const templatePages = pages.filter((p: any) => TEMPLATE_SLUGS.includes(p.title));
            homePage = templatePages.sort((a: any, b: any) => Number(b.id) - Number(a.id))[0];
        }

        if (!homePage) {
            homePage = pages.find((p: any) => p.slug === 'home' || p.slug?.startsWith('home-')) || pages[0];
        }

        if (!homePage) return null;

        const sectionsResponse = await api.get('/sections', {
            params: { page_id: homePage.id }
        });
        const unwrappedSections = unwrapEncryptedResponseData(sectionsResponse.data) as any;
        const sectionsData = unwrappedSections?.data ?? unwrappedSections;

        return {
            templateId: homePage.template || homePage.template_id || homePage.title || homePage.slug || 'template_1',
            sections: Array.isArray(sectionsData) ? sectionsData : []
        };
    } catch (error: any) {
        console.error(`Failed to fetch tenant homepage for ${tenantKey}:`, error.message, error.response?.status, error.response?.data);
        return null;
    }
}

export default async function Home() {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const cookieTenant = cookieStore.get('academy_link_name')?.value;

    let tenantKey = getTenantKey(host) || cookieTenant;
    if (!tenantKey && (host.includes('localhost') || host.includes('127.0.0.1'))) {
        tenantKey = 'esraa';
    }

    if (tenantKey) {
        if (tenantKey.endsWith('.darab.academy')) {
            tenantKey = tenantKey.replace('.darab.academy', '');
        }
        if (tenantKey.endsWith('.localhost')) {
            tenantKey = tenantKey.replace('.localhost', '');
        }
        tenantKey = tenantKey.toLowerCase();
    }

    if (tenantKey) {
        console.log(`[Home Server Component] host: ${host}, tenantKey: ${tenantKey}, token: ${token ? token.substring(0, 10) + '...' : 'undefined'}`);
        const homepageData = await fetchTenantHomepage(tenantKey, token);
        if (homepageData) {
            const editorNodes = apiToEditor(homepageData.sections);
            return (
                <main className="min-h-screen bg-white  mx-auto px-12 py-12">
                    <TemplateRenderer templateId={homepageData.templateId} sections={editorNodes} />
                </main>
            );
        } else {
            redirect('/auth/login');
        }
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

