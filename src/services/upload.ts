import axios from 'axios';

export const uploadFile = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/upload/bunny', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });

    if (response.data.success && response.data.url) {
      return response.data.url;
    }
    
    throw new Error(response.data.error || 'Upload failed: No URL returned');
  } catch (error: any) {
    console.error('File upload to Bunny Storage failed:', error);
    throw error.response?.data || error;
  }
};

