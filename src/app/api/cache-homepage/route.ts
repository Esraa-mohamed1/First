import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { tenantKey, templateId, sections } = await request.json();
        
        if (!tenantKey || !templateId || !Array.isArray(sections)) {
            return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
        }

        const lowerKey = tenantKey.toLowerCase();
        const cacheDir = path.join(process.cwd(), 'public', 'tenant-cache');
        const cacheFilePath = path.join(cacheDir, `${lowerKey}.json`);

        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const cacheData = {
            templateId,
            sections,
            updatedAt: new Date().toISOString()
        };

        fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2), 'utf8');
        console.log(`[API Cache Homepage] Updated cache for ${lowerKey}`);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[API Cache Homepage] Error updating cache:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
