/** @type {import('next').NextConfig} */
const nextConfig = {
    // basePath: '/next-site',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tse3.mm.bing.net',
            },
            {
                protocol: 'https',
                hostname: 'api.darab.academy',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    },
                ],
            },
        ];
    },
};
export default nextConfig;
