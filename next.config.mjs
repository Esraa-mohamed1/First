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
};
export default nextConfig;
