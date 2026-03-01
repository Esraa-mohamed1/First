import api from '@/lib/api';
import { ApiResponse, CreateAccountPayload } from '@/types/api';

export const createAccount = async (payload: CreateAccountPayload) => {
  try {
    const response = await api.post<ApiResponse<any>>('/create-account-academy', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create account:', error);
    throw error.response?.data || error;
  }
};

export const login = async (payload: any) => {
    try {
        const response = await api.post<ApiResponse<any>>('/login', payload);
        return response.data;
    } catch (error: any) {
        console.error('Failed to login:', error);
        throw error.response?.data || error;
    }
};
