import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const storageZoneName = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_NAME || 'esraa2';
    // Use Server API Key first, fallback to Stream API Key
    const apiKey = process.env.BUNNY_API_KEY || process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY || '';

    if (!apiKey) {
      return NextResponse.json({ error: 'Bunny API credentials are not configured on the server.' }, { status: 500 });
    }

    // Generate a unique file name using timestamp and clean string
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${timestamp}_${cleanFileName}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to Bunny Storage Zone via HTTP PUT
    await axios.put(
      `https://storage.bunnycdn.com/${storageZoneName}/${uniqueFileName}`,
      fileBuffer,
      {
        headers: {
          AccessKey: apiKey,
          'Content-Type': file.type || 'application/octet-stream',
        },
      }
    );

    // Build public CDN URL
    const fileUrl = `https://${storageZoneName}.b-cdn.net/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error: any) {
    console.error('Error uploading to Bunny Storage:', error.response?.data || error.message);
    const apiError = error.response?.data?.Message || error.message || 'Error occurred';
    return NextResponse.json(
      { error: `Failing to upload to Bunny Storage: ${apiError}` },
      { status: 500 }
    );
  }
}
