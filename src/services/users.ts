import academyApi from '@/lib/academy-api';
import { ApiResponse, User } from '@/types/api';

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await academyApi.get<ApiResponse<User[]>>('users');
    return response.data.data || [];
  } catch (error: any) {
    console.error('Failed to get users:', error);
    return [];
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await academyApi.delete(`users/${id}`);
  } catch (error: any) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

export const createUser = async (payload: Partial<User>): Promise<User> => {
  try {
    const response = await academyApi.post<ApiResponse<User>>('users', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create user:', error);
    throw error.response?.data || error;
  }
};
