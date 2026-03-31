import axios from 'axios';

export interface BunnyCollection {
  guid: string;
  name: string;
  videoCount: number;
  totalSize: number;
  previewVideoIds: string[] | null;
}

export const getCollections = async (libraryId: string, apiKey: string): Promise<BunnyCollection[]> => {
  const response = await axios.get(`https://video.bunnycdn.com/library/${libraryId}/collections`, {
    headers: {
      AccessKey: apiKey,
      accept: 'application/json',
    },
  });
  return response.data?.items || [];
};

export const createCollection = async (libraryId: string, apiKey: string, name: string): Promise<string> => {
  const response = await axios.post(
    `https://video.bunnycdn.com/library/${libraryId}/collections`,
    { name },
    {
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    }
  );
  return response.data?.guid;
};

export const getOrCreateCollection = async (libraryId: string, apiKey: string, subdomain: string): Promise<string> => {
  const collections = await getCollections(libraryId, apiKey);
  const existing = collections.find((c: BunnyCollection) => c.name.toLowerCase() === subdomain.toLowerCase());
  
  if (existing) {
    return existing.guid;
  }

  return createCollection(libraryId, apiKey, subdomain);
};

export const createVideoResource = async (
  libraryId: string, 
  apiKey: string, 
  title: string,
  collectionId?: string
) => {
  const response = await axios.post(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    { 
      title,
      ...(collectionId && { collectionId })
    },
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
  return {
    status: response.data?.status as number | undefined,
    encodeProgress: response.data?.encodeProgress as number | undefined
  };
};

export const waitForVideoReady = async (
  libraryId: string,
  apiKey: string,
  videoId: string,
  onStatus?: (progress: number) => void,
  maxAttempts = 80,
  delayMs = 3000
) => {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const data = await getVideoStatus(libraryId, apiKey, videoId);
    if (typeof data.status === 'number') {
      if (onStatus && typeof data.encodeProgress === 'number') {
        onStatus(data.encodeProgress);
      }
      if (data.status === 3 || data.status === 4) { // Finished or ready
        if (onStatus) onStatus(100);
        return;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error('Processing timeout');
};
