import studentApi from '@/lib/student-api';
import { ApiResponse } from '@/types/api';

export const registerStudent = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await studentApi.post<ApiResponse<any>>('/auth/register', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to register student:', error);
    throw error.response?.data || error;
  }
};

export const getStudentProfileStatus = async (): Promise<any> => {
  try {
    const response = await studentApi.get<any>('/me');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get student profile status:', error);
    throw error.response?.data || error;
  }
};

export const getStudentProfile = async (): Promise<any> => {
  try {
    const response = await studentApi.get<ApiResponse<any>>('profile');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get student profile:', error);
    throw error.response?.data || error;
  }
};

export const updateStudentProfile = async (payload: any): Promise<any> => {
  try {
    const response = await studentApi.post<ApiResponse<any>>('profile', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update student profile:', error);
    throw error.response?.data || error;
  }
};
