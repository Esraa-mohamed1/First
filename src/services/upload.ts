import api from '@/lib/api';
import { ApiResponse } from '@/types/api';

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Assuming the endpoint is /upload or /media/upload
    // We'll try /upload first
    const response = await api.post<ApiResponse<{ url: string }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
