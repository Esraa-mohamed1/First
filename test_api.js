import axios from 'axios';

const endpoints = [
    'https://api.darab.academy/api/academy/public/pages',
    'https://api.darab.academy/api/academy/pages/public',
    'https://api.darab.academy/api/academy/pages-public',
    'https://api.darab.academy/api/front/page-builder/pages',
    'https://api.darab.academy/api/front/page-builder/sections',
    'https://api.darab.academy/api/front/tenant-pages',
    'https://api.darab.academy/api/front/academy-pages',
    'https://api.darab.academy/api/front/get-pages',
    'https://api.darab.academy/api/front/public-pages',
    'https://api.darab.academy/api/front/sections',
    'https://api.darab.academy/api/front/page/sections',
];

async function run() {
    const tenantKey = 'esraa.darab.academy';
    for (const url of endpoints) {
        try {
            console.log(`Testing: ${url}`);
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Key': tenantKey
                }
            });
            console.log(`SUCCESS for ${url}: status = ${response.status}`);
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                console.log(`FAILED for ${url}: status = ${error.response.status}, message = ${JSON.stringify(error.response.data?.message || error.response.data)}`);
            } else {
                console.log(`FAILED for ${url}: error = ${error.message}`);
            }
        }
        console.log('--------------------------------------------------');
    }
}

run();
