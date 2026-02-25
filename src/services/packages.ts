import api from '@/lib/api';
import { ApiResponse, Package } from '@/types/api';

export const getPackages = async (): Promise<Package[]> => {
  try {
    const response = await api.get<ApiResponse<Package[]>>('/packages');
    if (response.data.status) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch packages:', error);
    return [];
  }
};
