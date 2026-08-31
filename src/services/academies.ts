import api from '@/lib/api';
import { ApiResponse, Academy, CreateAcademyPayload, UpdateAcademyPayload } from '@/types/api';
import { getStoredAuthToken } from '@/lib/auth-storage';

const SUPER_ADMIN_API_URL = 'https://api.darab.academy/api/superAdmin';

export const getAcademies = async (): Promise<Academy[]> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.get<ApiResponse<Academy[]>>('/academies', {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (response.data && (response.data.status || response.data.success)) {
      return response.data.data || [];
    }
    return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Failed to fetch academies:', error);
    return [];
  }
};

export const getAcademyById = async (id: number): Promise<Academy | null> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.get<ApiResponse<Academy>>(`/academies/${id}`, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (response.data && (response.data.status || response.data.success)) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch academy ${id}:`, error);
    return null;
  }
};

export const createAcademy = async (payload: CreateAcademyPayload): Promise<ApiResponse<Academy>> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.post<ApiResponse<Academy>>('/academies', payload, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to create academy:', error);
    throw error.response?.data || error;
  }
};

export const updateAcademy = async (id: number, payload: Partial<UpdateAcademyPayload>): Promise<ApiResponse<Academy>> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.put<ApiResponse<Academy>>(`/academies/${id}`, payload, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to update academy ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const deleteAcademy = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const token = getStoredAuthToken();
    const response = await api.delete<ApiResponse<any>>(`/academies/${id}`, {
      baseURL: SUPER_ADMIN_API_URL,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to delete academy ${id}:`, error);
    throw error.response?.data || error;
  }
};
