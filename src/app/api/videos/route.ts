import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    console.log('Video URL received at backend:', videoUrl);
    
    // Here you would typically save this to your database
    // For now, we just return success
    return NextResponse.json({ success: true, url: videoUrl });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
