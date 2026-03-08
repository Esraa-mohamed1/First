import axios from 'axios';

export const createVideoResource = async (libraryId: string, apiKey: string, title: string) => {
  const response = await axios.post(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    { title },
    {
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/json',
      },
    }
  );
  const guid = response.data?.guid;
  if (!guid) {
    throw new Error('Missing guid');
  }
  return guid as string;
};

export const uploadVideoFile = async (
  libraryId: string,
  apiKey: string,
  videoId: string,
  file: File,
  onProgress?: (progress: number) => void
) => {
  await axios.put(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, file, {
    headers: {
      AccessKey: apiKey,
      'Content-Type': file.type || 'video/mp4',
    },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
};

export const getVideoStatus = async (libraryId: string, apiKey: string, videoId: string) => {
  const response = await axios.get(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
    headers: {
      AccessKey: apiKey,
    },
  });
  return response.data?.status as number | undefined;
};

export const waitForVideoReady = async (
  libraryId: string,
  apiKey: string,
  videoId: string,
  onStatus?: (status: number) => void,
  maxAttempts = 80,
  delayMs = 3000
) => {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const status = await getVideoStatus(libraryId, apiKey, videoId);
    if (typeof status === 'number') {
      if (onStatus) {
        onStatus(status);
      }
      if (status === 3) {
        return;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error('Processing timeout');
};
