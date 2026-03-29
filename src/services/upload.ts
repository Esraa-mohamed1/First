import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

export const uploadFile = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<ApiResponse<{ url: string }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });

    if (response.data.status && response.data.data?.url) {
      return response.data.data.url;
    }
    
    throw new Error('Upload failed: No URL returned');
  } catch (error: any) {
    console.error('File upload failed:', error);
    throw error.response?.data || error;
  }
};
