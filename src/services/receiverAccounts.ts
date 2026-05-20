import api from '@/lib/api';
import { ApiResponse, ReceiverAccount } from '@/types/api';

const SUPER_ADMIN_API_URL = 'https://api.darab.academy/api/superAdmin';

export const getAdminReceiverAccounts = async (): Promise<ReceiverAccount[]> => {
  try {
    const response = await api.get<ApiResponse<ReceiverAccount[]>>('/receiver_accounts', {
      baseURL: SUPER_ADMIN_API_URL
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch admin receiver accounts:', error);
    return [];
  }
};

export const createAdminReceiverAccount = async (payload: Partial<ReceiverAccount>): Promise<ApiResponse<ReceiverAccount>> => {
  try {
    const response = await api.post<ApiResponse<ReceiverAccount>>('/receiver_accounts', payload, {
      baseURL: SUPER_ADMIN_API_URL
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to create admin receiver account:', error);
    throw error.response?.data || error;
  }
};

export const updateAdminReceiverAccount = async (id: number, payload: Partial<ReceiverAccount>): Promise<ApiResponse<ReceiverAccount>> => {
  try {
    const response = await api.put<ApiResponse<ReceiverAccount>>(`/receiver_accounts/${id}`, payload, {
      baseURL: SUPER_ADMIN_API_URL
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to update admin receiver account ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const deleteAdminReceiverAccount = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await api.delete<ApiResponse<any>>(`/receiver_accounts/${id}`, {
      baseURL: SUPER_ADMIN_API_URL
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to delete admin receiver account ${id}:`, error);
    throw error.response?.data || error;
  }
};
