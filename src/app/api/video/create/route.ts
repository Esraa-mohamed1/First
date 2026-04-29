import { NextResponse } from 'next/server';
import { createVideoPlaceholder } from '@/services/bunny';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '';
    const apiKey = process.env.BUNNY_API_KEY || '';

    // Create a new video placeholder inside Bunny Stream via our backend
    const videoData = await createVideoPlaceholder(title);
    const videoId = videoData.guid;

    // We must generate a Secure Signature for TUS protocol to avoid passing API keys!
    // The signature must be SHA256 hash of <library_id><api_key><expiration_time><video_id>
    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hr expiration
    const rawSignature = `${libraryId}${apiKey}${expirationTime}${videoId}`;
    const signature = crypto.createHash('sha256').update(rawSignature).digest('hex');

    return NextResponse.json({
      success: true,
      videoId,
      libraryId,
      signature,
      expirationTime,
    });

  } catch (error: any) {
    console.error('Error creating Bunny video:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to create video on provider' },
      { status: 500 }
    );
  }
}
