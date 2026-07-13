import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Next.js API Route handler for local file uploads.
 * Saves the files to the public/uploads directory and returns a local relative URL.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate a unique file name using a timestamp to avoid naming collisions
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${timestamp}_${cleanFileName}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Define the destination directory: public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write the file to the local directory
    const filePath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(filePath, fileBuffer);

    // Build the relative URL that Next.js will serve statically
    const fileUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error: any) {
    console.error('Error uploading file locally:', error.message);
    return NextResponse.json(
      { error: `Failing to upload locally: ${error.message || 'Error occurred'}` },
      { status: 500 }
    );
  }
}
