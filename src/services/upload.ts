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

/**
 * Uploads a file locally to the server's public/uploads directory.
 * Used primarily by the page builder to bypass external CDN requirements.
 */
export const uploadFileLocal = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/upload/local', formData, {
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
    console.error('Local file upload failed:', error);
    throw error.response?.data || error;
  }
};


