import { NextResponse } from 'next/server';
import { resolveSignedBunnyEmbedUrl } from '@/lib/bunny-embed';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId')?.trim();
    const libraryId =
      searchParams.get('libraryId')?.trim() ||
      process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID ||
      '';

    if (!videoId || !libraryId) {
      return NextResponse.json(
        { error: 'videoId and libraryId are required' },
        { status: 400 }
      );
    }

    const src = resolveSignedBunnyEmbedUrl(libraryId, videoId);
    return NextResponse.json({ src });
  } catch (error) {
    console.error('Failed to build embed URL:', error);
    return NextResponse.json(
      { error: 'Failed to build video embed URL' },
      { status: 500 }
    );
  }
}
