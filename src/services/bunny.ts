import axios from 'axios';

// Required environment variables:
// BUNNY_LIBRARY_ID - Found in Bunny Dashboard -> Stream -> Your Library
// BUNNY_API_KEY - The Video Library API Key (not the global account key!)

const BUNNY_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;

export interface BunnyVideoResponse {
  guid: string;
  title: string;
  availableResolutions: string;
  thumbnailFileName: string;
}

/**
 * Creates a video placeholder in Bunny Stream.
 * This must be called from Server/API route to protect the API key.
 */
export const createVideoPlaceholder = async (title: string): Promise<BunnyVideoResponse> => {
  if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
    throw new Error('Bunny integration requires BUNNY_LIBRARY_ID and BUNNY_API_KEY in environment variables.');
  }

  const response = await axios.post(
    `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
    { title },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessKey: BUNNY_API_KEY,
      },
    }
  );

  return response.data;
};
