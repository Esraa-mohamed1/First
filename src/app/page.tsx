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
import fs from 'fs';
import path from 'path';
import { unwrapEncryptedResponseData } from '@/lib/decryption';
import { apiToEditor } from '@/services/pages';
import TemplateRenderer from '@/builder/templates/renderer/TemplateRenderer';
import { getTemplateById } from '@/builder/utils/templates';

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

async function fetchTenantHomepage(tenantKey: string, token?: string) {
    const lowerKey = tenantKey.toLowerCase();
    const cacheDir = path.join(process.cwd(), 'public', 'tenant-cache');
    const cacheFilePath = path.join(cacheDir, `${lowerKey}.json`);

    // If no token is provided, attempt to serve immediately from local cache
    if (!token) {
        if (fs.existsSync(cacheFilePath)) {
            try {
                const cachedContent = fs.readFileSync(cacheFilePath, 'utf8');
                const cachedData = JSON.parse(cachedContent);
                if (cachedData && cachedData.templateId && Array.isArray(cachedData.sections)) {
                    console.log(`[Home Server Component] Guest access - read homepage data from local cache for ${tenantKey}`);
                    return cachedData;
                }
            } catch (cacheErr: any) {
                console.error(`Failed to read guest cache for ${tenantKey}:`, cacheErr.message);
            }
        }
    }

    try {
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

        let pages: any[] = [];
        try {
            const landingPagesResponse = await api.get('/landing_pages');
            const unwrappedLanding = unwrapEncryptedResponseData(landingPagesResponse.data) as any;
            const landingData = unwrappedLanding?.data ?? unwrappedLanding;
            if (Array.isArray(landingData) && landingData.length > 0) {
                pages = landingData;
            }
        } catch (e: any) {
            console.warn(`Failed to fetch /landing_pages for tenant ${tenantKey}, trying /pages fallback:`, e.message);
        }

        if (pages.length === 0) {
            const pagesResponse = await api.get('/pages');
            const unwrappedPages = unwrapEncryptedResponseData(pagesResponse.data) as any;
            pages = (unwrappedPages?.data ?? unwrappedPages) || [];
        }

        if (!Array.isArray(pages) || pages.length === 0) {
            console.warn(`No pages or landing_pages found for tenant: ${tenantKey}`);
            return null;
        }

        const TEMPLATE_SLUGS = ['academy-dashboard', 'template_1', 'template_2', 'template_3', 'template_4', 'template_courses_1'];

        let homePage = pages.find((p: any) => p.is_active === 1 || p.is_active === '1' || p.is_active === true || p.is_active === 'true');
        if (!homePage) {
            const templatePages = pages.filter((p: any) => TEMPLATE_SLUGS.includes(p.template_name || p.template || p.title));
            homePage = templatePages.sort((a: any, b: any) => Number(b.id || 0) - Number(a.id || 0))[0];
        }

        if (!homePage) {
            homePage = pages.find((p: any) => p.slug === 'home' || p.slug?.startsWith('home-')) || pages[0];
        }

        if (!homePage) return null;

        let sectionsData = homePage.sections || homePage.content?.sections;
        if (!Array.isArray(sectionsData) || sectionsData.length === 0) {
            if (homePage.id) {
                try {
                    const sectionsResponse = await api.get('/sections', {
                        params: { page_id: homePage.id }
                    });
                    const unwrappedSections = unwrapEncryptedResponseData(sectionsResponse.data) as any;
                    sectionsData = unwrappedSections?.data ?? unwrappedSections;
                } catch (secErr: any) {
                    console.warn(`Failed to fetch sections for page_id ${homePage.id}:`, secErr.message);
                }
            }
        }

        const resultData = {
            templateId: homePage.template_name || homePage.template || homePage.template_id || homePage.title || homePage.slug || 'template_1',
            sections: Array.isArray(sectionsData) ? sectionsData : []
        };

        // Cache the successful retrieval for future guest loads
        try {
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            fs.writeFileSync(cacheFilePath, JSON.stringify({
                ...resultData,
                updatedAt: new Date().toISOString()
            }, null, 2), 'utf8');
            console.log(`[Home Server Component] Automatically updated homepage cache for ${lowerKey}`);
        } catch (writeErr: any) {
            console.error(`Failed to write cache for ${tenantKey}:`, writeErr.message);
        }

        return resultData;
    } catch (error: any) {
        console.error(`Failed to fetch tenant homepage for ${tenantKey}:`, error.message, error.response?.status, error.response?.data);
        
        // Fallback to cache on error
        if (fs.existsSync(cacheFilePath)) {
            try {
                const cachedContent = fs.readFileSync(cacheFilePath, 'utf8');
                const cachedData = JSON.parse(cachedContent);
                if (cachedData && cachedData.templateId && Array.isArray(cachedData.sections)) {
                    console.log(`[Home Server Component] API failed - fall back to local cache for ${tenantKey}`);
                    return cachedData;
                }
            } catch (cacheErr: any) {
                console.error(`Failed to read fallback cache for ${tenantKey}:`, cacheErr.message);
            }
        }
        
        return null;
    }
}

export default async function Home() {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const tenantKey = getTenantKey(host);

    if (tenantKey) {
        console.log(`[Home Server Component] host: ${host}, tenantKey: ${tenantKey}, token: ${token ? token.substring(0, 10) + '...' : 'undefined'}`);
        const homepageData = await fetchTenantHomepage(tenantKey, token);
        if (homepageData) {
            const editorNodes = apiToEditor(homepageData.sections);
            return (
                <main className="w-full min-h-screen bg-white">
                    <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
                        <TemplateRenderer templateId={homepageData.templateId} sections={editorNodes} />
                    </div>
                </main>
            );
        } else {
            const defaultTemplate = getTemplateById('template_1');
            return (
                <main className="w-full min-h-screen bg-white">
                    <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
                        <TemplateRenderer templateId="template_1" sections={defaultTemplate.sections} />
                    </div>
                </main>
            );
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

